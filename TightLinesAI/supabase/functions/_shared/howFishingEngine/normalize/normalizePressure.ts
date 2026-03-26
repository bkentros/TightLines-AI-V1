import type { VariableState } from "../contracts/mod.ts";
import { clampEngineScore, pieceLinear } from "../score/engineScoreMath.ts";

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
      // Post-front settling often still fishes well; neutral (0) avoids systematic Fair caps on
      // legitimate "clearing" days while keeping full -2 for ongoing volatile windows.
      if (series.length >= 6) {
        const recentSlice = series.slice(-8);
        const recentRange = Math.max(...recentSlice) - Math.min(...recentSlice);
        if (recentRange < 3.0) {
          return {
            quality,
            state: {
              label: "recently_stabilizing",
              score: 0,
              detail: `prior range ${range24.toFixed(1)} mb, now settling (recent range ${recentRange.toFixed(1)} mb)`,
            },
          };
        }
      }

      const chaos = Math.max(range24 - 8, max3hSwing - 4, 0);
      const volScore = clampEngineScore(pieceLinear(chaos, 0, 6, -1.35, -2));
      return {
        quality,
        state: {
          label: "volatile",
          score: volScore,
          detail: `range ${range24.toFixed(1)} mb, 3h swing ${max3hSwing.toFixed(1)}`,
        },
      };
    }
  }

  const absDelta = Math.abs(delta24);

  // --- Falling pressure: the BEST fishing trigger ---
  if (delta24 < -0.5) {
    if (absDelta > 6.0) {
      const score = clampEngineScore(
        pieceLinear(absDelta, 6, 11, -0.45, -1.35),
      );
      return {
        quality,
        state: { label: "falling_hard", score, detail: `${delta24.toFixed(1)} mb/24h` },
      };
    }
    if (absDelta > 4.0) {
      const score = clampEngineScore(
        pieceLinear(absDelta, 4, 6, 1.1, -0.45),
      );
      return {
        quality,
        state: { label: "falling_moderate", score, detail: `${delta24.toFixed(1)} mb/24h` },
      };
    }
    const score = clampEngineScore(
      pieceLinear(absDelta, 0.5, 4, 2, 1.1),
    );
    return {
      quality,
      state: { label: "falling_slow", score, detail: `${delta24.toFixed(1)} mb/24h` },
    };
  }

  if (delta24 > 0.5) {
    if (delta24 <= 3.0) {
      const score = clampEngineScore(
        pieceLinear(delta24, 0.5, 3, 1, 0.42),
      );
      return {
        quality,
        state: { label: "rising_slow", score, detail: `+${delta24.toFixed(1)} mb/24h` },
      };
    }
    const score = clampEngineScore(
      pieceLinear(delta24, 3, 7.5, 0.42, -0.45),
    );
    return {
      quality,
      state: { label: "rising_fast", score, detail: `+${delta24.toFixed(1)} mb/24h` },
    };
  }

  return {
    quality,
    state: { label: "stable_neutral", score: 0, detail: `${delta24.toFixed(1)} mb/24h` },
  };
}

/** @deprecated use normalizePressureDetailed for quality-aware reliability */
export function normalizePressure(
  pressureHistoryMb: number[] | null | undefined
): VariableState | null {
  const r = normalizePressureDetailed(pressureHistoryMb);
  return r?.state ?? null;
}
