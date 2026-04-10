/**
 * flyImages.ts
 *
 * Maps fly archetype IDs → local image assets.
 * Images live in: assets/images/flies/
 * All images are 512×512 RGBA PNG with transparent background.
 *
 * NOTE: woolly_bugger is not yet available — add its image to
 * assets/images/flies/woolly_bugger.png and uncomment the line below.
 */

const FLY_IMAGES: Partial<Record<string, ReturnType<typeof require>>> = {
  // ── Baitfish streamers ────────────────────────────────────────────────────
  clouser_minnow:                   require('../assets/images/flies/clouser_minnow.png'),
  deceiver:                         require('../assets/images/flies/deceiver.png'),
  bucktail_baitfish_streamer:       require('../assets/images/flies/bucktail_baitfish_streamer.png'),
  slim_minnow_streamer:             require('../assets/images/flies/slim_minnow_streamer.png'),
  articulated_baitfish_streamer:    require('../assets/images/flies/articulated_baitfish_streamer.png'),

  // ── Articulated streamers ─────────────────────────────────────────────────
  articulated_dungeon_streamer:     require('../assets/images/flies/articulated_dungeon_streamer.png'),
  game_changer:                     require('../assets/images/flies/game_changer.png'),

  // ── Bugger / leech ────────────────────────────────────────────────────────
  // woolly_bugger:                 require('../assets/images/flies/woolly_bugger.png'),  // image pending
  rabbit_strip_leech:               require('../assets/images/flies/rabbit_strip_leech.png'),
  balanced_leech:                   require('../assets/images/flies/balanced_leech.png'),
  zonker_streamer:                  require('../assets/images/flies/zonker_streamer.png'),

  // ── Bottom streamers ──────────────────────────────────────────────────────
  sculpin_streamer:                 require('../assets/images/flies/sculpin_streamer.png'),
  sculpzilla:                       require('../assets/images/flies/sculpzilla.png'),
  muddler_sculpin:                  require('../assets/images/flies/muddler_sculpin.png'),
  crawfish_streamer:                require('../assets/images/flies/crawfish_streamer.png'),
  conehead_streamer:                require('../assets/images/flies/conehead_streamer.png'),

  // ── Pike streamers ────────────────────────────────────────────────────────
  pike_bunny_streamer:              require('../assets/images/flies/pike_bunny_streamer.png'),
  large_articulated_pike_streamer:  require('../assets/images/flies/large_articulated_pike_streamer.png'),

  // ── Surface flies ─────────────────────────────────────────────────────────
  popper_fly:                       require('../assets/images/flies/popper_fly.png'),
  frog_fly:                         require('../assets/images/flies/frog_fly.png'),
  mouse_fly:                        require('../assets/images/flies/mouse_fly.png'),
};

/** Returns the image for a fly archetype, or null if not yet available. */
export function getFlyImage(
  archetypeId: string,
): ReturnType<typeof require> | null {
  return FLY_IMAGES[archetypeId] ?? null;
}

/** All fly images as an array for bulk preloading. */
export const ALL_FLY_IMAGES = Object.values(FLY_IMAGES) as ReturnType<typeof require>[];
