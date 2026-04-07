# Largemouth V3 Audit Matrix

Generated: 2026-04-07T00:59:26.411Z

This matrix is the efficient largemouth tuning structure for V3.
It replaces ad-hoc scenario picking with a fixed coverage grid:
- 4 core anchors run across all 12 months
- 5 seasonal overlay anchors run across 4 high-value months each

Total scenarios: 90
Core monthly scenarios: 48
Overlay scenarios: 42

## Why This Is Faster

- It gives us monthly seasonal coverage without having to hand-pick every next batch from scratch.
- It keeps the most important largemouth archetypes under pressure: tropical lake, reservoir, river, northern clear lake, grass lake, highland reservoir, Delta, and shad reservoirs.
- It lets us tune one failure class against a stable matrix instead of chasing random scenario drift.

## Anchor Fisheries

| Anchor | Role | Region | Context | Default clarity | Notes |
|--------|------|--------|---------|-----------------|-------|
| Florida shallow natural lake | core_monthly | florida | freshwater_lake_pond | stained | Tropical largemouth benchmark for winter control, early prespawn openings, and long warm-season grass behavior. |
| Texas reservoir | core_monthly | south_central | freshwater_lake_pond | stained | South-central reservoir benchmark for windy baitfish windows, winter tightening, and fall shad behavior. |
| Alabama river current system | core_monthly | south_central | freshwater_river | stained | River largemouth benchmark for current seams, dirty-water cover lanes, and bounded warm-season river behavior. |
| New York natural lake | core_monthly | northeast | freshwater_lake_pond | clear | Northern clear-lake benchmark for finesse, cooler seasonal posture, and restrained surface behavior. |
| Georgia highland reservoir | seasonal_overlay | south_central | freshwater_lake_pond | clear | Clear highland-reservoir overlay for spring baitfish reads and cleaner color behavior. |
| Louisiana grass lake | seasonal_overlay | gulf_coast | freshwater_lake_pond | stained | Southern grass overlay for early-fall topwater, frog, swim-jig, and spinnerbait lanes. |
| Ozarks reservoir | seasonal_overlay | midwest_interior | freshwater_lake_pond | clear | Shad-transition and inland-reservoir overlay for fall and cold-season crankbait / jerkbait behavior. |
| Minnesota weed lake | seasonal_overlay | great_lakes_upper_midwest | freshwater_lake_pond | clear | Northern weedline overlay for midsummer edge behavior and bluebird adjustments. |
| California Delta freshwater reach | seasonal_overlay | northern_california | freshwater_river | stained | Western tidal-fresh overlay for grass/current behavior and late-fall stained-water largemouth lanes. |
| Southern California reservoir | seasonal_overlay | southern_california | freshwater_lake_pond | stained | Warm western reservoir overlay for mild-winter control, early prespawn craw reads, summer topwater, and fall shad behavior. |
| Pacific Northwest bass lake | seasonal_overlay | pacific_northwest | freshwater_lake_pond | stained | Northwest lake overlay for extended prespawn (spawn is June), summer shallow behavior, and November winter-onset tightening. |
| Colorado highland reservoir | seasonal_overlay | mountain_west | freshwater_lake_pond | clear | Mountain West clear-lake overlay for cold-season winter control, late prespawn (spawn is June), summer topwater, and fall baitfish transition. |
| Maine clear natural lake | seasonal_overlay | northeast | freshwater_lake_pond | clear | Northeast clear-lake overlay for the distinct northeast LMB rows: jerkbait-first winter, finesse-spawn, wacky/perch summer, and active-fall-through-November posture. |
| Gulf Coast dirty grass lake | seasonal_overlay | gulf_coast | freshwater_lake_pond | dirty | Dirty-water gulf_coast overlay: validates GULF_DIRTY_PRESPAWN_GRASS_LAKE (spinnerbait-led March), early-fall dirty window where walking_topwater is penalized and buzzbait/swim_jig/bladed_jig surface, and October FALL_LAKE dirty behavior where spinnerbait dominates. |
| Midwest dirty backwater lake | seasonal_overlay | midwest_interior | freshwater_lake_pond | dirty | Dirty-water midwest_interior overlay: tests generic dirty clarity impact on PRESPAWN_LAKE (football jig holds via forage), SUMMER_LAKE (walking_topwater displaced by buzzbait/hollow_body_frog), and FALL_LAKE (spinnerbait confirmed). |

