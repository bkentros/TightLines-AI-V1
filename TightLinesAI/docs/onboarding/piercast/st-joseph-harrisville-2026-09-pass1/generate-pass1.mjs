import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REVIEW_DATE = "2026-09-19";
const dir = path.dirname(fileURLToPath(import.meta.url));
const checkMode = process.argv.includes("--check");

const species = [
  "chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "lake_trout",
  "walleye", "smallmouth_bass", "freshwater_drum", "yellow_perch",
  "lake_whitefish", "round_whitefish", "channel_catfish", "largemouth_bass",
  "atlantic_salmon", "northern_pike", "burbot", "white_perch", "white_bass", "bluegill",
];
const cityDefs = [
  { id: "st_joseph_mi", name: "St. Joseph", ports: ["ST. JOSEPH", "ST JOSEPH", "ST.JOSEPH", "ST. JOSEPH-BENTON HARBOR", "ST.JOSEPH-BENTON HARBOR", "ST JOSEPH-BENTON HARBOR", "ST. JOSEPH/BENTON HARBOR", "ST.JOSEPH/BENTON HARBOR", "ST JOSEPH/BENTON HARBOR"] },
  { id: "south_haven_mi", name: "South Haven", ports: ["SOUTH HAVEN"] },
  { id: "holland_mi", name: "Holland", ports: ["HOLLAND"] },
  { id: "lexington_mi", name: "Lexington", ports: ["LEXINGTON"] },
  { id: "harrisville_mi", name: "Harrisville", ports: ["HARRISVILLE"] },
];
const display = Object.fromEntries(cityDefs.map((city) => [city.id, city.name]));

const aliases = {
  chinook_salmon: ["Chinook salmon", "king salmon"],
  coho_salmon: ["coho salmon", "silver salmon"],
  steelhead: ["steelhead", "rainbow trout", "Skamania"],
  brown_trout: ["brown trout"],
  lake_trout: ["lake trout", "lean lake trout", "laker"],
  walleye: ["walleye"],
  smallmouth_bass: ["smallmouth bass", "smallmouth", "sm bass"],
  freshwater_drum: ["freshwater drum", "drum", "sheepshead"],
  yellow_perch: ["yellow perch", "perch", "lake perch"],
  lake_whitefish: ["lake whitefish", "whitefish"],
  round_whitefish: ["round whitefish", "Menominee"],
  channel_catfish: ["channel catfish", "catfish"],
  largemouth_bass: ["largemouth bass"],
  atlantic_salmon: ["Atlantic salmon"],
  northern_pike: ["northern pike", "pike"],
  burbot: ["burbot", "lawyer"],
  white_perch: ["white perch"],
  white_bass: ["white bass"],
  bluegill: ["bluegill"],
};

function source(id, publisher, title, publicationDate, url, geography, mode, season, claim, use, limitations, grade) {
  return {
    id, url, publisher, title,
    publication_date: publicationDate,
    review_date: REVIEW_DATE,
    exact_geography: geography,
    fishing_mode: mode,
    season_represented: season,
    claim_supported: claim,
    permitted_use: use,
    limitations,
    evidence_grade: grade,
  };
}

