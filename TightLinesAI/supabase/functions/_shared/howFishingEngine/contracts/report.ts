/**
 * How's Fishing report + edge bundle — HOWS_FISHING_REPORT_AND_NARRATION_SPEC
 */

import type { ActionableTipTag, DaypartNotePreset } from "./tipsDaypart.ts";
import type { EngineContext } from "./context.ts";
import type { TemperatureBandLabel, TrendLabel, ShockLabel } from "./variableState.ts";

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
  reliability: ReportReliabilityTier;
  reliability_note?: string | null;
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
    region_key: string;
    available_variables: string[];
    missing_variables: string[];
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
