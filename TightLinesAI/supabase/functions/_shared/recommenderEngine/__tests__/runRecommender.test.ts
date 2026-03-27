import { assert, assertEquals } from "jsr:@std/assert";
import { buildSharedEngineRequestFromEnvData } from "../../howFishingEngine/request/buildFromEnvData.ts";
import type { PresentationArchetypeScore } from "../contracts.ts";
import { rankFamilies } from "../families.ts";
import type { BehaviorResolution } from "../modifiers.ts";
import { runRecommender } from "../runRecommender.ts";

function dailySeries(base: number, dayMinus2: number, dayMinus1: number, today: number): number[] {
  const values = Array.from({ length: 21 }, () => base);
  values[12] = dayMinus2;
  values[13] = dayMinus1;
  values[14] = today;
  return values;
}

function envFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    timezone: "America/New_York",
    weather: {
      temperature: 62,
      pressure: 1013,
      wind_speed: 8,
      cloud_cover: 45,
      temp_7day_high: dailySeries(68, 60, 64, 68),
      temp_7day_low: dailySeries(52, 42, 46, 50),
      precip_7day_daily: Array.from({ length: 21 }, () => 0),
      precip_7day_inches: 0,
      ...((overrides.weather as Record<string, unknown> | undefined) ?? {}),
    },
    ...overrides,
  };
}

function scoreFor(list: Array<{ id: string; score: number }> | undefined, id: string): number {
  return list?.find((item) => item.id === id)?.score ?? 0;
}

function familyScoreFor(
  list: Array<{ family_id: string; score: number }> | undefined,
  familyId: string,
): number {
  return list?.find((item) => item.family_id === familyId)?.score ?? 0;
}

function manualBehavior(overrides: Partial<BehaviorResolution> = {}): BehaviorResolution {
  return {
    fish_behavior: {
      baseline_profile_id: "manual:test",
      position: {
        depth_lanes: [
          { id: "mid_depth", score: 2.2 },
          { id: "suspended", score: 1.7 },
          { id: "lower_column", score: 1.1 },
        ],
        relation_tags: [
          { id: "depth_transition_oriented", score: 2.1 },
          { id: "point_oriented", score: 1.4 },
          { id: "channel_related", score: 0.7 },
        ],
      },
      behavior: {
        activity: "neutral",
        style_flags: ["natural_profile_window"],
        strike_zone: "moderate",
        chase_radius: "short",
      },
      forage: {
        baitfish_bias: 0.8,
        crustacean_bias: 0.2,
        insect_bias: 0.1,
      },
    },
    depth_scores: [
      { id: "mid_depth", score: 2.2 },
      { id: "suspended", score: 1.7 },
      { id: "lower_column", score: 1.1 },
    ],
    relation_scores: [
      { id: "depth_transition_oriented", score: 2.1 },
      { id: "point_oriented", score: 1.4 },
      { id: "channel_related", score: 0.7 },
    ],
    style_flags: ["natural_profile_window"],
    seasonal_basis: ["Season phase: spring transition"],
    daily_adjustments: ["mixed sky"],
    clarity_adjustments: ["Clear water favors natural profiles."],
    active_modifiers: [],
    inferred_clarity: "clear",
    light_profile: "mixed",
    current_profile: "slack",
    best_dayparts: ["Morning", "Evening"],
    month_groups: ["all_year", "spring_transition"],
    season_phase: "spring_transition",
    climate_band: "temperate",
    confidence_reasons: [],
    ...overrides,
  };
}

