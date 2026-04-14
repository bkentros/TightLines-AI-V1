# Freshwater V3 Matrix Audit Summary

Generated: 2026-04-14T21:05:07.073Z

Total scenarios: 325
Top-1 primary hit rate: 216/325 (66.5%)
Top-3 primary present rate: 302/325 (92.9%)
Disallowed avoidance rate: 306/325 (94.2%)
Top color-lane match rate: 309/325 (95.1%)

## Species Summaries

### largemouth_v3_matrix

- Scenarios: 126 (48 core / 78 secondary)
- Top-1 primary hits: 73/126 (57.9%)
- Top-3 primary present: 108/126 (85.7%)
- Disallowed avoidance: 110/126 (87.3%)
- Top color-lane match: 110/126 (87.3%)
- Variety: 16 unique lure top-1 IDs, 6 unique fly top-1 IDs, 74 lure top-3 signatures, 47 fly top-3 signatures

Top lure leaders:
- `paddle_tail_swimbait`: 27
- `compact_flipping_jig`: 21
- `football_jig`: 15
- `spinnerbait`: 12
- `drop_shot_worm`: 8
- `bladed_jig`: 4
Top fly leaders:
- `woolly_bugger`: 45
- `game_changer`: 42
- `clouser_minnow`: 14
- `balanced_leech`: 5
- `crawfish_streamer`: 3
- `rabbit_strip_leech`: 1

Anchor top-1 primary hit:
- `texas_reservoir`: 11/12 (91.7%)
- `louisiana_grass_lake`: 4/5 (80.0%)
- `midwest_dirty_backwater`: 3/4 (75.0%)
- `florida_lake`: 8/12 (66.7%)
- `wisconsin_clear_weed_lake`: 4/6 (66.7%)
- `california_delta`: 3/5 (60.0%)
- `georgia_highland`: 3/5 (60.0%)
- `gulf_dirty_grass_lake`: 3/5 (60.0%)
- `illinois_backwater_river`: 3/5 (60.0%)
- `ohio_reservoir`: 3/5 (60.0%)
- `socal_reservoir`: 3/5 (60.0%)
- `new_york_natural_lake`: 7/12 (58.3%)
- `alabama_river`: 6/12 (50.0%)
- `colorado_bass_lake`: 2/4 (50.0%)
- `pnw_bass_lake`: 2/4 (50.0%)
- `northeast_maine_lake`: 2/5 (40.0%)
- `ozarks_reservoir`: 2/5 (40.0%)
- `pennsylvania_natural_lake`: 2/5 (40.0%)
- `minnesota_weed_lake`: 1/4 (25.0%)
- `michigan_clear_natural_lake`: 1/6 (16.7%)

Specialty reach:
- `hollow_body_frog`: expected 36, top3 hits 3, top1 hits 0, unexpected top3 0
- `frog_fly`: expected 7, top3 hits 4, top1 hits 0, unexpected top3 2
- `mouse_fly`: expected 3, top3 hits 0, top1 hits 0, unexpected top3 1
- `walking_topwater`: expected 15, top3 hits 0, top1 hits 0, unexpected top3 1
- `buzzbait`: expected 9, top3 hits 0, top1 hits 0, unexpected top3 0
- `prop_bait`: expected 6, top3 hits 0, top1 hits 0, unexpected top3 0
- `popper_fly`: expected 3, top3 hits 0, top1 hits 0, unexpected top3 0

