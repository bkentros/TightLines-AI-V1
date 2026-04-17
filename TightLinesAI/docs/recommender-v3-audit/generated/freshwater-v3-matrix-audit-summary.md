# Freshwater V3 Matrix Audit Summary

Generated: 2026-04-17T18:35:26.257Z

Total scenarios: 309
Top-1 primary hit rate: 309/309 (100.0%)
Top-3 primary present rate: 309/309 (100.0%)
Disallowed avoidance rate: 309/309 (100.0%)
Top color-lane match rate: 309/309 (100.0%)

## Reader's guide

- **Primary contract** = the four headline rates above. These are what matrix-clean and regression baselines gate on.
- **Per-species failure split** = hard/soft review outcomes from the matrix review sheet (distinct from headline rates).
- **Variety** = diversity of top-1 IDs and top-3 order signatures — useful context, **not** a pass/fail line item.
- **Top-1 ties** = co-equal scores within authored primaries; tracked separately from primary hits (see tie ceilings in regression baselines).
- **Explanation conflicts** and **region fallback** = maintainer diagnostics, not primary-lane biology failures.
- **Specialty block** = surface/frog-adjacent archetypes only; **bonus top-3** counts exploratory top-3 appearances when expectations did not list that id (not a primary-contract miss).

Full field glossary: [V3_AUDIT_INTERPRETATION.md](../V3_AUDIT_INTERPRETATION.md).

## Species Summaries

### largemouth_v3_matrix

- Scenarios: 110 (48 core / 62 secondary)
- Top-1 primary hits: 110/110 (100.0%)
- Top-3 primary present: 110/110 (100.0%)
- Disallowed avoidance: 110/110 (100.0%)
- Top color-lane match: 110/110 (100.0%)
- Variety: 12 unique lure top-1 IDs, 9 unique fly top-1 IDs, 74 lure top-3 signatures, 56 fly top-3 signatures
- Failure split (review sheet): 0 hard fails, 0 soft fails; 9 top-1 tie flags; 0 explanation-conflict flags; region fallback used 0 times

Top lure leaders:
- `football_jig`: 25
- `spinnerbait`: 21
- `paddle_tail_swimbait`: 17
- `weightless_stick_worm`: 13
- `swim_jig`: 10
- `compact_flipping_jig`: 9
Top fly leaders:
- `woolly_bugger`: 39
- `game_changer`: 37
- `clouser_minnow`: 14
- `rabbit_strip_leech`: 9
- `balanced_leech`: 4
- `frog_fly`: 3

Anchor top-1 primary hit:
- `lmb_matrix_alabama_river`: 12/12 (100.0%)
- `lmb_matrix_california_delta`: 4/4 (100.0%)
- `lmb_matrix_colorado_bass_lake`: 4/4 (100.0%)
- `lmb_matrix_florida_lake`: 12/12 (100.0%)
- `lmb_matrix_georgia_highland`: 4/4 (100.0%)
- `lmb_matrix_gulf_dirty_grass_lake`: 3/3 (100.0%)
- `lmb_matrix_illinois_backwater_river`: 4/4 (100.0%)
- `lmb_matrix_louisiana_grass_lake`: 4/4 (100.0%)
- `lmb_matrix_michigan_clear_natural_lake`: 4/4 (100.0%)
- `lmb_matrix_midwest_dirty_backwater`: 3/3 (100.0%)
- `lmb_matrix_minnesota_weed_lake`: 4/4 (100.0%)
- `lmb_matrix_new_york_natural_lake`: 12/12 (100.0%)
- `lmb_matrix_northeast_maine_lake`: 4/4 (100.0%)
- `lmb_matrix_ohio_reservoir`: 4/4 (100.0%)
- `lmb_matrix_ozarks_reservoir`: 4/4 (100.0%)
- `lmb_matrix_pennsylvania_natural_lake`: 4/4 (100.0%)
- `lmb_matrix_pnw_bass_lake`: 4/4 (100.0%)
- `lmb_matrix_socal_reservoir`: 4/4 (100.0%)
- `lmb_matrix_texas_reservoir`: 12/12 (100.0%)
- `lmb_matrix_wisconsin_clear_weed_lake`: 4/4 (100.0%)

### Specialty surface / frog diagnostics (non-gating)

