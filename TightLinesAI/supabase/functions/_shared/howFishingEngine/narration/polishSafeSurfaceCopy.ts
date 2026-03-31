/**
 * User-facing lines that must stay aligned with engine timing + metabolic truth.
 * When temperature_metabolic_context is neutral, LLM polish must NOT own these fields —
 * it will map “warmer afternoon” / diurnal swing to false heat-stress story beats.
 */

import type { HowsFishingReport } from "../contracts/report.ts";
import { pickDeterministic } from "../copy/deterministicPick.ts";

const DAYPART_NAMES = ["dawn", "morning", "afternoon", "evening"] as const;

function trimSurfaceLine(text: string, maxLen: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length > maxLen) {
    const punctuations = [".", "!", "?"];
    let bestCut = -1;
    for (const punctuation of punctuations) {
      const idx = clean.lastIndexOf(punctuation, maxLen - 1);
      if (idx > bestCut) bestCut = idx;
    }
    if (bestCut >= Math.floor(maxLen * 0.6)) {
      return clean.slice(0, bestCut + 1).trim();
    }
  }
  let output = clean;
  if (output.length > maxLen) {
    const sliced = output.slice(0, maxLen + 1);
    const cut = sliced.lastIndexOf(" ");
    output = (cut > 0 ? sliced.slice(0, cut) : output.slice(0, maxLen)).trim();
    output = output.replace(/[,:;\-]\s*$/g, "").trim();
  }
  return /[.!?]$/.test(output) ? output : `${output}.`;
}

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
      return trimSurfaceLine(
        note ?? "Fishable throughout the day. No strong timing edge stands out.",
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
      return trimSurfaceLine(base, 200);
    }
  }
  return trimSurfaceLine(note ?? "No strong timing edge stands out. Stay flexible.", 200);
}

const SOLUNAR_PRESENT = [
  "Solunar activity may add a small bonus window today, but it should stay secondary to the main timing call.",
  "There is some solunar support today, but the main timing recommendation still matters more.",
  "Solunar periods may help a little today, but they should be treated as a bonus, not the main plan.",
] as const;

const SOLUNAR_QUIET = [
  "Solunar activity looks quiet today, so lean on the main timing recommendation first.",
  "There is no standout solunar push today, so trust the main timing window first.",
] as const;

export function listSurfaceCopyForAudit(): string[] {
  return [...SOLUNAR_PRESENT, ...SOLUNAR_QUIET];
}

export function buildDeterministicSolunarNote(report: HowsFishingReport): string | null {
  const count = report.condition_context?.environment_snapshot.solunar_peak_count ?? null;
  const seed = [
    report.context,
    report.location.region_key,
    report.location.local_date,
    String(count ?? "none"),
  ].join("|");

  if (count == null) return null;
  if (count > 0) {
    return pickDeterministic(SOLUNAR_PRESENT, seed, "solunar:present");
  }
  return pickDeterministic(SOLUNAR_QUIET, seed, "solunar:quiet");
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
