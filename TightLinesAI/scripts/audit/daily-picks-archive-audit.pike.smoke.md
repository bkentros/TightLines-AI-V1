# FinFindr Pike Daily-Picks Archive Audit
Generated: 2026-05-12T01:02:37.305Z

## Scope Summary

| Metric | Value |
| --- | --- |
| Archived weather scenarios | 3 |
| Expanded recommendation runs | 36 |
| Months | Jan |
| Regions | 3 |
| Fisheries | 3 |
| Water types | freshwater_lake_pond |
| Clarity split | clear:12, stained:12, dirty:12 |
| Goal split | all_purpose:18, big_fish:18 |
| Skipped weather scenarios | 0 |
| JSONL output | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/daily-picks-archive-audit.pike.smoke.jsonl |

## Condition Bucket Coverage

| Bucket | Expanded runs |
| --- | --- |
| calm_low_light_surface | 0 |
| calm_bright_clear_subtle | 0 |
| breezy_windy_stained_reaction | 12 |
| dirty_vibration | 12 |
| cold_slow_or_front | 12 |
| warming_search | 12 |
| heat_limited_finesse | 0 |
| stable_pleasant_high_confidence | 0 |
| stable_pleasant_medium_confidence_archive | 12 |
| river_elevated_runoff_current | 0 |
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
| breezy_windy_stained_reaction | 3 | WIND_NOT_ELEVATING_REACTION (3) |
| dirty_vibration | 2 | WIND_NOT_ELEVATING_REACTION (2) |
| medium_confidence_archive | 7 | WIND_NOT_ELEVATING_REACTION (7) |
| stable_pleasant_medium_confidence_archive | 5 | WIND_NOT_ELEVATING_REACTION (5) |
| warming_search | 2 | WIND_NOT_ELEVATING_REACTION (2) |

- WIND_NOT_ELEVATING_REACTION: 7

- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Paddle-Tail Swimbait (lure); Large Bucktail Spinner (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Paddle Tail Pike Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Large Bucktail Spinner (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Articulated Dungeon Streamer (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Casting Spoon (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Large Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Casting Spoon (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 5

- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Paddle Tail Pike Jig (lure); Large Jerkbait (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Paddle Tail Pike Jig (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Articulated Dungeon Streamer (fly)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Paddle Tail Pike Jig (lure); Articulated Dungeon Streamer (fly); Articulated Pike Streamer (fly)
- nd_devils_lake_pike__2025-01-26__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Paddle Tail Pike Jig (lure); Articulated Pike Streamer (fly); Articulated Dungeon Streamer (fly)

## Temperature/Thermal Diagnostics

### Thermal Modes By Month/Region

| Month | Region | Thermal modes |
| --- | --- | --- |
| Jan | great_lakes_upper_midwest | stable:1 |
| Jan | midwest_interior | cold_slow:1 |
| Jan | northeast | warming:1 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

None.

## Surface/Topwater Diagnostics

### Topwater Selection Summary

None.

### Shoulder-Season Topwater Selections

None.

## Pike Cold/Open Surface Diagnostics

### Cold/Open Surface Summary

| Split | Runs |
| --- | --- |
| cold/open rows with surface picks | 0 |
| May cold/open rows | 0 |
| May rows at or below 50F high | 0 |

### Cold/Open Surface Rows

None.

## Pike Clear/Bright Diagnostics

### Clear/Bright Summary

| Split | Rows checked | Watch picks | Common selected | Common alternatives |
| --- | --- | --- | --- | --- |
| true clear-calm/glare control | 0 | 0 | None | None |
| clear breezy/wind-reaction | 0 | 0 | None | None |

### Clear/Bright Watch Rows

None.

## Pike Heat-Limited Diagnostics

### Heat-Limited Pike Summary

| Context | Controlled/deeper/slower | Reckless surface/fast/high-risk | Surface pick rows | Surface picks | Non-surface high-risk rows | Non-surface high-risk picks | Mixed watch | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| true_heat_limited | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| warm_adjacent | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

### Heat-Limited Pike Rows

None.

## Set B Diagnostics

### Set B Overlap Cause Counts

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

| Kind | Cause | Lure | Fly | Total |
| --- | --- | --- | --- | --- |
| exact_id | unavoidable_due_score_band | 6 | 0 | 6 |
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 1 | 1 |
| same_family_same_presentation | unavoidable_due_score_band | 0 | 1 | 1 |
| same_family_different_presentation | truly_avoidable | 0 | 5 | 5 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 5 | 5 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 1 | 1 |
| same_family_different_presentation | unavoidable_due_goal_condition_fit | 0 | 1 | 1 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Lake of the Woods pike water<br>2025-01-16 stained big_fish | fly honorable: same_family_different_presentation | Game Changer (156); Articulated Baitfish Streamer (162) | Articulated Pike Streamer (166); Articulated Dungeon Streamer (168) | Large Rabbit Strip Streamer (172, alt edge 4) |
| Devils Lake prairie pike water<br>2025-01-26 stained big_fish | fly honorable: same_family_different_presentation | Large Rabbit Strip Streamer (188); Articulated Baitfish Streamer (146) | Articulated Pike Streamer (166); Articulated Dungeon Streamer (168) | Rabbit-Strip Leech (164, alt edge -4) |
| Lake of the Woods pike water<br>2025-01-16 dirty big_fish | fly top: same_family_different_presentation | Articulated Dungeon Streamer (168); Articulated Pike Streamer (166) | Articulated Baitfish Streamer (162); Large Rabbit Strip Streamer (172) | Game Changer (156, alt edge -6) |
| Lake of the Woods pike water<br>2025-01-16 dirty big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (168); Articulated Pike Streamer (166) | Articulated Baitfish Streamer (162); Large Rabbit Strip Streamer (172) | Game Changer (156, alt edge -16) |
| Lake Champlain pike water<br>2025-01-18 stained big_fish | fly honorable: same_family_different_presentation | Large Rabbit Strip Streamer (172); Articulated Baitfish Streamer (146) | Articulated Dungeon Streamer (168); Articulated Pike Streamer (166) | Rabbit-Strip Leech (148, alt edge -18) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| Devils Lake prairie pike water<br>2025-01-26 clear | A | 3/4 | Blade Bait; Paddle Tail Pike Jig; Rabbit-Strip Leech; Large Rabbit Strip Streamer | Paddle Tail Pike Jig; Large Jerkbait; Large Rabbit Strip Streamer; Rabbit-Strip Leech |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

None.

## Big Fish No-Upside Diagnostics

None.

## Pike Big Fish Upside Split Diagnostics

### Pike Big Fish Upside Split Summary

| Class | Picks | Share | Common profiles |
| --- | --- | --- | --- |
| controlled_upside | 63 | 87.5% | Paddle Tail Pike Jig [lure] (13), Large Bucktail Spinner [lure] (9), Articulated Pike Streamer [fly] (8), Large Rabbit Strip Streamer [fly] (8), Large Jerkbait [lure] (7) |
| high_risk_or_reckless_upside | 9 | 12.5% | Articulated Dungeon Streamer [fly] (9) |
| no_explicit_upside | 0 | 0% | None |

### High-Risk/Reckless Pike Big Fish Upside Rows

| Scenario | Pick | Class | Reasons |
| --- | --- | --- | --- |
| Lake of the Woods pike water<br>2025-01-16 clear A | Articulated Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake of the Woods pike water<br>2025-01-16 stained B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake of the Woods pike water<br>2025-01-16 dirty A | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-01-18 clear A | Articulated Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-01-18 stained B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-01-18 dirty B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Devils Lake prairie pike water<br>2025-01-26 clear B | Articulated Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Devils Lake prairie pike water<br>2025-01-26 stained B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Devils Lake prairie pike water<br>2025-01-26 dirty B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| Lake of the Woods pike water<br>2025-01-16 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (156; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (154; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Large Rabbit Strip Streamer (164, alt edge 8) | goal fit likely competed |
| Lake of the Woods pike water<br>2025-01-16 stained all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (146; goal:all_purpose:reliable_action:+18); Articulated Baitfish Streamer (154; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (164, alt edge 10) | goal fit likely competed |
| Lake of the Woods pike water<br>2025-01-16 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (156; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (162; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Large Rabbit Strip Streamer (172, alt edge 10) | goal fit likely competed |
| Lake of the Woods pike water<br>2025-01-16 stained big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Paddle Tail Pike Jig (182; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20); Large Paddle-Tail Swimbait (168; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Large Bucktail Spinner (178, alt edge -4) | goal fit likely competed |
| Lake of the Woods pike water<br>2025-01-16 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (146; goal:all_purpose:reliable_action:+18); Articulated Baitfish Streamer (154; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (164, alt edge 10) | goal fit likely competed |
| Lake Champlain pike water<br>2025-01-18 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (132; goal:all_purpose:versatile_search:+12); Articulated Baitfish Streamer (130; goal:all_purpose:versatile_search:+12) | Deceiver (148, alt edge 16) | goal fit likely competed |
| Lake Champlain pike water<br>2025-01-18 dirty all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (146; goal:all_purpose:reliable_action:+18); Articulated Baitfish Streamer (138; goal:all_purpose:versatile_search:+12) | Large Rabbit Strip Streamer (152, alt edge 6) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| dirty_vibration_acceptable | 5 |
| clear_subtle_wind_watch | 2 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | Lake of the Woods pike water<br>2025-01-16 big_fish clear B | stable_pleasant_medium_confidence_archive<br>neutral | Large Paddle-Tail Swimbait 168<br>Large Bucktail Spinner 178 |
| clear_subtle_wind_watch | Lake Champlain pike water<br>2025-01-18 all_purpose clear A | warming_search<br>neutral | Paddle Tail Pike Jig 156<br>Large Jerkbait 136 |
| dirty_vibration_acceptable | Lake of the Woods pike water<br>2025-01-16 all_purpose stained B | breezy_windy_stained_reaction<br>neutral | Large Bucktail Spinner 170<br>Paddle Tail Pike Jig 180 |
| dirty_vibration_acceptable | Lake of the Woods pike water<br>2025-01-16 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Large Jerkbait 172<br>Large Bucktail Spinner 178 |
| dirty_vibration_acceptable | Lake of the Woods pike water<br>2025-01-16 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Paddle Tail Pike Jig 182<br>Large Paddle-Tail Swimbait 168 |
| dirty_vibration_acceptable | Lake of the Woods pike water<br>2025-01-16 all_purpose dirty B | dirty_vibration<br>neutral | Paddle Tail Pike Jig 180<br>Casting Spoon 156 |
| dirty_vibration_acceptable | Lake Champlain pike water<br>2025-01-18 all_purpose dirty A | dirty_vibration<br>neutral | Paddle Tail Pike Jig 180<br>Casting Spoon 140 |

## Guide Verdict Summary

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | all_purpose | B | fly | medium_confidence_archive | 6 |
| watch | all_purpose | A | fly | medium_confidence_archive | 5 |
| watch | all_purpose | A | fly | warming_search | 5 |
| watch | big_fish | A | fly | medium_confidence_archive | 5 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 3 |
| watch | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 3 |
| watch | big_fish | A | lure | medium_confidence_archive | 3 |
| watch | all_purpose | A | fly | dirty_vibration | 2 |
| watch | all_purpose | A | lure | medium_confidence_archive | 2 |
| watch | all_purpose | A | lure | warming_search | 2 |
| watch | all_purpose | B | fly | warming_search | 2 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 2 |
| watch | big_fish | A | fly | dirty_vibration | 2 |
| watch | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 2 |
| watch | big_fish | A | fly | warming_search | 2 |
| watch | big_fish | B | lure | medium_confidence_archive | 2 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 1 |
| watch | all_purpose | A | lure | breezy_windy_stained_reaction | 1 |
| watch | all_purpose | B | fly | cold_slow_or_front | 1 |
| watch | all_purpose | B | fly | dirty_vibration | 1 |
| watch | big_fish | A | fly | cold_slow_or_front | 1 |
| watch | big_fish | A | lure | breezy_windy_stained_reaction | 1 |
| watch | big_fish | A | lure | cold_slow_or_front | 1 |
| watch | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 1 |
| watch | big_fish | A | lure | warming_search | 1 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 1 |
| watch | big_fish | B | fly | cold_slow_or_front | 1 |
| watch | big_fish | B | fly | medium_confidence_archive | 1 |
| watch | big_fish | B | lure | cold_slow_or_front | 1 |
| watch | big_fish | B | lure | dirty_vibration | 1 |
| watch | big_fish | B | lure | warming_search | 1 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 6 |
| acceptable_fit | all_purpose | A | fly | medium_confidence_archive | 5 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 5 |
| acceptable_fit | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 3 |
| acceptable_fit | all_purpose | B | fly | cold_slow_or_front | 3 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 3 |
| acceptable_fit | big_fish | B | fly | warming_search | 3 |
| acceptable_fit | all_purpose | A | fly | cold_slow_or_front | 2 |
| acceptable_fit | all_purpose | A | fly | dirty_vibration | 2 |
| acceptable_fit | all_purpose | A | lure | medium_confidence_archive | 2 |
| acceptable_fit | all_purpose | B | fly | breezy_windy_stained_reaction | 2 |
| acceptable_fit | all_purpose | B | fly | dirty_vibration | 2 |
| acceptable_fit | all_purpose | B | fly | warming_search | 2 |
| acceptable_fit | all_purpose | B | lure | dirty_vibration | 2 |
| acceptable_fit | all_purpose | B | lure | warming_search | 2 |
| acceptable_fit | big_fish | B | fly | breezy_windy_stained_reaction | 2 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 2 |
| acceptable_fit | big_fish | B | fly | dirty_vibration | 2 |
| acceptable_fit | all_purpose | A | fly | breezy_windy_stained_reaction | 1 |
| acceptable_fit | all_purpose | A | lure | breezy_windy_stained_reaction | 1 |
| acceptable_fit | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 1 |
| acceptable_fit | all_purpose | A | lure | warming_search | 1 |
| acceptable_fit | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 1 |
| acceptable_fit | big_fish | A | fly | medium_confidence_archive | 1 |
| acceptable_fit | big_fish | A | fly | warming_search | 1 |
| acceptable_fit | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 1 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 1 |
| acceptable_fit | big_fish | B | lure | warming_search | 1 |
| strong_fit | all_purpose | B | lure | medium_confidence_archive | 15 |
| strong_fit | big_fish | A | lure | medium_confidence_archive | 15 |
| strong_fit | big_fish | B | lure | medium_confidence_archive | 15 |
| strong_fit | all_purpose | A | lure | medium_confidence_archive | 14 |
| strong_fit | big_fish | A | fly | medium_confidence_archive | 12 |
| strong_fit | big_fish | B | fly | medium_confidence_archive | 11 |
| strong_fit | all_purpose | A | fly | medium_confidence_archive | 8 |
| strong_fit | all_purpose | B | fly | medium_confidence_archive | 7 |
| strong_fit | all_purpose | A | lure | cold_slow_or_front | 6 |
| strong_fit | all_purpose | A | lure | dirty_vibration | 6 |
| strong_fit | all_purpose | B | lure | breezy_windy_stained_reaction | 6 |
| strong_fit | all_purpose | B | lure | cold_slow_or_front | 6 |
| strong_fit | big_fish | A | lure | dirty_vibration | 6 |
| strong_fit | big_fish | B | lure | breezy_windy_stained_reaction | 6 |
| strong_fit | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 6 |
| strong_fit | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 5 |
| strong_fit | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 5 |
| strong_fit | big_fish | A | fly | cold_slow_or_front | 5 |
| strong_fit | big_fish | A | lure | breezy_windy_stained_reaction | 5 |
| strong_fit | big_fish | A | lure | cold_slow_or_front | 5 |
| strong_fit | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 5 |

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
| Devils Lake prairie pike water<br>2025-01-26 stained all_purpose A | Paddle Tail Pike Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Devils Lake prairie pike water<br>2025-01-26 dirty big_fish A | Paddle Tail Pike Jig (lure_of_the_day, lure, score 198) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Devils Lake prairie pike water<br>2025-01-26 dirty big_fish A | Large Rabbit Strip Streamer (fly_of_the_day, fly, score 188) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Devils Lake prairie pike water<br>2025-01-26 stained big_fish A | Large Rabbit Strip Streamer (fly_of_the_day, fly, score 188) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake of the Woods pike water<br>2025-01-16 dirty big_fish B | Paddle Tail Pike Jig (lure_of_the_day, lure, score 182) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake of the Woods pike water<br>2025-01-16 stained big_fish B | Paddle Tail Pike Jig (lure_of_the_day, lure, score 182) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain pike water<br>2025-01-18 dirty big_fish A | Paddle Tail Pike Jig (lure_of_the_day, lure, score 182) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain pike water<br>2025-01-18 stained big_fish A | Paddle Tail Pike Jig (lure_of_the_day, lure, score 182) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake of the Woods pike water<br>2025-01-16 dirty big_fish B | Large Rabbit Strip Streamer (honorable_fly, fly, score 172) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain pike water<br>2025-01-18 dirty big_fish B | Large Rabbit Strip Streamer (honorable_fly, fly, score 172) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain pike water<br>2025-01-18 stained big_fish A | Large Rabbit Strip Streamer (fly_of_the_day, fly, score 172) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake of the Woods pike water<br>2025-01-16 stained big_fish B | Articulated Pike Streamer (fly_of_the_day, fly, score 166) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Devils Lake prairie pike water<br>2025-01-26 dirty big_fish B | Articulated Pike Streamer (honorable_fly, fly, score 166) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Devils Lake prairie pike water<br>2025-01-26 stained big_fish B | Articulated Pike Streamer (fly_of_the_day, fly, score 166) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain pike water<br>2025-01-18 dirty big_fish A | Articulated Pike Streamer (fly_of_the_day, fly, score 166) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain pike water<br>2025-01-18 stained big_fish B | Articulated Pike Streamer (honorable_fly, fly, score 166) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake of the Woods pike water<br>2025-01-16 dirty all_purpose A | Deceiver (fly_of_the_day, fly, score 164) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake of the Woods pike water<br>2025-01-16 dirty big_fish B | Large Jerkbait (honorable_lure, lure, score 164) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake of the Woods pike water<br>2025-01-16 stained all_purpose A | Deceiver (honorable_fly, fly, score 164) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Devils Lake prairie pike water<br>2025-01-26 dirty big_fish A | Rabbit-Strip Leech (honorable_fly, fly, score 164) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 144 | 67 | 47% |
| clear_subtle | 0 | 0 |  |
| dirty_vibration | 96 | 28 | 29% |
| heat_finesse | 0 | 0 |  |
| cold_slow | 48 | 27 | 56% |
| low_light_surface | 0 | 0 |  |
| calm_surface | 0 | 0 |  |
| Big Fish upside | 72 | 72 | 100% |
| All Purpose reliable/versatile | 72 | 58 | 81% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Paddle Tail Pike Jig [lure] (23), Large Bucktail Spinner [lure] (16), Large Rabbit Strip Streamer [fly] (15), Rabbit-Strip Leech [fly] (13), Articulated Baitfish Streamer [fly] (11), Articulated Pike Streamer [fly] (11), Large Jerkbait [lure] (11), Articulated Dungeon Streamer [fly] (9), Deceiver [fly] (9), Blade Bait [lure] (8), Large Paddle-Tail Swimbait [lure] (7), Casting Spoon [lure] (5) |
| All-purpose | Paddle Tail Pike Jig [lure] (10), Deceiver [fly] (9), Rabbit-Strip Leech [fly] (9), Blade Bait [lure] (8), Large Bucktail Spinner [lure] (7), Large Rabbit Strip Streamer [fly] (7), Articulated Baitfish Streamer [fly] (6), Casting Spoon [lure] (5) |
| Big-fish | Paddle Tail Pike Jig [lure] (13), Articulated Dungeon Streamer [fly] (9), Large Bucktail Spinner [lure] (9), Articulated Pike Streamer [fly] (8), Large Rabbit Strip Streamer [fly] (8), Large Jerkbait [lure] (7), Large Paddle-Tail Swimbait [lure] (7), Articulated Baitfish Streamer [fly] (5) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 7 | 7 | 0 | 0 | 0 |
| fly | 7 | 7 | 0 | 0 | 0 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 23/36 | 63.9% | big_fish:13, all_purpose:10 | A:12, B:11 | top:18, honorable:5 | dirty:9, stained:9, clear:5 | freshwater_lake_pond:23 | wind_reaction:23, dirty_vibration:18, cold_slow:10, warming_search:8 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 16/36 | 44.4% | big_fish:9, all_purpose:7 | B:10, A:6 | honorable:8, top:8 | clear:6, stained:6, dirty:4 | freshwater_lake_pond:16 | wind_reaction:16, dirty_vibration:10, open_water_search:6, cold_slow:5 |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 15/36 | 41.7% | big_fish:8, all_purpose:7 | A:10, B:5 | top:8, honorable:7 | clear:6, dirty:5, stained:4 | freshwater_lake_pond:15 | wind_reaction:15, dirty_vibration:9, cold_slow:7, open_water_search:5 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 13/36 | 36.1% | all_purpose:9, big_fish:4 | A:8, B:5 | top:7, honorable:6 | clear:5, dirty:5, stained:3 | freshwater_lake_pond:13 | wind_reaction:13, dirty_vibration:8, cold_slow:5, warming_search:5 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 11/36 | 30.6% | all_purpose:6, big_fish:5 | B:6, A:5 | honorable:10, top:1 | stained:6, dirty:3, clear:2 | freshwater_lake_pond:11 | wind_reaction:11, dirty_vibration:9, open_water_search:5, warming_search:4 |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 11/36 | 30.6% | big_fish:8, all_purpose:3 | B:8, A:3 | top:8, honorable:3 | dirty:5, stained:4, clear:2 | freshwater_lake_pond:11 | wind_reaction:11, dirty_vibration:9, warming_search:5, cold_slow:4 |
| Large Jerkbait<br>pike_jerkbait | lure | 11/36 | 30.6% | big_fish:7, all_purpose:4 | A:7, B:4 | honorable:7, top:4 | clear:5, dirty:3, stained:3 | freshwater_lake_pond:11 | wind_reaction:11, dirty_vibration:6, open_water_search:5, warming_search:4 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 9/36 | 25% | big_fish:9 | B:6, A:3 | top:5, honorable:4 | clear:3, dirty:3, stained:3 | freshwater_lake_pond:9 | wind_reaction:9, dirty_vibration:6, cold_slow:3, open_water_search:3 |
| Deceiver<br>deceiver | fly | 9/36 | 25% | all_purpose:9 | B:5, A:4 | honorable:6, top:3 | clear:3, dirty:3, stained:3 | freshwater_lake_pond:9 | wind_reaction:9, dirty_vibration:6, cold_slow:3, open_water_search:3 |
| Blade Bait<br>blade_bait | lure | 8/36 | 22.2% | all_purpose:8 | A:6, B:2 | honorable:5, top:3 | dirty:3, stained:3, clear:2 | freshwater_lake_pond:8 | wind_reaction:8, dirty_vibration:6, cold_slow:3, open_water_search:3 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 7/36 | 19.4% | big_fish:7 | B:4, A:3 | honorable:5, top:2 | clear:3, dirty:2, stained:2 | freshwater_lake_pond:7 | wind_reaction:7, dirty_vibration:4, open_water_search:3, cold_slow:2 |
| Casting Spoon<br>casting_spoon | lure | 5/36 | 13.9% | all_purpose:5 | B:3, A:2 | honorable:5 | clear:2, dirty:2, stained:1 | freshwater_lake_pond:5 | wind_reaction:5, dirty_vibration:3, warming_search:3, open_water_search:2 |
| Game Changer<br>game_changer | fly | 4/36 | 11.1% | all_purpose:2, big_fish:2 | A:3, B:1 | top:4 | clear:3, stained:1 | freshwater_lake_pond:4 | wind_reaction:4, open_water_search:3, dirty_vibration:1, warming_search:1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 2/36 | 5.6% | all_purpose:2 | B:2 | honorable:1, top:1 | clear:1, dirty:1 | freshwater_lake_pond:2 | cold_slow:2, wind_reaction:2, dirty_vibration:1 |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 23/144 (16%) | 18/72 (25%) | 5/72 (6.9%) | 23/72 (31.9%) | - | top actual >20%<br>lure side actual >20% |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 16/144 (11.1%) | 8/72 (11.1%) | 8/72 (11.1%) | 16/72 (22.2%) | - | lure side actual >20% |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 15/144 (10.4%) | 8/72 (11.1%) | 7/72 (9.7%) | - | 15/72 (20.8%) | fly side actual >20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 13/144 (9%) | 7/72 (9.7%) | 6/72 (8.3%) | - | 13/72 (18.1%) |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 11/144 (7.6%) | 1/72 (1.4%) | 10/72 (13.9%) | - | 11/72 (15.3%) |  |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 11/144 (7.6%) | 8/72 (11.1%) | 3/72 (4.2%) | - | 11/72 (15.3%) |  |
| Large Jerkbait<br>pike_jerkbait | lure | 11/144 (7.6%) | 4/72 (5.6%) | 7/72 (9.7%) | 11/72 (15.3%) | - |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 9/144 (6.3%) | 5/72 (6.9%) | 4/72 (5.6%) | - | 9/72 (12.5%) |  |
| Deceiver<br>deceiver | fly | 9/144 (6.3%) | 3/72 (4.2%) | 6/72 (8.3%) | - | 9/72 (12.5%) |  |
| Blade Bait<br>blade_bait | lure | 8/144 (5.6%) | 3/72 (4.2%) | 5/72 (6.9%) | 8/72 (11.1%) | - |  |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 7/144 (4.9%) | 2/72 (2.8%) | 5/72 (6.9%) | 7/72 (9.7%) | - |  |
| Casting Spoon<br>casting_spoon | lure | 5/144 (3.5%) | 0/72 (0%) | 5/72 (6.9%) | 5/72 (6.9%) | - |  |
| Game Changer<br>game_changer | fly | 4/144 (2.8%) | 4/72 (5.6%) | 0/72 (0%) | - | 4/72 (5.6%) |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 2/144 (1.4%) | 1/72 (1.4%) | 1/72 (1.4%) | 2/72 (2.8%) | - |  |

## Zero-Selected Eligible Profiles

None.

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

None.

## Overdominance Guardrail Summary

None.

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 23/144 (16%) | 18/72 (25%) | 5/72 (6.9%) | 23/72 (31.9%) | 23/36 (63.9%) | 18/36 (50%) / 5/36 (13.9%) | top actual>20%<br>lure side actual>20% |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 16/144 (11.1%) | 8/72 (11.1%) | 8/72 (11.1%) | 16/72 (22.2%) | 16/36 (44.4%) | 8/36 (22.2%) / 8/36 (22.2%) | lure side actual>20% |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 15/144 (10.4%) | 8/72 (11.1%) | 7/72 (9.7%) | 15/72 (20.8%) | 15/36 (41.7%) | 8/36 (22.2%) / 7/36 (19.4%) | fly side actual>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 1.57.
Average expanded finalist pool size: 2.67.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 79.
Rows/slots with expanded finalist pool size 1: 41.
Selected-tier singleton slots expanded above 1: 38.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 1.69 | 2.89 | 1 | 1 | 20 | 7 |
| fly/top | 1.47 | 2.86 | 1 | 1 | 21 | 8 |
| lure/honorable | 1.61 | 2.81 | 1 | 1 | 16 | 9 |
| lure/top | 1.50 | 2.14 | 1 | 1 | 22 | 17 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 114 |
| goal_or_priority_condition | 30 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_and_priority_condition | 114 |
| goal_or_priority_condition | 101 |
| credible_fallback | 9 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 25 |
| family_diversity_scarcity | 16 |

Representative expanded singleton finalist pools:
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__all_purpose__B lure/top: blade_bait (goal_or_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__all_purpose__B fly/top: deceiver (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__big_fish__B lure/honorable: large_bucktail_spinner (goal_and_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__all_purpose__B lure/honorable: pike_jig_and_plastic (goal_and_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B lure/honorable: large_profile_pike_swimbait (goal_or_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B fly/honorable: articulated_dungeon_streamer (goal_or_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__B lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__B fly/honorable: pike_bunny_streamer (goal_and_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__clear__big_fish__B lure/honorable: large_bucktail_spinner (goal_and_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__clear__big_fish__B fly/top: large_articulated_pike_streamer (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__all_purpose__A lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__all_purpose__B lure/honorable: casting_spoon (goal_and_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__big_fish__A lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__big_fish__B lure/honorable: large_profile_pike_swimbait (goal_or_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__big_fish__B fly/honorable: large_articulated_pike_streamer (goal_and_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__dirty__all_purpose__A lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B lure/top: blade_bait (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B fly/honorable: deceiver (goal_and_priority_condition; family_diversity_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 2.42 |
| Different-presentation close candidates | 1.49 |
| Different-family close candidates | 1.50 |
| Final expanded Set B pool | 1.79 |
| Same-family/same-presentation reintroduced | 5/72 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 24 |
| Coverage pool used | 1 |
| Average used coverage pool size | 2.00 |
| Singleton used coverage pools | 0 |
| Broad pool larger than narrowed pool | 1 |
| Broad pool same as narrowed pool | 0 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 0 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 23 |
| broad | 1 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| large_bucktail_spinner | 1 |
| pike_jerkbait | 1 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| pike_jerkbait | 1 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

None.

## Surface Safety Expansion Check

| Surface gate | Slots checked | Surface finalist IDs |
| --- | --- | --- |
| closed | 144 | 0 |
| caution | 0 | 0 |

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | northern_pike | large_spinner | spinner_vibration | mid<br>medium/fast | 2: baitfish, bluegill_perch | 2: clear, stained | 3: wind_reaction, dirty_vibration, open_water_search | 2: big_fish_upside, versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | northern_pike | streamer_pike_large | pike_bunny_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: wind_reaction, cover_ambush, cold_slow | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 8 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_deep | crankbait | bottom<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 2: open_water_search, cold_slow | 1: versatile_search | freshwater_lake_pond | false | 8 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | northern_pike | pike_swimbait | swimbait | mid<br>medium/slow | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, cover_ambush | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 8 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | northern_pike | pike_jig | pike_jig | bottom<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: cold_slow, dirty_vibration | 2: big_fish_upside, reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Deceiver<br>deceiver | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_baitfish | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 2: stained, dirty | 2: cold_slow, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Blade Bait<br>blade_bait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | blade_bait | blade_spoon | bottom<br>slow/medium | 1: baitfish | 3: clear, stained, dirty | 2: cold_slow, open_water_search | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | northern_pike | streamer_pike_large | big_articulated_streamer | mid<br>slow/medium | 1: baitfish | 2: stained, dirty | 2: wind_reaction, cover_ambush | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 6 |
| Casting Spoon<br>casting_spoon | lure | northern_pike, trout | spoon | blade_spoon | mid<br>medium | 1: baitfish | 2: clear, stained | 2: open_water_search, wind_reaction | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 6 |
| Large Jerkbait<br>pike_jerkbait | lure | northern_pike | pike_jerkbait | jerkbait | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: wind_reaction, open_water_search | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 6 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 11/36 | 11/36 | goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 9/36 | 9/36 | goal_tags>1 |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 6 | 11/36 | 11/36 | combined all-slot share>25%<br>broad per-slot share>20% |
| Deceiver<br>deceiver | fly | 7 | 9/36 | 9/36 | clear+stained+dirty clarity |
| Game Changer<br>game_changer | fly | 7 | 4/36 | 4/36 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 8 | 15/36 | 15/36 | combined all-slot share>25%<br>broad per-slot share>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 13/36 | 13/36 | goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25% |
| Blade Bait<br>blade_bait | lure | 7 | 8/36 | 0/0 | clear+stained+dirty clarity |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 2/36 | 1/24 | clear+stained+dirty clarity |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 9 | 16/36 | 16/36 | goal_tags>1<br>versatile_search+big_fish_upside<br>wind+dirty+big_fish_upside<br>wind+dirty+versatile_search<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Large Jerkbait<br>pike_jerkbait | lure | 6 | 11/36 | 11/36 | combined all-slot share>25% |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 8 | 7/36 | 7/36 | clear+stained+dirty clarity |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 8 | 23/36 | 23/36 | goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20% |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 8 | 23/36 (63.9%) | 23/36 (63.9%) | big_fish:13, all_purpose:10 | top:18, honorable:5 | wind_reaction:23, dirty_vibration:18, cold_slow:10, warming_search:8, open_water_search:5 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 9 | 16/36 (44.4%) | 16/36 (44.4%) | big_fish:9, all_purpose:7 | honorable:8, top:8 | wind_reaction:16, dirty_vibration:10, open_water_search:6, cold_slow:5, warming_search:5 |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 8 | 15/36 (41.7%) | 15/36 (41.7%) | big_fish:8, all_purpose:7 | top:8, honorable:7 | wind_reaction:15, dirty_vibration:9, cold_slow:7, open_water_search:5, warming_search:3 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 13/36 (36.1%) | 13/36 (36.1%) | all_purpose:9, big_fish:4 | top:7, honorable:6 | wind_reaction:13, dirty_vibration:8, cold_slow:5, warming_search:5, open_water_search:3 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 11/36 (30.6%) | 11/36 (30.6%) | all_purpose:6, big_fish:5 | honorable:10, top:1 | wind_reaction:11, dirty_vibration:9, open_water_search:5, warming_search:4, cold_slow:2 |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 6 | 11/36 (30.6%) | 11/36 (30.6%) | big_fish:8, all_purpose:3 | top:8, honorable:3 | wind_reaction:11, dirty_vibration:9, warming_search:5, cold_slow:4, open_water_search:2 |
| Large Jerkbait<br>pike_jerkbait | lure | 6 | 11/36 (30.6%) | 11/36 (30.6%) | big_fish:7, all_purpose:4 | honorable:7, top:4 | wind_reaction:11, dirty_vibration:6, open_water_search:5, warming_search:4, cold_slow:2 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 9/36 (25%) | 9/36 (25%) | big_fish:9 | top:5, honorable:4 | wind_reaction:9, dirty_vibration:6, cold_slow:3, open_water_search:3, warming_search:3 |
| Deceiver<br>deceiver | fly | 7 | 9/36 (25%) | 9/36 (25%) | all_purpose:9 | honorable:6, top:3 | wind_reaction:9, dirty_vibration:6, cold_slow:3, open_water_search:3, warming_search:3 |
| Blade Bait<br>blade_bait | lure | 7 | 8/36 (22.2%) | 0/0 | all_purpose:8 | honorable:5, top:3 | wind_reaction:8, dirty_vibration:6, cold_slow:3, open_water_search:3, warming_search:2 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 8 | 7/36 (19.4%) | 7/36 (19.4%) | big_fish:7 | honorable:5, top:2 | wind_reaction:7, dirty_vibration:4, open_water_search:3, cold_slow:2, warming_search:2 |
| Casting Spoon<br>casting_spoon | lure | 6 | 5/36 (13.9%) | 5/36 (13.9%) | all_purpose:5 | honorable:5 | wind_reaction:5, dirty_vibration:3, warming_search:3, open_water_search:2 |
| Game Changer<br>game_changer | fly | 7 | 4/36 (11.1%) | 4/36 (11.1%) | all_purpose:2, big_fish:2 | top:4 | wind_reaction:4, open_water_search:3, dirty_vibration:1, warming_search:1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 2/36 (5.6%) | 1/24 (4.2%) | all_purpose:2 | honorable:1, top:1 | cold_slow:2, wind_reaction:2, dirty_vibration:1 |

### Likely Cause Classification

None.

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Casting Spoon<br>casting_spoon | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: open_water_search, wind_reaction<br>goal 1: versatile_search | 36 | 5/36 (13.9%) | Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):5, Paddle Tail Pike Jig (top), Large Jerkbait (honorable):4, Paddle Tail Pike Jig (top), Blade Bait (honorable):3, Paddle Tail Pike Jig (top), Large Paddle-Tail Swimbait (honorable):3 | healthy / not underused |
| Weedless Spoon<br>weedless_spoon | lure | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 2: cover_ambush, wind_reaction<br>goal 2: reliable_action, big_fish_upside | 0 | 0/0 |  | scenario coverage |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 0 | 0/0 |  | scenario coverage |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: clear, stained<br>condition 3: wind_reaction, dirty_vibration, open_water_search<br>goal 2: big_fish_upside, versatile_search | 36 | 16/36 (44.4%) | Paddle Tail Pike Jig (top), Large Jerkbait (honorable):4, Paddle Tail Pike Jig (top), Blade Bait (honorable):3, Paddle Tail Pike Jig (top), Large Paddle-Tail Swimbait (honorable):3, Blade Bait (top), Large Jerkbait (honorable):2 | healthy / not underused |
| Pike Spinnerbait<br>pike_spinnerbait | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 3: wind_reaction, dirty_vibration, cover_ambush<br>goal 2: reliable_action, big_fish_upside | 0 | 0/0 |  | scenario coverage |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 2: open_water_search, cover_ambush<br>goal 1: big_fish_upside | 36 | 7/36 (19.4%) | Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):5, Paddle Tail Pike Jig (top), Large Jerkbait (honorable):4, Large Bucktail Spinner (top), Casting Spoon (honorable):3, Paddle Tail Pike Jig (top), Blade Bait (honorable):3 | healthy / not underused |
| Large Jerkbait<br>pike_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: wind_reaction, open_water_search<br>goal 1: big_fish_upside | 36 | 11/36 (30.6%) | Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):5, Large Bucktail Spinner (top), Casting Spoon (honorable):3, Paddle Tail Pike Jig (top), Blade Bait (honorable):3, Paddle Tail Pike Jig (top), Large Paddle-Tail Swimbait (honorable):3 | healthy / not underused |
| Pike Glide Bait<br>pike_glidebait | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: open_water_search, clear_subtle<br>goal 2: big_fish_upside, high_risk_high_reward | 0 | 0/0 |  | scenario coverage |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 2: cold_slow, dirty_vibration<br>goal 2: big_fish_upside, reliable_action | 36 | 23/36 (63.9%) | Large Bucktail Spinner (top), Casting Spoon (honorable):3, Blade Bait (top), Large Jerkbait (honorable):2, Large Bucktail Spinner (top), Large Paddle-Tail Swimbait (honorable):2, Deep-Diving Crankbait (top), Large Bucktail Spinner (honorable):1 | healthy / not underused |
| Large Pike Tube<br>large_pike_tube | lure | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 3: cold_slow, current_swing, cover_ambush<br>goal 2: big_fish_upside, reliable_action | 0 | 0/0 |  | scenario coverage |
| Large Pike Topwater<br>large_pike_topwater | lure | forage 2: surface_prey, baitfish<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 0 | 0/0 |  | scenario coverage |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 3: wind_reaction, cover_ambush, cold_slow<br>goal 1: big_fish_upside | 36 | 15/36 (41.7%) | Articulated Dungeon Streamer (top), Articulated Pike Streamer (honorable):3, Articulated Pike Streamer (top), Articulated Dungeon Streamer (honorable):3, Articulated Pike Streamer (top), Rabbit-Strip Leech (honorable):3, Game Changer (top), Articulated Baitfish Streamer (honorable):3 | healthy / not underused |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, cover_ambush<br>goal 1: big_fish_upside | 36 | 11/36 (30.6%) | Game Changer (top), Articulated Baitfish Streamer (honorable):3, Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):3, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):3, Rabbit-Strip Leech (top), Deceiver (honorable):3 | healthy / not underused |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: open_water_search, runoff_streamer<br>goal 2: versatile_search, big_fish_upside | 36 | 11/36 (30.6%) | Articulated Dungeon Streamer (top), Articulated Pike Streamer (honorable):3, Articulated Pike Streamer (top), Articulated Dungeon Streamer (honorable):3, Articulated Pike Streamer (top), Rabbit-Strip Leech (honorable):3, Rabbit-Strip Leech (top), Deceiver (honorable):3 | healthy / not underused |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 0 | 0/0 |  | scenario coverage |
| Deceiver<br>deceiver | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 1: versatile_search | 36 | 9/36 (25%) | Articulated Dungeon Streamer (top), Articulated Pike Streamer (honorable):3, Articulated Pike Streamer (top), Articulated Dungeon Streamer (honorable):3, Articulated Pike Streamer (top), Rabbit-Strip Leech (honorable):3, Game Changer (top), Articulated Baitfish Streamer (honorable):3 | healthy / not underused |
| Pike Flash Fly<br>pike_flash_fly | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 2: big_fish_upside, versatile_search | 0 | 0/0 |  | scenario coverage |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
None from audit alone.

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Bucktail Streamer (bucktail_baitfish_streamer), Inline Spinner (inline_spinner), Large Pike Topwater (large_pike_topwater), Large Pike Tube (large_pike_tube), Pike Flash Fly (pike_flash_fly), Pike Glide Bait (pike_glidebait), Pike Spinnerbait (pike_spinnerbait), Weedless Spoon (weedless_spoon)

### Probably selector problem, not catalog problem
None.

## Utilization Notes / Coverage Gaps

None.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Articulated Baitfish Streamer, Articulated Dungeon Streamer, Articulated Pike Streamer, Deceiver, Game Changer, Large Rabbit Strip Streamer, Rabbit-Strip Leech, Casting Spoon, Large Bucktail Spinner, Large Jerkbait, Large Paddle-Tail Swimbait, Paddle Tail Pike Jig |
| underused_home_window | None |
| no_home_window_coverage | None |
| over-dominant | None |
| probably okay niche profile | Baitfish Slider Fly, Bucktail Streamer, Deer Hair Slider, Foam Gurgler, Frog Fly, Pike Flash Fly, Popper Fly, Unweighted Baitfish Streamer, Inline Spinner, Large Pike Topwater, Large Pike Tube, Pike Glide Bait, Pike Spinnerbait, Weedless Spoon |

## Pike Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 15.3% | 11/36 | 11/36 | 11 | 11 | 30.6% | 6/18 | 5/18 | 8 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, cold_slow_or_front:4 | Articulated Dungeon Streamer (honorable), Articulated Pike Streamer (top):3, Articulated Dungeon Streamer (top), Articulated Pike Streamer (honorable):3, Articulated Pike Streamer (top), Rabbit-Strip Leech (honorable):2 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 12.5% | 9/36 | 9/36 | 9 | 9 | 25% | 0/18 | 9/18 | 11 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, cold_slow_or_front:4 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):3, Articulated Baitfish Streamer (honorable), Rabbit-Strip Leech (top):2, Articulated Pike Streamer (top), Rabbit-Strip Leech (honorable):2 |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 15.3% | 11/36 | 11/36 | 11 | 11 | 30.6% | 3/18 | 8/18 | 14 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, cold_slow_or_front:4 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):3, Articulated Baitfish Streamer (honorable), Rabbit-Strip Leech (top):2, Deceiver (honorable), Rabbit-Strip Leech (top):2 |
| Deceiver<br>deceiver | fly | 12.5% | 9/36 | 9/36 | 9 | 9 | 25% | 9/18 | 0/18 | 9 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, cold_slow_or_front:4 | Articulated Dungeon Streamer (honorable), Articulated Pike Streamer (top):3, Articulated Dungeon Streamer (top), Articulated Pike Streamer (honorable):3, Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):3 |
| Game Changer<br>game_changer | fly | 5.6% | 4/36 | 4/36 | 4 | 4 | 11.1% | 2/18 | 2/18 | 5 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, cold_slow_or_front:4 | Articulated Dungeon Streamer (honorable), Articulated Pike Streamer (top):3, Articulated Dungeon Streamer (top), Articulated Pike Streamer (honorable):3, Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):3 |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 20.8% | 15/36 | 15/36 | 15 | 15 | 41.7% | 7/18 | 8/18 | 20 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, cold_slow_or_front:4 | Articulated Dungeon Streamer (honorable), Articulated Pike Streamer (top):3, Articulated Dungeon Streamer (top), Articulated Pike Streamer (honorable):3, Articulated Baitfish Streamer (honorable), Rabbit-Strip Leech (top):2 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 18.1% | 13/36 | 13/36 | 13 | 13 | 36.1% | 9/18 | 4/18 | 10 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, cold_slow_or_front:4 | Articulated Dungeon Streamer (honorable), Articulated Pike Streamer (top):3, Articulated Dungeon Streamer (top), Articulated Pike Streamer (honorable):3, Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):3 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Foam Gurgler<br>foam_gurgler_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Frog Fly<br>frog_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Pike Flash Fly<br>pike_flash_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Popper Fly<br>popper_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Casting Spoon<br>casting_spoon | lure | 6.9% | 5/36 | 5/36 | 5 | 5 | 13.9% | 5/18 | 0/18 | 4 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, cold_slow_or_front:4 | Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):4, Paddle Tail Pike Jig (top), Large Jerkbait (honorable):4, Paddle Tail Pike Jig (top), Blade Bait (honorable):3 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 22.2% | 16/36 | 16/36 | 16 | 16 | 44.4% | 7/18 | 9/18 | 9 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, cold_slow_or_front:4 | Paddle Tail Pike Jig (top), Large Jerkbait (honorable):4, Paddle Tail Pike Jig (top), Blade Bait (honorable):3, Paddle Tail Pike Jig (top), Large Paddle-Tail Swimbait (honorable):3 |
| Large Jerkbait<br>pike_jerkbait | lure | 15.3% | 11/36 | 11/36 | 11 | 11 | 30.6% | 4/18 | 7/18 | 5 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, cold_slow_or_front:4 | Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):4, Large Bucktail Spinner (top), Casting Spoon (honorable):3, Paddle Tail Pike Jig (top), Blade Bait (honorable):3 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 9.7% | 7/36 | 7/36 | 7 | 7 | 19.4% | 0/18 | 7/18 | 3 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, cold_slow_or_front:4 | Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):4, Paddle Tail Pike Jig (top), Large Jerkbait (honorable):4, Large Bucktail Spinner (top), Casting Spoon (honorable):3 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 31.9% | 23/36 | 23/36 | 23 | 23 | 63.9% | 10/18 | 13/18 | 10 | healthy | activity neutral:24, suppressed:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:36<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, cold_slow_or_front:4 | Large Bucktail Spinner (top), Casting Spoon (honorable):3, Blade Bait (top), Large Jerkbait (honorable):2, Large Bucktail Spinner (top), Large Paddle-Tail Swimbait (honorable):2 |
| Inline Spinner<br>inline_spinner | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Large Pike Topwater<br>large_pike_topwater | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Large Pike Tube<br>large_pike_tube | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Pike Glide Bait<br>pike_glidebait | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Weedless Spoon<br>weedless_spoon | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |

## Equal-Or-Better Underused Signature Losses

None.

## Underused In Home Windows

None.

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
| wind_reaction | all_purpose | Paddle Tail Pike Jig [lure] (8), Rabbit-Strip Leech [fly] (7), Large Bucktail Spinner [lure] (5), Articulated Pike Streamer [fly] (3), Blade Bait [lure] (3) | Paddle Tail Pike Jig [lure] (10), Deceiver [fly] (9), Rabbit-Strip Leech [fly] (9), Blade Bait [lure] (8), Large Bucktail Spinner [lure] (7) |
| wind_reaction | big_fish | Paddle Tail Pike Jig [lure] (10), Articulated Dungeon Streamer [fly] (5), Articulated Pike Streamer [fly] (5), Large Rabbit Strip Streamer [fly] (5), Large Bucktail Spinner [lure] (3) | Paddle Tail Pike Jig [lure] (13), Articulated Dungeon Streamer [fly] (9), Large Bucktail Spinner [lure] (9), Articulated Pike Streamer [fly] (8), Large Rabbit Strip Streamer [fly] (8) |
| dirty_vibration | all_purpose | Paddle Tail Pike Jig [lure] (7), Rabbit-Strip Leech [fly] (5), Articulated Pike Streamer [fly] (3), Large Bucktail Spinner [lure] (3), Large Rabbit Strip Streamer [fly] (3) | Paddle Tail Pike Jig [lure] (8), Blade Bait [lure] (6), Deceiver [fly] (6), Rabbit-Strip Leech [fly] (6), Articulated Baitfish Streamer [fly] (5) |
| dirty_vibration | big_fish | Paddle Tail Pike Jig [lure] (8), Articulated Dungeon Streamer [fly] (4), Articulated Pike Streamer [fly] (3), Large Rabbit Strip Streamer [fly] (3), Large Bucktail Spinner [lure] (2) | Paddle Tail Pike Jig [lure] (10), Articulated Dungeon Streamer [fly] (6), Articulated Pike Streamer [fly] (6), Large Bucktail Spinner [lure] (6), Large Rabbit Strip Streamer [fly] (5) |
| clear_subtle | all_purpose | None | None |
| clear_subtle | big_fish | None | None |
| cold_slow | all_purpose | Paddle Tail Pike Jig [lure] (4), Large Rabbit Strip Streamer [fly] (2), Rabbit-Strip Leech [fly] (2), Articulated Pike Streamer [fly] (1), Blade Bait [lure] (1) | Paddle Tail Pike Jig [lure] (5), Large Rabbit Strip Streamer [fly] (4), Blade Bait [lure] (3), Deceiver [fly] (3), Rabbit-Strip Leech [fly] (3) |
| cold_slow | big_fish | Paddle Tail Pike Jig [lure] (4), Large Rabbit Strip Streamer [fly] (3), Articulated Pike Streamer [fly] (2), Large Bucktail Spinner [lure] (2), Articulated Dungeon Streamer [fly] (1) | Paddle Tail Pike Jig [lure] (5), Articulated Dungeon Streamer [fly] (3), Articulated Pike Streamer [fly] (3), Large Bucktail Spinner [lure] (3), Large Rabbit Strip Streamer [fly] (3) |
| warming_search | all_purpose | Paddle Tail Pike Jig [lure] (3), Rabbit-Strip Leech [fly] (3), Articulated Pike Streamer [fly] (2), Large Bucktail Spinner [lure] (2), Blade Bait [lure] (1) | Articulated Baitfish Streamer [fly] (3), Casting Spoon [lure] (3), Deceiver [fly] (3), Paddle Tail Pike Jig [lure] (3), Rabbit-Strip Leech [fly] (3) |
| warming_search | big_fish | Paddle Tail Pike Jig [lure] (4), Articulated Dungeon Streamer [fly] (3), Articulated Pike Streamer [fly] (2), Large Jerkbait [lure] (1), Large Paddle-Tail Swimbait [lure] (1) | Paddle Tail Pike Jig [lure] (5), Articulated Dungeon Streamer [fly] (3), Articulated Pike Streamer [fly] (3), Large Bucktail Spinner [lure] (3), Large Rabbit Strip Streamer [fly] (3) |
| heat_finesse | all_purpose | None | None |
| heat_finesse | big_fish | None | None |
| current_swing | all_purpose | None | None |
| current_swing | big_fish | None | None |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Lake of the Woods pike water<br>2025-01-16 dirty big_fish B | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Paddle Tail Pike Jig (182); Large Jerkbait (164); Articulated Baitfish Streamer (162); Large Rabbit Strip Streamer (172) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-01-16 stained big_fish B | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Paddle Tail Pike Jig (182); Large Paddle-Tail Swimbait (168); Articulated Pike Streamer (166); Articulated Dungeon Streamer (168) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-01-16 clear big_fish B | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+open_water_search, medium | Large Paddle-Tail Swimbait (168); Large Bucktail Spinner (178); Game Changer (156); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION |
| Lake of the Woods pike water<br>2025-01-16 dirty all_purpose B | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Paddle Tail Pike Jig (180); Casting Spoon (156); Rabbit-Strip Leech (146); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION |
| Lake of the Woods pike water<br>2025-01-16 stained all_purpose B | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Bucktail Spinner (170); Paddle Tail Pike Jig (180); Rabbit-Strip Leech (146); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION |
| Lake of the Woods pike water<br>2025-01-16 stained big_fish A | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Jerkbait (172); Large Bucktail Spinner (178); Game Changer (156); Articulated Baitfish Streamer (162) | WIND_NOT_ELEVATING_REACTION |
| Devils Lake prairie pike water<br>2025-01-26 stained big_fish B | 19.4-31.7F, 17 mph wind, 53.3% cloud, 0 in precip | suppressed, closed, wind_reaction+dirty_vibration+cold_slow, medium | Large Bucktail Spinner (162); Paddle Tail Pike Jig (198); Articulated Pike Streamer (166); Articulated Dungeon Streamer (168) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake Champlain pike water<br>2025-01-18 clear all_purpose A | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Paddle Tail Pike Jig (156); Large Jerkbait (136); Game Changer (132); Articulated Baitfish Streamer (130) | WIND_NOT_ELEVATING_REACTION |
| Lake Champlain pike water<br>2025-01-18 dirty all_purpose A | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Paddle Tail Pike Jig (180); Casting Spoon (140); Rabbit-Strip Leech (146); Articulated Baitfish Streamer (138) | WIND_NOT_ELEVATING_REACTION |
| Lake Champlain pike water<br>2025-01-18 stained big_fish B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Large Jerkbait (156); Paddle Tail Pike Jig (182); Articulated Dungeon Streamer (168); Articulated Pike Streamer (166) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-01-16 clear all_purpose A | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+open_water_search, medium | Large Bucktail Spinner (170); Casting Spoon (164); Game Changer (148); Large Rabbit Strip Streamer (144) | None |
| Lake of the Woods pike water<br>2025-01-16 clear all_purpose B | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+open_water_search, medium | Blade Bait (174); Large Jerkbait (152); Deceiver (164); Rabbit-Strip Leech (138) | None |
| Lake of the Woods pike water<br>2025-01-16 clear big_fish A | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+open_water_search, medium | Large Jerkbait (172); Paddle Tail Pike Jig (158); Large Rabbit Strip Streamer (164); Articulated Dungeon Streamer (160) | None |
| Lake of the Woods pike water<br>2025-01-16 dirty all_purpose A | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Bucktail Spinner (162); Blade Bait (174); Deceiver (164); Large Rabbit Strip Streamer (152) | None |
| Lake of the Woods pike water<br>2025-01-16 dirty big_fish A | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Bucktail Spinner (170); Large Paddle-Tail Swimbait (168); Articulated Dungeon Streamer (168); Articulated Pike Streamer (166) | None |
| Lake of the Woods pike water<br>2025-01-16 stained all_purpose A | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Jerkbait (152); Blade Bait (174); Large Rabbit Strip Streamer (152); Deceiver (164) | None |
| Devils Lake prairie pike water<br>2025-01-26 clear all_purpose A | 19.4-31.7F, 17 mph wind, 53.3% cloud, 0 in precip | suppressed, closed, wind_reaction+cold_slow, medium | Blade Bait (184); Paddle Tail Pike Jig (182); Rabbit-Strip Leech (164); Large Rabbit Strip Streamer (160) | None |
| Devils Lake prairie pike water<br>2025-01-26 clear all_purpose B | 19.4-31.7F, 17 mph wind, 53.3% cloud, 0 in precip | suppressed, closed, wind_reaction+cold_slow, medium | Deep-Diving Crankbait (158); Large Bucktail Spinner (154); Deceiver (148); Large Rabbit Strip Streamer (160) | None |
| Devils Lake prairie pike water<br>2025-01-26 clear big_fish A | 19.4-31.7F, 17 mph wind, 53.3% cloud, 0 in precip | suppressed, closed, wind_reaction+cold_slow, medium | Paddle Tail Pike Jig (174); Large Jerkbait (156); Large Rabbit Strip Streamer (180); Rabbit-Strip Leech (156) | None |
| Devils Lake prairie pike water<br>2025-01-26 clear big_fish B | 19.4-31.7F, 17 mph wind, 53.3% cloud, 0 in precip | suppressed, closed, wind_reaction+cold_slow, medium | Large Bucktail Spinner (162); Large Paddle-Tail Swimbait (152); Articulated Pike Streamer (158); Articulated Dungeon Streamer (160) | None |
| Devils Lake prairie pike water<br>2025-01-26 dirty all_purpose A | 19.4-31.7F, 17 mph wind, 53.3% cloud, 0 in precip | suppressed, closed, wind_reaction+dirty_vibration+cold_slow, medium | Paddle Tail Pike Jig (196); Blade Bait (174); Articulated Pike Streamer (146); Rabbit-Strip Leech (162) | None |
| Devils Lake prairie pike water<br>2025-01-26 dirty all_purpose B | 19.4-31.7F, 17 mph wind, 53.3% cloud, 0 in precip | suppressed, closed, wind_reaction+dirty_vibration+cold_slow, medium | Paddle Tail Pike Jig (196); Deep-Diving Crankbait (158); Large Rabbit Strip Streamer (168); Deceiver (148) | None |
| Devils Lake prairie pike water<br>2025-01-26 dirty big_fish A | 19.4-31.7F, 17 mph wind, 53.3% cloud, 0 in precip | suppressed, closed, wind_reaction+dirty_vibration+cold_slow, medium | Paddle Tail Pike Jig (198); Large Jerkbait (148); Large Rabbit Strip Streamer (188); Rabbit-Strip Leech (164) | None |
| Devils Lake prairie pike water<br>2025-01-26 dirty big_fish B | 19.4-31.7F, 17 mph wind, 53.3% cloud, 0 in precip | suppressed, closed, wind_reaction+dirty_vibration+cold_slow, medium | Paddle Tail Pike Jig (198); Large Bucktail Spinner (154); Articulated Dungeon Streamer (168); Articulated Pike Streamer (166) | None |
| Devils Lake prairie pike water<br>2025-01-26 stained all_purpose A | 19.4-31.7F, 17 mph wind, 53.3% cloud, 0 in precip | suppressed, closed, wind_reaction+dirty_vibration+cold_slow, medium | Paddle Tail Pike Jig (206); Blade Bait (184); Rabbit-Strip Leech (172); Deceiver (148) | None |
| Devils Lake prairie pike water<br>2025-01-26 stained all_purpose B | 19.4-31.7F, 17 mph wind, 53.3% cloud, 0 in precip | suppressed, closed, wind_reaction+dirty_vibration+cold_slow, medium | Paddle Tail Pike Jig (206); Large Bucktail Spinner (154); Large Rabbit Strip Streamer (168); Articulated Baitfish Streamer (138) | None |
| Devils Lake prairie pike water<br>2025-01-26 stained big_fish A | 19.4-31.7F, 17 mph wind, 53.3% cloud, 0 in precip | suppressed, closed, wind_reaction+dirty_vibration+cold_slow, medium | Paddle Tail Pike Jig (198); Large Paddle-Tail Swimbait (152); Large Rabbit Strip Streamer (188); Articulated Baitfish Streamer (146) | None |
| Lake Champlain pike water<br>2025-01-18 clear all_purpose B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Large Bucktail Spinner (154); Casting Spoon (148); Rabbit-Strip Leech (138); Deceiver (148) | None |
| Lake Champlain pike water<br>2025-01-18 clear big_fish A | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Large Paddle-Tail Swimbait (152); Large Jerkbait (156); Articulated Dungeon Streamer (160); Large Rabbit Strip Streamer (164) | None |
| Lake Champlain pike water<br>2025-01-18 clear big_fish B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Paddle Tail Pike Jig (158); Large Bucktail Spinner (162); Articulated Pike Streamer (158); Rabbit-Strip Leech (140) | None |
| Lake Champlain pike water<br>2025-01-18 dirty all_purpose B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Blade Bait (158); Large Jerkbait (128); Articulated Pike Streamer (146); Deceiver (148) | None |
| Lake Champlain pike water<br>2025-01-18 dirty big_fish A | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Paddle Tail Pike Jig (182); Large Bucktail Spinner (154); Articulated Pike Streamer (166); Rabbit-Strip Leech (148) | None |

## Known Coverage Gaps

- calm_low_light_surface: not naturally produced by completed archive rows.
- calm_bright_clear_subtle: not naturally produced by completed archive rows.
- heat_limited_finesse: not naturally produced by completed archive rows.
- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- river_elevated_runoff_current: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.
- adjacent_day_change: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
