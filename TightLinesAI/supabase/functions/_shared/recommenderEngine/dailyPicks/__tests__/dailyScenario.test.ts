import { assert, assertEquals } from "jsr:@std/assert";
import type { SharedConditionAnalysis } from "../../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderRequest } from "../../contracts/input.ts";
import type { SeasonalRowV4 } from "../../v4/contracts.ts";
import { buildDailyScenario } from "../buildDailyScenario.ts";

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

function baseRow(overrides: Partial<SeasonalRowV4> = {}): SeasonalRowV4 {
  return {
    species: "largemouth_bass",
    region_key: "great_lakes_upper_midwest",
    month: 6,
    water_type: "freshwater_lake_pond",
    column_range: ["bottom", "mid", "upper", "surface"],
    column_baseline: "upper",
    pace_range: ["slow", "medium", "fast"],
    pace_baseline: "medium",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    surface_seasonally_possible: true,
    primary_lure_ids: ["walking_topwater"],
    primary_fly_ids: ["clouser_minnow"],
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
    temperatureFinalScore?: number;
    runoffLabel?: string | null;
    pressureLabel?: string | null;
  } = {},
): SharedConditionAnalysis {
  const normalized: Record<string, unknown> = {};
  if (overrides.lightLabel !== undefined) {
    normalized.light_cloud_condition = overrides.lightLabel == null
      ? undefined
      : {
        label: overrides.lightLabel,
        score: 0,
      };
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
      band_score: overrides.temperatureFinalScore ?? 1,
      trend_label: overrides.temperatureTrend ?? "stable",
      trend_adjustment: 0,
      shock_label: overrides.temperatureShock ?? "none",
      shock_adjustment: 0,
      final_score: overrides.temperatureFinalScore ?? 1,
    };
  }
  if (overrides.runoffLabel !== undefined) {
    normalized.runoff_flow_disruption = overrides.runoffLabel == null
      ? undefined
      : {
        label: overrides.runoffLabel,
        score: 0,
      };
  }
  if (overrides.pressureLabel !== undefined) {
    normalized.pressure_regime = overrides.pressureLabel == null ? undefined : {
      label: overrides.pressureLabel,
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
        local_timezone: "UTC",
      },
      context: "freshwater_lake_pond",
      normalized,
      available_variables: [],
      missing_variables: [],
      data_gaps: [],
      reliability: overrides.reliability ?? "high",
    },
    scored: { score: overrides.score ?? 65 },
    timing: {},
    condition_context: {},
  } as unknown as SharedConditionAnalysis;
}

function hourlyWindForUtcDate(
  date: string,
  daylightValue: number,
  outsideValue: number,
) {
  return Array.from({ length: 24 }, (_, hour) => ({
    time_utc: `${date}T${String(hour).padStart(2, "0")}:00:00Z`,
    value: hour >= 5 && hour <= 21 ? daylightValue : outsideValue,
  }));
}

function hourlyWindForLocalDate(
  date: string,
  timeZoneUtcOffsetHours: number,
  valueForLocalHour: (hour: number) => number,
) {
  const [year, month, day] = date.split("-").map(Number);
  return Array.from({ length: 24 }, (_, localHour) => ({
    time_utc: new Date(
      Date.UTC(
        year!,
        month! - 1,
        day!,
        localHour - timeZoneUtcOffsetHours,
      ),
    ).toISOString(),
    value: valueForLocalHour(localHour),
  }));
}

Deno.test("DailyScenario maps How's score thresholds to activity levels", () => {
  assertEquals(
    buildDailyScenario({
      req: baseReq(),
      analysis: analysis({ score: 35 }),
      seasonalRow: baseRow(),
    }).activity_level,
    "suppressed",
  );
  assertEquals(
    buildDailyScenario({
      req: baseReq(),
      analysis: analysis({ score: 36 }),
      seasonalRow: baseRow(),
    }).activity_level,
    "neutral",
  );
  assertEquals(
    buildDailyScenario({
      req: baseReq(),
      analysis: analysis({ score: 69 }),
      seasonalRow: baseRow(),
    }).activity_level,
    "neutral",
  );
  assertEquals(
    buildDailyScenario({
      req: baseReq(),
      analysis: analysis({ score: 70 }),
      seasonalRow: baseRow(),
    }).activity_level,
    "active",
  );
});

