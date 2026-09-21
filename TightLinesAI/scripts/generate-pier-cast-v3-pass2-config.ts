import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pass1Directory = resolve(
  root,
  "docs/onboarding/piercast/scoring-v3-pass1",
);
const candidatePath = resolve(
  pass1Directory,
  "v3-disabled-runtime-candidates.json",
);
const calibrationPath = resolve(pass1Directory, "v3-mode-calibrations.json");
const secondaryDirectory = resolve(
  root,
  "docs/onboarding/piercast/scoring-v3-secondary",
);
const secondaryCandidatePath = resolve(
  secondaryDirectory,
  "secondary-runtime-candidates.json",
);
const secondaryCalibrationPath = resolve(
  secondaryDirectory,
  "secondary-mode-calibrations.json",
);
const lakeHuronDirectory = resolve(
  root,
  "docs/onboarding/piercast/lake-huron-expansion",
);
const lakeHuronCandidatePath = resolve(
  lakeHuronDirectory,
  "admitted-runtime-candidates.json",
);
const lakeHuronCalibrationPath = resolve(
  lakeHuronDirectory,
  "opportunity-mode-calibrations.json",
);
const speciesExpansionDirectory = resolve(
  root,
  "docs/onboarding/piercast/species-expansion-pass2",
);
const speciesExpansionCandidatePath = resolve(
  speciesExpansionDirectory,
  "runtime-candidates.json",
);
const speciesExpansionCalibrationPath = resolve(
  speciesExpansionDirectory,
  "mode-calibrations.json",
);
const fiveCityDirectory = resolve(
  root,
  "docs/onboarding/piercast/five-city-2026-09-pass2",
);
const fiveCityDecisionPath = resolve(fiveCityDirectory, "pair-decisions.json");
const fiveCityCalibrationPath = resolve(
  fiveCityDirectory,
  "private-mode-calibrations.json",
);
const chicagoAlpenaDirectory = resolve(
  root,
  "docs/onboarding/piercast/chicago-alpena-2026-09-pass2",
);
const chicagoAlpenaDecisionPath = resolve(
  chicagoAlpenaDirectory,
  "pair-decisions.json",
);
const chicagoAlpenaCalibrationPath = resolve(
  chicagoAlpenaDirectory,
  "private-mode-calibrations.json",
);
const stJosephHarrisvilleDirectory = resolve(
  root,
  "docs/onboarding/piercast/st-joseph-harrisville-2026-09-pass2",
);
const stJosephHarrisvilleDecisionPath = resolve(
  stJosephHarrisvilleDirectory,
  "pair-decisions.json",
);
const stJosephHarrisvilleCalibrationPath = resolve(
  stJosephHarrisvilleDirectory,
  "private-mode-calibrations.json",
);
const outputPath = resolve(
  root,
  "supabase/functions/_shared/pierCastEngine/config/v3Calibration.generated.ts",
);

