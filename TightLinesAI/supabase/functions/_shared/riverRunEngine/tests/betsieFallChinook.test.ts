import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  addDays,
  BETSIE_CONFIGURATION_DOCUMENT,
  BETSIE_FALL_CHINOOK_RUN_PROFILE,
  BETSIE_RIVER_PROFILE,
  buildConditionRefresh,
  buildDailySnapshot,
  listVisibleRiverRuns,
  resolveRunStage,
  scoreFishInRiver,
  staticConfigurationVersionForRun,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";

const run = BETSIE_FALL_CHINOOK_RUN_PROFILE;

Deno.test("Betsie river is valid with explicitly unavailable condition sources", () => {
  const result = validateRiverProfile(BETSIE_RIVER_PROFILE);
  assertEquals(result.valid, true);
  assertEquals(BETSIE_RIVER_PROFILE.hydraulicSources, []);
  assertEquals(BETSIE_RIVER_PROFILE.waterTemperatureSources, []);
  assertMatch(BETSIE_RIVER_PROFILE.gaugeLimitationCopy, /below Homestead/i);
  assertMatch(
    BETSIE_RIVER_PROFILE.gaugeLimitationCopy,
    /accurate and consistent/i,
  );
  assertMatch(BETSIE_RIVER_PROFILE.regulationReminderCopy ?? "", /300 feet/i);
  assertMatch(BETSIE_RIVER_PROFILE.regulationReminderCopy ?? "", /100 feet/i);
});

Deno.test("Betsie Fall Chinook is valid, seasonal-only, and owner-gated", () => {
  const result = validateRunProfile(run, BETSIE_RIVER_PROFILE);
  assertEquals(result.valid, true);
  assertEquals(result.publicVisible, false);
  assert(
    result.issues.some((issue) => issue.code === "audit_gate_disabled"),
  );
  assertEquals(run.publicAudit.isEnabled, false);
  assertEquals("push" in run, false);
  assertEquals("fishabilityBands" in run, false);
  assertEquals("baselineCoverage" in run, false);
  assertEquals("waterTemperature" in run, false);
  assertEquals("conditionsSuggest" in run, false);
});

Deno.test("Betsie configuration revision is internally valid and versioned separately", () => {
  const issues = validateConfigurationRevision({
    configKey: "betsie",
    revision: 1,
    status: "draft",
    document: BETSIE_CONFIGURATION_DOCUMENT,
    evidenceNotes: "Betsie Fall Chinook owner-audit build.",
  });
  assertEquals(issues, []);
  assertEquals(
    staticConfigurationVersionForRun(run.runId),
    BETSIE_CONFIGURATION_DOCUMENT.configVersion,
  );
});

Deno.test("Betsie calendar and five-day-advanced presence anchors remain exact", () => {
  assertEquals(run.runWindow.start, "08-10");
  assertEquals(run.runWindow.peak, "09-15");
  assertEquals(run.runWindow.end, "10-22");
  assertEquals(run.runWindow.lateEnd, "11-03");
  const expected = new Map([
    ["2026-08-09", 0],
    ["2026-08-10", 10],
    ["2026-08-17", 25],
    ["2026-08-30", 50],
    ["2026-09-15", 100],
    ["2026-09-25", 95],
    ["2026-10-04", 70],
    ["2026-10-20", 25],
    ["2026-11-03", 0],
  ]);
  for (const [localDate, score] of expected) {
    assertEquals(scoreFishInRiver(run, localDate).score, score, localDate);
  }
});

