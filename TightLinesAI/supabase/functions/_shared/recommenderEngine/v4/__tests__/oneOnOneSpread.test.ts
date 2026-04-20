import { assertEquals } from "jsr:@std/assert";
import { createMulberry32 } from "../engine/prng.ts";
import { resolveDistribution } from "../engine/resolveTodayTactics.ts";
import { TACTICAL_COLUMNS_V4, TACTICAL_PACES_V4 } from "../contracts.ts";

Deno.test("oneOnOneSpread: neutral interior columns → 1+1+1 spread", () => {
  const seed = createMulberry32(42);
  const cols = ["bottom", "mid", "upper"] as const;
  const d = resolveDistribution([...TACTICAL_COLUMNS_V4], cols, "mid", "neutral", seed);
  assertEquals(d, ["mid", "upper", "bottom"]);
});

Deno.test("oneOnOneSpread: neutral narrow column range → 2+1 fallback", () => {
  const seed = createMulberry32(43);
  const cols = ["bottom", "mid"] as const;
  const d = resolveDistribution([...TACTICAL_COLUMNS_V4], cols, "bottom", "neutral", seed);
  assertEquals(d, ["bottom", "bottom", "mid"]);
});

Deno.test("oneOnOneSpread: neutral interior pace spread when range≥3", () => {
  const seed = createMulberry32(44);
  const paces = ["slow", "medium", "fast"] as const;
  const d = resolveDistribution([...TACTICAL_PACES_V4], paces, "medium", "neutral", seed);
  assertEquals(d, ["medium", "fast", "slow"]);
});
