import {
  addDays,
  resolveAdminOverrideBand,
  resolveFlowTrendSignal,
  resolveRunStage,
  resolveTemperatureTrendSignal,
  scoreActivity,
  scoreFishability,
  scorePush,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";
import type {
  ActivityRules,
  DirectEventSample,
  FishabilityBands,
  HistoricalPresenceConfig,
  PushRules,
} from "../supabase/functions/_shared/riverRunEngine/types.ts";
import type { ActivityWeatherHour } from "../supabase/functions/_shared/riverRunEngine/scoring/activity.ts";

type Calendar = {
  preRunStart: string;
  stagingStart: string;
  start: string;
  beginningEnd: string;
  buildingEstablishedStart: string;
  buildingBroadStart: string;
  peakStart: string;
  peak: string;
  peakEnd: string;
  taperingEnd: string;
  end: string;
  lateEnd: string;
  postRunLateCopyEnd: string;
};

type River = {
  riverId: "umpqua_mainstem" | "north_umpqua";
  name: string;
  siteId: string;
  lat: number;
  lon: number;
  shapeWindow: [string, string];
  pushWindow: [string, string];
  representedReach: string;
  hydraulicSourceId: string;
  temperatureSourceId: string;
  weatherPointId: string;
  temperatureMode: "disabled" | "trigger_and_constraint";
};

type Run = {
  runId: string;
  species: "chinook_salmon" | "coho_salmon";
  river: River;
  calendar: Calendar;
  strength: HistoricalPresenceConfig["maximum"];
  activityVersion: string;
  presenceVersion: string;
  activityMode: "hydraulic-only" | "full";
  stageResponseAdjustment?: ActivityRules["stageResponseAdjustment"];
};

const START_YEAR = 2019;
const END_YEAR = 2025;
const SHAPE_START_YEAR = 1996;
const SHAPE_END_YEAR = 2025;

const MAIN: River = {
  riverId: "umpqua_mainstem",
  name: "Umpqua River (Mainstem)",
  siteId: "14321000",
  lat: 43.5859502208726,
  lon: -123.555372650329,
  shapeWindow: ["08-01", "12-31"],
  pushWindow: ["08-15", "12-05"],
  representedReach: "umpqua_mainstem_middle_elkton",
  hydraulicSourceId: "umpqua_mainstem_elkton_usgs",
  temperatureSourceId: "umpqua_mainstem_elkton_temperature",
  weatherPointId: "umpqua_mainstem_elkton_weather",
  temperatureMode: "disabled",
};
const NORTH: River = {
  riverId: "north_umpqua",
  name: "North Umpqua River",
  siteId: "14319500",
  lat: 43.270966666666666,
  lon: -123.41154444444444,
  shapeWindow: ["08-28", "01-10"],
  pushWindow: ["09-01", "12-05"],
  representedReach: "north_umpqua_lower_winchester",
  hydraulicSourceId: "north_umpqua_winchester_usgs",
  temperatureSourceId: "north_umpqua_winchester_temperature",
  weatherPointId: "north_umpqua_winchester_weather",
  temperatureMode: "trigger_and_constraint",
};

const RUNS: Run[] = [
  {
    runId: "umpqua_mainstem_fall_chinook",
    species: "chinook_salmon",
    river: MAIN,
    strength: 6,
    presenceVersion:
      "umpqua-mainstem-fall-chinook-presence-v1-pass3-2026-09-28",
    activityVersion:
      "umpqua-mainstem-fall-chinook-hydraulic-activity-v1-pass3-2026-09-28",
    activityMode: "hydraulic-only",
    calendar: {
      preRunStart: "07-15",
      stagingStart: "08-01",
      start: "08-15",
      beginningEnd: "08-31",
      buildingEstablishedStart: "09-01",
      buildingBroadStart: "09-15",
      peakStart: "09-20",
      peak: "10-05",
      peakEnd: "10-20",
      taperingEnd: "11-05",
      end: "11-15",
      lateEnd: "11-30",
      postRunLateCopyEnd: "12-15",
    },
  },
  {
    runId: "umpqua_mainstem_fall_coho",
    species: "coho_salmon",
    river: MAIN,
    strength: 7,
    presenceVersion: "umpqua-mainstem-fall-coho-presence-v1-pass3-2026-09-28",
    activityVersion:
      "umpqua-mainstem-fall-coho-hydraulic-activity-v1-pass3-2026-09-28",
    activityMode: "hydraulic-only",
    calendar: {
      preRunStart: "08-15",
      stagingStart: "09-01",
      start: "09-10",
      beginningEnd: "09-25",
      buildingEstablishedStart: "09-26",
      buildingBroadStart: "10-10",
      peakStart: "10-20",
      peak: "11-05",
      peakEnd: "11-20",
      taperingEnd: "12-05",
      end: "12-15",
      lateEnd: "12-31",
      postRunLateCopyEnd: "01-10",
    },
  },
  {
    runId: "north_umpqua_fall_coho",
    species: "coho_salmon",
    river: NORTH,
    strength: 7,
    presenceVersion: "north-umpqua-fall-coho-presence-v1-pass3-2026-09-28",
    activityVersion: "north-umpqua-fall-coho-full-activity-v1-pass3-2026-09-28",
    activityMode: "full",
    calendar: {
      preRunStart: "08-20",
      stagingStart: "08-28",
      start: "09-01",
      beginningEnd: "09-20",
      buildingEstablishedStart: "09-21",
      buildingBroadStart: "10-10",
      peakStart: "10-20",
      peak: "11-05",
      peakEnd: "11-20",
      taperingEnd: "12-05",
      end: "12-20",
      lateEnd: "01-10",
      postRunLateCopyEnd: "01-30",
    },
  },
];

if (Deno.args.includes("--controlled-only")) {
  const artifactPath =
    "docs/audits/river-run-umpqua-pass3-calibration-replay.json";
  const existing = JSON.parse(await Deno.readTextFile(artifactPath)) as {
    rivers: Array<{
      riverId: string;
      fishability: { bands: FishabilityBands };
      pushCalibration: {
        thresholds: Awaited<ReturnType<typeof loadRiverData>>["pushHydraulic"];
      };
    }>;
    runs: Array<
      Record<string, unknown> & {
        runId: string;
        invariants: Record<string, number>;
        activityRules: {
          hydraulicTrend: Awaited<
            ReturnType<typeof loadRiverData>
          >["activityHydraulic"];
        };
      }
    >;
    controlledTestsVerifiedAtUtc?: string;
  };
  const results = RUNS.map((run) => {
    const river = existing.rivers.find((item) =>
      item.riverId === run.river.riverId
    );
    if (!river) throw new Error(`Missing replay river ${run.river.riverId}`);
    const activity = controlledActivityTests(
      run,
      activityRules(run, storedActivityThresholds(run.runId)),
      river.fishability.bands,
    );
    const push = controlledPushTests(
      run,
      pushRules(run, {
        bands: river.fishability.bands,
        hydraulic: river.pushCalibration.thresholds,
      }),
      river.fishability.bands,
    );
    const stored = existing.runs.find((item) => item.runId === run.runId);
    if (!stored) throw new Error(`Missing replay run ${run.runId}`);
    stored.controlledTests = activity;
    stored.pushControlledTests = push;
    stored.invariants.controlledTestFailures = activity.failures.length +
      push.failures.length;
    return { runId: run.runId, activity, push };
  });

  function storedActivityThresholds(runId: string) {
    const stored = existing.runs.find((item) => item.runId === runId);
    if (!stored) throw new Error(`Missing replay run ${runId}`);
    return stored.activityRules.hydraulicTrend;
  }
  const verifiedAtUtc = new Date().toISOString();
  existing.controlledTestsVerifiedAtUtc = verifiedAtUtc;
  if (Deno.args.includes("--write")) {
    await Deno.writeTextFile(
      artifactPath,
      `${JSON.stringify(existing, null, 2)}\n`,
    );
  }
  console.log(
    JSON.stringify(
      { controlledTestsVerifiedAtUtc: verifiedAtUtc, results },
      null,
      2,
    ),
  );
  if (
    results.some((result) => !result.activity.passed || !result.push.passed)
  ) Deno.exit(1);
  Deno.exit(0);
}

const riverData = new Map<string, Awaited<ReturnType<typeof loadRiverData>>>();
for (const river of [MAIN, NORTH]) {
  riverData.set(river.riverId, await loadRiverData(river));
}

const reports = RUNS.map(replayRun);
const artifact = {
  schemaVersion: 1,
  artifactType: "river_run_pass3_calibration_replay",
  generatedAtUtc: new Date().toISOString(),
  replayYears: `${START_YEAR}-${END_YEAR}`,
  fishabilityYears: `${SHAPE_START_YEAR}-${SHAPE_END_YEAR}`,
  method:
    "USGS approved daily mean discharge, same-gauge measured daily mean water temperature where replay-eligible, and Open-Meteo hourly radiation/cloud/precipitation in four local blocks. Daily means calibrate the live four-hour model; they do not claim intraday historical events or catch rates.",
  rivers: [...riverData.values()].map((item) => item.audit),
  runs: reports,
};

if (Deno.args.includes("--write")) {
  await Deno.mkdir("docs/audits", { recursive: true });
  await Deno.writeTextFile(
    "docs/audits/river-run-umpqua-pass3-calibration-replay.json",
    `${JSON.stringify(artifact, null, 2)}\n`,
  );
}
console.log(JSON.stringify(
  Deno.args.includes("--summary")
    ? {
      rivers: artifact.rivers,
      runs: artifact.runs.map((run) => ({
        runId: run.runId,
        usableDays: run.usableDays,
        expectedDays: run.expectedDays,
        coveragePercent: run.coveragePercent,
        byStage: run.byStage,
        invariants: run.invariants,
      })),
    }
    : artifact,
  null,
  2,
));
if (
  reports.some((report) =>
    Object.values(report.invariants).some((value) => value > 0)
  )
) Deno.exit(1);

async function loadRiverData(river: River) {
  const fetchStart = river === NORTH
    ? `${SHAPE_START_YEAR}-08-24`
    : `${SHAPE_START_YEAR}-07-28`;
  const fetchEnd = river === NORTH
    ? `${SHAPE_END_YEAR + 1}-01-10`
    : `${SHAPE_END_YEAR}-12-31`;
  const flow = await fetchUsgsDaily(
    river.siteId,
    "00060",
    fetchStart,
    fetchEnd,
  );
  const flowByDate = new Map(flow);
  const shapeRows: Array<[string, number]> = [];
  for (let year = SHAPE_START_YEAR; year <= SHAPE_END_YEAR; year++) {
    for (const row of flow) {
      if (
        row[0] >= `${year}-${river.shapeWindow[0]}` &&
        row[0] <= seasonDate(year, river.shapeWindow[1])
      ) shapeRows.push(row);
    }
  }
  const shapeValues = shapeRows.map((row) => row[1]);
  const shape = quantiles(shapeValues);
  const bands: FishabilityBands = {
    version: `${river.riverId}-fishability-v1-pass3-2026-09-28`,
    metric: "flow_cfs",
    sourceLabel: `USGS ${river.siteId}`,
    tooLow: { max: rounded(shape.p10) },
    lowFishable: { min: rounded(shape.p10), max: rounded(shape.p25) },
    ideal: { min: rounded(shape.p25), max: rounded(shape.p75) },
    highFishable: { min: rounded(shape.p75), max: rounded(shape.p90) },
    blownOut: { min: rounded(shape.p95) },
    caps: {
      staleGauge: 60,
      unknownTrend: 65,
      veryLow: 35,
      blownOut: 20,
      sharpRiseHigh: 45,
    },
    evidenceNotes:
      "Fixed 1996-2025 seasonal daily-flow percentiles; reach-scoped workability context only, not safety, clarity, tide, abundance, or access.",
    sourceNotes: `USGS ${river.siteId}; p10/p25/p75/p90/p95 calibration.`,
  };

  const activityRows: Array<[string, number]> = [];
  const pushRows: Array<[string, number]> = [];
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    for (const row of flow) {
      if (
        row[0] >= `${year}-${river.shapeWindow[0]}` &&
        row[0] <= seasonDate(year, river.shapeWindow[1])
      ) activityRows.push(row);
      if (
        row[0] >= `${year}-${river.pushWindow[0]}` &&
        row[0] <= seasonDate(year, river.pushWindow[1])
      ) pushRows.push(row);
    }
  }
  const activityCalibration = calibrateHydraulic(activityRows);
  const pushCalibration = calibrateHydraulic(pushRows);
  const temperature = river.temperatureMode === "trigger_and_constraint"
    ? new Map(
      await fetchUsgsDaily(
        river.siteId,
        "00010",
        `${START_YEAR}-08-24`,
        `${END_YEAR + 1}-01-13`,
      ),
    )
    : new Map<string, number>();
  const weather = await fetchWeather(river);

  let fishabilityViolations = 0;
  for (const [date, value] of shapeRows) {
    const prior = flowByDate.get(addDays(date, -1));
    if (prior == null) continue;
    const trend = resolveFlowTrendSignal({
      currentValue: value,
      value24hAgo: prior,
      rising24hAbsolute: activityCalibration.thresholds.rising24h.absolute,
      rising24hPercent: activityCalibration.thresholds.rising24h.percent,
      meaningfulRise24hAbsolute:
        activityCalibration.thresholds.meaningfulRise24h.absolute,
      meaningfulRise24hPercent:
        activityCalibration.thresholds.meaningfulRise24h.percent,
      sharpRise24hAbsolute:
        activityCalibration.thresholds.sharpRise24h.absolute,
      sharpRise24hPercent: activityCalibration.thresholds.sharpRise24h.percent,
    });
    const band = resolveAdminOverrideBand(value, bands);
    const result = scoreFishability({
      rules: bands,
      gaugeFreshness: "fresh",
      flowBand: band,
      flowSignal: trend.rawSignal,
      currentHydraulicValue: value,
      hydraulicAbsoluteChange24h: trend.absoluteChange24h,
      hydraulicPercentChange24h: trend.percentChange24h,
      flowReasonCodes: trend.reasonCodes,
    });
    if (
      result.score == null ||
      (band === "blown_out" && result.score > bands.caps.blownOut)
    ) fishabilityViolations++;
  }

  return {
    flowByDate,
    temperature,
    weather,
    bands,
    activityHydraulic: activityCalibration.thresholds,
    pushHydraulic: pushCalibration.thresholds,
    audit: {
      riverId: river.riverId,
      siteId: river.siteId,
      representedReach: river.representedReach,
      fishability: {
        usableDays: shapeValues.length,
        percentiles: shape,
        bands,
        violations: fishabilityViolations,
      },
      pushCalibration: {
        exactUnionWindow: river.pushWindow,
        usableDays: pushRows.length,
        qualifyingPositiveRises: pushCalibration.absoluteRises.length,
        absoluteRisePercentiles: pushCalibration.absolutePercentiles,
        percentageRisePercentiles: pushCalibration.percentagePercentiles,
        thresholds: pushCalibration.thresholds,
      },
      temperatureReplay: river.temperatureMode === "disabled"
        ? {
          mode: "disabled",
          reason:
            "Fewer than five complete recent fall seasons; zero Activity/Push influence",
        }
        : { mode: "same_gauge_measured", observations: temperature.size },
    },
  };
}

