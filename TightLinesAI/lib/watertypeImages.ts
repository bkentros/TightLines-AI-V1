/**
 * watertypeImages.ts
 *
 * Central map from EngineContext → local landscape image asset.
 *
 * Images live in:  assets/images/watertype/
 *   lake.png    — used for freshwater_lake_pond
 *   river.png   — used for freshwater_river
 *
 * Regenerate (field-guide style, same pipeline as species/tackle):
 *   deno run -A scripts/generate-recommender-watertype-images.ts
 */

import type { EngineContext } from './recommenderContracts';

const WATERTYPE_IMAGES: Partial<Record<EngineContext, ReturnType<typeof require>>> = {
  freshwater_lake_pond: require('../assets/images/watertype/lake.png'),
  freshwater_river:     require('../assets/images/watertype/river.png'),
};

/** Returns the landscape image for a water context, or null if not available. */
export function getWatertypeImage(
  context: EngineContext,
): ReturnType<typeof require> | null {
  return WATERTYPE_IMAGES[context] ?? null;
}

/** All watertype images as an array for bulk preloading. */
export const ALL_WATERTYPE_IMAGES = Object.values(WATERTYPE_IMAGES);
