import { assert, assertEquals } from "jsr:@std/assert";
import { scoreDay } from "../score/scoreDay.ts";
import type { SharedNormalizedOutput } from "../contracts/mod.ts";
const evidence = JSON.parse(
  Deno.readTextFileSync(
    new URL(
      "../../../../../docs/audits/todays-bite-pass3/brownsville-diagnosis.json",
      import.meta.url,
    ),
  ),
);
Deno.test("captured Brownsville calendar boundary keeps the Prime corroboration safeguard without a score cliff", () => {
  const trace = evidence.trace[0];
  const scores = ["before", "after"].map((side) =>
    scoreDay(trace[side].normalized, { timingStrength: "strong" }).score
  );
  assert(Math.abs(scores[1] - scores[0]) <= 1, JSON.stringify(scores));
  assert(
    scores.every((score) => score <= 79),
    "Temperature-dominated fixture should retain the safeguard",
  );
});
Deno.test("Prime corroboration transitions remain continuous across nearby thermal values", () => {
  const baseline = evidence.trace[0].before
    .normalized as SharedNormalizedOutput;
  for (const date of ["2026-02-28", "2026-03-01"]) {
    let previous: number | undefined;
    for (let i = 1300; i <= 2000; i++) {
      const norm = structuredClone(baseline);
      norm.location.local_date = date;
      norm.normalized.temperature!.final_score = i / 1000;
      const score = scoreDay(norm, { timingStrength: "strong" }).score;
      if (previous !== undefined) {
        assert(
          Math.abs(score - previous) <= 1,
          `${date}/${i}: ${previous}->${score}`,
        );
      }
      assert(score >= 0 && score <= 100);
      previous = score;
    }
  }
});
