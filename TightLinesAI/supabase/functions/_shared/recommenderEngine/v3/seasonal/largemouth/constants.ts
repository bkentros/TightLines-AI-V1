import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  RecommenderV3Context,
  RecommenderV3SeasonalRow,
  SeasonalLocationV3,
  SeasonalWaterColumnV3,
} from "../../contracts.ts";
import type { RegionKey } from "../../../../howFishingEngine/contracts/region.ts";
import type { AuthoredSeasonalCore } from "../tuning.ts";
import {
  baseSeasonalWaterColumn,
  buildMonthlyBaselineProfile,
  shiftSeasonalWaterColumn,
  sortEligibleArchetypeIds,
} from "../tuning.ts";

function inRegions(
  region_key: RegionKey,
  regions: readonly RegionKey[],
): boolean {
  return regions.includes(region_key);
}

function isSpawnWindow(region_key: RegionKey, month: number): boolean {
  if (inRegions(region_key, TROPICAL_WARM_REGIONS)) {
    return [2, 3, 4].includes(month);
  }
  if (
    inRegions(region_key, [...SOUTHEAST_WARM_REGIONS, ...SOUTH_CENTRAL_REGIONS])
  ) {
    return [3, 4, 5].includes(month);
  }
  if (inRegions(region_key, APPALACHIAN_REGIONS)) return [4, 5].includes(month);
  if (inRegions(region_key, WESTERN_WARM_REGIONS)) {
    return [3, 4].includes(month);
  }
  if (
    inRegions(region_key, [
      ...NORTHERN_REGIONS,
      ...MIDWEST_REGIONS,
      ...WESTERN_INLAND_REGIONS,
    ])
  ) {
    return [5, 6].includes(month);
  }
  return [4, 5].includes(month);
}

function resolveLargemouthSeasonalWaterColumn(
  region_key: RegionKey,
  context: RecommenderV3Context,
  month: number,
  core: AuthoredSeasonalCore,
): SeasonalWaterColumnV3 {
  let column = baseSeasonalWaterColumn(core.base_water_column);

  if (context === "freshwater_lake_pond") {
    if (
      month === 1 && inRegions(region_key, TROPICAL_WARM_REGIONS) &&
      column === "low"
    ) {
      return "mid_low";
    }
    if (
      [12, 1, 2].includes(month) &&
      inRegions(region_key, [
        ...NORTHERN_REGIONS,
        ...MIDWEST_REGIONS,
        ...WESTERN_INLAND_REGIONS,
      ]) &&
      column === "mid"
    ) {
      column = "mid_low";
    }
    if (isSpawnWindow(region_key, month)) {
      column = shiftSeasonalWaterColumn(column, column === "low" ? 1 : 1);
    } else if (
      [7, 8].includes(month) &&
      inRegions(region_key, [
        ...TROPICAL_WARM_REGIONS,
        ...SOUTHEAST_WARM_REGIONS,
        ...SOUTH_CENTRAL_REGIONS,
        ...WESTERN_WARM_REGIONS,
      ]) &&
      column === "top"
    ) {
      column = "high";
    } else if (
      [9, 10].includes(month) &&
      !inRegions(region_key, TROPICAL_WARM_REGIONS) &&
      column === "low"
    ) {
      column = "mid_low";
    }
    return column;
  }

  if ([12, 1, 2].includes(month)) {
    if (column === "low") return "mid_low";
    if (column === "mid") return "mid_low";
  }
  if (isSpawnWindow(region_key, month)) {
    return shiftSeasonalWaterColumn(column, 1);
  }
  if ([6, 7, 8].includes(month) && column === "top") {
    return "high";
  }
  return column;
}

function resolveLargemouthSeasonalLocation(
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
      return [2, 3, 4, 5, 6].includes(month) ? "shallow" : "shallow_mid";
    case "mid":
      return [3, 4, 5, 9, 10].includes(month) ? "shallow_mid" : "mid";
    case "mid_low":
      return "mid_deep";
    case "low":
    default:
      return [12, 1, 2].includes(month) ? "deep" : "mid_deep";
  }
}

