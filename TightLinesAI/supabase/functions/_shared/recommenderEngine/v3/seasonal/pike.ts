/**
 * Northern pike seasonal authoring. Biology and pool intent:
 * `assets/biology_briefs/pike.md`. Seven-biome labels in comments are authoring
 * only; runtime `RegionKey` is unchanged.
 */
import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  RecommenderV3Context,
  RecommenderV3SeasonalRow,
  SeasonalLocationV3,
  SeasonalWaterColumnV3,
} from "../contracts.ts";
import type { RegionKey } from "../../../howFishingEngine/contracts/region.ts";
import {
  type AuthoredSeasonalCore,
  baseSeasonalWaterColumn,
  buildMonthlyBaselineProfile,
  finalizeSeasonalRows,
  shiftSeasonalWaterColumn,
  sortEligibleArchetypeIds,
  upsertSeasonalRow,
} from "./tuning.ts";
import { validateSeasonalRows } from "./validateSeasonalRow.ts";

const PIKE_ROWS = new Map<string, RecommenderV3SeasonalRow>();

function inRegions(region_key: RegionKey, regions: readonly RegionKey[]): boolean {
  return regions.includes(region_key);
}

function isPikeShallowSeason(region_key: RegionKey, month: number): boolean {
  if (region_key === "alaska") return [5, 6, 7].includes(month);
  if (inRegions(region_key, NORTHERN_CORE_REGIONS)) return [4, 5, 6, 7].includes(month);
  if (inRegions(region_key, INTERIOR_EDGE_REGIONS)) return [4, 5].includes(month);
  if (inRegions(region_key, MOUNTAIN_REGIONS)) return [4, 5, 6, 7].includes(month);
  return [4, 5, 6].includes(month);
}

function resolvePikeSeasonalWaterColumn(
  region_key: RegionKey,
  context: RecommenderV3Context,
  month: number,
  core: AuthoredSeasonalCore,
): SeasonalWaterColumnV3 {
  let column = baseSeasonalWaterColumn(core.base_water_column);

  if (context === "freshwater_lake_pond") {
    if ([1, 2].includes(month) && column === "mid") return "mid_low";
    if (isPikeShallowSeason(region_key, month)) return shiftSeasonalWaterColumn(column, 1);
    if ([7, 8].includes(month) && column === "top") return "high";
    if ([11, 12].includes(month) && column === "mid") return "mid_low";
    return column;
  }

  if ([1, 2, 3, 12].includes(month) && column === "mid") return "mid_low";
  if (isPikeShallowSeason(region_key, month)) return shiftSeasonalWaterColumn(column, 1);
  if ([7, 8].includes(month) && column === "top") return "high";
  return column;
}

function resolvePikeSeasonalLocation(
  context: RecommenderV3Context,
  month: number,
  column: SeasonalWaterColumnV3,
): SeasonalLocationV3 {
  if (context === "freshwater_river") {
    switch (column) {
      case "top":
      case "high":
        return "shallow";
      case "mid":
        return [4, 5, 6, 7, 8, 9, 10].includes(month) ? "shallow_mid" : "mid";
      case "mid_low":
        return "mid";
      case "low":
      default:
        return "mid_deep";
    }
  }

  switch (column) {
    case "top":
      return "shallow";
    case "high":
      return [4, 5, 6].includes(month) ? "shallow" : "shallow_mid";
    case "mid":
      return [4, 5, 6, 9, 10].includes(month) ? "shallow_mid" : "mid";
    case "mid_low":
      return "mid_deep";
    case "low":
    default:
      return [11, 12, 1, 2].includes(month) ? "deep" : "mid_deep";
  }
}

