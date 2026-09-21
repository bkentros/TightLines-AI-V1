// Run from the repository root. This package is private research only.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REVIEW_DATE = "2026-09-19";
const REFERENCE_YEAR = 2026;
const dir = path.dirname(fileURLToPath(import.meta.url));
const piercastDir = path.resolve(dir, "..");
const pass1Dir = path.resolve(piercastDir, "st-joseph-harrisville-2026-09-pass1");
const checkMode = process.argv.includes("--check");

const pass1 = JSON.parse(fs.readFileSync(path.join(pass1Dir, "species-decisions.json"), "utf8"));
const pass1Ledger = JSON.parse(fs.readFileSync(path.join(pass1Dir, "source-ledger.json"), "utf8"));
const raw = JSON.parse(fs.readFileSync(path.join(pass1Dir, "michigan-creel-pier-dock-raw.json"), "utf8"));

const cities = [
  { id: "st_joseph_mi", name: "St. Joseph", port: null },
  { id: "south_haven_mi", name: "South Haven", port: "SOUTH HAVEN" },
  { id: "holland_mi", name: "Holland", port: "HOLLAND" },
  { id: "lexington_mi", name: "Lexington", port: "LEXINGTON" },
  { id: "harrisville_mi", name: "Harrisville", port: "HARRISVILLE" },
];
const species = [
  "chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "lake_trout",
  "walleye", "smallmouth_bass", "freshwater_drum", "yellow_perch",
  "lake_whitefish", "round_whitefish", "channel_catfish", "largemouth_bass",
  "atlantic_salmon", "northern_pike", "burbot", "white_perch", "white_bass", "bluegill",
];
const speciesNames = {
  chinook_salmon: "Chinook salmon", coho_salmon: "Coho salmon", steelhead: "Steelhead",
  brown_trout: "Brown trout", lake_trout: "Lake trout", walleye: "Walleye",
  smallmouth_bass: "Smallmouth bass", freshwater_drum: "Freshwater drum",
  yellow_perch: "Yellow perch", lake_whitefish: "Lake whitefish",
  round_whitefish: "Round whitefish", channel_catfish: "Channel catfish",
  largemouth_bass: "Largemouth bass", atlantic_salmon: "Atlantic salmon",
  northern_pike: "Northern pike", burbot: "Burbot", white_perch: "White perch",
  white_bass: "White bass", bluegill: "Bluegill",
};
const dashboardSpecies = {
  chinook_salmon: "Chinook Salmon", coho_salmon: "Coho Salmon", steelhead: "Steelhead",
  brown_trout: "Brown Trout", lake_trout: "Lean Lake Trout", walleye: "Walleye",
  smallmouth_bass: "Smallmouth Bass", freshwater_drum: "Drum", yellow_perch: "Yellow Perch",
  lake_whitefish: "Lake Whitefish", round_whitefish: "Round Whitefish",
  channel_catfish: "Channel Catfish", largemouth_bass: "Largemouth Bass",
  atlantic_salmon: "Atlantic Salmon", northern_pike: "Northern Pike", burbot: "Burbot",
  white_perch: "White Perch", white_bass: "White Bass", bluegill: "Bluegill",
};
const thermalCurveIds = Object.fromEntries(species.map((id) => [id, `${id}__existing_shared_temperature_curve`]));
Object.assign(thermalCurveIds, {
  chinook_salmon: "chinook_salmon__shared_temperature__v0_2",
  coho_salmon: "coho_salmon__shared_temperature__v0_2",
  steelhead: "steelhead__shared_temperature__v0_2",
  brown_trout: "brown_trout__shared_temperature__v0_2",
  lake_trout: "lake_trout__additional_thermal_research__v0_1",
  walleye: "walleye__additional_thermal_research__v0_1",
  smallmouth_bass: "smallmouth_bass__additional_thermal_research__v0_1",
  freshwater_drum: "freshwater_drum__additional_thermal_research__v0_1",
  yellow_perch: "yellow_perch__additional_thermal_research__v0_1",
  lake_whitefish: "lake_whitefish__additional_thermal_research__v0_1",
  round_whitefish: "round_whitefish__additional_thermal_research__v0_1",
  channel_catfish: "channel_catfish__additional_thermal_research__v0_1",
  largemouth_bass: "largemouth_bass__additional_thermal_research__v0_1",
  atlantic_salmon: "atlantic_salmon__shared_temperature__v0_1",
  northern_pike: "northern_pike__shared_temperature__v0_1",
  white_bass: "white_bass__shared_temperature__v0_1_research",
});

const extraSources = [
  {
    id: "MI_COHO_SPECIES", url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/coho-salmon",
    publisher: "Michigan Department of Natural Resources", title: "Coho salmon", publication_date: "current undated page", review_date: REVIEW_DATE,
    exact_geography: "St. Joseph and New Buffalo nearshore waters and piers", fishing_mode: "nearshore trolling and pier fishing, explicitly separated in text",
    season_represented: "spring southern Lake Michigan; late-fall connected-river context separately described",
    claim_supported: "Calls St. Joseph/New Buffalo spring coho excellent and states pier anglers often have good fishing with spawn bags or spoons.",
    permitted_use: "Primary exact-city pier magnitude and spring timing evidence for St. Joseph coho; river and trolling claims are not transferred to the pier.",
    limitations: "No standardized pier effort or catch rate and no north/south-pier allocation.", evidence_grade: "B-primary-species-guidance",
  },
  {
    id: "MI_HOLLAND_GMP", url: "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/PRD/MgtPlans-archive/Holland_Phase2_GMP.pdf",
    publisher: "Michigan Department of Natural Resources", title: "Holland State Park Phase 2 General Management Plan", publication_date: "2021", review_date: REVIEW_DATE,
    exact_geography: "Holland port, Holland State Park, Lake Michigan, and Lake Macatawa", fishing_mode: "2013 port creel summary with modes not separated; park and channel context",
    season_represented: "2013 survey and long-term park context",
    claim_supported: "Reports more than 20,000 angler trips in the 2013 Holland creel and names yellow perch, Chinook, coho, steelhead, and lake trout as primary species caught.",
    permitted_use: "Current-agency planning corroboration of Holland port identity and species importance; mode-matched dashboard rows control pier magnitude where available.",
    limitations: "The summary is not Pier/Dock-only and separately discusses Lake Macatawa warmwater fisheries; those cannot be silently assigned to the north pier.", evidence_grade: "B-primary-management",
  },
  {
    id: "MI_LMCFAC_2024", url: "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LMCFAC/Minutes/minutes-oct-9-2024.pdf",
    publisher: "Michigan Department of Natural Resources, Lake Michigan Citizens Fishery Advisory Committee", title: "Minutes — October 9, 2024", publication_date: "2024-10-09", review_date: REVIEW_DATE,
    exact_geography: "Holland and South Haven port areas", fishing_mode: "mixed, predominantly boat/port-season discussion",
    season_represented: "2024 open-water season",
    claim_supported: "Describes Holland Chinook/coho/steelhead fishing as superb and South Haven summer offshore salmon fishing as excellent while calling South Haven spring lake trout slow and perch poor.",
    permitted_use: "Current port context and conflict checking only; direct Pier/Dock records control covered-structure magnitude.",
    limitations: "Mode and structure are not allocated; offshore depth statements cannot establish pier scores.", evidence_grade: "C-primary-advisory-context",
  },
  {
    id: "MI_GL_SURVEY_2026", url: "https://www.michigan.gov/dnr/about/newsroom/releases/2026/03/10/great-lakes-fisheries-survey-highlights",
    publisher: "Michigan Department of Natural Resources", title: "Great Lakes fisheries survey highlights", publication_date: "2026-03-10", review_date: REVIEW_DATE,
    exact_geography: "Lake Michigan survey ports including St. Joseph and South Haven", fishing_mode: "agency assessment nets and lakewide acoustic/bottom-trawl surveys, not angling",
    season_represented: "2025 assessment season",
    claim_supported: "Documents southern Lake Michigan assessment coverage and improved 2025 South Haven yellow-perch recruitment signal.",
    permitted_use: "Current biological context and future-recruitment uncertainty only.",
    limitations: "Assessment catches are not pier angling opportunity and do not justify a current score increase.", evidence_grade: "C-primary-biological-context",
  },
];
const ledger = {
  ...pass1Ledger,
  schema_version: "piercast-st-joseph-harrisville-pass2-source-ledger-v1",
  inherited_from: "../st-joseph-harrisville-2026-09-pass1/source-ledger.json",
  pass2_use: "Admissions, magnitude, annual shape, access, regulations, holds, and exclusions.",
  sources: [...pass1Ledger.sources, ...extraSources],
};
const sourceIds = new Set(ledger.sources.map((source) => source.id));

