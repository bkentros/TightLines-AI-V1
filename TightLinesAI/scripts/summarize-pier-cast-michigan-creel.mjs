import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const inputPath = path.join(
  repoRoot,
  "docs/PierCast_Michigan_Pier_Creel_Estimates_1989_2022.csv",
);
const outputPath = path.join(
  repoRoot,
  "docs/PierCast_Michigan_Pier_Creel_Monthly_Summary.csv",
);

const PORT_IDS = {
  LUDINGTON: "ludington_mi",
  "GRAND HAVEN": "grand_haven_mi",
  MANISTEE: "manistee_mi",
  "FRANKFORT-ELBERTA": "frankfort_elberta_mi",
};
const SPECIES_IDS = {
  "Chinook Salmon": "chinook_salmon",
  "Coho Salmon": "coho_salmon",
  Steelhead: "steelhead",
  "Brown Trout": "brown_trout",
};

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && quoted && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += character;
    }
  }
  values.push(current);
  return values;
}

const [headerLine, ...dataLines] = fs.readFileSync(inputPath, "utf8").trim()
  .split("\n");
const headers = parseCsvLine(headerLine);
const rows = dataLines.map((line) => {
  const values = parseCsvLine(line);
  const row = Object.fromEntries(
    headers.map((header, index) => [header, values[index]]),
  );
  return {
    ...row,
    year: Number(row.year),
    month: Number(row.month),
    estimate: Number(row.estimate),
  };
});

function metrics(port, species, month, yearFilter) {
  const effortRows = rows.filter((row) =>
    row.port === port &&
    row.estimate_type === "Angler Hours" &&
    row.month === month &&
    yearFilter(row.year)
  );
  const catchByYear = new Map(
    rows
      .filter((row) =>
        row.port === port &&
        row.species === species &&
        row.estimate_type === "Catch" &&
        row.month === month &&
        yearFilter(row.year)
      )
      .map((row) => [row.year, row.estimate]),
  );
  const hours = effortRows.reduce((sum, row) => sum + row.estimate, 0);
  const catchEstimate = effortRows.reduce(
    (sum, row) => sum + (catchByYear.get(row.year) ?? 0),
    0,
  );
  const positiveYears =
    effortRows.filter((row) => (catchByYear.get(row.year) ?? 0) > 0).length;
  return {
    surveyedYears: effortRows.length,
    hours,
    catchEstimate,
    catchPer1000Hours: hours > 0 ? (catchEstimate * 1000) / hours : 0,
    positiveYearShare: effortRows.length > 0
      ? positiveYears / effortRows.length
      : 0,
  };
}

function evidenceGuideScore(longTerm, modern) {
  const blendedCatchRate = 0.4 * longTerm.catchPer1000Hours +
    0.6 * modern.catchPer1000Hours;
  const blendedPositiveShare = 0.4 * longTerm.positiveYearShare +
    0.6 * modern.positiveYearShare;
  const normalizedStrength = Math.min(
    1,
    Math.log1p(blendedCatchRate) / Math.log(121),
  );
  return 1 + 8.5 * normalizedStrength * (0.7 + 0.3 * blendedPositiveShare);
}

const outputHeaders = [
  "city_id",
  "species_id",
  "month",
  "month_name",
  "long_1997_2022_surveyed_years",
  "long_1997_2022_hours",
  "long_1997_2022_catch",
  "long_1997_2022_catch_per_1000h",
  "long_1997_2022_positive_year_share",
  "modern_2012_2022_ex_2020_surveyed_years",
  "modern_2012_2022_ex_2020_hours",
  "modern_2012_2022_ex_2020_catch",
  "modern_2012_2022_ex_2020_catch_per_1000h",
  "modern_2012_2022_ex_2020_positive_year_share",
  "recent_2018_2022_ex_2020_surveyed_years",
  "recent_2018_2022_ex_2020_hours",
  "recent_2018_2022_ex_2020_catch",
  "recent_2018_2022_ex_2020_catch_per_1000h",
  "recent_2018_2022_ex_2020_positive_year_share",
  "nonbinding_evidence_guide_score",
];
const outputRows = [outputHeaders];

for (const [port, cityId] of Object.entries(PORT_IDS)) {
  for (const [species, speciesId] of Object.entries(SPECIES_IDS)) {
    for (let month = 1; month <= 12; month += 1) {
      const monthName = rows.find((row) => row.month === month)?.month_name ??
        "";
      const longTerm = metrics(port, species, month, (year) => year >= 1997);
      const modern = metrics(
        port,
        species,
        month,
        (year) => year >= 2012 && year !== 2020,
      );
      const recent = metrics(
        port,
        species,
        month,
        (year) => year >= 2018 && year !== 2020,
      );
      if (longTerm.surveyedYears === 0) continue;
      outputRows.push([
        cityId,
        speciesId,
        month,
        monthName,
        longTerm.surveyedYears,
        Math.round(longTerm.hours),
        Math.round(longTerm.catchEstimate),
        longTerm.catchPer1000Hours.toFixed(3),
        longTerm.positiveYearShare.toFixed(3),
        modern.surveyedYears,
        Math.round(modern.hours),
        Math.round(modern.catchEstimate),
        modern.catchPer1000Hours.toFixed(3),
        modern.positiveYearShare.toFixed(3),
        recent.surveyedYears,
        Math.round(recent.hours),
        Math.round(recent.catchEstimate),
        recent.catchPer1000Hours.toFixed(3),
        recent.positiveYearShare.toFixed(3),
        evidenceGuideScore(longTerm, modern).toFixed(2),
      ]);
    }
  }
}

fs.writeFileSync(
  outputPath,
  `${outputRows.map((row) => row.join(",")).join("\n")}\n`,
);
console.log(
  `Wrote ${outputRows.length - 1} monthly evidence rows to ${outputPath}`,
);
