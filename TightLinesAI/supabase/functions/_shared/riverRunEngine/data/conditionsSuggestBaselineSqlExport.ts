import type { RiverRunConditionsSuggestBaseline } from "../storage/types.ts";

export function conditionsSuggestBaselineRowsToUpsertSql(
  rows: RiverRunConditionsSuggestBaseline[],
): string {
  if (rows.length === 0) return "-- No Conditions Suggest baseline rows.";
  const values = rows.map((row) =>
    [
      "  (",
      [
        sqlText(row.riverId),
        sqlText(row.runId),
        sqlText(row.checkpointId),
        String(row.referenceDayOfYear),
        String(row.observationStartDayOfYear),
        sqlText(row.baselineVersion),
        sqlText(row.gaugeMetric),
        sqlText(row.gaugeSiteId),
        sqlText(row.temperatureSourceId),
        sqlJson(row.componentSamples),
        sqlJson(row.historicalSamples),
        sqlJson(row.indexPercentiles),
        String(row.distinctYears),
        String(row.expectedDays),
        String(row.minimumUsableDays),
        sqlText(row.sourceNotes ?? ""),
      ].join(", "),
      ")",
    ].join("")
  ).join(",\n");
  return [
    "insert into public.river_run_conditions_suggest_baselines",
    "  (river_id, run_id, checkpoint_id, reference_day_of_year, observation_start_day_of_year, baseline_version, gauge_metric, gauge_site_id, temperature_source_id, component_samples, historical_samples, index_percentiles, distinct_years, expected_days, minimum_usable_days, source_notes)",
    "values",
    values,
    "on conflict (river_id, run_id, checkpoint_id, baseline_version)",
    "do update set",
    "  gauge_metric = excluded.gauge_metric,",
    "  gauge_site_id = excluded.gauge_site_id,",
    "  temperature_source_id = excluded.temperature_source_id,",
    "  component_samples = excluded.component_samples,",
    "  historical_samples = excluded.historical_samples,",
    "  index_percentiles = excluded.index_percentiles,",
    "  distinct_years = excluded.distinct_years,",
    "  reference_day_of_year = excluded.reference_day_of_year,",
    "  observation_start_day_of_year = excluded.observation_start_day_of_year,",
    "  expected_days = excluded.expected_days,",
    "  minimum_usable_days = excluded.minimum_usable_days,",
    "  source_notes = excluded.source_notes;",
  ].join("\n");
}

function sqlText(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

function sqlJson(value: unknown): string {
  return `${sqlText(JSON.stringify(value))}::jsonb`;
}
