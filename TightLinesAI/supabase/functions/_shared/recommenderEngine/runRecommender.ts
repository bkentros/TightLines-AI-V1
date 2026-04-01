/**
 * runRecommender — main orchestrator for the deterministic lure/fly recommender.
 *
 * Execution order:
 *   1. analyzeSharedConditions()  — reuse howFishing env normalizer
 *   2. resolveBehavior()          — baseline + context mod + condition mod → BehaviorOutput
 *   3. resolvePresentation()      — BehaviorOutput → PresentationOutput (+ color)
 *   4. scoreLureFamilies()        — rank all eligible lures
 *   5. scoreFlyFamilies()         — rank all eligible flies
 *   6. buildExplanations()        — attach deterministic phrase strings
 *   7. resolveConfidence()        — confidence tier + reasons
 *   8. Assemble RecommenderResponse
 */

import { analyzeSharedConditions } from "../howFishingEngine/analyzeSharedConditions.ts";
import type { SharedEngineRequest } from "../howFishingEngine/contracts/input.ts";
import { SPECIES_META } from "./contracts/species.ts";
import type { RecommenderRequest } from "./contracts/input.ts";
import { RECOMMENDER_FEATURE, type RecommenderResponse } from "./contracts/output.ts";
import { resolveBehavior } from "./engine/resolveBehavior.ts";
import { resolvePresentation } from "./engine/resolvePresentation.ts";
import {
  scoreFlyFamilies,
  scoreLureFamilies,
  topN,
} from "./engine/scoreFamilies.ts";
import { resolveConfidence } from "./engine/resolveConfidence.ts";
import { buildExplanations } from "./engine/buildExplanations.ts";

// ─── Cache TTL ─────────────────────────────────────────────────────────────────
// Recommender results are valid for the calendar day (reset at midnight local time).
// We use a fixed 6-hour TTL on the client so stale conditions re-trigger a fetch
// if the angler has significantly changed context mid-day.
const CACHE_TTL_HOURS = 6;

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export function runRecommender(req: RecommenderRequest): RecommenderResponse {
  // 1. Build SharedEngineRequest from recommender request
  const shared_req: SharedEngineRequest = {
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

  // 2. Analyze shared conditions (temp, pressure, light, tide)
  const analysis = analyzeSharedConditions(shared_req);

  // 3. Resolve behavior
  const behavior = resolveBehavior(req, analysis);

  // 4. Resolve presentation
  const presentation = resolvePresentation(
    behavior,
    req.species,
    req.context,
    req.water_clarity,
    analysis,
  );

  // 5. Score families
  const lure_scored = topN(
    scoreLureFamilies(behavior, presentation, req.species, req.context, req.water_clarity),
    3,
  );
  const fly_scored = topN(
    scoreFlyFamilies(behavior, presentation, req.species, req.context, req.water_clarity),
    3,
  );

  // 6. Build explanations
  const lure_rankings = buildExplanations(
    lure_scored,
    behavior,
    presentation,
    req.species,
    req.context,
    req.location.local_date,
    req.water_clarity,
  );
  const fly_rankings = buildExplanations(
    fly_scored,
    behavior,
    presentation,
    req.species,
    req.context,
    req.location.local_date,
    req.water_clarity,
  );

  // 7. Resolve confidence
  const species_display = SPECIES_META[req.species].display_name;
  const confidence = resolveConfidence(
    req,
    behavior,
    analysis,
    species_display,
    lure_scored,
    fly_scored,
  );

  // 8. Timing passthrough from shared analysis
  const timing = {
    highlighted_periods: analysis.timing.highlighted_periods as [boolean, boolean, boolean, boolean],
    timing_strength: analysis.timing.timing_strength,
  };

  // 9. Assemble response
  const now = new Date();
  const expires = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000);

  return {
    feature: RECOMMENDER_FEATURE,
    species: req.species,
    context: req.context,
    water_clarity: req.water_clarity,
    generated_at: now.toISOString(),
    cache_expires_at: expires.toISOString(),
    behavior,
    presentation,
    lure_rankings,
    fly_rankings,
    timing,
    confidence,
  };
}
