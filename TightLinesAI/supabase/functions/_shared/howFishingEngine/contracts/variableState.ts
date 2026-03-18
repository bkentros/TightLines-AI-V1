/**
 * Normalized variable state — VARIABLE_THRESHOLDS_AND_SCORING_SPEC + master plan temperature block
 */

export type VariableScore = -2 | -1 | 0 | 1 | 2;

export type VariableState = {
  label: string;
  score: VariableScore;
  detail?: string;
};

export type TemperatureBandLabel =
  | "very_cold"
  | "cool"
  | "optimal"
  | "warm"
  | "very_warm";

export type TemperatureContextGroup = "freshwater" | "coastal";

export type TrendLabel = "warming" | "stable" | "cooling";

export type ShockLabel = "none" | "sharp_warmup" | "sharp_cooldown";

export type TemperatureNormalized = {
  context_group: TemperatureContextGroup;
  band_label: TemperatureBandLabel;
  band_score: VariableScore;
  trend_label: TrendLabel;
  trend_adjustment: -1 | 0 | 1;
  shock_label: ShockLabel;
  shock_adjustment: -1 | 0;
  final_score: VariableScore;
};
