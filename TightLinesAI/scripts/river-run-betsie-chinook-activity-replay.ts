import {
  addDays,
  BETSIE_FALL_CHINOOK_RUN_PROFILE,
  BETSIE_FALL_COHO_RUN_PROFILE,
  BETSIE_FALL_STEELHEAD_RUN_PROFILE,
  BETSIE_RIVER_PROFILE as river,
  resolveRunStage,
  scoreActivity,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";
import type {
  ActivityBlock,
  ActivityWeatherHour,
} from "../supabase/functions/_shared/riverRunEngine/scoring/activity.ts";

const requestedRunId = argumentValue("--run-id") ?? "betsie_fall_chinook";
if (
  requestedRunId !== "betsie_fall_chinook" &&
  requestedRunId !== "betsie_fall_coho" &&
  requestedRunId !== "betsie_fall_steelhead"
) throw new Error(`Unsupported Betsie Activity replay: ${requestedRunId}`);
const run = requestedRunId === "betsie_fall_steelhead"
  ? BETSIE_FALL_STEELHEAD_RUN_PROFILE
  : requestedRunId === "betsie_fall_coho"
  ? BETSIE_FALL_COHO_RUN_PROFILE
  : BETSIE_FALL_CHINOOK_RUN_PROFILE;
const speciesSlug = requestedRunId === "betsie_fall_steelhead"
  ? "steelhead"
  : requestedRunId === "betsie_fall_coho"
  ? "coho"
  : "chinook";
const steelhead = speciesSlug === "steelhead";
if (!run.activity) {
  throw new Error(`Betsie ${speciesSlug} Activity is unavailable.`);
}
const weatherPoint = river.weatherPoints.find((point) =>
  point.role === "primary"
);
if (!weatherPoint) throw new Error("Betsie primary weather point is missing.");

type Row = {
  date: string;
  stage: string;
  score: number;
  label: string;
  spread: number;
  precipitationIn: number;
  bestBlock: string;
  blocks: ActivityBlock[];
  headline: string;
  detail: string;
  tip: string;
};

const startYear = 2007;
const endYear = 2025;
const weatherByDate = await fetchHourlyWeather();
const rows: Row[] = [];
let missingWeatherDays = 0;
for (let year = startYear; year <= endYear; year++) {
  for (
    let date = `${year}-${run.runWindow.stagingStart}`;
    date <= `${year}-${run.runWindow.lateEnd}`;
    date = addDays(date, 1)
  ) {
    const hourlyWeather = weatherByDate.get(date) ?? [];
    if (hourlyWeather.length < 16) {
      missingWeatherDays++;
      continue;
    }
    const stage = resolveRunStage(run, date);
    const result = scoreActivity({
      rules: run.activity,
      requestDate: date,
      targetDate: date,
      runStage: stage.stage,
      staging: stage.stagingContext,
      waterTempF: null,
      temperatureTrend: "neutral_missing",
      gaugeFreshness: "missing",
      weatherFreshness: "fresh",
      flowSignal: "unknown",
      hourlyWeather,
    });
    const scores = result.blocks.map((block) => block.score);
    const best = result.blocks.toSorted((a, b) => b.score - a.score)[0];
    rows.push({
      date,
      stage: stage.stage,
      score: result.score ?? 0,
      label: result.label,
      spread: Math.max(...scores) - Math.min(...scores),
      precipitationIn: round2(
        result.blocks.reduce(
          (sum, block) => sum + (block.precipitationIn ?? 0),
          0,
        ),
      ),
      bestBlock: best.id,
      blocks: result.blocks,
      headline: result.headline,
      detail: result.detail,
      tip: result.tip,
    });
  }
}

const blocks = rows.flatMap((row) => row.blocks);
const lifecycle = steelhead
  ? steelheadStageInvarianceAudit()
  : lifecycleContinuityAudit();
const invariants = {
  incompleteBlocks: rows.filter((row) => row.blocks.length !== 4).length,
  scoreAboveWeatherOnlyCeiling:
    blocks.filter((block) => block.score > 95).length,
  dailyOutsideBlockRange: rows.filter((row) => {
    const values = row.blocks.map((block) => block.score);
    return row.score < Math.min(...values) || row.score > Math.max(...values);
  }).length,
  incompleteCopy:
    rows.filter((row) =>
      !row.headline.trim() || !row.detail.trim() || !row.tip.trim()
    ).length,
  missingWeatherOnlyDisclosure:
    rows.filter((row) =>
      !/weather-only/i.test(row.detail) ||
      !/River level, clarity, and measured water temperature are unknown/i.test(
        row.detail,
      )
    ).length,
  inferredRiverCondition:
    rows.filter((row) =>
      /river (?:rose|is rising|level remains workable)|measured water temperature is favorable/i
        .test(`${row.headline} ${row.detail} ${row.tip}`)
    ).length,
  prohibitedClaims:
    rows.filter((row) =>
      /catch probability|guarantee|fish definitely moved|blown out/i.test(
        `${row.headline} ${row.detail} ${row.tip}`,
      )
    ).length,
  lifecycleCalendarCliff: lifecycle.maximumAdjacentDelta > 2 ? 1 : 0,
  lifecycleNotDeclining: steelhead
    ? (lifecycle.scores.some((score) => score !== lifecycle.scores[0]) ? 1 : 0)
    : lifecycle.scores.at(-1)! >= lifecycle.scores[0]
    ? 1
    : 0,
};

const report = {
  runId: run.runId,
  rulesVersion: run.activity.version,
  replayYears: `${startYear}-${endYear}`,
  method:
    `Historical mechanical Betsie ${speciesSlug} weather-only replay using each four-hour block's Open-Meteo shortwave radiation, clear-sky radiation, cloud cover, precipitation total, and wet-hour duration at the Homestead weather point. No air temperature, river level, clarity, or water temperature is inferred. This validates scoring behavior and copy, not catch rates.`,
  expectedDays:
    activeDayCount(run.runWindow.stagingStart, run.runWindow.lateEnd) *
    (endYear - startYear + 1),
  usableDays: rows.length,
  missingWeatherDays,
  dayScore: summary(rows.map((row) => row.score)),
  blockScore: summary(blocks.map((block) => block.score)),
  uniqueDayScores: new Set(rows.map((row) => row.score)).size,
  uniqueBlockScores: new Set(blocks.map((block) => block.score)).size,
  dayLabels: counts(rows.map((row) => row.label)),
  byStage: Object.fromEntries(
    [...new Set(rows.map((row) => row.stage))].toSorted().map((stage) => [
      stage,
      {
        days: rows.filter((row) => row.stage === stage).length,
        scores: summary(
          rows.filter((row) => row.stage === stage).map((row) => row.score),
        ),
        labels: counts(
          rows.filter((row) => row.stage === stage).map((row) => row.label),
        ),
      },
    ]),
  ),
  precipitationDays: {
    dry: scoreGroup(rows.filter((row) => row.precipitationIn === 0)),
    traceToLight: scoreGroup(
      rows.filter((row) =>
        row.precipitationIn > 0 && row.precipitationIn <= 0.16
      ),
    ),
    moderateToHeavy: scoreGroup(
      rows.filter((row) => row.precipitationIn > 0.16),
    ),
  },
  bestBlocks: counts(rows.map((row) => row.bestBlock)),
  spread: summary(rows.map((row) => row.spread)),
  daysWithSpreadAtLeast10: rows.filter((row) => row.spread >= 10).length,
  lifecycleContinuity: lifecycle,
  invariants,
};

if (Deno.args.includes("--write")) {
  await Deno.mkdir("docs/audits", { recursive: true });
  await Deno.writeTextFile(
    `docs/audits/river-run-betsie-${speciesSlug}-weather-activity-replay.json`,
    `${JSON.stringify(report, null, 2)}\n`,
  );
}
console.log(JSON.stringify(report, null, 2));
if (
  rows.length < report.expectedDays * 0.95 ||
  Object.values(invariants).some((value) => value > 0)
) Deno.exit(1);

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
      const date = time.slice(0, 10);
      const item: ActivityWeatherHour = {
        time_local: time,
        cloud_cover_pct: finite(payload.hourly?.cloud_cover?.[index]),
        shortwave_w_m2: finite(payload.hourly?.shortwave_radiation?.[index]),
        clear_sky_shortwave_w_m2: finite(
          payload.hourly?.shortwave_radiation_clear_sky?.[index],
        ),
        precipitation_in: finite(payload.hourly?.precipitation?.[index]),
      };
      result.set(date, [...(result.get(date) ?? []), item]);
    }
  }
  return result;
}

