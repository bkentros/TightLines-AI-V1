#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

import {
  type ArchiveAuditScenario,
  buildArchiveAuditScenarios,
  DEFAULT_ARCHIVE_MONTHS,
} from "./archiveScenarios.ts";
import { fetchArchiveWeather } from "./lib/fetchArchiveWeather.ts";
import { fetchNOAATides } from "./lib/fetchNOAATides.ts";
import { fetchSunriseSunset } from "./lib/fetchSunriseSunset.ts";
import { fetchUSNOMoon } from "./lib/fetchUSNOMoon.ts";
import { mapArchiveToEnvData } from "./lib/mapArchiveToEnvData.ts";
import { buildSharedEngineRequestFromEnvData } from "../../supabase/functions/_shared/howFishingEngine/request/buildFromEnvData.ts";
import { runHowFishingReport } from "../../supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts";
import type {
  HowsFishingReport,
  SharedEngineRequest,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";

type ScenarioAuditRow = {
  scenario: ArchiveAuditScenario;
  request: SharedEngineRequest;
  report: HowsFishingReport;
  env_data: Record<string, unknown>;
  raw_sources: {
    archive_weather: unknown;
    sunrise_sunset: unknown | null;
    usno_moon: unknown | null;
    noaa_tides: unknown | null;
  };
  archive_summary: {
    timezone: string;
    noon_air_temp_f: number | null;
    daily_high_air_temp_f: number | null;
    daily_low_air_temp_f: number | null;
    daily_precip_in: number | null;
    daily_wind_max_mph: number | null;
    moon_phase: string | null;
    tide_phase: string | null;
    tide_event_count: number;
  };
  flags: string[];
};

type SkippedScenario = {
  scenario: ArchiveAuditScenario;
  reason: string;
};

function parseMonths(args: string[]): number[] {
  const arg = args.find((value) => value.startsWith("--months="));
  if (!arg) return [...DEFAULT_ARCHIVE_MONTHS];
  const months = arg
    .slice("--months=".length)
    .split(",")
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isFinite(value) && value >= 1 && value <= 12);
  if (months.length === 0) {
    throw new Error(
      "Expected --months=3,4,5,6,7,8 with at least one valid month.",
    );
  }
  return [...new Set(months)].sort((a, b) => a - b);
}

function parseIds(args: string[]): Set<string> | null {
  const arg = args.find((value) => value.startsWith("--ids="));
  if (!arg) return null;
  const ids = arg
    .slice("--ids=".length)
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
  return ids.length > 0 ? new Set(ids) : null;
}

function parseStates(args: string[]): Set<string> | null {
  const arg = args.find((value) => value.startsWith("--states="));
  if (!arg) return null;
  const states = arg
    .slice("--states=".length)
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter((value) => /^[A-Z]{2}$/.test(value));
  return states.length > 0 ? new Set(states) : null;
}

function parseLimit(args: string[]): number | null {
  const arg = args.find((value) => value.startsWith("--limit="));
  if (!arg) return null;
  const limit = Number.parseInt(arg.slice("--limit=".length), 10);
  if (!Number.isFinite(limit) || limit <= 0) {
    throw new Error("Expected --limit to be a positive integer.");
  }
  return limit;
}

function parseOutputSuffix(args: string[]): string | null {
  const arg = args.find((value) => value.startsWith("--output-suffix="));
  if (!arg) return null;
  const suffix = arg.slice("--output-suffix=".length).trim();
  if (!suffix) return null;
  return suffix.replace(/[^a-zA-Z0-9_-]+/g, "_");
}

function monthLabel(month: number): string {
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][month - 1]!;
}

