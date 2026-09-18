import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../../..");
const here = import.meta.dirname;
const species = [
  ["chinook_salmon", "Chinook Salmon"],
  ["coho_salmon", "Coho Salmon"],
  ["steelhead", "Steelhead"],
  ["brown_trout", "Brown Trout"],
  ["lake_trout", "Lake Trout"],
  ["freshwater_drum", "Freshwater Drum"],
];
const cities = [
  ["ludington_mi", "Ludington"],
  ["grand_haven_mi", "Grand Haven"],
  ["manistee_mi", "Manistee"],
  ["frankfort_elberta_mi", "Frankfort–Elberta"],
  ["sheboygan_wi", "Sheboygan"],
  ["port_washington_wi", "Port Washington"],
  ["milwaukee_wi", "Milwaukee"],
  ["racine_wi", "Racine"],
  ["kenosha_wi", "Kenosha"],
  ["harbor_beach_mi", "Harbor Beach"],
  ["oscoda_mi", "Oscoda"],
  ["port_sanilac_mi", "Port Sanilac"],
  ["two_rivers_wi", "Two Rivers"],
  ["kewaunee_wi", "Kewaunee"],
  ["algoma_wi", "Algoma"],
  ["manitowoc_wi", "Manitowoc"],
  ["waukegan_il", "Waukegan"],
];

function parseCsv(path) {
  const [head, ...lines] = readFileSync(path, "utf8").trim().split("\n");
  const keys = head.split(",");
  return lines.map((line) => Object.fromEntries(line.split(",").map((v, i) => [keys[i], v])));
}
function csv(value) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const before = new Map(parseCsv(resolve(here, "pre-audit-established-ideal-temperature-matrix.csv"))
  .map((row) => [row.pairKey, row]));
const after = new Map(parseCsv(resolve(root, "docs/onboarding/piercast/seasonal-opportunity-audit-2026-09/current-ideal-temperature-matrix.csv"))
  .map((row) => [row.pairKey, row]));
const fiveCity = JSON.parse(readFileSync(resolve(root, "docs/onboarding/piercast/five-city-2026-09-pass2/pair-decisions.json"), "utf8"));
const fiveNumeric = new Map(fiveCity.decisions.filter((row) => row.pass2Disposition === "numeric_shadow")
  .map((row) => [row.pairKey, row]));

const revisedWhy = {
  "sheboygan_wi/coho_salmon": "2023-24 county-pier recurrence, including 508 in 2024, supports an excellent peak.",
  "sheboygan_wi/steelhead": "County-pier rainbow harvest rose from 23 in 2023 to 127 in 2024.",
  "port_washington_wi/chinook_salmon": "Ozaukee pier harvest recurred at 533, 184 and 25 across 2022-24.",
  "port_washington_wi/coho_salmon": "Ozaukee pier harvest recurred at 105, 317 and 418 across 2022-24.",
  "port_washington_wi/steelhead": "Exact-pier targeting plus positive 2022 and 2024 county-pier harvest supports the strong band.",
  "port_washington_wi/brown_trout": "Ozaukee pier harvest recurred all three years and reached 316 in 2024.",
  "milwaukee_wi/chinook_salmon": "Two positive county-pier years plus exact named-pier targeting support a higher strong peak.",
  "milwaukee_wi/coho_salmon": "Three positive county-pier years and repeated McKinley Pier reports support an excellent peak.",
  "milwaukee_wi/steelhead": "Named-pier target evidence and a current McKinley rainbow observation establish an ordinary targetable peak; survey zeros remain in confidence.",
  "milwaukee_wi/brown_trout": "Two positive county-pier years and repeated McKinley Pier reports support a strong peak.",
  "racine_wi/chinook_salmon": "County-pier harvest recurred at 203, 65 and 60 across 2022-24.",
  "racine_wi/coho_salmon": "County-pier harvest recurred at 176, 534 and 120 plus repeated local pier/shore reports.",
  "racine_wi/steelhead": "County-pier harvest recurred at 70, 9 and 75 plus direct summer shoreline reports.",
  "racine_wi/brown_trout": "Positive county-pier harvest in all three years plus an exact 2025 shore report supports a higher peak.",
  "kenosha_wi/chinook_salmon": "Exact two-pier target evidence and the strong 2022 county-pier estimate support a variable strong peak.",
  "kenosha_wi/coho_salmon": "Three positive county-pier years, including 783 in 2023, support an excellent peak.",
  "kenosha_wi/steelhead": "Exact named-pier targeting plus a positive recent county-pier year establishes an ordinary peak; variability remains in confidence.",
  "kenosha_wi/brown_trout": "Exact named-pier targeting and renewed 2024 county-pier harvest support the low strong band.",
};

function retainedReason(cityId, speciesId) {
  if (["ludington_mi", "grand_haven_mi", "manistee_mi", "frankfort_elberta_mi"].includes(cityId)) {
    if (["lake_trout", "freshwater_drum"].includes(speciesId)) return "Retained: local Michigan Pier/Dock catch rate and recurrence support the present within-species placement; the lower peak is measured scarcity, not a confidence penalty.";
    return "Retained: Grade A local Michigan Pier/Dock catch rate and multi-year recurrence independently support the current peak.";
  }
  if (["harbor_beach_mi", "oscoda_mi", "port_sanilac_mi"].includes(cityId)) return "Retained: official port roadmap and repeated exact pier/breakwall reports support the current qualitative magnitude; reports such as few, occasional, some or slow constrain strength directly.";
  if (["two_rivers_wi", "kewaunee_wi", "algoma_wi", "manitowoc_wi", "waukegan_il"].includes(cityId)) return "Retained: Pass 2 private calibration remains consistent with the corrected absolute ranking and its local pier evidence.";
  return "Retained: local pier evidence and the corrected species-wide order support the present peak.";
}

