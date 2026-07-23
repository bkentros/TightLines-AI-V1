import type { RiverMetric } from "../types.ts";
import type { RiverRunGaugeBaseline } from "../storage/types.ts";
import { canonicalBaselineDayCandidates } from "./baselineCalendar.ts";

export type NormalizedBaselineObservation = {
  riverId: string;
  metric: RiverMetric;
  localDate: string;
  value: number | null;
};

export type GenerateGaugeBaselinesInput = {
  observations: NormalizedBaselineObservation[];
  riverId: string;
  metric: RiverMetric;
  baselineVersion: string;
  windowRadiusDays?: number;
  minDistinctYears?: number;
  minUsableValues?: number;
  sourceNotes?: string | null;
};

type DailyGaugeValue = {
  riverId: string;
  metric: RiverMetric;
  localDate: string;
  year: number;
  canonicalDays: number[];
  value: number;
};

export function generateGaugeBaselineRows(
  input: GenerateGaugeBaselinesInput,
): RiverRunGaugeBaseline[] {
  const windowRadiusDays = input.windowRadiusDays ?? 14;
  const minDistinctYears = input.minDistinctYears ?? 2;
  const minUsableValues = input.minUsableValues ?? 20;
  const dailyValues = collapseObservationsToDailyMedians(input.observations)
    .filter((item) =>
      item.riverId === input.riverId && item.metric === input.metric
    );
  const rows: RiverRunGaugeBaseline[] = [];

  for (let dayOfYear = 1; dayOfYear <= 365; dayOfYear++) {
    const windowValues = dailyValues.filter((item) =>
      item.canonicalDays.some((candidate) =>
        circularDayDistance(dayOfYear, candidate) <= windowRadiusDays
      )
    );
    const distinctYears = new Set(windowValues.map((item) => item.year)).size;
    if (
      distinctYears < minDistinctYears ||
      windowValues.length < minUsableValues
    ) {
      continue;
    }

    rows.push({
      riverId: input.riverId,
      metric: input.metric,
      dayOfYear,
      baselineVersion: input.baselineVersion,
      percentiles: {
        p10: percentile(windowValues.map((item) => item.value), 0.1),
        p25: percentile(windowValues.map((item) => item.value), 0.25),
        p40: percentile(windowValues.map((item) => item.value), 0.4),
        p65: percentile(windowValues.map((item) => item.value), 0.65),
        p85: percentile(windowValues.map((item) => item.value), 0.85),
        p90: percentile(windowValues.map((item) => item.value), 0.9),
      },
      bandData: { method: "rolling_percentile", windowRadiusDays },
      sampleCount: windowValues.length,
      distinctYears,
      windowDays: windowRadiusDays,
      sourceNotes: input.sourceNotes ?? null,
    });
  }

  return rows;
}

export function collapseObservationsToDailyMedians(
  observations: NormalizedBaselineObservation[],
): DailyGaugeValue[] {
  const grouped = new Map<string, NormalizedBaselineObservation[]>();
  for (const observation of observations) {
    if (!Number.isFinite(observation.value)) continue;
    const key =
      `${observation.riverId}|${observation.metric}|${observation.localDate}`;
    grouped.set(key, [...(grouped.get(key) ?? []), observation]);
  }

  return [...grouped.values()].map((items) => {
    const first = items[0];
    return {
      riverId: first.riverId,
      metric: first.metric,
      localDate: first.localDate,
      year: Number(first.localDate.slice(0, 4)),
      canonicalDays: canonicalBaselineDayCandidates(first.localDate),
      value: median(items.map((item) => item.value as number)),
    };
  }).toSorted((a, b) => a.localDate.localeCompare(b.localDate));
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) return NaN;
  if (sorted.length === 1) return sorted[0];
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  const weight = index - lower;
  return sorted[lower] + (sorted[upper] - sorted[lower]) * weight;
}

function circularDayDistance(a: number, b: number): number {
  const raw = Math.abs(a - b);
  return Math.min(raw, 365 - raw);
}