function cleanCopyFlags(
  label: string,
  text: string | null | undefined,
): string[] {
  if (!text || text.trim().length === 0) return [`COPY_${label}_EMPTY`];
  const rendered = text.replace(/\s+/g, " ").trim();
  const flags: string[] = [];
  if (rendered !== text) flags.push(`COPY_${label}_WHITESPACE_NORMALIZED`);
  if (/\s[.,!?;:]/.test(rendered)) flags.push(`COPY_${label}_PUNCT_SPACING`);
  if (!/^[A-Z]/.test(rendered)) flags.push(`COPY_${label}_NO_LEADING_CAP`);
  if (!/[.!?]$/.test(rendered)) flags.push(`COPY_${label}_MISSING_END_PUNCT`);
  if (rendered.length > 220) flags.push(`COPY_${label}_LONG`);
  if (/[A-Z]{3,}/.test(rendered)) flags.push(`COPY_${label}_ALL_CAPS_TOKEN`);
  return flags;
}

const TITLE_CASE_FACTOR_LABELS = [
  "Temperature",
  "Pressure",
  "Wind",
  "Cloud cover",
  "Rain",
  "Runoff",
  "Tidal movement",
  "Current",
] as const;

function hasMidSentenceTitleCaseFactor(
  text: string | null | undefined,
): boolean {
  if (!text) return false;
  const rendered = text.replace(/\s+/g, " ").trim();
  if (!rendered) return false;
  const sentences = rendered.match(/[^.!?]+[.!?]?/g) ?? [];
  return sentences.some((sentence) => {
    const body = sentence.trim();
    if (body.length <= 1) return false;
    const remainder = body.slice(1);
    return TITLE_CASE_FACTOR_LABELS.some((label) => remainder.includes(label));
  });
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatAverage(values: number[]): string {
  return average(values).toFixed(1);
}

function formatPercent(numerator: number, denominator: number): string {
  if (denominator === 0) return "0.0%";
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function bandCounts(rows: ScenarioAuditRow[]): Record<string, number> {
  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.report.band] = (acc[row.report.band] ?? 0) + 1;
    return acc;
  }, {});
}

function buildBandTable(rows: ScenarioAuditRow[]): string {
  const overall = bandCounts(rows);
  const contexts = [
    "freshwater_lake_pond",
    "freshwater_river",
    "coastal",
    "coastal_flats_estuary",
  ] as const;
  const lines = [
    "| Band | Overall | Lake/Pond | River | Coastal | Flats/Estuary |",
    "|------|---------|-----------|-------|---------|---------------|",
  ];
  for (const band of ["Poor", "Fair", "Good", "Excellent"]) {
    const contextCounts = contexts.map((context) =>
      rows.filter((row) =>
        row.scenario.context === context && row.report.band === band
      ).length
    );
    lines.push(
      `| ${band} | ${overall[band] ?? 0} | ${contextCounts[0]} | ${
        contextCounts[1]
      } | ${contextCounts[2]} | ${contextCounts[3]} |`,
    );
  }
  return lines.join("\n");
}

function topFlagCounts(rows: ScenarioAuditRow[]): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const flag of row.flags) {
      counts.set(flag, (counts.get(flag) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) =>
    b[1] - a[1] || a[0].localeCompare(b[0])
  );
}

function buildFisheryTable(rows: ScenarioAuditRow[]): string {
  const grouped = new Map<string, ScenarioAuditRow[]>();
  for (const row of rows) {
    const key = row.scenario.fishery_key;
    const existing = grouped.get(key) ?? [];
    existing.push(row);
    grouped.set(key, existing);
  }

  const lines = [
    "| Fishery | Context | Species | Avg score | Score range | Flags |",
    "|---------|---------|---------|-----------|-------------|-------|",
  ];

  for (const fisheryKey of [...grouped.keys()].sort()) {
    const fisheryRows = grouped.get(fisheryKey)!;
    const first = fisheryRows[0]!;
    const scores = fisheryRows.map((row) => row.report.score);
    const flagCount = fisheryRows.filter((row) => row.flags.length > 0).length;
    lines.push(
      `| ${first.scenario.fishery_label} | ${first.scenario.context} | ${
        first.scenario.species_focus.join(", ")
      } | ${formatAverage(scores)} | ${Math.min(...scores)}-${
        Math.max(...scores)
      } | ${flagCount}/${fisheryRows.length} |`,
    );
  }

  return lines.join("\n");
}

