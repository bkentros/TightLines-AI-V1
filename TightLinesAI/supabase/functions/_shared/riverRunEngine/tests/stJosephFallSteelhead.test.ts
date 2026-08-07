import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  buildConditionRefresh,
  buildDailySnapshot,
  listVisibleRiverRuns,
  resolveFlowBand,
  resolveRunStage,
  scoreFishInRiver,
  scorePush,
  ST_JOSEPH_CONFIGURATION_DOCUMENT,
  ST_JOSEPH_FALL_STEELHEAD_RUN_PROFILE as run,
  ST_JOSEPH_RIVER_PROFILE as river,
  validateConfigurationRevision,
  validateRunProfile,
} from "../index.ts";

Deno.test("St. Joseph Fall Steelhead is valid, owner-gated, and excludes Activity", () => {
  assertEquals(validateRunProfile(run, river).valid, true);
  assertEquals(validateRunProfile(run, river).publicVisible, false);
  assertEquals(
    validateConfigurationRevision({
      configKey: "st_joseph",
      revision: 1,
      status: "draft",
      document: ST_JOSEPH_CONFIGURATION_DOCUMENT,
      evidenceNotes: "St. Joseph Steelhead research build.",
    }),
    [],
  );
  assertEquals(run.primitiveCapabilities.migrationTiming.status, "available");
  assertEquals(run.primitiveCapabilities.push.status, "available");
  assertEquals(run.primitiveCapabilities.fishability.status, "available");
  assertEquals(run.primitiveCapabilities.activity, {
    status: "unavailable",
    reason: "no_accepted_activity_calibration",
    notes:
      "Activity is intentionally withheld until a dedicated Niles-reach Steelhead responsiveness replay and copy audit are accepted.",
  });
  assertEquals(run.activity, undefined);
  assertEquals(listVisibleRiverRuns([river], [run]), []);
});

Deno.test("St. Joseph Steelhead separates Skamania presence from winter-run fall entry", () => {
  const early = resolveRunStage(run, "2026-08-10");
  assertMatch(early.headline, /Skamania/i);
  assertMatch(early.detail, /Little Manistee winter-run/i);
  assertMatch(early.whereToStart ?? "", /harbor/i);

  const building = resolveRunStage(run, "2026-10-15");
  assertMatch(building.whereToStart ?? "", /Niles/i);
  const peak = resolveRunStage(run, "2026-11-15");
  assertMatch(peak.whereToStart ?? "", /Berrien Springs/i);
  assertMatch(peak.whereToStart ?? "", /South Bend-Mishawaka/i);
  assertMatch(peak.whereToStart ?? "", /Niles gauge only for the Niles reach/i);

  const winter = resolveRunStage(run, "2026-12-23");
  assertEquals(winter.label, "Winter holding");
  assertMatch(winter.detail, /have not left/i);
  assertMatch(winter.detail, /Activity remains unavailable/i);
});

Deno.test("St. Joseph Steelhead presence is 9/10 and hands 81 into winter", () => {
  assertEquals(run.historicalPresence.maximum, 9);
  assertEquals(run.historicalPresence.distributionScope, "broad");
  assertEquals(scoreFishInRiver(run, "2026-09-24").score, 0);
  assertEquals(scoreFishInRiver(run, "2026-09-25").score, 7);
  assertEquals(scoreFishInRiver(run, "2026-11-15").score, 90);
  assertEquals(scoreFishInRiver(run, "2026-12-22").score, 81);
  assertEquals(scoreFishInRiver(run, "2026-12-23").score, 81);
  assertEquals(scoreFishInRiver(run, "2026-12-23").label, "Winter holding");
});

Deno.test("St. Joseph Niles Fishability honors every calibrated boundary", () => {
  const expected: Array<[number, string]> = [
    [1299, "very_low"],
    [1300, "low"],
    [1799, "low"],
    [1800, "ideal"],
    [3200, "ideal"],
    [3201, "high_fishable"],
    [5100, "high_fishable"],
    [5101, "very_high"],
    [6999, "very_high"],
    [7000, "blown_out"],
  ];
  for (const [value, band] of expected) {
    assertEquals(
      resolveFlowBand({
        metric: "flow_cfs",
        value,
        fishabilityBands: run.fishabilityBands,
      })?.band,
      band,
      String(value),
    );
  }
  assertMatch(run.fishabilityBands.evidenceNotes, /p95 5,090/i);
  assertMatch(run.fishabilityBands.evidenceNotes, /Niles reach only/i);
});

