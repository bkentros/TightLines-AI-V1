import { assertEquals } from "jsr:@std/assert@1";

// Runtime behavior is kept in one small file; validate its security contract
// without importing the Deno.serve side effect.
Deno.test("auth redirect contract uses the current scheme and safe headers", async () => {
  const source = await Deno.readTextFile(
    new URL("./index.ts", import.meta.url),
  );
  assertEquals(source.includes('const APP_SCHEME = "finfindr://auth/confirm"'), true);
  assertEquals(source.includes('"Cache-Control": "no-store"'), true);
  assertEquals(source.includes('"Referrer-Policy": "no-referrer"'), true);
  assertEquals(source.includes("ALLOWED_TYPES.has(requestedType)"), true);
});
