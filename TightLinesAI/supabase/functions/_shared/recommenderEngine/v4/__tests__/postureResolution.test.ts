import { assertEquals } from "jsr:@std/assert";
import { resolvePostureV4 } from "../engine/resolveDailyPayload.ts";

Deno.test("postureResolution: boundaries from §20.1", () => {
  assertEquals(resolvePostureV4(100), "aggressive");
  assertEquals(resolvePostureV4(10), "suppressed");
});
