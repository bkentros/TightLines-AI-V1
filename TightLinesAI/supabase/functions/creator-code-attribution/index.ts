import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  cleanString,
  isCreatorReferralEligibleUser,
  isUuid,
  normalizeCreatorCode,
  pickReferralClickForInstallyMatch,
  referralClickQualifiesForAttribution,
  REFERRAL_CLICK_ATTRIBUTION_WINDOW_DAYS,
} from "../_shared/creatorProgram.ts";
import { recordReferralAppOpen } from "../_shared/creatorReferralFunnel.ts";

type SupabaseClient = {
  auth: ReturnType<typeof createClient>["auth"];
  from: (table: string) => any;
};

type CreatorCodeRow = {
  id: string;
  creator_id: string;
  code: string;
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

async function resolveReferralClickFromInstally(
  supabase: SupabaseClient,
  installyClickId: string,
) {
  const { data: linked, error: linkedError } = await supabase
    .from("referral_clicks")
    .select("id, creator_id, code, created_at, app_opened_at, instally_click_id")
    .eq("instally_click_id", installyClickId)
    .maybeSingle();
  if (linkedError) throw new Error(linkedError.message);
  if (linked) return linked;

  const { data: installyCreators, error: creatorError } = await supabase
    .from("creators")
    .select("id")
    .eq("status", "active")
    .not("instally_link_slug", "is", null);
  if (creatorError) throw new Error(creatorError.message);

  const installyEnabledCreatorIds = new Set(
    (installyCreators ?? []).map((row) => row.id as string),
  );
  if (installyEnabledCreatorIds.size === 0) return null;

  const { data: attributedRows, error: attributedError } = await supabase
    .from("user_attributions")
    .select("referral_click_id")
    .not("referral_click_id", "is", null);
  if (attributedError) throw new Error(attributedError.message);

  const attributedClickIds = new Set(
    (attributedRows ?? [])
      .map((row) => row.referral_click_id as string | null)
      .filter((value): value is string => Boolean(value)),
  );

  const windowStart = new Date(
    Date.now() - 48 * 60 * 60 * 1000,
  ).toISOString();

  const { data: candidates, error: candidateError } = await supabase
    .from("referral_clicks")
    .select(
      "id, creator_id, code, created_at, app_opened_at, instally_click_id",
    )
    .in("creator_id", [...installyEnabledCreatorIds])
    .gte("created_at", windowStart)
    .order("created_at", { ascending: false })
    .limit(50);
  if (candidateError) throw new Error(candidateError.message);

  const picked = pickReferralClickForInstallyMatch({
    installyClickId,
    candidates: candidates ?? [],
    attributedClickIds,
    installyEnabledCreatorIds,
  });
  if (!picked) return null;

  await supabase
    .from("referral_clicks")
    .update({ instally_click_id: installyClickId })
    .eq("id", picked.id)
    .is("instally_click_id", null);

  return picked;
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

async function getCreatorDisplayName(
  supabase: SupabaseClient,
  creatorId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("creators")
    .select("display_name, status")
    .eq("id", creatorId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || data.status !== "active") return null;
  return data.display_name as string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (Deno.env.get("CREATOR_PROGRAM_ENABLED") !== "true") {
    return json({ error: "creator_program_disabled" }, 404);
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

  let code = normalizeCreatorCode(body.code);
  const installyClickId = cleanString(body.instally_click_id, 120);
  const referralClickToken = cleanString(
    body.referral_click_token ?? body.referral_click_id,
    120,
  );

  if (!referralClickToken && !installyClickId) {
    return json({
      ok: false,
      error: "referral_click_required",
      message:
        "Creator referrals require a tracked creator link or verified install match.",
    }, 400);
  }

  let referralClickId: string | null = null;
  let referralClickCreatorId: string | null = null;
  let referralClickCode: string | null = null;
  let referralClickCreatedAt: string | null = null;
  let referralClickAppOpenedAt: string | null = null;
  let attributionSource: "direct_link" | "instally" = "direct_link";

  if (referralClickToken) {
    if (!isUuid(referralClickToken)) {
      return json({ error: "invalid_referral_click_token" }, 400);
    }

    const { data: clickRow, error: clickLookupError } = await supabase
      .from("referral_clicks")
      .select("id, creator_id, code, created_at, app_opened_at")
      .or(`id.eq.${referralClickToken},click_token.eq.${referralClickToken}`)
      .maybeSingle();
    if (clickLookupError) throw new Error(clickLookupError.message);

    if (!clickRow) {
      return json({
        ok: false,
        error: "referral_click_not_found",
        message:
          "This creator link session expired or was not opened from a valid referral link.",
      }, 400);
    }

    referralClickId = clickRow.id;
    referralClickCreatorId = clickRow.creator_id;
    referralClickCode = clickRow.code;
    referralClickCreatedAt = clickRow.created_at as string;
    referralClickAppOpenedAt = clickRow.app_opened_at as string | null;

    if (
      !referralClickQualifiesForAttribution({
        createdAt: referralClickCreatedAt,
        appOpenedAt: referralClickAppOpenedAt,
      })
    ) {
      return json({
        ok: false,
        error: "referral_click_expired",
        message:
          `Creator referrals must sign up within ${REFERRAL_CLICK_ATTRIBUTION_WINDOW_DAYS} days of clicking the link, or after installing from that link.`,
      }, 400);
    }
  }

  if (installyClickId) {
    attributionSource = "instally";

    const installyClickRow = referralClickId
      ? null
      : await resolveReferralClickFromInstally(supabase, installyClickId);

    if (installyClickRow && !referralClickId) {
      referralClickId = installyClickRow.id;
      referralClickCreatorId = installyClickRow.creator_id;
      referralClickCode = installyClickRow.code;
      referralClickCreatedAt = installyClickRow.created_at as string;
      referralClickAppOpenedAt = installyClickRow.app_opened_at as string | null;

      if (
        !referralClickQualifiesForAttribution({
          createdAt: referralClickCreatedAt,
          appOpenedAt: referralClickAppOpenedAt,
        })
      ) {
        return json({
          ok: false,
          error: "referral_click_expired",
          message:
            `Creator referrals must sign up within ${REFERRAL_CLICK_ATTRIBUTION_WINDOW_DAYS} days of clicking the link, or after installing from that link.`,
        }, 400);
      }
    }
  }

  if (!code) {
    code = normalizeCreatorCode(referralClickCode);
  }

  if (!code) {
    return json({
      ok: false,
      error: "creator_referral_unresolved",
      message:
        "Could not match this install to a creator partner. Open FinFindr from the creator link you clicked.",
    }, 400);
  }

  if (
    referralClickCode &&
    normalizeCreatorCode(referralClickCode) !== code
  ) {
    return json({
      ok: false,
      error: "referral_click_code_mismatch",
      message: "This creator link does not match this referral.",
    }, 400);
  }

  try {
    const eligibility = await isCreatorReferralEligibleUser(supabase, user.id);
    if (!eligibility.eligible) {
      return json({
        ok: false,
        error: "creator_referral_ineligible",
        reason: eligibility.reason ?? "ineligible",
        message: eligibility.reason === "already_subscribed"
          ? "You already have an active Angler membership."
          : "Creator referrals are for first-time Angler subscribers only.",
      }, 403);
    }

    const existing = await getActiveAttribution(supabase, user.id);
    if (existing) {
      const creatorName = await getCreatorDisplayName(supabase, existing.creator_id);
      return json({
        ok: true,
        status: "already_attributed",
        attribution: existing,
        creator_name: creatorName,
        code: existing.code ?? code,
      });
    }

    const { data: codeRow, error: codeError } = await supabase
      .from("creator_codes")
      .select("id, creator_id, code")
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

    if (
      referralClickCreatorId &&
      referralClickCreatorId !== creatorCode.creator_id
    ) {
      return json({
        ok: false,
        error: "referral_click_creator_mismatch",
        message: "This creator link does not match this referral.",
      }, 400);
    }

    const creatorRow = creator as CreatorRow;

    const { data: attribution, error: insertError } = await supabase
      .from("user_attributions")
      .insert({
        user_id: user.id,
        creator_id: creatorRow.id,
        creator_code_id: creatorCode.id,
        referral_click_id: referralClickId,
        instally_click_id: installyClickId,
        attribution_source: attributionSource,
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
        const creatorName = await getCreatorDisplayName(supabase, raced.creator_id);
        return json({
          ok: true,
          status: "already_attributed",
          attribution: raced,
          creator_name: creatorName ?? creatorRow.display_name,
          code: raced.code ?? code,
        });
      }
      throw new Error(insertError.message);
    }

    if (referralClickId && !referralClickAppOpenedAt) {
      await recordReferralAppOpen(supabase, {
        clickId: referralClickId,
        creatorId: creatorRow.id,
        matchMethod: installyClickId ? "install_recent" : "deep_link",
        alreadyOpened: false,
      });
    }

    if (installyClickId && referralClickId) {
      await supabase
        .from("referral_clicks")
        .update({ instally_click_id: installyClickId })
        .eq("id", referralClickId)
        .is("instally_click_id", null);
    }

    const { data: existingSignupFunnel } = await supabase
      .from("referral_funnel_events")
      .select("id")
      .eq("referral_click_id", referralClickId)
      .eq("event_type", "signup")
      .maybeSingle();
    if (!existingSignupFunnel) {
      const { error: funnelError } = await supabase
        .from("referral_funnel_events")
        .insert({
          referral_click_id: referralClickId,
          creator_id: creatorRow.id,
          event_type: "signup",
        });
      if (funnelError) {
        console.warn("[creator-code-attribution] signup funnel event failed", {
          userId: user.id,
          referralClickId,
          creatorId: creatorRow.id,
          error: funnelError.message,
        });
      }
    }

    return json({
      ok: true,
      status: "attributed",
      attribution,
      creator_name: creatorRow.display_name,
    });
  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : "Could not apply creator referral.";
    console.error("[creator-code-attribution] failed", {
      userId: user.id,
      code,
      message,
    });
    return json({ error: "creator_code_attribution_failed", message }, 500);
  }
});
