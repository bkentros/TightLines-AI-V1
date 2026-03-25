#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env
/**
 * How's Fishing — Targeted Scenario Generator
 *
 * Pulls REAL historical weather from Open-Meteo archive API (free, no key),
 * NOAA Tides API for coastal scenarios, builds the full env_data structure
 * exactly as get-environment does, runs it through the engine, and writes
 * a JSONL file matching the format of how-fishing-live-audit-results.jsonl.
 *
 * Key design decisions:
 *  - Open-Meteo requested with timezone=UTC → hourly.time values are genuine UTC
 *  - hourly_air_temp_f/cloud points stored as {time_utc: "...Z", value} so
 *    hourlyPointsTo24ArrayForLocalDate can convert UTC→local correctly
 *  - env_data.timezone = sc.local_timezone so tzForHourly is the target tz
 *  - 15 days fetched (target - 14d through target) → daily[14] = target day
 *
 * Run:
 *   cd TightLinesAI && deno run --allow-net --allow-read --allow-write --allow-env \
 *     scripts/how-fishing-audit/generate-targeted-scenarios.ts \
 *     how-fishing-targeted-audit.jsonl
 */

import {
  buildSharedEngineRequestFromEnvData,
  runHowFishingReport,
} from "../../supabase/functions/_shared/howFishingEngine/index.ts";

const outPath = Deno.args[0] ?? "how-fishing-targeted-audit.jsonl";
const enc = new TextEncoder();

// ── Scenario definitions ───────────────────────────────────────────────────────

type ScenarioDef = {
  id: string;
  notes: string;
  latitude: number;
  longitude: number;
  local_date: string;
  local_timezone: string;
  context: "freshwater_lake_pond" | "freshwater_river" | "coastal";
  region_key: string;
  state_code: string;
  /** Passed through to env_data for mountain_alpine resolution (matches production). */
  altitude_ft?: number;
  tide_station_id?: string;
  expect_band?: string;
};

