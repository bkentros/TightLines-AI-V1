import { assert, assertEquals } from "jsr:@std/assert";
import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import { computeRecommenderV3 } from "../runRecommenderV3.ts";
import {
  colorReasonPhraseV3,
  normalizeLightBucketV3,
  resolveColorDecisionV3,
  type ResolvedColorDecisionV3,
} from "./colorDecision.ts";

Deno.test("colorReasonPhraseV3: non-empty for every reason_code", () => {
  const codes: ResolvedColorDecisionV3["reason_code"][] = [
    "clear_bright_natural",
    "clear_mixed_natural",
    "clear_low_dark",
    "stained_bright_dark",
    "stained_mixed_dark",
    "stained_low_bright",
    "dirty_bright_dark",
    "dirty_mixed_bright",
    "dirty_low_bright",
  ];
  for (const code of codes) {
    const phrase = colorReasonPhraseV3(code);
    assert(phrase.length > 0);
  }
});

Deno.test("ranked lure color_decision: stained + bright light → stained_bright_dark", () => {
  const analysis = {
    scored: { score: 60, band: "Good", drivers: [], suppressors: [] },
    timing: {
      timing_strength: "good",
      highlighted_periods: [false, false, false, false],
    },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "stable",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "stable_neutral", score: 0 },
        wind_condition: { label: "light", score: 0.2 },
        light_cloud_condition: { label: "bright", score: 0.8 },
        precipitation_disruption: { label: "dry_stable", score: 0.1 },
        runoff_flow_disruption: { label: "stable", score: 0.6 },
      },
    },
  } as unknown as SharedConditionAnalysis;

  const req: RecommenderRequest = {
    location: {
      latitude: 35.5,
      longitude: -82.5,
      state_code: "NC",
      region_key: "appalachian",
      local_date: "2026-04-03",
      local_timezone: "America/New_York",
      month: 4,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    env_data: {},
  };

  const resolvedColor = resolveColorDecisionV3(
    "stained",
    normalizeLightBucketV3("bright"),
  );
  assertEquals(resolvedColor.reason_code, "stained_bright_dark");
  assert(colorReasonPhraseV3("stained_bright_dark").includes("Stained water"));

  const v3 = computeRecommenderV3(req, analysis);
  const lure0 = v3.lure_recommendations[0]!;
  assertEquals(lure0.color_decision.reason_code, "stained_bright_dark");
  assert(lure0.color_decision.short_reason.includes("Stained water"));
});