function buildMonthTable(rows: ScenarioAuditRow[]): string {
  const months = [
    ...new Set(
      rows.map((row) =>
        Number.parseInt(row.scenario.local_date.slice(5, 7), 10)
      ),
    ),
  ].sort((a, b) => a - b);
  const lines = [
    "| Month | Runs | Avg score | Avg coastal score | Avg freshwater score | Flagged |",
    "|-------|------|-----------|-------------------|----------------------|---------|",
  ];

  for (const month of months) {
    const monthRows = rows.filter((row) =>
      Number.parseInt(row.scenario.local_date.slice(5, 7), 10) === month
    );
    const coastalRows = monthRows.filter((row) =>
      row.scenario.context.startsWith("coastal")
    );
    const freshwaterRows = monthRows.filter((row) =>
      row.scenario.context.startsWith("freshwater")
    );
    lines.push(
      `| ${monthLabel(month)} | ${monthRows.length} | ${
        formatAverage(monthRows.map((row) => row.report.score))
      } | ${formatAverage(coastalRows.map((row) => row.report.score))} | ${
        formatAverage(freshwaterRows.map((row) => row.report.score))
      } | ${monthRows.filter((row) => row.flags.length > 0).length} |`,
    );
  }

  return lines.join("\n");
}

function sampleSnippets(rows: ScenarioAuditRow[]): string {
  const preferred = [...rows]
    .sort((a, b) => {
      const aFlagged = a.flags.length > 0 ? 0 : 1;
      const bFlagged = b.flags.length > 0 ? 0 : 1;
      if (aFlagged !== bFlagged) return aFlagged - bFlagged;
      return b.report.score - a.report.score;
    })
    .slice(0, 8);

  return preferred
    .map((row) =>
      `### ${row.scenario.fishery_label} — ${row.scenario.local_date}\n` +
      `- Score: ${row.report.score} (${row.report.band})\n` +
      `- Summary: ${row.report.summary_line}\n` +
      `- Tip: ${row.report.actionable_tip}\n` +
      `- Timing: ${row.report.timing_insight ?? "None"}\n` +
      `- Drivers: ${
        row.report.drivers.map((entry) => entry.label).join(", ") || "None"
      }\n` +
      `- Suppressors: ${
        row.report.suppressors.map((entry) => entry.label).join(", ") || "None"
      }\n` +
      `- Flags: ${row.flags.join(", ") || "None"}`
    )
    .join("\n\n");
}

