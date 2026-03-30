/**
 * Tip tags & daypart presets — HOWS_FISHING_REPORT_AND_NARRATION_SPEC § Daypart / tip rules
 * Machine-readable tags accompany user-facing strings for LLM seeds and future analytics.
 */

/** Classifies the primary actionable-tip strategy */
export type ActionableTipTag =
  | "presentation_current_sweep"
  | "presentation_contact_control"
  | "presentation_visibility_profile"
  | "presentation_slow_subtle"
  | "presentation_active_cadence"
  | "presentation_general";

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

/**
 * Timing recommendation confidence — independent of daily score band.
 * A day can be Fair overall but have a Strong afternoon timing edge,
 * or Good overall but only fair_default timing guidance.
 */
export type TimingStrength =
  | "very_strong"   // #1 qualifies AND #2 confirms/supports meaningfully
  | "strong"        // #1 qualifies clearly on its own
  | "good"          // #1 failed but #2 qualifies; or #1 qualifies weakly
  | "fair_default"; // neither qualifies, combo fallback used
