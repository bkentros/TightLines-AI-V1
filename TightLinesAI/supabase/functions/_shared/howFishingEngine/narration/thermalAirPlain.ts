import type { TemperatureNormalized } from "../contracts/mod.ts";
import { ENGINE_SCORE_EPSILON } from "../score/engineScoreMath.ts";

/** Deterministic thermal line for LLM — same semantics as narration brief temperature branch. */
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
      ? `${Math.round(measuredWaterTempF)}°F water — `
      : "Measured coastal water temp — "
    : tempF != null
      ? `${Math.round(tempF)}°F air — `
      : "";

  if (label === "optimal") return `${prefix}right in the seasonal range`;
  if (label === "warm") {
    if (score >= 1) return `${prefix}running warm, metabolism is up`;
    if (score >= ENGINE_SCORE_EPSILON) {
      return `${prefix}warming side of normal — still a fishable thermal band`;
    }
    return `${prefix}warm for the calendar but thermally tempered — not a big heat penalty`;
  }
  if (label === "cool") return `${prefix}a bit below average, slightly slower bite`;
  if (label === "very_warm") {
    if (score <= -ENGINE_SCORE_EPSILON) {
      return `${prefix}quite hot — activity windows are narrow`;
    }
    if (score <= ENGINE_SCORE_EPSILON) {
      return `${prefix}hot for the date — warmth is a headwind but not extreme on the model`;
    }
    return `${prefix}upper warm range — monitor low-light and comfort water`;
  }
  return `${prefix}well below seasonal range — fish are sluggish`;
}
