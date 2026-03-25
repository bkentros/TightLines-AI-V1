import type { HowsFishingReport } from "../contracts/report.ts";

/** Mutates `verdict` with fields mirrored from `condition_context` for the narration LLM. */
export function applyConditionContextToEngineVerdict(
  verdict: Record<string, unknown>,
  cc: NonNullable<HowsFishingReport["condition_context"]>,
): void {
  verdict.temperature_band = cc.temperature_band;
  verdict.temperature_metabolic_context = cc.temperature_metabolic_context;
  verdict.avoid_midday_for_heat = cc.avoid_midday_for_heat;
  verdict.recommended_fishing_dayparts = cc.highlighted_dayparts_for_narration;
  verdict.temperature_trend = cc.temperature_trend;
  if (cc.temperature_shock !== "none") {
    verdict.temperature_shock = cc.temperature_shock;
  }
  if (cc.pressure_detail) verdict.pressure_detail = cc.pressure_detail;
  if (cc.wind_detail) verdict.wind_detail = cc.wind_detail;
  if (cc.tide_detail) verdict.tide_detail = cc.tide_detail;
  verdict.region = cc.region_key;
  verdict.scored_variables_present = cc.available_variables;
  if (cc.missing_variables.length > 0) {
    verdict.data_gaps_variable_keys = cc.missing_variables;
  }
  verdict.normalized_variable_scores = cc.normalized_variable_scores;
  verdict.composite_contributions = cc.composite_contributions;
  verdict.environment_snapshot = cc.environment_snapshot;
}
