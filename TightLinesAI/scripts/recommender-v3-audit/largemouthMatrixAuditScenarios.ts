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
        "Fall south-central reservoir bass should chase schooling baitfish with horizontal moving lanes; squarebill and paddle tail lead, suspending as a control backup.",
        ["squarebill_crankbait", "paddle_tail_swimbait", "suspending_jerkbait"],
        ["spinnerbait", "shaky_head_worm", "rabbit_strip_leech"],
        colorSet("white_shad", "natural_baitfish", "green_pumpkin_natural"),
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
        "Northern GLUM-zone summer largemouth: paddle tail and finesse tools lead when conditions press subtle; swim jig leads when conditions open active.",
        ["paddle_tail_swimbait", "drop_shot_worm_minnow", "swim_jig"],
        ["hollow_body_frog", "walking_topwater", "woolly_bugger"],
        clearColors(),
        ["buzzbait_prop_bait", "blade_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Northern fall largemouth should respect baitfish transition lanes with swim jig and paddle tail leading edge fishing.",
        ["swim_jig", "paddle_tail_swimbait", "squarebill_crankbait"],
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
  if (focus === "spawn_postspawn_transition") {
    return expectation(
      "Georgia highland spawn/postspawn largemouth should lean on target cover with compact jigs and shallow finesse.",
      ["compact_flipping_jig", "wacky_rigged_stick_worm", "swim_jig"],
      ["soft_jerkbait", "paddle_tail_swimbait", "woolly_bugger"],
      colorSet("green_pumpkin_natural", "craw_natural", "watermelon_natural"),
      ["hollow_body_frog", "squarebill_crankbait"],
    );
  }
  if (focus === "summer_positioning") {
    return expectation(
      "Clear highland summer largemouth should lean toward deeper structure and cover fishing with finesse backup options.",
      ["compact_flipping_jig", "football_jig", "soft_jerkbait"],
      ["swim_jig", "paddle_tail_swimbait", "game_changer"],
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
        colorSet("white_shad", "frog_natural", "green_pumpkin_natural"),
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

function socalReservoirExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Mild-winter Southern California reservoir largemouth should stay lower-column and controlled; football jig leads active cold days, drop-shot wins when presentation locks fully subtle on the coldest archive days.",
        ["football_jig", "suspending_jerkbait", "flat_sided_crankbait", "drop_shot_worm_minnow"],
        ["compact_flipping_jig", "shaky_head_worm", "paddle_tail_swimbait"],
        stainedColors(),
        ["walking_topwater", "hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      // WESTERN_WARM spawns in May; April is PRESPAWN_LAKE with craw-primary, football_jig leads
      return expectation(
        "April Southern California reservoir largemouth is still building toward spawn; WESTERN_WARM prespawn rows put football jig at the top with craw-first color reads and moving search lanes as backup.",
        ["football_jig", "spinnerbait", "suspending_jerkbait"],
        ["compact_flipping_jig", "swim_jig", "paddle_tail_swimbait"],
        colorSet("green_pumpkin_natural", "craw_natural", "white_shad"),
        ["hollow_body_frog"],
      );
    case "summer_positioning":
      return expectation(
        "SoCal summer reservoir largemouth should be in active shallow-cover mode with topwater, swim jig, and frog lanes leading on warm days.",
        ["walking_topwater", "swim_jig", "hollow_body_frog"],
        ["buzzbait_prop_bait", "paddle_tail_swimbait", "compact_flipping_jig"],
        colorSet("white_shad", "frog_natural", "bright_contrast"),
        ["blade_bait", "drop_shot_worm_minnow"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Fall Southern California reservoir largemouth should open baitfish-chasing lanes with spinnerbait and swim jig leading the horizontal search.",
        ["spinnerbait", "swim_jig", "paddle_tail_swimbait"],
        ["bladed_jig", "walking_topwater", "game_changer"],
        colorSet("white_shad", "bright_contrast", "natural_baitfish"),
        ["blade_bait"],
      );
  }
}

function pnwBassLakeExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "prespawn_opening":
      // WESTERN_INLAND spawns in June; March is PRESPAWN_LAKE, crawfish-primary, football_jig leads
      return expectation(
        "March Pacific Northwest bass lake is deep prespawn; WESTERN_INLAND prespawn row puts football jig on top with crawfish-first color reads and spinnerbait as the open search lane.",
        ["football_jig", "spinnerbait", "suspending_jerkbait"],
        ["compact_flipping_jig", "swim_jig", "paddle_tail_swimbait"],
        colorSet("green_pumpkin_natural", "craw_natural", "white_shad"),
        ["hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      // WESTERN_INLAND spawns in June; May is still PRESPAWN_LAKE (months [3,4,5])
      return expectation(
        "May Pacific Northwest bass lake is late prespawn — WESTERN_INLAND fish don't spawn until June; football jig still leads with craw-first posture, but spinnerbait and swim jig build as activating pre-spawn search lanes.",
        ["football_jig", "spinnerbait", "swim_jig"],
        ["compact_flipping_jig", "paddle_tail_swimbait", "suspending_jerkbait"],
        colorSet("green_pumpkin_natural", "craw_natural", "white_shad"),
        ["hollow_body_frog"],
      );
    case "summer_positioning":
      return expectation(
        "Summer PNW bass lake should be in active shallow mode with topwater and swim jig leading on warm Oregon summer days.",
        ["walking_topwater", "swim_jig", "hollow_body_frog"],
        ["buzzbait_prop_bait", "paddle_tail_swimbait", "bladed_jig"],
        colorSet("white_shad", "frog_natural", "bright_contrast"),
        ["blade_bait", "drop_shot_worm_minnow"],
      );
    case "fall_transition":
    default:
      // November is WINTER_LAKE [11,12] for WESTERN_INLAND; fish in winter posture despite the fall_transition label
      return expectation(
        "November Pacific Northwest bass lake is already in winter posture — WESTERN_INLAND drops into WINTER_LAKE rows at month 11; football jig and jerkbait lead, but blade bait surfaces on neutral-mood overcast days when pressure drops and fish stay slightly active.",
        ["football_jig", "suspending_jerkbait", "flat_sided_crankbait", "blade_bait"],
        ["compact_flipping_jig", "shaky_head_worm", "paddle_tail_swimbait"],
        stainedColors(),
        ["walking_topwater", "hollow_body_frog"],
      );
  }
}

function coloradoBassLakeExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "prespawn_opening":
      // February is WINTER_LAKE [1,2] for mountain_west; prespawn row doesn't open until March
      return expectation(
        "February Colorado highland reservoir largemouth is fully in winter posture — football jig leads most days, but drop-shot wins on the coldest extreme-bottom days when subtle presentation locks in and finesse edges out the jig.",
        ["football_jig", "suspending_jerkbait", "flat_sided_crankbait", "drop_shot_worm_minnow"],
        ["shaky_head_worm", "paddle_tail_swimbait"],
        clearColors(),
        ["walking_topwater", "hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      // WESTERN_INLAND spawns in June; May is still PRESPAWN_LAKE [3,4,5] for mountain_west
      return expectation(
        "May Colorado highland reservoir is late prespawn — mountain_west fish don't spawn until June; football jig leads most days, but texas-rigged craw can edge it out when low-pressure bottoms out presentation and bottom-column focus shifts to a slow-drag finesse.",
        ["football_jig", "texas_rigged_soft_plastic_craw", "spinnerbait", "suspending_jerkbait"],
        ["compact_flipping_jig", "paddle_tail_swimbait", "swim_jig"],
        colorSet("green_pumpkin_natural", "craw_natural", "natural_baitfish"),
        ["hollow_body_frog"],
      );
    case "summer_positioning":
      return expectation(
        "Colorado highland reservoir summer largemouth should be in active mode; topwater and swim jig lead on shallow-surface days, but paddle-tail swimbait takes over when wind and pressure push water column to mid rather than purely shallow.",
        ["walking_topwater", "swim_jig", "hollow_body_frog", "paddle_tail_swimbait"],
        ["buzzbait_prop_bait", "compact_flipping_jig"],
        clearColors(),
        ["blade_bait", "drop_shot_worm_minnow"],
      );
    case "fall_transition":
    default:
      return expectation(
        "October Colorado highland reservoir fall largemouth should open spinnerbait and baitfish-following lanes with clean natural colors.",
        ["spinnerbait", "swim_jig", "paddle_tail_swimbait"],
        ["bladed_jig", "squarebill_crankbait", "game_changer"],
        clearColors(),
        ["blade_bait"],
      );
  }
}

function northeastMaineLakeExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      // NORTHERN_CLEAR_WINTER_LAKE [1,2]: suspending_jerkbait(0), flat_sided_crankbait, football_jig
      // Distinct from GLUM which puts football_jig(0) first
      return expectation(
        "Northeast clear-lake winter largemouth should open with jerkbait and flat-side in front — NORTHERN_CLEAR_WINTER_LAKE puts suspending jerkbait at position 0, not football jig.",
        ["suspending_jerkbait", "flat_sided_crankbait", "football_jig"],
        ["paddle_tail_swimbait", "shaky_head_worm", "clouser_minnow"],
        clearColors(),
        ["walking_topwater", "hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      // NORTHERN_CLEAR_SPAWN_LAKE [4,5]: weightless_stick_worm(0), wacky, swim_jig, compact_flipping_jig
      // Finesse-spawn posture: stick worms lead on active days, but compact jig wins when
      // crawfish-primary forage scoring edges out the stick worm on pre-spawn structure days
      return expectation(
        "Northeast clear-lake spawn and postspawn largemouth should open with finesse stick-worm lanes first; compact jig surfaces when crawfish-primary forage scoring edges it ahead of stick worms on pre-spawn structure days.",
        ["weightless_stick_worm", "wacky_rigged_stick_worm", "swim_jig", "compact_flipping_jig"],
        ["soft_jerkbait", "paddle_tail_swimbait", "woolly_bugger"],
        colorSet("watermelon_natural", "green_pumpkin_natural", "natural_baitfish"),
        ["hollow_body_frog", "blade_bait"],
      );
    case "summer_positioning":
      // NORTHERN_CLEAR_SUMMER_LAKE [6,7]: wacky_rigged_stick_worm(0), weightless, drop_shot, swim_jig
      // bluegill_perch primary forage, base_presentation=subtle
      // On hot bluebird days: active mood + bluegill_perch forage → swim_jig (perch_bluegill colors) surfaces
      return expectation(
        "Northeast clear-lake summer largemouth: wacky rig and stick worm lead on subtle days; swim jig with perch/bluegill colors takes over on hot bluebird days when active mood and bluegill_perch forage scoring push horizontal presentations ahead of finesse.",
        ["wacky_rigged_stick_worm", "weightless_stick_worm", "drop_shot_worm_minnow", "swim_jig"],
        ["soft_jerkbait", "game_changer"],
        colorSet("watermelon_natural", "green_pumpkin_natural", "natural_baitfish", "perch_bluegill"),
        ["hollow_body_frog", "buzzbait_prop_bait", "blade_bait"],
      );
    case "fall_transition":
    default:
      // NORTHERN_CLEAR_FALL_LAKE [11]: spinnerbait(0), swim_jig, squarebill — mid/active/balanced
      // KEY DIFFERENCE from GLUM: northeast November is FALL not WINTER (active vs locked-down)
      return expectation(
        "Northeast November clear-lake largemouth stays in active fall posture — NORTHERN_CLEAR_FALL_LAKE fires at month 11 with spinnerbait and swim jig leading a mid/active baitfish window, not the locked-down winter posture that GLUM enters in November.",
        ["spinnerbait", "swim_jig", "squarebill_crankbait"],
        ["suspending_jerkbait", "paddle_tail_swimbait", "game_changer"],
        colorSet("white_shad", "natural_baitfish", "metal_flash"),
        ["hollow_body_frog", "blade_bait"],
      );
  }
}

function gulfDirtyGrassLakeExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "prespawn_opening":
      // gulf_coast month 3 override: GULF_DIRTY_PRESPAWN_GRASS_LAKE_LURES fires (shallow/neutral/bold, baitfish primary)
      // All lures in this pool get dirty clarity bonus — no clear-water lures; position dominates
      // spinnerbait(0) leads, bladed_jig(1) close, compact_flipping_jig possible on subtle days
      return expectation(
        "Gulf Coast dirty prespawn grass lake fires the GULF_DIRTY_PRESPAWN pool: all lures are dirty-friendly so position dominates; spinnerbait leads, bladed jig is close second, compact jig surfaces on slower days.",
        ["spinnerbait", "bladed_jig", "compact_flipping_jig", "swim_jig"],
        ["paddle_tail_swimbait", "lipless_crankbait", "clouser_minnow"],
        colorSet("bright_contrast", "white_shad", "dark_contrast"),
        ["suspending_jerkbait", "football_jig", "hollow_body_frog"],
      );
    case "fall_transition":
    default:
      // month 9: EARLY_FALL_GRASS_LAKE fires (shallow/active/balanced, baitfish primary)
      // walking_topwater(0) and squarebill get dirty PENALTY; buzzbait, swim_jig, spinnerbait, bladed_jig,
      // hollow_body_frog all get dirty BONUS → one of these wins over walking_topwater
      // month 10: FALL_LAKE fires (mid/active/balanced); spinnerbait(0)+bonus dominates
      return expectation(
        "Gulf Coast dirty fall grass lake: walking_topwater is penalized in dirty water so buzzbait, swim jig, spinnerbait, or bladed jig wins in early fall (month 9); spinnerbait locks up October FALL_LAKE with position-0 plus dirty bonus.",
        ["buzzbait_prop_bait", "swim_jig", "spinnerbait", "bladed_jig", "hollow_body_frog"],
        ["paddle_tail_swimbait", "lipless_crankbait", "game_changer"],
        colorSet("bright_contrast", "white_shad", "dark_contrast"),
        ["walking_topwater", "suspending_jerkbait", "squarebill_crankbait"],
      );
  }
}

function midwestDirtyBackwaterExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "prespawn_opening":
      // PRESPAWN_LAKE fires for midwest_interior month 3 (mid/neutral/balanced, crawfish primary)
      // football_jig(0) gets dirty bonus AND crawfish forage match → holds position-0 advantage
      // spinnerbait/bladed_jig get dirty bonus but no crawfish match; suspending_jerkbait/squarebill get penalty
      return expectation(
        "Midwest dirty backwater prespawn: football jig holds at position 0 via crawfish forage match plus dirty bonus; spinnerbait and bladed jig surface with dirty clarity boost but lack the forage alignment; suspending jerkbait drops away.",
        ["football_jig", "texas_rigged_soft_plastic_craw", "spinnerbait", "bladed_jig"],
        ["lipless_crankbait", "compact_flipping_jig", "woolly_bugger"],
        colorSet("craw_natural", "dark_contrast", "green_pumpkin_natural"),
        ["suspending_jerkbait", "squarebill_crankbait", "walking_topwater"],
      );
    case "summer_positioning":
      // SUMMER_LAKE fires for midwest_interior months 7/8 (shallow/active/bold, baitfish primary)
      // walking_topwater(0) gets dirty PENALTY → displaced by buzzbait(2)/hollow_body_frog(3)/swim_jig(4)
      // popping_topwater(1) gets dirty BONUS (clarity_strengths includes dirty) and is next in pool
      // deep_diving_crankbait gets penalty
      return expectation(
        "Midwest dirty backwater summer: walking_topwater drops off in dirty water; popping_topwater, buzzbait, hollow body frog, and swim jig all carry dirty-water clarity bonuses and compete for the top slot on active shallow days; hollow_body_frog wins on bold active baitfish days and produces frog_natural colors.",
        ["popping_topwater", "buzzbait_prop_bait", "hollow_body_frog", "swim_jig"],
        ["paddle_tail_swimbait", "texas_rigged_stick_worm", "frog_fly"],
        colorSet("bright_contrast", "dark_contrast", "white_shad", "frog_natural"),
        ["walking_topwater", "deep_diving_crankbait", "blade_bait"],
      );
    case "fall_transition":
    default:
      // FALL_LAKE fires for midwest_interior months 9/10 (shallow/active/balanced, baitfish primary)
      // spinnerbait(0) gets dirty bonus → dominates; bladed_jig(1)+bonus; suspending/squarebill/walking_topwater penalized
      return expectation(
        "Midwest dirty backwater fall: spinnerbait at position 0 with dirty clarity bonus dominates the FALL_LAKE pool; bladed jig and lipless crankbait round out the dirty-water baitfish set; clear-water lures are suppressed.",
        ["spinnerbait", "bladed_jig", "lipless_crankbait", "paddle_tail_swimbait"],
        ["swim_jig", "compact_flipping_jig", "clouser_minnow"],
        colorSet("white_shad", "bright_contrast", "dark_contrast"),
        ["suspending_jerkbait", "squarebill_crankbait", "walking_topwater"],
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
    case "socal_reservoir":
      return socalReservoirExpectation(scenario.focus_window);
    case "pnw_bass_lake":
      return pnwBassLakeExpectation(scenario.focus_window);
    case "colorado_bass_lake":
      return coloradoBassLakeExpectation(scenario.focus_window);
    case "northeast_maine_lake":
      return northeastMaineLakeExpectation(scenario.focus_window);
    case "gulf_dirty_grass_lake":
      return gulfDirtyGrassLakeExpectation(scenario.focus_window);
    case "midwest_dirty_backwater":
      return midwestDirtyBackwaterExpectation(scenario.focus_window);
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
