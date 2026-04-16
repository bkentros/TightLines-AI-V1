/**
 * Locks a subset of daily-shift pair behaviors against computeRecommenderV3.
 * Full 14-check suite remains in scripts/recommender-v3-audit/runDailyShiftAudit.ts.
 *
 * Run from TightLinesAI/: deno test --allow-read supabase/functions/_shared/recommenderEngine/__tests__/v3DailyShiftAnchors.test.ts
 */
import { assert } from "jsr:@std/assert";
import type { RecommenderRequest } from "../contracts/input.ts";
import { computeRecommenderV3 } from "../runRecommenderV3.ts";

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
      timing_strength: "fair",
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
        pressure_regime: { label: "recently_stabilizing", score: 0 },
        wind_condition: { label: "light", score: 0.3 },
        light_cloud_condition: { label: "mixed_sky" },
        ...((overrides.norm as { normalized?: object } | undefined)?.normalized ?? {}),
      },
    },
  } as any;
}

Deno.test("Regression: northern pike MN July low-light vs bright surface/top-3 split", () => {
  const baseLoc = {
    latitude: 46.87,
    longitude: -96.79,
    state_code: "MN",
    region_key: "great_lakes_upper_midwest" as const,
    local_date: "2026-07-22",
    local_timezone: "America/Chicago",
    month: 7,
  };

  const low: RecommenderRequest = {
    location: baseLoc,
    species: "pike_musky",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    env_data: {},
  };
  const lowA = analysis({
    scored: { score: 72, band: "Good" },
    timing: { timing_strength: "good", highlighted_periods: [true, false, false, true] },
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

  const bright: RecommenderRequest = { ...low };
  const brightA = analysis({
    scored: { score: 58, band: "Fair" },
    timing: { timing_strength: "fair", highlighted_periods: [false, false, false, false] },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "stable",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "recently_stabilizing", score: 0 },
        wind_condition: { label: "light", score: 0.5 },
        light_cloud_condition: { label: "bright" },
      },
    },
  });

  const left = computeRecommenderV3(low, lowA);
  const right = computeRecommenderV3(bright, brightA);

  const surfaceOn = left.daily_payload.surface_allowed_today &&
    left.daily_payload.surface_window !== "closed";
  const lureL = left.lure_recommendations.map((c) => c.id);
  const flyL = left.fly_recommendations.map((c) => c.id);
  assert(
    surfaceOn &&
      (lureL.includes("walking_topwater") || flyL.includes("frog_fly")),
    `low-light pike: expected surface lane + walker or frog_fly in top 3; lure=${lureL.join(",")} fly=${flyL.join(",")}`,
  );

  const lureR = right.lure_recommendations.map((c) => c.id);
  const flyR = right.fly_recommendations.map((c) => c.id);
  assert(
    !lureR.includes("walking_topwater") && !flyR.includes("frog_fly"),
    `bright pike: should not rank walking_topwater or frog_fly in top 3; lure=${lureR.join(",")} fly=${flyR.join(",")}`,
  );
});

Deno.test("Regression: NorCal July trout mouse window vs strong wind fly top-3", () => {
  const loc = {
    latitude: 41.7922,
    longitude: -122.6217,
    state_code: "CA",
    region_key: "northern_california" as const,
    local_date: "2026-07-18",
    local_timezone: "America/Los_Angeles",
    month: 7,
  };

  const base: RecommenderRequest = {
    location: loc,
    species: "river_trout",
    context: "freshwater_river",
    water_clarity: "clear",
    env_data: {},
  };

  const mouseWin = analysis({
    scored: { score: 72, band: "Good" },
    timing: { timing_strength: "good", highlighted_periods: [true, false, false, true] },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "warming",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "falling_slow", score: 0.7 },
        wind_condition: { label: "light", score: 0.65 },
        light_cloud_condition: { label: "low_light" },
      },
    },
  });

  const windy = analysis({
    scored: { score: 72, band: "Good" },
    timing: { timing_strength: "good", highlighted_periods: [true, false, false, true] },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "warming",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "falling_slow", score: 0.7 },
        wind_condition: { label: "strong", score: -0.8 },
        light_cloud_condition: { label: "low_light" },
      },
    },
  });

  const left = computeRecommenderV3(base, mouseWin);
  const right = computeRecommenderV3(base, windy);

  const leftFlies = left.fly_recommendations.map((c) => c.id);
  assert(
    left.daily_payload.surface_allowed_today &&
      left.daily_payload.surface_window !== "closed" &&
      leftFlies.includes("mouse_fly"),
    `mouse window: surface open and mouse_fly in top 3; flies=${leftFlies.join(",")}`,
  );

  const rightFlies = right.fly_recommendations.map((c) => c.id);
  assert(
    !rightFlies.includes("mouse_fly"),
    `strong wind: mouse_fly should not be in top 3; flies=${rightFlies.join(",")}`,
  );
});
