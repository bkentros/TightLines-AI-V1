/**
 * Draft MN DNR expansion candidates: resolve DOWLKNUM via ArcGIS distinct query,
 * emit GeoJSON + count-probe URL templates (not applied to DB).
 *
 * Input: scripts/data/mn_dnr_expansion_seed_waterbodies.json
 * Output: docs/water_reader_mn_dnr_expansion_batch_candidate.json
 *
 * Run: deno run -A scripts/water-reader-mn-dnr-build-expansion-candidates.ts
 *
 * Optional env (same directory as this script):
 *   MN_DNR_EXPANSION_SEED — filename under `scripts/data/` (default `mn_dnr_expansion_seed_waterbodies.json`)
 *   MN_DNR_EXPANSION_OUT — filename under `docs/` (default `water_reader_mn_dnr_expansion_batch_candidate.json`)
 */

const LAYER_QUERY =
  "https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query";

const OUT_FIELDS = "DEPTH,DOWLKNUM,LAKE_NAME,OBJECTID,abs_depth";
const EXPECTED_FIELDS = ["DEPTH", "abs_depth", "DOWLKNUM", "LAKE_NAME", "OBJECTID"];
const GEOM_TYPES = ["LineString", "MultiLineString"];

type SeedRow = {
  id: string;
  canonical_name: string;
  county_name: string;
  surface_area_acres: number;
};

type Candidate = {
  waterbody_id: string;
  canonical_name: string;
  county_name: string;
  surface_area_acres: number;
  matching_evidence: string;
  dowlknum_resolution: {
    status: "none" | "unique" | "multi" | "too_many";
    pairs: { dowlknum: string; lake_name: string }[];
    arcgis_where_used: string;
  };
  source_path: string | null;
  fetch_validation_url: string | null;
  expected_geometry_types: string[];
  expected_property_fields: string[];
  review_notes: string[];
};

function sqlQuote(s: string): string {
  return `'${s.replace(/'/g, "''")}'`;
}

/** Ordered from most specific to least; generator tries each until a hit (prefers unique). */
function searchTokensForCanonical(canonical: string): string[] {
  const raw = canonical.trim();
  const noLakePrefix = raw.replace(/^Lake\s+/i, "").trim();
  const add = (arr: string[], t: string) => {
    const s = t.trim();
    if (s.length < 3) return;
    if (!arr.includes(s)) arr.push(s);
  };
  const tokens: string[] = [];
  add(tokens, raw);
  add(tokens, noLakePrefix);
  const withoutLakeSuffix = noLakePrefix.replace(/\s+Lake$/i, "").trim();
  if (withoutLakeSuffix !== noLakePrefix) add(tokens, withoutLakeSuffix);

  const isRedLakeFamily = /red\s+lake/i.test(raw) && /^(lower|upper)\s+/i.test(raw);
  if (isRedLakeFamily) {
    if (/lower\s+red/i.test(raw)) add(tokens, "Lower Red");
    if (/upper\s+red/i.test(raw)) add(tokens, "Upper Red");
  }

  return tokens;
}

function buildWhereIn(dnums: string[]): string {
  return `DOWLKNUM IN (${dnums.map((d) => sqlQuote(d)).join(",")})`;
}

function buildDataUrl(whereClause: string): string {
  const p = new URLSearchParams({
    f: "geojson",
    returnGeometry: "true",
    returnNullGeometry: "false",
    outFields: OUT_FIELDS,
    outSR: "4326",
    resultRecordCount: "4000",
    where: whereClause,
  });
  return `${LAYER_QUERY}?${p.toString()}`;
}

function buildCountProbeUrl(whereClause: string): string {
  const p = new URLSearchParams({
    f: "pjson",
    returnGeometry: "false",
    returnCountOnly: "true",
    outFields: "OBJECTID",
    where: whereClause,
  });
  return `${LAYER_QUERY}?${p.toString()}`;
}

