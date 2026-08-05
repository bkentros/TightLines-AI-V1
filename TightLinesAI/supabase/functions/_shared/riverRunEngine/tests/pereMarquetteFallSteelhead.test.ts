import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  buildConditionRefresh,
  buildDailySnapshot,
  GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
  listVisibleRiverRuns,
  PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  resolveConditionsSuggestCheckpoints,
  resolveInterpretationNote,
  resolveRunStage,
  scoreFishInRiver,
  scorePush,
  validateConfigurationRevision,
  validateRunProfile,
} from "../index.ts";

const run = PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE;

Deno.test("PM Fall Steelhead is a valid public fall-entry configuration capped at 8", () => {
  const result = validateRunProfile(run, PERE_MARQUETTE_RIVER_PROFILE);
  assertEquals(result.valid, true);
  assertEquals(result.publicVisible, true);
  assertEquals(run.historicalPresence.maximum, 8);
  assertEquals(run.runType, "fall_entry");
  assertEquals(run.movementEngineId, "fall_entry_cooling");
  assertEquals(
    run.publicAudit?.auditVersion,
    "pm-fall-steelhead-acceptance-v1",
  );
  assertEquals(result.issues, []);
});

Deno.test("fall-entry handoff fails closed when the retained-presence anchor misses the final migration day", () => {
  const invalid = {
    ...run,
    historicalPresence: {
      ...run.historicalPresence,
      anchors: run.historicalPresence.anchors.map((anchor, index, anchors) =>
        index === anchors.length - 1
          ? { ...anchor, dayOffsetFromStart: anchor.dayOffsetFromStart + 1 }
          : anchor
      ),
    },
  };
  const result = validateRunProfile(invalid, PERE_MARQUETTE_RIVER_PROFILE);
  assertEquals(result.valid, false);
  assert(
    result.issues.some((item) =>
      item.field === "historicalPresence.anchors" &&
      item.message.includes("final migration day")
    ),
  );
});

Deno.test("PM Fall Steelhead binds reusable iteroparous biology and PM river hydraulics", () => {
  assertEquals(
    run.biologyProfileId,
    GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE.biologyProfileId,
  );
  assertEquals(
    run.push.temperature,
    {
      suitabilityLabel: "adult fall steelhead entry",
      ...GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE
        .adultMigrationTemperature,
    },
  );
  assertEquals(
    run.push.hydraulic,
    PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push.hydraulic,
  );
  assertEquals(
    run.push.rain,
    PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push.rain,
  );
  assertEquals(
    run.conditionsSuggest.gaugeWeight,
    0.4,
  );
  assertEquals(run.conditionsSuggest.waterTemperatureWeight, 0.6);
  assertEquals(
    validateConfigurationRevision({
      configKey: "pere_marquette",
      revision: 3,
      status: "draft",
      document: PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
      evidenceNotes: "PM fall steelhead implementation candidate.",
    }),
    [],
  );
});

Deno.test("PM Fall Steelhead stages include late-September entry and December winter handoff", () => {
  const expected = [
    ["2026-08-14", "Offseason"],
    ["2026-08-15", "Before migration"],
    ["2026-09-20", "Beginning"],
    ["2026-10-11", "Building"],
    ["2026-11-01", "Building"],
    ["2026-11-15", "Peak"],
    ["2026-12-05", "Late fall"],
    ["2026-12-20", "Holding transition"],
    ["2026-12-23", "Winter holding"],
  ] as const;
  for (const [localDate, label] of expected) {
    assertEquals(resolveRunStage(run, localDate).label, label, localDate);
  }
  const established = resolveRunStage(run, "2026-10-15");
  assertMatch(established.whereToStart ?? "", /lower and middle/i);
  assertMatch(established.detail, /lower, middle, and upper/i);
  assertMatch(established.detail, /dependable concentrations/i);
  const broadlyEstablished = resolveRunStage(run, "2026-11-01");
  assertMatch(broadlyEstablished.headline, /broadly established/i);
  assertMatch(broadlyEstablished.whereToStart ?? "", /middle and upper/i);
  assertMatch(
    broadlyEstablished.detail,
    /upper river is now a primary option/i,
  );
  const delayedBroadRead = resolveInterpretationNote({
    runStage: broadlyEstablished.stage,
    broadBuildingContext: broadlyEstablished.broadBuildingContext,
    conditionsSuggestLabel: "Delayed",
    push: {
      label: "No clear push",
      score: 35,
      headline: "No clear movement signal.",
      detail: "No clear movement signal.",
      tip: "Fish holding water.",
      reasonCodes: [],
    },
    fishability: {
      label: "Fishable",
      score: 60,
      headline: "The river is fishable.",
      detail: "The river is fishable.",
      tip: "Use controlled presentations.",
      reasonCodes: [],
    },
    fishInRiver: scoreFishInRiver(run, "2026-11-01"),
  });
  assert(
    delayedBroadRead?.reasonCodes.includes(
      "broad_building_delayed_conditions",
    ),
  );
  assertMatch(delayedBroadRead?.detail ?? "", /expand upstream only/i);
  const winter = resolveRunStage(run, "2026-12-23");
  assertEquals(winter.winterHoldingContext, true);
  assertMatch(winter.detail, /remain distributed|remain strongly present/i);
  assertMatch(winter.tip, /open the winter holding read/i);
  assertEquals(/spawning|gravel/i.test(JSON.stringify(winter)), false);
});

