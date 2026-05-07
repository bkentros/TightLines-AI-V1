import { createClient } from '@supabase/supabase-js';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const WATERBODY_LAYER_URL =
  'https://hydro.nationalmap.gov/arcgis/rest/services/3DHP_all/FeatureServer/60/query';
const COUNTY_CARTOGRAPHIC_BOUNDARY_ZIP_URL =
  'https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_county_500k.zip';

const MIN_AREA_ACRES_DEFAULT = 20;
const SQKM_PER_ACRE = 0.0040468564224;
const ACRES_PER_SQKM = 247.10538146717;
const PAGE_SIZE_DEFAULT = 500;
const UPSERT_BATCH_SIZE = 75;
const execFileAsync = promisify(execFile);

const STATE_FIPS_TO_CODE: Record<string, string> = {
  '01': 'AL',
  '04': 'AZ',
  '05': 'AR',
  '06': 'CA',
  '08': 'CO',
  '09': 'CT',
  '10': 'DE',
  '12': 'FL',
  '13': 'GA',
  '16': 'ID',
  '17': 'IL',
  '18': 'IN',
  '19': 'IA',
  '20': 'KS',
  '21': 'KY',
  '22': 'LA',
  '23': 'ME',
  '24': 'MD',
  '25': 'MA',
  '26': 'MI',
  '27': 'MN',
  '28': 'MS',
  '29': 'MO',
  '30': 'MT',
  '31': 'NE',
  '32': 'NV',
  '33': 'NH',
  '34': 'NJ',
  '35': 'NM',
  '36': 'NY',
  '37': 'NC',
  '38': 'ND',
  '39': 'OH',
  '40': 'OK',
  '41': 'OR',
  '42': 'PA',
  '44': 'RI',
  '45': 'SC',
  '46': 'SD',
  '47': 'TN',
  '48': 'TX',
  '49': 'UT',
  '50': 'VT',
  '51': 'VA',
  '53': 'WA',
  '54': 'WV',
  '55': 'WI',
  '56': 'WY',
};

const REGION_BY_STATE: Record<string, string> = {
  CT: 'northeast',
  ME: 'northeast',
  MA: 'northeast',
  NH: 'northeast',
  NJ: 'northeast',
  NY: 'northeast',
  PA: 'northeast',
  RI: 'northeast',
  VT: 'northeast',
  IL: 'great_lakes_upper_midwest',
  IN: 'great_lakes_upper_midwest',
  IA: 'great_lakes_upper_midwest',
  MI: 'great_lakes_upper_midwest',
  MN: 'great_lakes_upper_midwest',
  MO: 'great_lakes_upper_midwest',
  OH: 'great_lakes_upper_midwest',
  WI: 'great_lakes_upper_midwest',
  AL: 'southeast',
  AR: 'southeast',
  DE: 'southeast',
  FL: 'southeast',
  GA: 'southeast',
  KY: 'southeast',
  LA: 'southeast',
  MD: 'southeast',
  MS: 'southeast',
  NC: 'southeast',
  SC: 'southeast',
  TN: 'southeast',
  VA: 'southeast',
  WV: 'southeast',
  KS: 'plains',
  ND: 'plains',
  NE: 'plains',
  OK: 'plains',
  SD: 'plains',
  TX: 'plains',
  AZ: 'mountain_west',
  CO: 'mountain_west',
  ID: 'mountain_west',
  MT: 'mountain_west',
  NM: 'mountain_west',
  NV: 'mountain_west',
  UT: 'mountain_west',
  WY: 'mountain_west',
  CA: 'pacific_west',
  OR: 'pacific_west',
  WA: 'pacific_west',
};

interface GeoJsonGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: unknown;
}

interface ArcFeature {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: GeoJsonGeometry | null;
}

interface ArcCollection {
  type: 'FeatureCollection';
  features: ArcFeature[];
  exceededTransferLimit?: boolean;
}

interface CountyFeature {
  name: string;
  geoid: string;
  stateCode: string;
  bbox: Bbox;
  geometry: GeoJsonGeometry;
}

type Bbox = [number, number, number, number];

function arg(name: string) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((value) => value.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
}

function hasFlag(name: string) {
  return process.argv.slice(2).includes(name);
}

function numberArg(name: string, fallback: number) {
  const value = arg(name);
  if (value == null) return fallback;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) throw new Error(`Invalid ${name}: ${value}`);
  return n;
}

