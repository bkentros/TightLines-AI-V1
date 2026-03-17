// =============================================================================
// ENGINE V3 — Phase 2 Tests
// State resolution, region mapping, baseline lookups, data coverage.
// Run: deno test supabase/functions/_shared/engineV3/__tests__/phase2.test.ts
// =============================================================================

import { assertEquals, assert } from "jsr:@std/assert";
import { resolveStateFromCoords } from "../geo/stateBounds.ts";
import { getRegionFromState } from "../geo/stateToRegionMap.ts";
import { resolveGeoContextV3 } from "../context/resolveGeoContextV3.ts";
import {
  getAirTempBaseline,
  getPrecipBaseline,
  getFreshwaterTempBaseline,
  getCoastalWaterTempBaseline,
  COASTAL_STATES,
} from "../baselines/index.ts";
import { normalizeEnvironmentV3 } from "../normalizeEnvironmentV3.ts";

// ---------------------------------------------------------------------------
// State resolution
// ---------------------------------------------------------------------------

Deno.test("state resolution: Florida coords resolve to FL", () => {
  const state = resolveStateFromCoords(27.5, -82.5);
  assertEquals(state, "FL");
});

Deno.test("state resolution: Minnesota coords resolve to MN", () => {
  const state = resolveStateFromCoords(45.0, -93.5);
  assertEquals(state, "MN");
});

Deno.test("state resolution: California coords resolve to CA", () => {
  const state = resolveStateFromCoords(37.0, -122.0);
  assertEquals(state, "CA");
});

Deno.test("state resolution: Texas coords resolve to TX", () => {
  const state = resolveStateFromCoords(31.0, -97.0);
  assertEquals(state, "TX");
});

Deno.test("state resolution: DC coords resolve to DC (not MD)", () => {
  const state = resolveStateFromCoords(38.9, -77.0);
  assertEquals(state, "DC");
});

Deno.test("state resolution: out-of-bounds returns null", () => {
  const state = resolveStateFromCoords(0, 0);
  assertEquals(state, null);
});

// ---------------------------------------------------------------------------
// Region mapping
// ---------------------------------------------------------------------------

Deno.test("region mapping: FL -> gulf_florida", () => {
  assertEquals(getRegionFromState("FL"), "gulf_florida");
});

Deno.test("region mapping: MN -> great_lakes_upper_midwest", () => {
  assertEquals(getRegionFromState("MN"), "great_lakes_upper_midwest");
});

Deno.test("region mapping: CA -> west_southwest", () => {
  assertEquals(getRegionFromState("CA"), "west_southwest");
});

Deno.test("region mapping: NY -> northeast", () => {
  assertEquals(getRegionFromState("NY"), "northeast");
});

Deno.test("region mapping: invalid state returns null", () => {
  assertEquals(getRegionFromState("XX"), null);
});

// ---------------------------------------------------------------------------
// Geo context resolution
// ---------------------------------------------------------------------------

Deno.test("geo context: state and region resolved for FL freshwater lake", () => {
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  assertEquals(ctx.state, "FL");
  assertEquals(ctx.region, "gulf_florida");
  assertEquals(ctx.month, new Date().getMonth() + 1);
  assertEquals(ctx.waterType, "freshwater");
  assertEquals(ctx.freshwaterSubtype, "lake");
  assertEquals(ctx.environmentMode, "freshwater_lake");
});

Deno.test("geo context: region from state when state resolved", () => {
  const ctx = resolveGeoContextV3({
    latitude: 42.36,
    longitude: -71.06,
    waterType: "saltwater",
    environmentMode: "saltwater",
  });
  assertEquals(ctx.state, "MA");
  assertEquals(ctx.region, "northeast");
});

// ---------------------------------------------------------------------------
// Baseline lookups
// ---------------------------------------------------------------------------

Deno.test("air temp baseline: FL January", () => {
  const b = getAirTempBaseline("FL", 1);
  assert(b !== null);
  assertEquals(b!.state, "FL");
  assertEquals(b!.month, 1);
  assertEquals(b!.avgTempNormalF >= 55 && b!.avgTempNormalF <= 70, true);
  assertEquals(b!.rangeLowF < b!.rangeHighF, true);
});

Deno.test("air temp baseline: MN July", () => {
  const b = getAirTempBaseline("MN", 7);
  assert(b !== null);
  assertEquals(b!.state, "MN");
  assertEquals(b!.month, 7);
  assertEquals(b!.avgTempNormalF >= 65 && b!.avgTempNormalF <= 80, true);
});

Deno.test("air temp baseline: invalid state returns null", () => {
  assertEquals(getAirTempBaseline("XX", 1), null);
});

