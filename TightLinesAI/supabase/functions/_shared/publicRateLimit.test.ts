import { assertEquals } from "jsr:@std/assert";
import { checkPublicRequestRateLimits } from "./publicRateLimit.ts";

function request(ip?: string) {
  return new Request("https://example.test/creator", {
    headers: ip ? { "cf-connecting-ip": ip } : {},
  });
}

Deno.test("public creator limiter is local and performs no database RPC", async () => {
  let rpcCalls = 0;
  const input = {
    supabase: {
      rpc: () => {
        rpcCalls += 1;
        throw new Error("must not run");
      },
    },
    request: request("203.0.113.8"),
    pepper: "test-pepper",
    feature: `creator_test_${crypto.randomUUID()}`,
    ipMaxRequests: 2,
    token: "creator-token",
    tokenMaxRequests: 2,
    windowSeconds: 60,
  };

  assertEquals(await checkPublicRequestRateLimits(input), null);
  assertEquals(await checkPublicRequestRateLimits(input), null);
  const denied = await checkPublicRequestRateLimits(input);
  assertEquals(denied?.allowed, false);
  assertEquals(denied?.remaining, 0);
  assertEquals(rpcCalls, 0);
});

Deno.test("public creator limiter isolates IP and token subjects", async () => {
  const feature = `creator_subject_${crypto.randomUUID()}`;
  const base = {
    supabase: {},
    pepper: "test-pepper",
    feature,
    ipMaxRequests: 1,
    tokenMaxRequests: 1,
    windowSeconds: 60,
  };

  assertEquals(
    await checkPublicRequestRateLimits({
      ...base,
      request: request("203.0.113.10"),
      token: "one",
    }),
    null,
  );
  assertEquals(
    (await checkPublicRequestRateLimits({
      ...base,
      request: request("203.0.113.10"),
      token: "two",
    }))?.feature,
    `${feature}_ip`,
  );
  assertEquals(
    await checkPublicRequestRateLimits({
      ...base,
      request: request("203.0.113.11"),
      token: "three",
    }),
    null,
  );
});

Deno.test("public creator limiter fails open without a usable subject", async () => {
  assertEquals(
    await checkPublicRequestRateLimits({
      supabase: {
        rpc: () => {
          throw new Error("must not run");
        },
      },
      request: request(),
      pepper: "test-pepper",
      feature: `creator_missing_${crypto.randomUUID()}`,
      ipMaxRequests: 1,
    }),
    null,
  );
});
