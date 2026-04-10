/**
 * Seasonal rows: `primary_lure_archetypes` / `primary_fly_archetypes` are ordered — [0] is the top
 * seasonal pick (+1.5 baseline), [1] is the strong secondary (+0.75). Keep that order intentional.
 */
import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  RecommenderV3Context,
  RecommenderV3SeasonalRow,
} from "../contracts.ts";
import type { RegionKey } from "../../../howFishingEngine/contracts/region.ts";

type SeasonalCore = Omit<
  RecommenderV3SeasonalRow,
  "species" | "region_key" | "month" | "context"
>;

const LMB_ROWS: RecommenderV3SeasonalRow[] = [];

function addMonths(
  regions: readonly RegionKey[],
  context: RecommenderV3Context,
  months: readonly number[],
  core: SeasonalCore,
) {
  for (const region_key of regions) {
    for (const month of months) {
      LMB_ROWS.push({
        species: "largemouth_bass",
        region_key,
        context,
        month,
        ...core,
      });
    }
  }
}

const WINTER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "football_jig",
  "finesse_jig",
  "texas_rigged_soft_plastic_craw",
  "shaky_head_worm",
  "suspending_jerkbait",
  "blade_bait",
  "drop_shot_worm",
  "flat_sided_crankbait",
];
const WINTER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "crawfish_streamer",
  "balanced_leech",
  "rabbit_strip_leech",
  "woolly_bugger",
  "sculpin_streamer",
  "conehead_streamer",
];

const PRESPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "football_jig",
  "texas_rigged_soft_plastic_craw",
  "suspending_jerkbait",
  "spinnerbait",
  "bladed_jig",
  "lipless_crankbait",
  "squarebill_crankbait",
  "paddle_tail_swimbait",
];
const PRESPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "crawfish_streamer",
  "rabbit_strip_leech",
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "sculpin_streamer",
];

const SPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "weightless_stick_worm",
  "wacky_rigged_stick_worm",
  "texas_rigged_stick_worm",
  "compact_flipping_jig",
  "swim_jig",
  "paddle_tail_swimbait",
];
const SOUTHERN_MAY_FROG_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  ...SPAWN_LAKE_LURES,
  "hollow_body_frog",
];
const SPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "balanced_leech",
  "rabbit_strip_leech",
  "crawfish_streamer",
  "popper_fly",
  "frog_fly",
];

const POSTSPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "swim_jig",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "drop_shot_minnow",
  "squarebill_crankbait",
  "medium_diving_crankbait",
  "spinnerbait",
  "wacky_rigged_stick_worm",
];
const POSTSPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "balanced_leech",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "deceiver",
  "popper_fly",
];

const SUMMER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "walking_topwater",
  "popping_topwater",
  "buzzbait",
  "prop_bait",
  "hollow_body_frog",
  "swim_jig",
  "paddle_tail_swimbait",
  "texas_rigged_stick_worm",
  "deep_diving_crankbait",
  "drop_shot_worm",
  "drop_shot_minnow",
];
const SUMMER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "popper_fly",
  "frog_fly",
  "mouse_fly",
  "articulated_dungeon_streamer",
  "game_changer",
  "clouser_minnow",
  "woolly_bugger",
];

const FALL_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "bladed_jig",
  "paddle_tail_swimbait",
  "squarebill_crankbait",
  "medium_diving_crankbait",
  "lipless_crankbait",
  "suspending_jerkbait",
  "walking_topwater",
];
const FALL_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "deceiver",
  "game_changer",
  "popper_fly",
  "woolly_bugger",
  "articulated_baitfish_streamer",
];

const WINTER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "tube_jig",
  "shaky_head_worm",
  "blade_bait",
  "suspending_jerkbait",
  "drop_shot_worm",
];
const WINTER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "crawfish_streamer",
  "balanced_leech",
  "rabbit_strip_leech",
  "woolly_bugger",
  "sculpin_streamer",
  "conehead_streamer",
];

const SPRING_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "spinnerbait",
  "swim_jig",
  "squarebill_crankbait",
  "soft_jerkbait",
  "paddle_tail_swimbait",
  "texas_rigged_soft_plastic_craw",
];
const SPRING_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
  "game_changer",
];

const SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "walking_topwater",
  "popping_topwater",
  "buzzbait",
  "prop_bait",
  "swim_jig",
  "soft_jerkbait",
  "squarebill_crankbait",
  "spinnerbait",
  "texas_rigged_stick_worm",
];
const SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "popper_fly",
  "frog_fly",
  "mouse_fly",
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
];

const FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "bladed_jig",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "squarebill_crankbait",
  "lipless_crankbait",
  "walking_topwater",
];
const FALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "deceiver",
  "game_changer",
  "popper_fly",
  "articulated_baitfish_streamer",
];

const TROPICAL_PRESPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "paddle_tail_swimbait",
  "spinnerbait",
  "soft_jerkbait",
  "compact_flipping_jig",
  "football_jig",
  "swim_jig",
];
const TROPICAL_PRESPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
];

const FLORIDA_PRESPAWN_PUSH_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "paddle_tail_swimbait",
  "spinnerbait",
  "soft_jerkbait",
  "swim_jig",
  "compact_flipping_jig",
  "football_jig",
];
const FLORIDA_PRESPAWN_PUSH_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
];

const CLEAR_SPRING_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "soft_jerkbait",
  "paddle_tail_swimbait",
  "swim_jig",
  "wacky_rigged_stick_worm",
  "carolina_rigged_stick_worm",
  "spinnerbait",
  "weightless_stick_worm",
];
const CLEAR_SPRING_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "balanced_leech",
  "deceiver",
  "articulated_baitfish_streamer",
  "rabbit_strip_leech",
];

const CURRENT_SEAM_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "swim_jig",
  "soft_jerkbait",
  "paddle_tail_swimbait",
  "squarebill_crankbait",
  "compact_flipping_jig",
  "texas_rigged_soft_plastic_craw",
];
const CURRENT_SEAM_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_baitfish_streamer",
  "deceiver",
  "rabbit_strip_leech",
];

const DIRTY_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "texas_rigged_soft_plastic_craw",
  "spinnerbait",
  "bladed_jig",
  "swim_jig",
  "paddle_tail_swimbait",
  "hollow_body_frog",
];
const DIRTY_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "frog_fly",
  "popper_fly",
  "game_changer",
  "woolly_bugger",
  "crawfish_streamer",
];

const LATE_SUMMER_CLEAR_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "wacky_rigged_stick_worm",
  "weightless_stick_worm",
  "drop_shot_worm",
  "carolina_rigged_stick_worm",
  "shaky_head_worm",
  "texas_rigged_stick_worm",
  "soft_jerkbait",
];
const LATE_SUMMER_CLEAR_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "game_changer",
  "clouser_minnow",
  "woolly_bugger",
  "rabbit_strip_leech",
  "deceiver",
];

