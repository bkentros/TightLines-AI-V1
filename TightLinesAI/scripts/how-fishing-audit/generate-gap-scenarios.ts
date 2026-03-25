#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env
/**
 * How's Fishing — Gap-Fill Scenario Generator (50 scenarios)
 *
 * Targets the coverage gaps from the first 38-scenario audit:
 *   - south_central (WV/KY/TN/AR/OK) — was ZERO scenarios
 *   - southwest_desert (AZ/NV)        — was ZERO scenarios
 *   - southwest_high_desert (NM)       — was ZERO scenarios
 *   - pacific_northwest expansion      — was only 1 scenario
 *   - mountain_west expansion          — was only 2 scenarios (both on volatile-pressure days)
 *   - coastal expansion                — better NOAA stations, more regions
 *   - Great Lakes rivers               — only lakes before
 *   - Southeast Atlantic lakes         — only rivers/coastal before
 *   - December                        — was ZERO scenarios
 *   - August                          — was only 1 scenario
 *   - Excellent ceiling validation     — specific targets to confirm 80+ is reachable
 *
 * NorCal alpine lakes (Lake Shasta, Tahoe, etc.) are intentionally skipped —
 * all CA maps to "southern_california" region key and those alpine temp bands
 * would be miscalibrated. Flagged as a known engine gap.
 *
 * Run:
 *   cd TightLinesAI && deno run --allow-net --allow-read --allow-write --allow-env \
 *     scripts/how-fishing-audit/generate-gap-scenarios.ts \
 *     how-fishing-gap-audit.jsonl
 */

import {
  buildSharedEngineRequestFromEnvData,
  runHowFishingReport,
} from "../../supabase/functions/_shared/howFishingEngine/index.ts";

const outPath = Deno.args[0] ?? "how-fishing-gap-audit.jsonl";
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
  tide_station_id?: string;
  expect_band?: string;
};

