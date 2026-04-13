import type { RecommenderV3ArchetypeId, TacticalLaneV3 } from "./contracts.ts";
import type { RecommenderV3ConditionFeatures } from "./buildConditionFeatures.ts";

const CONDITION_FIT_SCALE = 2.35;

/** Per tactical lane: dot(features, lane) = how well daily conditions match that lane. */
const LANE_WEIGHTS: Record<TacticalLaneV3, RecommenderV3ConditionFeatures> = {
  bottom_contact: {
    willingness: -0.44,
    wind_stress: 0.16,
    light_stress: 0.1,
    pressure_stress: 0.12,
    temp_stress: 0.4,
    hydro_stress: 0.24,
    clarity_visibility_push: -0.14,
    surface_window: -0.38,
  },
  finesse_subtle: {
    willingness: -0.38,
    wind_stress: 0.22,
    light_stress: 0.28,
    pressure_stress: 0.18,
    temp_stress: 0.34,
    hydro_stress: 0.18,
    clarity_visibility_push: -0.32,
    surface_window: -0.22,
  },
  horizontal_search: {
    willingness: 0.32,
    wind_stress: 0.08,
    light_stress: 0.06,
    pressure_stress: -0.08,
    temp_stress: -0.06,
    hydro_stress: 0.12,
    clarity_visibility_push: 0.18,
    surface_window: -0.12,
  },
  reaction_mid_column: {
    willingness: 0.36,
    wind_stress: 0.06,
    light_stress: 0.04,
    pressure_stress: -0.14,
    temp_stress: -0.12,
    hydro_stress: 0.1,
    clarity_visibility_push: 0.12,
    surface_window: -0.08,
  },
  surface: {
    willingness: 0.52,
    wind_stress: -0.58,
    light_stress: -0.48,
    pressure_stress: -0.12,
    temp_stress: -0.22,
    hydro_stress: -0.12,
    clarity_visibility_push: 0.22,
    surface_window: 0.88,
  },
  cover_weedless: {
    willingness: 0.18,
    wind_stress: 0.1,
    light_stress: 0.08,
    pressure_stress: 0.06,
    temp_stress: 0.08,
    hydro_stress: 0.2,
    clarity_visibility_push: 0.24,
    surface_window: 0.08,
  },
  pike_big_profile: {
    willingness: 0.28,
    wind_stress: 0.02,
    light_stress: -0.06,
    pressure_stress: -0.1,
    temp_stress: -0.08,
    hydro_stress: 0.08,
    clarity_visibility_push: 0.1,
    surface_window: -0.06,
  },
  fly_baitfish: {
    willingness: 0.26,
    wind_stress: 0.08,
    light_stress: 0.04,
    pressure_stress: -0.06,
    temp_stress: 0.06,
    hydro_stress: 0.22,
    clarity_visibility_push: 0.14,
    surface_window: -0.14,
  },
  fly_bottom: {
    willingness: -0.4,
    wind_stress: 0.14,
    light_stress: 0.12,
    pressure_stress: 0.14,
    temp_stress: 0.36,
    hydro_stress: 0.28,
    clarity_visibility_push: -0.18,
    surface_window: -0.32,
  },
  fly_surface: {
    willingness: 0.45,
    wind_stress: -0.52,
    light_stress: -0.42,
    pressure_stress: -0.1,
    temp_stress: -0.2,
    hydro_stress: -0.1,
    clarity_visibility_push: 0.18,
    surface_window: 0.82,
  },
};

/** Fine differentiation between similar surface / subsurface tools. */
const ID_DELTA: Partial<
  Record<RecommenderV3ArchetypeId, Partial<RecommenderV3ConditionFeatures>>
> = {
  hollow_body_frog: { surface_window: 0.1, wind_stress: -0.06, hydro_stress: 0.12 },
  frog_fly: { surface_window: 0.08, wind_stress: -0.05, hydro_stress: 0.1 },
  prop_bait: { light_stress: -0.22, surface_window: 0.05 },
  buzzbait: { wind_stress: 0.08, light_stress: -0.12 },
  walking_topwater: { light_stress: -0.18, wind_stress: -0.12 },
  popping_topwater: { light_stress: -0.15, clarity_visibility_push: 0.08 },
  popper_fly: { light_stress: -0.14, wind_stress: -0.1 },
  suspending_jerkbait: { temp_stress: 0.12, willingness: -0.08 },
  football_jig: { temp_stress: 0.1, willingness: -0.12 },
  drop_shot_worm: { willingness: -0.28, clarity_visibility_push: -0.2 },
  ned_rig: { willingness: -0.26, clarity_visibility_push: -0.22 },
};

const FEATURE_KEYS = [
  "willingness",
  "wind_stress",
  "light_stress",
  "pressure_stress",
  "temp_stress",
  "hydro_stress",
  "clarity_visibility_push",
  "surface_window",
] as const satisfies readonly (keyof RecommenderV3ConditionFeatures)[];

function dotFeatures(
  features: RecommenderV3ConditionFeatures,
  weights: RecommenderV3ConditionFeatures,
): number {
  let sum = 0;
  for (const k of FEATURE_KEYS) {
    sum += features[k] * weights[k];
  }
  return sum;
}

function mergeLaneAndDelta(
  lane: TacticalLaneV3,
  id: RecommenderV3ArchetypeId,
): RecommenderV3ConditionFeatures {
  const base = LANE_WEIGHTS[lane];
  const delta = ID_DELTA[id];
  if (!delta) return base;
  return {
    willingness: base.willingness + (delta.willingness ?? 0),
    wind_stress: base.wind_stress + (delta.wind_stress ?? 0),
    light_stress: base.light_stress + (delta.light_stress ?? 0),
    pressure_stress: base.pressure_stress + (delta.pressure_stress ?? 0),
    temp_stress: base.temp_stress + (delta.temp_stress ?? 0),
    hydro_stress: base.hydro_stress + (delta.hydro_stress ?? 0),
    clarity_visibility_push: base.clarity_visibility_push +
      (delta.clarity_visibility_push ?? 0),
    surface_window: base.surface_window + (delta.surface_window ?? 0),
  };
}

export function dailyConditionFitScore(
  features: RecommenderV3ConditionFeatures,
  lane: TacticalLaneV3,
  id: RecommenderV3ArchetypeId,
): number {
  const w = mergeLaneAndDelta(lane, id);
  const raw = dotFeatures(features, w);
  const capped = Math.max(-2.8, Math.min(2.8, raw));
  return Number((capped * CONDITION_FIT_SCALE).toFixed(2));
}

export function clarityProfileFit(
  clarity: "clear" | "stained" | "dirty",
  strengths: readonly ("clear" | "stained" | "dirty")[],
): number {
  if (strengths.includes(clarity)) return 0.55;
  if (clarity === "clear" && strengths.includes("stained")) return 0.12;
  if (clarity === "dirty" && strengths.includes("stained")) return 0.18;
  return -0.28;
}