const EARLY_FALL_GRASS_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "walking_topwater",
  "buzzbait",
  "prop_bait",
  "swim_jig",
  "spinnerbait",
  "bladed_jig",
  "hollow_body_frog",
  "squarebill_crankbait",
];
const EARLY_FALL_GRASS_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "popper_fly",
  "frog_fly",
  "game_changer",
  "clouser_minnow",
  "articulated_baitfish_streamer",
];

const FLORIDA_FALL_GRASS_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "walking_topwater",
  "swim_jig",
  "spinnerbait",
  "bladed_jig",
  "hollow_body_frog",
  "paddle_tail_swimbait",
  "buzzbait",
  "prop_bait",
];
const FLORIDA_FALL_GRASS_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "popper_fly",
  "frog_fly",
  "game_changer",
  "clouser_minnow",
  "articulated_baitfish_streamer",
];

const FLORIDA_SPAWN_CLEAR_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "weightless_stick_worm",
  "wacky_rigged_stick_worm",
  "compact_flipping_jig",
  "swim_jig",
  "paddle_tail_swimbait",
];
const FLORIDA_SPAWN_CLEAR_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
  "clouser_minnow",
];

const FLORIDA_DIRTY_SUMMER_GRASS_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "texas_rigged_soft_plastic_craw",
  "hollow_body_frog",
  "swim_jig",
  "buzzbait",
  "prop_bait",
  "bladed_jig",
  "spinnerbait",
];
const FLORIDA_DIRTY_SUMMER_GRASS_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "frog_fly",
  "game_changer",
  "woolly_bugger",
  "popper_fly",
  "mouse_fly",
];

const TEXAS_SPAWN_TRANSITION_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "wacky_rigged_stick_worm",
  "swim_jig",
  "hollow_body_frog",
  "weightless_stick_worm",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "spinnerbait",
];
const TEXAS_SPAWN_TRANSITION_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "frog_fly",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
];

const TEXAS_COLD_STAINED_RESERVOIR_LURES: readonly LureArchetypeIdV3[] = [
  "football_jig",
  "suspending_jerkbait",
  "flat_sided_crankbait",
  "shaky_head_worm",
  "texas_rigged_soft_plastic_craw",
  "paddle_tail_swimbait",
];
const TEXAS_COLD_STAINED_RESERVOIR_FLIES: readonly FlyArchetypeIdV3[] = [
  "balanced_leech",
  "rabbit_strip_leech",
  "woolly_bugger",
  "sculpin_streamer",
  "clouser_minnow",
  "crawfish_streamer",
];

const TEXAS_DIRTY_SUMMER_RESERVOIR_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "texas_rigged_soft_plastic_craw",
  "deep_diving_crankbait",
  "football_jig",
  "spinnerbait",
  "swim_jig",
  "paddle_tail_swimbait",
];
const TEXAS_DIRTY_SUMMER_RESERVOIR_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "rabbit_strip_leech",
  "game_changer",
  "crawfish_streamer",
  "clouser_minnow",
];

const COLD_CLEAR_POND_LURES: readonly LureArchetypeIdV3[] = [
  "football_jig",
  "shaky_head_worm",
  "texas_rigged_soft_plastic_craw",
  "suspending_jerkbait",
  "flat_sided_crankbait",
  "blade_bait",
];
const COLD_CLEAR_POND_FLIES: readonly FlyArchetypeIdV3[] = [
  "balanced_leech",
  "rabbit_strip_leech",
  "sculpin_streamer",
  "woolly_bugger",
  "crawfish_streamer",
];

const GULF_LATE_FALL_GRASS_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "bladed_jig",
  "spinnerbait",
  "compact_flipping_jig",
  "paddle_tail_swimbait",
  "hollow_body_frog",
  "swim_jig",
  "squarebill_crankbait",
];
const GULF_LATE_FALL_GRASS_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "game_changer",
  "clouser_minnow",
  "rabbit_strip_leech",
  "articulated_baitfish_streamer",
  "popper_fly",
];

const GULF_DIRTY_PRESPAWN_GRASS_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "bladed_jig",
  "compact_flipping_jig",
  "swim_jig",
  "paddle_tail_swimbait",
  "lipless_crankbait",
  "texas_rigged_soft_plastic_craw",
];
const GULF_DIRTY_PRESPAWN_GRASS_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "game_changer",
  "clouser_minnow",
  "woolly_bugger",
  "crawfish_streamer",
  "rabbit_strip_leech",
];

const SOUTH_CENTRAL_LATEFALL_RESERVOIR_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "flat_sided_crankbait",
  "football_jig",
  "paddle_tail_swimbait",
  "texas_rigged_soft_plastic_craw",
  "shaky_head_worm",
];
const SOUTH_CENTRAL_LATEFALL_RESERVOIR_FLIES: readonly FlyArchetypeIdV3[] = [
  "balanced_leech",
  "rabbit_strip_leech",
  "woolly_bugger",
  "sculpin_streamer",
  "clouser_minnow",
  "crawfish_streamer",
];

const DELTA_LATE_FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "bladed_jig",
  "compact_flipping_jig",
  "spinnerbait",
  "paddle_tail_swimbait",
  "squarebill_crankbait",
  "swim_jig",
  "suspending_jerkbait",
];
const DELTA_LATE_FALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "balanced_leech",
  "rabbit_strip_leech",
  "game_changer",
  "clouser_minnow",
  "articulated_baitfish_streamer",
  "woolly_bugger",
];

const SUMMER_CURRENT_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "swim_jig",
  "spinnerbait",
  "soft_jerkbait",
  "squarebill_crankbait",
  "texas_rigged_stick_worm",
  "paddle_tail_swimbait",
  "compact_flipping_jig",
];
const SUMMER_CURRENT_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "popper_fly",
];

const DELTA_CLEAR_PRESPAWN_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "soft_jerkbait",
  "compact_flipping_jig",
  "spinnerbait",
  "swim_jig",
  "paddle_tail_swimbait",
  "squarebill_crankbait",
];
const DELTA_CLEAR_PRESPAWN_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "articulated_baitfish_streamer",
];

const FLORIDA_POSTSPAWN_SHALLOW_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "weightless_stick_worm",
  "wacky_rigged_stick_worm",
  "compact_flipping_jig",
  "swim_jig",
  "hollow_body_frog",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "drop_shot_minnow",
  "spinnerbait",
];
const FLORIDA_MAY_SHALLOW_COVER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "texas_rigged_stick_worm",
  "compact_flipping_jig",
  "swim_jig",
  "paddle_tail_swimbait",
  "hollow_body_frog",
  "soft_jerkbait",
];
const FLORIDA_POSTSPAWN_SHALLOW_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "clouser_minnow",
  "game_changer",
  "rabbit_strip_leech",
  "frog_fly",
];

