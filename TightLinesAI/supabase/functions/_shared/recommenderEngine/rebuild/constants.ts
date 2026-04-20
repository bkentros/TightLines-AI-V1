import type {
  TacticalColumn,
  TacticalPace,
} from "../v4/contracts.ts";

/** Canonical ordering — shallow → deep is bottom … surface */
export const COLUMN_ORDER: readonly TacticalColumn[] = [
  "bottom",
  "mid",
  "upper",
  "surface",
];

export const PACE_ORDER: readonly TacticalPace[] = ["slow", "medium", "fast"];

export function columnIndex(c: TacticalColumn): number {
  return COLUMN_ORDER.indexOf(c);
}

export function paceIndex(p: TacticalPace): number {
  return PACE_ORDER.indexOf(p);
}

export function legalColumnChain(
  range: readonly TacticalColumn[],
): TacticalColumn[] {
  const set = new Set(range);
  return COLUMN_ORDER.filter((c) => set.has(c));
}
