import { assert, assertEquals } from "jsr:@std/assert";
import {
  buildConditionRefresh,
  buildDailySnapshot,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_FALL_COHO_RUN_PROFILE,
  PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  RIVER_RUN_CONFIGURATION_DOCUMENTS,
  addDays,
  resolveActiveRunWindow,
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
    assertEquals(before.daily.runStage.label, "Before migration");
    assertEquals(before.daily.conditionsSuggest.label, "Not monitoring yet");
    assertEquals(before.daily.fishInRiver.label, "Not expected yet");
    assertEquals(before.refresh.push.label, "Waiting for migration");

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
    assertEquals(after.daily.runStage.label, "Fall run complete");
    assertEquals(after.daily.conditionsSuggest.label, "Not monitoring yet");
    assertEquals(after.daily.fishInRiver.label, "Fall run complete");
    assertEquals(after.refresh.push.label, "Offseason");
    assert(
      after.refresh.fishability.detail.includes("not the full PM"),
      "Fishability must stay scoped to the Scottville/Lower river reach",
    );
  });
}

Deno.test("all configured runs distinguish the upcoming cycle from the completed cycle", () => {
  for (const document of RIVER_RUN_CONFIGURATION_DOCUMENTS) {
    for (const run of document.runs) {
      const referenceWindow = resolveActiveRunWindow(run, "2026-09-15");
      const upcomingDate = addDays(referenceWindow.preRunStartDate, -1);
      const upcoming = snapshotAndRefresh(run, upcomingDate);

      assertEquals(
        upcoming.daily.runStage.label,
        "Before migration",
        `${run.runId} upcoming Stage`,
      );
      assertEquals(
        upcoming.daily.conditionsSuggest.label,
        run.primitiveCapabilities.migrationTiming.status === "available"
          ? "Not monitoring yet"
          : "Unavailable",
        `${run.runId} upcoming Timing`,
      );
      assertEquals(
        upcoming.daily.fishInRiver.label,
        "Not expected yet",
        `${run.runId} upcoming Presence`,
      );
      assertEquals(
        upcoming.refresh.push.label,
        run.primitiveCapabilities.push.status === "available"
          ? "Waiting for migration"
          : "Unavailable",
        `${run.runId} upcoming Push`,
      );
      assertEquals(
        upcoming.refresh.activity?.label,
        "Not active yet",
        `${run.runId} upcoming Activity`,
      );
      const upcomingCopy = [
        upcoming.daily.runStage.headline,
        upcoming.daily.fishInRiver.headline,
        upcoming.refresh.push.headline,
        upcoming.refresh.activity?.headline ?? "",
      ].join(" ");
      assertEquals(
        /run (?:is )?complete|entry (?:is )?complete/i.test(upcomingCopy),
        false,
        `${run.runId} upcoming copy must not describe a completed run`,
      );

      const completedDate = addDays(referenceWindow.postRunLateCopyEndDate, 1);
      const completed = snapshotAndRefresh(run, completedDate);
      assert(
        completed.daily.runStage.label === "Fall run complete" ||
          completed.daily.runStage.label === "Fall entry complete",
        `${run.runId} post-run Stage must remain complete immediately after its terminal window`,
      );
    }
  }
});

Deno.test("PM Fall Steelhead completes fall primitives without claiming fish left", () => {
  const run = PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE;
  const early = snapshotAndRefresh(run, "2026-09-01");
  assertEquals(early.daily.runStage.label, "Before migration");
  assertEquals(early.daily.conditionsSuggest.label, "Evaluating");
  assertEquals(early.refresh.push.label, "Waiting for migration");
  assert(early.refresh.push.detail.includes("not scored as an in-season"));
  assertEquals(
    early.refresh.push.headline.includes("Fish have not started entering"),
    false,
  );

  const active = snapshotAndRefresh(run, "2026-12-22");
  assertEquals(active.daily.runStage.label, "Holding transition");
  assertEquals(active.daily.fishInRiver.score, 70);
  assertEquals(active.daily.conditionsSuggest.label, "Timing complete");

  const complete = snapshotAndRefresh(run, "2026-12-23");
  assertEquals(complete.daily.runStage.label, "Fall entry complete");
  assertEquals(complete.daily.fishInRiver.label, "Fall entry complete");
  assertEquals(complete.daily.fishInRiver.score, null);
  assertEquals(complete.daily.fishInRiver.handoffScore, undefined);
  assertEquals(complete.refresh.push.label, "Fall entry complete");
  assertEquals(complete.daily.conditionsSuggest.label, "Timing complete");
  assertEquals(complete.refresh.interpretationNote, undefined);
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
    primitiveCapabilities: run.primitiveCapabilities,
    pushRules: run.push,
    fishabilityBands: run.fishabilityBands,
    activityRules: run.activity,
    activityTargetDate: localDate,
    activityTargetStage: daily.runStage.stage,
    activityStaging: daily.runStage.stagingContext,
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
