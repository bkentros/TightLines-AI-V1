/**
 * buildExplanations — assembles per-family explanation strings deterministically.
 *
 * Uses pickDeterministic with a date+species+family seed to vary phrasing
 * across days without being random or LLM-dependent.
 *
 * Output fields per RankedFamily:
 *   why_picked  — why this family fits the current conditions
 *   how_to_fish — tactical retrieval / presentation instructions
 *   best_when   — timing and condition context
 *   color_guide — color selection rationale
 */

import { pickDeterministic } from "../../howFishingEngine/copy/deterministicPick.ts";
import type { BehaviorOutput, PresentationOutput } from "../contracts/behavior.ts";
import type { RankedFamily } from "../contracts/output.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import type { ScoredFamily } from "./scoreFamilies.ts";
import {
  WHY_PICKED_FALLBACK,
  WHY_PICKED_PHRASES,
} from "../phrases/whyPickedPhrases.ts";
import {
  HOW_TO_FISH_BY_MOTION,
  HOW_TO_FISH_FAMILY_OVERRIDE,
} from "../phrases/howToFishPhrases.ts";
import {
  BEST_WHEN_FALLBACK,
  BEST_WHEN_PHRASES,
} from "../phrases/bestWhenPhrases.ts";
import { COLOR_PHRASES } from "../phrases/colorPhrases.ts";
import { COLOR_FAMILY_DISPLAY } from "../config/colorGuidance.ts";

// ─── Seed builder ─────────────────────────────────────────────────────────────

function buildSeed(
  local_date: string,
  species: SpeciesGroup,
  family_id: string,
): string {
  return `${local_date}|${species}|${family_id}`;
}

// ─── Per-field builders ───────────────────────────────────────────────────────

function buildWhyPicked(
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  seed: string,
): string {
  const key = `${presentation.trigger_type}:${behavior.forage_mode}` as const;
  const phrases = WHY_PICKED_PHRASES[key] ?? WHY_PICKED_FALLBACK;
  return pickDeterministic(phrases, seed, "why");
}

function buildHowToFish(
  scored: ScoredFamily,
  presentation: PresentationOutput,
  seed: string,
): string {
  // Family-specific override takes priority
  const override = HOW_TO_FISH_FAMILY_OVERRIDE[scored.family_id];
  if (override) {
    return pickDeterministic(override, seed, "how");
  }
  // Fall back to motion-based phrases
  const phrases = HOW_TO_FISH_BY_MOTION[presentation.motion];
  return pickDeterministic(phrases, seed, "how");
}

function buildBestWhen(
  behavior: BehaviorOutput,
  seed: string,
): string {
  const flag = behavior.seasonal_flag ?? "none";
  const key = `${flag}:${behavior.activity}` as const;
  const phrases = BEST_WHEN_PHRASES[key] ?? BEST_WHEN_FALLBACK;
  return pickDeterministic(phrases, seed, "when");
}

function buildColorGuide(
  presentation: PresentationOutput,
  seed: string,
): string {
  const displayMeta = COLOR_FAMILY_DISPLAY[presentation.color_family];
  const phrases = COLOR_PHRASES[presentation.color_family];
  const base = pickDeterministic(phrases, seed, "color");
  return `${displayMeta.label}: ${base}`;
}

// ─── Main builder ─────────────────────────────────────────────────────────────

export function buildExplanations(
  scored: ScoredFamily[],
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  species: SpeciesGroup,
  local_date: string,
): RankedFamily[] {
  return scored.map((family) => {
    const seed = buildSeed(local_date, species, family.family_id);

    return {
      family_id: family.family_id,
      display_name: family.display_name,
      examples: family.examples,
      score: family.score,
      why_picked: buildWhyPicked(behavior, presentation, seed),
      how_to_fish: buildHowToFish(family, presentation, seed),
      best_when: buildBestWhen(behavior, seed),
      color_guide: buildColorGuide(presentation, seed),
    };
  });
}