Tracked ids: hollow_body_frog, frog_fly, mouse_fly, walking_topwater, buzzbait, prop_bait, popper_fly. **Bonus top-3** = id appears in top-3 when scenario expectation lanes did not list it.
- `hollow_body_frog`: scenarios expecting 29 | in top-3 when expected 6 | top-1 when expected 3 | bonus top-3 (not in expectation lanes) 0
- `frog_fly`: scenarios expecting 5 | in top-3 when expected 4 | top-1 when expected 3 | bonus top-3 (not in expectation lanes) 7
- `mouse_fly`: scenarios expecting 3 | in top-3 when expected 0 | top-1 when expected 0 | bonus top-3 (not in expectation lanes) 3
- `walking_topwater`: scenarios expecting 13 | in top-3 when expected 0 | top-1 when expected 0 | bonus top-3 (not in expectation lanes) 2
- `buzzbait`: scenarios expecting 9 | in top-3 when expected 0 | top-1 when expected 0 | bonus top-3 (not in expectation lanes) 0
- `prop_bait`: scenarios expecting 6 | in top-3 when expected 0 | top-1 when expected 0 | bonus top-3 (not in expectation lanes) 0
- `popper_fly`: scenarios expecting 2 | in top-3 when expected 0 | top-1 when expected 0 | bonus top-3 (not in expectation lanes) 3

Top-1 miss examples:
- none

### smallmouth_v3_matrix

- Scenarios: 83 (48 core / 35 secondary)
- Top-1 primary hits: 83/83 (100.0%)
- Top-3 primary present: 83/83 (100.0%)
- Disallowed avoidance: 83/83 (100.0%)
- Top color-lane match: 83/83 (100.0%)
- Variety: 10 unique lure top-1 IDs, 11 unique fly top-1 IDs, 59 lure top-3 signatures, 49 fly top-3 signatures
- Failure split (review sheet): 0 hard fails, 0 soft fails; 7 top-1 tie flags; 0 explanation-conflict flags; region fallback used 0 times

Top lure leaders:
- `tube_jig`: 31
- `suspending_jerkbait`: 20
- `spinnerbait`: 10
- `hair_jig`: 5
- `inline_spinner`: 5
- `paddle_tail_swimbait`: 3
Top fly leaders:
- `woolly_bugger`: 16
- `clouser_minnow`: 14
- `slim_minnow_streamer`: 14
- `sculpin_streamer`: 9
- `game_changer`: 8
- `popper_fly`: 7

Anchor top-1 primary hit:
- `smb_matrix_colorado_river`: 4/4 (100.0%)
- `smb_matrix_great_lakes_clear_lake`: 12/12 (100.0%)
- `smb_matrix_illinois_river_smb`: 3/3 (100.0%)
- `smb_matrix_kentucky_highland_lake`: 12/12 (100.0%)
- `smb_matrix_minnesota_fall_lake`: 4/4 (100.0%)
- `smb_matrix_northeast_connecticut_river`: 4/4 (100.0%)
- `smb_matrix_northern_california_smb_river`: 4/4 (100.0%)
- `smb_matrix_ohio_dirty_reservoir`: 4/4 (100.0%)
- `smb_matrix_pennsylvania_river`: 12/12 (100.0%)
- `smb_matrix_tennessee_river`: 12/12 (100.0%)
- `smb_matrix_washington_river`: 4/4 (100.0%)
- `smb_matrix_willamette_river_smb`: 4/4 (100.0%)
- `smb_matrix_wisconsin_natural_lake`: 4/4 (100.0%)

### Specialty surface / frog diagnostics (non-gating)

Tracked ids: hollow_body_frog, frog_fly, mouse_fly, walking_topwater, buzzbait, prop_bait, popper_fly. **Bonus top-3** = id appears in top-3 when scenario expectation lanes did not list it.
- `mouse_fly`: scenarios expecting 0 | in top-3 when expected 0 | top-1 when expected 0 | bonus top-3 (not in expectation lanes) 4
- `walking_topwater`: scenarios expecting 20 | in top-3 when expected 6 | top-1 when expected 3 | bonus top-3 (not in expectation lanes) 1
- `popper_fly`: scenarios expecting 12 | in top-3 when expected 5 | top-1 when expected 3 | bonus top-3 (not in expectation lanes) 7

Top-1 miss examples:
- none

### trout_v3_matrix

- Scenarios: 68 (48 core / 20 secondary)
- Top-1 primary hits: 68/68 (100.0%)
- Top-3 primary present: 68/68 (100.0%)
- Disallowed avoidance: 68/68 (100.0%)
- Top color-lane match: 68/68 (100.0%)
- Variety: 7 unique lure top-1 IDs, 7 unique fly top-1 IDs, 26 lure top-3 signatures, 30 fly top-3 signatures
- Failure split (review sheet): 0 hard fails, 0 soft fails; 4 top-1 tie flags; 0 explanation-conflict flags; region fallback used 0 times

