import { assertEquals } from "jsr:@std/assert";
import { createMulberry32 } from "../engine/prng.ts";
import { resolveDistribution } from "../engine/resolveTodayTactics.ts";
import { TACTICAL_COLUMNS_V4, TACTICAL_PACES_V4 } from "../contracts.ts";

Deno.test("distributionResolution: Example A column (aggressive, upper baseline, full range)", () => {
  const seed = createMulberry32(1);
  const cols = ["bottom", "mid", "upper", "surface"] as const;
  const d = resolveDistribution([...TACTICAL_COLUMNS_V4], cols, "upper", "aggressive", seed);
  assertEquals(d, ["upper", "upper", "surface"]);
});

Deno.test("distributionResolution: Example A pace (aggressive, fast baseline)", () => {
  const seed = createMulberry32(2);
  const paces = ["slow", "medium", "fast"] as const;
  const d = resolveDistribution([...TACTICAL_PACES_V4], paces, "fast", "aggressive", seed);
  assertEquals(d, ["fast", "fast", "medium"]);
});

Deno.test("distributionResolution: Example B column (suppressed, upper→mid→bottom)", () => {
  const seed = createMulberry32(3);
  const cols = ["bottom", "mid", "upper"] as const;
  const d = resolveDistribution([...TACTICAL_COLUMNS_V4], cols, "upper", "suppressed", seed);
  assertEquals(d, ["mid", "mid", "bottom"]);
});

Deno.test("distributionResolution: Example B pace (suppressed, fast→medium→slow)", () => {
  const seed = createMulberry32(4);
  const paces = ["slow", "medium", "fast"] as const;
  const d = resolveDistribution([...TACTICAL_PACES_V4], paces, "fast", "suppressed", seed);
  assertEquals(d, ["medium", "medium", "slow"]);
});

Deno.test("distributionResolution: Example C degenerate pace", () => {
  const seed = createMulberry32(5);
  const paces = ["slow"] as const;
  const d = resolveDistribution([...TACTICAL_PACES_V4], paces, "slow", "neutral", seed);
  assertEquals(d, ["slow", "slow", "slow"]);
});

Deno.test("distributionResolution: Example D column aggressive mid→upper", () => {
  const seed = createMulberry32(6);
  const cols = ["bottom", "mid", "upper"] as const;
  const d = resolveDistribution([...TACTICAL_COLUMNS_V4], cols, "mid", "aggressive", seed);
  assertEquals(d, ["mid", "mid", "upper"]);
});

Deno.test("distributionResolution: Example D pace aggressive medium clamp", () => {
  const seed = createMulberry32(7);
  const paces = ["slow", "medium"] as const;
  const d = resolveDistribution([...TACTICAL_PACES_V4], paces, "medium", "aggressive", seed);
  assertEquals(d, ["medium", "medium", "slow"]);
});