function buildMarkdownReport(
  rows: ScenarioAuditRow[],
  skipped: SkippedScenario[],
  months: number[],
  jsonlPath: string,
): string {
  const coastalRows = rows.filter((row) =>
    row.scenario.context.startsWith("coastal")
  );
  const freshwaterRows = rows.filter((row) =>
    row.scenario.context.startsWith("freshwater")
  );
  const coastalTempRows = coastalRows.filter((row) =>
    [...row.report.drivers, ...row.report.suppressors].some((entry) =>
      entry.variable === "temperature_condition"
    )
  );
  const coastalTempPrimaryRows = coastalRows.filter((row) => {
    const primary = row.report.drivers[0]?.variable ??
      row.report.suppressors[0]?.variable ?? null;
    return primary === "temperature_condition";
  });
  const coastalTempWithoutTideRows = coastalRows.filter((row) =>
    row.flags.some((flag) => flag === "COASTAL_TEMP_PRIMARY_NO_TIDE_SIGNAL")
  );
  const lowReliabilityRows = rows.filter((row) =>
    row.flags.includes("LOW_RELIABILITY")
  );
  const dataGapRows = rows.filter((row) =>
    row.flags.includes("DATA_GAPS_PRESENT")
  );
  const copyFlagRows = rows.filter((row) =>
    row.flags.some((flag) => flag.startsWith("COPY_"))
  );
  const topFlags = topFlagCounts(rows).slice(0, 12);

  const flaggedRows = rows.filter((row) => row.flags.length > 0);
  const flaggedSection = flaggedRows.length === 0
    ? "No flagged rows."
    : flaggedRows
      .slice()
      .sort((a, b) =>
        b.flags.length - a.flags.length ||
        a.scenario.id.localeCompare(b.scenario.id)
      )
      .map((row) =>
        `- ${row.scenario.id} | ${row.report.score} ${row.report.band} | ${
          row.flags.join(", ")
        }`
      )
      .join("\n");

  const skippedSection = skipped.length === 0
    ? "None."
    : skipped.map((entry) => `- ${entry.scenario.id}: ${entry.reason}`).join(
      "\n",
    );

  const topFlagSection = topFlags.length === 0
    ? "None."
    : topFlags.map(([flag, count]) => `- ${flag}: ${count}`).join("\n");

  return `# TightLines AI — Archive-backed How's Fishing Audit
Generated: ${new Date().toISOString()}

## Scope

| Metric | Value |
|--------|-------|
| Months audited | ${months.map((month) => monthLabel(month)).join(", ")} |
| Scenarios attempted | ${rows.length + skipped.length} |
| Scenarios completed | ${rows.length} |
| Scenarios skipped | ${skipped.length} |
| Core fisheries covered | ${
    new Set(rows.map((row) => row.scenario.fishery_key)).size
  } |
| Coastal runs | ${coastalRows.length} |
| Freshwater runs | ${freshwaterRows.length} |
| JSONL output | ${jsonlPath} |

## Salt Temperature Audit

| Metric | Value |
|--------|-------|
| Coastal runs with temperature surfaced anywhere | ${coastalTempRows.length} / ${coastalRows.length} (${
    formatPercent(coastalTempRows.length, coastalRows.length)
  }) |
| Coastal runs with temperature as primary surfaced factor | ${coastalTempPrimaryRows.length} / ${coastalRows.length} (${
    formatPercent(coastalTempPrimaryRows.length, coastalRows.length)
  }) |
| Coastal runs where temperature led without tide surfacing | ${coastalTempWithoutTideRows.length} / ${coastalRows.length} (${
    formatPercent(coastalTempWithoutTideRows.length, coastalRows.length)
  }) |
| Low-reliability rows | ${lowReliabilityRows.length} |
| Rows with data gaps present | ${dataGapRows.length} |
| Rows with copy-quality flags | ${copyFlagRows.length} |

Interpretation:
- This section is the direct check on whether air temperature is staying secondary in inshore and flats/estuary reports.
- A small number of \`COASTAL_TEMP_PRIMARY_NO_TIDE_SIGNAL\` rows is acceptable for unusual archive days, but repeated hits would mean salt thermal weighting or tide sourcing needs another pass.

## Average Score By Fishery

${buildFisheryTable(rows)}

## Average Score By Month

${buildMonthTable(rows)}

## Score Band Distribution

${buildBandTable(rows)}

## Top Flags

${topFlagSection}

## Flagged Rows

${flaggedSection}

## Skipped Scenarios

${skippedSection}

## Sample Output

${sampleSnippets(rows)}
`;
}