const candidateText = readFileSync(candidatePath, "utf8");
const calibrationText = readFileSync(calibrationPath, "utf8");
const secondaryCandidateText = readFileSync(secondaryCandidatePath, "utf8");
const secondaryCalibrationText = readFileSync(
  secondaryCalibrationPath,
  "utf8",
);
const lakeHuronCandidateText = readFileSync(lakeHuronCandidatePath, "utf8");
const lakeHuronCalibrationText = readFileSync(lakeHuronCalibrationPath, "utf8");
const speciesExpansionCandidateText = readFileSync(
  speciesExpansionCandidatePath,
  "utf8",
);
const speciesExpansionCalibrationText = readFileSync(
  speciesExpansionCalibrationPath,
  "utf8",
);
const fiveCityDecisionText = readFileSync(fiveCityDecisionPath, "utf8");
const fiveCityCalibrationText = readFileSync(fiveCityCalibrationPath, "utf8");
const chicagoAlpenaDecisionText = readFileSync(
  chicagoAlpenaDecisionPath,
  "utf8",
);
const chicagoAlpenaCalibrationText = readFileSync(
  chicagoAlpenaCalibrationPath,
  "utf8",
);
const stJosephHarrisvilleDecisionText = readFileSync(
  stJosephHarrisvilleDecisionPath,
  "utf8",
);
const stJosephHarrisvilleCalibrationText = readFileSync(
  stJosephHarrisvilleCalibrationPath,
  "utf8",
);
const candidateArtifact = JSON.parse(candidateText) as CandidateArtifact;
const calibrationArtifact = JSON.parse(calibrationText) as CalibrationArtifact;
const secondaryCandidateArtifact = JSON.parse(
  secondaryCandidateText,
) as CandidateArtifact;
const secondaryCalibrationArtifact = JSON.parse(
  secondaryCalibrationText,
) as CalibrationArtifact;
const lakeHuronCandidateArtifact = JSON.parse(
  lakeHuronCandidateText,
) as CandidateArtifact;
const lakeHuronCalibrationArtifact = JSON.parse(
  lakeHuronCalibrationText,
) as CalibrationArtifact;
const speciesExpansionCandidateArtifact = JSON.parse(
  speciesExpansionCandidateText,
) as CandidateArtifact;
const speciesExpansionCalibrationArtifact = JSON.parse(
  speciesExpansionCalibrationText,
) as CalibrationArtifact;
const fiveCityDecisionArtifact = JSON.parse(
  fiveCityDecisionText,
) as FiveCityDecisionArtifact;
const fiveCityCalibrationArtifact = JSON.parse(
  fiveCityCalibrationText,
) as FiveCityCalibrationArtifact;
const chicagoAlpenaDecisionArtifact = JSON.parse(
  chicagoAlpenaDecisionText,
) as ChicagoAlpenaDecisionArtifact;
const chicagoAlpenaCalibrationArtifact = JSON.parse(
  chicagoAlpenaCalibrationText,
) as ChicagoAlpenaCalibrationArtifact;
const stJosephHarrisvilleDecisionArtifact = JSON.parse(
  stJosephHarrisvilleDecisionText,
) as StJosephHarrisvilleDecisionArtifact;
const stJosephHarrisvilleCalibrationArtifact = JSON.parse(
  stJosephHarrisvilleCalibrationText,
) as StJosephHarrisvilleCalibrationArtifact;

