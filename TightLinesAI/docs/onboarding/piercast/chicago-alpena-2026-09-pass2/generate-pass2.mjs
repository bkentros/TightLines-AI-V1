// Run: node docs/onboarding/piercast/chicago-alpena-2026-09-pass2/generate-pass2.mjs
// Private Pass 2 research only. Produces no runtime, migration, manifest, or public-release input.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const piercast = path.resolve(dir, "..");
const pass1Dir = path.resolve(piercast, "chicago-alpena-2026-09-pass1");
const reviewedAt = "2026-09-19";
const pass1 = JSON.parse(fs.readFileSync(path.join(pass1Dir, "species-decisions.json"), "utf8"));
const baseLedger = JSON.parse(fs.readFileSync(path.join(pass1Dir, "source-ledger.json"), "utf8"));
const ledger = {
  ...baseLedger,
  sources: [
    ...baseLedger.sources,
    {
      id: "MI_LH_ROADMAP_2019",
      publisher: "Michigan Department of Natural Resources",
      title: "Roadmap to Fishing Lake Huron",
      published: "2019; reviewed 2026-09-18",
      url: "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Maps/Roadmap_to_fish_Lake_Huron-2019.pdf",
      geography: "Lake Huron ports, including Alpena",
      mode: "port-level seasonal target guide; mixed shore and boat context",
      claim: "Lists Alpena Atlantic salmon in winter and spring, steelhead in spring and fall, and lake trout in summer and fall.",
      use: "Primary confirmation that Atlantic salmon, steelhead, and lake trout are real Alpena port species and seasonal leads.",
      limitation: "The guide is port-level and includes boating access; it does not establish recurring catch or magnitude at the municipal breakwall.",
      sourceClass: "primary",
    },
    {
      id: "MI_STOCKING_DATABASE_2026",
      publisher: "Michigan Department of Natural Resources",
      title: "Fish Stocking Database",
      published: "current through 2026; reviewed 2026-09-19",
      url: "https://midnr.maps.arcgis.com/apps/dashboards/77581b13c6984b919ab8ed927496a31f",
      geography: "Thunder Bay River, Alpena County",
      mode: "official fish-stocking records; river releases supporting the connected Thunder Bay and Alpena fishery",
      claim: "Records annual 2023-26 Thunder Bay River stocking of Atlantic salmon (40,746; 55,000; 40,049; 37,143), coho salmon (51,400; 94,892; 43,392; 31,464), and rainbow trout/steelhead (20,000; 20,000; 19,996; 19,994).",
      use: "Primary evidence that all three salmonids are actively and repeatedly supported at Alpena; used with the exact-harbor species list and seasonal port guide.",
      limitation: "Stocking establishes a managed local population and migration source, not breakwall catch rate or guaranteed daily availability.",
      sourceClass: "primary",
    },
    {
      id: "MI_ATLANTIC_SALMON_SPECIES",
      publisher: "Michigan Department of Natural Resources",
      title: "Atlantic salmon",
      published: "current page; reviewed 2026-09-19",
      url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/atlantic-salmon",
      geography: "Thunder Bay River and connected Lake Huron waters",
      mode: "species-management and seasonal fishery guidance",
      claim: "Identifies an experimental stocked Atlantic salmon fishery in the Thunder Bay River, with spring nearshore fish and adult returns primarily from October through December.",
      use: "Primary confirmation of Alpena Atlantic salmon management and the two recurring seasonal windows.",
      limitation: "The fall return description centers on the river and cannot by itself quantify the Bay View Park breakwall.",
      sourceClass: "primary",
    },
    {
      id: "MI_MASTER_ANGLER_2024",
      publisher: "Michigan Department of Natural Resources",
      title: "2024 Master Angler Awards Report",
      published: "2025; reviewed 2026-09-19",
      url: "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Archive/Master-Angler/MA-Annual-Awards-Report_2024.pdf",
      geography: "Thunder Bay and Thunder Bay River, Alpena County",
      mode: "verified qualifying catch records; mixed shore and boat context",
      claim: "Records Atlantic salmon from Thunder Bay on May 12, 2024 and the Thunder Bay River on November 17, 2024.",
      use: "Primary current catch corroboration for Alpena Atlantic salmon in both spring lake and fall river windows.",
      limitation: "Exceptional qualifying catches confirm occurrence and timing but do not estimate ordinary catch rate at the covered breakwall.",
      sourceClass: "primary",
    },
    {
      id: "MI_RULES_2026_LAKE_TROUT",
      publisher: "Michigan Department of Natural Resources",
      title: "2026 Michigan Fishing Regulations",
      published: "2026; reviewed 2026-09-19",
      url: "https://www.michigan.gov/dnr/managing-resources/laws/regulations/fishing",
      geography: "Lake Huron management unit MH-2, including Alpena",
      mode: "binding recreational fishing regulation",
      claim: "Lake trout season in MH-2 is January 1 through September 30.",
      use: "Suppresses the Alpena lake-trout score during the October 1 through December 31 closed season.",
      limitation: "Anglers must follow the current regulation publication and emergency orders.",
      sourceClass: "primary",
    },
  ],
};
const sourceIds = new Set(ledger.sources.map((source) => source.id));

const cityNames = {
  chicago_il: "Chicago, Illinois",
  michigan_city_in: "Michigan City, Indiana",
  muskegon_mi: "Muskegon, Michigan",
  whitehall_mi: "Whitehall, Michigan",
  alpena_mi: "Alpena, Michigan",
};
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
const thermalCurveIds = {
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
  burbot: "burbot__shared_temperature__v0_1_research",
  white_perch: "white_perch__shared_temperature__v0_1_research",
  white_bass: "white_bass__shared_temperature__v0_1_research",
  bluegill: "bluegill__shared_temperature__v0_1_research",
};

