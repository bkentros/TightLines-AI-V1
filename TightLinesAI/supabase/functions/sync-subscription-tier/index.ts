import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { hasFullAccessEmail } from "../_shared/appAccess.ts";

const ANGLER_ENTITLEMENT_ID = "angler";

type SubscriptionTier = "free" | "angler" | "master_angler";

type RevenueCatEntitlement = {
  expires_date?: string | null;
};

type RevenueCatSubscriberResponse = {
  subscriber?: {
    entitlements?: Record<string, RevenueCatEntitlement | undefined>;
  };
};

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

function entitlementIsActive(entitlement: RevenueCatEntitlement | undefined): boolean {
  if (!entitlement) return false;
  const expiresDate = entitlement.expires_date;
  if (expiresDate == null || expiresDate === "") return true;
  const expiresAt = Date.parse(expiresDate);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

async function fetchRevenueCatTier(appUserId: string): Promise<SubscriptionTier> {
  const apiKey =
    Deno.env.get("REVENUECAT_SECRET_API_KEY")?.trim() ||
    Deno.env.get("REVENUECAT_API_KEY")?.trim();

  if (!apiKey) {
    throw new Error("Missing REVENUECAT_SECRET_API_KEY Supabase secret.");
  }

  const res = await fetch(
    `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    },
  );

  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `RevenueCat entitlement lookup failed (${res.status}): ${text.slice(0, 300)}`,
    );
  }

  const parsed = text ? JSON.parse(text) as RevenueCatSubscriberResponse : {};
  const angler = parsed.subscriber?.entitlements?.[ANGLER_ENTITLEMENT_ID];
  return entitlementIsActive(angler) ? "angler" : "free";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken ||
    (authHeader ? authHeader.replace("Bearer ", "") : null);
  if (!token) return json({ error: "Missing authentication token" }, 401);

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    token,
  );
  if (authError || !user) return json({ error: "Unauthorized" }, 401);

  try {
    const nextTier = hasFullAccessEmail(user.email)
      ? "angler"
      : await fetchRevenueCatTier(user.id);

    const { data: profile, error: updateError } = await supabase
      .from("profiles")
      .update({
        subscription_tier: nextTier,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      return json({
        error: "profile_sync_failed",
        message: updateError.message,
      }, 500);
    }

    return json({
      subscription_tier: nextTier,
      has_angler: nextTier === "angler" || nextTier === "master_angler",
      profile,
      source: hasFullAccessEmail(user.email) ? "complimentary" : "revenuecat",
    });
  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : "Could not verify subscription status.";
    return json({ error: "subscription_sync_failed", message }, 502);
  }
});
