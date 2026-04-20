/**
 * §6.2 / §8 tactical distribution + §11 pool filter — shared by generator G8 and eligibility audit.
 */
import type { EngineContext } from "../../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { WaterClarity } from "../../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type {
  ArchetypeProfileV4,
  RecommenderV4Species,
  SeasonalRowV4,
  TacticalColumn,
  TacticalPace,
} from "../../../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import {
  TACTICAL_COLUMNS_V4,
  TACTICAL_PACES_V4,
} from "../../../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";

export type PostureV4 = "aggressive" | "neutral" | "suppressed";

const COL_SCALE = [...TACTICAL_COLUMNS_V4] as readonly TacticalColumn[];
const PACE_SCALE = [...TACTICAL_PACES_V4] as readonly TacticalPace[];

export function computeTodayColumns(
  columnRange: readonly TacticalColumn[],
  surfaceSeasonallyPossible: boolean,
  windMph: number,
  posture: PostureV4,
): TacticalColumn[] {
  let cols = [...columnRange];
  if (!surfaceSeasonallyPossible) cols = cols.filter((c) => c !== "surface");
  if (windMph > 18) cols = cols.filter((c) => c !== "surface");
  if (posture === "suppressed") cols = cols.filter((c) => c !== "surface");
  return cols;
}

function clampIdx(idx: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, idx));
}

function shiftIdx(
  idx: number,
  dir: -1 | 1,
  rangeMin: number,
  rangeMax: number,
): number {
  return clampIdx(idx + dir, rangeMin, rangeMax);
}

/** Deterministic stand-in for §6.2 neutral 2+1 `seed.pick` — slot 0/1 never depend on this; only outward tier. */
const NEUTRAL_FALLBACK_PICK = 0;

export function resolveColumnDistribution(
  range: readonly TacticalColumn[],
  baseline: TacticalColumn,
  posture: PostureV4,
): readonly [TacticalColumn, TacticalColumn, TacticalColumn] {
  return resolveDistribution(COL_SCALE, range, baseline, posture);
}

export function resolvePaceDistribution(
  range: readonly TacticalPace[],
  baseline: TacticalPace,
  posture: PostureV4,
): readonly [TacticalPace, TacticalPace, TacticalPace] {
  return resolveDistribution(PACE_SCALE, range, baseline, posture);
}

function resolveDistribution<T extends string>(
  canonicalScale: readonly T[],
  range: readonly T[],
  baseline: T,
  posture: PostureV4,
): readonly [T, T, T] {
  const rangeIndices = range.map((v) => canonicalScale.indexOf(v)).sort((a, b) => a - b);
  const rangeMinIdx = rangeIndices[0]!;
  const rangeMaxIdx = rangeIndices[rangeIndices.length - 1]!;
  const baselineIdx = canonicalScale.indexOf(baseline);
  if (baselineIdx === -1 || !rangeIndices.includes(baselineIdx)) {
    throw new Error(`baseline ${baseline} not in range ${range.join(",")}`);
  }

  const shift = (idx: number, direction: -1 | 1) =>
    shiftIdx(idx, direction, rangeMinIdx, rangeMaxIdx);

  const belowIdx = shift(baselineIdx, -1);
  const aboveIdx = shift(baselineIdx, 1);
  const baselineIsInterior = belowIdx < baselineIdx && aboveIdx > baselineIdx;

  if (posture === "aggressive") {
    let anchorIdx = baselineIdx;
    let secondIdx = shift(baselineIdx, 1);
    if (secondIdx === anchorIdx) secondIdx = shift(baselineIdx, -1);
    const a = canonicalScale[anchorIdx]!;
    const s = canonicalScale[secondIdx]!;
    return [a, a, s];
  }

  if (posture === "suppressed") {
    let anchorIdx = shift(baselineIdx, -1);
    let secondIdx = shift(anchorIdx, -1);
    if (secondIdx === anchorIdx) secondIdx = shift(anchorIdx, 1);
    const a = canonicalScale[anchorIdx]!;
    const s = canonicalScale[secondIdx]!;
    return [a, a, s];
  }

  // neutral
  if (range.length >= 3 && baselineIsInterior) {
    return [
      canonicalScale[baselineIdx]!,
      canonicalScale[aboveIdx]!,
      canonicalScale[belowIdx]!,
    ];
  }

  const anchorIdx = baselineIdx;
  const candidates: number[] = [];
  if (belowIdx !== anchorIdx) candidates.push(belowIdx);
  if (aboveIdx !== anchorIdx) candidates.push(aboveIdx);
  if (candidates.length === 0) {
    const a = canonicalScale[anchorIdx]!;
    return [a, a, a];
  }
  const secondIdx = candidates.length === 1
    ? candidates[0]!
    : candidates[NEUTRAL_FALLBACK_PICK % candidates.length]!;
  const a = canonicalScale[anchorIdx]!;
  const s = canonicalScale[secondIdx]!;
  return [a, a, s];
}

