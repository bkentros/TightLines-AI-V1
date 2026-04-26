/**
 * Ops only: POST `waterbody-source-validation` for the six MN DNR depth pilot lakes.
 * Mutates `fetch_validation_*` columns in `waterbody_source_links` via the Edge function.
 *
 * Requires:
 *   - WATER_READER_INTERNAL_KEY
 *   - SUPABASE_URL or EXPO_PUBLIC_SUPABASE_URL (project URL, e.g. https://xxxx.supabase.co)
 *
 * Do not run on untrusted CI (no PR triggers). Use `workflow_dispatch` or local ops only.
 *
 * Run from TightLinesAI/:
 *   export WATER_READER_INTERNAL_KEY=... SUPABASE_URL=...
 *   deno run -A scripts/water-reader-mn-dnr-pilot-edge-validation.ts
 */

const PILOT_LAKES: { lakeId: string; label: string }[] = [
  { lakeId: "446b4c7b-a5ac-402e-83ef-5c0da509cb25", label: "Bde Maka Ska (Hennepin)" },
  { lakeId: "fb322d45-0a28-4216-b30d-61b71f391d6a", label: "Lake Minnetonka (Hennepin)" },
  { lakeId: "fbbd5986-6936-4c86-9db7-1d8a363edd36", label: "Lake of the Isles (Hennepin)" },
  { lakeId: "3569ceba-a22d-491e-8362-283dc5edecb4", label: "Lake Waconia (Carver)" },
  { lakeId: "dc7b48bb-5b49-46e7-b780-979b1e895080", label: "Leech Lake (Cass)" },
  { lakeId: "8a300b88-6ba2-45a0-bdd1-a52cec3b7ac3", label: "Mille Lacs Lake (Mille Lacs)" },
];

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
): Promise<{ ok: boolean; summary: string }> {
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
    };
  }
  if (!res.ok) {
    const msg = typeof parsed.message === "string" ? parsed.message : text.slice(0, 200);
    return { ok: false, summary: `HTTP ${res.status}: ${msg}` };
  }
  const results = parsed.results as Array<{ status?: string; linkId?: string }> | undefined;
  if (!results?.length) {
    return { ok: false, summary: "200 but no depth link results (empty results[])" };
  }
  const statuses = results.map((r) => r.status ?? "?").join(",");
  const allReachable = results.every((r) => r.status === "reachable");
  return {
    ok: allReachable,
    summary: allReachable ? `reachable (${results.length} link(s): ${statuses})` : `mixed: ${statuses}`,
  };
}

async function main() {
  const base = projectUrl();
  const key = internalKey();
  console.log("MN DNR pilot — Edge source-path validation (depth links only)\n");
  let failed = false;
  for (const { lakeId, label } of PILOT_LAKES) {
    const { ok, summary } = await validateLake(base, key, lakeId, label);
    console.log(`${ok ? "OK " : "FAIL"} ${label} (${lakeId.slice(0, 8)}…): ${summary}`);
    if (!ok) failed = true;
  }
  if (failed) {
    console.error("\nOne or more pilot validations failed.");
    Deno.exit(1);
  }
  console.log("\nAll six pilot lakes: depth link validation reachable.");
}

main();