assertPass1(candidateArtifact, calibrationArtifact);
assertSecondary(secondaryCandidateArtifact, secondaryCalibrationArtifact);
assertLakeHuron(lakeHuronCandidateArtifact, lakeHuronCalibrationArtifact);
assertSpeciesExpansion(
  speciesExpansionCandidateArtifact,
  speciesExpansionCalibrationArtifact,
);
assertFiveCity(fiveCityDecisionArtifact, fiveCityCalibrationArtifact);
assertChicagoAlpena(
  chicagoAlpenaDecisionArtifact,
  chicagoAlpenaCalibrationArtifact,
);
assertStJosephHarrisville(
  stJosephHarrisvilleDecisionArtifact,
  stJosephHarrisvilleCalibrationArtifact,
);
const modesById = new Map(
  [
    ...calibrationArtifact.modes,
    ...secondaryCalibrationArtifact.modes,
    ...lakeHuronCalibrationArtifact.modes,
    ...speciesExpansionCalibrationArtifact.modes,
    ...fiveCityCalibrationArtifact.modes.map((mode) => ({
      ...mode,
      modeName: mode.modeId.split("_").map((word) =>
        word[0].toUpperCase() + word.slice(1)
      ).join(" "),
    })),
    ...chicagoAlpenaCalibrationArtifact.modes.map((mode) => ({
      ...mode,
      modeName: mode.modeId.split("_").map((word) =>
        word[0].toUpperCase() + word.slice(1)
      ).join(" "),
    })),
    ...stJosephHarrisvilleCalibrationArtifact.modes.map((mode) => ({
      modeCalibrationId: mode.mode_calibration_id,
      modeId: mode.mode_id,
      pairKey: mode.pair_key,
      fisheryStrength: mode.fishery_strength,
      evidenceGrade: mode.evidence_grade,
      availabilityKnots: mode.availability_knots.map((knot) => ({
        monthDay: knot.month_day,
        availability: knot.availability,
      })),
      thermalCurveId: mode.thermal_curve_id,
      fisheryEvidenceIds: mode.fishery_evidence_ids,
      limitations: mode.limitations,
      modeName: mode.mode_id.split("_").map((word) =>
        word[0].toUpperCase() + word.slice(1)
      ).join(" "),
    })),
  ].map(
    (mode) => [mode.modeCalibrationId, mode],
  ),
);
const fiveCityPairs = fiveCityDecisionArtifact.decisions
  .filter((decision) => decision.pass2Disposition === "numeric_shadow")
  .map((decision) => ({
    pairKey: decision.pairKey,
    cityId: decision.cityId,
    speciesId: decision.speciesId,
    ratingEnabled: false as const,
    ...(decision.pairKey === "waukegan_il/yellow_perch"
      ? {
        closedWindows: [{
          startMonthDay: "05-01",
          endMonthDay: "06-15",
          reasonCode: "species_regulation_closed" as const,
          evidenceIds: ["IL_REGULATIONS_2026"],
        }],
      }
      : {}),
    modes: fiveCityCalibrationArtifact.modes
      .filter((mode) => mode.pairKey === decision.pairKey)
      .map((mode) => ({
        modeCalibrationId: mode.modeCalibrationId,
        modeId: mode.modeId,
        fisheryStrength: mode.fisheryStrength,
        availabilityKnots: mode.availabilityKnots,
        thermalCurveId: mode.thermalCurveId,
      })),
  }));
const chicagoAlpenaPairs = chicagoAlpenaDecisionArtifact.decisions
  .filter((decision) => decision.pass2Disposition === "numeric_private")
  .map((decision) => ({
    pairKey: decision.pairKey,
    cityId: decision.cityId,
    speciesId: decision.speciesId,
    ratingEnabled: false as const,
    ...(decision.pairKey === "chicago_il/yellow_perch"
      ? {
        closedWindows: [{
          startMonthDay: "05-01",
          endMonthDay: "06-15",
          reasonCode: "species_regulation_closed" as const,
          evidenceIds: ["IL_RULES_2026"],
        }],
      }
      : {}),
    modes: chicagoAlpenaCalibrationArtifact.modes
      .filter((mode) => mode.pairKey === decision.pairKey)
      .map((mode) => ({
        modeCalibrationId: mode.modeCalibrationId,
        modeId: mode.modeId,
        fisheryStrength: mode.fisheryStrength,
        availabilityKnots: mode.availabilityKnots,
        thermalCurveId: mode.thermalCurveId,
      })),
  }));
const stJosephHarrisvillePairs = stJosephHarrisvilleDecisionArtifact.decisions
  .filter((decision) => decision.pass2_disposition === "numeric_private")
  .map((decision) => ({
    pairKey: decision.pair_key,
    cityId: decision.city_id,
    speciesId: decision.species_id,
    ratingEnabled: false as const,
    modes: stJosephHarrisvilleCalibrationArtifact.modes
      .filter((mode) => mode.pair_key === decision.pair_key)
      .map((mode) => ({
        modeCalibrationId: mode.mode_calibration_id,
        modeId: mode.mode_id,
        fisheryStrength: mode.fishery_strength,
        availabilityKnots: mode.availability_knots.map((knot) => ({
          monthDay: knot.month_day,
          availability: knot.availability,
        })),
        thermalCurveId: mode.thermal_curve_id,
      })),
  }));

