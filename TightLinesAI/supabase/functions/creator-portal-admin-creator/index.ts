import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isCreatorPortalAdminEmail, normalizeEmail } from "../_shared/creatorPortalAccess.ts";
import { normalizeCommissionMonthCap } from "../_shared/creatorProgram.ts";

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

function commissionRateBps(value: unknown): number | null {
  const parsed = typeof value === "number"
    ? value
    : typeof value === "string"
    ? Number(value)
    : NaN;
  if (!Number.isFinite(parsed)) return null;
  const bps = parsed <= 100 ? Math.round(parsed * 100) : Math.round(parsed);
  return Math.min(5000, Math.max(2000, bps));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (Deno.env.get("CREATOR_PROGRAM_ENABLED") !== "true") {
    return json({ error: "creator_program_disabled" }, 404);
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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const action = body.action;
  const creatorId = typeof body.creator_id === "string" ? body.creator_id.trim() : "";
  if (!creatorId) return json({ error: "creator_id_required" }, 400);

  try {
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

    if (action === "update_deal") {
      const rateBps = commissionRateBps(
        body.commission_rate_bps ?? body.commission_percent,
      );
      const monthCap = body.commission_month_cap != null || body.month_cap != null
        ? normalizeCommissionMonthCap(body.commission_month_cap ?? body.month_cap)
        : null;

      const patch: Record<string, unknown> = {};
      if (rateBps != null) patch.commission_rate_bps = rateBps;
      if (monthCap != null) patch.commission_month_cap = monthCap;
      if (Object.keys(patch).length === 0) {
        return json({ error: "no_deal_fields" }, 400);
      }

      const { data, error } = await supabase
        .from("creators")
        .update(patch)
        .eq("id", creatorId)
        .select("id, display_name, slug, email, commission_rate_bps, commission_month_cap")
        .single();
      if (error) throw new Error(error.message);

      return json({
        ok: true,
        action,
        creator: data,
        note:
          "Deal changes apply to new attributions only. Existing referred users keep their snapshotted rate and month cap.",
      });
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
