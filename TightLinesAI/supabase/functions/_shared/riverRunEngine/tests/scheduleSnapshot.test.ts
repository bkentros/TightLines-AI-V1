import { assert, assertEquals } from "jsr:@std/assert";
import {
  addDays,
  buildConditionRefresh,
  buildDailySnapshot,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  type PrimitiveDisplay,
  resolveDataQuality,
  resolveInterpretationNote,
  resolveRunStage,
  type RiverRunDailySnapshot,
  type ScheduleRefreshesByDate,
  type ScheduleSourceRefresh,
  scoreSchedule,
} from "../index.ts";

const run = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;
const river = PERE_MARQUETTE_RIVER_PROFILE;

function refresh(
  favorabilityIndex: number,
  overrides: Partial<ScheduleSourceRefresh> = {},
): ScheduleSourceRefresh {
  return {
    favorabilityIndex,
    gaugeFreshness: "fresh",
    missingNonGaugeInputCount: 0,
    reasonCodes: ["gauge_fresh"],
    ...overrides,
  };
}

function weekRefreshes(
  localDate: string,
  favorabilityIndex: number,
): ScheduleRefreshesByDate {
  const result: ScheduleRefreshesByDate = {};
  for (let offset = -7; offset <= -1; offset++) {
    result[addDays(localDate, offset)] = {
      "16:00": refresh(favorabilityIndex),
    };
  }
  return result;
}

function display(score: number, label = "Fixture"): PrimitiveDisplay {
  return {
    score,
    label,
    headline: "Fixture",
    detail: "Fixture",
    tip: "Fixture",
    reasonCodes: [],
  };
}

Deno.test("Schedule uses last 7 completed dates ending yesterday, not today", () => {
  const localDate = "2026-09-10";
  const stage = resolveRunStage(run, localDate);
  const refreshes = weekRefreshes(localDate, 1.5);
  refreshes[localDate] = { "16:00": refresh(-6) };

  const schedule = scoreSchedule({
    localDate,
    stage: stage.stage,
    window: stage.window,
    refreshesByDate: refreshes,
  });

  assertEquals(schedule.sourceDates[0], "2026-09-03");
  assertEquals(schedule.sourceDates[6], "2026-09-09");
  assertEquals(schedule.sourceDates.includes(localDate), false);
  assert(schedule.progressionIndex !== null && schedule.progressionIndex > 1);
});

Deno.test("Schedule source slot preference is 16:00 then 08:00 then 00:00", () => {
  const localDate = "2026-09-10";
  const stage = resolveRunStage(run, localDate);
  const refreshes = weekRefreshes(localDate, 0);
  refreshes["2026-09-09"] = {
    "00:00": refresh(-6),
    "08:00": refresh(0),
    "16:00": refresh(6),
  };

  const schedule = scoreSchedule({
    localDate,
    stage: stage.stage,
    window: stage.window,
    refreshesByDate: refreshes,
  });

  assertEquals(schedule.sourceRefreshSlots["2026-09-09"], "16:00");
  assert(schedule.progressionIndex !== null && schedule.progressionIndex > 1);
});

Deno.test("fewer than 4 usable schedule days returns Uncertain", () => {
  const localDate = "2026-09-10";
  const stage = resolveRunStage(run, localDate);
  const refreshes: ScheduleRefreshesByDate = {
    [addDays(localDate, -1)]: { "16:00": refresh(6) },
    [addDays(localDate, -2)]: { "16:00": refresh(6) },
    [addDays(localDate, -3)]: { "16:00": refresh(6) },
  };

  const schedule = scoreSchedule({
    localDate,
    stage: stage.stage,
    window: stage.window,
    refreshesByDate: refreshes,
  });

  assertEquals(schedule.label, "Uncertain");
  assert(schedule.reasonCodes.includes("schedule_limited_source_days"));
});

Deno.test("missing yesterday gauge returns Uncertain", () => {
  const localDate = "2026-09-10";
  const stage = resolveRunStage(run, localDate);
  const refreshes = weekRefreshes(localDate, 6);
  refreshes[addDays(localDate, -1)] = {
    "16:00": refresh(6, { gaugeFreshness: "missing" }),
  };

  const schedule = scoreSchedule({
    localDate,
    stage: stage.stage,
    window: stage.window,
    refreshesByDate: refreshes,
  });

  assertEquals(schedule.label, "Uncertain");
  assert(schedule.reasonCodes.includes("schedule_missing_yesterday_gauge"));
});

Deno.test("older-than-24h yesterday gauge returns Uncertain", () => {
  const localDate = "2026-09-10";
  const stage = resolveRunStage(run, localDate);
  const refreshes = weekRefreshes(localDate, 6);
  refreshes[addDays(localDate, -1)] = {
    "16:00": refresh(6, { gaugeFreshness: "older_than_24h" }),
  };

  const schedule = scoreSchedule({
    localDate,
    stage: stage.stage,
    window: stage.window,
    refreshesByDate: refreshes,
  });

  assertEquals(schedule.label, "Uncertain");
  assert(schedule.reasonCodes.includes("schedule_missing_yesterday_gauge"));
});

