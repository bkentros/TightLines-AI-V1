import { fetchArchiveWeather } from "../audit/lib/fetchArchiveWeather.ts";
import { fetchNOAATides } from "../audit/lib/fetchNOAATides.ts";
import { fetchSunriseSunset } from "../audit/lib/fetchSunriseSunset.ts";
import { mapArchiveToEnvData } from "../audit/lib/mapArchiveToEnvData.ts";
import type { WaterClarity } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { ForageMode } from "../../supabase/functions/_shared/recommenderEngine/contracts/behavior.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { getSpeciesTierForState, isSpeciesValidForState } from "../../supabase/functions/_shared/recommenderEngine/config/stateSpeciesGating.ts";
import { PRIORITY_RECOMMENDER_AUDIT_FISHERIES, type RecommenderAuditFishery } from "./priorityFisheries.ts";

export type ThermalVariant = "cold" | "normal" | "warm";

type MonthlyWeatherCandidate = {
  date: string;
  daily_mean_air_f: number;
  daily_high_air_f: number;
  daily_low_air_f: number;
  daily_precip_in: number;
  daily_wind_max_mph: number;
  daily_cloud_cover_mean: number;
  daily_pressure_mean_mb: number;
};

export type ScenarioSeed = {
  seed_id: string;
  fishery_key: string;
  fishery_label: string;
  fishery_group: string;
  notes: string;
  region_key: RecommenderAuditFishery["region_key"];
  state_code: string;
  local_timezone: string;
  latitude: number;
  longitude: number;
  context: RecommenderAuditFishery["context"];
  local_date: string;
  month: number;
  thermal_variant: ThermalVariant;
  archive_summary: {
    daily_mean_air_f: number;
    daily_high_air_f: number;
    daily_low_air_f: number;
    daily_precip_in: number;
    daily_wind_max_mph: number;
    daily_cloud_cover_mean: number;
    daily_pressure_mean_mb: number;
  };
  env_data: Record<string, unknown>;
};

export type ExpandedScenario = {
  id: string;
  seed_id: string;
  fishery_key: string;
  species: SpeciesGroup;
  water_clarity: WaterClarity;
  expected_forage_modes: ForageMode[];
  species_tier: string | null;
};

export type OutputBundle = {
  generated_at: string;
  months: number[];
  fisheries: string[];
  seed_count: number;
  scenario_count: number;
  seeds: ScenarioSeed[];
  scenarios: ExpandedScenario[];
};

const CLARITIES: WaterClarity[] = ["clear", "stained", "dirty"];
const THERMAL_VARIANTS: ThermalVariant[] = ["cold", "normal", "warm"];
const YEARS_TO_SCAN = [2024, 2025];
const DEFAULT_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const DEFAULT_OUTPUT =
  "/Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/recommenderAudit/generated/historical-scenarios.json";
const DEFAULT_SUMMARY =
  "/Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/recommenderAudit/generated/historical-scenarios-summary.md";

function monthLabel(month: number): string {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1]!;
}

function parseMonths(args: string[]): number[] {
  const arg = args.find((value) => value.startsWith("--months="));
  if (!arg) return [...DEFAULT_MONTHS];
  const months = arg.slice("--months=".length)
    .split(",")
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isFinite(value) && value >= 1 && value <= 12);
  return months.length > 0 ? [...new Set(months)].sort((a, b) => a - b) : [...DEFAULT_MONTHS];
}

function parseFisheryFilter(args: string[]): Set<string> | null {
  const arg = args.find((value) => value.startsWith("--fisheries="));
  if (!arg) return null;
  const values = arg.slice("--fisheries=".length)
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
  return values.length > 0 ? new Set(values) : null;
}

function parseOutput(args: string[], flag: "--output=" | "--summary="): string {
  const arg = args.find((value) => value.startsWith(flag));
  if (!arg) return flag === "--output=" ? DEFAULT_OUTPUT : DEFAULT_SUMMARY;
  return arg.slice(flag.length);
}

function pickBestCandidate(
  candidates: MonthlyWeatherCandidate[],
  variant: ThermalVariant,
  usedDates: Set<string>,
): MonthlyWeatherCandidate {
  const sorted = [...candidates].sort((a, b) => a.daily_mean_air_f - b.daily_mean_air_f);
  const targetQuantile = variant === "cold" ? 0.2 : variant === "warm" ? 0.8 : 0.5;

  const scored = sorted.map((candidate, index) => {
    const quantile = sorted.length <= 1 ? 0.5 : index / (sorted.length - 1);
    const quantilePenalty = Math.abs(quantile - targetQuantile) * 100;
    const precipPenalty = candidate.daily_precip_in * 12;
    const windPenalty = Math.abs(candidate.daily_wind_max_mph - 10) * 0.8;
    const cloudPenalty = variant === "normal"
      ? Math.abs(candidate.daily_cloud_cover_mean - 45) * 0.15
      : Math.abs(candidate.daily_cloud_cover_mean - 35) * 0.08;
    const usedPenalty = usedDates.has(candidate.date) ? 1000 : 0;

    return {
      candidate,
      score: quantilePenalty + precipPenalty + windPenalty + cloudPenalty + usedPenalty,
    };
  });

  scored.sort((a, b) =>
    a.score - b.score ||
    a.candidate.daily_precip_in - b.candidate.daily_precip_in ||
    a.candidate.date.localeCompare(b.candidate.date)
  );

  return scored[0]!.candidate;
}

