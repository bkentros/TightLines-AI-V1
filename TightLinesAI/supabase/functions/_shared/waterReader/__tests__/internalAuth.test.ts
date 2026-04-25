import { assertEquals } from "jsr:@std/assert";
import { assertInternalWaterReaderRequest } from "../internalAuth.ts";

Deno.test("assertInternalWaterReaderRequest rejects requests without the internal secret", () => {
  const previous = Deno.env.get("WATER_READER_INTERNAL_KEY");
  try {
    Deno.env.set("WATER_READER_INTERNAL_KEY", "super-secret-water-reader-key");
    const result = assertInternalWaterReaderRequest(new Request("https://example.com"));
    assertEquals(result.ok, false);
    if (!result.ok) {
      assertEquals(result.status, 403);
    }
  } finally {
    if (previous == null) Deno.env.delete("WATER_READER_INTERNAL_KEY");
    else Deno.env.set("WATER_READER_INTERNAL_KEY", previous);
  }
});

Deno.test("assertInternalWaterReaderRequest accepts requests with the internal secret", () => {
  const previous = Deno.env.get("WATER_READER_INTERNAL_KEY");
  try {
    Deno.env.set("WATER_READER_INTERNAL_KEY", "super-secret-water-reader-key");
    const req = new Request("https://example.com", {
      headers: { "x-water-reader-internal-key": "super-secret-water-reader-key" },
    });
    const result = assertInternalWaterReaderRequest(req);
    assertEquals(result.ok, true);
  } finally {
    if (previous == null) Deno.env.delete("WATER_READER_INTERNAL_KEY");
    else Deno.env.set("WATER_READER_INTERNAL_KEY", previous);
  }
});