function replayRun(run: Run) {
  const data = riverData.get(run.river.riverId)!;
  const rules = activityRules(run, data.activityHydraulic);
  const push = pushRules(run, {
    bands: data.bands,
    hydraulic: data.pushHydraulic,
  });
  type ReplayRow = {
    date: string;
    year: number;
    stage: string;
    score: number;
    label: string;
    spread: number;
    confidence: string;
    reasonCodes: string[];
    blocks: Array<{ id: string; score: number; label: string }>;
  };
  const rows: ReplayRow[] = [];
  const pushLabels = new Map<string, number>();
  const missing = {
    flow: 0,
    priorFlow: 0,
    temperature: 0,
    temperatureHistory: 0,
    weather: 0,
  };
  let strongWithoutDirectSignal = 0;
  let severeHighCapBroken = 0;
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    for (
      let date = `${year}-${run.calendar.stagingStart}`;
      date <= seasonDate(year, run.calendar.lateEnd);
      date = addDays(date, 1)
    ) {
      const flow = data.flowByDate.get(date);
      const priorFlow = data.flowByDate.get(addDays(date, -1));
      const temp = data.temperature.get(date);
      const temp24 = data.temperature.get(addDays(date, -1));
      const temp72 = data.temperature.get(addDays(date, -3));
      const weather = data.weather.get(date) ?? [];
      if (flow == null) missing.flow++;
      if (priorFlow == null) missing.priorFlow++;
      if (run.activityMode === "full" && temp == null) missing.temperature++;
      if (run.activityMode === "full" && (temp24 == null || temp72 == null)) {
        missing.temperatureHistory++;
      }
      if (weather.length < 16) missing.weather++;
      if (
        flow == null || priorFlow == null || weather.length < 16 ||
        (run.activityMode === "full" &&
          (temp == null || temp24 == null || temp72 == null))
      ) continue;
      const activityTrend = resolveFlowTrendSignal({
        currentValue: flow,
        value24hAgo: priorFlow,
        rising24hAbsolute: data.activityHydraulic.rising24h.absolute,
        rising24hPercent: data.activityHydraulic.rising24h.percent,
        meaningfulRise24hAbsolute:
          data.activityHydraulic.meaningfulRise24h.absolute,
        meaningfulRise24hPercent:
          data.activityHydraulic.meaningfulRise24h.percent,
        sharpRise24hAbsolute: data.activityHydraulic.sharpRise24h.absolute,
        sharpRise24hPercent: data.activityHydraulic.sharpRise24h.percent,
      });
      const pushTrend = resolveFlowTrendSignal({
        currentValue: flow,
        value24hAgo: priorFlow,
        rising24hAbsolute: data.pushHydraulic.rising24h.absolute,
        rising24hPercent: data.pushHydraulic.rising24h.percent,
        meaningfulRise24hAbsolute:
          data.pushHydraulic.meaningfulRise24h.absolute,
        meaningfulRise24hPercent: data.pushHydraulic.meaningfulRise24h.percent,
        sharpRise24hAbsolute: data.pushHydraulic.sharpRise24h.absolute,
        sharpRise24hPercent: data.pushHydraulic.sharpRise24h.percent,
      });
      const tempTrend = run.activityMode === "full"
        ? resolveTemperatureTrendSignal({
          sourceType: "same_gauge",
          delta24hF: temp! - temp24!,
          delta72hF: temp! - temp72!,
          hasEnoughValues: true,
        })
        : { rawSignal: "neutral_missing" as const, reasonCodes: [] };
      const band = resolveAdminOverrideBand(flow, data.bands);
      const stage = resolveRunStage(runForStage(run), date);
      const result = scoreActivity({
        rules,
        requestDate: date,
        targetDate: date,
        runStage: stage.stage,
        staging: stage.stagingContext,
        waterTempF: run.activityMode === "full" ? temp! : null,
        temperatureTrend: tempTrend.rawSignal,
        gaugeFreshness: "fresh",
        weatherFreshness: "fresh",
        flowBand: band,
        currentHydraulicValue: flow,
        fishabilityBands: data.bands,
        flowSignal: activityTrend.rawSignal,
        hourlyWeather: weather,
      });
      const blockScores = result.blocks.map((block) => block.score);
      rows.push({
        date,
        year,
        stage: stage.stage,
        score: result.score!,
        label: result.label,
        spread: Math.max(...blockScores) - Math.min(...blockScores),
        confidence: result.confidence,
        reasonCodes: result.reasonCodes,
        blocks: result.blocks.map((block) => ({
          id: block.id,
          score: block.score,
          label: block.activityLabel,
        })),
      });

      if (
        date >= `${year}-${run.calendar.start}` &&
        date <= seasonDate(year, run.calendar.taperingEnd)
      ) {
        const pushed = scorePush({
          movementEngineId: "fall_cooling",
          rules: push,
          gaugeFreshness: "fresh",
          flowSignal: pushTrend.rawSignal,
          currentHydraulicValue: flow,
          hydraulicAbsoluteChange24h: pushTrend.absoluteChange24h,
          hydraulicPercentChange24h: pushTrend.percentChange24h,
          rainSignal: "dry",
          temperatureSignal: tempTrend.rawSignal,
          temperatureSourceType: run.activityMode === "full"
            ? "same_gauge"
            : "unavailable",
          waterTempF: run.activityMode === "full" ? temp! : null,
          trackingState: "active",
          trackingStartDate: `${year}-${run.calendar.start}`,
          trackingEndDate: seasonDate(year, run.calendar.taperingEnd),
          localDate: date,
          rainReasonCodes: [],
          flowReasonCodes: pushTrend.reasonCodes,
          temperatureReasonCodes: tempTrend.reasonCodes,
          hydraulicFourHourSeries: dailyStepSeries(priorFlow, flow, date),
          temperatureFourHourSeries: run.activityMode === "full"
            ? dailyStepSeries(temp24!, temp!, date)
            : [],
        });
        pushLabels.set(pushed.label, (pushLabels.get(pushed.label) ?? 0) + 1);
        if (
          pushed.label === "Strong" &&
          (pushed.directSignals?.hydraulic?.level ?? 0) === 0 &&
          (pushed.directSignals?.temperature?.level ?? 0) === 0
        ) strongWithoutDirectSignal++;
        if (flow >= data.bands.blownOut.min && pushed.label !== "Neutral") {
          severeHighCapBroken++;
        }
      }
    }
  }
  const expectedDays =
    activeDayCount(run.calendar.stagingStart, run.calendar.lateEnd) *
    (END_YEAR - START_YEAR + 1);
  const stageNames = [
    "pre_run",
    "beginning",
    "building",
    "peak",
    "tapering",
    "ending",
    "post_run",
  ];
  const byStage = Object.fromEntries(stageNames.map((stage) => {
    const selected = rows.filter((row) => row.stage === stage);
    return [stage, replayAnalytics(selected)];
  }));
  const means = Object.fromEntries(
    stageNames.map((
      stage,
    ) => [
      stage,
      (byStage[stage] as { dailyScores: { mean: number | null } }).dailyScores
        .mean,
    ]),
  );
  const peak = means.peak ?? -Infinity;
  const shoulders = [means.building, means.tapering].filter((
    value,
  ): value is number => value != null);
  const outer = [means.pre_run, means.beginning, means.ending, means.post_run]
    .filter((value): value is number => value != null);
  const byYear = Object.fromEntries(
    Array.from(
      { length: END_YEAR - START_YEAR + 1 },
      (_, index) => START_YEAR + index,
    ).map((
      year,
    ) => [
      year,
      replayAnalytics(rows.filter((row) => row.year === year)),
    ]),
  );
  const stageVariationFailures =
    ["beginning", "building", "peak", "tapering"].filter((stage) => {
      const scores =
        (byStage[stage] as { dailyScores: ReturnType<typeof summary> })
          .dailyScores;
      return scores.min != null && scores.max != null &&
        scores.max - scores.min < 5;
    }).length;
  const yearMeans = Object.values(byYear).map((item) =>
    (item as { dailyScores: { mean: number | null } }).dailyScores.mean
  ).filter((value): value is number => value != null);
  const controlledTests = controlledActivityTests(run, rules, data.bands);
  const pushControlledTests = controlledPushTests(run, push, data.bands);
  const invariants = {
    insufficientCoverage: rows.length < expectedDays * .8 ? 1 : 0,
    peakNotHighest: [...shoulders, ...outer].some((value) => value >= peak)
      ? 1
      : 0,
    shoulderGapOver20: shoulders.some((value) => peak - value > 20) ? 1 : 0,
    strongWithoutDirectSignal,
    noPositivePushEvents:
      [...pushLabels.entries()].some(([label, count]) =>
          label !== "Neutral" && count > 0
        )
        ? 0
        : 1,
    severeHighCapBroken,
    incompleteFourBlockDays:
      rows.filter((row) => !Number.isFinite(row.spread)).length,
    stagesWithoutEnvironmentalVariation: stageVariationFailures,
    yearsWithoutMeaningfulVariation: yearMeans.length > 1 &&
        Math.max(...yearMeans) - Math.min(...yearMeans) < .5
      ? 1
      : 0,
    controlledTestFailures: controlledTests.failures.length +
      pushControlledTests.failures.length,
  };
  return {
    runId: run.runId,
    species: run.species,
    calendar: run.calendar,
    strength: run.strength,
    distributionScope: "broad",
    activityMode: run.activityMode,
    activityRules: rules,
    presenceVersion: run.presenceVersion,
    expectedDays,
    usableDays: rows.length,
    coveragePercent: round2(rows.length / expectedDays * 100),
    missing,
    allDays: replayAnalytics(rows),
    byStage,
    byYear,
    controlledTests,
    pushControlledTests,
    pushRules: push,
    pushLabels: Object.fromEntries(pushLabels),
    invariants,
  };

  function replayAnalytics(selected: ReplayRow[]) {
    const blockIds = ["05-09", "09-13", "13-17", "17-21"];
    const capDays = selected.filter((row) =>
      row.reasonCodes.some((code) => code.endsWith("_cap"))
    );
    const leaderCounts: Record<string, number> = { tiesWithinTwoPoints: 0 };
    for (const row of selected) {
      const maximum = Math.max(...row.blocks.map((block) => block.score));
      const leaders = row.blocks.filter((block) => maximum - block.score < 3);
      if (leaders.length > 1) leaderCounts.tiesWithinTwoPoints++;
      for (const leader of leaders) {
        leaderCounts[leader.id] = (leaderCounts[leader.id] ?? 0) + 1;
      }
    }
    return {
      days: selected.length,
      dailyScores: summary(selected.map((row) => row.score)),
      dailyLabels: counts(selected.map((row) => row.label)),
      confidence: frequencyCounts(
        selected.map((row) => row.confidence),
        selected.length,
      ),
      capFrequency: {
        days: capDays.length,
        percent: selected.length
          ? round2(capDays.length / selected.length * 100)
          : null,
        reasonCodes: counts(
          capDays.flatMap((row) =>
            row.reasonCodes.filter((code) => code.endsWith("_cap"))
          ),
        ),
      },
      leaderFrequency: leaderCounts,
      blockSpread: summary(selected.map((row) => row.spread)),
      byBlock: Object.fromEntries(blockIds.map((blockId) => {
        const blocks = selected.flatMap((row) =>
          row.blocks.filter((block) => block.id === blockId)
        );
        return [blockId, {
          scores: summary(blocks.map((block) => block.score)),
          labels: counts(blocks.map((block) => block.label)),
        }];
      })),
    };
  }
}

