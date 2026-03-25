/**
 * Shared real-weather audit scenarios — single source for alpine-norCal-sweep + run-live-audit.
 * Do not duplicate this list in alpine-norCal-sweep.ts.
 */
export type AuditScenario = {
  id: string;
  notes: string;
  latitude: number;
  longitude: number;
  local_date: string;
  local_timezone: string;
  context: "freshwater_lake_pond" | "freshwater_river" | "coastal";
  /** Explicit engine region for regression (production may auto-resolve similarly). */
  region_key: string;
  state_code: string;
  altitude_ft?: number;
  tide_station_id?: string;
  /** Set only after dates pass prime-gate checks (see docs/how-fishing-audit/PRIME_DAY_CONTRACT.md). */
  expect_band?: string;
};

export const AUDIT_SCENARIOS: AuditScenario[] = [

  // ── mountain_alpine region scenarios ──────────────────────────────────────
  // Dillon Reservoir CO (9,017ft) — confirms altitude override to mountain_alpine

  {
    id: "alpine-dillon-co-lake-sep",
    notes:
      "Dillon Reservoir CO (9,017ft) Sep — 2024-09-07 archive shows volatile pressure (not prime); biome/regression only",
    latitude: 39.63, longitude: -106.07,
    local_date: "2024-09-07", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 9017,
  },
  {
    id: "alpine-dillon-co-lake-jun",
    notes:
      "Dillon Reservoir CO post-ice-out Jun — 2024-06-08 archive volatile pressure (not prime); biome check only",
    latitude: 39.63, longitude: -106.07,
    local_date: "2024-06-08", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 9017,
  },
  {
    id: "alpine-dillon-co-river-aug",
    notes:
      "Blue River CO near Dillon — 2024-08-10 archive volatile pressure (not prime); river alpine check only",
    latitude: 39.60, longitude: -106.05,
    local_date: "2024-08-10", local_timezone: "America/Denver",
    context: "freshwater_river", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 9000,
  },
  {
    id: "alpine-dillon-co-lake-jan",
    notes:
      "Dillon Reservoir CO Jan ice season — 2024-01-13 not prime (volatile pressure + heavy cloud); no tight expect_band",
    latitude: 39.63, longitude: -106.07,
    local_date: "2024-01-13", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 9017,
  },
  {
    id: "alpine-yellowstone-lake-wy-sep",
    notes:
      "Yellowstone Lake WY (7,733ft) Sep — 2024-09-12 archive volatile pressure (not prime); alpine lake check only",
    latitude: 44.45, longitude: -110.37,
    local_date: "2024-09-12", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "WY",
    altitude_ft: 7733,
  },
  {
    id: "alpine-yellowstone-river-wy-jul",
    notes: "Firehole/Madison River WY (7,300ft) — Jul dry fly; classic Yellowstone summer window",
    latitude: 44.56, longitude: -110.82,
    local_date: "2024-07-13", local_timezone: "America/Denver",
    context: "freshwater_river", region_key: "mountain_alpine", state_code: "WY",
    altitude_ft: 7300, expect_band: "Good",
  },
  {
    id: "alpine-tahoe-ca-lake-oct",
    notes: "Lake Tahoe CA (6,225ft) — Oct mackinaw (lake trout) prime; confirms NorCal+altitude → mountain_alpine override",
    latitude: 39.10, longitude: -120.03,
    local_date: "2024-10-05", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CA",
    altitude_ft: 6225, expect_band: "Good",
  },
  {
    id: "alpine-blue-mesa-co-lake-may",
    notes:
      "Blue Mesa Reservoir CO (7,519ft) May — 2024-05-11 archive volatile pressure (not prime); spring alpine check only",
    latitude: 38.45, longitude: -107.35,
    local_date: "2024-05-11", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 7519,
  },

  // ── northern_california region scenarios ───────────────────────────────────

  {
    id: "norcal-shasta-lake-oct",
    notes: "SHOULD BE GOOD+: Lake Shasta CA (~1,000ft) — Oct prime fall bass/salmon; NorCal best season",
    latitude: 40.72, longitude: -122.41,
    local_date: "2024-10-12", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "northern_california", state_code: "CA",
    altitude_ft: 1000, expect_band: "Good",
  },
  {
    id: "norcal-shasta-lake-apr",
    notes: "SHOULD BE GOOD+: Lake Shasta CA — Apr bass pre-spawn; 58-68°F prime temps",
    latitude: 40.72, longitude: -122.41,
    local_date: "2024-04-20", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "northern_california", state_code: "CA",
    altitude_ft: 1000, expect_band: "Good",
  },
  {
    id: "norcal-sacramento-river-jan",
    notes:
      "Sacramento River CA Jan — 2024-01-20 archive ~100% cloud (not prime glare/stack); river NorCal check only",
    latitude: 40.17, longitude: -122.24,
    local_date: "2024-01-20", local_timezone: "America/Los_Angeles",
    context: "freshwater_river", region_key: "northern_california", state_code: "CA",
    altitude_ft: 350,
  },
  {
    id: "norcal-trinity-river-nov",
    notes: "Trinity River CA — Nov steelhead run; prime fall-run chinook and steelhead window",
    latitude: 40.69, longitude: -123.12,
    local_date: "2024-11-09", local_timezone: "America/Los_Angeles",
    context: "freshwater_river", region_key: "northern_california", state_code: "CA",
    altitude_ft: 2000, expect_band: "Good",
  },
  {
    id: "norcal-shasta-lake-jul",
    notes: "Lake Shasta CA — Jul heat stress check; 95°F+ air temps suppress scoring",
    latitude: 40.72, longitude: -122.41,
    local_date: "2024-07-20", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "northern_california", state_code: "CA",
    altitude_ft: 1000, expect_band: "Fair",
  },
  {
    id: "norcal-bodega-bay-coastal-oct",
    notes:
      "Bodega Bay CA Oct — 2024-10-05 archive very clear sky (prime gate: glare); coastal NorCal check only",
    latitude: 38.33, longitude: -123.05,
    local_date: "2024-10-05", local_timezone: "America/Los_Angeles",
    context: "coastal", region_key: "northern_california", state_code: "CA",
    altitude_ft: 10, tide_station_id: "9415020",  // Bodega Bay NOAA
  },

  // ── Coastal "should be Excellent" validation ───────────────────────────────
  // Using dates with known falling pressure AND partial overcast (no glare)
  // + active tidal exchange — the combination needed to reach 80+

  {
    id: "excellent-chesapeake-bay-oct-overcast",
    notes:
      "Chesapeake Bay Oct — 2024-10-26 archive volatile pressure (not prime); MD coast check only. Station 8574680.",
    latitude: 38.72, longitude: -76.52,
    local_date: "2024-10-26", local_timezone: "America/New_York",
    context: "coastal", region_key: "southeast_atlantic", state_code: "MD",
    tide_station_id: "8574680",
  },
  {
    id: "excellent-outer-banks-nc-oct",
    notes: "Outer Banks NC — Oct prime; bluefish/striper blitz. Station 8652587 (Oregon Inlet).",
    latitude: 35.80, longitude: -75.60,
    local_date: "2024-10-19", local_timezone: "America/New_York",
    context: "coastal", region_key: "southeast_atlantic", state_code: "NC",
    tide_station_id: "8652587", expect_band: "Good",
  },
  {
    id: "excellent-puget-sound-wa-sep",
    notes:
      "Puget Sound WA Sep — 2024-09-21 passes prime good_stack; coastal temp/light calibration. Station 9447130.",
    latitude: 47.58, longitude: -122.33,
    local_date: "2024-09-21", local_timezone: "America/Los_Angeles",
    context: "coastal", region_key: "pacific_northwest", state_code: "WA",
    tide_station_id: "9447130", expect_band: "Good",
  },
  {
    id: "excellent-puget-sound-wa-oct",
    notes: "Puget Sound WA — Oct peak coho salmon; prime fall conditions. Station 9447130.",
    latitude: 47.58, longitude: -122.33,
    local_date: "2024-10-12", local_timezone: "America/Los_Angeles",
    context: "coastal", region_key: "pacific_northwest", state_code: "WA",
    tide_station_id: "9447130", expect_band: "Good",
  },
  {
    id: "excellent-galveston-tx-nov",
    notes:
      "Galveston TX Nov — 2024-11-16 passes prime good_stack; coastal wind/light calibration. Station 8771450.",
    latitude: 29.30, longitude: -94.79,
    local_date: "2024-11-16", local_timezone: "America/Chicago",
    context: "coastal", region_key: "gulf_coast", state_code: "TX",
    tide_station_id: "8771450", expect_band: "Good",
  },
  {
    id: "excellent-mobile-bay-al-oct",
    notes: "Mobile Bay AL — Oct prime redfish/speckled trout. Station 8737048.",
    latitude: 30.69, longitude: -88.04,
    local_date: "2024-10-05", local_timezone: "America/Chicago",
    context: "coastal", region_key: "gulf_coast", state_code: "AL",
    tide_station_id: "8737048", expect_band: "Good",
  },

  // ── mountain_alpine: more months + cold-front / ice-adjacent coverage ───────

  {
    id: "alpine-grand-lake-co-nov",
    notes: "Grand Lake CO (~8,369ft) — late fall; short bite windows, approaching ice season",
    latitude: 40.08, longitude: -105.85,
    local_date: "2024-11-18", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 8369,
  },
  {
    id: "alpine-turquoise-lake-co-dec",
    notes: "Turquoise Lake CO (Leadville ~9,900ft) — Dec ice-adjacent; confirms alpine winter ceiling",
    latitude: 39.27, longitude: -106.37,
    local_date: "2024-12-07", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 9900,
  },
  {
    id: "alpine-georgetown-lake-mt-jan",
    notes: "Georgetown Lake MT (~6,500ft) — Jan ice-fishing / lethargic open-water check",
    latitude: 46.20, longitude: -113.23,
    local_date: "2024-01-27", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "MT",
    altitude_ft: 6500,
  },
  {
    id: "alpine-june-lake-ca-oct",
    notes: "June Lake CA Eastern Sierra (~7,600ft) — fall trout; high-sierra alpine validation",
    latitude: 37.77, longitude: -119.09,
    local_date: "2024-10-22", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CA",
    altitude_ft: 7600,
  },
  {
    id: "alpine-taylor-park-co-jun-front",
    notes: "Taylor Park Reservoir CO (~9,400ft) — Jun weather varies; check cold rain reality vs prime label",
    latitude: 38.87, longitude: -106.58,
    local_date: "2024-06-18", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 9420,
  },
  {
    id: "alpine-rio-grande-co-river-nov",
    notes: "Upper Rio Grande headwaters CO (~9,000ft) — Nov brown/rainbow late season",
    latitude: 37.75, longitude: -107.25,
    local_date: "2024-11-08", local_timezone: "America/Denver",
    context: "freshwater_river", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 9000,
  },

  // ── northern_california: Oct/Jan/Nov + more contexts ────────────────────────

  {
    id: "norcal-clear-lake-oct",
    notes: "Clear Lake CA — hottest natural lake; Oct cooling bite should score Good+",
    latitude: 39.02, longitude: -122.88,
    local_date: "2024-10-18", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "northern_california", state_code: "CA",
    altitude_ft: 1350, expect_band: "Good",
  },
  {
    id: "norcal-lake-almanor-nov",
    notes: "Lake Almanor CA — Nov coldwater trout/bass; NorCal plateau fall",
    latitude: 40.12, longitude: -121.13,
    local_date: "2024-11-14", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "northern_california", state_code: "CA",
    altitude_ft: 4500,
  },
  {
    id: "norcal-feather-river-oct",
    notes: "Feather River CA (Oroville) — Oct salmon/steelhead staging; rain-vulnerable",
    latitude: 39.52, longitude: -121.56,
    local_date: "2024-10-08", local_timezone: "America/Los_Angeles",
    context: "freshwater_river", region_key: "northern_california", state_code: "CA",
    altitude_ft: 250, expect_band: "Good",
  },
  {
    id: "norcal-klamath-river-jan",
    notes: "Klamath River CA — Jan steelhead; winter flow and turbidity check",
    latitude: 41.33, longitude: -123.58,
    local_date: "2024-01-12", local_timezone: "America/Los_Angeles",
    context: "freshwater_river", region_key: "northern_california", state_code: "CA",
    altitude_ft: 400,
  },
  {
    id: "norcal-sacramento-river-oct",
    notes: "Sacramento River Delta approaches — Oct striped bass / salmon overlap",
    latitude: 38.57, longitude: -121.58,
    local_date: "2024-10-25", local_timezone: "America/Los_Angeles",
    context: "freshwater_river", region_key: "northern_california", state_code: "CA",
    altitude_ft: 50, expect_band: "Good",
  },
  {
    id: "norcal-arena-cove-coastal-sep",
    notes: "Arena Cove CA (Mendocino coast) — NorCal fall salmon/rockfish; NOAA tides 9418767",
    latitude: 38.91, longitude: -123.71,
    local_date: "2024-09-28", local_timezone: "America/Los_Angeles",
    context: "coastal", region_key: "northern_california", state_code: "CA",
    altitude_ft: 10, tide_station_id: "9418767",
  },
  {
    id: "norcal-sf-bay-coastal-nov",
    notes: "Central SF Bay — Nov halibut/striper; validate NorCal coastal bands + tides",
    latitude: 37.82, longitude: -122.36,
    local_date: "2024-11-03", local_timezone: "America/Los_Angeles",
    context: "coastal", region_key: "northern_california", state_code: "CA",
    altitude_ft: 10, tide_station_id: "9414290", expect_band: "Good",
  },

  // ── Coastal “prime stack”: falling pressure + tide + partial cloud (dates 2024) ──

  {
    id: "excellent-wilmington-nc-oct",
    notes: "Cape Fear River mouth NC — Oct red drum; station 8658163",
    latitude: 34.23, longitude: -77.95,
    local_date: "2024-10-14", local_timezone: "America/New_York",
    context: "coastal", region_key: "southeast_atlantic", state_code: "NC",
    tide_station_id: "8658163",
  },
  {
    id: "excellent-springmaid-pier-sc-nov",
    notes: "Springmaid Pier Myrtle Beach SC — Nov inshore; NOAA station 8665530 (valid hi/lo predictions)",
    latitude: 33.65, longitude: -78.92,
    local_date: "2024-11-09", local_timezone: "America/New_York",
    context: "coastal", region_key: "southeast_atlantic", state_code: "SC",
    tide_station_id: "8665530",
  },
  {
    id: "excellent-cape-may-nj-oct",
    notes: "Delaware Bay near Cape May NJ — Oct striped bass run; station 8536110",
    latitude: 38.97, longitude: -74.96,
    local_date: "2024-10-21", local_timezone: "America/New_York",
    context: "coastal", region_key: "northeast", state_code: "NJ",
    tide_station_id: "8536110",
  },
  {
    id: "excellent-boston-harbor-ma-nov",
    notes: "Boston Harbor MA — Nov; real weather may not stack pressure+tide+light for 80+",
    latitude: 42.35, longitude: -71.05,
    local_date: "2024-11-07", local_timezone: "America/New_York",
    context: "coastal", region_key: "northeast", state_code: "MA",
    tide_station_id: "8443970",
  },
  {
    id: "excellent-westport-wa-sep",
    notes: "Grays Harbor WA — Sep coho; station 9449424",
    latitude: 46.90, longitude: -124.11,
    local_date: "2024-09-14", local_timezone: "America/Los_Angeles",
    context: "coastal", region_key: "pacific_northwest", state_code: "WA",
    tide_station_id: "9449424",
  },
  {
    id: "excellent-astoria-or-oct",
    notes: "Columbia River bar OR — Oct fall salmon; station 9439040",
    latitude: 46.21, longitude: -123.77,
    local_date: "2024-10-03", local_timezone: "America/Los_Angeles",
    context: "coastal", region_key: "pacific_northwest", state_code: "OR",
    tide_station_id: "9439040",
  },
  {
    id: "excellent-key-west-fl-jan",
    notes: "Key West FL — Jan; warm calm days can still show Fair if tide/light/pressure do not stack",
    latitude: 24.56, longitude: -81.80,
    local_date: "2024-01-18", local_timezone: "America/New_York",
    context: "coastal", region_key: "florida", state_code: "FL",
    tide_station_id: "8724580",
  },

  // ── Regions / months where synthetic “excellent” historically dipped <70 ─────

  {
    id: "sweep-anchor-greatlakes-erie-jan-lake",
    notes: "Lake Erie OH ice-adjacent — Jan cold stress; synthetic E floor check",
    latitude: 41.77, longitude: -82.78,
    local_date: "2024-01-22", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "great_lakes_upper_midwest", state_code: "OH",
  },
  {
    id: "sweep-anchor-mountain-west-id-river-mar",
    notes: "Snake River canyon ID — Mar cold runoff onset",
    latitude: 44.07, longitude: -114.95,
    local_date: "2024-03-22", local_timezone: "America/Boise",
    context: "freshwater_river", region_key: "mountain_west", state_code: "ID",
  },
  {
    id: "sweep-anchor-southwest-desert-az-lake-jul",
    notes: "Roosevelt Lake AZ — Jul desert heat cap validation",
    latitude: 33.67, longitude: -110.94,
    local_date: "2024-07-25", local_timezone: "America/Phoenix",
    context: "freshwater_lake_pond", region_key: "southwest_desert", state_code: "AZ",
  },
  {
    id: "sweep-anchor-florida-lake-jan",
    notes: "Lake Toho FL — Jan mild winter largemouth",
    latitude: 28.14, longitude: -81.37,
    local_date: "2024-01-25", local_timezone: "America/New_York",
    context: "freshwater_lake_pond", region_key: "florida", state_code: "FL",
  },
  {
    id: "sweep-anchor-northeast-river-apr",
    notes: "Delaware River PA — Apr shad / smallmouth pre-spawn",
    latitude: 41.97, longitude: -75.27,
    local_date: "2024-04-18", local_timezone: "America/New_York",
    context: "freshwater_river", region_key: "northeast", state_code: "PA",
  },
  {
    id: "sweep-anchor-south-central-lake-sep",
    notes: "Broken Bow Lake OK — Sep cooling bass",
    latitude: 34.14, longitude: -94.88,
    local_date: "2024-09-24", local_timezone: "America/Chicago",
    context: "freshwater_lake_pond", region_key: "south_central", state_code: "OK",
  },
  {
    id: "sweep-anchor-pnw-lake-dec",
    notes: "Lake Washington WA — Dec cold rain shadow test",
    latitude: 47.62, longitude: -122.27,
    local_date: "2024-12-12", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "pacific_northwest", state_code: "WA",
  },

  // ── Appalachian / interior elevation stress (known gap: mountains vs flatlands) ──

  {
    id: "gap-appalachian-new-river-wv-oct",
    notes: "New River WV gorge — Oct smallmouth; WV auto-resolves to appalachian region",
    latitude: 37.76, longitude: -81.00,
    local_date: "2024-10-12", local_timezone: "America/New_York",
    context: "freshwater_river", region_key: "appalachian", state_code: "WV",
  },
  {
    id: "gap-davis-wv-river-jun",
    notes: "Davis WV highlands — Jun trout stream; appalachian temp bands",
    latitude: 39.11, longitude: -79.47,
    local_date: "2024-06-20", local_timezone: "America/New_York",
    context: "freshwater_river", region_key: "appalachian", state_code: "WV",
  },
  {
    id: "gap-hells-canyon-or-river-oct",
    notes: "Snake River Hells Canyon OR — east of Cascades; auto inland_northwest",
    latitude: 45.25, longitude: -116.50,
    local_date: "2024-10-15", local_timezone: "America/Boise",
    context: "freshwater_river", region_key: "inland_northwest", state_code: "OR",
  },

  // ── Alaska / Hawaii + alpine altitude + PNW strip regression ────────────────

  {
    id: "coverage-alaska-kenai-river-jun",
    notes: "Kenai River AK — alaska region_key + river context",
    latitude: 60.55,
    longitude: -151.26,
    local_date: "2024-06-10",
    local_timezone: "America/Anchorage",
    context: "freshwater_river",
    region_key: "alaska",
    state_code: "AK",
  },
  {
    id: "coverage-hawaii-oahu-lake-mar",
    notes: "Oahu HI — hawaii region_key tropical baseline",
    latitude: 21.42,
    longitude: -158.03,
    local_date: "2024-03-15",
    local_timezone: "Pacific/Honolulu",
    context: "freshwater_lake_pond",
    region_key: "hawaii",
    state_code: "HI",
  },
  {
    id: "coverage-alpine-dillon-altitude-sep",
    notes: "Dillon CO — altitude_ft → mountain_alpine in buildFromEnvData",
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
    id: "coverage-breckenridge-no-alt-jul",
    notes: "Breckenridge CO — no altitude; expect mountain_west until sync",
    latitude: 39.76,
    longitude: -106.07,
    local_date: "2024-07-14",
    local_timezone: "America/Denver",
    context: "freshwater_lake_pond",
    region_key: "mountain_west",
    state_code: "CO",
  },
  {
    id: "coverage-baker-city-inland-northwest-apr",
    notes: "Baker City OR (east of -118.2°) — inland_northwest vs maritime Seattle",
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
    notes: "Seattle WA — pacific_northwest maritime",
    latitude: 47.61,
    longitude: -122.33,
    local_date: "2024-03-22",
    local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond",
    region_key: "pacific_northwest",
    state_code: "WA",
  },

];
