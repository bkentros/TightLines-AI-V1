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
  PIKE_FULL_AUDIT_MATRIX,
  type PikeAuditAnchorKey,
  type PikeMatrixScenario,
} from "./pikeAuditMatrix.ts";

function priorityFor(role: PikeMatrixScenario["matrix_role"]): RecommenderAuditRegionPriority {
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

/**
 * Stained-water pike color priority: bright is the clarity strength,
 * natural is the forage-natural fallback, natural rounds the set.
 */
function stainedPikeColors(): ResolvedColorThemeV3[] {
  return colorSet("dark", "bright");
}

/**
 * Clear-water pike color priority: natural is the clarity strength,
 * natural and natural as clean-baitfish fallbacks (paddle_tail produces
 * natural in clear water), bright last.
 */
function clearPikeColors(): ResolvedColorThemeV3[] {
  return colorSet("natural", "dark");
}

// ---------------------------------------------------------------------------
// Minnesota northwoods lake — stained, freshwater_lake_pond, NORTHERN_CORE
// Archive resolves to great_lakes_upper_midwest (same as LMB NY precedent)
//
// Row groupings (pike.ts NORTHERN_CORE lake):
//   [1,2]    → WINTER_LAKE, mood=negative  → suspending_jerkbait gains mood edge
//   [3,4]    → SPRING_LAKE, mood=neutral   → pike_jerkbait wins by position
//   [5,6,7]  → SUMMER_LAKE, mood=active    → large_profile wins by position
//   [8,9,10] → FALL_LAKE, mood=active+bold → large_profile wins by position
//   [11,12]  → WINTER_LAKE, mood=neutral   → pike_jerkbait wins by position
// ---------------------------------------------------------------------------
function mnNorthwoodsLakeExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      // Month 1: negative mood → suspending gains +1.75; pike_jerkbait fallback
      // Month 12: neutral mood → pike_jerkbait wins by position, but extreme cold (19F) archive
      //           date pushes water_column to bottom → blade_bait wins by water-column fit
      return expectation(
        "Northern stained pike lake in winter: suspending_jerkbait leads on negative-mood January days; pike_jerkbait owns neutral December; blade_bait surfaces on extreme cold bottom-column pushes.",
        ["pike_jerkbait", "suspending_jerkbait", "blade_bait"],
        ["large_profile_pike_swimbait", "casting_spoon", "pike_bunny_streamer"],
        stainedPikeColors(),
      );
    case "prespawn_opening":
      // Month 2: WINTER_LAKE, negative mood → suspending likely leads
      // Month 3: SPRING_LAKE, neutral mood → pike_jerkbait leads
      return expectation(
        "February still carries negative-mood winter posture favoring suspending; March opens the spring pool where pike_jerkbait leads at position zero.",
        ["pike_jerkbait", "suspending_jerkbait", "large_profile_pike_swimbait"],
        ["spinnerbait", "paddle_tail_swimbait", "pike_bunny_streamer"],
        stainedPikeColors(),
      );
    case "spawn_postspawn_transition":
      // Month 4: SPRING_LAKE, neutral → pike_jerkbait
      // Month 5: SUMMER_LAKE, active → large_profile
      return expectation(
        "April through May spans spring-to-summer transition: pike_jerkbait leads in the neutral spring pool; large_profile_pike_swimbait takes position zero as summer activity ramps in May.",
        ["pike_jerkbait", "large_profile_pike_swimbait", "spinnerbait"],
        ["paddle_tail_swimbait", "soft_jerkbait", "pike_bunny_streamer"],
        stainedPikeColors(),
      );
    case "summer_positioning":
      // Month 6, 7: SUMMER_LAKE, active → large_profile
      // Month 8: FALL_LAKE, active+bold → large_profile
      return expectation(
        "Active summer and early-fall stained pike lake: large_profile_pike_swimbait holds position zero across the full summer-fall stretch; pike_jerkbait is the locked-in runner-up.",
        ["large_profile_pike_swimbait", "pike_jerkbait", "spinnerbait"],
        ["paddle_tail_swimbait", "walking_topwater", "large_articulated_pike_streamer"],
        stainedPikeColors(),
      );
    case "fall_transition":
    default:
      // Month 9, 10: FALL_LAKE, active+bold → large_profile
      // Month 11: WINTER_LAKE, neutral → pike_jerkbait
      return expectation(
        "September and October bold fall posture keeps large_profile at the front; November neutral WINTER pool returns pike_jerkbait to the top slot.",
        ["large_profile_pike_swimbait", "pike_jerkbait", "paddle_tail_swimbait"],
        ["spinnerbait", "casting_spoon", "large_articulated_pike_streamer"],
        stainedPikeColors(),
      );
  }
}

