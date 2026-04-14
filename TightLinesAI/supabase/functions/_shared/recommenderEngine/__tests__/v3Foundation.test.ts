import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import type { RecommenderRequest } from "../contracts/input.ts";
import { computeRecommenderV3 } from "../runRecommenderV3.ts";
import { resolveDailyPayloadV3 } from "../v3/resolveDailyPayload.ts";
import { resolveFinalProfileV3 } from "../v3/resolveFinalProfile.ts";
import { resolveSeasonalRowV3 } from "../v3/seasonal/resolveSeasonalRow.ts";
import {
  assertRecommenderV3Scope,
  toRecommenderV3Species,
} from "../v3/scope.ts";

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
      highlighted_periods: [false, false, false, false],
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
        pressure_regime: { label: "stable_neutral", score: 0 },
        wind_condition: { label: "light", score: 0.2 },
        light_cloud_condition: { label: "mixed", score: 0 },
        precipitation_disruption: { label: "dry_stable", score: 0.1 },
        runoff_flow_disruption: { label: "stable", score: 0.6 },
        ...((overrides.norm as { normalized?: object } | undefined)
          ?.normalized ?? {}),
      },
    },
  } as any;
}

function request(
  overrides: Partial<RecommenderRequest> = {},
): RecommenderRequest {
  return {
    location: {
      latitude: 35.5,
      longitude: -82.5,
      state_code: "NC",
      region_key: "appalachian",
      local_date: "2026-04-03",
      local_timezone: "America/New_York",
      month: 4,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    env_data: {},
    ...overrides,
  };
}

Deno.test("V3 scope maps legacy freshwater species into the rebuilt species list", () => {
  assertEquals(toRecommenderV3Species("largemouth_bass"), "largemouth_bass");
  assertEquals(toRecommenderV3Species("pike_musky"), "northern_pike");
  assertEquals(toRecommenderV3Species("river_trout"), "trout");
  assertEquals(toRecommenderV3Species("redfish"), null);
});

Deno.test("V3 scope still enforces trout as river-only", () => {
  assertThrows(
    () =>
      assertRecommenderV3Scope({
        species: "river_trout",
        context: "freshwater_lake_pond",
      }),
    Error,
    "does not support",
  );
});

Deno.test("V3 daily payload resolves an aggressive lake posture and bold presence from aligned conditions", () => {
  const payload = resolveDailyPayloadV3(
    analysis({
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "warming",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "falling_moderate", score: 1.0 },
          wind_condition: { label: "moderate", score: 0.8 },
          light_cloud_condition: { label: "low_light", score: 0.8 },
          precipitation_disruption: { label: "dry_stable", score: 0.1 },
        },
      },
    }),
    "freshwater_lake_pond",
    "dirty",
  );

  assertEquals(payload.posture_band, "aggressive");
  assertEquals(payload.presentation_presence_today, "bold");
  assertEquals(payload.reaction_window_today, "on");
  assertEquals(payload.pace_bias_today, "fast");
  assertEquals(payload.column_shift_bias_half_steps, -2);
  assertEquals(payload.surface_allowed_today, true);
  assertEquals(payload.suppress_true_topwater, false);
  assertEquals(payload.surface_window_today, "rippled");
});

Deno.test("V3 resolved profile keeps winter low baselines bounded on aggressive days", () => {
  const row = resolveSeasonalRowV3(
    "largemouth_bass",
    "south_central",
    12,
    "freshwater_lake_pond",
  );
  const daily = resolveDailyPayloadV3(
    analysis({
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "warming",
        temperature_shock: "sharp_warmup",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "falling_moderate", score: 1.0 },
          wind_condition: { label: "moderate", score: 0.9 },
          light_cloud_condition: { label: "low_light", score: 0.8 },
          precipitation_disruption: { label: "dry_stable", score: 0.1 },
        },
      },
    }),
    "freshwater_lake_pond",
    "stained",
  );
  const resolved = resolveFinalProfileV3(row, daily);

  assertEquals(row.typical_seasonal_water_column, "low");
  assertEquals(resolved.likely_water_column_today, "mid_low");
  assert(resolved.likely_water_column_today !== "high");
  assert(resolved.likely_water_column_today !== "high_top");
});

