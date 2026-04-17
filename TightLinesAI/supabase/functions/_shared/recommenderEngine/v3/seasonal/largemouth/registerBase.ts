import type { RecommenderV3SeasonalRow } from "../../contracts.ts";
import { registerBaseLargemouthRowsPartA } from "./base.ts";
import { registerBaseLargemouthRowsPartB } from "./baseContinued.ts";

export function registerBaseLargemouthRows(
  rows: Map<string, RecommenderV3SeasonalRow>,
): void {
  registerBaseLargemouthRowsPartA(rows);
  registerBaseLargemouthRowsPartB(rows);
}