function controlledActivityTests(
  run: Run,
  rules: ActivityRules,
  bands: FishabilityBands,
) {
  const failures: string[] = [];
  const date = `2024-${run.calendar.peak}`;
  const preferredTemp = run.species === "coho_salmon" ? 52 : 55;
  const baseInput = {
    rules,
    requestDate: date,
    targetDate: date,
    runStage: "peak" as const,
    staging: false,
    waterTempF: run.activityMode === "full" ? preferredTemp : null,
    temperatureTrend: run.activityMode === "full"
      ? "neutral" as const
      : "neutral_missing" as const,
    gaugeFreshness: "fresh" as const,
    weatherFreshness: "fresh" as const,
    flowBand: "ideal" as const,
    currentHydraulicValue: (bands.ideal.min + bands.ideal.max) / 2,
    fishabilityBands: bands,
    flowSignal: "stable" as const,
    hourlyWeather: syntheticWeather(date),
  };
  const base = scoreActivity(baseInput);
  if (base.score == null || base.blocks.length !== 4) {
    failures.push("provider_recovery_did_not_restore_four_blocks");
  }
  const noWeather = scoreActivity({
    ...baseInput,
    weatherFreshness: "missing",
    hourlyWeather: [],
  });
  if (noWeather.score != null || noWeather.blocks.length !== 0) {
    failures.push("missing_weather_did_not_fail_closed");
  }
  const noRiver = scoreActivity({
    ...baseInput,
    waterTempF: null,
    temperatureTrend: "neutral_missing",
    gaugeFreshness: "missing",
    flowBand: undefined,
    currentHydraulicValue: null,
  });
  if (noRiver.score != null || noRiver.blocks.length !== 0) {
    failures.push("missing_required_river_did_not_fail_closed");
  }

  const rainWeather = syntheticWeather(date, { rainBlock: "05-09" });
  const rain = scoreActivity({ ...baseInput, hourlyWeather: rainWeather });
  if (
    base.blocks.slice(1).some((block, index) =>
      block.score !== rain.blocks[index + 1]?.score
    )
  ) failures.push("rain_leaked_outside_source_block");
  const lightWeather = syntheticWeather(date, { darkBlock: "05-09" });
  const light = scoreActivity({ ...baseInput, hourlyWeather: lightWeather });
  if (
    base.blocks.slice(1).some((block, index) =>
      block.score !== light.blocks[index + 1]?.score
    )
  ) failures.push("light_leaked_outside_source_block");
  if (
    base.score! < Math.min(...base.blocks.map((block) => block.score)) ||
    base.score! > Math.max(...base.blocks.map((block) => block.score))
  ) failures.push("daily_rollup_outside_block_range");

  if (run.activityMode === "full") {
    const warmF = run.species === "coho_salmon" ? 65 : 69;
    const barrierF = run.species === "coho_salmon" ? 69 : 73;
    const warm = scoreActivity({ ...baseInput, waterTempF: warmF });
    const barrier = scoreActivity({ ...baseInput, waterTempF: barrierF });
    if (warm.blocks.some((block) => block.score > 39)) {
      failures.push("warm_cap_bypassed");
    }
    if (barrier.blocks.some((block) => block.score >= 30)) {
      failures.push("barrier_cap_bypassed");
    }
    if (base.score! < warm.score!) {
      failures.push("preferred_temperature_not_monotonic");
    }
  } else {
    const inventedTemperature = scoreActivity({
      ...baseInput,
      waterTempF: 52,
      temperatureTrend: "strong_cooling",
    });
    if (inventedTemperature.score !== base.score) {
      failures.push("disabled_temperature_changed_hydraulic_only_score");
    }
  }

  const taperDate = seasonDate(2024, run.calendar.taperingEnd);
  const endingDate = addDays(taperDate, 1);
  const taper = scoreActivity({
    ...baseInput,
    requestDate: taperDate,
    targetDate: taperDate,
    runStage: "tapering",
    hourlyWeather: syntheticWeather(taperDate),
  });
  const ending = scoreActivity({
    ...baseInput,
    requestDate: endingDate,
    targetDate: endingDate,
    runStage: "ending",
    hourlyWeather: syntheticWeather(endingDate),
  });
  if (Math.abs((taper.score ?? 0) - (ending.score ?? 0)) > 2) {
    failures.push("lifecycle_boundary_cliff");
  }
  const tomorrow = scoreActivity({
    ...baseInput,
    requestDate: addDays(date, -1),
    targetDate: date,
  });
  if (tomorrow.targetDayLabel !== "Tomorrow") {
    failures.push("today_tomorrow_label_failed");
  }
  if (!base.detail.includes(rules.scopeCopy ?? "")) {
    failures.push("scope_limitation_missing");
  }
  return { passed: failures.length === 0, failures };
}

