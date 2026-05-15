import type { TemperatureNormalized } from "../contracts/mod.ts";
import { ENGINE_SCORE_EPSILON } from "../score/engineScoreMath.ts";

/** Deterministic thermal line for report context and QA. */
export function buildThermalAirPlain(
  t: TemperatureNormalized,
  tempF: number | null,
  measuredWaterTempF: number | null,
): string {
  const label = t.band_label;
  const score = t.final_score;
  const usingWater = t.measurement_source === "coastal_water_temp";
  const prefix = usingWater
    ? measuredWaterTempF != null
      ? `${Math.round(measuredWaterTempF)}°F measured coastal temp — `
      : "Measured coastal temp — "
    : tempF != null
    ? `${Math.round(tempF)}°F air — `
    : "";

  if (label === "optimal") {
    if (score >= 1) return `${prefix}well aligned for this time of year`;
    if (score >= ENGINE_SCORE_EPSILON) {
      return `${prefix}within the seasonal range and modestly supportive`;
    }
    if (score <= -ENGINE_SCORE_EPSILON) {
      return `${prefix}within the seasonal range, but near the edge of the better window`;
    }
    return `${prefix}within the seasonal range without a strong temperature signal`;
  }
  if (label === "near_optimal") {
    if (score >= 1) {
      return `${prefix}close to the better seasonal range`;
    }
    if (score >= ENGINE_SCORE_EPSILON) {
      return `${prefix}close to the seasonal range and modestly supportive`;
    }
    if (score <= -ENGINE_SCORE_EPSILON) {
      return `${prefix}close to the seasonal range, but still on the edge of the better window`;
    }
    return `${prefix}close to the seasonal range without a strong temperature signal`;
  }
  if (label === "warm") {
    if (score >= 1) return `${prefix}above the seasonal midpoint and still favorable`;
    if (score >= ENGINE_SCORE_EPSILON) {
      return `${prefix}above the seasonal midpoint, but still in a usable range`;
    }
    return `${prefix}above the seasonal midpoint without a major penalty`;
  }
  if (label === "cool") {
    return `${prefix}below the seasonal midpoint, so the read is a little less favorable`;
  }
  if (label === "very_warm") {
    if (score <= -ENGINE_SCORE_EPSILON) {
      return `${prefix}well above the seasonal range, so the best window is narrower`;
    }
    if (score <= ENGINE_SCORE_EPSILON) {
      return `${prefix}above the seasonal range, but not an extreme penalty in this read`;
    }
    return `${prefix}upper end of the seasonal range; low-light windows matter more`;
  }
  return `${prefix}well below the seasonal range, so the read is less favorable`;
}
