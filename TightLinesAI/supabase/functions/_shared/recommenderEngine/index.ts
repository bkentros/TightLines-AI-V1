/**
 * recommenderEngine — public barrel (Supabase Edge + tests)
 *
 * **Production (Phase 6 cutover):** `supabase/functions/recommender/index.ts` calls
 * `runRecommenderRebuildSurface` → `rebuild/**` + generated seasonal rows from
 * `data/seasonal-matrix/*.csv`. No region fallback; missing rows surface as
 * `SeasonalRowMissingError` → HTTP 422 `seasonal_row_missing`.
 *
 * **Legacy v3 (`v3/**`, `runRecommenderV3*`)** is not re-exported from this barrel. Import
 * `supabase/functions/_shared/recommenderEngine/legacyV3.ts` in scripts and v3-only tests.
 *
 * **v4 engine subtree (`./v4/engine/**` outside rebuild):** experimental / diagnostic; not wired
 * to production.
 *
 * **Authoring:** `data/seasonal-matrix/*.csv` → `npm run gen:seasonal-rows-v4` → `v4/seasonal/generated`.
 */

// Engine entry points — production edge uses rebuild Surface adapter
export { runRecommenderRebuildSurface } from "./runRecommenderRebuildSurface.ts";
export { computeRecommenderRebuild } from "./rebuild/runRecommenderRebuild.ts";
export {
  hasSeasonalRowRebuild,
  SeasonalRowMissingError,
} from "./rebuild/seasonalResolve.ts";

// Contracts (shared with frontend via separate lib/recommenderContracts.ts)
export type { RecommenderRequest, WaterClarity } from "./contracts/input.ts";
export type {
  RankedRecommendation,
  RecommenderSessionSummary,
  RecommenderResponse,
} from "./contracts/output.ts";
export { RECOMMENDER_FEATURE } from "./contracts/output.ts";
export type { SpeciesGroup } from "./contracts/species.ts";
export { SPECIES_GROUPS, SPECIES_META } from "./contracts/species.ts";
export type { GearMode, LureFamilyId, FlyFamilyId } from "./contracts/families.ts";
export {
  RECOMMENDER_V3_FOUNDATION_FEATURE,
  RECOMMENDER_V3_FEATURE,
  RECOMMENDER_V3_CONTEXTS,
  DAILY_REACTION_WINDOWS_V3,
  DAILY_POSTURE_BANDS_V3,
  RECOMMENDER_V3_SPECIES,
  RECOMMENDER_V3_SPECIES_CONTEXTS,
  RECOMMENDER_V3_SPECIES_META,
  LURE_ARCHETYPE_IDS_V3,
  FLY_ARCHETYPE_IDS_V3,
  TACTICAL_LANES_V3,
  TACTICAL_COLUMNS_V3,
  TACTICAL_PACES_V3,
  TACTICAL_PRESENCE_V3,
  OPPORTUNITY_MIX_MODES_V3,
  SEASONAL_WATER_COLUMNS_V3,
  SEASONAL_LOCATIONS_V3,
  PRESENTATION_STYLES_V3,
  FORAGE_BUCKETS_V3,
  V3_SCORED_VARIABLE_KEYS_BY_CONTEXT,
  LIGHT_BUCKETS_V3,
  assertRecommenderV3Scope,
  colorReasonPhraseV3,
  isContextAllowedForRecommenderV3,
  isRecommenderV3Context,
  isRecommenderV3Species,
  normalizeLightBucketV3,
  resolveColorDecisionV3,
  toLegacyRecommenderSpecies,
  toRecommenderV3Species,
  resolveDailyPayloadV3,
  resolveSeasonalRowV3,
  resolveFinalProfileV3,
  scoreLureCandidatesV3,
  scoreFlyCandidatesV3,
} from "./v3/index.ts";
export type {
  DailyPostureBandV3,
  DailyReactionWindowV3,
  DailySurfaceWindowV3,
  FlyArchetypeIdV3,
  ForageBucketV3,
  LureArchetypeIdV3,
  OpportunityMixModeV3,
  PresentationStyleV3,
  RecommenderV3ArchetypeId,
  RecommenderV3ArchetypeProfile,
  RecommenderV3ColorDecision,
  RecommenderV3ColorReasonCode,
  RecommenderV3Context,
  RecommenderV3DailyPayload,
  RecommenderV3DailyTacticalPreference,
  RecommenderV3RankedArchetype,
  RecommenderV3Response,
  RecommenderV3ScoreBreakdown,
  RecommenderV3FoundationSnapshot,
  RecommenderV3MonthlyBaselineProfile,
  RecommenderV3ResolvedProfile,
  RecommenderV3ResolvedSeasonalRow,
  ResolvedColorThemeV3,
  RecommenderV3SeasonalRow,
  SeasonalLocationV3,
  SeasonalWaterColumnV3,
  RecommenderV3Species,
  TacticalColumnV3,
  TacticalLaneV3,
  TacticalPaceV3,
  TacticalPresenceV3,
} from "./v3/index.ts";
export type {
  LightBucketV3,
  ResolvedColorDecisionV3,
} from "./v3/index.ts";

// Species gating helpers (used by frontend for UI validation)
export {
  getValidSpeciesForState,
  isSpeciesValidForState,
  getSpeciesTierForState,
} from "./config/stateSpeciesGating.ts";