Deno.test("DailyScenario missing wind does not become calm and closes surface", () => {
  const scenario = buildDailyScenario({
    req: baseReq({ env_data: {} }),
    analysis: analysis({ score: 80, lightLabel: "low_light" }),
    seasonalRow: baseRow(),
  });

  assertEquals(scenario.daylight_wind_mph, null);
  assertEquals(scenario.wind_mode, "unknown");
  assertEquals(scenario.surface_daily_gate, "closed");
  assert(scenario.missing_inputs.includes("wind"));
  assert(!scenario.scenario_tags.includes("calm_surface"));
});

Deno.test("DailyScenario valid hourly daylight wind beats scalar fallback", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      env_data: {
        wind_speed_mph: 3,
        hourly_wind_speed: hourlyWindForUtcDate("2026-06-15", 12, 2),
        weather: { wind_speed_unit: "mph" },
      },
    }),
    analysis: analysis({ score: 80 }),
    seasonalRow: baseRow(),
  });

  assertEquals(scenario.daylight_wind_mph, 12);
  assertEquals(scenario.wind_mode, "breezy");
});

Deno.test("DailyScenario daylight wind uses local 5am-9pm mean, not a single spike", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      location: {
        ...baseReq().location,
        local_timezone: "America/New_York",
      },
      env_data: {
        wind_speed_mph: 20,
        hourly_wind_speed: hourlyWindForLocalDate(
          "2026-06-15",
          -4,
          (hour) => hour === 14 ? 30 : 4,
        ),
        weather: { wind_speed_unit: "mph" },
      },
    }),
    analysis: analysis({ score: 80 }),
    seasonalRow: baseRow(),
  });

  assertEquals(Number(scenario.daylight_wind_mph?.toFixed(2)), 5.53);
  assertEquals(scenario.wind_mode, "calm");
  assert(!scenario.scenario_tags.includes("wind_reaction"));
});

Deno.test("DailyScenario wind thresholds are calm, slight, breezy, windy", () => {
  assertEquals(
    buildDailyScenario({
      req: baseReq({ env_data: { wind_speed_mph: 5.99 } }),
      analysis: analysis(),
      seasonalRow: baseRow(),
    }).wind_mode,
    "calm",
  );
  assertEquals(
    buildDailyScenario({
      req: baseReq({ env_data: { wind_speed_mph: 6 } }),
      analysis: analysis(),
      seasonalRow: baseRow(),
    }).wind_mode,
    "slight",
  );
  assertEquals(
    buildDailyScenario({
      req: baseReq({ env_data: { wind_speed_mph: 8.99 } }),
      analysis: analysis(),
      seasonalRow: baseRow(),
    }).wind_mode,
    "slight",
  );
  assertEquals(
    buildDailyScenario({
      req: baseReq({ env_data: { wind_speed_mph: 9 } }),
      analysis: analysis(),
      seasonalRow: baseRow(),
    }).wind_mode,
    "breezy",
  );
  assertEquals(
    buildDailyScenario({
      req: baseReq({ env_data: { wind_speed_mph: 14 } }),
      analysis: analysis(),
      seasonalRow: baseRow(),
    }).wind_mode,
    "breezy",
  );
  assertEquals(
    buildDailyScenario({
      req: baseReq({ env_data: { wind_speed_mph: 14.01 } }),
      analysis: analysis(),
      seasonalRow: baseRow(),
    }).wind_mode,
    "windy",
  );
});

