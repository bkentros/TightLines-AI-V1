/**
 * scoreFamilies — scores lure and fly families against PresentationOutput,
 * then returns the top 3 ranked results for each gear mode.
 *
 * Scoring dimensions (additive, no weights — each contributes 0 or 1 point):
 *   1. depth_match         — family depth lanes include presentation depth_target
 *   2. speed_match         — family speed includes presentation speed
 *   3. forage_affinity     — family forage includes behavior forage_mode
 *   4. activity_affinity   — family activity includes behavior activity
 *   5. trigger_match       — family trigger_type matches presentation trigger_type
 *   6. topwater_match      — topwater families get +1 when topwater_viable, else -2 disqualification
 *   7. noise_match         — family noise_level matches presentation noise (±1 tolerance)
 *   8. flash_match         — family flash_level matches presentation flash (±1 tolerance)
 *   9. profile_match       — family profile matches presentation profile
 *  10. valid_species        — family valid_species includes species (required gate — 0 score if missing)
 *  11. valid_context        — family valid_contexts includes context (required gate)
 *  12. current_capable      — lures: +1 if current_technique set and family is current_capable
 *  13. weedless_bonus       — lures: +1 if habitat includes weed/grass/vegetation and family is weedless
 *
 * Max raw score: 13 points. Normalized to 0–100 for display.
 * Required gates (valid_species, valid_context) result in family being excluded entirely if failed.
 * Topwater families score 0 when !topwater_viable (they still appear as eligible in theory
 * but rank at the bottom — excluded in practice since top-3 will be non-topwater).
 */

import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type {
  ActivityLevel,
  BehaviorOutput,
  DepthLane,
  FlashLevel,
  ForageMode,
  NoiseLevel,
  PresentationOutput,
  ProfileSize,
  SpeedPreference,
  TriggerType,
} from "../contracts/behavior.ts";
import type { FlyFamilyId, GearMode, LureFamilyId } from "../contracts/families.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import {
  FLY_FAMILIES,
  type FlyFamilyMetadata,
} from "../config/flyFamilies.ts";
import {
  LURE_FAMILIES,
  type LureFamilyMetadata,
} from "../config/lureFamilies.ts";

// ─── Scoring result ───────────────────────────────────────────────────────────

export type ScoredFamily = {
  family_id: LureFamilyId | FlyFamilyId;
  gear_mode: GearMode;
  display_name: string;
  examples: string[];
  raw_score: number;
  score: number;        // 0–100 normalized
  v1_scope_note?: string;
};

// ─── Ordinal helpers ──────────────────────────────────────────────────────────
// For noise/flash "within 1 tier" matching

const NOISE_LEVELS: NoiseLevel[] = ["silent", "subtle", "moderate", "loud"];
const FLASH_LEVELS: FlashLevel[] = ["none", "subtle", "moderate", "heavy"];

function withinOneTier<T>(arr: T[], a: T, b: T): boolean {
  const ia = arr.indexOf(a);
  const ib = arr.indexOf(b);
  return ia !== -1 && ib !== -1 && Math.abs(ia - ib) <= 1;
}

// ─── Lure scorer ──────────────────────────────────────────────────────────────

function scoreLure(
  meta: LureFamilyMetadata,
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  species: SpeciesGroup,
  context: EngineContext,
): number | null {
  // Required gates — exclude completely if failed
  if (!meta.valid_species.includes(species)) return null;
  if (!meta.valid_contexts.includes(context)) return null;

  // Topwater hard disqualification
  if (meta.topwater && !presentation.topwater_viable) return 0;

  let score = 0;

  // 1. Depth match
  if (meta.depth_match.includes(presentation.depth_target)) score++;

  // 2. Speed match
  if (meta.speed_match.includes(presentation.speed)) score++;

  // 3. Forage affinity
  if (meta.forage_affinity.includes(behavior.forage_mode)) score++;
  // Secondary forage partial match
  if (
    behavior.secondary_forage &&
    meta.forage_affinity.includes(behavior.secondary_forage) &&
    !meta.forage_affinity.includes(behavior.forage_mode)
  ) {
    score += 0.5;
  }

  // 4. Activity affinity
  if (meta.activity_affinity.includes(behavior.activity)) score++;

  // 5. Trigger match
  if (meta.trigger_type === presentation.trigger_type) score++;

  // 6. Noise match (within 1 tier)
  if (withinOneTier(NOISE_LEVELS, meta.noise_level, presentation.noise)) score++;

  // 7. Flash match (within 1 tier)
  if (withinOneTier(FLASH_LEVELS, meta.flash_level, presentation.flash)) score++;

  // 8. Profile match
  if (meta.profile === presentation.profile) score++;

  // 9. Current capable bonus
  if (presentation.current_technique && meta.current_capable) score++;

  // 10. Weedless bonus (when habitat includes vegetation)
  const weed_tags = ["weed_edges", "shallow_grass", "grass_flats", "vegetation", "matted_grass"];
  const has_weeds = behavior.habitat_tags.some((t) => weed_tags.includes(t));
  if (has_weeds && meta.weedless) score++;

  return score;
}