function controlledPushTests(
  run: Run,
  rules: PushRules,
  bands: FishabilityBands,
) {
  const failures: string[] = [];
  const date = `2024-${run.calendar.peak}`;
  const baseline = run.river === MAIN ? 2_000 : 1_500;
  const score = (
    overrides: Partial<Parameters<typeof scorePush>[0]> = {},
  ) =>
    scorePush({
      movementEngineId: "fall_cooling",
      rules,
      gaugeFreshness: "fresh",
      flowSignal: "stable",
      currentHydraulicValue: baseline,
      hydraulicAbsoluteChange24h: 0,
      hydraulicPercentChange24h: 0,
      rainSignal: "dry",
      temperatureSignal: "neutral_missing",
      temperatureSourceType: "unavailable",
      waterTempF: null,
      trackingState: "active",
      trackingStartDate: `2024-${run.calendar.start}`,
      trackingEndDate: seasonDate(2024, run.calendar.taperingEnd),
      localDate: date,
      rainReasonCodes: [],
      flowReasonCodes: [],
      temperatureReasonCodes: [],
      hydraulicFourHourSeries: dailyStepSeries(baseline, baseline, date),
      temperatureFourHourSeries: [],
      ...overrides,
    });

  if (score().label !== "Neutral") {
    failures.push("stable_direct_series_not_neutral");
  }
  const thresholds = [
    rules.hydraulic.rising24h,
    rules.hydraulic.meaningfulRise24h,
    rules.hydraulic.sharpRise24h,
  ];
  const expected = ["Possible", "Elevated", "Strong"];
  const eventResults = thresholds.map((threshold, index) => {
    const change = Math.max(
      threshold.absolute + 1,
      baseline * ((threshold.percent ?? 0) + .1) / 100,
    );
    const current = baseline + change;
    const result = score({
      flowSignal: index === 0
        ? "rising"
        : index === 1
        ? "meaningful_rise"
        : "sharp_rise",
      currentHydraulicValue: current,
      hydraulicAbsoluteChange24h: change,
      hydraulicPercentChange24h: change / baseline * 100,
      hydraulicFourHourSeries: dailyStepSeries(baseline, current, date),
    });
    if (result.label !== expected[index]) {
      failures.push(`direct_hydraulic_level_${index + 1}_failed`);
    }
    return result;
  });

  const strong = eventResults[2];
  const staleStrong = score({
    gaugeFreshness: "stale",
    flowSignal: "sharp_rise",
    currentHydraulicValue: strong.directSignals?.hydraulic?.current,
    hydraulicFourHourSeries: dailyStepSeries(
      baseline,
      strong.directSignals?.hydraulic?.current ?? baseline,
      date,
    ),
  });
  if (staleStrong.label !== "Elevated") {
    failures.push("stale_event_did_not_lose_level");
  }

  const missing = score({
    gaugeFreshness: "missing",
    currentHydraulicValue: null,
    hydraulicFourHourSeries: [],
    temperatureSourceType: "unavailable",
    waterTempF: null,
    temperatureFourHourSeries: [],
  });
  if (missing.score != null || missing.label !== "Unavailable") {
    failures.push("missing_direct_sources_did_not_fail_closed");
  }

  const severeCurrent = bands.blownOut.min + 100;
  const severeBaseline = Math.max(1, bands.blownOut.min * .25);
  const severe = score({
    flowSignal: "sharp_rise",
    currentHydraulicValue: severeCurrent,
    hydraulicFourHourSeries: dailyStepSeries(
      severeBaseline,
      severeCurrent,
      date,
    ),
  });
  if (severe.label !== "Neutral") {
    failures.push("severe_high_direct_event_not_neutral");
  }

  const peakChange = Math.max(
    rules.hydraulic.sharpRise24h.absolute + 1,
    baseline * ((rules.hydraulic.sharpRise24h.percent ?? 0) + .1) / 100,
  );
  const fadingValues = [
    ...Array(7).fill(baseline),
    baseline + peakChange,
    baseline + peakChange,
    baseline + peakChange * .5,
    baseline + peakChange * .5,
  ];
  const fading = score({
    currentHydraulicValue: fadingValues.at(-1),
    hydraulicFourHourSeries: directSeries(fadingValues, date),
  });
  if (
    fading.label !== "Elevated" ||
    fading.directSignals?.hydraulic?.phase !== "fading"
  ) {
    failures.push("partial_reversal_did_not_downgrade_event");
  }

  const expiredValues = [
    ...Array(7).fill(baseline),
    ...Array(14).fill(baseline + peakChange),
  ];
  const expired = score({
    currentHydraulicValue: expiredValues.at(-1),
    hydraulicFourHourSeries: directSeries(expiredValues, date),
  });
  if (expired.label !== "Neutral") {
    failures.push("event_did_not_expire_after_48h");
  }

  if (run.activityMode === "full") {
    const cooling = score({
      hydraulicFourHourSeries: dailyStepSeries(baseline, baseline, date),
      temperatureSourceType: "same_gauge",
      waterTempF: 51,
      temperatureSignal: "strong_cooling",
      temperatureFourHourSeries: dailyStepSeries(55, 51, date),
    });
    if (cooling.label !== "Strong") {
      failures.push("measured_cooling_trigger_failed");
    }
    const barrier = score({
      flowSignal: "sharp_rise",
      currentHydraulicValue: strong.directSignals?.hydraulic?.current,
      hydraulicFourHourSeries: dailyStepSeries(
        baseline,
        strong.directSignals?.hydraulic?.current ?? baseline,
        date,
      ),
      temperatureSourceType: "same_gauge",
      waterTempF: 69,
      temperatureSignal: "neutral",
      temperatureFourHourSeries: dailyStepSeries(69, 69, date),
    });
    if (barrier.label !== "Neutral") {
      failures.push("temperature_barrier_did_not_suppress_event");
    }
  }

  return { passed: failures.length === 0, failures };
}