Deno.test("DailyScenario slight wind does not drive wind-reaction tags", () => {
  const slightWind = buildDailyScenario({
    req: baseReq({
      water_clarity: "dirty",
      env_data: { wind_speed_mph: 8.99 },
    }),
    analysis: analysis({ score: 70 }),
    seasonalRow: baseRow(),
  });
  const breezyWind = buildDailyScenario({
    req: baseReq({
      water_clarity: "dirty",
      env_data: { wind_speed_mph: 9 },
    }),
    analysis: analysis({ score: 70 }),
    seasonalRow: baseRow(),
  });

  assertEquals(slightWind.wind_mode, "slight");
  assert(!slightWind.scenario_tags.includes("wind_reaction"));
  assert(!slightWind.scenario_tags.includes("dirty_vibration"));
  assert(!slightWind.scenario_tags.includes("open_water_search"));
  assertEquals(breezyWind.wind_mode, "breezy");
  assert(breezyWind.scenario_tags.includes("wind_reaction"));
  assert(breezyWind.scenario_tags.includes("dirty_vibration"));
  assert(breezyWind.scenario_tags.includes("open_water_search"));
});

Deno.test("DailyScenario suppressed activity blocks wind-reaction even when windy", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      water_clarity: "dirty",
      env_data: { wind_speed_mph: 16 },
    }),
    analysis: analysis({ score: 35 }),
    seasonalRow: baseRow(),
  });

  assertEquals(scenario.activity_level, "suppressed");
  assertEquals(scenario.wind_mode, "windy");
  assert(!scenario.scenario_tags.includes("wind_reaction"));
  assert(!scenario.scenario_tags.includes("dirty_vibration"));
  assertEquals(scenario.surface_daily_gate, "closed");
});

Deno.test("DailyScenario seasonal surface false keeps surface closed on calm low-light active days", () => {
  const scenario = buildDailyScenario({
    req: baseReq({ env_data: { wind_speed_mph: 3 } }),
    analysis: analysis({ score: 80, lightLabel: "low_light" }),
    seasonalRow: baseRow({
      column_range: ["bottom", "mid", "upper"],
      surface_seasonally_possible: false,
    }),
  });

  assertEquals(scenario.surface_daily_gate, "closed");
  assert(
    scenario.surface_daily_reason_codes.includes("seasonal_surface_closed"),
  );
  assert(!scenario.scenario_tags.includes("calm_surface"));
  assert(!scenario.scenario_tags.includes("low_light_surface"));
});

Deno.test("DailyScenario seasonally valid calm low-light active day opens surface and emits surface tags", () => {
  const scenario = buildDailyScenario({
    req: baseReq({ env_data: { wind_speed_mph: 3 } }),
    analysis: analysis({ score: 80, lightLabel: "low_light" }),
    seasonalRow: baseRow(),
  });

  assertEquals(scenario.surface_daily_gate, "open");
  assert(scenario.surface_daily_reason_codes.includes("calm_surface_open"));
  assert(scenario.scenario_tags.includes("calm_surface"));
  assert(scenario.scenario_tags.includes("low_light_surface"));
});

Deno.test("DailyScenario all-purpose high wind closes seasonally open surface", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      recommendation_goal: "all_purpose",
      env_data: { wind_speed_mph: 15 },
    }),
    analysis: analysis({ score: 80, lightLabel: "low_light" }),
    seasonalRow: baseRow(),
  });

  assertEquals(scenario.surface_daily_gate, "closed");
  assert(
    scenario.surface_daily_reason_codes.includes("wind_over_14_surface_closed"),
  );
  assert(!scenario.scenario_tags.includes("low_light_surface"));
});

Deno.test("DailyScenario big-fish moderate wind keeps seasonally open surface caution", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      recommendation_goal: "big_fish",
      env_data: { wind_speed_mph: 16 },
    }),
    analysis: analysis({ score: 80, lightLabel: "low_light" }),
    seasonalRow: baseRow(),
  });

  assertEquals(scenario.surface_daily_gate, "caution");
  assert(
    scenario.surface_daily_reason_codes.includes(
      "big_fish_moderate_wind_surface_caution",
    ),
  );
  assert(scenario.scenario_tags.includes("low_light_surface"));
});