Top-1 miss examples:
- `lmb_matrix_florida_lake_01` (FL, freshwater_lake_pond): actual compact_flipping_jig / woolly_bugger | expected football_jig, texas_rigged_soft_plastic_craw, suspending_jerkbait
- `lmb_matrix_florida_lake_03` (FL, freshwater_lake_pond): actual compact_flipping_jig / woolly_bugger | expected suspending_jerkbait, paddle_tail_swimbait, spinnerbait
- `lmb_matrix_florida_lake_07` (FL, freshwater_lake_pond): actual bladed_jig / game_changer | expected hollow_body_frog, swim_jig, buzzbait
- `lmb_matrix_florida_lake_08` (FL, freshwater_lake_pond): actual bladed_jig / game_changer | expected hollow_body_frog, swim_jig, buzzbait, prop_bait
- `lmb_matrix_texas_reservoir_01` (TX, freshwater_lake_pond): actual shaky_head_worm / balanced_leech | expected football_jig, suspending_jerkbait, flat_sided_crankbait
- `lmb_matrix_alabama_river_03` (AL, freshwater_river): actual compact_flipping_jig / clouser_minnow | expected spinnerbait, swim_jig, soft_jerkbait
- `lmb_matrix_alabama_river_04` (AL, freshwater_river): actual compact_flipping_jig / woolly_bugger | expected soft_jerkbait, spinnerbait, swim_jig
- `lmb_matrix_alabama_river_07` (AL, freshwater_river): actual compact_flipping_jig / woolly_bugger | expected swim_jig, spinnerbait, soft_jerkbait
- `lmb_matrix_alabama_river_09` (AL, freshwater_river): actual compact_flipping_jig / game_changer | expected spinnerbait, paddle_tail_swimbait, squarebill_crankbait
- `lmb_matrix_alabama_river_10` (AL, freshwater_river): actual compact_flipping_jig / woolly_bugger | expected spinnerbait, paddle_tail_swimbait, soft_jerkbait, clouser_minnow
- `lmb_matrix_alabama_river_11` (AL, freshwater_river): actual compact_flipping_jig / woolly_bugger | expected spinnerbait, paddle_tail_swimbait, soft_jerkbait, clouser_minnow
- `lmb_matrix_new_york_natural_lake_01` (NY, freshwater_lake_pond): actual drop_shot_worm / woolly_bugger | expected suspending_jerkbait, flat_sided_crankbait, football_jig
- `lmb_matrix_new_york_natural_lake_02` (NY, freshwater_lake_pond): actual drop_shot_worm / woolly_bugger | expected suspending_jerkbait, paddle_tail_swimbait, football_jig
- `lmb_matrix_new_york_natural_lake_05` (NY, freshwater_lake_pond): actual paddle_tail_swimbait / game_changer | expected weightless_stick_worm, wacky_rigged_stick_worm, swim_jig, compact_flipping_jig
- `lmb_matrix_new_york_natural_lake_09` (NY, freshwater_lake_pond): actual walking_topwater / game_changer | expected spinnerbait, swim_jig, paddle_tail_swimbait
- `lmb_matrix_new_york_natural_lake_12` (NY, freshwater_lake_pond): actual finesse_jig / balanced_leech | expected suspending_jerkbait, flat_sided_crankbait, football_jig

### smallmouth_v3_matrix

- Scenarios: 83 (48 core / 35 secondary)
- Top-1 primary hits: 55/83 (66.3%)
- Top-3 primary present: 81/83 (97.6%)
- Disallowed avoidance: 81/83 (97.6%)
- Top color-lane match: 83/83 (100.0%)
- Variety: 11 unique lure top-1 IDs, 11 unique fly top-1 IDs, 55 lure top-3 signatures, 45 fly top-3 signatures

Top lure leaders:
- `hair_jig`: 24
- `tube_jig`: 22
- `spinnerbait`: 11
- `suspending_jerkbait`: 6
- `blade_bait`: 4
- `drop_shot_minnow`: 4
Top fly leaders:
- `woolly_bugger`: 30
- `game_changer`: 12
- `slim_minnow_streamer`: 12
- `crawfish_streamer`: 8
- `clouser_minnow`: 6
- `articulated_baitfish_streamer`: 4

Anchor top-1 primary hit:
- `smb_matrix_illinois_river_smb`: 3/3 (100.0%)
- `smb_matrix_northeast_connecticut_river`: 4/4 (100.0%)
- `smb_matrix_great_lakes_clear_lake`: 11/12 (91.7%)
- `smb_matrix_northern_california_smb_river`: 3/4 (75.0%)
- `smb_matrix_ohio_dirty_reservoir`: 3/4 (75.0%)
- `smb_matrix_willamette_river_smb`: 3/4 (75.0%)
- `smb_matrix_wisconsin_natural_lake`: 3/4 (75.0%)
- `smb_matrix_pennsylvania_river`: 8/12 (66.7%)
- `smb_matrix_colorado_river`: 2/4 (50.0%)
- `smb_matrix_minnesota_fall_lake`: 2/4 (50.0%)
- `smb_matrix_tennessee_river`: 6/12 (50.0%)
- `smb_matrix_washington_river`: 2/4 (50.0%)
- `smb_matrix_kentucky_highland_lake`: 5/12 (41.7%)

