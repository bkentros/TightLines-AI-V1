// =============================================================================
// ENGINE V3 — Phase 4 Tests
// Window engine: context-sensitive, regime-gated, measured drivers only.
// Run: deno test supabase/functions/_shared/engineV3/__tests__/phase4.test.ts
// =============================================================================

import { assertEquals, assert } from "jsr:@std/assert";
import { resolveGeoContextV3 } from "../context/resolveGeoContextV3.ts";
import { normalizeEnvironmentV3 } from "../normalizeEnvironmentV3.ts";
import {
  runScoreEngineV3,
  runWindowEngineV3,
  getWindowContextProfile,
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
// Freshwater winter: favors warming periods
// ---------------------------------------------------------------------------

Deno.test("freshwater winter: favors warming periods in context profile", () => {
  const profile = getWindowContextProfile("great_lakes_upper_midwest", 1, "freshwater_lake");
  assertEquals(profile.favorsWarmingPeriods, true);
  assertEquals(profile.favorsLowLightPeriods, false);
});

Deno.test("freshwater winter: midday can improve when cold", () => {
  const raw = makeRawEnv({
    weather: { temperature: 28, wind_speed: 5, cloud_cover: 30, pressure: 1018 },
  });
  const ctx = resolveGeoContextV3({
    latitude: 45.0,
    longitude: -93.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const scoreResult = runScoreEngineV3(env, ctx);
  const windowResult = runWindowEngineV3(env, ctx, scoreResult);

  const midday = windowResult.blocks.find((b) => b.blockId === "midday");
  assert(midday !== undefined);
  assert(midday.primaryFactorSummary.length > 0);
  assert(
    midday.reasons.some((r) => r.includes("favorable") || r.includes("warming")) ||
      midday.secondaryFactorSummary.includes("cloud") ||
      midday.score >= 40
  );
});

// ---------------------------------------------------------------------------
// Freshwater summer: favors low-light periods
// ---------------------------------------------------------------------------

Deno.test("freshwater summer: favors low-light in context profile", () => {
  const profile = getWindowContextProfile("great_lakes_upper_midwest", 7, "freshwater_lake");
  assertEquals(profile.favorsLowLightPeriods, true);
  assertEquals(profile.favorsWarmingPeriods, false);
});

Deno.test("freshwater summer: dawn and dusk score higher than midday when hot", () => {
  const raw = makeRawEnv({
    weather: { temperature: 92, wind_speed: 5, cloud_cover: 10, pressure: 1015 },
  });
  const ctx = resolveGeoContextV3({
    latitude: 45.0,
    longitude: -93.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const scoreResult = runScoreEngineV3(env, ctx);
  const windowResult = runWindowEngineV3(env, ctx, scoreResult);

  const dawn = windowResult.blocks.find((b) => b.blockId === "dawn");
  const dusk = windowResult.blocks.find((b) => b.blockId === "dusk");
  const midday = windowResult.blocks.find((b) => b.blockId === "midday");
  assert(dawn !== undefined && dusk !== undefined && midday !== undefined);
  assert(dawn.score >= midday.score);
  assert(dusk.score >= midday.score);
});

// ---------------------------------------------------------------------------
// Cloud cover can improve midday
// ---------------------------------------------------------------------------

Deno.test("cloud cover can improve midday summer freshwater", () => {
  const rawClear = makeRawEnv({
    weather: { temperature: 88, wind_speed: 5, cloud_cover: 10, pressure: 1015 },
  });
  const rawOvercast = makeRawEnv({
    weather: { temperature: 88, wind_speed: 5, cloud_cover: 80, pressure: 1015 },
  });
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const envClear = normalizeEnvironmentV3(rawClear as never, ctx);
  const envOvercast = normalizeEnvironmentV3(rawOvercast as never, ctx);
  const scoreClear = runScoreEngineV3(envClear, ctx);
  const scoreOvercast = runScoreEngineV3(envOvercast, ctx);
  const windowsClear = runWindowEngineV3(envClear, ctx, scoreClear);
  const windowsOvercast = runWindowEngineV3(envOvercast, ctx, scoreOvercast);

  const middayClear = windowsClear.blocks.find((b) => b.blockId === "midday");
  const middayOvercast = windowsOvercast.blocks.find((b) => b.blockId === "midday");
  assert(middayClear !== undefined && middayOvercast !== undefined);
  assert(middayOvercast.score >= middayClear.score);
});

// ---------------------------------------------------------------------------
// Coastal/brackish: tide shapes windows
// ---------------------------------------------------------------------------

Deno.test("coastal windows respond to tide timing", () => {
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
    waterType: "saltwater",
    environmentMode: "saltwater",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const scoreResult = runScoreEngineV3(env, ctx);
  const windowResult = runWindowEngineV3(env, ctx, scoreResult);

  const blocksWithTide = windowResult.blocks.filter(
    (b) =>
      b.reasons.some((r) => r.includes("tide") || r.includes("incoming") || r.includes("outgoing")) ||
      b.tideOverlapMajor
  );
  assert(blocksWithTide.length > 0);
  assertEquals(windowResult.tideOverlapMajorFactor, true);
});

// ---------------------------------------------------------------------------
// Supportive regime: solunar can influence windows
// ---------------------------------------------------------------------------

Deno.test("supportive regime allows solunar to influence windows", () => {
  const raw = makeRawEnv({
    weather: {
      temperature: 72,
      wind_speed: 8,
      cloud_cover: 40,
      pressure: 1015,
      pressure_trend: "stable",
      precip_48hr_inches: 0,
    },
    solunar: {
      major_periods: [{ start_local: "06:00", end_local: "08:00" }],
      minor_periods: [],
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
  const scoreResult = runScoreEngineV3(env, ctx);
  const windowResult = runWindowEngineV3(env, ctx, scoreResult);

  assertEquals(scoreResult.regime, "supportive");
  const dawnWithSolunar = windowResult.blocks.find(
    (b) => b.blockId === "dawn" && b.reasons.some((r) => r.includes("solunar"))
  );
  assert(dawnWithSolunar !== undefined || windowResult.blocks.some((b) => b.reasons.some((r) => r.includes("solunar"))));
});

// ---------------------------------------------------------------------------
// Suppressive regime: tertiary muted
// ---------------------------------------------------------------------------

Deno.test("suppressive regime mutes tertiary effects", () => {
  const raw = makeRawEnv({
    weather: {
      temperature: 75,
      wind_speed: 35,
      cloud_cover: 40,
      pressure: 1015,
      precip_48hr_inches: 0,
    },
    solunar: {
      major_periods: [{ start_local: "06:00", end_local: "08:00" }],
      minor_periods: [],
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
  const scoreResult = runScoreEngineV3(env, ctx);
  const windowResult = runWindowEngineV3(env, ctx, scoreResult);

  assert(
    scoreResult.regime === "suppressive" || scoreResult.regime === "highly_suppressive"
  );
  assertEquals(windowResult.regimeLimited, true);
  const peakScore = windowResult.peakWindowScore;
  assert(peakScore < 75);
});

// ---------------------------------------------------------------------------
// Highly suppressive: solunar cannot create strong window
// ---------------------------------------------------------------------------

Deno.test("highly suppressive: solunar cannot create strong window", () => {
  const raw = makeRawEnv({
    weather: {
      temperature: 75,
      wind_speed: 42,
      cloud_cover: 40,
      pressure: 1005,
      pressure_trend: "rapidly_falling",
      pressure_change_rate_mb_hr: -1.2,
      precip_48hr_inches: 0,
    },
    solunar: {
      major_periods: [{ start_local: "06:00", end_local: "08:00" }],
      minor_periods: [],
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
  const scoreResult = runScoreEngineV3(env, ctx);
  const windowResult = runWindowEngineV3(env, ctx, scoreResult);

  assertEquals(scoreResult.regime, "highly_suppressive");
  const bestWindows = windowResult.bestWindows;
  const bestScore = bestWindows.length > 0 ? Math.max(...bestWindows.map((w) => w.score)) : 0;
  assert(bestScore < 70);
});

// ---------------------------------------------------------------------------
// Output structure
// ---------------------------------------------------------------------------

Deno.test("window result has required output structure", () => {
  const raw = makeRawEnv();
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const scoreResult = runScoreEngineV3(env, ctx);
  const windowResult = runWindowEngineV3(env, ctx, scoreResult);

  assert(Array.isArray(windowResult.blocks));
  assert(windowResult.blocks.length > 0);
  assert(Array.isArray(windowResult.bestWindows));
  assert(Array.isArray(windowResult.fairWindows));
  assert(Array.isArray(windowResult.poorWindows));
  assert(typeof windowResult.peakWindowScore, "number");
  assert(Array.isArray(windowResult.strongestWindows));
  assert(Array.isArray(windowResult.weakestWindows));
  assert(Array.isArray(windowResult.keyReasonsForBest));
  assert(Array.isArray(windowResult.keyReasonsForPoor));
  assert(typeof windowResult.regimeLimited, "boolean");
  assert(typeof windowResult.tideOverlapMajorFactor, "boolean");

  const block = windowResult.blocks[0];
  assert(block.blockId !== undefined);
  assert(block.label !== undefined);
  assert(block.startLocal !== undefined);
  assert(block.endLocal !== undefined);
  assert(block.score >= 0 && block.score <= 100);
  assert(["best", "fair", "poor"].includes(block.band));
  assert(["high", "medium", "low"].includes(block.confidence));
  assert(Array.isArray(block.reasons));
  assert(Array.isArray(block.suppressors));
  assert(typeof block.primaryFactorSummary, "string");
  assert(typeof block.regimeInfluence, "string");
  assert(["primary", "secondary", "tertiary"].includes(block.shapedMainlyBy));
});

// ---------------------------------------------------------------------------
// No precip-based river-flow proxy in window logic
// ---------------------------------------------------------------------------

Deno.test("no precip-based river-flow proxy in V3 window logic", () => {
  const raw = makeRawEnv({
    weather: {
      temperature: 72,
      wind_speed: 8,
      cloud_cover: 40,
      pressure: 1015,
      precip_48hr_inches: 2.5,
      precip_7day_inches: 5.5,
    },
  });
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "river_stream",
    environmentMode: "freshwater_river",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const scoreResult = runScoreEngineV3(env, ctx);
  const windowResult = runWindowEngineV3(env, ctx, scoreResult);

  for (const block of windowResult.blocks) {
    const allText = [
      block.reasons.join(" "),
      block.suppressors.join(" "),
      block.primaryFactorSummary,
      block.secondaryFactorSummary,
      block.tertiaryFactorSummary,
    ].join(" ").toLowerCase();
    assertEquals(allText.includes("elevated_flow") || allText.includes("elevated flow"), false);
    assertEquals(allText.includes("flow_likely") || allText.includes("flow likely"), false);
    assertEquals(allText.includes("river_flow") || allText.includes("river flow"), false);
    assertEquals(allText.includes("current_strength") || allText.includes("current strength"), false);
    assertEquals(allText.includes("flow_pulse") || allText.includes("flow pulse"), false);
  }
});

Deno.test("freshwater river windows function without fake flow variable", () => {
  const raw = makeRawEnv({
    weather: {
      temperature: 72,
      wind_speed: 8,
      cloud_cover: 40,
      pressure: 1015,
      precip_48hr_inches: 0,
      precip_7day_inches: 0.5,
    },
  });
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "river_stream",
    environmentMode: "freshwater_river",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const scoreResult = runScoreEngineV3(env, ctx);
  const windowResult = runWindowEngineV3(env, ctx, scoreResult);

  assert(windowResult.blocks.length > 0);
  assert(windowResult.bestWindows.length > 0 || windowResult.fairWindows.length > 0);
  assert(windowResult.peakWindowScore >= 40);
});

Deno.test("precipitation suppresses window quality without being treated as measured flow", () => {
  const rawDry = makeRawEnv({
    weather: {
      temperature: 72,
      wind_speed: 8,
      cloud_cover: 40,
      pressure: 1015,
      precip_48hr_inches: 0,
      precip_7day_inches: 0.5,
    },
  });
  const rawWet = makeRawEnv({
    weather: {
      temperature: 72,
      wind_speed: 8,
      cloud_cover: 40,
      pressure: 1015,
      precip_48hr_inches: 2.5,
      precip_7day_inches: 6.0,
    },
  });
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "river_stream",
    environmentMode: "freshwater_river",
  });
  const envDry = normalizeEnvironmentV3(rawDry as never, ctx);
  const envWet = normalizeEnvironmentV3(rawWet as never, ctx);
  const scoreDry = runScoreEngineV3(envDry, ctx);
  const scoreWet = runScoreEngineV3(envWet, ctx);
  const windowsDry = runWindowEngineV3(envDry, ctx, scoreDry);
  const windowsWet = runWindowEngineV3(envWet, ctx, scoreWet);

  assert(windowsWet.peakWindowScore <= windowsDry.peakWindowScore);
  const wetHasPrecipSuppressor = windowsWet.blocks.some((b) =>
    b.suppressors.some((s) => s.includes("precipitation") || s.includes("precip"))
  );
  assert(wetHasPrecipSuppressor);
  const wetHasFlowLanguage = windowsWet.blocks.some((b) => {
    const text = [...b.reasons, ...b.suppressors].join(" ").toLowerCase();
    return text.includes("flow") || text.includes("current");
  });
  assertEquals(wetHasFlowLanguage, false);
});

// ---------------------------------------------------------------------------
// No inferred freshwater water temp in window logic
// ---------------------------------------------------------------------------

Deno.test("no inferred freshwater water temp in window logic", () => {
  const raw = makeRawEnv();
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const scoreResult = runScoreEngineV3(env, ctx);
  const windowResult = runWindowEngineV3(env, ctx, scoreResult);

  for (const block of windowResult.blocks) {
    const allText = [
      block.reasons.join(" "),
      block.suppressors.join(" "),
      block.primaryFactorSummary,
      block.secondaryFactorSummary,
      block.tertiaryFactorSummary,
    ].join(" ").toLowerCase();
    assertEquals(allText.includes("water_temp") || allText.includes("water temp"), false);
    assertEquals(allText.includes("inferred_temp") || allText.includes("inferred temp"), false);
  }
});

// ---------------------------------------------------------------------------
// Missing data lowers window confidence
// ---------------------------------------------------------------------------

Deno.test("missing relevant variables lowers window confidence", () => {
  const rawSparse = makeRawEnv({
    weather: {
      temperature: 75,
      wind_speed: null,
      cloud_cover: null,
      pressure: null,
      precip_48hr_inches: null,
      precip_7day_inches: null,
    },
    sun: { sunrise: "06:30", sunset: "18:00" },
    solunar: { major_periods: [], minor_periods: [] },
  });
  const rawFull = makeRawEnv();
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const envSparse = normalizeEnvironmentV3(rawSparse as never, ctx);
  const envFull = normalizeEnvironmentV3(rawFull as never, ctx);
  const scoreSparse = runScoreEngineV3(envSparse, ctx);
  const scoreFull = runScoreEngineV3(envFull, ctx);
  const windowsSparse = runWindowEngineV3(envSparse, ctx, scoreSparse);
  const windowsFull = runWindowEngineV3(envFull, ctx, scoreFull);

  const lowConfSparse = windowsSparse.blocks.filter((b) => b.confidence === "low");
  const lowConfFull = windowsFull.blocks.filter((b) => b.confidence === "low");
  assert(lowConfSparse.length >= lowConfFull.length);
});

// ---------------------------------------------------------------------------
// Historical baselines not used as substitute
// ---------------------------------------------------------------------------

Deno.test("historical baselines: context nuance only, not substitute", () => {
  const raw = makeRawEnv({
    weather: {
      temperature: 75,
      wind_speed: 8,
      cloud_cover: 40,
      pressure: 1015,
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
  assert(env.historical_context_inputs.airTempBaseline !== null);

  const scoreResult = runScoreEngineV3(env, ctx);
  const windowResult = runWindowEngineV3(env, ctx, scoreResult);

  const blocksWithHistNote = windowResult.blocks.filter((b) => b.historicalContextNote != null);
  for (const b of blocksWithHistNote) {
    assert(b.historicalContextNote !== null);
    assert(!b.historicalContextNote.includes("substitute"));
    assert(!b.historicalContextNote.includes("replace"));
  }
});
