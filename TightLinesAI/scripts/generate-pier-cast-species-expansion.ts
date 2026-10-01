import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pass1Directory = resolve(
  root,
  "docs/onboarding/piercast/species-expansion-pass1",
);
const pass2Directory = resolve(
  root,
  "docs/onboarding/piercast/species-expansion-pass2",
);
const generatedConfigPath = resolve(
  root,
  "supabase/functions/_shared/pierCastEngine/config/speciesExpansion.generated.ts",
);
const checkOnly = process.argv.includes("--check");

const modePath = resolve(pass1Directory, "proposed-opportunity-modes.json");
const thermalPath = resolve(
  pass1Directory,
  "proposed-new-species-thermal-curves.json",
);
const dispositionPath = resolve(
  pass1Directory,
  "new-species-global-dispositions.json",
);
const gatePath = resolve(pass1Directory, "regulation-and-access-gates.json");
const validationPath = resolve(pass1Directory, "validation-report.json");

const modeText = readFileSync(modePath, "utf8");
const thermalText = readFileSync(thermalPath, "utf8");
const dispositionText = readFileSync(dispositionPath, "utf8");
const gateText = readFileSync(gatePath, "utf8");
const validationText = readFileSync(validationPath, "utf8");
const modeArtifact = JSON.parse(modeText) as ModeArtifact;
const thermalArtifact = JSON.parse(thermalText) as ThermalArtifact;
const dispositionArtifact = JSON.parse(dispositionText) as DispositionArtifact;
const gateArtifact = JSON.parse(gateText) as GateArtifact;
const validationArtifact = JSON.parse(validationText) as ValidationArtifact;

assertResearchHandoff();

const pairs = modeArtifact.pairs.map((pair) => {
  const [cityId, speciesId] = pair.pairKey.split("/");
  if (!cityId || !speciesId) {
    throw new Error(`Invalid pair key ${pair.pairKey}.`);
  }
  return {
    pairKey: pair.pairKey,
    cityId,
    speciesId,
    ratingEnabled: false as const,
    modes: pair.modes.map((mode) => ({
      modeCalibrationId:
        `${cityId}__${speciesId}__${mode.modeId}__v3_species_expansion_v1`,
      modeId: mode.modeId,
      fisheryStrength: mode.fisheryStrength,
      availabilityKnots: mode.availabilityKnots.map(
        ([monthDay, availability]) => ({ monthDay, availability }),
      ),
      thermalCurveId: mode.thermalCurveId,
    })),
  };
});

const modes = modeArtifact.pairs.flatMap((pair) => {
  const [cityId, speciesId] = pair.pairKey.split("/");
  return pair.modes.map((mode) => ({
    modeCalibrationId:
      `${cityId}__${speciesId}__${mode.modeId}__v3_species_expansion_v1`,
    pairKey: pair.pairKey,
    modeId: mode.modeId,
    modeName: mode.modeName,
    evidenceGrade: mode.evidenceGrade,
    fisheryEvidenceIds: mode.evidenceIds,
    limitations: [
      ...modeArtifact.globalLimitations,
      ...(pair.pairKey === "grand_haven_mi/lake_whitefish" &&
          mode.modeId === "lawful_fall_spawning_aggregation"
        ? [
          "Historical November snagging harvest is excluded from lawful bite-strength calibration; the current single-hook restriction must be displayed.",
        ]
        : []),
    ],
  }));
});

const thermalCurves = thermalArtifact.curves.map((curve) => ({
  speciesId: curve.speciesId,
  curve: {
    curveId: curve.curveId,
    calibrationStatus: "provisional" as const,
    acceptedDomainC: curve.acceptedDomainC,
    knots: curve.knots,
  },
  thermalEvidenceIds: curve.thermalEvidenceIds,
  rationale: curve.rationale,
  limitations: curve.limitations,
}));

const runtimeArtifact = {
  schemaVersion: "piercast-v3-species-expansion-runtime-candidates-v1",
  importedByRuntime: true,
  ratingEnabled: false,
  publicEnabled: false,
  formulaImplemented: true,
  sourceSchemaVersion: modeArtifact.schemaVersion,
  sourceSha256: sha256(modeText),
  candidates: pairs,
};

const calibrationArtifact = {
  schemaVersion: "piercast-v3-species-expansion-mode-calibrations-v1",
  status: "implementation_complete_shadow_only",
  ratingEnabled: false,
  publicEnabled: false,
  sourceSchemaVersion: modeArtifact.schemaVersion,
  sourceSha256: sha256(modeText),
  modes,
};

const thermalRuntimeArtifact = {
  schemaVersion: "piercast-v3-species-expansion-thermal-runtime-v1",
  status: "implementation_complete_provisional",
  sourceSchemaVersion: thermalArtifact.schemaVersion,
  sourceSha256: sha256(thermalText),
  curves: thermalCurves,
};

const newSpecies = dispositionArtifact.species.map((species) => ({
  speciesId: species.speciesId,
  displayName: species.displayName,
  scientificName: species.scientificName,
  admittedCities: species.admittedCities,
}));
const admissionPairs = pairs.map((pair) => pair.pairKey);
const notice = {
  noticeId: "grand_haven_november_single_hook_restriction",
  cityId: "grand_haven_mi",
  speciesId: "all",
  startMonthDay: "11-01",
  endMonthDay: "11-30",
  reasonCode: "special_tackle_restriction",
  title: "November single-hook restriction",
  message:
    "Within the defined Port of Grand Haven during November, use only one single-pointed, unweighted hook no larger than one-half inch from point to shank. Verify current regulations before fishing.",
  evidenceIds: ["EXP_MI_FO202_26", "EXP_MI_REGS_2026"],
} as const;

