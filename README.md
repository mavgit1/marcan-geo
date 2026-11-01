# marcan-geo

> ⚠ **PUBLIC REPOSITORY.** Everything committed here is mirrored to
> https://github.com/mavgit1/marcan-geo and published. Never commit
> unreleased data here; that belongs in `marcan-geo-internal`.

Map of email authentication (DMARC/SPF) for Swiss municipalities.

## Layout

| Path | What |
|---|---|
| `scanner/` | Rust CLI: registry, DNS scan, classification, public export |
| `site/` | SvelteKit static site, deployed to GitHub Pages |
| `site/scripts/build-geo.mjs` | Builds map geometry from swisstopo boundaries (once per edition) |
| `site/src/lib/data/public.json` | The reviewed public export, the only data file in this repo |
| `.githooks/pre-commit` | Blocks data files, wrong identity and local paths |

After cloning, enable the guard:

```
git config core.hooksPath .githooks
```

## Pipeline

Runs locally, in a checkout of `marcan-geo-internal` next to this one. Never in
GitHub Actions: logs and artifacts of a public repo are public.

```
cd ../marcan-geo-internal
S=../marcan-geo/scanner/target/release/marcan-geo
$S registry --out registry/2026-11-01.csv
$S scan     --registry registry/2026-11-01.csv --overrides overrides.csv --out scans/2026-11-01
$S classify --scan scans/2026-11-01 --registry registry/2026-11-01.csv --overrides overrides.csv
$S export   --scans scans --config export.toml --out ../marcan-geo/site/src/lib/data/public.json
```

`export.toml` sets the level of detail: `0` canton totals, `1` adds
per-municipality status, policy, SPF and history.

The scan only queries DNS through public resolvers (Google Public DNS, Quad9),
rate limited. It sends no mail and never connects to municipal servers.

## Classification

| Status | Rule |
|---|---|
| blocked | `p=reject`, no `pct` below 100, no `t=y` |
| filtered | `p=quarantine`, no `pct` below 100, no `t=y` |
| monitoring | `p=none`, or any policy with `pct` below 100 or `t=y` |
| none | no DMARC record, or an invalid one |
| unknown | no website, the mail domain receives no mail, or a DNS error |

Without a record at `_dmarc.<domain>`, the organizational domain's record
applies, with its `sp=` if set.

## Site

```
cd site
pnpm install
pnpm dev
```

Static output, no external requests, a strict Content Security Policy, no
cookies and no analytics. A push to `main` builds and deploys it.

## Data sources

- Municipalities: Federal Statistical Office (BFS), official commune register
- Websites: Wikidata
- Boundaries: © swisstopo, swissBOUNDARIES3D
