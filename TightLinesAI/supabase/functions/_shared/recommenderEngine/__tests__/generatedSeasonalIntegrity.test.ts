/**
 * Validates **production** seasonal rows (`v4/seasonal/generated/*.ts` from CSV pipeline).
 *
 * Replaces Phase 4 / cross-species tests that previously asserted against embedded
 * `v3/seasonal/*.ts` tables (not the rebuild runtime source of truth).
 */
import { assert } from "jsr:@std/assert";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
import { SURFACE_FLY_IDS_V4 } from "../v4/contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../v4/candidates/lures.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/largemouth_bass.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/smallmouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/northern_pike.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/trout.ts";

const ALL_ROWS: readonly SeasonalRowV4[] = [
  ...LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  ...SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  ...NORTHERN_PIKE_SEASONAL_ROWS_V4,
  ...TROUT_SEASONAL_ROWS_V4,
];

const LURES_BY_ID = new Map(LURE_ARCHETYPES_V4.map((lure) => [lure.id, lure]));
const FLIES_BY_ID = new Map(FLY_ARCHETYPES_V4.map((fly) => [fly.id, fly]));

function rowKey(r: SeasonalRowV4): string {
  const st = r.state_code?.trim() ?? "";
  return `${r.species}|${r.region_key}|${r.month}|${r.water_type}|${st}`;
}

Deno.test("generated seasonal: duplicate keys", () => {
  const seen = new Set<string>();
  for (const row of ALL_ROWS) {
    const k = rowKey(row);
    assert(!seen.has(k), `duplicate seasonal row key: ${k}`);
    seen.add(k);
  }
});

Deno.test(
  "generated seasonal: surface_seasonally_possible aligns with surface token in column_range",
  () => {
    for (const row of ALL_ROWS) {
      const colAllowsSurface = row.column_range.includes("surface");
      assert(
        row.surface_seasonally_possible === colAllowsSurface,
        `${rowKey(row)}: surface_seasonally_possible (${row.surface_seasonally_possible}) vs column_range includes surface (${colAllowsSurface})`,
      );
    }
  },
);

Deno.test("generated seasonal: minimum primary pool sizes + primary ids stay inside pools", () => {
  for (const row of ALL_ROWS) {
    assert(row.primary_lure_ids.length >= 3, `${rowKey(row)} needs >= 3 primary lures`);
    assert(row.primary_fly_ids.length >= 3, `${rowKey(row)} needs >= 3 primary flies`);
    const lureSet = new Set(row.primary_lure_ids);
    const flySet = new Set(row.primary_fly_ids);
    assert(lureSet.size === row.primary_lure_ids.length, `${rowKey(row)} duplicate lure ids`);
    assert(flySet.size === row.primary_fly_ids.length, `${rowKey(row)} duplicate fly ids`);
  }
});

Deno.test("generated seasonal: southern warm-season LMB lake surface rows include frog opportunities", () => {
  const southernRegions = new Set([
    "florida",
    "gulf_coast",
    "southeast_atlantic",
  ]);
  const rows = LARGEMOUTH_BASS_SEASONAL_ROWS_V4.filter((row) =>
    southernRegions.has(row.region_key) &&
    row.water_type === "freshwater_lake_pond" &&
    row.month >= 3 &&
    row.month <= 10 &&
    row.surface_seasonally_possible
  );

  assert(rows.length > 0, "expected southern warm-season LMB lake surface rows");
  for (const row of rows) {
    assert(
      row.primary_lure_ids.includes("hollow_body_frog"),
      `${rowKey(row)} should include hollow_body_frog when southern warm-season lake surface is possible`,
    );
    assert(
      row.primary_fly_ids.includes("frog_fly"),
      `${rowKey(row)} should include frog_fly when southern warm-season lake surface fly fishing is honest`,
    );
  }
});

Deno.test("generated seasonal: surface flies respect catalog species and water eligibility", () => {
  const surfaceFlyIds = new Set<string>(SURFACE_FLY_IDS_V4);
  for (const row of ALL_ROWS) {
    for (const flyId of row.primary_fly_ids) {
      if (!surfaceFlyIds.has(flyId)) continue;
      const fly = FLIES_BY_ID.get(flyId);
      assert(fly, `${rowKey(row)} unknown fly id ${flyId}`);
      assert(
        fly.species_allowed.includes(row.species),
        `${rowKey(row)} includes surface fly ${flyId} not allowed for ${row.species}`,
      );
      assert(
        fly.water_types_allowed.includes(row.water_type),
        `${rowKey(row)} includes surface fly ${flyId} not allowed for ${row.water_type}`,
      );
    }
  }
});

Deno.test("generated seasonal: primary lure ids respect catalog water eligibility", () => {
  for (const row of ALL_ROWS) {
    for (const lureId of row.primary_lure_ids) {
      const lure = LURES_BY_ID.get(lureId);
      assert(lure, `${rowKey(row)} unknown lure id ${lureId}`);
      assert(
        lure.water_types_allowed.includes(row.water_type),
        `${rowKey(row)} includes lure ${lureId} not allowed for ${row.water_type}`,
      );
    }
  }
});
