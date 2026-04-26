import { assert, assertEquals } from "jsr:@std/assert";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/largemouth_bass.ts";
import {
  type RebuildSlotSelectionTrace,
  selectArchetypesForSide,
} from "../rebuild/selectSide.ts";

function baseRow(overrides: Partial<SeasonalRowV4> = {}): SeasonalRowV4 {
  return {
    species: "largemouth_bass",
    region_key: "florida",
    month: 4,
    water_type: "freshwater_lake_pond",
    column_range: ["bottom", "mid", "upper", "surface"],
    column_baseline: "mid",
    pace_range: ["slow", "medium", "fast"],
    pace_baseline: "medium",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    surface_seasonally_possible: true,
    primary_lure_ids: ["swim_jig"],
    primary_fly_ids: ["clouser_minnow"],
    ...overrides,
  };
}

Deno.test("weighted selection: identical context produces identical picks", () => {
  const row = baseRow({
    primary_lure_ids: [
      "spinnerbait",
      "bladed_jig",
      "paddle_tail_swimbait",
      "swim_jig",
    ],
  });
  const args = {
    side: "lure" as const,
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained" as const,
    profiles: [{ column: "mid" as const, pace: "medium" as const }],
    surfaceBlocked: false,
    seedBase:
      "shared|2026-04-24|florida|largemouth_bass|freshwater_lake_pond|stained",
    currentLocalDate: "2026-04-24",
  };

  assertEquals(selectArchetypesForSide(args), selectArchetypesForSide(args));
});

Deno.test("weighted selection: different dates can rotate among valid alternatives", () => {
  const row = baseRow({
    primary_lure_ids: [
      "spinnerbait",
      "bladed_jig",
      "paddle_tail_swimbait",
      "swim_jig",
    ],
  });
  const ids = new Set<string>();

  for (let day = 1; day <= 20; day++) {
    const localDate = `2026-04-${String(day).padStart(2, "0")}`;
    const pick = selectArchetypesForSide({
      side: "lure",
      row,
      species: row.species,
      context: row.water_type,
      water_clarity: "stained",
      profiles: [{ column: "mid", pace: "medium" }],
      surfaceBlocked: false,
      seedBase:
        `shared|${localDate}|florida|largemouth_bass|freshwater_lake_pond|stained`,
      currentLocalDate: localDate,
    })[0];
    if (pick != null) ids.add(pick.archetype.id);
  }

  assert(
    ids.size > 1,
    `expected date-scoped rotation, got ${[...ids].join(",")}`,
  );
});

Deno.test("weighted selection: presentation_group prevents three crankbaits when alternatives exist", () => {
  const row = baseRow({
    column_range: ["mid"],
    primary_lure_ids: [
      "squarebill_crankbait",
      "flat_sided_crankbait",
      "medium_diving_crankbait",
      "spinnerbait",
      "paddle_tail_swimbait",
    ],
  });
  const picks = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: [
      { column: "mid", pace: "medium" },
      { column: "mid", pace: "medium" },
      { column: "mid", pace: "medium" },
    ],
    surfaceBlocked: false,
    seedBase: "crankbait-diversity",
    currentLocalDate: "2026-04-24",
  });

  assertEquals(picks.length, 3);
  assertEquals(
    new Set(picks.map((pick) => pick.archetype.presentation_group)).size,
    3,
  );
  assert(
    picks.filter((pick) => pick.archetype.presentation_group === "crankbait")
      .length <= 1,
  );
});

Deno.test("weighted selection: fly presentation_group prevents three baitfish streamers when alternatives exist", () => {
  const row = baseRow({
    column_range: ["mid"],
    primary_fly_ids: [
      "clouser_minnow",
      "deceiver",
      "articulated_baitfish_streamer",
      "game_changer",
      "woolly_bugger",
      "articulated_dungeon_streamer",
    ],
  });
  const picks = selectArchetypesForSide({
    side: "fly",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: [
      { column: "mid", pace: "medium" },
      { column: "mid", pace: "medium" },
      { column: "mid", pace: "medium" },
    ],
    surfaceBlocked: false,
    seedBase: "fly-baitfish-diversity",
    currentLocalDate: "2026-04-24",
  });

  assertEquals(picks.length, 3);
  assertEquals(
    new Set(picks.map((pick) => pick.archetype.presentation_group)).size,
    3,
  );
  assert(
    picks.filter((pick) =>
      pick.archetype.presentation_group === "baitfish_streamer"
    ).length <= 1,
  );
});

