import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  WATERBODY_SEARCH_FEATURE,
  type WaterbodySearchResult,
} from "../_shared/waterReader/index.ts";
import {
  checkUserRateLimit,
  rateLimitExceededResponse,
} from "../_shared/rateLimit.ts";

const WATERBODY_SEARCH_RATE_LIMITS = [
  { windowSeconds: 60, maxRequests: 60 },
  { windowSeconds: 86400, maxRequests: 1000 },
];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, apikey, x-user-token",
  };
}

function jsonError(message: string, code: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: code, message }),
    {
      status,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    },
  );
}

interface SearchRow {
  lake_id: string;
  name: string;
  state: string;
  county: string | null;
  waterbody_type: WaterbodySearchResult["waterbodyType"];
  surface_area_acres: number | null;
  centroid_lat: number;
  centroid_lon: number;
  preview_bbox_min_lon: number | null;
  preview_bbox_min_lat: number | null;
  preview_bbox_max_lon: number | null;
  preview_bbox_max_lat: number | null;
  data_tier: WaterbodySearchResult["dataTier"];
  aerial_available: boolean;
  depth_available: boolean;
  depth_usability_status: WaterbodySearchResult["depthUsabilityStatus"];
  availability: WaterbodySearchResult["availability"];
  source_status: WaterbodySearchResult["sourceStatus"];
  best_available_mode: WaterbodySearchResult["bestAvailableMode"];
  confidence: WaterbodySearchResult["confidence"];
  water_reader_support_status:
    WaterbodySearchResult["waterReaderSupportStatus"];
  water_reader_support_reason: string;
  has_polygon_geometry: boolean;
  polygon_area_acres: number | null;
  polygon_qa_flags: string[] | null;
  distance_miles?: number | null;
}

interface ArcGisFeature {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: GeoJsonGeometry | null;
}

interface GeoJsonGeometry {
  type: string;
  coordinates: unknown;
}

interface CountyLookupResult {
  countyName: string | null;
  countyGeoId: string | null;
  stateCode: string | null;
}

const MIN_SPECIFIC_QUERY_CHARS = 3;
const USGS_3DHP_FALLBACK_TIMEOUT_MS = 4500;

const USGS_3DHP_WATERBODY_QUERY_URL =
  "https://hydro.nationalmap.gov/arcgis/rest/services/3DHP_all/FeatureServer/60/query";
const TIGERWEB_COUNTY_QUERY_URL =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/25/query";
const WATERBODY_SEARCH_STOP_WORDS = new Set([
  "lake",
  "lakes",
  "pond",
  "ponds",
  "reservoir",
  "reservoirs",
  "res",
  "the",
  "a",
  "an",
  "of",
  "and",
  "or",
]);
const COUNTY_CONTEXT_WORDS = new Set([
  "county",
  "parish",
  "borough",
  "municipality",
  "township",
]);

const CURATED_3DHP_ALIASES: Array<{
  state: string;
  canonicalName: string;
  id3dhp: string;
  waterbodyType: WaterbodySearchResult["waterbodyType"];
  aliases: string[];
}> = [
  {
    state: "TX",
    canonicalName: "Lake Fork Reservoir",
    id3dhp: "MF4DV",
    waterbodyType: "reservoir",
    aliases: ["lake fork", "lake fork reservoir"],
  },
  {
    state: "IN",
    canonicalName: "Blue Grass Pit",
    id3dhp: "L3VSS",
    waterbodyType: "pond",
    aliases: [
      "blue grass pit",
      "bluegrass pit",
      "bluegrass",
      "blue grass",
      "blue grass fwa",
    ],
  },
  {
    state: "IN",
    canonicalName: "Loon Pit",
    id3dhp: "KA57A",
    waterbodyType: "pond",
    aliases: ["loon pit", "loon pit blue grass"],
  },
  {
    state: "IN",
    canonicalName: "Otter Pit",
    id3dhp: "KCUQA",
    waterbodyType: "pond",
    aliases: ["otter pit", "otter pit blue grass"],
  },
  {
    state: "IN",
    canonicalName: "Ringneck Pit",
    id3dhp: "M5TNW",
    waterbodyType: "pond",
    aliases: ["ringneck pit", "ring neck pit"],
  },
  {
    state: "IN",
    canonicalName: "Bird Dog Pit",
    id3dhp: "LUY58",
    waterbodyType: "pond",
    aliases: ["bird dog pit", "birddog pit"],
  },
];

const STATE_BBOX: Record<string, [number, number, number, number]> = {
  AL: [-88.48, 30.14, -84.89, 35.01],
  AK: [-179.15, 51.21, -129.98, 71.39],
  AZ: [-114.82, 31.33, -109.04, 37.01],
  AR: [-94.62, 33.0, -89.64, 36.5],
  CA: [-124.48, 32.53, -114.13, 42.01],
  CO: [-109.06, 36.99, -102.04, 41.0],
  CT: [-73.73, 40.98, -71.78, 42.05],
  DE: [-75.79, 38.45, -75.05, 39.84],
  FL: [-87.64, 24.52, -80.03, 31.0],
  GA: [-85.61, 30.36, -80.84, 35.0],
  HI: [-160.25, 18.91, -154.81, 22.24],
  ID: [-117.24, 42.0, -111.04, 49.0],
  IL: [-91.52, 36.97, -87.5, 42.51],
  IN: [-88.1, 37.77, -84.78, 41.76],
  IA: [-96.64, 40.38, -90.14, 43.51],
  KS: [-102.05, 36.99, -94.59, 40.0],
  KY: [-89.57, 36.49, -81.96, 39.15],
  LA: [-94.04, 28.93, -88.82, 33.02],
  ME: [-71.09, 42.96, -66.95, 47.46],
  MD: [-79.49, 37.91, -75.05, 39.72],
  MA: [-73.51, 41.19, -69.93, 42.89],
  MI: [-90.42, 41.69, -82.12, 48.31],
  MN: [-97.24, 43.5, -89.49, 49.38],
  MS: [-91.66, 30.17, -88.1, 35.01],
  MO: [-95.77, 35.99, -89.1, 40.61],
  MT: [-116.06, 44.36, -104.04, 49.0],
  NE: [-104.05, 39.99, -95.31, 43.0],
  NV: [-120.01, 35.0, -114.04, 42.0],
  NH: [-72.56, 42.69, -70.61, 45.31],
  NJ: [-75.56, 38.93, -73.89, 41.36],
  NM: [-109.05, 31.33, -103.0, 37.0],
  NY: [-79.76, 40.49, -71.86, 45.02],
  NC: [-84.32, 33.84, -75.46, 36.59],
  ND: [-104.05, 45.94, -96.55, 49.0],
  OH: [-84.82, 38.4, -80.52, 42.33],
  OK: [-103.0, 33.62, -94.43, 37.0],
  OR: [-124.57, 41.99, -116.46, 46.3],
  PA: [-80.52, 39.72, -74.69, 42.27],
  RI: [-71.9, 41.15, -71.12, 42.02],
  SC: [-83.35, 32.03, -78.54, 35.22],
  SD: [-104.06, 42.48, -96.44, 45.95],
  TN: [-90.31, 34.98, -81.65, 36.68],
  TX: [-106.65, 25.84, -93.51, 36.5],
  UT: [-114.05, 36.99, -109.04, 42.0],
  VT: [-73.44, 42.73, -71.47, 45.02],
  VA: [-83.68, 36.54, -75.24, 39.47],
  WA: [-124.85, 45.54, -116.91, 49.0],
  WV: [-82.65, 37.2, -77.72, 40.64],
  WI: [-92.89, 42.49, -86.25, 47.31],
  WY: [-111.06, 40.99, -104.05, 45.01],
};

