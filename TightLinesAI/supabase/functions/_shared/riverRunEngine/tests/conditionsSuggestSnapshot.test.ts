import { assert, assertEquals } from "jsr:@std/assert";
import {
  addDays,
  buildConditionRefresh,
  buildDailySnapshot,
  canonicalBaselineDay,
  type ConditionsSuggestCheckpoint,
  type ConditionsSuggestEvidence,
  type ConditionsSuggestEvidenceByDate,
  daysBetween,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  type PrimitiveDisplay,
  resolveConditionsSuggestCheckpoints,
  resolveDataQuality,
  resolveInterpretationNote,
  type RiverRunConditionsSuggestBaseline,
  type RiverRunDailySnapshot,
  scoreConditionsSuggest,
} from "../index.ts";

const run = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;
const river = PERE_MARQUETTE_RIVER_PROFILE;
const checkpoints = resolveConditionsSuggestCheckpoints(run, "2026-09-20");

function checkpoint(id: ConditionsSuggestCheckpoint["checkpointId"]) {
  return checkpoints.find((item) => item.checkpointId === id)!;
}

function baseline(
  target: ConditionsSuggestCheckpoint,
  overrides: Partial<RiverRunConditionsSuggestBaseline> = {},
): RiverRunConditionsSuggestBaseline {
  const expectedDays = daysBetween(
    target.observationStartDate,
    target.cutoffDate,
  ) + 1;
  return {
    riverId: river.riverId,
    runId: run.runId,
    checkpointId: target.checkpointId,
    referenceDayOfYear: canonicalBaselineDay(target.checkpointDate),
    observationStartDayOfYear: canonicalBaselineDay(
      target.observationStartDate,
    ),
    baselineVersion: run.conditionsSuggest.baselineVersion,
    gaugeMetric: "flow_cfs",
    gaugeSiteId: "04122500",
    temperatureSourceId: run.conditionsSuggest.temperatureSourceId,
    componentSamples: {
      gaugeAbsoluteRise: [0, 200, 400, 600, 800],
      gaugeRelativeRisePct: [0, 20, 40, 60, 80],
      meanWaterTempF: [50, 55, 60, 65, 70],
      waterCoolingF: [-5, 0, 5, 10, 15],
    },
    historicalSamples: [10, 30, 50, 70, 90].map((
      evidenceIndex,
      index,
    ) => ({
      year: 2021 + index,
      usableDays: expectedDays,
      gaugeAbsoluteRise: index * 200,
      gaugeRelativeRisePct: index * 20,
      meanWaterTempF: 70 - index * 5,
      waterCoolingF: -5 + index * 5,
      gaugeResponsePercentile: 10 + index * 20,
      waterTemperaturePercentile: 10 + index * 20,
      evidenceIndex,
    })),
    indexPercentiles: { p10: 18, p25: 30, p75: 70, p90: 82 },
    distinctYears: 5,
    expectedDays,
    minimumUsableDays: Math.ceil(
      expectedDays * run.conditionsSuggest.minimumCoveragePercent,
    ),
    sourceNotes: "Test cumulative checkpoint.",
    ...overrides,
  };
}

function allBaselines(): RiverRunConditionsSuggestBaseline[] {
  return checkpoints.map((item) => baseline(item));
}

function evidence(
  gaugeValue: number,
  waterTempF: number,
  overrides: Partial<ConditionsSuggestEvidence> = {},
): ConditionsSuggestEvidence {
  return {
    gaugeFreshness: "fresh",
    gaugeValue,
    gaugeMetric: "flow_cfs",
    gaugeSiteId: "04122500",
    waterTemperatureFreshness: "fresh",
    waterTempF,
    waterTemperatureSourceId: run.conditionsSuggest.temperatureSourceId,
    reasonCodes: ["gauge_fresh", "temperature_measured"],
    ...overrides,
  };
}

