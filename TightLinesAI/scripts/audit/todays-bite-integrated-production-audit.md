# Today's Bite Integrated Production Audit

Generated: 2026-05-14T16:34:44.735Z

Production snapshot over the current engine after Phase 9F rain/wet final-score policy wiring. No production normalizer, report copy, app/forecast behavior, or recommender production logic was changed by this audit.

## Totals

- Total rows: 41472
- Regions: 18
- Months: 12
- Contexts: freshwater_lake_pond, freshwater_river, coastal, coastal_flats_estuary
- Archetypes: 24
- Water clarity variants: clear, stained

## Rows By Context

- freshwater_lake_pond: 10368
- freshwater_river: 10368
- coastal: 10368
- coastal_flats_estuary: 10368

## Score Distribution By Context

| Context | 0-34 | 35-49 | 50-64 | 65-79 | 80-100 |
| --- | ---: | ---: | ---: | ---: | ---: |
| freshwater_lake_pond | 592 | 3350 | 4520 | 1906 | 0 |
| freshwater_river | 814 | 3454 | 4764 | 1336 | 0 |
| coastal | 134 | 2616 | 6636 | 982 | 0 |
| coastal_flats_estuary | 430 | 3300 | 5632 | 1006 | 0 |

## Reliability Distribution

- high: 39744
- low: 1728

## Top Questionable Flags

- high_score_with_major_suppressor: 0
- low_score_with_multiple_strong_drivers: 492
- stable_bad_temp_scored_too_well: 76
- improving_temp_shock_over_penalized: 236
- worsening_temp_shock_under_penalized: 8
- hot_bright_calm_not_penalized: 268
- cold_clear_not_neutral_enough: 84
- heavy_rain_score_too_high: 0
- wet_baseline_score_too_high: 0
- river_blown_out_score_too_high: 0
- river_stable_flow_overrewarded: 0
- high_wind_score_too_high: 0
- heavy_overcast_windy_score_too_high: 0
- coastal_slack_score_too_high: 0
- flats_too_hard_current_score_too_high: 0
- missing_data_reliability_too_high: 0
- report_copy_conflicts_with_score: 0
- driver_suppressor_conflict: 0

## Worst 20 Rows By Flag Count

| Region | Month | Context | Archetype | Clarity | Score | Reliability | Flags |
| --- | ---: | --- | --- | --- | ---: | --- | --- |
| mountain_alpine | 1 | freshwater_river | stable_poor_cold | clear | 63 | high | stable_bad_temp_scored_too_well, cold_clear_not_neutral_enough |
| mountain_alpine | 1 | freshwater_river | stable_poor_cold | stained | 63 | high | stable_bad_temp_scored_too_well, cold_clear_not_neutral_enough |
| mountain_alpine | 12 | freshwater_river | stable_poor_cold | clear | 63 | high | stable_bad_temp_scored_too_well, cold_clear_not_neutral_enough |
| mountain_alpine | 12 | freshwater_river | stable_poor_cold | stained | 63 | high | stable_bad_temp_scored_too_well, cold_clear_not_neutral_enough |
| alaska | 1 | freshwater_river | stable_poor_cold | clear | 63 | high | stable_bad_temp_scored_too_well, cold_clear_not_neutral_enough |
| alaska | 1 | freshwater_river | stable_poor_cold | stained | 63 | high | stable_bad_temp_scored_too_well, cold_clear_not_neutral_enough |
| alaska | 2 | freshwater_river | stable_poor_cold | clear | 63 | high | stable_bad_temp_scored_too_well, cold_clear_not_neutral_enough |
| alaska | 2 | freshwater_river | stable_poor_cold | stained | 63 | high | stable_bad_temp_scored_too_well, cold_clear_not_neutral_enough |
| alaska | 12 | freshwater_river | stable_poor_cold | clear | 63 | high | stable_bad_temp_scored_too_well, cold_clear_not_neutral_enough |
| alaska | 12 | freshwater_river | stable_poor_cold | stained | 63 | high | stable_bad_temp_scored_too_well, cold_clear_not_neutral_enough |
| florida | 6 | coastal_flats_estuary | stable_poor_hot | clear | 62 | high | stable_bad_temp_scored_too_well, hot_bright_calm_not_penalized |
| florida | 6 | coastal_flats_estuary | stable_poor_hot | stained | 62 | high | stable_bad_temp_scored_too_well, hot_bright_calm_not_penalized |
| florida | 7 | coastal_flats_estuary | stable_poor_hot | clear | 62 | high | stable_bad_temp_scored_too_well, hot_bright_calm_not_penalized |
| florida | 7 | coastal_flats_estuary | stable_poor_hot | stained | 62 | high | stable_bad_temp_scored_too_well, hot_bright_calm_not_penalized |
| south_central | 8 | coastal_flats_estuary | stable_poor_hot | clear | 62 | high | stable_bad_temp_scored_too_well, hot_bright_calm_not_penalized |
| south_central | 8 | coastal_flats_estuary | stable_poor_hot | stained | 62 | high | stable_bad_temp_scored_too_well, hot_bright_calm_not_penalized |
| mountain_west | 8 | coastal_flats_estuary | stable_poor_hot | clear | 62 | high | stable_bad_temp_scored_too_well, hot_bright_calm_not_penalized |
| mountain_west | 8 | coastal_flats_estuary | stable_poor_hot | stained | 62 | high | stable_bad_temp_scored_too_well, hot_bright_calm_not_penalized |
| southwest_desert | 8 | coastal_flats_estuary | stable_poor_hot | clear | 62 | high | stable_bad_temp_scored_too_well, hot_bright_calm_not_penalized |
| southwest_desert | 8 | coastal_flats_estuary | stable_poor_hot | stained | 62 | high | stable_bad_temp_scored_too_well, hot_bright_calm_not_penalized |