Specialty reach:
- `mouse_fly`: expected 0, top3 hits 0, top1 hits 0, unexpected top3 8
- `walking_topwater`: expected 20, top3 hits 6, top1 hits 0, unexpected top3 2
- `popper_fly`: expected 12, top3 hits 2, top1 hits 1, unexpected top3 5

Top-1 miss examples:
- `smb_matrix_great_lakes_clear_lake_11` (MI, freshwater_lake_pond): actual finesse_jig / slim_minnow_streamer | expected suspending_jerkbait, paddle_tail_swimbait, hair_jig
- `smb_matrix_kentucky_highland_lake_01` (KY, freshwater_lake_pond): actual drop_shot_minnow / sculpin_streamer | expected tube_jig, hair_jig, suspending_jerkbait
- `smb_matrix_kentucky_highland_lake_02` (KY, freshwater_lake_pond): actual hair_jig / woolly_bugger | expected tube_jig, suspending_jerkbait, paddle_tail_swimbait
- `smb_matrix_kentucky_highland_lake_03` (KY, freshwater_lake_pond): actual football_jig / crawfish_streamer | expected tube_jig, suspending_jerkbait, paddle_tail_swimbait
- `smb_matrix_kentucky_highland_lake_05` (KY, freshwater_lake_pond): actual soft_jerkbait / clouser_minnow | expected tube_jig, paddle_tail_swimbait, spinnerbait
- `smb_matrix_kentucky_highland_lake_09` (KY, freshwater_lake_pond): actual hair_jig / woolly_bugger | expected suspending_jerkbait, paddle_tail_swimbait, spinnerbait
- `smb_matrix_kentucky_highland_lake_10` (KY, freshwater_lake_pond): actual hair_jig / woolly_bugger | expected suspending_jerkbait, paddle_tail_swimbait, spinnerbait
- `smb_matrix_kentucky_highland_lake_11` (KY, freshwater_lake_pond): actual blade_bait / clouser_minnow | expected suspending_jerkbait, paddle_tail_swimbait, spinnerbait
- `smb_matrix_tennessee_river_01` (TN, freshwater_river): actual drop_shot_minnow / sculpin_streamer | expected tube_jig, hair_jig, ned_rig
- `smb_matrix_tennessee_river_02` (TN, freshwater_river): actual hair_jig / woolly_bugger | expected spinnerbait, tube_jig, soft_jerkbait
- `smb_matrix_tennessee_river_05` (TN, freshwater_river): actual spinnerbait / game_changer | expected tube_jig, soft_jerkbait, inline_spinner
- `smb_matrix_tennessee_river_09` (TN, freshwater_river): actual tube_jig / woolly_bugger | expected suspending_jerkbait, spinnerbait, paddle_tail_swimbait
- `smb_matrix_tennessee_river_10` (TN, freshwater_river): actual blade_bait / woolly_bugger | expected suspending_jerkbait, spinnerbait, paddle_tail_swimbait
- `smb_matrix_tennessee_river_11` (TN, freshwater_river): actual blade_bait / woolly_bugger | expected suspending_jerkbait, spinnerbait, paddle_tail_swimbait
- `smb_matrix_pennsylvania_river_02` (PA, freshwater_river): actual hair_jig / woolly_bugger | expected tube_jig, ned_rig, soft_jerkbait
- `smb_matrix_pennsylvania_river_03` (PA, freshwater_river): actual hair_jig / woolly_bugger | expected tube_jig, ned_rig, soft_jerkbait

### trout_v3_matrix

- Scenarios: 68 (48 core / 20 secondary)
- Top-1 primary hits: 40/68 (58.8%)
- Top-3 primary present: 65/68 (95.6%)
- Disallowed avoidance: 67/68 (98.5%)
- Top color-lane match: 68/68 (100.0%)
- Variety: 6 unique lure top-1 IDs, 11 unique fly top-1 IDs, 24 lure top-3 signatures, 33 fly top-3 signatures

Top lure leaders:
- `hair_jig`: 31
- `inline_spinner`: 15
- `suspending_jerkbait`: 10
- `paddle_tail_swimbait`: 9
- `blade_bait`: 2
- `casting_spoon`: 1
Top fly leaders:
- `slim_minnow_streamer`: 17
- `woolly_bugger`: 17
- `sculpin_streamer`: 13
- `clouser_minnow`: 6
- `balanced_leech`: 5
- `bucktail_baitfish_streamer`: 3

