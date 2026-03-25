/**
 * How's Fishing report + edge bundle — HOWS_FISHING_REPORT_AND_NARRATION_SPEC
 */

import type { ActionableTipTag, DaypartNotePreset, TimingStrength } from "./tipsDaypart.ts";
import type { EngineContext } from "./context.ts";
import type {
  TemperatureBandLabel,
  TemperatureMetabolicContext,
  TrendLabel,
  ShockLabel,
  VariableScore,
  TemperatureNormalized,
} from "./variableState.ts";
import type { ScoredVariableKey } from "./variables.ts";

/** One scored variable’s deterministic normalizer output for LLM narration (no stochastic copy). */
export type LlmNormalizedVariableScore = {
  variable_key: ScoredVariableKey;
  engine_score: VariableScore;
  /** Normalizer bucket / regime id (machine-readable; paraphrase in user-facing text). */
  engine_label: string;
  engine_detail?: string | null;
  /** Present only for temperature — band vs trend vs shock vs final_score explicit. */
  temperature_breakdown?: TemperatureNormalized;
};

export type LlmCompositeContribution = {
  variable_key: ScoredVariableKey;
  normalized_score: VariableScore;
  /** Active weight in the composite (0–1), same as scoreDay weighting. */
  weight: number;
  weight_percent: number;
  weighted_contribution: number;
};

export type LlmPressureHistorySummary = {
  sample_count: number;
  first_mb: number | null;
  last_mb: number | null;
  min_mb: number | null;
  max_mb: number | null;
};

/** Scalar and summarized environment fields the engine actually consumed. */
export type LlmEnvironmentSnapshot = {
  current_air_temp_f: number | null;
  daily_mean_air_temp_f: number | null;
  prior_day_mean_air_temp_f: number | null;
  day_minus_2_mean_air_temp_f: number | null;
  pressure_mb: number | null;
  wind_speed_mph: number | null;
  cloud_cover_pct: number | null;
  precip_24h_in: number | null;
  precip_72h_in: number | null;
  precip_7d_in: number | null;
  active_precip_now: boolean | null;
  precip_rate_now_in_per_hr: number | null;
  tide_movement_state: string | null;
  tide_station_id: string | null;
  current_speed_knots_max: number | null;
  sunrise_local: string | null;
  sunset_local: string | null;
  solunar_peak_count: number | null;
  hourly_air_temp_sample_count: number | null;
  hourly_cloud_cover_sample_count: number | null;
  pressure_history_summary: LlmPressureHistorySummary | null;
  tide_high_low_event_count: number | null;
};

export type ScoreBand = "Poor" | "Fair" | "Good" | "Excellent";

export type ReportReliabilityTier = "high" | "medium" | "low";

export type DriverEntry = {
  variable: string;
  label: string;
  effect: "positive";
};

export type SuppressorEntry = {
  variable: string;
  label: string;
  effect: "negative";
};

export type HowsFishingReport = {
  context: EngineContext;
  display_context_label: "Freshwater Lake/Pond" | "Freshwater River" | "Coastal";
  location: {
    latitude: number;
    longitude: number;
    state_code: string | null;
    region_key: string;
    timezone: string;
    local_date: string;
    location_label?: string | null;
  };
  score: number;
  band: ScoreBand;
  summary_line: string;
  drivers: DriverEntry[];
  suppressors: SuppressorEntry[];
  actionable_tip: string;
  /** Engine-classified tip family (optional on wire for older clients) */
  actionable_tip_tag: ActionableTipTag;
  daypart_note?: string | null;
  daypart_preset: DaypartNotePreset | null;
  /** Timing recommendation confidence — independent of daily score band */
  timing_strength?: TimingStrength;
  /** Direct period highlighting [dawn, morning, afternoon, evening] */
  highlighted_periods?: [boolean, boolean, boolean, boolean];
  /** Timing engine decision trace for debugging */
  timing_debug?: {
    family_id: string;
    family_id_secondary?: string | null;
    month_blend_t?: number | null;
    anchor_driver: string;
    primary_driver: string;
    primary_qualified: boolean;
    secondary_driver: string;
    secondary_qualified: boolean;
    secondary_role: string;
    fallback_used: boolean;
    selection_reason: string;
  };
  reliability: ReportReliabilityTier;
  reliability_note?: string | null;
  /** Env adapter notes (e.g. sparse hourly, timezone mismatch) — for QA and scans */
  data_coverage_notes?: string[];
  normalized_debug?: {
    available_variables: string[];
    missing_variables: string[];
    data_gaps?: Array<{ variable_key: string; reason: string }>;
  };
  /**
   * Rich normalized context forwarded verbatim to the LLM narration layer.
   * Ensures the model has the engine's full verdict on every variable — not
   * just raw air temp + season — so it never has to guess fish behavior.
   */
  condition_context?: {
    temperature_band: TemperatureBandLabel;
    temperature_trend: TrendLabel;
    temperature_shock: ShockLabel;
    pressure_detail?: string | null;
    wind_detail?: string | null;
    tide_detail?: string | null;
    /** Light / cloud tier + numeric detail for narration (all contexts) */
    light_cloud_label?: string | null;
    light_cloud_detail?: string | null;
    /** Precip / clarity signal when scored (lake + coastal) */
    precipitation_disruption_label?: string | null;
    precipitation_disruption_detail?: string | null;
    /** River runoff tier when scored */
    runoff_flow_label?: string | null;
    runoff_flow_detail?: string | null;
    region_key: string;
    available_variables: string[];
    missing_variables: string[];
    temperature_metabolic_context: TemperatureMetabolicContext;
    /** When true, summary/timing language must not praise midday as the best window */
    avoid_midday_for_heat: boolean;
    /** e.g. ["dawn","evening"] — matches highlighted_periods on the report */
    highlighted_dayparts_for_narration: string[];
    /** Deterministic per-variable scores/labels from normalizers (parallel to available_variables). */
    normalized_variable_scores: LlmNormalizedVariableScore[];
    /** Same weighting math as the rounded 0–100 score (see scoreDay). */
    composite_contributions: LlmCompositeContribution[];
    /** Environment scalars + compact summaries of large arrays. */
    environment_snapshot: LlmEnvironmentSnapshot;
  };
};

export const HOWS_FISHING_FEATURE_KEY = "hows_fishing_rebuild_v1" as const;

export type HowFishingRebuildBundle = {
  feature: typeof HOWS_FISHING_FEATURE_KEY;
  generated_at: string;
  cache_expires_at: string;
  engine_context: EngineContext;
  report: HowsFishingReport;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    token_cost_usd: number;
  };
};
