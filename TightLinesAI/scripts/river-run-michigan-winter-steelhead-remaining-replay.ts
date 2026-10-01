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
  seasonStartYear: number;
  stage: string;
  score: number;
  label: string;
  confidence: string;
  flowCfs: number | null;
  flowBand: string;
  waterTempF: number | null;
  temperatureSignal: string;
  targetAirMeanF: number | null;
  priorAirMeanF: number | null;
  airDeltaF: number | null;
  targetAirRangeF: number | null;
  largestDailyAirSwingF: number | null;
  airPattern: string;
  spread: number;
  bestBlock: string;
  blocks: ActivityBlock[];
  headline: string;
  detail: string;
  tip: string;
};

const runId = argumentValue("--run-id") ?? fail("--run-id is required");
const run =
  RIVER_RUN_RUN_PROFILES.find((candidate) => candidate.runId === runId) ??
    fail(`Unknown run ${runId}`);
const river =
  RIVER_RUN_RIVER_PROFILES.find((candidate) =>
    candidate.riverId === run.riverId
  ) ?? fail(`Missing river ${run.riverId}`);
if (
  run.activity?.profile !== "steelhead_winter_holding" ||
  !run.activity.winterTemperatureMode
) {
  fail(`${runId} is not a supported remaining-cohort winter profile`);
}

const usesMeasuredWater = run.activity.winterTemperatureMode ===
  "measured_water";
const usesRiver = run.activity.weights.riverBehavior > 0;
const gauge = usesRiver ? getPrimaryHydraulicSource(river) : null;
const weatherPoint =
  river.weatherPoints.find((point) => point.role === "primary") ??
    fail(`${runId} lacks a primary weather point`);
const startYear = Number(
  argumentValue("--start-year") ?? (usesMeasuredWater ? "2022" : "2021"),
);
const endYear = Number(argumentValue("--end-year") ?? "2025");
const firstDate = seasonDate(startYear, run.runWindow.start);
const lastDate = seasonEndDate(endYear, run.runWindow.end, run.runWindow.start);

const [flowByDate, temperatureByDate, weatherByDate] = await Promise.all([
  usesRiver && gauge
    ? fetchUsgsDailyFlowBaselineObservations({
      fetchFn: fetch,
      riverId: river.riverId,
      siteId: gauge.siteId,
      startDate: addDays(firstDate, -4),
      endDate: lastDate,
    }).then((items) =>
      new Map(items.map((item) => [item.localDate, item.value]))
    )
    : Promise.resolve(new Map<string, number>()),
  usesMeasuredWater
    ? fetchMeasuredTemperature(addDays(firstDate, -4), lastDate)
    : Promise.resolve(new Map<string, number>()),
  fetchArchivedWeather(addDays(firstDate, -4), lastDate),
]);

const missing = {
  flow: 0,
  priorFlow: 0,
  measuredWaterTemperature: 0,
  measuredWaterHistory: 0,
  hourlyWeather: 0,
  airTemperatureHistory: 0,
};
const rows: Row[] = [];
let expectedDays = 0;

