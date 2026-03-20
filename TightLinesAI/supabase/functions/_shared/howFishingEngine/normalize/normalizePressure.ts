import type { VariableState } from "../contracts/mod.ts";

/** Per VARIABLE_THRESHOLDS — sparse history downgrades reliability one level */
export type PressureHistoryQuality = "two_point" | "sparse" | "adequate";

export type PressureNormalizeResult = {
  state: VariableState;
  quality: PressureHistoryQuality;
};

/**
 * Rolling ~3h pressure swing: assume hourly samples when length 8–49; else scale lag to ~3h span.
 */
function maxRolling3hSwingMb(series: number[]): number {
  const n = series.length;
  if (n < 2) return 0;
  const lag =
    n >= 8 && n <= 49
      ? 3
      : Math.max(1, Math.min(n - 1, Math.round((3 * (n - 1)) / 24)));
  let max = 0;
  for (let i = 0; i + lag < n; i++) {
    max = Math.max(max, Math.abs(series[i + lag]! - series[i]!));
  }
  return max;
}

export function normalizePressureDetailed(
  pressureHistoryMb: number[] | null | undefined
): PressureNormalizeResult | null {
  const series = (pressureHistoryMb ?? []).filter((x) => typeof x === "number" && !Number.isNaN(x));
  if (series.length < 2) return null;

  const quality: PressureHistoryQuality =
    series.length === 2 ? "two_point" : series.length < 12 ? "sparse" : "adequate";

  const latest = series[series.length - 1]!;
  const oldest = series[0]!;
  const delta24 = latest - oldest;
  const range24 = Math.max(...series) - Math.min(...series);
  const max3hSwing = maxRolling3hSwingMb(series);

  let directionChanges = 0;
  if (series.length >= 3) {
    let prevSign = 0;
    for (let i = 1; i < series.length; i++) {
      const d = series[i]! - series[i - 1]!;
      const s = d > 0.3 ? 1 : d < -0.3 ? -1 : 0;
      if (s !== 0 && prevSign !== 0 && s !== prevSign) directionChanges++;
      if (s !== 0) prevSign = s;
    }
  }

  if (series.length >= 3) {
    if (
      range24 >= 8.0 ||
      max3hSwing >= 3.5 ||
      (directionChanges >= 4 && range24 >= 5.0)
    ) {
      return {
        quality,
        state: {
          label: "volatile",
          score: -2,
          detail: `range ${range24.toFixed(1)} mb, 3h swing ${max3hSwing.toFixed(1)}`,
        },
      };
    }
  }

  if (delta24 <= -1.8) {
    return { quality, state: { label: "falling", score: -1 } };
  }
  if (delta24 >= 1.2 && range24 < 5.0) {
    return { quality, state: { label: "stable_positive", score: 1 } };
  }
  if (delta24 >= -1.7 && delta24 <= 1.1) {
    return { quality, state: { label: "stable_neutral", score: 0 } };
  }
  return { quality, state: { label: "stable_neutral", score: 0 } };
}

/** @deprecated use normalizePressureDetailed for quality-aware reliability */
export function normalizePressure(
  pressureHistoryMb: number[] | null | undefined
): VariableState | null {
  const r = normalizePressureDetailed(pressureHistoryMb);
  return r?.state ?? null;
}
