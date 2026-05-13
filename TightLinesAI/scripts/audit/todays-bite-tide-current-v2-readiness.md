# Today's Bite Tide/Current V2 Production Readiness Audit

Generated: 2026-05-13T18:05:25.762Z

Phase 8D production parity/readiness audit. Production tide/current scoring is wired to `score_only_combined`; timing production logic, scoreDay, report copy, app/forecast behavior, other condition normalizers, and recommender production logic were not changed.

## Totals

- Fixtures: 25
- Passed: 25
- Questionable: 0
- Failed: 0
- Tide label changes: 0
- Reliability changes: 0
- Activity tier changes: 0
- Driver changes: 0
- Suppressor changes: 0
- Recommender: not_applicable for all coastal/flats fixtures.

## Production Parity

- Production-vs-experiment tide mismatches: 0
- Production-vs-experiment score delta rows: 0
- Production-vs-experiment label changes: 0
- Production-vs-experiment reliability changes: 0
- Timing production behavior changed: 0 (timing is diagnostic-only here)

## Fixture Results

| Fixture | Context | Prod label | Prod tide | V2 label | V2 tide | Score delta | Activity changed | Reliability changed | Status | Reason |
| --- | --- | --- | ---: | --- | ---: | ---: | --- | --- | --- | --- |
| inshore_measured_slack | coastal | slack | -0.928 | slack | -0.928 | 0 | no | no | pass | Inshore slack remains meaningfully negative. |
| flats_measured_slack | coastal_flats_estuary | slack | -0.178 | slack | -0.178 | 0 | no | no | pass | Flats slack remains mild. |
| inshore_soft_moving_065 | coastal | moving | 0.2071 | moving | 0.2071 | 0 | no | no | pass | Soft inshore current is now modestly helpful. |
| inshore_barely_moving_055 | coastal | moving | -0.0643 | moving | -0.0643 | 0 | no | no | pass | Barely moving inshore current stays near-neutral/near-slack. |
| flats_soft_current_055 | coastal_flats_estuary | moving | 0.265 | moving | 0.265 | 0 | no | no | pass | Soft flats current is modestly helpful. |
| inshore_optimal_moving_135 | coastal | moving | 1.0313 | moving | 1.0313 | 0 | no | no | pass | Optimal movement remains strongly positive. |
| flats_optimal_moving_125 | coastal_flats_estuary | moving | 1.0167 | moving | 1.0167 | 0 | no | no | pass | Optimal movement remains strongly positive. |
| inshore_strong_current_20 | coastal | strong_moving | 1.6 | strong_moving | 1.6 | 0 | no | no | pass | Strong inshore current remains positive. |
| flats_strong_current_20 | coastal_flats_estuary | strong_moving | -0.35 | strong_moving | -0.35 | 0 | no | no | pass | Strong flats current is now cautionary/negative. |
| inshore_too_hard_32 | coastal | too_strong | -0.5643 | too_strong | -0.5643 | 0 | no | no | pass | Too-hard current is clearly negative. |
| flats_too_hard_24 | coastal_flats_estuary | strong_moving | -0.7667 | strong_moving | -0.7667 | 0 | no | no | pass | Too-hard current is clearly negative. |
| flats_too_hard_32 | coastal_flats_estuary | too_strong | -1.6 | too_strong | -1.6 | 0 | no | no | pass | Too-hard current is clearly negative. |
| stage_incoming_only | coastal | moving | 0.7 | moving | 0.7 | 0 | no | no | pass | Stage-only behavior is unchanged. |
| stage_outgoing_only | coastal | moving | 0.7 | moving | 0.7 | 0 | no | no | pass | Stage-only behavior is unchanged. |
| stage_slack_inshore | coastal | slack | -0.85 | slack | -0.85 | 0 | no | no | pass | Stage-only behavior is unchanged. |
| stage_slack_flats | coastal_flats_estuary | slack | -0.2 | slack | -0.2 | 0 | no | no | pass | Stage-only behavior is unchanged. |
| unknown_stage | coastal | null | null | null | null | 0 | no | no | pass | Unknown stage remains missing/null. |
| missing_tide | coastal | null | null | null | null | 0 | no | no | pass | Missing tide remains missing and does not inflate reliability. |
| conflicting_stage_current | coastal | moving | 1.075 | moving | 1.075 | 0 | no | no | pass | Measured current still wins over slack stage. |
| large_high_low_exchange | coastal | strong_moving | 1.1364 | strong_moving | 1.1364 | 0 | no | no | pass | Tide-clock exchange remains useful. |
| weak_high_low_exchange | coastal | moving | 0.4786 | moving | 0.4786 | 0 | no | no | pass | Weak exchange is not overrewarded. |
| many_same_day_exchanges | coastal | strong_moving | 1.1152 | strong_moving | 1.1152 | 0 | no | no | pass | Tide-clock exchange remains useful. |
| tide_times_without_current | coastal_flats_estuary | moving | 0.95 | moving | 0.95 | 0 | no | no | pass | Tide-clock exchange remains useful. |
| hourly_tide_heights | coastal_flats_estuary | strong_moving | 1.15 | strong_moving | 1.15 | 0 | no | no | pass | Hourly tide heights are used and remain sensible. |
| measured_current_over_hourly | coastal | moving | 0.2071 | moving | 0.2071 | 0 | no | no | pass | Measured current wins over conflicting hourly/stage data. |

## Flats Vs Inshore Summary

- Inshore slack stays meaningfully negative; flats slack remains mild.
- Inshore true soft current at 0.65 kt becomes modestly helpful, while barely moving 0.55 kt remains near-neutral/slightly negative.
- Flats soft current at 0.55 kt becomes modestly helpful.
- Inshore 2.0 kt remains positive; flats 2.0 kt becomes cautionary/negative.
- Too-hard current is clearly negative in both inshore and flats fixtures.

## Timing Diagnostic

Timing is recorded only as diagnostic metadata. This readiness audit does not recommend timing production changes. Qualified tide-window status remains whatever production timing returns for each fixture.

## Recommendation

**production parity confirmed for score_only_combined; keep timing diagnostics separate**

## Artifacts

- JSONL: `scripts/audit/todays-bite-tide-current-v2-readiness.jsonl`
- Markdown: `scripts/audit/todays-bite-tide-current-v2-readiness.md`