const SCENARIOS: ScenarioDef[] = [
  // ── midwest_interior — 8 scenarios (was only 2) ────────────────────────────
  {
    id: "midwest-interior-lake-springfield-il-apr",
    notes: "Spring bass pre-spawn Lake Springfield IL — water warming toward 55-62°F",
    latitude: 39.74, longitude: -89.69,
    local_date: "2024-04-12", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "midwest_interior", state_code: "IL",
  },
  {
    id: "midwest-interior-lake-ozarks-mo-jul",
    notes: "Peak summer Lake of the Ozarks MO — bass dawn and dusk top-water",
    latitude: 38.21, longitude: -92.63,
    local_date: "2024-07-14", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "midwest_interior", state_code: "MO",
  },
  {
    id: "midwest-interior-lake-shelbyville-il-oct",
    notes: "Fall crappie and walleye Lake Shelbyville IL — prime pre-winter feeding",
    latitude: 39.41, longitude: -88.71,
    local_date: "2024-10-08", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "midwest_interior", state_code: "IL",
  },
  {
    id: "midwest-interior-rend-lake-il-jan",
    notes: "Deep winter crappie Rend Lake IL — cold and sluggish",
    latitude: 38.00, longitude: -88.95,
    local_date: "2024-01-18", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "midwest_interior", state_code: "IL",
  },
  {
    id: "midwest-interior-wabash-river-in-may",
    notes: "Prime spring smallmouth Wabash River IN — post-spawn chase",
    latitude: 40.10, longitude: -87.13,
    local_date: "2024-05-18", local_timezone: "America/Chicago",
    context: "freshwater_river", region_key: "midwest_interior", state_code: "IN",
  },
  {
    id: "midwest-interior-iowa-river-ia-sep",
    notes: "Fall walleye Iowa River IA — Sep 2024 archive (runoff/wind vary; not a fixed Good gate)",
    latitude: 41.66, longitude: -91.53,
    local_date: "2024-09-20", local_timezone: "America/Chicago",
    context: "freshwater_river", region_key: "midwest_interior", state_code: "IA",
  },
  {
    id: "midwest-interior-illinois-river-il-jun",
    notes: "Early summer catfish and sauger Illinois River IL",
    latitude: 41.02, longitude: -89.46,
    local_date: "2024-06-10", local_timezone: "America/Chicago",
    context: "freshwater_river", region_key: "midwest_interior", state_code: "IL",
  },
  {
    id: "midwest-interior-lake-ozarks-mo-feb",
    notes: "Winter crappie Lake of the Ozarks MO — deep cold",
    latitude: 38.21, longitude: -92.63,
    local_date: "2024-02-10", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "midwest_interior", state_code: "MO",
  },

  // ── gulf_coast freshwater lake — 5 scenarios (was 0) ──────────────────────
  {
    id: "gulf-coast-toledo-bend-tx-mar",
    notes: "Prime spring bass Toledo Bend TX/LA — spawning flats",
    latitude: 31.20, longitude: -93.56,
    local_date: "2024-03-15", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "gulf_coast", state_code: "TX",
  },
  {
    id: "gulf-coast-sam-rayburn-tx-oct",
    notes: "Fall trophy bass Sam Rayburn TX — shad bait ball season",
    latitude: 31.08, longitude: -94.10,
    local_date: "2024-10-12", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "gulf_coast", state_code: "TX",
  },
  {
    id: "gulf-coast-lake-livingston-tx-aug",
    notes: "Summer heat Lake Livingston TX — catfish and night tactics",
    latitude: 30.71, longitude: -95.02,
    local_date: "2024-08-05", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "gulf_coast", state_code: "TX",
  },
  {
    id: "gulf-coast-ross-barnett-ms-nov",
    notes: "Late fall crappie Ross Barnett Reservoir MS — post-cold-front",
    latitude: 32.40, longitude: -89.99,
    local_date: "2024-11-08", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "gulf_coast", state_code: "MS",
  },
  {
    id: "gulf-coast-lake-conroe-tx-apr",
    notes: "Post-spawn bass recovery Lake Conroe TX — comfortable spring temps",
    latitude: 30.37, longitude: -95.58,
    local_date: "2024-04-20", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "gulf_coast", state_code: "TX",
  },

  // ── florida lake winter/spring/fall — 5 scenarios (was only Jul + Sep) ────
  {
    id: "florida-lake-okeechobee-jan",
    notes: "Winter LMB Lake Okeechobee — Jan 2024 archive (wind/high pressure affect score)",
    latitude: 26.94, longitude: -80.80,
    local_date: "2024-01-20", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "florida", state_code: "FL",
  },
  {
    id: "florida-lake-toho-feb",
    notes: "VALIDATE Feb fix: peak LMB pre-spawn Lake Toho FL — should score Good+",
    latitude: 28.18, longitude: -81.38,
    local_date: "2024-02-15", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "florida", state_code: "FL",
    expect_band: "Good",
  },
  {
    id: "florida-lake-istokpoga-nov",
    notes: "VALIDATE Nov fix: post-spawn recovery Lake Istokpoga FL — 60-68°F should score Good",
    latitude: 27.37, longitude: -81.27,
    local_date: "2024-11-10", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "florida", state_code: "FL",
    expect_band: "Good",
  },
  {
    id: "florida-rodman-reservoir-mar",
    notes: "Spring spawn Rodman Reservoir FL — Mar 2024 archive (pressure/precip vary)",
    latitude: 29.47, longitude: -81.77,
    local_date: "2024-03-10", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "florida", state_code: "FL",
  },
  {
    id: "florida-lake-kissimmee-jun",
    notes: "Summer heat Lake Kissimmee FL — bass deep, afternoon storm window",
    latitude: 27.88, longitude: -81.27,
    local_date: "2024-06-15", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "florida", state_code: "FL",
  },

  // ── "Should be Excellent" — 10 scenarios ──────────────────────────────────
  {
    id: "excellent-quabbin-reservoir-ma-oct",
    notes: "SHOULD BE EXCELLENT: prime NE fall lake — optimal bass/trout temps",
    latitude: 42.36, longitude: -72.34,
    local_date: "2024-10-05", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "northeast", state_code: "MA",
  },
  {
    id: "excellent-lake-erie-oh-oct",
    notes: "SHOULD BE EXCELLENT: peak walleye season Lake Erie western basin OH",
    latitude: 41.85, longitude: -82.73,
    local_date: "2024-10-08", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "great_lakes_upper_midwest", state_code: "OH",
  },
  {
    id: "excellent-mille-lacs-mn-sep",
    notes: "SHOULD BE EXCELLENT: prime walleye September Mille Lacs Lake MN",
    latitude: 46.24, longitude: -93.57,
    local_date: "2024-09-25", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "great_lakes_upper_midwest", state_code: "MN",
  },
  {
    id: "excellent-chesapeake-bay-md-oct",
    notes: "SHOULD BE EXCELLENT: fall striper blitz Chesapeake Bay MD",
    latitude: 38.72, longitude: -76.52,
    local_date: "2024-10-12", local_timezone: "America/New_York",
    context: "coastal", region_key: "southeast_atlantic", state_code: "MD",
    tide_station_id: "8575512",
  },
  {
    id: "excellent-deerfield-river-ma-sep",
    notes: "SHOULD BE EXCELLENT: peak fall brown trout Deerfield River MA",
    latitude: 42.68, longitude: -72.98,
    local_date: "2024-09-21", local_timezone: "America/New_York",
    context: "freshwater_river", region_key: "northeast", state_code: "MA",
  },
  {
    id: "excellent-matagorda-bay-tx-oct",
    notes: "SHOULD BE EXCELLENT: fall redfish blitz Matagorda Bay TX",
    latitude: 28.63, longitude: -96.01,
    local_date: "2024-10-06", local_timezone: "America/Chicago",
    context: "coastal", region_key: "gulf_coast", state_code: "TX",
    tide_station_id: "8773767",
  },
  {
    id: "excellent-tampa-bay-fl-nov",
    notes: "SHOULD BE EXCELLENT: fall snook and speckled trout Tampa Bay FL",
    latitude: 27.76, longitude: -82.62,
    local_date: "2024-11-03", local_timezone: "America/New_York",
    context: "coastal", region_key: "florida", state_code: "FL",
    tide_station_id: "8726724",
  },
  {
    id: "excellent-rogue-river-or-oct",
    notes: "SHOULD BE EXCELLENT: peak fall Chinook salmon Rogue River OR",
    latitude: 42.43, longitude: -123.32,
    local_date: "2024-10-12", local_timezone: "America/Los_Angeles",
    context: "freshwater_river", region_key: "pacific_northwest", state_code: "OR",
  },
  {
    id: "excellent-neuse-river-nc-apr",
    notes: "SHOULD BE EXCELLENT: spring red drum and rockfish Neuse River NC",
    latitude: 35.10, longitude: -76.88,
    local_date: "2024-04-15", local_timezone: "America/New_York",
    context: "coastal", region_key: "southeast_atlantic", state_code: "NC",
    tide_station_id: "8656483",
  },
  {
    id: "excellent-yampa-river-co-jun",
    notes: "SHOULD BE EXCELLENT: post-runoff prime trout Yampa River CO",
    latitude: 40.48, longitude: -107.34,
    local_date: "2024-06-15", local_timezone: "America/Denver",
    context: "freshwater_river", region_key: "mountain_west", state_code: "CO",
  },

  // ── Northeast/SE river spring-summer gaps ─────────────────────────────────
  {
    id: "northeast-delaware-river-nj-jun",
    notes: "Summer smallmouth Delaware River NJ — warm comfortable temps",
    latitude: 40.49, longitude: -74.97,
    local_date: "2024-06-12", local_timezone: "America/New_York",
    context: "freshwater_river", region_key: "northeast", state_code: "NJ",
  },
  {
    id: "northeast-susquehanna-pa-aug",
    notes: "Summer muskie and smallmouth Susquehanna River PA",
    latitude: 40.64, longitude: -76.89,
    local_date: "2024-08-06", local_timezone: "America/New_York",
    context: "freshwater_river", region_key: "northeast", state_code: "PA",
  },
  {
    id: "northeast-housatonic-ct-may",
    notes: "Prime spring trout Housatonic River CT — post-runoff clarity",
    latitude: 41.98, longitude: -73.37,
    local_date: "2024-05-18", local_timezone: "America/New_York",
    context: "freshwater_river", region_key: "northeast", state_code: "CT",
  },
  {
    id: "southeast-atlantic-cape-fear-nc-apr",
    notes: "Spring bass and crappie Cape Fear River NC — pre-spawn",
    latitude: 34.49, longitude: -78.98,
    local_date: "2024-04-10", local_timezone: "America/New_York",
    context: "freshwater_river", region_key: "southeast_atlantic", state_code: "NC",
  },
  {
    id: "southeast-atlantic-new-river-va-jul",
    notes: "Summer smallmouth bass New River VA — mid-season heat",
    latitude: 37.13, longitude: -80.71,
    local_date: "2024-07-08", local_timezone: "America/New_York",
    context: "freshwater_river", region_key: "southeast_atlantic", state_code: "VA",
  },

  // ── Southern CA river gaps (LA-area rivers, not NorCal) ───────────────────
  {
    id: "socal-santa-ana-river-ca-mar",
    notes: "Spring steelhead run Santa Ana River CA — SoCal native trout",
    latitude: 33.93, longitude: -117.42,
    local_date: "2024-03-15", local_timezone: "America/Los_Angeles",
    context: "freshwater_river", region_key: "southern_california", state_code: "CA",
  },
  {
    id: "socal-san-gabriel-river-ca-jun",
    notes: "Early summer bass and carp San Gabriel River CA",
    latitude: 34.04, longitude: -118.09,
    local_date: "2024-06-08", local_timezone: "America/Los_Angeles",
    context: "freshwater_river", region_key: "southern_california", state_code: "CA",
  },
  {
    id: "socal-kern-river-ca-oct",
    notes: "Fall wild rainbow trout Kern River CA — gold country canyon",
    latitude: 35.67, longitude: -118.45,
    local_date: "2024-10-12", local_timezone: "America/Los_Angeles",
    context: "freshwater_river", region_key: "southern_california", state_code: "CA",
  },

  // ── Engine fix validation ──────────────────────────────────────────────────
  {
    id: "validate-great-lakes-jul-temp-fix",
    notes: "VALIDATE GL July fix: Green Bay WI lake — walleye ~68°F should score Good+",
    latitude: 44.55, longitude: -87.98,
    local_date: "2024-07-10", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "great_lakes_upper_midwest", state_code: "WI",
    expect_band: "Good",
  },
  {
    id: "validate-mountain-west-sep-temp-fix",
    notes: "VALIDATE mtn west Sep fix: Dillon Reservoir CO — kokanee ~50°F should be cool not very_cold",
    latitude: 39.63, longitude: -106.07,
    local_date: "2024-09-28", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_west", state_code: "CO",
  },

  // ── HI / AK + coverage matrix (alpine/PNW/sparse-style checks) ─────────────
  {
    id: "hawaii-oahu-lake-mar",
    notes: "Oahu HI — tropical region baseline (state HI → hawaii)",
    latitude: 21.42,
    longitude: -158.03,
    local_date: "2024-03-15",
    local_timezone: "Pacific/Honolulu",
    context: "freshwater_lake_pond",
    region_key: "hawaii",
    state_code: "HI",
  },
  {
    id: "alaska-kenai-river-jun",
    notes: "Kenai River AK — cold-region river + long June daylight",
    latitude: 60.55,
    longitude: -151.26,
    local_date: "2024-06-10",
    local_timezone: "America/Anchorage",
    context: "freshwater_river",
    region_key: "alaska",
    state_code: "AK",
  },
  {
    id: "coverage-alpine-dillon-with-altitude-sep",
    notes: "Dillon CO with altitude_ft in env — production path → mountain_alpine",
    latitude: 39.63,
    longitude: -106.07,
    local_date: "2024-09-20",
    local_timezone: "America/Denver",
    context: "freshwater_lake_pond",
    region_key: "mountain_alpine",
    state_code: "CO",
    altitude_ft: 9017,
  },
  {
    id: "coverage-breckenridge-no-altitude-jul",
    notes: "Breckenridge CO without altitude — stays mountain_west until elevation synced",
    latitude: 39.76,
    longitude: -106.07,
    local_date: "2024-07-14",
    local_timezone: "America/Denver",
    context: "freshwater_lake_pond",
    region_key: "mountain_west",
    state_code: "CO",
  },
  {
    id: "coverage-baker-city-or-inland-northwest-apr",
    notes: "Baker City OR (lon ≥ -118.2) — inland_northwest strip vs maritime coast",
    latitude: 44.77,
    longitude: -117.83,
    local_date: "2024-04-18",
    local_timezone: "America/Los_Angeles",
    context: "freshwater_river",
    region_key: "inland_northwest",
    state_code: "OR",
  },
  {
    id: "coverage-seattle-maritime-pnw-mar",
    notes: "Seattle WA — maritime pacific_northwest (not inland strip)",
    latitude: 47.61,
    longitude: -122.33,
    local_date: "2024-03-22",
    local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond",
    region_key: "pacific_northwest",
    state_code: "WA",
  },
  {
    id: "coverage-coastal-galveston-marginal-tide-may",
    notes: "Gulf coastal with NOAA station — real partial tide payload in env",
    latitude: 29.26,
    longitude: -94.98,
    local_date: "2024-05-10",
    local_timezone: "America/Chicago",
    context: "coastal",
    region_key: "gulf_coast",
    state_code: "TX",
    tide_station_id: "8771341",
  },

  // ═══ Quick-finish calibration batch (60 total scenarios) — major fisheries ═══
  // Great Lakes / pike / salmon / smallmouth
  {
    id: "quickfinish-lake-st-clair-mi-apr",
    notes: "Pre-spawn smallmouth / pike — western Lake St. Clair MI",
    latitude: 42.58,
    longitude: -82.68,
    local_date: "2024-04-25",
    local_timezone: "America/Detroit",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    state_code: "MI",
  },
  {
    id: "quickfinish-pere-marquette-river-mi-sep",
    notes: "Fall Chinook / steelhead window — Pere Marquette River MI",
    latitude: 43.51,
    longitude: -86.22,
    local_date: "2024-09-18",
    local_timezone: "America/Detroit",
    context: "freshwater_river",
    region_key: "great_lakes_upper_midwest",
    state_code: "MI",
  },
  {
    id: "quickfinish-oswego-river-ny-may",
    notes: "Spring salmon staging / brown trout — Oswego River NY",
    latitude: 43.45,
    longitude: -76.51,
    local_date: "2024-05-12",
    local_timezone: "America/New_York",
    context: "freshwater_river",
    region_key: "great_lakes_upper_midwest",
    state_code: "NY",
  },
  {
    id: "quickfinish-lake-vermilion-mn-jun",
    notes: "Peak pike / walleye — Lake Vermilion MN",
    latitude: 47.91,
    longitude: -92.38,
    local_date: "2024-06-08",
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    state_code: "MN",
  },
  // SE / Gulf / FL coastal — speck / redfish / snook / tarpon arcs
  {
    id: "quickfinish-charleston-harbor-sc-coastal-mar",
    notes: "Spring speckled trout / redfish — Charleston SC",
    latitude: 32.78,
    longitude: -79.92,
    local_date: "2024-03-14",
    local_timezone: "America/New_York",
    context: "coastal",
    region_key: "southeast_atlantic",
    state_code: "SC",
    tide_station_id: "8665530",
  },
  {
    id: "quickfinish-grand-isle-la-coastal-aug",
    notes: "Summer redfish / trout — Barataria / Grand Isle LA",
    latitude: 29.24,
    longitude: -89.96,
    local_date: "2024-08-12",
    local_timezone: "America/Chicago",
    context: "coastal",
    region_key: "gulf_coast",
    state_code: "LA",
    tide_station_id: "8761724",
  },
  {
    id: "quickfinish-miami-biscayne-coastal-jun",
    notes: "Summer snook / tarpon edges — Biscayne Bay FL",
    latitude: 25.72,
    longitude: -80.19,
    local_date: "2024-06-22",
    local_timezone: "America/New_York",
    context: "coastal",
    region_key: "florida",
    state_code: "FL",
    tide_station_id: "8723214",
  },
  {
    id: "quickfinish-pensacola-bay-coastal-jan",
    notes: "Winter inshore FL Panhandle — Pensacola Bay",
    latitude: 30.34,
    longitude: -87.25,
    local_date: "2024-01-28",
    local_timezone: "America/Chicago",
    context: "coastal",
    region_key: "florida",
    state_code: "FL",
    tide_station_id: "8729840",
  },
  // Trout / salmon / NorCal / tailwater / alpine
  {
    id: "quickfinish-mccloud-river-ca-oct",
    notes: "Fall wild trout — McCloud River NorCal",
    latitude: 41.05,
    longitude: -122.05,
    local_date: "2024-10-08",
    local_timezone: "America/Los_Angeles",
    context: "freshwater_river",
    region_key: "northern_california",
    state_code: "CA",
  },
  {
    id: "quickfinish-south-platte-co-river-mar",
    notes: "Spring tailwater trout — South Platte River CO",
    latitude: 39.55,
    longitude: -105.32,
    local_date: "2024-03-24",
    local_timezone: "America/Denver",
    context: "freshwater_river",
    region_key: "mountain_west",
    state_code: "CO",
  },
  {
    id: "quickfinish-watauga-river-tn-apr",
    notes: "Southern Appalachian tailwater — Watauga River TN",
    latitude: 36.18,
    longitude: -82.03,
    local_date: "2024-04-08",
    local_timezone: "America/New_York",
    context: "freshwater_river",
    region_key: "south_central",
    state_code: "TN",
  },
  {
    id: "quickfinish-columbia-gorge-or-may",
    notes: "Spring shad / Columbia gorge — Rufus OR (inland strip)",
    latitude: 45.69,
    longitude: -120.75,
    local_date: "2024-05-06",
    local_timezone: "America/Los_Angeles",
    context: "freshwater_river",
    region_key: "inland_northwest",
    state_code: "OR",
  },
  {
    id: "quickfinish-redfish-lake-id-alpine-jul",
    notes: "High-country trout — Redfish Lake ID (alpine elevation override)",
    latitude: 44.12,
    longitude: -114.92,
    local_date: "2024-07-20",
    local_timezone: "America/Boise",
    context: "freshwater_lake_pond",
    region_key: "mountain_alpine",
    state_code: "ID",
    altitude_ft: 6500,
  },
  {
    id: "quickfinish-chickamauga-tn-may",
    notes: "TN River largemouth pre-spawn — Lake Chickamauga TN",
    latitude: 35.23,
    longitude: -85.12,
    local_date: "2024-05-04",
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    state_code: "TN",
  },
  {
    id: "quickfinish-elephant-butte-nm-may",
    notes: "Desert reservoir bass / walleye — Elephant Butte NM",
    latitude: 33.19,
    longitude: -107.22,
    local_date: "2024-05-15",
    local_timezone: "America/Denver",
    context: "freshwater_lake_pond",
    region_key: "southwest_high_desert",
    state_code: "NM",
  },
];