const FLORIDA_MIDSUMMER_GRASS_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "hollow_body_frog",
  "swim_jig",
  "compact_flipping_jig",
  "buzzbait",
  "prop_bait",
  "bladed_jig",
  "spinnerbait",
  "texas_rigged_stick_worm",
];
const FLORIDA_MIDSUMMER_GRASS_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "frog_fly",
  "game_changer",
  "mouse_fly",
  "woolly_bugger",
  "clouser_minnow",
];

const TROPICAL_SUMMER_CONTROL_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "football_jig",
  "texas_rigged_soft_plastic_craw",
  "deep_diving_crankbait",
  "swim_jig",
  "paddle_tail_swimbait",
  "prop_bait",
];
const TROPICAL_SUMMER_CONTROL_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "balanced_leech",
  "crawfish_streamer",
  "game_changer",
  "clouser_minnow",
];

const SOUTHEAST_SUMMER_CONTROL_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "football_jig",
  "texas_rigged_soft_plastic_craw",
  "deep_diving_crankbait",
  "swim_jig",
  "spinnerbait",
  "prop_bait",
];
const SOUTHEAST_SUMMER_CONTROL_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "balanced_leech",
  "crawfish_streamer",
  "game_changer",
  "clouser_minnow",
];

// Minnesota weed-lake summer: swim_jig leads so it wins the frog/jig tiebreak in clear water
const MN_WEED_LAKE_SUMMER_LURES: readonly LureArchetypeIdV3[] = [
  "swim_jig",
  "walking_topwater",
  "hollow_body_frog",
  "weightless_stick_worm",
  "paddle_tail_swimbait",
  "wacky_rigged_stick_worm",
  "buzzbait",
  "prop_bait",
];

const FLORIDA_WINTER_CONTROL_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "texas_rigged_soft_plastic_craw",
  "football_jig",
  "suspending_jerkbait",
  "flat_sided_crankbait",
  "compact_flipping_jig",
  "shaky_head_worm",
];
const FLORIDA_WINTER_CONTROL_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "crawfish_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "sculpin_streamer",
  "clouser_minnow",
];

const TEXAS_SUMMER_RESERVOIR_CONTROL_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "football_jig",
  "deep_diving_crankbait",
  "texas_rigged_soft_plastic_craw",
  "spinnerbait",
  "swim_jig",
  "paddle_tail_swimbait",
];
const TEXAS_SUMMER_RESERVOIR_CONTROL_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
  "game_changer",
  "clouser_minnow",
];

const TEXAS_FALL_TIGHTENING_RESERVOIR_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "flat_sided_crankbait",
  "football_jig",
  "spinnerbait",
  "paddle_tail_swimbait",
  "squarebill_crankbait",
];
const TEXAS_FALL_TIGHTENING_RESERVOIR_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "rabbit_strip_leech",
  "woolly_bugger",
  "game_changer",
  "sculpin_streamer",
];

const SOUTH_CENTRAL_WINTER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "suspending_jerkbait",
  "shaky_head_worm",
  "squarebill_crankbait",
  "spinnerbait",
];
const SOUTH_CENTRAL_WINTER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "crawfish_streamer",
  "woolly_bugger",
  "clouser_minnow",
  "rabbit_strip_leech",
  "sculpin_streamer",
];

const SOUTH_CENTRAL_PRESPAWN_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "swim_jig",
  "soft_jerkbait",
  "squarebill_crankbait",
  "compact_flipping_jig",
  "paddle_tail_swimbait",
  "texas_rigged_soft_plastic_craw",
];
const SOUTH_CENTRAL_PRESPAWN_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
];

const ALABAMA_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "swim_jig",
  "spinnerbait",
  "soft_jerkbait",
  "squarebill_crankbait",
  "compact_flipping_jig",
  "texas_rigged_stick_worm",
  "paddle_tail_swimbait",
];
const ALABAMA_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "frog_fly",
  "woolly_bugger",
  "popper_fly",
];

const SOUTH_CENTRAL_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "compact_flipping_jig",
  "swim_jig",
  "squarebill_crankbait",
  "soft_jerkbait",
  "bladed_jig",
  "texas_rigged_soft_plastic_craw",
];
const SOUTH_CENTRAL_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "frog_fly",
  "game_changer",
  "woolly_bugger",
  "crawfish_streamer",
  "popper_fly",
];

const SOUTH_CENTRAL_FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "paddle_tail_swimbait",
  "squarebill_crankbait",
  "soft_jerkbait",
  "bladed_jig",
  "compact_flipping_jig",
];
const SOUTH_CENTRAL_FALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_baitfish_streamer",
  "woolly_bugger",
  "deceiver",
];

const NORTHERN_CLEAR_WINTER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "flat_sided_crankbait",
  "football_jig",
  "paddle_tail_swimbait",
  "shaky_head_worm",
];
const NORTHERN_CLEAR_PRESPAWN_CRANK_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "flat_sided_crankbait",
  "suspending_jerkbait",
  "football_jig",
  "shaky_head_worm",
  "paddle_tail_swimbait",
];
const NORTHERN_CLEAR_WINTER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "rabbit_strip_leech",
  "woolly_bugger",
  "sculpin_streamer",
  "game_changer",
];

const NORTHERN_CLEAR_SPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "weightless_stick_worm",
  "wacky_rigged_stick_worm",
  "swim_jig",
  "soft_jerkbait",
  "paddle_tail_swimbait",
  "compact_flipping_jig",
];
const NORTHERN_CLEAR_SPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "clouser_minnow",
  "game_changer",
  "rabbit_strip_leech",
  "popper_fly",
];

const NORTHERN_CLEAR_SUMMER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "wacky_rigged_stick_worm",
  "weightless_stick_worm",
  "drop_shot_worm",
  "soft_jerkbait",
  "swim_jig",
  "walking_topwater",
];
const NORTHERN_CLEAR_SUMMER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "game_changer",
  "clouser_minnow",
  "frog_fly",
  "woolly_bugger",
  "popper_fly",
];

const NORTHERN_CLEAR_FALL_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "swim_jig",
  "squarebill_crankbait",
  "suspending_jerkbait",
  "paddle_tail_swimbait",
  "walking_topwater",
];
const NORTHERN_CLEAR_FALL_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "game_changer",
  "clouser_minnow",
  "articulated_baitfish_streamer",
  "deceiver",
  "popper_fly",
];

const SOUTH_CENTRAL_CLEAR_SPRING_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "soft_jerkbait",
  "swim_jig",
  "wacky_rigged_stick_worm",
  "paddle_tail_swimbait",
  "suspending_jerkbait",
  "spinnerbait",
];
const SOUTH_CENTRAL_CLEAR_SPRING_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "deceiver",
];

const SOUTH_CENTRAL_FALL_TRANSITION_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "squarebill_crankbait",
  "paddle_tail_swimbait",
  "spinnerbait",
  "suspending_jerkbait",
  "bladed_jig",
  "flat_sided_crankbait",
];
const SOUTH_CENTRAL_FALL_TRANSITION_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "deceiver",
  "articulated_baitfish_streamer",
  "woolly_bugger",
];

