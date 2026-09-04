import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  BIG_MANISTEE_CONFIGURATION_DOCUMENT,
  BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
  BIG_MANISTEE_FALL_COHO_RUN_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  resolveRunStage,
  scoreActivity,
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
      "big_manistee_fall_brown_trout",
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

  assertEquals(run.push.model, "direct_event_state");
  assertEquals(run.push.directEvent?.temperature, "trigger_and_constraint");
  assertEquals(run.push.directEvent?.persistenceHours, 48);
});

Deno.test("Big Manistee Coho Activity is river-scoped and continuously tapers", () => {
  assertEquals(run.primitiveCapabilities.activity?.status, "available");
  assertEquals(run.activity?.version, "big-manistee-fall-coho-activity-v2");
  assertEquals(run.activity?.weights, {
    light: 0.5,
    waterTemperature: 0.25,
    riverBehavior: 0.15,
    weather: 0.1,
  });
  assertEquals(run.activity?.temperature, {
    coldF: 40,
    preferredMinF: 45,
    preferredMaxF: 60,
    warmF: 64,
    barrierF: 68,
  });
  assertEquals(run.activity?.caps.lifecycleRamp, {
    peakEnd: "10-31",
    taperingEnd: "11-10",
    endingEnd: "11-30",
  });

  const scoreFor = (
    date: string,
    runStage: "peak" | "tapering" | "ending" | "post_run",
  ) =>
    scoreActivity({
      rules: run.activity!,
      requestDate: date,
      targetDate: date,
      runStage,
      staging: false,
      waterTempF: 54,
      temperatureTrend: "neutral",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      currentHydraulicValue: 1650,
      fishabilityBands: run.fishabilityBands,
      flowSignal: "stable",
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
        cloud_cover_pct: 85,
        shortwave_w_m2: hour >= 8 && hour <= 18 ? 140 : 20,
        clear_sky_shortwave_w_m2: hour >= 8 && hour <= 18 ? 620 : 100,
        precipitation_in: 0,
      })),
    });
  const reads = [
    scoreFor("2026-10-31", "peak"),
    scoreFor("2026-11-01", "tapering"),
    scoreFor("2026-11-10", "tapering"),
    scoreFor("2026-11-11", "ending"),
    scoreFor("2026-11-30", "ending"),
    scoreFor("2026-12-01", "post_run"),
  ];
  const scores = reads.map((read) => read.blocks[0].score);
  assert(scores[0] - scores[1] <= 2);
  assertEquals(scores[0] - scores[2], 15);
  assert(scores[2] - scores[3] <= 3);
  assert(scores[4] - scores[5] <= 1);
  assertMatch(reads[1].detail, /Coho/i);
  assertMatch(reads[1].detail, /Wellston\/Tippy tailwater/i);
  assertEquals(/Chinook|Pere Marquette/i.test(reads[1].detail), false);
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
    new Set(states.map((state) =>
      [
        state.headline,
        state.whereToStart,
        state.detail,
        state.tip,
      ].join("|")
    )).size,
    dates.length,
  );
  assertMatch(
    resolveRunStage(run, "2026-09-10").whereToStart ?? "",
    /Lower river \(M-55–Bear Creek\)/i,
  );
  assertMatch(
    resolveRunStage(run, "2026-09-20").whereToStart ?? "",
    /Middle river \(Bear Creek–High Bridge\)/i,
  );
  assertMatch(
    resolveRunStage(run, "2026-10-20").whereToStart ?? "",
    /Upper river \(High Bridge–Tippy Dam\)/i,
  );
  for (const state of states) {
    const copy = JSON.stringify(state);
    assertEquals(/Scottville|Walhalla|Pere Marquette/i.test(copy), false);
    assertEquals(
      /Tippy tailwater|toward M-55|middle corridor/i.test(copy),
      false,
    );
  }
});