function prop(props: Record<string, unknown>, key: string): unknown {
  return props[key] ?? props[key.toLowerCase()] ?? props[key.toUpperCase()];
}

function numericProp(props: Record<string, unknown>, key: string): number | null {
  const value = prop(props, key);
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

async function fetchArcCollection(urlString: string, params: Record<string, string | number | boolean>) {
  const url = new URL(urlString);
  url.search = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)])).toString();
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'FinFindr-WaterReader-Preload/1.0' } });
      const text = await response.text();
      if (!response.ok) throw new Error(`ArcGIS fetch failed ${response.status}: ${text}`);
      const body = JSON.parse(text);
      if (body.error) throw new Error(`ArcGIS error: ${body.error.message ?? JSON.stringify(body.error)}`);
      return body as ArcCollection;
    } catch (error) {
      lastError = error;
      if (attempt === 4) break;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

async function downloadCountyBoundaryZip(path: string) {
  const response = await fetch(COUNTY_CARTOGRAPHIC_BOUNDARY_ZIP_URL, {
    headers: { 'User-Agent': 'FinFindr-WaterReader-Preload/1.0' },
  });
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download Census county ZIP: ${response.status} ${response.statusText}`);
  }
  await writeFile(path, response.body);
}

function bboxForGeometry(geometry: GeoJsonGeometry): Bbox | null {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  visitCoordinates(geometry.coordinates, (lon, lat) => {
    minLon = Math.min(minLon, lon);
    minLat = Math.min(minLat, lat);
    maxLon = Math.max(maxLon, lon);
    maxLat = Math.max(maxLat, lat);
  });
  if (![minLon, minLat, maxLon, maxLat].every(Number.isFinite)) return null;
  return [minLon, minLat, maxLon, maxLat];
}

function bboxIntersects(a: Bbox, b: Bbox) {
  return a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];
}

function visitCoordinates(value: unknown, visit: (lon: number, lat: number) => void) {
  if (!Array.isArray(value)) return;
  if (
    value.length >= 2 &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number' &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  ) {
    visit(value[0], value[1]);
    return;
  }
  for (const item of value) visitCoordinates(item, visit);
}

function sampledPoints(geometry: GeoJsonGeometry, bbox: Bbox, maxPoints = 90) {
  const points: Array<[number, number]> = [[(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2]];
  const all: Array<[number, number]> = [];
  visitCoordinates(geometry.coordinates, (lon, lat) => all.push([lon, lat]));
  if (all.length <= maxPoints) {
    points.push(...all);
    return points;
  }
  const step = Math.max(1, Math.floor(all.length / maxPoints));
  for (let i = 0; i < all.length && points.length < maxPoints + 1; i += step) points.push(all[i]!);
  return points;
}

function pointInRing(point: [number, number], ring: unknown): boolean {
  if (!Array.isArray(ring)) return false;
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const pi = ring[i];
    const pj = ring[j];
    if (!Array.isArray(pi) || !Array.isArray(pj)) continue;
    const xi = Number(pi[0]);
    const yi = Number(pi[1]);
    const xj = Number(pj[0]);
    const yj = Number(pj[1]);
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || Number.EPSILON) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInPolygon(point: [number, number], polygon: unknown): boolean {
  if (!Array.isArray(polygon) || polygon.length === 0) return false;
  if (!pointInRing(point, polygon[0])) return false;
  for (let i = 1; i < polygon.length; i++) {
    if (pointInRing(point, polygon[i])) return false;
  }
  return true;
}

function pointInGeometry(point: [number, number], geometry: GeoJsonGeometry) {
  if (geometry.type === 'Polygon') return pointInPolygon(point, geometry.coordinates);
  if (!Array.isArray(geometry.coordinates)) return false;
  return geometry.coordinates.some((polygon) => pointInPolygon(point, polygon));
}

function coordPairWkt(value: unknown): string {
  if (!Array.isArray(value) || typeof value[0] !== 'number' || typeof value[1] !== 'number') {
    throw new Error('Invalid coordinate');
  }
  return `${value[0]} ${value[1]}`;
}

function ringWkt(value: unknown): string {
  if (!Array.isArray(value) || value.length < 4) throw new Error('Invalid ring');
  return `(${value.map(coordPairWkt).join(',')})`;
}

function polygonWkt(value: unknown): string {
  if (!Array.isArray(value) || value.length === 0) throw new Error('Invalid polygon');
  return `(${value.map(ringWkt).join(',')})`;
}

function geometryWkt(geometry: GeoJsonGeometry): string | null {
  try {
    if (geometry.type === 'Polygon') return `MULTIPOLYGON(${polygonWkt(geometry.coordinates)})`;
    if (geometry.type === 'MultiPolygon' && Array.isArray(geometry.coordinates)) {
      return `MULTIPOLYGON(${geometry.coordinates.map(polygonWkt).join(',')})`;
    }
  } catch {
    return null;
  }
  return null;
}

function waterbodyTypeForName(name: string): 'lake' | 'pond' | 'reservoir' {
  const norm = name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/);
  if (norm.includes('reservoir') || norm.includes('res')) return 'reservoir';
  if (norm.includes('pond')) return 'pond';
  return 'lake';
}

function searchPriorityForArea(areaAcres: number | null): number {
  if (areaAcres == null) return 900;
  if (areaAcres >= 10000) return 25;
  if (areaAcres >= 1000) return 75;
  if (areaAcres >= 100) return 150;
  return 300;
}

async function fetchCounties() {
  const tempDir = await mkdtemp(join(tmpdir(), 'water-reader-counties-'));
  const zipPath = join(tempDir, 'counties.zip');
  const counties: CountyFeature[] = [];
  try {
    console.log('Downloading Census county boundary ZIP...');
    await downloadCountyBoundaryZip(zipPath);
    const { stdout } = await execFileAsync('python3', [
      '-c',
      `
import json, struct, sys, zipfile

zip_path = sys.argv[1]
with zipfile.ZipFile(zip_path) as z:
    shp_name = next(n for n in z.namelist() if n.lower().endswith(".shp"))
    dbf_name = next(n for n in z.namelist() if n.lower().endswith(".dbf"))
    shp = z.read(shp_name)
    dbf = z.read(dbf_name)

def parse_dbf(data):
    header_len = struct.unpack("<H", data[8:10])[0]
    record_len = struct.unpack("<H", data[10:12])[0]
    count = struct.unpack("<I", data[4:8])[0]
    fields = []
    pos = 32
    while data[pos] != 13:
        raw_name = data[pos:pos+11].split(b"\\x00", 1)[0].decode("ascii").strip()
        length = data[pos+16]
        fields.append((raw_name, length))
        pos += 32
    rows = []
    pos = header_len
    for _ in range(count):
        record = data[pos:pos+record_len]
        pos += record_len
        if not record or record[0:1] == b"*":
            continue
        offset = 1
        row = {}
        for name, length in fields:
            raw = record[offset:offset+length]
            offset += length
            row[name] = raw.decode("latin1").strip()
        rows.append(row)
    return rows

def signed_area(ring):
    area = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i]
        x2, y2 = ring[i + 1]
        area += x1 * y2 - x2 * y1
    return area / 2.0

def point_in_ring(point, ring):
    x, y = point
    inside = False
    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i]
        xj, yj = ring[j]
        crosses = (yi > y) != (yj > y)
        if crosses:
            x_intersect = (xj - xi) * (y - yi) / ((yj - yi) or 1e-30) + xi
            if x < x_intersect:
                inside = not inside
        j = i
    return inside

