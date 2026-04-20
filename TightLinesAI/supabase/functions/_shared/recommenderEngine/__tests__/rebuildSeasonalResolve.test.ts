import { assertEquals, assertThrows } from "jsr:@std/assert";
import {
  hasSeasonalRowRebuild,
  resolveSeasonalRowRebuild,
  SeasonalRowMissingError,
} from "../rebuild/seasonalResolve.ts";

Deno.test("SeasonalRowMissingError for matrix gap (example: trout × florida — not in gated UI)", () => {
  assertEquals(
    hasSeasonalRowRebuild("trout", "florida", 10, "freshwater_river"),
    false,
  );
  assertThrows(
    () =>
      resolveSeasonalRowRebuild("trout", "florida", 10, "freshwater_river"),
    SeasonalRowMissingError,
  );
});
