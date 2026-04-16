import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import type { RecommenderRequest } from "../contracts/input.ts";
import { computeRecommenderV3 } from "../runRecommenderV3.ts";
import { resolveDailyPayloadV3 } from "../v3/resolveDailyPayload.ts";
import { resolveFinalProfileV3 } from "../v3/resolveFinalProfile.ts";
import { resolveSeasonalRowV3 } from "../v3/seasonal/resolveSeasonalRow.ts";
import {
  assertRecommenderV3Scope,
  toLegacyRecommenderSpecies,
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
  assertEquals(toLegacyRecommenderSpecies("northern_pike"), "pike_musky");
  assertEquals(toLegacyRecommenderSpecies("trout"), "river_trout");
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

Deno.test("V3 daily payload resolves aggressive aligned days into stronger shifts and open surface", () => {
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
  assertEquals(payload.reaction_window, "on");
  assertEquals(payload.column_shift, 1);
  assertEquals(payload.surface_allowed_today, true);
  assertEquals(payload.surface_window, "rippled");
  assertEquals(payload.high_visibility_needed, true);
});

Deno.test("V3 resolved profile clamps daily preference inside the monthly baseline", () => {
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

  assert(
    row.monthly_baseline.allowed_columns.includes(
      resolved.daily_preference.preferred_column,
    ),
  );
  assert(
    row.monthly_baseline.allowed_paces.includes(
      resolved.daily_preference.preferred_pace,
    ),
  );
  assert(
    row.monthly_baseline.allowed_presence.includes(
      resolved.daily_preference.preferred_presence,
    ),
  );
});

Deno.test("V3 windy summer lake days close surface and keep picks inside the seasonal pool", () => {
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

  assertEquals(result.daily_payload.surface_window, "closed");
  assertEquals(result.daily_payload.surface_allowed_today, false);
  assert(
    [...result.lure_recommendations, ...result.fly_recommendations].every(
      (candidate) => seasonalIds.has(candidate.id),
    ),
  );
  assert(
    [...result.lure_recommendations, ...result.fly_recommendations].every(
      (candidate) => candidate.is_surface === false,
    ),
  );
});

Deno.test("V3 seasonal resolution exposes fallback provenance when product fallback is used", () => {
  const row = resolveSeasonalRowV3(
    "trout",
    "florida",
    10,
    "freshwater_river",
  );

  assertEquals(row.used_region_fallback, true);
  assertEquals(row.source_region_key, row.region_key);
  assert(["gulf_coast", "southeast_atlantic"].includes(row.source_region_key));
});

Deno.test("V3 results return exactly three lure and fly recommendations with deterministic explanations", () => {
  const result = computeRecommenderV3(request(), analysis());

  assertEquals(result.lure_recommendations.length, 3);
  assertEquals(result.fly_recommendations.length, 3);
  for (const recommendation of [...result.lure_recommendations, ...result.fly_recommendations]) {
    assert(typeof recommendation.why_chosen === "string");
    assert(typeof recommendation.how_to_fish === "string");
    assert(typeof recommendation.family_group === "string");
  }
});
