/**
 * How's Fishing rebuild engine — single active path for daily full-day reports.
 * @see tlai_engine_rebuild_docs/
 */

export * from "./types.ts";
export { buildSharedEngineRequestFromEnvData } from "./request/buildFromEnvData.ts";
export { buildSharedNormalizedOutput } from "./normalize/buildNormalized.ts";
export { runHowFishingReport } from "./runHowFishingReport.ts";
export { buildNarrationPayloadFromReport } from "./narration/buildNarrationPayload.ts";
export { applyConditionContextToEngineVerdict } from "./narration/applyConditionContextToEngineVerdict.ts";
export { compositeScoreActivityTier } from "./narration/compositeScoreTier.ts";
export { scoreDay, bandFromScore } from "./score/scoreDay.ts";