const numeric = (strength, grade, profile, rationale, sources) => ({ strength, grade, profile, rationale, sources });
const preDueDiligenceStrengths = {
  "chicago_il/lake_trout": 4.8,
  "chicago_il/smallmouth_bass": 6.0,
  "michigan_city_in/chinook_salmon": 7.7,
  "michigan_city_in/yellow_perch": 6.8,
  "michigan_city_in/bluegill": 4.8,
  "muskegon_mi/chinook_salmon": 7.7,
  "muskegon_mi/lake_whitefish": 8.8,
  "whitehall_mi/lake_whitefish": 7.8,
  "alpena_mi/yellow_perch": 8.8,
};
const approved = {
  "chicago_il/chinook_salmon": numeric(7.0, "B", "chinook_lm", "Montrose has direct September pedestrian creel catch and recurring current Horseshoe targeting. The measured magnitude is below Waukegan and the major Wisconsin staging ports.", ["CHI_INHS_CREEL_2024", "CHI_PARK_BAIT_2026"]),
  "chicago_il/coho_salmon": numeric(8.2, "B", "coho_spring", "Direct Montrose pedestrian estimates and repeat current reports establish an excellent spring shore fishery with a smaller fall return; Waukegan remains the stronger measured Illinois anchor.", ["CHI_INHS_CREEL_2023", "CHI_INHS_CREEL_2024", "CHI_PARK_BAIT_2026"]),
  "chicago_il/steelhead": numeric(6.5, "B", "steelhead_standard", "Recurring exact-harbor reports and the agency cold-season shore calendar support a strong but not elite opportunity; exact seasonal effort remains missing.", ["CHI_CPD_FISHING_AREAS", "CHI_PARK_BAIT_2026"]),
  "chicago_il/brown_trout": numeric(6.2, "B", "brown_standard", "Montrose recorded brown trout in both April and May 2024, corroborated by current shoreline reports; observed magnitude remains below established Wisconsin brown-trout ports.", ["CHI_INHS_CREEL_2024", "CHI_PARK_BAIT_2026"]),
  "chicago_il/lake_trout": numeric(5.4, "B", "lake_trout_chicago", "Repeated expert and specialist reporting describes an increasingly targeted, decent-to-good winter shore fishery with limit catches at Chicago structures. That qualitative magnitude places Chicago between Harbor Beach and Port Sanilac; missing standardized effort remains a Grade B limitation only.", ["CHI_LAKE_TROUT_2023", "CHI_MWO_WINTER_2025", "CHI_IDNR_LAKE_MICHIGAN"]),
  "chicago_il/smallmouth_bass": numeric(6.5, "B", "smallmouth_warm", "Current Montrose Horseshoe and wall reports repeatedly describe good smallmouth fishing, and Illinois documents the growing Chicago shore fishery. The resulting strong peak sits between Whitehall and Muskegon; missing standardized effort remains a Grade B limitation only.", ["CHI_CPD_FISHING_AREAS", "CHI_PARK_BAIT_2026", "CHI_IDNR_LAKE_MICHIGAN"]),
  "chicago_il/freshwater_drum": numeric(5.6, "B", "drum_warm", "The city agency calendar and recurring Montrose reports establish intentional summer drum fishing; magnitude is placed between Ludington and Grand Haven.", ["CHI_CPD_FISHING_AREAS", "CHI_PARK_BAIT_2026"]),
  "chicago_il/yellow_perch": numeric(8.4, "A", "perch_chicago", "Direct Montrose summer estimates and the large Navy Pier share of the measured winter fishery support an excellent two-season ceiling. The legal May 1-June 15 closure remains unavailable.", ["CHI_INHS_CREEL_2023", "CHI_INHS_CREEL_2024", "IL_RULES_2026"]),
  "chicago_il/northern_pike": numeric(4.7, "B", "pike_standard", "Recurring current Montrose harbor reports establish a modest targeted pike opportunity without enough magnitude evidence for a strong-band score.", ["CHI_PARK_BAIT_2026"]),

  "michigan_city_in/chinook_salmon": numeric(7.4, "B", "chinook_lm", "Agency guidance characterizes Chinook as a 'some pier' opportunity and the current report describes only a few shore fish. Those direct qualitative magnitude constraints place Michigan City with Kenosha, below Waukegan and Grand Haven.", ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_SHORE_GUIDE", "IN_DNR_REPORT_2026_09"]),
  "michigan_city_in/coho_salmon": numeric(8.7, "B", "coho_spring", "Washington Park and the inner harbor are agency-named spring-coho sites with March identified as the most consistent shore period; the peak sits just below Grand Haven and Waukegan.", ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_COHO_GUIDE", "IN_DNR_REPORT_2026_09"]),
  "michigan_city_in/steelhead": numeric(8.5, "B", "steelhead_michigan_city", "The agency documents both a summer Skamania pier fishery and a late-fall/winter run, supporting an excellent multi-window ceiling below Grand Haven and above Ludington.", ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_SHORE_GUIDE"]),
  "michigan_city_in/brown_trout": numeric(6.0, "B", "brown_standard", "Exact-site agency guidance names brown trout as a recurring cold-water pier catch, but lacks a magnitude series; placement remains below Kenosha and Chicago.", ["IN_DNR_COHO_GUIDE", "IN_DNR_SHORE_GUIDE"]),
  "michigan_city_in/smallmouth_bass": numeric(5.7, "B", "smallmouth_warm", "Agency guidance repeatedly assigns bass to protected pier and marina habitat; the ordinary ceiling stays just below Ludington because exact-city catch magnitude is missing.", ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_SHORE_GUIDE"]),
  "michigan_city_in/yellow_perch": numeric(6.2, "B", "perch_summer", "Indiana DNR identifies a recurring June-through-mid-September pier fishery but describes shore availability as limited. That magnitude language places Michigan City below the quantitative Grand Haven and Manistee anchors.", ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_SHORE_GUIDE"]),
  "michigan_city_in/largemouth_bass": numeric(5.5, "B", "largemouth_warm", "Agency shore guidance supports intentional bass fishing in the protected Washington Park marina setting; no exact catch series supports a higher value.", ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_SHORE_GUIDE"]),
  "michigan_city_in/bluegill": numeric(5.2, "B", "bluegill_warm", "The agency shore guide describes bluegill and other sunfish as common at Washington Park marina, supporting an ordinary summer fishery equal to Whitehall and below Grand Haven.", ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_SHORE_GUIDE"]),

  "muskegon_mi/chinook_salmon": numeric(6.5, "A", "chinook_lm", "Fifteen historical positive Pier/Dock years and exact channel guidance establish a real fall fishery, but the modern series falls to 47 fish and the recent series to one fish with four surveyed fall zeros. That observed current weakness supports a strong-band floor rather than placement beside Grand Haven and Waukegan.", ["MI_CREEL_DASHBOARD", "MI_DNR_CENTRAL_UNIT", "MI_BETTER_WATERS"]),
  "muskegon_mi/coho_salmon": numeric(6.4, "A", "coho_balanced", "Fourteen positive port years through 2021 establish recurring spring and fall opportunity; measured catch strength remains below the stronger Wisconsin and southern Lake Michigan coho ports.", ["MI_CREEL_DASHBOARD", "MI_DNR_CENTRAL_UNIT"]),
  "muskegon_mi/steelhead": numeric(8.0, "A", "steelhead_standard", "Twenty-seven positive port years through 2022 and exact channel guidance support an excellent spring/fall ceiling immediately below Ludington.", ["MI_CREEL_DASHBOARD", "MI_DNR_CENTRAL_UNIT", "MI_BETTER_WATERS"]),
  "muskegon_mi/brown_trout": numeric(7.0, "A", "brown_standard", "Twenty-six positive port years through 2022 support a strong recurring spring fishery; measured magnitude remains below the top Michigan and Wisconsin brown-trout ports.", ["MI_CREEL_DASHBOARD", "MI_DNR_CENTRAL_UNIT"]),
  "muskegon_mi/walleye": numeric(6.4, "A", "walleye_spring", "Seventeen of eighteen surveyed years are positive through 2022 and channel guidance names walleye, supporting a strong ceiling below Alpena and Oscoda.", ["MI_CREEL_DASHBOARD", "MI_DNR_CENTRAL_UNIT"]),
  "muskegon_mi/smallmouth_bass": numeric(6.6, "A", "smallmouth_warm", "Fourteen of fifteen port years are positive through 2022 and the current fishery report names channel/pierhead habitat, placing Muskegon below Grand Haven and above Chicago.", ["MI_CREEL_DASHBOARD", "MI_DNR_CENTRAL_UNIT", "MUSKEGON_LAKE_SFR_2025"]),
  "muskegon_mi/freshwater_drum": numeric(6.2, "A", "drum_warm", "Ten of eleven surveyed years are positive through 2022 with substantial warm-season catch, placing the port below Grand Haven but above Chicago and Ludington.", ["MI_CREEL_DASHBOARD", "MI_DNR_CENTRAL_UNIT"]),
  "muskegon_mi/yellow_perch": numeric(5.2, "A", "perch_muskegon", "Historical recurrence and exact channel guidance establish a real fishery, but the modern 2012-22 Catch series is only 52 fish over 27,515 matched hours with many in-season zeros. That observed weakness places the ceiling between Port Sanilac and Kenosha.", ["MI_CREEL_DASHBOARD", "MI_DNR_CENTRAL_UNIT", "MI_BETTER_WATERS"]),
  "muskegon_mi/lake_whitefish": numeric(4.0, "B", "whitefish_november", "Exact channel guidance and the November protection rule establish an intentional cold-season opportunity. Michigan DNR says much of the port harvest was snagged, so the large creel totals cannot measure lawful bite strength; the defensible lawful calibration is the same ordinary 4.0 anchor used at Grand Haven.", ["MI_CREEL_DASHBOARD", "MI_DNR_CENTRAL_UNIT", "MI_BETTER_WATERS", "MI_WHITEFISH_HOOK_RULE"]),
  "muskegon_mi/channel_catfish": numeric(6.0, "A", "catfish_warm", "Thirteen of fourteen surveyed years are positive through 2022 and exact channel guidance names catfish; magnitude remains below Grand Haven.", ["MI_CREEL_DASHBOARD", "MI_DNR_CENTRAL_UNIT"]),
  "muskegon_mi/largemouth_bass": numeric(6.5, "A", "largemouth_warm", "Nine of ten surveyed port years are positive through 2022; direct recurrence supports a strong warm-season value below Grand Haven.", ["MI_CREEL_DASHBOARD"]),
  "muskegon_mi/northern_pike": numeric(4.8, "A", "pike_standard", "Five positive port years through 2021 support an ordinary harbor opportunity near the established Michigan pike cohort.", ["MI_CREEL_DASHBOARD"]),
  "muskegon_mi/white_perch": numeric(5.7, "A", "white_perch_warm", "Five consecutive positive port years from 2016 through 2020 and substantial catch support a recurring warm-season fishery just above Grand Haven.", ["MI_CREEL_DASHBOARD"]),
  "muskegon_mi/bluegill": numeric(6.0, "A", "bluegill_warm", "Ten of twelve port years are positive through 2022 with a strong summer concentration, slightly above the Grand Haven reference.", ["MI_CREEL_DASHBOARD"]),

  "whitehall_mi/chinook_salmon": numeric(9.3, "A", "chinook_lm", "Sixteen of seventeen port years are positive with high fall catch magnitude, placing this elite run below Sheboygan and above Kewaunee. Port allocation uncertainty is disclosed rather than multiplied into strength.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS"]),
  "whitehall_mi/coho_salmon": numeric(7.4, "A", "coho_fall", "Twelve of thirteen port years are positive through 2018, with fall stronger than spring, supporting a strong peak above Manitowoc.", ["MI_CREEL_DASHBOARD"]),
  "whitehall_mi/steelhead": numeric(8.7, "A", "steelhead_standard", "All fifteen surveyed port years are positive through 2018 with strong April and October catch, placing Whitehall above Ludington and below Grand Haven.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS"]),
  "whitehall_mi/brown_trout": numeric(7.7, "A", "brown_standard", "All seventeen surveyed port years are positive through 2018, supporting a strong spring peak between Algoma and Sheboygan.", ["MI_CREEL_DASHBOARD"]),
  "whitehall_mi/walleye": numeric(5.8, "A", "walleye_summer", "All twelve surveyed port years are positive through 2018, but magnitude is below the stronger Alpena, Oscoda, and Muskegon placements.", ["MI_CREEL_DASHBOARD"]),
  "whitehall_mi/smallmouth_bass": numeric(6.3, "A", "smallmouth_warm", "Thirteen of fourteen surveyed port years are positive through 2018, supporting a strong value between Chicago and Muskegon.", ["MI_CREEL_DASHBOARD", "WHITE_LAKE_SFR_2024"]),
  "whitehall_mi/freshwater_drum": numeric(5.6, "A", "drum_warm", "All nine surveyed port years are positive through 2018, supporting a strong recurring summer fishery equal to Chicago and below Muskegon.", ["MI_CREEL_DASHBOARD"]),
  "whitehall_mi/yellow_perch": numeric(8.0, "A", "perch_whitehall", "Eight of ten surveyed years are positive with high summer magnitude. July is the recurring peak; the extraordinary September estimate occurs in only one sampled year and 2018 is zero, so the ceiling remains below current Chicago evidence.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS"]),
  "whitehall_mi/lake_whitefish": numeric(4.0, "B", "whitefish_november", "The current agency names White Lake pier/channel waters and the November rule confirms an intentional seasonal opportunity. With no positive port catch row and DNR warning that much port harvest was snagged, no lawful magnitude above Grand Haven's ordinary 4.0 anchor is defensible.", ["MI_BETTER_WATERS", "MI_WHITEFISH_HOOK_RULE", "MI_CREEL_DASHBOARD"]),
  "whitehall_mi/channel_catfish": numeric(5.0, "A", "catfish_warm", "Five of six surveyed port years are positive through 2018; observed magnitude supports an ordinary fishery below Muskegon and Grand Haven.", ["MI_CREEL_DASHBOARD"]),
  "whitehall_mi/largemouth_bass": numeric(7.1, "A", "largemouth_warm", "Twelve of thirteen surveyed port years are positive with strong summer catch, just below Grand Haven's established 7.4 reference.", ["MI_CREEL_DASHBOARD", "WHITE_LAKE_SFR_2024"]),
  "whitehall_mi/northern_pike": numeric(4.9, "A", "pike_standard", "Seven of eight surveyed port years are positive through 2018, supporting an ordinary ceiling within the established Michigan pike band.", ["MI_CREEL_DASHBOARD", "WHITE_LAKE_SFR_2024"]),
  "whitehall_mi/bluegill": numeric(5.2, "A", "bluegill_warm", "Five of six surveyed port years are positive through 2018 with a clear summer concentration, below Grand Haven and Muskegon.", ["MI_CREEL_DASHBOARD", "WHITE_LAKE_SFR_2024"]),

  "alpena_mi/chinook_salmon": numeric(5.4, "B", "chinook_alpena", "Two positive port years and the current exact-harbor agency listing support a limited fall fishery equal to the lower Lake Huron cohort; old recurrence prevents a stronger value.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS"]),
  "alpena_mi/coho_salmon": numeric(6.5, "B", "coho_alpena", "Michigan DNR lists coho for Alpena Harbor and has stocked 31,464 to 94,892 coho annually into the connected Thunder Bay River in each of 2023-26. With no positive modern Pier/Dock creel row, the ceiling is held to Oscoda's 6.5 rather than placed with stronger Lake Michigan ports.", ["MI_BETTER_WATERS", "MI_STOCKING_DATABASE_2026", "MI_CREEL_DASHBOARD"]),
  "alpena_mi/steelhead": numeric(5.8, "B", "steelhead_alpena", "Michigan DNR lists steelhead for Alpena Harbor and as a spring and fall Alpena target, while annual 2023-26 Thunder Bay River stocking confirms current local support. The roughly 20,000 annual release is materially below the Au Sable program, and zero modern Pier/Dock rows keep Alpena below Oscoda's 7.4.", ["MI_BETTER_WATERS", "MI_LH_ROADMAP_2019", "MI_STOCKING_DATABASE_2026", "MI_CREEL_DASHBOARD"]),
  "alpena_mi/brown_trout": numeric(5.4, "B", "brown_standard", "Three positive port years through 2018 plus the current exact-harbor listing establish a real spring opportunity above Port Sanilac but below stronger Lake Michigan ports.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS"]),
  "alpena_mi/lake_trout": numeric(5.0, "B", "lake_trout_alpena", "Michigan DNR lists lake trout for Alpena Harbor and identifies summer and early-fall Alpena opportunity; the Pier/Dock series includes a positive April 2007 catch. Six later zero years and mixed boat context keep the ceiling below Harbor Beach and Port Sanilac, while the MH-2 October-December closure is enforced separately.", ["MI_BETTER_WATERS", "MI_LH_ROADMAP_2019", "MI_CREEL_DASHBOARD", "MI_RULES_2026_LAKE_TROUT"]),
  "alpena_mi/walleye": numeric(7.4, "A", "walleye_spring", "Five positive port years through 2019 with high effort-normalized catch and a current harbor listing support the strongest walleye ceiling in the current pier cohort.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS"]),
  "alpena_mi/smallmouth_bass": numeric(8.0, "A", "smallmouth_warm", "Ten positive port years through 2020 and very high catch magnitude support an excellent harbor fishery above Grand Haven.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS"]),
  "alpena_mi/freshwater_drum": numeric(4.2, "B", "drum_warm", "Three positive port years from 2012-15 establish recurring low-magnitude opportunity just above Oscoda; the current agency harbor list omits drum, preventing a higher placement.", ["MI_CREEL_DASHBOARD"]),
  "alpena_mi/yellow_perch": numeric(7.6, "A", "perch_alpena", "Ten historical positive port years and several exceptional fall catches establish a strong fishery, while the last positive year is 2015 and the prime October stratum is zero in 2018, 2020, and 2021. The current agency listing supports retention, but the observed modern weakness places Alpena with Ludington rather than above current Chicago evidence.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS"]),
  "alpena_mi/northern_pike": numeric(5.5, "A", "pike_standard", "Five positive port years plus the current harbor listing support the top value in the current pike cohort, modestly above Ludington.", ["MI_CREEL_DASHBOARD", "MI_BETTER_WATERS"]),
  "alpena_mi/atlantic_salmon": numeric(7.2, "B", "atlantic_alpena", "Michigan DNR lists Atlantic salmon for Alpena Harbor, maintains annual Thunder Bay River stocking comparable to the Au Sable program, and recorded 2024 Master Angler fish in both Thunder Bay and the river. Exact breakwall effort remains unmeasured, so the peak stays below Oscoda's 8.4.", ["MI_BETTER_WATERS", "MI_LH_ROADMAP_2019", "MI_STOCKING_DATABASE_2026", "MI_ATLANTIC_SALMON_SPECIES", "MI_MASTER_ANGLER_2024"]),
};

