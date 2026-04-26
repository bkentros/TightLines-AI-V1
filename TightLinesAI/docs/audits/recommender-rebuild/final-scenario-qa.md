# Recommender rebuild - final scenario QA

Generated: **2026-04-26T16:40:40.881Z**

## Executive Conclusion

The representative QA pass found no determinism, eligibility, duplicate-ID, surface-blocking, or same-first-two-only-slot-3 failures. Outputs look biologically credible in the sampled scenarios; remaining caveats are review notes rather than evidence for selector redesign.

- Recommendation: **ship_as_is**.
- Hard failures: **0**.
- Review warnings: **0**.
- Same first two picks / only slot 3 rotates scenarios: **0**.

## Scenario Summary

### Florida LMB lake/pond warm stained surface-open calm/aggressive

- Row: `largemouth_bass|florida|freshwater_lake_pond|8`.
- Expected: Warm southern surface-open bass: frogs, topwaters, sliders/poppers, and reaction/swim tools should all be plausible.
- Rotation: lure triples 7/7, fly triples 7/7; lure first-two 6, fly first-two 6.
- Condition influence: lure chosen 7/21 active traces; fly chosen 7/21 active traces.
- Special signals: frogs candidate/finalist/pick 7/7/2; crawfish fly picks 0; pike flash fly picks 0; mouse window/picks 0/0.
- Surface is legal and biologically important.
- Frog lure/fly should remain candidates/finalists/pickable without being forced every day.
- Frog visibility held: candidates 7/7, finalists 7/7, picks 2/7.

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-08-01 | squarebill_crankbait, paddle_tail_swimbait, buzzbait | baitfish_slider_fly, articulated_dungeon_streamer, popper_fly | no |
| 2026-08-02 | soft_jerkbait, lipless_crankbait, buzzbait | unweighted_baitfish_streamer, articulated_dungeon_streamer, popper_fly | no |
| 2026-08-03 | flat_sided_crankbait, swim_jig, walking_topwater | baitfish_slider_fly, game_changer, popper_fly | no |
| 2026-08-04 | flat_sided_crankbait, paddle_tail_swimbait, hollow_body_frog | unweighted_baitfish_streamer, woolly_bugger, frog_fly | no |
| 2026-08-05 | squarebill_crankbait, swim_jig, buzzbait | unweighted_baitfish_streamer, articulated_dungeon_streamer, deer_hair_slider | no |
| 2026-08-06 | squarebill_crankbait, suspending_jerkbait, hollow_body_frog | baitfish_slider_fly, clouser_minnow, popper_fly | no |
| 2026-08-07 | flat_sided_crankbait, paddle_tail_swimbait, buzzbait | baitfish_slider_fly, deceiver, popper_fly | no |

### Florida LMB lake/pond warm stained windy/reaction

- Row: `largemouth_bass|florida|freshwater_lake_pond|8`.
- Expected: Wind should push reaction baits, while surface/frog absence is acceptable only when surface blocking applies.
- Rotation: lure triples 7/7, fly triples 7/7; lure first-two 5, fly first-two 6.
- Condition influence: lure chosen 4/21 active traces; fly chosen 0/21 active traces.
- Special signals: frogs candidate/finalist/pick 0/0/0; crawfish fly picks 0; pike flash fly picks 0; mouse window/picks 0/0.
- Windy band intentionally blocks surface in current shaping.
- Spinnerbait/bladed-jig/lipless style influence should be visible.
- Wind reaction chosen on 4/7 dates; surface blocked on 7/7 dates.

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-08-08 | spinnerbait, squarebill_crankbait, blade_bait | articulated_dungeon_streamer, unweighted_baitfish_streamer, jighead_marabou_leech | yes |
| 2026-08-09 | spinnerbait, flat_sided_crankbait, blade_bait | clouser_minnow, baitfish_slider_fly, rabbit_strip_leech | yes |
| 2026-08-10 | paddle_tail_swimbait, soft_jerkbait, carolina_rigged_stick_worm | deceiver, baitfish_slider_fly, lead_eye_leech | yes |
| 2026-08-11 | bladed_jig, soft_jerkbait, compact_flipping_jig | game_changer, baitfish_slider_fly, feather_jig_leech | yes |
| 2026-08-12 | paddle_tail_swimbait, soft_jerkbait, tube_jig | articulated_dungeon_streamer, baitfish_slider_fly, feather_jig_leech | yes |
| 2026-08-13 | medium_diving_crankbait, soft_jerkbait, blade_bait | deceiver, baitfish_slider_fly, feather_jig_leech | yes |
| 2026-08-14 | spinnerbait, flat_sided_crankbait, compact_flipping_jig | woolly_bugger, baitfish_slider_fly, jighead_marabou_leech | yes |

