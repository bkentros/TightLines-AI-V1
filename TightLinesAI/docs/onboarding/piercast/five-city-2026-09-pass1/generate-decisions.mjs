// Run: node docs/onboarding/piercast/five-city-2026-09-pass1/generate-decisions.mjs
// Research dispositions only. No score or runtime import is produced here.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const species = [
  "chinook_salmon", "coho_salmon", "steelhead", "brown_trout",
  "lake_trout", "walleye", "smallmouth_bass", "freshwater_drum",
  "yellow_perch", "lake_whitefish", "round_whitefish", "channel_catfish",
  "largemouth_bass", "atlantic_salmon", "northern_pike", "burbot",
  "white_perch", "white_bass", "bluegill",
];

const row = (decision, claim, sources, nextEvidence) => ({
  decision,
  numericAdmission: "not_approved",
  claim,
  sourceIds: sources,
  nextEvidence,
});
const A = (claim, sources, nextEvidence) => row("advance", claim, sources, nextEvidence);
const H = (claim, sources, nextEvidence) => row("hold", claim, sources, nextEvidence);
const X = (claim, sources) => row("exclude", claim, sources, "Reopen only for a new, recurring, named city-pier target record.");

const cities = {
  two_rivers_wi: {
    name: "Two Rivers, WI",
    accessStatus: "documented_public_approach; current pier signage not verified",
    defaultSources: ["WI_ACCESS_2023", "WI_WEEKLY_2026_09_07", "TWO_RIVERS_PARKS_2024"],
    decisions: {
      chinook_salmon: A("A local 2019 outdoor report names a Chinook taken from the Two Rivers piers; Manitowoc County pier Chinook also recur. This establishes a research candidate, not a current catch rate.", ["TWO_RIVERS_OUTDOOR_2019", "WI_CREEL_COUNTY_2024", "WI_WEEKLY_2026_09_07"], "Obtain current Two Rivers harbor-pier Chinook target/catch observations and site-level seasonal effort."),
      coho_salmon: A("Manitowoc County pier coho recur and coho are an established regional shore salmonid; the county totals cannot allocate the catch between Two Rivers and Manitowoc.", ["WI_CREEL_COUNTY_2024", "UW_SEA_GRANT_WI_1981"], "Obtain Two Rivers pier coho target/catch records and magnitude, especially spring and fall."),
      steelhead: A("DNR associates rainbow trout with Two Rivers harbor pier/shore access; county pier rainbow harvest gives wider mode recurrence.", ["WI_ACCESS_2023", "WI_CREEL_COUNTY_2024", "TWO_RIVERS_PARKS_2024"], "Separate lake-run rainbow from brown in local pier interviews and document the spring/fall window and strength."),
      brown_trout: A("DNR associates brown trout with Two Rivers harbor pier/shore access; county pier brown harvest recurs.", ["WI_ACCESS_2023", "WI_CREEL_COUNTY_2024", "TWO_RIVERS_PARKS_2024"], "Obtain species-separated Two Rivers pier interviews and monthly effort to calibrate magnitude."),
      smallmouth_bass: H("DNR lists smallmouth on the West Twin River at Veterans Park, a separate river location, not the covered harbor pier.", ["WI_ACCESS_2023"], "A named Two Rivers harbor-pier smallmouth target series, distinct from Veterans Park."),
      northern_pike: H("Pike are a 2026 Manitowoc County pier catch, but no Two Rivers-specific pier record was found.", ["WI_WEEKLY_2026_09_07"], "Two Rivers harbor-pier pike target/catch recurrence."),
      lake_trout: A("Historical Manitowoc County pier lake-trout harvest recurs, including 2015 and 2019, although 2022-24 estimates are zero. County results cannot separate Two Rivers and Manitowoc.", ["WI_CREEL_COUNTY_2024"], "Find direct recent Two Rivers pier lake-trout records and calibrate a likely weak, seasonal opportunity; do not transfer charter harvest."),
      yellow_perch: H("No Two Rivers pier-specific perch series was found; regional pier perch harvest makes this worth checking rather than declaring absence.", ["WI_CREEL_TIMING_2024"], "Named Two Rivers harbor or pier perch catches in multiple periods."),
    },
  },
  kewaunee_wi: {
    name: "Kewaunee, WI",
    accessStatus: "south_pier_pedestrian_access_supported; current fishing signage not verified",
    defaultSources: ["WI_ACCESS_2023", "WI_WEEKLY_2026_09_07", "KEWAUNEE_PARKS_2025"],
    decisions: {
      chinook_salmon: A("DNR records Kewaunee harbor/pier salmon targeting and Chinook in the same local paragraph; county pier Chinook harvest recurs.", ["WI_WEEKLY_2026_09_07", "WI_CREEL_COUNTY_2024", "KEWAUNEE_PARKS_2025"], "Separate south lighthouse pier from inner harbor and boats in site-level Chinook interviews; quantify effort/season."),
      coho_salmon: A("Kewaunee harbor/pier salmon targeting and recurring county pier coho justify season research; species-specific city-pier strength remains unquantified.", ["WI_CREEL_COUNTY_2024", "WI_WEEKLY_2026_09_07"], "Separate Kewaunee south-pier coho from Algoma and measure spring/fall effort."),
      steelhead: A("Kewaunee harbor/pier trout targeting, county pier rainbow recurrence, and the agency's description of regional shore rainbow fishing justify research.", ["WI_CREEL_COUNTY_2024", "WI_WEEKLY_2026_09_07", "UW_SEA_GRANT_WI_1981"], "Species-specific Kewaunee south-pier rainbow/steelhead target records and seasonal effort."),
      brown_trout: A("DNR specifically associates brown trout with Kewaunee river-mouth breakwall access; county pier brown harvest recurs.", ["WI_ACCESS_2023", "WI_CREEL_COUNTY_2024", "KEWAUNEE_PARKS_2025"], "South-pier versus inner-harbor brown-trout observations and month-level effort."),
      smallmouth_bass: A("A 2010 outdoor report compiled from DNR and private observations names smallmouth caught at the Kewaunee pier; modern recurrence is unverified.", ["MANITOWOC_OUTDOOR_2010", "WI_ACCESS_2023"], "Find modern Kewaunee south-pier smallmouth targeting and season strength."),
      northern_pike: A("DNR names pike at the Kewaunee river-mouth breakwall. This is enough for research, though not yet a numeric score.", ["WI_ACCESS_2023"], "Repeat named-pier pike catch/target reports and determine seasonal strength."),
      lake_trout: A("Kewaunee County pier lake-trout harvest has positive historical years, including 2012, 2015 and 2016; 2022-24 estimates are zero and the two county ports are pooled.", ["WI_CREEL_COUNTY_2024", "UW_SEA_GRANT_WI_1981"], "Find direct recent Kewaunee pier lake-trout catches and estimate a cautious seasonal magnitude."),
      yellow_perch: H("No Kewaunee south-pier perch series was found; statewide and countywide perch records are not an exact-city pier record.", ["WI_CREEL_TIMING_2024"], "Named Kewaunee south-pier or Harbor Point perch targeting in repeated periods."),
    },
  },
  algoma_wi: {
    name: "Algoma, WI",
    accessStatus: "construction_hold; obtain current segment-specific USACE/city clearance",
    defaultSources: ["WI_ACCESS_2023", "WI_WEEKLY_2026_09_07", "ALGOMA_USACE_STATUS", "ALGOMA_USACE_EA"],
    decisions: {
      chinook_salmon: A("Algoma pier anglers targeted salmon in September 2026, and Kewaunee County pier Chinook recur. Species-separated Algoma magnitude remains unresolved.", ["WI_WEEKLY_2026_09_07", "WI_CREEL_COUNTY_2024"], "Find Algoma pier Chinook interviews and seasonal effort; retain construction status as report metadata."),
      coho_salmon: A("Algoma pier salmon targeting and recurring county pier coho justify research, although the county estimates pool Algoma with Kewaunee.", ["WI_WEEKLY_2026_09_07", "WI_CREEL_COUNTY_2024"], "Find Algoma pier coho interviews, especially spring, and estimate site-level strength."),
      steelhead: A("DNR lists rainbow trout at Algoma's Ahnapee mouth breakwall; a historical outdoor report names a south-pier rainbow, while county pier rainbow harvest and current trout targeting corroborate.", ["WI_ACCESS_2023", "MANITOWOC_OUTDOOR_2010", "WI_CREEL_COUNTY_2024", "WI_WEEKLY_2026_09_07"], "Obtain modern Algoma pier species-specific and seasonal rainbow/steelhead interviews; record construction separately."),
      brown_trout: A("Exact-city pier trout targeting, Algoma's nearby brown-trout listing, and recurring county pier brown harvest warrant research; none isolates breakwall brown catch.", ["WI_ACCESS_2023", "WI_WEEKLY_2026_09_07", "WI_CREEL_COUNTY_2024"], "Separate Algoma breakwall brown trout from Olson Park and estimate season and strength."),
      smallmouth_bass: H("September 2026 smallmouth catch is reported for surveyed Ahnapee River anglers, not explicitly the pier.", ["WI_WEEKLY_2026_09_07"], "Named breakwall smallmouth target records at an open segment."),
      yellow_perch: H("September 2026 perch anglers were on the Ahnapee River; the pier passage only says trout/salmon.", ["WI_WEEKLY_2026_09_07"], "Named open-pier yellow-perch targeting and repeat catches."),
      northern_pike: A("DNR identifies pike at the Algoma river-mouth breakwall, enough to research its season and strength.", ["WI_ACCESS_2023"], "Find repeat Algoma breakwall pike catch/target evidence; retain construction status separately."),
      lake_trout: A("Kewaunee County pier lake-trout harvest is positive in several historical years, including 2012, 2015 and 2016, but the county pools Algoma with Kewaunee and 2022-24 estimates are zero.", ["WI_CREEL_COUNTY_2024"], "Find direct recent Algoma pier lake-trout records and calibrate a likely weak seasonal opportunity."),
    },
  },
  manitowoc_wi: {
    name: "Manitowoc, WI",
    accessStatus: "public_Lighthouse_Park_fishing_supported; exact DNR Lakeview pier approach unresolved",
    defaultSources: ["WI_ACCESS_2023", "WI_WEEKLY_2026_09_07", "MANITOWOC_LIGHTHOUSE_PARK"],
    decisions: {
      chinook_salmon: A("Manitowoc County piers produced about ten Chinook in a 2026 field week and county pier Chinook recur; a historical local report also names Manitowoc south-pier kings.", ["WI_WEEKLY_2026_09_07", "WI_CREEL_COUNTY_2024", "MANITOWOC_OUTDOOR_2010"], "Isolate Manitowoc public-pier Chinook effort from Two Rivers and update historical season evidence."),
      coho_salmon: A("County pier coho harvest recurs and historical UW Sea Grant overview names Manitowoc coho in a mixed breakwater/stream/trolling fishery; score magnitude needs mode separation.", ["WI_CREEL_COUNTY_2024", "UW_SEA_GRANT_WI_1981"], "Find Manitowoc public-pier spring coho observations and effort separate from Two Rivers."),
      steelhead: A("DNR names rainbow trout at Manitowoc Marina pier and county pier rainbow harvest recurs; the grouped guide row is research evidence, not a score.", ["WI_ACCESS_2023", "WI_CREEL_COUNTY_2024"], "Species-separated Manitowoc pier interviews, season and effort."),
      brown_trout: A("DNR names brown trout at Manitowoc Marina pier and county pier brown harvest recurs; the grouped guide row is research evidence, not a score.", ["WI_ACCESS_2023", "WI_CREEL_COUNTY_2024"], "Species-separated Manitowoc pier interviews with effort and seasonal coverage."),
      smallmouth_bass: A("DNR names smallmouth at Manitowoc Marina pier access and 2026 county piers produced smallmouth.", ["WI_ACCESS_2023", "WI_WEEKLY_2026_09_07", "MANITOWOC_LIGHTHOUSE_PARK"], "Resolve exact pier point and obtain Manitowoc-specific repeated target/catch observations and seasonal effort."),
      northern_pike: A("DNR names pike at Manitowoc Marina pier access and 2026 county piers produced pike.", ["WI_ACCESS_2023", "WI_WEEKLY_2026_09_07", "MANITOWOC_LIGHTHOUSE_PARK"], "Resolve exact pier point and obtain repeated Manitowoc-specific pike target/catch observations."),
      lake_trout: A("Manitowoc County pier lake-trout estimates recur historically, including 2015 and 2019, while 2022-24 estimates are zero. This supports research, not a strong current score.", ["WI_CREEL_COUNTY_2024"], "Find direct recent Manitowoc pier lake-trout records and estimate seasonal strength separately from Two Rivers."),
      yellow_perch: A("A historical local outdoor report names perch fishing at Manitowoc harbor and south pier; currency and strength need confirmation.", ["MANITOWOC_OUTDOOR_2010"], "Find modern Manitowoc harbor/south-pier perch target and catch records by season."),
    },
  },
  waukegan_il: {
    name: "Waukegan, IL",
    accessStatus: "Government_Pier_public_approach_supported; current fishing and parking signs not verified",
    defaultSources: ["IL_DNR_SHORE_MAP", "IL_DNR_WAUKEGAN_2006", "IL_INHS_CREEL_2024", "WAUKEGAN_CITY_PIER_2019"],
    decisions: {
      chinook_salmon: A("An exact Government Pier specialist guide names spring and fall Chinook fishing; IDNR supports fall harbor salmon and harbor presence. Magnitude still needs pedestrian creel evidence.", ["WAUKEGAN_GOV_PIER_GUIDE", "IL_DNR_WAUKEGAN_2006", "IL_DNR_HARBOR_2025"], "Extract Waukegan pedestrian Chinook rows; exclude North Harbor snagging."),
      coho_salmon: A("IDNR explicitly names early-spring Waukegan Harbor coho; Waukegan pedestrian creel is a separately surveyed mode.", ["IL_DNR_WAUKEGAN_2006", "IL_INHS_CREEL_2024", "IL_DNR_SHORE_MAP"], "Extract Waukegan pedestrian coho harvest, target effort and seasonal rows from full INHS reports; check Government Pier fraction."),
      steelhead: A("An exact Government Pier specialist guide names steelhead in colder months and IDNR recognizes spring/fall shore rainbow fishing; score needs Waukegan pedestrian rows.", ["WAUKEGAN_GOV_PIER_GUIDE", "IL_DNR_LAKE_MICHIGAN_2026", "IL_DNR_HARBOR_2025"], "Extract Waukegan pedestrian steelhead/rainbow target rows and verify current guide timing."),
      brown_trout: A("IDNR explicitly describes Waukegan Harbor early-spring brown trout shore angling; 2024/25 South Harbor surveys corroborate fish presence.", ["IL_DNR_WAUKEGAN_2006", "IL_DNR_HARBOR_2024", "IL_DNR_HARBOR_2025"], "Extract Waukegan pedestrian brown-trout rows and separate Government Pier from other harbor shoreline."),
      smallmouth_bass: A("Repeated Waukegan South Harbor smallmouth detection plus IDNR's pier/riprap shore-fishing guidance justify research, but electrofishing CPUE is not angler CPUE.", ["IL_DNR_HARBOR_2024", "IL_DNR_HARBOR_2025", "IL_DNR_LAKE_MICHIGAN_2026"], "Find Government Pier or adjacent public breakwall target interviews and legal-season treatment."),
      freshwater_drum: H("Incidental harbor electrofishing and statewide summer shore guidance suggest possible drum, without Government Pier target recurrence.", ["IL_DNR_HARBOR_2024", "IL_DNR_HARBOR_2025"], "Government Pier drum target/catch series."),
      yellow_perch: A("IDNR names Waukegan Harbor perch; INHS says Waukegan supplied 55.4% of surveyed Illinois pedestrian perch harvest in 2023, though that harbor total is not Government Pier alone.", ["IL_DNR_WAUKEGAN_2006", "IL_DNR_SHORE_MAP", "IL_INHS_CREEL_2023", "WAUKEGAN_CITY_PIER_2019", "IL_DNR_RULES_2026"], "Extract multi-year Waukegan pedestrian perch effort/catch and Government Pier share; account for May 1–June 15 closure and population variability."),
      largemouth_bass: H("South Harbor electrofishing detects largemouth; no Government Pier intentional target series is established.", ["IL_DNR_HARBOR_2024", "IL_DNR_HARBOR_2025"], "Government Pier or adjacent legal public shore largemouth target/catch series."),
      bluegill: H("South Harbor electrofishing detects bluegill; this is presence rather than pier angler targeting.", ["IL_DNR_HARBOR_2024", "IL_DNR_HARBOR_2025"], "Government Pier bluegill target/catch series rather than marina-basin presence."),
      lake_trout: H("IDNR says lake trout can reach some shoreline structures in winter, but has not identified Government Pier as one; Waukegan Reef is offshore.", ["IL_DNR_LAKE_MICHIGAN_2026", "IL_DNR_SHORE_MAP"], "Find repeated Government Pier cold-season lake-trout catches and shore-specific effort before scoring."),
      lake_whitefish: H("Whitefish appear in Illinois Lake Michigan rules and Waukegan fish-consumption guidance, but neither establishes a Government Pier target.", ["IL_DNR_RULES_2026", "IL_WAUKEGAN_FISH_ADVISORY"], "Verify species-separated lake-whitefish pier catches and distinguish round whitefish."),
      round_whitefish: H("Illinois rules combine lake and round whitefish limits; no species-separated Government Pier record is established.", ["IL_DNR_RULES_2026"], "Verify exact Government Pier round-whitefish catches, distinct from lake whitefish."),
    },
  },
};

