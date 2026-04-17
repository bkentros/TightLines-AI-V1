import type { RecommenderV3SeasonalRow } from "../../contracts.ts";
import { addLargemouthMonths } from "./addLargemouthMonths.ts";
import * as C from "./constants.ts";

export function registerBaseLargemouthRowsPartA(
  rows: Map<string, RecommenderV3SeasonalRow>,
): void {
  addLargemouthMonths(rows, C.TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [
    1,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
    viable_lure_archetypes: C.WINTER_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.WINTER_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [
    2,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
    viable_lure_archetypes: C.PRESPAWN_LAKE_LURES,
    primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
    viable_fly_archetypes: C.PRESPAWN_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [
    3,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["suspending_jerkbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.TROPICAL_PRESPAWN_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
    viable_fly_archetypes: C.TROPICAL_PRESPAWN_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [
    4,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["suspending_jerkbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.TROPICAL_PRESPAWN_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
    viable_fly_archetypes: C.TROPICAL_PRESPAWN_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [
    5,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "mid",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["compact_flipping_jig", "hollow_body_frog"],
    viable_lure_archetypes: C.TEXAS_SPAWN_TRANSITION_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.TEXAS_SPAWN_TRANSITION_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [
    6,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "leaning_bold",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["hollow_body_frog", "swim_jig"],
    viable_lure_archetypes: C.SUMMER_LAKE_LURES,
    primary_fly_archetypes: ["game_changer", "frog_fly"],
    viable_fly_archetypes: C.SUMMER_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [
    7,
    8,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["compact_flipping_jig", "football_jig"],
    viable_lure_archetypes: C.TROPICAL_SUMMER_CONTROL_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.TROPICAL_SUMMER_CONTROL_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [
    9,
    10,
    11,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "mid",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.FALL_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.FALL_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.TROPICAL_WARM_REGIONS, "freshwater_lake_pond", [
    12,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
    viable_lure_archetypes: C.WINTER_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.WINTER_LAKE_FLIES,
  });

  // Tropical warm river
  addLargemouthMonths(
    rows,
    C.TROPICAL_WARM_REGIONS,
    "freshwater_river",
    [1, 2],
    {
      surface_seasonally_possible: false,
      base_water_column: "bottom",
      base_mood: "negative",
      base_presentation_style: "leaning_subtle",
      primary_forage: "crawfish",
      secondary_forage: "baitfish",
      primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
      viable_lure_archetypes: C.WINTER_RIVER_LURES,
      primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
      viable_fly_archetypes: C.WINTER_RIVER_FLIES,
    },
  );
  addLargemouthMonths(
    rows,
    C.TROPICAL_WARM_REGIONS,
    "freshwater_river",
    [3, 4],
    {
      surface_seasonally_possible: false,
      base_water_column: "shallow",
      base_mood: "active",
      base_presentation_style: "balanced",
      primary_forage: "crawfish",
      secondary_forage: "baitfish",
      primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
      viable_lure_archetypes: C.SPRING_RIVER_LURES,
      primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
      viable_fly_archetypes: C.SPRING_RIVER_FLIES,
    },
  );
  addLargemouthMonths(
    rows,
    C.TROPICAL_WARM_REGIONS,
    "freshwater_river",
    [5, 6],
    {
      surface_seasonally_possible: false,
      base_water_column: "mid",
      base_mood: "neutral",
      base_presentation_style: "balanced",
      primary_forage: "baitfish",
      secondary_forage: "crawfish",
      primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
      viable_lure_archetypes: C.SPRING_RIVER_LURES,
      primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
      viable_fly_archetypes: C.SPRING_RIVER_FLIES,
    },
  );
  addLargemouthMonths(
    rows,
    C.TROPICAL_WARM_REGIONS,
    "freshwater_river",
    [7, 8],
    {
      surface_seasonally_possible: false,
      base_water_column: "mid",
      base_mood: "negative",
      base_presentation_style: "leaning_subtle",
      primary_forage: "baitfish",
      secondary_forage: "bluegill_perch",
      primary_lure_archetypes: ["compact_flipping_jig", "spinnerbait"],
      viable_lure_archetypes: C.SOUTH_CENTRAL_SUMMER_RIVER_LURES,
      primary_fly_archetypes: ["woolly_bugger", "crawfish_streamer"],
      viable_fly_archetypes: C.SOUTH_CENTRAL_SUMMER_RIVER_FLIES,
    },
  );
  addLargemouthMonths(rows, C.TROPICAL_WARM_REGIONS, "freshwater_river", [
    9,
    10,
    11,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.FALL_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.FALL_RIVER_FLIES,
  });
  addLargemouthMonths(rows, C.TROPICAL_WARM_REGIONS, "freshwater_river", [12], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
    viable_lure_archetypes: C.WINTER_RIVER_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.WINTER_RIVER_FLIES,
  });

  // Hawaii keeps a looser tropical warmwater calendar than Florida and should not
  // inherit Florida's extended spawn and grass-surface assumptions month for month.
  addLargemouthMonths(rows, C.HAWAII_REGIONS, "freshwater_lake_pond", [1, 2], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["suspending_jerkbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.PRESPAWN_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
    viable_fly_archetypes: C.PRESPAWN_LAKE_FLIES,
  });
  addLargemouthMonths(
    rows,
    C.HAWAII_REGIONS,
    "freshwater_lake_pond",
    [3, 4, 5],
    {
      surface_seasonally_possible: false,
      base_water_column: "shallow",
      base_mood: "active",
      base_presentation_style: "balanced",
      primary_forage: "baitfish",
      secondary_forage: "crawfish",
      primary_lure_archetypes: [
        "compact_flipping_jig",
        "weightless_stick_worm",
      ],
      viable_lure_archetypes: C.SPAWN_LAKE_LURES,
      primary_fly_archetypes: ["woolly_bugger", "clouser_minnow"],
      viable_fly_archetypes: C.SPAWN_LAKE_FLIES,
    },
  );
  addLargemouthMonths(
    rows,
    C.HAWAII_REGIONS,
    "freshwater_lake_pond",
    [6, 7, 8],
    {
      surface_seasonally_possible: false,
      base_water_column: "mid",
      base_mood: "neutral",
      base_presentation_style: "balanced",
      primary_forage: "baitfish",
      secondary_forage: "bluegill_perch",
      primary_lure_archetypes: ["swim_jig", "paddle_tail_swimbait"],
      viable_lure_archetypes: C.POSTSPAWN_LAKE_LURES,
      primary_fly_archetypes: ["game_changer", "clouser_minnow"],
      viable_fly_archetypes: C.POSTSPAWN_LAKE_FLIES,
    },
  );
  addLargemouthMonths(rows, C.HAWAII_REGIONS, "freshwater_lake_pond", [9, 10], {
    surface_seasonally_possible: true,
    base_water_column: "mid",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.FALL_LAKE_LURES,
    primary_fly_archetypes: ["game_changer", "clouser_minnow"],
    viable_fly_archetypes: C.FALL_LAKE_FLIES,
  });
  addLargemouthMonths(
    rows,
    C.HAWAII_REGIONS,
    "freshwater_lake_pond",
    [11, 12],
    {
      surface_seasonally_possible: false,
      base_water_column: "mid",
      base_mood: "neutral",
      base_presentation_style: "leaning_subtle",
      primary_forage: "baitfish",
      secondary_forage: "crawfish",
      primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
      viable_lure_archetypes: C.WINTER_LAKE_LURES,
      primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
      viable_fly_archetypes: C.WINTER_LAKE_FLIES,
    },
  );
  addLargemouthMonths(rows, C.HAWAII_REGIONS, "freshwater_river", [1, 2], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "neutral",
    base_presentation_style: "leaning_subtle",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
    viable_lure_archetypes: C.WINTER_RIVER_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.WINTER_RIVER_FLIES,
  });
  addLargemouthMonths(rows, C.HAWAII_REGIONS, "freshwater_river", [3, 4, 5], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
    viable_lure_archetypes: C.SPRING_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
    viable_fly_archetypes: C.SPRING_RIVER_FLIES,
  });
  addLargemouthMonths(rows, C.HAWAII_REGIONS, "freshwater_river", [6, 7, 8], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.SOUTH_CENTRAL_SUMMER_RIVER_LURES,
    primary_fly_archetypes: ["game_changer", "woolly_bugger"],
    viable_fly_archetypes: C.SOUTH_CENTRAL_SUMMER_RIVER_FLIES,
  });
  addLargemouthMonths(rows, C.HAWAII_REGIONS, "freshwater_river", [9, 10], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.FALL_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.FALL_RIVER_FLIES,
  });
  addLargemouthMonths(rows, C.HAWAII_REGIONS, "freshwater_river", [11, 12], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "neutral",
    base_presentation_style: "leaning_subtle",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
    viable_lure_archetypes: C.WINTER_RIVER_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.WINTER_RIVER_FLIES,
  });

  // Southeast warm lake / pond
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [
    1,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
    viable_lure_archetypes: C.WINTER_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.WINTER_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [
    2,
    3,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
    viable_lure_archetypes: C.PRESPAWN_LAKE_LURES,
    primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
    viable_fly_archetypes: C.PRESPAWN_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [
    4,
    5,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["compact_flipping_jig", "weightless_stick_worm"],
    viable_lure_archetypes: C.SPAWN_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.SPAWN_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [
    5,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["compact_flipping_jig", "hollow_body_frog"],
    viable_lure_archetypes: C.SOUTHERN_MAY_FROG_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.SPAWN_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [
    6,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["swim_jig", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.POSTSPAWN_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.POSTSPAWN_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [
    7,
    8,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["compact_flipping_jig", "football_jig"],
    viable_lure_archetypes: C.SOUTHEAST_SUMMER_CONTROL_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.SOUTHEAST_SUMMER_CONTROL_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [
    9,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["prop_bait", "walking_topwater"],
    viable_lure_archetypes: C.EARLY_FALL_GRASS_LAKE_LURES,
    primary_fly_archetypes: ["popper_fly", "game_changer"],
    viable_fly_archetypes: C.EARLY_FALL_GRASS_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [
    10,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "mid",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.FALL_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.FALL_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [
    11,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "neutral",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
    viable_lure_archetypes: C.WINTER_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.WINTER_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_lake_pond", [
    12,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
    viable_lure_archetypes: C.WINTER_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.WINTER_LAKE_FLIES,
  });

  // Southeast warm river
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_river", [
    1,
    2,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
    viable_lure_archetypes: C.WINTER_RIVER_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.WINTER_RIVER_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_river", [
    3,
    4,
    5,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
    viable_lure_archetypes: C.SPRING_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
    viable_fly_archetypes: C.SPRING_RIVER_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_river", [6], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
    viable_lure_archetypes: C.SPRING_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
    viable_fly_archetypes: C.SPRING_RIVER_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_river", [
    7,
    8,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["compact_flipping_jig", "spinnerbait"],
    viable_lure_archetypes: C.SOUTH_CENTRAL_SUMMER_RIVER_LURES,
    primary_fly_archetypes: ["woolly_bugger", "crawfish_streamer"],
    viable_fly_archetypes: C.SOUTH_CENTRAL_SUMMER_RIVER_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_river", [
    9,
    10,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.FALL_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.FALL_RIVER_FLIES,
  });
  addLargemouthMonths(rows, C.SOUTHEAST_WARM_REGIONS, "freshwater_river", [
    11,
    12,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
    viable_lure_archetypes: C.WINTER_RIVER_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.WINTER_RIVER_FLIES,
  });

  // Appalachian lake / pond
  addLargemouthMonths(rows, C.APPALACHIAN_REGIONS, "freshwater_lake_pond", [
    1,
    2,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
    viable_lure_archetypes: C.WINTER_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.WINTER_LAKE_FLIES,
  });
  addLargemouthMonths(
    rows,
    C.APPALACHIAN_REGIONS,
    "freshwater_lake_pond",
    [3],
    {
      surface_seasonally_possible: false,
      base_water_column: "mid",
      base_mood: "neutral",
      base_presentation_style: "balanced",
      primary_forage: "crawfish",
      secondary_forage: "baitfish",
      primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
      viable_lure_archetypes: C.PRESPAWN_LAKE_LURES,
      primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
      viable_fly_archetypes: C.PRESPAWN_LAKE_FLIES,
    },
  );
  addLargemouthMonths(
    rows,
    C.APPALACHIAN_REGIONS,
    "freshwater_lake_pond",
    [4],
    {
      surface_seasonally_possible: false,
      base_water_column: "mid",
      base_mood: "neutral",
      base_presentation_style: "leaning_subtle",
      primary_forage: "baitfish",
      secondary_forage: "crawfish",
      primary_lure_archetypes: ["suspending_jerkbait", "weightless_stick_worm"],
      viable_lure_archetypes: C.CLEAR_SPRING_LAKE_LURES,
      primary_fly_archetypes: ["clouser_minnow", "balanced_leech"],
      viable_fly_archetypes: C.CLEAR_SPRING_LAKE_FLIES,
    },
  );
  addLargemouthMonths(
    rows,
    C.APPALACHIAN_REGIONS,
    "freshwater_lake_pond",
    [5],
    {
      surface_seasonally_possible: false,
      base_water_column: "shallow",
      base_mood: "active",
      base_presentation_style: "balanced",
      primary_forage: "crawfish",
      secondary_forage: "baitfish",
      primary_lure_archetypes: [
        "compact_flipping_jig",
        "weightless_stick_worm",
      ],
      viable_lure_archetypes: C.SPAWN_LAKE_LURES,
      primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
      viable_fly_archetypes: C.SPAWN_LAKE_FLIES,
    },
  );
  addLargemouthMonths(
    rows,
    C.APPALACHIAN_REGIONS,
    "freshwater_lake_pond",
    [6],
    {
      surface_seasonally_possible: false,
      base_water_column: "mid",
      base_mood: "neutral",
      base_presentation_style: "balanced",
      primary_forage: "baitfish",
      secondary_forage: "crawfish",
      primary_lure_archetypes: ["swim_jig", "paddle_tail_swimbait"],
      viable_lure_archetypes: C.POSTSPAWN_LAKE_LURES,
      primary_fly_archetypes: ["clouser_minnow", "game_changer"],
      viable_fly_archetypes: C.POSTSPAWN_LAKE_FLIES,
    },
  );
  addLargemouthMonths(rows, C.APPALACHIAN_REGIONS, "freshwater_lake_pond", [
    7,
    8,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "leaning_bold",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["hollow_body_frog", "swim_jig"],
    viable_lure_archetypes: C.SUMMER_LAKE_LURES,
    primary_fly_archetypes: ["game_changer", "frog_fly"],
    viable_fly_archetypes: C.SUMMER_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.APPALACHIAN_REGIONS, "freshwater_lake_pond", [
    9,
    10,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.FALL_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.FALL_LAKE_FLIES,
  });
  addLargemouthMonths(rows, C.APPALACHIAN_REGIONS, "freshwater_lake_pond", [
    11,
    12,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["football_jig", "texas_rigged_soft_plastic_craw"],
    viable_lure_archetypes: C.WINTER_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.WINTER_LAKE_FLIES,
  });

  // Appalachian river
  addLargemouthMonths(rows, C.APPALACHIAN_REGIONS, "freshwater_river", [1, 2], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
    viable_lure_archetypes: C.WINTER_RIVER_LURES,
    primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
    viable_fly_archetypes: C.WINTER_RIVER_FLIES,
  });
  addLargemouthMonths(rows, C.APPALACHIAN_REGIONS, "freshwater_river", [
    3,
    4,
    5,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
    viable_lure_archetypes: C.SPRING_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
    viable_fly_archetypes: C.SPRING_RIVER_FLIES,
  });
  addLargemouthMonths(rows, C.APPALACHIAN_REGIONS, "freshwater_river", [
    6,
    7,
    8,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["walking_topwater", "swim_jig"],
    viable_lure_archetypes: C.SUMMER_RIVER_LURES,
    primary_fly_archetypes: ["popper_fly", "game_changer"],
    viable_fly_archetypes: C.SUMMER_RIVER_FLIES,
  });
  addLargemouthMonths(
    rows,
    C.APPALACHIAN_REGIONS,
    "freshwater_river",
    [9, 10],
    {
      surface_seasonally_possible: true,
      base_water_column: "shallow",
      base_mood: "active",
      base_presentation_style: "balanced",
      primary_forage: "baitfish",
      secondary_forage: "bluegill_perch",
      primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
      viable_lure_archetypes: C.FALL_RIVER_LURES,
      primary_fly_archetypes: ["clouser_minnow", "game_changer"],
      viable_fly_archetypes: C.FALL_RIVER_FLIES,
    },
  );
}