## Month Coverage

| Month | Core monthly | Seasonal overlays | Total |
|-------|--------------|-------------------|-------|
| Jan | 4 | 2 | 6 |
| Feb | 4 | 3 | 7 |
| Mar | 4 | 5 | 9 |
| Apr | 4 | 2 | 6 |
| May | 4 | 5 | 9 |
| Jun | 4 | 3 | 7 |
| Jul | 4 | 4 | 8 |
| Aug | 4 | 3 | 7 |
| Sep | 4 | 3 | 7 |
| Oct | 4 | 7 | 11 |
| Nov | 4 | 4 | 8 |
| Dec | 4 | 1 | 5 |

## Scenario List

Format:
- `id | label | region | context | local_date | default_clarity | role | focus_window`

- lmb_matrix_florida_lake_01 | Florida shallow natural lake, winter control month 1 | florida | freshwater_lake_pond | 2025-01-16 | stained | core_monthly | winter_control
- lmb_matrix_florida_lake_02 | Florida shallow natural lake, prespawn opening month 2 | florida | freshwater_lake_pond | 2025-02-19 | stained | core_monthly | prespawn_opening
- lmb_matrix_florida_lake_03 | Florida shallow natural lake, prespawn opening month 3 | florida | freshwater_lake_pond | 2025-03-20 | stained | core_monthly | prespawn_opening
- lmb_matrix_florida_lake_04 | Florida shallow natural lake, spawn postspawn transition month 4 | florida | freshwater_lake_pond | 2025-04-16 | stained | core_monthly | spawn_postspawn_transition
- lmb_matrix_florida_lake_05 | Florida shallow natural lake, spawn postspawn transition month 5 | florida | freshwater_lake_pond | 2025-05-15 | stained | core_monthly | spawn_postspawn_transition
- lmb_matrix_florida_lake_06 | Florida shallow natural lake, summer positioning month 6 | florida | freshwater_lake_pond | 2025-06-18 | stained | core_monthly | summer_positioning
- lmb_matrix_florida_lake_07 | Florida shallow natural lake, summer positioning month 7 | florida | freshwater_lake_pond | 2025-07-16 | stained | core_monthly | summer_positioning
- lmb_matrix_florida_lake_08 | Florida shallow natural lake, summer positioning month 8 | florida | freshwater_lake_pond | 2025-08-14 | stained | core_monthly | summer_positioning
- lmb_matrix_florida_lake_09 | Florida shallow natural lake, fall transition month 9 | florida | freshwater_lake_pond | 2025-09-17 | stained | core_monthly | fall_transition
- lmb_matrix_florida_lake_10 | Florida shallow natural lake, fall transition month 10 | florida | freshwater_lake_pond | 2025-10-15 | stained | core_monthly | fall_transition
- lmb_matrix_florida_lake_11 | Florida shallow natural lake, fall transition month 11 | florida | freshwater_lake_pond | 2025-11-12 | stained | core_monthly | fall_transition
- lmb_matrix_florida_lake_12 | Florida shallow natural lake, winter control month 12 | florida | freshwater_lake_pond | 2025-12-10 | stained | core_monthly | winter_control
- lmb_matrix_texas_reservoir_01 | Texas reservoir, winter control month 1 | south_central | freshwater_lake_pond | 2025-01-16 | stained | core_monthly | winter_control
- lmb_matrix_texas_reservoir_02 | Texas reservoir, prespawn opening month 2 | south_central | freshwater_lake_pond | 2025-02-19 | stained | core_monthly | prespawn_opening
- lmb_matrix_texas_reservoir_03 | Texas reservoir, prespawn opening month 3 | south_central | freshwater_lake_pond | 2025-03-20 | stained | core_monthly | prespawn_opening
- lmb_matrix_texas_reservoir_04 | Texas reservoir, spawn postspawn transition month 4 | south_central | freshwater_lake_pond | 2025-04-16 | stained | core_monthly | spawn_postspawn_transition
- lmb_matrix_texas_reservoir_05 | Texas reservoir, spawn postspawn transition month 5 | south_central | freshwater_lake_pond | 2025-05-15 | stained | core_monthly | spawn_postspawn_transition
- lmb_matrix_texas_reservoir_06 | Texas reservoir, summer positioning month 6 | south_central | freshwater_lake_pond | 2025-06-18 | stained | core_monthly | summer_positioning
- lmb_matrix_texas_reservoir_07 | Texas reservoir, summer positioning month 7 | south_central | freshwater_lake_pond | 2025-07-16 | stained | core_monthly | summer_positioning
- lmb_matrix_texas_reservoir_08 | Texas reservoir, summer positioning month 8 | south_central | freshwater_lake_pond | 2025-08-14 | stained | core_monthly | summer_positioning
- lmb_matrix_texas_reservoir_09 | Texas reservoir, fall transition month 9 | south_central | freshwater_lake_pond | 2025-09-17 | stained | core_monthly | fall_transition
- lmb_matrix_texas_reservoir_10 | Texas reservoir, fall transition month 10 | south_central | freshwater_lake_pond | 2025-10-15 | stained | core_monthly | fall_transition
- lmb_matrix_texas_reservoir_11 | Texas reservoir, fall transition month 11 | south_central | freshwater_lake_pond | 2025-11-12 | stained | core_monthly | fall_transition
- lmb_matrix_texas_reservoir_12 | Texas reservoir, winter control month 12 | south_central | freshwater_lake_pond | 2025-12-10 | stained | core_monthly | winter_control
- lmb_matrix_alabama_river_01 | Alabama river current system, winter control month 1 | south_central | freshwater_river | 2025-01-16 | stained | core_monthly | winter_control
- lmb_matrix_alabama_river_02 | Alabama river current system, prespawn opening month 2 | south_central | freshwater_river | 2025-02-19 | stained | core_monthly | prespawn_opening
- lmb_matrix_alabama_river_03 | Alabama river current system, prespawn opening month 3 | south_central | freshwater_river | 2025-03-20 | stained | core_monthly | prespawn_opening
- lmb_matrix_alabama_river_04 | Alabama river current system, spawn postspawn transition month 4 | south_central | freshwater_river | 2025-04-16 | stained | core_monthly | spawn_postspawn_transition
- lmb_matrix_alabama_river_05 | Alabama river current system, spawn postspawn transition month 5 | south_central | freshwater_river | 2025-05-15 | stained | core_monthly | spawn_postspawn_transition
- lmb_matrix_alabama_river_06 | Alabama river current system, summer positioning month 6 | south_central | freshwater_river | 2025-06-18 | stained | core_monthly | summer_positioning
- lmb_matrix_alabama_river_07 | Alabama river current system, summer positioning month 7 | south_central | freshwater_river | 2025-07-16 | stained | core_monthly | summer_positioning
- lmb_matrix_alabama_river_08 | Alabama river current system, summer positioning month 8 | south_central | freshwater_river | 2025-08-14 | stained | core_monthly | summer_positioning
- lmb_matrix_alabama_river_09 | Alabama river current system, fall transition month 9 | south_central | freshwater_river | 2025-09-17 | stained | core_monthly | fall_transition
- lmb_matrix_alabama_river_10 | Alabama river current system, fall transition month 10 | south_central | freshwater_river | 2025-10-15 | stained | core_monthly | fall_transition
- lmb_matrix_alabama_river_11 | Alabama river current system, fall transition month 11 | south_central | freshwater_river | 2025-11-12 | stained | core_monthly | fall_transition
- lmb_matrix_alabama_river_12 | Alabama river current system, winter control month 12 | south_central | freshwater_river | 2025-12-10 | stained | core_monthly | winter_control
- lmb_matrix_new_york_natural_lake_01 | New York natural lake, winter control month 1 | northeast | freshwater_lake_pond | 2025-01-16 | clear | core_monthly | winter_control
- lmb_matrix_new_york_natural_lake_02 | New York natural lake, prespawn opening month 2 | northeast | freshwater_lake_pond | 2025-02-19 | clear | core_monthly | prespawn_opening
- lmb_matrix_new_york_natural_lake_03 | New York natural lake, prespawn opening month 3 | northeast | freshwater_lake_pond | 2025-03-20 | clear | core_monthly | prespawn_opening
- lmb_matrix_new_york_natural_lake_04 | New York natural lake, spawn postspawn transition month 4 | northeast | freshwater_lake_pond | 2025-04-16 | clear | core_monthly | spawn_postspawn_transition
- lmb_matrix_new_york_natural_lake_05 | New York natural lake, spawn postspawn transition month 5 | northeast | freshwater_lake_pond | 2025-05-15 | clear | core_monthly | spawn_postspawn_transition
- lmb_matrix_new_york_natural_lake_06 | New York natural lake, summer positioning month 6 | northeast | freshwater_lake_pond | 2025-06-18 | clear | core_monthly | summer_positioning
- lmb_matrix_new_york_natural_lake_07 | New York natural lake, summer positioning month 7 | northeast | freshwater_lake_pond | 2025-07-16 | clear | core_monthly | summer_positioning
- lmb_matrix_new_york_natural_lake_08 | New York natural lake, summer positioning month 8 | northeast | freshwater_lake_pond | 2025-08-14 | clear | core_monthly | summer_positioning
- lmb_matrix_new_york_natural_lake_09 | New York natural lake, fall transition month 9 | northeast | freshwater_lake_pond | 2025-09-17 | clear | core_monthly | fall_transition
- lmb_matrix_new_york_natural_lake_10 | New York natural lake, fall transition month 10 | northeast | freshwater_lake_pond | 2025-10-15 | clear | core_monthly | fall_transition
- lmb_matrix_new_york_natural_lake_11 | New York natural lake, fall transition month 11 | northeast | freshwater_lake_pond | 2025-11-12 | clear | core_monthly | fall_transition
- lmb_matrix_new_york_natural_lake_12 | New York natural lake, winter control month 12 | northeast | freshwater_lake_pond | 2025-12-10 | clear | core_monthly | winter_control
- lmb_matrix_georgia_highland_02 | Georgia highland reservoir, prespawn opening month 2 | south_central | freshwater_lake_pond | 2025-02-19 | clear | seasonal_overlay | prespawn_opening
- lmb_matrix_georgia_highland_04 | Georgia highland reservoir, spawn postspawn transition month 4 | south_central | freshwater_lake_pond | 2025-04-16 | clear | seasonal_overlay | spawn_postspawn_transition
- lmb_matrix_georgia_highland_06 | Georgia highland reservoir, summer positioning month 6 | south_central | freshwater_lake_pond | 2025-06-18 | clear | seasonal_overlay | summer_positioning
- lmb_matrix_georgia_highland_10 | Georgia highland reservoir, fall transition month 10 | south_central | freshwater_lake_pond | 2025-10-15 | clear | seasonal_overlay | fall_transition
- lmb_matrix_louisiana_grass_lake_03 | Louisiana grass lake, prespawn opening month 3 | gulf_coast | freshwater_lake_pond | 2025-03-20 | stained | seasonal_overlay | prespawn_opening
- lmb_matrix_louisiana_grass_lake_06 | Louisiana grass lake, summer positioning month 6 | gulf_coast | freshwater_lake_pond | 2025-06-18 | stained | seasonal_overlay | summer_positioning
- lmb_matrix_louisiana_grass_lake_09 | Louisiana grass lake, fall transition month 9 | gulf_coast | freshwater_lake_pond | 2025-09-17 | stained | seasonal_overlay | fall_transition
- lmb_matrix_louisiana_grass_lake_11 | Louisiana grass lake, fall transition month 11 | gulf_coast | freshwater_lake_pond | 2025-11-12 | stained | seasonal_overlay | fall_transition
- lmb_matrix_ozarks_reservoir_02 | Ozarks reservoir, prespawn opening month 2 | midwest_interior | freshwater_lake_pond | 2025-02-19 | clear | seasonal_overlay | prespawn_opening
- lmb_matrix_ozarks_reservoir_05 | Ozarks reservoir, spawn postspawn transition month 5 | midwest_interior | freshwater_lake_pond | 2025-05-15 | clear | seasonal_overlay | spawn_postspawn_transition
- lmb_matrix_ozarks_reservoir_10 | Ozarks reservoir, fall transition month 10 | midwest_interior | freshwater_lake_pond | 2025-10-15 | clear | seasonal_overlay | fall_transition
- lmb_matrix_ozarks_reservoir_12 | Ozarks reservoir, winter control month 12 | midwest_interior | freshwater_lake_pond | 2025-12-10 | clear | seasonal_overlay | winter_control
- lmb_matrix_minnesota_weed_lake_05 | Minnesota weed lake, spawn postspawn transition month 5 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-05-15 | clear | seasonal_overlay | spawn_postspawn_transition
- lmb_matrix_minnesota_weed_lake_07 | Minnesota weed lake, summer positioning month 7 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-07-16 | clear | seasonal_overlay | summer_positioning
- lmb_matrix_minnesota_weed_lake_08 | Minnesota weed lake, summer positioning month 8 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-08-14 | clear | seasonal_overlay | summer_positioning
- lmb_matrix_minnesota_weed_lake_10 | Minnesota weed lake, fall transition month 10 | great_lakes_upper_midwest | freshwater_lake_pond | 2025-10-15 | clear | seasonal_overlay | fall_transition
- lmb_matrix_california_delta_03 | California Delta freshwater reach, prespawn opening month 3 | northern_california | freshwater_river | 2025-03-20 | stained | seasonal_overlay | prespawn_opening
- lmb_matrix_california_delta_06 | California Delta freshwater reach, summer positioning month 6 | northern_california | freshwater_river | 2025-06-18 | stained | seasonal_overlay | summer_positioning
- lmb_matrix_california_delta_09 | California Delta freshwater reach, fall transition month 9 | northern_california | freshwater_river | 2025-09-17 | stained | seasonal_overlay | fall_transition
- lmb_matrix_california_delta_11 | California Delta freshwater reach, fall transition month 11 | northern_california | freshwater_river | 2025-11-12 | stained | seasonal_overlay | fall_transition
- lmb_matrix_socal_reservoir_01 | Southern California reservoir, winter control month 1 | southern_california | freshwater_lake_pond | 2025-01-16 | stained | seasonal_overlay | winter_control
- lmb_matrix_socal_reservoir_04 | Southern California reservoir, spawn postspawn transition month 4 | southern_california | freshwater_lake_pond | 2025-04-16 | stained | seasonal_overlay | spawn_postspawn_transition
- lmb_matrix_socal_reservoir_07 | Southern California reservoir, summer positioning month 7 | southern_california | freshwater_lake_pond | 2025-07-16 | stained | seasonal_overlay | summer_positioning
- lmb_matrix_socal_reservoir_10 | Southern California reservoir, fall transition month 10 | southern_california | freshwater_lake_pond | 2025-10-15 | stained | seasonal_overlay | fall_transition
- lmb_matrix_pnw_bass_lake_03 | Pacific Northwest bass lake, prespawn opening month 3 | pacific_northwest | freshwater_lake_pond | 2025-03-20 | stained | seasonal_overlay | prespawn_opening
- lmb_matrix_pnw_bass_lake_05 | Pacific Northwest bass lake, spawn postspawn transition month 5 | pacific_northwest | freshwater_lake_pond | 2025-05-15 | stained | seasonal_overlay | spawn_postspawn_transition
- lmb_matrix_pnw_bass_lake_08 | Pacific Northwest bass lake, summer positioning month 8 | pacific_northwest | freshwater_lake_pond | 2025-08-14 | stained | seasonal_overlay | summer_positioning
- lmb_matrix_pnw_bass_lake_11 | Pacific Northwest bass lake, fall transition month 11 | pacific_northwest | freshwater_lake_pond | 2025-11-12 | stained | seasonal_overlay | fall_transition
- lmb_matrix_colorado_bass_lake_02 | Colorado highland reservoir, prespawn opening month 2 | mountain_west | freshwater_lake_pond | 2025-02-19 | clear | seasonal_overlay | prespawn_opening
- lmb_matrix_colorado_bass_lake_05 | Colorado highland reservoir, spawn postspawn transition month 5 | mountain_west | freshwater_lake_pond | 2025-05-15 | clear | seasonal_overlay | spawn_postspawn_transition
- lmb_matrix_colorado_bass_lake_08 | Colorado highland reservoir, summer positioning month 8 | mountain_west | freshwater_lake_pond | 2025-08-14 | clear | seasonal_overlay | summer_positioning
- lmb_matrix_colorado_bass_lake_10 | Colorado highland reservoir, fall transition month 10 | mountain_west | freshwater_lake_pond | 2025-10-15 | clear | seasonal_overlay | fall_transition
- lmb_matrix_northeast_maine_lake_01 | Maine clear natural lake, winter control month 1 | northeast | freshwater_lake_pond | 2025-01-16 | clear | seasonal_overlay | winter_control
- lmb_matrix_northeast_maine_lake_05 | Maine clear natural lake, spawn postspawn transition month 5 | northeast | freshwater_lake_pond | 2025-05-15 | clear | seasonal_overlay | spawn_postspawn_transition
- lmb_matrix_northeast_maine_lake_07 | Maine clear natural lake, summer positioning month 7 | northeast | freshwater_lake_pond | 2025-07-16 | clear | seasonal_overlay | summer_positioning
- lmb_matrix_northeast_maine_lake_11 | Maine clear natural lake, fall transition month 11 | northeast | freshwater_lake_pond | 2025-11-12 | clear | seasonal_overlay | fall_transition
- lmb_matrix_gulf_dirty_grass_lake_03 | Gulf Coast dirty grass lake, prespawn opening month 3 | gulf_coast | freshwater_lake_pond | 2025-03-20 | dirty | seasonal_overlay | prespawn_opening
- lmb_matrix_gulf_dirty_grass_lake_09 | Gulf Coast dirty grass lake, fall transition month 9 | gulf_coast | freshwater_lake_pond | 2025-09-17 | dirty | seasonal_overlay | fall_transition
- lmb_matrix_gulf_dirty_grass_lake_10 | Gulf Coast dirty grass lake, fall transition month 10 | gulf_coast | freshwater_lake_pond | 2025-10-15 | dirty | seasonal_overlay | fall_transition
- lmb_matrix_midwest_dirty_backwater_03 | Midwest dirty backwater lake, prespawn opening month 3 | midwest_interior | freshwater_lake_pond | 2025-03-20 | dirty | seasonal_overlay | prespawn_opening
- lmb_matrix_midwest_dirty_backwater_07 | Midwest dirty backwater lake, summer positioning month 7 | midwest_interior | freshwater_lake_pond | 2025-07-16 | dirty | seasonal_overlay | summer_positioning
- lmb_matrix_midwest_dirty_backwater_10 | Midwest dirty backwater lake, fall transition month 10 | midwest_interior | freshwater_lake_pond | 2025-10-15 | dirty | seasonal_overlay | fall_transition

