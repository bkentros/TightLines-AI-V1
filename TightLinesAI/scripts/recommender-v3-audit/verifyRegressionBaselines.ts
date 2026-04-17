#!/usr/bin/env -S deno run --allow-read

/**
 * Verifies committed audit JSON under docs/recommender-v3-audit/generated/
 * matches docs/recommender-v3-audit/regression-baselines/expected-headlines.json.
 *
 * Run from TightLinesAI/: npm run audit:recommender:v3:regression-baselines
 */

export const EXPECTED_HEADLINES_REL = "docs/recommender-v3-audit/regression-baselines/expected-headlines.json";

export type ExpectedHeadlines = {
  matrix_summary: {
    path: string;
    total_scenarios: number;
    species: Record<
      string,
      { scenario_count: number; max_top1_tie_count: number }
    >;
  };
  daily_shift_audit: {
    path: string;
    total_pairs: number;
    total_checks: number;
    min_passed_checks: number;
  };
  coverage_audit: {
    path: string;
    require_all_success_targets_pass: boolean;
    require_expectation_mismatches_zero: boolean;
  };
};

/** Optional bundled audit JSON for callers that cannot use `Deno.readTextFile` (e.g. Deno tests without `--allow-read`). */
export type RegressionBaselineFixtures = {
  expected: ExpectedHeadlines;
  matrix: {
    species: Record<
      string,
      {
        scenario_count: number;
        top1_primary_hit_count: number;
        top3_primary_present_count: number;
        disallowed_avoidance_count: number;
        top_color_match_count: number;
        hard_fail_count: number;
        soft_fail_count: number;
        top1_tie_count: number;
      }
    >;
  };
  daily_shift: {
    total_pairs: number;
    total_checks: number;
    passed_checks: number;
    failed_checks: number;
  };
  coverage: {
    success_targets: unknown;
    lure: { expectation_mismatches: unknown[] };
    fly: { expectation_mismatches: unknown[] };
  };
};

function allTargetsPass(node: unknown): boolean {
  if (node && typeof node === "object" && "pass" in (node as object)) {
    return (node as { pass: boolean }).pass === true;
  }
  if (node && typeof node === "object" && !Array.isArray(node)) {
    return Object.values(node as Record<string, unknown>).every(allTargetsPass);
  }
  if (Array.isArray(node)) {
    return node.every(allTargetsPass);
  }
  return true;
}

