/**
 * Trout seasonal authoring (river-only). Source of truth for biology and pool
 * choices: `assets/biology_briefs/trout.md`. Biome labels in comments map to the
 * Phase 4 seven-biome authoring model; runtime `RegionKey` is unchanged.
 */
import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
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

const TROUT_ROWS = new Map<string, RecommenderV3SeasonalRow>();

function inRegions(region_key: RegionKey, regions: readonly RegionKey[]): boolean {
  return regions.includes(region_key);
}

function resolveTroutSeasonalWaterColumn(
  region_key: RegionKey,
  month: number,
  core: AuthoredSeasonalCore,
): SeasonalWaterColumnV3 {
  let column = baseSeasonalWaterColumn(core.base_water_column);

  if ([12, 1, 2].includes(month) && column === "mid") {
    column = "mid_low";
  }

  if (inRegions(region_key, WARM_TAILWATER_REGIONS)) {
    if ([3, 4, 10, 11].includes(month) && column === "low") {
      column = "mid_low";
    }
    if ([6, 7, 8].includes(month) && column === "top") {
      column = "high";
    }
  } else {
    if ([4, 5, 6].includes(month) && column === "low") {
      column = "mid_low";
    }
    if ([7, 8, 9].includes(month) && column === "top") {
      column = "high";
    }
  }

  if ([5, 6, 7].includes(month) && column === "mid") {
    column = shiftSeasonalWaterColumn(column, 1);
  }

  return column;
}

function resolveTroutSeasonalLocation(
  month: number,
  column: SeasonalWaterColumnV3,
): SeasonalLocationV3 {
  switch (column) {
    case "top":
    case "high":
      return "shallow";
    case "mid":
      return [4, 5, 6, 7, 8, 9, 10].includes(month) ? "shallow_mid" : "mid";
    case "mid_low":
      return [12, 1, 2].includes(month) ? "mid_deep" : "mid";
    case "low":
    default:
      return "mid_deep";
  }
}

function toSeasonalRow(
  region_key: RegionKey,
  month: number,
  core: AuthoredSeasonalCore,
): RecommenderV3SeasonalRow {
  const typicalColumn = resolveTroutSeasonalWaterColumn(region_key, month, core);
  const typicalLocation = resolveTroutSeasonalLocation(month, typicalColumn);
  return {
    species: "trout",
    region_key,
    context: "freshwater_river",
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
  months: readonly number[],
  core: AuthoredSeasonalCore,
) {
  for (const region_key of regions) {
    for (const month of months) {
      upsertSeasonalRow(TROUT_ROWS, toSeasonalRow(region_key, month, core));
    }
  }
}

// --- Lure pools (tight, river-realistic) ---
const WINTER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "blade_bait",
  "casting_spoon",
  "hair_jig",
  "paddle_tail_swimbait",
];
/** PNW December: current-aware winter without losing honest spinner support. */
const PNW_DEEP_WINTER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "blade_bait",
  "inline_spinner",
  "casting_spoon",
  "hair_jig",
];
const SPRING_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "suspending_jerkbait",
  "casting_spoon",
  "paddle_tail_swimbait",
  "soft_jerkbait",
];
const WESTERN_SPRING_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "suspending_jerkbait",
  "casting_spoon",
  "soft_jerkbait",
  "paddle_tail_swimbait",
];
const COOL_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "casting_spoon",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "hair_jig",
];
const WARM_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "hair_jig",
  "suspending_jerkbait",
  "casting_spoon",
  "paddle_tail_swimbait",
];
const FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "inline_spinner",
  "paddle_tail_swimbait",
  "casting_spoon",
  "soft_jerkbait",
  "hair_jig",
];
const WESTERN_FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "inline_spinner",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "casting_spoon",
  "hair_jig",
];
const NORTHEAST_LATEFALL_HIGHWATER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "inline_spinner",
  "casting_spoon",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "hair_jig",
];

