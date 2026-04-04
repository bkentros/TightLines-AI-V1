import type {
  ArchivedRecommenderAuditScenario,
  RecommenderAuditExpectation,
  RecommenderAuditRegionPriority,
} from "../recommenderCalibrationScenarios.ts";
import type { ColorThemeIdV3, RecommenderV3ArchetypeId } from "../../supabase/functions/_shared/recommenderEngine/index.ts";
import { LARGEMOUTH_FULL_AUDIT_MATRIX, type LargemouthAuditAnchorKey, type LargemouthMatrixScenario } from "./largemouthAuditMatrix.ts";

function priorityFor(role: LargemouthMatrixScenario["matrix_role"]): RecommenderAuditRegionPriority {
  return role === "core_monthly" ? "core" : "secondary";
}

function colorSet(...themes: ColorThemeIdV3[]): ColorThemeIdV3[] {
  return themes;
}

function expectation(
  seasonal_story: string,
  primary_lanes: RecommenderV3ArchetypeId[],
  acceptable_secondary_lanes: RecommenderV3ArchetypeId[],
  expected_color_lanes: ColorThemeIdV3[],
  disallowed_lanes: RecommenderV3ArchetypeId[] = [],
): RecommenderAuditExpectation {
  return {
    seasonal_story,
    primary_lanes,
    acceptable_secondary_lanes,
    disallowed_lanes,
    expected_color_lanes,
  };
}

function clearColors(): ColorThemeIdV3[] {
  return colorSet("natural_baitfish", "white_shad", "green_pumpkin_natural");
}

function stainedColors(): ColorThemeIdV3[] {
  return colorSet("white_shad", "bright_contrast", "green_pumpkin_natural");
}

function dirtyColors(): ColorThemeIdV3[] {
  return colorSet("dark_contrast", "bright_contrast", "craw_natural");
}

function floridaLakeExpectation(focus: string, clarity: LargemouthMatrixScenario["default_clarity"]): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Florida winter largemouth should stay in a controlled lower-column lane with only mild daily openings.",
        ["football_jig", "texas_rigged_soft_plastic_craw", "suspending_jerkbait"],
        ["compact_flipping_jig", "shaky_head_worm", "paddle_tail_swimbait"],
        clarity === "clear" ? clearColors() : stainedColors(),
        ["walking_topwater", "hollow_body_frog", "mouse_fly"],
      );
    case "prespawn_opening":
      return expectation(
        "Florida prespawn largemouth should open moving baitfish lanes without abandoning controlled shallow cover options.",
        ["suspending_jerkbait", "paddle_tail_swimbait", "spinnerbait"],
        ["compact_flipping_jig", "swim_jig", "football_jig"],
        stainedColors(),
        ["hollow_body_frog", "mouse_fly"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Florida spawn and immediate postspawn should stay shallow and target-oriented first, with one clean baitfish follow-up lane.",
        ["weightless_stick_worm", "wacky_rigged_stick_worm", "compact_flipping_jig"],
        ["swim_jig", "paddle_tail_swimbait", "woolly_bugger"],
        clarity === "clear" ? colorSet("watermelon_natural", "green_pumpkin_natural", "natural_baitfish") : stainedColors(),
        ["blade_bait", "hollow_body_frog"],
      );
    case "summer_positioning":
      return expectation(
        "Warm-season Florida largemouth should lean grass, cover, and surface-adjacent lanes rather than winter-style control tools.",
        ["hollow_body_frog", "swim_jig", "buzzbait_prop_bait"],
        ["compact_flipping_jig", "texas_rigged_stick_worm", "frog_fly"],
        clarity === "dirty" ? colorSet("frog_natural", "dark_contrast", "craw_natural") : colorSet("frog_natural", "white_shad", "dark_contrast"),
        ["blade_bait", "drop_shot_worm_minnow", "suspending_jerkbait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Florida fall largemouth should allow stronger shallow baitfish and grass-cover options than the summer slowdown windows.",
        ["walking_topwater", "swim_jig", "spinnerbait"],
        ["bladed_jig", "hollow_body_frog", "paddle_tail_swimbait"],
        colorSet("frog_natural", "white_shad", "bright_contrast"),
        ["blade_bait"],
      );
  }
}

