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
  SMALLMOUTH_FULL_AUDIT_MATRIX,
  type SmallmouthAuditAnchorKey,
  type SmallmouthMatrixScenario,
} from "./smallmouthAuditMatrix.ts";

function priorityFor(role: SmallmouthMatrixScenario["matrix_role"]): RecommenderAuditRegionPriority {
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
  return colorSet("bright_contrast", "white_shad", "dark_contrast");
}

function greatLakesClearLakeExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Clear Great Lakes smallmouth winter should stay disciplined with tubes, hair, and jerkbait lanes in front.",
        ["tube_jig", "hair_jig", "suspending_jerkbait"],
        ["blade_bait", "drop_shot_worm_minnow", "sculpin_streamer"],
        colorSet("green_pumpkin_natural", "natural_baitfish", "craw_natural"),
        ["walking_topwater", "popping_topwater", "frog_fly"],
      );
    case "prespawn_opening":
      return expectation(
        "Clear prespawn Great Lakes smallmouth should open jerkbait and tube lanes without drifting too aggressive too early.",
        ["tube_jig", "suspending_jerkbait", "hair_jig"],
        ["paddle_tail_swimbait", "football_jig", "clouser_minnow"],
        clearColors(),
        ["walking_topwater", "popping_topwater"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Spawn and immediate postspawn clear-lake smallmouth should mix tube, drop-shot, and baitfish lanes with one clean surface option only when supported.",
        ["tube_jig", "drop_shot_worm_minnow", "paddle_tail_swimbait"],
        ["soft_jerkbait", "walking_topwater", "game_changer"],
        clearColors(),
        ["hollow_body_frog", "compact_flipping_jig"],
      );
    case "summer_positioning":
      return expectation(
        "Summer clear-lake smallmouth should rotate between baitfish and finesse lanes, with topwater as a controlled option rather than a default overreaction.",
        ["paddle_tail_swimbait", "drop_shot_worm_minnow", "hair_jig"],
        ["walking_topwater", "tube_jig", "game_changer"],
        colorSet("natural_baitfish", "white_shad", "green_pumpkin_natural", "craw_natural"),
        ["hollow_body_frog", "compact_flipping_jig"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Great Lakes fall smallmouth should tighten around jerkbait, swimbait, and hair / blade lanes with clean baitfish colors.",
        ["suspending_jerkbait", "paddle_tail_swimbait", "hair_jig"],
        ["blade_bait", "tube_jig", "slim_minnow_streamer"],
        colorSet("natural_baitfish", "white_shad", "metal_flash"),
        ["walking_topwater", "popping_topwater"],
      );
  }
}

function kentuckyHighlandLakeExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Highland winter smallmouth should stay lower-column and disciplined, but still allow jerkbait and hair-jig lanes.",
        ["tube_jig", "hair_jig", "suspending_jerkbait"],
        ["blade_bait", "flat_sided_crankbait", "clouser_minnow"],
        colorSet("green_pumpkin_natural", "white_shad", "natural_baitfish"),
        ["walking_topwater", "popping_topwater"],
      );
    case "prespawn_opening":
      return expectation(
        "Windy stained prespawn smallmouth lakes should keep tube, jerkbait, and swimbait lanes in front.",
        ["tube_jig", "suspending_jerkbait", "paddle_tail_swimbait"],
        ["flat_sided_crankbait", "hair_jig", "clouser_minnow"],
        stainedColors(),
        ["hollow_body_frog", "buzzbait_prop_bait"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Late-spring stained smallmouth lakes should let tube, swimbait, and spinnerbait lanes work without turning into generic largemouth cover fishing.",
        ["tube_jig", "paddle_tail_swimbait", "spinnerbait"],
        ["soft_jerkbait", "flat_sided_crankbait", "game_changer"],
        stainedColors(),
        ["hollow_body_frog", "compact_flipping_jig"],
      );
    case "summer_positioning":
      return expectation(
        "Summer stained highland smallmouth should still stay clean and open-water enough to support swimbait and spinnerbait behavior.",
        ["spinnerbait", "paddle_tail_swimbait", "tube_jig"],
        ["walking_topwater", "soft_jerkbait", "clouser_minnow"],
        stainedColors(),
        ["hollow_body_frog", "compact_flipping_jig"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Highland fall smallmouth should move toward jerkbait, swimbait, and spinnerbait lanes with shad-forward colors.",
        ["suspending_jerkbait", "paddle_tail_swimbait", "spinnerbait"],
        ["hair_jig", "tube_jig", "slim_minnow_streamer"],
        colorSet("white_shad", "natural_baitfish", "bright_contrast"),
        ["walking_topwater", "popping_topwater"],
      );
  }
}

function tennesseeRiverExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Winter Tennessee smallmouth should stay current-aware and controlled with tube, hair, and Ned lanes.",
        ["tube_jig", "hair_jig", "ned_rig"],
        ["blade_bait", "suspending_jerkbait", "sculpin_streamer"],
        colorSet("green_pumpkin_natural", "natural_baitfish", "craw_natural"),
        ["walking_topwater", "popping_topwater", "buzzbait_prop_bait"],
      );
    case "prespawn_opening":
      return expectation(
        "Prespawn stained river smallmouth should open spinnerbait and soft-minnow lanes while staying seam- and rock-aware.",
        ["spinnerbait", "tube_jig", "soft_jerkbait"],
        ["suspending_jerkbait", "inline_spinner", "clouser_minnow"],
        stainedColors(),
        ["hollow_body_frog", "buzzbait_prop_bait"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Late-spring river smallmouth should carry tube control plus clean seam-search lanes like soft jerkbait and inline spinner.",
        ["tube_jig", "soft_jerkbait", "inline_spinner"],
        ["spinnerbait", "squarebill_crankbait", "clouser_minnow"],
        stainedColors(),
        ["hollow_body_frog", "compact_flipping_jig"],
      );
    case "summer_positioning":
      return expectation(
        "Summer stained river smallmouth should lean current-edge search tools like inline spinner, spinnerbait, and controlled topwater.",
        ["inline_spinner", "spinnerbait", "walking_topwater"],
        ["soft_jerkbait", "tube_jig", "popper_fly"],
        colorSet("bright_contrast", "white_shad", "metal_flash"),
        ["hollow_body_frog", "compact_flipping_jig"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Fall Tennessee smallmouth should shift toward jerkbait, spinnerbait, and swimbait lanes with current still respected.",
        ["suspending_jerkbait", "spinnerbait", "paddle_tail_swimbait"],
        ["inline_spinner", "tube_jig", "slim_minnow_streamer"],
        colorSet("natural_baitfish", "white_shad", "metal_flash"),
        ["walking_topwater", "popping_topwater"],
      );
  }
}

function pennsylvaniaRiverExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Clear northern river smallmouth winter should stay lower-column and subtle with tube, hair, and jerkbait control.",
        ["tube_jig", "hair_jig", "suspending_jerkbait"],
        ["blade_bait", "drop_shot_worm_minnow", "sculpin_streamer"],
        clearColors(),
        ["walking_topwater", "popping_topwater"],
      );
    case "prespawn_opening":
      return expectation(
        "Clear prespawn river smallmouth should open tube, Ned, and soft-minnow lanes while staying current-correct.",
        ["tube_jig", "ned_rig", "soft_jerkbait"],
        ["suspending_jerkbait", "inline_spinner", "clouser_minnow"],
        clearColors(),
        ["hollow_body_frog", "buzzbait_prop_bait"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Late-spring clear river smallmouth should keep seam and rock behavior in front, not generic lake power.",
        ["tube_jig", "soft_jerkbait", "inline_spinner"],
        ["paddle_tail_swimbait", "spinnerbait", "clouser_minnow"],
        clearColors(),
        ["hollow_body_frog", "compact_flipping_jig"],
      );
    case "summer_positioning":
      return expectation(
        "Early-summer clear northern river smallmouth should still carry spring-to-early-summer control and current-search behavior rather than fully shifting into pure surface play.",
        ["tube_jig", "squarebill_crankbait", "suspending_jerkbait"],
        ["soft_jerkbait", "inline_spinner", "clouser_minnow"],
        colorSet("green_pumpkin_natural", "white_shad", "natural_baitfish"),
        ["hollow_body_frog", "compact_flipping_jig"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Late-fall clear northern river smallmouth should still respect baitfish lanes, but with a stronger tube and hair safety net than southern fall river rows.",
        ["tube_jig", "hair_jig", "suspending_jerkbait"],
        ["paddle_tail_swimbait", "blade_bait", "slim_minnow_streamer"],
        colorSet("green_pumpkin_natural", "natural_baitfish", "white_shad"),
        ["walking_topwater", "popping_topwater"],
      );
  }
}

