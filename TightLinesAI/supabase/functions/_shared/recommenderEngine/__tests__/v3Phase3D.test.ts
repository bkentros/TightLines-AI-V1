import { assert, assertEquals } from "jsr:@std/assert";
import { runRecommenderV3 } from "../runRecommenderV3.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import type { RecommenderV3SeasonalRow } from "../v3/index.ts";
import {
  NORTHERN_PIKE_V3_SEASONAL_ROWS,
  NORTHERN_PIKE_V3_SUPPORTED_REGIONS,
  resolveDailyPayloadV3,
  resolveFinalProfileV3,
  resolveSeasonalRowV3,
} from "../v3/index.ts";
import { getValidSpeciesForState, isSpeciesValidForState } from "../index.ts";

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
      latitude: 46.78,
      longitude: -92.1,
      state_code: "MN",
      region_key: "great_lakes_upper_midwest",
      local_date: "2026-10-10",
      local_timezone: "America/Chicago",
      month: 10,
    },
    species: "pike_musky",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    env_data: {},
    ...overrides,
  };
}

Deno.test("V3 Phase 3D keeps northern pike geo-gated by the shared state species map", () => {
  assertEquals(isSpeciesValidForState("FL", "pike_musky", "freshwater_lake_pond"), false);
  assertEquals(isSpeciesValidForState("AK", "pike_musky", "freshwater_lake_pond"), true);
  assertEquals(isSpeciesValidForState("AK", "pike_musky", "freshwater_river"), false);

  const mnFreshwaterLakeSpecies = getValidSpeciesForState("MN", "freshwater_lake_pond")
    .map((entry: { species: string }) => entry.species);
  assert(mnFreshwaterLakeSpecies.includes("pike_musky"));
});

Deno.test("V3 Phase 3D covers every supported pike region, month, and context", () => {
  for (const region of NORTHERN_PIKE_V3_SUPPORTED_REGIONS) {
    for (const context of ["freshwater_lake_pond", "freshwater_river"] as const) {
      const months = NORTHERN_PIKE_V3_SEASONAL_ROWS
        .filter((row: RecommenderV3SeasonalRow) => row.region_key === region && row.context === context)
        .map((row: RecommenderV3SeasonalRow) => row.month)
        .sort((a: number, b: number) => a - b);

      assertEquals(months, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    }
  }
});

Deno.test("V3 Phase 3D resolves warm-edge summer pike as a true summer row with topwater available", () => {
  const row = resolveSeasonalRowV3("northern_pike", "south_central", 8, "freshwater_lake_pond");
  assertEquals(row.base_water_column, "shallow");
  assertEquals(row.base_mood, "active");
  assertEquals(row.primary_forage, "baitfish");
  assert(row.viable_lure_archetypes.includes("large_profile_pike_swimbait"));
  assert(row.viable_lure_archetypes.includes("hollow_body_frog"));
});

Deno.test("V3 Phase 3D keeps a winter warm-up bounded away from surface output", () => {
  const row = resolveSeasonalRowV3("northern_pike", "great_lakes_upper_midwest", 2, "freshwater_lake_pond");
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
          wind_condition: { score: -0.5 },
          light_cloud_condition: { label: "low_light" },
        },
      },
    }),
    "freshwater_lake_pond",
  );
  const resolved = resolveFinalProfileV3(row, daily, "stained");

  assertEquals(resolved.final_water_column, "shallow");
  assertEquals(resolved.final_mood, "active");

  const result = runRecommenderV3(request({
    location: {
      latitude: 46.78,
      longitude: -92.1,
      state_code: "MN",
      region_key: "great_lakes_upper_midwest",
      local_date: "2026-02-18",
      local_timezone: "America/Chicago",
      month: 2,
    },
  }));

  assert(result.lure_recommendations.every((candidate) => candidate.tactical_lane !== "surface"));
  assert(result.fly_recommendations.every((candidate) => candidate.tactical_lane !== "fly_surface"));
});

Deno.test("V3 Phase 3D returns pike-specific fall recommendations with color guidance", () => {
  const result = runRecommenderV3(request());

  assertEquals(result.feature, "recommender_v3");
  assertEquals(result.lure_recommendations.length, 3);
  assertEquals(result.fly_recommendations.length, 3);
  assert(
    result.lure_recommendations.some((candidate) =>
      candidate.id === "large_profile_pike_swimbait" || candidate.id === "pike_jerkbait"
    ),
  );
  assert(
    result.fly_recommendations.some((candidate) =>
      candidate.id === "large_articulated_pike_streamer" || candidate.id === "pike_bunny_streamer"
    ),
  );

  for (const candidate of [...result.lure_recommendations, ...result.fly_recommendations]) {
    assertEquals(candidate.color_recommendations.length, 3);
    assert(candidate.score > 0);
  }
});
