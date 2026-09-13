import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { resolveServerSubscriptionTier } from "../_shared/appAccess.ts";
import {
  checkUserRateLimit,
  rateLimitExceededResponse,
} from "../_shared/rateLimit.ts";
import { createReportService } from "../_shared/colorPickerEngine/reportService.ts";
import { ColorServiceError } from "../_shared/colorPickerEngine/serviceSupport.ts";
import { createReportStore } from "./store.ts";
import { COLOR_CORS, createColorHandler } from "./handler.ts";
const db = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

Deno.serve(createColorHandler({
  savedTrial: async (userId) => {
    const { data, error } = await db.from("feature_report_trials").select(
      "envelope",
    ).eq("user_id", userId).eq("feature", "color_match").maybeSingle();
    if (error) throw new Error("Trial lookup failed");
    return { report: data?.envelope ?? null };
  },
  authorize: async (request) => {
    const token = request.headers.get("x-user-token") ??
      request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) {
      throw new ColorServiceError(
        "unauthorized",
        "Sign in to use Color Match.",
        401,
      );
    }
    const { data: { user }, error } = await db.auth.getUser(token);
    if (error || !user) {
      throw new ColorServiceError(
        "unauthorized",
        "Sign in to use Color Match.",
        401,
      );
    }
    const { data: profile, error: profileError } = await db.from("profiles")
      .select("subscription_tier").eq("id", user.id).maybeSingle();
    if (profileError) {
      throw new ColorServiceError(
        "access_unavailable",
        "Access could not be verified.",
        503,
      );
    }
    if (!profile) {
      throw new ColorServiceError(
        "access_unavailable",
        "Access could not be verified.",
        503,
      );
    }
    const limit = await checkUserRateLimit(db, {
      userId: user.id,
      feature: "color_picker",
      rules: [{ windowSeconds: 60, maxRequests: 60 }, {
        windowSeconds: 86400,
        maxRequests: 500,
      }],
    });
    if (!limit.allowed) return rateLimitExceededResponse(limit, COLOR_CORS);
    return {
      userId: user.id,
      service: createReportService({
        store: createReportStore(
          db,
          resolveServerSubscriptionTier(
            profile.subscription_tier,
            user.email,
          ) === "free",
        ),
      }),
    };
  },
}));
