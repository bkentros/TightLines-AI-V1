# PierCast Scoring v3 — Pass 2 completion report

**Completed:** September 14, 2026; secondary-species extension completed September 15, 2026
**Internal implementation status:** complete  
**Runtime status:** private disabled shadow only  
**Production formula:** unchanged Formula v2

## Outcome

Pass 2 now implements the 36 admitted core calibrations plus 20 evidence-admitted secondary pairings: 56 city/species pairs and 125 opportunity modes in a separate Formula v3 engine. All 81 secondary pairing decisions are closed in the linked secondary package; the 61 non-admitted decisions have no numeric score. The engine includes deterministic configuration generation, mathematical scoring, a complete nine-city owner-review pipeline, an isolated archival ledger, authenticated scheduled shadow ingestion, regulation gating, and exhaustive replay/invariant checks.

The ledger also exposes a private service-role-only outcome-pair view. The v3 prospective evaluator enforces assessable, effort-aware lead-day-1 evidence and reports ordinal AUC and positive-versus-zero-catch separation against the matched v2 baseline without treating the rating as catch probability.

No public rating was enabled. No Formula v2 calibration, historical snapshot, leaderboard, public report, or existing forecast row was modified.

## Formula verification

The audit evaluated 102,200 scores: 56 city/species pairs × 365 dates × 5 thermal-fit scenarios. Every score was inside 1–10, never exceeded the selected mode's seasonal potential, and never exceeded the researched fishery strength. All 81,760 adjacent thermal-fit comparisons were monotonic. The full 1–10 scale remains attainable: Manistee fall steelhead reaches its reviewed 10.0 ceiling on its peak date under ideal thermal fit.

The deterministic weekly file contains 14,560 rows: 56 pairs × 52 weekly dates × 5 thermal scenarios. Existing v2 curves retain side-by-side values; newly admitted v3-only pairings are intentionally blank in the v2 columns rather than inventing a comparator. These comparisons test behavior and migration impact, not outcome accuracy.

## Fail-closed controls

- The source Pass 1 artifacts must still report 36 disabled core pairs and 98 modes, and the secondary package must report exactly 81 decisions, 20 admitted pairs, and 27 modes, before config generation succeeds.
- Generated config embeds SHA-256 hashes covering both the core and secondary handoff artifacts.
- Runtime configuration remains globally and per-pair disabled and public-disabled.
- Numeric evaluation requires an explicit shadow-only override.
- The owner route requires authorization and has no public route alias.
- The live v3 builder requires all 9 cities, all 121 hourly samples per city, and identical NOAA issue cycles across the frozen and expansion cohorts.
- Mixed thermal curves within a pair are rejected.
- The database RPC requires the exact 56-pair manifest and exactly 280 blocked forecasts across 9 cities and 5 lead dates.
- Racine and Kenosha yellow perch are hard-unavailable during the Wisconsin Lake Michigan closure from May 1 through June 15; closure never becomes a low biological score.
- The v3 tables deny public, anonymous, and authenticated access; only the service role can select or insert.

## Artifacts

- [`formula-invariants.json`](formula-invariants.json): exhaustive formula checks and counts.
- [`pair-peak-summary.csv`](pair-peak-summary.csv): all 56 researched ceilings, peak modes, and regulated-unavailable day counts.
- [`v3-v2-weekly-replay.csv`](v3-v2-weekly-replay.csv): deterministic v2/v3 comparison.
- [`promotion-gates.json`](promotion-gates.json): current promotion state.
- [`FORMULA_V3_DECISION.md`](FORMULA_V3_DECISION.md): formula rationale and rejected alternatives.
- Pass 1 evidence/calibration package: [`../scoring-v3-pass1/PASS1_COMPLETION_REPORT.md`](../scoring-v3-pass1/PASS1_COMPLETION_REPORT.md).
- Complete secondary evidence/calibration package: [`../scoring-v3-secondary/SECONDARY_COMPLETION_REPORT.md`](../scoring-v3-secondary/SECONDARY_COMPLETION_REPORT.md).

## Operational state

Migration `20260914233000_pier_cast_v3_shadow_ledger.sql` and the original core-only Edge Functions were deployed to the linked production project on September 15, 2026. The first manually triggered Vault-backed collection committed run `72c7ee33-fe7b-4691-af69-69b156846001`: exactly 180 core forecasts from the September 15 00:00 UTC NOAA issue, using engine `pier-cast-opportunity-modes-v3-shadow-v1.0.0`, with promotion blocked. That row is retained as historical append-only evidence.

Migration `20260915210000_expand_pier_cast_v3_secondary_manifest.sql` upgrades future private runs to the exact 56-pair, 280-row manifest without rewriting the original run. The v3 schedule remains at minute 50 after the 00/06/12/18 UTC issue windows. It reads the two fresh archived cohorts, refuses mismatched cycles, builds the nine-city outlook, and writes a separate frozen run.

## Promotion remains correctly blocked

The internal engineering work for Pass 2 is complete. Three evidence gates cannot be manufactured by code and remain pending: independent specialist sign-off, local surface-temperature representation evidence, and an adequate prospective effort-aware outcome sample. Formula v3 must remain shadow-only until those gates pass and the owner explicitly approves promotion.
