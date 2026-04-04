# Trout V3 Audit Matrix

Generated: 2026-04-04T21:02:33.204Z

This matrix is the efficient trout tuning structure for V3.
It extends the gold batches into a fixed river-only coverage grid:
- 4 core river anchors run across all 12 months
- 5 seasonal overlay anchors run across 4 high-value months each

Total scenarios: 68
Core monthly scenarios: 48
Overlay scenarios: 20

## Why This Is Faster

- It pressures trout river logic across cold classic, western, Appalachian tailwater, and Pacific Northwest water without hand-picking every pass from scratch.
- It keeps streamer-minded trout lanes under stress: sculpin, bugger, leech, slim-minnow, articulated baitfish, spinner, and restrained jerkbait support.
- It forces warm-tailwater summer restraint and fall baitfish openings to coexist cleanly under one deterministic model.

## Anchor Fisheries

| Anchor | Role | Region | Context | Default clarity | Notes |
|--------|------|--------|---------|-----------------|-------|
| Appalachian clear tailwater | core_monthly | appalachian | freshwater_river | clear | Core trout restraint benchmark for tailwater winter control, bluebird summer tightening, and flow-bump minnow windows. |
| Northeast freestone river | core_monthly | northeast | freshwater_river | clear | Core northern freestone benchmark for winter subtlety, spring minnow openings, and late-fall high-water discipline. |
| Mountain West trout river | core_monthly | mountain_west | freshwater_river | clear | Core western trout benchmark for shoulder-season minnow control, runoff-edge transitions, and clear fall baitfish streamer behavior. |
| Pacific Northwest trout river | core_monthly | pacific_northwest | freshwater_river | clear | Core northwest benchmark for early-summer streamer openings, low-water summer control, and late-fall minnow tightening. |
| Northern California trout river | seasonal_overlay | northern_california | freshwater_river | clear | Fall and shoulder-season western overlay where articulated baitfish, game changer, and late-fall control must stay sensible. |
| Great Lakes / Upper Midwest trout river | seasonal_overlay | great_lakes_upper_midwest | freshwater_river | stained | Northern high-water overlay for stained visibility, late-fall tightening, and spring cold-water discipline. |
| Alaska trout river | seasonal_overlay | alaska | freshwater_river | clear | Big-water trout overlay for strong fall baitfish windows and early-winter heavy-streamer control. |
| Idaho runoff-edge trout river | seasonal_overlay | mountain_west | freshwater_river | stained | Runoff-edge overlay to stress trout visibility, spinner support, and midsummer restraint when the water has color. |
| South-central tailwater trout river | seasonal_overlay | south_central | freshwater_river | stained | Warm-tailwater overlay for stained generation pulses, summer restraint, and current-aware trout reads outside classic coldwater regions. |

## Month Coverage

| Month | Core monthly | Seasonal overlays | Total |
|-------|--------------|-------------------|-------|
| Jan | 4 | 0 | 4 |
| Feb | 4 | 1 | 5 |
| Mar | 4 | 1 | 5 |
| Apr | 4 | 2 | 6 |
| May | 4 | 1 | 5 |
| Jun | 4 | 3 | 7 |
| Jul | 4 | 2 | 6 |
| Aug | 4 | 2 | 6 |
| Sep | 4 | 2 | 6 |
| Oct | 4 | 2 | 6 |
| Nov | 4 | 3 | 7 |
| Dec | 4 | 1 | 5 |

## Scenario List

Format:
- `id | label | region | context | local_date | default_clarity | role | focus_window`

