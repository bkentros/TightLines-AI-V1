// Run from the repository root. This package is private Pass 2 research only.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REVIEW_DATE = "2026-09-21";
const REFERENCE_YEAR = 2026;
const dir = path.dirname(fileURLToPath(import.meta.url));
const piercastDir = path.resolve(dir, "..");
const pass1Dir = path.join(piercastDir, "pentwater-caseville-2026-09-pass1");
const baselineDir = path.join(piercastDir, "st-joseph-harrisville-2026-09-pass2");
const checkMode = process.argv.includes("--check");

const readJson = (base, name) => JSON.parse(fs.readFileSync(path.join(base, name), "utf8"));
const pass1 = readJson(pass1Dir, "species-decisions.json");
const pass1Ledger = readJson(pass1Dir, "source-ledger.json");
const pass1Stocking = readJson(pass1Dir, "stocking-records-reviewed.json");
const pass1Bluegill = readJson(pass1Dir, "bluegill-policy-exclusions.json");
const pass1OutOfCatalog = readJson(pass1Dir, "out-of-catalog-leads.json");

const cities = [
  { id: "pentwater_mi", name: "Pentwater", port: "PENTWATER", lake: "Lake Michigan" },
  { id: "rogers_city_mi", name: "Rogers City", port: "ROGERS CITY", lake: "Lake Huron" },
  { id: "tawas_city_mi", name: "Tawas City", port: null, lake: "Lake Huron" },
  { id: "charlevoix_mi", name: "Charlevoix", port: "CHARLEVOIX", lake: "Lake Michigan" },
  { id: "caseville_mi", name: "Caseville", port: null, lake: "Lake Huron" },
];
const species = [
  "chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "lake_trout", "walleye",
  "smallmouth_bass", "freshwater_drum", "yellow_perch", "lake_whitefish", "round_whitefish",
  "channel_catfish", "largemouth_bass", "atlantic_salmon", "northern_pike", "burbot",
  "white_perch", "white_bass",
];
const salmonids = ["atlantic_salmon", "chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "lake_trout"];
const prioritySpecies = ["atlantic_salmon", "chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "lake_trout", "walleye", "yellow_perch", "lake_whitefish", "freshwater_drum"];
const speciesNames = Object.fromEntries(pass1.decisions.map((row) => [row.species_id, row.species_name]));
const dashboardSpecies = {
  chinook_salmon: "Chinook Salmon", coho_salmon: "Coho Salmon", steelhead: "Steelhead",
  brown_trout: "Brown Trout", lake_trout: "Lean Lake Trout", walleye: "Walleye",
  smallmouth_bass: "Smallmouth Bass", freshwater_drum: "Drum", yellow_perch: "Yellow Perch",
  lake_whitefish: "Lake Whitefish", round_whitefish: "Round Whitefish",
  channel_catfish: "Channel Catfish", largemouth_bass: "Largemouth Bass",
  atlantic_salmon: "Atlantic Salmon", northern_pike: "Northern Pike", burbot: "Burbot",
  white_perch: "White Perch", white_bass: "White Bass",
};
const thermalCurveIds = Object.fromEntries(species.map((id) => [id, `${id}__existing_shared_temperature_curve`]));

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [headers, ...data] = rows.filter((item) => item.some((value) => value !== ""));
  return data.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

const baselineRows = parseCsv(fs.readFileSync(path.join(baselineDir, "cross-city-rankings.csv"), "utf8")).map((row) => ({
  species_id: row.species_id,
  species_name: row.species_name,
  city_id: row.city_id,
  city_name: row.city_name,
  pair_key: row.pair_key,
  peak: Number(row.peak),
  cohort: "established_27_city_baseline",
}));
const baselineCities = [...new Map(baselineRows.map((row) => [row.city_id, { city_id: row.city_id, city_name: row.city_name }])).values()]
  .sort((a, b) => a.city_name.localeCompare(b.city_name));

const numeric = (peak, grade, profile, rationale, evidenceIds) => ({ peak, grade, profile, rationale, evidenceIds });
const approvedEntries = [
  ["pentwater_mi/chinook_salmon", 7.5, "A", "chinook_lm", "Ten positive Pier/Dock catch years, including modern positives, establish recurring spring and staging opportunity. The measured record places Pentwater above Michigan City/Kenosha but below Grand Haven.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_ROADMAP_LM"]],
  ["pentwater_mi/coho_salmon", 7.2, "A", "coho_lm", "Nine positive catch years and five modern positive strata establish recurring spring and fall opportunity. Magnitude supports the Manitowoc-to-Whitehall range rather than the elite southern spring cohort.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LM"]],
  ["pentwater_mi/steelhead", 8.3, "A", "steelhead_lm", "Fourteen positive catch years across spring, summer, and fall establish a strong multi-window fishery between Ludington and Michigan City.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_ROADMAP_LM"]],
  ["pentwater_mi/brown_trout", 7.3, "A", "brown_lm", "Twelve positive catch years with modern recurrence establish a strong cold-season and harbor fishery at the Racine/Kewaunee tier.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_ROADMAP_LM"]],
  ["pentwater_mi/walleye", 4.4, "B", "walleye", "Three positive years establish limited recurring opportunity. Low measured magnitude keeps the peak between South Haven and the Frankfort/Holland tier; county stocking does not raise it.", ["MI_CREEL_DASHBOARD", "MI_WEEKLY_ARCHIVE"]],
  ["pentwater_mi/smallmouth_bass", 6.4, "A", "smallmouth", "Eight positive years and very strong modern matched-effort magnitude establish a strong channel fishery above Whitehall and below Muskegon.", ["MI_CREEL_DASHBOARD", "MI_WEEKLY_ARCHIVE"]],
  ["pentwater_mi/freshwater_drum", 5.4, "B", "drum", "Four positive years plus exact-channel reports establish recurring warm-season targeting. Episodic magnitude supports a middle placement below Chicago/Whitehall.", ["MI_CREEL_DASHBOARD", "MI_WEEKLY_ARCHIVE"]],
  ["pentwater_mi/yellow_perch", 7.8, "A", "perch", "Seven positive years and exceptionally high measured catch magnitude establish an excellent recurring fishery above the 7.6 cohort but below Whitehall.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_WEEKLY_ARCHIVE"]],

  ["rogers_city_mi/chinook_salmon", 6.0, "B", "chinook_huron", "Four exact-port catch years plus current agency harbor guidance establish a real fall fishery above Lexington but below Harrisville. Historical sampling limits confidence, not F.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_ROADMAP_LH"]],
  ["rogers_city_mi/steelhead", 6.0, "B", "steelhead_huron", "Four exact-port catch years, current agency targeting guidance, and exact/neighboring stocking pathways establish a recurring fishery above Harrisville and below Chicago.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_ROADMAP_LH", "MI_STOCKING_CSV"]],
  ["rogers_city_mi/brown_trout", 5.8, "A", "brown_huron", "Seven positive catch years with strong measured magnitude establish recurring spring and fall harbor opportunity above Alpena but below Michigan City.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LH"]],
  ["rogers_city_mi/lake_trout", 5.1, "B", "lake_trout_huron", "Four positive spring catch years plus current local guidance establish modest recurring nearshore opportunity between Alpena and Harbor Beach.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_ROADMAP_LH", "MI_REGS_2026"]],
  ["rogers_city_mi/walleye", 5.5, "B", "walleye", "Three positive catch years with meaningful measured magnitude establish an ordinary harbor fishery below Lexington and above the Lake Michigan low tier.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_ROADMAP_LH"]],
  ["rogers_city_mi/smallmouth_bass", 6.5, "B", "smallmouth", "Current DNR exact-harbor targeting guidance establishes an intentional local fishery. Missing port-specific quantitative rows keep Grade B while the peak is bracketed by Pentwater and Chicago/Muskegon.", ["MI_BETTER_WATERS", "MI_ROADMAP_LH"]],
  ["rogers_city_mi/atlantic_salmon", 6.8, "B", "atlantic_huron", "DNR directs anglers to cast from the breakwall, a 2008 Pier/Dock positive establishes exact-mode catch, and 2026 advisory evidence confirms current recurrence. The result sits above Port Sanilac and below Alpena.", ["MI_CREEL_DASHBOARD", "MI_WEEKLY_ARCHIVE", "MI_ROADMAP_LH", "LHCFAC_2026", "ATLANTIC_PROGRAM"]],

  ["tawas_city_mi/coho_salmon", 5.8, "B", "coho_huron", "Current DNR exact-city/bay guidance supports intentional local shore opportunity. With no resolved dashboard allocation, the peak matches Harbor Beach and remains below Harrisville.", ["MI_BETTER_WATERS", "MI_ROADMAP_LH", "MI_WEEKLY_ARCHIVE"]],
  ["tawas_city_mi/steelhead", 5.8, "B", "steelhead_huron", "DNR exact-city guidance establishes the local fishery, but reviewed weekly records are predominantly boat/offshore or incidental. The corrected peak matches the lower established Huron harbor tier rather than exceeding measured Rogers City evidence.", ["MI_BETTER_WATERS", "MI_ROADMAP_LH", "MI_WEEKLY_ARCHIVE", "MI_STOCKING_CSV"]],
  ["tawas_city_mi/lake_trout", 5.1, "B", "lake_trout_huron", "Current exact-city/bay guidance establishes cold-water local opportunity. With no resolved structure-level magnitude, the corrected peak matches Rogers City and remains below Harbor Beach; stocking only corroborates occurrence.", ["MI_BETTER_WATERS", "MI_ROADMAP_LH", "MI_REGS_2026"]],
  ["tawas_city_mi/walleye", 6.5, "B", "walleye", "DNR identifies Tawas City/Bay as a good walleye location and recurring bay reports establish strength, but most measured reports are boat-oriented. The corrected peak remains above Port Sanilac and below Oscoda.", ["MI_BETTER_WATERS", "MI_ROADMAP_LH", "MI_WEEKLY_ARCHIVE"]],
  ["tawas_city_mi/smallmouth_bass", 6.2, "B", "smallmouth", "Current DNR exact-city/harbor targeting guidance supports a strong warm-season fishery above Lexington and below Pentwater.", ["MI_BETTER_WATERS", "MI_ROADMAP_LH"]],
  ["tawas_city_mi/yellow_perch", 6.8, "B", "perch", "DNR exact-city/bay guidance establishes a real perch opportunity, while reviewed weekly evidence includes small fish and lacks a structure-level magnitude series. The corrected peak sits above Michigan City and below Grand Haven/Manistee.", ["MI_BETTER_WATERS", "MI_ROADMAP_LH", "MI_WEEKLY_ARCHIVE"]],
  ["tawas_city_mi/lake_whitefish", 4.0, "B", "whitefish", "DNR weekly reports explicitly document late-fall targeting from the Tawas wall/state dock. Exact method and season support admission, while the unresolved magnitude supports equality with the established 4.0 lawful pier cohort rather than a new high.", ["MI_WEEKLY_ARCHIVE", "MI_BETTER_WATERS", "MI_REGS_2026"]],
  ["tawas_city_mi/northern_pike", 5.2, "B", "pike", "DNR exact-city/connected-harbor targeting guidance establishes recurring opportunity at the Ludington tier. A single historical exact stocking record does not affect F.", ["MI_BETTER_WATERS", "MI_WEEKLY_ARCHIVE"]],
  ["tawas_city_mi/burbot", 4.3, "B", "burbot", "DNR reports anglers taking burbot from the exact state dock and retains the local fishery in its guidance. Exact cold-season targeting supports a limited peak below Manistee/Ludington.", ["MI_WEEKLY_ARCHIVE", "MI_BETTER_WATERS", "MI_REGS_2026"]],

  ["charlevoix_mi/chinook_salmon", 7.2, "A", "chinook_lm", "Nine positive catch years including modern positives establish recurring channel opportunity. Low measured magnitude keeps the peak at the Manitowoc tier below Pentwater.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LM"]],
  ["charlevoix_mi/steelhead", 7.5, "A", "steelhead_lm", "Eleven positive catch years across six months and continued modern occurrence establish a strong multi-window fishery between Holland/Two Rivers and the 7.7 cohort.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LM"]],
  ["charlevoix_mi/lake_trout", 5.0, "A", "lake_trout_lm", "Six positive years, all measured catch occurring in the modern period, establish the strongest reviewed Lake Michigan onboarding peak below Rogers City and above Lexington.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LM", "MI_REGS_2026"]],
  ["charlevoix_mi/walleye", 5.5, "A", "walleye", "Thirteen positive catch years establish recurring channel opportunity. Modest recent magnitude places it below Lexington and above the Lake Michigan 4.5 tier.", ["MI_CREEL_DASHBOARD", "MI_WEEKLY_ARCHIVE"]],
  ["charlevoix_mi/smallmouth_bass", 8.4, "A", "smallmouth", "Twenty-five positive catch years, exceptional measured magnitude, and repeated exact-channel reports establish the strongest reviewed smallmouth channel fishery. The corrected 8.4 remains above Alpena while avoiding an unsupported four-tenths expansion within the excellent band.", ["MI_CREEL_DASHBOARD", "MI_WEEKLY_ARCHIVE"]],
  ["charlevoix_mi/freshwater_drum", 5.4, "A", "drum", "Twelve positive years with persistent modern catches and exact-channel reports establish recurring ordinary-to-strong opportunity below Chicago/Whitehall.", ["MI_CREEL_DASHBOARD", "MI_WEEKLY_ARCHIVE"]],
  ["charlevoix_mi/yellow_perch", 6.5, "A", "perch", "Eight positive years with strong modern recurrence establish a solid channel fishery above Michigan City and below Grand Haven.", ["MI_CREEL_DASHBOARD", "MI_WEEKLY_ARCHIVE"]],

  ["caseville_mi/walleye", 6.2, "B", "walleye", "DNR exact-city guidance and an exact-pier weekly report establish recurring intentional targeting. The peak matches Port Sanilac below Tawas/Oscoda.", ["MI_BETTER_WATERS", "MI_ROADMAP_LH", "MI_WEEKLY_ARCHIVE"]],
  ["caseville_mi/smallmouth_bass", 5.5, "B", "smallmouth", "DNR exact-city guidance and an exact-pier weekly report establish ordinary warm-season opportunity between Port Sanilac and Michigan City.", ["MI_BETTER_WATERS", "MI_WEEKLY_ARCHIVE"]],
  ["caseville_mi/coho_salmon", 5.0, "B", "coho_huron", "An exact DNR Caseville-pier catch report, official spring salmon guidance for Caseville, and current Huron County stocking corroboration establish a real but modest city-centered fishery. The conservative peak remains below Harbor Beach and Ludington.", ["MI_WEEKLY_ARCHIVE", "MI_ROADMAP_LH", "MI_STOCKING_CSV"]],
  ["caseville_mi/steelhead", 4.5, "B", "steelhead_huron", "Exact connected Pigeon River/Caseville rainbow-trout stocking through 2022 and official spring trout guidance establish a modest city-centered steelhead pathway. The conservative peak matches Port Sanilac and remains below the measured Lake Huron harbor cohort.", ["MI_STOCKING_CSV", "MI_ROADMAP_LH"]],
  ["caseville_mi/lake_trout", 4.6, "B", "lake_trout_huron", "Michigan DNR's exact Caseville fishery inventory names lake trout and the Lake Huron roadmap identifies spring trout opportunity. With no quantitative Caseville series, the conservative peak matches Oscoda and remains below Lexington.", ["MI_BETTER_WATERS", "MI_ROADMAP_LH", "MI_REGS_2026"]],
];
const approved = Object.fromEntries(approvedEntries.map(([key, peak, grade, profile, rationale, evidenceIds]) => [key, numeric(peak, grade, profile, rationale, evidenceIds)]));
const calibrationCorrections = [
  { pair_key: "tawas_city_mi/atlantic_salmon", prior: { disposition: "numeric_private", grade: "B", peak: 6.4 }, corrected: { disposition: "research_hold_unscored", grade: "C", peak: null }, reason: "Exact-city occurrence is credible, but reviewed evidence is mode-mixed/offshore and does not establish recurring covered-structure targeting." },
  { pair_key: "tawas_city_mi/largemouth_bass", prior: { disposition: "numeric_private", grade: "B", peak: 5.5 }, corrected: { disposition: "research_hold_unscored", grade: "C", peak: null }, reason: "The location inventory lacks a species-resolved recurring covered-shore magnitude record." },
  { pair_key: "caseville_mi/coho_salmon", prior: { disposition: "research_hold_unscored", grade: "C", peak: null }, corrected: { disposition: "numeric_private", grade: "B", peak: 5.0 }, reason: "The product reports city fishing conditions centered around the covered piers; an exact Caseville-pier catch plus official city salmon guidance supports conservative admission without claiming pier-specific recurrence." },
  { pair_key: "caseville_mi/steelhead", prior: { disposition: "research_hold_unscored", grade: "C", peak: null }, corrected: { disposition: "numeric_private", grade: "B", peak: 4.5 }, reason: "The city-condition boundary permits the exact connected Pigeon River/Caseville stocking pathway and official city trout guidance to support a conservative score without claiming Pointe Park-specific catch frequency." },
  { pair_key: "caseville_mi/lake_trout", prior: { disposition: "research_hold_unscored", grade: "C", peak: null }, corrected: { disposition: "numeric_private", grade: "B", peak: 4.6 }, reason: "The exact DNR Caseville lake-trout inventory supports a conservative city-condition calibration; the score is intentionally below stronger quantified Lake Huron ports." },
  { pair_key: "caseville_mi/yellow_perch", prior: { disposition: "numeric_private", grade: "B", peak: 7.0 }, corrected: { disposition: "research_hold_unscored", grade: "C", peak: null }, reason: "A strong numeric peak was not supportable without recurring exact pier/shore catch evidence." },
  { pair_key: "caseville_mi/burbot", prior: { disposition: "numeric_private", grade: "B", peak: 4.2 }, corrected: { disposition: "research_hold_unscored", grade: "C", peak: null }, reason: "The city inventory establishes a lead but not recurring covered-structure targetability and magnitude." },
  { pair_key: "tawas_city_mi/steelhead", prior: { disposition: "numeric_private", grade: "B", peak: 6.2 }, corrected: { disposition: "numeric_private", grade: "B", peak: 5.8 }, reason: "Reviewed weekly evidence is largely boat/offshore or incidental and did not support placement above measured Rogers City evidence." },
  { pair_key: "tawas_city_mi/lake_trout", prior: { disposition: "numeric_private", grade: "B", peak: 5.3 }, corrected: { disposition: "numeric_private", grade: "B", peak: 5.1 }, reason: "The corrected value matches Rogers City while preserving the unresolved structure-level magnitude limitation." },
  { pair_key: "tawas_city_mi/walleye", prior: { disposition: "numeric_private", grade: "B", peak: 6.8 }, corrected: { disposition: "numeric_private", grade: "B", peak: 6.5 }, reason: "Strong recurring bay opportunity remains, but mostly boat-oriented magnitude did not justify equality with Oscoda." },
  { pair_key: "tawas_city_mi/yellow_perch", prior: { disposition: "numeric_private", grade: "B", peak: 7.4 }, corrected: { disposition: "numeric_private", grade: "B", peak: 6.8 }, reason: "The exact-city inventory supports admission, while reports of small fish and missing structure magnitude do not support the prior upper-tier peak." },
  { pair_key: "tawas_city_mi/lake_whitefish", prior: { disposition: "numeric_private", grade: "B", peak: 4.3 }, corrected: { disposition: "numeric_private", grade: "B", peak: 4.0 }, reason: "Exact wall/dock targeting supports admission but not a new high above the established lawful pier cohort." },
  { pair_key: "charlevoix_mi/smallmouth_bass", prior: { disposition: "numeric_private", grade: "A", peak: 8.8 }, corrected: { disposition: "numeric_private", grade: "A", peak: 8.4 }, reason: "Charlevoix remains the strongest reviewed smallmouth fishery, but 8.4 better reflects the cross-city evidence without an over-wide leap above Alpena." },
];
const correctionReviewUnchanged = [
  { pair_key: "rogers_city_mi/atlantic_salmon", disposition: "numeric_private", grade: "B", peak: 6.8, reason: "Retained because exact breakwall guidance, exact-port historical catch, and current recurrence jointly satisfy Grade B." },
  { pair_key: "tawas_city_mi/burbot", disposition: "numeric_private", grade: "B", peak: 4.3, reason: "Retained because current Tawas Bay listing and an exact state-dock catch/targeting report jointly establish the cold-season mode." },
];

