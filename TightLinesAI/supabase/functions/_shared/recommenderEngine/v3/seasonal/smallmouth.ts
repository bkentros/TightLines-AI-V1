import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  RecommenderV3Context,
  RecommenderV3SeasonalRow,
} from "../contracts.ts";
import type { RegionKey } from "../../../howFishingEngine/contracts/region.ts";

type SeasonalCore = Omit<RecommenderV3SeasonalRow, "species" | "region_key" | "month" | "context">;

const SMB_ROWS: RecommenderV3SeasonalRow[] = [];

function addMonths(
  regions: readonly RegionKey[],
  context: RecommenderV3Context,
  months: readonly number[],
  core: SeasonalCore,
) {
  for (const region_key of regions) {
    for (const month of months) {
      SMB_ROWS.push({
        species: "smallmouth_bass",
        region_key,
        context,
        month,
        ...core,
      });
    }
  }
}

const WINTER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "tube_jig",
  "hair_jig",
  "blade_bait",
  "suspending_jerkbait",
  "drop_shot_worm_minnow",
  "ned_rig",
  "football_jig",
];
const WINTER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "sculpin_streamer",
  "conehead_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
];

const PRESPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "tube_jig",
  "football_jig",
  "suspending_jerkbait",
  "ned_rig",
  "paddle_tail_swimbait",
  "hair_jig",
  "flat_sided_crankbait",
  "medium_diving_crankbait",
];
const PRESPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "crawfish_streamer",
  "sculpin_streamer",
  "clouser_minnow",
  "woolly_bugger",
  "game_changer",
  "zonker_streamer",
];

const SPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "tube_jig",
  "ned_rig",
  "drop_shot_worm_minnow",
  "suspending_jerkbait",
  "hair_jig",
  "soft_jerkbait",
];
const SPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "crawfish_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "clouser_minnow",
  "sculpin_streamer",
];

const POSTSPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "tube_jig",
  "soft_jerkbait",
  "paddle_tail_swimbait",
  "spinnerbait",
  "hair_jig",
  "walking_topwater",
  "drop_shot_worm_minnow",
];
const POSTSPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "woolly_bugger",
  "zonker_streamer",
  "popper_fly",
  "mouse_fly",
];

const GREAT_LAKES_POSTSPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "soft_jerkbait",
  "paddle_tail_swimbait",
  "walking_topwater",
  "tube_jig",
  "drop_shot_worm_minnow",
  "hair_jig",
  "spinnerbait",
];
const GREAT_LAKES_POSTSPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "woolly_bugger",
  "zonker_streamer",
  "popper_fly",
  "mouse_fly",
];

const GREAT_LAKES_MIDSUMMER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "walking_topwater",
  "paddle_tail_swimbait",
  "drop_shot_worm_minnow",
  "soft_jerkbait",
  "tube_jig",
  "hair_jig",
  "spinnerbait",
  "popping_topwater",
];
const GREAT_LAKES_MIDSUMMER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "popper_fly",
  "clouser_minnow",
  "game_changer",
  "mouse_fly",
  "woolly_bugger",
  "articulated_baitfish_streamer",
];

const GREAT_LAKES_LATEFALL_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "blade_bait",
  "hair_jig",
  "paddle_tail_swimbait",
  "tube_jig",
  "drop_shot_worm_minnow",
];
const GREAT_LAKES_LATEFALL_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "slim_minnow_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "sculpin_streamer",
];

const MIDWEST_DIRTY_PRESPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "tube_jig",
  "suspending_jerkbait",
  "paddle_tail_swimbait",
  "flat_sided_crankbait",
  "hair_jig",
];
const MIDWEST_DIRTY_PRESPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "woolly_bugger",
  "sculpin_streamer",
  "crawfish_streamer",
  "game_changer",
];

const GREAT_LAKES_STAINED_SUMMER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "walking_topwater",
  "paddle_tail_swimbait",
  "tube_jig",
  "drop_shot_worm_minnow",
  "hair_jig",
  "soft_jerkbait",
];
const GREAT_LAKES_STAINED_SUMMER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "popper_fly",
  "mouse_fly",
  "woolly_bugger",
];

const GREAT_LAKES_CLEAR_SUMMER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "hair_jig",
  "tube_jig",
  "drop_shot_worm_minnow",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "walking_topwater",
  "suspending_jerkbait",
];
const GREAT_LAKES_CLEAR_SUMMER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "woolly_bugger",
  "game_changer",
  "mouse_fly",
  "popper_fly",
];

