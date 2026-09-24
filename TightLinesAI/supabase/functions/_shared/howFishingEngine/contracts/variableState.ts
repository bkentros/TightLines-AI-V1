/**
 * Normalized variable state — VARIABLE_THRESHOLDS_AND_SCORING_SPEC + master plan temperature block
 *
 * Scores are deterministic floats in [-2, 2] (quantized in normalizers) for tapered contributions.
 */

/** Clamped float in [-2, 2]; not limited to five integer steps. */
export type VariableScore = number;

export type VariableState = {
  label: string;
  score: VariableScore;
  detail?: string;
};

export type TemperatureBandLabel =
  | "very_cold"
  | "cool"
  | "near_optimal"
  | "optimal"
  | "warm"
  | "very_warm";

export type TemperatureContextGroup = "freshwater" | "coastal";
export type TemperatureMeasurementSource =
  | "air_daily_mean"
  | "coastal_water_temp";

export type TrendLabel = "warming" | "stable" | "cooling";

export type ShockLabel = "none" | "sharp_warmup" | "sharp_cooldown";

export type TemperatureNormalized = {
  context_group: TemperatureContextGroup;
  measurement_source: TemperatureMeasurementSource;
  measurement_value_f: number;
  /** Explicit source confidence; air is a proxy, not measured water. */
  source_quality?:
    | "measured_water"
    | "daily_air_proxy"
    | "current_air_fallback";
  history_span_hours?: 48 | 72;
  /** Continuous cold-season sunlight relief; independent of the categorical label. */
  cold_light_relief?: number;
  band_label: TemperatureBandLabel;
  /** Interpolated thermal score from season table before trend/shock (tapered). */
  band_score: VariableScore;
  trend_label: TrendLabel;
  trend_adjustment: VariableScore;
  shock_label: ShockLabel;
  shock_adjustment: -1 | 0;
  /** Explicit source-only regional calibration, before any composite weighting. */
  regional_calibration_adjustment?: number;
  final_score: VariableScore;
};

/** How air-temp scoring constrains deterministic thermal copy (orthogonal to band_label wording). */
export type TemperatureMetabolicContext =
  | "heat_limited"
  | "cold_limited"
  | "neutral";
