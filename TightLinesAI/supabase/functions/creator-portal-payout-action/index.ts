import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isCreatorPortalAdminEmail } from "../_shared/creatorPortalAccess.ts";

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

type PayoutAction = "approve_payable" | "mark_paid";

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

  let body: { action?: unknown; creator_id?: unknown; payout_label?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const action = body.action;
  const creatorId = typeof body.creator_id === "string" ? body.creator_id.trim() : "";
  const payoutLabel = typeof body.payout_label === "string" &&
      body.payout_label.trim()
    ? body.payout_label.trim().slice(0, 120)
    : `Payout ${new Date().toISOString().slice(0, 10)}`;

  if (!creatorId) return json({ error: "creator_id_required" }, 400);
  if (action !== "approve_payable" && action !== "mark_paid") {
    return json({ error: "invalid_action" }, 400);
  }

  try {
    if (action === "approve_payable") {
      const { data, error } = await supabase
        .from("creator_commission_ledger")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
        })
        .eq("creator_id", creatorId)
        .eq("status", "pending")
        .lte("eligible_at", new Date().toISOString())
        .select("id");
      if (error) throw new Error(error.message);
      return json({
        ok: true,
        action,
        creator_id: creatorId,
        updated_count: data?.length ?? 0,
      });
    }

    const { data: approvedRows, error: approvedError } = await supabase
      .from("creator_commission_ledger")
      .select("id")
      .eq("creator_id", creatorId)
      .eq("status", "approved");
    if (approvedError) throw new Error(approvedError.message);
    if (!approvedRows?.length) {
      return json({
        ok: true,
        action,
        creator_id: creatorId,
        updated_count: 0,
        message: "No approved rows to mark paid.",
      });
    }

    const { data: batch, error: batchError } = await supabase
      .from("creator_payout_batches")
      .insert({
        label: payoutLabel,
        status: "paid",
        paid_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (batchError) throw new Error(batchError.message);

    const { data: paidRows, error: paidError } = await supabase
      .from("creator_commission_ledger")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        payout_batch_id: batch.id,
      })
      .eq("creator_id", creatorId)
      .eq("status", "approved")
      .select("id");
    if (paidError) throw new Error(paidError.message);

    return json({
      ok: true,
      action,
      creator_id: creatorId,
      payout_batch_id: batch.id,
      updated_count: paidRows?.length ?? 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payout action failed.";
    console.error("[creator-portal-payout-action] failed", {
      userId: user.id,
      action,
      creatorId,
      message,
    });
    return json({ error: "creator_portal_payout_failed", message }, 500);
  }
});
