/** Recommender selectors in the shared matte field-guide illustration style. */

import type { WaterClarity } from './recommenderContracts';

const WATERCLARITY_IMAGES: Record<WaterClarity, ReturnType<typeof require>> = {
  clear:   require('../assets/images/color-picker/illustrated/clear.png'),
  stained: require('../assets/images/color-picker/illustrated/stained.png'),
  dirty:   require('../assets/images/color-picker/illustrated/dirty.png'),
};

/** Returns the image for a water clarity value. */
export function getWaterclarityImage(
  clarity: WaterClarity,
): ReturnType<typeof require> {
  return WATERCLARITY_IMAGES[clarity];
}

/** All waterclarity images as an array for bulk preloading. */
export const ALL_WATERCLARITY_IMAGES = Object.values(WATERCLARITY_IMAGES);
