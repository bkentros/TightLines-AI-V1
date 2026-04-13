# Freshwater V3 Matrix Audit Summary

Generated: 2026-04-13T01:06:04.795Z

Total scenarios: 309
Top-1 primary hit rate: 297/309 (96.1%)
Top-3 primary present rate: 309/309 (100.0%)
Disallowed avoidance rate: 308/309 (99.7%)
Top color-lane match rate: 309/309 (100.0%)

## Species Summaries

### largemouth_v3_matrix

- Scenarios: 110 (48 core / 62 secondary)
- Top-1 primary hits: 109/110 (99.1%)
- Top-3 primary present: 110/110 (100.0%)
- Disallowed avoidance: 110/110 (100.0%)
- Top color-lane match: 110/110 (100.0%)
- Variety: 16 unique lure top-1 IDs, 9 unique fly top-1 IDs, 52 lure top-3 signatures, 42 fly top-3 signatures

Top lure leaders:
- `spinnerbait`: 25
- `football_jig`: 18
- `swim_jig`: 14
- `compact_flipping_jig`: 11
- `suspending_jerkbait`: 10
- `weightless_stick_worm`: 6
Top fly leaders:
- `clouser_minnow`: 31
- `game_changer`: 24
- `woolly_bugger`: 19
- `crawfish_streamer`: 15
- `rabbit_strip_leech`: 7
- `frog_fly`: 6

Anchor top-1 primary hit:
- `alabama_river`: 12/12 (100.0%)
- `california_delta`: 4/4 (100.0%)
- `colorado_bass_lake`: 4/4 (100.0%)
- `florida_lake`: 12/12 (100.0%)
- `georgia_highland`: 4/4 (100.0%)
- `gulf_dirty_grass_lake`: 3/3 (100.0%)
- `illinois_backwater_river`: 4/4 (100.0%)
- `louisiana_grass_lake`: 4/4 (100.0%)
- `michigan_clear_natural_lake`: 4/4 (100.0%)
- `midwest_dirty_backwater`: 3/3 (100.0%)
- `minnesota_weed_lake`: 4/4 (100.0%)
- `northeast_maine_lake`: 4/4 (100.0%)
- `ohio_reservoir`: 4/4 (100.0%)
- `ozarks_reservoir`: 4/4 (100.0%)
- `pennsylvania_natural_lake`: 4/4 (100.0%)
- `pnw_bass_lake`: 4/4 (100.0%)
- `socal_reservoir`: 4/4 (100.0%)
- `texas_reservoir`: 12/12 (100.0%)
- `wisconsin_clear_weed_lake`: 4/4 (100.0%)
- `new_york_natural_lake`: 11/12 (91.7%)

Specialty reach:
- `hollow_body_frog`: expected 30, top3 hits 11, top1 hits 4, unexpected top3 1
- `frog_fly`: expected 6, top3 hits 5, top1 hits 3, unexpected top3 7
- `mouse_fly`: expected 3, top3 hits 1, top1 hits 0, unexpected top3 4
- `walking_topwater`: expected 22, top3 hits 1, top1 hits 1, unexpected top3 0
- `buzzbait`: expected 11, top3 hits 4, top1 hits 0, unexpected top3 0
- `prop_bait`: expected 10, top3 hits 1, top1 hits 1, unexpected top3 0
- `popper_fly`: expected 2, top3 hits 0, top1 hits 0, unexpected top3 10

Top-1 miss examples:
- `lmb_matrix_new_york_natural_lake_04` (NY, freshwater_lake_pond): actual compact_flipping_jig / woolly_bugger | expected weightless_stick_worm, wacky_rigged_stick_worm, swim_jig

### smallmouth_v3_matrix