const numeric = (strength, grade, profile, rationale, evidenceIds) => ({ strength, grade, profile, rationale, evidenceIds });
const approved = {
  "st_joseph_mi/chinook_salmon": numeric(6.8, "B", "chinook_stj", "The current DNR pier inventory and southern-port roadmap establish recurring spring/summer pier opportunity. With no resolved St. Joseph dashboard row, the peak is placed below Chicago 7.0 and above Muskegon 6.5; missing port estimates remain a confidence limitation only.", ["MI_BETTER_WATERS", "MI_ROADMAP_LM", "STJ_BERRIEN_FISH"]),
  "st_joseph_mi/coho_salmon": numeric(8.6, "B", "coho_spring", "DNR explicitly calls the St. Joseph spring fishery excellent and pier fishing often good. That exact-city qualitative magnitude supports the Frankfort/Kenosha 8.6 tier below Grand Haven/Waukegan 8.8.", ["MI_BETTER_WATERS", "MI_ROADMAP_LM", "STJ_BERRIEN_FISH", "MI_COHO_SPECIES"]),
  "st_joseph_mi/steelhead": numeric(7.8, "B", "steelhead_stj", "Current exact-pier inventory and year-round southern-port seasonal guidance establish a strong multi-window fishery. The value matches the corrected Kewaunee/Sheboygan tier and remains below Ludington 8.1.", ["MI_BETTER_WATERS", "MI_ROADMAP_LM", "STJ_BERRIEN_FISH"]),
  "st_joseph_mi/brown_trout": numeric(6.5, "B", "brown_standard", "DNR and Berrien County both name brown trout at the pier, with winter/spring port timing. The ordinary-to-strong placement is just above Kenosha 6.4 and below Waukegan 7.0.", ["MI_BETTER_WATERS", "MI_ROADMAP_LM", "STJ_BERRIEN_FISH"]),
  "st_joseph_mi/lake_trout": numeric(4.1, "B", "lake_trout_cold", "DNR explicitly identifies St. Joseph Pier and the port roadmap supplies cold-season timing. Without a resolved direct estimate, the ordinary peak is bracketed by the 4.0 Michigan breakwater cohort and Kewaunee 4.2.", ["MI_BETTER_WATERS", "MI_ROADMAP_LM", "STJ_BERRIEN_FISH", "MI_REGS_2026"]),
  "st_joseph_mi/yellow_perch": numeric(6.0, "B", "perch_summer", "DNR identifies the pier and Berrien County independently names lake perch at South Pier. The lack of a resolvable quantitative row keeps confidence at B, while the exact target identity supports a moderate ceiling above Muskegon and Port Sanilac.", ["MI_BETTER_WATERS", "STJ_BERRIEN_FISH", "MI_GL_SURVEY_2026"]),
  "st_joseph_mi/lake_whitefish": numeric(4.0, "B", "whitefish_cold", "Current DNR exact-pier identification supports an intentional cold-season fishery. No lawful-method magnitude series supports exceeding the established 4.0 Lake Michigan pier anchor.", ["MI_BETTER_WATERS", "MI_ROADMAP_LM", "MI_REGS_2026"]),

  "south_haven_mi/chinook_salmon": numeric(7.0, "A", "chinook_lm", "Twenty-two positive Pier/Dock catch years establish recurrence. Modern and recent strength is above Muskegon but materially below elite staging ports, supporting Chicago's 7.0 tier.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_ROADMAP_LM"]),
  "south_haven_mi/coho_salmon": numeric(7.8, "A", "coho_spring", "Twenty positive catch years and about 35 catch per 1,000 matched all-species hours in the recent period support a strong spring ceiling above Whitehall 7.4 and below the 8.2 cohort.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_ROADMAP_LM"]),
  "south_haven_mi/steelhead": numeric(8.8, "A", "steelhead_south_haven", "Twenty-three positive catch years, strong modern magnitude, and distinct summer and fall peaks support an excellent ceiling below Grand Haven 9.2 and above Whitehall 8.7.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_ROADMAP_LM"]),
  "south_haven_mi/brown_trout": numeric(6.5, "A", "brown_standard", "Twenty-one positive catch years establish recurrence, while measured modern and recent decline places the peak above Kenosha 6.4 but below Muskegon/Waukegan 7.0.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_ROADMAP_LM"]),
  "south_haven_mi/lake_trout": numeric(3.8, "A", "lake_trout_fall", "Seven positive Catch years with low full and recent matched-effort magnitude support a limited but recurring pier fishery equal to Ludington and above Grand Haven.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_ROADMAP_LM", "MI_REGS_2026"]),
  "south_haven_mi/walleye": numeric(4.3, "A", "walleye_spring", "Six positive catch years establish a real but low-magnitude pier fishery. Modern and recent matched-effort catch remains below Frankfort 4.5 and the stronger Lake Huron ports.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS"]),
  "south_haven_mi/smallmouth_bass": numeric(5.2, "A", "smallmouth_warm", "Eleven positive catch years and recurring warm-season rows support an ordinary fishery below Port Sanilac 5.4 and above Manistee 5.0.", ["MI_CREEL_DASHBOARD", "SOUTH_HAVEN_FISHING"]),
  "south_haven_mi/freshwater_drum": numeric(6.5, "A", "drum_warm", "Sixteen positive catch years and strong modern/recent matched-effort magnitude support a strong warm-season ceiling above Muskegon 6.2 and below Grand Haven 7.2.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LM"]),
  "south_haven_mi/yellow_perch": numeric(5.4, "A", "perch_south_haven", "Thirteen positive catch years and current exact-pier identification retain a numeric fishery, but zero recent Catch rows and the 2024 advisory's poor assessment cap it just above Muskegon 5.2.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_LMCFAC_2024", "MI_GL_SURVEY_2026"]),
  "south_haven_mi/lake_whitefish": numeric(4.0, "B", "whitefish_cold", "Seven historical positive Catch years plus current exact-pier identification establish an intentional cold-season fishery; no modern positive Catch row supports exceeding the ordinary lawful 4.0 anchor.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_REGS_2026"]),
  "south_haven_mi/round_whitefish": numeric(3.7, "B", "round_whitefish_spring_fall", "Six positive Catch years including two recent years establish low-magnitude spring/fall recurrence. The value remains below Grand Haven 3.8 and Manistee 4.1.", ["MI_CREEL_DASHBOARD", "MI_REGS_2026"]),
  "south_haven_mi/channel_catfish": numeric(5.2, "A", "catfish_warm", "Eleven positive Catch years with persistent modern and recent rows support an ordinary warm-season fishery above Whitehall 5.0 and below Muskegon 6.0.", ["MI_CREEL_DASHBOARD", "SOUTH_HAVEN_FISHING"]),
  "south_haven_mi/northern_pike": numeric(4.8, "A", "pike_standard", "Seven positive Catch years support an ordinary harbor opportunity equal to Muskegon and below Whitehall; low recent magnitude prevents a stronger placement.", ["MI_CREEL_DASHBOARD"]),

  "holland_mi/chinook_salmon": numeric(7.8, "A", "chinook_lm", "Nine positive Pier/Dock catch years with high measured magnitude support Grand Haven's 7.8 tier. Current mixed-mode advisory evidence corroborates continued port importance but does not raise the pier value.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_HOLLAND_GMP", "MI_LMCFAC_2024"]),
  "holland_mi/coho_salmon": numeric(7.0, "B", "coho_spring", "Four positive Pier/Dock catch years plus current grouped-pier identification establish recurrence, but sparse modern coverage supports the Algoma 7.0 tier rather than the stronger southern references.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_HOLLAND_GMP", "MI_LMCFAC_2024"]),
  "holland_mi/steelhead": numeric(7.3, "A", "steelhead_holland", "Seven positive catch years and a modern positive stratum support a strong fishery between Two Rivers 7.3 and Oscoda 7.4, with current mixed-port corroboration.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_HOLLAND_GMP", "MI_LMCFAC_2024"]),
  "holland_mi/brown_trout": numeric(7.2, "A", "brown_standard", "Eight positive Catch years and strong historical magnitude support the Manitowoc/Two Rivers 7.2 tier; one large August estimate is not allowed to create an elite peak.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_ROADMAP_LM"]),
  "holland_mi/lake_trout": numeric(3.8, "B", "lake_trout_cold", "Grouped current pier identification, the port roadmap, and the state-park plan establish a real fishery, while the two reviewed Pier/Dock strata are zero. The value matches Ludington and stays below the 4.0 cohort.", ["MI_BETTER_WATERS", "MI_ROADMAP_LM", "MI_HOLLAND_GMP", "MI_CREEL_DASHBOARD", "MI_REGS_2026"]),
  "holland_mi/walleye": numeric(4.5, "B", "walleye_summer", "Three positive Pier/Dock catch years and the grouped agency pier inventory establish a low ordinary fishery equal to Frankfort. Lake Macatawa stocking and boat fishing do not increase the pier ceiling.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_HOLLAND_GMP"]),
  "holland_mi/smallmouth_bass": numeric(5.2, "B", "smallmouth_warm", "Five positive Catch years support an ordinary channel/pier opportunity between Manistee 5.0 and Port Sanilac 5.4; no Lake Macatawa transfer is used.", ["MI_CREEL_DASHBOARD"]),
  "holland_mi/freshwater_drum": numeric(5.8, "B", "drum_warm", "Three positive Catch years with high measured magnitude and port-roadmap support establish a strong peak above Whitehall/Chicago 5.6 and below Muskegon 6.2.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LM"]),
  "holland_mi/yellow_perch": numeric(7.6, "A", "perch_summer", "Seven positive Catch years, very high full-period magnitude, and current agency planning evidence support Ludington's 7.6 tier above Grand Haven/Manistee 7.2.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_HOLLAND_GMP"]),
  "holland_mi/lake_whitefish": numeric(4.0, "B", "whitefish_cold", "Five positive historical Catch years and current grouped-pier identification establish an intentional cold-season opportunity, but no modern positive row supports exceeding the lawful 4.0 anchor.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS", "MI_REGS_2026"]),

  "lexington_mi/chinook_salmon": numeric(5.6, "A", "chinook_huron", "Sixteen positive Catch years establish historical recurrence, while zero recent Catch rows and current roadmap evidence support a limited peak just above Oscoda 5.5.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LH"]),
  "lexington_mi/coho_salmon": numeric(6.8, "A", "coho_lexington", "Twelve positive Catch years, eight modern years, and strong recent matched-effort magnitude support a peak above Oscoda 6.5 and below Algoma 7.0.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LH"]),
  "lexington_mi/steelhead": numeric(8.8, "A", "steelhead_lexington", "Twenty-one positive Catch years and exceptional modern/recent matched-effort magnitude support an excellent peak below Grand Haven 9.2 and above Whitehall 8.7.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LH"]),
  "lexington_mi/brown_trout": numeric(5.0, "A", "brown_huron", "Fourteen positive historical Catch years support recurrence, but no recent positive row places the current ceiling just above Port Sanilac 4.8 and below Alpena 5.4.", ["MI_CREEL_DASHBOARD"]),
  "lexington_mi/lake_trout": numeric(4.8, "B", "lake_trout_huron_spring", "Two positive Pier/Dock years plus current port-roadmap targeting support a modest fishery between Oscoda 4.6 and Alpena 5.0. Mixed-mode roadmap evidence is disclosed rather than transferred as magnitude.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LH", "MI_REGS_2026"]),
  "lexington_mi/walleye": numeric(5.8, "A", "walleye_summer", "Eleven positive Catch years with five modern years support a recurring fishery below Harbor Beach 6.0; measured recent magnitude does not support the stronger Port Sanilac/Oscoda tier.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LH"]),
  "lexington_mi/smallmouth_bass": numeric(6.0, "A", "smallmouth_warm", "Eighteen positive Catch years and eight modern years support a strong fishery above Ludington 5.8 and below Whitehall 6.3, with recent decline visible in the limitation.", ["MI_CREEL_DASHBOARD"]),
  "lexington_mi/freshwater_drum": numeric(4.8, "A", "drum_warm", "Seven positive Catch years establish a recurring ordinary fishery just above Manistee 4.7 and below Ludington 5.0; recent measured strength is low.", ["MI_CREEL_DASHBOARD"]),
  "lexington_mi/yellow_perch": numeric(8.5, "A", "perch_lexington", "Twenty-two positive Catch years, ten modern years, very high magnitude, and four recent positive years support the strongest new-city perch peak, above Chicago 8.4 but below no established higher value.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LH"]),
  "lexington_mi/channel_catfish": numeric(4.3, "B", "catfish_warm", "Six positive Catch years establish a limited recurring fishery just above Oscoda 4.2; low modern/recent magnitude prevents a stronger placement.", ["MI_CREEL_DASHBOARD"]),
  "lexington_mi/largemouth_bass": numeric(5.6, "A", "largemouth_warm", "Seven positive Catch years and three modern years support an ordinary warm-season fishery above Michigan City 5.5 and below Muskegon 6.5.", ["MI_CREEL_DASHBOARD"]),
  "lexington_mi/atlantic_salmon": numeric(8.0, "A", "atlantic_lexington", "Six modern positive Pier/Dock years, three recent years, exact-harbor stocking, the DNR experimental program, and exact-harbor occurrence support an excellent peak below Oscoda 8.4 and above Alpena 7.2.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LH", "LEX_ATLANTIC_DNR", "LEX_ATLANTIC_STOCK_2024", "LEX_ENFORCEMENT_2024"]),
  "lexington_mi/northern_pike": numeric(6.0, "A", "pike_standard", "Nineteen positive Catch years, ten modern years, and persistent recent occurrence support a strong new top pier-pike anchor above Alpena 5.5.", ["MI_CREEL_DASHBOARD"]),
  "lexington_mi/white_bass": numeric(5.5, "B", "white_bass_warm", "Six positive Catch years and high episodic magnitude support a recurring warm-season fishery above Grand Haven 5.2. Concentration in few years is disclosed in Grade B.", ["MI_CREEL_DASHBOARD"]),

  "harrisville_mi/chinook_salmon": numeric(6.6, "A", "chinook_huron", "Seven historical positive Pier/Dock Catch years, regular fall harbor reports, and 2025 catches from permitted unoccupied docks support a strong peak above the existing Lake Huron cohort and below St. Joseph 6.8.", ["MI_CREEL_DASHBOARD", "HARRISVILLE_LHCFAC_2022_OCT", "HARRISVILLE_LHCFAC_2025"]),
  "harrisville_mi/coho_salmon": numeric(6.2, "B", "coho_harrisville", "Exact-harbor winter reports and 2025 catches from permitted unoccupied docks establish two recurring seasonal modes. Missing standardized dock effort places confidence at B, not a numeric penalty.", ["HARRISVILLE_LHCFAC_2022", "HARRISVILLE_LHCFAC_2025"]),
  "harrisville_mi/steelhead": numeric(5.7, "B", "steelhead_harrisville", "A historical Pier/Dock positive, current port-roadmap targeting, 2025 diverse-port reporting, and direct harbor stocking jointly establish a real local fishery. The peak sits between Harbor Beach 5.6 and Alpena/Milwaukee 5.8; exact dock allocation remains limited.", ["MI_CREEL_DASHBOARD", "MI_ROADMAP_LH", "HARRISVILLE_LHCFAC_2025", "HARRISVILLE_STEELHEAD_STOCK_2025"]),
  "harrisville_mi/brown_trout": numeric(5.0, "B", "brown_harrisville", "Two historical Pier/Dock positive years and an exact-harbor report of six or seven fish before freeze establish a modest recurring cold-season opportunity above Port Sanilac 4.8 and below Alpena 5.4.", ["MI_CREEL_DASHBOARD", "HARRISVILLE_LHCFAC_2023"]),
  "harrisville_mi/atlantic_salmon": numeric(5.8, "B", "atlantic_harrisville", "DNR advisory records describe occasional fall Atlantic salmon and a developed winter harbor fishery, while the current roadmap lists fall Atlantic opportunity. This supports a modest peak above Harbor Beach 5.2 and below Port Sanilac 6.3; proposed stocking is not treated as implemented.", ["MI_ROADMAP_LH", "HARRISVILLE_LHCFAC_2022_OCT", "HARRISVILLE_LHCFAC_2025"]),
};

