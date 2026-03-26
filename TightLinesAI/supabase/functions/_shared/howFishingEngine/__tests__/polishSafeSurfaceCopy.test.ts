/**
 * Run: deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/polishSafeSurfaceCopy.test.ts
 */
import { assertEquals, assertStringIncludes } from "jsr:@std/assert";
import { DISPLAY_CONTEXT_LABEL } from "../contracts/context.ts";
import type { HowsFishingReport } from "../contracts/report.ts";
import {
  buildDeterministicTimingInsight,
  buildEngineLedSummaryLine,
} from "../narration/polishSafeSurfaceCopy.ts";

function minimalReport(overrides: Partial<HowsFishingReport>): HowsFishingReport {
  const base: HowsFishingReport = {
    context: "freshwater_river",
    display_context_label: DISPLAY_CONTEXT_LABEL.freshwater_river,
    location: {
      latitude: 44.6,
      longitude: -84.6,
      state_code: "MI",
      region_key: "midwest",
      timezone: "America/Detroit",
      local_date: "2026-03-29",
    },
    score: 71,
    band: "Good",
    summary_line: "Solid day ahead — more working for you than against you.",
    drivers: [],
    suppressors: [],
    actionable_tip: "Tip",
    actionable_tip_tag: "general_flexibility",
    daypart_preset: null,
    reliability: "high",
  };
  return { ...base, ...overrides };
}

Deno.test("buildEngineLedSummaryLine prefixes location", () => {
  const r = minimalReport({});
  const out = buildEngineLedSummaryLine(r, "Prudenville, MI");
  assertStringIncludes(out, "Prudenville");
  assertStringIncludes(out, "Solid day ahead");
});

Deno.test("buildDeterministicTimingInsight respects highlighted periods", () => {
  const r = minimalReport({
    highlighted_periods: [false, false, true, false],
    daypart_note: null,
  });
  const out = buildDeterministicTimingInsight(r);
  assertStringIncludes(out.toLowerCase(), "afternoon");
});
