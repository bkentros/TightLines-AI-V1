import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  buildConditionRefresh,
  buildDailySnapshot,
  listVisibleRiverRuns,
  resolveFlowBand,
  resolveRunStage,
  scoreActivity,
  scoreFishInRiver,
  scorePush,
  ST_JOSEPH_CONFIGURATION_DOCUMENT,
  ST_JOSEPH_FALL_CHINOOK_RUN_PROFILE as run,
  ST_JOSEPH_FALL_STEELHEAD_RUN_PROFILE as steelhead,
  ST_JOSEPH_RIVER_PROFILE as river,
  validateConfigurationRevision,
  validateRunProfile,
} from "../index.ts";

Deno.test("St. Joseph Fall Chinook validates with calibrated Niles Activity", () => {
  assertEquals(validateRunProfile(run, river).valid, true);
  assertEquals(validateRunProfile(run, river).publicVisible, true);
  assertEquals(
    validateConfigurationRevision({
      configKey: "st_joseph",
      revision: 1,
      status: "draft",
      document: ST_JOSEPH_CONFIGURATION_DOCUMENT,
      evidenceNotes: "St. Joseph Chinook five-primitives research build.",
    }),
    [],
  );
  assertEquals(run.primitiveCapabilities.migrationTiming.status, "available");
  assertEquals(run.primitiveCapabilities.push.status, "available");
  assertEquals(run.primitiveCapabilities.fishability.status, "available");
  assertEquals(run.primitiveCapabilities.activity, { status: "available" });
  assertEquals(run.activity?.version, "st-joseph-fall-chinook-activity-v1");
  assertEquals(
    listVisibleRiverRuns([river], [run]).map((entry) => entry.state),
    ["MI", "IN"],
  );
});

Deno.test("St. Joseph Chinook is a 3/10 sectional late-August-November run", () => {
  assertEquals(run.historicalPresence.maximum, 3);
  assertEquals(run.historicalPresence.distributionScope, "sectional");
  assertEquals(scoreFishInRiver(run, "2026-08-31").score, 0);
  assertEquals(scoreFishInRiver(run, "2026-09-01").score, 3);
  assertEquals(scoreFishInRiver(run, "2026-09-25").score, 30);
  assertEquals(scoreFishInRiver(run, "2026-11-08").score, 0);
});

Deno.test("St. Joseph Chinook copy stays selective across three approved sections", () => {
  const staging = resolveRunStage(run, "2026-08-18");
  assertMatch(staging.whereToStart ?? "", /harbor/i);
  const beginning = resolveRunStage(run, "2026-09-03");
  assertMatch(beginning.whereToStart ?? "", /Berrien Springs/i);
  const peak = resolveRunStage(run, "2026-09-25");
  assertMatch(
    peak.whereToStart ?? "",
    /Middle river \(Berrien Springs–Niles\)/i,
  );
  assertMatch(peak.whereToStart ?? "", /Niles/i);
  assertMatch(peak.whereToStart ?? "", /Upper river/i);
  assertMatch(peak.whereToStart ?? "", /Twin Branch/i);
  for (
    const date of [
      "2026-08-18",
      "2026-09-03",
      "2026-09-25",
      "2026-10-15",
      "2026-11-05",
    ]
  ) {
    const copy = JSON.stringify(resolveRunStage(run, date));
    assertEquals(
      /Tippy|Wellston|Croton|Newaygo|Scottville|Pere Marquette|Homestead/i.test(
        copy,
      ),
      false,
      date,
    );
    assertEquals(/above Twin Branch/i.test(copy), false, date);
  }
});

Deno.test("St. Joseph Chinook shares Niles hydraulics and owns Chinook migration temperature", () => {
  assertEquals(run.fishabilityBands, steelhead.fishabilityBands);
  assertEquals(run.push.hydraulic, steelhead.push.hydraulic);
  assertEquals(run.push.rain, steelhead.push.rain);
  assertEquals(run.push.temperature, {
    suitabilityLabel: "St. Joseph adult fall Chinook migration",
    coldHoldingF: 43,
    supportiveMinF: 45,
    preferredMinF: 50,
    supportiveMaxF: 64,
    tooWarmF: 68,
    migrationBarrierF: 72,
  });
  assertEquals(
    resolveFlowBand({
      metric: "flow_cfs",
      value: 2400,
      fishabilityBands: run.fishabilityBands,
    })?.band,
    "ideal",
  );

  const base = {
    movementEngineId: run.movementEngineId,
    rules: run.push,
    gaugeFreshness: "fresh" as const,
    currentHydraulicValue: 2400,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    rainSignal: "heavy_rain" as const,
    temperatureSignal: "cooling" as const,
    temperatureSourceType: "same_gauge" as const,
    waterTempF: 60,
    trackingState: "active" as const,
    trackingStartDate: "2026-09-01",
    trackingEndDate: "2026-11-01",
    localDate: "2026-09-20",
  };
  assert(
    !["Strong", "Very strong"].includes(
      scorePush({ ...base, flowSignal: "stable" as const }).label,
    ),
  );
  const hot = scorePush({
    ...base,
    flowSignal: "sharp_rise" as const,
    hydraulicAbsoluteChange24h: 450,
    hydraulicPercentChange24h: 19,
    waterTempF: 72,
  });
  assert((hot.score ?? 100) <= 49);
});

