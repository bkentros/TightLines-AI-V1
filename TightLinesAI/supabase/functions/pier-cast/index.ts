import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isAdminEmail } from "../_shared/appAccess.ts";
import { createPierCastHandler } from "./handler.ts";

const database = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const handler = createPierCastHandler({
  authorizeReview: async (request) => {
    const token = request.headers.get("x-user-token") ??
      request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return false;
    const { data: { user }, error } = await database.auth.getUser(token);
    return !error && !!user && isAdminEmail(user.email);
  },
});

Deno.serve(handler);
