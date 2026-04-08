/**
 * waterclarityImages.ts
 *
 * Central map from WaterClarity → local image asset.
 *
 * Images live in:  assets/images/waterclarity/
 *   clear.png    — glass clear water
 *   stained.png  — tea / green tint
 *   murky.png    — 2 ft or less visibility
 */

import type { WaterClarity } from './recommenderContracts';

const WATERCLARITY_IMAGES: Record<WaterClarity, ReturnType<typeof require>> = {
  clear:   require('../assets/images/waterclarity/clear.png'),
  stained: require('../assets/images/waterclarity/stained.png'),
  dirty:   require('../assets/images/waterclarity/murky.png'),
};

/** Returns the image for a water clarity value. */
export function getWaterclarityImage(
  clarity: WaterClarity,
): ReturnType<typeof require> {
  return WATERCLARITY_IMAGES[clarity];
}

/** All waterclarity images as an array for bulk preloading. */
export const ALL_WATERCLARITY_IMAGES = Object.values(WATERCLARITY_IMAGES);
