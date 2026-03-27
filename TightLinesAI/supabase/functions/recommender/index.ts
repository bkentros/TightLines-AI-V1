import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildSharedEngineRequestFromEnvData,
  isEngineContext,
} from "../_shared/howFishingEngine/index.ts";
import {
  runRecommender,
  type RecommenderRefinements,
  type TackleBoxItem,
} from "../_shared/recommenderEngine/index.ts";
import {
  buildRecommenderBrief,
  primaryTrackKind,
  polishRecommenderOutput,
} from "../_shared/recommenderPolish/mod.ts";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-user-token",
  };
}

function locationLocalMidnightIso(timezone: string, now = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]));
  const y = Number(parts.year);
  const m = Number(parts.month);
  const d = Number(parts.day);
  const hh = Number(parts.hour);
  const mm = Number(parts.minute);
  const ss = Number(parts.second);
  const localNowUtcMillis = Date.UTC(y, m - 1, d, hh, mm, ss);
  const offsetMillis = localNowUtcMillis - now.getTime();
  const nextLocalMidnightUtcMillis = Date.UTC(y, m - 1, d + 1, 0, 0, 0) - offsetMillis;
  return new Date(nextLocalMidnightUtcMillis).toISOString();
}

function extractTimezone(envData: Record<string, unknown>): string {
  if (typeof envData.timezone === "string" && envData.timezone.length > 0) {
    return envData.timezone;
  }
  return "America/New_York";
}

function localDateInTz(timezone: string, d = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

function parseRefinements(raw: unknown): RecommenderRefinements {
  if (!raw || typeof raw !== "object") return {};
  const source = raw as Record<string, unknown>;

  return {
    ...(source.water_clarity === "clear" ||
        source.water_clarity === "stained" ||
        source.water_clarity === "dirty"
      ? { water_clarity: source.water_clarity }
      : {}),
  };
}

function parseInventoryItems(raw: unknown): TackleBoxItem[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const items = raw.filter((item) => item && typeof item === "object").map((item) => item as TackleBoxItem);
  return items.length > 0 ? items : undefined;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken || (authHeader ? authHeader.replace("Bearer ", "") : null);
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing authentication token" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const lat = Number(body.latitude);
  const lon = Number(body.longitude);
  if (Number.isNaN(lat) || lat < -90 || lat > 90) {
    return new Response(JSON.stringify({ error: "Invalid latitude" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
  if (Number.isNaN(lon) || lon < -180 || lon > 180) {
    return new Response(JSON.stringify({ error: "Invalid longitude" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const context = typeof body.context === "string" && isEngineContext(body.context)
    ? body.context
    : null;
  if (!context) {
    return new Response(JSON.stringify({ error: "Invalid context" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  if (!body.env_data || typeof body.env_data !== "object") {
    return new Response(
      JSON.stringify({ error: "missing_env_data", message: "env_data is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      },
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();
  const tier = (profile?.subscription_tier as string) ?? "free";
  if (tier === "free") {
    return new Response(
      JSON.stringify({ error: "subscription_required", message: "Subscribe to use this feature" }),
      { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  const envData = body.env_data as Record<string, unknown>;
  const timezone = extractTimezone(envData);
  const localDate = localDateInTz(timezone);
  const sharedRequest = buildSharedEngineRequestFromEnvData(
    lat,
    lon,
    localDate,
    timezone,
    context,
    envData,
  );

  const openaiKey = Deno.env.get("OPENAI_API_KEY") ?? "";

  try {
    const timestampUtc = new Date().toISOString();
    const { response, behaviorResolution } = runRecommender(
      {
        request: sharedRequest,
        refinements: parseRefinements(body.refinements),
        inventory_items: parseInventoryItems(body.inventory_items),
      },
      {
        generated_at: timestampUtc,
        cache_expires_at: locationLocalMidnightIso(timezone),
      },
    );

    // ── LLM polish (mandatory — null only on failure) ───────────────────
    let actualCostUsd = 0;
    if (openaiKey) {
      try {
        const briefText = buildRecommenderBrief({
          response,
          behavior: behaviorResolution,
          localDate,
          locationName: typeof body.location_name === "string" ? body.location_name : null,
        });
        const polishResult = await polishRecommenderOutput(openaiKey, briefText, response, primaryTrackKind(response));
        if (polishResult) {
          response.polished = polishResult.polished;
          const INPUT_COST_PER_1M = 0.15;
          const OUTPUT_COST_PER_1M = 0.60;
          actualCostUsd =
            (polishResult.inT * INPUT_COST_PER_1M + polishResult.outT * OUTPUT_COST_PER_1M) /
            1_000_000;
        }
      } catch (e) {
        console.error("[recommender] polish failed, shipping engine copy:", e);
      }
    }

    await supabase.from("ai_sessions").insert({
      user_id: user.id,
      session_type: "recommender",
      input_payload: {
        latitude: lat,
        longitude: lon,
        context,
        refinements: parseRefinements(body.refinements),
      },
      response_payload: null,
      token_cost_usd: actualCostUsd,
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  } catch (error) {
    console.error("[recommender] failed:", error);
    return new Response(
      JSON.stringify({
        error: "recommender_failed",
        message: error instanceof Error ? error.message : "Unable to generate recommendations.",
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }
});