Deno.test("weighted selection: thin same-group recent pool still fills legal slots", () => {
  const row = baseRow({
    column_range: ["bottom"],
    primary_forage: "leech_worm",
    secondary_forage: undefined,
    primary_lure_ids: ["carolina_rigged_stick_worm", "shaky_head_worm"],
  });
  const traces: RebuildSlotSelectionTrace[] = [];
  const picks = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: [
      { column: "bottom", pace: "slow" },
      { column: "bottom", pace: "slow" },
    ],
    surfaceBlocked: false,
    seedBase: "thin-nonpositive-fallback",
    currentLocalDate: "2026-04-24",
    recentHistory: [
      {
        archetype_id: "carolina_rigged_stick_worm",
        gear_mode: "lure",
        local_date: "2026-04-23",
      },
      {
        archetype_id: "shaky_head_worm",
        gear_mode: "lure",
        local_date: "2026-04-23",
      },
    ],
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(picks.length, 2);
  assertEquals(new Set(picks.map((pick) => pick.archetype.id)).size, 2);
  assert(
    traces[1]!.candidateScores.some((score) =>
      !picks.slice(0, 1).some((pick) => pick.archetype.id === score.id) &&
      score.score <= 0
    ),
  );
  assertEquals(traces[1]!.tierPoolCount, 0);
  assertEquals(traces[1]!.finalistIds.length, 1);
});

Deno.test("weighted selection: slot skips only when no legal compatible candidate remains", () => {
  const row = baseRow({
    column_range: ["bottom"],
    primary_forage: "leech_worm",
    secondary_forage: undefined,
    primary_lure_ids: ["carolina_rigged_stick_worm", "shaky_head_worm"],
  });
  const traces: RebuildSlotSelectionTrace[] = [];
  const picks = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: [
      { column: "bottom", pace: "slow" },
      { column: "bottom", pace: "slow" },
      { column: "surface", pace: "slow" },
    ],
    surfaceBlocked: false,
    seedBase: "skip-only-no-legal-compatible",
    currentLocalDate: "2026-04-24",
    recentHistory: [
      {
        archetype_id: "carolina_rigged_stick_worm",
        gear_mode: "lure",
        local_date: "2026-04-23",
      },
      {
        archetype_id: "shaky_head_worm",
        gear_mode: "lure",
        local_date: "2026-04-23",
      },
    ],
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(picks.length, 2);
  assertEquals(picks.map((pick) => pick.source_slot_index), [0, 1]);
  assertEquals(traces[2]!.eligibleCandidateCount, 0);
  assertEquals(traces[2]!.finalistIds.length, 0);
});