export function toSeasonalRow(
  species: RecommenderV3SeasonalRow["species"],
  region_key: RegionKey,
  context: RecommenderV3Context,
  month: number,
  core: AuthoredSeasonalCore,
): RecommenderV3SeasonalRow {
  const typicalColumn = resolveLargemouthSeasonalWaterColumn(
    region_key,
    context,
    month,
    core,
  );
  const typicalLocation = resolveLargemouthSeasonalLocation(
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
export const WINTER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "football_jig",
  "finesse_jig",
  "texas_rigged_soft_plastic_craw",
  "shaky_head_worm",
  "suspending_jerkbait",
  "blade_bait",
  "drop_shot_worm",
  "flat_sided_crankbait",
];
export const WINTER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "crawfish_streamer",
  "balanced_leech",
  "rabbit_strip_leech",
  "woolly_bugger",
  "sculpin_streamer",
  "conehead_streamer",
  // Single baitfish streamer lane for rare winter windows; avoid a second
  // aggressive streamer in the sacred pool (see biology brief — northern winter).
  "clouser_minnow",
];

export const PRESPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "football_jig",
  "texas_rigged_soft_plastic_craw",
  "suspending_jerkbait",
  "spinnerbait",
  "bladed_jig",
  "lipless_crankbait",
  "squarebill_crankbait",
  "paddle_tail_swimbait",
];
export const PRESPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "crawfish_streamer",
  "rabbit_strip_leech",
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "sculpin_streamer",
];

/** South-central Feb–Mar clear reservoirs (incl. GA highland matrix): jerkbait/flat ahead of craw. */
export const SOUTH_CENTRAL_FEB_MAR_CLEAR_LAKE_LURES:
  readonly LureArchetypeIdV3[] = [
    "suspending_jerkbait",
    "flat_sided_crankbait",
    "football_jig",
    "paddle_tail_swimbait",
    "spinnerbait",
    "squarebill_crankbait",
    "bladed_jig",
    "texas_rigged_soft_plastic_craw",
    "shaky_head_worm",
    "lipless_crankbait",
  ];

export const PNW_MARCH_STAINED_BASS_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "football_jig",
  "spinnerbait",
  "suspending_jerkbait",
  "squarebill_crankbait",
  "swim_jig",
  "bladed_jig",
  "paddle_tail_swimbait",
  "compact_flipping_jig",
  "soft_jerkbait",
  "texas_rigged_soft_plastic_craw",
];

export const SPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "weightless_stick_worm",
  "compact_flipping_jig",
  "swim_jig",
  "paddle_tail_swimbait",
];
export const SOUTHERN_MAY_FROG_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  ...SPAWN_LAKE_LURES,
  "hollow_body_frog",
];
export const SPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "balanced_leech",
  "rabbit_strip_leech",
  "crawfish_streamer",
  "clouser_minnow",
];

export const POSTSPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "swim_jig",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "drop_shot_minnow",
  "squarebill_crankbait",
  "medium_diving_crankbait",
  "spinnerbait",
  "weightless_stick_worm",
];
export const POSTSPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "balanced_leech",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "deceiver",
];

export const SUMMER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "walking_topwater",
  "popping_topwater",
  "buzzbait",
  "prop_bait",
  "hollow_body_frog",
  "swim_jig",
  "paddle_tail_swimbait",
  "weightless_stick_worm",
  "deep_diving_crankbait",
  "drop_shot_worm",
  "drop_shot_minnow",
];
export const SUMMER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "mouse_fly",
  "frog_fly",
  "articulated_dungeon_streamer",
  "game_changer",
  "clouser_minnow",
  "woolly_bugger",
];

export const FALL_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "bladed_jig",
  "paddle_tail_swimbait",
  "squarebill_crankbait",
  "medium_diving_crankbait",
  "lipless_crankbait",
  "suspending_jerkbait",
  "walking_topwater",
];
export const FALL_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "deceiver",
  "game_changer",
  "woolly_bugger",
  "articulated_baitfish_streamer",
];

export const WINTER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "tube_jig",
  "shaky_head_worm",
  "blade_bait",
  "suspending_jerkbait",
  "drop_shot_worm",
];
export const WINTER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "crawfish_streamer",
  "balanced_leech",
  "rabbit_strip_leech",
  "woolly_bugger",
  "sculpin_streamer",
  "conehead_streamer",
  // clouser_minnow is current-friendly and gives the engine a baitfish option
  // for active windows in river systems; scoring handles the rest.
  "clouser_minnow",
];