const pairs = [
  ...candidateArtifact.candidates,
  ...secondaryCandidateArtifact.candidates,
  ...lakeHuronCandidateArtifact.candidates,
  ...speciesExpansionCandidateArtifact.candidates,
  ...fiveCityPairs,
  ...chicagoAlpenaPairs,
  ...stJosephHarrisvillePairs,
].map((pair) => ({
  ...pair,
  ...(["frankfort_elberta_mi/lake_trout", "oscoda_mi/lake_trout", "alpena_mi/lake_trout"].includes(
      pair.pairKey,
    )
    ? {
      closedWindows: [{
        startMonthDay: "10-01",
        endMonthDay: "12-31",
        reasonCode: "species_regulation_closed" as const,
        evidenceIds: ["MI_RULES_2026_LAKE_TROUT"],
      }],
    }
    : {}),
  publicEnabled: false as const,
  promotionEligible: false as const,
  modes: pair.modes.map((mode) => {
    const research = modesById.get(mode.modeCalibrationId);
    if (!research) {
      throw new Error(`Missing research mode ${mode.modeCalibrationId}.`);
    }
    return {
      ...mode,
      modeName: research.modeName,
      evidenceGrade: research.evidenceGrade,
      fisheryEvidenceIds: research.fisheryEvidenceIds,
      limitations: research.limitations,
      promotionEligible: false as const,
    };
  }),
}));
if (
  pairs.length !== 222 ||
  new Set(pairs.map((pair) => pair.pairKey)).size !== pairs.length ||
  pairs.reduce((sum, pair) => sum + pair.modes.length, 0) !== 403
) {
  throw new Error("Combined Formula v3 species manifest is incomplete.");
}

const generated = `/* eslint-disable */
/**
 * GENERATED FILE — DO NOT HAND EDIT.
 * Source: Pass 1 evidence-reviewed, disabled runtime candidates.
 * Regenerate with npm run generate:pier-cast:v3-pass2-config.
 */
import type { PierCastV3PairCalibration } from "./v3Calibration.ts";

export const PIER_CAST_V3_CONFIG_VERSION = "piercast-v3-twenty-seven-city-st-joseph-harrisville-pass3-v10" as const;
export const PIER_CAST_V3_SOURCE_SCHEMA_VERSION = "piercast-v3-composite-source-v8" as const;
export const PIER_CAST_V3_SOURCE_SHA256 = ${
  JSON.stringify(
    sha256(
      `${candidateText}\n${secondaryCandidateText}\n${lakeHuronCandidateText}\n${speciesExpansionCandidateText}\n${fiveCityDecisionText}\n${chicagoAlpenaDecisionText}\n${stJosephHarrisvilleDecisionText}`,
    ),
  )
} as const;
export const PIER_CAST_V3_CALIBRATION_SHA256 = ${
  JSON.stringify(
    sha256(
      `${calibrationText}\n${secondaryCalibrationText}\n${lakeHuronCalibrationText}\n${speciesExpansionCalibrationText}\n${fiveCityCalibrationText}\n${chicagoAlpenaCalibrationText}\n${stJosephHarrisvilleCalibrationText}`,
    ),
  )
} as const;
export const PIER_CAST_V3_RATING_ENABLED = false as const;
export const PIER_CAST_V3_PUBLIC_ENABLED = false as const;

export const PIER_CAST_V3_PAIR_CALIBRATIONS = ${
  JSON.stringify(pairs, null, 2)
} as const satisfies readonly PierCastV3PairCalibration[];
`;

if (process.argv.includes("--check")) {
  const current = readFileSync(outputPath, "utf8");
  if (current !== generated) {
    throw new Error("Generated Formula v3 runtime configuration has drifted.");
  }
  console.log(`Formula v3 config is current: ${pairs.length} pairs.`);
} else {
  writeFileSync(outputPath, generated);
  console.log(`Generated ${outputPath} with ${pairs.length} pairs.`);
}

