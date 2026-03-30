import type {
  HowsFishingReport,
  SharedEngineRequest,
  SharedNormalizedOutput,
} from "./contracts/mod.ts";
import { buildSharedNormalizedOutput } from "./normalize/buildNormalized.ts";
import { scoreDay } from "./score/scoreDay.ts";
import {
  avoidHeatTimingApplies,
  deriveTemperatureMetabolicContext,
  highlightedDaypartLabels,
} from "./narration/deriveNarrationHints.ts";
import { buildLlmConditionExtensions } from "./narration/buildLlmConditionExtensions.ts";
import { buildThermalAirPlain } from "./narration/thermalAirPlain.ts";
import { resolveTimingResult } from "./timing/resolveTimingResult.ts";

export type SharedConditionAnalysis = {
  norm: SharedNormalizedOutput;
  scored: ReturnType<typeof scoreDay>;
  timing: ReturnType<typeof resolveTimingResult>;
  condition_context: NonNullable<HowsFishingReport["condition_context"]>;
};

export function analyzeSharedConditions(
  req: SharedEngineRequest,
): SharedConditionAnalysis {
  const norm = buildSharedNormalizedOutput(req);
  const scored = scoreDay(norm);

  const month = parseInt(req.local_date.slice(5, 7), 10) || 1;
  const timingEvalOpts = {
    local_date: req.local_date,
    tide_high_low: req.environment.tide_high_low,
    solunar_peak_local: req.environment.solunar_peak_local,
    sunrise_local: req.environment.sunrise_local,
    sunset_local: req.environment.sunset_local,
    cloud_cover_pct: req.environment.cloud_cover_pct,
    daily_mean_air_temp_f:
      req.environment.daily_mean_air_temp_f ?? req.environment.current_air_temp_f,
    prior_day_mean_air_temp_f: req.environment.prior_day_mean_air_temp_f,
    hourly_air_temp_f: req.environment.hourly_air_temp_f,
    hourly_cloud_cover_pct: req.environment.hourly_cloud_cover_pct,
  };

  const timing = resolveTimingResult(
    req.context,
    req.region_key,
    month,
    norm,
    timingEvalOpts,
  );

  const condition_context: NonNullable<HowsFishingReport["condition_context"]> = {
    temperature_band: norm.normalized.temperature?.band_label ?? "optimal",
    temperature_trend: norm.normalized.temperature?.trend_label ?? "stable",
    temperature_shock: norm.normalized.temperature?.shock_label ?? "none",
    pressure_detail: norm.normalized.pressure_regime?.detail ?? null,
    wind_detail: norm.normalized.wind_condition?.detail ?? null,
    tide_detail: norm.normalized.tide_current_movement?.detail ?? null,
    light_cloud_label: norm.normalized.light_cloud_condition?.label ?? null,
    light_cloud_detail: norm.normalized.light_cloud_condition?.detail ?? null,
    precipitation_disruption_label:
      norm.normalized.precipitation_disruption?.label ?? null,
    precipitation_disruption_detail:
      norm.normalized.precipitation_disruption?.detail ?? null,
    runoff_flow_label: norm.normalized.runoff_flow_disruption?.label ?? null,
    runoff_flow_detail: norm.normalized.runoff_flow_disruption?.detail ?? null,
    region_key: norm.location.region_key,
    available_variables: norm.available_variables,
    missing_variables: norm.missing_variables,
    temperature_metabolic_context: deriveTemperatureMetabolicContext(
      norm.normalized.temperature,
    ),
    avoid_midday_for_heat: avoidHeatTimingApplies(norm, timingEvalOpts),
    highlighted_dayparts_for_narration: highlightedDaypartLabels(
      timing.highlighted_periods,
    ),
    thermal_air_narration_plain: norm.normalized.temperature
      ? buildThermalAirPlain(
        norm.normalized.temperature,
        req.environment.daily_mean_air_temp_f ??
          req.environment.current_air_temp_f ??
          null,
        req.environment.measured_water_temp_f ?? null,
      )
      : null,
    ...buildLlmConditionExtensions(
      norm,
      scored.contributions,
      req.environment,
      req.context,
    ),
  };

  return {
    norm,
    scored,
    timing,
    condition_context,
  };
}
