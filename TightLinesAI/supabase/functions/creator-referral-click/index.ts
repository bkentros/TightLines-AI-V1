import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildCreatorReferralWebUrl,
  cleanString,
  normalizeCreatorCode,
} from "../_shared/creatorProgram.ts";

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/;
const APP_STORE_APP_URL = "https://apps.apple.com/app/id6769178136";

type CreatorRow = {
  id: string;
  display_name: string;
  slug: string;
  status: string;
  instally_link_slug: string | null;
};

type CreatorCodeRow = {
  id: string;
  code: string;
  is_active: boolean;
  app_store_redemption_url: string | null;
  apple_app_id: string | null;
  discount_percent: number;
  discount_duration_months: number;
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, apikey",
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

function normalizeSlug(raw: string | null): string | null {
  if (!raw) return null;
  const slug = raw.trim().toLowerCase();
  if (!SLUG_PATTERN.test(slug)) return null;
  return slug;
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
  if (req.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "creator_referral_not_configured" }, 500);
  }

  const url = new URL(req.url);
  const slug = normalizeSlug(url.searchParams.get("slug"));
  if (!slug) {
    return json({ error: "invalid_creator_slug" }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  try {
    const { data: creator, error: creatorError } = await supabase
      .from("creators")
      .select("id, display_name, slug, status, instally_link_slug")
      .eq("slug", slug)
      .maybeSingle();
    if (creatorError) throw new Error(creatorError.message);
    if (!creator || creator.status !== "active") {
      return json({ error: "creator_not_found" }, 404);
    }

    const creatorRow = creator as CreatorRow;

    const { data: codeRows, error: codeError } = await supabase
      .from("creator_codes")
      .select(
        "id, code, is_active, app_store_redemption_url, apple_app_id, discount_percent, discount_duration_months",
      )
      .eq("creator_id", creatorRow.id)
      .order("is_active", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1);
    if (codeError) throw new Error(codeError.message);

    const creatorCode = (codeRows?.[0] ?? null) as CreatorCodeRow | null;
    if (!creatorCode) {
      return json({ error: "creator_code_not_found" }, 404);
    }

    const landingPath = `/c/${slug}`;
    const referrerHost = cleanString(
      url.searchParams.get("referrer_host") ??
        req.headers.get("referer")?.split("/")[2] ??
        null,
      120,
    );
    const utmSource = cleanString(url.searchParams.get("utm_source"), 120);
    const utmMedium = cleanString(url.searchParams.get("utm_medium"), 120);
    const utmCampaign = cleanString(url.searchParams.get("utm_campaign"), 120);
    const utmContent = cleanString(url.searchParams.get("utm_content"), 120);

    const pepper = Deno.env.get("CREATOR_REFERRAL_HASH_PEPPER") ??
      "finfindr-creator-referral-v1";
    const ip = clientIp(req);
    const userAgent = req.headers.get("user-agent") ?? "";
    const ipHash = ip ? await hashDiagnostic(ip, pepper) : null;
    const userAgentHash = userAgent
      ? await hashDiagnostic(userAgent.slice(0, 500), pepper)
      : null;

    const { data: clickRow, error: clickError } = await supabase
      .from("referral_clicks")
      .insert({
        creator_id: creatorRow.id,
        creator_code_id: creatorCode.id,
        code: creatorCode.code,
        landing_path: landingPath,
        destination_url: APP_STORE_APP_URL,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        referrer_host: referrerHost,
        ip_hash: ipHash,
        user_agent_hash: userAgentHash,
      })
      .select("id, click_token")
      .single();
    if (clickError) throw new Error(clickError.message);

    const clickToken = clickRow?.click_token as string;
    const referralClickId = clickRow?.id as string;
    const normalizedCode = normalizeCreatorCode(creatorCode.code);
    const referralWebUrl = buildCreatorReferralWebUrl(normalizedCode!, clickToken);
    const installySlug = creatorRow.instally_link_slug?.trim() ?? null;
    const installyRedirectUrl = installySlug
      ? `https://finfindr.instally.io/${installySlug}`
      : null;

    await supabase.from("referral_funnel_events").insert({
      referral_click_id: referralClickId,
      creator_id: creatorRow.id,
      event_type: "click",
    });

    return json({
      ok: true,
      click_token: clickToken,
      referral_click_id: referralClickId,
      creator: {
        display_name: creatorRow.display_name,
        slug: creatorRow.slug,
      },
      code: normalizedCode,
      app_store_app_url: APP_STORE_APP_URL,
      referral_web_url: referralWebUrl,
      deep_link_url: normalizedCode
        ? `finfindr://creator?code=${encodeURIComponent(normalizedCode)}&click=${
          encodeURIComponent(clickToken)
        }`
        : null,
      instally_redirect_url: installyRedirectUrl,
    });
  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : "Could not record creator referral click.";
    console.error("[creator-referral-click] failed", { slug, message });
    return json({ error: "creator_referral_click_failed", message }, 500);
  }
});