Deno.test("St. Joseph Chinook Migration Timing is Niles-bound and dedicated", () => {
  assertEquals(
    run.conditionsSuggest.baselineVersion,
    "st-joseph-fall-chinook-conditions-v1",
  );
  assertEquals(
    run.conditionsSuggest.temperatureSourceId,
    "st_joseph_niles_temperature",
  );
  assertEquals(run.conditionsSuggest.gaugeWeight, .55);
  assertEquals(run.conditionsSuggest.waterTemperatureWeight, .45);
  assertEquals(run.baselineCoverage.minimumHistoryYears, 13);
});

Deno.test("St. Joseph Chinook Activity is Niles-specific and continuously tapers", () => {
  assertEquals(run.activity?.profile, "chinook_fall_reaction");
  assertEquals(run.activity?.weights, {
    light: .6,
    waterTemperature: .15,
    riverBehavior: .15,
    weather: .1,
  });
  assertEquals(run.activity?.temperature, {
    coldF: 43,
    preferredMinF: 48,
    preferredMaxF: 62,
    warmF: 72,
    barrierF: 76,
  });
  const peak = activityAt("2026-10-05", "peak");
  const taperMid = activityAt("2026-10-12", "tapering");
  const taperEnd = activityAt("2026-10-20", "tapering");
  const ending = activityAt("2026-11-01", "ending");
  assert(
    peak.blocks.every((block, index) =>
      block.score >= taperMid.blocks[index].score
    ),
  );
  assert(
    taperMid.blocks.every((block, index) =>
      block.score >= taperEnd.blocks[index].score
    ),
  );
  assert(ending.blocks.every((block) => block.score <= 49));
  const copy = JSON.stringify(taperMid);
  assertMatch(copy, /Niles/i);
  assertMatch(copy, /South Bend/i);
  assertEquals(
    /Tippy|Wellston|Croton|Scottville|Pere Marquette/i.test(copy),
    false,
  );
});

Deno.test("St. Joseph Chinook monitors staging before run-present Activity", () => {
  const stage = resolveRunStage(run, "2026-08-20");
  assertEquals(stage.stage, "pre_run");
  assertEquals(stage.stagingContext, true);
  const staging = activityAt("2026-08-20", "pre_run", "stable", true);
  assertEquals(staging.conditionalPresence, true);
  assertMatch(staging.detail, /Dependable river presence has not begun/i);
  assertMatch(staging.detail, /sparse early Chinook/i);
  assertMatch(staging.detail, /sectional/i);
  const beginning = activityAt("2026-09-01", "beginning");
  assertEquals(beginning.conditionalPresence, false);
});

Deno.test("St. Joseph Chinook Activity does not duplicate Push movement", () => {
  const stable = activityAt("2026-09-25", "peak", "stable");
  const sharp = activityAt("2026-09-25", "peak", "sharp_rise");
  assert(
    sharp.blocks.every((block, index) =>
      block.score <= stable.blocks[index].score
    ),
  );
  assertEquals(JSON.stringify(sharp).includes("fresh movement"), false);
});

Deno.test("St. Joseph Chinook snapshot keeps Activity explicit when inputs are missing", () => {
  const daily = buildDailySnapshot({
    river,
    run,
    localDate: "2026-09-25",
    conditionsEvidenceByDate: {},
    conditionsBaselines: [],
    engineVersion: "test",
    configVersion: "test",
  });
  const condition = buildConditionRefresh({
    dailySnapshot: daily,
    localDate: "2026-09-25",
    refreshSlot: "08:00",
    movementEngineId: run.movementEngineId,
    primitiveCapabilities: run.primitiveCapabilities,
    pushRules: run.push,
    fishabilityBands: run.fishabilityBands,
    activityRules: run.activity,
    activityTargetDate: "2026-09-25",
    activityTargetStage: "peak",
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
    engineVersion: "test",
    configVersion: "test",
  });
  assertEquals(daily.runStage.label, "Peak");
  assertEquals(daily.fishInRiver.score, 30);
  assertEquals(daily.conditionsSuggest.label, "Insufficient evidence");
  assertEquals(condition.push.label, "Unavailable");
  assertEquals(condition.fishability.label, "Unavailable");
  assertEquals(condition.activity?.label, "Inactive");
});

function activityAt(
  date: string,
  runStage:
    | "pre_run"
    | "beginning"
    | "building"
    | "peak"
    | "tapering"
    | "ending",
  flowSignal: "stable" | "sharp_rise" = "stable",
  staging = false,
) {
  return scoreActivity({
    rules: run.activity!,
    requestDate: date,
    targetDate: date,
    runStage,
    staging,
    waterTempF: 55,
    temperatureTrend: "neutral",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    currentHydraulicValue: 2400,
    fishabilityBands: run.fishabilityBands,
    flowSignal,
    hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
      time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: 75,
      shortwave_w_m2: hour >= 8 && hour <= 18 ? 180 : 30,
      clear_sky_shortwave_w_m2: hour >= 8 && hour <= 18 ? 650 : 120,
      precipitation_in: 0,
    })),
  });
}
