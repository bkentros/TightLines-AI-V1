import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  PIER_CAST_V3_PAIR_CALIBRATIONS,
} from "../../../../supabase/functions/_shared/pierCastEngine/config/v3Calibration.generated.ts";
import { PIER_CAST_V3_SPECIES_IDS } from "../../../../supabase/functions/_shared/pierCastEngine/config/v3Calibration.ts";

const directory = import.meta.dirname;
const pierCastDirectory = resolve(directory, "..");
const michiganCities = [
  ["ludington_mi", "Ludington"],
  ["grand_haven_mi", "Grand Haven"],
  ["manistee_mi", "Manistee"],
  ["frankfort_elberta_mi", "Frankfort–Elberta"],
  ["harbor_beach_mi", "Harbor Beach"],
  ["oscoda_mi", "Oscoda"],
  ["port_sanilac_mi", "Port Sanilac"],
] as const;

const coreDecisions = JSON.parse(readFileSync(resolve(
  pierCastDirectory,
  "scoring-v3-pass1/final-decision-matrix.json",
), "utf8")).rows;
const lakeHuronDecisions = JSON.parse(readFileSync(resolve(
  pierCastDirectory,
  "lake-huron-expansion/candidate-decision-matrix.json",
), "utf8")).rows;
const newSpecies = JSON.parse(readFileSync(resolve(
  pierCastDirectory,
  "species-expansion-pass1/new-species-global-dispositions.json",
), "utf8")).species;

const cityName = new Map(michiganCities);
async function main(): Promise<void> {
const numericPairs = PIER_CAST_V3_PAIR_CALIBRATIONS.filter((pair) =>
  cityName.has(pair.cityId as typeof michiganCities[number][0])
);

if (numericPairs.length !== 72) {
  throw new Error(`Expected 72 scored Michigan pairs; found ${numericPairs.length}.`);
}

const auditRows = numericPairs.map((pair) => {
  const peakMode = [...pair.modes].sort((left, right) =>
    right.fisheryStrength - left.fisheryStrength
  )[0];
  const origins = new Set(pair.modes.map((mode) => origin(mode.modeCalibrationId)));
  if (origins.size !== 1) throw new Error(`Mixed calibration lineage: ${pair.pairKey}`);
  const lineage = [...origins][0];
  const grades = [...new Set(pair.modes.map((mode) => mode.evidenceGrade))].sort();
  const evidenceIds = [...new Set(pair.modes.flatMap((mode) => mode.fisheryEvidenceIds))].sort();
  const quantitative = lineage === "core" || lineage === "secondary" ||
    evidenceIds.includes("EXP_MI_CREEL");
  return {
    cityId: pair.cityId,
    cityName: cityName.get(pair.cityId as typeof michiganCities[number][0]),
    speciesId: pair.speciesId,
    pairKey: pair.pairKey,
    peakFisheryStrength: peakMode.fisheryStrength,
    peakModeId: peakMode.modeId,
    evidenceGrades: grades.join("+"),
    calibrationLineage: lineage,
    magnitudeEvidence: quantitative
      ? "direct_port_pier_dock_quantitative_or_matched_extract"
      : "official_exact_city_or_port_qualitative",
    auditDecision: "retain",
    confidencePenaltyFound: false,
    auditRationale: rationale(lineage, quantitative, grades),
    evidenceIds: evidenceIds.join("|"),
  };
});

for (const row of auditRows) {
  if (
    !Number.isFinite(row.peakFisheryStrength) || row.peakFisheryStrength < 2.1 ||
    row.peakFisheryStrength > 10
  ) throw new Error(`Peak outside rubric: ${row.pairKey}`);
}

const numericByPair = new Map<string, (typeof auditRows)[number]>(
  auditRows.map((row) => [row.pairKey, row]),
);
const rosterRows = michiganCities.flatMap(([cityId, displayName]) =>
  PIER_CAST_V3_SPECIES_IDS.map((speciesId) => {
    const pairKey = `${cityId}/${speciesId}`;
    const numeric = numericByPair.get(pairKey);
    if (numeric) {
      return {
        cityId,
        cityName: displayName,
        speciesId,
        pairKey,
        currentTreatment: "numeric",
        decision: "retain_numeric",
        peakFisheryStrength: numeric.peakFisheryStrength,
        decisionSource: numeric.calibrationLineage,
        rationale: numeric.auditRationale,
      };
    }
    const decision = resolveNoScoreDecision(cityId, speciesId);
    if (!decision) throw new Error(`No explicit decision for ${pairKey}.`);
    return {
      cityId,
      cityName: displayName,
      speciesId,
      pairKey,
      currentTreatment: "no_score",
      decision: decision.disposition,
      peakFisheryStrength: "",
      decisionSource: decision.source,
      rationale: decision.rationale,
    };
  })
);

if (rosterRows.length !== 133 || rosterRows.filter((row) => row.currentTreatment === "numeric").length !== 72) {
  throw new Error("Michigan 7-city × 19-species manifest is incomplete.");
}

const rankings = [...auditRows].sort((left, right) =>
  left.speciesId.localeCompare(right.speciesId) ||
  right.peakFisheryStrength - left.peakFisheryStrength ||
  left.cityId.localeCompare(right.cityId)
).map((row, index, all) => ({
  speciesId: row.speciesId,
  rank: all.slice(0, index).filter((candidate) => candidate.speciesId === row.speciesId).length + 1,
  cityId: row.cityId,
  cityName: row.cityName,
  peakFisheryStrength: row.peakFisheryStrength,
  evidenceGrades: row.evidenceGrades,
  calibrationLineage: row.calibrationLineage,
}));

const noScore = rosterRows.filter((row) => row.currentTreatment === "no_score");
const summary = {
  schemaVersion: "piercast-michigan-all-scored-species-audit-v1",
  reviewedAt: "2026-09-18",
  cities: michiganCities.length,
  catalogSpecies: PIER_CAST_V3_SPECIES_IDS.length,
  rosterCells: rosterRows.length,
  numericPairs: auditRows.length,
  numericRetained: auditRows.filter((row) => row.auditDecision === "retain").length,
  numericRevised: 0,
  confidencePenaltiesFound: auditRows.filter((row) => row.confidencePenaltyFound).length,
  noScoreCells: noScore.length,
  noScoreDefers: noScore.filter((row) => row.decision === "defer").length,
  noScoreExcludes: noScore.filter((row) => row.decision === "exclude").length,
  evidenceGrades: Object.fromEntries(
    [...new Set(auditRows.map((row) => row.evidenceGrades))].sort().map((grade) => [
      grade,
      auditRows.filter((row) => row.evidenceGrades === grade).length,
    ]),
  ),
  lineages: Object.fromEntries(
    ["core", "secondary", "lake_huron", "species_expansion"].map((lineage) => [
      lineage,
      auditRows.filter((row) => row.calibrationLineage === lineage).length,
    ]),
  ),
  hardMaximum: 10,
  observedPeakRange: [
    Math.min(...auditRows.map((row) => row.peakFisheryStrength)),
    Math.max(...auditRows.map((row) => row.peakFisheryStrength)),
  ],
};

await Promise.all([
  writeFile(resolve(directory, "audit-summary.json"), `${JSON.stringify(summary, null, 2)}\n`),
  writeFile(resolve(directory, "scored-pair-audit.csv"), csv(auditRows)),
  writeFile(resolve(directory, "full-roster-decision-audit.csv"), csv(rosterRows)),
  writeFile(resolve(directory, "michigan-species-rankings.csv"), csv(rankings)),
]);

console.log(JSON.stringify(summary));
}

