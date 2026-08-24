import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  buildConditionRefresh,
  buildDailySnapshot,
  RIVER_RUN_DRAFT_RUN_PROFILES,
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

Deno.test("White draft foundation keeps split Gauge Read stations explicitly scoped", () => {
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

Deno.test("White supported drafts expose seasonal primitives and fail Activity closed", () => {
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
    assertEquals(result.publicVisible, false);
    assertEquals(run.primitiveCapabilities.migrationStage.status, "available");
    assertEquals(run.primitiveCapabilities.fishInRiver.status, "available");
    assertEquals(run.primitiveCapabilities.fishability.status, "available");
    assertEquals(run.primitiveCapabilities.activity.status, "unavailable");
    assertEquals("activity" in run, false);
  }
});

Deno.test("White drafts validate but remain outside public registries", () => {
  for (
    const runId of [
      "white_fall_chinook",
      "white_fall_coho",
      "white_fall_steelhead",
    ]
  ) {
    assertEquals(
      RIVER_RUN_RUN_PROFILES.some((run) => run.runId === runId),
      false,
    );
    assertEquals(
      RIVER_RUN_DRAFT_RUN_PROFILES.some((run) => run.runId === runId),
      true,
    );
  }
  const issues = validateConfigurationRevision({
    configKey: "white",
    revision: 1,
    status: "draft",
    document: WHITE_CONFIGURATION_DOCUMENT,
    evidenceNotes:
      "Hidden Phase C White drafts for Fishability replay and production-shaped acceptance.",
  });
  assert(issues.every((issue) => issue.severity !== "error"));
});

Deno.test("White condition refresh returns deterministic unavailable Activity", () => {
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
    sourceMetrics: {},
    engineVersion: "test-engine",
    configVersion: WHITE_CONFIGURATION_DOCUMENT.configVersion,
  });
  assertEquals(refresh.activity?.label, "Unavailable");
  assertEquals(refresh.activity?.score, null);
  assertEquals(refresh.activity?.blocks, []);
  assertMatch(
    refresh.activity?.headline ?? "",
    /different White River reaches/i,
  );
  assertMatch(
    refresh.activity?.detail ?? "",
    /do not describe one shared reach/i,
  );
});
