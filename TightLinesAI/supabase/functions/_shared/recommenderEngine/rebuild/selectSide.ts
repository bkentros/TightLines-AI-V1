import type { WaterClarity } from "../contracts/input.ts";
import type {
  ArchetypeProfileV4,
  FlyArchetypeIdV4,
  SeasonalRowV4,
} from "../v4/contracts.ts";
import { SURFACE_FLY_IDS_V4 } from "../v4/contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../v4/candidates/lures.ts";
import type { TacticalColumn, TacticalPace } from "../v4/contracts.ts";
import type { TargetProfile } from "./shapeProfiles.ts";
import {
  buildHowToFishCopy,
  buildWhyChosenCopy,
  copyVariantIndex,
} from "./copy.ts";
import {
  isRecentlyShown,
  type RecentRecommendationHistoryEntry,
} from "./recentHistory.ts";
import {
  activeFlyConditionWindow,
  activeLureConditionWindow,
  conditionWindowWeight,
  type FlyConditionWindowId,
  flyConditionWindowMatches,
  type FlyDailyConditionState,
  type LureConditionWindowId,
  lureConditionWindowMatches,
  type LureDailyConditionState,
} from "./conditionWindows.ts";
import { paceIndex } from "./constants.ts";

/** One filled recommendation: exact-fit archetype plus the target profile it satisfied. */
export type RebuildSlotPick = {
  archetype: ArchetypeProfileV4;
  profile: TargetProfile;
  /** 0-based index into the shared 3 `TargetProfile` slots this pick matched (may skip earlier slots). */
  source_slot_index: number;
};

type Side = "lure" | "fly";
type SlotIndex = 0 | 1 | 2;

export const CLARITY_SPECIALIST_WHITELIST: Readonly<
  Record<Side, Partial<Record<string, readonly WaterClarity[]>>>
> = {
  lure: {
    spinnerbait: ["stained", "dirty"],
    bladed_jig: ["stained", "dirty"],
    lipless_crankbait: ["stained", "dirty"],
    suspending_jerkbait: ["clear"],
  },
  fly: {
    slim_minnow_streamer: ["clear"],
    unweighted_baitfish_streamer: ["clear"],
    articulated_dungeon_streamer: ["stained", "dirty"],
    rabbit_strip_leech: ["stained", "dirty"],
  },
};

function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)!;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function slotFromSeed(seed: string): SlotIndex {
  return (hashSeed(seed) % 3) as SlotIndex;
}

export function forageDesignatedSlot(args: {
  seedBase: string;
  side: Side;
}): SlotIndex {
  return slotFromSeed(
    `finalist-pool|forage-slot|${args.seedBase}|${args.side}`,
  );
}

export function clarityDesignatedSlot(args: {
  seedBase: string;
  side: Side;
  forageSlot?: SlotIndex;
}): SlotIndex {
  const forageSlot = args.forageSlot ??
    forageDesignatedSlot({ seedBase: args.seedBase, side: args.side });
  const initial = slotFromSeed(
    `finalist-pool|clarity-slot|${args.seedBase}|${args.side}`,
  );
  if (initial !== forageSlot) return initial;

  const alternateOffset =
    (hashSeed(`finalist-pool|clarity-alt|${args.seedBase}|${args.side}`) % 2) +
    1;
  return ((forageSlot + alternateOffset) % 3) as SlotIndex;
}

export function conditionDesignatedSlot(args: {
  seedBase: string;
  side: Side;
  forageSlot?: SlotIndex;
  claritySlot?: SlotIndex;
}): SlotIndex {
  const forageSlot = args.forageSlot ??
    forageDesignatedSlot({ seedBase: args.seedBase, side: args.side });
  const claritySlot = args.claritySlot ??
    clarityDesignatedSlot({
      seedBase: args.seedBase,
      side: args.side,
      forageSlot,
    });
  const initial = slotFromSeed(
    `finalist-pool|condition-slot|${args.seedBase}|${args.side}`,
  );
  if (initial !== forageSlot && initial !== claritySlot) return initial;

  const openSlots = ([0, 1, 2] as const).filter((slot) =>
    slot !== forageSlot && slot !== claritySlot
  );
  return openSlots[
    hashSeed(`finalist-pool|condition-alt|${args.seedBase}|${args.side}`) %
    openSlots.length
  ]!;
}