Deno.test("recommender: Great Lakes March lake stays winter-biased even during a warm spell", () => {
  const lateMarchNorthLake = buildSharedEngineRequestFromEnvData(
    44.30,
    -84.68,
    "2026-03-26",
    "America/Detroit",
    "freshwater_lake_pond",
    envFixture({
      timezone: "America/Detroit",
      weather: {
        temperature: 49,
        pressure: 1017,
        cloud_cover: 45,
        temp_7day_high: dailySeries(48, 38, 43, 49),
        temp_7day_low: dailySeries(34, 26, 30, 36),
      },
    }),
  );

  const { response: north } = runRecommender({ request: lateMarchNorthLake, refinements: {} });

  assert(scoreFor(north.debug?.depth_lane_scores, "deep") >= scoreFor(north.debug?.depth_lane_scores, "shallow"));
  assert(scoreFor(north.debug?.depth_lane_scores, "lower_column") >= scoreFor(north.debug?.depth_lane_scores, "upper_column"));
  assertEquals(north.fish_behavior.behavior.activity, "neutral");
  assert(north.presentation_archetypes.some((item) => item.archetype_id === "slow_bottom_contact"));
  assert(!north.lure_rankings.slice(0, 3).some((item) =>
    item.family_id === "frog_toad" || item.family_id === "topwater_walker_popper"
  ));
});

Deno.test("recommender: warming remains contextual by region and month after cold-season hold clears", () => {
  const northJuneLake = buildSharedEngineRequestFromEnvData(
    44.97,
    -93.26,
    "2026-06-20",
    "America/Chicago",
    "freshwater_lake_pond",
    envFixture({
      timezone: "America/Chicago",
      weather: {
        temperature: 76,
        pressure: 1012,
        cloud_cover: 45,
        temp_7day_high: dailySeries(74, 68, 72, 76),
        temp_7day_low: dailySeries(56, 50, 54, 58),
      },
    }),
  );

  const hotSouthLake = buildSharedEngineRequestFromEnvData(
    27.95,
    -82.46,
    "2026-07-20",
    "America/New_York",
    "freshwater_lake_pond",
    envFixture({
      weather: {
        temperature: 92,
        cloud_cover: 12,
        temp_7day_high: dailySeries(90, 86, 88, 94),
        temp_7day_low: dailySeries(78, 74, 76, 80),
      },
    }),
  );

  const { response: north } = runRecommender({ request: northJuneLake, refinements: {} });
  const { response: south } = runRecommender({ request: hotSouthLake, refinements: {} });

  assert(scoreFor(north.debug?.depth_lane_scores, "shallow") > 0);
  assert(scoreFor(south.debug?.depth_lane_scores, "deep") >= scoreFor(south.debug?.depth_lane_scores, "shallow"));
  assert(north.fish_behavior.behavior.activity !== "inactive");
  assert(south.fish_behavior.position.relation_tags.some((item) => item.id === "shade_oriented" || item.id === "depth_transition_oriented"));
});

Deno.test("recommender: river behavior stays current-position driven while lake stays edge-driven", () => {
  const env = envFixture({
    weather: {
      precipitation: 25.4,
      precip_7day_daily: dailySeries(0.2, 1.1, 1.3, 1.0),
      precip_7day_inches: 4.2,
    },
  });

  const { response: river } = runRecommender({
    request: buildSharedEngineRequestFromEnvData(
      35.95,
      -83.92,
      "2026-04-18",
      "America/New_York",
      "freshwater_river",
      env,
    ),
    refinements: {},
  });
  const { response: lake } = runRecommender({
    request: buildSharedEngineRequestFromEnvData(
      35.95,
      -83.92,
      "2026-04-18",
      "America/New_York",
      "freshwater_lake_pond",
      env,
    ),
    refinements: {},
  });

  assert(river.fish_behavior.position.relation_tags.some((item) => item.id === "seam_oriented"));
  assert(river.fish_behavior.behavior.style_flags.includes("current_drift_best"));
  assert(lake.fish_behavior.position.relation_tags.some((item) => item.id === "edge_oriented" || item.id === "cover_oriented"));
});

