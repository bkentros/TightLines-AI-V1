import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const curvesPath = path.join(
  repoRoot,
  "docs/PierCast_Core_Species_Seasonal_Curves.json",
);
const evidencePath = path.join(
  repoRoot,
  "docs/PierCast_Michigan_Pier_Creel_Monthly_Summary.csv",
);
const outputJsonPath = path.join(
  repoRoot,
  "docs/PierCast_Seasonal_Calibration_Replay_v0.4.json",
);
const outputCsvPath = path.join(
  repoRoot,
  "docs/PierCast_Seasonal_Calibration_Replay_v0.4.csv",
);

const args = new Set(process.argv.slice(2));
const shouldWrite = args.has("--write");
const shouldCheck = args.has("--check");
if (shouldWrite && shouldCheck) {
  throw new Error("Choose either --write or --check, not both.");
}

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

function readCsv(filePath) {
  const [headerLine, ...dataLines] = fs.readFileSync(filePath, "utf8").trim()
    .split(/\r?\n/);
  const headers = parseCsvLine(headerLine);
  return dataLines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(
      headers.map((header, index) => [header, values[index]]),
    );
  });
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function dayOfYear(month, day) {
  const date = new Date(Date.UTC(2025, month - 1, day));
  const start = new Date(Date.UTC(2025, 0, 1));
  return Math.floor((date - start) / 86_400_000) + 1;
}

function monthDayToDayOfYear(monthDay) {
  const [month, day] = monthDay.split("-").map(Number);
  return dayOfYear(month, day);
}

function interpolateRecurring(knots, day) {
  const points = knots
    .map((knot) => ({ day: monthDayToDayOfYear(knot.monthDay), rating: knot.rating }))
    .sort((left, right) => left.day - right.day);
  const extended = [
    { ...points.at(-1), day: points.at(-1).day - 365 },
    ...points,
    { ...points[0], day: points[0].day + 365 },
  ];
  for (let index = 0; index < extended.length - 1; index += 1) {
    const left = extended[index];
    const right = extended[index + 1];
    if (day < left.day || day > right.day) continue;
    const fraction = (day - left.day) / (right.day - left.day);
    return left.rating + fraction * (right.rating - left.rating);
  }
  throw new Error(`Unable to interpolate day ${day}.`);
}

function monthlyAverage(curve, month) {
  const days = new Date(Date.UTC(2025, month, 0)).getUTCDate();
  let sum = 0;
  for (let day = 1; day <= days; day += 1) {
    sum += interpolateRecurring(curve.knots, dayOfYear(month, day));
  }
  return sum / days;
}

function round(value, digits = 3) {
  if (!Number.isFinite(value)) return null;
  return Number(value.toFixed(digits));
}

