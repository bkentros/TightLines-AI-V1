import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  WATERBODY_SEARCH_FEATURE,
  type WaterbodySearchResult,
} from "../_shared/waterReader/index.ts";

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

function queryTokens(query: string): string[] {
  const tokens = normalizeWaterbodyName(query)
    .split(" ")
    .filter((token) =>
      token.length >= 2 &&
      !["lake", "lakes", "pond", "reservoir", "res"].includes(token)
    );
  return tokens.length > 0
    ? tokens
    : normalizeWaterbodyName(query).split(" ").filter((token) =>
      token.length >= 2
    );
}

function genericWaterbodyTypeOnly(query: string): WaterbodySearchResult["waterbodyType"] | null {
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
  return tokens.length === 0 || tokens.every((token) => token.length < MIN_SPECIFIC_QUERY_CHARS);
}

function remoteSearchEligible(tokens: string[]): boolean {
  return tokens.some((token) => token.length >= 3);
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

  const bbox = STATE_BBOX[params.state];
  const where = [
    "featuretype = 3",
    "gnisidlabel IS NOT NULL",
    ...tokens.map((token) =>
      `UPPER(gnisidlabel) LIKE '%${arcgisLiteral(token.toUpperCase())}%'`
    ),
  ].join(" AND ");

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
    resultRecordCount: String(Math.min(6, Math.max(1, params.limit))),
    geometryPrecision: "6",
  }).toString();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), USGS_3DHP_FALLBACK_TIMEOUT_MS);
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
      message: error instanceof Error ? error.message : String(error),
    });
    return 0;
  } finally {
    clearTimeout(timer);
  }
  if (!response.ok) {
    console.error("[waterbody-search] 3DHP fallback failed", {
      status: response.status,
    });
    return 0;
  }
  const body = await response.json() as {
    features?: ArcGisFeature[];
    error?: { message?: string };
  };
  if (body.error) {
    console.error(
      "[waterbody-search] 3DHP fallback returned error",
      body.error,
    );
    return 0;
  }

  const rowInputs = [];
  for (const feature of body.features ?? []) {
    if (!feature.geometry) continue;
    const name = String(prop(feature.properties, "gnisidlabel") ?? "").trim();
    const id3dhp = String(prop(feature.properties, "id3dhp") ?? "").trim();
    if (!name || !id3dhp) continue;
    const wkt = geometryWkt(feature.geometry);
    const bbox = geometryBbox(feature.geometry);
    if (!wkt || !bbox) continue;
    const centroidLon = (bbox[0] + bbox[2]) / 2;
    const centroidLat = (bbox[1] + bbox[3]) / 2;
    const areaSqKm = numericProp(feature.properties, "areasqkm");
    const areaAcres = areaSqKm == null ? null : areaSqKm * 247.10538146717;
    const objectId = numericProp(feature.properties, "OBJECTID");
    rowInputs.push({
      countyLookup: fetchCountyForPoint(centroidLon, centroidLat),
      row: {
        external_source: "usgs_3dhp_waterbody",
        external_id: `3dhp:${id3dhp}`,
        canonical_name: name,
        state_code: params.state,
        county_name: null as string | null,
        waterbody_type: waterbodyTypeForName(name),
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
          workunitid: prop(feature.properties, "workunitid") ?? null,
          standing_water_only: true,
          indexed_on_demand: true,
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
  const { error } = await params.supabase
    .from("waterbody_index")
    .upsert(rows, { onConflict: "external_source,external_id" });
  if (error) {
    console.error("[waterbody-search] 3DHP fallback upsert failed", error);
    return 0;
  }
  return rows.length;
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
  };
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single<{ subscription_tier: string | null }>();
  const tier = profile?.subscription_tier ?? "free";
  if (tier === "free") {
    return jsonError(
      "Subscribe to use this feature",
      "subscription_required",
      403,
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", "invalid_body", 400);
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (query.length < 2) {
    return jsonError(
      "query must be at least 2 characters",
      "invalid_query",
      400,
    );
  }

  const state = typeof body.state === "string" && body.state.trim().length > 0
    ? body.state.trim().toUpperCase()
    : null;
  const limitRaw = Number(body.limit ?? 10);
  const limit = Number.isFinite(limitRaw)
    ? Math.min(25, Math.max(1, Math.floor(limitRaw)))
    : 10;

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
    console.error("[waterbody-search] rpc failed", error);
    return jsonError("Failed to search waterbodies", "search_failed", 500);
  }

  let rawRows = Array.isArray(data) ? data as SearchRow[] : [];
  if (rawRows.length === 0 && state) {
    const indexedCount = await fetchAndIndex3DhpCandidates({
      supabase,
      query,
      state,
      limit,
    });
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

  const rows = sortedRowsForDisplay(rawRows, query);
  const sameNameCounts = sameNameStateCounts(rows);
  return new Response(
    JSON.stringify({
      feature: WATERBODY_SEARCH_FEATURE,
      query,
      state,
      results: rows.map((row) =>
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
});