const generated = `/* eslint-disable */
/**
 * GENERATED FILE — DO NOT HAND EDIT.
 * Source: evidence-frozen PierCast species-expansion Pass 1 artifacts.
 * Regenerate with npm run generate:pier-cast:species-expansion.
 */
import type { PierCastSpeciesId, PierCastTemperatureCurve } from "../types.ts";

export const PIER_CAST_SPECIES_EXPANSION_VERSION = "piercast-v3-species-expansion-v1" as const;
export const PIER_CAST_SPECIES_EXPANSION_SOURCE_SHA256 = ${
  JSON.stringify(
    sha256(`${modeText}\n${thermalText}\n${dispositionText}\n${gateText}`),
  )
} as const;
export const PIER_CAST_SPECIES_EXPANSION_ADMITTED_PAIR_KEYS = ${
  JSON.stringify(
    admissionPairs,
    null,
    2,
  )
} as const;
export const PIER_CAST_SPECIES_EXPANSION_NEW_SPECIES = ${
  JSON.stringify(
    newSpecies,
    null,
    2,
  )
} as const satisfies readonly {
  speciesId: PierCastSpeciesId;
  displayName: string;
  scientificName: string;
  admittedCities: readonly string[];
}[];
export const PIER_CAST_SPECIES_EXPANSION_TEMPERATURE_CURVES = ${
  JSON.stringify(
    thermalCurves.map(({ speciesId, curve }) => ({ speciesId, curve })),
    null,
    2,
  )
} as const satisfies readonly {
  speciesId: PierCastSpeciesId;
  curve: PierCastTemperatureCurve;
}[];
export const PIER_CAST_SPECIES_EXPANSION_REGULATION_NOTICES = ${
  JSON.stringify(
    [notice],
    null,
    2,
  )
} as const;
`;

emit(
  resolve(pass2Directory, "runtime-candidates.json"),
  `${JSON.stringify(runtimeArtifact, null, 2)}\n`,
);
emit(
  resolve(pass2Directory, "mode-calibrations.json"),
  `${JSON.stringify(calibrationArtifact, null, 2)}\n`,
);
emit(
  resolve(pass2Directory, "thermal-curves.json"),
  `${JSON.stringify(thermalRuntimeArtifact, null, 2)}\n`,
);
emit(generatedConfigPath, generated);

console.log(
  `Species expansion ${
    checkOnly ? "verified" : "generated"
  }: ${pairs.length} pairs, ${modes.length} modes, ${thermalCurves.length} new thermal curves.`,
);

function assertResearchHandoff(): void {
  if (
    modeArtifact.status !== "research_complete_not_implemented" ||
    modeArtifact.pairs.length !== 24 ||
    modeArtifact.pairs.reduce((sum, pair) => sum + pair.modes.length, 0) !==
      33 ||
    thermalArtifact.status !== "research_complete_not_implemented" ||
    thermalArtifact.curves.length !== 4 ||
    dispositionArtifact.species.length !== 4 ||
    validationArtifact.status !== "pass" ||
    validationArtifact.checks.admittedRows !== 24 ||
    validationArtifact.checks.opportunityModes !== 33 ||
    gateArtifact.status !== "research_complete_not_implemented"
  ) {
    throw new Error(
      "Species-expansion Pass 1 handoff is incomplete or drifted.",
    );
  }
  const pairKeys = new Set<string>();
  for (const pair of modeArtifact.pairs) {
    if (pairKeys.has(pair.pairKey) || pair.modes.length === 0) {
      throw new Error(`Invalid expansion pair ${pair.pairKey}.`);
    }
    pairKeys.add(pair.pairKey);
    for (const mode of pair.modes) {
      if (
        mode.fisheryStrength < 2.1 || mode.fisheryStrength > 10 ||
        mode.availabilityKnots.length < 2 ||
        mode.availabilityKnots.some(([, value]) => value < 0 || value > 1)
      ) {
        throw new Error(
          `Invalid expansion mode ${pair.pairKey}/${mode.modeId}.`,
        );
      }
    }
  }
  const hookGate = gateArtifact.gates.find((gate) =>
    gate.gateId === "grand_haven_november_single_hook_restriction"
  );
  if (!hookGate) throw new Error("Grand Haven regulation gate is missing.");
}

function emit(path: string, contents: string): void {
  if (checkOnly) {
    if (readFileSync(path, "utf8") !== contents) {
      throw new Error(`${path} has drifted.`);
    }
    return;
  }
  mkdirSync(resolve(path, ".."), { recursive: true });
  writeFileSync(path, contents);
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

type ModeArtifact = {
  schemaVersion: string;
  status: string;
  globalLimitations: string[];
  pairs: Array<{
    pairKey: string;
    modes: Array<{
      modeId: string;
      modeName: string;
      fisheryStrength: number;
      availabilityKnots: Array<[string, number]>;
      thermalCurveId: string;
      evidenceGrade: "A" | "B";
      evidenceIds: string[];
    }>;
  }>;
};

type ThermalArtifact = {
  schemaVersion: string;
  status: string;
  curves: Array<{
    speciesId: string;
    curveId: string;
    acceptedDomainC: [number, number];
    knots: Array<{ temperatureC: number; suitability: number }>;
    thermalEvidenceIds: string[];
    rationale: string;
    limitations: string[];
  }>;
};

type DispositionArtifact = {
  species: Array<{
    speciesId: string;
    displayName: string;
    scientificName: string;
    admittedCities: string[];
  }>;
};

type GateArtifact = {
  status: string;
  gates: Array<{ gateId: string }>;
};

type ValidationArtifact = {
  status: string;
  checks: { admittedRows: number; opportunityModes: number };
};
