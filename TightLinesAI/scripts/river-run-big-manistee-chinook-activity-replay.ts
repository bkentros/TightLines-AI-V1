import {
  addDays,
  fetchMonitorMyWatershedTemperature,
  fetchUsgsDailyFlowBaselineObservations,
  getPrimaryHydraulicSource,
  parseMonitorMyWatershedTemperature,
  resolveAdminOverrideBand,
  resolveFlowTrendSignal,
  resolveRunStage,
  resolveTemperatureTrendSignal,
  RIVER_RUN_DRAFT_RIVER_PROFILES,
  RIVER_RUN_DRAFT_RUN_PROFILES,
  RIVER_RUN_RIVER_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  scoreActivity,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";
import type {
  ActivityBlock,
  ActivityWeatherHour,
} from "../supabase/functions/_shared/riverRunEngine/scoring/activity.ts";

type Row = {
  date: string;
  stage: string;
  staging: boolean;
  score: number;
  label: string;
  waterTempF: number;
  flowCfs: number;
  flowBand: string;
  flowSignal: string;
  flowAbsoluteChange24h: number;
  flowPercentChange24h: number;
  temperatureSignal: string;
  spread: number;
  bestBlock: string;
  blocks: ActivityBlock[];
  headline: string;
  detail: string;
  tip: string;
};

const requestedRunId = argumentValue("--run-id") ??
  "big_manistee_fall_chinook";
const allRuns = [...RIVER_RUN_RUN_PROFILES, ...RIVER_RUN_DRAFT_RUN_PROFILES];
const allRivers = [
  ...RIVER_RUN_RIVER_PROFILES,
  ...RIVER_RUN_DRAFT_RIVER_PROFILES,
];
const run = allRuns.find((item) => item.runId === requestedRunId) ??
  fail(`Unknown River Run profile: ${requestedRunId}`);
const selectedRiver = allRivers.find((item) => item.riverId === run.riverId) ??
  fail(`River profile missing for ${requestedRunId}`);
const speciesSlug = run.species === "chinook_salmon"
  ? "chinook"
  : run.species === "coho_salmon"
  ? "coho"
  : run.species === "lake_run_brown_trout"
  ? "brown-trout"
  : "steelhead";
const terminalSalmon = speciesSlug === "chinook" || speciesSlug === "coho";
const repeatSpawner = speciesSlug === "brown-trout";

if (
  run.primitiveCapabilities.activity.status !== "available" ||
  !run.activity || run.activity.dataMode === "weather_only" ||
  !run.fishabilityBands || !run.waterTemperature
) {
  throw new Error(
    `${selectedRiver.displayName} ${speciesSlug} does not have an observed-river Activity replay contract.`,
  );
}
const activityRules = Deno.args.includes("--without-stage-adjustment")
  ? {
    ...run.activity,
    version: `${run.activity.version}-baseline-without-stage-adjustment`,
    stageResponseAdjustment: undefined,
  }
  : run.activity;
const gauge = getPrimaryHydraulicSource(selectedRiver);
const temperatureSource = run.waterTemperature.sourcePriority.flatMap(
  (sourceId) =>
    selectedRiver.waterTemperatureSources.filter((source) =>
      source.sourceId === sourceId
    ),
)[0];
if (!temperatureSource) {
  throw new Error(
    `${selectedRiver.displayName} does not have an accepted water-temperature source for this replay.`,
  );
}
const weatherPoint = selectedRiver.weatherPoints.find((point) =>
  point.role === "primary"
);
if (!weatherPoint) {
  throw new Error(
    `${selectedRiver.displayName} primary weather point missing.`,
  );
}

const startYear = Number(argumentValue("--start-year") ?? 2007);
const endYear = Number(argumentValue("--end-year") ?? 2025);
const firstDate = `${startYear}-${run.runWindow.stagingStart}`;
const lastDate = seasonDate(endYear, run.runWindow.lateEnd);
const [flowByDate, temperatureByDate, weatherByDate] = await Promise.all([
  fetchUsgsDailyFlowBaselineObservations({
    fetchFn: fetch,
    riverId: selectedRiver.riverId,
    siteId: gauge.siteId,
    startDate: addDays(firstDate, -4),
    endDate: lastDate,
  }).then((items) =>
    new Map(items.map((item) => [item.localDate, item.value]))
  ),
  fetchDailyTemperature(addDays(firstDate, -4), lastDate),
  fetchHourlyWeather(),
]);

const rows: Row[] = [];
const missing = {
  flow: 0,
  priorFlow: 0,
  temperature: 0,
  temperatureHistory: 0,
  weather: 0,
};
for (let year = startYear; year <= endYear; year++) {
  for (
    let date = `${year}-${run.runWindow.stagingStart}`;
    date <= seasonDate(year, run.runWindow.lateEnd);
    date = addDays(date, 1)
  ) {
    const flow = flowByDate.get(date);
    const priorFlow = flowByDate.get(addDays(date, -1));
    const temp = temperatureByDate.get(date);
    const temp24 = temperatureByDate.get(addDays(date, -1));
    const temp72 = temperatureByDate.get(addDays(date, -3));
    const weather = weatherByDate.get(date) ?? [];
    if (flow == null) missing.flow++;
    if (priorFlow == null) missing.priorFlow++;
    if (temp == null) missing.temperature++;
    if (temp24 == null || temp72 == null) missing.temperatureHistory++;
    if (weather.length < 16) missing.weather++;
    if (
      flow == null || priorFlow == null || temp == null || temp24 == null ||
      temp72 == null || weather.length < 16
    ) continue;

    const hydraulic = activityRules.hydraulicTrend ?? run.push?.hydraulic;
    const flowTrend = resolveFlowTrendSignal({
      currentValue: flow,
      value24hAgo: priorFlow,
      rising24hAbsolute: hydraulic?.rising24h.absolute,
      rising24hPercent: hydraulic?.rising24h.percent,
      meaningfulRise24hAbsolute: hydraulic?.meaningfulRise24h.absolute,
      meaningfulRise24hPercent: hydraulic?.meaningfulRise24h.percent,
      sharpRise24hAbsolute: hydraulic?.sharpRise24h.absolute,
      sharpRise24hPercent: hydraulic?.sharpRise24h.percent,
    });
    const temperatureTrend = resolveTemperatureTrendSignal({
      sourceType: temperatureSource.sourceType,
      delta24hF: temp - temp24,
      delta72hF: temp - temp72,
      hasEnoughValues: true,
    });
    const flowBand = resolveAdminOverrideBand(flow, run.fishabilityBands);
    const stage = resolveRunStage(run, date);
    const result = scoreActivity({
      rules: activityRules,
      requestDate: date,
      targetDate: date,
      runStage: stage.stage,
      staging: stage.stagingContext,
      waterTempF: temp,
      temperatureTrend: temperatureTrend.rawSignal,
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand,
      currentHydraulicValue: flow,
      fishabilityBands: run.fishabilityBands,
      flowSignal: flowTrend.rawSignal,
      hourlyWeather: weather,
    });
    const scores = result.blocks.map((block) => block.score);
    const best = [...result.blocks].sort((a, b) => b.score - a.score)[0];
    rows.push({
      date,
      stage: stage.stage,
      staging: stage.stagingContext,
      score: result.score!,
      label: result.label,
      waterTempF: round2(temp),
      flowCfs: round2(flow),
      flowBand: flowBand ?? "unknown",
      flowSignal: flowTrend.rawSignal,
      flowAbsoluteChange24h: round2(flow - priorFlow),
      flowPercentChange24h: round2((flow - priorFlow) / priorFlow * 100),
      temperatureSignal: temperatureTrend.rawSignal,
      spread: Math.max(...scores) - Math.min(...scores),
      bestBlock: best.id,
      blocks: result.blocks,
      headline: result.headline,
      detail: result.detail,
      tip: result.tip,
    });
  }
}

const blocks = rows.flatMap((row) => row.blocks);
const activityScopeCopy = activityRules.scopeCopy;
const foreignRiverPattern = new RegExp(
  allRivers
    .filter((item) => item.riverId !== selectedRiver.riverId)
    .map((item) => item.displayName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "i",
);
const invariants = {
  incompleteBlocks: rows.filter((row) => row.blocks.length !== 4).length,
  incompleteCopy:
    rows.filter((row) =>
      !row.headline || !row.detail || !row.tip ||
      !/strongest window/i.test(row.detail)
    ).length,
  missingTailwaterScope:
    rows.filter((row) =>
      activityScopeCopy ? !row.detail.includes(activityScopeCopy) : false
    ).length,
  prohibitedGeography:
    rows.filter((row) =>
      foreignRiverPattern.test(`${row.headline} ${row.detail} ${row.tip}`)
    ).length,
  dailyOutsideBlockRange: rows.filter((row) => {
    const values = row.blocks.map((block) => block.score);
    return row.score < Math.min(...values) || row.score > Math.max(...values);
  }).length,
  warmCapBroken:
    rows.filter((row) =>
      row.waterTempF >= activityRules.temperature.warmF &&
      row.blocks.some((block) =>
        block.score > (activityRules.caps.warmWaterMaximum ?? 39)
      )
    ).length,
  barrierCapBroken:
    rows.filter((row) =>
      row.waterTempF >= activityRules.temperature.barrierF &&
      row.blocks.some((block) => block.score >= 30)
    ).length,
  taperingPenaltyMisconfigured: !terminalSalmon
    ? (activityRules.caps.taperingPenalty == null &&
        activityRules.caps.lateRun === 100
      ? 0
      : 1)
    : typeof activityRules.caps.taperingPenalty === "number" &&
        activityRules.caps.taperingPenalty > 0
    ? 0
    : 1,
  endingCapBroken: !terminalSalmon
    ? 0
    : rows.filter((row) =>
      ["ending", "post_run"].includes(row.stage) &&
      row.blocks.some((block) =>
        block.score > lifecycleMaximum(row.date, row.stage)
      )
    ).length,
  lateOptimism: !terminalSalmon
    ? 0
    : rows.filter((row) =>
      row.stage === "post_run" &&
      ["Active", "Highly active"].includes(row.label)
    ).length,
  steelheadMortalityLanguage: speciesSlug !== "steelhead" ? 0 : rows.filter(
    (row) =>
      /spent|dying|deteriorat|mortality/i.test(
        `${row.headline} ${row.detail} ${row.tip}`,
      ),
  ).length,
  steelheadLateStagePenalty: speciesSlug !== "steelhead"
    ? 0
    : verifyNoSteelheadStagePenalty(),
  repeatSpawnerMortalityLanguage: !repeatSpawner ? 0 : rows.filter(
    (row) =>
      /spent|dying|deteriorat|mortality/i.test(
        `${row.headline} ${row.detail} ${row.tip}`,
      ),
  ).length,
  stageResponseShape: activityRules.stageResponseAdjustment
    ? verifyStageResponseShape()
    : 0,
};

function verifyNoSteelheadStagePenalty(): number {
  const date = "2026-12-20";
  const base = {
    rules: { ...activityRules, stageResponseAdjustment: undefined },
    requestDate: date,
    targetDate: date,
    staging: false,
    waterTempF: 50,
    temperatureTrend: "neutral" as const,
    gaugeFreshness: "fresh" as const,
    weatherFreshness: "fresh" as const,
    flowBand: "ideal" as const,
    currentHydraulicValue: 1650,
    fishabilityBands: run.fishabilityBands,
    flowSignal: "stable" as const,
    hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
      time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: 80,
      shortwave_w_m2: hour >= 8 && hour < 17 ? 120 : 0,
      clear_sky_shortwave_w_m2: hour >= 8 && hour < 17 ? 500 : 0,
      precipitation_in: 0,
    })),
  };
  const stages = ["peak", "tapering", "ending", "post_run"] as const;
  const scores = stages.map((runStage) =>
    scoreActivity({ ...base, runStage }).blocks.map((block) => block.score)
  );
  return scores.slice(1).some((value) =>
      value.some((score, index) => score !== scores[0][index])
    )
    ? 1
    : 0;
}

