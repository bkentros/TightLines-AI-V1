export type RateLimitRule = {
  windowSeconds: number;
  maxRequests: number;
};

export type RateLimitResult = {
  allowed: boolean;
  feature: string;
  windowSeconds: number;
  maxRequests: number;
  requestCount: number;
  remaining: number;
  resetAt: string;
  retryAfterSeconds: number;
};

const OPEN_RESULT: RateLimitResult = {
  allowed: true,
  feature: "unknown",
  windowSeconds: 0,
  maxRequests: Number.MAX_SAFE_INTEGER,
  requestCount: 0,
  remaining: Number.MAX_SAFE_INTEGER,
  resetAt: new Date(0).toISOString(),
  retryAfterSeconds: 0,
};

function closedResult(
  feature: string,
  rule?: RateLimitRule,
): RateLimitResult {
  const windowSeconds = Math.max(1, Math.floor(rule?.windowSeconds ?? 60));
  const maxRequests = Math.max(1, Math.floor(rule?.maxRequests ?? 1));
  return {
    allowed: false,
    feature,
    windowSeconds,
    maxRequests,
    requestCount: maxRequests,
    remaining: 0,
    resetAt: new Date(Date.now() + windowSeconds * 1000).toISOString(),
    retryAfterSeconds: windowSeconds,
  };
}

function normalizeRateLimitRow(
  data: unknown,
  feature: string,
  rule: RateLimitRule,
): RateLimitResult | null {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== "object") return null;
  const value = row as Record<string, unknown>;
  const resetAt = typeof value.reset_at === "string"
    ? value.reset_at
    : new Date(Date.now() + rule.windowSeconds * 1000).toISOString();
  return {
    allowed: value.allowed !== false,
    feature: typeof value.feature === "string" ? value.feature : feature,
    windowSeconds: typeof value.window_seconds === "number"
      ? value.window_seconds
      : rule.windowSeconds,
    maxRequests: typeof value.max_requests === "number"
      ? value.max_requests
      : rule.maxRequests,
    requestCount: typeof value.request_count === "number"
      ? value.request_count
      : 0,
    remaining: typeof value.remaining === "number"
      ? value.remaining
      : rule.maxRequests,
    resetAt,
    retryAfterSeconds: typeof value.retry_after_seconds === "number"
      ? Math.max(1, Math.floor(value.retry_after_seconds))
      : rule.windowSeconds,
  };
}

export async function checkUserRateLimit(
  supabase: unknown,
  params: {
    userId: string;
    feature: string;
    rules: RateLimitRule[];
  },
): Promise<RateLimitResult> {
  const rpc = (supabase as { rpc?: (...args: unknown[]) => unknown })?.rpc;
  if (typeof rpc !== "function") {
    console.error("[rate-limit] RPC unavailable; denying request", {
      feature: params.feature,
    });
    return closedResult(params.feature, params.rules[0]);
  }

  let allowedResult: RateLimitResult | null = null;
  for (const rule of params.rules) {
    if (
      !Number.isFinite(rule.windowSeconds) || !Number.isFinite(rule.maxRequests)
    ) {
      continue;
    }
    const windowSeconds = Math.max(1, Math.floor(rule.windowSeconds));
    const maxRequests = Math.max(1, Math.floor(rule.maxRequests));
    try {
      const response = await rpc.call(
        supabase,
        "consume_app_feature_rate_limit",
        {
          in_user_id: params.userId,
          in_feature: params.feature,
          in_window_seconds: windowSeconds,
          in_max_requests: maxRequests,
        },
      ) as {
        data: unknown;
        error: { message?: string } | null;
      };
      const { data, error } = response;
      if (error) {
        console.error("[rate-limit] check failed; denying request", {
          feature: params.feature,
          windowSeconds,
          message: error.message,
        });
        return closedResult(params.feature, { windowSeconds, maxRequests });
      }
      const result = normalizeRateLimitRow(data, params.feature, {
        windowSeconds,
        maxRequests,
      });
      if (!result) {
        console.error("[rate-limit] check returned invalid data; denying request", {
          feature: params.feature,
          windowSeconds,
        });
        return closedResult(params.feature, { windowSeconds, maxRequests });
      }
      if (result && !result.allowed) return result;
      allowedResult = result;
    } catch (error) {
      console.error("[rate-limit] check threw; denying request", {
        feature: params.feature,
        message: error instanceof Error ? error.message : String(error),
      });
      return closedResult(params.feature, { windowSeconds, maxRequests });
    }
  }

  return allowedResult ?? { ...OPEN_RESULT, feature: params.feature };
}

export function rateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  return {
    "Retry-After": String(result.retryAfterSeconds),
    "X-RateLimit-Limit": String(result.maxRequests),
    "X-RateLimit-Remaining": String(Math.max(0, result.remaining)),
    "X-RateLimit-Reset": result.resetAt,
  };
}

export function rateLimitExceededResponse(
  result: RateLimitResult,
  extraHeaders: Record<string, string>,
): Response {
  return new Response(
    JSON.stringify({
      error: "rate_limited",
      message: "Too many requests. Please wait a moment and try again.",
      retryAfterSeconds: result.retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...extraHeaders,
        ...rateLimitHeaders(result),
      },
    },
  );
}
