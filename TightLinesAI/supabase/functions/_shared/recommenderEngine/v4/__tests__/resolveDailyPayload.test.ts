import { assertEquals } from "jsr:@std/assert";
import type { SharedConditionAnalysis } from "../../../howFishingEngine/analyzeSharedConditions.ts";
import { resolveDailyPayloadV4, resolvePostureV4 } from "../engine/resolveDailyPayload.ts";

function analysisWithScore(score: number): SharedConditionAnalysis {
  return {
    scored: { score, band: "Fair", contributions: [], drivers: [], suppressors: [] },
    norm: {} as SharedConditionAnalysis["norm"],
    timing: {
      timing_strength: "good",
      highlighted_periods: [false, false, false, false],
    } as SharedConditionAnalysis["timing"],
    condition_context: {} as SharedConditionAnalysis["condition_context"],
  };
}

Deno.test("resolvePostureV4: aggressive at 70, neutral at 69", () => {
  assertEquals(resolvePostureV4(70), "aggressive");
  assertEquals(resolvePostureV4(69), "neutral");
});

Deno.test("resolvePostureV4: suppressed at 35, neutral at 36", () => {
  assertEquals(resolvePostureV4(35), "suppressed");
  assertEquals(resolvePostureV4(36), "neutral");
});

Deno.test("resolveDailyPayloadV4: clarity passthrough + score stored", () => {
  const a = analysisWithScore(55);
  const payload = resolveDailyPayloadV4(a, { wind_speed_mph: 10 }, "stained");
  assertEquals(payload.water_clarity, "stained");
  assertEquals(payload.hows_fishing_score, 55);
  assertEquals(payload.posture, "neutral");
  assertEquals(payload.wind_mph, 10);
});

Deno.test("resolveDailyPayloadV4: missing wind defaults to 99 (P24)", () => {
  const a = analysisWithScore(50);
  const payload = resolveDailyPayloadV4(a, {}, "clear");
  assertEquals(payload.wind_mph, 99);
});

Deno.test("resolveDailyPayloadV4: non-numeric wind defaults to 99", () => {
  const a = analysisWithScore(50);
  const payload = resolveDailyPayloadV4(a, { wind_speed_mph: "gusty" }, "clear");
  assertEquals(payload.wind_mph, 99);
});

Deno.test("resolveDailyPayloadV4: numeric wind string parses", () => {
  const a = analysisWithScore(50);
  const payload = resolveDailyPayloadV4(a, { wind_speed_mph: "12" }, "clear");
  assertEquals(payload.wind_mph, 12);
});
