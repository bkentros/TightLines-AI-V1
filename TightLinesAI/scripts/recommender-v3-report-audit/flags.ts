/**
 * Automated pre-flag rules for the Recommender V3 report audit.
 *
 * These flags are *mechanical* checks that catch structural/invariant
 * issues before the auditing agent performs semantic review. The goal is
 * to focus human attention on judgment calls (is this pick biologically
 * sensible? does the copy match the technique?) — not on mechanical
 * consistency, which the machine can verify deterministically.
 *
 * Severity tags match the auditor rubric:
 *   - [BLOCKER] invariant violation / report is misleading
 *   - [BUG]     wrong but report still usable
 *   - [POLISH]  accurate but could be improved
 *   - [FYI]     observation worth noting
 */

import type {
  RecommenderV3RankedArchetype,
  RecommenderV3Response,
} from "../../supabase/functions/_shared/recommenderEngine/index.ts";

export type FlagSeverity = "BLOCKER" | "BUG" | "POLISH" | "FYI";

export type AutoFlag = {
  severity: FlagSeverity;
  scope: "scenario" | "trio" | "rec";
  subject?: string;
  message: string;
};

const SURFACE_COPY_TOKENS = [
  /\bwalk[-\s]?the[-\s]?dog\b/i,
  /\btopwater\b/i,
  /\bpopping\b/i,
  /\bsurface\b/i,
  /\bblowup\b/i,
  /\bon top\b/i,
];

// Tightened from a bare `/\bbottom\b/` match to drag/crawl/slow-roll verbs only.
// The prior regex fired on any mention of the word "bottom" (e.g. "just off the
// bottom", "near bottom") which is not actually a bottom-dragging technique and
// produced false positives on mid-column archetypes whose copy referenced bottom
// as a spatial reference rather than a retrieve. See
// `docs/audits/recommender-v3/_cross_species_findings.md` §1 table and §1.4
// follow-up ("Auto-flag / auditor harness" row) for the decision to restrict
// this rule to drag/crawl/slow-roll verbs.
const BOTTOM_COPY_TOKENS = [
  /\bdrag(?:ging)?\s+(?:it\s+)?(?:along|across|through|on|near)\s+(?:the\s+)?bottom\b/i,
  /\bcrawl(?:ing)?\s+(?:it\s+)?(?:along|across|through|on|near)\s+(?:the\s+)?bottom\b/i,
  /\bslow[-\s]?roll(?:ing)?\s+(?:it\s+)?(?:along|across|through|on|near)\s+(?:the\s+)?bottom\b/i,
  /\btick(?:ing)?\s+(?:it\s+)?(?:along|across)\s+(?:the\s+)?bottom\b/i,
  /\bbounce\s+(?:off|on)\s+(?:the\s+)?bottom\b/i,
  /\bhop(?:ping)?\s+(?:it\s+)?(?:along|across|near|on)\s+(?:the\s+)?bottom\b/i,
  /\bscratch(?:ing)?\s+(?:the\s+)?substrate\b/i,
];

function checkCopyLength(rec: RecommenderV3RankedArchetype, label: string): AutoFlag[] {
  const flags: AutoFlag[] = [];
  if ((rec.why_chosen?.length ?? 0) < 40) {
    flags.push({
      severity: "POLISH",
      scope: "rec",
      subject: rec.id,
      message: `${label}: why_chosen is unusually short (<40 chars). May indicate a truncated template fallback.`,
    });
  }
  if ((rec.how_to_fish?.length ?? 0) < 40) {
    flags.push({
      severity: "POLISH",
      scope: "rec",
      subject: rec.id,
      message: `${label}: how_to_fish is unusually short (<40 chars). May indicate a truncated template fallback.`,
    });
  }
  return flags;
}

