#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ACTIVE_FORMULA = "seasonal-opportunity-bounded-temperature-v2";
const COMPARATOR_FORMULA = "seasonal-ceiling-x-temperature-v1";
const ACTIVE_ENGINE = "pier-cast-simple-model-v0.8.0";
const ACTIVE_SEASONAL_CALIBRATION = "piercast-core-seasonal-v0.4.0";
const REPORT_PATH = new URL(
  "../docs/PierCast_Shadow_Validation_Evaluation.md",
  import.meta.url,
);

function requireEnvironment(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable ${name}.`);
  return value;
}

async function fetchAll(table, select = "*") {
  const baseUrl = requireEnvironment("SUPABASE_URL").replace(/\/$/, "");
  const serviceRoleKey = requireEnvironment("SUPABASE_SERVICE_ROLE_KEY");
  const pageSize = 1000;
  const rows = [];

  for (let from = 0; ; from += pageSize) {
    const response = await fetch(
      `${baseUrl}/rest/v1/${table}?select=${encodeURIComponent(select)}`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Range: `${from}-${from + pageSize - 1}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(
        `${table} query failed (${response.status}): ${await response.text()}`,
      );
    }
    const page = await response.json();
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}

function mean(values) {
  return values.length === 0
    ? null
    : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function format(value, digits = 3) {
  return value == null || !Number.isFinite(value)
    ? "n/a"
    : value.toFixed(digits);
}

function ratingLabel(displayScore) {
  if (displayScore <= 2) return "Poor";
  if (displayScore <= 4) return "Limited";
  if (displayScore <= 6) return "Fair";
  if (displayScore <= 8) return "Good";
  return "Excellent";
}

function bandCounts(rows) {
  const counts = { Poor: 0, Limited: 0, Fair: 0, Good: 0, Excellent: 0 };
  for (const row of rows) counts[ratingLabel(Number(row.display_score))] += 1;
  return counts;
}

function forecastKey(row) {
  return [row.city_id, row.species_id, row.local_date, row.lead_day].join("|");
}

function localDateAt(isoTimestamp, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(isoTimestamp));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function cityTimeZone(cityId) {
  return cityId === "sheboygan_wi" ? "America/Chicago" : "America/Detroit";
}

function calculateAuc(rows, scoreKey) {
  const positives = rows.filter((row) => row.result === "positive");
  const negatives = rows.filter((row) => row.result === "zero_catch");
  if (positives.length === 0 || negatives.length === 0) return null;
  let concordance = 0;
  for (const positive of positives) {
    for (const negative of negatives) {
      const delta = positive[scoreKey] - negative[scoreKey];
      concordance += delta > 0 ? 1 : delta === 0 ? 0.5 : 0;
    }
  }
  return concordance / (positives.length * negatives.length);
}

function selectPrimaryOutcomeRows(pairs) {
  const eligible = [];
  for (const row of pairs) {
    if (
      row.assessment_status !== "assessable" ||
      !["positive", "zero_catch"].includes(row.result) ||
      !["direct_effort", "verified_quantitative"].includes(row.evidence_quality) ||
      row.engine_version !== ACTIVE_ENGINE ||
      row.seasonal_calibration_version !== ACTIVE_SEASONAL_CALIBRATION ||
      Number(row.effort_minutes) <= 0 ||
      Number(row.lead_day) !== 1 ||
      localDateAt(row.generated_at, cityTimeZone(row.city_id)) >= row.local_date
    ) continue;
    eligible.push(row);
  }

  const activeByOutcome = new Map();
  const comparatorByIssue = new Map();
  for (const row of eligible) {
    if (row.formula_version === ACTIVE_FORMULA) {
      const previous = activeByOutcome.get(row.outcome_id);
      if (!previous || row.generated_at > previous.generated_at) {
        activeByOutcome.set(row.outcome_id, row);
      }
    }
    if (row.formula_version === COMPARATOR_FORMULA) {
      comparatorByIssue.set(
        `${row.outcome_id}|${row.generated_at}|${row.source_issued_at}`,
        row,
      );
    }
  }

  return [...activeByOutcome.values()]
    .map((active) => ({
      active,
      comparator: comparatorByIssue.get(
        `${active.outcome_id}|${active.generated_at}|${active.source_issued_at}`,
      ),
    }))
    .filter(({ comparator }) => comparator)
    .map(({ active, comparator }) => ({
      outcomeId: active.outcome_id,
      cityId: active.city_id,
      speciesId: active.species_id,
      localDate: active.local_date,
      result: active.result,
      effortMinutes: Number(active.effort_minutes),
      catchCount: Number(active.catch_count),
      v2Score: Number(active.score),
      v1Score: Number(comparator.score),
      seasonalScore: Number(active.seasonal_rating),
    }));
}

function formulaSurfaceAudit() {
  let monotonicPresenceViolations = 0;
  let monotonicTemperatureViolations = 0;
  let belowComparatorViolations = 0;
  let previousTemperatureRow = null;

  for (let temperatureStep = 0; temperatureStep <= 100; temperatureStep += 1) {
    const temperature = temperatureStep / 100;
    const row = [];
    let previousScore = null;
    for (let presenceStep = 10; presenceStep <= 100; presenceStep += 1) {
      const presence = presenceStep / 10;
      const v1 = 1 + (presence - 1) * temperature;
      const v2 = Math.min(10, 1 + (presence - 1) * (0.3 + 0.75 * temperature));
      if (previousScore != null && v2 < previousScore) monotonicPresenceViolations += 1;
      if (previousTemperatureRow && v2 < previousTemperatureRow[row.length]) {
        monotonicTemperatureViolations += 1;
      }
      if (v2 < v1) belowComparatorViolations += 1;
      previousScore = v2;
      row.push(v2);
    }
    previousTemperatureRow = row;
  }

  return {
    monotonicPresenceViolations,
    monotonicTemperatureViolations,
    belowComparatorViolations,
    minimumOpportunityRetention: 0.3,
    synergyBeginsAtSuitability: (1 - 0.3) / 0.75,
    maximumOpportunityAmplification: 1.05,
    perfectTemperatureCeilings: [2, 4, 6, 8, 10].map((presence) => ({
      presence,
      score: Math.min(10, 1 + (presence - 1) * 1.05),
    })),
  };
}

function tableBandRow(label, counts) {
  return `| ${label} | ${counts.Poor} | ${counts.Limited} | ${counts.Fair} | ${counts.Good} | ${counts.Excellent} |`;
}

function buildReport({ runs, forecasts, outcomes, validationPairs }) {
  const activeRuns = runs
    .filter((run) =>
      run.formula_version === ACTIVE_FORMULA &&
      run.engine_version === ACTIVE_ENGINE &&
      run.seasonal_calibration_version === ACTIVE_SEASONAL_CALIBRATION
    )
    .sort((a, b) => b.generated_at.localeCompare(a.generated_at));
  const activeRun = activeRuns[0] ?? null;
  const comparatorRun = activeRun
    ? runs.find((run) =>
      run.formula_version === COMPARATOR_FORMULA &&
      run.engine_version === ACTIVE_ENGINE &&
      run.seasonal_calibration_version === ACTIVE_SEASONAL_CALIBRATION &&
      run.generated_at === activeRun.generated_at &&
      run.source_issued_at === activeRun.source_issued_at
    )
    : null;
  const activeForecasts = activeRun
    ? forecasts.filter((row) => row.run_id === activeRun.run_id)
    : [];
  const comparatorForecasts = comparatorRun
    ? forecasts.filter((row) => row.run_id === comparatorRun.run_id)
    : [];
  const comparatorByKey = new Map(
    comparatorForecasts.map((row) => [forecastKey(row), row]),
  );
  const matched = activeForecasts
    .map((active) => ({ active, comparator: comparatorByKey.get(forecastKey(active)) }))
    .filter(({ comparator }) => comparator);
  const deltas = matched.map(({ active, comparator }) =>
    Number(active.score) - Number(comparator.score)
  );
  const transitions = new Map();
  for (const { active, comparator } of matched) {
    const transition = `${ratingLabel(Number(comparator.display_score))} → ${ratingLabel(Number(active.display_score))}`;
    transitions.set(transition, (transitions.get(transition) ?? 0) + 1);
  }

  const primary = selectPrimaryOutcomeRows(validationPairs);
  const positives = primary.filter((row) => row.result === "positive").length;
  const zeroCatches = primary.filter((row) => row.result === "zero_catch").length;
  const surface = formulaSurfaceAudit();
  const outcomeStatus = primary.length === 0
    ? "INSUFFICIENT DATA — no eligible paired lead-day-1 outcomes"
    : positives === 0 || zeroCatches === 0
    ? "INSUFFICIENT DATA — both positives and effort-backed zero catches are required"
    : primary.length < 200
    ? "PILOT ONLY — below the preregistered confirmatory sample"
    : "ELIGIBLE FOR FULL CONFIRMATORY ANALYSIS (other balance gates still apply)";
  const activeScores = activeForecasts.map((row) => Number(row.score));
  const comparatorScores = comparatorForecasts.map((row) => Number(row.score));
  const activeBands = bandCounts(activeForecasts);
  const comparatorBands = bandCounts(comparatorForecasts);

  return `# PierCast Shadow Validation Evaluation

**Generated:** ${new Date().toISOString()}<br>
**Outcome conclusion:** ${outcomeStatus}<br>
**Protocol:** \`PierCast_Prospective_Evaluation_Protocol_v2.md\`

## Live ledger

| Record | Count |
|---|---:|
| Forecast runs | ${runs.length} |
| Archived forecasts | ${forecasts.length} |
| Recorded outcomes | ${outcomes.length} |
| Eligible paired lead-day-1 outcomes | ${primary.length} |
| Positive outcomes in primary cohort | ${positives} |
| Effort-backed zero catches in primary cohort | ${zeroCatches} |

Real-world ranking usefulness cannot be estimated until eligible outcomes exist. AUC, uncertainty, catch-per-effort association, and false-high rates are therefore **not available**, not zero.

## Same-issue production snapshot

Active run: \`${activeRun?.run_id ?? "unavailable"}\`<br>
Comparator run: \`${comparatorRun?.run_id ?? "unavailable"}\`<br>
Paired city × species × date × lead forecasts: **${matched.length}**

| Formula | Minimum | Mean | Maximum |
|---|---:|---:|---:|
| v1 direct multiplier | ${format(Math.min(...comparatorScores))} | ${format(mean(comparatorScores))} | ${format(Math.max(...comparatorScores))} |
| v2 bounded temperature | ${format(Math.min(...activeScores))} | ${format(mean(activeScores))} | ${format(Math.max(...activeScores))} |

| Formula | Poor | Limited | Fair | Good | Excellent |
|---|---:|---:|---:|---:|---:|
${tableBandRow("v1", comparatorBands)}
${tableBandRow("v2", activeBands)}

Paired v2 − v1 score change: minimum **${format(Math.min(...deltas))}**, mean **${format(mean(deltas))}**, maximum **${format(Math.max(...deltas))}**.

Band transitions: ${[...transitions.entries()].sort().map(([key, count]) => `${key}: ${count}`).join("; ") || "none"}.

These are behavior and calibration-distribution checks. They do not establish that v2 predicts catches better.

## Formula guardrails

The exhaustive 0.01-temperature × 0.1-seasonal grid found:

- seasonal monotonicity violations: **${surface.monotonicPresenceViolations}**;
- temperature monotonicity violations: **${surface.monotonicTemperatureViolations}**;
- cells where v2 falls below v1: **${surface.belowComparatorViolations}**;
- minimum retained seasonally supported opportunity above the 1.0 floor: **${format(surface.minimumOpportunityRetention * 100, 0)}%**;
- temperature synergy begins only above suitability **${format(surface.synergyBeginsAtSuitability)}**; and
- maximum amplification of opportunity above the 1.0 floor: **${format(surface.maximumOpportunityAmplification)}×**.

At perfect temperature suitability, seasonal ratings 2, 4, 6, 8, and 10 can produce at most ${surface.perfectTemperatureCeilings.map(({ score }) => format(score, 2)).join(", ")}, respectively. This prevents temperature alone from manufacturing a high rating where configured seasonal opportunity is low.

## Prospective metrics

| Predictor | Lead-day-1 AUC |
|---|---:|
| v2 bounded-temperature score | ${format(calculateAuc(primary, "v2Score"))} |
| v1 direct-multiplier score | ${format(calculateAuc(primary, "v1Score"))} |
| seasonal-only rating | ${format(calculateAuc(primary, "seasonalScore"))} |

No formula tuning should be made from this empty outcome cohort. The frozen first checkpoint remains 50 eligible outcomes for data-quality review only; confirmatory evaluation remains at least 200 eligible outcomes with the preregistered balance requirements.
`;
}

export async function evaluate() {
  const [runs, forecasts, outcomes, validationPairs] = await Promise.all([
    fetchAll("pier_cast_shadow_forecast_runs"),
    fetchAll("pier_cast_shadow_forecasts"),
    fetchAll("pier_cast_shadow_outcomes"),
    fetchAll("pier_cast_shadow_validation_pairs"),
  ]);
  return buildReport({ runs, forecasts, outcomes, validationPairs });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const report = await evaluate();
  if (process.argv.includes("--write")) {
    await writeFile(REPORT_PATH, report, "utf8");
    console.log(`Wrote ${fileURLToPath(REPORT_PATH)}`);
  } else {
    console.log(report);
  }
}
