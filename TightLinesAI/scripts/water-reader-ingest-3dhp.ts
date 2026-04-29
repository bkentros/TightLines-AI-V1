/**
 * Water Reader named-waterbody ingest generator.
 *
 * Generates a SQL import file for USGS 3DHP standing-water polygons and optional
 * Census TIGERweb county boundaries, then promotes staged records into
 * public.waterbody_index through the private promotion function.
 *
 * Typical subset proof:
 *   deno run --allow-net --allow-read --allow-write --allow-run=python3 scripts/water-reader-ingest-3dhp.ts \
 *     --out tmp/water-reader/3dhp-mn-subset.sql \
 *     --include-counties \
 *     --bbox -97.5,43.4,-89.0,49.4 \
 *     --limit 5000
 *
 * National chunked rollout (same ingest run id, OBJECTID ranges; see docs/WATER_READER_V1_POLYGON_BUILD_PLAN.md):
 *   export INGEST_RUN_ID="$(uuidgen | tr '[:upper:]' '[:lower:]')"
 *   deno run ... --out tmp/water-reader/national/000-counties.sql --include-counties --skip-waterbodies \
 *     --skip-promote --ingest-run-id "$INGEST_RUN_ID" --target-scope national
 *   deno run ... --out tmp/water-reader/national/001-waterbodies.sql --skip-ingest-run-row \
 *     --where "featuretype = 3 AND gnisidlabel IS NOT NULL AND OBJECTID >= 64 AND OBJECTID <= 650687" \
 *     --skip-promote --ingest-run-id "$INGEST_RUN_ID" --target-scope national
 *   deno run ... --out tmp/water-reader/national/999-promote.sql --promote-only --ingest-run-id "$INGEST_RUN_ID"
 *
 * Apply generated SQL with:
 *   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f tmp/water-reader/3dhp-national.sql
 */

const WATERBODY_LAYER_URL =
  "https://hydro.nationalmap.gov/arcgis/rest/services/3DHP_all/FeatureServer/60/query";
const COUNTY_LAYER_URL =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/25/query";
const COUNTY_CARTOGRAPHIC_BOUNDARY_ZIP_URL =
  "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_county_500k.zip";

const STATE_FIPS_TO_CODE: Record<string, string> = {
  "01": "AL",
  "02": "AK",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  "10": "DE",
  "11": "DC",
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
  "60": "AS",
  "66": "GU",
  "69": "MP",
  "72": "PR",
  "78": "VI",
};

type JsonObject = Record<string, unknown>;

interface Feature {
  type: "Feature";
  id?: string | number;
  properties: JsonObject;
  geometry: JsonObject | null;
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
  exceededTransferLimit?: boolean;
}

interface Options {
  outPath: string;
  includeCounties: boolean;
  skipPromote: boolean;
  skipWaterbodies: boolean;
  limit: number | null;
  pageSize: number;
  minAreaSqkm: number;
  bbox: string | null;
  countyBbox: string | null;
  where: string;
  gnisAllNamesPath: string | null;
  ingestRunId: string | null;
  targetScope: string | null;
  skipIngestRunRow: boolean;
  promoteOnly: boolean;
}

