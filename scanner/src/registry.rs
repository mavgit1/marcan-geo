//! Registry: the official BFS commune list (identity) joined with Wikidata
//! (official websites). Corrections go in the overrides file, not here.

use std::collections::{BTreeMap, HashMap};
use std::io::Read;
use std::path::Path;

use anyhow::{Context, Result, bail};
use serde::{Deserialize, Serialize};

use crate::domain;

/// Descriptive but anonymous: no name, address, account or repository URL.
const USER_AGENT: &str = concat!("marcan-geo/", env!("CARGO_PKG_VERSION"), " (municipal email authentication survey)");

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Municipality {
    pub bfs: u32,
    pub name: String,
    pub canton: String,
    pub canton_nr: u32,
    pub canton_name: String,
    pub website: String,
    pub web_domain: String,
}

/// `note` and `source` document the correction for people; the scanner only
/// uses `mail_domain`.
#[allow(dead_code)]
#[derive(Debug, Clone, Deserialize)]
pub struct Override {
    pub bfs: u32,
    #[serde(default)]
    pub mail_domain: String,
    #[serde(default)]
    pub note: String,
    #[serde(default)]
    pub source: String,
}

pub fn load(path: &Path) -> Result<Vec<Municipality>> {
    let mut rows = Vec::new();
    for r in csv::Reader::from_path(path).with_context(|| format!("reading {}", path.display()))?.deserialize() {
        rows.push(r?);
    }
    Ok(rows)
}

pub fn load_overrides(path: Option<&Path>) -> Result<HashMap<u32, Override>> {
    let Some(path) = path else { return Ok(HashMap::new()) };
    let mut map = HashMap::new();
    let mut rdr = csv::ReaderBuilder::new().comment(Some(b'#')).from_path(path)?;
    for r in rdr.deserialize() {
        let o: Override = r?;
        map.insert(o.bfs, o);
    }
    Ok(map)
}

/// Mail domain to scan and where it came from.
pub fn mail_domain<'a>(m: &'a Municipality, overrides: &'a HashMap<u32, Override>) -> (&'a str, &'static str) {
    match overrides.get(&m.bfs) {
        Some(o) if !o.mail_domain.is_empty() => (o.mail_domain.as_str(), "override"),
        _ => (m.web_domain.as_str(), "web"),
    }
}

fn get(url: &str) -> Result<String> {
    let mut body = String::new();
    ureq::get(url)
        .header("User-Agent", USER_AGENT)
        .call()?
        .into_body()
        .into_reader()
        .read_to_string(&mut body)?;
    Ok(body)
}

#[derive(Deserialize)]
struct AgvRow {
    #[serde(rename = "HistoricalCode")]
    historical: u32,
    #[serde(rename = "BfsCode")]
    bfs: u32,
    #[serde(rename = "Level")]
    level: u8,
    #[serde(rename = "Parent")]
    parent: Option<u32>,
    #[serde(rename = "Name")]
    name: String,
    #[serde(rename = "ShortName")]
    short: String,
}

/// Websites per BFS number from Wikidata, shortest URL first.
fn wikidata_websites() -> Result<HashMap<u32, Vec<String>>> {
    let query = r#"SELECT ?bfs ?site WHERE {
  ?m wdt:P31 wd:Q70208; wdt:P771 ?bfs; wdt:P856 ?site.
  FILTER NOT EXISTS { ?m wdt:P576 [] }
}"#;
    let url = format!(
        "https://query.wikidata.org/sparql?format=json&query={}",
        urlencode(query)
    );
    let body: serde_json::Value = serde_json::from_str(&get(&url)?)?;
    let mut sites: HashMap<u32, Vec<String>> = HashMap::new();
    for b in body["results"]["bindings"].as_array().context("wikidata: no bindings")? {
        let (Some(bfs), Some(site)) = (b["bfs"]["value"].as_str(), b["site"]["value"].as_str()) else { continue };
        if let Ok(bfs) = bfs.trim().parse() {
            sites.entry(bfs).or_default().push(site.to_string());
        }
    }
    for v in sites.values_mut() {
        v.sort_by_key(|s| (s.len(), s.clone()));
        v.dedup();
    }
    Ok(sites)
}

fn urlencode(s: &str) -> String {
    s.bytes()
        .map(|b| match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => (b as char).to_string(),
            _ => format!("%{b:02X}"),
        })
        .collect()
}

pub fn build(date: chrono::NaiveDate, out: &Path) -> Result<()> {
    let agv_url = format!(
        "https://www.agvchapp.bfs.admin.ch/api/communes/snapshot?date={}",
        date.format("%d-%m-%Y")
    );
    let agv = get(&agv_url)?;
    let rows: Vec<AgvRow> = csv::Reader::from_reader(agv.trim_start_matches('\u{feff}').as_bytes())
        .deserialize()
        .collect::<Result<_, _>>()?;
    let by_hist: HashMap<u32, &AgvRow> = rows.iter().map(|r| (r.historical, r)).collect();
    let sites = wikidata_websites()?;

    let mut out_rows = BTreeMap::new();
    for r in rows.iter().filter(|r| r.level == 3) {
        let mut up = r;
        while up.level != 1 {
            up = by_hist
                .get(&up.parent.context("commune without canton")?)
                .context("dangling parent")?;
        }
        let website = sites.get(&r.bfs).and_then(|v| v.first()).cloned().unwrap_or_default();
        let web_domain = domain::web_domain(&website).unwrap_or_default();
        out_rows.insert(
            r.bfs,
            Municipality {
                bfs: r.bfs,
                name: r.name.clone(),
                canton: up.short.clone(),
                canton_nr: up.bfs,
                canton_name: up.name.clone(),
                website,
                web_domain,
            },
        );
    }
    if out_rows.len() < 2000 {
        bail!("only {} communes in the BFS snapshot; refusing to write", out_rows.len());
    }

    let mut w = csv::Writer::from_path(out)?;
    let mut no_site = 0;
    for m in out_rows.values() {
        no_site += usize::from(m.website.is_empty());
        w.serialize(m)?;
    }
    w.flush()?;
    eprintln!(
        "registry: {} municipalities ({} without website) -> {}",
        out_rows.len(),
        no_site,
        out.display()
    );
    Ok(())
}