### Northern/Appalachian LMB cold winter lake/pond

- Row: `largemouth_bass|appalachian|freshwater_lake_pond|1`.
- Expected: Cold-water bass should lean slower/deeper; narrower output is acceptable when the row is honestly constrained.
- Rotation: lure triples 7/7, fly triples 7/7; lure first-two 7, fly first-two 6.
- Condition influence: lure chosen 0/21 active traces; fly chosen 0/21 active traces.
- Special signals: frogs candidate/finalist/pick 0/0/0; crawfish fly picks 0; pike flash fly picks 0; mouse window/picks 0/0.
- Bottom/mid slow winter posture is expected.
- No topwater pressure expected.

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-01-05 | blade_bait, ned_rig, texas_rigged_soft_plastic_craw | feather_jig_leech, rabbit_strip_leech, lead_eye_leech | no |
| 2026-01-06 | tube_jig, football_jig, shaky_head_worm | lead_eye_leech, jighead_marabou_leech, feather_jig_leech | no |
| 2026-01-07 | compact_flipping_jig, deep_diving_crankbait, shaky_head_worm | feather_jig_leech, jighead_marabou_leech, lead_eye_leech | no |
| 2026-01-08 | blade_bait, football_jig, ned_rig | rabbit_strip_leech, jighead_marabou_leech, lead_eye_leech | no |
| 2026-01-09 | football_jig, blade_bait, tube_jig | jighead_marabou_leech, feather_jig_leech, rabbit_strip_leech | no |
| 2026-01-10 | finesse_jig, tube_jig, shaky_head_worm | rabbit_strip_leech, lead_eye_leech, jighead_marabou_leech | no |
| 2026-01-11 | finesse_jig, carolina_rigged_stick_worm, ned_rig | lead_eye_leech, jighead_marabou_leech, rabbit_strip_leech | no |

### Smallmouth summer lake/pond crawfish-oriented

- Row: `smallmouth_bass|great_lakes_upper_midwest|freshwater_lake_pond|7`.
- Expected: Smallmouth lake output should include craw/tube/ned/jig logic and allow the new warmwater crawfish fly to appear.
- Rotation: lure triples 7/7, fly triples 6/7; lure first-two 6, fly first-two 5.
- Condition influence: lure chosen 5/21 active traces; fly chosen 0/21 active traces.
- Special signals: frogs candidate/finalist/pick 0/0/0; crawfish fly picks 1; pike flash fly picks 0; mouse window/picks 0/0.
- Crawfish forage is authored on this row.
- Warmwater crawfish fly visibility is a key row-inclusion check.
- warmwater_crawfish_fly picked on 1/7 dates.

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-07-10 | bladed_jig, soft_jerkbait, football_jig | articulated_baitfish_streamer, baitfish_slider_fly, feather_jig_leech | no |
| 2026-07-11 | paddle_tail_swimbait, flat_sided_crankbait, ned_rig | woolly_bugger, unweighted_baitfish_streamer, warmwater_crawfish_fly | no |
| 2026-07-12 | paddle_tail_swimbait, squarebill_crankbait, blade_bait | zonker_streamer, baitfish_slider_fly, rabbit_strip_leech | no |
| 2026-07-13 | suspending_jerkbait, flat_sided_crankbait, carolina_rigged_stick_worm | game_changer, baitfish_slider_fly, feather_jig_leech | no |
| 2026-07-14 | swim_jig, soft_jerkbait, finesse_jig | game_changer, baitfish_slider_fly, jighead_marabou_leech | no |
| 2026-07-15 | suspending_jerkbait, squarebill_crankbait, football_jig | articulated_baitfish_streamer, baitfish_slider_fly, feather_jig_leech | no |
| 2026-07-16 | swim_jig, soft_jerkbait, texas_rigged_soft_plastic_craw | deceiver, baitfish_slider_fly, jighead_marabou_leech | no |

