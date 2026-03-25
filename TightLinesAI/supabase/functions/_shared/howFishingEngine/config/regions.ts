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
  "southwest_desert",
  "southwest_high_desert",
  "pacific_northwest",
  "southern_california",
  "mountain_alpine",
  "northern_california",
  "appalachian",
  "inland_northwest",
  "alaska",
  "hawaii",
];

/** Coastal temp tables exist for these regions only; others map to nearest for coastal scoring. */
export const COASTAL_TEMP_REGIONS: RegionKey[] = [
  "northeast",
  "southeast_atlantic",
  "florida",
  "gulf_coast",
  "pacific_northwest",
  "southern_california",
  "northern_california",
  "alaska",
  "hawaii",
];

export function coastalTempRegion(region: RegionKey): RegionKey {
  if (COASTAL_TEMP_REGIONS.includes(region)) return region;
  if (region === "great_lakes_upper_midwest" || region === "midwest_interior") return "northeast";
  if (region === "south_central" || region === "mountain_west") return "gulf_coast";
  if (region === "southwest_desert" || region === "southwest_high_desert") return "gulf_coast";
  if (region === "appalachian") return "southeast_atlantic";
  if (region === "inland_northwest") return "pacific_northwest";
  if (region === "mountain_alpine") return "pacific_northwest"; // alpine → nearest ocean coast
  if (region === "alaska" || region === "hawaii") return region;
  return "southern_california";
}
