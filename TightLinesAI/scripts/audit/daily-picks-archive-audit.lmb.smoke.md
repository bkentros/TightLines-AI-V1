# FinFindr LMB Daily-Picks Archive Audit
Generated: 2026-05-11T17:03:04.183Z

## Scope Summary

| Metric | Value |
| --- | --- |
| Archived weather scenarios | 3 |
| Expanded recommendation runs | 36 |
| Months | Jan, Mar |
| Regions | 1 |
| Fisheries | 1 |
| Water types | freshwater_lake_pond |
| Clarity split | clear:12, stained:12, dirty:12 |
| Goal split | all_purpose:18, big_fish:18 |
| Skipped weather scenarios | 0 |
| JSONL output | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/daily-picks-archive-audit.lmb.smoke.jsonl |

## Condition Bucket Coverage

| Bucket | Expanded runs |
| --- | --- |
| calm_low_light_surface | 0 |
| calm_bright_clear_subtle | 4 |
| breezy_windy_stained_reaction | 4 |
| dirty_vibration | 8 |
| cold_slow_or_front | 36 |
| warming_search | 0 |
| heat_limited_finesse | 0 |
| stable_pleasant_high_confidence | 0 |
| stable_pleasant_medium_confidence_archive | 0 |
| river_elevated_runoff_current | 0 |
| medium_confidence_archive | 36 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 0 |
| adjacent_day_change | 1 |

## Adjacent-Day Coverage

| Pair | Class | Wind delta | Temp delta | Tag delta |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 -> 2025-03-19 | changed | 7.8 | 3.5 | dirty_vibration|cold_slow -> calm_surface|cold_slow |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| cold_slow_or_front | 1 | DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| dirty_vibration | 1 | DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| medium_confidence_archive | 1 | DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |

- DIRTY_WIND_NOT_ELEVATING_VIBRATION: 1

