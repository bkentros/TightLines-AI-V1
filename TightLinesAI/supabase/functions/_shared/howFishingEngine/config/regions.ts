import type { RegionKey } from "../contracts/region.ts";

export const CANONICAL_REGIONS: RegionKey[] = [
  "northeast",
  "southeast_atlantic",
  "florida",
  "gulf_coast",
  "great_lakes_upper_midwest",
  "midwest_interior",
  "south_central",
  "mountain_west",
  "southwest",
  "pacific_coast",
];

/** Coastal temp tables exist for these regions only; others map to nearest for coastal scoring. */
export const COASTAL_TEMP_REGIONS: RegionKey[] = [
  "northeast",
  "southeast_atlantic",
  "florida",
  "gulf_coast",
  "pacific_coast",
];

export function coastalTempRegion(region: RegionKey): RegionKey {
  if (COASTAL_TEMP_REGIONS.includes(region)) return region;
  if (region === "great_lakes_upper_midwest" || region === "midwest_interior") return "northeast";
  if (region === "south_central" || region === "mountain_west" || region === "southwest") return "gulf_coast";
  return "pacific_coast";
}
