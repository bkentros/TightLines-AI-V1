/** Recommender field-guide artwork. Shared Color Match subjects and new pattern-specific illustrations. */

const FLY_IMAGES: Partial<Record<string, ReturnType<typeof require>>> = {
  // ── Baitfish streamers ────────────────────────────────────────────────────
  clouser_minnow: require('../assets/images/recommender/illustrated/clouser_minnow.png'),
  deceiver: require('../assets/images/recommender/illustrated/deceiver.png'),
  bucktail_baitfish_streamer: require('../assets/images/color-picker/illustrated/streamer.png'),
  slim_minnow_streamer: require('../assets/images/recommender/illustrated/slim_minnow_streamer.png'),
  articulated_baitfish_streamer: require('../assets/images/recommender/illustrated/articulated_baitfish_streamer.png'),

  // ── Articulated streamers ─────────────────────────────────────────────────
  articulated_dungeon_streamer: require('../assets/images/recommender/illustrated/articulated_dungeon_streamer.png'),
  game_changer: require('../assets/images/recommender/illustrated/game_changer.png'),

  // ── Bugger / leech ────────────────────────────────────────────────────────
  woolly_bugger: require('../assets/images/recommender/illustrated/woolly_bugger.png'),
  rabbit_strip_leech: require('../assets/images/recommender/illustrated/rabbit_strip_leech.png'),
  jighead_marabou_leech: require('../assets/images/recommender/illustrated/jighead_marabou_leech.png'),
  lead_eye_leech: require('../assets/images/recommender/illustrated/lead_eye_leech.png'),
  feather_jig_leech: require('../assets/images/recommender/illustrated/feather_jig_leech.png'),
  balanced_leech: require('../assets/images/recommender/illustrated/balanced_leech.png'),
  zonker_streamer: require('../assets/images/recommender/illustrated/zonker_streamer.png'),

  // ── Bottom streamers ──────────────────────────────────────────────────────
  sculpin_streamer: require('../assets/images/recommender/illustrated/sculpin_streamer.png'),
  sculpzilla: require('../assets/images/recommender/illustrated/sculpzilla.png'),
  muddler_sculpin: require('../assets/images/recommender/illustrated/muddler_sculpin.png'),
  crawfish_streamer: require('../assets/images/recommender/illustrated/crawfish_streamer.png'),
  warmwater_crawfish_fly: require('../assets/images/recommender/illustrated/warmwater_crawfish_fly.png'),
  warmwater_worm_fly: require('../assets/images/recommender/illustrated/warmwater_worm_fly.png'),
  conehead_streamer: require('../assets/images/recommender/illustrated/conehead_streamer.png'),

  // ── Pike streamers ────────────────────────────────────────────────────────
  pike_bunny_streamer: require('../assets/images/recommender/illustrated/pike_bunny_streamer.png'),
  large_articulated_pike_streamer: require('../assets/images/recommender/illustrated/large_articulated_pike_streamer.png'),
  unweighted_baitfish_streamer: require('../assets/images/recommender/illustrated/unweighted_baitfish_streamer.png'),
  baitfish_slider_fly: require('../assets/images/recommender/illustrated/baitfish_slider_fly.png'),
  bluegill_streamer: require('../assets/images/recommender/illustrated/bluegill_streamer.png'),

  // ── Surface flies ─────────────────────────────────────────────────────────
  popper_fly: require('../assets/images/color-picker/illustrated/fly_popper.png'),
  deer_hair_slider: require('../assets/images/recommender/illustrated/deer_hair_slider.png'),
  foam_gurgler_fly: require('../assets/images/recommender/illustrated/foam_gurgler_fly.png'),
  frog_fly: require('../assets/images/recommender/illustrated/frog_fly.png'),
  mouse_fly: require('../assets/images/recommender/illustrated/mouse_fly.png'),
  pike_flash_fly: require('../assets/images/recommender/illustrated/pike_flash_fly.png'),
};

/** Returns the image for a fly archetype, or null if not yet available. */
export function getFlyImage(
  archetypeId: string,
): ReturnType<typeof require> | null {
  return FLY_IMAGES[archetypeId] ?? null;
}

/** All fly images as an array for bulk preloading. */
export const ALL_FLY_IMAGES = Object.values(FLY_IMAGES) as ReturnType<typeof require>[];
