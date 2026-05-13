# Today's Bite Temperature V2 Readiness Audit

Generated: 2026-05-13T01:18:03.432Z

Temperature V2 is production-wired. This audit compares production temperature output against the experiment module for named qualitative fixtures and verifies the production behavior remains ready.

## Recommendation

ready for production wiring

## Summary

| Metric | Value |
| --- | ---: |
| Fixture count | 16 |
| Passed fixtures | 16 |
| Failed/questionable fixtures | 0 |
| Supported recommender fixtures | 12 |
| Recommender-facing changed fixtures | 0 |

## V2 Constants

| Constant | Value |
| --- | ---: |
| bandWeight | 0.9 |
| stableBonus | 0.05 |
| maxTrendComponent | 0.7 |

## Fixture Pass/Fail

| Result | Fixture | Region | Month | Context | Baseline Temp | V2 Temp | Score Delta | Failed Checks |
| --- | --- | --- | ---: | --- | ---: | ---: | ---: | --- |
| PASS | northern_spring_warming_after_cold | great_lakes_upper_midwest | 4 | freshwater_lake_pond | 2 | 2 | 0 | - |
| PASS | northern_spring_sudden_cold_front | great_lakes_upper_midwest | 4 | freshwater_lake_pond | -1.7 | -1.7000000000000002 | 0 | - |
| PASS | northern_winter_stable_cold | northeast | 1 | freshwater_lake_pond | -0.85 | -0.85 | 0 | - |
| PASS | mountain_summer_cool_stable_trout_river | mountain_alpine | 7 | freshwater_river | 0.3071 | 0.30714285714285705 | 0 | - |
| PASS | florida_summer_heat_limited_stable_heat | florida | 8 | freshwater_lake_pond | -0.67 | -0.67 | 0 | - |
| PASS | florida_summer_cooling_relief_after_heat | florida | 8 | freshwater_lake_pond | 1.6 | 1.6 | 0 | - |
| PASS | gulf_southeast_warm_stable_spring_lake | gulf_coast | 4 | freshwater_lake_pond | 0.23 | 0.23000000000000015 | 0 | - |
| PASS | desert_summer_heat_bright_calm | southwest_desert | 7 | freshwater_lake_pond | -0.67 | -0.67 | 0 | - |
| PASS | great_lakes_fall_cooling_trend | great_lakes_upper_midwest | 10 | freshwater_lake_pond | 0.68 | 0.68 | 0 | - |
| PASS | river_cold_front_shock_runoff_stable | appalachian | 3 | freshwater_river | -2 | -2 | 0 | - |
| PASS | river_warming_trend_stable_flow | midwest_interior | 4 | freshwater_river | 0.7 | 0.7 | 0 | - |
| PASS | coastal_measured_water_stable_optimal | pacific_northwest | 5 | coastal | 1.85 | 1.85 | 0 | - |
| PASS | coastal_measured_water_sharp_cooldown | northern_california | 6 | coastal | -2 | -2 | 0 | - |
| PASS | coastal_air_fallback_no_measured_water | southeast_atlantic | 5 | coastal | -1.03 | -1.03 | 0 | - |
| PASS | flats_estuary_warm_water_strong_tide | florida | 6 | coastal_flats_estuary | -1.3 | -1.3 | 0 | - |
| PASS | missing_history_no_stability_bonus | midwest_interior | 5 | freshwater_lake_pond | -0.45 | -0.45 | 0 | - |

## Questionable Fixtures

| Fixture | Expected Direction | Failed Checks |
| --- | --- | --- |
| None | - | - |

## Top Score Deltas

| Fixture | Region | Month | Context | Baseline Score | V2 Score | Delta | Baseline Temp | V2 Temp |
| --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |
| northern_spring_warming_after_cold | great_lakes_upper_midwest | 4 | freshwater_lake_pond | 77 | 77 | 0 | 2 | 2 |
| northern_spring_sudden_cold_front | great_lakes_upper_midwest | 4 | freshwater_lake_pond | 39 | 39 | 0 | -1.7 | -1.7000000000000002 |
| northern_winter_stable_cold | northeast | 1 | freshwater_lake_pond | 50 | 50 | 0 | -0.85 | -0.85 |
| mountain_summer_cool_stable_trout_river | mountain_alpine | 7 | freshwater_river | 64 | 64 | 0 | 0.3071 | 0.30714285714285705 |
| florida_summer_heat_limited_stable_heat | florida | 8 | freshwater_lake_pond | 44 | 44 | 0 | -0.67 | -0.67 |
| florida_summer_cooling_relief_after_heat | florida | 8 | freshwater_lake_pond | 75 | 75 | 0 | 1.6 | 1.6 |
| gulf_southeast_warm_stable_spring_lake | gulf_coast | 4 | freshwater_lake_pond | 59 | 59 | 0 | 0.23 | 0.23000000000000015 |
| desert_summer_heat_bright_calm | southwest_desert | 7 | freshwater_lake_pond | 42 | 42 | 0 | -0.67 | -0.67 |
| great_lakes_fall_cooling_trend | great_lakes_upper_midwest | 10 | freshwater_lake_pond | 65 | 65 | 0 | 0.68 | 0.68 |
| river_cold_front_shock_runoff_stable | appalachian | 3 | freshwater_river | 43 | 43 | 0 | -2 | -2 |

