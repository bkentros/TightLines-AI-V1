# Today's Bite Atmospherics Current-State Audit

Generated: 2026-05-13T11:40:49.299Z

Phase 4A audit-only. Production scoring, report copy, recommender logic, forecast behavior, temperature, rain/runoff, and tide logic are untouched.

## Summary

| Metric | Value |
| --- | ---: |
| Total rows | 34560 |
| Regions | 18 |
| Months | 12 |
| Contexts | 4 |
| Archetypes | 20 |
| Water clarity variants | 2 |
| Rows with questionable flags | 14642 |
| Recommender valid rows | 14400 |
| Recommender error rows | 2880 |

## Questionable Flag Counts

| Flag | Rows |
| --- | ---: |
| wind_reaction_tag_too_frequent | 9782 |
| open_water_search_tag_too_frequent | 4742 |
| surface_gate_changes_from_light_wind | 3334 |
| bright_clear_penalty_during_cold_or_cool_water_questionable | 2680 |
| overcast_too_strong_as_daymaker | 1466 |
| light_breeze_triggers_wind_reaction | 1328 |
| heavy_overcast_windy_not_suppressed_enough | 968 |
| severe_wind_not_suppressed_enough | 930 |
| clear_calm_surface_or_clear_subtle_questionable | 511 |
| verbal_driver_mismatch | 10 |
| missing_wind_or_cloud_overconfident | 0 |
| pressure_fast_fall_not_negative_enough | 0 |
| pressure_insufficient_history_overconfident | 0 |
| pressure_stable_too_positive | 0 |
| pressure_volatile_not_negative_enough | 0 |

## Pressure Label Distribution

| Label | Rows |
| --- | ---: |
| stable_neutral | 25920 |
| falling_slow | 3456 |
| falling_hard | 1728 |
| rising_fast | 1728 |
| volatile | 1728 |

## Light Label Distribution

| Label | Rows |
| --- | ---: |
| mixed | 13824 |
| low_light | 8640 |
| glare | 7680 |
| heavy_overcast | 1728 |
| omitted | 1728 |
| bright | 960 |

## Wind Label Distribution

| Label | Rows |
| --- | ---: |
| moderate | 12096 |
| calm | 6912 |
| strong | 6912 |
| light | 5184 |
| extreme | 1728 |
| omitted | 1728 |

## Score Distribution By Archetype

| Archetype | Avg Score | Min | Max |
| --- | ---: | ---: | ---: |
| stable_pressure_mixed_light_light_wind | 59.2 | 41 | 73 |
| slow_falling_pressure_overcast_breezy | 68.7 | 48 | 85 |
| fast_falling_pressure_clear_breezy | 56.7 | 39 | 72 |
| volatile_pressure_mixed_wind | 48.1 | 28 | 61 |
| rising_pressure_post_front_clear_calm | 53.1 | 36 | 67 |
| insufficient_pressure_history | 62.6 | 43 | 77 |
| clear_calm | 54.0 | 38 | 67 |
| clear_breezy | 59.0 | 41 | 74 |
| clear_windy | 51.9 | 36 | 65 |
| mixed_light_breezy | 61.2 | 41 | 75 |
| overcast_calm | 59.0 | 42 | 74 |
| overcast_breezy | 64.0 | 44 | 79 |
| heavy_overcast_windy | 56.6 | 41 | 73 |
| low_light_calm | 58.3 | 41 | 73 |
| low_light_windy | 54.7 | 39 | 70 |
| severe_wind | 45.9 | 29 | 62 |
| missing_cloud | 61.8 | 39 | 79 |
| missing_wind | 57.4 | 35 | 74 |
| hourly_daylight_wind_spike | 59.6 | 41 | 73 |
| hourly_daylight_wind_mean_vs_scalar_conflict | 59.2 | 41 | 73 |

## Recommender Coupling Summary

| Metric | Value |
| --- | ---: |
| Valid rows | 14400 |
| Error rows | 2880 |

### Surface Gate Distribution

| Surface Gate | Rows |
| --- | ---: |
| closed | 10160 |
| open | 2146 |
| caution | 2094 |

### Wind Mode Distribution

| Wind Mode | Rows |
| --- | ---: |
| breezy | 6448 |
| calm | 3632 |
| windy | 3600 |
| unknown | 720 |

### Light Mode Distribution

| Light Mode | Rows |
| --- | ---: |
| mixed | 5760 |
| low_light | 4320 |
| glare | 2810 |
| bright | 790 |
| unknown | 720 |

### Pressure Mode Distribution

| Pressure Mode | Rows |
| --- | ---: |
| stable | 10800 |
| falling | 2160 |
| rising | 720 |
| unstable | 720 |

### Scenario Tag Counts

