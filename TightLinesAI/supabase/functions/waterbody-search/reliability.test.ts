import { assertEquals } from "jsr:@std/assert";
import { shouldSurfaceSearchUnavailable } from "./reliability.ts";

Deno.test("surfaces an unavailable search when primary and recovery queries both fail", () => {
  assertEquals(
    shouldSurfaceSearchUnavailable({
      primaryRpcFailed: true,
      crossStateRetryFailed: true,
      resultCount: 0,
    }),
    true,
  );
});

Deno.test("keeps a recovered result successful", () => {
  assertEquals(
    shouldSurfaceSearchUnavailable({
      primaryRpcFailed: true,
      crossStateRetryFailed: true,
      resultCount: 1,
    }),
    false,
  );
});

Deno.test("keeps a successful empty alternate query as a valid empty result", () => {
  assertEquals(
    shouldSurfaceSearchUnavailable({
      primaryRpcFailed: true,
      crossStateRetryFailed: false,
      resultCount: 0,
    }),
    false,
  );
});

Deno.test("does not reclassify an ordinary empty search", () => {
  assertEquals(
    shouldSurfaceSearchUnavailable({
      primaryRpcFailed: false,
      crossStateRetryFailed: false,
      resultCount: 0,
    }),
    false,
  );
});
