import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-user-token",
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Account deletion is not configured." }, 500);
  }

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader ? authHeader.replace("Bearer ", "") : null;
  const token = userToken ?? bearerToken;
  if (!token) {
    return json({ error: "Missing authentication token" }, 401);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
  if (deleteError) {
    console.error("[delete-account] failed", { userId: user.id, error: deleteError.message });
    return json({ error: "Could not delete account." }, 500);
  }

  return json({ ok: true });
});
