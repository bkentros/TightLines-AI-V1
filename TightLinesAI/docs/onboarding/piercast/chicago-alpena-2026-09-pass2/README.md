# Chicago–Alpena PierCast onboarding, Pass 2

Completed: **2026-09-19**

Status: **private research calibration only**

## Outputs

| File | Purpose |
|---|---|
| `PASS2_REPORT.md` | Full decision, all 95 species results, peak scores, calibration rationale, holds, cross-city checks, and full-year audit. |
| `DUE_DILIGENCE_REVIEW.md` | Full all-city comparison, nine revisions, retained high-score findings, and Alpena salmonid resolution. |
| `due-diligence-review.csv` | Row-by-row review of all 95 cells with prior/current peaks, outcome, anchors, and finding. |
| `pair-decisions.json` | All 95 Grade A/B/C/D decisions with source IDs, numeric rationale, and anchor placement. |
| `private-mode-calibrations.json` | The 55 private numeric pairs and 83 evidence-backed Formula v3 modes. |
| `all-species-peak-matrix.csv` | Every species for every city, including explicit unscored holds and exclusions. |
| `score-summary.csv` | Peak date/mode, good/excellent days, floors, closures, and year-seam result. |
| `full-year-daily-audit.csv` | All 20,075 daily pair rows with scores at `T=0`, `0.5`, and `1`. |
| `monthly-checkpoints.csv` | Midmonth inspection rows for every numeric pair. |
| `calibration-anchors.json` | Named stronger/weaker same-species comparisons for all numeric pairs. |
| `cross-city-rankings.csv` | Established, prior-private, and new private peaks ranked within species. |
| `michigan-quantitative-calibration.csv` | Reproducible full, modern, and recent port × Pier/Dock magnitude anchors. |
| `research-holds-and-exclusions.csv` | All 40 unscored decisions and the evidence needed to change them. |
| `source-ledger.json` | Standalone normalized 37-source evidence ledger, including current Alpena stocking, catch, seasonal, and regulation sources. |
| `validation-report.json` | Machine-readable coverage, closure, seam, and invariant result. |
| `generate-pass2.mjs` | Deterministic generator and validator. |

## Reproduce

From the repository root:

```sh
node docs/onboarding/piercast/chicago-alpena-2026-09-pass2/generate-pass2.mjs
```

Expected result: 95 decisions, 55 numeric pairs, 23 Grade C holds, 17 Grade D exclusions, 83 modes, 20,075 daily rows, and zero invariant failures.

The reviewed decision and calibration artifacts feed the private owner Formula v3 configuration. Public visibility remains disabled.