function origin(modeCalibrationId: string): string {
  if (modeCalibrationId.includes("lake_huron")) return "lake_huron";
  if (modeCalibrationId.includes("species_expansion")) return "species_expansion";
  if (modeCalibrationId.includes("secondary")) return "secondary";
  return "core";
}

function rationale(lineage: string, quantitative: boolean, grades: string[]): string {
  if (lineage === "core") {
    return "Retained: multi-year Michigan DNR port/month Pier/Dock estimates, matched all-species effort and recurring dated reports set the absolute peak; evidence grade is not used in score arithmetic.";
  }
  if (lineage === "secondary") {
    return "Retained: Michigan DNR Pier/Dock recurrence and relative catch per 1,000 all-species hours set cross-port magnitude; sparse strata or missing directed effort remain confidence limitations only.";
  }
  if (quantitative) {
    return "Retained: the preserved Michigan DNR Pier/Dock extract supplies recurrence and relative magnitude; exact-pier reports set timing, and evidence grade is not a multiplier.";
  }
  return grades.includes("B")
    ? "Retained: official exact-city/port target identity and qualitative event magnitude support an ordinary bounded peak; missing standardized effort remains Grade B and is not subtracted from the score. Stronger magnitude is not inferred from regional or boat evidence."
    : "Retained: repeated official exact-city pier/breakwall reports, including explicit qualitative magnitude, support the peak and seasonal mode without a confidence multiplier.";
}

function resolveNoScoreDecision(cityId: string, speciesId: string): {
  disposition: "defer" | "exclude";
  source: string;
  rationale: string;
} | null {
  const pairKey = `${cityId}/${speciesId}`;
  const expansionSpecies = newSpecies.find((species: { speciesId: string }) => species.speciesId === speciesId);
  if (expansionSpecies) {
    const text = expansionSpecies.cityDispositions[cityId];
    if (!text) return null;
    return {
      disposition: text.startsWith("defer") ? "defer" : "exclude",
      source: "species_expansion_global_dispositions",
      rationale: text.replace(/^(defer|exclude):\s*/, ""),
    };
  }
  const lake = lakeHuronDecisions.find((row: { pairKey: string }) => row.pairKey === pairKey);
  if (lake && ["defer", "exclude"].includes(lake.disposition)) {
    return {
      disposition: lake.disposition,
      source: "lake_huron_candidate_matrix",
      rationale: lake.rationale,
    };
  }
  const core = coreDecisions.find((row: { cityId: string; speciesId: string }) =>
    row.cityId === cityId && row.speciesId === speciesId
  );
  if (core && ["defer", "exclude"].includes(core.finalDisposition)) {
    return {
      disposition: core.finalDisposition,
      source: "v3_pass1_final_matrix",
      rationale: core.rationale,
    };
  }
  return null;
}

function csv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const columns = Object.keys(rows[0]);
  return `${columns.join(",")}\n${rows.map((row) =>
    columns.map((column) => quote(row[column])).join(",")
  ).join("\n")}\n`;
}

function quote(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
