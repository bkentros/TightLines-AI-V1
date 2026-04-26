import { assert, assertEquals, assertNotEquals } from "jsr:@std/assert";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
import { LURE_ARCHETYPES_V4 } from "../v4/candidates/lures.ts";
import { FLY_ARCHETYPES_V4 } from "../v4/candidates/flies.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/largemouth_bass.ts";
import {
  buildTargetProfiles,
  type DailyRegime,
  type TargetProfile,
} from "../rebuild/shapeProfiles.ts";
import {
  type RebuildSlotPick,
  type RebuildSlotSelectionTrace,
  selectArchetypesForSide,
} from "../rebuild/selectSide.ts";
import type {
  FlyDailyConditionState,
  LureDailyConditionState,
} from "../rebuild/conditionWindows.ts";

const LURE_BY_ID = new Map(LURE_ARCHETYPES_V4.map((a) => [a.id, a]));
const FLY_BY_ID = new Map(FLY_ARCHETYPES_V4.map((a) => [a.id, a]));

function baseRow(overrides: Partial<SeasonalRowV4> = {}): SeasonalRowV4 {
  return {
    species: "largemouth_bass",
    region_key: "florida",
    month: 7,
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

function floridaLmbLakeRow(month = 7): SeasonalRowV4 {
  const row = LARGEMOUTH_BASS_SEASONAL_ROWS_V4.find((r) =>
    r.region_key === "florida" &&
    r.month === month &&
    r.water_type === "freshwater_lake_pond"
  );
  assert(row, `expected Florida LMB lake row for month ${month}`);
  return row;
}

function conditionStates(args: {
  row: SeasonalRowV4;
  regime?: DailyRegime;
  clarity?: "clear" | "stained" | "dirty";
  surfaceAllowedToday?: boolean;
  surfaceSlotPresent?: boolean;
}): {
  lureConditionState: LureDailyConditionState;
  flyConditionState: FlyDailyConditionState;
} {
  const {
    row,
    regime = "aggressive",
    clarity = "stained",
    surfaceAllowedToday = true,
    surfaceSlotPresent = true,
  } = args;
  return {
    lureConditionState: {
      regime,
      water_clarity: clarity,
      surface_allowed_today: surfaceAllowedToday,
      surface_slot_present: surfaceSlotPresent,
      daylight_wind_mph: 3,
      wind_band: "calm",
    },
    flyConditionState: {
      regime,
      surface_allowed_today: surfaceAllowedToday,
      surface_slot_present: surfaceSlotPresent,
      daylight_wind_mph: 3,
      wind_band: "calm",
      species: row.species,
      context: row.water_type,
      month: row.month,
    },
  };
}

function selectBoth(args: {
  row: SeasonalRowV4;
  date: string;
  profiles?: TargetProfile[];
  regime?: DailyRegime;
  clarity?: "clear" | "stained" | "dirty";
  seedScope?: string;
}): {
  profiles: TargetProfile[];
  lurePicks: RebuildSlotPick[];
  flyPicks: RebuildSlotPick[];
  lureTraces: RebuildSlotSelectionTrace[];
  flyTraces: RebuildSlotSelectionTrace[];
} {
  const {
    row,
    date,
    regime = "aggressive",
    clarity = "stained",
    seedScope = "pass7",
  } = args;
  const profiles = args.profiles ??
    buildTargetProfiles({ row, regime, surfaceBlocked: false });
  const surfaceSlotPresent = profiles.some((p) => p.column === "surface");
  const { lureConditionState, flyConditionState } = conditionStates({
    row,
    regime,
    clarity,
    surfaceAllowedToday: row.column_range.includes("surface") &&
      row.surface_seasonally_possible,
    surfaceSlotPresent,
  });
  const seedBase =
    `${seedScope}|${date}|${row.region_key}|${row.species}|${row.water_type}|${clarity}`;
  const lureTraces: RebuildSlotSelectionTrace[] = [];
  const flyTraces: RebuildSlotSelectionTrace[] = [];

  return {
    profiles,
    lureTraces,
    flyTraces,
    lurePicks: selectArchetypesForSide({
      side: "lure",
      row,
      species: row.species,
      context: row.water_type,
      water_clarity: clarity,
      profiles,
      surfaceBlocked: false,
      seedBase,
      currentLocalDate: date,
      lureConditionState,
      onSlotTrace: (trace) => lureTraces.push(trace),
    }),
    flyPicks: selectArchetypesForSide({
      side: "fly",
      row,
      species: row.species,
      context: row.water_type,
      water_clarity: clarity,
      profiles,
      surfaceBlocked: false,
      seedBase,
      currentLocalDate: date,
      flyConditionState,
      onSlotTrace: (trace) => flyTraces.push(trace),
    }),
  };
}

function assertNoDuplicateIds(picks: readonly RebuildSlotPick[]) {
  assertEquals(
    new Set(picks.map((p) => p.archetype.id)).size,
    picks.length,
    "recommendations should not repeat exact ids",
  );
}

function assertPicksStayValid(
  row: SeasonalRowV4,
  picks: readonly RebuildSlotPick[],
) {
  for (const pick of picks) {
    const { archetype, profile } = pick;
    assert(
      archetype.species_allowed.includes(row.species),
      `${archetype.id} must allow ${row.species}`,
    );
    assert(
      archetype.water_types_allowed.includes(row.water_type),
      `${archetype.id} must allow ${row.water_type}`,
    );
    assertEquals(
      archetype.column,
      profile.column,
      `${archetype.id} should stay column-valid`,
    );
  }
}

function avoidablePresentationRepeats(args: {
  traces: readonly RebuildSlotSelectionTrace[];
  catalog: Map<string, { presentation_group: string }>;
}): string[] {
  const seenGroups = new Set<string>();
  const pickedIds = new Set<string>();
  const avoidable: string[] = [];
  for (const trace of args.traces) {
    if (trace.chosenId == null) continue;
    const chosen = args.catalog.get(trace.chosenId);
    if (chosen == null) continue;
    if (seenGroups.has(chosen.presentation_group)) {
      const hasDifferentAvailable = trace.candidateScores.some((candidate) => {
        if (pickedIds.has(candidate.id)) return false;
        const candidateProfile = args.catalog.get(candidate.id);
        return candidateProfile != null &&
          candidateProfile.presentation_group !== chosen.presentation_group;
      });
      if (hasDifferentAvailable) {
        avoidable.push(`${trace.slot}:${chosen.presentation_group}`);
      }
    }
    seenGroups.add(chosen.presentation_group);
    pickedIds.add(trace.chosenId);
  }
  return avoidable;
}

function pickTriplesAcrossDates(args: {
  row: SeasonalRowV4;
  side: "lure" | "fly";
  startDay: number;
  days: number;
}): Set<string> {
  const triples = new Set<string>();
  for (let i = 0; i < args.days; i++) {
    const day = args.startDay + i;
    const date = `2026-07-${String(day).padStart(2, "0")}`;
    const result = selectBoth({ row: args.row, date });
    const picks = args.side === "lure" ? result.lurePicks : result.flyPicks;
    assertEquals(picks.length, 3);
    triples.add(picks.map((pick) => pick.archetype.id).join("|"));
  }
  return triples;
}

Deno.test("Pass 7: Florida warm stained LMB surface day exposes and can pick frog options", () => {
  const row = floridaLmbLakeRow(7);
  const frogLurePicked = new Set<string>();
  const frogFlyPicked = new Set<string>();
  let hollowBodyFinalist = false;
  let frogFlyFinalist = false;

  for (let day = 1; day <= 30; day++) {
    const date = `2026-07-${String(day).padStart(2, "0")}`;
    const { profiles, lurePicks, flyPicks, lureTraces, flyTraces } = selectBoth(
      {
        row,
        date,
      },
    );
    assert(
      profiles.some((profile) => profile.column === "surface"),
      "expected a surface target profile",
    );
    assertEquals(lurePicks.length, 3);
    assertEquals(flyPicks.length, 3);
    assertNoDuplicateIds(lurePicks);
    assertNoDuplicateIds(flyPicks);
    assertPicksStayValid(row, lurePicks);
    assertPicksStayValid(row, flyPicks);

    if (lurePicks.some((pick) => pick.archetype.id === "hollow_body_frog")) {
      frogLurePicked.add(date);
    }
    if (flyPicks.some((pick) => pick.archetype.id === "frog_fly")) {
      frogFlyPicked.add(date);
    }
    hollowBodyFinalist ||= lureTraces.some((trace) =>
      trace.profile.column === "surface" &&
      trace.finalistIds.includes("hollow_body_frog")
    );
    frogFlyFinalist ||= flyTraces.some((trace) =>
      trace.profile.column === "surface" &&
      trace.finalistIds.includes("frog_fly")
    );
  }

  assert(hollowBodyFinalist, "hollow_body_frog should reach finalists");
  assert(frogFlyFinalist, "frog_fly should reach finalists");
  assert(
    frogLurePicked.size > 0,
    "hollow_body_frog should be pickable across date seeds",
  );
  assert(
    frogFlyPicked.size > 0,
    "frog_fly should be pickable across date seeds",
  );
});

Deno.test("Pass 7: Florida warm LMB lure triples rotate across adjacent dates", () => {
  const triples = pickTriplesAcrossDates({
    row: floridaLmbLakeRow(7),
    side: "lure",
    startDay: 1,
    days: 10,
  });
  assert(
    triples.size > 1,
    `expected lure triples to rotate, got ${[...triples].join(", ")}`,
  );
});

Deno.test("Pass 7: Florida warm LMB fly triples rotate across adjacent dates", () => {
  const triples = pickTriplesAcrossDates({
    row: floridaLmbLakeRow(7),
    side: "fly",
    startDay: 1,
    days: 10,
  });
  assert(
    triples.size > 1,
    `expected fly triples to rotate, got ${[...triples].join(", ")}`,
  );
});

Deno.test("Pass 7: deterministic selection for identical request context and date", () => {
  const row = floridaLmbLakeRow(7);
  const a = selectBoth({ row, date: "2026-07-04" });
  const b = selectBoth({ row, date: "2026-07-04" });

  assertEquals(
    a.lurePicks.map((pick) => pick.archetype.id),
    b.lurePicks.map((pick) => pick.archetype.id),
  );
  assertEquals(
    a.flyPicks.map((pick) => pick.archetype.id),
    b.flyPicks.map((pick) => pick.archetype.id),
  );
});

Deno.test("Pass 7: crankbait presentation group does not fill all lure slots when alternatives exist", () => {
  const row = baseRow({
    column_range: ["mid"],
    primary_lure_ids: [
      "flat_sided_crankbait",
      "medium_diving_crankbait",
      "lipless_crankbait",
      "spinnerbait",
      "paddle_tail_swimbait",
    ],
  });
  const { lurePicks, lureTraces } = selectBoth({
    row,
    date: "2026-07-10",
    profiles: [
      { column: "mid", pace: "medium" },
      { column: "mid", pace: "medium" },
      { column: "mid", pace: "medium" },
    ],
  });

  assertEquals(lurePicks.length, 3);
  assert(
    lurePicks.filter((pick) =>
      pick.archetype.presentation_group === "crankbait"
    )
      .length <= 1,
  );
  assertEquals(
    avoidablePresentationRepeats({ traces: lureTraces, catalog: LURE_BY_ID }),
    [],
  );
});

Deno.test("Pass 7: baitfish streamer presentation group does not fill all fly slots when alternatives exist", () => {
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
  const { flyPicks, flyTraces } = selectBoth({
    row,
    date: "2026-07-11",
    profiles: [
      { column: "mid", pace: "medium" },
      { column: "mid", pace: "medium" },
      { column: "mid", pace: "medium" },
    ],
  });

  assertEquals(flyPicks.length, 3);
  assert(
    flyPicks.filter((pick) =>
      pick.archetype.presentation_group === "baitfish_streamer"
    ).length <= 1,
  );
  assertEquals(
    avoidablePresentationRepeats({ traces: flyTraces, catalog: FLY_BY_ID }),
    [],
  );
});

Deno.test("Pass 7: cold winter row allows narrow lanes but avoids avoidable macro repeats", () => {
  const row = LARGEMOUTH_BASS_SEASONAL_ROWS_V4.find((r) =>
    r.region_key === "appalachian" &&
    r.month === 1 &&
    r.water_type === "freshwater_lake_pond"
  );
  assert(row, "expected Appalachian January LMB lake row");
  const { lurePicks, flyPicks, lureTraces, flyTraces } = selectBoth({
    row,
    date: "2026-01-15",
    regime: "suppressive",
    clarity: "stained",
  });

  assertEquals(lurePicks.length, 3);
  assertEquals(flyPicks.length, 3);
  assertNoDuplicateIds(lurePicks);
  assertNoDuplicateIds(flyPicks);
  assertPicksStayValid(row, lurePicks);
  assertPicksStayValid(row, flyPicks);
  assertEquals(
    avoidablePresentationRepeats({ traces: lureTraces, catalog: LURE_BY_ID }),
    [],
  );
  assertEquals(
    avoidablePresentationRepeats({ traces: flyTraces, catalog: FLY_BY_ID }),
    [],
  );
});

Deno.test("Pass 7: adjacent dates are not all identical for full Florida warm LMB outputs", () => {
  const row = floridaLmbLakeRow(8);
  const july15 = selectBoth({ row, date: "2026-08-15" });
  const july16 = selectBoth({ row, date: "2026-08-16" });

  assertNotEquals(
    july15.lurePicks.map((pick) => pick.archetype.id).join("|"),
    july16.lurePicks.map((pick) => pick.archetype.id).join("|"),
    "lure triples should have room to rotate on adjacent dates",
  );
  assertNotEquals(
    july15.flyPicks.map((pick) => pick.archetype.id).join("|"),
    july16.flyPicks.map((pick) => pick.archetype.id).join("|"),
    "fly triples should have room to rotate on adjacent dates",
  );
});