def close_ring(ring):
    if ring and ring[0] != ring[-1]:
        ring = ring + [ring[0]]
    return ring

def ring_parent_index(rings, ring_index):
    point = rings[ring_index][0]
    containers = []
    for idx, other in enumerate(rings):
        if idx == ring_index:
            continue
        if abs(signed_area(other)) > abs(signed_area(rings[ring_index])) and point_in_ring(point, other):
            containers.append(idx)
    if not containers:
        return None
    return min(containers, key=lambda idx: abs(signed_area(rings[idx])))

def parts_to_multipolygon(points, parts):
    rings = []
    ends = list(parts[1:]) + [len(points)]
    for start, end in zip(parts, ends):
        ring = close_ring(points[start:end])
        if len(ring) >= 4:
            rings.append(ring)
    if not rings:
        return None

    parents = [ring_parent_index(rings, idx) for idx in range(len(rings))]
    shells = []
    for idx, parent in enumerate(parents):
        depth = 0
        cursor = parent
        while cursor is not None:
            depth += 1
            cursor = parents[cursor]
        if depth % 2 == 0:
            shells.append(idx)

    polygons = []
    for shell_idx in shells:
        shell = rings[shell_idx]
        holes = []
        for idx, parent in enumerate(parents):
            if parent == shell_idx:
                depth = 0
                cursor = parents[idx]
                while cursor is not None:
                    depth += 1
                    cursor = parents[cursor]
                if depth % 2 == 1:
                    holes.append(rings[idx])
        polygons.append([shell] + holes)
    return {"type": "MultiPolygon", "coordinates": polygons} if polygons else None

