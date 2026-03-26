/**
 * Post-polish guardrails for short user-facing strings (summary_line, timing_insight).
 *
 * Secondary safety net when the LLM still owns these fields (`heat_limited` / `cold_limited`).
 * For `neutral` metabolic context, `how-fishing` uses engine-led copy instead — see
 * `polishSafeSurfaceCopy.ts` — so this is not the primary trust boundary there.
 *
 * **Applies everywhere:** logic keys only on `temperature_metabolic_context` from the engine
 * (already derived from region × month × band × score). No geographic branching.
 *
 * Removes LLM mis-attributions where copy blames **heat** or **cold** as the bite-window
 * limiter when the engine metabolic verdict says otherwise — trust-critical.
 */

export type TemperatureMetabolicContextLite = "neutral" | "heat_limited" | "cold_limited";

export type ReportThermalSlice = {
  condition_context?: {
    temperature_metabolic_context?: TemperatureMetabolicContextLite | string | null;
    temperature_band?: string | null;
  } | null;
};

/** Matches "narrow" / "narrows" / "trim" / "trims" / "trimming", etc. */
const HEAT_LIMIT_LEX = String.raw`\b(?:trimming|trims?|narrows?|limits?|short|suppress)\b`;
const heatLimitLexRe = new RegExp(HEAT_LIMIT_LEX, "i");

function heatMisattributesLimit(text: string, meta: string | null | undefined): boolean {
  if (meta === "heat_limited") return false;
  return (
    /\bheat\s+trims?\b/i.test(text) ||
    /\bheat\s+trimming\b/i.test(text) ||
    /\bheat\s+is\s+trimming\b/i.test(text) ||
    /\bheat\s+(is\s+)?narrows?\b/i.test(text) ||
    /\bheat\s+limits?\b/i.test(text) ||
    /\bheat\s+stress/i.test(text) ||
    /\bthermal\s+stress\b/i.test(text) ||
    (/\bthe\s+heat\b/i.test(text) && heatLimitLexRe.test(text)) ||
    (/\bhot\s+weather\b/i.test(text) && heatLimitLexRe.test(text)) ||
    (/\bscorching\b/i.test(text) && heatLimitLexRe.test(text))
  );
}

function coldMisattributesLimit(text: string, meta: string | null | undefined): boolean {
  if (meta === "cold_limited") return false;
  /* Narrow: bite-window blame, not "cold front" weather or generic "cold snap" in passing */
  const coldLimitLex =
    /\b(?:trims?|trimming|narrows?|shuts?|kills?|limits?|limited|short|suppress|slug|metabol)\b/i;
  return (
    /\bcold\s+trims?\b/i.test(text) ||
    /\bcold\s+trimming\b/i.test(text) ||
    /\bcold\s+(is\s+)?narrows?\b/i.test(text) ||
    /\bcold\s+limits?\b/i.test(text) ||
    /\bcold\s+shuts\b/i.test(text) ||
    /\bcold\s+kills\b/i.test(text) ||
    (/\bthe\s+cold\b/i.test(text) && coldLimitLex.test(text)) ||
    (/\bfrigid\b/i.test(text) && coldLimitLex.test(text)) ||
    (/\bbone[\s-]cold\b/i.test(text) && coldLimitLex.test(text))
  );
}

