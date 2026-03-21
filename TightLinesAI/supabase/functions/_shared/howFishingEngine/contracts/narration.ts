/**
 * LLM narration payload — HOWS_FISHING_REPORT_AND_NARRATION_SPEC § Narration payload contract
 */

import type { ActionableTipTag, DaypartNotePreset } from "./tipsDaypart.ts";
import type { EngineContext } from "./context.ts";
import type { ScoreBand, ReportReliabilityTier } from "./report.ts";

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
  reliability: ReportReliabilityTier;
  reliability_note_seed?: string | null;
};
