import { analyzeSharedConditions } from "../howFishingEngine/analyzeSharedConditions.ts";
import type { SharedConditionAnalysis } from "../howFishingEngine/analyzeSharedConditions.ts";
import type { SharedEngineRequest } from "../howFishingEngine/contracts/input.ts";
import type { RecommenderRequest } from "./contracts/input.ts";

export function buildSharedEngineRequestForRecommender(
  req: RecommenderRequest,
): SharedEngineRequest {
  return {
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
}

export function analyzeRecommenderConditions(
  req: RecommenderRequest,
): SharedConditionAnalysis {
  return analyzeSharedConditions(buildSharedEngineRequestForRecommender(req));
}
