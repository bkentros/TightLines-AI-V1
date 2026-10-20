import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  evaluatePierCastOpportunityV5,
  getPierCastOpportunityPairV5,
} from "../../../../lib/pierCastOpportunityV5.ts";
import {
  pierCastOpportunityLabelV5,
  pierCastSeasonTimingLabelFromLegacyCodeV5,
} from "../../../../lib/pierCastOpportunityPresentationV5.ts";
import { pierCastTemperatureSuitabilityV18 } from "../../../../lib/pierCastTemperatureFitV18.ts";
import { buildPierCastCatalog } from "../../../../supabase/functions/_shared/pierCastEngine/config/catalog.ts";

const AUDIT_YEAR = 2028;
const SPECIES_ID = "brown_trout" as const;
const OUTPUT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILES = [
  "audit-summary.json",
  "city-window-summary.csv",
  "evidence-inventory.csv",
  "full-year-daily-baseline.csv",
  "mode-knot-audit.csv",
] as const;
const FROZEN_BASELINE_HASHES = {
  "audit-summary.json":
    "98db19d070153c7db87035194baa1d56cedb9b781f92113729f65efbd824a2b2",
  "city-window-summary.csv":
    "93c4fc8ec09e2c709d9cad0bf13efd77546d2d409e9abf8d1dfd6c66483ebfc3",
  "evidence-inventory.csv":
    "a82f55b09872192a4ba0b94cdead3b56638c7808c8c13184babc70185ecaf3b8",
  "full-year-daily-baseline.csv":
    "ff00a3faa492b620d97022bd111886d296921d47b27f9df6434b7a936f446006",
  "mode-knot-audit.csv":
    "75262d6ad43b3f6856aef595ab675a3c7febce55921ed5c47567171fd429c198",
} as const satisfies Readonly<Record<typeof OUTPUT_FILES[number], string>>;

const THERMAL_SCENARIOS = [
  { id: "cold", fahrenheit: 32, celsius: 0 },
  { id: "ideal", fahrenheit: 50, celsius: 10 },
  { id: "warm", fahrenheit: 72, celsius: (72 - 32) * 5 / 9 },
] as const;

type ScenarioId = typeof THERMAL_SCENARIOS[number]["id"];
type DailyScenario = Readonly<{
  suitability: number;
  score: number;
  label: string;
}>;
type DailyResult = Readonly<{
  date: string;
  modeId: string;
  phaseAvailability: number;
  trend: string;
  phase: string;
  scenarios: Readonly<Record<ScenarioId, DailyScenario>>;
}>;

function round(value: number, places = 6): number {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
}

function datesInYear(year: number): string[] {
  const dates: string[] = [];
  for (
    let instant = Date.UTC(year, 0, 1, 12);
    new Date(instant).getUTCFullYear() === year;
    instant += 86_400_000
  ) {
    dates.push(new Date(instant).toISOString().slice(0, 10));
  }
  return dates;
}

