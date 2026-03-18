// =============================================================================
// ENGINE V3 — State Bounding Boxes
// Source: 2017 US Census 1:500,000 shapefile (NAD83)
// Reference: https://anthonylouisdagostino.com/bounding-boxes-for-all-us-states/
// Format: lonMin (xmin), latMin (ymin), lonMax (xmax), latMax (ymax)
// =============================================================================

export interface StateBounds {
  state: string;
  lonMin: number;
  latMin: number;
  lonMax: number;
  latMax: number;
}

/**
 * State bounding boxes from US Census Bureau 2017 1:500,000 shapefile.
 * Ordered by approximate area (smallest first) so overlapping boxes
 * resolve correctly — e.g. DC before MD, RI before MA.
 */
export const STATE_BOUNDS: StateBounds[] = [
  { state: 'DC', lonMin: -77.119759, latMin: 38.791645, lonMax: -76.909395, latMax: 38.99511 },
  { state: 'RI', lonMin: -71.862772, latMin: 41.146339, lonMax: -71.12057, latMax: 42.018798 },
  { state: 'DE', lonMin: -75.788658, latMin: 38.451013, lonMax: -75.048939, latMax: 39.839007 },
  { state: 'CT', lonMin: -73.727775, latMin: 40.980144, lonMax: -71.786994, latMax: 42.050587 },
  { state: 'NJ', lonMin: -75.559614, latMin: 38.928519, lonMax: -73.893979, latMax: 41.357423 },
  { state: 'NH', lonMin: -72.557247, latMin: 42.69699, lonMax: -70.610621, latMax: 45.305476 },
  { state: 'VT', lonMin: -73.43774, latMin: 42.726853, lonMax: -71.464555, latMax: 45.016659 },
  { state: 'MA', lonMin: -73.508142, latMin: 41.237964, lonMax: -69.928393, latMax: 42.886589 },
  { state: 'MD', lonMin: -79.487651, latMin: 37.911717, lonMax: -75.048939, latMax: 39.723043 },
  { state: 'SC', lonMin: -83.35391, latMin: 32.0346, lonMax: -78.54203, latMax: 35.215402 },
  { state: 'WV', lonMin: -82.644739, latMin: 37.201483, lonMax: -77.719519, latMax: 40.638801 },
  { state: 'ME', lonMin: -71.083924, latMin: 42.977764, lonMax: -66.949895, latMax: 47.459686 },
  { state: 'IN', lonMin: -88.09776, latMin: 37.771742, lonMax: -84.784579, latMax: 41.760592 },
  { state: 'KY', lonMin: -89.571509, latMin: 36.497129, lonMax: -81.964971, latMax: 39.147458 },
  { state: 'OH', lonMin: -84.820159, latMin: 38.403202, lonMax: -80.518693, latMax: 41.977523 },
  { state: 'VA', lonMin: -83.675395, latMin: 36.540738, lonMax: -75.242266, latMax: 39.466012 },
  { state: 'TN', lonMin: -90.310298, latMin: 34.982972, lonMax: -81.6469, latMax: 36.678118 },
  { state: 'NC', lonMin: -84.321869, latMin: 33.842316, lonMax: -75.460621, latMax: 36.588117 },
  { state: 'MS', lonMin: -91.655009, latMin: 30.173943, lonMax: -88.097888, latMax: 34.996052 },
  { state: 'AR', lonMin: -94.617919, latMin: 33.004106, lonMax: -89.644395, latMax: 36.4996 },
  { state: 'AL', lonMin: -88.473227, latMin: 30.223334, lonMax: -84.88908, latMax: 35.008028 },
  { state: 'LA', lonMin: -94.043147, latMin: 28.928609, lonMax: -88.817017, latMax: 33.019457 },
  { state: 'GA', lonMin: -85.605165, latMin: 30.357851, lonMax: -80.839729, latMax: 35.000659 },
  { state: 'WI', lonMin: -92.888114, latMin: 42.491983, lonMax: -86.805415, latMax: 47.080621 },
  { state: 'FL', lonMin: -87.634938, latMin: 24.523096, lonMax: -80.031362, latMax: 31.000888 },
  { state: 'IL', lonMin: -91.513079, latMin: 36.970298, lonMax: -87.494756, latMax: 42.508481 },
  { state: 'IA', lonMin: -96.639704, latMin: 40.375501, lonMax: -90.140061, latMax: 43.501196 },
  { state: 'NY', lonMin: -79.762152, latMin: 40.496103, lonMax: -71.856214, latMax: 45.01585 },
  { state: 'PA', lonMin: -80.519891, latMin: 39.7198, lonMax: -74.689516, latMax: 42.26986 },
  { state: 'MI', lonMin: -90.418136, latMin: 41.696118, lonMax: -82.413474, latMax: 48.2388 },
  { state: 'OK', lonMin: -103.002565, latMin: 33.615833, lonMax: -94.430662, latMax: 37.002206 },
  { state: 'MO', lonMin: -95.774704, latMin: 35.995683, lonMax: -89.098843, latMax: 40.61364 },
  { state: 'NE', lonMin: -104.053514, latMin: 39.999998, lonMax: -95.30829, latMax: 43.001708 },
  { state: 'KS', lonMin: -102.051744, latMin: 36.993016, lonMax: -94.588413, latMax: 40.003162 },
  { state: 'SD', lonMin: -104.057698, latMin: 42.479635, lonMax: -96.436589, latMax: 45.94545 },
  { state: 'ND', lonMin: -104.0489, latMin: 45.935054, lonMax: -96.554507, latMax: 49.000574 },
  { state: 'MN', lonMin: -97.239209, latMin: 43.499356, lonMax: -89.491739, latMax: 49.384358 },
  { state: 'CO', lonMin: -109.060253, latMin: 36.992426, lonMax: -102.041524, latMax: 41.003444 },
  { state: 'WY', lonMin: -111.056888, latMin: 40.994746, lonMax: -104.05216, latMax: 45.005904 },
  { state: 'MT', lonMin: -116.050003, latMin: 44.358221, lonMax: -104.039138, latMax: 49.00139 },
  { state: 'NM', lonMin: -109.050173, latMin: 31.332301, lonMax: -103.001964, latMax: 37.000232 },
  { state: 'AZ', lonMin: -114.81651, latMin: 31.332177, lonMax: -109.045223, latMax: 37.00426 },
  { state: 'UT', lonMin: -114.052962, latMin: 36.997968, lonMax: -109.041058, latMax: 42.001567 },
  { state: 'NV', lonMin: -120.005746, latMin: 35.001857, lonMax: -114.039648, latMax: 42.002207 },
  { state: 'ID', lonMin: -117.243027, latMin: 41.988057, lonMax: -111.043564, latMax: 49.001146 },
  { state: 'OR', lonMin: -124.566244, latMin: 41.991794, lonMax: -116.463504, latMax: 46.292035 },
  { state: 'WA', lonMin: -124.763068, latMin: 45.543541, lonMax: -116.915989, latMax: 49.002494 },
  { state: 'CA', lonMin: -124.409591, latMin: 32.534156, lonMax: -114.131211, latMax: 42.009518 },
  { state: 'TX', lonMin: -106.645646, latMin: 25.837377, lonMax: -93.508292, latMax: 36.500704 },
  { state: 'HI', lonMin: -178.334698, latMin: 18.910361, lonMax: -154.806773, latMax: 28.402123 },
  { state: 'AK', lonMin: -179.148909, latMin: 51.214183, lonMax: 179.77847, latMax: 71.365162 },
];

export function isPointInBounds(lat: number, lon: number, b: StateBounds): boolean {
  if (b.state === 'AK') {
    // Alaska spans the dateline: mainland ~-180 to -130, Aleutians ~170 to 180
    const inLat = lat >= b.latMin && lat <= b.latMax;
    const inLonWest = lon >= -180 && lon <= -130;
    const inLonEast = lon >= 170 && lon <= 180;
    return inLat && (inLonWest || inLonEast);
  }
  return lat >= b.latMin && lat <= b.latMax && lon >= b.lonMin && lon <= b.lonMax;
}

export function resolveStateFromCoords(lat: number, lon: number): string | null {
  if (lat < 24 || lat > 72 || lon < -180 || lon > 180) return null;
  for (const b of STATE_BOUNDS) {
    if (isPointInBounds(lat, lon, b)) return b.state;
  }
  return null;
}
