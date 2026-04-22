/**
 * speciesImages.ts
 *
 * Central map from SpeciesGroup → local image asset.
 *
 * Fish PNGs:  assets/images/fish/
 *   largemouth_bass.png, smallmouth_bass.png, pike_musky.png, river_trout.png
 *
 * Regenerate (field-guide style):
 *   deno run -A scripts/generate-recommender-species-fish-images.ts
 */

import type { SpeciesGroup } from './recommenderContracts';

const SPECIES_IMAGES: Partial<Record<SpeciesGroup, ReturnType<typeof require>>> = {
  largemouth_bass: require('../assets/images/fish/largemouth_bass.png'),
  smallmouth_bass: require('../assets/images/fish/smallmouth_bass.png'),
  pike_musky:      require('../assets/images/fish/pike_musky.png'),
  river_trout:     require('../assets/images/fish/river_trout.png'),
};

/** Returns the local image source for a species, or null if not yet available. */
export function getSpeciesImage(
  species: SpeciesGroup,
): ReturnType<typeof require> | null {
  return SPECIES_IMAGES[species] ?? null;
}
