import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { buildPierCastCatalog } from "../../../../supabase/functions/_shared/pierCastEngine/config/catalog.ts";
import {
  PIER_CAST_V3_CONFIG_VERSION,
  PIER_CAST_V3_PAIR_CALIBRATIONS,
} from "../../../../supabase/functions/_shared/pierCastEngine/config/v3Calibration.ts";
import { evaluatePierCastV3ModePotentials } from "../../../../supabase/functions/_shared/pierCastEngine/scoring/modesV3.ts";
import { calculatePierCastV3Opportunity } from "../../../../supabase/functions/_shared/pierCastEngine/scoring/opportunityV3.ts";

const here = import.meta.dirname;
const checkOnly = process.argv.includes("--check");
const reviewDate = "2026-09-22";
const diagnosticDate = "2026-09-22";
const thermalFits = [0, 0.5, 1] as const;
const targetSpecies = [
  ["chinook_salmon", "Chinook salmon"],
  ["coho_salmon", "Coho salmon"],
  ["atlantic_salmon", "Atlantic salmon"],
  ["steelhead", "Steelhead"],
  ["brown_trout", "Brown trout"],
  ["lake_trout", "Lake trout"],
  ["freshwater_drum", "Freshwater drum"],
] as const;
const targetSpeciesIds = new Set(targetSpecies.map(([id]) => id));
const speciesName = new Map(targetSpecies);
const monthNames = [
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
] as const;
const catalog = buildPierCastCatalog("review", "v3");
const pairs = PIER_CAST_V3_PAIR_CALIBRATIONS.filter((pair) =>
  targetSpeciesIds.has(pair.speciesId as (typeof targetSpecies)[number][0])
);
const pairByKey = new Map(pairs.map((pair) => [pair.pairKey, pair]));

if (catalog.cities.length !== 32) {
  throw new Error(`Expected 32 PierCast cities; got ${catalog.cities.length}.`);
}
if (pairs.length !== 156) {
  throw new Error(
    `Expected 156 scored major-species pairs; got ${pairs.length}.`,
  );
}

const dates = Array.from({ length: 365 }, (_, index) => {
  const value = new Date(Date.UTC(2025, 0, index + 1));
  return value.toISOString().slice(0, 10);
});
let invariantChecks = 0;
let modeDateChecks = 0;

