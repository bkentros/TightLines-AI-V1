import { assertEquals } from "jsr:@std/assert";
import type { DailyScenario } from "../buildDailyScenario.ts";
import { resolveColorPaletteTheme } from "../resolveColorPaletteTheme.ts";

function baseScenario(
  overrides: Partial<DailyScenario> = {},
): DailyScenario {
  return {
    local_date: "2026-06-15",
    local_timezone: "America/New_York",
    species: "largemouth_bass",
    region_key: "great_lakes_upper_midwest",
    month: 6,
    water_type: "freshwater_lake_pond",
    water_clarity: "clear",
    recommendation_goal: "all_purpose",
    hows_score: 70,
    activity_level: "active",
    surface_daily_gate: "open",
    surface_daily_reason_codes: [],
    light_mode: "mixed",
    wind_mode: "calm",
    daylight_wind_mph: 4,
    thermal_mode: "stable",
    water_movement_mode: "not_applicable",
    pressure_mode: "stable",
    scenario_tags: [],
    missing_inputs: [],
    confidence: "high",
    ...overrides,
  };
}

Deno.test("resolveColorPaletteTheme: dirty water → bright (daytime / non-low-light)", () => {
  assertEquals(
    resolveColorPaletteTheme(
      baseScenario({ water_clarity: "dirty", light_mode: "mixed" }),
    ),
    "bright",
  );
});

Deno.test("resolveColorPaletteTheme: dirty water + low light → dark silhouette", () => {
  assertEquals(
    resolveColorPaletteTheme(
      baseScenario({ water_clarity: "dirty", light_mode: "low_light" }),
    ),
    "dark",
  );
});

Deno.test("resolveColorPaletteTheme: dirty_vibration tag → bright", () => {
  assertEquals(
    resolveColorPaletteTheme(
      baseScenario({
        water_clarity: "clear",
        scenario_tags: ["dirty_vibration"],
      }),
    ),
    "bright",
  );
});

Deno.test("resolveColorPaletteTheme: low_light wins over dirty_vibration tag", () => {
  assertEquals(
    resolveColorPaletteTheme(
      baseScenario({
        water_clarity: "stained",
        light_mode: "low_light",
        scenario_tags: ["dirty_vibration"],
      }),
    ),
    "dark",
  );
});

Deno.test("resolveColorPaletteTheme: low_light → dark", () => {
  assertEquals(
    resolveColorPaletteTheme(
      baseScenario({ light_mode: "low_light" }),
    ),
    "dark",
  );
});

Deno.test("resolveColorPaletteTheme: low_light_surface tag → dark", () => {
  assertEquals(
    resolveColorPaletteTheme(
      baseScenario({
        light_mode: "mixed",
        scenario_tags: ["low_light_surface"],
      }),
    ),
    "dark",
  );
});

Deno.test("resolveColorPaletteTheme: stained + bright sun → bright", () => {
  assertEquals(
    resolveColorPaletteTheme(
      baseScenario({
        water_clarity: "stained",
        light_mode: "bright",
      }),
    ),
    "bright",
  );
});

Deno.test("resolveColorPaletteTheme: stained + glare → bright", () => {
  assertEquals(
    resolveColorPaletteTheme(
      baseScenario({ water_clarity: "stained", light_mode: "glare" }),
    ),
    "bright",
  );
});

Deno.test("resolveColorPaletteTheme: stained + mixed (no sun stress) → natural", () => {
  assertEquals(
    resolveColorPaletteTheme(
      baseScenario({ water_clarity: "stained", light_mode: "mixed" }),
    ),
    "natural",
  );
});

Deno.test("resolveColorPaletteTheme: clear + bright → natural", () => {
  assertEquals(
    resolveColorPaletteTheme(
      baseScenario({ water_clarity: "clear", light_mode: "bright" }),
    ),
    "natural",
  );
});