function wisconsinNaturalLakeExpectation(focus: string): RecommenderAuditExpectation {
  if (focus === "spawn_postspawn_transition") {
    return expectation(
      "Wisconsin clear-lake spawn and postspawn should keep tube, drop-shot, and clean baitfish lanes in front.",
      ["tube_jig", "drop_shot_worm_minnow", "paddle_tail_swimbait"],
      ["hair_jig", "soft_jerkbait", "game_changer"],
      clearColors(),
      ["hollow_body_frog", "compact_flipping_jig"],
    );
  }
  if (focus === "summer_positioning") {
    return expectation(
      "Wisconsin summer natural-lake smallmouth should still favor finesse and clean baitfish lanes even when surface windows exist.",
      ["drop_shot_worm_minnow", "tube_jig", "hair_jig"],
      ["paddle_tail_swimbait", "walking_topwater", "game_changer"],
      colorSet("natural_baitfish", "white_shad", "green_pumpkin_natural", "craw_natural"),
      ["hollow_body_frog", "compact_flipping_jig"],
    );
  }
  return expectation(
    "Wisconsin clear-lake fall smallmouth should move toward jerkbait, swimbait, and hair / blade lanes.",
    ["suspending_jerkbait", "paddle_tail_swimbait", "hair_jig"],
    ["blade_bait", "tube_jig", "slim_minnow_streamer"],
    colorSet("natural_baitfish", "white_shad", "metal_flash"),
    ["walking_topwater", "popping_topwater"],
  );
}

function minnesotaFallLakeExpectation(focus: string): RecommenderAuditExpectation {
  if (focus === "spawn_postspawn_transition") {
    return expectation(
      "Spring northern stained-lake smallmouth should still stay controlled around tube, hair, and jerkbait lanes rather than forcing a pure fall baitfish read too early.",
      ["tube_jig", "hair_jig", "suspending_jerkbait"],
      ["paddle_tail_swimbait", "flat_sided_crankbait", "clouser_minnow"],
      colorSet("green_pumpkin_natural", "natural_baitfish", "white_shad"),
      ["walking_topwater", "popping_topwater"],
    );
  }
  if (focus === "prespawn_opening") {
    return expectation(
      "A stained spring northern smallmouth lake should still stay disciplined around tube, jerkbait, and hair / swimbait lanes.",
      ["tube_jig", "suspending_jerkbait", "hair_jig"],
      ["paddle_tail_swimbait", "flat_sided_crankbait", "clouser_minnow"],
      stainedColors(),
      ["walking_topwater", "popping_topwater"],
    );
  }
  if (focus === "summer_positioning") {
    return expectation(
      "A stained northern summer lake should allow swimbait and spinnerbait lanes, but still stay very smallmouth-specific.",
      ["paddle_tail_swimbait", "spinnerbait", "tube_jig"],
      ["hair_jig", "walking_topwater", "clouser_minnow"],
      colorSet("white_shad", "bright_contrast", "green_pumpkin_natural", "craw_natural"),
      ["hollow_body_frog", "compact_flipping_jig"],
    );
  }
  if (focus === "fall_transition") {
    return expectation(
      "Stained Minnesota fall smallmouth should tighten around jerkbait, blade, hair, and swimbait lanes.",
      ["suspending_jerkbait", "blade_bait", "hair_jig"],
      ["paddle_tail_swimbait", "tube_jig", "slim_minnow_streamer"],
      colorSet("white_shad", "bright_contrast", "natural_baitfish"),
      ["walking_topwater", "popping_topwater"],
    );
  }
  return expectation(
    "Late-fall northern stained smallmouth should remain disciplined and lower-column aware.",
    ["suspending_jerkbait", "hair_jig", "blade_bait"],
    ["tube_jig", "paddle_tail_swimbait", "clouser_minnow"],
    colorSet("white_shad", "bright_contrast", "natural_baitfish"),
    ["walking_topwater", "popping_topwater"],
  );
}

