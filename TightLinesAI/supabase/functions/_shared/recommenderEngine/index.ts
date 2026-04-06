/**
 * recommenderEngine public API
 * Import from here — not from individual engine files.
 */

// Engine entry points
export { runRecommenderV3 } from "./runRecommenderV3.ts";
export { runRecommenderV3Surface } from "./runRecommenderV3Surface.ts";

// Contracts (shared with frontend via separate lib/recommenderContracts.ts)
export type { RecommenderRequest, WaterClarity } from "./contracts/input.ts";
export type {
  RankedFamily,
  RecommenderConfidence,
  RecommenderConfidenceTier,
  RecommenderResponse,
} from "./contracts/output.ts";
export { RECOMMENDER_FEATURE } from "./contracts/output.ts";
export type { BehaviorOutput, BehaviorSummaryRow, PresentationOutput } from "./contracts/behavior.ts";
export type { SpeciesGroup } from "./contracts/species.ts";
export { SPECIES_GROUPS, SPECIES_META } from "./contracts/species.ts";
export type { GearMode, LureFamilyId, FlyFamilyId } from "./contracts/families.ts";
export {
  RECOMMENDER_V3_FOUNDATION_FEATURE,
  RECOMMENDER_V3_FEATURE,
  RECOMMENDER_V3_CONTEXTS,
  RECOMMENDER_V3_SPECIES,
  RECOMMENDER_V3_SPECIES_CONTEXTS,
  RECOMMENDER_V3_SPECIES_META,
  LURE_ARCHETYPE_IDS_V3,
  FLY_ARCHETYPE_IDS_V3,
  COLOR_THEME_IDS_V3,
  TACTICAL_LANES_V3,
  WATER_COLUMNS_V3,
  MOODS_V3,
  PRESENTATION_STYLES_V3,
  FORAGE_BUCKETS_V3,
  V3_SCORED_VARIABLE_KEYS_BY_CONTEXT,
  assertRecommenderV3Scope,
  isContextAllowedForRecommenderV3,
  isRecommenderV3Context,
  isRecommenderV3Species,
  toRecommenderV3Species,
  resolveDailyPayloadV3,
  resolveSeasonalRowV3,
  resolveFinalProfileV3,
  scoreLureCandidatesV3,
  scoreFlyCandidatesV3,
} from "./v3/index.ts";
export type {
  ColorThemeIdV3,
  FlyArchetypeIdV3,
  ForageBucketV3,
  LureArchetypeIdV3,
  MoodV3,
  PresentationStyleV3,
  RecommenderV3ArchetypeId,
  RecommenderV3ArchetypeProfile,
  RecommenderV3Context,
  RecommenderV3DailyMoodNudge,
  RecommenderV3DailyPayload,
  RecommenderV3DailyPresentationNudge,
  RecommenderV3DailyWaterColumnNudge,
  RecommenderV3RankedArchetype,
  RecommenderV3Response,
  RecommenderV3ScoreBreakdown,
  RecommenderV3FoundationSnapshot,
  RecommenderV3ResolvedProfile,
  RecommenderV3SeasonalRow,
  RecommenderV3Species,
  TacticalLaneV3,
  WaterColumnV3,
} from "./v3/index.ts";

// Species gating helpers (used by frontend for UI validation)
export {
  getValidSpeciesForState,
  isSpeciesValidForState,
  getSpeciesTierForState,
} from "./config/stateSpeciesGating.ts";