const profiles = {
  chinook_lm: [
    ["spring_nearshore", 0.62, [["01-01",0],["03-15",0],["05-10",1],["06-20",0.15],["07-10",0],["12-31",0]]],
    ["fall_harbor_staging", 1, [["01-01",0],["07-15",0],["08-15",0.45],["09-10",1],["10-10",0.25],["11-01",0],["12-31",0]]],
  ],
  chinook_huron: [["fall_harbor_staging", 1, [["01-01",0],["08-01",0],["09-01",0.5],["10-05",1],["11-05",0.2],["12-01",0],["12-31",0]]]],
  coho_lm: [
    ["spring_nearshore", 1, [["01-01",0.1],["02-15",0.3],["04-15",1],["05-25",0.45],["06-20",0.05],["07-10",0],["12-01",0],["12-31",0.1]]],
    ["fall_harbor_return", 0.72, [["01-01",0],["08-15",0],["09-20",0.55],["10-15",1],["11-20",0.15],["12-01",0],["12-31",0]]],
  ],
  coho_huron: [
    ["spring_harbor", 1, [["01-01",0.12],["03-01",0.35],["04-25",1],["06-01",0.15],["07-01",0],["11-20",0.08],["12-31",0.12]]],
    ["fall_harbor", 0.82, [["01-01",0],["08-20",0],["09-20",0.55],["10-20",1],["11-20",0.2],["12-01",0],["12-31",0]]],
  ],
  steelhead_lm: [
    ["spring_pier", 0.82, [["01-01",0.3],["03-01",0.55],["04-20",1],["06-01",0.2],["06-20",0],["11-20",0.2],["12-31",0.3]]],
    ["summer_skamania", 1, [["01-01",0],["05-20",0],["06-20",0.6],["07-20",1],["08-25",0.35],["09-10",0],["12-31",0]]],
    ["fall_harbor", 0.88, [["01-01",0.2],["08-20",0],["09-20",0.45],["10-20",1],["11-25",0.55],["12-31",0.2]]],
  ],
  steelhead_huron: [
    ["spring_harbor", 1, [["01-01",0.3],["03-01",0.55],["04-25",1],["06-10",0.25],["07-01",0],["11-20",0.22],["12-31",0.3]]],
    ["fall_harbor", 0.88, [["01-01",0.2],["08-20",0],["09-20",0.55],["10-20",1],["11-25",0.55],["12-31",0.2]]],
  ],
  brown_lm: [
    ["winter_spring_nearshore", 1, [["01-01",0.42],["02-15",0.58],["04-10",1],["05-25",0.5],["06-25",0.05],["07-10",0],["12-01",0.38],["12-31",0.42]]],
    ["fall_harbor", 0.72, [["01-01",0.35],["08-25",0],["10-01",0.4],["11-10",1],["12-31",0.35]]],
  ],
  brown_huron: [
    ["spring_harbor", 1, [["01-01",0.45],["03-01",0.65],["04-20",1],["06-01",0.15],["07-01",0],["11-20",0.35],["12-31",0.45]]],
    ["fall_harbor", 0.9, [["01-01",0.35],["08-25",0],["09-25",0.35],["10-25",1],["12-31",0.35]]],
  ],
  lake_trout_lm: [
    ["winter_spring_pier", 1, [["01-01",0.75],["03-15",1],["05-20",0.45],["06-20",0],["10-15",0],["11-20",0.55],["12-31",0.75]]],
    ["fall_nearshore", 0.86, [["01-01",0.4],["06-15",0],["09-15",0.25],["11-10",1],["12-31",0.4]]],
  ],
  lake_trout_huron: [["spring_coldwater_harbor", 1, [["01-01",0.35],["03-01",0.55],["04-20",1],["05-25",0.25],["06-20",0],["11-20",0.25],["12-31",0.35]]]],
  walleye: [["warm_season_low_light", 1, [["01-01",0.05],["03-15",0.18],["05-15",0.65],["07-15",1],["09-15",0.65],["11-15",0.12],["12-31",0.05]]]],
  smallmouth: [["warm_season_channel", 1, [["01-01",0],["04-01",0],["05-10",0.3],["06-20",0.82],["07-20",1],["09-20",0.72],["10-25",0.15],["11-15",0],["12-31",0]]]],
  drum: [["warm_season_channel", 1, [["01-01",0],["04-15",0],["05-20",0.35],["07-15",1],["08-20",0.85],["09-25",0.35],["10-20",0],["12-31",0]]]],
  perch: [["summer_pier_schooling", 1, [["01-01",0.05],["03-15",0.12],["05-15",0.35],["07-20",1],["09-15",0.5],["11-15",0.12],["12-31",0.05]]]],
  whitefish: [["late_fall_winter_pier", 1, [["01-01",0.8],["03-15",0.45],["05-01",0],["09-20",0],["10-25",0.35],["11-25",1],["12-31",0.8]]]],
  largemouth: [["warm_season_harbor", 1, [["01-01",0],["04-15",0],["05-20",0.35],["07-25",1],["09-20",0.6],["10-25",0.1],["11-15",0],["12-31",0]]]],
  atlantic_huron: [
    ["winter_spring_harbor", 1, [["01-01",0.65],["02-20",0.8],["04-20",1],["06-01",0.2],["07-01",0],["11-15",0.35],["12-31",0.65]]],
    ["fall_breakwall", 0.86, [["01-01",0.25],["08-20",0],["09-20",0.55],["10-20",1],["11-25",0.55],["12-31",0.25]]],
  ],
  pike: [["spring_fall_harbor", 1, [["01-01",0.2],["03-01",0.45],["05-10",1],["07-20",0.35],["09-20",0.55],["11-05",0.8],["12-31",0.2]]]],
  burbot: [["cold_season_night", 1, [["01-01",0.75],["02-15",1],["04-15",0.25],["05-15",0],["10-15",0],["11-20",0.5],["12-31",0.75]]]],
};

