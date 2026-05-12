import { assert, assertEquals } from "jsr:@std/assert";
import type { SharedConditionAnalysis } from "../../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderRequest } from "../../contracts/input.ts";
import { FLY_ARCHETYPES_V4 } from "../../v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../../v4/candidates/lures.ts";
import type { ArchetypeProfileV4 } from "../../v4/contracts.ts";
import { resolveDailyPicksSeasonalRow } from "../resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksSurface } from "../runDailyPicksSurface.ts";
import type {
  DailyPicksFutureResponse,
  DailyPicksResponsePick,
} from "../shapeDailyPicksResponse.ts";

const CATALOG = new Map<string, ArchetypeProfileV4>(
  [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4].map((profile) => [
    profile.id,
    profile,
  ]),
);

function hourlyWind(args: {
  date: string;
  utcOffsetHours: number;
  mph: number;
}): Array<{ time_utc: string; value: number }> {
  const [year, month, day] = args.date.split("-").map(Number);
  const points: Array<{ time_utc: string; value: number }> = [];
  for (let localHour = 0; localHour < 24; localHour++) {
    points.push({
      time_utc: new Date(Date.UTC(
        year!,
        month! - 1,
        day!,
        localHour - args.utcOffsetHours,
      )).toISOString(),
      value: args.mph,
    });
  }
  return points;
}

