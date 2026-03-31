/**
 * TightLines AI — deterministic How's Fishing audit
 *
 * Default sweep:
 * - 18 regions
 * - valid contexts only (freshwater everywhere; coastal/flats only for ocean-adjacent regions)
 * - March through August
 * - synthetic prime + bad runs per region/context/month
 *
 * Run:
 *   deno run --allow-read --allow-write scripts/audit/run-full-audit.ts
 *   deno run --allow-read --allow-write scripts/audit/run-full-audit.ts --months=1,2,9,10,11,12
 */

import { isCoastalContextEligible } from "../../lib/coastalProximity.ts";
import { howFishingMultiContexts } from "../../lib/howFishingRebuildContracts.ts";
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { SharedEngineRequest } from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import { normalizeTemperature } from "../../supabase/functions/_shared/howFishingEngine/normalize/normalizeTemperature.ts";
import { runHowFishingReport } from "../../supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts";

const DEFAULT_MONTHS = [3, 4, 5, 6, 7, 8] as const;
const COASTAL_CONTEXTS = new Set<EngineContext>(["coastal", "coastal_flats_estuary"]);
const CONTEXT_ORDER: EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
];

const REGIONS: Record<RegionKey, { lat: number; lon: number; state: string; tz: string }> = {
  northeast: { lat: 42.3, lon: -71.1, state: "MA", tz: "America/New_York" },
  southeast_atlantic: { lat: 32.8, lon: -79.9, state: "SC", tz: "America/New_York" },
  florida: { lat: 27.9, lon: -82.5, state: "FL", tz: "America/New_York" },
  gulf_coast: { lat: 29.9, lon: -90.1, state: "LA", tz: "America/Chicago" },
  great_lakes_upper_midwest: { lat: 43.9, lon: -85.9, state: "MI", tz: "America/Chicago" },
  midwest_interior: { lat: 40.0, lon: -86.2, state: "IN", tz: "America/Chicago" },
  south_central: { lat: 30.3, lon: -97.7, state: "TX", tz: "America/Chicago" },
  mountain_west: { lat: 40.7, lon: -111.9, state: "UT", tz: "America/Denver" },
  southwest_desert: { lat: 33.4, lon: -112.0, state: "AZ", tz: "America/Phoenix" },
  southwest_high_desert: { lat: 35.1, lon: -106.7, state: "NM", tz: "America/Denver" },
  pacific_northwest: { lat: 47.6, lon: -122.3, state: "WA", tz: "America/Los_Angeles" },
  southern_california: { lat: 34.0, lon: -118.2, state: "CA", tz: "America/Los_Angeles" },
  mountain_alpine: { lat: 39.6, lon: -105.9, state: "CO", tz: "America/Denver" },
  northern_california: { lat: 38.3, lon: -123.0, state: "CA", tz: "America/Los_Angeles" },
  appalachian: { lat: 38.4, lon: -81.6, state: "WV", tz: "America/New_York" },
  inland_northwest: { lat: 47.7, lon: -117.4, state: "WA", tz: "America/Los_Angeles" },
  alaska: { lat: 61.2, lon: -149.9, state: "AK", tz: "America/Anchorage" },
  hawaii: { lat: 21.3, lon: -157.8, state: "HI", tz: "Pacific/Honolulu" },
};

type ScenarioKind = "prime" | "bad";

type AuditRow = {
  region: RegionKey;
  context: EngineContext;
  month: number;
  primeTempF: number;
  primeTempBandScore: number;
  badTempF: number;
  badTempBandScore: number;
  primeScore: number;
  primeBand: string;
  badScore: number;
  badBand: string;
  diff: number;
  primeDrivers: string[];
  primeSuppressors: string[];
  primeSummaryLine: string;
  primeTip: string;
  primeTipTag: string;
  primeTempBand: string;
  primeThermalPlain: string;
  flags: string[];
};

function parseMonths(args: string[]): number[] {
  const arg = args.find((value) => value.startsWith("--months="));
  if (!arg) return [...DEFAULT_MONTHS];
  const months = arg
    .slice("--months=".length)
    .split(",")
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isFinite(value) && value >= 1 && value <= 12);
  if (months.length === 0) {
    throw new Error("Expected --months=1,2,...,12 with at least one valid month.");
  }
  return [...new Set(months)].sort((a, b) => a - b);
}

function monthLabel(month: number): string {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1]!;
}

function buildPressureHistory(current: number, ago24: number): number[] {
  const step = (current - ago24) / 4;
  return [ago24, ago24 + step, ago24 + step * 2, ago24 + step * 3, current];
}

function validContextsForRegion(region: RegionKey): EngineContext[] {
  const { lat, lon } = REGIONS[region];
  return howFishingMultiContexts(isCoastalContextEligible(lat, lon)) as EngineContext[];
}

