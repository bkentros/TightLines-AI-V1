export {
  assertRecommenderV3Scope,
  isContextAllowedForRecommenderV3,
  isRecommenderV3Context,
  isRecommenderV3Species,
  RECOMMENDER_V3_SPECIES_CONTEXTS,
  RECOMMENDER_V3_SPECIES_META,
  toRecommenderV3Species,
} from "./scope.ts";
export { resolveDailyPayloadV3 } from "./resolveDailyPayload.ts";
export {
  buildConditionFeaturesFromAnalysis,
  type RecommenderV3ConditionFeatures,
} from "./buildConditionFeatures.ts";
export {
  FLY_ARCHETYPE_IDS_V3,
  ARCHETYPE_WATER_COLUMNS_V3,
  DAILY_SURFACE_WINDOWS_V3,
  DAILY_POSTURE_BANDS_V3,
  FORAGE_BUCKETS_V3,
  LURE_ARCHETYPE_IDS_V3,
  MOODS_V3,
  PRESENTATION_STYLES_V3,
  RECOMMENDER_V3_CONTEXTS,
  RECOMMENDER_V3_FEATURE,
  RECOMMENDER_V3_FOUNDATION_FEATURE,
  RECOMMENDER_V3_SPECIES,
  RECOMMENDER_V3_GUARDRAIL_KEYS,
  RESOLVED_WATER_COLUMNS_V3,
  SEASONAL_LOCATIONS_V3,
  SEASONAL_WATER_COLUMNS_V3,
  TACTICAL_LANES_V3,
  V3_SCORED_VARIABLE_KEYS_BY_CONTEXT,
} from "./contracts.ts";
export { RESOLVED_COLOR_SHADE_POOLS_V3 } from "./colors.ts";
export { FLY_ARCHETYPES_V3, LURE_ARCHETYPES_V3 } from "./candidates/index.ts";
export {
  LARGEMOUTH_V3_SEASONAL_ROWS,
  LARGEMOUTH_V3_SUPPORTED_REGIONS,
  NORTHERN_PIKE_V3_SEASONAL_ROWS,
  NORTHERN_PIKE_V3_SUPPORTED_REGIONS,
  SMALLMOUTH_V3_SEASONAL_ROWS,
  SMALLMOUTH_V3_SUPPORTED_REGIONS,
  TROUT_V3_SEASONAL_ROWS,
  TROUT_V3_SUPPORTED_REGIONS,
} from "./seasonal/index.ts";
export { resolveSeasonalRowV3 } from "./seasonal/resolveSeasonalRow.ts";
export { resolveFinalProfileV3 } from "./resolveFinalProfile.ts";
export {
  LIGHT_BUCKETS_V3,
  normalizeLightBucketV3,
  resolveColorDecisionV3,
} from "./colorDecision.ts";
export {
  scoreFlyCandidatesV3,
  scoreLureCandidatesV3,
} from "./scoreCandidates.ts";
export type {
  ArchetypeWaterColumnV3,
  DailySurfaceWindowV3,
  DailyPostureBandV3,
  FlyArchetypeIdV3,
  ForageBucketV3,
  LureArchetypeIdV3,
  MoodV3,
  PresentationStyleV3,
  RecommenderV3ArchetypeId,
  RecommenderV3ArchetypeProfile,
  RecommenderV3Context,
  RecommenderV3DailyPayload,
  RecommenderV3FoundationSnapshot,
  RecommenderV3RankedArchetype,
  RecommenderV3ResolvedProfile,
  RecommenderV3Response,
  RecommenderV3ScoreBreakdown,
  RecommenderV3SeasonalRow,
  RecommenderV3Species,
  ResolvedWaterColumnV3,
  ResolvedColorThemeV3,
  SeasonalLocationV3,
  SeasonalWaterColumnV3,
  TacticalLaneV3,
} from "./contracts.ts";
export type {
  LightBucketV3,
  ResolvedColorDecisionV3,
} from "./colorDecision.ts";
