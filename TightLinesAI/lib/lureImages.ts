/**
 * lureImages.ts
 *
 * Maps lure archetype IDs → local image assets.
 * Images live in: assets/images/lures/
 */

const LURE_IMAGES: Partial<Record<string, ReturnType<typeof require>>> = {
  // ── Stick worms ───────────────────────────────────────────────────────────
  weightless_stick_worm:            require('../assets/images/lures/weightless_stick_worm.png'),
  wacky_rigged_stick_worm:          require('../assets/images/lures/wacky_rigged_stick_worm.png'),
  texas_rigged_stick_worm:          require('../assets/images/lures/texas_rigged_stick_worm.png'),
  carolina_rigged_stick_worm:       require('../assets/images/lures/carolina_rigged_stick_worm.png'),

  // ── Finesse soft plastics ─────────────────────────────────────────────────
  shaky_head_worm:                  require('../assets/images/lures/shaky_head_worm.png'),
  drop_shot_worm:                   require('../assets/images/lures/drop_shot_worm.png'),
  drop_shot_minnow:                 require('../assets/images/lures/drop_shot_minnow.png'),
  ned_rig:                          require('../assets/images/lures/ned_rig.png'),

  // ── Jigs ──────────────────────────────────────────────────────────────────
  tube_jig:                         require('../assets/images/lures/tube_jig.png'),
  texas_rigged_soft_plastic_craw:   require('../assets/images/lures/texas_rigged_soft_plastic_craw.png'),
  football_jig:                     require('../assets/images/lures/football_jig.png'),
  compact_flipping_jig:             require('../assets/images/lures/compact_flipping_jig.png'),
  finesse_jig:                      require('../assets/images/lures/finesse_jig.png'),
  swim_jig:                         require('../assets/images/lures/swim_jig.png'),
  hair_jig:                         require('../assets/images/lures/hair_jig.png'),

  // ── Spinners & bladed ─────────────────────────────────────────────────────
  inline_spinner:                   require('../assets/images/lures/inline_spinner.png'),
  spinnerbait:                      require('../assets/images/lures/spinnerbait.png'),
  bladed_jig:                       require('../assets/images/lures/bladed_jig.png'),

  // ── Swimbaits & jerkbaits ─────────────────────────────────────────────────
  paddle_tail_swimbait:             require('../assets/images/lures/paddle_tail_swimbait.png'),
  soft_jerkbait:                    require('../assets/images/lures/soft_jerkbait.png'),
  suspending_jerkbait:              require('../assets/images/lures/suspending_jerkbait.png'),

  // ── Crankbaits ────────────────────────────────────────────────────────────
  squarebill_crankbait:             require('../assets/images/lures/squarebill_crankbait.png'),
  flat_sided_crankbait:             require('../assets/images/lures/flat_sided_crankbait.png'),
  medium_diving_crankbait:          require('../assets/images/lures/medium_diving_crankbait.png'),
  deep_diving_crankbait:            require('../assets/images/lures/deep_diving_crankbait.png'),
  lipless_crankbait:                require('../assets/images/lures/lipless_crankbait.png'),

  // ── Metal / spoons ────────────────────────────────────────────────────────
  blade_bait:                       require('../assets/images/lures/blade_bait.png'),
  casting_spoon:                    require('../assets/images/lures/casting_spoon.png'),

  // ── Topwater ──────────────────────────────────────────────────────────────
  walking_topwater:                 require('../assets/images/lures/walking_topwater.png'),
  popping_topwater:                 require('../assets/images/lures/popping_topwater.png'),
  buzzbait:                         require('../assets/images/lures/buzzbait.png'),
  prop_bait:                        require('../assets/images/lures/prop_bait.png'),
  hollow_body_frog:                 require('../assets/images/lures/hollow_body_frog.png'),

  // ── Pike / musky ──────────────────────────────────────────────────────────
  large_profile_pike_swimbait:      require('../assets/images/lures/large_profile_pike_swimbait.png'),
  pike_jerkbait:                    require('../assets/images/lures/pike_jerkbait.png'),
};

/** Returns the image for a lure archetype, or null if not yet available. */
export function getLureImage(
  archetypeId: string,
): ReturnType<typeof require> | null {
  return LURE_IMAGES[archetypeId] ?? null;
}

/** All lure images as an array for bulk preloading. */
export const ALL_LURE_IMAGES = Object.values(LURE_IMAGES) as ReturnType<typeof require>[];