Deno.test("DailyScenario big-fish truly high wind closes seasonally open surface", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      recommendation_goal: "big_fish",
      env_data: { wind_speed_mph: 18 },
    }),
    analysis: analysis({ score: 80, lightLabel: "low_light" }),
    seasonalRow: baseRow(),
  });

  assertEquals(scenario.surface_daily_gate, "closed");
  assert(
    scenario.surface_daily_reason_codes.includes("wind_over_14_surface_closed"),
  );
  assert(!scenario.scenario_tags.includes("low_light_surface"));
});

Deno.test("DailyScenario suppressed activity closes surface before big-fish moderate wind caution", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      recommendation_goal: "big_fish",
      env_data: { wind_speed_mph: 16 },
    }),
    analysis: analysis({ score: 35, lightLabel: "low_light" }),
    seasonalRow: baseRow(),
  });

  assertEquals(scenario.activity_level, "suppressed");
  assertEquals(scenario.surface_daily_gate, "closed");
  assert(
    scenario.surface_daily_reason_codes.includes(
      "suppressed_activity_surface_closed",
    ),
  );
  assert(
    !scenario.surface_daily_reason_codes.includes(
      "big_fish_moderate_wind_surface_caution",
    ),
  );
  assert(!scenario.scenario_tags.includes("low_light_surface"));
});

Deno.test("DailyScenario emits low-light surface tag for caution only when not closed", () => {
  const caution = buildDailyScenario({
    req: baseReq({
      recommendation_goal: "big_fish",
      env_data: { wind_speed_mph: 16 },
    }),
    analysis: analysis({ score: 80, lightLabel: "low_light" }),
    seasonalRow: baseRow(),
  });
  const closed = buildDailyScenario({
    req: baseReq({
      recommendation_goal: "big_fish",
      env_data: { wind_speed_mph: 18 },
    }),
    analysis: analysis({ score: 80, lightLabel: "low_light" }),
    seasonalRow: baseRow(),
  });

  assertEquals(caution.surface_daily_gate, "caution");
  assert(caution.scenario_tags.includes("low_light_surface"));
  assertEquals(closed.surface_daily_gate, "closed");
  assert(!closed.scenario_tags.includes("low_light_surface"));
});

Deno.test("DailyScenario bass heat-limited no-light surface downgrades to caution", () => {
  const scenario = buildDailyScenario({
    req: baseReq({ env_data: { wind_speed_mph: 3 } }),
    analysis: analysis({
      score: 80,
      lightLabel: "bright",
      temperatureBand: "very_warm",
    }),
    seasonalRow: baseRow(),
  });

  assertEquals(scenario.thermal_mode, "heat_limited");
  assertEquals(scenario.surface_daily_gate, "caution");
  assert(
    scenario.surface_daily_reason_codes.includes(
      "bass_heat_no_light_surface_caution",
    ),
  );
  assert(!scenario.scenario_tags.includes("calm_surface"));
  assert(!scenario.scenario_tags.includes("low_light_surface"));
});

Deno.test("DailyScenario closes northern pike surface during cold thermal windows", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      species: "pike_musky",
      env_data: { wind_speed_mph: 3 },
    }),
    analysis: analysis({
      score: 80,
      lightLabel: "low_light",
      temperatureBand: "very_cold",
      temperatureFinalScore: -2,
    }),
    seasonalRow: baseRow({ species: "northern_pike" }),
  });

  assertEquals(scenario.species, "northern_pike");
  assertEquals(scenario.thermal_mode, "cold_slow");
  assertEquals(scenario.surface_daily_gate, "closed");
  assert(
    scenario.surface_daily_reason_codes.includes("pike_cold_surface_closed"),
  );
  assert(scenario.scenario_tags.includes("cold_slow"));
  assert(!scenario.scenario_tags.includes("calm_surface"));
  assert(!scenario.scenario_tags.includes("low_light_surface"));
});