Deno.test("Betsie stage copy uses Homestead geography instead of PM sections", () => {
  const beginning = resolveRunStage(run, "2026-08-10");
  assertEquals(beginning.stage, "beginning");
  assertMatch(beginning.whereToStart ?? "", /lake-to-river transition/i);
  assertMatch(beginning.whereToStart ?? "", /toward Homestead/i);
  assertMatch(beginning.detail, /rare early fish can already reach Homestead/i);
  assertMatch(beginning.detail, /unlikely/i);

  const lateAugust = resolveRunStage(run, "2026-08-27");
  assertEquals(lateAugust.stage, "building");
  assertMatch(lateAugust.detail, /late August/i);
  assertMatch(lateAugust.detail, /Homestead end.*is realistic/i);
  assertMatch(lateAugust.tip, /300-foot closure/i);

  const peak = resolveRunStage(run, "2026-09-15");
  assertEquals(peak.stage, "peak");
  assertMatch(peak.whereToStart ?? "", /lakeward end/i);
  assertMatch(peak.whereToStart ?? "", /legal Homestead-approach/i);
  assertMatch(peak.whereToStart ?? "", /signed dam closure/i);

  for (
    const localDate of [
      "2026-07-01",
      "2026-07-28",
      "2026-08-10",
      "2026-08-19",
      "2026-08-27",
      "2026-09-05",
      "2026-09-15",
      "2026-10-01",
      "2026-10-20",
      "2026-11-04",
      "2026-11-06",
    ]
  ) {
    const display = resolveRunStage(run, localDate);
    const copy = [
      display.headline,
      display.whereToStart,
      display.detail,
      display.tip,
    ].join(" ");
    assertEquals(
      /lower[ -]river|middle[ -]river|upper[ -]river/i.test(copy),
      false,
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

Deno.test("every Betsie stage and presence Guide's Read is complete and capability-safe", () => {
  for (
    let localDate = "2026-07-01";
    localDate <= "2026-11-06";
    localDate = addDays(localDate, 1)
  ) {
    const stage = resolveRunStage(run, localDate);
    const presence = scoreFishInRiver(run, localDate);
    for (
      const [primitive, tip] of [
        ["Run Stage", stage.tip],
        ["Fish In River", presence.tip],
      ] as const
    ) {
      assert(tip.trim().length > 0, `${primitive} ${localDate}`);
      assertMatch(tip, /[.!?]$/, `${primitive} ${localDate}`);
      assertEquals(
        /\bPush\b|\bFishability\b|Migration Timing|live primitives/i.test(tip),
        false,
        `${primitive} ${localDate}: ${tip}`,
      );
    }
  }
});

Deno.test("Betsie daily and condition snapshots expose only seasonal primitives", () => {
  const daily = buildDailySnapshot({
    river: BETSIE_RIVER_PROFILE,
    run,
    localDate: "2026-09-15",
    conditionsEvidenceByDate: {},
    conditionsBaselines: null,
    engineVersion: "test-engine",
    configVersion: BETSIE_CONFIGURATION_DOCUMENT.configVersion,
  });
  assertEquals(daily.runStage.label, "Peak");
  assertEquals(daily.fishInRiver.score, 100);
  assertEquals(daily.conditionsSuggest.label, "Unavailable");
  assertEquals(daily.conditionsSuggest.score, null);

  const refresh = buildConditionRefresh({
    dailySnapshot: daily,
    localDate: "2026-09-15",
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
  assertEquals(refresh.push.label, "Unavailable");
  assertEquals(refresh.push.score, null);
  assertMatch(refresh.push.detail, /accurate and consistent/i);
  assertMatch(refresh.push.tip, /not substitute air temperature/i);
  assertEquals(refresh.fishability.label, "Unavailable");
  assertEquals(refresh.fishability.score, null);
  assertMatch(refresh.fishability.detail, /accurate and consistent/i);
  assert(
    refresh.reasonCodes.includes(
      "primitive_migration_timing_unavailable_for_river",
    ),
  );
  assert(
    refresh.reasonCodes.includes("primitive_push_unavailable_for_river"),
  );
  assert(
    refresh.reasonCodes.includes(
      "primitive_fishability_unavailable_for_river",
    ),
  );
});

Deno.test("unavailable Betsie primitives reject placeholder PM calibrations", () => {
  const invalid = validateRunProfile({
    ...run,
    push: {
      version: "placeholder",
    } as never,
  }, BETSIE_RIVER_PROFILE);
  assertEquals(invalid.valid, false);
  assert(
    invalid.issues.some((issue) =>
      issue.field === "push" && issue.code === "config_invalid_value"
    ),
  );
});

Deno.test("Betsie remains absent from the public catalog before owner acceptance", () => {
  const visible = listVisibleRiverRuns(
    [BETSIE_RIVER_PROFILE],
    [BETSIE_FALL_CHINOOK_RUN_PROFILE],
  );
  assertEquals(visible, []);
});