- Scenarios: 83 (48 core / 35 secondary)
- Top-1 primary hits: 74/83 (89.2%)
- Top-3 primary present: 83/83 (100.0%)
- Disallowed avoidance: 82/83 (98.8%)
- Top color-lane match: 83/83 (100.0%)
- Variety: 12 unique lure top-1 IDs, 5 unique fly top-1 IDs, 31 lure top-3 signatures, 31 fly top-3 signatures

Top lure leaders:
- `tube_jig`: 39
- `suspending_jerkbait`: 20
- `walking_topwater`: 7
- `hair_jig`: 4
- `soft_jerkbait`: 4
- `finesse_jig`: 2
Top fly leaders:
- `clouser_minnow`: 49
- `sculpin_streamer`: 17
- `popper_fly`: 8
- `crawfish_streamer`: 7
- `slim_minnow_streamer`: 2

Anchor top-1 primary hit:
- `smb_matrix_colorado_river`: 4/4 (100.0%)
- `smb_matrix_northeast_connecticut_river`: 4/4 (100.0%)
- `smb_matrix_pennsylvania_river`: 12/12 (100.0%)
- `smb_matrix_washington_river`: 4/4 (100.0%)
- `smb_matrix_willamette_river_smb`: 4/4 (100.0%)
- `smb_matrix_wisconsin_natural_lake`: 4/4 (100.0%)
- `smb_matrix_kentucky_highland_lake`: 11/12 (91.7%)
- `smb_matrix_tennessee_river`: 11/12 (91.7%)
- `smb_matrix_great_lakes_clear_lake`: 10/12 (83.3%)
- `smb_matrix_minnesota_fall_lake`: 3/4 (75.0%)
- `smb_matrix_northern_california_smb_river`: 3/4 (75.0%)
- `smb_matrix_illinois_river_smb`: 2/3 (66.7%)
- `smb_matrix_ohio_dirty_reservoir`: 2/4 (50.0%)

Specialty reach:
- `mouse_fly`: expected 0, top3 hits 0, top1 hits 0, unexpected top3 6
- `walking_topwater`: expected 20, top3 hits 8, top1 hits 7, unexpected top3 2
- `popper_fly`: expected 12, top3 hits 6, top1 hits 6, unexpected top3 3

Top-1 miss examples:
- `smb_matrix_great_lakes_clear_lake_07` (MI, freshwater_lake_pond): actual popping_topwater / popper_fly | expected paddle_tail_swimbait, drop_shot_worm, hair_jig, walking_topwater
- `smb_matrix_great_lakes_clear_lake_11` (MI, freshwater_lake_pond): actual finesse_jig / clouser_minnow | expected suspending_jerkbait, paddle_tail_swimbait, hair_jig
- `smb_matrix_kentucky_highland_lake_05` (KY, freshwater_lake_pond): actual ned_rig / crawfish_streamer | expected tube_jig, paddle_tail_swimbait, spinnerbait
- `smb_matrix_tennessee_river_11` (TN, freshwater_river): actual blade_bait / slim_minnow_streamer | expected suspending_jerkbait, spinnerbait, paddle_tail_swimbait
- `smb_matrix_minnesota_fall_lake_11` (MN, freshwater_lake_pond): actual finesse_jig / clouser_minnow | expected suspending_jerkbait, blade_bait, hair_jig
- `smb_matrix_ohio_dirty_reservoir_06` (OH, freshwater_lake_pond): actual medium_diving_crankbait / clouser_minnow | expected spinnerbait, paddle_tail_swimbait, tube_jig, walking_topwater
- `smb_matrix_ohio_dirty_reservoir_08` (OH, freshwater_lake_pond): actual hair_jig / clouser_minnow | expected spinnerbait, paddle_tail_swimbait, tube_jig, walking_topwater
- `smb_matrix_northern_california_smb_river_06` (CA, freshwater_river): actual soft_jerkbait / clouser_minnow | expected walking_topwater, inline_spinner, paddle_tail_swimbait, tube_jig
- `smb_matrix_illinois_river_smb_10` (IL, freshwater_river): actual suspending_jerkbait / clouser_minnow | expected spinnerbait, paddle_tail_swimbait, blade_bait