// ---------------------------------------------------------------------------
// New York Adirondack lake — clear, freshwater_lake_pond, NORTHERN_CORE
// Archive likely resolves to great_lakes_upper_midwest (same GLUM coordinate zone)
// Same row structure as MN lake; differs only in clarity-driven color theme.
// ---------------------------------------------------------------------------
function nyAdirondackLakeExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      return expectation(
        "Clear northern pike lake in January cold posture: suspending_jerkbait earns the negative-mood edge; pike_jerkbait reclaims top slot in December neutral.",
        ["pike_jerkbait", "suspending_jerkbait", "large_profile_pike_swimbait"],
        ["casting_spoon", "blade_bait", "pike_bunny_streamer"],
        clearPikeColors(),
      );
    case "prespawn_opening":
      return expectation(
        "Clear Adirondack prespawn: February negative-mood winter pool favors suspending; March neutral spring pool gives pike_jerkbait the positional lead.",
        ["pike_jerkbait", "suspending_jerkbait", "large_profile_pike_swimbait"],
        ["paddle_tail_swimbait", "soft_jerkbait", "pike_bunny_streamer"],
        clearPikeColors(),
      );
    case "spawn_postspawn_transition":
      // Month 4 (30°F archive): daily mood pushes down_1 → resolved negative → suspending wins
      // Month 5: SUMMER_LAKE active → large_profile wins by position
      return expectation(
        "April to May clear Adirondack transition: a cold April day with negative-mood push gives suspending_jerkbait the edge; pike_jerkbait leads on neutral spring days; large_profile takes over as summer activity opens in May.",
        ["pike_jerkbait", "suspending_jerkbait", "large_profile_pike_swimbait"],
        ["spinnerbait", "paddle_tail_swimbait", "pike_bunny_streamer"],
        clearPikeColors(),
      );
    case "summer_positioning":
      // Most days: large_profile wins (position 0 in SUMMER/FALL pools)
      // Subtle-presentation push (hot day + subtler nudge): paddle_tail_swimbait gains
      //   +0.45 base advantage and wins when presentation resolves to subtle
      return expectation(
        "Clear northern lake active summer: large_profile leads on active-balanced days; paddle_tail_swimbait surfaces when conditions push presentation to subtle; pike_jerkbait is always close.",
        ["large_profile_pike_swimbait", "pike_jerkbait", "paddle_tail_swimbait"],
        ["spinnerbait", "walking_topwater", "large_articulated_pike_streamer"],
        clearPikeColors(),
      );
    case "fall_transition":
    default:
      return expectation(
        "Adirondack fall pike in clear water: September–October bold posture locks in large_profile; November neutral WINTER pool puts pike_jerkbait back on top.",
        ["large_profile_pike_swimbait", "pike_jerkbait", "paddle_tail_swimbait"],
        ["spinnerbait", "casting_spoon", "large_articulated_pike_streamer"],
        clearPikeColors(),
      );
  }
}