function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function csv(rows: readonly (readonly unknown[])[]): string {
  return `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function intervalText(
  daily: readonly DailyResult[],
  predicate: (row: DailyResult) => boolean,
): string {
  const intervals: string[] = [];
  let start: string | null = null;
  let end: string | null = null;
  for (const row of daily) {
    if (predicate(row)) {
      start ??= row.date;
      end = row.date;
    } else if (start && end) {
      intervals.push(`${start.slice(5)}..${end.slice(5)}`);
      start = null;
      end = null;
    }
  }
  if (start && end) intervals.push(`${start.slice(5)}..${end.slice(5)}`);
  return intervals.length > 0 ? intervals.join(";") : "none";
}

function phaseTransitions(daily: readonly DailyResult[]): string {
  return daily
    .filter((row, index) =>
      index === 0 || row.phase !== daily[index - 1]!.phase
    )
    .map((row) => `${row.date.slice(5)}=${row.phase}`)
    .join(";");
}

function scenarioCell(row: DailyResult, scenario: ScenarioId): string {
  const value = row.scenarios[scenario];
  return `${value.label} ${round(value.score, 3)}`;
}

function rowForDate(
  daily: readonly DailyResult[],
  monthDay: string,
): DailyResult {
  const row = daily.find((candidate) => candidate.date.endsWith(monthDay));
  if (!row) throw new Error(`Missing ${monthDay} snapshot.`);
  return row;
}

export async function buildBrownTroutSeasonalityAudit(): Promise<
  Readonly<Record<typeof OUTPUT_FILES[number], string>>
> {
  const dates = datesInYear(AUDIT_YEAR);
  // Audit the 1.18 public-v3 brown-trout roster. Five review-only candidate
  // cities also contain brown-trout rows, but are not user-visible members of
  // this release and therefore are deliberately outside this pass.
  const catalog = buildPierCastCatalog("public", "v3");
  const cities = catalog.cities
    .filter((city) =>
      city.species.some((species) => species.speciesId === SPECIES_ID)
    )
    .sort((left, right) => left.cityId.localeCompare(right.cityId));
  if (cities.length !== 27) {
    throw new Error(`Expected 27 brown-trout cities; found ${cities.length}.`);
  }

  const suitabilityByScenario = Object.fromEntries(
    THERMAL_SCENARIOS.map((scenario) => {
      const suitability = pierCastTemperatureSuitabilityV18(
        SPECIES_ID,
        scenario.celsius,
      );
      if (suitability === null) {
        throw new Error(`No brown-trout suitability for ${scenario.id}.`);
      }
      return [scenario.id, suitability];
    }),
  ) as Record<ScenarioId, number>;

  const dailyCsv: unknown[][] = [[
    "city_id",
    "city_name",
    "state",
    "local_date",
    "active_mode",
    "phase_availability",
    "trend",
    "season_phase",
    ...THERMAL_SCENARIOS.flatMap((scenario) => [
      `${scenario.id}_temperature_f`,
      `${scenario.id}_suitability`,
      `${scenario.id}_score`,
      `${scenario.id}_label`,
    ]),
  ]];
  const summaryCsv: unknown[][] = [[
    "city_id",
    "city_name",
    "state",
    "evidence_grade",
    "mode_count",
    "mode_ids",
    "fishery_strength_ceiling",
    "outside_main_window_days",
    "outside_main_window_intervals",
    "phase_transitions",
    "ideal_prime_days",
    "ideal_good_days",
    "ideal_fair_days",
    "ideal_limited_days",
    "jan_15",
    "apr_15",
    "oct_20",
    "nov_10",
    "dec_15",
    "nonzero_year_wrap_modes",
  ]];
  const evidenceCsv: unknown[][] = [[
    "city_id",
    "city_name",
    "state",
    "evidence_grade",
    "mode_id",
    "fishery_strength",
    "evidence_ids",
    "limitations",
  ]];
  const knotCsv: unknown[][] = [[
    "city_id",
    "city_name",
    "state",
    "mode_id",
    "fishery_strength",
    "first_knot",
    "first_availability",
    "last_knot",
    "last_availability",
    "nonzero_year_wrap",
    "knots",
  ]];

  let scenarioEvaluations = 0;
  let nonzeroYearWrapModeCount = 0;
  const gradeCounts: Record<string, number> = {};
  const flaggedCities: string[] = [];

  for (const city of cities) {
    const pair = getPierCastOpportunityPairV5({
      cityId: city.cityId,
      speciesId: SPECIES_ID,
    });
    if (!pair) throw new Error(`Missing effective pair for ${city.cityId}.`);
    const evidenceGrades = [
      ...new Set(pair.modes.map((mode) => mode.evidenceGrade)),
    ];
    const evidenceGrade = evidenceGrades.sort()[0]!;
    gradeCounts[evidenceGrade] = (gradeCounts[evidenceGrade] ?? 0) + 1;
    const wrapModes: string[] = [];

    for (const mode of pair.modes) {
      const knots = [...mode.availabilityKnots].sort((left, right) =>
        left.monthDay.localeCompare(right.monthDay)
      );
      const first = knots[0]!;
      const last = knots.at(-1)!;
      const nonzeroYearWrap = first.monthDay !== "01-01" &&
        last.monthDay !== "12-31" && last.availability > 0;
      if (nonzeroYearWrap) {
        wrapModes.push(mode.modeId);
        nonzeroYearWrapModeCount += 1;
      }
      knotCsv.push([
        city.cityId,
        city.displayName,
        city.stateCode,
        mode.modeId,
        mode.fisheryStrength,
        first.monthDay,
        first.availability,
        last.monthDay,
        last.availability,
        nonzeroYearWrap ? "yes" : "no",
        knots.map((knot) => `${knot.monthDay}:${knot.availability}`).join(";"),
      ]);
      evidenceCsv.push([
        city.cityId,
        city.displayName,
        city.stateCode,
        mode.evidenceGrade,
        mode.modeId,
        mode.fisheryStrength,
        mode.fisheryEvidenceIds.join(";"),
        mode.limitations.join(" | "),
      ]);
    }
    if (wrapModes.length > 0) flaggedCities.push(city.cityId);

    const daily: DailyResult[] = [];
    for (const date of dates) {
      let reference:
        | Pick<DailyResult, "modeId" | "phaseAvailability" | "trend" | "phase">
        | null = null;
      const scenarios = {} as Record<ScenarioId, DailyScenario>;
      const dailyCsvScenarios: unknown[] = [];
      for (const scenario of THERMAL_SCENARIOS) {
        const suitability = suitabilityByScenario[scenario.id];
        const evaluation = evaluatePierCastOpportunityV5({
          cityId: city.cityId,
          speciesId: SPECIES_ID,
          localDate: date,
          thermalValue: suitability,
        });
        if (!evaluation || evaluation.closed || evaluation.score === null) {
          throw new Error(
            `${city.cityId} ${date} ${scenario.id} was not scoreable.`,
          );
        }
        const label = pierCastOpportunityLabelV5(evaluation.score);
        const phase = pierCastSeasonTimingLabelFromLegacyCodeV5(
          evaluation.timing,
        );
        if (!label || !phase) {
          throw new Error(
            `${city.cityId} ${date} ${scenario.id} lacked presentation.`,
          );
        }
        const seasonal = {
          modeId: evaluation.modeId,
          phaseAvailability: round(evaluation.phaseAvailability),
          trend: evaluation.trend,
          phase,
        };
        if (
          reference && JSON.stringify(reference) !== JSON.stringify(seasonal)
        ) {
          throw new Error(
            `Temperature changed season state for ${city.cityId} ${date}.`,
          );
        }
        reference ??= seasonal;
        scenarios[scenario.id] = {
          suitability: round(suitability),
          score: round(evaluation.score),
          label,
        };
        dailyCsvScenarios.push(
          scenario.fahrenheit,
          round(suitability),
          round(evaluation.score),
          label,
        );
        scenarioEvaluations += 1;
      }
      if (!reference) {
        throw new Error(`No daily reference for ${city.cityId} ${date}.`);
      }
      const dailyRow: DailyResult = { date, ...reference, scenarios };
      daily.push(dailyRow);
      dailyCsv.push([
        city.cityId,
        city.displayName,
        city.stateCode,
        date,
        reference.modeId,
        reference.phaseAvailability,
        reference.trend,
        reference.phase,
        ...dailyCsvScenarios,
      ]);
    }

    const labels = { Prime: 0, Good: 0, Fair: 0, Limited: 0 };
    for (const row of daily) {
      labels[row.scenarios.ideal.label as keyof typeof labels] += 1;
    }
    const snapshot = (monthDay: string) => {
      const row = rowForDate(daily, monthDay);
      return `${row.phase} | ${scenarioCell(row, "ideal")} | ${row.modeId}`;
    };
    summaryCsv.push([
      city.cityId,
      city.displayName,
      city.stateCode,
      evidenceGrade,
      pair.modes.length,
      pair.modes.map((mode) => mode.modeId).join(";"),
      Math.max(...pair.modes.map((mode) => mode.fisheryStrength)),
      daily.filter((row) => row.phase === "Outside main window").length,
      intervalText(daily, (row) => row.phase === "Outside main window"),
      phaseTransitions(daily),
      labels.Prime,
      labels.Good,
      labels.Fair,
      labels.Limited,
      snapshot("01-15"),
      snapshot("04-15"),
      snapshot("10-20"),
      snapshot("11-10"),
      snapshot("12-15"),
      wrapModes.join(";"),
    ]);
  }

  const expectedDailyRows = cities.length * dates.length;
  const expectedScenarioEvaluations = expectedDailyRows *
    THERMAL_SCENARIOS.length;
  if (dailyCsv.length - 1 !== expectedDailyRows) {
    throw new Error(
      `Expected ${expectedDailyRows} daily rows; found ${dailyCsv.length - 1}.`,
    );
  }
  if (scenarioEvaluations !== expectedScenarioEvaluations) {
    throw new Error(
      `Expected ${expectedScenarioEvaluations} evaluations; found ${scenarioEvaluations}.`,
    );
  }

  const auditSummary = {
    schemaVersion: "piercast-brown-trout-seasonality-pass1-2-v1",
    generatedForAppVersion: "1.18",
    auditYear: AUDIT_YEAR,
    leapYearDayCount: dates.length,
    speciesId: SPECIES_ID,
    cityCount: cities.length,
    dailyRowCount: dailyCsv.length - 1,
    thermalScenarioCount: THERMAL_SCENARIOS.length,
    scenarioEvaluationCount: scenarioEvaluations,
    evidenceGradeCityCounts: gradeCounts,
    thermalScenarios: THERMAL_SCENARIOS.map((scenario) => ({
      ...scenario,
      suitability: round(suitabilityByScenario[scenario.id]),
    })),
    invariants: {
      everyCityHasEffectiveCalibration: true,
      everyDateAndScenarioIsScoreable: true,
      temperatureDoesNotChangeSeasonPhaseOrMode: true,
      allScoresHavePublicLabels: true,
    },
    structuralReview: {
      nonzeroYearWrapModeCount,
      citiesWithNonzeroYearWrap: [...new Set(flaggedCities)].sort(),
      note:
        "A nonzero final knot interpolates across New Year to the first knot. This can be intentional for winter modes, but requires explicit review when used by a fall-only mode.",
    },
    scope:
      "Pass 1 baseline and Pass 2 evidence/structure review only; no production calibration changed.",
  };

  return {
    "audit-summary.json": `${JSON.stringify(auditSummary, null, 2)}\n`,
    "city-window-summary.csv": csv(summaryCsv),
    "evidence-inventory.csv": csv(evidenceCsv),
    "full-year-daily-baseline.csv": csv(dailyCsv),
    "mode-knot-audit.csv": csv(knotCsv),
  };
}

async function main(): Promise<void> {
  const checkOnly = process.argv.includes("--check");
  if (checkOnly) {
    for (const fileName of OUTPUT_FILES) {
      const contents = await readFile(resolve(OUTPUT_DIRECTORY, fileName));
      const hash = createHash("sha256").update(contents).digest("hex");
      if (hash !== FROZEN_BASELINE_HASHES[fileName]) {
        throw new Error(
          `${fileName} has drifted from the frozen Pass 1 baseline.`,
        );
      }
    }
    console.log(
      "Frozen brown-trout Pass 1 baseline verified: 27 cities, " +
        "9,882 daily rows, 29,646 scenario evaluations.",
    );
    return;
  }
  throw new Error(
    "The Pass 1 baseline is frozen after Pass 2; use --check instead of regenerating it.",
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  void main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