export const SPRING_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "spinnerbait",
  "swim_jig",
  "squarebill_crankbait",
  "soft_jerkbait",
  "paddle_tail_swimbait",
  "texas_rigged_soft_plastic_craw",
];
export const SPRING_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
  "game_changer",
];

export const SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "walking_topwater",
  "popping_topwater",
  "buzzbait",
  "prop_bait",
  "swim_jig",
  "soft_jerkbait",
  "squarebill_crankbait",
  "spinnerbait",
  "weightless_stick_worm",
];
export const SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "mouse_fly",
  "popper_fly",
  "frog_fly",
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
];

export const FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "bladed_jig",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "squarebill_crankbait",
  "lipless_crankbait",
  "walking_topwater",
];
export const FALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "deceiver",
  "game_changer",
  "popper_fly",
  "articulated_baitfish_streamer",
];

export const TROPICAL_PRESPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "paddle_tail_swimbait",
  "spinnerbait",
  "soft_jerkbait",
  "compact_flipping_jig",
  "football_jig",
  "swim_jig",
];
export const TROPICAL_PRESPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
];

export const FLORIDA_PRESPAWN_PUSH_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "paddle_tail_swimbait",
  "spinnerbait",
  "soft_jerkbait",
  "swim_jig",
  "compact_flipping_jig",
  "football_jig",
];
/** March: keep bottom-control jigs out of the lead lane vs February. */
export const FLORIDA_MARCH_PRESPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "paddle_tail_swimbait",
  "spinnerbait",
  "soft_jerkbait",
  "swim_jig",
  "compact_flipping_jig",
];
export const FLORIDA_PRESPAWN_PUSH_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
];

export const CLEAR_SPRING_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "soft_jerkbait",
  "paddle_tail_swimbait",
  "swim_jig",
  "weightless_stick_worm",
  "carolina_rigged_stick_worm",
  "spinnerbait",
];
export const CLEAR_SPRING_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "balanced_leech",
  "deceiver",
  "articulated_baitfish_streamer",
  "rabbit_strip_leech",
];

export const CURRENT_SEAM_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "swim_jig",
  "soft_jerkbait",
  "paddle_tail_swimbait",
  "squarebill_crankbait",
  "bladed_jig",
  "compact_flipping_jig",
  "texas_rigged_soft_plastic_craw",
];
export const CURRENT_SEAM_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_baitfish_streamer",
  "deceiver",
  "rabbit_strip_leech",
];

export const DIRTY_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "texas_rigged_soft_plastic_craw",
  "spinnerbait",
  "bladed_jig",
  "swim_jig",
  "paddle_tail_swimbait",
  "hollow_body_frog",
];
export const DIRTY_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "frog_fly",
  "game_changer",
  "woolly_bugger",
  "crawfish_streamer",
];

export const LATE_SUMMER_CLEAR_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "drop_shot_worm",
  "soft_jerkbait",
  "swim_jig",
  "suspending_jerkbait",
  "paddle_tail_swimbait",
];
export const LATE_SUMMER_CLEAR_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "game_changer",
  "clouser_minnow",
  "woolly_bugger",
  "rabbit_strip_leech",
  "deceiver",
];

export const EARLY_FALL_GRASS_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "walking_topwater",
  "buzzbait",
  "prop_bait",
  "swim_jig",
  "spinnerbait",
  "bladed_jig",
  "hollow_body_frog",
  "squarebill_crankbait",
];
export const EARLY_FALL_GRASS_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "popper_fly",
  "game_changer",
  "clouser_minnow",
  "articulated_baitfish_streamer",
];

export const FLORIDA_FALL_GRASS_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "walking_topwater",
  "swim_jig",
  "spinnerbait",
  "bladed_jig",
  "hollow_body_frog",
  "paddle_tail_swimbait",
  "buzzbait",
  "prop_bait",
];
export const FLORIDA_FALL_GRASS_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "popper_fly",
  "frog_fly",
  "game_changer",
  "clouser_minnow",
  "articulated_baitfish_streamer",
];

export const FLORIDA_SPAWN_CLEAR_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "weightless_stick_worm",
  "compact_flipping_jig",
  "swim_jig",
  "paddle_tail_swimbait",
];
export const FLORIDA_SPAWN_CLEAR_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
  "clouser_minnow",
];

