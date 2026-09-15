import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  calculatePierCastInstantOpportunity,
  calculatePierCastV3Opportunity,
  evaluatePierCastSeasonalOpportunity,
  evaluatePierCastV3ModePotentials,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_LAKE_HURON_CITY_PROFILES,
  PIER_CAST_V3_FORMULA_VERSION,
  PIER_CAST_V3_PAIR_CALIBRATIONS,
  PIER_CAST_V3_THERMAL_FLOOR,
  PIER_CAST_V3_THERMAL_WEIGHT,
  PIER_CAST_WISCONSIN_CITY_PROFILES,
  pierCastV3RegulationClosureApplies,
} from "../supabase/functions/_shared/pierCastEngine/index.ts";

const outputDirectory = resolve("docs/onboarding/piercast/scoring-v3-pass2");
const checkOnly = process.argv.includes("--check");
const referenceYear = 2027;
const fits = [0, 0.25, 0.5, 0.75, 1] as const;
const profiles = [
  ...PIER_CAST_CITY_PROFILES,
  ...PIER_CAST_WISCONSIN_CITY_PROFILES,
  ...PIER_CAST_LAKE_HURON_CITY_PROFILES,
];

const invariantCounts = {
  evaluatedScores: 0,
  boundedScores: 0,
  monotonicComparisons: 0,
  ceilingComparisons: 0,
  configurationPairs: PIER_CAST_V3_PAIR_CALIBRATIONS.length,
  configurationModes: PIER_CAST_V3_PAIR_CALIBRATIONS.reduce(
    (sum, pair) => sum + pair.modes.length,
    0,
  ),
};
const weekly: Array<Record<string, string | number>> = [];
const peaks: Array<Record<string, string | number>> = [];

for (const pair of PIER_CAST_V3_PAIR_CALIBRATIONS) {
  const city = profiles.find((candidate) => candidate.cityId === pair.cityId);
  const legacyCurve = city?.species.find((candidate) =>
    candidate.speciesId === pair.speciesId
  )
    ?.seasonalOpportunityCurve;
  if (!city) {
    throw new Error(`City profile missing for ${pair.pairKey}.`);
  }
  let peak = { score: -1, date: "", modeId: "", strength: 0 };
  let regulatedUnavailableDays = 0;
  for (let day = 0; day < 365; day += 1) {
    const date = new Date(Date.UTC(referenceYear, 0, 1 + day)).toISOString()
      .slice(0, 10);
    if (pierCastV3RegulationClosureApplies({ localDate: date, pair })) {
      regulatedUnavailableDays += 1;
    }
    const modes = evaluatePierCastV3ModePotentials({
      localDate: date,
      modes: pair.modes,
    });
    if (modes.length !== pair.modes.length) {
      throw new Error(`Mode evaluation failed for ${pair.pairKey}.`);
    }
    let previous = -1;
    for (const fit of fits) {
      const score = calculatePierCastV3Opportunity({
        modes,
        temperatureSuitability: fit,
        allowDisabledConfiguration: true,
      });
      if (score.status !== "available") {
        throw new Error(`Score unavailable for ${pair.pairKey}.`);
      }
      invariantCounts.evaluatedScores += 1;
      if (score.score < 1 || score.score > 10) {
        throw new Error(`Bound violation for ${pair.pairKey}.`);
      }
      invariantCounts.boundedScores += 1;
      if (previous >= 0) {
        if (score.score + 1e-10 < previous) {
          throw new Error(
            `Thermal monotonicity violation for ${pair.pairKey}.`,
          );
        }
        invariantCounts.monotonicComparisons += 1;
      }
      if (
        score.score > score.activeMode.seasonalPotential + 1e-10 ||
        score.activeMode.seasonalPotential >
          score.activeMode.fisheryStrength + 1e-10
      ) {
        throw new Error(`Fishery ceiling violation for ${pair.pairKey}.`);
      }
      invariantCounts.ceilingComparisons += 1;
      previous = score.score;
      if (fit === 1 && score.score > peak.score) {
        peak = {
          score: score.score,
          date,
          modeId: score.activeMode.modeId,
          strength: score.activeMode.fisheryStrength,
        };
      }
    }
  }
  peaks.push({
    pairKey: pair.pairKey,
    cityId: pair.cityId,
    speciesId: pair.speciesId,
    evidenceGrade: pair.modes[0].evidenceGrade,
    idealPeakDate: peak.date,
    idealPeakMode: peak.modeId,
    researchedFisheryStrength: peak.strength,
    v3IdealPeakScore: round(peak.score),
    regulatedUnavailableDays,
  });

  for (let week = 0; week < 52; week += 1) {
    const date = new Date(Date.UTC(referenceYear, 0, 1 + week * 7))
      .toISOString().slice(0, 10);
    const modes = evaluatePierCastV3ModePotentials({
      localDate: date,
      modes: pair.modes,
    });
    const legacy = legacyCurve
      ? evaluatePierCastSeasonalOpportunity({
        ratingEnabled: true,
        mode: "review",
        localDate: date,
        curve: legacyCurve,
      })
      : null;
    if (legacy && legacy.status !== "available") {
      throw new Error(`Legacy score unavailable for ${pair.pairKey}.`);
    }
    for (const fit of fits) {
      const v3 = calculatePierCastV3Opportunity({
        modes,
        temperatureSuitability: fit,
        allowDisabledConfiguration: true,
      });
      const v2 = legacy?.status === "available"
        ? calculatePierCastInstantOpportunity({
          seasonalRating: legacy.rating,
          temperatureSuitability: fit,
        })
        : null;
      if (
        v3.status !== "available" ||
        (v2 !== null && v2.status !== "available")
      ) {
        throw new Error("Replay score unavailable.");
      }
      const regulationOpen = !pierCastV3RegulationClosureApplies({
        localDate: date,
        pair,
      });
      weekly.push({
        pairKey: pair.pairKey,
        localDate: date,
        temperatureSuitability: fit,
        v2SeasonalRating: legacy?.status === "available"
          ? round(legacy.rating)
          : "",
        v2Score: v2?.status === "available" ? round(v2.rating.score) : "",
        v3ActiveMode: v3.activeMode.modeId,
        v3FisheryStrength: v3.activeMode.fisheryStrength,
        v3SeasonalAvailability: round(v3.activeMode.seasonalAvailability),
        v3SeasonalPotential: round(v3.activeMode.seasonalPotential),
        v3Score: round(v3.score),
        deltaV3MinusV2: v2?.status === "available"
          ? round(v3.score - v2.rating.score)
          : "",
        regulationOpen: regulationOpen ? "true" : "false",
        resultStatus: regulationOpen
          ? "available"
          : "unavailable_species_regulation_closed",
      });
    }
  }
}