Deno.test("recommender: river lure curation favors broader current-driven tools over bass-finesse defaults", () => {
  const req = buildSharedEngineRequestFromEnvData(
    36.58,
    -118.02,
    "2026-10-08",
    "America/Los_Angeles",
    "freshwater_river",
    envFixture(),
  );
  const riverBehavior = manualBehavior({
    fish_behavior: {
      baseline_profile_id: "manual:river",
      position: {
        depth_lanes: [
          { id: "mid_depth", score: 2.6 },
          { id: "lower_column", score: 1.8 },
          { id: "shallow", score: 1.1 },
        ],
        relation_tags: [
          { id: "seam_oriented", score: 2.8 },
          { id: "current_break_oriented", score: 2.2 },
          { id: "hole_oriented", score: 1.1 },
        ],
      },
      behavior: {
        activity: "active",
        style_flags: ["current_drift_best", "horizontal_search_best"],
        strike_zone: "moderate",
        chase_radius: "moderate",
      },
      forage: {
        baitfish_bias: 0.7,
        crustacean_bias: 0.1,
        insect_bias: 0.35,
      },
    },
    depth_scores: [
      { id: "mid_depth", score: 2.6 },
      { id: "lower_column", score: 1.8 },
      { id: "shallow", score: 1.1 },
    ],
    relation_scores: [
      { id: "seam_oriented", score: 2.8 },
      { id: "current_break_oriented", score: 2.2 },
      { id: "hole_oriented", score: 1.1 },
    ],
    style_flags: ["current_drift_best", "horizontal_search_best"],
    inferred_clarity: "clear",
    current_profile: "moving",
    month_groups: ["all_year", "fall_feed", "baitfish_push"],
    season_phase: "fall_feed",
  });
  const riverArchetypes: PresentationArchetypeScore[] = [{
    archetype_id: "current_seam_drift",
    score: 30,
    reasons: ["river seam"],
    depth_target: "near_bottom",
    speed: "slow",
    motions: ["drift_natural", "sweeping"],
    triggers: ["current_drift", "flash"],
  }, {
    archetype_id: "horizontal_search_mid_column",
    score: 26,
    reasons: ["active river search"],
    depth_target: "mid_column",
    speed: "moderate",
    motions: ["steady", "straight_retrieve"],
    triggers: ["reaction", "flash"],
  }];

  const rankings = rankFamilies("lure", riverBehavior, riverArchetypes, {
    request: req,
    refinements: { water_clarity: "clear" },
  });

  const topThree = rankings.ranked.slice(0, 3).map((item) => item.family_id);
  assert(topThree.some((id) => id === "inline_spinner" || id === "compact_spoon"));
  assert(
    familyScoreFor(rankings.debug_scores, "inline_spinner") > familyScoreFor(rankings.debug_scores, "finesse_worm"),
  );
});

Deno.test("recommender: coastal and flats diverge on the same falling-tide day", () => {
  const tides = {
    station_id: "123",
    station_name: "Test",
    unit: "ft",
    phase: "falling",
    high_low: [
      { time: "2026-06-14T06:00:00-04:00", type: "H", value: 2.4 },
      { time: "2026-06-14T12:00:00-04:00", type: "L", value: 0.2 },
      { time: "2026-06-14T18:00:00-04:00", type: "H", value: 2.2 },
    ],
  };
  const env = envFixture({
    tides,
    coastal: true,
    nearest_tide_station_id: "123",
  });

  const { response: coastal } = runRecommender({
    request: buildSharedEngineRequestFromEnvData(
      29.14,
      -83.03,
      "2026-06-14",
      "America/New_York",
      "coastal",
      env,
    ),
    refinements: {},
  });
  const { response: flats } = runRecommender({
    request: buildSharedEngineRequestFromEnvData(
      29.14,
      -83.03,
      "2026-06-14",
      "America/New_York",
      "coastal_flats_estuary",
      env,
    ),
    refinements: {},
  });

  assert(coastal.fish_behavior.position.relation_tags.some((item) => item.id === "channel_related" || item.id === "point_oriented"));
  assert(flats.fish_behavior.position.relation_tags.some((item) => item.id === "drain_oriented" || item.id === "trough_oriented"));
  assert(flats.debug?.active_modifiers.includes("falling_tide_drain_focus"));
});