const WESTERN_POSTSPAWN_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "soft_jerkbait",
  "inline_spinner",
  "walking_topwater",
  "paddle_tail_swimbait",
  "tube_jig",
  "ned_rig",
  "spinnerbait",
];
const WESTERN_POSTSPAWN_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "popper_fly",
  "muddler_sculpin",
  "woolly_bugger",
  "zonker_streamer",
];

const NORTHWEST_EARLY_FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "inline_spinner",
  "paddle_tail_swimbait",
  "spinnerbait",
  "tube_jig",
  "soft_jerkbait",
  "blade_bait",
];
const NORTHWEST_EARLY_FALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "slim_minnow_streamer",
  "game_changer",
  "articulated_baitfish_streamer",
  "woolly_bugger",
];

const SOUTH_CENTRAL_LATEFALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "blade_bait",
  "suspending_jerkbait",
  "paddle_tail_swimbait",
  "tube_jig",
  "inline_spinner",
  "hair_jig",
];
const SOUTH_CENTRAL_LATEFALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "slim_minnow_streamer",
  "clouser_minnow",
  "woolly_bugger",
  "sculpin_streamer",
  "articulated_baitfish_streamer",
];

const MIDWEST_LATEFALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "blade_bait",
  "suspending_jerkbait",
  "paddle_tail_swimbait",
  "tube_jig",
  "hair_jig",
  "inline_spinner",
];
const MIDWEST_LATEFALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "slim_minnow_streamer",
  "clouser_minnow",
  "articulated_baitfish_streamer",
  "woolly_bugger",
  "sculpin_streamer",
];

const SOUTH_CENTRAL_EARLYFALL_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "paddle_tail_swimbait",
  "spinnerbait",
  "hair_jig",
  "tube_jig",
  "walking_topwater",
];
const SOUTH_CENTRAL_EARLYFALL_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "slim_minnow_streamer",
  "game_changer",
  "woolly_bugger",
  "mouse_fly",
];

const SOUTH_CENTRAL_EARLYFALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "spinnerbait",
  "paddle_tail_swimbait",
  "inline_spinner",
  "tube_jig",
  "blade_bait",
];
const SOUTH_CENTRAL_EARLYFALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "slim_minnow_streamer",
  "game_changer",
  "woolly_bugger",
  "mouse_fly",
];

const NORTHEAST_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "walking_topwater",
  "inline_spinner",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "spinnerbait",
  "tube_jig",
];
const NORTHEAST_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "popper_fly",
  "clouser_minnow",
  "game_changer",
  "woolly_bugger",
  "muddler_sculpin",
];

const GREAT_LAKES_CLEAR_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "tube_jig",
  "suspending_jerkbait",
  "squarebill_crankbait",
  "soft_jerkbait",
  "inline_spinner",
  "paddle_tail_swimbait",
];
const GREAT_LAKES_CLEAR_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "muddler_sculpin",
  "woolly_bugger",
  "game_changer",
  "mouse_fly",
];

const NORTHEAST_LATEFALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "paddle_tail_swimbait",
  "blade_bait",
  "tube_jig",
  "hair_jig",
  "inline_spinner",
];
const NORTHEAST_LATEFALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "slim_minnow_streamer",
  "clouser_minnow",
  "articulated_baitfish_streamer",
  "woolly_bugger",
  "sculpin_streamer",
];

const MIDWEST_DIRTY_SUMMER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "paddle_tail_swimbait",
  "tube_jig",
  "suspending_jerkbait",
  "soft_jerkbait",
  "medium_diving_crankbait",
];
const MIDWEST_DIRTY_SUMMER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "woolly_bugger",
  "sculpin_streamer",
  "articulated_baitfish_streamer",
];

const MOUNTAIN_WEST_EARLYFALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "inline_spinner",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "tube_jig",
  "blade_bait",
];
const MOUNTAIN_WEST_EARLYFALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "slim_minnow_streamer",
  "game_changer",
  "articulated_baitfish_streamer",
  "woolly_bugger",
];

const NORTHWEST_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "walking_topwater",
  "inline_spinner",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "tube_jig",
  "spinnerbait",
];
const NORTHWEST_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "popper_fly",
  "clouser_minnow",
  "game_changer",
  "woolly_bugger",
  "muddler_sculpin",
];

const SUMMER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "walking_topwater",
  "popping_topwater",
  "tube_jig",
  "drop_shot_worm_minnow",
  "hair_jig",
  "paddle_tail_swimbait",
  "spinnerbait",
  "suspending_jerkbait",
];
const SUMMER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "popper_fly",
  "mouse_fly",
  "clouser_minnow",
  "game_changer",
  "woolly_bugger",
  "articulated_baitfish_streamer",
];