Deno.test("air temp baseline: invalid month returns null", () => {
  assertEquals(getAirTempBaseline("FL", 0), null);
  assertEquals(getAirTempBaseline("FL", 13), null);
});

Deno.test("precip baseline: FL July", () => {
  const b = getPrecipBaseline("FL", 7);
  assert(b !== null);
  assertEquals(b!.state, "FL");
  assertEquals(b!.month, 7);
  assertEquals(b!.precipTotalNormalInches > 0, true);
});

Deno.test("freshwater lake baseline: FL July", () => {
  const b = getFreshwaterTempBaseline("FL", 7, "lake");
  assert(b !== null);
  assertEquals(b!.subtype, "lake");
  assertEquals(b!.tempRangeLowF < b!.tempRangeHighF, true);
  assertEquals(b!.tempRangeLowF >= 75 && b!.tempRangeHighF <= 90, true);
});

Deno.test("freshwater river baseline: MN January", () => {
  const b = getFreshwaterTempBaseline("MN", 1, "river_stream");
  assert(b !== null);
  assertEquals(b!.subtype, "river_stream");
  assertEquals(b!.tempRangeLowF <= 40, true);
});

Deno.test("freshwater reservoir maps to lake baseline", () => {
  const b = getFreshwaterTempBaseline("TX", 6, "reservoir");
  assert(b !== null);
  assertEquals(b!.subtype, "lake");
});

Deno.test("coastal baseline: FL July", () => {
  const b = getCoastalWaterTempBaseline("FL", 7);
  assert(b !== null);
  assertEquals(b!.stateOrZone, "FL");
  assertEquals(b!.tempRangeLowF >= 80 && b!.tempRangeHighF <= 92, true);
});

Deno.test("coastal baseline: inland state returns null", () => {
  assertEquals(getCoastalWaterTempBaseline("MN", 7), null);
  assertEquals(getCoastalWaterTempBaseline("NE", 7), null);
});

Deno.test("coastal states set includes FL and excludes MN", () => {
  assertEquals(COASTAL_STATES.has("FL"), true);
  assertEquals(COASTAL_STATES.has("MN"), false);
});

// ---------------------------------------------------------------------------
// Normalization and data coverage
// ---------------------------------------------------------------------------

Deno.test("normalizeEnvironmentV3: historical_context_inputs populated for FL freshwater", () => {
  const raw = {
    lat: 27.5,
    lon: -82.5,
    timezone: "America/New_York",
    weather: { temperature: 78 },
    coastal: false,
  };
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const env = normalizeEnvironmentV3(raw, ctx);
  assertEquals(env.historical_context_inputs.stateResolved, true);
  assert(env.historical_context_inputs.airTempBaseline !== null);
  assertEquals(env.historical_context_inputs.airTempBaseline!.quality, "high");
  assert(env.historical_context_inputs.precipBaseline !== null);
  assertEquals(env.historical_context_inputs.precipBaseline!.quality, "high");
  assert(env.historical_context_inputs.freshwaterTempBaseline !== null);
  assertEquals(env.historical_context_inputs.freshwaterTempBaseline!.quality, "approximation");
  assert(env.historical_context_inputs.freshwaterTempBaseline!.methodologyNote.length > 0);
  assertEquals(env.historical_context_inputs.coastalWaterTempBaseline, null);
});

Deno.test("normalizeEnvironmentV3: coastal baseline for FL saltwater", () => {
  const raw = {
    lat: 27.5,
    lon: -82.5,
    timezone: "America/New_York",
    weather: { temperature: 82 },
    coastal: true,
  };
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "saltwater",
    environmentMode: "saltwater",
  });
  const env = normalizeEnvironmentV3(raw, ctx);
  assert(env.historical_context_inputs.coastalWaterTempBaseline !== null);
  assertEquals(env.historical_context_inputs.coastalWaterTempBaseline!.quality, "high");
});

Deno.test("data coverage: baseline availability flags set", () => {
  const raw = {
    lat: 27.5,
    lon: -82.5,
    timezone: "America/New_York",
    weather: { temperature: 78 },
    coastal: false,
  };
  const ctx = resolveGeoContextV3({
    latitude: 27.5,
    longitude: -82.5,
    waterType: "freshwater",
    freshwaterSubtype: "lake",
    environmentMode: "freshwater_lake",
  });
  const env = normalizeEnvironmentV3(raw, ctx);
  assertEquals(env.data_coverage.stateResolved, true);
  assertEquals(env.data_coverage.airTempBaselineAvailable, true);
  assertEquals(env.data_coverage.precipBaselineAvailable, true);
  assertEquals(env.data_coverage.freshwaterTempBaselineAvailable, true);
  assertEquals(env.data_coverage.historicalBaselineAvailable, true);
});