function parseArgs(): Options {
  const args = [...Deno.args];
  const options: Options = {
    outPath: "tmp/water-reader/3dhp-import.sql",
    includeCounties: false,
    skipPromote: false,
    skipWaterbodies: false,
    limit: null,
    pageSize: 2500,
    minAreaSqkm: 0,
    bbox: null,
    countyBbox: null,
    where: "featuretype = 3 AND gnisidlabel IS NOT NULL",
    gnisAllNamesPath: null,
    ingestRunId: null,
    targetScope: null,
    skipIngestRunRow: false,
    promoteOnly: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    const next = args[i + 1];
    if (arg === "--out" && next) {
      options.outPath = next;
      i++;
    } else if (arg === "--include-counties") {
      options.includeCounties = true;
    } else if (arg === "--skip-promote") {
      options.skipPromote = true;
    } else if (arg === "--skip-waterbodies") {
      options.skipWaterbodies = true;
    } else if (arg === "--counties-only") {
      options.skipWaterbodies = true;
    } else if (arg === "--ingest-run-id" && next) {
      options.ingestRunId = next;
      i++;
    } else if (arg === "--target-scope" && next) {
      options.targetScope = next;
      i++;
    } else if (arg === "--skip-ingest-run-row") {
      options.skipIngestRunRow = true;
    } else if (arg === "--promote-only") {
      options.promoteOnly = true;
    } else if (arg === "--limit" && next) {
      options.limit = Number(next);
      i++;
    } else if (arg === "--page-size" && next) {
      options.pageSize = Number(next);
      i++;
    } else if (arg === "--min-area-sqkm" && next) {
      options.minAreaSqkm = Number(next);
      i++;
    } else if (arg === "--bbox" && next) {
      options.bbox = next;
      i++;
    } else if (arg === "--county-bbox" && next) {
      options.countyBbox = next;
      i++;
    } else if (arg === "--where" && next) {
      options.where = next;
      i++;
    } else if (arg === "--gnis-all-names-file" && next) {
      options.gnisAllNamesPath = next;
      i++;
    } else if (arg === "--help") {
      printHelpAndExit();
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }

  if (options.promoteOnly) {
    if (options.ingestRunId === null) {
      throw new Error("--promote-only requires --ingest-run-id.");
    }
    if (options.gnisAllNamesPath !== null) {
      throw new Error("--promote-only cannot be combined with --gnis-all-names-file.");
    }
    options.includeCounties = false;
    options.skipWaterbodies = true;
    options.skipIngestRunRow = true;
    options.skipPromote = false;
  }

  if (!Number.isFinite(options.pageSize) || options.pageSize < 1 || options.pageSize > 2500) {
    throw new Error("--page-size must be between 1 and 2500 for the 3DHP service.");
  }
  if (options.limit !== null && (!Number.isFinite(options.limit) || options.limit < 1)) {
    throw new Error("--limit must be a positive number.");
  }
  if (!Number.isFinite(options.minAreaSqkm) || options.minAreaSqkm < 0) {
    throw new Error("--min-area-sqkm must be zero or greater.");
  }
  validateBbox(options.bbox, "--bbox");
  validateBbox(options.countyBbox, "--county-bbox");
  if (options.ingestRunId !== null) {
    validateUuid(options.ingestRunId, "--ingest-run-id");
  }
  if (options.skipWaterbodies && options.gnisAllNamesPath !== null) {
    throw new Error("--gnis-all-names-file cannot be used with --skip-waterbodies / --counties-only.");
  }
  if (options.skipWaterbodies && !options.includeCounties && !options.promoteOnly) {
    throw new Error(
      "Nothing to generate with --skip-waterbodies: add --include-counties for a counties-only file, or remove --skip-waterbodies.",
    );
  }
  if (options.skipIngestRunRow) {
    if (options.ingestRunId === null) {
      throw new Error("--skip-ingest-run-row requires --ingest-run-id (init the run in a prior SQL file).");
    }
    if (options.includeCounties) {
      throw new Error("--skip-ingest-run-row cannot be combined with --include-counties.");
    }
  }

  return options;
}

function validateUuid(value: string, flag: string) {
  const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(value.trim())) {
    throw new Error(`${flag} must be a UUID.`);
  }
}

function validateBbox(value: string | null, flag: string) {
  if (!value) return;
  const parts = value.split(",").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) {
    throw new Error(`${flag} must be xmin,ymin,xmax,ymax in EPSG:4326.`);
  }
  if (parts[0]! >= parts[2]! || parts[1]! >= parts[3]!) {
    throw new Error(`${flag} must have xmin < xmax and ymin < ymax.`);
  }
}