const REGION_BY_STATE: Record<string, string> = {
  AK: "alaska",
  HI: "hawaii",
  CT: "northeast",
  ME: "northeast",
  MA: "northeast",
  NH: "northeast",
  NJ: "northeast",
  NY: "northeast",
  PA: "northeast",
  RI: "northeast",
  VT: "northeast",
  IL: "great_lakes_upper_midwest",
  IN: "great_lakes_upper_midwest",
  IA: "great_lakes_upper_midwest",
  MI: "great_lakes_upper_midwest",
  MN: "great_lakes_upper_midwest",
  MO: "great_lakes_upper_midwest",
  OH: "great_lakes_upper_midwest",
  WI: "great_lakes_upper_midwest",
  AL: "southeast",
  AR: "southeast",
  DE: "southeast",
  FL: "southeast",
  GA: "southeast",
  KY: "southeast",
  LA: "southeast",
  MD: "southeast",
  MS: "southeast",
  NC: "southeast",
  SC: "southeast",
  TN: "southeast",
  VA: "southeast",
  WV: "southeast",
  KS: "plains",
  ND: "plains",
  NE: "plains",
  OK: "plains",
  SD: "plains",
  TX: "plains",
  AZ: "mountain_west",
  CO: "mountain_west",
  ID: "mountain_west",
  MT: "mountain_west",
  NM: "mountain_west",
  NV: "mountain_west",
  UT: "mountain_west",
  WY: "mountain_west",
  CA: "pacific_west",
  OR: "pacific_west",
  WA: "pacific_west",
};

const STATE_FIPS_TO_CODE: Record<string, string> = {
  "01": "AL",
  "02": "AK",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  "10": "DE",
  "12": "FL",
  "13": "GA",
  "15": "HI",
  "16": "ID",
  "17": "IL",
  "18": "IN",
  "19": "IA",
  "20": "KS",
  "21": "KY",
  "22": "LA",
  "23": "ME",
  "24": "MD",
  "25": "MA",
  "26": "MI",
  "27": "MN",
  "28": "MS",
  "29": "MO",
  "30": "MT",
  "31": "NE",
  "32": "NV",
  "33": "NH",
  "34": "NJ",
  "35": "NM",
  "36": "NY",
  "37": "NC",
  "38": "ND",
  "39": "OH",
  "40": "OK",
  "41": "OR",
  "42": "PA",
  "44": "RI",
  "45": "SC",
  "46": "SD",
  "47": "TN",
  "48": "TX",
  "49": "UT",
  "50": "VT",
  "51": "VA",
  "53": "WA",
  "54": "WV",
  "55": "WI",
  "56": "WY",
};

function mapPreviewBbox(row: SearchRow): WaterbodySearchResult["previewBbox"] {
  const minLon = row.preview_bbox_min_lon;
  const minLat = row.preview_bbox_min_lat;
  const maxLon = row.preview_bbox_max_lon;
  const maxLat = row.preview_bbox_max_lat;
  if (
    typeof minLon !== "number" ||
    typeof minLat !== "number" ||
    typeof maxLon !== "number" ||
    typeof maxLat !== "number" ||
    !Number.isFinite(minLon) ||
    !Number.isFinite(minLat) ||
    !Number.isFinite(maxLon) ||
    !Number.isFinite(maxLat) ||
    minLon >= maxLon ||
    minLat >= maxLat
  ) {
    return null;
  }
  return { minLon, minLat, maxLon, maxLat };
}

function normalizeWaterbodyName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(
    /\s+/g,
    " ",
  );
}

