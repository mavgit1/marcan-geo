# marcan-geo

How well do Swiss municipalities protect their sender address against
spoofing? This project measures the DMARC and SPF records of all 2,110 Swiss
municipalities and publishes the results as a map.

Site: https://mavgit1.github.io/marcan-geo/

## How it works

1. **Registry.** The list of municipalities comes from the Federal Statistical
   Office's official commune register, their websites from Wikidata. Each
   municipality's mail domain comes from a checked inventory: usually the
   website's domain, or the domain of its published address where there is
   evidence that it differs. Further domains of a municipality (such as the
   website's) are scanned too, and the least protected one counts.
2. **Scan.** For each domain, MX, SPF and DMARC records are queried through
   Google Public DNS and Quad9 at a limited rate. No mail is sent and no
   connection is made to municipal servers.
3. **Classification.** Each municipality gets one status from the raw answers.
4. **Export and site.** Totals per canton and over time go into a static site.

## Classification

| Status | Rule |
|---|---|
| Spoofing blocked | `p=reject`, no `pct` below 100, no `t=y` |
| Spoofing filtered | `p=quarantine`, no `pct` below 100, no `t=y` |
| Monitoring only | `p=none`, or any policy with `pct` below 100 or `t=y` |
| No DMARC | no DMARC record, or an invalid one |
| No data | no known website or domain, or a DNS error |

A domain that receives no mail still needs DMARC: anyone can send mail in its
name, so it should publish `p=reject`. Without a record at `_dmarc.<domain>`,
the organizational domain's record applies, with its `sp=` if set.

Not measured: DKIM (selectors are not public), actual delivery, population.

## Layout

| Path | What |
|---|---|
| `scanner/` | Rust command-line tool: registry, scan, classify, export |
| `site/` | SvelteKit static site (DE/FR/IT/EN) |
| `site/scripts/build-geo.mjs` | Map geometry from swisstopo boundaries |
| `site/src/lib/data/public.json` | Published data |

```
cd scanner && cargo build --release && ./target/release/marcan-geo --help
cd site && pnpm install && pnpm dev
```

The site is fully static: no external requests, a strict Content Security
Policy, no cookies, no analytics.

## Corrections

Is your municipality's mail domain wrong? Please open an issue.

## Sources

- Municipalities: Federal Statistical Office (BFS), official commune register
- Websites: Wikidata
- Boundaries: © swisstopo, swissBOUNDARIES3D