### Smallmouth summer river

- Row: `smallmouth_bass|great_lakes_upper_midwest|freshwater_river|7`.
- Expected: River-valid smallmouth craw/sculpin/baitfish presentations should appear without lake-only oddities.
- Rotation: lure triples 7/7, fly triples 6/7; lure first-two 7, fly first-two 5.
- Condition influence: lure chosen 4/21 active traces; fly chosen 0/21 active traces.
- Special signals: frogs candidate/finalist/pick 0/0/0; crawfish fly picks 0; pike flash fly picks 0; mouse window/picks 0/0.
- River smallmouth flies should stay within river-eligible streamers/craw/sculpin logic.

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-07-17 | spinnerbait, flat_sided_crankbait, texas_rigged_soft_plastic_craw | bucktail_baitfish_streamer, baitfish_slider_fly, feather_jig_leech | no |
| 2026-07-18 | lipless_crankbait, soft_jerkbait, finesse_jig | woolly_bugger, slim_minnow_streamer, sculpin_streamer | no |
| 2026-07-19 | suspending_jerkbait, flat_sided_crankbait, tube_jig | articulated_baitfish_streamer, baitfish_slider_fly, jighead_marabou_leech | no |
| 2026-07-20 | swim_jig, squarebill_crankbait, tube_jig | deceiver, baitfish_slider_fly, lead_eye_leech | no |
| 2026-07-21 | medium_diving_crankbait, soft_jerkbait, ned_rig | deceiver, baitfish_slider_fly, lead_eye_leech | no |
| 2026-07-22 | suspending_jerkbait, squarebill_crankbait, blade_bait | articulated_dungeon_streamer, slim_minnow_streamer, rabbit_strip_leech | no |
| 2026-07-23 | casting_spoon, flat_sided_crankbait, ned_rig | bucktail_baitfish_streamer, baitfish_slider_fly, jighead_marabou_leech | no |

### Northern pike summer lake/pond baitfish/perch

- Row: `northern_pike|great_lakes_upper_midwest|freshwater_lake_pond|7`.
- Expected: Pike output should feature large baitfish/reaction lures and pike streamers, including pike flash fly visibility.
- Rotation: lure triples 6/7, fly triples 7/7; lure first-two 4, fly first-two 7.
- Condition influence: lure chosen 0/21 active traces; fly chosen 0/21 active traces.
- Special signals: frogs candidate/finalist/pick 0/0/0; crawfish fly picks 0; pike flash fly picks 3; mouse window/picks 0/0.
- Some pike streamer family concentration can be honest.
- Pike flash fly is the targeted row-inclusion check.
- pike_flash_fly picked on 3/7 dates.

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-07-03 | lipless_crankbait, soft_jerkbait, blade_bait | pike_bunny_streamer, pike_flash_fly, feather_jig_leech | no |
| 2026-07-04 | pike_jerkbait, flat_sided_crankbait, tube_jig | pike_bunny_streamer, baitfish_slider_fly, feather_jig_leech | no |
| 2026-07-05 | lipless_crankbait, soft_jerkbait, tube_jig | pike_bunny_streamer, unweighted_baitfish_streamer, feather_jig_leech | no |
| 2026-07-06 | pike_jerkbait, flat_sided_crankbait, pike_jig_and_plastic | clouser_minnow, baitfish_slider_fly, feather_jig_leech | no |
| 2026-07-07 | inline_spinner, squarebill_crankbait, tube_jig | clouser_minnow, pike_flash_fly, lead_eye_leech | no |
| 2026-07-08 | pike_jerkbait, flat_sided_crankbait, tube_jig | large_articulated_pike_streamer, unweighted_baitfish_streamer, feather_jig_leech | no |
| 2026-07-09 | inline_spinner, soft_jerkbait, tube_jig | deceiver, pike_flash_fly, jighead_marabou_leech | no |

