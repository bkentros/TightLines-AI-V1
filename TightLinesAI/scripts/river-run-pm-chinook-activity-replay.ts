import {
  fetchMonitorMyWatershedTemperature,
  fetchUsgsDailyFlowBaselineObservations,
  getPrimaryHydraulicSource,
  parseMonitorMyWatershedTemperature,
  PERE_MARQUETTE_RIVER_PROFILE,
  resolveAdminOverrideBand,
  resolveFlowTrendSignal,
  resolveRunStage,
  resolveTemperatureTrendSignal,
  RIVER_RUN_RUN_PROFILES,
  scoreActivity,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";
import type {
  ActivityBlock,
  ActivityWeatherHour,
} from "../supabase/functions/_shared/riverRunEngine/scoring/activity.ts";

type ReplayRow = {
  date: string;
  stage: string;
  staging: boolean;
  score: number;
  label: string;
  confidence: string;
  waterTempF: number;
  flowCfs: number;
  flowBand: string;
  flowSignal: string;
  temperatureSignal: string;
  blockSpread: number;
  bestBlock: string;
  blocks: ActivityBlock[];
  headline: string;
  detail: string;
  tip: string;
};

const river = PERE_MARQUETTE_RIVER_PROFILE;
const run = RIVER_RUN_RUN_PROFILES.find((candidate) =>
  candidate.runId === "pere_marquette_fall_chinook"
);
if (
  !run?.activity || !run.push || !run.waterTemperature ||
  !run.fishabilityBands
) throw new Error("PM Chinook Activity audit rules are unavailable.");
const gauge = getPrimaryHydraulicSource(river);
const primaryTemperatureSourceId = run.waterTemperature.sourcePriority[0];
const temperatureSource = river.waterTemperatureSources.find((source) =>
  source.sourceId === primaryTemperatureSourceId
);
const weatherPoint = river.weatherPoints.find((point) =>
  point.role === "primary"
);
if (!temperatureSource || !weatherPoint) {
  throw new Error("PM audit sources missing.");
}

const startYear = 2021;
const endYear = 2025;
const firstDate = `${startYear}-${run.runWindow.stagingStart}`;
const lastDate = `${endYear}-${run.runWindow.lateEnd}`;
const flowObservations = await fetchUsgsDailyFlowBaselineObservations({
  fetchFn: fetch,
  riverId: river.riverId,
  siteId: gauge.siteId,
  startDate: addDays(firstDate, -4),
  endDate: lastDate,
});
const flowByDate = new Map(
  flowObservations.map((item) => [item.localDate, item.value]),
);
const temperatureByDate = await fetchTemperatureHistory();
const weatherByDate = await fetchHourlyWeather();

const rows: ReplayRow[] = [];
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
    date <= `${year}-${run.runWindow.lateEnd}`;
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
    const flowTrend = resolveFlowTrendSignal({
      currentValue: flow,
      value24hAgo: priorFlow,
      rising24hAbsolute: run.push.hydraulic.rising24h.absolute,
      rising24hPercent: run.push.hydraulic.rising24h.percent,
      meaningfulRise24hAbsolute: run.push.hydraulic.meaningfulRise24h.absolute,
      meaningfulRise24hPercent: run.push.hydraulic.meaningfulRise24h.percent,
      sharpRise24hAbsolute: run.push.hydraulic.sharpRise24h.absolute,
      sharpRise24hPercent: run.push.hydraulic.sharpRise24h.percent,
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
      rules: run.activity,
      requestDate: date,
      runStage: stage.stage,
      staging: stage.stagingContext,
      targetDate: date,
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
    const best = result.blocks.toSorted((a, b) => b.score - a.score)[0];
    rows.push({
      date,
      stage: stage.stage,
      staging: stage.stagingContext,
      score: result.score ?? 0,
      label: result.label,
      confidence: result.confidence,
      waterTempF: round1(temp),
      flowCfs: round1(flow),
      flowBand,
      flowSignal: flowTrend.rawSignal,
      temperatureSignal: temperatureTrend.rawSignal,
      blockSpread: Math.max(...scores) - Math.min(...scores),
      bestBlock: best.id,
      blocks: result.blocks,
      headline: result.headline,
      detail: result.detail,
      tip: result.tip,
    });
  }
}

const allBlocks = rows.flatMap((row) =>
  row.blocks.map((block) => ({ row, block }))
);
const cloudyNoonAdvantage = rows.filter((row) => {
  const noon = row.blocks[1];
  const peers = [row.blocks[0], row.blocks[2], row.blocks[3]];
  return (noon.cloudCoverPct ?? 0) >= 75 &&
    peers.every((block) => (block.cloudCoverPct ?? 100) <= 30) &&
    noon.score > Math.max(...peers.map((block) => block.score));
});
const isolatedCloudTest = isolatedCloudCounterfactual();
const invariants = {
  incompleteBlocks: rows.filter((row) => row.blocks.length !== 4).length,
  incompleteCopy:
    rows.filter((row) =>
      !row.headline.trim() || !row.detail.trim() || !row.tip.trim() ||
      row.blocks.some((block) =>
        !block.positiveDriver.trim() || !block.limitingFactor.trim()
      )
    ).length,
  dailyOutsideBlockRange: rows.filter((row) => {
    const scores = row.blocks.map((block) => block.score);
    return row.score < Math.min(...scores) || row.score > Math.max(...scores);
  }).length,
  warmCapBroken:
    rows.filter((row) =>
      row.waterTempF >= 68 && row.blocks.some((block) => block.score > 39)
    ).length,
  barrierCapBroken:
    rows.filter((row) =>
      row.waterTempF >= 70 && row.blocks.some((block) => block.score >= 30)
    ).length,
  taperingPenaltyMisconfigured: run.activity.caps.taperingPenalty === 15
    ? 0
    : 1,
  endingCapBroken:
    rows.filter((row) =>
      ["ending", "post_run"].includes(row.stage) &&
      row.blocks.some((block) =>
        block.score > lifecycleMaximum(row.date, row.stage)
      )
    ).length,
  prohibitedClaims:
    rows.filter((row) =>
      /catch probability|guarantee|stacked|loaded|hot bite/i.test(
        `${row.headline} ${row.detail} ${row.tip}`,
      )
    ).length,
  isolatedWeatherLeakedIntoOtherBlocks:
    isolatedCloudTest.unchangedBlockDeltas.some((delta) => delta !== 0) ? 1 : 0,
  isolatedCloudFailedToImproveTargetBlock:
    isolatedCloudTest.targetBlockDelta <= 0 ? 1 : 0,
};

function lifecycleMaximum(date: string, stage: string): number {
  if (stage === "post_run") return run.activity!.caps.ending;
  const ramp = run.activity!.caps.lifecycleRamp;
  const penalty = run.activity!.caps.taperingPenalty ?? 0;
  if (!ramp) return run.activity!.caps.ending;
  const year = Number(date.slice(0, 4));
  const start = Date.parse(`${year}-${ramp.taperingEnd}T00:00:00Z`);
  const end = Date.parse(`${year}-${ramp.endingEnd}T00:00:00Z`);
  const progress = Math.max(
    0,
    Math.min(1, (Date.parse(`${date}T00:00:00Z`) - start) / (end - start)),
  );
  return Math.round(
    (100 - penalty) +
      (run.activity!.caps.ending - (100 - penalty)) * progress,
  );
}
const reviewRows = stratifiedReview(rows, 100);
const report = {
  runId: run.runId,
  rulesVersion: run.activity.version,
  replayYears: `${startYear}-${endYear}`,
  method:
    "Historical mechanical replay using each four-hour block's Open-Meteo cloud cover, shortwave radiation, and precipitation; daily median PMTU Maple measured temperature; and USGS Scottville daily mean discharge. This validates scoring behavior and copy, not catch rates.",
  expectedDays:
    activeDayCount(run.runWindow.stagingStart, run.runWindow.lateEnd) *
    (endYear - startYear + 1),
  usableDays: rows.length,
  missing,
  dayScore: summary(rows.map((row) => row.score)),
  blockScore: summary(allBlocks.map(({ block }) => block.score)),
  uniqueDayScores: new Set(rows.map((row) => row.score)).size,
  uniqueBlockScores: new Set(allBlocks.map(({ block }) => block.score)).size,
  mostCommonDayScores: mostCommonNumbers(rows.map((row) => row.score), 10),
  mostCommonBlockScores: mostCommonNumbers(
    allBlocks.map(({ block }) => block.score),
    10,
  ),
  dayLabels: counts(rows.map((row) => row.label)),
  blockLabels: counts(allBlocks.map(({ block }) => block.activityLabel)),
  daysAtLeast90: rows.filter((row) => row.score >= 90).length,
  blocksAtLeast90: allBlocks.filter(({ block }) => block.score >= 90).length,
  daysSingleDigit: rows.filter((row) => row.score < 10).length,
  blocksSingleDigit: allBlocks.filter(({ block }) => block.score < 10).length,
  dayLabelsByStage: Object.fromEntries(
    [...new Set(rows.map((row) => row.stage))].toSorted().map((stage) => [
      stage,
      counts(
        rows.filter((row) => row.stage === stage).map((row) => row.label),
      ),
    ]),
  ),
  stages: counts(rows.map((row) => row.stage)),
  bestBlocks: counts(rows.map((row) => row.bestBlock)),
  confidence: counts(rows.map((row) => row.confidence)),
  blockSpread: summary(rows.map((row) => row.blockSpread)),
  daysWithSpreadAtLeast10: rows.filter((row) => row.blockSpread >= 10).length,
  daysWithSpreadAtLeast20: rows.filter((row) => row.blockSpread >= 20).length,
  cloudyNoonAmongOtherwiseSunnyDays: cloudyNoonAdvantage.length,
  isolatedCloudCounterfactual: isolatedCloudTest,
  correlations: {
    blockCloudToScore: round2(
      correlation(
        allBlocks.map(({ block }) => block.cloudCoverPct),
        allBlocks.map(({ block }) => block.score),
      ),
    ),
    dailyTemperatureToScore: round2(
      correlation(
        rows.map((row) => row.waterTempF),
        rows.map((row) => row.score),
      ),
    ),
    dailyFlowToScore: round2(
      correlation(rows.map((row) => row.flowCfs), rows.map((row) => row.score)),
    ),
  },
  invariants,
  reviewSampleSize: reviewRows.length,
  reviewSampleByStage: counts(reviewRows.map((row) => row.stage)),
  widestSpreadDays: rows.toSorted((a, b) => b.blockSpread - a.blockSpread)
    .slice(0, 12),
};

if (Deno.args.includes("--write")) {
  await Deno.mkdir("docs/audits", { recursive: true });
  await Deno.writeTextFile(
    "docs/audits/river-run-pm-chinook-activity-replay.json",
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await Deno.writeTextFile(
    "docs/audits/river-run-pm-chinook-activity-review-100.csv",
    reviewCsv(reviewRows),
  );
}
console.log(JSON.stringify(report, null, 2));
if (rows.length < 400 || Object.values(invariants).some((value) => value > 0)) {
  Deno.exit(1);
}

async function fetchTemperatureHistory(): Promise<Map<string, number>> {
  const values = new Map<string, number[]>();
  for (let year = startYear; year <= endYear; year++) {
    const csv = await fetchMonitorMyWatershedTemperature({
      fetchFn: fetch,
      source: temperatureSource!,
      endAtUtc: `${year}-12-31T23:59:59.000Z`,
      lookbackDays: 365,
    });
    if (!csv) continue;
    for (
      const item of parseMonitorMyWatershedTemperature({
        csv,
        source: temperatureSource!,
      }).observations
    ) {
      const date = localDate(item.observedAt, river.timezone);
      if (!date.startsWith(`${year}-`)) continue;
      values.set(date, [...(values.get(date) ?? []), item.waterTempF]);
    }
  }
  return new Map([...values].map(([date, items]) => [date, median(items)]));
}

async function fetchHourlyWeather(): Promise<
  Map<string, ActivityWeatherHour[]>
> {
  const byDate = new Map<string, ActivityWeatherHour[]>();
  for (let year = startYear; year <= endYear; year++) {
    const params = new URLSearchParams({
      latitude: String(weatherPoint!.lat),
      longitude: String(weatherPoint!.lon),
      start_date: `${year}-${run!.runWindow.stagingStart}`,
      end_date: `${year}-${run!.runWindow.lateEnd}`,
      hourly:
        "precipitation,cloud_cover,shortwave_radiation,shortwave_radiation_clear_sky",
      precipitation_unit: "inch",
      timezone: river.timezone,
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
      byDate.set(time.slice(0, 10), [
        ...(byDate.get(time.slice(0, 10)) ?? []),
        item,
      ]);
    }
  }
  return byDate;
}

function stratifiedReview(input: ReplayRow[], size: number): ReplayRow[] {
  const quotas: Record<string, number> = {
    pre_run: 15,
    beginning: 15,
    building: 20,
    peak: 20,
    tapering: 15,
    ending: 8,
    post_run: 7,
  };
  const selected: ReplayRow[] = [];
  for (const [stage, quota] of Object.entries(quotas)) {
    const pool = input.filter((row) => row.stage === stage).toSorted((a, b) =>
      a.score - b.score || b.blockSpread - a.blockSpread ||
      a.date.localeCompare(b.date)
    );
    for (let index = 0; index < quota && pool.length; index++) {
      selected.push(
        pool[Math.round(index * (pool.length - 1) / Math.max(1, quota - 1))],
      );
    }
  }
  return [...new Map(selected.map((row) => [row.date, row])).values()].slice(
    0,
    size,
  ).toSorted((a, b) => a.date.localeCompare(b.date));
}

function reviewCsv(input: ReplayRow[]): string {
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
    "cloud_05_09",
    "cloud_09_13",
    "cloud_13_17",
    "cloud_17_21",
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
        row.blockSpread,
        ...row.blocks.map((b) => b.score),
        ...row.blocks.map((b) => b.cloudCoverPct ?? ""),
        row.bestBlock,
        row.headline,
        row.detail,
        row.tip,
      ].map(csv).join(",")
    ).join("\n")
  }\n`;
}
function isolatedCloudCounterfactual() {
  const date = "2026-09-10";
  const baseWeather = Array.from(
    { length: 24 },
    (_, hour): ActivityWeatherHour => ({
      time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: 0,
      shortwave_w_m2: hour >= 5 && hour < 21 ? 700 : 0,
      clear_sky_shortwave_w_m2: hour >= 5 && hour < 21 ? 700 : 0,
      precipitation_in: 0,
    }),
  );
  const input = {
    rules: run!.activity!,
    requestDate: date,
    targetDate: date,
    runStage: "building" as const,
    staging: false,
    waterTempF: 56,
    temperatureTrend: "cooling" as const,
    gaugeFreshness: "fresh" as const,
    weatherFreshness: "fresh" as const,
    flowBand: "ideal" as const,
    flowSignal: "meaningful_rise" as const,
  };
  const baseline = scoreActivity({ ...input, hourlyWeather: baseWeather });
  const changed = scoreActivity({
    ...input,
    hourlyWeather: baseWeather.map((hour) => {
      const localHour = Number(hour.time_local.slice(11, 13));
      return localHour >= 9 && localHour < 13
        ? {
          ...hour,
          cloud_cover_pct: 100,
          shortwave_w_m2: 100,
          precipitation_in: 0.005,
        }
        : hour;
    }),
  });
  return {
    description:
      "Only 9 AM–1 PM changes from bright/dry to fully cloudy with light precipitation; temperature and river inputs remain identical.",
    baselineScores: baseline.blocks.map((block) => block.score),
    changedScores: changed.blocks.map((block) => block.score),
    targetBlockDelta: changed.blocks[1].score - baseline.blocks[1].score,
    unchangedBlockDeltas: [0, 2, 3].map((index) =>
      changed.blocks[index].score - baseline.blocks[index].score
    ),
    targetBecomesBestBlock: changed.blocks[1].score ===
      Math.max(...changed.blocks.map((block) => block.score)),
  };
}
function summary(values: number[]) {
  const sorted = values.toSorted((a, b) => a - b);
  return {
    min: sorted[0],
    p10: percentile(sorted, .1),
    median: percentile(sorted, .5),
    p90: percentile(sorted, .9),
    max: sorted.at(-1),
    mean: round2(values.reduce((a, b) => a + b, 0) / values.length),
  };
}
function percentile(values: number[], p: number) {
  return values[Math.round((values.length - 1) * p)];
}
function counts(values: string[]) {
  return Object.fromEntries(
    [...new Set(values)].toSorted().map((
      value,
    ) => [value, values.filter((item) => item === value).length]),
  );
}
function mostCommonNumbers(values: number[], limit: number) {
  const frequencies = new Map<number, number>();
  for (const value of values) {
    frequencies.set(value, (frequencies.get(value) ?? 0) + 1);
  }
  return [...frequencies]
    .toSorted((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, limit)
    .map(([score, count]) => ({ score, count }));
}
function correlation(xs: Array<number | null>, ys: number[]) {
  const pairs = xs.map((x, i) => [x, ys[i]] as const).filter((
    p,
  ): p is readonly [number, number] => p[0] != null);
  const mx = pairs.reduce((s, p) => s + p[0], 0) / pairs.length;
  const my = pairs.reduce((s, p) => s + p[1], 0) / pairs.length;
  const numerator = pairs.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0);
  return numerator /
    Math.sqrt(
      pairs.reduce((s, p) => s + (p[0] - mx) ** 2, 0) *
        pairs.reduce((s, p) => s + (p[1] - my) ** 2, 0),
    );
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
function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
function activeDayCount(start: string, end: string) {
  return Math.round(
    (new Date(`2024-${end}T12:00:00Z`).getTime() -
      new Date(`2024-${start}T12:00:00Z`).getTime()) / 86_400_000,
  ) + 1;
}
function finite(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function median(values: number[]) {
  const sorted = values.toSorted((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
function round1(value: number) {
  return Math.round(value * 10) / 10;
}
function round2(value: number) {
  return Math.round(value * 100) / 100;
}
function csv(value: unknown) {
  const text = String(value).replaceAll('"', '""');
  return `"${text}"`;
}
