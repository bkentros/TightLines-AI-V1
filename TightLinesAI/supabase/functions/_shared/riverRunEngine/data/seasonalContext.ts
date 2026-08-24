import type { RiverLiveMetricId, RiverLiveSeasonalContext } from "../types.ts";
import { type RiverRunFetch, usgsApiRequestInit } from "./usgs.ts";

const USGS_STATISTICS_URL =
  "https://api.waterdata.usgs.gov/statistics/v0/observationNormals";
export const LIVE_SEASONAL_WINDOW_RADIUS_DAYS = 3 as const;
export const USGS_SEASONAL_BASELINE_VERSION =
  "usgs-approved-doy-plus-minus-3-v1";
export const MMW_SEASONAL_BASELINE_VERSION =
  "mmw-audited-daily-median-plus-minus-3-v1";

type StatisticValue = {
  monthDay: string;
  value: number;
  sampleCount: number;
};

type PercentileValue = {
  monthDay: string;
  sampleCount: number;
  values: Record<string, number>;
};

export async function fetchUsgsSeasonalContext(input: {
  fetchFn: RiverRunFetch;
  siteId: string;
  metric: "flow_cfs" | "water_temp_f";
  localDate: string;
}): Promise<RiverLiveSeasonalContext | null> {
  const monthDays = seasonalWindowMonthDays(input.localDate);
  const payloads = (await Promise.all(
    monthDayIntervals(monthDays).map(
      async (interval): Promise<unknown | null> => {
        const params = new URLSearchParams({
          monitoring_location_id: input.siteId.startsWith("USGS-")
            ? input.siteId
            : `USGS-${input.siteId}`,
          parameter_code: input.metric === "flow_cfs" ? "00060" : "00010",
          normal_type: "DOY",
          start_date: interval.start,
          end_date: interval.end,
          page_size: "1000",
        });
        const response = await input.fetchFn(
          `${USGS_STATISTICS_URL}?${params.toString()}`,
          usgsApiRequestInit(),
        );
        return response.ok ? await response.json() : null;
      },
    ),
  )).filter((payload): payload is unknown => payload != null);
  return buildUsgsSeasonalContext({
    payloads,
    metric: input.metric,
    monthDays,
  });
}

export function buildUsgsSeasonalContext(input: {
  payloads: unknown[];
  metric: "flow_cfs" | "water_temp_f";
  monthDays: string[];
}): RiverLiveSeasonalContext | null {
  const parameterCode = input.metric === "flow_cfs" ? "00060" : "00010";
  const allowedDays = new Set(input.monthDays);
  const means: StatisticValue[] = [];
  const percentileRows: PercentileValue[] = [];

  for (const payload of input.payloads) {
    for (const feature of asArray(record(payload).features)) {
      for (const series of asArray(record(record(feature).properties).data)) {
        const data = record(series);
        if (
          String(data.parameter_code ?? "") !== parameterCode ||
          String(data.parent_statistic_id ?? "") !== "00003"
        ) continue;
        for (const rawValue of asArray(data.values)) {
          const value = record(rawValue);
          const monthDay = String(value.time_of_year ?? "");
          const sampleCount = finiteNumber(value.sample_count);
          const approvalStatus = String(value.approval_status ?? "")
            .toLowerCase();
          if (
            !allowedDays.has(monthDay) || sampleCount == null ||
            (approvalStatus && approvalStatus !== "approved")
          ) continue;
          if (value.computation === "arithmetic_mean") {
            const numeric = normalizeStatisticValue(
              finiteNumber(value.value),
              input.metric,
            );
            if (numeric != null) {
              means.push({ monthDay, value: numeric, sampleCount });
            }
          }
          if (value.computation === "percentile") {
            const percentiles = asArray(value.percentiles).map(String);
            const values = asArray(value.values).map((raw) =>
              normalizeStatisticValue(finiteNumber(raw), input.metric)
            );
            const byPercentile: Record<string, number> = {};
            for (const [index, percentile] of percentiles.entries()) {
              const numeric = values[index];
              if (numeric != null) byPercentile[percentile] = numeric;
            }
            percentileRows.push({
              monthDay,
              sampleCount,
              values: byPercentile,
            });
          }
        }
      }
    }
  }

  const availableDays = new Set(means.map((item) => item.monthDay));
  const historicalYears = means.length
    ? Math.min(...means.map((item) => item.sampleCount))
    : 0;
  if (availableDays.size < 3 || historicalYears < 5) return null;
  const percentile = (key: string) =>
    weightedAverage(
      percentileRows.flatMap((row) =>
        row.values[key] == null
          ? []
          : [{ value: row.values[key], weight: row.sampleCount }]
      ),
    );
  const average = weightedAverage(
    means.map((item) => ({ value: item.value, weight: item.sampleCount })),
  );
  const p10 = percentile("10");
  const p25 = percentile("25");
  const median = percentile("50");
  const p75 = percentile("75");
  const p90 = percentile("90");
  if ([average, p10, p25, median, p75, p90].some((value) => value == null)) {
    return null;
  }
  const longTermMinimum = input.metric === "flow_cfs" ? 20 : 10;
  return {
    average: average!,
    p10: p10!,
    p25: p25!,
    median: median!,
    p75: p75!,
    p90: p90!,
    historicalYears,
    sampleCount: means.reduce((sum, item) => sum + item.sampleCount, 0),
    availableWindowDays: availableDays.size,
    windowRadiusDays: LIVE_SEASONAL_WINDOW_RADIUS_DAYS,
    windowStartMonthDay: input.monthDays[0],
    windowEndMonthDay: input.monthDays[input.monthDays.length - 1],
    recordKind: historicalYears >= longTermMinimum ? "long_term" : "recent",
    baselineVersion: USGS_SEASONAL_BASELINE_VERSION,
    source: "usgs_statistics",
  };
}

