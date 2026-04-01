import type { EngineContext } from "../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { SpeciesGroup, WaterClarity } from "../supabase/functions/_shared/recommenderEngine/index.ts";

export type RecommenderCalibrationScenario = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  state_code: string;
  timezone: string;
  local_date: string;
  species: SpeciesGroup;
  context: EngineContext;
  water_clarity: WaterClarity;
  env_data: Record<string, unknown>;
};

function makeWeather(
  temperature: number,
  wind_speed: number,
  cloud_cover: number,
  pressureSeries: number[],
  tempHigh: number,
  tempLow: number,
  precipDaily = 0,
) {
  return {
    temperature,
    pressure_48hr: pressureSeries,
    pressure: pressureSeries[pressureSeries.length - 1] ?? 1013,
    wind_speed,
    wind_speed_unit: "mph",
    cloud_cover,
    temp_7day_high: Array.from({ length: 21 }, () => tempHigh),
    temp_7day_low: Array.from({ length: 21 }, () => tempLow),
    precip_7day_daily: Array.from({ length: 21 }, () => precipDaily),
    precip_7day_inches: precipDaily * 7,
  };
}

export const RECOMMENDER_CALIBRATION_SCENARIOS: RecommenderCalibrationScenario[] = [
  {
    id: "lmb_fl_pond_murky_baitfish",
    label: "Florida pond largemouth, murky water, spring mixed forage",
    latitude: 28.0614,
    longitude: -82.3026,
    state_code: "FL",
    timezone: "America/New_York",
    local_date: "2026-04-01",
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "dirty",
    env_data: {
      weather: makeWeather(73, 8, 35, Array.from({ length: 48 }, (_, i) => 1012 - Math.sin(i / 8) * 0.2), 82, 61, 0.05),
    },
  },
  {
    id: "lmb_prespawn_clear_weededge",
    label: "Largemouth pre-spawn, clear lake, weed edges",
    latitude: 28.5383,
    longitude: -81.3792,
    state_code: "FL",
    timezone: "America/New_York",
    local_date: "2026-03-20",
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "clear",
    env_data: {
      weather: makeWeather(61, 6, 35, Array.from({ length: 48 }, (_, i) => 1011 + i * 0.04), 76, 55),
    },
  },
  {
    id: "walleye_lowlight_river",
    label: "Walleye river bite, stained water, low-light wind",
    latitude: 46.8772,
    longitude: -96.7898,
    state_code: "ND",
    timezone: "America/Chicago",
    local_date: "2026-05-02",
    species: "walleye",
    context: "freshwater_river",
    water_clarity: "stained",
    env_data: {
      weather: makeWeather(50, 14, 88, Array.from({ length: 48 }, (_, i) => 1008 - i * 0.03), 59, 41, 0.1),
    },
  },
  {
    id: "river_trout_summer_edge",
    label: "River trout, summer thermal edge, clear current",
    latitude: 43.7904,
    longitude: -110.6818,
    state_code: "WY",
    timezone: "America/Denver",
    local_date: "2026-07-12",
    species: "river_trout",
    context: "freshwater_river",
    water_clarity: "clear",
    env_data: {
      weather: makeWeather(64, 8, 30, Array.from({ length: 48 }, () => 1014), 74, 49),
      measured_water_temp_f: 66,
    },
  },
  {
    id: "redfish_flats_tide",
    label: "Redfish on stained grass flats with incoming tide",
    latitude: 29.1872,
    longitude: -81.0042,
    state_code: "FL",
    timezone: "America/New_York",
    local_date: "2026-10-07",
    species: "redfish",
    context: "coastal_flats_estuary",
    water_clarity: "stained",
    env_data: {
      weather: makeWeather(73, 11, 55, Array.from({ length: 48 }, (_, i) => 1012 + Math.sin(i / 8) * 0.3), 81, 68),
      tides: {
        phase: "incoming",
        high_low: [
          { time: "2026-10-07T07:10:00-04:00", type: "low", value: 0.2 },
          { time: "2026-10-07T13:42:00-04:00", type: "high", value: 1.4 },
        ],
      },
    },
  },
  {
    id: "striped_bass_dirty_blitz",
    label: "Striped bass, dirty coastal current, bait blitz",
    latitude: 41.4901,
    longitude: -71.3128,
    state_code: "RI",
    timezone: "America/New_York",
    local_date: "2026-09-18",
    species: "striped_bass",
    context: "coastal",
    water_clarity: "dirty",
    env_data: {
      weather: makeWeather(63, 17, 72, Array.from({ length: 48 }, (_, i) => 1009 - i * 0.05), 70, 58),
      tides: {
        phase: "outgoing",
        high_low: [
          { time: "2026-09-18T05:05:00-04:00", type: "high", value: 2.1 },
          { time: "2026-09-18T11:14:00-04:00", type: "low", value: 0.4 },
        ],
      },
    },
  },
  {
    id: "snook_passes_clear_tide",
    label: "Snook in clear passes with moving tide",
    latitude: 26.1224,
    longitude: -80.1373,
    state_code: "FL",
    timezone: "America/New_York",
    local_date: "2026-06-14",
    species: "snook",
    context: "coastal",
    water_clarity: "clear",
    env_data: {
      weather: makeWeather(79, 9, 25, Array.from({ length: 48 }, (_, i) => 1013 + Math.cos(i / 7) * 0.25), 87, 77),
      tides: {
        phase: "incoming",
        high_low: [
          { time: "2026-06-14T06:22:00-04:00", type: "low", value: 0.3 },
          { time: "2026-06-14T12:37:00-04:00", type: "high", value: 1.6 },
        ],
      },
    },
  },
];
