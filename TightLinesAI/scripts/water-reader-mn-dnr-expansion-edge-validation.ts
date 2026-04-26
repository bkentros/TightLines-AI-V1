/**
 * Ops only: POST `waterbody-source-validation` for reviewed MN DNR depth expansion lakes.
 * Mutates `fetch_validation_*` on `waterbody_source_links` via Edge (same contract as pilot script).
 *
 * Requires WATER_READER_INTERNAL_KEY and SUPABASE_URL (or EXPO_PUBLIC_SUPABASE_URL).
 *
 * Run from TightLinesAI/:
 *   npm run ops:water-reader:mn-dnr-expansion-validate-edge
 *   MN_DNR_EXPANSION_BATCH=batch2 npm run ops:water-reader:mn-dnr-expansion-validate-edge
 *
 * Optional: `MN_DNR_EXPANSION_LOG_JSON=1` prints each HTTP 200 response body (JSON) after the summary line.
 */

const EXPANSION_LAKES_BATCH1: { lakeId: string; label: string }[] = [
  { lakeId: "74af9d87-8e97-4293-9f55-e12da922086f", label: "Otter Tail Lake (Otter Tail)" },
  { lakeId: "08861f79-5154-4225-bfd5-f754c9e511f8", label: "Lake Minnewaska (Pope)" },
  { lakeId: "bd44fd0f-e92c-4893-a307-241600ed6b95", label: "Lake Osakis (Todd)" },
  { lakeId: "49d4a4c7-6174-43d1-a239-680a8677f5d1", label: "Lake Miltona (Douglas)" },
  { lakeId: "30569d9f-9e79-41b5-a9da-ef1714fe16ab", label: "Lake Traverse (Traverse)" },
  { lakeId: "04066abc-9ef3-4707-bad2-e7afe4fb8202", label: "Nett Lake (Koochiching)" },
  { lakeId: "0c8f5a80-b9bd-419e-a137-7f0a8809de56", label: "Burntside Lake (St. Louis)" },
  { lakeId: "6059b6b0-6e06-4049-84a5-303105da14f3", label: "Thief Lake (Marshall)" },
  { lakeId: "9fe91eb1-12b2-4353-863b-37029871509e", label: "Big Sandy Lake (Aitkin)" },
  { lakeId: "581e7d6f-0d92-41ad-b30c-6dad09598d15", label: "North Long Lake (Crow Wing)" },
  { lakeId: "5edd434d-7339-4ef2-9d12-8e432c452099", label: "West Battle Lake (Otter Tail)" },
  { lakeId: "b9b12161-8b3e-4666-8eb3-1803651270a8", label: "Snowbank Lake (Lake)" },
];

/** Batch-2 approved six (`water_reader_mn_dnr_expansion_reviewed_insert_proposal_batch2.json`). */
const EXPANSION_LAKES_BATCH2: { lakeId: string; label: string }[] = [
  { lakeId: "5de66090-5d70-40e9-abb3-a3ee4116ae49", label: "Brule Lake (Cook)" },
  { lakeId: "ab3a96ea-b9d4-4f71-a394-9da5ef8820b7", label: "Height of Land Lake (Becker)" },
  { lakeId: "5bf05147-529b-4fde-ba82-fe87b7e2e0ef", label: "Big Cormorant Lake (Becker)" },
  { lakeId: "72df57ba-e259-4e94-aa73-aa95a87524cb", label: "Lake Reno (Pope)" },
  { lakeId: "55ef075c-5547-44e8-9dc8-3cb739c0c0f0", label: "Lake Shetek (Murray)" },
  { lakeId: "6c3f03f2-d62c-4464-9f02-50a3c4b1b6cc", label: "Detroit Lake (Becker)" },
];

function expansionLakes(): { lakeId: string; label: string }[] {
  const batch = Deno.env.get("MN_DNR_EXPANSION_BATCH")?.trim().toLowerCase();
  if (batch === "batch2" || batch === "2") {
    return EXPANSION_LAKES_BATCH2;
  }
  return EXPANSION_LAKES_BATCH1;
}

function projectUrl(): string {
  const u = Deno.env.get("SUPABASE_URL")?.trim() || Deno.env.get("EXPO_PUBLIC_SUPABASE_URL")?.trim();
  if (!u) {
    console.error(
      "Missing SUPABASE_URL or EXPO_PUBLIC_SUPABASE_URL (Supabase project URL, no trailing slash).",
    );
    Deno.exit(1);
  }
  return u.replace(/\/$/, "");
}

function internalKey(): string {
  const k = Deno.env.get("WATER_READER_INTERNAL_KEY")?.trim();
  if (!k) {
    console.error("Missing WATER_READER_INTERNAL_KEY. Refusing to call validation endpoint.");
    Deno.exit(1);
  }
  return k;
}

async function validateLake(
  baseUrl: string,
  key: string,
  lakeId: string,
  label: string,
): Promise<{ ok: boolean; summary: string; httpStatus: number; body?: Record<string, unknown> }> {
  const url = `${baseUrl}/functions/v1/waterbody-source-validation`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-water-reader-internal-key": key,
    },
    body: JSON.stringify({ lakeId, sourceMode: "depth" }),
  });
  const text = await res.text();
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {
      ok: false,
      summary: `HTTP ${res.status} non-JSON: ${text.slice(0, 200)}`,
      httpStatus: res.status,
    };
  }
  if (!res.ok) {
    const msg = typeof parsed.message === "string" ? parsed.message : text.slice(0, 200);
    return { ok: false, summary: `HTTP ${res.status}: ${msg}`, httpStatus: res.status, body: parsed };
  }
  const results = parsed.results as Array<{ status?: string; linkId?: string }> | undefined;
  if (!results?.length) {
    return {
      ok: false,
      summary: "200 but no depth link results (empty results[])",
      httpStatus: res.status,
      body: parsed,
    };
  }
  const statuses = results.map((r) => r.status ?? "?").join(",");
  const allReachable = results.every((r) => r.status === "reachable");
  return {
    ok: allReachable,
    summary: allReachable ? `reachable (${results.length} link(s): ${statuses})` : `mixed: ${statuses}`,
    httpStatus: res.status,
    body: parsed,
  };
}

async function main() {
  const base = projectUrl();
  const key = internalKey();
  const logJson = Deno.env.get("MN_DNR_EXPANSION_LOG_JSON") === "1";
  const lakes = expansionLakes();
  const batchLabel = lakes === EXPANSION_LAKES_BATCH2 ? "batch-2 (6)" : "batch-1 (12)";
  console.log(`MN DNR expansion ${batchLabel} — Edge source-path validation (depth links only)\n`);
  let failed = false;
  for (const { lakeId, label } of lakes) {
    const { ok, summary, body } = await validateLake(base, key, lakeId, label);
    console.log(`${ok ? "OK " : "FAIL"} ${label} (${lakeId.slice(0, 8)}…): ${summary}`);
    if (logJson && body) {
      console.log(JSON.stringify(body, null, 2));
    }
    if (!ok) failed = true;
  }
  if (failed) {
    console.error("\nOne or more expansion validations failed.");
    Deno.exit(1);
  }
  console.log(`\nAll expansion lakes in this run (${lakes.length}): depth link validation reachable.`);
}

main();