| Tag | Rows |
| --- | ---: |
| wind_reaction | 9782 |
| dirty_vibration | 4891 |
| open_water_search | 4742 |
| clear_subtle | 2797 |
| cold_slow | 1760 |
| calm_surface | 1530 |
| heat_finesse | 1480 |
| low_light_surface | 1220 |

## Selected-Pick Sensitivity Samples

| Region | Month | Context | Archetype | Clear Tags | Stained Tags | Clear Picks | Stained Picks |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| northeast | 1 | freshwater_lake_pond | stable_pressure_mixed_light_light_wind | clear_subtle |  | carolina_rigged_stick_worm, tube_jig, lead_eye_leech, woolly_bugger | ned_rig, texas_rigged_soft_plastic_craw, jighead_marabou_leech, woolly_bugger |
| northeast | 1 | freshwater_lake_pond | slow_falling_pressure_overcast_breezy | wind_reaction, open_water_search | wind_reaction, dirty_vibration, open_water_search | lipless_crankbait, blade_bait, game_changer, articulated_baitfish_streamer | blade_bait, suspending_jerkbait, deceiver, lead_eye_leech |
| northeast | 1 | freshwater_lake_pond | fast_falling_pressure_clear_breezy | wind_reaction, clear_subtle, open_water_search | wind_reaction, dirty_vibration, open_water_search | carolina_rigged_stick_worm, tube_jig, lead_eye_leech, game_changer | blade_bait, bladed_jig, deceiver, jighead_marabou_leech |
| northeast | 1 | freshwater_lake_pond | volatile_pressure_mixed_wind | wind_reaction | wind_reaction, dirty_vibration | carolina_rigged_stick_worm, deep_diving_crankbait, game_changer, jighead_marabou_leech | compact_flipping_jig, lipless_crankbait, clouser_minnow, articulated_baitfish_streamer |
| northeast | 1 | freshwater_lake_pond | rising_pressure_post_front_clear_calm | clear_subtle |  | carolina_rigged_stick_worm, tube_jig, lead_eye_leech, clouser_minnow | drop_shot_minnow, shaky_head_worm, jighead_marabou_leech, woolly_bugger |
| northeast | 1 | freshwater_lake_pond | insufficient_pressure_history | wind_reaction, open_water_search | wind_reaction, dirty_vibration, open_water_search | lipless_crankbait, carolina_rigged_stick_worm, game_changer, lead_eye_leech | deep_diving_crankbait, lipless_crankbait, game_changer, deceiver |
| northeast | 1 | freshwater_lake_pond | clear_calm | clear_subtle |  | carolina_rigged_stick_worm, tube_jig, lead_eye_leech, clouser_minnow | texas_rigged_soft_plastic_craw, drop_shot_minnow, clouser_minnow, lead_eye_leech |
| northeast | 1 | freshwater_lake_pond | clear_breezy | wind_reaction, clear_subtle, open_water_search | wind_reaction, dirty_vibration, open_water_search | carolina_rigged_stick_worm, tube_jig, lead_eye_leech, woolly_bugger | compact_flipping_jig, carolina_rigged_stick_worm, deceiver, lead_eye_leech |
| northeast | 1 | freshwater_lake_pond | clear_windy | wind_reaction, clear_subtle | wind_reaction, dirty_vibration | carolina_rigged_stick_worm, tube_jig, lead_eye_leech, woolly_bugger | ned_rig, medium_diving_crankbait, feather_jig_leech, clouser_minnow |
| northeast | 1 | freshwater_lake_pond | mixed_light_breezy | wind_reaction, open_water_search | wind_reaction, dirty_vibration, open_water_search | deep_diving_crankbait, carolina_rigged_stick_worm, clouser_minnow, lead_eye_leech | suspending_jerkbait, deep_diving_crankbait, game_changer, rabbit_strip_leech |
| northeast | 1 | freshwater_lake_pond | overcast_calm | clear_subtle |  | carolina_rigged_stick_worm, tube_jig, lead_eye_leech, woolly_bugger | ned_rig, drop_shot_minnow, feather_jig_leech, woolly_bugger |
| northeast | 1 | freshwater_lake_pond | overcast_breezy | wind_reaction, open_water_search | wind_reaction, dirty_vibration, open_water_search | tube_jig, carolina_rigged_stick_worm, deceiver, articulated_baitfish_streamer | lipless_crankbait, suspending_jerkbait, game_changer, jighead_marabou_leech |
| northeast | 1 | freshwater_lake_pond | heavy_overcast_windy | wind_reaction | wind_reaction, dirty_vibration | suspending_jerkbait, medium_diving_crankbait, woolly_bugger, feather_jig_leech | suspending_jerkbait, bladed_jig, game_changer, woolly_bugger |
| northeast | 1 | freshwater_lake_pond | low_light_calm | clear_subtle |  | carolina_rigged_stick_worm, tube_jig, lead_eye_leech, woolly_bugger | blade_bait, drop_shot_minnow, lead_eye_leech, articulated_baitfish_streamer |
| northeast | 1 | freshwater_lake_pond | low_light_windy | wind_reaction | wind_reaction, dirty_vibration | texas_rigged_soft_plastic_craw, deep_diving_crankbait, feather_jig_leech, clouser_minnow | suspending_jerkbait, medium_diving_crankbait, clouser_minnow, feather_jig_leech |
| northeast | 1 | freshwater_lake_pond | severe_wind | wind_reaction | wind_reaction, dirty_vibration | ned_rig, finesse_jig, feather_jig_leech, deceiver | blade_bait, spinnerbait, deceiver, rabbit_strip_leech |
| northeast | 1 | freshwater_lake_pond | missing_cloud | wind_reaction, open_water_search | wind_reaction, dirty_vibration, open_water_search | lipless_crankbait, tube_jig, deceiver, game_changer | suspending_jerkbait, blade_bait, game_changer, jighead_marabou_leech |
| northeast | 1 | freshwater_lake_pond | missing_wind |  |  | drop_shot_minnow, suspending_jerkbait, deceiver, feather_jig_leech | texas_rigged_soft_plastic_craw, shaky_head_worm, woolly_bugger, clouser_minnow |
| northeast | 1 | freshwater_lake_pond | hourly_daylight_wind_spike | wind_reaction, open_water_search | wind_reaction, dirty_vibration, open_water_search | suspending_jerkbait, tube_jig, clouser_minnow, jighead_marabou_leech | medium_diving_crankbait, suspending_jerkbait, game_changer, jighead_marabou_leech |
| northeast | 1 | freshwater_lake_pond | hourly_daylight_wind_mean_vs_scalar_conflict | wind_reaction, open_water_search | wind_reaction, dirty_vibration, open_water_search | blade_bait, deep_diving_crankbait, game_changer, clouser_minnow | deep_diving_crankbait, suspending_jerkbait, articulated_baitfish_streamer, rabbit_strip_leech |