function cumulativeEvidence(
  target: ConditionsSuggestCheckpoint,
  kind: "ahead" | "typical" | "delayed" = "typical",
): ConditionsSuggestEvidenceByDate {
  const count = daysBetween(
    target.observationStartDate,
    target.cutoffDate,
  ) + 1;
  const result: ConditionsSuggestEvidenceByDate = {};
  for (let index = 0; index < count; index++) {
    const localDate = addDays(target.observationStartDate, index);
    const gaugeValue = kind === "ahead"
      ? 400 + index * 60
      : kind === "delayed"
      ? 500
      : 500 + index * 20;
    const waterTempF = kind === "ahead"
      ? 65 - index
      : kind === "delayed"
      ? 70
      : 64 - index * 0.4;
    result[localDate] = {
      "16:00": evidence(gaugeValue, waterTempF),
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

Deno.test("Conditions Suggest exposes five cumulative checkpoint dates", () => {
  assertEquals(
    checkpoints.map((item) => ({
      id: item.checkpointId,
      date: item.checkpointDate,
      cutoff: item.cutoffDate,
    })),
    [
      { id: "river_start", date: "2026-08-15", cutoff: "2026-08-14" },
      { id: "building_start", date: "2026-08-24", cutoff: "2026-08-23" },
      {
        id: "building_established",
        date: "2026-09-01",
        cutoff: "2026-08-31",
      },
      { id: "peak_start", date: "2026-09-15", cutoff: "2026-09-14" },
      { id: "peak_complete", date: "2026-09-26", cutoff: "2026-09-25" },
    ],
  );
});

Deno.test("Migration Timing stays plain and conservative before its first read", () => {
  const beforeStaging = scoreConditionsSuggest({
    localDate: "2026-07-20",
    run,
    evidenceByDate: {},
    baselines: [],
  });
  const duringStaging = scoreConditionsSuggest({
    localDate: "2026-08-01",
    run,
    evidenceByDate: {},
    baselines: [],
  });

  assertEquals(beforeStaging.label, "Not monitoring yet");
  assert(beforeStaging.detail.includes("monitoring resumes in late July"));
  assert(beforeStaging.reasonCodes.includes("conditions_monitoring_inactive"));
  assertEquals(beforeStaging.detail.includes("July 28, 2026"), false);
  assertEquals(duringStaging.label, "Evaluating");
  assert(duringStaging.headline.includes("still taking shape"));
  assert(duringStaging.tip.includes("section named by Migration Stage"));
  assertEquals(duringStaging.nextCheckpointDate, "2026-08-15");
});

Deno.test("river-start checkpoint uses every completed date from staging", () => {
  const target = checkpoint("river_start");
  const result = scoreConditionsSuggest({
    localDate: target.checkpointDate,
    run,
    evidenceByDate: cumulativeEvidence(target, "ahead"),
    baselines: [baseline(target)],
  });

  assertEquals(result.label, "Ahead");
  assertEquals(result.checkpointId, "river_start");
  assertEquals(result.sourceDates[0], "2026-07-28");
  assertEquals(result.sourceDates.at(-1), "2026-08-14");
  assertEquals(result.sourceDates.length, 18);
  assertEquals(result.sourceDates.includes(target.checkpointDate), false);
});

Deno.test("Migration Timing accepts every configured PM condition slot", () => {
  const target = checkpoint("river_start");
  const evidenceByDate = cumulativeEvidence(target, "ahead");
  for (const localDate of Object.keys(evidenceByDate)) {
    const base = evidenceByDate[localDate]["16:00"]!;
    evidenceByDate[localDate] = Object.fromEntries(
      river.conditionRefreshSchedule.activeSlots.map((slot) => [
        slot,
        { ...base },
      ]),
    );
  }
  const result = scoreConditionsSuggest({
    localDate: target.checkpointDate,
    run,
    evidenceByDate,
    baselines: [baseline(target)],
  });

  assertEquals(result.label, "Ahead");
  assertEquals(result.sourceRefreshSlots[target.cutoffDate], "21:00");
});

Deno.test("checkpoint verdict cannot drift between checkpoint dates", () => {
  const target = checkpoint("river_start");
  const evidenceByDate = cumulativeEvidence(target, "ahead");
  const onCheckpoint = scoreConditionsSuggest({
    localDate: "2026-08-15",
    run,
    evidenceByDate,
    baselines: [baseline(target)],
  });
  const threeDaysLater = scoreConditionsSuggest({
    localDate: "2026-08-18",
    run,
    evidenceByDate: {
      ...evidenceByDate,
      "2026-08-17": { "16:00": evidence(1, 90) },
    },
    baselines: [baseline(target)],
  });

  assertEquals(threeDaysLater, onCheckpoint);
});

Deno.test("later checkpoints retain the full cumulative staging history", () => {
  const target = checkpoint("peak_start");
  const result = scoreConditionsSuggest({
    localDate: target.checkpointDate,
    run,
    evidenceByDate: cumulativeEvidence(target, "typical"),
    baselines: allBaselines(),
  });

  assertEquals(result.checkpointId, "peak_start");
  assertEquals(result.sourceDates[0], "2026-07-28");
  assertEquals(result.sourceDates.at(-1), "2026-09-14");
  assertEquals(result.sourceDates.length, 49);
  assertEquals(result.completedCheckpointCount, 4);
  assertEquals(result.previousCheckpointId, "building_established");
  assertEquals(result.previousCheckpointDate, "2026-09-01");
  assertEquals(result.previousTimingLabel, "Ahead");
});

Deno.test("direct Ahead to Delayed checkpoint reversal resolves to Typical", () => {
  const first = checkpoint("river_start");
  const second = checkpoint("building_start");
  const evidenceByDate = cumulativeEvidence(second, "ahead");
  const delayedSecondBaseline = baseline(second, {
    componentSamples: {
      gaugeAbsoluteRise: [2_000, 2_500, 3_000, 3_500, 4_000],
      gaugeRelativeRisePct: [200, 250, 300, 350, 400],
      meanWaterTempF: [30, 35, 40, 45, 50],
      waterCoolingF: [30, 35, 40, 45, 50],
    },
    historicalSamples: [10, 30, 50, 70, 90].map((evidenceIndex, index) => ({
      year: 2021 + index,
      usableDays: 27,
      gaugeAbsoluteRise: 2_000 + index * 500,
      gaugeRelativeRisePct: 200 + index * 50,
      meanWaterTempF: 50 - index * 5,
      waterCoolingF: 30 + index * 5,
      gaugeResponsePercentile: 10 + index * 20,
      waterTemperaturePercentile: 10 + index * 20,
      evidenceIndex,
    })),
  });
  const result = scoreConditionsSuggest({
    localDate: second.checkpointDate,
    run,
    evidenceByDate,
    baselines: [baseline(first), delayedSecondBaseline],
  });

  assertEquals(result.candidateLabel, "Delayed");
  assertEquals(result.label, "Typical");
  assertEquals(result.previousCheckpointId, "river_start");
  assertEquals(result.previousCheckpointDate, "2026-08-15");
  assertEquals(result.previousTimingLabel, "Ahead");
  assert(
    result.reasonCodes.includes("conditions_checkpoint_reversal_tempered"),
  );
  assert(result.detail.includes("season-long pattern"));
  assert(result.tip.includes("section named by Migration Stage"));
  assert(result.tip.includes("reversal alone"));
});

Deno.test("peak completion locks timing and switches to underway copy", () => {
  const target = checkpoint("peak_complete");
  const result = scoreConditionsSuggest({
    localDate: target.checkpointDate,
    run,
    evidenceByDate: cumulativeEvidence(target, "ahead"),
    baselines: allBaselines(),
  });

  assertEquals(result.label, "Timing complete");
  assertEquals(result.timingLabel, "Ahead");
  assertEquals(result.checkpointId, "peak_complete");
  assert(result.headline.includes("timing read is complete"));
  assert(result.detail.includes("current movement and river conditions"));
  assert(result.reasonCodes.includes("conditions_timing_complete"));
});

Deno.test("Conditions Suggest follows the main run end rather than the historical presence tail", () => {
  const target = checkpoint("peak_complete");
  const result = scoreConditionsSuggest({
    localDate: "2026-10-28",
    run,
    evidenceByDate: cumulativeEvidence(target, "ahead"),
    baselines: allBaselines(),
  });

  assertEquals(result.label, "Timing complete");
  assert(result.headline.includes("Migration Timing read is complete"));
  assert(result.tip.includes("remaining established holding water"));
  assertEquals(result.headline.includes("well underway"), false);
});

Deno.test("missing checkpoint cutoff gauge or temperature fails closed", () => {
  const target = checkpoint("river_start");
  const missingGauge = cumulativeEvidence(target, "ahead");
  missingGauge[target.cutoffDate] = {
    "16:00": evidence(760, 54, { gaugeFreshness: "missing" }),
  };
  const missingTemperature = cumulativeEvidence(target, "ahead");
  missingTemperature[target.cutoffDate] = {
    "16:00": evidence(760, 54, {
      waterTemperatureFreshness: "missing",
    }),
  };

  const gaugeResult = scoreConditionsSuggest({
    localDate: target.checkpointDate,
    run,
    evidenceByDate: missingGauge,
    baselines: [baseline(target)],
  });
  const temperatureResult = scoreConditionsSuggest({
    localDate: target.checkpointDate,
    run,
    evidenceByDate: missingTemperature,
    baselines: [baseline(target)],
  });

  assertEquals(gaugeResult.label, "Insufficient evidence");
  assert(
    gaugeResult.reasonCodes.includes("conditions_missing_checkpoint_gauge"),
  );
  assertEquals(temperatureResult.label, "Insufficient evidence");
  assert(
    temperatureResult.reasonCodes.includes(
      "conditions_missing_checkpoint_temperature",
    ),
  );
});

Deno.test("cumulative coverage and exact source provenance fail closed", () => {
  const target = checkpoint("river_start");
  const sparse = cumulativeEvidence(target, "typical");
  for (const date of Object.keys(sparse).slice(0, 5)) delete sparse[date];
  const wrongSource = cumulativeEvidence(target, "typical");
  wrongSource[target.cutoffDate]!["16:00"] = evidence(600, 58, {
    waterTemperatureSourceId: "pm_bowman_temperature",
  });

  const sparseResult = scoreConditionsSuggest({
    localDate: target.checkpointDate,
    run,
    evidenceByDate: sparse,
    baselines: [baseline(target)],
  });
  const sourceResult = scoreConditionsSuggest({
    localDate: target.checkpointDate,
    run,
    evidenceByDate: wrongSource,
    baselines: [baseline(target)],
  });

  assertEquals(sparseResult.label, "Insufficient evidence");
  assert(sparseResult.reasonCodes.includes("conditions_limited_source_days"));
  assertEquals(sourceResult.label, "Insufficient evidence");
  assert(sourceResult.reasonCodes.includes("conditions_source_mismatch"));
});

Deno.test("cool-enough plateau prevents indefinitely rewarding lower means", () => {
  const target = checkpoint("river_start");
  const cooler = cumulativeEvidence(target, "typical");
  const coldest = cumulativeEvidence(target, "typical");
  Object.keys(cooler).forEach((date) => {
    cooler[date]!["16:00"]!.waterTempF = 45;
    coldest[date]!["16:00"]!.waterTempF = 35;
  });
  const coolerResult = scoreConditionsSuggest({
    localDate: target.checkpointDate,
    run,
    evidenceByDate: cooler,
    baselines: [baseline(target)],
  });
  const coldestResult = scoreConditionsSuggest({
    localDate: target.checkpointDate,
    run,
    evidenceByDate: coldest,
    baselines: [baseline(target)],
  });

  assertEquals(
    coolerResult.waterTemperaturePercentile,
    coldestResult.waterTemperaturePercentile,
  );
});

Deno.test("Migration Timing rewards an earlier drop toward 62F independently of Push bands", () => {
  const target = checkpoint("river_start");
  const slowerCooling = cumulativeEvidence(target, "typical");
  const fasterCooling = cumulativeEvidence(target, "typical");
  const dates = Object.keys(fasterCooling).toSorted();

  dates.forEach((date, index) => {
    const progress = dates.length === 1 ? 1 : index / (dates.length - 1);
    slowerCooling[date]!["16:00"]!.waterTempF = 70 - progress * 4;
    fasterCooling[date]!["16:00"]!.waterTempF = 70 - progress * 8;
  });

  const slowerResult = scoreConditionsSuggest({
    localDate: target.checkpointDate,
    run,
    evidenceByDate: slowerCooling,
    baselines: [baseline(target)],
  });
  const fasterResult = scoreConditionsSuggest({
    localDate: target.checkpointDate,
    run,
    evidenceByDate: fasterCooling,
    baselines: [baseline(target)],
  });

  assertEquals(fasterCooling[dates.at(-1)!]!["16:00"]!.waterTempF, 62);
  assert(
    fasterResult.waterTemperaturePercentile! >
      slowerResult.waterTemperaturePercentile!,
  );
  assertEquals(run.push.temperature.tooWarmF, 68);
});

Deno.test("DataQuality and interpretation remain dimension-specific", () => {
  assertEquals(
    resolveDataQuality({
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      temperatureSourceType: "same_gauge",
      conditionsSuggestDaysUsable: 18,
      conditionsSuggestExpectedDays: 18,
    }).label,
    "Fresh",
  );
  const limited = resolveDataQuality({
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    temperatureSourceType: "same_gauge",
    conditionsSuggestDaysUsable: 3,
    conditionsSuggestExpectedDays: 18,
    conditionsSuggestInsufficient: true,
  });
  assertEquals(limited.label, "Limited");
  assertEquals(
    resolveDataQuality({
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      temperatureSourceType: "same_gauge",
      conditionsSuggestDaysUsable: 0,
      conditionsSuggestExpectedDays: 0,
    }).label,
    "Fresh",
  );
  const upstreamFallback = resolveDataQuality({
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    temperatureSourceType: "nearby_gauge",
    temperatureIsUpstreamFallback: true,
    conditionsSuggestDaysUsable: 18,
    conditionsSuggestExpectedDays: 18,
  });
  assertEquals(upstreamFallback.label, "Partial");
  assert(
    upstreamFallback.reasonCodes.includes("temperature_upstream_fallback"),
  );
  assertEquals(
    new Set(
      resolveInterpretationNote({
        runStage: "beginning",
        conditionsSuggestLabel: "Ahead",
        push: display(60),
        fishability: display(70),
        fishInRiver: display(30),
      })?.reasonCodes,
    ),
    new Set([
      "beginning_ahead_conditions",
      "good_fishability_low_presence",
    ]),
  );
});

Deno.test("buildDailySnapshot uses cumulative baselines and excludes current primitives", () => {
  const target = checkpoint("river_start");
  const snapshot = buildDailySnapshot({
    river,
    run,
    localDate: target.checkpointDate,
    conditionsEvidenceByDate: cumulativeEvidence(target, "ahead"),
    conditionsBaselines: [baseline(target)],
    engineVersion: "test-engine",
    configVersion: "test-config",
  });

  assertEquals(snapshot.conditionsSuggest.label, "Ahead");
  assertEquals("push" in snapshot, false);
  assertEquals("fishability" in snapshot, false);
});

Deno.test("condition refresh preserves locked daily primitives", () => {
  const target = checkpoint("river_start");
  const dailySnapshot = buildDailySnapshot({
    river,
    run,
    localDate: target.checkpointDate,
    conditionsEvidenceByDate: cumulativeEvidence(target, "ahead"),
    conditionsBaselines: [baseline(target)],
    engineVersion: "test-engine",
    configVersion: "test-config",
  }) as RiverRunDailySnapshot;
  const refreshResult = buildConditionRefresh({
    dailySnapshot,
    localDate: target.checkpointDate,
    refreshSlot: "16:00",
    movementEngineId: "fall_cooling",
    pushRules: run.push,
    fishabilityBands: run.fishabilityBands,
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    waterTemperatureFreshness: "fresh",
    flowBand: "ideal",
    currentHydraulicValue: 650,
    hydraulicAbsoluteChange24h: 50,
    hydraulicPercentChange24h: 8,
    rainSignal: "heavy_rain",
    flowSignal: "meaningful_rise",
    temperatureSignal: "strong_cooling",
    temperatureSourceType: "same_gauge",
    waterTempF: 60,
    sourceMetrics: {
      gauge: {
        primaryMetric: "flow_cfs",
        band: "ideal",
        trend: "meaningful_rise",
      },
      weather: {},
    },
    engineVersion: "test-engine",
    configVersion: "test-config",
  });

  assertEquals(refreshResult.conditionsSuggest.label, "Ahead");
  assertEquals(refreshResult.conditionsSuggest.checkpointId, "river_start");
});
