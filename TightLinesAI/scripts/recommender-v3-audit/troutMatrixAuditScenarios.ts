import type {
  ArchivedRecommenderAuditScenario,
  RecommenderAuditExpectation,
  RecommenderAuditRegionPriority,
} from "../recommenderCalibrationScenarios.ts";
import type {
  ColorThemeIdV3,
  RecommenderV3ArchetypeId,
} from "../../supabase/functions/_shared/recommenderEngine/index.ts";
import {
  TROUT_FULL_AUDIT_MATRIX,
  type TroutAuditAnchorKey,
  type TroutMatrixScenario,
} from "./troutAuditMatrix.ts";

function priorityFor(role: TroutMatrixScenario["matrix_role"]): RecommenderAuditRegionPriority {
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
  return colorSet("natural_baitfish", "white_shad", "dark_contrast");
}

function stainedColors(): ColorThemeIdV3[] {
  return colorSet("white_shad", "dark_contrast", "bright_contrast");
}

function highVisColors(): ColorThemeIdV3[] {
  return colorSet("white_shad", "bright_contrast", "metal_flash");
}

function defaultDisallowed(): RecommenderV3ArchetypeId[] {
  return ["frog_fly", "popper_fly", "walking_topwater", "hollow_body_frog"];
}

function appalachianTailwaterExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "A clear Appalachian winter tailwater should stay subtle and lower-column with sculpin, bugger, leech, and disciplined hair support.",
        ["sculpin_streamer", "woolly_bugger", "rabbit_strip_leech"],
        ["conehead_streamer", "hair_jig", "suspending_jerkbait"],
        clearColors(),
        ["mouse_fly", ...defaultDisallowed()],
      );
    case "prespawn_opening":
      // February uses the WARM_TAILWATER [1-2] row (primary_forage: leech_worm) so
      // hair_jig produces dark_contrast (black leech) colors on bottom-push cold days.
      // March onward shifts to baitfish-primary spring row where natural/shad colors dominate.
      return expectation(
        "Late-winter and early-spring Appalachian trout should open slim-minnow and spinner lanes carefully without getting loud; February bottom-push days surface hair jig in dark leech colors.",
        ["slim_minnow_streamer", "inline_spinner", "woolly_bugger"],
        ["clouser_minnow", "suspending_jerkbait", "muddler_sculpin"],
        colorSet("dark_contrast", "natural_baitfish", "white_shad"),
        ["mouse_fly", ...defaultDisallowed()],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Spring Appalachian trout should stay current-aware with minnow, bugger, and spinner lanes rather than broad power-fishing behavior.",
        ["slim_minnow_streamer", "woolly_bugger", "inline_spinner"],
        ["clouser_minnow", "sculpin_streamer", "suspending_jerkbait"],
        clearColors(),
        ["mouse_fly", ...defaultDisallowed()],
      );
    case "summer_positioning":
      return expectation(
        "Summer tailwater trout should tighten into controlled sculpin, bugger, and leech lanes, only allowing a mouse as a narrow supporting read.",
        ["muddler_sculpin", "woolly_bugger", "rabbit_strip_leech"],
        ["sculpin_streamer", "slim_minnow_streamer", "mouse_fly"],
        colorSet("dark_contrast", "natural_baitfish", "white_shad"),
        defaultDisallowed(),
      );
    case "fall_transition":
    default:
      return expectation(
        "Fall Appalachian trout should reopen baitfish and articulated streamer lanes while staying trout-clean and current-aware.",
        ["articulated_baitfish_streamer", "slim_minnow_streamer", "game_changer"],
        ["zonker_streamer", "sculpin_streamer", "suspending_jerkbait"],
        clearColors(),
        defaultDisallowed(),
      );
  }
}

function northeastFreestoneExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Northeast winter freestone trout should stay subtle and lower-column with sculpin, bugger, and leech control.",
        ["sculpin_streamer", "woolly_bugger", "rabbit_strip_leech"],
        ["conehead_streamer", "suspending_jerkbait", "hair_jig"],
        clearColors(),
        ["mouse_fly", ...defaultDisallowed()],
      );
    case "prespawn_opening":
      return expectation(
        "Early-spring freestone trout should open slim-minnow, bugger, and spinner lanes without turning flashy.",
        ["slim_minnow_streamer", "woolly_bugger", "inline_spinner"],
        ["clouser_minnow", "muddler_sculpin", "suspending_jerkbait"],
        clearColors(),
        ["mouse_fly", ...defaultDisallowed()],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Spring northern freestone trout should still feel disciplined around minnow, sculpin, and bugger lanes.",
        ["slim_minnow_streamer", "sculpin_streamer", "woolly_bugger"],
        ["clouser_minnow", "inline_spinner", "muddler_sculpin"],
        clearColors(),
        ["mouse_fly", ...defaultDisallowed()],
      );
    case "summer_positioning":
      return expectation(
        "Summer freestone trout should allow clean minnow lanes and one controlled mouse option, but not noisy warmwater surface behavior.",
        ["slim_minnow_streamer", "clouser_minnow", "muddler_sculpin"],
        ["woolly_bugger", "mouse_fly", "inline_spinner"],
        clearColors(),
        defaultDisallowed(),
      );
    case "fall_transition":
    default:
      return expectation(
        "Fall Northeast trout should tighten around visible baitfish and zonker-style lanes, especially when flows bump up.",
        ["articulated_baitfish_streamer", "slim_minnow_streamer", "zonker_streamer"],
        ["woolly_bugger", "inline_spinner", "game_changer"],
        stainedColors(),
        defaultDisallowed(),
      );
  }
}

function mountainWestRiverExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Winter western trout should stay in sculpin, bugger, and restrained minnow lanes with very little noise.",
        ["sculpin_streamer", "woolly_bugger", "suspending_jerkbait"],
        ["rabbit_strip_leech", "conehead_streamer", "hair_jig"],
        clearColors(),
        ["mouse_fly", ...defaultDisallowed()],
      );
    case "prespawn_opening":
      // On a typical cold February day: sculpin, slim_minnow, inline_spinner lead.
      // On an anomalously warm February day (high pressure, mood resolves active):
      // suspending_jerkbait wins by position-zero advantage over inline_spinner
      // since both score identically on active+balanced — both are valid for late-
      // winter western trout.
      return expectation(
        "Shoulder-season western trout should open clean minnow and spinner support without over-accelerating; suspending jerkbait surfaces on warm-front days when fish push active.",
        ["sculpin_streamer", "slim_minnow_streamer", "inline_spinner", "suspending_jerkbait"],
        ["clouser_minnow", "woolly_bugger", "casting_spoon"],
        colorSet("natural_baitfish", "white_shad", "metal_flash"),
        ["mouse_fly", ...defaultDisallowed()],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Spring western trout should reward minnow, sculpin, and spinner lanes, especially near runoff edges.",
        ["slim_minnow_streamer", "sculpin_streamer", "inline_spinner"],
        ["clouser_minnow", "woolly_bugger", "casting_spoon"],
        clearColors(),
        ["mouse_fly", ...defaultDisallowed()],
      );
    case "summer_positioning":
      return expectation(
        "Summer western trout should remain streamer-minded with controlled minnow, muddler, and spinner lanes rather than bass-style aggression.",
        ["slim_minnow_streamer", "muddler_sculpin", "inline_spinner"],
        ["clouser_minnow", "woolly_bugger", "mouse_fly"],
        colorSet("natural_baitfish", "white_shad", "metal_flash"),
        defaultDisallowed(),
      );
    case "fall_transition":
    default:
      return expectation(
        "Fall western trout should center on articulated baitfish, slim minnow, and zonker-style lanes.",
        ["articulated_baitfish_streamer", "slim_minnow_streamer", "game_changer"],
        ["zonker_streamer", "sculpin_streamer", "suspending_jerkbait"],
        clearColors(),
        defaultDisallowed(),
      );
  }
}

function pacificNorthwestRiverExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Northwest winter trout should stay controlled around sculpin, bugger, and zonker-style lanes.",
        ["sculpin_streamer", "woolly_bugger", "zonker_streamer"],
        ["rabbit_strip_leech", "suspending_jerkbait", "conehead_streamer"],
        clearColors(),
        ["mouse_fly", ...defaultDisallowed()],
      );
    case "prespawn_opening":
      return expectation(
        "Shoulder-season northwest trout should let minnow and spinner lanes breathe while staying clean and river-specific.",
        ["slim_minnow_streamer", "inline_spinner", "woolly_bugger"],
        ["clouser_minnow", "muddler_sculpin", "suspending_jerkbait"],
        colorSet("natural_baitfish", "white_shad", "metal_flash"),
        ["mouse_fly", ...defaultDisallowed()],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Spring northwest trout should mix slim minnow, muddler, and spinner lanes without surface clutter.",
        ["slim_minnow_streamer", "muddler_sculpin", "inline_spinner"],
        ["clouser_minnow", "woolly_bugger", "casting_spoon"],
        clearColors(),
        ["mouse_fly", ...defaultDisallowed()],
      );
    case "summer_positioning":
      return expectation(
        "Summer northwest trout should stay streamer-minded with low-water restraint, allowing one mouse window only when conditions support it.",
        ["slim_minnow_streamer", "muddler_sculpin", "clouser_minnow"],
        ["woolly_bugger", "inline_spinner", "mouse_fly"],
        clearColors(),
        defaultDisallowed(),
      );
    case "fall_transition":
    default:
      return expectation(
        "Fall northwest trout should tighten around slim minnow, articulated baitfish, and zonker lanes.",
        ["articulated_baitfish_streamer", "slim_minnow_streamer", "zonker_streamer"],
        ["game_changer", "sculpin_streamer", "suspending_jerkbait"],
        clearColors(),
        defaultDisallowed(),
      );
  }
}

