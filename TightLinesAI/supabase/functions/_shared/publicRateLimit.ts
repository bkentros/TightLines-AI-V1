import {
  hashRateLimitSubject,
  type RateLimitResult,
  requestClientIp,
} from "./rateLimit.ts";

type LocalBucket = {
  requestCount: number;
  windowStartedAt: number;
};

const LOCAL_BUCKETS = new Map<string, LocalBucket>();
const MAX_LOCAL_BUCKETS = 4_096;

function consumeLocalBucket(input: {
  subjectHash: string;
  feature: string;
  maxRequests: number;
  windowSeconds: number;
  now?: number;
}): RateLimitResult | null {
  const now = input.now ?? Date.now();
  const windowSeconds = Math.max(1, Math.floor(input.windowSeconds));
  const maxRequests = Math.max(1, Math.floor(input.maxRequests));
  const windowMs = windowSeconds * 1_000;
  const key = `${input.feature}:${input.subjectHash}`;
  let bucket = LOCAL_BUCKETS.get(key);

  if (!bucket || now - bucket.windowStartedAt >= windowMs) {
    if (!bucket && LOCAL_BUCKETS.size >= MAX_LOCAL_BUCKETS) {
      for (const [candidateKey, candidate] of LOCAL_BUCKETS) {
        if (now - candidate.windowStartedAt >= windowMs) {
          LOCAL_BUCKETS.delete(candidateKey);
        }
      }
      // A high-cardinality flood must not turn this best-effort guard into an
      // outage or an unbounded memory allocation.
      if (LOCAL_BUCKETS.size >= MAX_LOCAL_BUCKETS) return null;
    }
    bucket = { requestCount: 0, windowStartedAt: now };
    LOCAL_BUCKETS.set(key, bucket);
  }

  bucket.requestCount += 1;
  const resetAtMs = bucket.windowStartedAt + windowMs;
  const allowed = bucket.requestCount <= maxRequests;
  return {
    allowed,
    feature: input.feature,
    windowSeconds,
    maxRequests,
    requestCount: bucket.requestCount,
    remaining: Math.max(0, maxRequests - bucket.requestCount),
    resetAt: new Date(resetAtMs).toISOString(),
    retryAfterSeconds: allowed
      ? 0
      : Math.max(1, Math.ceil((resetAtMs - now) / 1_000)),
  };
}

export async function checkPublicRequestRateLimits(input: {
  supabase: unknown;
  request: Request;
  pepper: string;
  feature: string;
  ipMaxRequests: number;
  token?: string | null;
  tokenMaxRequests?: number;
  windowSeconds?: number;
}): Promise<RateLimitResult | null> {
  // Public creator endpoints are intentionally best-effort. A database-backed
  // limiter adds a synchronous write to every request and can take an inactive
  // feature down when PostgREST is slow. Keep raw IPs/tokens out of memory,
  // bound the per-isolate store, and fail open if hashing or bookkeeping fails.
  void input.supabase;
  try {
    const windowSeconds = input.windowSeconds ?? 900;
    const subjects: Array<Promise<RateLimitResult | null>> = [];
    const ip = requestClientIp(input.request);
    if (ip) {
      subjects.push(
        hashRateLimitSubject(`${input.feature}:ip`, ip, input.pepper).then(
          (subjectHash) =>
            consumeLocalBucket({
              subjectHash,
              feature: `${input.feature}_ip`,
              maxRequests: input.ipMaxRequests,
              windowSeconds,
            }),
        ),
      );
    }
    if (input.token) {
      subjects.push(
        hashRateLimitSubject(
          `${input.feature}:token`,
          input.token,
          input.pepper,
        ).then((subjectHash) =>
          consumeLocalBucket({
            subjectHash,
            feature: `${input.feature}_token`,
            maxRequests: input.tokenMaxRequests ?? input.ipMaxRequests,
            windowSeconds,
          })
        ),
      );
    }
    const results = await Promise.all(subjects);
    return results.find((result) => result?.allowed === false) ?? null;
  } catch (error) {
    console.warn("[public-rate-limit] best-effort check failed open", {
      feature: input.feature,
      message: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