/** Returns empty array when committed audit artifacts match the baseline file. */
export async function verifyRegressionBaselines(
  cwd: string,
  fixtures?: RegressionBaselineFixtures,
): Promise<string[]> {
  const expected = fixtures?.expected ??
    JSON.parse(
      await Deno.readTextFile(`${cwd}/${EXPECTED_HEADLINES_REL}`),
    ) as ExpectedHeadlines;

  const errors: string[] = [];

  const matrixPath = `${cwd}/${expected.matrix_summary.path}`;
  const matrix = (fixtures?.matrix ??
    JSON.parse(await Deno.readTextFile(matrixPath))) as {
    species: Record<
      string,
      {
        scenario_count: number;
        top1_primary_hit_count: number;
        top3_primary_present_count: number;
        disallowed_avoidance_count: number;
        top_color_match_count: number;
        hard_fail_count: number;
        soft_fail_count: number;
        top1_tie_count: number;
      }
    >;
  };

  let sum = 0;
  for (
    const [species, spec] of Object.entries(expected.matrix_summary.species)
  ) {
    const s = matrix.species[species];
    if (!s) {
      errors.push(`Matrix summary missing species key: ${species}`);
      continue;
    }
    sum += s.scenario_count;
    if (s.scenario_count !== spec.scenario_count) {
      errors.push(
        `${species}: scenario_count ${s.scenario_count} !== expected ${spec.scenario_count}`,
      );
    }
    if (s.top1_primary_hit_count !== s.scenario_count) {
      errors.push(
        `${species}: top1_primary_hit_count ${s.top1_primary_hit_count} !== scenario_count ${s.scenario_count}`,
      );
    }
    if (s.top3_primary_present_count !== s.scenario_count) {
      errors.push(
        `${species}: top3_primary_present_count ${s.top3_primary_present_count} !== scenario_count ${s.scenario_count}`,
      );
    }
    if (s.disallowed_avoidance_count !== s.scenario_count) {
      errors.push(
        `${species}: disallowed_avoidance_count ${s.disallowed_avoidance_count} !== scenario_count ${s.scenario_count}`,
      );
    }
    if (s.top_color_match_count !== s.scenario_count) {
      errors.push(
        `${species}: top_color_match_count ${s.top_color_match_count} !== scenario_count ${s.scenario_count}`,
      );
    }
    if (s.hard_fail_count !== 0 || s.soft_fail_count !== 0) {
      errors.push(
        `${species}: hard_fail_count=${s.hard_fail_count} soft_fail_count=${s.soft_fail_count} (expected 0/0)`,
      );
    }
    if (s.top1_tie_count > spec.max_top1_tie_count) {
      errors.push(
        `${species}: top1_tie_count ${s.top1_tie_count} exceeds cap ${spec.max_top1_tie_count}`,
      );
    }
  }
  if (sum !== expected.matrix_summary.total_scenarios) {
    errors.push(
      `Total scenarios ${sum} !== expected ${expected.matrix_summary.total_scenarios}`,
    );
  }

  const dsPath = `${cwd}/${expected.daily_shift_audit.path}`;
  const ds = (fixtures?.daily_shift ??
    JSON.parse(await Deno.readTextFile(dsPath))) as {
    total_pairs: number;
    total_checks: number;
    passed_checks: number;
    failed_checks: number;
  };
  if (ds.total_pairs !== expected.daily_shift_audit.total_pairs) {
    errors.push(
      `Daily shift total_pairs ${ds.total_pairs} !== ${expected.daily_shift_audit.total_pairs}`,
    );
  }
  if (ds.total_checks !== expected.daily_shift_audit.total_checks) {
    errors.push(
      `Daily shift total_checks ${ds.total_checks} !== ${expected.daily_shift_audit.total_checks}`,
    );
  }
  if (ds.passed_checks < expected.daily_shift_audit.min_passed_checks) {
    errors.push(
      `Daily shift passed_checks ${ds.passed_checks} < min ${expected.daily_shift_audit.min_passed_checks}`,
    );
  }
  if (ds.failed_checks > 0) {
    errors.push(`Daily shift failed_checks=${ds.failed_checks} (expected 0)`);
  }

  const covPath = `${cwd}/${expected.coverage_audit.path}`;
  const cov = (fixtures?.coverage ??
    JSON.parse(await Deno.readTextFile(covPath))) as {
    success_targets: unknown;
    lure: { expectation_mismatches: unknown[] };
    fly: { expectation_mismatches: unknown[] };
  };

  if (expected.coverage_audit.require_all_success_targets_pass) {
    if (!allTargetsPass(cov.success_targets)) {
      errors.push("Coverage audit: one or more success_targets.pass is false");
    }
  }
  if (expected.coverage_audit.require_expectation_mismatches_zero) {
    if (cov.lure.expectation_mismatches.length !== 0) {
      errors.push(
        `Coverage lure.expectation_mismatches length ${cov.lure.expectation_mismatches.length}`,
      );
    }
    if (cov.fly.expectation_mismatches.length !== 0) {
      errors.push(
        `Coverage fly.expectation_mismatches length ${cov.fly.expectation_mismatches.length}`,
      );
    }
  }

  return errors;
}

async function main() {
  const errors = await verifyRegressionBaselines(Deno.cwd());
  if (errors.length > 0) {
    console.error("Regression baseline verification failed:\n");
    for (const e of errors) console.error(`- ${e}`);
    Deno.exit(1);
  }
  console.log("Regression baselines OK (matrix headlines, daily-shift, coverage).");
}

if (import.meta.main) {
  await main();
}
