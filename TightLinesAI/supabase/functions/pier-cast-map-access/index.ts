import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { resolveServerSubscriptionTier } from "../_shared/appAccess.ts";
import { createMapAccessHandler, MapAccessError } from "./handler.ts";

const database = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const handler = createMapAccessHandler({
  // same account and subscription check as PierCast City Reports
  account: async (request) => {
    const token = request.headers.get("x-user-token") ??
      request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) throw new MapAccessError("unauthorized", "Sign in to use the Live Lake Map.", 401);
    const { data: { user }, error } = await database.auth.getUser(token);
    if (error || !user) throw new MapAccessError("unauthorized", "Sign in to use the Live Lake Map.", 401);
    const { data: profile, error: profileError } = await database.from("profiles")
      .select("subscription_tier").eq("id", user.id).single();
    if (profileError || !profile) throw new Error("Profile unavailable");
    return {
      userId: user.id,
      free: resolveServerSubscriptionTier(profile.subscription_tier, user.email) === "free",
    };
  },
  claimVisit: async (userId, visitId, allowed) => {
    const { data, error } = await database.rpc("claim_pier_cast_map_visit", {
      p_user_id: userId,
      p_visit_id: visitId,
      p_allowed: allowed,
    });
    if (error?.message === "subscription_required") {
      throw new MapAccessError(
        "subscription_required",
        "Your two free Live Lake Map visits have been used. Upgrade to keep exploring.",
        403,
      );
    }
    if (error?.message === "map_visit_expired") {
      throw new MapAccessError(
        "map_visit_expired",
        "This map session expired. Close and reopen the map to start a new visit.",
        409,
      );
    }
    if (error) throw new Error("Map visit claim failed");
    return Number(data);
  },
  claimPassIssue: async (userId) => {
    const { error } = await database.rpc("claim_pier_cast_map_pass_issue", {
      p_user_id: userId,
      p_allowed: 20,
      p_window_seconds: 600,
    });
    if (error?.message === "map_access_rate_limited") {
      throw new MapAccessError(
        "rate_limited",
        "The lake map was opened too many times. Wait a few minutes and try again.",
        429,
      );
    }
    if (error) throw new Error("Map pass rate limit failed");
  },
  secret: () => Deno.env.get("PIER_CAST_MAP_PASS_SECRET"),
});

Deno.serve(handler);
