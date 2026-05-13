# Today's Bite Rain / Runoff V2 Production Readiness / Parity Audit

Generated: 2026-05-13T02:53:19.752Z

Phase 3C production parity check. Production rain/runoff V2 should match the experiment modules exactly. scoreDay, report copy, and recommender selection logic are untouched.

## Summary

| Metric | Value |
| --- | ---: |
| Fixtures | 15 |
| Passed | 15 |
| Questionable | 0 |
| Failed | 0 |
| Production vs experiment precipitation mismatches | 0 |
| Production vs experiment runoff mismatches | 0 |
| Production vs experiment score deltas != 0 | 0 |
| Recommender selected-pick changes | 0 |
| Recommendation | ready for production wiring |

## Fixture Results

| Fixture | Status | Region | Month | Context | Score | Precip | Runoff | Checks | Notes |
| --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| lake_light_active_rain | pass | midwest_interior | 5 | freshwater_lake_pond | 61 -> 61 | recent_rain:0.05 -> recent_rain:0.05 | -:- -> -:- | pass:v2_precip_not_active_disruption<br>pass:v2_precip_mild | All qualitative checks passed. |
| lake_heavy_active_rain | pass | midwest_interior | 5 | freshwater_lake_pond | 54 -> 54 | active_disruption:-1.4 -> active_disruption:-1.4 | -:- -> -:- | pass:v2_precip_active_disruption<br>pass:v2_precip_strong_negative | All qualitative checks passed. |
| lake_long_wet_week_low_24h | pass | midwest_interior | 5 | freshwater_lake_pond | 52 -> 52 | recent_rain:-0.9071 -> recent_rain:-0.9071 | -:- -> -:- | pass:v2_precip_not_dry_positive<br>pass:v2_precip_negative_or_neutral | All qualitative checks passed. |
| coastal_light_rain | pass | gulf_coast | 4 | coastal | 62 -> 62 | recent_rain:0 -> recent_rain:0 | -:- -> -:- | pass:v2_precip_not_active_disruption<br>pass:precip_weight_below_tide_or_wind | All qualitative checks passed. |
| flats_wet_baseline | pass | florida | 6 | coastal_flats_estuary | 55 -> 55 | recent_rain:-0.6739 -> recent_rain:-0.6739 | -:- -> -:- | pass:v2_precip_negative_or_neutral<br>pass:flats_wet_sensitive | All qualitative checks passed. |
| river_missing_7d | pass | northeast | 5 | freshwater_river | 61 -> 61 | -:- -> -:- | -:- -> -:- | pass:v2_runoff_omitted | All qualitative checks passed. |
| river_dry_clear_stable | pass | northeast | 5 | freshwater_river | 63 -> 63 | -:- -> -:- | perfect_clear:0.55 -> perfect_clear:0.55 | pass:v2_runoff_positive_modest<br>pass:score_delta_not_dominant | All qualitative checks passed. |
| river_light_active_stable_windows | pass | northeast | 5 | freshwater_river | 63 -> 63 | -:- -> -:- | stable:0.245 -> stable:0.245 | pass:v2_runoff_not_blown_out<br>pass:v2_water_movement_stable | All qualitative checks passed. |
| river_saturated_baseline | pass | northeast | 5 | freshwater_river | 39 -> 39 | -:- -> -:- | blown_out:-2 -> blown_out:-2 | pass:v2_runoff_blown_or_strong_negative | All qualitative checks passed. |
| river_flashy_24h_southwest | pass | southwest_desert | 8 | freshwater_river | 28 -> 28 | -:- -> -:- | blown_out:-1.588 -> blown_out:-1.588 | pass:v2_runoff_elevated_or_negative | All qualitative checks passed. |
| pnw_spring_wet_trend | pass | pacific_northwest | 5 | freshwater_river | 57 -> 57 | -:- -> -:- | elevated:-1.1167 -> elevated:-1.1167 | pass:v2_runoff_snowmelt_risk | All qualitative checks passed. |
| florida_river_moderate_rain | pass | florida | 7 | freshwater_river | 43 -> 43 | -:- -> -:- | slightly_elevated:-0.05 -> slightly_elevated:-0.05 | pass:v2_runoff_not_blown_out<br>pass:florida_tolerant | All qualitative checks passed. |
| inland_northwest_recent_rain_edge | pass | inland_northwest | 5 | freshwater_river | 54 -> 54 | -:- -> -:- | slightly_elevated:-0.4625 -> slightly_elevated:-0.4625 | pass:edge_case_documented_negative | All qualitative checks passed. |
| coastal_missing_p24_no_rate | pass | gulf_coast | 5 | coastal | 58 -> 58 | -:- -> -:- | -:- -> -:- | pass:v2_precip_omitted | All qualitative checks passed. |
| flats_missing_p72_no_rate | pass | florida | 5 | coastal_flats_estuary | 56 -> 56 | -:- -> -:- | -:- -> -:- | pass:v2_precip_omitted | All qualitative checks passed. |