function dailyStepSeries(
  prior: number,
  current: number,
  date: string,
): DirectEventSample[] {
  return directSeries(
    [prior, prior, prior, prior, prior, prior, current],
    date,
  );
}

function directSeries(values: number[], date: string): DirectEventSample[] {
  const end = Date.parse(`${date}T20:00:00Z`);
  return values.map((value, index) => ({
    windowEndAt: new Date(
      end - (values.length - 1 - index) * 4 * 3_600_000,
    ).toISOString(),
    value,
    observationCount: 8,
  }));
}

function syntheticWeather(
  date: string,
  options: { rainBlock?: string; darkBlock?: string } = {},
): ActivityWeatherHour[] {
  return Array.from({ length: 16 }, (_, index) => {
    const hour = index + 5;
    const block = hour < 9
      ? "05-09"
      : hour < 13
      ? "09-13"
      : hour < 17
      ? "13-17"
      : "17-21";
    const dark = block === options.darkBlock;
    return {
      time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: dark ? 100 : 55,
      shortwave_w_m2: dark ? 30 : 220,
      clear_sky_shortwave_w_m2: 500,
      precipitation_in: block === options.rainBlock ? .08 : 0,
      is_day: 1,
    };
  });
}

function activityRules(
  run: Run,
  hydraulic: Awaited<ReturnType<typeof loadRiverData>>["activityHydraulic"],
): ActivityRules {
  const coho = run.species === "coho_salmon";
  const full = run.activityMode === "full";
  return {
    version: run.activityVersion,
    profile: coho ? "coho_fall_reaction" : "chinook_fall_reaction",
    dataMode: "observed_river",
    minimumInputContract: "weather_and_one_measured_river_input",
    confidenceCeiling: full ? undefined : "Limited",
    inputReach: {
      reachIds: [run.river.representedReach],
      hydraulicSourceIds: [run.river.hydraulicSourceId],
      waterTemperatureSourceIds: full ? [run.river.temperatureSourceId] : [],
      weatherPointIds: [run.river.weatherPointId],
      notes:
        `${run.river.name} Activity represents only ${run.river.representedReach}.`,
    },
    scopeCopy:
      `${run.river.name} Activity represents only the gauge reach; it does not describe the estuary, every upstream reach, abundance, fish location, or catch probability.`,
    weights: full
      ? { light: .25, waterTemperature: .35, riverBehavior: .30, weather: .10 }
      : { light: .30, waterTemperature: 0, riverBehavior: .60, weather: .10 },
    temperature: coho
      ? {
        coldF: 40,
        preferredMinF: 45,
        preferredMaxF: 60,
        warmF: 64,
        barrierF: 68,
      }
      : {
        coldF: 43,
        preferredMinF: 48,
        preferredMaxF: 62,
        warmF: 68,
        barrierF: 72,
      },
    hydraulicTrend: hydraulic,
    ...(run.stageResponseAdjustment
      ? { stageResponseAdjustment: run.stageResponseAdjustment }
      : {}),
    caps: {
      noMeasuredRiverData: 60,
      noWaterTemperature: full ? 60 : 100,
      lateRun: 75,
      ending: 42,
      taperingPenalty: 15,
      lifecycleRamp: {
        peakEnd: run.calendar.peakEnd,
        taperingEnd: run.calendar.taperingEnd,
        endingEnd: run.calendar.lateEnd,
      },
    },
    evidenceNotes: full
      ? "Seven-season replay of co-located measured flow and water temperature plus hourly modeled weather."
      : "Seven-season hydraulic-only replay; recent measured temperature lacks five complete seasons and has zero Activity influence.",
  };
}

