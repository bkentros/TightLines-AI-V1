# Recommender rebuild - trout river quality QA

Generated: **2026-04-27T15:43:43.176Z**

## Executive Conclusion

The focused trout river QA found no hard determinism, duplicate-ID, species/water-validity, pick-count, or surface-blocking defects. The audit does surface product-review concerns around bass-feeling lure exposure and fly dominance/stickiness in some non-winter river scenarios.

- Recommendation: **review_flags_but_no_immediate_tuning**.
- Hard failures: **0**.
- Review flags: **10**.

## Scenario Summaries

### Mountain West trout river January clear cold

- Row: `trout|mountain_west|freshwater_river|1`.
- Expected: Cold-water trout river should bias slower/deeper: hair jig, spoon/spinner/jerkbait where legal, and sculpin/leech/bugger style flies without warmwater/bass feel.
- Unique triples: lure 4/7, fly 6/7.
- First-two-slot unique pairs: lure 4/7, fly 6/7.
- Trout lure candidate/finalist/pick dates: 7/7/7.
- Trout fly candidate/finalist/pick dates: 7/7/7.
- Condition/clarity chosen dates: 0/7.
- Mouse candidate/finalist/pick dates: 0/0/0.
- Trout-appropriate lures: blade_bait (7), hair_jig (7), ned_rig (7).
- Bass-feeling/questionable lures: none.
- Trout-appropriate flies: crawfish_streamer (7), muddler_sculpin (4), feather_jig_leech (2), lead_eye_leech (2), rabbit_strip_leech (2), sculpin_streamer (2), jighead_marabou_leech (1), sculpzilla (1).
- Mouse/surface flies: none.
- Streamer/leech/bugger exposure: muddler_sculpin (4), feather_jig_leech (2), lead_eye_leech (2), rabbit_strip_leech (2), sculpin_streamer (2), jighead_marabou_leech (1), sculpzilla (1).
- Clear subtle exposure: muddler_sculpin (4), sculpin_streamer (2), sculpzilla (1).

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-01-12 | hair_jig, ned_rig, blade_bait | jighead_marabou_leech, crawfish_streamer, sculpzilla | no |
| 2026-01-13 | blade_bait, hair_jig, ned_rig | sculpin_streamer, crawfish_streamer, feather_jig_leech | no |
| 2026-01-14 | blade_bait, ned_rig, hair_jig | sculpin_streamer, feather_jig_leech, crawfish_streamer | no |
| 2026-01-15 | hair_jig, ned_rig, blade_bait | rabbit_strip_leech, muddler_sculpin, crawfish_streamer | no |
| 2026-01-16 | blade_bait, hair_jig, ned_rig | rabbit_strip_leech, muddler_sculpin, crawfish_streamer | no |
| 2026-01-17 | ned_rig, blade_bait, hair_jig | lead_eye_leech, muddler_sculpin, crawfish_streamer | no |
| 2026-01-18 | blade_bait, ned_rig, hair_jig | muddler_sculpin, lead_eye_leech, crawfish_streamer | no |

### Mountain West trout river May clear moderate