function northernCaliforniaFallExpectation(focus: string): RecommenderAuditExpectation {
  if (focus === "prespawn_opening") {
    return expectation(
      "Late-winter northern California trout should stay controlled around sculpin, bugger, and restrained minnow lanes.",
      ["sculpin_streamer", "woolly_bugger", "suspending_jerkbait"],
      ["rabbit_strip_leech", "slim_minnow_streamer", "hair_jig"],
      clearColors(),
      ["mouse_fly", ...defaultDisallowed()],
    );
  }
  // On active mid-column fall days (typical September): articulated baitfish leads
  // and slim_minnow wins the fly slot on subtle-push days (handles all moods vs
  // articulated's neutral/active preference).
  // On low clear-water October days when column resolves to bottom (lower_1 nudge):
  // hair_jig wins by its broad water-column coverage (shallow/mid/bottom) vs
  // suspending_jerkbait which only covers shallow/mid — both are excellent tools
  // for clear California fall rivers.
  return expectation(
    "Northern California fall trout: articulated baitfish leads active mid-column days; slim minnow surfaces on subtle-condition September days; hair jig earns the lure top slot on low clear-water October days when fish sit deep.",
    ["articulated_baitfish_streamer", "slim_minnow_streamer", "hair_jig"],
    ["game_changer", "sculpin_streamer", "suspending_jerkbait"],
    clearColors(),
    defaultDisallowed(),
  );
}

function greatLakesHighwaterExpectation(focus: string): RecommenderAuditExpectation {
  if (focus === "prespawn_opening") {
    return expectation(
      "Cold stained northern trout water should still stay disciplined with bugger, sculpin, and spinner lanes rather than broad aggression.",
      ["woolly_bugger", "sculpin_streamer", "inline_spinner"],
      ["slim_minnow_streamer", "conehead_streamer", "casting_spoon"],
      stainedColors(),
      ["mouse_fly", ...defaultDisallowed()],
    );
  }
  if (focus === "spawn_postspawn_transition") {
    return expectation(
      "Spring stained high-water trout should elevate visible bugger, minnow, and spinner lanes, but still stay trout-clean.",
      ["woolly_bugger", "clouser_minnow", "inline_spinner"],
      ["sculpin_streamer", "slim_minnow_streamer", "casting_spoon"],
      highVisColors(),
      ["mouse_fly", ...defaultDisallowed()],
    );
  }
  return expectation(
    "Fall stained Great Lakes trout should tighten around visible articulated baitfish, bugger, and minnow lanes.",
    ["articulated_baitfish_streamer", "woolly_bugger", "slim_minnow_streamer"],
    ["game_changer", "inline_spinner", "zonker_streamer"],
    stainedColors(),
    ["mouse_fly", ...defaultDisallowed()],
  );
}

function alaskaBigRiverExpectation(focus: string): RecommenderAuditExpectation {
  if (focus === "summer_positioning") {
    return expectation(
      "Big Alaskan trout water in summer should still feel streamer-heavy and disciplined, not warmwater noisy.",
      ["sculpin_streamer", "woolly_bugger", "rabbit_strip_leech"],
      ["articulated_baitfish_streamer", "slim_minnow_streamer", "casting_spoon"],
      colorSet("dark_contrast", "natural_baitfish", "white_shad"),
      ["mouse_fly", ...defaultDisallowed()],
    );
  }
  if (focus === "fall_transition") {
    return expectation(
      "Fall Alaska trout should strongly reward articulated baitfish, sculpin, and leech-style streamers.",
      ["articulated_baitfish_streamer", "sculpin_streamer", "rabbit_strip_leech"],
      ["game_changer", "slim_minnow_streamer", "zonker_streamer"],
      clearColors(),
      defaultDisallowed(),
    );
  }
  return expectation(
    "Early-winter Alaska trout should stay in heavy sculpin, leech, and conehead control with no surface drift.",
    ["sculpin_streamer", "rabbit_strip_leech", "conehead_streamer"],
    ["woolly_bugger", "hair_jig", "suspending_jerkbait"],
    colorSet("dark_contrast", "natural_baitfish", "white_shad"),
    ["mouse_fly", ...defaultDisallowed()],
  );
}