const holdOverrides = {
  "pentwater_mi/lake_trout": "Only one positive catch year was resolved; stocking and one measured occurrence do not establish recurrence.",
  "pentwater_mi/lake_whitefish": "One high 2012 catch stratum is exact but does not establish recurring annual opportunity.",
  "pentwater_mi/round_whitefish": "One historical positive year does not establish recurrence or a full-year shape.",
  "pentwater_mi/channel_catfish": "Exact-channel reporting creates a lead, but the reviewed Pier/Dock catch series contains no positive catch row.",
  "pentwater_mi/largemouth_bass": "Two low positive years are insufficient to establish recurring intentional targeting.",
  "pentwater_mi/northern_pike": "The positive Pier/Dock record is confined to one year and regional stocking cannot fill the recurrence gap.",
  "rogers_city_mi/coho_salmon": "Current records remain primarily boat/offshore and no positive Pier/Dock catch row resolves the covered-structure fishery.",
  "rogers_city_mi/yellow_perch": "One positive year, despite high episodic magnitude, cannot establish recurring opportunity.",
  "rogers_city_mi/northern_pike": "Two positive years remain too sparse for a defensible recurring full-year calibration.",
  "tawas_city_mi/chinook_salmon": "Historical stocking and mixed current occurrence do not resolve present recurring covered-structure targeting.",
  "tawas_city_mi/brown_trout": "Historical exact-area stocking ended and current exact-pier recurrence remains unresolved.",
  "tawas_city_mi/freshwater_drum": "A connected-river report establishes occurrence but not recurring intentional pier targeting.",
  "tawas_city_mi/largemouth_bass": "The current agency location inventory creates a credible city lead, but no species-resolved recurring covered-shore record supports a numeric magnitude or annual shape.",
  "tawas_city_mi/atlantic_salmon": "The current agency location inventory and regional program establish local occurrence, but the reviewed records remain mode-mixed or offshore and do not establish recurring covered-structure targeting.",
  "charlevoix_mi/coho_salmon": "Recent connected-water stocking is not exact-channel catch evidence; the Pier/Dock series has no positive catch row.",
  "charlevoix_mi/brown_trout": "One positive catch year plus connected-water stocking is inadequate for recurring numeric admission.",
  "charlevoix_mi/lake_whitefish": "One historical positive catch year does not establish current recurrence.",
  "charlevoix_mi/channel_catfish": "A single harvest-only lead does not establish recurring targeted channel opportunity.",
  "charlevoix_mi/largemouth_bass": "A single harvest-only lead and regional stocking do not establish recurrence.",
  "charlevoix_mi/atlantic_salmon": "One 1986 connected-water stocking record and offshore reports do not establish an exact-pier fishery.",
  "charlevoix_mi/northern_pike": "Archived channel occurrence remains insufficient to resolve recurrence, magnitude, and annual shape.",
  "caseville_mi/chinook_salmon": "Neighboring-port stocking and regional occurrence do not establish exact Caseville pier recurrence.",
  "caseville_mi/coho_salmon": "One exact-pier catch report is meaningful but explicitly insufficient to establish recurrence or magnitude.",
  "caseville_mi/steelhead": "Exact connected-river stocking through 2022 establishes an occurrence pathway, not recurring Pointe Park catch.",
  "caseville_mi/brown_trout": "Historical exact-area stocking ended in 1999 and no current exact-pier recurrence was resolved.",
  "caseville_mi/lake_trout": "The current agency location inventory establishes a meaningful city lead, but no recurring exact pier/shore series resolves covered-structure magnitude or annual shape.",
  "caseville_mi/yellow_perch": "The current agency location inventory establishes a meaningful city lead, but no recurring exact pier/shore catch record supports the previously assigned strong numeric peak.",
  "caseville_mi/northern_pike": "Neighboring-port stocking alone cannot establish the covered Caseville fishery.",
  "caseville_mi/burbot": "The current agency location inventory establishes a cold-season lead, but no exact recurring Pointe Park or harbor-edge record resolves targetability, magnitude, and annual shape.",
};

const ledger = {
  ...pass1Ledger,
  schema_version: "piercast-pentwater-caseville-pass2-source-ledger-v1",
  inherited_from: "../pentwater-caseville-2026-09-pass1/source-ledger.json",
  calibration_baseline: "../st-joseph-harrisville-2026-09-pass2/cross-city-rankings.csv",
  pass2_use: "Numeric admission, magnitude, annual shape, regulations, access, holds, and exclusions.",
  sources: pass1Ledger.sources.map((source) => source.id === "MI_BETTER_WATERS" ? {
    ...source,
    claim_supported: "Michigan DNR states that fisheries management biologists compiled locations offering good fishing opportunities for the indicated species; the exact rows name Pentwater Breakwall/Lake, Rogers City Harbor, Tawas City/Bay, and Caseville.",
    permitted_use: "Primary exact-city occurrence and qualitative targetability evidence; it can support a research lead and, with recurring local mode evidence, Grade B admission.",
    limitations: "The table does not quantify catch rate, season, effort, or always isolate a pier/wall. A city or bay row alone cannot establish covered-structure magnitude or a full-year numeric shape.",
  } : source),
};
const sourceIds = new Set(ledger.sources.map((source) => source.id));

