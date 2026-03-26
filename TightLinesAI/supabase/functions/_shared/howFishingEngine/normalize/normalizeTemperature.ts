import type {
  EngineContext,
  RegionKey,
  TemperatureBandLabel,
  TemperatureNormalized,
} from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
import { freshwaterTempRow } from "../config/tempBandsFreshwater.ts";
import {
  clampEngineScore,
  engineScoreTier,
  pieceLinear,
} from "../score/engineScoreMath.ts";

const WARM_TO_VERY_WARM_SPAN_F = 10;

function clampAnchor(n: number): number {
  return Math.max(-2, Math.min(2, n));
}

function discreteBandLabel(
  t: number,
  vc: number,
  cool: number,
  opt: number,
  warm: number,
): TemperatureBandLabel {
  if (t <= vc) return "very_cold";
  if (t <= cool) return "cool";
  if (t <= opt) return "optimal";
  if (t <= warm) return "warm";
  return "very_warm";
}

/** Piecewise-linear score through table knots; plateaus outside inner range. */
function taperedBandScore(
  t: number,
  vc: number,
  cool: number,
  opt: number,
  warm: number,
  scores: number[],
): number {
  const s0 = clampAnchor(scores[0]!);
  const s1 = clampAnchor(scores[1]!);
  const s2 = clampAnchor(scores[2]!);
  const s3 = clampAnchor(scores[3]!);
  const s4 = clampAnchor(scores[4]!);

  if (t <= vc) return clampEngineScore(s0);
  if (t <= cool) return clampEngineScore(pieceLinear(t, vc, cool, s0, s1));
  if (t <= opt) return clampEngineScore(pieceLinear(t, cool, opt, s1, s2));
  if (t <= warm) return clampEngineScore(pieceLinear(t, opt, warm, s2, s3));
  return clampEngineScore(
    pieceLinear(t, warm, warm + WARM_TO_VERY_WARM_SPAN_F, s3, s4),
  );
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
  dayMinus2MeanF: number | null | undefined,
): TemperatureNormalized | null {
  if (dailyMeanF == null || Number.isNaN(dailyMeanF)) return null;

  const row = freshwaterTempRow(region, month);
  if (!row || row.length < 5) return null;

  const vc = Number(row[0]);
  const cool = Number(row[1]);
  const opt = Number(row[2]);
  const warm = Number(row[3]);
  const scores = row[4] as unknown as number[];
  if (!Array.isArray(scores) || scores.length < 5) return null;

  const label = discreteBandLabel(dailyMeanF, vc, cool, opt, warm);
  const bandScore = taperedBandScore(
    dailyMeanF,
    vc,
    cool,
    opt,
    warm,
    scores,
  );

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

  // Skip trend nudge when already at a strong table extreme (legacy ±2 behavior).
  if (
    shockAdj === 0 &&
    bandScore < 1.875 &&
    bandScore > -1.875 &&
    dayMinus2MeanF != null
  ) {
    const delta72h = dailyMeanF - dayMinus2MeanF;
    if (delta72h >= 5) trendAdj = 1;
    else if (delta72h <= -5) trendAdj = -1;
  }

  let final_score = clampEngineScore(bandScore + trendAdj + shockAdj);

  if (
    isCoastalFamilyContext(context) &&
    label === "cool" &&
    shockAdj === 0 &&
    engineScoreTier(final_score) === -1 &&
    bandScore >= -1.2 &&
    bandScore <= -0.65
  ) {
    final_score = clampEngineScore(0);
  }

  const context_group = isCoastalFamilyContext(context) ? "coastal" : "freshwater";

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