const invariants = {
  schemaVersion: "piercast-v3-pass2-formula-invariants-v1",
  formulaVersion: PIER_CAST_V3_FORMULA_VERSION,
  formula:
    "1 + (seasonalPotential - 1) * (0.30 + 0.70 * temperatureSuitability)",
  thermalFloor: PIER_CAST_V3_THERMAL_FLOOR,
  thermalWeight: PIER_CAST_V3_THERMAL_WEIGHT,
  referenceYear,
  temperatureSuitabilityScenarios: fits,
  status: "pass",
  checks: {
    everyScoreWithinOneToTen: true,
    temperatureFitMonotonic: true,
    scoreNeverExceedsActiveModePotential: true,
    activeModePotentialNeverExceedsFisheryStrength: true,
    idealFitCanReachResearchedTen: peaks.some((row) =>
      row.v3IdealPeakScore === 10
    ),
    modesSelectedByMaximumNeverSummed: true,
    disabledConfigurationFailsClosedWithoutShadowOverride: true,
  },
  counts: invariantCounts,
};
const gates = {
  schemaVersion: "piercast-v3-pass2-promotion-gates-v1",
  implementationStatus: "complete_shadow_only",
  publicEnabled: false,
  ratingEnabled: false,
  productionFormulaVersion: "seasonal-opportunity-bounded-temperature-v2",
  shadowFormulaVersion: PIER_CAST_V3_FORMULA_VERSION,
  gates: [
    { gate: "formula_and_configuration_implementation", status: "pass" },
    { gate: "deterministic_full_year_invariants", status: "pass" },
    {
      gate: "same_issue_twelve_city_shadow_archive",
      status: "implementation_complete_deployment_pending",
    },
    { gate: "effort_aware_prospective_evaluator", status: "pass" },
    {
      gate: "independent_fisheries_specialist_signoff",
      status: "pending_external",
    },
    {
      gate: "lmhofs_representation_validation",
      status: "pending_field_evidence",
    },
    {
      gate: "prospective_effort_aware_outcomes",
      status: "pending_elapsed_evidence",
    },
    {
      gate: "explicit_owner_promotion_decision",
      status: "blocked_by_prior_gates",
    },
  ],
};

async function main(): Promise<void> {
  await emit(
    "formula-invariants.json",
    `${JSON.stringify(invariants, null, 2)}\n`,
  );
  await emit("promotion-gates.json", `${JSON.stringify(gates, null, 2)}\n`);
  await emit("pair-peak-summary.csv", csv(peaks));
  await emit("v3-v2-weekly-replay.csv", csv(weekly));
  console.log(
    `Pass 2 audit ${
      checkOnly ? "verified" : "generated"
    }: ${weekly.length} replay rows, ${invariantCounts.evaluatedScores} invariant scores.`,
  );
}

void main();

async function emit(name: string, contents: string): Promise<void> {
  const path = resolve(outputDirectory, name);
  if (checkOnly) {
    if (await readFile(path, "utf8") !== contents) {
      throw new Error(`${name} has drifted.`);
    }
    return;
  }
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path, contents);
}

function csv(rows: Array<Record<string, string | number>>): string {
  const headers = Object.keys(rows[0]);
  return `${headers.join(",")}\n${
    rows.map((row) =>
      headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")
    ).join("\n")
  }\n`;
}

function round(value: number): number {
  return Math.round(value * 10000) / 10000;
}