const modeProfiles = {
  chinook_lm: [
    ["spring_nearshore_transient", 0.48, [["01-01",0],["03-20",0],["04-20",0.35],["05-20",1],["06-20",0.2],["07-05",0],["12-31",0]]],
    ["fall_harbor_staging", 1, [["01-01",0],["07-20",0],["08-15",0.42],["09-05",1],["09-22",0.8],["10-15",0.12],["11-01",0],["12-31",0]]],
  ],
  chinook_alpena: [["fall_harbor_staging", 1, [["01-01",0],["08-20",0],["09-15",0.4],["10-05",1],["10-25",0.4],["11-10",0],["12-31",0]]]],
  atlantic_alpena: [
    ["winter_spring_nearshore", 1, [["01-01",0.68],["02-15",0.76],["03-20",0.9],["04-25",1],["05-25",0.55],["06-20",0],["09-15",0],["12-01",0.68],["12-31",0.68]]],
    ["fall_harbor_return", 0.85, [["01-01",0.28],["06-15",0],["08-20",0],["09-20",0.62],["10-20",1],["11-20",0.82],["12-31",0.28]]],
  ],
  coho_alpena: [
    ["spring_nearshore", 0.7, [["01-01",0],["03-01",0.2],["04-20",1],["05-20",0.35],["06-15",0],["12-31",0]]],
    ["fall_harbor_return", 1, [["01-01",0],["08-20",0.1],["09-20",0.68],["10-10",1],["11-15",0.2],["12-01",0],["12-31",0]]],
  ],
  steelhead_alpena: [
    ["spring_harbor", 1, [["01-01",0.25],["03-15",0.65],["04-25",1],["06-15",0],["08-20",0],["12-31",0.25]]],
    ["fall_harbor", 0.95, [["01-01",0.2],["08-20",0],["09-15",0.55],["10-15",1],["11-30",0.4],["12-31",0.2]]],
  ],
  coho_spring: [
    ["spring_nearshore", 1, [["01-01",0.12],["02-15",0.35],["03-20",0.72],["04-20",1],["05-20",0.62],["06-20",0.12],["07-05",0],["12-01",0],["12-31",0.12]]],
    ["fall_harbor_return", 0.72, [["01-01",0],["08-20",0],["09-20",0.52],["10-10",1],["11-15",0.18],["12-01",0],["12-31",0]]],
  ],
  coho_balanced: [
    ["spring_nearshore", 1, [["01-01",0],["03-01",0.25],["04-15",1],["05-20",0.45],["06-15",0],["12-31",0]]],
    ["fall_harbor_return", 0.95, [["01-01",0],["08-20",0],["09-20",0.75],["10-10",1],["11-15",0.15],["12-01",0],["12-31",0]]],
  ],
  coho_fall: [
    ["spring_nearshore", 0.72, [["01-01",0],["03-01",0.25],["04-15",1],["05-20",0.35],["06-10",0],["12-31",0]]],
    ["fall_harbor_return", 1, [["01-01",0],["08-15",0],["09-15",0.65],["10-05",1],["11-10",0.2],["12-01",0],["12-31",0]]],
  ],
  steelhead_standard: [
    ["winter_spring_pier", 1, [["01-01",0.38],["02-15",0.5],["04-15",1],["05-20",0.55],["06-25",0.08],["07-10",0],["12-01",0.32],["12-31",0.38]]],
    ["fall_harbor", 0.96, [["01-01",0.28],["08-20",0],["09-20",0.38],["10-25",1],["11-25",0.72],["12-31",0.28]]],
  ],
  steelhead_michigan_city: [
    ["winter_spring_pier", 0.9, [["01-01",0.6],["03-15",1],["05-15",0.35],["06-10",0],["10-25",0.4],["12-31",0.6]]],
    ["summer_skamania_pier", 1, [["01-01",0],["06-01",0],["06-20",0.48],["07-15",1],["08-15",0.55],["09-05",0],["12-31",0]]],
    ["late_fall_winter_pier", 0.9, [["01-01",0.75],["03-31",0.45],["05-01",0],["10-15",0],["11-15",1],["12-31",0.75]]],
  ],
  brown_standard: [
    ["winter_spring_nearshore", 1, [["01-01",0.42],["02-15",0.58],["04-10",1],["05-20",0.55],["06-20",0.08],["07-10",0],["12-01",0.38],["12-31",0.42]]],
    ["fall_harbor", 0.72, [["01-01",0.35],["08-25",0],["10-01",0.4],["11-10",1],["12-31",0.35]]],
  ],
  lake_trout_chicago: [["winter_nearshore", 1, [["01-01",0.78],["02-15",1],["04-15",0.42],["05-20",0],["10-15",0],["11-20",0.55],["12-31",0.78]]]],
  lake_trout_alpena: [
    ["spring_coldwater_pier", 0.8, [["01-01",0.25],["03-01",0.4],["04-20",1],["06-01",0.15],["06-20",0],["12-01",0.2],["12-31",0.25]]],
    ["summer_early_fall_nearshore", 1, [["01-01",0],["05-15",0],["06-15",0.35],["08-15",1],["09-15",0.85],["09-30",0.65],["10-01",0],["12-31",0]]],
  ],
  walleye_spring: [["spring_low_light", 1, [["01-01",0.08],["03-15",0.22],["05-15",1],["06-20",0.55],["08-20",0.3],["10-15",0.2],["12-31",0.08]]]],
  walleye_summer: [["summer_low_light", 1, [["01-01",0],["04-01",0.15],["06-15",0.55],["08-15",1],["10-15",0.25],["11-15",0],["12-31",0]]]],
  smallmouth_warm: [["warm_season_harbor", 1, [["01-01",0],["03-20",0],["05-01",0.3],["06-20",0.8],["07-20",1],["09-15",0.78],["10-20",0.22],["11-15",0],["12-31",0]]]],
  drum_warm: [["warm_season_harbor", 1, [["01-01",0],["04-15",0],["05-20",0.3],["07-15",1],["08-20",0.9],["09-25",0.4],["10-20",0],["12-31",0]]]],
  perch_chicago: [
    ["summer_montrose_schooling", 0.92, [["01-01",0],["06-15",0],["06-16",0.75],["07-10",1],["09-01",0.3],["10-01",0],["12-31",0]]],
    ["winter_navy_pier_schooling", 1, [["01-01",0.82],["02-01",1],["03-20",0.4],["04-30",0.18],["05-01",0],["10-20",0],["11-20",0.45],["12-20",0.9],["12-31",0.82]]],
  ],
  perch_summer: [["summer_pier_schooling", 1, [["01-01",0],["05-20",0],["06-15",0.35],["07-20",1],["08-25",0.88],["09-15",0.45],["10-10",0],["12-31",0]]]],
  perch_muskegon: [
    ["spring_channel_schooling", 1, [["01-01",0.1],["03-01",0.25],["04-20",1],["05-20",0.5],["06-15",0.25],["12-31",0.1]]],
    ["summer_channel_schooling", 0.88, [["01-01",0],["05-20",0],["06-20",0.6],["07-20",1],["09-15",0.25],["10-15",0],["12-31",0]]],
  ],
  perch_whitehall: [["summer_channel_schooling", 1, [["01-01",0],["05-15",0],["06-15",0.25],["07-20",1],["08-20",0.82],["09-20",0.55],["10-20",0.15],["11-15",0],["12-31",0]]]],
  perch_alpena: [["fall_harbor_schooling", 1, [["01-01",0],["06-15",0],["08-15",0.18],["09-20",0.68],["10-10",1],["11-10",0.2],["12-01",0],["12-31",0]]]],
  whitefish_november: [["late_fall_channel", 1, [["01-01",0.08],["03-15",0.18],["05-15",0],["09-15",0],["10-20",0.35],["11-15",1],["12-15",0.45],["12-31",0.08]]]],
  round_whitefish_fall: [["fall_channel", 1, [["01-01",0],["03-01",0.1],["04-15",0.45],["05-15",0],["09-15",0],["10-20",1],["11-20",0.35],["12-15",0],["12-31",0]]]],
  catfish_warm: [["warm_season_channel", 1, [["01-01",0],["04-15",0],["05-20",0.3],["07-20",0.8],["08-20",1],["09-20",0.72],["10-20",0.25],["11-10",0],["12-31",0]]]],
  largemouth_warm: [["warm_season_harbor", 1, [["01-01",0],["04-15",0],["05-20",0.25],["07-15",0.82],["08-15",1],["09-20",0.65],["10-20",0.15],["11-05",0],["12-31",0]]]],
  pike_standard: [
    ["spring_harbor", 1, [["01-01",0.22],["03-01",0.4],["05-01",1],["06-20",0.5],["07-20",0.25],["12-31",0.22]]],
    ["fall_harbor", 0.92, [["01-01",0.2],["07-01",0.2],["09-20",1],["11-15",0.45],["12-31",0.2]]],
  ],
  white_perch_warm: [["warm_season_schooling", 1, [["01-01",0],["04-15",0],["05-20",0.35],["07-15",0.85],["08-20",1],["10-01",0.45],["11-01",0],["12-31",0]]]],
  bluegill_warm: [["warm_season_harbor", 1, [["01-01",0],["04-20",0],["06-01",0.35],["07-20",0.82],["08-15",1],["09-20",0.52],["10-15",0],["12-31",0]]]],
};

