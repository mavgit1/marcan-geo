//! Raw answers -> one status per municipality. Pure: no network, no clock.
//!
//! Status rules (CLASSIFIER_VERSION 2):
//! - blocked:    p=reject,     pct absent or 100, not t=y
//! - filtered:   p=quarantine, pct absent or 100, not t=y
//! - monitoring: p=none, or any policy with pct<100 or t=y (pct is gone in DMARCbis)
//! - none:       no DMARC record, or an invalid one (receivers ignore it)
//! - unknown:    no data: no website, the domain does not exist, or a DNS error
//!
//! A domain without MX is rated by its DMARC record like any other: a domain
//! that sends no mail can still be spoofed and should publish p=reject.
//!
//! Without a record at `_dmarc.<domain>`, the organizational domain's record
//! applies, with its `sp=` if set (RFC 7489 section 6.6.3).

use std::collections::HashMap;
use std::io::BufRead;
use std::path::Path;

use anyhow::{Context, Result};
use serde::Serialize;

use crate::registry::{self, Municipality};
use crate::scan::{RESOLVERS, RawAnswer};
use crate::domain;

pub const CLASSIFIER_VERSION: u32 = 2;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Status {
    Blocked,
    Filtered,
    Monitoring,
    None,
    Unknown,
}

impl Status {
    pub fn as_str(self) -> &'static str {
        match self {
            Status::Blocked => "blocked",
            Status::Filtered => "filtered",
            Status::Monitoring => "monitoring",
            Status::None => "none",
            Status::Unknown => "unknown",
        }
    }
}

#[derive(Debug, Default, Clone, PartialEq)]
pub struct Dmarc {
    pub p: Option<String>,
    pub sp: Option<String>,
    pub pct: Option<u32>,
    pub testing: bool,
    pub rua: bool,
}

/// One DMARC record parsed. `Err` carries why it is invalid.
pub fn parse_dmarc(raw: &str) -> Result<Dmarc, &'static str> {
    let mut tags = raw.split(';').map(str::trim).filter(|t| !t.is_empty());
    let first = tags.next().ok_or("empty")?;
    let (k, v) = first.split_once('=').ok_or("no v tag")?;
    if !k.trim().eq_ignore_ascii_case("v") || v.trim() != "DMARC1" {
        return Err("v tag not first or not DMARC1");
    }
    let mut d = Dmarc::default();
    let mut rua_valid = false;
    for t in tags {
        let (k, v) = t.split_once('=').ok_or("tag without =")?;
        let (k, v) = (k.trim().to_ascii_lowercase(), v.trim());
        match k.as_str() {
            "p" => d.p = Some(v.to_ascii_lowercase()),
            "sp" => d.sp = Some(v.to_ascii_lowercase()),
            "pct" => d.pct = v.parse().ok(),
            "t" => d.testing = v.eq_ignore_ascii_case("y"),
            "rua" => {
                d.rua = !v.is_empty();
                rua_valid = v.split(',').any(|u| u.trim().to_ascii_lowercase().starts_with("mailto:"));
            }
            _ => {}
        }
    }
    let known = |p: &Option<String>| matches!(p.as_deref(), Some("none" | "quarantine" | "reject"));
    if !known(&d.p) {
        // RFC 7489 6.6.3: a record without a usable p= but with a valid rua
        // is treated as p=none.
        if rua_valid {
            d.p = Some("none".into());
        } else {
            return Err("missing or unknown p");
        }
    }
    if d.sp.is_some() && !known(&d.sp) {
        d.sp = None;
    }
    Ok(d)
}

fn is_dmarc(r: &str) -> bool {
    let r = r.trim_start();
    match r.get(..8) {
        Some(head) if head.eq_ignore_ascii_case("v=DMARC1") => {
            let rest = r[8..].trim_start();
            rest.is_empty() || rest.starts_with(';')
        }
        _ => false,
    }
}

fn is_spf(r: &str) -> bool {
    let l = r.trim_start().to_ascii_lowercase();
    l == "v=spf1" || l.starts_with("v=spf1 ")
}

/// `redirect=` targets in a TXT answer's SPF record (used by the scan to
/// know what to query next).
pub fn spf_redirects(records: &[String]) -> Vec<String> {
    let spf: Vec<_> = records.iter().filter(|r| is_spf(r)).collect();
    if spf.len() != 1 {
        return vec![];
    }
    spf[0]
        .split_whitespace()
        .filter_map(|t| t.to_ascii_lowercase().strip_prefix("redirect=").map(|d| d.trim_end_matches('.').to_string()))
        .filter(|d| !d.is_empty() && !d.contains('%'))
        .collect()
}