export const FLORIDA_DIRTY_SUMMER_GRASS_LAKE_LURES:
  readonly LureArchetypeIdV3[] = [
    "compact_flipping_jig",
    "texas_rigged_soft_plastic_craw",
    "hollow_body_frog",
    "swim_jig",
    "buzzbait",
    "prop_bait",
    "bladed_jig",
    "spinnerbait",
  ];
export const FLORIDA_DIRTY_SUMMER_GRASS_LAKE_FLIES:
  readonly FlyArchetypeIdV3[] = [
    "game_changer",
    "woolly_bugger",
    "mouse_fly",
  ];

export const TEXAS_SPAWN_TRANSITION_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "weightless_stick_worm",
  "swim_jig",
  "hollow_body_frog",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "spinnerbait",
];
export const TEXAS_SPAWN_TRANSITION_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "frog_fly",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
];

export const TEXAS_COLD_STAINED_RESERVOIR_LURES: readonly LureArchetypeIdV3[] =
  [
    "football_jig",
    "suspending_jerkbait",
    "flat_sided_crankbait",
    "shaky_head_worm",
    "texas_rigged_soft_plastic_craw",
    "paddle_tail_swimbait",
  ];
/** January-only: keep craw control in the story as a follow-up, not the cold lead. */
export const TEXAS_JANUARY_RESERVOIR_LURES: readonly LureArchetypeIdV3[] = [
  "football_jig",
  "suspending_jerkbait",
  "flat_sided_crankbait",
  "paddle_tail_swimbait",
];
export const TEXAS_COLD_STAINED_RESERVOIR_FLIES: readonly FlyArchetypeIdV3[] = [
  "balanced_leech",
  "rabbit_strip_leech",
  "woolly_bugger",
  "sculpin_streamer",
  "clouser_minnow",
  "crawfish_streamer",
];

export const SOCAL_MILD_WINTER_RESERVOIR_LURES: readonly LureArchetypeIdV3[] = [
  "football_jig",
  "suspending_jerkbait",
  "flat_sided_crankbait",
  "drop_shot_worm",
  "paddle_tail_swimbait",
];
export const SOCAL_MILD_WINTER_RESERVOIR_FLIES: readonly FlyArchetypeIdV3[] = [
  "balanced_leech",
  "woolly_bugger",
  "rabbit_strip_leech",
  "clouser_minnow",
  "sculpin_streamer",
];

export const TEXAS_DIRTY_SUMMER_RESERVOIR_LURES: readonly LureArchetypeIdV3[] =
  [
    "compact_flipping_jig",
    "texas_rigged_soft_plastic_craw",
    "deep_diving_crankbait",
    "football_jig",
    "spinnerbait",
    "swim_jig",
    "paddle_tail_swimbait",
  ];
export const TEXAS_DIRTY_SUMMER_RESERVOIR_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "rabbit_strip_leech",
  "game_changer",
  "crawfish_streamer",
  "clouser_minnow",
];

export const COLD_CLEAR_POND_LURES: readonly LureArchetypeIdV3[] = [
  "football_jig",
  "shaky_head_worm",
  "texas_rigged_soft_plastic_craw",
  "suspending_jerkbait",
  "flat_sided_crankbait",
  "blade_bait",
];
export const COLD_CLEAR_POND_FLIES: readonly FlyArchetypeIdV3[] = [
  "balanced_leech",
  "rabbit_strip_leech",
  "sculpin_streamer",
  "woolly_bugger",
  "crawfish_streamer",
];

export const GULF_LATE_FALL_GRASS_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "bladed_jig",
  "spinnerbait",
  "compact_flipping_jig",
  "paddle_tail_swimbait",
  "hollow_body_frog",
  "swim_jig",
  "squarebill_crankbait",
];
export const GULF_LATE_FALL_GRASS_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "game_changer",
  "clouser_minnow",
  "rabbit_strip_leech",
  "articulated_baitfish_streamer",
  "popper_fly",
];

export const GULF_DIRTY_PRESPAWN_GRASS_LAKE_LURES:
  readonly LureArchetypeIdV3[] = [
    "spinnerbait",
    "bladed_jig",
    "compact_flipping_jig",
    "swim_jig",
    "paddle_tail_swimbait",
    "lipless_crankbait",
    "texas_rigged_soft_plastic_craw",
  ];