function coloradoRiverExpectation(focus: string): RecommenderAuditExpectation {
  if (focus === "prespawn_opening") {
    return expectation(
      "Cold clear western river smallmouth prespawn should stay subtle and current-aware with tube, hair, and soft-minnow lanes.",
      ["tube_jig", "hair_jig", "soft_jerkbait"],
      ["ned_rig", "suspending_jerkbait", "sculpin_streamer"],
      clearColors(),
      ["walking_topwater", "popping_topwater"],
    );
  }
  if (focus === "spawn_postspawn_transition") {
    return expectation(
      "Western postspawn river smallmouth should open soft-minnow, inline-spinner, and clean baitfish lanes.",
      ["soft_jerkbait", "inline_spinner", "tube_jig"],
      ["paddle_tail_swimbait", "walking_topwater", "clouser_minnow"],
      colorSet("natural_baitfish", "metal_flash", "white_shad"),
      ["hollow_body_frog", "compact_flipping_jig"],
    );
  }
  if (focus === "summer_positioning") {
    return expectation(
      "Clear western summer river smallmouth should keep current-aware baitfish and search lanes open, with tube support but not tube-first control on every good day.",
      ["inline_spinner", "soft_jerkbait", "paddle_tail_swimbait"],
      ["tube_jig", "walking_topwater", "clouser_minnow"],
      colorSet("natural_baitfish", "metal_flash", "white_shad"),
      ["hollow_body_frog", "compact_flipping_jig"],
    );
  }
  if (focus === "fall_transition") {
    return expectation(
      "Clear western fall river smallmouth should center on jerkbait, spinner, and swimbait lanes with current still respected.",
      ["suspending_jerkbait", "inline_spinner", "paddle_tail_swimbait"],
      ["tube_jig", "clouser_minnow", "slim_minnow_streamer"],
      colorSet("natural_baitfish", "white_shad", "metal_flash"),
      ["walking_topwater", "popping_topwater"],
    );
  }
  return expectation(
    "Early-winter western river smallmouth should stay lower-column and disciplined with tube, hair, and jerkbait control.",
    ["tube_jig", "hair_jig", "suspending_jerkbait"],
    ["blade_bait", "drop_shot_worm_minnow", "sculpin_streamer"],
    clearColors(),
    ["walking_topwater", "popping_topwater"],
  );
}

function washingtonRiverExpectation(focus: string): RecommenderAuditExpectation {
  if (focus === "spawn_postspawn_transition") {
    return expectation(
      "Northwest clear river smallmouth should open tube, soft-minnow, and spinner lanes while staying river-specific.",
      ["tube_jig", "soft_jerkbait", "inline_spinner"],
      ["paddle_tail_swimbait", "spinnerbait", "clouser_minnow"],
      clearColors(),
      ["hollow_body_frog", "compact_flipping_jig"],
    );
  }
  if (focus === "summer_positioning") {
    return expectation(
      "Summer northwest river smallmouth should allow topwater and spinner lanes, but only as current-aware river options.",
      ["walking_topwater", "inline_spinner", "paddle_tail_swimbait"],
      ["soft_jerkbait", "tube_jig", "popper_fly"],
      colorSet("natural_baitfish", "white_shad", "metal_flash"),
      ["hollow_body_frog", "compact_flipping_jig"],
    );
  }
  return expectation(
    "Cool-season northwest river smallmouth should prioritize jerkbait, spinner, and swimbait lanes with a clean tube backup.",
    ["suspending_jerkbait", "inline_spinner", "paddle_tail_swimbait"],
    ["spinnerbait", "tube_jig", "clouser_minnow"],
    colorSet("natural_baitfish", "white_shad", "metal_flash"),
    ["walking_topwater", "popping_topwater"],
  );
}

function ohioDirtyReservoirExpectation(focus: string): RecommenderAuditExpectation {
  if (focus === "spawn_postspawn_transition") {
    return expectation(
      "Dirty prespawn and spawn-transition smallmouth reservoirs should stay disciplined but visible, letting spinnerbait and jerkbait lanes stay in play.",
      ["spinnerbait", "tube_jig", "suspending_jerkbait"],
      ["paddle_tail_swimbait", "flat_sided_crankbait", "clouser_minnow"],
      colorSet("white_shad", "bright_contrast", "green_pumpkin_natural"),
      ["walking_topwater", "popping_topwater"],
    );
  }
  if (focus === "summer_positioning") {
    return expectation(
      "Dirty summer smallmouth reservoirs should still use visible baitfish tools, not collapse into largemouth-only cover pitching.",
      ["spinnerbait", "paddle_tail_swimbait", "tube_jig"],
      ["walking_topwater", "medium_diving_crankbait", "game_changer"],
      dirtyColors(),
      ["hollow_body_frog", "compact_flipping_jig"],
    );
  }
  return expectation(
    "Dirty winter smallmouth reservoirs should stay lower-column and visible with jerkbait, blade, and hair/tube lanes.",
    ["suspending_jerkbait", "blade_bait", "hair_jig"],
    ["tube_jig", "paddle_tail_swimbait", "clouser_minnow"],
    dirtyColors(),
    ["walking_topwater", "popping_topwater"],
  );
}