function lifecycleContinuityAudit() {
  const dates: string[] = [];
  for (
    let date = `2026-${run.activity!.caps.lifecycleRamp!.peakEnd}`;
    date <= `2026-${run.activity!.caps.lifecycleRamp!.endingEnd}`;
    date = addDays(date, 1)
  ) {
    dates.push(date);
  }
  const scores = dates.map((date) => {
    const stage = resolveRunStage(run, date);
    return scoreActivity({
      rules: run.activity!,
      requestDate: date,
      targetDate: date,
      runStage: stage.stage,
      staging: false,
      waterTempF: null,
      temperatureTrend: "neutral_missing",
      gaugeFreshness: "missing",
      weatherFreshness: "fresh",
      flowSignal: "unknown",
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
        cloud_cover_pct: 95,
        shortwave_w_m2: hour >= 7 && hour < 19 ? 70 : 0,
        clear_sky_shortwave_w_m2: hour >= 7 && hour < 19 ? 600 : 0,
        precipitation_in: hour >= 9 && hour < 13 ? 0.005 : 0,
      })),
    }).score ?? 0;
  });
  const deltas = scores.slice(1).map((score, index) => score - scores[index]);
  return {
    startDate: dates[0],
    endDate: dates.at(-1),
    scores,
    maximumAdjacentDelta: Math.max(...deltas.map((value) => Math.abs(value))),
  };
}

