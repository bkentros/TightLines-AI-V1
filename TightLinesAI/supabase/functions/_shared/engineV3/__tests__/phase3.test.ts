// =============================================================================
// ENGINE V3 — Phase 3 Tests
// Measured scoring, regime, weighting, missing-data reweighting.
// Run: deno test supabase/functions/_shared/engineV3/__tests__/phase3.test.ts
// =============================================================================

import { assertEquals, assert } from "jsr:@std/assert";
import { resolveGeoContextV3 } from "../context/resolveGeoContextV3.ts";
import { normalizeEnvironmentV3 } from "../normalizeEnvironmentV3.ts";
import {
  runScoreEngineV3,
  resolvePrimaryConditionsRegime,
  reweightForMissingAndRegime,
  getWeightProfile,
} from "../index.ts";
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRawEnv(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    lat: 27.5,
    lon: -82.5,
    timezone: "America/New_York",
    tz_offset_hours: -5,
    weather: {
      temperature: 78,
      wind_speed: 8,
      cloud_cover: 40,
      pressure: 1015,
      pressure_trend: "stable",
      pressure_change_rate_mb_hr: 0,
      temp_trend_3day: "stable",
      precip_48hr_inches: 0,
      precip_7day_inches: 0.5,
    },
    sun: { sunrise: "06:30", sunset: "18:00" },
    moon: { phase: "first quarter", illumination: 0.5 },
    solunar: {
      major_periods: [{ start_local: "11:00", end_local: "13:00" }],
      minor_periods: [],
    },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Freshwater scoring does not use inferred/manual water temp
// ---------------------------------------------------------------------------

Deno.test("freshwater scoring: no water temp in contributions", () => {
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const raw = makeRawEnv();
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const result = runScoreEngineV3(env, ctx);

  assertEquals(result.eligibleVariables.includes("coastal_water_temp"), false);
  assertEquals(result.eligibleVariables.includes("tide_current"), false);

  const hasWaterTempInProfile = result.contributions.some((c) => c.variableId === "coastal_water_temp");
  const hasTideInProfile = result.contributions.some((c) => c.variableId === "tide_current");
  assertEquals(hasWaterTempInProfile, false);
  assertEquals(hasTideInProfile, false);
});

Deno.test("freshwater scoring: profile has no water temp variable", () => {
  const profile = getWeightProfile("gulf_florida", 7, "freshwater_lake");
  const varIds = profile.variables.map((v) => v.variableId);
  assertEquals(varIds.includes("coastal_water_temp"), false);
  assertEquals(varIds.includes("tide_current"), false);
});

// ---------------------------------------------------------------------------
// Brackish/saltwater scoring can use tide/current
// ---------------------------------------------------------------------------

Deno.test("brackish scoring: tide_current in profile and can contribute", () => {
  const profile = getWeightProfile("gulf_florida", 7, "brackish");
  const varIds = profile.variables.map((v) => v.variableId);
  assertEquals(varIds.includes("tide_current"), true);

  const raw = makeRawEnv({
    coastal: true,
    tides: {
      predictions_today: [
        { time_local: "06:00", type: "L", height_ft: 1.5 },
        { time_local: "12:00", type: "H", height_ft: 3.0 },
        { time_local: "18:00", type: "L", height_ft: 1.2 },
      ],
    },
  });
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "brackish",
    environmentMode: "brackish",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const result = runScoreEngineV3(env, ctx);

  assertEquals(result.eligibleVariables.includes("tide_current"), true);
  const tideContrib = result.contributions.find((c) => c.variableId === "tide_current");
  assert(tideContrib !== undefined);
  assertEquals(tideContrib.applicable, true);
});

// ---------------------------------------------------------------------------
// Measured coastal water temp contributes only when actually present
// ---------------------------------------------------------------------------

Deno.test("coastal water temp: excluded when not measured", () => {
  const raw = makeRawEnv({
    coastal: true,
    measured_water_temp_f: null,
    tides: {
      predictions_today: [
        { time_local: "06:00", type: "L", height_ft: 1.5 },
        { time_local: "12:00", type: "H", height_ft: 3.0 },
      ],
    },
  });
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "saltwater",
    environmentMode: "saltwater",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const result = runScoreEngineV3(env, ctx);

  assertEquals(result.eligibleVariables.includes("coastal_water_temp"), false);
});

Deno.test("coastal water temp: included when measured", () => {
  const raw = makeRawEnv({
    coastal: true,
    measured_water_temp_f: 78,
    tides: {
      predictions_today: [
        { time_local: "06:00", type: "L", height_ft: 1.5 },
        { time_local: "12:00", type: "H", height_ft: 3.0 },
      ],
    },
  });
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "saltwater",
    environmentMode: "saltwater",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const result = runScoreEngineV3(env, ctx);

  assertEquals(result.eligibleVariables.includes("coastal_water_temp"), true);
});

// ---------------------------------------------------------------------------
// Regime changes as conditions move supportive -> highly_suppressive
// ---------------------------------------------------------------------------

Deno.test("regime: supportive when stable pressure, light wind, no precip", () => {
  const raw = makeRawEnv({
    weather: {
      temperature: 75,
      wind_speed: 6,
      pressure: 1015,
      pressure_trend: "stable",
      pressure_change_rate_mb_hr: 0,
      precip_48hr_inches: 0,
    },
  });
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const regime = resolvePrimaryConditionsRegime(env, ctx);
  assertEquals(regime, "supportive");
});

Deno.test("regime: highly_suppressive when severe wind", () => {
  const raw = makeRawEnv({
    weather: {
      temperature: 75,
      wind_speed: 40,
      pressure: 1015,
      pressure_trend: "stable",
      precip_48hr_inches: 0,
    },
  });
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const regime = resolvePrimaryConditionsRegime(env, ctx);
  assertEquals(regime, "highly_suppressive");
});

Deno.test("regime: highly_suppressive when rapid pressure fall", () => {
  const raw = makeRawEnv({
    weather: {
      temperature: 75,
      wind_speed: 8,
      pressure: 1005,
      pressure_trend: "rapidly_falling",
      pressure_change_rate_mb_hr: -1.2,
      precip_48hr_inches: 0,
    },
  });
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const regime = resolvePrimaryConditionsRegime(env, ctx);
  assertEquals(regime, "highly_suppressive");
});

Deno.test("regime: supportive when slowly falling pressure (pre-front window)", () => {
  const raw = makeRawEnv({
    weather: {
      temperature: 75,
      wind_speed: 5,
      pressure: 1012,
      pressure_trend: "slowly_falling",
      pressure_change_rate_mb_hr: -0.4,
      precip_48hr_inches: 0,
    },
  });
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const regime = resolvePrimaryConditionsRegime(env, ctx);
  assertEquals(regime, "supportive");
});

// ---------------------------------------------------------------------------
// Regime scaling: supportive increases secondary/tertiary; suppressive mutes
// ---------------------------------------------------------------------------

Deno.test("regime scaling: supportive regime boosts tertiary weight", () => {
  const profile = getWeightProfile("gulf_florida", 7, "freshwater_lake");
  const allVars = profile.variables.map((v) => v.variableId);
  const reweightSupportive = reweightForMissingAndRegime(
    profile,
    allVars,
    "supportive"
  );
  const reweightSuppressive = reweightForMissingAndRegime(
    profile,
    allVars,
    "highly_suppressive"
  );

  const solunarBase = profile.variables.find((v) => v.variableId === "solunar_moon");
  assert(solunarBase !== undefined);
  assertEquals(solunarBase.tier, "tertiary");

  const solunarSupportive = reweightSupportive.finalNormalizedWeights["solunar_moon"];
  const solunarSuppressive = reweightSuppressive.finalNormalizedWeights["solunar_moon"];
  assert(solunarSupportive > 0);
  assert(solunarSuppressive > 0);
  assert(solunarSupportive > solunarSuppressive);
});

Deno.test("regime scaling: highly_suppressive mutes tertiary", () => {
  const profile = getWeightProfile("gulf_florida", 7, "freshwater_lake");
  const allVars = profile.variables.map((v) => v.variableId);
  const reweight = reweightForMissingAndRegime(
    profile,
    allVars,
    "highly_suppressive"
  );

  const pressureWeight = reweight.finalNormalizedWeights["pressure"];
  const solunarWeight = reweight.finalNormalizedWeights["solunar_moon"];
  assert(pressureWeight > solunarWeight);
});

// ---------------------------------------------------------------------------
// Missing-data reweighting renormalizes effective weights
// ---------------------------------------------------------------------------

Deno.test("missing-data reweighting: removed vars have zero final weight", () => {
  const profile = getWeightProfile("gulf_florida", 7, "freshwater_lake");
  const eligibleWithoutWind = profile.variables
    .map((v) => v.variableId)
    .filter((id) => id !== "wind");
  const reweight = reweightForMissingAndRegime(
    profile,
    eligibleWithoutWind,
    "neutral"
  );

  assertEquals(reweight.removedVariables.includes("wind"), true);
  assertEquals(reweight.finalNormalizedWeights["wind"], 0);

  const sum = eligibleWithoutWind.reduce(
    (s, id) => s + reweight.finalNormalizedWeights[id],
    0
  );
  assertEquals(Math.abs(sum - 1.0) < 0.001, true);
});

Deno.test("missing-data reweighting: eligible weights sum to 1", () => {
  const profile = getWeightProfile("gulf_florida", 7, "freshwater_lake");
  const eligible = profile.variables.map((v) => v.variableId);
  const reweight = reweightForMissingAndRegime(profile, eligible, "neutral");

  let sum = 0;
  for (const id of eligible) {
    sum += reweight.finalNormalizedWeights[id];
  }
  assertEquals(Math.abs(sum - 1.0) < 0.001, true);
});

// ---------------------------------------------------------------------------
// Output structure: score, band, regime, contributions, weights, drivers, suppressors
// ---------------------------------------------------------------------------

Deno.test("score result: has required output structure", () => {
  const raw = makeRawEnv();
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const result = runScoreEngineV3(env, ctx);

  assertEquals(typeof result.overallScore, "number");
  assert(result.overallScore >= 0 && result.overallScore <= 100);
  assert(["Poor", "Fair", "Good", "Great"].includes(result.scoreBand));
  assert(["supportive", "neutral", "suppressive", "highly_suppressive"].includes(result.regime));
  assert(Array.isArray(result.contributions));
  assert(result.contributions.length > 0);
  assert(Array.isArray(result.topDrivers));
  assert(Array.isArray(result.topSuppressors));
  assert(typeof result.weightProfileId, "string");
  assert(result.weightProfileId.length > 0);
  assert(Array.isArray(result.eligibleVariables));
  assert(Array.isArray(result.removedVariables));
  assert(typeof result.baseWeights, "object");
  assert(typeof result.regimeScaledWeights, "object");
  assert(typeof result.finalNormalizedWeights, "object");
  assert(result.dataCoverageUsed !== undefined);
});

// ---------------------------------------------------------------------------
// Historical baselines are not used as score substitutes
// ---------------------------------------------------------------------------

Deno.test("historical baselines: context only, no score substitution", () => {
  const raw = makeRawEnv({
    weather: {
      temperature: null,
      wind_speed: null,
      pressure: null,
      cloud_cover: null,
      precip_48hr_inches: null,
      precip_7day_inches: null,
    },
  });
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  assert(env.historical_context_inputs.airTempBaseline !== null);
  assert(env.historical_context_inputs.freshwaterTempBaseline !== null);

  const result = runScoreEngineV3(env, ctx);

  const airContrib = result.contributions.find((c) => c.variableId === "air_temp_trend");
  assert(airContrib !== undefined);
  assertEquals(airContrib.applicable, false);
  assertEquals(result.eligibleVariables.includes("air_temp_trend"), false);

  assertEquals(result.eligibleVariables.includes("coastal_water_temp"), false);
});