// --- Fly pools (streamer-first; no surface IDs when surface flag is false) ---
const WINTER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "sculpin_streamer",
  "sculpzilla",
  "conehead_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
];
const PNW_WINTER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "sculpin_streamer",
  "conehead_streamer",
  "rabbit_strip_leech",
  "zonker_streamer",
];
const SPRING_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "slim_minnow_streamer",
  "clouser_minnow",
  "bucktail_baitfish_streamer",
  "balanced_leech",
  "sculpin_streamer",
];
const SLIM_MINNOW_SPRING_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "slim_minnow_streamer",
  "clouser_minnow",
  "woolly_bugger",
  "bucktail_baitfish_streamer",
  "balanced_leech",
  "sculpin_streamer",
];
const WESTERN_SPRING_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "slim_minnow_streamer",
  "bucktail_baitfish_streamer",
  "muddler_sculpin",
  "sculpzilla",
  "sculpin_streamer",
  "woolly_bugger",
];
const COOL_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "slim_minnow_streamer",
  "clouser_minnow",
  "bucktail_baitfish_streamer",
  "articulated_dungeon_streamer",
  "muddler_sculpin",
  "woolly_bugger",
];
const MOUSE_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "mouse_fly",
  "slim_minnow_streamer",
  "muddler_sculpin",
  "clouser_minnow",
  "woolly_bugger",
];
const ALASKA_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "sculpin_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "slim_minnow_streamer",
  "muddler_sculpin",
];
/** June big-river Alaska: keep the headline on sculpin / bugger / leech before slim hijacks. */
const ALASKA_JUNE_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "sculpin_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
];
const WARM_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "muddler_sculpin",
  "rabbit_strip_leech",
  "sculpzilla",
  "slim_minnow_streamer",
  "woolly_bugger",
  "sculpin_streamer",
];
/** Tailwater Apr–May: keep current and minnow lanes ahead of broad swimbaits. */
const TAILWATER_SPRING_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "suspending_jerkbait",
  "casting_spoon",
  "soft_jerkbait",
];
/** Tailwater Jul–Aug: disciplined summer without hair-jig hijack from the warm pool. */
const TAILWATER_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "suspending_jerkbait",
  "casting_spoon",
  "soft_jerkbait",
  "paddle_tail_swimbait",
];
/** Tailwater June: early summer without paddle-tail hijacking muddler-led fly rows. */
const TAILWATER_JUNE_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "suspending_jerkbait",
  "casting_spoon",
  "soft_jerkbait",
];
/** Big Alaskan June water: avoid warmwater swimbait default on the headline. */
const ALASKA_EARLY_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "casting_spoon",
  "suspending_jerkbait",
];
/** Warm tailwater Jul–Aug: keep the headline on sculpin / bugger / leech, not slim-minnow overlap. */
const TAILWATER_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "muddler_sculpin",
  "woolly_bugger",
  "rabbit_strip_leech",
  "sculpin_streamer",
  "sculpzilla",
];
/** Northeast May freestone: avoid clouser stealing the fly top slot from slim/sculpin/bugger. */
const NORTHEAST_MAY_FREESTONE_FLIES: readonly FlyArchetypeIdV3[] = [
  "slim_minnow_streamer",
  "sculpin_streamer",
  "woolly_bugger",
  "bucktail_baitfish_streamer",
  "balanced_leech",
];
const NORTHEAST_MAY_FREESTONE_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "casting_spoon",
  "paddle_tail_swimbait",
];
/** Mountain West late April: visible streamers without bucktail hijacking minnow primaries. */
const MOUNTAIN_WEST_APRIL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "slim_minnow_streamer",
  "muddler_sculpin",
  "sculpzilla",
  "sculpin_streamer",
  "woolly_bugger",
];
const MOUNTAIN_WEST_APRIL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "casting_spoon",
  "blade_bait",
];
/** Mountain West May: spinner/jerk before soft-plastic summer drift. */
const MOUNTAIN_WEST_MAY_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "suspending_jerkbait",
  "casting_spoon",
];
/** Great Lakes stained late fall: articulated + minnow + bugger without zonker headline competition. */
const GREAT_LAKES_STAINED_LATEFALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "articulated_baitfish_streamer",
  "articulated_dungeon_streamer",
  "slim_minnow_streamer",
  "sculpin_streamer",
  "woolly_bugger",
];
/** Northern / cold / warm autumn: subsurface streamer pulse (no mouse). */
const FALL_RIVER_FLIES_SUBSURFACE: readonly FlyArchetypeIdV3[] = [
  "articulated_baitfish_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "slim_minnow_streamer",
  "zonker_streamer",
  "sculpin_streamer",
  "woolly_bugger",
];
/** Western late season: adds mouse for credible low-light bank windows. */
const WESTERN_AUTUMN_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  ...FALL_RIVER_FLIES_SUBSURFACE,
  "mouse_fly",
];
const NORTHEAST_LATEFALL_HIGHWATER_FLIES: readonly FlyArchetypeIdV3[] = [
  "articulated_baitfish_streamer",
  "articulated_dungeon_streamer",
  "slim_minnow_streamer",
  "game_changer",
  "zonker_streamer",
  "sculpin_streamer",
  "woolly_bugger",
];
const GREAT_LAKES_LATEFALL_HIGHWATER_FLIES: readonly FlyArchetypeIdV3[] = [
  "articulated_baitfish_streamer",
  "articulated_dungeon_streamer",
  "slim_minnow_streamer",
  "game_changer",
  "sculpin_streamer",
  "zonker_streamer",
  "woolly_bugger",
];
const PACIFIC_NORTHWEST_LATEFALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "articulated_baitfish_streamer",
  "articulated_dungeon_streamer",
  "slim_minnow_streamer",
  "game_changer",
  "zonker_streamer",
  "sculpin_streamer",
  "woolly_bugger",
];

