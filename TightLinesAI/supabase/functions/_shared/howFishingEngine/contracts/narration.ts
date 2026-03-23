/**
 * LLM narration payload — HOWS_FISHING_REPORT_AND_NARRATION_SPEC § Narration payload contract
 */

import type { ActionableTipTag, DaypartNotePreset, TimingStrength } from "./tipsDaypart.ts";
import type { EngineContext } from "./context.ts";
import type { ScoreBand, ReportReliabilityTier } from "./report.ts";
import type { TemperatureMetabolicContext } from "./variableState.ts";

export type NarrationDriverEntry = {
  variable: string;
  effect: string;
  label: string;
};

export type NarrationPayload = {
  context: EngineContext;
  display_context_label: string;
  score: number;
  band: ScoreBand;
  summary_line_seed: string;
  drivers: NarrationDriverEntry[];
  suppressors: NarrationDriverEntry[];
  actionable_tip_seed: string;
  actionable_tip_tag: ActionableTipTag;
  daypart_note_seed?: string | null;
  daypart_preset: DaypartNotePreset | null;
  /** Timing recommendation confidence — helps LLM calibrate language */
  timing_strength?: TimingStrength;
  reliability: ReportReliabilityTier;
  reliability_note_seed?: string | null;
  /** Explicit metabolic story for the LLM (never invert vs temperature_band) */
  temperature_metabolic_context: TemperatureMetabolicContext;
  /** True when timing model says midday sun/heat is the wrong sell */
  avoid_midday_for_heat: boolean;
  /** Human labels aligned with highlighted_periods */
  highlighted_dayparts_for_narration: string[];
  /** Timing lane anchor after heat reconcile (for LLM audit) */
  timing_anchor_driver: string | null;
};