function toSeasonalRow(
  species: RecommenderV3SeasonalRow["species"],
  region_key: RegionKey,
  context: RecommenderV3Context,
  month: number,
  core: AuthoredSeasonalCore,
): RecommenderV3SeasonalRow {
  const typicalColumn = resolvePikeSeasonalWaterColumn(
    region_key,
    context,
    month,
    core,
  );
  const typicalLocation = resolvePikeSeasonalLocation(
    context,
    month,
    typicalColumn,
  );
  return {
    species,
    region_key,
    context,
    month,
    monthly_baseline: buildMonthlyBaselineProfile({
      typical_seasonal_water_column: typicalColumn,
      typical_seasonal_location: typicalLocation,
      base_mood: core.base_mood,
      base_presentation_style: core.base_presentation_style,
      primary_forage: core.primary_forage,
      secondary_forage: core.secondary_forage,
      surface_seasonally_possible: core.surface_seasonally_possible,
    }),
    primary_lure_ids: core.primary_lure_archetypes,
    primary_fly_ids: core.primary_fly_archetypes,
    eligible_lure_ids: sortEligibleArchetypeIds(core.viable_lure_archetypes),
    eligible_fly_ids: sortEligibleArchetypeIds(core.viable_fly_archetypes),
  };
}

function addMonths(
  regions: readonly RegionKey[],
  context: RecommenderV3Context,
  months: readonly number[],
  core: AuthoredSeasonalCore,
) {
  for (const region_key of regions) {
    for (const month of months) {
      upsertSeasonalRow(
        PIKE_ROWS,
        toSeasonalRow("northern_pike", region_key, context, month, core),
      );
    }
  }
}

// --- Lure pools ---
const WINTER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "pike_jerkbait",
  "large_profile_pike_swimbait",
  "suspending_jerkbait",
  "casting_spoon",
  "blade_bait",
  "paddle_tail_swimbait",
];
const SPRING_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "pike_jerkbait",
  "large_profile_pike_swimbait",
  "spinnerbait",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "suspending_jerkbait",
];
/** Jun–Jul northern / mountain: stratified water; no hollow-body / walker hedge. */
const SUMMER_PEAK_STRATIFIED_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "large_profile_pike_swimbait",
  "pike_jerkbait",
  "suspending_jerkbait",
  "spinnerbait",
  "paddle_tail_swimbait",
  "blade_bait",
  "casting_spoon",
];
/** Interior Jul–Aug: thermocline / heat; subsurface-only lures. */
const SUMMER_HOT_INTERIOR_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "large_profile_pike_swimbait",
  "pike_jerkbait",
  "suspending_jerkbait",
  "blade_bait",
  "casting_spoon",
  "paddle_tail_swimbait",
  "spinnerbait",
];
const SUMMER_SHALLOW_NORTH_MAY_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "large_profile_pike_swimbait",
  "pike_jerkbait",
  "spinnerbait",
  "paddle_tail_swimbait",
  "walking_topwater",
  "hollow_body_frog",
  "suspending_jerkbait",
];
const FALL_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "large_profile_pike_swimbait",
  "pike_jerkbait",
  "paddle_tail_swimbait",
  "spinnerbait",
  "casting_spoon",
  "suspending_jerkbait",
];

const WINTER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "pike_jerkbait",
  "large_profile_pike_swimbait",
  "suspending_jerkbait",
  "casting_spoon",
  "blade_bait",
];
const SPRING_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "pike_jerkbait",
  "spinnerbait",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "inline_spinner",
  "large_profile_pike_swimbait",
];
const SUMMER_PEAK_STRATIFIED_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "pike_jerkbait",
  "large_profile_pike_swimbait",
  "suspending_jerkbait",
  "spinnerbait",
  "paddle_tail_swimbait",
  "inline_spinner",
  "blade_bait",
];
const SUMMER_HOT_INTERIOR_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "pike_jerkbait",
  "large_profile_pike_swimbait",
  "suspending_jerkbait",
  "spinnerbait",
  "paddle_tail_swimbait",
  "inline_spinner",
  "blade_bait",
];
const SUMMER_SHALLOW_NORTH_MAY_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "pike_jerkbait",
  "spinnerbait",
  "paddle_tail_swimbait",
  "walking_topwater",
  "inline_spinner",
  "large_profile_pike_swimbait",
];
const FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "large_profile_pike_swimbait",
  "pike_jerkbait",
  "paddle_tail_swimbait",
  "spinnerbait",
  "casting_spoon",
  "inline_spinner",
];

