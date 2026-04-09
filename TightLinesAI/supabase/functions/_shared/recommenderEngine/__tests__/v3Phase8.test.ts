import { assert, assertEquals } from "jsr:@std/assert";
import { computeRecommenderV3 } from "../runRecommenderV3.ts";
import type { RecommenderRequest } from "../contracts/input.ts";

function analysis(overrides: Record<string, unknown> = {}) {
  return {
    scored: {
      score: 60,
      band: "Good",
      drivers: [],
      suppressors: [],
      ...(overrides.scored as object | undefined),
    },
    timing: {
      timing_strength: "good",
      ...(overrides.timing as object | undefined),
    },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "stable",
      temperature_shock: "none",
      ...(overrides.condition_context as object | undefined),
    },
    norm: {
      normalized: {
        pressure_regime: { label: "recently_stabilizing", score: 0 },
        wind_condition: { label: "light", score: 0.3 },
        light_cloud_condition: { label: "mixed_sky" },
        ...((overrides.norm as { normalized?: object } | undefined)
          ?.normalized ?? {}),
      },
    },
  } as any;
}

function request(
  overrides: Partial<RecommenderRequest> & {
    location?: Partial<RecommenderRequest["location"]>;
  } = {},
): RecommenderRequest {
  const location: RecommenderRequest["location"] = {
    latitude: 26.94,
    longitude: -80.8,
    state_code: "FL",
    region_key: "florida",
    local_date: "2026-07-15",
    local_timezone: "America/New_York",
    month: 7,
    ...(overrides.location ?? {}),
  };

  return {
    location,
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    env_data: {},
    ...overrides,
  };
}

function scenario(
  requestOverrides: Parameters<typeof request>[0] = {},
  analysisOverrides: Record<string, unknown> = {},
) {
  return computeRecommenderV3(
    request(requestOverrides),
    analysis(analysisOverrides),
  );
}

function ids(candidates: Array<{ id: string }>): string[] {
  return candidates.map((candidate) => candidate.id);
}

Deno.test("V3 Phase 8 keeps a bright post-front winter bass day in a true finesse posture", () => {
  const result = scenario({
    location: {
      latitude: 32.78,
      longitude: -96.8,
      state_code: "TX",
      region_key: "south_central",
      local_date: "2026-12-12",
      local_timezone: "America/Chicago",
      month: 12,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "clear",
  }, {
    scored: { score: 46, band: "Fair" },
    timing: {
      timing_strength: "fair",
      highlighted_periods: [false, false, false, false],
    },
    condition_context: {
      temperature_metabolic_context: "cold_limited",
      temperature_trend: "stable",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "rising_fast", score: -0.8 },
        wind_condition: { label: "calm", score: 0.7 },
        light_cloud_condition: { label: "bright" },
      },
    },
  });

  assertEquals(result.daily_payload.surface_window, "off");
  assertEquals(result.daily_payload.reaction_window, "off");
  assertEquals(result.daily_payload.finesse_window, "on");
  assertEquals(result.daily_payload.pace_bias, "slow");
  assertEquals(ids(result.lure_recommendations), [
    "shaky_head_worm",
    "texas_rigged_soft_plastic_craw",
    "football_jig",
  ]);
  assert(
    result.lure_recommendations.every((candidate) =>
      !["surface", "reaction_mid_column", "horizontal_search"].includes(
        candidate.tactical_lane,
      )
    ),
  );
  assert(
    result.fly_recommendations.every((candidate) =>
      candidate.tactical_lane !== "fly_surface"
    ),
  );
});

Deno.test("V3 Phase 8 keeps a productive windy fall bass day in a reaction-first plan", () => {
  const result = scenario({
    location: {
      latitude: 32.78,
      longitude: -96.8,
      state_code: "TX",
      region_key: "south_central",
      local_date: "2026-10-18",
      local_timezone: "America/Chicago",
      month: 10,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "clear",
  }, {
    scored: { score: 74, band: "Good" },
    timing: {
      timing_strength: "good",
      highlighted_periods: [true, false, false, true],
    },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "warming",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "falling_slow", score: 0.8 },
        wind_condition: { label: "moderate", score: 0.8 },
        light_cloud_condition: { label: "low_light" },
      },
    },
  });

  assertEquals(result.daily_payload.surface_window, "on");
  assertEquals(result.daily_payload.reaction_window, "on");
  assertEquals(result.daily_payload.finesse_window, "off");
  assertEquals(result.daily_payload.pace_bias, "fast");
  assertEquals(ids(result.lure_recommendations), [
    "squarebill_crankbait",
    "suspending_jerkbait",
    "paddle_tail_swimbait",
  ]);
  assert(
    result.lure_recommendations.every((candidate) =>
      !["bottom_contact", "finesse_subtle"].includes(candidate.tactical_lane)
    ),
  );
});