// --- Biome → regions (authoring only; matches biology brief §7-biome map) ---
// subarctic_alpine + northern core cold
const COLD_CLASSIC_REGIONS: readonly RegionKey[] = [
  "northeast",
  "great_lakes_upper_midwest",
  "midwest_interior",
  "alaska",
  "mountain_alpine",
];
// western_inland
const WESTERN_CLASSIC_REGIONS: readonly RegionKey[] = [
  "mountain_west",
  "pacific_northwest",
  "inland_northwest",
  "northern_california",
];
// appalachian_transition + southeast_warm + western_warm (tailwater / highland trout)
const WARM_TAILWATER_REGIONS: readonly RegionKey[] = [
  "appalachian",
  "south_central",
  "southwest_high_desert",
  "southern_california",
  "southeast_atlantic",
];

export const TROUT_V3_SUPPORTED_REGIONS: readonly RegionKey[] = [
  ...COLD_CLASSIC_REGIONS,
  ...WESTERN_CLASSIC_REGIONS,
  ...WARM_TAILWATER_REGIONS,
];

// --- subarctic_alpine + northern_temperate core (cold freestone & Great Lakes) ---
addMonths(COLD_CLASSIC_REGIONS, [1, 2], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [3], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "slim_minnow_streamer"],
  viable_fly_archetypes: SLIM_MINNOW_SPRING_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [4], {
  // April opens the in-season surface window for trout streamers (mouse_fly,
  // popper_fly). The daily `surface_window` gate still closes surface on
  // cold/stormy days, so this flag only removes the hard seasonal block.
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "slim_minnow_streamer"],
  viable_fly_archetypes: SLIM_MINNOW_SPRING_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [5], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "slim_minnow_streamer"],
  viable_fly_archetypes: SLIM_MINNOW_SPRING_RIVER_FLIES,
});
addMonths(["northeast"], [5], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "casting_spoon"],
  viable_lure_archetypes: NORTHEAST_MAY_FREESTONE_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: NORTHEAST_MAY_FREESTONE_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [6, 7], {
  surface_seasonally_possible: true,
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "clouser_minnow"],
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
addMonths(["alaska"], [6], {
  surface_seasonally_possible: true,
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: ALASKA_EARLY_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger", "rabbit_strip_leech"],
  viable_fly_archetypes: ALASKA_JUNE_RIVER_FLIES,
});
addMonths(["alaska"], [7], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["casting_spoon", "inline_spinner"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: ALASKA_SUMMER_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [8], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "clouser_minnow"],
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [9, 10], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES_SUBSURFACE,
});
addMonths(COLD_CLASSIC_REGIONS, [11], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES_SUBSURFACE,
});
addMonths(["alaska"], [11], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(["northeast"], [10], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES_SUBSURFACE,
});
addMonths(["great_lakes_upper_midwest"], [10], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "slim_minnow_streamer", "woolly_bugger"],
  viable_fly_archetypes: GREAT_LAKES_STAINED_LATEFALL_RIVER_FLIES,
});
addMonths(["northeast"], [11], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: NORTHEAST_LATEFALL_HIGHWATER_LURES,
  primary_fly_archetypes: ["zonker_streamer", "articulated_baitfish_streamer"],
  viable_fly_archetypes: NORTHEAST_LATEFALL_HIGHWATER_FLIES,
});
addMonths(["great_lakes_upper_midwest"], [11], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: NORTHEAST_LATEFALL_HIGHWATER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "slim_minnow_streamer", "woolly_bugger"],
  viable_fly_archetypes: GREAT_LAKES_STAINED_LATEFALL_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [12], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// --- western_inland ---
