import {
  buildPierCastV3ReviewOutlook,
  combinePierCastV3LmhofsBatches,
  readLatestCoherentPierCastV3SourceCohorts,
  type PierCastArchiveClient,
} from "../supabase/functions/_shared/pierCastEngine/index.ts";

const base = Deno.env.get("SUPABASE_URL")?.replace(/\/+$/, "");
const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!base || !key) throw new Error("Supabase production configuration is required.");

const database: PierCastArchiveClient = {
  rpc: async (name, args) => {
    const response = await fetch(`${base}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    });
    const data = await response.json();
    return response.ok
      ? { data, error: null }
      : { data: null, error: { message: data?.message ?? `${name}: ${response.status}` } };
  },
};

const now = new Date();
const cohorts = await readLatestCoherentPierCastV3SourceCohorts({
  database,
  now,
  maxAgeHours: 24,
});
if (!cohorts) throw new Error("No complete matching owner-review cycle within 24 hours.");
const outlook = buildPierCastV3ReviewOutlook({
  batch: combinePierCastV3LmhofsBatches(
    cohorts.primary,
    cohorts.expansion,
    cohorts.lakeHuron,
  ),
  evaluationTime: now.toISOString(),
});
const rankedCities = outlook.cities.filter((city) =>
  city.dates[0]?.headline.overall.status === "available"
);
if (outlook.cities.length !== 12 || rankedCities.length !== 12) {
  throw new Error(
    `Owner review returned ${outlook.cities.length} cities and ${rankedCities.length} ranked cities; expected 12 each.`,
  );
}
console.log(
  `PASS: private v3 model yields ${rankedCities.length} ranked cities from matching ${cohorts.issuedAt} cycle (${outlook.source.cycleAgeHours.toFixed(1)} hours old).`,
);