Deno.test("recommender: returns both lure and fly rankings plus debug payload", () => {
  const req = buildSharedEngineRequestFromEnvData(
    43.04,
    -87.91,
    "2026-09-15",
    "America/Chicago",
    "freshwater_lake_pond",
    envFixture(),
  );

  const { response: result } = runRecommender({
    request: req,
    refinements: {
      water_clarity: "stained",
    },
  });

  assertEquals(result.feature, "recommender_v1");
  assert(result.presentation_archetypes.length > 0);
  assert(result.lure_rankings.length > 0);
  assert(result.fly_rankings.length > 0);
  assert(result.lure_rankings[0]?.best_method != null);
  assert(result.fly_rankings[0]?.best_method != null);
  assert(result.debug != null);
  assert(result.debug?.seasonal_basis.length);
  assert(result.debug?.method_scores.length);
  assert(result.narration_payload.summary_seed.length > 0);
});

Deno.test("recommender: ranked families expose simplified public presentation guidance", () => {
  const req = buildSharedEngineRequestFromEnvData(
    28.95,
    -81.28,
    "2026-05-12",
    "America/New_York",
    "freshwater_lake_pond",
    envFixture({
      weather: {
        temperature: 81,
        cloud_cover: 50,
        temp_7day_high: dailySeries(82, 79, 80, 81),
        temp_7day_low: dailySeries(67, 64, 65, 66),
      },
    }),
  );

  const { response: result } = runRecommender({
    request: req,
    refinements: { water_clarity: "clear" },
  });

  const topLure = result.lure_rankings[0];
  const topFly = result.fly_rankings[0];

  assert(topLure?.best_method.setup_label.length);
  assert(topLure?.best_method.presentation_guide.summary.length);
  assert(["slow", "medium", "fast"].includes(topLure?.best_method.presentation_guide.pace ?? ""));
  assert(["upper", "mid", "lower", "bottom"].includes(topLure?.best_method.presentation_guide.lane ?? ""));

  assert(topFly?.best_method.setup_label.length);
  assert(topFly?.best_method.presentation_guide.summary.length);
});

Deno.test("recommender: soft stick worm guide keeps upper-lane wording internally consistent", () => {
  const req = buildSharedEngineRequestFromEnvData(
    26.98,
    -80.80,
    "2026-01-20",
    "America/New_York",
    "freshwater_lake_pond",
    envFixture({
      weather: {
        temperature: 74,
        cloud_cover: 35,
        temp_7day_high: dailySeries(77, 73, 75, 76),
        temp_7day_low: dailySeries(61, 58, 60, 62),
      },
    }),
  );

  const { response: result } = runRecommender({
    request: req,
    refinements: { water_clarity: "stained" },
  });

  const softStick = result.lure_rankings.find((family) => family.family_id === "soft_stick_worm");
  assert(softStick != null);
  assertEquals(softStick.best_method.presentation_guide.lane, "upper");
  assert(softStick.best_method.presentation_guide.summary.includes("upper lane"));
});

Deno.test("recommender: inventory compatibility surfaces best owned options", () => {
  const req = buildSharedEngineRequestFromEnvData(
    32.08,
    -81.09,
    "2026-10-10",
    "America/New_York",
    "coastal_flats_estuary",
    envFixture({
      tides: {
        station_id: "456",
        station_name: "Test",
        unit: "ft",
        phase: "incoming",
        high_low: [
          { time: "2026-10-10T05:45:00-04:00", type: "L", value: 0.3 },
          { time: "2026-10-10T11:40:00-04:00", type: "H", value: 2.1 },
        ],
      },
      coastal: true,
    }),
  );

  const { response: result } = runRecommender({
    request: req,
    refinements: { water_clarity: "stained" },
    inventory_items: [
      {
        id: "1",
        label: "My marsh streamer",
        gear_mode: "fly",
        primary_family_id: "baitfish_streamer",
        compatible_family_ids: ["shrimp_fly"],
        presentation_tags: ["open_flats_cruise_intercept"],
        motion_tags: ["steady"],
        depth_tags: ["shallow"],
        active: true,
      },
    ],
  });

  assert(result.inventory?.best_from_inventory?.length);
  assertEquals(result.inventory?.best_from_inventory?.[0]?.item_id, "1");
});