/// strict (-all) | soft (~all) | neutral (?all) | pass_all (+all) | no_all |
/// missing | multiple | unresolved
pub fn spf_class(apex: &str, txt: &dyn Fn(&str) -> Option<Vec<String>>) -> &'static str {
    let mut name = apex.to_string();
    for hop in 0..6 {
        let Some(records) = txt(&name) else { return "unresolved" };
        let spf: Vec<_> = records.iter().filter(|r| is_spf(r)).collect();
        match spf.len() {
            0 => return if hop == 0 { "missing" } else { "unresolved" },
            1 => {}
            _ => return "multiple",
        }
        let terms: Vec<String> = spf[0].split_whitespace().map(str::to_ascii_lowercase).collect();
        if let Some(all) = terms.iter().find(|t| t.trim_start_matches(['+', '-', '~', '?']) == "all") {
            return match all.chars().next() {
                Some('-') => "strict",
                Some('~') => "soft",
                Some('?') => "neutral",
                _ => "pass_all",
            };
        }
        match terms.iter().find_map(|t| t.strip_prefix("redirect=")) {
            Some(target) => name = target.trim_end_matches('.').to_string(),
            None => return "no_all",
        }
    }
    "unresolved"
}

#[derive(Debug, Serialize)]
pub struct Row {
    pub bfs: u32,
    pub name: String,
    pub canton: String,
    pub canton_nr: u32,
    pub canton_name: String,
    pub web_domain: String,
    pub mail_domain: String,
    pub mail_domain_source: String,
    pub mx: String,
    pub dmarc_found_at: String,
    pub dmarc_p: String,
    pub dmarc_sp: String,
    pub dmarc_pct: String,
    pub dmarc_testing: bool,
    pub dmarc_rua: bool,
    pub dmarc_effective: String,
    pub spf: String,
    pub status: Status,
    pub status_reason: String,
    pub resolver_disagree: bool,
    pub scan_id: String,
    pub classifier_version: u32,
}

/// Answers keyed by (resolver, qname, qtype).
pub struct Answers(HashMap<(String, String, String), RawAnswer>);

impl Answers {
    pub fn load(path: &Path) -> Result<Self> {
        let f = std::io::BufReader::new(std::fs::File::open(path).with_context(|| format!("opening {}", path.display()))?);
        let mut map = HashMap::new();
        for line in f.lines() {
            let a: RawAnswer = serde_json::from_str(&line?)?;
            map.insert((a.resolver.clone(), a.qname.to_ascii_lowercase(), a.qtype.clone()), a);
        }
        Ok(Self(map))
    }

    fn get(&self, resolver: &str, qname: &str, qtype: &str) -> Option<&RawAnswer> {
        self.0.get(&(resolver.to_string(), qname.to_ascii_lowercase(), qtype.to_string()))
    }

    fn primary(&self, qname: &str, qtype: &str) -> Option<&RawAnswer> {
        self.get(RESOLVERS[0].0, qname, qtype)
    }

    /// Whether the resolvers disagree on any of the given queries.
    fn disagree(&self, queries: &[(String, &str)]) -> bool {
        let norm = |a: Option<&RawAnswer>| {
            a.map(|a| {
                let mut r = a.records.clone();
                r.sort();
                (a.status.clone(), r)
            })
        };
        queries.iter().any(|(q, t)| {
            let first = norm(self.get(RESOLVERS[0].0, q, t));
            RESOLVERS[1..].iter().any(|(r, _)| norm(self.get(r, q, t)) != first)
        })
    }
}

