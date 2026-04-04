import { assertEquals, assertThrows } from "jsr:@std/assert";
import type { RecommenderRequest } from "../contracts/input.ts";
import { runRecommenderV3 } from "../runRecommenderV3.ts";
import { resolveDailyPayloadV3 } from "../v3/resolveDailyPayload.ts";
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
        pressure_regime: { label: "recently_stabilizing" },
        wind_condition: { score: 0 },
        light_cloud_condition: { label: "mixed_sky" },
        ...((overrides.norm as { normalized?: object } | undefined)?.normalized ?? {}),
      },
    },
  } as any;
}

function request(overrides: Partial<RecommenderRequest> = {}): RecommenderRequest {
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

Deno.test("V3 scope maps legacy freshwater species into the new species list", () => {
  assertEquals(toRecommenderV3Species("largemouth_bass"), "largemouth_bass");
  assertEquals(toRecommenderV3Species("pike_musky"), "northern_pike");
  assertEquals(toRecommenderV3Species("river_trout"), "trout");
  assertEquals(toRecommenderV3Species("redfish"), null);
});

Deno.test("V3 scope enforces trout as river-only", () => {
  assertThrows(
    () => assertRecommenderV3Scope({ species: "river_trout", context: "freshwater_lake_pond" }),
    Error,
    "does not support",
  );
});

Deno.test("V3 daily payload nudges upward on a strong warming low-light day", () => {
  const payload = resolveDailyPayloadV3(
    analysis({
      scored: { score: 78, band: "Good" },
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "warming",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "falling_slow" },
          wind_condition: { score: -1.2 },
          light_cloud_condition: { label: "low_light" },
        },
      },
    }),
    "freshwater_lake_pond",
  );

  assertEquals(payload.mood_nudge, "up_2");
  assertEquals(payload.water_column_nudge, "higher_1");
  assertEquals(payload.presentation_nudge, "bolder");
});

Deno.test("V3 foundation shell reuses the canonical region key and core daily payload", () => {
  const snapshot = runRecommenderV3(request({
    species: "largemouth_bass",
    context: "freshwater_river",
  }));

  assertEquals(snapshot.feature, "recommender_v3");
  assertEquals(snapshot.species, "largemouth_bass");
  assertEquals(snapshot.context, "freshwater_river");
  assertEquals(snapshot.region_key, "appalachian");
  assertEquals(snapshot.variables_considered, [
    "temperature_condition",
    "pressure_regime",
    "wind_condition",
    "light_cloud_condition",
    "runoff_flow_disruption",
  ]);
  assertEquals(snapshot.lure_recommendations.length, 3);
  assertEquals(snapshot.fly_recommendations.length, 3);
});