function pushRules(
  run: Run,
  data: {
    bands: Awaited<ReturnType<typeof loadRiverData>>["bands"];
    hydraulic: Awaited<ReturnType<typeof loadRiverData>>["pushHydraulic"];
  },
): PushRules {
  const coho = run.species === "coho_salmon";
  return {
    version: `${run.runId}-direct-push-v1-pass3-2026-09-28`,
    model: "direct_event_state",
    directEvent: {
      hydraulic: "trigger",
      temperature: run.activityMode === "full"
        ? "trigger_and_constraint"
        : "disabled",
      buildingCoolingF: .75,
      coolingF: 1.5,
      strongCoolingF: 3,
      persistenceHours: 48,
      fullRetentionFraction: .65,
      minimumRetentionFraction: .35,
    },
    hydraulic: {
      metric: "flow_cfs",
      sourceLabel: `USGS ${run.river.siteId}`,
      lowValue: data.bands.tooLow.max,
      highValue: data.bands.highFishable.max,
      severeHighValue: data.bands.blownOut.min,
      ...data.hydraulic,
    },
    rain: { meaningful48hIn: 997, strong48hIn: 998, heavy48hIn: 999 },
    temperature: coho
      ? {
        suitabilityLabel: "fall coho movement range",
        supportiveMinF: 45,
        supportiveMaxF: 60,
        tooWarmF: 64,
        migrationBarrierF: 68,
      }
      : {
        suitabilityLabel: "fall Chinook movement range",
        supportiveMinF: 48,
        supportiveMaxF: 62,
        tooWarmF: 68,
        migrationBarrierF: 72,
      },
    caps: {
      staleGauge: 55,
      unknownTrend: 49,
      noGaugeResponse: 50,
      tooWarm: 64,
      migrationBarrier: 49,
      severeHighFlow: 49,
      outsideExtendedWindow: 50,
      coldHolding: 49,
    },
    evidenceNotes:
      "Positive-only direct event replay. Measured discharge is the required trigger; precipitation is unscored. Temperature participates only for North Umpqua coho.",
    sourceNotes:
      `USGS ${run.river.siteId}; 2019-2025 positive daily-rise p50/p75/p90 thresholds.`,
  };
}

