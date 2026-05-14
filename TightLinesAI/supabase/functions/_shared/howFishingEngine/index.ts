/**
 * How's Fishing rebuild engine — single active path for daily full-day reports.
 * @see tlai_engine_rebuild_docs/
 */

export * from "./types.ts";
export { buildSharedEngineRequestFromEnvData } from "./request/buildFromEnvData.ts";
export { buildSharedNormalizedOutput } from "./normalize/buildNormalized.ts";
export { analyzeSharedConditions } from "./analyzeSharedConditions.ts";
export {
  runHowFishingReport,
  runHowFishingScoreOnly,
} from "./runHowFishingReport.ts";
export { compositeScoreActivityTier } from "./narration/compositeScoreTier.ts";
export { bandFromScore, scoreDay } from "./score/scoreDay.ts";
export {
  buildDeterministicTimingInsight,
  buildEngineLedSummaryLine,
} from "./narration/polishSafeSurfaceCopy.ts";
