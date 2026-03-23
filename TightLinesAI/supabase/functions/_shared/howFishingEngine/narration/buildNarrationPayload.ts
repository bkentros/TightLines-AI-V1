import type { HowsFishingReport, NarrationPayload } from "../contracts/mod.ts";

export function buildNarrationPayloadFromReport(r: HowsFishingReport): NarrationPayload {
  const cc = r.condition_context;
  return {
    context: r.context,
    display_context_label: r.display_context_label,
    score: r.score,
    band: r.band,
    summary_line_seed: r.summary_line,
    drivers: r.drivers.map((d) => ({
      variable: d.variable,
      effect: d.effect,
      label: d.label,
    })),
    suppressors: r.suppressors.map((s) => ({
      variable: s.variable,
      effect: s.effect,
      label: s.label,
    })),
    actionable_tip_seed: r.actionable_tip,
    actionable_tip_tag: r.actionable_tip_tag,
    daypart_note_seed: r.daypart_note ?? null,
    daypart_preset: r.daypart_preset,
    timing_strength: r.timing_strength,
    reliability: r.reliability,
    reliability_note_seed: r.reliability_note ?? null,
    temperature_metabolic_context: cc?.temperature_metabolic_context ?? "neutral",
    avoid_midday_for_heat: cc?.avoid_midday_for_heat ?? false,
    highlighted_dayparts_for_narration: cc?.highlighted_dayparts_for_narration ?? [],
    timing_anchor_driver: r.timing_debug?.anchor_driver ?? null,
  };
}