Deno.test("recommender: water clarity changes family and method lean without overriding seasonal structure", () => {
  const req = buildSharedEngineRequestFromEnvData(
    31.50,
    -81.37,
    "2026-08-08",
    "America/New_York",
    "freshwater_lake_pond",
    envFixture({
      weather: {
        temperature: 82,
        cloud_cover: 55,
        temp_7day_high: dailySeries(84, 80, 82, 85),
        temp_7day_low: dailySeries(70, 68, 69, 72),
      },
    }),
  );

  const { response: clear } = runRecommender({
    request: req,
    refinements: { water_clarity: "clear" },
  });
  const { response: dirty } = runRecommender({
    request: req,
    refinements: { water_clarity: "dirty" },
  });

  const clearFinesse = clear.lure_rankings.find((family) => family.family_id === "finesse_worm");
  const dirtyFinesse = dirty.lure_rankings.find((family) => family.family_id === "finesse_worm");

  assert(
    familyScoreFor(clear.debug?.family_scores, "finesse_worm") >
      familyScoreFor(dirty.debug?.family_scores, "finesse_worm"),
    "expected clear water to keep finesse-style families more viable",
  );
  assert(
    familyScoreFor(dirty.debug?.family_scores, "chatterbait") >
      familyScoreFor(clear.debug?.family_scores, "chatterbait"),
    "expected dirty water to boost louder search families",
  );
  assert(clearFinesse != null && dirtyFinesse != null);
  assert(
    clearFinesse.best_method.method_id !== dirtyFinesse.best_method.method_id,
    "expected clarity to change the recommended method inside a finesse family",
  );
  assert(dirty.debug?.clarity_adjustments.length);
});

