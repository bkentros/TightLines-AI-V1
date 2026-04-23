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
  type FlyConditionWindowId,
  flyConditionWindowMatches,
  type FlyDailyConditionState,
  type LureConditionWindowId,
  lureConditionWindowMatches,
  type LureDailyConditionState,
} from "./conditionWindows.ts";

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

function inEnvelope(
  cand: ArchetypeProfileV4,
  row: SeasonalRowV4,
): boolean {
  return row.column_range.includes(cand.column) &&
    row.pace_range.includes(cand.primary_pace);
}

/** Exact slot fit only: same column as the profile; pace via primary or secondary only. */
function exactSlotFitTier(
  profile: TargetProfile,
  cand: ArchetypeProfileV4,
  row: SeasonalRowV4,
): 1 | 2 | null {
  if (!inEnvelope(cand, row)) return null;

  const pc = profile.column;
  const pp = profile.pace;
  if (cand.column !== pc) return null;

  if (cand.primary_pace === pp) return 1;
  if (cand.secondary_pace != null && cand.secondary_pace === pp) return 2;
  return null;
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
  clarityWhitelistCandidateIds: readonly string[];
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

  function passesGate(c: ArchetypeProfileV4): boolean {
    if (c.gear_mode !== side) return false;
    if (!c.species_allowed.includes(species)) return false;
    if (!c.water_types_allowed.includes(context)) return false;
    if (!allowedIds.has(c.id)) return false;
    if (excluded.has(c.id)) return false;

    if (surfaceBlocked) {
      if (c.is_surface) return false;
      if (side === "fly" && surfaceFlySet.has(c.id as FlyArchetypeIdV4)) {
        return false;
      }
    }
    return true;
  }

  const picked: RebuildSlotPick[] = [];
  const pickedIds = new Set<string>();
  const pickedFamilies = new Set<string>();
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

  for (let slot = 0; slot < profiles.length; slot++) {
    const profile = profiles[slot]!;

    const exactFits: {
      cand: ArchetypeProfileV4;
      tier: 1 | 2;
    }[] = [];

    for (const cand of catalog.filter(passesGate)) {
      const t = exactSlotFitTier(profile, cand, row);
      if (t != null) exactFits.push({ cand, tier: t });
    }

    if (exactFits.length === 0) {
      onSlotTrace?.({
        side,
        slot,
        source_slot_index: slot,
        profile,
        forageSlot,
        claritySlot,
        eligibleExactCount: 0,
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
        clarityWhitelistCandidateIds: [],
        finalistIds: [],
      });
      continue;
    }

    const bestTier = Math.min(...exactFits.map((r) => r.tier)) as 1 | 2;
    const tierPool = exactFits.filter((r) => r.tier === bestTier);
    let finalistPool = tierPool.filter((r) => !pickedIds.has(r.cand.id));
    const afterPickedIdsCount = finalistPool.length;

    let familyNarrowed = false;
    const unusedFamilyPool = finalistPool.filter((r) =>
      !pickedFamilies.has(r.cand.family_group)
    );
    if (unusedFamilyPool.length > 0) {
      finalistPool = unusedFamilyPool;
      familyNarrowed = true;
    }

    let forageNarrowed = false;
    if (slot === forageSlot) {
      const foragePool = finalistPool.filter((r) =>
        matchesPrimaryForage(r.cand, row)
      );
      if (
        foragePool.length > 0 && foragePool.length < finalistPool.length
      ) {
        finalistPool = foragePool;
        forageNarrowed = true;
      }
    }

    let clarityNarrowed = false;
    const clarityWhitelistCandidateIds = finalistPool
      .filter((r) => CLARITY_SPECIALIST_WHITELIST[side][r.cand.id] != null)
      .map((r) => r.cand.id);
    if (slot === claritySlot && clarityWhitelistCandidateIds.length > 0) {
      const clarityPool = finalistPool.filter((r) =>
        clarityWhitelistAllows(side, r.cand, water_clarity)
      );
      if (clarityPool.length > 0) {
        finalistPool = clarityPool;
        clarityNarrowed = true;
      }
    }

    let conditionNarrowed = false;
    const conditionCandidateIds = activeConditionMatches == null
      ? []
      : finalistPool
        .filter((r) => activeConditionMatches.has(r.cand.id))
        .map((r) => r.cand.id);
    if (
      slot === conditionSlot &&
      activeConditionMatches != null &&
      conditionCandidateIds.length > 0
    ) {
      finalistPool = finalistPool.filter((r) =>
        activeConditionMatches.has(r.cand.id)
      );
      conditionNarrowed = true;
    }

    let recencyNarrowed = false;
    const nonRecentPool = finalistPool.filter((r) =>
      !isRecentlyShown({
        archetypeId: r.cand.id,
        side,
        currentLocalDate,
        recentHistory,
      })
    );
    if (
      nonRecentPool.length > 0 && nonRecentPool.length < finalistPool.length
    ) {
      finalistPool = nonRecentPool;
      recencyNarrowed = true;
    }

    finalistPool.sort((a, b) => {
      const ka = finalistChoiceKey({
        seedBase,
        side,
        slot,
        candidateId: a.cand.id,
        tier: a.tier,
      });
      const kb = finalistChoiceKey({
        seedBase,
        side,
        slot,
        candidateId: b.cand.id,
        tier: b.tier,
      });
      if (ka !== kb) return kb - ka;
      return a.cand.id.localeCompare(b.cand.id);
    });

    const chosen = finalistPool[0]?.cand;
    onSlotTrace?.({
      side,
      slot,
      source_slot_index: slot,
      profile,
      forageSlot,
      claritySlot,
      bestTier,
      eligibleExactCount: exactFits.length,
      tierPoolCount: tierPool.length,
      afterPickedIdsCount,
      familyNarrowed,
      forageNarrowed,
      clarityNarrowed,
      conditionNarrowed,
      conditionSlot,
      conditionWindow: activeConditionWindow,
      conditionCandidateIds,
      recencyNarrowed,
      clarityWhitelistCandidateIds,
      finalistIds: finalistPool.map((r) => r.cand.id),
      chosenId: chosen?.id,
    });

    if (!chosen) continue;
    picked.push({ archetype: chosen, profile, source_slot_index: slot });
    pickedIds.add(chosen.id);
    pickedFamilies.add(chosen.family_group);
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