### Northern pike summer river

- Row: `northern_pike|great_lakes_upper_midwest|freshwater_river|7`.
- Expected: River-valid pike baitfish/reaction presentations should appear; lake-only patterns must not leak in.
- Rotation: lure triples 7/7, fly triples 7/7; lure first-two 6, fly first-two 6.
- Condition influence: lure chosen 0/21 active traces; fly chosen 0/21 active traces.
- Special signals: frogs candidate/finalist/pick 0/0/0; crawfish fly picks 0; pike flash fly picks 2; mouse window/picks 0/0.
- Pike flash fly should be valid and visible in the warm river row.
- pike_flash_fly picked on 2/7 dates.

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-07-10 | casting_spoon, soft_jerkbait, tube_jig | large_articulated_pike_streamer, baitfish_slider_fly, lead_eye_leech | no |
| 2026-07-11 | inline_spinner, soft_jerkbait, tube_jig | articulated_baitfish_streamer, baitfish_slider_fly, rabbit_strip_leech | no |
| 2026-07-12 | casting_spoon, squarebill_crankbait, pike_jig_and_plastic | pike_bunny_streamer, unweighted_baitfish_streamer, lead_eye_leech | no |
| 2026-07-13 | large_bucktail_spinner, flat_sided_crankbait, pike_jig_and_plastic | deceiver, pike_flash_fly, feather_jig_leech | no |
| 2026-07-14 | casting_spoon, squarebill_crankbait, tube_jig | large_articulated_pike_streamer, baitfish_slider_fly, jighead_marabou_leech | no |
| 2026-07-15 | lipless_crankbait, soft_jerkbait, blade_bait | pike_bunny_streamer, pike_flash_fly, feather_jig_leech | no |
| 2026-07-16 | pike_jerkbait, squarebill_crankbait, pike_jig_and_plastic | articulated_dungeon_streamer, baitfish_slider_fly, lead_eye_leech | no |

### Trout summer river clear/calm/subtle

- Row: `trout|mountain_west|freshwater_river|7`.
- Expected: Clear/calm trout should lean subtle and trout-appropriate; no warmwater bass/pike flies.
- Rotation: lure triples 6/7, fly triples 7/7; lure first-two 5, fly first-two 5.
- Condition influence: lure chosen 6/21 active traces; fly chosen 0/21 active traces.
- Special signals: frogs candidate/finalist/pick 0/0/0; crawfish fly picks 0; pike flash fly picks 0; mouse window/picks 0/0.
- Clear subtle lure window should be visible where matching lures exist.
- Warmwater fly IDs must not appear.

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-07-04 | inline_spinner, soft_jerkbait, tube_jig | articulated_baitfish_streamer, baitfish_slider_fly, feather_jig_leech | no |
| 2026-07-05 | casting_spoon, soft_jerkbait, tube_jig | woolly_bugger, baitfish_slider_fly, sculpzilla | no |
| 2026-07-06 | inline_spinner, soft_jerkbait, tube_jig | bucktail_baitfish_streamer, baitfish_slider_fly, muddler_sculpin | no |
| 2026-07-07 | inline_spinner, flat_sided_crankbait, tube_jig | bucktail_baitfish_streamer, baitfish_slider_fly, sculpzilla | no |
| 2026-07-08 | suspending_jerkbait, squarebill_crankbait, ned_rig | zonker_streamer, baitfish_slider_fly, sculpin_streamer | no |
| 2026-07-09 | lipless_crankbait, soft_jerkbait, hair_jig | conehead_streamer, baitfish_slider_fly, sculpzilla | no |
| 2026-07-10 | lipless_crankbait, soft_jerkbait, tube_jig | zonker_streamer, baitfish_slider_fly, muddler_sculpin | no |

### Trout summer river mouse/topwater window