const whyNoTarget = {
  walleye: "No named city-pier recurring walleye target; lakewide or river/boat walleye evidence does not transfer.",
  freshwater_drum: "No named city-pier recurring drum target; incidental or wider-lake presence does not suffice.",
  yellow_perch: "No named city-pier recurring yellow-perch target; nearby river, boat, or statewide perch records do not transfer.",
  lake_whitefish: "No named city-pier recurring lake-whitefish target; open-lake presence is insufficient.",
  round_whitefish: "No named city-pier recurring round-whitefish target; species identity and fishing mode are unproven.",
  channel_catfish: "No named city-pier channel-catfish target; bullhead records are a different taxon.",
  largemouth_bass: "No named city-pier recurring largemouth-bass target; inland and marina-basin evidence cannot transfer.",
  atlantic_salmon: "No named city-pier recurring Atlantic-salmon target; occasional salmonid presence is insufficient.",
  burbot: "No named city-pier recurring burbot target; a different Great Lakes port cannot establish this location.",
  white_perch: "No named city-pier recurring white-perch target; incidental or countywide presence is insufficient.",
  white_bass: "No named city-pier recurring white-bass target; do not confuse white bass with white perch.",
  bluegill: "No named city-pier recurring bluegill target; a river or inland-pond record does not transfer.",
  lake_trout: "No named city-pier recurring lake-trout target; offshore or charter results cannot transfer.",
};

