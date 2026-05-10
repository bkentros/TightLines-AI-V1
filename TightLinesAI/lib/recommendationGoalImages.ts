/**
 * Maps `RecommendationGoal` → local chip art (lure metaphors).
 *
 * Assets: assets/images/recommendation_goal/
 *   all_purpose.png — crankbait-style “cover water / versatile”
 *   big_fish.png    — large glide-style “PB / trophy mindset”
 *
 * Regenerate: deno run --env-file=.env -A scripts/generate-recommender-goal-images.ts
 */

import type { RecommendationGoal } from './recommenderContracts';

const RECOMMENDATION_GOAL_IMAGES: Record<
  RecommendationGoal,
  ReturnType<typeof require>
> = {
  all_purpose: require('../assets/images/recommendation_goal/all_purpose.png'),
  big_fish: require('../assets/images/recommendation_goal/big_fish.png'),
};

export function getRecommendationGoalImage(
  goal: RecommendationGoal,
): ReturnType<typeof require> {
  return RECOMMENDATION_GOAL_IMAGES[goal];
}

/** Bulk preload (recommender wizard). */
export const ALL_RECOMMENDATION_GOAL_IMAGES = Object.values(
  RECOMMENDATION_GOAL_IMAGES,
);
