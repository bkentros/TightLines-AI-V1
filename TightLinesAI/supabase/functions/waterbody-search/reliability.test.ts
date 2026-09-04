import { assertEquals } from "jsr:@std/assert";
import { shouldSurfaceSearchUnavailable } from "./reliability.ts";

Deno.test("surfaces an unavailable search when the database query fails", () => {
  assertEquals(
    shouldSurfaceSearchUnavailable({
      primaryRpcFailed: true,
      resultCount: 0,
    }),
    true,
  );
});

Deno.test("keeps a recovered result successful", () => {
  assertEquals(
    shouldSurfaceSearchUnavailable({
      primaryRpcFailed: true,
      resultCount: 1,
    }),
    false,
  );
});

Deno.test("does not reclassify an ordinary empty search", () => {
  assertEquals(
    shouldSurfaceSearchUnavailable({
      primaryRpcFailed: false,
      resultCount: 0,
    }),
    false,
  );
});