function texasReservoirExpectation(focus: string, clarity: LargemouthMatrixScenario["default_clarity"]): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "South-central winter reservoir largemouth should stay lower and controlled, with jerkbait or flat-side still in play when conditions allow.",
        ["football_jig", "suspending_jerkbait", "flat_sided_crankbait"],
        ["shaky_head_worm", "texas_rigged_soft_plastic_craw", "rabbit_strip_leech"],
        clarity === "dirty" ? dirtyColors() : colorSet("green_pumpkin_natural", "white_shad", "dark_contrast"),
        ["walking_topwater", "hollow_body_frog"],
      );
    case "prespawn_opening":
      return expectation(
        "South-central prespawn reservoirs should open baitfish lanes, but still stay bounded inside a late-winter / early-spring largemouth posture.",
        ["spinnerbait", "suspending_jerkbait", "paddle_tail_swimbait"],
        ["football_jig", "bladed_jig", "swim_jig"],
        stainedColors(),
        ["hollow_body_frog", "popper_fly"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Texas spawn-to-postspawn largemouth should balance target fishing with one or two clean horizontal follow-up lanes.",
        ["compact_flipping_jig", "wacky_rigged_stick_worm", "swim_jig"],
        ["weightless_stick_worm", "paddle_tail_swimbait", "soft_jerkbait"],
        colorSet("green_pumpkin_natural", "white_shad", "watermelon_natural"),
        ["blade_bait", "walking_topwater"],
      );
    case "summer_positioning":
      return expectation(
        "Summer reservoirs should favor brush, structure, and visible control lanes over clear-water finesse or cold-water reaction tools.",
        ["compact_flipping_jig", "football_jig", "deep_diving_crankbait"],
        ["texas_rigged_soft_plastic_craw", "spinnerbait", "swim_jig"],
        clarity === "dirty" ? dirtyColors() : stainedColors(),
        ["drop_shot_worm_minnow", "weightless_stick_worm", "blade_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Late-fall south-central reservoir bass should tighten around slower baitfish lanes with bottom-control backups still in play.",
        ["suspending_jerkbait", "flat_sided_crankbait", "football_jig"],
        ["paddle_tail_swimbait", "shaky_head_worm", "rabbit_strip_leech"],
        colorSet("natural_baitfish", "white_shad", "green_pumpkin_natural"),
        ["walking_topwater", "hollow_body_frog"],
      );
  }
}

function alabamaRiverExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Winter river largemouth should stay current-aware and controlled, not drift into lake-only or ultra-finesse nonsense.",
        ["compact_flipping_jig", "suspending_jerkbait", "shaky_head_worm"],
        ["tube_jig", "squarebill_crankbait", "rabbit_strip_leech"],
        stainedColors(),
        ["hollow_body_frog", "walking_topwater"],
      );
    case "prespawn_opening":
      return expectation(
        "Prespawn river largemouth should use current seams and softer edges with moving river-specific search lanes.",
        ["spinnerbait", "swim_jig", "soft_jerkbait"],
        ["squarebill_crankbait", "texas_rigged_soft_plastic_craw", "clouser_minnow"],
        stainedColors(),
        ["hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Spring river largemouth should still fish like river bass, with moving seam lanes and one controlled backup.",
        ["spinnerbait", "swim_jig", "squarebill_crankbait"],
        ["soft_jerkbait", "paddle_tail_swimbait", "compact_flipping_jig"],
        stainedColors(),
        ["hollow_body_frog"],
      );
    case "summer_positioning":
      return expectation(
        "Summer river largemouth should lean current-edge, shade, and ambush lanes rather than generic lake finesse.",
        ["swim_jig", "spinnerbait", "soft_jerkbait"],
        ["squarebill_crankbait", "texas_rigged_stick_worm", "clouser_minnow"],
        stainedColors(),
        ["drop_shot_worm_minnow", "blade_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Fall river largemouth should open horizontal baitfish lanes around current edges without losing river-specific control.",
        ["spinnerbait", "paddle_tail_swimbait", "squarebill_crankbait"],
        ["bladed_jig", "soft_jerkbait", "clouser_minnow"],
        colorSet("white_shad", "bright_contrast", "natural_baitfish"),
        ["drop_shot_worm_minnow"],
      );
  }
}

function newYorkLakeExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Northern clear-water winter largemouth should stay disciplined around jerkbait, flat-side, and jig lanes.",
        ["suspending_jerkbait", "flat_sided_crankbait", "football_jig"],
        ["paddle_tail_swimbait", "drop_shot_worm_minnow", "clouser_minnow"],
        colorSet("natural_baitfish", "white_shad", "green_pumpkin_natural"),
        ["walking_topwater", "hollow_body_frog"],
      );
    case "prespawn_opening":
      return expectation(
        "Northern prespawn largemouth should open carefully with cleaner baitfish and control lanes, not jump too shallow too fast.",
        ["suspending_jerkbait", "paddle_tail_swimbait", "football_jig"],
        ["flat_sided_crankbait", "drop_shot_worm_minnow", "rabbit_strip_leech"],
        clearColors(),
        ["hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Spawn and immediate postspawn in clear northern lakes should lean shallow target-fishing and one clean follow-up baitfish lane.",
        ["weightless_stick_worm", "wacky_rigged_stick_worm", "swim_jig"],
        ["paddle_tail_swimbait", "soft_jerkbait", "woolly_bugger"],
        colorSet("watermelon_natural", "green_pumpkin_natural", "natural_baitfish"),
        ["blade_bait"],
      );
    case "summer_positioning":
      return expectation(
        "Summer clear northern largemouth should tighten into cleaner finesse and edge lanes, with only measured surface options.",
        ["wacky_rigged_stick_worm", "weightless_stick_worm", "drop_shot_worm_minnow"],
        ["shaky_head_worm", "soft_jerkbait", "walking_topwater"],
        colorSet("watermelon_natural", "green_pumpkin_natural", "natural_baitfish"),
        ["buzzbait_prop_bait", "blade_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Northern fall largemouth should respect baitfish transition lanes without collapsing into only one moving bait.",
        ["spinnerbait", "paddle_tail_swimbait", "squarebill_crankbait"],
        ["soft_jerkbait", "suspending_jerkbait", "game_changer"],
        colorSet("white_shad", "natural_baitfish", "metal_flash"),
        ["texas_rigged_soft_plastic_craw"],
      );
  }
}

