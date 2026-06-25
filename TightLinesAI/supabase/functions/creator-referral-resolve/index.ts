import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildCreatorReferralWebUrl,
  cleanString,
  FINGERPRINT_MATCH_WINDOW_HOURS,
  isReferralClickWithinAttributionWindow,
  isReferralClickWithinFingerprintWindow,
  isReferralClickWithinInstallRecentFallbackWindow,
  isReferralClickWithinIpOnlyInstallWindow,
  isUuid,
  normalizeCreatorCode,
  parseCreatorReferralPayload,
  REFERRAL_CLICK_ATTRIBUTION_WINDOW_DAYS,
} from "../_shared/creatorProgram.ts";
import {
  recordReferralAppOpen,
  type ReferralAppOpenMatchMethod,
} from "../_shared/creatorReferralFunnel.ts";

type MatchMethod = ReferralAppOpenMatchMethod;

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

async function recordAppOpen(
  supabase: ReturnType<typeof createClient>,
  clickId: string,
  creatorId: string,
  matchMethod: MatchMethod,
  alreadyOpened: boolean,
): Promise<void> {
  await recordReferralAppOpen(supabase, {
    clickId,
    creatorId,
    matchMethod,
    alreadyOpened,
  });
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

  const matchMethod = cleanString(body.match_method, 40) as MatchMethod | null;
  const allowedMethods = new Set([
    "clipboard",
    "fingerprint",
    "deep_link",
    "universal_link",
    "install_recent",
  ]);
  if (!matchMethod || !allowedMethods.has(matchMethod)) {
    return json({ error: "invalid_match_method" }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const referralClickToken = cleanString(
    body.referral_click_token ?? body.click,
    120,
  );
  const codeFromBody = normalizeCreatorCode(body.code);
  const clipboardPayload = cleanString(body.clipboard_payload, 2000);

  let resolvedToken = referralClickToken && isUuid(referralClickToken)
    ? referralClickToken
    : null;
  let resolvedCode = codeFromBody;

  if (clipboardPayload && matchMethod === "clipboard") {
    const parsed = parseCreatorReferralPayload(clipboardPayload);
    if (parsed) {
      resolvedToken = parsed.referralClickToken;
      resolvedCode = parsed.code;
    }
  }

  try {
    if (resolvedToken) {
      const { data: clickRow, error } = await supabase
        .from("referral_clicks")
        .select(
          "id, creator_id, code, created_at, app_opened_at, app_open_match_method",
        )
        .or(`id.eq.${resolvedToken},click_token.eq.${resolvedToken}`)
        .maybeSingle();
      if (error) throw new Error(error.message);

      if (!clickRow) {
        return json({
          ok: false,
          error: "referral_click_not_found",
        }, 404);
      }

      if (!isReferralClickWithinAttributionWindow(clickRow.created_at)) {
        return json({
          ok: false,
          error: "referral_click_expired",
          message:
            `Referral expired. Conversions must happen within ${REFERRAL_CLICK_ATTRIBUTION_WINDOW_DAYS} days of the click.`,
        }, 400);
      }

      const clickCode = normalizeCreatorCode(clickRow.code);
      if (resolvedCode && clickCode && resolvedCode !== clickCode) {
        return json({
          ok: false,
          error: "referral_click_code_mismatch",
        }, 400);
      }

      await recordAppOpen(
        supabase,
        clickRow.id,
        clickRow.creator_id,
        matchMethod,
        Boolean(clickRow.app_opened_at),
      );

      const { data: creator } = await supabase
        .from("creators")
        .select("display_name, slug")
        .eq("id", clickRow.creator_id)
        .maybeSingle();

      return json({
        ok: true,
        match_method: matchMethod,
        referral_click_id: clickRow.id,
        click_token: resolvedToken,
        code: clickCode ?? resolvedCode,
        creator_name: creator?.display_name ?? null,
        creator_slug: creator?.slug ?? null,
        referral_web_url: buildCreatorReferralWebUrl(
          clickCode ?? resolvedCode ?? "",
          resolvedToken,
        ),
      });
    }

    if (matchMethod !== "fingerprint") {
      return json({ ok: false, error: "referral_click_required" }, 400);
    }

    const pepper = Deno.env.get("CREATOR_REFERRAL_HASH_PEPPER") ??
      "finfindr-creator-referral-v1";
    const ip = clientIp(req);
    const userAgent = req.headers.get("user-agent") ?? "";
    if (!ip || !userAgent) {
      return json({ ok: false, error: "fingerprint_signals_unavailable" }, 400);
    }

    const ipHash = await hashDiagnostic(ip, pepper);
    const userAgentHash = await hashDiagnostic(userAgent.slice(0, 500), pepper);

    const { data: candidates, error: fpError } = await supabase
      .from("referral_clicks")
      .select(
        "id, creator_id, code, click_token, created_at, app_opened_at",
      )
      .eq("ip_hash", ipHash)
      .eq("user_agent_hash", userAgentHash)
      .is("app_opened_at", null)
      .order("created_at", { ascending: false })
      .limit(5);
    if (fpError) throw new Error(fpError.message);

    let clickRow = (candidates ?? []).find((row) =>
      isReferralClickWithinFingerprintWindow(row.created_at) &&
      isReferralClickWithinAttributionWindow(row.created_at)
    );

    if (!clickRow) {
      const { data: ipCandidates, error: ipError } = await supabase
        .from("referral_clicks")
        .select(
          "id, creator_id, code, click_token, created_at, app_opened_at",
        )
        .eq("ip_hash", ipHash)
        .is("app_opened_at", null)
        .order("created_at", { ascending: false })
        .limit(10);
      if (ipError) throw new Error(ipError.message);

      clickRow = (ipCandidates ?? []).find((row) =>
        isReferralClickWithinIpOnlyInstallWindow(row.created_at) &&
        isReferralClickWithinAttributionWindow(row.created_at)
      );
    }

    let resolvedMatchMethod: MatchMethod = "fingerprint";

    if (!clickRow) {
      const { data: recentCandidates, error: recentError } = await supabase
        .from("referral_clicks")
        .select(
          "id, creator_id, code, click_token, created_at, app_opened_at",
        )
        .is("app_opened_at", null)
        .order("created_at", { ascending: false })
        .limit(10);
      if (recentError) throw new Error(recentError.message);

      clickRow = (recentCandidates ?? []).find((row) =>
        isReferralClickWithinInstallRecentFallbackWindow(row.created_at) &&
        isReferralClickWithinAttributionWindow(row.created_at)
      );
      if (clickRow) {
        resolvedMatchMethod = "install_recent";
      }
    }

    if (!clickRow) {
      return json({
        ok: false,
        error: "fingerprint_no_match",
        message:
          `No recent creator click matched this device (within ${FINGERPRINT_MATCH_WINDOW_HOURS}h).`,
      }, 404);
    }

    await recordAppOpen(
      supabase,
      clickRow.id,
      clickRow.creator_id,
      resolvedMatchMethod,
      false,
    );

    const { data: creator } = await supabase
      .from("creators")
      .select("display_name, slug")
      .eq("id", clickRow.creator_id)
      .maybeSingle();

    const code = normalizeCreatorCode(clickRow.code);
    const token = clickRow.click_token as string;

    return json({
      ok: true,
      match_method: resolvedMatchMethod,
      referral_click_id: clickRow.id,
      click_token: token,
      code,
      creator_name: creator?.display_name ?? null,
      creator_slug: creator?.slug ?? null,
      referral_web_url: code
        ? buildCreatorReferralWebUrl(code, token)
        : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Resolve failed.";
    console.error("[creator-referral-resolve] failed", { message });
    return json({ error: "creator_referral_resolve_failed", message }, 500);
  }
});