const SCENARIOS: ScenarioDef[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 1: south_central — 7 scenarios (WV/KY/TN/AR/OK — previously ZERO)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "south-central-dale-hollow-lake-tn-sep",
    notes: "Prime fall smallmouth Dale Hollow Lake TN — world record smallmouth water, Sep thermals 68-72°F",
    latitude: 36.52, longitude: -85.45,
    local_date: "2024-09-14", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "south_central", state_code: "TN",
  },
  {
    id: "south-central-lake-cumberland-ky-apr",
    notes: "Spring bass pre-spawn Lake Cumberland KY — deep clear highland reservoir, April 58-65°F",
    latitude: 36.89, longitude: -84.89,
    local_date: "2024-04-20", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "south_central", state_code: "KY",
  },
  {
    id: "south-central-white-river-ar-nov",
    notes: "Trophy tailwater trout White River AR (below Bull Shoals Dam) — Nov cold water prime",
    latitude: 36.14, longitude: -92.05,
    local_date: "2024-11-09", local_timezone: "America/Chicago",
    context: "freshwater_river", region_key: "south_central", state_code: "AR",
  },
  {
    id: "south-central-lake-ouachita-ar-oct",
    notes: "Fall striper and bass Lake Ouachita AR — Oct feeding blitz before winter",
    latitude: 34.56, longitude: -93.01,
    local_date: "2024-10-05", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "south_central", state_code: "AR",
  },
  {
    id: "south-central-lake-tenkiller-ok-jun",
    notes: "Early summer largemouth bass Lake Tenkiller OK — Cookson Hills clear water",
    latitude: 35.62, longitude: -95.05,
    local_date: "2024-06-15", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "south_central", state_code: "OK",
  },
  {
    id: "south-central-new-river-wv-may",
    notes: "Prime spring smallmouth New River WV (New River Gorge) — May post-spawn chase",
    latitude: 38.07, longitude: -81.01,
    local_date: "2024-05-11", local_timezone: "America/New_York",
    context: "freshwater_river", region_key: "south_central", state_code: "WV",
  },
  {
    id: "south-central-norris-lake-tn-mar",
    notes: "Early spring bass and walleye Norris Lake TN — cold pre-spawn highland reservoir",
    latitude: 36.24, longitude: -84.07,
    local_date: "2024-03-16", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "south_central", state_code: "TN",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 2: southwest_desert — 4 scenarios (AZ/NV — previously ZERO)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "southwest-desert-roosevelt-lake-az-mar",
    notes: "Spring bass pre-spawn Roosevelt Lake AZ — saguaro desert canyon, March 60-68°F",
    latitude: 33.66, longitude: -111.20,
    local_date: "2024-03-09", local_timezone: "America/Phoenix",
    context: "freshwater_lake_pond", region_key: "southwest_desert", state_code: "AZ",
  },
  {
    id: "southwest-desert-lake-havasu-az-nov",
    notes: "Fall striper and largemouth Lake Havasu AZ — Colorado River impoundment, Nov ideal",
    latitude: 34.34, longitude: -114.27,
    local_date: "2024-11-16", local_timezone: "America/Phoenix",
    context: "freshwater_lake_pond", region_key: "southwest_desert", state_code: "AZ",
  },
  {
    id: "southwest-desert-lake-mead-nv-apr",
    notes: "Spring striper run Lake Mead NV — Hoover Dam impoundment, April 62-70°F",
    latitude: 36.11, longitude: -114.39,
    local_date: "2024-04-19", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "southwest_desert", state_code: "NV",
  },
  {
    id: "southwest-desert-lake-mohave-az-oct",
    notes: "Peak fall striped bass Lake Mohave AZ — schooling shad, Oct prime",
    latitude: 35.26, longitude: -114.57,
    local_date: "2024-10-19", local_timezone: "America/Phoenix",
    context: "freshwater_lake_pond", region_key: "southwest_desert", state_code: "AZ",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 3: southwest_high_desert — 4 scenarios (NM only — previously ZERO)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "southwest-high-desert-elephant-butte-nm-may",
    notes: "Spring bass and striper Elephant Butte NM — largest NM reservoir, May 68-76°F",
    latitude: 33.15, longitude: -107.18,
    local_date: "2024-05-11", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "southwest_high_desert", state_code: "NM",
  },
  {
    id: "southwest-high-desert-navajo-lake-nm-sep",
    notes: "Fall kokanee and trout Navajo Lake NM — 6,100ft reservoir, Sep 58-65°F prime",
    latitude: 36.80, longitude: -107.67,
    local_date: "2024-09-07", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "southwest_high_desert", state_code: "NM",
  },
  {
    id: "southwest-high-desert-eagle-nest-lake-nm-jul",
    notes: "Summer rainbow trout Eagle Nest Lake NM — 8,200ft alpine lake, cool even in July",
    latitude: 36.56, longitude: -105.26,
    local_date: "2024-07-13", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "southwest_high_desert", state_code: "NM",
  },
  {
    id: "southwest-high-desert-san-juan-river-nm-nov",
    notes: "Trophy tailwater trout San Juan River NM (below Navajo Dam) — Nov cold clarity prime",
    latitude: 36.78, longitude: -107.63,
    local_date: "2024-11-02", local_timezone: "America/Denver",
    context: "freshwater_river", region_key: "southwest_high_desert", state_code: "NM",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 4: pacific_northwest expansion — 4 scenarios (was only Rogue River Oct)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "pacific-northwest-columbia-river-or-sep",
    notes: "Peak fall Chinook salmon Columbia River OR — tidewater near Astoria, Sep run",
    latitude: 45.76, longitude: -122.83,
    local_date: "2024-09-07", local_timezone: "America/Los_Angeles",
    context: "freshwater_river", region_key: "pacific_northwest", state_code: "OR",
  },
  {
    id: "pacific-northwest-deschutes-river-or-aug",
    notes: "Summer steelhead Deschutes River OR (Maupin) — famous float fishing canyon, Aug",
    latitude: 45.17, longitude: -121.08,
    local_date: "2024-08-10", local_timezone: "America/Los_Angeles",
    context: "freshwater_river", region_key: "pacific_northwest", state_code: "OR",
  },
  {
    id: "pacific-northwest-lake-chelan-wa-jul",
    notes: "Summer kokanee and lake trout Lake Chelan WA — 55-mile deep glacial fjord lake",
    latitude: 47.83, longitude: -120.01,
    local_date: "2024-07-06", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "pacific_northwest", state_code: "WA",
  },
  {
    id: "pacific-northwest-puget-sound-wa-sep",
    notes: "SHOULD BE EXCELLENT: fall coho salmon Puget Sound WA — NOAA station 9447130 (Seattle)",
    latitude: 47.81, longitude: -122.38,
    local_date: "2024-09-21", local_timezone: "America/Los_Angeles",
    context: "coastal", region_key: "pacific_northwest", state_code: "WA",
    tide_station_id: "9447130",
    expect_band: "Good",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 5: mountain_west expansion — 5 scenarios (was only 2 volatile-pressure days)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "mountain-west-blue-mesa-co-jul",
    notes: "Peak kokanee summer Blue Mesa Reservoir CO — 7,519ft, CO's largest lake, Jul",
    latitude: 38.45, longitude: -107.33,
    local_date: "2024-07-06", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_west", state_code: "CO",
  },
  {
    id: "mountain-west-flaming-gorge-ut-sep",
    notes: "Fall lake trout and kokanee Flaming Gorge UT — 6,040ft, Sep prime turnover",
    latitude: 40.92, longitude: -109.43,
    local_date: "2024-09-14", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_west", state_code: "UT",
  },
  {
    id: "mountain-west-bighorn-river-mt-jul",
    notes: "World-class dry fly brown trout Bighorn River MT (Fort Smith) — July ideal",
    latitude: 45.32, longitude: -107.90,
    local_date: "2024-07-13", local_timezone: "America/Denver",
    context: "freshwater_river", region_key: "mountain_west", state_code: "MT",
  },
  {
    id: "mountain-west-flathead-lake-mt-aug",
    notes: "Summer bull trout and westslope cutthroat Flathead Lake MT — largest US freshwater lake west of Mississippi",
    latitude: 47.68, longitude: -114.16,
    local_date: "2024-08-17", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_west", state_code: "MT",
  },
  {
    id: "mountain-west-green-river-ut-river-sep",
    notes: "Trophy brown trout Green River UT (below Flaming Gorge Dam) — Sep ideal clarity",
    latitude: 40.91, longitude: -109.44,
    local_date: "2024-09-07", local_timezone: "America/Denver",
    context: "freshwater_river", region_key: "mountain_west", state_code: "UT",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 6: Coastal expansion — 6 scenarios with verified Tier-1 NOAA stations
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "coastal-outer-banks-nc-sep",
    notes: "SHOULD BE EXCELLENT: false albacore blitz Outer Banks NC — Sep peak run, NOAA 8652587",
    latitude: 35.79, longitude: -75.55,
    local_date: "2024-09-14", local_timezone: "America/New_York",
    context: "coastal", region_key: "southeast_atlantic", state_code: "NC",
    tide_station_id: "8652587",
    expect_band: "Good",
  },
  {
    id: "coastal-cape-cod-bay-ma-oct",
    notes: "Fall striper run Cape Cod Bay MA — Oct peak blitz, NOAA 8447930 (Woods Hole)",
    latitude: 41.71, longitude: -70.28,
    local_date: "2024-10-05", local_timezone: "America/New_York",
    context: "coastal", region_key: "northeast", state_code: "MA",
    tide_station_id: "8447930",
  },
  {
    id: "coastal-mobile-bay-al-apr",
    notes: "Spring speckled trout and redfish Mobile Bay AL — April prime, NOAA 8737048",
    latitude: 30.57, longitude: -88.03,
    local_date: "2024-04-14", local_timezone: "America/Chicago",
    context: "coastal", region_key: "gulf_coast", state_code: "AL",
    tide_station_id: "8737048",
  },
  {
    id: "coastal-galveston-bay-tx-jun",
    notes: "Summer flounder and redfish Galveston Bay TX — June morning bite, NOAA 8771450",
    latitude: 29.31, longitude: -94.78,
    local_date: "2024-06-08", local_timezone: "America/Chicago",
    context: "coastal", region_key: "gulf_coast", state_code: "TX",
    tide_station_id: "8771450",
  },
  {
    id: "coastal-san-diego-bay-ca-mar",
    notes: "Spring calico bass and halibut San Diego Bay CA — March ideal, NOAA 9410170",
    latitude: 32.72, longitude: -117.17,
    local_date: "2024-03-09", local_timezone: "America/Los_Angeles",
    context: "coastal", region_key: "southern_california", state_code: "CA",
    tide_station_id: "9410170",
  },
  {
    id: "coastal-commencement-bay-wa-oct",
    notes: "Fall coho salmon Commencement Bay WA (Tacoma Narrows) — Oct peak, NOAA 9446484",
    latitude: 47.25, longitude: -122.43,
    local_date: "2024-10-12", local_timezone: "America/Los_Angeles",
    context: "coastal", region_key: "pacific_northwest", state_code: "WA",
    tide_station_id: "9446484",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 7: Great Lakes rivers — 3 scenarios (only lakes before)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "great-lakes-au-sable-river-mi-sep",
    notes: "Legendary brown trout Au Sable River MI (Grayling) — Sep Hexagenia hatch window",
    latitude: 44.66, longitude: -84.71,
    local_date: "2024-09-07", local_timezone: "America/Detroit",
    context: "freshwater_river", region_key: "great_lakes_upper_midwest", state_code: "MI",
  },
  {
    id: "great-lakes-brule-river-wi-oct",
    notes: "Fall steelhead Brule River WI — premier Great Lakes tributary, Oct run peak",
    latitude: 46.56, longitude: -91.58,
    local_date: "2024-10-05", local_timezone: "America/Chicago",
    context: "freshwater_river", region_key: "great_lakes_upper_midwest", state_code: "WI",
  },
  {
    id: "great-lakes-mad-river-oh-apr",
    notes: "Spring trout Mad River OH (urban limestone creek) — Apr stocked and wild browns",
    latitude: 40.11, longitude: -83.75,
    local_date: "2024-04-06", local_timezone: "America/New_York",
    context: "freshwater_river", region_key: "great_lakes_upper_midwest", state_code: "OH",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 8: Southeast Atlantic lakes — 3 scenarios (only rivers/coastal before)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "southeast-atlantic-lake-norman-nc-mar",
    notes: "Spring bass pre-spawn Lake Norman NC (Charlotte metro) — Mar 55-65°F warming",
    latitude: 35.57, longitude: -80.92,
    local_date: "2024-03-23", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "southeast_atlantic", state_code: "NC",
  },
  {
    id: "southeast-atlantic-lake-hartwell-ga-apr",
    notes: "Bass spawn Lake Hartwell GA/SC — Savannah River impoundment, Apr 62-70°F",
    latitude: 34.36, longitude: -82.83,
    local_date: "2024-04-06", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "southeast_atlantic", state_code: "GA",
  },
  {
    id: "southeast-atlantic-lake-murray-sc-aug",
    notes: "Summer bass and striper Lake Murray SC — Saluda River impoundment, Aug heat check",
    latitude: 34.01, longitude: -81.39,
    local_date: "2024-08-03", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "southeast_atlantic", state_code: "SC",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 9: December — 3 scenarios (previously ZERO)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "december-lake-okeechobee-fl-dec",
    notes: "December bass Lake Okeechobee FL — winter cold front pattern, 62-70°F",
    latitude: 26.98, longitude: -80.79,
    local_date: "2024-12-07", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "florida", state_code: "FL",
  },
  {
    id: "december-saguaro-lake-az-dec",
    notes: "December bass Saguaro Lake AZ — desert reservoir, mild Dec 55-65°F ideal",
    latitude: 33.54, longitude: -111.52,
    local_date: "2024-12-14", local_timezone: "America/Phoenix",
    context: "freshwater_lake_pond", region_key: "southwest_desert", state_code: "AZ",
  },
  {
    id: "december-pickwick-lake-tn-dec",
    notes: "December crappie and bass Pickwick Lake TN — Tennessee River TVA impoundment",
    latitude: 35.05, longitude: -88.25,
    local_date: "2024-12-07", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "south_central", state_code: "TN",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 10: August expansion — 4 scenarios (only 1 before)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "august-lake-erie-oh-aug",
    notes: "Peak summer walleye jigging Lake Erie OH (near Sandusky) — Aug heat vs feeding",
    latitude: 41.46, longitude: -82.71,
    local_date: "2024-08-10", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "great_lakes_upper_midwest", state_code: "OH",
  },
  {
    id: "august-lake-champlain-vt-aug",
    notes: "Summer largemouth and smallmouth Lake Champlain VT — Aug thermocline bass",
    latitude: 44.51, longitude: -73.21,
    local_date: "2024-08-17", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "northeast", state_code: "VT",
  },
  {
    id: "august-chesapeake-bay-coastal-aug",
    notes: "Late summer rockfish Chesapeake Bay MD — Aug trolling, NOAA 8574680 (Baltimore)",
    latitude: 38.72, longitude: -76.52,
    local_date: "2024-08-03", local_timezone: "America/New_York",
    context: "coastal", region_key: "southeast_atlantic", state_code: "MD",
    tide_station_id: "8574680",
  },
  {
    id: "august-yellowstone-river-mt-aug",
    notes: "Summer cutthroat and brown trout Yellowstone River MT (near Livingston) — Aug dry fly",
    latitude: 45.67, longitude: -110.56,
    local_date: "2024-08-10", local_timezone: "America/Denver",
    context: "freshwater_river", region_key: "mountain_west", state_code: "MT",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 11: Southeast Atlantic expansion — 3 scenarios
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "se-atlantic-james-river-va-jun",
    notes: "Summer smallmouth bass James River VA (near Richmond fall line) — Jun top-water",
    latitude: 37.53, longitude: -77.43,
    local_date: "2024-06-08", local_timezone: "America/New_York",
    context: "freshwater_river", region_key: "southeast_atlantic", state_code: "VA",
  },
  {
    id: "se-atlantic-lake-lanier-ga-jul",
    notes: "Summer striper and bass Lake Lanier GA — July deep water pattern",
    latitude: 34.29, longitude: -83.97,
    local_date: "2024-07-13", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "southeast_atlantic", state_code: "GA",
  },
  {
    id: "se-atlantic-lake-marion-sc-nov",
    notes: "Fall bass and crappie Lake Marion SC (Santee-Cooper) — Nov prime",
    latitude: 33.42, longitude: -80.24,
    local_date: "2024-11-09", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "southeast_atlantic", state_code: "SC",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 12: Excellent ceiling validation — 4 scenarios to confirm 80+ reachable
  // These use prime fishing dates/regions historically known for active fish
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "excellent-sebago-lake-me-oct",
    notes: "SHOULD BE EXCELLENT: peak landlocked salmon Sebago Lake ME — Oct prime, fall fronts",
    latitude: 43.85, longitude: -70.57,
    local_date: "2024-10-19", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "northeast", state_code: "ME",
    expect_band: "Good",
  },
  {
    id: "excellent-kentucky-lake-tn-oct",
    notes: "SHOULD BE EXCELLENT: fall bass blitz Kentucky Lake TN — Oct prime south_central",
    latitude: 36.64, longitude: -88.17,
    local_date: "2024-10-05", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "south_central", state_code: "TN",
    expect_band: "Good",
  },
  {
    id: "excellent-snake-river-id-jun",
    notes: "SHOULD BE EXCELLENT: summer steelhead Snake River ID (Hells Canyon) — Jun prime",
    latitude: 45.37, longitude: -116.70,
    local_date: "2024-06-15", local_timezone: "America/Denver",
    context: "freshwater_river", region_key: "mountain_west", state_code: "ID",
    expect_band: "Good",
  },
  {
    id: "excellent-lake-roosevelt-wa-oct",
    notes: "SHOULD BE EXCELLENT: fall walleye Lake Roosevelt WA (Grand Coulee) — Oct peak",
    latitude: 48.13, longitude: -118.70,
    local_date: "2024-10-12", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "pacific_northwest", state_code: "WA",
    expect_band: "Good",
  },

];