const SOUTH_CENTRAL_JUNE_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "football_jig",
  "deep_diving_crankbait",
  "soft_jerkbait",
  "paddle_tail_swimbait",
  "swim_jig",
  "spinnerbait",
];
const SOUTH_CENTRAL_JUNE_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
];

const DELTA_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "swim_jig",
  "spinnerbait",
  "hollow_body_frog",
  "bladed_jig",
  "compact_flipping_jig",
  "squarebill_crankbait",
  "soft_jerkbait",
];
const DELTA_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "frog_fly",
  "game_changer",
  "clouser_minnow",
  "woolly_bugger",
  "popper_fly",
];

const DELTA_FALL_TRANSITION_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "bladed_jig",
  "compact_flipping_jig",
  "spinnerbait",
  "swim_jig",
  "squarebill_crankbait",
  "paddle_tail_swimbait",
];
const DELTA_FALL_TRANSITION_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "rabbit_strip_leech",
  "game_changer",
  "clouser_minnow",
  "woolly_bugger",
  "frog_fly",
  "articulated_baitfish_streamer",
];

const TROPICAL_WARM_REGIONS: readonly RegionKey[] = ["florida", "hawaii"];
const SOUTHEAST_WARM_REGIONS: readonly RegionKey[] = [
  "gulf_coast",
  "southeast_atlantic",
];
const APPALACHIAN_REGIONS: readonly RegionKey[] = ["appalachian"];
const SOUTH_CENTRAL_REGIONS: readonly RegionKey[] = ["south_central"];
const NORTHERN_REGIONS: readonly RegionKey[] = [
  "northeast",
  "great_lakes_upper_midwest",
];
const MIDWEST_REGIONS: readonly RegionKey[] = ["midwest_interior"];
const WESTERN_WARM_REGIONS: readonly RegionKey[] = [
  "southern_california",
  "southwest_desert",
];
const WESTERN_INLAND_REGIONS: readonly RegionKey[] = [
  "mountain_west",
  "southwest_high_desert",
  "pacific_northwest",
  "northern_california",
  "inland_northwest",
];

export const LARGEMOUTH_V3_SUPPORTED_REGIONS: readonly RegionKey[] = [
  ...TROPICAL_WARM_REGIONS,
  ...SOUTHEAST_WARM_REGIONS,
  ...APPALACHIAN_REGIONS,
  ...SOUTH_CENTRAL_REGIONS,
  ...NORTHERN_REGIONS,
  ...MIDWEST_REGIONS,
  ...WESTERN_WARM_REGIONS,
  ...WESTERN_INLAND_REGIONS,
];

// Tropical warm lake / pond
addMonths(TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [1], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [2], {
  base_water_column: "bottom",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
  viable_lure_archetypes: PRESPAWN_LAKE_LURES,
  primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
  viable_fly_archetypes: PRESPAWN_LAKE_FLIES,
});
addMonths(TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [3], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["suspending_jerkbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: TROPICAL_PRESPAWN_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
  viable_fly_archetypes: TROPICAL_PRESPAWN_LAKE_FLIES,
});
addMonths(TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [4], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["suspending_jerkbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: TROPICAL_PRESPAWN_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
  viable_fly_archetypes: TROPICAL_PRESPAWN_LAKE_FLIES,
});
addMonths(TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [5], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "hollow_body_frog"],
  viable_lure_archetypes: TEXAS_SPAWN_TRANSITION_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: TEXAS_SPAWN_TRANSITION_LAKE_FLIES,
});
addMonths(TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["hollow_body_frog", "swim_jig"],
  viable_lure_archetypes: SUMMER_LAKE_LURES,
  primary_fly_archetypes: ["popper_fly", "frog_fly"],
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});
addMonths(TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [7, 8], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["compact_flipping_jig", "football_jig"],
  viable_lure_archetypes: TROPICAL_SUMMER_CONTROL_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: TROPICAL_SUMMER_CONTROL_LAKE_FLIES,
});
addMonths(TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [9, 10, 11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: FALL_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});

// Tropical warm river
addMonths(TROPICAL_WARM_REGIONS, "freshwater_river", [1, 2], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(TROPICAL_WARM_REGIONS, "freshwater_river", [3, 4], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(TROPICAL_WARM_REGIONS, "freshwater_river", [5, 6], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(TROPICAL_WARM_REGIONS, "freshwater_river", [7, 8], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["compact_flipping_jig", "spinnerbait"],
  viable_lure_archetypes: SOUTH_CENTRAL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "crawfish_streamer"],
  viable_fly_archetypes: SOUTH_CENTRAL_SUMMER_RIVER_FLIES,
});
addMonths(TROPICAL_WARM_REGIONS, "freshwater_river", [9, 10, 11], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(TROPICAL_WARM_REGIONS, "freshwater_river", [12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Southeast warm lake / pond
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [1], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [2, 3], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
  viable_lure_archetypes: PRESPAWN_LAKE_LURES,
  primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
  viable_fly_archetypes: PRESPAWN_LAKE_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [4, 5], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "wacky_rigged_stick_worm"],
  viable_lure_archetypes: SPAWN_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: SPAWN_LAKE_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [5], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "hollow_body_frog"],
  viable_lure_archetypes: SOUTHERN_MAY_FROG_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: SPAWN_LAKE_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [6], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["swim_jig", "paddle_tail_swimbait"],
  viable_lure_archetypes: POSTSPAWN_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: POSTSPAWN_LAKE_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [7, 8], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["compact_flipping_jig", "football_jig"],
  viable_lure_archetypes: SOUTHEAST_SUMMER_CONTROL_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: SOUTHEAST_SUMMER_CONTROL_LAKE_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["prop_bait", "walking_topwater"],
  viable_lure_archetypes: EARLY_FALL_GRASS_LAKE_LURES,
  primary_fly_archetypes: ["popper_fly", "game_changer"],
  viable_fly_archetypes: EARLY_FALL_GRASS_LAKE_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [10], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: FALL_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [11], {
  base_water_column: "bottom",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});

// Southeast warm river
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_river", [1, 2], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_river", [3, 4, 5], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_river", [6], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_river", [7, 8], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["compact_flipping_jig", "spinnerbait"],
  viable_lure_archetypes: SOUTH_CENTRAL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "crawfish_streamer"],
  viable_fly_archetypes: SOUTH_CENTRAL_SUMMER_RIVER_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_river", [9, 10], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(SOUTHEAST_WARM_REGIONS, "freshwater_river", [11, 12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Appalachian lake / pond