function assertSecondary(
  candidates: CandidateArtifact,
  calibrations: CalibrationArtifact,
): void {
  if (
    candidates.importedByRuntime !== true ||
    candidates.ratingEnabled !== false ||
    candidates.publicEnabled !== false ||
    candidates.formulaImplemented !== true ||
    candidates.candidates.length !== 20 ||
    calibrations.modes.length !== 27
  ) {
    throw new Error(
      "Secondary handoff does not match the reviewed disabled contract.",
    );
  }
  const keys = new Set<string>();
  for (const pair of candidates.candidates) {
    if (
      pair.ratingEnabled !== false || keys.has(pair.pairKey) ||
      pair.modes.length < 1
    ) {
      throw new Error(`Invalid secondary pair ${pair.pairKey}.`);
    }
    keys.add(pair.pairKey);
  }
}

function assertLakeHuron(
  candidates: CandidateArtifact,
  calibrations: CalibrationArtifact,
): void {
  if (
    candidates.importedByRuntime !== true ||
    candidates.ratingEnabled !== false ||
    candidates.publicEnabled !== false ||
    candidates.formulaImplemented !== true ||
    candidates.candidates.length !== 14 ||
    calibrations.modes.length !== 21
  ) {
    throw new Error(
      "Lake Huron handoff does not match the reviewed disabled contract.",
    );
  }
  const keys = new Set<string>();
  for (const pair of candidates.candidates) {
    if (
      pair.ratingEnabled !== false || keys.has(pair.pairKey) ||
      pair.modes.length < 1
    ) throw new Error(`Invalid Lake Huron pair ${pair.pairKey}.`);
    keys.add(pair.pairKey);
  }
}

function assertSpeciesExpansion(
  candidates: CandidateArtifact,
  calibrations: CalibrationArtifact,
): void {
  if (
    candidates.schemaVersion !==
      "piercast-v3-species-expansion-runtime-candidates-v1" ||
    candidates.importedByRuntime !== true ||
    candidates.ratingEnabled !== false ||
    candidates.publicEnabled !== false ||
    candidates.formulaImplemented !== true ||
    candidates.candidates.length !== 24 ||
    calibrations.modes.length !== 33
  ) {
    throw new Error(
      "Species-expansion handoff does not match the reviewed disabled contract.",
    );
  }
  const keys = new Set<string>();
  for (const pair of candidates.candidates) {
    if (
      pair.ratingEnabled !== false || keys.has(pair.pairKey) ||
      pair.modes.length < 1
    ) throw new Error(`Invalid species-expansion pair ${pair.pairKey}.`);
    keys.add(pair.pairKey);
  }
}

function assertFiveCity(
  decisions: FiveCityDecisionArtifact,
  calibrations: FiveCityCalibrationArtifact,
): void {
  const admitted = decisions.decisions.filter((decision) =>
    decision.pass2Disposition === "numeric_shadow"
  );
  if (
    decisions.schemaVersion !== "piercast-five-city-pass2-pair-decisions-v2" ||
    decisions.counts.numericShadow !== 24 ||
    decisions.counts.researchHold !== 20 ||
    admitted.length !== 24 ||
    calibrations.schemaVersion !==
      "piercast-five-city-pass2-mode-calibrations-v2" ||
    calibrations.status !== "private_shadow_only" ||
    calibrations.modes.length !== 60
  ) throw new Error("Five-city Pass 2 handoff is incomplete.");
  const pairKeys = new Set(admitted.map((decision) => decision.pairKey));
  if (
    pairKeys.size !== 24 ||
    calibrations.modes.some((mode) =>
      !pairKeys.has(mode.pairKey) ||
      !["A", "B"].includes(mode.evidenceGrade) ||
      mode.fisheryStrength < 1 || mode.fisheryStrength > 10
    ) ||
    [...pairKeys].some((pairKey) =>
      !calibrations.modes.some((mode) => mode.pairKey === pairKey)
    )
  ) throw new Error("Five-city modes do not match the admitted manifest.");
}