function baseReq(
  overrides: Partial<RecommenderRequest> = {},
): RecommenderRequest {
  const location = {
    latitude: 44.9,
    longitude: -93.2,
    state_code: "MN",
    region_key: "great_lakes_upper_midwest" as const,
    local_date: "2026-06-15",
    local_timezone: "America/Chicago",
    month: 6,
    ...overrides.location,
  };

  return {
    location,
    species: overrides.species ?? "largemouth_bass",
    context: overrides.context ?? "freshwater_lake_pond",
    water_clarity: overrides.water_clarity ?? "stained",
    recommendation_goal: overrides.recommendation_goal ?? "all_purpose",
    env_data: {
      target_date: location.local_date,
      timezone: location.local_timezone,
      wind_speed_mph: 8,
      weather: {
        wind_speed_unit: "mph",
        pressure_unit: "hPa",
        temperature_unit: "fahrenheit",
        cloud_cover_unit: "percent",
      },
      hourly_wind_speed: hourlyWind({
        date: location.local_date,
        utcOffsetHours: -5,
        mph: 8,
      }),
      hourly_air_temp_f: [],
      hourly_pressure_mb: [],
      hourly_cloud_cover_pct: [],
      ...overrides.env_data,
    },
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
    runoffLabel?: string | null;
    pressureLabel?: string | null;
  } = {},
): SharedConditionAnalysis {
  const normalized: Record<string, unknown> = {};
  if (overrides.lightLabel !== null) {
    normalized.light_cloud_condition = {
      label: overrides.lightLabel ?? "mixed",
      score: 0,
    };
  }
  if (
    overrides.temperatureBand !== null ||
    overrides.temperatureTrend !== null ||
    overrides.temperatureShock !== null
  ) {
    normalized.temperature = {
      context_group: "freshwater",
      measurement_source: "air_daily_mean",
      measurement_value_f: 66,
      band_label: overrides.temperatureBand ?? "optimal",
      band_score: 1,
      trend_label: overrides.temperatureTrend ?? "stable",
      trend_adjustment: 0,
      shock_label: overrides.temperatureShock ?? "none",
      shock_adjustment: 0,
      final_score: 1,
    };
  }
  if (overrides.runoffLabel !== null) {
    normalized.runoff_flow_disruption = {
      label: overrides.runoffLabel ?? "stable",
      score: 0,
    };
  }
  if (overrides.pressureLabel !== null) {
    normalized.pressure_regime = {
      label: overrides.pressureLabel ?? "stable_neutral",
      score: 0,
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
        local_timezone: "America/Chicago",
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

function allPicks(
  response: DailyPicksFutureResponse,
): DailyPicksResponsePick[] {
  return [
    response.picks.lure_of_the_day,
    response.picks.honorable_lure,
    response.picks.fly_of_the_day,
    response.picks.honorable_fly,
  ];
}

function allPickIds(response: DailyPicksFutureResponse): string[] {
  return allPicks(response).map((pick) => pick.id);
}

function profileFor(id: string): ArchetypeProfileV4 {
  const profile = CATALOG.get(id);
  if (profile == null) throw new Error(`missing catalog profile ${id}`);
  return profile;
}

function assertPreviewInvariants(response: DailyPicksFutureResponse): void {
  const picks = allPicks(response);
  assertEquals(picks.length, 4);
  assertEquals(new Set(picks.map((pick) => pick.slot)).size, 4);

  const diagnosticsSelected = new Set([
    ...response.diagnostics.selected_lure_ids,
    ...response.diagnostics.selected_fly_ids,
  ]);
  for (const pick of picks) {
    assert(diagnosticsSelected.has(pick.id));
    const source = profileFor(pick.id);
    assertEquals(pick.display_name, source.display_name);
    assertEquals(pick.column, source.column);
    assertEquals(pick.primary_pace, source.primary_pace);
    assertEquals(pick.secondary_pace, source.secondary_pace);
    assertEquals(pick.is_surface, source.is_surface);
    assert(source.species_allowed.includes(response.species));
    assert(source.water_types_allowed.includes(response.water_type));
  }

  const row = resolveDailyPicksSeasonalRow({
    species: response.species,
    region_key: response.region_key,
    month: response.month,
    water_type: response.water_type,
  });
  for (const pick of picks) {
    if (pick.gear_mode === "lure") {
      assert((row.primary_lure_ids as readonly string[]).includes(pick.id));
    } else {
      assert((row.primary_fly_ids as readonly string[]).includes(pick.id));
    }
    if (pick.is_surface) {
      assert(row.surface_seasonally_possible);
      assert(row.column_range.includes("surface"));
      assert(response.scenario_summary.surface_daily_gate !== "closed");
    }
  }
}

function assertAbsent(
  response: DailyPicksFutureResponse,
  ids: readonly string[],
): void {
  const selected = new Set(allPickIds(response));
  for (const id of ids) assert(!selected.has(id), `${id} should be absent`);
}

function hasReasonPrefix(
  response: DailyPicksFutureResponse,
  prefix: string,
): boolean {
  return allPicks(response).some((pick) =>
    pick.score_reasons.some((reason) => reason.startsWith(prefix))
  );
}

Deno.test("Preview quality: Florida LMB July all-purpose stays valid and action-oriented", () => {
  const response = runDailyPicksSurface(
    baseReq({
      location: {
        latitude: 28.04,
        longitude: -81.95,
        state_code: "FL",
        region_key: "florida",
        local_date: "2026-07-18",
        local_timezone: "America/New_York",
        month: 7,
      },
      water_clarity: "stained",
      recommendation_goal: "all_purpose",
      env_data: {
        target_date: "2026-07-18",
        timezone: "America/New_York",
        wind_speed_mph: 3,
        weather: { wind_speed_unit: "mph" },
        hourly_wind_speed: hourlyWind({
          date: "2026-07-18",
          utcOffsetHours: -4,
          mph: 3,
        }),
      },
    }),
    {
      seed: "pass7a-fl-lmb",
      variant: "A",
      analysis: analysis({
        score: 82,
        lightLabel: "low_light",
        temperatureBand: "very_warm",
      }),
    },
  );

  assertPreviewInvariants(response);
  assertEquals(response.recommendation_goal, "all_purpose");
  assert(response.scenario_summary.scenario_tags.includes("calm_surface"));
  assert(response.scenario_summary.scenario_tags.includes("low_light_surface"));
  assert(hasReasonPrefix(response, "goal:all_purpose:"));
  assert(!hasReasonPrefix(response, "goal:big_fish:"));
});

Deno.test("Preview quality: Florida LMB July big-fish goal lifts upside profiles", () => {
  const response = runDailyPicksSurface(
    baseReq({
      location: {
        latitude: 28.04,
        longitude: -81.95,
        state_code: "FL",
        region_key: "florida",
        local_date: "2026-07-18",
        local_timezone: "America/New_York",
        month: 7,
      },
      water_clarity: "stained",
      recommendation_goal: "big_fish",
      env_data: {
        target_date: "2026-07-18",
        timezone: "America/New_York",
        wind_speed_mph: 3,
        weather: { wind_speed_unit: "mph" },
        hourly_wind_speed: hourlyWind({
          date: "2026-07-18",
          utcOffsetHours: -4,
          mph: 3,
        }),
      },
    }),
    {
      seed: "pass7a-fl-lmb",
      variant: "A",
      analysis: analysis({
        score: 82,
        lightLabel: "low_light",
        temperatureBand: "very_warm",
      }),
    },
  );

  assertPreviewInvariants(response);
  assertEquals(response.recommendation_goal, "big_fish");
  assert(hasReasonPrefix(response, "goal:big_fish:"));
  assert(!hasReasonPrefix(response, "goal:all_purpose:"));
});

Deno.test("Preview quality: glidebait is narrow Big Fish bass inventory, not all-purpose padding", () => {
  const requestBase = {
    location: {
      latitude: 28.04,
      longitude: -81.95,
      state_code: "FL",
      region_key: "florida" as const,
      local_date: "2026-07-18",
      local_timezone: "America/New_York",
      month: 7,
    },
    water_clarity: "clear" as const,
    env_data: {
      target_date: "2026-07-18",
      timezone: "America/New_York",
      wind_speed_mph: 17,
      weather: { wind_speed_unit: "mph" },
      hourly_wind_speed: hourlyWind({
        date: "2026-07-18",
        utcOffsetHours: -4,
        mph: 17,
      }),
    },
  };
  const row = resolveDailyPicksSeasonalRow({
    species: "largemouth_bass",
    region_key: "florida",
    month: 7,
    water_type: "freshwater_lake_pond",
  });
  assert((row.primary_lure_ids as readonly string[]).includes("glidebait"));

  const bigFish = runDailyPicksSurface(
    baseReq({
      ...requestBase,
      recommendation_goal: "big_fish",
    }),
    {
      seed: "pass7c-glidebait",
      variant: "A",
      analysis: analysis({
        score: 74,
        lightLabel: "bright",
        temperatureBand: "optimal",
      }),
    },
  );
  const allPurpose = runDailyPicksSurface(
    baseReq({
      ...requestBase,
      recommendation_goal: "all_purpose",
    }),
    {
      seed: "pass7c-glidebait",
      variant: "A",
      analysis: analysis({
        score: 74,
        lightLabel: "bright",
        temperatureBand: "optimal",
      }),
    },
  );

  assertPreviewInvariants(bigFish);
  assertPreviewInvariants(allPurpose);
  const glidebaitPick = [
    bigFish.picks.lure_of_the_day,
    bigFish.picks.honorable_lure,
  ].find((pick) => pick.id === "glidebait");
  assert(glidebaitPick);
  assert(
    glidebaitPick.score_reasons.some((reason) =>
      reason.startsWith("goal:big_fish:")
    ),
  );
  assertEquals(glidebaitPick.column, "mid");
  assertEquals(glidebaitPick.primary_pace, "slow");
  assertEquals(glidebaitPick.secondary_pace, "medium");
  assertEquals(glidebaitPick.is_surface, false);
  assert(!allPickIds(allPurpose).includes("glidebait"));
});

Deno.test("Preview quality: dirty poor-fit bass conditions do not promote glidebait", () => {
  const response = runDailyPicksSurface(
    baseReq({
      location: {
        latitude: 28.04,
        longitude: -81.95,
        state_code: "FL",
        region_key: "florida",
        local_date: "2026-07-18",
        local_timezone: "America/New_York",
        month: 7,
      },
      water_clarity: "dirty",
      recommendation_goal: "big_fish",
      env_data: {
        target_date: "2026-07-18",
        timezone: "America/New_York",
        wind_speed_mph: 17,
        weather: { wind_speed_unit: "mph" },
        hourly_wind_speed: hourlyWind({
          date: "2026-07-18",
          utcOffsetHours: -4,
          mph: 17,
        }),
      },
    }),
    {
      seed: "pass7c-dirty-glidebait",
      variant: "A",
      analysis: analysis({
        score: 74,
        lightLabel: "mixed",
        temperatureBand: "optimal",
      }),
    },
  );

  assertPreviewInvariants(response);
  assert(response.scenario_summary.scenario_tags.includes("wind_reaction"));
  assert(response.scenario_summary.scenario_tags.includes("dirty_vibration"));
  assert(!allPickIds(response).includes("glidebait"));
});

Deno.test("Preview quality: northern March LMB does not resurrect topwater when season closes surface", () => {
  const response = runDailyPicksSurface(
    baseReq({
      location: {
        latitude: 44.85,
        longitude: -85.62,
        state_code: "MI",
        region_key: "great_lakes_upper_midwest",
        local_date: "2026-03-16",
        local_timezone: "America/Detroit",
        month: 3,
      },
      water_clarity: "clear",
      env_data: {
        target_date: "2026-03-16",
        timezone: "America/Detroit",
        wind_speed_mph: 4,
        weather: { wind_speed_unit: "mph" },
      },
    }),
    {
      seed: "pass7a-mi-lmb-march",
      variant: "A",
      analysis: analysis({
        score: 58,
        lightLabel: "bright",
        temperatureBand: "very_cold",
      }),
    },
  );

  assertPreviewInvariants(response);
  assertEquals(response.scenario_summary.surface_daily_gate, "closed");
  const row = resolveDailyPicksSeasonalRow({
    species: "largemouth_bass",
    region_key: "great_lakes_upper_midwest",
    month: 3,
    water_type: "freshwater_lake_pond",
  });
  assert(!(row.primary_lure_ids as readonly string[]).includes("glidebait"));
  assert(
    response.scenario_summary.surface_daily_reason_codes.includes(
      "seasonal_surface_closed",
    ),
  );
  for (const pick of allPicks(response)) assertEquals(pick.is_surface, false);
});

Deno.test("Preview quality: trout cold-clear river stays subtle and removed surface flies stay absent", () => {
  const response = runDailyPicksSurface(
    baseReq({
      location: {
        latitude: 44.64,
        longitude: -84.72,
        state_code: "MI",
        region_key: "great_lakes_upper_midwest",
        local_date: "2026-04-12",
        local_timezone: "America/Detroit",
        month: 4,
      },
      species: "river_trout",
      context: "freshwater_river",
      water_clarity: "clear",
      env_data: {
        target_date: "2026-04-12",
        timezone: "America/Detroit",
        wind_speed_mph: 5,
        weather: { wind_speed_unit: "mph" },
      },
    }),
    {
      seed: "pass7a-trout-cold-clear",
      variant: "A",
      analysis: analysis({
        score: 50,
        lightLabel: "bright",
        temperatureBand: "very_cold",
        runoffLabel: "stable",
      }),
    },
  );

  assertPreviewInvariants(response);
  assertEquals(response.species, "trout");
  assert(response.scenario_summary.scenario_tags.includes("cold_slow"));
  assert(response.scenario_summary.scenario_tags.includes("clear_subtle"));
  assert(hasReasonPrefix(response, "daily_lane:trout_classic_fly"));
  assertAbsent(response, [
    "popper_fly",
    "deer_hair_slider",
    "soft_jerkbait",
    "game_changer",
  ]);
});

Deno.test("Preview quality: trout elevated runoff emits streamer/current signals without removed poppers", () => {
  const response = runDailyPicksSurface(
    baseReq({
      location: {
        latitude: 40.37,
        longitude: -105.52,
        state_code: "CO",
        region_key: "mountain_west",
        local_date: "2026-05-23",
        local_timezone: "America/Denver",
        month: 5,
      },
      species: "river_trout",
      context: "freshwater_river",
      water_clarity: "stained",
      env_data: {
        target_date: "2026-05-23",
        timezone: "America/Denver",
        wind_speed_mph: 9,
        weather: { wind_speed_unit: "mph" },
      },
    }),
    {
      seed: "pass7a-trout-runoff",
      variant: "A",
      analysis: analysis({
        score: 72,
        lightLabel: "mixed",
        temperatureBand: "cool",
        runoffLabel: "elevated",
      }),
    },
  );

  assertPreviewInvariants(response);
  assert(response.scenario_summary.scenario_tags.includes("runoff_streamer"));
  assert(response.scenario_summary.scenario_tags.includes("current_swing"));
  assert(hasReasonPrefix(response, "condition_tag:current_swing"));
  assertAbsent(response, [
    "popper_fly",
    "deer_hair_slider",
    "soft_jerkbait",
    "game_changer",
  ]);
});

Deno.test("Preview quality: pike cold river suppressive fixture uses pike inventory and excludes removed padding", () => {
  const response = runDailyPicksSurface(
    baseReq({
      location: {
        latitude: 46.55,
        longitude: -90.89,
        state_code: "WI",
        region_key: "great_lakes_upper_midwest",
        local_date: "2026-03-28",
        local_timezone: "America/Chicago",
        month: 3,
      },
      species: "pike_musky",
      context: "freshwater_river",
      water_clarity: "stained",
      env_data: {
        target_date: "2026-03-28",
        timezone: "America/Chicago",
        wind_speed_mph: 5,
        weather: { wind_speed_unit: "mph" },
        hourly_wind_speed: hourlyWind({
          date: "2026-03-28",
          utcOffsetHours: -5,
          mph: 5,
        }),
      },
    }),
    {
      seed: "pass7a-pike-river-cold",
      variant: "A",
      analysis: analysis({
        score: 31,
        lightLabel: "mixed",
        temperatureBand: "very_cold",
        runoffLabel: "stable",
      }),
    },
  );

  assertPreviewInvariants(response);
  assertEquals(response.species, "northern_pike");
  assertEquals(response.scenario_summary.activity_level, "suppressed");
  assertAbsent(response, ["tube_jig", "woolly_bugger"]);
  assert(
    [response.picks.fly_of_the_day.id, response.picks.honorable_fly.id].some((
      id,
    ) =>
      ["pike_bunny_streamer", "large_articulated_pike_streamer"].includes(id)
    ),
  );
  assert(
    allPickIds(response).some((id) =>
      [
        "large_pike_tube",
        "pike_jig_and_plastic",
        "pike_jerkbait",
        "large_profile_pike_swimbait",
        "pike_bunny_streamer",
        "large_articulated_pike_streamer",
        "pike_flash_fly",
      ].includes(id)
    ),
  );
});

Deno.test("Preview quality: pike big-fish fixture leans on upside reasons when valid", () => {
  const response = runDailyPicksSurface(
    baseReq({
      location: {
        latitude: 46.55,
        longitude: -90.89,
        state_code: "WI",
        region_key: "great_lakes_upper_midwest",
        local_date: "2026-06-14",
        local_timezone: "America/Chicago",
        month: 6,
      },
      species: "pike_musky",
      context: "freshwater_lake_pond",
      water_clarity: "stained",
      recommendation_goal: "big_fish",
      env_data: {
        target_date: "2026-06-14",
        timezone: "America/Chicago",
        wind_speed_mph: 10,
        weather: { wind_speed_unit: "mph" },
      },
    }),
    {
      seed: "pass7a-pike-big-fish",
      variant: "A",
      analysis: analysis({
        score: 76,
        lightLabel: "mixed",
        temperatureBand: "optimal",
      }),
    },
  );

  assertPreviewInvariants(response);
  assertEquals(response.recommendation_goal, "big_fish");
  assert(hasReasonPrefix(response, "goal:big_fish:"));
  assertAbsent(response, ["tube_jig", "woolly_bugger"]);
});

Deno.test("Preview quality: missing wind closes surface and copy remains uncertainty-aware", () => {
  const response = runDailyPicksSurface(
    baseReq({
      location: {
        latitude: 28.04,
        longitude: -81.95,
        state_code: "FL",
        region_key: "florida",
        local_date: "2026-07-18",
        local_timezone: "America/New_York",
        month: 7,
      },
      water_clarity: "stained",
      env_data: {
        target_date: "2026-07-18",
        timezone: "America/New_York",
        wind_speed_mph: undefined,
        hourly_wind_speed: undefined,
        weather: { wind_speed_unit: "mph" },
      },
    }),
    {
      seed: "pass7a-missing-wind",
      variant: "A",
      analysis: analysis({
        score: 82,
        lightLabel: "low_light",
        temperatureBand: "very_warm",
      }),
    },
  );

  assertPreviewInvariants(response);
  assertEquals(response.scenario_summary.surface_daily_gate, "closed");
  assert(response.scenario_summary.missing_inputs.includes("wind"));
  for (const pick of allPicks(response)) {
    assertEquals(pick.is_surface, false);
    assert(pick.why_chosen.includes("wind is missing"));
  }
});

Deno.test("Preview quality: stained windy fixture lifts reaction/vibration without bypassing gates", () => {
  const response = runDailyPicksSurface(
    baseReq({
      location: {
        latitude: 44.9,
        longitude: -93.2,
        state_code: "MN",
        region_key: "great_lakes_upper_midwest",
        local_date: "2026-06-15",
        local_timezone: "America/Chicago",
        month: 6,
      },
      water_clarity: "dirty",
      env_data: {
        target_date: "2026-06-15",
        timezone: "America/Chicago",
        wind_speed_mph: 17,
        weather: { wind_speed_unit: "mph" },
        hourly_wind_speed: hourlyWind({
          date: "2026-06-15",
          utcOffsetHours: -5,
          mph: 17,
        }),
      },
    }),
    {
      seed: "pass7a-dirty-windy",
      variant: "A",
      analysis: analysis({
        score: 74,
        lightLabel: "mixed",
        temperatureBand: "optimal",
      }),
    },
  );

  assertPreviewInvariants(response);
  assert(response.scenario_summary.scenario_tags.includes("wind_reaction"));
  assert(response.scenario_summary.scenario_tags.includes("dirty_vibration"));
  assert(
    hasReasonPrefix(response, "condition_tag:wind_reaction") ||
      hasReasonPrefix(response, "condition_tag:dirty_vibration"),
  );
  if (response.scenario_summary.surface_daily_gate === "closed") {
    for (const pick of allPicks(response)) assertEquals(pick.is_surface, false);
  }
});

Deno.test("Preview quality: variant B avoids Set A IDs in a rich Florida bass pool", () => {
  const req = baseReq({
    location: {
      latitude: 28.04,
      longitude: -81.95,
      state_code: "FL",
      region_key: "florida",
      local_date: "2026-07-18",
      local_timezone: "America/New_York",
      month: 7,
    },
    water_clarity: "stained",
    env_data: {
      target_date: "2026-07-18",
      timezone: "America/New_York",
      wind_speed_mph: 7,
      weather: { wind_speed_unit: "mph" },
    },
  });
  const injectedAnalysis = analysis({
    score: 78,
    lightLabel: "low_light",
    temperatureBand: "very_warm",
  });
  const setA = runDailyPicksSurface(req, {
    seed: "pass7a-set-b",
    variant: "A",
    analysis: injectedAnalysis,
  });
  const setB = runDailyPicksSurface(req, {
    seed: "pass7a-set-b",
    variant: "B",
    avoidLureIds: setA.diagnostics.selected_lure_ids,
    avoidFlyIds: setA.diagnostics.selected_fly_ids,
    analysis: injectedAnalysis,
  });

  assertPreviewInvariants(setA);
  assertPreviewInvariants(setB);
  assertEquals(setB.diagnostics.variant, "B");
  assertEquals(
    setB.diagnostics.avoid_lure_ids_applied,
    setA.diagnostics.selected_lure_ids,
  );
  assertEquals(
    setB.diagnostics.avoid_fly_ids_applied,
    setA.diagnostics.selected_fly_ids,
  );

  const setAIds = new Set(allPickIds(setA));
  for (const id of allPickIds(setB)) {
    assert(!setAIds.has(id), `Set B reused ${id} despite rich alternatives`);
  }
});
