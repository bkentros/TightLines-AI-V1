// =============================================================================
// Coastal Proximity Check
//
// Determines whether a user's location is close enough to a US ocean coastline
// to offer saltwater/brackish water type options.
//
// Rules:
// - If >50 miles from any ocean coastline → freshwater only
// - Great Lakes shoreline = freshwater only (not coastal)
// - If within 50 miles of ocean coast → freshwater + saltwater + brackish
//
// Uses simplified coastal bounding zones (not precise coastline geometry).
// This is a frontend-level filter — the engine still accepts any valid mode.
// =============================================================================

type WaterTypeOption = 'freshwater' | 'saltwater' | 'brackish';

interface CoastalZone {
  label: string;
  // Bounding box: [minLat, maxLat, minLon, maxLon]
  bounds: [number, number, number, number];
}

// Simplified US ocean coastal zones — areas within ~50 miles of ocean shoreline.
// These are generous bounding boxes around coastal regions.
// Great Lakes are intentionally EXCLUDED (freshwater only).
const OCEAN_COASTAL_ZONES: CoastalZone[] = [
  // Atlantic Coast — Maine to Florida
  { label: 'Maine coast', bounds: [43.0, 47.5, -71.0, -66.5] },
  { label: 'New England coast', bounds: [41.0, 43.0, -72.0, -69.5] },
  { label: 'NY/NJ coast', bounds: [38.8, 41.2, -75.0, -71.5] },
  { label: 'Mid-Atlantic coast', bounds: [36.5, 39.5, -77.0, -74.5] },
  { label: 'NC coast', bounds: [33.5, 36.6, -78.5, -75.0] },
  { label: 'SC/GA coast', bounds: [30.5, 33.5, -82.0, -79.0] },
  { label: 'FL Atlantic coast', bounds: [25.0, 30.5, -81.5, -79.5] },

  // Gulf Coast — Florida panhandle to Texas
  { label: 'FL Gulf coast', bounds: [24.5, 30.5, -87.5, -80.0] },
  { label: 'AL/MS Gulf coast', bounds: [29.5, 31.0, -89.5, -87.0] },
  { label: 'LA Gulf coast', bounds: [28.5, 30.5, -94.0, -89.0] },
  { label: 'TX Gulf coast', bounds: [25.5, 30.0, -97.5, -93.5] },

  // Pacific Coast — California to Washington
  { label: 'Southern CA coast', bounds: [32.5, 34.5, -120.5, -116.5] },
  { label: 'Central CA coast', bounds: [34.5, 38.0, -123.5, -120.0] },
  { label: 'Northern CA coast', bounds: [38.0, 42.0, -125.0, -122.0] },
  { label: 'OR coast', bounds: [42.0, 46.3, -125.0, -122.5] },
  { label: 'WA coast', bounds: [46.0, 49.0, -125.5, -122.0] },

  // Hawaii
  { label: 'Hawaii', bounds: [18.5, 22.5, -161.0, -154.5] },

  // Alaska (simplified — major coastal areas)
  { label: 'SE Alaska', bounds: [54.5, 60.5, -140.0, -130.0] },
  { label: 'South-Central Alaska', bounds: [58.0, 62.0, -155.0, -140.0] },
];

/**
 * Check if a lat/lon falls within any ocean coastal zone.
 */
function isNearOceanCoast(lat: number, lon: number): boolean {
  for (const zone of OCEAN_COASTAL_ZONES) {
    const [minLat, maxLat, minLon, maxLon] = zone.bounds;
    if (lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon) {
      return true;
    }
  }
  return false;
}

/**
 * Returns the available water type options for a given location.
 *
 * - Inland locations (>50mi from ocean coast): ['freshwater']
 * - Coastal locations: ['freshwater', 'saltwater', 'brackish']
 *
 * Great Lakes shoreline is treated as freshwater-only.
 */
export function getAvailableWaterTypes(lat: number, lon: number): WaterTypeOption[] {
  if (isNearOceanCoast(lat, lon)) {
    return ['freshwater', 'saltwater', 'brackish'];
  }
  return ['freshwater'];
}

/**
 * Quick boolean check: should saltwater/brackish options be shown?
 */
export function isCoastalLocation(lat: number, lon: number): boolean {
  return isNearOceanCoast(lat, lon);
}

/** True when user may select Coastal (ocean-adjacent) engine context. */
export function isCoastalContextEligible(lat: number, lon: number): boolean {
  return isNearOceanCoast(lat, lon);
}
