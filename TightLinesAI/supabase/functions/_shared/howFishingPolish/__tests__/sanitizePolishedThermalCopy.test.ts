/**
 * Post-polish thermal copy guardrails (heat/cold vs engine temperature_metabolic_context).
 * Run: deno test --allow-read supabase/functions/_shared/howFishingPolish/__tests__/sanitizePolishedThermalCopy.test.ts
 */
import { assertEquals, assertStringIncludes } from "jsr:@std/assert";
import {
  sanitizePolishedThermalCopy,
  type ReportThermalSlice,
} from "../sanitizePolishedThermalCopy.ts";

function ctx(meta: string): ReportThermalSlice {
  return { condition_context: { temperature_metabolic_context: meta } };
}

Deno.test("sanitizePolishedThermalCopy strips false heat limit when neutral", () => {
  const raw = "Prudenville looks fishy, but heat trims the bite.";
  const out = sanitizePolishedThermalCopy(raw, ctx("neutral"));
  assertStringIncludes(out.toLowerCase(), "prudenville");
  assertEquals(/\bheat\s+trims?\b/i.test(out), false);
});

Deno.test("sanitizePolishedThermalCopy strips heat trimming (gerund) and cooler-window clause", () => {
  const raw =
    "Prudenville is fishing well, with heat trimming the bite to the cooler window and cloud cover helping keep it alive.";
  const out = sanitizePolishedThermalCopy(raw, ctx("neutral"));
  assertStringIncludes(out.toLowerCase(), "prudenville");
  assertEquals(/\bheat\s+trimming\b/i.test(out), false);
  assertStringIncludes(out.toLowerCase(), "cloud cover");
});

Deno.test("sanitizePolishedThermalCopy keeps heat limit when heat_limited", () => {
  const raw = "Peak heat narrows your best window.";
  const out = sanitizePolishedThermalCopy(raw, ctx("heat_limited"));
  assertEquals(out, raw);
});

Deno.test("sanitizePolishedThermalCopy strips false cold limit when neutral", () => {
  const raw = "Great energy, but cold narrows the afternoon bite.";
  const out = sanitizePolishedThermalCopy(raw, ctx("neutral"));
  assertEquals(/\bcold\s+narrows?\b/i.test(out), false);
});

Deno.test("sanitizePolishedThermalCopy keeps cold limit when cold_limited", () => {
  const raw = "Cold trims how long fish stay aggressive.";
  const out = sanitizePolishedThermalCopy(raw, ctx("cold_limited"));
  assertEquals(out, raw);
});

Deno.test("sanitizePolishedThermalCopy does not strip benign cold-front / frigid praise", () => {
  const a = "A cold front may get them chewing.";
  assertEquals(sanitizePolishedThermalCopy(a, ctx("neutral")), a);
  const b = "Frigid dawn, stellar bite.";
  assertEquals(sanitizePolishedThermalCopy(b, ctx("neutral")), b);
});

Deno.test("sanitizePolishedThermalCopy strips frigid + narrow when neutral", () => {
  const raw = "Frigid air narrows the bite hard.";
  const out = sanitizePolishedThermalCopy(raw, ctx("neutral"));
  assertEquals(/\bnarrows\b/i.test(out), false);
});

Deno.test("sanitizePolishedThermalCopy applies heat then cold in one string", () => {
  const raw = "Good day, but heat trims mornings and cold trims evenings.";
  const out = sanitizePolishedThermalCopy(raw, ctx("neutral"));
  assertEquals(/\bheat\s+trims?\b/i.test(out), false);
  assertEquals(/\bcold\s+trims?\b/i.test(out), false);
});
