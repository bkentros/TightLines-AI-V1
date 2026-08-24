import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  addDays,
  BETSIE_CONFIGURATION_DOCUMENT,
  BETSIE_FALL_STEELHEAD_RUN_PROFILE,
  BETSIE_RIVER_PROFILE,
  buildConditionRefresh,
  buildDailySnapshot,
  listVisibleRiverRuns,
  PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
  resolveActiveRunWindow,
  resolveRunStage,
  scoreActivity,
  scoreFishInRiver,
  validateRunProfile,
} from "../index.ts";

const run = BETSIE_FALL_STEELHEAD_RUN_PROFILE;

Deno.test("Betsie Fall Steelhead is valid, moderate, broad, weather-only, and public", () => {
  const result = validateRunProfile(run, BETSIE_RIVER_PROFILE);
  assertEquals(result.valid, true);
  assertEquals(result.publicVisible, true);
  assertEquals(run.historicalPresence.maximum, 7);
  assertEquals(run.historicalPresence.distributionScope, "broad");
  assertEquals(run.runType, "fall_entry");
  assertEquals(run.movementEngineId, "fall_entry_cooling");
  assertEquals("push" in run, false);
  assertEquals("fishabilityBands" in run, false);
  assertEquals("conditionsSuggest" in run, false);
  assertEquals(run.primitiveCapabilities.activity, { status: "available" });
  assertEquals(run.activity?.dataMode, "weather_only");
});

Deno.test("Betsie Steelhead Activity has no floor, taper, or mortality semantics", () => {
  assertEquals(
    run.activity?.version,
    "betsie-fall-steelhead-weather-activity-v1",
  );
  assertEquals(run.activity?.profile, "steelhead_feeding");
  assertEquals(run.activity?.weights, {
    light: 0.7,
    waterTemperature: 0,
    riverBehavior: 0,
    weather: 0.3,
  });
  assertEquals(run.activity?.caps.weatherOnlyMaximum, 95);
  assertEquals(run.activity?.caps.lateRun, 100);
  assertEquals(run.activity?.caps.ending, 100);
  assertEquals(run.activity?.caps.taperingPenalty, undefined);
  assertEquals(run.activity?.caps.lifecycleRamp, undefined);

  const scoreFor = (date: string) => {
    const stage = resolveRunStage(run, date);
    return scoreActivity({
      rules: run.activity!,
      requestDate: date,
      targetDate: date,
      runStage: stage.stage,
      staging: false,
      waterTempF: null,
      temperatureTrend: "neutral_missing",
      gaugeFreshness: "missing",
      weatherFreshness: "fresh",
      flowSignal: "unknown",
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
        cloud_cover_pct: 95,
        shortwave_w_m2: hour >= 7 && hour < 19 ? 70 : 0,
        clear_sky_shortwave_w_m2: hour >= 7 && hour < 19 ? 600 : 0,
        precipitation_in: hour >= 9 && hour < 13 ? 0.005 : 0,
      })),
      copyStrategy: run.runStageCopyStrategy,
    });
  };
  const dates = ["2026-11-29", "2026-11-30", "2026-12-15", "2026-12-17"];
  const results = dates.map(scoreFor);
  assert(results.every((result) => result.score === results[0].score));
  for (const [index, result] of results.entries()) {
    assertEquals(result.confidence, "Limited", dates[index]);
    assertEquals(result.reasonCodes.includes("activity_weather_only"), true);
    assertEquals(
      result.reasonCodes.includes("activity_late_biology_cap"),
      false,
    );
    assertMatch(
      result.headline,
      /weather-only Betsie Steelhead responsiveness/i,
    );
    assertMatch(result.headline, /Limited confidence/i);
    assertMatch(result.detail, /Weather /i);
    assertEquals(
      /Chinook|Coho|spent|dying|deteriorat|mortality/i.test(
        JSON.stringify(result),
      ),
      false,
    );
  }
});

Deno.test("every Betsie Steelhead calendar boundary is exactly five days ahead of PM", () => {
  const betsie = resolveActiveRunWindow(run, "2026-11-10");
  const pm = resolveActiveRunWindow(
    PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
    "2026-11-15",
  );
  for (
    const field of [
      "preRunStartDate",
      "stagingStartDate",
      "startDate",
      "beginningEndDate",
      "buildingEstablishedStartDate",
      "buildingBroadStartDate",
      "peakStartDate",
      "peakDate",
      "peakEndDate",
      "taperingEndDate",
      "endDate",
      "lateEndDate",
      "postRunLateCopyEndDate",
    ] as const
  ) {
    assertEquals(betsie[field], addDays(pm[field]!, -5), field);
  }
  assertEquals(run.handoff, undefined);
});