- trout_matrix_appalachian_tailwater_01 | Appalachian clear tailwater, winter control month 1 | appalachian | freshwater_river | 2025-01-16 | clear | core_monthly | winter_control
- trout_matrix_appalachian_tailwater_02 | Appalachian clear tailwater, prespawn opening month 2 | appalachian | freshwater_river | 2025-02-19 | clear | core_monthly | prespawn_opening
- trout_matrix_appalachian_tailwater_03 | Appalachian clear tailwater, prespawn opening month 3 | appalachian | freshwater_river | 2025-03-20 | clear | core_monthly | prespawn_opening
- trout_matrix_appalachian_tailwater_04 | Appalachian clear tailwater, spawn postspawn transition month 4 | appalachian | freshwater_river | 2025-04-16 | clear | core_monthly | spawn_postspawn_transition
- trout_matrix_appalachian_tailwater_05 | Appalachian clear tailwater, spawn postspawn transition month 5 | appalachian | freshwater_river | 2025-05-15 | clear | core_monthly | spawn_postspawn_transition
- trout_matrix_appalachian_tailwater_06 | Appalachian clear tailwater, summer positioning month 6 | appalachian | freshwater_river | 2025-06-18 | clear | core_monthly | summer_positioning
- trout_matrix_appalachian_tailwater_07 | Appalachian clear tailwater, summer positioning month 7 | appalachian | freshwater_river | 2025-07-16 | clear | core_monthly | summer_positioning
- trout_matrix_appalachian_tailwater_08 | Appalachian clear tailwater, summer positioning month 8 | appalachian | freshwater_river | 2025-08-14 | clear | core_monthly | summer_positioning
- trout_matrix_appalachian_tailwater_09 | Appalachian clear tailwater, fall transition month 9 | appalachian | freshwater_river | 2025-09-17 | clear | core_monthly | fall_transition
- trout_matrix_appalachian_tailwater_10 | Appalachian clear tailwater, fall transition month 10 | appalachian | freshwater_river | 2025-10-15 | clear | core_monthly | fall_transition
- trout_matrix_appalachian_tailwater_11 | Appalachian clear tailwater, fall transition month 11 | appalachian | freshwater_river | 2025-11-12 | clear | core_monthly | fall_transition
- trout_matrix_appalachian_tailwater_12 | Appalachian clear tailwater, winter control month 12 | appalachian | freshwater_river | 2025-12-10 | clear | core_monthly | winter_control
- trout_matrix_northeast_freestone_01 | Northeast freestone river, winter control month 1 | northeast | freshwater_river | 2025-01-16 | clear | core_monthly | winter_control
- trout_matrix_northeast_freestone_02 | Northeast freestone river, prespawn opening month 2 | northeast | freshwater_river | 2025-02-19 | clear | core_monthly | prespawn_opening
- trout_matrix_northeast_freestone_03 | Northeast freestone river, prespawn opening month 3 | northeast | freshwater_river | 2025-03-20 | clear | core_monthly | prespawn_opening
- trout_matrix_northeast_freestone_04 | Northeast freestone river, spawn postspawn transition month 4 | northeast | freshwater_river | 2025-04-16 | clear | core_monthly | spawn_postspawn_transition
- trout_matrix_northeast_freestone_05 | Northeast freestone river, spawn postspawn transition month 5 | northeast | freshwater_river | 2025-05-15 | clear | core_monthly | spawn_postspawn_transition
- trout_matrix_northeast_freestone_06 | Northeast freestone river, summer positioning month 6 | northeast | freshwater_river | 2025-06-18 | clear | core_monthly | summer_positioning
- trout_matrix_northeast_freestone_07 | Northeast freestone river, summer positioning month 7 | northeast | freshwater_river | 2025-07-16 | clear | core_monthly | summer_positioning
- trout_matrix_northeast_freestone_08 | Northeast freestone river, summer positioning month 8 | northeast | freshwater_river | 2025-08-14 | clear | core_monthly | summer_positioning
- trout_matrix_northeast_freestone_09 | Northeast freestone river, fall transition month 9 | northeast | freshwater_river | 2025-09-17 | clear | core_monthly | fall_transition
- trout_matrix_northeast_freestone_10 | Northeast freestone river, fall transition month 10 | northeast | freshwater_river | 2025-10-15 | clear | core_monthly | fall_transition
- trout_matrix_northeast_freestone_11 | Northeast freestone river, fall transition month 11 | northeast | freshwater_river | 2025-11-12 | clear | core_monthly | fall_transition
- trout_matrix_northeast_freestone_12 | Northeast freestone river, winter control month 12 | northeast | freshwater_river | 2025-12-10 | clear | core_monthly | winter_control
- trout_matrix_mountain_west_river_01 | Mountain West trout river, winter control month 1 | mountain_west | freshwater_river | 2025-01-16 | clear | core_monthly | winter_control
- trout_matrix_mountain_west_river_02 | Mountain West trout river, prespawn opening month 2 | mountain_west | freshwater_river | 2025-02-19 | clear | core_monthly | prespawn_opening
- trout_matrix_mountain_west_river_03 | Mountain West trout river, prespawn opening month 3 | mountain_west | freshwater_river | 2025-03-20 | clear | core_monthly | prespawn_opening
- trout_matrix_mountain_west_river_04 | Mountain West trout river, spawn postspawn transition month 4 | mountain_west | freshwater_river | 2025-04-16 | clear | core_monthly | spawn_postspawn_transition
- trout_matrix_mountain_west_river_05 | Mountain West trout river, spawn postspawn transition month 5 | mountain_west | freshwater_river | 2025-05-15 | clear | core_monthly | spawn_postspawn_transition
- trout_matrix_mountain_west_river_06 | Mountain West trout river, summer positioning month 6 | mountain_west | freshwater_river | 2025-06-18 | clear | core_monthly | summer_positioning
- trout_matrix_mountain_west_river_07 | Mountain West trout river, summer positioning month 7 | mountain_west | freshwater_river | 2025-07-16 | clear | core_monthly | summer_positioning
- trout_matrix_mountain_west_river_08 | Mountain West trout river, summer positioning month 8 | mountain_west | freshwater_river | 2025-08-14 | clear | core_monthly | summer_positioning
- trout_matrix_mountain_west_river_09 | Mountain West trout river, fall transition month 9 | mountain_west | freshwater_river | 2025-09-17 | clear | core_monthly | fall_transition
- trout_matrix_mountain_west_river_10 | Mountain West trout river, fall transition month 10 | mountain_west | freshwater_river | 2025-10-15 | clear | core_monthly | fall_transition
- trout_matrix_mountain_west_river_11 | Mountain West trout river, fall transition month 11 | mountain_west | freshwater_river | 2025-11-12 | clear | core_monthly | fall_transition
- trout_matrix_mountain_west_river_12 | Mountain West trout river, winter control month 12 | mountain_west | freshwater_river | 2025-12-10 | clear | core_monthly | winter_control
- trout_matrix_pacific_northwest_river_01 | Pacific Northwest trout river, winter control month 1 | pacific_northwest | freshwater_river | 2025-01-16 | clear | core_monthly | winter_control
- trout_matrix_pacific_northwest_river_02 | Pacific Northwest trout river, prespawn opening month 2 | pacific_northwest | freshwater_river | 2025-02-19 | clear | core_monthly | prespawn_opening
- trout_matrix_pacific_northwest_river_03 | Pacific Northwest trout river, prespawn opening month 3 | pacific_northwest | freshwater_river | 2025-03-20 | clear | core_monthly | prespawn_opening
- trout_matrix_pacific_northwest_river_04 | Pacific Northwest trout river, spawn postspawn transition month 4 | pacific_northwest | freshwater_river | 2025-04-16 | clear | core_monthly | spawn_postspawn_transition
- trout_matrix_pacific_northwest_river_05 | Pacific Northwest trout river, spawn postspawn transition month 5 | pacific_northwest | freshwater_river | 2025-05-15 | clear | core_monthly | spawn_postspawn_transition
- trout_matrix_pacific_northwest_river_06 | Pacific Northwest trout river, summer positioning month 6 | pacific_northwest | freshwater_river | 2025-06-18 | clear | core_monthly | summer_positioning
- trout_matrix_pacific_northwest_river_07 | Pacific Northwest trout river, summer positioning month 7 | pacific_northwest | freshwater_river | 2025-07-16 | clear | core_monthly | summer_positioning
- trout_matrix_pacific_northwest_river_08 | Pacific Northwest trout river, summer positioning month 8 | pacific_northwest | freshwater_river | 2025-08-14 | clear | core_monthly | summer_positioning
- trout_matrix_pacific_northwest_river_09 | Pacific Northwest trout river, fall transition month 9 | pacific_northwest | freshwater_river | 2025-09-17 | clear | core_monthly | fall_transition
- trout_matrix_pacific_northwest_river_10 | Pacific Northwest trout river, fall transition month 10 | pacific_northwest | freshwater_river | 2025-10-15 | clear | core_monthly | fall_transition
- trout_matrix_pacific_northwest_river_11 | Pacific Northwest trout river, fall transition month 11 | pacific_northwest | freshwater_river | 2025-11-12 | clear | core_monthly | fall_transition
- trout_matrix_pacific_northwest_river_12 | Pacific Northwest trout river, winter control month 12 | pacific_northwest | freshwater_river | 2025-12-10 | clear | core_monthly | winter_control
- trout_matrix_northern_california_fall_02 | Northern California trout river, prespawn opening month 2 | northern_california | freshwater_river | 2025-02-19 | clear | seasonal_overlay | prespawn_opening
- trout_matrix_northern_california_fall_09 | Northern California trout river, fall transition month 9 | northern_california | freshwater_river | 2025-09-17 | clear | seasonal_overlay | fall_transition
- trout_matrix_northern_california_fall_10 | Northern California trout river, fall transition month 10 | northern_california | freshwater_river | 2025-10-15 | clear | seasonal_overlay | fall_transition
- trout_matrix_northern_california_fall_11 | Northern California trout river, fall transition month 11 | northern_california | freshwater_river | 2025-11-12 | clear | seasonal_overlay | fall_transition
- trout_matrix_great_lakes_highwater_03 | Great Lakes / Upper Midwest trout river, prespawn opening month 3 | great_lakes_upper_midwest | freshwater_river | 2025-03-20 | stained | seasonal_overlay | prespawn_opening
- trout_matrix_great_lakes_highwater_05 | Great Lakes / Upper Midwest trout river, spawn postspawn transition month 5 | great_lakes_upper_midwest | freshwater_river | 2025-05-15 | stained | seasonal_overlay | spawn_postspawn_transition
- trout_matrix_great_lakes_highwater_10 | Great Lakes / Upper Midwest trout river, fall transition month 10 | great_lakes_upper_midwest | freshwater_river | 2025-10-15 | stained | seasonal_overlay | fall_transition
- trout_matrix_great_lakes_highwater_11 | Great Lakes / Upper Midwest trout river, fall transition month 11 | great_lakes_upper_midwest | freshwater_river | 2025-11-12 | stained | seasonal_overlay | fall_transition
- trout_matrix_alaska_big_river_06 | Alaska trout river, summer positioning month 6 | alaska | freshwater_river | 2025-06-18 | clear | seasonal_overlay | summer_positioning
- trout_matrix_alaska_big_river_09 | Alaska trout river, fall transition month 9 | alaska | freshwater_river | 2025-09-17 | clear | seasonal_overlay | fall_transition
- trout_matrix_alaska_big_river_11 | Alaska trout river, fall transition month 11 | alaska | freshwater_river | 2025-11-12 | clear | seasonal_overlay | fall_transition
- trout_matrix_alaska_big_river_12 | Alaska trout river, winter control month 12 | alaska | freshwater_river | 2025-12-10 | clear | seasonal_overlay | winter_control
- trout_matrix_idaho_runoff_edge_04 | Idaho runoff-edge trout river, spawn postspawn transition month 4 | mountain_west | freshwater_river | 2025-04-16 | stained | seasonal_overlay | spawn_postspawn_transition
- trout_matrix_idaho_runoff_edge_06 | Idaho runoff-edge trout river, summer positioning month 6 | mountain_west | freshwater_river | 2025-06-18 | stained | seasonal_overlay | summer_positioning
- trout_matrix_idaho_runoff_edge_07 | Idaho runoff-edge trout river, summer positioning month 7 | mountain_west | freshwater_river | 2025-07-16 | stained | seasonal_overlay | summer_positioning
- trout_matrix_idaho_runoff_edge_08 | Idaho runoff-edge trout river, summer positioning month 8 | mountain_west | freshwater_river | 2025-08-14 | stained | seasonal_overlay | summer_positioning
- trout_matrix_south_central_tailwater_04 | South-central tailwater trout river, spawn postspawn transition month 4 | south_central | freshwater_river | 2025-04-16 | stained | seasonal_overlay | spawn_postspawn_transition
- trout_matrix_south_central_tailwater_06 | South-central tailwater trout river, summer positioning month 6 | south_central | freshwater_river | 2025-06-18 | stained | seasonal_overlay | summer_positioning
- trout_matrix_south_central_tailwater_07 | South-central tailwater trout river, summer positioning month 7 | south_central | freshwater_river | 2025-07-16 | stained | seasonal_overlay | summer_positioning
- trout_matrix_south_central_tailwater_08 | South-central tailwater trout river, summer positioning month 8 | south_central | freshwater_river | 2025-08-14 | stained | seasonal_overlay | summer_positioning

