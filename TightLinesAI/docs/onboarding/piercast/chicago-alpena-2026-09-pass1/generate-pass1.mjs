// Run: node docs/onboarding/piercast/chicago-alpena-2026-09-pass1/generate-pass1.mjs
// Pass 1 research only. This script produces no score, runtime calibration, or public manifest.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const dir = path.dirname(fileURLToPath(import.meta.url));
const reviewedAt = "2026-09-18";
const species = [
  "chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "lake_trout",
  "walleye", "smallmouth_bass", "freshwater_drum", "yellow_perch", "lake_whitefish",
  "round_whitefish", "channel_catfish", "largemouth_bass", "atlantic_salmon",
  "northern_pike", "burbot", "white_perch", "white_bass", "bluegill",
];

const sourceLedger = JSON.parse(fs.readFileSync(path.join(dir, "source-ledger.json"), "utf8"));
const sourceIds = new Set(sourceLedger.sources.map((source) => source.id));
const requiredSourceFields = ["id", "publisher", "title", "published", "url", "geography", "mode", "claim", "use", "limitation", "sourceClass"];
if (sourceIds.size !== sourceLedger.sources.length) throw new Error("Duplicate source ID");
for (const source of sourceLedger.sources) {
  for (const field of requiredSourceFields) if (!source[field]) throw new Error(`Source ${source.id} is missing ${field}`);
  new URL(source.url);
}

