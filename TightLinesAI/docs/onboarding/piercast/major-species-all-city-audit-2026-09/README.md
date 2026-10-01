# PierCast major-species all-city calibration audit

This package audits every PierCast city across Chinook salmon, coho salmon,
Atlantic salmon, steelhead, brown trout, lake trout, and freshwater drum.

Run the deterministic audit from the repository root:

```bash
npm run audit:pier-cast:major-species-all-cities
npm run check:pier-cast:major-species-all-cities
```

The generator reads the production-shaped Formula v3 calibration and the full
owner-review catalog, evaluates every numeric pair on all 365 dates at thermal
fits 0, 0.5, and 1, checks score bounds and monotonicity, and regenerates the
seven CSV/JSON artifacts in this directory. The year-round review is exposed
directly in `monthly-seasonality-audit.csv` (12 rows per scored pair) and
`annual-window-summary.csv` (one compact seasonal-window row per pair).

See [AUDIT_REPORT.md](AUDIT_REPORT.md) for the research decision.
