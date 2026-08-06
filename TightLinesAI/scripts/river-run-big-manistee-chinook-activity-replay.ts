import {
  addDays,
  BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
  BIG_MANISTEE_FALL_COHO_RUN_PROFILE,
  BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE as river,
  fetchUsgsDailyFlowBaselineObservations,
  getPrimaryHydraulicSource,
  resolveAdminOverrideBand,
  resolveFlowTrendSignal,
  resolveRunStage,
  resolveTemperatureTrendSignal,
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
if (
  requestedRunId !== "big_manistee_fall_chinook" &&
  requestedRunId !== "big_manistee_fall_coho" &&
  requestedRunId !== "big_manistee_fall_steelhead"
) {
  throw new Error(
    `Unsupported Big Manistee Activity replay: ${requestedRunId}`,
  );
}
const run = requestedRunId === "big_manistee_fall_steelhead"
  ? BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE
  : requestedRunId === "big_manistee_fall_coho"
  ? BIG_MANISTEE_FALL_COHO_RUN_PROFILE
  : BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE;
const speciesSlug = requestedRunId === "big_manistee_fall_steelhead"
  ? "steelhead"
  : requestedRunId === "big_manistee_fall_coho"
  ? "coho"
  : "chinook";

if (!run.activity || !run.push || !run.fishabilityBands) {
  throw new Error(
    `Big Manistee ${speciesSlug} Activity rules are unavailable.`,
  );
}
const gauge = getPrimaryHydraulicSource(river);
const weatherPoint = river.weatherPoints.find((point) =>
  point.role === "primary"
);
if (!weatherPoint) {
  throw new Error("Big Manistee primary weather point missing.");
}

const startYear = Number(argumentValue("--start-year") ?? 2007);
const endYear = Number(argumentValue("--end-year") ?? 2025);
const firstDate = `${startYear}-${run.runWindow.stagingStart}`;
const lastDate = `${endYear}-${run.runWindow.lateEnd}`;
const [flowByDate, temperatureByDate, weatherByDate] = await Promise.all([
  fetchUsgsDailyFlowBaselineObservations({
    fetchFn: fetch,
    riverId: river.riverId,
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
      sourceType: "same_gauge",
      delta24hF: temp - temp24,
      delta72hF: temp - temp72,
      hasEnoughValues: true,
    });
    const flowBand = resolveAdminOverrideBand(flow, run.fishabilityBands);
    const stage = resolveRunStage(run, date);
    const result = scoreActivity({
      rules: run.activity,
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
const invariants = {
  incompleteBlocks: rows.filter((row) => row.blocks.length !== 4).length,
  incompleteCopy:
    rows.filter((row) =>
      !row.headline || !row.detail || !row.tip ||
      !/strongest window/i.test(row.detail)
    ).length,
  missingTailwaterScope:
    rows.filter((row) => !/Wellston\/Tippy tailwater/i.test(row.detail)).length,
  prohibitedGeography:
    rows.filter((row) =>
      /Scottville|Pere Marquette|Walhalla|Baldwin/i.test(
        `${row.headline} ${row.detail} ${row.tip}`,
      )
    ).length,
  dailyOutsideBlockRange: rows.filter((row) => {
    const values = row.blocks.map((block) => block.score);
    return row.score < Math.min(...values) || row.score > Math.max(...values);
  }).length,
  warmCapBroken:
    rows.filter((row) =>
      row.waterTempF >= run.activity!.temperature.warmF &&
      row.blocks.some((block) => block.score > 39)
    ).length,
  barrierCapBroken:
    rows.filter((row) =>
      row.waterTempF >= run.activity!.temperature.barrierF &&
      row.blocks.some((block) => block.score >= 30)
    ).length,
  taperingPenaltyMisconfigured: speciesSlug === "steelhead"
    ? (run.activity.caps.taperingPenalty == null &&
        run.activity.caps.lateRun === 100
      ? 0
      : 1)
    : run.activity.caps.taperingPenalty === 15
    ? 0
    : 1,
  endingCapBroken: speciesSlug === "steelhead"
    ? 0
    : rows.filter((row) =>
      ["ending", "post_run"].includes(row.stage) &&
      row.blocks.some((block) =>
        block.score > lifecycleMaximum(row.date, row.stage)
      )
    ).length,
  lateOptimism: speciesSlug === "steelhead"
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
};

function verifyNoSteelheadStagePenalty(): number {
  const date = "2026-12-20";
  const base = {
    rules: run.activity!,
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
const reviewRows = stratifiedReview(rows);
const report = {
  runId: run.runId,
  rulesVersion: run.activity.version,
  replayYears: `${startYear}-${endYear}`,
  method:
    `Historical mechanical ${speciesSlug} replay using Wellston USGS 04125550 daily mean discharge and measured water temperature plus each four-hour block's Open-Meteo radiation, cloud cover, and precipitation. The read is scoped to the Tippy tailwater and validates scoring behavior and copy, not catch rates.`,
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
  byTemperature: temperatureBands(rows),
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
  await Deno.mkdir("docs/audits", { recursive: true });
  await Deno.writeTextFile(
    `docs/audits/river-run-big-manistee-${speciesSlug}-activity-replay.json`,
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await Deno.writeTextFile(
    `docs/audits/river-run-big-manistee-${speciesSlug}-activity-review-100.csv`,
    reviewCsv(reviewRows),
  );
}
console.log(JSON.stringify(report, null, 2));
if (
  rows.length < report.expectedDays * .8 ||
  Object.values(invariants).some((value) => value > 0)
) Deno.exit(1);

async function fetchDailyTemperature(
  startDate: string,
  endDate: string,
): Promise<Map<string, number>> {
  const params = new URLSearchParams({
    f: "json",
    monitoring_location_id: `USGS-${gauge.siteId}`,
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
    const params = new URLSearchParams({
      latitude: String(weatherPoint!.lat),
      longitude: String(weatherPoint!.lon),
      start_date: `${year}-${run.runWindow.stagingStart}`,
      end_date: `${year}-${run.runWindow.lateEnd}`,
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
function temperatureBands(input: Row[]) {
  const preferredMin = run.activity!.temperature.preferredMinF;
  const preferredMax = run.activity!.temperature.preferredMaxF;
  const warm = run.activity!.temperature.warmF;
  const barrier = run.activity!.temperature.barrierF;
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
function activeDayCount(start: string, end: string) {
  return Math.round(
    (new Date(`2024-${end}T12:00:00Z`).getTime() -
      new Date(`2024-${start}T12:00:00Z`).getTime()) / 86_400_000,
  ) + 1;
}
function finite(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
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