const establishedRows = [];
const parseCsvSimple = (text) => {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const keys = header.split(",");
  return lines.map((line) => Object.fromEntries(line.split(",").map((value, i) => [keys[i], value])));
};
for (const row of parseCsvSimple(fs.readFileSync(path.join(piercast, "all-city-common-species-audit-2026-09/cross-city-rankings.csv"), "utf8"))) {
  establishedRows.push({ pairKey: row.pairKey, cityId: row.cityId, cityName: row.cityName, speciesId: row.speciesId, peak: Number(row.auditedPeak), cohort: "established_or_prior_private_common_species" });
}
for (const row of parseCsvSimple(fs.readFileSync(path.join(piercast, "michigan-all-scored-species-audit-2026-09/michigan-species-rankings.csv"), "utf8"))) {
  if (!establishedRows.some((x) => x.pairKey === `${row.cityId}/${row.speciesId}`)) establishedRows.push({ pairKey: `${row.cityId}/${row.speciesId}`, cityId: row.cityId, cityName: row.cityName, speciesId: row.speciesId, peak: Number(row.peakFisheryStrength), cohort: "established_michigan_all_species" });
}

const allCalibrationRows = [
  ...establishedRows,
  ...Object.entries(approved).map(([pairKey, value]) => {
    const [cityId, speciesId] = pairKey.split("/");
    return { pairKey, cityId, cityName: cityNames[cityId], speciesId, peak: value.strength, cohort: "new_private_pass2" };
  }),
];
const anchors = {};
for (const [pairKey, value] of Object.entries(approved)) {
  const [, speciesId] = pairKey.split("/");
  const comparisons = allCalibrationRows.filter((row) => row.speciesId === speciesId && row.pairKey !== pairKey);
  const lower = comparisons.filter((row) => row.peak <= value.strength).sort((a, b) => b.peak - a.peak || a.cityName.localeCompare(b.cityName))[0] ?? null;
  const upper = comparisons.filter((row) => row.peak >= value.strength).sort((a, b) => a.peak - b.peak || a.cityName.localeCompare(b.cityName))[0] ?? null;
  anchors[pairKey] = {
    weakerOrEqual: lower && { pairKey: lower.pairKey, cityName: lower.cityName, peak: lower.peak, cohort: lower.cohort },
    strongerOrEqual: upper && { pairKey: upper.pairKey, cityName: upper.cityName, peak: upper.peak, cohort: upper.cohort },
    placement: `${value.strength} is ${lower ? `at/above ${lower.cityName} ${lower.peak}` : "below no reviewed same-species value"} and ${upper ? `at/below ${upper.cityName} ${upper.peak}` : "above the reviewed same-species cohort"}.`,
  };
}

