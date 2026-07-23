import { assert, assertEquals } from "jsr:@std/assert";
import {
  baselineRowsToUpsertSql,
  canonicalBaselineDay,
  canonicalBaselineDayCandidates,
  collapseObservationsToDailyMedians,
  generateGaugeBaselineRows,
  type NormalizedBaselineObservation,
} from "../index.ts";

Deno.test("canonical baseline day handles normal dates and leap-year dates after Feb 29", () => {
  assertEquals(canonicalBaselineDay("2026-01-01"), 1);
  assertEquals(canonicalBaselineDay("2026-02-28"), 59);
  assertEquals(canonicalBaselineDay("2026-03-01"), 60);
  assertEquals(canonicalBaselineDay("2024-03-01"), 60);
  assertEquals(canonicalBaselineDay("2024-12-31"), 365);
});

Deno.test("Feb 29 uses adjacent canonical baseline day candidates", () => {
  assertEquals(canonicalBaselineDayCandidates("2024-02-29"), [59, 60]);
});

Deno.test("baseline generation collapses multiple same-date observations to median", () => {
  const collapsed = collapseObservationsToDailyMedians([
    observation("2024-09-20", 100),
    observation("2024-09-20", 300),
    observation("2024-09-20", 500),
  ]);

  assertEquals(collapsed.length, 1);
  assertEquals(collapsed[0].value, 300);
});

Deno.test("baseline generation emits percentiles with sufficient rolling-window history", () => {
  const rows = generateGaugeBaselineRows({
    riverId: "pere_marquette",
    metric: "flow_cfs",
    baselineVersion: "test-baseline",
    observations: [
      ...windowObservations(2024, 59, 15, 100),
      ...windowObservations(2025, 59, 15, 200),
    ],
  });
  const feb28 = rows.find((row) => row.dayOfYear === 59);

  assert(feb28);
  assertEquals(feb28.distinctYears, 2);
  assertEquals(feb28.sampleCount, 30);
  assertEquals(Object.keys(feb28.percentiles), [
    "p10",
    "p25",
    "p40",
    "p65",
    "p85",
    "p90",
  ]);
});

Deno.test("baseline generation skips days with insufficient history", () => {
  const rows = generateGaugeBaselineRows({
    riverId: "pere_marquette",
    metric: "flow_cfs",
    baselineVersion: "test-baseline",
    observations: windowObservations(2025, 200, 25, 100),
  });

  assertEquals(rows.length, 0);
});

Deno.test("baseline generation does not require or emit separate Feb 29 baseline", () => {
  const rows = generateGaugeBaselineRows({
    riverId: "pere_marquette",
    metric: "flow_cfs",
    baselineVersion: "test-baseline",
    observations: [
      observation("2024-02-29", 150),
      ...windowObservations(2024, 59, 14, 100),
      ...windowObservations(2025, 59, 15, 200),
    ],
  });

  assertEquals(rows.some((row) => row.dayOfYear === 366), false);
  assert(rows.some((row) => row.dayOfYear === 59));
  assert(rows.some((row) => row.dayOfYear === 60));
});

Deno.test("baseline SQL export uses idempotent gauge-baseline upsert", () => {
  const sql = baselineRowsToUpsertSql([{
    riverId: "pere_marquette",
    metric: "flow_cfs",
    dayOfYear: 264,
    baselineVersion: "pm-launch-audit",
    percentiles: { p10: 1, p25: 2, p40: 3, p65: 4, p85: 5, p90: 6 },
    bandData: { method: "rolling_percentile" },
    sampleCount: 31,
    distinctYears: 3,
    windowDays: 14,
    sourceNotes: "dry-run only",
  }]);

  assert(sql.includes("insert into public.river_run_gauge_baselines"));
  assert(
    sql.includes(
      "on conflict (river_id, metric, day_of_year, baseline_version) do update set",
    ),
  );
  assert(sql.includes("'pere_marquette'"));
  assert(sql.includes("'flow_cfs'"));
  assert(sql.includes("'pm-launch-audit'"));
  assert(sql.includes("'dry-run only'"));
});

function observation(
  localDate: string,
  value: number,
): NormalizedBaselineObservation {
  return {
    riverId: "pere_marquette",
    metric: "flow_cfs",
    localDate,
    value,
  };
}

function windowObservations(
  year: number,
  centerDay: number,
  count: number,
  startValue: number,
): NormalizedBaselineObservation[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(year, 0, centerDay - 7 + index));
    return observation(
      date.toISOString().slice(0, 10),
      startValue + index,
    );
  });
}