const sites = {
  chicago_il: {
    name: "Chicago, Illinois",
    reportArea: "Two explicitly labeled subareas: Montrose Harbor fishing pier/Horseshoe/contiguous public harbor edge, and the legal north-side Navy Pier/Marina fishing area.",
    included: [
      "Montrose Harbor fishing pier west of the boat launch, Horseshoe, harbor mouth, and contiguous public wall where current signs permit fishing.",
      "North side of Navy Pier and the pass-controlled Navy Pier Marina fishing area when open.",
    ],
    excluded: [
      "Chicago's other harbors, beaches, 85th Street, Calumet Harbor, boats, charter trips, and offshore reefs.",
      "The south side of Navy Pier and any construction, security, or event closure zone.",
    ],
    ownershipAndRoute: "Chicago Park District governs lakefront fishing rules; Navy Pier Marina administers its seasonal pass area. Use the Montrose park approach or the currently posted Navy Pier fishing entrance.",
    currentGate: "Lakefront/harbor fishing is generally 6 a.m.-11 p.m.; closed-harbor docks require the winter pass from Nov. 15-Mar. 31. Navy Pier is north-side-only. Marina hours and construction routing are separately controlled.",
    verifyBeforeRelease: "Confirm Montrose winter-pass status, Navy Pier Marina season/hours, construction routing, and posted weather/security closures.",
    sourceIds: ["CHI_CPD_FISHING_AREAS", "CHI_CPD_MONTROSE_PIER", "CHI_NAVY_PASS", "IL_RULES_2026"],
  },
  michigan_city_in: {
    name: "Michigan City, Indiana",
    reportArea: "Washington Park East Pier/lighthouse pier, the immediate Washington Park basin edge, and the public DNR/Coast Guard inner-harbor edge only when explicitly labeled.",
    included: [
      "Walk-out East Pier at Washington Park and contiguous legal public basin edge.",
      "DNR/Coast Guard inner-harbor shore access as a separately labeled subarea.",
    ],
    excluded: [
      "Trail Creek upstream, the NIPSCO warm-water discharge, Port of Indiana, boats, charter trips, and beaches away from the covered pier/basin.",
    ],
    ownershipAndRoute: "The city owns the Washington Park pier/basin approach; Indiana DNR and the U.S. Coast Guard control the separately named inner-harbor access context.",
    currentGate: "Park hours, parking/beach fees, waves, ice, repairs, and posted closures control practical access.",
    verifyBeforeRelease: "Confirm East Pier opening, park hours/fees, lighthouse construction, and the precise legal inner-harbor route.",
    sourceIds: ["MC_CITY_WASHINGTON_PARK", "IN_DNR_LAKE_MICHIGAN", "IN_DNR_COHO_GUIDE", "IN_RULES_2026"],
  },
  muskegon_mi: {
    name: "Muskegon, Michigan",
    reportArea: "Lake Michigan outlet channel public walls/platforms, north fishing decks, and the public south-pier approach as separately labeled segments.",
    included: [
      "Public south-side channel wall/pier approach near 43.226771, -86.3375392.",
      "North-side accessible platforms near 43.231649, -86.333334 and the state-park channel walkway when officially open.",
    ],
    excluded: [
      "Muskegon River upstream, interior Muskegon Lake shore sites, Snug Harbor, boats, charter trips, and offshore Lake Michigan.",
    ],
    ownershipAndRoute: "The south and north segments have different approaches and managers; the DNR unit page supplies the exact channel routes and coordinates.",
    currentGate: "The state-park page still carries a north-walkway closure through Aug. 2026 and only anticipates a fall reopening. Treat the north segment as unverified until a live status check confirms it.",
    verifyBeforeRelease: "Obtain current state-park confirmation for the north walkway/decks and inspect posted channel and pier closures.",
    sourceIds: ["MI_DNR_CENTRAL_UNIT", "MUSKEGON_STATE_PARK", "MI_RULES_2026", "MI_WHITEFISH_HOOK_RULE"],
  },
  whitehall_mi: {
    name: "Whitehall, Michigan",
    reportArea: "White Lake outlet channel edge at Medbery Park and its contiguous legal public fishing frontage; city label retained for PierCast discovery.",
    included: [
      "Medbery Park north-channel frontage at 7340 Life Guard Road and its accessible fishing edge.",
    ],
    excluded: [
      "White Lake interior shore sites, White River upstream, the opposite channel side unless separately verified, boats, charters, and offshore Lake Michigan.",
    ],
    ownershipAndRoute: "The covered site is in White River Township, outside Whitehall city limits, and is owned by the City of Montague. The report must disclose that relationship.",
    currentGate: "Published park hours are 6 a.m.-11 p.m.; November hook restrictions apply in the named port water as defined by the current regulations.",
    verifyBeforeRelease: "Confirm Medbery Park hours, parking, posted channel closures, exact November rule boundary, and any seasonal restroom/access change.",
    sourceIds: ["MEDBERY_ACCESS", "MI_BETTER_WATERS", "MI_RULES_2026", "MI_WHITEFISH_HOOK_RULE"],
  },
  alpena_mi: {
    name: "Alpena, Michigan",
    reportArea: "Municipal breakwall and fishing platform adjacent to Bay View Park, plus contiguous legal Alpena Harbor edge only when separately labeled.",
    included: [
      "The lighted municipal breakwall walkway, fishing platform, and legal public harbor edge reached from Bay View Park.",
    ],
    excluded: [
      "The closed lighthouse tower, Thunder Bay open water, boats, charter trips, other Alpena shore parks, and Thunder Bay River upstream.",
    ],
    ownershipAndRoute: "Approach from Bay View Park near Prentiss Street/South Harbor Drive; lighthouse coordinates are approximately 45°03′37.23″N, 83°25′22.80″W.",
    currentGate: "Municipal harbor fishing is subject to posted rules, security, privacy, weather, and temporary closure controls.",
    verifyBeforeRelease: "Confirm current breakwall opening, lighting/railing condition, parking route, and posted marina/security restrictions.",
    sourceIds: ["ALPENA_BREAKWALL_ACCESS", "ALPENA_CITY_PLAN", "ALPENA_CITY_FISHING_RULE", "MI_RULES_2026"],
  },
};

