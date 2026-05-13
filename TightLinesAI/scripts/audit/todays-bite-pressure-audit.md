# Today's Bite Pressure Current-State Audit

Generated: 2026-05-13T17:08:20.973Z

Phase 7A audit-only. Production pressure normalization, scoreDay, report copy, app/forecast behavior, other condition normalizers, and recommender production logic were not changed.

## Totals

- Rows: 27648
- Regions: 18
- Months: 12
- Contexts: 4
- Pressure archetypes: 16
- Recommender valid rows: 11520
- Recommender error rows: 2304
- Pressure driver rows: 1686
- Pressure suppressor rows: 6912
- Total questionable flags: 6480

## Pressure Label Distribution

- stable_neutral: 8640
- falling_slow: 3456
- volatile: 3456
- falling_moderate: 3456
- rising_slow: 1728
- rising_fast: 1728
- falling_hard: 1728
- recently_stabilizing: 1728
- missing: 1728

## Pressure Quality Distribution

- adequate: 24192
- missing: 1728
- two_point: 1728

## Questionable Flags

| Flag | Count |
| --- | ---: |
| pressure_overconfident_sparse_history | 0 |
| missing_pressure_reliability_too_high | 0 |
| stable_pressure_too_strong_as_daymaker | 0 |
| fast_fall_not_penalized_enough | 0 |
| volatile_not_penalized_enough | 0 |
| slow_fall_overrewarded_in_poor_context | 0 |
| pressure_driver_with_near_zero_score | 0 |
| pressure_suppressor_with_near_zero_score | 0 |
| pressure_label_unstable_for_similar_inputs | 0 |
| recommender_pressure_mode_coupling | 6480 |

## Recommender Coupling

Selected-pick changes are n/a because this is a current-state audit with no shadow variant.

Pressure mode distribution:

- stable: 4320
- falling: 3600
- error: 2304
- rising: 1440
- unstable: 1440
- unknown: 720

Scenario tag rows with pressure-related coupling are not expected; current daily-picks pressure coupling is summarized by `pressure_mode`, not direct pressure tags.

## Representative Questionable Samples

| Region | Month | Context | Archetype | Clarity | Pressure Label | Pressure Score | Quality | Score | Reliability | Flags |
| --- | ---: | --- | --- | --- | --- | ---: | --- | ---: | --- | --- |
| northeast | 1 | freshwater_lake_pond | slow_rise | clear | rising_slow | 0.01 | adequate | 62 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | slow_rise | stained | rising_slow | 0.01 | adequate | 62 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | slow_fall | clear | falling_slow | 0.99 | adequate | 67 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | slow_fall | stained | falling_slow | 0.99 | adequate | 67 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | fast_rise | clear | rising_fast | -0.85 | adequate | 56 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | fast_rise | stained | rising_fast | -0.85 | adequate | 56 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | fast_fall | clear | falling_hard | -0.55 | adequate | 58 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | fast_fall | stained | falling_hard | -0.55 | adequate | 58 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | volatile_swing | clear | volatile | -2 | adequate | 50 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | volatile_swing | stained | volatile | -2 | adequate | 50 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | front_approaching | clear | falling_moderate | 0.2167 | adequate | 63 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | front_approaching | stained | falling_moderate | 0.2167 | adequate | 63 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | sparse_two_point_history | clear | falling_slow | 0.83 | two_point | 66 | medium | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | sparse_two_point_history | stained | falling_slow | 0.83 | two_point | 66 | medium | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | falling_then_recovering | clear | falling_moderate | 0.2167 | adequate | 63 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | falling_then_recovering | stained | falling_moderate | 0.2167 | adequate | 63 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | rising_then_crashing | clear | volatile | -1.5125 | adequate | 53 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_lake_pond | rising_then_crashing | stained | volatile | -1.5125 | adequate | 53 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | slow_rise | clear | rising_slow | 0.01 | adequate | 58 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | slow_rise | stained | rising_slow | 0.01 | adequate | 58 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | slow_fall | clear | falling_slow | 0.99 | adequate | 63 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | slow_fall | stained | falling_slow | 0.99 | adequate | 63 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | fast_rise | clear | rising_fast | -0.85 | adequate | 55 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | fast_rise | stained | rising_fast | -0.85 | adequate | 55 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | fast_fall | clear | falling_hard | -0.55 | adequate | 56 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | fast_fall | stained | falling_hard | -0.55 | adequate | 56 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | volatile_swing | clear | volatile | -2 | adequate | 50 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | volatile_swing | stained | volatile | -2 | adequate | 50 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | front_approaching | clear | falling_moderate | 0.2167 | adequate | 59 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | front_approaching | stained | falling_moderate | 0.2167 | adequate | 59 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | sparse_two_point_history | clear | falling_slow | 0.83 | two_point | 62 | medium | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | sparse_two_point_history | stained | falling_slow | 0.83 | two_point | 62 | medium | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | falling_then_recovering | clear | falling_moderate | 0.2167 | adequate | 59 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | falling_then_recovering | stained | falling_moderate | 0.2167 | adequate | 59 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | rising_then_crashing | clear | volatile | -1.5125 | adequate | 52 | high | recommender_pressure_mode_coupling |
| northeast | 1 | freshwater_river | rising_then_crashing | stained | volatile | -1.5125 | adequate | 52 | high | recommender_pressure_mode_coupling |
| northeast | 2 | freshwater_lake_pond | slow_rise | clear | rising_slow | 0.01 | adequate | 58 | high | recommender_pressure_mode_coupling |
| northeast | 2 | freshwater_lake_pond | slow_rise | stained | rising_slow | 0.01 | adequate | 58 | high | recommender_pressure_mode_coupling |
| northeast | 2 | freshwater_lake_pond | slow_fall | clear | falling_slow | 0.99 | adequate | 64 | high | recommender_pressure_mode_coupling |
| northeast | 2 | freshwater_lake_pond | slow_fall | stained | falling_slow | 0.99 | adequate | 64 | high | recommender_pressure_mode_coupling |

## Behavior Summary

- Stable pressure is neutral in production and does not appear as an oversized daymaker.
- Sparse/two-point histories are quality-tagged and reliability is downgraded by the normalizer/build path.
- Missing pressure is treated as an absent variable and did not inflate reliability to high.
- Falling pressure is intentionally helpful at slow/moderate front-like rates, while hard falls turn negative.
- Volatile pressure is penalized unless recent samples have clearly settled.
- Recommender coupling is limited to `pressure_mode`; no pick comparison is performed in this current-state audit.

## Recommendation

**leave pressure production logic unchanged; optionally add docs/tests around existing behavior**

## Artifacts

- JSONL: `scripts/audit/todays-bite-pressure-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-pressure-audit.md`