Deno.test("V3 Phase 8 rotates summer smallmouth from a low-light surface plan into bright-day restraint", () => {
  const requestOverrides = {
    location: {
      latitude: 44.97,
      longitude: -93.26,
      state_code: "MN",
      region_key: "great_lakes_upper_midwest",
      local_date: "2026-07-18",
      local_timezone: "America/Chicago",
      month: 7,
    },
    species: "smallmouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "clear",
  } as const;
  const lowLight = scenario(requestOverrides, {
    scored: { score: 73, band: "Good" },
    timing: {
      timing_strength: "good",
      highlighted_periods: [true, false, false, true],
    },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "warming",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "falling_slow", score: 0.7 },
        wind_condition: { label: "light", score: 0.5 },
        light_cloud_condition: { label: "low_light" },
      },
    },
  });
  const brightMidday = scenario(requestOverrides, {
    scored: { score: 54, band: "Fair" },
    timing: {
      timing_strength: "fair",
      highlighted_periods: [false, false, false, false],
    },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "stable",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "rising_fast", score: -0.8 },
        wind_condition: { label: "calm", score: 0.7 },
        light_cloud_condition: { label: "bright" },
      },
    },
  });

  assertEquals(lowLight.daily_payload.surface_window, "on");
  assertEquals(lowLight.lure_recommendations[0]?.id, "popping_topwater");
  assert(lowLight.lure_recommendations.some((candidate) =>
    candidate.id === "walking_topwater"
  ));
  assertEquals(lowLight.fly_recommendations[0]?.id, "popper_fly");
  assert(lowLight.fly_recommendations.some((candidate) =>
    candidate.id === "mouse_fly"
  ));

  assertEquals(brightMidday.daily_payload.surface_window, "off");
  assert(
    brightMidday.lure_recommendations.every((candidate) =>
      candidate.tactical_lane !== "surface"
    ),
  );
  assert(
    brightMidday.fly_recommendations.every((candidate) =>
      candidate.tactical_lane !== "fly_surface"
    ),
  );
  assert(!ids(brightMidday.lure_recommendations).includes("popping_topwater"));
  assert(!ids(brightMidday.fly_recommendations).includes("popper_fly"));
});

Deno.test("V3 Phase 8 keeps a real summer frog window available for largemouth", () => {
  const result = scenario({
    location: {
      latitude: 28.54,
      longitude: -81.38,
      state_code: "FL",
      region_key: "florida",
      local_date: "2026-07-22",
      local_timezone: "America/New_York",
      month: 7,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  }, {
    scored: { score: 74, band: "Good" },
    timing: {
      timing_strength: "good",
      highlighted_periods: [true, false, false, true],
    },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "warming",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "falling_slow", score: 0.8 },
        wind_condition: { label: "light", score: 0.65 },
        light_cloud_condition: { label: "low_light" },
      },
    },
  });

  assertEquals(result.daily_payload.surface_window, "on");
  assertEquals(ids(result.lure_recommendations), [
    "buzzbait",
    "hollow_body_frog",
    "swim_jig",
  ]);
  assertEquals(result.fly_recommendations[0]?.id, "frog_fly");
  assert(result.fly_recommendations.some((candidate) =>
    candidate.id === "mouse_fly"
  ));
});

Deno.test("V3 Phase 8 suppresses Florida midsummer bass surface flies when the daily window is off", () => {
  const result = scenario({
    location: {
      latitude: 28.54,
      longitude: -81.38,
      state_code: "FL",
      region_key: "florida",
      local_date: "2026-07-14",
      local_timezone: "America/New_York",
      month: 7,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  }, {
    scored: { score: 46, band: "Fair" },
    timing: {
      timing_strength: "fair",
      highlighted_periods: [false, false, false, false],
    },
    condition_context: {
      temperature_metabolic_context: "cold_limited",
      temperature_trend: "stable",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "rising_fast", score: -0.8 },
        wind_condition: { label: "calm", score: 0.7 },
        light_cloud_condition: { label: "bright" },
      },
    },
  });

  assertEquals(result.daily_payload.surface_window, "off");
  assert(
    result.fly_recommendations.every((candidate) =>
      candidate.tactical_lane !== "fly_surface"
    ),
  );
  assert(!ids(result.fly_recommendations).includes("frog_fly"));
  assert(!ids(result.fly_recommendations).includes("popper_fly"));
});

