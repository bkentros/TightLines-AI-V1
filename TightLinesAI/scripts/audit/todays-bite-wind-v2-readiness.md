# Today's Bite Wind V2 Readiness Audit

Generated: 2026-05-13T13:59:20.799Z

Phase 4C parity mode. Production wind should match `high_wind_penalty_only`; recommender tags remain production behavior.

## Summary

| Metric | Value |
| --- | ---: |
| Fixtures | 20 |
| Passed | 20 |
| Questionable | 0 |
| Failed | 0 |
| Production-vs-experiment wind mismatches | 0 |
| Production-vs-experiment score deltas | 0 |
| Surface gate changes | 0 |
| Selected-pick changes | 0 |
| Normal/moderate selected-pick changes | 0 |
| Broad audit reference | 33 / 14,400 = 0.2% selected-pick changes |
| Recommendation | production parity verified |

## Fixture Results

| Fixture | Status | Score | Tier | Wind | Surface Changed | Picks Changed | Checks |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| lake_light_breeze_still_helpful | pass | 44->44 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | light:0.6 -> light:0.6 | false | false | wind_non_negative:pass, surface_gate_stable:pass, normal_fixture_picks_stable:pass |
| lake_useful_breeze_not_daymaker | pass | 55->55 | moderate-high — conditions favor engaged fish responding to proper presentation->moderate-high — conditions favor engaged fish responding to proper presentation | moderate:1 -> moderate:1 | false | false | still_helpful:pass, not_extreme_daymaker:pass, surface_gate_stable:pass, normal_fixture_picks_stable:pass |
| lake_clear_windy_penalized_more_sensibly | pass | 40->40 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | strong:-0.6 -> strong:-0.6 | false | false | production_experiment_parity:pass, wind_negative:pass, surface_gate_stable:pass |
| lake_severe_wind_strongly_negative | pass | 42->42 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | extreme:-2 -> extreme:-2 | false | false | extreme_negative:pass, surface_gate_stable:pass |
| river_light_breeze_nearly_neutral | pass | 46->46 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | light:0.05 -> light:0.05 | false | false | river_light_small:pass, surface_gate_stable:pass, normal_fixture_picks_stable:pass |
| river_strong_wind_mildly_negative | pass | 44->44 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | strong:-0.4444 -> strong:-0.4444 | false | false | river_strong_negative:pass, river_less_sensitive:pass, surface_gate_stable:pass |
| river_extreme_wind_clearly_negative | pass | 38->38 | low — conditions are working against the bite; deliberate, precise approach needed->low — conditions are working against the bite; deliberate, precise approach needed | extreme:-2 -> extreme:-2 | false | false | river_extreme_floor:pass, surface_gate_stable:pass |
| flats_moderate_wind_still_fishable | pass | 60->60 | moderate-high — conditions favor engaged fish responding to proper presentation->moderate-high — conditions favor engaged fish responding to proper presentation | moderate:0.9 -> moderate:0.9 | false | false | flats_moderate_positive:pass, score_stable:pass |
| flats_strong_wind_penalized | pass | 47->47 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | strong:-0.8316 -> strong:-0.8316 | false | false | flats_strong_negative:pass, production_experiment_parity:pass |
| coastal_moderate_wind_still_useful | pass | 56->56 | moderate-high — conditions favor engaged fish responding to proper presentation->moderate-high — conditions favor engaged fish responding to proper presentation | moderate:1.04 -> moderate:1.04 | false | false | coastal_moderate_positive:pass |
| coastal_extreme_wind_negative | pass | 39->39 | low — conditions are working against the bite; deliberate, precise approach needed->low — conditions are working against the bite; deliberate, precise approach needed | extreme:-1.8227 -> extreme:-1.8227 | false | false | coastal_extreme_negative:pass |
| cold_season_clear_windy_boundary_case | pass | 52->52 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | strong:-0.6 -> strong:-0.6 | false | false | not_improved:pass, surface_gate_stable:pass |
| summer_heat_plus_wind_not_false_active | pass | 49->49 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | strong:-0.8 -> strong:-0.8 | false | false | not_false_active:pass, strong_wind_negative:pass, surface_gate_stable:pass |
| severe_wind_near_35_score_boundary | pass | 42->42 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | extreme:-2 -> extreme:-2 | false | false | no_large_delta:pass, pick_change_limited:pass, surface_gate_stable:pass |
| hourly_daylight_wind_spike_uses_daylight_mean | pass | 52->52 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | light:0.68 -> light:0.68 | false | false | scalar_score_only_small:pass, surface_gate_stable:pass |
| hourly_scalar_conflict_prefers_hourly_daylight_mean | pass | 52->52 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | light:0.6 -> light:0.6 | false | false | score_delta_zero:pass, surface_gate_stable:pass, normal_fixture_picks_stable:pass |
| missing_wind_unchanged | pass | 38->38 | low — conditions are working against the bite; deliberate, precise approach needed->low — conditions are working against the bite; deliberate, precise approach needed | -:- -> -:- | false | false | missing_wind_unchanged:pass, surface_gate_stable:pass, normal_fixture_picks_stable:pass |
| recommender_surface_gate_stability | pass | 50->50 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | strong:-0.3 -> strong:-0.3 | false | false | surface_gate_stable:pass, tags_production_behavior:pass |
| stained_water_windy_reaction_stability | pass | 47->47 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | strong:-0.3 -> strong:-0.3 | false | false | stained_tags_preserved_or_score_boundary:pass, surface_gate_stable:pass |
| clear_water_windy_reaction_stability | pass | 47->47 | moderate — conditions support selective feeding; clean presentation matters->moderate — conditions support selective feeding; clean presentation matters | strong:-0.3 -> strong:-0.3 | false | false | clear_tags_preserved_or_score_boundary:pass, surface_gate_stable:pass |