function printHelpAndExit(): never {
  console.log(`Water Reader 3DHP ingest SQL generator

Options:
  --out <path>                  SQL output path
  --include-counties            Stage Census TIGERweb county boundaries first
  --skip-promote                Generate staging SQL without promotion call
  --skip-waterbodies            Skip 3DHP waterbody fetch and staging (counties and/or aliases only)
  --counties-only               Same as --skip-waterbodies
  --ingest-run-id <uuid>        Use a fixed ingest run id for chunked national loads
  --target-scope <text>         Override target_scope on waterbody_ingest_runs (default bbox:... or national)
  --skip-ingest-run-row         Omit waterbody_ingest_runs insert (use after an init chunk created the run)
  --promote-only                Emit only promote_usgs_3dhp_waterbodies (requires --ingest-run-id)
  --limit <n>                   Stop after n 3DHP waterbody features
  --page-size <n>               3DHP page size, max 2500
  --bbox xmin,ymin,xmax,ymax    Restrict 3DHP query to EPSG:4326 bbox
  --county-bbox xmin,ymin,xmax,ymax
                                Restrict county staging to an EPSG:4326 bbox
                                Defaults to --bbox when --include-counties is set
  --where <sql>                 ArcGIS where clause, default named standing water
  --min-area-sqkm <n>           Promotion minimum area
  --gnis-all-names-file <path>  Optional pipe-delimited GNIS All Names alias file
`);
  Deno.exit(0);
}

function ensureZipAvailable() {
  const command = new Deno.Command("python3", {
    args: ["-c", "import zipfile"],
    stdout: "null",
    stderr: "null",
  });
  const { code } = command.outputSync();
  if (code !== 0) {
    throw new Error("python3 with the standard zipfile module is required for Census county fallback downloads.");
  }
}

async function downloadCountyBoundaryZip() {
  ensureZipAvailable();
  const zipPath = await Deno.makeTempFile({ prefix: "water-reader-counties-", suffix: ".zip" });
  console.log("TIGERweb county query unavailable; downloading Census cartographic county ZIP fallback...");
  const response = await fetch(COUNTY_CARTOGRAPHIC_BOUNDARY_ZIP_URL, {
    headers: {
      "User-Agent": "FinFindr-WaterReader-Ingest/1.0 (+https://github.com/bkentros/TightLines-AI-V1)",
    },
  });
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download county fallback ZIP: ${response.status} ${response.statusText}`);
  }
  await Deno.writeFile(zipPath, response.body);
  return zipPath;
}

function geometryBbox(geometry: JsonObject): [number, number, number, number] | null {
  let xmin = Infinity;
  let ymin = Infinity;
  let xmax = -Infinity;
  let ymax = -Infinity;

  function visit(value: unknown) {
    if (!Array.isArray(value)) return;
    if (
      value.length >= 2 &&
      typeof value[0] === "number" &&
      typeof value[1] === "number"
    ) {
      const x = value[0];
      const y = value[1];
      xmin = Math.min(xmin, x);
      ymin = Math.min(ymin, y);
      xmax = Math.max(xmax, x);
      ymax = Math.max(ymax, y);
      return;
    }
    for (const item of value) visit(item);
  }

  visit(geometry.coordinates);
  if (![xmin, ymin, xmax, ymax].every(Number.isFinite)) return null;
  return [xmin, ymin, xmax, ymax];
}

function bboxIntersects(
  a: [number, number, number, number],
  b: [number, number, number, number],
) {
  return a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];
}

function parseBbox(value: string | null): [number, number, number, number] | null {
  if (!value) return null;
  const parts = value.split(",").map(Number);
  return [parts[0]!, parts[1]!, parts[2]!, parts[3]!];
}

async function stageCountiesFromZip(file: Deno.FsFile, zipPath: string, countyBbox: string | null) {
  const python = new Deno.Command("python3", {
    args: [
      "-c",
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

def representative_point(ring):
    return ring[0]

def close_ring(ring):
    if ring and ring[0] != ring[-1]:
        ring = ring + [ring[0]]
    return ring

def ring_parent_index(rings, ring_index):
    point = representative_point(rings[ring_index])
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

    if not polygons:
        return None
    return {"type": "MultiPolygon", "coordinates": polygons}

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
        multipolygon = parts_to_multipolygon(points, parts)
        geometries.append(multipolygon)
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
    ],
    stdout: "piped",
    stderr: "piped",
  });
  const { code, stdout, stderr } = await python.output();
  if (code !== 0) {
    throw new Error(new TextDecoder().decode(stderr));
  }

  const lines = new TextDecoder().decode(stdout).split(/\r?\n/).filter(Boolean);
  const rows: string[] = [];
  const countyBounds = parseBbox(countyBbox);
  for (const line of lines) {
    const feature = JSON.parse(line) as { properties: JsonObject; geometry: JsonObject };
    if (countyBounds) {
      const bounds = geometryBbox(feature.geometry);
      if (!bounds || !bboxIntersects(bounds, countyBounds)) continue;
    }
    const stateFips = String(prop(feature.properties, "STATEFP") ?? "").padStart(2, "0");
    const countyFips = String(prop(feature.properties, "COUNTYFP") ?? "").padStart(3, "0");
    const geoid = String(prop(feature.properties, "GEOID") ?? `${stateFips}${countyFips}`);
    const stateCode = STATE_FIPS_TO_CODE[stateFips];
    const countyName = String(prop(feature.properties, "NAME") ?? "");
    if (!stateCode || countyName.length === 0) continue;
    rows.push(`(${sql(geoid)}, ${sql(stateFips)}, ${sql(stateCode)}, ${sql(countyFips)}, ${sql(countyName)}, 'census_cb_2024_counties_500k', '2024', ${sql(feature.geometry)})`);
  }

  await writeBatch(file, rows, "counties");
  console.log(`Staged ${rows.length} county boundary rows from Census cartographic fallback.`);
}

function sql(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `'${text.replaceAll("'", "''")}'`;
}