Deno.test("V3 Phase 8 keeps midsummer trout mouse fishing sensitive to river wind", () => {
  const requestOverrides = {
    location: {
      latitude: 45.31,
      longitude: -121.69,
      state_code: "OR",
      region_key: "mountain_west",
      local_date: "2026-07-20",
      local_timezone: "America/Los_Angeles",
      month: 7,
    },
    species: "river_trout",
    context: "freshwater_river",
    water_clarity: "clear",
  } as const;
  const baseAnalysis = {
    scored: { score: 72, band: "Good" },
    timing: {
      timing_strength: "good",
      highlighted_periods: [true, false, false, true],
    },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "warming",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "falling_slow", score: 0.7 },
        light_cloud_condition: { label: "low_light" },
      },
    },
  } as const;
  const lightWind = scenario(requestOverrides, {
    ...baseAnalysis,
    norm: {
      normalized: {
        ...baseAnalysis.norm.normalized,
        wind_condition: { label: "light", score: 0.65 },
      },
    },
  });
  const strongWind = scenario(requestOverrides, {
    ...baseAnalysis,
    norm: {
      normalized: {
        ...baseAnalysis.norm.normalized,
        wind_condition: { label: "strong", score: -0.75 },
      },
    },
  });
  const extremeWind = scenario(requestOverrides, {
    ...baseAnalysis,
    norm: {
      normalized: {
        ...baseAnalysis.norm.normalized,
        wind_condition: { label: "extreme", score: -1.0 },
      },
    },
  });

  assertEquals(lightWind.daily_payload.surface_window, "on");
  assertEquals(lightWind.fly_recommendations[0]?.id, "mouse_fly");
  assertEquals(strongWind.daily_payload.surface_window, "watch");
  assert(strongWind.fly_recommendations.some((candidate) =>
    candidate.id === "mouse_fly"
  ));
  assertEquals(extremeWind.daily_payload.surface_window, "off");
  assertEquals(extremeWind.fly_recommendations[0]?.id, "slim_minnow_streamer");
  assert(!ids(extremeWind.fly_recommendations).includes("mouse_fly"));
});

Deno.test("V3 Phase 8 keeps cold clear winter trout recommendations bounded away from surface noise", () => {
  const result = scenario({
    location: {
      latitude: 41.99,
      longitude: -74.92,
      state_code: "NY",
      region_key: "northeast",
      local_date: "2026-01-20",
      local_timezone: "America/New_York",
      month: 1,
    },
    species: "river_trout",
    context: "freshwater_river",
    water_clarity: "clear",
  }, {
    scored: { score: 46, band: "Fair" },
    timing: {
      timing_strength: "fair",
      highlighted_periods: [false, false, false, false],
    },
    condition_context: {
      temperature_metabolic_context: "cold_limited",
      temperature_trend: "stable",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "rising_fast", score: -0.8 },
        wind_condition: { label: "calm", score: 0.7 },
        light_cloud_condition: { label: "bright" },
      },
    },
  });

  assertEquals(result.daily_payload.surface_window, "off");
  assertEquals(result.daily_payload.finesse_window, "on");
  assert(
    result.lure_recommendations.every((candidate) =>
      candidate.tactical_lane !== "surface"
    ),
  );
  assert(
    result.fly_recommendations.every((candidate) =>
      candidate.tactical_lane !== "fly_surface"
    ),
  );
  assertEquals(result.fly_recommendations[0]?.id, "sculpin_streamer");
});

Deno.test("V3 Phase 8 keeps crankbait depth stories separated by seasonal context", () => {
  const flatSide = scenario({
    location: {
      latitude: 44.9,
      longitude: -85.6,
      state_code: "MI",
      region_key: "great_lakes_upper_midwest",
      local_date: "2026-03-20",
      local_timezone: "America/Detroit",
      month: 3,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "clear",
  }, {
    scored: { score: 72, band: "Good" },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "warming",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "falling_slow", score: 0.7 },
        wind_condition: { label: "moderate", score: 0.5 },
        light_cloud_condition: { label: "mixed_sky" },
      },
    },
  });
  const mediumDive = scenario({
    location: {
      latitude: 41.6,
      longitude: -93.6,
      state_code: "IA",
      region_key: "midwest_interior",
      local_date: "2026-06-18",
      local_timezone: "America/Chicago",
      month: 6,
    },
    species: "smallmouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "dirty",
  }, {
    scored: { score: 72, band: "Good" },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "warming",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "falling_slow", score: 0.7 },
        wind_condition: { label: "moderate", score: 0.5 },
        light_cloud_condition: { label: "mixed_sky" },
      },
    },
  });

  assertEquals(flatSide.lure_recommendations[0]?.id, "flat_sided_crankbait");
  assert(!ids(flatSide.lure_recommendations).includes("medium_diving_crankbait"));
  assertEquals(mediumDive.lure_recommendations[0]?.id, "spinnerbait");
  assert(ids(mediumDive.lure_recommendations).includes("medium_diving_crankbait"));
  assert(!ids(mediumDive.lure_recommendations).includes("flat_sided_crankbait"));
});
