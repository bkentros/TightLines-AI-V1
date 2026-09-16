import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { PIER_CAST_V3_PAIR_CALIBRATIONS } from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration.generated.ts";
import { evaluatePierCastV3ModePotentials } from "../supabase/functions/_shared/pierCastEngine/scoring/modesV3.ts";

const outputDirectory = resolve(
  "docs/onboarding/piercast/seasonal-opportunity-audit-2026-09",
);
const dates = Array.from({ length: 365 }, (_, index) => {
  const date = new Date(Date.UTC(2027, 0, index + 1));
  return date.toISOString().slice(0, 10);
});

type DailyRead = { date: string; score: number; modeId: string };
const rows = PIER_CAST_V3_PAIR_CALIBRATIONS.map((pair) => {
  const daily: DailyRead[] = dates.map((date) => {
    const modes = evaluatePierCastV3ModePotentials({ localDate: date, modes: pair.modes });
    if (modes.length !== pair.modes.length) {
      throw new Error(`Invalid mode for ${pair.pairKey} on ${date}`);
    }
    const best = modes.sort((a, b) => b.seasonalPotential - a.seasonalPotential)[0];
    if (!best || best.seasonalPotential < 1 || best.seasonalPotential > 10) {
      throw new Error(`Invalid score for ${pair.pairKey} on ${date}`);
    }
    return { date, score: best.seasonalPotential, modeId: best.modeId };
  });
  const peak = [...daily].sort((a, b) => b.score - a.score)[0];
  const at = (monthDay: string) =>
    daily.find((read) => read.date.endsWith(monthDay))!.score;
  const maximum = (months: number[]) =>
    Math.max(...daily.filter((read) => months.includes(Number(read.date.slice(5, 7))))
      .map((read) => read.score));
  return {
    pairKey: pair.pairKey,
    cityId: pair.cityId,
    speciesId: pair.speciesId,
    evidenceGrade: pair.modes[0].evidenceGrade,
    fisheryEvidenceIds: [...new Set(pair.modes.flatMap((mode) => mode.fisheryEvidenceIds))]
      .join("|"),
    modeCount: pair.modes.length,
    peakDate: peak.date,
    peakMode: peak.modeId,
    peakScore: peak.score,
    goodDays: daily.filter((read) => read.score > 6).length,
    excellentDays: daily.filter((read) => read.score > 8).length,
    april15: at("04-15"),
    june15: at("06-15"),
    september16: at("09-16"),
    october15: at("10-15"),
    december15: at("12-15"),
    springMaximum: maximum([3, 4, 5]),
    summerMaximum: maximum([6, 7, 8]),
    fallMaximum: maximum([9, 10, 11]),
    winterMaximum: maximum([12, 1, 2]),
  };
});

const columns = Object.keys(rows[0]);
const csv = [columns.join(","), ...rows.map((row) =>
  columns.map((column) => {
    const value = row[column as keyof typeof row];
    return typeof value === "number" ? String(Math.round(value * 100) / 100) : String(value);
  }).join(",")
)].join("\n") + "\n";
async function main(): Promise<void> {
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(resolve(outputDirectory, "current-ideal-temperature-matrix.csv"), csv);
  const creel = await readFile(
    resolve("docs/onboarding/piercast/remaining-species/michigan-monthly-evidence.csv"),
    "utf8",
  );
  const [header, ...lines] = creel.trim().split("\n");
  const fields = header.split(",");
  const portMonths = lines.map((line) =>
    Object.fromEntries(line.split(",").map((value, index) => [fields[index], value]))
  );
  const recentByKey = new Map(portMonths.filter((row) =>
    row.period === "recent_2018_2022"
  ).map((row) => [`${row.cityId}/${row.speciesId}/${row.month}`, row]));
  const monthly = portMonths.filter((row) => row.period === "modern_2012_2022" &&
    Number(row.positiveYears) >= 3 &&
    Number(row.catchPer1000AllSpeciesHours) >= 10);
  const comparisons = monthly.flatMap((row) => {
    const pair = PIER_CAST_V3_PAIR_CALIBRATIONS.find((candidate) =>
      candidate.cityId === row.cityId && candidate.speciesId === row.speciesId
    );
    if (!pair) return [];
    const month = String(row.month).padStart(2, "0");
    const scores = dates.filter((date) => date.slice(5, 7) === month).map((date) =>
      Math.max(...evaluatePierCastV3ModePotentials({ localDate: date, modes: pair.modes })
        .map((mode) => mode.seasonalPotential))
    );
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const recent = recentByKey.get(`${row.cityId}/${row.speciesId}/${row.month}`);
    return [{
      pairKey: pair.pairKey,
      month,
      catchEstimate: row.catchEstimate,
      positiveYears: row.positiveYears,
      catchPer1000AllSpeciesHours: row.catchPer1000AllSpeciesHours,
      recentCatchEstimate: recent?.catchEstimate ?? "",
      recentPositiveYears: recent?.positiveYears ?? "",
      recentCatchPer1000AllSpeciesHours:
        recent?.catchPer1000AllSpeciesHours ?? "",
      meanIdealScore: Math.round(mean * 100) / 100,
      lowestIdealScore: Math.round(Math.min(...scores) * 100) / 100,
      highestIdealScore: Math.round(Math.max(...scores) * 100) / 100,
      reviewFlag: mean < 6 && Number(recent?.positiveYears ?? 0) >= 2 &&
          Number(recent?.catchPer1000AllSpeciesHours ?? 0) >= 10
        ? "recent_recurring_catch_below_good_mean"
        : mean < 6 ? "historical_catch_below_good_mean" : "none",
    }];
  });
  const comparisonColumns = Object.keys(comparisons[0]);
  await writeFile(
    resolve(outputDirectory, "michigan-port-creel-comparison.csv"),
    [comparisonColumns.join(","), ...comparisons.map((row) =>
      comparisonColumns.map((column) => String(row[column as keyof typeof row]))
        .join(",")
    )].join("\n") + "\n",
  );
  console.log(`Audited ${rows.length} pairings and ${rows.length * 365} daily ceilings.`);
  console.log(`Compared ${comparisons.length} recurring Michigan port-month catches.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