function deriveScenarioTemperature(
  context: EngineContext,
  region: RegionKey,
  month: number,
  scenario: ScenarioKind,
): { tempF: number; bandScore: number } {
  let bestTemp = 60;
  let bestScore = scenario === "prime" ? -Infinity : Infinity;
  let bestCandidates: number[] = [];

  for (let tempF = -10; tempF <= 115; tempF++) {
    const normalized = normalizeTemperature(context, region, month, tempF, null, null);
    if (!normalized) continue;

    const score = normalized.final_score;
    const isBetter =
      scenario === "prime"
        ? score > bestScore + 1e-9
        : score < bestScore - 1e-9;
    const isTie = Math.abs(score - bestScore) <= 1e-9;

    if (isBetter) {
      bestScore = score;
      bestCandidates = [tempF];
    } else if (isTie) {
      bestCandidates.push(tempF);
    }
  }

  if (bestCandidates.length > 0) {
    bestTemp = bestCandidates[Math.floor((bestCandidates.length - 1) / 2)]!;
  }

  return { tempF: bestTemp, bandScore: bestScore };
}

function riverRunoffInputs(region: RegionKey, scenario: ScenarioKind) {
  if (scenario === "prime") {
    return { precip_24h_in: 0, precip_72h_in: 0, precip_7d_in: 0, active_precip_now: false };
  }

  switch (region) {
    case "florida":
      return { precip_24h_in: 1.3, precip_72h_in: 3.0, precip_7d_in: 6.0, active_precip_now: true };
    case "southeast_atlantic":
    case "gulf_coast":
    case "south_central":
    case "mountain_west":
    case "inland_northwest":
    case "hawaii":
      return { precip_24h_in: 1.0, precip_72h_in: 2.3, precip_7d_in: 4.8, active_precip_now: true };
    default:
      return { precip_24h_in: 1.3, precip_72h_in: 3.0, precip_7d_in: 6.2, active_precip_now: true };
  }
}

function buildRequest(
  regionKey: RegionKey,
  context: EngineContext,
  month: number,
  scenario: ScenarioKind,
): SharedEngineRequest {
  const region = REGIONS[regionKey];
  const isCoastal = COASTAL_CONTEXTS.has(context);
  const monthStr = String(month).padStart(2, "0");
  const localDate = `2026-${monthStr}-15`;
  const thermal = deriveScenarioTemperature(context, regionKey, month, scenario);
  const riverHydrology = context === "freshwater_river"
    ? riverRunoffInputs(regionKey, scenario)
    : null;

  return {
    latitude: region.lat,
    longitude: region.lon,
    state_code: region.state,
    region_key: regionKey,
    local_date: localDate,
    local_timezone: region.tz,
    context,
    environment: {
      daily_mean_air_temp_f: thermal.tempF,
      daily_high_air_temp_f: thermal.tempF + 8,
      daily_low_air_temp_f: thermal.tempF - 8,
      current_air_temp_f: thermal.tempF,
      measured_water_temp_f: null,
      pressure_mb: scenario === "prime" ? 1015 : 1008,
      pressure_history_mb: scenario === "prime"
        ? buildPressureHistory(1015, 1015)
        : buildPressureHistory(1008, 1020),
      wind_speed_mph: scenario === "prime" ? 8 : 22,
      cloud_cover_pct: scenario === "prime" ? 60 : 20,
      precip_24h_in: riverHydrology?.precip_24h_in ?? (scenario === "prime" ? 0 : 0.8),
      precip_72h_in: riverHydrology?.precip_72h_in ?? (scenario === "prime" ? 0 : 1.5),
      precip_7d_in: riverHydrology?.precip_7d_in ?? null,
      tide_height_hourly_ft: isCoastal
        ? scenario === "prime"
          ? [0.5, 0.7, 0.9, 1.1, 1.4, 1.7, 2.1, 2.5, 2.5, 2.3, 2.0, 1.7, 1.4, 1.1, 0.8, 0.6, 0.4, 0.3, 0.3, 0.4, 0.6, 0.8, 1.0, 1.3]
          : [2.5, 2.5, 2.4, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9, 1.9, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.5, 2.5, 2.4, 2.4, 2.3, 2.2, 2.1]
        : null,
      tide_high_low: isCoastal
        ? scenario === "prime"
          ? [
              { time: `2026-${monthStr}-15T08:00:00`, value: 2.5, type: "H" },
              { time: `2026-${monthStr}-15T14:00:00`, value: 0.3, type: "L" },
            ]
          : [
              { time: `2026-${monthStr}-15T06:00:00`, value: 2.5, type: "H" },
              { time: `2026-${monthStr}-15T12:00:00`, value: 2.0, type: "L" },
            ]
        : null,
      active_precip_now: riverHydrology?.active_precip_now ?? (scenario === "bad"),
    },
    data_coverage: { source_notes: [] },
  };
}