Deno.test("V3 windy summer lake days suppress true topwater and keep picks inside the seasonal pool", () => {
  const req = request({
    location: {
      latitude: 28.54,
      longitude: -81.38,
      state_code: "FL",
      region_key: "florida",
      local_date: "2026-07-18",
      local_timezone: "America/New_York",
      month: 7,
    },
  });
  const result = computeRecommenderV3(
    req,
    analysis({
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "stable",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "stable_neutral", score: 0 },
          wind_condition: { label: "strong", score: -0.9 },
          light_cloud_condition: { label: "mixed", score: 0 },
          precipitation_disruption: { label: "dry_stable", score: 0.1 },
        },
      },
    }),
  );
  const seasonalIds = new Set([
    ...result.seasonal_row.eligible_lure_ids,
    ...result.seasonal_row.eligible_fly_ids,
  ]);

  assertEquals(result.daily_payload.surface_window_today, "closed");
  assertEquals(result.daily_payload.suppress_true_topwater, true);
  assertEquals(result.daily_payload.pace_bias_today, "neutral");
  assert(
    [...result.lure_recommendations, ...result.fly_recommendations].every(
      (candidate) => seasonalIds.has(candidate.id),
    ),
  );
  assert(
    [...result.lure_recommendations, ...result.fly_recommendations].every(
      (candidate) =>
        candidate.tactical_lane !== "surface" &&
        candidate.tactical_lane !== "fly_surface",
    ),
  );
});

Deno.test("V3 calm mixed lake days keep a clean surface window open for finesse-style topwater", () => {
  const payload = resolveDailyPayloadV3(
    analysis({
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "stable",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "stable_neutral", score: 0 },
          wind_condition: { label: "light", score: 0.2 },
          light_cloud_condition: { label: "mixed", score: 0 },
          precipitation_disruption: { label: "dry_stable", score: 0.1 },
        },
      },
    }),
    "freshwater_lake_pond",
    "clear",
  );

  assertEquals(payload.surface_allowed_today, true);
  assertEquals(payload.suppress_true_topwater, false);
  assertEquals(payload.surface_window_today, "clean");
  assertEquals(payload.reaction_window_today, "watch");
  assertEquals(payload.pace_bias_today, "neutral");
});

Deno.test("V3 productive fall fast days keep the lure story in reaction/search lanes", () => {
  const req = request({
    location: {
      latitude: 32.78,
      longitude: -96.8,
      state_code: "TX",
      region_key: "south_central",
      local_date: "2026-10-18",
      local_timezone: "America/Chicago",
      month: 10,
    },
    water_clarity: "clear",
  });

  const result = computeRecommenderV3(
    req,
    analysis({
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "warming",
        temperature_shock: "none",
      },
      timing: {
        timing_strength: "good",
        highlighted_periods: [true, false, false, true],
      },
      norm: {
        normalized: {
          pressure_regime: { label: "falling_slow", score: 0.8 },
          wind_condition: { label: "moderate", score: 0.8 },
          light_cloud_condition: { label: "low_light", score: 0.8 },
          precipitation_disruption: { label: "dry_stable", score: 0.1 },
        },
      },
    }),
  );

  assertEquals(result.daily_payload.reaction_window_today, "on");
  assertEquals(result.daily_payload.pace_bias_today, "fast");
  assert(
    result.lure_recommendations.every((candidate) =>
      candidate.tactical_lane !== "bottom_contact" &&
      candidate.tactical_lane !== "finesse_subtle"
    ),
  );
});

Deno.test("V3 largemouth midwest March rivers no longer fall back to the winter river row", () => {
  const row = resolveSeasonalRowV3(
    "largemouth_bass",
    "midwest_interior",
    3,
    "freshwater_river",
  );

  assertEquals(row.typical_seasonal_water_column, "high");
  assert(row.eligible_lure_ids.includes("spinnerbait"));
  assert(row.eligible_lure_ids.includes("bladed_jig"));
  assert(!row.eligible_lure_ids.includes("tube_jig"));
  assert(!row.eligible_lure_ids.includes("drop_shot_worm"));
});

Deno.test("V3 Florida summer grass lineups keep at most one open-water topwater in the lure top 3", () => {
  const req = request({
    location: {
      latitude: 26.94,
      longitude: -80.8,
      state_code: "FL",
      region_key: "florida",
      local_date: "2026-06-18",
      local_timezone: "America/New_York",
      month: 6,
    },
    water_clarity: "stained",
  });

  const result = computeRecommenderV3(
    req,
    analysis({
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "warming",
        temperature_shock: "none",
      },
      timing: {
        timing_strength: "good",
        highlighted_periods: [true, false, false, true],
      },
      norm: {
        normalized: {
          pressure_regime: { label: "recently_stabilizing", score: 0.25 },
          wind_condition: { label: "moderate", score: 0.8 },
          light_cloud_condition: { label: "low_light", score: 0.8 },
          precipitation_disruption: { label: "dry_stable", score: 0.1 },
        },
      },
    }),
  );

  const openWaterTopwaterIds = new Set([
    "walking_topwater",
    "popping_topwater",
    "buzzbait",
    "prop_bait",
  ]);

  assert(
    result.lure_recommendations.filter((candidate) =>
      openWaterTopwaterIds.has(candidate.id)
    ).length <= 1,
  );
  assert(
    result.lure_recommendations.some((candidate) =>
      candidate.id === "hollow_body_frog" || candidate.id === "swim_jig"
    ),
  );
});

