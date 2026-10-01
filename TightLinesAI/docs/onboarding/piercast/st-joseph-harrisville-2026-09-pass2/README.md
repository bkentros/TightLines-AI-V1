# St. Joseph–Harrisville PierCast Pass 2

Private research-only numeric admission and full-year Formula v3 calibration package, reviewed 2026-09-19.

## Reproduce

```bash
node docs/onboarding/piercast/st-joseph-harrisville-2026-09-pass2/generate-pass2.mjs
node docs/onboarding/piercast/st-joseph-harrisville-2026-09-pass2/generate-pass2.mjs --check
```

## Key outputs

- `PASS2_REPORT.md` and `DUE_DILIGENCE_REVIEW.md`
- `pair-decisions.json` — all 95 reopened cells
- `private-mode-calibrations.json` — private Grade A/B modes only
- `calibration-anchors.json` and `cross-city-rankings.csv`
- `full-year-daily-audit.csv` — all numeric pairs × 365 dates × five thermal fits
- `monthly-checkpoints.csv` and `score-summary.csv`
- `all-species-peak-matrix.csv` and `research-holds-and-exclusions.csv`
- `michigan-quantitative-calibration.csv`
- `lake-trout-due-diligence.json` and `atlantic-salmon-review.json`
- `regulation-access-decisions.json`, `source-ledger.json`, and `validation-report.json`

Bluegill is retained only as a completed audit cell and is excluded from every user-facing/private numeric roster. This package changes no runtime, migration, manifest, deployment, or build state.