// ── Open-Meteo fetch ───────────────────────────────────────────────────────────

type OMResponse = {
  timezone: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
    cloud_cover: number[];
    wind_speed_10m: number[];
    /** Mean sea level pressure (hPa) — matches engine / get-environment `pressure_msl` contract. */
    pressure_msl: number[];
    precipitation: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    sunrise: string[];
    sunset: string[];
  };
};

async function fetchOpenMeteo(lat: number, lng: number, targetDate: string): Promise<OMResponse> {
  const startMs = new Date(targetDate + "T12:00:00Z").getTime() - 14 * 86400_000;
  const startDate = new Date(startMs).toISOString().slice(0, 10);

  const url = new URL("https://archive-api.open-meteo.com/v1/archive");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lng));
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", targetDate);
  url.searchParams.set("hourly", "temperature_2m,cloud_cover,wind_speed_10m,pressure_msl,precipitation");
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("precipitation_unit", "inch");
  url.searchParams.set("timezone", "UTC"); // Always UTC — engine converts using local_timezone

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json() as Promise<OMResponse>;
}

// ── NOAA Tides fetch ──────────────────────────────────────────────────────────

async function fetchNOAATides(
  stationId: string,
  date: string,
): Promise<{ phase: string; high_low: Array<{ time: string; type: string; value: number }> } | null> {
  const d = date.replace(/-/g, "");
  const url =
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions` +
    `&begin_date=${d}&end_date=${d}` +
    `&datum=MLLW&station=${stationId}&time_zone=gmt` +
    `&interval=hilo&units=english&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json() as { predictions?: Array<{ t: string; v: string; type?: string }> };
    if (!data.predictions?.length) return null;

    const high_low = data.predictions.map((p) => ({
      time: p.t,
      type: p.type === "H" ? "H" : "L",
      value: parseFloat(p.v),
    }));

    // Phase at noon: last hi/lo before 12:00
    let phase = "incoming";
    for (const hl of high_low) {
      const timeStr = hl.time.split(" ")[1] ?? "00:00";
      const [hh, mm] = timeStr.split(":").map(Number);
      const minutesFromMidnight = (hh ?? 0) * 60 + (mm ?? 0);
      if (minutesFromMidnight <= 720) { // noon = 720 min
        phase = hl.type === "H" ? "outgoing" : "incoming";
      }
    }
    return { phase, high_low };
  } catch {
    return null;
  }
}

