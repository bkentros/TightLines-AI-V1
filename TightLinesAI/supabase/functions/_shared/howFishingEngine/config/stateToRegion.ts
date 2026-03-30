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
  TX: "south_central",           // lat/lon overrides for gulf coast TX and west TX desert
  OH: "midwest_interior",        // lat/lon overrides for northern OH (great_lakes)
  MI: "great_lakes_upper_midwest",
  IN: "midwest_interior",        // lat/lon overrides for northern IN (great_lakes)
  IL: "great_lakes_upper_midwest",
  WI: "great_lakes_upper_midwest",
  MN: "great_lakes_upper_midwest",
  IA: "midwest_interior",
  MO: "midwest_interior",
  KS: "midwest_interior",
  NE: "midwest_interior",
  SD: "midwest_interior",
  ND: "midwest_interior",
  WV: "appalachian",
  KY: "south_central",
  TN: "south_central",
  AR: "south_central",
  OK: "south_central",
  MT: "mountain_west",           // lat/lon overrides for eastern plains MT (midwest_interior)
  WY: "mountain_west",
  CO: "mountain_west",
  UT: "mountain_west",
  ID: "mountain_west",
  AZ: "southwest_desert",
  NV: "southwest_desert",
  NM: "southwest_high_desert",
  CA: "northern_california",     // lat/lon overrides for SoCal (<37.5°N) and high alpine
  OR: "pacific_northwest",
  WA: "pacific_northwest",
  AK: "alaska",
  HI: "hawaii",
};

export function regionKeyFromState(state: string | null): RegionKey | null {
  if (!state) return null;
  const k = state.toUpperCase();
  return STATE_TO_REGION[k] ?? null;
}

/**
 * Precision lat/lon region resolver — comprehensive US geofencing.
 * Checks conditions in most-specific-first order to ensure correct routing.
 * Note: mountain_alpine requires elevation data — handled by buildFromEnvData override.
 * This function is the primary precision layer; regionKeyFromState is last-resort fallback.
 */
