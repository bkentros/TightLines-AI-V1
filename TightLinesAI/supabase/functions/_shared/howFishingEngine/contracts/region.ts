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
  // Altitude/latitude-derived sub-regions (override base state mapping when conditions met)
  "mountain_alpine",       // >5,500ft in mountain states — alpine trout/kokanee calibration
  "northern_california",   // CA lat>37.5°N — NorCal inland/foothill + coast, distinct from SoCal
  /** WV + Appalachian highlands — cooler seasonal bands than south_central lowlands */
  "appalachian",
  /** OR/WA east of Cascades + similar inland NW — continental steppe / canyon vs maritime PNW */
  "inland_northwest",
  /** Alaska — cold maritime / interior baselines; state AK → never lat/lon default */
  "alaska",
  /** Hawaii — tropical marine; state HI → never lat/lon default */
  "hawaii",
] as const;

export type RegionKey = (typeof CANONICAL_REGION_KEYS)[number];

export function isRegionKey(x: string): x is RegionKey {
  return (CANONICAL_REGION_KEYS as readonly string[]).includes(x);
}
