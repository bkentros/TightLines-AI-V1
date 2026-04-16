# Northern Pike V3 Audit Matrix

Generated: 2026-04-16T13:41:46.051Z

Fixed northern pike coverage grid for V3:
- 3 core monthly anchors across all 12 months
- 5 seasonal overlay anchors across 4 high-value months each

Total scenarios: 48
Core monthly scenarios: 36
Overlay scenarios: 12

## Why This Structure

- Stresses NORTHERN_CORE stained weed-lake behavior, Adirondack clear water, Rainy River current, Alaska interior, and reservoir/post-spawn edges without ad-hoc scenario drift.
- Keeps jerkbait, suspending, large-profile swimbait, spoon, and streamer lanes under seasonal pressure with realistic archive dates.

## Anchor Fisheries

| Anchor | Role | Region | Context | Default clarity | Notes |
|--------|------|--------|---------|-----------------|-------|
| Minnesota northwoods pike lake | core_monthly | great_lakes_upper_midwest | freshwater_lake_pond | stained | Prime northern-core stained weed-lake benchmark. Covers full-year pike posture from hard-water jerkbait through aggressive fall feedup. |
| New York Adirondack clear pike lake | core_monthly | northeast | freshwater_lake_pond | clear | Northern-core clear-water lake benchmark. Tests color discipline and finesse posture across seasons where perch/shad patterns dominate over firetiger. |
| Rainy River pike river system | core_monthly | great_lakes_upper_midwest | freshwater_river | stained | Northern-core river benchmark. Tests current-seam pike posture, spinnerbait and jerkbait in moving water, and distinct spring/fall river behavior. |
| Alaska interior pike lake | seasonal_overlay | alaska | freshwater_lake_pond | stained | Far-north Alaska lake overlay. Validates northern-core rows under extreme photoperiod and cold-window conditions for key open-water months. |
| North Dakota interior reservoir | seasonal_overlay | midwest_interior | freshwater_lake_pond | stained | Interior-edge prairie reservoir overlay. Tests the INTERIOR_EDGE row grouping where summer/fall seasons are condensed and early-year conditions are harsher. |
| Idaho mountain river pike | seasonal_overlay | inland_northwest | freshwater_river | clear | Mountain-region river overlay. Tests MOUNTAIN row behavior in a clear, cold river context with compressed seasons and finesse color posture. |

## Month Coverage

| Month | Core monthly | Seasonal overlays | Total |
|-------|--------------|-------------------|-------|
| Jan | 3 | 0 | 3 |
| Feb | 3 | 1 | 4 |
| Mar | 3 | 0 | 3 |
| Apr | 3 | 1 | 4 |
| May | 3 | 2 | 5 |
| Jun | 3 | 0 | 3 |
| Jul | 3 | 2 | 5 |
| Aug | 3 | 1 | 4 |
| Sep | 3 | 2 | 5 |
| Oct | 3 | 1 | 4 |
| Nov | 3 | 1 | 4 |
| Dec | 3 | 1 | 4 |

## Scenario List

Format:
- `id | label | region | context | local_date | default_clarity | role | focus_window`

