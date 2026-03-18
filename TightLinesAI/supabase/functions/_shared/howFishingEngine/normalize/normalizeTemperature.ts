import type {
  EngineContext,
  RegionKey,
  TemperatureBandLabel,
  TemperatureNormalized,
} from "../contracts/mod.ts";
import { freshwaterTempRow } from "../config/tempBandsFreshwater.ts";
import { coastalTempRow } from "../config/tempBandsCoastal.ts";

function clampScore(n: number): -2 | -1 | 0 | 1 | 2 {
  return Math.max(-2, Math.min(2, Math.round(n))) as -2 | -1 | 0 | 1 | 2;
}

function bandFromTemp(
  t: number,
  vc: number,
  cool: number,
  opt: number,
  warm: number,
  scores: number[]
): { label: TemperatureBandLabel; bandScore: -2 | -1 | 0 | 1 | 2 } {
  const s = (i: number) => clampScore(scores[i]!);
  if (t <= vc) return { label: "very_cold", bandScore: s(0) };
  if (t <= cool) return { label: "cool", bandScore: s(1) };
  if (t <= opt) return { label: "optimal", bandScore: s(2) };
  if (t <= warm) return { label: "warm", bandScore: s(3) };
  return { label: "very_warm", bandScore: s(4) };
}

/**
 * TEMPERATURE_AND_MODIFIER_REFERENCE: 72h trend (daily vs day-2 mean),
 * shock on abrupt 24–48h movement (|today−prior|≥10 or |prior−d2|≥10).
 */
export function normalizeTemperature(
  context: EngineContext,
  region: RegionKey,
  month: number,
  dailyMeanF: number | null | undefined,
  priorMeanF: number | null | undefined,
  dayMinus2MeanF: number | null | undefined
): TemperatureNormalized | null {
  if (dailyMeanF == null || Number.isNaN(dailyMeanF)) return null;

  const row =
    context === "coastal"
      ? coastalTempRow(region, month)
      : freshwaterTempRow(region, month);
  if (!row || row.length < 5) return null;

  const vc = Number(row[0]);
  const cool = Number(row[1]);
  const opt = Number(row[2]);
  const warm = Number(row[3]);
  const scores = row[4] as unknown as number[];
  if (!Array.isArray(scores) || scores.length < 5) return null;
  const { label, bandScore } = bandFromTemp(dailyMeanF, vc, cool, opt, warm, scores);

  let trendLabel: "warming" | "stable" | "cooling" = "stable";
  let trendAdj: -1 | 0 | 1 = 0;
  if (dayMinus2MeanF != null && !Number.isNaN(dayMinus2MeanF)) {
    const delta72h = dailyMeanF - dayMinus2MeanF;
    if (delta72h >= 5) trendLabel = "warming";
    else if (delta72h <= -5) trendLabel = "cooling";
  }

  let shockLabel: "none" | "sharp_warmup" | "sharp_cooldown" = "none";
  let shockAdj: -1 | 0 = 0;
  const d1 =
    priorMeanF != null && !Number.isNaN(priorMeanF)
      ? dailyMeanF - priorMeanF
      : null;
  const d2step =
    priorMeanF != null &&
    dayMinus2MeanF != null &&
    !Number.isNaN(priorMeanF) &&
    !Number.isNaN(dayMinus2MeanF)
      ? priorMeanF - dayMinus2MeanF
      : null;

  const shock24 = d1 !== null && (d1 >= 10 || d1 <= -10);
  const shock48 = d2step !== null && (d2step >= 10 || d2step <= -10);

  if (shock24) {
    shockLabel = d1! >= 10 ? "sharp_warmup" : "sharp_cooldown";
    shockAdj = -1;
  } else if (shock48) {
    shockLabel = d2step! >= 10 ? "sharp_warmup" : "sharp_cooldown";
    shockAdj = -1;
  }

  /**
   * Band score is primary. Trend is a slight nudge only when:
   * - no shock penalty (shock already reflects instability), and
   * - band is not already at an extreme (±2), so season table stays dominant.
   */
  if (shockAdj === 0 && Math.abs(bandScore) < 2 && dayMinus2MeanF != null) {
    const delta72h = dailyMeanF - dayMinus2MeanF;
    if (delta72h >= 5) trendAdj = 1;
    else if (delta72h <= -5) trendAdj = -1;
  }

  const final_score = clampScore(bandScore + trendAdj + shockAdj);
  const context_group = context === "coastal" ? "coastal" : "freshwater";

  return {
    context_group,
    band_label: label,
    band_score: bandScore,
    trend_label: trendLabel,
    trend_adjustment: trendAdj,
    shock_label: shockLabel,
    shock_adjustment: shockAdj,
    final_score,
  };
}
