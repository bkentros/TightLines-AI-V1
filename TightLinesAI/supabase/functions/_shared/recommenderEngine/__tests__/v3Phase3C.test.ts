import { assert, assertEquals } from "jsr:@std/assert";
import { runRecommenderV3 } from "../runRecommenderV3.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import type { RecommenderV3SeasonalRow } from "../v3/index.ts";
import {
  TROUT_V3_SEASONAL_ROWS,
  TROUT_V3_SUPPORTED_REGIONS,
  resolveDailyPayloadV3,
  resolveFinalProfileV3,
  resolveSeasonalRowV3,
} from "../v3/index.ts";
import { getValidSpeciesForState, isSpeciesValidForState } from "../index.ts";

function analysis(overrides: Record<string, unknown> = {}) {
  return {
    scored: {
      score: 58,
      band: "Fair",
      drivers: [],
      suppressors: [],
      ...(overrides.scored as object | undefined),
    },
    timing: {
      timing_strength: "fair",
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
      latitude: 45.31,
      longitude: -121.69,
      state_code: "OR",
      region_key: "mountain_west",
      local_date: "2026-10-05",
      local_timezone: "America/Los_Angeles",
      month: 10,
    },
    species: "river_trout",
    context: "freshwater_river",
    water_clarity: "clear",
    env_data: {},
    ...overrides,
  };
}

Deno.test("V3 Phase 3C keeps trout geo-gated by the shared state species map", () => {
  assertEquals(isSpeciesValidForState("FL", "river_trout", "freshwater_river"), false);
  assertEquals(isSpeciesValidForState("NC", "river_trout", "freshwater_river"), true);

  const ncFreshwaterRiverSpecies = getValidSpeciesForState("NC", "freshwater_river")
    .map((entry: { species: string }) => entry.species);
  assert(ncFreshwaterRiverSpecies.includes("river_trout"));
});

Deno.test("V3 Phase 3C covers every supported trout region and month for river context", () => {
  for (const region of TROUT_V3_SUPPORTED_REGIONS) {
    const months = TROUT_V3_SEASONAL_ROWS
      .filter((row: RecommenderV3SeasonalRow) =>
        row.region_key === region && row.context === "freshwater_river"
      )
      .map((row: RecommenderV3SeasonalRow) => row.month)
      .sort((a: number, b: number) => a - b);

    assertEquals(months, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  }
});

Deno.test("V3 Phase 3C resolves warm-tailwater trout as summer-deeper and more restrained", () => {
  const row = resolveSeasonalRowV3("trout", "south_central", 8, "freshwater_river");
  assertEquals(row.base_water_column, "bottom");
  assertEquals(row.base_mood, "negative");
  assertEquals(row.primary_forage, "baitfish");
  assert(row.viable_fly_archetypes.includes("muddler_sculpin"));
  assert(!row.viable_fly_archetypes.includes("mouse_fly"));
});

Deno.test("V3 Phase 3C keeps a cold-season trout warm-up bounded away from surface output", () => {
  const row = resolveSeasonalRowV3("trout", "northeast", 1, "freshwater_river");
  const daily = resolveDailyPayloadV3(
    analysis({
      scored: { score: 72, band: "Good" },
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "warming",
        temperature_shock: "sharp_warmup",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "falling_slow" },
          wind_condition: { score: -0.6 },
          light_cloud_condition: { label: "low_light" },
        },
      },
    }),
    "freshwater_river",
  );
  const resolved = resolveFinalProfileV3(row, daily, "clear");
  assertEquals(resolved.final_water_column, "mid");
  assertEquals(resolved.final_mood, "active");

  const result = runRecommenderV3(request({
    location: {
      latitude: 41.99,
      longitude: -74.92,
      state_code: "NY",
      region_key: "northeast",
      local_date: "2026-01-20",
      local_timezone: "America/New_York",
      month: 1,
    },
  }));

  assert(result.lure_recommendations.every((candidate) => candidate.tactical_lane !== "surface"));
  assert(result.fly_recommendations.every((candidate) => candidate.tactical_lane !== "fly_surface"));
});

Deno.test("V3 Phase 3C returns trout-focused fall river recommendations with color guidance", () => {
  const result = runRecommenderV3(request());

  assertEquals(result.feature, "recommender_v3");
  assertEquals(result.lure_recommendations.length, 3);
  assertEquals(result.fly_recommendations.length, 3);
  assert(
    result.lure_recommendations.some((candidate) =>
      candidate.id === "inline_spinner" || candidate.id === "suspending_jerkbait"
    ),
  );
  assert(
    result.fly_recommendations.some((candidate) =>
      candidate.id === "articulated_baitfish_streamer" || candidate.id === "game_changer"
    ),
  );

  for (const candidate of [...result.lure_recommendations, ...result.fly_recommendations]) {
    assertEquals(candidate.color_recommendations.length, 3);
    assert(candidate.score > 0);
  }
});