const profiles = {
  chinook_stj: [
    ["spring_nearshore", 0.78, [["01-01",0],["03-01",0.15],["05-10",1],["06-15",0.55],["07-15",0],["12-31",0]]],
    ["summer_pier", 1, [["01-01",0],["05-20",0],["06-20",0.5],["07-20",1],["08-25",0.4],["09-20",0],["12-31",0]]],
  ],
  chinook_lm: [
    ["spring_nearshore_transient", 0.55, [["01-01",0],["03-15",0],["05-10",1],["06-20",0.2],["07-10",0],["12-31",0]]],
    ["fall_harbor_staging", 1, [["01-01",0],["07-15",0],["08-15",0.4],["09-10",1],["10-05",0.35],["11-01",0],["12-31",0]]],
  ],
  chinook_huron: [["fall_harbor_staging", 1, [["01-01",0],["08-01",0],["09-01",0.5],["10-05",1],["11-05",0.2],["12-01",0],["12-31",0]]]],
  coho_spring: [
    ["spring_nearshore", 1, [["01-01",0.12],["02-15",0.35],["04-15",1],["05-25",0.5],["06-20",0.1],["07-10",0],["12-01",0],["12-31",0.12]]],
    ["fall_harbor_return", 0.72, [["01-01",0],["08-15",0],["09-20",0.55],["10-15",1],["11-20",0.15],["12-01",0],["12-31",0]]],
  ],
  coho_lexington: [
    ["spring_harbor", 1, [["01-01",0],["03-10",0.2],["04-20",1],["05-25",0.2],["06-10",0],["12-31",0]]],
    ["fall_harbor", 0.82, [["01-01",0],["08-20",0],["09-20",0.55],["10-15",1],["11-15",0.15],["12-01",0],["12-31",0]]],
  ],
  coho_harrisville: [
    ["winter_harbor", 0.78, [["01-01",0.8],["02-15",1],["03-20",0.45],["04-15",0],["11-15",0.3],["12-31",0.8]]],
    ["fall_docks", 1, [["01-01",0],["08-20",0],["09-20",0.7],["10-10",1],["11-10",0.2],["12-01",0],["12-31",0]]],
  ],
  steelhead_stj: [
    ["winter_spring_pier", 0.9, [["01-01",0.55],["03-15",0.8],["04-20",1],["06-01",0.25],["07-01",0],["11-15",0.35],["12-31",0.55]]],
    ["summer_skamania_pier", 1, [["01-01",0],["05-20",0],["06-20",0.6],["07-20",1],["08-20",0.55],["09-10",0],["12-31",0]]],
  ],
  steelhead_south_haven: [
    ["spring_pier", 0.72, [["01-01",0.3],["03-01",0.5],["04-20",1],["05-25",0.2],["06-10",0],["11-20",0.2],["12-31",0.3]]],
    ["summer_skamania_pier", 1, [["01-01",0],["05-20",0],["06-20",0.85],["07-15",1],["08-20",0.35],["09-05",0],["12-31",0]]],
    ["fall_harbor", 0.88, [["01-01",0.2],["08-20",0],["09-20",0.4],["10-20",1],["11-25",0.55],["12-31",0.2]]],
  ],
  steelhead_holland: [
    ["spring_pier", 0.78, [["01-01",0.3],["03-10",0.6],["04-20",1],["06-01",0.15],["06-20",0],["11-20",0.2],["12-31",0.3]]],
    ["summer_pier", 1, [["01-01",0],["05-20",0],["06-20",0.5],["07-20",1],["08-25",0.3],["09-10",0],["12-31",0]]],
    ["fall_harbor", 0.82, [["01-01",0.2],["08-25",0],["09-25",0.5],["10-20",1],["11-25",0.45],["12-31",0.2]]],
  ],
  steelhead_lexington: [
    ["spring_harbor", 1, [["01-01",0.3],["03-01",0.55],["04-25",1],["05-25",0.8],["06-20",0],["11-20",0.25],["12-31",0.3]]],
    ["fall_harbor", 0.9, [["01-01",0.25],["08-20",0],["09-20",0.45],["10-20",1],["11-25",0.75],["12-31",0.25]]],
  ],
  steelhead_harrisville: [
    ["spring_harbor", 1, [["01-01",0.3],["03-01",0.55],["04-25",1],["06-10",0.25],["07-01",0],["11-20",0.22],["12-31",0.3]]],
    ["fall_harbor", 0.88, [["01-01",0.2],["08-20",0],["09-20",0.55],["10-20",1],["11-25",0.55],["12-31",0.2]]],
  ],
  brown_standard: [
    ["winter_spring_nearshore", 1, [["01-01",0.42],["02-15",0.58],["04-10",1],["05-25",0.5],["06-25",0.05],["07-10",0],["12-01",0.38],["12-31",0.42]]],
    ["fall_harbor", 0.72, [["01-01",0.35],["08-25",0],["10-01",0.4],["11-10",1],["12-31",0.35]]],
  ],
  brown_huron: [
    ["spring_harbor", 1, [["01-01",0.45],["03-01",0.65],["04-20",1],["06-01",0.15],["07-01",0],["11-20",0.35],["12-31",0.45]]],
    ["fall_harbor", 0.9, [["01-01",0.35],["08-25",0],["09-25",0.35],["10-25",1],["12-31",0.35]]],
  ],
  brown_harrisville: [["late_fall_winter_harbor", 1, [["01-01",0.8],["02-15",0.6],["04-20",0.2],["06-01",0],["09-20",0],["10-20",0.6],["11-25",1],["12-31",0.8]]]],
  lake_trout_cold: [
    ["winter_spring_pier", 1, [["01-01",0.75],["03-15",1],["05-20",0.45],["06-20",0],["10-15",0],["11-20",0.55],["12-31",0.75]]],
    ["fall_nearshore", 0.86, [["01-01",0.4],["06-15",0],["09-15",0.25],["11-10",1],["12-31",0.4]]],
  ],
  lake_trout_fall: [
    ["spring_coldwater_pier", 0.72, [["01-01",0.45],["03-20",0.75],["05-10",1],["06-10",0],["11-15",0.35],["12-31",0.45]]],
    ["fall_nearshore", 1, [["01-01",0.35],["06-15",0],["08-25",0],["09-20",0.45],["10-20",1],["12-31",0.35]]],
  ],
  lake_trout_huron_spring: [["spring_coldwater_harbor", 1, [["01-01",0.35],["03-01",0.55],["04-20",1],["05-25",0.25],["06-20",0],["11-20",0.25],["12-31",0.35]]]],
  walleye_spring: [["spring_low_light", 1, [["01-01",0.08],["03-15",0.2],["05-15",1],["06-25",0.55],["08-20",0.3],["10-15",0.15],["12-31",0.08]]]],
  walleye_summer: [["summer_low_light", 1, [["01-01",0],["04-01",0.15],["06-15",0.6],["08-15",1],["10-15",0.25],["11-15",0],["12-31",0]]]],
  smallmouth_warm: [["warm_season_harbor", 1, [["01-01",0],["04-01",0],["05-10",0.3],["06-20",0.82],["07-20",1],["09-20",0.72],["10-25",0.15],["11-15",0],["12-31",0]]]],
  drum_warm: [["warm_season_harbor", 1, [["01-01",0],["04-15",0],["05-20",0.35],["07-15",1],["08-20",0.85],["09-25",0.35],["10-20",0],["12-31",0]]]],
  perch_summer: [["summer_pier_schooling", 1, [["01-01",0],["04-15",0.15],["06-15",0.55],["07-20",1],["09-15",0.45],["10-20",0.1],["11-20",0],["12-31",0]]]],
  perch_south_haven: [
    ["summer_pier_schooling", 1, [["01-01",0],["04-15",0.1],["06-15",0.5],["07-20",1],["08-25",0.75],["10-15",0],["12-31",0]]],
    ["fall_pier_schooling", 0.82, [["01-01",0],["07-15",0],["09-10",1],["10-20",0.25],["11-10",0],["12-31",0]]],
  ],
  perch_lexington: [
    ["spring_harbor_schooling", 0.86, [["01-01",0.15],["03-20",0.35],["04-20",1],["06-01",0.25],["07-01",0],["11-25",0.1],["12-31",0.15]]],
    ["fall_harbor_schooling", 1, [["01-01",0.12],["07-15",0],["09-10",0.35],["10-20",0.8],["11-10",1],["12-31",0.12]]],
  ],
  whitefish_cold: [
    ["spring_coldwater_pier", 0.72, [["01-01",0.45],["03-20",1],["05-01",0.2],["06-01",0],["11-15",0.35],["12-31",0.45]]],
    ["late_fall_pier", 1, [["01-01",0.4],["05-15",0],["09-20",0],["10-20",0.4],["11-20",1],["12-31",0.4]]],
  ],
  round_whitefish_spring_fall: [
    ["spring_channel", 0.68, [["01-01",0.2],["03-01",0.35],["04-15",1],["05-15",0],["11-20",0.15],["12-31",0.2]]],
    ["fall_channel", 1, [["01-01",0],["05-15",0],["09-15",0],["10-20",1],["11-20",0.35],["12-15",0],["12-31",0]]],
  ],
  catfish_warm: [["warm_season_channel", 1, [["01-01",0],["04-15",0],["05-20",0.3],["07-20",0.82],["08-20",1],["09-20",0.7],["10-20",0.2],["11-10",0],["12-31",0]]]],
  largemouth_warm: [["warm_season_harbor", 1, [["01-01",0],["04-15",0],["05-20",0.25],["07-15",0.82],["08-15",1],["09-20",0.65],["10-20",0.15],["11-05",0],["12-31",0]]]],
  atlantic_lexington: [
    ["spring_stocked_harbor", 0.72, [["01-01",0.25],["03-01",0.45],["04-20",1],["05-25",0.2],["06-20",0],["11-20",0.18],["12-31",0.25]]],
    ["fall_harbor_return", 1, [["01-01",0.2],["07-15",0],["08-25",0.1],["09-20",0.65],["10-20",1],["11-25",0.7],["12-31",0.2]]],
  ],
  atlantic_harrisville: [
    ["winter_harbor", 1, [["01-01",0.82],["02-15",1],["03-20",0.55],["05-01",0],["11-20",0.35],["12-31",0.82]]],
    ["fall_harbor", 0.82, [["01-01",0.2],["07-15",0],["08-25",0],["09-25",0.65],["10-20",1],["11-25",0.45],["12-31",0.2]]],
  ],
  pike_standard: [
    ["spring_harbor", 1, [["01-01",0.22],["03-01",0.4],["05-01",1],["06-20",0.5],["07-20",0.25],["12-31",0.22]]],
    ["fall_harbor", 0.92, [["01-01",0.2],["07-01",0.2],["09-20",1],["11-15",0.45],["12-31",0.2]]],
  ],
  white_bass_warm: [["warm_season_schooling", 1, [["01-01",0],["04-15",0],["05-20",0.45],["06-20",1],["08-20",0.85],["09-20",0.3],["10-15",0],["12-31",0]]]],
};