function average(values) {
  return values.length === 0
    ? null
    : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function ranks(values) {
  const sorted = values
    .map((value, index) => ({ value, index }))
    .sort((left, right) => left.value - right.value);
  const output = Array(values.length);
  let start = 0;
  while (start < sorted.length) {
    let end = start;
    while (end + 1 < sorted.length && sorted[end + 1].value === sorted[start].value) {
      end += 1;
    }
    const tiedRank = (start + end + 2) / 2;
    for (let index = start; index <= end; index += 1) {
      output[sorted[index].index] = tiedRank;
    }
    start = end + 1;
  }
  return output;
}

function pearson(left, right) {
  if (left.length !== right.length || left.length < 2) return null;
  const leftMean = average(left);
  const rightMean = average(right);
  let numerator = 0;
  let leftSquares = 0;
  let rightSquares = 0;
  for (let index = 0; index < left.length; index += 1) {
    const leftDelta = left[index] - leftMean;
    const rightDelta = right[index] - rightMean;
    numerator += leftDelta * rightDelta;
    leftSquares += leftDelta ** 2;
    rightSquares += rightDelta ** 2;
  }
  const denominator = Math.sqrt(leftSquares * rightSquares);
  return denominator === 0 ? null : numerator / denominator;
}

function spearman(left, right) {
  return pearson(ranks(left), ranks(right));
}

function circularMonthDistance(left, right) {
  const direct = Math.abs(left - right);
  return Math.min(direct, 12 - direct);
}

function summarizeRows(rows) {
  const score = rows.map((row) => row.monthlySeasonalCeiling);
  return {
    cells: rows.length,
    spearmanVsEvidenceGuide: round(spearman(
      score,
      rows.map((row) => row.evidenceGuideScore),
    )),
    spearmanVsLogModernCpue: round(spearman(
      score,
      rows.map((row) => Math.log1p(row.modernCpue)),
    )),
    spearmanVsModernPositiveYearShare: round(spearman(
      score,
      rows.map((row) => row.modernPositiveYearShare),
    )),
    exploratorySpearmanVsRecentCpue: round(spearman(
      score,
      rows.map((row) => Math.log1p(row.recentCpue)),
    )),
    exploratorySpearmanVsRecentPositiveYearShare: round(spearman(
      score,
      rows.map((row) => row.recentPositiveYearShare),
    )),
  };
}

const research = JSON.parse(fs.readFileSync(curvesPath, "utf8"));
const evidence = readCsv(evidencePath);
const curves = research.curves.filter((curve) => curve.cityId.endsWith("_mi"));
const curveByKey = new Map(
  curves.map((curve) => [`${curve.cityId}|${curve.speciesId}`, curve]),
);

const rows = evidence.map((source) => {
  const curve = curveByKey.get(`${source.city_id}|${source.species_id}`);
  if (!curve) {
    throw new Error(`Missing curve for ${source.city_id}/${source.species_id}.`);
  }
  const rating = monthlyAverage(curve, Number(source.month));
  const modernCpue = Number(source.modern_2012_2022_ex_2020_catch_per_1000h);
  const modernPositiveYearShare = Number(
    source.modern_2012_2022_ex_2020_positive_year_share,
  );
  const longCpue = Number(source.long_1997_2022_catch_per_1000h);
  const evidenceGuideScore = Number(source.nonbinding_evidence_guide_score);
  return {
    cityId: source.city_id,
    speciesId: source.species_id,
    month: Number(source.month),
    monthName: source.month_name,
    monthlySeasonalCeiling: round(rating, 2),
    longSurveyedYears: Number(source.long_1997_2022_surveyed_years),
    longHours: Number(source.long_1997_2022_hours),
    longCpue,
    longPositiveYearShare: Number(source.long_1997_2022_positive_year_share),
    modernSurveyedYears: Number(source.modern_2012_2022_ex_2020_surveyed_years),
    modernHours: Number(source.modern_2012_2022_ex_2020_hours),
    modernCpue,
    modernPositiveYearShare,
    recentSurveyedYears: Number(source.recent_2018_2022_ex_2020_surveyed_years),
    recentHours: Number(source.recent_2018_2022_ex_2020_hours),
    recentCpue: Number(source.recent_2018_2022_ex_2020_catch_per_1000h),
    recentPositiveYearShare: Number(
      source.recent_2018_2022_ex_2020_positive_year_share,
    ),
    evidenceGuideScore,
    aggregateSupport: rating >= 6 && longCpue === 0 && modernCpue === 0
      ? "unsupported_good"
      : rating >= 8 && modernPositiveYearShare < 0.5
      ? "fragile_exceptional"
      : rating >= 6 && modernPositiveYearShare < 0.3
      ? "fragile_good"
      : "supported_or_below_good",
  };
});

const bySpecies = Object.fromEntries(
  research.scope.species.map((speciesId) => [
    speciesId,
    summarizeRows(rows.filter((row) => row.speciesId === speciesId)),
  ]),
);

const byCurve = curves.map((curve) => {
  const curveRows = rows.filter((row) =>
    row.cityId === curve.cityId && row.speciesId === curve.speciesId
  );
  const predictedPeak = [...curveRows].sort((left, right) =>
    right.monthlySeasonalCeiling - left.monthlySeasonalCeiling
  )[0];
  const evidencePeak = [...curveRows].sort((left, right) =>
    right.evidenceGuideScore - left.evidenceGuideScore
  )[0];
  const metrics = summarizeRows(curveRows);
  const consistencyClass = metrics.spearmanVsEvidenceGuide === null
    ? "not_assessable"
    : metrics.spearmanVsEvidenceGuide >= 0.7
    ? "strong_in_sample_consistency"
    : metrics.spearmanVsEvidenceGuide >= 0.4
    ? "mixed_in_sample_consistency"
    : "weak_in_sample_consistency";
  return {
    curveId: curve.curveId,
    cityId: curve.cityId,
    speciesId: curve.speciesId,
    predictedPeakMonth: predictedPeak.month,
    predictedPeakMonthName: predictedPeak.monthName,
    evidencePeakMonth: evidencePeak.month,
    evidencePeakMonthName: evidencePeak.monthName,
    peakMonthDistance: circularMonthDistance(predictedPeak.month, evidencePeak.month),
    consistencyClass,
    ...metrics,
  };
});

const supportCounts = Object.fromEntries(
  [
    "unsupported_good",
    "fragile_exceptional",
    "fragile_good",
    "supported_or_below_good",
  ].map((status) => [status, rows.filter((row) => row.aggregateSupport === status).length]),
);
const exactPeakCurves = byCurve.filter((curve) => curve.peakMonthDistance === 0).length;
const adjacentPeakCurves = byCurve.filter((curve) => curve.peakMonthDistance <= 1).length;
const reviewCurveIds = byCurve
  .filter((curve) => curve.consistencyClass !== "strong_in_sample_consistency")
  .map((curve) => curve.curveId);

const output = {
  replayVersion: "piercast-seasonal-calibration-replay-v0.4.0",
  calibrationVersion: research.researchVersion,
  evidenceThrough: 2022,
  evaluatedAt: research.researchedAt,
  classification: "retrospective_in_sample_consistency_diagnostic",
  scope: {
    includedCities: [...new Set(curves.map((curve) => curve.cityId))],
    excludedCities: [
      {
        cityId: "sheboygan_wi",
        reason: "No comparable site-specific monthly pier/dock effort-and-catch series was available for quantitative replay.",
      },
    ],
    species: research.scope.species,
    monthlyCells: rows.length,
  },
  interpretationLimits: [
    "The v0.4 curves were calibrated with these aggregate data, so this is not held-out validation and cannot establish predictive accuracy.",
    "Michigan DNR estimates are monthly and cannot validate exact weekly knots or one-decimal differences.",
    "Catch-per-effort is an imperfect proxy for pier opportunity because targeting, weather, access, reporting variance, and fish movement are not controlled.",
    "This checks only the configured seasonal ceiling. It does not replay the temperature multiplier or the final PierCast score.",
    "Months absent from the creel survey are omitted rather than treated as zero opportunity.",
  ],
  definitions: {
    monthlySeasonalCeiling: "Mean of all daily interpolated FinFindr seasonal ceiling values in the surveyed calendar month.",
    evidenceGuideScore: "Nonbinding 1-9.5 transform of blended long-term and modern catch-per-effort and occurrence; it is a diagnostic aid, not biological truth.",
    unsupportedGood: "Monthly seasonal ceiling >= 6.0 while both long-term and modern aggregate catch-per-effort equal zero.",
    fragileGood: "Monthly seasonal ceiling >= 6.0 while modern positive-year share is below 0.30.",
    fragileExceptional: "Monthly seasonal ceiling >= 8.0 while modern positive-year share is below 0.50.",
  },
  summary: {
    ...summarizeRows(rows),
    supportCounts,
    curves: byCurve.length,
    exactEvidencePeakMonthCurves: exactPeakCurves,
    withinOneMonthOfEvidencePeakCurves: adjacentPeakCurves,
    reviewCurveIds,
  },
  bySpecies,
  byCurve,
  aggregateCells: rows,
};

const jsonText = `${JSON.stringify(output, null, 2)}\n`;
const csvHeaders = [
  "city_id",
  "species_id",
  "month",
  "month_name",
  "monthly_seasonal_ceiling",
  "long_surveyed_years",
  "long_hours",
  "long_cpue_per_1000h",
  "long_positive_year_share",
  "modern_surveyed_years",
  "modern_hours",
  "modern_cpue_per_1000h",
  "modern_positive_year_share",
  "recent_surveyed_years",
  "recent_hours",
  "recent_cpue_per_1000h",
  "recent_positive_year_share",
  "evidence_guide_score",
  "aggregate_support",
];
const csvRows = rows.map((row) => [
  row.cityId,
  row.speciesId,
  row.month,
  row.monthName,
  row.monthlySeasonalCeiling.toFixed(2),
  row.longSurveyedYears,
  row.longHours,
  row.longCpue.toFixed(3),
  row.longPositiveYearShare.toFixed(3),
  row.modernSurveyedYears,
  row.modernHours,
  row.modernCpue.toFixed(3),
  row.modernPositiveYearShare.toFixed(3),
  row.recentSurveyedYears,
  row.recentHours,
  row.recentCpue.toFixed(3),
  row.recentPositiveYearShare.toFixed(3),
  row.evidenceGuideScore.toFixed(2),
  row.aggregateSupport,
]);
const csvText = `${[csvHeaders, ...csvRows]
  .map((row) => row.map(csvCell).join(","))
  .join("\n")}\n`;

if (shouldWrite) {
  fs.writeFileSync(outputJsonPath, jsonText);
  fs.writeFileSync(outputCsvPath, csvText);
  console.log(`Wrote ${path.relative(repoRoot, outputJsonPath)}`);
  console.log(`Wrote ${path.relative(repoRoot, outputCsvPath)}`);
} else if (shouldCheck) {
  for (const [filePath, expected] of [
    [outputJsonPath, jsonText],
    [outputCsvPath, csvText],
  ]) {
    if (!fs.existsSync(filePath) || fs.readFileSync(filePath, "utf8") !== expected) {
      throw new Error(
        `${path.relative(repoRoot, filePath)} is stale. Run with --write.`,
      );
    }
  }
  console.log("PierCast seasonal replay artifacts are current.");
}

console.log(JSON.stringify(output.summary, null, 2));