Deno.test("V3 south-central spring rivers keep moving largemouth seam tools ahead of compact control on slow current days", () => {
  const req = request({
    location: {
      latitude: 34.8,
      longitude: -87.67,
      state_code: "AL",
      region_key: "south_central",
      local_date: "2026-03-12",
      local_timezone: "America/Chicago",
      month: 3,
    },
    context: "freshwater_river",
    water_clarity: "stained",
  });

  const result = computeRecommenderV3(
    req,
    analysis({
      condition_context: {
        temperature_metabolic_context: "cold_limited",
        temperature_trend: "stable",
        temperature_shock: "sharp_cooldown",
      },
      norm: {
        normalized: {
          wind_condition: { label: "moderate", score: 0.8 },
          light_cloud_condition: { label: "mixed", score: 0 },
          runoff_flow_disruption: { label: "elevated", score: 0.8 },
        },
      },
    }),
  );

  assertEquals(result.daily_payload.pace_bias_today, "slow");
  assertEquals(result.lure_recommendations[0]?.id, "spinnerbait");
  assert(
    result.lure_recommendations[0]?.score >
      (result.lure_recommendations.find((candidate) => candidate.id === "compact_flipping_jig")?.score ?? -Infinity),
  );
});

Deno.test("V3 south-central fall rivers keep baitfish flies ahead of bottom-drag flies on slow current-edge days", () => {
  const req = request({
    location: {
      latitude: 34.8,
      longitude: -87.67,
      state_code: "AL",
      region_key: "south_central",
      local_date: "2026-09-17",
      local_timezone: "America/Chicago",
      month: 9,
    },
    context: "freshwater_river",
    water_clarity: "stained",
  });

  const result = computeRecommenderV3(
    req,
    analysis({
      condition_context: {
        temperature_metabolic_context: "heat_limited",
        temperature_trend: "warming",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          wind_condition: { label: "light", score: 0.2 },
          light_cloud_condition: { label: "mixed", score: 0 },
          runoff_flow_disruption: { label: "perfect_clear", score: 0.8 },
        },
      },
    }),
  );

  assertEquals(result.lure_recommendations[0]?.id, "spinnerbait");
  assertEquals(result.fly_recommendations[0]?.id, "clouser_minnow");
  assert(
    (result.fly_recommendations.find((candidate) => candidate.id === "clouser_minnow")?.score ?? -Infinity) >
      (result.fly_recommendations.find((candidate) => candidate.id === "rabbit_strip_leech")?.score ?? Infinity),
  );
});

Deno.test("V3 south-central April reservoirs keep spawn-transition target lanes inside the top 3", () => {
  const req = request({
    location: {
      latitude: 31.101,
      longitude: -95.566,
      state_code: "TX",
      region_key: "south_central",
      local_date: "2026-04-16",
      local_timezone: "America/Chicago",
      month: 4,
    },
    water_clarity: "stained",
  });

  const result = computeRecommenderV3(
    req,
    analysis({
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "stable",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          wind_condition: { label: "moderate", score: 0.8 },
          light_cloud_condition: { label: "mixed", score: 0 },
          precipitation_disruption: { label: "extended_dry", score: 0.1 },
        },
      },
    }),
  );

  assertEquals(result.lure_recommendations[0]?.id, "compact_flipping_jig");
  assert(
    result.lure_recommendations.some((candidate) => candidate.id === "swim_jig"),
  );
  assert(
    result.lure_recommendations.some((candidate) => candidate.id === "spinnerbait"),
  );
});

Deno.test("V3 dirty summer largemouth rivers keep cleaner baitfish flies out of the top 3", () => {
  const req = request({
    location: {
      latitude: 35.143,
      longitude: -90.052,
      state_code: "TN",
      region_key: "midwest_interior",
      local_date: "2026-06-18",
      local_timezone: "America/Chicago",
      month: 6,
    },
    context: "freshwater_river",
    water_clarity: "dirty",
  });

  const result = computeRecommenderV3(
    req,
    analysis({
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "warming",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          wind_condition: { label: "moderate", score: 0.8 },
          light_cloud_condition: { label: "low_light", score: 0.8 },
          runoff_flow_disruption: { label: "elevated", score: 0.8 },
        },
      },
    }),
  );

  assert(
    result.fly_recommendations.every((candidate) => candidate.id !== "clouser_minnow"),
  );
  assert(
    result.fly_recommendations.some((candidate) => candidate.id === "game_changer"),
  );
});