Deno.test("weighted selection: recent history remains a penalty when alternatives exist", () => {
  const row = baseRow({
    primary_lure_ids: [
      "spinnerbait",
      "bladed_jig",
      "paddle_tail_swimbait",
      "swim_jig",
    ],
  });
  const common = {
    side: "lure" as const,
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained" as const,
    profiles: [{ column: "mid" as const, pace: "medium" as const }],
    surfaceBlocked: false,
    seedBase: "recent-penalty-with-alternative",
    currentLocalDate: "2026-04-24",
  };
  const baseline = selectArchetypesForSide(common);
  const traces: RebuildSlotSelectionTrace[] = [];
  const cooled = selectArchetypesForSide({
    ...common,
    recentHistory: [{
      archetype_id: baseline[0]!.archetype.id,
      gear_mode: "lure",
      local_date: "2026-04-23",
    }],
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(cooled.length, 1);
  assert(cooled[0]!.archetype.id !== baseline[0]!.archetype.id);
  assert(traces.some((trace) => trace.recentHistoryPenaltyApplied));
});

Deno.test("weighted selection: Florida LMB surface lane can rotate to hollow-body frog", () => {
  const row = LARGEMOUTH_BASS_SEASONAL_ROWS_V4.find((r) =>
    r.region_key === "florida" &&
    r.month === 4 &&
    r.water_type === "freshwater_lake_pond"
  );
  assert(row, "expected Florida April lake row");

  const ids = new Set<string>();
  for (let day = 1; day <= 60; day++) {
    const localDate = `2026-04-${
      String(((day - 1) % 30) + 1).padStart(2, "0")
    }`;
    const pick = selectArchetypesForSide({
      side: "lure",
      row,
      species: row.species,
      context: row.water_type,
      water_clarity: "stained",
      profiles: [{ column: "surface", pace: "medium" }],
      surfaceBlocked: false,
      seedBase:
        `shared|${localDate}|florida|largemouth_bass|freshwater_lake_pond|stained`,
      currentLocalDate: localDate,
      lureConditionState: {
        regime: "aggressive",
        water_clarity: "stained",
        surface_allowed_today: true,
        surface_slot_present: true,
        daylight_wind_mph: 6,
        wind_band: "breezy",
      },
    })[0];
    if (pick != null) ids.add(pick.archetype.id);
  }

  assert(
    ids.has("hollow_body_frog"),
    `expected frog rotation, got ${[...ids].join(",")}`,
  );
  assert(
    ids.has("walking_topwater"),
    `expected open-water topwater still valid, got ${[...ids].join(",")}`,
  );
});

Deno.test("weighted selection: final-slot rescue can use adjacent pace catalog fallback for variety", () => {
  const row = baseRow({
    column_range: ["bottom"],
    pace_range: ["slow", "medium"],
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_ids: [
      "texas_rigged_soft_plastic_craw",
      "football_jig",
      "compact_flipping_jig",
    ],
    excluded_lure_ids: [
      "carolina_rigged_stick_worm",
      "shaky_head_worm",
      "ned_rig",
      "tube_jig",
      "blade_bait",
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
      { column: "bottom", pace: "slow" },
      { column: "bottom", pace: "slow" },
      { column: "bottom", pace: "slow" },
    ],
    surfaceBlocked: false,
    seedBase: "variety-rescue-adjacent-pace",
    currentLocalDate: "2026-04-24",
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(picks.length, 3);
  assertEquals(traces[2]!.varietyRescueUsed, true);
  assertEquals(traces[2]!.varietyRescuePoolStage, "same_column_adjacent_pace");
  assert(
    traces[2]!.candidateScores.some((score) =>
      score.id === picks[2]!.archetype.id &&
      score.reasons.includes("fallback_pool:catalog_valid_rotation:-24") &&
      score.reasons.includes("variety_rescue:presentation_group")
    ),
  );
  assert(
    picks[2]!.archetype.presentation_group !==
      picks[0]!.archetype.presentation_group,
  );
  assertEquals(picks[2]!.archetype.column, "bottom");
});

Deno.test("weighted selection: rescue respects exclusions and still fills repeated lanes", () => {
  const row = baseRow({
    column_range: ["bottom"],
    pace_range: ["slow", "medium"],
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_ids: [
      "texas_rigged_soft_plastic_craw",
      "football_jig",
      "compact_flipping_jig",
    ],
    excluded_lure_ids: [
      "ned_rig",
      "tube_jig",
      "blade_bait",
      "carolina_rigged_stick_worm",
      "shaky_head_worm",
      "deep_diving_crankbait",
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
      { column: "bottom", pace: "slow" },
      { column: "bottom", pace: "slow" },
      { column: "bottom", pace: "slow" },
    ],
    surfaceBlocked: false,
    seedBase: "variety-rescue-exclusion-safety",
    currentLocalDate: "2026-04-24",
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(picks.length, 3);
  assertEquals(traces[2]!.varietyRescueUsed, false);
  assertEquals(
    new Set(picks.map((pick) => pick.archetype.id)).size,
    picks.length,
  );
  const excludedIds = new Set<string>(row.excluded_lure_ids ?? []);
  assert(picks.every((pick) => !excludedIds.has(pick.archetype.id)));
});

Deno.test("weighted selection: catalog fallback is not used before rescue is needed", () => {
  const row = baseRow({
    column_range: ["bottom"],
    pace_range: ["slow", "medium"],
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_ids: [
      "texas_rigged_soft_plastic_craw",
      "football_jig",
      "compact_flipping_jig",
    ],
    excluded_lure_ids: [
      "carolina_rigged_stick_worm",
      "shaky_head_worm",
      "ned_rig",
      "tube_jig",
      "blade_bait",
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
      { column: "bottom", pace: "slow" },
      { column: "bottom", pace: "slow" },
      { column: "bottom", pace: "slow" },
    ],
    surfaceBlocked: false,
    seedBase: "variety-rescue-fallback-only-when-needed",
    currentLocalDate: "2026-04-24",
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(picks.length, 3);
  const primaryIds = new Set<string>(row.primary_lure_ids);
  assert(picks.slice(0, 2).every((pick) => primaryIds.has(pick.archetype.id)));
  assertEquals(traces[0]!.varietyRescueUsed, false);
  assertEquals(traces[1]!.varietyRescueUsed, false);
  assertEquals(traces[2]!.varietyRescueUsed, true);
});

Deno.test("weighted selection: rescue does not pull seasonally authored new flies from unauthored cold rows", () => {
  const row = baseRow({
    month: 1,
    column_range: ["bottom", "mid"],
    column_baseline: "bottom",
    pace_range: ["slow", "medium"],
    pace_baseline: "slow",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    surface_seasonally_possible: false,
    primary_fly_ids: [
      "rabbit_strip_leech",
      "jighead_marabou_leech",
      "lead_eye_leech",
      "feather_jig_leech",
    ],
  });
  const traces: RebuildSlotSelectionTrace[] = [];
  const picks = selectArchetypesForSide({
    side: "fly",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "clear",
    profiles: [
      { column: "bottom", pace: "slow" },
      { column: "bottom", pace: "slow" },
      { column: "bottom", pace: "slow" },
    ],
    surfaceBlocked: false,
    seedBase: "cold-winter-new-fly-fallback-safety",
    currentLocalDate: "2026-01-05",
    onSlotTrace: (trace) => traces.push(trace),
  });

  const newFlyIds = new Set([
    "warmwater_crawfish_fly",
    "warmwater_worm_fly",
    "foam_gurgler_fly",
    "pike_flash_fly",
  ]);
  assertEquals(picks.length, 3);
  assert(picks.every((pick) => !newFlyIds.has(pick.archetype.id)));
  assert(
    traces[2]!.candidateScores.every((score) => !newFlyIds.has(score.id)),
  );
});

Deno.test("weighted selection: variety rescue remains deterministic", () => {
  const row = baseRow({
    column_range: ["bottom"],
    pace_range: ["slow", "medium"],
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_ids: [
      "texas_rigged_soft_plastic_craw",
      "football_jig",
      "compact_flipping_jig",
    ],
    excluded_lure_ids: [
      "carolina_rigged_stick_worm",
      "shaky_head_worm",
      "ned_rig",
      "tube_jig",
      "blade_bait",
    ],
  });
  const args = {
    side: "lure" as const,
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained" as const,
    profiles: [
      { column: "bottom" as const, pace: "slow" as const },
      { column: "bottom" as const, pace: "slow" as const },
      { column: "bottom" as const, pace: "slow" as const },
    ],
    surfaceBlocked: false,
    seedBase: "variety-rescue-deterministic",
    currentLocalDate: "2026-04-24",
  };

  assertEquals(selectArchetypesForSide(args), selectArchetypesForSide(args));
});
