/**
 * CI / internal: first-page GeoJSON usability smoke for MN DNR depth pilot `source_path` URLs.
 * Keep in sync with migration `20260425204500_water_reader_mn_dnr_pilot_usable_source_paths.sql`.
 *
 * Run: `npm run check:water-reader:mn-dnr-pilot-geojson`
 * Or:  `deno run -A scripts/water-reader-mn-dnr-pilot-geojson-smoke.ts`
 */

const EXPECTED_GEOM_TYPES = new Set(["LineString", "MultiLineString"]);

type PilotRow = {
  label: string;
  sourcePath: string;
  fetchValidationUrl: string;
};

/** Six pilot lakes — URLs must match approved migration (lake-specific DOWLKNUM where clauses). */
const PILOT_ROWS: PilotRow[] = [
  {
    label: "Lake Minnetonka (Hennepin)",
    sourcePath:
      "https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%20IN%20(%2727013300%27%2C%2727013301%27%2C%2727013302%27%2C%2727013303%27%2C%2727013304%27%2C%2727013305%27%2C%2727013306%27%2C%2727013307%27%2C%2727013308%27%2C%2727013309%27%2C%2727013310%27%2C%2727013311%27%2C%2727013312%27%2C%2727013313%27%2C%2727013314%27%2C%2727013315%27)",
    fetchValidationUrl:
      "https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%20IN%20(%2727013300%27%2C%2727013301%27%2C%2727013302%27%2C%2727013303%27%2C%2727013304%27%2C%2727013305%27%2C%2727013306%27%2C%2727013307%27%2C%2727013308%27%2C%2727013309%27%2C%2727013310%27%2C%2727013311%27%2C%2727013312%27%2C%2727013313%27%2C%2727013314%27%2C%2727013315%27)",
  },
  {
    label: "Mille Lacs Lake (Mille Lacs)",
    sourcePath:
      "https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2748000200%27",
    fetchValidationUrl:
      "https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2748000200%27",
  },
  {
    label: "Lake Waconia (Carver)",
    sourcePath:
      "https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2710005900%27",
    fetchValidationUrl:
      "https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2710005900%27",
  },
  {
    label: "Bde Maka Ska (Hennepin)",
    sourcePath:
      "https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2727003100%27",
    fetchValidationUrl:
      "https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2727003100%27",
  },
  {
    label: "Lake of the Isles (Hennepin)",
    sourcePath:
      "https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2727004000%27",
    fetchValidationUrl:
      "https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2727004000%27",
  },
  {
    label: "Leech Lake (Cass)",
    sourcePath:
      "https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%20IN%20(%2711020301%27%2C%2711020302%27)",
    fetchValidationUrl:
      "https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%20IN%20(%2711020301%27%2C%2711020302%27)",
  },
];

function assertNoCountOnlySourcePath(url: string, label: string) {
  const lower = url.toLowerCase();
  if (lower.includes("returncountonly=true")) {
    throw new Error(`${label}: source_path must not use returnCountOnly=true`);
  }
}

function assertValidationUrlIsCountOnlyProbe(url: string | undefined, label: string) {
  if (!url) throw new Error(`${label}: missing fetch_validation_url in fixture`);
  if (!url.includes("returnCountOnly=true")) {
    throw new Error(`${label}: fetch_validation_url should use returnCountOnly=true (light probe)`);
  }
  if (url.toLowerCase().includes("f=geojson")) {
    throw new Error(`${label}: fetch_validation_url should not use f=geojson`);
  }
}

function assertSourcePathShape(url: string, label: string) {
  const lower = url.toLowerCase();
  if (!lower.includes("f=geojson")) {
    throw new Error(`${label}: source_path should use f=geojson`);
  }
  if (!lower.includes("returngeometry=true")) {
    throw new Error(`${label}: source_path should set returnGeometry=true`);
  }
  if (!lower.includes("outsr=4326") && !lower.includes("outsr%3d4326")) {
    throw new Error(`${label}: source_path should request outSR=4326 (WGS84)`);
  }
}

function isWgs84LonLat(lon: number, lat: number): boolean {
  return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
}

/** Minnesota rough envelope — contours should fall here when outSR=4326 */
function inMinnesotaEnvelope(lon: number, lat: number): boolean {
  return lon >= -97.5 && lon <= -89.0 && lat >= 43.0 && lat <= 49.5;
}

function checkPositions(positions: number[][], label: string, featureIndex: number) {
  for (const pos of positions) {
    if (pos.length < 2) {
      throw new Error(`${label}: feature ${featureIndex} invalid position length`);
    }
    const [lon, lat] = pos;
    if (!isWgs84LonLat(lon, lat)) {
      throw new Error(
        `${label}: feature ${featureIndex} coordinates out of WGS84 lon/lat range: [${lon}, ${lat}]`,
      );
    }
    if (!inMinnesotaEnvelope(lon, lat)) {
      throw new Error(
        `${label}: feature ${featureIndex} coordinates outside MN envelope for pilot (expected WGS84 MN): [${lon}, ${lat}]`,
      );
    }
  }
}

