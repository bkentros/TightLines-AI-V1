import type {
  RecommenderV3DailyPayload,
  RecommenderV3ResolvedProfile,
  RecommenderV3SeasonalRow,
  ResolvedWaterColumnV3,
  SeasonalWaterColumnV3,
} from "./contracts.ts";

const SEASONAL_TO_HALF_STEP_INDEX: Record<SeasonalWaterColumnV3, number> = {
  top: 0,
  high: 2,
  mid: 4,
  mid_low: 5,
  low: 6,
};

const RESOLVED_BY_HALF_STEP_INDEX: Record<number, ResolvedWaterColumnV3> = {
  0: "top",
  1: "high_top",
  2: "high",
  3: "mid_high",
  4: "mid",
  5: "mid_low",
  6: "low",
};

function resolveAppliedHalfSteps(
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
): -2 | -1 | 0 | 1 | 2 {
  const desired = daily.column_shift_bias_half_steps;
  if (desired < 0) {
    const applied = Math.max(
      -daily.max_upward_column_shift_today,
      desired,
    );
    if (
      seasonal.typical_seasonal_water_column === "low" &&
      applied < -1
    ) {
      return -1;
    }
    if (
      seasonal.typical_seasonal_water_column === "mid_low" &&
      applied < -1
    ) {
      return -1;
    }
    return applied as -2 | -1 | 0 | 1 | 2;
  }

  if (desired > 0) {
    return Math.min(
      daily.max_downward_column_shift_today,
      desired,
    ) as -2 | -1 | 0 | 1 | 2;
  }

  return 0;
}

/**
 * Resolve the final fish-position profile from the seasonal anchor and today's
 * bounded daily adjustment.
 */
export function resolveFinalProfileV3(
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
): RecommenderV3ResolvedProfile {
  const baselineIndex =
    SEASONAL_TO_HALF_STEP_INDEX[seasonal.typical_seasonal_water_column];
  const appliedHalfSteps = resolveAppliedHalfSteps(seasonal, daily);
  const resolvedIndex = Math.max(
    0,
    Math.min(6, baselineIndex + appliedHalfSteps),
  );
  const likelyWaterColumnToday = RESOLVED_BY_HALF_STEP_INDEX[resolvedIndex]!;

  return {
    typical_seasonal_water_column: seasonal.typical_seasonal_water_column,
    likely_water_column_today: likelyWaterColumnToday,
    typical_seasonal_location: seasonal.typical_seasonal_location,
    daily_posture_band: daily.posture_band,
    presentation_presence_today: daily.presentation_presence_today,
    primary_forage: seasonal.primary_forage,
    secondary_forage: seasonal.secondary_forage,
  };
}