const FALL_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "paddle_tail_swimbait",
  "spinnerbait",
  "hair_jig",
  "medium_diving_crankbait",
  "blade_bait",
  "walking_topwater",
];
const FALL_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "slim_minnow_streamer",
  "game_changer",
  "woolly_bugger",
  "zonker_streamer",
  "articulated_baitfish_streamer",
];

const WINTER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "tube_jig",
  "hair_jig",
  "ned_rig",
  "blade_bait",
  "suspending_jerkbait",
  "drop_shot_worm_minnow",
];
const WINTER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "sculpin_streamer",
  "crawfish_streamer",
  "conehead_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
];

const SPRING_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "tube_jig",
  "ned_rig",
  "spinnerbait",
  "soft_jerkbait",
  "suspending_jerkbait",
  "squarebill_crankbait",
  "paddle_tail_swimbait",
  "inline_spinner",
];
const SPRING_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "crawfish_streamer",
  "woolly_bugger",
  "sculpin_streamer",
  "game_changer",
  "zonker_streamer",
];

const SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "walking_topwater",
  "popping_topwater",
  "inline_spinner",
  "spinnerbait",
  "tube_jig",
  "ned_rig",
  "soft_jerkbait",
  "squarebill_crankbait",
  "paddle_tail_swimbait",
];
const SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "popper_fly",
  "mouse_fly",
  "clouser_minnow",
  "game_changer",
  "woolly_bugger",
  "muddler_sculpin",
  "zonker_streamer",
];

const FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "spinnerbait",
  "paddle_tail_swimbait",
  "tube_jig",
  "blade_bait",
  "squarebill_crankbait",
  "inline_spinner",
];
const FALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "slim_minnow_streamer",
  "game_changer",
  "woolly_bugger",
  "zonker_streamer",
  "articulated_baitfish_streamer",
];

const WARM_HIGHLAND_REGIONS: readonly RegionKey[] = ["appalachian", "south_central"];
const NORTHERN_COLD_REGIONS: readonly RegionKey[] = [
  "northeast",
  "great_lakes_upper_midwest",
  "midwest_interior",
];
const WESTERN_MIXED_REGIONS: readonly RegionKey[] = [
  "mountain_west",
  "inland_northwest",
  "pacific_northwest",
  "northern_california",
];
const WARM_WESTERN_REGIONS: readonly RegionKey[] = [
  "southern_california",
  "southwest_desert",
  "southwest_high_desert",
];

export const SMALLMOUTH_V3_SUPPORTED_REGIONS: readonly RegionKey[] = [
  ...WARM_HIGHLAND_REGIONS,
  ...NORTHERN_COLD_REGIONS,
  ...WESTERN_MIXED_REGIONS,
  ...WARM_WESTERN_REGIONS,
];

// Warm highland lake / pond
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_lake_pond", [1, 2], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_lake_pond", [3, 4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: PRESPAWN_LAKE_LURES,
  viable_fly_archetypes: PRESPAWN_LAKE_FLIES,
});
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_lake_pond", [5], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: SPAWN_LAKE_LURES,
  viable_fly_archetypes: SPAWN_LAKE_FLIES,
});
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_lake_pond", [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: POSTSPAWN_LAKE_LURES,
  viable_fly_archetypes: POSTSPAWN_LAKE_FLIES,
});
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_lake_pond", [7, 8, 9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: SUMMER_LAKE_LURES,
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});
addMonths(["south_central"], "freshwater_lake_pond", [9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: SOUTH_CENTRAL_EARLYFALL_LAKE_LURES,
  viable_fly_archetypes: SOUTH_CENTRAL_EARLYFALL_LAKE_FLIES,
});
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_lake_pond", [10], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: FALL_LAKE_LURES,
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_lake_pond", [11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: FALL_LAKE_LURES,
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_lake_pond", [12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});

