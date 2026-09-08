/** Recommender selectors in the shared matte field-guide illustration style. */

import type { EngineContext } from './recommenderContracts';

const WATERTYPE_IMAGES: Partial<Record<EngineContext, ReturnType<typeof require>>> = {
  freshwater_lake_pond: require('../assets/images/recommender/illustrated/lake_pond.png'),
  freshwater_river:     require('../assets/images/recommender/illustrated/river_stream.png'),
};

/** Returns the landscape image for a water context, or null if not available. */
export function getWatertypeImage(
  context: EngineContext,
): ReturnType<typeof require> | null {
  return WATERTYPE_IMAGES[context] ?? null;
}

/** All watertype images as an array for bulk preloading. */
export const ALL_WATERTYPE_IMAGES = Object.values(WATERTYPE_IMAGES);
