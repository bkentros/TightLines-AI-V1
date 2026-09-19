# Chicago–Alpena PierCast onboarding, Pass 1

Research lock: **2026-09-18**

This directory is the complete Pass 1 evidence package for Chicago, Michigan City, Muskegon, Whitehall, and Alpena. It contains no numeric PierCast scores, runtime inputs, public-manifest changes, artwork, or deployment changes.

## Files

| File | Purpose |
|---|---|
| `PASS1_REPORT.md` | Human-readable findings, boundaries, full 5×19 matrix, seasonal priorities, limitations, and readiness conclusion. |
| `PASS2_HANDOFF.md` | Ordered quantification work and admission gates for Pass 2. |
| `site-boundaries.json` | Included/excluded geography, ownership, routes, closures, and release-time verification tasks. |
| `source-ledger.json` | Normalized 32-source ledger with publisher, date, URL, geography, mode, claim, use, and limitation. |
| `species-decisions.json` | All 95 city/species decisions with evidence claims, sources, and next-evidence requirements. |
| `species-decision-matrix.csv` | Flat review copy of the 95 decisions. |
| `out-of-catalog-leads.json` | Nine separate leads; no catalog action is authorized. |
| `michigan-pier-dock-raw.csv` | Preserved 6,253-row Michigan DNR port × Pier/Dock dashboard extract through 2022. |
| `michigan-pier-dock-evidence.csv` | Reproducible species/port recurrence summary that distinguishes positive, explicit-zero, and missing years. |
| `validation-report.json` | Structural validation result and raw-extract checksum. |
| `generate-pass1.mjs` | Deterministic generator and validation script. |

## Reproduce

From the repository root:

```sh
node docs/onboarding/piercast/chicago-alpena-2026-09-pass1/generate-pass1.mjs
```

Expected decision count:

```json
{
  "research_candidate": 62,
  "hold": 16,
  "exclude": 17
}
```

The raw Michigan extract SHA-256 must remain:

```text
d0c5e7ac925ec77066a6f6edee96e6fadb1c46fa2f4d0275a632e93f4d11c5da
```
