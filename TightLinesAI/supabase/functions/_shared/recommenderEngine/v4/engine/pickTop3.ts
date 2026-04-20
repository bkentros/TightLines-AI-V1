import type { ArchetypeProfileV4, SeasonalRowV4 } from "../contracts.ts";
import {
  TACTICAL_COLUMNS_V4,
  type TacticalColumn,
  type TacticalPace,
} from "../contracts.ts";
import type { PRNG } from "./prng.ts";
import type { RecommenderV4DiagWriter } from "./diagnostics.ts";
import { RecommenderV4EngineError } from "./RecommenderV4EngineError.ts";

export type SlotRole = "headline" | "secondary" | "outward";

export type SlotTarget = {
  column: TacticalColumn;
  pace: TacticalPace;
  role: SlotRole;
};

export type PickedArchetypeV4 = {
  archetype: ArchetypeProfileV4;
  slotColumn: TacticalColumn;
  slotPace: TacticalPace;
  role: SlotRole;
};

const bucketKey = (column: TacticalColumn, pace: TacticalPace) => `${column}|${pace}`;

export function bucketPoolByColumnPace(
  pool: readonly ArchetypeProfileV4[],
): Map<string, ArchetypeProfileV4[]> {
  const buckets = new Map<string, ArchetypeProfileV4[]>();
  const push = (key: string, a: ArchetypeProfileV4) => {
    const arr = buckets.get(key);
    if (arr) arr.push(a);
    else buckets.set(key, [a]);
  };
  for (const a of pool) {
    push(bucketKey(a.column, a.primary_pace), a);
    if (a.secondary_pace != null) {
      push(bucketKey(a.column, a.secondary_pace), a);
    }
  }
  return buckets;
}

function sortStableById(arr: readonly ArchetypeProfileV4[]): ArchetypeProfileV4[] {
  return [...arr].sort((a, b) => a.id.localeCompare(b.id));
}

function excludeFamilies(
  arr: readonly ArchetypeProfileV4[],
  picked: ReadonlySet<string>,
  excludeId?: string,
): ArchetypeProfileV4[] {
  return arr.filter(
    (a) => !picked.has(a.family_group) && (excludeId == null || a.id !== excludeId),
  );
}

/** P7 — prefer unused family_group; if impossible, minimize repeat families (thin pools / shared families). */
function pickWithP7Preference(
  cands: readonly ArchetypeProfileV4[],
  pickedFamilies: ReadonlySet<string>,
  pickedIds: ReadonlySet<string>,
  pickedSoFar: readonly PickedArchetypeV4[],
  seed: PRNG,
): ArchetypeProfileV4 | null {
  const eligible = cands.filter((a) => !pickedIds.has(a.id));
  if (eligible.length === 0) return null;
  const distinct = eligible.filter((a) => !pickedFamilies.has(a.family_group));
  if (distinct.length > 0) return seed.pick(distinct);

  const counts = new Map<string, number>();
  for (const p of pickedSoFar) {
    const g = p.archetype.family_group;
    counts.set(g, (counts.get(g) ?? 0) + 1);
  }
  let best = Infinity;
  for (const a of eligible) {
    best = Math.min(best, counts.get(a.family_group) ?? 0);
  }
  const tier = eligible.filter((a) => (counts.get(a.family_group) ?? 0) === best);
  const sorted = [...tier].sort((a, b) => a.id.localeCompare(b.id));
  if (sorted.length === 0) {
    throw new RecommenderV4EngineError("pickWithP7Preference: no candidates");
  }
  return seed.pick(sorted);
}

