/**
 * recommenderAssets.ts — Typed static asset maps for the recommender UI.
 *
 * Images are required at build time so Metro can bundle them correctly.
 * Add new entries here as images become available; the UI components
 * gracefully fall back to icon-only cards for any missing entries.
 */

import type { SpeciesGroup } from './recommenderContracts';

// ─── Species images ────────────────────────────────────────────────────────────
// Square illustrations (~1024×1024) on black backgrounds.
// Filename convention: assets/recommender/species/{species_id}.png

type SpeciesImageMap = Partial<Record<SpeciesGroup, ReturnType<typeof require>>>;

export const SPECIES_IMAGES: SpeciesImageMap = {
  largemouth_bass:  require('../assets/recommender/species/largemouth_bass.png'),
  smallmouth_bass:  require('../assets/recommender/species/smallmouth_bass.png'),
  walleye:          require('../assets/recommender/species/walleye.png'),
  pike_musky:       require('../assets/recommender/species/pike_musky.png'),
  // river_trout:   require('../assets/recommender/species/river_trout.png'),
  // redfish:       require('../assets/recommender/species/redfish.png'),
  // snook:         require('../assets/recommender/species/snook.png'),
  // seatrout:      require('../assets/recommender/species/seatrout.png'),
  // striped_bass:  require('../assets/recommender/species/striped_bass.png'),
  // tarpon:        require('../assets/recommender/species/tarpon.png'),
};

// ─── Water clarity images ──────────────────────────────────────────────────────
// Landscape environmental shots (~1200×800).
// Filename convention: assets/recommender/clarity/{clarity_value}.png

// export const CLARITY_IMAGES = {
//   clear:   require('../assets/recommender/clarity/clear.png'),
//   stained: require('../assets/recommender/clarity/stained.png'),
//   dirty:   require('../assets/recommender/clarity/dirty.png'),
// } as const;

// ─── Body of water / context images ───────────────────────────────────────────
// Landscape environmental shots (~1200×800).
// Filename convention: assets/recommender/context/{context_id}.png

// export const CONTEXT_IMAGES = {
//   freshwater_lake_pond:  require('../assets/recommender/context/freshwater_lake_pond.png'),
//   freshwater_river:      require('../assets/recommender/context/freshwater_river.png'),
//   coastal:               require('../assets/recommender/context/coastal.png'),
//   coastal_flats_estuary: require('../assets/recommender/context/coastal_flats_estuary.png'),
// } as const;

// ─── Lure family images ────────────────────────────────────────────────────────
// Square product-style illustrations (~800×800).
// Filename convention: assets/recommender/lures/{family_id}.png

// export const LURE_IMAGES: Partial<Record<string, ReturnType<typeof require>>> = {
//   jig:                  require('../assets/recommender/lures/jig.png'),
//   soft_swimbait:        require('../assets/recommender/lures/soft_swimbait.png'),
//   ...
// };

// ─── Fly family images ─────────────────────────────────────────────────────────
// Square product-style illustrations (~800×800).
// Filename convention: assets/recommender/flies/{family_id}.png

// export const FLY_IMAGES: Partial<Record<string, ReturnType<typeof require>>> = {
//   streamer_baitfish: require('../assets/recommender/flies/streamer_baitfish.png'),
//   ...
// };