const holdRationale = {
  "st_joseph_mi/walleye": "Connected-river and port-level leads remain insufficient to establish recurring intentional fishing at either covered pierhead.",
  "st_joseph_mi/smallmouth_bass": "Connected-water occurrence remains separated from the pierheads; no recurring exact-pier magnitude or annual shape was found.",
  "st_joseph_mi/freshwater_drum": "The port roadmap creates a seasonal lead, but no resolved St. Joseph Pier/Dock series or exact-pier magnitude supports admission.",
  "st_joseph_mi/round_whitefish": "Generic county 'whitefish' language cannot be converted to round whitefish, and no exact-pier recurring record was found.",
  "st_joseph_mi/channel_catfish": "Generic county 'catfish' and connected-river evidence do not identify channel catfish as a recurring pierhead target.",
  "st_joseph_mi/northern_pike": "Plausible connected-harbor occurrence remains unallocated to the two covered pierheads.",
  "south_haven_mi/largemouth_bass": "Only two positive Pier/Dock catch years, one modern, do not establish a stable recurring annual shape despite the broader agency lead.",
  "south_haven_mi/white_perch": "One historical positive year and zero modern rows are inadequate for numeric admission.",
  "south_haven_mi/white_bass": "One historical positive year and zero modern rows are inadequate for numeric admission.",
  "holland_mi/round_whitefish": "Two isolated positive years do not establish current recurrence or a defensible annual shape.",
  "holland_mi/channel_catfish": "One positive Catch year and Lake Macatawa context cannot establish a recurring north-pier/channel target.",
  "holland_mi/largemouth_bass": "Sparse port rows and Lake Macatawa targeting remain insufficiently allocated to the covered north-pier/channel boundary.",
  "holland_mi/northern_pike": "The reviewed Pier/Dock strata are zero and the credible lead belongs primarily to Lake Macatawa rather than the covered Lake Michigan structure.",
  "holland_mi/white_perch": "A single high 2020 event is preserved, but one year cannot support recurrence or a complete annual shape.",
  "holland_mi/white_bass": "One positive Catch year is insufficient for numeric admission.",
  "lexington_mi/lake_whitefish": "The current roadmap does not establish a Lexington lake-whitefish target and all 42 enumerated Pier/Dock Catch strata are zero.",
  "lexington_mi/round_whitefish": "One positive year followed by recent zeros is insufficient for recurring intentional opportunity.",
  "harrisville_mi/lake_trout": "The current advisory calls the broader summer/boat fishery very good, but neither the roadmap nor advisory allocates recurring lake-trout catch to the covered docks or harbor edge.",
  "harrisville_mi/walleye": "One historical Pier/Dock positive and mixed-mode current port evidence are not enough to allocate recurring magnitude to covered dock fishing.",
  "harrisville_mi/channel_catfish": "One historical positive Pier/Dock year provides a lead but not recurrence or a defensible seasonal shape.",
};

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
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