for (
  let seasonStartYear = startYear;
  seasonStartYear <= endYear;
  seasonStartYear++
) {
  const start = seasonDate(seasonStartYear, run.runWindow.start);
  const end = seasonEndDate(
    seasonStartYear,
    run.runWindow.end,
    run.runWindow.start,
  );
  for (let date = start; date <= end; date = addDays(date, 1)) {
    expectedDays++;
    const flow = flowByDate.get(date);
    const priorFlow = flowByDate.get(addDays(date, -1));
    const waterTemp = temperatureByDate.get(date);
    const waterTemp24 = temperatureByDate.get(addDays(date, -1));
    const waterTemp72 = temperatureByDate.get(addDays(date, -3));
    const targetWeather = weatherByDate.get(date) ?? [];
    const weatherContext = Array.from(
      { length: 4 },
      (_, index) => weatherByDate.get(addDays(date, index - 3)) ?? [],
    ).flat();
    const air = airContext(weatherContext, date);

    if (usesRiver && flow == null) missing.flow++;
    if (usesRiver && priorFlow == null) missing.priorFlow++;
    if (usesMeasuredWater && waterTemp == null) {
      missing.measuredWaterTemperature++;
    }
    if (
      usesMeasuredWater && (waterTemp24 == null || waterTemp72 == null)
    ) missing.measuredWaterHistory++;
    if (targetWeather.length < 20) missing.hourlyWeather++;
    if (!usesMeasuredWater && !air) missing.airTemperatureHistory++;
    if (
      (usesRiver && (flow == null || priorFlow == null)) ||
      (usesMeasuredWater &&
        (waterTemp == null || waterTemp24 == null || waterTemp72 == null)) ||
      targetWeather.length < 20 || (!usesMeasuredWater && !air)
    ) continue;

    const hydraulic = run.activity.hydraulicTrend;
    const flowTrend = usesRiver && flow != null && priorFlow != null
      ? resolveFlowTrendSignal({
        currentValue: flow,
        value24hAgo: priorFlow,
        rising24hAbsolute: hydraulic?.rising24h.absolute,
        rising24hPercent: hydraulic?.rising24h.percent,
        meaningfulRise24hAbsolute: hydraulic?.meaningfulRise24h.absolute,
        meaningfulRise24hPercent: hydraulic?.meaningfulRise24h.percent,
        sharpRise24hAbsolute: hydraulic?.sharpRise24h.absolute,
        sharpRise24hPercent: hydraulic?.sharpRise24h.percent,
      }).rawSignal
      : "unknown" as const;
    const temperatureSignal = usesMeasuredWater && waterTemp != null &&
        waterTemp24 != null && waterTemp72 != null
      ? resolveTemperatureTrendSignal({
        sourceType: "nearby_gauge",
        delta24hF: waterTemp - waterTemp24,
        delta72hF: waterTemp - waterTemp72,
        hasEnoughValues: true,
      }).rawSignal
      : "neutral_missing" as const;
    const flowBand = usesRiver && flow != null && run.fishabilityBands
      ? resolveAdminOverrideBand(flow, run.fishabilityBands)
      : undefined;
    const stage = resolveRunStage(run, date);
    const result = scoreActivity({
      rules: run.activity,
      requestDate: date,
      targetDate: date,
      runStage: stage.stage,
      staging: false,
      waterTempF: usesMeasuredWater ? waterTemp ?? null : null,
      waterTemperatureFreshness: usesMeasuredWater ? "fresh" : "missing",
      temperatureTrend: temperatureSignal,
      gaugeFreshness: usesRiver ? "fresh" : "missing",
      weatherFreshness: "fresh",
      flowBand,
      currentHydraulicValue: flow ?? null,
      fishabilityBands: run.fishabilityBands,
      flowSignal: flowTrend,
      hourlyWeather: usesMeasuredWater ? targetWeather : weatherContext,
      copyStrategy: run.runStageCopyStrategy,
    });
    if (result.score == null || result.blocks.length === 0) continue;
    const scores = result.blocks.map((block) => block.score);
    const best = result.blocks.toSorted((a, b) => b.score - a.score)[0];
    rows.push({
      date,
      seasonStartYear,
      stage: stage.stage,
      score: result.score,
      label: result.label,
      confidence: result.confidence,
      flowCfs: flow == null ? null : round2(flow),
      flowBand: flowBand ?? "not_scored",
      waterTempF: waterTemp == null ? null : round2(waterTemp),
      temperatureSignal,
      targetAirMeanF: air?.targetMeanF ?? null,
      priorAirMeanF: air?.priorMeanF ?? null,
      airDeltaF: air?.deltaF ?? null,
      targetAirRangeF: air?.targetRangeF ?? null,
      largestDailyAirSwingF: air?.largestDailySwingF ?? null,
      airPattern: air?.pattern ?? "measured_water_model",
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
const reviewRows = stratifiedReview(rows, 100);
const caps = run.activity.caps;
const invariants = {
  incompleteDaylightBlocks:
    rows.filter((row) => row.blocks.length !== 3).length,
  dailyScoreOutsideBlockRange: rows.filter((row) => {
    const values = row.blocks.map((block) => block.score);
    return row.score < Math.min(...values) || row.score > Math.max(...values);
  }).length,
  nonLimitedProxyConfidence: usesMeasuredWater
    ? 0
    : rows.filter((row) =>
      row.confidence !== "Limited" || !row.detail.includes("Limited") ||
      !row.detail.includes(
        "never reported or treated as measured water temperature",
      )
    ).length,
  proxyTodayCapBroken: usesMeasuredWater
    ? 0
    : rows.filter((row) =>
      row.score > (run.activity!.dataMode === "weather_only"
        ? caps.weatherOnlyMaximum ?? 64
        : 69)
    ).length,
  persistentColdCapBroken: usesMeasuredWater
    ? 0
    : rows.filter((row) =>
      row.targetAirMeanF != null && row.targetAirMeanF < 28 && row.score > 39
    ).length,
  largeSwingCapBroken: usesMeasuredWater
    ? 0
    : rows.filter((row) => row.airPattern === "large_swing" && row.score > 39)
      .length,
  measuredNearFreezingCapBroken: !usesMeasuredWater
    ? 0
    : rows.filter((row) =>
      row.waterTempF != null && row.waterTempF <= 33.5 && row.score > 29
    ).length,
  blownOutCapBroken: !usesRiver
    ? 0
    : rows.filter((row) => row.flowBand === "blown_out" && row.score > 19)
      .length,
  rainReceivedIndependentCredit:
    rows.filter((row) =>
      !row.detail.includes("Rain receives no independent positive score")
    ).length,
  scopeCopyMissing:
    rows.filter((row) =>
      run.activity?.scopeCopy && !row.detail.includes(run.activity.scopeCopy)
    ).length,
  steelheadMortalityLanguage:
    rows.filter((row) =>
      /spent|dying|deteriorat|mortality/i.test(
        `${row.headline} ${row.detail} ${row.tip}`,
      )
    ).length,
};

const report = {
  auditVersion: `${run.riverId}-winter-steelhead-pass2-replay-v1`,
  runId: run.runId,
  rulesVersion: run.activity.version,
  mode: run.activity.winterTemperatureMode,
  replayYears: `${startYear}-${endYear}`,
  sourceMethod: {
    weather:
      `Open-Meteo archived hourly radiation, clear-sky radiation, cloud, precipitation, is_day, and 2 m air temperature at ${weatherPoint.weatherPointId}; UTC hours converted through America/Detroit historical time rules.`,
    hydraulics: gauge
      ? `USGS ${gauge.siteId} approved daily mean discharge, used only for its configured reach.`
      : "No hydraulic series is scored; weather cannot infer river level or clarity.",
    waterTemperature: usesMeasuredWater
      ? `Configured measured series ${
        run.waterTemperature?.sourcePriority.join(", ")
      } via Monitor My Watershed; daily medians with source-consistent 24/72-hour trend. Air remains context only.`
      : "No measured-water series is accepted. The model uses a deliberately Limited and capped multi-day air-temperature proxy without converting air to water.",
  },
  expectedDays,
  usableDays: rows.length,
  coveragePercent: round2(rows.length / expectedDays * 100),
  missing,
  dayScore: summary(rows.map((row) => row.score)),
  blockScore: summary(blocks.map((block) => block.score)),
  dayLabels: counts(rows.map((row) => row.label)),
  byMonth: groupBy(rows, (row) => monthName(row.date.slice(5, 7))),
  byWinterSeason: groupBy(rows, (row) => String(row.seasonStartYear)),
  byStage: groupBy(rows, (row) => row.stage),
  byAirPattern: usesMeasuredWater
    ? null
    : groupBy(rows, (row) => row.airPattern),
  byTargetAirBand: usesMeasuredWater ? null : groupBy(rows, (row) => {
    const value = row.targetAirMeanF ?? -999;
    return value < 20
      ? "below20F"
      : value < 28
      ? "20To28F"
      : value < 34
      ? "28To34F"
      : value < 40
      ? "34To40F"
      : value < 46
      ? "40To46F"
      : "atLeast46F";
  }),
  byMeasuredWaterBand: !usesMeasuredWater ? null : groupBy(rows, (row) => {
    const value = row.waterTempF ?? -999;
    return value <= 33.5
      ? "atOrBelow33_5F"
      : value < 35
      ? "above33_5To35F"
      : value < 38
      ? "35To38F"
      : value <= 45
      ? "38To45F"
      : "above45F";
  }),
  byMeasuredWaterTrend: !usesMeasuredWater
    ? null
    : groupBy(rows, (row) => row.temperatureSignal),
  byFlowBand: usesRiver ? groupBy(rows, (row) => row.flowBand) : null,
  cloudWindowAudit: cloudAudit(rows),
  spread: summary(rows.map((row) => row.spread)),
  topActivityDays: rows.toSorted((a, b) =>
    b.score - a.score ||
    a.date.localeCompare(b.date)
  ).slice(0, 15).map(compactRow),
  lowestActivityDays: rows.toSorted((a, b) =>
    a.score - b.score ||
    a.date.localeCompare(b.date)
  ).slice(0, 15).map(compactRow),
  invariants,
  reviewSampleSize: reviewRows.length,
  reviewSampleByStage: counts(reviewRows.map((row) => row.stage)),
};

if (Deno.args.includes("--write")) {
  const slug = river.riverId.replaceAll("_", "-");
  await Deno.mkdir("docs/audits", { recursive: true });
  await Deno.writeTextFile(
    `docs/audits/river-run-${slug}-winter-steelhead-remaining-pass2-replay.json`,
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await Deno.writeTextFile(
    `docs/audits/river-run-${slug}-winter-steelhead-remaining-pass2-review-100.csv`,
    reviewCsv(reviewRows),
  );
}

console.log(JSON.stringify(
  Deno.args.includes("--summary")
    ? {
      runId: report.runId,
      mode: report.mode,
      expectedDays: report.expectedDays,
      usableDays: report.usableDays,
      coveragePercent: report.coveragePercent,
      dayScore: report.dayScore,
      dayLabels: report.dayLabels,
      byAirPattern: report.byAirPattern,
      byMeasuredWaterBand: report.byMeasuredWaterBand,
      byFlowBand: report.byFlowBand,
      invariants: report.invariants,
    }
    : report,
  null,
  2,
));

if (
  rows.length < expectedDays * .8 ||
  reviewRows.length !== 100 ||
  Object.values(invariants).some((count) => count > 0)
) Deno.exit(1);

async function fetchMeasuredTemperature(start: string, end: string) {
  const sourceId = run.waterTemperature?.sourcePriority[0] ??
    fail(`${runId} lacks measured-water source priority`);
  const source =
    river.waterTemperatureSources.find((candidate) =>
      candidate.sourceId === sourceId
    ) ?? fail(`${runId} lacks configured source ${sourceId}`);
  if (source.provider !== "MONITOR_MY_WATERSHED") {
    fail(`${runId} Pass 2 expects Monitor My Watershed temperature`);
  }
  const values = new Map<string, number[]>();
  for (
    let year = Number(start.slice(0, 4));
    year <= Number(end.slice(0, 4));
    year++
  ) {
    const csv = await fetchMonitorMyWatershedTemperature({
      fetchFn: fetch,
      source,
      endAtUtc: `${year}-12-31T23:59:59.000Z`,
      lookbackDays: 370,
    });
    if (!csv) continue;
    for (
      const item of parseMonitorMyWatershedTemperature({ csv, source })
        .observations
    ) {
      const date = localDate(item.observedAt, river.timezone);
      if (date < start || date > end) continue;
      values.set(date, [...(values.get(date) ?? []), item.waterTempF]);
    }
  }
  return new Map([...values].map(([date, items]) => [date, median(items)]));
}

async function fetchArchivedWeather(start: string, end: string) {
  const result = new Map<string, ActivityWeatherHour[]>();
  const params = new URLSearchParams({
    latitude: String(weatherPoint.lat),
    longitude: String(weatherPoint.lon),
    start_date: start,
    end_date: end,
    hourly:
      "precipitation,cloud_cover,shortwave_radiation,shortwave_radiation_clear_sky,temperature_2m,is_day",
    precipitation_unit: "inch",
    temperature_unit: "fahrenheit",
    timezone: "UTC",
  });
  const response = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?${params}`,
  );
  if (!response.ok) fail(`Open-Meteo failed for ${runId}: ${response.status}`);
  const payload = await response.json() as {
    hourly?: Record<string, Array<string | number | null> | undefined>;
  };
  const hourly = payload.hourly ?? {};
  const times = hourly.time ?? [];
  for (const [index, raw] of times.entries()) {
    const local = localDateTime(`${String(raw)}Z`, river.timezone);
    const date = local.slice(0, 10);
    const item: ActivityWeatherHour = {
      time_local: local,
      precipitation_in: finite(hourly.precipitation?.[index]),
      cloud_cover_pct: finite(hourly.cloud_cover?.[index]),
      shortwave_w_m2: finite(hourly.shortwave_radiation?.[index]),
      clear_sky_shortwave_w_m2: finite(
        hourly.shortwave_radiation_clear_sky?.[index],
      ),
      temperature_2m_f: finite(hourly.temperature_2m?.[index]),
      is_day: finite(hourly.is_day?.[index]),
    };
    result.set(date, [...(result.get(date) ?? []), item]);
  }
  return result;
}

function airContext(hours: ActivityWeatherHour[], targetDate: string) {
  const byDate = new Map<string, number[]>();
  for (const hour of hours) {
    if (hour.temperature_2m_f == null) continue;
    const date = hour.time_local.slice(0, 10);
    byDate.set(date, [...(byDate.get(date) ?? []), hour.temperature_2m_f]);
  }
  const target = byDate.get(targetDate) ?? [];
  const previous = [...byDate.entries()].filter(([date, values]) =>
    date < targetDate && values.length >= 20
  ).toSorted(([a], [b]) => a.localeCompare(b)).slice(-3);
  if (target.length < 20 || previous.length < 2) return null;
  const targetMeanF = mean(target);
  const priorMeans = previous.map(([, values]) => mean(values));
  const priorMeanF = mean(priorMeans);
  const deltaF = targetMeanF - priorMeanF;
  const dailyMeans = [...priorMeans, targetMeanF];
  const largestDailyAirSwingF = Math.max(
    ...dailyMeans.slice(1).map(
      (value, index) => Math.abs(value - dailyMeans[index]),
    ),
  );
  const targetAirRangeF = Math.max(...target) - Math.min(...target);
  const largeSwing = largestDailyAirSwingF > 10 || targetAirRangeF > 20 ||
    Math.abs(deltaF) > 10;
  const pattern = largeSwing
    ? "large_swing"
    : targetMeanF < 28
    ? "persistent_cold"
    : deltaF >= 1 && deltaF <= 6
    ? "gradual_warming"
    : Math.abs(deltaF) < 1
    ? "stable"
    : deltaF < -2
    ? "cooling"
    : "variable";
  return {
    targetMeanF: round2(targetMeanF),
    priorMeanF: round2(priorMeanF),
    deltaF: round2(deltaF),
    targetRangeF: round2(targetAirRangeF),
    largestDailySwingF: round2(largestDailyAirSwingF),
    pattern,
  };
}

function groupBy(input: Row[], key: (row: Row) => string) {
  return Object.fromEntries(
    [...new Set(input.map(key))].toSorted().map((name) => {
      const selected = input.filter((row) => key(row) === name);
      return [name, {
        days: selected.length,
        scores: summary(selected.map((row) => row.score)),
        labels: counts(selected.map((row) => row.label)),
      }];
    }),
  );
}

function cloudAudit(input: Row[]) {
  const comparisons = input.flatMap((row) => {
    const sorted = row.blocks.filter((block) => block.cloudCoverPct != null)
      .toSorted((a, b) => (a.cloudCoverPct ?? 0) - (b.cloudCoverPct ?? 0));
    if (sorted.length < 2) return [];
    const clear = sorted[0];
    const cloudy = sorted.at(-1)!;
    const contrast = (cloudy.cloudCoverPct ?? 0) - (clear.cloudCoverPct ?? 0);
    return contrast >= 40
      ? [{ contrast, scoreDifference: cloudy.score - clear.score }]
      : [];
  });
  return {
    daysWithAtLeast40PointCloudContrast: comparisons.length,
    cloudierHigher:
      comparisons.filter((item) => item.scoreDifference > 0).length,
    tied: comparisons.filter((item) => item.scoreDifference === 0).length,
    cloudierLower:
      comparisons.filter((item) => item.scoreDifference < 0).length,
    scoreDifference: summary(comparisons.map((item) => item.scoreDifference)),
  };
}

function stratifiedReview(input: Row[], size: number) {
  const quotas: Record<string, number> = {
    beginning: 20,
    building: 40,
    peak: 20,
    tapering: 10,
    ending: 10,
  };
  const selected = Object.entries(quotas).flatMap(([stage, quota]) => {
    const pool = input.filter((row) => row.stage === stage).toSorted((a, b) =>
      a.score - b.score || a.date.localeCompare(b.date)
    );
    return Array.from(
      { length: Math.min(quota, pool.length) },
      (_, index) =>
        pool[Math.round(index * (pool.length - 1) / Math.max(1, quota - 1))],
    );
  });
  const selectedDates = new Set(selected.map((row) => row.date));
  const remainder = input.filter((row) => !selectedDates.has(row.date))
    .toSorted((a, b) => a.score - b.score || a.date.localeCompare(b.date));
  return [
    ...selected,
    ...remainder.slice(0, Math.max(0, size - selected.length)),
  ]
    .slice(0, size);
}

function reviewCsv(input: Row[]) {
  const header = [
    "date",
    "stage",
    "score",
    "label",
    "flow_cfs",
    "flow_band",
    "water_temp_f",
    "target_air_mean_f",
    "prior_air_mean_f",
    "air_delta_f",
    "target_air_range_f",
    "largest_daily_air_swing_f",
    "air_pattern",
    "spread",
    "block_1",
    "block_2",
    "block_3",
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
        row.flowCfs,
        row.flowBand,
        row.waterTempF,
        row.targetAirMeanF,
        row.priorAirMeanF,
        row.airDeltaF,
        row.targetAirRangeF,
        row.largestDailyAirSwingF,
        row.airPattern,
        row.spread,
        ...row.blocks.map((block) => `${block.id}:${block.score}`),
        row.bestBlock,
        row.headline,
        row.detail,
        row.tip,
      ].map(csv).join(",")
    ).join("\n")
  }\n`;
}

function compactRow(row: Row) {
  return {
    date: row.date,
    score: row.score,
    label: row.label,
    flowCfs: row.flowCfs,
    flowBand: row.flowBand,
    waterTempF: row.waterTempF,
    targetAirMeanF: row.targetAirMeanF,
    airDeltaF: row.airDeltaF,
    airPattern: row.airPattern,
    bestBlock: row.bestBlock,
    spread: row.spread,
  };
}

function summary(values: number[]) {
  const sorted = values.filter(Number.isFinite).toSorted((a, b) => a - b);
  if (!sorted.length) {
    return {
      min: null,
      p10: null,
      median: null,
      p90: null,
      max: null,
      mean: null,
    };
  }
  const percentile = (p: number) => sorted[Math.round((sorted.length - 1) * p)];
  return {
    min: sorted[0],
    p10: percentile(.1),
    median: percentile(.5),
    p90: percentile(.9),
    max: sorted.at(-1)!,
    mean: round2(mean(sorted)),
  };
}

function counts(values: string[]) {
  return Object.fromEntries(
    [...new Set(values)].toSorted().map((value) => [
      value,
      values.filter((candidate) => candidate === value).length,
    ]),
  );
}

function seasonDate(year: number, monthDay: string) {
  return `${year}-${monthDay}`;
}

function seasonEndDate(year: number, end: string, start: string) {
  return `${end < start ? year + 1 : year}-${end}`;
}

function localDate(iso: string, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function localDateTime(iso: string, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}T${
    value("hour")
  }:00`;
}

function median(values: number[]) {
  const sorted = values.toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function mean(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function finite(value: unknown): number | null {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function monthName(month: string) {
  return ({ "12": "December", "01": "January", "02": "February" } as Record<
    string,
    string
  >)[month] ?? month;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function csv(value: unknown) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function argumentValue(name: string) {
  const index = Deno.args.indexOf(name);
  return index >= 0 ? Deno.args[index + 1] : undefined;
}

function fail(message: string): never {
  throw new Error(message);
}