// Northern cold lake / pond
addMonths(NORTHERN_COLD_REGIONS, "freshwater_lake_pond", [1, 2, 3], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(NORTHERN_COLD_REGIONS, "freshwater_lake_pond", [4, 5], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: PRESPAWN_LAKE_LURES,
  viable_fly_archetypes: PRESPAWN_LAKE_FLIES,
});
addMonths(["midwest_interior"], "freshwater_lake_pond", [4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: MIDWEST_DIRTY_PRESPAWN_LAKE_LURES,
  viable_fly_archetypes: MIDWEST_DIRTY_PRESPAWN_LAKE_FLIES,
});
addMonths(NORTHERN_COLD_REGIONS, "freshwater_lake_pond", [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: SPAWN_LAKE_LURES,
  viable_fly_archetypes: SPAWN_LAKE_FLIES,
});
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: GREAT_LAKES_POSTSPAWN_LAKE_LURES,
  viable_fly_archetypes: GREAT_LAKES_POSTSPAWN_LAKE_FLIES,
});
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "subtle",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: GREAT_LAKES_CLEAR_SUMMER_LAKE_LURES,
  viable_fly_archetypes: GREAT_LAKES_CLEAR_SUMMER_LAKE_FLIES,
});
addMonths(NORTHERN_COLD_REGIONS, "freshwater_lake_pond", [7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: POSTSPAWN_LAKE_LURES,
  viable_fly_archetypes: POSTSPAWN_LAKE_FLIES,
});
addMonths(NORTHERN_COLD_REGIONS, "freshwater_lake_pond", [8], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: SUMMER_LAKE_LURES,
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});
addMonths(["midwest_interior"], "freshwater_lake_pond", [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: MIDWEST_DIRTY_SUMMER_LAKE_LURES,
  viable_fly_archetypes: MIDWEST_DIRTY_SUMMER_LAKE_FLIES,
});
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [8], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "subtle",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: GREAT_LAKES_CLEAR_SUMMER_LAKE_LURES,
  viable_fly_archetypes: GREAT_LAKES_CLEAR_SUMMER_LAKE_FLIES,
});
addMonths(NORTHERN_COLD_REGIONS, "freshwater_lake_pond", [9, 10], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: FALL_LAKE_LURES,
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(NORTHERN_COLD_REGIONS, "freshwater_lake_pond", [11, 12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: GREAT_LAKES_LATEFALL_LAKE_LURES,
  viable_fly_archetypes: GREAT_LAKES_LATEFALL_LAKE_FLIES,
});

// Western mixed lake / pond
addMonths(WESTERN_MIXED_REGIONS, "freshwater_lake_pond", [1, 2], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(WESTERN_MIXED_REGIONS, "freshwater_lake_pond", [3, 4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: PRESPAWN_LAKE_LURES,
  viable_fly_archetypes: PRESPAWN_LAKE_FLIES,
});
addMonths(WESTERN_MIXED_REGIONS, "freshwater_lake_pond", [5], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: SPAWN_LAKE_LURES,
  viable_fly_archetypes: SPAWN_LAKE_FLIES,
});
addMonths(WESTERN_MIXED_REGIONS, "freshwater_lake_pond", [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: POSTSPAWN_LAKE_LURES,
  viable_fly_archetypes: POSTSPAWN_LAKE_FLIES,
});
addMonths(WESTERN_MIXED_REGIONS, "freshwater_lake_pond", [7, 8, 9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: SUMMER_LAKE_LURES,
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});
addMonths(WESTERN_MIXED_REGIONS, "freshwater_lake_pond", [10, 11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: FALL_LAKE_LURES,
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(WESTERN_MIXED_REGIONS, "freshwater_lake_pond", [12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});

// Warm western lake / pond
addMonths(WARM_WESTERN_REGIONS, "freshwater_lake_pond", [1, 2], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(WARM_WESTERN_REGIONS, "freshwater_lake_pond", [3, 4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: PRESPAWN_LAKE_LURES,
  viable_fly_archetypes: PRESPAWN_LAKE_FLIES,
});
addMonths(WARM_WESTERN_REGIONS, "freshwater_lake_pond", [5], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: SPAWN_LAKE_LURES,
  viable_fly_archetypes: SPAWN_LAKE_FLIES,
});
addMonths(WARM_WESTERN_REGIONS, "freshwater_lake_pond", [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: POSTSPAWN_LAKE_LURES,
  viable_fly_archetypes: POSTSPAWN_LAKE_FLIES,
});
addMonths(WARM_WESTERN_REGIONS, "freshwater_lake_pond", [7, 8, 9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: SUMMER_LAKE_LURES,
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});
addMonths(WARM_WESTERN_REGIONS, "freshwater_lake_pond", [10, 11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: FALL_LAKE_LURES,
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(WARM_WESTERN_REGIONS, "freshwater_lake_pond", [12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});

// Warm highland river
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_river", [1, 2], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_river", [3, 4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_river", [5], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_river", [6, 7, 8, 9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: SUMMER_RIVER_LURES,
  viable_fly_archetypes: SUMMER_RIVER_FLIES,
});
addMonths(["south_central"], "freshwater_river", [9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: SOUTH_CENTRAL_EARLYFALL_RIVER_LURES,
  viable_fly_archetypes: SOUTH_CENTRAL_EARLYFALL_RIVER_FLIES,
});
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_river", [10, 11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(["south_central"], "freshwater_river", [11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: SOUTH_CENTRAL_LATEFALL_RIVER_LURES,
  viable_fly_archetypes: SOUTH_CENTRAL_LATEFALL_RIVER_FLIES,
});
addMonths(WARM_HIGHLAND_REGIONS, "freshwater_river", [12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Northern cold river
addMonths(NORTHERN_COLD_REGIONS, "freshwater_river", [1, 2, 3], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(NORTHERN_COLD_REGIONS, "freshwater_river", [4, 5], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(NORTHERN_COLD_REGIONS, "freshwater_river", [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(NORTHERN_COLD_REGIONS, "freshwater_river", [7, 8], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: SUMMER_RIVER_LURES,
  viable_fly_archetypes: SUMMER_RIVER_FLIES,
});
addMonths(["great_lakes_upper_midwest"], "freshwater_river", [7, 8], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: GREAT_LAKES_CLEAR_SUMMER_RIVER_LURES,
  viable_fly_archetypes: GREAT_LAKES_CLEAR_SUMMER_RIVER_FLIES,
});
addMonths(["northeast"], "freshwater_river", [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: NORTHEAST_SUMMER_RIVER_LURES,
  viable_fly_archetypes: NORTHEAST_SUMMER_RIVER_FLIES,
});
addMonths(NORTHERN_COLD_REGIONS, "freshwater_river", [9, 10], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(NORTHERN_COLD_REGIONS, "freshwater_river", [11, 12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(["northeast"], "freshwater_river", [11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: NORTHEAST_LATEFALL_RIVER_LURES,
  viable_fly_archetypes: NORTHEAST_LATEFALL_RIVER_FLIES,
});
addMonths(["midwest_interior"], "freshwater_river", [11], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: MIDWEST_LATEFALL_RIVER_LURES,
  viable_fly_archetypes: MIDWEST_LATEFALL_RIVER_FLIES,
});

// Western mixed river
addMonths(WESTERN_MIXED_REGIONS, "freshwater_river", [1, 2], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(WESTERN_MIXED_REGIONS, "freshwater_river", [3, 4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(WESTERN_MIXED_REGIONS, "freshwater_river", [5], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(WESTERN_MIXED_REGIONS, "freshwater_river", [6, 7, 8, 9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: SUMMER_RIVER_LURES,
  viable_fly_archetypes: SUMMER_RIVER_FLIES,
});
addMonths(["mountain_west"], "freshwater_river", [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WESTERN_POSTSPAWN_RIVER_LURES,
  viable_fly_archetypes: WESTERN_POSTSPAWN_RIVER_FLIES,
});
addMonths(["mountain_west"], "freshwater_river", [9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: MOUNTAIN_WEST_EARLYFALL_RIVER_LURES,
  viable_fly_archetypes: MOUNTAIN_WEST_EARLYFALL_RIVER_FLIES,
});
addMonths(["inland_northwest", "pacific_northwest"], "freshwater_river", [7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: NORTHWEST_SUMMER_RIVER_LURES,
  viable_fly_archetypes: NORTHWEST_SUMMER_RIVER_FLIES,
});
addMonths(["inland_northwest", "pacific_northwest"], "freshwater_river", [9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: NORTHWEST_EARLY_FALL_RIVER_LURES,
  viable_fly_archetypes: NORTHWEST_EARLY_FALL_RIVER_FLIES,
});
addMonths(WESTERN_MIXED_REGIONS, "freshwater_river", [10, 11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(WESTERN_MIXED_REGIONS, "freshwater_river", [12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Warm western river
addMonths(WARM_WESTERN_REGIONS, "freshwater_river", [1, 2], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(WARM_WESTERN_REGIONS, "freshwater_river", [3, 4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(WARM_WESTERN_REGIONS, "freshwater_river", [5], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(WARM_WESTERN_REGIONS, "freshwater_river", [6, 7, 8, 9], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: SUMMER_RIVER_LURES,
  viable_fly_archetypes: SUMMER_RIVER_FLIES,
});
addMonths(WARM_WESTERN_REGIONS, "freshwater_river", [10, 11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(WARM_WESTERN_REGIONS, "freshwater_river", [12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Great Lakes midsummer clear-lake smallmouth get a more explicit topwater and
// baitfish-forward override than the broader northern lake rows.
addMonths(["great_lakes_upper_midwest"], "freshwater_lake_pond", [7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  viable_lure_archetypes: GREAT_LAKES_MIDSUMMER_LAKE_LURES,
  viable_fly_archetypes: GREAT_LAKES_MIDSUMMER_LAKE_FLIES,
});

export const SMALLMOUTH_V3_SEASONAL_ROWS = SMB_ROWS;
