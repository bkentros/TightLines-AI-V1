import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildAppStoreRedemptionUrl,
  cleanString,
  isCreatorOfferEligibleUser,
  isUuid,
  normalizeCreatorCode,
} from "../_shared/creatorProgram.ts";

type SupabaseClient = {
  auth: ReturnType<typeof createClient>["auth"];
  from: (table: string) => any;
};

type CreatorCodeRow = {
  id: string;
  creator_id: string;
  code: string;
  is_active: boolean;
  app_store_redemption_url: string | null;
  apple_app_id: string | null;
  app_store_offer_reference_name: string | null;
};

type CreatorRow = {
  id: string;
  display_name: string;
  commission_rate_bps: number;
  commission_month_cap: number;
  status: string;
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

function dbErrorCode(error: unknown): string | null {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : null;
  }
  return null;
}

async function getActiveAttribution(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("user_attributions")
    .select("id, creator_id, creator_code_id, code, attribution_source, status")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.status === "active" ? data : null;
}

async function buildOfferPayload(
  supabase: SupabaseClient,
  code: string,
  creatorId: string,
  creatorCodeId: string | null,
) {
  const { data: creator, error: creatorError } = await supabase
    .from("creators")
    .select("id, display_name, status")
    .eq("id", creatorId)
    .maybeSingle();
  if (creatorError) throw new Error(creatorError.message);
  if (!creator || creator.status !== "active") {
    return null;
  }

  let redemptionUrl: string | null = null;
  if (creatorCodeId) {
    const { data: codeRow } = await supabase
      .from("creator_codes")
      .select("code, app_store_redemption_url, apple_app_id")
      .eq("id", creatorCodeId)
      .maybeSingle();
    redemptionUrl = codeRow?.app_store_redemption_url ??
      buildAppStoreRedemptionUrl({
        code: codeRow?.code ?? code,
        appleAppId: codeRow?.apple_app_id,
      });
  } else {
    redemptionUrl = buildAppStoreRedemptionUrl({ code });
  }

  return {
    code,
    creator_name: creator.display_name,
    redemption_url: redemptionUrl,
  };
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
    return json({ error: "creator_attribution_not_configured" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken ||
    (authHeader ? authHeader.replace(/^Bearer\s+/i, "") : null);
  if (!token) return json({ error: "Missing authentication token" }, 401);

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    token,
  );
  if (authError || !user) return json({ error: "Unauthorized" }, 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const code = normalizeCreatorCode(body.code);
  if (!code) {
    return json({ error: "invalid_creator_code" }, 400);
  }

  const referralClickToken = cleanString(
    body.referral_click_token ?? body.referral_click_id,
    120,
  );
  if (referralClickToken && !isUuid(referralClickToken)) {
    return json({ error: "invalid_referral_click_token" }, 400);
  }

  let referralClickId: string | null = null;
  if (referralClickToken) {
    const { data: clickRow, error: clickLookupError } = await supabase
      .from("referral_clicks")
      .select("id")
      .or(`id.eq.${referralClickToken},click_token.eq.${referralClickToken}`)
      .maybeSingle();
    if (clickLookupError) throw new Error(clickLookupError.message);
    referralClickId = clickRow?.id ?? null;
    if (!referralClickId) {
      console.warn("[creator-code-attribution] referral click not found", {
        referralClickToken,
      });
    }
  }

  try {
    const eligibility = await isCreatorOfferEligibleUser(supabase, user.id);
    if (!eligibility.eligible) {
      return json({
        ok: false,
        error: "creator_offer_ineligible",
        reason: eligibility.reason ?? "ineligible",
        message: eligibility.reason === "already_subscribed"
          ? "You already have an active Angler membership. Creator discounts cannot change an existing subscription."
          : "Creator discounts are for first-time Angler subscribers only.",
      }, 403);
    }

    const existing = await getActiveAttribution(supabase, user.id);
    if (existing) {
      const offer = await buildOfferPayload(
        supabase,
        existing.code ?? code,
        existing.creator_id,
        existing.creator_code_id,
      );
      return json({
        ok: true,
        status: "already_attributed",
        attribution: existing,
        creator_name: offer?.creator_name ?? null,
        redemption_url: offer?.redemption_url ?? null,
        code: existing.code ?? code,
      });
    }

    const { data: codeRow, error: codeError } = await supabase
      .from("creator_codes")
      .select(
        "id, creator_id, code, is_active, app_store_redemption_url, apple_app_id, app_store_offer_reference_name",
      )
      .eq("code", code)
      .maybeSingle();
    if (codeError) throw new Error(codeError.message);
    if (!codeRow) return json({ error: "creator_code_not_found" }, 404);

    const creatorCode = codeRow as CreatorCodeRow;
    const { data: creator, error: creatorError } = await supabase
      .from("creators")
      .select(
        "id, display_name, commission_rate_bps, commission_month_cap, status",
      )
      .eq("id", creatorCode.creator_id)
      .maybeSingle();
    if (creatorError) throw new Error(creatorError.message);
    if (!creator || creator.status !== "active") {
      return json({ error: "creator_code_not_found" }, 404);
    }

    const creatorRow = creator as CreatorRow;
    const redemptionUrl = creatorCode.app_store_redemption_url ??
      buildAppStoreRedemptionUrl({
        code: creatorCode.code,
        appleAppId: creatorCode.apple_app_id,
      });

    if (!creatorCode.is_active) {
      return json({
        ok: false,
        status: "code_pending_app_store_approval",
        code: creatorCode.code,
        creator_name: creatorRow.display_name,
        redemption_url: redemptionUrl,
        message:
          "This creator code exists in FinFindr, but Apple has not made the redeemable App Store code active yet.",
      }, 409);
    }

    const { data: attribution, error: insertError } = await supabase
      .from("user_attributions")
      .insert({
        user_id: user.id,
        creator_id: creatorRow.id,
        creator_code_id: creatorCode.id,
        referral_click_id: referralClickId || null,
        attribution_source: "direct_link",
        code: creatorCode.code,
        commission_rate_bps_snapshot: creatorRow.commission_rate_bps,
        commission_month_cap_snapshot: creatorRow.commission_month_cap,
        status: "active",
      })
      .select(
        "id, creator_id, creator_code_id, code, attribution_source, status, attributed_at",
      )
      .single();

    if (insertError) {
      if (dbErrorCode(insertError) === "23505") {
        const raced = await getActiveAttribution(supabase, user.id);
        if (!raced) {
          return json({
            error: "creator_attribution_locked",
            message:
              "This account already has a creator attribution that cannot be replaced automatically.",
          }, 409);
        }
        const offer = await buildOfferPayload(
          supabase,
          raced.code ?? code,
          raced.creator_id,
          raced.creator_code_id,
        );
        return json({
          ok: true,
          status: "already_attributed",
          attribution: raced,
          creator_name: offer?.creator_name ?? creatorRow.display_name,
          redemption_url: offer?.redemption_url ?? redemptionUrl,
          code: raced.code ?? code,
        });
      }
      throw new Error(insertError.message);
    }

    return json({
      ok: true,
      status: "attributed",
      attribution,
      creator_name: creatorRow.display_name,
      redemption_url: redemptionUrl,
    });
  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : "Could not apply creator code.";
    console.error("[creator-code-attribution] failed", {
      userId: user.id,
      code,
      message,
    });
    return json({ error: "creator_code_attribution_failed", message }, 500);
  }
});