export function finalistChoiceKey(args: {
  seedBase: string;
  side: Side;
  slot: number;
  candidateId: string;
  tier: 1 | 2;
}): number {
  const { seedBase, side, slot, candidateId, tier } = args;
  return hashSeed(
    `finalist-pool|choice|${seedBase}|${side}|s${slot}|t${tier}|id:${candidateId}`,
  );
}

function weightedChoiceKey(args: {
  seedBase: string;
  side: Side;
  slot: number;
  candidateId: string;
}): number {
  const { seedBase, side, slot, candidateId } = args;
  return hashSeed(
    `weighted-choice|${seedBase}|${side}|s${slot}|id:${candidateId}`,
  );
}

function inEnvelope(
  cand: ArchetypeProfileV4,
  row: SeasonalRowV4,
): boolean {
  return row.column_range.includes(cand.column) &&
    row.pace_range.includes(cand.primary_pace);
}

type PaceCompatibility = {
  reason:
    | "primary_pace_exact"
    | "secondary_pace_exact"
    | "primary_pace_adjacent"
    | "secondary_pace_adjacent";
  score: number;
};

export type CandidateScoreTrace = {
  id: string;
  score: number;
  reasons: readonly string[];
};

type ScoredCandidate = {
  cand: ArchetypeProfileV4;
  score: number;
  reasons: string[];
  pool: "authored_row" | "catalog_valid_rotation";
};

type WeightedCandidate = ScoredCandidate & {
  selectionWeight: number;
};

const SELECTION_SCORE = {
  base: 100,
  primaryPaceExact: 30,
  secondaryPaceExact: 22,
  primaryPaceAdjacent: 12,
  secondaryPaceAdjacent: 8,
  primaryForage: 14,
  secondaryForage: 6,
  clarityStrength: 8,
  claritySpecialist: 10,
  unusedPresentationGroup: 28,
  repeatedPresentationGroup: -80,
  unusedFamilyGroup: 8,
  repeatedFamilyGroup: -20,
  recentArchetype: -45,
  recentPresentationGroup: -25,
  varietyRescuePresentationGroup: 90,
  varietyRescueFamilyGroup: 28,
  authoredRowPreferred: 34,
  catalogFallbackPenalty: -24,
  smallmouthBassSpeciesConfidence: 14,
  troutRiverSpeciesConfidence: 10,
} as const;

const SEASONALLY_AUTHORED_FLY_IDS_REQUIRING_ROW_AUTH = new Set<string>([
  "warmwater_crawfish_fly",
  "warmwater_worm_fly",
  "foam_gurgler_fly",
  "pike_flash_fly",
]);

const SMALLMOUTH_BASS_CONFIDENCE_LURE_IDS = new Set<string>([
  "tube_jig",
  "ned_rig",
  "suspending_jerkbait",
  "drop_shot_minnow",
  "soft_jerkbait",
  "football_jig",
  "finesse_jig",
  "texas_rigged_soft_plastic_craw",
  "paddle_tail_swimbait",
]);

const SMALLMOUTH_BASS_WIND_CONFIDENCE_LURE_IDS = new Set<string>([
  "spinnerbait",
]);

const SMALLMOUTH_BASS_CONFIDENCE_FLY_IDS = new Set<string>([
  "warmwater_crawfish_fly",
  "crawfish_streamer",
  "sculpin_streamer",
  "muddler_sculpin",
  "woolly_bugger",
  "clouser_minnow",
  "baitfish_slider_fly",
]);

const TROUT_RIVER_CONFIDENCE_LURE_IDS = new Set<string>([
  "hair_jig",
  "casting_spoon",
  "inline_spinner",
  "suspending_jerkbait",
  "soft_jerkbait",
]);

const TROUT_RIVER_CONFIDENCE_FLY_IDS = new Set<string>([
  "muddler_sculpin",
  "sculpin_streamer",
  "sculpzilla",
  "woolly_bugger",
  "slim_minnow_streamer",
  "unweighted_baitfish_streamer",
  "rabbit_strip_leech",
]);

