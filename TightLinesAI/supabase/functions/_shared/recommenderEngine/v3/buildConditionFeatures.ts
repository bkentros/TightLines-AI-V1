import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { WaterClarity } from "../contracts/input.ts";
import type { RecommenderV3Context, RecommenderV3DailyPayload } from "./contracts.ts";

/**
 * Normalized daily features in ~[-1, 1] / [0, 1] for archetype dot-product scoring.
 * Higher "stress" / adversity values generally favor slower, deeper, higher-presence tools.
 */
export type RecommenderV3ConditionFeatures = {
  /** From posture_score_10: fish willingness (-1 tight … +1 open). */
  willingness: number;
  /** 0 calm … 1 extreme wind (execution stress). */
  wind_stress: number;
  /** 0 soft light … 1 harsh bright/glare for surface/finesse. */
  light_stress: number;
  /** 0 favorable feeding pressure … 1 post-front / volatile stress. */
  pressure_stress: number;
  /** 0 comfortable thermal band … 1 cold/heat/shock stress. */
  temp_stress: number;
  /** Lake: precip disruption; river: runoff (0 stable … 1 blown out). */
  hydro_stress: number;
  /** -1 clear/finesse bias … +1 need visibility (dirty water push). */
  clarity_visibility_push: number;
  /** -1 surface closed … +1 clean surface window. */
  surface_window: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function windStress(label: string | null): number {
  switch (label) {
    case "calm":
      return 0;
    case "light":
      return 0.12;
    case "moderate":
      return 0.38;
    case "strong":
      return 0.68;
    case "extreme":
      return 1;
    default:
      return 0.2;
  }
}

function lightStress(label: string | null): number {
  switch (label) {
    case "glare":
      return 0.75;
    case "bright":
      return 0.5;
    case "mixed":
      return 0.22;
    case "low_light":
      return 0.05;
    case "heavy_overcast":
      return 0.08;
    default:
      return 0.2;
  }
}

function pressureStress(label: string | null): number {
  switch (label) {
    case "falling_slow":
    case "falling_moderate":
      return 0.05;
    case "falling_hard":
      return 0.35;
    case "rising_slow":
      return 0.28;
    case "rising_fast":
      return 0.62;
    case "volatile":
      return 0.88;
    case "recently_stabilizing":
      return 0.18;
    case "stable_neutral":
    default:
      return 0.12;
  }
}

function tempStress(analysis: SharedConditionAnalysis): number {
  let s = 0;
  const m = analysis.condition_context.temperature_metabolic_context;
  if (m === "cold_limited") s += 0.45;
  else if (m === "heat_limited") s += 0.42;
  else s += 0.08;

  const t = analysis.condition_context.temperature_trend;
  if (t === "cooling") s += 0.28;
  else if (t === "warming") s += 0.05;
  else s += 0.05;

  const sh = analysis.condition_context.temperature_shock;
  if (sh === "sharp_cooldown") s += 0.45;
  else if (sh === "sharp_warmup") s += 0.12;
  else s += 0;

  return clamp(s, 0, 1);
}

function precipStress(label: string | null): number {
  switch (label) {
    case "active_disruption":
      return 0.95;
    case "recent_rain":
      return 0.42;
    case "light_mist":
      return 0.15;
    case "extended_dry":
    case "dry_stable":
    default:
      return 0.08;
  }
}

function runoffStress(label: string | null): number {
  switch (label) {
    case "blown_out":
      return 1;
    case "elevated":
      return 0.55;
    case "slightly_elevated":
      return 0.22;
    case "stable":
    case "perfect_clear":
    default:
      return 0.1;
  }
}

function clarityPush(clarity: WaterClarity): number {
  switch (clarity) {
    case "clear":
      return -0.35;
    case "stained":
      return 0.15;
    case "dirty":
      return 0.55;
    default:
      return 0;
  }
}

function surfaceWindowFeature(daily: RecommenderV3DailyPayload): number {
  if (daily.suppress_true_topwater || !daily.surface_allowed_today) return -1;
  if (daily.surface_window_today === "closed") return -1;
  if (daily.surface_window_today === "rippled") return 0.35;
  return 0.95;
}

/**
 * Single source for daily condition features used in lure/fly ranking.
 */
export function buildConditionFeaturesFromAnalysis(
  analysis: SharedConditionAnalysis,
  daily: RecommenderV3DailyPayload,
  clarity: WaterClarity,
  context: RecommenderV3Context,
): RecommenderV3ConditionFeatures {
  const windLabel = analysis.norm.normalized.wind_condition?.label ?? null;
  const lightLabel = analysis.norm.normalized.light_cloud_condition?.label ?? null;
  const pressureLabel = analysis.norm.normalized.pressure_regime?.label ?? null;
  const precipLabel =
    analysis.norm.normalized.precipitation_disruption?.label ?? null;
  const runoffLabel =
    analysis.norm.normalized.runoff_flow_disruption?.label ?? null;

  const willingness = clamp((daily.posture_score_10 - 5) / 5, -1, 1);

  const hydro = context === "freshwater_lake_pond"
    ? precipStress(precipLabel)
    : runoffStress(runoffLabel);

  return {
    willingness,
    wind_stress: windStress(windLabel),
    light_stress: lightStress(lightLabel),
    pressure_stress: pressureStress(pressureLabel),
    temp_stress: tempStress(analysis),
    hydro_stress: hydro,
    clarity_visibility_push: clarityPush(clarity),
    surface_window: surfaceWindowFeature(daily),
  };
}