function verifyStageResponseShape(): number {
  if (speciesSlug === "steelhead") {
    const adjustment = activityRules.stageResponseAdjustment ?? {};
    const preRun = adjustment.pre_run ?? 0;
    const beginning = adjustment.beginning ?? 0;
    const building = adjustment.building ?? 0;
    const peak = adjustment.peak ?? 0;
    const lateStages = [
      adjustment.tapering ?? 0,
      adjustment.ending ?? 0,
      adjustment.post_run ?? 0,
    ];
    return preRun <= beginning && beginning <= building && building <= peak &&
        lateStages.every((value) => value === 0)
      ? 0
      : 1;
  }
  const means = Object.fromEntries(
    [
      "pre_run",
      "beginning",
      "building",
      "peak",
      "tapering",
      "ending",
      "post_run",
    ].map((stage) => {
      const scores = rows.filter((row) => row.stage === stage).map((row) =>
        row.score
      );
      return [
        stage,
        scores.reduce((total, value) => total + value, 0) / scores.length,
      ];
    }),
  );
  const shoulders = [means.building, means.tapering];
  const outerStages = [
    means.pre_run,
    means.beginning,
    means.ending,
    means.post_run,
  ];
  const configuredAdjustments = Object.values(
    activityRules.stageResponseAdjustment ?? {},
  );
  const isSeasonalShapeCalibration = configuredAdjustments.some((value) =>
    Math.abs(value ?? 0) >= 10
  );
  return shoulders.every((mean) =>
      mean < means.peak &&
      (!isSeasonalShapeCalibration || means.peak - mean <= 20)
    ) && outerStages.every((mean) => mean < means.peak)
    ? 0
    : 1;
}

