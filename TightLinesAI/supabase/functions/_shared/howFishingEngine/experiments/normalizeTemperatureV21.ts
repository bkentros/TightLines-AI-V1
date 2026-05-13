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

export type TemperatureV21Constants = {
  bandWeight: number;
  stableFavorableBonus: number;
  stableBadComponent: number;
  improvedShockFloor: number;
  shockImprovementThreshold: number;
  maxTrendComponent: number;
  interpolationMode: "none" | "broad_month" | "boundary_only";
  edgeBlendDays: number;
  stabilityMode: "production" | "favorability_aware";
  shockMode: "production" | "direction_aware";
};

export type TemperatureV21Diagnostics = {
  selected_source: "air_daily_mean" | "coastal_water_temp";
  selected_temp_f: number;
  prior_selected_temp_f: number | null;
  day_minus_2_selected_temp_f: number | null;
  target_date: string | null;
  interpolation_fraction: number;
  row_basis:
    | "monthly"
    | "broad_month_interpolated"
    | "boundary_start_interpolated"
    | "boundary_end_interpolated";
  band_score: number;
  band_component: number;
  stability_basis: "complete_history" | "partial_or_missing_history";
  stability_class:
    | "favorable"
    | "neutral"
    | "bad"
    | "moving"
    | "unstable"
    | "missing";
  stability_component: number;
  favorability_delta_24h: number | null;
  favorability_delta_72h: number | null;
  trend_component: number;
  shock_component: number;
  shock_reduction_applied: boolean;
  delta_24h_f: number | null;
  delta_72h_f: number | null;
  formula: string;
};

export type TemperatureV21Result = {
  temperature: TemperatureNormalized | null;
  diagnostics: TemperatureV21Diagnostics | null;
};

export const DEFAULT_TEMPERATURE_V21_CONSTANTS: TemperatureV21Constants = {
  bandWeight: 0.90,
  stableFavorableBonus: 0.05,
  stableBadComponent: 0,
  improvedShockFloor: -0.90,
  shockImprovementThreshold: 1.50,
  maxTrendComponent: 0.70,
  interpolationMode: "none",
  edgeBlendDays: 0,
  stabilityMode: "favorability_aware",
  shockMode: "direction_aware",
};

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

type TempBandRow = [number, number, number, number, number[]];

function clampScore(n: number): number {
  return Math.max(-2, Math.min(2, n));
}

function clampComponent(n: number, maxAbs: number): number {
  return Math.max(-maxAbs, Math.min(maxAbs, n));
}

