import {
  ingestPierCastChicagoAlpenaShadowCycle,
  ingestPierCastFiveCityShadowCycle,
  ingestPierCastLakeHuronShadowCycle,
  ingestPierCastPentwaterCasevilleShadowCycle,
  ingestPierCastStJosephHarrisvilleShadowCycle,
  ingestPierCastTemperatureCycle,
  ingestPierCastWisconsinShadowCycle,
  PIER_CAST_ENGINE_VERSION,
  type PierCastArchiveClient,
  type PierCastTemperatureIngestionOutcome,
} from "../supabase/functions/_shared/pierCastEngine/index.ts";

const base = Deno.env.get("SUPABASE_URL")?.replace(/\/+$/, "");
const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!base || !key) {
  throw new Error("Supabase production configuration is required.");
}

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
    const data = await response.json().catch(() => null);
    return response.ok ? { data, error: null } : {
      data: null,
      error: { message: data?.message ?? `${name}: ${response.status}` },
    };
  },
};

const cohorts: ReadonlyArray<[
  string,
  () => Promise<PierCastTemperatureIngestionOutcome>,
]> = [
  [
    "primary",
    () =>
      ingestPierCastTemperatureCycle({
        database,
        engineVersion: PIER_CAST_ENGINE_VERSION,
      }),
  ],
  [
    "wisconsin",
    () =>
      ingestPierCastWisconsinShadowCycle({
        database,
        engineVersion: PIER_CAST_ENGINE_VERSION,
      }),
  ],
  [
    "lake-huron",
    () =>
      ingestPierCastLakeHuronShadowCycle({
        database,
        engineVersion: PIER_CAST_ENGINE_VERSION,
      }),
  ],
  [
    "five-city",
    () =>
      ingestPierCastFiveCityShadowCycle({
        database,
        engineVersion: PIER_CAST_ENGINE_VERSION,
      }),
  ],
  [
    "chicago-alpena",
    () =>
      ingestPierCastChicagoAlpenaShadowCycle({
        database,
        engineVersion: PIER_CAST_ENGINE_VERSION,
      }),
  ],
  [
    "st-joseph-harrisville",
    () =>
      ingestPierCastStJosephHarrisvilleShadowCycle({
        database,
        engineVersion: PIER_CAST_ENGINE_VERSION,
      }),
  ],
  [
    "pentwater-caseville",
    () =>
      ingestPierCastPentwaterCasevilleShadowCycle({
        database,
        engineVersion: PIER_CAST_ENGINE_VERSION,
      }),
  ],
];

const issues = new Set<string>();
let totalCities = 0;
let totalSamples = 0;
for (const [name, ingest] of cohorts) {
  const outcome = await ingest();
  if (outcome.status === "unavailable" || !outcome.batch) {
    throw new Error(`${name} unavailable: ${outcome.diagnostics.join(", ")}`);
  }
  const samples = outcome.batch.cities.flatMap((city) => city.samples).length;
  issues.add(outcome.batch.issuedAt);
  totalCities += outcome.batch.cities.length;
  totalSamples += samples;
  console.log(
    `${name}: ${outcome.status} ${outcome.batch.issuedAt}, ${outcome.batch.cities.length} cities, ${samples} samples`,
  );
}

if (issues.size !== 1 || totalCities !== 32 || totalSamples !== 3_872) {
  throw new Error(
    `Source cohorts are not coherent: issues=${
      [...issues].join(",")
    }, cities=${totalCities}, samples=${totalSamples}.`,
  );
}
console.log(
  `PASS: seven coherent production cohorts at ${
    [...issues][0]
  } with ${totalCities} cities and ${totalSamples} samples.`,
);
