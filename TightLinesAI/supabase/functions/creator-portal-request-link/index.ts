import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  CREATOR_PORTAL_AUTH_CALLBACK,
  isCreatorPortalLoginAllowed,
  normalizeEmail,
} from "../_shared/creatorPortalAccess.ts";
import { checkPublicRequestRateLimits } from "../_shared/publicRateLimit.ts";
import { rateLimitHeaders } from "../_shared/rateLimit.ts";

const SUCCESS = {
  ok: true,
  message: "Check your email for a sign-in link. It expires in a few minutes.",
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
  };
}

function json(
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
      ...extraHeaders,
    },
  });
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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return json({ error: "invalid_email" }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const limit = await checkPublicRequestRateLimits({
      supabase,
      request: req,
      pepper: serviceRoleKey,
      feature: "creator_portal_link",
      ipMaxRequests: 20,
      token: email,
      tokenMaxRequests: 5,
      windowSeconds: 3600,
    });
    if (limit) {
      return json(
        {
          error: "rate_limited",
          message: "Too many requests. Please wait before trying again.",
          retryAfterSeconds: limit.retryAfterSeconds,
        },
        429,
        rateLimitHeaders(limit),
      );
    }
    const access = await isCreatorPortalLoginAllowed(supabase, email);
    if (!access.allowed) {
      return json(SUCCESS);
    }

    const otpResponse = await fetch(`${supabaseUrl}/auth/v1/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        email,
        create_user: true,
        data: {
          creator_portal: true,
          creator_slug: access.creatorSlug,
          creator_portal_admin: access.isAdmin,
        },
        options: {
          email_redirect_to: CREATOR_PORTAL_AUTH_CALLBACK,
        },
      }),
    });

    const otpText = await otpResponse.text();
    if (!otpResponse.ok) {
      console.error("[creator-portal-request-link] otp failed", {
        email,
        status: otpResponse.status,
        body: otpText.slice(0, 300),
      });
      return json({
        error: "creator_portal_link_failed",
        message: "Could not send a sign-in link right now. Try again shortly.",
      }, 502);
    }

    return json(SUCCESS);
  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : "Could not send sign-in link.";
    console.error("[creator-portal-request-link] failed", { email, message });
    return json({ error: "creator_portal_link_failed", message }, 500);
  }
});
