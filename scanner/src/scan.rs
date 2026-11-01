//! DNS scan. Writes every answer exactly as received to raw.jsonl; all
//! interpretation happens later in `classify`, without the network.
//!
//! Only DNS, through public resolvers, rate limited. Never connects to the
//! municipalities' own servers.

use std::collections::BTreeSet;
use std::io::Write;
use std::net::IpAddr;
use std::path::Path;
use std::sync::Arc;
use std::time::Duration;

use anyhow::{Result, bail};
use futures::stream::{self, StreamExt};
use hickory_resolver::config::{NameServerConfig, ResolverConfig};
use hickory_resolver::net::runtime::TokioRuntimeProvider;
use hickory_resolver::net::{DnsError, NetError};
use hickory_resolver::proto::op::ResponseCode;
use hickory_resolver::proto::rr::{RData, RecordType};
use hickory_resolver::{Resolver, TokioResolver};
use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;
use tokio::time::{Interval, MissedTickBehavior};

use crate::{classify, domain, registry};

/// Resolvers queried for every name. The first is primary for classification;
/// the second only cross-checks.
pub const RESOLVERS: [(&str, &str); 2] = [("google", "8.8.8.8"), ("quad9", "9.9.9.9")];

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RawAnswer {
    pub ts: chrono::DateTime<chrono::Utc>,
    pub resolver: String,
    pub qname: String,
    pub qtype: String,
    /// ok | nodata | nxdomain | servfail | timeout | error
    pub status: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub detail: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ttl: Option<u32>,
    #[serde(default)]
    pub records: Vec<String>,
}

#[derive(Serialize)]
struct Meta<'a> {
    scan_id: String,
    started: chrono::DateTime<chrono::Utc>,
    finished: chrono::DateTime<chrono::Utc>,
    scanner_version: &'a str,
    registry: String,
    resolvers: Vec<String>,
    domains: usize,
    queries: usize,
}

struct Limited {
    name: &'static str,
    resolver: TokioResolver,
    tick: Mutex<Interval>,
}

fn resolver(ip: &str, qps: u32) -> Result<(TokioResolver, Interval)> {
    let ip: IpAddr = ip.parse()?;
    let config = ResolverConfig::from_name_servers(vec![NameServerConfig::udp_and_tcp(ip)]);
    let mut b = Resolver::builder_with_config(config, TokioRuntimeProvider::default());
    let o = b.options_mut();
    o.timeout = Duration::from_secs(5);
    o.attempts = 2;
    o.ndots = 0;
    let mut tick = tokio::time::interval(Duration::from_secs(1) / qps.max(1));
    tick.set_missed_tick_behavior(MissedTickBehavior::Delay);
    Ok((b.build()?, tick))
}

async fn query(r: &Limited, qname: &str, qtype: RecordType) -> RawAnswer {
    r.tick.lock().await.tick().await;
    let fqdn = format!("{}.", qname.trim_end_matches('.'));
    let result = r.resolver.lookup(fqdn.as_str(), qtype).await;
    let mut a = RawAnswer {
        ts: chrono::Utc::now(),
        resolver: r.name.to_string(),
        qname: qname.to_string(),
        qtype: qtype.to_string(),
        status: "ok".into(),
        detail: None,
        ttl: None,
        records: vec![],
    };
    match result {
        Ok(lookup) => {
            for rec in lookup.answers() {
                let text = match &rec.data {
                    RData::TXT(t) => t
                        .txt_data
                        .iter()
                        .map(|s| String::from_utf8_lossy(s).into_owned())
                        .collect::<String>(),
                    RData::MX(m) => format!("{} {}", m.preference, m.exchange),
                    _ => continue,
                };
                a.ttl = Some(a.ttl.map_or(rec.ttl, |t: u32| t.min(rec.ttl)));
                a.records.push(text);
            }
            if a.records.is_empty() {
                a.status = "nodata".into();
            }
        }
        Err(NetError::Dns(DnsError::NoRecordsFound(nr))) => {
            a.status = if nr.response_code == ResponseCode::NXDomain { "nxdomain" } else { "nodata" }.into();
            a.ttl = nr.negative_ttl;
        }
        Err(NetError::Dns(DnsError::ResponseCode(rc))) => {
            a.status = if rc == ResponseCode::ServFail { "servfail" } else { "error" }.into();
            a.detail = Some(rc.to_string());
        }
        Err(NetError::Timeout) => a.status = "timeout".into(),
        Err(e) => {
            a.status = "error".into();
            a.detail = Some(e.to_string());
        }
    }
    a
}