Deno.test("DailyScenario keeps warm low-light northern pike surface open", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      species: "pike_musky",
      env_data: { wind_speed_mph: 3 },
    }),
    analysis: analysis({
      score: 80,
      lightLabel: "low_light",
      temperatureBand: "optimal",
      temperatureFinalScore: 1,
    }),
    seasonalRow: baseRow({ species: "northern_pike" }),
  });

  assertEquals(scenario.species, "northern_pike");
  assertEquals(scenario.surface_daily_gate, "open");
  assert(scenario.scenario_tags.includes("calm_surface"));
  assert(scenario.scenario_tags.includes("low_light_surface"));
});

Deno.test("DailyScenario closes northern pike surface during heat-limited mixed-light windows", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      species: "pike_musky",
      env_data: { wind_speed_mph: 3 },
    }),
    analysis: analysis({
      score: 80,
      lightLabel: "mixed",
      temperatureBand: "very_warm",
    }),
    seasonalRow: baseRow({ species: "northern_pike" }),
  });

  assertEquals(scenario.species, "northern_pike");
  assertEquals(scenario.thermal_mode, "heat_limited");
  assertEquals(scenario.surface_daily_gate, "closed");
  assert(
    scenario.surface_daily_reason_codes.includes("pike_heat_surface_closed"),
  );
  assert(scenario.scenario_tags.includes("heat_finesse"));
  assert(!scenario.scenario_tags.includes("calm_surface"));
  assert(!scenario.scenario_tags.includes("low_light_surface"));
});

Deno.test("DailyScenario keeps exceptional low-light active northern pike heat surface open", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      species: "pike_musky",
      env_data: { wind_speed_mph: 3 },
    }),
    analysis: analysis({
      score: 80,
      lightLabel: "low_light",
      temperatureBand: "very_warm",
    }),
    seasonalRow: baseRow({ species: "northern_pike" }),
  });

  assertEquals(scenario.species, "northern_pike");
  assertEquals(scenario.thermal_mode, "heat_limited");
  assertEquals(scenario.surface_daily_gate, "open");
  assert(scenario.scenario_tags.includes("heat_finesse"));
  assert(scenario.scenario_tags.includes("calm_surface"));
  assert(scenario.scenario_tags.includes("low_light_surface"));
});

Deno.test("DailyScenario clear bright water emits clear_subtle", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      water_clarity: "clear",
      env_data: { wind_speed_mph: 4 },
    }),
    analysis: analysis({ lightLabel: "bright" }),
    seasonalRow: baseRow(),
  });

  assertEquals(scenario.light_mode, "bright");
  assert(scenario.scenario_tags.includes("clear_subtle"));
});

Deno.test("DailyScenario dirty or stained windy conditions emit reaction and vibration tags", () => {
  const stained = buildDailyScenario({
    req: baseReq({
      water_clarity: "stained",
      env_data: { wind_speed_mph: 15 },
    }),
    analysis: analysis({ score: 70 }),
    seasonalRow: baseRow(),
  });
  const dirty = buildDailyScenario({
    req: baseReq({
      water_clarity: "dirty",
      env_data: { wind_speed_mph: 15 },
    }),
    analysis: analysis({ score: 70 }),
    seasonalRow: baseRow(),
  });

  assert(stained.scenario_tags.includes("wind_reaction"));
  assert(stained.scenario_tags.includes("dirty_vibration"));
  assert(dirty.scenario_tags.includes("wind_reaction"));
  assert(dirty.scenario_tags.includes("dirty_vibration"));
  assert(!dirty.scenario_tags.includes("open_water_search"));
});