/// Classify one municipality from the primary resolver's answers.
pub fn classify(m: &Municipality, mail_domain: &str, source: &str, ans: &Answers, scan_id: &str) -> Row {
    let mut row = Row {
        bfs: m.bfs,
        name: m.name.clone(),
        canton: m.canton.clone(),
        canton_nr: m.canton_nr,
        canton_name: m.canton_name.clone(),
        web_domain: m.web_domain.clone(),
        mail_domain: mail_domain.to_string(),
        mail_domain_source: source.to_string(),
        mx: String::new(),
        dmarc_found_at: String::new(),
        dmarc_p: String::new(),
        dmarc_sp: String::new(),
        dmarc_pct: String::new(),
        dmarc_testing: false,
        dmarc_rua: false,
        dmarc_effective: String::new(),
        spf: String::new(),
        status: Status::Unknown,
        status_reason: String::new(),
        resolver_disagree: false,
        scan_id: scan_id.to_string(),
        classifier_version: CLASSIFIER_VERSION,
    };
    if mail_domain.is_empty() {
        row.status_reason = "no_website".into();
        return row;
    }
    let d = mail_domain;
    let org = domain::organizational_domain(d).filter(|o| o != d);

    // MX
    let mx = ans.primary(d, "MX");
    row.mx = match mx.map(|a| a.status.as_str()) {
        Some("ok") if mx.is_some_and(|a| a.records.len() == 1 && a.records[0].starts_with("0 .")) => "null",
        Some("ok") => "present",
        Some("nodata") => "none",
        Some("nxdomain") => "nxdomain",
        Some(_) => "error",
        None => "not_scanned",
    }
    .into();

    // SPF
    let txt = |name: &str| -> Option<Vec<String>> {
        match ans.primary(name, "TXT") {
            Some(a) if a.status == "ok" => Some(a.records.clone()),
            Some(a) if a.status == "nodata" || a.status == "nxdomain" => Some(vec![]),
            _ => None,
        }
    };
    row.spf = spf_class(d, &txt).into();

    // DMARC: exact name first, organizational domain as fallback.
    let dmarc_at = |name: &str| -> Result<Option<Result<Dmarc, &'static str>>, ()> {
        let Some(records) = txt(&format!("_dmarc.{name}")) else { return Err(()) };
        let found: Vec<_> = records.iter().filter(|r| is_dmarc(r)).collect();
        Ok(match found.len() {
            0 => None,
            1 => Some(parse_dmarc(found[0])),
            _ => Some(Err("multiple records")),
        })
    };
    let mut lookup_error = false;
    let mut found = match dmarc_at(d) {
        Ok(Some(r)) => Some(("exact", r)),
        Ok(None) => None,
        Err(()) => {
            lookup_error = true;
            None
        }
    };
    if found.is_none() && !lookup_error {
        if let Some(org) = &org {
            match dmarc_at(org) {
                Ok(Some(r)) => found = Some(("org", r)),
                Ok(None) => {}
                Err(()) => lookup_error = true,
            }
        }
    }

    let mut queries = vec![(d.to_string(), "MX"), (d.to_string(), "TXT"), (format!("_dmarc.{d}"), "TXT")];
    if let Some(org) = &org {
        queries.push((format!("_dmarc.{org}"), "TXT"));
    }
    row.resolver_disagree = ans.disagree(&queries);

    let (status, reason) = match &found {
        _ if lookup_error => (Status::Unknown, "dns_error".to_string()),
        None => (Status::None, "missing".into()),
        Some((_, Err(why))) => (Status::None, format!("invalid: {why}")),
        Some((at, Ok(dm))) => {
            row.dmarc_found_at = (*at).into();
            row.dmarc_p = dm.p.clone().unwrap_or_default();
            row.dmarc_sp = dm.sp.clone().unwrap_or_default();
            row.dmarc_pct = dm.pct.map(|p| p.to_string()).unwrap_or_default();
            row.dmarc_testing = dm.testing;
            row.dmarc_rua = dm.rua;
            // At the organizational domain, sp= governs subdomains.
            let effective = if *at == "org" { dm.sp.clone().or(dm.p.clone()) } else { dm.p.clone() };
            let effective = effective.unwrap_or_else(|| "none".into());
            row.dmarc_effective = effective.clone();
            let partial = dm.pct.is_some_and(|p| p < 100);
            let mut reasons = vec![];
            if *at == "org" {
                reasons.push("org_fallback".to_string());
            }
            let status = match effective.as_str() {
                "reject" | "quarantine" if partial => {
                    reasons.push(format!("pct={}", dm.pct.unwrap_or(0)));
                    Status::Monitoring
                }
                "reject" | "quarantine" if dm.testing => {
                    reasons.push("t=y".into());
                    Status::Monitoring
                }
                "reject" => Status::Blocked,
                "quarantine" => Status::Filtered,
                _ => Status::Monitoring,
            };
            (status, reasons.join(","))
        }
    };
    row.status = status;
    row.status_reason = reason;

    // A domain that does not exist or does not answer gives no data.
    if matches!(row.mx.as_str(), "nxdomain" | "error") {
        row.status_reason = format!("mx_{}", row.mx);
        row.status = Status::Unknown;
    }
    row
}

