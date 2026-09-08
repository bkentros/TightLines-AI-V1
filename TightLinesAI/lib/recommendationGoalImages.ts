/** Recommender selectors in the shared matte field-guide illustration style. */

import type { RecommendationGoal } from './recommenderContracts';

const RECOMMENDATION_GOAL_IMAGES: Record<
  RecommendationGoal,
  ReturnType<typeof require>
> = {
  all_purpose: require('../assets/images/color-picker/illustrated/crankbait.png'),
  big_fish: require('../assets/images/color-picker/illustrated/hard_swimbait.png'),
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