- fl_okeechobee__2025-03-18__freshwater_lake_pond__dirty__all_purpose__B: DIRTY_WIND_NOT_ELEVATING_VIBRATION. Picks: Squarebill Crankbait (lure); Carolina-Rigged Stick Worm (lure); Clouser Minnow (fly); Unweighted Baitfish Streamer (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 4
- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 4
- ADJACENT_DAY_EXACT_REPEAT: 2

- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Compact Flipping Jig (lure); Baitfish Slider Fly (fly); Articulated Dungeon Streamer (fly)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Glide Bait (lure); Bladed Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Spinnerbait (lure); Glide Bait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Soft Plastic Jerkbait (lure); Carolina-Rigged Stick Worm (lure); Lead-Eye Leech (fly); Baitfish Slider Fly (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Soft Plastic Jerkbait (lure); Carolina-Rigged Stick Worm (lure); Rabbit-Strip Leech (fly); Woolly Bugger (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Carolina-Rigged Stick Worm (lure); Baitfish Slider Fly (fly); Unweighted Baitfish Streamer (fly)

## Temperature/Thermal Diagnostics

### Thermal Modes By Month/Region

| Month | Region | Thermal modes |
| --- | --- | --- |
| Jan | florida | cold_slow:1 |
| Mar | florida | cold_slow:2 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

None.

## Surface/Topwater Diagnostics

### Topwater Selection Summary

| Month | Region | Gate | Light | Goal | Runs | Temp range | Avg wind |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Mar | florida | open | bright | all_purpose | 3 | 59.2-76.4F | 5.9 |
| Mar | florida | open | bright | big_fish | 6 | 59.2-76.4F | 5.9 |

### Shoulder-Season Topwater Selections

| Scenario | Weather | Daily | Topwater picks |
| --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear all_purpose B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+clear_subtle+cold_slow | Popper Fly |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear big_fish A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+clear_subtle+cold_slow | Hollow-Body Frog; Frog Fly; Deer Hair Slider |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear big_fish B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+clear_subtle+cold_slow | Walking Topwater |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained all_purpose B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Popper Fly |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained big_fish A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Walking Topwater |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained big_fish B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Hollow-Body Frog; Frog Fly; Deer Hair Slider |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty all_purpose A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Popper Fly |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty big_fish A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Walking Topwater; Frog Fly |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty big_fish B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Hollow-Body Frog |

## Set B Diagnostics

### Set B Overlap Cause Counts

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

| Kind | Cause | Lure | Fly | Total |
| --- | --- | --- | --- | --- |
| same_family_same_presentation | truly_avoidable | 4 | 0 | 4 |
| same_family_different_presentation | truly_avoidable | 0 | 4 | 4 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 clear big_fish | lure honorable: same_family_same_presentation | Squarebill Crankbait (142); Football Jig (156) | Tube Jig (148); Compact Flipping Jig (132) | Suspending Jerkbait (156, alt edge 24) |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty all_purpose | lure honorable: same_family_same_presentation | Flat-Sided Crankbait (160); Weightless Stick Worm (158) | Blade Bait (154); Carolina-Rigged Stick Worm (152) | Suspending Jerkbait (162, alt edge 10) |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 dirty big_fish | fly honorable: same_family_different_presentation | Rabbit-Strip Leech (150); Articulated Dungeon Streamer (164) | Game Changer (144); Articulated Baitfish Streamer (144) | Baitfish Slider Fly (146, alt edge 2) |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 stained big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (164); Rabbit-Strip Leech (150) | Game Changer (144); Articulated Baitfish Streamer (144) | Baitfish Slider Fly (146, alt edge 2) |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 dirty big_fish | fly top: same_family_different_presentation | Articulated Baitfish Streamer (144); Game Changer (144) | Articulated Dungeon Streamer (152); Rabbit-Strip Leech (150) | Baitfish Slider Fly (150, alt edge -2) |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 stained big_fish | fly top: same_family_different_presentation | Articulated Baitfish Streamer (144); Rabbit-Strip Leech (150) | Articulated Dungeon Streamer (152); Game Changer (144) | Baitfish Slider Fly (150, alt edge -2) |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 dirty big_fish | lure honorable: same_family_same_presentation | Flat-Sided Crankbait (142); Compact Flipping Jig (156) | Suspending Jerkbait (148); Football Jig (156) | Deep-Diving Crankbait (152, alt edge -4) |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 stained big_fish | lure honorable: same_family_same_presentation | Medium-Diving Crankbait (152); Football Jig (156) | Suspending Jerkbait (156); Compact Flipping Jig (156) | Deep-Diving Crankbait (152, alt edge -4) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

None.

### Big-Fish Sides With No Explicit Big-Fish Score Reason

None.

## Big Fish No-Upside Diagnostics

None.

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 dirty all_purpose B | DIRTY_WIND_NOT_ELEVATING_VIBRATION (fly) | Clouser Minnow (146; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Unweighted Baitfish Streamer (150; goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (158, alt edge 8) | goal fit likely competed |

## Wind Warning Split Diagnostics

None.

## Guide Verdict Summary

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | all_purpose | B | fly | cold_slow_or_front | 10 |
| watch | all_purpose | B | fly | medium_confidence_archive | 10 |
| watch | big_fish | B | fly | cold_slow_or_front | 9 |
| watch | big_fish | B | fly | medium_confidence_archive | 9 |
| watch | big_fish | A | fly | cold_slow_or_front | 6 |
| watch | big_fish | A | fly | medium_confidence_archive | 6 |
| watch | big_fish | B | lure | cold_slow_or_front | 4 |
| watch | big_fish | B | lure | medium_confidence_archive | 4 |
| watch | all_purpose | A | lure | cold_slow_or_front | 3 |
| watch | all_purpose | A | lure | medium_confidence_archive | 3 |
| watch | big_fish | B | fly | dirty_vibration | 3 |
| watch | all_purpose | A | fly | cold_slow_or_front | 2 |
| watch | all_purpose | A | fly | medium_confidence_archive | 2 |
| watch | all_purpose | B | fly | dirty_vibration | 2 |
| watch | big_fish | A | fly | dirty_vibration | 2 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 2 |
| watch | all_purpose | A | fly | calm_bright_clear_subtle | 1 |
| watch | all_purpose | A | fly | dirty_vibration | 1 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 1 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 1 |
| watch | big_fish | A | lure | cold_slow_or_front | 1 |
| watch | big_fish | A | lure | medium_confidence_archive | 1 |
| watch | big_fish | B | fly | calm_bright_clear_subtle | 1 |
| watch | big_fish | B | lure | dirty_vibration | 1 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 10 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 10 |
| acceptable_fit | big_fish | A | fly | cold_slow_or_front | 6 |
| acceptable_fit | big_fish | A | fly | medium_confidence_archive | 6 |
| acceptable_fit | big_fish | A | lure | cold_slow_or_front | 6 |
| acceptable_fit | big_fish | A | lure | medium_confidence_archive | 6 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 6 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 6 |
| acceptable_fit | all_purpose | B | fly | cold_slow_or_front | 3 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 3 |
| acceptable_fit | big_fish | A | fly | calm_bright_clear_subtle | 2 |
| acceptable_fit | big_fish | B | lure | dirty_vibration | 2 |
| acceptable_fit | all_purpose | A | fly | cold_slow_or_front | 1 |
| acceptable_fit | all_purpose | A | fly | medium_confidence_archive | 1 |
| acceptable_fit | all_purpose | A | lure | cold_slow_or_front | 1 |
| acceptable_fit | all_purpose | A | lure | dirty_vibration | 1 |
| acceptable_fit | all_purpose | A | lure | medium_confidence_archive | 1 |
| acceptable_fit | all_purpose | B | fly | calm_bright_clear_subtle | 1 |
| acceptable_fit | all_purpose | B | fly | dirty_vibration | 1 |
| acceptable_fit | all_purpose | B | lure | cold_slow_or_front | 1 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 1 |
| acceptable_fit | big_fish | A | fly | dirty_vibration | 1 |
| acceptable_fit | big_fish | A | lure | breezy_windy_stained_reaction | 1 |
| acceptable_fit | big_fish | A | lure | calm_bright_clear_subtle | 1 |
| acceptable_fit | big_fish | A | lure | dirty_vibration | 1 |
| acceptable_fit | big_fish | B | lure | breezy_windy_stained_reaction | 1 |
| acceptable_fit | big_fish | B | lure | calm_bright_clear_subtle | 1 |
| strong_fit | all_purpose | B | lure | cold_slow_or_front | 17 |
| strong_fit | all_purpose | B | lure | medium_confidence_archive | 17 |
| strong_fit | all_purpose | A | fly | cold_slow_or_front | 15 |
| strong_fit | all_purpose | A | fly | medium_confidence_archive | 15 |
| strong_fit | all_purpose | A | lure | cold_slow_or_front | 14 |
| strong_fit | all_purpose | A | lure | medium_confidence_archive | 14 |
| strong_fit | big_fish | A | lure | cold_slow_or_front | 11 |
| strong_fit | big_fish | A | lure | medium_confidence_archive | 11 |
| strong_fit | big_fish | A | fly | cold_slow_or_front | 6 |
| strong_fit | big_fish | A | fly | medium_confidence_archive | 6 |
| strong_fit | all_purpose | B | fly | cold_slow_or_front | 5 |
| strong_fit | all_purpose | B | fly | medium_confidence_archive | 5 |
| strong_fit | all_purpose | B | lure | dirty_vibration | 4 |
| strong_fit | big_fish | B | lure | cold_slow_or_front | 4 |
| strong_fit | big_fish | B | lure | medium_confidence_archive | 4 |
| strong_fit | all_purpose | A | fly | dirty_vibration | 3 |
| strong_fit | all_purpose | A | lure | dirty_vibration | 3 |
| strong_fit | big_fish | A | lure | dirty_vibration | 3 |
| strong_fit | big_fish | B | fly | cold_slow_or_front | 3 |
| strong_fit | big_fish | B | fly | medium_confidence_archive | 3 |
| strong_fit | all_purpose | A | fly | breezy_windy_stained_reaction | 2 |
| strong_fit | all_purpose | A | lure | breezy_windy_stained_reaction | 2 |
| strong_fit | all_purpose | A | lure | calm_bright_clear_subtle | 2 |
| strong_fit | all_purpose | B | lure | breezy_windy_stained_reaction | 2 |
| strong_fit | all_purpose | B | lure | calm_bright_clear_subtle | 2 |
| strong_fit | all_purpose | A | fly | calm_bright_clear_subtle | 1 |
| strong_fit | all_purpose | B | fly | breezy_windy_stained_reaction | 1 |
| strong_fit | all_purpose | B | fly | calm_bright_clear_subtle | 1 |
| strong_fit | all_purpose | B | fly | dirty_vibration | 1 |

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
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear all_purpose A | Soft Plastic Jerkbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+clear_subtle+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 stained all_purpose B | Suspending Jerkbait (lure_of_the_day, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 dirty all_purpose B | Suspending Jerkbait (lure_of_the_day, lure, score 178) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear all_purpose B | Unweighted Baitfish Streamer (honorable_fly, fly, score 174) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>calm_surface+clear_subtle+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 dirty all_purpose A | Baitfish Slider Fly (honorable_fly, fly, score 162) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 stained all_purpose A | Baitfish Slider Fly (fly_of_the_day, fly, score 162) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 clear all_purpose A | Soft Plastic Jerkbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>clear_subtle+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 clear all_purpose A | Suspending Jerkbait (lure_of_the_day, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 clear all_purpose B | Unweighted Baitfish Streamer (fly_of_the_day, fly, score 174) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>clear_subtle+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 dirty all_purpose B | Squarebill Crankbait (lure_of_the_day, lure, score 174) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 clear all_purpose A | Jighead Marabou Leech (fly_of_the_day, fly, score 158) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 dirty big_fish A | Rabbit-Strip Leech (fly_of_the_day, fly, score 150) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 stained big_fish A | Rabbit-Strip Leech (honorable_fly, fly, score 150) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty big_fish B | Rabbit-Strip Leech (honorable_fly, fly, score 150) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>calm_surface+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained big_fish A | Rabbit-Strip Leech (fly_of_the_day, fly, score 150) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty all_purpose A | Rabbit-Strip Leech (honorable_fly, fly, score 148) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 clear big_fish A | Rabbit-Strip Leech (honorable_fly, fly, score 142) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 clear big_fish A | Rabbit-Strip Leech (honorable_fly, fly, score 142) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>clear_subtle+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 dirty all_purpose A | Lead-Eye Leech (fly_of_the_day, fly, score 142) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 48 | 13 | 27% |
| clear_subtle | 32 | 18 | 56% |
| dirty_vibration | 64 | 12 | 19% |
| heat_finesse | 0 | 0 |  |
| cold_slow | 144 | 63 | 44% |
| low_light_surface | 0 | 0 |  |
| calm_surface | 48 | 14 | 29% |
| Big Fish upside | 72 | 61 | 85% |
| All Purpose reliable/versatile | 72 | 70 | 97% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Rabbit-Strip Leech [fly] (14), Baitfish Slider Fly [fly] (9), Articulated Dungeon Streamer [fly] (8), Carolina-Rigged Stick Worm [lure] (8), Game Changer [fly] (7), Compact Flipping Jig [lure] (6), Glide Bait [lure] (6), Magnum Jerkbait [lure] (6), Suspending Jerkbait [lure] (6), Tube Jig [lure] (6), Unweighted Baitfish Streamer [fly] (6), Woolly Bugger [fly] (6) |
| All-purpose | Baitfish Slider Fly [fly] (8), Carolina-Rigged Stick Worm [lure] (8), Woolly Bugger [fly] (6), Rabbit-Strip Leech [fly] (5), Tube Jig [lure] (5), Unweighted Baitfish Streamer [fly] (5), Clouser Minnow [fly] (4), Soft Plastic Jerkbait [lure] (4) |
| Big-fish | Rabbit-Strip Leech [fly] (9), Articulated Dungeon Streamer [fly] (8), Game Changer [fly] (7), Compact Flipping Jig [lure] (6), Glide Bait [lure] (6), Magnum Jerkbait [lure] (6), Articulated Baitfish Streamer [fly] (5), Football Jig [lure] (3) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 26 | 19 | 7 | 0 | 0 |
| fly | 15 | 14 | 1 | 0 | 0 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 14/36 | 38.9% | big_fish:9, all_purpose:5 | A:11, B:3 | honorable:9, top:5 | stained:6, dirty:5, clear:3 | freshwater_lake_pond:14 | cold_slow:14, dirty_vibration:7, calm_surface:5, wind_reaction:5 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9/36 | 25% | all_purpose:8, big_fish:1 | B:5, A:4 | honorable:5, top:4 | clear:3, dirty:3, stained:3 | freshwater_lake_pond:9 | cold_slow:9, dirty_vibration:4, calm_surface:3, wind_reaction:3 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8/36 | 22.2% | big_fish:8 | B:6, A:2 | top:6, honorable:2 | clear:3, dirty:3, stained:2 | freshwater_lake_pond:8 | cold_slow:8, dirty_vibration:4, wind_reaction:3, calm_surface:2 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8/36 | 22.2% | all_purpose:8 | B:5, A:3 | honorable:7, top:1 | clear:3, stained:3, dirty:2 | freshwater_lake_pond:8 | cold_slow:8, calm_surface:3, dirty_vibration:3, clear_subtle:2 |
| Game Changer<br>game_changer | fly | 7/36 | 19.4% | big_fish:7 | A:4, B:3 | top:4, honorable:3 | dirty:3, clear:2, stained:2 | freshwater_lake_pond:7 | cold_slow:7, dirty_vibration:4, wind_reaction:3, calm_surface:1 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 6/36 | 16.7% | big_fish:6 | A:3, B:3 | honorable:4, top:2 | clear:2, dirty:2, stained:2 | freshwater_lake_pond:6 | cold_slow:6, dirty_vibration:4, wind_reaction:3, clear_subtle:1 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 6/36 | 16.7% | all_purpose:4, big_fish:2 | B:5, A:1 | top:5, honorable:1 | clear:2, dirty:2, stained:2 | freshwater_lake_pond:6 | cold_slow:6, wind_reaction:5, dirty_vibration:4, calm_surface:1 |
| Tube Jig<br>tube_jig | lure | 6/36 | 16.7% | all_purpose:5, big_fish:1 | B:4, A:2 | honorable:3, top:3 | clear:4, stained:2 | freshwater_lake_pond:6 | cold_slow:6, wind_reaction:3, calm_surface:2, clear_subtle:2 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 6/36 | 16.7% | all_purpose:5, big_fish:1 | B:6 | honorable:5, top:1 | clear:3, dirty:2, stained:1 | freshwater_lake_pond:6 | cold_slow:6, clear_subtle:3, calm_surface:2, dirty_vibration:2 |
| Woolly Bugger<br>woolly_bugger | fly | 6/36 | 16.7% | all_purpose:6 | A:4, B:2 | honorable:6 | stained:3, clear:2, dirty:1 | freshwater_lake_pond:6 | cold_slow:6, dirty_vibration:3, wind_reaction:3, calm_surface:1 |
| Glide Bait<br>glidebait | lure | 6/24 | 25% | big_fish:6 | B:4, A:2 | honorable:4, top:2 | clear:2, dirty:2, stained:2 | freshwater_lake_pond:6 | cold_slow:6, calm_surface:3, clear_subtle:2, dirty_vibration:2 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 6/24 | 25% | big_fish:6 | A:5, B:1 | honorable:3, top:3 | clear:2, dirty:2, stained:2 | freshwater_lake_pond:6 | cold_slow:6, calm_surface:3, clear_subtle:2, dirty_vibration:2 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 5/36 | 13.9% | big_fish:5 | A:3, B:2 | honorable:3, top:2 | stained:3, dirty:2 | freshwater_lake_pond:5 | cold_slow:5, dirty_vibration:4, wind_reaction:2, calm_surface:1 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 5/36 | 13.9% | all_purpose:3, big_fish:2 | B:3, A:2 | top:5 | clear:2, dirty:2, stained:1 | freshwater_lake_pond:5 | cold_slow:5, calm_surface:2, clear_subtle:2, dirty_vibration:1 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 5/36 | 13.9% | all_purpose:4, big_fish:1 | A:4, B:1 | top:3, honorable:2 | dirty:2, stained:2, clear:1 | freshwater_lake_pond:5 | cold_slow:5, dirty_vibration:4, wind_reaction:3 |
| Clouser Minnow<br>clouser_minnow | fly | 4/36 | 11.1% | all_purpose:4 | B:4 | top:3, honorable:1 | dirty:2, clear:1, stained:1 | freshwater_lake_pond:4 | cold_slow:4, dirty_vibration:3, wind_reaction:3 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 4/36 | 11.1% | all_purpose:4 | A:4 | top:4 | clear:2, stained:2 | freshwater_lake_pond:4 | cold_slow:4, calm_surface:2, clear_subtle:2, dirty_vibration:1 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 3/36 | 8.3% | all_purpose:3 | A:3 | top:3 | clear:2, dirty:1 | freshwater_lake_pond:3 | cold_slow:3, clear_subtle:2, calm_surface:1, dirty_vibration:1 |
| Football Jig<br>football_jig | lure | 3/12 | 25% | big_fish:3 | A:2, B:1 | honorable:3 | clear:1, dirty:1, stained:1 | freshwater_lake_pond:3 | cold_slow:3, wind_reaction:3, dirty_vibration:2 |
| Frog Fly<br>frog_fly | fly | 3/12 | 25% | big_fish:3 | A:2, B:1 | top:3 | clear:1, dirty:1, stained:1 | freshwater_lake_pond:3 | calm_surface:3, cold_slow:3, clear_subtle:1 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 3/12 | 25% | big_fish:3 | B:2, A:1 | top:2, honorable:1 | clear:1, dirty:1, stained:1 | freshwater_lake_pond:3 | calm_surface:3, cold_slow:3, clear_subtle:1 |
| Popper Fly<br>popper_fly | fly | 3/12 | 25% | all_purpose:3 | B:2, A:1 | top:3 | clear:1, dirty:1, stained:1 | freshwater_lake_pond:3 | calm_surface:3, cold_slow:3, clear_subtle:1 |
| Walking Topwater<br>walking_topwater | lure | 3/12 | 25% | big_fish:3 | A:2, B:1 | honorable:2, top:1 | clear:1, dirty:1, stained:1 | freshwater_lake_pond:3 | calm_surface:3, cold_slow:3, clear_subtle:1 |
| Blade Bait<br>blade_bait | lure | 2/36 | 5.6% | all_purpose:2 | A:1, B:1 | honorable:1, top:1 | dirty:2 | freshwater_lake_pond:2 | cold_slow:2, calm_surface:1, dirty_vibration:1 |
| Bladed Jig<br>bladed_jig | lure | 2/36 | 5.6% | all_purpose:1, big_fish:1 | B:2 | honorable:2 | stained:2 | freshwater_lake_pond:2 | cold_slow:2, dirty_vibration:2 |
| Spinnerbait<br>spinnerbait | lure | 2/36 | 5.6% | all_purpose:1, big_fish:1 | A:1, B:1 | top:2 | dirty:2 | freshwater_lake_pond:2 | cold_slow:2, dirty_vibration:2 |
| Deer Hair Slider<br>deer_hair_slider | fly | 2/12 | 16.7% | big_fish:2 | A:1, B:1 | honorable:2 | clear:1, stained:1 | freshwater_lake_pond:2 | calm_surface:2, cold_slow:2, clear_subtle:1 |
| Ned Rig<br>ned_rig | lure | 2/12 | 16.7% | all_purpose:2 | B:2 | honorable:1, top:1 | clear:1, dirty:1 | freshwater_lake_pond:2 | cold_slow:2, wind_reaction:2, dirty_vibration:1 |
| Deceiver<br>deceiver | fly | 1/36 | 2.8% | all_purpose:1 | B:1 | top:1 | clear:1 | freshwater_lake_pond:1 | cold_slow:1, wind_reaction:1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 1/36 | 2.8% | all_purpose:1 | A:1 | honorable:1 | dirty:1 | freshwater_lake_pond:1 | cold_slow:1, dirty_vibration:1, wind_reaction:1 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 1/36 | 2.8% | all_purpose:1 | A:1 | top:1 | clear:1 | freshwater_lake_pond:1 | cold_slow:1, wind_reaction:1 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 1/36 | 2.8% | big_fish:1 | A:1 | top:1 | stained:1 | freshwater_lake_pond:1 | cold_slow:1, dirty_vibration:1, wind_reaction:1 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 1/36 | 2.8% | all_purpose:1 | A:1 | honorable:1 | dirty:1 | freshwater_lake_pond:1 | calm_surface:1, cold_slow:1 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 0/36 | 0% |  |  |  |  |  |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 0/36 | 0% |  |  |  |  |  |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 0/36 | 0% |  |  |  |  |  |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 0/36 | 0% |  |  |  |  |  |  |
| Swim Jig<br>swim_jig | lure | 0/36 | 0% |  |  |  |  |  |  |
| Buzzbait<br>buzzbait | lure | 0/12 | 0% |  |  |  |  |  |  |
| Finesse Jig<br>finesse_jig | lure | 0/12 | 0% |  |  |  |  |  |  |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 0/12 | 0% |  |  |  |  |  |  |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 14/144 (9.7%) | 5/72 (6.9%) | 9/72 (12.5%) | - | 14/72 (19.4%) |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9/144 (6.3%) | 4/72 (5.6%) | 5/72 (6.9%) | - | 9/72 (12.5%) |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8/144 (5.6%) | 6/72 (8.3%) | 2/72 (2.8%) | - | 8/72 (11.1%) |  |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8/144 (5.6%) | 1/72 (1.4%) | 7/72 (9.7%) | 8/72 (11.1%) | - |  |
| Game Changer<br>game_changer | fly | 7/144 (4.9%) | 4/72 (5.6%) | 3/72 (4.2%) | - | 7/72 (9.7%) |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 6/144 (4.2%) | 1/72 (1.4%) | 5/72 (6.9%) | - | 6/72 (8.3%) |  |
| Woolly Bugger<br>woolly_bugger | fly | 6/144 (4.2%) | 0/72 (0%) | 6/72 (8.3%) | - | 6/72 (8.3%) |  |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 6/144 (4.2%) | 2/72 (2.8%) | 4/72 (5.6%) | 6/72 (8.3%) | - |  |
| Glide Bait<br>glidebait | lure | 6/144 (4.2%) | 2/72 (2.8%) | 4/72 (5.6%) | 6/72 (8.3%) | - |  |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 6/144 (4.2%) | 3/72 (4.2%) | 3/72 (4.2%) | 6/72 (8.3%) | - |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 6/144 (4.2%) | 5/72 (6.9%) | 1/72 (1.4%) | 6/72 (8.3%) | - |  |
| Tube Jig<br>tube_jig | lure | 6/144 (4.2%) | 3/72 (4.2%) | 3/72 (4.2%) | 6/72 (8.3%) | - |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 5/144 (3.5%) | 2/72 (2.8%) | 3/72 (4.2%) | - | 5/72 (6.9%) |  |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 5/144 (3.5%) | 5/72 (6.9%) | 0/72 (0%) | 5/72 (6.9%) | - |  |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 5/144 (3.5%) | 3/72 (4.2%) | 2/72 (2.8%) | 5/72 (6.9%) | - |  |
| Clouser Minnow<br>clouser_minnow | fly | 4/144 (2.8%) | 3/72 (4.2%) | 1/72 (1.4%) | - | 4/72 (5.6%) |  |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 4/144 (2.8%) | 4/72 (5.6%) | 0/72 (0%) | 4/72 (5.6%) | - |  |
| Frog Fly<br>frog_fly | fly | 3/144 (2.1%) | 3/72 (4.2%) | 0/72 (0%) | - | 3/72 (4.2%) |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 3/144 (2.1%) | 3/72 (4.2%) | 0/72 (0%) | - | 3/72 (4.2%) |  |
| Popper Fly<br>popper_fly | fly | 3/144 (2.1%) | 3/72 (4.2%) | 0/72 (0%) | - | 3/72 (4.2%) |  |
| Football Jig<br>football_jig | lure | 3/144 (2.1%) | 0/72 (0%) | 3/72 (4.2%) | 3/72 (4.2%) | - |  |
| Hollow-Body Frog<br>hollow_body_frog | lure | 3/144 (2.1%) | 2/72 (2.8%) | 1/72 (1.4%) | 3/72 (4.2%) | - |  |
| Walking Topwater<br>walking_topwater | lure | 3/144 (2.1%) | 1/72 (1.4%) | 2/72 (2.8%) | 3/72 (4.2%) | - |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 2/144 (1.4%) | 0/72 (0%) | 2/72 (2.8%) | - | 2/72 (2.8%) |  |
| Blade Bait<br>blade_bait | lure | 2/144 (1.4%) | 1/72 (1.4%) | 1/72 (1.4%) | 2/72 (2.8%) | - |  |
| Bladed Jig<br>bladed_jig | lure | 2/144 (1.4%) | 0/72 (0%) | 2/72 (2.8%) | 2/72 (2.8%) | - |  |
| Ned Rig<br>ned_rig | lure | 2/144 (1.4%) | 1/72 (1.4%) | 1/72 (1.4%) | 2/72 (2.8%) | - |  |
| Spinnerbait<br>spinnerbait | lure | 2/144 (1.4%) | 2/72 (2.8%) | 0/72 (0%) | 2/72 (2.8%) | - |  |
| Deceiver<br>deceiver | fly | 1/144 (0.7%) | 1/72 (1.4%) | 0/72 (0%) | - | 1/72 (1.4%) |  |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 1/144 (0.7%) | 1/72 (1.4%) | 0/72 (0%) | - | 1/72 (1.4%) |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 1/144 (0.7%) | 0/72 (0%) | 1/72 (1.4%) | 1/72 (1.4%) | - |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 1/144 (0.7%) | 1/72 (1.4%) | 0/72 (0%) | 1/72 (1.4%) | - |  |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 1/144 (0.7%) | 0/72 (0%) | 1/72 (1.4%) | 1/72 (1.4%) | - |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | - | 0/72 (0%) |  |
| Buzzbait<br>buzzbait | lure | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | 0/72 (0%) | - |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | 0/72 (0%) | - |  |
| Finesse Jig<br>finesse_jig | lure | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | 0/72 (0%) | - |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | 0/72 (0%) | - |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | 0/72 (0%) | - |  |
| Swim Jig<br>swim_jig | lure | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | 0/72 (0%) | - |  |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | 0/72 (0%) | - |  |

## Zero-Selected Eligible Profiles

| Profile | Gear | Candidate opportunities | Top available contexts | Top competing winners |
| --- | --- | --- | --- | --- |
| Feather Jig Leech<br>feather_jig_leech | fly | 36 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:4, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:4, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:4 | Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):4, Baitfish Slider Fly (top), Unweighted Baitfish Streamer (honorable):2, Clouser Minnow (top), Woolly Bugger (honorable):2, Frog Fly (top), Deer Hair Slider (honorable):2 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 36 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:4, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:4, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:4 | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):3, Compact Flipping Jig (top), Magnum Jerkbait (honorable):2, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):2, Flat-Sided Crankbait (top), Tube Jig (honorable):2 |
| Lipless Crankbait<br>lipless_crankbait | lure | 36 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:4, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:4, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:4 | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):3, Compact Flipping Jig (top), Magnum Jerkbait (honorable):2, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):2, Flat-Sided Crankbait (top), Tube Jig (honorable):2 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 36 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:4, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:4, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:4 | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):3, Compact Flipping Jig (top), Magnum Jerkbait (honorable):2, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):2, Flat-Sided Crankbait (top), Tube Jig (honorable):2 |
| Swim Jig<br>swim_jig | lure | 36 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:4, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:4, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:4 | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):3, Compact Flipping Jig (top), Magnum Jerkbait (honorable):2, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):2, Flat-Sided Crankbait (top), Tube Jig (honorable):2 |
| Buzzbait<br>buzzbait | lure | 12 | all_purpose / clear / freshwater_lake_pond / calm_bright_clear_subtle:2, all_purpose / dirty / freshwater_lake_pond / cold_slow_or_front:2, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:2, big_fish / clear / freshwater_lake_pond / calm_bright_clear_subtle:2 | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):2, Blade Bait (top), Carolina-Rigged Stick Worm (honorable):1, Flat-Sided Crankbait (top), Tube Jig (honorable):1, Flat-Sided Crankbait (top), Weightless Stick Worm (honorable):1 |
| Finesse Jig<br>finesse_jig | lure | 12 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:2, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:2, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:2, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:2 | Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):1, Medium-Diving Crankbait (top), Football Jig (honorable):1, Ned Rig (top), Carolina-Rigged Stick Worm (honorable):1, Squarebill Crankbait (top), Deep-Diving Crankbait (honorable):1 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 12 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:2, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:2, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:2, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:2 | Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):1, Medium-Diving Crankbait (top), Football Jig (honorable):1, Ned Rig (top), Carolina-Rigged Stick Worm (honorable):1, Squarebill Crankbait (top), Deep-Diving Crankbait (honorable):1 |

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