function checkCopySurfaceLanguage(rec: RecommenderV3RankedArchetype, label: string): AutoFlag[] {
  const flags: AutoFlag[] = [];
  const hay = `${rec.why_chosen ?? ""}\n${rec.how_to_fish ?? ""}`;
  const surfaceHit = SURFACE_COPY_TOKENS.some((re) => re.test(hay));
  if (surfaceHit && !rec.is_surface) {
    flags.push({
      severity: "BUG",
      scope: "rec",
      subject: rec.id,
      message:
        `${label}: copy contains surface-presentation language but archetype is_surface=false. ` +
        `Likely a copy-template misuse of tactical_lane as a proxy.`,
    });
  }
  if (!surfaceHit && rec.is_surface) {
    flags.push({
      severity: "POLISH",
      scope: "rec",
      subject: rec.id,
      message:
        `${label}: archetype is_surface=true but copy does not reference a surface technique. ` +
        `May read generically.`,
    });
  }
  return flags;
}

function checkCopyBottomVsColumn(rec: RecommenderV3RankedArchetype, label: string): AutoFlag[] {
  const flags: AutoFlag[] = [];
  const hay = `${rec.why_chosen ?? ""}\n${rec.how_to_fish ?? ""}`;
  const bottomHit = BOTTOM_COPY_TOKENS.some((re) => re.test(hay));
  if (bottomHit && rec.primary_column !== "bottom") {
    flags.push({
      severity: "BUG",
      scope: "rec",
      subject: rec.id,
      message:
        `${label}: copy describes bottom-dragging/crawling technique but archetype primary_column=${rec.primary_column}.`,
    });
  }
  return flags;
}

function checkPaceSuppression(
  rec: RecommenderV3RankedArchetype,
  response: RecommenderV3Response,
  label: string,
): AutoFlag[] {
  const flags: AutoFlag[] = [];
  if (rec.pace === "fast" && response.daily_payload.suppress_fast_presentations) {
    flags.push({
      severity: "BUG",
      scope: "rec",
      subject: rec.id,
      message:
        `${label}: archetype pace=fast but daily suppress_fast_presentations=true. ` +
        `Engine selected a fast presentation under suppression; expected it to be blocked or demoted.`,
    });
  }
  return flags;
}

function checkSurfaceWindow(
  rec: RecommenderV3RankedArchetype,
  response: RecommenderV3Response,
  label: string,
): AutoFlag[] {
  const flags: AutoFlag[] = [];
  // Fire when the engine placed a genuinely surface-oriented archetype on a day
  // whose surface window is closed. "Genuine" = `is_surface=true` OR the
  // authored `primary_column=surface`. The prior check keyed solely on
  // `is_surface`; archetypes that lead on the surface column but are flagged
  // only via `primary_column` now also trip this guard.
  const isSurfaceArchetype = rec.is_surface || rec.primary_column === "surface";
  if (isSurfaceArchetype && response.daily_payload.surface_window === "closed") {
    flags.push({
      severity: "BLOCKER",
      scope: "rec",
      subject: rec.id,
      message:
        `${label}: rec is_surface=${rec.is_surface}/primary_column=${rec.primary_column} but daily surface_window=closed. ` +
        `Engine should not have selected a surface tool today.`,
    });
  }
  return flags;
}

function checkRankOrder(recs: RecommenderV3RankedArchetype[], label: string): AutoFlag[] {
  const flags: AutoFlag[] = [];
  if (recs.length < 3) {
    flags.push({
      severity: "BLOCKER",
      scope: "scenario",
      message: `${label}: fewer than 3 recommendations returned (got ${recs.length}).`,
    });
  }
  return flags;
}

