import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  buildConditionRefresh,
  buildDailySnapshot,
  resolveFlowBand,
  RIVER_RUN_RUN_PROFILES,
  scoreActivity,
  scoreFishability,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
  WHITE_CONFIGURATION_DOCUMENT,
  WHITE_FALL_CHINOOK_RUN_PROFILE,
  WHITE_FALL_COHO_RUN_PROFILE,
  WHITE_FALL_STEELHEAD_RUN_PROFILE,
  WHITE_RIVER_PROFILE,
} from "../index.ts";

Deno.test("White foundation keeps split Gauge Read stations explicitly scoped", () => {
  const result = validateRiverProfile(WHITE_RIVER_PROFILE);
  assertEquals(
    result.valid,
    true,
    result.issues.map((item) => item.message).join("\n"),
  );
  assertEquals(WHITE_RIVER_PROFILE.hydraulicSources[0].siteId, "04122200");
  assertEquals(WHITE_RIVER_PROFILE.waterTemperatureSources[0].seriesId, "5989");
  assertMatch(WHITE_RIVER_PROFILE.gaugeLimitationCopy, /Fruitvale Road/i);
  assertMatch(WHITE_RIVER_PROFILE.gaugeLimitationCopy, /below Hesperia Dam/i);
});

Deno.test("White Fishability is shared, deterministic, and Fruitvale-scoped", () => {
  const runs = [
    WHITE_FALL_CHINOOK_RUN_PROFILE,
    WHITE_FALL_COHO_RUN_PROFILE,
    WHITE_FALL_STEELHEAD_RUN_PROFILE,
  ];
  const expectedBands: Array<[number, string]> = [
    [219, "very_low"],
    [220, "low"],
    [274, "low"],
    [275, "ideal"],
    [440, "ideal"],
    [440.5, "high_fishable"],
    [441, "high_fishable"],
    [712, "high_fishable"],
    [713, "very_high"],
    [1019, "very_high"],
    [1020, "blown_out"],
  ];

  for (const run of runs) {
    assertEquals(
      run.fishabilityBands?.version,
      "white-fruitvale-fishability-v2",
    );
    for (const [value, expectedBand] of expectedBands) {
      assertEquals(
        resolveFlowBand({
          metric: "flow_cfs",
          value,
          fishabilityBands: run.fishabilityBands,
        })?.band,
        expectedBand,
        `${run.runId} at ${value} CFS`,
      );
    }
  }

  const results = runs.map((run) =>
    scoreFishability({
      rules: run.fishabilityBands!,
      gaugeFreshness: "fresh",
      flowBand: "low",
      flowSignal: "stable",
      currentHydraulicValue: 241,
      copyStrategy: run.runStageCopyStrategy,
    })
  );
  assertEquals(results.map((result) => result.score), [60, 60, 60]);
  assertEquals(results.map((result) => result.label), [
    "Fishable",
    "Fishable",
    "Fishable",
  ]);
  for (const result of results) {
    assertMatch(result.detail, /live flow card compares this date/i);
    assertMatch(result.detail, /Fruitvale Road/i);
    assertMatch(result.detail, /not the full White River/i);
  }
});

Deno.test("White Steelhead observed Activity is Peak-led without salmon lifecycle semantics", () => {
  const run = WHITE_FALL_STEELHEAD_RUN_PROFILE;
  const weather = Array.from({ length: 24 }, (_, hour) => ({
    time_local: `2026-11-25T${String(hour).padStart(2, "0")}:00`,
    cloud_cover_pct: 20,
    shortwave_w_m2: hour >= 7 && hour < 18 ? 450 : 0,
    clear_sky_shortwave_w_m2: hour >= 7 && hour < 18 ? 600 : 0,
    precipitation_in: 0,
  }));
  const score = (
    runStage: "pre_run" | "building" | "peak" | "tapering" | "post_run",
  ) =>
    scoreActivity({
      rules: run.activity!,
      requestDate: "2026-11-25",
      targetDate: "2026-11-25",
      runStage,
      staging: false,
      waterTempF: 50,
      temperatureTrend: "neutral",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      flowSignal: "stable",
      hourlyWeather: weather,
    });
  const preRun = score("pre_run");
  const building = score("building");
  const peak = score("peak");
  const tapering = score("tapering");
  const postRun = score("post_run");
  assert((peak.score ?? 0) > (building.score ?? 0));
  assert((building.score ?? 0) > (preRun.score ?? 0));
  assert((peak.score ?? 0) > (tapering.score ?? 0));
  assert((tapering.score ?? 0) > (postRun.score ?? 0));
  assertEquals(run.activity?.caps.lifecycleRamp, undefined);
  assertEquals(run.activity?.caps.taperingPenalty, undefined);
  assertEquals(
    /spent|dying|deteriorat|mortality/i.test(
      [peak.headline, peak.detail, peak.tip].join(" "),
    ),
    false,
  );
});

