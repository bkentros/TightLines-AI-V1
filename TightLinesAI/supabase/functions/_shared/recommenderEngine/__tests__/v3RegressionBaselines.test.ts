/**
 * Regression: committed matrix / coverage / daily-shift audit JSON must match
 * docs/recommender-v3-audit/regression-baselines/expected-headlines.json.
 *
 * Run from TightLinesAI/ (repo app root), same as other recommender tests:
 *   deno test --allow-read supabase/functions/_shared/recommenderEngine/__tests__/v3RegressionBaselines.test.ts
 */
import { assertEquals } from "jsr:@std/assert";
import { verifyRegressionBaselines } from "../../../../../scripts/recommender-v3-audit/verifyRegressionBaselines.ts";

Deno.test("Committed audit JSON satisfies regression headline baseline", async () => {
  const errors = await verifyRegressionBaselines(Deno.cwd());
  assertEquals(errors, []);
});
