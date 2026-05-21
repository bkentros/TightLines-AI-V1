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
import { buildConditionContextExtensions } from "./narration/buildConditionContextExtensions.ts";
import { buildThermalAirPlain } from "./narration/thermalAirPlain.ts";
import { resolveTimingResult } from "./timing/resolveTimingResult.ts";
import type { TimingStrength } from "./contracts/mod.ts";

export type SharedConditionAnalysis = {
  norm: SharedNormalizedOutput;
  scored: ReturnType<typeof scoreDay>;
  timing: ReturnType<typeof resolveTimingResult>;
  condition_context: NonNullable<HowsFishingReport["condition_context"]>;
};

export function analyzeSharedConditions(
  req: SharedEngineRequest,
  options: { scoreMode?: "production" | "legacy" } = {},
): SharedConditionAnalysis {
  const norm = buildSharedNormalizedOutput(req);
  const month = parseInt(req.local_date.slice(5, 7), 10) || 1;
  const timingEvalOpts = {
    local_date: req.local_date,
    tide_high_low: req.environment.tide_high_low,
    solunar_peak_local: req.environment.solunar_peak_local,
    sunrise_local: req.environment.sunrise_local,
    sunset_local: req.environment.sunset_local,
    cloud_cover_pct: req.environment.cloud_cover_pct,
    daily_mean_air_temp_f: req.environment.daily_mean_air_temp_f ??
      req.environment.current_air_temp_f,
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
  const scored = scoreDay(
    norm,
    scoreDayOptionsFromRequest(
      req,
      timing.timing_strength,
      options.scoreMode,
    ),
  );
  const scoringNorm = scored.normalized ?? norm;

  const condition_context: NonNullable<HowsFishingReport["condition_context"]> =
    {
      temperature_band: scoringNorm.normalized.temperature?.band_label ??
        "optimal",
      temperature_trend: scoringNorm.normalized.temperature?.trend_label ??
        "stable",
      temperature_shock: scoringNorm.normalized.temperature?.shock_label ??
        "none",
      pressure_detail: scoringNorm.normalized.pressure_regime?.detail ?? null,
      wind_detail: scoringNorm.normalized.wind_condition?.detail ?? null,
      tide_detail: scoringNorm.normalized.tide_current_movement?.detail ?? null,
      light_cloud_label: scoringNorm.normalized.light_cloud_condition?.label ??
        null,
      light_cloud_detail:
        scoringNorm.normalized.light_cloud_condition?.detail ?? null,
      precipitation_disruption_label:
        scoringNorm.normalized.precipitation_disruption?.label ?? null,
      precipitation_disruption_detail:
        scoringNorm.normalized.precipitation_disruption?.detail ?? null,
      runoff_flow_label: scoringNorm.normalized.runoff_flow_disruption?.label ??
        null,
      runoff_flow_detail:
        scoringNorm.normalized.runoff_flow_disruption?.detail ??
          null,
      region_key: scoringNorm.location.region_key,
      available_variables: scoringNorm.available_variables,
      missing_variables: scoringNorm.missing_variables,
      temperature_metabolic_context: deriveTemperatureMetabolicContext(
        scoringNorm.normalized.temperature,
      ),
      avoid_midday_for_heat: avoidHeatTimingApplies(
        scoringNorm,
        timingEvalOpts,
      ),
      highlighted_dayparts_for_narration: highlightedDaypartLabels(
        timing.highlighted_periods,
      ),
      thermal_air_narration_plain: scoringNorm.normalized.temperature
        ? buildThermalAirPlain(
          scoringNorm.normalized.temperature,
          req.environment.daily_mean_air_temp_f ??
            req.environment.current_air_temp_f ??
            null,
          req.environment.measured_water_temp_f ?? null,
        )
        : null,
      ...buildConditionContextExtensions(
        scoringNorm,
        scored.contributions,
        req.environment,
        req.context,
      ),
    };

  return {
    norm: scoringNorm,
    scored,
    timing,
    condition_context,
  };
}

export function scoreDayOptionsFromRequest(
  req: SharedEngineRequest,
  timingStrength: TimingStrength | null,
  mode: "production" | "legacy" = "production",
) {
  return {
    mode,
    timingStrength,
    currentSpeedKnotsMax: req.environment.current_speed_knots_max ?? null,
    activePrecipNow: req.environment.active_precip_now ?? null,
    precipRateNowInPerHr: req.environment.precip_rate_now_in_per_hr ?? null,
    precip72hIn: req.environment.precip_72h_in ?? null,
    precip7dIn: req.environment.precip_7d_in ?? null,
  };
}