function auditFlags(
  scenario: ArchiveAuditScenario,
  request: SharedEngineRequest,
  report: HowsFishingReport,
  auxiliary: {
    archiveTimezone: string;
    sunFound: boolean;
    moonFound: boolean;
    tidesFound: boolean;
  },
): string[] {
  const flags: string[] = [];
  if (report.reliability === "low") flags.push("LOW_RELIABILITY");
  if (
    request.data_coverage.source_notes?.length ||
    (report.normalized_debug?.data_gaps?.length ?? 0) > 0
  ) {
    flags.push("DATA_GAPS_PRESENT");
  }
  if (request.region_key !== scenario.region_key) {
    flags.push(
      `REGION_MISMATCH:${request.region_key}->expected:${scenario.region_key}`,
    );
  }
  if (auxiliary.archiveTimezone !== scenario.local_timezone) {
    flags.push(
      `TIMEZONE_MISMATCH:${auxiliary.archiveTimezone}->expected:${scenario.local_timezone}`,
    );
  }
  if (!auxiliary.sunFound) flags.push("MISSING_SUN_AUX");
  if (!auxiliary.moonFound) flags.push("MISSING_MOON_AUX");
  if (scenario.tide_station_id && !auxiliary.tidesFound) {
    flags.push("MISSING_TIDE_AUX");
  }

  flags.push(...cleanCopyFlags("SUMMARY", report.summary_line));
  flags.push(...cleanCopyFlags("TIP", report.actionable_tip));
  flags.push(...cleanCopyFlags("TIMING", report.timing_insight));
  const solunarPeakCount =
    report.condition_context?.environment_snapshot.solunar_peak_count ?? null;
  if (solunarPeakCount != null) {
    flags.push(...cleanCopyFlags("SOLUNAR", report.solunar_note));
  }
  if (hasMidSentenceTitleCaseFactor(report.summary_line)) {
    flags.push("COPY_SUMMARY_TITLE_CASE_FACTOR_MID_SENTENCE");
  }

  const surfacedVariables = new Set(
    [...report.drivers, ...report.suppressors].map((entry) => entry.variable),
  );
  const primaryVariable = report.drivers[0]?.variable ??
    report.suppressors[0]?.variable ?? null;

  if (
    scenario.context.startsWith("coastal") &&
    primaryVariable === "temperature_condition" &&
    !surfacedVariables.has("tide_current_movement")
  ) {
    flags.push("COASTAL_TEMP_PRIMARY_NO_TIDE_SIGNAL");
  }

  if (
    scenario.context === "freshwater_river" &&
    (request.environment.precip_72h_in ?? 0) >= 1.5 &&
    !surfacedVariables.has("runoff_flow_disruption")
  ) {
    flags.push("RIVER_RAIN_WITHOUT_RUNOFF_SIGNAL");
  }

  return [...new Set(flags)];
}

const months = parseMonths(Deno.args);
const ids = parseIds(Deno.args);
const states = parseStates(Deno.args);
const limit = parseLimit(Deno.args);
const outputSuffix = parseOutputSuffix(Deno.args);

let scenarios = buildArchiveAuditScenarios(months);
if (ids) scenarios = scenarios.filter((scenario) => ids.has(scenario.id));
if (states) {
  scenarios = scenarios.filter((scenario) => states.has(scenario.state_code));
}
if (limit != null) scenarios = scenarios.slice(0, limit);

if (scenarios.length === 0) {
  throw new Error("No scenarios selected. Check --months, --ids, or --limit.");
}

const scriptDir = decodeURIComponent(new URL(".", import.meta.url).pathname)
  .replace(/\/$/, "");
const suffixSegment = outputSuffix ? `.${outputSuffix}` : "";
const jsonlPath = `${scriptDir}/archive-audit-results${suffixSegment}.jsonl`;
const mdPath = `${scriptDir}/archive-audit-report${suffixSegment}.md`;
const tmpJsonlPath = `${scriptDir}/archive-audit-results${suffixSegment}.tmp.jsonl`;
const tmpMdPath = `${scriptDir}/archive-audit-report${suffixSegment}.tmp.md`;

const rows: ScenarioAuditRow[] = [];
const skipped: SkippedScenario[] = [];

await Deno.writeTextFile(tmpJsonlPath, "");