const profiles = {
  chicago_il: {
    research_candidate: {
      chinook_salmon: ["CHI_INHS_CREEL_2024", "CHI_PARK_BAIT_2026"],
      coho_salmon: ["CHI_INHS_CREEL_2023", "CHI_INHS_CREEL_2024", "CHI_PARK_BAIT_2026"],
      steelhead: ["CHI_CPD_FISHING_AREAS", "CHI_PARK_BAIT_2026"],
      brown_trout: ["CHI_INHS_CREEL_2024", "CHI_PARK_BAIT_2026"],
      lake_trout: ["CHI_LAKE_TROUT_2023", "CHI_MWO_WINTER_2025", "CHI_IDNR_LAKE_MICHIGAN"],
      smallmouth_bass: ["CHI_CPD_FISHING_AREAS", "CHI_PARK_BAIT_2026"],
      freshwater_drum: ["CHI_CPD_FISHING_AREAS", "CHI_PARK_BAIT_2026"],
      yellow_perch: ["CHI_INHS_CREEL_2023", "CHI_INHS_CREEL_2024", "IL_RULES_2026"],
      largemouth_bass: ["CHI_CPD_FISHING_AREAS"],
      northern_pike: ["CHI_PARK_BAIT_2026"],
    },
    hold: {
      lake_whitefish: ["CHI_RARE_2017", "IL_RULES_2026"],
      channel_catfish: ["CHI_PARK_BAIT_2026"],
      burbot: ["CHI_RARE_2017"],
      white_bass: ["CHI_CPD_FISHING_AREAS"],
      bluegill: ["CHI_PARK_BAIT_2026"],
    },
    notes: {
      chinook_salmon: "Montrose pedestrian creel recorded Chinook in September 2024 and current Horseshoe reports recur in the fall.",
      coho_salmon: "Montrose has direct spring and fall coho creel evidence, with strong regional spring shore context.",
      steelhead: "Current Montrose reports name steelhead in the harbor; citywide agency guidance supports cold-season shore trout.",
      brown_trout: "Montrose pedestrian creel recorded brown trout in April and May 2024, corroborated by current shore reports.",
      lake_trout: "Navy Pier and the Chicago winter lakefront have repeated expert/specialist lake-trout reports; this winter opportunity requires Pass 2 quantification rather than a fall-only model.",
      yellow_perch: "Montrose summer and Navy Pier winter pedestrian data establish two major, distinct seasonal windows.",
      lake_whitefish: "An exact Montrose record fish is a credible occurrence, but no recurring target series was found.",
      burbot: "An exact Montrose state-record catch establishes occurrence only.",
      white_bass: "The city page's 'silver bass' wording is taxonomically ambiguous and cannot be treated as white-bass proof.",
    },
  },
  michigan_city_in: {
    research_candidate: {
      chinook_salmon: ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_SHORE_GUIDE", "IN_DNR_REPORT_2026_09"],
      coho_salmon: ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_COHO_GUIDE", "IN_DNR_REPORT_2026_09"],
      steelhead: ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_SHORE_GUIDE"],
      brown_trout: ["IN_DNR_COHO_GUIDE", "IN_DNR_SHORE_GUIDE"],
      smallmouth_bass: ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_SHORE_GUIDE"],
      yellow_perch: ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_SHORE_GUIDE"],
      lake_whitefish: ["IN_DNR_COHO_GUIDE"],
      largemouth_bass: ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_SHORE_GUIDE"],
      bluegill: ["IN_DNR_LAKE_MICHIGAN", "IN_DNR_SHORE_GUIDE"],
    },
    hold: {
      lake_trout: ["IN_DNR_SHORE_GUIDE", "IN_DNR_LAKE_MICHIGAN"],
      walleye: ["IN_DNR_LAKE_MICHIGAN"],
      freshwater_drum: ["IN_DNR_LAKE_MICHIGAN"],
      channel_catfish: ["IN_DNR_LAKE_MICHIGAN"],
    },
    notes: {
      chinook_salmon: "Agency guidance gives a May and mid-July-through-September pier window, and a current Michigan City shore report confirms September fish.",
      coho_salmon: "Washington Park and the inner harbor are named spring-coho sites, with March described as the most consistent shore month.",
      steelhead: "Agency guidance gives both a mid-June-to-mid-August Skamania pier window and a late-October-to-March winter-run window.",
      brown_trout: "The exact-site coho guide identifies brown trout as plausible bottom-rig catch, with broader pier timing support.",
      lake_trout: "The agency shore guide characterizes lake trout as a boat fishery; retain only as an occurrence lead pending repeat East Pier evidence.",
      lake_whitefish: "The exact-site coho guide names whitefish as possible bottom-rig catch; Pass 2 must establish recurrence and strength.",
      walleye: "Available agency shore evidence points to the separate NIPSCO discharge rather than Washington Park East Pier.",
      freshwater_drum: "Available agency shore evidence points to the separate NIPSCO discharge rather than Washington Park East Pier.",
      channel_catfish: "Available agency shore evidence points to the separate NIPSCO discharge rather than Washington Park East Pier.",
    },
  },
  muskegon_mi: {
    research_candidate: {
      chinook_salmon: ["MI_DNR_CENTRAL_UNIT", "MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      coho_salmon: ["MI_DNR_CENTRAL_UNIT", "MI_CREEL_DASHBOARD"],
      steelhead: ["MI_DNR_CENTRAL_UNIT", "MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      brown_trout: ["MI_DNR_CENTRAL_UNIT", "MI_CREEL_DASHBOARD"],
      lake_trout: ["MI_CREEL_DASHBOARD"],
      walleye: ["MI_DNR_CENTRAL_UNIT", "MI_CREEL_DASHBOARD"],
      smallmouth_bass: ["MI_DNR_CENTRAL_UNIT", "MUSKEGON_LAKE_SFR_2025", "MI_CREEL_DASHBOARD"],
      freshwater_drum: ["MI_DNR_CENTRAL_UNIT", "MI_CREEL_DASHBOARD"],
      yellow_perch: ["MI_DNR_CENTRAL_UNIT", "MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      lake_whitefish: ["MI_DNR_CENTRAL_UNIT", "MI_BETTER_WATERS", "MI_CREEL_DASHBOARD", "MI_WHITEFISH_HOOK_RULE"],
      round_whitefish: ["MI_CREEL_DASHBOARD"],
      channel_catfish: ["MI_DNR_CENTRAL_UNIT", "MI_CREEL_DASHBOARD"],
      largemouth_bass: ["MI_CREEL_DASHBOARD"],
      northern_pike: ["MI_CREEL_DASHBOARD"],
      white_perch: ["MI_CREEL_DASHBOARD"],
      bluegill: ["MI_CREEL_DASHBOARD"],
    },
    hold: { white_bass: ["MI_CREEL_DASHBOARD"] },
    notes: {
      lake_trout: "Port-level Pier/Dock estimates are positive only in 1993 and 2015; advance for careful Pass 2 testing as a sparse seasonal fishery, never as a presumed primary.",
      lake_whitefish: "Agency channel guidance and recent port estimates agree on a cold-season fishery; November sampling and regulation boundaries need special care.",
      round_whitefish: "Port Pier/Dock estimates recur historically and again in 2022, but species identity and magnitude need review.",
      white_perch: "Positive port Pier/Dock estimates recur from 2016 through 2020; exact structure allocation is unresolved.",
      white_bass: "Only 2017 and 2018 port Pier/Dock positives were found, insufficient for direct admission without current exact-segment support.",
    },
  },
  whitehall_mi: {
    research_candidate: {
      chinook_salmon: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      coho_salmon: ["MI_CREEL_DASHBOARD"],
      steelhead: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      brown_trout: ["MI_CREEL_DASHBOARD"],
      lake_trout: ["MI_CREEL_DASHBOARD"],
      walleye: ["MI_CREEL_DASHBOARD"],
      smallmouth_bass: ["MI_CREEL_DASHBOARD", "WHITE_LAKE_SFR_2024"],
      freshwater_drum: ["MI_CREEL_DASHBOARD"],
      yellow_perch: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      lake_whitefish: ["MI_BETTER_WATERS", "MI_WHITEFISH_HOOK_RULE", "MI_CREEL_DASHBOARD"],
      channel_catfish: ["MI_CREEL_DASHBOARD"],
      largemouth_bass: ["MI_CREEL_DASHBOARD", "WHITE_LAKE_SFR_2024"],
      northern_pike: ["MI_CREEL_DASHBOARD", "WHITE_LAKE_SFR_2024"],
      white_perch: ["MI_CREEL_DASHBOARD"],
      bluegill: ["MI_CREEL_DASHBOARD", "WHITE_LAKE_SFR_2024"],
    },
    hold: {
      atlantic_salmon: ["MI_CREEL_DASHBOARD"],
      round_whitefish: ["MI_CREEL_DASHBOARD"],
      white_bass: ["MI_CREEL_DASHBOARD"],
    },
    notes: {
      lake_trout: "Port Pier/Dock positives occur only in 2008 and 2015, so Pass 2 must test a weak, narrow opportunity.",
      lake_whitefish: "The agency names White Lake pier/channel waters for whitefish and protects the November fishery even though reviewed dashboard strata were zero in 2012 and 2018.",
      atlantic_salmon: "A single positive port estimate in 2001 is an occurrence lead, not a current fishery.",
      round_whitefish: "Port positives occur only in 2000 and 2005; current recurrence is unproven.",
      white_bass: "Only one positive port year, 2015, was found.",
      white_perch: "Two positive port years, 2016 and 2018, justify research but require exact Medbery confirmation.",
    },
  },
  alpena_mi: {
    research_candidate: {
      chinook_salmon: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      coho_salmon: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      steelhead: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      brown_trout: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      lake_trout: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      walleye: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      smallmouth_bass: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      freshwater_drum: ["MI_CREEL_DASHBOARD"],
      yellow_perch: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      lake_whitefish: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      atlantic_salmon: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
      northern_pike: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"],
    },
    hold: {
      channel_catfish: ["MI_CREEL_DASHBOARD"],
      largemouth_bass: ["MI_CREEL_DASHBOARD"],
      bluegill: ["MI_CREEL_DASHBOARD"],
    },
    notes: {
      atlantic_salmon: "The agency names Atlantic salmon for Alpena Harbor, while reviewed port Pier/Dock rows are explicit zeros; advance only to resolve that conflict in Pass 2.",
      coho_salmon: "The agency names coho for Alpena Harbor, while reviewed port Pier/Dock rows are explicit zeros; current exact-breakwall magnitude is unknown.",
      steelhead: "The agency names steelhead for Alpena Harbor, while reviewed port Pier/Dock rows are explicit zeros; current exact-breakwall magnitude is unknown.",
      lake_whitefish: "The agency names lake whitefish for Alpena Harbor, while reviewed port Pier/Dock rows are explicit zeros; current exact-breakwall magnitude is unknown.",
      lake_trout: "Agency harbor guidance is positive, but port Pier/Dock evidence has only one positive year (2007); treat as a priority sparse candidate.",
      freshwater_drum: "Positive port Pier/Dock estimates recur in 2012, 2013, and 2015, though the current agency harbor list omits drum.",
      channel_catfish: "Positive port estimates occur in 2012 and 2013 only and are not corroborated by the current named-harbor list.",
      largemouth_bass: "Positive port estimates occur in 2012 and 2020 only and are not corroborated by the current named-harbor list.",
      bluegill: "Only one positive port year, 2012, was found.",
    },
  },
};

const commonClaim = (cityId, speciesId, decision, ids) => {
  const profile = profiles[cityId];
  if (profile.notes?.[speciesId]) return profile.notes[speciesId];
  if (decision === "research_candidate") {
    if (ids.includes("MI_CREEL_DASHBOARD")) return "Positive port-level Pier/Dock estimates recur in the reviewed Michigan DNR export; exact structure, season, effort, and magnitude remain Pass 2 questions.";
    return "Named agency or recurring exact-area evidence supports this species as a Pass 2 research candidate; no numeric admission is implied.";
  }
  if (decision === "hold") return "A credible local occurrence or nearby-mode lead exists, but recurring intentional fishing at the covered structure is not yet established.";
  return "No credible recurring lead for the covered public structure was found in the reviewed sources. This is an evidence disposition, not a biological absence claim.";
};

const decisions = [];
for (const [cityId, site] of Object.entries(sites)) {
  for (const id of site.sourceIds) if (!sourceIds.has(id)) throw new Error(`Unknown site-boundary source ${id}`);
  const profile = profiles[cityId];
  for (const speciesId of species) {
    let decision = "exclude";
    let ids = site.sourceIds;
    if (profile.research_candidate[speciesId]) {
      decision = "research_candidate";
      ids = profile.research_candidate[speciesId];
    } else if (profile.hold[speciesId]) {
      decision = "hold";
      ids = profile.hold[speciesId];
    }
    for (const id of ids) if (!sourceIds.has(id)) throw new Error(`Unknown source ${id}`);
    decisions.push({
      pairKey: `${cityId}/${speciesId}`,
      cityId,
      cityName: site.name,
      speciesId,
      decision,
      evidenceStatus: decision === "research_candidate" ? "candidate_for_pass_2_quantification" : decision === "hold" ? "occurrence_lead_requires_more_evidence" : "no_reviewed_covered_structure_lead",
      numericAdmission: "not_assessed_in_pass_1",
      claim: commonClaim(cityId, speciesId, decision, ids),
      sourceIds: ids,
      nextEvidence: decision === "research_candidate"
        ? `Quantify covered-structure ${speciesId} season, intentional effort, catch recurrence, uncertainty, and mode transfer risk in Pass 2.`
        : decision === "hold"
          ? `Find repeated, current, species-specific ${speciesId} target/catch evidence at the covered structure before numeric consideration.`
          : `Reopen only if new covered-structure ${speciesId} evidence is found; do not interpret this row as proof of absence.`,
    });
  }
}

if (decisions.length !== 95 || new Set(decisions.map((row) => row.pairKey)).size !== 95) throw new Error("Expected 95 unique city/species decisions");
const counts = Object.fromEntries(["research_candidate", "hold", "exclude"].map((d) => [d, decisions.filter((row) => row.decision === d).length]));
if (JSON.stringify(counts) !== JSON.stringify({ research_candidate: 62, hold: 16, exclude: 17 })) throw new Error(`Unexpected decision counts ${JSON.stringify(counts)}`);

const speciesDecisions = {
  schemaVersion: "piercast-five-city-pass1-species-decisions-v1",
  reviewedAt,
  scoringStatus: "research_only_no_numeric_scores",
  rule: "Research candidate means Pass 2 should quantify the opportunity; it is not admission, a score, or a claim that the species is primary. Hold means a credible occurrence or nearby-mode lead needs stronger covered-structure evidence. Exclude means no reviewed lead for the covered structure, not species absence.",
  cityCount: Object.keys(sites).length,
  speciesCount: species.length,
  decisionCount: decisions.length,
  counts,
  decisions,
};

const outOfCatalog = {
  schemaVersion: "piercast-pass1-out-of-catalog-leads-v1",
  reviewedAt,
  scoringStatus: "leads_only_no_catalog_or_runtime_change",
  leads: [
    { cityId: "chicago_il", species: "rainbow_smelt", decision: "research_candidate", mode: "seasonal dip-netting, not rod-and-reel", claim: "Chicago and Illinois rules provide a distinct spring smelt season; model only if PierCast supports this method as a separate opportunity.", sourceIds: ["CHI_CPD_FISHING_AREAS", "IL_RULES_2026"] },
    { cityId: "chicago_il", species: "rock_bass_crappie_carp_complex", decision: "hold", mode: "shore/harbor", claim: "Broad city harbor references create leads, but exact covered-site recurrence was not established.", sourceIds: ["CHI_CPD_FISHING_AREAS"] },
    { cityId: "michigan_city_in", species: "rock_bass", decision: "research_candidate", mode: "pier/marina", claim: "Indiana's agency shore guide describes rock bass among common panfish at shore sites including Washington Park marina.", sourceIds: ["IN_DNR_SHORE_GUIDE"] },
    { cityId: "michigan_city_in", species: "pumpkinseed_and_other_sunfish", decision: "hold", mode: "pier/marina", claim: "Agency guidance supports a panfish complex, but species-separated recurrence needs confirmation.", sourceIds: ["IN_DNR_SHORE_GUIDE"] },
    { cityId: "muskegon_mi", species: "rock_bass_pumpkinseed_common_white_sucker_complex", decision: "hold", mode: "port Pier/Dock", claim: "The preserved port export contains additional taxa; exact channel-segment targeting needs Pass 2 review.", sourceIds: ["MI_CREEL_DASHBOARD"] },
    { cityId: "whitehall_mi", species: "pink_salmon", decision: "hold", mode: "port Pier/Dock", claim: "Positive Whitehall-Montague estimates occur in 2000 and 2015, too sparse for catalog action without current Medbery evidence.", sourceIds: ["MI_CREEL_DASHBOARD"] },
    { cityId: "whitehall_mi", species: "rock_bass_pumpkinseed_sucker_complex", decision: "hold", mode: "port Pier/Dock", claim: "Port and lake-community evidence gives plausible leads, but exact channel recurrence remains unresolved.", sourceIds: ["MI_CREEL_DASHBOARD", "WHITE_LAKE_SFR_2024"] },
    { cityId: "alpena_mi", species: "rock_bass", decision: "research_candidate", mode: "harbor/Pier-Dock", claim: "The agency names rock bass for Alpena Harbor and the port Pier/Dock export has positive estimates in 2008 and 2012.", sourceIds: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"] },
    { cityId: "alpena_mi", species: "pink_salmon", decision: "hold", mode: "harbor/Pier-Dock", claim: "The agency names pink salmon for Alpena Harbor, but reviewed port Pier/Dock rows are zero; resolve current exact-breakwall evidence.", sourceIds: ["MI_BETTER_WATERS", "MI_CREEL_DASHBOARD"] }
  ]
};

for (const lead of outOfCatalog.leads) for (const id of lead.sourceIds) if (!sourceIds.has(id)) throw new Error(`Unknown source ${id}`);

const parseCsv = (text) => {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const keys = header.split(",");
  return lines.map((line) => Object.fromEntries(line.split(",").map((value, index) => [keys[index], value])));
};
const rawCreelBuffer = fs.readFileSync(path.join(dir, "michigan-pier-dock-raw.csv"));
const rawCreelSha256 = createHash("sha256").update(rawCreelBuffer).digest("hex");
if (rawCreelSha256 !== "d0c5e7ac925ec77066a6f6edee96e6fadb1c46fa2f4d0275a632e93f4d11c5da") throw new Error(`Unexpected raw Michigan checksum ${rawCreelSha256}`);
const rawCreel = parseCsv(rawCreelBuffer.toString("utf8"));
if (rawCreel.length !== 6253) throw new Error(`Expected 6,253 raw Michigan rows, found ${rawCreel.length}`);
const grouped = new Map();
for (const row of rawCreel) {
  if (!row.species || !["Catch", "Harvest"].includes(row.estimate_type)) continue;
  const key = `${row.port}\t${row.species}`;
  const group = grouped.get(key) ?? { port: row.port, species: row.species, catch: new Map(), harvest: new Map() };
  const bucket = row.estimate_type === "Catch" ? group.catch : group.harvest;
  const year = Number(row.year);
  bucket.set(year, (bucket.get(year) ?? 0) + Number(row.estimate));
  grouped.set(key, group);
}
const creelSummary = [...grouped.values()].map((group) => {
  const sampledYears = [...new Set([...group.catch.keys(), ...group.harvest.keys()])].sort((a, b) => a - b);
  const catchPositive = [...group.catch].filter(([, value]) => value > 0).map(([year]) => year).sort((a, b) => a - b);
  const harvestPositive = [...group.harvest].filter(([, value]) => value > 0).map(([year]) => year).sort((a, b) => a - b);
  const positiveYears = [...new Set([...catchPositive, ...harvestPositive])].sort((a, b) => a - b);
  const zeroYears = sampledYears.filter((year) => (group.catch.get(year) ?? 0) === 0 && (group.harvest.get(year) ?? 0) === 0);
  return {
    port: group.port,
    mode: "Pier/Dock",
    species: group.species,
    sampled_year_count: sampledYears.length,
    first_sampled_year: sampledYears.at(0) ?? "",
    latest_sampled_year: sampledYears.at(-1) ?? "",
    positive_year_count: positiveYears.length,
    first_positive_year: positiveYears.at(0) ?? "",
    latest_positive_year: positiveYears.at(-1) ?? "",
    positive_years: positiveYears.join(";"),
    explicit_zero_years: zeroYears.join(";"),
    note: "Positive means annual sum of dashboard Catch or Harvest estimates exceeded zero; explicit zero means sampled Catch/Harvest rows existed and summed to zero. Missing years are neither.",
  };
}).sort((a, b) => a.port.localeCompare(b.port) || a.species.localeCompare(b.species));

const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const toCsv = (rows, columns) => [columns.join(","), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))].join("\n") + "\n";
const matrixColumns = ["cityId", "cityName", "speciesId", "decision", "evidenceStatus", "numericAdmission", "claim", "sourceIds", "nextEvidence"];
const matrixRows = decisions.map((row) => ({ ...row, sourceIds: row.sourceIds.join(";") }));
const creelColumns = ["port", "mode", "species", "sampled_year_count", "first_sampled_year", "latest_sampled_year", "positive_year_count", "first_positive_year", "latest_positive_year", "positive_years", "explicit_zero_years", "note"];

fs.writeFileSync(path.join(dir, "site-boundaries.json"), JSON.stringify({ schemaVersion: "piercast-five-city-site-boundaries-v1", reviewedAt, sites }, null, 2) + "\n");
fs.writeFileSync(path.join(dir, "species-decisions.json"), JSON.stringify(speciesDecisions, null, 2) + "\n");
fs.writeFileSync(path.join(dir, "species-decision-matrix.csv"), toCsv(matrixRows, matrixColumns));
fs.writeFileSync(path.join(dir, "out-of-catalog-leads.json"), JSON.stringify(outOfCatalog, null, 2) + "\n");
fs.writeFileSync(path.join(dir, "michigan-pier-dock-evidence.csv"), toCsv(creelSummary, creelColumns));

const validation = {
  schemaVersion: "piercast-five-city-pass1-validation-v1",
  validatedAt: reviewedAt,
  status: "pass",
  checks: {
    uniqueSourceIds: sourceIds.size,
    completeSourceLedgerFields: requiredSourceFields,
    siteCount: Object.keys(sites).length,
    catalogSpeciesCount: species.length,
    uniqueCitySpeciesPairs: new Set(decisions.map((row) => row.pairKey)).size,
    decisionCounts: counts,
    allDecisionSourceIdsResolve: true,
    allBoundarySourceIdsResolve: true,
    scoringOrRuntimeOutputProduced: false,
    rawMichiganRows: rawCreel.length,
    rawMichiganSha256: rawCreelSha256,
    MichiganAggregateRows: creelSummary.length,
  },
};
fs.writeFileSync(path.join(dir, "validation-report.json"), JSON.stringify(validation, null, 2) + "\n");

console.log(JSON.stringify({
  reviewedAt,
  sources: sourceLedger.sources.length,
  sites: Object.keys(sites).length,
  species: species.length,
  decisions: decisions.length,
  counts,
  outOfCatalogLeads: outOfCatalog.leads.length,
  rawMichiganRows: rawCreel.length,
  MichiganAggregateRows: creelSummary.length,
}, null, 2));
