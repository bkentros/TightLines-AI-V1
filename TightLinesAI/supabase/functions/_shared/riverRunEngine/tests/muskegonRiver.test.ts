import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  listVisibleRiverRuns,
  MUSKEGON_CONFIGURATION_DOCUMENT,
  MUSKEGON_FALL_CHINOOK_RUN_PROFILE as chinook,
  MUSKEGON_FALL_COHO_RUN_PROFILE as coho,
  MUSKEGON_FALL_STEELHEAD_RUN_PROFILE as steelhead,
  MUSKEGON_RIVER_PROFILE as river,
  resolveFlowBand,
  resolveRunStage,
  scoreFishInRiver,
  scorePush,
  validateConfigurationRevision,
  validateRunProfile,
} from "../index.ts";

Deno.test("Muskegon configuration is valid and all three researched runs are visible", () => {
  assertEquals(
    validateConfigurationRevision({
      configKey: "muskegon",
      revision: 1,
      status: "draft",
      document: MUSKEGON_CONFIGURATION_DOCUMENT,
      evidenceNotes: "Muskegon research and owner-audit build.",
    }),
    [],
  );
  for (const run of [chinook, coho, steelhead]) {
    assertEquals(validateRunProfile(run, river).publicVisible, true);
  }
  assertEquals(
    listVisibleRiverRuns([river], [chinook, coho, steelhead])[0].rivers[0].runs
      .length,
    3,
  );
  assertEquals([
    chinook.historicalPresence.maximum,
    coho.historicalPresence.maximum,
    steelhead.historicalPresence.maximum,
  ], [9, 3, 9]);
});

Deno.test("Croton is a hard boundary and copy never leaks another river geography", () => {
  for (const run of [chinook, coho, steelhead]) {
    for (
      const date of [
        "2026-08-10",
        "2026-09-15",
        "2026-10-01",
        "2026-11-15",
        "2026-12-23",
      ]
    ) {
      const copy = JSON.stringify(resolveRunStage(run, date));
      assertEquals(
        /Tippy|Wellston|High Bridge|Bear Creek|M-55|Scottville|Walhalla|Pere Marquette|Homestead/i
          .test(copy),
        false,
        `${run.runId} ${date}`,
      );
      assertEquals(/above Croton/i.test(copy), false, `${run.runId} ${date}`);
    }
  }
  assertMatch(river.foundation!.upstreamTerminus, /hard upstream barrier/i);
  assertMatch(
    resolveRunStage(chinook, "2026-08-10").whereToStart ?? "",
    /Muskegon Lake/i,
  );
  assertMatch(
    resolveRunStage(chinook, "2026-09-15").whereToStart ?? "",
    /Croton-to-Newaygo/i,
  );
});

Deno.test("Muskegon Fish In River interpolates daily and hits exact peaks and handoff", () => {
  assert(
    scoreFishInRiver(chinook, "2026-09-10").score !==
      scoreFishInRiver(chinook, "2026-09-11").score,
  );
  assertEquals(scoreFishInRiver(chinook, "2026-10-01").score, 90);
  assertEquals(scoreFishInRiver(coho, "2026-10-25").score, 30);
  assertEquals(scoreFishInRiver(steelhead, "2026-11-15").score, 90);
  assertEquals(scoreFishInRiver(steelhead, "2026-12-22").score, 80);
  assertEquals(scoreFishInRiver(steelhead, "2026-12-23").score, 80);
  assertEquals(
    resolveRunStage(steelhead, "2026-12-23").label,
    "Winter holding",
  );
});

Deno.test("Muskegon flow bands honor every Croton boundary", () => {
  const expected: Array<[number, string]> = [
    [899, "very_low"],
    [900, "low"],
    [1199, "low"],
    [1200, "ideal"],
    [2000, "ideal"],
    [2001, "high_fishable"],
    [3000, "high_fishable"],
    [3001, "very_high"],
    [4999, "very_high"],
    [5000, "blown_out"],
  ];
  for (const [value, band] of expected) {
    assertEquals(
      resolveFlowBand({
        metric: "flow_cfs",
        value,
        fishabilityBands: chinook.fishabilityBands,
      })?.band,
      band,
      String(value),
    );
  }
});

Deno.test("Muskegon Push requires gauge response, fails closed, and keeps Steelhead cold holding", () => {
  const base = {
    movementEngineId: chinook.movementEngineId,
    rules: chinook.push,
    gaugeFreshness: "fresh" as const,
    currentHydraulicValue: 1500,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    rainSignal: "heavy_rain" as const,
    temperatureSignal: "cooling" as const,
    temperatureSourceType: "same_gauge" as const,
    waterTempF: 55,
    trackingState: "active" as const,
    trackingStartDate: "2026-08-20",
    trackingEndDate: "2026-11-05",
    localDate: "2026-09-20",
  };
  const rainOnly = scorePush({ ...base, flowSignal: "stable" });
  assert(!["Strong", "Very strong"].includes(rainOnly.label));
  assertEquals(
    scorePush({ ...base, flowSignal: "unknown", gaugeFreshness: "missing" })
      .label,
    "Unavailable",
  );
  assertEquals(
    scorePush({ ...base, flowSignal: "meaningful_rise", waterTempF: null })
      .label,
    "Unavailable",
  );
  const cold = scorePush({
    ...base,
    movementEngineId: steelhead.movementEngineId,
    rules: steelhead.push,
    flowSignal: "meaningful_rise",
    hydraulicAbsoluteChange24h: 160,
    hydraulicPercentChange24h: 11,
    waterTempF: 38,
  });
  assert((cold.score ?? 100) <= 49);
  assertEquals(cold.components?.temperatureState, "cold_holding");
});
