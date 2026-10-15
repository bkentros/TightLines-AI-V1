import {
  checkSubjectRateLimit,
  hashRateLimitSubject,
  type RateLimitResult,
  requestClientIp,
} from "./rateLimit.ts";

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
  const windowSeconds = input.windowSeconds ?? 900;
  const ip = requestClientIp(input.request) ?? "unknown";
  const checks = [
    hashRateLimitSubject(`${input.feature}:ip`, ip, input.pepper).then(
      (subjectHash) =>
        checkSubjectRateLimit(input.supabase, {
          subjectHash,
          feature: `${input.feature}_ip`,
          rules: [{ windowSeconds, maxRequests: input.ipMaxRequests }],
        }),
    ),
  ];
  if (input.token) {
    checks.push(
      hashRateLimitSubject(
        `${input.feature}:token`,
        input.token,
        input.pepper,
      ).then((subjectHash) =>
        checkSubjectRateLimit(input.supabase, {
          subjectHash,
          feature: `${input.feature}_token`,
          rules: [{
            windowSeconds,
            maxRequests: input.tokenMaxRequests ?? input.ipMaxRequests,
          }],
        })
      ),
    );
  }
  const results = await Promise.all(checks);
  return results.find((result) => !result.allowed) ?? null;
}