function prop(properties: JsonObject, key: string): unknown {
  return properties[key] ?? properties[key.toLowerCase()] ?? properties[key.toUpperCase()] ?? null;
}

function numericProp(properties: JsonObject, key: string): number | null {
  const value = prop(properties, key);
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function params(entries: Record<string, string | number | boolean>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(entries)) {
    search.set(key, String(value));
  }
  return search.toString();
}

async function fetchGeoJson(url: string, query: Record<string, string | number | boolean>) {
  const response = await fetch(`${url}?${params(query)}`, {
    headers: {
      "Accept": "application/json, application/geo+json",
      "User-Agent": "FinFindr-WaterReader-Ingest/1.0 (+https://github.com/bkentros/TightLines-AI-V1)",
    },
  });
  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status} ${response.statusText}: ${response.url}`);
  }
  const text = await response.text();
  let body: FeatureCollection | { error?: { message?: string } };
  try {
    body = JSON.parse(text) as FeatureCollection | { error?: { message?: string } };
  } catch {
    throw new Error(
      `Expected JSON from ${response.url}, received ${response.headers.get("content-type") ?? "unknown"}: ${
        text.slice(0, 160).replaceAll(/\s+/g, " ")
      }`,
    );
  }
  if ("error" in body && body.error) {
    throw new Error(`ArcGIS query failed: ${body.error.message ?? JSON.stringify(body.error)}`);
  }
  return body as FeatureCollection;
}

function geometryExpression(alias: string) {
  return `ST_Multi(ST_CollectionExtract(ST_MakeValid(ST_Force2D(ST_SetSRID(ST_GeomFromGeoJSON(${alias}), 4326))), 3))`;
}

async function writeBatch(file: Deno.FsFile, rows: string[], table: "counties" | "waterbodies" | "aliases") {
  if (rows.length === 0) return;

  if (table === "counties") {
    await file.write(new TextEncoder().encode(`
with incoming (geoid, state_fips, state_code, county_fips, county_name, source_key, source_revision, geometry_json) as (
  values
    ${rows.join(",\n    ")}
)
insert into water_reader_private.us_county_boundaries (
  geoid,
  state_fips,
  state_code,
  county_fips,
  county_name,
  source_key,
  source_revision,
  geom
)
select
  geoid,
  state_fips,
  state_code,
  county_fips,
  county_name,
  source_key,
  source_revision,
  ${geometryExpression("geometry_json")} as geom
