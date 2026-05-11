# FinFindr SMB Daily-Picks Archive Audit
Generated: 2026-05-11T17:03:04.131Z

## Scope Summary

| Metric | Value |
| --- | --- |
| Archived weather scenarios | 3 |
| Expanded recommendation runs | 36 |
| Months | Jan, Feb |
| Regions | 3 |
| Fisheries | 3 |
| Water types | freshwater_lake_pond, freshwater_river |
| Clarity split | clear:12, stained:12, dirty:12 |
| Goal split | all_purpose:18, big_fish:18 |
| Skipped weather scenarios | 0 |
| JSONL output | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/daily-picks-archive-audit.smb.smoke.jsonl |

## Condition Bucket Coverage

| Bucket | Expanded runs |
| --- | --- |
| calm_low_light_surface | 0 |
| calm_bright_clear_subtle | 0 |
| breezy_windy_stained_reaction | 12 |
| dirty_vibration | 12 |
| cold_slow_or_front | 12 |
| warming_search | 24 |
| heat_limited_finesse | 0 |
| stable_pleasant_high_confidence | 0 |
| stable_pleasant_medium_confidence_archive | 0 |
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
| breezy_windy_stained_reaction | 2 | BIG_FISH_NOT_FAVORING_UPSIDE (2), WIND_NOT_ELEVATING_REACTION (2) |
| dirty_vibration | 3 | BIG_FISH_NOT_FAVORING_UPSIDE (2), WIND_NOT_ELEVATING_REACTION (1) |
| medium_confidence_archive | 10 | WIND_NOT_ELEVATING_REACTION (9), BIG_FISH_NOT_FAVORING_UPSIDE (6) |
| warming_search | 10 | WIND_NOT_ELEVATING_REACTION (9), BIG_FISH_NOT_FAVORING_UPSIDE (6) |

- WIND_NOT_ELEVATING_REACTION: 9
- BIG_FISH_NOT_FAVORING_UPSIDE: 6

- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Ned Rig (lure); Finesse Jig (lure); Feather Jig Leech (fly); Game Changer (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Suspending Jerkbait (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Spinnerbait (lure); Suspending Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Tube Jig (lure); Inline Spinner (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Spinnerbait (lure); Bladed Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Spinnerbait (lure); Bladed Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Carolina-Rigged Stick Worm (lure); Tube Jig (lure); Lead-Eye Leech (fly); Zonker Streamer (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Blade Bait (lure); Inline Spinner (lure); Clouser Minnow (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Spinnerbait (lure); Bladed Jig (lure); Articulated Dungeon Streamer (fly); Deceiver (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

None.

None.

## Temperature/Thermal Diagnostics

### Thermal Modes By Month/Region

| Month | Region | Thermal modes |
| --- | --- | --- |
| Jan | great_lakes_upper_midwest | cold_slow:1 |
| Jan | northeast | warming:1 |
| Feb | south_central | warming:1 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

None.

## Surface/Topwater Diagnostics

### Topwater Selection Summary

None.

### Shoulder-Season Topwater Selections

None.

## Set B Diagnostics

### Set B Overlap Cause Counts

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

| Kind | Cause | Lure | Fly | Total |
| --- | --- | --- | --- | --- |
| same_family_same_presentation | unavoidable_due_score_band | 0 | 2 | 2 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 1 | 1 |
| same_family_same_presentation | unavoidable_due_goal_condition_fit | 0 | 6 | 6 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 2 | 2 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 1 | 1 |

### Top True Set B Variety Examples

None.

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

None.

### Big-Fish Sides With No Explicit Big-Fish Score Reason

| Scenario | Side | Selected |
| --- | --- | --- |
| Lake Champlain SMB water<br>2025-01-18 clear B | lure | Medium-Diving Crankbait; Suspending Jerkbait |
| Lake Champlain SMB water<br>2025-01-18 stained B | lure | Spinnerbait; Suspending Jerkbait |
| Lake Champlain SMB water<br>2025-01-18 dirty B | lure | Spinnerbait; Bladed Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 clear A | lure | Finesse Jig; Texas-Rigged Soft-Plastic Craw |
| Upper Mississippi smallmouth river<br>2025-01-26 clear B | lure | Ned Rig; Tube Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 stained A | lure | Tube Jig; Medium-Diving Crankbait |
| Upper Mississippi smallmouth river<br>2025-01-26 stained B | lure | Suspending Jerkbait; Hair Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty A | lure | Medium-Diving Crankbait; Texas-Rigged Soft-Plastic Craw |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty B | lure | Ned Rig; Spinnerbait |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear B | lure | Tube Jig; Inline Spinner |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained B | lure | Spinnerbait; Bladed Jig |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 dirty B | lure | Spinnerbait; Bladed Jig |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Spinnerbait [lure] | 4 | Football Jig (4) | 18 |
| Bladed Jig [lure] | 3 | Football Jig (3) | 26 |
| Suspending Jerkbait [lure] | 2 | Football Jig (2) | 18 |
| Inline Spinner [lure] | 1 | Football Jig (1) | 30 |
| Medium-Diving Crankbait [lure] | 1 | Football Jig (1) | -4 |
| Tube Jig [lure] | 1 | Football Jig (1) | 14 |

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| Lake Champlain SMB water<br>2025-01-18 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (lure) | Ned Rig (152; goal:all_purpose:reliable_action:+18); Finesse Jig (152; goal:all_purpose:reliable_action:+18) | Inline Spinner (166, alt edge 14) | goal fit likely competed |
| Lake Champlain SMB water<br>2025-01-18 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Feather Jig Leech (152; condition_tag:warming_search:+16, goal:all_purpose:versatile_search:+12); Game Changer (132; goal:all_purpose:versatile_search:+12) | Zonker Streamer (154, alt edge 2) | goal fit likely competed |
| Lake Champlain SMB water<br>2025-01-18 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (154; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Rabbit-Strip Leech (140; goal:big_fish:big_fish_upside:+20) | Zonker Streamer (142, alt edge -12) | goal fit likely competed |
| Lake Champlain SMB water<br>2025-01-18 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (146; goal:big_fish:big_fish_upside:+20); Game Changer (140; goal:big_fish:big_fish_upside:+20) | Zonker Streamer (142, alt edge -4) | goal fit likely competed |
| Lake Champlain SMB water<br>2025-01-18 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (146; goal:big_fish:big_fish_upside:+20); Game Changer (140; goal:big_fish:big_fish_upside:+20) | Deceiver (136, alt edge -10) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (lure) | Carolina-Rigged Stick Worm (164; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Tube Jig (164; goal:all_purpose:reliable_action:+18) | Inline Spinner (160, alt edge -4) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (144; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Rabbit-Strip Leech (138; goal:all_purpose:reliable_action:+18) | Zonker Streamer (148, alt edge 4) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (148; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Rabbit-Strip Leech (140; goal:big_fish:big_fish_upside:+20) | Zonker Streamer (136, alt edge -12) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (140; goal:big_fish:big_fish_upside:+20); Game Changer (134; goal:big_fish:big_fish_upside:+20) | Zonker Streamer (136, alt edge -4) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| clear_subtle_wind_watch | 5 |
| dirty_vibration_acceptable | 2 |
| other_wind_watch | 1 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | Lake Champlain SMB water<br>2025-01-18 all_purpose clear A | warming_search<br>neutral | Ned Rig 152<br>Finesse Jig 152 |
| clear_subtle_wind_watch | Lake Champlain SMB water<br>2025-01-18 big_fish clear B | warming_search<br>neutral | Medium-Diving Crankbait 158<br>Suspending Jerkbait 136 |
| clear_subtle_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-02-15 all_purpose clear A | warming_search<br>active | Carolina-Rigged Stick Worm 164<br>Tube Jig 164 |
| clear_subtle_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-02-15 all_purpose clear B | warming_search<br>active | Blade Bait 152<br>Inline Spinner 160 |
| clear_subtle_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-02-15 big_fish clear B | warming_search<br>active | Tube Jig 146<br>Inline Spinner 130 |
| dirty_vibration_acceptable | Lake Champlain SMB water<br>2025-01-18 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Spinnerbait 142<br>Suspending Jerkbait 136 |
| dirty_vibration_acceptable | Dale Hollow / Tennessee highland reservoir<br>2025-02-15 big_fish stained B | breezy_windy_stained_reaction<br>active | Spinnerbait 136<br>Bladed Jig 130 |
| other_wind_watch | Lake Champlain SMB water<br>2025-01-18 big_fish dirty A | dirty_vibration<br>neutral | Medium-Diving Crankbait 158<br>Football Jig 154 |

## Guide Verdict Summary

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | A | fly | medium_confidence_archive | 11 |
| watch | big_fish | A | fly | warming_search | 8 |
| watch | big_fish | B | fly | medium_confidence_archive | 8 |
| watch | all_purpose | A | fly | medium_confidence_archive | 5 |
| watch | all_purpose | A | fly | warming_search | 5 |
| watch | big_fish | A | fly | dirty_vibration | 5 |
| watch | big_fish | B | fly | cold_slow_or_front | 5 |
| watch | all_purpose | A | lure | medium_confidence_archive | 4 |
| watch | all_purpose | A | lure | warming_search | 4 |
| watch | all_purpose | B | lure | medium_confidence_archive | 3 |
| watch | all_purpose | B | lure | warming_search | 3 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 3 |
| watch | big_fish | A | fly | cold_slow_or_front | 3 |
| watch | big_fish | A | lure | medium_confidence_archive | 3 |
| watch | big_fish | A | lure | warming_search | 3 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 3 |
| watch | big_fish | B | fly | dirty_vibration | 3 |
| watch | big_fish | B | fly | warming_search | 3 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 2 |
| watch | all_purpose | A | fly | dirty_vibration | 2 |
| watch | all_purpose | B | fly | medium_confidence_archive | 2 |
| watch | all_purpose | B | fly | warming_search | 2 |
| watch | all_purpose | B | lure | dirty_vibration | 2 |
| watch | all_purpose | B | fly | dirty_vibration | 1 |
| watch | big_fish | A | lure | breezy_windy_stained_reaction | 1 |
| watch | big_fish | A | lure | dirty_vibration | 1 |
| watch | big_fish | B | lure | medium_confidence_archive | 1 |
| watch | big_fish | B | lure | warming_search | 1 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 17 |
| acceptable_fit | big_fish | A | lure | medium_confidence_archive | 15 |
| acceptable_fit | big_fish | B | lure | warming_search | 11 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 10 |
| acceptable_fit | big_fish | A | lure | warming_search | 9 |
| acceptable_fit | big_fish | B | fly | warming_search | 9 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 6 |
| acceptable_fit | big_fish | A | lure | cold_slow_or_front | 6 |
| acceptable_fit | big_fish | B | lure | breezy_windy_stained_reaction | 6 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 6 |
| acceptable_fit | big_fish | B | lure | dirty_vibration | 6 |
| acceptable_fit | all_purpose | B | fly | warming_search | 5 |
| acceptable_fit | big_fish | A | lure | breezy_windy_stained_reaction | 5 |
| acceptable_fit | big_fish | A | lure | dirty_vibration | 5 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 4 |
| acceptable_fit | big_fish | A | fly | medium_confidence_archive | 4 |
| acceptable_fit | big_fish | A | fly | warming_search | 4 |
| acceptable_fit | all_purpose | A | lure | medium_confidence_archive | 3 |
| acceptable_fit | all_purpose | A | lure | warming_search | 3 |
| acceptable_fit | all_purpose | B | fly | breezy_windy_stained_reaction | 3 |
| acceptable_fit | all_purpose | B | lure | warming_search | 3 |
| acceptable_fit | big_fish | B | fly | breezy_windy_stained_reaction | 3 |
| acceptable_fit | big_fish | B | fly | dirty_vibration | 3 |
| acceptable_fit | all_purpose | A | lure | breezy_windy_stained_reaction | 2 |
| acceptable_fit | all_purpose | B | lure | breezy_windy_stained_reaction | 2 |
| acceptable_fit | all_purpose | B | lure | dirty_vibration | 2 |
| acceptable_fit | big_fish | A | fly | breezy_windy_stained_reaction | 2 |
| acceptable_fit | all_purpose | A | fly | medium_confidence_archive | 1 |
| acceptable_fit | all_purpose | A | fly | warming_search | 1 |
| acceptable_fit | all_purpose | A | lure | dirty_vibration | 1 |
| acceptable_fit | all_purpose | B | fly | cold_slow_or_front | 1 |
| acceptable_fit | all_purpose | B | fly | dirty_vibration | 1 |
| acceptable_fit | all_purpose | B | lure | cold_slow_or_front | 1 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 1 |
| strong_fit | all_purpose | A | fly | medium_confidence_archive | 12 |
| strong_fit | all_purpose | A | lure | medium_confidence_archive | 11 |
| strong_fit | all_purpose | B | lure | medium_confidence_archive | 11 |
| strong_fit | all_purpose | B | fly | medium_confidence_archive | 10 |
| strong_fit | all_purpose | A | fly | cold_slow_or_front | 6 |
| strong_fit | all_purpose | A | fly | warming_search | 6 |
| strong_fit | all_purpose | A | lure | cold_slow_or_front | 6 |
| strong_fit | all_purpose | B | lure | warming_search | 6 |
| strong_fit | all_purpose | A | lure | dirty_vibration | 5 |
| strong_fit | all_purpose | A | lure | warming_search | 5 |
| strong_fit | all_purpose | B | fly | cold_slow_or_front | 5 |
| strong_fit | all_purpose | B | fly | warming_search | 5 |
| strong_fit | all_purpose | B | lure | cold_slow_or_front | 5 |
| strong_fit | all_purpose | A | fly | breezy_windy_stained_reaction | 4 |
| strong_fit | all_purpose | A | fly | dirty_vibration | 4 |
| strong_fit | all_purpose | A | lure | breezy_windy_stained_reaction | 4 |
| strong_fit | all_purpose | B | fly | dirty_vibration | 4 |
| strong_fit | all_purpose | B | lure | breezy_windy_stained_reaction | 4 |

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
| Upper Mississippi smallmouth river<br>2025-01-26 clear all_purpose A | Tube Jig (lure_of_the_day, lure, score 212) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Mississippi smallmouth river<br>2025-01-26 clear all_purpose A | Muddler Minnow (fly_of_the_day, fly, score 196) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Mississippi smallmouth river<br>2025-01-26 stained all_purpose A | Tube Jig (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Mississippi smallmouth river<br>2025-01-26 stained all_purpose A | Muddler Minnow (fly_of_the_day, fly, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty all_purpose B | Sculpin Streamer (honorable_fly, fly, score 180) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty all_purpose A | Suspending Jerkbait (lure_of_the_day, lure, score 168) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-01-18 stained all_purpose A | Inline Spinner (honorable_lure, lure, score 166) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained all_purpose A | Suspending Jerkbait (honorable_lure, lure, score 160) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-01-18 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 158) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-01-18 stained all_purpose A | Zonker Streamer (fly_of_the_day, fly, score 154) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 dirty all_purpose A | Inline Spinner (honorable_lure, lure, score 152) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained all_purpose B | Zonker Streamer (fly_of_the_day, fly, score 148) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-01-18 dirty all_purpose A | Deceiver (fly_of_the_day, fly, score 148) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-01-18 stained all_purpose B | Deceiver (fly_of_the_day, fly, score 148) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-01-18 dirty all_purpose B | Zonker Streamer (fly_of_the_day, fly, score 146) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 dirty all_purpose A | Deceiver (fly_of_the_day, fly, score 142) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained all_purpose A | Deceiver (fly_of_the_day, fly, score 142) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 dirty all_purpose B | Zonker Streamer (fly_of_the_day, fly, score 140) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-01-18 clear all_purpose B | Suspending Jerkbait (lure_of_the_day, lure, score 166) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-01-18 clear all_purpose B | Inline Spinner (honorable_lure, lure, score 166) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 144 | 50 | 35% |
| clear_subtle | 16 | 11 | 69% |
| dirty_vibration | 96 | 10 | 10% |
| heat_finesse | 0 | 0 |  |
| cold_slow | 48 | 32 | 67% |
| low_light_surface | 0 | 0 |  |
| calm_surface | 0 | 0 |  |
| Big Fish upside | 72 | 38 | 53% |
| All Purpose reliable/versatile | 72 | 65 | 90% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Medium-Diving Crankbait [lure] (12), Rabbit-Strip Leech [fly] (12), Game Changer [fly] (10), Suspending Jerkbait [lure] (10), Inline Spinner [lure] (9), Articulated Dungeon Streamer [fly] (8), Zonker Streamer [fly] (8), Football Jig [lure] (6), Tube Jig [lure] (6), Articulated Baitfish Streamer [fly] (5), Bladed Jig [lure] (5), Clouser Minnow [fly] (5) |
| All-purpose | Inline Spinner [lure] (7), Suspending Jerkbait [lure] (7), Zonker Streamer [fly] (6), Clouser Minnow [fly] (5), Deceiver [fly] (4), Finesse Jig [lure] (4), Lead-Eye Leech [fly] (4), Medium-Diving Crankbait [lure] (4) |
| Big-fish | Game Changer [fly] (9), Rabbit-Strip Leech [fly] (9), Articulated Dungeon Streamer [fly] (8), Medium-Diving Crankbait [lure] (8), Football Jig [lure] (6), Spinnerbait [lure] (5), Articulated Baitfish Streamer [fly] (4), Bladed Jig [lure] (3) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 19 | 14 | 5 | 0 | 0 |
| fly | 17 | 14 | 3 | 0 | 0 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 12/36 | 33.3% | big_fish:8, all_purpose:4 | A:8, B:4 | top:8, honorable:4 | dirty:5, stained:5, clear:2 | freshwater_lake_pond:10, freshwater_river:2 | wind_reaction:12, dirty_vibration:10, warming_search:10, cold_slow:2 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 12/36 | 33.3% | big_fish:9, all_purpose:3 | A:8, B:4 | honorable:11, top:1 | clear:4, dirty:4, stained:4 | freshwater_lake_pond:9, freshwater_river:3 | wind_reaction:12, warming_search:9, dirty_vibration:8, cold_slow:3 |
| Game Changer<br>game_changer | fly | 10/36 | 27.8% | big_fish:9, all_purpose:1 | A:6, B:4 | honorable:8, top:2 | clear:4, dirty:3, stained:3 | freshwater_lake_pond:7, freshwater_river:3 | wind_reaction:10, warming_search:7, dirty_vibration:6, cold_slow:3 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 10/36 | 27.8% | all_purpose:7, big_fish:3 | B:7, A:3 | top:6, honorable:4 | stained:5, dirty:3, clear:2 | freshwater_lake_pond:7, freshwater_river:3 | wind_reaction:10, dirty_vibration:8, warming_search:7, cold_slow:3 |
| Inline Spinner<br>inline_spinner | lure | 9/36 | 25% | all_purpose:7, big_fish:2 | A:5, B:4 | honorable:7, top:2 | clear:4, stained:3, dirty:2 | freshwater_lake_pond:8, freshwater_river:1 | wind_reaction:9, warming_search:8, dirty_vibration:5, cold_slow:1 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8/36 | 22.2% | big_fish:8 | B:5, A:3 | top:8 | dirty:3, stained:3, clear:2 | freshwater_lake_pond:6, freshwater_river:2 | wind_reaction:8, dirty_vibration:6, warming_search:6, cold_slow:2 |
| Zonker Streamer<br>zonker_streamer | fly | 8/36 | 22.2% | all_purpose:6, big_fish:2 | A:4, B:4 | top:6, honorable:2 | clear:4, dirty:2, stained:2 | freshwater_lake_pond:8 | warming_search:8, wind_reaction:8, dirty_vibration:4 |
| Tube Jig<br>tube_jig | lure | 6/36 | 16.7% | all_purpose:3, big_fish:3 | A:4, B:2 | top:4, honorable:2 | clear:4, stained:2 | freshwater_river:4, freshwater_lake_pond:2 | wind_reaction:6, cold_slow:4, clear_subtle:2, dirty_vibration:2 |
| Football Jig<br>football_jig | lure | 6/24 | 25% | big_fish:6 | A:6 | honorable:4, top:2 | clear:2, dirty:2, stained:2 | freshwater_lake_pond:6 | warming_search:6, wind_reaction:6, dirty_vibration:4 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 5/36 | 13.9% | big_fish:4, all_purpose:1 | B:4, A:1 | top:3, honorable:2 | dirty:2, stained:2, clear:1 | freshwater_lake_pond:4, freshwater_river:1 | wind_reaction:5, dirty_vibration:4, warming_search:4, clear_subtle:1 |
| Bladed Jig<br>bladed_jig | lure | 5/36 | 13.9% | big_fish:3, all_purpose:2 | B:4, A:1 | honorable:4, top:1 | dirty:3, stained:2 | freshwater_lake_pond:4, freshwater_river:1 | dirty_vibration:5, wind_reaction:5, warming_search:4, cold_slow:1 |
| Clouser Minnow<br>clouser_minnow | fly | 5/36 | 13.9% | all_purpose:5 | B:5 | honorable:4, top:1 | clear:2, stained:2, dirty:1 | freshwater_lake_pond:5 | warming_search:5, wind_reaction:5, dirty_vibration:3 |
| Deceiver<br>deceiver | fly | 5/36 | 13.9% | all_purpose:4, big_fish:1 | A:3, B:2 | top:4, honorable:1 | dirty:3, stained:2 | freshwater_lake_pond:5 | dirty_vibration:5, warming_search:5, wind_reaction:5 |
| Finesse Jig<br>finesse_jig | lure | 5/36 | 13.9% | all_purpose:4, big_fish:1 | A:3, B:2 | honorable:3, top:2 | clear:3, dirty:1, stained:1 | freshwater_river:4, freshwater_lake_pond:1 | wind_reaction:5, cold_slow:4, clear_subtle:2, dirty_vibration:2 |
| Spinnerbait<br>spinnerbait | lure | 5/36 | 13.9% | big_fish:5 | B:5 | top:4, honorable:1 | dirty:3, stained:2 | freshwater_lake_pond:4, freshwater_river:1 | dirty_vibration:5, wind_reaction:5, warming_search:4, cold_slow:1 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 4/36 | 11.1% | all_purpose:4 | A:2, B:2 | honorable:2, top:2 | clear:2, dirty:1, stained:1 | freshwater_lake_pond:2, freshwater_river:2 | wind_reaction:4, cold_slow:2, dirty_vibration:2, warming_search:2 |
| Ned Rig<br>ned_rig | lure | 4/36 | 11.1% | all_purpose:2, big_fish:2 | B:3, A:1 | top:4 | clear:3, dirty:1 | freshwater_river:3, freshwater_lake_pond:1 | wind_reaction:4, cold_slow:3, clear_subtle:2, dirty_vibration:1 |
| Blade Bait<br>blade_bait | lure | 3/36 | 8.3% | all_purpose:3 | B:2, A:1 | honorable:2, top:1 | dirty:2, clear:1 | freshwater_lake_pond:2, freshwater_river:1 | wind_reaction:3, dirty_vibration:2, warming_search:2, cold_slow:1 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 3/36 | 8.3% | all_purpose:3 | A:3 | honorable:2, top:1 | dirty:2, stained:1 | freshwater_river:2, freshwater_lake_pond:1 | dirty_vibration:3, wind_reaction:3, cold_slow:2, warming_search:1 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 3/36 | 8.3% | big_fish:2, all_purpose:1 | A:2, B:1 | honorable:3 | clear:2, dirty:1 | freshwater_river:3 | cold_slow:3, wind_reaction:3, clear_subtle:2, dirty_vibration:1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 3/12 | 25% | all_purpose:2, big_fish:1 | B:2, A:1 | honorable:2, top:1 | clear:2, stained:1 | freshwater_river:3 | cold_slow:3, wind_reaction:3, clear_subtle:2, dirty_vibration:1 |
| Muddler Minnow<br>muddler_sculpin | fly | 3/12 | 25% | all_purpose:3 | A:3 | top:2, honorable:1 | clear:1, dirty:1, stained:1 | freshwater_river:3 | cold_slow:3, wind_reaction:3, dirty_vibration:2, clear_subtle:1 |
| Sculpin Streamer<br>sculpin_streamer | fly | 3/12 | 25% | all_purpose:3 | B:3 | top:2, honorable:1 | clear:1, dirty:1, stained:1 | freshwater_river:3 | cold_slow:3, wind_reaction:3, dirty_vibration:2, clear_subtle:1 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 2/24 | 8.3% | all_purpose:2 | A:1, B:1 | honorable:1, top:1 | clear:1, dirty:1 | freshwater_lake_pond:2 | warming_search:2, wind_reaction:2, dirty_vibration:1 |
| Sculpzilla<br>sculpzilla | fly | 2/12 | 16.7% | big_fish:2 | A:1, B:1 | top:2 | dirty:1, stained:1 | freshwater_river:2 | cold_slow:2, dirty_vibration:2, wind_reaction:2 |
| Feather Jig Leech<br>feather_jig_leech | fly | 1/36 | 2.8% | all_purpose:1 | A:1 | top:1 | clear:1 | freshwater_lake_pond:1 | warming_search:1, wind_reaction:1 |
| Lipless Crankbait<br>lipless_crankbait | lure | 1/36 | 2.8% | all_purpose:1 | A:1 | top:1 | stained:1 | freshwater_lake_pond:1 | dirty_vibration:1, warming_search:1, wind_reaction:1 |
| Hair Jig<br>hair_jig | lure | 1/12 | 8.3% | big_fish:1 | B:1 | honorable:1 | stained:1 | freshwater_river:1 | cold_slow:1, dirty_vibration:1, wind_reaction:1 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 0/36 | 0% |  |  |  |  |  |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 0/36 | 0% |  |  |  |  |  |  |
| Shaky-Head Worm<br>shaky_head_worm | lure | 0/36 | 0% |  |  |  |  |  |  |
| Swim Jig<br>swim_jig | lure | 0/36 | 0% |  |  |  |  |  |  |
| Woolly Bugger<br>woolly_bugger | fly | 0/36 | 0% |  |  |  |  |  |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 0/24 | 0% |  |  |  |  |  |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 0/12 | 0% |  |  |  |  |  |  |
| Conehead Streamer<br>conehead_streamer | fly | 0/12 | 0% |  |  |  |  |  |  |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 12/144 (8.3%) | 1/72 (1.4%) | 11/72 (15.3%) | - | 12/72 (16.7%) |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 12/144 (8.3%) | 8/72 (11.1%) | 4/72 (5.6%) | 12/72 (16.7%) | - |  |
| Game Changer<br>game_changer | fly | 10/144 (6.9%) | 2/72 (2.8%) | 8/72 (11.1%) | - | 10/72 (13.9%) |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 10/144 (6.9%) | 6/72 (8.3%) | 4/72 (5.6%) | 10/72 (13.9%) | - |  |
| Inline Spinner<br>inline_spinner | lure | 9/144 (6.3%) | 2/72 (2.8%) | 7/72 (9.7%) | 9/72 (12.5%) | - |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8/144 (5.6%) | 8/72 (11.1%) | 0/72 (0%) | - | 8/72 (11.1%) |  |
| Zonker Streamer<br>zonker_streamer | fly | 8/144 (5.6%) | 6/72 (8.3%) | 2/72 (2.8%) | - | 8/72 (11.1%) |  |
| Football Jig<br>football_jig | lure | 6/144 (4.2%) | 2/72 (2.8%) | 4/72 (5.6%) | 6/72 (8.3%) | - |  |
| Tube Jig<br>tube_jig | lure | 6/144 (4.2%) | 4/72 (5.6%) | 2/72 (2.8%) | 6/72 (8.3%) | - |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 5/144 (3.5%) | 3/72 (4.2%) | 2/72 (2.8%) | - | 5/72 (6.9%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 5/144 (3.5%) | 1/72 (1.4%) | 4/72 (5.6%) | - | 5/72 (6.9%) |  |
| Deceiver<br>deceiver | fly | 5/144 (3.5%) | 4/72 (5.6%) | 1/72 (1.4%) | - | 5/72 (6.9%) |  |
| Bladed Jig<br>bladed_jig | lure | 5/144 (3.5%) | 1/72 (1.4%) | 4/72 (5.6%) | 5/72 (6.9%) | - |  |
| Finesse Jig<br>finesse_jig | lure | 5/144 (3.5%) | 2/72 (2.8%) | 3/72 (4.2%) | 5/72 (6.9%) | - |  |
| Spinnerbait<br>spinnerbait | lure | 5/144 (3.5%) | 4/72 (5.6%) | 1/72 (1.4%) | 5/72 (6.9%) | - |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 4/144 (2.8%) | 2/72 (2.8%) | 2/72 (2.8%) | - | 4/72 (5.6%) |  |
| Ned Rig<br>ned_rig | lure | 4/144 (2.8%) | 4/72 (5.6%) | 0/72 (0%) | 4/72 (5.6%) | - |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 3/144 (2.1%) | 1/72 (1.4%) | 2/72 (2.8%) | - | 3/72 (4.2%) |  |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 3/144 (2.1%) | 1/72 (1.4%) | 2/72 (2.8%) | - | 3/72 (4.2%) |  |
| Muddler Minnow<br>muddler_sculpin | fly | 3/144 (2.1%) | 2/72 (2.8%) | 1/72 (1.4%) | - | 3/72 (4.2%) |  |
| Sculpin Streamer<br>sculpin_streamer | fly | 3/144 (2.1%) | 2/72 (2.8%) | 1/72 (1.4%) | - | 3/72 (4.2%) |  |
| Blade Bait<br>blade_bait | lure | 3/144 (2.1%) | 1/72 (1.4%) | 2/72 (2.8%) | 3/72 (4.2%) | - |  |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 3/144 (2.1%) | 0/72 (0%) | 3/72 (4.2%) | 3/72 (4.2%) | - |  |
| Sculpzilla<br>sculpzilla | fly | 2/144 (1.4%) | 2/72 (2.8%) | 0/72 (0%) | - | 2/72 (2.8%) |  |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 2/144 (1.4%) | 1/72 (1.4%) | 1/72 (1.4%) | 2/72 (2.8%) | - |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 1/144 (0.7%) | 1/72 (1.4%) | 0/72 (0%) | - | 1/72 (1.4%) |  |
| Hair Jig<br>hair_jig | lure | 1/144 (0.7%) | 0/72 (0%) | 1/72 (1.4%) | 1/72 (1.4%) | - |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 1/144 (0.7%) | 1/72 (1.4%) | 0/72 (0%) | 1/72 (1.4%) | - |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | - | 0/72 (0%) |  |
| Conehead Streamer<br>conehead_streamer | fly | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | - | 0/72 (0%) |  |
| Woolly Bugger<br>woolly_bugger | fly | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | - | 0/72 (0%) |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | 0/72 (0%) | - |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | 0/72 (0%) | - |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | 0/72 (0%) | - |  |
| Shaky-Head Worm<br>shaky_head_worm | lure | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | 0/72 (0%) | - |  |
| Swim Jig<br>swim_jig | lure | 0/144 (0%) | 0/72 (0%) | 0/72 (0%) | 0/72 (0%) | - |  |

## Zero-Selected Eligible Profiles

| Profile | Gear | Candidate opportunities | Top available contexts | Top competing winners |
| --- | --- | --- | --- | --- |
| Woolly Bugger<br>woolly_bugger | fly | 36 | all_purpose / clear / freshwater_lake_pond / warming_search:4, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:4, big_fish / clear / freshwater_lake_pond / warming_search:4 | Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):6, Articulated Baitfish Streamer (top), Game Changer (honorable):3, Zonker Streamer (top), Clouser Minnow (honorable):3, Deceiver (top), Rabbit-Strip Leech (honorable):2 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 36 | all_purpose / clear / freshwater_lake_pond / warming_search:4, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:4, big_fish / clear / freshwater_lake_pond / warming_search:4 | Medium-Diving Crankbait (top), Football Jig (honorable):4, Spinnerbait (top), Bladed Jig (honorable):3, Suspending Jerkbait (top), Blade Bait (honorable):2, Tube Jig (top), Inline Spinner (honorable):2 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 36 | all_purpose / clear / freshwater_lake_pond / warming_search:4, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:4, big_fish / clear / freshwater_lake_pond / warming_search:4 | Medium-Diving Crankbait (top), Football Jig (honorable):4, Spinnerbait (top), Bladed Jig (honorable):3, Suspending Jerkbait (top), Blade Bait (honorable):2, Tube Jig (top), Inline Spinner (honorable):2 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 36 | all_purpose / clear / freshwater_lake_pond / warming_search:4, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:4, big_fish / clear / freshwater_lake_pond / warming_search:4 | Medium-Diving Crankbait (top), Football Jig (honorable):4, Spinnerbait (top), Bladed Jig (honorable):3, Suspending Jerkbait (top), Blade Bait (honorable):2, Tube Jig (top), Inline Spinner (honorable):2 |
| Swim Jig<br>swim_jig | lure | 36 | all_purpose / clear / freshwater_lake_pond / warming_search:4, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:4, big_fish / clear / freshwater_lake_pond / warming_search:4 | Medium-Diving Crankbait (top), Football Jig (honorable):4, Spinnerbait (top), Bladed Jig (honorable):3, Suspending Jerkbait (top), Blade Bait (honorable):2, Tube Jig (top), Inline Spinner (honorable):2 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 24 | all_purpose / clear / freshwater_lake_pond / warming_search:4, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:4, big_fish / clear / freshwater_lake_pond / warming_search:4 | Medium-Diving Crankbait (top), Football Jig (honorable):4, Spinnerbait (top), Bladed Jig (honorable):3, Blade Bait (top), Inline Spinner (honorable):1, Bladed Jig (top), Suspending Jerkbait (honorable):1 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 12 | all_purpose / clear / freshwater_river / cold_slow_or_front:2, all_purpose / dirty / freshwater_river / dirty_vibration:2, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:2, big_fish / clear / freshwater_river / cold_slow_or_front:2 | Articulated Dungeon Streamer (top), Game Changer (honorable):1, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):1, Crawfish Streamer (top), Articulated Baitfish Streamer (honorable):1, Game Changer (top), Rabbit-Strip Leech (honorable):1 |
| Conehead Streamer<br>conehead_streamer | fly | 12 | all_purpose / clear / freshwater_river / cold_slow_or_front:2, all_purpose / dirty / freshwater_river / dirty_vibration:2, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:2, big_fish / clear / freshwater_river / cold_slow_or_front:2 | Articulated Dungeon Streamer (top), Game Changer (honorable):1, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):1, Crawfish Streamer (top), Articulated Baitfish Streamer (honorable):1, Game Changer (top), Rabbit-Strip Leech (honorable):1 |

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

None.

## Overdominance Guardrail Summary

None.

## Slot Utilization Guardrails

None.

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.79.
Average expanded finalist pool size: 4.66.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 45.
Rows/slots with expanded finalist pool size 1: 22.
Selected-tier singleton slots expanded above 1: 23.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.28 | 3.19 | 1 | 1 | 16 | 7 |
| fly/top | 2.33 | 4.06 | 1 | 1 | 14 | 10 |
| lure/honorable | 3.22 | 5.17 | 1 | 1 | 8 | 2 |
| lure/top | 3.33 | 6.22 | 1 | 1 | 7 | 3 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_or_priority_condition | 82 |
| goal_and_priority_condition | 56 |
| credible_fallback | 6 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 120 |
| goal_and_priority_condition | 56 |
| credible_fallback | 28 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 13 |
| family_diversity_scarcity | 9 |

Representative expanded singleton finalist pools:
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__big_fish__B lure/top: medium_diving_crankbait (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__big_fish__B fly/top: articulated_dungeon_streamer (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__all_purpose__B fly/top: clouser_minnow (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__big_fish__B fly/top: articulated_baitfish_streamer (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B fly/top: clouser_minnow (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__big_fish__B fly/top: articulated_dungeon_streamer (goal_or_priority_condition; hard_gated_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__all_purpose__B lure/honorable: texas_rigged_soft_plastic_craw (goal_and_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__all_purpose__B fly/honorable: lead_eye_leech (goal_and_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__big_fish__B lure/honorable: tube_jig (goal_or_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__stained__all_purpose__B fly/honorable: crawfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__stained__big_fish__B fly/top: articulated_dungeon_streamer (goal_or_priority_condition; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__all_purpose__B fly/top: clouser_minnow (goal_or_priority_condition; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__big_fish__B lure/top: tube_jig (credible_fallback; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__all_purpose__B fly/top: clouser_minnow (goal_or_priority_condition; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__big_fish__B lure/top: tube_jig (credible_fallback; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__big_fish__B fly/top: articulated_baitfish_streamer (goal_or_priority_condition; hard_gated_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 6.39 |
| Different-presentation close candidates | 2.40 |
| Different-family close candidates | 2.93 |
| Final expanded Set B pool | 3.03 |
| Same-family/same-presentation reintroduced | 8/72 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 24 |
| Coverage pool used | 4 |
| Average used coverage pool size | 4.50 |
| Singleton used coverage pools | 0 |
| Broad pool larger than narrowed pool | 3 |
| Broad pool same as narrowed pool | 1 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 1 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 20 |
| broad | 4 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| inline_spinner | 4 |
| bladed_jig | 3 |
| lipless_crankbait | 3 |
| spinnerbait | 3 |
| suspending_jerkbait | 3 |
| medium_diving_crankbait | 2 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| bladed_jig | 1 |
| inline_spinner | 1 |
| medium_diving_crankbait | 1 |
| spinnerbait | 1 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

- wi_upper_mississippi__2025-01-26__freshwater_river__dirty__big_fish__B: Spinnerbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, suspending_jerkbait

## Surface Safety Expansion Check

| Surface gate | Slots checked | Surface finalist IDs |
| --- | --- | --- |
| closed | 144 | 0 |
| caution | 0 | 0 |

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sculpin Streamer<br>sculpin_streamer | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: current_swing, cold_slow, runoff_streamer | 1: reliable_action | freshwater_river | false | 9 |
| Ned Rig<br>ned_rig | lure | largemouth_bass, smallmouth_bass, trout | finesse_plastic | ned_tube_finesse | bottom<br>slow | 2: leech_worm, crawfish | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | largemouth_bass, smallmouth_bass | soft_plastic_craw | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 4: cover_ambush, cold_slow, clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | bottom<br>slow | 2: leech_worm, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 2: reliable_action, versatile_search | freshwater_lake_pond | false | 8 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_deep | crankbait | bottom<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 2: open_water_search, cold_slow | 1: versatile_search | freshwater_lake_pond | false | 8 |
| Finesse Jig<br>finesse_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 2: crawfish, leech_worm | 2: clear, stained | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Hair Jig<br>hair_jig | lure | smallmouth_bass, trout | hair_jig | hair_jig | bottom<br>slow/medium | 2: baitfish, leech_worm | 2: clear, stained | 3: clear_subtle, current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 8 |
| Inline Spinner<br>inline_spinner | lure | smallmouth_bass, trout, northern_pike | spinner | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | largemouth_bass, smallmouth_bass | crankbait_medium | crankbait | mid<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 0: none | freshwater_lake_pond, freshwater_river | false | 8 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | largemouth_bass, smallmouth_bass, northern_pike | swimbait | swimbait | mid<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Shaky-Head Worm<br>shaky_head_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | largemouth_bass, smallmouth_bass, trout | jerkbait | jerkbait | mid<br>medium | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, wind_reaction | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | smallmouth_bass, northern_pike, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Clouser Minnow<br>clouser_minnow | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_weighted | baitfish_streamer | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: current_swing, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Conehead Streamer<br>conehead_streamer | fly | smallmouth_bass, trout | streamer_weighted | baitfish_streamer | mid<br>medium | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Crawfish Streamer<br>crawfish_streamer | fly | smallmouth_bass, trout | crawfish_fly | crawfish_fly | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 2: current_swing, clear_subtle | 1: reliable_action | freshwater_river | false | 7 |
| Deceiver<br>deceiver | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_baitfish | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
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
| Drop-Shot Minnow<br>drop_shot_minnow | lure | largemouth_bass, smallmouth_bass | soft_plastic_minnow | drop_shot_minnow | mid<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Football Jig<br>football_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 2: cold_slow, cover_ambush | 1: big_fish_upside | freshwater_lake_pond | false | 7 |
| Spinnerbait<br>spinnerbait | lure | largemouth_bass, smallmouth_bass, northern_pike | safety_pin_spinner | spinner_vibration | mid<br>medium/slow | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: wind_reaction, dirty_vibration, cover_ambush | 0: none | freshwater_lake_pond, freshwater_river | false | 7 |
| Swim Jig<br>swim_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_swimming | swim_jig | mid<br>medium/fast | 2: bluegill_perch, baitfish | 2: stained, dirty | 2: cover_ambush, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Tube Jig<br>tube_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | tube_jig | ned_tube_finesse | bottom<br>slow/medium | 2: crawfish, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Bladed Jig<br>bladed_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | bladed_jig | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: dirty_vibration, cover_ambush | 0: none | freshwater_lake_pond, freshwater_river | false | 5 |
| Lipless Crankbait<br>lipless_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_lipless | crankbait | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: wind_reaction, open_water_search | 0: none | freshwater_lake_pond, freshwater_river | false | 5 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 5/36 | 5/36 | goal_tags>1<br>versatile_search+big_fish_upside |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 8/36 | 0/0 | goal_tags>1<br>broad per-slot share>20% |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 5/36 | 5/36 | goal_tags>1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 3/12 | 2/4 | clear+stained+dirty clarity |
| Deceiver<br>deceiver | fly | 7 | 5/36 | 5/36 | clear+stained+dirty clarity |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 1/36 | 0/0 | clear+stained+dirty clarity |
| Game Changer<br>game_changer | fly | 7 | 10/36 | 10/36 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 3/36 | 0/0 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 4/36 | 0/0 | clear+stained+dirty clarity |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 12/36 | 3/12 | goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 3/12 | 1/4 | clear+stained+dirty clarity |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 0/36 | 0/12 | clear+stained+dirty clarity |
| Blade Bait<br>blade_bait | lure | 7 | 3/36 | 1/24 | clear+stained+dirty clarity |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 2/24 | 0/0 | goal_tags>1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 0/24 | 0/16 | clear+stained+dirty clarity |
| Football Jig<br>football_jig | lure | 7 | 6/24 | 0/0 | clear+stained+dirty clarity |
| Inline Spinner<br>inline_spinner | lure | 8 | 9/36 | 1/8 | goal_tags>1 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8 | 12/36 | 10/24 | clear+stained+dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Ned Rig<br>ned_rig | lure | 9 | 4/36 | 2/8 | clear+stained+dirty clarity |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 0/36 | 0/36 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 0/36 | 0/8 | clear+stained+dirty clarity |
| Spinnerbait<br>spinnerbait | lure | 7 | 5/36 | 5/24 | wind+dirty+stained/dirty clarity |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 10/36 | 7/24 | goal_tags>1<br>combined all-slot share>25% |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 3/36 | 2/4 | condition_tags>3<br>clear+stained+dirty clarity |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8 | 12/36 (33.3%) | 10/24 (41.7%) | big_fish:8, all_purpose:4 | top:8, honorable:4 | wind_reaction:12, dirty_vibration:10, warming_search:10, cold_slow:2 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 12/36 (33.3%) | 3/12 (25%) | big_fish:9, all_purpose:3 | honorable:11, top:1 | wind_reaction:12, warming_search:9, dirty_vibration:8, cold_slow:3, clear_subtle:1 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 10/36 (27.8%) | 7/24 (29.2%) | all_purpose:7, big_fish:3 | top:6, honorable:4 | wind_reaction:10, dirty_vibration:8, warming_search:7, cold_slow:3 |
| Game Changer<br>game_changer | fly | 7 | 10/36 (27.8%) | 10/36 (27.8%) | big_fish:9, all_purpose:1 | honorable:8, top:2 | wind_reaction:10, warming_search:7, dirty_vibration:6, cold_slow:3, clear_subtle:1 |
| Inline Spinner<br>inline_spinner | lure | 8 | 9/36 (25%) | 1/8 (12.5%) | all_purpose:7, big_fish:2 | honorable:7, top:2 | wind_reaction:9, warming_search:8, dirty_vibration:5, cold_slow:1 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 8/36 (22.2%) | 0/0 | big_fish:8 | top:8 | wind_reaction:8, dirty_vibration:6, warming_search:6, cold_slow:2 |
| Zonker Streamer<br>zonker_streamer | fly | 7 | 8/36 (22.2%) | 0/0 | all_purpose:6, big_fish:2 | top:6, honorable:2 | warming_search:8, wind_reaction:8, dirty_vibration:4 |
| Football Jig<br>football_jig | lure | 7 | 6/24 (25%) | 0/0 | big_fish:6 | honorable:4, top:2 | warming_search:6, wind_reaction:6, dirty_vibration:4 |
| Tube Jig<br>tube_jig | lure | 7 | 6/36 (16.7%) | 6/24 (25%) | all_purpose:3, big_fish:3 | top:4, honorable:2 | wind_reaction:6, cold_slow:4, clear_subtle:2, dirty_vibration:2, warming_search:2 |
| Finesse Jig<br>finesse_jig | lure | 8 | 5/36 (13.9%) | 2/4 (50%) | all_purpose:4, big_fish:1 | honorable:3, top:2 | wind_reaction:5, cold_slow:4, clear_subtle:2, dirty_vibration:2, warming_search:1 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 5/36 (13.9%) | 5/36 (13.9%) | big_fish:4, all_purpose:1 | top:3, honorable:2 | wind_reaction:5, dirty_vibration:4, warming_search:4, clear_subtle:1, cold_slow:1 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 5/36 (13.9%) | 5/36 (13.9%) | all_purpose:5 | honorable:4, top:1 | warming_search:5, wind_reaction:5, dirty_vibration:3 |
| Deceiver<br>deceiver | fly | 7 | 5/36 (13.9%) | 5/36 (13.9%) | all_purpose:4, big_fish:1 | top:4, honorable:1 | dirty_vibration:5, warming_search:5, wind_reaction:5 |
| Spinnerbait<br>spinnerbait | lure | 7 | 5/36 (13.9%) | 5/24 (20.8%) | big_fish:5 | top:4, honorable:1 | dirty_vibration:5, wind_reaction:5, warming_search:4, cold_slow:1 |
| Bladed Jig<br>bladed_jig | lure | 5 | 5/36 (13.9%) | 5/24 (20.8%) | big_fish:3, all_purpose:2 | honorable:4, top:1 | dirty_vibration:5, wind_reaction:5, warming_search:4, cold_slow:1 |
| Ned Rig<br>ned_rig | lure | 9 | 4/36 (11.1%) | 2/8 (25%) | all_purpose:2, big_fish:2 | top:4 | wind_reaction:4, cold_slow:3, clear_subtle:2, dirty_vibration:1, warming_search:1 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 4/36 (11.1%) | 0/0 | all_purpose:4 | honorable:2, top:2 | wind_reaction:4, cold_slow:2, dirty_vibration:2, warming_search:2, clear_subtle:1 |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 3/12 (25%) | 1/4 (25%) | all_purpose:3 | top:2, honorable:1 | cold_slow:3, wind_reaction:3, dirty_vibration:2, clear_subtle:1 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 3/36 (8.3%) | 2/4 (50%) | big_fish:2, all_purpose:1 | honorable:3 | cold_slow:3, wind_reaction:3, clear_subtle:2, dirty_vibration:1 |
| Blade Bait<br>blade_bait | lure | 7 | 3/36 (8.3%) | 1/24 (4.2%) | all_purpose:3 | honorable:2, top:1 | wind_reaction:3, dirty_vibration:2, warming_search:2, cold_slow:1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 3/12 (25%) | 2/4 (50%) | all_purpose:2, big_fish:1 | honorable:2, top:1 | cold_slow:3, wind_reaction:3, clear_subtle:2, dirty_vibration:1 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 3/36 (8.3%) | 0/0 | all_purpose:3 | honorable:2, top:1 | dirty_vibration:3, wind_reaction:3, cold_slow:2, warming_search:1 |
| Muddler Minnow<br>muddler_sculpin | fly | 7 | 3/12 (25%) | 1/4 (25%) | all_purpose:3 | top:2, honorable:1 | cold_slow:3, wind_reaction:3, dirty_vibration:2, clear_subtle:1 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 2/24 (8.3%) | 0/0 | all_purpose:2 | honorable:1, top:1 | warming_search:2, wind_reaction:2, dirty_vibration:1 |
| Sculpzilla<br>sculpzilla | fly | 7 | 2/12 (16.7%) | 2/12 (16.7%) | big_fish:2 | top:2 | cold_slow:2, dirty_vibration:2, wind_reaction:2 |
| Hair Jig<br>hair_jig | lure | 8 | 1/12 (8.3%) | 0/4 (0%) | big_fish:1 | honorable:1 | cold_slow:1, dirty_vibration:1, wind_reaction:1 |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 1/36 (2.8%) | 0/0 | all_purpose:1 | top:1 | warming_search:1, wind_reaction:1 |
| Lipless Crankbait<br>lipless_crankbait | lure | 5 | 1/36 (2.8%) | 1/24 (4.2%) | all_purpose:1 | top:1 | dirty_vibration:1, warming_search:1, wind_reaction:1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 0/24 (0%) | 0/16 (0%) |  |  |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 0/36 (0%) | 0/36 (0%) |  |  |  |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 0/36 (0%) | 0/8 (0%) |  |  |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 0/12 (0%) | 0/12 (0%) |  |  |  |
| Conehead Streamer<br>conehead_streamer | fly | 7 | 0/12 (0%) | 0/12 (0%) |  |  |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 0/36 (0%) | 0/4 (0%) |  |  |  |
| Swim Jig<br>swim_jig | lure | 7 | 0/36 (0%) | 0/28 (0%) |  |  |  |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 0/36 (0%) | 0/12 (0%) |  |  |  |

### Likely Cause Classification

None.

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 8 | 2/8 (25%) | Finesse Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Suspending Jerkbait (top), Finesse Jig (honorable):1, Suspending Jerkbait (top), Hair Jig (honorable):1, Tube Jig (top), Finesse Jig (honorable):1 | scenario coverage |
| Tube Jig<br>tube_jig | lure | forage 2: crawfish, baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, cold_slow<br>goal 1: reliable_action | 24 | 6/24 (25%) | Medium-Diving Crankbait (top), Football Jig (honorable):2, Blade Bait (top), Inline Spinner (honorable):1, Bladed Jig (top), Suspending Jerkbait (honorable):1, Finesse Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):1 | healthy / not underused |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | forage 2: crawfish, baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: big_fish_upside | 0 | 0/0 |  | scenario coverage |
| Finesse Jig<br>finesse_jig | lure | forage 2: crawfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 4 | 2/4 (50%) | Ned Rig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Ned Rig (top), Tube Jig (honorable):1 | scenario coverage |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 4: cover_ambush, cold_slow, clear_subtle, heat_finesse<br>goal 1: reliable_action | 4 | 2/4 (50%) | Ned Rig (top), Tube Jig (honorable):1, Tube Jig (top), Finesse Jig (honorable):1 | scenario coverage |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, heat_finesse<br>goal 1: reliable_action | 4 | 0/4 (0%) | Finesse Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Ned Rig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Ned Rig (top), Tube Jig (honorable):1, Tube Jig (top), Finesse Jig (honorable):1 | scenario coverage |
| Suspending Jerkbait<br>suspending_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, wind_reaction<br>goal 2: reliable_action, versatile_search | 24 | 7/24 (29.2%) | Medium-Diving Crankbait (top), Football Jig (honorable):2, Tube Jig (top), Inline Spinner (honorable):2, Blade Bait (top), Inline Spinner (honorable):1, Carolina-Rigged Stick Worm (top), Tube Jig (honorable):1 | healthy / not underused |
| Hair Jig<br>hair_jig | lure | forage 2: baitfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: reliable_action | 4 | 0/4 (0%) | Finesse Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Ned Rig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Ned Rig (top), Tube Jig (honorable):1, Tube Jig (top), Finesse Jig (honorable):1 | scenario coverage |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 8 | 1/8 (12.5%) | Finesse Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Ned Rig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Ned Rig (top), Tube Jig (honorable):1, Suspending Jerkbait (top), Finesse Jig (honorable):1 | scenario coverage |
| Bladed Jig<br>bladed_jig | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: dirty_vibration, cover_ambush<br>goal 0: none | 24 | 5/24 (20.8%) | Medium-Diving Crankbait (top), Football Jig (honorable):4, Suspending Jerkbait (top), Blade Bait (honorable):2, Inline Spinner (top), Medium-Diving Crankbait (honorable):1, Inline Spinner (top), Suspending Jerkbait (honorable):1 | healthy / not underused |
| Lipless Crankbait<br>lipless_crankbait | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 0: none | 24 | 1/24 (4.2%) | Medium-Diving Crankbait (top), Football Jig (honorable):4, Spinnerbait (top), Bladed Jig (honorable):3, Suspending Jerkbait (top), Blade Bait (honorable):2, Bladed Jig (top), Suspending Jerkbait (honorable):1 | selector/direct-score or overpowered competitors |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
None from audit alone.

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Big Smallmouth Tube (big_smallmouth_tube), Drop-Shot Minnow (drop_shot_minnow), Finesse Jig (finesse_jig), Hair Jig (hair_jig), Inline Spinner (inline_spinner), Ned Rig (ned_rig), Texas-Rigged Soft-Plastic Craw (texas_rigged_soft_plastic_craw)

### Probably selector problem, not catalog problem
Lipless Crankbait (lipless_crankbait)

## Utilization Notes / Coverage Gaps

- 8 eligible profile(s) were never selected despite appearing in candidate pools; these are prime coverage or selector-balance review targets.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Articulated Baitfish Streamer, Clouser Minnow, Game Changer, Rabbit-Strip Leech, Sculpzilla, Crawfish Streamer, Bladed Jig, Medium-Diving Crankbait, Spinnerbait, Suspending Jerkbait, Tube Jig, Ned Rig, Finesse Jig, Texas-Rigged Soft-Plastic Craw |
| underused_home_window | Bucktail Streamer, Conehead Streamer, Woolly Bugger, Paddle-Tail Swimbait, Blade Bait, Lipless Crankbait |
| no_home_window_coverage | Football Jig |
| over-dominant | None |
| probably okay niche profile | Muddler Minnow, Sculpin Streamer, Deer Hair Slider, Warmwater Crawfish Fly, Inline Spinner, Drop-Shot Minnow, Hair Jig, Big Smallmouth Tube, Buzzbait, Flat-Sided Crankbait, Magnum Jerkbait, Soft Plastic Jerkbait, Walking Topwater |

## SMB Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 6.9% | 5/36 | 5/36 | 5 | 5 | 13.9% | 1/18 | 4/18 | 6 | healthy | activity neutral:24, active:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:24, freshwater_river:12<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, warming_search:8 | Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):5, Zonker Streamer (top), Clouser Minnow (honorable):3, Rabbit-Strip Leech (honorable), Deceiver (top):2 |
| Clouser Minnow<br>clouser_minnow | fly | 6.9% | 5/36 | 5/36 | 5 | 5 | 13.9% | 5/18 | 0/18 | 7 | healthy | activity neutral:24, active:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:24, freshwater_river:12<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, warming_search:8 | Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):5, Articulated Baitfish Streamer (top), Game Changer (honorable):3, Rabbit-Strip Leech (honorable), Deceiver (top):2 |
| Game Changer<br>game_changer | fly | 13.9% | 10/36 | 10/36 | 10 | 10 | 27.8% | 1/18 | 9/18 | 0 | healthy | activity neutral:24, active:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:24, freshwater_river:12<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, warming_search:8 | Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):5, Zonker Streamer (top), Clouser Minnow (honorable):3, Rabbit-Strip Leech (honorable), Deceiver (top):2 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 0% | 0/12 | 0/12 | 0 | 0 | 0% | 0/6 | 0/6 | 0 | underused_home_window | activity neutral:12<br>clarity clear:4, dirty:4, stained:4<br>water freshwater_river:12<br>bucket breezy_windy_stained_reaction:4, cold_slow_or_front:4, dirty_vibration:4 | Articulated Dungeon Streamer (top), Game Changer (honorable):1, Crawfish Streamer (top), Articulated Baitfish Streamer (honorable):1, Muddler Minnow (honorable), Jighead Marabou Leech (top):1 |
| Conehead Streamer<br>conehead_streamer | fly | 0% | 0/12 | 0/12 | 0 | 0 | 0% | 0/6 | 0/6 | 0 | underused_home_window | activity neutral:12<br>clarity clear:4, dirty:4, stained:4<br>water freshwater_river:12<br>bucket breezy_windy_stained_reaction:4, cold_slow_or_front:4, dirty_vibration:4 | Articulated Dungeon Streamer (top), Game Changer (honorable):1, Crawfish Streamer (top), Articulated Baitfish Streamer (honorable):1, Muddler Minnow (honorable), Jighead Marabou Leech (top):1 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 16.7% | 12/36 | 3/12 | 12 | 3 | 25% | 0/6 | 3/6 | 4 | healthy | activity neutral:12<br>clarity clear:4, dirty:4, stained:4<br>water freshwater_river:12<br>bucket breezy_windy_stained_reaction:4, cold_slow_or_front:4, dirty_vibration:4 | Articulated Dungeon Streamer (top), Game Changer (honorable):1, Crawfish Streamer (top), Articulated Baitfish Streamer (honorable):1, Muddler Minnow (honorable), Jighead Marabou Leech (top):1 |
| Sculpzilla<br>sculpzilla | fly | 2.8% | 2/12 | 2/12 | 2 | 2 | 16.7% | 0/6 | 2/6 | 4 | healthy | activity neutral:12<br>clarity clear:4, dirty:4, stained:4<br>water freshwater_river:12<br>bucket breezy_windy_stained_reaction:4, cold_slow_or_front:4, dirty_vibration:4 | Articulated Dungeon Streamer (top), Game Changer (honorable):1, Crawfish Streamer (top), Articulated Baitfish Streamer (honorable):1, Muddler Minnow (honorable), Jighead Marabou Leech (top):1 |
| Woolly Bugger<br>woolly_bugger | fly | 0% | 0/36 | 0/12 | 0 | 0 | 0% | 0/6 | 0/6 | 0 | underused_home_window | activity neutral:12<br>clarity clear:4, dirty:4, stained:4<br>water freshwater_river:12<br>bucket breezy_windy_stained_reaction:4, cold_slow_or_front:4, dirty_vibration:4 | Articulated Dungeon Streamer (top), Game Changer (honorable):1, Crawfish Streamer (top), Articulated Baitfish Streamer (honorable):1, Muddler Minnow (honorable), Jighead Marabou Leech (top):1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 4.2% | 3/12 | 2/4 | 3 | 2 | 50% | 1/2 | 1/2 | 2 | healthy | activity neutral:4<br>clarity clear:4<br>water freshwater_river:4<br>bucket cold_slow_or_front:4 | Rabbit-Strip Leech (honorable), Game Changer (top):1, Sculpin Streamer (top), Lead-Eye Leech (honorable):1 |
| Muddler Minnow<br>muddler_sculpin | fly | 4.2% | 3/12 | 1/4 | 3 | 1 | 25% | 1/2 | 0/2 | 3 | probably okay niche profile | activity neutral:4<br>clarity clear:4<br>water freshwater_river:4<br>bucket cold_slow_or_front:4 | Crawfish Streamer (top), Articulated Baitfish Streamer (honorable):1, Rabbit-Strip Leech (honorable), Game Changer (top):1, Sculpin Streamer (top), Lead-Eye Leech (honorable):1 |
| Sculpin Streamer<br>sculpin_streamer | fly | 4.2% | 3/12 | 1/4 | 3 | 1 | 25% | 1/2 | 0/2 | 3 | probably okay niche profile | activity neutral:4<br>clarity clear:4<br>water freshwater_river:4<br>bucket cold_slow_or_front:4 | Crawfish Streamer (top), Articulated Baitfish Streamer (honorable):1, Muddler Minnow (top), Crawfish Streamer (honorable):1, Rabbit-Strip Leech (honorable), Game Changer (top):1 |
| Deer Hair Slider<br>deer_hair_slider | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 0% | 0/36 | 0/36 | 0 | 0 | 0% | 0/18 | 0/18 | 7 | underused_home_window | activity neutral:24, active:12<br>clarity clear:12, dirty:12, stained:12<br>water freshwater_lake_pond:24, freshwater_river:12<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12, warming_search:8 | Spinnerbait (top), Bladed Jig (honorable):3, Blade Bait (honorable), Suspending Jerkbait (top):2, Football Jig (honorable), Medium-Diving Crankbait (top):2 |
| Blade Bait<br>blade_bait | lure | 4.2% | 3/36 | 1/24 | 3 | 1 | 4.2% | 1/12 | 0/12 | 14 | underused_home_window | activity neutral:16, active:8<br>clarity clear:12, stained:12<br>water freshwater_lake_pond:16, freshwater_river:8<br>bucket breezy_windy_stained_reaction:12, warming_search:8, cold_slow_or_front:4 | Tube Jig (top), Inline Spinner (honorable):2, Carolina-Rigged Stick Worm (top), Tube Jig (honorable):1, Finesse Jig (honorable), Ned Rig (top):1 |
| Bladed Jig<br>bladed_jig | lure | 6.9% | 5/36 | 5/24 | 5 | 5 | 20.8% | 2/12 | 3/12 | 1 | healthy | activity neutral:16, active:8<br>clarity dirty:12, stained:12<br>water freshwater_lake_pond:16, freshwater_river:8<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12 | Blade Bait (honorable), Suspending Jerkbait (top):2, Football Jig (honorable), Medium-Diving Crankbait (top):2, Medium-Diving Crankbait (top), Football Jig (honorable):2 |
| Lipless Crankbait<br>lipless_crankbait | lure | 1.4% | 1/36 | 1/24 | 1 | 1 | 4.2% | 1/12 | 0/12 | 4 | underused_home_window | activity neutral:16, active:8<br>clarity dirty:12, stained:12<br>water freshwater_lake_pond:16, freshwater_river:8<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12 | Spinnerbait (top), Bladed Jig (honorable):3, Blade Bait (honorable), Suspending Jerkbait (top):2, Football Jig (honorable), Medium-Diving Crankbait (top):2 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 16.7% | 12/36 | 10/24 | 12 | 10 | 41.7% | 4/12 | 6/12 | 9 | healthy | activity neutral:16, active:8<br>clarity dirty:12, stained:12<br>water freshwater_lake_pond:16, freshwater_river:8<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12 | Spinnerbait (top), Bladed Jig (honorable):3, Blade Bait (honorable), Suspending Jerkbait (top):2, Finesse Jig (honorable), Suspending Jerkbait (top):1 |
| Spinnerbait<br>spinnerbait | lure | 6.9% | 5/36 | 5/24 | 5 | 5 | 20.8% | 0/12 | 5/12 | 0 | healthy | activity neutral:16, active:8<br>clarity dirty:12, stained:12<br>water freshwater_lake_pond:16, freshwater_river:8<br>bucket breezy_windy_stained_reaction:12, dirty_vibration:12 | Blade Bait (honorable), Suspending Jerkbait (top):2, Football Jig (honorable), Medium-Diving Crankbait (top):2, Medium-Diving Crankbait (top), Football Jig (honorable):2 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 13.9% | 10/36 | 7/24 | 10 | 7 | 29.2% | 4/12 | 3/12 | 7 | healthy | activity neutral:16, active:8<br>clarity clear:12, stained:12<br>water freshwater_lake_pond:16, freshwater_river:8<br>bucket breezy_windy_stained_reaction:12, warming_search:8, cold_slow_or_front:4 | Tube Jig (top), Inline Spinner (honorable):2, Carolina-Rigged Stick Worm (top), Tube Jig (honorable):1, Finesse Jig (honorable), Ned Rig (top):1 |
| Tube Jig<br>tube_jig | lure | 8.3% | 6/36 | 6/24 | 6 | 6 | 25% | 3/12 | 3/12 | 16 | healthy | activity neutral:16, active:8<br>clarity clear:12, stained:12<br>water freshwater_lake_pond:16, freshwater_river:8<br>bucket breezy_windy_stained_reaction:12, warming_search:8, cold_slow_or_front:4 | Finesse Jig (honorable), Ned Rig (top):1, Finesse Jig (honorable), Suspending Jerkbait (top):1, Finesse Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):1 |
| Inline Spinner<br>inline_spinner | lure | 12.5% | 9/36 | 1/8 | 9 | 1 | 12.5% | 1/4 | 0/4 | 0 | probably okay niche profile | activity neutral:8<br>clarity clear:4, stained:4<br>water freshwater_river:8<br>bucket breezy_windy_stained_reaction:4, cold_slow_or_front:4 | Finesse Jig (honorable), Suspending Jerkbait (top):1, Finesse Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Hair Jig (honorable), Suspending Jerkbait (top):1 |
| Ned Rig<br>ned_rig | lure | 5.6% | 4/36 | 2/8 | 4 | 2 | 25% | 1/4 | 1/4 | 6 | healthy | activity neutral:8<br>clarity clear:4, stained:4<br>water freshwater_river:8<br>bucket breezy_windy_stained_reaction:4, cold_slow_or_front:4 | Finesse Jig (honorable), Suspending Jerkbait (top):1, Finesse Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Hair Jig (honorable), Suspending Jerkbait (top):1 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 0% | 0/36 | 0/4 | 0 | 0 | 0% | 0/2 | 0/2 | 0 | probably okay niche profile | activity neutral:4<br>clarity clear:4<br>water freshwater_river:4<br>bucket cold_slow_or_front:4 | Finesse Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Ned Rig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Tube Jig (honorable), Ned Rig (top):1 |
| Finesse Jig<br>finesse_jig | lure | 6.9% | 5/36 | 2/4 | 5 | 2 | 50% | 1/2 | 1/2 | 2 | healthy | activity neutral:4<br>clarity clear:4<br>water freshwater_river:4<br>bucket cold_slow_or_front:4 | Ned Rig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Tube Jig (honorable), Ned Rig (top):1 |
| Hair Jig<br>hair_jig | lure | 1.4% | 1/12 | 0/4 | 1 | 0 | 0% | 0/2 | 0/2 | 3 | probably okay niche profile | activity neutral:4<br>clarity clear:4<br>water freshwater_river:4<br>bucket cold_slow_or_front:4 | Finesse Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Ned Rig (top), Texas-Rigged Soft-Plastic Craw (honorable):1, Tube Jig (honorable), Ned Rig (top):1 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 4.2% | 3/36 | 2/4 | 3 | 2 | 50% | 1/2 | 1/2 | 2 | healthy | activity neutral:4<br>clarity clear:4<br>water freshwater_river:4<br>bucket cold_slow_or_front:4 | Tube Jig (honorable), Ned Rig (top):1, Tube Jig (top), Finesse Jig (honorable):1 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Buzzbait<br>buzzbait | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Football Jig<br>football_jig | lure | 8.3% | 6/24 | 0/0 | 6 | 0 | 0% | 0/0 | 0/0 | 0 | no_home_window_coverage | activity <br>clarity <br>water <br>bucket  |  |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Walking Topwater<br>walking_topwater | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |
| forage_clarity_stack | 5 |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |
| Lake Champlain SMB water<br>2025-01-18 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 136 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>primary_forage:baitfish:+12 |
| Upper Mississippi smallmouth river<br>2025-01-26 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 130 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6 |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>active | 130 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 | big_fish<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>active | 130 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 130 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6 |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | 1/4 | 1/4 | forage_clarity_stack:3, selector_filtering_variety_jitter:3 | Upper Mississippi smallmouth river 2025-01-26 big_fish stained: lost to Hair Jig by -6 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 big_fish clear: lost to Finesse Jig by 0 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 all_purpose stained: lost to Finesse Jig by 0 (selector_filtering_variety_jitter) |
| Drop-Shot Minnow<br>drop_shot_minnow | 0/2 | 0/2 | daily_condition_tags:4 | Upper Mississippi smallmouth river 2025-01-26 big_fish clear: lost to Finesse Jig by 20 (daily_condition_tags)<br>Upper Mississippi smallmouth river 2025-01-26 all_purpose clear: lost to Ned Rig by 26 (daily_condition_tags)<br>Upper Mississippi smallmouth river 2025-01-26 big_fish clear: lost to Tube Jig by 26 (daily_condition_tags) |
| Finesse Jig<br>finesse_jig | 1/2 | 1/2 | forage_clarity_stack:1, selector_filtering_variety_jitter:1 | Upper Mississippi smallmouth river 2025-01-26 all_purpose clear: lost to Ned Rig by 0 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 big_fish clear: lost to Tube Jig by 6 (forage_clarity_stack) |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | 1/2 | 1/2 | forage_clarity_stack:2 | Upper Mississippi smallmouth river 2025-01-26 all_purpose clear: lost to Tube Jig by 6 (forage_clarity_stack)<br>Upper Mississippi smallmouth river 2025-01-26 big_fish clear: lost to Tube Jig by 6 (forage_clarity_stack) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish stained breezy_windy_stained_reaction | 156 | Hair Jig<br>150 | -6 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose clear cold_slow_or_front | 206 | Ned Rig<br>206 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish clear cold_slow_or_front | 172 | Finesse Jig<br>172 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose stained breezy_windy_stained_reaction | 184 | Finesse Jig<br>184 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish clear cold_slow_or_front | 172 | Tube Jig<br>178 | 6 | forage_clarity_stack | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose clear cold_slow_or_front | 206 | Tube Jig<br>212 | 6 | forage_clarity_stack | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose clear cold_slow_or_front | 206 | Tube Jig<br>212 | 6 | forage_clarity_stack | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish clear cold_slow_or_front | 172 | Tube Jig<br>178 | 6 | forage_clarity_stack | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Drop-Shot Minnow<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish clear cold_slow_or_front | 152 | Finesse Jig<br>172 | 20 | daily_condition_tags | base:+100<br>condition_tag:clear_subtle:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Drop-Shot Minnow<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose clear cold_slow_or_front | 180 | Ned Rig<br>206 | 26 | daily_condition_tags | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Drop-Shot Minnow<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish clear cold_slow_or_front | 152 | Tube Jig<br>178 | 26 | daily_condition_tags | base:+100<br>condition_tag:clear_subtle:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Drop-Shot Minnow<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose clear cold_slow_or_front | 180 | Tube Jig<br>212 | 32 | daily_condition_tags | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| avoidIds | 1 |
| set_b_group_novelty | 1 |
| honorable_diversity_or_replacement | 1 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Upper Mississippi smallmouth river<br>2025-01-26 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Ned Rig<br>206 | Finesse Jig<br>206 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Mississippi smallmouth river<br>2025-01-26 all_purpose stained<br>breezy_windy_stained_reaction | B<br>honorable_lure | Finesse Jig<br>184 | Ned Rig<br>184 | 0 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Mississippi smallmouth river<br>2025-01-26 all_purpose stained<br>breezy_windy_stained_reaction | B<br>honorable_lure | Finesse Jig<br>184 | Texas-Rigged Soft-Plastic Craw<br>184 | 0 | honorable_diversity_or_replacement | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 0/36 | 0% | 7 | all_purpose / clear / freshwater_lake_pond / warming_search:4, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:4, big_fish / clear / freshwater_lake_pond / warming_search:4 | goal_tags:21, daily_condition_tags:10, seasonal_baseline:4, forage_clarity_stack:1 | Spinnerbait (top), Bladed Jig (honorable):3, Blade Bait (honorable), Suspending Jerkbait (top):2, Football Jig (honorable), Medium-Diving Crankbait (top):2, Medium-Diving Crankbait (top), Football Jig (honorable):2 |
| Blade Bait<br>blade_bait | lure | 1/24 | 4.2% | 14 | all_purpose / clear / freshwater_lake_pond / warming_search:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:4, big_fish / clear / freshwater_lake_pond / warming_search:4, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:4 | goal_tags:9, daily_condition_tags:8, forage_clarity_stack:4, selector_filtering_variety_jitter:2 | Tube Jig (top), Inline Spinner (honorable):2, Carolina-Rigged Stick Worm (top), Tube Jig (honorable):1, Finesse Jig (honorable), Ned Rig (top):1, Finesse Jig (honorable), Suspending Jerkbait (top):1 |
| Lipless Crankbait<br>lipless_crankbait | lure | 1/24 | 4.2% | 4 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:4, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:4, big_fish / dirty / freshwater_lake_pond / dirty_vibration:4, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:4 | goal_tags:12, seasonal_baseline:5, daily_condition_tags:3, forage_clarity_stack:3 | Spinnerbait (top), Bladed Jig (honorable):3, Blade Bait (honorable), Suspending Jerkbait (top):2, Football Jig (honorable), Medium-Diving Crankbait (top):2, Medium-Diving Crankbait (top), Football Jig (honorable):2 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 0/12 | 0% | 0 | all_purpose / clear / freshwater_river / cold_slow_or_front:2, all_purpose / dirty / freshwater_river / dirty_vibration:2, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:2, big_fish / clear / freshwater_river / cold_slow_or_front:2 | goal_tags:11, forage_clarity_stack:1 | Articulated Dungeon Streamer (top), Game Changer (honorable):1, Crawfish Streamer (top), Articulated Baitfish Streamer (honorable):1, Muddler Minnow (honorable), Jighead Marabou Leech (top):1, Muddler Minnow (top), Crawfish Streamer (honorable):1 |
| Conehead Streamer<br>conehead_streamer | fly | 0/12 | 0% | 0 | all_purpose / clear / freshwater_river / cold_slow_or_front:2, all_purpose / dirty / freshwater_river / dirty_vibration:2, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:2, big_fish / clear / freshwater_river / cold_slow_or_front:2 | goal_tags:11, forage_clarity_stack:1 | Articulated Dungeon Streamer (top), Game Changer (honorable):1, Crawfish Streamer (top), Articulated Baitfish Streamer (honorable):1, Muddler Minnow (honorable), Jighead Marabou Leech (top):1, Muddler Minnow (top), Crawfish Streamer (honorable):1 |
| Woolly Bugger<br>woolly_bugger | fly | 0/12 | 0% | 0 | all_purpose / clear / freshwater_river / cold_slow_or_front:2, all_purpose / dirty / freshwater_river / dirty_vibration:2, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:2, big_fish / clear / freshwater_river / cold_slow_or_front:2 | forage_clarity_stack:7, goal_tags:5 | Articulated Dungeon Streamer (top), Game Changer (honorable):1, Crawfish Streamer (top), Articulated Baitfish Streamer (honorable):1, Muddler Minnow (honorable), Jighead Marabou Leech (top):1, Muddler Minnow (top), Crawfish Streamer (honorable):1 |

## Over-Dominant Profiles

None.

## Home-Window Coverage Gaps

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Football Jig<br>football_jig | lure | 0/0 | 0% | 0 |  |  |  |

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | None | None |
| calm_surface | big_fish | None | None |
| low_light_surface | all_purpose | None | None |
| low_light_surface | big_fish | None | None |
| wind_reaction | all_purpose | Suspending Jerkbait [lure] (5), Zonker Streamer [fly] (5), Deceiver [fly] (4), Inline Spinner [lure] (2), Lead-Eye Leech [fly] (2) | Inline Spinner [lure] (7), Suspending Jerkbait [lure] (7), Zonker Streamer [fly] (6), Clouser Minnow [fly] (5), Deceiver [fly] (4) |
| wind_reaction | big_fish | Articulated Dungeon Streamer [fly] (8), Medium-Diving Crankbait [lure] (6), Spinnerbait [lure] (4), Articulated Baitfish Streamer [fly] (3), Football Jig [lure] (2) | Game Changer [fly] (9), Rabbit-Strip Leech [fly] (9), Articulated Dungeon Streamer [fly] (8), Medium-Diving Crankbait [lure] (8), Football Jig [lure] (6) |
| dirty_vibration | all_purpose | Deceiver [fly] (4), Suspending Jerkbait [lure] (4), Zonker Streamer [fly] (4), Inline Spinner [lure] (2), Medium-Diving Crankbait [lure] (2) | Suspending Jerkbait [lure] (6), Inline Spinner [lure] (5), Deceiver [fly] (4), Medium-Diving Crankbait [lure] (4), Zonker Streamer [fly] (4) |
| dirty_vibration | big_fish | Articulated Dungeon Streamer [fly] (6), Medium-Diving Crankbait [lure] (5), Spinnerbait [lure] (4), Articulated Baitfish Streamer [fly] (3), Sculpzilla [fly] (2) | Articulated Dungeon Streamer [fly] (6), Game Changer [fly] (6), Medium-Diving Crankbait [lure] (6), Rabbit-Strip Leech [fly] (6), Spinnerbait [lure] (5) |
| clear_subtle | all_purpose | Muddler Minnow [fly] (1), Ned Rig [lure] (1), Sculpin Streamer [fly] (1), Tube Jig [lure] (1) | Crawfish Streamer [fly] (1), Finesse Jig [lure] (1), Lead-Eye Leech [fly] (1), Muddler Minnow [fly] (1), Ned Rig [lure] (1) |
| clear_subtle | big_fish | Crawfish Streamer [fly] (1), Finesse Jig [lure] (1), Game Changer [fly] (1), Ned Rig [lure] (1) | Articulated Baitfish Streamer [fly] (1), Crawfish Streamer [fly] (1), Finesse Jig [lure] (1), Game Changer [fly] (1), Ned Rig [lure] (1) |
| cold_slow | all_purpose | Muddler Minnow [fly] (2), Sculpin Streamer [fly] (2), Suspending Jerkbait [lure] (2), Tube Jig [lure] (2), Finesse Jig [lure] (1) | Finesse Jig [lure] (3), Muddler Minnow [fly] (3), Sculpin Streamer [fly] (3), Crawfish Streamer [fly] (2), Jighead Marabou Leech [fly] (2) |
| cold_slow | big_fish | Articulated Dungeon Streamer [fly] (2), Ned Rig [lure] (2), Sculpzilla [fly] (2), Crawfish Streamer [fly] (1), Finesse Jig [lure] (1) | Game Changer [fly] (3), Rabbit-Strip Leech [fly] (3), Articulated Dungeon Streamer [fly] (2), Medium-Diving Crankbait [lure] (2), Ned Rig [lure] (2) |
| warming_search | all_purpose | Zonker Streamer [fly] (5), Deceiver [fly] (4), Suspending Jerkbait [lure] (3), Inline Spinner [lure] (2), Medium-Diving Crankbait [lure] (2) | Inline Spinner [lure] (6), Zonker Streamer [fly] (6), Clouser Minnow [fly] (5), Suspending Jerkbait [lure] (5), Deceiver [fly] (4) |
| warming_search | big_fish | Articulated Dungeon Streamer [fly] (6), Medium-Diving Crankbait [lure] (5), Spinnerbait [lure] (4), Articulated Baitfish Streamer [fly] (3), Football Jig [lure] (2) | Articulated Dungeon Streamer [fly] (6), Football Jig [lure] (6), Game Changer [fly] (6), Medium-Diving Crankbait [lure] (6), Rabbit-Strip Leech [fly] (6) |
| heat_finesse | all_purpose | None | None |
| heat_finesse | big_fish | None | None |
| current_swing | all_purpose | None | None |
| current_swing | big_fish | None | None |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear big_fish B | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+warming_search, medium | Tube Jig (146); Inline Spinner (130); Articulated Dungeon Streamer (148); Rabbit-Strip Leech (140) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained big_fish B | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+dirty_vibration+warming_search, medium | Spinnerbait (136); Bladed Jig (130); Articulated Baitfish Streamer (140); Game Changer (134) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Lake Champlain SMB water<br>2025-01-18 clear all_purpose A | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Ned Rig (152); Finesse Jig (152); Feather Jig Leech (152); Game Changer (132) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Lake Champlain SMB water<br>2025-01-18 clear big_fish B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Medium-Diving Crankbait (158); Suspending Jerkbait (136); Articulated Dungeon Streamer (154); Rabbit-Strip Leech (140) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Lake Champlain SMB water<br>2025-01-18 stained big_fish B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Spinnerbait (142); Suspending Jerkbait (136); Articulated Baitfish Streamer (146); Game Changer (140) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear all_purpose A | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+warming_search, medium | Carolina-Rigged Stick Worm (164); Tube Jig (164); Lead-Eye Leech (146); Zonker Streamer (148) | WIND_NOT_ELEVATING_REACTION |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear all_purpose B | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+warming_search, medium | Blade Bait (152); Inline Spinner (160); Clouser Minnow (144); Rabbit-Strip Leech (138) | WIND_NOT_ELEVATING_REACTION |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 dirty big_fish B | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+dirty_vibration+warming_search, medium | Spinnerbait (136); Bladed Jig (130); Articulated Dungeon Streamer (156); Deceiver (130) | BIG_FISH_NOT_FAVORING_UPSIDE |
| Lake Champlain SMB water<br>2025-01-18 dirty big_fish A | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Medium-Diving Crankbait (158); Football Jig (154); Articulated Baitfish Streamer (146); Game Changer (140) | WIND_NOT_ELEVATING_REACTION |
| Lake Champlain SMB water<br>2025-01-18 dirty big_fish B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Spinnerbait (142); Bladed Jig (136); Articulated Dungeon Streamer (162); Rabbit-Strip Leech (148) | BIG_FISH_NOT_FAVORING_UPSIDE |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear big_fish A | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+warming_search, medium | Football Jig (160); Medium-Diving Crankbait (158); Zonker Streamer (136); Game Changer (134) | None |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 dirty all_purpose A | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+dirty_vibration+warming_search, medium | Medium-Diving Crankbait (158); Inline Spinner (152); Deceiver (142); Rabbit-Strip Leech (146) | None |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 dirty all_purpose B | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+dirty_vibration+warming_search, medium | Suspending Jerkbait (152); Blade Bait (152); Zonker Streamer (140); Articulated Baitfish Streamer (132) | None |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 dirty big_fish A | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+dirty_vibration+warming_search, medium | Medium-Diving Crankbait (158); Football Jig (160); Rabbit-Strip Leech (148); Game Changer (134) | None |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained all_purpose A | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+dirty_vibration+warming_search, medium | Bladed Jig (130); Suspending Jerkbait (160); Deceiver (142); Rabbit-Strip Leech (146) | None |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained all_purpose B | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+dirty_vibration+warming_search, medium | Inline Spinner (160); Medium-Diving Crankbait (158); Zonker Streamer (148); Clouser Minnow (144) | None |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained big_fish A | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+dirty_vibration+warming_search, medium | Medium-Diving Crankbait (158); Football Jig (160); Articulated Dungeon Streamer (156); Rabbit-Strip Leech (148) | None |
| Lake Champlain SMB water<br>2025-01-18 clear all_purpose B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Suspending Jerkbait (166); Inline Spinner (166); Zonker Streamer (154); Clouser Minnow (150) | None |
| Lake Champlain SMB water<br>2025-01-18 clear big_fish A | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Football Jig (154); Inline Spinner (136); Game Changer (140); Zonker Streamer (142) | None |
| Lake Champlain SMB water<br>2025-01-18 dirty all_purpose A | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Inline Spinner (158); Suspending Jerkbait (158); Deceiver (148); Jighead Marabou Leech (146) | None |
| Lake Champlain SMB water<br>2025-01-18 dirty all_purpose B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Medium-Diving Crankbait (158); Carolina-Rigged Stick Worm (162); Zonker Streamer (146); Clouser Minnow (142) | None |
| Lake Champlain SMB water<br>2025-01-18 stained all_purpose A | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Lipless Crankbait (136); Inline Spinner (166); Zonker Streamer (154); Lead-Eye Leech (146) | None |
| Lake Champlain SMB water<br>2025-01-18 stained all_purpose B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Suspending Jerkbait (166); Medium-Diving Crankbait (158); Deceiver (148); Clouser Minnow (150) | None |
| Lake Champlain SMB water<br>2025-01-18 stained big_fish A | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Medium-Diving Crankbait (158); Football Jig (154); Articulated Dungeon Streamer (162); Rabbit-Strip Leech (148) | None |
| Upper Mississippi smallmouth river<br>2025-01-26 clear all_purpose A | 21.6-39.9F, 6.9 mph wind, 0% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle+cold_slow, medium | Tube Jig (212); Finesse Jig (206); Muddler Minnow (196); Crawfish Streamer (190) | None |
| Upper Mississippi smallmouth river<br>2025-01-26 clear all_purpose B | 21.6-39.9F, 6.9 mph wind, 0% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle+cold_slow, medium | Ned Rig (206); Texas-Rigged Soft-Plastic Craw (206); Sculpin Streamer (196); Lead-Eye Leech (188) | None |
| Upper Mississippi smallmouth river<br>2025-01-26 clear big_fish A | 21.6-39.9F, 6.9 mph wind, 0% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle+cold_slow, medium | Finesse Jig (172); Texas-Rigged Soft-Plastic Craw (172); Game Changer (134); Rabbit-Strip Leech (156) | None |
| Upper Mississippi smallmouth river<br>2025-01-26 clear big_fish B | 21.6-39.9F, 6.9 mph wind, 0% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle+cold_slow, medium | Ned Rig (172); Tube Jig (178); Crawfish Streamer (156); Articulated Baitfish Streamer (132) | None |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty all_purpose A | 21.6-39.9F, 6.9 mph wind, 0% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Suspending Jerkbait (168); Blade Bait (168); Jighead Marabou Leech (162); Muddler Minnow (172) | None |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty all_purpose B | 21.6-39.9F, 6.9 mph wind, 0% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Finesse Jig (166); Bladed Jig (130); Lead-Eye Leech (162); Sculpin Streamer (180) | None |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty big_fish A | 21.6-39.9F, 6.9 mph wind, 0% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Medium-Diving Crankbait (142); Texas-Rigged Soft-Plastic Craw (156); Articulated Dungeon Streamer (156); Rabbit-Strip Leech (164) | None |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty big_fish B | 21.6-39.9F, 6.9 mph wind, 0% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Ned Rig (156); Spinnerbait (136); Sculpzilla (166); Game Changer (134) | None |

## Known Coverage Gaps

- calm_low_light_surface: not naturally produced by completed archive rows.
- calm_bright_clear_subtle: not naturally produced by completed archive rows.
- heat_limited_finesse: not naturally produced by completed archive rows.
- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- stable_pleasant_medium_confidence_archive: not naturally produced by completed archive rows.
- river_elevated_runoff_current: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.
- adjacent_day_change: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