Deno.test("DailyScenario maps thermal states without turning trend alone into cold_slow", () => {
  const cold = buildDailyScenario({
    req: baseReq({
      location: {
        ...baseReq().location,
        local_date: "2026-01-15",
        month: 1,
      },
    }),
    analysis: analysis({
      temperatureBand: "very_cold",
      temperatureFinalScore: -2,
    }),
    seasonalRow: baseRow(),
  });
  const warming = buildDailyScenario({
    req: baseReq(),
    analysis: analysis({
      temperatureBand: "near_optimal",
      temperatureTrend: "warming",
      temperatureFinalScore: 1,
    }),
    seasonalRow: baseRow(),
  });
  const cooling = buildDailyScenario({
    req: baseReq(),
    analysis: analysis({
      temperatureBand: "optimal",
      temperatureTrend: "cooling",
      temperatureFinalScore: 1,
    }),
    seasonalRow: baseRow(),
  });
  const shock = buildDailyScenario({
    req: baseReq(),
    analysis: analysis({
      temperatureBand: "optimal",
      temperatureShock: "sharp_cooldown",
      temperatureFinalScore: 1,
    }),
    seasonalRow: baseRow(),
  });
  const heat = buildDailyScenario({
    req: baseReq(),
    analysis: analysis({ temperatureBand: "very_warm" }),
    seasonalRow: baseRow(),
  });

  assertEquals(cold.thermal_mode, "cold_slow");
  assert(cold.scenario_tags.includes("cold_slow"));
  assertEquals(warming.thermal_mode, "warming");
  assert(warming.scenario_tags.includes("warming_search"));
  assertEquals(cooling.thermal_mode, "cooling_or_shock");
  assert(!cooling.scenario_tags.includes("cold_slow"));
  assertEquals(shock.thermal_mode, "cooling_or_shock");
  assert(!shock.scenario_tags.includes("cold_slow"));
  assertEquals(heat.thermal_mode, "heat_limited");
  assert(heat.scenario_tags.includes("heat_finesse"));
});

Deno.test("DailyScenario hot summer cooling still behaves heat-limited, not cold_slow", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      location: {
        ...baseReq().location,
        latitude: 34.45,
        longitude: -114.37,
        state_code: "AZ",
        region_key: "southwest_desert",
        local_date: "2026-06-28",
        local_timezone: "America/Phoenix",
        month: 6,
      },
      env_data: { wind_speed_mph: 4 },
    }),
    analysis: analysis({
      temperatureBand: "very_warm",
      temperatureTrend: "cooling",
      temperatureShock: "sharp_cooldown",
      temperatureFinalScore: -1,
    }),
    seasonalRow: baseRow({
      region_key: "southwest_desert",
      month: 6,
    }),
  });

  assertEquals(scenario.thermal_mode, "heat_limited");
  assert(scenario.scenario_tags.includes("heat_finesse"));
  assert(!scenario.scenario_tags.includes("cold_slow"));
});

Deno.test("DailyScenario trout warm summer and early fall days are heat-limited", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      species: "river_trout",
      context: "freshwater_river",
      location: {
        ...baseReq().location,
        local_date: "2026-09-15",
        month: 9,
      },
      env_data: { daily_high_air_temp_f: 88, wind_speed_mph: 6 },
    }),
    analysis: analysis({
      temperatureBand: "optimal",
      temperatureTrend: "warming",
      temperatureFinalScore: 1,
    }),
    seasonalRow: baseRow({
      species: "trout",
      water_type: "freshwater_river",
      month: 9,
    }),
  });

  assertEquals(scenario.thermal_mode, "heat_limited");
  assert(scenario.scenario_tags.includes("heat_finesse"));
  assert(!scenario.scenario_tags.includes("warming_search"));
  assertEquals(scenario.surface_daily_gate, "closed");
  assert(
    scenario.surface_daily_reason_codes.includes("trout_heat_surface_closed"),
  );
});

Deno.test("DailyScenario summer relief cooldown does not become cold_slow", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      location: {
        ...baseReq().location,
        local_date: "2026-07-16",
        month: 7,
      },
    }),
    analysis: analysis({
      temperatureBand: "cool",
      temperatureTrend: "cooling",
      temperatureShock: "sharp_cooldown",
      temperatureFinalScore: 0.5,
    }),
    seasonalRow: baseRow({ month: 7 }),
  });

  assertEquals(scenario.thermal_mode, "cooling_or_shock");
  assert(!scenario.scenario_tags.includes("cold_slow"));
});

