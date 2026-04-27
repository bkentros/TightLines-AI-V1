import { assert, assertEquals } from "jsr:@std/assert";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/largemouth_bass.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/smallmouth_bass.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/trout.ts";
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

function greatLakesSmbLakeMayRow(): SeasonalRowV4 {
  const row = SMALLMOUTH_BASS_SEASONAL_ROWS_V4.find((r) =>
    r.region_key === "great_lakes_upper_midwest" &&
    r.water_type === "freshwater_lake_pond" &&
    r.month === 5
  );
  assert(row, "expected Great Lakes Upper Midwest SMB May lake row");
  return row;
}

function troutRiverRow(region: string, month: number): SeasonalRowV4 {
  const row = TROUT_SEASONAL_ROWS_V4.find((r) =>
    r.region_key === region &&
    r.water_type === "freshwater_river" &&
    r.month === month
  );
  assert(row, `expected ${region} trout river row for month ${month}`);
  return row;
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

Deno.test("SMB confidence: clear Great Lakes SMB lake traces trusted lure reasons", () => {
  const row = greatLakesSmbLakeMayRow();
  const traces: RebuildSlotSelectionTrace[] = [];
  const picks = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "clear",
    profiles: [
      { column: "mid", pace: "medium" },
      { column: "upper", pace: "medium" },
      { column: "bottom", pace: "slow" },
    ],
    surfaceBlocked: false,
    seedBase: "smb-confidence-clear-great-lakes",
    currentLocalDate: "2026-05-15",
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(picks.length, 3);
  const trustedIds = new Set([
    "suspending_jerkbait",
    "soft_jerkbait",
    "football_jig",
    "finesse_jig",
    "ned_rig",
    "tube_jig",
    "paddle_tail_swimbait",
  ]);
  const trustedScores = traces.flatMap((trace) =>
    trace.candidateScores.filter((score) => trustedIds.has(score.id))
  );
  assert(trustedScores.length > 0, "expected trusted SMB lure candidates");
  assert(
    trustedScores.some((score) =>
      score.reasons.includes("species_confidence:smallmouth_bass:+14")
    ),
    "expected species confidence trace reason on trusted SMB lures",
  );
  assert(
    trustedScores.some((score) =>
      score.reasons.includes("clarity_strength:+8") ||
      score.reasons.includes("clarity_specialist:+10")
    ),
    "expected clear-water reasons on trusted SMB lure candidates",
  );
});

Deno.test("SMB confidence: soft bonus still rotates adjacent dates", () => {
  const row = greatLakesSmbLakeMayRow();
  const signatures = new Set<string>();
  for (let day = 15; day <= 21; day++) {
    const localDate = `2026-05-${day}`;
    const picks = selectArchetypesForSide({
      side: "lure",
      row,
      species: row.species,
      context: row.water_type,
      water_clarity: "clear",
      profiles: [
        { column: "mid", pace: "medium" },
        { column: "upper", pace: "medium" },
        { column: "bottom", pace: "slow" },
      ],
      surfaceBlocked: false,
      seedBase:
        `smb-confidence-rotation|${localDate}|great_lakes_upper_midwest|smallmouth_bass|freshwater_lake_pond|clear`,
      currentLocalDate: localDate,
    });
    signatures.add(picks.map((pick) => pick.archetype.id).join("|"));
  }

  assert(signatures.size > 1, "species confidence should not hard-lock output");
});

Deno.test("SMB confidence: does not override column/pace, surface block, or exclusions", () => {
  const row = baseRow({
    species: "smallmouth_bass",
    region_key: "great_lakes_upper_midwest",
    month: 5,
    water_type: "freshwater_lake_pond",
    column_range: ["bottom", "mid", "surface"],
    pace_range: ["slow", "medium"],
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    surface_seasonally_possible: true,
    primary_lure_ids: [
      "ned_rig",
      "tube_jig",
      "football_jig",
      "finesse_jig",
      "walking_topwater",
    ],
    excluded_lure_ids: ["ned_rig"],
  });
  const traces: RebuildSlotSelectionTrace[] = [];
  const picks = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "clear",
    profiles: [
      { column: "bottom", pace: "slow" },
      { column: "surface", pace: "medium" },
      { column: "upper", pace: "medium" },
    ],
    surfaceBlocked: true,
    seedBase: "smb-confidence-hard-gates",
    currentLocalDate: "2026-05-15",
    onSlotTrace: (trace) => traces.push(trace),
  });

  assert(picks.every((pick) => pick.archetype.id !== "ned_rig"));
  assert(picks.every((pick) => !pick.archetype.is_surface));
  assert(
    traces[2]!.candidateScores.every((score) => score.id !== "soft_jerkbait"),
    "upper-column soft_jerkbait should not be compatible with bottom/mid row",
  );
  assertEquals(traces[1]!.eligibleCandidateCount, 0);
});

