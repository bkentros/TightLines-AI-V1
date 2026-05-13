# FinFindr Trout Daily-Picks Archive Audit
Generated: 2026-05-12T20:24:18.225Z

## Scope Summary

| Metric | Value |
| --- | --- |
| Archived weather scenarios | 3 |
| Expanded recommendation runs | 36 |
| Months | Jan, Feb |
| Regions | 3 |
| Fisheries | 3 |
| Water types | freshwater_river |
| Clarity split | clear:12, stained:12, dirty:12 |
| Goal split | all_purpose:18, big_fish:18 |
| Skipped weather scenarios | 0 |
| JSONL output | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/daily-picks-archive-audit.trout.smoke.jsonl |

## Condition Bucket Coverage

| Bucket | Expanded runs |
| --- | --- |
| calm_low_light_surface | 0 |
| calm_bright_clear_subtle | 0 |
| breezy_windy_stained_reaction | 8 |
| dirty_vibration | 12 |
| cold_slow_or_front | 24 |
| warming_search | 12 |
| heat_limited_finesse | 0 |
| stable_pleasant_high_confidence | 0 |
| stable_pleasant_medium_confidence_archive | 0 |
| river_elevated_runoff_current | 36 |
| medium_confidence_archive | 36 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 0 |
| adjacent_day_change | 0 |

## Adjacent-Day Coverage

No adjacent-day pairs in selected rows.

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 3 | WIND_NOT_ELEVATING_REACTION (3), BIG_FISH_NOT_FAVORING_UPSIDE (1) |
| dirty_vibration | 2 | WIND_NOT_ELEVATING_REACTION (2), BIG_FISH_NOT_FAVORING_UPSIDE (1) |
| medium_confidence_archive | 7 | WIND_NOT_ELEVATING_REACTION (7), BIG_FISH_NOT_FAVORING_UPSIDE (2) |
| river_elevated_runoff_current | 7 | WIND_NOT_ELEVATING_REACTION (7), BIG_FISH_NOT_FAVORING_UPSIDE (2) |
| warming_search | 7 | WIND_NOT_ELEVATING_REACTION (7), BIG_FISH_NOT_FAVORING_UPSIDE (2) |

- WIND_NOT_ELEVATING_REACTION: 7
- BIG_FISH_NOT_FAVORING_UPSIDE: 2

- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Blade Bait (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Casting Spoon (lure); Sculpin Streamer (fly); Feather Jig Leech (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Blade Bait (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Sculpin Streamer (fly); Feather Jig Leech (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 5
- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 4

- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Lead-Eye Leech (fly); Zonker Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Rabbit-Strip Leech (fly); Sculpin Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Blade Bait (lure); Lead-Eye Leech (fly); Muddler Minnow (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Sculpin Streamer (fly)

## Temperature/Thermal Diagnostics

### Thermal Modes By Month/Region

| Month | Region | Thermal modes |
| --- | --- | --- |
| Jan | northeast | cold_slow:1 |
| Jan | south_central | warming:1 |
| Feb | great_lakes_upper_midwest | cold_slow:1 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

None.

## Surface/Topwater Diagnostics

### Topwater Selection Summary

None.

### Shoulder-Season Topwater Selections

None.

## Water Column Diversity Diagnostics

### Same-Side Surface/Surface Summary

None.

### Remaining Same-Side Surface/Surface Examples

None.

### Same-Side Column/Band Summary

| Side | Same exact column | Same broad band | Same broad band with close different-band alt |
| --- | --- | --- | --- |
| lure | 13 | 13 | 3 |
| fly | 16 | 16 | 16 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 0 | - |
| open-surface rows with 2+ surface picks | 0 | 0 |
| open-surface rows with 3+ surface picks | 0 | 0 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 0 | 0 |
| lure surface/surface plus fly surface/upper | 0 | 0 |

### Surface/Upper Watch Examples

None.

## Pike Cold/Open Surface Diagnostics

Not applicable.

## Pike Clear/Bright Diagnostics

Not applicable.

## Pike Heat-Limited Diagnostics

Not applicable.

## Set B Diagnostics

### Set B Overlap Cause Counts

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

| Kind | Cause | Lure | Fly | Total |
| --- | --- | --- | --- | --- |
| exact_id | unavoidable_due_score_band | 5 | 0 | 5 |
| same_family_same_presentation | truly_avoidable | 0 | 4 | 4 |
| same_family_same_presentation | unavoidable_due_score_band | 0 | 6 | 6 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 2 | 2 |
| same_family_different_presentation | truly_avoidable | 0 | 5 | 5 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Upper Delaware trout river<br>2025-01-18 dirty big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (172); Rabbit-Strip Leech (190) | Sculpzilla (186); Articulated Baitfish Streamer (156) | Sculpin Streamer (196, alt edge 40) |
| Upper Delaware trout river<br>2025-01-18 stained big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (172); Rabbit-Strip Leech (190) | Sculpzilla (186); Articulated Baitfish Streamer (156) | Sculpin Streamer (196, alt edge 40) |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish | fly honorable: same_family_different_presentation | Articulated Baitfish Streamer (174); Sculpzilla (180) | Rabbit-Strip Leech (156); Articulated Dungeon Streamer (166) | Feather Jig Leech (180, alt edge 14) |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose | fly top: same_family_same_presentation | Sculpin Streamer (204); Feather Jig Leech (192) | Lead-Eye Leech (182); Zonker Streamer (190) | Bucktail Streamer (190, alt edge 8) |
| White River Ozark trout tailwater<br>2025-01-16 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (188); Articulated Baitfish Streamer (182) | Rabbit-Strip Leech (164); Articulated Dungeon Streamer (174) | Feather Jig Leech (180, alt edge 6) |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (174); Sculpzilla (188) | Rabbit-Strip Leech (164); Articulated Baitfish Streamer (182) | Feather Jig Leech (180, alt edge -2) |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose | fly honorable: same_family_same_presentation | Sculpin Streamer (224); Jighead Marabou Leech (214) | Lead-Eye Leech (214); Muddler Minnow (208) | Woolly Bugger (204, alt edge -4) |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear big_fish | fly honorable: same_family_same_presentation | Sculpzilla (178); Articulated Dungeon Streamer (164) | Rabbit-Strip Leech (182); Sculpin Streamer (196) | Jighead Marabou Leech (186, alt edge -10) |
| Upper Delaware trout river<br>2025-01-18 clear big_fish | fly honorable: same_family_same_presentation | Sculpzilla (178); Articulated Dungeon Streamer (164) | Rabbit-Strip Leech (182); Sculpin Streamer (196) | Jighead Marabou Leech (186, alt edge -10) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

None.

### Big-Fish Sides With No Explicit Big-Fish Score Reason

| Scenario | Side | Selected |
| --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 stained B | lure | Inline Spinner; Hair Jig |
| White River Ozark trout tailwater<br>2025-01-16 dirty B | lure | Inline Spinner; Hair Jig |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Hair Jig [lure] | 2 | Casting Spoon (2) | 16 |
| Inline Spinner [lure] | 2 | Casting Spoon (2) | -4 |

## Pike Big Fish Upside Split Diagnostics

Not applicable.

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Sculpzilla (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -2) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (156; goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (166; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (178, alt edge 12) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (194; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Feather Jig Leech (192; condition_tag:warming_search:+16, condition_tag:current_swing:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (190, alt edge -4) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (174; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Sculpzilla (188; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -10) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (164; goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (182; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -4) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (194; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Feather Jig Leech (192; condition_tag:warming_search:+16, condition_tag:current_swing:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (182, alt edge -12) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (164; goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (174; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (170, alt edge -4) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| current_open_water_acceptable | 5 |
| clear_subtle_wind_watch | 2 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | White River Ozark trout tailwater<br>2025-01-16 big_fish clear A | warming_search<br>neutral | Suspending Jerkbait 174<br>Casting Spoon 174 |
| clear_subtle_wind_watch | White River Ozark trout tailwater<br>2025-01-16 big_fish clear B | warming_search<br>neutral | Inline Spinner 178<br>Blade Bait 164 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 all_purpose stained A | breezy_windy_stained_reaction<br>neutral | Inline Spinner 208<br>Casting Spoon 174 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Casting Spoon 174<br>Blade Bait 164 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Inline Spinner 178<br>Hair Jig 158 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 all_purpose dirty A | dirty_vibration<br>neutral | Inline Spinner 200<br>Hair Jig 168 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 big_fish dirty B | dirty_vibration<br>neutral | Inline Spinner 170<br>Hair Jig 150 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 4 |
| acceptable_fit | 10 |
| strong_fit | 130 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | B | fly | medium_confidence_archive | 3 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 3 |
| watch | big_fish | B | fly | warming_search | 3 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 1 |
| watch | big_fish | B | fly | dirty_vibration | 1 |
| watch | big_fish | B | lure | cold_slow_or_front | 1 |
| watch | big_fish | B | lure | medium_confidence_archive | 1 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 1 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 6 |
| acceptable_fit | big_fish | B | lure | river_elevated_runoff_current | 6 |
| acceptable_fit | big_fish | B | lure | warming_search | 5 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 4 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 4 |
| acceptable_fit | big_fish | B | fly | river_elevated_runoff_current | 4 |
| acceptable_fit | big_fish | B | lure | dirty_vibration | 3 |
| acceptable_fit | big_fish | B | lure | breezy_windy_stained_reaction | 2 |
| acceptable_fit | big_fish | B | fly | dirty_vibration | 1 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 1 |
| strong_fit | all_purpose | A | fly | medium_confidence_archive | 18 |
| strong_fit | all_purpose | A | fly | river_elevated_runoff_current | 18 |
| strong_fit | all_purpose | A | lure | medium_confidence_archive | 18 |
| strong_fit | all_purpose | A | lure | river_elevated_runoff_current | 18 |
| strong_fit | all_purpose | B | fly | medium_confidence_archive | 18 |
| strong_fit | all_purpose | B | fly | river_elevated_runoff_current | 18 |
| strong_fit | all_purpose | B | lure | medium_confidence_archive | 18 |
| strong_fit | all_purpose | B | lure | river_elevated_runoff_current | 18 |
| strong_fit | big_fish | A | fly | medium_confidence_archive | 18 |
| strong_fit | big_fish | A | fly | river_elevated_runoff_current | 18 |
| strong_fit | big_fish | A | lure | medium_confidence_archive | 18 |
| strong_fit | big_fish | A | lure | river_elevated_runoff_current | 18 |
| strong_fit | all_purpose | A | fly | cold_slow_or_front | 12 |
| strong_fit | all_purpose | A | lure | cold_slow_or_front | 12 |
| strong_fit | all_purpose | B | fly | cold_slow_or_front | 12 |
| strong_fit | all_purpose | B | lure | cold_slow_or_front | 12 |
| strong_fit | big_fish | A | fly | cold_slow_or_front | 12 |
| strong_fit | big_fish | A | lure | cold_slow_or_front | 12 |
| strong_fit | big_fish | B | fly | medium_confidence_archive | 11 |
| strong_fit | big_fish | B | fly | river_elevated_runoff_current | 11 |
| strong_fit | big_fish | B | lure | medium_confidence_archive | 11 |
| strong_fit | big_fish | B | lure | river_elevated_runoff_current | 11 |
| strong_fit | big_fish | B | lure | cold_slow_or_front | 10 |
| strong_fit | big_fish | B | fly | cold_slow_or_front | 8 |
| strong_fit | all_purpose | A | fly | dirty_vibration | 6 |
| strong_fit | all_purpose | A | fly | warming_search | 6 |
| strong_fit | all_purpose | A | lure | dirty_vibration | 6 |
| strong_fit | all_purpose | A | lure | warming_search | 6 |
| strong_fit | all_purpose | B | fly | dirty_vibration | 6 |
| strong_fit | all_purpose | B | fly | warming_search | 6 |
| strong_fit | all_purpose | B | lure | dirty_vibration | 6 |
| strong_fit | all_purpose | B | lure | warming_search | 6 |
| strong_fit | big_fish | A | fly | dirty_vibration | 6 |
| strong_fit | big_fish | A | fly | warming_search | 6 |
| strong_fit | big_fish | A | lure | dirty_vibration | 6 |
| strong_fit | big_fish | A | lure | warming_search | 6 |
| strong_fit | all_purpose | A | fly | breezy_windy_stained_reaction | 4 |
| strong_fit | all_purpose | A | lure | breezy_windy_stained_reaction | 4 |
| strong_fit | all_purpose | B | fly | breezy_windy_stained_reaction | 4 |
| strong_fit | all_purpose | B | lure | breezy_windy_stained_reaction | 4 |
| strong_fit | big_fish | A | fly | breezy_windy_stained_reaction | 4 |
| strong_fit | big_fish | A | lure | breezy_windy_stained_reaction | 4 |
| strong_fit | big_fish | B | fly | dirty_vibration | 4 |
| strong_fit | big_fish | B | fly | breezy_windy_stained_reaction | 3 |
| strong_fit | big_fish | B | fly | warming_search | 3 |
| strong_fit | big_fish | B | lure | dirty_vibration | 3 |
| strong_fit | big_fish | B | lure | breezy_windy_stained_reaction | 2 |
| strong_fit | big_fish | B | lure | warming_search | 1 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 0 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 0 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose A | Inline Spinner (lure_of_the_day, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 204) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 200) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 194) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 194) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-01-18 stained all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 224) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-01-18 dirty all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 214) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-01-18 stained all_purpose A | Hair Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-01-18 dirty all_purpose A | Hair Jig (lure_of_the_day, lure, score 188) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 224) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>clear_subtle+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-01-18 clear all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 224) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose A | Hair Jig (lure_of_the_day, lure, score 222) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>clear_subtle+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose B | Hair Jig (lure_of_the_day, lure, score 222) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>clear_subtle+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose A | Jighead Marabou Leech (honorable_fly, fly, score 214) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>clear_subtle+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose B | Lead-Eye Leech (fly_of_the_day, fly, score 214) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>clear_subtle+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 214) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>dirty_vibration+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained all_purpose A | Jighead Marabou Leech (honorable_fly, fly, score 214) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>dirty_vibration+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-01-18 clear all_purpose A | Jighead Marabou Leech (honorable_fly, fly, score 214) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose B | Muddler Minnow (honorable_fly, fly, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>clear_subtle+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 96 | 30 | 31% |
| clear_subtle | 32 | 11 | 34% |
| dirty_vibration | 96 | 0 | 0% |
| heat_finesse | 0 | 0 |  |
| cold_slow | 96 | 73 | 76% |
| low_light_surface | 0 | 0 |  |
| calm_surface | 0 | 0 |  |
| Trout dirty/runoff/current fit | 144 | 132 | 92% |
| Big Fish upside | 72 | 62 | 86% |
| All Purpose reliable/versatile | 72 | 72 | 100% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Hair Jig [lure] (21), Blade Bait [lure] (15), Sculpin Streamer [fly] (13), Inline Spinner [lure] (11), Articulated Dungeon Streamer [fly] (9), Casting Spoon [lure] (9), Rabbit-Strip Leech [fly] (9), Sculpzilla [fly] (9), Suspending Jerkbait [lure] (9), Ned Rig [lure] (7), Jighead Marabou Leech [fly] (6), Muddler Minnow [fly] (6) |
| All-purpose | Hair Jig [lure] (11), Sculpin Streamer [fly] (9), Inline Spinner [lure] (8), Blade Bait [lure] (6), Jighead Marabou Leech [fly] (6), Muddler Minnow [fly] (6), Ned Rig [lure] (6), Woolly Bugger [fly] (5) |
| Big-fish | Hair Jig [lure] (10), Articulated Dungeon Streamer [fly] (9), Blade Bait [lure] (9), Rabbit-Strip Leech [fly] (9), Sculpzilla [fly] (9), Casting Spoon [lure] (7), Suspending Jerkbait [lure] (6), Articulated Baitfish Streamer [fly] (5) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 6 | 6 | 0 | 0 | 0 |
| fly | 15 | 13 | 2 | 0 | 0 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 21/36 | 58.3% | all_purpose:11, big_fish:10 | A:14, B:7 | top:14, honorable:7 | clear:7, dirty:7, stained:7 | freshwater_river:21 | current_swing:21, runoff_streamer:21, cold_slow:16, dirty_vibration:14 |
| Blade Bait<br>blade_bait | lure | 15/36 | 41.7% | big_fish:9, all_purpose:6 | B:10, A:5 | honorable:10, top:5 | clear:6, dirty:5, stained:4 | freshwater_river:15 | current_swing:15, runoff_streamer:15, cold_slow:10, dirty_vibration:9 |
| Sculpin Streamer<br>sculpin_streamer | fly | 13/36 | 36.1% | all_purpose:9, big_fish:4 | A:9, B:4 | top:11, honorable:2 | clear:5, dirty:4, stained:4 | freshwater_river:13 | current_swing:13, runoff_streamer:13, cold_slow:10, dirty_vibration:8 |
| Inline Spinner<br>inline_spinner | lure | 11/36 | 30.6% | all_purpose:8, big_fish:3 | B:6, A:5 | top:7, honorable:4 | dirty:5, clear:3, stained:3 | freshwater_river:11 | current_swing:11, runoff_streamer:11, wind_reaction:10, dirty_vibration:8 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 9/36 | 25% | big_fish:9 | A:5, B:4 | honorable:6, top:3 | clear:3, dirty:3, stained:3 | freshwater_river:9 | current_swing:9, runoff_streamer:9, cold_slow:6, dirty_vibration:6 |
| Casting Spoon<br>casting_spoon | lure | 9/36 | 25% | big_fish:7, all_purpose:2 | A:5, B:4 | honorable:6, top:3 | stained:4, dirty:3, clear:2 | freshwater_river:9 | current_swing:9, runoff_streamer:9, wind_reaction:8, dirty_vibration:7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 9/36 | 25% | big_fish:9 | B:5, A:4 | top:5, honorable:4 | clear:3, dirty:3, stained:3 | freshwater_river:9 | current_swing:9, runoff_streamer:9, cold_slow:6, dirty_vibration:6 |
| Sculpzilla<br>sculpzilla | fly | 9/36 | 25% | big_fish:9 | A:7, B:2 | top:7, honorable:2 | clear:3, dirty:3, stained:3 | freshwater_river:9 | current_swing:9, runoff_streamer:9, cold_slow:6, dirty_vibration:6 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 9/36 | 25% | big_fish:6, all_purpose:3 | B:5, A:4 | honorable:6, top:3 | clear:4, stained:4, dirty:1 | freshwater_river:9 | current_swing:9, runoff_streamer:9, wind_reaction:7, cold_slow:6 |
| Ned Rig<br>ned_rig | lure | 7/36 | 19.4% | all_purpose:6, big_fish:1 | B:4, A:3 | top:4, honorable:3 | dirty:3, clear:2, stained:2 | freshwater_river:7 | cold_slow:7, current_swing:7, runoff_streamer:7, dirty_vibration:5 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 6/36 | 16.7% | all_purpose:6 | A:6 | honorable:6 | clear:2, dirty:2, stained:2 | freshwater_river:6 | cold_slow:6, current_swing:6, runoff_streamer:6, dirty_vibration:4 |
| Muddler Minnow<br>muddler_sculpin | fly | 6/36 | 16.7% | all_purpose:6 | B:6 | honorable:3, top:3 | clear:2, dirty:2, stained:2 | freshwater_river:6 | cold_slow:6, current_swing:6, runoff_streamer:6, dirty_vibration:4 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 5/36 | 13.9% | big_fish:5 | B:3, A:2 | honorable:4, top:1 | dirty:2, stained:2, clear:1 | freshwater_river:5 | current_swing:5, runoff_streamer:5, wind_reaction:5, dirty_vibration:4 |
| Woolly Bugger<br>woolly_bugger | fly | 5/36 | 13.9% | all_purpose:5 | B:5 | honorable:3, top:2 | dirty:2, stained:2, clear:1 | freshwater_river:5 | cold_slow:5, current_swing:5, runoff_streamer:5, dirty_vibration:4 |
| Feather Jig Leech<br>feather_jig_leech | fly | 3/36 | 8.3% | all_purpose:3 | A:3 | honorable:3 | clear:1, dirty:1, stained:1 | freshwater_river:3 | current_swing:3, open_water_search:3, runoff_streamer:3, warming_search:3 |
| Conehead Streamer<br>conehead_streamer | fly | 2/36 | 5.6% | all_purpose:2 | B:2 | top:2 | dirty:1, stained:1 | freshwater_river:2 | current_swing:2, dirty_vibration:2, open_water_search:2, runoff_streamer:2 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 2/36 | 5.6% | all_purpose:2 | B:2 | top:2 | clear:2 | freshwater_river:2 | clear_subtle:2, current_swing:2, runoff_streamer:2, cold_slow:1 |
| Zonker Streamer<br>zonker_streamer | fly | 2/36 | 5.6% | all_purpose:2 | B:2 | honorable:2 | clear:1, stained:1 | freshwater_river:2 | current_swing:2, open_water_search:2, runoff_streamer:2, warming_search:2 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 1/36 | 2.8% | all_purpose:1 | B:1 | honorable:1 | dirty:1 | freshwater_river:1 | current_swing:1, dirty_vibration:1, open_water_search:1, runoff_streamer:1 |
| Clouser Minnow<br>clouser_minnow | fly | 0/36 | 0% |  |  |  |  |  |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 0/24 | 0% |  |  |  |  |  |  |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 21/144 (14.6%) | 14/72 (19.4%) | 7/72 (9.7%) | 21/72 (29.2%) | - | lure side actual >20% |
| Blade Bait<br>blade_bait | lure | 15/144 (10.4%) | 5/72 (6.9%) | 10/72 (13.9%) | 15/72 (20.8%) | - | lure side actual >20% |
| Sculpin Streamer<br>sculpin_streamer | fly | 13/144 (9%) | 11/72 (15.3%) | 2/72 (2.8%) | - | 13/72 (18.1%) |  |
| Inline Spinner<br>inline_spinner | lure | 11/144 (7.6%) | 7/72 (9.7%) | 4/72 (5.6%) | 11/72 (15.3%) | - |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 9/144 (6.3%) | 3/72 (4.2%) | 6/72 (8.3%) | - | 9/72 (12.5%) |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 9/144 (6.3%) | 5/72 (6.9%) | 4/72 (5.6%) | - | 9/72 (12.5%) |  |
| Sculpzilla<br>sculpzilla | fly | 9/144 (6.3%) | 7/72 (9.7%) | 2/72 (2.8%) | - | 9/72 (12.5%) |  |
| Casting Spoon<br>casting_spoon | lure | 9/144 (6.3%) | 3/72 (4.2%) | 6/72 (8.3%) | 9/72 (12.5%) | - |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 9/144 (6.3%) | 3/72 (4.2%) | 6/72 (8.3%) | 9/72 (12.5%) | - |  |
| Ned Rig<br>ned_rig | lure | 7/144 (4.9%) | 4/72 (5.6%) | 3/72 (4.2%) | 7/72 (9.7%) | - |  |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 6/144 (4.2%) | 0/72 (0%) | 6/72 (8.3%) | - | 6/72 (8.3%) |  |
| Muddler Minnow<br>muddler_sculpin | fly | 6/144 (4.2%) | 3/72 (4.2%) | 3/72 (4.2%) | - | 6/72 (8.3%) |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 5/144 (3.5%) | 1/72 (1.4%) | 4/72 (5.6%) | - | 5/72 (6.9%) |  |
| Woolly Bugger<br>woolly_bugger | fly | 5/144 (3.5%) | 2/72 (2.8%) | 3/72 (4.2%) | - | 5/72 (6.9%) |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 3/144 (2.1%) | 0/72 (0%) | 3/72 (4.2%) | - | 3/72 (4.2%) |  |
| Conehead Streamer<br>conehead_streamer | fly | 2/144 (1.4%) | 2/72 (2.8%) | 0/72 (0%) | - | 2/72 (2.8%) |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 2/144 (1.4%) | 2/72 (2.8%) | 0/72 (0%) | - | 2/72 (2.8%) |  |
| Zonker Streamer<br>zonker_streamer | fly | 2/144 (1.4%) | 0/72 (0%) | 2/72 (2.8%) | - | 2/72 (2.8%) |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 1/144 (0.7%) | 0/72 (0%) | 1/72 (1.4%) | - | 1/72 (1.4%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | - | 0/72 (0%) |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | - | 0/72 (0%) |  |

## Zero-Selected Eligible Profiles

| Profile | Gear | Candidate opportunities | Top available contexts | Top competing winners |
| --- | --- | --- | --- | --- |
| Clouser Minnow<br>clouser_minnow | fly | 36 | all_purpose / dirty / freshwater_river / dirty_vibration:6, big_fish / dirty / freshwater_river / dirty_vibration:6, all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:4 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 24 | all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / dirty / freshwater_river / dirty_vibration:4, big_fish / clear / freshwater_river / cold_slow_or_front:4, big_fish / dirty / freshwater_river / dirty_vibration:4 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):2, Rabbit-Strip Leech (top), Sculpin Streamer (honorable):2 |

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

None.

## Overdominance Guardrail Summary

None.

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 21/144 (14.6%) | 14/72 (19.4%) | 7/72 (9.7%) | 21/72 (29.2%) | 21/36 (58.3%) | 14/36 (38.9%) / 7/36 (19.4%) | lure side actual>20% |
| Blade Bait<br>blade_bait | lure | 15/144 (10.4%) | 5/72 (6.9%) | 10/72 (13.9%) | 15/72 (20.8%) | 15/36 (41.7%) | 5/36 (13.9%) / 10/36 (27.8%) | lure side actual>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.08.
Average expanded finalist pool size: 2.81.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 63.
Rows/slots with expanded finalist pool size 1: 40.
Selected-tier singleton slots expanded above 1: 23.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.25 | 3.31 | 1 | 1 | 15 | 9 |
| fly/top | 2.69 | 3.81 | 1 | 1 | 9 | 5 |
| lure/honorable | 2.00 | 2.42 | 1 | 1 | 13 | 7 |
| lure/top | 1.39 | 1.72 | 1 | 1 | 26 | 19 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 112 |
| goal_or_priority_condition | 32 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_and_priority_condition | 112 |
| goal_or_priority_condition | 76 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 24 |
| family_diversity_scarcity | 16 |

Representative expanded singleton finalist pools:
- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__A lure/top: inline_spinner (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B lure/honorable: suspending_jerkbait (goal_or_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B lure/top: inline_spinner (goal_or_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B lure/honorable: hair_jig (goal_or_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__A lure/top: inline_spinner (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B lure/top: inline_spinner (goal_or_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B lure/honorable: hair_jig (goal_or_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__B fly/top: jighead_marabou_leech (goal_or_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B lure/honorable: inline_spinner (goal_or_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B fly/top: muddler_sculpin (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__B fly/honorable: woolly_bugger (goal_or_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B lure/top: ned_rig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B fly/top: woolly_bugger (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B fly/honorable: muddler_sculpin (goal_and_priority_condition; family_diversity_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 2.64 |
| Different-presentation close candidates | 1.21 |
| Different-family close candidates | 1.49 |
| Final expanded Set B pool | 1.86 |
| Same-family/same-presentation reintroduced | 15/72 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 24 |
| Coverage pool used | 8 |
| Average used coverage pool size | 2.00 |
| Singleton used coverage pools | 2 |
| Broad pool larger than narrowed pool | 3 |
| Broad pool same as narrowed pool | 5 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 0 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 16 |
| broad | 8 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| inline_spinner | 6 |
| suspending_jerkbait | 6 |
| casting_spoon | 4 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| suspending_jerkbait | 3 |
| casting_spoon | 2 |
| inline_spinner | 2 |
| blade_bait | 1 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

None.

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 144 | 0 | 0 |
| caution | 0 | 0 | 0 |

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sculpin Streamer<br>sculpin_streamer | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: current_swing, cold_slow, runoff_streamer | 1: reliable_action | freshwater_river | false | 9 |
| Ned Rig<br>ned_rig | lure | largemouth_bass, smallmouth_bass, trout | finesse_plastic | ned_tube_finesse | bottom<br>slow | 2: leech_worm, crawfish | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Hair Jig<br>hair_jig | lure | smallmouth_bass, trout | hair_jig | hair_jig | bottom<br>slow/medium | 2: baitfish, leech_worm | 2: clear, stained | 3: clear_subtle, current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 8 |
| Inline Spinner<br>inline_spinner | lure | smallmouth_bass, trout, northern_pike | spinner | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | largemouth_bass, smallmouth_bass, trout | jerkbait | jerkbait | mid<br>medium | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, wind_reaction | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | smallmouth_bass, northern_pike, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Clouser Minnow<br>clouser_minnow | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_weighted | baitfish_streamer | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: current_swing, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Conehead Streamer<br>conehead_streamer | fly | smallmouth_bass, trout | streamer_weighted | baitfish_streamer | mid<br>medium | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Crawfish Streamer<br>crawfish_streamer | fly | smallmouth_bass, trout | crawfish_fly | crawfish_fly | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 2: current_swing, clear_subtle | 1: reliable_action | freshwater_river | false | 7 |
| Feather Jig Leech<br>feather_jig_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: warming_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, clear_subtle | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Muddler Minnow<br>muddler_sculpin | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 2: stained, dirty | 2: cold_slow, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Sculpzilla<br>sculpzilla | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow/medium | 2: baitfish, crawfish | 2: stained, dirty | 2: runoff_streamer, current_swing | 1: big_fish_upside | freshwater_river | false | 7 |
| Woolly Bugger<br>woolly_bugger | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | bugger_streamer | leech_bugger | mid<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Zonker Streamer<br>zonker_streamer | fly | smallmouth_bass, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Blade Bait<br>blade_bait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | blade_bait | blade_spoon | bottom<br>slow/medium | 1: baitfish | 3: clear, stained, dirty | 2: cold_slow, open_water_search | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Casting Spoon<br>casting_spoon | lure | northern_pike, trout | spoon | blade_spoon | mid<br>medium | 1: baitfish | 2: clear, stained | 2: open_water_search, wind_reaction | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 6 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 5/36 | 5/36 | goal_tags>1<br>versatile_search+big_fish_upside |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 9/36 | 9/36 | goal_tags>1 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 0/36 | 0/36 | goal_tags>1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 0/24 | 0/24 | clear+stained+dirty clarity |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 3/36 | 3/36 | clear+stained+dirty clarity |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 6/36 | 6/36 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 2/36 | 2/36 | clear+stained+dirty clarity |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 9/36 | 9/36 | goal_tags>1<br>reliable_action+big_fish_upside |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 13/36 | 13/36 | clear+stained+dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 5/36 | 5/36 | clear+stained+dirty clarity |
| Blade Bait<br>blade_bait | lure | 7 | 15/36 | 15/36 | clear+stained+dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Hair Jig<br>hair_jig | lure | 8 | 21/36 | 21/36 | combined all-slot share>25%<br>broad per-slot share>20% |
| Inline Spinner<br>inline_spinner | lure | 8 | 11/36 | 11/36 | goal_tags>1<br>combined all-slot share>25% |
| Ned Rig<br>ned_rig | lure | 9 | 7/36 | 7/36 | clear+stained+dirty clarity |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 9/36 | 9/36 | goal_tags>1 |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 8 | 21/36 (58.3%) | 21/36 (58.3%) | all_purpose:11, big_fish:10 | top:14, honorable:7 | current_swing:21, runoff_streamer:21, cold_slow:16, dirty_vibration:14, wind_reaction:11 |
| Blade Bait<br>blade_bait | lure | 7 | 15/36 (41.7%) | 15/36 (41.7%) | big_fish:9, all_purpose:6 | honorable:10, top:5 | current_swing:15, runoff_streamer:15, cold_slow:10, dirty_vibration:9, wind_reaction:9 |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 13/36 (36.1%) | 13/36 (36.1%) | all_purpose:9, big_fish:4 | top:11, honorable:2 | current_swing:13, runoff_streamer:13, cold_slow:10, dirty_vibration:8, wind_reaction:7 |
| Inline Spinner<br>inline_spinner | lure | 8 | 11/36 (30.6%) | 11/36 (30.6%) | all_purpose:8, big_fish:3 | top:7, honorable:4 | current_swing:11, runoff_streamer:11, wind_reaction:10, dirty_vibration:8, open_water_search:7 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 9/36 (25%) | 9/36 (25%) | big_fish:9 | honorable:6, top:3 | current_swing:9, runoff_streamer:9, cold_slow:6, dirty_vibration:6, wind_reaction:6 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 9/36 (25%) | 9/36 (25%) | big_fish:6, all_purpose:3 | honorable:6, top:3 | current_swing:9, runoff_streamer:9, wind_reaction:7, cold_slow:6, dirty_vibration:5 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 9/36 (25%) | 9/36 (25%) | big_fish:9 | top:5, honorable:4 | current_swing:9, runoff_streamer:9, cold_slow:6, dirty_vibration:6, wind_reaction:6 |
| Sculpzilla<br>sculpzilla | fly | 7 | 9/36 (25%) | 9/36 (25%) | big_fish:9 | top:7, honorable:2 | current_swing:9, runoff_streamer:9, cold_slow:6, dirty_vibration:6, wind_reaction:6 |
| Casting Spoon<br>casting_spoon | lure | 6 | 9/36 (25%) | 9/36 (25%) | big_fish:7, all_purpose:2 | honorable:6, top:3 | current_swing:9, runoff_streamer:9, wind_reaction:8, dirty_vibration:7, cold_slow:5 |
| Ned Rig<br>ned_rig | lure | 9 | 7/36 (19.4%) | 7/36 (19.4%) | all_purpose:6, big_fish:1 | top:4, honorable:3 | cold_slow:7, current_swing:7, runoff_streamer:7, dirty_vibration:5, wind_reaction:3 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 6/36 (16.7%) | 6/36 (16.7%) | all_purpose:6 | honorable:6 | cold_slow:6, current_swing:6, runoff_streamer:6, dirty_vibration:4, wind_reaction:3 |
| Muddler Minnow<br>muddler_sculpin | fly | 7 | 6/36 (16.7%) | 6/36 (16.7%) | all_purpose:6 | honorable:3, top:3 | cold_slow:6, current_swing:6, runoff_streamer:6, dirty_vibration:4, wind_reaction:3 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 5/36 (13.9%) | 5/36 (13.9%) | big_fish:5 | honorable:4, top:1 | current_swing:5, runoff_streamer:5, wind_reaction:5, dirty_vibration:4, open_water_search:3 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 5/36 (13.9%) | 5/36 (13.9%) | all_purpose:5 | honorable:3, top:2 | cold_slow:5, current_swing:5, runoff_streamer:5, dirty_vibration:4, wind_reaction:3 |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 3/36 (8.3%) | 3/36 (8.3%) | all_purpose:3 | honorable:3 | current_swing:3, open_water_search:3, runoff_streamer:3, warming_search:3, wind_reaction:3 |
| Conehead Streamer<br>conehead_streamer | fly | 7 | 2/36 (5.6%) | 2/36 (5.6%) | all_purpose:2 | top:2 | current_swing:2, dirty_vibration:2, open_water_search:2, runoff_streamer:2, warming_search:2 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 2/36 (5.6%) | 2/36 (5.6%) | all_purpose:2 | top:2 | clear_subtle:2, current_swing:2, runoff_streamer:2, cold_slow:1, open_water_search:1 |
| Zonker Streamer<br>zonker_streamer | fly | 7 | 2/36 (5.6%) | 2/36 (5.6%) | all_purpose:2 | honorable:2 | current_swing:2, open_water_search:2, runoff_streamer:2, warming_search:2, wind_reaction:2 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 1/36 (2.8%) | 1/36 (2.8%) | all_purpose:1 | honorable:1 | current_swing:1, dirty_vibration:1, open_water_search:1, runoff_streamer:1, warming_search:1 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 0/36 (0%) | 0/36 (0%) |  |  |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 0/24 (0%) | 0/24 (0%) |  |  |  |

### Likely Cause Classification

None.

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 36 | 7/36 (19.4%) | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Suspending Jerkbait (honorable):4, Inline Spinner (top), Hair Jig (honorable):4, Blade Bait (top), Casting Spoon (honorable):2 | healthy / not underused |
| Hair Jig<br>hair_jig | lure | forage 2: baitfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: reliable_action | 36 | 21/36 (58.3%) | Blade Bait (top), Casting Spoon (honorable):2, Casting Spoon (top), Blade Bait (honorable):2, Inline Spinner (top), Blade Bait (honorable):2, Blade Bait (top), Inline Spinner (honorable):1 | healthy / not underused |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 36 | 11/36 (30.6%) | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Suspending Jerkbait (honorable):4, Hair Jig (top), Ned Rig (honorable):3, Blade Bait (top), Casting Spoon (honorable):2 | healthy / not underused |
| Casting Spoon<br>casting_spoon | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: open_water_search, wind_reaction<br>goal 1: versatile_search | 36 | 9/36 (25%) | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Suspending Jerkbait (honorable):4, Inline Spinner (top), Hair Jig (honorable):4, Hair Jig (top), Ned Rig (honorable):3 | healthy / not underused |
| Blade Bait<br>blade_bait | lure | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, open_water_search<br>goal 1: reliable_action | 36 | 15/36 (41.7%) | Hair Jig (top), Suspending Jerkbait (honorable):4, Inline Spinner (top), Hair Jig (honorable):4, Hair Jig (top), Ned Rig (honorable):3, Hair Jig (top), Inline Spinner (honorable):2 | healthy / not underused |
| Suspending Jerkbait<br>suspending_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, wind_reaction<br>goal 2: reliable_action, versatile_search | 36 | 9/36 (25%) | Hair Jig (top), Blade Bait (honorable):4, Inline Spinner (top), Hair Jig (honorable):4, Hair Jig (top), Ned Rig (honorable):3, Blade Bait (top), Casting Spoon (honorable):2 | healthy / not underused |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, open_water_search<br>goal 2: reliable_action, versatile_search | 0 | 0/0 |  | scenario coverage |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | forage 2: surface_prey, baitfish<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 0 | 0/0 |  | scenario coverage |
| Woolly Bugger<br>woolly_bugger | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, current_swing<br>goal 1: reliable_action | 36 | 5/36 (13.9%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):2 | healthy / not underused |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | forage 1: leech_worm<br>clarity 2: stained, dirty<br>condition 2: cold_slow, cover_ambush<br>goal 2: reliable_action, big_fish_upside | 36 | 9/36 (25%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 | healthy / not underused |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, current_swing<br>goal 1: reliable_action | 36 | 6/36 (16.7%) | Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):2 | healthy / not underused |
| Lead-Eye Leech<br>lead_eye_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, clear_subtle<br>goal 1: reliable_action | 36 | 2/36 (5.6%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 | selector/direct-score or overpowered competitors |
| Feather Jig Leech<br>feather_jig_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: warming_search, current_swing<br>goal 1: versatile_search | 36 | 3/36 (8.3%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):2 | selector/direct-score or overpowered competitors |
| Sculpin Streamer<br>sculpin_streamer | fly | forage 2: baitfish, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: current_swing, cold_slow, runoff_streamer<br>goal 1: reliable_action | 36 | 13/36 (36.1%) | Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):2, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):2 | healthy / not underused |
| Sculpzilla<br>sculpzilla | fly | forage 2: baitfish, crawfish<br>clarity 2: stained, dirty<br>condition 2: runoff_streamer, current_swing<br>goal 1: big_fish_upside | 36 | 9/36 (25%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):2 | healthy / not underused |
| Muddler Minnow<br>muddler_sculpin | fly | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: current_swing, cold_slow<br>goal 1: reliable_action | 36 | 6/36 (16.7%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):2 | healthy / not underused |
| Crawfish Streamer<br>crawfish_streamer | fly | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 2: current_swing, clear_subtle<br>goal 1: reliable_action | 24 | 0/24 (0%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):2, Rabbit-Strip Leech (top), Sculpin Streamer (honorable):2 | scenario coverage or narrow home window |
| Clouser Minnow<br>clouser_minnow | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: current_swing, open_water_search<br>goal 2: reliable_action, versatile_search | 36 | 0/36 (0%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 | selector/direct-score or overpowered competitors |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 36 | 1/36 (2.8%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 | selector/direct-score or overpowered competitors |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | forage 1: baitfish<br>clarity 1: clear<br>condition 2: clear_subtle, current_swing<br>goal 1: reliable_action | 0 | 0/0 |  | scenario coverage |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: open_water_search, runoff_streamer<br>goal 2: versatile_search, big_fish_upside | 36 | 5/36 (13.9%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):2 | healthy / not underused |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 2: runoff_streamer, cover_ambush<br>goal 2: big_fish_upside, high_risk_high_reward | 36 | 9/36 (25%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 | healthy / not underused |
| Game Changer<br>game_changer | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 1: open_water_search<br>goal 2: versatile_search, big_fish_upside | 0 | 0/0 |  | scenario coverage |
| Conehead Streamer<br>conehead_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 36 | 2/36 (5.6%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 | selector/direct-score or overpowered competitors |
| Zonker Streamer<br>zonker_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 1: versatile_search | 36 | 2/36 (5.6%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 | selector/direct-score or overpowered competitors |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: clear_subtle, open_water_search<br>goal 1: versatile_search | 0 | 0/0 |  | scenario coverage |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 3: wind_reaction, open_water_search, warming_search<br>goal 1: versatile_search | 0 | 0/0 |  | scenario coverage |
| Popper Fly<br>popper_fly | fly | forage 2: surface_prey, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: reliable_action, versatile_search | 0 | 0/0 |  | scenario coverage |
| Deer Hair Slider<br>deer_hair_slider | fly | forage 2: surface_prey, baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: calm_surface, low_light_surface<br>goal 1: big_fish_upside | 0 | 0/0 |  | scenario coverage |
| Mouse Fly<br>mouse_fly | fly | forage 1: surface_prey<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 0 | 0/0 |  | scenario coverage |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
None from audit alone.

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Baitfish Slider Fly (baitfish_slider_fly), Crawfish Streamer (crawfish_streamer), Deer Hair Slider (deer_hair_slider), Game Changer (game_changer), Mouse Fly (mouse_fly), Popper Fly (popper_fly), Slim Baitfish Streamer (slim_minnow_streamer), Small Floating Trout Plug (small_floating_trout_plug), Soft Plastic Jerkbait (soft_jerkbait), Unweighted Baitfish Streamer (unweighted_baitfish_streamer)

### Probably selector problem, not catalog problem
Bucktail Streamer (bucktail_baitfish_streamer), Clouser Minnow (clouser_minnow), Conehead Streamer (conehead_streamer), Feather Jig Leech (feather_jig_leech), Lead-Eye Leech (lead_eye_leech), Zonker Streamer (zonker_streamer)

## Utilization Notes / Coverage Gaps

- 2 eligible profile(s) were never selected despite appearing in candidate pools; these are prime coverage or selector-balance review targets.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Articulated Baitfish Streamer, Articulated Dungeon Streamer, Feather Jig Leech, Jighead Marabou Leech, Muddler Minnow, Rabbit-Strip Leech, Sculpin Streamer, Sculpzilla, Woolly Bugger, Blade Bait, Casting Spoon, Hair Jig, Inline Spinner, Ned Rig, Suspending Jerkbait |
| underused_home_window | Bucktail Streamer, Clouser Minnow, Conehead Streamer, Lead-Eye Leech, Zonker Streamer, Crawfish Streamer |
| no_home_window_coverage | None |
| over-dominant | None |
| probably okay niche profile | Baitfish Slider Fly, Deer Hair Slider, Game Changer, Mouse Fly, Popper Fly, Slim Baitfish Streamer, Unweighted Baitfish Streamer, Small Floating Trout Plug, Soft Plastic Jerkbait |

## Trout Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 6.9% | 5/36 | 5/36 | 5 | 5 | 13.9% | 0/18 | 5/18 | 3 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 12.5% | 9/36 | 9/36 | 9 | 9 | 25% | 0/18 | 9/18 | 1 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 1.4% | 1/36 | 1/36 | 1 | 1 | 2.8% | 1/18 | 0/18 | 9 | underused_home_window | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3 |
| Clouser Minnow<br>clouser_minnow | fly | 0% | 0/36 | 0/36 | 0 | 0 | 0% | 0/18 | 0/18 | 1 | underused_home_window | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3 |
| Conehead Streamer<br>conehead_streamer | fly | 2.8% | 2/36 | 2/36 | 2 | 2 | 5.6% | 2/18 | 0/18 | 8 | underused_home_window | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3 |
| Feather Jig Leech<br>feather_jig_leech | fly | 4.2% | 3/36 | 3/36 | 3 | 3 | 8.3% | 3/18 | 0/18 | 11 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 8.3% | 6/36 | 6/36 | 6 | 6 | 16.7% | 6/18 | 0/18 | 22 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 2.8% | 2/36 | 2/36 | 2 | 2 | 5.6% | 2/18 | 0/18 | 10 | underused_home_window | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3 |
| Muddler Minnow<br>muddler_sculpin | fly | 8.3% | 6/36 | 6/36 | 6 | 6 | 16.7% | 6/18 | 0/18 | 9 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 12.5% | 9/36 | 9/36 | 9 | 9 | 25% | 0/18 | 9/18 | 10 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3 |
| Sculpin Streamer<br>sculpin_streamer | fly | 18.1% | 13/36 | 13/36 | 13 | 13 | 36.1% | 9/18 | 4/18 | 23 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3, Articulated Dungeon Streamer (honorable), Rabbit-Strip Leech (top):2 |
| Sculpzilla<br>sculpzilla | fly | 12.5% | 9/36 | 9/36 | 9 | 9 | 25% | 0/18 | 9/18 | 7 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3 |
| Woolly Bugger<br>woolly_bugger | fly | 6.9% | 5/36 | 5/36 | 5 | 5 | 13.9% | 5/18 | 0/18 | 6 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 |
| Zonker Streamer<br>zonker_streamer | fly | 2.8% | 2/36 | 2/36 | 2 | 2 | 5.6% | 2/18 | 0/18 | 8 | underused_home_window | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 0% | 0/24 | 0/24 | 0 | 0 | 0% | 0/12 | 0/12 | 0 | underused_home_window | activity neutral:24<br>clarity clear:8, dirty:8, stained:8<br>water freshwater_river:24<br>bucket cold_slow_or_front:12, dirty_vibration:8, breezy_windy_stained_reaction:4 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (honorable), Articulated Dungeon Streamer (top):2 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Game Changer<br>game_changer | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Mouse Fly<br>mouse_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Popper Fly<br>popper_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Blade Bait<br>blade_bait | lure | 20.8% | 15/36 | 15/36 | 15 | 15 | 41.7% | 6/18 | 9/18 | 6 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Hair Jig (top), Suspending Jerkbait (honorable):4, Inline Spinner (top), Hair Jig (honorable):4, Hair Jig (top), Ned Rig (honorable):3 |
| Casting Spoon<br>casting_spoon | lure | 12.5% | 9/36 | 9/36 | 9 | 9 | 25% | 2/18 | 7/18 | 4 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Suspending Jerkbait (honorable):4, Inline Spinner (top), Hair Jig (honorable):4 |
| Hair Jig<br>hair_jig | lure | 29.2% | 21/36 | 21/36 | 21 | 21 | 58.3% | 11/18 | 10/18 | 11 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Blade Bait (top), Casting Spoon (honorable):2, Casting Spoon (top), Blade Bait (honorable):2, Inline Spinner (top), Blade Bait (honorable):2 |
| Inline Spinner<br>inline_spinner | lure | 15.3% | 11/36 | 11/36 | 11 | 11 | 30.6% | 8/18 | 3/18 | 7 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Suspending Jerkbait (honorable):4, Hair Jig (top), Ned Rig (honorable):3 |
| Ned Rig<br>ned_rig | lure | 9.7% | 7/36 | 7/36 | 7 | 7 | 19.4% | 6/18 | 1/18 | 5 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Suspending Jerkbait (honorable):4, Inline Spinner (top), Hair Jig (honorable):4 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 12.5% | 9/36 | 9/36 | 9 | 9 | 25% | 3/18 | 6/18 | 3 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Hair Jig (top), Blade Bait (honorable):4, Inline Spinner (top), Hair Jig (honorable):4, Hair Jig (top), Ned Rig (honorable):3 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | 6/18 | 1/18 | goal_tags:19, daily_condition_tags:9, selector_filtering_variety_jitter:1 | Upper Delaware trout river 2025-01-18 all_purpose clear: lost to Blade Bait by -6 (selector_filtering_variety_jitter)<br>Upper Delaware trout river 2025-01-18 big_fish stained: lost to Suspending Jerkbait by 2 (goal_tags)<br>Upper Delaware trout river 2025-01-18 big_fish clear: lost to Blade Bait by 6 (goal_tags) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>all_purpose clear cold_slow_or_front | 184 | Blade Bait<br>178 | -6 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>big_fish stained breezy_windy_stained_reaction | 156 | Suspending Jerkbait<br>158 | 2 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:cold_slow:+16<br>goal:big_fish:trout_trophy_lure:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>big_fish clear cold_slow_or_front | 156 | Blade Bait<br>162 | 6 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:trout_trophy_lure:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>big_fish dirty dirty_vibration | 156 | Blade Bait<br>162 | 6 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:dirty:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:trout_trophy_lure:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| avoidIds | 1 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Upper Delaware trout river<br>2025-01-18 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>178 | Ned Rig<br>184 | -6 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lead-Eye Leech<br>lead_eye_leech | fly | 2/36 | 5.6% | 10 | all_purpose / dirty / freshwater_river / dirty_vibration:6, big_fish / dirty / freshwater_river / dirty_vibration:6, all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:4 | daily_condition_tags:20, goal_tags:13, selector_filtering_variety_jitter:1 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 1/36 | 2.8% | 9 | all_purpose / dirty / freshwater_river / dirty_vibration:6, big_fish / dirty / freshwater_river / dirty_vibration:6, all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:4 | goal_tags:28, daily_condition_tags:4, selector_filtering_variety_jitter:3 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 |
| Conehead Streamer<br>conehead_streamer | fly | 2/36 | 5.6% | 8 | all_purpose / dirty / freshwater_river / dirty_vibration:6, big_fish / dirty / freshwater_river / dirty_vibration:6, all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:4 | goal_tags:28, daily_condition_tags:4, selector_filtering_variety_jitter:2 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 |
| Zonker Streamer<br>zonker_streamer | fly | 2/36 | 5.6% | 8 | all_purpose / dirty / freshwater_river / dirty_vibration:6, big_fish / dirty / freshwater_river / dirty_vibration:6, all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:4 | goal_tags:28, daily_condition_tags:4, selector_filtering_variety_jitter:2 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 |
| Clouser Minnow<br>clouser_minnow | fly | 0/36 | 0% | 1 | all_purpose / dirty / freshwater_river / dirty_vibration:6, big_fish / dirty / freshwater_river / dirty_vibration:6, all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:4 | daily_condition_tags:19, goal_tags:14, raw_score:2, forage_clarity_stack:1 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Sculpin Streamer (top), Feather Jig Leech (honorable):3, Sculpzilla (top), Articulated Baitfish Streamer (honorable):3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 0/24 | 0% | 0 | all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / dirty / freshwater_river / dirty_vibration:4, big_fish / clear / freshwater_river / cold_slow_or_front:4, big_fish / dirty / freshwater_river / dirty_vibration:4 | daily_condition_tags:15, goal_tags:8, forage_clarity_stack:1 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (honorable), Articulated Dungeon Streamer (top):2, Rabbit-Strip Leech (honorable), Sculpzilla (top):2 |

## Over-Dominant Profiles

None.

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | None | None |
| calm_surface | big_fish | None | None |
| low_light_surface | all_purpose | None | None |
| low_light_surface | big_fish | None | None |
| wind_reaction | all_purpose | Sculpin Streamer [fly] (6), Hair Jig [lure] (4), Inline Spinner [lure] (4), Conehead Streamer [fly] (2), Muddler Minnow [fly] (2) | Inline Spinner [lure] (7), Hair Jig [lure] (6), Sculpin Streamer [fly] (6), Blade Bait [lure] (3), Feather Jig Leech [fly] (3) |
| wind_reaction | big_fish | Rabbit-Strip Leech [fly] (4), Sculpzilla [fly] (4), Articulated Dungeon Streamer [fly] (3), Casting Spoon [lure] (3), Hair Jig [lure] (3) | Articulated Dungeon Streamer [fly] (6), Blade Bait [lure] (6), Casting Spoon [lure] (6), Rabbit-Strip Leech [fly] (6), Sculpzilla [fly] (6) |
| dirty_vibration | all_purpose | Sculpin Streamer [fly] (6), Hair Jig [lure] (5), Inline Spinner [lure] (3), Ned Rig [lure] (3), Conehead Streamer [fly] (2) | Hair Jig [lure] (7), Inline Spinner [lure] (6), Sculpin Streamer [fly] (6), Jighead Marabou Leech [fly] (4), Muddler Minnow [fly] (4) |
| dirty_vibration | big_fish | Sculpzilla [fly] (5), Hair Jig [lure] (4), Articulated Dungeon Streamer [fly] (3), Casting Spoon [lure] (3), Blade Bait [lure] (2) | Hair Jig [lure] (7), Articulated Dungeon Streamer [fly] (6), Blade Bait [lure] (6), Rabbit-Strip Leech [fly] (6), Sculpzilla [fly] (6) |
| clear_subtle | all_purpose | Hair Jig [lure] (2), Lead-Eye Leech [fly] (2), Sculpin Streamer [fly] (2), Inline Spinner [lure] (1), Suspending Jerkbait [lure] (1) | Hair Jig [lure] (3), Blade Bait [lure] (2), Lead-Eye Leech [fly] (2), Sculpin Streamer [fly] (2), Feather Jig Leech [fly] (1) |
| clear_subtle | big_fish | Rabbit-Strip Leech [fly] (2), Suspending Jerkbait [lure] (2), Articulated Baitfish Streamer [fly] (1), Hair Jig [lure] (1), Inline Spinner [lure] (1) | Articulated Dungeon Streamer [fly] (2), Blade Bait [lure] (2), Hair Jig [lure] (2), Rabbit-Strip Leech [fly] (2), Sculpzilla [fly] (2) |
| cold_slow | all_purpose | Hair Jig [lure] (7), Sculpin Streamer [fly] (6), Muddler Minnow [fly] (3), Ned Rig [lure] (3), Blade Bait [lure] (2) | Hair Jig [lure] (8), Jighead Marabou Leech [fly] (6), Muddler Minnow [fly] (6), Ned Rig [lure] (6), Sculpin Streamer [fly] (6) |
| cold_slow | big_fish | Hair Jig [lure] (6), Sculpzilla [fly] (6), Blade Bait [lure] (3), Articulated Dungeon Streamer [fly] (2), Rabbit-Strip Leech [fly] (2) | Hair Jig [lure] (8), Articulated Dungeon Streamer [fly] (6), Blade Bait [lure] (6), Rabbit-Strip Leech [fly] (6), Sculpzilla [fly] (6) |
| warming_search | all_purpose | Inline Spinner [lure] (4), Sculpin Streamer [fly] (3), Conehead Streamer [fly] (2), Hair Jig [lure] (1), Lead-Eye Leech [fly] (1) | Inline Spinner [lure] (4), Feather Jig Leech [fly] (3), Hair Jig [lure] (3), Sculpin Streamer [fly] (3), Blade Bait [lure] (2) |
| warming_search | big_fish | Inline Spinner [lure] (3), Rabbit-Strip Leech [fly] (3), Casting Spoon [lure] (2), Articulated Baitfish Streamer [fly] (1), Articulated Dungeon Streamer [fly] (1) | Articulated Baitfish Streamer [fly] (3), Articulated Dungeon Streamer [fly] (3), Blade Bait [lure] (3), Casting Spoon [lure] (3), Inline Spinner [lure] (3) |
| heat_finesse | all_purpose | None | None |
| heat_finesse | big_fish | None | None |
| current_swing | all_purpose | Sculpin Streamer [fly] (9), Hair Jig [lure] (8), Inline Spinner [lure] (4), Muddler Minnow [fly] (3), Ned Rig [lure] (3) | Hair Jig [lure] (11), Sculpin Streamer [fly] (9), Inline Spinner [lure] (8), Blade Bait [lure] (6), Jighead Marabou Leech [fly] (6) |
| current_swing | big_fish | Sculpzilla [fly] (7), Hair Jig [lure] (6), Rabbit-Strip Leech [fly] (5), Articulated Dungeon Streamer [fly] (3), Blade Bait [lure] (3) | Hair Jig [lure] (10), Articulated Dungeon Streamer [fly] (9), Blade Bait [lure] (9), Rabbit-Strip Leech [fly] (9), Sculpzilla [fly] (9) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 dirty big_fish B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (170); Hair Jig (150); Rabbit-Strip Leech (164); Articulated Dungeon Streamer (174) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (178); Hair Jig (158); Rabbit-Strip Leech (164); Articulated Baitfish Streamer (182) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (178); Blade Bait (164); Rabbit-Strip Leech (156); Articulated Dungeon Streamer (166) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (192); Blade Bait (180); Lead-Eye Leech (182); Zonker Streamer (190) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (174); Casting Spoon (174); Articulated Baitfish Streamer (174); Sculpzilla (180) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (200); Hair Jig (168); Sculpin Streamer (194); Feather Jig Leech (192) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (208); Casting Spoon (174); Sculpin Streamer (194); Feather Jig Leech (192) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (174); Blade Bait (164); Articulated Dungeon Streamer (174); Sculpzilla (188) | WIND_NOT_ELEVATING_REACTION |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, clear_subtle+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (222); Blade Bait (178); Lead-Eye Leech (214); Muddler Minnow (208) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear big_fish B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, clear_subtle+cold_slow+runoff_streamer+current_swing, medium | Suspending Jerkbait (158); Hair Jig (206); Rabbit-Strip Leech (182); Sculpin Streamer (196) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-01-18 clear big_fish B | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+cold_slow+runoff_streamer+current_swing, medium | Blade Bait (162); Suspending Jerkbait (158); Rabbit-Strip Leech (182); Sculpin Streamer (196) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-01-18 dirty big_fish B | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Blade Bait (162); Casting Spoon (134); Sculpzilla (186); Articulated Baitfish Streamer (156) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-01-18 stained big_fish B | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Casting Spoon (142); Suspending Jerkbait (158); Sculpzilla (186); Articulated Baitfish Streamer (156) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (208); Hair Jig (202); Sculpin Streamer (204); Feather Jig Leech (192) | None |
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (200); Blade Bait (170); Conehead Streamer (182); Bucktail Streamer (182) | None |
| White River Ozark trout tailwater<br>2025-01-16 dirty big_fish A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (166); Blade Bait (164); Sculpzilla (188); Articulated Baitfish Streamer (182) | None |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Hair Jig (176); Suspending Jerkbait (176); Conehead Streamer (190); Zonker Streamer (190) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose A | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, clear_subtle+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (222); Ned Rig (200); Sculpin Streamer (224); Jighead Marabou Leech (214) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear big_fish A | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, clear_subtle+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (206); Blade Bait (162); Sculpzilla (178); Articulated Dungeon Streamer (164) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty all_purpose A | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (188); Inline Spinner (152); Sculpin Streamer (214); Jighead Marabou Leech (204) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty all_purpose B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Ned Rig (174); Blade Bait (168); Woolly Bugger (194); Muddler Minnow (190) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty big_fish A | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (182); Blade Bait (162); Sculpzilla (186); Rabbit-Strip Leech (190) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty big_fish B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Ned Rig (156); Hair Jig (182); Sculpin Streamer (196); Articulated Dungeon Streamer (172) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained all_purpose A | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (206); Ned Rig (184); Sculpin Streamer (224); Jighead Marabou Leech (214) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained all_purpose B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Blade Bait (178); Hair Jig (206); Muddler Minnow (208); Woolly Bugger (204) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained big_fish A | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (190); Suspending Jerkbait (142); Sculpzilla (186); Rabbit-Strip Leech (190) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained big_fish B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Blade Bait (162); Casting Spoon (126); Sculpin Streamer (196); Articulated Dungeon Streamer (172) | None |
| Upper Delaware trout river<br>2025-01-18 clear all_purpose A | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (206); Ned Rig (184); Sculpin Streamer (224); Jighead Marabou Leech (214) | None |
| Upper Delaware trout river<br>2025-01-18 clear all_purpose B | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+cold_slow+runoff_streamer+current_swing, medium | Blade Bait (178); Inline Spinner (176); Muddler Minnow (208); Woolly Bugger (204) | None |
| Upper Delaware trout river<br>2025-01-18 clear big_fish A | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (190); Casting Spoon (142); Sculpzilla (178); Articulated Dungeon Streamer (164) | None |
| Upper Delaware trout river<br>2025-01-18 dirty all_purpose A | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (188); Inline Spinner (168); Sculpin Streamer (214); Jighead Marabou Leech (204) | None |
| Upper Delaware trout river<br>2025-01-18 dirty all_purpose B | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Ned Rig (174); Casting Spoon (134); Woolly Bugger (194); Muddler Minnow (190) | None |

## Known Coverage Gaps

- calm_low_light_surface: not naturally produced by completed archive rows.
- calm_bright_clear_subtle: not naturally produced by completed archive rows.
- heat_limited_finesse: not naturally produced by completed archive rows.
- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- stable_pleasant_medium_confidence_archive: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.
- adjacent_day_change: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
