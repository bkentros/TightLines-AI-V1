#!/usr/bin/env node

import { writeFile } from "node:fs/promises";

const V3_FORMULA = "piercast-opportunity-modes-bounded-temperature-v3";
const V2_FORMULA = "seasonal-opportunity-bounded-temperature-v2";
const REPORT_PATH = new URL(
  "../docs/onboarding/piercast/scoring-v3-pass2/PROSPECTIVE_EVALUATION.md",
  import.meta.url,
);
const write = process.argv.includes("--write");

const [v3Pairs, legacyPairs] = await Promise.all([
  fetchAll("pier_cast_v3_shadow_validation_pairs"),
  fetchAll("pier_cast_shadow_validation_pairs"),
]);
const v3 = selectPrimary(v3Pairs, V3_FORMULA, false);
const v2 = selectPrimary(legacyPairs, V2_FORMULA, true);
const v2ByOutcome = new Map(
  v2.map((row) => [`${row.outcome_id}|${row.source_issued_at}`, row]),
);
const matched = v3.flatMap((row) => {
  const baseline = v2ByOutcome.get(
    `${row.outcome_id}|${row.source_issued_at}`,
  );
  return baseline ? [{ ...row, v2_score: Number(baseline.score) }] : [];
});
const result = {
  generatedAt: new Date().toISOString(),
  cohort: {
    v3EligibleOutcomes: v3.length,
    matchedV2Outcomes: matched.length,
    positive: v3.filter((row) => row.result === "positive").length,
    effortBackedZeroCatch: v3.filter((row) => row.result === "zero_catch").length,
    cities: new Set(v3.map((row) => row.city_id)).size,
    species: new Set(v3.map((row) => row.species_id)).size,
  },
  v3: discrimination(v3, "score"),
  matchedComparison: {
    v3: discrimination(matched, "score"),
    v2: discrimination(matched, "v2_score"),
  },
};
const eligible = result.cohort.v3EligibleOutcomes >= 200 &&
  result.cohort.positive >= 40 && result.cohort.effortBackedZeroCatch >= 40 &&
  result.cohort.cities === 9 && result.cohort.species === 4;
const report = `# Formula v3 prospective evaluation

**Generated:** ${result.generatedAt}
**Decision state:** ${eligible ? "eligible for specialist interpretation; not automatically promotable" : "insufficient prospective evidence"}

This report treats the FinFindr rating as an ordinal opportunity score, not a catch probability. AUC measures ranking discrimination only. It does not calibrate catch probability, erase access/weather limitations, or independently authorize promotion.

## Frozen eligible cohort

| Measure | Count |
|---|---:|
| V3 effort-aware outcomes | ${result.cohort.v3EligibleOutcomes} |
| Same-outcome, same-issue v2 comparisons | ${result.cohort.matchedV2Outcomes} |
| Positive outcomes | ${result.cohort.positive} |
| Effort-backed zero catches | ${result.cohort.effortBackedZeroCatch} |
| Cities represented | ${result.cohort.cities}/9 |
| Species represented | ${result.cohort.species}/4 |

Only assessable lead-day-1 outcomes with positive effort, quantitative/direct evidence, and a forecast generated before the fishing date enter this primary cohort. The latest eligible forecast per outcome is selected deterministically.

## Ordinal discrimination

| Cohort | AUC | Mean positive score | Mean zero-catch score | Separation |
|---|---:|---:|---:|---:|
| V3 all eligible | ${format(result.v3.auc)} | ${format(result.v3.meanPositive)} | ${format(result.v3.meanNegative)} | ${format(result.v3.meanSeparation)} |
| V3 matched to v2 | ${format(result.matchedComparison.v3.auc)} | ${format(result.matchedComparison.v3.meanPositive)} | ${format(result.matchedComparison.v3.meanNegative)} | ${format(result.matchedComparison.v3.meanSeparation)} |
| V2 matched baseline | ${format(result.matchedComparison.v2.auc)} | ${format(result.matchedComparison.v2.meanPositive)} | ${format(result.matchedComparison.v2.meanNegative)} | ${format(result.matchedComparison.v2.meanSeparation)} |

## Promotion interpretation

The preregistered minimum coverage gate used by this tool is 200 eligible outcomes, at least 40 positives, at least 40 effort-backed zero catches, and representation from all 9 cities and all 4 species. Passing that sample gate only permits specialist interpretation. It does not replace source review, LMHOFS representation validation, uncertainty analysis, subgroup review, or explicit owner approval.

Raw machine summary:

\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\`
`;

if (write) await writeFile(REPORT_PATH, report);
else console.log(report);

async function fetchAll(table) {
  const base = required("SUPABASE_URL").replace(/\/$/, "");
  const key = required("SUPABASE_SERVICE_ROLE_KEY");
  const rows = [];
  for (let start = 0; ; start += 1000) {
    const response = await fetch(`${base}/rest/v1/${table}?select=*`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Range: `${start}-${start + 999}`,
      },
    });
    if (!response.ok) throw new Error(`${table} query failed (${response.status}).`);
    const page = await response.json();
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
}

function selectPrimary(rows, formula, groupByIssue) {
  const selected = new Map();
  for (const row of rows) {
    if (
      row.formula_version !== formula || Number(row.lead_day) !== 1 ||
      row.assessment_status !== "assessable" ||
      !["positive", "zero_catch"].includes(row.result) ||
      !["direct_effort", "verified_quantitative"].includes(row.evidence_quality) ||
      Number(row.effort_minutes) <= 0 ||
      localDateAt(row.generated_at, cityTimeZone(row.city_id)) >= row.local_date ||
      !Number.isFinite(Number(row.score))
    ) continue;
    const key = groupByIssue
      ? `${row.outcome_id}|${row.source_issued_at}`
      : row.outcome_id;
    const prior = selected.get(key);
    if (!prior || row.generated_at > prior.generated_at) selected.set(key, row);
  }
  return [...selected.values()];
}

function discrimination(rows, key) {
  const positive = rows.filter((row) => row.result === "positive");
  const negative = rows.filter((row) => row.result === "zero_catch");
  const meanPositive = mean(positive.map((row) => Number(row[key])));
  const meanNegative = mean(negative.map((row) => Number(row[key])));
  let concordance = 0;
  for (const yes of positive) for (const no of negative) {
    const difference = Number(yes[key]) - Number(no[key]);
    concordance += difference > 0 ? 1 : difference === 0 ? 0.5 : 0;
  }
  return {
    auc: positive.length && negative.length
      ? concordance / (positive.length * negative.length)
      : null,
    meanPositive,
    meanNegative,
    meanSeparation: meanPositive === null || meanNegative === null
      ? null
      : meanPositive - meanNegative,
  };
}

function localDateAt(value, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.map(({ type, value: item }) => [type, item]));
  return `${values.year}-${values.month}-${values.day}`;
}

function cityTimeZone(cityId) {
  return cityId.endsWith("_wi") ? "America/Chicago" : "America/Detroit";
}

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function format(value) {
  return value === null ? "n/a" : value.toFixed(3);
}

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable ${name}.`);
  return value;
}
