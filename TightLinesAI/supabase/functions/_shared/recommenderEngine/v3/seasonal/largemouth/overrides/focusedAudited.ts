import type { RecommenderV3SeasonalRow } from "../../../contracts.ts";
import { addLargemouthMonths } from "../addLargemouthMonths.ts";
import * as C from "../constants.ts";

export function registerFocusedAuditedLargemouthOverrides(
  rows: Map<string, RecommenderV3SeasonalRow>,
): void {
  // Focused largemouth overrides for audited high-value windows.
  addLargemouthMonths(rows, ["florida"], "freshwater_lake_pond", [2], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: [
      "suspending_jerkbait",
      "paddle_tail_swimbait",
      "spinnerbait",
    ],
    viable_lure_archetypes: C.FLORIDA_PRESPAWN_PUSH_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
    viable_fly_archetypes: C.FLORIDA_PRESPAWN_PUSH_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["florida"], "freshwater_lake_pond", [3], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: [
      "suspending_jerkbait",
      "paddle_tail_swimbait",
      "spinnerbait",
    ],
    viable_lure_archetypes: C.FLORIDA_MARCH_PRESPAWN_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "woolly_bugger"],
    viable_fly_archetypes: C.FLORIDA_PRESPAWN_PUSH_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["florida"], "freshwater_lake_pond", [4], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "leaning_subtle",
    primary_forage: "leech_worm",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["weightless_stick_worm", "compact_flipping_jig"],
    viable_lure_archetypes: C.FLORIDA_SPAWN_CLEAR_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "crawfish_streamer"],
    viable_fly_archetypes: C.FLORIDA_SPAWN_CLEAR_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["florida"], "freshwater_lake_pond", [7], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "leaning_bold",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["hollow_body_frog", "buzzbait"],
    viable_lure_archetypes: C.FLORIDA_MIDSUMMER_GRASS_LAKE_LURES,
    primary_fly_archetypes: ["frog_fly", "mouse_fly"],
    viable_fly_archetypes: C.FLORIDA_MIDSUMMER_GRASS_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["florida"], "freshwater_lake_pond", [8], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["hollow_body_frog", "prop_bait"],
    viable_lure_archetypes: C.FLORIDA_MIDSUMMER_GRASS_LAKE_LURES,
    primary_fly_archetypes: ["frog_fly", "mouse_fly"],
    viable_fly_archetypes: C.FLORIDA_MIDSUMMER_GRASS_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["florida"], "freshwater_lake_pond", [10], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["swim_jig", "spinnerbait"],
    viable_lure_archetypes: C.FLORIDA_FALL_GRASS_LAKE_LURES,
    primary_fly_archetypes: ["game_changer", "clouser_minnow"],
    viable_fly_archetypes: C.FLORIDA_FALL_GRASS_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["florida"], "freshwater_lake_pond", [12], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: [
      "texas_rigged_soft_plastic_craw",
      "suspending_jerkbait",
    ],
    viable_lure_archetypes: C.FLORIDA_WINTER_CONTROL_LAKE_LURES,
    primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
    viable_fly_archetypes: C.FLORIDA_WINTER_CONTROL_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["south_central"], "freshwater_lake_pond", [4], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["compact_flipping_jig", "soft_jerkbait"],
    viable_lure_archetypes: C.SOUTH_CENTRAL_CLEAR_SPRING_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.SOUTH_CENTRAL_CLEAR_SPRING_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["south_central"], "freshwater_lake_pond", [6], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: [
      "compact_flipping_jig",
      "football_jig",
      "soft_jerkbait",
    ],
    viable_lure_archetypes: C.SOUTH_CENTRAL_JUNE_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.SOUTH_CENTRAL_JUNE_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["south_central"], "freshwater_lake_pond", [1], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: [
      "football_jig",
      "suspending_jerkbait",
      "flat_sided_crankbait",
    ],
    viable_lure_archetypes: C.TEXAS_JANUARY_RESERVOIR_LURES,
    primary_fly_archetypes: ["balanced_leech", "woolly_bugger"],
    viable_fly_archetypes: C.TEXAS_COLD_STAINED_RESERVOIR_FLIES,
  });
  addLargemouthMonths(rows, ["south_central"], "freshwater_lake_pond", [7], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["compact_flipping_jig", "deep_diving_crankbait"],
    viable_lure_archetypes: C.TEXAS_DIRTY_SUMMER_RESERVOIR_LURES,
    primary_fly_archetypes: ["woolly_bugger", "crawfish_streamer"],
    viable_fly_archetypes: C.TEXAS_DIRTY_SUMMER_RESERVOIR_FLIES,
  });
  addLargemouthMonths(rows, ["south_central"], "freshwater_lake_pond", [8], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["compact_flipping_jig", "football_jig"],
    viable_lure_archetypes: C.TEXAS_SUMMER_RESERVOIR_CONTROL_LURES,
    primary_fly_archetypes: ["woolly_bugger", "crawfish_streamer"],
    viable_fly_archetypes: C.TEXAS_SUMMER_RESERVOIR_CONTROL_FLIES,
  });
  addLargemouthMonths(
    rows,
    ["south_central"],
    "freshwater_lake_pond",
    [9, 10],
    {
      surface_seasonally_possible: false,
      base_water_column: "mid",
      base_mood: "neutral",
      base_presentation_style: "balanced",
      primary_forage: "baitfish",
      secondary_forage: "crawfish",
      primary_lure_archetypes: ["squarebill_crankbait", "paddle_tail_swimbait"],
      viable_lure_archetypes: C.SOUTH_CENTRAL_FALL_TRANSITION_LAKE_LURES,
      primary_fly_archetypes: ["clouser_minnow", "game_changer"],
      viable_fly_archetypes: C.SOUTH_CENTRAL_FALL_TRANSITION_LAKE_FLIES,
    },
  );
  addLargemouthMonths(rows, ["south_central"], "freshwater_river", [1], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
    viable_lure_archetypes: C.SOUTH_CENTRAL_WINTER_RIVER_LURES,
    primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
    viable_fly_archetypes: C.SOUTH_CENTRAL_WINTER_RIVER_FLIES,
  });
  addLargemouthMonths(rows, ["south_central"], "freshwater_river", [2, 4], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["spinnerbait", "swim_jig", "soft_jerkbait"],
    viable_lure_archetypes: C.SOUTH_CENTRAL_PRESPAWN_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.SOUTH_CENTRAL_PRESPAWN_RIVER_FLIES,
  });
  addLargemouthMonths(rows, ["south_central"], "freshwater_river", [6, 8], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "compact_flipping_jig"],
    viable_lure_archetypes: C.SOUTH_CENTRAL_SUMMER_RIVER_LURES,
    primary_fly_archetypes: ["game_changer", "woolly_bugger"],
    viable_fly_archetypes: C.SOUTH_CENTRAL_SUMMER_RIVER_FLIES,
  });
  addLargemouthMonths(rows, ["south_central"], "freshwater_river", [11], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.SOUTH_CENTRAL_FALL_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.SOUTH_CENTRAL_FALL_RIVER_FLIES,
  });
  addLargemouthMonths(rows, ["south_central"], "freshwater_river", [12], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["compact_flipping_jig", "suspending_jerkbait"],
    viable_lure_archetypes: C.SOUTH_CENTRAL_WINTER_RIVER_LURES,
    primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
    viable_fly_archetypes: C.SOUTH_CENTRAL_WINTER_RIVER_FLIES,
  });
  addLargemouthMonths(rows, ["south_central"], "freshwater_river", [3], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["spinnerbait", "swim_jig", "soft_jerkbait"],
    viable_lure_archetypes: C.CURRENT_SEAM_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.CURRENT_SEAM_RIVER_FLIES,
  });
  addLargemouthMonths(rows, ["south_central"], "freshwater_river", [9], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: [
      "spinnerbait",
      "paddle_tail_swimbait",
      "squarebill_crankbait",
    ],
    viable_lure_archetypes: C.CURRENT_SEAM_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.CURRENT_SEAM_RIVER_FLIES,
  });
  addLargemouthMonths(rows, ["south_central"], "freshwater_river", [7], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "swim_jig", "soft_jerkbait"],
    viable_lure_archetypes: C.SUMMER_CURRENT_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer", "popper_fly"],
    viable_fly_archetypes: C.SUMMER_CURRENT_RIVER_FLIES,
  });
  addLargemouthMonths(rows, ["gulf_coast"], "freshwater_lake_pond", [11], {
    surface_seasonally_possible: true,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["bladed_jig", "spinnerbait"],
    viable_lure_archetypes: C.GULF_LATE_FALL_GRASS_LAKE_LURES,
    primary_fly_archetypes: ["game_changer", "clouser_minnow"],
    viable_fly_archetypes: C.GULF_LATE_FALL_GRASS_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["gulf_coast"], "freshwater_lake_pond", [3], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "leaning_bold",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["lipless_crankbait", "spinnerbait"],
    viable_lure_archetypes: C.GULF_DIRTY_PRESPAWN_GRASS_LAKE_LURES,
    primary_fly_archetypes: ["game_changer", "clouser_minnow"],
    viable_fly_archetypes: C.GULF_DIRTY_PRESPAWN_GRASS_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["northeast"], "freshwater_lake_pond", [1], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: [
      "suspending_jerkbait",
      "flat_sided_crankbait",
      "football_jig",
    ],
    viable_lure_archetypes: C.NORTHERN_CLEAR_WINTER_LAKE_LURES,
    primary_fly_archetypes: ["rabbit_strip_leech", "sculpin_streamer"],
    viable_fly_archetypes: C.NORTHERN_CLEAR_WINTER_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["northeast"], "freshwater_lake_pond", [2], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "leaning_subtle",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: [
      "suspending_jerkbait",
      "paddle_tail_swimbait",
      "football_jig",
    ],
    viable_lure_archetypes: C.NORTHERN_CLEAR_PRESPAWN_CRANK_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "rabbit_strip_leech"],
    viable_fly_archetypes: C.PRESPAWN_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["northeast"], "freshwater_lake_pond", [4, 5], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["weightless_stick_worm", "compact_flipping_jig"],
    viable_lure_archetypes: C.NORTHERN_CLEAR_SPAWN_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "clouser_minnow"],
    viable_fly_archetypes: C.NORTHERN_CLEAR_SPAWN_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["northeast"], "freshwater_lake_pond", [6, 7], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral_subtle",
    base_presentation_style: "leaning_subtle",
    primary_forage: "bluegill_perch",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["weightless_stick_worm", "drop_shot_worm"],
    viable_lure_archetypes: C.NORTHERN_CLEAR_SUMMER_LAKE_LURES,
    primary_fly_archetypes: ["clouser_minnow", "balanced_leech"],
    viable_fly_archetypes: C.NORTHERN_CLEAR_SUMMER_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["northeast"], "freshwater_lake_pond", [8], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["soft_jerkbait", "drop_shot_worm"],
    viable_lure_archetypes: C.LATE_SUMMER_CLEAR_LAKE_LURES,
    primary_fly_archetypes: ["game_changer", "woolly_bugger"],
    viable_fly_archetypes: C.LATE_SUMMER_CLEAR_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["northeast"], "freshwater_lake_pond", [9, 10], {
    surface_seasonally_possible: true,
    base_water_column: "mid",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: [
      "spinnerbait",
      "swim_jig",
      "paddle_tail_swimbait",
    ],
    viable_lure_archetypes: C.NORTHERN_CLEAR_FALL_LAKE_LURES,
    primary_fly_archetypes: ["game_changer", "clouser_minnow"],
    viable_fly_archetypes: C.NORTHERN_CLEAR_FALL_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["northeast"], "freshwater_lake_pond", [11], {
    surface_seasonally_possible: true,
    base_water_column: "mid",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "swim_jig"],
    viable_lure_archetypes: C.NORTHERN_CLEAR_FALL_LAKE_LURES,
    primary_fly_archetypes: ["game_changer", "clouser_minnow"],
    viable_fly_archetypes: C.NORTHERN_CLEAR_FALL_LAKE_FLIES,
  });
  // Northeast March: water is still mid-40s°F — cold-clear prespawn calls for the same
  // finesse/crankbait window that Great Lakes gets rather than the generic fast-search
  // C.PRESPAWN_LAKE_LURES that the shared C.NORTHERN_REGIONS base row would otherwise apply.
  addLargemouthMonths(rows, ["northeast"], "freshwater_lake_pond", [3], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "leaning_subtle",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: [
      "suspending_jerkbait",
      "paddle_tail_swimbait",
      "football_jig",
    ],
    viable_lure_archetypes: C.NORTHERN_CLEAR_PRESPAWN_CRANK_LAKE_LURES,
    primary_fly_archetypes: ["rabbit_strip_leech", "sculpin_streamer"],
    viable_fly_archetypes: C.NORTHERN_CLEAR_WINTER_LAKE_FLIES,
  });
  addLargemouthMonths(rows, ["northeast"], "freshwater_lake_pond", [12], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: [
      "suspending_jerkbait",
      "flat_sided_crankbait",
      "football_jig",
    ],
    viable_lure_archetypes: C.NORTHERN_CLEAR_WINTER_LAKE_LURES,
    primary_fly_archetypes: ["rabbit_strip_leech", "sculpin_streamer"],
    viable_fly_archetypes: C.NORTHERN_CLEAR_WINTER_LAKE_FLIES,
  });
  addLargemouthMonths(
    rows,
    ["great_lakes_upper_midwest"],
    "freshwater_lake_pond",
    [5],
    {
      surface_seasonally_possible: false,
      base_water_column: "shallow",
      base_mood: "neutral",
      base_presentation_style: "balanced",
      primary_forage: "leech_worm",
      secondary_forage: "baitfish",
      primary_lure_archetypes: ["weightless_stick_worm", "swim_jig"],
      viable_lure_archetypes: C.NORTHERN_CLEAR_SPAWN_LAKE_LURES,
      primary_fly_archetypes: ["woolly_bugger", "clouser_minnow"],
      viable_fly_archetypes: C.NORTHERN_CLEAR_SPAWN_LAKE_FLIES,
    },
  );
  addLargemouthMonths(
    rows,
    ["great_lakes_upper_midwest"],
    "freshwater_lake_pond",
    [1, 2],
    {
      surface_seasonally_possible: false,
      base_water_column: "bottom",
      base_mood: "negative",
      base_presentation_style: "leaning_subtle",
      primary_forage: "baitfish",
      secondary_forage: "crawfish",
      primary_lure_archetypes: ["suspending_jerkbait", "flat_sided_crankbait"],
      viable_lure_archetypes: C.NORTHERN_CLEAR_WINTER_LAKE_LURES,
      primary_fly_archetypes: ["rabbit_strip_leech", "sculpin_streamer"],
      viable_fly_archetypes: C.NORTHERN_CLEAR_WINTER_LAKE_FLIES,
    },
  );
  addLargemouthMonths(
    rows,
    ["great_lakes_upper_midwest"],
    "freshwater_lake_pond",
    [4],
    {
      surface_seasonally_possible: false,
      base_water_column: "shallow",
      base_mood: "neutral",
      base_presentation_style: "leaning_subtle",
      primary_forage: "leech_worm",
      secondary_forage: "baitfish",
      primary_lure_archetypes: ["weightless_stick_worm"],
      viable_lure_archetypes: C.NORTHERN_CLEAR_SPAWN_LAKE_LURES,
      primary_fly_archetypes: ["woolly_bugger", "clouser_minnow"],
      viable_fly_archetypes: C.NORTHERN_CLEAR_SPAWN_LAKE_FLIES,
    },
  );
  addLargemouthMonths(
    rows,
    ["great_lakes_upper_midwest"],
    "freshwater_lake_pond",
    [6, 7],
    {
      surface_seasonally_possible: false,
      base_water_column: "mid",
      base_mood: "neutral_subtle",
      base_presentation_style: "leaning_subtle",
      primary_forage: "leech_worm",
      secondary_forage: "baitfish",
      primary_lure_archetypes: [
        "weightless_stick_worm",
        "drop_shot_worm",
        "soft_jerkbait",
      ],
      viable_lure_archetypes: C.NORTHERN_CLEAR_SUMMER_LAKE_LURES,
      primary_fly_archetypes: ["clouser_minnow", "balanced_leech"],
      viable_fly_archetypes: C.NORTHERN_CLEAR_SUMMER_LAKE_FLIES,
    },
  );
  addLargemouthMonths(
    rows,
    ["great_lakes_upper_midwest"],
    "freshwater_lake_pond",
    [8],
    {
      surface_seasonally_possible: true,
      base_water_column: "shallow",
      base_mood: "active",
      base_presentation_style: "balanced",
      primary_forage: "baitfish",
      secondary_forage: "bluegill_perch",
      primary_lure_archetypes: ["swim_jig", "weightless_stick_worm"],
      viable_lure_archetypes: C.MN_WEED_LAKE_SUMMER_LURES,
      primary_fly_archetypes: ["game_changer", "woolly_bugger"],
      viable_fly_archetypes: C.SUMMER_LAKE_FLIES,
    },
  );
  addLargemouthMonths(
    rows,
    ["great_lakes_upper_midwest"],
    "freshwater_lake_pond",
    [10],
    {
      surface_seasonally_possible: true,
      base_water_column: "shallow",
      base_mood: "active",
      base_presentation_style: "balanced",
      primary_forage: "baitfish",
      secondary_forage: "bluegill_perch",
      primary_lure_archetypes: [
        "spinnerbait",
        "swim_jig",
        "paddle_tail_swimbait",
      ],
      viable_lure_archetypes: C.NORTHERN_CLEAR_FALL_LAKE_LURES,
      primary_fly_archetypes: ["game_changer", "clouser_minnow"],
      viable_fly_archetypes: C.NORTHERN_CLEAR_FALL_LAKE_FLIES,
    },
  );
  addLargemouthMonths(
    rows,
    ["great_lakes_upper_midwest"],
    "freshwater_lake_pond",
    [11],
    {
      surface_seasonally_possible: true,
      base_water_column: "mid",
      base_mood: "active",
      base_presentation_style: "balanced",
      primary_forage: "baitfish",
      secondary_forage: "bluegill_perch",
      primary_lure_archetypes: ["spinnerbait", "swim_jig"],
      viable_lure_archetypes: C.NORTHERN_CLEAR_FALL_LAKE_LURES,
      primary_fly_archetypes: ["game_changer", "clouser_minnow"],
      viable_fly_archetypes: C.NORTHERN_CLEAR_FALL_LAKE_FLIES,
    },
  );
  addLargemouthMonths(rows, ["south_central"], "freshwater_lake_pond", [11], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["suspending_jerkbait", "football_jig"],
    viable_lure_archetypes: C.SOUTH_CENTRAL_LATEFALL_RESERVOIR_LURES,
    primary_fly_archetypes: ["balanced_leech", "woolly_bugger"],
    viable_fly_archetypes: C.SOUTH_CENTRAL_LATEFALL_RESERVOIR_FLIES,
  });
  addLargemouthMonths(rows, ["south_central"], "freshwater_lake_pond", [12], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: [
      "suspending_jerkbait",
      "flat_sided_crankbait",
      "football_jig",
    ],
    viable_lure_archetypes: C.SOUTH_CENTRAL_LATEFALL_RESERVOIR_LURES,
    primary_fly_archetypes: ["balanced_leech", "woolly_bugger"],
    viable_fly_archetypes: C.SOUTH_CENTRAL_LATEFALL_RESERVOIR_FLIES,
  });
  addLargemouthMonths(rows, ["northern_california"], "freshwater_river", [3], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["soft_jerkbait", "compact_flipping_jig"],
    viable_lure_archetypes: C.DELTA_CLEAR_PRESPAWN_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.DELTA_CLEAR_PRESPAWN_RIVER_FLIES,
  });
  addLargemouthMonths(rows, ["northern_california"], "freshwater_river", [11], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["bladed_jig", "suspending_jerkbait"],
    viable_lure_archetypes: C.DELTA_LATE_FALL_RIVER_LURES,
    primary_fly_archetypes: ["balanced_leech", "game_changer"],
    viable_fly_archetypes: C.DELTA_LATE_FALL_RIVER_FLIES,
  });
  addLargemouthMonths(rows, ["northern_california"], "freshwater_river", [6], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["swim_jig", "spinnerbait"],
    viable_lure_archetypes: C.DELTA_SUMMER_RIVER_LURES,
    primary_fly_archetypes: ["frog_fly", "game_changer"],
    viable_fly_archetypes: C.DELTA_SUMMER_RIVER_FLIES,
  });
  addLargemouthMonths(rows, ["northern_california"], "freshwater_river", [9], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["bladed_jig", "compact_flipping_jig"],
    viable_lure_archetypes: C.DELTA_FALL_TRANSITION_RIVER_LURES,
    primary_fly_archetypes: ["rabbit_strip_leech", "game_changer"],
    viable_fly_archetypes: C.DELTA_FALL_TRANSITION_RIVER_FLIES,
  });

  // Florida January: baitfish forage lets suspending beat football jig in this row.
  addLargemouthMonths(rows, ["florida"], "freshwater_lake_pond", [1], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: [
      "texas_rigged_soft_plastic_craw",
      "suspending_jerkbait",
    ],
    viable_lure_archetypes: C.FLORIDA_WINTER_CONTROL_LAKE_LURES,
    primary_fly_archetypes: ["crawfish_streamer", "woolly_bugger"],
    viable_fly_archetypes: C.FLORIDA_WINTER_CONTROL_LAKE_FLIES,
  });

  // Great Lakes / upper Midwest March prespawn: cold-clear rock transitions give
  // a flat-sided crank one true late-winter window before the faster baitfish
  // lanes take over.
  addLargemouthMonths(
    rows,
    ["great_lakes_upper_midwest"],
    "freshwater_lake_pond",
    [3],
    {
      surface_seasonally_possible: false,
      base_water_column: "mid",
      base_mood: "neutral",
      base_presentation_style: "leaning_subtle",
      primary_forage: "crawfish",
      secondary_forage: "baitfish",
      primary_lure_archetypes: ["flat_sided_crankbait", "suspending_jerkbait"],
      viable_lure_archetypes: C.NORTHERN_CLEAR_PRESPAWN_CRANK_LAKE_LURES,
      primary_fly_archetypes: ["rabbit_strip_leech", "sculpin_streamer"],
      viable_fly_archetypes: C.NORTHERN_CLEAR_WINTER_LAKE_FLIES,
    },
  );

  // South-central October current and shad push: Deceiver gets a real fall chase
  // lane without replacing the broader game-changer pool elsewhere.
  addLargemouthMonths(rows, ["south_central"], "freshwater_river", [10], {
    surface_seasonally_possible: false,
    base_water_column: "mid",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["spinnerbait", "paddle_tail_swimbait"],
    viable_lure_archetypes: C.SOUTH_CENTRAL_FALL_RIVER_LURES,
    primary_fly_archetypes: ["deceiver", "game_changer"],
    viable_fly_archetypes: C.SOUTH_CENTRAL_FALL_RIVER_FLIES,
  });

  // Upper Midwest July needs a bounded midsummer row: keep the swim-jig/frog
  // story available for weed lakes, but avoid forcing open topwater into clearer
  // natural-lake cases that should still resolve subsurface first.
  addLargemouthMonths(
    rows,
    ["great_lakes_upper_midwest"],
    "freshwater_lake_pond",
    [7],
    {
      surface_seasonally_possible: true,
      base_water_column: "mid",
      base_mood: "neutral",
      base_presentation_style: "balanced",
      primary_forage: "baitfish",
      secondary_forage: "bluegill_perch",
      primary_lure_archetypes: [
        "swim_jig",
        "paddle_tail_swimbait",
        "weightless_stick_worm",
      ],
      viable_lure_archetypes: C.GL_CLEAR_WEED_JULY_LEDGE_LURES,
      primary_fly_archetypes: ["game_changer", "frog_fly"],
      viable_fly_archetypes: C.NORTHERN_WEED_EARLY_SUMMER_LAKE_FLIES,
    },
  );

  // Florida May shallow cover: keep the texas-rig winner window intact, but let
  // frog earn real low-light pull as the secondary surface option.
  addLargemouthMonths(rows, ["florida"], "freshwater_lake_pond", [5], {
    surface_seasonally_possible: true,
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "leech_worm",
    secondary_forage: "baitfish",
    primary_lure_archetypes: [
      "weightless_stick_worm",
      "hollow_body_frog",
      "swim_jig",
    ],
    viable_lure_archetypes: C.FLORIDA_MAY_SHALLOW_COVER_LAKE_LURES,
    primary_fly_archetypes: ["woolly_bugger", "frog_fly"],
    viable_fly_archetypes: C.FLORIDA_POSTSPAWN_SHALLOW_LAKE_FLIES,
  });
  addLargemouthMonths(
    rows,
    ["pacific_northwest"],
    "freshwater_lake_pond",
    [8],
    {
      surface_seasonally_possible: true,
      base_water_column: "mid",
      base_mood: "neutral",
      base_presentation_style: "balanced",
      primary_forage: "baitfish",
      secondary_forage: "bluegill_perch",
      primary_lure_archetypes: [
        "swim_jig",
        "hollow_body_frog",
        "paddle_tail_swimbait",
      ],
      viable_lure_archetypes: [
        "swim_jig",
        "hollow_body_frog",
        "paddle_tail_swimbait",
        "soft_jerkbait",
        "bladed_jig",
        "spinnerbait",
      ],
      primary_fly_archetypes: ["game_changer", "clouser_minnow"],
      viable_fly_archetypes: C.SUMMER_LAKE_FLIES,
    },
  );
  addLargemouthMonths(rows, ["southern_california"], "freshwater_lake_pond", [
    7,
  ], {
    surface_seasonally_possible: true,
    base_water_column: "top",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    primary_lure_archetypes: ["swim_jig", "hollow_body_frog"],
    viable_lure_archetypes: C.SUMMER_LAKE_LURES,
    primary_fly_archetypes: ["frog_fly", "game_changer"],
    viable_fly_archetypes: C.SUMMER_LAKE_FLIES,
  });

  // Southern California winter largemouth stay more reservoir-like than the
  // broader western winter row and need an explicit finesse/jerkbait pool.
  addLargemouthMonths(rows, ["southern_california"], "freshwater_lake_pond", [
    1,
  ], {
    surface_seasonally_possible: false,
    base_water_column: "bottom",
    base_mood: "negative",
    base_presentation_style: "leaning_subtle",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["football_jig", "suspending_jerkbait"],
    viable_lure_archetypes: C.SOCAL_MILD_WINTER_RESERVOIR_LURES,
    primary_fly_archetypes: ["balanced_leech", "woolly_bugger"],
    viable_fly_archetypes: C.SOCAL_MILD_WINTER_RESERVOIR_FLIES,
  });

  // Upper Midwest August needs a cleaner compromise row than the broad weed-lake
  // surface pool. Keep weed-friendly horizontal options, but remove the open
  // topwater leak that showed up in clear-lake audits.
  addLargemouthMonths(
    rows,
    ["great_lakes_upper_midwest"],
    "freshwater_lake_pond",
    [8],
    {
      surface_seasonally_possible: false,
      base_water_column: "mid",
      base_mood: "neutral",
      base_presentation_style: "balanced",
      primary_forage: "baitfish",
      secondary_forage: "bluegill_perch",
      primary_lure_archetypes: ["swim_jig", "weightless_stick_worm"],
      viable_lure_archetypes: [
        "swim_jig",
        "weightless_stick_worm",
        "paddle_tail_swimbait",
        "soft_jerkbait",
        "drop_shot_worm",
      ],
      primary_fly_archetypes: ["game_changer", "woolly_bugger"],
      viable_fly_archetypes: C.LATE_SUMMER_CLEAR_LAKE_FLIES,
    },
  );

  // Midwest backwater rivers open earlier than the generic cold-river row.
  addLargemouthMonths(rows, ["midwest_interior"], "freshwater_river", [3], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["spinnerbait", "bladed_jig"],
    viable_lure_archetypes: C.MIDWEST_BACKWATER_PRESPAWN_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: C.MIDWEST_BACKWATER_PRESPAWN_RIVER_FLIES,
  });
  addLargemouthMonths(rows, ["midwest_interior"], "freshwater_river", [11], {
    surface_seasonally_possible: false,
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["compact_flipping_jig", "spinnerbait"],
    viable_lure_archetypes: C.MIDWEST_BACKWATER_FALL_RIVER_LURES,
    primary_fly_archetypes: ["clouser_minnow", "deceiver"],
    viable_fly_archetypes: C.MIDWEST_BACKWATER_FALL_RIVER_FLIES,
  });
}