Deno.test("Betsie Steelhead reaches 70 and ends fall scoring after 61", () => {
  const expected = new Map([
    ["2026-09-14", 0],
    ["2026-09-15", 7],
    ["2026-09-26", 14],
    ["2026-10-05", 25],
    ["2026-10-10", 32],
    ["2026-10-27", 53],
    ["2026-11-10", 70],
    ["2026-11-29", 70],
    ["2026-11-30", 69],
    ["2026-12-14", 63],
    ["2026-12-17", 61],
  ]);
  for (const [localDate, score] of expected) {
    const result = scoreFishInRiver(run, localDate);
    assertEquals(result.score, score, localDate);
    assertEquals(result.riverCeiling, 70, localDate);
    assertEquals(result.historicalRunStrength, "moderate", localDate);
  }
  const complete = scoreFishInRiver(run, "2026-12-18");
  assertEquals(complete.score, null);
  assertEquals(complete.displayScore, undefined);
  assertEquals(complete.label, "Fall entry complete");
  assertMatch(complete.detail, /no longer estimates/i);
  assertMatch(complete.tip, /late August/i);
});

Deno.test("Betsie Steelhead stage copy uses two-reach geography and Fall entry complete", () => {
  const expectedLabels = new Map([
    ["2026-08-10", "Before migration"],
    ["2026-09-15", "Beginning"],
    ["2026-10-06", "Building"],
    ["2026-10-27", "Building"],
    ["2026-11-10", "Peak"],
    ["2026-11-30", "Late fall"],
    ["2026-12-15", "Holding transition"],
    ["2026-12-18", "Fall entry complete"],
  ]);
  for (const [localDate, label] of expectedLabels) {
    assertEquals(resolveRunStage(run, localDate).label, label, localDate);
  }
  const peak = resolveRunStage(run, "2026-11-10");
  assertMatch(peak.headline, /strongest Betsie fall Steelhead window/i);
  assertEquals(peak.whereToStart, "US-31–Homestead reach.");

  const complete = resolveRunStage(run, "2026-12-18");
  assertEquals(complete.winterHoldingContext, false);
  assertMatch(
    complete.detail,
    /no longer estimates current presence or activity/i,
  );
  assertMatch(complete.tip, /late August/i);

  for (
    let localDate = "2026-08-10";
    localDate <= "2026-12-31";
    localDate = addDays(localDate, 1)
  ) {
    const copy = JSON.stringify(resolveRunStage(run, localDate));
    assertEquals(/\bChinook\b|\bCoho\b/i.test(copy), false, localDate);
    assertEquals(
      /lower[ -]river|middle[ -]river|upper[ -]river/i.test(copy),
      false,
      localDate,
    );
    assertEquals(
      /above[- ]Homestead|above the structure|pass(?:ed|ing)? upstream/i.test(
        copy,
      ),
      false,
      `${localDate} implies migratory access above Homestead`,
    );
    assertEquals(
      /\bPush\b|\bFishability\b|Migration Timing/i.test(copy),
      false,
    );
    assertEquals(/spawning gravel|deteriorated fish/i.test(copy), false);
  }
});

Deno.test("Betsie Steelhead snapshots keep every sensor-dependent primitive unavailable", () => {
  const daily = buildDailySnapshot({
    river: BETSIE_RIVER_PROFILE,
    run,
    localDate: "2026-11-10",
    conditionsEvidenceByDate: {},
    conditionsBaselines: null,
    engineVersion: "test-engine",
    configVersion: BETSIE_CONFIGURATION_DOCUMENT.configVersion,
  });
  const refresh = buildConditionRefresh({
    dailySnapshot: daily,
    localDate: "2026-11-10",
    refreshSlot: "00:00",
    movementEngineId: run.movementEngineId,
    primitiveCapabilities: run.primitiveCapabilities,
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
    engineVersion: "test-engine",
    configVersion: BETSIE_CONFIGURATION_DOCUMENT.configVersion,
  });
  assertEquals(daily.fishInRiver.score, 70);
  assertEquals(refresh.conditionsSuggest.label, "Unavailable");
  assertEquals(refresh.push.label, "Unavailable");
  assertEquals(refresh.fishability.label, "Unavailable");
  assertMatch(refresh.push.tip, /Air temperature.*cannot replace/i);
});

Deno.test("Betsie Steelhead appears in the public catalog", () => {
  const visible = listVisibleRiverRuns([BETSIE_RIVER_PROFILE], [run]);
  assertEquals(visible[0].rivers[0].runs[0].runId, run.runId);
});
