import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const directory = path.join(root, "docs/onboarding/piercast/remaining-species");
export const speciesNames = {
  chinook_salmon: ["Chinook Salmon"], coho_salmon: ["Coho Salmon"],
  steelhead: ["Steelhead"], brown_trout: ["Brown Trout"],
  lake_trout: ["Lean Lake Trout", "Fat Lake Trout"], walleye: ["Walleye"],
  smallmouth_bass: ["Smallmouth Bass"], freshwater_drum: ["Drum"],
  yellow_perch: ["Yellow Perch"], lake_whitefish: ["Lake Whitefish"],
  round_whitefish: ["Round Whitefish"], channel_catfish: ["Channel Catfish"],
  largemouth_bass: ["Largemouth Bass"],
};
const ports = {
  LUDINGTON: "ludington_mi", "GRAND HAVEN": "grand_haven_mi",
  MANISTEE: "manistee_mi", "FRANKFORT-ELBERTA": "frankfort_elberta_mi",
};

export function decodeCreel(result) {
  const ds = result?.dsr?.DS?.[0];
  const rows = ds?.PH?.[0]?.DM0;
  if (!rows?.length || rows.length >= 10000 || ds.IC !== true) {
    throw new Error("Incomplete or empty creel snapshot; do not summarize a truncated query");
  }
  const schema = rows[0].S;
  const names = result.descriptor.Select.map((entry) => entry.Name);
  if (schema.length !== names.length) throw new Error("Creel schema mismatch");
  const previous = Array(schema.length);
  return rows.map((row) => {
    let cursor = 0;
    return Object.fromEntries(schema.map((field, i) => {
      let value;
      if ((row.R ?? 0) & (1 << i)) value = previous[i];
      else if ((row["Ø"] ?? 0) & (1 << i)) value = null;
      else {
        value = row.C[cursor++];
        if (field.DN) value = ds.ValueDicts[field.DN][value];
      }
      previous[i] = value;
      return [names[i], value];
    }));
  });
}

export function summarizeStrata(rows, names, yearPredicate, month) {
  const selected = rows.filter((r) => yearPredicate(r.year) && r.month === month);
  const effort = selected.filter((r) => r.estimateType === "Angler Hours" && r.estimate > 0);
  const years = new Set();
  let matched = 0, hours = 0, catchEstimate = 0, positive = 0;
  let maxAnnualCatch = 0;
  for (const e of effort) {
    if (years.has(e.year)) throw new Error("Duplicate effort stratum");
    years.add(e.year);
    const catches = selected.filter((r) => r.year === e.year && r.estimateType === "Catch" && names.includes(r.species));
    // Missing estimates remain missing. Lake-trout components must both be present.
    if (new Set(catches.map((r) => r.species)).size !== names.length) continue;
    if (catches.length !== names.length) throw new Error("Duplicate catch stratum");
    const count = catches.reduce((sum, r) => sum + r.estimate, 0);
    matched++; hours += e.estimate; catchEstimate += count;
    positive += Number(count > 0); maxAnnualCatch = Math.max(maxAnnualCatch, count);
  }
  return {
    effortYears: effort.length, matchedYears: matched, missingCatchYears: effort.length - matched,
    matchedHours: hours, catchEstimate, positiveYears: positive,
    catchPer1000AllSpeciesHours: hours > 0 ? catchEstimate * 1000 / hours : null,
    positiveYearShare: matched > 0 ? positive / matched : null,
    largestYearCatchShare: catchEstimate > 0 ? maxAnnualCatch / catchEstimate : null,
  };
}

function csv(rows) {
  return rows.map((row) => row.map((value) => {
    const text = value == null ? "" : String(value);
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  }).join(",")).join("\n") + "\n";
}
function output(relative, contents, check) {
  const filename = path.join(directory, relative);
  if (check) {
    if (!fs.existsSync(filename) || fs.readFileSync(filename, "utf8") !== contents) throw new Error(`Regenerate ${relative}`);
  } else fs.writeFileSync(filename, contents);
}

export function generateEvidence(check = false) {
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, "creel-snapshot.json"), "utf8"));
  const all = [];
  for (const source of manifest.files) {
    const bytes = fs.readFileSync(path.join(directory, source.file));
    if (createHash("sha256").update(bytes).digest("hex") !== source.sha256) throw new Error(`Snapshot checksum: ${source.file}`);
    const decoded = decodeCreel(JSON.parse(bytes));
    if (decoded.length !== source.compactRowCount) throw new Error("Snapshot row count mismatch");
    for (const row of decoded) {
      const r = {
        year: row["Combined.Year"], port: row["Combined.PORT"],
        mode: row["Combined.Mode"], species: row["Combined.SpeciesName"],
        month: row["Combined.Month"], estimateType: row["Combined.Estimate Type"],
        estimate: row["Sum(Combined.Estimate)"],
      };
      if (r.port !== source.port || r.mode !== "Pier/Dock" || !Number.isFinite(r.estimate) || r.estimate < 0) throw new Error("Invalid source row");
      all.push(r);
    }
  }
  all.sort((a, b) => a.port.localeCompare(b.port) || a.year - b.year || a.month - b.month || String(a.species).localeCompare(String(b.species)) || a.estimateType.localeCompare(b.estimateType));
  const rawColumns = ["year", "port", "mode", "species", "month", "estimateType", "estimate"];
  output("michigan-pier-estimates.csv", csv([rawColumns, ...all.map((r) => rawColumns.map((c) => r[c]))]), check);
  const metrics = [];
  for (const [port, cityId] of Object.entries(ports)) {
    const rows = all.filter((r) => r.port === port);
    for (const [speciesId, names] of Object.entries(speciesNames)) {
      for (let month = 1; month <= 12; month++) {
        for (const [period, first] of [["long_1997_2022", 1997], ["modern_2012_2022", 2012], ["recent_2018_2022", 2018]]) {
          metrics.push({cityId, speciesId, month, period, ...summarizeStrata(rows, names, (y) => y >= first && y <= 2022 && y !== 2020, month)});
        }
      }
    }
  }
  const columns = Object.keys(metrics[0]);
  output("michigan-monthly-evidence.csv", csv([columns, ...metrics.map((r) => columns.map((c) => typeof r[c] === "number" && !Number.isInteger(r[c]) ? r[c].toFixed(6) : r[c]))]), check);
  console.log(`${check ? "Verified" : "Generated"} ${all.length} source estimates and ${metrics.length} monthly comparison rows; no opportunity scores inferred.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generateEvidence(process.argv.includes("--check"));