export function nearestAdjacentColumn(
  slotColumn: TacticalColumn,
  todayColumns: readonly TacticalColumn[],
): TacticalColumn | null {
  const canon = [...TACTICAL_COLUMNS_V4];
  const idx = canon.indexOf(slotColumn);
  let best: TacticalColumn | null = null;
  let bestDist = Infinity;
  for (const c of todayColumns) {
    if (c === slotColumn) continue;
    const d = Math.abs(canon.indexOf(c) - idx);
    if (
      best === null ||
      d < bestDist ||
      (d === bestDist && canon.indexOf(c) < canon.indexOf(best))
    ) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}

function collectPaceRelaxSameColumn(
  slot: SlotTarget,
  pool: readonly ArchetypeProfileV4[],
  paceSet: ReadonlySet<TacticalPace>,
  pickedFamilies: ReadonlySet<string>,
): ArchetypeProfileV4[] {
  const out: ArchetypeProfileV4[] = [];
  for (const a of pool) {
    if (a.column !== slot.column) continue;
    if (pickedFamilies.has(a.family_group)) continue;
    const ok =
      paceSet.has(a.primary_pace) ||
      (a.secondary_pace != null && paceSet.has(a.secondary_pace));
    if (ok) out.push(a);
  }
  return sortStableById(out);
}

function collectAdjacentSamePace(
  slot: SlotTarget,
  pool: readonly ArchetypeProfileV4[],
  adjacent: TacticalColumn,
  pickedFamilies: ReadonlySet<string>,
): ArchetypeProfileV4[] {
  const out: ArchetypeProfileV4[] = [];
  for (const a of pool) {
    if (a.column !== adjacent) continue;
    if (pickedFamilies.has(a.family_group)) continue;
    if (a.primary_pace === slot.pace || a.secondary_pace === slot.pace) out.push(a);
  }
  return sortStableById(out);
}

function collectAdjacentAnyPace(
  adjacent: TacticalColumn,
  pool: readonly ArchetypeProfileV4[],
  paceSet: ReadonlySet<TacticalPace>,
  pickedFamilies: ReadonlySet<string>,
): ArchetypeProfileV4[] {
  const out: ArchetypeProfileV4[] = [];
  for (const a of pool) {
    if (a.column !== adjacent) continue;
    if (pickedFamilies.has(a.family_group)) continue;
    const ok =
      paceSet.has(a.primary_pace) ||
      (a.secondary_pace != null && paceSet.has(a.secondary_pace));
    if (ok) out.push(a);
  }
  return sortStableById(out);
}

function collectAnyToday(
  pool: readonly ArchetypeProfileV4[],
  colSet: ReadonlySet<TacticalColumn>,
  paceSet: ReadonlySet<TacticalPace>,
  pickedFamilies: ReadonlySet<string>,
): ArchetypeProfileV4[] {
  const out: ArchetypeProfileV4[] = [];
  for (const a of pool) {
    if (!colSet.has(a.column)) continue;
    if (pickedFamilies.has(a.family_group)) continue;
    const ok =
      paceSet.has(a.primary_pace) ||
      (a.secondary_pace != null && paceSet.has(a.secondary_pace));
    if (ok) out.push(a);
  }
  return sortStableById(out);
}

export function applyRelaxationChain(
  slot: SlotTarget,
  pool: readonly ArchetypeProfileV4[],
  pickedFamilies: ReadonlySet<string>,
  pickedIds: ReadonlySet<string>,
  pickedSoFar: readonly PickedArchetypeV4[],
  seed: PRNG,
  todayColumns: readonly TacticalColumn[],
  paceSet: ReadonlySet<TacticalPace>,
  colSet: ReadonlySet<TacticalColumn>,
  diag: RecommenderV4DiagWriter,
  slotIndex: number,
  gear_mode: "lure" | "fly",
  row: SeasonalRowV4,
  relaxFamily: boolean,
): ArchetypeProfileV4 | null {
  const fam = (a: ArchetypeProfileV4) =>
    relaxFamily ? true : !pickedFamilies.has(a.family_group);

  // 1 pace relax same column
  let cands = collectPaceRelaxSameColumn(slot, pool, paceSet, relaxFamily ? new Set() : pickedFamilies)
    .filter(fam);
  if (cands.length > 0) {
    const picked = pickWithP7Preference(cands, pickedFamilies, pickedIds, pickedSoFar, seed);
    if (picked != null) {
      diag({
        event: "pace_relaxed",
        variant: null,
        species: row.species,
        region_key: row.region_key,
        month: row.month,
        water_type: row.water_type,
        context: { gear_mode, slot: slotIndex, slot_role: slot.role },
      });
      return picked;
    }
  }

  const adj = nearestAdjacentColumn(slot.column, todayColumns);
  if (adj) {
    // 2 adjacent same pace
    cands = collectAdjacentSamePace(slot, pool, adj, relaxFamily ? new Set() : pickedFamilies).filter(
      fam,
    );
    if (cands.length > 0) {
      const picked = pickWithP7Preference(cands, pickedFamilies, pickedIds, pickedSoFar, seed);
      if (picked != null) {
        diag({
          event: "column_relaxed",
          variant: "adjacent_same_pace",
          species: row.species,
          region_key: row.region_key,
          month: row.month,
          water_type: row.water_type,
          context: { gear_mode, slot: slotIndex, adjacent: adj },
        });
        return picked;
      }
    }
    // 3 adjacent any pace in set
    cands = collectAdjacentAnyPace(adj, pool, paceSet, relaxFamily ? new Set() : pickedFamilies).filter(
      fam,
    );
    if (cands.length > 0) {
      const picked = pickWithP7Preference(cands, pickedFamilies, pickedIds, pickedSoFar, seed);
      if (picked != null) {
        diag({
          event: "column_relaxed",
          variant: "adjacent_any_pace",
          species: row.species,
          region_key: row.region_key,
          month: row.month,
          water_type: row.water_type,
          context: { gear_mode, slot: slotIndex, adjacent: adj },
        });
        return picked;
      }
    }
  }

  // 4 any today cols × paces
  cands = collectAnyToday(pool, colSet, paceSet, relaxFamily ? new Set() : pickedFamilies).filter(fam);
  if (cands.length > 0) {
    const picked = pickWithP7Preference(cands, pickedFamilies, pickedIds, pickedSoFar, seed);
    if (picked != null) {
      diag({
        event: "column_relaxed",
        variant: "any_today",
        species: row.species,
        region_key: row.region_key,
        month: row.month,
        water_type: row.water_type,
        context: { gear_mode, slot: slotIndex },
      });
      return picked;
    }
  }

  return null;
}

export function buildSlotRecipe(
  column_dist: readonly [TacticalColumn, TacticalColumn, TacticalColumn],
  pace_dist: readonly [TacticalPace, TacticalPace, TacticalPace],
): readonly [SlotTarget, SlotTarget, SlotTarget] {
  const roles: SlotRole[] = ["headline", "secondary", "outward"];
  return [
    { column: column_dist[0]!, pace: pace_dist[0]!, role: roles[0]! },
    { column: column_dist[1]!, pace: pace_dist[1]!, role: roles[1]! },
    { column: column_dist[2]!, pace: pace_dist[2]!, role: roles[2]! },
  ] as const;
}

export function pickTop3V4(
  slot_recipe: readonly [SlotTarget, SlotTarget, SlotTarget],
  eligible_pool: readonly ArchetypeProfileV4[],
  headline_pool: readonly ArchetypeProfileV4[],
  seed: PRNG,
  todayColumns: readonly TacticalColumn[],
  paceSet: ReadonlySet<TacticalPace>,
  colSet: ReadonlySet<TacticalColumn>,
  diag: RecommenderV4DiagWriter,
  gear_mode: "lure" | "fly",
  row: SeasonalRowV4,
): PickedArchetypeV4[] {
  const pickedFamilies = new Set<string>();
  const pickedIds = new Set<string>();
  const picks: PickedArchetypeV4[] = [];

  for (let i = 0; i < 3; i++) {
    const slot = slot_recipe[i]!;
    /** §12.2: slot 0 exact bucket is drawn from headline_pool; relaxation always searches full eligible_pool. */
    const bucketSource = i === 0 ? headline_pool : eligible_pool;
    const buckets = bucketPoolByColumnPace(bucketSource);

    const key = bucketKey(slot.column, slot.pace);
    const raw = buckets.get(key) ?? [];
    const filtered = excludeFamilies(sortStableById(raw), pickedFamilies);
    let chosen: ArchetypeProfileV4 | null = null;
    if (filtered.length > 0) {
      const primaryMatches = filtered.filter((a) => a.primary_pace === slot.pace);
      const poolToPick = primaryMatches.length > 0 ? primaryMatches : filtered;
      chosen = pickWithP7Preference(poolToPick, pickedFamilies, pickedIds, picks, seed);
      if (chosen === null) {
        chosen = applyRelaxationChain(
          slot,
          eligible_pool,
          pickedFamilies,
          pickedIds,
          picks,
          seed,
          todayColumns,
          paceSet,
          colSet,
          diag,
          i,
          gear_mode,
          row,
          false,
        );
      }
    } else {
      chosen = applyRelaxationChain(
        slot,
        eligible_pool,
        pickedFamilies,
        pickedIds,
        picks,
        seed,
        todayColumns,
        paceSet,
        colSet,
        diag,
        i,
        gear_mode,
        row,
        false,
      );
    }

    if (chosen === null) {
      chosen = applyRelaxationChain(
        slot,
        eligible_pool,
        pickedFamilies,
        pickedIds,
        picks,
        seed,
        todayColumns,
        paceSet,
        colSet,
        diag,
        i,
        gear_mode,
        row,
        true,
      );
      if (chosen != null) {
        diag({
          event: "family_redundancy_relaxed",
          variant: null,
          species: row.species,
          region_key: row.region_key,
          month: row.month,
          water_type: row.water_type,
          context: { gear_mode, slot: i },
        });
      }
    }

    if (chosen === null) {
      throw new RecommenderV4EngineError(
        `V4: slot ${i} could not be filled (${gear_mode}) for ${row.species} ${row.region_key} m${row.month} ${row.water_type}`,
      );
    }

    picks.push({
      archetype: chosen,
      slotColumn: slot.column,
      slotPace: slot.pace,
      role: slot.role,
    });
    pickedFamilies.add(chosen.family_group);
    pickedIds.add(chosen.id);
  }

  return picks;
}

export function enforceSurfaceCapV4(
  picks: PickedArchetypeV4[],
  column_distribution: readonly [TacticalColumn, TacticalColumn, TacticalColumn],
  pool: readonly ArchetypeProfileV4[],
  seed: PRNG,
  todayColumns: readonly TacticalColumn[],
  paceSet: ReadonlySet<TacticalPace>,
  colSet: ReadonlySet<TacticalColumn>,
  diag: RecommenderV4DiagWriter,
  gear_mode: "lure" | "fly",
  row: SeasonalRowV4,
): PickedArchetypeV4[] {
  let out = [...picks];
  const anchor_column = column_distribution[0]!;
  for (let guard = 0; guard < 8; guard++) {
    const surfaceIdxs = out
      .map((p, i) => (p.archetype.column === "surface" ? i : -1))
      .filter((i) => i >= 0);
    if (surfaceIdxs.length <= 1) return out;

    const offending_idx = surfaceIdxs[surfaceIdxs.length - 1]!;
    const target_pace = out[offending_idx]!.slotPace;
    const otherFamilies = new Set(
      out.filter((_, i) => i !== offending_idx).map((p) => p.archetype.family_group),
    );
    const otherIds = new Set(out.filter((_, i) => i !== offending_idx).map((p) => p.archetype.id));
    const offendingId = out[offending_idx]!.archetype.id;

    const candidates = sortStableById(pool).filter(
      (a) =>
        a.column === anchor_column &&
        !otherFamilies.has(a.family_group) &&
        a.id !== offendingId &&
        (a.primary_pace === target_pace || a.secondary_pace === target_pace),
    );

    const pickedSoFarForCap = out.filter((_, i) => i !== offending_idx);

    let replacement: ArchetypeProfileV4 | null = null;
    if (candidates.length > 0) {
      replacement = pickWithP7Preference(candidates, otherFamilies, otherIds, pickedSoFarForCap, seed);
    }
    if (replacement === null) {
      const slot: SlotTarget = {
        column: anchor_column,
        pace: target_pace,
        role: "outward",
      };
      replacement = applyRelaxationChain(
        slot,
        pool,
        otherFamilies,
        otherIds,
        pickedSoFarForCap,
        seed,
        todayColumns,
        paceSet,
        colSet,
        diag,
        offending_idx,
        gear_mode,
        row,
        false,
      );
    }

    if (replacement == null) {
      throw new RecommenderV4EngineError(
        `V4: surface_cap could not resolve (${gear_mode}) for ${row.species} ${row.region_key} m${row.month} ${row.water_type}`,
      );
    }

    diag({
      event: "surface_cap_fired",
      variant: null,
      species: row.species,
      region_key: row.region_key,
      month: row.month,
      water_type: row.water_type,
      context: { gear_mode, offending_slot: offending_idx, anchor_column },
    });
    out = [...out];
    out[offending_idx] = {
      archetype: replacement,
      slotColumn: anchor_column,
      slotPace: target_pace,
      role: out[offending_idx]!.role,
    };
  }

  throw new RecommenderV4EngineError(
    `V4: surface_cap iteration limit (${gear_mode}) for ${row.species} ${row.region_key} m${row.month} ${row.water_type}`,
  );
}