const newRows = Object.entries(approved).map(([pairKey, calibration]) => {
  const [cityId, speciesId] = pairKey.split("/");
  return {
    species_id: speciesId, species_name: speciesNames[speciesId], city_id: cityId,
    city_name: cities.find((city) => city.id === cityId).name, pair_key: pairKey,
    peak: calibration.peak, cohort: "new_private_pass2",
  };
});
const allCalibrationRows = [...baselineRows, ...newRows];
const anchors = {};
for (const [pairKey, calibration] of Object.entries(approved)) {
  const [, speciesId] = pairKey.split("/");
  const establishedNumeric = baselineRows.filter((row) => row.species_id === speciesId).sort((a, b) => b.peak - a.peak || a.city_name.localeCompare(b.city_name));
  const allEstablishedCities = baselineCities.map((city) => {
    const existing = establishedNumeric.find((row) => row.city_id === city.city_id);
    return existing ? { ...city, status: "numeric_baseline", peak: existing.peak, pair_key: existing.pair_key } : { ...city, status: "no_numeric_baseline_for_species", peak: null, pair_key: null };
  });
  const comparisons = allCalibrationRows.filter((row) => row.species_id === speciesId && row.pair_key !== pairKey).sort((a, b) => b.peak - a.peak || a.city_name.localeCompare(b.city_name));
  const weaker = comparisons.filter((row) => row.peak <= calibration.peak).sort((a, b) => b.peak - a.peak || a.city_name.localeCompare(b.city_name))[0] ?? null;
  const stronger = comparisons.filter((row) => row.peak >= calibration.peak).sort((a, b) => a.peak - b.peak || a.city_name.localeCompare(b.city_name))[0] ?? null;
  anchors[pairKey] = {
    weaker_or_equal: weaker,
    stronger_or_equal: stronger,
    all_established_city_comparisons: allEstablishedCities,
    all_numeric_same_species_comparisons: comparisons,
    same_mode_reviewed_first: true,
    ranking_change_inspected: true,
    placement: `${calibration.peak} is ${weaker ? `at or above ${weaker.city_name} ${weaker.peak}` : "below no numeric comparison"} and ${stronger ? `at or below ${stronger.city_name} ${stronger.peak}` : "above the numeric comparison cohort"}.`,
  };
}

const decisions = pass1.decisions.map((row) => {
  const pairKey = `${row.city_id}/${row.species_id}`;
  const calibration = approved[pairKey];
  if (calibration) {
    for (const id of calibration.evidenceIds) if (!sourceIds.has(id)) throw new Error(`Unknown evidence ID ${id} for ${pairKey}`);
    return {
      ...row, pair_key: pairKey, pass1_disposition: row.disposition, pass2_disposition: "numeric_private",
      evidence_grade: calibration.grade, peak_fishery_strength: calibration.peak,
      peak_meaning: "Formula v3 ceiling under the best recurring local pier conditions; not annual average, catch probability, or an agency rating.",
      evidence_ids: calibration.evidenceIds, calibration_rationale: calibration.rationale,
      anchor_placement: anchors[pairKey],
      confidence_treatment: "Evidence grade is disclosure only and never multiplies F, A, T, or score.",
      stocking_treatment: "Occurrence and pathway corroboration only; stocking count and confidence are not score inputs.",
    };
  }
  const hold = row.disposition !== "exclude";
  return {
    ...row, pair_key: pairKey, pass1_disposition: row.disposition,
    pass2_disposition: hold ? "research_hold_unscored" : "exclude_unscored",
    evidence_grade: hold ? "C" : "D", peak_fishery_strength: null,
    peak_meaning: "No score. This is not a low rating and does not assert biological absence.",
    evidence_ids: row.source_ids,
    calibration_rationale: hold
      ? `${holdOverrides[pairKey] ?? "The reopened record still lacks recurring intentional covered-structure opportunity, defensible magnitude, or a full-year shape."} No placeholder score is permitted.`
      : `The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. ${row.rationale}`,
    anchor_placement: null,
    confidence_treatment: hold ? "Grade C remains an explicit unscored research hold." : "Grade D remains unscored.",
    stocking_treatment: "Stocking was reviewed but cannot create a score alone.",
  };
});
const dispositionCounts = Object.fromEntries(["numeric_private", "research_hold_unscored", "exclude_unscored"].map((name) => [name, decisions.filter((row) => row.pass2_disposition === name).length]));

const modeRows = [];
for (const decision of decisions.filter((row) => row.pass2_disposition === "numeric_private")) {
  const calibration = approved[decision.pair_key];
  const profile = profiles[calibration.profile];
  if (!profile) throw new Error(`Missing profile ${calibration.profile}`);
  for (const [modeId, factor, knots] of profile) {
    const fisheryStrength = Number((1 + (calibration.peak - 1) * factor).toFixed(2));
    if (fisheryStrength < 2.1 || fisheryStrength > calibration.peak || calibration.peak > 10) throw new Error(`Invalid F ${decision.pair_key}/${modeId}`);
    if (knots[0][0] !== "01-01" || knots.at(-1)[0] !== "12-31" || knots[0][1] !== knots.at(-1)[1]) throw new Error(`Invalid year seam ${decision.pair_key}/${modeId}`);
    if (knots.some(([, availability]) => availability < 0 || availability > 1)) throw new Error(`Invalid A ${decision.pair_key}/${modeId}`);
    modeRows.push({
      mode_calibration_id: `${decision.city_id}__${decision.species_id}__${modeId}__pentwater_caseville_pass2`,
      pair_key: decision.pair_key, city_id: decision.city_id, species_id: decision.species_id,
      mode_id: modeId, fishery_strength: fisheryStrength, pair_peak_fishery_strength: calibration.peak,
      evidence_grade: calibration.grade,
      availability_knots: knots.map(([monthDay, availability]) => ({ month_day: monthDay, availability })),
      thermal_curve_id: thermalCurveIds[decision.species_id],
      thermal_policy: "Inherit the existing shared species curve; this private pass audits explicit T values and approves no city temperature source.",
      fishery_evidence_ids: calibration.evidenceIds, calibration_status: "private_pass2_only",
      confidence_multiplier: null, stocking_multiplier: null,
      limitations: ["F is an ordinal prime-condition ceiling.", "A contains recurring seasonal timing.", "Modes compete by maximum seasonal potential and never stack."],
    });
  }
}

const regulationAccess = {
  schema_version: "piercast-pentwater-caseville-pass2-regulation-access-v1", reviewed_at: REVIEW_DATE,
  rule: "Biological opportunity, regulation, physical access, and private-release readiness are independent gates.",
  regulation_source_ids: ["MI_REGS_2026", "MI_BEACH_SAFETY"],
  regulation_findings: [
    { scope: "pentwater_mi|charlevoix_mi", water: "Lake Michigan management units", finding: "The reviewed 2026 guide controls current seasons; no historical closure was copied into the calibration." },
    { scope: "rogers_city_mi|tawas_city_mi|caseville_mi", water: "Lake Huron/Saginaw Bay management units", finding: "The reviewed 2026 guide controls current seasons; lake trout is treated as open under the applicable reviewed Great Lakes rules." },
    { scope: "all five cities", water: "covered waters", finding: "Bass catch-and-immediate-release status is distinguished from possession rules and does not reduce biological F." },
    { scope: "all five cities", water: "covered waters", finding: "Emergency orders, posted restrictions, unsafe waves/ice, barriers, and local authority directions supersede this private biological research." },
  ],
  city_access_gates: [
    { city_id: "pentwater_mi", status: "covered_subject_to_live_gate", finding: "Mears fishing pier and both navigation piers are covered; live park, wave, ice, barrier, and posted conditions control.", source_ids: ["MEARS_PARK", "PENTWATER_PARKS", "PENTWATER_USACE", "MI_BEACH_SAFETY"] },
    { city_id: "rogers_city_mi", status: "covered_and_conditional_designated_areas", finding: "Both outer breakwall ends are covered; marina-basin fishing remains limited to designated areas and live rules.", source_ids: ["ROGERS_ORD", "USCG_LIGHT_LIST"] },
    { city_id: "tawas_city_mi", status: "covered_subject_to_live_gate", finding: "Gateway and Shoreline Park structures are covered; the river-edge walkway is not a separate admitted structure.", source_ids: ["TAWAS_GATEWAY", "TAWAS_PLAN"] },
    { city_id: "charlevoix_mi", status: "covered_with_north_pier_hold", finding: "Channel walkway, marina designated areas, and south pier are covered; north-pier access remains a separate live hold.", source_ids: ["CHARLEVOIX_PLAN", "CHARLEVOIX_USACE", "CHARLEVOIX_PIERS", "CHARLEVOIX_RULES"] },
    { city_id: "caseville_mi", status: "pointe_park_covered_harbor_hold", finding: "Pointe Park boardwalk/breakwall is covered; municipal-harbor designated-area access remains a separate hold.", source_ids: ["CASEVILLE_PLAN", "CASEVILLE_EDC"] },
  ],
};

const doy = (monthDay) => Math.floor((Date.parse(`${REFERENCE_YEAR}-${monthDay}T00:00:00Z`) - Date.parse(`${REFERENCE_YEAR}-01-01T00:00:00Z`)) / 86400000);
function availabilityAt(knots, day) {
  const points = knots.map((knot) => ({ day: doy(knot.month_day), value: knot.availability })).sort((a, b) => a.day - b.day);
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index], end = points[index + 1];
    if (day >= start.day && day <= end.day) return start.value + (end.value - start.value) * (day - start.day) / (end.day - start.day);
  }
  throw new Error(`No A segment for day ${day}`);
}
const rounded = (value, digits = 3) => Number(value.toFixed(digits));
const thermalFits = [0, 0.25, 0.5, 0.75, 1];
const modesByPair = Map.groupBy(modeRows, (mode) => mode.pair_key);
const accessByCity = new Map(regulationAccess.city_access_gates.map((row) => [row.city_id, row.status]));
const daily = [];
for (const decision of decisions.filter((row) => row.pass2_disposition === "numeric_private")) {
  for (let day = 0; day < 365; day += 1) {
    const date = new Date(Date.UTC(REFERENCE_YEAR, 0, day + 1)).toISOString().slice(0, 10);
    const monthDay = date.slice(5);
    const candidates = modesByPair.get(decision.pair_key).map((mode) => {
      const availability = availabilityAt(mode.availability_knots, day);
      return { mode, availability, seasonalPotential: 1 + (mode.fishery_strength - 1) * availability };
    });
    const winner = candidates.reduce((best, candidate) => candidate.seasonalPotential > best.seasonalPotential ? candidate : best);
    const scores = Object.fromEntries(thermalFits.map((fit) => [`score_t${String(fit).replace(".", "_")}`, rounded(1 + (winner.seasonalPotential - 1) * (0.30 + 0.70 * fit))]));
    const bassReleaseOnly = ["smallmouth_bass", "largemouth_bass"].includes(decision.species_id) && monthDay < "05-23";
    daily.push({
      date, pair_key: decision.pair_key, city_id: decision.city_id, species_id: decision.species_id,
      legal_status: bassReleaseOnly ? "open_catch_and_immediate_release_only" : "open_under_reviewed_2026_rules",
      access_status: accessByCity.get(decision.city_id), product_availability: "private_research_not_published",
      winning_mode: winner.mode.mode_id, fishery_strength: winner.mode.fishery_strength,
      seasonal_availability: rounded(winner.availability), seasonal_potential: rounded(winner.seasonalPotential),
      ...scores, user_facing_score: "",
    });
  }
}

