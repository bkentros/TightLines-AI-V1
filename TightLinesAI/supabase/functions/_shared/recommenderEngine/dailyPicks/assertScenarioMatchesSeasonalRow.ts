import type { SeasonalRowV4 } from "../v4/contracts.ts";
import type { DailyScenario } from "./buildDailyScenario.ts";

export function assertScenarioMatchesSeasonalRow(args: {
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): void {
  const { row, scenario } = args;
  const mismatches: string[] = [];

  if (row.species !== scenario.species) {
    mismatches.push(`species row=${row.species} scenario=${scenario.species}`);
  }
  if (row.region_key !== scenario.region_key) {
    mismatches.push(
      `region_key row=${row.region_key} scenario=${scenario.region_key}`,
    );
  }
  if (row.month !== scenario.month) {
    mismatches.push(`month row=${row.month} scenario=${scenario.month}`);
  }
  if (row.water_type !== scenario.water_type) {
    mismatches.push(
      `water_type row=${row.water_type} scenario=${scenario.water_type}`,
    );
  }

  if (mismatches.length > 0) {
    throw new Error(
      `daily picks row/scenario mismatch: ${mismatches.join("; ")}`,
    );
  }
}