function isFiniteTemp(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value);
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function parseTargetDate(targetDate: string | null | undefined, month: number) {
  if (!targetDate) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(targetDate);
  if (!match) return null;
  const year = Number(match[1]);
  const parsedMonth = Number(match[2]);
  const day = Number(match[3]);
  if (
    !Number.isInteger(year) || !Number.isInteger(parsedMonth) ||
    !Number.isInteger(day) || parsedMonth !== month
  ) return null;
  const dim = daysInMonth(year, month);
  if (day < 1 || day > dim) return null;
  return { year, month, day, daysInMonth: dim };
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

function interpolateRows(
  current: number[],
  next: number[],
  fraction: number,
): TempBandRow | null {
  const scoresA = current[4] as unknown as number[];
  const scoresB = next[4] as unknown as number[];
  if (!Array.isArray(scoresA) || !Array.isArray(scoresB)) return null;
  if (scoresA.length < 5 || scoresB.length < 5) return null;
  return [
    pieceLinear(fraction, 0, 1, Number(current[0]), Number(next[0])),
    pieceLinear(fraction, 0, 1, Number(current[1]), Number(next[1])),
    pieceLinear(fraction, 0, 1, Number(current[2]), Number(next[2])),
    pieceLinear(fraction, 0, 1, Number(current[3]), Number(next[3])),
    scoresA.slice(0, 5).map((score, index) =>
      pieceLinear(fraction, 0, 1, Number(score), Number(scoresB[index]))
    ),
  ];
}

function rowForDate(args: {
  context: EngineContext;
  region: RegionKey;
  month: number;
  hasMeasuredWaterTemp: boolean;
  targetDate?: string | null;
  interpolationMode: TemperatureV21Constants["interpolationMode"];
  edgeBlendDays: number;
}): {
  row: TempBandRow | null;
  fraction: number;
  basis: TemperatureV21Diagnostics["row_basis"];
} {
  const current = rowForSource(args);
  if (!current || current.length < 5) {
    return { row: null, fraction: 0, basis: "monthly" };
  }
  if (args.interpolationMode === "none") {
    return { row: current as TempBandRow, fraction: 0, basis: "monthly" };
  }
  const parsed = parseTargetDate(args.targetDate, args.month);
  if (!parsed || parsed.daysInMonth <= 1) {
    return { row: current as TempBandRow, fraction: 0, basis: "monthly" };
  }
  const previousMonth = args.month === 1 ? 12 : args.month - 1;
  const nextMonth = args.month === 12 ? 1 : args.month + 1;
  if (args.interpolationMode === "boundary_only") {
    const edgeBlendDays = Math.max(0, Math.floor(args.edgeBlendDays));
    if (edgeBlendDays <= 0) {
      return { row: current as TempBandRow, fraction: 0, basis: "monthly" };
    }
    if (parsed.day <= edgeBlendDays) {
      const previous = rowForSource({ ...args, month: previousMonth });
      if (!previous || previous.length < 5) {
        return { row: current as TempBandRow, fraction: 0, basis: "monthly" };
      }
      const fraction = parsed.day / (edgeBlendDays + 1);
      return {
        row: interpolateRows(previous, current, fraction),
        fraction,
        basis: "boundary_start_interpolated",
      };
    }
    if (parsed.day > parsed.daysInMonth - edgeBlendDays) {
      const next = rowForSource({ ...args, month: nextMonth });
      if (!next || next.length < 5) {
        return { row: current as TempBandRow, fraction: 0, basis: "monthly" };
      }
      const daysFromEnd = parsed.daysInMonth - parsed.day + 1;
      const fraction = (edgeBlendDays - daysFromEnd + 1) / (edgeBlendDays + 1);
      return {
        row: interpolateRows(current, next, fraction),
        fraction,
        basis: "boundary_end_interpolated",
      };
    }
    return { row: current as TempBandRow, fraction: 0, basis: "monthly" };
  }
  const next = rowForSource({ ...args, month: nextMonth });
  if (!next || next.length < 5) {
    return { row: current as TempBandRow, fraction: 0, basis: "monthly" };
  }
  const fraction = (parsed.day - 1) / (parsed.daysInMonth - 1);
  return {
    row: interpolateRows(current, next, fraction),
    fraction,
    basis: "broad_month_interpolated",
  };
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

export function normalizeTemperatureV21(
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
    targetDate?: string | null;
    constants?: Partial<TemperatureV21Constants>;
  },
): TemperatureV21Result {
  const constants = {
    ...DEFAULT_TEMPERATURE_V21_CONSTANTS,
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
  const rowInfo = rowForDate({
    context,
    region,
    month,
    hasMeasuredWaterTemp,
    targetDate: opts?.targetDate,
    interpolationMode: constants.interpolationMode,
    edgeBlendDays: constants.edgeBlendDays,
  });
  const row = rowInfo.row;
  if (!row) return { temperature: null, diagnostics: null };
  const [vc, cool, opt, warm, scores] = row;

  const bandScore = taperedBandScore(
    selectedTempF,
    vc,
    cool,
    opt,
    warm,
    scores,
  );
  const bandComponent = bandScore * constants.bandWeight;
  const d1 = isFiniteTemp(priorSelectedF)
    ? selectedTempF - priorSelectedF
    : null;
  const d2 = isFiniteTemp(dayMinus2SelectedF)
    ? selectedTempF - dayMinus2SelectedF
    : null;
  const prior24Score = isFiniteTemp(priorSelectedF)
    ? taperedBandScore(priorSelectedF, vc, cool, opt, warm, scores)
    : null;
  const prior72Score = isFiniteTemp(dayMinus2SelectedF)
    ? taperedBandScore(dayMinus2SelectedF, vc, cool, opt, warm, scores)
    : null;
  const favorabilityDelta24h = prior24Score == null
    ? null
    : bandScore - prior24Score;
  const favorabilityDelta72h = prior72Score == null
    ? null
    : bandScore - prior72Score;

  let candidateTrendLabel: TrendLabel = "stable";
  if (d2 != null && Math.abs(d2) >= 5) {
    candidateTrendLabel = d2 > 0 ? "warming" : "cooling";
  }

  const hasCompleteHistory = isFiniteTemp(priorSelectedF) &&
    isFiniteTemp(dayMinus2SelectedF);
  const stable = hasCompleteHistory && d1 !== null && d2 !== null &&
    Math.abs(d1) < 3 && Math.abs(d2) < 5;
  const unstable = hasCompleteHistory && d1 !== null && d2 !== null &&
    (Math.abs(d1) >= 7 || Math.abs(d2) >= 12);
  let stabilityClass: TemperatureV21Diagnostics["stability_class"] = "missing";
  let stabilityComponent = 0;
  if (hasCompleteHistory) {
    if (stable) {
      if (constants.stabilityMode === "production") {
        stabilityClass = bandScore >= FAVORABLE_STABLE_MIN_SCORE
          ? "favorable"
          : bandScore <= BAD_STABLE_MAX_SCORE
          ? "bad"
          : "neutral";
        stabilityComponent = constants.stableFavorableBonus;
      } else if (bandScore >= FAVORABLE_STABLE_MIN_SCORE) {
        stabilityClass = "favorable";
        stabilityComponent = constants.stableFavorableBonus;
      } else if (bandScore <= BAD_STABLE_MAX_SCORE) {
        stabilityClass = "bad";
        stabilityComponent = constants.stableBadComponent;
      } else {
        stabilityClass = "neutral";
        stabilityComponent = 0;
      }
    } else if (unstable) {
      stabilityClass = "unstable";
      stabilityComponent = UNSTABLE_STABILITY_ADJ;
    } else {
      stabilityClass = "moving";
      stabilityComponent = MOVING_STABILITY_ADJ;
    }
  }

  const sustained48hShock = d1 !== null &&
    d2 !== null &&
    Math.abs(d1) >= SHOCK_48H_LAST_LEG_MIN_F &&
    Math.abs(d2) >= SHOCK_48H_THRESHOLD_F &&
    Math.sign(d1) === Math.sign(d2);
  let shockLabel: TemperatureNormalized["shock_label"] = "none";
  let fullShockComponent = 0;
  if (d1 !== null && Math.abs(d1) >= SHOCK_24H_THRESHOLD_F) {
    shockLabel = d1 >= 0 ? "sharp_warmup" : "sharp_cooldown";
    fullShockComponent = SHARP_24H_SHOCK_COMPONENT;
  } else if (sustained48hShock) {
    shockLabel = d2! >= 0 ? "sharp_warmup" : "sharp_cooldown";
    fullShockComponent = SUSTAINED_48H_SHOCK_COMPONENT;
  }
  const shockImprovedFavorability = shockLabel !== "none" &&
    constants.shockMode === "direction_aware" &&
    ((favorabilityDelta24h ?? -Infinity) >=
        constants.shockImprovementThreshold ||
      (favorabilityDelta72h ?? -Infinity) >=
        constants.shockImprovementThreshold);
  const shockComponent = shockImprovedFavorability
    ? Math.max(fullShockComponent, constants.improvedShockFloor)
    : fullShockComponent;

  let trendComponent = 0;
  if (
    shockLabel === "none" && favorabilityDelta72h != null && d2 != null &&
    Math.abs(d2) >= 5
  ) {
    trendComponent = clampComponent(
      favorabilityDelta72h * TREND_WEIGHT,
      constants.maxTrendComponent,
    );
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
      band_label: bandLabel(selectedTempF, vc, cool, opt, warm, bandScore),
      band_score: bandScore,
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
      target_date: opts?.targetDate ?? null,
      interpolation_fraction: rowInfo.fraction,
      row_basis: rowInfo.basis,
      band_score: bandScore,
      band_component: bandComponent,
      stability_basis: hasCompleteHistory
        ? "complete_history"
        : "partial_or_missing_history",
      stability_class: stabilityClass,
      stability_component: stabilityComponent,
      favorability_delta_24h: favorabilityDelta24h,
      favorability_delta_72h: favorabilityDelta72h,
      trend_component: trendComponent,
      shock_component: shockComponent,
      shock_reduction_applied: shockImprovedFavorability,
      delta_24h_f: d1,
      delta_72h_f: d2,
      formula:
        `final=clamp(band_score*${constants.bandWeight}+favorability_aware_stability+trend_without_shock+directional_shock,-2,2)`,
    },
  };
}
