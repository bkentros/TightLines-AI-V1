import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  checkUserRateLimit,
  rateLimitHeaders,
} from "../_shared/rateLimit.ts";

const VALID_TOPICS = [
  "general",
  "bug",
  "feature",
  "subscription",
  "todays_bite",
  "tackle_box",
  "water_read",
  "smart_log",
] as const;

const VALID_SENTIMENTS = ["looks_right", "needs_work", "note"] as const;
const SUPPORT_DAILY_LIMIT = 5;
const SUPPORT_NOTIFICATION_INBOX = "finfindr@hotmail.com";

type FeedbackTopic = typeof VALID_TOPICS[number];
type FeedbackSentiment = typeof VALID_SENTIMENTS[number];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-user-token",
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

function cleanString(value: unknown, max = 4000): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function asTopic(value: unknown): FeedbackTopic | null {
  return typeof value === "string" && VALID_TOPICS.includes(value as FeedbackTopic)
    ? value as FeedbackTopic
    : null;
}

function asSentiment(value: unknown): FeedbackSentiment | null {
  return typeof value === "string" && VALID_SENTIMENTS.includes(value as FeedbackSentiment)
    ? value as FeedbackSentiment
    : null;
}

function contextFromBody(body: Record<string, unknown>): Record<string, unknown> {
  const contextLines = Array.isArray(body.context_lines)
    ? body.context_lines
      .map((line) => cleanString(line, 300))
      .filter((line): line is string => Boolean(line))
      .slice(0, 20)
    : [];

  return {
    context_lines: contextLines,
    client_context: body.context && typeof body.context === "object" ? body.context : {},
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isApplePrivateRelay(email: string): boolean {
  return email.toLowerCase().endsWith("@privaterelay.appleid.com");
}

function appleRelayReplyInstructions(username: string | null): string[] {
  return [
    "",
    "⚠️ APPLE HIDE MY EMAIL — Outlook/Hotmail Reply will bounce (550 5.1.1)",
    "",
    "This user signed in with Apple and uses a private relay address.",
    "Apple only forwards your reply if it is sent FROM a registered source.",
    "",
    "Option A (fastest): Register finfindr@hotmail.com",
    "  1. developer.apple.com → Account → Services",
    "  2. Sign in with Apple for Email Communication → Configure → +",
    "  3. Add finfindr@hotmail.com as an individual email → verify Apple’s email",
    "  4. Reply from Outlook as usual",
    "",
    "Option B (recommended): Reply from support@finfindr.app via Resend",
    "  1. Register finfindr.app under Domains in the same Apple screen (SPF must pass)",
    "  2. Send from support@finfindr.app (Resend dashboard or API), not personal Hotmail",
    "",
    "See TightLinesAI/docs/FINFINDR_EMAIL_SETUP.md → Apple Hide My Email",
    username ? `In-app username: @${username}` : null,
  ].filter((line): line is string => line != null);
}

async function sendEmailNotification(input: {
  topic: FeedbackTopic;
  featureName: string | null;
  message: string;
  userEmail: string | null;
  username: string | null;
  contextLines: string[];
}): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY")?.trim();
  // Deliver directly to your inbox — not support@finfindr.app. Cloudflare forwarding
  // can strip Reply-To, so Outlook Reply would loop back to you instead of the user.
  // This is intentionally fixed: a stale hosted secret must never silently route
  // customer messages to an old inbox.
  const to = SUPPORT_NOTIFICATION_INBOX;
  const from = Deno.env.get("FEEDBACK_EMAIL_FROM")?.trim() || "FinFindr <support@finfindr.app>";
  if (!apiKey) return false;

  const subjectFeature = input.featureName ? ` · ${input.featureName}` : "";
  const replyTarget = input.userEmail?.trim() || null;
  const appleRelay = replyTarget ? isApplePrivateRelay(replyTarget) : false;
  const relayInstructions = appleRelay
    ? appleRelayReplyInstructions(input.username)
    : [];
  const subject = replyTarget
    ? `FinFindr feedback · ${replyTarget} · ${input.topic}${subjectFeature}`
    : `FinFindr feedback · ${input.topic}${subjectFeature}`;

  const text = [
    replyTarget
      ? appleRelay
        ? `Reply-To user (Apple relay): ${replyTarget}`
        : `Reply-To user: ${replyTarget}`
      : "Reply-To user: unavailable — check Supabase app_feedback for this message.",
    input.username ? `Username: @${input.username}` : null,
    `Topic: ${input.topic}${subjectFeature}`,
    "",
    input.message,
    ...relayInstructions,
    "",
    "--- Context ---",
    ...input.contextLines,
  ].filter(Boolean).join("\n");

  const relayHtmlBlock = appleRelay
    ? [
      "<div style=\"margin:12px 0;padding:12px;border:1px solid #c9a227;border-radius:8px;background:#fffbea\">",
      "<p><strong>⚠️ Apple Hide My Email</strong></p>",
      "<p>Replies from personal Hotmail/Outlook <strong>will bounce</strong> until you register your sender in ",
      "<a href=\"https://developer.apple.com/account/resources/services/list\">Apple Developer → Sign in with Apple → Email Communication</a>.</p>",
      "<p><strong>Quick fix:</strong> register <code>finfindr@hotmail.com</code> as an individual email source and verify Apple’s confirmation email.</p>",
      "<p><strong>Long-term:</strong> register <code>finfindr.app</code> and reply from <code>support@finfindr.app</code> via Resend.</p>",
      input.username
        ? `<p><strong>In-app username:</strong> @${escapeHtml(input.username)}</p>`
        : "",
      "</div>",
    ].join("")
    : "";

  const html = [
    "<div style=\"font-family:system-ui,sans-serif;line-height:1.5\">",
    replyTarget
      ? `<p><strong>Reply to this user:</strong> <a href="mailto:${escapeHtml(replyTarget)}">${escapeHtml(replyTarget)}</a></p>`
      : "<p><strong>Reply-To user:</strong> unavailable — no email on this account.</p>",
    relayHtmlBlock,
    input.username ? `<p><strong>Username:</strong> @${escapeHtml(input.username)}</p>` : "",
    `<p><strong>Topic:</strong> ${escapeHtml(input.topic)}${subjectFeature ? escapeHtml(subjectFeature) : ""}</p>`,
    `<pre style=\"white-space:pre-wrap;font-family:inherit\">${escapeHtml(input.message)}</pre>`,
    "<hr />",
    "<p><strong>Context</strong></p>",
    `<pre style=\"white-space:pre-wrap;font-family:inherit\">${escapeHtml(input.contextLines.join("\n"))}</pre>`,
    "</div>",
  ].join("");

  const payload: Record<string, unknown> = {
    from,
    to: [to],
    subject,
    text,
    html,
  };

  if (replyTarget) {
    payload.reply_to = [replyTarget];
    payload.headers = {
      "Reply-To": replyTarget,
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("[submit-feedback] Resend send failed", res.status, detail);
    }
    return res.ok;
  } catch (error) {
    console.error("[submit-feedback] Resend send error", error);
    return false;
  }
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
  const token = userToken || (authHeader ? authHeader.replace("Bearer ", "") : null);
  if (!token) return json({ error: "Missing authentication token" }, 401);

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return json({ error: "Unauthorized" }, 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const topic = asTopic(body.topic) ?? "general";
  const sentiment = asSentiment(body.sentiment);
  const featureName = cleanString(body.feature_name, 80);
  const message = cleanString(body.message);
  if (!message || message.length < 8) {
    return json({ error: "Please include a little more detail." }, 400);
  }

  const rateLimit = await checkUserRateLimit(supabase, {
    userId: user.id,
    feature: "support_feedback",
    rules: [{ windowSeconds: 24 * 60 * 60, maxRequests: SUPPORT_DAILY_LIMIT }],
  });
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        error: "rate_limited",
        message:
          "You've reached today's support message limit. Please try again tomorrow, or email support@finfindr.app if this is urgent.",
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(),
          ...rateLimitHeaders(rateLimit),
        },
      },
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, subscription_tier, home_region, home_state, home_city")
    .eq("id", user.id)
    .maybeSingle();

  const context = contextFromBody(body);
  const contextLines = context.context_lines as string[];
  const emailSent = await sendEmailNotification({
    topic,
    featureName,
    message,
    userEmail: user.email ?? null,
    username: (profile?.username as string | undefined) ?? null,
    contextLines,
  });

  const { error: insertError } = await supabase.from("app_feedback").insert({
    user_id: user.id,
    user_email: user.email ?? null,
    username: (profile?.username as string | undefined) ?? null,
    subscription_tier: (profile?.subscription_tier as string | undefined) ?? null,
    topic,
    sentiment,
    feature_name: featureName,
    message,
    context: {
      ...context,
      home_region: profile?.home_region ?? null,
      home_state: profile?.home_state ?? null,
      home_city: profile?.home_city ?? null,
    },
    app_platform: cleanString(body.app_platform, 40),
    email_sent: emailSent,
  });

  if (insertError) {
    return json({ error: "Could not save feedback." }, 500);
  }

  return json({ ok: true, email_sent: emailSent });
});