function arcgisLiteral(value: string): string {
  return value.replace(/'/g, "''");
}

function normalizedParts(query: string): string[] {
  return normalizeWaterbodyName(query).split(" ").filter(Boolean);
}

function countyContextIndexes(parts: string[]): Set<number> {
  const indexes = new Set<number>();
  parts.forEach((token, index) => {
    if (!COUNTY_CONTEXT_WORDS.has(token)) return;
    indexes.add(index);
    if (index > 0) indexes.add(index - 1);
  });
  return indexes;
}

function queryTokens(query: string): string[] {
  const parts = normalizedParts(query);
  const countyIndexes = countyContextIndexes(parts);
  const tokens = parts.filter((token, index) =>
    token.length >= 2 &&
    !WATERBODY_SEARCH_STOP_WORDS.has(token) &&
    !COUNTY_CONTEXT_WORDS.has(token) &&
    !countyIndexes.has(index)
  );
  return tokens.length > 0
    ? tokens
    : parts.filter((token) => token.length >= 2);
}

function queryAliasCandidates(query: string): string[] {
  const parts = normalizedParts(query);
  const countyIndexes = countyContextIndexes(parts);
  const withoutCountyContext = parts.filter((token, index) =>
    !COUNTY_CONTEXT_WORDS.has(token) && !countyIndexes.has(index)
  );
  const candidates = new Set<string>();
  const original = query.trim();
  if (original) candidates.add(original);
  const stripped = withoutCountyContext.join(" ").trim();
  if (stripped) candidates.add(stripped);
  const specific = withoutCountyContext.filter((token) =>
    !WATERBODY_SEARCH_STOP_WORDS.has(token)
  ).join(" ").trim();
  if (specific) candidates.add(specific);
  return [...candidates];
}

function curated3DhpAliasForQuery(
  query: string,
  state: string | null,
) {
  if (!state) return null;
  const normQuery = normalizeWaterbodyName(query);
  return CURATED_3DHP_ALIASES.find((alias) =>
    alias.state === state &&
    alias.aliases.some((value) => normalizeWaterbodyName(value) === normQuery)
  ) ?? null;
}

function genericWaterbodyTypeOnly(
  query: string,
): WaterbodySearchResult["waterbodyType"] | null {
  const tokens = normalizeWaterbodyName(query).split(" ").filter(Boolean);
  if (tokens.length !== 1) return null;
  switch (tokens[0]) {
    case "lake":
    case "lakes":
      return "lake";
    case "pond":
    case "ponds":
      return "pond";
    case "reservoir":
    case "reservoirs":
    case "res":
      return "reservoir";
    default:
      return null;
  }
}

function specificQueryTooShort(query: string): boolean {
  const genericType = genericWaterbodyTypeOnly(query);
  if (genericType) return false;
  const tokens = queryTokens(query);
  return tokens.length === 0 ||
    tokens.every((token) => token.length < MIN_SPECIFIC_QUERY_CHARS);
}

function remoteSearchEligible(tokens: string[]): boolean {
  return tokens.some((token) => token.length >= 3);
}

function tokenVariants(token: string): string[] {
  const variants = new Set([token]);
  if (token.length >= 4) {
    variants.add(token.slice(1));
  }
  if (token.length >= 5 && token.endsWith("s")) {
    variants.add(token.slice(0, -1));
  }
  return [...variants].filter((value) => value.length >= 3);
}

function gnisLikeClause(token: string, broad: boolean): string {
  const variants = broad ? tokenVariants(token) : [token];
  return `(${
    variants.map((variant) =>
      `UPPER(gnisidlabel) LIKE '%${arcgisLiteral(variant.toUpperCase())}%'`
    ).join(" OR ")
  })`;
}

function gnisNameWhere(tokens: string[], broad: boolean): string {
  return [
    "featuretype = 3",
    "gnisidlabel IS NOT NULL",
    ...tokens.map((token) => gnisLikeClause(token, broad)),
  ].join(" AND ");
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  const current = new Array<number>(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost,
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[b.length];
}

function tokensAreClose(queryToken: string, nameToken: string): boolean {
  if (queryToken === nameToken) return true;
  if (nameToken.startsWith(queryToken) || queryToken.startsWith(nameToken)) {
    return true;
  }
  if (queryToken.length >= 4 && nameToken.endsWith(queryToken.slice(1))) {
    return true;
  }
  const maxDistance = Math.max(queryToken.length, nameToken.length) >= 7
    ? 2
    : 1;
  return levenshteinDistance(queryToken, nameToken) <= maxDistance;
}

function featureMatchesQueryName(
  feature: ArcGisFeature,
  query: string,
): boolean {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return true;
  const label = String(prop(feature.properties, "gnisidlabel") ?? "");
  const nameTokens = queryTokens(label);
  if (nameTokens.length === 0) return false;
  return tokens.every((token) =>
    nameTokens.some((nameToken) => tokensAreClose(token, nameToken))
  );
}

function prop(props: Record<string, unknown>, key: string): unknown {
  return props[key] ?? props[key.toLowerCase()] ?? props[key.toUpperCase()];
}

function numericProp(
  props: Record<string, unknown>,
  key: string,
): number | null {
  const value = prop(props, key);
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function geometryBbox(
  geometry: GeoJsonGeometry,
): [number, number, number, number] | null {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  function visit(value: unknown) {
    if (!Array.isArray(value)) return;
    if (
      value.length >= 2 && typeof value[0] === "number" &&
      typeof value[1] === "number"
    ) {
      minLon = Math.min(minLon, value[0]);
      minLat = Math.min(minLat, value[1]);
      maxLon = Math.max(maxLon, value[0]);
      maxLat = Math.max(maxLat, value[1]);
      return;
    }
    for (const item of value) visit(item);
  }
  visit(geometry.coordinates);
  if (![minLon, minLat, maxLon, maxLat].every(Number.isFinite)) return null;
  return [minLon, minLat, maxLon, maxLat];
}

function pointWkt(lon: number, lat: number): string {
  return `POINT(${lon} ${lat})`;
}

function coordPairWkt(value: unknown): string {
  if (
    !Array.isArray(value) ||
    typeof value[0] !== "number" ||
    typeof value[1] !== "number" ||
    !Number.isFinite(value[0]) ||
    !Number.isFinite(value[1])
  ) {
    throw new Error("invalid_coordinate");
  }
  return `${value[0]} ${value[1]}`;
}

function ringWkt(value: unknown): string {
  if (!Array.isArray(value) || value.length < 4) {
    throw new Error("invalid_ring");
  }
  return `(${value.map(coordPairWkt).join(",")})`;
}

function polygonWkt(value: unknown): string {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("invalid_polygon");
  }
  return `(${value.map(ringWkt).join(",")})`;
}

function geometryWkt(geometry: GeoJsonGeometry): string | null {
  try {
    if (geometry.type === "Polygon") {
      return `MULTIPOLYGON(${polygonWkt(geometry.coordinates)})`;
    }
    if (
      geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)
    ) {
      return `MULTIPOLYGON(${geometry.coordinates.map(polygonWkt).join(",")})`;
    }
  } catch {
    return null;
  }
  return null;
}

function waterbodyTypeForName(
  name: string,
): WaterbodySearchResult["waterbodyType"] {
  const norm = normalizeWaterbodyName(name);
  if (
    norm.split(" ").includes("reservoir") || norm.split(" ").includes("res")
  ) return "reservoir";
  if (norm.split(" ").includes("pond")) return "pond";
  return "lake";
}

function searchPriorityForArea(areaAcres: number | null): number {
  if (areaAcres == null) return 900;
  if (areaAcres >= 10000) return 25;
  if (areaAcres >= 1000) return 75;
  if (areaAcres >= 100) return 150;
  return 300;
}

async function fetchCountyForPoint(
  lon: number,
  lat: number,
): Promise<CountyLookupResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1400);
  try {
    const url = new URL(TIGERWEB_COUNTY_QUERY_URL);
    url.search = new URLSearchParams({
      f: "json",
      geometry: `${lon},${lat}`,
      geometryType: "esriGeometryPoint",
      inSR: "4326",
      spatialRel: "esriSpatialRelIntersects",
      outFields: "GEOID,BASENAME,NAME",
      returnGeometry: "false",
    }).toString();
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "FinFindr-WaterReader/1.0",
      },
    });
    if (!response.ok) {
      return { countyName: null, countyGeoId: null, stateCode: null };
    }
    const body = await response.json() as {
      features?: Array<{ attributes?: Record<string, unknown> }>;
    };
    const attrs = body.features?.[0]?.attributes;
    if (!attrs) return { countyName: null, countyGeoId: null, stateCode: null };
    const baseName = String(attrs.BASENAME ?? "").trim();
    const name = String(attrs.NAME ?? "").trim();
    const countyName = baseName || name.replace(/\s+County$/i, "").trim() ||
      null;
    const countyGeoIdRaw = String(attrs.GEOID ?? "").trim();
    const countyGeoId = countyGeoIdRaw || null;
    const stateFips = countyGeoIdRaw.slice(0, 2) ||
      String(attrs.STATE ?? "").trim();
    const stateCode = STATE_FIPS_TO_CODE[stateFips] ?? null;
    return { countyName, countyGeoId, stateCode };
  } catch {
    return { countyName: null, countyGeoId: null, stateCode: null };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAndIndex3DhpCandidates(params: {
  supabase: any;
  query: string;
  state: string | null;
  limit: number;
}): Promise<number> {
  if (!params.state || !STATE_BBOX[params.state]) return 0;
  const tokens = queryTokens(params.query);
  if (tokens.length === 0) return 0;
  if (!remoteSearchEligible(tokens)) return 0;
  const curatedAlias = curated3DhpAliasForQuery(params.query, params.state);

  const bbox = STATE_BBOX[params.state];
  async function fetchFeatures(
    where: string,
    broad: boolean,
  ): Promise<ArcGisFeature[]> {
    const url = new URL(USGS_3DHP_WATERBODY_QUERY_URL);
    url.search = new URLSearchParams({
      f: "geojson",
      where,
      outFields:
        "OBJECTID,id3dhp,gnisid,gnisidlabel,featuretype,featuretypelabel,areasqkm,workunitid,featuredate",
      returnGeometry: "true",
      geometry: bbox.join(","),
      geometryType: "esriGeometryEnvelope",
      inSR: "4326",
      spatialRel: "esriSpatialRelIntersects",
      outSR: "4326",
      orderByFields: "areasqkm DESC",
      resultRecordCount: String(
        Math.min(broad ? 14 : 8, Math.max(1, params.limit * 2)),
      ),
      geometryPrecision: "6",
    }).toString();

    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      USGS_3DHP_FALLBACK_TIMEOUT_MS,
    );
    let response: Response;
    try {
      response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "FinFindr-WaterReader/1.0",
        },
      });
    } catch (error) {
      console.error("[waterbody-search] 3DHP fallback request failed", {
        broad,
        message: error instanceof Error ? error.message : String(error),
      });
      return [];
    } finally {
      clearTimeout(timer);
    }
    if (!response.ok) {
      console.error("[waterbody-search] 3DHP fallback failed", {
        broad,
        status: response.status,
      });
      return [];
    }
    const body = await response.json() as {
      features?: ArcGisFeature[];
      error?: { message?: string };
    };
    if (body.error) {
      console.error(
        "[waterbody-search] 3DHP fallback returned error",
        { broad, error: body.error },
      );
      return [];
    }
    return body.features ?? [];
  }

  const exactNameWhere = gnisNameWhere(tokens, false);
  const exactWhere = curatedAlias
    ? `((${exactNameWhere}) OR (featuretype = 3 AND id3dhp = '${
      arcgisLiteral(curatedAlias.id3dhp)
    }'))`
    : exactNameWhere;
  let features = (await fetchFeatures(exactWhere, false)).filter((feature) =>
    curatedAlias &&
      String(prop(feature.properties, "id3dhp") ?? "").trim() ===
        curatedAlias.id3dhp
      ? true
      : featureMatchesQueryName(feature, params.query)
  );

  if (features.length === 0 && !curatedAlias) {
    features = (await fetchFeatures(gnisNameWhere(tokens, true), true)).filter(
      (feature) => featureMatchesQueryName(feature, params.query),
    );
  }

  const rowInputs = [];
  const queryAliasesByExternalId = new Map<string, string[]>();
  const queryAliasCandidatesForInsertedRows = queryAliasCandidates(
    params.query,
  );
  for (const feature of features) {
    if (!feature.geometry) continue;
    const id3dhp = String(prop(feature.properties, "id3dhp") ?? "").trim();
    const featureAlias = CURATED_3DHP_ALIASES.find((alias) =>
      alias.state === params.state && alias.id3dhp === id3dhp
    ) ?? null;
    const name = String(
      prop(feature.properties, "gnisidlabel") ?? featureAlias?.canonicalName ??
        "",
    ).trim();
    if (!name || !id3dhp) {
      continue;
    }
    const wkt = geometryWkt(feature.geometry);
    const bbox = geometryBbox(feature.geometry);
    if (!wkt || !bbox) {
      continue;
    }
    const centroidLon = (bbox[0] + bbox[2]) / 2;
    const centroidLat = (bbox[1] + bbox[3]) / 2;
    const areaSqKm = numericProp(feature.properties, "areasqkm");
    const areaAcres = areaSqKm == null ? null : areaSqKm * 247.10538146717;
    const objectId = numericProp(feature.properties, "OBJECTID");
    const externalId = `3dhp:${id3dhp}`;
    const dynamicAliases = queryAliasCandidatesForInsertedRows.filter((
      aliasName,
    ) =>
      normalizeWaterbodyName(aliasName) !== normalizeWaterbodyName(name)
    );
    if (dynamicAliases.length > 0) {
      queryAliasesByExternalId.set(externalId, dynamicAliases);
    }
    rowInputs.push({
      countyLookup: fetchCountyForPoint(centroidLon, centroidLat),
      row: {
        external_source: "usgs_3dhp_waterbody",
        external_id: externalId,
        canonical_name: name,
        state_code: params.state,
        county_name: null as string | null,
        waterbody_type: featureAlias?.waterbodyType ??
          waterbodyTypeForName(name),
        is_named: true,
        is_searchable: true,
        region_key: REGION_BY_STATE[params.state] ?? "other_us",
        centroid: pointWkt(centroidLon, centroidLat),
        geometry: wkt,
        surface_area_acres: areaAcres,
        search_priority: searchPriorityForArea(areaAcres),
        source_summary: {
          source: "USGS 3D Hydrography Program 3DHP_all Waterbody",
          source_key: "usgs_3dhp",
          source_layer_url:
            "https://hydro.nationalmap.gov/arcgis/rest/services/3DHP_all/FeatureServer/60",
          objectid: objectId,
          featuretype: numericProp(feature.properties, "featuretype"),
          featuretypelabel: prop(feature.properties, "featuretypelabel") ??
            "Lake",
          id3dhp,
          id3dhp_persistent: false,
          gnisid: prop(feature.properties, "gnisid") ?? null,
          curated_alias: featureAlias
            ? {
              canonical_name: featureAlias.canonicalName,
              aliases: featureAlias.aliases,
              reason: "3DHP waterbody polygon has GNIS ID but no label",
            }
            : null,
          workunitid: prop(feature.properties, "workunitid") ?? null,
          standing_water_only: true,
          indexed_on_demand: true,
          on_demand_query: params.query,
        },
      },
    });
  }

  if (rowInputs.length === 0) return 0;
  const rowsWithNulls = await Promise.all(
    rowInputs.map(async ({ row, countyLookup }) => {
      const county = await countyLookup;
      if (county.stateCode && county.stateCode !== params.state) return null;
      return {
        ...row,
        county_name: county.countyName,
        source_summary: {
          ...row.source_summary,
          county_lookup: county.countyName
            ? {
              source: "Census TIGERweb State_County",
              geoid: county.countyGeoId,
              method: "bbox_centroid_point_intersection",
            }
            : null,
        },
      };
    }),
  );
  const rows = rowsWithNulls.filter(Boolean);
  if (rows.length === 0) return 0;
  const { data: upsertedRows, error } = await params.supabase
    .from("waterbody_index")
    .upsert(rows, { onConflict: "external_source,external_id" })
    .select("id, external_id");
  if (error) {
    console.error("[waterbody-search] 3DHP fallback upsert failed", error);
    return 0;
  }
  const aliasRows = (upsertedRows ?? []).flatMap((
    row: { id?: string; external_id?: string | null },
  ) => {
    if (!row.id) return [];
    const id3dhp = String(row.external_id ?? "").replace(/^3dhp:/, "");
    const alias = CURATED_3DHP_ALIASES.find((candidate) =>
      candidate.state === params.state && candidate.id3dhp === id3dhp
    );
    const curatedAliases = alias?.aliases ?? [];
    const dynamicAliases =
      queryAliasesByExternalId.get(String(row.external_id ?? "")) ?? [];
    return [...new Set([...curatedAliases, ...dynamicAliases])].map((
      aliasName,
    ) => ({
      waterbody_id: row.id,
      alias_name: aliasName,
      alias_source: curatedAliases.includes(aliasName)
        ? "curated_3dhp_alias"
        : "on_demand_search_query",
    }));
  });
  if (aliasRows.length > 0) {
    const { error: aliasError } = await params.supabase
      .from("waterbody_aliases")
      .upsert(aliasRows, {
        onConflict: "waterbody_id,normalized_alias_name",
      });
    if (aliasError) {
      console.error("[waterbody-search] alias upsert failed", aliasError);
    }
  }
  return rows.length;
}