Deno.test("PM Fall Steelhead reaches 80 and retains 70 through December 22", () => {
  const expected = [
    ["2026-09-19", 0, "Not expected yet"],
    ["2026-09-20", 8, "Low presence"],
    ["2026-10-01", 16, "Low presence"],
    ["2026-10-10", 28, "Limited presence"],
    ["2026-10-15", 36, "Moderate presence"],
    ["2026-10-16", 37, "Moderate presence"],
    ["2026-11-01", 60, "High presence"],
    ["2026-11-15", 80, "Peak presence"],
    ["2026-12-04", 80, "Peak presence"],
    ["2026-12-05", 79, "Peak presence"],
    ["2026-12-19", 72, "Peak presence"],
    ["2026-12-20", 71, "High presence"],
    ["2026-12-22", 70, "High presence"],
  ] as const;
  for (const [localDate, score, label] of expected) {
    const result = scoreFishInRiver(run, localDate);
    assertEquals(result.riverCeiling, 80, localDate);
    assertEquals(result.score, score, localDate);
    assertEquals(result.label, label, localDate);
  }
  const handoff = scoreFishInRiver(run, "2026-12-23");
  assertEquals(handoff.score, 70);
  assertEquals(handoff.handoffScore, 70);
  assertEquals(handoff.label, "Winter holding");
  assertEquals(handoff.winterHoldingContext, true);
});

Deno.test("fall-entry Push distinguishes core, cold-active, and cold-holding steelhead water", () => {
  const scoreAt = (waterTempF: number) =>
    scorePush({
      movementEngineId: run.movementEngineId,
      rules: run.push,
      gaugeFreshness: "fresh",
      flowSignal: "meaningful_rise",
      currentHydraulicValue: 700,
      hydraulicAbsoluteChange24h: 70,
      hydraulicPercentChange24h: 10,
      rainSignal: "light_rain",
      temperatureSignal: "neutral",
      temperatureSourceType: "same_gauge",
      waterTempF,
      trackingState: "active",
      trackingStartDate: "2026-09-20",
      trackingEndDate: "2026-12-22",
    });
  assertEquals(scoreAt(52).components?.temperatureState, "supportive");
  assertEquals(scoreAt(45).components?.temperatureState, "cold_active");
  const coldHolding = scoreAt(39);
  assertEquals(coldHolding.components?.temperatureState, "cold_holding");
  assertEquals(coldHolding.score, 49);
  assert(coldHolding.reasonCodes.includes("push_cold_holding_cap"));
  assertMatch(coldHolding.detail, /remain in the river/i);
});

Deno.test("December 23 completes migration primitives and requires the winter fishery read", () => {
  const daily = buildDailySnapshot({
    river: PERE_MARQUETTE_RIVER_PROFILE,
    run,
    localDate: "2026-12-23",
    conditionsEvidenceByDate: {},
    conditionsBaselines: [],
    engineVersion: "steelhead-test-engine",
    configVersion: "steelhead-test-config",
  });
  const refresh = buildConditionRefresh({
    dailySnapshot: daily,
    localDate: "2026-12-23",
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
    waterTempF: 38,
    sourceMetrics: {
      gauge: { primaryMetric: "flow_cfs", band: "ideal", trend: "stable" },
      weather: {},
    },
    engineVersion: "steelhead-test-engine",
    configVersion: "steelhead-test-config",
  });
  assertEquals(daily.runStage.label, "Winter holding");
  assertEquals(daily.fishInRiver.score, 70);
  assertEquals(refresh.push.label, "Winter holding");
  assertEquals(daily.conditionsSuggest.label, "Timing complete");
  assert(
    refresh.interpretationNote?.reasonCodes.includes(
      "winter_holding_read_required",
    ),
  );
});

Deno.test("PM Fall Steelhead has dedicated timing checkpoints and is public", () => {
  assertEquals(
    resolveConditionsSuggestCheckpoints(run, "2026-12-01").map((item) => [
      item.checkpointId,
      item.checkpointDate,
      item.cutoffDate,
      item.observationStartDate,
    ]),
    [
      ["river_start", "2026-09-20", "2026-09-19", "2026-09-01"],
      ["building_start", "2026-10-11", "2026-10-10", "2026-09-01"],
      ["building_established", "2026-10-15", "2026-10-14", "2026-09-01"],
      ["peak_start", "2026-11-15", "2026-11-14", "2026-09-01"],
      ["peak_complete", "2026-11-21", "2026-11-20", "2026-09-01"],
    ],
  );
  const catalog = listVisibleRiverRuns(
    [PERE_MARQUETTE_RIVER_PROFILE],
    PERE_MARQUETTE_CONFIGURATION_DOCUMENT.runs,
  );
  assertEquals(catalog[0].rivers[0].runs.map((item) => item.runId), [
    "pere_marquette_fall_chinook",
    "pere_marquette_fall_coho",
    "pere_marquette_fall_steelhead",
  ]);
});