addMonths(APPALACHIAN_REGIONS, "freshwater_lake_pond", [1, 2], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(APPALACHIAN_REGIONS, "freshwater_lake_pond", [3], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
  viable_lure_archetypes: PRESPAWN_LAKE_LURES,
  primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
  viable_fly_archetypes: PRESPAWN_LAKE_FLIES,
});
addMonths(APPALACHIAN_REGIONS, "freshwater_lake_pond", [4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["suspending_jerkbait", "wacky_rigged_stick_worm"],
  viable_lure_archetypes: CLEAR_SPRING_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "balanced_leech"],
  viable_fly_archetypes: CLEAR_SPRING_LAKE_FLIES,
});
addMonths(APPALACHIAN_REGIONS, "freshwater_lake_pond", [5], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "wacky_rigged_stick_worm"],
  viable_lure_archetypes: SPAWN_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: SPAWN_LAKE_FLIES,
});
addMonths(APPALACHIAN_REGIONS, "freshwater_lake_pond", [6], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["swim_jig", "paddle_tail_swimbait"],
  viable_lure_archetypes: POSTSPAWN_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: POSTSPAWN_LAKE_FLIES,
});
addMonths(APPALACHIAN_REGIONS, "freshwater_lake_pond", [7, 8], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["hollow_body_frog", "swim_jig"],
  viable_lure_archetypes: SUMMER_LAKE_LURES,
  primary_fly_archetypes: ["popper_fly", "frog_fly"],
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});
addMonths(APPALACHIAN_REGIONS, "freshwater_lake_pond", [9, 10], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: FALL_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(APPALACHIAN_REGIONS, "freshwater_lake_pond", [11, 12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});

// Appalachian river
addMonths(APPALACHIAN_REGIONS, "freshwater_river", [1, 2], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(APPALACHIAN_REGIONS, "freshwater_river", [3, 4, 5], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(APPALACHIAN_REGIONS, "freshwater_river", [6, 7, 8], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["walking_topwater", "swim_jig"],
  viable_lure_archetypes: SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["popper_fly", "game_changer"],
  viable_fly_archetypes: SUMMER_RIVER_FLIES,
});
addMonths(APPALACHIAN_REGIONS, "freshwater_river", [9, 10], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(APPALACHIAN_REGIONS, "freshwater_river", [11, 12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// South central lake / pond
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_lake_pond", [1], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_lake_pond", [2, 3], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
  viable_lure_archetypes: PRESPAWN_LAKE_LURES,
  primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
  viable_fly_archetypes: PRESPAWN_LAKE_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_lake_pond", [4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["suspending_jerkbait", "wacky_rigged_stick_worm"],
  viable_lure_archetypes: CLEAR_SPRING_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "balanced_leech"],
  viable_fly_archetypes: CLEAR_SPRING_LAKE_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_lake_pond", [5], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["swim_jig", "paddle_tail_swimbait"],
  viable_lure_archetypes: POSTSPAWN_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: POSTSPAWN_LAKE_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_lake_pond", [6, 7, 8], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "crawfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "rabbit_strip_leech"],
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_lake_pond", [9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["walking_topwater", "swim_jig"],
  viable_lure_archetypes: EARLY_FALL_GRASS_LAKE_LURES,
  primary_fly_archetypes: ["popper_fly", "game_changer"],
  viable_fly_archetypes: EARLY_FALL_GRASS_LAKE_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_lake_pond", [10], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: FALL_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_lake_pond", [11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_lake_pond", [12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "leech_worm",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["shaky_head_worm", "football_jig"],
  viable_lure_archetypes: COLD_CLEAR_POND_LURES,
  primary_fly_archetypes: ["balanced_leech", "sculpin_streamer"],
  viable_fly_archetypes: COLD_CLEAR_POND_FLIES,
});

// South central river
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_river", [1, 2], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_river", [3, 4], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_river", [5], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["spinnerbait", "swim_jig"],
  viable_lure_archetypes: CURRENT_SEAM_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: CURRENT_SEAM_RIVER_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_river", [6], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "bluegill_perch",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["compact_flipping_jig", "spinnerbait"],
  viable_lure_archetypes: DIRTY_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["frog_fly", "game_changer"],
  viable_fly_archetypes: DIRTY_SUMMER_RIVER_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_river", [7, 8], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "crawfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "rabbit_strip_leech"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_river", [9, 10], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(SOUTH_CENTRAL_REGIONS, "freshwater_river", [11, 12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Northern and midwest lakes
addMonths([...NORTHERN_REGIONS, ...MIDWEST_REGIONS], "freshwater_lake_pond", [
  1,
  2,
], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(NORTHERN_REGIONS, "freshwater_lake_pond", [3, 4, 5], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
  viable_lure_archetypes: PRESPAWN_LAKE_LURES,
  primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
  viable_fly_archetypes: PRESPAWN_LAKE_FLIES,
});
addMonths(MIDWEST_REGIONS, "freshwater_lake_pond", [3, 4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
  viable_lure_archetypes: PRESPAWN_LAKE_LURES,
  primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
  viable_fly_archetypes: PRESPAWN_LAKE_FLIES,
});
addMonths(NORTHERN_REGIONS, "freshwater_lake_pond", [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "wacky_rigged_stick_worm"],
  viable_lure_archetypes: SPAWN_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: SPAWN_LAKE_FLIES,
});
addMonths(MIDWEST_REGIONS, "freshwater_lake_pond", [5, 6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "wacky_rigged_stick_worm"],
  viable_lure_archetypes: SPAWN_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: SPAWN_LAKE_FLIES,
});
addMonths(NORTHERN_REGIONS, "freshwater_lake_pond", [7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["hollow_body_frog", "swim_jig"],
  viable_lure_archetypes: SUMMER_LAKE_LURES,
  primary_fly_archetypes: ["popper_fly", "frog_fly"],
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});
addMonths(NORTHERN_REGIONS, "freshwater_lake_pond", [8], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "bluegill_perch",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["wacky_rigged_stick_worm", "drop_shot_worm"],
  viable_lure_archetypes: LATE_SUMMER_CLEAR_LAKE_LURES,
  primary_fly_archetypes: ["game_changer", "woolly_bugger"],
  viable_fly_archetypes: LATE_SUMMER_CLEAR_LAKE_FLIES,
});
addMonths(MIDWEST_REGIONS, "freshwater_lake_pond", [7, 8], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["hollow_body_frog", "swim_jig"],
  viable_lure_archetypes: SUMMER_LAKE_LURES,
  primary_fly_archetypes: ["popper_fly", "frog_fly"],
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});
addMonths(NORTHERN_REGIONS, "freshwater_lake_pond", [9, 10], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: FALL_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(MIDWEST_REGIONS, "freshwater_lake_pond", [9, 10], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: FALL_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths([...NORTHERN_REGIONS, ...MIDWEST_REGIONS], "freshwater_lake_pond", [
  11,
  12,
], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});

// Northern and midwest rivers
addMonths([...NORTHERN_REGIONS, ...MIDWEST_REGIONS], "freshwater_river", [
  1,
  2,
  3,
], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(NORTHERN_REGIONS, "freshwater_river", [4, 5, 6], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(MIDWEST_REGIONS, "freshwater_river", [4, 5], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(NORTHERN_REGIONS, "freshwater_river", [7, 8], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["walking_topwater", "swim_jig"],
  viable_lure_archetypes: SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["popper_fly", "game_changer"],
  viable_fly_archetypes: SUMMER_RIVER_FLIES,
});
addMonths(MIDWEST_REGIONS, "freshwater_river", [6, 7, 8], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["walking_topwater", "swim_jig"],
  viable_lure_archetypes: SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["popper_fly", "game_changer"],
  viable_fly_archetypes: SUMMER_RIVER_FLIES,
});
addMonths([...NORTHERN_REGIONS, ...MIDWEST_REGIONS], "freshwater_river", [
  9,
  10,
], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths([...NORTHERN_REGIONS, ...MIDWEST_REGIONS], "freshwater_river", [
  11,
  12,
], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Western warm and inland lakes
addMonths(
  [...WESTERN_WARM_REGIONS, ...WESTERN_INLAND_REGIONS],
  "freshwater_lake_pond",
  [1, 2],
  {
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
    viable_lure_archetypes: WINTER_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: WINTER_LAKE_FLIES,
  },
);
addMonths(WESTERN_WARM_REGIONS, "freshwater_lake_pond", [3, 4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
  viable_lure_archetypes: PRESPAWN_LAKE_LURES,
  primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
  viable_fly_archetypes: PRESPAWN_LAKE_FLIES,
});
addMonths(WESTERN_INLAND_REGIONS, "freshwater_lake_pond", [3, 4, 5], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
  viable_lure_archetypes: PRESPAWN_LAKE_LURES,
  primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
  viable_fly_archetypes: PRESPAWN_LAKE_FLIES,
});
addMonths(WESTERN_WARM_REGIONS, "freshwater_lake_pond", [5], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "wacky_rigged_stick_worm"],
  viable_lure_archetypes: SPAWN_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: SPAWN_LAKE_FLIES,
});
addMonths(WESTERN_INLAND_REGIONS, "freshwater_lake_pond", [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "wacky_rigged_stick_worm"],
  viable_lure_archetypes: SPAWN_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: SPAWN_LAKE_FLIES,
});
addMonths(WESTERN_WARM_REGIONS, "freshwater_lake_pond", [6, 7, 8, 9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["hollow_body_frog", "swim_jig"],
  viable_lure_archetypes: SUMMER_LAKE_LURES,
  primary_fly_archetypes: ["popper_fly", "frog_fly"],
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});
addMonths(WESTERN_INLAND_REGIONS, "freshwater_lake_pond", [7, 8, 9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["hollow_body_frog", "swim_jig"],
  viable_lure_archetypes: SUMMER_LAKE_LURES,
  primary_fly_archetypes: ["popper_fly", "frog_fly"],
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});
addMonths(
  [...WESTERN_WARM_REGIONS, ...WESTERN_INLAND_REGIONS],
  "freshwater_lake_pond",
  [10],
  {
    base_water_column: "mid",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: FALL_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: FALL_LAKE_FLIES,
  },
);
addMonths(
  [...WESTERN_WARM_REGIONS, ...WESTERN_INLAND_REGIONS],
  "freshwater_lake_pond",
  [11, 12],
  {
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
    viable_lure_archetypes: WINTER_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: WINTER_LAKE_FLIES,
  },
);

