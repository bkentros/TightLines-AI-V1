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
const TREND_FAVORABILITY_DELTA_MIN = 0.35;
const SHOCK_24H_THRESHOLD_F = 10;
const SHOCK_48H_THRESHOLD_F = 18;
const SHOCK_48H_LAST_LEG_MIN_F = 5;

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

function isFiniteTemp(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value);
}

function bandScoreForRow(
  tempF: number,
  row: number[],
): number | null {
  if (!row || row.length < 5) return null;
  const vc = Number(row[0]);
  const cool = Number(row[1]);
  const opt = Number(row[2]);
  const warm = Number(row[3]);
  const scores = row[4] as unknown as number[];
  if (!Array.isArray(scores) || scores.length < 5) return null;
  return taperedBandScore(tempF, vc, cool, opt, warm, scores);
}

/**
 * TEMPERATURE_AND_MODIFIER_REFERENCE:
 * - all contexts use calendar-day mean AIR temperature
 * - coastal contexts use coastal air-temp band tables (species-calibrated)
 * - freshwater contexts use freshwater air-temp band tables
 * - trend is based on whether thermal favorability improved or worsened relative to
 *   the same month/region table, not on a hard-coded "optimal" label assumption
 * - shock penalizes abrupt 24h instability
 */
export function normalizeTemperature(
  context: EngineContext,
  region: RegionKey,
  month: number,
  dailyMeanF: number | null | undefined,
  priorMeanF: number | null | undefined,
  dayMinus2MeanF: number | null | undefined,
  opts?: {
    measuredWaterTempF?: number | null;
    measuredWaterTemp24hAgoF?: number | null;
    measuredWaterTemp72hAgoF?: number | null;
  },
): TemperatureNormalized | null {
  const coastalContext = isCoastalFamilyContext(context);

  const selectedTempF = dailyMeanF;
  if (!isFiniteTemp(selectedTempF)) return null;

  const priorSelectedF = priorMeanF;
  const dayMinus2SelectedF = dayMinus2MeanF;

  const row = coastalContext
    ? coastalTempRow(region, month)
    : freshwaterTempRow(region, month);
  if (!row || row.length < 5) return null;

  const vc = Number(row[0]);
  const cool = Number(row[1]);
  const opt = Number(row[2]);
  const warm = Number(row[3]);
  const scores = row[4] as unknown as number[];
  if (!Array.isArray(scores) || scores.length < 5) return null;

  const label = discreteBandLabel(selectedTempF, vc, cool, opt, warm);
  const bandScore = taperedBandScore(
    selectedTempF,
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
    isFiniteTemp(priorSelectedF)
      ? selectedTempF - priorSelectedF
      : null;
  const d2 =
    isFiniteTemp(dayMinus2SelectedF)
      ? selectedTempF - dayMinus2SelectedF
      : null;

  const sustained48hShock =
    d1 !== null &&
    d2 !== null &&
    Math.abs(d1) >= SHOCK_48H_LAST_LEG_MIN_F &&
    Math.abs(d2) >= SHOCK_48H_THRESHOLD_F &&
    Math.sign(d1) === Math.sign(d2);

  if (d1 !== null && Math.abs(d1) >= SHOCK_24H_THRESHOLD_F) {
    shockLabel = d1 >= 10 ? "sharp_warmup" : "sharp_cooldown";
    shockAdj = -1;
  } else if (sustained48hShock) {
    shockLabel = d2! >= 0 ? "sharp_warmup" : "sharp_cooldown";
    shockAdj = -1;
  }

  // Trend is a modest favorability nudge: compare today's table score against the score
  // the same table would have given the selected thermal source ~72h ago.
  if (shockAdj === 0 && isFiniteTemp(dayMinus2SelectedF)) {
    const delta72h = selectedTempF - dayMinus2SelectedF;
    if (delta72h >= 5 || delta72h <= -5) {
      const priorBandScore = bandScoreForRow(dayMinus2SelectedF, row);
      const favorabilityDelta =
        priorBandScore != null ? bandScore - priorBandScore : null;

      if (delta72h >= 5) {
        trendLabel = "warming";
      } else {
        trendLabel = "cooling";
      }

      if (favorabilityDelta != null) {
        if (favorabilityDelta >= TREND_FAVORABILITY_DELTA_MIN) {
          trendAdj = 1;
        } else if (favorabilityDelta <= -TREND_FAVORABILITY_DELTA_MIN) {
          trendAdj = -1;
        }
      }
    }
  }

  let final_score = clampEngineScore(bandScore + trendAdj + shockAdj);

  if (
    coastalContext &&
    label === "cool" &&
    shockAdj === 0 &&
    engineScoreTier(final_score) === -1 &&
    bandScore >= -1.2 &&
    bandScore <= -0.65
  ) {
    final_score = clampEngineScore(0);
  }

  const context_group = coastalContext ? "coastal" : "freshwater";
  const measurement_source = "air_daily_mean";

  return {
    context_group,
    measurement_source,
    measurement_value_f: selectedTempF,
    band_label: label,
    band_score: bandScore,
    trend_label: trendLabel,
    trend_adjustment: trendAdj,
    shock_label: shockLabel,
    shock_adjustment: shockAdj,
    final_score,
  };
}