/** Gated column list + distribution + pool-driving unique sets (§11). */
export function tacticsForPosture(
  row: SeasonalRowV4,
  posture: PostureV4,
  windMph: number,
): {
  gatedColumns: TacticalColumn[];
  columnDistribution: readonly [TacticalColumn, TacticalColumn, TacticalColumn];
  paceDistribution: readonly [TacticalPace, TacticalPace, TacticalPace];
  poolColumns: TacticalColumn[];
  poolPaces: TacticalPace[];
} {
  const gatedColumns = computeTodayColumns(
    row.column_range,
    row.surface_seasonally_possible,
    windMph,
    posture,
  );
  if (!gatedColumns.includes(row.column_baseline)) {
    throw new Error(
      `column_baseline ${row.column_baseline} not in gated columns for posture=${posture} wind=${windMph}`,
    );
  }
  const columnDistribution = resolveColumnDistribution(
    gatedColumns,
    row.column_baseline,
    posture,
  );
  const paceDistribution = resolvePaceDistribution(
    row.pace_range,
    row.pace_baseline,
    posture,
  );
  return {
    gatedColumns,
    columnDistribution,
    paceDistribution,
    poolColumns: [...new Set(columnDistribution)],
    poolPaces: [...new Set(paceDistribution)],
  };
}

export function slot0Target(
  row: SeasonalRowV4,
  posture: PostureV4,
  windMph: number,
): { column: TacticalColumn; pace: TacticalPace } {
  const { columnDistribution, paceDistribution } = tacticsForPosture(
    row,
    posture,
    windMph,
  );
  return { column: columnDistribution[0]!, pace: paceDistribution[0]! };
}

export function buildEligiblePoolV4(
  gearMode: "lure" | "fly",
  row: SeasonalRowV4,
  todayCols: readonly TacticalColumn[],
  todayPaces: readonly TacticalPace[],
  waterClarity: WaterClarity,
  species: RecommenderV4Species,
  waterType: EngineContext,
  catalog: readonly ArchetypeProfileV4[],
): ArchetypeProfileV4[] {
  const excluded = new Set(
    gearMode === "lure"
      ? (row.excluded_lure_ids ?? [])
      : (row.excluded_fly_ids ?? []),
  );
  const colSet = new Set(todayCols);
  const paceSet = new Set(todayPaces);
  return catalog.filter((a) => {
    if (excluded.has(a.id)) return false;
    if (!a.species_allowed.includes(species)) return false;
    if (!a.water_types_allowed.includes(waterType)) return false;
    if (!colSet.has(a.column)) return false;
    const paceOk =
      paceSet.has(a.primary_pace) ||
      (a.secondary_pace != null && paceSet.has(a.secondary_pace));
    if (!paceOk) return false;
    if (!a.clarity_strengths.includes(waterClarity)) return false;
    return true;
  });
}

export function uniquePaceSetFromDistribution(
  paceDist: readonly [TacticalPace, TacticalPace, TacticalPace],
): TacticalPace[] {
  return [...new Set(paceDist)];
}

export function uniqueColumnSetFromDistribution(
  colDist: readonly [TacticalColumn, TacticalColumn, TacticalColumn],
): TacticalColumn[] {
  return [...new Set(colDist)];
}