function assertChicagoAlpena(
  decisions: ChicagoAlpenaDecisionArtifact,
  calibrations: ChicagoAlpenaCalibrationArtifact,
): void {
  const admitted = decisions.decisions.filter((decision) =>
    decision.pass2Disposition === "numeric_private"
  );
  if (
    decisions.schemaVersion !==
      "piercast-chicago-alpena-pass2-pair-decisions-v1" ||
    decisions.dispositionCounts.numeric_private !== 55 ||
    decisions.dispositionCounts.research_hold_unscored !== 23 ||
    decisions.dispositionCounts.exclude_unscored !== 17 ||
    admitted.length !== 55 ||
    calibrations.schemaVersion !==
      "piercast-chicago-alpena-pass2-mode-calibrations-v1" ||
    calibrations.status !== "complete_private_shadow_only" ||
    calibrations.ratingEnabled !== false ||
    calibrations.publicEnabled !== false ||
    calibrations.numericPairCount !== 55 ||
    calibrations.modeCount !== 83 ||
    calibrations.modes.length !== 83
  ) throw new Error("Chicago-Alpena Pass 2 handoff is incomplete.");
  const pairKeys = new Set(admitted.map((decision) => decision.pairKey));
  if (
    pairKeys.size !== 55 ||
    calibrations.modes.some((mode) =>
      !pairKeys.has(mode.pairKey) ||
      !["A", "B"].includes(mode.evidenceGrade) ||
      mode.fisheryStrength < 1 || mode.fisheryStrength > 10
    ) ||
    [...pairKeys].some((pairKey) =>
      !calibrations.modes.some((mode) => mode.pairKey === pairKey)
    )
  ) throw new Error("Chicago-Alpena modes do not match the admitted manifest.");
}

function assertStJosephHarrisville(
  decisions: StJosephHarrisvilleDecisionArtifact,
  calibrations: StJosephHarrisvilleCalibrationArtifact,
): void {
  const admitted = decisions.decisions.filter((decision) =>
    decision.pass2_disposition === "numeric_private"
  );
  if (
    decisions.schema_version !==
      "piercast-st-joseph-harrisville-pass2-pair-decisions-v1" ||
    decisions.disposition_counts.numeric_private !== 49 ||
    decisions.disposition_counts.research_hold_unscored !== 20 ||
    decisions.disposition_counts.exclude_unscored !== 26 ||
    admitted.length !== 49 ||
    calibrations.schema_version !==
      "piercast-st-joseph-harrisville-pass2-mode-calibrations-v1" ||
    calibrations.status !== "complete_private_shadow_only" ||
    calibrations.rating_enabled !== false ||
    calibrations.public_enabled !== false ||
    calibrations.numeric_pair_count !== 49 ||
    calibrations.mode_count !== 81 ||
    calibrations.modes.length !== 81
  ) throw new Error("St. Joseph–Harrisville Pass 2 handoff is incomplete.");
  const pairKeys = new Set(admitted.map((decision) => decision.pair_key));
  if (
    pairKeys.size !== 49 ||
    calibrations.modes.some((mode) =>
      !pairKeys.has(mode.pair_key) ||
      !["A", "B"].includes(mode.evidence_grade) ||
      mode.fishery_strength < 1 || mode.fishery_strength > 10
    ) ||
    [...pairKeys].some((pairKey) =>
      !calibrations.modes.some((mode) => mode.pair_key === pairKey)
    )
  ) throw new Error("St. Joseph–Harrisville modes do not match the admitted manifest.");
}