function georgiaHighlandExpectation(focus: string): RecommenderAuditExpectation {
  if (focus === "winter_control") {
    return newYorkLakeExpectation("winter_control");
  }
  if (focus === "prespawn_opening") {
    return expectation(
      "Clear highland prespawn largemouth should favor baitfish and jerkbait lanes over bulky shallow cover reads.",
      ["suspending_jerkbait", "flat_sided_crankbait", "paddle_tail_swimbait"],
      ["football_jig", "soft_jerkbait", "clouser_minnow"],
      clearColors(),
      ["hollow_body_frog"],
    );
  }
  if (focus === "summer_positioning") {
    return expectation(
      "Clear highland summer largemouth should stay cleaner and slightly deeper than dirty lowland systems.",
      ["soft_jerkbait", "paddle_tail_swimbait", "swim_jig"],
      ["drop_shot_worm_minnow", "wacky_rigged_stick_worm", "game_changer"],
      clearColors(),
      ["buzzbait_prop_bait"],
    );
  }
  return expectation(
    "Highland fall largemouth should center on shad-oriented moving lanes with a clean backup option.",
    ["squarebill_crankbait", "spinnerbait", "paddle_tail_swimbait"],
    ["soft_jerkbait", "suspending_jerkbait", "game_changer"],
    colorSet("white_shad", "natural_baitfish", "metal_flash"),
    ["hollow_body_frog"],
  );
}

function louisianaGrassExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "prespawn_opening":
      return expectation(
        "Dirty-to-stained southern prespawn grass bass should open visible grass and baitfish lanes without turning into winter bottom dragging.",
        ["spinnerbait", "bladed_jig", "compact_flipping_jig"],
        ["swim_jig", "paddle_tail_swimbait", "game_changer"],
        dirtyColors(),
        ["drop_shot_worm_minnow", "walking_topwater"],
      );
    case "summer_positioning":
      return expectation(
        "Warm southern grass largemouth should lean frog, swim-jig, and other cover/surface-adjacent lanes.",
        ["hollow_body_frog", "swim_jig", "buzzbait_prop_bait"],
        ["compact_flipping_jig", "texas_rigged_stick_worm", "frog_fly"],
        colorSet("frog_natural", "white_shad", "dark_contrast"),
        ["blade_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Southern grass fall largemouth should still favor visible shallow cover and horizontal baitfish lanes over dead-winter behavior.",
        ["bladed_jig", "spinnerbait", "swim_jig"],
        ["hollow_body_frog", "paddle_tail_swimbait", "rabbit_strip_leech"],
        colorSet("dark_contrast", "bright_contrast", "frog_natural"),
        ["blade_bait"],
      );
  }
}

function ozarksExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Cold clear inland-reservoir largemouth should stay disciplined around jerkbait, flat-side, and jig lanes.",
        ["suspending_jerkbait", "flat_sided_crankbait", "football_jig"],
        ["paddle_tail_swimbait", "blade_bait", "clouser_minnow"],
        colorSet("natural_baitfish", "white_shad", "craw_natural"),
        ["hollow_body_frog", "walking_topwater"],
      );
    case "prespawn_opening":
      return expectation(
        "Clear Ozarks prespawn largemouth should still be disciplined, with jerkbait and flat-side leading the lane.",
        ["suspending_jerkbait", "flat_sided_crankbait", "football_jig"],
        ["paddle_tail_swimbait", "soft_jerkbait", "clouser_minnow"],
        colorSet("natural_baitfish", "white_shad", "craw_natural"),
        ["hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Postspawn Ozarks largemouth should allow cleaner shad-following lanes with one controlled backup.",
        ["swim_jig", "paddle_tail_swimbait", "soft_jerkbait"],
        ["suspending_jerkbait", "wacky_rigged_stick_worm", "game_changer"],
        clearColors(),
        ["blade_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Fall Ozarks largemouth should strongly respect shad-transition lanes without collapsing into one moving bait only.",
        ["squarebill_crankbait", "spinnerbait", "paddle_tail_swimbait"],
        ["soft_jerkbait", "suspending_jerkbait", "game_changer"],
        colorSet("white_shad", "natural_baitfish", "metal_flash"),
        ["texas_rigged_soft_plastic_craw"],
      );
  }
}

function minnesotaExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "spawn_postspawn_transition":
      return expectation(
        "Northern weedline largemouth around spawn/postspawn should stay shallow and target-oriented first.",
        ["weightless_stick_worm", "wacky_rigged_stick_worm", "swim_jig"],
        ["paddle_tail_swimbait", "soft_jerkbait", "woolly_bugger"],
        clearColors(),
        ["blade_bait"],
      );
    case "summer_positioning":
      return expectation(
        "Northern weedline summer largemouth should allow edge and occasional surface lanes, but still through a bass-season lens.",
        ["swim_jig", "walking_topwater", "weightless_stick_worm"],
        ["hollow_body_frog", "mouse_fly", "paddle_tail_swimbait"],
        colorSet("frog_natural", "green_pumpkin_natural", "natural_baitfish"),
        ["blade_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Northern early-fall weedline largemouth should open horizontal edge lanes and a surface option, but through a cooler seasonal posture.",
        ["spinnerbait", "swim_jig", "walking_topwater"],
        ["paddle_tail_swimbait", "hollow_body_frog", "mouse_fly"],
        colorSet("white_shad", "frog_natural", "bright_contrast"),
        ["blade_bait"],
      );
  }
}

function deltaExpectation(focus: string, clarity: LargemouthMatrixScenario["default_clarity"]): RecommenderAuditExpectation {
  switch (focus) {
    case "prespawn_opening":
      return expectation(
        "Prespawn Delta largemouth should still respect current and cover, but with cleaner baitfish and target lanes than the stained late-fall version.",
        ["soft_jerkbait", "compact_flipping_jig", "spinnerbait"],
        ["swim_jig", "paddle_tail_swimbait", "game_changer"],
        clarity === "clear" ? clearColors() : stainedColors(),
        ["walking_topwater", "blade_bait"],
      );
    case "summer_positioning":
      return expectation(
        "Summer Delta largemouth should favor grass/current ambush lanes and visible cover tools, not cold-water finesse.",
        ["swim_jig", "spinnerbait", "hollow_body_frog"],
        ["bladed_jig", "compact_flipping_jig", "game_changer"],
        colorSet("frog_natural", "white_shad", "dark_contrast"),
        ["drop_shot_worm_minnow", "blade_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Fall Delta largemouth should still need visible horizontal or cover-oriented lanes rather than generic winter bottom reads.",
        ["bladed_jig", "compact_flipping_jig", "spinnerbait"],
        ["paddle_tail_swimbait", "rabbit_strip_leech", "game_changer"],
        colorSet("dark_contrast", "bright_contrast", "craw_natural"),
        ["walking_topwater"],
      );
  }
}

function expectationForScenario(scenario: LargemouthMatrixScenario): RecommenderAuditExpectation {
  switch (scenario.anchor_key as LargemouthAuditAnchorKey) {
    case "florida_lake":
      return floridaLakeExpectation(scenario.focus_window, scenario.default_clarity);
    case "texas_reservoir":
      return texasReservoirExpectation(scenario.focus_window, scenario.default_clarity);
    case "alabama_river":
      return alabamaRiverExpectation(scenario.focus_window);
    case "new_york_natural_lake":
      return newYorkLakeExpectation(scenario.focus_window);
    case "georgia_highland":
      return georgiaHighlandExpectation(scenario.focus_window);
    case "louisiana_grass_lake":
      return louisianaGrassExpectation(scenario.focus_window);
    case "ozarks_reservoir":
      return ozarksExpectation(scenario.focus_window);
    case "minnesota_weed_lake":
      return minnesotaExpectation(scenario.focus_window);
    case "california_delta":
      return deltaExpectation(scenario.focus_window, scenario.default_clarity);
  }
}

export const LARGEMOUTH_V3_MATRIX_AUDIT_SCENARIOS: readonly ArchivedRecommenderAuditScenario[] =
  LARGEMOUTH_FULL_AUDIT_MATRIX.map((scenario) => ({
    id: scenario.id,
    label: scenario.label,
    priority: priorityFor(scenario.matrix_role),
    latitude: scenario.latitude,
    longitude: scenario.longitude,
    state_code: scenario.state_code,
    timezone: scenario.timezone,
    local_date: scenario.local_date,
    species: "largemouth_bass",
    context: scenario.context,
    water_clarity: scenario.default_clarity,
    expectation: expectationForScenario(scenario),
  }));
