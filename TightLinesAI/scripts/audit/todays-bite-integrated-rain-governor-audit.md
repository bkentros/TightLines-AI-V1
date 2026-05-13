# Today's Bite Integrated Rain/Wet Governor Shadow Audit

Generated: 2026-05-13T18:59:10.846Z

Phase 9C shadow-only score-governor sweep. Production normalizers, scoreDay, report copy, app/forecast/cache behavior, and recommender production logic were not changed.

## Candidate Sweep

| Candidate | Avg delta | Min | Max | abs>=8 | abs>=12 | Activity tier changes | Reliability changes | Total flags | Valid rec rows | Pick changes | Thermal changes | Surface changes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| production_control | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 3130 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| active_rain_score_ceiling_65 | -0.03 | -11 | 0 | 72 | 0 | 144 | 0 | 2986 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| active_rain_score_ceiling_62 | -0.06 | -14 | 0 | 144 | 60 | 144 | 0 | 2986 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| active_rain_contextual_ceiling | -0.04 | -12 | 0 | 90 | 6 | 144 | 0 | 2986 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| wet_baseline_score_ceiling_70 | -0.02 | -8 | 0 | 4 | 0 | 0 | 0 | 3130 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| wet_baseline_score_ceiling_67 | -0.04 | -11 | 0 | 70 | 0 | 282 | 0 | 2942 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| wet_baseline_contextual_ceiling | -0.03 | -8 | 0 | 40 | 0 | 168 | 0 | 2942 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| major_suppressor_ceiling | -0.02 | -7 | 0 | 0 | 0 | 172 | 0 | 2902 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| rain_driver_damping | -0.13 | -6 | 0 | 0 | 0 | 380 | 0 | 2590 | 17280 | 22 (0.1%) | 0 (0.0%) | 6 (0.0%) |
| combined_contextual_light | -0.08 | -12 | 0 | 130 | 6 | 312 | 0 | 2798 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| combined_contextual_stronger | -0.15 | -11 | 0 | 40 | 0 | 446 | 0 | 2524 | 17280 | 22 (0.1%) | 0 (0.0%) | 6 (0.0%) |

## Flag Reductions And Regressions

| Candidate | Heavy rain too high | Wet baseline too high | High score + major suppressor | Copy conflict | Low-score driver regression |
| --- | ---: | ---: | ---: | ---: | ---: |
| production_control | 500 (0.0%) | 458 (0.0%) | 290 (0.0%) | 146 (0.0%) | 812 (0) |
| active_rain_score_ceiling_65 | 500 (0.0%) | 458 (0.0%) | 146 (49.7%) | 146 (0.0%) | 812 (0) |
| active_rain_score_ceiling_62 | 500 (0.0%) | 458 (0.0%) | 146 (49.7%) | 146 (0.0%) | 812 (0) |
| active_rain_contextual_ceiling | 500 (0.0%) | 458 (0.0%) | 146 (49.7%) | 146 (0.0%) | 812 (0) |
| wet_baseline_score_ceiling_70 | 500 (0.0%) | 458 (0.0%) | 290 (0.0%) | 146 (0.0%) | 812 (0) |
| wet_baseline_score_ceiling_67 | 500 (0.0%) | 458 (0.0%) | 196 (32.4%) | 52 (64.4%) | 812 (0) |
| wet_baseline_contextual_ceiling | 500 (0.0%) | 458 (0.0%) | 196 (32.4%) | 52 (64.4%) | 812 (0) |
| major_suppressor_ceiling | 500 (0.0%) | 458 (0.0%) | 118 (59.3%) | 90 (38.4%) | 812 (0) |
| rain_driver_damping | 322 (35.6%) | 404 (11.8%) | 216 (25.5%) | 126 (13.7%) | 598 (-214) |
| combined_contextual_light | 500 (0.0%) | 458 (0.0%) | 52 (82.1%) | 52 (64.4%) | 812 (0) |
| combined_contextual_stronger | 322 (35.6%) | 404 (11.8%) | 150 (48.3%) | 126 (13.7%) | 598 (-214) |

## Fixed-Issue Regression Check

- production_control: 0
- active_rain_score_ceiling_65: 0
- active_rain_score_ceiling_62: 0
- active_rain_contextual_ceiling: 0
- wet_baseline_score_ceiling_70: 0
- wet_baseline_score_ceiling_67: 0
- wet_baseline_contextual_ceiling: 0
- major_suppressor_ceiling: 0
- rain_driver_damping: 0
- combined_contextual_light: 0
- combined_contextual_stronger: 0