// ── Convert UTC ISO → local HH:MM ─────────────────────────────────────────────

function utcToLocalHHMM(utcIso: string, timeZone: string): string {
  // Open-Meteo returns "2024-04-12T06:32" without Z when timezone=UTC
  const d = new Date(utcIso.endsWith("Z") ? utcIso : utcIso + "Z");
  if (Number.isNaN(d.getTime())) return "06:00";
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d).replace(/^24:/, "00:");
  } catch {
    return "06:00";
  }
}

// ── Build env_data ────────────────────────────────────────────────────────────

function buildEnvData(
  om: OMResponse,
  targetDate: string,
  localTimezone: string,
  tides: { phase: string; high_low: Array<{ time: string; type: string; value: number }> } | null,
): Record<string, unknown> {
  const { hourly, daily } = om;

  // daily[14] = target date (start_date = target - 14 days → 15 entries)
  const dailyIdx = 14;
  const dailyHighs = daily.temperature_2m_max;  // index 14 = target day
  const dailyLows = daily.temperature_2m_min;

  // Current temp/pressure = noon UTC approximation
  // Find the UTC hour closest to noon local time by scanning hourly
  const noonApproxIdx = Math.min(dailyIdx * 24 + 17, hourly.time.length - 1); // ~noon in most US TZs
  const currentTemp = hourly.temperature_2m[noonApproxIdx] ?? (dailyHighs[dailyIdx]! + dailyLows[dailyIdx]!) / 2;
  const currentPressure = hourly.pressure_msl[noonApproxIdx] ?? 1013;
  const currentPrecipMm = (hourly.precipitation[noonApproxIdx] ?? 0) * 25.4; // inch→mm for weather.precipitation

  // Wind: max over last 24h
  const windMax = Math.max(
    ...hourly.wind_speed_10m.slice(Math.max(0, dailyIdx * 24), (dailyIdx + 1) * 24).map((v) => v ?? 0),
    0,
  );

  // Cloud: mean over daytime hours of target date (approximate)
  const daySlice = hourly.cloud_cover.slice(dailyIdx * 24 + 6, dailyIdx * 24 + 20);
  const cloudMean = daySlice.length
    ? Math.round(daySlice.reduce((a, b) => a + (b ?? 0), 0) / daySlice.length)
    : 50;

  // pressure_48hr: 48 values ending at approximate current time
  const p48End = noonApproxIdx;
  const p48Start = Math.max(0, p48End - 47);
  const pressure48hr = hourly.pressure_msl.slice(p48Start, p48End + 1);

  // All hourly points as {time_utc: "...Z", value} — engine will extract the right 24 for localDate
  const hourlyAirTempPoints = hourly.time.map((t, i) => ({
    time_utc: t + "Z", // Open-Meteo UTC format lacks Z; add it for correct Date parsing
    value: hourly.temperature_2m[i] ?? 0,
  }));
  const hourlyCloudPoints = hourly.time.map((t, i) => ({
    time_utc: t + "Z",
    value: hourly.cloud_cover[i] ?? 0,
  }));

  // Sunrise/sunset: from daily UTC ISO, convert to local HH:MM
  const sunriseLocal = utcToLocalHHMM(daily.sunrise[dailyIdx] ?? "", localTimezone);
  const sunsetLocal = utcToLocalHHMM(daily.sunset[dailyIdx] ?? "", localTimezone);

  return {
    timezone: localTimezone, // tells buildFromEnvData to use this TZ for hourly bucketing
    weather: {
      temperature: currentTemp,
      pressure: currentPressure,
      wind_speed: windMax,
      cloud_cover: cloudMean,
      precipitation: currentPrecipMm,
      pressure_48hr: pressure48hr,
      temp_7day_high: dailyHighs,
      temp_7day_low: dailyLows,
      precip_7day_daily: daily.precipitation_sum,
    },
    sun: { sunrise: sunriseLocal, sunset: sunsetLocal },
    solunar: null,
    tides: tides
      ? { station_id: "", phase: tides.phase, high_low: tides.high_low }
      : null,
    hourly_air_temp_f: hourlyAirTempPoints,
    hourly_cloud_cover_pct: hourlyCloudPoints,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

const results: string[] = [];
let passed = 0;
let failed = 0;
let expectFails = 0;

console.log(`\nGenerating ${SCENARIOS.length} targeted scenarios with real weather...\n`);

for (let i = 0; i < SCENARIOS.length; i++) {
  const sc = SCENARIOS[i]!;
  const tag = `[${String(i + 1).padStart(2, "0")}/${SCENARIOS.length}]`;

  await Deno.stdout.write(enc.encode(`${tag} ${sc.id.slice(0, 52).padEnd(52)} `));

  try {
    // 1. Fetch weather
    const om = await fetchOpenMeteo(sc.latitude, sc.longitude, sc.local_date);

    // 2. Fetch tides (coastal only)
    let tides = null;
    if (sc.context === "coastal" && sc.tide_station_id) {
      tides = await fetchNOAATides(sc.tide_station_id, sc.local_date);
    }

    // 3. Build env_data
    const envData = buildEnvData(om, sc.local_date, sc.local_timezone, tides);
    if (sc.altitude_ft != null) envData.altitude_ft = sc.altitude_ft;

    // 4. Build engine request — region_key is resolved from coordinates internally,
    //    then overridden with our explicit definition which is more accurate for
    //    locations near region boundaries.
    const req = buildSharedEngineRequestFromEnvData(
      sc.latitude, sc.longitude,
      sc.local_date, sc.local_timezone,
      sc.context, envData,
    );
    // Explicit override: some coordinates near region boundaries resolve incorrectly
    const reqWithRegion = { ...req, region_key: sc.region_key as typeof req.region_key };

    // 5. Run engine
    const report = runHowFishingReport(reqWithRegion);
    const { score, band } = report;

    // 6. Check expectation
    let expectNote = "";
    if (sc.expect_band) {
      const met = band === sc.expect_band ||
        (sc.expect_band === "Good" && (band === "Good" || band === "Excellent"));
      if (!met) {
        expectNote = `  ⚠️ expected ${sc.expect_band}, got ${band}`;
        expectFails++;
      } else {
        expectNote = `  ✅ expect OK`;
      }
    }

    const dailyMean = req.environment.daily_mean_air_temp_f ?? req.environment.current_air_temp_f;
    console.log(`${score} ${band.padEnd(9)} t=${(dailyMean ?? 0).toFixed(1)}°F${expectNote}`);

    results.push(JSON.stringify({
      id: sc.id,
      notes: sc.notes,
      input: {
        latitude: sc.latitude, longitude: sc.longitude,
        local_date: sc.local_date, local_timezone: sc.local_timezone,
        context: sc.context, region_key: sc.region_key, state_code: sc.state_code,
        environment: req.environment,
      },
      env_data: envData,
      report,
    }));
    passed++;
  } catch (err) {
    console.log(`ERROR: ${(err as Error).message}`);
    failed++;
  }

  // Courtesy pause for Open-Meteo free API
  if (i < SCENARIOS.length - 1) await new Promise((r) => setTimeout(r, 300));
}

// Write JSONL
await Deno.writeTextFile(outPath, results.join("\n") + "\n");

// ── Summary ───────────────────────────────────────────────────────────────────

const records = results.map((r) => JSON.parse(r) as { report: { score: number; band: string } });
const scores = records.map((r) => r.report.score);
const bands: Record<string, number> = { Poor: 0, Fair: 0, Good: 0, Excellent: 0 };
for (const r of records) bands[r.report.band] = (bands[r.report.band] ?? 0) + 1;

console.log(`\n${"─".repeat(72)}`);
console.log(`Generated: ${passed}/${SCENARIOS.length}${failed > 0 ? `  (${failed} failed)` : ""}`);
if (expectFails > 0) console.log(`Expectation misses: ${expectFails} — review these scenarios`);
console.log(`Output:    ${outPath}\n`);
console.log(`Score distribution:`);
console.log(`  Poor (0–39):      ${bands.Poor}`);
console.log(`  Fair (40–59):     ${bands.Fair}`);
console.log(`  Good (60–79):     ${bands.Good}`);
console.log(`  Excellent (80+):  ${bands.Excellent}`);
if (scores.length > 0) {
  console.log(`  Min: ${Math.min(...scores)}  Max: ${Math.max(...scores)}  Avg: ${(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)}`);
}