addMonths(WESTERN_CLASSIC_REGIONS, [1, 2], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(["mountain_west"], [2], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: WESTERN_SPRING_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "slim_minnow_streamer"],
  viable_fly_archetypes: WESTERN_SPRING_RIVER_FLIES,
});
addMonths(["pacific_northwest"], [1], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "sculpin_streamer"],
  viable_fly_archetypes: PNW_WINTER_RIVER_FLIES,
});
addMonths(["pacific_northwest"], [2], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: WESTERN_SPRING_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "woolly_bugger", "sculpin_streamer"],
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [3], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "slim_minnow_streamer"],
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [4, 5], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "slim_minnow_streamer"],
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(["mountain_west"], [5], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: MOUNTAIN_WEST_MAY_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "slim_minnow_streamer"],
  viable_fly_archetypes: WESTERN_SPRING_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [6], {
  surface_seasonally_possible: true,
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "clouser_minnow"],
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [7, 8], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "clouser_minnow"],
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
addMonths(["pacific_northwest"], [7, 8], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "muddler_sculpin", "clouser_minnow"],
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
addMonths(["mountain_west", "inland_northwest"], [7, 8], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "muddler_sculpin", "clouser_minnow"],
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
addMonths(["northern_california"], [7, 8], {
  surface_seasonally_possible: true,
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "soft_jerkbait"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["mouse_fly", "slim_minnow_streamer"],
  viable_fly_archetypes: MOUSE_SUMMER_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [9, 10], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES_SUBSURFACE,
});
addMonths(WESTERN_CLASSIC_REGIONS, [11], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES_SUBSURFACE,
});
addMonths(["pacific_northwest"], [11], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "articulated_dungeon_streamer"],
  viable_fly_archetypes: PACIFIC_NORTHWEST_LATEFALL_RIVER_FLIES,
});
addMonths(["northern_california"], [10], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: WESTERN_FALL_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "articulated_baitfish_streamer"],
  viable_fly_archetypes: WESTERN_AUTUMN_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [12], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// --- warm tailwaters & transition highlands ---
addMonths(WARM_TAILWATER_REGIONS, [1, 2], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "leech_worm",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [3], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "slim_minnow_streamer"],
  viable_fly_archetypes: SLIM_MINNOW_SPRING_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [4, 5], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: TAILWATER_SPRING_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "woolly_bugger", "sculpin_streamer"],
  viable_fly_archetypes: SLIM_MINNOW_SPRING_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [6], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: TAILWATER_JUNE_RIVER_LURES,
  primary_fly_archetypes: ["muddler_sculpin", "woolly_bugger", "rabbit_strip_leech"],
  viable_fly_archetypes: TAILWATER_SUMMER_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [7, 8], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral_subtle",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: TAILWATER_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["muddler_sculpin", "woolly_bugger", "rabbit_strip_leech"],
  viable_fly_archetypes: TAILWATER_SUMMER_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [9, 10], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES_SUBSURFACE,
});
addMonths(WARM_TAILWATER_REGIONS, [11], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES_SUBSURFACE,
});
addMonths(WARM_TAILWATER_REGIONS, [12], {
  surface_seasonally_possible: false,
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "leaning_subtle",
  primary_forage: "leech_worm",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// --- narrow regional overrides (brief § western_inland / northern_temperate nuance) ---
addMonths(["mountain_west"], [4], {
  surface_seasonally_possible: true,
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "leaning_subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: MOUNTAIN_WEST_APRIL_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger", "clouser_minnow"],
  viable_fly_archetypes: MOUNTAIN_WEST_APRIL_RIVER_FLIES,
});
addMonths(["southwest_high_desert"], [8], {
  surface_seasonally_possible: true,
  base_water_column: "bottom",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["hair_jig", "inline_spinner"],
  viable_lure_archetypes: WARM_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["sculpzilla", "sculpin_streamer"],
  viable_fly_archetypes: WARM_SUMMER_RIVER_FLIES,
});
addMonths(["pacific_northwest"], [12], {
  surface_seasonally_possible: false,
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: PNW_DEEP_WINTER_RIVER_LURES,
  primary_fly_archetypes: ["zonker_streamer", "sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: PNW_WINTER_RIVER_FLIES,
});

// Idaho April mountain-west river: clone regional row + stained-only state deltas (Section 4).
{
  const baseKey = ["trout", "mountain_west", 4, "freshwater_river", ""].join(
    "|",
  );
  const base = TROUT_ROWS.get(baseKey);
  if (!base) {
    throw new Error(
      "Expected trout mountain_west April river row for ID state override",
    );
  }
  upsertSeasonalRow(TROUT_ROWS, {
    ...base,
    state_code: "ID",
    state_scoring_adjustments: [
      { archetype_id: "inline_spinner", delta: -1.55, when: { clarity: "stained" } },
      { archetype_id: "sculpin_streamer", delta: 0.95, when: { clarity: "stained" } },
      { archetype_id: "woolly_bugger", delta: 0.95, when: { clarity: "stained" } },
      { archetype_id: "clouser_minnow", delta: 0.95, when: { clarity: "stained" } },
    ],
  });
}

export const TROUT_V3_SEASONAL_ROWS = (() => {
  const rows = finalizeSeasonalRows(TROUT_ROWS);
  validateSeasonalRows(rows, "trout");
  return rows;
})();
