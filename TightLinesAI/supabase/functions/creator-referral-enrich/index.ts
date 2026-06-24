import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { cleanString, isUuid } from "../_shared/creatorProgram.ts";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, apikey",
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

async function hashDiagnostic(value: string, pepper: string): Promise<string> {
  const data = new TextEncoder().encode(`${pepper}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function clientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 80);
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  return realIp ? realIp.slice(0, 80) : null;
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
    return json({ error: "creator_referral_not_configured" }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const clickToken = cleanString(
    body.referral_click_token ?? body.click ?? body.click_token,
    120,
  );
  if (!clickToken || !isUuid(clickToken)) {
    return json({ error: "invalid_referral_click_token" }, 400);
  }

  const ip = clientIp(req);
  const userAgent = req.headers.get("user-agent") ?? "";
  if (!ip || !userAgent) {
    return json({ error: "client_signals_unavailable" }, 400);
  }

  const pepper = Deno.env.get("CREATOR_REFERRAL_HASH_PEPPER") ??
    "finfindr-creator-referral-v1";
  const ipHash = await hashDiagnostic(ip, pepper);
  const userAgentHash = await hashDiagnostic(userAgent.slice(0, 500), pepper);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  try {
    const { data: clickRow, error: lookupError } = await supabase
      .from("referral_clicks")
      .select("id, app_opened_at")
      .or(`id.eq.${clickToken},click_token.eq.${clickToken}`)
      .maybeSingle();
    if (lookupError) throw new Error(lookupError.message);
    if (!clickRow) return json({ error: "referral_click_not_found" }, 404);

    const { error: updateError } = await supabase
      .from("referral_clicks")
      .update({
        ip_hash: ipHash,
        user_agent_hash: userAgentHash,
      })
      .eq("id", clickRow.id)
      .is("app_opened_at", null);
    if (updateError) throw new Error(updateError.message);

    return json({ ok: true, referral_click_id: clickRow.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Enrich failed.";
    console.error("[creator-referral-enrich] failed", { message });
    return json({ error: "creator_referral_enrich_failed", message }, 500);
  }
});
