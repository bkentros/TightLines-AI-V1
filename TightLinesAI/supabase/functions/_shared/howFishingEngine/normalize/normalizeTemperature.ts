import type {
  EngineContext,
  RegionKey,
  TemperatureBandLabel,
  TemperatureNormalized,
} from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
import { freshwaterTempRow } from "../config/tempBandsFreshwater.ts";
import { coastalTempRow } from "../config/tempBandsCoastal.ts";
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
 * TEMPERATURE_AND_MODIFIER_REFERENCE: 72h band-relative trend (daily vs day-2 mean),
 * shock on abrupt 24h movement only (|today−prior|≥10). Trend direction is evaluated
 * relative to the current band — warming helps only when below optimal, cooling helps
 * only when above optimal; either direction away from optimal is a mild negative.
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

  // Route to the correct band table based on what the user is actually fishing.
  // Coastal contexts (inshore, flats/estuary) use saltwater-species-calibrated tables.
  // Freshwater contexts always use freshwater tables — geographic proximity to coast is irrelevant.
  const row = isCoastalFamilyContext(context)
    ? coastalTempRow(region, month)
    : freshwaterTempRow(region, month);
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

  let shockLabel: "none" | "sharp_warmup" | "sharp_cooldown" = "none";
  let shockAdj: -1 | 0 = 0;
  const d1 =
    priorMeanF != null && !Number.isNaN(priorMeanF)
      ? dailyMeanF - priorMeanF
      : null;

  if (d1 !== null && (d1 >= 10 || d1 <= -10)) {
    shockLabel = d1 >= 10 ? "sharp_warmup" : "sharp_cooldown";
    shockAdj = -1;
  }

  // Band-relative trend: direction only helps if it moves toward the optimal zone.
  // Warming in cold bands (+1) and cooling in warm bands (+1) = approaching optimal.
  // Any movement away from optimal, or leaving optimal in either direction, = -1.
  if (shockAdj === 0 && dayMinus2MeanF != null && !Number.isNaN(dayMinus2MeanF)) {
    const delta72h = dailyMeanF - dayMinus2MeanF;
    if (delta72h >= 5) {
      trendLabel = "warming";
      trendAdj = (label === "very_cold" || label === "cool") ? 1 : -1;
    } else if (delta72h <= -5) {
      trendLabel = "cooling";
      trendAdj = (label === "warm" || label === "very_warm") ? 1 : -1;
    }
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