function rowMatchesAllQueryTokens(row: SearchRow, query: string): boolean {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return false;
  const searchableTokens = [
    ...normalizedParts(row.name),
    ...normalizedParts(row.county ?? ""),
  ].filter((token) =>
    token.length >= 2 &&
    !WATERBODY_SEARCH_STOP_WORDS.has(token) &&
    !COUNTY_CONTEXT_WORDS.has(token)
  );
  return tokens.every((token) => {
    for (const searchableToken of searchableTokens) {
      if (
        searchableToken.startsWith(token) ||
        token.startsWith(searchableToken) ||
        tokensAreClose(token, searchableToken)
      ) {
        return true;
      }
    }
    return false;
  });
}

function shouldTryRemoteFallback(
  rows: SearchRow[],
  query: string,
  state: string | null,
): boolean {
  if (!state) return false;
  if (rows.length === 0) return true;
  const curatedAlias = curated3DhpAliasForQuery(query, state);
  if (curatedAlias) {
    return !rows.some((row) =>
      normalizeWaterbodyName(row.name) ===
        normalizeWaterbodyName(curatedAlias.canonicalName)
    );
  }
  const tokens = queryTokens(query);
  if (tokens.length < 2) return false;
  return !rows.some((row) => rowMatchesAllQueryTokens(row, query));
}

