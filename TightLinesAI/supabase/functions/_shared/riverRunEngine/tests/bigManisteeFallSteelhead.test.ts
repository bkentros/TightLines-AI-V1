import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  BIG_MANISTEE_CONFIGURATION_DOCUMENT,
  BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
  BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  resolveRunStage,
  scoreActivity,
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

Deno.test("Big Manistee Steelhead Activity is river-scoped and has no salmon taper", () => {
  assertEquals(run.primitiveCapabilities.activity?.status, "available");
  assertEquals(
    run.activity?.version,
    "big-manistee-fall-steelhead-activity-v1",
  );
  assertEquals(run.activity?.profile, "steelhead_feeding");
  assertEquals(run.activity?.weights, {
    light: 0.25,
    waterTemperature: 0.5,
    riverBehavior: 0.15,
    weather: 0.1,
  });
  assertEquals(run.activity?.temperature, {
    coldF: 39,
    preferredMinF: 44,
    preferredMaxF: 56,
    warmF: 64,
    barrierF: 68,
  });
  assertEquals(run.activity?.caps.lateRun, 100);
  assertEquals(run.activity?.caps.ending, 100);
  assertEquals(run.activity?.caps.taperingPenalty, undefined);
  assertEquals(run.activity?.caps.lifecycleRamp, undefined);

  const scoreFor = (runStage: "peak" | "tapering" | "ending" | "post_run") =>
    scoreActivity({
      rules: run.activity!,
      requestDate: "2026-12-20",
      targetDate: "2026-12-20",
      runStage,
      staging: false,
      waterTempF: 50,
      temperatureTrend: "neutral",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      currentHydraulicValue: 1650,
      fishabilityBands: run.fishabilityBands,
      flowSignal: "stable",
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `2026-12-20T${String(hour).padStart(2, "0")}:00`,
        cloud_cover_pct: 80,
        shortwave_w_m2: hour >= 8 && hour < 17 ? 120 : 0,
        clear_sky_shortwave_w_m2: hour >= 8 && hour < 17 ? 500 : 0,
        precipitation_in: 0,
      })),
    });
  const peak = scoreFor("peak");
  for (const stage of ["tapering", "ending", "post_run"] as const) {
    const result = scoreFor(stage);
    assertEquals(result.score, peak.score, stage);
    assertEquals(
      result.blocks.map((block) => block.score),
      peak.blocks.map((block) => block.score),
      stage,
    );
    assertEquals(
      result.reasonCodes.includes("activity_late_biology_cap"),
      false,
    );
    assertEquals(
      /spent|dying|deteriorat|mortality/i.test(JSON.stringify(result)),
      false,
    );
    assertMatch(result.detail, /Wellston\/Tippy tailwater/i);
  }
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
