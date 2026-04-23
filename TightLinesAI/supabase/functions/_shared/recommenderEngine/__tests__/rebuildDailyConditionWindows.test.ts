import { assert, assertEquals, assertNotEquals } from "jsr:@std/assert";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
import type { TargetProfile } from "../rebuild/shapeProfiles.ts";
import {
  activeFlyConditionWindow,
  activeLureConditionWindow,
  type FlyDailyConditionState,
  type LureDailyConditionState,
} from "../rebuild/conditionWindows.ts";
import {
  clarityDesignatedSlot,
  conditionDesignatedSlot,
  forageDesignatedSlot,
  type RebuildSlotSelectionTrace,
  selectArchetypesForSide,
} from "../rebuild/selectSide.ts";
import {
  meanDaylightWindMph,
  windBandFromDaylightWindMph,
} from "../rebuild/wind.ts";

function baseRow(overrides: Partial<SeasonalRowV4> = {}): SeasonalRowV4 {
  return {
    species: "largemouth_bass",
    region_key: "appalachian",
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

function conditionState(
  overrides: Partial<LureDailyConditionState> = {},
): LureDailyConditionState {
  return {
    regime: "aggressive",
    water_clarity: "stained",
    surface_allowed_today: true,
    surface_slot_present: true,
    daylight_wind_mph: 8,
    wind_band: "breezy",
    ...overrides,
  };
}

function flyConditionState(
  overrides: Partial<FlyDailyConditionState> = {},
): FlyDailyConditionState {
  return {
    regime: "aggressive",
    surface_allowed_today: true,
    surface_slot_present: true,
    daylight_wind_mph: 8,
    wind_band: "breezy",
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    month: 6,
    ...overrides,
  };
}

function profilesWithOnly(
  slot: number,
  profile: TargetProfile,
): TargetProfile[] {
  return [0, 1, 2].map((i) =>
    i === slot ? profile : { column: "bottom", pace: "fast" }
  ) as TargetProfile[];
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

Deno.test("daily wind: mean uses local 5 AM through 9 PM hourly samples", () => {
  const mean = meanDaylightWindMph({
    env_data: {
      weather: { wind_speed: 99, wind_speed_unit: "mph" },
      hourly_wind_speed: hourlyWindForUtcDate("2026-06-15", 8, 30),
    },
    local_date: "2026-06-15",
    local_timezone: "UTC",
  });

  assertEquals(mean, 8);
});

Deno.test("daily wind: scalar wind is not used as a condition fallback", () => {
  const mean = meanDaylightWindMph({
    env_data: {
      weather: { wind_speed: 99, wind_speed_unit: "mph" },
      hourly_wind_speed: [],
    },
    local_date: "2026-06-15",
    local_timezone: "UTC",
  });

  assertEquals(mean, 0);
});

Deno.test("daily wind: wind_band thresholds are locked", () => {
  assertEquals(windBandFromDaylightWindMph(5.99), "calm");
  assertEquals(windBandFromDaylightWindMph(6), "breezy");
  assertEquals(windBandFromDaylightWindMph(11.99), "breezy");
  assertEquals(windBandFromDaylightWindMph(12), "windy");
});

Deno.test("condition windows: priority order is surface, wind, clear subtle", () => {
  assertEquals(
    activeLureConditionWindow(
      conditionState({
        wind_band: "breezy",
        water_clarity: "clear",
        regime: "aggressive",
      }),
    ),
    "surface_commitment_window",
  );
  assertEquals(
    activeLureConditionWindow(
      conditionState({
        wind_band: "windy",
        water_clarity: "clear",
        regime: "neutral",
      }),
    ),
    "wind_reaction_window",
  );
  assertEquals(
    activeLureConditionWindow(
      conditionState({
        wind_band: "calm",
        water_clarity: "clear",
        regime: "neutral",
      }),
    ),
    "clear_subtle_window",
  );
});

Deno.test("fly condition windows: priority order is trout mouse, then surface commitment", () => {
  assertEquals(
    activeFlyConditionWindow(
      flyConditionState({
        species: "trout",
        context: "freshwater_river",
        month: 7,
        wind_band: "calm",
      }),
    ),
    "trout_mouse_window",
  );
  assertEquals(
    activeFlyConditionWindow(
      flyConditionState({
        species: "smallmouth_bass",
        context: "freshwater_river",
        month: 7,
        wind_band: "breezy",
      }),
    ),
    "surface_commitment_fly_window",
  );
});

Deno.test("condition slot is deterministic and avoids forage and clarity slots", () => {
  const seedBase = "condition-slot-policy";
  const forageSlot = forageDesignatedSlot({ seedBase, side: "lure" });
  const claritySlot = clarityDesignatedSlot({
    seedBase,
    side: "lure",
    forageSlot,
  });
  const conditionSlot = conditionDesignatedSlot({
    seedBase,
    side: "lure",
    forageSlot,
    claritySlot,
  });

  assert([0, 1, 2].includes(conditionSlot));
  assertNotEquals(conditionSlot, forageSlot);
  assertNotEquals(conditionSlot, claritySlot);
  assertEquals(
    conditionSlot,
    conditionDesignatedSlot({
      seedBase,
      side: "lure",
      forageSlot,
      claritySlot,
    }),
  );
});

Deno.test("fly condition slot is deterministic and avoids forage and clarity slots", () => {
  const seedBase = "fly-condition-slot-policy";
  const forageSlot = forageDesignatedSlot({ seedBase, side: "fly" });
  const claritySlot = clarityDesignatedSlot({
    seedBase,
    side: "fly",
    forageSlot,
  });
  const conditionSlot = conditionDesignatedSlot({
    seedBase,
    side: "fly",
    forageSlot,
    claritySlot,
  });

  assert([0, 1, 2].includes(conditionSlot));
  assertNotEquals(conditionSlot, forageSlot);
  assertNotEquals(conditionSlot, claritySlot);
  assertEquals(
    conditionSlot,
    conditionDesignatedSlot({
      seedBase,
      side: "fly",
      forageSlot,
      claritySlot,
    }),
  );
});

Deno.test("surface condition window narrows only an existing surface finalist lane", () => {
  const seedBase = "surface-window";
  const forageSlot = forageDesignatedSlot({ seedBase, side: "lure" });
  const claritySlot = clarityDesignatedSlot({
    seedBase,
    side: "lure",
    forageSlot,
  });
  const conditionSlot = conditionDesignatedSlot({
    seedBase,
    side: "lure",
    forageSlot,
    claritySlot,
  });
  const row = baseRow({
    primary_lure_ids: [
      "walking_topwater",
      "popping_topwater",
      "prop_bait",
      "buzzbait",
    ],
  });
  const traces: RebuildSlotSelectionTrace[] = [];

  const picks = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: profilesWithOnly(conditionSlot, {
      column: "surface",
      pace: "medium",
    }),
    surfaceBlocked: false,
    seedBase,
    lureConditionState: conditionState(),
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(picks.length, 1);
  assertEquals(picks[0]!.archetype.id, "walking_topwater");
  const shaped = traces.filter((trace) => trace.conditionNarrowed);
  assertEquals(shaped.length, 1);
  assertEquals(shaped[0]!.slot, conditionSlot);
  assertEquals(shaped[0]!.conditionWindow, "surface_commitment_window");
  assert(shaped[0]!.finalistIds.every((id) => id === "walking_topwater"));
});

Deno.test("surface condition window does nothing when no surface slot is present", () => {
  const seedBase = "surface-window-no-slot";
  const row = baseRow({
    primary_lure_ids: ["walking_topwater", "popping_topwater", "prop_bait"],
  });
  const traces: RebuildSlotSelectionTrace[] = [];

  selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: [{ column: "mid", pace: "medium" }],
    surfaceBlocked: false,
    seedBase,
    lureConditionState: conditionState({ surface_slot_present: false }),
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(traces.some((trace) => trace.conditionNarrowed), false);
});

Deno.test("trout mouse window narrows only a true summer trout river mouse lane", () => {
  const seedBase = "trout-mouse-window";
  const forageSlot = forageDesignatedSlot({ seedBase, side: "fly" });
  const claritySlot = clarityDesignatedSlot({
    seedBase,
    side: "fly",
    forageSlot,
  });
  const conditionSlot = conditionDesignatedSlot({
    seedBase,
    side: "fly",
    forageSlot,
    claritySlot,
  });
  const row = baseRow({
    species: "trout",
    water_type: "freshwater_river",
    month: 7,
    column_range: ["mid", "upper", "surface"],
    primary_fly_ids: [
      "mouse_fly",
      "popper_fly",
      "deer_hair_slider",
      "baitfish_slider_fly",
    ],
  });
  const traces: RebuildSlotSelectionTrace[] = [];

  const picks = selectArchetypesForSide({
    side: "fly",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: profilesWithOnly(conditionSlot, {
      column: "surface",
      pace: "slow",
    }),
    surfaceBlocked: false,
    seedBase,
    flyConditionState: flyConditionState({
      species: "trout",
      context: "freshwater_river",
      month: 7,
      wind_band: "calm",
      daylight_wind_mph: 4,
    }),
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(picks.length, 1);
  assertEquals(picks[0]!.archetype.id, "mouse_fly");
  const shaped = traces.filter((trace) => trace.conditionNarrowed);
  assertEquals(shaped.length, 1);
  assertEquals(shaped[0]!.slot, conditionSlot);
  assertEquals(shaped[0]!.conditionWindow, "trout_mouse_window");
  assertEquals(shaped[0]!.finalistIds, ["mouse_fly"]);
});

Deno.test("surface commitment fly window narrows only an existing surface finalist lane", () => {
  const seedBase = "surface-fly-window";
  const forageSlot = forageDesignatedSlot({ seedBase, side: "fly" });
  const claritySlot = clarityDesignatedSlot({
    seedBase,
    side: "fly",
    forageSlot,
  });
  const conditionSlot = conditionDesignatedSlot({
    seedBase,
    side: "fly",
    forageSlot,
    claritySlot,
  });
  const row = baseRow({
    primary_fly_ids: [
      "popper_fly",
      "deer_hair_slider",
      "frog_fly",
      "baitfish_slider_fly",
    ],
  });
  const traces: RebuildSlotSelectionTrace[] = [];

  const picks = selectArchetypesForSide({
    side: "fly",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: profilesWithOnly(conditionSlot, {
      column: "surface",
      pace: "medium",
    }),
    surfaceBlocked: false,
    seedBase,
    flyConditionState: flyConditionState(),
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(picks.length, 1);
  const shaped = traces.filter((trace) => trace.conditionNarrowed);
  assertEquals(shaped.length, 1);
  assertEquals(shaped[0]!.slot, conditionSlot);
  assertEquals(shaped[0]!.conditionWindow, "surface_commitment_fly_window");
  assert(
    shaped[0]!.finalistIds.every((id) =>
      ["popper_fly", "frog_fly", "deer_hair_slider"].includes(id)
    ),
  );
});

Deno.test("fly condition windows shape at most one pick and do not stack", () => {
  const seedBase = "fly-condition-single-slot";
  const forageSlot = forageDesignatedSlot({ seedBase, side: "fly" });
  const claritySlot = clarityDesignatedSlot({
    seedBase,
    side: "fly",
    forageSlot,
  });
  const conditionSlot = conditionDesignatedSlot({
    seedBase,
    side: "fly",
    forageSlot,
    claritySlot,
  });
  const row = baseRow({
    primary_fly_ids: [
      "mouse_fly",
      "popper_fly",
      "deer_hair_slider",
      "frog_fly",
    ],
    species: "trout",
    water_type: "freshwater_river",
    month: 7,
    column_range: ["mid", "upper", "surface"],
  });
  const traces: RebuildSlotSelectionTrace[] = [];

  selectArchetypesForSide({
    side: "fly",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: profilesWithOnly(conditionSlot, {
      column: "surface",
      pace: "slow",
    }),
    surfaceBlocked: false,
    seedBase,
    flyConditionState: flyConditionState({
      species: "trout",
      context: "freshwater_river",
      month: 7,
      wind_band: "calm",
      daylight_wind_mph: 4,
    }),
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(traces.filter((trace) => trace.conditionNarrowed).length, 1);
});

Deno.test("lure condition state alone does not alter fly selections", () => {
  const seedBase = "fly-lure-state-ignored";
  const row = baseRow({
    primary_fly_ids: ["clouser_minnow", "game_changer"],
  });
  const common = {
    side: "fly" as const,
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained" as const,
    profiles: [{ column: "mid", pace: "medium" }] as TargetProfile[],
    surfaceBlocked: false,
    seedBase,
  };

  const withoutCondition = selectArchetypesForSide(common);
  const traces: RebuildSlotSelectionTrace[] = [];
  const withLureOnlyCondition = selectArchetypesForSide({
    ...common,
    lureConditionState: conditionState(),
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(withLureOnlyCondition, withoutCondition);
  assertEquals(traces.some((trace) => trace.conditionNarrowed), false);
});