- Row: `trout|mountain_west|freshwater_river|5`.
- Expected: Spring trout river should mix inline spinner, spoon, hair jig, suspending jerkbait, sculpin/leech/bugger/streamer flies, and avoid over-indexing on bass-style crankbaits/tubes/ned.
- Unique triples: lure 3/7, fly 7/7.
- First-two-slot unique pairs: lure 3/7, fly 5/7.
- Trout lure candidate/finalist/pick dates: 7/7/7.
- Trout fly candidate/finalist/pick dates: 7/7/7.
- Condition/clarity chosen dates: 7/7.
- Mouse candidate/finalist/pick dates: 0/0/0.
- Trout-appropriate lures: soft_jerkbait (7), hair_jig (6), suspending_jerkbait (4), casting_spoon (2), inline_spinner (1), ned_rig (1).
- Bass-feeling/questionable lures: none.
- Trout-appropriate flies: baitfish_slider_fly (6), articulated_baitfish_streamer (2), game_changer (2), rabbit_strip_leech (2), articulated_dungeon_streamer (1), conehead_streamer (1), feather_jig_leech (1), jighead_marabou_leech (1), muddler_sculpin (1), sculpin_streamer (1), sculpzilla (1), unweighted_baitfish_streamer (1), woolly_bugger (1).
- Mouse/surface flies: none.
- Streamer/leech/bugger exposure: baitfish_slider_fly (6), articulated_baitfish_streamer (2), game_changer (2), rabbit_strip_leech (2), articulated_dungeon_streamer (1), conehead_streamer (1), feather_jig_leech (1), jighead_marabou_leech (1), muddler_sculpin (1), sculpin_streamer (1), sculpzilla (1), unweighted_baitfish_streamer (1), woolly_bugger (1).
- Clear subtle exposure: soft_jerkbait (7), suspending_jerkbait (4), muddler_sculpin (1), sculpin_streamer (1), sculpzilla (1), unweighted_baitfish_streamer (1), woolly_bugger (1).
- Review: one lure archetype dominates normal scenario: soft_jerkbait (7/21)
- Review: one fly archetype dominates normal scenario: baitfish_slider_fly (6/21)

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-05-08 | casting_spoon, soft_jerkbait, hair_jig | articulated_baitfish_streamer, baitfish_slider_fly, muddler_sculpin | no |
| 2026-05-09 | inline_spinner, soft_jerkbait, ned_rig | conehead_streamer, baitfish_slider_fly, feather_jig_leech | no |
| 2026-05-10 | suspending_jerkbait, soft_jerkbait, hair_jig | articulated_dungeon_streamer, baitfish_slider_fly, rabbit_strip_leech | no |
| 2026-05-11 | suspending_jerkbait, soft_jerkbait, hair_jig | game_changer, baitfish_slider_fly, sculpin_streamer | no |
| 2026-05-12 | casting_spoon, soft_jerkbait, hair_jig | articulated_baitfish_streamer, baitfish_slider_fly, rabbit_strip_leech | no |
| 2026-05-13 | suspending_jerkbait, soft_jerkbait, hair_jig | game_changer, baitfish_slider_fly, jighead_marabou_leech | no |
| 2026-05-14 | suspending_jerkbait, soft_jerkbait, hair_jig | woolly_bugger, unweighted_baitfish_streamer, sculpzilla | no |

### Great Lakes Upper Midwest trout river July clear active

- Row: `trout|great_lakes_upper_midwest|freshwater_river|7`.
- Expected: Summer trout river should show subtle baitfish/sculpin/bugger options with some surface possibility if legal and conditions allow.
- Unique triples: lure 2/7, fly 7/7.
- First-two-slot unique pairs: lure 2/7, fly 6/7.
- Trout lure candidate/finalist/pick dates: 7/7/7.
- Trout fly candidate/finalist/pick dates: 7/7/7.
- Condition/clarity chosen dates: 5/7.
- Mouse candidate/finalist/pick dates: 7/7/2.
- Trout-appropriate lures: small_floating_trout_plug (7), soft_jerkbait (7), casting_spoon (5), inline_spinner (2).
- Bass-feeling/questionable lures: none.
- Trout-appropriate flies: baitfish_slider_fly (4), unweighted_baitfish_streamer (2), woolly_bugger (2), zonker_streamer (2), articulated_dungeon_streamer (1), clouser_minnow (1), conehead_streamer (1), slim_minnow_streamer (1).
- Mouse/surface flies: deer_hair_slider (3), mouse_fly (2), popper_fly (2).
- Streamer/leech/bugger exposure: baitfish_slider_fly (4), unweighted_baitfish_streamer (2), woolly_bugger (2), zonker_streamer (2), articulated_dungeon_streamer (1), clouser_minnow (1), conehead_streamer (1), slim_minnow_streamer (1).
- Clear subtle exposure: soft_jerkbait (7), unweighted_baitfish_streamer (2), woolly_bugger (2), slim_minnow_streamer (1).
- Review: one lure archetype dominates normal scenario: small_floating_trout_plug (7/21)

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-07-03 | soft_jerkbait, casting_spoon, small_floating_trout_plug | unweighted_baitfish_streamer, articulated_dungeon_streamer, deer_hair_slider | no |
| 2026-07-04 | soft_jerkbait, casting_spoon, small_floating_trout_plug | slim_minnow_streamer, woolly_bugger, popper_fly | no |
| 2026-07-05 | soft_jerkbait, inline_spinner, small_floating_trout_plug | baitfish_slider_fly, clouser_minnow, popper_fly | no |
| 2026-07-06 | soft_jerkbait, casting_spoon, small_floating_trout_plug | unweighted_baitfish_streamer, woolly_bugger, mouse_fly | no |
| 2026-07-07 | soft_jerkbait, inline_spinner, small_floating_trout_plug | baitfish_slider_fly, zonker_streamer, mouse_fly | no |
| 2026-07-08 | soft_jerkbait, casting_spoon, small_floating_trout_plug | baitfish_slider_fly, zonker_streamer, deer_hair_slider | no |
| 2026-07-09 | soft_jerkbait, casting_spoon, small_floating_trout_plug | baitfish_slider_fly, conehead_streamer, deer_hair_slider | no |

