import type {
  EngineContext,
  RegionKey,
  TemperatureNormalized,
  TrendLabel,
} from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
import { freshwaterTempRow } from "../config/tempBandsFreshwater.ts";
import { coastalTempRow } from "../config/tempBandsCoastal.ts";
import { coastalWaterTempRow } from "../config/tempBandsCoastalWater.ts";
import { ENGINE_SCORE_EPSILON, pieceLinear } from "../score/engineScoreMath.ts";

export type TemperatureV2Diagnostics = {
  selected_source: "air_daily_mean" | "coastal_water_temp";
  selected_temp_f: number;
  prior_selected_temp_f: number | null;
  day_minus_2_selected_temp_f: number | null;
  baseline_band_score: number;
  band_component: number;
  stability_component: number;
  stability_basis: "complete_history" | "partial_or_missing_history";
  trend_component: number;
  shock_component: number;
  favorability_delta_72h: number | null;
  delta_24h_f: number | null;
  delta_72h_f: number | null;
  formula: string;
};

export type TemperatureV2Result = {
  temperature: TemperatureNormalized | null;
  diagnostics: TemperatureV2Diagnostics | null;
};

export type TemperatureV2Constants = {
  bandWeight: number;
  stableBonus: number;
  maxTrendComponent: number;
};

export const DEFAULT_TEMPERATURE_V2_CONSTANTS: TemperatureV2Constants = {
  bandWeight: 0.90,
  stableBonus: 0.05,
  maxTrendComponent: 0.70,
};

const MOVING_STABILITY_ADJ = 0;
const UNSTABLE_STABILITY_ADJ = -0.2;
const TREND_WEIGHT = 0.55;
const SHOCK_24H_THRESHOLD_F = 10;
const SHOCK_48H_THRESHOLD_F = 18;
const SHOCK_48H_LAST_LEG_MIN_F = 5;
const SHARP_24H_SHOCK_COMPONENT = -1.05;
const SUSTAINED_48H_SHOCK_COMPONENT = -0.9;

function clampScore(n: number): number {
  return Math.max(-2, Math.min(2, n));
}

function clampComponent(n: number, maxAbs: number): number {
  return Math.max(-maxAbs, Math.min(maxAbs, n));
}

function isFiniteTemp(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value);
}

function bandLabel(
  t: number,
  vc: number,
  cool: number,
  opt: number,
  warm: number,
  bandScore: number,
): TemperatureNormalized["band_label"] {
  const label = t <= vc
    ? "very_cold"
    : t <= cool
    ? "cool"
    : t <= opt
    ? "optimal"
    : t <= warm
    ? "warm"
    : "very_warm";
  if (label === "optimal" && bandScore < -ENGINE_SCORE_EPSILON) {
    return "near_optimal";
  }
  return label;
}

function taperedBandScore(
  t: number,
  vc: number,
  cool: number,
  opt: number,
  warm: number,
  scores: number[],
): number {
  const s0 = clampScore(scores[0]!);
  const s1 = clampScore(scores[1]!);
  const s2 = clampScore(scores[2]!);
  const s3 = clampScore(scores[3]!);
  const s4 = clampScore(scores[4]!);
  if (t <= vc) return s0;
  if (t <= cool) return clampScore(pieceLinear(t, vc, cool, s0, s1));
  if (t <= opt) return clampScore(pieceLinear(t, cool, opt, s1, s2));
  if (t <= warm) return clampScore(pieceLinear(t, opt, warm, s2, s3));
  return clampScore(pieceLinear(t, warm, warm + 10, s3, s4));
}

function rowForSource(args: {
  context: EngineContext;
  region: RegionKey;
  month: number;
  hasMeasuredWaterTemp: boolean;
}): number[] | null {
  if (args.hasMeasuredWaterTemp) {
    return coastalWaterTempRow(args.region, args.month);
  }
  if (isCoastalFamilyContext(args.context)) {
    return coastalTempRow(args.region, args.month);
  }
  return freshwaterTempRow(args.region, args.month);
}

