import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

type CleanupError = {
  label: string;
  message: string;
  code?: string;
};

async function runCleanup(
  label: string,
  task: PromiseLike<{ error: { message?: string; code?: string } | null }>,
): Promise<CleanupError | null> {
  const { error } = await task;
  if (!error) return null;
  if (error.code === "42P01") return null;
  return {
    label,
    message: error.message ?? "Unknown cleanup error",
    code: error.code,
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
    return json({ error: "Account deletion is not configured." }, 500);
  }

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader ? authHeader.replace("Bearer ", "") : null;
  const token = userToken ?? bearerToken;
  if (!token) {
    return json({ error: "Missing authentication token" }, 401);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser(
    token,
  );
  if (authError || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const cleanupErrors: CleanupError[] = [];
  const addCleanupError = (error: CleanupError | null) => {
    if (error) cleanupErrors.push(error);
  };

  addCleanupError(
    await runCleanup(
      "app_feedback_by_user",
      supabase.from("app_feedback").delete().eq("user_id", user.id),
    ),
  );
  if (user.email) {
    addCleanupError(
      await runCleanup(
        "app_feedback_by_email",
        supabase.from("app_feedback").delete().eq("user_email", user.email),
      ),
    );
  }
  addCleanupError(
    await runCleanup(
      "app_feature_rate_limit_buckets",
      supabase.from("app_feature_rate_limit_buckets").delete().eq(
        "user_id",
        user.id,
      ),
    ),
  );
  addCleanupError(
    await runCleanup(
      "water_reader_user_active_generation_requests",
      supabase.from("water_reader_user_active_generation_requests").delete().eq(
        "user_id",
        user.id,
      ),
    ),
  );
  addCleanupError(
    await runCleanup(
      "water_reader_user_history",
      supabase.from("water_reader_user_history").delete().eq(
        "user_id",
        user.id,
      ),
    ),
  );
  addCleanupError(
    await runCleanup(
      "waterbody_search_miss_events",
      supabase.from("waterbody_search_miss_events").delete().eq(
        "user_id",
        user.id,
      ),
    ),
  );
  addCleanupError(
    await runCleanup(
      "water_reader_generation_jobs_requested_by",
      supabase
        .from("water_reader_generation_jobs")
        .update({ requested_by: null })
        .eq("requested_by", user.id),
    ),
  );

  if (cleanupErrors.length > 0) {
    console.error("[delete-account] cleanup failed", {
      userId: user.id,
      cleanupErrors,
    });
    return json({ error: "Could not delete account data." }, 500);
  }

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
  if (deleteError) {
    console.error("[delete-account] failed", {
      userId: user.id,
      error: deleteError.message,
    });
    return json({ error: "Could not delete account." }, 500);
  }

  return json({ ok: true });
});