### Appalachian trout river August clear calm surface-open

- Row: `trout|appalachian|freshwater_river|8`.
- Expected: Calm aggressive summer trout river should make mouse/surface flies visible sometimes without hard-locking the trio.
- Unique triples: lure 2/7, fly 6/7.
- First-two-slot unique pairs: lure 2/7, fly 5/7.
- Trout lure candidate/finalist/pick dates: 7/7/7.
- Trout fly candidate/finalist/pick dates: 7/7/7.
- Condition/clarity chosen dates: 4/7.
- Mouse candidate/finalist/pick dates: 7/7/4.
- Trout-appropriate lures: small_floating_trout_plug (7), soft_jerkbait (7), inline_spinner (5), casting_spoon (2).
- Bass-feeling/questionable lures: none.
- Trout-appropriate flies: woolly_bugger (5), slim_minnow_streamer (4), baitfish_slider_fly (2), articulated_dungeon_streamer (1), conehead_streamer (1), unweighted_baitfish_streamer (1).
- Mouse/surface flies: mouse_fly (4), popper_fly (3).
- Streamer/leech/bugger exposure: woolly_bugger (5), slim_minnow_streamer (4), baitfish_slider_fly (2), articulated_dungeon_streamer (1), conehead_streamer (1), unweighted_baitfish_streamer (1).
- Clear subtle exposure: soft_jerkbait (7), woolly_bugger (5), slim_minnow_streamer (4), unweighted_baitfish_streamer (1).
- Review: one lure archetype dominates normal scenario: small_floating_trout_plug (7/21)
- Review: one fly archetype dominates normal scenario: woolly_bugger (5/21)

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-08-07 | soft_jerkbait, inline_spinner, small_floating_trout_plug | unweighted_baitfish_streamer, woolly_bugger, mouse_fly | no |
| 2026-08-08 | soft_jerkbait, casting_spoon, small_floating_trout_plug | slim_minnow_streamer, woolly_bugger, mouse_fly | no |
| 2026-08-09 | soft_jerkbait, inline_spinner, small_floating_trout_plug | slim_minnow_streamer, woolly_bugger, popper_fly | no |
| 2026-08-10 | soft_jerkbait, inline_spinner, small_floating_trout_plug | slim_minnow_streamer, articulated_dungeon_streamer, popper_fly | no |
| 2026-08-11 | soft_jerkbait, inline_spinner, small_floating_trout_plug | slim_minnow_streamer, woolly_bugger, mouse_fly | no |
| 2026-08-12 | soft_jerkbait, casting_spoon, small_floating_trout_plug | baitfish_slider_fly, conehead_streamer, mouse_fly | no |
| 2026-08-13 | soft_jerkbait, inline_spinner, small_floating_trout_plug | baitfish_slider_fly, woolly_bugger, popper_fly | no |

### Appalachian trout river August clear windy/surface-blocked

- Row: `trout|appalachian|freshwater_river|8`.
- Expected: Windy summer trout river should remove surface/mouse/topwater and shift to subsurface trout tools.
- Unique triples: lure 3/7, fly 6/7.
- First-two-slot unique pairs: lure 2/7, fly 4/7.
- Trout lure candidate/finalist/pick dates: 7/7/7.
- Trout fly candidate/finalist/pick dates: 7/7/7.
- Condition/clarity chosen dates: 0/7.
- Mouse candidate/finalist/pick dates: 0/0/0.
- Trout-appropriate lures: soft_jerkbait (7), hair_jig (6), inline_spinner (5), casting_spoon (2), ned_rig (1).
- Bass-feeling/questionable lures: none.
- Trout-appropriate flies: articulated_dungeon_streamer (4), unweighted_baitfish_streamer (4), sculpzilla (3), slim_minnow_streamer (3), woolly_bugger (3), muddler_sculpin (2), feather_jig_leech (1), sculpin_streamer (1).
- Mouse/surface flies: none.
- Streamer/leech/bugger exposure: articulated_dungeon_streamer (4), unweighted_baitfish_streamer (4), sculpzilla (3), slim_minnow_streamer (3), woolly_bugger (3), muddler_sculpin (2), feather_jig_leech (1), sculpin_streamer (1).
- Clear subtle exposure: soft_jerkbait (7), unweighted_baitfish_streamer (4), sculpzilla (3), slim_minnow_streamer (3), woolly_bugger (3), muddler_sculpin (2), sculpin_streamer (1).
- Review: one lure archetype dominates normal scenario: soft_jerkbait (7/21)

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-08-14 | soft_jerkbait, casting_spoon, hair_jig | slim_minnow_streamer, articulated_dungeon_streamer, muddler_sculpin | yes |
| 2026-08-15 | soft_jerkbait, inline_spinner, ned_rig | unweighted_baitfish_streamer, woolly_bugger, sculpzilla | yes |
| 2026-08-16 | soft_jerkbait, casting_spoon, hair_jig | unweighted_baitfish_streamer, articulated_dungeon_streamer, sculpzilla | yes |
| 2026-08-17 | soft_jerkbait, inline_spinner, hair_jig | slim_minnow_streamer, articulated_dungeon_streamer, feather_jig_leech | yes |
| 2026-08-18 | soft_jerkbait, inline_spinner, hair_jig | unweighted_baitfish_streamer, woolly_bugger, sculpzilla | yes |
| 2026-08-19 | soft_jerkbait, inline_spinner, hair_jig | unweighted_baitfish_streamer, articulated_dungeon_streamer, muddler_sculpin | yes |
| 2026-08-20 | soft_jerkbait, inline_spinner, hair_jig | slim_minnow_streamer, woolly_bugger, sculpin_streamer | yes |