## Top Rows Improved By Combined Contextual Stronger

| Region | Month | Context | Archetype | Clarity | Prod | Candidate | Delta | Prod flags | Candidate flags |
| --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| southeast_atlantic | 3 | freshwater_lake_pond | wet_baseline_recent_rain | clear | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| southeast_atlantic | 3 | freshwater_lake_pond | wet_baseline_recent_rain | stained | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| southeast_atlantic | 10 | freshwater_lake_pond | wet_baseline_recent_rain | clear | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| southeast_atlantic | 10 | freshwater_lake_pond | wet_baseline_recent_rain | stained | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| gulf_coast | 10 | freshwater_lake_pond | wet_baseline_recent_rain | clear | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| gulf_coast | 10 | freshwater_lake_pond | wet_baseline_recent_rain | stained | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| south_central | 3 | freshwater_lake_pond | wet_baseline_recent_rain | clear | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| south_central | 3 | freshwater_lake_pond | wet_baseline_recent_rain | stained | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| south_central | 10 | freshwater_lake_pond | wet_baseline_recent_rain | clear | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| south_central | 10 | freshwater_lake_pond | wet_baseline_recent_rain | stained | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| pacific_northwest | 7 | freshwater_lake_pond | wet_baseline_recent_rain | clear | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| pacific_northwest | 7 | freshwater_lake_pond | wet_baseline_recent_rain | stained | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| mountain_alpine | 1 | freshwater_lake_pond | wet_baseline_recent_rain | clear | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| mountain_alpine | 1 | freshwater_lake_pond | wet_baseline_recent_rain | stained | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| mountain_alpine | 5 | freshwater_lake_pond | wet_baseline_recent_rain | clear | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| mountain_alpine | 5 | freshwater_lake_pond | wet_baseline_recent_rain | stained | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| appalachian | 7 | freshwater_lake_pond | wet_baseline_recent_rain | clear | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| appalachian | 7 | freshwater_lake_pond | wet_baseline_recent_rain | stained | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| alaska | 10 | freshwater_lake_pond | wet_baseline_recent_rain | clear | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| alaska | 10 | freshwater_lake_pond | wet_baseline_recent_rain | stained | 70 | 69 | -1 | high_score_with_major_suppressor, wet_baseline_score_too_high, report_copy_conflicts_with_score | wet_baseline_score_too_high |
| midwest_interior | 8 | coastal | river_blown_out | clear | 75 | 64 | -11 | high_score_with_major_suppressor |  |
| midwest_interior | 8 | coastal | river_blown_out | stained | 75 | 64 | -11 | high_score_with_major_suppressor |  |
| pacific_northwest | 5 | coastal | river_blown_out | clear | 75 | 64 | -11 | high_score_with_major_suppressor |  |
| pacific_northwest | 5 | coastal | river_blown_out | stained | 75 | 64 | -11 | high_score_with_major_suppressor |  |
| pacific_northwest | 9 | coastal | river_blown_out | clear | 75 | 64 | -11 | high_score_with_major_suppressor |  |
| pacific_northwest | 9 | coastal | river_blown_out | stained | 75 | 64 | -11 | high_score_with_major_suppressor |  |
| southern_california | 3 | coastal | river_blown_out | clear | 75 | 64 | -11 | high_score_with_major_suppressor |  |
| southern_california | 3 | coastal | river_blown_out | stained | 75 | 64 | -11 | high_score_with_major_suppressor |  |
| inland_northwest | 5 | coastal | river_blown_out | clear | 75 | 64 | -11 | high_score_with_major_suppressor |  |
| inland_northwest | 5 | coastal | river_blown_out | stained | 75 | 64 | -11 | high_score_with_major_suppressor |  |

## Top Regressions For Combined Contextual Stronger

