import {
  addDays,
  fetchUsgsDailyFlowBaselineObservations,
  fetchUsgsDailyWaterTemperatureObservations,
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
  run.season !== "winter" || run.runType !== "holding" ||
  ![
    "steelhead_winter_holding",
    "brown_trout_winter_holding",
  ].includes(run.activity?.profile ?? "")
) fail(`${runId} is not a supported Wisconsin winter holding profile`);

const rules = run.activity!;
const airProxy = rules.winterTemperatureMode === "air_temperature_proxy";
const usesRiver = rules.weights.riverBehavior > 0;
const usesMeasuredWater = rules.winterTemperatureMode === "measured_water";
const hydraulicSourceId = rules.inputReach?.hydraulicSourceIds[0];
const gauge = hydraulicSourceId
  ? river.hydraulicSources.find((source) =>
    source.sourceId === hydraulicSourceId
  )
  : undefined;
const temperatureSourceId = rules.inputReach?.waterTemperatureSourceIds[0];
const temperatureSource = temperatureSourceId
  ? river.waterTemperatureSources.find((source) =>
    source.sourceId === temperatureSourceId
  )
  : undefined;
const weatherPointId = rules.inputReach?.weatherPointIds[0];
const weatherPoint =
  river.weatherPoints.find((point) =>
    point.weatherPointId === weatherPointId
  ) ?? fail(`${runId} lacks its configured weather point`);
if (usesRiver && !gauge) fail(`${runId} lacks its configured hydraulic source`);
if (usesMeasuredWater && !temperatureSource) {
  fail(`${runId} lacks its configured water-temperature source`);
}

const startYear = Number(argumentValue("--start-year") ?? "2021");
const endYear = Number(argumentValue("--end-year") ?? "2025");
const firstDate = seasonDate(startYear, run.runWindow.start);
const lastDate = seasonEndDate(endYear, run.runWindow.end, run.runWindow.start);
const [flowByDate, temperatureByDate, weatherByDate] = await Promise.all([
  usesRiver
    ? fetchUsgsDailyFlowBaselineObservations({
      fetchFn: fetch,
      riverId: river.riverId,
      siteId: gauge!.siteId,
      startDate: addDays(firstDate, -4),
      endDate: lastDate,
    }).then((items) =>
      new Map(items.map((item) => [item.localDate, item.value]))
    )
    : Promise.resolve(new Map<string, number>()),
  usesMeasuredWater
    ? fetchUsgsDailyWaterTemperatureObservations({
      fetchFn: fetch,
      sourceId: temperatureSource!.sourceId,
      siteId: temperatureSource!.siteId,
      startDate: addDays(firstDate, -4),
      endDate: lastDate,
    }).then((items) =>
      new Map(items.map((item) => [item.localDate, item.waterTempF]))
    )
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
    if (usesMeasuredWater && (waterTemp24 == null || waterTemp72 == null)) {
      missing.measuredWaterHistory++;
    }
    if (targetWeather.length < 20) missing.hourlyWeather++;
    if (airProxy && !air) missing.airTemperatureHistory++;
    if (
      (usesRiver && (flow == null || priorFlow == null)) ||
      targetWeather.length < 20 || (airProxy && !air)
    ) continue;

    const hydraulic = rules.hydraulicTrend;
    const flowSignal = usesRiver && flow != null && priorFlow != null
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
    const temperatureSignal = waterTemp != null && waterTemp24 != null &&
        waterTemp72 != null
      ? resolveTemperatureTrendSignal({
        sourceType: temperatureSource?.sourceType ?? "same_gauge",
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
      rules,
      requestDate: date,
      targetDate: date,
      runStage: stage.stage,
      staging: false,
      waterTempF: waterTemp ?? null,
      waterTemperatureFreshness: waterTemp == null ? "missing" : "fresh",
      temperatureTrend: temperatureSignal,
      gaugeFreshness: usesRiver ? "fresh" : "missing",
      weatherFreshness: "fresh",
      flowBand,
      currentHydraulicValue: flow ?? null,
      fishabilityBands: run.fishabilityBands,
      flowSignal,
      hourlyWeather: airProxy ? weatherContext : targetWeather,
      copyStrategy: run.runStageCopyStrategy,
    });
    if (result.score == null || result.blocks.length === 0) continue;
    const blockScores = result.blocks.map((block) => block.score);
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
      airPattern: air?.pattern ?? "measured_water_history_unavailable",
      spread: Math.max(...blockScores) - Math.min(...blockScores),
      bestBlock: best.id,
      blocks: result.blocks,
      headline: result.headline,
      detail: result.detail,
      tip: result.tip,
    });
  }
}

