import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  canResetFreeTierState,
  resetFreeTierStateForUser,
} from "../_shared/resetFreeTierState.ts";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, apikey, x-user-token",
  };
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken ??
    (authHeader ? authHeader.replace("Bearer ", "") : null);
  if (!token) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  if (!canResetFreeTierState(user.email)) {
    return new Response(JSON.stringify({ error: "forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  let body: { targetEmail?: unknown } = {};
  try {
    const text = await req.text();
    if (text.trim().length > 0) {
      body = JSON.parse(text) as { targetEmail?: unknown };
    }
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const targetEmail = normalizeEmail(body.targetEmail);
  let targetUserId = user.id;

  if (targetEmail && targetEmail !== user.email?.trim().toLowerCase()) {
    const { data: lookedUpUserId, error: lookupError } = await supabase.rpc(
      "admin_lookup_user_id_by_email",
      { target_email: targetEmail },
    );

    if (lookupError) {
      console.error("[admin-reset-free-trials] target lookup failed", lookupError.message);
      return new Response(JSON.stringify({ error: "target_lookup_failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    if (!lookedUpUserId || typeof lookedUpUserId !== "string") {
      return new Response(JSON.stringify({ error: "target_user_not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }
    targetUserId = lookedUpUserId;
  }

  try {
    const result = await resetFreeTierStateForUser(supabase, targetUserId);
    return new Response(JSON.stringify({
      ...result,
      targetUserId,
      targetEmail: targetEmail ?? user.email ?? null,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "reset_failed";
    console.error("[admin-reset-free-trials]", message);
    return new Response(JSON.stringify({ error: "reset_failed", message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
});
