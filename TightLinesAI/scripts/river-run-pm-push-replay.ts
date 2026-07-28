import {
  fetchMonitorMyWatershedTemperature,
  fetchUsgsDailyFlowBaselineObservations,
  getPrimaryHydraulicSource,
  parseMonitorMyWatershedTemperature,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  resolveFlowTrendSignal,
  resolveRainSignal,
  resolveTemperatureTrendSignal,
  scorePush,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

type ReplayRow = {
  localDate: string;
  flow: number;
  flowSignal: string;
  waterTempF: number;
  temperatureSignal: string;
  rain48hIn: number;
  rainSignal: string;
  score: number;
  label: string;
  rainModifier: number;
  rainRole: string;
  temperatureState: string;
  hydraulicState: string;
  appliedCaps: number[];
  headline: string;
  detail: string;
  tip: string;
};

const river = PERE_MARQUETTE_RIVER_PROFILE;
const run = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;
const gauge = getPrimaryHydraulicSource(river);
const temperatureSource = river.waterTemperatureSources.find((source) =>
  source.sourceId === run.waterTemperature.sourcePriority[0]
);
const weatherPoint = river.weatherPoints.find((point) =>
  point.role === "primary"
);
if (!temperatureSource || !weatherPoint) {
  throw new Error(
    "The PM Push replay requires its primary temperature and weather sources.",
  );
}

const startYear = 2021;
const endYear = 2025;
const flowObservations = await fetchUsgsDailyFlowBaselineObservations({
  fetchFn: fetch,
  riverId: river.riverId,
  siteId: gauge.siteId,
  startDate: `${startYear}-07-24`,
  endDate: `${endYear}-11-03`,
});
const flowByDate = new Map(
  flowObservations.map((observation) => [
    observation.localDate,
    observation.value,
  ]),
);

const temperatureValuesByDate = new Map<string, number[]>();
for (let year = startYear; year <= endYear; year++) {
  const csv = await fetchMonitorMyWatershedTemperature({
    fetchFn: fetch,
    source: temperatureSource,
    endAtUtc: `${year}-12-31T23:59:59.000Z`,
    lookbackDays: 365,
  });
  if (!csv) continue;
  const parsed = parseMonitorMyWatershedTemperature({
    csv,
    source: temperatureSource,
  });
  for (
    const observation of parsed.observations.filter((item) =>
      item.observedAt.startsWith(`${year}-`)
    )
  ) {
    const localDate = localDateInTimezone(
      observation.observedAt,
      river.timezone,
    );
    const values = temperatureValuesByDate.get(localDate) ?? [];
    values.push(observation.waterTempF);
    temperatureValuesByDate.set(localDate, values);
  }
}
const temperatureByDate = new Map(
  [...temperatureValuesByDate].map(([localDate, values]) => [
    localDate,
    median(values),
  ]),
);
const rainByDate = await fetchDailyRain({
  lat: weatherPoint.lat,
  lon: weatherPoint.lon,
  timezone: river.timezone,
  startDate: `${startYear}-07-24`,
  endDate: `${endYear}-11-03`,
});

const rows: ReplayRow[] = [];
for (let year = startYear; year <= endYear; year++) {
  const firstDate = `${year}-${run.runWindow.start}`;
  const lastDate = `${year}-${run.runWindow.end}`;
  for (
    let localDate = firstDate;
    localDate <= lastDate;
    localDate = addDays(localDate, 1)
  ) {
    const flow = flowByDate.get(localDate);
    const priorFlow = flowByDate.get(addDays(localDate, -1));
    const waterTempF = temperatureByDate.get(localDate);
    const priorTemp24h = temperatureByDate.get(addDays(localDate, -1));
    const priorTemp72h = temperatureByDate.get(addDays(localDate, -3));
    const rainToday = rainByDate.get(localDate);
    const rainPrior1 = rainByDate.get(addDays(localDate, -1));
    const rainPrior2 = rainByDate.get(addDays(localDate, -2));
    if (
      flow == null || priorFlow == null || waterTempF == null ||
      priorTemp24h == null || priorTemp72h == null ||
      rainToday == null || rainPrior1 == null || rainPrior2 == null
    ) {
      continue;
    }

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
      delta24hF: waterTempF - priorTemp24h,
      delta72hF: waterTempF - priorTemp72h,
      hasEnoughValues: true,
    });
    const rain48hIn = rainToday + rainPrior1;
    const rain72hIn = rain48hIn + rainPrior2;
    const rain = resolveRainSignal(
      { rain48hIn, rain72hIn },
      run.push.rain,
    );
    const result = scorePush({
      movementEngineId: run.movementEngineId,
      rules: run.push,
      gaugeFreshness: "fresh",
      flowSignal: flowTrend.rawSignal,
      currentHydraulicValue: flow,
      hydraulicAbsoluteChange24h: flowTrend.absoluteChange24h,
      hydraulicPercentChange24h: flowTrend.percentChange24h,
      rainSignal: rain.rawSignal,
      temperatureSignal: temperatureTrend.rawSignal,
      temperatureSourceType: temperatureSource.sourceType,
      waterTempF,
      trackingState: "active",
      trackingStartDate: firstDate,
      trackingEndDate: lastDate,
      rainReasonCodes: rain.reasonCodes,
      flowReasonCodes: flowTrend.reasonCodes,
      temperatureReasonCodes: temperatureTrend.reasonCodes,
    });
    if (result.score == null || !result.components) continue;
    rows.push({
      localDate,
      flow,
      flowSignal: flowTrend.rawSignal,
      waterTempF: round1(waterTempF),
      temperatureSignal: temperatureTrend.rawSignal,
      rain48hIn: round2(rain48hIn),
      rainSignal: rain.rawSignal,
      score: result.score,
      label: result.label,
      rainModifier: result.components.rainModifier,
      rainRole: result.components.rainRole,
      temperatureState: result.components.temperatureState,
      hydraulicState: result.components.hydraulicState,
      appliedCaps: result.components.appliedCaps,
      headline: result.headline,
      detail: result.detail,
      tip: result.tip,
    });
  }
}