// --- Fly pools (surface IDs only when monthly surface flag is true) ---
const WINTER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "large_articulated_pike_streamer",
  "balanced_leech",
  "rabbit_strip_leech",
  "zonker_streamer",
  "clouser_minnow",
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
const SUMMER_PEAK_STRATIFIED_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "large_articulated_pike_streamer",
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "articulated_baitfish_streamer",
  "popper_fly",
  "deceiver",
];
const SUMMER_HOT_INTERIOR_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "large_articulated_pike_streamer",
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "articulated_baitfish_streamer",
  "zonker_streamer",
  "clouser_minnow",
];
const SUMMER_SHALLOW_NORTH_MAY_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "large_articulated_pike_streamer",
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "popper_fly",
  "frog_fly",
  "mouse_fly",
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

const WINTER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "large_articulated_pike_streamer",
  "balanced_leech",
  "rabbit_strip_leech",
  "clouser_minnow",
  "zonker_streamer",
];
const SPRING_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "large_articulated_pike_streamer",
  "clouser_minnow",
  "game_changer",
  "articulated_baitfish_streamer",
  "zonker_streamer",
];
const SUMMER_PEAK_STRATIFIED_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "large_articulated_pike_streamer",
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "articulated_baitfish_streamer",
  "popper_fly",
  "clouser_minnow",
];
const SUMMER_HOT_INTERIOR_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "large_articulated_pike_streamer",
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "articulated_baitfish_streamer",
  "zonker_streamer",
  "clouser_minnow",
];
const SUMMER_SHALLOW_NORTH_MAY_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "large_articulated_pike_streamer",
  "pike_bunny_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "popper_fly",
  "frog_fly",
  "clouser_minnow",
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

// --- Biome → regions (authoring map) ---
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

