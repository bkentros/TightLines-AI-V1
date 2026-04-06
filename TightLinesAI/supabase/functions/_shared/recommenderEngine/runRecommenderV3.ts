import { analyzeSharedConditions } from "../howFishingEngine/analyzeSharedConditions.ts";
import type { SharedEngineRequest } from "../howFishingEngine/contracts/input.ts";
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

/**
 * Freshwater V3 production path.
 *
 * The runtime stays intentionally compact: shared condition analysis from
 * How's Fishing, a month-by-month seasonal row for the species and region,
 * bounded daily nudges, and archetype scoring with realistic color guidance.
 */
export function computeRecommenderV3(
  req: RecommenderRequest,
  analysis: SharedConditionAnalysis,
): RecommenderV3Response {
  const { species, context } = assertRecommenderV3Scope(req);

  const dailyPayload = resolveDailyPayloadV3(analysis, context);
  const seasonalRow = resolveSeasonalRowV3(
    species,
    req.location.region_key,
    req.location.month,
    context,
  );
  const resolvedProfile = resolveFinalProfileV3(
    seasonalRow,
    dailyPayload,
    req.water_clarity,
  );
  const lightLabel = analysis.norm.normalized.light_cloud_condition?.label ?? null;
  const lureRecommendations = scoreLureCandidatesV3(
    seasonalRow,
    resolvedProfile,
    req.water_clarity,
    lightLabel,
  );
  const flyRecommendations = scoreFlyCandidatesV3(
    seasonalRow,
    resolvedProfile,
    req.water_clarity,
    lightLabel,
  );

  return {
    feature: RECOMMENDER_V3_FEATURE,
    species,
    context,
    region_key: req.location.region_key,
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
  const sharedReq: SharedEngineRequest = {
    latitude: req.location.latitude,
    longitude: req.location.longitude,
    state_code: req.location.state_code,
    region_key: req.location.region_key,
    local_date: req.location.local_date,
    local_timezone: req.location.local_timezone,
    context: req.context,
    environment: req.env_data as SharedEngineRequest["environment"],
    data_coverage: {},
  };

  const analysis = analyzeSharedConditions(sharedReq);
  return computeRecommenderV3(req, analysis);
}