def parse_shp(data):
    offset = 100
    geometries = []
    while offset + 8 <= len(data):
        content_len_words = struct.unpack(">i", data[offset+4:offset+8])[0]
        content_start = offset + 8
        content_end = content_start + content_len_words * 2
        content = data[content_start:content_end]
        offset = content_end
        if len(content) < 44:
            geometries.append(None)
            continue
        shape_type = struct.unpack("<i", content[0:4])[0]
        if shape_type not in (5, 15, 25, 31):
            geometries.append(None)
            continue
        num_parts = struct.unpack("<i", content[36:40])[0]
        num_points = struct.unpack("<i", content[40:44])[0]
        parts_offset = 44
        points_offset = parts_offset + num_parts * 4
        parts = list(struct.unpack("<" + "i" * num_parts, content[parts_offset:points_offset]))
        points = []
        for i in range(num_points):
            x, y = struct.unpack("<dd", content[points_offset + i*16:points_offset + i*16 + 16])
            points.append([x, y])
        geometries.append(parts_to_multipolygon(points, parts))
    return geometries

rows = parse_dbf(dbf)
geoms = parse_shp(shp)
if len(rows) != len(geoms):
    raise RuntimeError(f"DBF/SHP row mismatch: {len(rows)} attributes for {len(geoms)} geometries")
for row, geom in zip(rows, geoms):
    if geom is None:
        continue
    print(json.dumps({"properties": row, "geometry": geom}, separators=(",", ":")))
