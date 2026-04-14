import { assert } from "jsr:@std/assert";
import { LARGEMOUTH_V3_SEASONAL_ROWS } from "../v3/seasonal/largemouth.ts";
import { SMALLMOUTH_V3_SEASONAL_ROWS } from "../v3/seasonal/smallmouth.ts";
import { NORTHERN_PIKE_V3_SEASONAL_ROWS } from "../v3/seasonal/pike.ts";
import { TROUT_V3_SEASONAL_ROWS } from "../v3/seasonal/trout.ts";
import { assertNoDuplicateSeasonalRows } from "../v3/seasonal/tuning.ts";

Deno.test("V3 seasonal tables export unique keys with minimum eligible pools", () => {
  const tables = [
    ["largemouth", LARGEMOUTH_V3_SEASONAL_ROWS],
    ["smallmouth", SMALLMOUTH_V3_SEASONAL_ROWS],
    ["trout", TROUT_V3_SEASONAL_ROWS],
    ["northern_pike", NORTHERN_PIKE_V3_SEASONAL_ROWS],
  ] as const;

  for (const [label, rows] of tables) {
    assertNoDuplicateSeasonalRows(rows, label);
    for (const row of rows) {
      assert(
        row.eligible_lure_ids.length >= 3,
        `${label} ${row.region_key} m${row.month} ${row.context} needs >= 3 eligible lures`,
      );
      assert(
        row.eligible_fly_ids.length >= 3,
        `${label} ${row.region_key} m${row.month} ${row.context} needs >= 3 eligible flies`,
      );
      for (const id of row.primary_lure_ids ?? []) {
        assert(
          row.eligible_lure_ids.includes(id),
          `${label} ${row.region_key} m${row.month} ${row.context} primary lure '${id}' must also be eligible`,
        );
      }
      for (const id of row.primary_fly_ids ?? []) {
        assert(
          row.eligible_fly_ids.includes(id),
          `${label} ${row.region_key} m${row.month} ${row.context} primary fly '${id}' must also be eligible`,
        );
      }
    }
  }
});