const reviewRows = stratifiedReview(rows, Math.min(100, rows.length));
const invariants = {
  incompleteDaylightBlocks:
    rows.filter((row) => row.blocks.length !== 3).length,
  dailyScoreOutsideBlockRange: rows.filter((row) => {
    const scores = row.blocks.map((block) => block.score);
    return row.score < Math.min(...scores) || row.score > Math.max(...scores);
  }).length,
  proxyConfidenceNotLimited: airProxy
    ? rows.filter((row) => row.confidence !== "Limited").length
    : 0,
  proxyCeilingBroken: airProxy
    ? rows.filter((row) =>
      row.score > (rules.dataMode === "weather_only" ? 64 : 69)
    ).length
    : 0,
  scopeCopyMissing:
    rows.filter((row) =>
      rules.scopeCopy && !row.detail.includes(rules.scopeCopy)
    ).length,
  rainReceivedIndependentCredit:
    rows.filter((row) =>
      !row.detail.includes("Rain receives no independent positive score")
    ).length,
  wrongSpeciesCopy:
    rows.filter((row) =>
      run.species === "lake_run_brown_trout"
        ? /Winter Steelhead/i.test(`${row.headline} ${row.detail} ${row.tip}`)
        : /Winter Brown Trout/i.test(`${row.headline} ${row.detail} ${row.tip}`)
    ).length,
};
const counterfactuals = deterministicCounterfactuals();
const report = {
  auditVersion: `${runId}-wisconsin-winter-pass2-replay-v1`,
  runId,
  species: run.species,
  rulesVersion: rules.version,
  mode: rules.winterTemperatureMode,
  replayYears: `${startYear}-${endYear}`,
  sourceMethod: {
    weather:
      `Open-Meteo archived hourly light, cloud, precipitation, and 2 m air temperature at ${weatherPoint.weatherPointId}; UTC observations are converted through ${river.timezone} historical timezone rules.`,
    hydraulics: gauge
      ? `USGS ${gauge.siteId} approved daily mean discharge, used only for ${
        rules.inputReach?.reachIds.join(", ")
      }.`
      : "No hydraulic series is scored; weather does not infer river level or clarity.",
    waterTemperature: usesMeasuredWater
      ? `USGS ${
        temperatureSource!.siteId
      } daily mean water temperature. The configured series starts in 2026, so the 2021-2025 replay truthfully records missing measured-water history and does not backfill it from air.`
      : "No measured-water series is accepted. A capped multi-day air-temperature pattern is used only as Limited proxy context and is never labeled water temperature.",
  },
  expectedDays,
  usableDays: rows.length,
  coveragePercent: round2(rows.length / expectedDays * 100),
  missing,
  dayScore: summary(rows.map((row) => row.score)),
  blockScore: summary(
    rows.flatMap((row) => row.blocks.map((block) => block.score)),
  ),
  dayLabels: counts(rows.map((row) => row.label)),
  byMonth: groupBy(rows, (row) => row.date.slice(5, 7)),
  byAirPattern: airProxy ? groupBy(rows, (row) => row.airPattern) : null,
  byFlowBand: usesRiver ? groupBy(rows, (row) => row.flowBand) : null,
  spread: summary(rows.map((row) => row.spread)),
  counterfactuals,
  invariants,
  reviewSampleSize: reviewRows.length,
  limitations: [
    "Activity is a conditional responsiveness estimate, not abundance, migration, catch probability, access, ice, or safety.",
    ...(usesMeasuredWater
      ? [
        "The historical archive predates the accepted 2026 measured-water series; thermal ordering is accepted through deterministic measured-water counterfactuals, while historical days audit available flow/light behavior only.",
      ]
      : [
        "Modeled air is capped Limited context and cannot establish actual water temperature or whole-river conditions.",
      ]),
  ],
};

