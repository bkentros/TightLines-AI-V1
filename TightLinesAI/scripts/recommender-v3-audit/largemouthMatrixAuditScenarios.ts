import type {
  ArchivedRecommenderAuditScenario,
  RecommenderAuditExpectation,
  RecommenderAuditRegionPriority,
} from "../recommenderCalibrationScenarios.ts";
import type {
  ResolvedColorThemeV3,
  RecommenderV3ArchetypeId,
} from "../../supabase/functions/_shared/recommenderEngine/v3/contracts.ts";
import { LARGEMOUTH_FULL_AUDIT_MATRIX, type LargemouthAuditAnchorKey, type LargemouthMatrixScenario } from "./largemouthAuditMatrix.ts";

function priorityFor(role: LargemouthMatrixScenario["matrix_role"]): RecommenderAuditRegionPriority {
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
): RecommenderAuditExpectation {
  return {
    seasonal_story,
    primary_lanes,
    acceptable_secondary_lanes,
    disallowed_lanes,
    expected_color_lanes,
  };
}

function clearColors(): ResolvedColorThemeV3[] {
  return colorSet("natural", "dark");
}

function stainedColors(): ResolvedColorThemeV3[] {
  return colorSet("dark", "bright");
}

function dirtyColors(): ResolvedColorThemeV3[] {
  return colorSet("dark", "bright");
}

function floridaLakeExpectation(
  scenario: LargemouthMatrixScenario,
  clarity: LargemouthMatrixScenario["default_clarity"],
): RecommenderAuditExpectation {
  const focus = scenario.focus_window;
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
      if (scenario.month === 5) {
        return expectation(
          "Florida May postspawn largemouth should still stay shallow and target-oriented, and in the current seasonal pool that means a single weedless stick worm, swim jig, compact jig, and paddle-tail style follow-ups rather than the older split stick-worm finesse spread.",
          [
            "weightless_stick_worm",
            "swim_jig",
            "compact_flipping_jig",
            "paddle_tail_swimbait",
          ],
          ["soft_jerkbait", "woolly_bugger", "hollow_body_frog"],
          clarity === "clear" ? colorSet("natural", "natural", "natural") : stainedColors(),
          ["blade_bait"],
        );
      }
      return expectation(
        "Florida spawn and immediate postspawn should stay shallow and target-oriented first, with one clean baitfish follow-up lane; hollow-body frog can join only on legitimately open aggressive spring days around shallow cover.",
        ["weightless_stick_worm", "compact_flipping_jig"],
        ["swim_jig", "paddle_tail_swimbait", "woolly_bugger", "hollow_body_frog"],
        clarity === "clear" ? colorSet("natural", "natural", "natural") : stainedColors(),
        ["blade_bait"],
      );
    case "summer_positioning":
      if (scenario.month === 8) {
        return expectation(
          "Late-summer Florida largemouth should still lean grass, cover, and surface-adjacent lanes, and this archived August window is one of the cleaner prop-bait opportunities rather than a forced buzz-only read.",
          ["hollow_body_frog", "swim_jig", "buzzbait", "prop_bait"],
          ["compact_flipping_jig", "weightless_stick_worm", "frog_fly"],
          clarity === "dirty" ? colorSet("natural", "dark", "natural") : colorSet("natural", "natural", "dark"),
          ["blade_bait", "drop_shot_worm", "suspending_jerkbait"],
        );
      }
      return expectation(
        "Early- to midsummer Florida largemouth should lean grass, cover, and aggressive surface-adjacent lanes, but prop bait is still a supporting option until the cleaner late-summer cadence truly opens.",
        ["hollow_body_frog", "swim_jig", "buzzbait"],
        ["compact_flipping_jig", "weightless_stick_worm", "frog_fly", "prop_bait"],
        clarity === "dirty" ? colorSet("natural", "dark", "natural") : colorSet("natural", "natural", "dark"),
        ["blade_bait", "drop_shot_worm", "suspending_jerkbait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Florida fall largemouth should allow stronger shallow baitfish and grass-cover options than the summer slowdown windows, but these archived fall days still read more swim-jig and spinnerbait than true walking-topwater windows.",
        ["swim_jig", "spinnerbait"],
        ["bladed_jig", "hollow_body_frog", "paddle_tail_swimbait"],
        colorSet("natural", "natural", "bright"),
        ["blade_bait"],
      );
  }
}

