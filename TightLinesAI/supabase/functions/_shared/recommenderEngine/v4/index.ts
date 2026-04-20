/**
 * v4 recommender subtree — catalogs, seasonal TS generated from `data/seasonal-matrix/*.csv`,
 * and the alternate engine. **Not** the standalone Edge runtime path (production:
 * `../runRecommenderRebuildSurface.ts` → `../rebuild/**`). Canonical plan:
 * `docs/tightlines_recommender_architecture_clean.md`.
 */

export * from "./constants.ts";
export * from "./contracts.ts";
export * from "./scope.ts";
export * from "./colorDecision.ts";
export { RESOLVED_COLOR_SHADE_POOLS_V3 } from "./colors.ts";
export * from "./candidates/index.ts";
export { resolveDailyPayloadV4, resolvePostureV4 } from "./engine/resolveDailyPayload.ts";
export { computeRecommenderV4, runRecommenderV4 } from "./engine/runRecommenderV4.ts";
export { RecommenderV4EngineError } from "./engine/RecommenderV4EngineError.ts";
export {
  createCollectingDiagWriter,
  createConsoleDiagWriter,
  createNoopDiagWriter,
  formatRecommenderV4DiagLine,
  RECOMMENDER_V4_DIAG_PREFIX,
  type RecommenderV4DiagPayload,
  type RecommenderV4DiagWriter,
} from "./engine/diagnostics.ts";
export {
  columnShapeIsSpread,
  computeTodayColumns,
  resolveDistribution,
  resolveTodayTacticsV4,
  uniqueColumns,
  uniquePaces,
} from "./engine/resolveTodayTactics.ts";
export {
  buildEligiblePoolV4,
  buildHeadlinePoolV4,
  passesForageGateForHeadline,
} from "./engine/buildEligiblePool.ts";
export {
  bucketPoolByColumnPace,
  buildSlotRecipe,
  enforceSurfaceCapV4,
  nearestAdjacentColumn,
  pickTop3V4,
} from "./engine/pickTop3.ts";
export {
  buildWhyChosenV4,
  pickHowToFish,
  resolveHeadlineForageCopyMode,
} from "./engine/buildCopy.ts";
export { buildSeed, buildAnonSeedKey } from "./engine/buildSeed.ts";
export { resolveSeasonalRowV4, resolveSeasonalRowFromTableV4 } from "./seasonal/resolveSeasonalRow.ts";
export type { ResolvedSeasonalRowV4 } from "./seasonal/resolveSeasonalRow.ts";
