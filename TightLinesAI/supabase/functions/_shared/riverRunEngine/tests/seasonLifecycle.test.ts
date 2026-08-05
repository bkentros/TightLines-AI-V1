import { assert, assertEquals } from "jsr:@std/assert";
import {
  buildConditionRefresh,
  buildDailySnapshot,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_FALL_COHO_RUN_PROFILE,
  PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  type RiverRunDailySnapshot,
  type RiverRunProfile,
} from "../index.ts";

const lifecycleCases = [
  {
    name: "PM Fall Chinook",
    run: PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    offseasonBefore: "2026-06-30",
    preRunBeforeMonitoring: "2026-07-01",
    monitoring: "2026-07-28",
    runStart: "2026-08-15",
    postRun: "2026-10-28",
    offseasonAfter: "2026-11-11",
  },
  {
    name: "PM Fall Coho",
    run: PERE_MARQUETTE_FALL_COHO_RUN_PROFILE,
    offseasonBefore: "2026-08-14",
    preRunBeforeMonitoring: "2026-08-15",
    monitoring: "2026-08-25",
    runStart: "2026-09-01",
    postRun: "2026-12-01",
    offseasonAfter: "2027-01-03",
  },
] as const;

for (const testCase of lifecycleCases) {
  Deno.test(`${testCase.name} exposes honest states across the full seasonal lifecycle`, () => {
    const before = snapshotAndRefresh(testCase.run, testCase.offseasonBefore);
    assertEquals(before.daily.runStage.label, "Offseason");
    assertEquals(before.daily.conditionsSuggest.label, "Not monitoring yet");
    assertEquals(before.daily.fishInRiver.label, "Offseason");
    assertEquals(before.refresh.push.label, "Offseason");

    const early = snapshotAndRefresh(
      testCase.run,
      testCase.preRunBeforeMonitoring,
    );
    assertEquals(early.daily.runStage.label, "Before migration");
    assertEquals(early.daily.conditionsSuggest.label, "Not monitoring yet");
    assertEquals(early.daily.fishInRiver.label, "Not expected yet");
    assertEquals(early.refresh.push.label, "Waiting for migration");

    const monitoring = snapshotAndRefresh(testCase.run, testCase.monitoring);
    assertEquals(monitoring.daily.runStage.label, "Before migration");
    assertEquals(monitoring.daily.conditionsSuggest.label, "Evaluating");
    assertEquals(monitoring.daily.fishInRiver.label, "Not expected yet");
    assertEquals(monitoring.refresh.push.label, "Waiting for migration");

    const active = snapshotAndRefresh(testCase.run, testCase.runStart);
    assertEquals(active.daily.runStage.label, "Beginning");
    assert(
      typeof active.daily.fishInRiver.score === "number" &&
        active.daily.fishInRiver.score > 0,
    );
    assertEquals(
      ["Offseason", "Waiting for migration", "Migration complete"].includes(
        active.refresh.push.label,
      ),
      false,
    );

    const post = snapshotAndRefresh(testCase.run, testCase.postRun);
    assertEquals(post.daily.runStage.label, "After migration");
    assertEquals(post.daily.conditionsSuggest.label, "Timing complete");
    assertEquals(post.refresh.push.label, "Migration complete");

    const after = snapshotAndRefresh(testCase.run, testCase.offseasonAfter);
    assertEquals(after.daily.runStage.label, "Offseason");
    assertEquals(after.daily.conditionsSuggest.label, "Not monitoring yet");
    assertEquals(after.daily.fishInRiver.label, "Offseason");
    assertEquals(after.refresh.push.label, "Offseason");
    assert(
      after.refresh.fishability.detail.includes(
        "if migratory fish are present",
      ),
      "Offseason Fishability must remain explicitly conditional on fish presence",
    );
  });
}

Deno.test("PM Fall Steelhead hands migration primitives to winter holding without erasing fish", () => {
  const run = PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE;
  const early = snapshotAndRefresh(run, "2026-09-01");
  assertEquals(early.daily.runStage.label, "Before migration");
  assertEquals(early.daily.conditionsSuggest.label, "Evaluating");
  assertEquals(early.refresh.push.label, "Waiting for migration");
  assert(
    early.refresh.push.detail.includes(
      "occasional early steelhead is possible",
    ),
  );
  assertEquals(
    early.refresh.push.headline.includes("Fish have not started entering"),
    false,
  );

  const active = snapshotAndRefresh(run, "2026-12-22");
  assertEquals(active.daily.runStage.label, "Holding transition");
  assertEquals(active.daily.fishInRiver.score, 70);
  assertEquals(active.daily.conditionsSuggest.label, "Timing complete");

  const winter = snapshotAndRefresh(run, "2026-12-23");
  assertEquals(winter.daily.runStage.label, "Winter holding");
  assertEquals(winter.daily.fishInRiver.label, "Winter holding");
  assertEquals(winter.daily.fishInRiver.score, 70);
  assertEquals(winter.daily.fishInRiver.handoffScore, 70);
  assertEquals(winter.refresh.push.label, "Winter holding");
  assertEquals(winter.daily.conditionsSuggest.label, "Timing complete");
  assert(
    winter.refresh.interpretationNote?.reasonCodes.includes(
      "winter_holding_read_required",
    ),
  );
});

function snapshotAndRefresh(run: RiverRunProfile, localDate: string) {
  const daily = buildDailySnapshot({
    river: PERE_MARQUETTE_RIVER_PROFILE,
    run,
    localDate,
    conditionsEvidenceByDate: {},
    conditionsBaselines: [],
    engineVersion: "lifecycle-test-engine",
    configVersion: "lifecycle-test-config",
  }) as RiverRunDailySnapshot;
  const refresh = buildConditionRefresh({
    dailySnapshot: daily,
    localDate,
    refreshSlot: "16:00",
    movementEngineId: run.movementEngineId,
    pushRules: run.push,
    fishabilityBands: run.fishabilityBands,
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    waterTemperatureFreshness: "fresh",
    flowBand: "ideal",
    currentHydraulicValue: 600,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    rainSignal: "light_rain",
    flowSignal: "stable",
    temperatureSignal: "neutral",
    temperatureSourceType: "same_gauge",
    waterTempF: 60,
    sourceMetrics: {
      gauge: {
        primaryMetric: "flow_cfs",
        band: "ideal",
        trend: "stable",
      },
      weather: {},
    },
    engineVersion: "lifecycle-test-engine",
    configVersion: "lifecycle-test-config",
  });
  return { daily, refresh };
}
