import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createLakeMapScorecardHandler } from "./handler.ts";

const database = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const handler = createLakeMapScorecardHandler({
  enabled: Deno.env.get("LAKE_MAP_SCORECARD_ENABLED") === "true",
  internalSecret: Deno.env.get("LAKE_MAP_SCORECARD_INTERNAL_KEY") ?? null,
  database: {
    rpc: async (functionName, arguments_) => {
      const { data, error } = await database.rpc(functionName, arguments_);
      return { data, error: error ? { message: error.message } : null };
    },
  },
});

Deno.serve(handler);