None.

## Overdominance Guardrail Summary

None.

## Slot Utilization Guardrails

None.

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.59.
Average expanded finalist pool size: 3.93.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 43.
Rows/slots with expanded finalist pool size 1: 12.
Selected-tier singleton slots expanded above 1: 31.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 1.83 | 3.92 | 1 | 1 | 16 | 3 |
| fly/top | 2.53 | 3.56 | 1 | 1 | 13 | 3 |
| lure/honorable | 2.92 | 4.00 | 1 | 1 | 8 | 2 |
| lure/top | 3.08 | 4.25 | 1 | 1 | 6 | 4 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 110 |
| goal_or_priority_condition | 32 |
| credible_fallback | 2 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_and_priority_condition | 110 |
| goal_or_priority_condition | 94 |
| credible_fallback | 11 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 7 |
| family_diversity_scarcity | 5 |

Representative expanded singleton finalist pools:
- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__all_purpose__B fly/top: unweighted_baitfish_streamer (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B lure/top: flat_sided_crankbait (goal_or_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B lure/honorable: suspending_jerkbait (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B fly/honorable: unweighted_baitfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__dirty__all_purpose__B lure/top: squarebill_crankbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__dirty__big_fish__B fly/top: baitfish_slider_fly (credible_fallback; hard_gated_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__all_purpose__B fly/honorable: unweighted_baitfish_streamer (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__big_fish__B lure/honorable: glidebait (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__big_fish__B fly/honorable: unweighted_baitfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__all_purpose__B fly/top: popper_fly (goal_and_priority_condition; hard_gated_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 5.53 |
| Different-presentation close candidates | 2.07 |
| Different-family close candidates | 2.68 |
| Final expanded Set B pool | 2.46 |
| Same-family/same-presentation reintroduced | 9/72 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 16 |
| Coverage pool used | 5 |
| Average used coverage pool size | 3.20 |
| Singleton used coverage pools | 0 |
| Broad pool larger than narrowed pool | 2 |
| Broad pool same as narrowed pool | 3 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 0 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 11 |
| broad | 5 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| spinnerbait | 4 |
| bladed_jig | 3 |
| squarebill_crankbait | 3 |
| compact_flipping_jig | 2 |
| suspending_jerkbait | 2 |
| lipless_crankbait | 1 |
| medium_diving_crankbait | 1 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| bladed_jig | 2 |
| squarebill_crankbait | 2 |
| compact_flipping_jig | 1 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

None.

## Surface Safety Expansion Check

| Surface gate | Slots checked | Surface finalist IDs |
| --- | --- | --- |
| closed | 96 | 0 |
| caution | 0 | 0 |

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_slider | baitfish_slider | upper<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Frog Fly<br>frog_fly | fly | largemouth_bass, northern_pike | fly_frog | surface_fly_frog_mouse | surface<br>slow/medium | 1: surface_prey | 3: clear, stained, dirty | 3: calm_surface, low_light_surface, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 9 |
| Buzzbait<br>buzzbait | lure | largemouth_bass, smallmouth_bass, northern_pike | surface_buzz | topwater_open | surface<br>fast/medium | 2: surface_prey, baitfish | 2: stained, dirty | 3: low_light_surface, wind_reaction, dirty_vibration | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 9 |
| Glide Bait<br>glidebait | lure | largemouth_bass, smallmouth_bass | hard_swimbait | glidebait | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: clear, stained | 3: clear_subtle, open_water_search, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | false | 9 |
| Hollow-Body Frog<br>hollow_body_frog | lure | largemouth_bass, northern_pike | surface_frog | topwater_frog | surface<br>slow/medium | 1: surface_prey | 3: clear, stained, dirty | 3: calm_surface, low_light_surface, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 9 |
| Ned Rig<br>ned_rig | lure | largemouth_bass, smallmouth_bass, trout | finesse_plastic | ned_tube_finesse | bottom<br>slow | 2: leech_worm, crawfish | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | largemouth_bass, smallmouth_bass | soft_plastic_craw | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 4: cover_ambush, cold_slow, clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Deer Hair Slider<br>deer_hair_slider | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_slider | surface_fly_slider | surface<br>medium/fast | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | true | 8 |
| Popper Fly<br>popper_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_popper | surface_fly_popper_slider | surface<br>medium/slow | 2: surface_prey, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 8 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | bottom<br>slow | 2: leech_worm, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 2: reliable_action, versatile_search | freshwater_lake_pond | false | 8 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_deep | crankbait | bottom<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 2: open_water_search, cold_slow | 1: versatile_search | freshwater_lake_pond | false | 8 |
| Finesse Jig<br>finesse_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 2: crawfish, leech_worm | 2: clear, stained | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | largemouth_bass, smallmouth_bass | crankbait_medium | crankbait | mid<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 0: none | freshwater_lake_pond, freshwater_river | false | 8 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | largemouth_bass, smallmouth_bass, northern_pike | swimbait | swimbait | mid<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_shallow | crankbait | upper<br>medium/fast | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: cover_ambush, dirty_vibration, wind_reaction | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | largemouth_bass, smallmouth_bass, trout | jerkbait | jerkbait | mid<br>medium | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, wind_reaction | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Walking Topwater<br>walking_topwater | lure | largemouth_bass, smallmouth_bass, northern_pike | surface_walking | topwater_open | surface<br>medium | 2: surface_prey, baitfish | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 8 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | upper<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: clear_subtle, heat_finesse | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Clouser Minnow<br>clouser_minnow | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_weighted | baitfish_streamer | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: current_swing, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Deceiver<br>deceiver | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_baitfish | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Feather Jig Leech<br>feather_jig_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: warming_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, clear_subtle | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 2: stained, dirty | 2: cold_slow, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_unweighted | baitfish_streamer | upper<br>medium/slow | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Woolly Bugger<br>woolly_bugger | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | bugger_streamer | leech_bugger | mid<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Blade Bait<br>blade_bait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | blade_bait | blade_spoon | bottom<br>slow/medium | 1: baitfish | 3: clear, stained, dirty | 2: cold_slow, open_water_search | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | largemouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 2: crawfish, bluegill_perch | 2: stained, dirty | 2: cover_ambush, dirty_vibration | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | largemouth_bass, smallmouth_bass | soft_plastic_minnow | drop_shot_minnow | mid<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Football Jig<br>football_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 2: cold_slow, cover_ambush | 1: big_fish_upside | freshwater_lake_pond | false | 7 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | largemouth_bass, smallmouth_bass | jerkbait | jerkbait | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, open_water_search | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | jerkbait_soft | jerkbait | upper<br>medium/slow | 1: baitfish | 2: clear, stained | 2: clear_subtle, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Spinnerbait<br>spinnerbait | lure | largemouth_bass, smallmouth_bass, northern_pike | safety_pin_spinner | spinner_vibration | mid<br>medium/slow | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: wind_reaction, dirty_vibration, cover_ambush | 0: none | freshwater_lake_pond, freshwater_river | false | 7 |
| Swim Jig<br>swim_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_swimming | swim_jig | mid<br>medium/fast | 2: bluegill_perch, baitfish | 2: stained, dirty | 2: cover_ambush, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Tube Jig<br>tube_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | tube_jig | ned_tube_finesse | bottom<br>slow/medium | 2: crawfish, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_shallow | crankbait | upper<br>medium | 1: baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 6 |
| Bladed Jig<br>bladed_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | bladed_jig | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: dirty_vibration, cover_ambush | 0: none | freshwater_lake_pond, freshwater_river | false | 5 |
| Lipless Crankbait<br>lipless_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_lipless | crankbait | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: wind_reaction, open_water_search | 0: none | freshwater_lake_pond, freshwater_river | false | 5 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 5/36 | 0/0 | goal_tags>1<br>versatile_search+big_fish_upside |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 8/36 | 0/0 | goal_tags>1 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 9/36 | 0/0 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 4/36 | 0/0 | goal_tags>1 |
| Deceiver<br>deceiver | fly | 7 | 1/36 | 0/0 | clear+stained+dirty clarity |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 2/12 | 0/0 | clear+stained+dirty clarity |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 0/36 | 0/0 | clear+stained+dirty clarity |
| Frog Fly<br>frog_fly | fly | 9 | 3/12 | 0/0 | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>broad per-slot share>20% |
| Game Changer<br>game_changer | fly | 7 | 7/36 | 0/0 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 1/36 | 0/0 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 3/36 | 0/0 | clear+stained+dirty clarity |
| Popper Fly<br>popper_fly | fly | 8 | 3/12 | 0/0 | goal_tags>1<br>broad per-slot share>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 14/36 | 14/36 | goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 6/36 | 6/36 | clear+stained+dirty clarity |
| Blade Bait<br>blade_bait | lure | 7 | 2/36 | 0/0 | clear+stained+dirty clarity |
| Buzzbait<br>buzzbait | lure | 9 | 0/12 | 0/0 | goal_tags>1<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 8/36 | 6/24 | goal_tags>1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 1/36 | 1/16 | clear+stained+dirty clarity |
| Football Jig<br>football_jig | lure | 7 | 3/12 | 1/4 | clear+stained+dirty clarity<br>broad per-slot share>20% |
| Glide Bait<br>glidebait | lure | 9 | 6/24 | 0/0 | goal_tags>1 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 9 | 3/12 | 0/0 | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8 | 1/36 | 1/16 | clear+stained+dirty clarity |
| Ned Rig<br>ned_rig | lure | 9 | 2/12 | 1/8 | clear+stained+dirty clarity |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 0/36 | 0/0 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 4/36 | 2/8 | goal_tags>1 |
| Spinnerbait<br>spinnerbait | lure | 7 | 2/36 | 2/16 | wind+dirty+stained/dirty clarity |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 5/36 | 4/16 | wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 6/36 | 4/24 | goal_tags>1 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 0/12 | 0/4 | condition_tags>3<br>clear+stained+dirty clarity |
| Walking Topwater<br>walking_topwater | lure | 8 | 3/12 | 0/0 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 1/36 | 0/8 | clear+stained+dirty clarity<br>goal_tags>1 |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 14/36 (38.9%) | 14/36 (38.9%) | big_fish:9, all_purpose:5 | honorable:9, top:5 | cold_slow:14, dirty_vibration:7, calm_surface:5, wind_reaction:5, clear_subtle:2 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 9/36 (25%) | 0/0 | all_purpose:8, big_fish:1 | honorable:5, top:4 | cold_slow:9, dirty_vibration:4, calm_surface:3, wind_reaction:3, clear_subtle:2 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 8/36 (22.2%) | 0/0 | big_fish:8 | top:6, honorable:2 | cold_slow:8, dirty_vibration:4, wind_reaction:3, calm_surface:2, clear_subtle:2 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 8/36 (22.2%) | 6/24 (25%) | all_purpose:8 | honorable:7, top:1 | cold_slow:8, calm_surface:3, dirty_vibration:3, clear_subtle:2, wind_reaction:2 |
| Game Changer<br>game_changer | fly | 7 | 7/36 (19.4%) | 0/0 | big_fish:7 | top:4, honorable:3 | cold_slow:7, dirty_vibration:4, wind_reaction:3, calm_surface:1, clear_subtle:1 |
| Glide Bait<br>glidebait | lure | 9 | 6/24 (25%) | 0/0 | big_fish:6 | honorable:4, top:2 | cold_slow:6, calm_surface:3, clear_subtle:2, dirty_vibration:2 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 6/36 (16.7%) | 4/24 (16.7%) | all_purpose:4, big_fish:2 | top:5, honorable:1 | cold_slow:6, wind_reaction:5, dirty_vibration:4, calm_surface:1, clear_subtle:1 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 7 | 6/36 (16.7%) | 1/4 (25%) | big_fish:6 | honorable:4, top:2 | cold_slow:6, dirty_vibration:4, wind_reaction:3, clear_subtle:1 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 7 | 6/24 (25%) | 0/0 | big_fish:6 | honorable:3, top:3 | cold_slow:6, calm_surface:3, clear_subtle:2, dirty_vibration:2 |
| Tube Jig<br>tube_jig | lure | 7 | 6/36 (16.7%) | 0/0 | all_purpose:5, big_fish:1 | honorable:3, top:3 | cold_slow:6, wind_reaction:3, calm_surface:2, clear_subtle:2, dirty_vibration:1 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 7 | 6/36 (16.7%) | 0/0 | all_purpose:5, big_fish:1 | honorable:5, top:1 | cold_slow:6, clear_subtle:3, calm_surface:2, dirty_vibration:2 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 6/36 (16.7%) | 6/36 (16.7%) | all_purpose:6 | honorable:6 | cold_slow:6, dirty_vibration:3, wind_reaction:3, calm_surface:1, clear_subtle:1 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 5/36 (13.9%) | 4/16 (25%) | all_purpose:4, big_fish:1 | top:3, honorable:2 | cold_slow:5, dirty_vibration:4, wind_reaction:3 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 5/36 (13.9%) | 0/0 | big_fish:5 | honorable:3, top:2 | cold_slow:5, dirty_vibration:4, wind_reaction:2, calm_surface:1 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 6 | 5/36 (13.9%) | 1/16 (6.3%) | all_purpose:3, big_fish:2 | top:5 | cold_slow:5, calm_surface:2, clear_subtle:2, dirty_vibration:1, wind_reaction:1 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 4/36 (11.1%) | 0/0 | all_purpose:4 | top:3, honorable:1 | cold_slow:4, dirty_vibration:3, wind_reaction:3 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 4/36 (11.1%) | 2/8 (25%) | all_purpose:4 | top:4 | cold_slow:4, calm_surface:2, clear_subtle:2, dirty_vibration:1 |
| Frog Fly<br>frog_fly | fly | 9 | 3/12 (25%) | 0/0 | big_fish:3 | top:3 | calm_surface:3, cold_slow:3, clear_subtle:1 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 9 | 3/12 (25%) | 0/0 | big_fish:3 | top:2, honorable:1 | calm_surface:3, cold_slow:3, clear_subtle:1 |
| Popper Fly<br>popper_fly | fly | 8 | 3/12 (25%) | 0/0 | all_purpose:3 | top:3 | calm_surface:3, cold_slow:3, clear_subtle:1 |
| Walking Topwater<br>walking_topwater | lure | 8 | 3/12 (25%) | 0/0 | big_fish:3 | honorable:2, top:1 | calm_surface:3, cold_slow:3, clear_subtle:1 |
| Football Jig<br>football_jig | lure | 7 | 3/12 (25%) | 1/4 (25%) | big_fish:3 | honorable:3 | cold_slow:3, wind_reaction:3, dirty_vibration:2 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 3/36 (8.3%) | 0/0 | all_purpose:3 | top:3 | cold_slow:3, clear_subtle:2, calm_surface:1, dirty_vibration:1 |
| Ned Rig<br>ned_rig | lure | 9 | 2/12 (16.7%) | 1/8 (12.5%) | all_purpose:2 | honorable:1, top:1 | cold_slow:2, wind_reaction:2, dirty_vibration:1 |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 2/12 (16.7%) | 0/0 | big_fish:2 | honorable:2 | calm_surface:2, cold_slow:2, clear_subtle:1 |
| Blade Bait<br>blade_bait | lure | 7 | 2/36 (5.6%) | 0/0 | all_purpose:2 | honorable:1, top:1 | cold_slow:2, calm_surface:1, dirty_vibration:1 |
| Spinnerbait<br>spinnerbait | lure | 7 | 2/36 (5.6%) | 2/16 (12.5%) | all_purpose:1, big_fish:1 | top:2 | cold_slow:2, dirty_vibration:2 |
| Bladed Jig<br>bladed_jig | lure | 5 | 2/36 (5.6%) | 2/16 (12.5%) | all_purpose:1, big_fish:1 | honorable:2 | cold_slow:2, dirty_vibration:2 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 1/36 (2.8%) | 1/16 (6.3%) | all_purpose:1 | honorable:1 | cold_slow:1, dirty_vibration:1, wind_reaction:1 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8 | 1/36 (2.8%) | 1/16 (6.3%) | big_fish:1 | top:1 | cold_slow:1, dirty_vibration:1, wind_reaction:1 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 1/36 (2.8%) | 0/8 (0%) | all_purpose:1 | honorable:1 | calm_surface:1, cold_slow:1 |
| Deceiver<br>deceiver | fly | 7 | 1/36 (2.8%) | 0/0 | all_purpose:1 | top:1 | cold_slow:1, wind_reaction:1 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 1/36 (2.8%) | 0/0 | all_purpose:1 | top:1 | cold_slow:1, wind_reaction:1 |
| Buzzbait<br>buzzbait | lure | 9 | 0/12 (0%) | 0/0 |  |  |  |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 0/12 (0%) | 0/4 (0%) |  |  |  |
| Finesse Jig<br>finesse_jig | lure | 8 | 0/12 (0%) | 0/4 (0%) |  |  |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 0/36 (0%) | 0/0 |  |  |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 0/36 (0%) | 0/8 (0%) |  |  |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 0/36 (0%) | 0/0 |  |  |  |
| Swim Jig<br>swim_jig | lure | 7 | 0/36 (0%) | 0/16 (0%) |  |  |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 5 | 0/36 (0%) | 0/16 (0%) |  |  |  |

### Likely Cause Classification

None.

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 8 | 1/8 (12.5%) | Medium-Diving Crankbait (top), Football Jig (honorable):1, Squarebill Crankbait (top), Football Jig (honorable):1, Suspending Jerkbait (top), Carolina-Rigged Stick Worm (honorable):1, Suspending Jerkbait (top), Compact Flipping Jig (honorable):1 | scenario coverage |
| Finesse Jig<br>finesse_jig | lure | forage 2: crawfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 4 | 0/4 (0%) | Ned Rig (top), Carolina-Rigged Stick Worm (honorable):1, Squarebill Crankbait (top), Football Jig (honorable):1, Suspending Jerkbait (top), Tube Jig (honorable):1, Tube Jig (top), Compact Flipping Jig (honorable):1 | scenario coverage |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 4: cover_ambush, cold_slow, clear_subtle, heat_finesse<br>goal 1: reliable_action | 4 | 0/4 (0%) | Ned Rig (top), Carolina-Rigged Stick Worm (honorable):1, Squarebill Crankbait (top), Football Jig (honorable):1, Suspending Jerkbait (top), Tube Jig (honorable):1, Tube Jig (top), Compact Flipping Jig (honorable):1 | scenario coverage |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | forage 2: leech_worm, baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, cold_slow<br>goal 2: reliable_action, versatile_search | 24 | 6/24 (25%) | Flat-Sided Crankbait (top), Tube Jig (honorable):2, Compact Flipping Jig (top), Magnum Jerkbait (honorable):1, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):1, Glide Bait (top), Bladed Jig (honorable):1 | healthy / not underused |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, heat_finesse<br>goal 1: reliable_action | 8 | 0/8 (0%) | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):2, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):1, Flat-Sided Crankbait (top), Tube Jig (honorable):1, Magnum Jerkbait (top), Glide Bait (honorable):1 | scenario coverage |
| Spinnerbait<br>spinnerbait | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 3: wind_reaction, dirty_vibration, cover_ambush<br>goal 0: none | 16 | 2/16 (12.5%) | Compact Flipping Jig (top), Magnum Jerkbait (honorable):2, Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):1, Glide Bait (top), Bladed Jig (honorable):1 | healthy / not underused |
| Bladed Jig<br>bladed_jig | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: dirty_vibration, cover_ambush<br>goal 0: none | 16 | 2/16 (12.5%) | Compact Flipping Jig (top), Magnum Jerkbait (honorable):2, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):1, Medium-Diving Crankbait (top), Football Jig (honorable):1, Soft Plastic Jerkbait (top), Squarebill Crankbait (honorable):1 | healthy / not underused |
| Lipless Crankbait<br>lipless_crankbait | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 0: none | 16 | 0/16 (0%) | Compact Flipping Jig (top), Magnum Jerkbait (honorable):2, Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):1, Glide Bait (top), Bladed Jig (honorable):1 | scenario coverage or narrow home window |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
None from audit alone.

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Drop-Shot Minnow (drop_shot_minnow), Finesse Jig (finesse_jig), Lipless Crankbait (lipless_crankbait), Ned Rig (ned_rig), Texas-Rigged Soft-Plastic Craw (texas_rigged_soft_plastic_craw)

### Probably selector problem, not catalog problem
None.

## Utilization Notes / Coverage Gaps

- 8 eligible profile(s) were never selected despite appearing in candidate pools; these are prime coverage or selector-balance review targets.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Rabbit-Strip Leech, Woolly Bugger, Carolina-Rigged Stick Worm, Suspending Jerkbait, Bladed Jig, Spinnerbait, Squarebill Crankbait, Soft Plastic Jerkbait |
| underused_home_window | Deep-Diving Crankbait, Flat-Sided Crankbait, Lipless Crankbait, Medium-Diving Crankbait, Swim Jig |
| no_home_window_coverage | Articulated Baitfish Streamer, Baitfish Slider Fly, Clouser Minnow, Deceiver, Deer Hair Slider, Frog Fly, Game Changer, Popper Fly, Unweighted Baitfish Streamer, Buzzbait, Hollow-Body Frog, Paddle-Tail Swimbait, Walking Topwater |
| over-dominant | None |
| probably okay niche profile | Bluegill Streamer, Foam Gurgler, Warmwater Crawfish Fly, Worm Fly, Drop-Shot Minnow, Ned Rig, Weightless Stick Worm, Compact Flipping Jig, Finesse Jig, Football Jig, Texas-Rigged Soft-Plastic Craw, Shaky-Head Worm, Topwater Popper, Wake Bait |

## LMB Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 19.4% | 14/36 | 14/36 | 14 | 14 | 38.9% | 5/18 | 9/18 | 15 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket cold_slow_or_front:20, dirty_vibration:8, breezy_windy_stained_reaction:4 | Articulated Baitfish Streamer (honorable), Game Changer (top):2, Baitfish Slider Fly (top), Unweighted Baitfish Streamer (honorable):2, Frog Fly (top), Deer Hair Slider (honorable):2 |
| Woolly Bugger<br>woolly_bugger | fly | 8.3% | 6/36 | 6/36 | 6 | 6 | 16.7% | 6/18 | 0/18 | 7 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket cold_slow_or_front:20, dirty_vibration:8, breezy_windy_stained_reaction:4 | Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):4, Articulated Baitfish Streamer (honorable), Game Changer (top):2, Baitfish Slider Fly (top), Unweighted Baitfish Streamer (honorable):2 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 6.9% | 5/36 | 0/0 | 5 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 12.5% | 9/36 | 0/0 | 9 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |
| Bluegill Streamer<br>bluegill_streamer | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Clouser Minnow<br>clouser_minnow | fly | 5.6% | 4/36 | 0/0 | 4 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |
| Deceiver<br>deceiver | fly | 1.4% | 1/36 | 0/0 | 1 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 2.8% | 2/12 | 0/0 | 2 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |
| Foam Gurgler<br>foam_gurgler_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Frog Fly<br>frog_fly | fly | 4.2% | 3/12 | 0/0 | 3 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |
| Game Changer<br>game_changer | fly | 9.7% | 7/36 | 0/0 | 7 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |
| Popper Fly<br>popper_fly | fly | 4.2% | 3/12 | 0/0 | 3 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 8.3% | 6/36 | 0/0 | 6 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Worm Fly<br>warmwater_worm_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 11.1% | 8/36 | 6/24 | 8 | 6 | 25% | 6/12 | 0/12 | 5 | healthy | activity neutral:16, suppressed:8<br>clarity clear:12, stained:12<br>water freshwater_lake_pond:24<br>bucket cold_slow_or_front:16, breezy_windy_stained_reaction:4, calm_bright_clear_subtle:4 | Flat-Sided Crankbait (top), Tube Jig (honorable):2, Compact Flipping Jig (honorable), Suspending Jerkbait (top):1, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):1 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8.3% | 6/36 | 4/24 | 6 | 4 | 16.7% | 3/12 | 1/12 | 13 | healthy | activity neutral:16, suppressed:8<br>clarity clear:12, stained:12<br>water freshwater_lake_pond:24<br>bucket cold_slow_or_front:16, breezy_windy_stained_reaction:4, calm_bright_clear_subtle:4 | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):3, Flat-Sided Crankbait (top), Tube Jig (honorable):2, Carolina-Rigged Stick Worm (honorable), Ned Rig (top):1 |
| Bladed Jig<br>bladed_jig | lure | 2.8% | 2/36 | 2/16 | 2 | 2 | 12.5% | 1/8 | 1/8 | 0 | healthy | activity neutral:8, suppressed:8<br>clarity dirty:8, stained:8<br>water freshwater_lake_pond:16<br>bucket dirty_vibration:8, breezy_windy_stained_reaction:4, cold_slow_or_front:4 | Blade Bait (honorable), Spinnerbait (top):1, Compact Flipping Jig (honorable), Flat-Sided Crankbait (top):1, Compact Flipping Jig (honorable), Suspending Jerkbait (top):1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 1.4% | 1/36 | 1/16 | 1 | 1 | 6.3% | 1/8 | 0/8 | 6 | underused_home_window | activity neutral:8, suppressed:8<br>clarity dirty:8, stained:8<br>water freshwater_lake_pond:16<br>bucket dirty_vibration:8, breezy_windy_stained_reaction:4, cold_slow_or_front:4 | Blade Bait (honorable), Spinnerbait (top):1, Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Compact Flipping Jig (honorable), Flat-Sided Crankbait (top):1 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 6.9% | 5/36 | 1/16 | 5 | 1 | 6.3% | 0/8 | 1/8 | 8 | underused_home_window | activity neutral:8, suppressed:8<br>clarity dirty:8, stained:8<br>water freshwater_lake_pond:16<br>bucket dirty_vibration:8, breezy_windy_stained_reaction:4, cold_slow_or_front:4 | Blade Bait (honorable), Spinnerbait (top):1, Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Compact Flipping Jig (honorable), Suspending Jerkbait (top):1 |
| Lipless Crankbait<br>lipless_crankbait | lure | 0% | 0/36 | 0/16 | 0 | 0 | 0% | 0/8 | 0/8 | 0 | underused_home_window | activity neutral:8, suppressed:8<br>clarity dirty:8, stained:8<br>water freshwater_lake_pond:16<br>bucket dirty_vibration:8, breezy_windy_stained_reaction:4, cold_slow_or_front:4 | Blade Bait (honorable), Spinnerbait (top):1, Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Compact Flipping Jig (honorable), Flat-Sided Crankbait (top):1 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 1.4% | 1/36 | 1/16 | 1 | 1 | 6.3% | 0/8 | 1/8 | 4 | underused_home_window | activity neutral:8, suppressed:8<br>clarity dirty:8, stained:8<br>water freshwater_lake_pond:16<br>bucket dirty_vibration:8, breezy_windy_stained_reaction:4, cold_slow_or_front:4 | Blade Bait (honorable), Spinnerbait (top):1, Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Compact Flipping Jig (honorable), Flat-Sided Crankbait (top):1 |
| Spinnerbait<br>spinnerbait | lure | 2.8% | 2/36 | 2/16 | 2 | 2 | 12.5% | 1/8 | 1/8 | 3 | healthy | activity neutral:8, suppressed:8<br>clarity dirty:8, stained:8<br>water freshwater_lake_pond:16<br>bucket dirty_vibration:8, breezy_windy_stained_reaction:4, cold_slow_or_front:4 | Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Compact Flipping Jig (honorable), Flat-Sided Crankbait (top):1, Compact Flipping Jig (honorable), Suspending Jerkbait (top):1 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 6.9% | 5/36 | 4/16 | 5 | 4 | 25% | 4/8 | 0/8 | 10 | healthy | activity neutral:8, suppressed:8<br>clarity dirty:8, stained:8<br>water freshwater_lake_pond:16<br>bucket dirty_vibration:8, breezy_windy_stained_reaction:4, cold_slow_or_front:4 | Blade Bait (honorable), Spinnerbait (top):1, Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Compact Flipping Jig (honorable), Flat-Sided Crankbait (top):1 |
| Swim Jig<br>swim_jig | lure | 0% | 0/36 | 0/16 | 0 | 0 | 0% | 0/8 | 0/8 | 1 | underused_home_window | activity neutral:8, suppressed:8<br>clarity dirty:8, stained:8<br>water freshwater_lake_pond:16<br>bucket dirty_vibration:8, breezy_windy_stained_reaction:4, cold_slow_or_front:4 | Blade Bait (honorable), Spinnerbait (top):1, Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Compact Flipping Jig (honorable), Flat-Sided Crankbait (top):1 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 0% | 0/36 | 0/8 | 0 | 0 | 0% | 0/4 | 0/4 | 0 | probably okay niche profile | activity neutral:4, suppressed:4<br>clarity clear:8<br>water freshwater_lake_pond:8<br>bucket calm_bright_clear_subtle:4, cold_slow_or_front:4 | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):2, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):1, Flat-Sided Crankbait (top), Tube Jig (honorable):1 |
| Ned Rig<br>ned_rig | lure | 2.8% | 2/12 | 1/8 | 2 | 1 | 12.5% | 1/4 | 0/4 | 2 | probably okay niche profile | activity neutral:8<br>clarity clear:4, stained:4<br>water freshwater_lake_pond:8<br>bucket breezy_windy_stained_reaction:4, cold_slow_or_front:4 | Compact Flipping Jig (honorable), Suspending Jerkbait (top):1, Football Jig (honorable), Medium-Diving Crankbait (top):1, Football Jig (honorable), Squarebill Crankbait (top):1 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 5.6% | 4/36 | 2/8 | 4 | 2 | 25% | 2/4 | 0/4 | 2 | healthy | activity neutral:4, suppressed:4<br>clarity clear:8<br>water freshwater_lake_pond:8<br>bucket calm_bright_clear_subtle:4, cold_slow_or_front:4 | Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):1, Flat-Sided Crankbait (top), Tube Jig (honorable):1, Glide Bait (honorable), Magnum Jerkbait (top):1 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 1.4% | 1/36 | 0/8 | 1 | 0 | 0% | 0/4 | 0/4 | 4 | probably okay niche profile | activity neutral:4, suppressed:4<br>clarity clear:8<br>water freshwater_lake_pond:8<br>bucket calm_bright_clear_subtle:4, cold_slow_or_front:4 | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):2, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):1, Flat-Sided Crankbait (top), Tube Jig (honorable):1 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 8.3% | 6/36 | 1/4 | 6 | 1 | 25% | 0/2 | 1/2 | 0 | probably okay niche profile | activity neutral:4<br>clarity clear:4<br>water freshwater_lake_pond:4<br>bucket cold_slow_or_front:4 | Carolina-Rigged Stick Worm (honorable), Ned Rig (top):1, Football Jig (honorable), Squarebill Crankbait (top):1, Suspending Jerkbait (top), Tube Jig (honorable):1 |
| Finesse Jig<br>finesse_jig | lure | 0% | 0/12 | 0/4 | 0 | 0 | 0% | 0/2 | 0/2 | 2 | probably okay niche profile | activity neutral:4<br>clarity clear:4<br>water freshwater_lake_pond:4<br>bucket cold_slow_or_front:4 | Carolina-Rigged Stick Worm (honorable), Ned Rig (top):1, Football Jig (honorable), Squarebill Crankbait (top):1, Suspending Jerkbait (top), Tube Jig (honorable):1 |
| Football Jig<br>football_jig | lure | 4.2% | 3/12 | 1/4 | 3 | 1 | 25% | 0/2 | 1/2 | 1 | probably okay niche profile | activity neutral:4<br>clarity clear:4<br>water freshwater_lake_pond:4<br>bucket cold_slow_or_front:4 | Carolina-Rigged Stick Worm (honorable), Ned Rig (top):1, Suspending Jerkbait (top), Tube Jig (honorable):1, Tube Jig (top), Compact Flipping Jig (honorable):1 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 0% | 0/12 | 0/4 | 0 | 0 | 0% | 0/2 | 0/2 | 2 | probably okay niche profile | activity neutral:4<br>clarity clear:4<br>water freshwater_lake_pond:4<br>bucket cold_slow_or_front:4 | Carolina-Rigged Stick Worm (honorable), Ned Rig (top):1, Football Jig (honorable), Squarebill Crankbait (top):1, Suspending Jerkbait (top), Tube Jig (honorable):1 |
| Buzzbait<br>buzzbait | lure | 0% | 0/12 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |
| Hollow-Body Frog<br>hollow_body_frog | lure | 4.2% | 3/12 | 0/0 | 3 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 0% | 0/36 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |
| Shaky-Head Worm<br>shaky_head_worm | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Topwater Popper<br>popping_topwater | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Wake Bait<br>wake_bait | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Walking Topwater<br>walking_topwater | lure | 4.2% | 3/12 | 0/0 | 3 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |
| forage_clarity_stack | 2 |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 | all_purpose<br>stained<br>freshwater_lake_pond | cold_slow_or_front<br>suppressed | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 | big_fish<br>stained<br>freshwater_lake_pond | cold_slow_or_front<br>suppressed | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | 6/12 | 0/12 | goal_tags:10, selector_filtering_variety_jitter:3, forage_clarity_stack:2, seasonal_baseline:2, daily_condition_tags:1 | Lake Okeechobee / central FL bass lake 2025-03-18 all_purpose clear: lost to Flat-Sided Crankbait by -2 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-03-19 all_purpose stained: lost to Flat-Sided Crankbait by -2 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-03-19 all_purpose clear: lost to Suspending Jerkbait by 0 (selector_filtering_variety_jitter) |
| Ned Rig<br>ned_rig | 1/4 | 0/4 | goal_tags:5, forage_clarity_stack:2 | Lake Okeechobee / central FL bass lake 2025-01-16 big_fish clear: lost to Tube Jig by 12 (forage_clarity_stack)<br>Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose stained: lost to Tube Jig by 12 (forage_clarity_stack)<br>Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Suspending Jerkbait by 16 (goal_tags) |
| Finesse Jig<br>finesse_jig | 0/2 | 0/2 | goal_tags:2, forage_clarity_stack:1, selector_filtering_variety_jitter:1 | Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Carolina-Rigged Stick Worm by 0 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-01-16 big_fish clear: lost to Tube Jig by 12 (forage_clarity_stack)<br>Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Suspending Jerkbait by 16 (goal_tags) |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | 0/2 | 0/2 | goal_tags:2, forage_clarity_stack:1, selector_filtering_variety_jitter:1 | Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Carolina-Rigged Stick Worm by 0 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-01-16 big_fish clear: lost to Tube Jig by 12 (forage_clarity_stack)<br>Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Suspending Jerkbait by 16 (goal_tags) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-18<br>all_purpose clear cold_slow_or_front | 186 | Flat-Sided Crankbait<br>184 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-19<br>all_purpose stained cold_slow_or_front | 170 | Flat-Sided Crankbait<br>168 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-19<br>all_purpose clear calm_bright_clear_subtle | 186 | Suspending Jerkbait<br>186 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Finesse Jig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Carolina-Rigged Stick Worm<br>170 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Texas-Rigged Soft-Plastic Craw<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Carolina-Rigged Stick Worm<br>170 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-18<br>all_purpose stained cold_slow_or_front | 170 | Soft Plastic Jerkbait<br>174 | 4 | seasonal_baseline | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Finesse Jig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>big_fish clear cold_slow_or_front | 136 | Tube Jig<br>148 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Ned Rig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>big_fish clear cold_slow_or_front | 136 | Tube Jig<br>148 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Ned Rig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose stained breezy_windy_stained_reaction | 164 | Tube Jig<br>176 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Texas-Rigged Soft-Plastic Craw<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>big_fish clear cold_slow_or_front | 136 | Tube Jig<br>148 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Finesse Jig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Suspending Jerkbait<br>186 | 16 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Ned Rig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Suspending Jerkbait<br>186 | 16 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Suspending Jerkbait<br>186 | 16 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Finesse Jig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>big_fish clear cold_slow_or_front | 136 | Football Jig<br>156 | 20 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Ned Rig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>big_fish clear cold_slow_or_front | 136 | Football Jig<br>156 | 20 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Texas-Rigged Soft-Plastic Craw<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>big_fish clear cold_slow_or_front | 136 | Football Jig<br>156 | 20 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| avoidIds | 3 |
| honorable_diversity_or_replacement | 2 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Flat-Sided Crankbait<br>184 | Carolina-Rigged Stick Worm<br>186 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Flat-Sided Crankbait<br>168 | Carolina-Rigged Stick Worm<br>170 | -2 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>170 | Finesse Jig<br>170 | 0 | honorable_diversity_or_replacement | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | honorable_diversity_or_replacement | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Suspending Jerkbait<br>186 | Carolina-Rigged Stick Worm<br>186 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 1/16 | 6.3% | 8 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, big_fish / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:2, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:2 | goal_tags:11, forage_clarity_stack:3, selector_filtering_variety_jitter:1 | Blade Bait (honorable), Spinnerbait (top):1, Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Compact Flipping Jig (honorable), Suspending Jerkbait (top):1, Compact Flipping Jig (top), Magnum Jerkbait (honorable):1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 1/16 | 6.3% | 6 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, big_fish / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:2, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:2 | goal_tags:14, forage_clarity_stack:1 | Blade Bait (honorable), Spinnerbait (top):1, Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Compact Flipping Jig (honorable), Flat-Sided Crankbait (top):1, Compact Flipping Jig (honorable), Suspending Jerkbait (top):1 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 1/16 | 6.3% | 4 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, big_fish / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:2, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:2 | goal_tags:15 | Blade Bait (honorable), Spinnerbait (top):1, Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Compact Flipping Jig (honorable), Flat-Sided Crankbait (top):1, Compact Flipping Jig (honorable), Suspending Jerkbait (top):1 |
| Swim Jig<br>swim_jig | lure | 0/16 | 0% | 1 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, big_fish / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:2, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:2 | goal_tags:14, daily_condition_tags:2 | Blade Bait (honorable), Spinnerbait (top):1, Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Compact Flipping Jig (honorable), Flat-Sided Crankbait (top):1, Compact Flipping Jig (honorable), Suspending Jerkbait (top):1 |
| Lipless Crankbait<br>lipless_crankbait | lure | 0/16 | 0% | 0 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, big_fish / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:2, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:2 | goal_tags:16 | Blade Bait (honorable), Spinnerbait (top):1, Carolina-Rigged Stick Worm (top), Bladed Jig (honorable):1, Compact Flipping Jig (honorable), Flat-Sided Crankbait (top):1, Compact Flipping Jig (honorable), Suspending Jerkbait (top):1 |