Deno.test("trout river confidence: applies only to trout river lure and fly candidates", () => {
  const row = troutRiverRow("mountain_west", 5);
  const lureTraces: RebuildSlotSelectionTrace[] = [];
  const flyTraces: RebuildSlotSelectionTrace[] = [];
  const reason = "species_confidence:trout_river:+10";

  const lurePicks = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "clear",
    profiles: [
      { column: "bottom", pace: "slow" },
      { column: "mid", pace: "medium" },
      { column: "upper", pace: "medium" },
    ],
    surfaceBlocked: false,
    seedBase: "trout-river-confidence-lures",
    currentLocalDate: "2026-05-08",
    onSlotTrace: (trace) => lureTraces.push(trace),
  });
  const flyPicks = selectArchetypesForSide({
    side: "fly",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "clear",
    profiles: [
      { column: "bottom", pace: "slow" },
      { column: "mid", pace: "medium" },
      { column: "upper", pace: "medium" },
    ],
    surfaceBlocked: false,
    seedBase: "trout-river-confidence-flies",
    currentLocalDate: "2026-05-08",
    onSlotTrace: (trace) => flyTraces.push(trace),
  });

  assertEquals(lurePicks.length, 3);
  assertEquals(flyPicks.length, 3);
  const boostedLureIds = new Set([
    "hair_jig",
    "casting_spoon",
    "inline_spinner",
    "suspending_jerkbait",
    "soft_jerkbait",
  ]);
  const boostedFlyIds = new Set([
    "muddler_sculpin",
    "sculpin_streamer",
    "sculpzilla",
    "woolly_bugger",
    "slim_minnow_streamer",
    "unweighted_baitfish_streamer",
    "rabbit_strip_leech",
  ]);
  const lureScores = lureTraces.flatMap((trace) =>
    trace.candidateScores.filter((score) => boostedLureIds.has(score.id))
  );
  const flyScores = flyTraces.flatMap((trace) =>
    trace.candidateScores.filter((score) => boostedFlyIds.has(score.id))
  );

  assert(lureScores.length > 0, "expected boosted trout lure candidates");
  assert(flyScores.length > 0, "expected boosted trout fly candidates");
  assert(
    lureScores.some((score) => score.reasons.includes(reason)),
    "expected trout-river confidence reason on boosted lures",
  );
  assert(
    flyScores.some((score) => score.reasons.includes(reason)),
    "expected trout-river confidence reason on boosted flies",
  );
});

Deno.test("trout river confidence: does not apply to trout lake/pond or other species", () => {
  const reason = "species_confidence:trout_river:+10";
  const troutLakeRow = baseRow({
    species: "trout",
    region_key: "great_lakes_upper_midwest",
    water_type: "freshwater_lake_pond",
    month: 5,
    column_range: ["mid", "upper"],
    pace_range: ["medium"],
    primary_forage: "baitfish",
    secondary_forage: undefined,
    surface_seasonally_possible: false,
    primary_lure_ids: [
      "casting_spoon",
      "inline_spinner",
      "suspending_jerkbait",
      "soft_jerkbait",
    ],
  });
  const nonTroutRows: SeasonalRowV4[] = [
    baseRow({
      species: "largemouth_bass",
      region_key: "florida",
      water_type: "freshwater_lake_pond",
      primary_lure_ids: ["suspending_jerkbait", "soft_jerkbait"],
    }),
    baseRow({
      species: "smallmouth_bass",
      region_key: "great_lakes_upper_midwest",
      water_type: "freshwater_river",
      primary_lure_ids: ["hair_jig", "soft_jerkbait", "inline_spinner"],
    }),
    baseRow({
      species: "northern_pike",
      region_key: "great_lakes_upper_midwest",
      water_type: "freshwater_river",
      primary_lure_ids: ["casting_spoon", "inline_spinner", "soft_jerkbait"],
    }),
  ];

  for (const row of [troutLakeRow, ...nonTroutRows]) {
    const traces: RebuildSlotSelectionTrace[] = [];
    selectArchetypesForSide({
      side: "lure",
      row,
      species: row.species,
      context: row.water_type,
      water_clarity: "clear",
      profiles: [
        { column: "bottom", pace: "slow" },
        { column: "mid", pace: "medium" },
        { column: "upper", pace: "medium" },
      ],
      surfaceBlocked: false,
      seedBase:
        `trout-river-confidence-negative|${row.species}|${row.water_type}`,
      currentLocalDate: "2026-05-08",
      onSlotTrace: (trace) => traces.push(trace),
    });
    assert(
      traces.every((trace) =>
        trace.candidateScores.every((score) => !score.reasons.includes(reason))
      ),
      `did not expect trout-river confidence for ${row.species}/${row.water_type}`,
    );
  }
});