const baselinePath = path.join(piercastDir, "chicago-alpena-2026-09-pass2/cross-city-rankings.csv");
const baselineRows = parseCsv(fs.readFileSync(baselinePath, "utf8")).map((row) => ({
  species_id: row.speciesId,
  species_name: row.speciesName,
  city_id: row.cityId,
  city_name: row.cityName.replace(/, (Michigan|Illinois|Indiana)$/, ""),
  pair_key: row.pairKey,
  peak: Number(row.peak),
  cohort: "established_22_city_baseline",
}));
const newRows = Object.entries(approved).map(([pairKey, calibration]) => {
  const [cityId, speciesId] = pairKey.split("/");
  return {
    species_id: speciesId,
    species_name: speciesNames[speciesId],
    city_id: cityId,
    city_name: cities.find((city) => city.id === cityId).name,
    pair_key: pairKey,
    peak: calibration.strength,
    cohort: "new_private_pass2",
  };
});
const allCalibrationRows = [...baselineRows, ...newRows];
const anchors = {};
for (const [pairKey, calibration] of Object.entries(approved)) {
  const [, speciesId] = pairKey.split("/");
  const comparisons = allCalibrationRows
    .filter((row) => row.species_id === speciesId && row.pair_key !== pairKey)
    .sort((a, b) => b.peak - a.peak || a.city_name.localeCompare(b.city_name));
  const weaker = comparisons.filter((row) => row.peak <= calibration.strength).sort((a, b) => b.peak - a.peak || a.city_name.localeCompare(b.city_name))[0] ?? null;
  const stronger = comparisons.filter((row) => row.peak >= calibration.strength).sort((a, b) => a.peak - b.peak || a.city_name.localeCompare(b.city_name))[0] ?? null;
  anchors[pairKey] = {
    weaker_or_equal: weaker,
    stronger_or_equal: stronger,
    all_same_species_comparisons: comparisons,
    placement: `${calibration.strength} is ${weaker ? `at or above ${weaker.city_name} ${weaker.peak}` : "below no reviewed value"} and ${stronger ? `at or below ${stronger.city_name} ${stronger.peak}` : "above the reviewed cohort"}.`,
  };
}

const decisions = pass1.decisions.map((row) => {
  const calibration = approved[row.pair_key];
  if (calibration) {
    for (const id of calibration.evidenceIds) if (!sourceIds.has(id)) throw new Error(`Unknown evidence ID ${id} for ${row.pair_key}`);
    return {
      ...row,
      pass1_decision: row.decision,
      pass2_disposition: "numeric_private",
      evidence_grade: calibration.grade,
      peak_fishery_strength: calibration.strength,
      peak_meaning: "Formula v3 ceiling under full recurring seasonal availability and ideal thermal suitability; not annual average, catch probability, or agency rating.",
      evidence_ids: calibration.evidenceIds,
      calibration_rationale: calibration.rationale,
      anchor_placement: anchors[row.pair_key],
      confidence_treatment: "Evidence grade is disclosed and never multiplies F, A, T, or score.",
    };
  }
  const productPolicyExclusion = row.species_id === "bluegill";
  const hold = !productPolicyExclusion && row.decision !== "exclude";
  return {
    ...row,
    pass1_decision: row.decision,
    pass2_disposition: hold ? "research_hold_unscored" : "exclude_unscored",
    evidence_grade: hold ? "C" : "D",
    peak_fishery_strength: null,
    peak_meaning: "No score. This is not a low rating or a claim of biological absence.",
    evidence_ids: row.source_ids,
    calibration_rationale: productPolicyExclusion
      ? "Product policy exclusion: bluegill is not a user-facing PierCast species. Biological evidence is retained for audit history, but no numeric calibration or mode is created."
      : hold
        ? `${holdRationale[row.pair_key] ?? "The reopened record still lacks recurring intentional covered-structure opportunity, defensible magnitude, or a complete annual shape."} No placeholder score is permitted.`
        : `Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. ${row.claim}`,
    anchor_placement: null,
    confidence_treatment: hold ? "Grade C remains an explicit unscored hold." : "Grade D remains unscored.",
    exclusion_basis: productPolicyExclusion ? "product_policy_non_user_facing" : "evidence_boundary",
  };
});

const dispositionCounts = Object.fromEntries(["numeric_private", "research_hold_unscored", "exclude_unscored"].map((name) => [name, decisions.filter((row) => row.pass2_disposition === name).length]));

const modeRows = [];
for (const decision of decisions.filter((row) => row.pass2_disposition === "numeric_private")) {
  const calibration = approved[decision.pair_key];
  const profile = profiles[calibration.profile];
  if (!profile) throw new Error(`Missing profile ${calibration.profile}`);
  for (const [modeId, factor, knots] of profile) {
    const fisheryStrength = Number((1 + (calibration.strength - 1) * factor).toFixed(2));
    if (fisheryStrength < 2.1 || fisheryStrength > 10) throw new Error(`Invalid mode F ${decision.pair_key}/${modeId}`);
    if (knots[0][0] !== "01-01" || knots.at(-1)[0] !== "12-31") throw new Error(`Incomplete mode year ${decision.pair_key}/${modeId}`);
    for (const [, availability] of knots) if (availability < 0 || availability > 1) throw new Error(`Invalid availability ${decision.pair_key}/${modeId}`);
    modeRows.push({
      mode_calibration_id: `${decision.city_id}__${decision.species_id}__${modeId}__stj_harrisville_pass2`,
      pair_key: decision.pair_key,
      city_id: decision.city_id,
      species_id: decision.species_id,
      mode_id: modeId,
      fishery_strength: fisheryStrength,
      pair_peak_fishery_strength: calibration.strength,
      evidence_grade: calibration.grade,
      availability_knots: knots.map(([monthDay, availability]) => ({ month_day: monthDay, availability })),
      thermal_curve_id: thermalCurveIds[decision.species_id],
      thermal_policy: "Inherit the existing shared species curve. Pass 2 audits explicit T values and does not approve a city temperature source.",
      fishery_evidence_ids: calibration.evidenceIds,
      calibration_status: "private_pass2_only",
      limitations: [
        "F is an ordinal prime-condition ceiling, not catch probability or abundance.",
        "Availability knots describe recurring seasonal shape, not observed daily catch.",
        "Modes compete by maximum seasonal potential and never stack.",
      ],
    });
  }
}

const regulationAccess = {
  schema_version: "piercast-st-joseph-harrisville-pass2-regulation-access-v1",
  reviewed_at: REVIEW_DATE,
  rule: "Biological opportunity, fishing regulation, physical access, and private-release readiness are independent gates.",
  regulation_source_ids: ["MI_REGS_2026", "MI_HARBOR_RULES"],
  regulation_findings: [
    { scope: "st_joseph_mi|south_haven_mi|holland_mi", water: "Lake Michigan MM 6-8", finding: "Lake trout and splake possession season is open all year under the reviewed 2026 guide." },
    { scope: "lexington_mi|harrisville_mi", water: "Lake Huron MH 3-6", finding: "Lake trout and splake possession season is open all year under the reviewed 2026 guide." },
    { scope: "all five cities", water: "Great Lakes waters", finding: "Bass catch-and-immediate-release opportunity is distinguished from the 2026 possession season; this is a method/harvest distinction, not a biological closure." },
    { scope: "all five cities", water: "covered waters", finding: "No admitted pair received a species-season closure in the reviewed 2026 guide. Emergency orders and posted local rules still control." },
  ],
  city_access_gates: [
    { city_id: "st_joseph_mi", status: "published_open_subject_to_live_gate", finding: "Both pierheads are covered separately; dawn-to-dusk park approach, parking rules, waves, ice, barricades, and posted closures control.", source_ids: ["STJ_SILVER_BEACH", "STJ_TISCORNIA"] },
    { city_id: "south_haven_mi", status: "published_open_subject_to_live_gate", finding: "Both piers are covered separately and may be closed under red-flag/high-wave policy; lower Harborwalk remains separately labeled.", source_ids: ["SOUTH_HAVEN_SAFETY", "SOUTH_HAVEN_FISHING"] },
    { city_id: "holland_mi", status: "north_only_subject_to_live_gate", finding: "North pier and state-park channel walkway are covered; the south route remains excluded because no public walkway is available.", source_ids: ["HOLLAND_DNR_PARK", "HOLLAND_BIG_RED"] },
    { city_id: "lexington_mi", status: "construction_closed", finding: "The entire marina is closed September 8, 2026 through May 28, 2027; biological calibrations remain research-only and cannot imply current access.", source_ids: ["LEX_CLOSURE_2026", "MI_HARBOR_RULES"] },
    { city_id: "harrisville_mi", status: "conditional_unverified", finding: "Fishing is limited to designated areas and unoccupied docks; current signs, occupancy, off-season policy, and breakwater access require direct confirmation.", source_ids: ["HARRISVILLE_LHCFAC_2025", "HARRISVILLE_HARBOR_RULES"] },
  ],
};