Deno.test("recommender: dirty late-fall coastal setup stops overpromoting jerkbait", () => {
  const req = buildSharedEngineRequestFromEnvData(
    29.30,
    -94.79,
    "2026-11-16",
    "America/Chicago",
    "coastal",
    envFixture({
      coastal: true,
      tides: {
        station_id: "8771450",
        station_name: "Galveston",
        unit: "ft",
        phase: "outgoing",
        high_low: [
          { time: "2026-11-16T05:20:00-06:00", type: "H", value: 1.7 },
          { time: "2026-11-16T11:10:00-06:00", type: "L", value: 0.3 },
        ],
      },
      weather: {
        temperature: 63,
        cloud_cover: 76,
        wind_speed: 14,
        temp_7day_high: dailySeries(68, 66, 64, 63),
        temp_7day_low: dailySeries(57, 55, 53, 52),
      },
    }),
  );

  const dirtyBehavior = manualBehavior({
    fish_behavior: {
      baseline_profile_id: "manual:gulf_coast:coastal:m11",
      position: {
        depth_lanes: [
          { id: "lower_column", score: 2.4 },
          { id: "mid_depth", score: 1.8 },
          { id: "shallow", score: 0.8 },
        ],
        relation_tags: [
          { id: "channel_related", score: 2.7 },
          { id: "current_break_oriented", score: 2.2 },
          { id: "point_oriented", score: 1.4 },
        ],
      },
      behavior: {
        activity: "neutral",
        style_flags: ["finesse_best"],
        strike_zone: "moderate",
        chase_radius: "short",
      },
      forage: {
        baitfish_bias: 0.45,
        crustacean_bias: 0.55,
        insect_bias: 0.1,
      },
    },
    depth_scores: [
      { id: "lower_column", score: 2.4 },
      { id: "mid_depth", score: 1.8 },
      { id: "shallow", score: 0.8 },
    ],
    relation_scores: [
      { id: "channel_related", score: 2.7 },
      { id: "current_break_oriented", score: 2.2 },
      { id: "point_oriented", score: 1.4 },
    ],
    style_flags: ["finesse_best"],
    inferred_clarity: "dirty",
    light_profile: "mixed",
    current_profile: "moving",
    month_groups: ["all_year", "late_fall", "cool_months"],
    season_phase: "late_fall",
  });
  const coastalArchetypes: PresentationArchetypeScore[] = [{
    archetype_id: "slow_bottom_contact",
    score: 32,
    reasons: ["lower-lane inshore"],
    depth_target: "bottom_contact",
    speed: "dead_slow",
    motions: ["dragging", "hopping"],
    triggers: ["bottom_contact", "finesse"],
  }, {
    archetype_id: "drain_edge_intercept",
    score: 24,
    reasons: ["current edge"],
    depth_target: "near_bottom",
    speed: "slow",
    motions: ["twitch_pause", "steady"],
    triggers: ["natural_match", "visibility"],
  }];

  const rankings = rankFamilies("lure", dirtyBehavior, coastalArchetypes, {
    request: req,
    refinements: { water_clarity: "dirty" },
  });

  assertEquals(rankings.ranked[0]?.family_id === "jerkbait", false);
  assert(
    familyScoreFor(rankings.debug_scores, "weighted_bottom_presentation") >
      familyScoreFor(rankings.debug_scores, "jerkbait"),
  );
});

Deno.test("recommender: mainstream fall river curation favors broad river families over bass-finesse defaults", () => {
  const req = buildSharedEngineRequestFromEnvData(
    37.64,
    -81.05,
    "2026-10-12",
    "America/New_York",
    "freshwater_river",
    envFixture({
      weather: {
        temperature: 52,
        cloud_cover: 35,
        wind_speed: 4,
        temp_7day_high: dailySeries(59, 55, 53, 52),
        temp_7day_low: dailySeries(42, 39, 37, 35),
      },
      river: {
        flow_cfs: 900,
      },
    }),
  );

  const { response: result } = runRecommender({
    request: req,
    refinements: { water_clarity: "clear" },
  });

  const riverTopThree = result.lure_rankings.slice(0, 3).map((family) => family.family_id);
  assert(
    riverTopThree.some((familyId) => familyId === "inline_spinner" || familyId === "compact_spoon"),
    `expected a broad river-native lure family near the top, saw ${JSON.stringify(riverTopThree)}`,
  );
  assert(
    familyScoreFor(result.debug?.family_scores, "compact_spoon") >
      familyScoreFor(result.debug?.family_scores, "finesse_worm"),
    "expected compact spoon to outrank finesse worm in a mainstream fall river setup",
  );
});