function idahoRunoffEdgeExpectation(focus: string): RecommenderAuditExpectation {
  if (focus === "spawn_postspawn_transition") {
    return expectation(
      "A stained runoff edge should push visible sculpin, bugger, and minnow lanes without turning into bass power fishing.",
      ["sculpin_streamer", "woolly_bugger", "clouser_minnow"],
      ["slim_minnow_streamer", "inline_spinner", "muddler_sculpin"],
      stainedColors(),
      ["mouse_fly", ...defaultDisallowed()],
    );
  }
  return expectation(
    "Colored western summer trout water should stay visible but controlled around bugger, minnow, and spinner support lanes.",
    ["woolly_bugger", "clouser_minnow", "inline_spinner"],
    ["slim_minnow_streamer", "muddler_sculpin", "casting_spoon"],
    highVisColors(),
    defaultDisallowed(),
  );
}

function southCentralTailwaterExpectation(focus: string): RecommenderAuditExpectation {
  if (focus === "spawn_postspawn_transition") {
    return expectation(
      "A stained spring tailwater pulse should elevate visible minnow, bugger, and spinner lanes while staying current-aware.",
      ["clouser_minnow", "slim_minnow_streamer", "inline_spinner"],
      ["woolly_bugger", "muddler_sculpin", "suspending_jerkbait"],
      highVisColors(),
      defaultDisallowed(),
    );
  }
  return expectation(
    "Warm-tailwater summer trout should tighten back into sculpin, bugger, and leech-style restraint rather than broad summer aggression.",
    ["muddler_sculpin", "woolly_bugger", "rabbit_strip_leech"],
    ["sculpin_streamer", "slim_minnow_streamer", "hair_jig"],
    colorSet("dark_contrast", "white_shad", "natural_baitfish"),
    ["mouse_fly", ...defaultDisallowed()],
  );
}

function expectationForScenario(scenario: TroutMatrixScenario): RecommenderAuditExpectation {
  switch (scenario.anchor_key) {
    case "appalachian_tailwater":
      return appalachianTailwaterExpectation(scenario.focus_window);
    case "northeast_freestone":
      return northeastFreestoneExpectation(scenario.focus_window);
    case "mountain_west_river":
      return mountainWestRiverExpectation(scenario.focus_window);
    case "pacific_northwest_river":
      return pacificNorthwestRiverExpectation(scenario.focus_window);
    case "northern_california_fall":
      return northernCaliforniaFallExpectation(scenario.focus_window);
    case "great_lakes_highwater":
      return greatLakesHighwaterExpectation(scenario.focus_window);
    case "alaska_big_river":
      return alaskaBigRiverExpectation(scenario.focus_window);
    case "idaho_runoff_edge":
      return idahoRunoffEdgeExpectation(scenario.focus_window);
    case "south_central_tailwater":
      return southCentralTailwaterExpectation(scenario.focus_window);
    default: {
      const _never: never = scenario.anchor_key;
      throw new Error(`Unhandled trout matrix anchor: ${_never}`);
    }
  }
}

function scenarioToAuditScenario(scenario: TroutMatrixScenario): ArchivedRecommenderAuditScenario {
  return {
    id: scenario.id,
    label: scenario.label,
    priority: priorityFor(scenario.matrix_role),
    latitude: scenario.latitude,
    longitude: scenario.longitude,
    state_code: scenario.state_code,
    timezone: scenario.timezone,
    local_date: scenario.local_date,
    species: "river_trout",
    context: scenario.context,
    water_clarity: scenario.default_clarity,
    expectation: expectationForScenario(scenario),
  };
}

export const TROUT_V3_MATRIX_AUDIT_SCENARIOS: readonly ArchivedRecommenderAuditScenario[] =
  TROUT_FULL_AUDIT_MATRIX.map(scenarioToAuditScenario);
