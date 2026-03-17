// =============================================================================
// ENGINE V3 — Phase 5 Tests
// Narration payload, report adapter, claim-guard, deterministic fallback.
// Run: deno test supabase/functions/_shared/engineV3/__tests__/phase5.test.ts
// =============================================================================

import { assertEquals, assert } from "jsr:@std/assert";
import { resolveGeoContextV3 } from "../context/resolveGeoContextV3.ts";
import { normalizeEnvironmentV3 } from "../normalizeEnvironmentV3.ts";
import {
  runScoreEngineV3,
  runWindowEngineV3,
  buildNarrationPayloadV3,
  shapeV3ToEngineOutput,
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
// Narration payload — freshwater lake
// ---------------------------------------------------------------------------

Deno.test("phase5: narration payload built for freshwater_lake", () => {
  const raw = makeRawEnv();
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
  const payload = buildNarrationPayloadV3(env, ctx, scoreResult, windowResult, "America/Chicago");

  assertEquals(payload.environmentMode, "freshwater_lake");
  assertEquals(typeof payload.score, "number");
  assert(["Poor", "Fair", "Good", "Great"].includes(payload.scoreBand));
  assert(Array.isArray(payload.topDrivers));
  assert(Array.isArray(payload.topSuppressors));
  assert(Array.isArray(payload.bestWindows));
  assert(Array.isArray(payload.fairWindows));
  assert(Array.isArray(payload.poorWindows));
  assert(Array.isArray(payload.keyReasonsForBest));
  assert(Array.isArray(payload.keyReasonsForPoor));
  assert(typeof payload.claimGuardActive === "boolean");
  assert(Array.isArray(payload.claimGuardInstructions));

  assert(payload.approvedFacts.coastalWaterTempF === null || typeof payload.approvedFacts.coastalWaterTempF === "number");
  assert(payload.approvedFacts.waterTempIsMeasured === false || payload.approvedFacts.coastalWaterTempF != null);
});

// ---------------------------------------------------------------------------
// Narration payload — freshwater river
// ---------------------------------------------------------------------------

Deno.test("phase5: narration payload built for freshwater_river", () => {
  const raw = makeRawEnv();
  const ctx = resolveGeoContextV3({
    latitude: 38.9,
    longitude: -77.0,
    waterType: "freshwater",
    freshwaterSubtype: "river_stream",
    environmentMode: "freshwater_river",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const scoreResult = runScoreEngineV3(env, ctx);
  const windowResult = runWindowEngineV3(env, ctx, scoreResult);
  const payload = buildNarrationPayloadV3(env, ctx, scoreResult, windowResult, "America/New_York");

  assertEquals(payload.environmentMode, "freshwater_river");
  assert(payload.claimGuardInstructions.some((i) => i.toLowerCase().includes("river") || i.toLowerCase().includes("flow")));
});

// ---------------------------------------------------------------------------
// Narration payload — brackish
// ---------------------------------------------------------------------------

Deno.test("phase5: narration payload built for brackish", () => {
  const raw = makeRawEnv({
    tides: {
      high_low: [
        { time: "06:00", type: "H", value: 2.5 },
        { time: "12:00", type: "L", value: 0.5 },
      ],
    },
  });
  const ctx = resolveGeoContextV3({
    latitude: 29.5,
    longitude: -95.0,
    waterType: "brackish",
    environmentMode: "brackish",
  });
  const env = normalizeEnvironmentV3(raw as never, ctx);
  const scoreResult = runScoreEngineV3(env, ctx);
  const windowResult = runWindowEngineV3(env, ctx, scoreResult);
  const payload = buildNarrationPayloadV3(env, ctx, scoreResult, windowResult, "America/Chicago");

  assertEquals(payload.environmentMode, "brackish");
  assert(typeof payload.tideOverlapMajorFactor === "boolean");
});

// ---------------------------------------------------------------------------
// Narration payload — saltwater
// ---------------------------------------------------------------------------

Deno.test("phase5: narration payload built for saltwater", () => {
  const raw = makeRawEnv({
    tides: {
      high_low: [
        { time: "06:00", type: "H", value: 2.5 },
        { time: "12:00", type: "L", value: 0.5 },
      ],
    },
    measured_water_temp_f: 72,
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
  const payload = buildNarrationPayloadV3(env, ctx, scoreResult, windowResult, "America/New_York");

  assertEquals(payload.environmentMode, "saltwater");
  assertEquals(payload.approvedFacts.coastalWaterTempF, 72);
  assert(payload.approvedFacts.waterTempIsMeasured === true);
});

// ---------------------------------------------------------------------------
// Claim-guard — no inferred freshwater temp
// ---------------------------------------------------------------------------

Deno.test("phase5: no inferred freshwater temp in narration payload", () => {
  const raw = makeRawEnv();
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
  const payload = buildNarrationPayloadV3(env, ctx, scoreResult, windowResult, "America/Chicago");

  assert(env.water_temperature.freshwaterMeasuredF.value === null);
  assert(payload.approvedFacts.coastalWaterTempF === null);
  assert(payload.claimGuardInstructions.some((i) => i.toLowerCase().includes("freshwater") || i.toLowerCase().includes("water temp")));
});

// ---------------------------------------------------------------------------
// Report adapter — frontend can consume V3 output
// ---------------------------------------------------------------------------

Deno.test("phase5: shapeV3ToEngineOutput produces valid EngineOutput", () => {
  const raw = makeRawEnv();
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
  const payload = buildNarrationPayloadV3(env, ctx, scoreResult, windowResult, "America/Chicago");

  const engineOutput = shapeV3ToEngineOutput(payload, 45, -93.5, "America/Chicago", "freshwater_lake", "lake");

  assert(engineOutput.location?.lat === 45);
  assert(engineOutput.location?.lon === -93.5);
  assert(engineOutput.scoring.adjusted_score === payload.score);
  assert(engineOutput.time_windows.length === payload.bestWindows.length);
  assert(engineOutput.fair_windows.length === payload.fairWindows.length);
  assert(engineOutput.worst_windows.length === payload.poorWindows.length);
  assert(engineOutput.v2_drivers !== undefined);
  assert(engineOutput.v2_suppressors !== undefined);
  assert(engineOutput.v2_score === payload.score);
  assert(engineOutput.v2_confidence !== undefined);
  assert(engineOutput.scoring.water_temp_confidence === null);
});

// ---------------------------------------------------------------------------
// Historical context — framed as context, not measured fact
// ---------------------------------------------------------------------------

Deno.test("phase5: historical context flags are present when applicable", () => {
  const raw = makeRawEnv({ weather: { temperature: 95, wind_speed: 5, cloud_cover: 20, pressure: 1010 } });
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
  const payload = buildNarrationPayloadV3(env, ctx, scoreResult, windowResult, "America/New_York");

  assert(Array.isArray(payload.historicalContextFlags));
  assert(Array.isArray(payload.relativeToNormalNotes));
  if (payload.historicalContextFlags.length > 0) {
    assert(payload.claimGuardInstructions.some((i) => i.toLowerCase().includes("historical") || i.toLowerCase().includes("context")));
  }
});