Deno.test("White public runs combine the accepted measured corridor inputs", () => {
  for (
    const run of [
      WHITE_FALL_CHINOOK_RUN_PROFILE,
      WHITE_FALL_COHO_RUN_PROFILE,
      WHITE_FALL_STEELHEAD_RUN_PROFILE,
    ]
  ) {
    const result = validateRunProfile(run, WHITE_RIVER_PROFILE);
    assertEquals(
      result.valid,
      true,
      result.issues.map((item) => item.message).join("\n"),
    );
    assertEquals(result.publicVisible, true);
    assertEquals(run.primitiveCapabilities.migrationStage.status, "available");
    assertEquals(run.primitiveCapabilities.fishInRiver.status, "available");
    assertEquals(run.primitiveCapabilities.fishability.status, "available");
    assertEquals(run.primitiveCapabilities.activity.status, "available");
    assertEquals(run.activity?.dataMode, "observed_river");
    assertEquals(
      run.activity?.minimumInputContract,
      "weather_and_one_measured_river_input",
    );
    assertEquals(run.activity?.inputReach?.hydraulicSourceIds, [
      "white_fruitvale_usgs",
    ]);
    assertEquals(run.activity?.inputReach?.waterTemperatureSourceIds, [
      "white_weaver_st_temperature",
    ]);
    assertEquals(run.waterTemperature?.sourcePriority, [
      "white_weaver_st_temperature",
    ]);
    assert((run.activity?.weights.waterTemperature ?? 0) > 0);
    assert((run.activity?.weights.riverBehavior ?? 0) > 0);
  }
});

Deno.test("White release validates and is present in public registries", () => {
  for (
    const runId of [
      "white_fall_chinook",
      "white_fall_coho",
      "white_fall_steelhead",
    ]
  ) {
    assertEquals(
      RIVER_RUN_RUN_PROFILES.some((run) => run.runId === runId),
      true,
    );
  }
  const issues = validateConfigurationRevision({
    configKey: "white",
    revision: 1,
    status: "published",
    document: WHITE_CONFIGURATION_DOCUMENT,
    evidenceNotes:
      "Released White configuration after Fishability and production-shaped acceptance.",
  });
  assert(issues.every((issue) => issue.severity !== "error"));
});

Deno.test("White condition refresh produces a full observed-river Activity read", () => {
  const run = WHITE_FALL_CHINOOK_RUN_PROFILE;
  const daily = buildDailySnapshot({
    river: WHITE_RIVER_PROFILE,
    run,
    localDate: "2026-10-08",
    conditionsEvidenceByDate: {},
    conditionsBaselines: null,
    engineVersion: "test-engine",
    configVersion: WHITE_CONFIGURATION_DOCUMENT.configVersion,
  });
  const refresh = buildConditionRefresh({
    dailySnapshot: daily,
    localDate: "2026-10-08",
    refreshSlot: "12:00",
    movementEngineId: run.movementEngineId,
    primitiveCapabilities: run.primitiveCapabilities,
    fishabilityBands: run.fishabilityBands,
    activityRules: run.activity,
    activityTargetDate: "2026-10-08",
    activityTargetStage: daily.runStage.stage,
    activityStaging: false,
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    waterTemperatureFreshness: "fresh",
    currentHydraulicValue: 341,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    rainSignal: "dry",
    flowSignal: "stable",
    temperatureSignal: "neutral",
    temperatureSourceType: "nearby_gauge",
    waterTempF: 55,
    flowBand: "ideal",
    sourceMetrics: {
      weather: {
        provider: "OPEN_METEO",
        evidenceType: "modeled_grid",
        weatherPointId: "white_pines_point_weather",
        hourlyActivityWeather: Array.from({ length: 24 }, (_, hour) => ({
          time_local: `2026-10-08T${String(hour).padStart(2, "0")}:00`,
          cloud_cover_pct: 85,
          shortwave_w_m2: hour >= 7 && hour < 19 ? 100 : 0,
          clear_sky_shortwave_w_m2: hour >= 7 && hour < 19 ? 600 : 0,
          precipitation_in: hour >= 9 && hour < 13 ? 0.005 : 0,
        })),
      },
    },
    engineVersion: "test-engine",
    configVersion: WHITE_CONFIGURATION_DOCUMENT.configVersion,
  });
  assertEquals(refresh.activity?.confidence, "Full");
  assertEquals(refresh.activity?.blocks.length, 4);
  assertEquals(
    refresh.activity?.reasonCodes.includes("activity_weather_only"),
    false,
  );
  assertMatch(
    refresh.activity?.headline ?? "",
    /Chinook activity outlook/i,
  );
  assertMatch(
    refresh.activity?.detail ?? "",
    /Fruitvale Road flow/i,
  );
  assertMatch(refresh.activity?.detail ?? "", /below Hesperia Dam/i);
});