const holdOverrides = {};

const decisions = pass1.decisions.map((row) => {
  const calibration = approved[row.pairKey];
  if (calibration) {
    for (const id of calibration.sources) if (!sourceIds.has(id)) throw new Error(`Unknown source ${id}`);
    return {
      ...row,
      pass2Disposition: "numeric_private",
      evidenceGrade: calibration.grade,
      peakFisheryStrength: calibration.strength,
      peakMeaning: "Formula v3 ceiling under full recurring availability and ideal thermal suitability; not annual average, catch probability, or agency rating.",
      evidenceIds: calibration.sources,
      calibrationRationale: calibration.rationale,
      anchorPlacement: anchors[row.pairKey],
      confidenceTreatment: "Evidence grade is disclosed and is not a multiplier on F, A, T, or score.",
    };
  }
  const hold = row.decision !== "exclude";
  const holdOverride = holdOverrides[row.pairKey];
  if (holdOverride) for (const id of holdOverride.evidenceIds) if (!sourceIds.has(id)) throw new Error(`Unknown source ${id}`);
  return {
    ...row,
    pass2Disposition: hold ? "research_hold_unscored" : "exclude_unscored",
    evidenceGrade: hold ? "C" : "D",
    peakFisheryStrength: null,
    peakMeaning: "No score. This is not a low rating or a claim of biological absence.",
    evidenceIds: holdOverride?.evidenceIds ?? row.sourceIds,
    calibrationRationale: hold
      ? holdOverride?.rationale ?? `Pass 2 reopened this cell but the reviewed record still lacks recurring intentional covered-structure opportunity, defensible magnitude, or a complete annual shape. ${row.claim}`
      : `Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. ${row.claim}`,
    anchorPlacement: null,
    confidenceTreatment: hold ? "Grade C remains an explicit unscored hold; no placeholder score is permitted." : "Grade D remains unscored.",
  };
});
if (decisions.length !== 95 || new Set(decisions.map((row) => row.pairKey)).size !== 95) throw new Error("Expected 95 unique decisions");
const dispositionCounts = Object.fromEntries(["numeric_private", "research_hold_unscored", "exclude_unscored"].map((disposition) => [disposition, decisions.filter((row) => row.pass2Disposition === disposition).length]));
if (JSON.stringify(dispositionCounts) !== JSON.stringify({ numeric_private: 55, research_hold_unscored: 23, exclude_unscored: 17 })) throw new Error(`Unexpected disposition counts ${JSON.stringify(dispositionCounts)}`);