export function buildMeasuredTemperatureSeasonalContext(input: {
  dailyValues: Array<{ localDate: string; value: number }>;
  localDate: string;
}): RiverLiveSeasonalContext | null {
  const monthDays = seasonalWindowMonthDays(input.localDate);
  const allowedDays = new Set(monthDays);
  const values = input.dailyValues.filter((item) =>
    allowedDays.has(item.localDate.slice(5)) && Number.isFinite(item.value)
  );
  const years = new Set(values.map((item) => item.localDate.slice(0, 4)));
  const availableDays = new Set(values.map((item) => item.localDate.slice(5)));
  if (years.size < 5 || availableDays.size < 3) return null;
  const numbers = values.map((item) => item.value);
  return {
    average: mean(numbers),
    p10: percentile(numbers, .1),
    p25: percentile(numbers, .25),
    median: percentile(numbers, .5),
    p75: percentile(numbers, .75),
    p90: percentile(numbers, .9),
    historicalYears: years.size,
    sampleCount: values.length,
    availableWindowDays: availableDays.size,
    windowRadiusDays: LIVE_SEASONAL_WINDOW_RADIUS_DAYS,
    windowStartMonthDay: monthDays[0],
    windowEndMonthDay: monthDays[monthDays.length - 1],
    recordKind: years.size >= 10 ? "long_term" : "recent",
    baselineVersion: MMW_SEASONAL_BASELINE_VERSION,
    source: "monitor_my_watershed_history",
  };
}

export function withSeasonalComparison(
  context: RiverLiveSeasonalContext,
  metric: RiverLiveMetricId,
  currentValue: number,
): RiverLiveSeasonalContext {
  const recent = context.recordKind === "recent";
  let comparisonLabel: string;
  if (metric === "water_temp_f") {
    comparisonLabel = currentValue < context.p10
      ? recent
        ? "Much colder than the recent average"
        : "Much colder than average"
      : currentValue < context.p25
      ? recent ? "Colder than the recent average" : "Colder than average"
      : currentValue <= context.p75
      ? recent ? "Near the recent average" : "Near average"
      : currentValue <= context.p90
      ? recent ? "Warmer than the recent average" : "Warmer than average"
      : recent
      ? "Much warmer than the recent average"
      : "Much warmer than average";
  } else {
    comparisonLabel = currentValue < context.p10
      ? recent ? "Much below the recent average" : "Much below normal"
      : currentValue < context.p25
      ? recent ? "Below the recent average" : "Below normal"
      : currentValue <= context.p75
      ? recent ? "Near the recent average" : "Normal"
      : currentValue <= context.p90
      ? recent ? "Above the recent average" : "Above normal"
      : recent
      ? "Much above the recent average"
      : "Much above normal";
  }
  return { ...context, comparisonLabel };
}

export function seasonalWindowMonthDays(localDate: string): string[] {
  const parsed = new Date(`${localDate}T12:00:00Z`);
  if (!Number.isFinite(parsed.getTime())) return [];
  return Array.from(
    { length: LIVE_SEASONAL_WINDOW_RADIUS_DAYS * 2 + 1 },
    (_, index) => {
      const date = new Date(parsed);
      date.setUTCDate(
        date.getUTCDate() + index - LIVE_SEASONAL_WINDOW_RADIUS_DAYS,
      );
      return date.toISOString().slice(5, 10);
    },
  );
}

function monthDayIntervals(monthDays: string[]): Array<{
  start: string;
  end: string;
}> {
  if (!monthDays.length) return [];
  const intervals: Array<{ start: string; end: string }> = [];
  let start = monthDays[0];
  for (let index = 1; index < monthDays.length; index++) {
    if (monthDays[index] < monthDays[index - 1]) {
      intervals.push({ start, end: monthDays[index - 1] });
      start = monthDays[index];
    }
  }
  intervals.push({ start, end: monthDays[monthDays.length - 1] });
  return intervals;
}

function weightedAverage(
  values: Array<{ value: number; weight: number }>,
): number | null {
  const totalWeight = values.reduce((sum, item) => sum + item.weight, 0);
  return totalWeight > 0
    ? values.reduce((sum, item) => sum + item.value * item.weight, 0) /
      totalWeight
    : null;
}

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 1) return sorted[0];
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function finiteNumber(value: unknown): number | null {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function normalizeStatisticValue(
  value: number | null,
  metric: "flow_cfs" | "water_temp_f",
): number | null {
  if (value == null) return null;
  // USGS parameter 00010 statistics are always published in degrees Celsius.
  return metric === "water_temp_f" ? value * 9 / 5 + 32 : value;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
