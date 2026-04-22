import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import { assertRecommenderV3Scope } from "../v3/scope.ts";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
import { resolveSeasonalRowRebuild } from "./seasonalResolve.ts";
import { meanDaylightWindMph } from "./wind.ts";
import {
  buildTargetProfiles,
  computeSurfaceBlocked,
  regimeFromHowsScore,
  type DailyRegime,
  type TargetProfile,
} from "./shapeProfiles.ts";
import { selectArchetypesForSide, type RebuildSlotPick } from "./selectSide.ts";
import type { RecentRecommendationHistoryEntry } from "./recentHistory.ts";

export type RebuildEngineResult = {
  row: SeasonalRowV4;
  regime: DailyRegime;
  surfaceBlocked: boolean;
  daylightWindMph: number;
  howsScore: number;
  profiles: TargetProfile[];
  lureSlotPicks: RebuildSlotPick[];
  flySlotPicks: RebuildSlotPick[];
};

export type RebuildSelectionOptions = {
  userSeed?: string;
  recentHistory?: readonly RecentRecommendationHistoryEntry[];
};

export function computeRecommenderRebuild(
  req: RecommenderRequest,
  analysis: SharedConditionAnalysis,
  options: RebuildSelectionOptions = {},
): RebuildEngineResult {
  const { species, context } = assertRecommenderV3Scope(req);

  const row = resolveSeasonalRowRebuild(
    species,
    req.location.region_key,
    req.location.month,
    context,
  );

  const howsScore = analysis.scored.score;
  const regime = regimeFromHowsScore(howsScore);

  const daylightWindMph = meanDaylightWindMph({
    env_data: req.env_data as Record<string, unknown>,
    local_date: req.location.local_date,
    local_timezone: req.location.local_timezone,
  });

  const surfaceBlocked = computeSurfaceBlocked({ row, daylightWindMph });

  const profiles = buildTargetProfiles({ row, regime, surfaceBlocked });

  const seedScope = options.userSeed ?? "shared";
  const seedBase =
    `${seedScope}|${req.location.local_date}|${req.location.region_key}|${species}|${context}|${req.water_clarity}`;

  const lureSlotPicks = selectArchetypesForSide({
    side: "lure",
    row,
    species,
    context,
    water_clarity: req.water_clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate: req.location.local_date,
    recentHistory: options.recentHistory,
  });

  const flySlotPicks = selectArchetypesForSide({
    side: "fly",
    row,
    species,
    context,
    water_clarity: req.water_clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate: req.location.local_date,
    recentHistory: options.recentHistory,
  });

  return {
    row,
    regime,
    surfaceBlocked,
    daylightWindMph,
    howsScore,
    profiles,
    lureSlotPicks,
    flySlotPicks,
  };
}