pub fn run(scan: &Path, registry_path: &Path, overrides: Option<&Path>) -> Result<()> {
    let municipalities = registry::load(registry_path)?;
    let overrides = registry::load_overrides(overrides)?;
    let answers = Answers::load(&scan.join("raw.jsonl"))?;
    let scan_id = scan.file_name().context("scan dir name")?.to_string_lossy().into_owned();
    let out = scan.join("classified.csv");
    let mut w = csv::Writer::from_path(&out)?;
    let mut counts: HashMap<&str, usize> = HashMap::new();
    for m in &municipalities {
        let (mail, source) = registry::mail_domain(m, &overrides);
        let row = classify(m, mail, source, &answers, &scan_id);
        *counts.entry(row.status.as_str()).or_default() += 1;
        w.serialize(&row)?;
    }
    w.flush()?;
    let mut c: Vec<_> = counts.into_iter().collect();
    c.sort();
    eprintln!("classify: {c:?} -> {}", out.display());
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn ans(entries: &[(&str, &str, &str, &[&str])]) -> Answers {
        let mut map = HashMap::new();
        for (resolver, q, t, recs) in entries {
            for r in [*resolver] {
                map.insert(
                    (r.to_string(), q.to_string(), t.to_string()),
                    RawAnswer {
                        ts: chrono::DateTime::UNIX_EPOCH,
                        resolver: r.to_string(),
                        qname: q.to_string(),
                        qtype: t.to_string(),
                        status: if recs.is_empty() { "nodata" } else { "ok" }.into(),
                        detail: None,
                        ttl: None,
                        records: recs.iter().map(|s| s.to_string()).collect(),
                    },
                );
            }
        }
        Answers(map)
    }

    fn muni(domain: &str) -> Municipality {
        Municipality {
            bfs: 1,
            name: "X".into(),
            canton: "ZH".into(),
            canton_nr: 1,
            canton_name: "Zürich".into(),
            website: format!("https://{domain}"),
            web_domain: domain.into(),
        }
    }

    /// Same answers from both resolvers.
    fn both(q: &'static str, t: &'static str, recs: &'static [&'static str]) -> [(&'static str, &'static str, &'static str, &'static [&'static str]); 2] {
        [("google", q, t, recs), ("quad9", q, t, recs)]
    }

    fn run_one(domain: &str, dmarc: &'static [&'static str], org: Option<(&'static str, &'static [&'static str])>) -> Row {
        let dq: &'static str = Box::leak(format!("_dmarc.{domain}").into_boxed_str());
        let d: &'static str = Box::leak(domain.to_string().into_boxed_str());
        let mut e: Vec<_> = vec![];
        e.extend(both(d, "MX", &["10 mx.example.ch."]));
        e.extend(both(d, "TXT", &["v=spf1 include:x -all"]));
        e.extend(both(dq, "TXT", dmarc));
        if let Some((oq, recs)) = org {
            e.extend(both(oq, "TXT", recs));
        }
        classify(&muni(domain), domain, "web", &ans(&e), "t")
    }

    #[test]
    fn policies() {
        assert_eq!(run_one("a.ch", &["v=DMARC1; p=reject; rua=mailto:x@a.ch"], None).status, Status::Blocked);
        assert_eq!(run_one("a.ch", &["v=DMARC1; p=quarantine"], None).status, Status::Filtered);
        assert_eq!(run_one("a.ch", &["v=DMARC1; p=none"], None).status, Status::Monitoring);
        assert_eq!(run_one("a.ch", &[], None).status, Status::None);
        assert_eq!(run_one("a.ch", &["unrelated"], None).status, Status::None);
    }

    #[test]
    fn pct_and_testing_are_monitoring() {
        let r = run_one("a.ch", &["v=DMARC1; p=reject; pct=50"], None);
        assert_eq!((r.status, r.status_reason.as_str()), (Status::Monitoring, "pct=50"));
        assert_eq!(run_one("a.ch", &["v=DMARC1; p=quarantine; pct=0"], None).status, Status::Monitoring);
        assert_eq!(run_one("a.ch", &["v=DMARC1; p=reject; pct=100"], None).status, Status::Blocked);
        assert_eq!(run_one("a.ch", &["v=DMARC1; p=reject; t=y"], None).status, Status::Monitoring);
    }

    #[test]
    fn invalid_records() {
        assert_eq!(run_one("a.ch", &["v=DMARC1; p=reject", "v=DMARC1; p=none"], None).status_reason, "invalid: multiple records");
        assert_eq!(run_one("a.ch", &["v=DMARC1; p=bogus"], None).status, Status::None);
        assert_eq!(run_one("a.ch", &["v=DMARC1; rua=mailto:r@a.ch"], None).status, Status::Monitoring);
        assert_eq!(run_one("a.ch", &["v=DMARC1; p reject"], None).status, Status::None);
    }

    #[test]
    fn org_fallback_uses_sp() {
        let r = run_one("x.ne.ch", &[], Some(("_dmarc.ne.ch", &["v=DMARC1; p=reject; sp=quarantine"])));
        assert_eq!((r.status, r.dmarc_found_at.as_str()), (Status::Filtered, "org"));
        let r = run_one("x.ne.ch", &[], Some(("_dmarc.ne.ch", &["v=DMARC1; p=reject"])));
        assert_eq!(r.status, Status::Blocked);
        let r = run_one("x.ne.ch", &["v=DMARC1; p=none"], Some(("_dmarc.ne.ch", &["v=DMARC1; p=reject"])));
        assert_eq!(r.status, Status::Monitoring);
    }

    #[test]
    fn no_mx_still_rated_by_dmarc() {
        let e: Vec<_> = [both("a.ch", "MX", &[]), both("_dmarc.a.ch", "TXT", &["v=DMARC1; p=reject"])].concat();
        let r = classify(&muni("a.ch"), "a.ch", "web", &ans(&e), "t");
        assert_eq!((r.status, r.mx.as_str()), (Status::Blocked, "none"));
        let e: Vec<_> = [both("a.ch", "MX", &["0 ."]), both("_dmarc.a.ch", "TXT", &[])].concat();
        let r = classify(&muni("a.ch"), "a.ch", "web", &ans(&e), "t");
        assert_eq!((r.status, r.mx.as_str()), (Status::None, "null"));
    }

    #[test]
    fn missing_domain_is_unknown() {
        let mut a = ans(&[]);
        for r in ["google", "quad9"] {
            a.0.insert(
                (r.into(), "gone.ch".into(), "MX".into()),
                RawAnswer { ts: chrono::DateTime::UNIX_EPOCH, resolver: r.into(), qname: "gone.ch".into(), qtype: "MX".into(), status: "nxdomain".into(), detail: None, ttl: None, records: vec![] },
            );
        }
        let r = classify(&muni("gone.ch"), "gone.ch", "web", &a, "t");
        assert_eq!((r.status, r.status_reason.as_str()), (Status::Unknown, "mx_nxdomain"));
    }

    #[test]
    fn spf_classes() {
        let recs: HashMap<&str, Vec<String>> = [
            ("a.ch", vec!["v=spf1 mx -all".to_string()]),
            ("b.ch", vec!["v=spf1 redirect=spf.c.ch".to_string()]),
            ("spf.c.ch", vec!["v=spf1 ip4:1.2.3.4 ~all".to_string()]),
            ("d.ch", vec!["v=spf1 -all".into(), "v=spf1 ~all".into()]),
            ("e.ch", vec!["google-site-verification=x".to_string()]),
            ("f.ch", vec!["v=spf1 mx".to_string()]),
            ("g.ch", vec!["v=spf1 +all".to_string()]),
        ]
        .into_iter()
        .collect();
        let txt = |n: &str| recs.get(n).cloned();
        assert_eq!(spf_class("a.ch", &txt), "strict");
        assert_eq!(spf_class("b.ch", &txt), "soft");
        assert_eq!(spf_class("d.ch", &txt), "multiple");
        assert_eq!(spf_class("e.ch", &txt), "missing");
        assert_eq!(spf_class("f.ch", &txt), "no_all");
        assert_eq!(spf_class("g.ch", &txt), "pass_all");
        assert_eq!(spf_class("zz.ch", &txt), "unresolved");
        assert_eq!(spf_redirects(&recs["b.ch"]), vec!["spf.c.ch"]);
    }

    #[test]
    fn disagreement_flagged() {
        let mut e: Vec<_> = vec![];
        e.extend(both("a.ch", "MX", &["10 mx.a.ch."]));
        e.push(("google", "_dmarc.a.ch", "TXT", &["v=DMARC1; p=reject"]));
        e.push(("quad9", "_dmarc.a.ch", "TXT", &["v=DMARC1; p=none"]));
        assert!(classify(&muni("a.ch"), "a.ch", "web", &ans(&e), "t").resolver_disagree);
    }
}