Deno.test("trout river confidence: hard gates and variety remain intact", () => {
  const row = {
    ...troutRiverRow("appalachian", 8),
    excluded_lure_ids: ["hair_jig"] as const,
  };
  const signatures = new Set<string>();
  const reason = "species_confidence:trout_river:+10";

  for (let day = 14; day <= 20; day++) {
    const localDate = `2026-08-${day}`;
    const traces: RebuildSlotSelectionTrace[] = [];
    const picks = selectArchetypesForSide({
      side: "lure",
      row,
      species: row.species,
      context: row.water_type,
      water_clarity: "clear",
      profiles: [
        { column: "bottom", pace: "slow" },
        { column: "mid", pace: "medium" },
        { column: "surface", pace: "medium" },
      ],
      surfaceBlocked: true,
      seedBase:
        `trout-river-confidence-gates|${localDate}|appalachian|trout|freshwater_river|clear`,
      currentLocalDate: localDate,
      onSlotTrace: (trace) => traces.push(trace),
    });

    assertEquals(
      new Set(picks.map((pick) => pick.archetype.id)).size,
      picks.length,
    );
    assert(
      picks.every((pick) => pick.archetype.species_allowed.includes("trout")),
    );
    assert(
      picks.every((pick) =>
        pick.archetype.water_types_allowed.includes("freshwater_river")
      ),
    );
    assert(picks.every((pick) => !pick.archetype.is_surface));
    assert(picks.every((pick) => pick.archetype.id !== "hair_jig"));
    assert(
      traces.every((trace) =>
        trace.candidateScores.every((score) => score.id !== "hair_jig")
      ),
    );
    assert(
      traces.flatMap((trace) => trace.candidateScores).some((score) =>
        score.reasons.includes(reason)
      ),
      "expected at least one legal boosted candidate to be scored",
    );
    signatures.add(picks.map((pick) => pick.archetype.id).join("|"));
  }

  assert(signatures.size > 1, "trout confidence should not hard-lock dates");
});

Deno.test("trout river confidence: mouse and surface blocking behavior stay legal", () => {
  const row = troutRiverRow("appalachian", 8);
  const openFlyTraces: RebuildSlotSelectionTrace[] = [];
  const blockedFlyTraces: RebuildSlotSelectionTrace[] = [];
  const profiles = [
    { column: "upper" as const, pace: "medium" as const },
    { column: "mid" as const, pace: "medium" as const },
    { column: "surface" as const, pace: "medium" as const },
  ];
  const openPicks = selectArchetypesForSide({
    side: "fly",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "clear",
    profiles,
    surfaceBlocked: false,
    seedBase: "trout-river-confidence-mouse-open",
    currentLocalDate: "2026-08-07",
    flyConditionState: {
      regime: "aggressive",
      surface_allowed_today: true,
      surface_slot_present: true,
      daylight_wind_mph: 2,
      wind_band: "calm",
      species: "trout",
      context: "freshwater_river",
      month: 8,
    },
    onSlotTrace: (trace) => openFlyTraces.push(trace),
  });
  const blockedPicks = selectArchetypesForSide({
    side: "fly",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "clear",
    profiles,
    surfaceBlocked: true,
    seedBase: "trout-river-confidence-mouse-blocked",
    currentLocalDate: "2026-08-14",
    flyConditionState: {
      regime: "aggressive",
      surface_allowed_today: false,
      surface_slot_present: false,
      daylight_wind_mph: 22,
      wind_band: "windy",
      species: "trout",
      context: "freshwater_river",
      month: 8,
    },
    onSlotTrace: (trace) => blockedFlyTraces.push(trace),
  });

  assert(
    openFlyTraces.some((trace) =>
      trace.candidateScores.some((score) => score.id === "mouse_fly") ||
      trace.finalistIds.includes("mouse_fly")
    ),
    "surface-open summer trout river should keep mouse visible",
  );
  assert(
    openPicks.every((pick) => pick.archetype.species_allowed.includes("trout")),
  );
  assert(blockedPicks.every((pick) => !pick.archetype.is_surface));
  assert(
    blockedFlyTraces.every((trace) =>
      trace.candidateScores.every((score) => score.id !== "mouse_fly")
    ),
    "surface-blocked trout river should not score mouse candidates",
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
