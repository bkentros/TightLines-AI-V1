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
  const region_key =
    regionKeyFromState(state_code) ?? regionKeyFromLatLon(latitude, longitude);
  return { state_code, region_key };
}