for (const scenario of scenarios) {
  try {
    const archive = await fetchArchiveWeather(
      scenario.latitude,
      scenario.longitude,
      scenario.local_date,
    );
    if (!archive) {
      skipped.push({ scenario, reason: "archive_weather_fetch_failed" });
      continue;
    }

    const tzOffsetHours = archive.tz_offset_seconds / 3600;
    const [sun, moon, tides] = await Promise.all([
      fetchSunriseSunset(
        scenario.latitude,
        scenario.longitude,
        scenario.local_date,
        archive.timezone,
      ),
      fetchUSNOMoon(
        scenario.latitude,
        scenario.longitude,
        scenario.local_date,
        tzOffsetHours,
      ),
      scenario.tide_station_id
        ? fetchNOAATides(
          scenario.tide_station_id,
          scenario.local_date,
          tzOffsetHours,
        )
        : Promise.resolve(null),
    ]);

    const envData = mapArchiveToEnvData(
      archive,
      scenario.local_date,
      archive.timezone,
      sun,
      moon,
      tides,
    );

    const request = buildSharedEngineRequestFromEnvData(
      scenario.latitude,
      scenario.longitude,
      scenario.local_date,
      scenario.local_timezone,
      scenario.context,
      envData,
      0,
    );

    const report = runHowFishingReport(request);
    const flags = auditFlags(scenario, request, report, {
      archiveTimezone: archive.timezone,
      sunFound: sun != null,
      moonFound: moon != null,
      tidesFound: tides != null,
    });

    const archiveSummary = {
      timezone: archive.timezone,
      noon_air_temp_f: archive.hourly_temp_f.find((_, index) => {
        const unix = archive.hourly_times_unix[index];
        if (unix == null) return false;
        const parts = new Intl.DateTimeFormat("en-CA", {
          timeZone: archive.timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          hour12: false,
        }).formatToParts(new Date(unix * 1000));
        const year = parts.find((part) => part.type === "year")?.value ?? "";
        const month = parts.find((part) => part.type === "month")?.value ?? "";
        const day = parts.find((part) => part.type === "day")?.value ?? "";
        const hour = parts.find((part) => part.type === "hour")?.value ?? "";
        return `${year}-${month}-${day}` === scenario.local_date &&
          hour === "12";
      }) ?? null,
      daily_high_air_temp_f: archive.daily_temp_max_f[15] ??
        archive.daily_temp_max_f[14] ?? null,
      daily_low_air_temp_f: archive.daily_temp_min_f[15] ??
        archive.daily_temp_min_f[14] ?? null,
      daily_precip_in: archive.daily_precip_in[15] ??
        archive.daily_precip_in[14] ?? null,
      daily_wind_max_mph: archive.daily_wind_max_mph[15] ??
        archive.daily_wind_max_mph[14] ?? null,
      moon_phase: moon?.phase ?? null,
      tide_phase: tides?.phase ?? null,
      tide_event_count: tides?.high_low.length ?? 0,
    };

    const row: ScenarioAuditRow = {
      scenario,
      request,
      report,
      env_data: envData,
      raw_sources: {
        archive_weather: archive.raw,
        sunrise_sunset: sun?.raw ?? null,
        usno_moon: moon?.raw ?? null,
        noaa_tides: tides?.raw ?? null,
      },
      archive_summary: archiveSummary,
      flags,
    };

    rows.push(row);
    await Deno.writeTextFile(tmpJsonlPath, JSON.stringify(row) + "\n", {
      append: true,
    });

    console.log(
      `ok  ${scenario.id.padEnd(40)} score=${
        String(report.score).padStart(3)
      } ${report.band.padEnd(9)} flags=${String(flags.length).padStart(2)}`,
    );
  } catch (error) {
    skipped.push({
      scenario,
      reason: error instanceof Error ? error.message : String(error),
    });
    console.error(
      `skip ${scenario.id}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 150));
}

const markdownReport = buildMarkdownReport(rows, skipped, months, jsonlPath);
await Deno.writeTextFile(tmpMdPath, markdownReport);
try {
  await Deno.remove(jsonlPath);
} catch (_error) {
  // Ignore missing prior output.
}
try {
  await Deno.remove(mdPath);
} catch (_error) {
  // Ignore missing prior output.
}
await Deno.rename(tmpJsonlPath, jsonlPath);
await Deno.rename(tmpMdPath, mdPath);

console.log(`\nCompleted ${rows.length} scenarios; skipped ${skipped.length}.`);
console.log(`Markdown report: ${mdPath}`);
console.log(`JSONL results: ${jsonlPath}`);