const sources = [
  source("MI_BETTER_WATERS", "Michigan Department of Natural Resources", "Better Fishing Waters", "current undated page", "https://www.michigan.gov/dnr/things-to-do/fishing/where/better-fishing-waters", "Named St. Joseph Pier, South Haven Pier, and grouped Grand Haven & Holland Piers", "pier; structure allocation unspecified within each named port", "not seasonal", "Names seven St. Joseph species, nine South Haven species, and nine species for grouped Grand Haven/Holland piers.", "Primary species-inventory evidence; exact for the named pier fishery but not a catch-rate or north/south allocation.", "Holland is grouped with Grand Haven; St. Joseph and South Haven do not distinguish the two pierheads.", "A-primary-agency-inventory"),
  source("MI_CREEL_DASHBOARD", "Michigan Department of Natural Resources", "Creel Sportfishing Estimates dashboard — preserved Pier/Dock extract", "1989-2022 series; source refresh 2025-04-23", "https://www.michigan.gov/dnr/managing-resources/fisheries/creel", "Target-port Pier/Dock rows for South Haven, Holland, Lexington, and Harrisville; no row resolved for tested St. Joseph aliases", "Pier/Dock", "survey months vary by port and year", "Preserves monthly effort, catch, and harvest estimates used to identify recurring port Pier/Dock leads.", "Primary quantitative inventory and Pass 2 queue; preserve estimate types separately.", "Port estimates may pool multiple structures; survey coverage is incomplete by month/year; a zero outside season is not absence; dashboard port label for St. Joseph was not resolved.", "A-primary-quantitative"),
  source("MI_CREEL_METHOD", "Michigan Department of Natural Resources", "Creel Clerks & Angler Surveys", "current undated page", "https://www.michigan.gov/dnr/managing-resources/fisheries/creel", "Michigan Great Lakes survey program; current clerk areas include South Haven/St. Joseph, Port Austin/Lexington, and Harrisville/Oscoda", "mixed Great Lakes angling modes", "current program", "Explains angler interviews and current survey coverage assignments.", "Method and coverage context only.", "Does not itself provide species magnitude or exact-structure allocation.", "B-primary-method"),
  source("MI_ROADMAP_LM", "Michigan Department of Natural Resources", "Roadmap to Fishing Lake Michigan — accessible version", "2018-03", "https://www.michigan.gov/documents/dnr/Roadmap-LakeMichigan-fishing-accessible-version_621804_7.pdf", "Lake Michigan ports including Holland/Port Sheldon, Saugatuck/South Haven, and St. Joseph", "mixed port modes", "January through October in four seasonal columns", "Identifies port-season leads, including cold-season salmonids and warm-season drum.", "Seasonal lead generation and conflict checking, never exact-pier magnitude.", "Combines Holland with Port Sheldon and South Haven with Saugatuck; mode is not separated; November-December coverage is not systematic.", "B-primary-port-guide"),
  source("MI_ROADMAP_LH", "Michigan Department of Natural Resources", "Roadmap to Fishing Lake Huron — accessible version", "current agency map; reviewed 2026-09-19", "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Maps/RoadmapLake_Huron-accessible.pdf?hash=9B8016365487EFFD33522DB5409929B7&rev=724dd584a1f04b9db8f3edc6ea5238c0", "Named Harrisville and Lexington ports", "mixed port modes", "January through October in four seasonal columns", "Lists Harrisville lake trout, steelhead, walleye and fall Atlantic salmon; lists Lexington Atlantic, Chinook, coho, pink, steelhead, lake trout, walleye, and yellow perch by season.", "Primary seasonal lead generation, not score magnitude.", "Port-level and mode-mixed; blank cells are not proof of absence; November-December are not systematically represented.", "B-primary-port-guide"),
  source("MI_REGS_2026", "Michigan Department of Natural Resources", "2026 Michigan Fishing Regulations", "2026", "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/LED/digests/2026-Michigan-Fishing-Regulations_web_accessible.pdf?rev=e64a3c8c16d4439e96323529bd8fc0f2", "Michigan Great Lakes, including Lake Michigan MM 6-8 and Lake Huron MH 3-6", "all legal sport-fishing modes", "2026 through 2027-03-31", "Current statewide and Great Lakes rules; Lexington and Harrisville are in MH 3-6 and Holland in MM 6-8.", "Legal context and later closure modeling only; no biological magnitude.", "Anglers must check updates and fisheries orders; local posted access restrictions are separate.", "A-primary-regulation"),
  source("MI_STATE_PARK_RULES", "Michigan Department of Natural Resources", "State parks general rules", "current undated page", "https://www.michigan.gov/dnr/faqs/state-parks-and-camping/state-parks-general-rules", "Michigan state parks, including Holland State Park", "park access", "year-round general policy", "Day-use areas are generally open 8 a.m.-10 p.m.; vehicle entry may require a Recreation Passport.", "Primary hours/pass baseline where a park page does not publish a narrower rule.", "Posted closures and site-specific rules control; not a live gate status.", "A-primary-access"),
  source("MI_HARBOR_RULES", "Michigan Department of Natural Resources", "Harbors — general rules", "current undated page", "https://www.michigan.gov/dnr/faqs/state-parks-and-camping/harbor-general-rules", "Michigan state-managed harbors, including Lexington", "harbor docks and sidewalks", "year-round general policy", "Fishing is not allowed in a state harbor unless otherwise posted.", "Primary default access rule.", "Local posted permission is required; the page does not map each permitted surface.", "A-primary-access"),
  source("USCG_LIGHT_LIST_2025", "United States Coast Guard Navigation Center", "Light List Volume VII, Great Lakes", "2025", "https://www.navcen.uscg.gov/sites/default/files/pdf/lightLists/LightList_V7_2025.pdf", "Named aids at St. Joseph, South Haven, Holland, Lexington, and Harrisville", "navigation structures", "annual publication", "Provides authoritative structure names and coordinates for pierhead and breakwater lights.", "Coordinate and structure-identity source only.", "Aid coordinates identify the light, not the legal pedestrian route or fishing permission.", "A-primary-coordinate"),
  source("STJ_BERRIEN_FISH", "Berrien County Parks", "Fishing Access", "current undated page", "https://www.berriencounty.org/444/Fishing-Access", "St. Joseph South Pier from Silver Beach", "shore and pier", "year-round subject to conditions", "Confirms public South Pier route, USACE ownership/maintenance context, at-own-risk access, and a local species list.", "Primary exact-route, safety, and exact-site inventory evidence.", "Generic catfish and whitefish labels are not species-level proof for channel catfish or round whitefish; no catch-rate denominator.", "A-primary-local"),
  source("STJ_SILVER_BEACH", "Berrien County Parks", "Silver Beach County Park", "current undated page", "https://www.berriencounty.org/1295/Silver-Beach-County-Park", "101 Broad Street and South Pier; also identifies North Pier route from Tiscornia", "park approach and pier fishing", "daily, year-round", "Dawn-to-dusk park hours, May-September parking fees, no overnight parking, free walk-in, and separate routes to both piers.", "Primary access, fees, hours, and boundary source.", "Park hours govern the approach; the USACE pier is outside county park property and conditions can make access unsafe.", "A-primary-access"),
  source("STJ_TISCORNIA", "City of St. Joseph Parks and Recreation", "Tiscornia Beach facility details", "current page; status open on review date", "https://stjosephmi.myrec.com/info/facilities/details.aspx?FacilityID=14703", "80 Ridgeway Street; St. Joseph North Pier", "public beach approach and pier", "current status", "Identifies the North Pier/lighthouse walkway and fishing use; status displayed Open.", "Primary exact-route and published-status evidence.", "Reservation-grid hours are not established park operating hours; live weather/ice closures still require verification.", "A-primary-access"),
  source("SOUTH_HAVEN_SAFETY", "South Haven Area Emergency Services Authority", "South Haven Beach Safety", "current undated page", "https://shaes.org/south-haven-beach-safety/", "South Haven North and South beaches and pierheads", "public pier access", "May 15-September 15 flag program plus year-round closure authority", "Both beaches access the pierheads; the city may close both piers during red-flag/high-wave conditions and violators are subject to arrest.", "Primary safety closure and access-control evidence.", "The page is not a real-time physical inspection and does not publish complete beach hours or parking rates.", "A-primary-access"),
  source("SOUTH_HAVEN_FISHING", "South Haven/Van Buren County Convention & Visitors Bureau", "Where to Fish in South Haven: 5 Easy-Access Spots for Shore Anglers", "2026", "https://www.southhaven.org/blog/where-to-fish-in-south-haven-5-easy-access-spots-for-shore-anglers/", "North/South Piers, Harborwalk, Black River Park, and SHOUT Park", "pier, seawall, and river platform", "current visitor guidance", "Separates both piers, lower Harborwalk seawalls, and two upstream Black River fishing platforms; names broad pier species.", "Secondary structure inventory and current fishing-use corroboration.", "Promotional and qualitative; generic bass/catfish/trout labels and no standardized effort.", "C-secondary-local"),
  source("SOUTH_HAVEN_WATER_TRAILS", "Michigan Water Trails", "Harborwalk — City of South Haven", "current undated page", "https://www.michiganwatertrails.org/location.asp?aid=1325&ait=av", "South Haven Harborwalk from North Beach to South Beach", "pedestrian waterfront trail", "all four seasons shown", "Provides the pier-to-pier route and GPS point 42°24.18900, -86°16.57080.", "Route identity and coordinate context.", "Does not designate every seawall segment for fishing or provide closure status.", "B-public-program-access"),
  source("BLACK_RIVER_PARK", "Michigan Water Trails", "Black River Park Marina — City of South Haven", "current undated page", "https://www.michiganwatertrails.org/trail.asp?aid=199&ait=av", "Dunkley Avenue, Black River Park", "upstream river fishing/launch", "all four seasons shown; facilities may be seasonal", "City-owned marina access, parking terms, and GPS 42°24.53280, -86°16.31400.", "Boundary review for a separately excluded upstream platform.", "This is about one mile upstream and cannot establish pier opportunity.", "B-public-program-access"),
  source("HOLLAND_DNR_PARK", "Michigan Department of Natural Resources", "Holland State Park", "current undated page", "https://www.michigan.gov/recsearch/parks/holland", "2459 Ottawa Beach Road; north side of Holland channel", "state-park channel walkway and north pier", "year-round subject to park rules", "Fishing is popular along the Lake Michigan channel walkway; vehicle entry requires a Recreation Passport.", "Primary north-route boundary and access evidence.", "Does not authorize the south route or provide species-specific catch magnitude.", "A-primary-access"),
  source("HOLLAND_TOURISM_FISH", "Holland Area Convention & Visitors Bureau", "Boat Launches + Fishing Piers", "current undated page", "https://www.holland.org/things-to-do/outdoors/fishing/boat-launches-fishing-piers/", "Holland State Park breakwall and pier", "shore/pier", "current visitor guidance", "Confirms fishing use from the breakwall and pier at Holland State Park.", "Secondary current-use corroboration.", "No standardized biological data or south-route authorization.", "C-secondary-local"),
  source("HOLLAND_BIG_RED", "Holland Harbor Lighthouse Historical Commission", "Big Red Lighthouse", "current page; copyright 2025", "https://bigredlighthouse.com/", "Holland Harbor south-side pedestrian approaches", "pedestrian access to south pier/lighthouse", "current visitation status", "States there is currently no walkway access and private property surrounds pedestrian access points.", "Current operator evidence to exclude the south route.", "Applies to pedestrian access; does not erase biological observations assigned to the port.", "A-operator-access"),
  source("LEX_STATE_HARBOR", "Michigan Economic Development Corporation / Michigan DNR listing", "Lexington State Harbor", "current listing", "https://www.michigan.org/property/lexington-state-harbor", "7411 Huron Bay Boulevard; Lexington State Harbor", "state harbor", "normally early May-late September", "Provides address, 43°15'50 N 82°31'00 W, 108 slips, amenities, and normal season.", "Facility identity, address, coordinate, and normal-season context.", "Normal season is superseded by project closures and does not itself identify legal fishing surfaces.", "B-government-tourism-access"),
  source("LEX_CLOSURE_2026", "Michigan Department of Natural Resources", "Planned upgrades and closures at Lexington State Harbor", "2026-01-08", "https://content.govdelivery.com/accounts/MIDNR/bulletins/400b750", "Lexington State Harbor marina, breakwall, and boating access site", "construction/access", "spring 2026 through summer 2027", "Entire marina is closed 2026-09-08 through 2027-05-28 for in-water replacement; breakwall repairs occurred in summer 2026; 2027 work may cause intermittent closures.", "Primary live release gate and construction evidence.", "The notice does not explicitly map pedestrian breakwater access after 2026-09-08; safe public access must be confirmed directly.", "A-primary-closure"),
  source("LEX_VILLAGE", "Village of Lexington", "Beach Access & Marina", "current undated page", "https://villageoflexington.com/visit/things-to-do/beach-access-marina/", "Lexington harbor, Tierney Park, and state-harbor facilities", "beach, launch, and harbor approach", "normal May-October operation", "Provides normal harbormaster hours, launch route, and beach access east of the light.", "Primary municipal route context.", "Normal operations are superseded by DNR construction closures; page does not designate fishing surfaces.", "A-primary-access"),
  source("LEX_ATLANTIC_DNR", "Michigan Department of Natural Resources", "Atlantic salmon", "current undated page", "https://www.michigan.gov/dnr/education/michigan-species/fish-species/atlantic-salmon", "Lexington Harbor and other Michigan program waters", "mixed", "annual spring stocking program", "Identifies Lexington Harbor as an experimental Atlantic salmon fishery stocked each spring.", "Primary management lead; corroborates but does not alone quantify pier catch.", "Stocking does not by itself establish catch magnitude or safe current access.", "A-primary-management"),
  source("LEX_ATLANTIC_STOCK_2024", "Great Lakes Fishery Commission Fish Stocking Information System; event reported by Michigan DNR", "Stocking Event 202565056", "2024-04-22", "https://fsis.glfc.org/stocking/event_detail/202565056/", "Lexington Harbor at reported coordinate 43.2675, -82.5266", "shore stocking", "spring 2024", "Records 26,667 age-1 landlocked Atlantic salmon stocked at Lexington Harbor.", "Primary stocking context and coordinate corroboration.", "Stocking is not exact-pier catch evidence and cannot set opportunity magnitude.", "A-primary-stocking"),
  source("LEX_ENFORCEMENT_2024", "Michigan Department of Natural Resources Law Enforcement Division", "Conservation officer biweekly report 11/24/2024-12/7/2024", "2024-12", "https://www.michigan.gov/dnr/managing-resources/laws/cobiweekly/reports/2024/11-24-2024-12-7-2024", "Lexington Harbor", "shore/harbor angling", "late November-early December 2024", "Documents Atlantic salmon physically present and being caught at Lexington Harbor, although by illegal snagging.", "Exact-harbor occurrence and timing only.", "Illegal method cannot establish lawful intentional angling quality or catch rate.", "B-primary-enforcement"),
  source("HARRISVILLE_LHCFAC_2025", "Michigan Department of Natural Resources, Lake Huron Citizens Fishery Advisory Committee", "Minutes — October 7, 2025", "2025-10-07", "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LHCFAC/Minutes/minutes-oct-7-2025.pdf", "Harrisville Harbor and surrounding port area", "unoccupied marina docks plus mixed port/boat reports", "2025 open-water season and early fall", "States fishing on unoccupied docks is permitted and reports Chinook/coho caught from them; separately reports area coho, steelhead, lake trout, Chinook, and walleye and discusses possible Atlantic/coho stocking.", "Primary advisory record for exact dock permission/catch leads and broader port leads, with modes kept separate.", "Statements are meeting testimony, not a controlled survey; lake trout and walleye statements are not allocated to docks; proposed Atlantic stocking is not an implemented event.", "B-primary-advisory"),
  source("HARRISVILLE_LHCFAC_2022_OCT", "Michigan Department of Natural Resources, Lake Huron Citizens Fishery Advisory Committee", "Minutes — October 4, 2022", "2022-10-04", "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LHCFAC/Minutes/minutes-oct-4-2022.pdf?hash=5A6B6B1F6EFD206D5417EA7D5EE4AA6C&rev=ad9a37f052044180829dc5b09a8f2c2e", "Harrisville Harbor", "harbor angling; exact surface not allocated", "fall and winter discussion", "Reports regular fall Chinook, occasional Atlantic salmon, and a winter fishery in Harrisville Harbor.", "Exact-harbor occurrence lead for Atlantic salmon and cold-season fishing.", "Advisory testimony does not identify the fishing surface or establish annual recurrence, effort, or legal access.", "B-primary-advisory"),
  source("HARRISVILLE_LHCFAC_2022", "Michigan Department of Natural Resources, Lake Huron Citizens Fishery Advisory Committee", "Minutes — February 1, 2022", "2022-02-01", "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LHCFAC/Minutes/minutes-feb-1-2022.pdf?hash=096D830A129C9ECC13CCA08B2CAF12BD&rev=df24837f5fd4420bb7c81af393198c1e", "Harrisville Harbor", "ice/harbor angling", "winter", "Reports coho caught through the ice in Harrisville Harbor despite no local stocking at that time.", "Exact-harbor cold-season lead.", "Advisory testimony; ice safety, access, effort, and recurrence require independent review.", "B-primary-advisory"),
  source("HARRISVILLE_LHCFAC_2023", "Michigan Department of Natural Resources, Lake Huron Citizens Fishery Advisory Committee", "Minutes — January 31, 2023", "2023-01-31", "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LHCFAC/Minutes/minutes-jan-31-2023.pdf?hash=D585779A651F00BCD34F4200FF178C69&rev=e20156b3b3cc44c89de05d4c019d22d0", "Harrisville Harbor", "harbor shore/ice edge", "fall 2022-winter 2023", "Reports six or seven brown trout caught before harbor freeze, including a fish around 28 inches.", "Exact-harbor brown-trout recurrence lead.", "Advisory testimony with no effort denominator or precise fishing surface.", "B-primary-advisory"),
  source("HARRISVILLE_REC_PLAN", "City of Harrisville", "2024-2028 Recreation Plan", "adopted plan covering 2024-2028", "https://harrisvillemi.org/wp-content/uploads/2025/11/2024-2028-City-of-Harrisville-Recreation-Plan.pdf", "Harrisville Municipal Marina and harbor", "designated harbor fishing program", "municipal planning horizon", "States a fishing program was developed to permit safe harbor fishing while protecting docks and avoiding boaters.", "Primary municipal policy context.", "Does not map the designated fishing areas or establish year-round dock access.", "A-primary-municipal"),
  source("HARRISVILLE_HARBOR_RULES", "Harrisville Harbor", "Harbor Rules and Regulations — 2023", "revised 2021; distributed as 2023 rules", "https://static1.squarespace.com/static/65a7feef98027526cf6a1aea/t/6647759ea8d23a77608e1620/1715959198588/HARBOR-RULES-2023.pdf", "Harrisville Harbor premises", "marina docks and designated fishing areas", "operating season", "Fishing is prohibited within harbor premises except designated areas; permittees may fish from their assigned vessels.", "Operator rule controlling dock access.", "Does not publish a current map of designated areas; must be reconciled with 2025 permission for unoccupied docks.", "A-operator-rule"),
  source("HARRISVILLE_HARBOR_GUIDE", "Michigan Department of Natural Resources", "Michigan State Harbors Guide — Harrisville Municipal Marina", "current guide; reviewed 2026-09-19", "https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/PRD/Waterways/HarborGuidePDF.pdf?rev=021f6269262f4455b29cb5ace0871b41", "Harrisville Municipal Marina", "marina facility", "mid-May to mid-October normal operation", "Provides facility coordinate 44°39'43 N, 83°16'50 W, normal operating season, and amenities.", "Facility coordinate and normal season only.", "Marina season does not establish year-round public dock fishing.", "A-primary-facility"),
  source("HARRISVILLE_STEELHEAD_STOCK_2025", "Great Lakes Fishery Commission Fish Stocking Information System; event reported by Michigan DNR", "CWT 64-14-84 — Harrisville Harbor stocking event 202666111", "2025-04-24", "https://fsis.glfc.org/stocking/cwt_detail/641484/", "Lake Huron, Harrisville Harbor", "shore stocking", "spring 2025", "Records 11,250 age-1 Michigan winter-strain rainbow trout/steelhead stocked at Harrisville Harbor.", "Primary stocking lead only.", "Stocking does not establish exact-dock catch magnitude or access.", "A-primary-stocking"),
  source("MI_CWT", "Michigan Department of Natural Resources", "Coded wire tags", "current undated page", "https://www.michigan.gov/dnr/things-to-do/fishing/marked-and-tagged-fish/coded-wire-tags-cwt", "Harrisville Harbor, Lexington Harbor, and other Michigan drop-off sites", "all catch modes", "current program", "Confirms fish-head drop-off infrastructure at Harrisville Harbor and Lexington Harbor.", "Monitoring infrastructure context only.", "A drop-off site is not evidence that any particular species is caught at that structure.", "C-primary-context"),
];

