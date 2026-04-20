/**
 * Legacy v3 recommender — `runRecommenderV3` / `runRecommenderV3Surface` (pre-rebuild engine).
 *
 * **Not** used by `supabase/functions/recommender` (production uses `runRecommenderRebuildSurface`
 * from the main barrel). Import this module from offline audit/calibration scripts, v3 Deno
 * tests, and similar tooling only.
 *
 * @module
 */
export { runRecommenderV3 } from "./runRecommenderV3.ts";
export { runRecommenderV3Surface } from "./runRecommenderV3Surface.ts";