Deno.test("recommender: jerkbait method switches with seasonal and presentation context", () => {
  const req = buildSharedEngineRequestFromEnvData(
    43.04,
    -87.91,
    "2026-04-15",
    "America/Chicago",
    "freshwater_lake_pond",
    envFixture(),
  );

  const suspendBehavior = manualBehavior();
  const suspendArchetypes: PresentationArchetypeScore[] = [{
    archetype_id: "depth_break_suspend_pause",
    score: 28,
    reasons: ["suspended fish"],
    depth_target: "mid_column",
    speed: "slow",
    motions: ["twitch_pause"],
    triggers: ["reaction", "flash"],
  }];
  const suspendRankings = rankFamilies("lure", suspendBehavior, suspendArchetypes, {
    request: req,
    refinements: { water_clarity: "clear" },
  });
  const suspendJerkbait = suspendRankings.ranked.find((item) => item.family_id === "jerkbait");
  assertEquals(suspendJerkbait?.best_method.method_id, "suspend_twitch_pause");

  const snapBehavior = manualBehavior({
    fish_behavior: {
      ...manualBehavior().fish_behavior,
      behavior: {
        activity: "aggressive",
        style_flags: ["horizontal_search_best"],
        strike_zone: "wide",
        chase_radius: "long",
      },
    },
    style_flags: ["horizontal_search_best"],
    inferred_clarity: "stained",
    light_profile: "low_light",
    month_groups: ["all_year", "fall_feed", "baitfish_push"],
    season_phase: "fall_feed",
  });
  const snapArchetypes: PresentationArchetypeScore[] = [{
    archetype_id: "horizontal_search_mid_column",
    score: 32,
    reasons: ["baitfish search"],
    depth_target: "mid_column",
    speed: "moderate",
    motions: ["steady", "twitch_pause"],
    triggers: ["reaction", "flash"],
  }];
  const snapRankings = rankFamilies("lure", snapBehavior, snapArchetypes, {
    request: req,
    refinements: { water_clarity: "stained" },
  });
  const snapJerkbait = snapRankings.ranked.find((item) => item.family_id === "jerkbait");
  assertEquals(snapJerkbait?.best_method.method_id, "snap_pause_search");
});

Deno.test("recommender: Alaska February warm day does not produce topwater or aggressive behavior", () => {
  const req = buildSharedEngineRequestFromEnvData(
    61.22,
    -149.89,
    "2026-02-15",
    "America/Anchorage",
    "freshwater_lake_pond",
    envFixture({
      timezone: "America/Anchorage",
      weather: {
        temperature: 38,
        pressure: 1020,
        cloud_cover: 30,
        temp_7day_high: dailySeries(32, 28, 34, 38),
        temp_7day_low: dailySeries(18, 14, 20, 24),
      },
    }),
  );

  const { response: result } = runRecommender({ request: req, refinements: {} });

  assert(
    result.fish_behavior.behavior.activity === "inactive" ||
    result.fish_behavior.behavior.activity === "neutral",
    `Expected inactive or neutral, got ${result.fish_behavior.behavior.activity}`,
  );
  assert(!result.lure_rankings.slice(0, 3).some((item) =>
    item.family_id === "frog_toad" || item.family_id === "topwater_walker_popper"
  ));
  assert(!result.fish_behavior.behavior.style_flags.includes("topwater_window"));
});

Deno.test("recommender: Florida February can produce active behavior (no winter_hold for warm climate)", () => {
  const req = buildSharedEngineRequestFromEnvData(
    25.76,
    -80.19,
    "2026-02-15",
    "America/New_York",
    "freshwater_lake_pond",
    envFixture({
      weather: {
        temperature: 75,
        pressure: 1015,
        cloud_cover: 40,
        temp_7day_high: dailySeries(78, 72, 76, 80),
        temp_7day_low: dailySeries(62, 58, 60, 64),
      },
    }),
  );

  const { response: result } = runRecommender({ request: req, refinements: {} });

  assert(
    result.fish_behavior.behavior.activity === "active" ||
    result.fish_behavior.behavior.activity === "aggressive" ||
    result.fish_behavior.behavior.activity === "neutral",
    `Expected at least neutral for warm Florida February, got ${result.fish_behavior.behavior.activity}`,
  );
});

Deno.test("recommender: polished field starts as null before LLM runs", () => {
  const req = buildSharedEngineRequestFromEnvData(
    43.04,
    -87.91,
    "2026-09-15",
    "America/Chicago",
    "freshwater_lake_pond",
    envFixture(),
  );

  const { response: result } = runRecommender({ request: req, refinements: {} });

  assertEquals(result.polished, null);
  assert(result.narration_payload.summary_seed.length > 0);
});