export function normalizeTemperatureV2(
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
    constants?: Partial<TemperatureV2Constants>;
  },
): TemperatureV2Result {
  const constants = {
    ...DEFAULT_TEMPERATURE_V2_CONSTANTS,
    ...opts?.constants,
  };
  const coastalContext = isCoastalFamilyContext(context);
  const hasMeasuredWaterTemp = coastalContext &&
    isFiniteTemp(opts?.measuredWaterTempF);
  const selectedTempF = hasMeasuredWaterTemp
    ? opts!.measuredWaterTempF
    : dailyMeanF;
  if (!isFiniteTemp(selectedTempF)) {
    return { temperature: null, diagnostics: null };
  }

  const priorSelectedF = hasMeasuredWaterTemp
    ? opts?.measuredWaterTemp24hAgoF
    : priorMeanF;
  const dayMinus2SelectedF = hasMeasuredWaterTemp
    ? opts?.measuredWaterTemp72hAgoF
    : dayMinus2MeanF;

  const row = rowForSource({ context, region, month, hasMeasuredWaterTemp });
  if (!row || row.length < 5) return { temperature: null, diagnostics: null };
  const vc = Number(row[0]);
  const cool = Number(row[1]);
  const opt = Number(row[2]);
  const warm = Number(row[3]);
  const scores = row[4] as unknown as number[];
  if (!Array.isArray(scores) || scores.length < 5) {
    return { temperature: null, diagnostics: null };
  }

  const baselineBandScore = taperedBandScore(
    selectedTempF,
    vc,
    cool,
    opt,
    warm,
    scores,
  );
  const bandComponent = baselineBandScore * constants.bandWeight;
  const d1 = isFiniteTemp(priorSelectedF)
    ? selectedTempF - priorSelectedF
    : null;
  const d2 = isFiniteTemp(dayMinus2SelectedF)
    ? selectedTempF - dayMinus2SelectedF
    : null;

  let candidateTrendLabel: TrendLabel = "stable";
  if (d2 != null && Math.abs(d2) >= 5) {
    candidateTrendLabel = d2 > 0 ? "warming" : "cooling";
  }

  const hasCompleteHistory = isFiniteTemp(priorSelectedF) &&
    isFiniteTemp(dayMinus2SelectedF);
  const stabilityBasis = hasCompleteHistory
    ? "complete_history"
    : "partial_or_missing_history";
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
    ? constants.stableBonus
    : unstable
    ? UNSTABLE_STABILITY_ADJ
    : MOVING_STABILITY_ADJ;

  const sustained48hShock = d1 !== null &&
    d2 !== null &&
    Math.abs(d1) >= SHOCK_48H_LAST_LEG_MIN_F &&
    Math.abs(d2) >= SHOCK_48H_THRESHOLD_F &&
    Math.sign(d1) === Math.sign(d2);
  let shockLabel: TemperatureNormalized["shock_label"] = "none";
  let shockComponent = 0;
  if (d1 !== null && Math.abs(d1) >= SHOCK_24H_THRESHOLD_F) {
    shockLabel = d1 >= 0 ? "sharp_warmup" : "sharp_cooldown";
    shockComponent = SHARP_24H_SHOCK_COMPONENT;
  } else if (sustained48hShock) {
    shockLabel = d2! >= 0 ? "sharp_warmup" : "sharp_cooldown";
    shockComponent = SUSTAINED_48H_SHOCK_COMPONENT;
  }

  let favorabilityDelta72h: number | null = null;
  let trendComponent = 0;
  if (
    shockLabel === "none" && isFiniteTemp(dayMinus2SelectedF) && d2 !== null
  ) {
    const priorScore = taperedBandScore(
      dayMinus2SelectedF,
      vc,
      cool,
      opt,
      warm,
      scores,
    );
    favorabilityDelta72h = baselineBandScore - priorScore;
    if (Math.abs(d2) >= 5) {
      trendComponent = clampComponent(
        favorabilityDelta72h * TREND_WEIGHT,
        constants.maxTrendComponent,
      );
    }
  }
  const trendLabel: TrendLabel = shockLabel === "none"
    ? candidateTrendLabel
    : "stable";

  const finalScore = clampScore(
    bandComponent + stabilityComponent + trendComponent + shockComponent,
  );
  const measurementSource = hasMeasuredWaterTemp
    ? "coastal_water_temp"
    : "air_daily_mean";

  return {
    temperature: {
      context_group: coastalContext ? "coastal" : "freshwater",
      measurement_source: measurementSource,
      measurement_value_f: selectedTempF,
      band_label: bandLabel(
        selectedTempF,
        vc,
        cool,
        opt,
        warm,
        baselineBandScore,
      ),
      band_score: baselineBandScore,
      trend_label: trendLabel,
      trend_adjustment: trendComponent,
      shock_label: shockLabel,
      shock_adjustment: shockComponent < 0 ? -1 : 0,
      final_score: finalScore,
    },
    diagnostics: {
      selected_source: measurementSource,
      selected_temp_f: selectedTempF,
      prior_selected_temp_f: isFiniteTemp(priorSelectedF)
        ? priorSelectedF
        : null,
      day_minus_2_selected_temp_f: isFiniteTemp(dayMinus2SelectedF)
        ? dayMinus2SelectedF
        : null,
      baseline_band_score: baselineBandScore,
      band_component: bandComponent,
      stability_component: stabilityComponent,
      stability_basis: stabilityBasis,
      trend_component: trendComponent,
      shock_component: shockComponent,
      favorability_delta_72h: favorabilityDelta72h,
      delta_24h_f: d1,
      delta_72h_f: d2,
      formula:
        `final_score=clamp(band_score*${constants.bandWeight} + stability_component(complete_history only) + clamp(favorability_delta_72h*0.55,-${constants.maxTrendComponent},${constants.maxTrendComponent}) + shock_component,-2,2)`,
    },
  };
}