| Region | Month | Context | Archetype | Clarity | Prod | Candidate | Delta | Prod flags | Candidate flags |
| --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| northeast | 1 | freshwater_lake_pond | heavy_active_rain | clear | 36 | 34 | -2 | low_score_with_multiple_strong_drivers |  |
| northeast | 1 | freshwater_lake_pond | heavy_active_rain | stained | 36 | 34 | -2 | low_score_with_multiple_strong_drivers |  |
| northeast | 2 | freshwater_lake_pond | heavy_active_rain | clear | 36 | 34 | -2 | low_score_with_multiple_strong_drivers |  |
| northeast | 2 | freshwater_lake_pond | heavy_active_rain | stained | 36 | 34 | -2 | low_score_with_multiple_strong_drivers |  |
| southeast_atlantic | 9 | freshwater_river | heavy_active_rain | clear | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| southeast_atlantic | 9 | freshwater_river | heavy_active_rain | stained | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| florida | 1 | freshwater_lake_pond | heavy_active_rain | stained | 36 | 35 | -1 | low_score_with_multiple_strong_drivers |  |
| great_lakes_upper_midwest | 6 | freshwater_river | wet_baseline_recent_rain | clear | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| great_lakes_upper_midwest | 6 | freshwater_river | wet_baseline_recent_rain | stained | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| great_lakes_upper_midwest | 10 | freshwater_river | heavy_active_rain | clear | 36 | 35 | -1 | low_score_with_multiple_strong_drivers | low_score_with_multiple_strong_drivers |
| great_lakes_upper_midwest | 10 | freshwater_river | heavy_active_rain | stained | 36 | 35 | -1 | low_score_with_multiple_strong_drivers | low_score_with_multiple_strong_drivers |
| midwest_interior | 3 | freshwater_river | heavy_active_rain | clear | 36 | 35 | -1 | low_score_with_multiple_strong_drivers | low_score_with_multiple_strong_drivers |
| midwest_interior | 3 | freshwater_river | heavy_active_rain | stained | 36 | 35 | -1 | low_score_with_multiple_strong_drivers | low_score_with_multiple_strong_drivers |
| mountain_west | 7 | freshwater_river | heavy_active_rain | clear | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| mountain_west | 7 | freshwater_river | heavy_active_rain | stained | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| mountain_west | 8 | freshwater_river | heavy_active_rain | clear | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| mountain_west | 8 | freshwater_river | heavy_active_rain | stained | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| southern_california | 3 | freshwater_river | heavy_active_rain | clear | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| southern_california | 3 | freshwater_river | heavy_active_rain | stained | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| southern_california | 4 | freshwater_river | heavy_active_rain | clear | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| southern_california | 4 | freshwater_river | heavy_active_rain | stained | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| southern_california | 10 | freshwater_river | heavy_active_rain | clear | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| southern_california | 10 | freshwater_river | heavy_active_rain | stained | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| mountain_alpine | 11 | freshwater_river | heavy_active_rain | clear | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| mountain_alpine | 11 | freshwater_river | heavy_active_rain | stained | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| northern_california | 2 | freshwater_river | wet_baseline_recent_rain | clear | 36 | 35 | -1 |  |  |
| northern_california | 2 | freshwater_river | wet_baseline_recent_rain | stained | 36 | 35 | -1 |  |  |
| northern_california | 3 | freshwater_river | wet_baseline_recent_rain | clear | 36 | 35 | -1 |  |  |
| northern_california | 3 | freshwater_river | wet_baseline_recent_rain | stained | 36 | 35 | -1 |  |  |
| northern_california | 4 | freshwater_lake_pond | heavy_active_rain | stained | 36 | 35 | -1 | low_score_with_multiple_strong_drivers |  |

## Recommended Finalist

**no safe finalist**

Recommendation: **no safe finalist; needs narrower sweep and likely copy-only audit follow-up**.

Best partial read: `major_suppressor_ceiling` is the cleanest score-ceiling candidate for high-score/copy conflict cleanup with zero recommender movement and no large deltas. `rain_driver_damping` is the only candidate that meaningfully reduces heavy-rain rows, but it still misses the 60% target. Phase 9D should test narrower rain-specific governors with lower active-rain caps and a wet-baseline trigger that does not require precipitation score <= -0.45 when 72h/7d totals are clearly wet.

Notes:
- Score ceiling candidates change only the final score. `rain_driver_damping` and `combined_contextual_stronger` adjust contribution math in memory but preserve normalized labels/modes.
- This audit intentionally leaves report-copy strings untouched. Remaining `report_copy_conflicts_with_score` rows should be reviewed in a copy-only pass because candidate score changes can reduce but not fully validate prose alignment.
- Recommender comparisons use current production daily-picks logic with candidate How's Fishing analysis injected in memory.

## Artifacts

- JSONL: `scripts/audit/todays-bite-integrated-rain-governor-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-integrated-rain-governor-audit.md`
