import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  addDays,
  BETSIE_CONFIGURATION_DOCUMENT,
  BETSIE_FALL_COHO_RUN_PROFILE,
  BETSIE_RIVER_PROFILE,
  buildConditionRefresh,
  buildDailySnapshot,
  listVisibleRiverRuns,
  PERE_MARQUETTE_FALL_COHO_RUN_PROFILE,
  resolveActiveRunWindow,
  resolveRunStage,
  scoreActivity,
  scoreFishInRiver,
  validateRunProfile,
} from "../index.ts";

const run = BETSIE_FALL_COHO_RUN_PROFILE;

Deno.test("Betsie Fall Coho is valid, limited, sectional, weather-only, and owner-gated", () => {
  const result = validateRunProfile(run, BETSIE_RIVER_PROFILE);
  assertEquals(result.valid, true);
  assertEquals(result.publicVisible, false);
  assertEquals(run.publicAudit.isEnabled, false);
  assertEquals(run.historicalPresence.maximum, 3);
  assertEquals(run.historicalPresence.distributionScope, "sectional");
  assertEquals("push" in run, false);
  assertEquals("fishabilityBands" in run, false);
  assertEquals("conditionsSuggest" in run, false);
  assertEquals(run.primitiveCapabilities.activity, { status: "available" });
  assertEquals(run.activity?.dataMode, "weather_only");
});

Deno.test("Betsie Coho Activity is species-specific and continuously lifecycle-adjusted", () => {
  assertEquals(run.activity?.version, "betsie-fall-coho-weather-activity-v1");
  assertEquals(run.activity?.profile, "coho_fall_reaction");
  assertEquals(run.activity?.weights, {
    light: 0.7,
    waterTemperature: 0,
    riverBehavior: 0,
    weather: 0.3,
  });
  assertEquals(run.activity?.caps.weatherOnlyMaximum, 95);
  assertEquals(run.activity?.caps.tomorrow, 90);
  assertEquals(run.activity?.caps.lifecycleRamp, {
    peakEnd: "10-31",
    taperingEnd: "11-15",
    endingEnd: "12-26",
  });

  const scoreFor = (date: string) => {
    const stage = resolveRunStage(run, date);
    return scoreActivity({
      rules: run.activity!,
      requestDate: date,
      targetDate: date,
      runStage: stage.stage,
      staging: stage.stagingContext,
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
    });
  };
  const dates = [
    "2026-10-31",
    "2026-11-01",
    "2026-11-15",
    "2026-11-25",
    "2026-12-26",
  ];
  const results = dates.map(scoreFor);
  for (const [index, result] of results.entries()) {
    assertEquals(result.confidence, "Limited", dates[index]);
    assertEquals(result.reasonCodes.includes("activity_weather_only"), true);
    assertMatch(result.headline, /weather-only Coho activity outlook/i);
    assertMatch(result.headline, /Limited confidence/i);
    assertMatch(result.detail, /sectional/i);
    assertEquals(/Chinook|Steelhead/i.test(JSON.stringify(result)), false);
    if (index) assert(result.score! <= results[index - 1].score!, dates[index]);
  }
  assert(results[0].score! > results.at(-1)!.score!);
});

Deno.test("Betsie document binds all implemented species to explicit biology profiles", () => {
  assertEquals(
    BETSIE_CONFIGURATION_DOCUMENT.runs.map((candidate) => candidate.runId),
    ["betsie_fall_chinook", "betsie_fall_coho", "betsie_fall_steelhead"],
  );
  assertEquals(
    BETSIE_CONFIGURATION_DOCUMENT.biologyProfiles.map((profile) =>
      profile.biologyProfileId
    ),
    [
      "great_lakes_chinook_v1",
      "great_lakes_coho_v1",
      "great_lakes_steelhead_fall_entry_v1",
    ],
  );
});