export const GULF_DIRTY_PRESPAWN_GRASS_LAKE_FLIES: readonly FlyArchetypeIdV3[] =
  [
    "game_changer",
    "clouser_minnow",
    "woolly_bugger",
    "crawfish_streamer",
    "rabbit_strip_leech",
  ];

export const SOUTH_CENTRAL_LATEFALL_RESERVOIR_LURES:
  readonly LureArchetypeIdV3[] = [
    "suspending_jerkbait",
    "flat_sided_crankbait",
    "football_jig",
    "paddle_tail_swimbait",
    "texas_rigged_soft_plastic_craw",
    "shaky_head_worm",
  ];
export const SOUTH_CENTRAL_LATEFALL_RESERVOIR_FLIES:
  readonly FlyArchetypeIdV3[] = [
    "balanced_leech",
    "rabbit_strip_leech",
    "woolly_bugger",
    "sculpin_streamer",
    "clouser_minnow",
    "crawfish_streamer",
  ];

export const DELTA_LATE_FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "bladed_jig",
  "compact_flipping_jig",
  "spinnerbait",
  "paddle_tail_swimbait",
  "squarebill_crankbait",
  "swim_jig",
  "suspending_jerkbait",
];
export const DELTA_LATE_FALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "balanced_leech",
  "rabbit_strip_leech",
  "game_changer",
  "clouser_minnow",
  "articulated_baitfish_streamer",
  "woolly_bugger",
];

export const SUMMER_CURRENT_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "swim_jig",
  "spinnerbait",
  "soft_jerkbait",
  "paddle_tail_swimbait",
  "squarebill_crankbait",
  "weightless_stick_worm",
  "bladed_jig",
  "compact_flipping_jig",
];
export const SUMMER_CURRENT_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "popper_fly",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
];

export const DELTA_CLEAR_PRESPAWN_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "soft_jerkbait",
  "compact_flipping_jig",
  "spinnerbait",
  "swim_jig",
  "paddle_tail_swimbait",
  "squarebill_crankbait",
];
export const DELTA_CLEAR_PRESPAWN_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "articulated_baitfish_streamer",
];

export const FLORIDA_POSTSPAWN_SHALLOW_LAKE_LURES:
  readonly LureArchetypeIdV3[] = [
    "weightless_stick_worm",
    "compact_flipping_jig",
    "swim_jig",
    "hollow_body_frog",
    "paddle_tail_swimbait",
    "soft_jerkbait",
    "drop_shot_minnow",
    "spinnerbait",
  ];
export const FLORIDA_MAY_SHALLOW_COVER_LAKE_LURES:
  readonly LureArchetypeIdV3[] = [
    "hollow_body_frog",
    "weightless_stick_worm",
    "compact_flipping_jig",
    "swim_jig",
    "paddle_tail_swimbait",
    "soft_jerkbait",
    "spinnerbait",
  ];
export const FLORIDA_POSTSPAWN_SHALLOW_LAKE_FLIES: readonly FlyArchetypeIdV3[] =
  [
    "woolly_bugger",
    "clouser_minnow",
    "game_changer",
    "rabbit_strip_leech",
    "frog_fly",
  ];

export const FLORIDA_MIDSUMMER_GRASS_LAKE_LURES: readonly LureArchetypeIdV3[] =
  [
    "hollow_body_frog",
    "buzzbait",
    "prop_bait",
    "swim_jig",
    "compact_flipping_jig",
    "bladed_jig",
    "spinnerbait",
    "weightless_stick_worm",
  ];
export const FLORIDA_MIDSUMMER_GRASS_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "frog_fly",
  "mouse_fly",
  "game_changer",
  "popper_fly",
  "woolly_bugger",
  "clouser_minnow",
];

export const TROPICAL_SUMMER_CONTROL_LAKE_LURES: readonly LureArchetypeIdV3[] =
  [
    "compact_flipping_jig",
    "football_jig",
    "texas_rigged_soft_plastic_craw",
    "deep_diving_crankbait",
    "swim_jig",
    "paddle_tail_swimbait",
    "prop_bait",
  ];
export const TROPICAL_SUMMER_CONTROL_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "balanced_leech",
  "crawfish_streamer",
  "game_changer",
  "clouser_minnow",
];