## Over-Dominant Profiles

None.

## Home-Window Coverage Gaps

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 0/0 | 0% | 0 |  |  |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 0/0 | 0% | 0 |  |  |  |
| Buzzbait<br>buzzbait | lure | 0/0 | 0% | 0 |  |  |  |
| Clouser Minnow<br>clouser_minnow | fly | 0/0 | 0% | 0 |  |  |  |
| Deceiver<br>deceiver | fly | 0/0 | 0% | 0 |  |  |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 0/0 | 0% | 0 |  |  |  |
| Frog Fly<br>frog_fly | fly | 0/0 | 0% | 0 |  |  |  |
| Game Changer<br>game_changer | fly | 0/0 | 0% | 0 |  |  |  |
| Hollow-Body Frog<br>hollow_body_frog | lure | 0/0 | 0% | 0 |  |  |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 0/0 | 0% | 0 |  |  |  |
| Popper Fly<br>popper_fly | fly | 0/0 | 0% | 0 |  |  |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 0/0 | 0% | 0 |  |  |  |
| Walking Topwater<br>walking_topwater | lure | 0/0 | 0% | 0 |  |  |  |

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Popper Fly [fly] (3), Flat-Sided Crankbait [lure] (2), Soft Plastic Jerkbait [lure] (2), Baitfish Slider Fly [fly] (1), Blade Bait [lure] (1) | Baitfish Slider Fly [fly] (3), Carolina-Rigged Stick Worm [lure] (3), Popper Fly [fly] (3), Flat-Sided Crankbait [lure] (2), Rabbit-Strip Leech [fly] (2) |
| calm_surface | big_fish | Frog Fly [fly] (3), Articulated Dungeon Streamer [fly] (2), Hollow-Body Frog [lure] (2), Magnum Jerkbait [lure] (2), Glide Bait [lure] (1) | Frog Fly [fly] (3), Glide Bait [lure] (3), Hollow-Body Frog [lure] (3), Magnum Jerkbait [lure] (3), Rabbit-Strip Leech [fly] (3) |
| low_light_surface | all_purpose | None | None |
| low_light_surface | big_fish | None | None |
| wind_reaction | all_purpose | Suspending Jerkbait [lure] (3), Clouser Minnow [fly] (2), Baitfish Slider Fly [fly] (1), Deceiver [fly] (1), Jighead Marabou Leech [fly] (1) | Clouser Minnow [fly] (3), Suspending Jerkbait [lure] (3), Woolly Bugger [fly] (3), Baitfish Slider Fly [fly] (2), Carolina-Rigged Stick Worm [lure] (2) |
| wind_reaction | big_fish | Articulated Baitfish Streamer [fly] (2), Articulated Dungeon Streamer [fly] (2), Suspending Jerkbait [lure] (2), Baitfish Slider Fly [fly] (1), Flat-Sided Crankbait [lure] (1) | Articulated Dungeon Streamer [fly] (3), Compact Flipping Jig [lure] (3), Football Jig [lure] (3), Game Changer [fly] (3), Rabbit-Strip Leech [fly] (3) |
| dirty_vibration | all_purpose | Clouser Minnow [fly] (3), Baitfish Slider Fly [fly] (2), Rabbit-Strip Leech [fly] (2), Squarebill Crankbait [lure] (2), Suspending Jerkbait [lure] (2) | Baitfish Slider Fly [fly] (4), Squarebill Crankbait [lure] (4), Carolina-Rigged Stick Worm [lure] (3), Clouser Minnow [fly] (3), Rabbit-Strip Leech [fly] (3) |
| dirty_vibration | big_fish | Articulated Dungeon Streamer [fly] (3), Articulated Baitfish Streamer [fly] (2), Compact Flipping Jig [lure] (2), Game Changer [fly] (2), Suspending Jerkbait [lure] (2) | Articulated Baitfish Streamer [fly] (4), Articulated Dungeon Streamer [fly] (4), Compact Flipping Jig [lure] (4), Game Changer [fly] (4), Rabbit-Strip Leech [fly] (4) |
| clear_subtle | all_purpose | Lead-Eye Leech [fly] (2), Soft Plastic Jerkbait [lure] (2), Flat-Sided Crankbait [lure] (1), Popper Fly [fly] (1), Tube Jig [lure] (1) | Baitfish Slider Fly [fly] (2), Carolina-Rigged Stick Worm [lure] (2), Lead-Eye Leech [fly] (2), Soft Plastic Jerkbait [lure] (2), Tube Jig [lure] (2) |
| clear_subtle | big_fish | Articulated Dungeon Streamer [fly] (2), Magnum Jerkbait [lure] (2), Flat-Sided Crankbait [lure] (1), Frog Fly [fly] (1), Game Changer [fly] (1) | Articulated Dungeon Streamer [fly] (2), Glide Bait [lure] (2), Magnum Jerkbait [lure] (2), Rabbit-Strip Leech [fly] (2), Compact Flipping Jig [lure] (1) |
| cold_slow | all_purpose | Soft Plastic Jerkbait [lure] (4), Baitfish Slider Fly [fly] (3), Clouser Minnow [fly] (3), Flat-Sided Crankbait [lure] (3), Lead-Eye Leech [fly] (3) | Baitfish Slider Fly [fly] (8), Carolina-Rigged Stick Worm [lure] (8), Woolly Bugger [fly] (6), Rabbit-Strip Leech [fly] (5), Tube Jig [lure] (5) |
| cold_slow | big_fish | Articulated Dungeon Streamer [fly] (6), Game Changer [fly] (4), Frog Fly [fly] (3), Magnum Jerkbait [lure] (3), Articulated Baitfish Streamer [fly] (2) | Rabbit-Strip Leech [fly] (9), Articulated Dungeon Streamer [fly] (8), Game Changer [fly] (7), Compact Flipping Jig [lure] (6), Glide Bait [lure] (6) |
| warming_search | all_purpose | None | None |
| warming_search | big_fish | None | None |
| heat_finesse | all_purpose | None | None |
| heat_finesse | big_fish | None | None |
| current_swing | all_purpose | None | None |
| current_swing | big_fish | None | None |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 dirty big_fish B | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Suspending Jerkbait (148); Football Jig (156); Articulated Dungeon Streamer (152); Rabbit-Strip Leech (150) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 stained big_fish B | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Suspending Jerkbait (156); Compact Flipping Jig (156); Articulated Dungeon Streamer (152); Game Changer (144) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 clear big_fish B | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow, medium | Tube Jig (148); Compact Flipping Jig (132); Baitfish Slider Fly (150); Articulated Dungeon Streamer (144) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 dirty all_purpose B | 59-72.6F, 13.7 mph wind, 0% cloud, 0 in precip | suppressed, closed, dirty_vibration+cold_slow, medium | Squarebill Crankbait (174); Carolina-Rigged Stick Worm (152); Clouser Minnow (146); Unweighted Baitfish Streamer (150) | DIRTY_WIND_NOT_ELEVATING_VIBRATION |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 dirty big_fish B | 59-72.6F, 13.7 mph wind, 0% cloud, 0 in precip | suppressed, closed, dirty_vibration+cold_slow, medium | Spinnerbait (152); Glide Bait (156); Game Changer (144); Articulated Baitfish Streamer (144) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 stained big_fish B | 59-72.6F, 13.7 mph wind, 0% cloud, 0 in precip | suppressed, closed, dirty_vibration+cold_slow, medium | Glide Bait (164); Bladed Jig (140); Game Changer (144); Articulated Baitfish Streamer (144) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear all_purpose A | 59.2-76.4F, 5.9 mph wind, 19.1% cloud, 0 in precip | neutral, open, calm_surface+clear_subtle+cold_slow, medium | Soft Plastic Jerkbait (190); Carolina-Rigged Stick Worm (186); Lead-Eye Leech (168); Baitfish Slider Fly (158) | ADJACENT_DAY_EXACT_REPEAT |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty all_purpose B | 59.2-76.4F, 5.9 mph wind, 19.1% cloud, 0 in precip | neutral, open, calm_surface+cold_slow, medium | Blade Bait (154); Carolina-Rigged Stick Worm (152); Baitfish Slider Fly (158); Unweighted Baitfish Streamer (150) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained all_purpose A | 59.2-76.4F, 5.9 mph wind, 19.1% cloud, 0 in precip | neutral, open, calm_surface+cold_slow, medium | Soft Plastic Jerkbait (174); Carolina-Rigged Stick Worm (170); Rabbit-Strip Leech (158); Woolly Bugger (158) | ADJACENT_DAY_EXACT_REPEAT |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 clear all_purpose A | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow, medium | Suspending Jerkbait (186); Tube Jig (182); Jighead Marabou Leech (158); Woolly Bugger (158) | None |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 clear all_purpose B | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow, medium | Ned Rig (170); Carolina-Rigged Stick Worm (170); Deceiver (152); Clouser Minnow (154) | None |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 clear big_fish A | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow, medium | Squarebill Crankbait (142); Football Jig (156); Game Changer (144); Rabbit-Strip Leech (142) | None |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 dirty all_purpose A | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Squarebill Crankbait (162); Deep-Diving Crankbait (164); Rabbit-Strip Leech (148); Baitfish Slider Fly (162) | None |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 dirty all_purpose B | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Suspending Jerkbait (178); Ned Rig (154); Clouser Minnow (146); Woolly Bugger (148) | None |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 dirty big_fish A | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Flat-Sided Crankbait (142); Compact Flipping Jig (156); Articulated Baitfish Streamer (144); Game Changer (144) | None |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 stained all_purpose A | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Tube Jig (176); Squarebill Crankbait (162); Baitfish Slider Fly (162); Rabbit-Strip Leech (158) | None |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 stained all_purpose B | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Suspending Jerkbait (186); Carolina-Rigged Stick Worm (170); Clouser Minnow (154); Woolly Bugger (158) | None |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 stained big_fish A | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Medium-Diving Crankbait (152); Football Jig (156); Articulated Baitfish Streamer (144); Rabbit-Strip Leech (150) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 clear all_purpose A | 59-72.6F, 13.7 mph wind, 0% cloud, 0 in precip | suppressed, closed, clear_subtle+cold_slow, medium | Soft Plastic Jerkbait (190); Carolina-Rigged Stick Worm (186); Lead-Eye Leech (168); Woolly Bugger (158) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 clear all_purpose B | 59-72.6F, 13.7 mph wind, 0% cloud, 0 in precip | suppressed, closed, clear_subtle+cold_slow, medium | Flat-Sided Crankbait (184); Tube Jig (180); Unweighted Baitfish Streamer (174); Baitfish Slider Fly (158) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 clear big_fish A | 59-72.6F, 13.7 mph wind, 0% cloud, 0 in precip | suppressed, closed, clear_subtle+cold_slow, medium | Magnum Jerkbait (176); Glide Bait (180); Game Changer (144); Rabbit-Strip Leech (142) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 clear big_fish B | 59-72.6F, 13.7 mph wind, 0% cloud, 0 in precip | suppressed, closed, clear_subtle+cold_slow, medium | Flat-Sided Crankbait (166); Compact Flipping Jig (132); Articulated Dungeon Streamer (156); Unweighted Baitfish Streamer (162) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 dirty all_purpose A | 59-72.6F, 13.7 mph wind, 0% cloud, 0 in precip | suppressed, closed, dirty_vibration+cold_slow, medium | Spinnerbait (152); Blade Bait (154); Lead-Eye Leech (142); Baitfish Slider Fly (158) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 dirty big_fish A | 59-72.6F, 13.7 mph wind, 0% cloud, 0 in precip | suppressed, closed, dirty_vibration+cold_slow, medium | Compact Flipping Jig (156); Magnum Jerkbait (152); Rabbit-Strip Leech (150); Articulated Dungeon Streamer (164) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 stained all_purpose A | 59-72.6F, 13.7 mph wind, 0% cloud, 0 in precip | suppressed, closed, dirty_vibration+cold_slow, medium | Soft Plastic Jerkbait (174); Squarebill Crankbait (174); Rabbit-Strip Leech (158); Woolly Bugger (158) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 stained all_purpose B | 59-72.6F, 13.7 mph wind, 0% cloud, 0 in precip | suppressed, closed, dirty_vibration+cold_slow, medium | Carolina-Rigged Stick Worm (170); Bladed Jig (140); Baitfish Slider Fly (158); Unweighted Baitfish Streamer (158) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 stained big_fish A | 59-72.6F, 13.7 mph wind, 0% cloud, 0 in precip | suppressed, closed, dirty_vibration+cold_slow, medium | Compact Flipping Jig (156); Magnum Jerkbait (160); Articulated Dungeon Streamer (164); Rabbit-Strip Leech (150) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear all_purpose B | 59.2-76.4F, 5.9 mph wind, 19.1% cloud, 0 in precip | neutral, open, calm_surface+clear_subtle+cold_slow, medium | Tube Jig (180); Suspending Jerkbait (186); Popper Fly (176); Unweighted Baitfish Streamer (174) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear big_fish A | 59.2-76.4F, 5.9 mph wind, 19.1% cloud, 0 in precip | neutral, open, calm_surface+clear_subtle+cold_slow, medium | Magnum Jerkbait (176); Hollow-Body Frog (162); Frog Fly (162); Deer Hair Slider (160) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear big_fish B | 59.2-76.4F, 5.9 mph wind, 19.1% cloud, 0 in precip | neutral, open, calm_surface+clear_subtle+cold_slow, medium | Walking Topwater (172); Glide Bait (180); Articulated Dungeon Streamer (156); Rabbit-Strip Leech (142) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty all_purpose A | 59.2-76.4F, 5.9 mph wind, 19.1% cloud, 0 in precip | neutral, open, calm_surface+cold_slow, medium | Flat-Sided Crankbait (160); Weightless Stick Worm (158); Popper Fly (168); Rabbit-Strip Leech (148) | None |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty big_fish A | 59.2-76.4F, 5.9 mph wind, 19.1% cloud, 0 in precip | neutral, open, calm_surface+cold_slow, medium | Magnum Jerkbait (152); Walking Topwater (164); Frog Fly (162); Game Changer (144) | None |

## Known Coverage Gaps

- calm_low_light_surface: not naturally produced by completed archive rows.
- warming_search: not naturally produced by completed archive rows.
- heat_limited_finesse: not naturally produced by completed archive rows.
- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- stable_pleasant_medium_confidence_archive: not naturally produced by completed archive rows.
- river_elevated_runoff_current: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