function assertGeometryWgs84Contours(
  geometry: Record<string, unknown>,
  label: string,
  featureIndex: number,
) {
  const t = geometry.type;
  if (t !== "LineString" && t !== "MultiLineString") {
    throw new Error(`${label}: feature ${featureIndex} geometry.type=${t} (expected LineString or MultiLineString)`);
  }
  if (!EXPECTED_GEOM_TYPES.has(t as string)) {
    throw new Error(`${label}: feature ${featureIndex} unexpected geometry type ${t}`);
  }
  const coords = geometry.coordinates;
  if (!Array.isArray(coords)) {
    throw new Error(`${label}: feature ${featureIndex} missing coordinates array`);
  }
  if (t === "LineString") {
    const ring = coords as number[][];
    checkPositions(ring, label, featureIndex);
  } else {
    for (let i = 0; i < (coords as number[][][]).length; i++) {
      const line = (coords as number[][][])[i];
      if (!Array.isArray(line)) throw new Error(`${label}: feature ${featureIndex} MultiLineString part ${i} invalid`);
      checkPositions(line as number[][], label, featureIndex);
    }
  }
}

function hasDepthProperty(props: Record<string, unknown>): boolean {
  return (
    (props["DEPTH"] !== undefined && props["DEPTH"] !== null) ||
    (props["abs_depth"] !== undefined && props["abs_depth"] !== null)
  );
}

/** Same query as registry `source_path`, but cap records so CI does not pull multi‑MB first pages. */
function smokeFetchUrl(sourcePath: string): string {
  const u = new URL(sourcePath);
  const cap = Deno.env.get("MN_DNR_SMOKE_MAX_RECORDS") ?? "250";
  u.searchParams.set("resultRecordCount", cap);
  u.searchParams.delete("resultOffset");
  return u.toString();
}

async function fetchJson(url: string, label: string): Promise<unknown> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(180_000),
    headers: {
      "Accept": "application/geo+json, application/json, */*",
      "User-Agent": "TightLinesAI-water-reader-mn-dnr-smoke/1.0",
    },
  });
  if (!res.ok) {
    throw new Error(`${label}: HTTP ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label}: response is not JSON (first 120 chars): ${text.slice(0, 120)}`);
  }
}

async function smokeOne(row: PilotRow): Promise<{ label: string; featureCount: number; sampled: number }> {
  const { label, sourcePath, fetchValidationUrl } = row;
  assertNoCountOnlySourcePath(sourcePath, label);
  assertSourcePathShape(sourcePath, label);
  assertValidationUrlIsCountOnlyProbe(fetchValidationUrl, label);

  const fetchUrl = smokeFetchUrl(sourcePath);
  const body = await fetchJson(fetchUrl, label) as Record<string, unknown>;
  if (body.type !== "FeatureCollection") {
    throw new Error(`${label}: expected type FeatureCollection, got ${String(body.type)}`);
  }
  const features = body.features;
  if (!Array.isArray(features)) {
    throw new Error(`${label}: missing features array`);
  }
  if (features.length === 0) {
    throw new Error(`${label}: features array is empty (first page)`);
  }

  const maxCheck = features.length;
  for (let i = 0; i < maxCheck; i++) {
    const f = features[i] as Record<string, unknown>;
    if (f.type !== "Feature") {
      throw new Error(`${label}: features[${i}] is not a Feature`);
    }
    const geom = f.geometry as Record<string, unknown> | null;
    if (geom == null) {
      throw new Error(`${label}: features[${i}] has null geometry`);
    }
    assertGeometryWgs84Contours(geom, label, i);
    const props = f.properties as Record<string, unknown> | null;
    if (props == null || typeof props !== "object") {
      throw new Error(`${label}: features[${i}] missing properties`);
    }
    if (!hasDepthProperty(props)) {
      throw new Error(`${label}: features[${i}] missing DEPTH and abs_depth`);
    }
  }

  return { label, featureCount: features.length, sampled: maxCheck };
}

async function main() {
  console.log("MN DNR pilot GeoJSON smoke (first page, all features in page)…");
  const results: { label: string; featureCount: number; sampled: number }[] = [];
  for (const row of PILOT_ROWS) {
    const r = await smokeOne(row);
    console.log(`OK  ${r.label}: ${r.featureCount} features in first page, validated ${r.sampled} geometries + depth props`);
    results.push(r);
  }
  console.log(`\nAll ${results.length} pilot source_path URLs passed.`);
}

main().catch((e) => {
  console.error(e);
  Deno.exit(1);
});
