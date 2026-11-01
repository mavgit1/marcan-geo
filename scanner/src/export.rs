//! Export for the site. The config's `level` sets the level of detail;
//! everything above that level is left out.

use std::collections::BTreeMap;
use std::path::Path;

use anyhow::{Context, Result, bail};
use serde::{Deserialize, Serialize};

const STATUSES: [&str; 5] = ["blocked", "filtered", "monitoring", "none", "unknown"];

#[derive(Deserialize)]
struct Config {
    /// 0: national and canton totals. 1: also per-municipality status,
    /// DMARC policy, SPF and history.
    level: u8,
    /// Scans in which canton sizes may change (mergers, usually on 1 January).
    /// Any other change stops the export: it points to a registry error.
    #[serde(default)]
    accept_count_changes: Vec<String>,
}

/// The classified.csv columns the export may read.
#[derive(Deserialize)]
struct Classified {
    bfs: u32,
    name: String,
    canton: String,
    canton_nr: u32,
    canton_name: String,
    dmarc_found_at: String,
    dmarc_effective: String,
    dmarc_pct: String,
    dmarc_testing: bool,
    spf: String,
    status: String,
    status_reason: String,
    mail_domain: String,
    #[serde(default)]
    mail_status: String,
    #[serde(default)]
    also: String,
    classifier_version: u32,
}

type Counts = [u32; 5];

#[derive(Serialize)]
struct Canton {
    nr: u32,
    code: String,
    name: String,
    series: Vec<Counts>,
}

/// One domain of a municipality: name, status of that domain alone, policy.
#[derive(Serialize)]
struct Domain {
    domain: String,
    status: String,
    policy: String,
}

#[derive(Serialize)]
struct Muni {
    bfs: u32,
    name: String,
    canton: String,
    /// The weakest of `domains`, which is what counts.
    status: String,
    /// The mail domain first, then further domains (website, former names).
    domains: Vec<Domain>,
    spf: String,
    /// (scan index, status) at each scan where the status changed.
    history: Vec<(usize, String)>,
}

#[derive(Serialize)]
struct Public {
    level: u8,
    classifier_version: u32,
    statuses: [&'static str; 5],
    scans: Vec<String>,
    national: Vec<Counts>,
    cantons: Vec<Canton>,
    #[serde(skip_serializing_if = "Option::is_none")]
    municipalities: Option<Vec<Muni>>,
}

fn domains(c: &Classified) -> Vec<Domain> {
    let mut v = vec![];
    if !c.mail_domain.is_empty() {
        let status = if c.mail_status.is_empty() { c.status.clone() } else { c.mail_status.clone() };
        v.push(Domain { domain: c.mail_domain.clone(), status, policy: policy(c) });
    }
    for entry in c.also.split(';').filter(|e| !e.is_empty()) {
        let mut it = entry.splitn(3, '=');
        let (Some(domain), Some(status)) = (it.next(), it.next()) else { continue };
        let p = it.next().unwrap_or("");
        let policy = if p.is_empty() { String::new() } else { format!("p={p}") };
        v.push(Domain { domain: domain.into(), status: status.into(), policy });
    }
    v
}

fn policy(c: &Classified) -> String {
    if c.status_reason.starts_with("invalid") {
        return "invalid record".into();
    }
    if c.dmarc_effective.is_empty() {
        return String::new();
    }
    let mut s = format!("p={}", c.dmarc_effective);
    if !c.dmarc_pct.is_empty() && c.dmarc_pct != "100" {
        s += &format!("; pct={}", c.dmarc_pct);
    }
    if c.dmarc_testing {
        s += "; t=y";
    }
    if c.dmarc_found_at == "org" {
        s += " (organizational domain)";
    }
    s
}

pub fn run(scans_dir: &Path, config: &Path, out: &Path) -> Result<()> {
    let config: Config = toml::from_str(&std::fs::read_to_string(config)?)?;
    if config.level > 1 {
        bail!("export level {} is not defined", config.level);
    }

    let mut scan_dirs: Vec<_> = std::fs::read_dir(scans_dir)?
        .filter_map(|e| e.ok())
        .map(|e| e.path())
        .filter(|p| p.join("classified.csv").exists())
        .collect();
    scan_dirs.sort();
    if scan_dirs.is_empty() {
        bail!("no classified scans in {}", scans_dir.display());
    }

    let mut scans = vec![];
    let mut national = vec![];
    let mut cantons: BTreeMap<u32, Canton> = BTreeMap::new();
    let mut munis: BTreeMap<u32, Muni> = BTreeMap::new();
    let mut version = 0;

    for (i, dir) in scan_dirs.iter().enumerate() {
        scans.push(dir.file_name().context("scan name")?.to_string_lossy().into_owned());
        let mut total: Counts = [0; 5];
        let mut seen = std::collections::HashSet::new();
        for r in csv::Reader::from_path(dir.join("classified.csv"))?.deserialize() {
            let c: Classified = r?;
            version = c.classifier_version;
            let idx = STATUSES.iter().position(|s| *s == c.status).context("unknown status")?;
            total[idx] += 1;
            let canton = cantons.entry(c.canton_nr).or_insert_with(|| Canton {
                nr: c.canton_nr,
                code: c.canton.clone(),
                name: c.canton_name.clone(),
                series: vec![],
            });
            canton.series.resize(i + 1, [0; 5]);
            canton.series[i][idx] += 1;

            seen.insert(c.bfs);
            let m = munis.entry(c.bfs).or_insert_with(|| Muni {
                bfs: c.bfs,
                name: c.name.clone(),
                canton: c.canton.clone(),
                status: String::new(),
                domains: vec![],
                spf: String::new(),
                history: vec![],
            });
            if m.history.last().map(|(_, s)| s.as_str()) != Some(c.status.as_str()) {
                m.history.push((i, c.status.clone()));
            }
            m.name = c.name.clone();
            m.domains = domains(&c);
            m.spf = c.spf.clone();
            m.status = c.status.clone();
        }
        national.push(total);
        for canton in cantons.values_mut() {
            canton.series.resize(i + 1, [0; 5]);
        }
        // Merged-away municipalities stay out of the latest view.
        if i + 1 == scan_dirs.len() {
            munis.retain(|bfs, _| seen.contains(bfs));
        }
    }

    for (i, scan) in scans.iter().enumerate().skip(1) {
        let changed: Vec<String> = cantons
            .values()
            .filter(|c| c.series[i].iter().sum::<u32>() != c.series[i - 1].iter().sum::<u32>())
            .map(|c| format!("{} {}->{}", c.code, c.series[i - 1].iter().sum::<u32>(), c.series[i].iter().sum::<u32>()))
            .collect();
        if !changed.is_empty() && !config.accept_count_changes.contains(scan) {
            bail!(
                "canton sizes changed in scan {scan}: {}. If these are mergers, add \"{scan}\" to accept_count_changes in the export config.",
                changed.join(", ")
            );
        }
    }

    let public = Public {
        level: config.level,
        classifier_version: version,
        statuses: STATUSES,
        scans,
        national,
        cantons: cantons.into_values().collect(),
        municipalities: (config.level >= 1).then(|| munis.into_values().collect()),
    };
    std::fs::write(out, serde_json::to_string(&public)?)?;
    eprintln!(
        "export: level {}, {} scans -> {}",
        public.level,
        public.scans.len(),
        out.display()
    );
    Ok(())
}
