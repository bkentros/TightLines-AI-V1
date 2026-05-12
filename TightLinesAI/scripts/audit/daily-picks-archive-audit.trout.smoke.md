# FinFindr Trout Daily-Picks Archive Audit
Generated: 2026-05-12T12:51:59.448Z

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
| breezy_windy_stained_reaction | 2 | WIND_NOT_ELEVATING_REACTION (2) |
| dirty_vibration | 1 | WIND_NOT_ELEVATING_REACTION (1) |
| medium_confidence_archive | 5 | WIND_NOT_ELEVATING_REACTION (5) |
| river_elevated_runoff_current | 5 | WIND_NOT_ELEVATING_REACTION (5) |
| warming_search | 5 | WIND_NOT_ELEVATING_REACTION (5) |

- WIND_NOT_ELEVATING_REACTION: 5

- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Clouser Minnow (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Blade Bait (lure); Sculpin Streamer (fly); Articulated Baitfish Streamer (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 8
- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 3

- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Sculpin Streamer (fly); Zonker Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Clouser Minnow (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Bucktail Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Blade Bait (lure); Lead-Eye Leech (fly); Muddler Minnow (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)

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
| lure | 12 | 12 | 2 |
| fly | 12 | 12 | 12 |

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
| same_family_same_presentation | truly_avoidable | 0 | 3 | 3 |
| same_family_same_presentation | unavoidable_due_score_band | 0 | 4 | 4 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 2 | 2 |
| same_family_different_presentation | truly_avoidable | 0 | 8 | 8 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear big_fish | fly honorable: same_family_different_presentation | Rabbit-Strip Leech (168); Articulated Dungeon Streamer (164) | Sculpzilla (178); Articulated Baitfish Streamer (148) | Sculpin Streamer (182, alt edge 34) |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained big_fish | fly honorable: same_family_different_presentation | Rabbit-Strip Leech (176); Articulated Dungeon Streamer (172) | Sculpzilla (186); Articulated Baitfish Streamer (156) | Sculpin Streamer (182, alt edge 26) |
| Upper Delaware trout river<br>2025-01-18 clear big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (164); Sculpzilla (178) | Rabbit-Strip Leech (168); Articulated Baitfish Streamer (148) | Jighead Marabou Leech (172, alt edge 24) |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose | fly honorable: same_family_same_presentation | Sculpin Streamer (180); Bucktail Streamer (190) | Clouser Minnow (192); Sculpzilla (168) | Conehead Streamer (190, alt edge 22) |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Articulated Dungeon Streamer (172) | Rabbit-Strip Leech (176); Articulated Baitfish Streamer (156) | Jighead Marabou Leech (172, alt edge 16) |
| Upper Delaware trout river<br>2025-01-18 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Articulated Dungeon Streamer (172) | Rabbit-Strip Leech (176); Articulated Baitfish Streamer (156) | Jighead Marabou Leech (172, alt edge 16) |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish | fly honorable: same_family_different_presentation | Sculpzilla (180); Articulated Baitfish Streamer (174) | Game Changer (166); Articulated Dungeon Streamer (166) | Feather Jig Leech (166, alt edge 0) |
| Upper Delaware trout river<br>2025-01-18 stained big_fish | fly honorable: same_family_different_presentation | Articulated Baitfish Streamer (156); Sculpzilla (186) | Rabbit-Strip Leech (176); Articulated Dungeon Streamer (172) | Jighead Marabou Leech (172, alt edge 0) |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose | fly honorable: same_family_same_presentation | Sculpin Streamer (210); Jighead Marabou Leech (200) | Lead-Eye Leech (200); Muddler Minnow (194) | Woolly Bugger (190, alt edge -4) |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose | fly honorable: same_family_same_presentation | Bucktail Streamer (190); Conehead Streamer (190) | Sculpin Streamer (190); Zonker Streamer (190) | Feather Jig Leech (178, alt edge -12) |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (174); Sculpzilla (188) | Bucktail Streamer (178); Articulated Baitfish Streamer (182) | Game Changer (166, alt edge -16) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 dirty | B | 3/4 | Inline Spinner; Blade Bait; Sculpin Streamer; Articulated Baitfish Streamer | Blade Bait; Inline Spinner; Sculpzilla; Articulated Baitfish Streamer |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

None.

## Big Fish No-Upside Diagnostics

None.

## Pike Big Fish Upside Split Diagnostics

Not applicable.

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpzilla (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -2) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (166; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (178, alt edge 12) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (192; condition_tag:current_swing:+16, condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Sculpzilla (168; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16) | Bucktail Streamer (190, alt edge -2) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (174; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Sculpzilla (188; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -10) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Articulated Baitfish Streamer (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (182, alt edge 2) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| current_open_water_acceptable | 3 |
| clear_subtle_wind_watch | 2 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | White River Ozark trout tailwater<br>2025-01-16 big_fish clear A | warming_search<br>neutral | Hair Jig 186<br>Casting Spoon 174 |
| clear_subtle_wind_watch | White River Ozark trout tailwater<br>2025-01-16 big_fish clear B | warming_search<br>neutral | Suspending Jerkbait 174<br>Blade Bait 164 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 all_purpose stained B | breezy_windy_stained_reaction<br>neutral | Hair Jig 176<br>Suspending Jerkbait 176 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Casting Spoon 174<br>Hair Jig 170 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 all_purpose dirty B | dirty_vibration<br>neutral | Inline Spinner 200<br>Blade Bait 170 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 2 |
| acceptable_fit | 4 |
| strong_fit | 138 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | A | fly | dirty_vibration | 1 |
| watch | big_fish | A | fly | medium_confidence_archive | 1 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 1 |
| watch | big_fish | A | fly | warming_search | 1 |
| watch | big_fish | B | lure | cold_slow_or_front | 1 |
| watch | big_fish | B | lure | medium_confidence_archive | 1 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 1 |
| acceptable_fit | big_fish | B | lure | dirty_vibration | 2 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 2 |
| acceptable_fit | big_fish | B | lure | river_elevated_runoff_current | 2 |
| acceptable_fit | all_purpose | B | fly | breezy_windy_stained_reaction | 1 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 1 |
| acceptable_fit | all_purpose | B | fly | river_elevated_runoff_current | 1 |
| acceptable_fit | all_purpose | B | fly | warming_search | 1 |
| acceptable_fit | big_fish | B | fly | breezy_windy_stained_reaction | 1 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 1 |
| acceptable_fit | big_fish | B | fly | river_elevated_runoff_current | 1 |
| acceptable_fit | big_fish | B | fly | warming_search | 1 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 1 |
| acceptable_fit | big_fish | B | lure | warming_search | 1 |
| strong_fit | all_purpose | A | fly | medium_confidence_archive | 18 |
| strong_fit | all_purpose | A | fly | river_elevated_runoff_current | 18 |
| strong_fit | all_purpose | A | lure | medium_confidence_archive | 18 |
| strong_fit | all_purpose | A | lure | river_elevated_runoff_current | 18 |
| strong_fit | all_purpose | B | lure | medium_confidence_archive | 18 |
| strong_fit | all_purpose | B | lure | river_elevated_runoff_current | 18 |
| strong_fit | big_fish | A | lure | medium_confidence_archive | 18 |
| strong_fit | big_fish | A | lure | river_elevated_runoff_current | 18 |
| strong_fit | all_purpose | B | fly | medium_confidence_archive | 17 |
| strong_fit | all_purpose | B | fly | river_elevated_runoff_current | 17 |
| strong_fit | big_fish | A | fly | medium_confidence_archive | 17 |
| strong_fit | big_fish | A | fly | river_elevated_runoff_current | 17 |
| strong_fit | big_fish | B | fly | medium_confidence_archive | 17 |
| strong_fit | big_fish | B | fly | river_elevated_runoff_current | 17 |
| strong_fit | big_fish | B | lure | medium_confidence_archive | 15 |
| strong_fit | big_fish | B | lure | river_elevated_runoff_current | 15 |
| strong_fit | all_purpose | A | fly | cold_slow_or_front | 12 |
| strong_fit | all_purpose | A | lure | cold_slow_or_front | 12 |
| strong_fit | all_purpose | B | fly | cold_slow_or_front | 12 |
| strong_fit | all_purpose | B | lure | cold_slow_or_front | 12 |
| strong_fit | big_fish | A | fly | cold_slow_or_front | 12 |
| strong_fit | big_fish | A | lure | cold_slow_or_front | 12 |
| strong_fit | big_fish | B | fly | cold_slow_or_front | 12 |
| strong_fit | big_fish | B | lure | cold_slow_or_front | 10 |
| strong_fit | all_purpose | A | fly | dirty_vibration | 6 |
| strong_fit | all_purpose | A | fly | warming_search | 6 |
| strong_fit | all_purpose | A | lure | dirty_vibration | 6 |
| strong_fit | all_purpose | A | lure | warming_search | 6 |
| strong_fit | all_purpose | B | fly | dirty_vibration | 6 |
| strong_fit | all_purpose | B | lure | dirty_vibration | 6 |
| strong_fit | all_purpose | B | lure | warming_search | 6 |
| strong_fit | big_fish | A | lure | dirty_vibration | 6 |
| strong_fit | big_fish | A | lure | warming_search | 6 |
| strong_fit | big_fish | B | fly | dirty_vibration | 6 |
| strong_fit | all_purpose | B | fly | warming_search | 5 |
| strong_fit | big_fish | A | fly | dirty_vibration | 5 |
| strong_fit | big_fish | A | fly | warming_search | 5 |
| strong_fit | big_fish | B | fly | warming_search | 5 |
| strong_fit | big_fish | B | lure | warming_search | 5 |
| strong_fit | all_purpose | A | fly | breezy_windy_stained_reaction | 4 |
| strong_fit | all_purpose | A | lure | breezy_windy_stained_reaction | 4 |
| strong_fit | all_purpose | B | lure | breezy_windy_stained_reaction | 4 |
| strong_fit | big_fish | A | fly | breezy_windy_stained_reaction | 4 |
| strong_fit | big_fish | A | lure | breezy_windy_stained_reaction | 4 |
| strong_fit | big_fish | B | lure | breezy_windy_stained_reaction | 4 |
| strong_fit | big_fish | B | lure | dirty_vibration | 4 |
| strong_fit | all_purpose | B | fly | breezy_windy_stained_reaction | 3 |
| strong_fit | big_fish | B | fly | breezy_windy_stained_reaction | 3 |

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
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 200) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose B | Clouser Minnow (fly_of_the_day, fly, score 192) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose A | Bucktail Streamer (fly_of_the_day, fly, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 dirty big_fish B | Sculpzilla (fly_of_the_day, fly, score 188) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-01-18 stained all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-01-18 stained all_purpose A | Hair Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-01-18 dirty all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 200) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-01-18 dirty all_purpose A | Hair Jig (lure_of_the_day, lure, score 188) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose A | Hair Jig (lure_of_the_day, lure, score 222) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>clear_subtle+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>clear_subtle+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>dirty_vibration+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-01-18 clear all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear big_fish A | Hair Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>clear_subtle+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear big_fish B | Hair Jig (honorable_lure, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>clear_subtle+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained all_purpose A | Hair Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>dirty_vibration+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained all_purpose B | Hair Jig (honorable_lure, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>dirty_vibration+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-01-18 clear all_purpose A | Hair Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose A | Ned Rig (honorable_lure, lure, score 200) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>clear_subtle+cold_slow+runoff_streamer+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 96 | 31 | 32% |
| clear_subtle | 32 | 11 | 34% |
| dirty_vibration | 96 | 0 | 0% |
| heat_finesse | 0 | 0 |  |
| cold_slow | 96 | 69 | 72% |
| low_light_surface | 0 | 0 |  |
| calm_surface | 0 | 0 |  |
| Trout dirty/runoff/current fit | 144 | 134 | 93% |
| Big Fish upside | 72 | 68 | 94% |
| All Purpose reliable/versatile | 72 | 71 | 99% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Hair Jig [lure] (22), Blade Bait [lure] (15), Articulated Baitfish Streamer [fly] (10), Sculpzilla [fly] (10), Suspending Jerkbait [lure] (10), Casting Spoon [lure] (9), Inline Spinner [lure] (9), Sculpin Streamer [fly] (9), Articulated Dungeon Streamer [fly] (8), Ned Rig [lure] (7), Jighead Marabou Leech [fly] (6), Muddler Minnow [fly] (6) |
| All-purpose | Hair Jig [lure] (11), Sculpin Streamer [fly] (9), Inline Spinner [lure] (8), Blade Bait [lure] (6), Jighead Marabou Leech [fly] (6), Muddler Minnow [fly] (6), Ned Rig [lure] (6), Woolly Bugger [fly] (5) |
| Big-fish | Hair Jig [lure] (11), Articulated Baitfish Streamer [fly] (9), Blade Bait [lure] (9), Sculpzilla [fly] (9), Articulated Dungeon Streamer [fly] (8), Casting Spoon [lure] (7), Suspending Jerkbait [lure] (7), Rabbit-Strip Leech [fly] (6) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 6 | 6 | 0 | 0 | 0 |
| fly | 16 | 14 | 2 | 0 | 0 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 22/36 | 61.1% | all_purpose:11, big_fish:11 | A:17, B:5 | top:15, honorable:7 | clear:8, dirty:7, stained:7 | freshwater_river:22 | current_swing:22, runoff_streamer:22, cold_slow:16, dirty_vibration:14 |
| Blade Bait<br>blade_bait | lure | 15/36 | 41.7% | big_fish:9, all_purpose:6 | B:12, A:3 | honorable:8, top:7 | clear:6, dirty:5, stained:4 | freshwater_river:15 | current_swing:15, runoff_streamer:15, cold_slow:10, dirty_vibration:9 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 10/36 | 27.8% | big_fish:9, all_purpose:1 | B:8, A:2 | honorable:9, top:1 | dirty:4, clear:3, stained:3 | freshwater_river:10 | current_swing:10, runoff_streamer:10, dirty_vibration:7, wind_reaction:7 |
| Sculpzilla<br>sculpzilla | fly | 10/36 | 27.8% | big_fish:9, all_purpose:1 | A:6, B:4 | top:6, honorable:4 | stained:4, clear:3, dirty:3 | freshwater_river:10 | current_swing:10, runoff_streamer:10, dirty_vibration:7, wind_reaction:7 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 10/36 | 27.8% | big_fish:7, all_purpose:3 | B:7, A:3 | honorable:7, top:3 | stained:5, clear:4, dirty:1 | freshwater_river:10 | current_swing:10, runoff_streamer:10, wind_reaction:8, cold_slow:6 |
| Casting Spoon<br>casting_spoon | lure | 9/36 | 25% | big_fish:7, all_purpose:2 | A:5, B:4 | honorable:6, top:3 | stained:4, dirty:3, clear:2 | freshwater_river:9 | current_swing:9, runoff_streamer:9, wind_reaction:8, dirty_vibration:7 |
| Inline Spinner<br>inline_spinner | lure | 9/36 | 25% | all_purpose:8, big_fish:1 | A:5, B:4 | honorable:5, top:4 | dirty:5, clear:2, stained:2 | freshwater_river:9 | current_swing:9, runoff_streamer:9, wind_reaction:8, dirty_vibration:7 |
| Sculpin Streamer<br>sculpin_streamer | fly | 9/36 | 25% | all_purpose:9 | A:7, B:2 | top:8, honorable:1 | clear:3, dirty:3, stained:3 | freshwater_river:9 | current_swing:9, runoff_streamer:9, cold_slow:6, dirty_vibration:6 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8/36 | 22.2% | big_fish:8 | A:6, B:2 | honorable:6, top:2 | clear:3, stained:3, dirty:2 | freshwater_river:8 | current_swing:8, runoff_streamer:8, cold_slow:6, dirty_vibration:5 |
| Ned Rig<br>ned_rig | lure | 7/36 | 19.4% | all_purpose:6, big_fish:1 | B:4, A:3 | top:4, honorable:3 | dirty:3, clear:2, stained:2 | freshwater_river:7 | cold_slow:7, current_swing:7, runoff_streamer:7, dirty_vibration:5 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 6/36 | 16.7% | all_purpose:6 | A:5, B:1 | honorable:4, top:2 | clear:2, dirty:2, stained:2 | freshwater_river:6 | cold_slow:6, current_swing:6, runoff_streamer:6, dirty_vibration:4 |
| Muddler Minnow<br>muddler_sculpin | fly | 6/36 | 16.7% | all_purpose:6 | B:6 | honorable:3, top:3 | clear:2, dirty:2, stained:2 | freshwater_river:6 | cold_slow:6, current_swing:6, runoff_streamer:6, dirty_vibration:4 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 6/36 | 16.7% | big_fish:6 | B:4, A:2 | top:6 | clear:2, dirty:2, stained:2 | freshwater_river:6 | cold_slow:6, current_swing:6, runoff_streamer:6, dirty_vibration:4 |
| Woolly Bugger<br>woolly_bugger | fly | 5/36 | 13.9% | all_purpose:5 | B:4, A:1 | honorable:4, top:1 | dirty:2, stained:2, clear:1 | freshwater_river:5 | cold_slow:5, current_swing:5, runoff_streamer:5, dirty_vibration:4 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 4/36 | 11.1% | all_purpose:3, big_fish:1 | A:3, B:1 | top:3, honorable:1 | stained:2, clear:1, dirty:1 | freshwater_river:4 | current_swing:4, open_water_search:4, runoff_streamer:4, warming_search:4 |
| Clouser Minnow<br>clouser_minnow | fly | 2/36 | 5.6% | all_purpose:2 | A:1, B:1 | honorable:1, top:1 | dirty:1, stained:1 | freshwater_river:2 | current_swing:2, dirty_vibration:2, open_water_search:2, runoff_streamer:2 |
| Game Changer<br>game_changer | fly | 2/36 | 5.6% | big_fish:2 | A:1, B:1 | honorable:1, top:1 | clear:1, dirty:1 | freshwater_river:2 | current_swing:2, open_water_search:2, runoff_streamer:2, warming_search:2 |
| Zonker Streamer<br>zonker_streamer | fly | 2/36 | 5.6% | all_purpose:1, big_fish:1 | A:1, B:1 | honorable:1, top:1 | clear:1, dirty:1 | freshwater_river:2 | current_swing:2, open_water_search:2, runoff_streamer:2, warming_search:2 |
| Conehead Streamer<br>conehead_streamer | fly | 1/36 | 2.8% | all_purpose:1 | A:1 | honorable:1 | clear:1 | freshwater_river:1 | clear_subtle:1, current_swing:1, open_water_search:1, runoff_streamer:1 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 1/36 | 2.8% | all_purpose:1 | B:1 | top:1 | clear:1 | freshwater_river:1 | clear_subtle:1, cold_slow:1, current_swing:1, runoff_streamer:1 |
| Feather Jig Leech<br>feather_jig_leech | fly | 0/36 | 0% |  |  |  |  |  |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 0/24 | 0% |  |  |  |  |  |  |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 22/144 (15.3%) | 15/72 (20.8%) | 7/72 (9.7%) | 22/72 (30.6%) | - | top actual >20%<br>lure side actual >20% |
| Blade Bait<br>blade_bait | lure | 15/144 (10.4%) | 7/72 (9.7%) | 8/72 (11.1%) | 15/72 (20.8%) | - | lure side actual >20% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 10/144 (6.9%) | 1/72 (1.4%) | 9/72 (12.5%) | - | 10/72 (13.9%) |  |
| Sculpzilla<br>sculpzilla | fly | 10/144 (6.9%) | 6/72 (8.3%) | 4/72 (5.6%) | - | 10/72 (13.9%) |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 10/144 (6.9%) | 3/72 (4.2%) | 7/72 (9.7%) | 10/72 (13.9%) | - |  |
| Sculpin Streamer<br>sculpin_streamer | fly | 9/144 (6.3%) | 8/72 (11.1%) | 1/72 (1.4%) | - | 9/72 (12.5%) |  |
| Casting Spoon<br>casting_spoon | lure | 9/144 (6.3%) | 3/72 (4.2%) | 6/72 (8.3%) | 9/72 (12.5%) | - |  |
| Inline Spinner<br>inline_spinner | lure | 9/144 (6.3%) | 4/72 (5.6%) | 5/72 (6.9%) | 9/72 (12.5%) | - |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8/144 (5.6%) | 2/72 (2.8%) | 6/72 (8.3%) | - | 8/72 (11.1%) |  |
| Ned Rig<br>ned_rig | lure | 7/144 (4.9%) | 4/72 (5.6%) | 3/72 (4.2%) | 7/72 (9.7%) | - |  |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 6/144 (4.2%) | 2/72 (2.8%) | 4/72 (5.6%) | - | 6/72 (8.3%) |  |
| Muddler Minnow<br>muddler_sculpin | fly | 6/144 (4.2%) | 3/72 (4.2%) | 3/72 (4.2%) | - | 6/72 (8.3%) |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 6/144 (4.2%) | 6/72 (8.3%) | 0/72 (0%) | - | 6/72 (8.3%) |  |
| Woolly Bugger<br>woolly_bugger | fly | 5/144 (3.5%) | 1/72 (1.4%) | 4/72 (5.6%) | - | 5/72 (6.9%) |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 4/144 (2.8%) | 3/72 (4.2%) | 1/72 (1.4%) | - | 4/72 (5.6%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 2/144 (1.4%) | 1/72 (1.4%) | 1/72 (1.4%) | - | 2/72 (2.8%) |  |
| Game Changer<br>game_changer | fly | 2/144 (1.4%) | 1/72 (1.4%) | 1/72 (1.4%) | - | 2/72 (2.8%) |  |
| Zonker Streamer<br>zonker_streamer | fly | 2/144 (1.4%) | 1/72 (1.4%) | 1/72 (1.4%) | - | 2/72 (2.8%) |  |
| Conehead Streamer<br>conehead_streamer | fly | 1/144 (0.7%) | 0/72 (0%) | 1/72 (1.4%) | - | 1/72 (1.4%) |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 1/144 (0.7%) | 1/72 (1.4%) | 0/72 (0%) | - | 1/72 (1.4%) |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | - | 0/72 (0%) |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | - | 0/72 (0%) |  |

## Zero-Selected Eligible Profiles

| Profile | Gear | Candidate opportunities | Top available contexts | Top competing winners |
| --- | --- | --- | --- | --- |
| Feather Jig Leech<br>feather_jig_leech | fly | 36 | all_purpose / dirty / freshwater_river / dirty_vibration:6, big_fish / dirty / freshwater_river / dirty_vibration:6, all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:4 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 24 | all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / dirty / freshwater_river / dirty_vibration:4, big_fish / clear / freshwater_river / cold_slow_or_front:4, big_fish / dirty / freshwater_river / dirty_vibration:4 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):3 |

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

None.

## Overdominance Guardrail Summary

None.

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 22/144 (15.3%) | 15/72 (20.8%) | 7/72 (9.7%) | 22/72 (30.6%) | 22/36 (61.1%) | 15/36 (41.7%) / 7/36 (19.4%) | top actual>20%<br>lure side actual>20% |
| Blade Bait<br>blade_bait | lure | 15/144 (10.4%) | 7/72 (9.7%) | 8/72 (11.1%) | 15/72 (20.8%) | 15/36 (41.7%) | 7/36 (19.4%) / 8/36 (22.2%) | lure side actual>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.17.
Average expanded finalist pool size: 2.83.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 59.
Rows/slots with expanded finalist pool size 1: 39.
Selected-tier singleton slots expanded above 1: 20.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.56 | 3.39 | 1 | 1 | 11 | 8 |
| fly/top | 2.69 | 3.69 | 1 | 1 | 11 | 6 |
| lure/honorable | 1.94 | 2.44 | 1 | 1 | 13 | 7 |
| lure/top | 1.47 | 1.78 | 1 | 1 | 24 | 18 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 119 |
| goal_or_priority_condition | 25 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_and_priority_condition | 119 |
| goal_or_priority_condition | 74 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 24 |
| family_diversity_scarcity | 15 |

Representative expanded singleton finalist pools:
- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B fly/top: sculpin_streamer (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B lure/honorable: inline_spinner (goal_or_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__A lure/top: inline_spinner (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B lure/honorable: suspending_jerkbait (goal_or_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B lure/top: inline_spinner (goal_or_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__A lure/top: inline_spinner (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B lure/honorable: inline_spinner (goal_or_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__B fly/top: jighead_marabou_leech (goal_or_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B lure/honorable: inline_spinner (goal_or_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B fly/top: muddler_sculpin (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__B fly/honorable: articulated_dungeon_streamer (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B lure/top: ned_rig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B fly/top: jighead_marabou_leech (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B fly/honorable: muddler_sculpin (goal_and_priority_condition; family_diversity_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 2.64 |
| Different-presentation close candidates | 1.07 |
| Different-family close candidates | 1.32 |
| Final expanded Set B pool | 1.79 |
| Same-family/same-presentation reintroduced | 15/72 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 24 |
| Coverage pool used | 10 |
| Average used coverage pool size | 1.90 |
| Singleton used coverage pools | 3 |
| Broad pool larger than narrowed pool | 4 |
| Broad pool same as narrowed pool | 6 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 0 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 14 |
| broad | 10 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| inline_spinner | 8 |
| suspending_jerkbait | 7 |
| casting_spoon | 4 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| suspending_jerkbait | 4 |
| inline_spinner | 3 |
| casting_spoon | 2 |
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
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
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
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 10/36 | 10/36 | goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 8/36 | 8/36 | goal_tags>1 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 2/36 | 2/36 | goal_tags>1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 0/24 | 0/24 | clear+stained+dirty clarity |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 0/36 | 0/36 | clear+stained+dirty clarity |
| Game Changer<br>game_changer | fly | 7 | 2/36 | 2/36 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 6/36 | 6/36 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 1/36 | 1/36 | clear+stained+dirty clarity |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 6/36 | 6/36 | goal_tags>1<br>reliable_action+big_fish_upside |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 9/36 | 9/36 | clear+stained+dirty clarity<br>broad per-slot share>20% |
| Sculpzilla<br>sculpzilla | fly | 7 | 10/36 | 10/36 | combined all-slot share>25% |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 5/36 | 5/36 | clear+stained+dirty clarity |
| Blade Bait<br>blade_bait | lure | 7 | 15/36 | 15/36 | clear+stained+dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Hair Jig<br>hair_jig | lure | 8 | 22/36 | 22/36 | combined all-slot share>25%<br>broad per-slot share>20% |
| Inline Spinner<br>inline_spinner | lure | 8 | 9/36 | 9/36 | goal_tags>1 |
| Ned Rig<br>ned_rig | lure | 9 | 7/36 | 7/36 | clear+stained+dirty clarity |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 10/36 | 10/36 | goal_tags>1<br>combined all-slot share>25% |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 8 | 22/36 (61.1%) | 22/36 (61.1%) | all_purpose:11, big_fish:11 | top:15, honorable:7 | current_swing:22, runoff_streamer:22, cold_slow:16, dirty_vibration:14, wind_reaction:12 |
| Blade Bait<br>blade_bait | lure | 7 | 15/36 (41.7%) | 15/36 (41.7%) | big_fish:9, all_purpose:6 | honorable:8, top:7 | current_swing:15, runoff_streamer:15, cold_slow:10, dirty_vibration:9, wind_reaction:9 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 10/36 (27.8%) | 10/36 (27.8%) | big_fish:7, all_purpose:3 | honorable:7, top:3 | current_swing:10, runoff_streamer:10, wind_reaction:8, cold_slow:6, dirty_vibration:6 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 10/36 (27.8%) | 10/36 (27.8%) | big_fish:9, all_purpose:1 | honorable:9, top:1 | current_swing:10, runoff_streamer:10, dirty_vibration:7, wind_reaction:7, cold_slow:6 |
| Sculpzilla<br>sculpzilla | fly | 7 | 10/36 (27.8%) | 10/36 (27.8%) | big_fish:9, all_purpose:1 | top:6, honorable:4 | current_swing:10, runoff_streamer:10, dirty_vibration:7, wind_reaction:7, cold_slow:6 |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 9/36 (25%) | 9/36 (25%) | all_purpose:9 | top:8, honorable:1 | current_swing:9, runoff_streamer:9, cold_slow:6, dirty_vibration:6, wind_reaction:6 |
| Inline Spinner<br>inline_spinner | lure | 8 | 9/36 (25%) | 9/36 (25%) | all_purpose:8, big_fish:1 | honorable:5, top:4 | current_swing:9, runoff_streamer:9, wind_reaction:8, dirty_vibration:7, open_water_search:5 |
| Casting Spoon<br>casting_spoon | lure | 6 | 9/36 (25%) | 9/36 (25%) | big_fish:7, all_purpose:2 | honorable:6, top:3 | current_swing:9, runoff_streamer:9, wind_reaction:8, dirty_vibration:7, cold_slow:5 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 8/36 (22.2%) | 8/36 (22.2%) | big_fish:8 | honorable:6, top:2 | current_swing:8, runoff_streamer:8, cold_slow:6, dirty_vibration:5, wind_reaction:5 |
| Ned Rig<br>ned_rig | lure | 9 | 7/36 (19.4%) | 7/36 (19.4%) | all_purpose:6, big_fish:1 | top:4, honorable:3 | cold_slow:7, current_swing:7, runoff_streamer:7, dirty_vibration:5, wind_reaction:3 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 6/36 (16.7%) | 6/36 (16.7%) | all_purpose:6 | honorable:4, top:2 | cold_slow:6, current_swing:6, runoff_streamer:6, dirty_vibration:4, wind_reaction:3 |
| Muddler Minnow<br>muddler_sculpin | fly | 7 | 6/36 (16.7%) | 6/36 (16.7%) | all_purpose:6 | honorable:3, top:3 | cold_slow:6, current_swing:6, runoff_streamer:6, dirty_vibration:4, wind_reaction:3 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 6/36 (16.7%) | 6/36 (16.7%) | big_fish:6 | top:6 | cold_slow:6, current_swing:6, runoff_streamer:6, dirty_vibration:4, wind_reaction:3 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 5/36 (13.9%) | 5/36 (13.9%) | all_purpose:5 | honorable:4, top:1 | cold_slow:5, current_swing:5, runoff_streamer:5, dirty_vibration:4, wind_reaction:3 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 4/36 (11.1%) | 4/36 (11.1%) | all_purpose:3, big_fish:1 | top:3, honorable:1 | current_swing:4, open_water_search:4, runoff_streamer:4, warming_search:4, wind_reaction:4 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 2/36 (5.6%) | 2/36 (5.6%) | all_purpose:2 | honorable:1, top:1 | current_swing:2, dirty_vibration:2, open_water_search:2, runoff_streamer:2, warming_search:2 |
| Game Changer<br>game_changer | fly | 7 | 2/36 (5.6%) | 2/36 (5.6%) | big_fish:2 | honorable:1, top:1 | current_swing:2, open_water_search:2, runoff_streamer:2, warming_search:2, wind_reaction:2 |
| Zonker Streamer<br>zonker_streamer | fly | 7 | 2/36 (5.6%) | 2/36 (5.6%) | all_purpose:1, big_fish:1 | honorable:1, top:1 | current_swing:2, open_water_search:2, runoff_streamer:2, warming_search:2, wind_reaction:2 |
| Conehead Streamer<br>conehead_streamer | fly | 7 | 1/36 (2.8%) | 1/36 (2.8%) | all_purpose:1 | honorable:1 | clear_subtle:1, current_swing:1, open_water_search:1, runoff_streamer:1, warming_search:1 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 1/36 (2.8%) | 1/36 (2.8%) | all_purpose:1 | top:1 | clear_subtle:1, cold_slow:1, current_swing:1, runoff_streamer:1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 0/24 (0%) | 0/24 (0%) |  |  |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 0/36 (0%) | 0/36 (0%) |  |  |  |

### Likely Cause Classification

None.

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 36 | 7/36 (19.4%) | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Suspending Jerkbait (honorable):4, Blade Bait (top), Casting Spoon (honorable):2, Blade Bait (top), Inline Spinner (honorable):2 | healthy / not underused |
| Hair Jig<br>hair_jig | lure | forage 2: baitfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: reliable_action | 36 | 22/36 (61.1%) | Blade Bait (top), Casting Spoon (honorable):2, Blade Bait (top), Inline Spinner (honorable):2, Blade Bait (top), Suspending Jerkbait (honorable):2, Suspending Jerkbait (top), Blade Bait (honorable):2 | healthy / not underused |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 36 | 9/36 (25%) | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Suspending Jerkbait (honorable):4, Hair Jig (top), Ned Rig (honorable):3, Blade Bait (top), Casting Spoon (honorable):2 | healthy / not underused |
| Casting Spoon<br>casting_spoon | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: open_water_search, wind_reaction<br>goal 1: versatile_search | 36 | 9/36 (25%) | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Suspending Jerkbait (honorable):4, Hair Jig (top), Ned Rig (honorable):3, Blade Bait (top), Inline Spinner (honorable):2 | healthy / not underused |
| Blade Bait<br>blade_bait | lure | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, open_water_search<br>goal 1: reliable_action | 36 | 15/36 (41.7%) | Hair Jig (top), Suspending Jerkbait (honorable):4, Hair Jig (top), Ned Rig (honorable):3, Casting Spoon (top), Hair Jig (honorable):2, Hair Jig (top), Casting Spoon (honorable):2 | healthy / not underused |
| Suspending Jerkbait<br>suspending_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, wind_reaction<br>goal 2: reliable_action, versatile_search | 36 | 10/36 (27.8%) | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Ned Rig (honorable):3, Blade Bait (top), Casting Spoon (honorable):2, Blade Bait (top), Inline Spinner (honorable):2 | healthy / not underused |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, open_water_search<br>goal 2: reliable_action, versatile_search | 0 | 0/0 |  | scenario coverage |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | forage 2: surface_prey, baitfish<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 0 | 0/0 |  | scenario coverage |
| Woolly Bugger<br>woolly_bugger | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, current_swing<br>goal 1: reliable_action | 36 | 5/36 (13.9%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):3 | healthy / not underused |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | forage 1: leech_worm<br>clarity 2: stained, dirty<br>condition 2: cold_slow, cover_ambush<br>goal 2: reliable_action, big_fish_upside | 36 | 6/36 (16.7%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Articulated Dungeon Streamer (top), Sculpzilla (honorable):2 | healthy / not underused |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, current_swing<br>goal 1: reliable_action | 36 | 6/36 (16.7%) | Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):3 | healthy / not underused |
| Lead-Eye Leech<br>lead_eye_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, clear_subtle<br>goal 1: reliable_action | 36 | 1/36 (2.8%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 | selector/direct-score or overpowered competitors |
| Feather Jig Leech<br>feather_jig_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: warming_search, current_swing<br>goal 1: versatile_search | 36 | 0/36 (0%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 | selector/direct-score or overpowered competitors |
| Sculpin Streamer<br>sculpin_streamer | fly | forage 2: baitfish, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: current_swing, cold_slow, runoff_streamer<br>goal 1: reliable_action | 36 | 9/36 (25%) | Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):3 | healthy / not underused |
| Sculpzilla<br>sculpzilla | fly | forage 2: baitfish, crawfish<br>clarity 2: stained, dirty<br>condition 2: runoff_streamer, current_swing<br>goal 1: big_fish_upside | 36 | 10/36 (27.8%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):3 | healthy / not underused |
| Muddler Minnow<br>muddler_sculpin | fly | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: current_swing, cold_slow<br>goal 1: reliable_action | 36 | 6/36 (16.7%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):3 | healthy / not underused |
| Crawfish Streamer<br>crawfish_streamer | fly | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 2: current_swing, clear_subtle<br>goal 1: reliable_action | 24 | 0/24 (0%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):3 | selector/direct-score or overpowered competitors |
| Clouser Minnow<br>clouser_minnow | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: current_swing, open_water_search<br>goal 2: reliable_action, versatile_search | 36 | 2/36 (5.6%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 | selector/direct-score or overpowered competitors |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 36 | 4/36 (11.1%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 | selector/direct-score or overpowered competitors |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | forage 1: baitfish<br>clarity 1: clear<br>condition 2: clear_subtle, current_swing<br>goal 1: reliable_action | 0 | 0/0 |  | scenario coverage |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: open_water_search, runoff_streamer<br>goal 2: versatile_search, big_fish_upside | 36 | 10/36 (27.8%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):3, Articulated Dungeon Streamer (top), Sculpzilla (honorable):2 | healthy / not underused |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 2: runoff_streamer, cover_ambush<br>goal 2: big_fish_upside, high_risk_high_reward | 36 | 8/36 (22.2%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 | healthy / not underused |
| Game Changer<br>game_changer | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 1: open_water_search<br>goal 2: versatile_search, big_fish_upside | 36 | 2/36 (5.6%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 | scenario coverage or narrow home window |
| Conehead Streamer<br>conehead_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 36 | 1/36 (2.8%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 | selector/direct-score or overpowered competitors |
| Zonker Streamer<br>zonker_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 1: versatile_search | 36 | 2/36 (5.6%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 | selector/direct-score or overpowered competitors |
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
Baitfish Slider Fly (baitfish_slider_fly), Deer Hair Slider (deer_hair_slider), Game Changer (game_changer), Mouse Fly (mouse_fly), Popper Fly (popper_fly), Slim Baitfish Streamer (slim_minnow_streamer), Small Floating Trout Plug (small_floating_trout_plug), Soft Plastic Jerkbait (soft_jerkbait), Unweighted Baitfish Streamer (unweighted_baitfish_streamer)

### Probably selector problem, not catalog problem
Bucktail Streamer (bucktail_baitfish_streamer), Clouser Minnow (clouser_minnow), Conehead Streamer (conehead_streamer), Crawfish Streamer (crawfish_streamer), Feather Jig Leech (feather_jig_leech), Lead-Eye Leech (lead_eye_leech), Zonker Streamer (zonker_streamer)

## Utilization Notes / Coverage Gaps

- 2 eligible profile(s) were never selected despite appearing in candidate pools; these are prime coverage or selector-balance review targets.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Articulated Baitfish Streamer, Articulated Dungeon Streamer, Bucktail Streamer, Game Changer, Jighead Marabou Leech, Muddler Minnow, Rabbit-Strip Leech, Sculpin Streamer, Sculpzilla, Woolly Bugger, Blade Bait, Casting Spoon, Hair Jig, Inline Spinner, Ned Rig, Suspending Jerkbait |
| underused_home_window | Clouser Minnow, Conehead Streamer, Feather Jig Leech, Lead-Eye Leech, Zonker Streamer, Crawfish Streamer |
| no_home_window_coverage | None |
| over-dominant | None |
| probably okay niche profile | Baitfish Slider Fly, Deer Hair Slider, Mouse Fly, Popper Fly, Slim Baitfish Streamer, Unweighted Baitfish Streamer, Small Floating Trout Plug, Soft Plastic Jerkbait |

## Trout Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 13.9% | 10/36 | 10/36 | 10 | 10 | 27.8% | 1/18 | 9/18 | 4 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):3 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 11.1% | 8/36 | 8/36 | 8 | 8 | 22.2% | 0/18 | 8/18 | 5 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 5.6% | 4/36 | 4/36 | 4 | 4 | 11.1% | 3/18 | 1/18 | 7 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3 |
| Clouser Minnow<br>clouser_minnow | fly | 2.8% | 2/36 | 2/36 | 2 | 2 | 5.6% | 2/18 | 0/18 | 5 | underused_home_window | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3 |
| Conehead Streamer<br>conehead_streamer | fly | 1.4% | 1/36 | 1/36 | 1 | 1 | 2.8% | 1/18 | 0/18 | 10 | underused_home_window | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3 |
| Feather Jig Leech<br>feather_jig_leech | fly | 0% | 0/36 | 0/36 | 0 | 0 | 0% | 0/18 | 0/18 | 7 | underused_home_window | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3 |
| Game Changer<br>game_changer | fly | 2.8% | 2/36 | 2/36 | 2 | 2 | 5.6% | 0/18 | 2/18 | 0 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 8.3% | 6/36 | 6/36 | 6 | 6 | 16.7% | 6/18 | 0/18 | 14 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 1.4% | 1/36 | 1/36 | 1 | 1 | 2.8% | 1/18 | 0/18 | 8 | underused_home_window | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3 |
| Muddler Minnow<br>muddler_sculpin | fly | 8.3% | 6/36 | 6/36 | 6 | 6 | 16.7% | 6/18 | 0/18 | 6 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 8.3% | 6/36 | 6/36 | 6 | 6 | 16.7% | 0/18 | 6/18 | 9 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3 |
| Sculpin Streamer<br>sculpin_streamer | fly | 12.5% | 9/36 | 9/36 | 9 | 9 | 25% | 9/18 | 0/18 | 23 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 |
| Sculpzilla<br>sculpzilla | fly | 13.9% | 10/36 | 10/36 | 10 | 10 | 27.8% | 1/18 | 9/18 | 10 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 |
| Woolly Bugger<br>woolly_bugger | fly | 6.9% | 5/36 | 5/36 | 5 | 5 | 13.9% | 5/18 | 0/18 | 4 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 |
| Zonker Streamer<br>zonker_streamer | fly | 2.8% | 2/36 | 2/36 | 2 | 2 | 5.6% | 1/18 | 1/18 | 9 | underused_home_window | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 0% | 0/24 | 0/24 | 0 | 0 | 0% | 0/12 | 0/12 | 2 | underused_home_window | activity neutral:24<br>clarity clear:8, dirty:8, stained:8<br>water freshwater_river:24<br>bucket cold_slow_or_front:12, dirty_vibration:8, breezy_windy_stained_reaction:4 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Mouse Fly<br>mouse_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Popper Fly<br>popper_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Blade Bait<br>blade_bait | lure | 20.8% | 15/36 | 15/36 | 15 | 15 | 41.7% | 6/18 | 9/18 | 6 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Hair Jig (top), Suspending Jerkbait (honorable):4, Hair Jig (top), Ned Rig (honorable):3, Casting Spoon (top), Hair Jig (honorable):2 |
| Casting Spoon<br>casting_spoon | lure | 12.5% | 9/36 | 9/36 | 9 | 9 | 25% | 2/18 | 7/18 | 4 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Suspending Jerkbait (honorable):4, Hair Jig (top), Ned Rig (honorable):3 |
| Hair Jig<br>hair_jig | lure | 30.6% | 22/36 | 22/36 | 22 | 22 | 61.1% | 11/18 | 11/18 | 12 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Blade Bait (top), Casting Spoon (honorable):2, Blade Bait (top), Suspending Jerkbait (honorable):2, Suspending Jerkbait (top), Blade Bait (honorable):2 |
| Inline Spinner<br>inline_spinner | lure | 12.5% | 9/36 | 9/36 | 9 | 9 | 25% | 8/18 | 1/18 | 9 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Suspending Jerkbait (honorable):4, Hair Jig (top), Ned Rig (honorable):3 |
| Ned Rig<br>ned_rig | lure | 9.7% | 7/36 | 7/36 | 7 | 7 | 19.4% | 6/18 | 1/18 | 5 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Suspending Jerkbait (honorable):4, Blade Bait (top), Casting Spoon (honorable):2 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 13.9% | 10/36 | 10/36 | 10 | 10 | 27.8% | 3/18 | 7/18 | 3 | healthy | activity neutral:36<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_river:36<br>bucket cold_slow_or_front:12, dirty_vibration:12, breezy_windy_stained_reaction:8 | Hair Jig (top), Blade Bait (honorable):4, Hair Jig (top), Ned Rig (honorable):3, Blade Bait (top), Casting Spoon (honorable):2 |
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
| Ned Rig<br>ned_rig | 6/18 | 1/18 | goal_tags:21, daily_condition_tags:7, selector_filtering_variety_jitter:1 | Upper Delaware trout river 2025-01-18 all_purpose clear: lost to Blade Bait by -6 (selector_filtering_variety_jitter)<br>Upper Delaware trout river 2025-01-18 big_fish stained: lost to Suspending Jerkbait by 2 (goal_tags)<br>Upper Delaware trout river 2025-01-18 big_fish clear: lost to Blade Bait by 6 (goal_tags) |

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
| Conehead Streamer<br>conehead_streamer | fly | 1/36 | 2.8% | 10 | all_purpose / dirty / freshwater_river / dirty_vibration:6, big_fish / dirty / freshwater_river / dirty_vibration:6, all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:4 | goal_tags:30, selector_filtering_variety_jitter:5 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 |
| Zonker Streamer<br>zonker_streamer | fly | 2/36 | 5.6% | 9 | all_purpose / dirty / freshwater_river / dirty_vibration:6, big_fish / dirty / freshwater_river / dirty_vibration:6, all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:4 | goal_tags:30, selector_filtering_variety_jitter:4 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 1/36 | 2.8% | 8 | all_purpose / dirty / freshwater_river / dirty_vibration:6, big_fish / dirty / freshwater_river / dirty_vibration:6, all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:4 | goal_tags:18, daily_condition_tags:16, selector_filtering_variety_jitter:1 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 |
| Feather Jig Leech<br>feather_jig_leech | fly | 0/36 | 0% | 7 | all_purpose / dirty / freshwater_river / dirty_vibration:6, big_fish / dirty / freshwater_river / dirty_vibration:6, all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:4 | goal_tags:32, daily_condition_tags:3, selector_filtering_variety_jitter:1 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 |
| Clouser Minnow<br>clouser_minnow | fly | 2/36 | 5.6% | 5 | all_purpose / dirty / freshwater_river / dirty_vibration:6, big_fish / dirty / freshwater_river / dirty_vibration:6, all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:4 | goal_tags:17, daily_condition_tags:13, selector_filtering_variety_jitter:4 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 0/24 | 0% | 2 | all_purpose / clear / freshwater_river / cold_slow_or_front:4, all_purpose / dirty / freshwater_river / dirty_vibration:4, big_fish / clear / freshwater_river / cold_slow_or_front:4, big_fish / dirty / freshwater_river / dirty_vibration:4 | goal_tags:12, daily_condition_tags:11, forage_clarity_stack:1 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Muddler Minnow (top), Woolly Bugger (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):3 |

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
| wind_reaction | all_purpose | Sculpin Streamer [fly] (6), Hair Jig [lure] (4), Inline Spinner [lure] (4), Bucktail Streamer [fly] (2), Muddler Minnow [fly] (2) | Inline Spinner [lure] (7), Hair Jig [lure] (6), Sculpin Streamer [fly] (6), Blade Bait [lure] (3), Bucktail Streamer [fly] (3) |
| wind_reaction | big_fish | Blade Bait [lure] (4), Hair Jig [lure] (4), Casting Spoon [lure] (3), Rabbit-Strip Leech [fly] (3), Sculpzilla [fly] (3) | Articulated Baitfish Streamer [fly] (6), Blade Bait [lure] (6), Casting Spoon [lure] (6), Hair Jig [lure] (6), Sculpzilla [fly] (6) |
| dirty_vibration | all_purpose | Hair Jig [lure] (5), Sculpin Streamer [fly] (5), Inline Spinner [lure] (3), Ned Rig [lure] (3), Jighead Marabou Leech [fly] (2) | Hair Jig [lure] (7), Inline Spinner [lure] (6), Sculpin Streamer [fly] (6), Jighead Marabou Leech [fly] (4), Muddler Minnow [fly] (4) |
| dirty_vibration | big_fish | Blade Bait [lure] (4), Hair Jig [lure] (4), Rabbit-Strip Leech [fly] (4), Sculpzilla [fly] (4), Casting Spoon [lure] (3) | Hair Jig [lure] (7), Articulated Baitfish Streamer [fly] (6), Blade Bait [lure] (6), Sculpzilla [fly] (6), Articulated Dungeon Streamer [fly] (5) |
| clear_subtle | all_purpose | Hair Jig [lure] (2), Sculpin Streamer [fly] (2), Bucktail Streamer [fly] (1), Inline Spinner [lure] (1), Lead-Eye Leech [fly] (1) | Hair Jig [lure] (3), Blade Bait [lure] (2), Sculpin Streamer [fly] (2), Bucktail Streamer [fly] (1), Conehead Streamer [fly] (1) |
| clear_subtle | big_fish | Hair Jig [lure] (2), Sculpzilla [fly] (2), Suspending Jerkbait [lure] (2), Game Changer [fly] (1), Rabbit-Strip Leech [fly] (1) | Hair Jig [lure] (3), Articulated Baitfish Streamer [fly] (2), Articulated Dungeon Streamer [fly] (2), Blade Bait [lure] (2), Sculpzilla [fly] (2) |
| cold_slow | all_purpose | Hair Jig [lure] (7), Sculpin Streamer [fly] (5), Muddler Minnow [fly] (3), Ned Rig [lure] (3), Blade Bait [lure] (2) | Hair Jig [lure] (8), Jighead Marabou Leech [fly] (6), Muddler Minnow [fly] (6), Ned Rig [lure] (6), Sculpin Streamer [fly] (6) |
| cold_slow | big_fish | Hair Jig [lure] (6), Rabbit-Strip Leech [fly] (6), Sculpzilla [fly] (4), Blade Bait [lure] (3), Articulated Baitfish Streamer [fly] (1) | Hair Jig [lure] (8), Articulated Baitfish Streamer [fly] (6), Articulated Dungeon Streamer [fly] (6), Blade Bait [lure] (6), Rabbit-Strip Leech [fly] (6) |
| warming_search | all_purpose | Inline Spinner [lure] (4), Sculpin Streamer [fly] (3), Bucktail Streamer [fly] (2), Clouser Minnow [fly] (1), Hair Jig [lure] (1) | Inline Spinner [lure] (4), Bucktail Streamer [fly] (3), Hair Jig [lure] (3), Sculpin Streamer [fly] (3), Blade Bait [lure] (2) |
| warming_search | big_fish | Blade Bait [lure] (2), Casting Spoon [lure] (2), Sculpzilla [fly] (2), Articulated Dungeon Streamer [fly] (1), Bucktail Streamer [fly] (1) | Articulated Baitfish Streamer [fly] (3), Blade Bait [lure] (3), Casting Spoon [lure] (3), Hair Jig [lure] (3), Sculpzilla [fly] (3) |
| heat_finesse | all_purpose | None | None |
| heat_finesse | big_fish | None | None |
| current_swing | all_purpose | Hair Jig [lure] (8), Sculpin Streamer [fly] (8), Inline Spinner [lure] (4), Muddler Minnow [fly] (3), Ned Rig [lure] (3) | Hair Jig [lure] (11), Sculpin Streamer [fly] (9), Inline Spinner [lure] (8), Blade Bait [lure] (6), Jighead Marabou Leech [fly] (6) |
| current_swing | big_fish | Hair Jig [lure] (7), Rabbit-Strip Leech [fly] (6), Sculpzilla [fly] (6), Blade Bait [lure] (5), Casting Spoon [lure] (3) | Hair Jig [lure] (11), Articulated Baitfish Streamer [fly] (9), Blade Bait [lure] (9), Sculpzilla [fly] (9), Articulated Dungeon Streamer [fly] (8) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (174); Blade Bait (164); Game Changer (166); Articulated Dungeon Streamer (166) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Hair Jig (176); Suspending Jerkbait (176); Clouser Minnow (192); Sculpzilla (168) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (192); Blade Bait (180); Sculpin Streamer (190); Zonker Streamer (190) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Hair Jig (186); Casting Spoon (174); Sculpzilla (180); Articulated Baitfish Streamer (174) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (200); Blade Bait (170); Sculpin Streamer (180); Articulated Baitfish Streamer (174) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (174); Hair Jig (170); Articulated Dungeon Streamer (174); Sculpzilla (188) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Blade Bait (164); Suspending Jerkbait (158); Bucktail Streamer (178); Articulated Baitfish Streamer (182) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, clear_subtle+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (222); Blade Bait (178); Lead-Eye Leech (200); Muddler Minnow (194) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear big_fish B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, clear_subtle+cold_slow+runoff_streamer+current_swing, medium | Suspending Jerkbait (158); Hair Jig (206); Sculpzilla (178); Articulated Baitfish Streamer (148) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty big_fish B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Ned Rig (156); Hair Jig (182); Rabbit-Strip Leech (176); Articulated Baitfish Streamer (156) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained big_fish B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Blade Bait (162); Casting Spoon (126); Sculpzilla (186); Articulated Baitfish Streamer (156) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-01-18 clear big_fish B | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+cold_slow+runoff_streamer+current_swing, medium | Blade Bait (162); Suspending Jerkbait (158); Rabbit-Strip Leech (168); Articulated Baitfish Streamer (148) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-01-18 dirty big_fish B | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Blade Bait (162); Casting Spoon (134); Rabbit-Strip Leech (176); Articulated Baitfish Streamer (156) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-01-18 stained big_fish B | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Casting Spoon (142); Suspending Jerkbait (158); Rabbit-Strip Leech (176); Articulated Dungeon Streamer (172) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (208); Hair Jig (202); Bucktail Streamer (190); Conehead Streamer (190) | None |
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (200); Hair Jig (168); Bucktail Streamer (182); Clouser Minnow (184) | None |
| White River Ozark trout tailwater<br>2025-01-16 dirty big_fish A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (166); Hair Jig (162); Zonker Streamer (170); Game Changer (166) | None |
| White River Ozark trout tailwater<br>2025-01-16 dirty big_fish B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Blade Bait (164); Inline Spinner (170); Sculpzilla (188); Articulated Baitfish Streamer (182) | None |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (208); Casting Spoon (174); Sculpin Streamer (180); Bucktail Streamer (190) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear all_purpose A | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, clear_subtle+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (222); Ned Rig (200); Sculpin Streamer (210); Jighead Marabou Leech (200) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear big_fish A | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, clear_subtle+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (206); Blade Bait (162); Rabbit-Strip Leech (168); Articulated Dungeon Streamer (164) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty all_purpose A | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (188); Inline Spinner (152); Jighead Marabou Leech (190); Sculpin Streamer (200) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty all_purpose B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Ned Rig (174); Blade Bait (168); Woolly Bugger (180); Muddler Minnow (176) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty big_fish A | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (182); Blade Bait (162); Sculpzilla (186); Articulated Dungeon Streamer (172) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained all_purpose A | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (206); Ned Rig (184); Sculpin Streamer (210); Jighead Marabou Leech (200) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained all_purpose B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Blade Bait (178); Hair Jig (206); Muddler Minnow (194); Woolly Bugger (190) | None |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained big_fish A | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (190); Suspending Jerkbait (142); Rabbit-Strip Leech (176); Articulated Dungeon Streamer (172) | None |
| Upper Delaware trout river<br>2025-01-18 clear all_purpose A | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (206); Ned Rig (184); Sculpin Streamer (210); Jighead Marabou Leech (200) | None |
| Upper Delaware trout river<br>2025-01-18 clear all_purpose B | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+cold_slow+runoff_streamer+current_swing, medium | Blade Bait (178); Inline Spinner (176); Muddler Minnow (194); Woolly Bugger (190) | None |
| Upper Delaware trout river<br>2025-01-18 clear big_fish A | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (190); Casting Spoon (142); Articulated Dungeon Streamer (164); Sculpzilla (178) | None |
| Upper Delaware trout river<br>2025-01-18 dirty all_purpose A | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Hair Jig (188); Inline Spinner (168); Sculpin Streamer (200); Woolly Bugger (180) | None |
| Upper Delaware trout river<br>2025-01-18 dirty all_purpose B | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing, medium | Ned Rig (174); Casting Spoon (134); Jighead Marabou Leech (190); Muddler Minnow (176) | None |

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
