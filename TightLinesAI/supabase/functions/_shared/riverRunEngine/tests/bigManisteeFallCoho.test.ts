import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  BIG_MANISTEE_CONFIGURATION_DOCUMENT,
  BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
  BIG_MANISTEE_FALL_COHO_RUN_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  resolveRunStage,
  scoreFishInRiver,
  scorePush,
  validateRunProfile,
} from "../index.ts";

const run = BIG_MANISTEE_FALL_COHO_RUN_PROFILE;

Deno.test("Big Manistee Fall Coho validates as a visible complete profile", () => {
  const result = validateRunProfile(run, BIG_MANISTEE_RIVER_PROFILE);
  assertEquals(result.valid, true);
  assertEquals(result.publicVisible, true);
  assertEquals(
    BIG_MANISTEE_CONFIGURATION_DOCUMENT.runs.map((item) => item.runId),
    [
      "big_manistee_fall_chinook",
      "big_manistee_fall_coho",
      "big_manistee_fall_steelhead",
    ],
  );
  assertEquals(run.historicalPresence.maximum, 5);
  assertEquals(run.historicalPresence.distributionScope, "sectional");
});

Deno.test("Big Manistee Coho peaks October 20 and interpolates every day", () => {
  assertEquals(run.runWindow.peak, "10-20");
  assertEquals(scoreFishInRiver(run, "2026-09-10").score, 5);
  assertEquals(scoreFishInRiver(run, "2026-09-20").score, 10);
  assertEquals(scoreFishInRiver(run, "2026-10-15").score, 45);
  assertEquals(scoreFishInRiver(run, "2026-10-20").score, 50);
  assertEquals(scoreFishInRiver(run, "2026-10-31").score, 45);
  assertEquals(scoreFishInRiver(run, "2026-12-10").score, 0);
  const daily = [16, 17, 18, 19, 20].map((day) =>
    scoreFishInRiver(run, `2026-10-${day}`).score
  );
  assertEquals(daily, [46, 47, 48, 49, 50]);
});

Deno.test("Big Manistee Coho shares river hydraulics but retains Coho biology", () => {
  assertEquals(
    run.fishabilityBands.version,
    BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands.version,
  );
  assertEquals(
    run.push.hydraulic,
    BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.hydraulic,
  );
  assertEquals(run.push.temperature.supportiveMinF, 50);
  assertEquals(run.push.temperature.supportiveMaxF, 62);
  assertEquals(run.push.temperature.migrationBarrierF, 70);
  assertEquals(
    run.conditionsSuggest.baselineVersion,
    "big-manistee-fall-coho-conditions-v1",
  );

  const push = scorePush({
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
    waterTempF: 60,
    trackingState: "active",
    trackingStartDate: "2026-09-10",
    trackingEndDate: "2026-12-10",
    localDate: "2026-10-20",
  });
  assert(push.score !== null);
  assertEquals(push.components?.rainRole, "absorbed_by_gauge");
  assertEquals(push.components?.temperatureState, "supportive");
});

Deno.test("Big Manistee Coho copy gives novice-safe named migratory reaches", () => {
  const dates = [
    "2026-09-01",
    "2026-09-10",
    "2026-09-20",
    "2026-10-01",
    "2026-10-15",
    "2026-10-20",
    "2026-10-27",
    "2026-11-01",
    "2026-11-07",
    "2026-11-11",
    "2026-11-20",
    "2026-12-01",
  ];
  const states = dates.map((date) => resolveRunStage(run, date));
  assertEquals(
    new Set(states.map((state) => [
      state.headline,
      state.whereToStart,
      state.detail,
      state.tip,
    ].join("|"))).size,
    dates.length,
  );
  assertMatch(resolveRunStage(run, "2026-09-10").whereToStart ?? "", /Tippy-tailwater/i);
  assertMatch(resolveRunStage(run, "2026-09-20").whereToStart ?? "", /middle corridor/i);
  assertMatch(resolveRunStage(run, "2026-10-20").whereToStart ?? "", /toward M-55/i);
  for (const state of states) {
    const copy = JSON.stringify(state);
    assertEquals(/Scottville|Walhalla|Pere Marquette/i.test(copy), false);
    assertEquals(/\bupper river\b/i.test(copy), false);
  }
});