function lifecycleMaximum(date: string, stage: string): number {
  const ramp = activityRules.caps.lifecycleRamp;
  const penalty = activityRules.caps.taperingPenalty ?? 0;
  if (!ramp) return activityRules.caps.ending;
  const year = Number(date.slice(0, 4));
  const start = Date.parse(`${year}-${ramp.taperingEnd}T00:00:00Z`);
  const end = Date.parse(`${year}-${ramp.endingEnd}T00:00:00Z`);
  const progress = Math.max(
    0,
    Math.min(1, (Date.parse(`${date}T00:00:00Z`) - start) / (end - start)),
  );
  return Math.round(
    (100 - penalty) +
      (activityRules.caps.ending - (100 - penalty)) * progress,
  );
}
const reviewRows = stratifiedReview(rows);
const temperatureMethod = temperatureSource.provider === "USGS"
  ? `${temperatureSource.name} USGS ${temperatureSource.siteId} daily mean measured water temperature`
  : `${temperatureSource.name} Monitor My Watershed series ${temperatureSource.seriesId} daily median measured water temperature`;
const report = {
  runId: run.runId,
  rulesVersion: activityRules.version,
  replayYears: `${startYear}-${endYear}`,
  method:
    `Historical mechanical ${speciesSlug} replay using ${gauge.name} USGS ${gauge.siteId} daily mean discharge, ${temperatureMethod}, and each four-hour block's Open-Meteo radiation, cloud cover, and precipitation. The read is scoped to ${
      activityRules.scopeCopy ?? selectedRiver.gaugeLimitationCopy
    } It validates scoring behavior and copy, not catch rates.`,
  expectedDays:
    activeDayCount(run.runWindow.stagingStart, run.runWindow.lateEnd) *
    (endYear - startYear + 1),
  usableDays: rows.length,
  missing,
  dayScore: summary(rows.map((row) => row.score)),
  blockScore: summary(blocks.map((block) => block.score)),
  uniqueDayScores: new Set(rows.map((row) => row.score)).size,
  uniqueBlockScores: new Set(blocks.map((block) => block.score)).size,
  dayLabels: counts(rows.map((row) => row.label)),
  blockLabels: counts(blocks.map((block) => block.activityLabel)),
  daysAtLeast90: rows.filter((row) => row.score >= 90).length,
  blocksAtLeast90: blocks.filter((block) => block.score >= 90).length,
  byStage: Object.fromEntries(
    [...new Set(rows.map((row) => row.stage))].toSorted().map((
      stage,
    ) => [stage, {
      days: rows.filter((row) => row.stage === stage).length,
      scores: summary(
        rows.filter((row) => row.stage === stage).map((row) => row.score),
      ),
      labels: counts(
        rows.filter((row) => row.stage === stage).map((row) => row.label),
      ),
    }]),
  ),
  stageByBlock: stageByBlockReport(),
  backHalf: backHalfSummary(rows),
  byTemperature: temperatureBands(rows),
  hydraulicAudit: {
    thresholds: activityRules.hydraulicTrend ?? run.push?.hydraulic ?? null,
    positiveAbsoluteChangeCfs: summary(
      rows.map((row) => row.flowAbsoluteChange24h).filter((value) => value > 0),
    ),
    positivePercentChange: summary(
      rows.map((row) => row.flowPercentChange24h).filter((value) => value > 0),
    ),
    signals: counts(rows.map((row) => row.flowSignal)),
  },
  bestBlocks: counts(rows.map((row) => row.bestBlock)),
  spread: summary(rows.map((row) => row.spread)),
  daysWithSpreadAtLeast10: rows.filter((row) => row.spread >= 10).length,
  daysWithSpreadAtLeast20: rows.filter((row) => row.spread >= 20).length,
  invariants,
  reviewSampleSize: reviewRows.length,
  reviewSampleByStage: counts(reviewRows.map((row) => row.stage)),
  widestSpreadDays: rows.toSorted((a, b) => b.spread - a.spread).slice(0, 12),
};