function shouldTryCrossStateAliasRetry(
  rows: SearchRow[],
  query: string,
  state: string | null,
): boolean {
  if (!state || rows.length > 0) return false;
  return queryTokens(query).length >= 1;
}

function centroidPoint(value: unknown): { lon: number; lat: number } | null {
  const maybe = value as { coordinates?: unknown } | null;
  const coordinates = maybe?.coordinates;
  if (
    !Array.isArray(coordinates) ||
    typeof coordinates[0] !== "number" ||
    typeof coordinates[1] !== "number"
  ) {
    return null;
  }
  return { lon: coordinates[0], lat: coordinates[1] };
}

async function fetchCuratedCrossStateAliasRows(params: {
  supabase: any;
  query: string;
  state: string | null;
  limit: number;
}): Promise<SearchRow[]> {
  if (!params.state) {
    return [];
  }
  const { data, error } = await params.supabase
    .from("waterbody_aliases")
    .select(
      "waterbody_index!inner(id, canonical_name, state_code, county_name, waterbody_type, surface_area_acres, centroid, waterbody_shared_states!inner(search_state_code, display_state_code, reason))",
    )
    .eq("normalized_alias_name", normalizeWaterbodyName(params.query))
    .eq(
      "waterbody_index.waterbody_shared_states.search_state_code",
      params.state,
    )
    .limit(params.limit);
  if (error) {
    console.error(
      "[waterbody-search] curated alias direct lookup failed",
      error,
    );
    return [];
  }
  return (data ?? []).flatMap((row: { waterbody_index?: unknown }) => {
    const waterbody = row.waterbody_index as {
      id?: string;
      canonical_name?: string;
      state_code?: string;
      county_name?: string | null;
      waterbody_type?: WaterbodySearchResult["waterbodyType"];
      surface_area_acres?: number | null;
      centroid?: unknown;
      waterbody_shared_states?: Array<{
        search_state_code?: string | null;
        display_state_code?: string | null;
        reason?: string | null;
      }>;
    } | null;
    const point = centroidPoint(waterbody?.centroid);
    if (
      !waterbody?.id || !waterbody.canonical_name || !waterbody.state_code ||
      !point
    ) {
      return [];
    }
    const sharedState = waterbody.waterbody_shared_states?.find((shared) =>
      shared.search_state_code === params.state
    );
    if (!sharedState) return [];
    const acres = waterbody.surface_area_acres ?? null;
    const displayState = sharedState.display_state_code ?? params.state ??
      waterbody.state_code;
    const isSharedState = displayState !== waterbody.state_code;
    return [
      {
        lake_id: waterbody.id,
        name: waterbody.canonical_name,
        state: displayState,
        county: waterbody.county_name ?? null,
        waterbody_type: waterbody.waterbody_type ?? "lake",
        surface_area_acres: acres,
        centroid_lat: point.lat,
        centroid_lon: point.lon,
        preview_bbox_min_lon: null,
        preview_bbox_min_lat: null,
        preview_bbox_max_lon: null,
        preview_bbox_max_lat: null,
        data_tier: "polygon_only",
        aerial_available: false,
        depth_available: false,
        depth_usability_status: "unavailable",
        availability: "limited",
        source_status: "limited",
        best_available_mode: null,
        confidence: "low",
        water_reader_support_status: "limited",
        water_reader_support_reason: isSharedState
          ? `Shared border waterbody indexed under ${waterbody.state_code}; shown for ${displayState} because ${displayState} is an accepted shoreline state.`
          : "Large border waterbody returned through a curated search alias; Water Reader can open it with limited-read caution.",
        has_polygon_geometry: true,
        polygon_area_acres: acres,
        polygon_qa_flags: isSharedState
          ? [
            "curated_shared_state_alias",
            `indexed_state:${waterbody.state_code}`,
          ]
          : ["curated_shared_state_alias"],
      } satisfies SearchRow,
    ];
  });
}

