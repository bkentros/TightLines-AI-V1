import { assert, assertEquals } from "jsr:@std/assert";
import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { WaterClarity } from "../contracts/input.ts";
import { LURE_ARCHETYPES_V3 } from "./candidates/index.ts";
import type { RecommenderV3ScoreBreakdown } from "./contracts.ts";
import { buildWhyChosen } from "./recommendationCopy.ts";
import { resolveDailyPayloadV3 } from "./resolveDailyPayload.ts";
import { resolveFinalProfileV3 } from "./resolveFinalProfile.ts";
import { resolveSeasonalRowV3 } from "./seasonal/resolveSeasonalRow.ts";

function neutralAnalysis(): SharedConditionAnalysis {
  return {
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
        light_cloud_condition: { label: "mixed", score: 0 },
        precipitation_disruption: { label: "dry_stable", score: 0.1 },
        runoff_flow_disruption: { label: "stable", score: 0.6 },
      },
    },
  } as unknown as SharedConditionAnalysis;
}

function breakdownWithLeader(
  leaderCode: RecommenderV3ScoreBreakdown["code"],
): readonly RecommenderV3ScoreBreakdown[] {
  const codes: RecommenderV3ScoreBreakdown["code"][] = [
    "strict_monthly_lane_fit",
    "column_fit",
    "pace_fit",
    "presence_fit",
    "practicality_fit",
    "monthly_primary_fit",
    "forage_fit",
    "clarity_fit",
  ];
  return codes.map((code) => ({
    code,
    value: code === leaderCode ? 5 : -0.05,
    detail: code === leaderCode ? "Top driver detail." : "Low.",
  }));
}

Deno.test("buildWhyChosen: monthly_primary_fit lead phrase when multiple monthly primaries", () => {
  const seasonal = resolveSeasonalRowV3(
    "smallmouth_bass",
    "northeast",
    6,
    "freshwater_river",
    "PA",
  );
  const daily = resolveDailyPayloadV3(
    neutralAnalysis(),
    "freshwater_river",
    "clear",
  );
  const resolved = resolveFinalProfileV3(seasonal, daily);
  const profile = LURE_ARCHETYPES_V3["tube_jig"];
  const out = buildWhyChosen(
    profile,
    breakdownWithLeader("monthly_primary_fit"),
    seasonal,
    daily,
    resolved,
    "clear",
    0,
  );
  assert(out.includes("It's one of this month's lead lanes here."));
});

Deno.test("buildWhyChosen: strict_monthly_lane_fit lead phrase", () => {
  const seasonal = resolveSeasonalRowV3(
    "largemouth_bass",
    "appalachian",
    4,
    "freshwater_lake_pond",
  );
  const daily = resolveDailyPayloadV3(
    neutralAnalysis(),
    "freshwater_lake_pond",
    "clear",
  );
  const resolved = resolveFinalProfileV3(seasonal, daily);
  const profile = LURE_ARCHETYPES_V3["tube_jig"];
  const out = buildWhyChosen(
    profile,
    breakdownWithLeader("strict_monthly_lane_fit"),
    seasonal,
    daily,
    resolved,
    "clear",
    0,
  );
  assert(out.includes("It sits inside this month's authored lane."));
});

Deno.test("buildWhyChosen: forage_fit lead phrase", () => {
  const seasonal = resolveSeasonalRowV3(
    "largemouth_bass",
    "appalachian",
    4,
    "freshwater_lake_pond",
  );
  const daily = resolveDailyPayloadV3(
    neutralAnalysis(),
    "freshwater_lake_pond",
    "clear",
  );
  const resolved = resolveFinalProfileV3(seasonal, daily);
  const profile = LURE_ARCHETYPES_V3["tube_jig"];
  const out = buildWhyChosen(
    profile,
    breakdownWithLeader("forage_fit"),
    seasonal,
    daily,
    resolved,
    "clear",
    0,
  );
  assert(
    out.includes("imitates the month's") || out.includes("matches the secondary"),
    `expected forage_fit lead from phraseForTopDriver, got: ${out}`,
  );
});

Deno.test("buildWhyChosen: practicality_fit lead phrase", () => {
  const seasonal = resolveSeasonalRowV3(
    "largemouth_bass",
    "appalachian",
    4,
    "freshwater_lake_pond",
  );
  const daily = resolveDailyPayloadV3(
    neutralAnalysis(),
    "freshwater_lake_pond",
    "clear",
  );
  const resolved = resolveFinalProfileV3(seasonal, daily);
  const profile = LURE_ARCHETYPES_V3["tube_jig"];
  const out = buildWhyChosen(
    profile,
    breakdownWithLeader("practicality_fit"),
    seasonal,
    daily,
    resolved,
    "clear",
    0,
  );
  assert(out.includes("It fishes cleanly for today's conditions."));
});

Deno.test("buildWhyChosen: column_fit / pace_fit / presence_fit tactical trio phrase", () => {
  const seasonal = resolveSeasonalRowV3(
    "largemouth_bass",
    "appalachian",
    4,
    "freshwater_lake_pond",
  );
  const daily = resolveDailyPayloadV3(
    neutralAnalysis(),
    "freshwater_lake_pond",
    "clear",
  );
  const resolved = resolveFinalProfileV3(seasonal, daily);
  const profile = LURE_ARCHETYPES_V3["tube_jig"];
  const trio = ["column_fit", "pace_fit", "presence_fit"] as const;
  for (const code of trio) {
    const out = buildWhyChosen(
      profile,
      breakdownWithLeader(code),
      seasonal,
      daily,
      resolved,
      "clear",
      0,
    );
    assert(
      out.includes(
        "It matches the column/pace the conditions push toward today.",
      ),
    );
  }
});

Deno.test("buildWhyChosen: clarity_fit phrases by water clarity", () => {
  const seasonal = resolveSeasonalRowV3(
    "largemouth_bass",
    "appalachian",
    4,
    "freshwater_lake_pond",
  );
  const daily = resolveDailyPayloadV3(
    neutralAnalysis(),
    "freshwater_lake_pond",
    "clear",
  );
  const resolved = resolveFinalProfileV3(seasonal, daily);
  const profile = LURE_ARCHETYPES_V3["tube_jig"];
  const cases: [WaterClarity, string][] = [
    ["clear", "It reads clean in clear water today."],
    ["stained", "It stands out in stained water today."],
    ["dirty", "It stays visible in dirty water today."],
  ];
  for (const [clarity, needle] of cases) {
    const out = buildWhyChosen(
      profile,
      breakdownWithLeader("clarity_fit"),
      seasonal,
      daily,
      resolved,
      clarity,
      0,
    );
    assert(out.includes(needle));
  }
});

Deno.test("buildWhyChosen: diversity_bonus > 0 appends stable lineup suffix once", () => {
  const seasonal = resolveSeasonalRowV3(
    "largemouth_bass",
    "appalachian",
    4,
    "freshwater_lake_pond",
  );
  const daily = resolveDailyPayloadV3(
    neutralAnalysis(),
    "freshwater_lake_pond",
    "clear",
  );
  const resolved = resolveFinalProfileV3(seasonal, daily);
  const profile = LURE_ARCHETYPES_V3["tube_jig"];
  const out = buildWhyChosen(
    profile,
    breakdownWithLeader("clarity_fit"),
    seasonal,
    daily,
    resolved,
    "clear",
    0.65,
  );
  assert(out.toLowerCase().includes("rounds out"));
  assertEquals(
    (out.match(/It rounds out the lineup with a different look\./g) ?? []).length,
    1,
  );
});
