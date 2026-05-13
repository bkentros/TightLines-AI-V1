import type {
  EngineContext,
  RegionKey,
  TemperatureBandLabel,
  TemperatureNormalized,
} from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
import { freshwaterTempRow } from "../config/tempBandsFreshwater.ts";
import { coastalTempRow } from "../config/tempBandsCoastal.ts";
import { coastalWaterTempRow } from "../config/tempBandsCoastalWater.ts";
import {
  clampEngineScore,
  ENGINE_SCORE_EPSILON,
  pieceLinear,
} from "../score/engineScoreMath.ts";

const WARM_TO_VERY_WARM_SPAN_F = 10;
const BAND_WEIGHT = 0.90;
const STABLE_BONUS = 0.05;
const SHOCK_IMPROVEMENT_THRESHOLD = 1.50;
const IMPROVED_SHOCK_FLOOR = -0.90;
const MAX_TREND_COMPONENT = 0.70;
const MOVING_STABILITY_ADJ = 0;
const UNSTABLE_STABILITY_ADJ = -0.2;
const TREND_WEIGHT = 0.55;
const SHOCK_24H_THRESHOLD_F = 10;
const SHOCK_48H_THRESHOLD_F = 18;
const SHOCK_48H_LAST_LEG_MIN_F = 5;
const SHARP_24H_SHOCK_COMPONENT = -1.05;
const SUSTAINED_48H_SHOCK_COMPONENT = -0.9;
const FAVORABLE_STABLE_MIN_SCORE = 1;
const BAD_STABLE_MAX_SCORE = -0.75;

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

