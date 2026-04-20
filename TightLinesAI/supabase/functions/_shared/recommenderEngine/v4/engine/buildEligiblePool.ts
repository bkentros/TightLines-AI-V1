import type {
  ArchetypeProfileV4,
  ForageBucket,
  SeasonalRowV4,
  TacticalColumn,
  TacticalPace,
} from "../contracts.ts";
import type { WaterClarity } from "../../contracts/input.ts";
import type { EngineContext } from "../../../howFishingEngine/contracts/context.ts";
import type { RecommenderV4Species } from "../contracts.ts";
import { FLY_ARCHETYPES_V4, LURE_ARCHETYPES_V4 } from "../candidates/index.ts";

export function passesForageGateForHeadline(
  archetype: ArchetypeProfileV4,
  row: SeasonalRowV4,
): boolean {
  const allowed: ForageBucket[] = [row.primary_forage];
  if (row.secondary_forage) allowed.push(row.secondary_forage);
  return archetype.forage_tags.some((tag) => allowed.includes(tag));
}

export function buildEligiblePoolV4(
  gear_mode: "lure" | "fly",
  row: SeasonalRowV4,
  column_targets: readonly TacticalColumn[],
  pace_targets: readonly TacticalPace[],
  water_clarity: WaterClarity,
  species: RecommenderV4Species,
  water_type: EngineContext,
): readonly ArchetypeProfileV4[] {
  const catalog = gear_mode === "lure" ? LURE_ARCHETYPES_V4 : FLY_ARCHETYPES_V4;
  const excluded_ids = new Set<string>(
    gear_mode === "lure"
      ? row.excluded_lure_ids ?? []
      : row.excluded_fly_ids ?? [],
  );
  const colSet = new Set(column_targets);
  const paceSet = new Set(pace_targets);

  return catalog.filter((a) => {
    if (excluded_ids.has(a.id)) return false;
    if (!a.species_allowed.includes(species)) return false;
    if (!a.water_types_allowed.includes(water_type)) return false;
    if (!colSet.has(a.column)) return false;
    const paceOk =
      paceSet.has(a.primary_pace) ||
      (a.secondary_pace != null && paceSet.has(a.secondary_pace));
    if (!paceOk) return false;
    if (!a.clarity_strengths.includes(water_clarity)) return false;
    return true;
  });
}

export type HeadlineFallbackVariant = "none" | "forage_relaxed" | "primary_relaxed" | "both_relaxed";

export type HeadlinePoolResult = {
  readonly pool: readonly ArchetypeProfileV4[];
  readonly headline_fallback: HeadlineFallbackVariant;
};

/** §11 — headline pool + three-step fallback; records which step satisfied. */
export function buildHeadlinePoolV4(
  gear_mode: "lure" | "fly",
  row: SeasonalRowV4,
  eligible_pool: readonly ArchetypeProfileV4[],
): HeadlinePoolResult {
  const primary_ids = new Set<string>(
    gear_mode === "lure" ? row.primary_lure_ids : row.primary_fly_ids,
  );

  const withPrimary = (pool: readonly ArchetypeProfileV4[]) =>
    pool.filter((a) => primary_ids.has(a.id));

  const withForage = (pool: readonly ArchetypeProfileV4[]) =>
    pool.filter((a) => passesForageGateForHeadline(a, row));

  let pool = withForage(withPrimary(eligible_pool));
  if (pool.length > 0) return { pool, headline_fallback: "none" };

  pool = withPrimary(eligible_pool);
  if (pool.length > 0) return { pool, headline_fallback: "forage_relaxed" };

  pool = withForage(eligible_pool);
  if (pool.length > 0) return { pool, headline_fallback: "primary_relaxed" };

  return { pool: [...eligible_pool], headline_fallback: "both_relaxed" };
}
