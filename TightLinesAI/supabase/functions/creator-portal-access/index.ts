import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  CREATOR_PORTAL_URL,
  findActiveCreatorForUser,
  isCreatorPortalAdminEmail,
} from "../_shared/creatorPortalAccess.ts";

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

  try {
    const isAdmin = isCreatorPortalAdminEmail(user.email);
    const creator = await findActiveCreatorForUser(supabase, {
      userId: user.id,
      email: user.email,
    });
    const portalEligible = isAdmin || Boolean(creator);

    return json({
      portal_eligible: portalEligible,
      is_admin: isAdmin,
      creator_slug: creator?.slug ?? null,
      creator_name: creator?.display_name ?? null,
      portal_url: portalEligible ? CREATOR_PORTAL_URL : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not check creator access.";
    console.error("[creator-portal-access] failed", { userId: user.id, message });
    return json({ error: "creator_portal_access_failed", message }, 500);
  }
});