async function fetchMonthCandidates(
  fishery: RecommenderAuditFishery,
  month: number,
): Promise<MonthlyWeatherCandidate[]> {
  const monthStr = String(month).padStart(2, "0");
  const all: MonthlyWeatherCandidate[] = [];

  for (const year of YEARS_TO_SCAN) {
    const startDate = `${year}-${monthStr}-01`;
    const endDate = new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
    const params = new URLSearchParams({
      latitude: String(fishery.latitude),
      longitude: String(fishery.longitude),
      start_date: startDate,
      end_date: endDate,
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,cloud_cover_mean,pressure_msl_mean",
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      timezone: fishery.local_timezone,
    });
    const url = `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`;
    let json: Record<string, unknown> | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      let timeoutId: number | undefined;
      try {
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 20_000);
        const response = await fetch(url, {
          signal: controller.signal,
          headers: { "User-Agent": "TightLinesAI-Recommender-Audit/1.0" },
        });
        if (!response.ok) {
          if ((response.status >= 500 || response.status === 429) && attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, attempt * 600));
            continue;
          }
          console.warn(`Month candidate fetch failed for ${fishery.key} ${year}-${monthStr}: ${response.status}`);
          break;
        }
        json = await response.json();
        break;
      } catch (error) {
        if (attempt === 3) {
          console.warn(
            `Month candidate fetch errored for ${fishery.key} ${year}-${monthStr}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        } else {
          await new Promise((resolve) => setTimeout(resolve, attempt * 600));
        }
      } finally {
        if (timeoutId !== undefined) clearTimeout(timeoutId);
      }
    }

    if (!json) continue;
    const daily = json?.daily;
    if (!daily?.time) continue;

    const times = daily.time as string[];
    const highs = daily.temperature_2m_max as number[];
    const lows = daily.temperature_2m_min as number[];
    const precip = daily.precipitation_sum as number[];
    const wind = daily.wind_speed_10m_max as number[];
    const cloud = daily.cloud_cover_mean as number[];
    const pressure = daily.pressure_msl_mean as number[];

    for (let index = 0; index < times.length; index++) {
      const high = Number(highs[index]);
      const low = Number(lows[index]);
      if (!Number.isFinite(high) || !Number.isFinite(low)) continue;

      all.push({
        date: String(times[index]),
        daily_mean_air_f: (high + low) / 2,
        daily_high_air_f: high,
        daily_low_air_f: low,
        daily_precip_in: Number(precip[index] ?? 0) / 25.4,
        daily_wind_max_mph: Number(wind[index] ?? 0),
        daily_cloud_cover_mean: Number(cloud[index] ?? 0),
        daily_pressure_mean_mb: Number(pressure[index] ?? 0),
      });
    }
  }

  return all;
}

async function buildSeed(
  fishery: RecommenderAuditFishery,
  month: number,
  variant: ThermalVariant,
  date: string,
  candidate: MonthlyWeatherCandidate,
): Promise<ScenarioSeed | null> {
  const archive = await fetchArchiveWeather(fishery.latitude, fishery.longitude, date);
  if (!archive) return null;

  const sun = await fetchSunriseSunset(fishery.latitude, fishery.longitude, date, fishery.local_timezone);
  const tides = fishery.tide_station_id
    ? await fetchNOAATides(fishery.tide_station_id, date, archive.tz_offset_seconds / 3600)
    : null;

  const env_data = mapArchiveToEnvData(
    archive,
    date,
    fishery.local_timezone,
    sun,
    null,
    tides,
  );

  return {
    seed_id: `${fishery.key}-${date}-${variant}`,
    fishery_key: fishery.key,
    fishery_label: fishery.label,
    fishery_group: fishery.fishery_group,
    notes: fishery.notes,
    region_key: fishery.region_key,
    state_code: fishery.state_code,
    local_timezone: fishery.local_timezone,
    latitude: fishery.latitude,
    longitude: fishery.longitude,
    context: fishery.context,
    local_date: date,
    month,
    thermal_variant: variant,
    archive_summary: {
      daily_mean_air_f: Number(candidate.daily_mean_air_f.toFixed(1)),
      daily_high_air_f: Number(candidate.daily_high_air_f.toFixed(1)),
      daily_low_air_f: Number(candidate.daily_low_air_f.toFixed(1)),
      daily_precip_in: Number(candidate.daily_precip_in.toFixed(2)),
      daily_wind_max_mph: Number(candidate.daily_wind_max_mph.toFixed(1)),
      daily_cloud_cover_mean: Math.round(candidate.daily_cloud_cover_mean),
      daily_pressure_mean_mb: Number(candidate.daily_pressure_mean_mb.toFixed(1)),
    },
    env_data,
  };
}

function expandScenarios(
  fishery: RecommenderAuditFishery,
  seed: ScenarioSeed,
): ExpandedScenario[] {
  const scenarios: ExpandedScenario[] = [];

  for (const species of fishery.species_targets) {
    if (!isSpeciesValidForState(fishery.state_code, species, fishery.context)) continue;
    const expected_forage_modes = fishery.expected_forage_modes[species] ?? [];
    const species_tier = getSpeciesTierForState(fishery.state_code, species);

    for (const water_clarity of CLARITIES) {
      scenarios.push({
        id: `${seed.seed_id}-${species}-${water_clarity}`,
        seed_id: seed.seed_id,
        fishery_key: fishery.key,
        species,
        water_clarity,
        expected_forage_modes,
        species_tier,
      });
    }
  }

  return scenarios;
}

function buildSummaryMarkdown(bundle: OutputBundle): string {
  const fisheryCounts = new Map<string, number>();
  const speciesCounts = new Map<string, number>();

  for (const scenario of bundle.scenarios) {
    fisheryCounts.set(scenario.fishery_key, (fisheryCounts.get(scenario.fishery_key) ?? 0) + 1);
    speciesCounts.set(scenario.species, (speciesCounts.get(scenario.species) ?? 0) + 1);
  }

  const fisheryLines = [...fisheryCounts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([fishery, count]) => `- ${fishery}: ${count} expanded scenarios`);

  const speciesLines = [...speciesCounts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([species, count]) => `- ${species}: ${count} expanded scenarios`);

  const sampleSeeds = bundle.seeds
    .slice(0, 12)
    .map((seed) =>
      `- ${seed.seed_id} | ${seed.fishery_label} | ${monthLabel(seed.month)} | ${seed.thermal_variant} | ${seed.local_date} | mean ${seed.archive_summary.daily_mean_air_f}F`
    );

  return `# Recommender Historical Audit Scenarios

| Generated at | ${bundle.generated_at} |
| --- | --- |
| Months | ${bundle.months.map((month) => monthLabel(month)).join(", ")} |
| Fisheries | ${bundle.fisheries.length} |
| Weather/tide seeds | ${bundle.seed_count} |
| Expanded scenarios | ${bundle.scenario_count} |

## Fishery Coverage
${fisheryLines.join("\n")}

## Species Coverage
${speciesLines.join("\n")}

## Sample Seeds
${sampleSeeds.join("\n")}
`;
}

async function main() {
  const months = parseMonths(Deno.args);
  const fisheryFilter = parseFisheryFilter(Deno.args);
  const outputPath = parseOutput(Deno.args, "--output=");
  const summaryPath = parseOutput(Deno.args, "--summary=");

  const fisheries = PRIORITY_RECOMMENDER_AUDIT_FISHERIES.filter((fishery) =>
    fisheryFilter ? fisheryFilter.has(fishery.key) : true
  );

  const seeds: ScenarioSeed[] = [];
  const scenarios: ExpandedScenario[] = [];

  for (const fishery of fisheries) {
    for (const month of months) {
      const candidates = await fetchMonthCandidates(fishery, month);
      if (candidates.length === 0) {
        console.warn(`No historical candidates found for ${fishery.key} month ${month}`);
        continue;
      }

      const usedDates = new Set<string>();
      for (const variant of THERMAL_VARIANTS) {
        const picked = pickBestCandidate(candidates, variant, usedDates);
        usedDates.add(picked.date);

        const seed = await buildSeed(fishery, month, variant, picked.date, picked);
        if (!seed) {
          console.warn(`Failed to build seed for ${fishery.key} ${picked.date} ${variant}`);
          continue;
        }

        seeds.push(seed);
        scenarios.push(...expandScenarios(fishery, seed));
      }
    }
  }

  const bundle: OutputBundle = {
    generated_at: new Date().toISOString(),
    months,
    fisheries: fisheries.map((fishery) => fishery.key),
    seed_count: seeds.length,
    scenario_count: scenarios.length,
    seeds,
    scenarios,
  };

  await Deno.mkdir(outputPath.slice(0, outputPath.lastIndexOf("/")), { recursive: true });
  await Deno.writeTextFile(outputPath, JSON.stringify(bundle, null, 2));
  await Deno.writeTextFile(summaryPath, buildSummaryMarkdown(bundle));

  console.log(`Generated ${bundle.seed_count} seeds and ${bundle.scenario_count} scenarios.`);
  console.log(`JSON: ${outputPath}`);
  console.log(`Summary: ${summaryPath}`);
}

if (import.meta.main) {
  await main();
}
