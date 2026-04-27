/**
 * USGS TNM NAIP Plus ImageServer — on-demand exportImage URL builder (Water Reader).
 * Heuristic bbox only; no persistence. Source: registry usgs_tnm_naip_plus.
 */

export const USGS_NAIP_PLUS_EXPORT_BASE =
  "https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer/exportImage";

/** Policy exclusions: CONUS-first posture (see WATER_READER_USGS_TNM_NATIONAL_AERIAL_APPROVAL_PACKET.md). */
export const AERIAL_EXCLUDED_STATE_CODES = [
  "AK",
  "HI",
  "PR",
  "GU",
  "MP",
] as const;

/**
 * USPS-style 2-letter codes for U.S. states, DC, and outlying areas that can appear
 * on U.S. federal/named waterbody records. Unknown/foreign/military (AA, AE, AP) → not listed — blocks aerial preview.
 */
const US_WATERSHED_RELEVANT_STATE_CODES = new Set<string>([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
  "VA", "WA", "WV", "WI", "WY", "DC",
  "AS", "FM", "GU", "MH", "MP", "PW", "PR", "UM", "VI",
]);

export const USGS_TNM_ATTRIBUTION =
  "Map services and data available from U.S. Geological Survey, National Geospatial Program.";

/** Meters per degree latitude (spherical approximation). */
const M_PER_DEG_LAT = 111_320;

/**
 * Default acres when unknown — mid-sized standing water (~2 km²) for a reasonable viewport.
 */
const DEFAULT_ACRES_FALLBACK = 600;

const MAX_ACRES_INPUT = 2_000_000;

/**
 * WGS84 centroid checks for on-demand export (defensive — API should already validate).
 */
export function isValidWgs84Centroid(lat: number, lon: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

/**
 * Returns uppercase USPS-style code or `null` if not a known U.S. state/territory for this dataset.
 */
export function normalizeUsWaterbodyStateCode(input: string): string | null {
  const t = String(input).trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(t) || !US_WATERSHED_RELEVANT_STATE_CODES.has(t)) {
    return null;
  }
  return t;
}

/**
 * Sanitized acres for heuristic: null/invalid/too-large falls back; caps extreme values.
 */
export function normalizedAcresForHeuristic(surfaceAreaAcres: number | null | undefined): number {
  if (
    surfaceAreaAcres == null ||
    !Number.isFinite(surfaceAreaAcres) ||
    surfaceAreaAcres <= 0
  ) {
    return DEFAULT_ACRES_FALLBACK;
  }
  return Math.min(MAX_ACRES_INPUT, Math.max(1, surfaceAreaAcres));
}

/**
 * Bounding box in WGS84 (minLon, minLat, maxLon, maxLat).
 * Heuristic: circular-equivalent radius from lake area, padded, clamped to sane min/max viewport.
 *
 * Min half-extent ~0.002° lat (~222 m). Max half-extent ~0.075° lat (~8.3 km) to limit export size/USGS load.
 */
export function wgs84BboxFromCentroidAcres(
  lat: number,
  lon: number,
  surfaceAreaAcres: number | null | undefined,
): { minLon: number; minLat: number; maxLon: number; maxLat: number } {
  if (!isValidWgs84Centroid(lat, lon)) {
    return { minLon: 0, minLat: 0, maxLon: 0, maxLat: 0 };
  }

  const acres = normalizedAcresForHeuristic(surfaceAreaAcres);

  const radiusM = Math.sqrt((acres * 4046.8564224) / Math.PI);
  const paddedM = radiusM * 1.38;

  const latClamp = Math.min(89.2, Math.max(-89.2, lat));
  const cosLatClamped = Math.max(0.25, Math.abs(Math.cos((latClamp * Math.PI) / 180)));

  let halfLatDeg = paddedM / M_PER_DEG_LAT;
  let halfLonDeg = paddedM / (M_PER_DEG_LAT * cosLatClamped);

  const minHalfDeg = 0.002;
  const maxHalfDeg = 0.075;
  halfLatDeg = Math.min(maxHalfDeg, Math.max(minHalfDeg, halfLatDeg));
  halfLonDeg = Math.min(maxHalfDeg / cosLatClamped, Math.max(minHalfDeg / cosLatClamped, halfLonDeg));

  const minLon = Math.max(-180, lon - halfLonDeg);
  const maxLon = Math.min(180, lon + halfLonDeg);
  const minLat = Math.max(-90, lat - halfLatDeg);
  const maxLat = Math.min(90, lat + halfLatDeg);

  if (!(minLon < maxLon && minLat < maxLat)) {
    return { minLon: 0, minLat: 0, maxLon: 0, maxLat: 0 };
  }

  return { minLon, minLat, maxLon, maxLat };
}

const MIN_EXPORT_DIM = 64;
const MAX_EXPORT_DIM = 512;

export function isValidWgs84Bbox(bbox: {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}): boolean {
  const { minLon, minLat, maxLon, maxLat } = bbox;
  if (![minLon, minLat, maxLon, maxLat].every((n) => Number.isFinite(n))) {
    return false;
  }
  if (!(minLon < maxLon && minLat < maxLat)) {
    return false;
  }
  if (minLat < -90 || maxLat > 90 || minLon < -180 || maxLon > 180) {
    return false;
  }
  return true;
}

export function buildNaipPlusExportImageUrl(
  bbox: { minLon: number; minLat: number; maxLon: number; maxLat: number },
  options?: { size?: number },
): string {
  if (!isValidWgs84Bbox(bbox)) {
    return "";
  }
  const raw = options?.size ?? 512;
  const size = Math.min(MAX_EXPORT_DIM, Math.max(MIN_EXPORT_DIM, Math.floor(raw)));
  const params = new URLSearchParams({
    f: "image",
    bbox: `${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat}`,
    bboxSR: "4326",
    imageSR: "102100",
    size: `${size},${size}`,
    format: "jpgpng",
    interpolation: "bilinear",
  });
  return `${USGS_NAIP_PLUS_EXPORT_BASE}?${params.toString()}`;
}

/**
 * `true` when aerial preview is blocked: unknown state, or policy-excluded (AK, HI, PR, GU, MP).
 */
export function stateExcludedFromConusAerial(stateCode: string): boolean {
  const n = normalizeUsWaterbodyStateCode(stateCode);
  if (n == null) {
    return true;
  }
  return (AERIAL_EXCLUDED_STATE_CODES as readonly string[]).includes(n);
}