Deno.test("DailyScenario warming trend only emits warming_search when credible", () => {
  const suppressed = buildDailyScenario({
    req: baseReq(),
    analysis: analysis({
      score: 30,
      temperatureBand: "optimal",
      temperatureTrend: "warming",
      temperatureFinalScore: 1,
    }),
    seasonalRow: baseRow(),
  });
  const unfavorable = buildDailyScenario({
    req: baseReq(),
    analysis: analysis({
      score: 65,
      temperatureBand: "cool",
      temperatureTrend: "warming",
      temperatureFinalScore: -1,
    }),
    seasonalRow: baseRow(),
  });
  const credible = buildDailyScenario({
    req: baseReq(),
    analysis: analysis({
      score: 65,
      temperatureBand: "optimal",
      temperatureTrend: "warming",
      temperatureFinalScore: 1,
    }),
    seasonalRow: baseRow(),
  });

  assertEquals(suppressed.thermal_mode, "stable");
  assert(!suppressed.scenario_tags.includes("warming_search"));
  assertEquals(unfavorable.thermal_mode, "stable");
  assert(!unfavorable.scenario_tags.includes("warming_search"));
  assertEquals(credible.thermal_mode, "warming");
  assert(credible.scenario_tags.includes("warming_search"));
});

Deno.test("DailyScenario trout elevated river runoff emits runoff_streamer", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      species: "river_trout",
      context: "freshwater_river",
      water_clarity: "dirty",
      env_data: { wind_speed_mph: 7 },
    }),
    analysis: analysis({ runoffLabel: "elevated" }),
    seasonalRow: baseRow({
      species: "trout",
      water_type: "freshwater_river",
    }),
  });

  assertEquals(scenario.species, "trout");
  assertEquals(scenario.water_movement_mode, "elevated_or_dirty");
  assert(scenario.scenario_tags.includes("runoff_streamer"));
  assert(scenario.scenario_tags.includes("current_swing"));
});

Deno.test("DailyScenario breezy river with stable runoff does not emit current_swing", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      species: "smallmouth_bass",
      context: "freshwater_river",
      env_data: { wind_speed_mph: 9 },
    }),
    analysis: analysis({ runoffLabel: "stable" }),
    seasonalRow: baseRow({
      species: "smallmouth_bass",
      water_type: "freshwater_river",
    }),
  });

  assertEquals(scenario.wind_mode, "breezy");
  assertEquals(scenario.water_movement_mode, "stable");
  assert(!scenario.scenario_tags.includes("current_swing"));
});

Deno.test("DailyScenario breezy river with unknown runoff does not emit current_swing", () => {
  const scenario = buildDailyScenario({
    req: baseReq({
      species: "smallmouth_bass",
      context: "freshwater_river",
      env_data: { wind_speed_mph: 9 },
    }),
    analysis: analysis({ runoffLabel: null }),
    seasonalRow: baseRow({
      species: "smallmouth_bass",
      water_type: "freshwater_river",
    }),
  });

  assertEquals(scenario.wind_mode, "breezy");
  assertEquals(scenario.water_movement_mode, "unknown");
  assert(scenario.missing_inputs.includes("runoff"));
  assert(!scenario.scenario_tags.includes("current_swing"));
});

Deno.test("DailyScenario preserves recommendation_goal without changing scenario scoring", () => {
  const common = {
    analysis: analysis({ score: 80, lightLabel: "low_light" }),
    seasonalRow: baseRow(),
  };
  const allPurpose = buildDailyScenario({
    req: baseReq({
      recommendation_goal: "all_purpose",
      env_data: { wind_speed_mph: 3 },
    }),
    ...common,
  });
  const bigFish = buildDailyScenario({
    req: baseReq({
      recommendation_goal: "big_fish",
      env_data: { wind_speed_mph: 3 },
    }),
    ...common,
  });

  assertEquals(allPurpose.recommendation_goal, "all_purpose");
  assertEquals(bigFish.recommendation_goal, "big_fish");
  assertEquals(allPurpose.region_key, "great_lakes_upper_midwest");
  assertEquals(allPurpose.month, 6);
  assertEquals(allPurpose.scenario_tags, bigFish.scenario_tags);
  assertEquals(allPurpose.surface_daily_gate, bigFish.surface_daily_gate);
});
