/**
 * Canonical US region keys — ENGINE_REBUILD_MASTER_PLAN § Region system
 */

export const CANONICAL_REGION_KEYS = [
  "northeast",
  "southeast_atlantic",
  "florida",
  "gulf_coast",
  "great_lakes_upper_midwest",
  "midwest_interior",
  "south_central",
  "mountain_west",
  "southwest_desert",
  "southwest_high_desert",
  "pacific_northwest",
  "southern_california",
] as const;

export type RegionKey = (typeof CANONICAL_REGION_KEYS)[number];

export function isRegionKey(x: string): x is RegionKey {
  return (CANONICAL_REGION_KEYS as readonly string[]).includes(x);
}
