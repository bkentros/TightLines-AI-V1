/**
 * GeoJSON smoke for `docs/water_reader_mn_dnr_expansion_reviewed_insert_proposal.json`
 * `ready_for_insert` rows only (non-mutating).
 *
 * Run: deno run -A scripts/water-reader-mn-dnr-proposal-geojson-smoke.ts
 */

type Ready = {
  label: string;
  source_path: string;
  fetch_validation_url?: string;
};

function resolveProposalPath(): URL {
  const raw = Deno.env.get("MN_DNR_PROPOSAL_JSON")?.trim();
  if (!raw) {
    return new URL(
      "../docs/water_reader_mn_dnr_expansion_reviewed_insert_proposal.json",
      import.meta.url,
    );
  }
  if (raw.startsWith("/")) {
    return new URL(`file://${raw}`);
  }
  // Project-root paths like `docs/...` when running from TightLinesAI/
  if (raw.startsWith("docs/")) {
    return new URL(raw, `file://${Deno.cwd()}/`);
  }
  return new URL(raw, import.meta.url);
}

const proposalPath = resolveProposalPath();
const proposal = JSON.parse(await Deno.readTextFile(proposalPath)) as { ready_for_insert: Ready[] };

function assertNoCountOnlySourcePath(url: string, label: string) {
  if (url.toLowerCase().includes("returncountonly=true")) {
    throw new Error(`${label}: source_path must not use returnCountOnly=true`);
  }
}

function assertValidationProbe(url: string | undefined, label: string) {
  if (!url) return;
  if (!url.includes("returnCountOnly=true")) {
    console.warn(`[warn] ${label}: fetch_validation_url expected count-only probe`);
  }
}

function assertSourcePathShape(url: string, label: string) {
  const lo = url.toLowerCase();
  if (!lo.includes("f=geojson")) throw new Error(`${label}: need f=geojson`);
  if (!lo.includes("returngeometry=true")) throw new Error(`${label}: need returnGeometry=true`);
  if (!lo.includes("outsr=4326") && !lo.includes("outsr%3d4326")) throw new Error(`${label}: need outSR=4326`);
}

function inMinnesotaEnvelope(lon: number, lat: number): boolean {
  return lon >= -97.5 && lon <= -89 && lat >= 43 && lat <= 49.5;
}

function checkRing(ring: number[][], label: string, fi: number) {
  for (const pos of ring) {
    const [lon, lat] = pos;
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
      throw new Error(`${label}: feature ${fi} bad lon/lat`);
    }
    if (!inMinnesotaEnvelope(lon, lat)) {
      throw new Error(`${label}: feature ${fi} outside MN WGS84 envelope`);
    }
  }
}

function assertGeom(g: Record<string, unknown>, label: string, fi: number) {
  const t = g.type;
  if (t !== "LineString" && t !== "MultiLineString") {
    throw new Error(`${label}: feature ${fi} bad geometry type ${t}`);
  }
  const c = g.coordinates;
  if (!Array.isArray(c)) throw new Error(`${label}: feature ${fi} no coordinates`);
  if (t === "LineString") checkRing(c as number[][], label, fi);
  else for (const line of c as number[][][]) checkRing(line as number[][], label, fi);
}

function hasDepth(props: Record<string, unknown>): boolean {
  return (props["DEPTH"] != null) || (props["abs_depth"] != null);
}

function smokeFetchUrl(sourcePath: string): string {
  const u = new URL(sourcePath);
  u.searchParams.set("resultRecordCount", Deno.env.get("MN_DNR_SMOKE_MAX_RECORDS") ?? "200");
  u.searchParams.delete("resultOffset");
  return u.toString();
}

async function fetchJson(url: string, label: string): Promise<Record<string, unknown>> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(180_000),
    headers: {
      "Accept": "application/geo+json, application/json",
      "User-Agent": "TightLinesAI-mn-dnr-proposal-smoke/1.0",
    },
  });
  if (!res.ok) throw new Error(`${label}: HTTP ${res.status}`);
  const text = await res.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(`${label}: not JSON`);
  }
}

async function smokeOne(row: Ready) {
  const { label, source_path: sp, fetch_validation_url: fv } = row;
  assertNoCountOnlySourcePath(sp, label);
  assertSourcePathShape(sp, label);
  assertValidationProbe(fv, label);
  const body = await fetchJson(smokeFetchUrl(sp), label);
  if (body.type !== "FeatureCollection") throw new Error(`${label}: not FeatureCollection`);
  const feats = body.features as unknown[];
  if (!Array.isArray(feats) || feats.length === 0) throw new Error(`${label}: empty features`);
  for (let i = 0; i < feats.length; i++) {
    const f = feats[i] as Record<string, unknown>;
    if (f.type !== "Feature") throw new Error(`${label}: not Feature`);
    const g = f.geometry as Record<string, unknown> | null;
    if (!g) throw new Error(`${label}: null geometry`);
    assertGeom(g, label, i);
    const p = f.properties as Record<string, unknown> | null;
    if (!p || !hasDepth(p)) throw new Error(`${label}: missing depth props`);
  }
  return feats.length;
}

const ready = proposal.ready_for_insert;
console.log(`Proposal GeoJSON smoke: ${ready.length} ready_for_insert lake(s)\n`);
for (const r of ready) {
  const n = await smokeOne(r);
  console.log(`OK  ${r.label}: ${n} features (capped page)`);
}
console.log("\nAll ready_for_insert source_path URLs passed.");