/// Names to query for one mail domain before any answer is known.
fn first_pass(d: &str) -> Vec<(String, RecordType)> {
    let mut q = vec![
        (d.to_string(), RecordType::MX),
        (d.to_string(), RecordType::TXT),
        (format!("_dmarc.{d}"), RecordType::TXT),
    ];
    if let Some(org) = domain::organizational_domain(d).filter(|o| o != d) {
        q.push((format!("_dmarc.{org}"), RecordType::TXT));
    }
    q
}

pub async fn run(registry_path: &Path, overrides: Option<&Path>, out: &Path, qps: u32) -> Result<()> {
    if out.exists() {
        bail!("{} exists; raw scans are never overwritten", out.display());
    }
    let municipalities = registry::load(registry_path)?;
    let overrides = registry::load_overrides(overrides)?;
    let domains: BTreeSet<String> = municipalities
        .iter()
        .map(|m| registry::mail_domain(m, &overrides).0.to_string())
        .filter(|d| !d.is_empty())
        .collect();

    let resolvers: Vec<Arc<Limited>> = RESOLVERS
        .iter()
        .map(|(name, ip)| {
            let (resolver, tick) = resolver(ip, qps)?;
            Ok(Arc::new(Limited { name, resolver, tick: Mutex::new(tick) }))
        })
        .collect::<Result<_>>()?;

    std::fs::create_dir_all(out)?;
    let started = chrono::Utc::now();
    let mut file = std::io::BufWriter::new(std::fs::File::create(out.join("raw.jsonl"))?);
    let mut asked: BTreeSet<(String, RecordType)> = BTreeSet::new();
    let mut pending: BTreeSet<(String, RecordType)> = domains.iter().flat_map(|d| first_pass(d)).collect();
    let mut total = 0;

    // SPF redirect= targets are only known after the apex TXT answer, so
    // follow them in further passes (RFC 7208 caps lookups at 10).
    for pass in 0..6 {
        let batch: Vec<_> = pending.difference(&asked).cloned().collect();
        if batch.is_empty() {
            break;
        }
        asked.extend(batch.iter().cloned());
        eprintln!("pass {pass}: {} names x {} resolvers", batch.len(), resolvers.len());
        let jobs = batch
            .iter()
            .flat_map(|(q, t)| resolvers.iter().map(move |r| (r.clone(), q.clone(), *t)));
        let answers: Vec<RawAnswer> = stream::iter(jobs)
            .map(|(r, q, t)| async move { query(&r, &q, t).await })
            .buffer_unordered(32)
            .collect()
            .await;
        pending.clear();
        for a in &answers {
            serde_json::to_writer(&mut file, a)?;
            file.write_all(b"\n")?;
            total += 1;
            if a.qtype == "TXT" && a.resolver == RESOLVERS[0].0 && !a.qname.starts_with("_dmarc.") {
                for target in classify::spf_redirects(&a.records) {
                    pending.insert((target, RecordType::TXT));
                }
            }
        }
        eprintln!("  {} answers so far", total);
    }
    file.flush()?;

    let meta = Meta {
        scan_id: out.file_name().map(|s| s.to_string_lossy().into_owned()).unwrap_or_default(),
        started,
        finished: chrono::Utc::now(),
        scanner_version: env!("CARGO_PKG_VERSION"),
        registry: registry_path.display().to_string(),
        resolvers: RESOLVERS.iter().map(|(n, ip)| format!("{n} {ip}")).collect(),
        domains: domains.len(),
        queries: total,
    };
    std::fs::write(out.join("meta.json"), serde_json::to_string_pretty(&meta)?)?;
    eprintln!("scan: {} domains, {} answers -> {}", domains.len(), total, out.display());
    Ok(())
}