// Western rivers
addMonths(
  [...WESTERN_WARM_REGIONS, ...WESTERN_INLAND_REGIONS],
  "freshwater_river",
  [1, 2, 3],
  {
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "subtle",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
    viable_lure_archetypes: WINTER_RIVER_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: WINTER_RIVER_FLIES,
  },
);
addMonths(
  [...WESTERN_WARM_REGIONS, ...WESTERN_INLAND_REGIONS],
  "freshwater_river",
  [4, 5, 6],
  {
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
    viable_lure_archetypes: SPRING_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
    viable_fly_archetypes: SPRING_RIVER_FLIES,
  },
);
addMonths(
  [...WESTERN_WARM_REGIONS, ...WESTERN_INLAND_REGIONS],
  "freshwater_river",
  [7, 8, 9],
  {
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["walking_topwater", "swim_jig"],
    viable_lure_archetypes: SUMMER_RIVER_LURES,
    primary_fly_archetypes: ["popper_fly", "game_changer"],
    viable_fly_archetypes: SUMMER_RIVER_FLIES,
  },
);
addMonths(
  [...WESTERN_WARM_REGIONS, ...WESTERN_INLAND_REGIONS],
  "freshwater_river",
  [10],
  {
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: FALL_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: FALL_RIVER_FLIES,
  },
);
addMonths(
  [...WESTERN_WARM_REGIONS, ...WESTERN_INLAND_REGIONS],
  "freshwater_river",
  [11, 12],
  {
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
    viable_lure_archetypes: WINTER_RIVER_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: WINTER_RIVER_FLIES,
  },
);

