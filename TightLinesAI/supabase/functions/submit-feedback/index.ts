import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

async function sendEmailNotification(input: {
  topic: FeedbackTopic;
  featureName: string | null;
  message: string;
  userEmail: string | null;
  username: string | null;
  contextLines: string[];
}): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY")?.trim();
  const to = Deno.env.get("FEEDBACK_EMAIL_TO")?.trim() || "support@finfindr.app";
  const from = Deno.env.get("FEEDBACK_EMAIL_FROM")?.trim() || "FinFindr <support@finfindr.app>";
  if (!apiKey) return false;

  const subjectFeature = input.featureName ? ` · ${input.featureName}` : "";
  const text = [
    `Topic: ${input.topic}${subjectFeature}`,
    input.username ? `Username: @${input.username}` : null,
    input.userEmail ? `Email: ${input.userEmail}` : null,
    "",
    input.message,
    "",
    "--- Context ---",
    ...input.contextLines,
  ].filter(Boolean).join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `FinFindr feedback: ${input.topic}${subjectFeature}`,
        text,
        reply_to: input.userEmail ?? undefined,
      }),
    });
    return res.ok;
  } catch {
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
