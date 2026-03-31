import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";

export const DEFAULT_ARCHIVE_MONTHS = [3, 4, 5, 6, 7, 8] as const;

export type ArchiveAuditScenario = {
  id: string;
  fishery_key: string;
  fishery_label: string;
  fishery_group: string;
  species_focus: string[];
  priority: "core";
  latitude: number;
  longitude: number;
  local_date: string;
  local_timezone: string;
  context: EngineContext;
  region_key: RegionKey;
  state_code: string;
  tide_station_id?: string;
  notes: string;
};

type FisheryDefinition = {
  key: string;
  label: string;
  fishery_group: string;
  species_focus: string[];
  latitude: number;
  longitude: number;
  local_timezone: string;
  context: EngineContext;
  region_key: RegionKey;
  state_code: string;
  tide_station_id?: string;
  notes: string;
};

const MONTH_DATE: Record<number, string> = {
  1: "2025-01-18",
  2: "2025-02-15",
  3: "2024-03-16",
  4: "2024-04-13",
  5: "2024-05-18",
  6: "2024-06-15",
  7: "2024-07-13",
  8: "2024-08-17",
  9: "2024-09-14",
  10: "2024-10-19",
  11: "2024-11-16",
  12: "2024-12-14",
};

const FISHERIES: FisheryDefinition[] = [
  {
    key: "lake_erie_western_basin",
    label: "Lake Erie Western Basin, OH",
    fishery_group: "Great Lakes lake",
    species_focus: ["walleye", "smallmouth", "pike"],
    latitude: 41.69,
    longitude: -83.37,
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    state_code: "OH",
    notes:
      "Top-tier Great Lakes warmwater fishery with huge walleye and smallmouth pressure.",
  },
  {
    key: "lake_st_clair",
    label: "Lake St. Clair, MI",
    fishery_group: "Great Lakes lake",
    species_focus: ["smallmouth", "pike", "walleye"],
    latitude: 42.57,
    longitude: -82.78,
    local_timezone: "America/Detroit",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    state_code: "MI",
    notes:
      "High-pressure smallmouth and pike water with mainstream Midwest relevance.",
  },
  {
    key: "mille_lacs",
    label: "Mille Lacs, MN",
    fishery_group: "Upper Midwest lake",
    species_focus: ["walleye", "smallmouth", "pike"],
    latitude: 46.24,
    longitude: -93.67,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    state_code: "MN",
    notes: "Iconic multi-species Midwest lake with broad national familiarity.",
  },
  {
    key: "leech_lake",
    label: "Leech Lake, MN",
    fishery_group: "Upper Midwest lake",
    species_focus: ["walleye", "pike", "bass"],
    latitude: 47.13,
    longitude: -94.36,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    state_code: "MN",
    notes:
      "Mainstream Minnesota multi-species benchmark with heavy walleye and pike pressure.",
  },
  {
    key: "devils_lake",
    label: "Devils Lake, ND",
    fishery_group: "Midwest interior lake",
    species_focus: ["walleye", "pike"],
    latitude: 48.11,
    longitude: -98.88,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "midwest_interior",
    state_code: "ND",
    notes:
      "Popular Plains walleye and pike lake that broadens inland cold-season coverage.",
  },
  {
    key: "lake_of_the_ozarks",
    label: "Lake of the Ozarks, MO",
    fishery_group: "Midwest interior reservoir",
    species_focus: ["bass"],
    latitude: 38.2,
    longitude: -92.69,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "midwest_interior",
    state_code: "MO",
    notes:
      "High-pressure bass reservoir that gives the inland Midwest more mainstream lake coverage.",
  },
  {
    key: "sam_rayburn",
    label: "Sam Rayburn Reservoir, TX",
    fishery_group: "Southern bass lake",
    species_focus: ["bass"],
    latitude: 31.06,
    longitude: -94.16,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    state_code: "TX",
    notes: "One of the most heavily fished bass reservoirs in the country.",
  },
  {
    key: "toledo_bend",
    label: "Toledo Bend Reservoir, TX",
    fishery_group: "Southern bass lake",
    species_focus: ["bass"],
    latitude: 31.41,
    longitude: -93.72,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    state_code: "TX",
    notes:
      "Large mainstream bass reservoir that adds another heavily fished southern lake benchmark.",
  },
  {
    key: "lake_fork",
    label: "Lake Fork, TX",
    fishery_group: "Southern bass lake",
    species_focus: ["bass"],
    latitude: 32.84,
    longitude: -95.53,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    state_code: "TX",
    notes:
      "High-profile trophy bass water that should stress warm-season freshwater logic.",
  },
  {
    key: "kentucky_lake",
    label: "Kentucky Lake, KY",
    fishery_group: "Southern bass lake",
    species_focus: ["bass"],
    latitude: 36.95,
    longitude: -88.21,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    state_code: "KY",
    notes:
      "Nationally relevant Tennessee Valley bass benchmark with broad mainstream familiarity.",
  },
  {
    key: "lake_guntersville",
    label: "Lake Guntersville, AL",
    fishery_group: "Southern bass lake",
    species_focus: ["bass"],
    latitude: 34.39,
    longitude: -86.29,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    state_code: "AL",
    notes:
      "Elite tournament-level bass lake that should carry real weight in the inland final pass.",
  },
  {
    key: "lake_okeechobee",
    label: "Lake Okeechobee, FL",
    fishery_group: "Florida freshwater lake",
    species_focus: ["bass"],
    latitude: 26.94,
    longitude: -80.8,
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "florida",
    state_code: "FL",
    notes:
      "Flagship Florida largemouth lake that gives the final pass a true inland warm-climate benchmark.",
  },
  {
    key: "lake_winnipesaukee",
    label: "Lake Winnipesaukee, NH",
    fishery_group: "Northeast lake",
    species_focus: ["bass", "trout"],
    latitude: 43.6,
    longitude: -71.37,
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "northeast",
    state_code: "NH",
    notes:
      "True Northeast lake benchmark that broadens the final pass beyond rivers and saltwater.",
  },
  {
    key: "sebago_lake",
    label: "Sebago Lake, ME",
    fishery_group: "Northeast lake",
    species_focus: ["bass", "trout"],
    latitude: 43.83,
    longitude: -70.61,
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "northeast",
    state_code: "ME",
    notes:
      "Popular Northeast lake that adds cold-water inland coverage without leaning on edge-case mountain water.",
  },
  {
    key: "lake_champlain",
    label: "Lake Champlain, NY/VT",
    fishery_group: "Northeast lake",
    species_focus: ["bass", "pike", "trout"],
    latitude: 44.56,
    longitude: -73.33,
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "northeast",
    state_code: "NY",
    notes:
      "Nationally recognized Northeast multi-species lake with major bass and pike relevance.",
  },
  {
    key: "oneida_lake",
    label: "Oneida Lake, NY",
    fishery_group: "Northeast lake",
    species_focus: ["walleye", "bass", "pike"],
    latitude: 43.22,
    longitude: -76.02,
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    state_code: "NY",
    notes:
      "Mainstream Northeast walleye and bass lake that helps round out inland pressure waters.",
  },
  {
    key: "green_bay_sturgeon",
    label: "Green Bay / Sturgeon Bay, WI",
    fishery_group: "Great Lakes lake",
    species_focus: ["walleye", "smallmouth", "pike"],
    latitude: 44.9,
    longitude: -87.25,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    state_code: "WI",
    notes:
      "Top-shelf Great Lakes smallmouth and walleye water with very mainstream angler pressure.",
  },
  {
    key: "fox_chain_olakes",
    label: "Fox Chain O'Lakes, IL",
    fishery_group: "Upper Midwest lake",
    species_focus: ["bass", "pike"],
    latitude: 42.39,
    longitude: -88.16,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    state_code: "IL",
    notes:
      "High-pressure northern Illinois bass and pike chain that gives the final audit a realistic mainstream inland benchmark.",
  },
  {
    key: "lake_wawasee",
    label: "Lake Wawasee, IN",
    fishery_group: "Upper Midwest lake",
    species_focus: ["bass", "pike"],
    latitude: 41.41,
    longitude: -85.69,
    local_timezone: "America/Indiana/Indianapolis",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    state_code: "IN",
    notes:
      "Popular northern Indiana bass and pike lake that rounds out heavily fished Great Lakes fringe water.",
  },
  {
    key: "table_rock_lake",
    label: "Table Rock Lake, MO",
    fishery_group: "Midwest interior reservoir",
    species_focus: ["bass"],
    latitude: 36.62,
    longitude: -93.46,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    state_code: "MO",
    notes:
      "Widely known Ozark bass reservoir that adds another mainstream inland benchmark.",
  },
  {
    key: "pickwick_lake",
    label: "Pickwick Lake, AL",
    fishery_group: "Southern bass lake",
    species_focus: ["bass"],
    latitude: 34.93,
    longitude: -88.26,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    state_code: "AL",
    notes:
      "Major tournament bass water that should be in a final mainstream inland pass.",
  },
  {
    key: "chickamauga_lake",
    label: "Chickamauga Lake, TN",
    fishery_group: "Southern bass lake",
    species_focus: ["bass"],
    latitude: 35.34,
    longitude: -85.17,
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    state_code: "TN",
    notes:
      "High-profile Tennessee bass lake with constant national visibility.",
  },
  {
    key: "lake_texoma",
    label: "Lake Texoma, TX",
    fishery_group: "Southern multi-species lake",
    species_focus: ["stripers", "bass"],
    latitude: 33.84,
    longitude: -96.78,
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    state_code: "TX",
    notes:
      "Mainstream inland striper and bass benchmark that expands the audit beyond pure bass lakes.",
  },
  {
    key: "lake_lanier",
    label: "Lake Lanier, GA",
    fishery_group: "Southeast reservoir",
    species_focus: ["bass", "stripers"],
    latitude: 34.15,
    longitude: -84.02,
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    state_code: "GA",
    notes:
      "Heavily fished Southeast lake with strong bass and striper mainstream relevance.",
  },
  {
    key: "lake_hartwell",
    label: "Lake Hartwell, SC",
    fishery_group: "Southeast reservoir",
    species_focus: ["bass", "stripers"],
    latitude: 34.46,
    longitude: -82.89,
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    state_code: "SC",
    notes:
      "Tournament-level Southeast reservoir that gives the audit another high-pressure inland fishery.",
  },
  {
    key: "jordan_lake",
    label: "Jordan Lake, NC",
    fishery_group: "Southeast reservoir",
    species_focus: ["bass"],
    latitude: 35.73,
    longitude: -79.05,
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "southeast_atlantic",
    state_code: "NC",
    notes:
      "Mainstream North Carolina bass reservoir with broad public pressure and realistic shoulder-season variability.",
  },
  {
    key: "smith_mountain_lake",
    label: "Smith Mountain Lake, VA",
    fishery_group: "Appalachian reservoir",
    species_focus: ["bass"],
    latitude: 37.11,
    longitude: -79.61,
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "appalachian",
    state_code: "VA",
    notes:
      "High-profile Virginia bass reservoir that adds a mainstream Appalachian foothills lake to the final pass.",
  },
  {
    key: "santee_cooper",
    label: "Santee Cooper, SC",
    fishery_group: "Southeast lake",
    species_focus: ["bass", "stripers"],
    latitude: 33.4,
    longitude: -80.3,
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "southeast_atlantic",
    state_code: "SC",
    notes:
      "Classic South Carolina inland system with real bass and striper pressure.",
  },
  {
    key: "clear_lake_ca",
    label: "Clear Lake, CA",
    fishery_group: "Western bass lake",
    species_focus: ["bass"],
    latitude: 39.01,
    longitude: -122.77,
    local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond",
    region_key: "northern_california",
    state_code: "CA",
    notes:
      "Mainstream California bass benchmark that adds more realistic western inland pressure water.",
  },
  {
    key: "pere_marquette_baldwin",
    label: "Pere Marquette near Baldwin, MI",
    fishery_group: "Midwest trout river",
    species_focus: ["trout"],
    latitude: 43.89,
    longitude: -85.89,
    local_timezone: "America/Detroit",
    context: "freshwater_river",
    region_key: "great_lakes_upper_midwest",
    state_code: "MI",
    notes:
      "Direct follow-up to the Baldwin concern; heavily fished trout river benchmark.",
  },
  {
    key: "white_river",
    label: "White River, AR",
    fishery_group: "Southern trout river",
    species_focus: ["trout"],
    latitude: 36.24,
    longitude: -92.55,
    local_timezone: "America/Chicago",
    context: "freshwater_river",
    region_key: "south_central",
    state_code: "AR",
    notes:
      "Nationally known tailwater trout fishery with strong mainstream pressure.",
  },
  {
    key: "west_branch_delaware",
    label: "West Branch Delaware, NY",
    fishery_group: "Northeast trout river",
    species_focus: ["trout"],
    latitude: 42.01,
    longitude: -75.39,
    local_timezone: "America/New_York",
    context: "freshwater_river",
    region_key: "northeast",
    state_code: "NY",
    notes: "Classic Northeast trout river for spring-summer archive checks.",
  },
  {
    key: "new_river",
    label: "New River, WV",
    fishery_group: "Appalachian river",
    species_focus: ["bass", "trout"],
    latitude: 38.05,
    longitude: -81.06,
    local_timezone: "America/New_York",
    context: "freshwater_river",
    region_key: "appalachian",
    state_code: "WV",
    notes:
      "High-visibility Appalachian river with real bass pressure and regional relevance.",
  },
  {
    key: "susquehanna_river",
    label: "Susquehanna River, PA",
    fishery_group: "Appalachian river",
    species_focus: ["bass", "stripers"],
    latitude: 40.26,
    longitude: -76.89,
    local_timezone: "America/New_York",
    context: "freshwater_river",
    region_key: "northeast",
    state_code: "PA",
    notes:
      "Mainstream smallmouth river with real East Coast pressure and broad national familiarity.",
  },
  {
    key: "detroit_river",
    label: "Detroit River, MI",
    fishery_group: "Great Lakes river",
    species_focus: ["walleye", "smallmouth"],
    latitude: 42.33,
    longitude: -83.04,
    local_timezone: "America/Detroit",
    context: "freshwater_river",
    region_key: "great_lakes_upper_midwest",
    state_code: "MI",
    notes:
      "High-pressure Great Lakes walleye corridor that adds an important mainstream river case.",
  },
  {
    key: "chesapeake_bay",
    label: "Chesapeake Bay, MD",
    fishery_group: "Atlantic inshore",
    species_focus: ["stripers"],
    latitude: 38.97,
    longitude: -76.48,
    local_timezone: "America/New_York",
    context: "coastal",
    region_key: "southeast_atlantic",
    state_code: "MD",
    tide_station_id: "8574680",
    notes: "Core striped bass benchmark for East Coast inshore logic.",
  },
  {
    key: "sandy_hook",
    label: "Sandy Hook / Raritan Bay, NJ",
    fishery_group: "Atlantic inshore",
    species_focus: ["stripers"],
    latitude: 40.46,
    longitude: -74.00,
    local_timezone: "America/New_York",
    context: "coastal",
    region_key: "northeast",
    state_code: "NJ",
    tide_station_id: "8531680",
    notes: "Mainstream striped bass coast benchmark in the Northeast corridor.",
  },
  {
    key: "tampa_bay",
    label: "Tampa Bay, FL",
    fishery_group: "Florida inshore",
    species_focus: ["snook", "seatrout", "tarpon", "redfish"],
    latitude: 27.73,
    longitude: -82.55,
    local_timezone: "America/New_York",
    context: "coastal",
    region_key: "florida",
    state_code: "FL",
    tide_station_id: "8726520",
    notes:
      "High-volume inshore benchmark for snook, trout, redfish, and tarpon-adjacent conditions.",
  },
  {
    key: "mosquito_lagoon",
    label: "Mosquito Lagoon, FL",
    fishery_group: "Florida flats",
    species_focus: ["redfish", "seatrout", "snook"],
    latitude: 28.98,
    longitude: -80.85,
    local_timezone: "America/New_York",
    context: "coastal_flats_estuary",
    region_key: "florida",
    state_code: "FL",
    tide_station_id: "8721604",
    notes:
      "Skinny-water Florida flats benchmark where air-temp choice matters most.",
  },
  {
    key: "lower_laguna_madre",
    label: "Lower Laguna Madre, TX",
    fishery_group: "Gulf flats",
    species_focus: ["redfish", "seatrout"],
    latitude: 26.07,
    longitude: -97.17,
    local_timezone: "America/Chicago",
    context: "coastal_flats_estuary",
    region_key: "gulf_coast",
    state_code: "TX",
    tide_station_id: "8779770",
    notes: "Extremely popular Texas flats benchmark for redfish and trout.",
  },
  {
    key: "charleston_marsh",
    label: "Charleston Marsh, SC",
    fishery_group: "Atlantic flats",
    species_focus: ["redfish", "seatrout"],
    latitude: 32.78,
    longitude: -79.93,
    local_timezone: "America/New_York",
    context: "coastal_flats_estuary",
    region_key: "southeast_atlantic",
    state_code: "SC",
    tide_station_id: "8665530",
    notes:
      "Atlantic marsh benchmark for redfish/trout and moving-tide shallow water.",
  },
  {
    key: "san_francisco_bay_delta",
    label: "San Francisco Bay / Delta, CA",
    fishery_group: "Pacific estuary",
    species_focus: ["stripers"],
    latitude: 37.82,
    longitude: -122.36,
    local_timezone: "America/Los_Angeles",
    context: "coastal_flats_estuary",
    region_key: "northern_california",
    state_code: "CA",
    tide_station_id: "9414290",
    notes:
      "Mainstream Pacific estuary benchmark with real striped bass pressure.",
  },
  {
    key: "galveston_bay",
    label: "Galveston Bay, TX",
    fishery_group: "Gulf inshore",
    species_focus: ["redfish", "seatrout"],
    latitude: 29.44,
    longitude: -94.87,
    local_timezone: "America/Chicago",
    context: "coastal",
    region_key: "gulf_coast",
    state_code: "TX",
    tide_station_id: "8771450",
    notes:
      "One of the most heavily fished inshore systems in the country for redfish and trout.",
  },
];

function monthDate(month: number): string {
  const date = MONTH_DATE[month];
  if (!date) throw new Error(`No archive date configured for month ${month}.`);
  return date;
}

export function buildArchiveAuditScenarios(
  months: number[] = [...DEFAULT_ARCHIVE_MONTHS],
): ArchiveAuditScenario[] {
  const dedupedMonths = [...new Set(months)].sort((a, b) => a - b);

  return FISHERIES.flatMap((fishery) =>
    dedupedMonths.map((month) => ({
      id: `${fishery.key}-${monthDate(month)}`,
      fishery_key: fishery.key,
      fishery_label: fishery.label,
      fishery_group: fishery.fishery_group,
      species_focus: [...fishery.species_focus],
      priority: "core" as const,
      latitude: fishery.latitude,
      longitude: fishery.longitude,
      local_date: monthDate(month),
      local_timezone: fishery.local_timezone,
      context: fishery.context,
      region_key: fishery.region_key,
      state_code: fishery.state_code,
      ...(fishery.tide_station_id
        ? { tide_station_id: fishery.tide_station_id }
        : {}),
      notes: fishery.notes,
    }))
  );
}