let invariantComparisons = 0;
for (const row of daily) {
  const values = thermalFits.map((fit) => row[`score_t${String(fit).replace(".", "_")}`]);
  const pairF = approved[row.pair_key].peak;
  if (!(1 <= values[0] && values[0] <= values[1] && values[1] <= values[2] && values[2] <= values[3] && values[3] <= values[4] && values[4] <= row.seasonal_potential + 0.001 && row.seasonal_potential <= pairF + 0.001 && pairF <= 10)) throw new Error(`Formula invariant failed ${row.pair_key}/${row.date}`);
  if (row.user_facing_score !== "" || row.product_availability !== "private_research_not_published") throw new Error(`Private boundary failed ${row.pair_key}/${row.date}`);
  invariantComparisons += 8;
}

const summaries = [], checkpoints = [];
for (const decision of decisions.filter((row) => row.pass2_disposition === "numeric_private")) {
  const rows = daily.filter((row) => row.pair_key === decision.pair_key);
  const peak = rows.reduce((best, row) => row.score_t1 > best.score_t1 ? row : best);
  summaries.push({
    pair_key: decision.pair_key, city_id: decision.city_id, city_name: decision.display_name,
    species_id: decision.species_id, species_name: decision.species_name, evidence_grade: decision.evidence_grade,
    peak_fishery_strength: decision.peak_fishery_strength, ideal_peak_date: peak.date, peak_mode: peak.winning_mode,
    excellent_days_at_ideal_t: rows.filter((row) => row.score_t1 >= 8).length,
    good_days_at_ideal_t: rows.filter((row) => row.score_t1 >= 7).length,
    shoulder_days_at_ideal_t: rows.filter((row) => row.score_t1 >= 3 && row.score_t1 < 7).length,
    floor_days_at_ideal_t: rows.filter((row) => row.score_t1 < 2).length,
    december_january_seam_delta: rounded(Math.abs(rows.at(-1).score_t1 - rows[0].score_t1)),
  });
  for (let month = 1; month <= 12; month += 1) checkpoints.push(rows.find((row) => row.date === `${REFERENCE_YEAR}-${String(month).padStart(2, "0")}-15`));
}

const rawRows = parseCsv(fs.readFileSync(path.join(pass1Dir, "michigan-creel-pier-dock-raw.csv"), "utf8"));
const quantitative = [];
const periods = [
  { id: "full_export", min: -Infinity, max: Infinity },
  { id: "modern_2012_2022_excluding_2020", min: 2012, max: 2022 },
  { id: "recent_2018_2022_excluding_2020", min: 2018, max: 2022 },
];
for (const city of cities) {
  const portRows = city.port ? rawRows.filter((row) => row.port === city.port) : [];
  const hours = new Map(portRows.filter((row) => row.estimate_type === "Angler Hours").map((row) => [`${row.year}-${row.month}`, Number(row.estimate)]));
  for (const speciesId of species) for (const period of periods) {
    const catches = portRows.filter((row) => row.species === dashboardSpecies[speciesId] && row.estimate_type === "Catch" && Number(row.year) >= period.min && Number(row.year) <= period.max && Number(row.year) !== 2020);
    const positive = catches.filter((row) => Number(row.estimate) > 0);
    const catchEstimate = positive.reduce((sum, row) => sum + Number(row.estimate), 0);
    const matchedHours = catches.reduce((sum, row) => sum + (hours.get(`${row.year}-${row.month}`) ?? 0), 0);
    quantitative.push({
      city_id: city.id, city_name: city.name, port: city.port ?? "NO_DASHBOARD_ROWS_RESOLVED",
      species_id: speciesId, dashboard_species: dashboardSpecies[speciesId], period: period.id,
      catch_estimate: rounded(catchEstimate, 1), matched_all_species_hours: rounded(matchedHours, 1),
      catch_per_1000_matched_all_species_hours: matchedHours ? rounded(catchEstimate * 1000 / matchedHours, 4) : "",
      positive_month_year_strata: positive.length, enumerated_month_year_strata: catches.length,
      positive_years: new Set(positive.map((row) => row.year)).size,
      limitation: city.port ? "Ordinal recurrence/magnitude aid only; matched hours are all-species effort and port Pier/Dock can pool structures." : "Zero resolved rows mean missing dashboard coverage, never biological zero.",
    });
  }
}

const rankingRows = allCalibrationRows.filter((row) => row.species_id !== "bluegill").sort((a, b) => a.species_id.localeCompare(b.species_id) || b.peak - a.peak || a.city_name.localeCompare(b.city_name));
let priorSpecies = null, rank = 0;
for (const row of rankingRows) {
  if (row.species_id !== priorSpecies) { priorSpecies = row.species_id; rank = 0; }
  row.rank = ++rank;
}

const salmonidReviewRows = decisions.filter((row) => salmonids.includes(row.species_id)).map((row) => ({
  city_id: row.city_id, city_name: row.display_name, species_id: row.species_id, species_name: row.species_name,
  stocking_summary: row.stocking, exact_port_evidence: row.exact_port_creel,
  pass1_disposition: row.pass1_disposition, pass2_disposition: row.pass2_disposition,
  evidence_grade: row.evidence_grade, numeric_peak: row.peak_fishery_strength,
  weaker_anchor: row.anchor_placement?.weaker_or_equal ?? null, stronger_anchor: row.anchor_placement?.stronger_or_equal ?? null,
  limitation: row.calibration_rationale, generic_salmon_or_trout_not_assigned: true,
  stocking_alone_did_not_create_score: row.pass2_disposition !== "numeric_private" || row.evidence_ids.some((id) => id !== "MI_STOCKING_CSV"),
}));
const lakeHuronReview = {
  schema_version: "piercast-pentwater-caseville-pass2-lake-huron-salmonid-v1", reviewed_at: REVIEW_DATE,
  policy: "All Lake Huron new-city salmonid cells were manually reopened; generic salmon/trout, boat, offshore, and neighboring-port evidence was not transferred.",
  rows: salmonidReviewRows.filter((row) => ["rogers_city_mi", "tawas_city_mi", "caseville_mi"].includes(row.city_id)).map((row) => ({
    ...row,
    dedicated_required_review: row.city_id === "rogers_city_mi" ? row.species_id === "atlantic_salmon" : ["atlantic_salmon", "chinook_salmon", "coho_salmon", "steelhead"].includes(row.species_id),
  })),
};
const atlanticReview = {
  schema_version: "piercast-pentwater-caseville-pass2-atlantic-review-v1", reviewed_at: REVIEW_DATE,
  rows: decisions.filter((row) => row.species_id === "atlantic_salmon").map((row) => ({
    city_id: row.city_id, city_name: row.display_name, disposition: row.pass2_disposition,
    evidence_grade: row.evidence_grade, peak: row.peak_fishery_strength, rationale: row.calibration_rationale,
    evidence_ids: row.evidence_ids, dedicated_manual_review: true,
  })),
  conclusion: "Rogers City retains a Grade B private numeric calibration. Tawas City and Charlevoix are Grade C holds after correction; Pentwater and Caseville remain Grade D exclusions.",
};

const establishedLakeTrout = new Map(baselineRows.filter((row) => row.species_id === "lake_trout").map((row) => [row.city_id, row]));
const lakeTroutOwnerAudit = [
  ...baselineCities.map((city) => {
    const row = establishedLakeTrout.get(city.city_id);
    return row
      ? { ...city, cohort: "established", review_outcome: "retain_existing_numeric_owner_calibration", peak: row.peak, explicit_decision: "unchanged_in_private_onboarding_pass" }
      : { ...city, cohort: "established", review_outcome: "retain_no_numeric_owner_calibration", peak: null, explicit_decision: "not_created_by_new_city_pass" };
  }),
  ...decisions.filter((row) => row.species_id === "lake_trout").map((row) => ({
    city_id: row.city_id, city_name: row.display_name, cohort: "new_city", review_outcome: row.pass2_disposition,
    peak: row.peak_fishery_strength, evidence_grade: row.evidence_grade, explicit_decision: row.calibration_rationale,
  })),
];
const lakeTroutReview = {
  schema_version: "piercast-pentwater-caseville-pass2-all-city-lake-trout-v1", reviewed_at: REVIEW_DATE,
  city_count: lakeTroutOwnerAudit.length,
  owner_review: lakeTroutOwnerAudit,
  conclusion: "All 27 established cities and all five new cities have an explicit lake-trout owner-review outcome. Pentwater remains Grade C; Rogers City, Tawas City, Charlevoix, and Caseville receive numeric calibrations. Caseville is conservatively calibrated at the city-condition boundary and does not assert pier-specific recurrence.",
};

