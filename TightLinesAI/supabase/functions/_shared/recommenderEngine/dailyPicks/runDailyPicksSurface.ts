import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import { analyzeRecommenderConditions } from "../sharedAnalysis.ts";
import { resolveDailyPicksSeasonalRow } from "./resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "./runDailyPicksEngine.ts";
import {
  type DailyPicksFutureResponse,
  shapeDailyPicksResponse,
} from "./shapeDailyPicksResponse.ts";
import type { DailyPicksVariant } from "./selectDailyPicks.ts";

export function runDailyPicksSurface(
  req: RecommenderRequest,
  options: {
    seed: string;
    variant: DailyPicksVariant;
    avoidLureIds?: readonly string[];
    avoidFlyIds?: readonly string[];
    analysis?: SharedConditionAnalysis;
  },
): DailyPicksFutureResponse {
  const analysis = options.analysis ?? analyzeRecommenderConditions(req);
  const seasonalRow = resolveDailyPicksSeasonalRow({
    species: req.species,
    region_key: req.location.region_key,
    month: req.location.month,
    water_type: req.context,
  });
  const result = runDailyPicksEngine({
    req,
    analysis,
    seasonalRow,
    seed: options.seed,
    variant: options.variant,
    avoidLureIds: options.avoidLureIds,
    avoidFlyIds: options.avoidFlyIds,
  });

  return shapeDailyPicksResponse({
    result,
    seed: options.seed,
  });
}