if (Deno.args.includes("--write")) {
  const variant = Deno.args.includes("--without-stage-adjustment")
    ? "-baseline-without-stage-adjustment"
    : "";
  await Deno.mkdir("docs/audits", { recursive: true });
  await Deno.writeTextFile(
    `docs/audits/river-run-${
      selectedRiver.riverId.replaceAll("_", "-")
    }-${speciesSlug}-activity-replay${variant}.json`,
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await Deno.writeTextFile(
    `docs/audits/river-run-${
      selectedRiver.riverId.replaceAll("_", "-")
    }-${speciesSlug}-activity-review-100${variant}.csv`,
    reviewCsv(reviewRows),
  );
}
console.log(JSON.stringify(
  Deno.args.includes("--summary")
    ? {
      runId: report.runId,
      rulesVersion: report.rulesVersion,
      expectedDays: report.expectedDays,
      usableDays: report.usableDays,
      coverage: round2(report.usableDays / report.expectedDays * 100),
      dayScore: report.dayScore,
      byStage: report.byStage,
      invariants: report.invariants,
    }
    : report,
  null,
  2,
));
if (
  rows.length < report.expectedDays * .8 ||
  Object.values(invariants).some((value) => value > 0)
) Deno.exit(1);

async function fetchDailyTemperature(
  startDate: string,
  endDate: string,
): Promise<Map<string, number>> {
  if (temperatureSource.provider === "MONITOR_MY_WATERSHED") {
    const values = new Map<string, number[]>();
    const firstYear = Number(startDate.slice(0, 4));
    const lastYear = Number(endDate.slice(0, 4));
    for (let year = firstYear; year <= lastYear; year++) {
      const csv = await fetchMonitorMyWatershedTemperature({
        fetchFn: fetch,
        source: temperatureSource,
        endAtUtc: `${year}-12-31T23:59:59.000Z`,
        lookbackDays: 370,
      });
      if (!csv) continue;
      for (
        const item of parseMonitorMyWatershedTemperature({
          csv,
          source: temperatureSource,
        }).observations
      ) {
        const date = localDate(item.observedAt, selectedRiver.timezone);
        if (date < startDate || date > endDate) continue;
        values.set(date, [...(values.get(date) ?? []), item.waterTempF]);
      }
    }
    return new Map(
      [...values].map(([date, items]) => [date, median(items)]),
    );
  }
  const params = new URLSearchParams({
    f: "json",
    monitoring_location_id: `USGS-${temperatureSource.siteId}`,
    parameter_code: "00010",
    statistic_id: "00003",
    datetime: `${startDate}/${endDate}`,
    limit: "10000",
  });
  const response = await fetch(
    `https://api.waterdata.usgs.gov/ogcapi/v0/collections/daily/items?${params}`,
  );
  if (!response.ok) {
    throw new Error(`USGS temperature request failed: ${response.status}`);
  }
  const payload = await response.json() as {
    features?: Array<{ properties?: Record<string, unknown> }>;
  };
  return new Map((payload.features ?? []).flatMap(({ properties }) => {
    const date = String(properties?.time ?? "").slice(0, 10);
    const c = Number(properties?.value);
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(c)
      ? [[date, c * 9 / 5 + 32] as const]
      : [];
  }));
}

async function fetchHourlyWeather(): Promise<
  Map<string, ActivityWeatherHour[]>
> {
  const result = new Map<string, ActivityWeatherHour[]>();
  for (let year = startYear; year <= endYear; year++) {
    const endDate = seasonDate(year, run.runWindow.lateEnd);
    const params = new URLSearchParams({
      latitude: String(weatherPoint!.lat),
      longitude: String(weatherPoint!.lon),
      start_date: `${year}-${run.runWindow.stagingStart}`,
      end_date: endDate,
      hourly:
        "precipitation,cloud_cover,shortwave_radiation,shortwave_radiation_clear_sky",
      precipitation_unit: "inch",
      timezone: selectedRiver.timezone,
    });
    const response = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?${params}`,
    );
    if (!response.ok) continue;
    const payload = await response.json() as {
      hourly?: {
        time?: string[];
        precipitation?: Array<number | null>;
        cloud_cover?: Array<number | null>;
        shortwave_radiation?: Array<number | null>;
        shortwave_radiation_clear_sky?: Array<number | null>;
      };
    };
    for (const [index, time] of (payload.hourly?.time ?? []).entries()) {
      const hour = Number(time.slice(11, 13));
      if (hour < 5 || hour >= 21) continue;
      const item: ActivityWeatherHour = {
        time_local: time,
        cloud_cover_pct: finite(payload.hourly?.cloud_cover?.[index]),
        shortwave_w_m2: finite(payload.hourly?.shortwave_radiation?.[index]),
        clear_sky_shortwave_w_m2: finite(
          payload.hourly?.shortwave_radiation_clear_sky?.[index],
        ),
        precipitation_in: finite(payload.hourly?.precipitation?.[index]),
      };
      const date = time.slice(0, 10);
      result.set(date, [...(result.get(date) ?? []), item]);
    }
  }
  return result;
}

function stratifiedReview(input: Row[]): Row[] {
  const quotas: Record<string, number> = {
    pre_run: 15,
    beginning: 15,
    building: 20,
    peak: 20,
    tapering: 15,
    ending: 8,
    post_run: 7,
  };
  return Object.entries(quotas).flatMap(([stage, quota]) => {
    const pool = input.filter((row) => row.stage === stage).toSorted((a, b) =>
      a.score - b.score || b.spread - a.spread || a.date.localeCompare(b.date)
    );
    return Array.from(
      { length: Math.min(quota, pool.length) },
      (_, index) =>
        pool[
          Math.round(
            index * (pool.length - 1) /
              Math.max(1, Math.min(quota, pool.length) - 1),
          )
        ],
    );
  });
}
function stageByBlockReport() {
  const stages = [...new Set(rows.map((row) => row.stage))].toSorted();
  const blockIds = ["05-09", "09-13", "13-17", "17-21"] as const;
  return stages.flatMap((stage) => {
    const stageRows = rows.filter((row) => row.stage === stage);
    const entries = blockIds.map((blockId) => {
      const samples = stageRows.flatMap((row) =>
        row.blocks.filter((block) => block.id === blockId)
      );
      return stageBlockEntry(stage, blockId, stageRows.length, samples);
    });
    return [
      ...entries,
      stageBlockEntry(
        stage,
        "all_blocks",
        stageRows.length,
        stageRows.flatMap((row) => row.blocks),
      ),
    ];
  });
}

function stageBlockEntry(
  stage: string,
  block: string,
  usableDays: number,
  samples: ActivityBlock[],
) {
  return {
    stage,
    block,
    usableDays,
    samples: samples.length,
    scores: summary(samples.map((sample) => sample.score)),
    labelShares: shares(samples.map((sample) => sample.activityLabel)),
    capConfidenceNotes:
      "Full confidence requires weather, measured Estabrook hydraulics, and measured Estabrook water temperature; missing inputs retain the configured fail-closed caps.",
  };
}

function temperatureBands(input: Row[]) {
  const preferredMin = activityRules.temperature.preferredMinF;
  const preferredMax = activityRules.temperature.preferredMaxF;
  const warm = activityRules.temperature.warmF;
  const barrier = activityRules.temperature.barrierF;
  return Object.fromEntries(
    [
      [`below${preferredMin}F`, (v: number) => v < preferredMin],
      [
        `from${preferredMin}To${preferredMax}F`,
        (v: number) => v >= preferredMin && v <= preferredMax,
      ],
      [
        `from${preferredMax}To${warm}F`,
        (v: number) => v > preferredMax && v < warm,
      ],
      [
        `from${warm}To${barrier}F`,
        (v: number) => v >= warm && v < barrier,
      ],
      [`atLeast${barrier}F`, (v: number) => v >= barrier],
    ].map(([name, predicate]) => {
      const selected = input.filter((row) =>
        (predicate as (v: number) => boolean)(row.waterTempF)
      );
      return [name, {
        days: selected.length,
        scores: summary(selected.map((row) => row.score)),
        labels: counts(selected.map((row) => row.label)),
      }];
    }),
  );
}
function backHalfSummary(input: Row[]) {
  const peakEnd = activityRules.caps.lifecycleRamp?.peakEnd;
  const taperEnd = activityRules.caps.lifecycleRamp?.taperingEnd;
  const endingEnd = activityRules.caps.lifecycleRamp?.endingEnd;
  if (!peakEnd || !taperEnd || !endingEnd) return {};
  const day = (monthDay: string, offset: number) =>
    addDays(`2024-${monthDay}`, offset).slice(5);
  const monthDay = (row: Row) => row.date.slice(5);
  const slices = {
    peakShoulder: [day(peakEnd, -3), peakEnd],
    taperingEarly: [day(peakEnd, 1), day(peakEnd, 4)],
    taperingLate: [day(taperEnd, -3), taperEnd],
    endingEarly: [day(taperEnd, 1), day(taperEnd, 4)],
    endingLate: [day(endingEnd, -3), endingEnd],
    residualTail: [day(endingEnd, 1), run.runWindow.lateEnd],
  };
  return Object.fromEntries(
    Object.entries(slices).map(([name, range]) => {
      const selected = input.filter((row) =>
        monthDay(row) >= range[0] && monthDay(row) <= range[1]
      );
      return [name, {
        window: `${range[0]}..${range[1]}`,
        days: selected.length,
        scores: summary(selected.map((row) => row.score)),
        labels: counts(selected.map((row) => row.label)),
        maximumBlock: selected.length
          ? Math.max(
            ...selected.flatMap((row) =>
              row.blocks.map((block) => block.score)
            ),
          )
          : null,
      }];
    }),
  );
}
function reviewCsv(input: Row[]): string {
  const header = [
    "date",
    "stage",
    "daily_score",
    "daily_label",
    "temp_f",
    "flow_cfs",
    "flow_band",
    "spread",
    "05_09",
    "09_13",
    "13_17",
    "17_21",
    "best_block",
    "headline",
    "detail",
    "tip",
  ];
  return `${header.join(",")}\n${
    input.map((row) =>
      [
        row.date,
        row.stage,
        row.score,
        row.label,
        row.waterTempF,
        row.flowCfs,
        row.flowBand,
        row.spread,
        ...row.blocks.map((block) => block.score),
        row.bestBlock,
        row.headline,
        row.detail,
        row.tip,
      ].map(csv).join(",")
    ).join("\n")
  }\n`;
}
function summary(values: number[]) {
  if (!values.length) {
    return {
      min: null,
      p10: null,
      median: null,
      p90: null,
      max: null,
      mean: null,
    };
  }
  const sorted = values.toSorted((a, b) => a - b);
  return {
    min: sorted[0],
    p10: sorted[Math.round((sorted.length - 1) * .1)],
    median: sorted[Math.round((sorted.length - 1) * .5)],
    p90: sorted[Math.round((sorted.length - 1) * .9)],
    max: sorted.at(-1),
    mean: round2(values.reduce((a, b) => a + b, 0) / values.length),
  };
}
function counts(values: string[]) {
  return Object.fromEntries(
    [...new Set(values)].toSorted().map((
      value,
    ) => [value, values.filter((item) => item === value).length]),
  );
}
function shares(values: string[]) {
  const total = values.length;
  return Object.fromEntries(
    Object.entries(counts(values)).map(([label, count]) => [
      label,
      total ? round2(Number(count) / total * 100) : 0,
    ]),
  );
}
function activeDayCount(start: string, end: string) {
  const endYear = end < start ? 2025 : 2024;
  return Math.round(
    (new Date(`${endYear}-${end}T12:00:00Z`).getTime() -
      new Date(`2024-${start}T12:00:00Z`).getTime()) / 86_400_000,
  ) + 1;
}
function seasonDate(startYear: number, monthDay: string) {
  return `${
    monthDay < run.runWindow.stagingStart ? startYear + 1 : startYear
  }-${monthDay}`;
}
function finite(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function median(values: number[]) {
  const sorted = values.toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}
function localDate(iso: string, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
function round2(value: number) {
  return Math.round(value * 100) / 100;
}
function csv(value: unknown) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
function argumentValue(flag: string) {
  const inline = Deno.args.find((arg) => arg.startsWith(`${flag}=`));
  if (inline) return inline.slice(flag.length + 1) || null;
  const index = Deno.args.indexOf(flag);
  return index >= 0 ? Deno.args[index + 1] ?? null : null;
}
function fail(message: string): never {
  throw new Error(message);
}