if (Deno.args.includes("--write")) {
  await Deno.mkdir("docs/audits", { recursive: true });
  await Deno.writeTextFile(
    `docs/audits/river-run-${runId.replaceAll("_", "-")}-activity-replay.json`,
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await Deno.writeTextFile(
    `docs/audits/river-run-${runId.replaceAll("_", "-")}-review-100.csv`,
    reviewCsv(reviewRows),
  );
}

console.log(JSON.stringify(
  Deno.args.includes("--summary")
    ? {
      runId,
      expectedDays,
      usableDays: rows.length,
      coveragePercent: report.coveragePercent,
      dayScore: report.dayScore,
      dayLabels: report.dayLabels,
      counterfactuals,
      invariants,
    }
    : report,
  null,
  2,
));

if (
  rows.length < expectedDays * .8 ||
  reviewRows.length !== Math.min(100, rows.length) ||
  Object.values(invariants).some((count) => count > 0) ||
  !(counterfactuals.favorable > counterfactuals.cold) ||
  !(counterfactuals.gradualWarming > counterfactuals.largeSwing)
) Deno.exit(1);

function deterministicCounterfactuals() {
  const date = "2027-01-20";
  const score = (input: {
    temp: number | null;
    trend: "neutral" | "warming" | "strong_warming";
    airMeans: [number, number, number, number];
  }) => {
    const hours = input.airMeans.flatMap((mean, dayIndex) => {
      const day = addDays(date, dayIndex - 3);
      return syntheticWeather(day, mean, 70);
    });
    return scoreActivity({
      rules,
      requestDate: date,
      targetDate: date,
      runStage: "building",
      staging: false,
      waterTempF: input.temp,
      waterTemperatureFreshness: input.temp == null ? "missing" : "fresh",
      temperatureTrend: input.trend,
      gaugeFreshness: usesRiver ? "fresh" : "missing",
      weatherFreshness: "fresh",
      flowBand: usesRiver ? "ideal" : undefined,
      currentHydraulicValue: usesRiver ? midpointIdeal() : null,
      fishabilityBands: run.fishabilityBands,
      flowSignal: "stable",
      hourlyWeather: hours,
      copyStrategy: run.runStageCopyStrategy,
    }).score ?? -1;
  };
  return airProxy
    ? {
      cold: score({ temp: null, trend: "neutral", airMeans: [18, 18, 19, 19] }),
      favorable: score({
        temp: null,
        trend: "neutral",
        airMeans: [34, 35, 35, 36],
      }),
      gradualWarming: score({
        temp: null,
        trend: "neutral",
        airMeans: [29, 31, 33, 35],
      }),
      largeSwing: score({
        temp: null,
        trend: "neutral",
        airMeans: [20, 42, 21, 44],
      }),
    }
    : {
      cold: score({ temp: 33, trend: "neutral", airMeans: [30, 30, 30, 30] }),
      favorable: score({
        temp: run.species === "lake_run_brown_trout" ? 43 : 41,
        trend: "neutral",
        airMeans: [30, 30, 30, 30],
      }),
      gradualWarming: score({
        temp: run.species === "lake_run_brown_trout" ? 43 : 41,
        trend: "warming",
        airMeans: [30, 30, 30, 30],
      }),
      largeSwing: score({
        temp: run.species === "lake_run_brown_trout" ? 43 : 41,
        trend: "strong_warming",
        airMeans: [30, 30, 30, 30],
      }),
    };
}

function midpointIdeal(): number {
  const band = run.fishabilityBands?.ideal;
  return band ? (band.min + band.max) / 2 : 1;
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
  for (const [index, raw] of (hourly.time ?? []).entries()) {
    const local = localDateTime(`${String(raw)}Z`, river.timezone);
    const date = local.slice(0, 10);
    result.set(date, [...(result.get(date) ?? []), {
      time_local: local,
      precipitation_in: finite(hourly.precipitation?.[index]),
      cloud_cover_pct: finite(hourly.cloud_cover?.[index]),
      shortwave_w_m2: finite(hourly.shortwave_radiation?.[index]),
      clear_sky_shortwave_w_m2: finite(
        hourly.shortwave_radiation_clear_sky?.[index],
      ),
      temperature_2m_f: finite(hourly.temperature_2m?.[index]),
      is_day: finite(hourly.is_day?.[index]),
    }]);
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
  const targetMean = mean(target);
  const priorMeans = previous.map(([, values]) => mean(values));
  const delta = targetMean - mean(priorMeans);
  const allMeans = [...priorMeans, targetMean];
  const largestSwing = Math.max(
    ...allMeans.slice(1).map((value, index) =>
      Math.abs(value - allMeans[index])
    ),
  );
  const range = Math.max(...target) - Math.min(...target);
  const pattern = largestSwing > 10 || range > 20 || Math.abs(delta) > 10
    ? "large_swing"
    : targetMean < 28
    ? "persistent_cold"
    : delta >= 1 && delta <= 6
    ? "gradual_warming"
    : Math.abs(delta) < 1
    ? "stable"
    : delta < -2
    ? "cooling"
    : "variable";
  return { pattern };
}

function syntheticWeather(
  date: string,
  meanF: number,
  cloud: number,
): ActivityWeatherHour[] {
  return Array.from({ length: 24 }, (_, hour) => {
    const isDay = hour >= 8 && hour < 17;
    return {
      time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
      precipitation_in: 0,
      cloud_cover_pct: cloud,
      shortwave_w_m2: isDay ? 220 : 0,
      clear_sky_shortwave_w_m2: isDay ? 500 : 0,
      temperature_2m_f: meanF + Math.sin(hour / 24 * Math.PI * 2) * 3,
      is_day: isDay ? 1 : 0,
    };
  });
}

function stratifiedReview(input: Row[], count: number): Row[] {
  if (count === 0) return [];
  const sorted = input.toSorted((a, b) =>
    a.score - b.score || a.date.localeCompare(b.date)
  );
  return Array.from(
    { length: count },
    (_, index) =>
      sorted[
        Math.min(sorted.length - 1, Math.floor(index * sorted.length / count))
      ],
  );
}

function reviewCsv(input: Row[]): string {
  const header = [
    "run_id",
    "date",
    "stage",
    "score",
    "label",
    "confidence",
    "flow_cfs",
    "flow_band",
    "water_temp_f",
    "air_pattern",
    "spread",
    "best_block",
  ];
  const lines = input.map((row) =>
    [
      runId,
      row.date,
      row.stage,
      row.score,
      row.label,
      row.confidence,
      row.flowCfs ?? "",
      row.flowBand,
      row.waterTempF ?? "",
      row.airPattern,
      row.spread,
      row.bestBlock,
    ].map(csv).join(",")
  );
  return `${header.join(",")}\n${lines.join("\n")}\n`;
}

function summary(values: number[]) {
  if (values.length === 0) {
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
    p10: percentile(sorted, .1),
    median: percentile(sorted, .5),
    p90: percentile(sorted, .9),
    max: sorted.at(-1)!,
    mean: round2(mean(sorted)),
  };
}

function groupBy(input: Row[], key: (row: Row) => string) {
  return Object.fromEntries(
    [...new Set(input.map(key))].toSorted().map((name) => {
      const selected = input.filter((row) => key(row) === name);
      return [name, {
        days: selected.length,
        scores: summary(selected.map((row) => row.score)),
      }];
    }),
  );
}

function counts(values: string[]) {
  return Object.fromEntries(
    [...new Set(values)].toSorted().map((
      value,
    ) => [value, values.filter((item) => item === value).length]),
  );
}

function seasonDate(year: number, monthDay: string): string {
  return `${year}-${monthDay}`;
}

function seasonEndDate(year: number, end: string, start: string): string {
  return `${end < start ? year + 1 : year}-${end}`;
}

function localDateTime(iso: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}T${value("hour")}:${
    value("minute")
  }`;
}

function argumentValue(name: string): string | undefined {
  const index = Deno.args.indexOf(name);
  return index >= 0 ? Deno.args[index + 1] : undefined;
}

function finite(value: string | number | null | undefined): number | null {
  const parsed = Number(value);
  return value == null || !Number.isFinite(parsed) ? null : parsed;
}

function percentile(sorted: number[], fraction: number): number {
  return sorted[
    Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * fraction))
  ];
}

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function csv(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function fail(message: string): never {
  throw new Error(message);
}
