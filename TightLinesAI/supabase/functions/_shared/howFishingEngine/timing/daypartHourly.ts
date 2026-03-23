/**
 * Shared clock math for timing — aligns with marketing buckets:
 * dawn 5–7, morning 7–11, afternoon 11–17, evening 17–21 (local hour).
 */

import type { DaypartFlags } from "./timingTypes.ts";

/** Inclusive local hour ranges per bucket index 0..3 */
export const DAYPART_BUCKET_RANGES: readonly [readonly [number, number], readonly [number, number], readonly [number, number], readonly [number, number]] = [
  [5, 6],
  [7, 10],
  [11, 16],
  [17, 20],
];

export function daypartIndexFromClockHour(h: number): 0 | 1 | 2 | 3 {
  const x = ((h % 24) + 24) % 24;
  if (x >= 5 && x < 7) return 0;
  if (x >= 7 && x < 11) return 1;
  if (x >= 11 && x < 17) return 2;
  if (x >= 17 && x < 21) return 3;
  if (x < 5) return 0;
  return 3;
}

export function singleDaypart(d: 0 | 1 | 2 | 3): DaypartFlags {
  const p: DaypartFlags = [false, false, false, false];
  p[d] = true;
  return p;
}

export function meanInHourRange(values: number[], lo: number, hi: number): number | null {
  let s = 0;
  let c = 0;
  const n = values.length;
  for (let h = lo; h <= hi && h < n; h++) {
    const v = values[h];
    if (typeof v === "number" && !Number.isNaN(v)) {
      s += v;
      c++;
    }
  }
  return c > 0 ? s / c : null;
}

/** Mean value per daypart bucket, or null if insufficient hourly coverage */
export function daypartMeansForSeries(values: number[]): [
  number | null,
  number | null,
  number | null,
  number | null,
] | null {
  if (values.length < 12) return null;
  const out: [number | null, number | null, number | null, number | null] = [
    null,
    null,
    null,
    null,
  ];
  for (let b = 0; b < 4; b++) {
    const [lo, hi] = DAYPART_BUCKET_RANGES[b]!;
    out[b] = meanInHourRange(values, lo, hi);
  }
  return out;
}

/** Keep only the top `maxBuckets` true slots by descending `bucketScores` */
export function collapseTrueDaypartsToTopByScore(
  periods: DaypartFlags,
  bucketScores: number[],
  maxBuckets: number,
): DaypartFlags {
  const idxs = [0, 1, 2, 3].filter((i) => periods[i]);
  if (idxs.length <= maxBuckets) return periods;
  const sorted = [...idxs].sort(
    (a, b) => bucketScores[b]! - bucketScores[a]! || a - b,
  );
  const keep = new Set(sorted.slice(0, maxBuckets));
  return [keep.has(0), keep.has(1), keep.has(2), keep.has(3)];
}