function expectationForScenario(scenario: SmallmouthMatrixScenario): RecommenderAuditExpectation {
  if (scenario.anchor_key === "great_lakes_clear_lake" && scenario.month === 6) {
    return expectation(
      "Early-summer clear Great Lakes smallmouth can legitimately open with a soft jerkbait or swimbait around a postspawn baitfish shift, while still keeping drop-shot and hair support in play.",
      ["soft_jerkbait", "paddle_tail_swimbait", "drop_shot_worm_minnow"],
      ["hair_jig", "tube_jig", "game_changer"],
      clearColors(),
      ["hollow_body_frog", "compact_flipping_jig"],
    );
  }
  if (scenario.anchor_key === "wisconsin_natural_lake" && scenario.month === 6) {
    return expectation(
      "Wisconsin early-summer natural-lake smallmouth can open with a soft jerkbait around a clean baitfish shift, but should still keep tube, drop-shot, and hair control nearby.",
      ["soft_jerkbait", "drop_shot_worm_minnow", "tube_jig"],
      ["hair_jig", "paddle_tail_swimbait", "game_changer"],
      clearColors(),
      ["hollow_body_frog", "compact_flipping_jig"],
    );
  }
  if (scenario.anchor_key === "minnesota_fall_lake" && scenario.month === 8) {
    return expectation(
      "A stained northern summer lake can still lead with hair, swimbait, or tube lanes when the fish are roaming but not fully power-fishing.",
      ["hair_jig", "paddle_tail_swimbait", "tube_jig"],
      ["spinnerbait", "walking_topwater", "clouser_minnow"],
      colorSet("white_shad", "bright_contrast", "green_pumpkin_natural", "craw_natural"),
      ["hollow_body_frog", "compact_flipping_jig"],
    );
  }
  switch (scenario.anchor_key) {
    case "great_lakes_clear_lake":
      return greatLakesClearLakeExpectation(scenario.focus_window);
    case "kentucky_highland_lake":
      return kentuckyHighlandLakeExpectation(scenario.focus_window);
    case "tennessee_river":
      return tennesseeRiverExpectation(scenario.focus_window);
    case "pennsylvania_river":
      return pennsylvaniaRiverExpectation(scenario.focus_window);
    case "wisconsin_natural_lake":
      return wisconsinNaturalLakeExpectation(scenario.focus_window);
    case "minnesota_fall_lake":
      return minnesotaFallLakeExpectation(scenario.focus_window);
    case "colorado_river":
      return coloradoRiverExpectation(scenario.focus_window);
    case "washington_river":
      return washingtonRiverExpectation(scenario.focus_window);
    case "ohio_dirty_reservoir":
      return ohioDirtyReservoirExpectation(scenario.focus_window);
    default: {
      const _never: never = scenario.anchor_key;
      throw new Error(`Unhandled SMB matrix anchor: ${_never}`);
    }
  }
}

function scenarioToAuditScenario(scenario: SmallmouthMatrixScenario): ArchivedRecommenderAuditScenario {
  return {
    id: scenario.id,
    label: scenario.label,
    priority: priorityFor(scenario.matrix_role),
    latitude: scenario.latitude,
    longitude: scenario.longitude,
    state_code: scenario.state_code,
    timezone: scenario.timezone,
    local_date: scenario.local_date,
    species: "smallmouth_bass",
    context: scenario.context,
    water_clarity: scenario.default_clarity,
    expectation: expectationForScenario(scenario),
  };
}

export const SMALLMOUTH_V3_MATRIX_AUDIT_SCENARIOS: readonly ArchivedRecommenderAuditScenario[] =
  SMALLMOUTH_FULL_AUDIT_MATRIX.map(scenarioToAuditScenario);
