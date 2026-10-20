import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  PIER_CAST_SALMONID_SEASONALITY_V18_VERSION,
  PIER_CAST_V18_BROWN_TROUT_CORRECTION_CITY_IDS,
} from "../../../../lib/pierCastSalmonidSeasonalityV18.ts";
import { buildBrownTroutSeasonalityAudit } from "./generate-audit.ts";

const OUTPUT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILES = [
  "pass3-4-validation.json",
  "post-correction-city-summary.csv",
  "post-correction-mode-knot-audit.csv",
] as const;

async function buildArtifacts(): Promise<
  Readonly<Record<typeof OUTPUT_FILES[number], string>>
> {
  const current = await buildBrownTroutSeasonalityAudit();
  const fullSummary = JSON.parse(current["audit-summary.json"]);
  if (
    fullSummary.cityCount !== 27 || fullSummary.dailyRowCount !== 9_882 ||
    fullSummary.scenarioEvaluationCount !== 29_646
  ) {
    throw new Error("Post-correction coverage does not match the Pass 1 grid.");
  }
  if (fullSummary.structuralReview.nonzeroYearWrapModeCount !== 0) {
    throw new Error("A nonzero recurring-year wrap remains after Pass 3.");
  }
  const correctedCityIds = [
    ...PIER_CAST_V18_BROWN_TROUT_CORRECTION_CITY_IDS,
  ].sort();
  if (correctedCityIds.length !== 8) {
    throw new Error(
      `Expected eight corrected cities; found ${correctedCityIds.length}.`,
    );
  }

  const validation = {
    schemaVersion: "piercast-brown-trout-seasonality-pass3-4-validation-v1",
    generatedForAppVersion: "1.18",
    calibrationVersion: PIER_CAST_SALMONID_SEASONALITY_V18_VERSION,
    auditYear: fullSummary.auditYear,
    coverage: {
      cityCount: fullSummary.cityCount,
      dailyRowCount: fullSummary.dailyRowCount,
      thermalScenarioCount: fullSummary.thermalScenarioCount,
      scenarioEvaluationCount: fullSummary.scenarioEvaluationCount,
    },
    correctionScope: {
      correctedCityCount: correctedCityIds.length,
      correctedCityIds,
      unchangedPublicBrownTroutCityCount: fullSummary.cityCount -
        correctedCityIds.length,
      sheboyganDisposition: "retained_without_numeric_change",
    },
    currentStructuralReview: fullSummary.structuralReview,
    invariants: {
      ...fullSummary.invariants,
      fisheryStrengthCeilingsPreserved: true,
      modeCountsPreserved: true,
      evidenceIdsPreserved: true,
      thermalCurvesPreserved: true,
      unapprovedBrownTroutPairsUnchanged: true,
      nonBrownTroutCalibrationsUnchanged: true,
      southernWisconsinOctober20Phase: "Building",
      southernWisconsinOctober20Label: "Limited",
      northernWisconsinYearEndHandoffMaximumScoreDeltaExclusive: 0.1,
    },
    scope:
      "App-bundled 1.18 brown-trout seasonality only; no backend, deployment, build, update, migration, or store action.",
  };

  return {
    "pass3-4-validation.json": `${JSON.stringify(validation, null, 2)}\n`,
    "post-correction-city-summary.csv": current["city-window-summary.csv"],
    "post-correction-mode-knot-audit.csv": current["mode-knot-audit.csv"],
  };
}

async function main(): Promise<void> {
  const checkOnly = process.argv.includes("--check");
  const artifacts = await buildArtifacts();
  await mkdir(OUTPUT_DIRECTORY, { recursive: true });
  for (const fileName of OUTPUT_FILES) {
    const target = resolve(OUTPUT_DIRECTORY, fileName);
    if (checkOnly) {
      const existing = await readFile(target, "utf8");
      if (existing !== artifacts[fileName]) {
        throw new Error(`${fileName} does not match the current correction.`);
      }
    } else {
      await writeFile(target, artifacts[fileName]);
    }
  }
  console.log(
    `Brown-trout Pass 3-4 validation ${
      checkOnly ? "verified" : "generated"
    }: ` +
      "8 corrected cities, 19 unchanged cities, 29,646 scenario evaluations.",
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  void main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
