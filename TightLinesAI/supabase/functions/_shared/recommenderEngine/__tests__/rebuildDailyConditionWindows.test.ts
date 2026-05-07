import { assert, assertEquals, assertNotEquals } from "jsr:@std/assert";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
import type { TargetProfile } from "../rebuild/shapeProfiles.ts";
import {
  activeFlyConditionWindow,
  activeLureConditionWindow,
  FLY_CONDITION_WINDOW_WEIGHTS,
  type FlyDailyConditionState,
  LURE_CONDITION_WINDOW_WEIGHTS,
  type LureDailyConditionState,
} from "../rebuild/conditionWindows.ts";
import {
  clarityDesignatedSlot,
  conditionDesignatedSlot,
  forageDesignatedSlot,
  PRIMARY_PACE_EXACT_SCORE,
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

function hasConditionBoost(
  trace: RebuildSlotSelectionTrace,
  id: string,
  window: string,
  weight: number,
): boolean {
  return trace.candidateScores.some((score) =>
    score.id === id &&
    score.reasons.includes(`condition_window:${window}:+${weight}`)
  );
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

Deno.test("daily wind: normalized wind_speed_mph is fallback when hourly wind is absent", () => {
  const mean = meanDaylightWindMph({
    env_data: {
      wind_speed_mph: 9.5,
      weather: { wind_speed: 99, wind_speed_unit: "mph" },
    },
    local_date: "2026-06-15",
    local_timezone: "UTC",
  });

  assertEquals(mean, 9.5);
});

Deno.test("daily wind: wind_band thresholds are locked", () => {
  assertEquals(windBandFromDaylightWindMph(5.99), "calm");
  assertEquals(windBandFromDaylightWindMph(6), "breezy");
  assertEquals(windBandFromDaylightWindMph(11.99), "breezy");
  assertEquals(windBandFromDaylightWindMph(12), "windy");
});

Deno.test("condition window boosts stay within the primary pace exact budget", () => {
  for (const weight of Object.values(LURE_CONDITION_WINDOW_WEIGHTS)) {
    assert(weight <= PRIMARY_PACE_EXACT_SCORE);
  }
  for (const weight of Object.values(FLY_CONDITION_WINDOW_WEIGHTS)) {
    assert(weight <= PRIMARY_PACE_EXACT_SCORE);
  }
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

Deno.test("surface condition window scores matching lures without narrowing the pool", () => {
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
  const shaped = traces[conditionSlot]!;
  assertEquals(shaped.conditionNarrowed, false);
  assertEquals(shaped.conditionWindow, "surface_commitment_window");
  assert(
    shaped.conditionCandidateIds.every((id) =>
      ["walking_topwater", "popping_topwater", "prop_bait", "buzzbait"]
        .includes(id)
    ),
  );
  assert(
    hasConditionBoost(
      shaped,
      "walking_topwater",
      "surface_commitment_window",
      24,
    ),
  );
  assert(
    hasConditionBoost(
      shaped,
      "popping_topwater",
      "surface_commitment_window",
      24,
    ),
  );
  assert(shaped.finalistIds.includes("prop_bait"));
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

Deno.test("wind reaction lure window boosts reaction baits without hard-removing other mid options", () => {
  const row = baseRow({
    primary_lure_ids: [
      "spinnerbait",
      "bladed_jig",
      "lipless_crankbait",
      "paddle_tail_swimbait",
      "swim_jig",
      "suspending_jerkbait",
    ],
  });
  const traces: RebuildSlotSelectionTrace[] = [];

  const picks = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: [{ column: "mid", pace: "medium" }],
    surfaceBlocked: false,
    seedBase: "wind-reaction-weighted",
    lureConditionState: conditionState({
      regime: "neutral",
      wind_band: "windy",
      daylight_wind_mph: 16,
    }),
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(picks.length, 1);
  const trace = traces[0]!;
  assertEquals(trace.conditionNarrowed, false);
  assertEquals(trace.conditionWindow, "wind_reaction_window");
  assert(trace.conditionCandidateIds.includes("spinnerbait"));
  assert(trace.conditionCandidateIds.includes("bladed_jig"));
  assert(trace.conditionCandidateIds.includes("lipless_crankbait"));
  assert(hasConditionBoost(trace, "spinnerbait", "wind_reaction_window", 28));
  assert(
    hasConditionBoost(trace, "lipless_crankbait", "wind_reaction_window", 28),
  );
  assert(trace.finalistIds.includes("paddle_tail_swimbait"));
  assert(trace.finalistIds.includes("swim_jig"));
});

Deno.test("clear subtle lure window boosts multiple subtle clear-water tools without guaranteeing suspending jerkbait", () => {
  const row = baseRow({
    primary_lure_ids: [
      "suspending_jerkbait",
      "drop_shot_minnow",
      "drop_shot_worm",
      "paddle_tail_swimbait",
    ],
  });
  const traces: RebuildSlotSelectionTrace[] = [];

  const picks = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "clear",
    profiles: [{ column: "mid", pace: "medium" }],
    surfaceBlocked: false,
    seedBase: "clear-subtle-weighted",
    lureConditionState: conditionState({
      regime: "neutral",
      water_clarity: "clear",
      wind_band: "calm",
      daylight_wind_mph: 4,
    }),
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(picks.length, 1);
  const trace = traces[0]!;
  assertEquals(trace.conditionNarrowed, false);
  assertEquals(trace.conditionWindow, "clear_subtle_window");
  assert(trace.conditionCandidateIds.includes("suspending_jerkbait"));
  assert(trace.conditionCandidateIds.includes("drop_shot_minnow"));
  assert(trace.conditionCandidateIds.includes("drop_shot_worm"));
  assert(
    hasConditionBoost(trace, "suspending_jerkbait", "clear_subtle_window", 22),
  );
  assert(
    hasConditionBoost(trace, "drop_shot_minnow", "clear_subtle_window", 22),
  );
  assert(trace.finalistIds.includes("paddle_tail_swimbait"));
});

Deno.test("condition windows cannot admit wrong species, wrong water type, or wrong column", () => {
  const pikeRow = baseRow({
    species: "northern_pike",
    water_type: "freshwater_river",
    column_range: ["mid"],
    primary_lure_ids: [
      "large_bucktail_spinner",
      "pike_jerkbait",
      "large_profile_pike_swimbait",
      "bladed_jig",
      "squarebill_crankbait",
    ],
  });
  const pikeTraces: RebuildSlotSelectionTrace[] = [];

  selectArchetypesForSide({
    side: "lure",
    row: pikeRow,
    species: pikeRow.species,
    context: pikeRow.water_type,
    water_clarity: "stained",
    profiles: [{ column: "mid", pace: "medium" }],
    surfaceBlocked: false,
    seedBase: "condition-hard-gates-pike",
    lureConditionState: conditionState({
      species: "northern_pike",
      context: "freshwater_river",
      regime: "neutral",
      wind_band: "windy",
      daylight_wind_mph: 18,
    }),
    onSlotTrace: (trace) => pikeTraces.push(trace),
  });

  const pikeTrace = pikeTraces[0]!;
  assertEquals(pikeTrace.conditionNarrowed, false);
  assertEquals(pikeTrace.conditionWindow, "wind_reaction_window");
  assert(pikeTrace.conditionCandidateIds.includes("large_bucktail_spinner"));
  assert(pikeTrace.conditionCandidateIds.includes("pike_jerkbait"));
  assert(!pikeTrace.conditionCandidateIds.includes("bladed_jig"));
  assert(!pikeTrace.conditionCandidateIds.includes("squarebill_crankbait"));
  assert(
    pikeTrace.candidateScores.every((score) =>
      score.id !== "bladed_jig" && score.id !== "squarebill_crankbait"
    ),
  );

  const smbRow = baseRow({
    species: "smallmouth_bass",
    water_type: "freshwater_river",
    column_range: ["mid"],
    primary_lure_ids: [
      "suspending_jerkbait",
      "soft_jerkbait",
      "tube_jig",
      "ned_rig",
    ],
  });
  const smbTraces: RebuildSlotSelectionTrace[] = [];

  selectArchetypesForSide({
    side: "lure",
    row: smbRow,
    species: smbRow.species,
    context: smbRow.water_type,
    water_clarity: "clear",
    profiles: [{ column: "mid", pace: "medium" }],
    surfaceBlocked: false,
    seedBase: "condition-hard-gates-smb-column",
    lureConditionState: conditionState({
      species: "smallmouth_bass",
      context: "freshwater_river",
      regime: "neutral",
      water_clarity: "clear",
      wind_band: "calm",
    }),
    onSlotTrace: (trace) => smbTraces.push(trace),
  });

  const smbTrace = smbTraces[0]!;
  assertEquals(smbTrace.conditionWindow, "clear_subtle_window");
  assert(smbTrace.conditionCandidateIds.includes("suspending_jerkbait"));
  assert(!smbTrace.conditionCandidateIds.includes("soft_jerkbait"));
  assert(
    smbTrace.candidateScores.some((score) => score.id === "soft_jerkbait") ===
      false,
    "upper-column soft jerkbait should not enter a mid-column slot",
  );
});

Deno.test("LMB windy stained reaction boosts reaction baits and respects surface block", () => {
  const row = baseRow({
    species: "largemouth_bass",
    water_type: "freshwater_lake_pond",
    column_range: ["mid", "upper", "surface"],
    primary_lure_ids: [
      "spinnerbait",
      "bladed_jig",
      "lipless_crankbait",
      "squarebill_crankbait",
      "paddle_tail_swimbait",
      "walking_topwater",
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
    profiles: [
      { column: "mid", pace: "medium" },
      { column: "upper", pace: "medium" },
      { column: "surface", pace: "medium" },
    ],
    surfaceBlocked: true,
    seedBase: "lmb-windy-stained-surface-blocked",
    lureConditionState: conditionState({
      species: "largemouth_bass",
      context: "freshwater_lake_pond",
      regime: "neutral",
      wind_band: "windy",
      daylight_wind_mph: 18,
      surface_allowed_today: false,
      surface_slot_present: false,
    }),
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(traces.some((trace) => trace.conditionNarrowed), false);
  assert(picks.every((pick) => !pick.archetype.is_surface));
  assert(
    traces.every((trace) =>
      trace.candidateScores.every((score) =>
        score.id !== "walking_topwater" && score.id !== "buzzbait"
      )
    ),
  );
  assert(
    traces.some((trace) =>
      hasConditionBoost(trace, "spinnerbait", "wind_reaction_window", 28) ||
      hasConditionBoost(
        trace,
        "squarebill_crankbait",
        "wind_reaction_window",
        28,
      )
    ),
  );
});

Deno.test("SMB clear calm subtle window boosts several tools without hard-locking one lure", () => {
  const row = baseRow({
    species: "smallmouth_bass",
    water_type: "freshwater_river",
    column_range: ["bottom", "mid", "upper"],
    primary_lure_ids: [
      "suspending_jerkbait",
      "drop_shot_minnow",
      "tube_jig",
      "ned_rig",
      "hair_jig",
      "paddle_tail_swimbait",
    ],
  });
  const boosted = new Set<string>();
  const picked = new Set<string>();

  for (let day = 1; day <= 8; day++) {
    const traces: RebuildSlotSelectionTrace[] = [];
    const picks = selectArchetypesForSide({
      side: "lure",
      row,
      species: row.species,
      context: row.water_type,
      water_clarity: "clear",
      profiles: [
        { column: "mid", pace: "medium" },
        { column: "bottom", pace: "slow" },
        { column: "upper", pace: "medium" },
      ],
      surfaceBlocked: false,
      seedBase: `smb-clear-subtle-rotation-2026-06-${day}`,
      lureConditionState: conditionState({
        species: "smallmouth_bass",
        context: "freshwater_river",
        regime: day % 2 === 0 ? "neutral" : "suppressive",
        water_clarity: "clear",
        wind_band: "calm",
      }),
      onSlotTrace: (trace) => traces.push(trace),
    });
    for (const pick of picks) picked.add(pick.archetype.id);
    for (const trace of traces) {
      assertEquals(trace.conditionNarrowed, false);
      for (const id of trace.conditionCandidateIds) boosted.add(id);
    }
  }

  assert(boosted.has("suspending_jerkbait"));
  assert(boosted.has("drop_shot_minnow"));
  assert(boosted.has("tube_jig") || boosted.has("ned_rig"));
  assert(picked.size > 1, "clear subtle should not guarantee one lure");
});

Deno.test("pike windy reaction boosts pike flash tools without bass finesse dominance", () => {
  const row = baseRow({
    species: "northern_pike",
    region_key: "great_lakes_upper_midwest",
    water_type: "freshwater_lake_pond",
    column_range: ["mid"],
    primary_lure_ids: [
      "large_bucktail_spinner",
      "casting_spoon",
      "pike_jerkbait",
      "large_profile_pike_swimbait",
      "spinnerbait",
      "tube_jig",
      "ned_rig",
    ],
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
    seedBase: "pike-windy-flash",
    lureConditionState: conditionState({
      species: "northern_pike",
      context: "freshwater_lake_pond",
      regime: "neutral",
      wind_band: "windy",
      daylight_wind_mph: 19,
    }),
    onSlotTrace: (trace) => traces.push(trace),
  });

  const trace = traces[0]!;
  assertEquals(trace.conditionWindow, "wind_reaction_window");
  assert(
    hasConditionBoost(
      trace,
      "large_bucktail_spinner",
      "wind_reaction_window",
      28,
    ),
  );
  assert(hasConditionBoost(trace, "casting_spoon", "wind_reaction_window", 28));
  assert(
    trace.candidateScores.every((score) =>
      score.id !== "tube_jig" && score.id !== "ned_rig"
    ),
    "bass finesse IDs should not pass pike hard gates",
  );
});

Deno.test("trout mouse window boosts mouse without hard-locking the lane", () => {
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
  const shaped = traces[conditionSlot]!;
  assertEquals(shaped.conditionNarrowed, false);
  assertEquals(shaped.conditionWindow, "trout_mouse_window");
  assert(shaped.conditionCandidateIds.includes("mouse_fly"));
  assert(
    hasConditionBoost(shaped, "mouse_fly", "trout_mouse_window", 28),
  );
});

Deno.test("trout mouse boost does not hard-lock mouse across deterministic dates", () => {
  const row = baseRow({
    species: "trout",
    water_type: "freshwater_river",
    month: 7,
    column_range: ["surface"],
    primary_fly_ids: [
      "mouse_fly",
      "popper_fly",
      "deer_hair_slider",
      "foam_gurgler_fly",
    ],
  });
  const picked = new Set<string>();

  for (let day = 1; day <= 14; day++) {
    const picks = selectArchetypesForSide({
      side: "fly",
      row,
      species: row.species,
      context: row.water_type,
      water_clarity: "stained",
      profiles: [{ column: "surface", pace: "medium" }],
      surfaceBlocked: false,
      seedBase: `trout-mouse-window-rotation-2026-07-${day}`,
      flyConditionState: flyConditionState({
        species: "trout",
        context: "freshwater_river",
        month: 7,
        wind_band: "calm",
        daylight_wind_mph: 4,
      }),
    });
    if (picks[0]) picked.add(picks[0].archetype.id);
  }

  assert(picked.has("mouse_fly"));
  assert(picked.size > 1, "mouse boost should not hard-lock every date");
});

Deno.test("trout mouse window is inactive outside trout river summer calm surface context", () => {
  assertEquals(
    activeFlyConditionWindow(
      flyConditionState({
        species: "trout",
        context: "freshwater_river",
        month: 5,
        wind_band: "calm",
      }),
    ),
    "surface_commitment_fly_window",
  );
  assertEquals(
    activeFlyConditionWindow(
      flyConditionState({
        species: "trout",
        context: "freshwater_river",
        month: 7,
        wind_band: "breezy",
      }),
    ),
    "surface_commitment_fly_window",
  );
  assertEquals(
    activeFlyConditionWindow(
      flyConditionState({
        species: "largemouth_bass",
        context: "freshwater_lake_pond",
        month: 7,
        wind_band: "calm",
      }),
    ),
    "surface_commitment_fly_window",
  );
});

Deno.test("trout elevated runoff streamer window boosts only legal trout river flies", () => {
  const row = baseRow({
    species: "trout",
    water_type: "freshwater_river",
    month: 5,
    column_range: ["bottom", "mid", "upper"],
    primary_fly_ids: [
      "sculpin_streamer",
      "muddler_sculpin",
      "sculpzilla",
      "woolly_bugger",
      "rabbit_strip_leech",
      "conehead_streamer",
      "pike_flash_fly",
      "warmwater_crawfish_fly",
    ],
  });
  const traces: RebuildSlotSelectionTrace[] = [];

  selectArchetypesForSide({
    side: "fly",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "dirty",
    profiles: [
      { column: "bottom", pace: "slow" },
      { column: "mid", pace: "medium" },
      { column: "upper", pace: "medium" },
    ],
    surfaceBlocked: false,
    seedBase: "trout-elevated-runoff-streamers",
    flyConditionState: flyConditionState({
      species: "trout",
      context: "freshwater_river",
      month: 5,
      regime: "neutral",
      runoff_mode: "elevated_or_dirty",
    }),
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(traces.some((trace) => trace.conditionNarrowed), false);
  assert(
    traces.some((trace) =>
      trace.conditionWindow === "trout_elevated_runoff_streamer_window"
    ),
  );
  assert(
    traces.some((trace) =>
      hasConditionBoost(
        trace,
        "sculpin_streamer",
        "trout_elevated_runoff_streamer_window",
        28,
      ) ||
      hasConditionBoost(
        trace,
        "woolly_bugger",
        "trout_elevated_runoff_streamer_window",
        28,
      )
    ),
  );
  assert(
    traces.every((trace) =>
      trace.candidateScores.every((score) =>
        score.id !== "pike_flash_fly" &&
        score.id !== "warmwater_crawfish_fly"
      )
    ),
  );
});

Deno.test("clear stable trout river does not activate elevated runoff streamer window", () => {
  assertEquals(
    activeFlyConditionWindow(
      flyConditionState({
        species: "trout",
        context: "freshwater_river",
        month: 5,
        regime: "neutral",
        runoff_mode: "clear_or_stable",
      }),
    ),
    null,
  );
});

Deno.test("pike windy fly window boosts pike flash without admitting wrong species", () => {
  const row = baseRow({
    species: "northern_pike",
    water_type: "freshwater_river",
    column_range: ["upper"],
    primary_fly_ids: [
      "pike_flash_fly",
      "unweighted_baitfish_streamer",
      "conehead_streamer",
      "warmwater_crawfish_fly",
    ],
  });
  const traces: RebuildSlotSelectionTrace[] = [];

  selectArchetypesForSide({
    side: "fly",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: [{ column: "upper", pace: "medium" }],
    surfaceBlocked: false,
    seedBase: "pike-windy-fly-flash",
    flyConditionState: flyConditionState({
      species: "northern_pike",
      context: "freshwater_river",
      regime: "neutral",
      wind_band: "windy",
      daylight_wind_mph: 18,
    }),
    onSlotTrace: (trace) => traces.push(trace),
  });

  const trace = traces[0]!;
  assertEquals(trace.conditionWindow, "pike_wind_flash_fly_window");
  assert(
    hasConditionBoost(
      trace,
      "pike_flash_fly",
      "pike_wind_flash_fly_window",
      26,
    ),
  );
  assert(!trace.conditionCandidateIds.includes("conehead_streamer"));
  assert(!trace.conditionCandidateIds.includes("warmwater_crawfish_fly"));
});

Deno.test("surface commitment fly window scores matching flies without narrowing", () => {
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
  const shaped = traces[conditionSlot]!;
  assertEquals(shaped.conditionNarrowed, false);
  assertEquals(shaped.conditionWindow, "surface_commitment_fly_window");
  assert(
    shaped.conditionCandidateIds.every((id) =>
      ["popper_fly", "frog_fly", "deer_hair_slider"].includes(id)
    ),
  );
  assert(
    shaped.candidateScores.some((score) =>
      score.id === "frog_fly" &&
      score.reasons.includes(
        "condition_window:surface_commitment_fly_window:+24",
      )
    ),
  );
});

Deno.test("fly condition windows apply one active bonus and do not narrow", () => {
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

  assertEquals(traces.filter((trace) => trace.conditionNarrowed).length, 0);
  assert(
    traces.some((trace) =>
      trace.conditionWindow === "trout_mouse_window" &&
      hasConditionBoost(trace, "mouse_fly", "trout_mouse_window", 28)
    ),
  );
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
