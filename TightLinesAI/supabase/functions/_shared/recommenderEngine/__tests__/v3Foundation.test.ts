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
    ...Object.keys(result.seasonal_row.seasonal_lure_weights),
    ...Object.keys(result.seasonal_row.seasonal_fly_weights),
  ]);

  assertEquals(result.daily_payload.surface_window_today, "closed");
  assertEquals(result.daily_payload.suppress_true_topwater, true);
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