export function regionKeyFromLatLon(lat: number, lon: number): RegionKey {
  // ── Alaska and Hawaii (absolute geographic priority) ────────────────────────
  if (lat >= 54 && lon <= -130) return "alaska";
  if (lat >= 18.5 && lat <= 23 && lon >= -161 && lon <= -154) return "hawaii";

  // ── Pacific Coast regions (west of the Sierra/Cascades) ────────────────────

  // Pacific Northwest coast (WA coast, OR coast, western Cascades slope)
  if (lat >= 42 && lat <= 49 && lon >= -124.5 && lon <= -120.5) return "pacific_northwest";

  // Northern California (coast + inland corridor north of 37.5°N, west of Sierra/Tahoe divide)
  // East boundary at -120.5 keeps Sierra Nevada / Lake Tahoe in mountain_west territory
  if (lat >= 37.5 && lat <= 42 && lon >= -124.5 && lon < -120.5) return "northern_california";

  // Southern California (coast + inland south of 37.5°N, west of desert divide)
  if (lat >= 32.5 && lat <= 37.5 && lon >= -121 && lon <= -116) return "southern_california";

  // ── Interior Northwest ──────────────────────────────────────────────────────

  // Inland Northwest: eastern WA rain shadow, eastern OR, northern ID (east of Cascades)
  if (
    (lat >= 46 && lat <= 49 && lon > -120.5 && lon <= -114) ||
    (lat >= 43 && lat <= 46 && lon > -121 && lon <= -116.5)
  ) return "inland_northwest";

  // ── Montana splits (must come before generic mountain_west) ────────────────

  // Western Montana / Northern Rockies (west of Continental Divide ~113°W)
  if (lat >= 46 && lat <= 49 && lon >= -114 && lon <= -111.5) return "mountain_west";

  // Eastern Montana (Great Plains, east of divide — continental climate)
  if (lat >= 45 && lat <= 49 && lon > -111.5 && lon <= -104) return "midwest_interior";

  // ── Texas — three splits (most specific first) ──────────────────────────────

  // West TX: Trans-Pecos / Big Bend / El Paso desert (hot arid, elevation varies)
  // Extended west to -107 to include El Paso and the Trans-Pecos corridor
  if (lat >= 29 && lat <= 32.5 && lon >= -107 && lon <= -100.5) return "southwest_desert";

  // TX Panhandle / South Plains (cold continental winters, hot summers)
  if (lat >= 33 && lat <= 36.5 && lon >= -103 && lon <= -99.5) return "south_central";

  // Gulf Coast TX (coastal strip, Rio Grande Valley, South TX)
  if (lat >= 25.7 && lat <= 30.5 && lon >= -100 && lon <= -93.5) return "gulf_coast";

  // Central / East TX (Hill Country, Dallas, east TX piney woods — catches remaining TX)
  if (lat >= 29 && lat <= 34 && lon >= -100 && lon <= -93.5) return "south_central";

  // ── Southwest Desert and High Desert ───────────────────────────────────────

  // Southwest Desert (AZ, southern NV, low-elevation desert)
  if (lat >= 31 && lat <= 37 && lon >= -115 && lon <= -109) return "southwest_desert";

  // Southwest High Desert (NM, high-desert plateau)
  if (lat >= 31 && lat <= 37 && lon >= -109 && lon <= -103) return "southwest_high_desert";

  // ── Mountain West core ──────────────────────────────────────────────────────

  // Mountain West core (CO, UT, WY, southern ID, NV east of Sierra, Sierra Nevada east slope)
  // Extended west to -120.5 to capture Sierra Nevada/Tahoe zone (elevation override → mountain_alpine)
  if (lat >= 36 && lat <= 46 && lon >= -120.5 && lon <= -104) return "mountain_west";

  // ── Southeast / Gulf / Florida ─────────────────────────────────────────────

  // Florida (full peninsula — check before gulf_coast to avoid overlap)
  if (lat >= 24.5 && lat <= 31 && lon >= -87.5 && lon <= -79.5) return "florida";

  // Gulf Coast (coastal AL, MS, LA — narrow coastal band)
  if (lat >= 28.5 && lat <= 31.5 && lon >= -93.5 && lon <= -84) return "gulf_coast";

  // South Central (AR, OK, KY, TN, inland TX already caught above)
  if (lat >= 33 && lat <= 37.5 && lon >= -100 && lon <= -82.5) return "south_central";

  // Appalachian (WV, mountain highlands of VA/NC/TN — interior highlands)
  if (lat >= 36 && lat <= 39.5 && lon >= -83 && lon <= -78) return "appalachian";

  // Southeast Atlantic (GA, SC, NC, VA, DE, MD — coastal plain and piedmont)
  if (lat >= 30 && lat <= 38 && lon >= -84 && lon <= -74) return "southeast_atlantic";

  // ── Northern tier ───────────────────────────────────────────────────────────

  // Great Lakes / Upper Midwest (MI, WI, MN, northern OH/IN/IL)
  // Bounded to lat >= 41 to separate from southern OH/IN midwest_interior
  if (lat >= 41 && lat <= 49 && lon >= -97 && lon <= -76) return "great_lakes_upper_midwest";

  // Northeast (ME, NH, VT, MA, RI, CT, NY, NJ, northern PA)
  if (lat >= 40 && lat <= 47.5 && lon >= -80 && lon <= -66.5) return "northeast";

  // ── Broad interior fallback ─────────────────────────────────────────────────

  // Midwest Interior (IA, MO, KS, NE, SD, ND, southern OH/IN, IL interior)
  if (lat >= 36 && lat <= 49 && lon >= -104 && lon <= -80) return "midwest_interior";

  // Final default
  return "midwest_interior";
}
