/**
 * Stable semantic IDs for lure and fly families.
 * These IDs are the bridge to future tackle-box inventory matching.
 * Never use numeric keys — these must remain stable across versions.
 */

export const LURE_FAMILY_IDS = [
  "jig",
  "soft_swimbait",
  "soft_stickworm",
  "soft_craw",
  "lipless_crankbait",
  "diving_crankbait",
  "jerkbait",
  "spinnerbait",
  "topwater_popper",
  "topwater_walker",
  "topwater_frog",
  "shrimp_crab_plastic",
  "large_profile_swimbait",
  "casting_spoon",
] as const;

export type LureFamilyId = (typeof LURE_FAMILY_IDS)[number];

export const FLY_FAMILY_IDS = [
  "streamer_baitfish",
  "streamer_articulated",
  "topwater_popper_fly",
  "slider_diver_fly",
  "shrimp_fly",
  "crab_fly",
  "leech_worm_fly",
] as const;

export type FlyFamilyId = (typeof FLY_FAMILY_IDS)[number];

export type GearMode = "lure" | "fly";
