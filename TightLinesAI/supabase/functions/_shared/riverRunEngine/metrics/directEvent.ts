import type { DirectEventSample } from "../types.ts";

const HOUR_MS = 60 * 60 * 1000;

/**
 * Converts noisy provider observations into the exact evidence cadence used by
 * Push. Each sample is the median of the trailing four hours, and anchors are
 * four hours apart. Medians damp single-reading spikes; 12/24-hour comparisons
 * therefore compare like time windows rather than one raw point to another.
 */
export function buildDirectEventSeries<T>(input: {
  observations: readonly T[];
  refreshAtUtc: string;
  observedAt: (observation: T) => string;
  value: (observation: T) => number | null;
  historyHours?: number;
  minimumObservationsPerWindow?: number;
}): DirectEventSample[] {
  const refreshMs = Date.parse(input.refreshAtUtc);
  if (!Number.isFinite(refreshMs)) return [];
  const historyHours = input.historyHours ?? 76;
  const minimum = input.minimumObservationsPerWindow ?? 2;
  const points = input.observations.flatMap((observation) => {
    const at = Date.parse(input.observedAt(observation));
    const value = input.value(observation);
    return Number.isFinite(at) && value != null && Number.isFinite(value) &&
        at <= refreshMs
      ? [{ at, value }]
      : [];
  }).toSorted((left, right) => left.at - right.at);
  const samples: DirectEventSample[] = [];
  for (let ageHours = historyHours; ageHours >= 0; ageHours -= 4) {
    const end = refreshMs - ageHours * HOUR_MS;
    const start = end - 4 * HOUR_MS;
    const values = points
      .filter((point) => point.at > start && point.at <= end)
      .map((point) => point.value);
    if (values.length < minimum) continue;
    samples.push({
      windowEndAt: new Date(end).toISOString(),
      value: median(values),
      observationCount: values.length,
    });
  }
  return samples;
}

function median(values: number[]): number {
  const sorted = [...values].toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}
