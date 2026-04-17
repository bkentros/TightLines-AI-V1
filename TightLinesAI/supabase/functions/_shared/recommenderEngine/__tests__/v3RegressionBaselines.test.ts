/**
 * Regression: committed matrix / coverage / daily-shift audit JSON must match
 * docs/recommender-v3-audit/regression-baselines/expected-headlines.json.
 *
 * Run from TightLinesAI/ (repo app root). Audit JSON is loaded via static imports
 * so `deno test supabase/functions/_shared/recommenderEngine` passes without
 * `--allow-read`.
 */
import { assertEquals } from "jsr:@std/assert";
import coverageAudit from "../../../../../docs/recommender-v3-audit/generated/v3-coverage-audit.json" with { type: "json" };
import dailyShiftAudit from "../../../../../docs/recommender-v3-audit/generated/v3-daily-shift-audit.json" with { type: "json" };
import matrixAuditSummary from "../../../../../docs/recommender-v3-audit/generated/freshwater-v3-matrix-audit-summary.json" with { type: "json" };
import expectedHeadlines from "../../../../../docs/recommender-v3-audit/regression-baselines/expected-headlines.json" with { type: "json" };
import {
  type ExpectedHeadlines,
  type RegressionBaselineFixtures,
  verifyRegressionBaselines,
} from "../../../../../scripts/recommender-v3-audit/verifyRegressionBaselines.ts";

Deno.test("Committed audit JSON satisfies regression headline baseline", async () => {
  const fixtures: RegressionBaselineFixtures = {
    expected: expectedHeadlines as ExpectedHeadlines,
    matrix: matrixAuditSummary as RegressionBaselineFixtures["matrix"],
    daily_shift: dailyShiftAudit as RegressionBaselineFixtures["daily_shift"],
    coverage: coverageAudit as RegressionBaselineFixtures["coverage"],
  };
  const errors = await verifyRegressionBaselines(Deno.cwd(), fixtures);
  assertEquals(errors, []);
});