function runForStage(run: Run) {
  const anchors: HistoricalPresenceConfig["anchors"] = [
    { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
    { dayOffsetFromStart: 30, fractionOfMaximum: .55 },
    { dayOffsetFromStart: 55, fractionOfMaximum: 1 },
    { dayOffsetFromStart: 90, fractionOfMaximum: 0 },
  ];
  return {
    riverId: run.river.riverId,
    species: run.species,
    runType: "fall_spawn" as const,
    runStageCopyStrategy: "onboarding_corridor" as const,
    runWindow: run.calendar,
    historicalPresence: {
      maximum: run.strength,
      distributionScope: "broad" as const,
      curveVersion: run.presenceVersion,
      anchors,
      evidenceNotes: "Pass 3 calibration",
      sourceNotes: "Umpqua dossier",
    },
  };
}

async function fetchUsgsDaily(
  siteId: string,
  parameterCode: string,
  startDate: string,
  endDate: string,
): Promise<Array<[string, number]>> {
  const rows: Array<[string, number]> = [];
  for (
    let year = Number(startDate.slice(0, 4));
    year <= Number(endDate.slice(0, 4));
    year += 1
  ) {
    const start = year === Number(startDate.slice(0, 4))
      ? startDate
      : `${year}-01-01`;
    const lastYear = year;
    const end = lastYear === Number(endDate.slice(0, 4))
      ? endDate
      : `${lastYear}-12-31`;
    const url = new URL(
      "https://api.waterdata.usgs.gov/ogcapi/v0/collections/daily/items",
    );
    for (
      const [key, value] of Object.entries({
        f: "json",
        monitoring_location_id: `USGS-${siteId}`,
        parameter_code: parameterCode,
        statistic_id: "00003",
        datetime: `${start}/${end}`,
        limit: "10000",
      })
    ) url.searchParams.set(key, value);
    const response = await fetch(url);
    if (!response.ok) {
      const fallback = new URL("https://waterservices.usgs.gov/nwis/dv/");
      for (
        const [key, value] of Object.entries({
          format: "json",
          sites: siteId,
          startDT: start,
          endDT: end,
          parameterCd: parameterCode,
          statCd: "00003",
          siteStatus: "all",
        })
      ) fallback.searchParams.set(key, value);
      const fallbackResponse = await fetchWithRetry(fallback);
      if (!fallbackResponse.ok) {
        throw new Error(
          `USGS ${siteId}/${parameterCode} failed: OGC ${response.status}, NWIS ${fallbackResponse.status}`,
        );
      }
      const fallbackJson = await fallbackResponse.json() as {
        value?: {
          timeSeries?: Array<{
            values?: Array<{
              value?: Array<{ dateTime?: string; value?: string }>;
            }>;
          }>;
        };
      };
      for (
        const item of fallbackJson.value?.timeSeries?.[0]?.values?.[0]?.value ??
          []
      ) {
        const date = String(item.dateTime ?? "").slice(0, 10);
        const raw = Number(item.value);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(raw)) {
          continue;
        }
        rows.push([
          date,
          parameterCode === "00010" ? raw * 9 / 5 + 32 : raw,
        ]);
      }
      continue;
    }
    const json = await response.json() as {
      features?: Array<{ properties?: Record<string, unknown> }>;
    };
    for (const feature of json.features ?? []) {
      const date = String(feature.properties?.time ?? "").slice(0, 10);
      const raw = Number(feature.properties?.value);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(raw)) continue;
      rows.push([date, parameterCode === "00010" ? raw * 9 / 5 + 32 : raw]);
    }
  }
  return [...new Map(rows).entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

async function fetchWeather(
  river: River,
): Promise<Map<string, ActivityWeatherHour[]>> {
  const result = new Map<string, ActivityWeatherHour[]>();
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    const startDate = `${year}-${river.shapeWindow[0]}`;
    const endDate = seasonDate(year, river.shapeWindow[1]);
    const params = new URLSearchParams({
      latitude: String(river.lat),
      longitude: String(river.lon),
      start_date: addDays(startDate, -3),
      end_date: addDays(endDate, 3),
      hourly:
        "precipitation,cloud_cover,shortwave_radiation,shortwave_radiation_clear_sky,is_day",
      precipitation_unit: "inch",
      timezone: "UTC",
    });
    const response = await fetchWithRetry(
      `https://archive-api.open-meteo.com/v1/archive?${params}`,
    );
    if (!response.ok) {
      throw new Error(
        `Open-Meteo ${river.riverId}/${year} failed: ${response.status}`,
      );
    }
    const json = await response.json() as {
      hourly?: {
        time?: string[];
        precipitation?: Array<number | null>;
        cloud_cover?: Array<number | null>;
        shortwave_radiation?: Array<number | null>;
        shortwave_radiation_clear_sky?: Array<number | null>;
        is_day?: Array<number | null>;
      };
    };
    for (const [index, utc] of (json.hourly?.time ?? []).entries()) {
      const local = localDateTime(`${utc}Z`, "America/Los_Angeles");
      const hour = Number(local.slice(11, 13));
      if (hour < 5 || hour >= 21) continue;
      const date = local.slice(0, 10);
      const item: ActivityWeatherHour = {
        time_local: local,
        precipitation_in: finite(json.hourly?.precipitation?.[index]),
        cloud_cover_pct: finite(json.hourly?.cloud_cover?.[index]),
        shortwave_w_m2: finite(json.hourly?.shortwave_radiation?.[index]),
        clear_sky_shortwave_w_m2: finite(
          json.hourly?.shortwave_radiation_clear_sky?.[index],
        ),
        is_day: finite(json.hourly?.is_day?.[index]),
      };
      result.set(date, [...(result.get(date) ?? []), item]);
    }
  }
  return result;
}

