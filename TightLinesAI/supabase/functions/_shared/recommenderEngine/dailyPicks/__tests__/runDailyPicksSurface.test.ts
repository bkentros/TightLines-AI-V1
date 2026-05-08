import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import type { SharedConditionAnalysis } from "../../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderRequest } from "../../contracts/input.ts";
import { FLY_ARCHETYPES_V4 } from "../../v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../../v4/candidates/lures.ts";
import { resolveDailyPicksSeasonalRow } from "../resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksSurface } from "../runDailyPicksSurface.ts";
import { DAILY_PICKS_RESPONSE_FEATURE } from "../shapeDailyPicksResponse.ts";

function baseReq(
  overrides: Partial<RecommenderRequest> = {},
): RecommenderRequest {
  return {
    location: {
      latitude: 44.9,
      longitude: -93.2,
      state_code: "MN",
      region_key: "great_lakes_upper_midwest",
      local_date: "2026-06-15",
      local_timezone: "UTC",
      month: 6,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    recommendation_goal: "all_purpose",
    env_data: {
      wind_speed_mph: 8,
    },
    ...overrides,
  };
}

function analysis(
  overrides: {
    score?: number;
    reliability?: "high" | "medium" | "low";
    lightLabel?: string | null;
    temperatureBand?: string | null;
    temperatureTrend?: string | null;
    temperatureShock?: string | null;
  } = {},
): SharedConditionAnalysis {
  const normalized: Record<string, unknown> = {};
  if (overrides.lightLabel !== undefined) {
    normalized.light_cloud_condition = overrides.lightLabel == null
      ? undefined
      : { label: overrides.lightLabel, score: 0 };
  } else {
    normalized.light_cloud_condition = { label: "mixed", score: 0 };
  }
  if (
    overrides.temperatureBand !== null ||
    overrides.temperatureTrend !== null ||
    overrides.temperatureShock !== null
  ) {
    normalized.temperature = {
      context_group: "freshwater",
      measurement_source: "air_daily_mean",
      measurement_value_f: 68,
      band_label: overrides.temperatureBand ?? "optimal",
      band_score: 1,
      trend_label: overrides.temperatureTrend ?? "stable",
      trend_adjustment: 0,
      shock_label: overrides.temperatureShock ?? "none",
      shock_adjustment: 0,
      final_score: 1,
    };
  }

  return {
    norm: {
      location: {
        latitude: 44.9,
        longitude: -93.2,
        state_code: "MN",
        region_key: "great_lakes_upper_midwest",
        local_date: "2026-06-15",
        local_timezone: "UTC",
      },
      context: "freshwater_lake_pond",
      normalized,
      available_variables: [],
      missing_variables: [],
      data_gaps: [],
      reliability: overrides.reliability ?? "high",
    },
    scored: { score: overrides.score ?? 72 },
    timing: {},
    condition_context: {},
  } as unknown as SharedConditionAnalysis;
}

function allPickIds(
  response: ReturnType<typeof runDailyPicksSurface>,
): string[] {
  return [
    response.picks.lure_of_the_day.id,
    response.picks.honorable_lure.id,
    response.picks.fly_of_the_day.id,
    response.picks.honorable_fly.id,
  ];
}

function catalogProfile(id: string) {
  const profile = [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4].find(
    (candidate) => candidate.id === id,
  );
  if (profile == null) throw new Error(`missing profile ${id}`);
  return profile;
}

Deno.test("DailyPicks surface adapter returns future marker and exactly four picks", () => {
  const response = runDailyPicksSurface(baseReq(), {
    seed: "surface-test",
    variant: "A",
    analysis: analysis(),
  });

  assertEquals(response.feature, DAILY_PICKS_RESPONSE_FEATURE);
  assertEquals(Object.keys(response.picks).sort(), [
    "fly_of_the_day",
    "honorable_fly",
    "honorable_lure",
    "lure_of_the_day",
  ]);
});

Deno.test("DailyPicks surface adapter uses exact region, month, species, and water row", () => {
  const req = baseReq();
  const row = resolveDailyPicksSeasonalRow({
    species: req.species,
    region_key: req.location.region_key,
    month: req.location.month,
    water_type: req.context,
  });
  const response = runDailyPicksSurface(req, {
    seed: "exact-row",
    variant: "A",
    analysis: analysis(),
  });

  assertEquals(response.species, row.species);
  assertEquals(response.region_key, row.region_key);
  assertEquals(response.month, row.month);
  assertEquals(response.water_type, row.water_type);
  assertEquals(
    response.diagnostics.row_authored_lure_count,
    row.primary_lure_ids.length,
  );
  assertEquals(
    response.diagnostics.row_authored_fly_count,
    row.primary_fly_ids.length,
  );
});

Deno.test("DailyPicks surface adapter throws explicit missing-row error for unsupported exact row", () => {
  assertThrows(
    () =>
      runDailyPicksSurface(
        baseReq({
          species: "river_trout",
          context: "freshwater_lake_pond",
        }),
        {
          seed: "missing-row",
          variant: "A",
          analysis: analysis(),
        },
      ),
    Error,
    "Daily picks seasonal matrix has no exact row",
  );
});

Deno.test("DailyPicks exact resolver does not borrow region fallbacks", () => {
  assertThrows(
    () =>
      resolveDailyPicksSeasonalRow({
        species: "largemouth_bass",
        region_key: "alaska",
        month: 6,
        water_type: "freshwater_lake_pond",
      }),
    Error,
    "Daily picks seasonal matrix has no exact row",
  );
});

Deno.test("DailyPicks surface-closed request does not return surface picks", () => {
  const response = runDailyPicksSurface(
    baseReq({
      env_data: { wind_speed_mph: 20 },
    }),
    {
      seed: "surface-closed",
      variant: "A",
      analysis: analysis({ score: 80, lightLabel: "low_light" }),
    },
  );

  assertEquals(response.scenario_summary.surface_daily_gate, "closed");
  for (const pick of Object.values(response.picks)) {
    assertEquals(pick.is_surface, false);
  }
});

Deno.test("DailyPicks surface adapter variant B with avoid IDs can return different picks", () => {
  const req = baseReq();
  const first = runDailyPicksSurface(req, {
    seed: "variant-surface",
    variant: "A",
    analysis: analysis(),
  });
  const second = runDailyPicksSurface(req, {
    seed: "variant-surface",
    variant: "B",
    avoidLureIds: first.diagnostics.selected_lure_ids,
    avoidFlyIds: first.diagnostics.selected_fly_ids,
    analysis: analysis(),
  });

  assert(
    allPickIds(second).some((id) => !allPickIds(first).includes(id)),
  );
  assertEquals(second.diagnostics.variant, "B");
});

Deno.test("DailyPicks surface response preserves intrinsic profile column, pace, and surface fields", () => {
  const response = runDailyPicksSurface(baseReq(), {
    seed: "profile-truth",
    variant: "A",
    analysis: analysis(),
  });

  for (const pick of Object.values(response.picks)) {
    const source = catalogProfile(pick.id);
    assertEquals(pick.column, source.column);
    assertEquals(pick.primary_pace, source.primary_pace);
    assertEquals(pick.secondary_pace, source.secondary_pace);
    assertEquals(pick.is_surface, source.is_surface);
  }
});

Deno.test("DailyPicks surface adapter accepts injected analysis for deterministic tests", () => {
  const response = runDailyPicksSurface(baseReq(), {
    seed: "injected-analysis",
    variant: "A",
    analysis: analysis({ score: 35, reliability: "low", lightLabel: null }),
  });

  assertEquals(response.scenario_summary.activity_level, "suppressed");
  assertEquals(response.scenario_summary.confidence, "low");
  assert(response.scenario_summary.missing_inputs.includes("light"));
});

Deno.test("DailyPicks surface adapter and resolver do not import current 3:3 runtime paths", async () => {
  for (
    const file of [
      "supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksSurface.ts",
      "supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts",
    ]
  ) {
    const text = await Deno.readTextFile(file);
    assert(!text.includes("../rebuild/"));
    assert(!text.includes("runRecommenderRebuild"));
    assert(!text.includes("runRecommenderRebuildSurface"));
    assert(!text.includes("selectArchetypesForSide"));
  }
});