from incoming
where geometry_json is not null
on conflict (geoid) do update
set
  state_fips = excluded.state_fips,
  state_code = excluded.state_code,
  county_fips = excluded.county_fips,
  county_name = excluded.county_name,
  source_key = excluded.source_key,
  source_revision = excluded.source_revision,
  geom = excluded.geom,
  updated_at = timezone('utc', now());
`));
  } else if (table === "waterbodies") {
    await file.write(new TextEncoder().encode(`
with incoming (
  ingest_run_id,
  objectid,
  id3dhp,
  gnisid,
  gnisidlabel,
  featuretype,
  featuretypelabel,
  areasqkm,
  source_properties,
  geometry_json
) as (
  values
    ${rows.join(",\n    ")}
),
normalized as (
  select
    ingest_run_id,
    objectid,
    id3dhp,
    gnisid,
    gnisidlabel,
    featuretype,
    featuretypelabel,
    areasqkm,
    source_properties,
    ${geometryExpression("geometry_json")} as geom
  from incoming
  where geometry_json is not null
)
insert into water_reader_private.usgs_3dhp_waterbody_stage (
  ingest_run_id,
  objectid,
  id3dhp,
  gnisid,
  gnisidlabel,
  featuretype,
  featuretypelabel,
  areasqkm,
  source_properties,
  source_geometry,
  source_centroid
)
select
  ingest_run_id::uuid,
  objectid,
  id3dhp,
  gnisid,
  gnisidlabel,
  featuretype,
  featuretypelabel,
  areasqkm,
  source_properties,
  geom,
  ST_PointOnSurface(geom)
from normalized
where not ST_IsEmpty(geom)
on conflict (ingest_run_id, id3dhp) do update
set
  objectid = excluded.objectid,
  gnisid = excluded.gnisid,
  gnisidlabel = excluded.gnisidlabel,
  featuretype = excluded.featuretype,
  featuretypelabel = excluded.featuretypelabel,
  areasqkm = excluded.areasqkm,
  source_properties = excluded.source_properties,
  source_geometry = excluded.source_geometry,
  source_centroid = excluded.source_centroid,
  imported_at = timezone('utc', now());
`));
  } else {
    await file.write(new TextEncoder().encode(`
insert into water_reader_private.gnis_alias_stage (
  ingest_run_id,
  gnisid,
  alias_name,
  alias_kind,
  source_properties
)
values
  ${rows.join(",\n  ")}
on conflict (ingest_run_id, gnisid, alias_name) do update
set
  alias_kind = excluded.alias_kind,
  source_properties = excluded.source_properties,
  imported_at = timezone('utc', now());