## Recommender-Facing Fixture Changes

| Fixture | Species | Activity | Water Movement | Surface Gate | Tags | Picks Changed | Explanation | Picks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lake_light_active_rain | largemouth_bass | neutral -> neutral | not_applicable -> not_applicable | open -> open | low_light_surface, wind_reaction, dirty_vibration -> low_light_surface, wind_reaction, dirty_vibration | false | no selected-pick change | weightless_stick_worm, suspending_jerkbait, popper_fly, clouser_minnow -> weightless_stick_worm, suspending_jerkbait, popper_fly, clouser_minnow |
| lake_heavy_active_rain | largemouth_bass | neutral -> neutral | not_applicable -> not_applicable | open -> open | low_light_surface, wind_reaction, dirty_vibration -> low_light_surface, wind_reaction, dirty_vibration | false | no selected-pick change | weightless_stick_worm, suspending_jerkbait, popper_fly, clouser_minnow -> weightless_stick_worm, suspending_jerkbait, popper_fly, clouser_minnow |
| lake_long_wet_week_low_24h | largemouth_bass | neutral -> neutral | not_applicable -> not_applicable | caution -> caution | wind_reaction, dirty_vibration -> wind_reaction, dirty_vibration | false | no selected-pick change | suspending_jerkbait, spinnerbait, baitfish_slider_fly, deceiver -> suspending_jerkbait, spinnerbait, baitfish_slider_fly, deceiver |
| coastal_light_rain | unsupported | - | - | - | - | - | - |
| flats_wet_baseline | unsupported | - | - | - | - | - | - |
| river_missing_7d | trout | neutral -> neutral | unknown -> unknown | closed -> closed | wind_reaction, dirty_vibration, open_water_search -> wind_reaction, dirty_vibration, open_water_search | false | no selected-pick change | casting_spoon, inline_spinner, clouser_minnow, woolly_bugger -> casting_spoon, inline_spinner, clouser_minnow, woolly_bugger |
| river_dry_clear_stable | trout | neutral -> neutral | stable -> stable | closed -> closed | wind_reaction, dirty_vibration, open_water_search -> wind_reaction, dirty_vibration, open_water_search | false | no selected-pick change | casting_spoon, inline_spinner, clouser_minnow, woolly_bugger -> casting_spoon, inline_spinner, clouser_minnow, woolly_bugger |
| river_light_active_stable_windows | trout | neutral -> neutral | stable -> stable | closed -> closed | wind_reaction, dirty_vibration, open_water_search -> wind_reaction, dirty_vibration, open_water_search | false | no selected-pick change | casting_spoon, inline_spinner, clouser_minnow, woolly_bugger -> casting_spoon, inline_spinner, clouser_minnow, woolly_bugger |
| river_saturated_baseline | trout | neutral -> neutral | blown_out -> blown_out | closed -> closed | wind_reaction, dirty_vibration, runoff_streamer, current_swing, open_water_search -> wind_reaction, dirty_vibration, runoff_streamer, current_swing, open_water_search | false | no selected-pick change | inline_spinner, casting_spoon, sculpin_streamer, conehead_streamer -> inline_spinner, casting_spoon, sculpin_streamer, conehead_streamer |
| river_flashy_24h_southwest | trout | error: Daily picks seasonal matrix has no exact row for trout x southwest_desert x month 8 x freshwater_river. | - | - | - | - | - |
| pnw_spring_wet_trend | trout | neutral -> neutral | elevated_or_dirty -> elevated_or_dirty | closed -> closed | wind_reaction, dirty_vibration, runoff_streamer, current_swing, open_water_search -> wind_reaction, dirty_vibration, runoff_streamer, current_swing, open_water_search | false | no selected-pick change | inline_spinner, casting_spoon, conehead_streamer, sculpin_streamer -> inline_spinner, casting_spoon, conehead_streamer, sculpin_streamer |
| florida_river_moderate_rain | trout | error: Daily picks seasonal matrix has no exact row for trout x florida x month 7 x freshwater_river. | - | - | - | - | - |
| inland_northwest_recent_rain_edge | trout | neutral -> neutral | elevated_or_dirty -> elevated_or_dirty | closed -> closed | wind_reaction, dirty_vibration, runoff_streamer, current_swing, open_water_search -> wind_reaction, dirty_vibration, runoff_streamer, current_swing, open_water_search | false | no selected-pick change | inline_spinner, hair_jig, zonker_streamer, sculpin_streamer -> inline_spinner, hair_jig, zonker_streamer, sculpin_streamer |
| coastal_missing_p24_no_rate | unsupported | - | - | - | - | - | - |
| flats_missing_p72_no_rate | unsupported | - | - | - | - | - | - |

## Questionable Or Failed Fixtures

None.

## Recommendation

ready for production wiring

## Artifacts

- JSONL: `scripts/audit/todays-bite-rain-runoff-v2-readiness.jsonl`
- Markdown: `scripts/audit/todays-bite-rain-runoff-v2-readiness.md`
