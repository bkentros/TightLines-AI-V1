import {
  fetchUsgsDailyFlowBaselineObservations,
  type NormalizedTemperatureBaselineObservation,
  resolveAdminOverrideBand,
  resolveFlowTrendSignal,
  resolveRunStage,
  resolveTemperatureTrendSignal,
  scoreActivity,
  ST_JOSEPH_FALL_CHINOOK_RUN_PROFILE,
  ST_JOSEPH_FALL_COHO_RUN_PROFILE,
  ST_JOSEPH_FALL_STEELHEAD_RUN_PROFILE,
  ST_JOSEPH_RIVER_PROFILE as river,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";
import type { ActivityWeatherHour } from "../supabase/functions/_shared/riverRunEngine/scoring/activity.ts";

const run = Deno.args.includes("--chinook")
  ? ST_JOSEPH_FALL_CHINOOK_RUN_PROFILE
  : Deno.args.includes("--coho")
  ? ST_JOSEPH_FALL_COHO_RUN_PROFILE
  : ST_JOSEPH_FALL_STEELHEAD_RUN_PROFILE;
if (!run.activity) {
  throw new Error(`St. Joseph ${run.displayName} Activity is missing.`);
}
const START_YEAR = 2021;
const END_YEAR = 2025;
const firstDate = `${START_YEAR}-${run.runWindow.stagingStart}`;
const lastDate = `${END_YEAR}-${run.runWindow.lateEnd}`;
const flow = await fetchUsgsDailyFlowBaselineObservations({
  fetchFn: fetch,
  riverId: river.riverId,
  siteId: "04101500",
  startDate: addDays(firstDate, -4),
  endDate: lastDate,
});
const flowByDate = new Map(flow.map((item) => [item.localDate, item.value]));
const temperatureByDate = new Map(
  (await fetchDailyTemperature()).map((item) => [
    item.localDate,
    item.waterTempF,
  ]),
);
const weatherByDate = await fetchHourlyWeather();

const rows: Array<{
  date: string;
  stage: string;
  score: number;
  label: string;
  waterTempF: number;
  flowCfs: number;
  flowSignal: string;
  blocks: Array<{ score: number }>;
  copy: string;
}> = [];
const missing = {
  flow: 0,
  priorFlow: 0,
  temperature: 0,
  history: 0,
  weather: 0,
};
for (let year = START_YEAR; year <= END_YEAR; year++) {
  for (
    let date = `${year}-${run.runWindow.stagingStart}`;
    date <= `${year}-${run.runWindow.lateEnd}`;
    date = addDays(date, 1)
  ) {
    const currentFlow = flowByDate.get(date);
    const priorFlow = flowByDate.get(addDays(date, -1));
    const temp = temperatureByDate.get(date);
    const temp24 = temperatureByDate.get(addDays(date, -1));
    const temp72 = temperatureByDate.get(addDays(date, -3));
    const weather = weatherByDate.get(date) ?? [];
    if (currentFlow == null) missing.flow++;
    if (priorFlow == null) missing.priorFlow++;
    if (temp == null) missing.temperature++;
    if (temp24 == null || temp72 == null) missing.history++;
    if (weather.length < 16) missing.weather++;
    if (
      currentFlow == null || priorFlow == null || temp == null ||
      temp24 == null || temp72 == null || weather.length < 16
    ) continue;
    const flowTrend = resolveFlowTrendSignal({
      currentValue: currentFlow,
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
    const stage = resolveRunStage(run, date);
    const flowBand = resolveAdminOverrideBand(
      currentFlow,
      run.fishabilityBands,
    );
    const activity = scoreActivity({
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
      currentHydraulicValue: currentFlow,
      fishabilityBands: run.fishabilityBands,
      flowSignal: flowTrend.rawSignal,
      hourlyWeather: weather,
    });
    rows.push({
      date,
      stage: stage.stage,
      score: activity.score ?? 0,
      label: activity.label,
      waterTempF: temp,
      flowCfs: currentFlow,
      flowSignal: flowTrend.rawSignal,
      blocks: activity.blocks,
      copy: `${activity.headline} ${activity.detail} ${activity.tip}`,
    });
  }
}

const allBlocks = rows.flatMap((row) => row.blocks);
const mainRunRows = rows.filter((row) => {
  const monthDay = row.date.slice(5);
  return monthDay >= run.runWindow.start && monthDay <= run.runWindow.end;
});
const mainRunBlocks = mainRunRows.flatMap((row) => row.blocks);
const stageReference = lifecycleReference();
const pushIsolation = pushIsolationReference();
const invariants = {
  incompleteBlocks: rows.filter((row) => row.blocks.length !== 4).length,
  scoreOutsideBlockRange: rows.filter((row) => {
    const scores = row.blocks.map((block) => block.score);
    return row.score < Math.min(...scores) || row.score > Math.max(...scores);
  }).length,
  warmCapBroken:
    rows.filter((row) =>
      row.waterTempF >= run.activity!.temperature.warmF &&
      row.waterTempF < run.activity!.temperature.barrierF &&
      row.blocks.some((block) => block.score > 39)
    ).length,
  barrierCapBroken:
    rows.filter((row) =>
      row.waterTempF >= run.activity!.temperature.barrierF &&
      row.blocks.some((block) =>
        block.score > (run.species === "chinook_salmon" ? 29 : 24)
      )
    ).length,
  invalidSpeciesOrCatchClaims:
    rows.filter((row) =>
      (run.species === "steelhead"
        ? /Chinook|Coho|spent|dying|deteriorat|mortality|catch probability|guarantee/i
        : run.species === "coho_salmon"
        ? /Chinook|Steelhead|catch probability|guarantee/i
        : /Coho|Steelhead|catch probability|guarantee/i).test(row.copy)
    ).length,
  foreignGeography:
    rows.filter((row) =>
      /Tippy|Wellston|Croton|Newaygo|Scottville|Pere Marquette/i.test(row.copy)
    ).length,
  missingNilesScope: rows.filter((row) => !/Niles/i.test(row.copy)).length,
  lifecycleBehaviorViolation: lifecycleBehaviorIsValid(stageReference) ? 0 : 1,
  sharpRiseFreshMovementBonus:
    pushIsolation.sharp.some((score, index) =>
        score > pushIsolation.stable[index]
      )
      ? 1
      : 0,
};
const report = {
  runId: run.runId,
  rulesVersion: run.activity.version,
  replayYears: `${START_YEAR}-${END_YEAR}`,
  method:
    "Mechanical historical replay using USGS 04101500 daily discharge and same-station measured water temperature with four-hour Open-Meteo archive blocks at Niles. This audits model behavior and copy, not catch rates or river-wide conditions.",
  expectedDays:
    inclusiveDays(firstDate, `${START_YEAR}-${run.runWindow.lateEnd}`) *
    (END_YEAR - START_YEAR + 1),
  usableDays: rows.length,
  missing,
  dayScores: summary(rows.map((row) => row.score)),
  blockScores: summary(allBlocks.map((block) => block.score)),
  mainRunWindow: {
    dates: `${run.runWindow.start} through ${run.runWindow.end}`,
    usableDays: mainRunRows.length,
    blockCount: mainRunBlocks.length,
    dayScores: summary(mainRunRows.map((row) => row.score)),
    blockScores: summary(mainRunBlocks.map((block) => block.score)),
  },
  labels: counts(rows.map((row) => row.label)),
  labelsByStage: Object.fromEntries(
    [...new Set(rows.map((row) => row.stage))].sort().map((stage) => [
      stage,
      counts(rows.filter((row) => row.stage === stage).map((row) => row.label)),
    ]),
  ),
  scoresByStage: Object.fromEntries(
    [...new Set(mainRunRows.map((row) => row.stage))].sort().map((stage) => {
      const stageRows = mainRunRows.filter((row) => row.stage === stage);
      return [stage, {
        usableDays: stageRows.length,
        dayScores: summary(stageRows.map((row) => row.score)),
        blockScores: summary(
          stageRows.flatMap((row) => row.blocks).map((block) => block.score),
        ),
      }];
    }),
  ),
  scoresByMonth: Object.fromEntries(
    [...new Set(mainRunRows.map((row) => row.date.slice(5, 7)))].sort().map(
      (month) => {
        const monthRows = mainRunRows.filter((row) =>
          row.date.slice(5, 7) === month
        );
        return [month, {
          usableDays: monthRows.length,
          dayScores: summary(monthRows.map((row) => row.score)),
          blockScores: summary(
            monthRows.flatMap((row) => row.blocks).map((block) => block.score),
          ),
        }];
      },
    ),
  ),
  temperatureBands: {
    coldDays:
      rows.filter((row) => row.waterTempF < run.activity!.temperature.coldF)
        .length,
    favorableDays:
      rows.filter((row) =>
        row.waterTempF >= run.activity!.temperature.preferredMinF &&
        row.waterTempF <= run.activity!.temperature.preferredMaxF
      ).length,
    warmConstrainedDays:
      rows.filter((row) => row.waterTempF >= run.activity!.temperature.warmF)
        .length,
  },
  stageReference,
  pushIsolation,
  invariants,
};
console.log(JSON.stringify(report, null, 2));
if (rows.length < 400 || Object.values(invariants).some((value) => value > 0)) {
  Deno.exit(1);
}

async function fetchDailyTemperature(): Promise<
  NormalizedTemperatureBaselineObservation[]
> {
  const params = new URLSearchParams({
    f: "json",
    monitoring_location_id: "USGS-04101500",
    parameter_code: "00010",
    statistic_id: "00003",
    datetime: `${START_YEAR}-01-01/${END_YEAR}-12-31`,
    limit: "10000",
  });
  const response = await fetch(
    `https://api.waterdata.usgs.gov/ogcapi/v0/collections/daily/items?${params}`,
  );
  if (!response.ok) return [];
  const payload = await response.json() as {
    features?: Array<{ properties?: Record<string, unknown> }>;
  };
  return (payload.features ?? []).flatMap(({ properties }) => {
    const date = String(properties?.time ?? "").slice(0, 10);
    const c = Number(properties?.value);
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(c)
      ? [{
        sourceId: "st_joseph_niles_temperature",
        localDate: date,
        waterTempF: c * 9 / 5 + 32,
      }]
      : [];
  });
}

async function fetchHourlyWeather(): Promise<
  Map<string, ActivityWeatherHour[]>
> {
  const result = new Map<string, ActivityWeatherHour[]>();
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    const params = new URLSearchParams({
      latitude: "41.8292138",
      longitude: "-86.2597325",
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
      hourly?: Record<string, Array<string | number | null>>;
    };
    for (const [index, rawTime] of (payload.hourly?.time ?? []).entries()) {
      const time = String(rawTime);
      const hour = Number(time.slice(11, 13));
      if (hour < 5 || hour >= 21) continue;
      const item = {
        time_local: time,
        cloud_cover_pct: finite(payload.hourly?.cloud_cover?.[index]),
        shortwave_w_m2: finite(payload.hourly?.shortwave_radiation?.[index]),
        clear_sky_shortwave_w_m2: finite(
          payload.hourly?.shortwave_radiation_clear_sky?.[index],
        ),
        precipitation_in: finite(payload.hourly?.precipitation?.[index]),
      };
      result.set(time.slice(0, 10), [
        ...(result.get(time.slice(0, 10)) ?? []),
        item,
      ]);
    }
  }
  return result;
}

function reference(
  flowSignal: "stable" | "sharp_rise",
  stage: "peak" | "tapering" | "ending" | "post_run",
  date = "2026-12-20",
) {
  return scoreActivity({
    rules: run.activity!,
    requestDate: date,
    targetDate: date,
    runStage: stage,
    staging: false,
    waterTempF: 50,
    temperatureTrend: "neutral",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    currentHydraulicValue: 2400,
    fishabilityBands: run.fishabilityBands,
    flowSignal,
    hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
      time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: 70,
      shortwave_w_m2: hour >= 8 && hour <= 18 ? 180 : 30,
      clear_sky_shortwave_w_m2: hour >= 8 && hour <= 18 ? 650 : 120,
      precipitation_in: 0,
    })),
  }).blocks.map((block) => block.score);
}
function lifecycleReference() {
  if (run.species === "steelhead") {
    return (["peak", "tapering", "ending", "post_run"] as const).map((stage) =>
      reference("stable", stage)
    );
  }
  return [
    reference("stable", "peak", `2026-${run.runWindow.peakEnd}`),
    reference(
      "stable",
      "tapering",
      midpointDate(
        `2026-${run.runWindow.peakEnd}`,
        `2026-${run.runWindow.taperingEnd}`,
      ),
    ),
    reference("stable", "tapering", `2026-${run.runWindow.taperingEnd}`),
    reference("stable", "ending", `2026-${run.runWindow.end}`),
  ];
}
function lifecycleBehaviorIsValid(referenceScores: number[][]) {
  if (run.species === "steelhead") {
    return referenceScores.every((scores) =>
      JSON.stringify(scores) === JSON.stringify(referenceScores[0])
    );
  }
  return referenceScores.slice(1).every((scores, rowIndex) =>
    scores.every((score, blockIndex) =>
      score <= referenceScores[rowIndex][blockIndex]
    )
  ) && referenceScores.at(-1)!.every((score) =>
    score <= run.activity!.caps.ending
  );
}
function pushIsolationReference() {
  return {
    stable: reference("stable", "peak"),
    sharp: reference("sharp_rise", "peak"),
  };
}
function summary(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const pick = (p: number) => sorted[Math.round((sorted.length - 1) * p)];
  return {
    min: sorted[0],
    p10: pick(.1),
    median: pick(.5),
    p90: pick(.9),
    max: sorted.at(-1),
  };
}
function counts(values: string[]) {
  return Object.fromEntries(
    [...new Set(values)].sort().map((value) => [
      value,
      values.filter((item) => item === value).length,
    ]),
  );
}
function finite(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
function inclusiveDays(start: string, end: string) {
  return Math.round(
    (Date.parse(`${end}T12:00:00Z`) - Date.parse(`${start}T12:00:00Z`)) /
      86_400_000,
  ) + 1;
}
function midpointDate(start: string, end: string) {
  return addDays(start, Math.round((inclusiveDays(start, end) - 1) / 2));
}