export const SOUTHEAST_SUMMER_CONTROL_LAKE_LURES: readonly LureArchetypeIdV3[] =
  [
    "compact_flipping_jig",
    "football_jig",
    "texas_rigged_soft_plastic_craw",
    "deep_diving_crankbait",
    "swim_jig",
    "spinnerbait",
    "prop_bait",
  ];
export const SOUTHEAST_SUMMER_CONTROL_LAKE_FLIES: readonly FlyArchetypeIdV3[] =
  [
    "woolly_bugger",
    "balanced_leech",
    "crawfish_streamer",
    "game_changer",
    "clouser_minnow",
  ];

// Minnesota weed-lake summer: swim_jig leads so it wins the frog/jig tiebreak in clear water.
// Aligns with the great_lakes_upper_midwest July midsummer bounded pool (weed-friendly horizontals).
export const MN_WEED_LAKE_SUMMER_LURES: readonly LureArchetypeIdV3[] = [
  "swim_jig",
  "weightless_stick_worm",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "hollow_body_frog",
  "drop_shot_worm",
  "suspending_jerkbait",
];
/** Great Lakes July clear weed ledge: keep drop shot out of the monthly pool so swim/stick lead on cool, suppressed midsummer archive days. */
export const GL_CLEAR_WEED_JULY_LEDGE_LURES: readonly LureArchetypeIdV3[] = [
  "swim_jig",
  "weightless_stick_worm",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "hollow_body_frog",
  "suspending_jerkbait",
];

/** Natural northern weed bite: frog token + subsurface streamers (no mouse hedge). */
export const NORTHERN_WEED_EARLY_SUMMER_LAKE_FLIES:
  readonly FlyArchetypeIdV3[] = [
    "frog_fly",
    "game_changer",
    "clouser_minnow",
    "woolly_bugger",
    "articulated_dungeon_streamer",
    "deceiver",
    "rabbit_strip_leech",
  ];

export const FLORIDA_WINTER_CONTROL_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "texas_rigged_soft_plastic_craw",
  "football_jig",
  "suspending_jerkbait",
  "flat_sided_crankbait",
  "compact_flipping_jig",
  "shaky_head_worm",
];
export const FLORIDA_WINTER_CONTROL_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "crawfish_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "sculpin_streamer",
  "clouser_minnow",
];

export const TEXAS_SUMMER_RESERVOIR_CONTROL_LURES:
  readonly LureArchetypeIdV3[] = [
    "compact_flipping_jig",
    "football_jig",
    "deep_diving_crankbait",
    "texas_rigged_soft_plastic_craw",
    "spinnerbait",
    "swim_jig",
    "paddle_tail_swimbait",
  ];
export const TEXAS_SUMMER_RESERVOIR_CONTROL_FLIES: readonly FlyArchetypeIdV3[] =
  [
    "woolly_bugger",
    "rabbit_strip_leech",
    "crawfish_streamer",
    "game_changer",
    "clouser_minnow",
  ];

export const TEXAS_FALL_TIGHTENING_RESERVOIR_LURES:
  readonly LureArchetypeIdV3[] = [
    "suspending_jerkbait",
    "flat_sided_crankbait",
    "football_jig",
    "spinnerbait",
    "paddle_tail_swimbait",
    "squarebill_crankbait",
  ];
export const TEXAS_FALL_TIGHTENING_RESERVOIR_FLIES:
  readonly FlyArchetypeIdV3[] = [
    "clouser_minnow",
    "rabbit_strip_leech",
    "woolly_bugger",
    "game_changer",
    "sculpin_streamer",
  ];

export const SOUTH_CENTRAL_WINTER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "suspending_jerkbait",
  "shaky_head_worm",
  "squarebill_crankbait",
  "spinnerbait",
];
export const SOUTH_CENTRAL_WINTER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "crawfish_streamer",
  "woolly_bugger",
  "clouser_minnow",
  "rabbit_strip_leech",
  "sculpin_streamer",
];

export const SOUTH_CENTRAL_PRESPAWN_RIVER_LURES: readonly LureArchetypeIdV3[] =
  [
    "spinnerbait",
    "swim_jig",
    "soft_jerkbait",
    "squarebill_crankbait",
    "compact_flipping_jig",
    "paddle_tail_swimbait",
    "texas_rigged_soft_plastic_craw",
  ];
