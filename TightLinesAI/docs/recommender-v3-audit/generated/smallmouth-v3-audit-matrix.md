# Smallmouth V3 Audit Matrix

Generated: 2026-04-07T00:59:26.345Z

This matrix is the efficient smallmouth tuning structure for V3.
It extends the gold batches into a fixed coverage grid:
- 4 core anchors run across all 12 months
- 5 seasonal overlay anchors run across 4 high-value months each

Total scenarios: 83
Core monthly scenarios: 48
Overlay scenarios: 35

## Why This Is Faster

- It pressures both river and lake smallmouth evenly instead of drifting lake-heavy or river-heavy.
- It keeps the most important SMB lanes under stress: tube, Ned, hair, jerkbait, inline spinner, spinnerbait, swimbait, and baitfish streamer behavior.
- It helps us tune current-aware and clear-water behavior across months without re-picking scenarios from scratch.

## Anchor Fisheries

| Anchor | Role | Region | Context | Default clarity | Notes |
|--------|------|--------|---------|-----------------|-------|
| Great Lakes clear natural lake | core_monthly | great_lakes_upper_midwest | freshwater_lake_pond | clear | Primary clear-lake SMB benchmark for tube, drop-shot, topwater, jerkbait, and baitfish seasonal transitions. |
| Kentucky highland lake | core_monthly | south_central | freshwater_lake_pond | stained | Wind- and stain-sensitive smallmouth lake benchmark where spinnerbait, swimbait, and jerkbait lanes need to show correctly. |
| Tennessee current river | core_monthly | south_central | freshwater_river | stained | Core river benchmark for current seams, rock, spinnerbait, inline spinner, and bounded seasonal river behavior. |
| Pennsylvania clear river | core_monthly | great_lakes_upper_midwest | freshwater_river | clear | Clear-river benchmark for northern smallmouth seasonal tightening and baitfish-first behavior within the app's Great Lakes / Upper Midwest region map. |
| Wisconsin natural lake | seasonal_overlay | great_lakes_upper_midwest | freshwater_lake_pond | clear | Clear northern natural-lake overlay for spawn, summer bluebird, and baitfish/topwater tradeoffs. |
| Minnesota northern lake | seasonal_overlay | great_lakes_upper_midwest | freshwater_lake_pond | stained | Northern stained-lake overlay for fall baitfish tightening and winter discipline. |
| Colorado western river | seasonal_overlay | mountain_west | freshwater_river | clear | Western river overlay for postspawn soft-minnow/open-water behavior and cleaner fall-winter posture. |
| Washington inland river | seasonal_overlay | inland_northwest | freshwater_river | clear | Northwest river overlay for early-fall and cool-season baitfish/current reads. |
| Ohio dirty reservoir | seasonal_overlay | midwest_interior | freshwater_lake_pond | dirty | Dirty-water overlay for visible smallmouth lake/reservoir behavior in prespawn, summer stain, and winter control. |
| Willamette River smallmouth | seasonal_overlay | pacific_northwest | freshwater_river | clear | Northwest clear-river overlay for spring tube, summer topwater, September NORTHWEST_EARLY_FALL suspending window, and November cool-down tightening. |
| Northern California smallmouth river | seasonal_overlay | northern_california | freshwater_river | clear | NorCal clear-river overlay confirming spring tube, summer topwater, and fall jerkbait western river posture for northern_california SMB. |
| Connecticut River smallmouth | seasonal_overlay | northeast | freshwater_river | clear | Northeast clear-river overlay for the distinct northeast SMB rows: bold-topwater June override, and active-November jerkbait posture vs GLUM's winter-locked tube. |
| Illinois River dirty smallmouth | seasonal_overlay | great_lakes_upper_midwest | freshwater_river | dirty | GLUM dirty-river overlay: April spring where spinnerbait/ned_rig displace finesse tube via clarity penalty, July summer where ALL clear-water lures (tube, suspending, squarebill, walking, inline_spinner) are penalized and paddle_tail_swimbait wins as the only dirty-friendly option in GREAT_LAKES_CLEAR_SUMMER_RIVER, and October fall where spinnerbait displaces suspending_jerkbait. |

## Month Coverage