const boundaries = {
  schema_version: "piercast-pass1-site-boundaries-v1",
  reviewed_at: REVIEW_DATE,
  rule: "Biological opportunity and access are separate. A structure is not publishable unless its current legal route is verified, even when port-level biological evidence is strong.",
  cities: [
    { city_id: "st_joseph_mi", display_name: "St. Joseph", report_boundary: "Two separately labeled covered subareas: South Pier from Silver Beach and North Pier from Tiscornia Beach.", excluded_geographies: ["St. Joseph River upstream of the pierheads", "Paw Paw River", "Marina Island", "boats and charters", "beaches away from the harbor mouth", "offshore Lake Michigan"] },
    { city_id: "south_haven_mi", display_name: "South Haven", report_boundary: "North Pier, South Pier, and the lower pier-to-pier Harborwalk seawalls only when separately labeled and posted for fishing.", excluded_geographies: ["Black River Park platform", "SHOUT Park platform", "Black River upstream fishing", "boats and charters", "beaches away from the harbor mouth"] },
    { city_id: "holland_mi", display_name: "Holland", report_boundary: "North pier and contiguous public channel walkway reached through Holland State Park; south pier excluded.", excluded_geographies: ["south pier/Big Red pedestrian route", "Lake Macatawa sites", "boats and charters", "offshore Lake Michigan"] },
    { city_id: "lexington_mi", display_name: "Lexington", report_boundary: "Prospective state-harbor east/west breakwater surfaces only if DNR confirms lawful public fishing after construction; no marina dock is silently included.", excluded_geographies: ["private Lexington Marina", "offshore charter fishing", "other Thumb ports", "marina docks or edges not affirmatively posted for fishing"] },
    { city_id: "harrisville_mi", display_name: "Harrisville", report_boundary: "Designated/unoccupied municipal-marina docks and any separately verified public harbor-edge or breakwater segment; each remains individually access-gated.", excluded_geographies: ["occupied or undesignated docks", "Harrisville State Park beach", "boats and charters", "Oscoda, Alpena, Rogers City, and other ports"] },
  ],
  structures: [
    { city_id: "st_joseph_mi", structure_id: "south_pier_silver_beach", structure_name: "South Pier via Silver Beach", municipality_owner: "City of St. Joseph; approach operated by Berrien County; navigation pier maintained by USACE", route_address: "Silver Beach County Park north lot, 101 Broad Street, St. Joseph, MI 49085", coordinates: { latitude: 42.115275, longitude: -86.494285, source_id: "USCG_LIGHT_LIST_2025", point: "South Pierhead Light" }, disposition: "covered_separate_subarea", published_access_status: "Public access allowed at own risk from paved park walkways.", live_access_status: "Published open route found; no physical observation. Check weather, ice, and posted barricades.", hours_passes_fees: "Approach park dawn-dusk daily, year-round; no overnight parking; May-September vehicle fee $8 county resident/$15 nonresident; $40 annual county permit; walk-in free.", seasonal_restrictions: "Restrooms early May-mid-October; stay off during ice, storms, or high seas.", construction_closure: "No current construction closure found in reviewed operator sources.", source_ids: ["STJ_BERRIEN_FISH", "STJ_SILVER_BEACH", "USCG_LIGHT_LIST_2025"], unresolved_limitations: "USACE pier is outside county park property and has no lifeguards; live barricade status must be checked." },
    { city_id: "st_joseph_mi", structure_id: "north_pier_tiscornia", structure_name: "North Pier and lighthouse walkway via Tiscornia Beach", municipality_owner: "City of St. Joseph approach; federal navigation structure", route_address: "Tiscornia Beach, 80 Ridgeway Street, St. Joseph, MI 49085", coordinates: { latitude: 42.116416, longitude: -86.494542, source_id: "USCG_LIGHT_LIST_2025", point: "North Pierhead Light" }, disposition: "covered_separate_subarea", published_access_status: "City facility page lists status Open and identifies the walkway as a fishing location.", live_access_status: "Published status Open on review date; no physical observation. Weather/ice gates remain.", hours_passes_fees: "Parking terms are published by the city facility; exact park operating hours were not established from the reviewed page.", seasonal_restrictions: "Restroom and parking operations can be seasonal; dangerous wave and ice conditions supersede access.", construction_closure: "No current construction closure found in reviewed operator sources.", source_ids: ["STJ_TISCORNIA", "STJ_SILVER_BEACH", "USCG_LIGHT_LIST_2025"], unresolved_limitations: "Confirm current parking fee/hours and posted pier status before release." },
    { city_id: "south_haven_mi", structure_id: "south_pier", structure_name: "South Pier and lighthouse", municipality_owner: "Federal navigation structure with City of South Haven public approach/control", route_address: "South Beach, 60 Water Street, South Haven, MI 49090", coordinates: { latitude: 42.40135, longitude: -86.287964, source_id: "USCG_LIGHT_LIST_2025", point: "South Haven South Pierhead Light" }, disposition: "covered_separate_subarea", published_access_status: "Public pierhead access; city may close the pier during red-flag/high-wave conditions.", live_access_status: "No physical observation; consult same-day city beach status and barricades.", hours_passes_fees: "Paid beach parking is reported by local visitor sources; a current authoritative all-season hour schedule was not established.", seasonal_restrictions: "Flag program May 15-September 15; red flag closes beach water and piers; year-round waves/ice can close access.", construction_closure: "No current construction closure found in reviewed sources.", source_ids: ["SOUTH_HAVEN_SAFETY", "SOUTH_HAVEN_FISHING", "USCG_LIGHT_LIST_2025"], unresolved_limitations: "Obtain current city parking/hours page and same-day closure status before release." },
    { city_id: "south_haven_mi", structure_id: "north_pier", structure_name: "North Pier", municipality_owner: "Federal navigation structure with City of South Haven public approach/control", route_address: "North Beach, 45 Lakeshore Drive, South Haven, MI 49090", coordinates: { latitude: 42.401897, longitude: -86.288203, source_id: "USCG_LIGHT_LIST_2025", point: "South Haven North Pier Light" }, disposition: "covered_separate_subarea", published_access_status: "Public pierhead access; city may close the pier during red-flag/high-wave conditions.", live_access_status: "No physical observation; consult same-day city beach status and barricades.", hours_passes_fees: "Paid beach parking is reported by local visitor sources; a current authoritative all-season hour schedule was not established.", seasonal_restrictions: "Flag program May 15-September 15; red flag closes beach water and piers; year-round waves/ice can close access.", construction_closure: "No current construction closure found in reviewed sources.", source_ids: ["SOUTH_HAVEN_SAFETY", "SOUTH_HAVEN_FISHING", "USCG_LIGHT_LIST_2025"], unresolved_limitations: "Obtain current city parking/hours page and same-day closure status before release." },
    { city_id: "south_haven_mi", structure_id: "lower_harborwalk", structure_name: "Lower Harborwalk channel seawalls", municipality_owner: "City of South Haven public waterfront route", route_address: "Pier-to-pier Harborwalk; only lower-channel legal seawalls are in scope", coordinates: { latitude: 42.40315, longitude: -86.27618, source_id: "SOUTH_HAVEN_WATER_TRAILS", point: "published Harborwalk GPS" }, disposition: "covered_only_as_separately_labeled_subarea", published_access_status: "Public pedestrian route; visitor bureau documents fishing along seawalls.", live_access_status: "No segment-by-segment posted fishing inspection completed.", hours_passes_fees: "No unified fee established for walking route; adjacent parking rules vary.", seasonal_restrictions: "Obey barricades, vessel operations, and posted no-fishing segments.", construction_closure: "No current systemwide closure found.", source_ids: ["SOUTH_HAVEN_WATER_TRAILS", "SOUTH_HAVEN_FISHING"], unresolved_limitations: "Pass 3 must map the exact western seawall segments where casting is lawful; do not merge upstream Black River evidence." },
    { city_id: "south_haven_mi", structure_id: "black_river_park_platform", structure_name: "Black River Park fishing platform/seawall", municipality_owner: "City of South Haven", route_address: "132 Dunkley Avenue, South Haven, MI 49090", coordinates: { latitude: 42.40888, longitude: -86.2719, source_id: "BLACK_RIVER_PARK", point: "published marina GPS" }, disposition: "excluded_upstream_structure", published_access_status: "Public fishing access/platform exists.", live_access_status: "Not physically observed; facility operations may be seasonal.", hours_passes_fees: "$7 parking inside launch gate; free parking outside gate; public facilities described by operator source.", seasonal_restrictions: "Marina/restrooms can be seasonal.", construction_closure: "No current closure identified.", source_ids: ["BLACK_RIVER_PARK", "SOUTH_HAVEN_FISHING"], unresolved_limitations: "About one mile upstream; retained as a separate River structure and cannot supply PierCast pier magnitude." },
    { city_id: "south_haven_mi", structure_id: "shout_park_platform", structure_name: "SHOUT Park fishing platform", municipality_owner: "City of South Haven public park", route_address: "625 Dunkley Avenue, South Haven, MI 49090", coordinates: { latitude: 42.4097, longitude: -86.272, source_id: "SOUTH_HAVEN_FISHING", point: "operator listing/address map point" }, disposition: "excluded_upstream_structure", published_access_status: "Universally accessible public fishing platform.", live_access_status: "Not physically observed.", hours_passes_fees: "No current fee or hour restriction found in reviewed source.", seasonal_restrictions: "Posted park rules control.", construction_closure: "No current closure identified.", source_ids: ["SOUTH_HAVEN_FISHING"], unresolved_limitations: "Upstream Black River setting; not part of the pier report." },
    { city_id: "holland_mi", structure_id: "north_pier", structure_name: "Holland Harbor North Pier/breakwater", municipality_owner: "USACE navigation structure; public approach through Michigan DNR Holland State Park", route_address: "Holland State Park, 2459 Ottawa Beach Road, Holland, MI 49424", coordinates: { latitude: 42.773453, longitude: -86.215814, source_id: "USCG_LIGHT_LIST_2025", point: "North Breakwater Light" }, disposition: "covered_structure", published_access_status: "Public state-park route; agency and tourism sources identify pier/breakwall fishing.", live_access_status: "Published open context; no physical observation or same-day wave inspection.", hours_passes_fees: "State-park day-use baseline 8 a.m.-10 p.m.; Recreation Passport required for vehicle entry.", seasonal_restrictions: "Weather, waves, ice, park closures, and posted barricades control.", construction_closure: "No current closure found in reviewed sources.", source_ids: ["HOLLAND_DNR_PARK", "HOLLAND_TOURISM_FISH", "MI_STATE_PARK_RULES", "USCG_LIGHT_LIST_2025"], unresolved_limitations: "Confirm same-day pier gate and any park-specific hour change." },
    { city_id: "holland_mi", structure_id: "north_channel_walkway", structure_name: "North channel walkway", municipality_owner: "Michigan DNR Holland State Park / federal channel edge", route_address: "Channel-side walkway from Holland State Park to North Pier", coordinates: { latitude: 42.7733, longitude: -86.212718, source_id: "USCG_LIGHT_LIST_2025", point: "North Pierhead Light" }, disposition: "covered_separate_subarea", published_access_status: "DNR identifies the channel walkway as a popular fishing location.", live_access_status: "Published access context only; no physical observation.", hours_passes_fees: "State-park day-use baseline 8 a.m.-10 p.m.; Recreation Passport required for vehicle entry.", seasonal_restrictions: "Park/weather/ice restrictions apply.", construction_closure: "No current closure found.", source_ids: ["HOLLAND_DNR_PARK", "MI_STATE_PARK_RULES", "USCG_LIGHT_LIST_2025"], unresolved_limitations: "Keep Lake Macatawa boardwalk fishing separate from this Lake Michigan channel subarea." },
    { city_id: "holland_mi", structure_id: "south_pier_big_red", structure_name: "South Pier / Big Red route", municipality_owner: "Federal navigation/light structure; pedestrian approaches surrounded by private property", route_address: "South side of Holland Harbor; no lawful public walkway route established", coordinates: { latitude: 42.772536, longitude: -86.215814, source_id: "USCG_LIGHT_LIST_2025", point: "South Breakwater Light" }, disposition: "excluded_no_public_route", published_access_status: "Lighthouse commission states there is currently no walkway access and private property surrounds pedestrian access points.", live_access_status: "Excluded; do not route users through gates, private roads, beaches, or informal shoreline paths.", hours_passes_fees: "Not applicable because no lawful public pedestrian route was established.", seasonal_restrictions: "Not applicable.", construction_closure: "No access pending a formally published public route.", source_ids: ["HOLLAND_BIG_RED", "USCG_LIGHT_LIST_2025"], unresolved_limitations: "A future official route may change this disposition; reverify independently before any inclusion." },
    { city_id: "lexington_mi", structure_id: "east_breakwater", structure_name: "Lexington Harbor East Breakwater", municipality_owner: "USACE/Michigan DNR state-harbor project", route_address: "Lexington State Harbor, 7411 Huron Bay Boulevard, Lexington, MI 48450", coordinates: { latitude: 43.26662, longitude: -82.522849, source_id: "USCG_LIGHT_LIST_2025", point: "East Breakwater Light 2" }, disposition: "prospective_covered_access_hold", published_access_status: "Existence confirmed; no reviewed source affirmatively designates the walking surface for fishing.", live_access_status: "Unsafe to represent as open: entire marina closed 2026-09-08 through 2027-05-28 and project notice does not resolve pedestrian breakwater access.", hours_passes_fees: "Normal harbor season/hours are superseded by construction closure.", seasonal_restrictions: "Active construction; state-harbor fishing prohibited unless otherwise posted.", construction_closure: "In-water replacement closure through 2027-05-28; later intermittent 2027 work expected.", source_ids: ["LEX_STATE_HARBOR", "LEX_CLOSURE_2026", "LEX_VILLAGE", "MI_HARBOR_RULES", "USCG_LIGHT_LIST_2025"], unresolved_limitations: "Direct DNR confirmation and post-construction signage inspection required." },
    { city_id: "lexington_mi", structure_id: "west_breakwater", structure_name: "Lexington Harbor West Breakwater", municipality_owner: "USACE/Michigan DNR state-harbor project", route_address: "Lexington State Harbor/Tierney Park waterfront", coordinates: { latitude: 43.267459, longitude: -82.523549, source_id: "USCG_LIGHT_LIST_2025", point: "West Breakwater Light 3" }, disposition: "prospective_covered_access_hold", published_access_status: "Existence confirmed; legal public fishing surface not affirmatively mapped.", live_access_status: "Unsafe to represent as open during active harbor construction closure.", hours_passes_fees: "Normal harbor season/hours are superseded by construction closure.", seasonal_restrictions: "Active construction; state-harbor fishing prohibited unless otherwise posted.", construction_closure: "In-water replacement closure through 2027-05-28; later intermittent 2027 work expected.", source_ids: ["LEX_CLOSURE_2026", "LEX_VILLAGE", "MI_HARBOR_RULES", "USCG_LIGHT_LIST_2025"], unresolved_limitations: "Confirm whether Tierney Park supplies a lawful route and which breakwater surface permits fishing." },
    { city_id: "lexington_mi", structure_id: "marina_edges_docks", structure_name: "State-harbor marina edges and docks", municipality_owner: "Michigan DNR state harbor", route_address: "7411 Huron Bay Boulevard, Lexington, MI 48450", coordinates: { latitude: 43.263889, longitude: -82.516667, source_id: "LEX_STATE_HARBOR", point: "published harbor coordinate" }, disposition: "excluded_unless_affirmatively_posted", published_access_status: "Default state-harbor rule prohibits fishing unless posted; no permitted-edge map found.", live_access_status: "Entire marina closed 2026-09-08 through 2027-05-28.", hours_passes_fees: "Closed during project period.", seasonal_restrictions: "Construction and normal marina operations.", construction_closure: "Full marina closure through 2027-05-28.", source_ids: ["LEX_STATE_HARBOR", "LEX_CLOSURE_2026", "MI_HARBOR_RULES"], unresolved_limitations: "Do not infer fishing permission from creel rows, fish-cleaning infrastructure, or historical angling." },
    { city_id: "harrisville_mi", structure_id: "unoccupied_marina_docks", structure_name: "Designated unoccupied marina docks", municipality_owner: "City of Harrisville municipal marina", route_address: "Harrisville Harbor, 1 E Harbor Lane, Harrisville, MI 48740", coordinates: { latitude: 44.661944, longitude: -83.280556, source_id: "HARRISVILLE_HARBOR_GUIDE", point: "published marina coordinate" }, disposition: "prospective_covered_conditional", published_access_status: "2025 DNR advisory minutes say unoccupied-dock fishing is permitted; operator rules limit fishing to designated areas.", live_access_status: "Conditional and not physically verified; ask harbormaster and follow current signs/occupancy.", hours_passes_fees: "Normal marina operation mid-May to mid-October; no source established year-round dock access or an angler fee.", seasonal_restrictions: "Occupied slips, vessel movements, ice, and off-season dock configuration control access.", construction_closure: "No current project closure found.", source_ids: ["HARRISVILLE_LHCFAC_2025", "HARRISVILLE_REC_PLAN", "HARRISVILLE_HARBOR_RULES", "HARRISVILLE_HARBOR_GUIDE"], unresolved_limitations: "Obtain current designated-area map and off-season policy; marina season is not proof of year-round dock access." },
    { city_id: "harrisville_mi", structure_id: "east_breakwater", structure_name: "Harrisville East Breakwater", municipality_owner: "Federal/municipal harbor structure", route_address: "Outer Harrisville Harbor", coordinates: { latitude: 44.661398, longitude: -83.281813, source_id: "USCG_LIGHT_LIST_2025", point: "East Breakwater Light 3" }, disposition: "access_hold_not_covered_yet", published_access_status: "Structure confirmed; no lawful pedestrian fishing route found in reviewed operator sources.", live_access_status: "Do not represent as open pending direct confirmation.", hours_passes_fees: "Unknown for pedestrian fishing.", seasonal_restrictions: "Navigation and weather hazards apply.", construction_closure: "No current closure found, but absence of a closure is not proof of access.", source_ids: ["USCG_LIGHT_LIST_2025", "HARRISVILLE_HARBOR_RULES", "HARRISVILLE_REC_PLAN"], unresolved_limitations: "Direct municipal/USACE route and surface permission required." },
    { city_id: "harrisville_mi", structure_id: "west_breakwater_and_harbor_edge", structure_name: "Harrisville West Breakwater and other harbor-edge fishing areas", municipality_owner: "Federal/City of Harrisville harbor property", route_address: "Outer and inner Harrisville Harbor", coordinates: { latitude: 44.660787, longitude: -83.283258, source_id: "USCG_LIGHT_LIST_2025", point: "West Breakwater Light 4" }, disposition: "access_hold_separate_from_docks", published_access_status: "Municipal plan confirms a designated fishing program but no segment map was found.", live_access_status: "Do not represent as open until signs and route are verified.", hours_passes_fees: "Unknown outside normal marina operations.", seasonal_restrictions: "Navigation, weather, ice, occupancy, and posted restrictions apply.", construction_closure: "No current closure found.", source_ids: ["USCG_LIGHT_LIST_2025", "HARRISVILLE_REC_PLAN", "HARRISVILLE_HARBOR_RULES"], unresolved_limitations: "Map the designated harbor-edge segments independently; do not transfer dock permission to the breakwater." },
  ],
};