- pike_matrix_minnesota_northwoods_lake_01 | Minnesota northwoods pike lake, winter control month 1 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-01-16 | stained | core_monthly | winter_control
- pike_matrix_minnesota_northwoods_lake_02 | Minnesota northwoods pike lake, prespawn opening month 2 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-02-19 | stained | core_monthly | prespawn_opening
- pike_matrix_minnesota_northwoods_lake_03 | Minnesota northwoods pike lake, prespawn opening month 3 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-03-20 | stained | core_monthly | prespawn_opening
- pike_matrix_minnesota_northwoods_lake_04 | Minnesota northwoods pike lake, spawn postspawn transition month 4 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-04-16 | stained | core_monthly | spawn_postspawn_transition
- pike_matrix_minnesota_northwoods_lake_05 | Minnesota northwoods pike lake, spawn postspawn transition month 5 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-05-15 | stained | core_monthly | spawn_postspawn_transition
- pike_matrix_minnesota_northwoods_lake_06 | Minnesota northwoods pike lake, summer positioning month 6 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-06-18 | stained | core_monthly | summer_positioning
- pike_matrix_minnesota_northwoods_lake_07 | Minnesota northwoods pike lake, summer positioning month 7 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-07-16 | stained | core_monthly | summer_positioning
- pike_matrix_minnesota_northwoods_lake_08 | Minnesota northwoods pike lake, summer positioning month 8 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-08-14 | stained | core_monthly | summer_positioning
- pike_matrix_minnesota_northwoods_lake_09 | Minnesota northwoods pike lake, fall transition month 9 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-09-17 | stained | core_monthly | fall_transition
- pike_matrix_minnesota_northwoods_lake_10 | Minnesota northwoods pike lake, fall transition month 10 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-10-15 | stained | core_monthly | fall_transition
- pike_matrix_minnesota_northwoods_lake_11 | Minnesota northwoods pike lake, fall transition month 11 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-11-12 | stained | core_monthly | fall_transition
- pike_matrix_minnesota_northwoods_lake_12 | Minnesota northwoods pike lake, winter control month 12 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-12-10 | stained | core_monthly | winter_control
- pike_matrix_new_york_adirondack_lake_01 | New York Adirondack clear pike lake, winter control month 1 | northeast | freshwater_lake_pond | 2025-01-16 | clear | core_monthly | winter_control
- pike_matrix_new_york_adirondack_lake_02 | New York Adirondack clear pike lake, prespawn opening month 2 | northeast | freshwater_lake_pond | 2025-02-19 | clear | core_monthly | prespawn_opening
- pike_matrix_new_york_adirondack_lake_03 | New York Adirondack clear pike lake, prespawn opening month 3 | northeast | freshwater_lake_pond | 2025-03-20 | clear | core_monthly | prespawn_opening
- pike_matrix_new_york_adirondack_lake_04 | New York Adirondack clear pike lake, spawn postspawn transition month 4 | northeast | freshwater_lake_pond | 2025-04-16 | clear | core_monthly | spawn_postspawn_transition
- pike_matrix_new_york_adirondack_lake_05 | New York Adirondack clear pike lake, spawn postspawn transition month 5 | northeast | freshwater_lake_pond | 2025-05-15 | clear | core_monthly | spawn_postspawn_transition
- pike_matrix_new_york_adirondack_lake_06 | New York Adirondack clear pike lake, summer positioning month 6 | northeast | freshwater_lake_pond | 2025-06-18 | clear | core_monthly | summer_positioning
- pike_matrix_new_york_adirondack_lake_07 | New York Adirondack clear pike lake, summer positioning month 7 | northeast | freshwater_lake_pond | 2025-07-16 | clear | core_monthly | summer_positioning
- pike_matrix_new_york_adirondack_lake_08 | New York Adirondack clear pike lake, summer positioning month 8 | northeast | freshwater_lake_pond | 2025-08-14 | clear | core_monthly | summer_positioning
- pike_matrix_new_york_adirondack_lake_09 | New York Adirondack clear pike lake, fall transition month 9 | northeast | freshwater_lake_pond | 2025-09-17 | clear | core_monthly | fall_transition
- pike_matrix_new_york_adirondack_lake_10 | New York Adirondack clear pike lake, fall transition month 10 | northeast | freshwater_lake_pond | 2025-10-15 | clear | core_monthly | fall_transition
- pike_matrix_new_york_adirondack_lake_11 | New York Adirondack clear pike lake, fall transition month 11 | northeast | freshwater_lake_pond | 2025-11-12 | clear | core_monthly | fall_transition
- pike_matrix_new_york_adirondack_lake_12 | New York Adirondack clear pike lake, winter control month 12 | northeast | freshwater_lake_pond | 2025-12-10 | clear | core_monthly | winter_control
- pike_matrix_rainy_river_pike_01 | Rainy River pike river system, winter control month 1 | great_lakes_upper_midwest | freshwater_river | 2025-01-16 | stained | core_monthly | winter_control
- pike_matrix_rainy_river_pike_02 | Rainy River pike river system, prespawn opening month 2 | great_lakes_upper_midwest | freshwater_river | 2025-02-19 | stained | core_monthly | prespawn_opening
- pike_matrix_rainy_river_pike_03 | Rainy River pike river system, prespawn opening month 3 | great_lakes_upper_midwest | freshwater_river | 2025-03-20 | stained | core_monthly | prespawn_opening
- pike_matrix_rainy_river_pike_04 | Rainy River pike river system, spawn postspawn transition month 4 | great_lakes_upper_midwest | freshwater_river | 2025-04-16 | stained | core_monthly | spawn_postspawn_transition
- pike_matrix_rainy_river_pike_05 | Rainy River pike river system, spawn postspawn transition month 5 | great_lakes_upper_midwest | freshwater_river | 2025-05-15 | stained | core_monthly | spawn_postspawn_transition
- pike_matrix_rainy_river_pike_06 | Rainy River pike river system, summer positioning month 6 | great_lakes_upper_midwest | freshwater_river | 2025-06-18 | stained | core_monthly | summer_positioning
- pike_matrix_rainy_river_pike_07 | Rainy River pike river system, summer positioning month 7 | great_lakes_upper_midwest | freshwater_river | 2025-07-16 | stained | core_monthly | summer_positioning
- pike_matrix_rainy_river_pike_08 | Rainy River pike river system, summer positioning month 8 | great_lakes_upper_midwest | freshwater_river | 2025-08-14 | stained | core_monthly | summer_positioning
- pike_matrix_rainy_river_pike_09 | Rainy River pike river system, fall transition month 9 | great_lakes_upper_midwest | freshwater_river | 2025-09-17 | stained | core_monthly | fall_transition
- pike_matrix_rainy_river_pike_10 | Rainy River pike river system, fall transition month 10 | great_lakes_upper_midwest | freshwater_river | 2025-10-15 | stained | core_monthly | fall_transition
- pike_matrix_rainy_river_pike_11 | Rainy River pike river system, fall transition month 11 | great_lakes_upper_midwest | freshwater_river | 2025-11-12 | stained | core_monthly | fall_transition
- pike_matrix_rainy_river_pike_12 | Rainy River pike river system, winter control month 12 | great_lakes_upper_midwest | freshwater_river | 2025-12-10 | stained | core_monthly | winter_control
- pike_matrix_alaska_pike_lake_05 | Alaska interior pike lake, spawn postspawn transition month 5 | alaska | freshwater_lake_pond | 2025-05-15 | stained | seasonal_overlay | spawn_postspawn_transition
- pike_matrix_alaska_pike_lake_07 | Alaska interior pike lake, summer positioning month 7 | alaska | freshwater_lake_pond | 2025-07-16 | stained | seasonal_overlay | summer_positioning
- pike_matrix_alaska_pike_lake_09 | Alaska interior pike lake, fall transition month 9 | alaska | freshwater_lake_pond | 2025-09-17 | stained | seasonal_overlay | fall_transition
- pike_matrix_alaska_pike_lake_11 | Alaska interior pike lake, fall transition month 11 | alaska | freshwater_lake_pond | 2025-11-12 | stained | seasonal_overlay | fall_transition
- pike_matrix_north_dakota_reservoir_02 | North Dakota interior reservoir, prespawn opening month 2 | midwest_interior | freshwater_lake_pond | 2025-02-19 | stained | seasonal_overlay | prespawn_opening
- pike_matrix_north_dakota_reservoir_05 | North Dakota interior reservoir, spawn postspawn transition month 5 | midwest_interior | freshwater_lake_pond | 2025-05-15 | stained | seasonal_overlay | spawn_postspawn_transition
- pike_matrix_north_dakota_reservoir_08 | North Dakota interior reservoir, summer positioning month 8 | midwest_interior | freshwater_lake_pond | 2025-08-14 | stained | seasonal_overlay | summer_positioning
- pike_matrix_north_dakota_reservoir_10 | North Dakota interior reservoir, fall transition month 10 | midwest_interior | freshwater_lake_pond | 2025-10-15 | stained | seasonal_overlay | fall_transition
- pike_matrix_idaho_mountain_river_04 | Idaho mountain river pike, spawn postspawn transition month 4 | inland_northwest | freshwater_river | 2025-04-16 | clear | seasonal_overlay | spawn_postspawn_transition
- pike_matrix_idaho_mountain_river_07 | Idaho mountain river pike, summer positioning month 7 | inland_northwest | freshwater_river | 2025-07-16 | clear | seasonal_overlay | summer_positioning
- pike_matrix_idaho_mountain_river_09 | Idaho mountain river pike, fall transition month 9 | inland_northwest | freshwater_river | 2025-09-17 | clear | seasonal_overlay | fall_transition
- pike_matrix_idaho_mountain_river_12 | Idaho mountain river pike, winter control month 12 | inland_northwest | freshwater_river | 2025-12-10 | clear | seasonal_overlay | winter_control