Deno.test("pre-run inside early window plus strongly favorable week returns Ahead", () => {
  const localDate = "2026-08-15";
  const stage = resolveRunStage(run, localDate);
  const schedule = scoreSchedule({
    localDate,
    stage: stage.stage,
    window: stage.window,
    refreshesByDate: weekRefreshes(localDate, 6),
  });

  assertEquals(schedule.label, "Ahead");
});

Deno.test("beginning/building plus unfavorable week returns Behind", () => {
  const localDate = "2026-09-10";
  const stage = resolveRunStage(run, localDate);
  const schedule = scoreSchedule({
    localDate,
    stage: stage.stage,
    window: stage.window,
    refreshesByDate: weekRefreshes(localDate, -2),
  });

  assertEquals(schedule.label, "Behind");
});

Deno.test("peak plus neutral week returns On schedule", () => {
  const localDate = "2026-09-20";
  const stage = resolveRunStage(run, localDate);
  const schedule = scoreSchedule({
    localDate,
    stage: stage.stage,
    window: stage.window,
    refreshesByDate: weekRefreshes(localDate, 0),
  });

  assertEquals(schedule.label, "On schedule");
});

Deno.test("smoothing keeps previous when threshold movement is too small", () => {
  const localDate = "2026-09-10";
  const stage = resolveRunStage(run, localDate);
  const schedule = scoreSchedule({
    localDate,
    stage: stage.stage,
    window: stage.window,
    refreshesByDate: weekRefreshes(localDate, -0.8),
    previousSchedule: {
      label: "Behind",
      progressionIndex: -1,
      consecutiveCandidateCount: 1,
    },
  });

  assertEquals(schedule.candidateLabel, "On schedule");
  assertEquals(schedule.label, "Behind");
});

Deno.test("smoothing requires threshold margin or sustained candidate", () => {
  const localDate = "2026-09-10";
  const stage = resolveRunStage(run, localDate);
  const belowMargin = scoreSchedule({
    localDate,
    stage: stage.stage,
    window: stage.window,
    refreshesByDate: weekRefreshes(localDate, -0.8),
    previousSchedule: {
      label: "Behind",
      progressionIndex: -2,
      consecutiveCandidateCount: 1,
    },
  });
  const sustained = scoreSchedule({
    localDate,
    stage: stage.stage,
    window: stage.window,
    refreshesByDate: weekRefreshes(localDate, -0.8),
    previousSchedule: {
      label: "Behind",
      progressionIndex: -2,
      consecutiveCandidateCount: 2,
    },
  });

  assertEquals(belowMargin.candidateLabel, "On schedule");
  assertEquals(belowMargin.label, "Behind");
  assertEquals(sustained.label, "On schedule");
});

Deno.test("DataQuality returns Fresh, Partial, Stale, and Limited labels", () => {
  assertEquals(
    resolveDataQuality({
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      temperatureSourceType: "same_gauge",
      scheduleDaysUsable: 7,
    }).label,
    "Fresh",
  );
  assertEquals(
    resolveDataQuality({
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      temperatureSourceType: "air_temp_proxy",
      scheduleDaysUsable: 7,
    }).label,
    "Partial",
  );
  assertEquals(
    resolveDataQuality({
      gaugeFreshness: "stale",
      weatherFreshness: "fresh",
      temperatureSourceType: "same_gauge",
      scheduleDaysUsable: 7,
    }).label,
    "Stale",
  );
  assertEquals(
    resolveDataQuality({
      gaugeFreshness: "missing",
      weatherFreshness: "fresh",
      temperatureSourceType: "same_gauge",
      scheduleDaysUsable: 7,
      hasUnavailableCurrentPrimitive: true,
    }).label,
    "Limited",
  );
});

Deno.test("Interpretation note appears for required disagreement cases", () => {
  assertEquals(
    resolveInterpretationNote({
      runStage: "building",
      scheduleLabel: "On schedule",
      push: display(80),
      fishability: display(40),
      fishInRiver: display(70),
    })?.reasonCodes,
    ["strong_push_low_fishability"],
  );
  assertEquals(
    resolveInterpretationNote({
      runStage: "pre_run",
      scheduleLabel: "Ahead",
      push: display(60),
      fishability: display(70),
      fishInRiver: display(30),
    })?.reasonCodes,
    ["pre_run_ahead_schedule"],
  );
  assertEquals(
    resolveInterpretationNote({
      runStage: "peak",
      scheduleLabel: "On schedule",
      push: display(35),
      fishability: display(70),
      fishInRiver: display(95),
    })?.reasonCodes,
    ["peak_presence_weak_push"],
  );
  assertEquals(
    resolveInterpretationNote({
      runStage: "beginning",
      scheduleLabel: "On schedule",
      push: display(55),
      fishability: display(75),
      fishInRiver: display(25),
    })?.reasonCodes,
    ["good_fishability_low_presence"],
  );
  assertEquals(
    resolveInterpretationNote({
      runStage: "building",
      scheduleLabel: "Behind",
      push: display(80),
      fishability: display(70),
      fishInRiver: display(60),
    })?.reasonCodes,
    ["behind_schedule_strong_push"],
  );
});

