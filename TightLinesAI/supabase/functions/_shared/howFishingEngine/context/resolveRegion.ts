/**
 * Location → state + canonical region (master plan geofencing).
 * Isolated from env payload mapping — no legacy engine imports.
 */

import { resolveStateFromCoords } from "./usStateBounds.ts";
import { regionKeyFromLatLon, regionKeyFromState } from "../config/stateToRegion.ts";
import type { RegionKey } from "../contracts/mod.ts";

export type ResolvedRegion = {
  state_code: string | null;
  region_key: RegionKey;
};

export function resolveRegionForCoordinates(
  latitude: number,
  longitude: number
): ResolvedRegion {
  const state_code = resolveStateFromCoords(latitude, longitude);
  // lat/lon is the primary precision layer — always use it when coordinates exist.
  // regionKeyFromState is the last-resort fallback only when coordinates fail entirely.
  const region_key =
    regionKeyFromLatLon(latitude, longitude) ?? regionKeyFromState(state_code) ?? "midwest_interior";
  return { state_code, region_key };
}