const modeRows = [];
for (const row of decisions.filter((decision) => decision.pass2Disposition === "numeric_private")) {
  const calibration = approved[row.pairKey];
  const profile = modeProfiles[calibration.profile];
  if (!profile) throw new Error(`Missing profile ${calibration.profile}`);
  for (const [modeId, factor, knots] of profile) {
    const fisheryStrength = Number((1 + (calibration.strength - 1) * factor).toFixed(2));
    if (fisheryStrength < 2.1 || fisheryStrength > 10) throw new Error(`Invalid mode F ${row.pairKey}/${modeId}`);
    for (const [, availability] of knots) if (availability < 0 || availability > 1) throw new Error(`Invalid A ${row.pairKey}/${modeId}`);
    modeRows.push({
      modeCalibrationId: `${row.cityId}__${row.speciesId}__${modeId}__chicago_alpena_pass2`,
      pairKey: row.pairKey,
      cityId: row.cityId,
      speciesId: row.speciesId,
      modeId,
      fisheryStrength,
      pairPeakFisheryStrength: calibration.strength,
      evidenceGrade: calibration.grade,
      availabilityKnots: knots.map(([monthDay, availability]) => ({ monthDay, availability })),
      thermalCurveId: thermalCurveIds[row.speciesId],
      thermalPolicy: "inherit_existing_shared_species_curve; Pass 2 evaluates explicit T=0, 0.5, and 1 and does not approve a city temperature source",
      fisheryEvidenceIds: calibration.sources,
      calibrationStatus: "private_pass2_only",
      limitations: [
        "F is an ordinal prime-condition ceiling, not catch probability or fish abundance.",
        "Availability knots describe recurring seasonal shape and are not daily observed catch rates.",
        "Modes compete by maximum seasonalPotential and never stack.",
      ],
    });
  }
}

const doy = (monthDay) => Math.floor((Date.parse(`2027-${monthDay}T00:00:00Z`) - Date.parse("2027-01-01T00:00:00Z")) / 86400000);
const availabilityAt = (knots, day) => {
  const points = knots.map((knot) => ({ day: doy(knot.monthDay), value: knot.availability })).sort((a, b) => a.day - b.day);
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i], b = points[i + 1];
    if (day >= a.day && day <= b.day) return a.value + (b.value - a.value) * (day - a.day) / (b.day - a.day);
  }
  throw new Error(`Availability has no segment for day ${day}`);
};
const rounded = (value, digits = 3) => Number(value.toFixed(digits));
const modesByPair = Map.groupBy(modeRows, (mode) => mode.pairKey);
const daily = [];
for (const row of decisions.filter((decision) => decision.pass2Disposition === "numeric_private")) {
  for (let day = 0; day < 365; day += 1) {
    const date = new Date(Date.UTC(2027, 0, day + 1)).toISOString().slice(0, 10);
    const monthDay = date.slice(5);
    const closed =
      (row.pairKey === "chicago_il/yellow_perch" && monthDay >= "05-01" && monthDay <= "06-15") ||
      (row.pairKey === "alpena_mi/lake_trout" && monthDay >= "10-01" && monthDay <= "12-31");
    const candidates = modesByPair.get(row.pairKey).map((mode) => {
      const availability = availabilityAt(mode.availabilityKnots, day);
      return { mode, availability, seasonalPotential: 1 + (mode.fisheryStrength - 1) * availability };
    });
    const winner = candidates.reduce((best, candidate) => candidate.seasonalPotential > best.seasonalPotential ? candidate : best);
    if (closed) {
      daily.push({ date, pairKey: row.pairKey, cityId: row.cityId, speciesId: row.speciesId, legalStatus: "species_closed", winningMode: "", fisheryStrength: "", seasonalAvailability: "", seasonalPotential: "", scoreThermalFit0: "", scoreThermalFitHalf: "", scoreThermalFit1: "" });
      continue;
    }
    const potential = winner.seasonalPotential;
    daily.push({
      date, pairKey: row.pairKey, cityId: row.cityId, speciesId: row.speciesId, legalStatus: "open",
      winningMode: winner.mode.modeId, fisheryStrength: winner.mode.fisheryStrength,
      seasonalAvailability: rounded(winner.availability), seasonalPotential: rounded(potential),
      scoreThermalFit0: rounded(1 + (potential - 1) * 0.30),
      scoreThermalFitHalf: rounded(1 + (potential - 1) * 0.65),
      scoreThermalFit1: rounded(potential),
    });
  }
}