`,
      zipPath,
    ], { maxBuffer: 256 * 1024 * 1024 });

    for (const line of stdout.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const feature = JSON.parse(line) as { properties: Record<string, unknown>; geometry: GeoJsonGeometry };
      const stateFips = String(prop(feature.properties, 'STATEFP') ?? '').padStart(2, '0');
      const stateCode = STATE_FIPS_TO_CODE[stateFips];
      const countyFips = String(prop(feature.properties, 'COUNTYFP') ?? '').padStart(3, '0');
      const geoid = String(prop(feature.properties, 'GEOID') ?? `${stateFips}${countyFips}`);
      const name = String(prop(feature.properties, 'NAME') ?? '').replace(/\s+County$/i, '').trim();
      const bbox = bboxForGeometry(feature.geometry);
      if (!stateCode || !bbox || !name) continue;
      counties.push({ geoid, name, stateCode, bbox, geometry: feature.geometry });
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
  console.log(`Loaded ${counties.length} mainland county polygons.`);
  return counties;
}

function countyForWaterbody(geometry: GeoJsonGeometry, bbox: Bbox, counties: CountyFeature[]) {
  const candidates = counties.filter((county) => bboxIntersects(bbox, county.bbox));
  const points = sampledPoints(geometry, bbox);
  let best: { county: CountyFeature; votes: number } | null = null;
  for (const county of candidates) {
    let votes = 0;
    for (const point of points) {
      if (pointInGeometry(point, county.geometry)) votes++;
    }
    if (votes > 0 && (!best || votes > best.votes)) best = { county, votes };
  }
  return best;
}

async function main() {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) throw new Error('Missing Supabase env.');

  const limit = numberArg('--limit', 0);
  const startOffset = numberArg('--start-offset', 0);
  const pageSize = numberArg('--page-size', PAGE_SIZE_DEFAULT);
  const minAreaAcres = numberArg('--min-area-acres', MIN_AREA_ACRES_DEFAULT);
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 2000) {
    throw new Error('--page-size must be an integer between 1 and 2000.');
  }
  const dryRun = hasFlag('--dry-run');
  const minAreaSqKm = minAreaAcres * SQKM_PER_ACRE;
  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  console.log(`Preloading USGS 3DHP named standing water >= ${minAreaAcres} acres${dryRun ? ' (dry run)' : ''}...`);
  const counties = await fetchCounties();
  console.log(`County enrichment ready: ${counties.length} county polygons.`);

  let offset = startOffset;
  let fetched = 0;
  let prepared = 0;
  let upserted = 0;
  let skippedNoCounty = 0;
  let skippedGeometry = 0;
  let batch: Record<string, unknown>[] = [];

  async function flush() {
    if (batch.length === 0) return;
    if (!dryRun) {
      let lastError: unknown = null;
      for (let attempt = 1; attempt <= 4; attempt++) {
        try {
          const { error } = await supabase
            .from('waterbody_index')
            .upsert(batch, { onConflict: 'external_source,external_id' });
          if (error) throw new Error(error.message);
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
          if (attempt < 4) await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
        }
      }
      if (lastError) {
        const message = lastError instanceof Error ? lastError.message : String(lastError);
        throw new Error(`Supabase upsert failed: ${message}`);
      }
    }
    upserted += batch.length;
    console.log(`Prepared ${prepared}; upserted ${upserted}; skipped no county ${skippedNoCounty}; skipped geometry ${skippedGeometry}`);
    batch = [];
  }

  while (limit === 0 || fetched < limit) {
    const recordCount = limit === 0 ? pageSize : Math.min(pageSize, limit - fetched);
    const collection = await fetchArcCollection(WATERBODY_LAYER_URL, {
      f: 'geojson',
      where: `featuretype = 3 AND gnisidlabel IS NOT NULL AND areasqkm >= ${minAreaSqKm}`,
      outFields: 'OBJECTID,id3dhp,gnisid,gnisidlabel,featuretype,featuretypelabel,areasqkm,workunitid,featuredate',
      returnGeometry: true,
      outSR: 4326,
      orderByFields: 'OBJECTID',
      resultOffset: offset,
      resultRecordCount: recordCount,
      geometryPrecision: 6,
    });
    if (collection.features.length === 0) break;

    for (const feature of collection.features) {
      fetched++;
      if (!feature.geometry) {
        skippedGeometry++;
        continue;
      }
      const bbox = bboxForGeometry(feature.geometry);
      const wkt = geometryWkt(feature.geometry);
      if (!bbox || !wkt) {
        skippedGeometry++;
        continue;
      }
      const countyMatch = countyForWaterbody(feature.geometry, bbox, counties);
      if (!countyMatch) {
        skippedNoCounty++;
        continue;
      }
      const name = String(prop(feature.properties, 'gnisidlabel') ?? '').trim();
      const id3dhp = String(prop(feature.properties, 'id3dhp') ?? prop(feature.properties, 'OBJECTID') ?? '').trim();
      if (!name || !id3dhp) continue;
      const areaSqKm = numericProp(feature.properties, 'areasqkm');
      const areaAcres = areaSqKm == null ? null : areaSqKm * ACRES_PER_SQKM;
      const centroidLon = (bbox[0] + bbox[2]) / 2;
      const centroidLat = (bbox[1] + bbox[3]) / 2;
      const county = countyMatch.county;
      batch.push({
        external_source: 'usgs_3dhp_waterbody',
        external_id: `3dhp:${id3dhp}`,
        canonical_name: name,
        state_code: county.stateCode,
        county_name: county.name,
        waterbody_type: waterbodyTypeForName(name),
        is_named: true,
        is_searchable: true,
        region_key: REGION_BY_STATE[county.stateCode] ?? 'other_us',
        centroid: `POINT(${centroidLon} ${centroidLat})`,
        geometry: wkt,
        surface_area_acres: areaAcres,
        search_priority: searchPriorityForArea(areaAcres),
        source_summary: {
          source: 'USGS 3D Hydrography Program 3DHP_all Waterbody',
          source_key: 'usgs_3dhp',
          source_layer_url: 'https://hydro.nationalmap.gov/arcgis/rest/services/3DHP_all/FeatureServer/60',
          objectid: numericProp(feature.properties, 'OBJECTID'),
          featuretype: numericProp(feature.properties, 'featuretype'),
          featuretypelabel: prop(feature.properties, 'featuretypelabel') ?? 'Lake',
          id3dhp,
          id3dhp_persistent: false,
          gnisid: prop(feature.properties, 'gnisid') ?? null,
          workunitid: prop(feature.properties, 'workunitid') ?? null,
          standing_water_only: true,
          preload: {
            min_area_acres: minAreaAcres,
            county_lookup: {
              source: 'Census cartographic county boundaries 2024',
              geoid: county.geoid,
              method: 'sampled_geometry_point_votes',
              votes: countyMatch.votes,
            },
          },
        },
      });
      prepared++;
      if (batch.length >= UPSERT_BATCH_SIZE) await flush();
    }

    if (collection.features.length < recordCount) break;
    offset += collection.features.length;
  }

  await flush();
  console.log(JSON.stringify({ fetched, prepared, upserted, skippedNoCounty, skippedGeometry, dryRun }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
