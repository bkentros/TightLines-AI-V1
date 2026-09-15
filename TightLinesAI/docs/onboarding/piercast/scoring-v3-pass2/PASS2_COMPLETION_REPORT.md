# PierCast Scoring v3 — Pass 2 completion report

**Completed:** September 14, 2026  
**Internal implementation status:** complete  
**Runtime status:** private disabled shadow only  
**Production formula:** unchanged Formula v2

## Outcome

Pass 2 fully implements the 36 admitted Pass 1 calibrations and 98 opportunity modes in a separate Formula v3 engine. It adds deterministic configuration generation, mathematical scoring, a complete nine-city owner-review pipeline, an isolated archival ledger, authenticated scheduled shadow ingestion, and exhaustive replay/invariant checks.

The ledger also exposes a private service-role-only outcome-pair view. The v3 prospective evaluator enforces assessable, effort-aware lead-day-1 evidence and reports ordinal AUC and positive-versus-zero-catch separation against the matched v2 baseline without treating the rating as catch probability.

No public rating was enabled. No Formula v2 calibration, historical snapshot, leaderboard, public report, or existing forecast row was modified.

## Formula verification

The audit evaluated 65,700 scores: 36 city/species pairs × 365 dates × 5 thermal-fit scenarios. All 65,700 were inside 1–10, never exceeded the selected mode's seasonal potential, and never exceeded the researched fishery strength. All 52,560 adjacent thermal-fit comparisons were monotonic. The full 1–10 scale is attainable: Manistee fall steelhead reaches its reviewed 10.0 ceiling on its peak date under ideal thermal fit.

The v2/v3 comparison contains 9,360 rows: 36 pairs × 52 weekly dates × 5 thermal scenarios. V3 is not a blanket uplift. Across this deliberately balanced scenario grid, mean `v3 − v2` is −0.2363, with 2,883 positive, 5,979 negative, and 498 unchanged comparisons. The range is −4.0344 to +2.2562. These differences primarily reflect removing artificial duration between distinct modes; they do not establish outcome accuracy.

## Fail-closed controls

- The source Pass 1 artifacts must still report 36 disabled pairs and 98 modes before config generation succeeds.
- Generated config embeds SHA-256 hashes of both Pass 1 handoff artifacts.
- Runtime configuration remains globally and per-pair disabled and public-disabled.
- Numeric evaluation requires an explicit shadow-only override.
- The owner route requires authorization and has no public route alias.
- The live v3 builder requires all 9 cities, all 121 hourly samples per city, and identical NOAA issue cycles across the frozen and expansion cohorts.
- Mixed thermal curves within a pair are rejected.
- The database RPC requires exactly 180 blocked forecasts, 9 cities, 4 species, and 5 lead dates.
- The v3 tables deny public, anonymous, and authenticated access; only the service role can select or insert.

## Artifacts

- [`formula-invariants.json`](formula-invariants.json): exhaustive formula checks and counts.
- [`pair-peak-summary.csv`](pair-peak-summary.csv): all 36 researched ceilings and peak modes.
- [`v3-v2-weekly-replay.csv`](v3-v2-weekly-replay.csv): deterministic v2/v3 comparison.
- [`promotion-gates.json`](promotion-gates.json): current promotion state.
- [`FORMULA_V3_DECISION.md`](FORMULA_V3_DECISION.md): formula rationale and rejected alternatives.
- Pass 1 evidence/calibration package: [`../scoring-v3-pass1/PASS1_COMPLETION_REPORT.md`](../scoring-v3-pass1/PASS1_COMPLETION_REPORT.md).

## Operational state

Migration `20260914233000_pier_cast_v3_shadow_ledger.sql` and the updated `pier-cast` and `pier-cast-ingest` Edge Functions were deployed to the linked production project on September 15, 2026. The first manually triggered Vault-backed collection committed run `72c7ee33-fe7b-4691-af69-69b156846001`: exactly 180 forecasts from the September 15 00:00 UTC NOAA issue, using engine `pier-cast-opportunity-modes-v3-shadow-v1.0.0`, with promotion blocked.

The v3 schedule runs at minute 50 after the 00/06/12/18 UTC issue windows. It reads the two fresh archived cohorts, refuses mismatched cycles, builds the nine-city outlook, and writes a separate 180-row frozen run.

## Promotion remains correctly blocked

The internal engineering work for Pass 2 is complete. Three evidence gates cannot be manufactured by code and remain pending: independent specialist sign-off, local surface-temperature representation evidence, and an adequate prospective effort-aware outcome sample. Formula v3 must remain shadow-only until those gates pass and the owner explicitly approves promotion.