function openableSupport(row: SearchRow): boolean {
  return row.has_polygon_geometry &&
    row.water_reader_support_status !== "not_supported";
}

function rowAreaAcres(row: SearchRow): number {
  return row.polygon_area_acres ?? row.surface_area_acres ?? 0;
}

function sortedRowsForDisplay(rows: SearchRow[], query: string): SearchRow[] {
  const normQuery = normalizeWaterbodyName(query);
  return [...rows]
    .map((row, originalIndex) => ({ row, originalIndex }))
    .sort((a, b) => {
      const aExact = normalizeWaterbodyName(a.row.name) === normQuery ? 0 : 1;
      const bExact = normalizeWaterbodyName(b.row.name) === normQuery ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;
      const aOpen = openableSupport(a.row) ? 0 : 1;
      const bOpen = openableSupport(b.row) ? 0 : 1;
      if (aOpen !== bOpen) return aOpen - bOpen;
      if (
        aExact === 0 &&
        bExact === 0 &&
        a.row.state === b.row.state &&
        normalizeWaterbodyName(a.row.name) ===
          normalizeWaterbodyName(b.row.name)
      ) {
        const areaDelta = rowAreaAcres(b.row) - rowAreaAcres(a.row);
        if (Math.abs(areaDelta) > 0.001) return areaDelta;
      }
      if (a.originalIndex !== b.originalIndex) {
        return a.originalIndex - b.originalIndex;
      }
      return (a.row.county ?? "").localeCompare(b.row.county ?? "") ||
        a.row.name.localeCompare(b.row.name);
    })
    .map(({ row }) => row);
}