// Focused largemouth overrides for audited high-value windows.
addMonths(["florida"], "freshwater_lake_pond", [2], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["suspending_jerkbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: FLORIDA_PRESPAWN_PUSH_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
  viable_fly_archetypes: FLORIDA_PRESPAWN_PUSH_LAKE_FLIES,
});
addMonths(["florida"], "freshwater_lake_pond", [4], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "leech_worm",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["wacky_rigged_stick_worm", "compact_flipping_jig"],
  viable_lure_archetypes: FLORIDA_SPAWN_CLEAR_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "crawfish_streamer"],
  viable_fly_archetypes: FLORIDA_SPAWN_CLEAR_LAKE_FLIES,
});
addMonths(["florida"], "freshwater_lake_pond", [5], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "leech_worm",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["texas_rigged_stick_worm", "hollow_body_frog"],
  viable_lure_archetypes: FLORIDA_MAY_SHALLOW_COVER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "frog_fly"],
  viable_fly_archetypes: FLORIDA_POSTSPAWN_SHALLOW_LAKE_FLIES,
});
addMonths(["florida"], "freshwater_lake_pond", [7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["buzzbait", "hollow_body_frog"],
  viable_lure_archetypes: FLORIDA_MIDSUMMER_GRASS_LAKE_LURES,
  primary_fly_archetypes: ["frog_fly", "game_changer"],
  viable_fly_archetypes: FLORIDA_MIDSUMMER_GRASS_LAKE_FLIES,
});
addMonths(["florida"], "freshwater_lake_pond", [8], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["prop_bait", "hollow_body_frog"],
  viable_lure_archetypes: FLORIDA_MIDSUMMER_GRASS_LAKE_LURES,
  primary_fly_archetypes: ["frog_fly", "game_changer"],
  viable_fly_archetypes: FLORIDA_MIDSUMMER_GRASS_LAKE_FLIES,
});
addMonths(["florida"], "freshwater_lake_pond", [10], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["swim_jig", "walking_topwater"],
  viable_lure_archetypes: FLORIDA_FALL_GRASS_LAKE_LURES,
  primary_fly_archetypes: ["popper_fly", "frog_fly"],
  viable_fly_archetypes: FLORIDA_FALL_GRASS_LAKE_FLIES,
});
addMonths(["florida"], "freshwater_lake_pond", [12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: [
    "texas_rigged_soft_plastic_craw",
    "suspending_jerkbait",
  ],
  viable_lure_archetypes: FLORIDA_WINTER_CONTROL_LAKE_LURES,
  primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
  viable_fly_archetypes: FLORIDA_WINTER_CONTROL_LAKE_FLIES,
});
addMonths(["south_central"], "freshwater_lake_pond", [4], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "soft_jerkbait"],
  viable_lure_archetypes: SOUTH_CENTRAL_CLEAR_SPRING_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: SOUTH_CENTRAL_CLEAR_SPRING_LAKE_FLIES,
});
addMonths(["south_central"], "freshwater_lake_pond", [6], {
  base_water_column: "bottom",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "football_jig"],
  viable_lure_archetypes: SOUTH_CENTRAL_JUNE_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: SOUTH_CENTRAL_JUNE_LAKE_FLIES,
});
addMonths(["south_central"], "freshwater_lake_pond", [1], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
  viable_lure_archetypes: TEXAS_COLD_STAINED_RESERVOIR_LURES,
  primary_fly_archetypes: ["balanced_leech", "woolly_bugger"],
  viable_fly_archetypes: TEXAS_COLD_STAINED_RESERVOIR_FLIES,
});
addMonths(["south_central"], "freshwater_lake_pond", [7], {
  base_water_column: "bottom",
  base_mood: "neutral",
  base_presentation_style: "bold",
  primary_forage: "crawfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["compact_flipping_jig", "deep_diving_crankbait"],
  viable_lure_archetypes: TEXAS_DIRTY_SUMMER_RESERVOIR_LURES,
  primary_fly_archetypes: ["woolly_bugger", "crawfish_streamer"],
  viable_fly_archetypes: TEXAS_DIRTY_SUMMER_RESERVOIR_FLIES,
});
addMonths(["south_central"], "freshwater_lake_pond", [8], {
  base_water_column: "bottom",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "football_jig"],
  viable_lure_archetypes: TEXAS_SUMMER_RESERVOIR_CONTROL_LURES,
  primary_fly_archetypes: ["woolly_bugger", "crawfish_streamer"],
  viable_fly_archetypes: TEXAS_SUMMER_RESERVOIR_CONTROL_FLIES,
});
addMonths(["south_central"], "freshwater_lake_pond", [9, 10], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["squarebill_crankbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: SOUTH_CENTRAL_FALL_TRANSITION_LAKE_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: SOUTH_CENTRAL_FALL_TRANSITION_LAKE_FLIES,
});
addMonths(["south_central"], "freshwater_river", [1], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
  viable_lure_archetypes: SOUTH_CENTRAL_WINTER_RIVER_LURES,
  primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
  viable_fly_archetypes: SOUTH_CENTRAL_WINTER_RIVER_FLIES,
});
addMonths(["south_central"], "freshwater_river", [2, 4], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["spinnerbait", "swim_jig"],
  viable_lure_archetypes: SOUTH_CENTRAL_PRESPAWN_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: SOUTH_CENTRAL_PRESPAWN_RIVER_FLIES,
});
addMonths(["south_central"], "freshwater_river", [6, 8], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
  viable_lure_archetypes: SOUTH_CENTRAL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["frog_fly", "game_changer"],
  viable_fly_archetypes: SOUTH_CENTRAL_SUMMER_RIVER_FLIES,
});
addMonths(["south_central"], "freshwater_river", [11], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: SOUTH_CENTRAL_FALL_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: SOUTH_CENTRAL_FALL_RIVER_FLIES,
});
addMonths(["south_central"], "freshwater_river", [12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
  viable_lure_archetypes: SOUTH_CENTRAL_WINTER_RIVER_LURES,
  primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
  viable_fly_archetypes: SOUTH_CENTRAL_WINTER_RIVER_FLIES,
});
addMonths(["south_central"], "freshwater_river", [3], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["spinnerbait", "swim_jig"],
  viable_lure_archetypes: CURRENT_SEAM_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: CURRENT_SEAM_RIVER_FLIES,
});
addMonths(["south_central"], "freshwater_river", [9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "swim_jig"],
  viable_lure_archetypes: CURRENT_SEAM_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: CURRENT_SEAM_RIVER_FLIES,
});
addMonths(["south_central"], "freshwater_river", [7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["swim_jig", "spinnerbait"],
  viable_lure_archetypes: SUMMER_CURRENT_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: SUMMER_CURRENT_RIVER_FLIES,
});
addMonths(["gulf_coast"], "freshwater_lake_pond", [11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["bladed_jig", "spinnerbait"],
  viable_lure_archetypes: GULF_LATE_FALL_GRASS_LAKE_LURES,
  primary_fly_archetypes: ["game_changer", "clouser_minnow"],
  viable_fly_archetypes: GULF_LATE_FALL_GRASS_LAKE_FLIES,
});
addMonths(["gulf_coast"], "freshwater_lake_pond", [3], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["lipless_crankbait", "spinnerbait"],
  viable_lure_archetypes: GULF_DIRTY_PRESPAWN_GRASS_LAKE_LURES,
  primary_fly_archetypes: ["game_changer", "clouser_minnow"],
  viable_fly_archetypes: GULF_DIRTY_PRESPAWN_GRASS_LAKE_FLIES,
});
addMonths(["northeast"], "freshwater_lake_pond", [1, 2], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["suspending_jerkbait", "flat_sided_crankbait"],
  viable_lure_archetypes: NORTHERN_CLEAR_WINTER_LAKE_LURES,
  primary_fly_archetypes: ["rabbit_strip_leech", "sculpin_streamer"],
  viable_fly_archetypes: NORTHERN_CLEAR_WINTER_LAKE_FLIES,
});
addMonths(["northeast"], "freshwater_lake_pond", [4, 5], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["weightless_stick_worm", "wacky_rigged_stick_worm"],
  viable_lure_archetypes: NORTHERN_CLEAR_SPAWN_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "clouser_minnow"],
  viable_fly_archetypes: NORTHERN_CLEAR_SPAWN_LAKE_FLIES,
});
addMonths(["northeast"], "freshwater_lake_pond", [6, 7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "subtle",
  primary_forage: "bluegill_perch",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["wacky_rigged_stick_worm", "soft_jerkbait"],
  viable_lure_archetypes: NORTHERN_CLEAR_SUMMER_LAKE_LURES,
  primary_fly_archetypes: ["game_changer", "woolly_bugger"],
  viable_fly_archetypes: NORTHERN_CLEAR_SUMMER_LAKE_FLIES,
});
addMonths(["northeast"], "freshwater_lake_pond", [11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "swim_jig"],
  viable_lure_archetypes: NORTHERN_CLEAR_FALL_LAKE_LURES,
  primary_fly_archetypes: ["game_changer", "clouser_minnow"],
  viable_fly_archetypes: NORTHERN_CLEAR_FALL_LAKE_FLIES,
});
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [5], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "leech_worm",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["weightless_stick_worm", "wacky_rigged_stick_worm"],
  viable_lure_archetypes: NORTHERN_CLEAR_SPAWN_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "clouser_minnow"],
  viable_fly_archetypes: NORTHERN_CLEAR_SPAWN_LAKE_FLIES,
});
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [1, 2], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["suspending_jerkbait", "flat_sided_crankbait"],
  viable_lure_archetypes: NORTHERN_CLEAR_WINTER_LAKE_LURES,
  primary_fly_archetypes: ["rabbit_strip_leech", "sculpin_streamer"],
  viable_fly_archetypes: NORTHERN_CLEAR_WINTER_LAKE_FLIES,
});
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [4], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "leech_worm",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["weightless_stick_worm", "wacky_rigged_stick_worm"],
  viable_lure_archetypes: NORTHERN_CLEAR_SPAWN_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "clouser_minnow"],
  viable_fly_archetypes: NORTHERN_CLEAR_SPAWN_LAKE_FLIES,
});
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [6, 7], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "leech_worm",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["wacky_rigged_stick_worm", "soft_jerkbait"],
  viable_lure_archetypes: NORTHERN_CLEAR_SUMMER_LAKE_LURES,
  primary_fly_archetypes: ["game_changer", "woolly_bugger"],
  viable_fly_archetypes: NORTHERN_CLEAR_SUMMER_LAKE_FLIES,
});
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [8], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "leech_worm",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["drop_shot_worm", "wacky_rigged_stick_worm"],
  viable_lure_archetypes: NORTHERN_CLEAR_SUMMER_LAKE_LURES,
  primary_fly_archetypes: ["game_changer", "woolly_bugger"],
  viable_fly_archetypes: NORTHERN_CLEAR_SUMMER_LAKE_FLIES,
});
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [10], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "swim_jig"],
  viable_lure_archetypes: NORTHERN_CLEAR_FALL_LAKE_LURES,
  primary_fly_archetypes: ["game_changer", "clouser_minnow"],
  viable_fly_archetypes: NORTHERN_CLEAR_FALL_LAKE_FLIES,
});
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "swim_jig"],
  viable_lure_archetypes: NORTHERN_CLEAR_FALL_LAKE_LURES,
  primary_fly_archetypes: ["game_changer", "clouser_minnow"],
  viable_fly_archetypes: NORTHERN_CLEAR_FALL_LAKE_FLIES,
});
addMonths(["south_central"], "freshwater_lake_pond", [11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["suspending_jerkbait", "football_jig"],
  viable_lure_archetypes: SOUTH_CENTRAL_LATEFALL_RESERVOIR_LURES,
  primary_fly_archetypes: ["balanced_leech", "woolly_bugger"],
  viable_fly_archetypes: SOUTH_CENTRAL_LATEFALL_RESERVOIR_FLIES,
});
addMonths(["northern_california"], "freshwater_river", [3], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["soft_jerkbait", "compact_flipping_jig"],
  viable_lure_archetypes: DELTA_CLEAR_PRESPAWN_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "game_changer"],
  viable_fly_archetypes: DELTA_CLEAR_PRESPAWN_RIVER_FLIES,
});
addMonths(["northern_california"], "freshwater_river", [11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["bladed_jig", "suspending_jerkbait"],
  viable_lure_archetypes: DELTA_LATE_FALL_RIVER_LURES,
  primary_fly_archetypes: ["balanced_leech", "game_changer"],
  viable_fly_archetypes: DELTA_LATE_FALL_RIVER_FLIES,
});
addMonths(["northern_california"], "freshwater_river", [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["swim_jig", "spinnerbait"],
  viable_lure_archetypes: DELTA_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["frog_fly", "game_changer"],
  viable_fly_archetypes: DELTA_SUMMER_RIVER_FLIES,
});
addMonths(["northern_california"], "freshwater_river", [9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["bladed_jig", "compact_flipping_jig"],
  viable_lure_archetypes: DELTA_FALL_TRANSITION_RIVER_LURES,
  primary_fly_archetypes: ["rabbit_strip_leech", "game_changer"],
  viable_fly_archetypes: DELTA_FALL_TRANSITION_RIVER_FLIES,
});