### Mountain West trout river October stained fall active

- Row: `trout|mountain_west|freshwater_river|10`.
- Expected: Fall stained trout river can lean streamer/reaction/sculpin/baitfish/leech, but should still feel trout rather than bass.
- Unique triples: lure 6/7, fly 6/7.
- First-two-slot unique pairs: lure 3/7, fly 3/7.
- Trout lure candidate/finalist/pick dates: 7/7/7.
- Trout fly candidate/finalist/pick dates: 7/7/7.
- Condition/clarity chosen dates: 0/7.
- Mouse candidate/finalist/pick dates: 0/0/0.
- Trout-appropriate lures: soft_jerkbait (7), hair_jig (3), inline_spinner (3), blade_bait (2), casting_spoon (2), ned_rig (2), suspending_jerkbait (2).
- Bass-feeling/questionable lures: none.
- Trout-appropriate flies: baitfish_slider_fly (6), zonker_streamer (4), articulated_baitfish_streamer (2), sculpin_streamer (2), sculpzilla (2), feather_jig_leech (1), lead_eye_leech (1), muddler_sculpin (1), slim_minnow_streamer (1), woolly_bugger (1).
- Mouse/surface flies: none.
- Streamer/leech/bugger exposure: baitfish_slider_fly (6), zonker_streamer (4), articulated_baitfish_streamer (2), sculpin_streamer (2), sculpzilla (2), feather_jig_leech (1), lead_eye_leech (1), muddler_sculpin (1), slim_minnow_streamer (1), woolly_bugger (1).
- Clear subtle exposure: soft_jerkbait (7), sculpin_streamer (2), sculpzilla (2), suspending_jerkbait (2), muddler_sculpin (1), slim_minnow_streamer (1), woolly_bugger (1).
- Review: one lure archetype dominates normal scenario: soft_jerkbait (7/21)
- Review: one fly archetype dominates normal scenario: baitfish_slider_fly (6/21)

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-10-09 | suspending_jerkbait, soft_jerkbait, ned_rig | zonker_streamer, baitfish_slider_fly, feather_jig_leech | no |
| 2026-10-10 | casting_spoon, soft_jerkbait, hair_jig | zonker_streamer, baitfish_slider_fly, sculpzilla | no |
| 2026-10-11 | inline_spinner, soft_jerkbait, blade_bait | articulated_baitfish_streamer, baitfish_slider_fly, lead_eye_leech | no |
| 2026-10-12 | inline_spinner, soft_jerkbait, hair_jig | zonker_streamer, baitfish_slider_fly, muddler_sculpin | no |
| 2026-10-13 | inline_spinner, soft_jerkbait, ned_rig | zonker_streamer, baitfish_slider_fly, sculpzilla | no |
| 2026-10-14 | suspending_jerkbait, soft_jerkbait, blade_bait | articulated_baitfish_streamer, baitfish_slider_fly, sculpin_streamer | no |
| 2026-10-15 | casting_spoon, soft_jerkbait, hair_jig | woolly_bugger, slim_minnow_streamer, sculpin_streamer | no |

### Southern California trout river June clear warm-season