export const SOUTH_CENTRAL_PRESPAWN_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
];

export const ALABAMA_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "swim_jig",
  "spinnerbait",
  "soft_jerkbait",
  "squarebill_crankbait",
  "compact_flipping_jig",
  "weightless_stick_worm",
  "paddle_tail_swimbait",
];
export const ALABAMA_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "woolly_bugger",
  "rabbit_strip_leech",
];

export const SOUTH_CENTRAL_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "paddle_tail_swimbait",
  "compact_flipping_jig",
  "swim_jig",
  "squarebill_crankbait",
  "soft_jerkbait",
  "bladed_jig",
  "texas_rigged_soft_plastic_craw",
];
export const SOUTH_CENTRAL_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "game_changer",
  "woolly_bugger",
  "crawfish_streamer",
  "clouser_minnow",
];

export const SOUTH_CENTRAL_FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "paddle_tail_swimbait",
  "squarebill_crankbait",
  "soft_jerkbait",
  "bladed_jig",
  "compact_flipping_jig",
];
export const SOUTH_CENTRAL_FALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_baitfish_streamer",
  "woolly_bugger",
  "deceiver",
];

export const MIDWEST_BACKWATER_PRESPAWN_RIVER_LURES:
  readonly LureArchetypeIdV3[] = [
    "spinnerbait",
    "bladed_jig",
    "compact_flipping_jig",
    "swim_jig",
    "squarebill_crankbait",
    "soft_jerkbait",
    "texas_rigged_soft_plastic_craw",
  ];
export const MIDWEST_BACKWATER_PRESPAWN_RIVER_FLIES:
  readonly FlyArchetypeIdV3[] = [
    "clouser_minnow",
    "game_changer",
    "deceiver",
    "woolly_bugger",
    "rabbit_strip_leech",
  ];

export const MIDWEST_BACKWATER_FALL_RIVER_LURES: readonly LureArchetypeIdV3[] =
  [
    "compact_flipping_jig",
    "spinnerbait",
    "suspending_jerkbait",
    "bladed_jig",
    "squarebill_crankbait",
    "soft_jerkbait",
    "paddle_tail_swimbait",
  ];
export const MIDWEST_BACKWATER_FALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "deceiver",
  "woolly_bugger",
  "crawfish_streamer",
];

export const NORTHERN_CLEAR_WINTER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "flat_sided_crankbait",
  "football_jig",
  "blade_bait",
  "drop_shot_worm",
];
export const NORTHERN_CLEAR_PRESPAWN_CRANK_LAKE_LURES:
  readonly LureArchetypeIdV3[] = [
    "flat_sided_crankbait",
    "suspending_jerkbait",
    "football_jig",
    "shaky_head_worm",
    "paddle_tail_swimbait",
  ];
export const NORTHERN_CLEAR_WINTER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "rabbit_strip_leech",
  "woolly_bugger",
  "sculpin_streamer",
  "balanced_leech",
  "conehead_streamer",
  "crawfish_streamer",
];

export const NORTHERN_CLEAR_SPAWN_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "weightless_stick_worm",
  "swim_jig",
  "soft_jerkbait",
  "paddle_tail_swimbait",
  "compact_flipping_jig",
];
export const NORTHERN_CLEAR_SPAWN_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "clouser_minnow",
  "game_changer",
  "rabbit_strip_leech",
  "articulated_baitfish_streamer",
];

export const NORTHERN_CLEAR_SUMMER_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "weightless_stick_worm",
  "drop_shot_worm",
  "soft_jerkbait",
  "swim_jig",
  "paddle_tail_swimbait",
  "suspending_jerkbait",
  "finesse_jig",
];
export const NORTHERN_CLEAR_SUMMER_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "game_changer",
  "clouser_minnow",
  "woolly_bugger",
  "rabbit_strip_leech",
  "balanced_leech",
  "articulated_baitfish_streamer",
];

export const NORTHERN_CLEAR_FALL_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "spinnerbait",
  "swim_jig",
  "squarebill_crankbait",
  "suspending_jerkbait",
  "paddle_tail_swimbait",
  "walking_topwater",
];
export const NORTHERN_CLEAR_FALL_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "game_changer",
  "clouser_minnow",
  "articulated_baitfish_streamer",
  "deceiver",
];

