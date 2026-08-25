import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  buildConditionRefresh,
  buildDailySnapshot,
  RIVER_RUN_RUN_PROFILES,
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

Deno.test("White public runs expose weather-only Activity without blending split reaches", () => {
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
    assertEquals(run.activity?.dataMode, "weather_only");
    assertEquals(run.activity?.inputReach?.hydraulicSourceIds, []);
    assertEquals(run.activity?.inputReach?.waterTemperatureSourceIds, []);
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

Deno.test("White condition refresh scores only weather and keeps split river inputs unknown", () => {
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
  assertEquals(refresh.activity?.confidence, "Limited");
  assertEquals(refresh.activity?.blocks.length, 4);
  assert((refresh.activity?.score ?? 101) <= 90);
  assertMatch(
    refresh.activity?.headline ?? "",
    /weather-only Chinook activity outlook/i,
  );
  assertMatch(
    refresh.activity?.detail ?? "",
    /River level, clarity, and measured water temperature are unknown/i,
  );
});