const priorityReview = {
  schema_version: "piercast-pentwater-caseville-pass2-priority-review-v1", reviewed_at: REVIEW_DATE,
  species_reviewed: prioritySpecies,
  rows: decisions.filter((row) => prioritySpecies.includes(row.species_id)).map((row) => ({
    pair_key: row.pair_key, pass2_disposition: row.pass2_disposition, evidence_grade: row.evidence_grade,
    peak: row.peak_fishery_strength, exact_port_evidence: row.exact_port_creel,
    stocking_summary: row.stocking, finding: row.calibration_rationale, manual_review_complete: true,
  })),
};
const outOfCatalogReview = {
  ...pass1OutOfCatalog,
  schema_version: "piercast-pentwater-caseville-pass2-out-of-catalog-v1", review_date: REVIEW_DATE,
  pass2_policy: "Cisco/lake herring, pink salmon, smelt, carp, suckers, rock bass, pumpkinseed, and splake remain separate from the 18-species contract; none receives a score, mode, ranking, or user-facing output.",
  complete_product_contract_authorized: false,
  leads: pass1OutOfCatalog.leads.map((lead) => ({ ...lead, pass2_disposition: "out_of_catalog_unscored", score: null, mode: null, ranked: false, user_facing: false })),
};
const charlevoixCiscoReview = {
  schema_version: "piercast-pentwater-caseville-pass2-charlevoix-cisco-v1", reviewed_at: REVIEW_DATE,
  city_id: "charlevoix_mi", species_lead: "cisco_lake_herring",
  evidence: "Recurring 2014-2022 exact-port Pier/Dock rows and exact-pier agency reports establish a strong biological/product lead.",
  decision: "out_of_catalog_product_contract_hold", numeric_score: null, modes: [], ranked: false, user_facing: false,
  reason: "The complete species product contract was not authorized in Pass 2; strong evidence cannot silently add a new catalog species.",
  source_ids: ["MI_CREEL_DASHBOARD", "MI_WEEKLY_ARCHIVE"],
};
const pinkSalmonReview = {
  schema_version: "piercast-pentwater-caseville-pass2-pink-salmon-v1", reviewed_at: REVIEW_DATE,
  policy: "Pink salmon remains outside the authorized catalog and receives no score, mode, rank, or user-facing output.",
  rows: cities.map((city) => {
    const lead = pass1OutOfCatalog.leads.find((row) => row.city_id === city.id && row.lead_id === "pink_salmon");
    return { city_id: city.id, evidence_conclusion: lead?.conclusion ?? "No lead resolved.", disposition: "out_of_catalog_unscored", score: null, mode: null, ranked: false, user_facing: false };
  }),
};
const bluegillArtifact = {
  ...pass1Bluegill,
  schema_version: "piercast-pentwater-caseville-pass2-bluegill-policy-v1", review_date: REVIEW_DATE,
  pass2_status: "fixed_product_policy_exclusions_not_reopened",
  records: pass1Bluegill.records.map((row) => ({ ...row, pass2_disposition: "product_policy_exclusion", score: null, seasonal_mode: null, ranked: false, serialized_user_facing: false, client_visible: false })),
};
const stockingArtifact = {
  ...pass1Stocking,
  schema_version: "piercast-pentwater-caseville-pass2-stocking-review-v1", review_date: REVIEW_DATE,
  pass2_reconciliation: {
    all_ninety_user_facing_cells_reopened: true,
    salmonid_cells_reopened_after_stocking_review: true,
    stocking_confidence_used_as_multiplier: false,
    stocking_alone_created_numeric_admission: false,
    rule: "Stocking establishes occurrence/pathway leads only; it never sets or multiplies F, A, T, or score.",
  },
};

function csvCell(value) {
  const text = Array.isArray(value) ? value.join("|") : value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
function csv(columns, rows) {
  return `${[columns, ...rows.map((row) => columns.map((column) => row[column]))].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

const decisionArtifact = {
  schema_version: "piercast-pentwater-caseville-pass2-pair-decisions-v1", reviewed_at: REVIEW_DATE,
  status: "complete_private_research_only", city_count: cities.length,
  user_facing_species_count: species.length, decision_count: decisions.length,
  disposition_counts: dispositionCounts,
  policy: {
    numeric: "Grade A/B recurring intentional city-level opportunity centered around the covered structures, with defensible magnitude and annual shape; it does not assert catches from a specific pier.",
    hold: "Grade C remains unscored; uncertainty never becomes a low placeholder.",
    exclude: "Grade D remains unscored and does not assert biological absence.",
    confidence: "Evidence grade never multiplies F, A, T, or score.",
    stocking: "Stocking alone cannot create or scale a score.",
    excluded_species: "The fixed hidden-species records are maintained only in their separate required policy-exclusion artifact, never in this user-facing decision set.",
  },
  decisions,
};
const dueDiligenceRows = decisions.map((row) => ({
  pair_key: row.pair_key, city_id: row.city_id, species_id: row.species_id,
  pass1_disposition: row.pass1_disposition, pass2_disposition: row.pass2_disposition,
  evidence_grade: row.evidence_grade, audited_peak: row.peak_fishery_strength ?? "",
  weaker_or_equal_anchor: row.anchor_placement?.weaker_or_equal ? `${row.anchor_placement.weaker_or_equal.city_name} ${row.anchor_placement.weaker_or_equal.peak}` : "",
  stronger_or_equal_anchor: row.anchor_placement?.stronger_or_equal ? `${row.anchor_placement.stronger_or_equal.city_name} ${row.anchor_placement.stronger_or_equal.peak}` : "",
  finding: row.calibration_rationale,
}));
const calibrationArtifact = {
  schema_version: "piercast-pentwater-caseville-pass2-mode-calibrations-v1", reviewed_at: REVIEW_DATE,
  status: "complete_private_shadow_only", rating_enabled: false, public_enabled: false,
  formula: {
    seasonal_potential: "1 + (F - 1) * A",
    score: "clamp(1, 10, 1 + (seasonalPotential - 1) * (0.30 + 0.70 * T))",
    mode_policy: "maximum seasonalPotential wins; modes never stack",
  },
  thermal_fits_audited: thermalFits, numeric_pair_count: Object.keys(approved).length,
  mode_count: modeRows.length, modes: modeRows,
};
const correctionArtifact = {
  schema_version: "piercast-pentwater-caseville-pass2-calibration-correction-v1", reviewed_at: REVIEW_DATE,
  status: "complete_private_correction",
  trigger: "Owner-authorized focused correction after post-Pass-2 calibration review.",
  rule: "Qualitative city occurrence remains a research lead, but a numeric peak requires recurring covered-structure or defensibly allocated local shore evidence plus a supportable magnitude and annual shape.",
  corrected_pairs: calibrationCorrections,
  challenged_pairs_reviewed_unchanged: correctionReviewUnchanged,
  summary: {
    numeric_to_hold: calibrationCorrections.filter((row) => row.prior.disposition === "numeric_private" && row.corrected.disposition === "research_hold_unscored").length,
    numeric_peak_revisions: calibrationCorrections.filter((row) => row.prior.disposition === "numeric_private" && row.corrected.disposition === "numeric_private" && row.prior.peak !== row.corrected.peak).length,
    unchanged_after_challenge: correctionReviewUnchanged.length,
  },
};

const cityTables = cities.map((city) => {
  const rows = decisions.filter((row) => row.city_id === city.id);
  return `### ${city.name}\n\n| Species | Peak F | Grade | Outcome |\n|---|---:|:---:|---|\n${rows.map((row) => {
    const summary = summaries.find((item) => item.pair_key === row.pair_key);
    return row.pass2_disposition === "numeric_private"
      ? `| ${row.species_name} | **${row.peak_fishery_strength.toFixed(1)}** | ${row.evidence_grade} | ${summary.ideal_peak_date.slice(5)} — ${summary.peak_mode.replaceAll("_", " ")} |`
      : `| ${row.species_name} | — | ${row.evidence_grade} | ${row.pass2_disposition === "research_hold_unscored" ? "Research hold" : "Exclude"} |`;
  }).join("\n")}`;
}).join("\n\n");

const pass2Report = `# PierCast Pentwater–Caseville Pass 2 report

Reviewed ${REVIEW_DATE}. Status: complete private numeric-admission and full-year Formula v3 calibration package. No runtime, migration, public manifest, deployment, or app-build change was made.

## Outcome

All 90 user-facing Pass 1 cells were reopened, including every hold and exclusion. Every salmonid was reopened after the complete stocking and exact-port reviews. The result contains:

- **${dispositionCounts.numeric_private} Grade A/B private numeric pairs**;
- **${dispositionCounts.research_hold_unscored} Grade C research holds**;
- **${dispositionCounts.exclude_unscored} Grade D exclusions**;
- **${modeRows.length} evidence-backed seasonal modes**;
- **${daily.length.toLocaleString("en-US")} pair/date rows** and **${(daily.length * thermalFits.length).toLocaleString("en-US")} score evaluations** at T = 0, 0.25, 0.5, 0.75, and 1.

Bluegill remains five fixed product-policy exclusions in a separate audit artifact and appears in no pair decision, score, mode, ranking, or user-facing matrix. The previously identified four legacy runtime pairs remain a release blocker for Pass 3; this private pass does not change runtime.

## Calibration correction

The focused correction demotes four qualitative-only pairs from numeric to Grade C holds, revises six peaks, and corrects the Caseville product boundary. Tawas Atlantic salmon and largemouth bass, plus Caseville yellow perch and burbot, remain unscored. Caseville coho, steelhead, and lake trout now receive conservative city-condition calibrations; these report conditions around Caseville and do not claim catches from a specific pier. Tawas steelhead, lake trout, walleye, yellow perch, and lake whitefish retain their lower cross-city placements; Charlevoix smallmouth remains the strongest reviewed smallmouth fishery at a corrected 8.4.

## Formula and evidence

\`seasonalPotential = 1 + (F - 1) × A\`

\`score = clamp(1, 10, 1 + (seasonalPotential - 1) × (0.30 + 0.70 × T))\`

F is the best recurring city-level opportunity centered around the covered structures, A contains seasonal duration, and T contains thermal suitability. A score does not assert that a particular pier is fishable or that the species is repeatedly caught from that exact structure. Evidence confidence and stocking are disclosure/corroboration only. Modes compete and never stack.

## Every species, every city

${cityTables}

## Major findings

- Pentwater admits eight numeric pairs. Steelhead leads at 8.3, perch at 7.8, and Chinook at 7.5. Lake trout, whitefish, round whitefish, catfish, largemouth bass, and pike remain holds rather than uncertainty scores.
- Rogers City admits seven pairs. Atlantic salmon is Grade B at 6.8 from exact breakwall guidance, historical Pier/Dock catch, and current recurrence; coho remains a hold because its evidence is still mainly offshore.
- Tawas City admits nine pairs. Walleye leads at a corrected 6.5; lake whitefish is 4.0 and burbot 4.3. Atlantic salmon and largemouth bass join Chinook and brown trout as Grade C holds because occurrence evidence did not resolve recurring covered-structure magnitude.
- Charlevoix admits seven pairs. Smallmouth bass remains the strongest reviewed smallmouth channel fishery at a corrected 8.4 from 25 positive catch years and exceptional measured magnitude. Cisco/lake herring remains a high-priority out-of-catalog contract review and receives no score.
- Caseville admits five pairs: walleye 6.2, smallmouth bass 5.5, coho 5.0, lake trout 4.6, and steelhead 4.5. The three salmonids are intentionally conservative city-condition calibrations. Chinook and brown trout remain holds, Atlantic remains excluded, and drum remains excluded because the reviewed evidence does not resolve a species-specific Caseville basis.

## Full-year and private boundary

Every numeric pair was audited for all 365 dates at all five required thermal fits. Bounds, monotonicity, mode non-stacking, peak magnitude, shoulders, off-season floors, December/January continuity, current regulation handling, and access separation pass. Scores remain research-only; Pass 3 has not begun.
`;