// ---------------------------------------------------------------------------
// Rainy River — stained, freshwater_river, NORTHERN_CORE
// Archive resolves to great_lakes_upper_midwest
//
// Row groupings (pike.ts NORTHERN_CORE river):
//   [1,2]    → WINTER_RIVER, mood=negative  → suspending_jerkbait gains edge
//   [3,4]    → SPRING_RIVER, mood=neutral   → pike_jerkbait at position 0
//   [5,6,7]  → SUMMER_RIVER, mood=active    → pike_jerkbait at position 0 (!)
//   [8,9,10] → FALL_RIVER, mood=active+bold → large_profile at position 0
//   [11,12]  → WINTER_RIVER, mood=neutral   → pike_jerkbait at position 0
// ---------------------------------------------------------------------------
function rainyRiverExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "winter_control":
      // Jan: negative → suspending; Dec: neutral WINTER_RIVER → pike_jerkbait
      return expectation(
        "Northern river pike winter posture: January negative mood gives suspending_jerkbait its clearest win; December neutral pulls pike_jerkbait back to position zero.",
        ["pike_jerkbait", "suspending_jerkbait", "large_profile_pike_swimbait"],
        ["casting_spoon", "blade_bait", "pike_bunny_streamer"],
        stainedPikeColors(),
      );
    case "prespawn_opening":
      // Feb: negative WINTER_RIVER → suspending; Mar: SPRING_RIVER, neutral → pike_jerkbait
      return expectation(
        "February river pike still in cold negative posture favoring suspending; March spring river pool opens with pike_jerkbait and spinnerbait leading current-seam lanes.",
        ["pike_jerkbait", "suspending_jerkbait", "spinnerbait"],
        ["paddle_tail_swimbait", "soft_jerkbait", "pike_bunny_streamer"],
        stainedPikeColors(),
      );
    case "spawn_postspawn_transition":
      // Apr: SPRING_RIVER, neutral → pike_jerkbait; May: SUMMER_RIVER, active → pike_jerkbait (pos 0)
      return expectation(
        "Spring river pike from April through May: pike_jerkbait holds position zero in both the neutral spring and active summer river pools; spinnerbait and paddle_tail follow in the current-seam lane.",
        ["pike_jerkbait", "spinnerbait", "paddle_tail_swimbait"],
        ["soft_jerkbait", "large_profile_pike_swimbait", "pike_bunny_streamer"],
        stainedPikeColors(),
      );
    case "summer_positioning":
      // Jun, Jul: SUMMER_RIVER, active → pike_jerkbait (position 0 in SUMMER_RIVER_LURES)
      // Aug: FALL_RIVER, active+bold → large_profile (position 0 in FALL_RIVER_LURES)
      return expectation(
        "River summer pool keeps pike_jerkbait at position zero through June and July; August shifts to the FALL_RIVER pool where large_profile_pike_swimbait takes the lead.",
        ["pike_jerkbait", "large_profile_pike_swimbait", "spinnerbait"],
        ["paddle_tail_swimbait", "walking_topwater", "large_articulated_pike_streamer"],
        stainedPikeColors(),
      );
    case "fall_transition":
    default:
      // Sep, Oct: FALL_RIVER, active+bold → large_profile; Nov: WINTER_RIVER, neutral → pike_jerkbait
      return expectation(
        "Fall river pike: September–October bold FALL_RIVER posture locks large_profile at the front; November neutral WINTER_RIVER gives pike_jerkbait the positional lead.",
        ["large_profile_pike_swimbait", "pike_jerkbait", "paddle_tail_swimbait"],
        ["spinnerbait", "casting_spoon", "large_articulated_pike_streamer"],
        stainedPikeColors(),
      );
  }
}

// ---------------------------------------------------------------------------
// Alaska pike lake — stained, freshwater_lake_pond, alaska (NORTHERN_CORE)
// Overlay months: [5, 7, 9, 11]
//   Month 5  → spawn_postspawn_transition → SUMMER_LAKE [5,6,7], active  → large_profile
//   Month 7  → summer_positioning        → SUMMER_LAKE,          active  → large_profile
//   Month 9  → fall_transition           → FALL_LAKE [8,9,10],   active+bold → large_profile
//   Month 11 → fall_transition           → WINTER_LAKE [11,12],  neutral → pike_jerkbait
// ---------------------------------------------------------------------------
function alaskaPikeLakeExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "spawn_postspawn_transition":
      // Month 5: SUMMER_LAKE, active → large_profile leads
      return expectation(
        "Alaska May open-water pike: active summer lake pool under extreme northern photoperiod; large_profile_pike_swimbait leads at position zero.",
        ["large_profile_pike_swimbait", "pike_jerkbait", "spinnerbait"],
        ["paddle_tail_swimbait", "hollow_body_frog", "pike_bunny_streamer"],
        stainedPikeColors(),
      );
    case "summer_positioning":
      // Month 7: SUMMER_LAKE, active → large_profile leads
      return expectation(
        "Alaska midsummer lake: active posture keeps large_profile_pike_swimbait at position zero through the compressed northern open-water window.",
        ["large_profile_pike_swimbait", "pike_jerkbait", "spinnerbait"],
        ["paddle_tail_swimbait", "walking_topwater", "large_articulated_pike_streamer"],
        stainedPikeColors(),
      );
    case "fall_transition":
    default:
      // Month 9: FALL_LAKE active+bold → large_profile leads
      // Month 11: WINTER_LAKE neutral → pike_jerkbait leads; but at -3.6°F archive date
      //   daily mood+water_column push sends resolved profile to bottom/negative → blade_bait wins
      return expectation(
        "Alaska fall shoulder: September active-bold FALL_LAKE gives large_profile the top slot; November can swing between pike_jerkbait and blade_bait depending on how extreme the cold push is.",
        ["large_profile_pike_swimbait", "pike_jerkbait", "blade_bait"],
        ["paddle_tail_swimbait", "casting_spoon", "large_articulated_pike_streamer"],
        stainedPikeColors(),
      );
  }
}