// ─── Fly scorer ───────────────────────────────────────────────────────────────

function scoreFly(
  meta: FlyFamilyMetadata,
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  species: SpeciesGroup,
  context: EngineContext,
): number | null {
  // Required gates
  if (!meta.valid_species.includes(species)) return null;
  if (!meta.valid_contexts.includes(context)) return null;

  // Topwater hard disqualification
  if (meta.topwater && !presentation.topwater_viable) return 0;

  let score = 0;

  // 1. Depth match
  if (meta.depth_match.includes(presentation.depth_target)) score++;

  // 2. Speed match
  if (meta.speed_match.includes(presentation.speed)) score++;

  // 3. Forage affinity
  if (meta.forage_affinity.includes(behavior.forage_mode)) score++;
  if (
    behavior.secondary_forage &&
    meta.forage_affinity.includes(behavior.secondary_forage) &&
    !meta.forage_affinity.includes(behavior.forage_mode)
  ) {
    score += 0.5;
  }

  // 4. Activity affinity
  if (meta.activity_affinity.includes(behavior.activity)) score++;

  // 5. Trigger match
  if (meta.trigger_type === presentation.trigger_type) score++;

  // 6. Noise match
  if (withinOneTier(NOISE_LEVELS, meta.noise_level, presentation.noise)) score++;

  // 7. Flash match
  if (withinOneTier(FLASH_LEVELS, meta.flash_level, presentation.flash)) score++;

  // 8. Profile match
  if (meta.profile === presentation.profile) score++;

  return score;
}

// ─── Main scorer ──────────────────────────────────────────────────────────────

const MAX_LURE_SCORE = 11;  // 10 dimensions + current + weedless
const MAX_FLY_SCORE = 8;    // 8 dimensions

export function scoreLureFamilies(
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  species: SpeciesGroup,
  context: EngineContext,
): ScoredFamily[] {
  const results: ScoredFamily[] = [];

  for (const meta of Object.values(LURE_FAMILIES)) {
    const raw = scoreLure(meta, behavior, presentation, species, context);
    if (raw === null) continue; // excluded by gates

    results.push({
      family_id: meta.id,
      gear_mode: "lure",
      display_name: meta.display_name,
      examples: meta.examples,
      raw_score: raw,
      score: Math.round((raw / MAX_LURE_SCORE) * 100),
    });
  }

  return results.sort((a, b) => b.raw_score - a.raw_score);
}

export function scoreFlyFamilies(
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  species: SpeciesGroup,
  context: EngineContext,
): ScoredFamily[] {
  const results: ScoredFamily[] = [];

  for (const meta of Object.values(FLY_FAMILIES)) {
    const raw = scoreFly(meta, behavior, presentation, species, context);
    if (raw === null) continue;

    results.push({
      family_id: meta.id,
      gear_mode: "fly",
      display_name: meta.display_name,
      examples: meta.examples,
      raw_score: raw,
      score: Math.round((raw / MAX_FLY_SCORE) * 100),
      v1_scope_note: meta.v1_scope_note,
    });
  }

  return results.sort((a, b) => b.raw_score - a.raw_score);
}

/** Returns top N from a scored list. */
export function topN(ranked: ScoredFamily[], n = 3): ScoredFamily[] {
  return ranked.slice(0, n);
}