function checkTrioCoherence(
  recs: RecommenderV3RankedArchetype[],
  response: RecommenderV3Response,
  label: string,
): AutoFlag[] {
  const flags: AutoFlag[] = [];
  const top3 = recs.slice(0, 3);
  const hasSurface = top3.some((r) => r.is_surface);
  const hasBottom = top3.some((r) => r.primary_column === "bottom");

  if (
    hasSurface && hasBottom && (
      response.daily_payload.surface_window === "closed" ||
      response.daily_payload.suppress_fast_presentations
    )
  ) {
    flags.push({
      severity: "BUG",
      scope: "trio",
      message:
        `${label}: trio mixes a surface tool with a bottom tool under a suppression/closed-surface day. ` +
        `Violates coherence guardrail.`,
    });
  }

  // Low-diversity checks: on conservative days the engine intentionally narrows
  // the trio, so shared family_group / tactical_lane is an expected outcome, not
  // a finding. Suppress entirely under `opportunity_mix=conservative`; otherwise
  // keep emitting at FYI severity so aggressive/balanced days still surface the
  // observation. See `docs/audits/recommender-v3/_cross_species_findings.md`
  // §1.4 follow-up on harness tuning.
  const opportunityMix = response.daily_payload.opportunity_mix;
  const suppressLowDiversity = opportunityMix === "conservative";
  const families = new Set(top3.map((r) => r.family_group));
  if (!suppressLowDiversity) {
    if (families.size === 1) {
      flags.push({
        severity: "FYI",
        scope: "trio",
        message: `${label}: all three picks share family_group=${[...families][0]}. Low diversity.`,
      });
    } else if (families.size === 2) {
      flags.push({
        severity: "FYI",
        scope: "trio",
        message: `${label}: two of three picks share a family_group. Moderate diversity.`,
      });
    }

    const lanes = new Set(top3.map((r) => r.tactical_lane));
    if (lanes.size === 1) {
      flags.push({
        severity: "FYI",
        scope: "trio",
        message:
          `${label}: all three picks share tactical_lane=${[...lanes][0]}. Very low tactical diversity.`,
      });
    }
  }

  // Rank-order inversion: demoted from BLOCKER → FYI with a footnote.
  //
  // The v3 top-three selection uses a per-slot `diversity_bonus` reordering
  // (`topThreeSelection.ts`), so a lower raw `score` on slot 2 or 3 is an
  // intentional outcome of the slot-by-slot diverse-sort, not an invariant
  // violation. A correct comparator would have to re-run the full selection,
  // which this harness does not do. See
  // `docs/audits/recommender-v3/_cross_species_findings.md` §1.4 for the full
  // rationale (pike-01 / pike-03 fly-trio case study).
  for (let i = 1; i < top3.length; i++) {
    if (top3[i]!.score > top3[i - 1]!.score + 0.001) {
      flags.push({
        severity: "FYI",
        scope: "trio",
        message:
          `${label}: pick ${i + 1} (${top3[i]!.id}, score=${top3[i]!.score.toFixed(3)}) has a higher raw score than pick ${i} (${top3[i - 1]!.id}, score=${top3[i - 1]!.score.toFixed(3)}). ` +
          `This is expected under per-slot diversity_bonus reordering in topThreeSelection.ts and is not by itself a bug.`,
      });
    }
  }

  return flags;
}

function evaluateRec(
  rec: RecommenderV3RankedArchetype,
  response: RecommenderV3Response,
  label: string,
): AutoFlag[] {
  return [
    ...checkCopyLength(rec, label),
    ...checkCopySurfaceLanguage(rec, label),
    ...checkCopyBottomVsColumn(rec, label),
    ...checkPaceSuppression(rec, response, label),
    ...checkSurfaceWindow(rec, response, label),
  ];
}

export function evaluateScenario(response: RecommenderV3Response): AutoFlag[] {
  const flags: AutoFlag[] = [];
  flags.push(...checkRankOrder(response.lure_recommendations, "lures"));
  flags.push(...checkRankOrder(response.fly_recommendations, "flies"));

  response.lure_recommendations.slice(0, 3).forEach((rec, i) => {
    flags.push(...evaluateRec(rec, response, `lure ${i + 1} (${rec.id})`));
  });
  response.fly_recommendations.slice(0, 3).forEach((rec, i) => {
    flags.push(...evaluateRec(rec, response, `fly ${i + 1} (${rec.id})`));
  });

  flags.push(...checkTrioCoherence(response.lure_recommendations, response, "lure trio"));
  flags.push(...checkTrioCoherence(response.fly_recommendations, response, "fly trio"));

  return flags;
}

export function formatFlag(flag: AutoFlag): string {
  const prefix = `[${flag.severity}]`;
  return `${prefix} ${flag.message}`;
}
