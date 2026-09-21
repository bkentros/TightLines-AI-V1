import {
  archivePierCastV3ShadowForecast,
  buildPierCastV3ReviewOutlook,
  combinePierCastV3LmhofsBatches,
  PIER_CAST_V3_ENGINE_VERSION,
  type PierCastArchiveClient,
  readLatestCoherentPierCastV3SourceCohorts,
} from "../supabase/functions/_shared/pierCastEngine/index.ts";

const base = Deno.env.get("SUPABASE_URL")?.replace(/\/+$/, "");
const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!base || !key) throw new Error("Supabase production configuration is required.");

const database: PierCastArchiveClient = {
  rpc: async (name, args) => {
    const response = await fetch(`${base}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    const data = await response.json().catch(() => null);
    return response.ok ? { data, error: null } : {
      data: null,
      error: { message: data?.message ?? `${name}: ${response.status}` },
    };
  },
};

const now = new Date();
const cohorts = await readLatestCoherentPierCastV3SourceCohorts({ database, now, maxAgeHours: 24 });
if (!cohorts) throw new Error("No complete coherent Formula v3 source issue is available.");
const batch = combinePierCastV3LmhofsBatches(
  cohorts.primary,
  cohorts.expansion,
  cohorts.lakeHuron,
  cohorts.fiveCity,
  cohorts.chicagoAlpena,
  cohorts.stJosephHarrisville,
);
const outlook = buildPierCastV3ReviewOutlook({ batch, evaluationTime: now.toISOString() });
const result = await archivePierCastV3ShadowForecast({
  database,
  outlook,
  batch,
  ingestionSource: "fresh_archived_complete_cycle",
  engineVersion: PIER_CAST_V3_ENGINE_VERSION,
});
console.log(`PASS: ${result.status} private Formula v3 run ${result.runId} with ${result.forecastCount} rows from ${batch.issuedAt}.`);
