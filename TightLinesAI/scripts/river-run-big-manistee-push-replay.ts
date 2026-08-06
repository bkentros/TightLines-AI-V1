import {
  BIG_MANISTEE_RIVER_PROFILE as river,
  fetchUsgsDailyFlowBaselineObservations,
  getPrimaryHydraulicSource,
  resolveFlowTrendSignal,
  resolveRainSignal,
  resolveTemperatureTrendSignal,
  RIVER_RUN_RUN_PROFILES,
  scorePush,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

const runId = argumentValue("--run-id") ?? "big_manistee_fall_chinook";
const run = RIVER_RUN_RUN_PROFILES.find((candidate) =>
  candidate.riverId === river.riverId && candidate.runId === runId
);
if (!run) throw new Error(`Unknown Big Manistee run: ${runId}`);
if (!run.push) throw new Error(`Big Manistee run lacks Push rules: ${runId}`);
const pushRules = run.push;
const gauge = getPrimaryHydraulicSource(river);
const weatherPoint = river.weatherPoints.find((point) =>
  point.role === "primary"
);
if (!weatherPoint) throw new Error("Big Manistee weather point is missing.");
const startYear = 2007;
const endYear = 2025;
const replayStartDate = `${startYear}-${run.runWindow.start}`;
const replayEndDate = `${endYear}-${run.runWindow.end}`;
const flow = await fetchUsgsDailyFlowBaselineObservations({
  fetchFn: fetch,
  riverId: river.riverId,
  siteId: gauge.siteId,
  startDate: addDays(replayStartDate, -3),
  endDate: replayEndDate,
});
const flowByDate = new Map(flow.map((item) => [item.localDate, item.value]));
const tempByDate = await fetchDailyTemperature(
  addDays(replayStartDate, -3),
  replayEndDate,
);
const rainByDate = await fetchDailyRain({
  lat: weatherPoint.lat,
  lon: weatherPoint.lon,
  timezone: river.timezone,
  startDate: addDays(replayStartDate, -3),
  endDate: replayEndDate,
});
const labels = new Map<string, number>();
const temperatureStates = new Map<string, number>();
const flowSignals = new Map<string, number>();
const rainSignals = new Map<string, number>();
const rainRoles = new Map<string, number>();
const capCounts = new Map<string, number>();
let usableDays = 0;
let violations = 0;
let missingFlowDays = 0;
let missingTemperatureDays = 0;
let missingRainDays = 0;
let strongWithoutGaugeResponse = 0;
let rainDoubleCountedAfterMeasuredResponse = 0;
let veryStrongWithoutSharpRise = 0;
for (let year = startYear; year <= endYear; year++) {
  const firstDate = `${year}-${run.runWindow.start}`;
  const lastDate = `${year}-${run.runWindow.end}`;
  for (let date = firstDate; date <= lastDate; date = addDays(date, 1)) {
    const currentFlow = flowByDate.get(date);
    const priorFlow = flowByDate.get(addDays(date, -1));
    const currentTemp = tempByDate.get(date);
    const priorTemp = tempByDate.get(addDays(date, -1));
    const priorTemp72 = tempByDate.get(addDays(date, -3));
    const rainToday = rainByDate.get(date);
    const rainPrior1 = rainByDate.get(addDays(date, -1));
    const rainPrior2 = rainByDate.get(addDays(date, -2));
    if (currentFlow == null || priorFlow == null) missingFlowDays++;
    if (currentTemp == null || priorTemp == null || priorTemp72 == null) {
      missingTemperatureDays++;
    }
    if (rainToday == null || rainPrior1 == null || rainPrior2 == null) {
      missingRainDays++;
    }
    if (
      [
        currentFlow,
        priorFlow,
        currentTemp,
        priorTemp,
        priorTemp72,
        rainToday,
        rainPrior1,
        rainPrior2,
      ].some((value) => value == null)
    ) continue;
    const flowTrend = resolveFlowTrendSignal({
      currentValue: currentFlow!,
      value24hAgo: priorFlow!,
      rising24hAbsolute: pushRules.hydraulic.rising24h.absolute,
      rising24hPercent: pushRules.hydraulic.rising24h.percent,
      meaningfulRise24hAbsolute: pushRules.hydraulic.meaningfulRise24h.absolute,
      meaningfulRise24hPercent: pushRules.hydraulic.meaningfulRise24h.percent,
      sharpRise24hAbsolute: pushRules.hydraulic.sharpRise24h.absolute,
      sharpRise24hPercent: pushRules.hydraulic.sharpRise24h.percent,
    });
    const temperatureTrend = resolveTemperatureTrendSignal({
      sourceType: "same_gauge",
      delta24hF: currentTemp! - priorTemp!,
      delta72hF: currentTemp! - priorTemp72!,
      hasEnoughValues: true,
    });
    const rain = resolveRainSignal({
      rain48hIn: rainToday! + rainPrior1!,
      rain72hIn: rainToday! + rainPrior1! + rainPrior2!,
    }, pushRules.rain);
    const result = scorePush({
      movementEngineId: run.movementEngineId,
      rules: pushRules,
      gaugeFreshness: "fresh",
      flowSignal: flowTrend.rawSignal,
      currentHydraulicValue: currentFlow!,
      hydraulicAbsoluteChange24h: flowTrend.absoluteChange24h,
      hydraulicPercentChange24h: flowTrend.percentChange24h,
      rainSignal: rain.rawSignal,
      temperatureSignal: temperatureTrend.rawSignal,
      temperatureSourceType: "same_gauge",
      waterTempF: currentTemp!,
      trackingState: "active",
      trackingStartDate: firstDate,
      trackingEndDate: lastDate,
      localDate: date,
      rainReasonCodes: rain.reasonCodes,
      flowReasonCodes: flowTrend.reasonCodes,
      temperatureReasonCodes: temperatureTrend.reasonCodes,
    });
    usableDays++;
    labels.set(result.label, (labels.get(result.label) ?? 0) + 1);
    const state = result.components?.temperatureState ?? "unavailable";
    temperatureStates.set(state, (temperatureStates.get(state) ?? 0) + 1);
    flowSignals.set(
      flowTrend.rawSignal,
      (flowSignals.get(flowTrend.rawSignal) ?? 0) + 1,
    );
    rainSignals.set(rain.rawSignal, (rainSignals.get(rain.rawSignal) ?? 0) + 1);
    const rainRole = result.components?.rainRole ?? "unavailable";
    rainRoles.set(rainRole, (rainRoles.get(rainRole) ?? 0) + 1);
    for (const cap of result.components?.appliedCaps ?? []) {
      const key = String(cap);
      capCounts.set(key, (capCounts.get(key) ?? 0) + 1);
    }
    if (
      (result.label === "Strong" || result.label === "Very strong") &&
      !["rising", "meaningful_rise", "sharp_rise"].includes(
        flowTrend.rawSignal,
      )
    ) strongWithoutGaugeResponse++;
    if (
      ["meaningful_rise", "sharp_rise"].includes(flowTrend.rawSignal) &&
      (result.components?.rainModifier ?? 0) > 0
    ) rainDoubleCountedAfterMeasuredResponse++;
    if (
      result.label === "Very strong" && flowTrend.rawSignal !== "sharp_rise"
    ) {
      veryStrongWithoutSharpRise++;
    }
    if (
      !result.headline.trim() || !result.detail.trim() || !result.tip.trim()
    ) violations++;
    if (
      state === "migration_barrier" &&
      (result.score ?? 100) > pushRules.caps.migrationBarrier
    ) violations++;
    if (
      currentFlow! >= pushRules.hydraulic.severeHighValue &&
      (result.score ?? 100) > pushRules.caps.severeHighFlow
    ) violations++;
  }
}
const expectedDays = activeDayCount(run.runWindow.start, run.runWindow.end) *
  (endYear - startYear + 1);
console.log(JSON.stringify(
  {
    riverId: river.riverId,
    runId: run.runId,
    gaugeSiteId: gauge.siteId,
    replayYears: `${startYear}-${endYear}`,
    replayWindow: `${run.runWindow.start} through ${run.runWindow.end}`,
    method:
      "Daily replay using USGS Wellston daily mean discharge, USGS Wellston measured daily mean water temperature, and modeled daily precipitation at the configured Wellston weather point.",
    expectedDays,
    usableDays,
    coveragePercent: Math.round(usableDays / expectedDays * 10000) / 100,
    missingFlowDays,
    missingTemperatureDays,
    missingRainDays,
    labelCounts: Object.fromEntries(labels),
    flowSignalCounts: Object.fromEntries(flowSignals),
    temperatureStateCounts: Object.fromEntries(temperatureStates),
    rainSignalCounts: Object.fromEntries(rainSignals),
    rainRoleCounts: Object.fromEntries(rainRoles),
    appliedCapCounts: Object.fromEntries(capCounts),
    invariants: {
      strongWithoutGaugeResponse,
      rainDoubleCountedAfterMeasuredResponse,
      veryStrongWithoutSharpRise,
    },
    violations,
  },
  null,
  2,
));
if (
  usableDays < expectedDays * 0.8 || violations > 0 ||
  strongWithoutGaugeResponse > 0 ||
  rainDoubleCountedAfterMeasuredResponse > 0 ||
  veryStrongWithoutSharpRise > 0
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
  if (!response.ok) return new Map();
  const payload = await response.json() as {
    features?: Array<{ properties?: Record<string, unknown> }>;
  };
  return new Map((payload.features ?? []).flatMap(({ properties }) => {
    if (!properties) return [];
    const date = String(properties.time ?? "").slice(0, 10);
    const c = Number(properties.value);
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(c)
      ? [[date, c * 9 / 5 + 32] as const]
      : [];
  }));
}
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
    `https://archive-api.open-meteo.com/v1/archive?${params}`,
  );
  if (!response.ok) return new Map();
  const payload = await response.json() as {
    daily?: { time?: string[]; precipitation_sum?: Array<number | null> };
  };
  return new Map((payload.daily?.time ?? []).flatMap((date, index) => {
    const value = payload.daily?.precipitation_sum?.[index];
    return typeof value === "number" && Number.isFinite(value)
      ? [[date, value] as const]
      : [];
  }));
}
function addDays(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
function activeDayCount(startMonthDay: string, endMonthDay: string): number {
  const start = `2024-${startMonthDay}`;
  const directEnd = `2024-${endMonthDay}`;
  const end = directEnd >= start ? directEnd : `2025-${endMonthDay}`;
  return Math.round(
    (new Date(`${end}T12:00:00Z`).getTime() -
      new Date(`${start}T12:00:00Z`).getTime()) / 86_400_000,
  ) + 1;
}
function argumentValue(flag: string): string | null {
  const inline = Deno.args.find((arg) => arg.startsWith(`${flag}=`));
  if (inline) return inline.slice(flag.length + 1) || null;
  const index = Deno.args.indexOf(flag);
  return index >= 0 ? Deno.args[index + 1] ?? null : null;
}