## Recommender-Facing Changes

Daily-picks comparison is included only where the fixture context/species is supported by the current daily-picks engine.

| Changed | Fixture | Species | Activity | Thermal Mode | Surface Gate | Baseline Picks | V2 Picks |
| --- | --- | --- | --- | --- | --- | --- | --- |
| NO | northern_spring_warming_after_cold | largemouth_bass | active -> active | warming -> warming | closed -> closed | suspending_jerkbait, medium_diving_crankbait, baitfish_slider_fly, woolly_bugger | suspending_jerkbait, medium_diving_crankbait, baitfish_slider_fly, woolly_bugger |
| NO | northern_spring_sudden_cold_front | largemouth_bass | neutral -> neutral | cold_slow -> cold_slow | closed -> closed | suspending_jerkbait, tube_jig, warmwater_crawfish_fly, woolly_bugger | suspending_jerkbait, tube_jig, warmwater_crawfish_fly, woolly_bugger |
| NO | northern_winter_stable_cold | largemouth_bass | neutral -> neutral | cold_slow -> cold_slow | closed -> closed | carolina_rigged_stick_worm, tube_jig, jighead_marabou_leech, woolly_bugger | carolina_rigged_stick_worm, tube_jig, jighead_marabou_leech, woolly_bugger |
| NO | mountain_summer_cool_stable_trout_river | trout | neutral -> neutral | stable -> stable | caution -> caution | suspending_jerkbait, inline_spinner, baitfish_slider_fly, zonker_streamer | suspending_jerkbait, inline_spinner, baitfish_slider_fly, zonker_streamer |
| NO | florida_summer_heat_limited_stable_heat | largemouth_bass | neutral -> neutral | heat_limited -> heat_limited | open -> open | drop_shot_minnow, suspending_jerkbait, deceiver, woolly_bugger | drop_shot_minnow, suspending_jerkbait, deceiver, woolly_bugger |
| NO | florida_summer_cooling_relief_after_heat | largemouth_bass | active -> active | cooling_or_shock -> cooling_or_shock | open -> open | lipless_crankbait, bladed_jig, clouser_minnow, unweighted_baitfish_streamer | lipless_crankbait, bladed_jig, clouser_minnow, unweighted_baitfish_streamer |
| NO | gulf_southeast_warm_stable_spring_lake | largemouth_bass | neutral -> neutral | stable -> stable | caution -> caution | soft_jerkbait, medium_diving_crankbait, baitfish_slider_fly, game_changer | soft_jerkbait, medium_diving_crankbait, baitfish_slider_fly, game_changer |
| NO | desert_summer_heat_bright_calm | largemouth_bass | neutral -> neutral | heat_limited -> heat_limited | open -> open | drop_shot_minnow, suspending_jerkbait, popper_fly, clouser_minnow | drop_shot_minnow, suspending_jerkbait, popper_fly, clouser_minnow |
| NO | great_lakes_fall_cooling_trend | largemouth_bass | neutral -> neutral | cooling_or_shock -> cooling_or_shock | closed -> closed | soft_jerkbait, lipless_crankbait, clouser_minnow, deceiver | soft_jerkbait, lipless_crankbait, clouser_minnow, deceiver |
| NO | river_cold_front_shock_runoff_stable | trout | neutral -> neutral | cold_slow -> cold_slow | closed -> closed | suspending_jerkbait, blade_bait, woolly_bugger, zonker_streamer | suspending_jerkbait, blade_bait, woolly_bugger, zonker_streamer |
| NO | river_warming_trend_stable_flow | trout | neutral -> neutral | warming -> warming | closed -> closed | inline_spinner, suspending_jerkbait, feather_jig_leech, woolly_bugger | inline_spinner, suspending_jerkbait, feather_jig_leech, woolly_bugger |
| NO | missing_history_no_stability_bonus | largemouth_bass | neutral -> neutral | stable -> stable | caution -> caution | suspending_jerkbait, bladed_jig, baitfish_slider_fly, articulated_baitfish_streamer | suspending_jerkbait, bladed_jig, baitfish_slider_fly, articulated_baitfish_streamer |

## Artifacts

- JSONL: `scripts/audit/todays-bite-temperature-v2-readiness.jsonl`
- Markdown: `scripts/audit/todays-bite-temperature-v2-readiness.md`