function paceCompatibility(
  profile: TargetProfile,
  cand: ArchetypeProfileV4,
  row: SeasonalRowV4,
): PaceCompatibility | null {
  if (!inEnvelope(cand, row)) return null;

  const pc = profile.column;
  const pp = profile.pace;
  if (cand.column !== pc) return null;

  if (cand.primary_pace === pp) {
    return {
      reason: "primary_pace_exact",
      score: SELECTION_SCORE.primaryPaceExact,
    };
  }
  if (cand.secondary_pace != null && cand.secondary_pace === pp) {
    return {
      reason: "secondary_pace_exact",
      score: SELECTION_SCORE.secondaryPaceExact,
    };
  }
  if (Math.abs(paceIndex(cand.primary_pace) - paceIndex(pp)) === 1) {
    return {
      reason: "primary_pace_adjacent",
      score: SELECTION_SCORE.primaryPaceAdjacent,
    };
  }
  if (
    cand.secondary_pace != null &&
    Math.abs(paceIndex(cand.secondary_pace) - paceIndex(pp)) === 1
  ) {
    return {
      reason: "secondary_pace_adjacent",
      score: SELECTION_SCORE.secondaryPaceAdjacent,
    };
  }
  return null;
}

function weightedChoice(args: {
  seedBase: string;
  side: Side;
  slot: number;
  candidates: readonly WeightedCandidate[];
}): WeightedCandidate | undefined {
  const ordered = [...args.candidates].sort((a, b) => {
    const ka = weightedChoiceKey({
      seedBase: args.seedBase,
      side: args.side,
      slot: args.slot,
      candidateId: a.cand.id,
    });
    const kb = weightedChoiceKey({
      seedBase: args.seedBase,
      side: args.side,
      slot: args.slot,
      candidateId: b.cand.id,
    });
    if (ka !== kb) return kb - ka;
    return a.cand.id.localeCompare(b.cand.id);
  });
  const totalWeight = ordered.reduce((sum, r) => sum + r.selectionWeight, 0);
  if (totalWeight <= 0) return undefined;

  let threshold = hashSeed(
    `weighted-choice-threshold|${args.seedBase}|${args.side}|s${args.slot}`,
  ) % totalWeight;
  for (const candidate of ordered) {
    if (threshold < candidate.selectionWeight) return candidate;
    threshold -= candidate.selectionWeight;
  }
  return ordered[ordered.length - 1];
}

function withPositiveSelectionWeights(
  candidates: readonly ScoredCandidate[],
): WeightedCandidate[] {
  if (candidates.length === 0) return [];

  const minScore = Math.min(...candidates.map((r) => r.score));
  return candidates.map((candidate) => ({
    ...candidate,
    selectionWeight: candidate.score > 0
      ? candidate.score
      : candidate.score - minScore + 1,
  }));
}

function matchesPrimaryForage(
  cand: ArchetypeProfileV4,
  row: SeasonalRowV4,
): boolean {
  return cand.forage_tags.includes(row.primary_forage);
}

function clarityWhitelistAllows(
  side: Side,
  cand: ArchetypeProfileV4,
  water_clarity: WaterClarity,
): boolean {
  const allowed = CLARITY_SPECIALIST_WHITELIST[side][cand.id];
  return allowed != null && allowed.includes(water_clarity);
}

function smallmouthBassConfidenceApplies(args: {
  side: Side;
  cand: ArchetypeProfileV4;
  species: SeasonalRowV4["species"];
  activeConditionWindow: LureConditionWindowId | FlyConditionWindowId | null;
}): boolean {
  if (args.species !== "smallmouth_bass") return false;
  if (args.side === "fly") {
    return SMALLMOUTH_BASS_CONFIDENCE_FLY_IDS.has(args.cand.id);
  }
  return SMALLMOUTH_BASS_CONFIDENCE_LURE_IDS.has(args.cand.id) ||
    (SMALLMOUTH_BASS_WIND_CONFIDENCE_LURE_IDS.has(args.cand.id) &&
      args.activeConditionWindow === "wind_reaction_window");
}

function troutRiverConfidenceApplies(args: {
  side: Side;
  cand: ArchetypeProfileV4;
  species: SeasonalRowV4["species"];
  context: SeasonalRowV4["water_type"];
}): boolean {
  if (args.species !== "trout" || args.context !== "freshwater_river") {
    return false;
  }
  return args.side === "lure"
    ? TROUT_RIVER_CONFIDENCE_LURE_IDS.has(args.cand.id)
    : TROUT_RIVER_CONFIDENCE_FLY_IDS.has(args.cand.id);
}

export function presenceFromPace(
  p: TacticalPace,
): "subtle" | "moderate" | "bold" {
  if (p === "slow") return "subtle";
  if (p === "medium") return "moderate";
  return "bold";
}

