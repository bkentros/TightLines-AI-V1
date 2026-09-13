import { assertEquals } from "jsr:@std/assert@1";
import { checkUserRateLimit } from "./rateLimit.ts";

const rule = { windowSeconds: 60, maxRequests: 10 };

Deno.test("rate limiter fails closed when its RPC is unavailable", async () => {
  const result = await checkUserRateLimit({}, {
    userId: "user-id",
    feature: "test_feature",
    rules: [rule],
  });
  assertEquals(result.allowed, false);
  assertEquals(result.remaining, 0);
  assertEquals(result.retryAfterSeconds, 60);
});

Deno.test("rate limiter fails closed when its RPC errors", async () => {
  const result = await checkUserRateLimit({
    rpc: () => Promise.resolve({ data: null, error: { message: "offline" } }),
  }, {
    userId: "user-id",
    feature: "test_feature",
    rules: [rule],
  });
  assertEquals(result.allowed, false);
  assertEquals(result.requestCount, 10);
});

Deno.test("rate limiter fails closed when its RPC returns malformed data", async () => {
  const result = await checkUserRateLimit({
    rpc: () => Promise.resolve({ data: null, error: null }),
  }, {
    userId: "user-id",
    feature: "test_feature",
    rules: [rule],
  });
  assertEquals(result.allowed, false);
  assertEquals(result.remaining, 0);
});

Deno.test("rate limiter preserves successful allow decisions", async () => {
  const result = await checkUserRateLimit({
    rpc: () => Promise.resolve({
      data: {
        allowed: true,
        feature: "test_feature",
        window_seconds: 60,
        max_requests: 10,
        request_count: 1,
        remaining: 9,
        reset_at: "2026-09-13T20:00:00.000Z",
        retry_after_seconds: 0,
      },
      error: null,
    }),
  }, {
    userId: "user-id",
    feature: "test_feature",
    rules: [rule],
  });
  assertEquals(result.allowed, true);
  assertEquals(result.remaining, 9);
});
