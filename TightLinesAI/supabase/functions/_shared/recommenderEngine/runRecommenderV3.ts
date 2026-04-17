import type { RecommenderRequest } from "./contracts/input.ts";
import {
  RECOMMENDER_V3_FEATURE,
  type RecommenderV3Response,
} from "./v3/contracts.ts";
import { assertRecommenderV3Scope } from "./v3/scope.ts";
import { resolveDailyPayloadV3 } from "./v3/resolveDailyPayload.ts";
import { resolveSeasonalRowV3 } from "./v3/seasonal/resolveSeasonalRow.ts";
import { resolveFinalProfileV3 } from "./v3/resolveFinalProfile.ts";
import { scoreFlyCandidatesV3, scoreLureCandidatesV3 } from "./v3/scoreCandidates.ts";
import type { SharedConditionAnalysis } from "../howFishingEngine/analyzeSharedConditions.ts";
import { analyzeRecommenderConditions } from "./sharedAnalysis.ts";

/**
 * Freshwater V3 production path.
 *
 * Seasonal rows define eligible lure/fly pools; shared How's Fishing analysis
 * and daily payload drive ranking inside those pools (condition features,
 * column/posture/presentation fit, clarity, guardrails).
 */
export function computeRecommenderV3(
  req: RecommenderRequest,
  analysis: SharedConditionAnalysis,
): RecommenderV3Response {
  const { species, context } = assertRecommenderV3Scope(req);

  const waterTempRaw = (req.env_data as { measured_water_temp_f?: unknown } | undefined)
    ?.measured_water_temp_f;
  const measuredWaterTempF =
    typeof waterTempRaw === "number" && Number.isFinite(waterTempRaw)
      ? waterTempRaw
      : null;

  const dailyPayload = resolveDailyPayloadV3(
    analysis,
    context,
    req.water_clarity,
    {
      species,
      water_temp_f: measuredWaterTempF,
    },
  );
  const seasonalRow = resolveSeasonalRowV3(
    species,
    req.location.region_key,
    req.location.month,
    context,
    req.location.state_code ?? undefined,
  );
  const resolvedProfile = resolveFinalProfileV3(seasonalRow, dailyPayload);
  const lightLabel = analysis.norm.normalized.light_cloud_condition?.label ?? null;
  const lureRecommendations = scoreLureCandidatesV3(
    seasonalRow,
    resolvedProfile,
    dailyPayload,
    req.water_clarity,
    lightLabel,
  );
  const flyRecommendations = scoreFlyCandidatesV3(
    seasonalRow,
    resolvedProfile,
    dailyPayload,
    req.water_clarity,
    lightLabel,
  );

  return {
    feature: RECOMMENDER_V3_FEATURE,
    species,
    context,
    region_key: req.location.region_key,
    seasonal_source_region_key: seasonalRow.source_region_key,
    used_region_fallback: seasonalRow.used_region_fallback,
    used_state_scoped_row: seasonalRow.used_state_scoped_row,
    month: req.location.month,
    water_clarity: req.water_clarity,
    variables_considered: dailyPayload.variables_considered,
    daily_payload: dailyPayload,
    seasonal_row: seasonalRow,
    resolved_profile: resolvedProfile,
    lure_recommendations: lureRecommendations,
    fly_recommendations: flyRecommendations,
  };
}

export function runRecommenderV3(
  req: RecommenderRequest,
): RecommenderV3Response {
  const analysis = analyzeRecommenderConditions(req);
  return computeRecommenderV3(req, analysis);
}