function holdReason(cityId, speciesId) {
  if (speciesId === "lake_trout" && cityId.endsWith("_wi")) return "No numeric row: recent Wisconsin pier harvest is exceptionally sparse (three statewide in 2024), and recurring city-pier targeting is not established. This is an admission hold, not a reduced score.";
  if (speciesId === "freshwater_drum") return "No numeric row: repeated intentional local main-pier drum targeting and a defensible seasonal shape are not established. This is an admission hold, not a reduced score.";
  return "No numeric row: the reviewed local pier record does not establish recurring intentional targetability and magnitude. This is an admission hold, not a reduced score.";
}

const rows = [];
for (const [cityId, cityName] of cities) {
  for (const [speciesId, speciesName] of species) {
    const pairKey = `${cityId}/${speciesId}`;
    const old = before.get(pairKey);
    const current = after.get(pairKey);
    const newPair = fiveNumeric.get(pairKey);
    const previousPeak = old ? Number(old.peakScore) : newPair ? Number(newPair.fisheryStrength) : null;
    const revisedPeak = current ? Number(current.peakScore) : newPair ? Number(newPair.fisheryStrength) : null;
    const changed = previousPeak != null && revisedPeak != null && previousPeak !== revisedPeak;
    const evidenceClass = cityId.endsWith("_wi")
      ? "WI_DNR_COUNTY_PIER_AND_EXACT_LOCAL"
      : cityId === "waukegan_il"
      ? "INHS_SITE_SURVEY_AND_EXACT_LOCAL"
      : ["harbor_beach_mi", "oscoda_mi", "port_sanilac_mi"].includes(cityId)
      ? "MI_DNR_ROADMAP_AND_WEEKLY_LOCAL"
      : "MI_DNR_PIER_DOCK_CREEL_AND_LOCAL";
    rows.push({
      cityId, cityName, speciesId, speciesName, pairKey,
      disposition: revisedPeak == null ? "evidence_hold_no_numeric_score" : changed ? "numeric_revised" : "numeric_retained",
      previousPeak: previousPeak ?? "",
      auditedPeak: revisedPeak ?? "",
      change: changed ? +(revisedPeak - previousPeak).toFixed(1) : revisedPeak == null ? "" : 0,
      evidenceGrade: current?.evidenceGrade ?? newPair?.evidenceGrade ?? "C/D",
      evidenceClass,
      rationale: changed ? revisedWhy[pairKey] : revisedPeak == null ? holdReason(cityId, speciesId) : retainedReason(cityId, speciesId),
    });
  }
}

if (rows.length !== 102) throw new Error(`Expected 102 city/species cells; got ${rows.length}.`);
const changed = rows.filter((row) => row.disposition === "numeric_revised");
const retained = rows.filter((row) => row.disposition === "numeric_retained");
const held = rows.filter((row) => row.disposition === "evidence_hold_no_numeric_score");
if (changed.length !== 18 || retained.length !== 59 || held.length !== 25) {
  throw new Error(`Unexpected disposition counts: ${changed.length}/${retained.length}/${held.length}.`);
}

const columns = Object.keys(rows[0]);
writeFileSync(resolve(here, "pair-audit.csv"), [columns.join(","), ...rows.map((row) => columns.map((key) => csv(row[key])).join(","))].join("\n") + "\n");
const rankingRows = species.flatMap(([speciesId, speciesName]) => rows
  .filter((row) => row.speciesId === speciesId && row.auditedPeak !== "")
  .sort((a, b) => b.auditedPeak - a.auditedPeak || a.cityName.localeCompare(b.cityName))
  .map((row, index) => ({ speciesId, speciesName, rank: index + 1, cityId: row.cityId, cityName: row.cityName, pairKey: row.pairKey, auditedPeak: row.auditedPeak, disposition: row.disposition })));
const rankColumns = Object.keys(rankingRows[0]);
writeFileSync(resolve(here, "cross-city-rankings.csv"), [rankColumns.join(","), ...rankingRows.map((row) => rankColumns.map((key) => csv(row[key])).join(","))].join("\n") + "\n");
writeFileSync(resolve(here, "audit-summary.json"), JSON.stringify({
  schemaVersion: "piercast-all-city-common-species-audit-v1",
  reviewedAt: "2026-09-17",
  cities: cities.length,
  species: species.length,
  cells: rows.length,
  numericRevised: changed.length,
  numericRetained: retained.length,
  evidenceHolds: held.length,
  runtimeVisibility: "established_12_public_v3_five_onboarding_cities_private",
  privateEvidenceRunPromotion: false,
  revisedPairs: changed.map(({ pairKey, previousPeak, auditedPeak, change }) => ({ pairKey, previousPeak, auditedPeak, change })),
}, null, 2) + "\n");
console.log(JSON.stringify({ cells: rows.length, revised: changed.length, retained: retained.length, held: held.length, rankings: rankingRows.length }));