## Best 20 Rows That Look Sensible

| Region | Month | Context | Archetype | Clarity | Score | Band | Drivers |
| --- | ---: | --- | --- | --- | ---: | --- | --- |
| south_central | 1 | freshwater_lake_pond | light_mist_dry_baseline | clear | 78 | Good | temperature_condition, light_cloud_condition |
| south_central | 1 | freshwater_lake_pond | light_mist_dry_baseline | stained | 78 | Good | temperature_condition, light_cloud_condition |
| southwest_desert | 3 | freshwater_lake_pond | light_mist_dry_baseline | clear | 78 | Good | temperature_condition, light_cloud_condition |
| southwest_desert | 3 | freshwater_lake_pond | light_mist_dry_baseline | stained | 78 | Good | temperature_condition, light_cloud_condition |
| southwest_high_desert | 3 | freshwater_lake_pond | light_mist_dry_baseline | clear | 78 | Good | temperature_condition, light_cloud_condition |
| southwest_high_desert | 3 | freshwater_lake_pond | light_mist_dry_baseline | stained | 78 | Good | temperature_condition, light_cloud_condition |
| mountain_alpine | 6 | freshwater_lake_pond | light_mist_dry_baseline | clear | 78 | Good | temperature_condition, light_cloud_condition |
| mountain_alpine | 6 | freshwater_lake_pond | light_mist_dry_baseline | stained | 78 | Good | temperature_condition, light_cloud_condition |
| mountain_alpine | 9 | freshwater_lake_pond | light_mist_dry_baseline | clear | 78 | Good | temperature_condition, light_cloud_condition |
| mountain_alpine | 9 | freshwater_lake_pond | light_mist_dry_baseline | stained | 78 | Good | temperature_condition, light_cloud_condition |
| alaska | 11 | freshwater_lake_pond | light_mist_dry_baseline | clear | 78 | Good | temperature_condition, light_cloud_condition |
| alaska | 11 | freshwater_lake_pond | light_mist_dry_baseline | stained | 78 | Good | temperature_condition, light_cloud_condition |
| gulf_coast | 11 | freshwater_lake_pond | light_mist_dry_baseline | clear | 77 | Good | temperature_condition, light_cloud_condition |
| gulf_coast | 11 | freshwater_lake_pond | light_mist_dry_baseline | stained | 77 | Good | temperature_condition, light_cloud_condition |
| south_central | 2 | freshwater_lake_pond | light_mist_dry_baseline | clear | 77 | Good | temperature_condition, light_cloud_condition |
| south_central | 2 | freshwater_lake_pond | light_mist_dry_baseline | stained | 77 | Good | temperature_condition, light_cloud_condition |
| pacific_northwest | 6 | freshwater_lake_pond | light_mist_dry_baseline | clear | 77 | Good | temperature_condition, light_cloud_condition |
| pacific_northwest | 6 | freshwater_lake_pond | light_mist_dry_baseline | stained | 77 | Good | temperature_condition, light_cloud_condition |
| pacific_northwest | 8 | freshwater_lake_pond | light_mist_dry_baseline | clear | 77 | Good | temperature_condition, light_cloud_condition |
| pacific_northwest | 8 | freshwater_lake_pond | light_mist_dry_baseline | stained | 77 | Good | temperature_condition, light_cloud_condition |

