import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  isCreatorPortalAdminEmail,
  normalizeEmail,
  reserveUniqueCreatorCode,
  reserveUniqueCreatorSlug,
  slugifyCreatorName,
  suggestCreatorReferralCode,
} from "../_shared/creatorPortalAccess.ts";
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

function cleanString(value: unknown, maxLength = 120): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function commissionRateBps(value: unknown): number {
  const parsed = typeof value === "number"
    ? value
    : typeof value === "string"
    ? Number(value)
    : NaN;
  if (!Number.isFinite(parsed)) return 2500;
  const bps = parsed <= 100 ? Math.round(parsed * 100) : Math.round(parsed);
  return Math.min(5000, Math.max(2000, bps));
}

function commissionMonthCap(value: unknown): number {
  return normalizeCommissionMonthCap(value);
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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const displayName = cleanString(body.display_name, 80);
  const email = normalizeEmail(body.email);
  const requestedSlug = cleanString(body.slug, 64);
  const rateBps = commissionRateBps(body.commission_rate_bps ?? body.commission_percent);
  const monthCap = commissionMonthCap(body.commission_month_cap ?? body.month_cap);

  if (!displayName) return json({ error: "display_name_required" }, 400);
  if (!email) return json({ error: "invalid_email" }, 400);

  try {
    const { data: existingEmail, error: emailLookupError } = await supabase
      .from("creators")
      .select("id, slug, display_name")
      .ilike("email", email)
      .maybeSingle();
    if (emailLookupError) throw new Error(emailLookupError.message);
    if (existingEmail) {
      return json({
        error: "creator_email_already_used",
        message:
          `That email is already linked to ${existingEmail.display_name} (/ ${existingEmail.slug}).`,
      }, 409);
    }

    const slug = requestedSlug
      ? await reserveUniqueCreatorSlug(supabase, slugifyCreatorName(requestedSlug))
      : await reserveUniqueCreatorSlug(supabase, displayName);

    const code = await reserveUniqueCreatorCode(
      supabase,
      suggestCreatorReferralCode({ displayName, slug }),
    );

    const { data: creator, error: creatorError } = await supabase
      .from("creators")
      .insert({
        display_name: displayName,
        slug,
        email,
        commission_rate_bps: rateBps,
        commission_month_cap: monthCap,
        status: "active",
        notes: "Created via creator portal admin onboarding.",
      })
      .select("id, display_name, slug, email, commission_rate_bps, commission_month_cap, status")
      .single();
    if (creatorError) throw new Error(creatorError.message);

    const { data: creatorCode, error: codeError } = await supabase
      .from("creator_codes")
      .insert({
        creator_id: creator.id,
        code,
        code_type: "manual_tracking",
        is_active: true,
      })
      .select("id, code, is_active")
      .single();
    if (codeError) throw new Error(codeError.message);

    const landingUrl = `https://finfindr.app/c/${slug}`;
    const portalUrl = "https://finfindr.app/creators/";

    return json({
      ok: true,
      creator,
      tracking_code: creatorCode,
      links: {
        landing_url: landingUrl,
        portal_url: portalUrl,
      },
      next_steps: [
        "Creator can sign in at finfindr.app/creators/ with the email you entered.",
        `Share their tracked link: ${landingUrl}`,
        "They will only see their own stats — never other creators.",
      ],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create creator.";
    console.error("[creator-portal-admin-onboard] failed", {
      displayName,
      email,
      message,
    });
    return json({ error: "creator_onboard_failed", message }, 500);
  }
});