Anchor top-1 primary hit:
- `trout_matrix_northeast_freestone`: 9/12 (75.0%)
- `trout_matrix_south_central_tailwater`: 3/4 (75.0%)
- `trout_matrix_appalachian_tailwater`: 8/12 (66.7%)
- `trout_matrix_pacific_northwest_river`: 8/12 (66.7%)
- `trout_matrix_alaska_big_river`: 2/4 (50.0%)
- `trout_matrix_mountain_west_river`: 6/12 (50.0%)
- `trout_matrix_northern_california_fall`: 2/4 (50.0%)
- `trout_matrix_great_lakes_highwater`: 1/4 (25.0%)
- `trout_matrix_idaho_runoff_edge`: 1/4 (25.0%)

Specialty reach:
- `mouse_fly`: expected 12, top3 hits 2, top1 hits 1, unexpected top3 5

Top-1 miss examples:
- `trout_matrix_appalachian_tailwater_04` (NC, freshwater_river): actual paddle_tail_swimbait / balanced_leech | expected slim_minnow_streamer, woolly_bugger, inline_spinner
- `trout_matrix_appalachian_tailwater_06` (NC, freshwater_river): actual hair_jig / slim_minnow_streamer | expected muddler_sculpin, woolly_bugger, rabbit_strip_leech
- `trout_matrix_appalachian_tailwater_10` (NC, freshwater_river): actual hair_jig / sculpin_streamer | expected articulated_baitfish_streamer, slim_minnow_streamer, game_changer
- `trout_matrix_appalachian_tailwater_11` (NC, freshwater_river): actual hair_jig / sculpin_streamer | expected articulated_baitfish_streamer, slim_minnow_streamer, game_changer
- `trout_matrix_northeast_freestone_03` (PA, freshwater_river): actual suspending_jerkbait / bucktail_baitfish_streamer | expected slim_minnow_streamer, woolly_bugger, inline_spinner, sculpin_streamer
- `trout_matrix_northeast_freestone_04` (PA, freshwater_river): actual inline_spinner / muddler_sculpin | expected slim_minnow_streamer, sculpin_streamer, woolly_bugger
- `trout_matrix_northeast_freestone_05` (PA, freshwater_river): actual inline_spinner / clouser_minnow | expected slim_minnow_streamer, sculpin_streamer, woolly_bugger
- `trout_matrix_mountain_west_river_02` (CO, freshwater_river): actual hair_jig / woolly_bugger | expected sculpin_streamer, slim_minnow_streamer, inline_spinner, suspending_jerkbait
- `trout_matrix_mountain_west_river_03` (CO, freshwater_river): actual paddle_tail_swimbait / balanced_leech | expected sculpin_streamer, slim_minnow_streamer, inline_spinner, suspending_jerkbait
- `trout_matrix_mountain_west_river_04` (CO, freshwater_river): actual suspending_jerkbait / bucktail_baitfish_streamer | expected slim_minnow_streamer, sculpin_streamer, inline_spinner
- `trout_matrix_mountain_west_river_07` (CO, freshwater_river): actual hair_jig / mouse_fly | expected slim_minnow_streamer, muddler_sculpin, inline_spinner
- `trout_matrix_mountain_west_river_09` (CO, freshwater_river): actual hair_jig / sculpin_streamer | expected articulated_baitfish_streamer, slim_minnow_streamer, game_changer
- `trout_matrix_mountain_west_river_10` (CO, freshwater_river): actual inline_spinner / sculpin_streamer | expected articulated_baitfish_streamer, slim_minnow_streamer, game_changer
- `trout_matrix_pacific_northwest_river_04` (OR, freshwater_river): actual suspending_jerkbait / balanced_leech | expected slim_minnow_streamer, muddler_sculpin, inline_spinner
- `trout_matrix_pacific_northwest_river_09` (OR, freshwater_river): actual hair_jig / sculpin_streamer | expected articulated_baitfish_streamer, slim_minnow_streamer, zonker_streamer
- `trout_matrix_pacific_northwest_river_10` (OR, freshwater_river): actual hair_jig / sculpin_streamer | expected articulated_baitfish_streamer, slim_minnow_streamer, zonker_streamer

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