Deno.test("every Betsie Coho calendar boundary is exactly five days ahead of PM Coho", () => {
  const betsie = resolveActiveRunWindow(run, "2026-10-15");
  const pm = resolveActiveRunWindow(
    PERE_MARQUETTE_FALL_COHO_RUN_PROFILE,
    "2026-10-20",
  );
  for (
    const field of [
      "preRunStartDate",
      "stagingStartDate",
      "startDate",
      "beginningEndDate",
      "buildingEstablishedStartDate",
      "peakStartDate",
      "peakDate",
      "peakEndDate",
      "taperingEndDate",
      "endDate",
      "lateEndDate",
      "postRunLateCopyEndDate",
    ] as const
  ) {
    assertEquals(betsie[field], addDays(pm[field], -5), field);
  }
});

Deno.test("Betsie Coho presence follows the accepted 30-point shifted PM curve", () => {
  const expected = new Map([
    ["2026-08-26", 0],
    ["2026-08-27", 3],
    ["2026-09-10", 6],
    ["2026-09-26", 15],
    ["2026-10-15", 30],
    ["2026-10-31", 27],
    ["2026-11-15", 18],
    ["2026-11-25", 12],
    ["2026-12-10", 6],
    ["2026-12-22", 2],
    ["2026-12-26", 0],
  ]);
  for (const [localDate, score] of expected) {
    const result = scoreFishInRiver(run, localDate);
    assertEquals(result.score, score, localDate);
    assertEquals(result.riverCeiling, 30, localDate);
    assertEquals(result.historicalRunStrength, "limited", localDate);
  }
});

Deno.test("Betsie Coho stage copy is limited, Homestead-specific, and species-correct", () => {
  const established = resolveRunStage(run, "2026-09-26");
  assertMatch(established.headline, /select below-Homestead water/i);
  assertMatch(established.detail, /late September/i);
  assertMatch(established.detail, /Homestead end.*is realistic/i);

  const peak = resolveRunStage(run, "2026-10-15");
  assertMatch(peak.headline, /limited Coho salmon opportunity/i);
  assertMatch(peak.whereToStart ?? "", /select substantial corridor holes/i);
  assertMatch(peak.whereToStart ?? "", /lakeward end/i);
  assertMatch(peak.whereToStart ?? "", /signed dam closure/i);
  assertMatch(peak.detail, /overall run remains small/i);
  assertMatch(peak.tip, /direct fish activity/i);

  for (
    let localDate = "2026-08-10";
    localDate <= "2026-12-29";
    localDate = addDays(localDate, 1)
  ) {
    const display = resolveRunStage(run, localDate);
    const copy = [
      display.headline,
      display.whereToStart,
      display.detail,
      display.tip,
    ].join(" ");
    assertEquals(/\bChinook\b/i.test(copy), false, localDate);
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
  }
});

Deno.test("Betsie Coho snapshots keep all sensor-dependent primitives unavailable", () => {
  const daily = buildDailySnapshot({
    river: BETSIE_RIVER_PROFILE,
    run,
    localDate: "2026-10-15",
    conditionsEvidenceByDate: {},
    conditionsBaselines: null,
    engineVersion: "test-engine",
    configVersion: BETSIE_CONFIGURATION_DOCUMENT.configVersion,
  });
  const refresh = buildConditionRefresh({
    dailySnapshot: daily,
    localDate: "2026-10-15",
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
  assertEquals(daily.runStage.label, "Peak");
  assertEquals(daily.fishInRiver.score, 30);
  assertEquals(refresh.conditionsSuggest.label, "Unavailable");
  assertEquals(refresh.push.label, "Unavailable");
  assertEquals(refresh.fishability.label, "Unavailable");
  assertMatch(refresh.push.tip, /not substitute air temperature/i);
});

Deno.test("Betsie Coho remains absent from the public catalog before owner acceptance", () => {
  const visible = listVisibleRiverRuns([BETSIE_RIVER_PROFILE], [run]);
  assertEquals(visible, []);
  assert(
    validateRunProfile(run, BETSIE_RIVER_PROFILE).issues.some((issue) =>
      issue.code === "audit_gate_disabled"
    ),
  );
});
