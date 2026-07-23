import type { RiverRunGaugeBaseline } from "../storage/types.ts";

export function baselineRowsToUpsertSql(
  rows: readonly RiverRunGaugeBaseline[],
): string {
  if (rows.length === 0) return "";
  const values = rows.map((row) =>
    `(${
      [
        sqlString(row.riverId),
        sqlString(row.metric),
        row.dayOfYear,
        sqlString(row.baselineVersion),
        sqlJson(row.percentiles),
        sqlJson(row.bandData),
        row.sampleCount,
        row.distinctYears,
        row.windowDays,
        row.sourceNotes == null ? "null" : sqlString(row.sourceNotes),
      ].join(", ")
    })`
  );
  return [
    "insert into public.river_run_gauge_baselines",
    "  (river_id, metric, day_of_year, baseline_version, percentiles, band_data, sample_count, distinct_years, window_days, source_notes)",
    `values\n  ${values.join(",\n  ")}`,
    "on conflict (river_id, metric, day_of_year, baseline_version) do update set",
    "  percentiles = excluded.percentiles,",
    "  band_data = excluded.band_data,",
    "  sample_count = excluded.sample_count,",
    "  distinct_years = excluded.distinct_years,",
    "  window_days = excluded.window_days,",
    "  source_notes = excluded.source_notes;",
  ].join("\n");
}

function sqlJson(value: unknown): string {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function sqlString(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}