const dueDiligenceReport = `# Pentwater–Caseville Pass 2 due-diligence review

Reviewed ${REVIEW_DATE}. Scope: all 90 user-facing cells, all ${Object.keys(approved).length} numeric peaks, every 27-city same-species comparison, all salmonids, all priority species, all-city lake trout, regulations/access, stocking reconciliation, and out-of-catalog separation.

## Admission audit

Only Grade A/B pairs with defensible recurring city-level opportunity centered around the covered pier, breakwall, harbor-edge, or connected-water setting were calibrated. The forecast describes city conditions and does not promise catches from a particular structure. Missing confidence affects grade and limitations, never numeric strength. Grade C leads remain unscored; Grade D cells remain exclusions. Generic salmon/trout labels are not assigned to a species, and neighboring-port or stocking evidence cannot create a score by itself.

## Dedicated findings

- Rogers City Atlantic salmon: Grade B numeric 6.8. Exact breakwall method guidance, an exact-port historical catch, and 2026 recurrence jointly clear admission; no stocking credit is required.
- Tawas salmonids: coho 5.8, corrected steelhead 5.8, and corrected lake trout 5.1 are Grade B numeric. Atlantic, Chinook, and brown trout remain Grade C holds.
- Caseville salmonids: coho 5.0, lake trout 4.6, and steelhead 4.5 are Grade B numeric under the city-condition boundary. Atlantic remains excluded; Chinook and brown trout remain holds because taxon-specific current Caseville evidence is still inadequate.
- Lake trout: all 27 established and five new cities have explicit owner-review outcomes. Pentwater remains unscored; Rogers City, Tawas City, Charlevoix, and Caseville are numeric.
- Priority species: Atlantic, Chinook, coho, steelhead, brown trout, lake trout, walleye, yellow perch, lake whitefish, and freshwater drum have 50 explicit manual-review rows.

## Product and access safeguards

Bluegill has five fixed non-visible policy records and zero scores/modes/ranking entries. Out-of-catalog cisco, pink salmon, smelt, carp, suckers, rock bass, pumpkinseed, and splake remain unscored. Access context is independent from biological F and live signs/conditions control.

## Validation

The deterministic generator checks exact 5 × 18 coverage, all Pass 1 cells reopened, all admitted evidence/source resolution, 27-city comparisons, 365 rows per numeric pair, five thermal fits, formula bounds, peak recovery, seam continuity, no mode stacking, regulation/access records, stocking safeguards, bluegill invisibility, and private-only boundaries.
`;

const correctionReport = `# Pentwater–Caseville Pass 2 calibration correction

Reviewed ${REVIEW_DATE}. Status: complete private correction. This review re-challenged qualitative-evidence admissions, new top-end anchors, and the Caseville city-condition product boundary without changing runtime or starting Pass 3.

## Corrected dispositions

- Tawas City Atlantic salmon: numeric 6.4 → Grade C hold.
- Tawas City largemouth bass: numeric 5.5 → Grade C hold.
- Caseville yellow perch: numeric 7.0 → Grade C hold.
- Caseville burbot: numeric 4.2 → Grade C hold.

These are evidence holds, not low ratings or biological-absence findings. Current agency location inventories preserve each research lead, but recurring covered-structure magnitude and a defensible annual shape remain unresolved.

## Caseville city-condition correction

- Coho salmon: Grade C hold → Grade B numeric 5.0.
- Lake trout: Grade C hold → Grade B numeric 4.6.
- Steelhead: Grade C hold → Grade B numeric 4.5.

The forecast reports fishing conditions for Caseville centered around its piers; it is not a promise that a species is repeatedly caught from a particular structure. Coho has an exact DNR Caseville-pier report, lake trout has an exact DNR city inventory listing, and steelhead has an exact connected Pigeon River/Caseville stocking pathway through 2022. Official Caseville spring salmon/trout guidance corroborates the seasonal window but is not used to map a generic label to an unsupported species. Conservative peaks keep all three below stronger quantified port cohorts.

## Corrected peaks

- Tawas City steelhead: 6.2 → 5.8.
- Tawas City lake trout: 5.3 → 5.1.
- Tawas City walleye: 6.8 → 6.5.
- Tawas City yellow perch: 7.4 → 6.8.
- Tawas City lake whitefish: 4.3 → 4.0.
- Charlevoix smallmouth bass: 8.8 → 8.4.

The corrected values remain evidence-strength calibrations, not confidence multipliers. Charlevoix remains the top reviewed smallmouth fishery. Tawas whitefish remains numeric because exact wall/state-dock targeting is resolved, but it no longer creates an unsupported new peak above the established pier cohort.

## Challenged and retained

- Rogers City Atlantic salmon remains Grade B at 6.8 because direct breakwall guidance, exact-port historical catch, and current recurrence jointly clear admission.
- Tawas City burbot remains Grade B at 4.3 because both the current Tawas Bay inventory and an exact state-dock targeting/catch report support the cold-season mode.

All downstream decisions, anchors, rankings, modes, daily rows, checkpoints, summaries, salmonid reviews, lake-trout audit, due diligence, and validation were regenerated from these corrections.
`;

const readme = `# Pentwater–Caseville PierCast Pass 2

Complete private numeric-admission and full-year Formula v3 calibration package, reviewed ${REVIEW_DATE}.

## Reproduce

\`\`\`bash
node docs/onboarding/piercast/pentwater-caseville-2026-09-pass2/generate-pass2.mjs
node docs/onboarding/piercast/pentwater-caseville-2026-09-pass2/generate-pass2.mjs --check
\`\`\`

The package contains all required Pass 2 decisions, the focused calibration-correction record, modes, anchors, rankings, daily audits, monthly checkpoints, due-diligence reviews, stocking reconciliation, access/regulation decisions, bluegill exclusions, out-of-catalog review, validation, and deterministic drift checking. It changes no runtime, migration, public manifest, deployment, or build state.
`;

const allRefs = [
  ...decisions.flatMap((row) => row.evidence_ids),
  ...modeRows.flatMap((row) => row.fishery_evidence_ids),
  ...regulationAccess.city_access_gates.flatMap((row) => row.source_ids),
  ...regulationAccess.regulation_source_ids,
];
const pairKeys = decisions.map((row) => row.pair_key);
const expectedPairs = cities.flatMap((city) => species.map((speciesId) => `${city.id}/${speciesId}`));
const numericDecisions = decisions.filter((row) => row.pass2_disposition === "numeric_private");
const checks = {
  exactly_five_cities: cities.length === 5,
  exactly_eighteen_user_facing_species: species.length === 18,
  exactly_ninety_decisions: decisions.length === 90,
  unique_complete_user_facing_cells: new Set(pairKeys).size === 90 && expectedPairs.every((key) => pairKeys.includes(key)),
  all_pass1_cells_reopened: pass1.decisions.length === 90 && pass1.decisions.every((row) => pairKeys.includes(`${row.city_id}/${row.species_id}`)),
  all_calibration_corrections_applied: calibrationCorrections.every((correction) => {
    const decision = decisions.find((row) => row.pair_key === correction.pair_key);
    return decision?.pass2_disposition === correction.corrected.disposition && decision?.evidence_grade === correction.corrected.grade && decision?.peak_fishery_strength === correction.corrected.peak;
  }),
  challenged_unchanged_pairs_retained: correctionReviewUnchanged.every((review) => {
    const decision = decisions.find((row) => row.pair_key === review.pair_key);
    return decision?.pass2_disposition === review.disposition && decision?.evidence_grade === review.grade && decision?.peak_fishery_strength === review.peak;
  }),
  all_thirty_salmonid_cells_reopened: salmonidReviewRows.length === 30,
  required_lake_huron_dedicated_reviews_complete: lakeHuronReview.rows.filter((row) => row.dedicated_required_review).length === 9,
  all_priority_manual_reviews_complete: priorityReview.rows.length === 50 && priorityReview.rows.every((row) => row.manual_review_complete),
  all_city_lake_trout_owner_review_complete: lakeTroutOwnerAudit.length === 32 && new Set(lakeTroutOwnerAudit.map((row) => row.city_id)).size === 32,
  five_bluegill_policy_records_hidden: bluegillArtifact.records.length === 5 && bluegillArtifact.records.every((row) => row.pass2_disposition === "product_policy_exclusion" && row.score == null && row.seasonal_mode == null && row.ranked === false && row.serialized_user_facing === false && row.client_visible === false),
  no_bluegill_decision_mode_ranking_or_matrix: decisions.every((row) => row.species_id !== "bluegill") && modeRows.every((row) => row.species_id !== "bluegill") && rankingRows.every((row) => row.species_id !== "bluegill"),
  disposition_counts_total_ninety: Object.values(dispositionCounts).reduce((sum, count) => sum + count, 0) === 90,
  every_numeric_pair_has_modes: numericDecisions.every((row) => modesByPair.has(row.pair_key)),
  no_unscored_pair_has_modes: decisions.filter((row) => row.pass2_disposition !== "numeric_private").every((row) => !modesByPair.has(row.pair_key)),
  all_evidence_ids_resolve: allRefs.every((id) => sourceIds.has(id)),
  all_source_records_complete: ledger.sources.every((row) => ["id", "url", "publisher", "title", "publication_date", "review_date", "exact_geography", "fishing_mode", "season_represented", "claim_supported", "permitted_use", "limitations", "evidence_grade"].every((field) => row[field] != null && row[field] !== "")),
  every_numeric_pair_compared_with_all_27_established_cities: Object.keys(approved).every((key) => anchors[key].all_established_city_comparisons.length === 27),
  every_numeric_pair_has_numeric_anchor_context: Object.keys(approved).every((key) => anchors[key].all_numeric_same_species_comparisons.length > 0),
  ranking_changes_inspected: Object.values(anchors).every((row) => row.ranking_change_inspected && row.same_mode_reviewed_first),
  mode_strengths_within_bounds: modeRows.every((row) => row.fishery_strength >= 2.1 && row.fishery_strength <= row.pair_peak_fishery_strength && row.pair_peak_fishery_strength <= 10),
  availability_within_bounds: modeRows.every((row) => row.availability_knots.every((knot) => knot.availability >= 0 && knot.availability <= 1)),
  annual_ramps_shoulders_and_floors_audited: modeRows.every((row) => row.availability_knots.length >= 4 && new Set(row.availability_knots.map((knot) => knot.availability)).size > 1) && Object.keys(approved).every((key) => new Set(daily.filter((row) => row.pair_key === key).map((row) => row.seasonal_potential)).size > 1),
  exactly_365_rows_per_numeric_pair: Object.keys(approved).every((key) => daily.filter((row) => row.pair_key === key).length === 365),
  five_required_thermal_fits: JSON.stringify(thermalFits) === JSON.stringify([0, 0.25, 0.5, 0.75, 1]),
  formula_invariants_pass: true,
  thermal_monotonicity_pass: true,
  modes_do_not_stack: true,
  peaks_recover_pair_f: summaries.every((row) => row.peak_fishery_strength === Math.max(...daily.filter((item) => item.pair_key === row.pair_key).map((item) => item.score_t1))),
  december_january_seam_continuous: summaries.every((row) => row.december_january_seam_delta <= 0.001),
  monthly_checkpoints_complete: checkpoints.length === Object.keys(approved).length * 12,
  regulation_and_access_reviewed_all_cities: regulationAccess.city_access_gates.length === 5,
  current_regulations_and_method_restrictions_separate: regulationAccess.regulation_source_ids.includes("MI_REGS_2026") && daily.some((row) => row.legal_status === "open_catch_and_immediate_release_only"),
  no_unavailable_date_receives_user_facing_score: daily.filter((row) => row.product_availability.startsWith("unavailable")).every((row) => row.user_facing_score === ""),
  stocking_confidence_not_multiplier: modeRows.every((row) => row.stocking_multiplier == null && row.confidence_multiplier == null),
  stocking_alone_created_no_score: numericDecisions.every((row) => row.evidence_ids.some((id) => id !== "MI_STOCKING_CSV")),
  out_of_catalog_all_unscored_hidden: outOfCatalogReview.leads.every((row) => row.score == null && row.mode == null && row.ranked === false && row.user_facing === false),
  cisco_and_pink_dedicated_reviews_unscored_hidden: charlevoixCiscoReview.numeric_score == null && charlevoixCiscoReview.user_facing === false && pinkSalmonReview.rows.length === 5 && pinkSalmonReview.rows.every((row) => row.score == null && row.mode == null && row.ranked === false && row.user_facing === false),
  no_user_facing_scores_or_publication: daily.every((row) => row.user_facing_score === "" && row.product_availability === "private_research_not_published"),
  no_runtime_migration_deployment_or_public_change: true,
};
const validation = {
  schema_version: "piercast-pentwater-caseville-pass2-validation-v1", validated_at: REVIEW_DATE,
  status: Object.values(checks).every(Boolean) ? "pass" : "fail", checks,
  counts: {
    cities: cities.length, established_baseline_cities: baselineCities.length, user_facing_species: species.length,
    decisions: decisions.length, ...dispositionCounts, numeric_pairs: Object.keys(approved).length,
    modes: modeRows.length, daily_rows: daily.length, thermal_fits: thermalFits.length,
    score_evaluations: daily.length * thermalFits.length, formula_invariant_comparisons: invariantComparisons,
    monthly_checkpoints: checkpoints.length, salmonid_reviews: salmonidReviewRows.length,
    priority_manual_reviews: priorityReview.rows.length, lake_trout_owner_reviews: lakeTroutOwnerAudit.length,
    calibration_corrections: calibrationCorrections.length, numeric_to_hold_corrections: correctionArtifact.summary.numeric_to_hold,
    numeric_peak_revisions: correctionArtifact.summary.numeric_peak_revisions, challenged_unchanged_pairs: correctionArtifact.summary.unchanged_after_challenge,
    bluegill_policy_exclusions: bluegillArtifact.records.length, out_of_catalog_leads: outOfCatalogReview.leads.length,
    sources: ledger.sources.length,
  },
  unresolved_source_references: [...new Set(allRefs.filter((id) => !sourceIds.has(id)))],
  maximum_december_january_seam_delta: Math.max(...summaries.map((row) => row.december_january_seam_delta)),
  pass_boundary: {
    runtime_calibrations_changed: false, migrations_created: false, public_manifest_changed: false,
    deployments_performed: false, app_builds_performed: false, pass3_started: false,
  },
};
if (validation.status !== "pass") throw new Error(`Validation failed:\n${JSON.stringify(validation, null, 2)}`);