/** This layer returns HTTP 400 with `returnDistinctValues=true`; sample rows and dedupe in memory. */
async function fetchDedupedPairs(whereClause: string): Promise<{
  pairs: { dowlknum: string; lake_name: string }[];
  exceededTransferLimit: boolean;
}> {
  const p = new URLSearchParams({
    f: "pjson",
    where: whereClause,
    outFields: "DOWLKNUM,LAKE_NAME",
    returnGeometry: "false",
    returnDistinctValues: "false",
    resultRecordCount: "2000",
  });
  const url = `${LAYER_QUERY}?${p.toString()}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "TightLinesAI-mn-dnr-candidate-builder/1.0" },
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`ArcGIS ${res.status} for ${whereClause.slice(0, 80)}`);
  const j = await res.json() as {
    features?: Array<{ attributes?: Record<string, string> }>;
    exceededTransferLimit?: boolean;
  };
  const feats = j.features ?? [];
  const byDow = new Map<string, string>();
  for (const f of feats) {
    const a = f.attributes ?? {};
    const d = String(a.DOWLKNUM ?? a.dowlknum ?? "").trim();
    const n = String(a.LAKE_NAME ?? a.lake_name ?? "").trim();
    if (d && !byDow.has(d)) byDow.set(d, n);
  }
  const pairs = [...byDow.entries()].map(([dowlknum, lake_name]) => ({ dowlknum, lake_name }));
  return { pairs, exceededTransferLimit: j.exceededTransferLimit === true };
}

async function resolveRow(row: SeedRow): Promise<Candidate> {
  const tokens = searchTokensForCanonical(row.canonical_name);
  const notes: string[] = [
    `Seeded from waterbody_index (MN, by area); pilot + Douglas Lake Mary fixture excluded.`,
    `ArcGIS token attempts (in order): ${tokens.join(" → ")}`,
    `Disambiguate with county ${row.county_name} — DNR layer does not expose county on this query; review homonyms (e.g. Pelican Lake).`,
  ];

  let pairs: { dowlknum: string; lake_name: string }[] = [];
  let whereUsed = "";
  let pageLimited = false;
  let winningProbe = "";

  type Attempt = { pairs: { dowlknum: string; lake_name: string }[]; pageLimited: boolean; whereLike: string };
  let bestMulti: Attempt | null = null;

  try {
    for (const token of tokens) {
      const whereLike = `LAKE_NAME LIKE ${sqlQuote(`%${token}%`)}`;
      const r = await fetchDedupedPairs(whereLike);
      if (r.pairs.length === 0) continue;
      winningProbe = whereLike;
      if (r.pairs.length === 1) {
        pairs = r.pairs;
        pageLimited = r.exceededTransferLimit;
        whereUsed = whereLike;
        break;
      }
      if (r.pairs.length > 1 && r.pairs.length <= 15) {
        if (!bestMulti || r.pairs.length < bestMulti.pairs.length) {
          bestMulti = { pairs: r.pairs, pageLimited: r.exceededTransferLimit, whereLike };
        }
      }
      if (r.pairs.length > 15) {
        notes.push(`Token "${token}" returned >15 DOWLKNUM in sample — too broad; skipped.`);
      }
    }
    if (pairs.length === 0 && bestMulti) {
      pairs = bestMulti.pairs;
      pageLimited = bestMulti.pageLimited;
      whereUsed = bestMulti.whereLike;
      winningProbe = bestMulti.whereLike;
    } else if (pairs.length === 1) {
      whereUsed = winningProbe;
    }

    if (pageLimited) {
      notes.push(
        "ArcGIS exceededTransferLimit on first attribute page — distinct DOWLKNUM count may be higher; verify with paging or narrower where before insert.",
      );
    }
  } catch (e) {
    notes.push(`ArcGIS error: ${e instanceof Error ? e.message : String(e)}`);
  }

  let status: Candidate["dowlknum_resolution"]["status"] = "none";
  if (pairs.length === 1) status = "unique";
  else if (pairs.length > 1 && pairs.length <= 15) status = "multi";
  else if (pairs.length > 15) status = "too_many";

  let dnums = [...new Set(pairs.map((p) => p.dowlknum))].filter(Boolean);
  let source_path: string | null = null;
  let fetch_validation_url: string | null = null;

  if (pageLimited && dnums.length > 15) {
    status = "too_many";
    notes.push("Paged sample produced >15 DOWLKNUM — do not auto-build URL; manual aggregate review.");
    dnums = [];
  }

  if (dnums.length >= 1 && dnums.length <= 15) {
    const w = dnums.length === 1 ? `DOWLKNUM=${sqlQuote(dnums[0])}` : buildWhereIn(dnums);
    whereUsed = w;
    source_path = buildDataUrl(w);
    fetch_validation_url = buildCountProbeUrl(w);
    if (dnums.length > 1) {
      notes.push("Multiple DOWLKNUM in one system — verify all basins belong to this named water (compare to pilot Minnetonka / Leech pattern).");
    }
  } else if (dnums.length > 15) {
    notes.push("Too many distinct DOWLKNUM for token — narrow with manual DNR/GIS review before insert.");
  } else {
    notes.push("No contours matched — may lack DNR coverage or need different LAKE_NAME token.");
  }

  return {
    waterbody_id: row.id,
    canonical_name: row.canonical_name,
    county_name: row.county_name,
    surface_area_acres: row.surface_area_acres,
    matching_evidence:
      `USGS 3DHP waterbody_index identity: state MN, county ${row.county_name}; DNR contour rows matched via ${whereUsed || "no successful LIKE probe"}.`,
    dowlknum_resolution: {
      status,
      pairs,
      arcgis_where_used: whereUsed,
    },
    source_path,
    fetch_validation_url,
    expected_geometry_types: [...GEOM_TYPES],
    expected_property_fields: [...EXPECTED_FIELDS],
    review_notes: notes,
  };
}

async function main() {
  const seedFile = Deno.env.get("MN_DNR_EXPANSION_SEED")?.trim() ||
    "mn_dnr_expansion_seed_waterbodies.json";
  const outFile = Deno.env.get("MN_DNR_EXPANSION_OUT")?.trim() ||
    "water_reader_mn_dnr_expansion_batch_candidate.json";
  const seedPath = new URL(`./data/${seedFile}`, import.meta.url);
  const seed = JSON.parse(await Deno.readTextFile(seedPath)) as SeedRow[];
  const out: Candidate[] = [];
  for (let i = 0; i < seed.length; i++) {
    const c = await resolveRow(seed[i]);
    out.push(c);
    if (i < seed.length - 1) await new Promise((r) => setTimeout(r, 200));
  }
  const summary = {
    generated_at: new Date().toISOString(),
    count: out.length,
    layer: LAYER_QUERY,
    status_counts: {
      unique: out.filter((x) => x.dowlknum_resolution.status === "unique").length,
      multi: out.filter((x) => x.dowlknum_resolution.status === "multi").length,
      too_many: out.filter((x) => x.dowlknum_resolution.status === "too_many").length,
      none: out.filter((x) => x.dowlknum_resolution.status === "none").length,
    },
    disclaimer:
      "Draft only — not inserted. Human review required for lake_match_status, homonyms, multi-basin aggregates, and Edge + GeoJSON smoke per row.",
    candidates: out,
  };

  const outPath = new URL(`../docs/${outFile}`, import.meta.url);
  await Deno.writeTextFile(outPath, JSON.stringify(summary, null, 2));
  console.log(`Wrote ${out.length} candidates to ${outPath.pathname}`);
  console.log("Status counts:", summary.status_counts);
}

main().catch((e) => {
  console.error(e);
  Deno.exit(1);
});