function formatScoreTable(ctx: EngineContext, rows: AuditRow[], months: number[]): string {
  const ctxRows = rows.filter((row) => row.context === ctx);
  const regionKeys = [...new Set(ctxRows.map((row) => row.region))];
  const header =
    `| Region | ${
      months.map((month) => `${monthLabel(month)} P | ${monthLabel(month)} B`).join(" | ")
    } |`;
  const separator = `|--------|${months.map(() => "------|------").join("|")}|`;
  const dataRows = regionKeys.map((region) => {
    const cells = months.map((month) => {
      const row = ctxRows.find((candidate) => candidate.region === region && candidate.month === month);
      if (!row) return "  n/a |  n/a";
      const primeFlag = row.primeScore < 55 ? "!" : " ";
      const badFlag = row.badScore > 65 ? "!" : " ";
      return `${String(row.primeScore).padStart(4)}${primeFlag}|${String(row.badScore).padStart(4)}${badFlag}`;
    });
    return `| ${region.padEnd(30)} | ${cells.join(" | ")} |`;
  });

  return [header, separator, ...dataRows].join("\n");
}

function sampleCopy(rows: AuditRow[], targetMonth: number): string {
  return rows
    .filter((row) => row.month === targetMonth)
    .slice(0, 20)
    .map((row) =>
      `**${row.region} / ${row.context} / ${monthLabel(row.month)} (score=${row.primeScore} ${row.primeBand})**\n` +
      `  Temp: ${row.primeTempF}F (band_score=${row.primeTempBandScore.toFixed(2)}; band=${row.primeTempBand})\n` +
      `  Summary: ${row.primeSummaryLine}\n` +
      `  Tip: ${row.primeTip}\n` +
      `  Drivers: ${row.primeDrivers.join(", ") || "none"}\n` +
      `  Suppressors: ${row.primeSuppressors.join(", ") || "none"}\n` +
      `  Thermal plain: ${row.primeThermalPlain}`
    )
    .join("\n\n");
}

function anomalySummary(flaggedRows: AuditRow[]): string {
  if (flaggedRows.length === 0) return "No anomalies detected.";
  return flaggedRows
    .map((row) =>
      `- **${row.region}** / ${row.context} / ${monthLabel(row.month)} | prime=${row.primeScore} bad=${row.badScore} diff=${row.diff}\n` +
      row.flags.map((flag) => `  - ${flag}`).join("\n")
    )
    .join("\n");
}

const months = parseMonths(Deno.args);
const rows: AuditRow[] = [];

for (const regionKey of Object.keys(REGIONS) as RegionKey[]) {
  for (const context of validContextsForRegion(regionKey)) {
    for (const month of months) {
      const primeReq = buildRequest(regionKey, context, month, "prime");
      const badReq = buildRequest(regionKey, context, month, "bad");
      const primeReport = runHowFishingReport(primeReq);
      const badReport = runHowFishingReport(badReq);

      const flags: string[] = [];
      const primeTemp = deriveScenarioTemperature(context, regionKey, month, "prime");
      const badTemp = deriveScenarioTemperature(context, regionKey, month, "bad");
      const diff = primeReport.score - badReport.score;

      if (primeReport.score < 55) {
        flags.push(`PRIME_SCORE_LOW: ${primeReport.score} (expected >= 55)`);
      }
      if (badReport.score > 65) {
        flags.push(`BAD_SCORE_HIGH: ${badReport.score} (expected <= 65)`);
      }
      if (diff < 20) {
        flags.push(`SMALL_DIFF: prime=${primeReport.score} bad=${badReport.score} gap=${diff} (expected >= 20)`);
      }

      const tempSuppressor = primeReport.suppressors.find((entry) => entry.variable === "temperature_condition");
      if (tempSuppressor) {
        flags.push(`TEMP_SUPPRESSOR_ON_PRIME: ${tempSuppressor.label}`);
      }

      if (COASTAL_CONTEXTS.has(context)) {
        const surfaced = [...primeReport.drivers, ...primeReport.suppressors].map((entry) => entry.variable);
        if (!surfaced.includes("tide_current_movement")) {
          flags.push("COASTAL_NO_TIDE: tidal movement did not surface on prime day");
        }
      }

      if (context === "freshwater_river") {
        const surfacedBad = [...badReport.drivers, ...badReport.suppressors].map((entry) => entry.variable);
        if (!surfacedBad.includes("runoff_flow_disruption")) {
          flags.push("RIVER_NO_RUNOFF_BAD_DAY: runoff did not surface on the heavy-rain river scenario");
        }
      }

      rows.push({
        region: regionKey,
        context,
        month,
        primeTempF: primeTemp.tempF,
        primeTempBandScore: primeTemp.bandScore,
        badTempF: badTemp.tempF,
        badTempBandScore: badTemp.bandScore,
        primeScore: primeReport.score,
        primeBand: primeReport.band,
        badScore: badReport.score,
        badBand: badReport.band,
        diff,
        primeDrivers: primeReport.drivers.map((entry) => `${entry.variable}(${entry.label})`),
        primeSuppressors: primeReport.suppressors.map((entry) => `${entry.variable}(${entry.label})`),
        primeSummaryLine: primeReport.summary_line,
        primeTip: primeReport.actionable_tip,
        primeTipTag: primeReport.actionable_tip_tag,
        primeTempBand: primeReport.condition_context?.temperature_band ?? "n/a",
        primeThermalPlain: primeReport.condition_context?.thermal_air_narration_plain ?? "n/a",
        flags,
      });
    }
  }
}

