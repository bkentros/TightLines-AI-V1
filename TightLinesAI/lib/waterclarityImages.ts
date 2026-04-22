/**
 * waterclarityImages.ts
 *
 * Central map from WaterClarity → local image asset.
 *
 * Images live in:  assets/images/waterclarity/
 *   clear.png    — WaterClarity "clear"
 *   stained.png  — "stained"
 *   murky.png    — "dirty" (UI label: Murky — see WATER_CLARITY_LABELS)
 *
 * Regenerate (field-guide style):
 *   deno run -A scripts/generate-recommender-waterclarity-images.ts
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