// ---------------------------------------------------------------------------
// North Dakota reservoir — stained, freshwater_lake_pond, midwest_interior (INTERIOR_EDGE)
// Overlay months: [2, 5, 8, 10]
//
// Row groupings (pike.ts INTERIOR_EDGE lake):
//   [1,2,3]   → WINTER_LAKE, mood=negative   → suspending gains edge
//   [4,5,6]   → SPRING_LAKE, mood=neutral    → pike_jerkbait at position 0
//   [7,8]     → FALL_LAKE,   mood=neutral    → large_profile at position 0
//   [9,10,11] → FALL_LAKE,   mood=active+bold → large_profile at position 0
//   [12]      → WINTER_LAKE, mood=negative   → suspending gains edge
// ---------------------------------------------------------------------------
function northDakotaReservoirExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "prespawn_opening":
      // Month 2: INTERIOR_EDGE [1,2,3] → WINTER_LAKE, mood=negative → suspending likely wins
      return expectation(
        "Interior-edge late-winter reservoir: negative-mood posture keeps pike slow and low; suspending_jerkbait earns the mood advantage with pike_jerkbait as the stable positional fallback.",
        ["suspending_jerkbait", "pike_jerkbait", "large_profile_pike_swimbait"],
        ["casting_spoon", "blade_bait", "pike_bunny_streamer"],
        stainedPikeColors(),
      );
    case "spawn_postspawn_transition":
      // Month 5: INTERIOR_EDGE [4,5,6] → SPRING_LAKE, mood=neutral → pike_jerkbait leads by position
      //   but 46°F archive date with down_1 mood push → resolved negative → suspending_jerkbait wins
      return expectation(
        "Interior-edge spring reservoir: pike_jerkbait leads on neutral-mood spring days; a cold-front mood push sends suspending_jerkbait to the top when conditions go negative.",
        ["pike_jerkbait", "suspending_jerkbait", "large_profile_pike_swimbait"],
        ["spinnerbait", "paddle_tail_swimbait", "pike_bunny_streamer"],
        stainedPikeColors(),
      );
    case "summer_positioning":
      // Month 8: INTERIOR_EDGE [7,8] → FALL_LAKE, mood=neutral → large_profile wins by position
      return expectation(
        "Interior-edge summer heat compresses the season into an early fall-pool read: large_profile_pike_swimbait holds position zero in the neutral mid-column posture.",
        ["large_profile_pike_swimbait", "pike_jerkbait", "paddle_tail_swimbait"],
        ["spinnerbait", "casting_spoon", "large_articulated_pike_streamer"],
        stainedPikeColors(),
      );
    case "fall_transition":
    default:
      // Month 10: INTERIOR_EDGE [9,10,11] → FALL_LAKE, mood=active+bold → large_profile wins
      return expectation(
        "Interior-edge October active feedup: bold FALL_LAKE posture locks large_profile_pike_swimbait at position zero with pike_jerkbait close behind.",
        ["large_profile_pike_swimbait", "pike_jerkbait", "paddle_tail_swimbait"],
        ["spinnerbait", "casting_spoon", "large_articulated_pike_streamer"],
        stainedPikeColors(),
      );
  }
}

