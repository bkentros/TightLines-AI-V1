/**
 * recommenderEngine public API
 * Import from here — not from individual engine files.
 */

// Main entry point
export { runRecommender } from "./runRecommender.ts";

// Contracts (shared with frontend via separate lib/recommenderContracts.ts)
export type { RecommenderRequest, WaterClarity } from "./contracts/input.ts";
export type {
  RankedFamily,
  RecommenderConfidence,
  RecommenderConfidenceTier,
  RecommenderResponse,
} from "./contracts/output.ts";
export { RECOMMENDER_FEATURE } from "./contracts/output.ts";
export type { BehaviorOutput, PresentationOutput } from "./contracts/behavior.ts";
export type { SpeciesGroup } from "./contracts/species.ts";
export { SPECIES_GROUPS, SPECIES_META } from "./contracts/species.ts";
export type { GearMode, LureFamilyId, FlyFamilyId } from "./contracts/families.ts";

// Species gating helpers (used by frontend for UI validation)
export {
  getValidSpeciesForState,
  isSpeciesValidForState,
  getSpeciesTierForState,
} from "./config/stateSpeciesGating.ts";
