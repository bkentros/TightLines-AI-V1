/**
 * User-facing lines that must stay aligned with engine timing + metabolic truth.
 * When temperature_metabolic_context is neutral, LLM polish must NOT own these fields —
 * it will map “warmer afternoon” / diurnal swing to false heat-stress story beats.
 */

import type { HowsFishingReport } from "../contracts/report.ts";

const DAYPART_NAMES = ["dawn", "morning", "afternoon", "evening"] as const;

/**
 * Same logic as buildNarrationBrief `formatTimingSection`, condensed for UI (single line).
 */
export function buildDeterministicTimingInsight(report: HowsFishingReport): string {
  const periods = report.highlighted_periods;
  const note = report.daypart_note;

  if (periods) {
    const best = DAYPART_NAMES.filter((_, i) => periods[i]);
    const avoided = DAYPART_NAMES.filter((_, i) => !periods[i]);
    if (best.length === 4) {
      return (note ?? "Fishable throughout the day — no strong clock bias.").replace(/\s+/g, " ").trim().slice(
        0,
        200,
      );
    }
    if (best.length > 0) {
      const bestStr = best.join(" and ");
      const avoidStr =
        avoided.length > 0 && avoided.length <= 2
          ? ` Weaker: ${avoided.join(" and ")}.`
          : "";
      const base = `Best windows: ${bestStr}.${avoidStr}${note ? ` ${note}` : ""}`;
      return base.replace(/\s+/g, " ").trim().slice(0, 200);
    }
  }
  return (note ?? "No strong timing signal — stay flexible.").replace(/\s+/g, " ").trim().slice(0, 200);
}

/**
 * Band-only engine summary optionally prefixed with reverse-geocode label — no thermal causal prose.
 */
export function buildEngineLedSummaryLine(
  report: HowsFishingReport,
  locationName: string | null,
): string {
  const core = report.summary_line.replace(/\s+/g, " ").trim();
  const loc = (locationName ?? "").trim();
  if (!loc || core.toLowerCase().includes(loc.toLowerCase())) {
    return core.slice(0, 280);
  }
  return `${loc} — ${core}`.replace(/\s+/g, " ").trim().slice(0, 280);
}
