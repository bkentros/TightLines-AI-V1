import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import { assertRecommenderV3Scope } from "../v3/scope.ts";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
import type { ArchetypeProfileV4 } from "../v4/contracts.ts";
import { resolveSeasonalRowRebuild } from "./seasonalResolve.ts";
import { meanDaylightWindMph } from "./wind.ts";
import {
  buildTargetProfiles,
  computeSurfaceBlocked,
  regimeFromHowsScore,
  type DailyRegime,
  type TargetProfile,
} from "./shapeProfiles.ts";
import { selectArchetypesForSide } from "./selectSide.ts";

export type RebuildEngineResult = {
  row: SeasonalRowV4;
  regime: DailyRegime;
  surfaceBlocked: boolean;
  daylightWindMph: number;
  howsScore: number;
  profiles: TargetProfile[];
  lureArchetypes: ArchetypeProfileV4[];
  flyArchetypes: ArchetypeProfileV4[];
};

export function computeRecommenderRebuild(
  req: RecommenderRequest,
  analysis: SharedConditionAnalysis,
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

  const seedBase =
    `${req.location.local_date}|${req.location.region_key}|${species}|${context}|${req.water_clarity}`;

  const lureArchetypes = selectArchetypesForSide({
    side: "lure",
    row,
    species,
    context,
    water_clarity: req.water_clarity,
    profiles,
    surfaceBlocked,
    seedBase,
  });

  const flyArchetypes = selectArchetypesForSide({
    side: "fly",
    row,
    species,
    context,
    water_clarity: req.water_clarity,
    profiles,
    surfaceBlocked,
    seedBase,
  });

  return {
    row,
    regime,
    surfaceBlocked,
    daylightWindMph,
    howsScore,
    profiles,
    lureArchetypes,
    flyArchetypes,
  };
}
