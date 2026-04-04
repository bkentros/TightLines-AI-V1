import { assert, assertEquals } from "jsr:@std/assert";
import { runRecommenderV3 } from "../runRecommenderV3.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import { resolveSeasonalRowV3 } from "../v3/index.ts";
import { resolveFinalProfileV3 } from "../v3/index.ts";
import { resolveDailyPayloadV3 } from "../v3/index.ts";

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
      latitude: 26.94,
      longitude: -80.8,
      state_code: "FL",
      region_key: "florida",
      local_date: "2026-01-15",
      local_timezone: "America/New_York",
      month: 1,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    env_data: {},
    ...overrides,
  };
}

Deno.test("V3 Phase 3A resolves the correct largemouth seasonal row", () => {
  const row = resolveSeasonalRowV3("largemouth_bass", "florida", 1, "freshwater_lake_pond");
  assertEquals(row.base_water_column, "bottom");
  assertEquals(row.base_mood, "negative");
  assert(row.viable_lure_archetypes.includes("football_jig"));
});

Deno.test("V3 Phase 3A keeps a winter Florida largemouth warm-up bounded to an in-range opening", () => {
  const row = resolveSeasonalRowV3("largemouth_bass", "florida", 1, "freshwater_lake_pond");
  const daily = resolveDailyPayloadV3(
    analysis({
      scored: { score: 74, band: "Good" },
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "warming",
        temperature_shock: "sharp_warmup",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "falling_slow" },
          wind_condition: { score: -0.8 },
          light_cloud_condition: { label: "low_light" },
        },
      },
    }),
    "freshwater_lake_pond",
  );
  const resolved = resolveFinalProfileV3(row, daily, "stained");

  assertEquals(resolved.final_water_column, "mid");
  assertEquals(resolved.final_mood, "active");
  assert(resolved.final_presentation_style === "balanced" || resolved.final_presentation_style === "bold");
});

Deno.test("V3 Phase 3A returns 3 lure and fly recommendations with color guidance", () => {
  const result = runRecommenderV3(request({
    location: {
      latitude: 26.94,
      longitude: -80.8,
      state_code: "FL",
      region_key: "florida",
      local_date: "2026-03-15",
      local_timezone: "America/New_York",
      month: 3,
    },
  }));

  assertEquals(result.feature, "recommender_v3");
  assertEquals(result.lure_recommendations.length, 3);
  assertEquals(result.fly_recommendations.length, 3);
  for (const candidate of [...result.lure_recommendations, ...result.fly_recommendations]) {
    assertEquals(candidate.color_recommendations.length, 3);
    assert(candidate.score > 0);
  }
});

Deno.test("V3 Phase 3A avoids redundant top 3 lure outputs in a tight fall window", () => {
  const result = runRecommenderV3(request({
    location: {
      latitude: 35.5,
      longitude: -82.5,
      state_code: "NC",
      region_key: "appalachian",
      local_date: "2026-10-10",
      local_timezone: "America/New_York",
      month: 10,
    },
  }));

  const tacticalLanes = result.lure_recommendations.map((candidate) => candidate.tactical_lane);
  assert(new Set(tacticalLanes).size >= 2);
});