| Month | Core monthly | Seasonal overlays | Total |
|-------|--------------|-------------------|-------|
| Jan | 4 | 0 | 4 |
| Feb | 4 | 0 | 4 |
| Mar | 4 | 2 | 6 |
| Apr | 4 | 6 | 10 |
| May | 4 | 1 | 5 |
| Jun | 4 | 6 | 10 |
| Jul | 4 | 2 | 6 |
| Aug | 4 | 4 | 8 |
| Sep | 4 | 4 | 8 |
| Oct | 4 | 4 | 8 |
| Nov | 4 | 4 | 8 |
| Dec | 4 | 2 | 6 |

## Scenario List

Format:
- `id | label | region | context | local_date | default_clarity | role | focus_window`

- smb_matrix_great_lakes_clear_lake_01 | Great Lakes clear natural lake, winter control month 1 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-01-16 | clear | core_monthly | winter_control
- smb_matrix_great_lakes_clear_lake_02 | Great Lakes clear natural lake, prespawn opening month 2 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-02-19 | clear | core_monthly | prespawn_opening
- smb_matrix_great_lakes_clear_lake_03 | Great Lakes clear natural lake, prespawn opening month 3 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-03-20 | clear | core_monthly | prespawn_opening
- smb_matrix_great_lakes_clear_lake_04 | Great Lakes clear natural lake, spawn postspawn transition month 4 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-04-16 | clear | core_monthly | spawn_postspawn_transition
- smb_matrix_great_lakes_clear_lake_05 | Great Lakes clear natural lake, spawn postspawn transition month 5 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-05-15 | clear | core_monthly | spawn_postspawn_transition
- smb_matrix_great_lakes_clear_lake_06 | Great Lakes clear natural lake, summer positioning month 6 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-06-18 | clear | core_monthly | summer_positioning
- smb_matrix_great_lakes_clear_lake_07 | Great Lakes clear natural lake, summer positioning month 7 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-07-16 | clear | core_monthly | summer_positioning
- smb_matrix_great_lakes_clear_lake_08 | Great Lakes clear natural lake, summer positioning month 8 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-08-14 | clear | core_monthly | summer_positioning
- smb_matrix_great_lakes_clear_lake_09 | Great Lakes clear natural lake, fall transition month 9 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-09-17 | clear | core_monthly | fall_transition
- smb_matrix_great_lakes_clear_lake_10 | Great Lakes clear natural lake, fall transition month 10 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-10-15 | clear | core_monthly | fall_transition
- smb_matrix_great_lakes_clear_lake_11 | Great Lakes clear natural lake, fall transition month 11 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-11-12 | clear | core_monthly | fall_transition
- smb_matrix_great_lakes_clear_lake_12 | Great Lakes clear natural lake, winter control month 12 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-12-10 | clear | core_monthly | winter_control
- smb_matrix_kentucky_highland_lake_01 | Kentucky highland lake, winter control month 1 | south_central | freshwater_lake_pond | 2025-01-16 | stained | core_monthly | winter_control
- smb_matrix_kentucky_highland_lake_02 | Kentucky highland lake, prespawn opening month 2 | south_central | freshwater_lake_pond | 2025-02-19 | stained | core_monthly | prespawn_opening
- smb_matrix_kentucky_highland_lake_03 | Kentucky highland lake, prespawn opening month 3 | south_central | freshwater_lake_pond | 2025-03-20 | stained | core_monthly | prespawn_opening
- smb_matrix_kentucky_highland_lake_04 | Kentucky highland lake, spawn postspawn transition month 4 | south_central | freshwater_lake_pond | 2025-04-16 | stained | core_monthly | spawn_postspawn_transition
- smb_matrix_kentucky_highland_lake_05 | Kentucky highland lake, spawn postspawn transition month 5 | south_central | freshwater_lake_pond | 2025-05-15 | stained | core_monthly | spawn_postspawn_transition
- smb_matrix_kentucky_highland_lake_06 | Kentucky highland lake, summer positioning month 6 | south_central | freshwater_lake_pond | 2025-06-18 | stained | core_monthly | summer_positioning
- smb_matrix_kentucky_highland_lake_07 | Kentucky highland lake, summer positioning month 7 | south_central | freshwater_lake_pond | 2025-07-16 | stained | core_monthly | summer_positioning
- smb_matrix_kentucky_highland_lake_08 | Kentucky highland lake, summer positioning month 8 | south_central | freshwater_lake_pond | 2025-08-14 | stained | core_monthly | summer_positioning
- smb_matrix_kentucky_highland_lake_09 | Kentucky highland lake, fall transition month 9 | south_central | freshwater_lake_pond | 2025-09-17 | stained | core_monthly | fall_transition
- smb_matrix_kentucky_highland_lake_10 | Kentucky highland lake, fall transition month 10 | south_central | freshwater_lake_pond | 2025-10-15 | stained | core_monthly | fall_transition
- smb_matrix_kentucky_highland_lake_11 | Kentucky highland lake, fall transition month 11 | south_central | freshwater_lake_pond | 2025-11-12 | stained | core_monthly | fall_transition
- smb_matrix_kentucky_highland_lake_12 | Kentucky highland lake, winter control month 12 | south_central | freshwater_lake_pond | 2025-12-10 | stained | core_monthly | winter_control
- smb_matrix_tennessee_river_01 | Tennessee current river, winter control month 1 | south_central | freshwater_river | 2025-01-16 | stained | core_monthly | winter_control
- smb_matrix_tennessee_river_02 | Tennessee current river, prespawn opening month 2 | south_central | freshwater_river | 2025-02-19 | stained | core_monthly | prespawn_opening
- smb_matrix_tennessee_river_03 | Tennessee current river, prespawn opening month 3 | south_central | freshwater_river | 2025-03-20 | stained | core_monthly | prespawn_opening
- smb_matrix_tennessee_river_04 | Tennessee current river, spawn postspawn transition month 4 | south_central | freshwater_river | 2025-04-16 | stained | core_monthly | spawn_postspawn_transition
- smb_matrix_tennessee_river_05 | Tennessee current river, spawn postspawn transition month 5 | south_central | freshwater_river | 2025-05-15 | stained | core_monthly | spawn_postspawn_transition
- smb_matrix_tennessee_river_06 | Tennessee current river, summer positioning month 6 | south_central | freshwater_river | 2025-06-18 | stained | core_monthly | summer_positioning
- smb_matrix_tennessee_river_07 | Tennessee current river, summer positioning month 7 | south_central | freshwater_river | 2025-07-16 | stained | core_monthly | summer_positioning
- smb_matrix_tennessee_river_08 | Tennessee current river, summer positioning month 8 | south_central | freshwater_river | 2025-08-14 | stained | core_monthly | summer_positioning
- smb_matrix_tennessee_river_09 | Tennessee current river, fall transition month 9 | south_central | freshwater_river | 2025-09-17 | stained | core_monthly | fall_transition
- smb_matrix_tennessee_river_10 | Tennessee current river, fall transition month 10 | south_central | freshwater_river | 2025-10-15 | stained | core_monthly | fall_transition
- smb_matrix_tennessee_river_11 | Tennessee current river, fall transition month 11 | south_central | freshwater_river | 2025-11-12 | stained | core_monthly | fall_transition
- smb_matrix_tennessee_river_12 | Tennessee current river, winter control month 12 | south_central | freshwater_river | 2025-12-10 | stained | core_monthly | winter_control
- smb_matrix_pennsylvania_river_01 | Pennsylvania clear river, winter control month 1 | great_lakes_upper_midwest | freshwater_river | 2025-01-16 | clear | core_monthly | winter_control
- smb_matrix_pennsylvania_river_02 | Pennsylvania clear river, prespawn opening month 2 | great_lakes_upper_midwest | freshwater_river | 2025-02-19 | clear | core_monthly | prespawn_opening
- smb_matrix_pennsylvania_river_03 | Pennsylvania clear river, prespawn opening month 3 | great_lakes_upper_midwest | freshwater_river | 2025-03-20 | clear | core_monthly | prespawn_opening
- smb_matrix_pennsylvania_river_04 | Pennsylvania clear river, spawn postspawn transition month 4 | great_lakes_upper_midwest | freshwater_river | 2025-04-16 | clear | core_monthly | spawn_postspawn_transition
- smb_matrix_pennsylvania_river_05 | Pennsylvania clear river, spawn postspawn transition month 5 | great_lakes_upper_midwest | freshwater_river | 2025-05-15 | clear | core_monthly | spawn_postspawn_transition
- smb_matrix_pennsylvania_river_06 | Pennsylvania clear river, summer positioning month 6 | great_lakes_upper_midwest | freshwater_river | 2025-06-18 | clear | core_monthly | summer_positioning
- smb_matrix_pennsylvania_river_07 | Pennsylvania clear river, summer positioning month 7 | great_lakes_upper_midwest | freshwater_river | 2025-07-16 | clear | core_monthly | summer_positioning
- smb_matrix_pennsylvania_river_08 | Pennsylvania clear river, summer positioning month 8 | great_lakes_upper_midwest | freshwater_river | 2025-08-14 | clear | core_monthly | summer_positioning
- smb_matrix_pennsylvania_river_09 | Pennsylvania clear river, fall transition month 9 | great_lakes_upper_midwest | freshwater_river | 2025-09-17 | clear | core_monthly | fall_transition
- smb_matrix_pennsylvania_river_10 | Pennsylvania clear river, fall transition month 10 | great_lakes_upper_midwest | freshwater_river | 2025-10-15 | clear | core_monthly | fall_transition
- smb_matrix_pennsylvania_river_11 | Pennsylvania clear river, fall transition month 11 | great_lakes_upper_midwest | freshwater_river | 2025-11-12 | clear | core_monthly | fall_transition
- smb_matrix_pennsylvania_river_12 | Pennsylvania clear river, winter control month 12 | great_lakes_upper_midwest | freshwater_river | 2025-12-10 | clear | core_monthly | winter_control
- smb_matrix_wisconsin_natural_lake_05 | Wisconsin natural lake, spawn postspawn transition month 5 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-05-15 | clear | seasonal_overlay | spawn_postspawn_transition
- smb_matrix_wisconsin_natural_lake_06 | Wisconsin natural lake, summer positioning month 6 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-06-18 | clear | seasonal_overlay | summer_positioning
- smb_matrix_wisconsin_natural_lake_08 | Wisconsin natural lake, summer positioning month 8 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-08-14 | clear | seasonal_overlay | summer_positioning
- smb_matrix_wisconsin_natural_lake_10 | Wisconsin natural lake, fall transition month 10 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-10-15 | clear | seasonal_overlay | fall_transition
- smb_matrix_minnesota_fall_lake_04 | Minnesota northern lake, spawn postspawn transition month 4 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-04-16 | stained | seasonal_overlay | spawn_postspawn_transition
- smb_matrix_minnesota_fall_lake_08 | Minnesota northern lake, summer positioning month 8 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-08-14 | stained | seasonal_overlay | summer_positioning
- smb_matrix_minnesota_fall_lake_10 | Minnesota northern lake, fall transition month 10 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-10-15 | stained | seasonal_overlay | fall_transition
- smb_matrix_minnesota_fall_lake_11 | Minnesota northern lake, fall transition month 11 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-11-12 | stained | seasonal_overlay | fall_transition
- smb_matrix_colorado_river_03 | Colorado western river, prespawn opening month 3 | mountain_west | freshwater_river | 2025-03-20 | clear | seasonal_overlay | prespawn_opening
- smb_matrix_colorado_river_06 | Colorado western river, summer positioning month 6 | mountain_west | freshwater_river | 2025-06-18 | clear | seasonal_overlay | summer_positioning
- smb_matrix_colorado_river_09 | Colorado western river, fall transition month 9 | mountain_west | freshwater_river | 2025-09-17 | clear | seasonal_overlay | fall_transition
- smb_matrix_colorado_river_12 | Colorado western river, winter control month 12 | mountain_west | freshwater_river | 2025-12-10 | clear | seasonal_overlay | winter_control
- smb_matrix_washington_river_04 | Washington inland river, spawn postspawn transition month 4 | inland_northwest | freshwater_river | 2025-04-16 | clear | seasonal_overlay | spawn_postspawn_transition
- smb_matrix_washington_river_07 | Washington inland river, summer positioning month 7 | inland_northwest | freshwater_river | 2025-07-16 | clear | seasonal_overlay | summer_positioning
- smb_matrix_washington_river_09 | Washington inland river, fall transition month 9 | inland_northwest | freshwater_river | 2025-09-17 | clear | seasonal_overlay | fall_transition
- smb_matrix_washington_river_11 | Washington inland river, fall transition month 11 | inland_northwest | freshwater_river | 2025-11-12 | clear | seasonal_overlay | fall_transition
- smb_matrix_ohio_dirty_reservoir_04 | Ohio dirty reservoir, spawn postspawn transition month 4 | midwest_interior | freshwater_lake_pond | 2025-04-16 | dirty | seasonal_overlay | spawn_postspawn_transition
- smb_matrix_ohio_dirty_reservoir_06 | Ohio dirty reservoir, summer positioning month 6 | midwest_interior | freshwater_lake_pond | 2025-06-18 | dirty | seasonal_overlay | summer_positioning
- smb_matrix_ohio_dirty_reservoir_08 | Ohio dirty reservoir, summer positioning month 8 | midwest_interior | freshwater_lake_pond | 2025-08-14 | dirty | seasonal_overlay | summer_positioning
- smb_matrix_ohio_dirty_reservoir_12 | Ohio dirty reservoir, winter control month 12 | midwest_interior | freshwater_lake_pond | 2025-12-10 | dirty | seasonal_overlay | winter_control
- smb_matrix_willamette_river_smb_04 | Willamette River smallmouth, spawn postspawn transition month 4 | pacific_northwest | freshwater_river | 2025-04-16 | clear | seasonal_overlay | spawn_postspawn_transition
- smb_matrix_willamette_river_smb_06 | Willamette River smallmouth, summer positioning month 6 | pacific_northwest | freshwater_river | 2025-06-18 | clear | seasonal_overlay | summer_positioning
- smb_matrix_willamette_river_smb_09 | Willamette River smallmouth, fall transition month 9 | pacific_northwest | freshwater_river | 2025-09-17 | clear | seasonal_overlay | fall_transition
- smb_matrix_willamette_river_smb_11 | Willamette River smallmouth, fall transition month 11 | pacific_northwest | freshwater_river | 2025-11-12 | clear | seasonal_overlay | fall_transition
- smb_matrix_northern_california_smb_river_03 | Northern California smallmouth river, prespawn opening month 3 | northern_california | freshwater_river | 2025-03-20 | clear | seasonal_overlay | prespawn_opening
- smb_matrix_northern_california_smb_river_06 | Northern California smallmouth river, summer positioning month 6 | northern_california | freshwater_river | 2025-06-18 | clear | seasonal_overlay | summer_positioning
- smb_matrix_northern_california_smb_river_08 | Northern California smallmouth river, summer positioning month 8 | northern_california | freshwater_river | 2025-08-14 | clear | seasonal_overlay | summer_positioning
- smb_matrix_northern_california_smb_river_10 | Northern California smallmouth river, fall transition month 10 | northern_california | freshwater_river | 2025-10-15 | clear | seasonal_overlay | fall_transition
- smb_matrix_northeast_connecticut_river_04 | Connecticut River smallmouth, spawn postspawn transition month 4 | northeast | freshwater_river | 2025-04-16 | clear | seasonal_overlay | spawn_postspawn_transition
- smb_matrix_northeast_connecticut_river_06 | Connecticut River smallmouth, summer positioning month 6 | northeast | freshwater_river | 2025-06-18 | clear | seasonal_overlay | summer_positioning
- smb_matrix_northeast_connecticut_river_09 | Connecticut River smallmouth, fall transition month 9 | northeast | freshwater_river | 2025-09-17 | clear | seasonal_overlay | fall_transition
- smb_matrix_northeast_connecticut_river_11 | Connecticut River smallmouth, fall transition month 11 | northeast | freshwater_river | 2025-11-12 | clear | seasonal_overlay | fall_transition
- smb_matrix_illinois_river_smb_04 | Illinois River dirty smallmouth, spawn postspawn transition month 4 | great_lakes_upper_midwest | freshwater_river | 2025-04-16 | dirty | seasonal_overlay | spawn_postspawn_transition
- smb_matrix_illinois_river_smb_07 | Illinois River dirty smallmouth, summer positioning month 7 | great_lakes_upper_midwest | freshwater_river | 2025-07-16 | dirty | seasonal_overlay | summer_positioning
- smb_matrix_illinois_river_smb_10 | Illinois River dirty smallmouth, fall transition month 10 | great_lakes_upper_midwest | freshwater_river | 2025-10-15 | dirty | seasonal_overlay | fall_transition

