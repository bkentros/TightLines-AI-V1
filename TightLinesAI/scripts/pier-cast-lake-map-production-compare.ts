#!/usr/bin/env -S deno run --allow-env --allow-net
import {
  type PierCastArchiveClient,
  runPierCastLakeMapComparison,
} from "../supabase/functions/_shared/pierCastEngine/index.ts";

const base = Deno.env.get("SUPABASE_URL")?.replace(/\/+$/, "");
const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const mapPassSecret = Deno.env.get("PIER_CAST_MAP_PASS_SECRET");
if (!base || !serviceRole || !mapPassSecret) {
  throw new Error("Production comparison configuration is unavailable.");
}

const database: PierCastArchiveClient = {
  rpc: async (functionName, arguments_) => {
    const response = await fetch(`${base}/rest/v1/rpc/${functionName}`, {
      method: "POST",
      headers: {
        apikey: serviceRole,
        authorization: `Bearer ${serviceRole}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(arguments_),
    });
    const data = await response.json().catch(() => null);
    return response.ok ? { data, error: null } : {
      data: null,
      error: {
        message: typeof data?.message === "string"
          ? data.message
          : `${functionName} failed with HTTP ${response.status}`,
      },
    };
  },
};

const comparison = await runPierCastLakeMapComparison({
  database,
  mapPassSecret,
});
const gate = {
  meanWithinLimit: comparison.temperature.meanAbsDifferenceF <= 0.05,
  maxWithinLimit: comparison.temperature.maxAbsDifferenceF <= 1,
  noBandChanges: comparison.ratings.bandChanges === 0,
};
const result = {
  ...comparison,
  gate: { ...gate, passed: Object.values(gate).every(Boolean) },
};
console.log(JSON.stringify(result, null, 2));
if (!result.gate.passed) Deno.exit(1);
