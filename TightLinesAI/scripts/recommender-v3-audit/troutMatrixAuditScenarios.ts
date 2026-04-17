import type {
  ArchivedRecommenderAuditScenario,
  RecommenderAuditExpectation,
  RecommenderAuditRegionPriority,
} from "../recommenderCalibrationScenarios.ts";
import type {
  ResolvedColorThemeV3,
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

function colorSet(...themes: ResolvedColorThemeV3[]): ResolvedColorThemeV3[] {
  return themes;
}

function expectation(
  seasonal_story: string,
  primary_lanes: RecommenderV3ArchetypeId[],
  acceptable_secondary_lanes: RecommenderV3ArchetypeId[],
  expected_color_lanes: ResolvedColorThemeV3[],
  disallowed_lanes: RecommenderV3ArchetypeId[] = [],
  notes?: string[],
): RecommenderAuditExpectation {
  return {
    seasonal_story,
    primary_lanes,
    acceptable_secondary_lanes,
    disallowed_lanes,
    expected_color_lanes,
    ...(notes && notes.length > 0 ? { notes } : {}),
  };
}

function clearColors(): ResolvedColorThemeV3[] {
  return colorSet("natural", "natural", "dark");
}

function stainedColors(): ResolvedColorThemeV3[] {
  return colorSet("natural", "dark", "bright");
}

function highVisColors(): ResolvedColorThemeV3[] {
  return colorSet("dark", "bright");
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
      // hair_jig produces dark (black leech) colors on bottom-push cold days.
      // March onward shifts to baitfish-primary spring row where natural/shad colors dominate.
      return expectation(
        "Late-winter and early-spring Appalachian trout should open slim-minnow and spinner lanes carefully without getting loud; the coldest bottom-push days can still elevate sculpin-style streamers and disciplined hair or jerkbait support.",
        ["slim_minnow_streamer", "inline_spinner", "woolly_bugger", "sculpin_streamer"],
        ["clouser_minnow", "suspending_jerkbait", "muddler_sculpin", "hair_jig"],
        colorSet("dark", "natural", "natural"),
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
        ["sculpin_streamer", "slim_minnow_streamer"],
        colorSet("dark", "natural", "natural"),
        defaultDisallowed(),
        [
          "Mouse is a rare low-light bank read when the seasonal pool and daily surface gate align; not a matrix-counted specialty reach target.",
        ],
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
        "Early-spring freestone trout should open slim-minnow, bugger, and spinner lanes without turning flashy, while still allowing sculpin-style streamers to lead on the coldest bottom-oriented days.",
        ["slim_minnow_streamer", "woolly_bugger", "inline_spinner", "sculpin_streamer"],
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
        ["woolly_bugger", "inline_spinner"],
        clearColors(),
        defaultDisallowed(),
        [
          "Mouse remains an occasional narrow surface read, not a specialty headline counted in matrix reach summaries.",
        ],
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
        colorSet("natural", "natural", "bright"),
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
        ["clouser_minnow", "woolly_bugger"],
        colorSet("natural", "natural", "bright"),
        defaultDisallowed(),
        [
          "Mouse is region- and pool-gated in seasonal truth; do not treat it as a matrix specialty quota here.",
        ],
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
        "Northwest winter trout should stay controlled around sculpin, bugger, conehead, and zonker-style lanes. The deepest December current windows can legitimately let conehead or blade-bait style control surface without breaking the winter story.",
        ["sculpin_streamer", "woolly_bugger", "zonker_streamer"],
        ["rabbit_strip_leech", "suspending_jerkbait", "conehead_streamer", "blade_bait"],
        clearColors(),
        ["mouse_fly", ...defaultDisallowed()],
      );
    case "prespawn_opening":
      return expectation(
        "Shoulder-season northwest trout should let minnow and spinner lanes breathe while staying clean and river-specific.",
        ["slim_minnow_streamer", "inline_spinner", "woolly_bugger"],
        ["clouser_minnow", "muddler_sculpin", "suspending_jerkbait"],
        colorSet("natural", "natural", "bright"),
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
        ["woolly_bugger", "inline_spinner"],
        clearColors(),
        defaultDisallowed(),
        [
          "Mouse windows are daily- and pool-gated; matrix does not count mouse as an expected specialty reach row.",
        ],
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
      colorSet("dark", "natural", "natural"),
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
    colorSet("dark", "natural", "natural"),
    ["mouse_fly", ...defaultDisallowed()],
  );
}

function idahoRunoffEdgeExpectation(focus: string): RecommenderAuditExpectation {
  if (focus === "spawn_postspawn_transition") {
    return expectation(
      // Stained runoff edge. Visible minnow/streamer lanes should lead; the
      // `slim_minnow_streamer` was promoted from secondary to primary after
      // the correction-plan P1.2 re-author of `muddler_sculpin` to
      // bottom-primary: on a stained-runoff April day the engine now
      // legitimately picks the high-visibility baitfish streamer first, with
      // sculpin/bugger staying in top-3. See
      // `docs/audits/recommender-v3/_correction_plan.md` §1.2.
      "A stained runoff edge should push visible streamer and minnow lanes without turning into bass power fishing. In the current April Mountain West row, bucktail and inline-spinner support can legitimately surface alongside the sculpin-bugger family.",
      ["sculpin_streamer", "woolly_bugger", "clouser_minnow", "slim_minnow_streamer"],
      ["inline_spinner", "muddler_sculpin", "bucktail_baitfish_streamer"],
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
    colorSet("dark", "natural", "natural"),
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
    audit_region_key: scenario.region_key,
  };
}

export const TROUT_V3_MATRIX_AUDIT_SCENARIOS: readonly ArchivedRecommenderAuditScenario[] =
  TROUT_FULL_AUDIT_MATRIX.map(scenarioToAuditScenario);