`));
  }
}

async function stageCounties(file: Deno.FsFile, countyBbox: string | null) {
  console.log("Fetching Census TIGERweb county boundaries...");
  let collection: FeatureCollection | null = null;
  const query: Record<string, string | number | boolean> = {
    f: "geojson",
    where: "1=1",
    outFields: "STATE,COUNTY,GEOID,NAME,BASENAME",
    returnGeometry: true,
    outSR: 4326,
    resultRecordCount: 100000,
  };
  if (countyBbox) {
    query.geometry = countyBbox;
    query.geometryType = "esriGeometryEnvelope";
    query.inSR = 4326;
    query.spatialRel = "esriSpatialRelIntersects";
  }
  try {
    collection = await fetchGeoJson(COUNTY_LAYER_URL, query);
  } catch (error) {
    console.warn(error instanceof Error ? error.message : String(error));
    const zipPath = await downloadCountyBoundaryZip();
    try {
      await stageCountiesFromZip(file, zipPath, countyBbox);
    } finally {
      await Deno.remove(zipPath).catch(() => {});
    }
    return;
  }

  const rows: string[] = [];
  const countyBounds = parseBbox(countyBbox);
  for (const feature of collection.features) {
    if (!feature.geometry) continue;
    if (countyBounds) {
      const bounds = geometryBbox(feature.geometry);
      if (!bounds || !bboxIntersects(bounds, countyBounds)) continue;
    }
    const stateFips = String(prop(feature.properties, "STATE") ?? "").padStart(2, "0");
    const countyFips = String(prop(feature.properties, "COUNTY") ?? "").padStart(3, "0");
    const geoid = String(prop(feature.properties, "GEOID") ?? `${stateFips}${countyFips}`);
    const stateCode = STATE_FIPS_TO_CODE[stateFips];
    const countyName = String(prop(feature.properties, "BASENAME") ?? prop(feature.properties, "NAME") ?? "");
    if (!stateCode || countyName.length === 0) continue;
    rows.push(`(${sql(geoid)}, ${sql(stateFips)}, ${sql(stateCode)}, ${sql(countyFips)}, ${sql(countyName)}, 'census_tigerweb_counties', 'ACS 2025', ${sql(feature.geometry)})`);
  }

  await writeBatch(file, rows, "counties");
  console.log(`Staged ${rows.length} county boundary rows.`);
}

function waterbodyRow(ingestRunId: string, feature: Feature): string | null {
  if (!feature.geometry) return null;
  const objectid = numericProp(feature.properties, "OBJECTID");
  const id3dhp = String(prop(feature.properties, "id3dhp") ?? objectid ?? "").trim();
  if (id3dhp.length === 0) return null;
  return `(${sql(ingestRunId)}, ${sql(objectid)}, ${sql(id3dhp)}, ${sql(prop(feature.properties, "gnisid"))}, ${sql(prop(feature.properties, "gnisidlabel"))}, ${sql(numericProp(feature.properties, "featuretype"))}, ${sql(prop(feature.properties, "featuretypelabel"))}, ${sql(numericProp(feature.properties, "areasqkm"))}, ${sql(feature.properties)}::jsonb, ${sql(feature.geometry)})`;
}

async function stageWaterbodies(file: Deno.FsFile, ingestRunId: string, options: Options) {
  console.log("Fetching USGS 3DHP Waterbody features...");
  let offset = 0;
  let total = 0;
  let batch: string[] = [];

  while (options.limit === null || total < options.limit) {
    const recordCount = options.limit === null
      ? options.pageSize
      : Math.min(options.pageSize, options.limit - total);
    const query: Record<string, string | number | boolean> = {
      f: "geojson",
      where: options.where,
      outFields: "OBJECTID,id3dhp,gnisid,gnisidlabel,featuretype,featuretypelabel,areasqkm,workunitid,featuredate",
      returnGeometry: true,
      outSR: 4326,
      orderByFields: "OBJECTID",
      resultOffset: offset,
      resultRecordCount: recordCount,
    };

    if (options.bbox) {
      query.geometry = options.bbox;
      query.geometryType = "esriGeometryEnvelope";
      query.inSR = 4326;
      query.spatialRel = "esriSpatialRelIntersects";
    }

    const collection = await fetchGeoJson(WATERBODY_LAYER_URL, query);
    if (collection.features.length === 0) break;

    for (const feature of collection.features) {
      const row = waterbodyRow(ingestRunId, feature);
      if (!row) continue;
      batch.push(row);
      total++;
      if (batch.length >= 250) {
        await writeBatch(file, batch, "waterbodies");
        batch = [];
      }
      if (options.limit !== null && total >= options.limit) break;
    }

    console.log(`Fetched ${total} waterbody features...`);
    if (collection.features.length < recordCount) break;
    offset += collection.features.length;
  }

  await writeBatch(file, batch, "waterbodies");
  console.log(`Staged ${total} USGS 3DHP waterbody rows.`);
}

function pickHeader(headers: string[], candidates: string[]) {
  const normalized = new Map(headers.map((header) => [header.toLowerCase().replaceAll(/[^a-z0-9]/g, ""), header]));
  for (const candidate of candidates) {
    const match = normalized.get(candidate.toLowerCase().replaceAll(/[^a-z0-9]/g, ""));
    if (match) return match;
  }
  return null;
}

async function stageGnisAliases(file: Deno.FsFile, ingestRunId: string, path: string) {
  console.log(`Reading GNIS aliases from ${path}...`);
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return;

  const headers = lines[0]!.split("|");
  const idHeader = pickHeader(headers, ["feature_id", "featureid", "gnisid"]);
  const nameHeader = pickHeader(headers, ["feature_name", "featurename", "name"]);
  const kindHeader = pickHeader(headers, ["name_type", "nametype", "record_type"]);
  if (!idHeader || !nameHeader) {
    throw new Error("GNIS alias file must include feature_id/gnisid and feature_name/name columns.");
  }

  const idIndex = headers.indexOf(idHeader);
  const nameIndex = headers.indexOf(nameHeader);
  const kindIndex = kindHeader ? headers.indexOf(kindHeader) : -1;
  let batch: string[] = [];
  let total = 0;

  for (const line of lines.slice(1)) {
    const cells = line.split("|");
    const gnisid = cells[idIndex]?.trim();
    const aliasName = cells[nameIndex]?.trim();
    const aliasKind = kindIndex >= 0 ? cells[kindIndex]?.trim() || "variant" : "variant";
    if (!gnisid || !aliasName) continue;
    batch.push(`(${sql(ingestRunId)}, ${sql(gnisid)}, ${sql(aliasName)}, ${sql(aliasKind)}, ${sql({ source: "gnis_all_names" })}::jsonb)`);
    total++;
    if (batch.length >= 500) {
      await writeBatch(file, batch, "aliases");
      batch = [];
    }
  }

  await writeBatch(file, batch, "aliases");
  console.log(`Staged ${total} GNIS alias rows.`);
}

async function main() {
  const options = parseArgs();
  const countyBbox = options.countyBbox ?? options.bbox;
  const ingestRunId = options.ingestRunId?.trim() ?? crypto.randomUUID();
  const targetScope = options.targetScope?.trim() ??
    (options.bbox ? `bbox:${options.bbox}` : "national");
  await Deno.mkdir(options.outPath.split("/").slice(0, -1).join("/") || ".", { recursive: true });
  const file = await Deno.open(options.outPath, { create: true, truncate: true, write: true });

  try {
    const ingestRunSql = options.skipIngestRunRow
      ? ""
      : `