## Recommender Protection

- Attempted rows: 20736
- Valid rows: 17280
- Unsupported exact rows: 3456
- Error rows: 0
- Not applicable coastal/flats rows: 20736

Activity distribution:
- neutral: 15164
- suppressed: 1318
- active: 798

Surface gate distribution:
- closed: 12874
- open: 2492
- caution: 1914

Scenario tag counts:
- wind_reaction: 9698
- dirty_vibration: 5135
- open_water_search: 4654
- heat_finesse: 3432
- clear_subtle: 2807
- cold_slow: 2320
- runoff_streamer: 1626
- current_swing: 1626
- calm_surface: 1440
- low_light_surface: 1322
- warming_search: 516

This is a production snapshot only, so there are no candidate-vs-baseline selected-pick changes. Unsupported exact rows are recorded as unsupported rather than failures.

## Forecast-Day Readiness

| Day offset | Target date | Context | Score | Reliability | Mean | Prior | D-2 | P24 | P72 | P7d | Pressure count | Measured water present | Temp source | Status | Notes |
| ---: | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 0 | 2026-06-15 | coastal | 66 | high | 71.48493299359394 | 68.97559994043908 | 66.20292250900536 | 0.02 | 0.12000000000000001 | 0.59 | 48 | yes | coastal_water_temp | pass | none |
| 1 | 2026-06-16 | freshwater_lake_pond | 45 | high | 73.1899998838737 | 71.48493299359394 | 68.97559994043908 | 0.35 | 0.38999999999999996 | 0.92 | 48 | no | air_daily_mean | pass | none |
| 2 | 2026-06-17 | coastal | 61 | medium | 73.74679123311691 | 73.1899998838737 | 71.48493299359394 | 0.02 | 0.39 | 0.8600000000000001 | 48 | no | air_daily_mean | pass | none |
| 3 | 2026-06-18 | freshwater_lake_pond | 41 | high | 73.09243556311745 | 73.74679123311691 | 73.1899998838737 | 0.02 | 0.39 | 0.53 | 48 | no | air_daily_mean | pass | none |
| 4 | 2026-06-19 | coastal | 65 | medium | 71.46059242620879 | 73.09243556311745 | 73.74679123311691 | 0.08 | 0.12 | 0.59 | 48 | no | air_daily_mean | pass | none |
| 5 | 2026-06-20 | freshwater_lake_pond | 40 | high | 69.32424439769096 | 71.46059242620879 | 73.09243556311745 | 0.02 | 0.12000000000000001 | 0.53 | 48 | no | air_daily_mean | pass | none |
| 6 | 2026-06-21 | coastal | 61 | medium | 67.27989444555315 | 69.32424439769096 | 71.46059242620879 | 0.35 | 0.44999999999999996 | 0.86 | 48 | no | air_daily_mean | pass | none |

Findings:
- Target-day daily means, prior means, precipitation windows, and pressure histories are materialized by day offset 0..6.
- Future coastal/flats rows are materialized with measured-water fields stripped unless the report target date is the day-0 snapshot date.
- Day-6 rows retain forecast-day hourly/cloud/pressure coverage in this fixture and do not silently collapse to current-day weather.
- Local-midnight snapshot rollover assumptions remain app/cache behavior and were noted, not changed.

## Recommendation

**needs focused tuning review; no blocker found by the production-path audit**

## Artifacts

- JSONL: `scripts/audit/todays-bite-integrated-production-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-integrated-production-audit.md`
