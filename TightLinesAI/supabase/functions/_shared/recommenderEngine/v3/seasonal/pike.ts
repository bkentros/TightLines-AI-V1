/** See largemouth.ts — primary_*_archetypes order drives seasonal priority bonuses. */
import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  RecommenderV3Context,
  RecommenderV3SeasonalRow,
} from "../contracts.ts";
import type { RegionKey } from "../../../howFishingEngine/contracts/region.ts";

type SeasonalCore = Omit<RecommenderV3SeasonalRow, "species" | "region_key" | "month" | "context">;

const PIKE_ROWS: RecommenderV3SeasonalRow[] = [];

function addMonths(
  regions: readonly RegionKey[],
  context: RecommenderV3Context,
  months: readonly number[],
  core: SeasonalCore,
) {
  for (const region_key of regions) {
    for (const month of months) {
      PIKE_ROWS.push({
        species: "northern_pike",
        region_key,
        context,
        month,
        ...core,
      });
    }
  }
}

const WINTER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "pike_jerkbait",
  "large_profile_pike_swimbait",
  "suspending_jerkbait",
  "casting_spoon",
  "blade_bait",
  "paddle_tail_swimbait",
];
const WINTER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "large_articulated_pike_streamer",
  "balanced_leech",
  "rabbit_strip_leech",
  "zonker_streamer",
  "clouser_minnow",
];

const SPRING_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "pike_jerkbait",
  "large_profile_pike_swimbait",
  "spinnerbait",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "suspending_jerkbait",
];
const SPRING_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "pike_bunny_streamer",
  "large_articulated_pike_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "clouser_minnow",
  "zonker_streamer",
  "articulated_baitfish_streamer",
];

const SUMMER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "large_profile_pike_swimbait",
  "pike_jerkbait",
  "spinnerbait",
  "paddle_tail_swimbait",
  "walking_topwater",
  "hollow_body_frog",
];
const SUMMER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "large_articulated_pike_streamer",
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "popper_fly",
  "frog_fly",
  "mouse_fly",
];

const FALL_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "large_profile_pike_swimbait",
  "pike_jerkbait",
  "paddle_tail_swimbait",
  "spinnerbait",
  "casting_spoon",
  "suspending_jerkbait",
];
const FALL_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "large_articulated_pike_streamer",
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "articulated_baitfish_streamer",
  "deceiver",
  "zonker_streamer",
];

const WINTER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "pike_jerkbait",
  "large_profile_pike_swimbait",
  "suspending_jerkbait",
  "casting_spoon",
  "blade_bait",
];
const WINTER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "large_articulated_pike_streamer",
  "balanced_leech",
  "rabbit_strip_leech",
  "clouser_minnow",
  "zonker_streamer",
];

const SPRING_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "pike_jerkbait",
  "spinnerbait",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "inline_spinner",
  "large_profile_pike_swimbait",
];
const SPRING_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "large_articulated_pike_streamer",
  "clouser_minnow",
  "game_changer",
  "articulated_baitfish_streamer",
];

const SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "pike_jerkbait",
  "spinnerbait",
  "paddle_tail_swimbait",
  "walking_topwater",
  "inline_spinner",
  "large_profile_pike_swimbait",
];
const SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "large_articulated_pike_streamer",
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "popper_fly",
  "frog_fly",
  "clouser_minnow",
];

const FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "large_profile_pike_swimbait",
  "pike_jerkbait",
  "paddle_tail_swimbait",
  "spinnerbait",
  "casting_spoon",
  "inline_spinner",
];
const FALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "large_articulated_pike_streamer",
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "articulated_baitfish_streamer",
  "deceiver",
  "clouser_minnow",
];

const NORTHERN_CORE_REGIONS: readonly RegionKey[] = [
  "northeast",
  "great_lakes_upper_midwest",
  "alaska",
];
const INTERIOR_EDGE_REGIONS: readonly RegionKey[] = [
  "midwest_interior",
  "south_central",
  "appalachian",
];
const MOUNTAIN_REGIONS: readonly RegionKey[] = [
  "mountain_west",
  "mountain_alpine",
  "inland_northwest",
];

export const NORTHERN_PIKE_V3_SUPPORTED_REGIONS: readonly RegionKey[] = [
  ...NORTHERN_CORE_REGIONS,
  ...INTERIOR_EDGE_REGIONS,
  ...MOUNTAIN_REGIONS,
];

// Northern core lake / pond
addMonths(NORTHERN_CORE_REGIONS, "freshwater_lake_pond", [1, 2], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_lake_pond", [3, 4], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: SPRING_LAKE_LURES,
  viable_fly_archetypes: SPRING_LAKE_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_lake_pond", [5, 6, 7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: SUMMER_LAKE_LURES,
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_lake_pond", [8, 9, 10], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: FALL_LAKE_LURES,
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_lake_pond", [11, 12], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});

// Northern core river
addMonths(NORTHERN_CORE_REGIONS, "freshwater_river", [1, 2], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_river", [3, 4], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "spinnerbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_river", [5, 6, 7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "spinnerbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: SUMMER_RIVER_LURES,
  viable_fly_archetypes: SUMMER_RIVER_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_river", [8, 9, 10], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_river", [11, 12], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Interior edge lake / pond
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_lake_pond", [1, 2, 3], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_lake_pond", [4, 5, 6], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: SPRING_LAKE_LURES,
  viable_fly_archetypes: SPRING_LAKE_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_lake_pond", [7, 8], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: SUMMER_LAKE_LURES,
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_lake_pond", [9, 10, 11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: FALL_LAKE_LURES,
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_lake_pond", [12], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});

// Interior edge river
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_river", [1, 2, 3], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_river", [4, 5, 6], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "spinnerbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_river", [7, 8], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: SUMMER_RIVER_LURES,
  viable_fly_archetypes: SUMMER_RIVER_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_river", [9, 10, 11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_river", [12], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Mountain and inland-west pike water
addMonths(MOUNTAIN_REGIONS, "freshwater_lake_pond", [1, 2, 3, 12], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(MOUNTAIN_REGIONS, "freshwater_lake_pond", [4, 5], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: SPRING_LAKE_LURES,
  viable_fly_archetypes: SPRING_LAKE_FLIES,
});
addMonths(MOUNTAIN_REGIONS, "freshwater_lake_pond", [6, 7, 8], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: SUMMER_LAKE_LURES,
  viable_fly_archetypes: SUMMER_LAKE_FLIES,
});
addMonths(MOUNTAIN_REGIONS, "freshwater_lake_pond", [9, 10, 11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: FALL_LAKE_LURES,
  viable_fly_archetypes: FALL_LAKE_FLIES,
});

addMonths(MOUNTAIN_REGIONS, "freshwater_river", [1, 2, 3, 12], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(MOUNTAIN_REGIONS, "freshwater_river", [4, 5], {
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "spinnerbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(MOUNTAIN_REGIONS, "freshwater_river", [6, 7, 8], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "spinnerbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: SUMMER_RIVER_LURES,
  viable_fly_archetypes: SUMMER_RIVER_FLIES,
});
addMonths(MOUNTAIN_REGIONS, "freshwater_river", [9, 10, 11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: FALL_RIVER_FLIES,
});

export const NORTHERN_PIKE_V3_SEASONAL_ROWS = PIKE_ROWS;