function texasReservoirExpectation(
  scenario: LargemouthMatrixScenario,
  clarity: LargemouthMatrixScenario["default_clarity"],
): RecommenderAuditExpectation {
  switch (scenario.focus_window) {
    case "winter_control":
      return expectation(
        "South-central winter reservoir largemouth should stay lower and controlled, with jerkbait or flat-side still in play when conditions allow.",
        ["football_jig", "suspending_jerkbait", "flat_sided_crankbait"],
        ["shaky_head_worm", "texas_rigged_soft_plastic_craw", "rabbit_strip_leech"],
        clarity === "dirty" ? dirtyColors() : colorSet("natural", "natural", "dark"),
        ["walking_topwater", "hollow_body_frog"],
      );
    case "prespawn_opening":
      return expectation(
        "South-central prespawn reservoirs should open baitfish lanes when conditions allow, but cold-front days can still pull the lead back to football jig and other bottom-control reads.",
        ["spinnerbait", "suspending_jerkbait", "paddle_tail_swimbait", "football_jig"],
        ["texas_rigged_soft_plastic_craw", "bladed_jig", "swim_jig"],
        stainedColors(),
        ["hollow_body_frog", "popper_fly"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Texas spawn-to-postspawn largemouth should balance target fishing with one or two clean horizontal follow-up lanes.",
        ["compact_flipping_jig", "weightless_stick_worm", "swim_jig"],
        ["weightless_stick_worm", "paddle_tail_swimbait", "soft_jerkbait"],
        colorSet("natural", "natural", "natural"),
        ["blade_bait", "walking_topwater"],
      );
    case "summer_positioning":
      return expectation(
        "Summer reservoirs should favor brush, structure, and visible control lanes over clear-water finesse or cold-water reaction tools, and texas-rigged craw remains a legitimate core brush-control answer on the hotter archived July/August windows.",
        [
          "compact_flipping_jig",
          "football_jig",
          "deep_diving_crankbait",
          "texas_rigged_soft_plastic_craw",
        ],
        ["spinnerbait", "swim_jig"],
        clarity === "dirty" ? dirtyColors() : stainedColors(),
        ["drop_shot_worm", "weightless_stick_worm", "blade_bait"],
      );
    case "fall_transition":
    default:
      if (scenario.month === 9) {
        return expectation(
          "Hot early-fall south-central reservoir largemouth can still let spinnerbait lead the schooling-shad story on suppressive stained-water days, with paddle tail, squarebill, and suspending jerkbait rotating behind it rather than forcing a squarebill-only read.",
          ["spinnerbait", "paddle_tail_swimbait", "squarebill_crankbait", "suspending_jerkbait"],
          ["bladed_jig", "shaky_head_worm", "rabbit_strip_leech"],
          colorSet("natural", "natural", "natural"),
          ["walking_topwater", "hollow_body_frog"],
        );
      }
      if (scenario.month === 11) {
        return expectation(
          "Late-fall south-central reservoir largemouth can collapse back into football-jig and shaky-head control on bright post-front reservoir days, while still keeping one baitfish-following option nearby.",
          ["football_jig", "shaky_head_worm", "paddle_tail_swimbait", "suspending_jerkbait"],
          ["texas_rigged_soft_plastic_craw", "spinnerbait", "rabbit_strip_leech"],
          colorSet("natural", "natural", "natural"),
          ["walking_topwater", "hollow_body_frog"],
        );
      }
      return expectation(
        "Fall south-central reservoir bass should chase schooling baitfish with horizontal moving lanes; squarebill and paddle tail lead, suspending as a control backup.",
        ["squarebill_crankbait", "paddle_tail_swimbait", "suspending_jerkbait"],
        ["spinnerbait", "shaky_head_worm", "rabbit_strip_leech"],
        colorSet("natural", "natural", "natural"),
        ["walking_topwater", "hollow_body_frog"],
      );
  }
}

function alabamaRiverExpectation(
  scenario: LargemouthMatrixScenario,
): RecommenderAuditExpectation {
  switch (scenario.focus_window) {
    case "winter_control":
      return expectation(
        "Winter river largemouth should stay current-aware and controlled, not drift into lake-only or ultra-finesse nonsense.",
        ["compact_flipping_jig", "suspending_jerkbait", "shaky_head_worm"],
        ["tube_jig", "squarebill_crankbait", "rabbit_strip_leech"],
        stainedColors(),
        ["hollow_body_frog", "walking_topwater"],
      );
    case "prespawn_opening":
      if (scenario.month === 2) {
        return expectation(
          "Late-winter Alabama river largemouth can still stay controlled on cold, cooling prespawn days, but one current-seam moving lane should remain present.",
          ["compact_flipping_jig", "spinnerbait", "woolly_bugger"],
          ["soft_jerkbait", "swim_jig", "rabbit_strip_leech", "squarebill_crankbait"],
          stainedColors(),
          ["hollow_body_frog"],
        );
      }
      return expectation(
        "Prespawn river largemouth should use current seams and softer edges with moving river-specific search lanes.",
        ["spinnerbait", "swim_jig", "soft_jerkbait"],
        ["squarebill_crankbait", "texas_rigged_soft_plastic_craw", "clouser_minnow"],
        stainedColors(),
        ["hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      if (scenario.month === 4 || scenario.month === 5) {
        return expectation(
          "Spring Alabama river largemouth can let a soft jerkbait lead on cleaner, more open seam days, but spinnerbait and swim jig should stay in the core story.",
          ["soft_jerkbait", "spinnerbait", "swim_jig"],
          ["squarebill_crankbait", "paddle_tail_swimbait", "compact_flipping_jig"],
          stainedColors(),
          ["hollow_body_frog"],
        );
      }
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
        ["squarebill_crankbait", "weightless_stick_worm", "clouser_minnow"],
        stainedColors(),
        ["drop_shot_worm", "blade_bait"],
      );
    case "fall_transition":
    default:
      if (scenario.month === 10 || scenario.month === 11) {
        return expectation(
          "Late-fall Alabama river largemouth can let soft jerkbait or clouser-style baitfish presentations lead on clear, glare-heavy current-edge days without losing the horizontal river story.",
          ["spinnerbait", "paddle_tail_swimbait", "soft_jerkbait", "clouser_minnow"],
          ["squarebill_crankbait", "bladed_jig", "game_changer"],
          colorSet("natural", "bright", "natural"),
          ["drop_shot_worm"],
        );
      }
      return expectation(
        "Fall river largemouth should open horizontal baitfish lanes around current edges without losing river-specific control.",
        ["spinnerbait", "paddle_tail_swimbait", "squarebill_crankbait"],
        ["bladed_jig", "soft_jerkbait", "clouser_minnow"],
        colorSet("natural", "bright", "natural"),
        ["drop_shot_worm"],
      );
  }
}

function newYorkLakeExpectation(scenario: LargemouthMatrixScenario): RecommenderAuditExpectation {
  switch (scenario.focus_window) {
    case "winter_control":
      return expectation(
        "Northern clear-water winter largemouth should stay disciplined around jerkbait, flat-side, and jig lanes.",
        ["suspending_jerkbait", "flat_sided_crankbait", "football_jig"],
        ["paddle_tail_swimbait", "drop_shot_worm", "clouser_minnow"],
        colorSet("natural", "natural", "natural"),
        ["walking_topwater", "hollow_body_frog"],
      );
    case "prespawn_opening":
      return expectation(
        "Northern prespawn largemouth should open carefully with cleaner baitfish and control lanes, not jump too shallow too fast.",
        ["suspending_jerkbait", "paddle_tail_swimbait", "football_jig"],
        ["flat_sided_crankbait", "drop_shot_worm", "rabbit_strip_leech"],
        clearColors(),
        ["hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Spawn and immediate postspawn in clear northern lakes should lean shallow target-fishing first, with swim jig and finesse worms in the core set; compact jig is allowed to lead on cold, windy April days or when crawfish-and-structure scoring favors a tighter cover read over roaming finesse.",
        [
          "weightless_stick_worm",
          "swim_jig",
          "compact_flipping_jig",
        ],
        ["paddle_tail_swimbait", "soft_jerkbait", "woolly_bugger"],
        colorSet("natural", "natural", "natural"),
        ["blade_bait"],
      );
    case "summer_positioning":
      if (scenario.month === 6) {
        return expectation(
          "Northern GLUM-zone early-summer largemouth can absolutely let walking topwater jump forward when the surface is truly open, but it still has to coexist with paddle-tail and finesse lanes.",
          [
            "paddle_tail_swimbait",
            "drop_shot_worm",
            "swim_jig",
            "weightless_stick_worm",
            "walking_topwater",
          ],
          ["hollow_body_frog", "woolly_bugger", "soft_jerkbait"],
          clearColors(),
          ["buzzbait", "prop_bait", "blade_bait"],
        );
      }
      if (scenario.month === 8) {
        return expectation(
          "Northern GLUM-zone late-summer largemouth on the current northeast seasonal row is a cleaner worm-and-soft-jerkbait story: the single stick worm, drop-shot, and soft jerkbait should do the heavy lifting, without forcing swim jig or paddle-tail lanes that are no longer in the eligible pool.",
          [
            "soft_jerkbait",
            "weightless_stick_worm",
            "drop_shot_worm",
          ],
          ["weightless_stick_worm", "shaky_head_worm", "carolina_rigged_stick_worm"],
          clearColors(),
          ["walking_topwater", "buzzbait", "prop_bait", "blade_bait"],
        );
      }
      return expectation(
        "Northern GLUM-zone midsummer largemouth should stay on paddle-tail, finesse, and swim-jig lanes unless the surface window is exceptionally clean and warming; these archived midsummer windows do not require walking topwater.",
        [
          "paddle_tail_swimbait",
          "drop_shot_worm",
          "swim_jig",
          "weightless_stick_worm",
        ],
        ["hollow_body_frog", "woolly_bugger", "soft_jerkbait"],
        clearColors(),
        ["walking_topwater", "buzzbait", "prop_bait", "blade_bait"],
      );
    case "fall_transition":
    default:
      if (scenario.month === 11) {
        return expectation(
          "Northern late-fall natural-lake largemouth can let suspending jerkbait and squarebill lead the baitfish story once November stays open but cool, while paddle-tail, spinnerbait, and swim jig remain valid follow-up lanes.",
          ["suspending_jerkbait", "squarebill_crankbait", "paddle_tail_swimbait", "spinnerbait", "swim_jig"],
          ["walking_topwater", "game_changer"],
          colorSet("natural", "natural", "bright"),
          ["texas_rigged_soft_plastic_craw"],
        );
      }
      return expectation(
        "Northern fall largemouth should center on spinnerbait-led baitfish transition lanes, with swim jig and paddle tail staying close behind along edges and remaining grass.",
        ["spinnerbait", "swim_jig", "paddle_tail_swimbait"],
        ["squarebill_crankbait", "suspending_jerkbait", "game_changer"],
        colorSet("natural", "natural", "bright"),
        ["texas_rigged_soft_plastic_craw"],
      );
  }
}

function michiganClearLakeExpectation(scenario: LargemouthMatrixScenario): RecommenderAuditExpectation {
  switch (scenario.focus_window) {
    case "prespawn_opening":
      return expectation(
        "Clear Michigan largemouth in winter should stay disciplined around jerkbait, flat-side, and football-jig lanes, with no fake warm-season surface behavior.",
        ["suspending_jerkbait", "flat_sided_crankbait", "football_jig"],
        ["paddle_tail_swimbait", "drop_shot_worm", "clouser_minnow"],
        clearColors(),
        ["walking_topwater", "hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Michigan spawn and immediate postspawn largemouth should stay shallow and target-oriented first, with one clean baitfish follow-up lane.",
        ["weightless_stick_worm", "swim_jig"],
        ["soft_jerkbait", "paddle_tail_swimbait", "woolly_bugger"],
        clearColors(),
        ["blade_bait"],
      );
    case "summer_positioning":
      return expectation(
        "Clear Michigan summer largemouth should favor weed-edge swim-jig, paddle-tail, and finesse lanes first; on this archived subtle clear-water window, true surface baits should not be required.",
        ["swim_jig", "paddle_tail_swimbait", "weightless_stick_worm", "drop_shot_worm"],
        ["soft_jerkbait", "woolly_bugger"],
        clearColors(),
        ["walking_topwater", "buzzbait", "prop_bait", "blade_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Michigan fall largemouth should tighten around baitfish transition lanes with swim jig, spinnerbait, and paddle tail leading the edge game.",
        ["spinnerbait", "swim_jig", "paddle_tail_swimbait"],
        ["squarebill_crankbait", "suspending_jerkbait", "game_changer"],
        colorSet("natural", "natural", "bright"),
        ["texas_rigged_soft_plastic_craw"],
      );
  }
}

function wisconsinWeedLakeExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "spawn_postspawn_transition":
      return expectation(
        "Wisconsin postspawn largemouth should still stay shallow and weed-edge oriented, with finesse and swim-jig lanes ahead of offshore or cold-water tools.",
        ["weightless_stick_worm", "swim_jig"],
        ["paddle_tail_swimbait", "soft_jerkbait", "woolly_bugger"],
        clearColors(),
        ["blade_bait"],
      );
    case "summer_positioning":
      return expectation(
        "Wisconsin clear weed-lake summer largemouth can still rotate between swim jig, a single finesse stick worm, and one clean surface lane, but suppressed bluebird days should let the finesse worm take over instead of forcing topwater.",
        ["swim_jig", "weightless_stick_worm", "walking_topwater"],
        ["hollow_body_frog", "paddle_tail_swimbait"],
        clearColors(),
        ["blade_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Wisconsin fall weed-lake largemouth should still center on horizontal edge lanes, but cooler or subtler archived days can let paddle-tail or suspending jerkbait edge ahead of spinnerbait while swim jig stays in the core story.",
        ["spinnerbait", "swim_jig", "paddle_tail_swimbait", "suspending_jerkbait"],
        ["walking_topwater", "hollow_body_frog", "squarebill_crankbait", "bladed_jig"],
        colorSet("natural", "natural", "bright"),
        ["blade_bait"],
      );
  }
}

function illinoisBackwaterRiverExpectation(
  scenario: LargemouthMatrixScenario,
): RecommenderAuditExpectation {
  const focus = scenario.focus_window;
  switch (focus) {
    case "winter_control":
      return expectation(
        "Illinois backwater winter largemouth should still read like river fish in slow water: controlled jig, jerkbait, and shaky-head lanes, not random summer slop tools.",
        ["compact_flipping_jig", "suspending_jerkbait", "shaky_head_worm"],
        ["spinnerbait", "squarebill_crankbait", "rabbit_strip_leech"],
        stainedColors(),
        ["hollow_body_frog", "walking_topwater"],
      );
    case "prespawn_opening":
      return expectation(
        "Prespawn Illinois backwater largemouth should open spinnerbait, bladed-jig, and compact cover lanes as the river warms without drifting into offshore finesse.",
        ["spinnerbait", "bladed_jig", "compact_flipping_jig"],
        ["swim_jig", "squarebill_crankbait", "clouser_minnow"],
        stainedColors(),
        ["hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Spring Illinois river-backwater largemouth should still fish around wood, eddies, and soft current with moving seam lanes and one controlled backup.",
        ["swim_jig", "spinnerbait", "compact_flipping_jig"],
        ["soft_jerkbait", "paddle_tail_swimbait", "weightless_stick_worm"],
        stainedColors(),
        ["hollow_body_frog"],
      );
    case "summer_positioning":
      return expectation(
        "Summer Illinois backwater largemouth should absolutely allow slop and ambush tools like frog, swim jig, and spinnerbait before trying to get cute with clean-water finesse.",
        ["hollow_body_frog", "swim_jig", "spinnerbait"],
        ["buzzbait", "weightless_stick_worm", "frog_fly"],
        colorSet("natural", "dark", "bright"),
        ["drop_shot_worm", "blade_bait"],
      );
    case "fall_transition":
      if (scenario.month === 11) {
        return expectation(
          "Late-fall Illinois backwater largemouth should tighten into slower wood, eddy, and current-break lanes, with compact jig control back in front of broad fall roaming.",
          ["compact_flipping_jig", "suspending_jerkbait", "spinnerbait"],
          ["bladed_jig", "squarebill_crankbait", "woolly_bugger"],
          colorSet("dark", "natural", "bright"),
          ["walking_topwater", "hollow_body_frog"],
        );
      }
      return expectation(
        "Fall Illinois backwater largemouth should open baitfish and current-break lanes with spinnerbait, bladed jig, and squarebill on top.",
        ["spinnerbait", "bladed_jig", "squarebill_crankbait"],
        ["paddle_tail_swimbait", "swim_jig", "clouser_minnow"],
        colorSet("natural", "bright", "dark"),
        ["drop_shot_worm"],
      );
    default:
      return alabamaRiverExpectation(focus);
  }
}

function ohioReservoirExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
    case "fall_transition":
      return expectation(
        "Ohio late-fall reservoir largemouth should stay on disciplined lower-column baitfish and jig lanes once true cold arrives, with football jig, finesse jig, and jerkbait all valid leaders depending on how subtle the archived day gets.",
        ["football_jig", "finesse_jig", "suspending_jerkbait", "flat_sided_crankbait"],
        ["shaky_head_worm", "drop_shot_worm", "paddle_tail_swimbait", "rabbit_strip_leech"],
        stainedColors(),
        ["walking_topwater", "hollow_body_frog"],
      );
    case "prespawn_opening":
      return expectation(
        "Ohio prespawn reservoir largemouth should open with jerkbait, spinnerbait, and football-jig lanes before broad summer search behavior.",
        ["suspending_jerkbait", "spinnerbait", "football_jig"],
        ["paddle_tail_swimbait", "flat_sided_crankbait", "swim_jig"],
        stainedColors(),
        ["hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Cold April Ohio reservoir largemouth can still fish like a late-prespawn transition day, with football jig and one tighter baitfish search lane ahead of true shallow target finesse.",
        ["football_jig", "lipless_crankbait", "texas_rigged_soft_plastic_craw"],
        ["spinnerbait", "compact_flipping_jig", "crawfish_streamer"],
        stainedColors(),
        ["walking_topwater", "blade_bait"],
      );
    case "summer_positioning":
      return expectation(
        "Ohio summer reservoir largemouth should lean structure, edge, and mid-depth baitfish lanes over southern-style pure slop and mat fishing.",
        ["swim_jig", "football_jig", "paddle_tail_swimbait"],
        ["deep_diving_crankbait", "weightless_stick_worm", "game_changer", "hollow_body_frog"],
        stainedColors(),
        ["buzzbait", "prop_bait"],
      );
    default:
      return expectation(
        "Ohio spring reservoir largemouth should balance target-fishing first with one clean horizontal baitfish follow-up lane.",
        ["weightless_stick_worm", "compact_flipping_jig", "swim_jig"],
        ["weightless_stick_worm", "paddle_tail_swimbait", "soft_jerkbait"],
        colorSet("natural", "natural", "bright"),
        ["blade_bait", "walking_topwater"],
      );
  }
}

function georgiaHighlandExpectation(focus: string): RecommenderAuditExpectation {
  if (focus === "winter_control") {
    return newYorkLakeExpectation("winter_control");
  }
  if (focus === "prespawn_opening") {
    return expectation(
      "Clear highland prespawn largemouth should favor baitfish and jerkbait lanes, but true cold-front conditions can still let football jig take the lead without breaking the seasonal story.",
      ["suspending_jerkbait", "flat_sided_crankbait", "paddle_tail_swimbait", "football_jig"],
      ["soft_jerkbait", "clouser_minnow"],
      clearColors(),
      ["hollow_body_frog"],
    );
  }
  if (focus === "spawn_postspawn_transition") {
    return expectation(
      "Georgia highland April-to-May largemouth should stay target-oriented first, but this is one of the southern spring windows where a frog can still be seasonally viable when low light and shallow cover line up.",
      ["compact_flipping_jig", "weightless_stick_worm", "swim_jig"],
      ["soft_jerkbait", "paddle_tail_swimbait", "woolly_bugger", "hollow_body_frog"],
      colorSet("natural", "natural", "natural"),
      ["squarebill_crankbait"],
    );
  }
  if (focus === "summer_positioning") {
    return expectation(
      "Clear highland summer largemouth should lean toward deeper structure and cover fishing with finesse backup options.",
      ["compact_flipping_jig", "football_jig", "soft_jerkbait"],
      ["swim_jig", "paddle_tail_swimbait", "game_changer"],
      clearColors(),
      ["buzzbait", "prop_bait"],
    );
  }
  return expectation(
    "Highland fall largemouth should center on shad-oriented moving lanes with a clean backup option.",
    ["squarebill_crankbait", "spinnerbait", "paddle_tail_swimbait"],
    ["soft_jerkbait", "suspending_jerkbait", "game_changer"],
    colorSet("natural", "natural", "bright"),
    ["hollow_body_frog"],
  );
}

function louisianaGrassExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "prespawn_opening":
      return expectation(
        "Dirty-to-stained southern prespawn grass bass should open visible grass and baitfish lanes without turning into winter bottom dragging; lipless can legitimately steal the lead on colder windy grass days.",
        ["spinnerbait", "bladed_jig", "compact_flipping_jig", "lipless_crankbait"],
        ["swim_jig", "paddle_tail_swimbait", "game_changer"],
        dirtyColors(),
        ["drop_shot_worm", "walking_topwater"],
      );
    case "summer_positioning":
      return expectation(
        "Warm southern grass largemouth should still favor visible shallow-cover and baitfish lanes, but the current seasonal pool on this archived neutral June window is more soft-jerkbait, spinnerbait, swim-jig, and medium-crank than true frog-only surface behavior.",
        ["soft_jerkbait", "spinnerbait", "swim_jig", "medium_diving_crankbait"],
        ["paddle_tail_swimbait", "weightless_stick_worm", "squarebill_crankbait"],
        colorSet("natural", "natural", "dark"),
        ["blade_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Southern grass fall largemouth should still favor visible shallow cover and horizontal baitfish lanes over dead-winter behavior, but suppressed late-fall windows can pull the lead back toward compact jig or paddle-tail control instead of forcing a surface-first read.",
        ["bladed_jig", "spinnerbait", "swim_jig", "compact_flipping_jig", "paddle_tail_swimbait"],
        ["walking_topwater", "hollow_body_frog", "rabbit_strip_leech", "popper_fly"],
        colorSet("dark", "bright", "natural"),
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
        colorSet("natural", "natural", "natural"),
        ["hollow_body_frog", "walking_topwater"],
      );
    case "prespawn_opening":
      return expectation(
        "Clear Ozarks prespawn largemouth should still be disciplined, with jerkbait and flat-side leading the lane.",
        ["suspending_jerkbait", "flat_sided_crankbait", "football_jig"],
        ["paddle_tail_swimbait", "soft_jerkbait", "clouser_minnow"],
        colorSet("natural", "natural", "natural"),
        ["hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Postspawn Ozarks largemouth should allow cleaner shad-following lanes with one controlled backup.",
        ["swim_jig", "paddle_tail_swimbait", "soft_jerkbait"],
        ["suspending_jerkbait", "weightless_stick_worm", "game_changer"],
        clearColors(),
        ["blade_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Fall Ozarks largemouth should strongly respect shad-transition lanes without collapsing into one moving bait only.",
        ["squarebill_crankbait", "spinnerbait", "paddle_tail_swimbait"],
        ["soft_jerkbait", "suspending_jerkbait", "game_changer"],
        colorSet("natural", "natural", "bright"),
        ["texas_rigged_soft_plastic_craw"],
      );
  }
}

function minnesotaExpectation(scenario: LargemouthMatrixScenario): RecommenderAuditExpectation {
  switch (scenario.focus_window) {
    case "spawn_postspawn_transition":
      return expectation(
        "Northern weedline largemouth around spawn/postspawn should stay shallow and target-oriented first.",
        ["weightless_stick_worm", "swim_jig"],
        ["paddle_tail_swimbait", "soft_jerkbait", "woolly_bugger"],
        clearColors(),
        ["blade_bait"],
      );
    case "summer_positioning":
      return expectation(
        "Northern weedline summer largemouth should stay weed-edge and bluegill-oriented first, with swim jig and weightless worm leading; these archived July and August windows do not need walking topwater to validate the pattern.",
        ["swim_jig", "weightless_stick_worm"],
        ["hollow_body_frog", "mouse_fly", "paddle_tail_swimbait", "weightless_stick_worm"],
        colorSet("natural", "natural", "natural"),
        ["blade_bait", "walking_topwater"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Northern early-fall weedline largemouth should open horizontal edge lanes through a cooler seasonal posture, with spinnerbait and swim jig ahead of the core story, but a walking topwater can still tag along as a warm-open secondary lane on this archived October window.",
        ["spinnerbait", "swim_jig"],
        ["paddle_tail_swimbait", "hollow_body_frog", "mouse_fly", "walking_topwater"],
        colorSet("natural", "natural", "bright"),
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
        "Summer Delta largemouth should favor grass/current ambush lanes and visible cover tools, and on surface-closed archived river days a soft jerkbait can legitimately outrank the frog while spinnerbait and swim jig stay in the core story.",
        ["swim_jig", "spinnerbait", "soft_jerkbait", "hollow_body_frog"],
        ["bladed_jig", "compact_flipping_jig", "game_changer"],
        colorSet("natural", "natural", "dark"),
        ["drop_shot_worm", "blade_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Fall Delta largemouth should still need visible horizontal or cover-oriented lanes rather than generic winter bottom reads.",
        ["bladed_jig", "compact_flipping_jig", "spinnerbait"],
        ["paddle_tail_swimbait", "rabbit_strip_leech", "game_changer"],
        colorSet("dark", "bright", "natural"),
        ["walking_topwater"],
      );
  }
}

function socalReservoirExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Mild-winter Southern California reservoir largemouth should stay lower-column and controlled; football jig leads active cold days, drop-shot wins when presentation locks fully subtle on the coldest archive days.",
        ["football_jig", "suspending_jerkbait", "flat_sided_crankbait", "drop_shot_worm"],
        ["compact_flipping_jig", "shaky_head_worm", "paddle_tail_swimbait"],
        stainedColors(),
        ["walking_topwater", "hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      // WESTERN_WARM spawns in May; April is PRESPAWN_LAKE with craw-primary, football_jig leads
      return expectation(
        "Southern California spring largemouth should still read prespawn-to-spawn first, but shallow cover and warming water can leave a real frog lane seasonally possible by late April into May even if it should not dominate every day.",
        ["football_jig", "spinnerbait", "suspending_jerkbait"],
        ["compact_flipping_jig", "swim_jig", "paddle_tail_swimbait", "hollow_body_frog"],
        colorSet("natural", "natural", "natural"),
        [],
      );
    case "summer_positioning":
      return expectation(
        "SoCal summer reservoir largemouth should stay shallow-cover and baitfish-oriented; swim jig and frog remain core, while walking topwater only truly leads when the daily surface window is open.",
        ["swim_jig", "hollow_body_frog", "walking_topwater"],
        ["buzzbait", "prop_bait", "paddle_tail_swimbait", "compact_flipping_jig"],
        colorSet("natural", "natural", "bright"),
        ["blade_bait", "drop_shot_worm"],
      );
    case "fall_transition":
    default:
      return expectation(
        "Fall Southern California reservoir largemouth should open baitfish-chasing lanes with spinnerbait and swim jig leading the horizontal search.",
        ["spinnerbait", "swim_jig", "paddle_tail_swimbait"],
        ["bladed_jig", "walking_topwater", "game_changer"],
        colorSet("natural", "bright", "natural"),
        ["blade_bait"],
      );
  }
}

function pnwBassLakeExpectation(scenario: LargemouthMatrixScenario): RecommenderAuditExpectation {
  switch (scenario.focus_window) {
    case "prespawn_opening":
      // WESTERN_INLAND spawns in June; March is PRESPAWN_LAKE, crawfish-primary, football_jig leads
      return expectation(
        "March Pacific Northwest bass lake is deep prespawn, but stained, bolder archived days can let squarebill jump out front while football jig, spinnerbait, and suspending jerkbait still define the core prespawn story.",
        ["football_jig", "spinnerbait", "suspending_jerkbait", "squarebill_crankbait"],
        ["compact_flipping_jig", "swim_jig", "paddle_tail_swimbait"],
        colorSet("natural", "natural", "natural"),
        ["hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      // WESTERN_INLAND spawns in June; May is still PRESPAWN_LAKE (months [3,4,5])
      return expectation(
        "May Pacific Northwest bass lake is late prespawn — WESTERN_INLAND fish don't spawn until June; football jig still leads with craw-first posture, but spinnerbait and swim jig build as activating pre-spawn search lanes.",
        ["football_jig", "spinnerbait", "swim_jig"],
        ["compact_flipping_jig", "paddle_tail_swimbait", "suspending_jerkbait"],
        colorSet("natural", "natural", "natural"),
        ["hollow_body_frog"],
      );
    case "summer_positioning":
      return expectation(
        "Summer PNW bass lake should be in active shallow mode, but this archived Oregon window still reads more frog-and-swim-jig than true walking- or prop-bait surface cadence.",
        ["swim_jig", "hollow_body_frog"],
        ["buzzbait", "paddle_tail_swimbait", "bladed_jig"],
        colorSet("natural", "natural", "bright"),
        ["blade_bait", "drop_shot_worm", "walking_topwater", "prop_bait"],
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

function coloradoBassLakeExpectation(scenario: LargemouthMatrixScenario): RecommenderAuditExpectation {
  switch (scenario.focus_window) {
    case "prespawn_opening":
      // February is WINTER_LAKE [1,2] for mountain_west; prespawn row doesn't open until March
      return expectation(
        "February Colorado highland reservoir largemouth is fully in winter posture — football jig leads most days, but drop-shot wins on the coldest extreme-bottom days when subtle presentation locks in and finesse edges out the jig.",
        ["football_jig", "suspending_jerkbait", "flat_sided_crankbait", "drop_shot_worm"],
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
        colorSet("natural", "natural", "natural"),
        ["hollow_body_frog"],
      );
    case "summer_positioning":
      return expectation(
        "Colorado highland reservoir summer largemouth should still be active, but this archived clear-water mountain window is not a true walking- or prop-bait surface setup; swim jig, hollow frog, and paddle-tail should lead, while a drop-shot can still linger only as a lower-ranked subtle backup when the high-elevation midsummer day tightens up.",
        ["swim_jig", "hollow_body_frog", "paddle_tail_swimbait"],
        ["compact_flipping_jig", "drop_shot_worm"],
        clearColors(),
        ["blade_bait", "walking_topwater", "buzzbait", "prop_bait"],
      );
    case "fall_transition":
    default:
      return expectation(
        "October Colorado highland reservoir fall largemouth should open spinnerbait and baitfish-following lanes with clean natural colors, but subtle clear-water days can still let suspending jerkbait nosedive to the top of the same shad-following story.",
        ["spinnerbait", "swim_jig", "paddle_tail_swimbait", "suspending_jerkbait"],
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
      // NORTHERN_CLEAR_SPAWN_LAKE [4,5]: weightless_stick_worm(0), swim_jig, compact_flipping_jig
      // Finesse-spawn posture: stick worms lead on active days, but compact jig wins when
      // crawfish-primary forage scoring edges out the stick worm on pre-spawn structure days
      return expectation(
        "Northeast clear-lake spawn and postspawn largemouth should open with finesse stick-worm lanes first; compact jig surfaces when crawfish-primary forage scoring edges it ahead of stick worms, and soft jerkbait can steal the lead on cleaner warming days that pull fish higher.",
        ["weightless_stick_worm", "swim_jig", "compact_flipping_jig", "soft_jerkbait"],
        ["paddle_tail_swimbait", "woolly_bugger"],
        colorSet("natural", "natural", "natural"),
        ["hollow_body_frog", "blade_bait"],
      );
    case "summer_positioning":
      // NORTHERN_CLEAR_SUMMER_LAKE [6,7]: weightless_stick_worm(0), drop_shot, swim_jig
      // bluegill_perch primary forage, base_presentation=subtle
      // On hot bluebird days: active mood + bluegill_perch forage → swim_jig (natural colors) surfaces
      return expectation(
        "Northeast clear-lake summer largemouth: the single stick worm leads on subtle days, while swim jig with perch/bluegill colors takes over on hot bluebird days when active mood and bluegill_perch forage scoring push horizontal presentations ahead of finesse.",
        ["weightless_stick_worm", "drop_shot_worm", "swim_jig"],
        ["soft_jerkbait", "game_changer"],
        colorSet("natural", "natural", "natural", "natural"),
        ["hollow_body_frog", "buzzbait", "prop_bait", "blade_bait"],
      );
    case "fall_transition":
    default:
      // NORTHERN_CLEAR_FALL_LAKE [11]: spinnerbait(0), swim_jig, squarebill — mid/active/balanced
      // KEY DIFFERENCE from GLUM: northeast November is FALL not WINTER (active vs locked-down)
      return expectation(
        "Northeast November clear-lake largemouth stays in active fall posture, but clear-water late-fall days can still let suspending jerkbait and squarebill edge ahead while spinnerbait, swim jig, and paddle-tail remain part of the same baitfish story.",
        ["spinnerbait", "swim_jig", "squarebill_crankbait", "suspending_jerkbait", "paddle_tail_swimbait"],
        ["game_changer"],
        colorSet("natural", "natural", "bright"),
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
        "Gulf Coast dirty prespawn grass lake fires the GULF_DIRTY_PRESPAWN pool: all lures are dirty-friendly so position dominates, and lipless can take over on the coldest windy prespawn grass days.",
        ["spinnerbait", "bladed_jig", "compact_flipping_jig", "swim_jig", "lipless_crankbait"],
        ["paddle_tail_swimbait", "clouser_minnow"],
        colorSet("bright", "natural", "dark"),
        ["suspending_jerkbait", "football_jig", "hollow_body_frog"],
      );
    case "spawn_postspawn_transition":
      return expectation(
        "Gulf Coast spring grass largemouth should still be shallow-cover and baitfish-friendly first, but by April and especially May a frog can be seasonally viable around emergent grass when the same-day surface gate stays open.",
        ["compact_flipping_jig", "swim_jig", "spinnerbait", "paddle_tail_swimbait"],
        ["hollow_body_frog", "frog_fly", "game_changer"],
        colorSet("bright", "natural", "dark"),
        ["blade_bait"],
      );
    case "fall_transition":
    default:
      // month 9: EARLY_FALL_GRASS_LAKE fires (shallow/active/balanced, baitfish primary)
      // squarebill gets the real dirty-water penalty; walking_topwater can still
      // survive as a situational shallow active option even in dirty grass.
      // month 10: FALL_LAKE fires (mid/active/balanced); spinnerbait(0)+bonus dominates
      return expectation(
        "Gulf Coast dirty fall grass lake should still favor dirty-friendly grass tools first, but once October knocks fish lower the core story can tighten around paddle-tail, spinnerbait, bladed jig, and swim-jig control instead of forcing a surface-first grass read.",
        ["swim_jig", "spinnerbait", "bladed_jig", "hollow_body_frog", "buzzbait", "prop_bait", "paddle_tail_swimbait"],
        ["lipless_crankbait", "game_changer", "walking_topwater", "suspending_jerkbait"],
        colorSet("bright", "natural", "dark"),
        ["squarebill_crankbait"],
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
        "Midwest dirty backwater prespawn: football jig holds at position 0 via crawfish forage match plus dirty bonus; spinnerbait and bladed jig surface with dirty clarity boost but lack the forage alignment; suspending jerkbait can still linger as a lower-ranked control backup on nasty transition days.",
        ["football_jig", "texas_rigged_soft_plastic_craw", "spinnerbait", "bladed_jig"],
        ["lipless_crankbait", "compact_flipping_jig", "woolly_bugger", "suspending_jerkbait"],
        dirtyColors(),
        ["squarebill_crankbait", "walking_topwater"],
      );
    case "summer_positioning":
      // SUMMER_LAKE fires for midwest_interior months 7/8 (shallow/active/bold, baitfish primary)
      // walking_topwater(0) gets dirty PENALTY → displaced by buzzbait(2)/hollow_body_frog(3)/swim_jig(4)
      // popping_topwater(1) gets dirty BONUS (clarity_strengths includes dirty) and is next in pool
      // deep_diving_crankbait gets penalty
      return expectation(
        "Midwest dirty backwater summer: walking topwater and prop bait both drop off in dirty water; popping topwater, buzzbait, hollow body frog, and swim jig carry the real dirty-water surface and cover bonuses.",
        ["popping_topwater", "buzzbait", "hollow_body_frog", "swim_jig"],
        ["paddle_tail_swimbait", "weightless_stick_worm", "frog_fly"],
        colorSet("bright", "dark", "natural", "natural"),
        ["walking_topwater", "prop_bait", "deep_diving_crankbait", "blade_bait"],
      );
    case "fall_transition":
    default:
      // FALL_LAKE fires for midwest_interior months 9/10 (shallow/active/balanced, baitfish primary)
      // spinnerbait(0) gets dirty bonus → dominates; bladed_jig(1)+bonus; suspending/squarebill/walking_topwater penalized
      return expectation(
        "Midwest dirty backwater fall: spinnerbait at position 0 with dirty clarity bonus dominates the FALL_LAKE pool; bladed jig and lipless crankbait round out the dirty-water baitfish set; clear-water lures are suppressed.",
        ["spinnerbait", "bladed_jig", "lipless_crankbait", "paddle_tail_swimbait"],
        ["swim_jig", "compact_flipping_jig", "clouser_minnow"],
        colorSet("natural", "bright", "dark"),
        ["suspending_jerkbait", "squarebill_crankbait", "walking_topwater"],
      );
  }
}

function expectationForScenario(scenario: LargemouthMatrixScenario): RecommenderAuditExpectation {
  switch (scenario.anchor_key as LargemouthAuditAnchorKey) {
    case "florida_lake":
      return floridaLakeExpectation(scenario, scenario.default_clarity);
    case "texas_reservoir":
      return texasReservoirExpectation(scenario, scenario.default_clarity);
    case "alabama_river":
      return alabamaRiverExpectation(scenario);
    case "new_york_natural_lake":
      return newYorkLakeExpectation(scenario);
    case "michigan_clear_natural_lake":
      return michiganClearLakeExpectation(scenario);
    case "wisconsin_clear_weed_lake":
      return wisconsinWeedLakeExpectation(scenario.focus_window);
    case "illinois_backwater_river":
      return illinoisBackwaterRiverExpectation(scenario);
    case "ohio_reservoir":
      return ohioReservoirExpectation(scenario.focus_window);
    case "pennsylvania_natural_lake":
      return newYorkLakeExpectation(scenario);
    case "georgia_highland":
      return georgiaHighlandExpectation(scenario.focus_window);
    case "louisiana_grass_lake":
      return louisianaGrassExpectation(scenario.focus_window);
    case "ozarks_reservoir":
      return ozarksExpectation(scenario.focus_window);
    case "minnesota_weed_lake":
      return minnesotaExpectation(scenario);
    case "california_delta":
      return deltaExpectation(scenario.focus_window, scenario.default_clarity);
    case "socal_reservoir":
      return socalReservoirExpectation(scenario.focus_window);
    case "pnw_bass_lake":
      return pnwBassLakeExpectation(scenario);
    case "colorado_bass_lake":
      return coloradoBassLakeExpectation(scenario);
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