// --- Northern core — lake / pond ---
addMonths(NORTHERN_CORE_REGIONS, "freshwater_lake_pond", [1, 2], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_lake_pond", [3, 4], {
  surface_seasonally_possible: false,
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "large_articulated_pike_streamer"],
  viable_lure_archetypes: SPRING_LAKE_LURES,
  viable_fly_archetypes: SPRING_LAKE_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_lake_pond", [5], {
  surface_seasonally_possible: true,
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: SUMMER_SHALLOW_NORTH_MAY_LAKE_LURES,
  viable_fly_archetypes: SUMMER_SHALLOW_NORTH_MAY_LAKE_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_lake_pond", [6, 7], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral_subtle",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["suspending_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: SUMMER_PEAK_STRATIFIED_LAKE_LURES,
  viable_fly_archetypes: SUMMER_PEAK_STRATIFIED_LAKE_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_lake_pond", [8, 9, 10], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "leaning_bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: FALL_LAKE_LURES,
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_lake_pond", [11, 12], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});

// --- Northern core — river ---
addMonths(NORTHERN_CORE_REGIONS, "freshwater_river", [1, 2], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_river", [3, 4], {
  surface_seasonally_possible: false,
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "spinnerbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "large_articulated_pike_streamer"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_river", [5], {
  surface_seasonally_possible: true,
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "spinnerbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: SUMMER_SHALLOW_NORTH_MAY_RIVER_LURES,
  viable_fly_archetypes: SUMMER_SHALLOW_NORTH_MAY_RIVER_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_river", [6, 7], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral_subtle",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["suspending_jerkbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: SUMMER_PEAK_STRATIFIED_RIVER_LURES,
  viable_fly_archetypes: SUMMER_PEAK_STRATIFIED_RIVER_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_river", [8, 9, 10], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "leaning_bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(NORTHERN_CORE_REGIONS, "freshwater_river", [11, 12], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// --- Interior edge — lake / pond (warm-side summer discipline) ---
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_lake_pond", [1, 2, 3], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_lake_pond", [4, 5, 6], {
  surface_seasonally_possible: false,
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "large_articulated_pike_streamer"],
  viable_lure_archetypes: SPRING_LAKE_LURES,
  viable_fly_archetypes: SPRING_LAKE_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_lake_pond", [7, 8], {
  surface_seasonally_possible: false,
  base_water_column: "bottom",
  base_mood: "neutral_subtle",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["suspending_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: SUMMER_HOT_INTERIOR_LAKE_LURES,
  viable_fly_archetypes: SUMMER_HOT_INTERIOR_LAKE_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_lake_pond", [9, 10, 11], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "leaning_bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: FALL_LAKE_LURES,
  viable_fly_archetypes: FALL_LAKE_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_lake_pond", [12], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});

// --- Interior edge — river ---
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_river", [1, 2, 3], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_river", [4, 5, 6], {
  surface_seasonally_possible: false,
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "spinnerbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "large_articulated_pike_streamer"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_river", [7, 8], {
  surface_seasonally_possible: false,
  base_water_column: "bottom",
  base_mood: "neutral_subtle",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["suspending_jerkbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: SUMMER_HOT_INTERIOR_RIVER_LURES,
  viable_fly_archetypes: SUMMER_HOT_INTERIOR_RIVER_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_river", [9, 10, 11], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "leaning_bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(INTERIOR_EDGE_REGIONS, "freshwater_river", [12], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// --- Mountain / inland-west — lake / pond ---
addMonths(MOUNTAIN_REGIONS, "freshwater_lake_pond", [1, 2, 3, 12], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_LAKE_LURES,
  viable_fly_archetypes: WINTER_LAKE_FLIES,
});
addMonths(MOUNTAIN_REGIONS, "freshwater_lake_pond", [4, 5], {
  surface_seasonally_possible: false,
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "large_articulated_pike_streamer"],
  viable_lure_archetypes: SPRING_LAKE_LURES,
  viable_fly_archetypes: SPRING_LAKE_FLIES,
});
addMonths(MOUNTAIN_REGIONS, "freshwater_lake_pond", [6, 7, 8], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["suspending_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: SUMMER_PEAK_STRATIFIED_LAKE_LURES,
  viable_fly_archetypes: SUMMER_PEAK_STRATIFIED_LAKE_FLIES,
});
addMonths(MOUNTAIN_REGIONS, "freshwater_lake_pond", [9, 10, 11], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "leaning_bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: FALL_LAKE_LURES,
  viable_fly_archetypes: FALL_LAKE_FLIES,
});

// --- Mountain / inland-west — river ---
addMonths(MOUNTAIN_REGIONS, "freshwater_river", [1, 2, 3, 12], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "large_profile_pike_swimbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "articulated_dungeon_streamer"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(MOUNTAIN_REGIONS, "freshwater_river", [4, 5], {
  surface_seasonally_possible: false,
  base_water_column: "shallow",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "spinnerbait"],
  primary_fly_archetypes: ["pike_bunny_streamer", "large_articulated_pike_streamer"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(MOUNTAIN_REGIONS, "freshwater_river", [6, 7, 8], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["suspending_jerkbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: SUMMER_PEAK_STRATIFIED_RIVER_LURES,
  viable_fly_archetypes: SUMMER_PEAK_STRATIFIED_RIVER_FLIES,
});
addMonths(MOUNTAIN_REGIONS, "freshwater_river", [9, 10, 11], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "leaning_bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["large_profile_pike_swimbait", "pike_jerkbait"],
  primary_fly_archetypes: ["large_articulated_pike_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: FALL_RIVER_FLIES,
});

// Narrow override: southern-interior spring river — heavy dungeon lead in colored water.
addMonths(["south_central"], "freshwater_river", [4], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "leaning_bold",
  primary_forage: "baitfish",
  secondary_forage: "bluegill_perch",
  primary_lure_archetypes: ["pike_jerkbait", "spinnerbait"],
  primary_fly_archetypes: ["articulated_dungeon_streamer", "pike_bunny_streamer"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});

export const NORTHERN_PIKE_V3_SEASONAL_ROWS = (() => {
  const rows = finalizeSeasonalRows(PIKE_ROWS);
  validateSeasonalRows(rows, "northern pike");
  return rows;
})();