// Florida January: baitfish forage lets suspending beat football jig in this row.
addMonths(["florida"], "freshwater_lake_pond", [1], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: [
    "texas_rigged_soft_plastic_craw",
    "suspending_jerkbait",
  ],
  viable_lure_archetypes: FLORIDA_WINTER_CONTROL_LAKE_LURES,
  primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
  viable_fly_archetypes: FLORIDA_WINTER_CONTROL_LAKE_FLIES,
});

// Great Lakes / upper Midwest March prespawn: cold-clear rock transitions give
// a flat-sided crank one true late-winter window before the faster baitfish
// lanes take over.
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [3], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["flat_sided_crankbait", "suspending_jerkbait"],
  viable_lure_archetypes: NORTHERN_CLEAR_PRESPAWN_CRANK_LAKE_LURES,
  primary_fly_archetypes: ["rabbit_strip_leech", "sculpin_streamer"],
  viable_fly_archetypes: NORTHERN_CLEAR_WINTER_LAKE_FLIES,
});

// South-central October current and shad push: Deceiver gets a real fall chase
// lane without replacing the broader game-changer pool elsewhere.
addMonths(["south_central"], "freshwater_river", [10], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
  viable_lure_archetypes: SOUTH_CENTRAL_FALL_RIVER_LURES,
  primary_fly_archetypes: ["deceiver", "game_changer"],
  viable_fly_archetypes: SOUTH_CENTRAL_FALL_RIVER_FLIES,
});

// Minnesota weed-lake midsummer peak: July stays swim-jig led before late-summer finesse takes over.
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["swim_jig", "hollow_body_frog"],
  viable_lure_archetypes: MN_WEED_LAKE_SUMMER_LURES,
  primary_fly_archetypes: ["popper_fly", "frog_fly"],
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});

// Florida May shallow cover: keep the texas-rig winner window intact, but let
// frog earn real low-light pull as the secondary surface option.
addMonths(["florida"], "freshwater_lake_pond", [5], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "leech_worm",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["texas_rigged_stick_worm", "hollow_body_frog"],
  viable_lure_archetypes: FLORIDA_MAY_SHALLOW_COVER_LAKE_LURES,
  primary_fly_archetypes: ["woolly_bugger", "frog_fly"],
  viable_fly_archetypes: FLORIDA_POSTSPAWN_SHALLOW_LAKE_FLIES,
});

export const LARGEMOUTH_V3_SEASONAL_ROWS = LMB_ROWS;
