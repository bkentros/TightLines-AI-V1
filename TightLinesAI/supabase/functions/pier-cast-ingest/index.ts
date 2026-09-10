import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  ingestPierCastCalibrationObservations,
  ingestPierCastTemperatureCycle,
  PIER_CAST_ENGINE_VERSION,
  type PierCastArchiveClient,
} from "../_shared/pierCastEngine/index.ts";
import { createPierCastIngestHandler } from "./handler.ts";

const database = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const archiveClient: PierCastArchiveClient = {
  rpc: async (functionName, arguments_) => {
    const { data, error } = await database.rpc(functionName, arguments_);
    return {
      data,
      error: error ? { message: error.message } : null,
    };
  },
};

const handler = createPierCastIngestHandler({
  internalSecret: Deno.env.get("PIER_CAST_INTERNAL_KEY") ?? null,
  ingest: () =>
    ingestPierCastTemperatureCycle({
      database: archiveClient,
      engineVersion: PIER_CAST_ENGINE_VERSION,
    }),
  ingestObservations: () =>
    ingestPierCastCalibrationObservations({
      database: archiveClient,
    }),
});

Deno.serve(handler);