let invariantChecks = 0;
for (const row of daily) {
  if (row.legalStatus === "species_closed") {
    if (row.scoreThermalFit1 !== "") throw new Error(`Closed row has score ${row.pairKey}/${row.date}`);
    continue;
  }
  const pairF = approved[row.pairKey].strength;
  const values = [row.scoreThermalFit0, row.scoreThermalFitHalf, row.scoreThermalFit1, row.seasonalPotential, pairF];
  if (!(1 <= values[0] && values[0] <= values[1] && values[1] <= values[2] && values[2] <= values[3] + 0.001 && values[3] <= values[4] + 0.001 && values[4] <= 10)) throw new Error(`Invariant failure ${row.pairKey}/${row.date}: ${values}`);
  invariantChecks += 5;
}

const summaries = [];
const checkpoints = [];
for (const row of decisions.filter((decision) => decision.pass2Disposition === "numeric_private")) {
  const rows = daily.filter((dailyRow) => dailyRow.pairKey === row.pairKey);
  const open = rows.filter((dailyRow) => dailyRow.legalStatus === "open");
  const peak = open.reduce((best, dailyRow) => dailyRow.scoreThermalFit1 > best.scoreThermalFit1 ? dailyRow : best);
  const jan1 = rows[0], dec31 = rows.at(-1);
  summaries.push({
    pairKey: row.pairKey, cityId: row.cityId, cityName: row.cityName, speciesId: row.speciesId,
    speciesName: speciesNames[row.speciesId], evidenceGrade: row.evidenceGrade,
    peakFisheryStrength: row.peakFisheryStrength, idealPeakDate: peak.date, peakMode: peak.winningMode,
    excellentDaysAtIdealT: open.filter((dailyRow) => dailyRow.scoreThermalFit1 >= 8).length,
    goodDaysAtIdealT: open.filter((dailyRow) => dailyRow.scoreThermalFit1 >= 7).length,
    shoulderDaysAtIdealT: open.filter((dailyRow) => dailyRow.scoreThermalFit1 >= 3 && dailyRow.scoreThermalFit1 < 7).length,
    floorDaysAtIdealT: open.filter((dailyRow) => dailyRow.scoreThermalFit1 < 2).length,
    closedDays: rows.length - open.length,
    decemberJanuarySeamDelta: dec31.legalStatus === "open" && jan1.legalStatus === "open"
      ? rounded(Math.abs(Number(dec31.scoreThermalFit1) - Number(jan1.scoreThermalFit1)))
      : 0,
  });
  for (let month = 1; month <= 12; month += 1) {
    const date = `2027-${String(month).padStart(2, "0")}-15`;
    checkpoints.push(rows.find((dailyRow) => dailyRow.date === date));
  }
}
if (daily.length !== 55 * 365) throw new Error(`Expected 20,075 daily rows, found ${daily.length}`);
if (summaries.some((row) => row.decemberJanuarySeamDelta > 0.001)) throw new Error("December/January seam discontinuity");

// Quantitative port summaries use Catch only. Matched hours are all-species effort in the same enumerated port/month/year strata.
const raw = parseCsvSimple(fs.readFileSync(path.join(pass1Dir, "michigan-pier-dock-raw.csv"), "utf8"));
const portByCity = { muskegon_mi: "MUSKEGON", whitehall_mi: "WHITEHALL-MONTAGUE", alpena_mi: "ALPENA" };
const dashboardSpecies = {
  chinook_salmon: "Chinook Salmon", coho_salmon: "Coho Salmon", steelhead: "Steelhead", brown_trout: "Brown Trout",
  lake_trout: "Lean Lake Trout", walleye: "Walleye", smallmouth_bass: "Smallmouth Bass", freshwater_drum: "Drum",
  yellow_perch: "Yellow Perch", lake_whitefish: "Lake Whitefish", round_whitefish: "Round Whitefish",
  channel_catfish: "Channel Catfish", largemouth_bass: "Largemouth Bass", atlantic_salmon: "Atlantic Salmon",
  northern_pike: "Northern Pike", white_perch: "White Perch", white_bass: "White Bass", bluegill: "Bluegill",
};
const quantitative = [];
for (const [cityId, port] of Object.entries(portByCity)) {
  for (const [speciesId, dashboardName] of Object.entries(dashboardSpecies)) {
    for (const period of [
      { name: "full_export", min: -Infinity, max: Infinity },
      { name: "modern_2012_2022_excluding_2020", min: 2012, max: 2022 },
      { name: "recent_2018_2022_excluding_2020", min: 2018, max: 2022 },
    ]) {
      const catches = raw.filter((row) => row.port === port && row.species === dashboardName && row.estimate_type === "Catch" && Number(row.year) >= period.min && Number(row.year) <= period.max && Number(row.year) !== 2020);
      const hoursByStratum = new Map(raw.filter((row) => row.port === port && row.estimate_type === "Angler Hours").map((row) => [`${row.year}-${row.month}`, Number(row.estimate)]));
      const catchEstimate = catches.reduce((sum, row) => sum + Number(row.estimate), 0);
      const matchedHours = catches.reduce((sum, row) => sum + (hoursByStratum.get(`${row.year}-${row.month}`) ?? 0), 0);
      const positive = catches.filter((row) => Number(row.estimate) > 0);
      quantitative.push({
        cityId, port, speciesId, dashboardSpecies: dashboardName, period: period.name,
        catchEstimate: rounded(catchEstimate, 1), matchedAllSpeciesHours: rounded(matchedHours, 1),
        catchPer1000MatchedAllSpeciesHours: matchedHours > 0 ? rounded(catchEstimate * 1000 / matchedHours, 4) : "",
        positiveMonthYearStrata: positive.length, enumeratedMonthYearStrata: catches.length,
        positiveYears: new Set(positive.map((row) => row.year)).size,
        limitation: "Ordinal recurrence/magnitude anchor only; matched hours are all-species effort, not directed-effort CPUE. Port and Pier/Dock can pool structures.",
      });
    }
  }
}

const rankingRows = allCalibrationRows.map((row) => ({ ...row, speciesName: speciesNames[row.speciesId] ?? row.speciesId })).sort((a, b) => a.speciesId.localeCompare(b.speciesId) || b.peak - a.peak || a.cityName.localeCompare(b.cityName));
let lastSpecies = "", rank = 0;
for (const row of rankingRows) { if (row.speciesId !== lastSpecies) { lastSpecies = row.speciesId; rank = 0; } row.rank = ++rank; }

const dueDiligenceRows = decisions.map((row) => {
  const calibration = approved[row.pairKey];
  const promoted = ["alpena_mi/atlantic_salmon", "alpena_mi/coho_salmon", "alpena_mi/steelhead", "alpena_mi/lake_trout"].includes(row.pairKey);
  const previousPeak = calibration && !promoted ? (preDueDiligenceStrengths[row.pairKey] ?? calibration.strength) : "";
  const auditedPeak = calibration?.strength ?? "";
  return {
    pairKey: row.pairKey,
    cityId: row.cityId,
    speciesId: row.speciesId,
    disposition: row.pass2Disposition,
    evidenceGrade: row.evidenceGrade,
    previousPeak,
    auditedPeak,
    outcome: calibration ? (promoted ? "promoted_from_hold" : previousPeak === auditedPeak ? "retained" : "revised") : "retained_unscored",
    weakerOrEqualAnchor: row.anchorPlacement?.weakerOrEqual ? `${row.anchorPlacement.weakerOrEqual.cityName} ${row.anchorPlacement.weakerOrEqual.peak}` : "",
    strongerOrEqualAnchor: row.anchorPlacement?.strongerOrEqual ? `${row.anchorPlacement.strongerOrEqual.cityName} ${row.anchorPlacement.strongerOrEqual.peak}` : "",
    finding: row.calibrationRationale,
  };
});

