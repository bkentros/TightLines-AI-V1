/** Recommender field-guide artwork. Shared Color Match subjects and new pattern-specific illustrations. */

const LURE_IMAGES: Partial<Record<string, ReturnType<typeof require>>> = {
  // ── Stick worms ───────────────────────────────────────────────────────────
  weightless_stick_worm: require('../assets/images/color-picker/illustrated/soft_plastic_worm.png'),
  carolina_rigged_stick_worm: require('../assets/images/recommender/illustrated/carolina_rigged_stick_worm.png'),

  // ── Finesse soft plastics ─────────────────────────────────────────────────
  shaky_head_worm: require('../assets/images/recommender/illustrated/shaky_head_worm.png'),
  magnum_worm: require('../assets/images/recommender/illustrated/magnum_worm.png'),
  drop_shot_worm: require('../assets/images/recommender/illustrated/drop_shot_worm.png'),
  drop_shot_minnow: require('../assets/images/recommender/illustrated/drop_shot_minnow.png'),
  ned_rig: require('../assets/images/recommender/illustrated/ned_rig.png'),

  // ── Jigs ──────────────────────────────────────────────────────────────────
  tube_jig: require('../assets/images/recommender/illustrated/tube_jig.png'),
  big_smallmouth_tube: require('../assets/images/recommender/illustrated/big_smallmouth_tube.png'),
  texas_rigged_soft_plastic_craw: require('../assets/images/recommender/illustrated/texas_rigged_soft_plastic_craw.png'),
  football_jig: require('../assets/images/recommender/illustrated/football_jig.png'),
  compact_flipping_jig: require('../assets/images/recommender/illustrated/compact_flipping_jig.png'),
  finesse_jig: require('../assets/images/recommender/illustrated/finesse_jig.png'),
  swim_jig: require('../assets/images/recommender/illustrated/swim_jig.png'),
  hair_jig: require('../assets/images/color-picker/illustrated/hair_jig.png'),

  // ── Spinners & bladed ─────────────────────────────────────────────────────
  inline_spinner: require('../assets/images/color-picker/illustrated/inline_spinner.png'),
  spinnerbait: require('../assets/images/color-picker/illustrated/spinnerbait.png'),
  bladed_jig: require('../assets/images/color-picker/illustrated/bladed_jig.png'),

  // ── Swimbaits & jerkbaits ─────────────────────────────────────────────────
  paddle_tail_swimbait: require('../assets/images/color-picker/illustrated/paddle_tail_swimbait.png'),
  glidebait: require('../assets/images/color-picker/illustrated/hard_swimbait.png'),
  compact_glidebait: require('../assets/images/recommender/illustrated/compact_glidebait.png'),
  soft_jerkbait: require('../assets/images/color-picker/illustrated/soft_jerkbait.png'),
  suspending_jerkbait: require('../assets/images/color-picker/illustrated/hard_jerkbait.png'),
  magnum_jerkbait: require('../assets/images/recommender/illustrated/magnum_jerkbait.png'),

  // ── Crankbaits ────────────────────────────────────────────────────────────
  squarebill_crankbait: require('../assets/images/recommender/illustrated/squarebill_crankbait.png'),
  flat_sided_crankbait: require('../assets/images/recommender/illustrated/flat_sided_crankbait.png'),
  medium_diving_crankbait: require('../assets/images/color-picker/illustrated/crankbait.png'),
  deep_diving_crankbait: require('../assets/images/recommender/illustrated/deep_diving_crankbait.png'),
  lipless_crankbait: require('../assets/images/color-picker/illustrated/lipless_crankbait.png'),

  // ── Metal / spoons ────────────────────────────────────────────────────────
  blade_bait: require('../assets/images/recommender/illustrated/blade_bait.png'),
  casting_spoon: require('../assets/images/color-picker/illustrated/spoon.png'),
  small_floating_trout_plug: require('../assets/images/recommender/illustrated/small_floating_trout_plug.png'),

  // ── Topwater ──────────────────────────────────────────────────────────────
  walking_topwater: require('../assets/images/color-picker/illustrated/topwater.png'),
  popping_topwater: require('../assets/images/recommender/illustrated/popping_topwater.png'),
  buzzbait: require('../assets/images/color-picker/illustrated/buzzbait.png'),
  prop_bait: require('../assets/images/recommender/illustrated/prop_bait.png'),
  hollow_body_frog: require('../assets/images/color-picker/illustrated/hollow_frog.png'),
  wake_bait: require('../assets/images/recommender/illustrated/wake_bait.png'),

  // ── Pike / musky ──────────────────────────────────────────────────────────
  pike_spinnerbait: require('../assets/images/recommender/illustrated/pike_spinnerbait.png'),
  weedless_spoon: require('../assets/images/recommender/illustrated/weedless_spoon.png'),
  shallow_minnowbait: require('../assets/images/recommender/illustrated/shallow_minnowbait.png'),
  pike_glidebait: require('../assets/images/recommender/illustrated/pike_glidebait.png'),
  large_profile_pike_swimbait: require('../assets/images/recommender/illustrated/large_profile_pike_swimbait.png'),
  pike_jerkbait: require('../assets/images/recommender/illustrated/pike_jerkbait.png'),
  large_bucktail_spinner: require('../assets/images/recommender/illustrated/large_bucktail_spinner.png'),
  large_pike_topwater: require('../assets/images/recommender/illustrated/large_pike_topwater.png'),
  pike_jig_and_plastic: require('../assets/images/recommender/illustrated/pike_jig_and_plastic.png'),
  large_pike_tube: require('../assets/images/recommender/illustrated/large_pike_tube.png'),
};

/** Returns the image for a lure archetype, or null if not yet available. */
export function getLureImage(
  archetypeId: string,
): ReturnType<typeof require> | null {
  return LURE_IMAGES[archetypeId] ?? null;
}

/** All lure images as an array for bulk preloading. */
export const ALL_LURE_IMAGES = Object.values(LURE_IMAGES) as ReturnType<typeof require>[];