export const SOUTH_CENTRAL_CLEAR_SPRING_LAKE_LURES:
  readonly LureArchetypeIdV3[] = [
    "compact_flipping_jig",
    "soft_jerkbait",
    "swim_jig",
    "weightless_stick_worm",
    "paddle_tail_swimbait",
    "suspending_jerkbait",
    "spinnerbait",
  ];
export const SOUTH_CENTRAL_CLEAR_SPRING_LAKE_FLIES:
  readonly FlyArchetypeIdV3[] = [
    "clouser_minnow",
    "game_changer",
    "articulated_dungeon_streamer",
    "woolly_bugger",
    "rabbit_strip_leech",
    "deceiver",
  ];

export const SOUTH_CENTRAL_FALL_TRANSITION_LAKE_LURES:
  readonly LureArchetypeIdV3[] = [
    "squarebill_crankbait",
    "paddle_tail_swimbait",
    "spinnerbait",
    "suspending_jerkbait",
    "bladed_jig",
    "flat_sided_crankbait",
  ];
export const SOUTH_CENTRAL_FALL_TRANSITION_LAKE_FLIES:
  readonly FlyArchetypeIdV3[] = [
    "clouser_minnow",
    "game_changer",
    "deceiver",
    "articulated_baitfish_streamer",
    "woolly_bugger",
  ];

export const SOUTH_CENTRAL_JUNE_LAKE_LURES: readonly LureArchetypeIdV3[] = [
  "compact_flipping_jig",
  "football_jig",
  "deep_diving_crankbait",
  "soft_jerkbait",
  "paddle_tail_swimbait",
  "swim_jig",
  "spinnerbait",
];
export const SOUTH_CENTRAL_JUNE_LAKE_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "game_changer",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "crawfish_streamer",
];

export const DELTA_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "swim_jig",
  "spinnerbait",
  "hollow_body_frog",
  "bladed_jig",
  "compact_flipping_jig",
  "squarebill_crankbait",
  "soft_jerkbait",
];
export const DELTA_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "frog_fly",
  "game_changer",
  "clouser_minnow",
  "woolly_bugger",
  "popper_fly",
];

export const DELTA_FALL_TRANSITION_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "bladed_jig",
  "compact_flipping_jig",
  "spinnerbait",
  "swim_jig",
  "squarebill_crankbait",
  "paddle_tail_swimbait",
];
export const DELTA_FALL_TRANSITION_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "rabbit_strip_leech",
  "game_changer",
  "clouser_minnow",
  "woolly_bugger",
  "frog_fly",
  "articulated_baitfish_streamer",
];

export const TROPICAL_WARM_REGIONS: readonly RegionKey[] = ["florida"];
export const HAWAII_REGIONS: readonly RegionKey[] = ["hawaii"];
export const SOUTHEAST_WARM_REGIONS: readonly RegionKey[] = [
  "gulf_coast",
  "southeast_atlantic",
];
export const APPALACHIAN_REGIONS: readonly RegionKey[] = ["appalachian"];
export const SOUTH_CENTRAL_REGIONS: readonly RegionKey[] = ["south_central"];
export const NORTHERN_REGIONS: readonly RegionKey[] = [
  "northeast",
  "great_lakes_upper_midwest",
];
export const MIDWEST_REGIONS: readonly RegionKey[] = ["midwest_interior"];
export const WESTERN_WARM_REGIONS: readonly RegionKey[] = [
  "southern_california",
  "southwest_desert",
];
export const WESTERN_INLAND_REGIONS: readonly RegionKey[] = [
  "mountain_west",
  "southwest_high_desert",
  "pacific_northwest",
  "northern_california",
  "inland_northwest",
];

export const LARGEMOUTH_V3_SUPPORTED_REGIONS: readonly RegionKey[] = [
  ...TROPICAL_WARM_REGIONS,
  ...HAWAII_REGIONS,
  ...SOUTHEAST_WARM_REGIONS,
  ...APPALACHIAN_REGIONS,
  ...SOUTH_CENTRAL_REGIONS,
  ...NORTHERN_REGIONS,
  ...MIDWEST_REGIONS,
  ...WESTERN_WARM_REGIONS,
  ...WESTERN_INLAND_REGIONS,
];
