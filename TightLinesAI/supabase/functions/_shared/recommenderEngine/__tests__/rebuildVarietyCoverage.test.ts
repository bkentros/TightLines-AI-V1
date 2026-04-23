import { assert, assertEquals, assertNotEquals } from "jsr:@std/assert";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/largemouth_bass.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/smallmouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/northern_pike.ts";
import { selectArchetypesForSide } from "../rebuild/selectSide.ts";
import type { SeasonalRowV4 } from "../v4/contracts.ts";

function mustRow(
  rows: readonly SeasonalRowV4[],
  region_key: SeasonalRowV4["region_key"],
  month: number,
  water_type: SeasonalRowV4["water_type"],
): SeasonalRowV4 {
  const row = rows.find((r) =>
    r.region_key === region_key &&
    r.month === month &&
    r.water_type === water_type
  );
  assert(row, `expected row ${region_key} m${month} ${water_type}`);
  return row;
}

Deno.test("selectSide: Florida April LMB lake now fills a 3-fly aggressive warmwater trio", () => {
  const row = mustRow(
    LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
    "florida",
    4,
    "freshwater_lake_pond",
  );
  const picks = selectArchetypesForSide({
    side: "fly",
    row,
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "dirty",
    profiles: [
      { column: "surface", pace: "fast" },
      { column: "upper", pace: "medium" },
      { column: "mid", pace: "medium" },
    ],
    surfaceBlocked: false,
    seedBase: "coverage-lmb-fl-surface",
    currentLocalDate: "2026-04-21",
  });

  assertEquals(picks.length, 3);
  assertEquals(picks[0]!.archetype.id, "deer_hair_slider");
  assertEquals(picks[1]!.archetype.column, "upper");
  assertEquals(picks[2]!.archetype.column, "mid");
});

Deno.test("selectSide: Appalachian June SMB lake now fills a 3-fly summer trio", () => {
  const row = mustRow(
    SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
    "appalachian",
    6,
    "freshwater_lake_pond",
  );
  const picks = selectArchetypesForSide({
    side: "fly",
    row,
    species: "smallmouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    profiles: [
      { column: "surface", pace: "fast" },
      { column: "upper", pace: "medium" },
      { column: "mid", pace: "medium" },
    ],
    surfaceBlocked: false,
    seedBase: "coverage-smb-app-surface",
    currentLocalDate: "2026-06-18",
  });

  assertEquals(picks.length, 3);
  assertEquals(picks[0]!.archetype.id, "deer_hair_slider");
  assertEquals(picks[1]!.archetype.column, "upper");
  assertEquals(picks[2]!.archetype.column, "mid");
});

Deno.test("selectSide: Appalachian June pike lake now fills a 3-fly lake trio", () => {
  const row = mustRow(
    NORTHERN_PIKE_SEASONAL_ROWS_V4,
    "appalachian",
    6,
    "freshwater_lake_pond",
  );
  const picks = selectArchetypesForSide({
    side: "fly",
    row,
    species: "northern_pike",
    context: "freshwater_lake_pond",
    water_clarity: "dirty",
    profiles: [
      { column: "surface", pace: "fast" },
      { column: "mid", pace: "medium" },
      { column: "bottom", pace: "medium" },
    ],
    surfaceBlocked: false,
    seedBase: "coverage-pike-app-surface",
    currentLocalDate: "2026-06-18",
  });

  assertEquals(picks.length, 3);
  assertEquals(picks[0]!.archetype.id, "deer_hair_slider");
  assertEquals(picks[1]!.archetype.column, "mid");
  assertEquals(picks[2]!.archetype.column, "bottom");
  assert(
    picks[2]!.archetype.primary_pace === "medium" ||
      picks[2]!.archetype.secondary_pace === "medium",
  );
});

Deno.test("selectSide: recent-history cooldown rotates away from yesterday's exact-fit fly when alternatives exist", () => {
  const row = mustRow(
    LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
    "florida",
    4,
    "freshwater_lake_pond",
  );

  const baseline = selectArchetypesForSide({
    side: "fly",
    row,
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    profiles: [{ column: "mid", pace: "medium" }],
    surfaceBlocked: false,
    seedBase: "history-rotate",
    currentLocalDate: "2026-04-21",
  });

  assertEquals(baseline.length, 1);

  const cooled = selectArchetypesForSide({
    side: "fly",
    row,
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    profiles: [{ column: "mid", pace: "medium" }],
    surfaceBlocked: false,
    seedBase: "history-rotate",
    currentLocalDate: "2026-04-21",
    recentHistory: [{
      archetype_id: baseline[0]!.archetype.id,
      gear_mode: "fly",
      local_date: "2026-04-20",
    }],
  });

  assertEquals(cooled.length, 1);
  assertNotEquals(cooled[0]!.archetype.id, baseline[0]!.archetype.id);
});
