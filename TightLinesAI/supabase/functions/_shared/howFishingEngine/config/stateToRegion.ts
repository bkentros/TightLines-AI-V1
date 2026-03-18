import type { RegionKey } from "../contracts/region.ts";

export const STATE_TO_REGION: Record<string, RegionKey> = {
  ME: "northeast",
  NH: "northeast",
  VT: "northeast",
  MA: "northeast",
  RI: "northeast",
  CT: "northeast",
  NY: "northeast",
  NJ: "northeast",
  PA: "northeast",
  DE: "southeast_atlantic",
  MD: "southeast_atlantic",
  VA: "southeast_atlantic",
  NC: "southeast_atlantic",
  SC: "southeast_atlantic",
  GA: "southeast_atlantic",
  FL: "florida",
  AL: "gulf_coast",
  MS: "gulf_coast",
  LA: "gulf_coast",
  TX: "gulf_coast",
  OH: "great_lakes_upper_midwest",
  MI: "great_lakes_upper_midwest",
  IN: "great_lakes_upper_midwest",
  IL: "great_lakes_upper_midwest",
  WI: "great_lakes_upper_midwest",
  MN: "great_lakes_upper_midwest",
  IA: "midwest_interior",
  MO: "midwest_interior",
  KS: "midwest_interior",
  NE: "midwest_interior",
  SD: "midwest_interior",
  ND: "midwest_interior",
  WV: "south_central",
  KY: "south_central",
  TN: "south_central",
  AR: "south_central",
  OK: "south_central",
  MT: "mountain_west",
  WY: "mountain_west",
  CO: "mountain_west",
  UT: "mountain_west",
  ID: "mountain_west",
  AZ: "southwest",
  NM: "southwest",
  NV: "southwest",
  CA: "pacific_coast",
  OR: "pacific_coast",
  WA: "pacific_coast",
};

export function regionKeyFromState(state: string | null): RegionKey | null {
  if (!state) return null;
  const k = state.toUpperCase();
  return STATE_TO_REGION[k] ?? null;
}

/** Bounding-box fallback when state is unknown (US mainland approximation). */
export function regionKeyFromLatLon(lat: number, lon: number): RegionKey {
  if (lat >= 24 && lat <= 31.5 && lon >= -98 && lon <= -79.5) return "gulf_coast";
  if (lat >= 24.5 && lat <= 31 && lon >= -87.5 && lon <= -80) return "florida";
  if (lat >= 30 && lat <= 36.5 && lon >= -82 && lon <= -75) return "southeast_atlantic";
  if (lat >= 41 && lat <= 47.5 && lon >= -77 && lon <= -66) return "northeast";
  if (lat >= 40 && lat <= 49 && lon >= -97 && lon <= -76) return "great_lakes_upper_midwest";
  if (lat >= 35 && lat <= 40 && lon >= -95 && lon <= -80) return "midwest_interior";
  if (lat >= 33 && lat <= 37 && lon >= -103 && lon <= -88) return "south_central";
  if (lat >= 37 && lat <= 49 && lon >= -125 && lon <= -104) return "mountain_west";
  if (lat >= 31 && lat <= 37 && lon >= -115 && lon <= -103) return "southwest";
  if (lat >= 32 && lat <= 49 && lon >= -125 && lon <= -116) return "pacific_coast";
  return "midwest_interior";
}