// ---------------------------------------------------------------------------
// Idaho mountain river — clear, freshwater_river, inland_northwest (MOUNTAIN)
// Overlay months: [4, 7, 9, 12]
//
// Row groupings (pike.ts MOUNTAIN river):
//   [1,2,3,12] → WINTER_RIVER, mood=negative → suspending gains edge
//   [4,5]      → SPRING_RIVER, mood=neutral  → pike_jerkbait at position 0
//   [6,7,8]    → SUMMER_RIVER, mood=active   → pike_jerkbait at position 0
//   [9,10,11]  → FALL_RIVER, mood=active+bold → large_profile at position 0
// ---------------------------------------------------------------------------
function idahoMountainRiverExpectation(focus: string): RecommenderAuditExpectation {
  switch (focus) {
    case "spawn_postspawn_transition":
      // Month 4: MOUNTAIN [4,5] → SPRING_RIVER, mood=neutral → pike_jerkbait at position 0
      return expectation(
        "Mountain clear-river April: neutral spring-river pool puts pike_jerkbait at position zero; spinnerbait as the current-seam lateral alternative.",
        ["pike_jerkbait", "spinnerbait", "paddle_tail_swimbait"],
        ["soft_jerkbait", "large_profile_pike_swimbait", "pike_bunny_streamer"],
        clearPikeColors(),
      );
    case "summer_positioning":
      // Month 7: MOUNTAIN [6,7,8] → SUMMER_RIVER, mood=active → pike_jerkbait at position 0
      //   but subtler presentation nudge can push paddle_tail_swimbait ahead when
      //   resolved presentation = subtle (pike_jerkbait prefers balanced/bold)
      return expectation(
        "Mountain clear river summer: pike_jerkbait holds position zero on balanced/bold days; a subtle presentation push surfaces paddle_tail_swimbait when conditions call for a softer retrieve.",
        ["pike_jerkbait", "paddle_tail_swimbait", "spinnerbait"],
        ["large_profile_pike_swimbait", "walking_topwater", "large_articulated_pike_streamer"],
        clearPikeColors(),
      );
    case "fall_transition":
      // Month 9: MOUNTAIN [9,10,11] → FALL_RIVER, mood=active+bold → large_profile at position 0
      return expectation(
        "Mountain river September active-bold fall: FALL_RIVER pool gives large_profile_pike_swimbait the lead in clear cold high-gradient flows.",
        ["large_profile_pike_swimbait", "pike_jerkbait", "paddle_tail_swimbait"],
        ["spinnerbait", "casting_spoon", "large_articulated_pike_streamer"],
        clearPikeColors(),
      );
    case "winter_control":
    default:
      // Month 12: MOUNTAIN [1,2,3,12] → WINTER_RIVER, mood=negative → suspending gains edge
      return expectation(
        "Mountain river December cold: negative-mood WINTER_RIVER pool gives suspending_jerkbait the mood advantage; pike_jerkbait as the neutral-condition positional backup.",
        ["suspending_jerkbait", "pike_jerkbait", "large_profile_pike_swimbait"],
        ["casting_spoon", "blade_bait", "pike_bunny_streamer"],
        clearPikeColors(),
      );
  }
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------
function expectationForScenario(scenario: PikeMatrixScenario): RecommenderAuditExpectation {
  switch (scenario.anchor_key as PikeAuditAnchorKey) {
    case "minnesota_northwoods_lake":
      return mnNorthwoodsLakeExpectation(scenario.focus_window);
    case "new_york_adirondack_lake":
      return nyAdirondackLakeExpectation(scenario.focus_window);
    case "rainy_river_pike":
      return rainyRiverExpectation(scenario.focus_window);
    case "alaska_pike_lake":
      return alaskaPikeLakeExpectation(scenario.focus_window);
    case "north_dakota_reservoir":
      return northDakotaReservoirExpectation(scenario.focus_window);
    case "idaho_mountain_river":
      return idahoMountainRiverExpectation(scenario.focus_window);
  }
}

export const PIKE_V3_MATRIX_AUDIT_SCENARIOS: readonly ArchivedRecommenderAuditScenario[] =
  PIKE_FULL_AUDIT_MATRIX.map((scenario) => ({
    id: scenario.id,
    label: scenario.label,
    priority: priorityFor(scenario.matrix_role),
    latitude: scenario.latitude,
    longitude: scenario.longitude,
    state_code: scenario.state_code,
    timezone: scenario.timezone,
    local_date: scenario.local_date,
    species: "pike_musky" as const,
    context: scenario.context,
    water_clarity: scenario.default_clarity,
    expectation: expectationForScenario(scenario),
  }));