function semanticBandLabel(
  t: number,
  vc: number,
  cool: number,
  opt: number,
  warm: number,
  bandScore: number,
): TemperatureBandLabel {
  const label = discreteBandLabel(t, vc, cool, opt, warm);
  if (label === "optimal" && bandScore < -ENGINE_SCORE_EPSILON) {
    return "near_optimal";
  }
  return label;
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

function clampComponent(n: number, maxAbs: number): number {
  return Math.max(-maxAbs, Math.min(maxAbs, n));
}

/**
 * TEMPERATURE_AND_MODIFIER_REFERENCE:
 * - freshwater contexts use calendar-day mean AIR temperature
 * - coastal contexts use measured coastal water temperature when present,
 *   otherwise calendar-day mean AIR temperature
 * - coastal contexts use coastal temperature band tables (species-calibrated)
 * - freshwater contexts use freshwater air-temp band tables
 * - trend is based on whether thermal favorability improved or worsened relative to
 *   the same month/region table, not on a hard-coded "optimal" label assumption
 * - shock penalizes abrupt same-source instability
 *
 * Temperature V2.1-lite production wiring:
 * final_score = clamp(
 *   band_score * 0.90
 *   + favorability-aware stability_component
 *   + clamp(favorability_delta_72h * 0.55, -0.70, 0.70)
 *   + direction-aware shock_component,
 *   -2,
 *   2
 * )
 * Interpolation remains intentionally parked; production still uses the current
 * region/month row directly.
 *
 * Rollback note: this keeps the public normalizeTemperature signature and output
 * shape stable. If V2.1-lite needs to be backed out, restore the previous body here
 * without changing callers.
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

  const hasMeasuredWaterTemp = coastalContext &&
    isFiniteTemp(opts?.measuredWaterTempF);
  const selectedTempF = hasMeasuredWaterTemp
    ? opts!.measuredWaterTempF
    : dailyMeanF;
  if (!isFiniteTemp(selectedTempF)) return null;

  const priorSelectedF = hasMeasuredWaterTemp
    ? opts?.measuredWaterTemp24hAgoF
    : priorMeanF;
  const dayMinus2SelectedF = hasMeasuredWaterTemp
    ? opts?.measuredWaterTemp72hAgoF
    : dayMinus2MeanF;

  const row = hasMeasuredWaterTemp
    ? coastalWaterTempRow(region, month)
    : coastalContext
    ? coastalTempRow(region, month)
    : freshwaterTempRow(region, month);
  if (!row || row.length < 5) return null;

  const vc = Number(row[0]);
  const cool = Number(row[1]);
  const opt = Number(row[2]);
  const warm = Number(row[3]);
  const scores = row[4] as unknown as number[];
  if (!Array.isArray(scores) || scores.length < 5) return null;

  const bandScore = taperedBandScore(
    selectedTempF,
    vc,
    cool,
    opt,
    warm,
    scores,
  );
  const label = semanticBandLabel(
    selectedTempF,
    vc,
    cool,
    opt,
    warm,
    bandScore,
  );

  const d1 = isFiniteTemp(priorSelectedF)
    ? selectedTempF - priorSelectedF
    : null;
  const d2 = isFiniteTemp(dayMinus2SelectedF)
    ? selectedTempF - dayMinus2SelectedF
    : null;

  let candidateTrendLabel: "warming" | "stable" | "cooling" = "stable";
  if (d2 !== null && Math.abs(d2) >= 5) {
    candidateTrendLabel = d2 > 0 ? "warming" : "cooling";
  }

  const hasCompleteHistory = isFiniteTemp(priorSelectedF) &&
    isFiniteTemp(dayMinus2SelectedF);
  const stable = hasCompleteHistory &&
    d1 !== null &&
    d2 !== null &&
    Math.abs(d1) < 3 &&
    Math.abs(d2) < 5;
  const unstable = hasCompleteHistory &&
    d1 !== null &&
    d2 !== null &&
    (Math.abs(d1) >= 7 || Math.abs(d2) >= 12);
  const stabilityComponent = !hasCompleteHistory
    ? 0
    : stable
    ? bandScore >= FAVORABLE_STABLE_MIN_SCORE
      ? STABLE_BONUS
      : bandScore <= BAD_STABLE_MAX_SCORE
      ? 0
      : 0
    : unstable
    ? UNSTABLE_STABILITY_ADJ
    : MOVING_STABILITY_ADJ;

  const prior24BandScore = isFiniteTemp(priorSelectedF)
    ? bandScoreForRow(priorSelectedF, row)
    : null;
  const prior72BandScore = isFiniteTemp(dayMinus2SelectedF)
    ? bandScoreForRow(dayMinus2SelectedF, row)
    : null;
  const favorabilityDelta24h = prior24BandScore == null
    ? null
    : bandScore - prior24BandScore;
  const favorabilityDelta72h = prior72BandScore == null
    ? null
    : bandScore - prior72BandScore;

  let shockLabel: "none" | "sharp_warmup" | "sharp_cooldown" = "none";
  let shockComponent = 0;
  const sustained48hShock = d1 !== null &&
    d2 !== null &&
    Math.abs(d1) >= SHOCK_48H_LAST_LEG_MIN_F &&
    Math.abs(d2) >= SHOCK_48H_THRESHOLD_F &&
    Math.sign(d1) === Math.sign(d2);

  if (d1 !== null && Math.abs(d1) >= SHOCK_24H_THRESHOLD_F) {
    shockLabel = d1 >= 0 ? "sharp_warmup" : "sharp_cooldown";
    shockComponent = SHARP_24H_SHOCK_COMPONENT;
  } else if (sustained48hShock) {
    shockLabel = d2! >= 0 ? "sharp_warmup" : "sharp_cooldown";
    shockComponent = SUSTAINED_48H_SHOCK_COMPONENT;
  }
  const shockImprovedFavorability = shockLabel !== "none" &&
    ((favorabilityDelta24h ?? -Infinity) >= SHOCK_IMPROVEMENT_THRESHOLD ||
      (favorabilityDelta72h ?? -Infinity) >= SHOCK_IMPROVEMENT_THRESHOLD);
  if (shockImprovedFavorability) {
    shockComponent = Math.max(shockComponent, IMPROVED_SHOCK_FLOOR);
  }

  let trendAdj = 0;
  if (
    shockLabel === "none" &&
    isFiniteTemp(dayMinus2SelectedF) &&
    d2 !== null &&
    Math.abs(d2) >= 5
  ) {
    if (prior72BandScore != null) {
      trendAdj = clampComponent(
        (bandScore - prior72BandScore) * TREND_WEIGHT,
        MAX_TREND_COMPONENT,
      );
    }
  }

  const trendLabel = shockLabel === "none" ? candidateTrendLabel : "stable";
  const shockAdj: -1 | 0 = shockComponent < 0 ? -1 : 0;
  const final_score = clampEngineScore(
    bandScore * BAND_WEIGHT + stabilityComponent + trendAdj + shockComponent,
  );

  const context_group = coastalContext ? "coastal" : "freshwater";
  const measurement_source = hasMeasuredWaterTemp
    ? "coastal_water_temp"
    : "air_daily_mean";

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