function sameNameStateCounts(rows: SearchRow[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = `${row.state}|${normalizeWaterbodyName(row.name)}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function mapRow(row: SearchRow, sameNameCount: number): WaterbodySearchResult {
  return {
    lakeId: row.lake_id,
    name: row.name,
    state: row.state,
    county: row.county,
    waterbodyType: row.waterbody_type,
    surfaceAreaAcres: row.surface_area_acres,
    centroid: {
      lat: row.centroid_lat,
      lon: row.centroid_lon,
    },
    previewBbox: mapPreviewBbox(row),
    dataTier: row.data_tier,
    aerialAvailable: row.aerial_available,
    depthAvailable: row.depth_available,
    depthUsabilityStatus: row.depth_usability_status,
    availability: row.availability,
    sourceStatus: row.source_status,
    bestAvailableMode: row.best_available_mode,
    confidence: row.confidence,
    waterReaderSupportStatus: row.water_reader_support_status,
    waterReaderSupportReason: row.water_reader_support_reason,
    hasPolygonGeometry: row.has_polygon_geometry,
    polygonAreaAcres: row.polygon_area_acres,
    polygonQaFlags: row.polygon_qa_flags ?? [],
    sameNameStateCandidateCount: sameNameCount,
    isAmbiguousNameInState: sameNameCount > 1,
    distanceMiles: row.distance_miles ?? null,
  };
}

type WaterbodySearchMode =
  | "search"
  | "nearby"
  | "county"
  | "counties"
  | "popular"
  | "featured";

function parseSearchMode(value: unknown): WaterbodySearchMode {
  if (
    value === "nearby" ||
    value === "county" ||
    value === "counties" ||
    value === "popular" ||
    value === "featured"
  ) {
    return value;
  }
  return "search";
}

function resolveResultLimit(
  mode: WaterbodySearchMode,
  limitRaw: unknown,
): number {
  const raw = Number(limitRaw ?? 10);
  const n = Number.isFinite(raw) ? Math.floor(raw) : 10;
  switch (mode) {
    case "county":
      return Math.min(200, Math.max(1, n));
    case "nearby":
    case "popular":
      return Math.min(50, Math.max(1, n));
    case "counties":
      return Math.min(200, Math.max(1, n));
    default:
      return Math.min(25, Math.max(1, n));
  }
}

function searchResponsePayload(params: {
  mode: WaterbodySearchMode;
  query: string;
  state: string | null;
  results: WaterbodySearchResult[];
  nearResults?: WaterbodySearchResult[];
  topResults?: WaterbodySearchResult[];
  counties?: Array<{ county: string; waterbodyCount: number }>;
}) {
  return {
    feature: WATERBODY_SEARCH_FEATURE,
    mode: params.mode,
    query: params.query,
    state: params.state,
    results: params.results,
    nearResults: params.nearResults,
    topResults: params.topResults,
    counties: params.counties,
  };
}

function jsonSearchResponse(params: {
  mode: WaterbodySearchMode;
  query: string;
  state: string | null;
  rows: SearchRow[];
  nearRows?: SearchRow[];
  topRows?: SearchRow[];
  counties?: Array<{ county: string; waterbodyCount: number }>;
}): Response {
  const sameNameCounts = sameNameStateCounts(params.rows);
  const mapRows = (rows: SearchRow[]) =>
    rows.map((row) =>
      mapRow(
        row,
        sameNameCounts.get(
          `${row.state}|${normalizeWaterbodyName(row.name)}`,
        ) ?? 1,
      )
    );
  const results = mapRows(params.rows);
  return new Response(
    JSON.stringify(
      searchResponsePayload({
        mode: params.mode,
        query: params.query,
        state: params.state,
        results,
        nearResults: params.nearRows ? mapRows(params.nearRows) : undefined,
        topResults: params.topRows ? mapRows(params.topRows) : undefined,
        counties: params.counties,
      }),
    ),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    },
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return jsonError("Method not allowed", "method_not_allowed", 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken ??
    (authHeader ? authHeader.replace("Bearer ", "") : null);
  if (!token) {
    return jsonError("Missing authentication token", "unauthorized", 401);
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    token,
  );
  if (authError || !user) {
    return jsonError("Unauthorized", "unauthorized", 401);
  }

  const rateLimit = await checkUserRateLimit(supabase, {
    userId: user.id,
    feature: "waterbody_search",
    rules: WATERBODY_SEARCH_RATE_LIMITS,
  });
  if (!rateLimit.allowed) {
    return rateLimitExceededResponse(rateLimit, corsHeaders());
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", "invalid_body", 400);
  }

  const mode = parseSearchMode(body.mode);
  const query = typeof body.query === "string" ? body.query.trim() : "";
  const state = typeof body.state === "string" && body.state.trim().length > 0
    ? body.state.trim().toUpperCase()
    : null;
  const limit = resolveResultLimit(mode, body.limit);

  if (mode === "counties") {
    if (!state) {
      return jsonError("state is required for county browse", "invalid_state", 400);
    }
    const { data, error } = await supabase.rpc("list_waterbody_counties_for_state", {
      state_filter: state,
      result_limit: Math.min(200, Math.max(limit, 40)),
    });
    if (error) {
      console.error("[waterbody-search] counties rpc failed", error);
      return jsonError("Failed to list counties", "search_failed", 500);
    }
    const counties = (Array.isArray(data) ? data : []).map((row) => {
      const record = row as { county?: string; waterbody_count?: number };
      return {
        county: String(record.county ?? ""),
        waterbodyCount: Number(record.waterbody_count ?? 0),
      };
    }).filter((row) => row.county.length > 0);
    return jsonSearchResponse({
      mode,
      query,
      state,
      rows: [],
      counties,
    });
  }

  if (mode === "nearby") {
    const lat = Number(body.lat);
    const lon = Number(body.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return jsonError("lat and lon are required for nearby browse", "invalid_location", 400);
    }
    const radiusRaw = Number(body.radiusMiles ?? 40);
    const radiusMiles = Number.isFinite(radiusRaw)
      ? Math.min(120, Math.max(5, radiusRaw))
      : 40;
    const { data, error } = await supabase.rpc("browse_waterbodies_near_point", {
      lat,
      lon,
      radius_miles: radiusMiles,
      state_filter: state,
      result_limit: limit,
    });
    if (error) {
      console.error("[waterbody-search] nearby rpc failed", error);
      return jsonError("Failed to browse nearby waterbodies", "search_failed", 500);
    }
    const rows = Array.isArray(data) ? data as SearchRow[] : [];
    return jsonSearchResponse({ mode, query, state, rows });
  }

  if (mode === "county") {
    const county = typeof body.county === "string" ? body.county.trim() : "";
    if (!state || county.length === 0) {
      return jsonError(
        "state and county are required for county browse",
        "invalid_county",
        400,
      );
    }
    const { data, error } = await supabase.rpc("browse_waterbodies_by_county", {
      state_filter: state,
      county_filter: county,
      result_limit: limit,
    });
    if (error) {
      console.error("[waterbody-search] county rpc failed", error);
      return jsonError("Failed to browse county waterbodies", "search_failed", 500);
    }
    const rows = Array.isArray(data) ? data as SearchRow[] : [];
    return jsonSearchResponse({ mode, query, state, rows });
  }

  if (mode === "popular") {
    if (!state) {
      return jsonError("state is required for popular browse", "invalid_state", 400);
    }
    const { data, error } = await supabase.rpc("browse_waterbodies_by_state", {
      state_filter: state,
      waterbody_type_filter: null,
      result_limit: limit,
    });
    if (error) {
      console.error("[waterbody-search] popular rpc failed", error);
      return jsonError("Failed to load popular waterbodies", "search_failed", 500);
    }
    const rows = Array.isArray(data) ? data as SearchRow[] : [];
    return jsonSearchResponse({ mode, query, state, rows });
  }

  if (mode === "featured") {
    if (!state) {
      return jsonError("state is required for featured browse", "invalid_state", 400);
    }
    const lat = Number(body.lat);
    const lon = Number(body.lon);
    const hasLocation = Number.isFinite(lat) && Number.isFinite(lon);
    const [topResponse, countyResponse, nearResponse] = await Promise.all([
      supabase.rpc("browse_waterbodies_by_state", {
        state_filter: state,
        waterbody_type_filter: null,
        result_limit: limit,
      }),
      supabase.rpc("list_waterbody_counties_for_state", {
        state_filter: state,
        result_limit: 80,
      }),
      hasLocation
        ? supabase.rpc("browse_waterbodies_near_point", {
          lat,
          lon,
          radius_miles: Number(body.radiusMiles ?? 50),
          state_filter: state,
          result_limit: limit,
        })
        : Promise.resolve({ data: [], error: null }),
    ]);
    if (topResponse.error || countyResponse.error || nearResponse.error) {
      console.error("[waterbody-search] featured rpc failed", {
        top: topResponse.error,
        counties: countyResponse.error,
        near: nearResponse.error,
      });
      return jsonError("Failed to load featured waterbodies", "search_failed", 500);
    }
    const topRows = Array.isArray(topResponse.data)
      ? topResponse.data as SearchRow[]
      : [];
    const nearRows = Array.isArray(nearResponse.data)
      ? nearResponse.data as SearchRow[]
      : [];
    const counties = (Array.isArray(countyResponse.data)
      ? countyResponse.data
      : []).map((row) => {
      const record = row as { county?: string; waterbody_count?: number };
      return {
        county: String(record.county ?? ""),
        waterbodyCount: Number(record.waterbody_count ?? 0),
      };
    }).filter((row) => row.county.length > 0);
    const primaryRows = nearRows.length > 0 ? nearRows : topRows;
    return jsonSearchResponse({
      mode,
      query,
      state,
      rows: primaryRows,
      nearRows,
      topRows,
      counties,
    });
  }

  if (query.length < 2) {
    return jsonError(
      "query must be at least 2 characters",
      "invalid_query",
      400,
    );
  }

  if (shouldTryCrossStateAliasRetry([], query, state)) {
    const aliasRows = sortedRowsForDisplay(
      await fetchCuratedCrossStateAliasRows({ supabase, query, state, limit }),
      query,
    );
    if (aliasRows.length > 0) {
      console.info(
        "[waterbody-search] curated cross-state alias hit",
        JSON.stringify({
          state,
          resultCount: aliasRows.length,
        }),
      );
      const sameNameCounts = sameNameStateCounts(aliasRows);
      return new Response(
        JSON.stringify({
          feature: WATERBODY_SEARCH_FEATURE,
          query,
          state,
          results: aliasRows.map((row) =>
            mapRow(
              row,
              sameNameCounts.get(
                `${row.state}|${normalizeWaterbodyName(row.name)}`,
              ) ?? 1,
            )
          ),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders() },
        },
      );
    }
  }

  let data: unknown[] | null = null;
  let error: { message: string } | null = null;
  const genericType = genericWaterbodyTypeOnly(query);
  if (genericType) {
    const response = await supabase.rpc("browse_waterbodies_by_state", {
      state_filter: state,
      waterbody_type_filter: genericType,
      result_limit: limit,
    });
    data = response.data;
    error = response.error;
  } else if (specificQueryTooShort(query)) {
    data = [];
  } else {
    const response = await supabase.rpc("search_waterbodies", {
      query_text: query,
      state_filter: state,
      result_limit: limit,
    });
    data = response.data;
    error = response.error;
  }
  if (error) {
    if (shouldTryCrossStateAliasRetry([], query, state)) {
      console.info(
        "[waterbody-search] local rpc failed; trying cross-state alias retry",
        JSON.stringify({ state }),
      );
      data = [];
      error = null;
    } else {
      console.error("[waterbody-search] rpc failed", error);
      return jsonError("Failed to search waterbodies", "search_failed", 500);
    }
  }

  let rawRows = Array.isArray(data) ? data as SearchRow[] : [];
  let fallbackAttempted = false;
  let fallbackIndexedCount = 0;
  if (shouldTryRemoteFallback(rawRows, query, state)) {
    fallbackAttempted = true;
    const indexedCount = await fetchAndIndex3DhpCandidates({
      supabase,
      query,
      state,
      limit,
    });
    fallbackIndexedCount = indexedCount;
    if (indexedCount > 0) {
      const retry = await supabase.rpc("search_waterbodies", {
        query_text: query,
        state_filter: state,
        result_limit: limit,
      });
      if (retry.error) {
        console.error(
          "[waterbody-search] rpc retry failed after 3DHP fallback",
          retry.error,
        );
        return jsonError("Failed to search waterbodies", "search_failed", 500);
      }
      rawRows = Array.isArray(retry.data) ? retry.data as SearchRow[] : [];
    }
  }
  if (shouldTryCrossStateAliasRetry(rawRows, query, state)) {
    const retry = await supabase.rpc("search_waterbodies", {
      query_text: query,
      state_filter: null,
      result_limit: limit,
    });
    if (retry.error) {
      console.error(
        "[waterbody-search] cross-state alias retry failed",
        retry.error,
      );
    } else {
      rawRows = Array.isArray(retry.data) ? retry.data as SearchRow[] : [];
    }
    if (rawRows.length === 0) {
      rawRows = await fetchCuratedCrossStateAliasRows({
        supabase,
        query,
        state,
        limit,
      });
    }
  }

  const rows = sortedRowsForDisplay(rawRows, query);
  const weakResult = rows.length === 0 ||
    (rows.length > 0 &&
      !rows.some((row) => rowMatchesAllQueryTokens(row, query)));
  if (weakResult || fallbackAttempted) {
    const topResults = rows.slice(0, 5).map((row) => ({
      name: row.name,
      state: row.state,
      county: row.county,
      support: row.water_reader_support_status,
      acres: Math.round(rowAreaAcres(row)),
    }));
    console.info(
      "[waterbody-search] search telemetry",
      JSON.stringify({
        state,
        resultCount: rows.length,
        weakResult,
        fallbackAttempted,
        fallbackIndexedCount,
      }),
    );
    const { error: missError } = await supabase
      .from("waterbody_search_miss_events")
      .insert({
        query_text: query,
        normalized_query: normalizeWaterbodyName(query),
        state_filter: state,
        result_count: rows.length,
        fallback_attempted: fallbackAttempted,
        fallback_indexed_count: fallbackIndexedCount,
        top_result_name: rows[0]?.name ?? null,
        top_result_state: rows[0]?.state ?? null,
        top_result_county: rows[0]?.county ?? null,
        user_id: user.id,
        request_context: {
          weakResult,
          topResults,
        },
      });
    if (missError) {
      console.error(
        "[waterbody-search] miss telemetry insert failed",
        missError,
      );
    }
  }
  return jsonSearchResponse({
    mode: "search",
    query,
    state,
    rows,
  });
});