## Recommender Comparison

| Fixture | Baseline Scenario | V2 Scenario | Baseline Picks | V2 Picks |
| --- | --- | --- | --- | --- |
| lake_light_breeze_still_helpful | neutral/calm/open/calm_surface+clear_subtle+cold_slow | neutral/calm/open/calm_surface+clear_subtle+cold_slow | soft_jerkbait, carolina_rigged_stick_worm, lead_eye_leech, woolly_bugger | soft_jerkbait, carolina_rigged_stick_worm, lead_eye_leech, woolly_bugger |
| lake_useful_breeze_not_daymaker | neutral/breezy/caution/wind_reaction | neutral/breezy/caution/wind_reaction | spinnerbait, weightless_stick_worm, unweighted_baitfish_streamer, deceiver | spinnerbait, weightless_stick_worm, unweighted_baitfish_streamer, deceiver |
| lake_clear_windy_penalized_more_sensibly | neutral/windy/closed/wind_reaction+clear_subtle | neutral/windy/closed/wind_reaction+clear_subtle | soft_jerkbait, carolina_rigged_stick_worm, lead_eye_leech, deceiver | soft_jerkbait, carolina_rigged_stick_worm, lead_eye_leech, deceiver |
| lake_severe_wind_strongly_negative | neutral/windy/closed/wind_reaction | neutral/windy/closed/wind_reaction | medium_diving_crankbait, spinnerbait, baitfish_slider_fly, clouser_minnow | medium_diving_crankbait, spinnerbait, baitfish_slider_fly, clouser_minnow |
| river_light_breeze_nearly_neutral | neutral/breezy/caution/ | neutral/breezy/caution/ | casting_spoon, inline_spinner, jighead_marabou_leech, slim_minnow_streamer | casting_spoon, inline_spinner, jighead_marabou_leech, slim_minnow_streamer |
| river_strong_wind_mildly_negative | neutral/windy/closed/wind_reaction | neutral/windy/closed/wind_reaction | suspending_jerkbait, inline_spinner, baitfish_slider_fly, conehead_streamer | suspending_jerkbait, inline_spinner, baitfish_slider_fly, conehead_streamer |
| river_extreme_wind_clearly_negative | neutral/windy/closed/wind_reaction+cold_slow | neutral/windy/closed/wind_reaction+cold_slow | hair_jig, suspending_jerkbait, woolly_bugger, muddler_sculpin | hair_jig, suspending_jerkbait, woolly_bugger, muddler_sculpin |
| flats_moderate_wind_still_fishable | unsupported | unsupported | - | - |
| flats_strong_wind_penalized | unsupported | unsupported | - | - |
| coastal_moderate_wind_still_useful | unsupported | unsupported | - | - |
| coastal_extreme_wind_negative | unsupported | unsupported | - | - |
| cold_season_clear_windy_boundary_case | neutral/windy/closed/wind_reaction+clear_subtle | neutral/windy/closed/wind_reaction+clear_subtle | carolina_rigged_stick_worm, tube_jig, lead_eye_leech, woolly_bugger | carolina_rigged_stick_worm, tube_jig, lead_eye_leech, woolly_bugger |
| summer_heat_plus_wind_not_false_active | neutral/windy/closed/wind_reaction+clear_subtle | neutral/windy/closed/wind_reaction+clear_subtle | soft_jerkbait, carolina_rigged_stick_worm, lead_eye_leech, clouser_minnow | soft_jerkbait, carolina_rigged_stick_worm, lead_eye_leech, clouser_minnow |
| severe_wind_near_35_score_boundary | neutral/windy/closed/wind_reaction | neutral/windy/closed/wind_reaction | suspending_jerkbait, medium_diving_crankbait, deceiver, clouser_minnow | suspending_jerkbait, medium_diving_crankbait, deceiver, clouser_minnow |
| hourly_daylight_wind_spike_uses_daylight_mean | neutral/breezy/caution/wind_reaction | neutral/breezy/caution/wind_reaction | squarebill_crankbait, paddle_tail_swimbait, unweighted_baitfish_streamer, baitfish_slider_fly | squarebill_crankbait, paddle_tail_swimbait, unweighted_baitfish_streamer, baitfish_slider_fly |
| hourly_scalar_conflict_prefers_hourly_daylight_mean | neutral/breezy/caution/wind_reaction | neutral/breezy/caution/wind_reaction | suspending_jerkbait, spinnerbait, unweighted_baitfish_streamer, baitfish_slider_fly | suspending_jerkbait, spinnerbait, unweighted_baitfish_streamer, baitfish_slider_fly |
| missing_wind_unchanged | neutral/unknown/closed/cold_slow | neutral/unknown/closed/cold_slow | tube_jig, soft_jerkbait, warmwater_crawfish_fly, jighead_marabou_leech | tube_jig, soft_jerkbait, warmwater_crawfish_fly, jighead_marabou_leech |
| recommender_surface_gate_stability | neutral/windy/closed/wind_reaction | neutral/windy/closed/wind_reaction | squarebill_crankbait, weightless_stick_worm, unweighted_baitfish_streamer, clouser_minnow | squarebill_crankbait, weightless_stick_worm, unweighted_baitfish_streamer, clouser_minnow |
| stained_water_windy_reaction_stability | neutral/windy/closed/wind_reaction+dirty_vibration | neutral/windy/closed/wind_reaction+dirty_vibration | weightless_stick_worm, squarebill_crankbait, baitfish_slider_fly, unweighted_baitfish_streamer | weightless_stick_worm, squarebill_crankbait, baitfish_slider_fly, unweighted_baitfish_streamer |
| clear_water_windy_reaction_stability | neutral/windy/closed/wind_reaction | neutral/windy/closed/wind_reaction | squarebill_crankbait, weightless_stick_worm, baitfish_slider_fly, unweighted_baitfish_streamer | squarebill_crankbait, weightless_stick_worm, baitfish_slider_fly, unweighted_baitfish_streamer |

## Questionable Or Failed Checks

| Fixture | Check | Status | Detail |
| --- | --- | --- | --- |
| None | - | - | - |

## Artifacts

- JSONL: `scripts/audit/todays-bite-wind-v2-readiness.jsonl`
- Markdown: `scripts/audit/todays-bite-wind-v2-readiness.md`