- Row: `trout|mountain_west|freshwater_river|7`.
- Expected: Mouse/topwater fly condition logic should visibly influence finalist or pick sets without invalid warmwater leakage.
- Rotation: lure triples 7/7, fly triples 7/7; lure first-two 5, fly first-two 6.
- Condition influence: lure chosen 7/21 active traces; fly chosen 2/21 active traces.
- Special signals: frogs candidate/finalist/pick 0/0/0; crawfish fly picks 0; pike flash fly picks 0; mouse window/picks 7/2.
- Mouse fly condition window should be active when a surface slot is present.
- trout_mouse_window active on 7/7 dates; mouse_fly picked on 2/7 dates.

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-07-11 | squarebill_crankbait, casting_spoon, popping_topwater | unweighted_baitfish_streamer, articulated_dungeon_streamer, popper_fly | no |
| 2026-07-12 | squarebill_crankbait, casting_spoon, walking_topwater | slim_minnow_streamer, woolly_bugger, popper_fly | no |
| 2026-07-13 | soft_jerkbait, inline_spinner, popping_topwater | slim_minnow_streamer, articulated_dungeon_streamer, popper_fly | no |
| 2026-07-14 | flat_sided_crankbait, inline_spinner, walking_topwater | baitfish_slider_fly, bucktail_baitfish_streamer, mouse_fly | no |
| 2026-07-15 | squarebill_crankbait, inline_spinner, walking_topwater | baitfish_slider_fly, conehead_streamer, deer_hair_slider | no |
| 2026-07-16 | soft_jerkbait, casting_spoon, walking_topwater | unweighted_baitfish_streamer, woolly_bugger, mouse_fly | no |
| 2026-07-17 | flat_sided_crankbait, inline_spinner, popping_topwater | slim_minnow_streamer, articulated_dungeon_streamer, deer_hair_slider | no |

### Cold winter trout river

- Row: `trout|mountain_west|freshwater_river|1`.
- Expected: Cold trout output can be narrower if it stays seasonally and species credible.
- Rotation: lure triples 4/7, fly triples 5/7; lure first-two 4, fly first-two 5.
- Condition influence: lure chosen 0/21 active traces; fly chosen 0/21 active traces.
- Special signals: frogs candidate/finalist/pick 0/0/0; crawfish fly picks 0; pike flash fly picks 0; mouse window/picks 0/0.
- Do not force variety at the expense of cold-water posture.

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-01-12 | tube_jig, hair_jig, blade_bait | muddler_sculpin, jighead_marabou_leech, crawfish_streamer | no |
| 2026-01-13 | tube_jig, hair_jig, blade_bait | crawfish_streamer, jighead_marabou_leech, sculpin_streamer | no |
| 2026-01-14 | tube_jig, hair_jig, blade_bait | sculpzilla, lead_eye_leech, crawfish_streamer | no |
| 2026-01-15 | hair_jig, ned_rig, blade_bait | sculpzilla, lead_eye_leech, crawfish_streamer | no |
| 2026-01-16 | ned_rig, hair_jig, blade_bait | muddler_sculpin, jighead_marabou_leech, crawfish_streamer | no |
| 2026-01-17 | hair_jig, tube_jig, blade_bait | crawfish_streamer, sculpzilla, rabbit_strip_leech | no |
| 2026-01-18 | ned_rig, hair_jig, blade_bait | lead_eye_leech, crawfish_streamer, sculpzilla | no |

## Daily Condition Influence

Condition windows appeared in traces and influenced selected candidates in the expected scenarios, but the selected sets still rotated across dates and did not hard-lock all slots.

## Frog And Topwater Findings

Florida warm LMB surface frog visibility: candidates 7/7, finalists 7/7, picks 2/7.

## Slot-Stickiness Label Review

The old `needs_row_inclusion` label is stale after the targeted row additions: the row-inclusion section now reports 0 recommended rows for all four new flies. The slot-stickiness audit wording was updated to `fly_side_structural_thinness_review` for those remaining fly-side cases; this is a reporting/classification correction only.

## Hard Failures And Warnings

- No hard failures.

Full machine-readable report: `docs/audits/recommender-rebuild/final-scenario-qa.json`.
