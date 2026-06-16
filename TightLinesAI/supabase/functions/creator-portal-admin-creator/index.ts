import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isCreatorPortalAdminEmail, normalizeEmail } from "../_shared/creatorPortalAccess.ts";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, apikey, x-user-token",
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
    return json({ error: "method_not_allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "creator_portal_not_configured" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken ||
    (authHeader ? authHeader.replace(/^Bearer\s+/i, "") : null);
  if (!token) return json({ error: "unauthorized" }, 401);

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return json({ error: "unauthorized" }, 401);
  if (!isCreatorPortalAdminEmail(user.email)) {
    return json({ error: "forbidden", message: "Admin access required." }, 403);
  }

  let body: { action?: unknown; creator_id?: unknown; email?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const action = body.action;
  const creatorId = typeof body.creator_id === "string" ? body.creator_id.trim() : "";
  if (!creatorId) return json({ error: "creator_id_required" }, 400);

  try {
    if (action === "activate_code") {
      const { data: codes, error: codeLookupError } = await supabase
        .from("creator_codes")
        .select("id, code")
        .eq("creator_id", creatorId);
      if (codeLookupError) throw new Error(codeLookupError.message);
      if (!codes?.length) {
        return json({ error: "creator_code_not_found" }, 404);
      }

      const { error: updateError } = await supabase
        .from("creator_codes")
        .update({ is_active: true })
        .eq("creator_id", creatorId);
      if (updateError) throw new Error(updateError.message);

      return json({
        ok: true,
        action,
        creator_id: creatorId,
        activated_codes: codes.map((row) => row.code),
      });
    }

    if (action === "update_email") {
      const email = normalizeEmail(body.email);
      if (!email) return json({ error: "invalid_email" }, 400);

      const { data, error } = await supabase
        .from("creators")
        .update({ email })
        .eq("id", creatorId)
        .select("id, display_name, slug, email")
        .single();
      if (error) throw new Error(error.message);

      return json({ ok: true, action, creator: data });
    }

    return json({ error: "invalid_action" }, 400);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Creator admin action failed.";
    console.error("[creator-portal-admin-creator] failed", {
      action,
      creatorId,
      message,
    });
    return json({ error: "creator_admin_action_failed", message }, 500);
  }
});