const pairRows = pairs.map((pair) => {
  const city = catalog.cities.find((candidate) =>
    candidate.cityId === pair.cityId
  );
  if (!city) throw new Error(`Missing review-catalog city ${pair.cityId}.`);
  const grades = [...new Set(pair.modes.map((mode) => mode.evidenceGrade))]
    .sort();
  const peakF = Math.max(...pair.modes.map((mode) => mode.fisheryStrength));
  let peakDate = "";
  let idealPeak = -Infinity;
  let goodDays = 0;
  let excellentDays = 0;
  let diagnosticIdeal = 0;

  for (const localDate of dates) {
    const modes = evaluatePierCastV3ModePotentials({
      localDate,
      modes: pair.modes,
    });
    if (modes.length !== pair.modes.length) {
      throw new Error(
        `Invalid mode evaluation for ${pair.pairKey} on ${localDate}.`,
      );
    }
    modeDateChecks += modes.length;
    for (const mode of modes) {
      if (
        mode.fisheryStrength < 2.1 || mode.fisheryStrength > 10 ||
        mode.seasonalAvailability < 0 || mode.seasonalAvailability > 1 ||
        mode.seasonalPotential < 1 ||
        mode.seasonalPotential > mode.fisheryStrength + 1e-10
      ) {
        throw new Error(
          `Mode bound failed for ${pair.pairKey} on ${localDate}.`,
        );
      }
    }
    const scores = thermalFits.map((temperatureSuitability) => {
      const result = calculatePierCastV3Opportunity({
        modes,
        temperatureSuitability,
        allowDisabledConfiguration: true,
      });
      if (result.status !== "available") {
        throw new Error(
          `Unavailable score for ${pair.pairKey} on ${localDate}.`,
        );
      }
      invariantChecks++;
      return result.score;
    });
    const [cold, middle, ideal] = scores;
    if (
      cold < 1 || cold > middle + 1e-10 || middle > ideal + 1e-10 ||
      ideal > peakF + 1e-10 || ideal > 10 ||
      Math.abs(
          ideal - Math.max(...modes.map((mode) => mode.seasonalPotential)),
        ) > 1e-10
    ) {
      throw new Error(
        `Score invariant failed for ${pair.pairKey} on ${localDate}.`,
      );
    }
    if (ideal > idealPeak) {
      idealPeak = ideal;
      peakDate = localDate.slice(5);
    }
    if (ideal > 6) goodDays++;
    if (ideal >= 8) excellentDays++;
    if (localDate.slice(5) === diagnosticDate.slice(5)) diagnosticIdeal = ideal;
  }

  if (Math.abs(idealPeak - peakF) > 1e-10) {
    throw new Error(`Strongest mode never reaches F for ${pair.pairKey}.`);
  }
  if (
    pair.modes.some((mode) =>
      Object.hasOwn(mode, "confidenceMultiplier") ||
      Object.hasOwn(mode, "confidence_multiplier")
    )
  ) {
    throw new Error(
      `Confidence multiplier found in runtime mode ${pair.pairKey}.`,
    );
  }

  return {
    cityId: pair.cityId,
    cityName: city.displayName,
    stateCode: city.stateCode,
    speciesId: pair.speciesId,
    speciesName: speciesName.get(
      pair.speciesId as (typeof targetSpecies)[number][0],
    ),
    pairKey: pair.pairKey,
    disposition: "numeric_retained",
    evidenceGrade: grades.join("/"),
    modeCount: pair.modes.length,
    peakF: round(peakF),
    idealPeak: round(idealPeak),
    peakDate,
    goodDaysIdeal: goodDays,
    excellentDaysIdeal: excellentDays,
    september22IdealPotential: round(diagnosticIdeal),
    confidenceMultiplier: "none",
    decision: "retain_no_numerical_change",
  };
});

const monthlyRows = pairs.flatMap((pair) => {
  const city = catalog.cities.find((candidate) =>
    candidate.cityId === pair.cityId
  );
  if (!city) throw new Error(`Missing review-catalog city ${pair.cityId}.`);
  const peakF = Math.max(...pair.modes.map((mode) => mode.fisheryStrength));

  return monthNames.map((monthName, monthIndex) => {
    const month = String(monthIndex + 1).padStart(2, "0");
    const monthDates = dates.filter((date) => date.slice(5, 7) === month);
    const evaluations = monthDates.map((localDate) => {
      const modes = evaluatePierCastV3ModePotentials({
        localDate,
        modes: pair.modes,
      });
      const activeMode = [...modes].sort((left, right) =>
        right.seasonalPotential - left.seasonalPotential ||
        left.modeId.localeCompare(right.modeId)
      )[0];
      if (!activeMode) {
        throw new Error(`Missing monthly mode for ${pair.pairKey}.`);
      }
      return {
        localDate,
        idealPotential: activeMode.seasonalPotential,
        activeModeId: activeMode.modeId,
      };
    });
    const checkpoint = evaluations.find((row) =>
      row.localDate.endsWith("-15")
    );
    const monthlyPeak = [...evaluations].sort((left, right) =>
      right.idealPotential - left.idealPotential ||
      left.localDate.localeCompare(right.localDate)
    )[0];
    if (!checkpoint || !monthlyPeak) {
      throw new Error(`Incomplete monthly evaluation for ${pair.pairKey}.`);
    }
    const minimum = Math.min(...evaluations.map((row) => row.idealPotential));
    const mean = evaluations.reduce(
      (total, row) => total + row.idealPotential,
      0,
    ) / evaluations.length;
    const relativeAvailability = peakF === 1
      ? 0
      : (monthlyPeak.idealPotential - 1) / (peakF - 1);

    return {
      cityId: pair.cityId,
      cityName: city.displayName,
      stateCode: city.stateCode,
      speciesId: pair.speciesId,
      speciesName: speciesName.get(
        pair.speciesId as (typeof targetSpecies)[number][0],
      ),
      pairKey: pair.pairKey,
      month,
      monthName,
      checkpointDate: checkpoint.localDate.slice(5),
      checkpointIdealPotential: round(checkpoint.idealPotential),
      checkpointActiveMode: checkpoint.idealPotential > 1
        ? checkpoint.activeModeId
        : "none",
      monthMinIdealPotential: round(minimum),
      monthMeanIdealPotential: round(mean),
      monthMaxIdealPotential: round(monthlyPeak.idealPotential),
      monthPeakDate: monthlyPeak.localDate.slice(5),
      monthPeakActiveMode: monthlyPeak.idealPotential > 1
        ? monthlyPeak.activeModeId
        : "none",
      relativeSeasonPhase: seasonPhase(relativeAvailability),
    };
  });
});

