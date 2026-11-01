//! marcan-geo: registry, DNS scan, classification and public export for the
//! Swiss municipal email authentication observatory.
//!
//! Each step reads only the previous step's files:
//! registry -> scan (raw.jsonl, never edited) -> classify -> export.

mod classify;
mod domain;
mod export;
mod registry;
mod scan;

use std::path::PathBuf;

use anyhow::Result;
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(version, about)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Build a municipality registry: BFS commune list joined with Wikidata websites.
    Registry {
        /// Reference date for the BFS snapshot (YYYY-MM-DD), default today.
        #[arg(long)]
        date: Option<chrono::NaiveDate>,
        /// Output CSV.
        #[arg(long)]
        out: PathBuf,
    },
    /// Query MX, SPF and DMARC records for every municipality's mail domain.
    Scan {
        #[arg(long)]
        registry: PathBuf,
        /// Inventory CSV (bfs,mail_domain,also,note,source,checked). Municipalities
        /// missing from it fall back to their website domain.
        #[arg(long, alias = "inventory")]
        overrides: Option<PathBuf>,
        /// Output directory, e.g. scans/2026-11-01. Must not exist yet.
        #[arg(long)]
        out: PathBuf,
        /// Queries per second, per resolver.
        #[arg(long, default_value_t = 10)]
        qps: u32,
    },
    /// Turn a scan's raw answers into one status row per municipality. No network.
    Classify {
        /// Scan directory containing raw.jsonl.
        #[arg(long)]
        scan: PathBuf,
        #[arg(long)]
        registry: PathBuf,
        #[arg(long, alias = "inventory")]
        overrides: Option<PathBuf>,
    },
    /// Write the public data file from all classified scans, limited by export.toml.
    Export {
        /// Directory containing one subdirectory per scan.
        #[arg(long)]
        scans: PathBuf,
        /// Export configuration (level of detail).
        #[arg(long)]
        config: PathBuf,
        /// Output JSON file.
        #[arg(long)]
        out: PathBuf,
    },
}

fn main() -> Result<()> {
    match Cli::parse().command {
        Command::Registry { date, out } => {
            let date = date.unwrap_or_else(|| chrono::Local::now().date_naive());
            registry::build(date, &out)
        }
        Command::Scan {
            registry,
            overrides,
            out,
            qps,
        } => {
            let rt = tokio::runtime::Runtime::new()?;
            rt.block_on(scan::run(&registry, overrides.as_deref(), &out, qps))
        }
        Command::Classify {
            scan,
            registry,
            overrides,
        } => classify::run(&scan, &registry, overrides.as_deref()),
        Command::Export { scans, config, out } => export::run(&scans, &config, &out),
    }
}
