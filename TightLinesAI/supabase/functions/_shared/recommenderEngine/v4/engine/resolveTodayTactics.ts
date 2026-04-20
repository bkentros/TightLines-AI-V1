import type { DailyPayloadV4, ResolvedTacticsV4, SeasonalRowV4 } from "../contracts.ts";
import {
  TACTICAL_COLUMNS_V4,
  TACTICAL_PACES_V4,
  type TacticalColumn,
  type TacticalPace,
} from "../contracts.ts";
import { SURFACE_WIND_THRESHOLD_MPH } from "../constants.ts";
import type { PRNG } from "./prng.ts";

/** §8 — surface in today's column range only when all gates pass. */
export function computeTodayColumns(
  row: SeasonalRowV4,
  posture: DailyPayloadV4["posture"],
  wind_mph: number,
): readonly TacticalColumn[] {
  let cols = [...row.column_range];
  if (!row.surface_seasonally_possible) {
    cols = cols.filter((c) => c !== "surface");
  }
  if (wind_mph > SURFACE_WIND_THRESHOLD_MPH) {
    cols = cols.filter((c) => c !== "surface");
  }
  if (posture === "suppressed") {
    cols = cols.filter((c) => c !== "surface");
  }
  return cols;
}

export function resolveDistribution<T extends string>(
  canonical_scale: readonly T[],
  range: readonly T[],
  baseline: T,
  posture: DailyPayloadV4["posture"],
  seed: PRNG,
): readonly [T, T, T] {
  const range_indices = range.map((v) => canonical_scale.indexOf(v)).sort((a, b) => a - b);
  const range_min_idx = range_indices[0]!;
  const range_max_idx = range_indices[range_indices.length - 1]!;
  const baseline_idx = canonical_scale.indexOf(baseline);
  if (!range_indices.includes(baseline_idx)) {
    throw new Error(`resolveDistribution: baseline "${baseline}" not in range`);
  }

  const shift = (idx: number, direction: number) =>
    Math.min(range_max_idx, Math.max(range_min_idx, idx + direction));

  const below_idx = shift(baseline_idx, -1);
  const above_idx = shift(baseline_idx, +1);
  const baseline_is_interior = below_idx < baseline_idx && above_idx > baseline_idx;

  if (posture === "aggressive") {
    const anchor_idx = baseline_idx;
    let second_idx = shift(baseline_idx, +1);
    if (second_idx === anchor_idx) {
      second_idx = shift(baseline_idx, -1);
    }
    return [
      canonical_scale[anchor_idx]!,
      canonical_scale[anchor_idx]!,
      canonical_scale[second_idx]!,
    ];
  }

  if (posture === "suppressed") {
    const anchor_idx = shift(baseline_idx, -1);
    let second_idx = shift(anchor_idx, -1);
    if (second_idx === anchor_idx) {
      second_idx = shift(anchor_idx, +1);
    }
    return [
      canonical_scale[anchor_idx]!,
      canonical_scale[anchor_idx]!,
      canonical_scale[second_idx]!,
    ];
  }

  // neutral
  if (range.length >= 3 && baseline_is_interior) {
    return [
      canonical_scale[baseline_idx]!,
      canonical_scale[above_idx]!,
      canonical_scale[below_idx]!,
    ];
  }

  const anchor_idx = baseline_idx;
  const candidates: number[] = [];
  if (below_idx !== anchor_idx) candidates.push(below_idx);
  if (above_idx !== anchor_idx) candidates.push(above_idx);
  if (candidates.length === 0) {
    const c = canonical_scale[anchor_idx]!;
    return [c, c, c];
  }
  const second_idx = candidates.length === 1 ? candidates[0]! : seed.pick(candidates);
  return [
    canonical_scale[anchor_idx]!,
    canonical_scale[anchor_idx]!,
    canonical_scale[second_idx]!,
  ];
}

export function uniqueColumns(
  dist: readonly [TacticalColumn, TacticalColumn, TacticalColumn],
): readonly TacticalColumn[] {
  const out: TacticalColumn[] = [];
  const seen = new Set<TacticalColumn>();
  for (const c of dist) {
    if (!seen.has(c)) {
      seen.add(c);
      out.push(c);
    }
  }
  return out;
}

export function uniquePaces(
  dist: readonly [TacticalPace, TacticalPace, TacticalPace],
): readonly TacticalPace[] {
  const out: TacticalPace[] = [];
  const seen = new Set<TacticalPace>();
  for (const p of dist) {
    if (!seen.has(p)) {
      seen.add(p);
      out.push(p);
    }
  }
  return out;
}

export function resolveTodayTacticsV4(
  row: SeasonalRowV4,
  daily: DailyPayloadV4,
  seed: PRNG,
): ResolvedTacticsV4 {
  const today_columns = computeTodayColumns(row, daily.posture, daily.wind_mph);
  const column_distribution = resolveDistribution(
    TACTICAL_COLUMNS_V4,
    today_columns,
    row.column_baseline,
    daily.posture,
    seed,
  );
  const pace_distribution = resolveDistribution(
    TACTICAL_PACES_V4,
    row.pace_range,
    row.pace_baseline,
    daily.posture,
    seed,
  );
  return { today_columns, column_distribution, pace_distribution };
}

export function columnShapeIsSpread(
  posture: DailyPayloadV4["posture"],
  column_distribution: readonly [TacticalColumn, TacticalColumn, TacticalColumn],
): boolean {
  if (posture !== "neutral") return false;
  const [a, b, c] = column_distribution;
  return a !== b && b !== c && a !== c;
}