const sourceIds = new Set(JSON.parse(fs.readFileSync(path.join(dir, "source-ledger.json"), "utf8")).sources.map((s) => s.id));
const decisions = Object.entries(cities).flatMap(([cityId, city]) => species.map((speciesId) => {
  const result = city.decisions[speciesId] ?? X(whyNoTarget[speciesId] ?? "No recurring named city-pier target evidence in the reviewed primary sources.", city.defaultSources);
  for (const id of result.sourceIds) {
    if (!sourceIds.has(id)) throw new Error(`Unknown source ${id}`);
  }
  return { pairKey: `${cityId}/${speciesId}`, cityId, cityName: city.name, speciesId, accessStatus: city.accessStatus, ...result };
}));
if (decisions.length !== 95 || new Set(decisions.map((r) => r.pairKey)).size !== 95) throw new Error("Expected 95 unique decisions");
const output = {
  schemaVersion: "piercast-five-city-pass1-species-decisions-v1",
  reviewedAt: "2026-09-17",
  scoringStatus: "research_only_no_numeric_scores",
  rule: "Advance is a Pass 2 research candidate supported by local, county-pier, or corroborated regional shore evidence; it is not a numeric score or proof of a major fishery. Hold is an occurrence lead needing local mode evidence. Exclude means no credible local pier lead in reviewed sources, not species absence.",
  speciesCount: species.length,
  cityCount: Object.keys(cities).length,
  decisionCount: decisions.length,
  counts: Object.fromEntries(["advance", "hold", "exclude"].map((d) => [d, decisions.filter((r) => r.decision === d).length])),
  decisions,
};
fs.writeFileSync(path.join(dir, "species-decisions.json"), JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify({ decisions: output.decisionCount, counts: output.counts }));