- Row: `trout|southern_california|freshwater_river|6`.
- Expected: Regional warm-season trout row should remain trout-plausible and avoid goofy warmwater-heavy output.
- Unique triples: lure 4/7, fly 7/7.
- First-two-slot unique pairs: lure 3/7, fly 5/7.
- Trout lure candidate/finalist/pick dates: 7/7/7.
- Trout fly candidate/finalist/pick dates: 7/7/7.
- Condition/clarity chosen dates: 7/7.
- Mouse candidate/finalist/pick dates: 0/0/0.
- Trout-appropriate lures: soft_jerkbait (7), casting_spoon (5), ned_rig (5), hair_jig (2), inline_spinner (1), suspending_jerkbait (1).
- Bass-feeling/questionable lures: none.
- Trout-appropriate flies: baitfish_slider_fly (6), feather_jig_leech (3), articulated_dungeon_streamer (2), bucktail_baitfish_streamer (2), zonker_streamer (2), clouser_minnow (1), jighead_marabou_leech (1), lead_eye_leech (1), rabbit_strip_leech (1), sculpin_streamer (1), unweighted_baitfish_streamer (1).
- Mouse/surface flies: none.
- Streamer/leech/bugger exposure: baitfish_slider_fly (6), feather_jig_leech (3), articulated_dungeon_streamer (2), bucktail_baitfish_streamer (2), zonker_streamer (2), clouser_minnow (1), jighead_marabou_leech (1), lead_eye_leech (1), rabbit_strip_leech (1), sculpin_streamer (1), unweighted_baitfish_streamer (1).
- Clear subtle exposure: soft_jerkbait (7), sculpin_streamer (1), suspending_jerkbait (1), unweighted_baitfish_streamer (1).
- Review: one lure archetype dominates normal scenario: soft_jerkbait (7/21)
- Review: one fly archetype dominates normal scenario: baitfish_slider_fly (6/21)

| Date | Lures | Flies | Surface blocked |
| --- | --- | --- | --- |
| 2026-06-12 | casting_spoon, soft_jerkbait, ned_rig | bucktail_baitfish_streamer, baitfish_slider_fly, rabbit_strip_leech | no |
| 2026-06-13 | casting_spoon, soft_jerkbait, ned_rig | zonker_streamer, baitfish_slider_fly, sculpin_streamer | no |
| 2026-06-14 | casting_spoon, soft_jerkbait, hair_jig | articulated_dungeon_streamer, unweighted_baitfish_streamer, jighead_marabou_leech | no |
| 2026-06-15 | casting_spoon, soft_jerkbait, hair_jig | bucktail_baitfish_streamer, baitfish_slider_fly, feather_jig_leech | no |
| 2026-06-16 | inline_spinner, soft_jerkbait, ned_rig | articulated_dungeon_streamer, baitfish_slider_fly, feather_jig_leech | no |
| 2026-06-17 | casting_spoon, soft_jerkbait, ned_rig | clouser_minnow, baitfish_slider_fly, feather_jig_leech | no |
| 2026-06-18 | suspending_jerkbait, soft_jerkbait, ned_rig | zonker_streamer, baitfish_slider_fly, lead_eye_leech | no |

## Hard Failures

- None.

## Review Flags

- mountain_west_trout_river_may_clear_moderate: one lure archetype dominates normal scenario: soft_jerkbait (7/21)
- mountain_west_trout_river_may_clear_moderate: one fly archetype dominates normal scenario: baitfish_slider_fly (6/21)
- great_lakes_trout_river_july_clear_active: one lure archetype dominates normal scenario: small_floating_trout_plug (7/21)
- appalachian_trout_river_august_clear_calm_surface: one lure archetype dominates normal scenario: small_floating_trout_plug (7/21)
- appalachian_trout_river_august_clear_calm_surface: one fly archetype dominates normal scenario: woolly_bugger (5/21)
- appalachian_trout_river_august_clear_windy_blocked: one lure archetype dominates normal scenario: soft_jerkbait (7/21)
- mountain_west_trout_river_october_stained_fall: one lure archetype dominates normal scenario: soft_jerkbait (7/21)
- mountain_west_trout_river_october_stained_fall: one fly archetype dominates normal scenario: baitfish_slider_fly (6/21)
- southern_california_trout_river_june_clear: one lure archetype dominates normal scenario: soft_jerkbait (7/21)
- southern_california_trout_river_june_clear: one fly archetype dominates normal scenario: baitfish_slider_fly (6/21)

## Conservative Tuning Recommendation

Review flags are present, but no immediate tuning is recommended from this pass. The most likely next step is a focused product review of bass-feeling lure tolerance in trout river rows.

Full machine-readable report: `docs/audits/recommender-rebuild/trout-river-quality-qa.json`.
