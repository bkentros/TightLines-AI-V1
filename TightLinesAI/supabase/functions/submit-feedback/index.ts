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
  const to = Deno.env.get("FEEDBACK_EMAIL_TO")?.trim() || "finfindr@hotmail.com";
  const from = Deno.env.get("FEEDBACK_EMAIL_FROM")?.trim() || "FinFindr <support@finfindr.app>";
  if (!apiKey) return false;

  const subjectFeature = input.featureName ? ` · ${input.featureName}` : "";
  const replyTarget = input.userEmail?.trim() || null;
  const subject = replyTarget
    ? `FinFindr feedback · ${replyTarget} · ${input.topic}${subjectFeature}`
    : `FinFindr feedback · ${input.topic}${subjectFeature}`;

  const text = [
    replyTarget
      ? `Reply-To user: ${replyTarget}`
      : "Reply-To user: unavailable — check Supabase app_feedback for this message.",
    input.username ? `Username: @${input.username}` : null,
    `Topic: ${input.topic}${subjectFeature}`,
    "",
    input.message,
    "",
    "--- Context ---",
    ...input.contextLines,
  ].filter(Boolean).join("\n");

  const html = [
    "<div style=\"font-family:system-ui,sans-serif;line-height:1.5\">",
    replyTarget
      ? `<p><strong>Reply to this user:</strong> <a href="mailto:${escapeHtml(replyTarget)}">${escapeHtml(replyTarget)}</a></p>`
      : "<p><strong>Reply-To user:</strong> unavailable — no email on this account.</p>",
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