Deno.test("V3 northern clear midsummer largemouth stays off clean-cadence topwater on subtle noon windows", () => {
  const req = request({
    location: {
      latitude: 42.642,
      longitude: -75.72,
      state_code: "NY",
      region_key: "northeast",
      local_date: "2026-07-16",
      local_timezone: "America/New_York",
      month: 7,
    },
    water_clarity: "clear",
  });

  const result = computeRecommenderV3(
    req,
    analysis({
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "warming",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          wind_condition: { label: "light", score: 0.2 },
          light_cloud_condition: { label: "bright", score: 0.6 },
          precipitation_disruption: { label: "dry_stable", score: 0.1 },
        },
      },
    }),
  );

  assert(
    result.lure_recommendations.every((candidate) => candidate.id !== "walking_topwater"),
  );
  assert(
    result.lure_recommendations.some((candidate) => candidate.id === "swim_jig"),
  );
});

Deno.test("V3 PNW summer largemouth keeps prop bait behind frog-and-swim-jig style lanes on neutral cooling days", () => {
  const req = request({
    location: {
      latitude: 44.9,
      longitude: -123.03,
      state_code: "OR",
      region_key: "pacific_northwest",
      local_date: "2026-08-14",
      local_timezone: "America/Los_Angeles",
      month: 8,
    },
    water_clarity: "stained",
  });

  const result = computeRecommenderV3(
    req,
    analysis({
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "cooling",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          wind_condition: { label: "light", score: 0.2 },
          light_cloud_condition: { label: "bright", score: 0.5 },
          precipitation_disruption: { label: "dry_stable", score: 0.1 },
        },
      },
    }),
  );

  assert(
    result.lure_recommendations.every((candidate) => candidate.id !== "prop_bait"),
  );
  assert(
    result.lure_recommendations.some((candidate) =>
      candidate.id === "swim_jig" || candidate.id === "hollow_body_frog"
    ),
  );
});

Deno.test("V3 mountain-west clear summer largemouth keeps clean-cadence surface baits out of subtle highland summer stories", () => {
  const req = request({
    location: {
      latitude: 39.75,
      longitude: -105.2,
      state_code: "CO",
      region_key: "mountain_west",
      local_date: "2026-08-14",
      local_timezone: "America/Denver",
      month: 8,
    },
    water_clarity: "clear",
  });

  const result = computeRecommenderV3(
    req,
    analysis({
      condition_context: {
        temperature_metabolic_context: "heat_limited",
        temperature_trend: "stable",
        temperature_shock: "sharp_warmup",
      },
      norm: {
        normalized: {
          wind_condition: { label: "moderate", score: 0.8 },
          light_cloud_condition: { label: "mixed", score: 0 },
          precipitation_disruption: { label: "dry_stable", score: 0.1 },
        },
      },
    }),
  );

  assert(
    result.lure_recommendations.every((candidate) =>
      candidate.id !== "walking_topwater" && candidate.id !== "prop_bait"
    ),
  );
  assert(
    result.lure_recommendations.some((candidate) =>
      candidate.id === "swim_jig" || candidate.id === "hollow_body_frog"
    ),
  );
});

Deno.test("V3 dirty fall backwater largemouth keeps squarebill out of the dirty-water top 3", () => {
  const req = request({
    location: {
      latitude: 44.91,
      longitude: -93.39,
      state_code: "MN",
      region_key: "midwest_interior",
      local_date: "2026-10-15",
      local_timezone: "America/Chicago",
      month: 10,
    },
    water_clarity: "dirty",
  });

  const result = computeRecommenderV3(
    req,
    analysis({
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "stable",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          wind_condition: { label: "light", score: 0.2 },
          light_cloud_condition: { label: "mixed", score: 0 },
          precipitation_disruption: { label: "dry_stable", score: 0.1 },
        },
      },
    }),
  );

  assertEquals(result.lure_recommendations[0]?.id, "spinnerbait");
  assert(
    result.lure_recommendations.every((candidate) => candidate.id !== "squarebill_crankbait"),
  );
});

Deno.test("V3 foundation output is stable across repeated identical requests", () => {
  const req = request({
    species: "smallmouth_bass",
    context: "freshwater_river",
    water_clarity: "clear",
  });
  const sharedAnalysis = analysis({
    norm: {
      normalized: {
        pressure_regime: { label: "recently_stabilizing", score: 0.25 },
        wind_condition: { label: "light", score: 0.15 },
        light_cloud_condition: { label: "mixed", score: 0 },
        runoff_flow_disruption: { label: "stable", score: 0.8 },
      },
    },
  });

  const a = computeRecommenderV3(req, sharedAnalysis);
  const b = computeRecommenderV3(req, sharedAnalysis);

  assertEquals(a, b);
});