Deno.test("St. Joseph Push requires measured Niles response and retains cold fish", () => {
  const base = {
    movementEngineId: run.movementEngineId,
    rules: run.push,
    gaugeFreshness: "fresh" as const,
    currentHydraulicValue: 2400,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    rainSignal: "heavy_rain" as const,
    temperatureSignal: "cooling" as const,
    temperatureSourceType: "same_gauge" as const,
    waterTempF: 49,
    trackingState: "active" as const,
    trackingStartDate: "2026-08-15",
    trackingEndDate: "2026-12-22",
    localDate: "2026-11-01",
  };
  const rainOnly = scorePush({ ...base, flowSignal: "stable" as const });
  assert(!["Strong", "Very strong"].includes(rainOnly.label));

  const meaningful = scorePush({
    ...base,
    flowSignal: "meaningful_rise" as const,
    hydraulicAbsoluteChange24h: 240,
    hydraulicPercentChange24h: 11,
  });
  assert(typeof meaningful.score === "number");
  assertEquals(meaningful.components?.rainRole, "absorbed_by_gauge");

  const cold = scorePush({
    ...base,
    flowSignal: "sharp_rise" as const,
    hydraulicAbsoluteChange24h: 450,
    hydraulicPercentChange24h: 19,
    waterTempF: 38,
  });
  assert((cold.score ?? 100) <= 49);
  assertEquals(cold.components?.temperatureState, "cold_holding");
});

Deno.test("St. Joseph snapshots expose five primitives and keep Activity unavailable", () => {
  const daily = buildDailySnapshot({
    river,
    run,
    localDate: "2026-11-15",
    conditionsEvidenceByDate: {},
    conditionsBaselines: [],
    engineVersion: "test",
    configVersion: "test",
  });
  const condition = buildConditionRefresh({
    dailySnapshot: daily,
    localDate: "2026-11-15",
    refreshSlot: "08:00",
    movementEngineId: run.movementEngineId,
    primitiveCapabilities: run.primitiveCapabilities,
    pushRules: run.push,
    fishabilityBands: run.fishabilityBands,
    gaugeFreshness: "missing",
    weatherFreshness: "missing",
    waterTemperatureFreshness: "missing",
    conditionsWaterTemperatureFreshness: "missing",
    currentHydraulicValue: null,
    hydraulicAbsoluteChange24h: null,
    hydraulicPercentChange24h: null,
    rainSignal: "missing_rain_data",
    flowSignal: "unknown",
    temperatureSignal: "neutral_missing",
    temperatureSourceType: "unavailable",
    waterTempF: null,
    sourceMetrics: {},
    engineVersion: "test",
    configVersion: "test",
  });
  assertEquals(daily.runStage.label, "Peak");
  assertEquals(daily.fishInRiver.score, 90);
  assertEquals(daily.conditionsSuggest.label, "Insufficient evidence");
  assertEquals(condition.push.label, "Unavailable");
  assertEquals(condition.fishability.label, "Unavailable");
  assertEquals(condition.activity, null);
});

Deno.test("St. Joseph copy never leaks another river or crosses Twin Branch", () => {
  for (
    const date of [
      "2026-08-10",
      "2026-09-25",
      "2026-10-15",
      "2026-11-01",
      "2026-11-15",
      "2026-12-10",
      "2026-12-23",
    ]
  ) {
    const copy = JSON.stringify(resolveRunStage(run, date));
    assertEquals(
      /Tippy|Wellston|Croton|Newaygo|Scottville|Walhalla|Pere Marquette|Homestead/i
        .test(copy),
      false,
      date,
    );
    assertEquals(/above Twin Branch/i.test(copy), false, date);
  }
});