function steelheadStageInvarianceAudit() {
  const dates = ["2026-11-29", "2026-11-30", "2026-12-15", "2026-12-18"];
  const scores = dates.map((date) => {
    const stage = resolveRunStage(run, date);
    return scoreActivity({
      rules: run.activity!,
      requestDate: date,
      targetDate: date,
      runStage: stage.stage,
      staging: false,
      waterTempF: null,
      temperatureTrend: "neutral_missing",
      gaugeFreshness: "missing",
      weatherFreshness: "fresh",
      flowSignal: "unknown",
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
        cloud_cover_pct: 95,
        shortwave_w_m2: hour >= 7 && hour < 19 ? 70 : 0,
        clear_sky_shortwave_w_m2: hour >= 7 && hour < 19 ? 600 : 0,
        precipitation_in: hour >= 9 && hour < 13 ? 0.005 : 0,
      })),
    }).score ?? 0;
  });
  const deltas = scores.slice(1).map((score, index) => score - scores[index]);
  return {
    startDate: dates[0],
    endDate: dates.at(-1),
    scores,
    maximumAdjacentDelta: Math.max(...deltas.map((value) => Math.abs(value))),
  };
}

function activeDayCount(start: string, end: string): number {
  const year = 2024;
  return Math.round(
    (Date.parse(`${year}-${end}T00:00:00Z`) -
      Date.parse(`${year}-${start}T00:00:00Z`)) / 86_400_000,
  ) + 1;
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
  const pick = (fraction: number) =>
    sorted[Math.round((sorted.length - 1) * fraction)];
  return {
    min: sorted[0],
    p10: pick(0.1),
    median: pick(0.5),
    p90: pick(0.9),
    max: sorted.at(-1),
    mean: round2(values.reduce((sum, value) => sum + value, 0) / values.length),
  };
}
function scoreGroup(input: Row[]) {
  return { days: input.length, scores: summary(input.map((row) => row.score)) };
}
function counts(values: string[]) {
  return Object.fromEntries(
    [...new Set(values)].toSorted().map((value) => [
      value,
      values.filter((candidate) => candidate === value).length,
    ]),
  );
}
function finite(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function argumentValue(name: string): string | undefined {
  const index = Deno.args.indexOf(name);
  return index >= 0 ? Deno.args[index + 1] : undefined;
}
