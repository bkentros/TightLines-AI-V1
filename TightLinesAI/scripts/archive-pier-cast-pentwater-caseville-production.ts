import {
  ingestPierCastPentwaterCasevilleShadowCycle,
  PIER_CAST_ENGINE_VERSION,
  type PierCastArchiveClient,
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

const outcome = await ingestPierCastPentwaterCasevilleShadowCycle({
  database,
  engineVersion: PIER_CAST_ENGINE_VERSION,
});
if (outcome.status === "unavailable" || !outcome.batch) {
  throw new Error(
    `Pentwater–Caseville production source unavailable: ${
      outcome.diagnostics.join(", ")
    }`,
  );
}
console.log(
  `PASS: ${outcome.status} Pentwater–Caseville source ${outcome.batch.issuedAt} with ${outcome.batch.cities.length} cities and ${
    outcome.batch.cities.flatMap((city) => city.samples).length
  } samples.`,
);
