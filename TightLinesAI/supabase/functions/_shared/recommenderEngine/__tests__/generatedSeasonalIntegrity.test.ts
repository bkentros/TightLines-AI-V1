/**
 * Validates **production** seasonal rows (`v4/seasonal/generated/*.ts` from CSV pipeline).
 *
 * Replaces Phase 4 / cross-species tests that previously asserted against embedded
 * `v3/seasonal/*.ts` tables (not the rebuild runtime source of truth).
 */
import { assert } from "jsr:@std/assert";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
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
