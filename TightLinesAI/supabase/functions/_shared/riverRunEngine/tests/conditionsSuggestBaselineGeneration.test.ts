import { assert, assertEquals } from "jsr:@std/assert";
import {
  addDays,
  conditionsSuggestBaselineRowsToUpsertSql,
  daysBetween,
  generateConditionsSuggestBaselineRows,
  type NormalizedBaselineObservation,
  type NormalizedTemperatureBaselineObservation,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  resolveConditionsSuggestCheckpoints,
  summarizeConditionsSuggestHistoricalReplay,
} from "../index.ts";

const run = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;
const checkpoints = resolveConditionsSuggestCheckpoints(run, "2026-09-20");
const checkpointDefinitions = checkpoints.map((checkpoint) => ({
  checkpointId: checkpoint.checkpointId,
  observationStartMonthDay: checkpoint.observationStartDate.slice(5),
  checkpointMonthDay: checkpoint.checkpointDate.slice(5),
}));

function historicalFixture(years = [2021, 2022, 2023, 2024, 2025]) {
  const gaugeObservations: NormalizedBaselineObservation[] = [];
  const temperatureObservations: NormalizedTemperatureBaselineObservation[] =
    [];
  for (const [yearIndex, year] of years.entries()) {
    const startDate = `${year}-07-28`;
    const endDate = `${year}-09-25`;
    const count = daysBetween(startDate, endDate) + 1;
    for (let index = 0; index < count; index++) {
      const localDate = addDays(startDate, index);
      gaugeObservations.push({
        riverId: "pere_marquette",
        metric: "flow_cfs",
        localDate,
        value: 500 + yearIndex * 20 + index * yearIndex * 5,
      });
      temperatureObservations.push({
        sourceId: "pm_m37_temperature",
        localDate,
        waterTempF: 68 - yearIndex - index * yearIndex * 0.08,
      });
    }
  }
  return { gaugeObservations, temperatureObservations };
}

function generate(
  fixture = historicalFixture(),
) {
  return generateConditionsSuggestBaselineRows({
    ...fixture,
    riverId: "pere_marquette",
    runId: "pere_marquette_fall_chinook",
    gaugeMetric: "flow_cfs",
    gaugeSiteId: "04122500",
    temperatureSourceId: "pm_m37_temperature",
    baselineVersion: "conditions-v2",
    checkpoints: checkpointDefinitions,
    minimumCoveragePercent: 0.8,
    minimumUsableYears: 5,
    coolEnoughPercentileCap: 75,
    tooWarmF: 68,
    sourceNotes: "Fixture.",
  });
}

Deno.test("Conditions Suggest generator builds four cumulative checkpoints", () => {
  const rows = generate();

  assertEquals(rows.length, 4);
  assertEquals(
    rows.map((row) => ({
      checkpointId: row.checkpointId,
      expectedDays: row.expectedDays,
      minimumUsableDays: row.minimumUsableDays,
    })),
    [
      {
        checkpointId: "river_start",
        expectedDays: 18,
        minimumUsableDays: 15,
      },
      {
        checkpointId: "building_start",
        expectedDays: 27,
        minimumUsableDays: 22,
      },
      {
        checkpointId: "peak_start",
        expectedDays: 49,
        minimumUsableDays: 40,
      },
      {
        checkpointId: "peak_complete",
        expectedDays: 60,
        minimumUsableDays: 48,
      },
    ],
  );
  for (const row of rows) {
    assertEquals(row.distinctYears, 5);
    assertEquals(row.historicalSamples.length, 5);
    assert(Number.isFinite(row.indexPercentiles.p25));
    assert(Number.isFinite(row.indexPercentiles.p75));
  }
});

Deno.test("Conditions Suggest generator fails closed below five usable years", () => {
  const rows = generate(historicalFixture([2022, 2023, 2024, 2025]));
  assertEquals(rows, []);
});

Deno.test("Conditions Suggest baseline cannot mix a fallback temperature source", () => {
  const fixture = historicalFixture();
  const rows = generate({
    gaugeObservations: fixture.gaugeObservations,
    temperatureObservations: fixture.temperatureObservations.map((item) => ({
      ...item,
      sourceId: "pm_bowman_temperature",
    })),
  });
  assertEquals(rows, []);
});

Deno.test("Conditions Suggest cumulative SQL export is idempotent", () => {
  const sql = conditionsSuggestBaselineRowsToUpsertSql(generate());

  assert(sql.includes("river_run_conditions_suggest_baselines"));
  assert(sql.includes("checkpoint_id"));
  assert(sql.includes("expected_days"));
  assert(
    sql.includes(
      "on conflict (river_id, run_id, checkpoint_id, baseline_version)",
    ),
  );
});

Deno.test("Conditions Suggest checkpoint replay preserves transition gates", () => {
  const replay = summarizeConditionsSuggestHistoricalReplay({
    rows: generate(),
    run,
  });

  assertEquals(replay.sampleCount, 20);
  assertEquals(replay.distinctYears, 5);
  assertEquals(
    Object.values(replay.finalLabelCounts).reduce(
      (sum, count) => sum + count,
      0,
    ),
    20,
  );
  assertEquals(replay.candidateAgreementViolationCount, 0);
});
