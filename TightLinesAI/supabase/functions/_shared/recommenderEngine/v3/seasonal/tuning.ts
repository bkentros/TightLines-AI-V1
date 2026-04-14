import type {
  RecommenderV3SeasonalRow,
  SeasonalWaterColumnV3,
} from "../contracts.ts";

export type LegacyWaterColumn = "top" | "shallow" | "mid" | "bottom";

const SEASONAL_COLUMN_ORDER: readonly SeasonalWaterColumnV3[] = [
  "low",
  "mid_low",
  "mid",
  "high",
  "top",
] as const;

export function baseSeasonalWaterColumn(
  base: LegacyWaterColumn,
): SeasonalWaterColumnV3 {
  switch (base) {
    case "top":
      return "top";
    case "shallow":
      return "high";
    case "mid":
      return "mid";
    case "bottom":
    default:
      return "low";
  }
}

export function shiftSeasonalWaterColumn(
  base: SeasonalWaterColumnV3,
  delta: -2 | -1 | 0 | 1 | 2,
): SeasonalWaterColumnV3 {
  const start = SEASONAL_COLUMN_ORDER.indexOf(base);
  if (start === -1) return base;
  const next = Math.max(
    0,
    Math.min(SEASONAL_COLUMN_ORDER.length - 1, start + delta),
  );
  return SEASONAL_COLUMN_ORDER[next]!;
}

/** Deterministic seasonal pool: unique ids, lexicographic order. */
export function sortEligibleArchetypeIds<T extends string>(
  viable: readonly T[],
): readonly T[] {
  return [...new Set(viable)].sort((a, b) => a.localeCompare(b));
}

function seasonalRowKey(row: RecommenderV3SeasonalRow): string {
  return [row.species, row.region_key, row.month, row.context].join("|");
}

/**
 * Seasonal authoring can intentionally override a prior row for the same
 * species/region/month/context key. Using a keyed registry keeps the exported
 * tables unique and makes the replacement explicit at construction time.
 */
export function upsertSeasonalRow(
  rows: Map<string, RecommenderV3SeasonalRow>,
  row: RecommenderV3SeasonalRow,
): void {
  rows.set(seasonalRowKey(row), row);
}

export function finalizeSeasonalRows(
  rows: Map<string, RecommenderV3SeasonalRow>,
): readonly RecommenderV3SeasonalRow[] {
  return [...rows.values()];
}

export function assertNoDuplicateSeasonalRows(
  rows: readonly RecommenderV3SeasonalRow[],
  label: string,
): void {
  const seen = new Set<string>();
  for (const row of rows) {
    const key = seasonalRowKey(row);
    if (seen.has(key)) {
      throw new Error(`${label} contains duplicate seasonal row key '${key}'.`);
    }
    seen.add(key);
  }
}
