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

  // --- Volatile: erratic oscillation (genuinely bad) ---
  // Thresholds: range >= 8 mb over full window, OR 3h swing >= 4 mb, OR
  // 4+ direction reversals with >= 5 mb total range (oscillation, not just a front passage).
  // Note: max3hSwing threshold raised from 3.5 → 4.0 to avoid over-penalizing normal front passages.
  if (series.length >= 3) {
    if (
      range24 >= 8.0 ||
      max3hSwing >= 4.0 ||
      (directionChanges >= 4 && range24 >= 5.0)
    ) {
      // --- Recency check: if the last 4+ readings are tightly stable, the worst has passed.
      // Pressure was swinging earlier but has now settled — fish are adjusting/recovering.
      // Score softens to -1 ("recently_stabilizing") rather than full -2 penalty.
      if (series.length >= 6) {
        const recentSlice = series.slice(-8);
        const recentRange = Math.max(...recentSlice) - Math.min(...recentSlice);
        if (recentRange < 3.0) {
          return {
            quality,
            state: {
              label: "recently_stabilizing",
              score: -1,
              detail: `prior range ${range24.toFixed(1)} mb, now settling (recent range ${recentRange.toFixed(1)} mb)`,
            },
          };
        }
      }

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

  const absDelta = Math.abs(delta24);

  // --- Falling pressure: the BEST fishing trigger ---
  // Slow steady drop signals an approaching front → peak feeding activity.
  if (delta24 < -0.5) {
    // Rapid crash (>6 mb/24h) = severe front, genuinely bad
    if (absDelta > 6.0) {
      return { quality, state: { label: "falling_hard", score: -1, detail: `${delta24.toFixed(1)} mb/24h` } };
    }
    // Strong steady drop (4–6 mb) = front arriving, still positive but fish may slow later
    if (absDelta > 4.0) {
      return { quality, state: { label: "falling_moderate", score: 1, detail: `${delta24.toFixed(1)} mb/24h` } };
    }
    // Sweet spot: slow steady drop (0.5–4 mb) = prime feeding conditions
    return { quality, state: { label: "falling_slow", score: 2, detail: `${delta24.toFixed(1)} mb/24h` } };
  }

  // --- Rising pressure: post-front, fish re-adjusting ---
  if (delta24 > 0.5) {
    // Slow rise = stable recovery, mildly positive
    if (delta24 <= 3.0) {
      return { quality, state: { label: "rising_slow", score: 1, detail: `+${delta24.toFixed(1)} mb/24h` } };
    }
    // Rapid rise = quick clearing, neutral (fish still adjusting)
    return { quality, state: { label: "rising_fast", score: 0, detail: `+${delta24.toFixed(1)} mb/24h` } };
  }

  // --- Steady pressure: flat, neutral ---
  return { quality, state: { label: "stable_neutral", score: 0, detail: `${delta24.toFixed(1)} mb/24h` } };
}

/** @deprecated use normalizePressureDetailed for quality-aware reliability */
export function normalizePressure(
  pressureHistoryMb: number[] | null | undefined
): VariableState | null {
  const r = normalizePressureDetailed(pressureHistoryMb);
  return r?.state ?? null;
}