const strongLabels = new Set(["Strong", "Very strong"]);
const positiveFlowSignals = new Set([
  "rising",
  "meaningful_rise",
  "sharp_rise",
]);
const invariants = {
  strongWithoutGaugeResponse:
    rows.filter((row) =>
      strongLabels.has(row.label) && !positiveFlowSignals.has(row.flowSignal)
    ).length,
  rainDoubleCountedAfterMeaningfulResponse:
    rows.filter((row) =>
      (row.flowSignal === "meaningful_rise" ||
        row.flowSignal === "sharp_rise") &&
      row.rainModifier > 0
    ).length,
  migrationBarrierAboveNoClearPush:
    rows.filter((row) =>
      row.temperatureState === "migration_barrier" && row.score > 49
    ).length,
  severeHighFlowAboveNoClearPush:
    rows.filter((row) => row.hydraulicState === "severe_high" && row.score > 49)
      .length,
  veryStrongWithoutSharpRise:
    rows.filter((row) =>
      row.label === "Very strong" && row.flowSignal !== "sharp_rise"
    ).length,
  incompleteCopy:
    rows.filter((row) =>
      !row.headline.trim() || !row.detail.trim() || !row.tip.trim()
    ).length,
  prohibitedCopy:
    rows.filter((row) =>
      /catch probability|\bguarantee(?:d)?\b|\bloaded\b|\bstacked\b|hot bite|observed rain/i
        .test(`${row.headline} ${row.detail} ${row.tip}`)
    ).length,
};
const failedInvariants = Object.entries(invariants).filter(([, count]) =>
  count > 0
);
const report = {
  riverId: river.riverId,
  runId: run.runId,
  pushRulesVersion: run.push.version,
  replayYears: `${startYear}-${endYear}`,
  method:
    "Daily-resolution mechanical replay using Scottville daily mean discharge, Maple Leaf daily median measured water temperature, and Baldwin-point modeled daily precipitation. Runtime uses near-real-time inputs; this replay validates rule interactions, not fish-return accuracy.",
  usableReplayDays: rows.length,
  labelCounts: counts(rows.map((row) => row.label)),
  flowSignalCounts: counts(rows.map((row) => row.flowSignal)),
  temperatureStateCounts: counts(rows.map((row) => row.temperatureState)),
  rainRoleCounts: counts(rows.map((row) => row.rainRole)),
  invariants,
  highestScoringDays: rows.toSorted((a, b) =>
    b.score - a.score || a.localDate.localeCompare(b.localDate)
  ).slice(0, 12),
  warmestConstrainedDays: rows.filter((row) =>
    row.temperatureState === "too_warm" ||
    row.temperatureState === "migration_barrier"
  ).toSorted((a, b) =>
    b.waterTempF - a.waterTempF || a.localDate.localeCompare(b.localDate)
  ).slice(0, 12),
};
console.log(JSON.stringify(report, null, 2));
if (rows.length < 300 || failedInvariants.length > 0) Deno.exit(1);

async function fetchDailyRain(input: {
  lat: number;
  lon: number;
  timezone: string;
  startDate: string;
  endDate: string;
}): Promise<Map<string, number>> {
  const params = new URLSearchParams({
    latitude: String(input.lat),
    longitude: String(input.lon),
    start_date: input.startDate,
    end_date: input.endDate,
    daily: "precipitation_sum",
    precipitation_unit: "inch",
    timezone: input.timezone,
  });
  const response = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`,
  );
  if (!response.ok) return new Map();
  const payload = await response.json() as {
    daily?: {
      time?: string[];
      precipitation_sum?: Array<number | null>;
    };
  };
  const dates = payload.daily?.time ?? [];
  const values = payload.daily?.precipitation_sum ?? [];
  return new Map(
    dates.flatMap((date, index) =>
      typeof values[index] === "number" && Number.isFinite(values[index])
        ? [[date, values[index] as number] as const]
        : []
    ),
  );
}

function localDateInTimezone(iso: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const value = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${value.year}-${value.month}-${value.day}`;
}

function median(values: number[]): number {
  const sorted = values.toSorted((a, b) => a - b);
  const midpoint = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[midpoint - 1] + sorted[midpoint]) / 2
    : sorted[midpoint];
}

function addDays(localDate: string, days: number): string {
  const date = new Date(`${localDate}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function counts(values: string[]): Record<string, number> {
  return Object.fromEntries(
    [...new Set(values)].toSorted().map((value) => [
      value,
      values.filter((candidate) => candidate === value).length,
    ]),
  );
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