function assertPass1(
  candidates: CandidateArtifact,
  calibrations: CalibrationArtifact,
): void {
  if (
    candidates.importedByRuntime !== false ||
    candidates.ratingEnabled !== false ||
    candidates.publicEnabled !== false ||
    candidates.formulaImplemented !== false ||
    candidates.candidates.length !== 36 ||
    calibrations.modes.length !== 98
  ) {
    throw new Error(
      "Pass 1 handoff does not match the reviewed disabled contract.",
    );
  }
  const keys = new Set<string>();
  for (const pair of candidates.candidates) {
    if (
      pair.ratingEnabled !== false || keys.has(pair.pairKey) ||
      pair.modes.length < 1
    ) {
      throw new Error(`Invalid Pass 1 pair ${pair.pairKey}.`);
    }
    keys.add(pair.pairKey);
  }
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

type CandidateArtifact = {
  schemaVersion: string;
  importedByRuntime: boolean;
  ratingEnabled: false;
  publicEnabled: false;
  formulaImplemented: boolean;
  candidates: Array<{
    pairKey: string;
    cityId: string;
    speciesId: string;
    ratingEnabled: false;
    closedWindows?: Array<{
      startMonthDay: string;
      endMonthDay: string;
      reasonCode: "species_regulation_closed";
      evidenceIds: string[];
    }>;
    modes: Array<{
      modeCalibrationId: string;
      modeId: string;
      fisheryStrength: number;
      availabilityKnots: Array<{ monthDay: string; availability: number }>;
      thermalCurveId: string;
    }>;
  }>;
};

type CalibrationArtifact = {
  modes: Array<{
    modeCalibrationId: string;
    modeName: string;
    evidenceGrade: "B";
    fisheryEvidenceIds: string[];
    limitations: string[];
  }>;
};

type FiveCityDecisionArtifact = {
  schemaVersion: string;
  counts: { numericShadow: number; researchHold: number };
  decisions: Array<{
    pairKey: string;
    cityId: string;
    speciesId: string;
    pass2Disposition: "numeric_shadow" | "research_hold" | "exclude";
  }>;
};

type FiveCityCalibrationArtifact = {
  schemaVersion: string;
  status: "private_shadow_only";
  modes: Array<{
    modeCalibrationId: string;
    pairKey: string;
    modeId: string;
    fisheryStrength: number;
    evidenceGrade: "A" | "B";
    availabilityKnots: Array<{ monthDay: string; availability: number }>;
    thermalCurveId: string;
    fisheryEvidenceIds: string[];
    limitations: string[];
  }>;
};

type ChicagoAlpenaDecisionArtifact = {
  schemaVersion: string;
  dispositionCounts: {
    numeric_private: number;
    research_hold_unscored: number;
    exclude_unscored: number;
  };
  decisions: Array<{
    pairKey: string;
    cityId: string;
    speciesId: string;
    pass2Disposition:
      | "numeric_private"
      | "research_hold_unscored"
      | "exclude_unscored";
  }>;
};

type ChicagoAlpenaCalibrationArtifact = {
  schemaVersion: string;
  status: "complete_private_shadow_only";
  ratingEnabled: false;
  publicEnabled: false;
  numericPairCount: number;
  modeCount: number;
  modes: Array<{
    modeCalibrationId: string;
    pairKey: string;
    modeId: string;
    fisheryStrength: number;
    evidenceGrade: "A" | "B";
    availabilityKnots: Array<{ monthDay: string; availability: number }>;
    thermalCurveId: string;
    fisheryEvidenceIds: string[];
    limitations: string[];
  }>;
};

type StJosephHarrisvilleDecisionArtifact = {
  schema_version: string;
  disposition_counts: {
    numeric_private: number;
    research_hold_unscored: number;
    exclude_unscored: number;
  };
  decisions: Array<{
    pair_key: string;
    city_id: string;
    species_id: string;
    pass2_disposition:
      | "numeric_private"
      | "research_hold_unscored"
      | "exclude_unscored";
  }>;
};

type StJosephHarrisvilleCalibrationArtifact = {
  schema_version: string;
  status: "complete_private_shadow_only";
  rating_enabled: false;
  public_enabled: false;
  numeric_pair_count: number;
  mode_count: number;
  modes: Array<{
    mode_calibration_id: string;
    pair_key: string;
    mode_id: string;
    fishery_strength: number;
    evidence_grade: "A" | "B";
    availability_knots: Array<{ month_day: string; availability: number }>;
    thermal_curve_id: string;
    fishery_evidence_ids: string[];
    limitations: string[];
  }>;
};