const flaggedRows = rows.filter((row) => row.flags.length > 0);
const coastalEligibleRegions = (Object.keys(REGIONS) as RegionKey[]).filter((region) =>
  validContextsForRegion(region).length === 4
);
const inlandRegions = (Object.keys(REGIONS) as RegionKey[]).filter((region) =>
  validContextsForRegion(region).length === 2
);
const totalRuns = rows.length * 2;

const avg = (values: number[]) => (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1);
const minValue = (values: number[]) => Math.min(...values);
const maxValue = (values: number[]) => Math.max(...values);

const primeScores = rows.map((row) => row.primeScore);
const badScores = rows.map((row) => row.badScore);
const diffs = rows.map((row) => row.diff);

const report = `# TightLines AI — Deterministic Engine Audit
Generated: ${new Date().toISOString()}

## Scope

| Metric | Value |
|--------|-------|
| Regions audited | ${Object.keys(REGIONS).length} |
| Coastal-eligible regions | ${coastalEligibleRegions.length} |
| Freshwater-only regions | ${inlandRegions.length} |
| Months audited | ${months.map((month) => monthLabel(month)).join(", ")} |
| Region/context/month combos | ${rows.length} |
| Synthetic runs executed | ${totalRuns} |

Notes:
- Prime and bad temperatures are derived from the live deterministic temperature curves for each region/context/month, not from hard-coded guesses.
- Coastal and flats audits run only for ocean-adjacent regions, matching the product's context-eligibility rule.

## Aggregate Statistics

| Metric | Value |
|--------|-------|
| Prime score avg / min / max | ${avg(primeScores)} / ${minValue(primeScores)} / ${maxValue(primeScores)} |
| Bad score avg / min / max | ${avg(badScores)} / ${minValue(badScores)} / ${maxValue(badScores)} |
| Prime-bad diff avg / min / max | ${avg(diffs)} / ${minValue(diffs)} / ${maxValue(diffs)} |
| Prime scores < 55 | ${rows.filter((row) => row.primeScore < 55).length} of ${rows.length} |
| Bad scores > 65 | ${rows.filter((row) => row.badScore > 65).length} of ${rows.length} |
| Prime temp suppressor rows | ${rows.filter((row) => row.flags.some((flag) => flag.startsWith("TEMP_SUPPRESSOR"))).length} |
| Coastal no-tide rows | ${rows.filter((row) => row.flags.some((flag) => flag.startsWith("COASTAL_NO_TIDE"))).length} |
| River no-runoff rows | ${rows.filter((row) => row.flags.some((flag) => flag.startsWith("RIVER_NO_RUNOFF"))).length} |

## Score Tables

### Freshwater Lake / Pond
${formatScoreTable("freshwater_lake_pond", rows, months)}

### Freshwater River
${formatScoreTable("freshwater_river", rows, months)}

### Coastal Inshore
${formatScoreTable("coastal", rows, months)}

### Flats & Estuary
${formatScoreTable("coastal_flats_estuary", rows, months)}

## Flagged Rows (${flaggedRows.length})

${anomalySummary(flaggedRows)}

## Sample Output (${monthLabel(months.includes(5) ? 5 : months[0]!)} prime rows)

${sampleCopy(rows, months.includes(5) ? 5 : months[0]!)}
`;

const outputDir = "/Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit";
const mdPath = `${outputDir}/audit-report.md`;
const jsonPath = `${outputDir}/audit-results.json`;

await Deno.writeTextFile(mdPath, report);
await Deno.writeTextFile(jsonPath, JSON.stringify({ months, rows }, null, 2));

console.log(report);
console.log(`\nWrote markdown report: ${mdPath}`);
console.log(`Wrote JSON rows: ${jsonPath}`);