### trout_v3_matrix

- Scenarios: 68 (48 core / 20 secondary)
- Top-1 primary hits: 66/68 (97.1%)
- Top-3 primary present: 68/68 (100.0%)
- Disallowed avoidance: 68/68 (100.0%)
- Top color-lane match: 68/68 (100.0%)
- Variety: 4 unique lure top-1 IDs, 9 unique fly top-1 IDs, 14 lure top-3 signatures, 29 fly top-3 signatures

Top lure leaders:
- `inline_spinner`: 35
- `suspending_jerkbait`: 31
- `blade_bait`: 1
- `hair_jig`: 1
Top fly leaders:
- `articulated_baitfish_streamer`: 17
- `sculpin_streamer`: 13
- `slim_minnow_streamer`: 11
- `woolly_bugger`: 11
- `muddler_sculpin`: 6
- `clouser_minnow`: 5

Anchor top-1 primary hit:
- `trout_matrix_alaska_big_river`: 4/4 (100.0%)
- `trout_matrix_appalachian_tailwater`: 12/12 (100.0%)
- `trout_matrix_great_lakes_highwater`: 4/4 (100.0%)
- `trout_matrix_mountain_west_river`: 12/12 (100.0%)
- `trout_matrix_northeast_freestone`: 12/12 (100.0%)
- `trout_matrix_northern_california_fall`: 4/4 (100.0%)
- `trout_matrix_south_central_tailwater`: 4/4 (100.0%)
- `trout_matrix_pacific_northwest_river`: 11/12 (91.7%)
- `trout_matrix_idaho_runoff_edge`: 3/4 (75.0%)

Specialty reach:
- `mouse_fly`: expected 12, top3 hits 2, top1 hits 2, unexpected top3 2

Top-1 miss examples:
- `trout_matrix_pacific_northwest_river_12` (OR, freshwater_river): actual blade_bait / conehead_streamer | expected sculpin_streamer, woolly_bugger, zonker_streamer
- `trout_matrix_idaho_runoff_edge_04` (ID, freshwater_river): actual inline_spinner / bucktail_baitfish_streamer | expected sculpin_streamer, woolly_bugger, clouser_minnow

### pike_v3_matrix

- Scenarios: 48 (36 core / 12 secondary)
- Top-1 primary hits: 48/48 (100.0%)
- Top-3 primary present: 48/48 (100.0%)
- Disallowed avoidance: 48/48 (100.0%)
- Top color-lane match: 48/48 (100.0%)
- Variety: 2 unique lure top-1 IDs, 3 unique fly top-1 IDs, 11 lure top-3 signatures, 14 fly top-3 signatures

Top lure leaders:
- `pike_jerkbait`: 27
- `large_profile_pike_swimbait`: 21
Top fly leaders:
- `large_articulated_pike_streamer`: 25
- `pike_bunny_streamer`: 21
- `rabbit_strip_leech`: 2

Anchor top-1 primary hit:
- `pike_matrix_alaska_pike_lake`: 4/4 (100.0%)
- `pike_matrix_idaho_mountain_river`: 4/4 (100.0%)
- `pike_matrix_minnesota_northwoods_lake`: 12/12 (100.0%)
- `pike_matrix_new_york_adirondack_lake`: 12/12 (100.0%)
- `pike_matrix_north_dakota_reservoir`: 4/4 (100.0%)
- `pike_matrix_rainy_river_pike`: 12/12 (100.0%)

Specialty reach:
- `hollow_body_frog`: expected 1, top3 hits 1, top1 hits 0, unexpected top3 8
- `frog_fly`: expected 0, top3 hits 0, top1 hits 0, unexpected top3 7
- `walking_topwater`: expected 11, top3 hits 1, top1 hits 0, unexpected top3 1

Top-1 miss examples:
- none