function quantiles(values: number[]) {
  const sorted = values.toSorted((a, b) => a - b);
  const at = (fraction: number) => {
    const index = (sorted.length - 1) * fraction;
    const low = Math.floor(index);
    const high = Math.ceil(index);
    return round2(sorted[low] + (sorted[high] - sorted[low]) * (index - low));
  };
  return {
    p05: at(.05),
    p10: at(.10),
    p25: at(.25),
    p50: at(.50),
    p75: at(.75),
    p90: at(.90),
    p95: at(.95),
    p99: at(.99),
  };
}
function calibrateHydraulic(inputRows: Array<[string, number]>) {
  const rows = inputRows.toSorted((a, b) => a[0].localeCompare(b[0]));
  const absoluteRises: number[] = [];
  const percentRises: number[] = [];
  for (let index = 1; index < rows.length; index++) {
    const [date, value] = rows[index];
    const [priorDate, prior] = rows[index - 1];
    if (daysBetween(priorDate, date) !== 1 || value <= prior) continue;
    absoluteRises.push(value - prior);
    percentRises.push((value - prior) / prior * 100);
  }
  const absolutePercentiles = quantiles(absoluteRises);
  const percentagePercentiles = quantiles(percentRises);
  return {
    absoluteRises,
    percentRises,
    absolutePercentiles,
    percentagePercentiles,
    thresholds: {
      rising24h: {
        absolute: rounded(absolutePercentiles.p50),
        percent: round1(percentagePercentiles.p50),
      },
      meaningfulRise24h: {
        absolute: rounded(absolutePercentiles.p75),
        percent: round1(percentagePercentiles.p75),
      },
      sharpRise24h: {
        absolute: rounded(absolutePercentiles.p90),
        percent: round1(percentagePercentiles.p90),
      },
    },
  };
}
function summary(values: number[]) {
  if (!values.length) {
    return {
      min: null,
      p10: null,
      mean: null,
      median: null,
      p90: null,
      max: null,
    };
  }
  const q = quantiles(values);
  return {
    min: Math.min(...values),
    p10: q.p10,
    mean: round2(values.reduce((a, b) => a + b, 0) / values.length),
    median: q.p50,
    p90: q.p90,
    max: Math.max(...values),
  };
}
function counts(values: string[]) {
  const out: Record<string, number> = {};
  for (const value of values) out[value] = (out[value] ?? 0) + 1;
  return out;
}
function frequencyCounts(values: string[], total: number) {
  return Object.fromEntries(
    Object.entries(counts(values)).map((
      [key, count],
    ) => [key, { count, percent: total ? round2(count / total * 100) : null }]),
  );
}
async function fetchWithRetry(input: string | URL): Promise<Response> {
  const waits = [2_000, 5_000, 10_000];
  for (let attempt = 0; attempt <= waits.length; attempt++) {
    const response = await fetch(input);
    if (response.status !== 429 || attempt === waits.length) return response;
    await new Promise((resolve) => setTimeout(resolve, waits[attempt]));
  }
  throw new Error("unreachable fetch retry state");
}
function seasonDate(year: number, monthDay: string) {
  return `${monthDay < "07-01" ? year + 1 : year}-${monthDay}`;
}
function activeDayCount(start: string, end: string) {
  return daysBetween(`2024-${start}`, seasonDate(2024, end)) + 1;
}
function daysBetween(a: string, b: string) {
  return Math.round(
    (Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86_400_000,
  );
}
function rounded(value: number) {
  if (value < 100) return Math.round(value);
  if (value < 1000) return Math.round(value / 5) * 5;
  return Math.round(value / 10) * 10;
}
function round1(value: number) {
  return Math.round(value * 10) / 10;
}
function round2(value: number) {
  return Math.round(value * 100) / 100;
}
function finite(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function localDateTime(iso: string, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const read = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${read("year")}-${read("month")}-${read("day")}T${read("hour")}:${
    read("minute")
  }`;
}
