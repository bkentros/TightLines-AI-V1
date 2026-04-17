import type { RecommenderV3SeasonalRow } from "../../../contracts.ts";

/** Discrete southeast_atlantic-only rows are authored via SOUTHEAST_WARM_REGIONS in the base register. */
export function registerSoutheastAtlanticLargemouthOverrides(
  _rows: Map<string, RecommenderV3SeasonalRow>,
): void {}