Top lure leaders:
- `suspending_jerkbait`: 25
- `inline_spinner`: 23
- `hair_jig`: 10
- `blade_bait`: 3
- `paddle_tail_swimbait`: 3
- `soft_jerkbait`: 3
Top fly leaders:
- `slim_minnow_streamer`: 32
- `woolly_bugger`: 12
- `muddler_sculpin`: 7
- `sculpin_streamer`: 7
- `clouser_minnow`: 6
- `articulated_baitfish_streamer`: 3

Anchor top-1 primary hit:
- `trout_matrix_alaska_big_river`: 4/4 (100.0%)
- `trout_matrix_appalachian_tailwater`: 12/12 (100.0%)
- `trout_matrix_great_lakes_highwater`: 4/4 (100.0%)
- `trout_matrix_idaho_runoff_edge`: 4/4 (100.0%)
- `trout_matrix_mountain_west_river`: 12/12 (100.0%)
- `trout_matrix_northeast_freestone`: 12/12 (100.0%)
- `trout_matrix_northern_california_fall`: 4/4 (100.0%)
- `trout_matrix_pacific_northwest_river`: 12/12 (100.0%)
- `trout_matrix_south_central_tailwater`: 4/4 (100.0%)

### Specialty surface / frog diagnostics (non-gating)

Tracked ids: hollow_body_frog, frog_fly, mouse_fly, walking_topwater, buzzbait, prop_bait, popper_fly. **Bonus top-3** = id appears in top-3 when scenario expectation lanes did not list it.

Top-1 miss examples:
- none

### pike_v3_matrix

- Scenarios: 48 (36 core / 12 secondary)
- Top-1 primary hits: 48/48 (100.0%)
- Top-3 primary present: 48/48 (100.0%)
- Disallowed avoidance: 48/48 (100.0%)
- Top color-lane match: 48/48 (100.0%)
- Variety: 7 unique lure top-1 IDs, 9 unique fly top-1 IDs, 34 lure top-3 signatures, 24 fly top-3 signatures
- Failure split (review sheet): 0 hard fails, 0 soft fails; 0 top-1 tie flags; 0 explanation-conflict flags; region fallback used 0 times

Top lure leaders:
- `blade_bait`: 12
- `large_profile_pike_swimbait`: 12
- `spinnerbait`: 8
- `paddle_tail_swimbait`: 6
- `pike_jerkbait`: 4
- `suspending_jerkbait`: 3
Top fly leaders:
- `large_articulated_pike_streamer`: 15
- `clouser_minnow`: 9
- `pike_bunny_streamer`: 7
- `balanced_leech`: 6
- `articulated_baitfish_streamer`: 4
- `rabbit_strip_leech`: 3

Anchor top-1 primary hit:
- `pike_matrix_alaska_pike_lake`: 4/4 (100.0%)
- `pike_matrix_idaho_mountain_river`: 4/4 (100.0%)
- `pike_matrix_minnesota_northwoods_lake`: 12/12 (100.0%)
- `pike_matrix_new_york_adirondack_lake`: 12/12 (100.0%)
- `pike_matrix_north_dakota_reservoir`: 4/4 (100.0%)
- `pike_matrix_rainy_river_pike`: 12/12 (100.0%)

### Specialty surface / frog diagnostics (non-gating)

Tracked ids: hollow_body_frog, frog_fly, mouse_fly, walking_topwater, buzzbait, prop_bait, popper_fly. **Bonus top-3** = id appears in top-3 when scenario expectation lanes did not list it.
- `hollow_body_frog`: scenarios expecting 2 | in top-3 when expected 2 | top-1 when expected 0 | bonus top-3 (not in expectation lanes) 1
- `frog_fly`: scenarios expecting 0 | in top-3 when expected 0 | top-1 when expected 0 | bonus top-3 (not in expectation lanes) 2
- `mouse_fly`: scenarios expecting 1 | in top-3 when expected 1 | top-1 when expected 1 | bonus top-3 (not in expectation lanes) 1
- `walking_topwater`: scenarios expecting 10 | in top-3 when expected 4 | top-1 when expected 3 | bonus top-3 (not in expectation lanes) 2
- `popper_fly`: scenarios expecting 2 | in top-3 when expected 2 | top-1 when expected 2 | bonus top-3 (not in expectation lanes) 1

Top-1 miss examples:
- none