if (monthlyRows.length !== pairs.length * 12) {
  throw new Error(
    `Expected ${pairs.length * 12} monthly rows; got ${monthlyRows.length}.`,
  );
}

const annualWindowRows = pairRows.map((pair) => {
  const months = monthlyRows.filter((row) => row.pairKey === pair.pairKey);
  return {
    cityId: pair.cityId,
    cityName: pair.cityName,
    stateCode: pair.stateCode,
    speciesId: pair.speciesId,
    speciesName: pair.speciesName,
    pairKey: pair.pairKey,
    peakF: pair.peakF,
    peakMonths: joinMonths(months, "peak"),
    strongMonths: joinMonths(months, "strong"),
    shoulderMonths: joinMonths(months, "shoulder"),
    offSeasonMonths: joinMonths(months, "off_season"),
    decision: pair.decision,
  };
});

const cellRows = catalog.cities.flatMap((city) =>
  targetSpecies.map(([speciesId, displayName]) => {
    const pairKey = `${city.cityId}/${speciesId}`;
    const numeric = pairByKey.get(pairKey);
    const profile = city.species.find((candidate) =>
      candidate.speciesId === speciesId
    );
    if (!profile) throw new Error(`Missing catalog cell ${pairKey}.`);
    const limitation = profile.limitation ?? "";
    return {
      cityId: city.cityId,
      cityName: city.displayName,
      stateCode: city.stateCode,
      speciesId,
      speciesName: displayName,
      pairKey,
      disposition: numeric ? "numeric_retained" : "unscored_no_numeric",
      peakF: numeric
        ? round(Math.max(...numeric.modes.map((mode) => mode.fisheryStrength)))
        : "",
      catalogInheritance: profile.inheritance,
      limitation,
    };
  })
);

if (cellRows.length !== 224) {
  throw new Error(`Expected 224 city/species cells; got ${cellRows.length}.`);
}
if (
  cellRows.filter((row) => row.disposition === "numeric_retained").length !==
    156
) {
  throw new Error(
    "Cell inventory does not reconcile to the runtime pair count.",
  );
}

const rankingRows = targetSpecies.flatMap(([speciesId, displayName]) =>
  pairRows
    .filter((row) => row.speciesId === speciesId)
    .sort((left, right) =>
      right.peakF - left.peakF || left.cityName.localeCompare(right.cityName)
    )
    .map((row, index) => ({
      speciesId,
      speciesName: displayName,
      rank: index + 1,
      cityId: row.cityId,
      cityName: row.cityName,
      peakF: row.peakF,
      peakDate: row.peakDate,
      evidenceGrade: row.evidenceGrade,
    }))
);