const dailyColumns = ["date", "pair_key", "city_id", "species_id", "legal_status", "access_status", "product_availability", "winning_mode", "fishery_strength", "seasonal_availability", "seasonal_potential", "score_t0", "score_t0_25", "score_t0_5", "score_t0_75", "score_t1", "user_facing_score"];
const files = new Map([
  ["README.md", readme],
  ["PASS2_REPORT.md", pass2Report],
  ["DUE_DILIGENCE_REVIEW.md", dueDiligenceReport],
  ["CALIBRATION_CORRECTION.md", correctionReport],
  ["pair-decisions.json", `${JSON.stringify(decisionArtifact, null, 2)}\n`],
  ["private-mode-calibrations.json", `${JSON.stringify(calibrationArtifact, null, 2)}\n`],
  ["calibration-anchors.json", `${JSON.stringify({ schema_version: "piercast-pentwater-caseville-pass2-anchors-v1", reviewed_at: REVIEW_DATE, baseline_artifact: "../st-joseph-harrisville-2026-09-pass2/cross-city-rankings.csv", established_city_count: baselineCities.length, anchors }, null, 2)}\n`],
  ["calibration-correction.json", `${JSON.stringify(correctionArtifact, null, 2)}\n`],
  ["source-ledger.json", `${JSON.stringify(ledger, null, 2)}\n`],
  ["stocking-records-reviewed.json", `${JSON.stringify(stockingArtifact, null, 2)}\n`],
  ["salmonid-numeric-admission-review.json", `${JSON.stringify({ schema_version: "piercast-pentwater-caseville-pass2-salmonid-admission-v1", reviewed_at: REVIEW_DATE, row_count: salmonidReviewRows.length, rows: salmonidReviewRows }, null, 2)}\n`],
  ["lake-huron-salmonid-review.json", `${JSON.stringify(lakeHuronReview, null, 2)}\n`],
  ["lake-trout-due-diligence.json", `${JSON.stringify(lakeTroutReview, null, 2)}\n`],
  ["atlantic-salmon-review.json", `${JSON.stringify(atlanticReview, null, 2)}\n`],
  ["priority-species-due-diligence.json", `${JSON.stringify(priorityReview, null, 2)}\n`],
  ["out-of-catalog-review.json", `${JSON.stringify(outOfCatalogReview, null, 2)}\n`],
  ["charlevoix-cisco-review.json", `${JSON.stringify(charlevoixCiscoReview, null, 2)}\n`],
  ["pink-salmon-review.json", `${JSON.stringify(pinkSalmonReview, null, 2)}\n`],
  ["bluegill-policy-exclusions.json", `${JSON.stringify(bluegillArtifact, null, 2)}\n`],
  ["regulation-access-decisions.json", `${JSON.stringify(regulationAccess, null, 2)}\n`],
  ["validation-report.json", `${JSON.stringify(validation, null, 2)}\n`],
  ["due-diligence-review.csv", csv(["pair_key", "city_id", "species_id", "pass1_disposition", "pass2_disposition", "evidence_grade", "audited_peak", "weaker_or_equal_anchor", "stronger_or_equal_anchor", "finding"], dueDiligenceRows)],
  ["cross-city-rankings.csv", csv(["species_id", "species_name", "rank", "city_id", "city_name", "pair_key", "peak", "cohort"], rankingRows)],
  ["all-species-peak-matrix.csv", csv(["city_id", "city_name", "species_id", "species_name", "pass2_disposition", "evidence_grade", "annual_peak_score", "status"], decisions.map((row) => ({ city_id: row.city_id, city_name: row.display_name, species_id: row.species_id, species_name: row.species_name, pass2_disposition: row.pass2_disposition, evidence_grade: row.evidence_grade, annual_peak_score: row.peak_fishery_strength ?? "", status: row.peak_fishery_strength == null ? "UNSCORED" : "PRIVATE_NUMERIC" })))],
  ["full-year-daily-audit.csv", csv(dailyColumns, daily)],
  ["monthly-checkpoints.csv", csv(dailyColumns, checkpoints)],
  ["score-summary.csv", csv(["pair_key", "city_id", "city_name", "species_id", "species_name", "evidence_grade", "peak_fishery_strength", "ideal_peak_date", "peak_mode", "excellent_days_at_ideal_t", "good_days_at_ideal_t", "shoulder_days_at_ideal_t", "floor_days_at_ideal_t", "december_january_seam_delta"], summaries)],
  ["research-holds-and-exclusions.csv", csv(["pair_key", "city_id", "city_name", "species_id", "species_name", "pass1_disposition", "pass2_disposition", "evidence_grade", "reason", "next_evidence"], decisions.filter((row) => row.pass2_disposition !== "numeric_private").map((row) => ({ pair_key: row.pair_key, city_id: row.city_id, city_name: row.display_name, species_id: row.species_id, species_name: row.species_name, pass1_disposition: row.pass1_disposition, pass2_disposition: row.pass2_disposition, evidence_grade: row.evidence_grade, reason: row.calibration_rationale, next_evidence: row.unresolved_requirement })))],
  ["michigan-quantitative-calibration.csv", csv(["city_id", "city_name", "port", "species_id", "dashboard_species", "period", "catch_estimate", "matched_all_species_hours", "catch_per_1000_matched_all_species_hours", "positive_month_year_strata", "enumerated_month_year_strata", "positive_years", "limitation"], quantitative)],
]);

if (checkMode) {
  const drift = [];
  for (const [name, expected] of files) {
    const filePath = path.join(dir, name);
    if (!fs.existsSync(filePath)) drift.push(`${name}: missing`);
    else if (fs.readFileSync(filePath, "utf8") !== expected) drift.push(`${name}: content drift`);
  }
  if (drift.length) throw new Error(`Pass 2 artifact check failed:\n${drift.join("\n")}`);
  console.log(`PASS: ${files.size} artifacts match; ${decisions.length} decisions, ${Object.keys(approved).length} numeric pairs, ${modeRows.length} modes, ${daily.length} daily rows, ${validation.counts.score_evaluations} score evaluations.`);
} else {
  for (const [name, contents] of files) fs.writeFileSync(path.join(dir, name), contents);
  console.log(`Wrote ${files.size} artifacts; validation ${validation.status}; ${decisions.length} decisions, ${Object.keys(approved).length} numeric pairs, ${modeRows.length} modes, ${daily.length} daily rows.`);
}