const decisionOutput = {
  schemaVersion: "piercast-chicago-alpena-pass2-pair-decisions-v1", reviewedAt,
  status: "complete_private_research_only", cityCount: 5, speciesCount: 19, decisionCount: 95,
  dispositionCounts,
  policy: {
    numeric: "Grade A or B recurring intentional covered-structure/port opportunity with defensible magnitude and annual shape.",
    hold: "Grade C lead remains unscored. No placeholder score is allowed.",
    exclude: "Grade D/mismatched evidence remains unscored and does not mean biological absence.",
    confidence: "Evidence grade never multiplies fishery strength, seasonal availability, temperature suitability, or final score.",
  }, decisions,
};
const calibrationOutput = {
  schemaVersion: "piercast-chicago-alpena-pass2-mode-calibrations-v1", reviewedAt,
  status: "complete_private_shadow_only", ratingEnabled: false, publicEnabled: false,
  formula: { seasonalPotential: "1 + (F - 1) * A", score: "clamp(1, 10, 1 + (seasonalPotential - 1) * (0.30 + 0.70 * T))", modePolicy: "maximum seasonalPotential wins; modes never stack" },
  numericPairCount: 55, modeCount: modeRows.length, modes: modeRows,
};

const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const writeCsv = (name, rows, columns) => fs.writeFileSync(path.join(dir, name), [columns.join(","), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))].join("\n") + "\n");
fs.writeFileSync(path.join(dir, "pair-decisions.json"), JSON.stringify(decisionOutput, null, 2) + "\n");
fs.writeFileSync(path.join(dir, "private-mode-calibrations.json"), JSON.stringify(calibrationOutput, null, 2) + "\n");
fs.writeFileSync(path.join(dir, "source-ledger.json"), JSON.stringify({ ...ledger, schemaVersion: "piercast-chicago-alpena-pass2-source-ledger-v1", inheritedFrom: "../chicago-alpena-2026-09-pass1/source-ledger.json", pass2Use: "External evidence ledger for all pair admissions, holds, exclusions, magnitude decisions, seasonal modes, access context, and regulation gates." }, null, 2) + "\n");
fs.writeFileSync(path.join(dir, "calibration-anchors.json"), JSON.stringify({ schemaVersion: "piercast-chicago-alpena-pass2-anchors-v1", reviewedAt, baselineArtifacts: ["../all-city-common-species-audit-2026-09/cross-city-rankings.csv", "../michigan-all-scored-species-audit-2026-09/michigan-species-rankings.csv"], anchors }, null, 2) + "\n");
writeCsv("due-diligence-review.csv", dueDiligenceRows, ["pairKey", "cityId", "speciesId", "disposition", "evidenceGrade", "previousPeak", "auditedPeak", "outcome", "weakerOrEqualAnchor", "strongerOrEqualAnchor", "finding"]);
writeCsv("full-year-daily-audit.csv", daily, ["date", "pairKey", "cityId", "speciesId", "legalStatus", "winningMode", "fisheryStrength", "seasonalAvailability", "seasonalPotential", "scoreThermalFit0", "scoreThermalFitHalf", "scoreThermalFit1"]);
writeCsv("score-summary.csv", summaries, ["pairKey", "cityId", "cityName", "speciesId", "speciesName", "evidenceGrade", "peakFisheryStrength", "idealPeakDate", "peakMode", "excellentDaysAtIdealT", "goodDaysAtIdealT", "shoulderDaysAtIdealT", "floorDaysAtIdealT", "closedDays", "decemberJanuarySeamDelta"]);
writeCsv("monthly-checkpoints.csv", checkpoints, ["date", "pairKey", "cityId", "speciesId", "legalStatus", "winningMode", "fisheryStrength", "seasonalAvailability", "seasonalPotential", "scoreThermalFit0", "scoreThermalFitHalf", "scoreThermalFit1"]);
writeCsv("all-species-peak-matrix.csv", decisions.map((row) => ({ cityId: row.cityId, cityName: row.cityName, speciesId: row.speciesId, speciesName: speciesNames[row.speciesId], disposition: row.pass2Disposition, evidenceGrade: row.evidenceGrade, annualPeakScore: row.peakFisheryStrength ?? "", status: row.peakFisheryStrength == null ? "UNSCORED" : "PRIVATE_NUMERIC" })), ["cityId", "cityName", "speciesId", "speciesName", "disposition", "evidenceGrade", "annualPeakScore", "status"]);
writeCsv("research-holds-and-exclusions.csv", decisions.filter((row) => row.pass2Disposition !== "numeric_private").map((row) => ({ pairKey: row.pairKey, cityId: row.cityId, speciesId: row.speciesId, disposition: row.pass2Disposition, evidenceGrade: row.evidenceGrade, reason: row.calibrationRationale, nextEvidence: row.nextEvidence })), ["pairKey", "cityId", "speciesId", "disposition", "evidenceGrade", "reason", "nextEvidence"]);
writeCsv("cross-city-rankings.csv", rankingRows, ["speciesId", "speciesName", "rank", "cityId", "cityName", "pairKey", "peak", "cohort"]);
writeCsv("michigan-quantitative-calibration.csv", quantitative, ["cityId", "port", "speciesId", "dashboardSpecies", "period", "catchEstimate", "matchedAllSpeciesHours", "catchPer1000MatchedAllSpeciesHours", "positiveMonthYearStrata", "enumeratedMonthYearStrata", "positiveYears", "limitation"]);

const validation = {
  schemaVersion: "piercast-chicago-alpena-pass2-validation-v1", validatedAt: reviewedAt, status: "pass",
  checks: {
    cityCount: 5, speciesCount: 19, uniquePairDecisions: decisions.length,
    dispositionCounts, numericPairCount: Object.keys(approved).length, modeCount: modeRows.length,
    dailyRows: daily.length, scoreEvaluations: daily.filter((row) => row.legalStatus === "open").length * 3,
    formulaInvariantComparisons: invariantChecks,
    chicagoPerchClosedDays: daily.filter((row) => row.pairKey === "chicago_il/yellow_perch" && row.legalStatus === "species_closed").length,
    alpenaLakeTroutClosedDays: daily.filter((row) => row.pairKey === "alpena_mi/lake_trout" && row.legalStatus === "species_closed").length,
    maximumDecemberJanuarySeamDelta: Math.max(...summaries.map((row) => row.decemberJanuarySeamDelta)),
    allEvidenceIdsResolve: true, allModeStrengthsWithin2_1And10: true, allAvailabilityWithin0And1: true,
    allScoresWithin1AndSeasonalPotentialAndF: true, temperatureMonotonicAt0Half1: true, modesDoNotStack: true,
    scoringOrRuntimeCodeChanged: false, publicVisibilityChanged: false,
  },
};
fs.writeFileSync(path.join(dir, "validation-report.json"), JSON.stringify(validation, null, 2) + "\n");
console.log(JSON.stringify({ reviewedAt, ...validation.checks }, null, 2));