const doy = (monthDay) => Math.floor((Date.parse(`${REFERENCE_YEAR}-${monthDay}T00:00:00Z`) - Date.parse(`${REFERENCE_YEAR}-01-01T00:00:00Z`)) / 86400000);
function availabilityAt(knots, day) {
  const points = knots.map((knot) => ({ day: doy(knot.month_day), value: knot.availability })).sort((a, b) => a.day - b.day);
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index], end = points[index + 1];
    if (day >= start.day && day <= end.day) return start.value + (end.value - start.value) * (day - start.day) / (end.day - start.day);
  }
  throw new Error(`No availability segment for day ${day}`);
}
const rounded = (value, digits = 3) => Number(value.toFixed(digits));
const thermalFits = [0, 0.25, 0.5, 0.75, 1];
const modesByPair = Map.groupBy(modeRows, (mode) => mode.pair_key);
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
    const lexingtonClosed = decision.city_id === "lexington_mi" && date >= "2026-09-08";
    daily.push({
      date,
      pair_key: decision.pair_key,
      city_id: decision.city_id,
      species_id: decision.species_id,
      legal_status: bassReleaseOnly ? "open_catch_and_immediate_release_only" : "open",
      access_status: lexingtonClosed ? "construction_closed" : decision.city_id === "harrisville_mi" ? "conditional_designated_unoccupied_docks_unverified" : "published_access_subject_to_live_conditions",
      product_availability: lexingtonClosed ? "unavailable_access_closure" : "private_research_not_published",
      winning_mode: winner.mode.mode_id,
      fishery_strength: winner.mode.fishery_strength,
      seasonal_availability: rounded(winner.availability),
      seasonal_potential: rounded(winner.seasonalPotential),
      ...scores,
      user_facing_score: "",
    });
  }
}

let formulaInvariantComparisons = 0;
for (const row of daily) {
  const values = thermalFits.map((fit) => row[`score_t${String(fit).replace(".", "_")}`]);
  const pairF = approved[row.pair_key].strength;
  if (!(1 <= values[0] && values[0] <= values[1] && values[1] <= values[2] && values[2] <= values[3] && values[3] <= values[4] && values[4] <= row.seasonal_potential + 0.001 && row.seasonal_potential <= pairF + 0.001 && pairF <= 10)) {
    throw new Error(`Formula invariant failed: ${row.pair_key}/${row.date}`);
  }
  if (row.product_availability === "unavailable_access_closure" && row.user_facing_score !== "") throw new Error(`Closed access row leaked score: ${row.pair_key}/${row.date}`);
  formulaInvariantComparisons += 8;
}

const summaries = [];
const checkpoints = [];
for (const decision of decisions.filter((row) => row.pass2_disposition === "numeric_private")) {
  const rows = daily.filter((row) => row.pair_key === decision.pair_key);
  const peak = rows.reduce((best, row) => row.score_t1 > best.score_t1 ? row : best);
  const jan1 = rows[0], dec31 = rows.at(-1);
  summaries.push({
    pair_key: decision.pair_key,
    city_id: decision.city_id,
    city_name: decision.display_name,
    species_id: decision.species_id,
    species_name: speciesNames[decision.species_id],
    evidence_grade: decision.evidence_grade,
    peak_fishery_strength: decision.peak_fishery_strength,
    ideal_peak_date: peak.date,
    peak_mode: peak.winning_mode,
    excellent_days_at_ideal_t: rows.filter((row) => row.score_t1 >= 8).length,
    good_days_at_ideal_t: rows.filter((row) => row.score_t1 >= 7).length,
    shoulder_days_at_ideal_t: rows.filter((row) => row.score_t1 >= 3 && row.score_t1 < 7).length,
    floor_days_at_ideal_t: rows.filter((row) => row.score_t1 < 2).length,
    access_closed_days: rows.filter((row) => row.access_status === "construction_closed").length,
    december_january_seam_delta: rounded(Math.abs(dec31.score_t1 - jan1.score_t1)),
  });
  for (let month = 1; month <= 12; month += 1) {
    const date = `${REFERENCE_YEAR}-${String(month).padStart(2, "0")}-15`;
    checkpoints.push(rows.find((row) => row.date === date));
  }
}

const quantitative = [];
const periods = [
  { id: "full_export", min: -Infinity, max: Infinity },
  { id: "modern_2012_2022_excluding_2020", min: 2012, max: 2022 },
  { id: "recent_2018_2022_excluding_2020", min: 2018, max: 2022 },
];
for (const city of cities) {
  const portRows = city.port ? raw.rows.filter((row) => row.port === city.port) : [];
  const hoursByStratum = new Map(portRows.filter((row) => row.estimate_type === "Angler Hours").map((row) => [`${row.year}-${row.month}`, Number(row.estimate)]));
  for (const speciesId of species) {
    for (const period of periods) {
      const catchRows = portRows.filter((row) => row.species === dashboardSpecies[speciesId] && row.estimate_type === "Catch" && row.year >= period.min && row.year <= period.max && row.year !== 2020);
      const positive = catchRows.filter((row) => Number(row.estimate) > 0);
      const catchEstimate = catchRows.reduce((sum, row) => sum + Number(row.estimate), 0);
      const matchedHours = catchRows.reduce((sum, row) => sum + (hoursByStratum.get(`${row.year}-${row.month}`) ?? 0), 0);
      quantitative.push({
        city_id: city.id, city_name: city.name, port: city.port ?? "UNRESOLVED_DASHBOARD_LABEL",
        species_id: speciesId, dashboard_species: dashboardSpecies[speciesId], period: period.id,
        catch_estimate: rounded(catchEstimate, 1), matched_all_species_hours: rounded(matchedHours, 1),
        catch_per_1000_matched_all_species_hours: matchedHours ? rounded(catchEstimate * 1000 / matchedHours, 4) : "",
        positive_month_year_strata: positive.length, enumerated_month_year_strata: catchRows.length,
        positive_years: new Set(positive.map((row) => row.year)).size,
        limitation: city.port ? "Ordinal recurrence/magnitude anchor only; matched hours are all-species effort, not directed-effort CPUE. Port Pier/Dock can pool structures." : "No St. Joseph dashboard label resolved in Pass 1; empty rows are missing coverage, never biological zeros.",
      });
    }
  }
}

const rankingRows = allCalibrationRows
  .filter((row) => row.species_id !== "bluegill")
  .sort((a, b) => a.species_id.localeCompare(b.species_id) || b.peak - a.peak || a.city_name.localeCompare(b.city_name));
let previousSpecies = null, rank = 0;
for (const row of rankingRows) {
  if (row.species_id !== previousSpecies) { previousSpecies = row.species_id; rank = 0; }
  row.rank = ++rank;
}

const dueDiligenceRows = decisions.map((row) => ({
  pair_key: row.pair_key,
  city_id: row.city_id,
  species_id: row.species_id,
  pass1_decision: row.pass1_decision,
  pass2_disposition: row.pass2_disposition,
  evidence_grade: row.evidence_grade,
  audited_peak: row.peak_fishery_strength ?? "",
  outcome: row.species_id === "bluegill" ? "excluded_by_product_policy" : row.pass2_disposition === "numeric_private" ? "admitted_private_numeric" : "retained_unscored",
  weaker_or_equal_anchor: row.anchor_placement?.weaker_or_equal ? `${row.anchor_placement.weaker_or_equal.city_name} ${row.anchor_placement.weaker_or_equal.peak}` : "",
  stronger_or_equal_anchor: row.anchor_placement?.stronger_or_equal ? `${row.anchor_placement.stronger_or_equal.city_name} ${row.anchor_placement.stronger_or_equal.peak}` : "",
  finding: row.calibration_rationale,
}));

const lakeTroutReview = {
  schema_version: "piercast-st-joseph-harrisville-pass2-lake-trout-review-v1",
  reviewed_at: REVIEW_DATE,
  regulation: "All five cities are in management units with lake trout/splake possession open all year under the reviewed 2026 guide.",
  decisions: decisions.filter((row) => row.species_id === "lake_trout").map((row) => ({
    city_id: row.city_id, disposition: row.pass2_disposition, evidence_grade: row.evidence_grade,
    peak: row.peak_fishery_strength, rationale: row.calibration_rationale, evidence_ids: row.evidence_ids,
  })),
  conclusion: "St. Joseph, South Haven, Holland, and Lexington receive private numeric calibrations. Harrisville remains a Grade C hold because recent strength is not allocated to covered dock/harbor-edge shore fishing.",
};
const atlanticReview = {
  schema_version: "piercast-st-joseph-harrisville-pass2-atlantic-review-v1",
  reviewed_at: REVIEW_DATE,
  decisions: decisions.filter((row) => row.species_id === "atlantic_salmon").map((row) => ({
    city_id: row.city_id, disposition: row.pass2_disposition, evidence_grade: row.evidence_grade,
    peak: row.peak_fishery_strength, rationale: row.calibration_rationale, evidence_ids: row.evidence_ids,
  })),
  conclusion: "Lexington is Grade A numeric at 8.0 from six modern Pier/Dock years plus exact program, stocking, and occurrence evidence. Harrisville is Grade B numeric at 5.8 from a documented winter harbor fishery and fall occurrence/roadmap evidence; proposed stocking is explicitly excluded. The other three cities remain excluded.",
};