/** Sentence-level + trailing-clause strip for one thermal pole (heat OR cold). */
function stripThermalLimitPhrases(
  text: string,
  predicate: (t: string) => boolean,
  clausePattern: RegExp,
  emDashPattern: RegExp,
  isBadSentence: (p: string) => boolean,
  opts?: { inlineFrigidScrub?: boolean; inlineHeatScrub?: boolean },
): string {
  if (!text?.trim() || !predicate(text)) return text;

  let s = text;
  /* “heat trimming the bite” (gerund) often appears without “but …”; strip the whole bogus clause. */
  if (opts?.inlineHeatScrub) {
    s = s
      .replace(
        /\bheat\s+trimming\s+the\s+bite\b(?:\s+to\s+the\s+cooler\s+window)?/gi,
        "",
      )
      .replace(/\bheat\s+trims?\s+the\s+bite\b(?:\s+to\s+the\s+cooler\s+window)?/gi, "")
      .replace(/,\s*with\s+and\b/gi, ", and")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (!predicate(s)) {
      const t = s.replace(/,\s*([.!?]|$)/g, "$1").replace(/\s+/g, " ").trim();
      return t.length >= 8 ? t : text;
    }
  }
  /* Whole-line mistakes often omit “but …”; bridge phrase between frigid and narrows is common. */
  if (opts?.inlineFrigidScrub) {
    s = s
      .replace(/\bfrigid\b[\s\S]{0,220}?\bnarrows?\b/gi, " ")
      .replace(/\bbone[\s-]cold\b[\s\S]{0,220}?\bnarrows?\b/gi, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (!predicate(s)) {
      const t = s.replace(/,\s*([.!?]|$)/g, "$1").replace(/\s+/g, " ").trim();
      return t.length >= 8 ? t : text;
    }
  }
  s = s.replace(clausePattern, "");
  s = s.replace(emDashPattern, "");

  const parts = s.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean);
  const kept = parts.filter((p) => !isBadSentence(p));
  const out = (kept.length > 0 ? kept.join(" ") : s).replace(/\s{2,}/g, " ").trim();
  const tidied = out.replace(/,\s*([.!?]|$)/g, "$1").replace(/\s+/g, " ").trim();
  return tidied.length >= 8 ? tidied : text;
}

export function sanitizePolishedThermalCopy(text: string, report: ReportThermalSlice): string {
  if (!text?.trim()) return text;
  const meta = report.condition_context?.temperature_metabolic_context ?? null;

  const afterHeat = stripThermalLimitPhrases(
    text,
    (t) => heatMisattributesLimit(t, meta),
    /\s*,?\s*\b(but|though|while)\b[^.!?]*\b(heat\s+trims?|heat\s+trimming|heat\s+is\s+trimming|heat\s+narrows?|thermal\s+stress)\b[^.!?]*(?=\.|!|\?|$)/gi,
    /\s*—\s*[^.!?]*\bheat\s+trims?\b[^.!?]*(?=\.|!|\?|$)/gi,
    (p) =>
      /\bheat\s+trims?\b/i.test(p) ||
      /\bheat\s+trimming\b/i.test(p) ||
      /\bheat\s+is\s+trimming\b/i.test(p) ||
      /\bheat\s+(is\s+)?narrows?\b/i.test(p) ||
      /\bheat\s+limits?\b/i.test(p) ||
      /\bheat\s+stress/i.test(p) ||
      /\bthermal\s+stress\b/i.test(p) ||
      (/\bthe\s+heat\b/i.test(p) && heatLimitLexRe.test(p)) ||
      (/\bhot\s+weather\b/i.test(p) && heatLimitLexRe.test(p)) ||
      (/\bscorching\b/i.test(p) && heatLimitLexRe.test(p)),
    { inlineHeatScrub: true },
  );

  return stripThermalLimitPhrases(
    afterHeat,
    (t) => coldMisattributesLimit(t, meta),
    /\s*,?\s*\b(but|though|while)\b[^.!?]*\b(cold\s+trims?|cold\s+trimming|cold\s+is\s+trimming|cold\s+narrows?|cold\s+shuts\s+down|cold\s+kills)\b[^.!?]*(?=\.|!|\?|$)/gi,
    /\s*—\s*[^.!?]*\bcold\s+trims?\b[^.!?]*(?=\.|!|\?|$)/gi,
    (p) => {
      const coldLex =
        /\b(?:trims?|trimming|narrows?|shuts?|kills?|limits?|limited|short|suppress|slug|metabol)\b/i;
      return (
        /\bcold\s+trims?\b/i.test(p) ||
        /\bcold\s+trimming\b/i.test(p) ||
        /\bcold\s+(is\s+)?narrows?\b/i.test(p) ||
        /\bcold\s+limits?\b/i.test(p) ||
        /\bcold\s+shuts\b/i.test(p) ||
        /\bcold\s+kills\b/i.test(p) ||
        (/\bthe\s+cold\b/i.test(p) && coldLex.test(p)) ||
        (/\bfrigid\b/i.test(p) && coldLex.test(p)) ||
        (/\bbone[\s-]cold\b/i.test(p) && coldLex.test(p))
      );
    },
    { inlineFrigidScrub: true },
  );
}
