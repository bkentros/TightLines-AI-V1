/**
 * Tip tags & daypart presets — HOWS_FISHING_REPORT_AND_NARRATION_SPEC § Daypart / tip rules
 * Machine-readable tags accompany user-facing strings for LLM seeds and future analytics.
 */

/** Classifies the primary actionable-tip strategy */
export type ActionableTipTag =
  | "coastal_tide_positive"
  | "wind_shelter"
  | "runoff_clarity_flow"
  | "temperature_intraday_flex"
  | "lean_into_top_driver"
  | "general_flexibility";

/**
 * Broad daypart guidance presets (no exact windows).
 * Maps to allowed narration families in the report spec.
 */
export type DaypartNotePreset =
  | "moving_water_periods"
  | "early_late_low_light"
  | "warmest_part_may_help"
  | "cooler_low_light_better"
  | "no_timing_edge";