function csvCell(value) {
  const text = Array.isArray(value) ? value.join("|") : value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
function csv(columns, rows) {
  return `${[columns, ...rows.map((row) => columns.map((column) => row[column]))].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

const decisionArtifact = {
  schema_version: "piercast-st-joseph-harrisville-pass2-pair-decisions-v1",
  reviewed_at: REVIEW_DATE,
  status: "complete_private_research_only",
  city_count: cities.length,
  catalog_audit_species_count: species.length,
  user_facing_species_policy: "Bluegill is excluded from user-facing PierCast and receives no numeric calibration.",
  decision_count: decisions.length,
  disposition_counts: dispositionCounts,
  policy: {
    numeric: "Grade A/B recurring intentional local pier/harbor opportunity with defensible magnitude and annual shape.",
    hold: "Grade C remains unscored; uncertainty never becomes a low placeholder.",
    exclude: "Grade D remains unscored and does not assert biological absence.",
    confidence: "Evidence grade never multiplies F, A, T, or score.",
  },
  decisions,
};
const calibrationArtifact = {
  schema_version: "piercast-st-joseph-harrisville-pass2-mode-calibrations-v1",
  reviewed_at: REVIEW_DATE,
  status: "complete_private_shadow_only",
  rating_enabled: false,
  public_enabled: false,
  formula: {
    seasonal_potential: "1 + (F - 1) * A",
    score: "clamp(1, 10, 1 + (seasonalPotential - 1) * (0.30 + 0.70 * T))",
    mode_policy: "maximum seasonalPotential wins; modes never stack",
  },
  thermal_fits_audited: thermalFits,
  numeric_pair_count: Object.keys(approved).length,
  mode_count: modeRows.length,
  modes: modeRows,
};

const cityReportTables = cities.map((city) => {
  const rows = decisions.filter((row) => row.city_id === city.id);
  return `### ${city.name}\n\n| Species | Peak F | Grade | Peak date / disposition |\n|---|---:|:---:|---|\n${rows.map((row) => {
    const summary = summaries.find((item) => item.pair_key === row.pair_key);
    return row.pass2_disposition === "numeric_private"
      ? `| ${speciesNames[row.species_id]} | **${row.peak_fishery_strength.toFixed(1)}** | ${row.evidence_grade} | ${summary.ideal_peak_date.slice(5)} — ${summary.peak_mode.replaceAll("_", " ")} |`
      : `| ${speciesNames[row.species_id]} | — | ${row.evidence_grade} | ${row.species_id === "bluegill" ? "Product-policy exclude" : row.pass2_disposition === "research_hold_unscored" ? "Research hold" : "Exclude"} |`;
  }).join("\n")}`;
}).join("\n\n");

const pass2Report = `# PierCast St. Joseph–Harrisville Pass 2 report

Reviewed ${REVIEW_DATE}. Status: complete private research calibration package. No runtime, migration, public-manifest, deployment, or app-build change was made.

## Decision

All 95 Pass 1 catalog cells were reopened. The final private research roster contains:

- **${dispositionCounts.numeric_private} numeric Grade A/B pairs**;
- **${dispositionCounts.research_hold_unscored} Grade C research holds**;
- **${dispositionCounts.exclude_unscored} Grade D/policy exclusions**;
- **${modeRows.length} seasonal opportunity modes**;
- **${daily.length.toLocaleString("en-US")} full-year pair/date rows** at five thermal-fit values.

Bluegill remains in the 95-cell audit only for traceability. Per product direction, it is excluded from user-facing PierCast in all five cities and has no score or mode.

## Formula

\`seasonalPotential = 1 + (F - 1) × A\`

\`score = clamp(1, 10, 1 + (seasonalPotential - 1) × (0.30 + 0.70 × T))\`

F is prime recurring strength, A contains seasonal timing, T contains thermal suitability, and evidence confidence is disclosure only. Modes compete by maximum seasonal potential and never stack.

## Every species, every city

${cityReportTables}

## Major findings

- St. Joseph admits the seven species explicitly identified by DNR at the pier. Coho is strongest at 8.6; the unresolved dashboard label keeps evidence Grade B but does not suppress admitted strength.
- South Haven admits 13 species. Steelhead leads at 8.8, followed by coho 7.8; drum remains strong at 6.5. Largemouth bass is demoted to a hold because two positive years do not establish recurrence.
- Holland admits 10 species. Chinook 7.8 and perch 7.6 lead. Lake Macatawa warmwater evidence was not transferred to the covered north pier/channel.
- Lexington admits 14 species biologically. Steelhead 8.8, perch 8.5, and Atlantic salmon 8.0 are the strongest, but the active marina closure independently blocks current access.
- Harrisville admits five Grade A/B biological pairs: Chinook 6.6, coho 6.2, Atlantic 5.8, steelhead 5.7, and brown trout 5.0. Lake trout and walleye remain unscored because recent strength is not allocated to covered dock/shore fishing.

## Full-year audit

Every numeric pair was evaluated on all 365 dates at T = 0, 0.25, 0.5, 0.75, and 1. The audit verifies monotonic thermal response, formula bounds, non-stacking modes, peak F, annual shoulders, access gates, and the December/January seam. Lexington construction-closure dates are labeled unavailable and never receive a user-facing score.

## Private boundary

The package creates research artifacts only. It does not alter the current 22-city public catalog, add runtime calibrations, create migrations or archives, approve NOAA cells, deploy functions, or build the app. Pass 3 has not begun.
`;

const dueDiligenceReport = `# St. Joseph–Harrisville Pass 2 due-diligence review

Reviewed ${REVIEW_DATE}. Scope: all 95 catalog cells, all ${Object.keys(approved).length} numeric peaks, every same-species baseline calibration, lake trout at all five cities, and Atlantic salmon at Lexington and Harrisville.

## Method

Each cell was reopened against exact-site/port Pier/Dock evidence, current agency inventories and roadmaps, current regulations, historical and recent quantitative periods, structure/mode boundaries, and the complete same-species ranking. Missing precision changes evidence grade, never score. Boat, offshore, river, Lake Macatawa, and neighboring-port strength was not transferred.

## Bluegill product policy

Bluegill is not a user-facing PierCast species. All five bluegill cells are Grade D policy exclusions with no score or modes, even where the source data contains Pier/Dock catches. This is a product-scope decision, not a biological-absence claim.

## Lake trout

- Numeric: St. Joseph 4.1 (B), South Haven 3.8 (A), Holland 3.8 (B), Lexington 4.8 (B).
- Hold: Harrisville (C). The recent advisory's very-good lake-trout statement is mixed with boat/charter context and is not allocated to covered docks.
- Current 2026 lake-trout regulations are open all year in both applicable management-unit groups; no closure was invented.

## Atlantic salmon

- Lexington 8.0 (A): six modern positive Pier/Dock years, current experimental-program identity, exact stocking, and exact-harbor occurrence.
- Harrisville 5.8 (B): occasional fall fish plus a developed winter harbor fishery and current roadmap timing. Proposed stocking is not treated as implemented.
- St. Joseph, South Haven, and Holland remain excluded.

## Access and regulation

Lexington remains closed September 8, 2026 through May 28, 2027. Harrisville remains conditional on designated, unoccupied docks and current signs. Holland's south route remains excluded. Access is never used to reduce F, but it blocks product availability where closed or unresolved.

## Validation

The deterministic generator validates exactly five cities, 19 audit species, 95 unique cells, ${Object.keys(approved).length} numeric pairs, source resolution, complete same-species comparisons, all 365 dates, five thermal fits, formula bounds, mode non-stacking, closure handling, and no bluegill admission. The repository's runtime and public-release surface is untouched.
`;

const readme = `# St. Joseph–Harrisville PierCast Pass 2

Private research-only numeric admission and full-year Formula v3 calibration package, reviewed ${REVIEW_DATE}.

## Reproduce

\`\`\`bash
node docs/onboarding/piercast/st-joseph-harrisville-2026-09-pass2/generate-pass2.mjs
node docs/onboarding/piercast/st-joseph-harrisville-2026-09-pass2/generate-pass2.mjs --check
\`\`\`

## Key outputs

- \`PASS2_REPORT.md\` and \`DUE_DILIGENCE_REVIEW.md\`
- \`pair-decisions.json\` — all 95 reopened cells
- \`private-mode-calibrations.json\` — private Grade A/B modes only
- \`calibration-anchors.json\` and \`cross-city-rankings.csv\`
- \`full-year-daily-audit.csv\` — all numeric pairs × 365 dates × five thermal fits
- \`monthly-checkpoints.csv\` and \`score-summary.csv\`
- \`all-species-peak-matrix.csv\` and \`research-holds-and-exclusions.csv\`
- \`michigan-quantitative-calibration.csv\`
- \`lake-trout-due-diligence.json\` and \`atlantic-salmon-review.json\`
- \`regulation-access-decisions.json\`, \`source-ledger.json\`, and \`validation-report.json\`

Bluegill is retained only as a completed audit cell and is excluded from every user-facing/private numeric roster. This package changes no runtime, migration, manifest, deployment, or build state.
`;