insert into water_reader_private.waterbody_ingest_runs (
  id,
  source_key,
  source_name,
  source_url,
  source_revision,
  target_scope,
  status,
  metadata
)
values (
  ${sql(ingestRunId)}::uuid,
  'usgs_3dhp',
  'USGS 3D Hydrography Program 3DHP_all Waterbody',
  'https://hydro.nationalmap.gov/arcgis/rest/services/3DHP_all/FeatureServer/60',
  '3DHP web services last updated March 2026',
  ${sql(targetScope)},
  'staged',
  ${sql({
    where: options.where,
    bbox: options.bbox,
    countyBbox,
    limit: options.limit,
    includeCounties: options.includeCounties,
    skipWaterbodies: options.skipWaterbodies,
    minAreaSqkm: options.minAreaSqkm,
    targetScope,
  })}::jsonb
)
on conflict (id) do update
set metadata = excluded.metadata;
`;
    await file.write(new TextEncoder().encode(`-- Generated by scripts/water-reader-ingest-3dhp.ts
-- Ingest run: ${ingestRunId}
begin;
${ingestRunSql}
`));

    if (options.includeCounties) {
      await stageCounties(file, countyBbox);
    }
    if (!options.skipWaterbodies) {
      await stageWaterbodies(file, ingestRunId, options);
    }
    if (options.gnisAllNamesPath && !options.skipWaterbodies) {
      await stageGnisAliases(file, ingestRunId, options.gnisAllNamesPath);
    }
    if (!options.skipPromote) {
      await file.write(new TextEncoder().encode(`
select *
from water_reader_private.promote_usgs_3dhp_waterbodies(
  ${sql(ingestRunId)}::uuid,
  ${sql(options.minAreaSqkm)}
);
`));
    }
    await file.write(new TextEncoder().encode("\ncommit;\n"));
  } catch (error) {
    await file.write(new TextEncoder().encode("\nrollback;\n"));
    throw error;
  } finally {
    file.close();
  }

  console.log(`Wrote ${options.outPath}`);
}

if (import.meta.main) {
  await main();
}