const cityRows = catalog.cities.map((city) => {
  const cityPairs = pairRows.filter((row) => row.cityId === city.cityId);
  const strongest = [...cityPairs].sort((left, right) =>
    right.peakF - left.peakF ||
    left.speciesName!.localeCompare(right.speciesName!)
  )[0];
  return {
    cityId: city.cityId,
    cityName: city.displayName,
    stateCode: city.stateCode,
    numericPairCount: cityPairs.length,
    strongestSpeciesId: strongest?.speciesId ?? "",
    strongestSpeciesName: strongest?.speciesName ?? "",
    strongestPeakF: strongest?.peakF ?? "",
    hasGoodMajorSpeciesPeak: strongest ? strongest.peakF > 6 : false,
  };
});

const caseville = pairRows.filter((row) => row.cityId === "caseville_mi");
const summary = {
  schemaVersion: "piercast-major-species-all-city-audit-v2",
  reviewedAt: reviewDate,
  configVersion: PIER_CAST_V3_CONFIG_VERSION,
  cityCount: catalog.cities.length,
  speciesCount: targetSpecies.length,
  cellCount: cellRows.length,
  numericPairCount: pairRows.length,
  numericRetained: pairRows.length,
  numericRevised: 0,
  unscoredCellCount: cellRows.length - pairRows.length,
  modeCount: pairs.reduce((total, pair) => total + pair.modes.length, 0),
  fullYearPairDateCount: pairRows.length * dates.length,
  monthlyPairCheckpointCount: monthlyRows.length,
  annualWindowSummaryCount: annualWindowRows.length,
  invariantChecks,
  modeDateChecks,
  citiesWithGoodMajorSpeciesPeak:
    cityRows.filter((row) => row.hasGoodMajorSpeciesPeak).length,
  citiesWithoutGoodMajorSpeciesPeak: cityRows.filter((row) =>
    !row.hasGoodMajorSpeciesPeak
  ).map((row) => row.cityId),
  confidenceMultiplierFound: false,
  casevilleSeptember22: caseville.map((row) => ({
    speciesId: row.speciesId,
    pairPeakF: row.peakF,
    idealTemperatureSeasonalPotential: row.september22IdealPotential,
  })),
};

writeCsv(resolve(here, "scored-pair-audit.csv"), pairRows);
writeCsv(resolve(here, "full-cell-disposition-audit.csv"), cellRows);
writeCsv(resolve(here, "cross-city-rankings.csv"), rankingRows);
writeCsv(resolve(here, "city-peak-summary.csv"), cityRows);
writeCsv(resolve(here, "monthly-seasonality-audit.csv"), monthlyRows);
writeCsv(resolve(here, "annual-window-summary.csv"), annualWindowRows);
persist(
  resolve(here, "audit-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);

console.log(JSON.stringify({ checkOnly, ...summary }, null, 2));

function round(value: number): number {
  return Number(value.toFixed(3));
}

function seasonPhase(relativeAvailability: number): string {
  if (relativeAvailability >= 0.85) return "peak";
  if (relativeAvailability >= 0.60) return "strong";
  if (relativeAvailability >= 0.25) return "shoulder";
  return "off_season";
}

function joinMonths(
  rows: readonly { monthName: string; relativeSeasonPhase: string }[],
  phase: string,
): string {
  return rows.filter((row) => row.relativeSeasonPhase === phase)
    .map((row) => row.monthName)
    .join("|");
}

function csv(value: unknown): string {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(path: string, rows: readonly Record<string, unknown>[]) {
  if (rows.length === 0) throw new Error(`Cannot write empty CSV ${path}.`);
  const columns = Object.keys(rows[0]);
  const text = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csv(row[column])).join(",")),
  ].join("\n");
  persist(path, `${text}\n`);
}

function persist(path: string, text: string) {
  if (checkOnly) {
    if (readFileSync(path, "utf8") !== text) {
      throw new Error(`Generated audit artifact has drifted: ${path}.`);
    }
    return;
  }
  writeFileSync(path, text);
}