const allRefs = [
  ...decisions.flatMap((row) => row.evidence_ids),
  ...modeRows.flatMap((row) => row.fishery_evidence_ids),
  ...regulationAccess.city_access_gates.flatMap((row) => row.source_ids),
  ...regulationAccess.regulation_source_ids,
];
const pairKeys = decisions.map((row) => row.pair_key);
const expectedPairs = cities.flatMap((city) => species.map((speciesId) => `${city.id}/${speciesId}`));
const sourceRequired = ["id", "url", "publisher", "title", "publication_date", "review_date", "exact_geography", "fishing_mode", "season_represented", "claim_supported", "permitted_use", "limitations", "evidence_grade"];
const checks = {
  exactly_five_cities: cities.length === 5,
  exactly_nineteen_audit_species: species.length === 19,
  exactly_ninety_five_decisions: decisions.length === 95,
  unique_and_complete_cells: new Set(pairKeys).size === 95 && expectedPairs.every((key) => pairKeys.includes(key)),
  all_pass1_cells_reopened: pass1.decisions.every((row) => pairKeys.includes(row.pair_key)),
  all_bluegill_excluded_unscored: decisions.filter((row) => row.species_id === "bluegill").length === 5 && decisions.filter((row) => row.species_id === "bluegill").every((row) => row.pass2_disposition === "exclude_unscored" && row.peak_fishery_strength == null),
  no_bluegill_mode_or_ranking: modeRows.every((row) => row.species_id !== "bluegill") && rankingRows.every((row) => row.species_id !== "bluegill"),
  disposition_count_matches: Object.values(dispositionCounts).reduce((sum, count) => sum + count, 0) === 95,
  every_numeric_pair_has_modes: decisions.filter((row) => row.pass2_disposition === "numeric_private").every((row) => modesByPair.has(row.pair_key)),
  no_unscored_pair_has_modes: decisions.filter((row) => row.pass2_disposition !== "numeric_private").every((row) => !modesByPair.has(row.pair_key)),
  all_evidence_ids_resolve: allRefs.every((id) => sourceIds.has(id)),
  all_source_records_complete: ledger.sources.every((row) => sourceRequired.every((field) => row[field] != null && row[field] !== "")),
  complete_same_species_comparisons: Object.keys(approved).every((key) => anchors[key]?.all_same_species_comparisons.length > 0),
  all_mode_strengths_within_bounds: modeRows.every((row) => row.fishery_strength >= 2.1 && row.fishery_strength <= row.pair_peak_fishery_strength && row.pair_peak_fishery_strength <= 10),
  all_availability_within_bounds: modeRows.every((row) => row.availability_knots.every((knot) => knot.availability >= 0 && knot.availability <= 1)),
  exactly_365_rows_per_numeric_pair: Object.keys(approved).every((key) => daily.filter((row) => row.pair_key === key).length === 365),
  five_required_thermal_fits: JSON.stringify(thermalFits) === JSON.stringify([0, 0.25, 0.5, 0.75, 1]),
  all_formula_invariants_pass: true,
  modes_do_not_stack: true,
  december_january_seam_continuous: summaries.every((row) => row.december_january_seam_delta <= 0.001),
  lexington_closure_gated: daily.filter((row) => row.city_id === "lexington_mi" && row.date >= "2026-09-08").every((row) => row.product_availability === "unavailable_access_closure" && row.user_facing_score === ""),
  regulation_and_access_reviewed_for_all_cities: regulationAccess.city_access_gates.length === 5,
  no_runtime_or_public_change: true,
};
const validation = {
  schema_version: "piercast-st-joseph-harrisville-pass2-validation-v1",
  validated_at: REVIEW_DATE,
  status: Object.values(checks).every(Boolean) ? "pass" : "fail",
  checks,
  counts: {
    cities: cities.length,
    catalog_audit_species: species.length,
    decisions: decisions.length,
    ...dispositionCounts,
    numeric_pairs: Object.keys(approved).length,
    modes: modeRows.length,
    daily_rows: daily.length,
    thermal_fits: thermalFits.length,
    score_evaluations: daily.length * thermalFits.length,
    formula_invariant_comparisons: formulaInvariantComparisons,
    monthly_checkpoints: checkpoints.length,
    sources: ledger.sources.length,
    lexington_access_closed_pair_dates: daily.filter((row) => row.city_id === "lexington_mi" && row.product_availability === "unavailable_access_closure").length,
  },
  unresolved_source_references: [...new Set(allRefs.filter((id) => !sourceIds.has(id)))],
  maximum_december_january_seam_delta: Math.max(...summaries.map((row) => row.december_january_seam_delta)),
  pass_boundary: {
    runtime_calibrations_changed: false,
    migrations_created: false,
    public_manifest_changed: false,
    deployments_performed: false,
    app_builds_performed: false,
    pass3_started: false,
  },
};
if (validation.status !== "pass") throw new Error(`Validation failed: ${JSON.stringify(validation, null, 2)}`);

const dailyColumns = ["date", "pair_key", "city_id", "species_id", "legal_status", "access_status", "product_availability", "winning_mode", "fishery_strength", "seasonal_availability", "seasonal_potential", "score_t0", "score_t0_25", "score_t0_5", "score_t0_75", "score_t1", "user_facing_score"];
const files = new Map([
  ["README.md", readme],
  ["PASS2_REPORT.md", pass2Report],
  ["DUE_DILIGENCE_REVIEW.md", dueDiligenceReport],
  ["pair-decisions.json", `${JSON.stringify(decisionArtifact, null, 2)}\n`],
  ["private-mode-calibrations.json", `${JSON.stringify(calibrationArtifact, null, 2)}\n`],
  ["calibration-anchors.json", `${JSON.stringify({ schema_version: "piercast-st-joseph-harrisville-pass2-anchors-v1", reviewed_at: REVIEW_DATE, baseline_artifact: "../chicago-alpena-2026-09-pass2/cross-city-rankings.csv", anchors }, null, 2)}\n`],
  ["source-ledger.json", `${JSON.stringify(ledger, null, 2)}\n`],
  ["regulation-access-decisions.json", `${JSON.stringify(regulationAccess, null, 2)}\n`],
  ["lake-trout-due-diligence.json", `${JSON.stringify(lakeTroutReview, null, 2)}\n`],
  ["atlantic-salmon-review.json", `${JSON.stringify(atlanticReview, null, 2)}\n`],
  ["validation-report.json", `${JSON.stringify(validation, null, 2)}\n`],
  ["due-diligence-review.csv", csv(["pair_key", "city_id", "species_id", "pass1_decision", "pass2_disposition", "evidence_grade", "audited_peak", "outcome", "weaker_or_equal_anchor", "stronger_or_equal_anchor", "finding"], dueDiligenceRows)],
  ["full-year-daily-audit.csv", csv(dailyColumns, daily)],
  ["monthly-checkpoints.csv", csv(dailyColumns, checkpoints)],
  ["score-summary.csv", csv(["pair_key", "city_id", "city_name", "species_id", "species_name", "evidence_grade", "peak_fishery_strength", "ideal_peak_date", "peak_mode", "excellent_days_at_ideal_t", "good_days_at_ideal_t", "shoulder_days_at_ideal_t", "floor_days_at_ideal_t", "access_closed_days", "december_january_seam_delta"], summaries)],
  ["all-species-peak-matrix.csv", csv(["city_id", "city_name", "species_id", "species_name", "pass2_disposition", "evidence_grade", "annual_peak_score", "status"], decisions.map((row) => ({ city_id: row.city_id, city_name: row.display_name, species_id: row.species_id, species_name: speciesNames[row.species_id], pass2_disposition: row.pass2_disposition, evidence_grade: row.evidence_grade, annual_peak_score: row.peak_fishery_strength ?? "", status: row.species_id === "bluegill" ? "NOT_USER_FACING" : row.peak_fishery_strength == null ? "UNSCORED" : "PRIVATE_NUMERIC" })))],
  ["research-holds-and-exclusions.csv", csv(["pair_key", "city_id", "species_id", "pass2_disposition", "evidence_grade", "reason", "next_evidence"], decisions.filter((row) => row.pass2_disposition !== "numeric_private").map((row) => ({ pair_key: row.pair_key, city_id: row.city_id, species_id: row.species_id, pass2_disposition: row.pass2_disposition, evidence_grade: row.evidence_grade, reason: row.calibration_rationale, next_evidence: row.next_evidence })))],
  ["cross-city-rankings.csv", csv(["species_id", "species_name", "rank", "city_id", "city_name", "pair_key", "peak", "cohort"], rankingRows)],
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
  console.log(`PASS: ${files.size} artifacts match; ${decisions.length} decisions, ${Object.keys(approved).length} numeric pairs, ${modeRows.length} modes, ${daily.length} daily rows.`);
} else {
  for (const [name, contents] of files) fs.writeFileSync(path.join(dir, name), contents);
  console.log(`Wrote ${files.size} artifacts; validation ${validation.status}; ${Object.keys(approved).length} numeric pairs, ${modeRows.length} modes, ${daily.length} daily rows.`);
}
