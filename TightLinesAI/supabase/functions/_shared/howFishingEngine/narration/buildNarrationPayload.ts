import type { HowsFishingReport, NarrationPayload } from "../contracts/mod.ts";

export function buildNarrationPayloadFromReport(r: HowsFishingReport): NarrationPayload {
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
    reliability: r.reliability,
    reliability_note_seed: r.reliability_note ?? null,
  };
}