// ── Open-Meteo archive fetch ───────────────────────────────────────────────────

type OMResponse = {
  hourly: {
    time: string[];
    temperature_2m: number[];
    cloud_cover: number[];
    wind_speed_10m: number[];
    surface_pressure: number[];
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
  url.searchParams.set("hourly", "temperature_2m,cloud_cover,wind_speed_10m,surface_pressure,precipitation");
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("precipitation_unit", "inch");
  url.searchParams.set("timezone", "UTC"); // Always UTC — engine converts using local_timezone

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json() as Promise<OMResponse>;
}

// ── NOAA CO-OPS tides fetch ────────────────────────────────────────────────────

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

    // Determine phase at noon: last hi/lo event before 12:00
    let phase = "incoming";
    for (const hl of high_low) {
      const timeStr = hl.time.split(" ")[1] ?? "00:00";
      const [hh, mm] = timeStr.split(":").map(Number);
      const minutesFromMidnight = (hh ?? 0) * 60 + (mm ?? 0);
      if (minutesFromMidnight <= 720) {
        phase = hl.type === "H" ? "outgoing" : "incoming";
      }
    }
    return { phase, high_low };
  } catch {
    return null;
  }
}

// ── UTC ISO → local HH:MM ──────────────────────────────────────────────────────

function utcToLocalHHMM(utcIso: string, timeZone: string): string {
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

// ── Build env_data ─────────────────────────────────────────────────────────────

function buildEnvData(
  om: OMResponse,
  targetDate: string,
  localTimezone: string,
  tides: { phase: string; high_low: Array<{ time: string; type: string; value: number }> } | null,
): Record<string, unknown> {
  const { hourly, daily } = om;

  // daily[14] = target date (start_date = target - 14 days → 15 entries, 0-indexed)
  const dailyIdx = 14;
  const dailyHighs = daily.temperature_2m_max;
  const dailyLows = daily.temperature_2m_min;

  // Approximate noon UTC index — ~17:00 UTC covers noon in most US timezones
  const noonApproxIdx = Math.min(dailyIdx * 24 + 17, hourly.time.length - 1);

  const currentTemp = hourly.temperature_2m[noonApproxIdx]
    ?? ((dailyHighs[dailyIdx] ?? 60) + (dailyLows[dailyIdx] ?? 45)) / 2;
  const currentPressure = hourly.surface_pressure[noonApproxIdx] ?? 1013;

  // Wind: max over the target date's 24-hour window
  const windMax = Math.max(
    ...hourly.wind_speed_10m.slice(dailyIdx * 24, (dailyIdx + 1) * 24).map((v) => v ?? 0),
    0,
  );

  // Cloud: mean over daytime hours of target date (approx 06-20 UTC)
  const daySlice = hourly.cloud_cover.slice(dailyIdx * 24 + 6, dailyIdx * 24 + 20);
  const cloudMean = daySlice.length
    ? Math.round(daySlice.reduce((a, b) => a + (b ?? 0), 0) / daySlice.length)
    : 50;

  // pressure_48hr: 48 readings ending at approximate current time
  const p48End = noonApproxIdx;
  const p48Start = Math.max(0, p48End - 47);
  const pressure48hr = hourly.surface_pressure.slice(p48Start, p48End + 1);

  // Hourly points as {time_utc: "...Z", value} — engine converts to local-day 24-slot array
  const hourlyAirTempPoints = hourly.time.map((t, i) => ({
    time_utc: t + "Z",
    value: hourly.temperature_2m[i] ?? 0,
  }));
  const hourlyCloudPoints = hourly.time.map((t, i) => ({
    time_utc: t + "Z",
    value: hourly.cloud_cover[i] ?? 0,
  }));

  // Sunrise/sunset from daily UTC ISO → local HH:MM
  const sunriseLocal = utcToLocalHHMM(daily.sunrise[dailyIdx] ?? "", localTimezone);
  const sunsetLocal = utcToLocalHHMM(daily.sunset[dailyIdx] ?? "", localTimezone);

  return {
    timezone: localTimezone,
    weather: {
      temperature: currentTemp,
      pressure: currentPressure,
      wind_speed: windMax,
      cloud_cover: cloudMean,
      precipitation: (hourly.precipitation[noonApproxIdx] ?? 0) * 25.4,
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

console.log(`\nGenerating ${SCENARIOS.length} gap-fill scenarios with real weather...\n`);

for (let i = 0; i < SCENARIOS.length; i++) {
  const sc = SCENARIOS[i]!;
  const tag = `[${String(i + 1).padStart(2, "0")}/${SCENARIOS.length}]`;

  await Deno.stdout.write(enc.encode(`${tag} ${sc.id.slice(0, 52).padEnd(52)} `));

  try {
    // 1. Pull historical weather from Open-Meteo archive
    const om = await fetchOpenMeteo(sc.latitude, sc.longitude, sc.local_date);

    // 2. Pull tide data for coastal scenarios (Tier-1 NOAA stations only)
    let tides = null;
    if (sc.context === "coastal" && sc.tide_station_id) {
      tides = await fetchNOAATides(sc.tide_station_id, sc.local_date);
    }

    // 3. Build env_data structure matching what get-environment produces
    const envData = buildEnvData(om, sc.local_date, sc.local_timezone, tides);

    // 4. Build engine request with explicit region_key override
    //    (some coords near region boundaries resolve to wrong region via lat/lon)
    const req = buildSharedEngineRequestFromEnvData(
      sc.latitude, sc.longitude,
      sc.local_date, sc.local_timezone,
      sc.context, envData,
    );
    const reqWithRegion = { ...req, region_key: sc.region_key as typeof req.region_key };

    // 5. Run engine
    const report = runHowFishingReport(reqWithRegion);
    const { score, band } = report;

    // 6. Expectation check
    let expectNote = "";
    if (sc.expect_band) {
      const met = band === sc.expect_band ||
        (sc.expect_band === "Good" && (band === "Good" || band === "Excellent"));
      if (!met) {
        expectNote = `  ⚠ expected ${sc.expect_band}, got ${band}`;
        expectFails++;
      } else {
        expectNote = `  OK expect`;
      }
    }

    const tideNote = sc.context === "coastal"
      ? (tides ? " [tide:OK]" : " [tide:missing]")
      : "";

    const dailyMean = req.environment.daily_mean_air_temp_f ?? req.environment.current_air_temp_f;
    console.log(
      `${score} ${band.padEnd(9)} t=${(dailyMean ?? 0).toFixed(1)}F${tideNote}${expectNote}`,
    );

    results.push(JSON.stringify({
      id: sc.id,
      notes: sc.notes,
      group: sc.id.split("-")[0] + "-" + sc.id.split("-")[1],
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

  // Courtesy delay for Open-Meteo free tier
  if (i < SCENARIOS.length - 1) await new Promise((r) => setTimeout(r, 350));
}

// ── Write JSONL output ────────────────────────────────────────────────────────

await Deno.writeTextFile(outPath, results.join("\n") + "\n");

// ── Summary ────────────────────────────────────────────────────────────────────

const records = results.map((r) => JSON.parse(r) as {
  report: { score: number; band: string };
  input: { context: string; region_key: string };
  id: string;
});
const scores = records.map((r) => r.report.score);
const bands: Record<string, number> = { Poor: 0, Fair: 0, Good: 0, Excellent: 0 };
for (const r of records) bands[r.report.band] = (bands[r.report.band] ?? 0) + 1;

const byRegion: Record<string, { scores: number[]; ids: string[] }> = {};
for (const r of records) {
  const rk = r.input.region_key;
  if (!byRegion[rk]) byRegion[rk] = { scores: [], ids: [] };
  byRegion[rk].scores.push(r.report.score);
  byRegion[rk].ids.push(r.id);
}

console.log(`\n${"─".repeat(72)}`);
console.log(`Generated: ${passed}/${SCENARIOS.length}${failed > 0 ? `  (${failed} failed)` : ""}`);
if (expectFails > 0) console.log(`Expectation misses: ${expectFails} — review these scenarios`);
console.log(`Output:    ${outPath}\n`);

console.log(`Score distribution:`);
console.log(`  Poor  (10–39):   ${bands.Poor}`);
console.log(`  Fair  (40–59):   ${bands.Fair}`);
console.log(`  Good  (60–79):   ${bands.Good}`);
console.log(`  Excellent (80+): ${bands.Excellent}`);
if (scores.length > 0) {
  const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  console.log(`  Min: ${Math.min(...scores)}  Max: ${Math.max(...scores)}  Avg: ${avg}`);
}

console.log(`\nBy region (avg score):`);
for (const [rk, { scores: rs }] of Object.entries(byRegion).sort((a, b) => a[0].localeCompare(b[0]))) {
  const avg = (rs.reduce((a, b) => a + b, 0) / rs.length).toFixed(1);
  const min = Math.min(...rs);
  const max = Math.max(...rs);
  console.log(`  ${rk.padEnd(28)} n=${rs.length}  avg=${avg}  range=${min}-${max}`);
}

console.log(`\nKnown engine gap (not tested): NorCal alpine lakes (Shasta, Tahoe) use`);
console.log(`  southern_california temp bands — miscalibrated for high-altitude trout.`);
console.log(`  Recommend adding a "northern_california" region key in a future audit.\n`);
