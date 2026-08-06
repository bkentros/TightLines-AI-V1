import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  BIG_MANISTEE_CONFIGURATION_DOCUMENT,
  BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
  BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  resolveRunStage,
  scoreFishInRiver,
  scorePush,
  validateRunProfile,
} from "../index.ts";

const run = BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE;

Deno.test("Big Manistee Fall Steelhead is a valid visible 8/10 broad run", () => {
  const result = validateRunProfile(run, BIG_MANISTEE_RIVER_PROFILE);
  assertEquals(result.valid, true);
  assertEquals(result.publicVisible, true);
  assertEquals(run.historicalPresence.maximum, 8);
  assertEquals(run.historicalPresence.distributionScope, "broad");
  assertEquals(
    BIG_MANISTEE_CONFIGURATION_DOCUMENT.runs.map((item) => item.runId),
    [
      "big_manistee_fall_chinook",
      "big_manistee_fall_coho",
      "big_manistee_fall_steelhead",
    ],
  );
});

Deno.test("Big Manistee Steelhead peaks November 15 and retains 70 into winter", () => {
  assertEquals(run.runWindow.peak, "11-15");
  assertEquals(run.handoff?.start, "12-23");
  const expected = new Map([
    ["2026-09-15", 4],
    ["2026-09-20", 8],
    ["2026-10-01", 16],
    ["2026-10-10", 28],
    ["2026-10-15", 36],
    ["2026-10-25", 48],
    ["2026-11-01", 60],
    ["2026-11-10", 72],
    ["2026-11-15", 80],
    ["2026-12-04", 80],
    ["2026-12-10", 77],
    ["2026-12-19", 72],
    ["2026-12-22", 70],
    ["2026-12-23", 70],
  ]);
  for (const [localDate, score] of expected) {
    assertEquals(scoreFishInRiver(run, localDate).score, score, localDate);
  }
  assertEquals(resolveRunStage(run, "2026-12-23").label, "Winter holding");
});

Deno.test("Big Manistee Steelhead shares hydraulics and uses cold-holding biology", () => {
  assertEquals(
    run.push.hydraulic,
    BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.hydraulic,
  );
  assertEquals(
    run.fishabilityBands.version,
    BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands.version,
  );
  assertEquals(run.push.temperature.preferredMinF, 46);
  assertEquals(run.push.temperature.supportiveMaxF, 52);
  assertEquals(run.push.temperature.coldHoldingF, 39);
  assertEquals(run.conditionsSuggest.gaugeWeight, 0.4);
  assertEquals(run.conditionsSuggest.waterTemperatureWeight, 0.6);

  const cold = scorePush({
    movementEngineId: run.movementEngineId,
    rules: run.push,
    gaugeFreshness: "fresh",
    flowSignal: "meaningful_rise",
    currentHydraulicValue: 1650,
    hydraulicAbsoluteChange24h: 100,
    hydraulicPercentChange24h: 7,
    rainSignal: "meaningful_rain",
    temperatureSignal: "cooling",
    temperatureSourceType: "same_gauge",
    waterTempF: 38,
    trackingState: "active",
    trackingStartDate: "2026-09-20",
    trackingEndDate: "2026-12-22",
    localDate: "2026-12-10",
  });
  assert(typeof cold.score === "number");
  assert(cold.score <= 49);
  assertEquals(cold.components?.temperatureState, "cold_holding");
  assertEquals(cold.components?.rainRole, "absorbed_by_gauge");
});

Deno.test("Big Manistee Steelhead copy separates Skamania and uses named reaches", () => {
  const staging = resolveRunStage(run, "2026-09-01");
  assertMatch(staging.headline, /summer-run/i);
  assertMatch(staging.whereToStart ?? "", /lower migratory river/i);
  assertMatch(staging.whereToStart ?? "", /Skamania/i);

  const beginning = resolveRunStage(run, "2026-09-15");
  assertMatch(beginning.whereToStart ?? "", /High Bridge-Bear Creek/i);
  const peak = resolveRunStage(run, "2026-11-15");
  assertMatch(peak.whereToStart ?? "", /Tippy-to-High Bridge/i);
  assertMatch(peak.whereToStart ?? "", /toward M-55/i);
  const winter = resolveRunStage(run, "2026-12-23");
  assertMatch(winter.detail, /have not left the river/i);

  for (
    const date of [
      "2026-08-15",
      "2026-09-01",
      "2026-09-15",
      "2026-09-20",
      "2026-10-15",
      "2026-11-01",
      "2026-11-15",
      "2026-12-05",
      "2026-12-20",
      "2026-12-23",
    ]
  ) {
    const copy = JSON.stringify(resolveRunStage(run, date));
    assertEquals(/Scottville|Walhalla|Pere Marquette/i.test(copy), false);
    assertEquals(/\bupper river\b/i.test(copy), false);
  }
});