const candidate = {
  st_joseph_mi: ["chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "lake_trout", "yellow_perch", "lake_whitefish"],
  south_haven_mi: ["chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "lake_trout", "walleye", "smallmouth_bass", "freshwater_drum", "yellow_perch", "lake_whitefish", "round_whitefish", "channel_catfish", "largemouth_bass", "northern_pike", "bluegill"],
  holland_mi: ["chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "lake_trout", "walleye", "smallmouth_bass", "freshwater_drum", "yellow_perch", "lake_whitefish", "round_whitefish", "channel_catfish", "largemouth_bass", "white_bass", "bluegill"],
  lexington_mi: ["chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "lake_trout", "walleye", "smallmouth_bass", "freshwater_drum", "yellow_perch", "channel_catfish", "largemouth_bass", "atlantic_salmon", "northern_pike", "white_bass", "bluegill"],
  harrisville_mi: ["chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "atlantic_salmon"],
};
const hold = {
  st_joseph_mi: ["walleye", "smallmouth_bass", "freshwater_drum", "round_whitefish", "channel_catfish", "northern_pike"],
  south_haven_mi: ["white_perch", "white_bass"],
  holland_mi: ["northern_pike", "white_perch"],
  lexington_mi: ["lake_whitefish", "round_whitefish"],
  harrisville_mi: ["lake_trout", "walleye", "channel_catfish"],
};
const mandatory = {
  st_joseph_mi: ["brown_trout", "chinook_salmon", "coho_salmon", "lake_trout", "lake_whitefish", "steelhead", "yellow_perch", "freshwater_drum", "smallmouth_bass", "walleye", "channel_catfish"],
  south_haven_mi: ["brown_trout", "chinook_salmon", "coho_salmon", "lake_trout", "lake_whitefish", "steelhead", "walleye", "yellow_perch", "largemouth_bass", "smallmouth_bass", "freshwater_drum", "channel_catfish"],
  holland_mi: ["brown_trout", "chinook_salmon", "coho_salmon", "lake_trout", "lake_whitefish", "steelhead", "walleye", "yellow_perch", "channel_catfish", "smallmouth_bass", "largemouth_bass", "freshwater_drum", "northern_pike"],
  lexington_mi: ["atlantic_salmon", "chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "lake_trout", "walleye", "yellow_perch", "lake_whitefish", "smallmouth_bass", "northern_pike", "freshwater_drum", "channel_catfish"],
  harrisville_mi: ["atlantic_salmon", "chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "lake_trout", "walleye", "yellow_perch", "smallmouth_bass", "northern_pike", "freshwater_drum", "lake_whitefish"],
};

const rawPath = path.join(dir, "michigan-creel-pier-dock-raw.json");
const rawText = fs.readFileSync(rawPath, "utf8");
const raw = JSON.parse(rawText);
const dashboardSpecies = {
  "Chinook Salmon": "chinook_salmon", "Coho Salmon": "coho_salmon", Steelhead: "steelhead",
  "Brown Trout": "brown_trout", "Lean Lake Trout": "lake_trout", Walleye: "walleye",
  "Smallmouth Bass": "smallmouth_bass", Drum: "freshwater_drum", "Yellow Perch": "yellow_perch",
  "Lake Whitefish": "lake_whitefish", "Round Whitefish": "round_whitefish",
  "Channel Catfish": "channel_catfish", "Largemouth Bass": "largemouth_bass",
  "Atlantic Salmon": "atlantic_salmon", "Northern Pike": "northern_pike", Burbot: "burbot",
  "White Perch": "white_perch", "White Bass": "white_bass", Bluegill: "bluegill",
};

function buildReduced() {
  const rows = [];
  for (const city of cityDefs) {
    const cityRows = raw.rows.filter((row) => city.ports.includes(row.port));
    const surveyYears = [...new Set(cityRows.map((row) => row.year).filter(Number.isFinite))].sort((a, b) => a - b);
    for (const speciesId of species) {
      const matching = cityRows.filter((row) => dashboardSpecies[row.species] === speciesId);
      const positive = matching.filter((row) => ["Catch", "Harvest"].includes(row.estimate_type) && Number(row.estimate) > 0);
      const catchEstimateSum = matching.filter((row) => row.estimate_type === "Catch").reduce((sum, row) => sum + Number(row.estimate || 0), 0);
      const harvestEstimateSum = matching.filter((row) => row.estimate_type === "Harvest").reduce((sum, row) => sum + Number(row.estimate || 0), 0);
      rows.push({
        city_id: city.id,
        display_name: city.name,
        species_id: speciesId,
        dashboard_labels: [...new Set(matching.map((row) => row.species))].sort(),
        raw_row_count: matching.length,
        positive_estimate_years: [...new Set(positive.map((row) => row.year))].sort((a, b) => a - b),
        positive_estimate_months: [...new Set(positive.map((row) => row.month).filter(Number.isFinite))].sort((a, b) => a - b),
        catch_estimate_sum: Math.round(catchEstimateSum * 1000) / 1000,
        harvest_estimate_sum: Math.round(harvestEstimateSum * 1000) / 1000,
        caution: "Sums preserve dashboard estimate types across surveyed port-month-years and are not structure-specific totals, rates, scores, or confidence adjustments.",
      });
    }
    rows.find((row) => row.city_id === city.id).city_survey_years = surveyYears;
  }
  return {
    schema_version: "piercast-pass1-creel-reduction-v1",
    source_last_refreshed: raw.source_last_refreshed,
    raw_sha256: crypto.createHash("sha256").update(rawText).digest("hex"),
    rules: [
      "Catch and Harvest remain separate estimate types.",
      "Positive estimates identify leads; they do not admit a numeric calibration.",
      "Port Pier/Dock rows may pool structures, and unsampled months or sampled zeros do not establish absence.",
    ],
    city_coverage: cityDefs.map((city) => {
      const rowsForCity = raw.rows.filter((row) => city.ports.includes(row.port));
      const years = [...new Set(rowsForCity.map((row) => row.year).filter(Number.isFinite))].sort((a, b) => a - b);
      return { city_id: city.id, matched_port_labels: [...new Set(rowsForCity.map((row) => row.port))], raw_rows: rowsForCity.length, survey_years: years, first_year: years[0] ?? null, last_year: years.at(-1) ?? null };
    }),
    rows,
  };
}
const reduced = buildReduced();
const reducedIndex = new Map(reduced.rows.map((row) => [`${row.city_id}/${row.species_id}`, row]));

const citySourceIds = {
  st_joseph_mi: ["MI_BETTER_WATERS", "MI_ROADMAP_LM", "STJ_BERRIEN_FISH", "STJ_SILVER_BEACH", "STJ_TISCORNIA"],
  south_haven_mi: ["MI_BETTER_WATERS", "MI_ROADMAP_LM", "MI_CREEL_DASHBOARD", "SOUTH_HAVEN_SAFETY", "SOUTH_HAVEN_FISHING"],
  holland_mi: ["MI_BETTER_WATERS", "MI_ROADMAP_LM", "MI_CREEL_DASHBOARD", "HOLLAND_DNR_PARK", "HOLLAND_BIG_RED"],
  lexington_mi: ["MI_ROADMAP_LH", "MI_CREEL_DASHBOARD", "LEX_CLOSURE_2026", "LEX_STATE_HARBOR"],
  harrisville_mi: ["MI_ROADMAP_LH", "MI_CREEL_DASHBOARD", "HARRISVILLE_LHCFAC_2025", "HARRISVILLE_HARBOR_RULES"],
};

const specialSources = {
  "lexington_mi/atlantic_salmon": ["LEX_ATLANTIC_DNR", "LEX_ATLANTIC_STOCK_2024", "LEX_ENFORCEMENT_2024"],
  "harrisville_mi/atlantic_salmon": ["HARRISVILLE_LHCFAC_2022_OCT", "HARRISVILLE_LHCFAC_2025"],
  "harrisville_mi/coho_salmon": ["HARRISVILLE_LHCFAC_2022", "HARRISVILLE_LHCFAC_2025"],
  "harrisville_mi/brown_trout": ["HARRISVILLE_LHCFAC_2023"],
  "harrisville_mi/steelhead": ["HARRISVILLE_STEELHEAD_STOCK_2025"],
};

function decisionClaim(cityId, speciesId, decision, quant) {
  if (quant.positive_estimate_years.length > 0) {
    return `Official ${display[cityId]} port Pier/Dock estimates preserve positive ${speciesId} estimates in ${quant.positive_estimate_years.length} survey year(s) across month numbers ${quant.positive_estimate_months.join(", ")}. Structure allocation and numeric admission remain for Pass 2.`;
  }
  const exact = {
    "st_joseph_mi/chinook_salmon": "Michigan DNR names St. Joseph Pier and Berrien County names the South Pier fishery; both pierheads are retained as separate subareas.",
    "st_joseph_mi/coho_salmon": "Michigan DNR and Berrien County name coho at the St. Joseph pier fishery; quantify north/south allocation in Pass 2.",
    "st_joseph_mi/steelhead": "Michigan DNR and Berrien County name steelhead/rainbow trout at the St. Joseph pier fishery.",
    "st_joseph_mi/brown_trout": "Michigan DNR and Berrien County name brown trout at St. Joseph Pier/South Pier.",
    "st_joseph_mi/lake_trout": "Michigan DNR explicitly names lake trout at St. Joseph Pier; seasonal port guidance includes cold-water months.",
    "st_joseph_mi/yellow_perch": "Michigan DNR names yellow perch at St. Joseph Pier and the county describes lake perch at the South Pier.",
    "st_joseph_mi/lake_whitefish": "Michigan DNR explicitly names lake whitefish at St. Joseph Pier; the county's generic whitefish wording is only corroboration.",
    "holland_mi/lake_trout": "Michigan DNR lists lake trout for grouped Grand Haven/Holland piers and the roadmap lists Holland/Port Sheldon across cold and warm seasons; Pass 2 must resolve grouping/allocation.",
    "harrisville_mi/coho_salmon": "DNR advisory minutes report coho caught from permitted unoccupied Harrisville docks in fall 2025 and through harbor ice in 2022.",
    "harrisville_mi/atlantic_salmon": "Lake Huron roadmap and advisory records support a recurring exact-harbor Atlantic lead, but proposed Harrisville stocking must not be treated as implemented.",
  }[`${cityId}/${speciesId}`];
  if (exact) return exact;
  if (decision === "hold") return "A named-port, connected-water, stocking, generic-taxon, or sparse Pier/Dock lead exists, but recurring intentional opportunity at the covered structure remains unresolved.";
  if (decision === "exclude") return "The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence.";
  return "Named agency or local structure evidence is sufficient to require Pass 2 quantification; Pass 1 assigns no score or numeric admission.";
}

const decisions = [];
for (const city of cityDefs) {
  for (const speciesId of species) {
    const key = `${city.id}/${speciesId}`;
    const disposition = candidate[city.id].includes(speciesId) ? "research_candidate" : hold[city.id].includes(speciesId) ? "hold" : "exclude";
    const quant = reducedIndex.get(key);
    const ids = new Set(citySourceIds[city.id]);
    if (quant.raw_row_count > 0) ids.add("MI_CREEL_DASHBOARD");
    for (const id of specialSources[key] ?? []) ids.add(id);
    decisions.push({
      pair_key: key,
      city_id: city.id,
      display_name: city.name,
      species_id: speciesId,
      aliases_reviewed: aliases[speciesId],
      months_reviewed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      evidence_channels_reviewed: ["current agency inventory", "historical/current Pier/Dock estimates", "port seasonal guides", "stocking/management records", "exact access/structure sources", "connected-water evidence kept separate"],
      mandatory_lead: mandatory[city.id].includes(speciesId),
      decision: disposition,
      numeric_admission: "not_assessed_in_pass_1",
      claim: decisionClaim(city.id, speciesId, disposition, quant),
      quantitative_summary: { raw_row_count: quant.raw_row_count, positive_estimate_year_count: quant.positive_estimate_years.length, positive_estimate_years: quant.positive_estimate_years, positive_estimate_months: quant.positive_estimate_months },
      source_ids: [...ids],
      next_evidence: disposition === "research_candidate"
        ? "In Pass 2, test recurring intentional covered-structure opportunity, effort denominator, annual shape, mode/structure allocation, and evidence grade before any numeric admission."
        : disposition === "hold"
          ? "Reopen in Pass 2; seek recurring exact-structure targeting and resolve generic taxonomy, sparse years, or mode/geography mismatch."
          : "Reopen in Pass 2 and change only if new covered-structure evidence appears; never treat this row as proof of biological absence.",
    });
  }
}
const decisionCounts = Object.fromEntries(["research_candidate", "hold", "exclude"].map((name) => [name, decisions.filter((row) => row.decision === name).length]));
const speciesDecisionArtifact = {
  schema_version: "piercast-five-city-pass1-species-decisions-v1",
  reviewed_at: REVIEW_DATE,
  scoring_status: "research_only_no_numeric_scores",
  rule: "Research candidate queues Pass 2 quantification; hold preserves a credible unresolved lead; exclude means no reviewed covered-structure lead, not biological absence.",
  city_count: cityDefs.length,
  species_count: species.length,
  decision_count: decisions.length,
  counts: decisionCounts,
  decisions,
};

const outsideSpecies = ["pink_salmon", "rainbow_smelt", "splake", "cisco_lake_herring", "common_carp"];
const mandatoryOutside = {
  st_joseph_mi: ["rainbow_smelt"],
  south_haven_mi: ["rainbow_smelt"],
  holland_mi: ["rainbow_smelt"],
  lexington_mi: ["pink_salmon", "rainbow_smelt"],
  harrisville_mi: ["pink_salmon", "rainbow_smelt"],
};
const outOverrides = {
  "south_haven_mi/pink_salmon": ["hold", "One positive 2002 October port Pier/Dock estimate is preserved; too sparse and old for catalog action."],
  "lexington_mi/pink_salmon": ["research_candidate", "The Lake Huron roadmap names spring/summer pink salmon at Lexington; exact-breakwater recurrence remains to quantify."],
  "lexington_mi/common_carp": ["hold", "A single 2013 July port Pier/Dock estimate is preserved; recurring targeting is unresolved."],
  "harrisville_mi/rainbow_smelt": ["hold", "Advisory records describe smelt as forage in the broader port fishery, not a documented covered-structure target."],
};
const outLeads = [];
for (const city of cityDefs) {
  for (const speciesId of outsideSpecies) {
    const key = `${city.id}/${speciesId}`;
    const override = outOverrides[key];
    const decision = override?.[0] ?? (speciesId === "rainbow_smelt" ? "hold" : "exclude");
    const sourceIds = new Set(citySourceIds[city.id]);
    if (["south_haven_mi", "holland_mi", "lexington_mi", "harrisville_mi"].includes(city.id)) sourceIds.add("MI_CREEL_DASHBOARD");
    outLeads.push({ city_id: city.id, display_name: city.name, species_id: speciesId, aliases_reviewed: speciesId === "cisco_lake_herring" ? ["cisco", "lake herring"] : [speciesId.replaceAll("_", " ")], months_reviewed: [1,2,3,4,5,6,7,8,9,10,11,12], mandatory_lead: mandatoryOutside[city.id].includes(speciesId), decision, catalog_action: "none_in_pass_1", claim: override?.[1] ?? (decision === "hold" ? "A required lead was reviewed, but no recurring exact covered-structure target fishery was established." : "No credible recurring covered-structure lead was found in the reviewed record; this is not biological absence."), source_ids: [...sourceIds], next_step: "Reopen only through the global new-species process; do not silently add to runtime types, artwork, contracts, or calibrations." });
  }
}
for (const row of [
  ["south_haven_mi", "rock_bass", "hold", "One recent survey year provides a sparse Pier/Dock lead."],
  ["south_haven_mi", "pumpkinseed", "hold", "A single historical port estimate is preserved."],
  ["holland_mi", "rock_bass", "hold", "A single historical port estimate is preserved."],
  ["lexington_mi", "rock_bass", "research_candidate", "Recurring port Pier/Dock estimates span many years and months."],
  ["lexington_mi", "pumpkinseed", "research_candidate", "Recurring port Pier/Dock estimates span multiple years."],
  ["lexington_mi", "muskellunge", "hold", "One 2018 port Pier/Dock estimate is preserved."],
  ["st_joseph_mi", "suckers_rock_bass_crappie_complex", "exclude", "Connected-water/general-lake review did not establish a covered-pier target fishery."],
]) {
  outLeads.push({ city_id: row[0], display_name: display[row[0]], species_id: row[1], aliases_reviewed: [row[1].replaceAll("_", " ")], months_reviewed: [1,2,3,4,5,6,7,8,9,10,11,12], mandatory_lead: false, decision: row[2], catalog_action: "none_in_pass_1", claim: row[3], source_ids: citySourceIds[row[0]], next_step: "Reopen only through the global new-species process." });
}
const outArtifact = { schema_version: "piercast-pass1-out-of-catalog-leads-v1", reviewed_at: REVIEW_DATE, scoring_status: "leads_only_no_catalog_or_runtime_change", required_global_leads: outsideSpecies, mandatory_city_leads: mandatoryOutside, leads: outLeads };

const stocking = {
  schema_version: "piercast-pass1-stocking-review-v1",
  reviewed_at: REVIEW_DATE,
  rule: "Stocking creates a management/occurrence lead but never by itself establishes covered-structure magnitude.",
  events: [
    { city_id: "lexington_mi", species_id: "atlantic_salmon", date: "2024-04-22", number_stocked: 26667, life_stage: "yearling age-1", method: "shore stocking", coordinates: [43.2675, -82.5266], source_ids: ["LEX_ATLANTIC_STOCK_2024"] },
    { city_id: "harrisville_mi", species_id: "steelhead", date: "2025-04-24", number_stocked: 11250, life_stage: "yearling age-1", method: "shore stocking", coordinates: null, source_ids: ["HARRISVILLE_STEELHEAD_STOCK_2025"] },
  ],
  reviewed_non_events: [
    { city_id: "harrisville_mi", species_id: "atlantic_salmon", finding: "2025 advisory minutes discuss Harrisville as a possible future Atlantic stocking site; no reviewed event established implementation.", source_ids: ["HARRISVILLE_LHCFAC_2025"] },
    { city_id: "harrisville_mi", species_id: "coho_salmon", finding: "Advisory records discuss local fall fingerlings and exact dock catches, but Pass 2 must reconcile the event record and returns before magnitude work.", source_ids: ["HARRISVILLE_LHCFAC_2025"] },
    { city_id: "st_joseph_mi", species_id: "steelhead", finding: "Connected-river stocking is not transferred to pier magnitude; exact-pier agency inventory remains the biological basis.", source_ids: ["MI_BETTER_WATERS", "MI_CREEL_METHOD"] },
  ],
};

function csvCell(value) {
  const text = Array.isArray(value) ? value.join("|") : value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
function csv(headers, rows) {
  return `${[headers, ...rows.map((row) => headers.map((key) => row[key]))].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

const decisionCsvHeaders = ["city_id", "display_name", "species_id", "decision", "mandatory_lead", "positive_estimate_year_count", "positive_estimate_years", "positive_estimate_months", "source_ids", "claim"];
const decisionCsvRows = decisions.map((row) => ({ ...row, positive_estimate_year_count: row.quantitative_summary.positive_estimate_year_count, positive_estimate_years: row.quantitative_summary.positive_estimate_years, positive_estimate_months: row.quantitative_summary.positive_estimate_months }));
const reducedCsvHeaders = ["city_id", "display_name", "species_id", "dashboard_labels", "raw_row_count", "positive_estimate_years", "positive_estimate_months", "catch_estimate_sum", "harvest_estimate_sum", "caution"];

const sourceIds = new Set(sources.map((item) => item.id));
const sourceRequiredFields = ["id", "url", "publisher", "title", "publication_date", "review_date", "exact_geography", "fishing_mode", "season_represented", "claim_supported", "permitted_use", "limitations", "evidence_grade"];
const structureRequiredFields = ["city_id", "structure_id", "structure_name", "municipality_owner", "route_address", "coordinates", "disposition", "published_access_status", "live_access_status", "hours_passes_fees", "seasonal_restrictions", "construction_closure", "source_ids", "unresolved_limitations"];
const allRefs = [
  ...boundaries.structures.flatMap((item) => item.source_ids),
  ...boundaries.structures.map((item) => item.coordinates?.source_id).filter(Boolean),
  ...decisions.flatMap((item) => item.source_ids),
  ...outLeads.flatMap((item) => item.source_ids),
  ...stocking.events.flatMap((item) => item.source_ids),
  ...stocking.reviewed_non_events.flatMap((item) => item.source_ids),
];
const pairs = decisions.map((item) => item.pair_key);
const expectedPairs = cityDefs.flatMap((city) => species.map((speciesId) => `${city.id}/${speciesId}`));
const mandatoryCatalogMissing = Object.entries(mandatory).flatMap(([cityId, list]) => list.filter((speciesId) => !decisions.some((row) => row.city_id === cityId && row.species_id === speciesId && row.mandatory_lead)).map((speciesId) => `${cityId}/${speciesId}`));
const mandatoryOutsideMissing = Object.entries(mandatoryOutside).flatMap(([cityId, list]) => list.filter((speciesId) => !outLeads.some((row) => row.city_id === cityId && row.species_id === speciesId && row.mandatory_lead)).map((speciesId) => `${cityId}/${speciesId}`));
const mandatoryMissing = [...mandatoryCatalogMissing, ...mandatoryOutsideMissing];
const checks = {
  exactly_five_cities: cityDefs.length === 5 && new Set(decisions.map((row) => row.city_id)).size === 5,
  stable_city_ids_and_display_names: JSON.stringify(cityDefs.map(({ id, name }) => ({ id, name }))) === JSON.stringify([
    { id: "st_joseph_mi", name: "St. Joseph" },
    { id: "south_haven_mi", name: "South Haven" },
    { id: "holland_mi", name: "Holland" },
    { id: "lexington_mi", name: "Lexington" },
    { id: "harrisville_mi", name: "Harrisville" },
  ]),
  exactly_nineteen_species: species.length === 19,
  catalog_species_order_matches: JSON.stringify(species) === JSON.stringify(["chinook_salmon", "coho_salmon", "steelhead", "brown_trout", "lake_trout", "walleye", "smallmouth_bass", "freshwater_drum", "yellow_perch", "lake_whitefish", "round_whitefish", "channel_catfish", "largemouth_bass", "atlantic_salmon", "northern_pike", "burbot", "white_perch", "white_bass", "bluegill"]),
  exactly_nineteen_per_city: cityDefs.every((city) => decisions.filter((row) => row.city_id === city.id).length === 19),
  exactly_ninety_five_decisions: decisions.length === 95,
  unique_city_species_cells: new Set(pairs).size === 95,
  no_missing_cells: expectedPairs.every((key) => pairs.includes(key)),
  valid_dispositions_only: decisions.every((row) => ["research_candidate", "hold", "exclude"].includes(row.decision)),
  all_twelve_months_reviewed: decisions.every((row) => row.months_reviewed.length === 12 && row.months_reviewed.every((month, index) => month === index + 1)),
  alternate_names_reviewed: decisions.every((row) => row.aliases_reviewed.length > 0),
  all_decision_records_complete: decisions.every((row) => row.claim && row.next_evidence && row.source_ids.length > 0 && row.evidence_channels_reviewed.length >= 6),
  all_source_references_resolve: allRefs.every((id) => sourceIds.has(id)),
  no_duplicate_source_ids: sourceIds.size === sources.length,
  all_source_records_complete: sources.every((row) => sourceRequiredFields.every((field) => row[field] != null && row[field] !== "")),
  every_structure_has_disposition: boundaries.structures.every((row) => row.disposition),
  all_structure_records_complete: boundaries.structures.every((row) => structureRequiredFields.every((field) => row[field] != null && row[field] !== "") && row.source_ids.length > 0 && Number.isFinite(row.coordinates.latitude) && Number.isFinite(row.coordinates.longitude) && row.coordinates.source_id),
  every_mandatory_lead_reviewed: mandatoryMissing.length === 0,
  all_required_out_of_catalog_leads_per_city: cityDefs.every((city) => outsideSpecies.every((speciesId) => outLeads.some((row) => row.city_id === city.id && row.species_id === speciesId))),
  all_out_of_catalog_records_complete: outLeads.every((row) => row.aliases_reviewed.length > 0 && row.months_reviewed.length === 12 && row.claim && row.source_ids.length > 0 && row.catalog_action === "none_in_pass_1"),
  no_numeric_scores_or_admission: decisions.every((row) => row.numeric_admission === "not_assessed_in_pass_1" && row.score == null && row.F == null && row.A == null && row.T == null),
};
const validation = {
  schema_version: "piercast-pass1-validation-v1",
  generated_at: REVIEW_DATE,
  status: Object.values(checks).every(Boolean) ? "pass" : "fail",
  checks,
  counts: { cities: cityDefs.length, catalog_species: species.length, decisions: decisions.length, unique_pairs: new Set(pairs).size, structures: boundaries.structures.length, sources: sources.length, out_of_catalog_leads: outLeads.length, ...decisionCounts },
  unresolved_source_references: [...new Set(allRefs.filter((id) => !sourceIds.has(id)))],
  missing_mandatory_leads: mandatoryMissing,
  raw_extract: { rows: raw.rows.length, sha256: crypto.createHash("sha256").update(rawText).digest("hex"), retrieved_at: raw.retrieved_at, source_last_refreshed: raw.source_last_refreshed },
  pass_boundary: { numeric_scores_created: false, runtime_calibrations_changed: false, migrations_created: false, public_manifest_changed: false, deployments_performed: false, app_builds_performed: false },
};
if (validation.status !== "pass") throw new Error(`Validation failed: ${JSON.stringify(validation, null, 2)}`);

const cityRows = cityDefs.map((city) => {
  const coverage = reduced.city_coverage.find((row) => row.city_id === city.id);
  const counts = Object.fromEntries(["research_candidate", "hold", "exclude"].map((name) => [name, decisions.filter((row) => row.city_id === city.id && row.decision === name).length]));
  return `| ${city.name} | ${coverage.raw_rows.toLocaleString("en-US")} | ${coverage.first_year ?? "none"}-${coverage.last_year ?? "none"} | ${counts.research_candidate} | ${counts.hold} | ${counts.exclude} |`;
}).join("\n");
const criticalFindings = [
  "St. Joseph: South Pier from Silver Beach and North Pier from Tiscornia are both covered, but separately labeled. The official dashboard filter did not resolve a St. Joseph port label, so no quantitative zero is inferred.",
  "South Haven: both pierheads are covered; lower Harborwalk seawalls are separate. Black River Park and SHOUT Park platforms were investigated and excluded as upstream River structures.",
  "Holland: north pier and the state-park channel walkway are covered. The south-pier/Big Red pedestrian route is excluded because the lighthouse commission says there is currently no public walkway and private property surrounds the approaches.",
  "Lexington: biological research is retained, but the entire marina is closed from September 8, 2026 through May 28, 2027. Breakwater pedestrian/fishing permission is unresolved, so the city cannot be represented as currently accessible.",
  "Harrisville: 2025 advisory minutes support fishing from unoccupied docks, while harbor rules restrict fishing to designated areas. Dock occupancy, designated zones, off-season access, and both breakwaters require live confirmation.",
];
const pass1Report = `# PierCast St. Joseph–Harrisville Pass 1 report

Reviewed ${REVIEW_DATE}. This package completes the exact-structure, access, and exhaustive species-inventory pass for St. Joseph, South Haven, Holland, Lexington, and Harrisville. It is research-only: no Formula v3 scores, runtime calibrations, migrations, public visibility changes, deployments, or app builds were created.

## Result

- Five stable IDs and display names are frozen.
- All 19 current catalog species were reviewed for every city: exactly 95 unique decisions.
- Every cell records all 12 months reviewed, alternate names, evidence channels, source references, a disposition, and the next evidence requirement.
- ${decisionCounts.research_candidate} cells are research candidates, ${decisionCounts.hold} are holds, and ${decisionCounts.exclude} are excludes.
- Exclude means the reviewed record did not establish the covered pier fishery; it never asserts biological absence.
- Five required out-of-catalog species were reviewed for every city, plus seven additional leads.

## Frozen physical boundaries and access

${criticalFindings.map((text) => `- ${text}`).join("\n")}

The authoritative field-level record is [site-boundaries.json](./site-boundaries.json). Access is a separate gate from biological opportunity. Same-day operator signs, barricades, waves, ice, construction, and dock occupancy supersede this research snapshot.

## Quantitative inventory

The preserved Michigan DNR dashboard extraction contains ${raw.rows.length.toLocaleString("en-US")} monthly Pier/Dock rows. The reduction keeps Catch and Harvest separate and does not convert sums into rates or scores.

| City | Raw rows | Survey span | Candidate | Hold | Exclude |
| --- | ---: | --- | ---: | ---: | ---: |
${cityRows}

St. Joseph's empty result reflects unresolved dashboard naming/filter coverage, not a sampled zero. South Haven and Lexington have long recurring series; Holland has a more intermittent series; Harrisville's dashboard series is sparse and historical, so recent advisory evidence is preserved separately.

## Evidence discipline

- Exact pier/dock rows, port-level roadmaps, stocking, upstream rivers, boats/charters, and neighboring ports remain distinct.
- A sampled zero or absent row outside a real season is not evidence of absence.
- Stocking is a lead, not exact-pier magnitude. Lexington Atlantic salmon is supported by stocking, multiple Pier/Dock years, an agency program page, and exact-harbor occurrence. Harrisville Atlantic stocking remains proposed/unverified; its harbor opportunity is evaluated from harbor/roadmap evidence instead.
- Current and historical evidence were both retained. Winter and shoulder seasons were explicitly reviewed even where the dashboard survey did not sample them.
- Generic labels such as catfish, bass, trout, perch, and whitefish were not silently translated to a catalog species.

## Material Pass 2 uncertainties

1. Resolve St. Joseph's official dashboard port label or original estimate tables; do not manufacture zeros.
2. Allocate multi-structure port rows without assuming equal opportunity at both pierheads.
3. Reconcile Holland's grouped agency inventory and Holland/Port Sheldon roadmap with Holland-only Pier/Dock rows.
4. Quantify Lexington only as biological research while construction access remains gated; obtain post-project DNR surface permission before implementation.
5. Obtain Harrisville's current designated-fishing map, dock/off-season policy, and direct structure allocation for lake trout and walleye.
6. Reopen every one of the 95 cells, including holds and excludes, under Grade A/B numeric-admission rules.

## Completion proof

[validation-report.json](./validation-report.json) passes every required invariant. The deterministic generator was run and then rerun with \`--check\`. Pass 2 has not begun.
`;

const handoff = `# PierCast St. Joseph–Harrisville Pass 2 handoff

Pass 1 is complete as of ${REVIEW_DATE}. Do not treat a research candidate as an admitted Formula v3 pair. Pass 2 must explicitly reopen all 95 catalog cells.

## Inputs

- [species-decisions.json](./species-decisions.json): complete 95-cell queue and evidence rationale.
- [species-decision-matrix.csv](./species-decision-matrix.csv): flat review matrix.
- [michigan-creel-pier-dock-raw.json](./michigan-creel-pier-dock-raw.json): preserved official dashboard response rows.
- [michigan-creel-pier-dock-reduced.json](./michigan-creel-pier-dock-reduced.json) and CSV: deterministic per-city/species reduction.
- [site-boundaries.json](./site-boundaries.json): structure-by-structure access gates.
- [source-ledger.json](./source-ledger.json): claim permissions and limitations.
- [stocking-records-reviewed.json](./stocking-records-reviewed.json): stocking events and explicit non-events/proposals.
- [out-of-catalog-leads.json](./out-of-catalog-leads.json): globally gated new-species leads.

## Required sequence

1. Reopen all 95 decisions; seek newer or more exact structure evidence before preserving any hold or exclude.
2. Establish recurring intentional local pier opportunity and a defensible annual shape. Only Grade A/B pairs may receive numbers; uncertainty never becomes a low placeholder score.
3. Keep structure allocation explicit. South Haven and St. Joseph each have two pierheads; Holland has north pier plus channel walkway; Lexington and Harrisville have unresolved access segments.
4. Treat survey gaps by actual species season. Build cold-season lake trout, whitefish, brown-trout, steelhead, and Atlantic reviews independently from warm-season creel coverage.
5. Audit Lexington/Harrisville Atlantic salmon separately. Lexington has 2015-2022 Pier/Dock positives, a 2024 stocking event, and exact-harbor occurrence; Harrisville has harbor/roadmap evidence but no verified Atlantic stocking event in this review.
6. Perform the required lake-trout all-city due-diligence audit and current 2026 regulation review.
7. Compare each admitted pair with every established same-species city, generate 365-day audits at all required thermal fits, and preserve evidence confidence as disclosure rather than a multiplier.

## Access blockers that survive Pass 1

- Lexington is in an active full-marina closure through May 28, 2027; breakwater pedestrian permission is not resolved by the notice.
- Harrisville requires a current designated-fishing map and off-season dock policy.
- South Haven requires same-day red-flag/barricade status and exact lower-Harborwalk fishing segments.
- St. Joseph and Holland require same-day wave/ice/barricade checks; Holland's south pier remains excluded.

Pass 2 remains private research. It must not edit runtime configuration, migrations, deployments, or the 22-city public release manifest.
`;

const readme = `# St. Joseph–Harrisville PierCast Pass 1

Reproducible research-only onboarding package for five Michigan cities, reviewed ${REVIEW_DATE}.

## Reproduce and validate

From the repository root:

\`\`\`bash
node docs/onboarding/piercast/st-joseph-harrisville-2026-09-pass1/generate-pass1.mjs
node docs/onboarding/piercast/st-joseph-harrisville-2026-09-pass1/generate-pass1.mjs --check
\`\`\`

The generator reads the preserved raw dashboard snapshot and deterministically regenerates every derived JSON, CSV, Markdown, and validation artifact. To intentionally refresh the external snapshot (network required), run \`extract-michigan-creel.mjs\`, inspect source changes, then regenerate.

## Boundary

This directory assigns no numeric score and makes no runtime, migration, public-catalog, deployment, or build change. The five cities remain private research. The current 22-city public experience is untouched.

## Files

- \`PASS1_REPORT.md\` — findings, methods, and unresolved questions.
- \`PASS2_HANDOFF.md\` — disciplined next-pass queue.
- \`site-boundaries.json\` — 16 structure records with routes, coordinates, access, construction, disposition, and limitations.
- \`source-ledger.json\` — full mandatory source metadata.
- \`species-decisions.json\` / \`species-decision-matrix.csv\` — exactly 95 catalog decisions.
- \`out-of-catalog-leads.json\` — required global leads kept outside the catalog.
- \`stocking-records-reviewed.json\` — stocking evidence kept separate from pier magnitude.
- \`michigan-creel-pier-dock-raw.json\` — preserved official raw extract.
- \`michigan-creel-pier-dock-reduced.json\` / \`.csv\` — deterministic reduction.
- \`validation-report.json\` — machine-checkable completion proof.
- \`extract-michigan-creel.mjs\` — external-source snapshot extractor.
- \`generate-pass1.mjs\` — deterministic generator and check mode.
`;

const ledger = { schema_version: "piercast-pass1-source-ledger-v2", reviewed_at: REVIEW_DATE, rules: ["Every referenced claim must obey permitted_use and limitations.", "Access/closure, biological occurrence, quantitative magnitude, and legal regulation are separate evidence dimensions.", "Search snippets were discovery aids only; ledger URLs point to the underlying source."], sources };
const files = new Map([
  ["README.md", readme],
  ["PASS1_REPORT.md", pass1Report],
  ["PASS2_HANDOFF.md", handoff],
  ["site-boundaries.json", `${JSON.stringify(boundaries, null, 2)}\n`],
  ["source-ledger.json", `${JSON.stringify(ledger, null, 2)}\n`],
  ["species-decisions.json", `${JSON.stringify(speciesDecisionArtifact, null, 2)}\n`],
  ["species-decision-matrix.csv", csv(decisionCsvHeaders, decisionCsvRows.map((row) => ({ ...row, source_ids: row.source_ids })))],
  ["out-of-catalog-leads.json", `${JSON.stringify(outArtifact, null, 2)}\n`],
  ["stocking-records-reviewed.json", `${JSON.stringify(stocking, null, 2)}\n`],
  ["michigan-creel-pier-dock-reduced.json", `${JSON.stringify(reduced, null, 2)}\n`],
  ["michigan-creel-pier-dock-reduced.csv", csv(reducedCsvHeaders, reduced.rows)],
  ["validation-report.json", `${JSON.stringify(validation, null, 2)}\n`],
]);

if (checkMode) {
  const drift = [];
  for (const [name, expected] of files) {
    const filePath = path.join(dir, name);
    if (!fs.existsSync(filePath)) drift.push(`${name}: missing`);
    else if (fs.readFileSync(filePath, "utf8") !== expected) drift.push(`${name}: content drift`);
  }
  if (drift.length) throw new Error(`Pass 1 artifact check failed:\n${drift.join("\n")}`);
  console.log(`PASS: ${files.size} generated artifacts match; 5 cities, 19 species each, 95 unique decisions, ${boundaries.structures.length} structures, ${sources.length} sources.`);
} else {
  for (const [name, contents] of files) fs.writeFileSync(path.join(dir, name), contents);
  console.log(`Wrote ${files.size} artifacts; validation status ${validation.status}.`);
}