## Representative Questionable Samples

| Region | Month | Context | Archetype | Clarity | Score | Pressure | Light | Wind | Flags |
| --- | ---: | --- | --- | --- | ---: | --- | --- | --- | --- |
| northeast | 1 | freshwater_lake_pond | slow_falling_pressure_overcast_breezy | clear | 72 | falling_slow:0.99 | low_light:0.875 | moderate:1 | wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | slow_falling_pressure_overcast_breezy | stained | 72 | falling_slow:0.99 | low_light:0.875 | moderate:1 | wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | fast_falling_pressure_clear_breezy | clear | 53 | falling_hard:-0.55 | glare:-0.91 | moderate:1 | bright_clear_penalty_during_cold_or_cool_water_questionable, wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | fast_falling_pressure_clear_breezy | stained | 53 | falling_hard:-0.55 | glare:-0.91 | moderate:1 | bright_clear_penalty_during_cold_or_cool_water_questionable, wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | volatile_pressure_mixed_wind | clear | 47 | volatile:-2 | mixed:0.075 | strong:0.16 | wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | volatile_pressure_mixed_wind | stained | 47 | volatile:-2 | mixed:0.075 | strong:0.16 | wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | rising_pressure_post_front_clear_calm | clear | 50 | rising_fast:-0.4611 | glare:-0.91 | calm:0.2667 | bright_clear_penalty_during_cold_or_cool_water_questionable |
| northeast | 1 | freshwater_lake_pond | rising_pressure_post_front_clear_calm | stained | 50 | rising_fast:-0.4611 | glare:-0.91 | calm:0.2667 | bright_clear_penalty_during_cold_or_cool_water_questionable |
| northeast | 1 | freshwater_lake_pond | insufficient_pressure_history | clear | 64 | falling_slow:0.51 | mixed:0.075 | moderate:0.84 | wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | insufficient_pressure_history | stained | 64 | falling_slow:0.51 | mixed:0.075 | moderate:0.84 | wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | clear_calm | clear | 52 | stable_neutral:0 | glare:-0.91 | calm:0.1 | clear_calm_surface_or_clear_subtle_questionable, bright_clear_penalty_during_cold_or_cool_water_questionable |
| northeast | 1 | freshwater_lake_pond | clear_calm | stained | 52 | stable_neutral:0 | glare:-0.91 | calm:0.1 | bright_clear_penalty_during_cold_or_cool_water_questionable |
| northeast | 1 | freshwater_lake_pond | clear_breezy | clear | 57 | stable_neutral:0 | glare:-0.91 | moderate:1 | bright_clear_penalty_during_cold_or_cool_water_questionable, wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | clear_breezy | stained | 57 | stable_neutral:0 | glare:-0.91 | moderate:1 | bright_clear_penalty_during_cold_or_cool_water_questionable, wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | clear_windy | clear | 50 | stable_neutral:0 | glare:-0.91 | strong:-0.2 | bright_clear_penalty_during_cold_or_cool_water_questionable, wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | clear_windy | stained | 50 | stable_neutral:0 | glare:-0.91 | strong:-0.2 | bright_clear_penalty_during_cold_or_cool_water_questionable, wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | mixed_light_breezy | clear | 62 | stable_neutral:0 | mixed:0.075 | moderate:1 | wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | mixed_light_breezy | stained | 62 | stable_neutral:0 | mixed:0.075 | moderate:1 | wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | overcast_breezy | clear | 66 | stable_neutral:0 | low_light:0.825 | moderate:1 | wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | overcast_breezy | stained | 66 | stable_neutral:0 | low_light:0.825 | moderate:1 | wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | heavy_overcast_windy | clear | 60 | stable_neutral:0 | heavy_overcast:1.0833 | strong:-0.45 | overcast_too_strong_as_daymaker, heavy_overcast_windy_not_suppressed_enough, wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | heavy_overcast_windy | stained | 60 | stable_neutral:0 | heavy_overcast:1.0833 | strong:-0.45 | overcast_too_strong_as_daymaker, heavy_overcast_windy_not_suppressed_enough, wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | low_light_windy | clear | 57 | stable_neutral:0 | low_light:0.675 | strong:-0.45 | wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | low_light_windy | stained | 57 | stable_neutral:0 | low_light:0.675 | strong:-0.45 | wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | severe_wind | clear | 47 | stable_neutral:0 | mixed:0.075 | extreme:-1.825 | severe_wind_not_suppressed_enough, wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | severe_wind | stained | 47 | stable_neutral:0 | mixed:0.075 | extreme:-1.825 | severe_wind_not_suppressed_enough, wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | missing_cloud | clear | 63 | stable_neutral:0 | -:- | moderate:0.84 | wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | missing_cloud | stained | 63 | stable_neutral:0 | -:- | moderate:0.84 | wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | hourly_daylight_wind_spike | clear | 60 | stable_neutral:0 | mixed:0.075 | light:0.68 | light_breeze_triggers_wind_reaction, wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | hourly_daylight_wind_spike | stained | 60 | stable_neutral:0 | mixed:0.075 | light:0.68 | light_breeze_triggers_wind_reaction, wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | hourly_daylight_wind_mean_vs_scalar_conflict | clear | 60 | stable_neutral:0 | mixed:0.075 | light:0.6 | light_breeze_triggers_wind_reaction, wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_lake_pond | hourly_daylight_wind_mean_vs_scalar_conflict | stained | 60 | stable_neutral:0 | mixed:0.075 | light:0.6 | light_breeze_triggers_wind_reaction, wind_reaction_tag_too_frequent, open_water_search_tag_too_frequent |
| northeast | 1 | freshwater_river | slow_falling_pressure_overcast_breezy | clear | 66 | falling_slow:0.99 | low_light:0.875 | moderate:0.15 | wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_river | slow_falling_pressure_overcast_breezy | stained | 66 | falling_slow:0.99 | low_light:0.875 | moderate:0.15 | wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_river | fast_falling_pressure_clear_breezy | clear | 52 | falling_hard:-0.55 | glare:-0.91 | moderate:0.15 | bright_clear_penalty_during_cold_or_cool_water_questionable, wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_river | fast_falling_pressure_clear_breezy | stained | 52 | falling_hard:-0.55 | glare:-0.91 | moderate:0.15 | bright_clear_penalty_during_cold_or_cool_water_questionable, wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_river | volatile_pressure_mixed_wind | clear | 49 | volatile:-2 | mixed:0.075 | strong:-0.2 | wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_river | volatile_pressure_mixed_wind | stained | 49 | volatile:-2 | mixed:0.075 | strong:-0.2 | wind_reaction_tag_too_frequent |
| northeast | 1 | freshwater_river | rising_pressure_post_front_clear_calm | clear | 52 | rising_fast:-0.4611 | glare:-0.91 | calm:0 | bright_clear_penalty_during_cold_or_cool_water_questionable |
| northeast | 1 | freshwater_river | rising_pressure_post_front_clear_calm | stained | 52 | rising_fast:-0.4611 | glare:-0.91 | calm:0 | bright_clear_penalty_during_cold_or_cool_water_questionable |

## Recommendation

Tune wind/recommender wind coupling first: wind-related tags and surface gates are the largest coupling surface in this audit.

## Artifacts

- JSONL: `scripts/audit/todays-bite-atmospherics-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-atmospherics-audit.md`