Deno.test("Interpretation note is omitted for straightforward aligned primitives", () => {
  assertEquals(
    resolveInterpretationNote({
      runStage: "building",
      scheduleLabel: "On schedule",
      push: display(65),
      fishability: display(75),
      fishInRiver: display(65),
    }),
    undefined,
  );
});

Deno.test("buildDailySnapshot does not include Push or Fishability", () => {
  const snapshot = buildDailySnapshot({
    river,
    run,
    localDate: "2026-09-20",
    scheduleRefreshesByDate: weekRefreshes("2026-09-20", 0),
    engineVersion: "test-engine",
    configVersion: "test-config",
  });

  assertEquals("push" in snapshot, false);
  assertEquals("fishability" in snapshot, false);
});

Deno.test("buildConditionRefresh does not recalculate daily Run Stage/Schedule/Fish In River", () => {
  const dailySnapshot = buildDailySnapshot({
    river,
    run,
    localDate: "2026-09-20",
    scheduleRefreshesByDate: weekRefreshes("2026-09-20", 0),
    engineVersion: "test-engine",
    configVersion: "test-config",
  }) as RiverRunDailySnapshot;
  dailySnapshot.runStage = {
    ...dailySnapshot.runStage,
    stage: "pre_run",
    label: "Pre-run",
  };
  dailySnapshot.schedule = { ...dailySnapshot.schedule, label: "Ahead" };
  dailySnapshot.fishInRiver = {
    ...dailySnapshot.fishInRiver,
    score: 5,
    label: "Very unlikely",
  };

  const refreshResult = buildConditionRefresh({
    dailySnapshot,
    localDate: "2026-09-20",
    refreshSlot: "16:00",
    behaviorProfile: "fall_cooling_rain_pulse",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    rainSignal: "heavy_rain",
    flowSignal: "meaningful_rise",
    temperatureSignal: "strong_cooling",
    temperatureSourceType: "same_gauge",
    sourceMetrics: {
      gauge: {
        primaryMetric: "flow_cfs",
        band: "ideal",
        trend: "meaningful_rise",
      },
      weather: {
        temperatureSource: "same_gauge",
        temperatureTrend: "strong_cooling",
      },
    },
    engineVersion: "test-engine",
    configVersion: "test-config",
  });

  assertEquals(refreshResult.runStage.stage, "pre_run");
  assertEquals(refreshResult.schedule.label, "Ahead");
  assertEquals(refreshResult.fishInRiver.score, 5);
});

Deno.test("reason codes are deduplicated in daily snapshot and condition refresh outputs", () => {
  const dailySnapshot = buildDailySnapshot({
    river,
    run,
    localDate: "2026-09-20",
    scheduleRefreshesByDate: weekRefreshes("2026-09-20", 0),
    engineVersion: "test-engine",
    configVersion: "test-config",
  });
  const refreshResult = buildConditionRefresh({
    dailySnapshot,
    localDate: "2026-09-20",
    refreshSlot: "16:00",
    behaviorProfile: "fall_cooling_rain_pulse",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    rainSignal: "heavy_rain",
    flowSignal: "meaningful_rise",
    temperatureSignal: "strong_cooling",
    temperatureSourceType: "same_gauge",
    rainReasonCodes: ["heavy_rain_48h", "heavy_rain_48h"],
    flowReasonCodes: ["flow_meaningful_rise_24h", "ideal_flow_band"],
    temperatureReasonCodes: [
      "temperature_measured",
      "temperature_strong_cooling",
    ],
    sourceMetrics: {
      gauge: {
        primaryMetric: "flow_cfs",
        band: "ideal",
        trend: "meaningful_rise",
      },
      weather: {
        temperatureSource: "same_gauge",
        temperatureTrend: "strong_cooling",
      },
    },
    engineVersion: "test-engine",
    configVersion: "test-config",
  });

  assertEquals(
    dailySnapshot.reasonCodes.length,
    new Set(dailySnapshot.reasonCodes).size,
  );
  assertEquals(
    refreshResult.reasonCodes.length,
    new Set(refreshResult.reasonCodes).size,
  );
  assert(refreshResult.push.reasonCodes.includes("heavy_rain_48h"));
  assert(refreshResult.push.reasonCodes.includes("flow_meaningful_rise_24h"));
  assert(refreshResult.push.reasonCodes.includes("temperature_strong_cooling"));
  assert(refreshResult.fishability.reasonCodes.includes("heavy_rain_48h"));
});