export type RebuildSlotSelectionTrace = {
  side: Side;
  slot: number;
  source_slot_index: number;
  profile: TargetProfile;
  forageSlot: SlotIndex;
  claritySlot: SlotIndex;
  bestTier?: 1 | 2;
  eligibleExactCount: number;
  eligibleCandidateCount: number;
  tierPoolCount: number;
  afterPickedIdsCount: number;
  familyNarrowed: boolean;
  forageNarrowed: boolean;
  clarityNarrowed: boolean;
  conditionNarrowed: boolean;
  conditionSlot: SlotIndex;
  conditionWindow: LureConditionWindowId | FlyConditionWindowId | null;
  conditionCandidateIds: readonly string[];
  recencyNarrowed: boolean;
  presentationGroupNarrowed: boolean;
  varietyRescueUsed?: boolean;
  varietyRescueReasons?: readonly string[];
  varietyRescuePoolStage?:
    | "same_column_same_pace"
    | "same_column_adjacent_pace";
  recentHistoryPenaltyApplied: boolean;
  clarityWhitelistCandidateIds: readonly string[];
  candidateScores: readonly CandidateScoreTrace[];
  finalistIds: readonly string[];
  chosenId?: string;
};

export function selectArchetypesForSide(args: {
  side: Side;
  row: SeasonalRowV4;
  species: SeasonalRowV4["species"];
  context: SeasonalRowV4["water_type"];
  water_clarity: WaterClarity;
  profiles: TargetProfile[];
  surfaceBlocked: boolean;
  seedBase: string;
  currentLocalDate?: string;
  recentHistory?: readonly RecentRecommendationHistoryEntry[];
  lureConditionState?: LureDailyConditionState;
  flyConditionState?: FlyDailyConditionState;
  onSlotTrace?: (trace: RebuildSlotSelectionTrace) => void;
}): RebuildSlotPick[] {
  const {
    side,
    row,
    species,
    context,
    water_clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate = "",
    recentHistory = [],
    lureConditionState,
    flyConditionState,
    onSlotTrace,
  } = args;

  const catalog = side === "lure" ? LURE_ARCHETYPES_V4 : FLY_ARCHETYPES_V4;
  const allowedIds: ReadonlySet<string> = new Set(
    side === "lure" ? row.primary_lure_ids : row.primary_fly_ids,
  );
  const excluded = new Set<string>(
    side === "lure"
      ? (row.excluded_lure_ids ?? [])
      : (row.excluded_fly_ids ?? []),
  );

  const surfaceFlySet = new Set<string>(
    SURFACE_FLY_IDS_V4 as readonly string[],
  );

  function passesHardGate(c: ArchetypeProfileV4): boolean {
    if (c.gear_mode !== side) return false;
    if (!c.species_allowed.includes(species)) return false;
    if (!c.water_types_allowed.includes(context)) return false;
    if (excluded.has(c.id)) return false;

    if (surfaceBlocked) {
      if (c.is_surface) return false;
      if (side === "fly" && surfaceFlySet.has(c.id as FlyArchetypeIdV4)) {
        return false;
      }
    }
    return true;
  }

  function passesAuthoredGate(c: ArchetypeProfileV4): boolean {
    return passesHardGate(c) && allowedIds.has(c.id);
  }

  function passesCatalogFallbackSeasonalGate(c: ArchetypeProfileV4): boolean {
    if (side !== "fly") return true;
    return !SEASONALLY_AUTHORED_FLY_IDS_REQUIRING_ROW_AUTH.has(c.id);
  }

  const picked: RebuildSlotPick[] = [];
  const pickedIds = new Set<string>();
  const pickedFamilies = new Set<string>();
  const pickedPresentationGroups = new Set<string>();
  const forageSlot = forageDesignatedSlot({ seedBase, side });
  const claritySlot = clarityDesignatedSlot({ seedBase, side, forageSlot });
  const conditionSlot = conditionDesignatedSlot({
    seedBase,
    side,
    forageSlot,
    claritySlot,
  });
  const activeConditionWindow = side === "lure"
    ? (lureConditionState != null
      ? activeLureConditionWindow(lureConditionState)
      : null)
    : (flyConditionState != null
      ? activeFlyConditionWindow(flyConditionState)
      : null);
  const activeConditionMatches = activeConditionWindow == null
    ? null
    : side === "lure"
    ? lureConditionWindowMatches(activeConditionWindow as LureConditionWindowId)
    : flyConditionWindowMatches(activeConditionWindow as FlyConditionWindowId);

  const catalogById = new Map<string, ArchetypeProfileV4>(
    catalog.map((c) => [c.id, c]),
  );
  const recentPresentationGroups = new Set<string>();
  for (const entry of recentHistory) {
    const historical = catalogById.get(entry.archetype_id);
    if (historical == null) continue;
    if (
      isRecentlyShown({
        archetypeId: historical.id,
        side,
        currentLocalDate,
        recentHistory,
      })
    ) {
      recentPresentationGroups.add(historical.presentation_group);
    }
  }

  function scoreCandidate(args: {
    cand: ArchetypeProfileV4;
    pace: PaceCompatibility;
    pool: ScoredCandidate["pool"];
    rescueReasons?: readonly string[];
    rescueBoostMultiplier?: number;
    applyPoolPreference?: boolean;
  }): ScoredCandidate {
    const {
      cand,
      pace,
      pool,
      rescueReasons = [],
      rescueBoostMultiplier = 1,
      applyPoolPreference = false,
    } = args;
    let score = SELECTION_SCORE.base + pace.score;
    const reasons = [
      `base:+${SELECTION_SCORE.base}`,
      `${pace.reason}:+${pace.score}`,
      pool === "authored_row"
        ? (applyPoolPreference
          ? `preferred_pool:authored_row:+${SELECTION_SCORE.authoredRowPreferred}`
          : "preferred_pool:authored_row")
        : (applyPoolPreference
          ? `fallback_pool:catalog_valid_rotation:${SELECTION_SCORE.catalogFallbackPenalty}`
          : "fallback_pool:catalog_valid_rotation"),
      ...rescueReasons,
    ];

    if (applyPoolPreference && pool === "authored_row") {
      score += SELECTION_SCORE.authoredRowPreferred;
    } else if (applyPoolPreference) {
      score += SELECTION_SCORE.catalogFallbackPenalty;
    }

    if (matchesPrimaryForage(cand, row)) {
      score += SELECTION_SCORE.primaryForage;
      reasons.push(`primary_forage:+${SELECTION_SCORE.primaryForage}`);
    }
    if (
      row.secondary_forage != null &&
      cand.forage_tags.includes(row.secondary_forage)
    ) {
      score += SELECTION_SCORE.secondaryForage;
      reasons.push(`secondary_forage:+${SELECTION_SCORE.secondaryForage}`);
    }
    if (cand.clarity_strengths.includes(water_clarity)) {
      score += SELECTION_SCORE.clarityStrength;
      reasons.push(`clarity_strength:+${SELECTION_SCORE.clarityStrength}`);
    }
    if (clarityWhitelistAllows(side, cand, water_clarity)) {
      score += SELECTION_SCORE.claritySpecialist;
      reasons.push(
        `clarity_specialist:+${SELECTION_SCORE.claritySpecialist}`,
      );
    }
    if (
      activeConditionWindow != null && activeConditionMatches?.has(cand.id)
    ) {
      const conditionScore = conditionWindowWeight(activeConditionWindow);
      score += conditionScore;
      reasons.push(
        `condition_window:${activeConditionWindow}:+${conditionScore}`,
      );
    }
    if (
      smallmouthBassConfidenceApplies({
        side,
        cand,
        species,
        activeConditionWindow,
      })
    ) {
      score += SELECTION_SCORE.smallmouthBassSpeciesConfidence;
      reasons.push(
        `species_confidence:smallmouth_bass:+${SELECTION_SCORE.smallmouthBassSpeciesConfidence}`,
      );
    }
    if (
      troutRiverConfidenceApplies({
        side,
        cand,
        species,
        context,
      })
    ) {
      score += SELECTION_SCORE.troutRiverSpeciesConfidence;
      reasons.push(
        `species_confidence:trout_river:+${SELECTION_SCORE.troutRiverSpeciesConfidence}`,
      );
    }
    if (pickedPresentationGroups.has(cand.presentation_group)) {
      score += SELECTION_SCORE.repeatedPresentationGroup;
      reasons.push(
        `presentation_group_repeat:${SELECTION_SCORE.repeatedPresentationGroup}`,
      );
    } else {
      score += SELECTION_SCORE.unusedPresentationGroup;
      reasons.push(
        `presentation_group_unused:+${SELECTION_SCORE.unusedPresentationGroup}`,
      );
      if (rescueReasons.includes("variety_rescue:presentation_group")) {
        const boost = Math.round(
          SELECTION_SCORE.varietyRescuePresentationGroup *
            rescueBoostMultiplier,
        );
        score += boost;
        reasons.push(`variety_rescue_presentation_group_boost:+${boost}`);
      }
    }
    if (pickedFamilies.has(cand.family_group)) {
      score += SELECTION_SCORE.repeatedFamilyGroup;
      reasons.push(
        `family_group_repeat:${SELECTION_SCORE.repeatedFamilyGroup}`,
      );
    } else {
      score += SELECTION_SCORE.unusedFamilyGroup;
      reasons.push(
        `family_group_unused:+${SELECTION_SCORE.unusedFamilyGroup}`,
      );
      if (rescueReasons.includes("variety_rescue:family_group")) {
        const boost = Math.round(
          SELECTION_SCORE.varietyRescueFamilyGroup * rescueBoostMultiplier,
        );
        score += boost;
        reasons.push(`variety_rescue_family_group_boost:+${boost}`);
      }
    }
    if (
      isRecentlyShown({
        archetypeId: cand.id,
        side,
        currentLocalDate,
        recentHistory,
      })
    ) {
      score += SELECTION_SCORE.recentArchetype;
      reasons.push(`recent_archetype:${SELECTION_SCORE.recentArchetype}`);
    }
    if (recentPresentationGroups.has(cand.presentation_group)) {
      score += SELECTION_SCORE.recentPresentationGroup;
      reasons.push(
        `recent_presentation_group:${SELECTION_SCORE.recentPresentationGroup}`,
      );
    }

    return { cand, score, reasons, pool };
  }

  function exactPaceCompatibility(
    profile: TargetProfile,
    cand: ArchetypeProfileV4,
  ): PaceCompatibility | null {
    const pace = paceCompatibility(profile, cand, row);
    if (
      pace?.reason === "primary_pace_exact" ||
      pace?.reason === "secondary_pace_exact"
    ) {
      return pace;
    }
    return null;
  }

  function adjacentPaceCompatibility(
    profile: TargetProfile,
    cand: ArchetypeProfileV4,
  ): PaceCompatibility | null {
    const pace = paceCompatibility(profile, cand, row);
    if (
      pace?.reason === "primary_pace_adjacent" ||
      pace?.reason === "secondary_pace_adjacent"
    ) {
      return pace;
    }
    return null;
  }

  function avoidsRepeatedOffense(
    cand: ArchetypeProfileV4,
    repeatedPresentationGroup: boolean,
    repeatedFamilyGroup: boolean,
  ): boolean {
    if (
      repeatedPresentationGroup &&
      pickedPresentationGroups.has(cand.presentation_group)
    ) {
      return false;
    }
    if (repeatedFamilyGroup && pickedFamilies.has(cand.family_group)) {
      return false;
    }
    return true;
  }

  function buildRescuePool(args: {
    profile: TargetProfile;
    stage: "same_column_same_pace" | "same_column_adjacent_pace";
    repeatedPresentationGroup: boolean;
    repeatedFamilyGroup: boolean;
    rescueReasons: readonly string[];
    rescueBoostMultiplier: number;
  }): ScoredCandidate[] {
    const compatibility = args.stage === "same_column_same_pace"
      ? exactPaceCompatibility
      : adjacentPaceCompatibility;

    const bestById = new Map<string, ScoredCandidate>();
    for (const cand of catalog) {
      if (!passesHardGate(cand)) continue;
      if (pickedIds.has(cand.id)) continue;
      const authoredRowCandidate = allowedIds.has(cand.id);
      if (!authoredRowCandidate && !passesCatalogFallbackSeasonalGate(cand)) {
        continue;
      }
      if (
        !avoidsRepeatedOffense(
          cand,
          args.repeatedPresentationGroup,
          args.repeatedFamilyGroup,
        )
      ) {
        continue;
      }
      const pace = compatibility(args.profile, cand);
      if (pace == null) continue;
      const scored = scoreCandidate({
        cand,
        pace,
        pool: authoredRowCandidate ? "authored_row" : "catalog_valid_rotation",
        rescueReasons: args.rescueReasons,
        rescueBoostMultiplier: args.rescueBoostMultiplier,
        applyPoolPreference: true,
      });
      const existing = bestById.get(cand.id);
      if (existing == null || scored.score > existing.score) {
        bestById.set(cand.id, scored);
      }
    }
    return [...bestById.values()];
  }

  function uniqueScoredCandidates(
    candidates: readonly ScoredCandidate[],
  ): ScoredCandidate[] {
    const byId = new Map<string, ScoredCandidate>();
    for (const candidate of candidates) {
      const existing = byId.get(candidate.cand.id);
      if (existing == null || candidate.score > existing.score) {
        byId.set(candidate.cand.id, candidate);
      }
    }
    return [...byId.values()];
  }

  for (let slot = 0; slot < profiles.length; slot++) {
    const profile = profiles[slot]!;

    const compatibleCandidates: ScoredCandidate[] = [];
    let eligibleExactCount = 0;

    for (const cand of catalog.filter(passesAuthoredGate)) {
      const pace = paceCompatibility(profile, cand, row);
      if (pace == null) continue;

      if (
        pace.reason === "primary_pace_exact" ||
        pace.reason === "secondary_pace_exact"
      ) {
        eligibleExactCount += 1;
      }

      compatibleCandidates.push(
        scoreCandidate({ cand, pace, pool: "authored_row" }),
      );
    }

    const availablePool = compatibleCandidates.filter((r) =>
      !pickedIds.has(r.cand.id)
    );
    const afterPickedIdsCount = availablePool.length;
    const positivePool = availablePool.filter((r) => r.score > 0);
    const nonRepeatedPositivePool = positivePool.filter((r) =>
      !pickedPresentationGroups.has(r.cand.presentation_group)
    );
    const nonRepeatedFallbackPool = availablePool.filter((r) =>
      !pickedPresentationGroups.has(r.cand.presentation_group)
    );
    const fallbackPool = nonRepeatedFallbackPool.length > 0
      ? nonRepeatedFallbackPool
      : availablePool;
    const rawFinalistPool = nonRepeatedPositivePool.length > 0
      ? nonRepeatedPositivePool
      : positivePool.length > 0
      ? positivePool
      : fallbackPool;
    const presentationGroupNarrowed = (nonRepeatedPositivePool.length > 0 &&
      nonRepeatedPositivePool.length < positivePool.length) ||
      (positivePool.length === 0 &&
        nonRepeatedFallbackPool.length > 0 &&
        nonRepeatedFallbackPool.length < availablePool.length);
    const finalistPool = withPositiveSelectionWeights(rawFinalistPool);
    const chosen = weightedChoice({
      seedBase,
      side,
      slot,
      candidates: finalistPool,
    })?.cand;
    const chosenRepeatsPresentationGroup = chosen != null &&
      pickedPresentationGroups.has(chosen.presentation_group);
    const chosenRepeatsFamilyGroup = chosen != null &&
      pickedFamilies.has(chosen.family_group);
    const exactHasNonRepeatingAlternative = availablePool.some((candidate) =>
      chosen != null &&
      candidate.cand.id !== chosen.id &&
      avoidsRepeatedOffense(
        candidate.cand,
        chosenRepeatsPresentationGroup,
        chosenRepeatsFamilyGroup,
      )
    );
    const rescueReasons = [
      ...(chosenRepeatsPresentationGroup
        ? ["variety_rescue:presentation_group"]
        : []),
      ...(chosenRepeatsFamilyGroup ? ["variety_rescue:family_group"] : []),
    ];
    const shouldTryRescue = slot >= 2 &&
      chosen != null &&
      rescueReasons.length > 0 &&
      !exactHasNonRepeatingAlternative;
    let rescuePoolStage:
      | "same_column_same_pace"
      | "same_column_adjacent_pace"
      | undefined;
    let rescueFinalistPool: WeightedCandidate[] = [];
    let rescueChosen: ArchetypeProfileV4 | undefined;
    if (shouldTryRescue) {
      const rescueBoostMultiplier = slot >= 2 ? 1.35 : 1;
      for (
        const stage of [
          "same_column_same_pace",
          "same_column_adjacent_pace",
        ] as const
      ) {
        const pool = buildRescuePool({
          profile,
          stage,
          repeatedPresentationGroup: chosenRepeatsPresentationGroup,
          repeatedFamilyGroup: chosenRepeatsFamilyGroup,
          rescueReasons,
          rescueBoostMultiplier,
        });
        if (pool.length === 0) continue;
        rescuePoolStage = stage;
        rescueFinalistPool = withPositiveSelectionWeights(pool);
        rescueChosen = weightedChoice({
          seedBase,
          side,
          slot,
          candidates: rescueFinalistPool,
        })?.cand;
        if (rescueChosen != null) break;
      }
    }
    const finalChosen = rescueChosen ?? chosen;
    const traceCandidates = uniqueScoredCandidates([
      ...compatibleCandidates,
      ...rescueFinalistPool,
    ]);
    const candidateScores = traceCandidates
      .map((r) => ({ id: r.cand.id, score: r.score, reasons: r.reasons }))
      .sort((a, b) => a.id.localeCompare(b.id));
    const conditionCandidateIds = activeConditionMatches == null
      ? []
      : traceCandidates
        .filter((r) => activeConditionMatches.has(r.cand.id))
        .map((r) => r.cand.id);
    const clarityWhitelistCandidateIds = compatibleCandidates
      .filter((r) => CLARITY_SPECIALIST_WHITELIST[side][r.cand.id] != null)
      .map((r) => r.cand.id);
    const recentHistoryPenaltyApplied = compatibleCandidates.some((r) =>
      r.reasons.some((reason) => reason.startsWith("recent_"))
    );

    if (compatibleCandidates.length === 0) {
      onSlotTrace?.({
        side,
        slot,
        source_slot_index: slot,
        profile,
        forageSlot,
        claritySlot,
        eligibleExactCount,
        eligibleCandidateCount: 0,
        tierPoolCount: 0,
        afterPickedIdsCount: 0,
        familyNarrowed: false,
        forageNarrowed: false,
        clarityNarrowed: false,
        conditionNarrowed: false,
        conditionSlot,
        conditionWindow: activeConditionWindow,
        conditionCandidateIds: [],
        recencyNarrowed: false,
        presentationGroupNarrowed: false,
        varietyRescueUsed: false,
        recentHistoryPenaltyApplied: false,
        clarityWhitelistCandidateIds: [],
        candidateScores: [],
        finalistIds: [],
      });
      continue;
    }

    onSlotTrace?.({
      side,
      slot,
      source_slot_index: slot,
      profile,
      forageSlot,
      claritySlot,
      eligibleExactCount,
      eligibleCandidateCount: compatibleCandidates.length,
      tierPoolCount: positivePool.length,
      afterPickedIdsCount,
      familyNarrowed: false,
      forageNarrowed: false,
      clarityNarrowed: false,
      conditionNarrowed: false,
      conditionSlot,
      conditionWindow: activeConditionWindow,
      conditionCandidateIds,
      recencyNarrowed: false,
      presentationGroupNarrowed,
      varietyRescueUsed: rescueChosen != null,
      varietyRescueReasons: rescueChosen != null ? rescueReasons : [],
      varietyRescuePoolStage: rescueChosen != null
        ? rescuePoolStage
        : undefined,
      recentHistoryPenaltyApplied,
      clarityWhitelistCandidateIds,
      candidateScores,
      finalistIds: (rescueChosen != null ? rescueFinalistPool : finalistPool)
        .map((r) => r.cand.id),
      chosenId: finalChosen?.id,
    });

    if (!finalChosen) continue;
    picked.push({ archetype: finalChosen, profile, source_slot_index: slot });
    pickedIds.add(finalChosen.id);
    pickedFamilies.add(finalChosen.family_group);
    pickedPresentationGroups.add(finalChosen.presentation_group);
  }

  return picked;
}

export function archetypeToRankedFields(args: {
  archetype: ArchetypeProfileV4;
  row: SeasonalRowV4;
  /** Today's tactical slot — drives displayed pace and presence; column stays archetype-authored. */
  targetProfile: TargetProfile;
  copySeed: string;
}): {
  id: string;
  display_name: string;
  family_group: string;
  why_chosen: string;
  how_to_fish: string;
  primary_column: TacticalColumn;
  pace: TacticalPace;
  presence: "subtle" | "moderate" | "bold";
  is_surface: boolean;
} {
  const { archetype, row, targetProfile, copySeed } = args;
  const why = buildWhyChosenCopy({
    archetype,
    row,
    targetProfile,
    variant: copyVariantIndex(copySeed, "why"),
  });
  const how = buildHowToFishCopy({
    archetype,
    targetProfile,
    variant: copyVariantIndex(copySeed, "how"),
  });

  return {
    id: archetype.id,
    display_name: archetype.display_name,
    family_group: archetype.family_group,
    why_chosen: why,
    how_to_fish: how,
    primary_column: archetype.column,
    pace: targetProfile.pace,
    presence: presenceFromPace(targetProfile.pace),
    is_surface: archetype.is_surface,
  };
}
