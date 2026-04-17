import type { RecommenderV3SeasonalRow } from "../../contracts.ts";
import { finalizeSeasonalRows } from "../tuning.ts";
import { validateSeasonalRows } from "../validateSeasonalRow.ts";
import { registerBaseLargemouthRows } from "./registerBase.ts";
import { registerFocusedAuditedLargemouthOverrides } from "./overrides/focusedAudited.ts";
import { registerSoutheastAtlanticLargemouthOverrides } from "./overrides/southeastAtlantic.ts";

export { LARGEMOUTH_V3_SUPPORTED_REGIONS } from "./constants.ts";

export const LARGEMOUTH_V3_SEASONAL_ROWS = (() => {
  const rows = new Map<string, RecommenderV3SeasonalRow>();
  registerBaseLargemouthRows(rows);
  registerFocusedAuditedLargemouthOverrides(rows);
  registerSoutheastAtlanticLargemouthOverrides(rows);
  const finalized = finalizeSeasonalRows(rows);
  validateSeasonalRows(finalized, "largemouth");
  return finalized;
})();
