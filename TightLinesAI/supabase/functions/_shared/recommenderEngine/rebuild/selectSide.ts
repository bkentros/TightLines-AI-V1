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
  recentHistoryPenalty,
  type RecentRecommendationHistoryEntry,
} from "./recentHistory.ts";

/** One filled recommendation: exact-fit archetype plus the target profile it satisfied. */
export type RebuildSlotPick = {
  archetype: ArchetypeProfileV4;
  profile: TargetProfile;
  /** 0-based index into the shared 3 `TargetProfile` slots this pick matched (may skip earlier slots). */
  source_slot_index: number;
};

function mulberry32(a: number): () => number {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)!;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function stableSortKey(parts: string[], rng: () => number): number {
  let h = 2166136261 >>> 0;
  for (const p of parts) {
    for (let i = 0; i < p.length; i++) {
      h ^= p.charCodeAt(i)!;
      h = Math.imul(h, 16777619);
    }
  }
  return (h >>> 0) + rng();
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

function forageBonus(
  cand: ArchetypeProfileV4,
  row: SeasonalRowV4,
): number {
  let b = 0;
  const tags = cand.forage_tags;
  if (tags.includes(row.primary_forage)) b += 100;
  if (row.secondary_forage && tags.includes(row.secondary_forage)) b += 50;
  return b;
}

/**
 * Soft clarity preference.
 *
 * `clarity_strengths` is a ranking signal, not an eligibility gate: items that
 * list today's clarity get a small bonus, items that don't remain fully
 * eligible. Sized below `forageBonus`'s primary-forage weight (100) so forage
 * alignment still outranks clarity preference.
 */
function clarityBonus(
  cand: ArchetypeProfileV4,
  water_clarity: WaterClarity,
): number {
  return cand.clarity_strengths.includes(water_clarity) ? 20 : 0;
}

export function presenceFromPace(
  p: TacticalPace,
): "subtle" | "moderate" | "bold" {
  if (p === "slow") return "subtle";
  if (p === "medium") return "moderate";
  return "bold";
}

export function selectArchetypesForSide(args: {
  side: "lure" | "fly";
  row: SeasonalRowV4;
  species: SeasonalRowV4["species"];
  context: SeasonalRowV4["water_type"];
  water_clarity: WaterClarity;
  profiles: TargetProfile[];
  surfaceBlocked: boolean;
  seedBase: string;
  currentLocalDate?: string;
  recentHistory?: readonly RecentRecommendationHistoryEntry[];
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
    // NOTE: `clarity_strengths` is intentionally NOT a hard gate; it applies
    // as a soft ranking preference in the per-slot sort (see `clarityBonus`).
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

  for (let slot = 0; slot < profiles.length; slot++) {
    const profile = profiles[slot]!;
    const rng = mulberry32(hashSeed(`${seedBase}|${side}|${slot}`));

    const candidates = catalog.filter(passesGate);
    const ranked: {
      cand: ArchetypeProfileV4;
      tier: number;
      preference: number;
      familyPenalty: number;
      stableKey: number;
    }[] = [];

    for (const cand of candidates) {
      if (pickedIds.has(cand.id)) continue;
      const t = exactSlotFitTier(profile, cand, row);
      if (t == null) continue;

      const famPenalty = picked.some((p) =>
          p.archetype.family_group === cand.family_group
        )
        ? 1
        : 0;
      const preference = forageBonus(cand, row) +
        clarityBonus(cand, water_clarity) -
        recentHistoryPenalty({
          archetypeId: cand.id,
          side,
          currentLocalDate,
          recentHistory,
        });
      const stableKey = stableSortKey([cand.id, String(t)], rng);

      ranked.push({
        cand,
        tier: t,
        preference,
        familyPenalty: famPenalty,
        stableKey,
      });
    }

    if (ranked.length === 0) continue;

    const bestTier = Math.min(...ranked.map((r) => r.tier));
    const tierPool = ranked.filter((r) => r.tier === bestTier);
    tierPool.sort((a, b) =>
      b.preference - a.preference ||
      a.familyPenalty - b.familyPenalty ||
      b.stableKey - a.stableKey ||
      a.cand.id.localeCompare(b.cand.id)
    );

    const chosen = tierPool[0]!.cand;
    picked.push({ archetype: chosen, profile, source_slot_index: slot });
    pickedIds.add(chosen.id);
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
