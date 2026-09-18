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

assertPass1(candidateArtifact, calibrationArtifact);
assertSecondary(secondaryCandidateArtifact, secondaryCalibrationArtifact);
assertLakeHuron(lakeHuronCandidateArtifact, lakeHuronCalibrationArtifact);
assertSpeciesExpansion(
  speciesExpansionCandidateArtifact,
  speciesExpansionCalibrationArtifact,
);
assertFiveCity(fiveCityDecisionArtifact, fiveCityCalibrationArtifact);
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

const pairs = [
  ...candidateArtifact.candidates,
  ...secondaryCandidateArtifact.candidates,
  ...lakeHuronCandidateArtifact.candidates,
  ...speciesExpansionCandidateArtifact.candidates,
  ...fiveCityPairs,
].map((pair) => ({
  ...pair,
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
  pairs.length !== 118 ||
  new Set(pairs.map((pair) => pair.pairKey)).size !== pairs.length ||
  pairs.reduce((sum, pair) => sum + pair.modes.length, 0) !== 239
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

export const PIER_CAST_V3_CONFIG_VERSION = "piercast-v3-seventeen-city-five-city-pass3-v7" as const;
export const PIER_CAST_V3_SOURCE_SCHEMA_VERSION = "piercast-v3-composite-source-v6" as const;
export const PIER_CAST_V3_SOURCE_SHA256 = ${
  JSON.stringify(
    sha256(
      `${candidateText}\n${secondaryCandidateText}\n${lakeHuronCandidateText}\n${speciesExpansionCandidateText}\n${fiveCityDecisionText}`,
    ),
  )
} as const;
export const PIER_CAST_V3_CALIBRATION_SHA256 = ${
  JSON.stringify(
    sha256(
      `${calibrationText}\n${secondaryCalibrationText}\n${lakeHuronCalibrationText}\n${speciesExpansionCalibrationText}\n${fiveCityCalibrationText}`,
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
      !pairKeys.has(mode.pairKey) || mode.evidenceGrade !== "B" ||
      mode.fisheryStrength < 1 || mode.fisheryStrength > 10
    ) ||
    [...pairKeys].some((pairKey) =>
      !calibrations.modes.some((mode) => mode.pairKey === pairKey)
    )
  ) throw new Error("Five-city modes do not match the admitted manifest.");
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
    evidenceGrade: "A" | "B";
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
    evidenceGrade: "B";
    availabilityKnots: Array<{ monthDay: string; availability: number }>;
    thermalCurveId: string;
    fisheryEvidenceIds: string[];
    limitations: string[];
  }>;
};
