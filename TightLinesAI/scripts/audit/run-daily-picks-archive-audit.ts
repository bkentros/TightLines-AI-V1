#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import { buildSharedEngineRequestFromEnvData } from "../../supabase/functions/_shared/howFishingEngine/index.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type {
  RecommendationGoal,
  RecommenderRequest,
  WaterClarity,
} from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import {
  type DailyPicksEngineResult,
  runDailyPicksEngine,
} from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";
import { shapeDailyPicksResponse } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/shapeDailyPicksResponse.ts";
import type { DailyPicksFutureResponse } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/shapeDailyPicksResponse.ts";
import type { CandidateScore } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts";
import type { DailyPicksVariant } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import type {
  ArchetypeProfileV4,
  ConditionTag,
  SeasonalRowV4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { LURE_ARCHETYPES_V4 } from "../../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { FLY_ARCHETYPES_V4 } from "../../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import { fetchArchiveWeather } from "./lib/fetchArchiveWeather.ts";
import type { ArchiveWeatherResult } from "./lib/fetchArchiveWeather.ts";
import { fetchSunriseSunset } from "./lib/fetchSunriseSunset.ts";
import { fetchUSNOMoon } from "./lib/fetchUSNOMoon.ts";
import { mapArchiveToEnvData } from "./lib/mapArchiveToEnvData.ts";
import {
  addDays,
  findDailyIndex,
  findNoonHourIndex,
  localDateFromUnix,
  localHourFromUnix,
} from "./lib/dateUtils.ts";

type Goal = RecommendationGoal;
type Side = "lure" | "fly";
type FlagCategory = "hard" | "credibility" | "variety";

type Fishery = {
  key: string;
  label: string;
  state: string;
  region_key: RegionKey;
  latitude: number;
  longitude: number;
  timezone: string;
  water_types: readonly EngineContext[];
};

type WeatherPlan = {
  fishery_key: string;
  date: string;
  water_type: EngineContext;
  intended_buckets: readonly string[];
};

type SpeciesAuditConfig = {
  species: SpeciesGroup;
  output_key: string;
  title_label: string;
  seed_prefix: string;
  fisheries: readonly Fishery[];
  weather_plan: readonly WeatherPlan[];
};

type ArchiveWeatherSummary = {
  wind_daylight_avg_mph: number | null;
  wind_daily_max_mph: number | null;
  cloud_noon_pct: number | null;
  cloud_daylight_avg_pct: number | null;
  temp_noon_f: number | null;
  temp_high_f: number | null;
  temp_low_f: number | null;
  precip_in: number | null;
  pressure_noon_mb: number | null;
  pressure_trend_mb_48h: number | null;
  pressure_trend_label: string | null;
};

type PickSnapshot = {
  slot: string;
  id: string;
  display_name: string;
  gear_mode: string;
  family_group: string;
  presentation_group: string;
  column: string;
  primary_pace: string;
  secondary_pace?: string;
  is_surface: boolean;
  score: number;
  score_reasons: readonly string[];
  why_chosen: string;
  how_to_fish: string;
};

type ScoreSnapshot = {
  id: string;
  display_name: string;
  family_group: string;
  presentation_group: string;
  column: string;
  primary_pace: string;
  secondary_pace?: string;
  is_surface: boolean;
  score: number;
  score_reasons: readonly string[];
};

type Flag = {
  category: FlagCategory;
  code: string;
  message: string;
  side?: Side;
  slot?: string;
};

type GuideVerdict =
  | "strong_fit"
  | "acceptable_fit"
  | "watch"
  | "likely_miss";

type GuideReason =
  | "species_valid"
  | "seasonal_row_valid"
  | "water_type_valid"
  | "column_pace_valid"
  | "surface_gate_ok"
  | "surface_window_strength"
  | "goal_fit"
  | "condition_fit"
  | "clarity_fit"
  | "risk_balance"
  | "close_better_alternative_available"
  | "set_b_second_opinion_role";

type GuideAlternative = {
  id: string;
  display_name: string;
  score: number;
  score_gap: number;
  score_reasons: readonly string[];
};

type PickGuideVerdict = {
  slot: string;
  side: Side;
  id: string;
  display_name: string;
  verdict: GuideVerdict;
  reasons: GuideReason[];
  notes: string[];
  close_better_alternative: GuideAlternative | null;
};

type SideGuideVerdict = {
  side: Side;
  verdict: GuideVerdict;
  reasons: GuideReason[];
  notes: string[];
  close_better_alternative: GuideAlternative | null;
};

type RowGuideVerdict = {
  verdict: GuideVerdict;
  reasons: GuideReason[];
  notes: string[];
  side_verdicts: SideGuideVerdict[];
  pick_verdicts: PickGuideVerdict[];
};

type AuditRow = {
  scenario_id: string;
  weather_scenario_id: string;
  fishery_label: string;
  latitude: number;
  longitude: number;
  state: string;
  expected_region_key: RegionKey;
  region_key: RegionKey;
  date: string;
  month: number;
  timezone: string;
  water_type: EngineContext;
  water_clarity: WaterClarity;
  recommendation_goal: Goal;
  set: DailyPicksVariant;
  intended_buckets: readonly string[];
  condition_buckets: readonly string[];
  archive_weather_summary: ArchiveWeatherSummary;
  daily_scenario_summary: {
    hows_score: number;
    activity: string;
    surface_gate: string;
    surface_reasons: readonly string[];
    condition_tags: readonly ConditionTag[];
    light_mode: string;
    wind_mode: string;
    thermal_mode: string;
    water_movement_mode: string;
    pressure_mode: string;
    confidence: string;
    missing_inputs: readonly string[];
  };
  seasonal_row_summary: {
    column_range: readonly string[];
    pace_range: readonly string[];
    column_baseline: string;
    pace_baseline: string;
    forage: {
      primary: string;
      secondary?: string;
    };
    surface_seasonally_possible: boolean;
    row_authored_lure_count: number;
    row_authored_fly_count: number;
  };
  selected_picks: PickSnapshot[];
  top_lure_candidates: ScoreSnapshot[];
  top_fly_candidates: ScoreSnapshot[];
  all_lure_candidates: ScoreSnapshot[];
  all_fly_candidates: ScoreSnapshot[];
  finalist_pool_diagnostics:
    DailyPicksEngineResult["diagnostics"]["finalist_pools"];
  flags: Flag[];
  guide_verdict?: RowGuideVerdict;
};

type SkippedWeatherScenario = {
  id: string;
  fishery_label: string;
  date: string;
  water_type: EngineContext;
  reason: string;
};

const WATER_CLARITIES: readonly WaterClarity[] = ["clear", "stained", "dirty"];
const GOALS: readonly Goal[] = ["all_purpose", "big_fish"];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const FISHERIES: readonly Fishery[] = [
  {
    key: "fl_okeechobee",
    label: "Lake Okeechobee / central FL bass lake",
    state: "FL",
    region_key: "florida",
    latitude: 26.94,
    longitude: -80.81,
    timezone: "America/New_York",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "tx_sam_rayburn",
    label: "Sam Rayburn Reservoir",
    state: "TX",
    region_key: "south_central",
    latitude: 31.06,
    longitude: -94.09,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "tx_lake_fork",
    label: "Lake Fork",
    state: "TX",
    region_key: "south_central",
    latitude: 32.86,
    longitude: -95.58,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "al_guntersville",
    label: "Guntersville / Tennessee River reservoir",
    state: "AL",
    region_key: "south_central",
    latitude: 34.43,
    longitude: -86.33,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "sc_santee_cooper",
    label: "Santee Cooper",
    state: "SC",
    region_key: "southeast_atlantic",
    latitude: 33.45,
    longitude: -80.27,
    timezone: "America/New_York",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "nc_jordan_lake",
    label: "Jordan Lake / Piedmont reservoir",
    state: "NC",
    region_key: "southeast_atlantic",
    latitude: 35.73,
    longitude: -79.02,
    timezone: "America/New_York",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "mo_lake_ozarks",
    label: "Lake of the Ozarks",
    state: "MO",
    region_key: "midwest_interior",
    latitude: 38.14,
    longitude: -92.82,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "mn_minnetonka",
    label: "Minnesota natural bass lake",
    state: "MN",
    region_key: "great_lakes_upper_midwest",
    latitude: 44.94,
    longitude: -93.56,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "il_fox_chain",
    label: "Illinois / Indiana natural-lake example",
    state: "IL",
    region_key: "great_lakes_upper_midwest",
    latitude: 42.40,
    longitude: -88.16,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "vt_champlain",
    label: "Lake Champlain",
    state: "VT",
    region_key: "northeast",
    latitude: 44.55,
    longitude: -73.35,
    timezone: "America/New_York",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "wv_stonewall",
    label: "WV/VA highland reservoir",
    state: "WV",
    region_key: "appalachian",
    latitude: 39.00,
    longitude: -80.42,
    timezone: "America/New_York",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "wv_new_river",
    label: "Appalachian river LMB context",
    state: "WV",
    region_key: "appalachian",
    latitude: 37.84,
    longitude: -80.98,
    timezone: "America/New_York",
    water_types: ["freshwater_river"],
  },
  {
    key: "co_pueblo",
    label: "Colorado mountain-west reservoir",
    state: "CO",
    region_key: "mountain_west",
    latitude: 38.27,
    longitude: -104.73,
    timezone: "America/Denver",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "ca_clear_lake",
    label: "Northern California bass lake",
    state: "CA",
    region_key: "northern_california",
    latitude: 39.01,
    longitude: -122.81,
    timezone: "America/Los_Angeles",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "ca_castaic",
    label: "Southern California reservoir",
    state: "CA",
    region_key: "southern_california",
    latitude: 34.52,
    longitude: -118.61,
    timezone: "America/Los_Angeles",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "az_havasu",
    label: "Southwest desert bass reservoir",
    state: "AZ",
    region_key: "southwest_desert",
    latitude: 34.45,
    longitude: -114.37,
    timezone: "America/Phoenix",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "nm_elephant_butte",
    label: "Southwest high-desert reservoir",
    state: "NM",
    region_key: "southwest_high_desert",
    latitude: 33.20,
    longitude: -107.20,
    timezone: "America/Denver",
    water_types: ["freshwater_lake_pond"],
  },
] as const;

const WEATHER_PLAN: readonly WeatherPlan[] = [
  {
    fishery_key: "fl_okeechobee",
    date: "2025-01-16",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
  {
    fishery_key: "fl_okeechobee",
    date: "2025-03-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: [
      "calm_low_light_surface",
      "warming_search",
      "adjacent_pair_similar",
    ],
  },
  {
    fishery_key: "fl_okeechobee",
    date: "2025-03-19",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["wind_reaction", "adjacent_pair_similar"],
  },
  {
    fishery_key: "fl_okeechobee",
    date: "2025-06-20",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse", "surface_opportunity"],
  },
  {
    fishery_key: "fl_okeechobee",
    date: "2025-08-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse", "dirty_vibration"],
  },
  {
    fishery_key: "fl_okeechobee",
    date: "2025-12-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity"],
  },

  {
    fishery_key: "tx_sam_rayburn",
    date: "2025-02-11",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
  {
    fishery_key: "tx_sam_rayburn",
    date: "2025-03-28",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["warming_search"],
  },
  {
    fishery_key: "tx_sam_rayburn",
    date: "2025-04-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["wind_reaction", "dirty_vibration"],
  },
  {
    fishery_key: "tx_sam_rayburn",
    date: "2025-05-10",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "tx_sam_rayburn",
    date: "2025-07-24",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse"],
  },

  {
    fishery_key: "tx_lake_fork",
    date: "2025-03-29",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["warming_search", "big_fish"],
  },
  {
    fishery_key: "tx_lake_fork",
    date: "2025-04-30",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["calm_bright_clear_subtle"],
  },
  {
    fishery_key: "tx_lake_fork",
    date: "2025-06-15",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["surface_opportunity", "heat_finesse"],
  },
  {
    fishery_key: "tx_lake_fork",
    date: "2025-09-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },

  {
    fishery_key: "al_guntersville",
    date: "2025-03-08",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_front_like"],
  },
  {
    fishery_key: "al_guntersville",
    date: "2025-04-11",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["wind_reaction"],
  },
  {
    fishery_key: "al_guntersville",
    date: "2025-06-07",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["grass_surface"],
  },
  {
    fishery_key: "al_guntersville",
    date: "2025-10-19",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction", "adjacent_pair_change"],
  },
  {
    fishery_key: "al_guntersville",
    date: "2025-10-20",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction", "adjacent_pair_change"],
  },

  {
    fishery_key: "sc_santee_cooper",
    date: "2025-04-05",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["dirty_vibration"],
  },
  {
    fishery_key: "sc_santee_cooper",
    date: "2025-05-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "sc_santee_cooper",
    date: "2025-07-28",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse"],
  },
  {
    fishery_key: "sc_santee_cooper",
    date: "2025-09-27",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["wind_reaction"],
  },

  {
    fishery_key: "nc_jordan_lake",
    date: "2025-03-22",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["warming_search"],
  },
  {
    fishery_key: "nc_jordan_lake",
    date: "2025-05-08",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["calm_low_light_surface"],
  },
  {
    fishery_key: "nc_jordan_lake",
    date: "2025-08-11",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse"],
  },
  {
    fishery_key: "nc_jordan_lake",
    date: "2025-10-04",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },

  {
    fishery_key: "mo_lake_ozarks",
    date: "2025-02-20",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity"],
  },
  {
    fishery_key: "mo_lake_ozarks",
    date: "2025-04-24",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["wind_reaction"],
  },
  {
    fishery_key: "mo_lake_ozarks",
    date: "2025-06-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "mo_lake_ozarks",
    date: "2025-09-13",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },
  {
    fishery_key: "mo_lake_ozarks",
    date: "2025-11-11",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["late_fall"],
  },

  {
    fishery_key: "mn_minnetonka",
    date: "2025-03-20",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
  {
    fishery_key: "mn_minnetonka",
    date: "2025-05-15",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["clear_subtle"],
  },
  {
    fishery_key: "mn_minnetonka",
    date: "2025-07-16",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["calm_bright_clear_subtle", "heat_finesse"],
  },
  {
    fishery_key: "mn_minnetonka",
    date: "2025-09-20",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["low_light_surface", "adjacent_pair_similar"],
  },
  {
    fishery_key: "mn_minnetonka",
    date: "2025-09-21",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["adjacent_pair_similar"],
  },

  {
    fishery_key: "il_fox_chain",
    date: "2025-04-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_slow"],
  },
  {
    fishery_key: "il_fox_chain",
    date: "2025-06-14",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["dirty_vibration", "wind_reaction"],
  },
  {
    fishery_key: "il_fox_chain",
    date: "2025-08-02",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse"],
  },
  {
    fishery_key: "il_fox_chain",
    date: "2025-10-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },

  {
    fishery_key: "vt_champlain",
    date: "2025-04-27",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_slow", "clear_subtle"],
  },
  {
    fishery_key: "vt_champlain",
    date: "2025-06-21",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "vt_champlain",
    date: "2025-08-14",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["clear_subtle"],
  },
  {
    fishery_key: "vt_champlain",
    date: "2025-10-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_front_like", "fall_reaction"],
  },

  {
    fishery_key: "wv_stonewall",
    date: "2025-03-26",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["warming_search"],
  },
  {
    fishery_key: "wv_stonewall",
    date: "2025-05-19",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "wv_stonewall",
    date: "2025-07-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse"],
  },
  {
    fishery_key: "wv_stonewall",
    date: "2025-11-08",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["late_fall"],
  },

  {
    fishery_key: "wv_new_river",
    date: "2025-04-04",
    water_type: "freshwater_river",
    intended_buckets: ["river_elevated_current"],
  },
  {
    fishery_key: "wv_new_river",
    date: "2025-05-06",
    water_type: "freshwater_river",
    intended_buckets: ["current_swing"],
  },
  {
    fishery_key: "wv_new_river",
    date: "2025-06-17",
    water_type: "freshwater_river",
    intended_buckets: ["dirty_vibration", "river_elevated_current"],
  },
  {
    fishery_key: "wv_new_river",
    date: "2025-09-29",
    water_type: "freshwater_river",
    intended_buckets: ["fall_current"],
  },

  {
    fishery_key: "co_pueblo",
    date: "2025-04-23",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_slow"],
  },
  {
    fishery_key: "co_pueblo",
    date: "2025-06-22",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "co_pueblo",
    date: "2025-08-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["calm_low_light_surface"],
  },
  {
    fishery_key: "co_pueblo",
    date: "2025-10-05",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },

  {
    fishery_key: "ca_clear_lake",
    date: "2025-03-30",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["warming_search"],
  },
  {
    fishery_key: "ca_clear_lake",
    date: "2025-05-23",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["surface_opportunity"],
  },
  {
    fishery_key: "ca_clear_lake",
    date: "2025-08-16",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse"],
  },
  {
    fishery_key: "ca_clear_lake",
    date: "2025-10-25",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },

  {
    fishery_key: "ca_castaic",
    date: "2025-02-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity"],
  },
  {
    fishery_key: "ca_castaic",
    date: "2025-04-21",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["clear_subtle"],
  },
  {
    fishery_key: "ca_castaic",
    date: "2025-07-19",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse", "calm_bright_clear_subtle"],
  },
  {
    fishery_key: "ca_castaic",
    date: "2025-09-15",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },

  {
    fishery_key: "az_havasu",
    date: "2025-03-25",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["warming_search"],
  },
  {
    fishery_key: "az_havasu",
    date: "2025-06-28",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse"],
  },
  {
    fishery_key: "az_havasu",
    date: "2025-08-21",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_limited"],
  },
  {
    fishery_key: "az_havasu",
    date: "2025-11-15",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["late_fall"],
  },

  {
    fishery_key: "nm_elephant_butte",
    date: "2025-04-17",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["wind_reaction"],
  },
  {
    fishery_key: "nm_elephant_butte",
    date: "2025-06-25",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse"],
  },
  {
    fishery_key: "nm_elephant_butte",
    date: "2025-08-23",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_limited"],
  },
  {
    fishery_key: "nm_elephant_butte",
    date: "2025-10-14",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },
] as const;

const SMB_FISHERIES: readonly Fishery[] = [
  {
    key: "wi_door_county",
    label: "Door County / Green Bay smallmouth lake",
    state: "WI",
    region_key: "great_lakes_upper_midwest",
    latitude: 44.83,
    longitude: -87.37,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "mn_mille_lacs",
    label: "Mille Lacs / Upper Midwest natural lake",
    state: "MN",
    region_key: "great_lakes_upper_midwest",
    latitude: 46.20,
    longitude: -93.78,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "vt_champlain_smb",
    label: "Lake Champlain SMB water",
    state: "VT",
    region_key: "northeast",
    latitude: 44.55,
    longitude: -73.35,
    timezone: "America/New_York",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "tn_dale_hollow",
    label: "Dale Hollow / Tennessee highland reservoir",
    state: "TN",
    region_key: "south_central",
    latitude: 36.55,
    longitude: -85.45,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "mo_table_rock",
    label: "Table Rock / Ozark clear reservoir",
    state: "MO",
    region_key: "south_central",
    latitude: 36.58,
    longitude: -93.30,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "mo_current_river",
    label: "Ozark Current River smallmouth context",
    state: "MO",
    region_key: "south_central",
    latitude: 37.18,
    longitude: -91.18,
    timezone: "America/Chicago",
    water_types: ["freshwater_river"],
  },
  {
    key: "wv_new_river_smb",
    label: "New River Appalachian SMB context",
    state: "WV",
    region_key: "appalachian",
    latitude: 37.84,
    longitude: -80.98,
    timezone: "America/New_York",
    water_types: ["freshwater_river"],
  },
  {
    key: "wi_upper_mississippi",
    label: "Upper Mississippi smallmouth river",
    state: "WI",
    region_key: "great_lakes_upper_midwest",
    latitude: 43.82,
    longitude: -91.25,
    timezone: "America/Chicago",
    water_types: ["freshwater_river"],
  },
  {
    key: "co_pueblo_smb",
    label: "Colorado mountain-west SMB reservoir",
    state: "CO",
    region_key: "mountain_west",
    latitude: 38.27,
    longitude: -104.73,
    timezone: "America/Denver",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "co_yampa",
    label: "Yampa River mountain-west SMB context",
    state: "CO",
    region_key: "mountain_west",
    latitude: 40.49,
    longitude: -107.25,
    timezone: "America/Denver",
    water_types: ["freshwater_river"],
  },
  {
    key: "ca_trinity",
    label: "Trinity Lake northern California SMB water",
    state: "CA",
    region_key: "northern_california",
    latitude: 40.80,
    longitude: -122.76,
    timezone: "America/Los_Angeles",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "id_dworshak",
    label: "Dworshak / inland northwest SMB reservoir",
    state: "ID",
    region_key: "inland_northwest",
    latitude: 46.60,
    longitude: -116.28,
    timezone: "America/Los_Angeles",
    water_types: ["freshwater_lake_pond"],
  },
] as const;

const SMB_WEATHER_PLAN: readonly WeatherPlan[] = [
  {
    fishery_key: "vt_champlain_smb",
    date: "2025-01-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
  {
    fishery_key: "wi_upper_mississippi",
    date: "2025-01-26",
    water_type: "freshwater_river",
    intended_buckets: ["winter_sanity", "cold_slow", "river_current"],
  },
  {
    fishery_key: "tn_dale_hollow",
    date: "2025-02-15",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
  {
    fishery_key: "mo_table_rock",
    date: "2025-02-20",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity"],
  },
  {
    fishery_key: "mn_mille_lacs",
    date: "2025-03-20",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_slow", "warming_search"],
  },
  {
    fishery_key: "wv_new_river_smb",
    date: "2025-03-26",
    water_type: "freshwater_river",
    intended_buckets: ["warming_search", "river_current"],
  },
  {
    fishery_key: "tn_dale_hollow",
    date: "2025-03-28",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["warming_search"],
  },
  {
    fishery_key: "ca_trinity",
    date: "2025-03-30",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["warming_search"],
  },
  {
    fishery_key: "wv_new_river_smb",
    date: "2025-04-04",
    water_type: "freshwater_river",
    intended_buckets: ["river_elevated_current"],
  },
  {
    fishery_key: "mo_current_river",
    date: "2025-04-05",
    water_type: "freshwater_river",
    intended_buckets: ["dirty_vibration", "river_current"],
  },
  {
    fishery_key: "wi_door_county",
    date: "2025-04-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_slow", "clear_subtle"],
  },
  {
    fishery_key: "co_pueblo_smb",
    date: "2025-04-23",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_slow"],
  },
  {
    fishery_key: "mo_table_rock",
    date: "2025-04-24",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["wind_reaction", "clear_subtle"],
  },
  {
    fishery_key: "vt_champlain_smb",
    date: "2025-04-27",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_slow", "clear_subtle"],
  },
  {
    fishery_key: "mo_current_river",
    date: "2025-05-06",
    water_type: "freshwater_river",
    intended_buckets: ["current_swing", "warming_search"],
  },
  {
    fishery_key: "wv_new_river_smb",
    date: "2025-05-06",
    water_type: "freshwater_river",
    intended_buckets: ["current_swing"],
  },
  {
    fishery_key: "tn_dale_hollow",
    date: "2025-05-10",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "mn_mille_lacs",
    date: "2025-05-15",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["clear_subtle"],
  },
  {
    fishery_key: "co_yampa",
    date: "2025-05-19",
    water_type: "freshwater_river",
    intended_buckets: ["river_current", "warming_search"],
  },
  {
    fishery_key: "ca_trinity",
    date: "2025-05-23",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["surface_opportunity"],
  },
  {
    fishery_key: "wi_door_county",
    date: "2025-05-23",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "tn_dale_hollow",
    date: "2025-06-07",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["calm_low_light_surface"],
  },
  {
    fishery_key: "mo_current_river",
    date: "2025-06-14",
    water_type: "freshwater_river",
    intended_buckets: ["dirty_vibration", "river_current"],
  },
  {
    fishery_key: "wv_new_river_smb",
    date: "2025-06-17",
    water_type: "freshwater_river",
    intended_buckets: ["dirty_vibration", "river_elevated_current"],
  },
  {
    fishery_key: "mo_table_rock",
    date: "2025-06-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "vt_champlain_smb",
    date: "2025-06-21",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "wi_door_county",
    date: "2025-06-21",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["clear_subtle", "stable_pleasant"],
  },
  {
    fishery_key: "co_pueblo_smb",
    date: "2025-06-22",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse", "stable_pleasant"],
  },
  {
    fishery_key: "id_dworshak",
    date: "2025-06-25",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse"],
  },
  {
    fishery_key: "mn_mille_lacs",
    date: "2025-07-16",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["calm_bright_clear_subtle", "heat_finesse"],
  },
  {
    fishery_key: "ca_trinity",
    date: "2025-07-19",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse", "calm_bright_clear_subtle"],
  },
  {
    fishery_key: "co_yampa",
    date: "2025-07-12",
    water_type: "freshwater_river",
    intended_buckets: ["heat_finesse", "river_current"],
  },
  {
    fishery_key: "wi_door_county",
    date: "2025-08-16",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse", "clear_subtle"],
  },
  {
    fishery_key: "vt_champlain_smb",
    date: "2025-08-14",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["clear_subtle"],
  },
  {
    fishery_key: "id_dworshak",
    date: "2025-08-21",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_limited"],
  },
  {
    fishery_key: "co_pueblo_smb",
    date: "2025-08-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["calm_low_light_surface"],
  },
  {
    fishery_key: "mn_mille_lacs",
    date: "2025-09-20",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["low_light_surface", "adjacent_pair_similar"],
  },
  {
    fishery_key: "mn_mille_lacs",
    date: "2025-09-21",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["adjacent_pair_similar"],
  },
  {
    fishery_key: "mo_table_rock",
    date: "2025-09-13",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },
  {
    fishery_key: "wi_upper_mississippi",
    date: "2025-09-29",
    water_type: "freshwater_river",
    intended_buckets: ["fall_current"],
  },
  {
    fishery_key: "wv_new_river_smb",
    date: "2025-09-29",
    water_type: "freshwater_river",
    intended_buckets: ["fall_current"],
  },
  {
    fishery_key: "tn_dale_hollow",
    date: "2025-09-27",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["wind_reaction"],
  },
  {
    fishery_key: "vt_champlain_smb",
    date: "2025-10-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_front_like", "fall_reaction"],
  },
  {
    fishery_key: "mo_table_rock",
    date: "2025-10-19",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction", "adjacent_pair_change"],
  },
  {
    fishery_key: "mo_table_rock",
    date: "2025-10-20",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction", "adjacent_pair_change"],
  },
  {
    fishery_key: "ca_trinity",
    date: "2025-10-25",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },
  {
    fishery_key: "co_pueblo_smb",
    date: "2025-10-05",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },
  {
    fishery_key: "tn_dale_hollow",
    date: "2025-11-08",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["late_fall"],
  },
  {
    fishery_key: "id_dworshak",
    date: "2025-11-15",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["late_fall"],
  },
  {
    fishery_key: "wi_door_county",
    date: "2025-12-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity"],
  },
  {
    fishery_key: "vt_champlain_smb",
    date: "2025-12-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity"],
  },
] as const;

const PIKE_FISHERIES: readonly Fishery[] = [
  {
    key: "mn_lake_of_woods_pike",
    label: "Lake of the Woods pike water",
    state: "MN",
    region_key: "great_lakes_upper_midwest",
    latitude: 48.74,
    longitude: -94.69,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "mn_mille_lacs_pike",
    label: "Mille Lacs / Upper Midwest pike lake",
    state: "MN",
    region_key: "great_lakes_upper_midwest",
    latitude: 46.20,
    longitude: -93.78,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "wi_green_bay_pike",
    label: "Green Bay / Door County pike water",
    state: "WI",
    region_key: "great_lakes_upper_midwest",
    latitude: 44.83,
    longitude: -87.37,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "vt_champlain_pike",
    label: "Lake Champlain pike water",
    state: "VT",
    region_key: "northeast",
    latitude: 44.55,
    longitude: -73.35,
    timezone: "America/New_York",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "ny_st_lawrence_pike",
    label: "St. Lawrence River pike backwater",
    state: "NY",
    region_key: "northeast",
    latitude: 44.33,
    longitude: -75.98,
    timezone: "America/New_York",
    water_types: ["freshwater_river"],
  },
  {
    key: "me_belgrade_pike",
    label: "Maine Belgrade Lakes pike water",
    state: "ME",
    region_key: "northeast",
    latitude: 44.53,
    longitude: -69.84,
    timezone: "America/New_York",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "nd_devils_lake_pike",
    label: "Devils Lake prairie pike water",
    state: "ND",
    region_key: "midwest_interior",
    latitude: 48.10,
    longitude: -98.89,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "sd_oahe_pike",
    label: "Lake Oahe prairie reservoir pike water",
    state: "SD",
    region_key: "midwest_interior",
    latitude: 44.45,
    longitude: -100.39,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "nd_missouri_backwater_pike",
    label: "Missouri River backwater pike context",
    state: "ND",
    region_key: "midwest_interior",
    latitude: 47.50,
    longitude: -101.30,
    timezone: "America/Chicago",
    water_types: ["freshwater_river"],
  },
  {
    key: "ne_merritt_pike",
    label: "Nebraska Sandhills pike reservoir",
    state: "NE",
    region_key: "midwest_interior",
    latitude: 42.63,
    longitude: -100.88,
    timezone: "America/Chicago",
    water_types: ["freshwater_lake_pond"],
  },
  {
    key: "mt_fort_peck_pike",
    label: "Fort Peck prairie pike reservoir",
    state: "MT",
    region_key: "midwest_interior",
    latitude: 47.99,
    longitude: -106.45,
    timezone: "America/Denver",
    water_types: ["freshwater_lake_pond"],
  },
] as const;

const PIKE_WEATHER_PLAN: readonly WeatherPlan[] = [
  {
    fishery_key: "mn_lake_of_woods_pike",
    date: "2025-01-16",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
  {
    fishery_key: "vt_champlain_pike",
    date: "2025-01-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
  {
    fishery_key: "nd_devils_lake_pike",
    date: "2025-01-26",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
  {
    fishery_key: "wi_green_bay_pike",
    date: "2025-02-11",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
  {
    fishery_key: "sd_oahe_pike",
    date: "2025-02-15",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
  {
    fishery_key: "me_belgrade_pike",
    date: "2025-02-20",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity"],
  },
  {
    fishery_key: "nd_devils_lake_pike",
    date: "2025-03-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["warming_search", "cold_slow"],
  },
  {
    fishery_key: "mn_mille_lacs_pike",
    date: "2025-03-20",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_slow", "warming_search"],
  },
  {
    fishery_key: "mt_fort_peck_pike",
    date: "2025-03-25",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["warming_search"],
  },
  {
    fishery_key: "nd_missouri_backwater_pike",
    date: "2025-03-26",
    water_type: "freshwater_river",
    intended_buckets: ["warming_search", "river_current"],
  },
  {
    fishery_key: "wi_green_bay_pike",
    date: "2025-03-28",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["warming_search"],
  },
  {
    fishery_key: "me_belgrade_pike",
    date: "2025-03-30",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["clear_subtle", "warming_search"],
  },
  {
    fishery_key: "vt_champlain_pike",
    date: "2025-03-26",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["warming_search"],
  },
  {
    fishery_key: "ny_st_lawrence_pike",
    date: "2025-04-04",
    water_type: "freshwater_river",
    intended_buckets: ["river_elevated_current", "cold_slow"],
  },
  {
    fishery_key: "nd_missouri_backwater_pike",
    date: "2025-04-05",
    water_type: "freshwater_river",
    intended_buckets: ["dirty_vibration", "river_current"],
  },
  {
    fishery_key: "sd_oahe_pike",
    date: "2025-04-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["wind_reaction", "dirty_vibration"],
  },
  {
    fishery_key: "ne_merritt_pike",
    date: "2025-04-17",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["wind_reaction"],
  },
  {
    fishery_key: "wi_green_bay_pike",
    date: "2025-04-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_slow", "clear_subtle"],
  },
  {
    fishery_key: "mn_lake_of_woods_pike",
    date: "2025-04-24",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["wind_reaction"],
  },
  {
    fishery_key: "vt_champlain_pike",
    date: "2025-04-27",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_slow", "clear_subtle"],
  },
  {
    fishery_key: "me_belgrade_pike",
    date: "2025-04-30",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["clear_subtle"],
  },
  {
    fishery_key: "ny_st_lawrence_pike",
    date: "2025-05-06",
    water_type: "freshwater_river",
    intended_buckets: ["current_swing", "warming_search"],
  },
  {
    fishery_key: "me_belgrade_pike",
    date: "2025-05-08",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["low_light_surface"],
  },
  {
    fishery_key: "nd_devils_lake_pike",
    date: "2025-05-10",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "mn_mille_lacs_pike",
    date: "2025-05-15",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["clear_subtle"],
  },
  {
    fishery_key: "sd_oahe_pike",
    date: "2025-05-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "mt_fort_peck_pike",
    date: "2025-05-19",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["warming_search"],
  },
  {
    fishery_key: "wi_green_bay_pike",
    date: "2025-05-23",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "vt_champlain_pike",
    date: "2025-05-23",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "me_belgrade_pike",
    date: "2025-06-07",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["low_light_surface", "surface_opportunity"],
  },
  {
    fishery_key: "nd_devils_lake_pike",
    date: "2025-06-14",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["dirty_vibration", "wind_reaction"],
  },
  {
    fishery_key: "ny_st_lawrence_pike",
    date: "2025-06-17",
    water_type: "freshwater_river",
    intended_buckets: ["dirty_vibration", "river_elevated_current"],
  },
  {
    fishery_key: "sd_oahe_pike",
    date: "2025-06-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "mn_lake_of_woods_pike",
    date: "2025-06-21",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant", "surface_opportunity"],
  },
  {
    fishery_key: "wi_green_bay_pike",
    date: "2025-06-21",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["clear_subtle", "stable_pleasant"],
  },
  {
    fishery_key: "vt_champlain_pike",
    date: "2025-06-21",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["stable_pleasant"],
  },
  {
    fishery_key: "ny_st_lawrence_pike",
    date: "2025-07-12",
    water_type: "freshwater_river",
    intended_buckets: ["heat_finesse", "river_current"],
  },
  {
    fishery_key: "mn_mille_lacs_pike",
    date: "2025-07-16",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["clear_subtle", "heat_finesse"],
  },
  {
    fishery_key: "sd_oahe_pike",
    date: "2025-07-19",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse", "clear_subtle"],
  },
  {
    fishery_key: "wi_green_bay_pike",
    date: "2025-07-24",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse"],
  },
  {
    fishery_key: "vt_champlain_pike",
    date: "2025-07-28",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse"],
  },
  {
    fishery_key: "nd_devils_lake_pike",
    date: "2025-07-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse"],
  },
  {
    fishery_key: "me_belgrade_pike",
    date: "2025-08-02",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse", "surface_opportunity"],
  },
  {
    fishery_key: "vt_champlain_pike",
    date: "2025-08-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["surface_opportunity"],
  },
  {
    fishery_key: "mn_lake_of_woods_pike",
    date: "2025-08-14",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["clear_subtle"],
  },
  {
    fishery_key: "wi_green_bay_pike",
    date: "2025-08-16",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_finesse", "clear_subtle"],
  },
  {
    fishery_key: "nd_devils_lake_pike",
    date: "2025-08-21",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_limited"],
  },
  {
    fishery_key: "sd_oahe_pike",
    date: "2025-08-23",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["heat_limited"],
  },
  {
    fishery_key: "sd_oahe_pike",
    date: "2025-09-18",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },
  {
    fishery_key: "mn_mille_lacs_pike",
    date: "2025-09-20",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["low_light_surface", "adjacent_pair_similar"],
  },
  {
    fishery_key: "mn_mille_lacs_pike",
    date: "2025-09-21",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["adjacent_pair_similar"],
  },
  {
    fishery_key: "wi_green_bay_pike",
    date: "2025-09-13",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },
  {
    fishery_key: "me_belgrade_pike",
    date: "2025-09-15",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },
  {
    fishery_key: "vt_champlain_pike",
    date: "2025-09-27",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["wind_reaction", "fall_reaction"],
  },
  {
    fishery_key: "nd_missouri_backwater_pike",
    date: "2025-09-29",
    water_type: "freshwater_river",
    intended_buckets: ["fall_current", "river_current"],
  },
  {
    fishery_key: "ny_st_lawrence_pike",
    date: "2025-10-04",
    water_type: "freshwater_river",
    intended_buckets: ["fall_current", "river_current"],
  },
  {
    fishery_key: "mn_lake_of_woods_pike",
    date: "2025-10-05",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },
  {
    fishery_key: "vt_champlain_pike",
    date: "2025-10-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["cold_front_like", "fall_reaction"],
  },
  {
    fishery_key: "nd_devils_lake_pike",
    date: "2025-10-14",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },
  {
    fishery_key: "wi_green_bay_pike",
    date: "2025-10-19",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction", "adjacent_pair_change"],
  },
  {
    fishery_key: "wi_green_bay_pike",
    date: "2025-10-20",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction", "adjacent_pair_change"],
  },
  {
    fishery_key: "me_belgrade_pike",
    date: "2025-10-25",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["fall_reaction"],
  },
  {
    fishery_key: "vt_champlain_pike",
    date: "2025-11-08",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["late_fall"],
  },
  {
    fishery_key: "mn_mille_lacs_pike",
    date: "2025-11-08",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["late_fall"],
  },
  {
    fishery_key: "sd_oahe_pike",
    date: "2025-11-11",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["late_fall"],
  },
  {
    fishery_key: "ny_st_lawrence_pike",
    date: "2025-11-11",
    water_type: "freshwater_river",
    intended_buckets: ["late_fall", "river_current"],
  },
  {
    fishery_key: "nd_devils_lake_pike",
    date: "2025-11-15",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["late_fall"],
  },
  {
    fishery_key: "mn_lake_of_woods_pike",
    date: "2025-12-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
  {
    fishery_key: "vt_champlain_pike",
    date: "2025-12-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity"],
  },
  {
    fishery_key: "nd_devils_lake_pike",
    date: "2025-12-12",
    water_type: "freshwater_lake_pond",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
] as const;

const TROUT_FISHERIES: readonly Fishery[] = [
  {
    key: "ny_upper_delaware_trout",
    label: "Upper Delaware trout river",
    state: "NY",
    region_key: "northeast",
    latitude: 41.93,
    longitude: -75.28,
    timezone: "America/New_York",
    water_types: ["freshwater_river"],
  },
  {
    key: "wv_elk_river_trout",
    label: "Elk River Appalachian trout water",
    state: "WV",
    region_key: "appalachian",
    latitude: 38.41,
    longitude: -80.55,
    timezone: "America/New_York",
    water_types: ["freshwater_river"],
  },
  {
    key: "mi_au_sable_trout",
    label: "Au Sable / Upper Midwest trout river",
    state: "MI",
    region_key: "great_lakes_upper_midwest",
    latitude: 44.66,
    longitude: -84.71,
    timezone: "America/Detroit",
    water_types: ["freshwater_river"],
  },
  {
    key: "mt_madison_trout",
    label: "Madison River mountain-west trout water",
    state: "MT",
    region_key: "mountain_west",
    latitude: 44.84,
    longitude: -111.63,
    timezone: "America/Denver",
    water_types: ["freshwater_river"],
  },
  {
    key: "wa_skagit_trout",
    label: "Skagit River Pacific Northwest trout water",
    state: "WA",
    region_key: "pacific_northwest",
    latitude: 48.52,
    longitude: -121.77,
    timezone: "America/Los_Angeles",
    water_types: ["freshwater_river"],
  },
  {
    key: "ca_lower_sac_trout",
    label: "Lower Sacramento northern California trout tailwater",
    state: "CA",
    region_key: "northern_california",
    latitude: 40.58,
    longitude: -122.38,
    timezone: "America/Los_Angeles",
    water_types: ["freshwater_river"],
  },
  {
    key: "ar_white_river_trout",
    label: "White River Ozark trout tailwater",
    state: "AR",
    region_key: "south_central",
    latitude: 36.31,
    longitude: -92.54,
    timezone: "America/Chicago",
    water_types: ["freshwater_river"],
  },
] as const;

const TROUT_WEATHER_PLAN: readonly WeatherPlan[] = [
  {
    fishery_key: "ar_white_river_trout",
    date: "2025-01-16",
    water_type: "freshwater_river",
    intended_buckets: ["winter_sanity", "cold_slow", "current_swing"],
  },
  {
    fishery_key: "ny_upper_delaware_trout",
    date: "2025-01-18",
    water_type: "freshwater_river",
    intended_buckets: ["winter_sanity", "cold_slow", "clear_subtle"],
  },
  {
    fishery_key: "mi_au_sable_trout",
    date: "2025-02-11",
    water_type: "freshwater_river",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
  {
    fishery_key: "wv_elk_river_trout",
    date: "2025-02-20",
    water_type: "freshwater_river",
    intended_buckets: ["winter_sanity", "cold_slow", "current_swing"],
  },
  {
    fishery_key: "ar_white_river_trout",
    date: "2025-03-18",
    water_type: "freshwater_river",
    intended_buckets: ["warming_search", "current_swing"],
  },
  {
    fishery_key: "wv_elk_river_trout",
    date: "2025-03-26",
    water_type: "freshwater_river",
    intended_buckets: ["warming_search", "river_elevated_current"],
  },
  {
    fishery_key: "ny_upper_delaware_trout",
    date: "2025-03-30",
    water_type: "freshwater_river",
    intended_buckets: ["clear_subtle", "warming_search"],
  },
  {
    fishery_key: "mi_au_sable_trout",
    date: "2025-03-28",
    water_type: "freshwater_river",
    intended_buckets: ["warming_search", "cold_slow"],
  },
  {
    fishery_key: "wv_elk_river_trout",
    date: "2025-04-04",
    water_type: "freshwater_river",
    intended_buckets: ["runoff_streamer", "river_elevated_current"],
  },
  {
    fishery_key: "ar_white_river_trout",
    date: "2025-04-12",
    water_type: "freshwater_river",
    intended_buckets: ["current_swing", "dirty_vibration"],
  },
  {
    fishery_key: "ny_upper_delaware_trout",
    date: "2025-04-17",
    water_type: "freshwater_river",
    intended_buckets: ["clear_subtle", "cold_slow"],
  },
  {
    fishery_key: "mi_au_sable_trout",
    date: "2025-04-24",
    water_type: "freshwater_river",
    intended_buckets: ["warming_search", "current_swing"],
  },
  {
    fishery_key: "ca_lower_sac_trout",
    date: "2025-04-27",
    water_type: "freshwater_river",
    intended_buckets: ["clear_subtle", "current_swing"],
  },
  {
    fishery_key: "mt_madison_trout",
    date: "2025-05-06",
    water_type: "freshwater_river",
    intended_buckets: ["runoff_streamer", "current_swing"],
  },
  {
    fishery_key: "wa_skagit_trout",
    date: "2025-05-08",
    water_type: "freshwater_river",
    intended_buckets: ["runoff_streamer", "river_elevated_current"],
  },
  {
    fishery_key: "ny_upper_delaware_trout",
    date: "2025-05-15",
    water_type: "freshwater_river",
    intended_buckets: ["clear_subtle", "stable_pleasant"],
  },
  {
    fishery_key: "ar_white_river_trout",
    date: "2025-05-18",
    water_type: "freshwater_river",
    intended_buckets: ["stable_pleasant", "current_swing"],
  },
  {
    fishery_key: "mi_au_sable_trout",
    date: "2025-05-23",
    water_type: "freshwater_river",
    intended_buckets: ["warming_search", "current_swing"],
  },
  {
    fishery_key: "ca_lower_sac_trout",
    date: "2025-05-23",
    water_type: "freshwater_river",
    intended_buckets: ["stable_pleasant", "current_swing"],
  },
  {
    fishery_key: "mt_madison_trout",
    date: "2025-06-07",
    water_type: "freshwater_river",
    intended_buckets: ["runoff_streamer", "current_swing"],
  },
  {
    fishery_key: "wa_skagit_trout",
    date: "2025-06-14",
    water_type: "freshwater_river",
    intended_buckets: ["runoff_streamer", "dirty_vibration"],
  },
  {
    fishery_key: "wv_elk_river_trout",
    date: "2025-06-17",
    water_type: "freshwater_river",
    intended_buckets: ["dirty_vibration", "river_elevated_current"],
  },
  {
    fishery_key: "ny_upper_delaware_trout",
    date: "2025-06-21",
    water_type: "freshwater_river",
    intended_buckets: ["stable_pleasant", "low_light_surface"],
  },
  {
    fishery_key: "ca_lower_sac_trout",
    date: "2025-06-22",
    water_type: "freshwater_river",
    intended_buckets: ["clear_subtle", "current_swing"],
  },
  {
    fishery_key: "ar_white_river_trout",
    date: "2025-06-28",
    water_type: "freshwater_river",
    intended_buckets: ["heat_finesse", "current_swing"],
  },
  {
    fishery_key: "ny_upper_delaware_trout",
    date: "2025-07-12",
    water_type: "freshwater_river",
    intended_buckets: ["low_light_surface", "surface_opportunity"],
  },
  {
    fishery_key: "mi_au_sable_trout",
    date: "2025-07-16",
    water_type: "freshwater_river",
    intended_buckets: ["clear_subtle", "calm_surface"],
  },
  {
    fishery_key: "mt_madison_trout",
    date: "2025-07-19",
    water_type: "freshwater_river",
    intended_buckets: ["low_light_surface", "current_swing"],
  },
  {
    fishery_key: "ca_lower_sac_trout",
    date: "2025-07-24",
    water_type: "freshwater_river",
    intended_buckets: ["heat_finesse", "clear_subtle"],
  },
  {
    fishery_key: "ar_white_river_trout",
    date: "2025-07-28",
    water_type: "freshwater_river",
    intended_buckets: ["heat_limited", "heat_finesse"],
  },
  {
    fishery_key: "wa_skagit_trout",
    date: "2025-08-02",
    water_type: "freshwater_river",
    intended_buckets: ["surface_opportunity", "current_swing"],
  },
  {
    fishery_key: "ny_upper_delaware_trout",
    date: "2025-08-12",
    water_type: "freshwater_river",
    intended_buckets: ["heat_finesse", "clear_subtle"],
  },
  {
    fishery_key: "mi_au_sable_trout",
    date: "2025-08-14",
    water_type: "freshwater_river",
    intended_buckets: ["clear_subtle", "surface_opportunity"],
  },
  {
    fishery_key: "ca_lower_sac_trout",
    date: "2025-08-16",
    water_type: "freshwater_river",
    intended_buckets: ["heat_finesse", "current_swing"],
  },
  {
    fishery_key: "ar_white_river_trout",
    date: "2025-08-21",
    water_type: "freshwater_river",
    intended_buckets: ["heat_limited", "current_swing"],
  },
  {
    fishery_key: "mt_madison_trout",
    date: "2025-08-23",
    water_type: "freshwater_river",
    intended_buckets: ["low_light_surface", "clear_subtle"],
  },
  {
    fishery_key: "ny_upper_delaware_trout",
    date: "2025-09-13",
    water_type: "freshwater_river",
    intended_buckets: ["fall_reaction", "current_swing"],
  },
  {
    fishery_key: "mi_au_sable_trout",
    date: "2025-09-20",
    water_type: "freshwater_river",
    intended_buckets: ["low_light_surface", "adjacent_pair_similar"],
  },
  {
    fishery_key: "mi_au_sable_trout",
    date: "2025-09-21",
    water_type: "freshwater_river",
    intended_buckets: ["adjacent_pair_similar", "current_swing"],
  },
  {
    fishery_key: "mt_madison_trout",
    date: "2025-09-27",
    water_type: "freshwater_river",
    intended_buckets: ["fall_reaction", "current_swing"],
  },
  {
    fishery_key: "wa_skagit_trout",
    date: "2025-09-29",
    water_type: "freshwater_river",
    intended_buckets: ["fall_current", "river_current"],
  },
  {
    fishery_key: "ca_lower_sac_trout",
    date: "2025-09-15",
    water_type: "freshwater_river",
    intended_buckets: ["fall_reaction", "clear_subtle"],
  },
  {
    fishery_key: "ar_white_river_trout",
    date: "2025-09-18",
    water_type: "freshwater_river",
    intended_buckets: ["fall_reaction", "current_swing"],
  },
  {
    fishery_key: "ny_upper_delaware_trout",
    date: "2025-10-04",
    water_type: "freshwater_river",
    intended_buckets: ["fall_current", "clear_subtle"],
  },
  {
    fishery_key: "mt_madison_trout",
    date: "2025-10-05",
    water_type: "freshwater_river",
    intended_buckets: ["fall_reaction", "cold_slow"],
  },
  {
    fishery_key: "wa_skagit_trout",
    date: "2025-10-12",
    water_type: "freshwater_river",
    intended_buckets: ["fall_current", "river_elevated_current"],
  },
  {
    fishery_key: "mi_au_sable_trout",
    date: "2025-10-19",
    water_type: "freshwater_river",
    intended_buckets: ["fall_reaction", "adjacent_pair_change"],
  },
  {
    fishery_key: "mi_au_sable_trout",
    date: "2025-10-20",
    water_type: "freshwater_river",
    intended_buckets: ["fall_reaction", "adjacent_pair_change"],
  },
  {
    fishery_key: "ca_lower_sac_trout",
    date: "2025-10-25",
    water_type: "freshwater_river",
    intended_buckets: ["fall_reaction", "current_swing"],
  },
  {
    fishery_key: "ar_white_river_trout",
    date: "2025-10-14",
    water_type: "freshwater_river",
    intended_buckets: ["fall_reaction", "clear_subtle"],
  },
  {
    fishery_key: "ny_upper_delaware_trout",
    date: "2025-11-08",
    water_type: "freshwater_river",
    intended_buckets: ["late_fall", "cold_slow"],
  },
  {
    fishery_key: "mt_madison_trout",
    date: "2025-11-11",
    water_type: "freshwater_river",
    intended_buckets: ["late_fall", "current_swing"],
  },
  {
    fishery_key: "wa_skagit_trout",
    date: "2025-11-15",
    water_type: "freshwater_river",
    intended_buckets: ["late_fall", "runoff_streamer"],
  },
  {
    fishery_key: "ca_lower_sac_trout",
    date: "2025-11-08",
    water_type: "freshwater_river",
    intended_buckets: ["late_fall", "clear_subtle"],
  },
  {
    fishery_key: "ar_white_river_trout",
    date: "2025-12-12",
    water_type: "freshwater_river",
    intended_buckets: ["winter_sanity", "cold_slow", "current_swing"],
  },
  {
    fishery_key: "ny_upper_delaware_trout",
    date: "2025-12-12",
    water_type: "freshwater_river",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
  {
    fishery_key: "mi_au_sable_trout",
    date: "2025-12-12",
    water_type: "freshwater_river",
    intended_buckets: ["winter_sanity", "cold_slow"],
  },
] as const;

type AuditSpeciesFlag =
  | "largemouth_bass"
  | "smallmouth_bass"
  | "northern_pike"
  | "trout";

const AUDIT_CONFIGS: Record<
  AuditSpeciesFlag,
  SpeciesAuditConfig
> = {
  largemouth_bass: {
    species: "largemouth_bass",
    output_key: "lmb",
    title_label: "LMB",
    seed_prefix: "lmb_archive_audit_v1",
    fisheries: FISHERIES,
    weather_plan: WEATHER_PLAN,
  },
  smallmouth_bass: {
    species: "smallmouth_bass",
    output_key: "smb",
    title_label: "SMB",
    seed_prefix: "smb_archive_audit_v1",
    fisheries: SMB_FISHERIES,
    weather_plan: SMB_WEATHER_PLAN,
  },
  northern_pike: {
    species: "pike_musky",
    output_key: "pike",
    title_label: "Pike",
    seed_prefix: "pike_archive_audit_v1",
    fisheries: PIKE_FISHERIES,
    weather_plan: PIKE_WEATHER_PLAN,
  },
  trout: {
    species: "river_trout",
    output_key: "trout",
    title_label: "Trout",
    seed_prefix: "trout_archive_audit_v1",
    fisheries: TROUT_FISHERIES,
    weather_plan: TROUT_WEATHER_PLAN,
  },
};

const LURE_BY_ID = new Map(
  LURE_ARCHETYPES_V4.map((profile) => [profile.id, profile]),
);
const FLY_BY_ID = new Map(
  FLY_ARCHETYPES_V4.map((profile) => [profile.id, profile]),
);

function parsePositiveInt(
  raw: string | undefined,
  label: string,
): number | null {
  if (raw == null) return null;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`Expected ${label} to be a positive integer.`);
  }
  return n;
}

function argValue(args: readonly string[], name: string): string | undefined {
  const prefix = `${name}=`;
  const withEquals = args.find((arg) => arg.startsWith(prefix))?.slice(
    prefix.length,
  );
  if (withEquals != null) return withEquals;
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  const next = args[index + 1];
  return next && !next.startsWith("--") ? next : undefined;
}

function parseMonths(args: readonly string[]): Set<number> | null {
  const raw = argValue(args, "--months");
  if (!raw) return null;
  const months = raw
    .split(",")
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((month) => Number.isFinite(month) && month >= 1 && month <= 12);
  if (months.length === 0) {
    throw new Error("Expected --months=3,4,5 with at least one valid month.");
  }
  return new Set(months);
}

function parseSpeciesConfig(args: readonly string[]): SpeciesAuditConfig {
  const raw = argValue(args, "--species") ?? "largemouth_bass";
  if (
    raw !== "largemouth_bass" && raw !== "smallmouth_bass" &&
    raw !== "northern_pike" && raw !== "trout"
  ) {
    throw new Error(
      "Expected --species to be largemouth_bass, smallmouth_bass, northern_pike, or trout.",
    );
  }
  return AUDIT_CONFIGS[raw];
}

function parseFisheryKeys(
  args: readonly string[],
  fisheryByKey: ReadonlyMap<string, Fishery>,
): Set<string> | null {
  const raw = argValue(args, "--fisheries");
  if (!raw) return null;
  const keys = raw.split(",").map((part) => part.trim()).filter(Boolean);
  if (keys.length === 0) return null;
  for (const key of keys) {
    if (!fisheryByKey.has(key)) {
      throw new Error(`Unknown fishery key: ${key}`);
    }
  }
  return new Set(keys);
}

function scriptPath(filename: string): string {
  const scriptDir = decodeURIComponent(new URL(".", import.meta.url).pathname)
    .replace(/\/$/, "");
  return `${scriptDir}/${filename}`;
}

function monthLabel(month: number): string {
  return MONTH_NAMES[month - 1] ?? String(month);
}

function stableSeed(args: {
  seedPrefix: string;
  fisheryKey: string;
  date: string;
  waterType: EngineContext;
  waterClarity: WaterClarity;
  goal: Goal;
}): string {
  return [
    args.seedPrefix,
    args.fisheryKey,
    args.date,
    args.waterType,
    args.waterClarity,
    args.goal,
  ].join("|");
}

function mean(values: readonly number[]): number | null {
  const valid = values.filter((value) => Number.isFinite(value));
  if (valid.length === 0) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function round1(value: number | null): number | null {
  return value == null ? null : Math.round(value * 10) / 10;
}

function fmt(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }
  return String(value);
}

function profileFor(score: CandidateScore): ArchetypeProfileV4 {
  return score.profile;
}

function scoreSnapshot(score: CandidateScore): ScoreSnapshot {
  const profile = profileFor(score);
  return {
    id: profile.id,
    display_name: profile.display_name,
    family_group: profile.family_group,
    presentation_group: profile.presentation_group,
    column: profile.column,
    primary_pace: profile.primary_pace,
    secondary_pace: profile.secondary_pace,
    is_surface: profile.is_surface,
    score: score.score,
    score_reasons: score.reasons,
  };
}

function topScores(scores: readonly CandidateScore[]): ScoreSnapshot[] {
  return [...scores]
    .sort((a, b) =>
      b.score - a.score || a.profile.id.localeCompare(b.profile.id)
    )
    .slice(0, 5)
    .map(scoreSnapshot);
}

function allScores(scores: readonly CandidateScore[]): ScoreSnapshot[] {
  return [...scores]
    .sort((a, b) =>
      b.score - a.score || a.profile.id.localeCompare(b.profile.id)
    )
    .map(scoreSnapshot);
}

function pickSnapshots(response: DailyPicksFutureResponse): PickSnapshot[] {
  return [
    response.picks.lure_of_the_day,
    response.picks.honorable_lure,
    response.picks.fly_of_the_day,
    response.picks.honorable_fly,
  ];
}

function hasPaceIntersection(
  profile: ArchetypeProfileV4,
  row: SeasonalRowV4,
): boolean {
  return row.pace_range.includes(profile.primary_pace) ||
    (profile.secondary_pace != null &&
      row.pace_range.includes(profile.secondary_pace));
}

function selectedScores(result: DailyPicksEngineResult): CandidateScore[] {
  return [
    result.selection.lure_of_the_day,
    result.selection.honorable_lure,
    result.selection.fly_of_the_day,
    result.selection.honorable_fly,
  ];
}

function selectedScoresForSide(
  result: DailyPicksEngineResult,
  side: Side,
): CandidateScore[] {
  return side === "lure"
    ? [result.selection.lure_of_the_day, result.selection.honorable_lure]
    : [result.selection.fly_of_the_day, result.selection.honorable_fly];
}

function scoreHasReasonPrefix(score: CandidateScore, prefix: string): boolean {
  return score.reasons.some((reason) => reason.startsWith(prefix));
}

function candidateHasTag(score: CandidateScore, tag: ConditionTag): boolean {
  return score.reasons.some((reason) =>
    reason.startsWith(`condition_tag:${tag}:`)
  );
}

function hasValidAlternativeWith(args: {
  scores: readonly CandidateScore[];
  selectedIds: ReadonlySet<string>;
  predicate: (score: CandidateScore) => boolean;
}): boolean {
  return args.scores.some((score) =>
    !args.selectedIds.has(score.profile.id) && args.predicate(score)
  );
}

const CREDIBILITY_CLOSE_SCORE_BAND = 12;
const VARIETY_CLOSE_SCORE_BAND = 18;
const TOP_QUALITY_BAND = 18;
const HONORABLE_QUALITY_BAND = 24;

function selectedScoreBandFloor(selected: readonly CandidateScore[]): number {
  if (selected.length === 0) return Number.NEGATIVE_INFINITY;
  return Math.max(...selected.map((score) => score.score)) -
    CREDIBILITY_CLOSE_SCORE_BAND;
}

function closeAlternativeWith(args: {
  scores: readonly CandidateScore[];
  selected: readonly CandidateScore[];
  predicate: (score: CandidateScore) => boolean;
}): CandidateScore | null {
  const selectedIds = new Set(args.selected.map((score) => score.profile.id));
  const floor = selectedScoreBandFloor(args.selected);
  return args.scores
    .filter((score) =>
      !selectedIds.has(score.profile.id) &&
      score.score >= floor &&
      args.predicate(score)
    )
    .sort((a, b) =>
      b.score - a.score || a.profile.id.localeCompare(b.profile.id)
    )[0] ??
    null;
}

function hasConditionReason(
  score: Pick<ScoreSnapshot, "score_reasons">,
): boolean {
  return score.score_reasons.some((reason) =>
    reason.startsWith("condition_tag:")
  );
}

function snapshotHasGoalReason(
  score: Pick<ScoreSnapshot, "score_reasons">,
  goal: Goal,
): boolean {
  return score.score_reasons.some((reason) =>
    reason.startsWith(`goal:${goal}:`)
  );
}

function snapshotHasTag(
  score: Pick<ScoreSnapshot, "score_reasons">,
  tag: ConditionTag,
): boolean {
  return score.score_reasons.some((reason) =>
    reason.startsWith(`condition_tag:${tag}:`)
  );
}

function auditPriorityConditionTags(row: AuditRow): ConditionTag[] {
  return row.daily_scenario_summary.condition_tags.filter((tag) =>
    tag === "low_light_surface" ||
    tag === "calm_surface" ||
    tag === "dirty_vibration" ||
    tag === "wind_reaction" ||
    tag === "clear_subtle" ||
    tag === "heat_finesse" ||
    tag === "cold_slow" ||
    tag === "runoff_streamer" ||
    tag === "current_swing"
  );
}

function hasPriorityConditionTags(row: AuditRow): boolean {
  return auditPriorityConditionTags(row).length > 0;
}

function snapshotHasPriorityConditionReason(
  score: Pick<ScoreSnapshot, "score_reasons">,
  row: AuditRow,
): boolean {
  return auditPriorityConditionTags(row).some((tag) =>
    snapshotHasTag(score, tag)
  );
}

function preferSnapshotGoalAndConditionFit(args: {
  candidates: readonly ScoreSnapshot[];
  row: AuditRow;
  selectedTop: PickSnapshot;
}): ScoreSnapshot[] {
  const goalAndCondition = args.candidates.filter((candidate) =>
    snapshotHasGoalReason(candidate, args.row.recommendation_goal) &&
    hasConditionReason(candidate)
  );
  if (goalAndCondition.length > 0) return goalAndCondition;

  const goalFit = args.candidates.filter((candidate) =>
    snapshotHasGoalReason(candidate, args.row.recommendation_goal)
  );
  const shouldRequireBigFishGoal =
    args.row.recommendation_goal === "big_fish" &&
    !args.selectedTop.score_reasons.some((reason) =>
      reason.startsWith("goal:big_fish:")
    );
  if (shouldRequireBigFishGoal && goalFit.length > 0) return goalFit;

  const conditionFit = args.candidates.filter(hasConditionReason);
  if (hasPriorityConditionTags(args.row) && conditionFit.length > 0) {
    return conditionFit;
  }
  if (goalFit.length > 0) return goalFit;
  return conditionFit.length > 0 ? conditionFit : [...args.candidates];
}

function applySurfaceCautionPreference(args: {
  candidates: readonly ScoreSnapshot[];
  row: AuditRow;
  preserveBigFishGoal?: boolean;
}): ScoreSnapshot[] {
  if (args.row.daily_scenario_summary.surface_gate !== "caution") {
    return [...args.candidates];
  }
  const nonSurface = args.candidates.filter((candidate) =>
    !candidate.is_surface
  );
  if (args.preserveBigFishGoal) {
    const activeGoalAvailable = args.candidates.some((candidate) =>
      snapshotHasGoalReason(candidate, args.row.recommendation_goal)
    );
    const activeGoalStillAvailable = nonSurface.some((candidate) =>
      snapshotHasGoalReason(candidate, args.row.recommendation_goal)
    );
    if (activeGoalAvailable && !activeGoalStillAvailable) {
      return [...args.candidates];
    }
  }
  return nonSurface.length > 0 ? nonSurface : [...args.candidates];
}

type SlotName = "top" | "honorable";

type SlotCandidateStages = {
  inScoreBand: ScoreSnapshot[];
  afterAvoids: ScoreSnapshot[];
  afterOwnOther: ScoreSnapshot[];
  afterSurface: ScoreSnapshot[];
  afterFit: ScoreSnapshot[];
};

function selectedPickForSlot(
  row: AuditRow,
  side: Side,
  slot: SlotName,
): PickSnapshot {
  const slotName = side === "lure"
    ? (slot === "top" ? "lure_of_the_day" : "honorable_lure")
    : (slot === "top" ? "fly_of_the_day" : "honorable_fly");
  const pick = row.selected_picks.find((candidate) =>
    candidate.slot === slotName
  );
  if (!pick) {
    throw new Error(`missing selected ${slotName} in ${row.scenario_id}`);
  }
  return pick;
}

function sideCandidates(row: AuditRow, side: Side): readonly ScoreSnapshot[] {
  return side === "lure" ? row.all_lure_candidates : row.all_fly_candidates;
}

function slotCandidateStages(args: {
  row: AuditRow;
  side: Side;
  slot: SlotName;
  setAIds?: ReadonlySet<string>;
  excludeOwnOther?: boolean;
  band?: number;
}): SlotCandidateStages {
  const candidates = sideCandidates(args.row, args.side);
  const top = selectedPickForSlot(args.row, args.side, "top");
  const honorable = selectedPickForSlot(args.row, args.side, "honorable");
  const selected = args.slot === "top" ? top : honorable;
  const ownOther = args.slot === "top" ? honorable : top;
  const setAIds = args.setAIds ?? new Set<string>();
  const band = args.band ??
    (args.slot === "top" ? TOP_QUALITY_BAND : HONORABLE_QUALITY_BAND);
  const scoreBase = args.slot === "top"
    ? Math.max(...candidates.map((candidate) => candidate.score))
    : Math.max(
      ...candidates
        .filter((candidate) => candidate.id !== top.id)
        .map((candidate) => candidate.score),
    );
  const inScoreBand = candidates.filter((candidate) =>
    candidate.id !== selected.id &&
    (args.slot === "top" || args.excludeOwnOther === false ||
      candidate.id !== top.id) &&
    candidate.score >= scoreBase - band
  );
  const afterAvoids = inScoreBand.filter((candidate) =>
    !setAIds.has(candidate.id)
  );
  const afterOwnOther = args.excludeOwnOther === false
    ? afterAvoids
    : afterAvoids.filter((candidate) => candidate.id !== ownOther.id);
  const preserveBigFishGoal = args.slot === "honorable" &&
    args.row.recommendation_goal === "big_fish" &&
    !top.score_reasons.some((reason) => reason.startsWith("goal:big_fish:"));
  const afterSurface = applySurfaceCautionPreference({
    candidates: afterOwnOther,
    row: args.row,
    preserveBigFishGoal,
  });
  const afterFit = preferSnapshotGoalAndConditionFit({
    candidates: afterSurface,
    row: args.row,
    selectedTop: top,
  });
  return { inScoreBand, afterAvoids, afterOwnOther, afterSurface, afterFit };
}

function bestSnapshot(
  candidates: readonly ScoreSnapshot[],
): ScoreSnapshot | null {
  return candidates
    .slice()
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))[0] ?? null;
}

function hasGoalReason(score: CandidateScore, goal: Goal): boolean {
  return scoreHasReasonPrefix(score, `goal:${goal}:`);
}

function isDirtyReactionFit(score: CandidateScore): boolean {
  return candidateHasTag(score, "dirty_vibration") ||
    candidateHasTag(score, "wind_reaction") ||
    score.reasons.some((reason) =>
      reason.startsWith("clarity_strength:dirty:") ||
      reason.startsWith("clarity_strength:stained:")
    ) ||
    score.profile.condition_tags.includes("dirty_vibration") ||
    score.profile.condition_tags.includes("wind_reaction");
}

function isClearSubtlePriorityScenario(
  result: DailyPicksEngineResult,
): boolean {
  const scenario = result.scenario;
  const tags = new Set(scenario.scenario_tags);
  const strongerPriority = tags.has("cold_slow") ||
    tags.has("heat_finesse") ||
    tags.has("dirty_vibration") ||
    tags.has("current_swing") ||
    tags.has("low_light_surface") ||
    selectedScores(result).some((score) => score.profile.is_surface);
  return scenario.water_clarity === "clear" &&
    (scenario.light_mode === "bright" || scenario.light_mode === "glare") &&
    (scenario.wind_mode === "calm" || scenario.wind_mode === "breezy") &&
    !strongerPriority;
}

function isWindReactionPriorityScenario(
  result: DailyPicksEngineResult,
): boolean {
  const tags = new Set(result.scenario.scenario_tags);
  return tags.has("wind_reaction") &&
    !tags.has("cold_slow") &&
    !tags.has("heat_finesse");
}

function isHighRiskOnlyAllPurposePick(score: CandidateScore): boolean {
  return score.profile.goal_tags.includes("high_risk_high_reward") &&
    !hasGoalReason(score, "all_purpose");
}

function recursiveHasOldColorField(value: unknown): boolean {
  if (value == null || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(recursiveHasOldColorField);
  for (const [key, child] of Object.entries(value)) {
    const normalized = key.toLowerCase();
    if (
      normalized === "color" || normalized === "colors" ||
      normalized.includes("color_guidance")
    ) {
      return true;
    }
    if (recursiveHasOldColorField(child)) return true;
  }
  return false;
}

function buildRecommenderEnvData(
  sharedEnvironment: Record<string, unknown>,
  rawEnvData: Record<string, unknown>,
): Record<string, unknown> {
  const envForEngine: Record<string, unknown> = { ...sharedEnvironment };
  if (Array.isArray(rawEnvData.hourly_wind_speed)) {
    envForEngine.hourly_wind_speed = rawEnvData.hourly_wind_speed;
  }
  const rawWeather =
    rawEnvData.weather && typeof rawEnvData.weather === "object"
      ? rawEnvData.weather as Record<string, unknown>
      : null;
  if (rawWeather && "wind_speed_unit" in rawWeather) {
    const existingWeather =
      envForEngine.weather && typeof envForEngine.weather === "object"
        ? envForEngine.weather as Record<string, unknown>
        : {};
    envForEngine.weather = {
      ...existingWeather,
      wind_speed_unit: rawWeather.wind_speed_unit,
    };
  }
  return envForEngine;
}

function archiveSummary(
  archive: ArchiveWeatherResult,
  date: string,
  timezone: string,
): ArchiveWeatherSummary {
  const noonIndex = findNoonHourIndex(
    archive.hourly_times_unix,
    date,
    timezone,
  );
  const dailyIndex = findDailyIndex(archive.daily_times_unix, date, timezone);
  const daylightWind: number[] = [];
  const daylightCloud: number[] = [];
  for (let i = 0; i < archive.hourly_times_unix.length; i++) {
    const unix = archive.hourly_times_unix[i]!;
    if (localDateFromUnix(unix, timezone) !== date) continue;
    const hour = localHourFromUnix(unix, timezone);
    if (hour >= 5 && hour <= 21) {
      daylightWind.push(archive.hourly_wind_mph[i] ?? 0);
      daylightCloud.push(archive.hourly_cloud_cover[i] ?? 0);
    }
  }
  const pressureWindow = noonIndex >= 0
    ? archive.hourly_pressure_msl.slice(
      Math.max(0, noonIndex - 47),
      noonIndex + 1,
    )
    : [];
  const pressureTrend = pressureWindow.length >= 2
    ? pressureWindow[pressureWindow.length - 1]! - pressureWindow[0]!
    : null;
  const pressureTrendLabel = pressureTrend == null
    ? null
    : pressureTrend <= -3
    ? "falling"
    : pressureTrend >= 3
    ? "rising"
    : "stable";
  return {
    wind_daylight_avg_mph: round1(mean(daylightWind)),
    wind_daily_max_mph: dailyIndex >= 0
      ? round1(archive.daily_wind_max_mph[dailyIndex] ?? null)
      : null,
    cloud_noon_pct: noonIndex >= 0
      ? round1(archive.hourly_cloud_cover[noonIndex] ?? null)
      : null,
    cloud_daylight_avg_pct: round1(mean(daylightCloud)),
    temp_noon_f: noonIndex >= 0
      ? round1(archive.hourly_temp_f[noonIndex] ?? null)
      : null,
    temp_high_f: dailyIndex >= 0
      ? round1(archive.daily_temp_max_f[dailyIndex] ?? null)
      : null,
    temp_low_f: dailyIndex >= 0
      ? round1(archive.daily_temp_min_f[dailyIndex] ?? null)
      : null,
    precip_in: dailyIndex >= 0
      ? round1(archive.daily_precip_in[dailyIndex] ?? null)
      : null,
    pressure_noon_mb: noonIndex >= 0
      ? round1(archive.hourly_pressure_msl[noonIndex] ?? null)
      : null,
    pressure_trend_mb_48h: round1(pressureTrend),
    pressure_trend_label: pressureTrendLabel,
  };
}

function conditionBuckets(row: {
  water_type: EngineContext;
  water_clarity: WaterClarity;
  scenario: DailyPicksEngineResult["scenario"];
}): string[] {
  const buckets: string[] = [];
  const s = row.scenario;
  const hasTag = (tag: ConditionTag) => s.scenario_tags.includes(tag);
  if (
    s.surface_daily_gate === "open" && s.wind_mode === "calm" &&
    s.light_mode === "low_light"
  ) {
    buckets.push("calm_low_light_surface");
  }
  if (
    s.wind_mode === "calm" && row.water_clarity === "clear" &&
    (s.light_mode === "bright" || s.light_mode === "glare")
  ) {
    buckets.push("calm_bright_clear_subtle");
  }
  if (
    (s.wind_mode === "breezy" || s.wind_mode === "windy") &&
    row.water_clarity === "stained" && hasTag("wind_reaction")
  ) {
    buckets.push("breezy_windy_stained_reaction");
  }
  if (row.water_clarity === "dirty" && hasTag("dirty_vibration")) {
    buckets.push("dirty_vibration");
  }
  if (hasTag("cold_slow") || s.thermal_mode === "cooling_or_shock") {
    buckets.push("cold_slow_or_front");
  }
  if (hasTag("warming_search")) buckets.push("warming_search");
  if (hasTag("heat_finesse")) buckets.push("heat_limited_finesse");
  const stablePleasant = s.missing_inputs.length === 0 &&
    s.thermal_mode === "stable" &&
    s.activity_level !== "suppressed" &&
    (s.wind_mode === "calm" || s.wind_mode === "breezy") &&
    !hasTag("cold_slow") &&
    !hasTag("heat_finesse");
  if (
    stablePleasant &&
    s.confidence === "high"
  ) {
    buckets.push("stable_pleasant_high_confidence");
  }
  if (stablePleasant && s.confidence === "medium") {
    buckets.push("stable_pleasant_medium_confidence_archive");
  }
  if (row.water_type === "freshwater_river" && hasTag("current_swing")) {
    buckets.push("river_elevated_runoff_current");
  }
  if (s.confidence === "medium" && s.missing_inputs.length === 0) {
    buckets.push("medium_confidence_archive");
  }
  if (s.confidence === "low" || s.missing_inputs.length > 0) {
    buckets.push("missing_or_low_confidence_inputs");
  }
  return buckets.length ? buckets : ["unclassified"];
}

function hardFailFlags(args: {
  result: DailyPicksEngineResult;
  response: DailyPicksFutureResponse;
}): Flag[] {
  const flags: Flag[] = [];
  const { result, response } = args;
  if (
    response.feature !== "recommender_daily_picks_2x2_future" ||
    Object.keys(response.picks).length !== 4
  ) {
    flags.push({
      category: "hard",
      code: "STALE_RESPONSE_SHAPE",
      message: "Response is not the daily-picks 2x2 future shape.",
    });
  }
  if (recursiveHasOldColorField(response)) {
    flags.push({
      category: "hard",
      code: "OLD_COLOR_GUIDANCE_FIELD",
      message: "Response still includes old color/color guidance fields.",
    });
  }
  if (result.candidate_pool.lures.length < 2) {
    flags.push({
      category: "hard",
      code: "FEWER_THAN_TWO_VALID_LURES",
      message:
        `Only ${result.candidate_pool.lures.length} valid lure candidates after hard gates.`,
      side: "lure",
    });
  }
  if (result.candidate_pool.flies.length < 2) {
    flags.push({
      category: "hard",
      code: "FEWER_THAN_TWO_VALID_FLIES",
      message:
        `Only ${result.candidate_pool.flies.length} valid fly candidates after hard gates.`,
      side: "fly",
    });
  }

  for (const score of selectedScores(result)) {
    const profile = score.profile;
    const side = profile.gear_mode as Side;
    const authored = side === "lure"
      ? result.row.primary_lure_ids
      : result.row.primary_fly_ids;
    const excluded = side === "lure"
      ? result.row.excluded_lure_ids ?? []
      : result.row.excluded_fly_ids ?? [];
    const slot = Object.entries(response.picks).find(([, pick]) =>
      pick.id === profile.id
    )?.[0];
    if (
      profile.is_surface &&
      (!result.row.surface_seasonally_possible ||
        result.scenario.surface_daily_gate === "closed")
    ) {
      flags.push({
        category: "hard",
        code: "SURFACE_PICK_GATE_CLOSED",
        message:
          `${profile.display_name} is surface while seasonal or daily surface gate is closed.`,
        side,
        slot,
      });
    }
    if (!profile.species_allowed.includes(result.scenario.species)) {
      flags.push({
        category: "hard",
        code: "SELECTED_ITEM_INVALID_SPECIES",
        message:
          `${profile.display_name} is not valid for ${result.scenario.species}.`,
        side,
        slot,
      });
    }
    if (!profile.water_types_allowed.includes(result.scenario.water_type)) {
      flags.push({
        category: "hard",
        code: "SELECTED_ITEM_INVALID_WATER_TYPE",
        message:
          `${profile.display_name} is not valid for ${result.scenario.water_type}.`,
        side,
        slot,
      });
    }
    if (
      !result.row.column_range.includes(profile.column) ||
      !hasPaceIntersection(profile, result.row)
    ) {
      flags.push({
        category: "hard",
        code: "SELECTED_ITEM_OUTSIDE_ROW_GATES",
        message:
          `${profile.display_name} is outside seasonal column/pace gates.`,
        side,
        slot,
      });
    }
    if (
      !authored.includes(profile.id as never) ||
      excluded.includes(profile.id as never)
    ) {
      flags.push({
        category: "hard",
        code: "CANDIDATE_NOT_FROM_ROW_AUTHORED_POOL",
        message:
          `${profile.display_name} is not in the row-authored pool or is excluded.`,
        side,
        slot,
      });
    }
  }
  return flags;
}

function credibilityFlags(result: DailyPicksEngineResult): Flag[] {
  const flags: Flag[] = [];
  const scenario = result.scenario;
  const allSelected = selectedScores(result);
  const selectedBySide = {
    lure: selectedScoresForSide(result, "lure"),
    fly: selectedScoresForSide(result, "fly"),
  };
  const scoresBySide = {
    lure: result.lure_scores,
    fly: result.fly_scores,
  };
  const warmRegions: RegionKey[] = [
    "florida",
    "gulf_coast",
    "south_central",
    "southeast_atlantic",
    "southwest_desert",
    "southern_california",
  ];

  for (const score of allSelected) {
    const profile = score.profile;
    const side = profile.gear_mode as Side;
    const slot = side === "lure"
      ? (selectedBySide.lure[0]?.profile.id === profile.id
        ? "lure_of_the_day"
        : "honorable_lure")
      : (selectedBySide.fly[0]?.profile.id === profile.id
        ? "fly_of_the_day"
        : "honorable_fly");

    if (profile.is_surface && [1, 2, 12].includes(scenario.month)) {
      flags.push({
        category: "credibility",
        code: "TOPWATER_QUESTIONABLE_MONTH",
        message: `${profile.display_name} is a surface pick in ${
          monthLabel(scenario.month)
        }.`,
        side,
        slot,
      });
    }
    if (
      profile.is_surface &&
      [3, 4, 10, 11].includes(scenario.month) &&
      !warmRegions.includes(scenario.region_key)
    ) {
      flags.push({
        category: "credibility",
        code: "TOPWATER_SHOULDER_SEASON_REGION",
        message:
          `${profile.display_name} is a shoulder-season surface pick outside warm regions.`,
        side,
        slot,
      });
    }
    if (
      scenario.scenario_tags.includes("heat_finesse") &&
      profile.primary_pace === "fast"
    ) {
      flags.push({
        category: "credibility",
        code: "HEAT_LIMITED_TOO_AGGRESSIVE",
        message: `${profile.display_name} is fast-paced on a heat-limited day.`,
        side,
        slot,
      });
    }
    if (
      scenario.scenario_tags.includes("cold_slow") &&
      profile.primary_pace === "fast"
    ) {
      flags.push({
        category: "credibility",
        code: "COLD_CLEAR_TOO_FAST",
        message:
          `${profile.display_name} is fast-paced under cold/clear/suppressed signals.`,
        side,
        slot,
      });
    }
  }

  for (const side of ["lure", "fly"] as const) {
    const selected = selectedBySide[side];
    const scores = scoresBySide[side];
    if (
      scenario.scenario_tags.includes("dirty_vibration") &&
      selected.every((score) => !isDirtyReactionFit(score)) &&
      closeAlternativeWith({
          scores,
          selected,
          predicate: isDirtyReactionFit,
        }) != null
    ) {
      flags.push({
        category: "credibility",
        code: "DIRTY_WIND_NOT_ELEVATING_VIBRATION",
        message:
          `${side} side did not select a dirty-water reaction/vibration fit despite a close scoring alternative.`,
        side,
      });
    }
    if (
      isWindReactionPriorityScenario(result) &&
      selected.every((score) => !candidateHasTag(score, "wind_reaction")) &&
      closeAlternativeWith({
          scores,
          selected,
          predicate: (score) => candidateHasTag(score, "wind_reaction"),
        }) != null
    ) {
      flags.push({
        category: "credibility",
        code: "WIND_NOT_ELEVATING_REACTION",
        message:
          `${side} side did not select a wind-reaction fit despite a close scoring alternative.`,
        side,
      });
    }
    if (
      isClearSubtlePriorityScenario(result) &&
      selected.every((score) => !candidateHasTag(score, "clear_subtle")) &&
      closeAlternativeWith({
          scores,
          selected,
          predicate: (score) => candidateHasTag(score, "clear_subtle"),
        }) != null
    ) {
      flags.push({
        category: "credibility",
        code: "CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE",
        message:
          `${side} side did not select a clear/subtle fit in a true bright clear finesse-priority window.`,
        side,
      });
    }
    if (
      scenario.recommendation_goal === "big_fish" &&
      selected.every((score) => !hasGoalReason(score, "big_fish")) &&
      closeAlternativeWith({
          scores,
          selected,
          predicate: (score) => hasGoalReason(score, "big_fish"),
        }) != null
    ) {
      flags.push({
        category: "credibility",
        code: "BIG_FISH_NOT_FAVORING_UPSIDE",
        message:
          `${side} side lacks explicit big-fish upside despite a close scoring big-fish alternative.`,
        side,
      });
    }
    if (
      scenario.recommendation_goal === "all_purpose" &&
      selected.some(isHighRiskOnlyAllPurposePick) &&
      closeAlternativeWith({
          scores,
          selected,
          predicate: (score) =>
            hasGoalReason(score, "all_purpose") &&
            !score.profile.goal_tags.includes("high_risk_high_reward"),
        }) != null
    ) {
      flags.push({
        category: "credibility",
        code: "ALL_PURPOSE_OVER_SELECTING_HIGH_RISK",
        message:
          `${side} side selected high-risk-only all-purpose picks despite close reliable alternatives.`,
        side,
      });
    }
  }
  return flags;
}

function varietyFlags(result: DailyPicksEngineResult): Flag[] {
  const flags: Flag[] = [];
  void result;
  return flags;
}

function topCandidateBand(
  candidates: readonly ScoreSnapshot[],
  band = VARIETY_CLOSE_SCORE_BAND,
): ScoreSnapshot[] {
  if (candidates.length === 0) return [];
  const best = Math.max(...candidates.map((candidate) => candidate.score));
  return candidates.filter((candidate) => candidate.score >= best - band);
}

type SetBOverlapCause =
  | "truly_avoidable"
  | "unavoidable_due_score_band"
  | "unavoidable_because_only_alternative_already_selected_in_set_b"
  | "unavoidable_due_goal_condition_fit"
  | "unavoidable_due_surface_caution_non_surface_filtering";

type SetBSlotCase = {
  row: AuditRow;
  setA: AuditRow;
  side: Side;
  slot: SlotName;
  pick: PickSnapshot;
  kind:
    | "exact_id"
    | "same_family_same_presentation"
    | "same_family_different_presentation";
  cause: SetBOverlapCause;
  alternative: ScoreSnapshot | null;
  rawAlternative: ScoreSnapshot | null;
  scoreGap: number | null;
};

function setBSlotCases(rows: readonly AuditRow[]): SetBSlotCase[] {
  const cases: SetBSlotCase[] = [];
  const byBase = new Map<string, AuditRow[]>();
  for (const row of rows) {
    const key = [
      row.weather_scenario_id,
      row.water_type,
      row.water_clarity,
      row.recommendation_goal,
    ].join("|");
    const group = byBase.get(key) ?? [];
    group.push(row);
    byBase.set(key, group);
  }

  for (const group of byBase.values()) {
    const a = group.find((row) => row.set === "A");
    const b = group.find((row) => row.set === "B");
    if (!a || !b) continue;
    for (const side of ["lure", "fly"] as const) {
      const aPicks = a.selected_picks.filter((pick) => pick.gear_mode === side);
      const aIds = new Set(aPicks.map((pick) => pick.id));
      const aFamilies = new Set(aPicks.map((pick) => pick.family_group));
      const aPresentations = new Set(
        aPicks.map((pick) => pick.presentation_group),
      );
      for (const slot of ["top", "honorable"] as const) {
        const pick = selectedPickForSlot(b, side, slot);
        const stages = slotCandidateStages({
          row: b,
          side,
          slot,
          setAIds: aIds,
          excludeOwnOther: true,
        });
        const rawStages = slotCandidateStages({
          row: b,
          side,
          slot,
          setAIds: aIds,
          excludeOwnOther: false,
        });
        const exactOverlap = aIds.has(pick.id);
        const sameFamily = !exactOverlap && aFamilies.has(pick.family_group);
        const samePresentation = aPresentations.has(pick.presentation_group);
        const kinds: SetBSlotCase["kind"][] = [];
        if (exactOverlap) kinds.push("exact_id");
        if (sameFamily) {
          kinds.push(
            samePresentation
              ? "same_family_same_presentation"
              : "same_family_different_presentation",
          );
        }
        for (const kind of kinds) {
          const predicate = (candidate: ScoreSnapshot): boolean => {
            if (kind === "exact_id") return !aIds.has(candidate.id);
            if (kind === "same_family_same_presentation") {
              return !aFamilies.has(candidate.family_group);
            }
            return !aFamilies.has(candidate.family_group) &&
              !aPresentations.has(candidate.presentation_group);
          };
          const alternative = bestSnapshot(stages.afterFit.filter(predicate));
          const rawAlternative = bestSnapshot(
            rawStages.afterAvoids.filter(predicate),
          );
          const selectedHasPriorityFit = snapshotHasPriorityConditionReason(
            pick,
            b,
          );
          const selectedHasGoalFit = snapshotHasGoalReason(
            pick,
            b.recommendation_goal,
          );
          const comparableFitAlternative = stages.afterSurface
            .filter(predicate)
            .some((candidate) =>
              (selectedHasPriorityFit &&
                snapshotHasPriorityConditionReason(candidate, b)) ||
              (selectedHasGoalFit &&
                snapshotHasGoalReason(candidate, b.recommendation_goal))
            );
          let cause: SetBOverlapCause = "truly_avoidable";
          if (
            alternative &&
            (selectedHasPriorityFit || selectedHasGoalFit) &&
            !comparableFitAlternative
          ) {
            cause = "unavoidable_due_goal_condition_fit";
          } else if (!alternative) {
            const ownOtherOnly = rawStages.afterAvoids.some(predicate) &&
              !stages.afterOwnOther.some(predicate);
            const scoreBandMissing = !rawStages.inScoreBand.some((candidate) =>
              !aIds.has(candidate.id) && predicate(candidate)
            );
            const surfaceRemoved = stages.afterOwnOther.some(predicate) &&
              !stages.afterSurface.some(predicate);
            const fitRemoved = stages.afterSurface.some(predicate) &&
              !stages.afterFit.some(predicate);
            cause = ownOtherOnly
              ? "unavoidable_because_only_alternative_already_selected_in_set_b"
              : scoreBandMissing
              ? "unavoidable_due_score_band"
              : surfaceRemoved
              ? "unavoidable_due_surface_caution_non_surface_filtering"
              : fitRemoved
              ? "unavoidable_due_goal_condition_fit"
              : "unavoidable_due_score_band";
          }
          cases.push({
            row: b,
            setA: a,
            side,
            slot,
            pick,
            kind,
            cause,
            alternative,
            rawAlternative,
            scoreGap: alternative ? alternative.score - pick.score : null,
          });
        }
      }
    }
  }
  return cases;
}

function addIntraSetVarietyFlags(rows: AuditRow[]): void {
  for (const row of rows) {
    for (const side of ["lure", "fly"] as const) {
      const top = selectedPickForSlot(row, side, "top");
      const honorable = selectedPickForSlot(row, side, "honorable");
      if (top.family_group !== honorable.family_group) continue;
      const samePresentation =
        top.presentation_group === honorable.presentation_group;
      const stages = slotCandidateStages({
        row,
        side,
        slot: "honorable",
        band: Number.POSITIVE_INFINITY,
      });
      const alternative = bestSnapshot(
        stages.afterSurface.filter((candidate) =>
          candidate.family_group !== top.family_group &&
          candidate.id !== honorable.id
        ),
      );
      const code = samePresentation
        ? "TOP_AND_HONORABLE_SAME_FAMILY_SAME_PRESENTATION"
        : "TOP_AND_HONORABLE_SAME_FAMILY_DIFFERENT_PRESENTATION";
      if (!alternative) {
        row.flags.push({
          category: "hard",
          code: "NO_DIFFERENT_FAMILY_AVAILABLE_FOR_SIDE",
          message:
            `${side} top and honorable share ${top.family_group}; no different-family candidate was available for that side after hard/surface gates.`,
          side,
          slot: side === "lure" ? "honorable_lure" : "honorable_fly",
        });
        continue;
      }
      row.flags.push({
        category: "hard",
        code,
        message: `${side} top and honorable share ${
          samePresentation ? "family and presentation" : "family"
        } despite ${alternative.display_name} being available after hard/surface gates for the honorable slot.`,
        side,
        slot: side === "lure" ? "honorable_lure" : "honorable_fly",
      });
    }
  }
}

function addSetBVarietyFlags(rows: AuditRow[]): void {
  for (const entry of setBSlotCases(rows)) {
    if (entry.cause !== "truly_avoidable") continue;
    const alternative = entry.alternative;
    if (!alternative) continue;
    if (entry.kind === "exact_id") {
      entry.row.flags.push({
        category: "variety",
        code: "SET_B_ID_OVERLAP_AVOIDABLE",
        message:
          `Set B ${entry.side} ${entry.slot} repeats Set A exact ID ${entry.pick.id} despite ${alternative.display_name} close for that slot.`,
        side: entry.side,
        slot: entry.pick.slot,
      });
    } else {
      const code = entry.kind === "same_family_same_presentation"
        ? "SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE"
        : "SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE";
      entry.row.flags.push({
        category: "variety",
        code,
        message: `Set B ${entry.side} ${entry.slot} reuses Set A ${
          entry.kind === "same_family_same_presentation"
            ? "family and presentation"
            : "family"
        } with ${entry.pick.display_name}; ${alternative.display_name} was close for that slot.`,
        side: entry.side,
        slot: entry.pick.slot,
      });
    }
  }
  const byBase = new Map<string, AuditRow[]>();
  for (const row of rows) {
    const key = [
      row.weather_scenario_id,
      row.water_type,
      row.water_clarity,
      row.recommendation_goal,
    ].join("|");
    const group = byBase.get(key) ?? [];
    group.push(row);
    byBase.set(key, group);
  }
  for (const group of byBase.values()) {
    const a = group.find((row) => row.set === "A");
    const b = group.find((row) => row.set === "B");
    if (!a || !b) continue;
    const aAll = a.selected_picks.map((pick) => pick.id).sort().join("|");
    const bAll = b.selected_picks.map((pick) => pick.id).sort().join("|");
    if (aAll === bAll) {
      b.flags.push({
        category: "variety",
        code: "SET_B_FULLY_REUSES_SET_A",
        message: "Set B fully reused Set A picks.",
      });
    }
  }
}

function varietyPriorityNote(): string {
  return [
    "Audit priority:",
    "top/honorable same-family on the same side is a hard invariant.",
    "Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable.",
    "Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds.",
    "Top/honorable same presentation with different families is acceptable.",
  ].join(" ");
}

function addAdjacentDayVarietyFlags(rows: AuditRow[]): void {
  const byKey = new Map<string, AuditRow[]>();
  for (const row of rows) {
    const key = [
      row.fishery_label,
      row.water_type,
      row.water_clarity,
      row.recommendation_goal,
      row.set,
    ].join("|");
    const group = byKey.get(key) ?? [];
    group.push(row);
    byKey.set(key, group);
  }

  for (const group of byKey.values()) {
    const sorted = group.slice().sort((a, b) => a.date.localeCompare(b.date));
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]!;
      const cur = sorted[i]!;
      if (cur.date !== addDays(prev.date, 1)) continue;
      for (const side of ["lure", "fly"] as const) {
        const prevIds = prev.selected_picks.filter((pick) =>
          pick.gear_mode === side
        ).map((pick) => pick.id).sort().join("|");
        const curIds = cur.selected_picks.filter((pick) =>
          pick.gear_mode === side
        ).map((pick) => pick.id).sort().join("|");
        const candidates = side === "lure"
          ? cur.top_lure_candidates
          : cur.top_fly_candidates;
        const alternatives = candidates.some((candidate) =>
          !prevIds.split("|").includes(candidate.id)
        );
        if (prevIds === curIds && alternatives) {
          cur.flags.push({
            category: "variety",
            code: "ADJACENT_DAY_EXACT_REPEAT",
            message:
              `Adjacent-day ${side} picks exactly repeated despite alternatives.`,
            side,
          });
        }
      }
    }
  }
}

function buildRequest(args: {
  species: SpeciesGroup;
  fishery: Fishery;
  date: string;
  waterType: EngineContext;
  clarity: WaterClarity;
  goal: Goal;
  envData: Record<string, unknown>;
}): { req: RecommenderRequest; regionMismatch: boolean } {
  const sharedReq = buildSharedEngineRequestFromEnvData(
    args.fishery.latitude,
    args.fishery.longitude,
    args.date,
    args.fishery.timezone,
    args.waterType,
    args.envData,
    0,
    { useCalendarDayProfileForToday: true },
  );
  const month = Number.parseInt(args.date.slice(5, 7), 10);
  const req: RecommenderRequest = {
    location: {
      latitude: args.fishery.latitude,
      longitude: args.fishery.longitude,
      state_code: sharedReq.state_code ?? args.fishery.state,
      region_key: sharedReq.region_key,
      local_date: args.date,
      local_timezone: args.fishery.timezone,
      month,
    },
    species: args.species,
    context: args.waterType,
    water_clarity: args.clarity,
    recommendation_goal: args.goal,
    env_data: buildRecommenderEnvData(
      sharedReq.environment as Record<string, unknown>,
      args.envData,
    ),
  };
  return {
    req,
    regionMismatch: sharedReq.region_key !== args.fishery.region_key,
  };
}

function runOne(args: {
  config: SpeciesAuditConfig;
  fishery: Fishery;
  weatherPlan: WeatherPlan;
  archiveSummary: ArchiveWeatherSummary;
  envData: Record<string, unknown>;
  clarity: WaterClarity;
  goal: Goal;
  variant: DailyPicksVariant;
  avoidLureIds?: readonly string[];
  avoidFlyIds?: readonly string[];
}): AuditRow {
  const { req, regionMismatch } = buildRequest({
    species: args.config.species,
    fishery: args.fishery,
    date: args.weatherPlan.date,
    waterType: args.weatherPlan.water_type,
    clarity: args.clarity,
    goal: args.goal,
    envData: args.envData,
  });
  const analysis = analyzeRecommenderConditions(req);
  const row = resolveDailyPicksSeasonalRow({
    species: req.species,
    region_key: req.location.region_key,
    month: req.location.month,
    water_type: req.context,
  });
  const seed = stableSeed({
    seedPrefix: args.config.seed_prefix,
    fisheryKey: args.weatherPlan.fishery_key,
    date: args.weatherPlan.date,
    waterType: args.weatherPlan.water_type,
    waterClarity: args.clarity,
    goal: args.goal,
  });
  const result = runDailyPicksEngine({
    req,
    analysis,
    seasonalRow: row,
    seed,
    variant: args.variant,
    avoidLureIds: args.avoidLureIds,
    avoidFlyIds: args.avoidFlyIds,
  });
  const response = shapeDailyPicksResponse({ result, seed });
  const flags = [
    ...hardFailFlags({ result, response }),
    ...credibilityFlags(result),
    ...varietyFlags(result),
  ];
  if (regionMismatch) {
    flags.push({
      category: "credibility",
      code: "REGION_RESOLUTION_MISMATCH",
      message:
        `Coordinate resolver produced ${req.location.region_key}; expected scenario region ${args.fishery.region_key}.`,
    });
  }
  const buckets = conditionBuckets({
    water_type: req.context,
    water_clarity: req.water_clarity,
    scenario: result.scenario,
  });
  return {
    scenario_id: [
      args.weatherPlan.fishery_key,
      args.weatherPlan.date,
      args.weatherPlan.water_type,
      args.clarity,
      args.goal,
      args.variant,
    ].join("__"),
    weather_scenario_id: [
      args.weatherPlan.fishery_key,
      args.weatherPlan.date,
      args.weatherPlan.water_type,
    ].join("__"),
    fishery_label: args.fishery.label,
    latitude: args.fishery.latitude,
    longitude: args.fishery.longitude,
    state: args.fishery.state,
    expected_region_key: args.fishery.region_key,
    region_key: req.location.region_key,
    date: args.weatherPlan.date,
    month: req.location.month,
    timezone: args.fishery.timezone,
    water_type: req.context,
    water_clarity: req.water_clarity,
    recommendation_goal: req.recommendation_goal,
    set: args.variant,
    intended_buckets: args.weatherPlan.intended_buckets,
    condition_buckets: buckets,
    archive_weather_summary: args.archiveSummary,
    daily_scenario_summary: {
      hows_score: result.scenario.hows_score,
      activity: result.scenario.activity_level,
      surface_gate: result.scenario.surface_daily_gate,
      surface_reasons: result.scenario.surface_daily_reason_codes,
      condition_tags: result.scenario.scenario_tags,
      light_mode: result.scenario.light_mode,
      wind_mode: result.scenario.wind_mode,
      thermal_mode: result.scenario.thermal_mode,
      water_movement_mode: result.scenario.water_movement_mode,
      pressure_mode: result.scenario.pressure_mode,
      confidence: result.scenario.confidence,
      missing_inputs: result.scenario.missing_inputs,
    },
    seasonal_row_summary: {
      column_range: result.row.column_range,
      pace_range: result.row.pace_range,
      column_baseline: result.row.column_baseline,
      pace_baseline: result.row.pace_baseline,
      forage: {
        primary: result.row.primary_forage,
        secondary: result.row.secondary_forage,
      },
      surface_seasonally_possible: result.row.surface_seasonally_possible,
      row_authored_lure_count: result.row.primary_lure_ids.length,
      row_authored_fly_count: result.row.primary_fly_ids.length,
    },
    selected_picks: pickSnapshots(response),
    top_lure_candidates: topScores(result.lure_scores),
    top_fly_candidates: topScores(result.fly_scores),
    all_lure_candidates: allScores(result.lure_scores),
    all_fly_candidates: allScores(result.fly_scores),
    finalist_pool_diagnostics: result.diagnostics.finalist_pools,
    flags,
  };
}

function countBy<T extends string | number>(
  values: readonly T[],
): Map<T, number> {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

function topCounts(
  values: readonly string[],
  limit: number,
): Array<[string, number]> {
  return [...countBy(values).entries()]
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
    .slice(0, limit);
}

function flagSummary(
  rows: readonly AuditRow[],
  category: FlagCategory,
  limit: number,
): Array<[string, number]> {
  return topCounts(
    rows.flatMap((row) =>
      row.flags.filter((flag) => flag.category === category).map((flag) =>
        flag.code
      )
    ),
    limit,
  );
}

function table(lines: string[][]): string {
  if (lines.length === 0) return "";
  const header = lines[0]!;
  const sep = header.map(() => "---");
  return [header, sep, ...lines.slice(1)]
    .map((row) => `| ${row.join(" | ")} |`)
    .join("\n");
}

function flagRows(
  rows: readonly AuditRow[],
  category: FlagCategory,
  limit: number,
): string {
  const flagged = rows
    .filter((row) => row.flags.some((flag) => flag.category === category))
    .slice()
    .sort((a, b) =>
      b.flags.filter((flag) => flag.category === category).length -
      a.flags.filter((flag) => flag.category === category).length
    );
  if (flagged.length === 0) return "None.";
  return flagged.slice(0, limit).map((row) => {
    const codes = row.flags.filter((flag) => flag.category === category).map((
      flag,
    ) => flag.code);
    const picks = row.selected_picks.map((pick) =>
      `${pick.display_name} (${pick.gear_mode})`
    ).join("; ");
    return `- ${row.scenario_id}: ${
      [...new Set(codes)].join(", ")
    }. Picks: ${picks}`;
  }).join("\n");
}

function credibilityByBucket(rows: readonly AuditRow[]): string {
  const byBucket = new Map<string, string[]>();
  for (const row of rows) {
    const codes = row.flags
      .filter((flag) => flag.category === "credibility")
      .map((flag) => flag.code);
    if (codes.length === 0) continue;
    for (const bucket of row.condition_buckets) {
      const list = byBucket.get(bucket) ?? [];
      list.push(...codes);
      byBucket.set(bucket, list);
    }
  }
  const lines = [["Bucket", "Runs with warnings", "Top warning codes"]];
  for (
    const [bucket, codes] of [...byBucket.entries()].sort((a, b) =>
      a[0].localeCompare(b[0])
    )
  ) {
    const runCount = rows.filter((row) =>
      row.condition_buckets.includes(bucket) &&
      row.flags.some((flag) =>
        flag.category === "credibility"
      )
    ).length;
    lines.push([
      bucket,
      String(runCount),
      topCounts(codes, 5).map(([code, count]) => `${code} (${count})`).join(
        ", ",
      ),
    ]);
  }
  return lines.length === 1 ? "None." : table(lines);
}

function selectedPickIds(rows: readonly AuditRow[], goal?: Goal): string[] {
  return rows
    .filter((row) => goal == null || row.recommendation_goal === goal)
    .flatMap((row) =>
      row.selected_picks.map((pick) =>
        `${pick.display_name} [${pick.gear_mode}]`
      )
    );
}

function tagWinners(rows: readonly AuditRow[]): string {
  const tags: ConditionTag[] = [
    "calm_surface",
    "low_light_surface",
    "wind_reaction",
    "dirty_vibration",
    "clear_subtle",
    "cold_slow",
    "warming_search",
    "heat_finesse",
    "current_swing",
  ];
  const lines = [["Tag", "Goal", "Top-pick winners", "All-slot winners"]];
  for (const tag of tags) {
    for (const goal of GOALS) {
      const matching = rows
        .filter((row) =>
          row.recommendation_goal === goal &&
          row.daily_scenario_summary.condition_tags.includes(tag)
        );
      const topWinners = topCounts(
        matching.flatMap((row) =>
          row.selected_picks
            .filter((pick) =>
              pick.slot === "lure_of_the_day" ||
              pick.slot === "fly_of_the_day"
            )
            .map((pick) => `${pick.display_name} [${pick.gear_mode}]`)
        ),
        5,
      );
      const allWinners = topCounts(
        matching.flatMap((row) =>
          row.selected_picks.map((pick) =>
            `${pick.display_name} [${pick.gear_mode}]`
          )
        ),
        5,
      );
      lines.push([
        tag,
        goal,
        topWinners.length
          ? topWinners.map(([name, count]) => `${name} (${count})`).join(", ")
          : "None",
        allWinners.length
          ? allWinners.map(([name, count]) => `${name} (${count})`).join(", ")
          : "None",
      ]);
    }
  }
  return table(lines);
}

function guideReviewRows(rows: readonly AuditRow[]): string {
  const prioritized = rows
    .slice()
    .sort((a, b) => {
      const hardA = a.flags.filter((flag) => flag.category === "hard").length;
      const hardB = b.flags.filter((flag) => flag.category === "hard").length;
      if (hardA !== hardB) return hardB - hardA;
      const warnA = a.flags.length;
      const warnB = b.flags.length;
      if (warnA !== warnB) return warnB - warnA;
      return a.scenario_id.localeCompare(b.scenario_id);
    })
    .slice(0, 32);
  const lines = [[
    "Scenario",
    "Weather",
    "Daily",
    "Picks",
    "Flags",
  ]];
  for (const row of prioritized) {
    const weather = [
      `${fmt(row.archive_weather_summary.temp_low_f)}-${
        fmt(row.archive_weather_summary.temp_high_f)
      }F`,
      `${fmt(row.archive_weather_summary.wind_daylight_avg_mph)} mph wind`,
      `${fmt(row.archive_weather_summary.cloud_daylight_avg_pct)}% cloud`,
      `${fmt(row.archive_weather_summary.precip_in)} in precip`,
    ].join(", ");
    const daily = [
      row.daily_scenario_summary.activity,
      row.daily_scenario_summary.surface_gate,
      row.daily_scenario_summary.condition_tags.join("+") || "no tags",
      row.daily_scenario_summary.confidence,
    ].join(", ");
    const picks = row.selected_picks.map((pick) =>
      `${pick.display_name} (${pick.score})`
    ).join("; ");
    const flags = row.flags.map((flag) => flag.code).join(", ") || "None";
    lines.push([
      `${row.fishery_label}<br>${row.date} ${row.water_clarity} ${row.recommendation_goal} ${row.set}`,
      weather,
      daily,
      picks,
      flags,
    ]);
  }
  return table(lines);
}

function coverageGaps(
  rows: readonly AuditRow[],
  skipped: readonly SkippedWeatherScenario[],
): string {
  const required = [
    "calm_low_light_surface",
    "calm_bright_clear_subtle",
    "breezy_windy_stained_reaction",
    "dirty_vibration",
    "cold_slow_or_front",
    "warming_search",
    "heat_limited_finesse",
    "stable_pleasant_high_confidence",
    "stable_pleasant_medium_confidence_archive",
    "river_elevated_runoff_current",
    "missing_or_low_confidence_inputs",
    "adjacent_day_similar",
    "adjacent_day_change",
  ];
  const seen = new Set(rows.flatMap((row) => row.condition_buckets));
  const adjacentSeen = adjacentCoverage(rows);
  if (adjacentSeen.similar > 0) seen.add("adjacent_day_similar");
  if (adjacentSeen.changed > 0) seen.add("adjacent_day_change");
  const gaps = required.filter((bucket) => !seen.has(bucket));
  const notes = gaps.map((bucket) =>
    `- ${bucket}: not naturally produced by completed archive rows.`
  );
  if (skipped.length > 0) {
    notes.push(
      `- ${skipped.length} archived weather scenarios skipped due to fetch or engine errors.`,
    );
  }
  return notes.length
    ? notes.join("\n")
    : "No required bucket gaps found in this run.";
}

function adjacentCoverage(
  rows: readonly AuditRow[],
): { similar: number; changed: number } {
  const baseRows = rows.filter((row) =>
    row.set === "A" && row.water_clarity === "stained" &&
    row.recommendation_goal === "all_purpose"
  );
  const byFishery = new Map<string, AuditRow[]>();
  for (const row of baseRows) {
    const group = byFishery.get(row.fishery_label) ?? [];
    group.push(row);
    byFishery.set(row.fishery_label, group);
  }
  let similar = 0;
  let changed = 0;
  for (const group of byFishery.values()) {
    const sorted = group.slice().sort((a, b) => a.date.localeCompare(b.date));
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]!;
      const cur = sorted[i]!;
      if (cur.date !== addDays(prev.date, 1)) continue;
      const prevTags = prev.daily_scenario_summary.condition_tags.join("|");
      const curTags = cur.daily_scenario_summary.condition_tags.join("|");
      const windDelta = Math.abs(
        (cur.archive_weather_summary.wind_daylight_avg_mph ?? 0) -
          (prev.archive_weather_summary.wind_daylight_avg_mph ?? 0),
      );
      const tempDelta = Math.abs(
        (cur.archive_weather_summary.temp_noon_f ?? 0) -
          (prev.archive_weather_summary.temp_noon_f ?? 0),
      );
      if (prevTags === curTags && windDelta < 4 && tempDelta < 8) similar++;
      else changed++;
    }
  }
  return { similar, changed };
}

function adjacentCoverageTable(rows: readonly AuditRow[]): string {
  const baseRows = rows.filter((row) =>
    row.set === "A" && row.water_clarity === "stained" &&
    row.recommendation_goal === "all_purpose"
  );
  const byFishery = new Map<string, AuditRow[]>();
  for (const row of baseRows) {
    const group = byFishery.get(row.fishery_label) ?? [];
    group.push(row);
    byFishery.set(row.fishery_label, group);
  }
  const lines = [["Pair", "Class", "Wind delta", "Temp delta", "Tag delta"]];
  for (const group of byFishery.values()) {
    const sorted = group.slice().sort((a, b) => a.date.localeCompare(b.date));
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]!;
      const cur = sorted[i]!;
      if (cur.date !== addDays(prev.date, 1)) continue;
      const prevTags = prev.daily_scenario_summary.condition_tags.join("|");
      const curTags = cur.daily_scenario_summary.condition_tags.join("|");
      const windDelta = Math.abs(
        (cur.archive_weather_summary.wind_daylight_avg_mph ?? 0) -
          (prev.archive_weather_summary.wind_daylight_avg_mph ?? 0),
      );
      const tempDelta = Math.abs(
        (cur.archive_weather_summary.temp_noon_f ?? 0) -
          (prev.archive_weather_summary.temp_noon_f ?? 0),
      );
      const classification =
        prevTags === curTags && windDelta < 4 && tempDelta < 8
          ? "similar"
          : "changed";
      lines.push([
        `${cur.fishery_label}<br>${prev.date} -> ${cur.date}`,
        classification,
        windDelta.toFixed(1),
        tempDelta.toFixed(1),
        `${prevTags || "none"} -> ${curTags || "none"}`,
      ]);
    }
  }
  return lines.length === 1
    ? "No adjacent-day pairs in selected rows."
    : table(lines);
}

function thermalDiagnostics(rows: readonly AuditRow[]): string {
  const modeLines = [["Month", "Region", "Thermal modes"]];
  const groups = new Map<string, AuditRow[]>();
  for (
    const row of rows.filter((r) =>
      r.set === "A" && r.water_clarity === "stained" &&
      r.recommendation_goal === "all_purpose"
    )
  ) {
    const key = `${String(row.month).padStart(2, "0")}|${row.region_key}`;
    const group = groups.get(key) ?? [];
    group.push(row);
    groups.set(key, group);
  }
  for (const [key, group] of [...groups.entries()].sort()) {
    const [monthRaw, region] = key.split("|");
    const modes = [
      ...countBy(group.map((row) => row.daily_scenario_summary.thermal_mode))
        .entries(),
    ]
      .map(([mode, count]) => `${mode}:${count}`)
      .join(", ");
    modeLines.push([monthLabel(Number(monthRaw)), region ?? "", modes]);
  }

  const hotCold = rows
    .filter((row) =>
      row.set === "A" &&
      row.water_clarity === "stained" &&
      row.recommendation_goal === "all_purpose" &&
      (row.archive_weather_summary.temp_high_f ?? 0) > 85 &&
      row.daily_scenario_summary.condition_tags.includes("cold_slow")
    )
    .slice(0, 20);
  const hotColdLines = [["Scenario", "Temp", "Thermal", "Tags"]];
  for (const row of hotCold) {
    hotColdLines.push([
      `${row.fishery_label}<br>${row.date}`,
      `${fmt(row.archive_weather_summary.temp_low_f)}-${
        fmt(row.archive_weather_summary.temp_high_f)
      }F`,
      row.daily_scenario_summary.thermal_mode,
      row.daily_scenario_summary.condition_tags.join(", "),
    ]);
  }

  const heatRows = rows
    .filter((row) =>
      row.daily_scenario_summary.condition_tags.includes("heat_finesse")
    )
    .filter((row) =>
      row.selected_picks
        .filter((pick) =>
          pick.slot === "lure_of_the_day" || pick.slot === "fly_of_the_day"
        )
        .some((pick) => !isHeatAppropriatePick(pick))
    )
    .slice(0, 20);
  const heatLines = [["Scenario", "Temp", "Top winners needing review"]];
  for (const row of heatRows) {
    const questionable = row.selected_picks
      .filter((pick) =>
        pick.slot === "lure_of_the_day" || pick.slot === "fly_of_the_day"
      )
      .filter((pick) => !isHeatAppropriatePick(pick))
      .map((pick) => `${pick.display_name} (${pick.primary_pace})`)
      .join("; ");
    heatLines.push([
      `${row.fishery_label}<br>${row.date} ${row.water_clarity} ${row.recommendation_goal} ${row.set}`,
      `${fmt(row.archive_weather_summary.temp_low_f)}-${
        fmt(row.archive_weather_summary.temp_high_f)
      }F`,
      questionable,
    ]);
  }

  return `### Thermal Modes By Month/Region

${table(modeLines)}

### Hot Days Tagged Cold Slow

${hotColdLines.length === 1 ? "None." : table(hotColdLines)}

### Heat Finesse Rows With Non-Finesse Top Winners

${heatLines.length === 1 ? "None." : table(heatLines)}`;
}

function isHeatAppropriatePick(pick: PickSnapshot): boolean {
  const text = [
    pick.family_group,
    pick.presentation_group,
    pick.display_name,
  ].join(" ").toLowerCase();
  return pick.primary_pace === "slow" ||
    pick.score_reasons.some((reason) =>
      reason.startsWith("condition_tag:heat_finesse:")
    ) ||
    text.includes("finesse") ||
    text.includes("worm") ||
    text.includes("drop") ||
    text.includes("ned") ||
    text.includes("shaky") ||
    text.includes("leech");
}

function surfaceDiagnostics(rows: readonly AuditRow[]): string {
  const topwaterRows = rows.filter((row) =>
    row.selected_picks.some((pick) => pick.is_surface)
  );
  const grouped = new Map<string, AuditRow[]>();
  for (const row of topwaterRows) {
    const key = [
      monthLabel(row.month),
      row.region_key,
      row.daily_scenario_summary.surface_gate,
      row.daily_scenario_summary.light_mode,
      row.recommendation_goal,
    ].join("|");
    const group = grouped.get(key) ?? [];
    group.push(row);
    grouped.set(key, group);
  }
  const summary = [[
    "Month",
    "Region",
    "Gate",
    "Light",
    "Goal",
    "Runs",
    "Temp range",
    "Avg wind",
  ]];
  for (const [key, group] of [...grouped.entries()].sort()) {
    const [month, region, gate, light, goal] = key.split("|");
    const lows = group.map((row) => row.archive_weather_summary.temp_low_f)
      .filter((v): v is number => v != null);
    const highs = group.map((row) => row.archive_weather_summary.temp_high_f)
      .filter((v): v is number => v != null);
    summary.push([
      month ?? "",
      region ?? "",
      gate ?? "",
      light ?? "",
      goal ?? "",
      String(group.length),
      lows.length && highs.length
        ? `${Math.min(...lows).toFixed(1)}-${Math.max(...highs).toFixed(1)}F`
        : "",
      fmt(
        round1(
          mean(
            group.map((row) =>
              row.archive_weather_summary.wind_daylight_avg_mph ?? 0
            ),
          ),
        ),
      ),
    ]);
  }

  const shoulder = topwaterRows
    .filter((row) => [1, 2, 3, 4, 10, 11, 12].includes(row.month))
    .slice(0, 30);
  const shoulderLines = [["Scenario", "Weather", "Daily", "Topwater picks"]];
  for (const row of shoulder) {
    shoulderLines.push([
      `${row.fishery_label}<br>${row.date} ${row.water_clarity} ${row.recommendation_goal} ${row.set}`,
      `${fmt(row.archive_weather_summary.temp_low_f)}-${
        fmt(row.archive_weather_summary.temp_high_f)
      }F, ${
        fmt(row.archive_weather_summary.wind_daylight_avg_mph)
      } mph, ${row.daily_scenario_summary.light_mode}`,
      `${row.daily_scenario_summary.surface_gate}, ${
        row.daily_scenario_summary.condition_tags.join("+")
      }`,
      row.selected_picks.filter((pick) => pick.is_surface).map((pick) =>
        pick.display_name
      ).join("; "),
    ]);
  }

  return `### Topwater Selection Summary

${summary.length === 1 ? "None." : table(summary)}

### Shoulder-Season Topwater Selections

${shoulderLines.length === 1 ? "None." : table(shoulderLines)}`;
}

type BroadWaterColumnBand = "surface" | "upper" | "mid" | "bottom";

function broadWaterColumnBand(
  candidate: Pick<PickSnapshot | ScoreSnapshot, "column" | "is_surface">,
): BroadWaterColumnBand {
  if (candidate.is_surface) return "surface";
  if (candidate.column === "top" || candidate.column === "upper") {
    return "upper";
  }
  if (candidate.column === "bottom") return "bottom";
  return "mid";
}

function closeColumnAlternatives(args: {
  row: AuditRow;
  side: Side;
  selected: readonly PickSnapshot[];
  predicate: (candidate: ScoreSnapshot) => boolean;
}): ScoreSnapshot[] {
  if (args.selected.length === 0) return [];
  const selectedIds = new Set(args.selected.map((pick) => pick.id));
  const floor = Math.max(...args.selected.map((pick) => pick.score)) -
    HONORABLE_QUALITY_BAND;
  return sideCandidates(args.row, args.side)
    .filter((candidate) =>
      !selectedIds.has(candidate.id) &&
      candidate.score >= floor &&
      args.predicate(candidate)
    )
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

function sideColumnDiversityStats(rows: readonly AuditRow[]): string {
  const lines = [[
    "Side",
    "Same exact column",
    "Same broad band",
    "Same broad band with close different-band alt",
  ]];
  for (const side of ["lure", "fly"] as const) {
    let sameColumn = 0;
    let sameBand = 0;
    let sameBandWithAlt = 0;
    for (const row of rows) {
      const picks = row.selected_picks.filter((pick) =>
        pick.gear_mode === side
      );
      if (picks.length !== 2) continue;
      if (picks[0]!.column === picks[1]!.column) sameColumn += 1;
      const firstBand = broadWaterColumnBand(picks[0]!);
      const secondBand = broadWaterColumnBand(picks[1]!);
      if (firstBand !== secondBand) continue;
      sameBand += 1;
      if (
        closeColumnAlternatives({
          row,
          side,
          selected: picks,
          predicate: (candidate) =>
            broadWaterColumnBand(candidate) !== firstBand,
        }).length > 0
      ) {
        sameBandWithAlt += 1;
      }
    }
    lines.push([
      side,
      String(sameColumn),
      String(sameBand),
      String(sameBandWithAlt),
    ]);
  }
  return table(lines);
}

function openSurfaceColumnPressureStats(rows: readonly AuditRow[]): string {
  const openRows = rows.filter((row) =>
    row.daily_scenario_summary.surface_gate === "open"
  );
  let twoPlusSurface = 0;
  let twoPlusSurfaceWithNonSurfaceAlt = 0;
  let threePlusSurface = 0;
  let threePlusSurfaceWithNonSurfaceAlt = 0;
  let threePlusSurfaceUpper = 0;
  let threePlusSurfaceUpperWithMidBottomAlt = 0;
  let lureSurfaceSurfaceAndFlySurfaceUpper = 0;
  let lureSurfaceSurfaceAndFlySurfaceUpperWithAlt = 0;

  for (const row of openRows) {
    const surfaceCount = row.selected_picks.filter((pick) =>
      pick.is_surface
    ).length;
    const surfaceUpperCount = row.selected_picks.filter((pick) => {
      const band = broadWaterColumnBand(pick);
      return band === "surface" || band === "upper";
    }).length;
    const hasCloseNonSurfaceAlt = (side: Side) => {
      const selected = row.selected_picks.filter((pick) =>
        pick.gear_mode === side
      );
      return closeColumnAlternatives({
        row,
        side,
        selected,
        predicate: (candidate) => !candidate.is_surface,
      }).length > 0;
    };
    const hasCloseMidBottomAlt = (side: Side) => {
      const selected = row.selected_picks.filter((pick) =>
        pick.gear_mode === side
      );
      return closeColumnAlternatives({
        row,
        side,
        selected,
        predicate: (candidate) => {
          const band = broadWaterColumnBand(candidate);
          return band === "mid" || band === "bottom";
        },
      }).length > 0;
    };

    if (surfaceCount >= 2) {
      twoPlusSurface += 1;
      if (hasCloseNonSurfaceAlt("lure") || hasCloseNonSurfaceAlt("fly")) {
        twoPlusSurfaceWithNonSurfaceAlt += 1;
      }
    }
    if (surfaceCount >= 3) {
      threePlusSurface += 1;
      if (hasCloseNonSurfaceAlt("lure") || hasCloseNonSurfaceAlt("fly")) {
        threePlusSurfaceWithNonSurfaceAlt += 1;
      }
    }
    if (surfaceUpperCount >= 3) {
      threePlusSurfaceUpper += 1;
      if (hasCloseMidBottomAlt("lure") || hasCloseMidBottomAlt("fly")) {
        threePlusSurfaceUpperWithMidBottomAlt += 1;
      }
    }

    const lurePicks = row.selected_picks.filter((pick) =>
      pick.gear_mode === "lure"
    );
    const flyPicks = row.selected_picks.filter((pick) =>
      pick.gear_mode === "fly"
    );
    const lureSurfaceSurface = lurePicks.length === 2 &&
      lurePicks.every((pick) => pick.is_surface);
    const flyHasSurface = flyPicks.some((pick) => pick.is_surface);
    const flyAllSurfaceUpper = flyPicks.length === 2 &&
      flyPicks.every((pick) => {
        const band = broadWaterColumnBand(pick);
        return band === "surface" || band === "upper";
      });
    if (lureSurfaceSurface && flyHasSurface && flyAllSurfaceUpper) {
      lureSurfaceSurfaceAndFlySurfaceUpper += 1;
      if (hasCloseNonSurfaceAlt("lure") || hasCloseMidBottomAlt("fly")) {
        lureSurfaceSurfaceAndFlySurfaceUpperWithAlt += 1;
      }
    }
  }

  return table([
    ["Metric", "Runs", "With close lower-column alt"],
    ["open-surface rows", String(openRows.length), "-"],
    [
      "open-surface rows with 2+ surface picks",
      String(twoPlusSurface),
      String(twoPlusSurfaceWithNonSurfaceAlt),
    ],
    [
      "open-surface rows with 3+ surface picks",
      String(threePlusSurface),
      String(threePlusSurfaceWithNonSurfaceAlt),
    ],
    [
      "open-surface rows with 3+ surface/upper picks (watch-only)",
      String(threePlusSurfaceUpper),
      String(threePlusSurfaceUpperWithMidBottomAlt),
    ],
    [
      "lure surface/surface plus fly surface/upper",
      String(lureSurfaceSurfaceAndFlySurfaceUpper),
      String(lureSurfaceSurfaceAndFlySurfaceUpperWithAlt),
    ],
  ]);
}

function surfaceTagGroup(row: AuditRow): string {
  const tags = row.daily_scenario_summary.condition_tags.filter((tag) =>
    tag === "low_light_surface" || tag === "calm_surface"
  );
  return tags.length > 0 ? tags.join("+") : "no_surface_tag";
}

function snapshotHasScenarioClarityReason(
  candidate: ScoreSnapshot,
  row: AuditRow,
): boolean {
  return candidate.score_reasons.some((reason) =>
    reason.startsWith(`clarity_strength:${row.water_clarity}:`)
  );
}

function credibleNonSurfaceSurfacePairAlternative(
  row: AuditRow,
  candidate: ScoreSnapshot,
): boolean {
  if (candidate.is_surface) return false;
  if (row.recommendation_goal === "all_purpose") {
    return snapshotIsReliableAllPurpose(candidate) &&
      (hasConditionReason(candidate) ||
        snapshotHasScenarioClarityReason(candidate, row) ||
        candidate.score_reasons.some((reason) =>
          reason.startsWith("daily_lane:")
        ));
  }
  return snapshotHasGoalReason(candidate, "big_fish") ||
    hasConditionReason(candidate);
}

function sameSideSurfaceSurfaceEntries(rows: readonly AuditRow[]): Array<{
  row: AuditRow;
  side: Side;
  picks: PickSnapshot[];
  rawCloseNonSurfaceAlternatives: ScoreSnapshot[];
  closeNonSurfaceAlternatives: ScoreSnapshot[];
  credibleNonSurfaceAlternatives: ScoreSnapshot[];
  setAExactRepeatAlternatives: ScoreSnapshot[];
}> {
  const entries = [];
  const rowsById = new Map(rows.map((row) => [row.scenario_id, row]));
  for (const row of rows) {
    if (row.daily_scenario_summary.surface_gate !== "open") continue;
    for (const side of ["lure", "fly"] as const) {
      const picks = row.selected_picks.filter((pick) =>
        pick.gear_mode === side
      );
      if (picks.length !== 2 || !picks.every((pick) => pick.is_surface)) {
        continue;
      }
      const rawCloseNonSurfaceAlternatives = closeColumnAlternatives({
        row,
        side,
        selected: picks,
        predicate: (candidate) => !candidate.is_surface,
      });
      const setAIds = row.set === "B"
        ? new Set(
          rowsById.get(row.scenario_id.replace(/__B$/, "__A"))
            ?.selected_picks
            .filter((pick) => pick.gear_mode === side)
            .map((pick) => pick.id) ?? [],
        )
        : new Set<string>();
      const closeNonSurfaceAlternatives = rawCloseNonSurfaceAlternatives
        .filter((candidate) => !setAIds.has(candidate.id));
      entries.push({
        row,
        side,
        picks,
        rawCloseNonSurfaceAlternatives,
        closeNonSurfaceAlternatives,
        credibleNonSurfaceAlternatives: closeNonSurfaceAlternatives.filter((
          candidate,
        ) => credibleNonSurfaceSurfacePairAlternative(row, candidate)),
        setAExactRepeatAlternatives: rawCloseNonSurfaceAlternatives.filter((
          candidate,
        ) => setAIds.has(candidate.id)),
      });
    }
  }
  return entries;
}

function sameSideSurfaceSurfaceSummary(rows: readonly AuditRow[]): string {
  const grouped = new Map<
    string,
    {
      side: Side;
      goal: Goal;
      set: DailyPicksVariant;
      region: string;
      month: number;
      clarity: WaterClarity;
      surfaceTags: string;
      count: number;
      closeAltCount: number;
      credibleAltCount: number;
    }
  >();
  for (const entry of sameSideSurfaceSurfaceEntries(rows)) {
    const key = [
      entry.side,
      entry.row.recommendation_goal,
      entry.row.set,
      entry.row.region_key,
      entry.row.month,
      entry.row.water_clarity,
      surfaceTagGroup(entry.row),
    ].join("|");
    const current = grouped.get(key) ?? {
      side: entry.side,
      goal: entry.row.recommendation_goal,
      set: entry.row.set,
      region: entry.row.region_key,
      month: entry.row.month,
      clarity: entry.row.water_clarity,
      surfaceTags: surfaceTagGroup(entry.row),
      count: 0,
      closeAltCount: 0,
      credibleAltCount: 0,
    };
    current.count += 1;
    if (entry.closeNonSurfaceAlternatives.length > 0) {
      current.closeAltCount += 1;
    }
    if (entry.credibleNonSurfaceAlternatives.length > 0) {
      current.credibleAltCount += 1;
    }
    grouped.set(key, current);
  }

  const lines = [[
    "Side",
    "Goal",
    "Set",
    "Region",
    "Month",
    "Clarity",
    "Surface tags",
    "Rows",
    "Close non-surface alt",
    "Credible non-surface alt",
  ]];
  for (
    const entry of [...grouped.values()].sort((a, b) =>
      b.count - a.count ||
      a.side.localeCompare(b.side) ||
      a.region.localeCompare(b.region) ||
      a.month - b.month ||
      a.clarity.localeCompare(b.clarity)
    ).slice(0, 40)
  ) {
    lines.push([
      entry.side,
      entry.goal,
      entry.set,
      entry.region,
      monthLabel(entry.month),
      entry.clarity,
      entry.surfaceTags,
      String(entry.count),
      String(entry.closeAltCount),
      String(entry.credibleAltCount),
    ]);
  }

  return lines.length === 1 ? "None." : table(lines);
}

function sameSideSurfaceSurfaceRemainingExamples(
  rows: readonly AuditRow[],
): string {
  const lines = [[
    "Scenario",
    "Side",
    "Selected surface pair",
    "Close non-surface alternatives",
    "Why left",
  ]];
  for (const entry of sameSideSurfaceSurfaceEntries(rows).slice(0, 20)) {
    const { row, side, picks } = entry;
    const close = entry.closeNonSurfaceAlternatives.slice(0, 3).map((
      candidate,
    ) =>
      `${candidate.display_name} (${
        broadWaterColumnBand(candidate)
      }, ${candidate.score})`
    );
    const credible = entry.credibleNonSurfaceAlternatives.slice(0, 3).map((
      candidate,
    ) =>
      `${candidate.display_name} (${
        broadWaterColumnBand(candidate)
      }, ${candidate.score})`
    );
    const why = entry.closeNonSurfaceAlternatives.length === 0 &&
        entry.setAExactRepeatAlternatives.length > 0
      ? "Close non-surface alternatives were Set A exact-ID repeats; Set B avoidance held."
      : entry.closeNonSurfaceAlternatives.length === 0
      ? "No close non-surface alternative in the audit band."
      : entry.credibleNonSurfaceAlternatives.length === 0
      ? "Close alternatives lacked clear goal or daily-condition fit."
      : isExceptionallyStrongSurfaceWindow(row)
      ? "Exceptionally strong surface window; remaining pair is guide-plausible."
      : "Credible alternative still exists; keep as watch item.";
    lines.push([
      `${row.fishery_label}<br>${row.date} ${row.water_clarity} ${row.recommendation_goal} ${row.set}`,
      side,
      picks.map((pick) => `${pick.display_name} (${pick.score})`).join("; "),
      [
        `close: ${close.join("; ") || "none"}`,
        `credible: ${credible.join("; ") || "none"}`,
      ].join("<br>"),
      why,
    ]);
  }
  return lines.length === 1 ? "None." : table(lines);
}

function openSurfaceColumnPressureExamples(rows: readonly AuditRow[]): string {
  const lines = [[
    "Scenario",
    "Daily",
    "Selected bands",
    "Close lower-column alternatives",
  ]];
  for (const row of rows) {
    if (row.daily_scenario_summary.surface_gate !== "open") continue;
    const lurePicks = row.selected_picks.filter((pick) =>
      pick.gear_mode === "lure"
    );
    const flyPicks = row.selected_picks.filter((pick) =>
      pick.gear_mode === "fly"
    );
    const lureSurfaceSurface = lurePicks.length === 2 &&
      lurePicks.every((pick) => pick.is_surface);
    const flyHasSurface = flyPicks.some((pick) => pick.is_surface);
    const flyAllSurfaceUpper = flyPicks.length === 2 &&
      flyPicks.every((pick) => {
        const band = broadWaterColumnBand(pick);
        return band === "surface" || band === "upper";
      });
    if (!lureSurfaceSurface || !flyHasSurface || !flyAllSurfaceUpper) continue;

    const lureAlts = closeColumnAlternatives({
      row,
      side: "lure",
      selected: lurePicks,
      predicate: (candidate) => !candidate.is_surface,
    }).slice(0, 3);
    const flyAlts = closeColumnAlternatives({
      row,
      side: "fly",
      selected: flyPicks,
      predicate: (candidate) => {
        const band = broadWaterColumnBand(candidate);
        return band === "mid" || band === "bottom";
      },
    }).slice(0, 3);

    lines.push([
      `${row.fishery_label}<br>${row.date} ${row.water_clarity} ${row.recommendation_goal} ${row.set}`,
      `${
        row.daily_scenario_summary.condition_tags.join("+") || "no tags"
      }; ${row.daily_scenario_summary.activity}`,
      row.selected_picks.map((pick) =>
        `${pick.display_name} (${broadWaterColumnBand(pick)}, ${pick.score})`
      ).join("; "),
      [
        `lure: ${
          lureAlts.map((candidate) =>
            `${candidate.display_name} (${
              broadWaterColumnBand(candidate)
            }, ${candidate.score})`
          ).join("; ") || "none"
        }`,
        `fly: ${
          flyAlts.map((candidate) =>
            `${candidate.display_name} (${
              broadWaterColumnBand(candidate)
            }, ${candidate.score})`
          ).join("; ") || "none"
        }`,
      ].join("<br>"),
    ]);
    if (lines.length >= 16) break;
  }

  return lines.length === 1 ? "None." : table(lines);
}

function waterColumnDiversityDiagnostics(rows: readonly AuditRow[]): string {
  return `### Same-Side Surface/Surface Summary

${sameSideSurfaceSurfaceSummary(rows)}

### Remaining Same-Side Surface/Surface Examples

${sameSideSurfaceSurfaceRemainingExamples(rows)}

### Same-Side Column/Band Summary

${sideColumnDiversityStats(rows)}

### Surface/Upper Watch Summary

${openSurfaceColumnPressureStats(rows)}

### Surface/Upper Watch Examples

${openSurfaceColumnPressureExamples(rows)}`;
}

function pikeColdOpenSurfaceDiagnostics(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  if (config.species !== "pike_musky") return "Not applicable.";
  const coldSurfaceRows = rows.filter((row) =>
    row.daily_scenario_summary.surface_gate === "open" &&
    row.selected_picks.some((pick) => pick.is_surface) &&
    isColdOpenSurfaceContext(row)
  );
  const mayColdRows = coldSurfaceRows.filter((row) => row.month === 5);
  const summary = table([
    ["Split", "Runs"],
    ["cold/open rows with surface picks", String(coldSurfaceRows.length)],
    ["May cold/open rows", String(mayColdRows.length)],
    [
      "May rows at or below 50F high",
      String(
        mayColdRows.filter((row) =>
          (row.archive_weather_summary.temp_high_f ?? 99) <= 50
        ).length,
      ),
    ],
  ]);

  const detailLines = [[
    "Scenario",
    "Weather",
    "Daily",
    "Surface picks",
  ]];
  for (const row of coldSurfaceRows.slice(0, 30)) {
    detailLines.push([
      `${row.fishery_label}<br>${row.date} ${row.water_clarity} ${row.recommendation_goal} ${row.set}`,
      `${fmt(row.archive_weather_summary.temp_low_f)}-${
        fmt(row.archive_weather_summary.temp_high_f)
      }F, noon ${fmt(row.archive_weather_summary.temp_noon_f)}F`,
      `${row.daily_scenario_summary.surface_gate}, ${
        row.daily_scenario_summary.condition_tags.join("+")
      }`,
      row.selected_picks.filter((pick) => pick.is_surface).map((pick) =>
        `${pick.display_name} (${pick.score})`
      ).join("; "),
    ]);
  }

  return `### Cold/Open Surface Summary

${summary}

### Cold/Open Surface Rows

${detailLines.length === 1 ? "None." : table(detailLines)}`;
}

function isColdOpenSurfaceContext(row: AuditRow): boolean {
  const high = row.archive_weather_summary.temp_high_f;
  const noon = row.archive_weather_summary.temp_noon_f;
  const low = row.archive_weather_summary.temp_low_f;
  return rowHasTag(row, "cold_slow") ||
    (high != null && high <= 55) ||
    (noon != null && noon <= 50) ||
    (low != null && low <= 45);
}

function pikeClearBrightDiagnostics(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  if (config.species !== "pike_musky") return "Not applicable.";
  const watchRows: Array<{
    row: AuditRow;
    pick: PickSnapshot;
    alternative: ScoreSnapshot;
    split: PikeClearBrightSplit;
  }> = [];
  const splitRows = rows
    .map((row) => ({ row, split: pikeClearBrightSplit(row) }))
    .filter((entry): entry is { row: AuditRow; split: PikeClearBrightSplit } =>
      entry.split != null
    );
  for (const { row, split } of splitRows) {
    for (const pick of row.selected_picks.filter(isLoudFlashHighRiskPick)) {
      const alternative = closeAlternativeForPick({
        row,
        pick,
        predicate: (candidate) =>
          isControlledNaturalPikeAlternative(row, candidate),
      });
      if (alternative) watchRows.push({ row, pick, alternative, split });
    }
  }

  const summaryRows = [[
    "Split",
    "Rows checked",
    "Watch picks",
    "Common selected",
    "Common alternatives",
  ]];
  for (
    const split of [
      "true_clear_calm_glare_control",
      "clear_breezy_wind_reaction",
    ] as const
  ) {
    const rowsInSplit = splitRows.filter((entry) => entry.split === split);
    const watches = watchRows.filter((entry) => entry.split === split);
    summaryRows.push([
      clearBrightSplitLabel(split),
      String(rowsInSplit.length),
      String(watches.length),
      topCounts(watches.map((entry) => entry.pick.display_name), 4)
        .map(([name, count]) => `${name} (${count})`).join(", ") || "None",
      topCounts(watches.map((entry) => entry.alternative.display_name), 4)
        .map(([name, count]) => `${name} (${count})`).join(", ") || "None",
    ]);
  }
  const detailLines = [[
    "Split",
    "Scenario",
    "Context",
    "Selected",
    "Close controlled/natural alternative",
  ]];
  for (const entry of watchRows.slice(0, 30)) {
    detailLines.push([
      clearBrightSplitLabel(entry.split),
      `${entry.row.fishery_label}<br>${entry.row.date} ${entry.row.recommendation_goal} ${entry.row.set}`,
      `${entry.row.water_clarity}, ${entry.row.daily_scenario_summary.light_mode}, ${entry.row.daily_scenario_summary.wind_mode}, gate ${entry.row.daily_scenario_summary.surface_gate}`,
      `${entry.pick.display_name} (${entry.pick.gear_mode}, ${entry.pick.score})`,
      `${entry.alternative.display_name} (${entry.alternative.score})`,
    ]);
  }

  return `### Clear/Bright Summary

${table(summaryRows)}

### Clear/Bright Watch Rows

${detailLines.length === 1 ? "None." : table(detailLines)}`;
}

type PikeClearBrightSplit =
  | "true_clear_calm_glare_control"
  | "clear_breezy_wind_reaction";

function clearBrightSplitLabel(split: PikeClearBrightSplit): string {
  return split === "true_clear_calm_glare_control"
    ? "true clear-calm/glare control"
    : "clear breezy/wind-reaction";
}

function pikeClearBrightSplit(row: AuditRow): PikeClearBrightSplit | null {
  const bright = row.daily_scenario_summary.light_mode === "bright" ||
    row.daily_scenario_summary.light_mode === "glare";
  const closedOrCaution = row.daily_scenario_summary.surface_gate ===
      "closed" ||
    row.daily_scenario_summary.surface_gate === "caution";
  if (row.water_clarity !== "clear" || !bright || !closedOrCaution) {
    return null;
  }
  if (rowHasTag(row, "dirty_vibration")) return null;

  const lowWind = row.daily_scenario_summary.wind_mode === "calm" ||
    ((row.archive_weather_summary.wind_daylight_avg_mph ?? Infinity) < 6);
  const strongWindReaction = rowHasTag(row, "wind_reaction");
  if (lowWind && !strongWindReaction) {
    return "true_clear_calm_glare_control";
  }
  if (
    strongWindReaction ||
    row.daily_scenario_summary.wind_mode === "breezy" ||
    row.daily_scenario_summary.wind_mode === "windy"
  ) {
    return "clear_breezy_wind_reaction";
  }
  return null;
}

function isLoudFlashHighRiskPick(pick: PickSnapshot): boolean {
  const profile = catalogProfileForPick(pick);
  const text = [
    pick.id,
    pick.display_name,
    pick.family_group,
    pick.presentation_group,
  ].join(" ").toLowerCase();
  return profile?.goal_tags.includes("high_risk_high_reward") === true ||
    text.includes("flash") ||
    text.includes("spinner") ||
    text.includes("spoon") ||
    text.includes("bucktail") ||
    text.includes("buzz") ||
    text.includes("topwater");
}

function isControlledNaturalPikeAlternative(
  row: AuditRow,
  candidate: ScoreSnapshot,
): boolean {
  const text = [
    candidate.id,
    candidate.display_name,
    candidate.family_group,
    candidate.presentation_group,
  ].join(" ").toLowerCase();
  const loudOrFlash = text.includes("flash") ||
    text.includes("spinner") ||
    text.includes("spoon") ||
    text.includes("bucktail") ||
    text.includes("buzz") ||
    text.includes("topwater");
  if (loudOrFlash || candidate.primary_pace === "fast") return false;

  const hasFit = snapshotHasTag(candidate, "clear_subtle") ||
    candidate.score_reasons.some((reason) =>
      reason.startsWith("condition_tag:") ||
      reason.startsWith("clarity_strength:")
    );
  if (row.recommendation_goal === "big_fish") {
    return snapshotHasGoalReason(candidate, "big_fish") && hasFit;
  }
  return snapshotHasGoalReason(candidate, "all_purpose") && hasFit;
}

type PikeHeatClassification =
  | "controlled_deeper_slower_acceptable"
  | "reckless_surface_fast_high_risk"
  | "mixed_watch";

type PikeHeatContext = "true_heat_limited" | "warm_adjacent";

function pikeHeatLimitedDiagnostics(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  if (config.species !== "pike_musky") return "Not applicable.";
  const heatRows = rows.filter(isPikeHeatLimitedContext);
  const classified = heatRows.map((row) => ({
    row,
    context: pikeHeatContext(row),
    classification: classifyPikeHeatRow(row),
  }));
  const summary = [[
    "Context",
    "Controlled/deeper/slower",
    "Reckless surface/fast/high-risk",
    "Surface pick rows",
    "Surface picks",
    "Non-surface high-risk rows",
    "Non-surface high-risk picks",
    "Mixed watch",
    "Total",
  ]];
  for (const context of ["true_heat_limited", "warm_adjacent"] as const) {
    const group = classified.filter((entry) => entry.context === context);
    summary.push([
      context,
      String(
        group.filter((entry) =>
          entry.classification === "controlled_deeper_slower_acceptable"
        ).length,
      ),
      String(
        group.filter((entry) =>
          entry.classification === "reckless_surface_fast_high_risk"
        ).length,
      ),
      String(
        group.filter((entry) => pikeHeatSurfacePicks(entry.row).length > 0)
          .length,
      ),
      String(
        group.reduce(
          (sum, entry) => sum + pikeHeatSurfacePicks(entry.row).length,
          0,
        ),
      ),
      String(
        group.filter((entry) =>
          pikeHeatNonSurfaceHighRiskPicks(entry.row).length > 0
        ).length,
      ),
      String(
        group.reduce(
          (sum, entry) =>
            sum + pikeHeatNonSurfaceHighRiskPicks(entry.row).length,
          0,
        ),
      ),
      String(
        group.filter((entry) => entry.classification === "mixed_watch")
          .length,
      ),
      String(group.length),
    ]);
  }
  const detailLines = [[
    "Context",
    "Split",
    "Scenario",
    "Weather/thermal",
    "Selected picks",
    "Heat risk split",
  ]];
  for (
    const entry of classified
      .sort((a, b) =>
        a.context.localeCompare(b.context) ||
        a.row.scenario_id.localeCompare(b.row.scenario_id)
      )
      .slice(0, 30)
  ) {
    detailLines.push([
      entry.context,
      entry.classification,
      `${entry.row.fishery_label}<br>${entry.row.date} ${entry.row.water_clarity} ${entry.row.recommendation_goal} ${entry.row.set}`,
      `${fmt(entry.row.archive_weather_summary.temp_low_f)}-${
        fmt(entry.row.archive_weather_summary.temp_high_f)
      }F, ${entry.row.daily_scenario_summary.thermal_mode}`,
      entry.row.selected_picks.map((pick) =>
        `${pick.display_name} (${pick.primary_pace}/${pick.column})`
      ).join("; "),
      [
        `surface: ${
          pikeHeatSurfacePicks(entry.row).map((pick) => pick.display_name).join(
            ", ",
          ) || "None"
        }`,
        `non-surface high-risk: ${
          pikeHeatNonSurfaceHighRiskPicks(entry.row).map((pick) =>
            pick.display_name
          ).join(", ") || "None"
        }`,
      ].join("<br>"),
    ]);
  }

  return `### Heat-Limited Pike Summary

${table(summary)}

### Heat-Limited Pike Rows

${detailLines.length === 1 ? "None." : table(detailLines)}`;
}

function pikeHeatContext(row: AuditRow): PikeHeatContext {
  return row.daily_scenario_summary.thermal_mode === "heat_limited"
    ? "true_heat_limited"
    : "warm_adjacent";
}

function isPikeHeatLimitedContext(row: AuditRow): boolean {
  const high = row.archive_weather_summary.temp_high_f;
  const noon = row.archive_weather_summary.temp_noon_f;
  return row.daily_scenario_summary.thermal_mode === "heat_limited" ||
    row.intended_buckets.some((bucket) => bucket.includes("heat")) ||
    row.condition_buckets.some((bucket) => bucket.includes("heat_limited")) ||
    (high != null && high >= 80) ||
    (noon != null && noon >= 78);
}

function classifyPikeHeatRow(row: AuditRow): PikeHeatClassification {
  if (row.selected_picks.some((pick) => isRecklessPikeHeatPick(row, pick))) {
    return "reckless_surface_fast_high_risk";
  }
  if (row.selected_picks.every((pick) => isControlledPikeHeatPick(pick))) {
    return "controlled_deeper_slower_acceptable";
  }
  return "mixed_watch";
}

function pikeHeatSurfacePicks(row: AuditRow): PickSnapshot[] {
  return row.selected_picks.filter((pick) => pick.is_surface);
}

function pikeHeatNonSurfaceHighRiskPicks(row: AuditRow): PickSnapshot[] {
  return row.selected_picks.filter((pick) => {
    if (pick.is_surface) return false;
    const profile = catalogProfileForPick(pick);
    return profile?.goal_tags.includes("high_risk_high_reward") === true;
  });
}

function isRecklessPikeHeatPick(row: AuditRow, pick: PickSnapshot): boolean {
  const profile = catalogProfileForPick(pick);
  const upsideOnlyAllPurpose = row.recommendation_goal === "all_purpose" &&
    profile?.goal_tags.includes("big_fish_upside") === true &&
    !pickHasGoalReason(pick, "all_purpose");
  return pick.is_surface ||
    pick.primary_pace === "fast" ||
    profile?.goal_tags.includes("high_risk_high_reward") === true ||
    upsideOnlyAllPurpose;
}

function isControlledPikeHeatPick(pick: PickSnapshot): boolean {
  return !pick.is_surface &&
    (pick.primary_pace === "slow" ||
      pick.secondary_pace === "slow" ||
      pick.column === "bottom" ||
      pick.column === "mid");
}

type PikeBigFishUpsideClass =
  | "controlled_upside"
  | "high_risk_or_reckless_upside"
  | "no_explicit_upside";

function pikeBigFishUpsideSplitDiagnostics(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  if (config.species !== "pike_musky") return "Not applicable.";
  const bigFishPicks = rows
    .filter((row) => row.recommendation_goal === "big_fish")
    .flatMap((row) => row.selected_picks.map((pick) => ({ row, pick })));
  const classified = bigFishPicks.map((entry) => ({
    ...entry,
    classification: classifyPikeBigFishUpside(entry.row, entry.pick),
  }));
  const summary = [[
    "Class",
    "Picks",
    "Share",
    "Common profiles",
  ]];
  for (
    const classification of [
      "controlled_upside",
      "high_risk_or_reckless_upside",
      "no_explicit_upside",
    ] as const
  ) {
    const group = classified.filter((entry) =>
      entry.classification === classification
    );
    summary.push([
      classification,
      String(group.length),
      bigFishPicks.length === 0
        ? ""
        : percent(group.length / bigFishPicks.length),
      topCounts(
        group.map((entry) =>
          `${entry.pick.display_name} [${entry.pick.gear_mode}]`
        ),
        5,
      ).map(([name, count]) => `${name} (${count})`).join(", ") || "None",
    ]);
  }

  const detailLines = [[
    "Scenario",
    "Pick",
    "Class",
    "Reasons",
  ]];
  for (
    const entry of classified
      .filter((candidate) =>
        candidate.classification === "high_risk_or_reckless_upside"
      )
      .slice(0, 30)
  ) {
    detailLines.push([
      `${entry.row.fishery_label}<br>${entry.row.date} ${entry.row.water_clarity} ${entry.row.set}`,
      `${entry.pick.display_name} (${entry.pick.gear_mode}, ${entry.pick.score})`,
      entry.classification,
      recklessPikeBigFishReasons(entry.row, entry.pick).join(", "),
    ]);
  }

  return `### Pike Big Fish Upside Split Summary

${table(summary)}

### High-Risk/Reckless Pike Big Fish Upside Rows

${detailLines.length === 1 ? "None." : table(detailLines)}`;
}

function classifyPikeBigFishUpside(
  row: AuditRow,
  pick: PickSnapshot,
): PikeBigFishUpsideClass {
  if (!pickHasGoalReason(pick, "big_fish")) return "no_explicit_upside";
  return recklessPikeBigFishReasons(row, pick).length > 0
    ? "high_risk_or_reckless_upside"
    : "controlled_upside";
}

function recklessPikeBigFishReasons(
  row: AuditRow,
  pick: PickSnapshot,
): string[] {
  const profile = catalogProfileForPick(pick);
  const reasons: string[] = [];
  if (profile?.goal_tags.includes("high_risk_high_reward") === true) {
    reasons.push("high_risk_high_reward");
  }
  if (pick.is_surface && !isStrongSurfaceWindow(row)) {
    reasons.push("surface_without_strong_window");
  }
  if (isPikeHeatLimitedContext(row) && isRecklessPikeHeatPick(row, pick)) {
    reasons.push("heat_surface_fast_or_high_risk");
  }
  if (rowHasTag(row, "cold_slow") && pick.is_surface) {
    reasons.push("cold_surface");
  }
  return reasons;
}

function setBDiagnostics(rows: readonly AuditRow[]): string {
  const cases = setBSlotCases(rows);
  const summaryLines = [["Kind", "Cause", "Lure", "Fly", "Total"]];
  const kinds: SetBSlotCase["kind"][] = [
    "exact_id",
    "same_family_same_presentation",
    "same_family_different_presentation",
  ];
  const causes: SetBOverlapCause[] = [
    "truly_avoidable",
    "unavoidable_due_score_band",
    "unavoidable_because_only_alternative_already_selected_in_set_b",
    "unavoidable_due_goal_condition_fit",
    "unavoidable_due_surface_caution_non_surface_filtering",
  ];
  for (const kind of kinds) {
    for (const cause of causes) {
      const matching = cases.filter((entry) =>
        entry.kind === kind && entry.cause === cause
      );
      if (matching.length === 0) continue;
      const lure = matching.filter((entry) => entry.side === "lure").length;
      const fly = matching.filter((entry) => entry.side === "fly").length;
      summaryLines.push([
        kind,
        cause,
        String(lure),
        String(fly),
        String(matching.length),
      ]);
    }
  }

  const exampleLines = [[
    "Scenario",
    "Issue",
    "Set A",
    "Set B",
    "Close alternative",
  ]];
  for (
    const entry of cases
      .filter((candidate) => candidate.cause === "truly_avoidable")
      .sort((a, b) =>
        (b.scoreGap ?? -99) - (a.scoreGap ?? -99) ||
        a.row.scenario_id.localeCompare(b.row.scenario_id)
      )
      .slice(0, 15)
  ) {
    const aPicks = entry.setA.selected_picks
      .filter((pick) => pick.gear_mode === entry.side)
      .map((pick) => `${pick.display_name} (${pick.score})`)
      .join("; ");
    const bPicks = entry.row.selected_picks
      .filter((pick) => pick.gear_mode === entry.side)
      .map((pick) => `${pick.display_name} (${pick.score})`)
      .join("; ");
    const alt = entry.alternative
      ? `${entry.alternative.display_name} (${entry.alternative.score}, alt edge ${entry.scoreGap})`
      : "None";
    exampleLines.push([
      `${entry.row.fishery_label}<br>${entry.row.date} ${entry.row.water_clarity} ${entry.row.recommendation_goal}`,
      `${entry.side} ${entry.slot}: ${entry.kind}`,
      aPicks,
      bPicks,
      alt,
    ]);
  }

  return `### Set B Overlap Cause Counts

${varietyPriorityNote()}

${summaryLines.length === 1 ? "None." : table(summaryLines)}

### Top True Set B Variety Examples

${exampleLines.length === 1 ? "None." : table(exampleLines)}`;
}

function bigFishNoUpsideDiagnostics(rows: readonly AuditRow[]): string {
  const byProfile = new Map<string, {
    count: number;
    alternatives: string[];
    gaps: number[];
  }>();
  for (
    const row of rows.filter((candidate) =>
      candidate.recommendation_goal === "big_fish"
    )
  ) {
    for (
      const flag of row.flags.filter((entry) =>
        entry.code === "BIG_FISH_NOT_FAVORING_UPSIDE"
      )
    ) {
      const side = flag.side;
      if (!side) continue;
      const selected = row.selected_picks.filter((pick) =>
        pick.gear_mode === side
      );
      const candidates = sideCandidates(row, side);
      const alternative = closeSnapshotAlternative({
        candidates,
        selected,
        predicate: (candidate) => snapshotHasGoalReason(candidate, "big_fish"),
      });
      for (
        const pick of selected.filter((candidate) =>
          !candidate.score_reasons.some((reason) =>
            reason.startsWith("goal:big_fish:")
          )
        )
      ) {
        const key = `${pick.display_name} [${side}]`;
        const entry = byProfile.get(key) ??
          { count: 0, alternatives: [], gaps: [] };
        entry.count++;
        if (alternative) {
          entry.alternatives.push(alternative.display_name);
          entry.gaps.push(alternative.score - pick.score);
        }
        byProfile.set(key, entry);
      }
    }
  }
  const lines = [[
    "Selected no-upside profile",
    "Count",
    "Common close upside alternatives",
    "Avg alt score edge",
  ]];
  for (
    const [profile, entry] of [...byProfile.entries()]
      .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
      .slice(0, 15)
  ) {
    lines.push([
      profile,
      String(entry.count),
      topCounts(entry.alternatives, 4).map(([name, count]) =>
        `${name} (${count})`
      ).join(", ") || "None",
      entry.gaps.length ? round1(mean(entry.gaps))?.toString() ?? "" : "",
    ]);
  }
  return lines.length === 1 ? "None." : table(lines);
}

function closeSnapshotAlternative(args: {
  candidates: readonly ScoreSnapshot[];
  selected: readonly PickSnapshot[];
  predicate: (candidate: ScoreSnapshot) => boolean;
}): ScoreSnapshot | null {
  const selectedIds = new Set(args.selected.map((pick) => pick.id));
  const floor = Math.max(...args.selected.map((pick) => pick.score)) -
    CREDIBILITY_CLOSE_SCORE_BAND;
  return bestSnapshot(
    args.candidates.filter((candidate) =>
      !selectedIds.has(candidate.id) &&
      candidate.score >= floor &&
      args.predicate(candidate)
    ),
  );
}

const GUIDE_VERDICT_RANK: Record<GuideVerdict, number> = {
  strong_fit: 0,
  acceptable_fit: 1,
  watch: 2,
  likely_miss: 3,
};

function moreSevereGuideVerdict(
  a: GuideVerdict,
  b: GuideVerdict,
): GuideVerdict {
  return GUIDE_VERDICT_RANK[a] >= GUIDE_VERDICT_RANK[b] ? a : b;
}

function lessSevereGuideVerdict(
  a: GuideVerdict,
  b: GuideVerdict,
): GuideVerdict {
  return GUIDE_VERDICT_RANK[a] <= GUIDE_VERDICT_RANK[b] ? a : b;
}

function uniqueGuideReasons(reasons: readonly GuideReason[]): GuideReason[] {
  return [...new Set(reasons)];
}

function guideAlternative(
  pick: PickSnapshot,
  alternative: ScoreSnapshot | null,
): GuideAlternative | null {
  if (!alternative) return null;
  return {
    id: alternative.id,
    display_name: alternative.display_name,
    score: alternative.score,
    score_gap: alternative.score - pick.score,
    score_reasons: alternative.score_reasons,
  };
}

function catalogProfileForPick(
  pick: PickSnapshot,
): ArchetypeProfileV4 | null {
  const map = pick.gear_mode === "lure" ? LURE_BY_ID : FLY_BY_ID;
  return (map as Map<string, ArchetypeProfileV4>).get(pick.id) ?? null;
}

function pickHasReasonPrefix(pick: PickSnapshot, prefix: string): boolean {
  return pick.score_reasons.some((reason) => reason.startsWith(prefix));
}

function pickHasGoalReason(pick: PickSnapshot, goal: Goal): boolean {
  return pickHasReasonPrefix(pick, `goal:${goal}:`);
}

function pickHasTag(pick: PickSnapshot, tag: ConditionTag): boolean {
  return pickHasReasonPrefix(pick, `condition_tag:${tag}:`);
}

function pickHasAnyConditionReason(pick: PickSnapshot): boolean {
  return pickHasReasonPrefix(pick, "condition_tag:");
}

function pickHasScenarioConditionReason(
  pick: PickSnapshot,
  row: AuditRow,
): boolean {
  return row.daily_scenario_summary.condition_tags.some((tag) =>
    pickHasTag(pick, tag)
  );
}

function pickHasCredibleCompetingConditionReason(
  pick: PickSnapshot,
  row: AuditRow,
): boolean {
  const competingTags: ConditionTag[] = [
    "open_water_search",
    "cold_slow",
    "warming_search",
    "wind_reaction",
    "dirty_vibration",
    "clear_subtle",
    "heat_finesse",
    "low_light_surface",
    "calm_surface",
    "runoff_streamer",
    "current_swing",
  ];
  return pickHasScenarioConditionReason(pick, row) ||
    competingTags.some((tag) => pickHasTag(pick, tag));
}

function closeAlternativeForPick(args: {
  row: AuditRow;
  pick: PickSnapshot;
  predicate: (candidate: ScoreSnapshot) => boolean;
  band?: number;
}): ScoreSnapshot | null {
  const selectedIds = new Set(args.row.selected_picks.map((pick) => pick.id));
  const otherSelectedSameSide = args.row.selected_picks.find((pick) =>
    pick.gear_mode === args.pick.gear_mode && pick.id !== args.pick.id
  );
  const band = args.band ?? CREDIBILITY_CLOSE_SCORE_BAND;
  const slot = args.pick.slot.includes("honorable") ? "honorable" : "top";
  const finalistIds = args.row.set === "B"
    ? new Set(
      args.row.finalist_pool_diagnostics
        .find((pool) => pool.side === args.pick.gear_mode && pool.slot === slot)
        ?.finalist_ids ?? [],
    )
    : null;
  return bestSnapshot(
    sideCandidates(args.row, args.pick.gear_mode as Side)
      .filter((candidate) =>
        !selectedIds.has(candidate.id) &&
        !(
          args.row.daily_scenario_summary.surface_gate === "caution" &&
          candidate.is_surface
        ) &&
        (finalistIds == null ||
          finalistIds.size === 0 ||
          finalistIds.has(candidate.id)) &&
        (otherSelectedSameSide == null ||
          candidate.family_group !== otherSelectedSameSide.family_group) &&
        candidate.score >= args.pick.score - band &&
        args.predicate(candidate)
      ),
  );
}

function closeAlternativeForSide(args: {
  row: AuditRow;
  side: Side;
  predicate: (candidate: ScoreSnapshot) => boolean;
}): ScoreSnapshot | null {
  return closeSnapshotAlternative({
    candidates: sideCandidates(args.row, args.side),
    selected: args.row.selected_picks.filter((pick) =>
      pick.gear_mode === args.side
    ),
    predicate: args.predicate,
  });
}

function snapshotIsReliableAllPurpose(candidate: ScoreSnapshot): boolean {
  return snapshotHasGoalReason(candidate, "all_purpose") &&
    !candidate.score_reasons.some((reason) =>
      reason.startsWith("goal:big_fish:high_risk_high_reward:")
    );
}

function pickIsHighRiskOnlyAllPurpose(pick: PickSnapshot): boolean {
  const profile = catalogProfileForPick(pick);
  return profile?.goal_tags.includes("high_risk_high_reward") === true &&
    !pickHasGoalReason(pick, "all_purpose");
}

function pickIsSurfaceRisk(pick: PickSnapshot, row: AuditRow): boolean {
  if (!pick.is_surface) return false;
  if (row.daily_scenario_summary.surface_gate === "closed") return true;
  if (row.daily_scenario_summary.surface_gate === "caution") return true;
  return !isStrongSurfaceWindow(row);
}

function isStrongSurfaceWindow(row: AuditRow): boolean {
  const tags = row.daily_scenario_summary.condition_tags;
  const warmSeason = row.month >= 5 && row.month <= 9;
  const warmDay = (row.archive_weather_summary.temp_high_f ?? 0) >= 68;
  return row.daily_scenario_summary.surface_gate === "open" &&
    (tags.includes("low_light_surface") || tags.includes("calm_surface")) &&
    (warmSeason || warmDay) &&
    !tags.includes("cold_slow");
}

function isExceptionallyStrongSurfaceWindow(row: AuditRow): boolean {
  const tags = row.daily_scenario_summary.condition_tags;
  return isStrongSurfaceWindow(row) &&
    tags.includes("low_light_surface") &&
    tags.includes("calm_surface") &&
    (row.archive_weather_summary.temp_high_f ?? 0) >= 72 &&
    (row.archive_weather_summary.wind_daylight_avg_mph ?? 99) <= 7;
}

function isHeatReactionJustified(pick: PickSnapshot, row: AuditRow): boolean {
  if (!row.daily_scenario_summary.condition_tags.includes("heat_finesse")) {
    return false;
  }
  const dirtyOrWind = row.daily_scenario_summary.condition_tags.includes(
    "dirty_vibration",
  ) ||
    row.daily_scenario_summary.condition_tags.includes("wind_reaction");
  return dirtyOrWind &&
    (row.recommendation_goal === "big_fish" ||
      pickHasGoalReason(pick, row.recommendation_goal)) &&
    (pickHasTag(pick, "dirty_vibration") || pickHasTag(pick, "wind_reaction"));
}

function pickHasPrioritySatisfied(pick: PickSnapshot, row: AuditRow): boolean {
  const tags = row.daily_scenario_summary.condition_tags;
  if (tags.includes("wind_reaction") && pickHasTag(pick, "wind_reaction")) {
    return true;
  }
  if (tags.includes("dirty_vibration") && pickHasTag(pick, "dirty_vibration")) {
    return true;
  }
  if (tags.includes("clear_subtle") && pickHasTag(pick, "clear_subtle")) {
    return true;
  }
  if (tags.includes("heat_finesse") && pickHasTag(pick, "heat_finesse")) {
    return true;
  }
  if (tags.includes("cold_slow") && pickHasTag(pick, "cold_slow")) {
    return true;
  }
  if (
    (tags.includes("low_light_surface") &&
      pickHasTag(pick, "low_light_surface")) ||
    (tags.includes("calm_surface") && pickHasTag(pick, "calm_surface"))
  ) {
    return true;
  }
  return pickHasScenarioConditionReason(pick, row);
}

function hardFlagsForPick(row: AuditRow, pick: PickSnapshot): Flag[] {
  return row.flags.filter((flag) =>
    flag.category === "hard" &&
    (flag.slot === pick.slot ||
      (flag.slot == null && flag.side === pick.gear_mode))
  );
}

function sideWarningCodes(row: AuditRow, side: Side): Set<string> {
  return new Set(
    row.flags
      .filter((flag) => flag.category === "credibility" && flag.side === side)
      .map((flag) => flag.code),
  );
}

function closeConditionAlternativeForPick(
  row: AuditRow,
  pick: PickSnapshot,
): ScoreSnapshot | null {
  const tags = row.daily_scenario_summary.condition_tags;
  const predicates: Array<(candidate: ScoreSnapshot) => boolean> = [];
  if (tags.includes("dirty_vibration")) {
    predicates.push((candidate) =>
      snapshotHasTag(candidate, "dirty_vibration") ||
      snapshotHasTag(candidate, "wind_reaction") ||
      candidate.score_reasons.some((reason) =>
        reason.startsWith("clarity_strength:dirty:") ||
        reason.startsWith("clarity_strength:stained:")
      )
    );
  }
  if (tags.includes("wind_reaction")) {
    predicates.push((candidate) => snapshotHasTag(candidate, "wind_reaction"));
  }
  if (tags.includes("clear_subtle")) {
    predicates.push((candidate) => snapshotHasTag(candidate, "clear_subtle"));
  }
  if (tags.includes("heat_finesse") && !tags.includes("dirty_vibration")) {
    predicates.push((candidate) => snapshotHasTag(candidate, "heat_finesse"));
  }
  if (tags.includes("cold_slow")) {
    predicates.push((candidate) => snapshotHasTag(candidate, "cold_slow"));
  }
  for (const predicate of predicates) {
    const alternative = closeAlternativeForPick({ row, pick, predicate });
    if (alternative) return alternative;
  }
  return null;
}

function classifyPickGuideVerdict(
  row: AuditRow,
  pick: PickSnapshot,
): PickGuideVerdict {
  const side = pick.gear_mode as Side;
  const profile = catalogProfileForPick(pick);
  const reasons: GuideReason[] = [];
  const notes: string[] = [];
  let verdict: GuideVerdict = "acceptable_fit";
  let closeAlternative: ScoreSnapshot | null = null;

  const hardFlags = hardFlagsForPick(row, pick);
  if (hardFlags.length > 0) {
    verdict = "likely_miss";
    notes.push(
      `Hard invalid: ${hardFlags.map((flag) => flag.code).join(", ")}`,
    );
  } else {
    reasons.push(
      "species_valid",
      "seasonal_row_valid",
      "water_type_valid",
      "column_pace_valid",
      "surface_gate_ok",
    );
  }

  if (row.set === "B") reasons.push("set_b_second_opinion_role");
  if (pickHasGoalReason(pick, row.recommendation_goal)) {
    reasons.push("goal_fit");
  }
  if (pickHasPrioritySatisfied(pick, row)) {
    reasons.push("condition_fit");
  }
  if (
    pick.score_reasons.some((reason) =>
      reason.startsWith(`clarity_strength:${row.water_clarity}:`)
    )
  ) {
    reasons.push("clarity_fit");
  }

  if (pick.is_surface) {
    if (isStrongSurfaceWindow(row)) {
      reasons.push("surface_window_strength");
      notes.push(
        "Surface window is open and supported by warm-season low-light/calm signals.",
      );
    } else if (row.daily_scenario_summary.surface_gate !== "closed") {
      verdict = moreSevereGuideVerdict(verdict, "watch");
      notes.push(
        "Surface pick is technically allowed but the surface window is not especially strong.",
      );
    }
  }

  const hasGoalFit = reasons.includes("goal_fit");
  const hasConditionFit = reasons.includes("condition_fit");
  const hasClarityFit = reasons.includes("clarity_fit");
  const hasCompetingCondition = pickHasCredibleCompetingConditionReason(
    pick,
    row,
  );
  if (hardFlags.length === 0) {
    if (hasGoalFit && hasConditionFit) verdict = "strong_fit";
    else if (hasGoalFit || hasConditionFit || hasClarityFit) {
      verdict = lessSevereGuideVerdict(verdict, "acceptable_fit");
    } else {
      verdict = moreSevereGuideVerdict(verdict, "watch");
      notes.push(
        "Pick lacks active goal, priority condition, and clarity score reasons.",
      );
    }
  }

  if (pickIsHighRiskOnlyAllPurpose(pick)) {
    const reliableAlternative = closeAlternativeForPick({
      row,
      pick,
      predicate: snapshotIsReliableAllPurpose,
    });
    if (reliableAlternative) {
      closeAlternative = reliableAlternative;
      reasons.push("close_better_alternative_available");
      if (isStrongSurfaceWindow(row) && pick.is_surface) {
        verdict = moreSevereGuideVerdict(verdict, "watch");
        notes.push(
          "High-risk all-purpose surface pick is defensible in this surface window, but reliable alternatives are close.",
        );
      } else {
        verdict = moreSevereGuideVerdict(verdict, "watch");
        notes.push(
          "High-risk-only all-purpose profile has a close reliable/versatile alternative.",
        );
      }
    }
  }

  if (
    row.daily_scenario_summary.condition_tags.includes("heat_finesse") &&
    pick.primary_pace === "fast"
  ) {
    const heatAlternative = closeAlternativeForPick({
      row,
      pick,
      predicate: (candidate) => snapshotHasTag(candidate, "heat_finesse"),
    });
    if (heatAlternative && !closeAlternative) {
      closeAlternative = heatAlternative;
    }
    if (isHeatReactionJustified(pick, row)) {
      verdict = moreSevereGuideVerdict(verdict, "watch");
      notes.push(
        "Fast heat-limited pick is moderated by dirty/windy Big Fish reaction justification.",
      );
    } else {
      verdict = moreSevereGuideVerdict(verdict, "likely_miss");
      reasons.push("close_better_alternative_available");
      notes.push(
        "Fast heat-limited pick lacks enough competing condition or goal justification.",
      );
    }
  }

  if (
    row.recommendation_goal === "big_fish" &&
    !pickHasGoalReason(pick, "big_fish")
  ) {
    const upsideAlternative = closeAlternativeForPick({
      row,
      pick,
      predicate: (candidate) => snapshotHasGoalReason(candidate, "big_fish"),
    });
    if (upsideAlternative) {
      closeAlternative = closeAlternative ?? upsideAlternative;
      reasons.push("close_better_alternative_available");
      if (hasCompetingCondition) {
        verdict = moreSevereGuideVerdict(verdict, "watch");
        notes.push(
          "Big Fish pick lacks explicit upside, but has credible competing condition fit.",
        );
      } else {
        verdict = moreSevereGuideVerdict(verdict, "likely_miss");
        notes.push(
          "Big Fish pick lacks explicit upside while a close upside alternative exists.",
        );
      }
    }
  }

  const conditionAlternative = closeConditionAlternativeForPick(row, pick);
  if (
    conditionAlternative &&
    !hasConditionFit &&
    !isHeatReactionJustified(pick, row)
  ) {
    closeAlternative = closeAlternative ?? conditionAlternative;
    reasons.push("close_better_alternative_available");
    if (hasCompetingCondition || hasGoalFit) {
      verdict = moreSevereGuideVerdict(verdict, "watch");
      notes.push(
        "Close priority-condition alternative exists, but selected pick has competing condition or goal justification.",
      );
    } else {
      verdict = moreSevereGuideVerdict(verdict, "likely_miss");
      notes.push(
        "Close priority-condition alternative exists and selected pick lacks competing justification.",
      );
    }
  }

  if (row.set === "B" && verdict === "watch") {
    notes.push(
      "Set B can serve as a second opinion when exact-ID avoidance or variety pressure is in play.",
    );
  }

  const warningCodes = sideWarningCodes(row, side);
  if (
    warningCodes.size > 0 &&
    verdict === "acceptable_fit" &&
    !hasGoalFit &&
    !hasConditionFit
  ) {
    verdict = "watch";
    notes.push(`Side-level warning context: ${[...warningCodes].join(", ")}.`);
  }

  if (verdict === "strong_fit") {
    notes.unshift(
      "Selected pick has active goal plus priority daily-condition fit.",
    );
  }

  if (pickIsSurfaceRisk(pick, row) && verdict === "strong_fit") {
    verdict = "acceptable_fit";
  }

  if (profile == null) {
    verdict = "likely_miss";
    notes.push("Catalog profile was not found for selected ID.");
  }

  return {
    slot: pick.slot,
    side,
    id: pick.id,
    display_name: pick.display_name,
    verdict,
    reasons: uniqueGuideReasons(reasons),
    notes: [...new Set(notes)],
    close_better_alternative: guideAlternative(pick, closeAlternative),
  };
}

function classifySideGuideVerdict(
  row: AuditRow,
  side: Side,
  pickVerdicts: readonly PickGuideVerdict[],
): SideGuideVerdict {
  const selected = row.selected_picks.filter((pick) => pick.gear_mode === side);
  const sidePickVerdicts = pickVerdicts.filter((pick) => pick.side === side);
  const reasons: GuideReason[] = sidePickVerdicts.flatMap((pick) =>
    pick.reasons
  );
  const notes: string[] = [];
  let verdict = sidePickVerdicts.reduce<GuideVerdict>(
    (current, pick) => moreSevereGuideVerdict(current, pick.verdict),
    "strong_fit",
  );
  let closeAlternative: ScoreSnapshot | null = null;

  if (row.recommendation_goal === "all_purpose") {
    const riskyPicks = selected.filter((pick) =>
      pickIsHighRiskOnlyAllPurpose(pick) || pickIsSurfaceRisk(pick, row)
    );
    const reliableAlternative = closeAlternativeForSide({
      row,
      side,
      predicate: snapshotIsReliableAllPurpose,
    });
    if (riskyPicks.length === selected.length && reliableAlternative) {
      closeAlternative = reliableAlternative;
      reasons.push("risk_balance", "close_better_alternative_available");
      if (isStrongSurfaceWindow(row)) {
        verdict = moreSevereGuideVerdict(verdict, "watch");
        notes.push(
          "Both all-purpose picks are riskier profiles, but the surface/low-light window is credible.",
        );
      } else {
        verdict = moreSevereGuideVerdict(verdict, "likely_miss");
        notes.push(
          "Both all-purpose picks on this side are riskier while close reliable alternatives exist.",
        );
      }
    }
  }

  if (row.recommendation_goal === "big_fish") {
    const hasUpside = selected.some((pick) =>
      pickHasGoalReason(pick, "big_fish")
    );
    const hasCompetingCondition = selected.some((pick) =>
      pickHasCredibleCompetingConditionReason(pick, row)
    );
    const upsideAlternative = closeAlternativeForSide({
      row,
      side,
      predicate: (candidate) => snapshotHasGoalReason(candidate, "big_fish"),
    });
    if (!hasUpside && upsideAlternative) {
      closeAlternative = upsideAlternative;
      reasons.push("close_better_alternative_available");
      if (hasCompetingCondition) {
        verdict = moreSevereGuideVerdict(verdict, "watch");
        notes.push(
          "Side lacks explicit Big Fish upside, but selected pair has credible condition fit.",
        );
      } else {
        verdict = moreSevereGuideVerdict(verdict, "likely_miss");
        notes.push(
          "Side lacks explicit Big Fish upside and close upside alternatives exist.",
        );
      }
    }
  }

  for (
    const flag of row.flags.filter((entry) =>
      entry.category === "credibility" && entry.side === side
    )
  ) {
    const selectedHasCompetingFit = selected.some((pick) =>
      pickHasCredibleCompetingConditionReason(pick, row) ||
      pickHasGoalReason(pick, row.recommendation_goal)
    );
    if (selectedHasCompetingFit) {
      verdict = moreSevereGuideVerdict(verdict, "watch");
      notes.push(
        `${flag.code} remains a watch item because selected picks have competing fit.`,
      );
    }
  }

  return {
    side,
    verdict,
    reasons: uniqueGuideReasons(reasons),
    notes: [...new Set(notes)],
    close_better_alternative: guideAlternative(
      selected[0] ?? row.selected_picks[0]!,
      closeAlternative,
    ),
  };
}

function addGuideVerdicts(rows: AuditRow[]): void {
  for (const row of rows) {
    const pickVerdicts = row.selected_picks.map((pick) =>
      classifyPickGuideVerdict(row, pick)
    );
    const sideVerdicts = (["lure", "fly"] as const).map((side) =>
      classifySideGuideVerdict(row, side, pickVerdicts)
    );
    let verdict = [
      ...pickVerdicts.map((pick) => pick.verdict),
      ...sideVerdicts.map((side) => side.verdict),
    ].reduce<GuideVerdict>(
      (current, next) => moreSevereGuideVerdict(current, next),
      "strong_fit",
    );
    const reasons = uniqueGuideReasons([
      ...pickVerdicts.flatMap((pick) => pick.reasons),
      ...sideVerdicts.flatMap((side) => side.reasons),
    ]);
    const notes: string[] = [
      ...pickVerdicts.flatMap((pick) =>
        pick.notes.map((note) => `${pick.slot}: ${note}`)
      ),
      ...sideVerdicts.flatMap((side) =>
        side.notes.map((note) => `${side.side}: ${note}`)
      ),
    ];
    const surfacePickCount = row.selected_picks.filter((pick) =>
      pick.is_surface
    ).length;
    if (
      row.recommendation_goal === "all_purpose" &&
      surfacePickCount === 4 &&
      !isExceptionallyStrongSurfaceWindow(row)
    ) {
      verdict = moreSevereGuideVerdict(verdict, "watch");
      reasons.push("risk_balance", "surface_window_strength");
      notes.push(
        "Scenario-level watch: all-purpose returned 4/4 surface picks outside an exceptionally strong surface window.",
      );
    }
    if (
      row.recommendation_goal === "all_purpose" &&
      surfacePickCount === 4 &&
      isExceptionallyStrongSurfaceWindow(row) &&
      !row.selected_picks.some((pick) => pickHasGoalReason(pick, "all_purpose"))
    ) {
      verdict = moreSevereGuideVerdict(verdict, "watch");
      notes.push(
        "Scenario-level watch: 4/4 all-purpose surface picks lack active all-purpose score reasons.",
      );
    }
    row.guide_verdict = {
      verdict,
      reasons: uniqueGuideReasons(reasons),
      notes: [...new Set(notes)],
      side_verdicts: sideVerdicts,
      pick_verdicts: pickVerdicts,
    };
  }
}

function conditionWarningDiagnostics(rows: readonly AuditRow[]): string {
  const lines = [[
    "Scenario",
    "Warning",
    "Selected side",
    "Close fit alternative",
    "Likely selector pressure",
  ]];
  const warningPredicates: Record<
    string,
    (candidate: ScoreSnapshot) => boolean
  > = {
    WIND_NOT_ELEVATING_REACTION: (candidate) =>
      snapshotHasTag(candidate, "wind_reaction"),
    CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: (candidate) =>
      snapshotHasTag(candidate, "clear_subtle"),
    DIRTY_WIND_NOT_ELEVATING_VIBRATION: (candidate) =>
      snapshotHasTag(candidate, "dirty_vibration") ||
      snapshotHasTag(candidate, "wind_reaction") ||
      candidate.score_reasons.some((reason) =>
        reason.startsWith("clarity_strength:dirty:") ||
        reason.startsWith("clarity_strength:stained:")
      ),
  };
  for (const row of rows) {
    for (
      const flag of row.flags.filter((entry) => entry.code in warningPredicates)
    ) {
      const side = flag.side;
      if (!side) continue;
      const selected = row.selected_picks.filter((pick) =>
        pick.gear_mode === side
      );
      const alternative = closeSnapshotAlternative({
        candidates: sideCandidates(row, side),
        selected,
        predicate: warningPredicates[flag.code]!,
      });
      const selectedText = selected.map((pick) =>
        `${pick.display_name} (${pick.score}; ${
          pick.score_reasons.filter((reason) =>
            reason.startsWith("goal:") || reason.startsWith("condition_tag:")
          ).join(", ") || "base/context"
        })`
      ).join("; ");
      const pressure = selected.some((pick) =>
          pick.score_reasons.some((reason) =>
            reason.startsWith(`goal:${row.recommendation_goal}:`)
          )
        )
        ? "goal fit likely competed"
        : selected.some((pick) =>
            pick.score_reasons.some((reason) =>
              reason.startsWith("condition_tag:")
            )
          )
        ? "other condition fit likely competed"
        : row.set === "B"
        ? "Set B novelty/avoidance may have competed"
        : "score/context fit likely competed";
      lines.push([
        `${row.fishery_label}<br>${row.date} ${row.water_clarity} ${row.recommendation_goal} ${row.set}`,
        `${flag.code} (${side})`,
        selectedText,
        alternative
          ? `${alternative.display_name} (${alternative.score}, alt edge ${
            alternative.score -
            Math.max(...selected.map((pick) =>
              pick.score
            ))
          })`
          : "None found in close band",
        pressure,
      ]);
      if (lines.length >= 26) return table(lines);
    }
  }
  return lines.length === 1 ? "None." : table(lines);
}

function goalContrastDiagnostics(rows: readonly AuditRow[]): string {
  const groups = new Map<string, AuditRow[]>();
  for (const row of rows) {
    const key = [
      row.weather_scenario_id,
      row.water_type,
      row.water_clarity,
      row.set,
    ].join("|");
    const group = groups.get(key) ?? [];
    group.push(row);
    groups.set(key, group);
  }
  const contrastLines = [[
    "Scenario",
    "Set",
    "Overlap",
    "All-purpose",
    "Big-fish",
  ]];
  for (const group of groups.values()) {
    const ap = group.find((row) => row.recommendation_goal === "all_purpose");
    const bf = group.find((row) => row.recommendation_goal === "big_fish");
    if (!ap || !bf) continue;
    const apIds = ap.selected_picks.map((pick) => pick.id);
    const bfIds = bf.selected_picks.map((pick) => pick.id);
    const overlap = bfIds.filter((id) => apIds.includes(id)).length;
    if (overlap < 3) continue;
    contrastLines.push([
      `${ap.fishery_label}<br>${ap.date} ${ap.water_clarity}`,
      ap.set,
      `${overlap}/4`,
      ap.selected_picks.map((pick) => pick.display_name).join("; "),
      bf.selected_picks.map((pick) => pick.display_name).join("; "),
    ]);
    if (contrastLines.length >= 22) break;
  }

  const noReasonLines = [["Scenario", "Side", "Selected"]];
  for (const row of rows.filter((r) => r.recommendation_goal === "big_fish")) {
    for (const side of ["lure", "fly"] as const) {
      const picks = row.selected_picks.filter((pick) =>
        pick.gear_mode === side
      );
      if (
        picks.length > 0 &&
        picks.every((pick) =>
          !pick.score_reasons.some((reason) =>
            reason.startsWith("goal:big_fish:")
          )
        )
      ) {
        noReasonLines.push([
          `${row.fishery_label}<br>${row.date} ${row.water_clarity} ${row.set}`,
          side,
          picks.map((pick) => pick.display_name).join("; "),
        ]);
      }
      if (noReasonLines.length >= 32) break;
    }
    if (noReasonLines.length >= 32) break;
  }

  return `### All-Purpose vs Big-Fish Near-Identical Picks

${contrastLines.length === 1 ? "None." : table(contrastLines)}

### Big-Fish Sides With No Explicit Big-Fish Score Reason

${noReasonLines.length === 1 ? "None." : table(noReasonLines)}`;
}

function guideVerdictSummary(rows: readonly AuditRow[]): string {
  const exactCounts = new Map<GuideVerdict, number>();
  for (const row of rows) {
    for (const pick of row.guide_verdict?.pick_verdicts ?? []) {
      exactCounts.set(pick.verdict, (exactCounts.get(pick.verdict) ?? 0) + 1);
    }
  }
  const exact = table([
    ["Exact pick verdict", "Pick count"],
    ...(["likely_miss", "watch", "acceptable_fit", "strong_fit"] as const)
      .map((verdict) => [verdict, String(exactCounts.get(verdict) ?? 0)]),
  ]);

  const lines = [[
    "Verdict",
    "Goal",
    "Set",
    "Side",
    "Condition bucket",
    "Pick count",
  ]];
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const pick of row.guide_verdict?.pick_verdicts ?? []) {
      for (const bucket of row.condition_buckets) {
        const key = [
          pick.verdict,
          row.recommendation_goal,
          row.set,
          pick.side,
          bucket,
        ].join("|");
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }
  for (
    const [key, count] of [...counts.entries()].sort((a, b) =>
      GUIDE_VERDICT_RANK[b[0].split("|")[0] as GuideVerdict] -
        GUIDE_VERDICT_RANK[a[0].split("|")[0] as GuideVerdict] ||
      b[1] - a[1] ||
      a[0].localeCompare(b[0])
    ).slice(0, 80)
  ) {
    const [verdict, goal, set, side, bucket] = key.split("|");
    lines.push([
      verdict ?? "",
      goal ?? "",
      set ?? "",
      side ?? "",
      bucket ?? "",
      String(count),
    ]);
  }
  return `${exact}

### Bucketed Pick Verdict Counts

${lines.length === 1 ? "None." : table(lines)}`;
}

function recalibratedAllPurposeRiskSummary(rows: readonly AuditRow[]): string {
  const oldWarningCount = rows.reduce(
    (sum, row) =>
      sum +
      row.flags.filter((flag) =>
        flag.code === "ALL_PURPOSE_OVER_SELECTING_HIGH_RISK"
      ).length,
    0,
  );
  const apRows = rows.filter((row) =>
    row.recommendation_goal === "all_purpose"
  );
  const pickVerdicts = apRows.flatMap((row) =>
    row.guide_verdict?.pick_verdicts.map((pick) => ({ row, pick })) ?? []
  );
  const riskyVerdicts = pickVerdicts.filter(({ pick }) =>
    pick.reasons.includes("risk_balance") ||
    pick.notes.some((note) => note.toLowerCase().includes("risk"))
  );
  const likelyMiss = riskyVerdicts.filter(({ pick }) =>
    pick.verdict === "likely_miss"
  );
  const watch = riskyVerdicts.filter(({ pick }) => pick.verdict === "watch");
  const surfaceFourRows = apRows.filter((row) =>
    row.selected_picks.every((pick) => pick.is_surface)
  );
  return table([
    ["Metric", "Count"],
    [
      "Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings",
      String(oldWarningCount),
    ],
    ["Risk-balance likely_miss picks", String(likelyMiss.length)],
    ["Risk-balance watch picks", String(watch.length)],
    ["All-purpose rows with 4/4 surface picks", String(surfaceFourRows.length)],
    [
      "4/4 surface rows with row-level watch/likely_miss",
      String(
        surfaceFourRows.filter((row) =>
          row.guide_verdict?.verdict === "watch" ||
          row.guide_verdict?.verdict === "likely_miss"
        ).length,
      ),
    ],
  ]);
}

function topLikelyMisses(rows: readonly AuditRow[]): string {
  const entries = rows.flatMap((row) =>
    (row.guide_verdict?.pick_verdicts ?? [])
      .filter((pick) => pick.verdict === "likely_miss")
      .map((pick) => ({ row, pick }))
  ).sort((a, b) =>
    (b.pick.close_better_alternative?.score_gap ?? -99) -
      (a.pick.close_better_alternative?.score_gap ?? -99) ||
    a.row.scenario_id.localeCompare(b.row.scenario_id)
  ).slice(0, 20);
  if (entries.length === 0) return "None.";
  const lines = [[
    "Scenario",
    "Pick",
    "Daily context",
    "Close better alternative",
    "Guide reason",
  ]];
  for (const { row, pick } of entries) {
    const alt = pick.close_better_alternative
      ? `${pick.close_better_alternative.display_name} (${pick.close_better_alternative.score}, gap ${pick.close_better_alternative.score_gap})`
      : "None captured";
    lines.push([
      `${row.fishery_label}<br>${row.date} ${row.water_clarity} ${row.recommendation_goal} ${row.set}`,
      `${pick.display_name} (${pick.slot}, ${pick.side}, ${row.month}/${row.region_key})`,
      `${
        row.daily_scenario_summary.condition_tags.join("+") || "no tags"
      }; ${row.daily_scenario_summary.surface_gate}; ${row.daily_scenario_summary.activity}`,
      alt,
      pick.notes.slice(0, 2).join("<br>") || pick.reasons.join(", "),
    ]);
  }
  return table(lines);
}

function topStrongHits(rows: readonly AuditRow[]): string {
  const entries = rows.flatMap((row) =>
    (row.guide_verdict?.pick_verdicts ?? [])
      .filter((pick) => pick.verdict === "strong_fit")
      .map((pick) => ({ row, pick }))
  ).sort((a, b) =>
    b.row.daily_scenario_summary.condition_tags.length -
      a.row.daily_scenario_summary.condition_tags.length ||
    b.row.selected_picks.find((pick) => pick.id === b.pick.id)!.score -
      a.row.selected_picks.find((pick) => pick.id === a.pick.id)!.score ||
    a.row.scenario_id.localeCompare(b.row.scenario_id)
  );
  const seen = new Set<string>();
  const selected: typeof entries = [];
  for (const entry of entries) {
    const diversityKey = [
      entry.row.month,
      entry.row.region_key,
      entry.row.condition_buckets[0] ?? "none",
      entry.pick.side,
    ].join("|");
    if (seen.has(diversityKey) && selected.length < 12) continue;
    seen.add(diversityKey);
    selected.push(entry);
    if (selected.length >= 20) break;
  }
  if (selected.length === 0) return "None.";
  const lines = [["Scenario", "Pick", "Why it is a strong hit"]];
  for (const { row, pick } of selected) {
    lines.push([
      `${row.fishery_label}<br>${row.date} ${row.water_clarity} ${row.recommendation_goal} ${row.set}`,
      `${pick.display_name} (${pick.slot}, ${pick.side}, score ${
        row.selected_picks.find((candidate) => candidate.id === pick.id)?.score
      })`,
      [
        pick.reasons.join(", "),
        row.daily_scenario_summary.condition_tags.join("+") || "no tags",
        pick.notes[0] ?? "",
      ].filter(Boolean).join("<br>"),
    ]);
  }
  return table(lines);
}

function troutDirtyCurrentSatisfied(pick: PickSnapshot): boolean {
  return pickHasTag(pick, "dirty_vibration") ||
    pickHasTag(pick, "wind_reaction") ||
    pickHasTag(pick, "runoff_streamer") ||
    pickHasTag(pick, "current_swing") ||
    pickHasTag(pick, "open_water_search") ||
    pick.score_reasons.some((reason) =>
      reason.startsWith("clarity_strength:dirty:") ||
      reason.startsWith("clarity_strength:stained:")
    );
}

function conditionSatisfactionRates(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  const lines = [["Signal", "Opportunities", "Satisfied", "Rate"]];
  const rate = (satisfied: number, opportunities: number): string =>
    opportunities === 0
      ? ""
      : `${Math.round(satisfied / opportunities * 100)}%`;
  const tags: ConditionTag[] = [
    "wind_reaction",
    "clear_subtle",
    "dirty_vibration",
    "heat_finesse",
    "cold_slow",
    "low_light_surface",
    "calm_surface",
  ];
  for (const tag of tags) {
    const picks = rows
      .filter((row) => row.daily_scenario_summary.condition_tags.includes(tag))
      .flatMap((row) => row.selected_picks);
    const satisfied = picks.filter((pick) => pickHasTag(pick, tag)).length;
    lines.push([
      tag,
      String(picks.length),
      String(satisfied),
      rate(satisfied, picks.length),
    ]);
  }
  if (config.output_key === "trout") {
    const dirtyCurrentPicks = rows
      .filter((row) =>
        row.daily_scenario_summary.condition_tags.includes(
          "dirty_vibration",
        ) ||
        row.daily_scenario_summary.condition_tags.includes(
          "runoff_streamer",
        ) ||
        row.daily_scenario_summary.condition_tags.includes("current_swing")
      )
      .flatMap((row) => row.selected_picks);
    const dirtyCurrentSatisfied = dirtyCurrentPicks.filter(
      troutDirtyCurrentSatisfied,
    ).length;
    lines.push([
      "Trout dirty/runoff/current fit",
      String(dirtyCurrentPicks.length),
      String(dirtyCurrentSatisfied),
      rate(dirtyCurrentSatisfied, dirtyCurrentPicks.length),
    ]);
  }
  const bigFishPicks = rows
    .filter((row) => row.recommendation_goal === "big_fish")
    .flatMap((row) => row.selected_picks);
  const bigFishSatisfied =
    bigFishPicks.filter((pick) => pickHasGoalReason(pick, "big_fish")).length;
  lines.push([
    "Big Fish upside",
    String(bigFishPicks.length),
    String(bigFishSatisfied),
    rate(bigFishSatisfied, bigFishPicks.length),
  ]);
  const allPurposePicks = rows
    .filter((row) => row.recommendation_goal === "all_purpose")
    .flatMap((row) => row.selected_picks);
  const allPurposeSatisfied =
    allPurposePicks.filter((pick) => pickHasGoalReason(pick, "all_purpose"))
      .length;
  lines.push([
    "All Purpose reliable/versatile",
    String(allPurposePicks.length),
    String(allPurposeSatisfied),
    rate(allPurposeSatisfied, allPurposePicks.length),
  ]);
  return table(lines);
}

const UTILIZATION_LOW_OPPORTUNITY_MIN = 100;
const UTILIZATION_LOW_SELECTED_MAX = 3;
const UTILIZATION_LOW_RATE = 0.01;
const UTILIZATION_OVER_SELECTED_MIN = 40;
const UTILIZATION_OVER_RATE = 0.25;
const UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE = 0.20;
const SIGNATURE_HOME_WATCH_RATE = 0.20;
const SIGNATURE_HOME_OVER_RATE = 0.25;
const SIGNATURE_HOME_SEVERE_RATE = 0.30;
const SIGNATURE_HOME_GUARDRAIL_MIN = 80;
const UTILIZATION_CLOSE_SCORE_GAP = 12;
const UTILIZATION_FAR_SCORE_GAP = 24;

type ProfileUtilization = {
  id: string;
  display_name: string;
  gear_mode: Side;
  family_group: string;
  presentation_group: string;
  opportunities: number;
  selected: number;
  close_opportunities: number;
  far_behind_opportunities: number;
  availability_contexts: Map<string, number>;
  available_condition_tags: Map<string, number>;
  competing_winners: Map<string, number>;
  selected_goal_counts: Map<string, number>;
  selected_set_counts: Map<string, number>;
  selected_slot_counts: Map<string, number>;
  selected_clarity_counts: Map<string, number>;
  selected_water_type_counts: Map<string, number>;
  selected_condition_tags: Map<string, number>;
};

function incrementMap(map: Map<string, number>, key: string, amount = 1): void {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function incrementTags(
  map: Map<string, number>,
  tags: readonly string[],
): void {
  if (tags.length === 0) {
    incrementMap(map, "none");
    return;
  }
  for (const tag of tags) incrementMap(map, tag);
}

function compactCounts(
  counts: ReadonlyMap<string, number>,
  limit = 4,
): string {
  const entries = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
  return entries.length
    ? entries.map(([key, count]) => `${key}:${count}`).join(", ")
    : "";
}

function percent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

function selectedSlotKind(slot: string): "top" | "honorable" {
  return slot.includes("honorable") ? "honorable" : "top";
}

function utilizationKey(side: Side, id: string): string {
  return `${side}:${id}`;
}

function ensureUtilization(
  profiles: Map<string, ProfileUtilization>,
  side: Side,
  profile: ScoreSnapshot | PickSnapshot,
): ProfileUtilization {
  const key = utilizationKey(side, profile.id);
  const existing = profiles.get(key);
  if (existing) return existing;
  const created: ProfileUtilization = {
    id: profile.id,
    display_name: profile.display_name,
    gear_mode: side,
    family_group: profile.family_group,
    presentation_group: profile.presentation_group,
    opportunities: 0,
    selected: 0,
    close_opportunities: 0,
    far_behind_opportunities: 0,
    availability_contexts: new Map(),
    available_condition_tags: new Map(),
    competing_winners: new Map(),
    selected_goal_counts: new Map(),
    selected_set_counts: new Map(),
    selected_slot_counts: new Map(),
    selected_clarity_counts: new Map(),
    selected_water_type_counts: new Map(),
    selected_condition_tags: new Map(),
  };
  profiles.set(key, created);
  return created;
}

function profileUtilization(rows: readonly AuditRow[]): ProfileUtilization[] {
  const profiles = new Map<string, ProfileUtilization>();
  for (const row of rows) {
    for (const side of ["lure", "fly"] as const) {
      const candidates = sideCandidates(row, side);
      const selected = row.selected_picks.filter((pick) =>
        pick.gear_mode === side
      );
      const bestSelectedScore = Math.max(
        ...selected.map((pick) => pick.score),
      );
      const winnerLabel = selected.map((pick) =>
        `${pick.display_name} (${selectedSlotKind(pick.slot)})`
      ).join(", ");
      for (const candidate of candidates) {
        const entry = ensureUtilization(profiles, side, candidate);
        entry.opportunities += 1;
        const scoreGap = bestSelectedScore - candidate.score;
        if (scoreGap <= UTILIZATION_CLOSE_SCORE_GAP) {
          entry.close_opportunities += 1;
        }
        if (scoreGap >= UTILIZATION_FAR_SCORE_GAP) {
          entry.far_behind_opportunities += 1;
        }
        const availabilityContext = [
          row.recommendation_goal,
          row.water_clarity,
          row.water_type,
          row.condition_buckets[0] ?? "uncategorized",
        ].join(" / ");
        incrementMap(entry.availability_contexts, availabilityContext);
        incrementTags(
          entry.available_condition_tags,
          row.daily_scenario_summary.condition_tags,
        );
        incrementMap(entry.competing_winners, winnerLabel);
      }
    }
    for (const pick of row.selected_picks) {
      const side = pick.gear_mode === "fly" ? "fly" : "lure";
      const entry = ensureUtilization(profiles, side, pick);
      entry.selected += 1;
      incrementMap(entry.selected_goal_counts, row.recommendation_goal);
      incrementMap(entry.selected_set_counts, row.set);
      incrementMap(entry.selected_slot_counts, selectedSlotKind(pick.slot));
      incrementMap(entry.selected_clarity_counts, row.water_clarity);
      incrementMap(entry.selected_water_type_counts, row.water_type);
      incrementTags(
        entry.selected_condition_tags,
        row.daily_scenario_summary.condition_tags,
      );
    }
  }
  return [...profiles.values()].sort((a, b) =>
    a.gear_mode.localeCompare(b.gear_mode) ||
    b.opportunities - a.opportunities ||
    a.display_name.localeCompare(b.display_name)
  );
}

function utilizationRate(profile: ProfileUtilization): number {
  return profile.opportunities === 0
    ? 0
    : profile.selected / profile.opportunities;
}

function actualSlotShareMetrics(
  profile: ProfileUtilization,
  rows: readonly AuditRow[],
): {
  combinedShare: number;
  topShare: number;
  honorableShare: number;
  sideShare: number;
  totalSlots: number;
  totalTopSlots: number;
  totalHonorableSlots: number;
  totalSideSlots: number;
} {
  const totalSlots = rows.length * 4;
  const totalTopSlots = rows.length * 2;
  const totalHonorableSlots = rows.length * 2;
  const totalSideSlots = rows.length * 2;
  const top = profile.selected_slot_counts.get("top") ?? 0;
  const honorable = profile.selected_slot_counts.get("honorable") ?? 0;
  return {
    combinedShare: totalSlots === 0 ? 0 : profile.selected / totalSlots,
    topShare: totalTopSlots === 0 ? 0 : top / totalTopSlots,
    honorableShare: totalHonorableSlots === 0
      ? 0
      : honorable / totalHonorableSlots,
    sideShare: totalSideSlots === 0 ? 0 : profile.selected / totalSideSlots,
    totalSlots,
    totalTopSlots,
    totalHonorableSlots,
    totalSideSlots,
  };
}

function actualSlotShareSummary(rows: readonly AuditRow[]): string {
  const profiles = profileUtilization(rows)
    .filter((profile) => profile.opportunities > 0)
    .map((profile) => {
      const top = profile.selected_slot_counts.get("top") ?? 0;
      const honorable = profile.selected_slot_counts.get("honorable") ?? 0;
      const metrics = actualSlotShareMetrics(profile, rows);
      const flags: string[] = [];
      if (metrics.combinedShare > UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE) {
        flags.push("combined actual >20%");
      }
      if (metrics.topShare > UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE) {
        flags.push("top actual >20%");
      }
      if (metrics.honorableShare > UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE) {
        flags.push("honorable actual >20%");
      }
      if (metrics.sideShare > UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE) {
        flags.push(`${profile.gear_mode} side actual >20%`);
      }
      return { profile, top, honorable, metrics, flags };
    })
    .sort((a, b) =>
      b.metrics.combinedShare - a.metrics.combinedShare ||
      b.metrics.sideShare - a.metrics.sideShare ||
      a.profile.gear_mode.localeCompare(b.profile.gear_mode) ||
      a.profile.display_name.localeCompare(b.profile.display_name)
    );

  return table([
    [
      "Profile",
      "Gear",
      "Combined all slots",
      "Top slots",
      "Honorable slots",
      "Lure-side slots",
      "Fly-side slots",
      "Flags",
    ],
    ...profiles.map(({ profile, top, honorable, metrics, flags }) => [
      `${profile.display_name}<br>${profile.id}`,
      profile.gear_mode,
      `${profile.selected}/${metrics.totalSlots} (${
        percent(metrics.combinedShare)
      })`,
      `${top}/${metrics.totalTopSlots} (${percent(metrics.topShare)})`,
      `${honorable}/${metrics.totalHonorableSlots} (${
        percent(metrics.honorableShare)
      })`,
      profile.gear_mode === "lure"
        ? `${profile.selected}/${metrics.totalSideSlots} (${
          percent(metrics.sideShare)
        })`
        : "-",
      profile.gear_mode === "fly"
        ? `${profile.selected}/${metrics.totalSideSlots} (${
          percent(metrics.sideShare)
        })`
        : "-",
      flags.length ? flags.join("<br>") : "",
    ]),
  ]);
}

function isLowUseProfile(profile: ProfileUtilization): boolean {
  if (profile.selected === 0) return false;
  return (
    profile.opportunities >= UTILIZATION_LOW_OPPORTUNITY_MIN &&
    profile.selected <= UTILIZATION_LOW_SELECTED_MAX
  ) || utilizationRate(profile) < UTILIZATION_LOW_RATE;
}

function isOverSelectedProfile(profile: ProfileUtilization): boolean {
  return profile.selected >= UTILIZATION_OVER_SELECTED_MIN &&
    utilizationRate(profile) >= UTILIZATION_OVER_RATE;
}

function overdominanceCauseFromUtilization(
  profile: ProfileUtilization,
): string {
  const bigFish = profile.selected_goal_counts.get("big_fish") ?? 0;
  const allPurpose = profile.selected_goal_counts.get("all_purpose") ?? 0;
  const wind = profile.selected_condition_tags.get("wind_reaction") ?? 0;
  const dirty = profile.selected_condition_tags.get("dirty_vibration") ?? 0;
  const clear = profile.selected_clarity_counts.get("clear") ?? 0;
  const stained = profile.selected_clarity_counts.get("stained") ?? 0;
  const dirtyClarity = profile.selected_clarity_counts.get("dirty") ?? 0;
  if (bigFish > allPurpose * 1.5 && (wind + dirty) >= profile.selected) {
    return "catalog_tags/selector_goal_pressure";
  }
  if ((wind + dirty) >= profile.selected * 1.2) {
    return "daily_condition_score_weight";
  }
  if ((stained + dirtyClarity) >= profile.selected * 0.7) {
    return "forage_clarity_stack";
  }
  if (clear >= profile.selected * 0.4) return "scenario_coverage_or_jitter";
  return "mixed_score_and_selector";
}

function utilizationSummary(rows: readonly AuditRow[]): string {
  const profiles = profileUtilization(rows);
  const lines = [
    [
      "Gear",
      "Candidate profiles",
      "Selected profiles",
      "Zero-selected",
      "Low-use",
      "Over-selected",
    ],
  ];
  for (const side of ["lure", "fly"] as const) {
    const sideProfiles = profiles.filter((profile) =>
      profile.gear_mode === side
    );
    lines.push([
      side,
      String(sideProfiles.length),
      String(sideProfiles.filter((profile) => profile.selected > 0).length),
      String(sideProfiles.filter((profile) => profile.selected === 0).length),
      String(sideProfiles.filter(isLowUseProfile).length),
      String(sideProfiles.filter(isOverSelectedProfile).length),
    ]);
  }

  const profileLines = [
    [
      "Profile",
      "Gear",
      "Selected/Opp",
      "Rate",
      "Goal",
      "Set",
      "Slot",
      "Clarity",
      "Water",
      "Selected tags",
    ],
  ];
  for (
    const profile of profiles
      .slice()
      .sort((a, b) =>
        b.selected - a.selected ||
        b.opportunities - a.opportunities ||
        a.display_name.localeCompare(b.display_name)
      )
  ) {
    profileLines.push([
      `${profile.display_name}<br>${profile.id}`,
      profile.gear_mode,
      `${profile.selected}/${profile.opportunities}`,
      percent(utilizationRate(profile)),
      compactCounts(profile.selected_goal_counts, 2),
      compactCounts(profile.selected_set_counts, 2),
      compactCounts(profile.selected_slot_counts, 2),
      compactCounts(profile.selected_clarity_counts, 3),
      compactCounts(profile.selected_water_type_counts, 2),
      compactCounts(profile.selected_condition_tags, 4),
    ]);
  }

  return `${table(lines)}

### Selected Count By Profile

${table(profileLines)}`;
}

function zeroSelectedEligibleProfiles(rows: readonly AuditRow[]): string {
  const zero = profileUtilization(rows)
    .filter((profile) => profile.selected === 0)
    .sort((a, b) =>
      b.opportunities - a.opportunities ||
      a.gear_mode.localeCompare(b.gear_mode) ||
      a.display_name.localeCompare(b.display_name)
    );
  if (zero.length === 0) return "None.";
  const lines = [
    [
      "Profile",
      "Gear",
      "Candidate opportunities",
      "Top available contexts",
      "Top competing winners",
    ],
  ];
  for (const profile of zero) {
    lines.push([
      `${profile.display_name}<br>${profile.id}`,
      profile.gear_mode,
      String(profile.opportunities),
      compactCounts(profile.availability_contexts, 4),
      compactCounts(profile.competing_winners, 4),
    ]);
  }
  return table(lines);
}

function lowUseEligibleProfiles(rows: readonly AuditRow[]): string {
  const lowUse = profileUtilization(rows)
    .filter(isLowUseProfile)
    .sort((a, b) =>
      utilizationRate(a) - utilizationRate(b) ||
      b.opportunities - a.opportunities ||
      a.display_name.localeCompare(b.display_name)
    );
  if (lowUse.length === 0) return "None.";
  const lines = [
    [
      "Profile",
      "Gear",
      "Selected/Opp",
      "Rate",
      "Close opp",
      "Far-behind opp",
      "Available tags",
      "Common winners",
    ],
  ];
  for (const profile of lowUse) {
    lines.push([
      `${profile.display_name}<br>${profile.id}`,
      profile.gear_mode,
      `${profile.selected}/${profile.opportunities}`,
      percent(utilizationRate(profile)),
      String(profile.close_opportunities),
      String(profile.far_behind_opportunities),
      compactCounts(profile.available_condition_tags, 5),
      compactCounts(profile.competing_winners, 4),
    ]);
  }
  return table(lines);
}

function overSelectedProfiles(rows: readonly AuditRow[]): string {
  const overSelected = profileUtilization(rows)
    .filter(isOverSelectedProfile)
    .sort((a, b) =>
      utilizationRate(b) - utilizationRate(a) ||
      b.selected - a.selected ||
      a.display_name.localeCompare(b.display_name)
    );
  if (overSelected.length === 0) return "None.";
  const lines = [
    [
      "Profile",
      "Gear",
      "Selected/Opp",
      "Rate",
      "Dominant goals",
      "Dominant condition tags",
    ],
  ];
  for (const profile of overSelected) {
    lines.push([
      `${profile.display_name}<br>${profile.id}`,
      profile.gear_mode,
      `${profile.selected}/${profile.opportunities}`,
      percent(utilizationRate(profile)),
      compactCounts(profile.selected_goal_counts, 3),
      compactCounts(profile.selected_condition_tags, 5),
    ]);
  }
  return table(lines);
}

function slotUtilizationGuardrails(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  const home = profileHomeUsage(config, rows);
  const profiles = profileUtilization(rows)
    .map((profile) => {
      const homeEntry = home.get(utilizationKey(profile.gear_mode, profile.id));
      const top = profile.selected_slot_counts.get("top") ?? 0;
      const honorable = profile.selected_slot_counts.get("honorable") ?? 0;
      const actualShare = actualSlotShareMetrics(profile, rows);
      const homeRate = homeEntry && homeEntry.opportunities > 0
        ? homeEntry.selected / homeEntry.opportunities
        : 0;
      const homeTopRate = homeEntry && homeEntry.opportunities > 0
        ? homeEntry.selectedTop / homeEntry.opportunities
        : 0;
      const homeHonorableRate = homeEntry && homeEntry.opportunities > 0
        ? homeEntry.selectedHonorable / homeEntry.opportunities
        : 0;
      const flags: string[] = [];
      if (
        actualShare.combinedShare > UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE
      ) {
        flags.push("combined actual>20%");
      }
      if (actualShare.topShare > UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE) {
        flags.push("top actual>20%");
      }
      if (
        actualShare.honorableShare > UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE
      ) {
        flags.push("honorable actual>20%");
      }
      if (actualShare.sideShare > UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE) {
        flags.push(`${profile.gear_mode} side actual>20%`);
      }
      if (
        homeEntry &&
        homeEntry.opportunities >= SIGNATURE_HOME_GUARDRAIL_MIN &&
        homeRate > SIGNATURE_HOME_WATCH_RATE
      ) {
        flags.push("home>20%");
      }
      if (
        homeEntry &&
        homeEntry.opportunities >= SIGNATURE_HOME_GUARDRAIL_MIN &&
        homeRate > SIGNATURE_HOME_OVER_RATE
      ) {
        flags.push("home>25%");
      }
      if (
        homeEntry &&
        homeEntry.opportunities >= SIGNATURE_HOME_GUARDRAIL_MIN &&
        homeRate > SIGNATURE_HOME_SEVERE_RATE
      ) {
        flags.push("home>30%");
      }
      return {
        profile,
        homeEntry,
        top,
        honorable,
        homeRate,
        homeTopRate,
        homeHonorableRate,
        actualShare,
        flags,
      };
    })
    .filter((entry) => entry.flags.length > 0)
    .sort((a, b) =>
      b.flags.length - a.flags.length ||
      b.homeRate - a.homeRate ||
      utilizationRate(b.profile) - utilizationRate(a.profile) ||
      a.profile.display_name.localeCompare(b.profile.display_name)
    );

  if (profiles.length === 0) return "None.";
  return table([
    [
      "Profile",
      "Gear",
      "Actual combined",
      "Actual top",
      "Actual honorable",
      "Actual side",
      "Home",
      "Home top/HM",
      "Flags",
    ],
    ...profiles.map((entry) => [
      `${entry.profile.display_name}<br>${entry.profile.id}`,
      entry.profile.gear_mode,
      `${entry.profile.selected}/${entry.actualShare.totalSlots} (${
        percent(entry.actualShare.combinedShare)
      })`,
      `${entry.top}/${entry.actualShare.totalTopSlots} (${
        percent(entry.actualShare.topShare)
      })`,
      `${entry.honorable}/${entry.actualShare.totalHonorableSlots} (${
        percent(entry.actualShare.honorableShare)
      })`,
      `${entry.profile.selected}/${entry.actualShare.totalSideSlots} (${
        percent(entry.actualShare.sideShare)
      })`,
      entry.homeEntry
        ? `${entry.homeEntry.selected}/${entry.homeEntry.opportunities} (${
          percent(entry.homeRate)
        })`
        : "0/0",
      entry.homeEntry
        ? `${entry.homeEntry.selectedTop}/${entry.homeEntry.opportunities} (${
          percent(entry.homeTopRate)
        }) / ${entry.homeEntry.selectedHonorable}/${entry.homeEntry.opportunities} (${
          percent(entry.homeHonorableRate)
        })`
        : "0/0",
      entry.flags.join("<br>"),
    ]),
  ]);
}

function finalistPoolDiagnostics(rows: readonly AuditRow[]): string {
  const pools = rows.flatMap((row) =>
    row.finalist_pool_diagnostics.map((pool) => ({ ...pool, row }))
  );
  if (pools.length === 0) return "No finalist pool diagnostics recorded.";

  const expandedPoolSizes = pools.map((pool) =>
    pool.expanded_pool_size ?? pool.pool_size
  );
  const selectedTierPoolSizes = pools.map((pool) =>
    pool.selected_tier_pool_size ?? pool.pool_size
  );
  const expandedAverage =
    expandedPoolSizes.reduce((sum, size) => sum + size, 0) /
    expandedPoolSizes.length;
  const selectedTierAverage =
    selectedTierPoolSizes.reduce((sum, size) => sum + size, 0) /
    selectedTierPoolSizes.length;
  const expandedMin = Math.min(...expandedPoolSizes);
  const selectedTierMin = Math.min(...selectedTierPoolSizes);
  const singletonPools = pools.filter((pool) =>
    (pool.expanded_pool_size ?? pool.pool_size) === 1
  );
  const selectedTierSingletons = pools.filter((pool) =>
    (pool.selected_tier_pool_size ?? pool.pool_size) === 1
  );
  const tierCollapseAvoided = pools.filter((pool) =>
    (pool.selected_tier_pool_size ?? pool.pool_size) === 1 &&
    (pool.expanded_pool_size ?? pool.pool_size) > 1
  );
  const bySideSlot = new Map<
    string,
    {
      count: number;
      selectedTierTotal: number;
      expandedTotal: number;
      selectedTierMin: number;
      expandedMin: number;
      selectedTierSingleton: number;
      expandedSingleton: number;
    }
  >();
  for (const pool of pools) {
    const key = `${pool.side}/${pool.slot}`;
    const entry = bySideSlot.get(key) ?? {
      count: 0,
      selectedTierTotal: 0,
      expandedTotal: 0,
      selectedTierMin: Number.POSITIVE_INFINITY,
      expandedMin: Number.POSITIVE_INFINITY,
      selectedTierSingleton: 0,
      expandedSingleton: 0,
    };
    const selectedTierSize = pool.selected_tier_pool_size ?? pool.pool_size;
    const expandedSize = pool.expanded_pool_size ?? pool.pool_size;
    entry.count += 1;
    entry.selectedTierTotal += selectedTierSize;
    entry.expandedTotal += expandedSize;
    entry.selectedTierMin = Math.min(entry.selectedTierMin, selectedTierSize);
    entry.expandedMin = Math.min(entry.expandedMin, expandedSize);
    if (selectedTierSize === 1) entry.selectedTierSingleton += 1;
    if (expandedSize === 1) entry.expandedSingleton += 1;
    bySideSlot.set(key, entry);
  }
  const byTier = topCounts(pools.map((pool) => pool.tier), 12);
  const byExpandedTier = topCounts(
    pools.flatMap((pool) => pool.expanded_tiers ?? [pool.tier]),
    12,
  );
  const bySingletonCause = topCounts(
    singletonPools.map((pool) => pool.singleton_cause ?? "unknown"),
    12,
  );
  const setBPools = pools.filter((pool) => pool.row.set === "B");
  const setBDiagnosticAverage = (
    accessor: (pool: (typeof pools)[number]) => number | undefined,
  ) => {
    const values = setBPools.map(accessor).filter((value): value is number =>
      typeof value === "number"
    );
    if (values.length === 0) return "n/a";
    return (values.reduce((sum, value) => sum + value, 0) / values.length)
      .toFixed(2);
  };
  const setBSameSameReintroduced =
    setBPools.filter((pool) =>
      pool.set_b_same_family_same_presentation_reintroduced
    ).length;
  const lines = [
    `Average pre-expansion selected-tier pool size: ${
      selectedTierAverage.toFixed(2)
    }.`,
    `Average expanded finalist pool size: ${expandedAverage.toFixed(2)}.`,
    `Minimum pre-expansion selected-tier pool size: ${selectedTierMin}.`,
    `Minimum expanded finalist pool size: ${expandedMin}.`,
    `Rows/slots with selected-tier pool size 1: ${selectedTierSingletons.length}.`,
    `Rows/slots with expanded finalist pool size 1: ${singletonPools.length}.`,
    `Selected-tier singleton slots expanded above 1: ${tierCollapseAvoided.length}.`,
    "",
    table([
      [
        "Side/slot",
        "Avg selected-tier",
        "Avg expanded",
        "Min selected-tier",
        "Min expanded",
        "Selected-tier singletons",
        "Expanded singletons",
      ],
      ...[...bySideSlot.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, entry]) => [
          key,
          (entry.selectedTierTotal / entry.count).toFixed(2),
          (entry.expandedTotal / entry.count).toFixed(2),
          String(entry.selectedTierMin),
          String(entry.expandedMin),
          String(entry.selectedTierSingleton),
          String(entry.expandedSingleton),
        ]),
    ]),
    "",
    table([
      ["Pre-expansion selected finalist tier", "Slots"],
      ...byTier.map(([tier, count]) => [tier, String(count)]),
    ]),
    "",
    table([
      ["Expanded finalist tiers included", "Slots"],
      ...byExpandedTier.map(([tier, count]) => [tier, String(count)]),
    ]),
  ];

  if (singletonPools.length > 0) {
    lines.push(
      "",
      table([
        ["Expanded singleton cause", "Slots"],
        ...bySingletonCause.map(([cause, count]) => [cause, String(count)]),
      ]),
    );
  }

  if (singletonPools.length > 0) {
    lines.push(
      "",
      "Representative expanded singleton finalist pools:",
      singletonPools.slice(0, 20).map((pool) =>
        `- ${pool.row.scenario_id} ${pool.side}/${pool.slot}: ${
          pool.finalist_ids.join(", ")
        } (${pool.tier}; ${pool.singleton_cause ?? "unknown"})`
      ).join("\n"),
    );
  }

  if (setBPools.length > 0) {
    lines.push(
      "",
      "Set B finalist-pool novelty diagnostics:",
      table([
        ["Stage", "Average pool size / slots"],
        [
          "After exact-ID avoidance and hard/safety gates",
          setBDiagnosticAverage((pool) =>
            pool.set_b_after_exact_id_avoidance_pool_size
          ),
        ],
        [
          "Different-presentation close candidates",
          setBDiagnosticAverage((pool) =>
            pool.set_b_different_presentation_pool_size
          ),
        ],
        [
          "Different-family close candidates",
          setBDiagnosticAverage((pool) =>
            pool.set_b_different_family_pool_size
          ),
        ],
        [
          "Final expanded Set B pool",
          setBDiagnosticAverage((pool) => pool.set_b_final_expanded_pool_size),
        ],
        [
          "Same-family/same-presentation reintroduced",
          `${setBSameSameReintroduced}/${setBPools.length}`,
        ],
      ]),
    );
  }

  return lines.join("\n");
}

function surfaceSafetyExpansionCheck(rows: readonly AuditRow[]): string {
  let closedSlots = 0;
  let closedSelectedPicks = 0;
  let closedSurfaceFinalists = 0;
  let cautionSlots = 0;
  let cautionSelectedPicks = 0;
  let cautionSurfaceFinalists = 0;
  const closedSelectedExamples: string[] = [];
  const cautionSelectedExamples: string[] = [];
  const closedExamples: string[] = [];
  const cautionExamples: string[] = [];
  for (const row of rows) {
    const selectedSurface = row.selected_picks.filter((pick) =>
      pick.is_surface
    );
    if (row.daily_scenario_summary.surface_gate === "closed") {
      closedSelectedPicks += selectedSurface.length;
      if (
        selectedSurface.length > 0 &&
        closedSelectedExamples.length < 10
      ) {
        closedSelectedExamples.push(
          `- ${row.scenario_id}: ${
            selectedSurface.map((pick) => `${pick.slot}:${pick.id}`).join(", ")
          }`,
        );
      }
    }
    if (row.daily_scenario_summary.surface_gate === "caution") {
      cautionSelectedPicks += selectedSurface.length;
      if (
        selectedSurface.length > 0 &&
        cautionSelectedExamples.length < 10
      ) {
        cautionSelectedExamples.push(
          `- ${row.scenario_id}: ${
            selectedSurface.map((pick) => `${pick.slot}:${pick.id}`).join(", ")
          }`,
        );
      }
    }
    for (const pool of row.finalist_pool_diagnostics) {
      const candidatesById = new Map(
        sideCandidates(row, pool.side).map((candidate) => [
          candidate.id,
          candidate,
        ]),
      );
      const surfaceIds = pool.finalist_ids.filter((id) =>
        candidatesById.get(id)?.is_surface
      );
      if (row.daily_scenario_summary.surface_gate === "closed") {
        closedSlots += 1;
        closedSurfaceFinalists += surfaceIds.length;
        if (surfaceIds.length > 0 && closedExamples.length < 10) {
          closedExamples.push(
            `- ${row.scenario_id} ${pool.side}/${pool.slot}: ${
              surfaceIds.join(", ")
            }`,
          );
        }
      }
      if (row.daily_scenario_summary.surface_gate === "caution") {
        cautionSlots += 1;
        cautionSurfaceFinalists += surfaceIds.length;
        if (surfaceIds.length > 0 && cautionExamples.length < 10) {
          cautionExamples.push(
            `- ${row.scenario_id} ${pool.side}/${pool.slot}: ${
              surfaceIds.join(", ")
            }`,
          );
        }
      }
    }
  }

  const lines = [
    table([
      [
        "Surface gate",
        "Slots checked",
        "Selected surface picks",
        "Surface finalist IDs",
      ],
      [
        "closed",
        String(closedSlots),
        String(closedSelectedPicks),
        String(closedSurfaceFinalists),
      ],
      [
        "caution",
        String(cautionSlots),
        String(cautionSelectedPicks),
        String(cautionSurfaceFinalists),
      ],
    ]),
  ];
  if (closedSelectedExamples.length > 0) {
    lines.push(
      "",
      "Closed-gate selected surface examples:",
      closedSelectedExamples.join("\n"),
    );
  }
  if (closedExamples.length > 0) {
    lines.push(
      "",
      "Closed-gate surface finalist examples:",
      closedExamples.join("\n"),
    );
  }
  if (cautionSelectedExamples.length > 0) {
    lines.push(
      "",
      "Caution-gate selected surface examples:",
      cautionSelectedExamples.join("\n"),
    );
  }
  if (cautionExamples.length > 0) {
    lines.push(
      "",
      "Caution-gate surface finalist examples:",
      cautionExamples.join("\n"),
    );
  }
  return lines.join("\n");
}

function dirtyWindCoveragePoolDiagnostics(rows: readonly AuditRow[]): string {
  const coveragePools = rows.flatMap((row) =>
    row.finalist_pool_diagnostics
      .filter((pool) =>
        pool.side === "lure" &&
        pool.slot === "honorable" &&
        pool.dirty_wind_coverage_pool_source != null
      )
      .map((pool) => ({ row, pool }))
  );
  const usedPools = coveragePools.filter((entry) =>
    entry.pool.dirty_wind_coverage_pool_used
  );
  if (coveragePools.length === 0) return "None.";

  const totalSize = usedPools.reduce(
    (sum, entry) => sum + (entry.pool.dirty_wind_coverage_pool_size ?? 0),
    0,
  );
  const avgSize = usedPools.length === 0 ? 0 : totalSize / usedPools.length;
  const singletonCount =
    usedPools.filter((entry) =>
      (entry.pool.dirty_wind_coverage_pool_size ?? 0) === 1
    ).length;
  const sourceCounts = new Map<string, number>();
  const poolIdCounts = new Map<string, number>();
  const selectedCounts = new Map<string, number>();
  let broadLarger = 0;
  let narrowedEqual = 0;
  let spinnerLiplessWithDepth = 0;
  const depthExamples: string[] = [];

  for (const entry of coveragePools) {
    incrementMap(
      sourceCounts,
      entry.pool.dirty_wind_coverage_pool_source ?? "none",
    );
  }

  for (const entry of usedPools) {
    const ids = entry.pool.dirty_wind_coverage_pool_ids ?? [];
    for (const id of ids) incrementMap(poolIdCounts, id);
    const selected = selectedPickForSlot(entry.row, "lure", "honorable");
    incrementMap(selectedCounts, selected.id);
    const narrowed = entry.pool.dirty_wind_coverage_narrowed_pool_size ?? 0;
    const broad = entry.pool.dirty_wind_coverage_broad_pool_size ?? 0;
    if (broad > narrowed) broadLarger += 1;
    if (broad === narrowed && broad > 0) narrowedEqual += 1;
    const otherActiveCount = ids.filter((id) =>
      id !== selected.id &&
      id !== "spinnerbait" &&
      id !== "lipless_crankbait"
    ).length;
    if (
      ["spinnerbait", "lipless_crankbait"].includes(selected.id) &&
      otherActiveCount >= 3
    ) {
      spinnerLiplessWithDepth += 1;
      if (depthExamples.length < 10) {
        depthExamples.push(
          `- ${entry.row.scenario_id}: ${selected.display_name}; pool ${
            ids.join(", ")
          }`,
        );
      }
    }
  }

  const summaryRows = [
    ["Metric", "Value"],
    ["Coverage rows checked", String(coveragePools.length)],
    ["Coverage pool used", String(usedPools.length)],
    ["Average used coverage pool size", avgSize.toFixed(2)],
    ["Singleton used coverage pools", String(singletonCount)],
    ["Broad pool larger than narrowed pool", String(broadLarger)],
    ["Broad pool same as narrowed pool", String(narrowedEqual)],
    [
      "Spinnerbait/Lipless selected with 3+ other active candidates",
      String(spinnerLiplessWithDepth),
    ],
  ];

  const sourceRows = [
    ["Coverage source", "Rows"],
    ...[...sourceCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([source, count]) => [source, String(count)]),
  ];
  const poolRows = [
    ["Profile ID in coverage pool", "Rows"],
    ...[...poolIdCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 15)
      .map(([id, count]) => [id, String(count)]),
  ];
  const selectedRows = [
    ["Selected coverage ID", "Rows"],
    ...[...selectedCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 15)
      .map(([id, count]) => [id, String(count)]),
  ];

  return [
    table(summaryRows),
    "Coverage source:",
    table(sourceRows),
    "Top coverage-pool IDs by frequency:",
    table(poolRows),
    "Selected coverage IDs by frequency:",
    table(selectedRows),
    "Spinnerbait/Lipless selected despite 3+ other active candidates:",
    depthExamples.length ? depthExamples.join("\n") : "None.",
  ].join("\n\n");
}

function overdominanceGuardrailSummary(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  type GuardrailEntry = {
    profile: {
      display_name: string;
      id: string;
      gear_mode: Side;
    };
    trigger: string;
    selected: number;
    opportunities: number;
    rate: number;
    cause: string;
    context: string;
  };
  const overall = profileUtilization(rows)
    .flatMap((profile) => {
      const entries: GuardrailEntry[] = [];
      const actualShare = actualSlotShareMetrics(profile, rows);
      const baseContext = [
        `goals ${compactCounts(profile.selected_goal_counts, 2)}`,
        `clarity ${compactCounts(profile.selected_clarity_counts, 3)}`,
        `tags ${compactCounts(profile.selected_condition_tags, 4)}`,
      ].join("<br>");
      if (
        profile.selected >= UTILIZATION_OVER_SELECTED_MIN &&
        actualShare.combinedShare >= UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE
      ) {
        entries.push({
          profile,
          trigger: "combined all-slot share >20%",
          selected: profile.selected,
          opportunities: actualShare.totalSlots,
          rate: actualShare.combinedShare,
          cause: overdominanceCauseFromUtilization(profile),
          context: baseContext,
        });
      }
      for (const slot of ["top", "honorable"] as const) {
        const selected = profile.selected_slot_counts.get(slot) ?? 0;
        const denominator = slot === "top"
          ? actualShare.totalTopSlots
          : actualShare.totalHonorableSlots;
        const rate = denominator === 0 ? 0 : selected / denominator;
        if (selected >= UTILIZATION_OVER_SELECTED_MIN && rate >= 0.20) {
          entries.push({
            profile,
            trigger: `${slot} slot share >20%`,
            selected,
            opportunities: denominator,
            rate,
            cause: overdominanceCauseFromUtilization(profile),
            context: baseContext,
          });
        }
      }
      return entries;
    });

  const home = summarizeSignatureProfiles(config, rows)
    .filter((summary) =>
      summary.home_opportunities >= SIGNATURE_HOME_GUARDRAIL_MIN &&
      signatureHomeRate(summary) > SIGNATURE_HOME_WATCH_RATE
    )
    .map((summary) => ({
      profile: {
        display_name: summary.display_name,
        id: summary.definition.id,
        gear_mode: summary.definition.side,
      },
      trigger: signatureHomeRate(summary) > SIGNATURE_HOME_SEVERE_RATE
        ? "home-window >30% severe"
        : signatureHomeRate(summary) > SIGNATURE_HOME_OVER_RATE
        ? "home-window >25% overdominant"
        : "home-window >20% watch",
      selected: summary.selected_home,
      opportunities: summary.home_opportunities,
      rate: signatureHomeRate(summary),
      cause: compactCounts(summary.home_loss_causes, 1) ||
        "scenario_coverage_or_jitter",
      context: [
        `AP/BF ${summary.selected_home_by_goal.get("all_purpose") ?? 0}/${
          summary.home_by_goal.get("all_purpose") ?? 0
        }, ${summary.selected_home_by_goal.get("big_fish") ?? 0}/${
          summary.home_by_goal.get("big_fish") ?? 0
        }`,
        `clarity ${compactCounts(summary.home_by_clarity, 3)}`,
        `bucket ${compactCounts(summary.home_by_bucket, 3)}`,
      ].join("<br>"),
    }));

  const byKey = new Map<string, GuardrailEntry>();
  for (const entry of [...overall, ...home]) {
    const key =
      `${entry.profile.gear_mode}:${entry.profile.id}:${entry.trigger}`;
    byKey.set(key, entry);
  }
  const entries = [...byKey.values()].sort((a, b) =>
    b.rate - a.rate ||
    b.selected - a.selected ||
    a.profile.display_name.localeCompare(b.profile.display_name)
  );
  if (entries.length === 0) return "None.";
  return table([
    [
      "Profile",
      "Gear",
      "Trigger",
      "Selected/Opp",
      "Rate",
      "Likely cause",
      "Context",
    ],
    ...entries.map((entry) => [
      `${entry.profile.display_name}<br>${entry.profile.id}`,
      entry.profile.gear_mode,
      entry.trigger,
      `${entry.selected}/${entry.opportunities}`,
      percent(entry.rate),
      entry.cause,
      entry.context,
    ]),
  ]);
}

const STAPLE_REVIEW_IDS: Partial<Record<SpeciesGroup, readonly string[]>> = {
  largemouth_bass: [
    "ned_rig",
    "finesse_jig",
    "texas_rigged_soft_plastic_craw",
    "carolina_rigged_stick_worm",
    "drop_shot_minnow",
    "spinnerbait",
    "bladed_jig",
    "lipless_crankbait",
  ],
  smallmouth_bass: [
    "ned_rig",
    "tube_jig",
    "big_smallmouth_tube",
    "finesse_jig",
    "texas_rigged_soft_plastic_craw",
    "drop_shot_minnow",
    "suspending_jerkbait",
    "hair_jig",
    "inline_spinner",
    "bladed_jig",
    "lipless_crankbait",
  ],
  pike_musky: [
    "casting_spoon",
    "weedless_spoon",
    "inline_spinner",
    "large_bucktail_spinner",
    "pike_spinnerbait",
    "large_profile_pike_swimbait",
    "pike_jerkbait",
    "pike_glidebait",
    "pike_jig_and_plastic",
    "large_pike_tube",
    "large_pike_topwater",
    "pike_bunny_streamer",
    "large_articulated_pike_streamer",
    "articulated_baitfish_streamer",
    "bucktail_baitfish_streamer",
    "deceiver",
    "pike_flash_fly",
  ],
  river_trout: [
    "ned_rig",
    "hair_jig",
    "inline_spinner",
    "casting_spoon",
    "blade_bait",
    "suspending_jerkbait",
    "soft_jerkbait",
    "small_floating_trout_plug",
    "woolly_bugger",
    "rabbit_strip_leech",
    "jighead_marabou_leech",
    "lead_eye_leech",
    "feather_jig_leech",
    "sculpin_streamer",
    "sculpzilla",
    "muddler_sculpin",
    "crawfish_streamer",
    "clouser_minnow",
    "bucktail_baitfish_streamer",
    "slim_minnow_streamer",
    "articulated_baitfish_streamer",
    "articulated_dungeon_streamer",
    "game_changer",
    "conehead_streamer",
    "zonker_streamer",
    "unweighted_baitfish_streamer",
    "baitfish_slider_fly",
    "popper_fly",
    "deer_hair_slider",
    "mouse_fly",
  ],
};

type ProfileHomeUsage = {
  opportunities: number;
  selected: number;
  selectedTop: number;
  selectedHonorable: number;
  commonWinners: Map<string, number>;
};

function catalogProfileForSide(
  side: Side,
  id: string,
): ArchetypeProfileV4 | null {
  const map = side === "lure" ? LURE_BY_ID : FLY_BY_ID;
  return (map as Map<string, ArchetypeProfileV4>).get(id) ?? null;
}

function eligibleCatalogProfiles(
  rows: readonly AuditRow[],
): { side: Side; profile: ArchetypeProfileV4 }[] {
  const keys = new Set<string>();
  for (const row of rows) {
    for (const side of ["lure", "fly"] as const) {
      for (const candidate of sideCandidates(row, side)) {
        keys.add(utilizationKey(side, candidate.id));
      }
    }
  }
  return [...keys].flatMap((key) => {
    const [side, id] = key.split(":") as [Side, string];
    const profile = catalogProfileForSide(side, id);
    return profile ? [{ side, profile }] : [];
  }).sort((a, b) =>
    a.side.localeCompare(b.side) ||
    a.profile.display_name.localeCompare(b.profile.display_name)
  );
}

function profileSignalCount(profile: ArchetypeProfileV4): number {
  return profile.forage_tags.length +
    profile.clarity_strengths.length +
    profile.condition_tags.length +
    profile.goal_tags.length;
}

function listWithCount(values: readonly string[]): string {
  return `${values.length}: ${values.join(", ") || "none"}`;
}

function profileHomeUsage(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): Map<string, ProfileHomeUsage> {
  const usage = new Map<string, ProfileHomeUsage>();
  for (const row of rows) {
    for (const side of ["lure", "fly"] as const) {
      const selectedSameSide = row.selected_picks.filter((pick) =>
        pick.gear_mode === side
      );
      const winners = selectedSameSide.map((pick) =>
        `${pick.display_name} (${selectedSlotKind(pick.slot)})`
      ).join(", ");
      for (const candidate of sideCandidates(row, side)) {
        if (classifySignatureWindow(config, row, candidate) !== "home_window") {
          continue;
        }
        const key = utilizationKey(side, candidate.id);
        const entry = usage.get(key) ?? {
          opportunities: 0,
          selected: 0,
          selectedTop: 0,
          selectedHonorable: 0,
          commonWinners: new Map<string, number>(),
        };
        entry.opportunities += 1;
        const selectedPick = selectedSameSide.find((pick) =>
          pick.id === candidate.id
        );
        if (selectedPick) {
          entry.selected += 1;
          if (selectedSlotKind(selectedPick.slot) === "top") {
            entry.selectedTop += 1;
          } else {
            entry.selectedHonorable += 1;
          }
        } else {
          incrementMap(entry.commonWinners, winners);
        }
        usage.set(key, entry);
      }
    }
  }
  return usage;
}

function stackRiskFlagsForProfile(args: {
  profile: ArchetypeProfileV4;
  utilization?: ProfileUtilization;
  home?: ProfileHomeUsage;
}): string[] {
  const { profile, utilization, home } = args;
  const flags: string[] = [];
  const has = (tag: string) =>
    profile.condition_tags.includes(tag as ConditionTag) ||
    profile.goal_tags.includes(tag as never);
  const hasClarity = (clarity: WaterClarity) =>
    profile.clarity_strengths.includes(clarity);
  if (profile.condition_tags.length > 3) flags.push("condition_tags>3");
  if (profile.forage_tags.length > 2) flags.push("forage_tags>2");
  if (
    hasClarity("clear") && hasClarity("stained") && hasClarity("dirty")
  ) {
    flags.push("clear+stained+dirty clarity");
  }
  if (profile.goal_tags.length > 1) flags.push("goal_tags>1");
  if (
    profile.goal_tags.includes("versatile_search") &&
    profile.goal_tags.includes("big_fish_upside")
  ) flags.push("versatile_search+big_fish_upside");
  if (
    profile.goal_tags.includes("reliable_action") &&
    profile.goal_tags.includes("big_fish_upside")
  ) flags.push("reliable_action+big_fish_upside");
  if (
    has("wind_reaction") && has("dirty_vibration") &&
    profile.goal_tags.includes("big_fish_upside")
  ) flags.push("wind+dirty+big_fish_upside");
  if (
    has("wind_reaction") && has("dirty_vibration") &&
    profile.goal_tags.includes("versatile_search")
  ) flags.push("wind+dirty+versatile_search");
  if (
    has("wind_reaction") && has("dirty_vibration") &&
    hasClarity("stained") && hasClarity("dirty")
  ) flags.push("wind+dirty+stained/dirty clarity");
  if (
    has("open_water_search") && has("warming_search") &&
    profile.goal_tags.includes("versatile_search")
  ) flags.push("open_water+warming+versatile");
  if (
    profile.is_surface &&
    has("calm_surface") &&
    has("low_light_surface") &&
    profile.goal_tags.includes("big_fish_upside") &&
    profile.goal_tags.includes("high_risk_high_reward")
  ) flags.push("surface+calm+low_light+big_fish+high_risk");
  if (utilization && utilizationRate(utilization) > 0.25) {
    flags.push("combined all-slot share>25%");
  }
  if (
    utilization &&
    utilization.opportunities > 0 &&
    ((utilization.selected_slot_counts.get("top") ?? 0) /
            utilization.opportunities >
        UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE ||
      (utilization.selected_slot_counts.get("honorable") ?? 0) /
            utilization.opportunities >
        UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE)
  ) {
    flags.push("broad per-slot share>20%");
  }
  if (
    home && home.opportunities >= SIGNATURE_HOME_GUARDRAIL_MIN &&
    home.selected / home.opportunities > SIGNATURE_HOME_WATCH_RATE
  ) {
    flags.push("home-window share>20%");
  }
  if (
    home && home.opportunities >= SIGNATURE_HOME_GUARDRAIL_MIN &&
    home.selected / home.opportunities > SIGNATURE_HOME_OVER_RATE
  ) {
    flags.push("home-window share>25% overdominant");
  }
  if (
    home && home.opportunities >= SIGNATURE_HOME_GUARDRAIL_MIN &&
    home.selected / home.opportunities > SIGNATURE_HOME_SEVERE_RATE
  ) {
    flags.push("home-window share>30% severe");
  }
  return flags;
}

function tagLoadInventorySection(rows: readonly AuditRow[]): string {
  const lines = [[
    "Profile",
    "Gear",
    "Species",
    "Family",
    "Presentation",
    "Column/Pace",
    "Forage",
    "Clarity",
    "Condition",
    "Goal",
    "Water",
    "Surface",
    "Signals",
  ]];
  for (
    const { side, profile } of eligibleCatalogProfiles(rows).sort((a, b) =>
      profileSignalCount(b.profile) - profileSignalCount(a.profile) ||
      a.side.localeCompare(b.side) ||
      a.profile.display_name.localeCompare(b.profile.display_name)
    )
  ) {
    lines.push([
      `${profile.display_name}<br>${profile.id}`,
      side,
      profile.species_allowed.join(", "),
      profile.family_group,
      profile.presentation_group,
      `${profile.column}<br>${profile.primary_pace}${
        profile.secondary_pace ? `/${profile.secondary_pace}` : ""
      }`,
      listWithCount(profile.forage_tags),
      listWithCount(profile.clarity_strengths),
      listWithCount(profile.condition_tags),
      listWithCount(profile.goal_tags),
      profile.water_types_allowed.join(", "),
      String(profile.is_surface),
      String(profileSignalCount(profile)),
    ]);
  }
  return table(lines);
}

function tagLoadStackRiskSection(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  const utilization = new Map(
    profileUtilization(rows).map((profile) => [
      utilizationKey(profile.gear_mode, profile.id),
      profile,
    ]),
  );
  const home = profileHomeUsage(config, rows);
  const lines = [[
    "Profile",
    "Gear",
    "Signals",
    "Selected/Opp",
    "Home selected/opp",
    "Stack risk flags",
  ]];
  for (const { side, profile } of eligibleCatalogProfiles(rows)) {
    const key = utilizationKey(side, profile.id);
    const util = utilization.get(key);
    const homeEntry = home.get(key);
    const flags = stackRiskFlagsForProfile({
      profile,
      utilization: util,
      home: homeEntry,
    });
    if (flags.length === 0) continue;
    lines.push([
      `${profile.display_name}<br>${profile.id}`,
      side,
      String(profileSignalCount(profile)),
      util ? `${util.selected}/${util.opportunities}` : "0/0",
      homeEntry ? `${homeEntry.selected}/${homeEntry.opportunities}` : "0/0",
      flags.join("<br>"),
    ]);
  }
  return lines.length === 1 ? "None." : table(lines);
}

function tagLoadSelectionShareSection(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  const utilization = new Map(
    profileUtilization(rows).map((profile) => [
      utilizationKey(profile.gear_mode, profile.id),
      profile,
    ]),
  );
  const home = profileHomeUsage(config, rows);
  const lines = [[
    "Profile",
    "Gear",
    "Signals",
    "Overall selected/rate",
    "Home selected/rate",
    "AP/BF",
    "Top/HM",
    "Common selected buckets",
  ]];
  for (
    const { side, profile } of eligibleCatalogProfiles(rows).sort((a, b) => {
      const aUtil = utilization.get(utilizationKey(a.side, a.profile.id));
      const bUtil = utilization.get(utilizationKey(b.side, b.profile.id));
      return (bUtil?.selected ?? 0) - (aUtil?.selected ?? 0) ||
        profileSignalCount(b.profile) - profileSignalCount(a.profile) ||
        a.profile.display_name.localeCompare(b.profile.display_name);
    })
  ) {
    const key = utilizationKey(side, profile.id);
    const util = utilization.get(key);
    const homeEntry = home.get(key);
    lines.push([
      `${profile.display_name}<br>${profile.id}`,
      side,
      String(profileSignalCount(profile)),
      util
        ? `${util.selected}/${util.opportunities} (${
          percent(utilizationRate(util))
        })`
        : "0/0",
      homeEntry && homeEntry.opportunities > 0
        ? `${homeEntry.selected}/${homeEntry.opportunities} (${
          percent(homeEntry.selected / homeEntry.opportunities)
        })`
        : "0/0",
      util ? compactCounts(util.selected_goal_counts, 2) : "",
      util ? compactCounts(util.selected_slot_counts, 2) : "",
      util ? compactCounts(util.selected_condition_tags, 5) : "",
    ]);
  }
  return table(lines);
}

function overdominantCauseClassification(args: {
  profile: ArchetypeProfileV4;
  utilization?: ProfileUtilization;
  home?: ProfileHomeUsage;
}): string[] {
  const { profile, utilization, home } = args;
  const causes = new Set<string>();
  const flags = stackRiskFlagsForProfile(args);
  if (
    flags.some((flag) =>
      flag.includes("+") || flag.includes(">") || flag.includes("clarity")
    )
  ) causes.add("catalog_tag_stack");
  if (
    profile.goal_tags.includes("big_fish_upside") ||
    profile.goal_tags.includes("high_risk_high_reward") ||
    (utilization &&
      (utilization.selected_goal_counts.get("big_fish") ?? 0) >
        (utilization.selected_goal_counts.get("all_purpose") ?? 0))
  ) causes.add("goal_tag_pressure");
  if (
    profile.condition_tags.length >= 3 ||
    flags.some((flag) => flag.includes("wind+dirty"))
  ) causes.add("condition_tag_stack");
  if (profile.forage_tags.length + profile.clarity_strengths.length >= 5) {
    causes.add("forage_clarity_stack");
  }
  if (utilization && utilization.close_opportunities > utilization.selected) {
    causes.add("selector_direct_score_bias");
  }
  if (
    home && home.opportunities > 0 &&
    home.opportunities < Math.max(24, (utilization?.opportunities ?? 0) * 0.2)
  ) causes.add("scenario_coverage_bias");
  if (
    profile.is_surface && home && home.opportunities > 0 &&
    home.selected / home.opportunities > 0.35
  ) causes.add("acceptable_niche_concentration");
  return [...causes];
}

function likelyCauseClassificationSection(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  const utilization = new Map(
    profileUtilization(rows).map((profile) => [
      utilizationKey(profile.gear_mode, profile.id),
      profile,
    ]),
  );
  const home = profileHomeUsage(config, rows);
  const entries = eligibleCatalogProfiles(rows).flatMap(({ side, profile }) => {
    const key = utilizationKey(side, profile.id);
    const util = utilization.get(key);
    const homeEntry = home.get(key);
    const overOverall = util &&
      util.selected >= UTILIZATION_OVER_SELECTED_MIN &&
      utilizationRate(util) > UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE;
    const overHome = homeEntry &&
      homeEntry.opportunities >= SIGNATURE_HOME_GUARDRAIL_MIN &&
      homeEntry.selected / homeEntry.opportunities > SIGNATURE_HOME_WATCH_RATE;
    if (!overOverall && !overHome) return [];
    return [{
      side,
      profile,
      util,
      home: homeEntry,
      causes: overdominantCauseClassification({
        profile,
        utilization: util,
        home: homeEntry,
      }),
    }];
  }).sort((a, b) =>
    (b.util?.selected ?? 0) - (a.util?.selected ?? 0) ||
    a.profile.display_name.localeCompare(b.profile.display_name)
  );
  if (entries.length === 0) return "None.";
  return table([
    [
      "Profile",
      "Gear",
      "Selected/Opp",
      "Home selected/opp",
      "Cause classification",
      "Stack flags",
    ],
    ...entries.map((entry) => [
      `${entry.profile.display_name}<br>${entry.profile.id}`,
      entry.side,
      entry.util
        ? `${entry.util.selected}/${entry.util.opportunities} (${
          percent(utilizationRate(entry.util))
        })`
        : "0/0",
      entry.home && entry.home.opportunities > 0
        ? `${entry.home.selected}/${entry.home.opportunities} (${
          percent(entry.home.selected / entry.home.opportunities)
        })`
        : "0/0",
      entry.causes.join("<br>") || "mixed",
      stackRiskFlagsForProfile({
        profile: entry.profile,
        utilization: entry.util,
        home: entry.home,
      }).join("<br>"),
    ]),
  ]);
}

function stapleIssueClassification(args: {
  profile: ArchetypeProfileV4;
  utilization?: ProfileUtilization;
  home?: ProfileHomeUsage;
}): string {
  const { profile, utilization, home } = args;
  const signalCount = profileSignalCount(profile);
  const homeRate = home && home.opportunities > 0
    ? home.selected / home.opportunities
    : 0;
  if (!home || home.opportunities < 12) return "scenario coverage";
  if (homeRate >= 0.12) return "healthy / not underused";
  if (signalCount <= 4) return "possible missing tags";
  if (utilization && utilization.close_opportunities > utilization.selected) {
    return "selector/direct-score or overpowered competitors";
  }
  return "scenario coverage or narrow home window";
}

function tagSupportSummary(profile: ArchetypeProfileV4): string {
  return [
    `forage ${listWithCount(profile.forage_tags)}`,
    `clarity ${listWithCount(profile.clarity_strengths)}`,
    `condition ${listWithCount(profile.condition_tags)}`,
    `goal ${listWithCount(profile.goal_tags)}`,
  ].join("<br>");
}

function stapleUnderuseVsTagSupportSection(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  const utilization = new Map(
    profileUtilization(rows).map((profile) => [
      utilizationKey(profile.gear_mode, profile.id),
      profile,
    ]),
  );
  const home = profileHomeUsage(config, rows);
  const ids = STAPLE_REVIEW_IDS[config.species] ?? [];
  const lines = [[
    "Profile",
    "Gear",
    "Tag support",
    "Home opp",
    "Selected home rate",
    "Common winners beating it",
    "Likely issue",
  ]];
  for (const id of ids) {
    const profile = catalogProfileForSide("lure", id) ??
      catalogProfileForSide("fly", id);
    if (!profile) continue;
    const side = profile.gear_mode as Side;
    const key = utilizationKey(side, id);
    const util = utilization.get(key);
    const homeEntry = home.get(key);
    lines.push([
      `${profile.display_name}<br>${id}`,
      side,
      tagSupportSummary(profile),
      String(homeEntry?.opportunities ?? 0),
      homeEntry && homeEntry.opportunities > 0
        ? `${homeEntry.selected}/${homeEntry.opportunities} (${
          percent(homeEntry.selected / homeEntry.opportunities)
        })`
        : "0/0",
      homeEntry ? compactCounts(homeEntry.commonWinners, 4) : "",
      stapleIssueClassification({
        profile,
        utilization: util,
        home: homeEntry,
      }),
    ]);
  }
  return table(lines);
}

function guideReviewTagCandidatesSection(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  const utilization = new Map(
    profileUtilization(rows).map((profile) => [
      utilizationKey(profile.gear_mode, profile.id),
      profile,
    ]),
  );
  const home = profileHomeUsage(config, rows);
  const overdominant = eligibleCatalogProfiles(rows).filter(
    ({ side, profile }) => {
      const key = utilizationKey(side, profile.id);
      const util = utilization.get(key);
      const homeEntry = home.get(key);
      return (util && util.selected >= UTILIZATION_OVER_SELECTED_MIN &&
        utilizationRate(util) > UTILIZATION_BROAD_SLOT_GUARDRAIL_RATE) ||
        (homeEntry &&
          homeEntry.opportunities >= SIGNATURE_HOME_GUARDRAIL_MIN &&
          homeEntry.selected / homeEntry.opportunities >
            SIGNATURE_HOME_WATCH_RATE);
    },
  );
  const removeReduce = overdominant
    .filter(({ profile }) =>
      stackRiskFlagsForProfile({
        profile,
        utilization: utilization.get(
          utilizationKey(profile.gear_mode, profile.id),
        ),
        home: home.get(utilizationKey(profile.gear_mode, profile.id)),
      }).some((flag) =>
        flag.includes("big_fish") || flag.includes("wind+dirty") ||
        flag.includes("goal_tags")
      )
    )
    .map(({ profile }) => `${profile.display_name} (${profile.id})`);

  const stapleRows = (STAPLE_REVIEW_IDS[config.species] ?? []).flatMap((id) => {
    const profile = catalogProfileForSide("lure", id) ??
      catalogProfileForSide("fly", id);
    if (!profile) return [];
    const side = profile.gear_mode as Side;
    const key = utilizationKey(side, id);
    return [{
      profile,
      utilization: utilization.get(key),
      home: home.get(key),
    }];
  });
  const missing = stapleRows
    .filter((entry) =>
      stapleIssueClassification(entry) === "possible missing tags"
    )
    .map((entry) => `${entry.profile.display_name} (${entry.profile.id})`);
  const selector = stapleRows
    .filter((entry) =>
      stapleIssueClassification(entry) ===
        "selector/direct-score or overpowered competitors"
    )
    .map((entry) => `${entry.profile.display_name} (${entry.profile.id})`);
  const needsReview = [
    ...overdominant.map(({ profile }) =>
      `${profile.display_name} (${profile.id})`
    ),
    ...stapleRows
      .filter((entry) =>
        ["scenario coverage", "scenario coverage or narrow home window"]
          .includes(
            stapleIssueClassification(entry),
          )
      )
      .map((entry) => `${entry.profile.display_name} (${entry.profile.id})`),
  ];

  return [
    "### High-confidence remove/reduce tag candidates",
    removeReduce.length
      ? uniqueStrings(removeReduce).join(", ")
      : "None from audit alone.",
    "",
    "### High-confidence missing tag candidates",
    missing.length
      ? uniqueStrings(missing).join(", ")
      : "None from audit alone.",
    "",
    "### Needs guide review",
    needsReview.length ? uniqueStrings(needsReview).join(", ") : "None.",
    "",
    "### Probably selector problem, not catalog problem",
    selector.length ? uniqueStrings(selector).join(", ") : "None.",
  ].join("\n");
}

function uniqueStrings(values: readonly string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function tagLoadAndStackRiskSection(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  return `### Tag Inventory

${tagLoadInventorySection(rows)}

### Stack Risk Flags

${tagLoadStackRiskSection(config, rows)}

### Tag Load vs Selection Share

${tagLoadSelectionShareSection(config, rows)}

### Likely Cause Classification

${likelyCauseClassificationSection(config, rows)}

### Staple Underuse vs Tag Support

${stapleUnderuseVsTagSupportSection(config, rows)}

### Guide Review Tag Candidates

${guideReviewTagCandidatesSection(config, rows)}`;
}

function utilizationNotes(rows: readonly AuditRow[]): string {
  const profiles = profileUtilization(rows);
  const zero = profiles.filter((profile) => profile.selected === 0);
  const lowUse = profiles.filter(isLowUseProfile);
  const overSelected = profiles.filter(isOverSelectedProfile);
  const notes: string[] = [];
  if (zero.length > 0) {
    notes.push(
      `- ${zero.length} eligible profile(s) were never selected despite appearing in candidate pools; these are prime coverage or selector-balance review targets.`,
    );
  }
  const lowClose = lowUse.filter((profile) =>
    profile.close_opportunities >= Math.max(10, profile.opportunities * 0.1)
  );
  if (lowClose.length > 0) {
    notes.push(
      `- ${lowClose.length} low-use profile(s) were often close to selected winners, which leans toward selector/catalog balance rather than pure scenario coverage.`,
    );
  }
  const lowFar = lowUse.filter((profile) =>
    profile.far_behind_opportunities >= profile.opportunities * 0.7
  );
  if (lowFar.length > 0) {
    notes.push(
      `- ${lowFar.length} low-use profile(s) were usually far behind winners; these may need better-fit scenarios or narrower catalog/seasonal expectations.`,
    );
  }
  if (overSelected.length > 0) {
    notes.push(
      `- ${overSelected.length} profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.`,
    );
  }
  return notes.length ? notes.join("\n") : "None.";
}

type WindowStrength = "home_window" | "secondary_window" | "poor_window";
type SignatureDiagnosis =
  | "healthy"
  | "underused_home_window"
  | "no_home_window_coverage"
  | "over-dominant"
  | "probably okay niche profile";

type SignatureProfileDefinition = {
  id: string;
  side: Side;
  label?: string;
};

type SignatureProfileSummary = {
  definition: SignatureProfileDefinition;
  display_name: string;
  candidate_opportunities: number;
  home_opportunities: number;
  secondary_opportunities: number;
  poor_opportunities: number;
  selected_overall: number;
  selected_home: number;
  close_home_losses: number;
  common_home_winners: Map<string, number>;
  home_contexts: Map<string, number>;
  home_by_goal: Map<string, number>;
  selected_home_by_goal: Map<string, number>;
  home_by_activity: Map<string, number>;
  home_by_clarity: Map<string, number>;
  home_by_water_type: Map<string, number>;
  home_by_bucket: Map<string, number>;
  home_loss_causes: Map<string, number>;
  home_loss_examples: SignatureLossExample[];
  diagnosis: SignatureDiagnosis;
};

type SignatureLossExample = {
  date: string;
  fishery: string;
  goal: Goal;
  clarity: WaterClarity;
  water_type: EngineContext;
  bucket: string;
  activity: string;
  candidate_score: number;
  winner: string;
  winner_score: number;
  score_delta: number;
  cause: string;
  candidate_reasons: readonly string[];
  winner_reasons: readonly string[];
};

type BladedWinExample = {
  date: string;
  fishery: string;
  goal: Goal;
  clarity: WaterClarity;
  water_type: EngineContext;
  bucket: string;
  activity: string;
  score: number;
  cause: string;
  reasons: readonly string[];
};

const SIGNATURE_PROFILES: Record<
  string,
  readonly SignatureProfileDefinition[]
> = {
  largemouth_bass: [
    { id: "spinnerbait", side: "lure" },
    { id: "bladed_jig", side: "lure" },
    { id: "compact_flipping_jig", side: "lure" },
    { id: "football_jig", side: "lure" },
    { id: "finesse_jig", side: "lure" },
    { id: "swim_jig", side: "lure" },
    { id: "texas_rigged_soft_plastic_craw", side: "lure" },
    { id: "carolina_rigged_stick_worm", side: "lure" },
    { id: "ned_rig", side: "lure" },
    { id: "shaky_head_worm", side: "lure" },
    { id: "weightless_stick_worm", side: "lure" },
    { id: "drop_shot_minnow", side: "lure" },
    { id: "soft_jerkbait", side: "lure" },
    { id: "hollow_body_frog", side: "lure" },
    { id: "buzzbait", side: "lure" },
    { id: "walking_topwater", side: "lure" },
    { id: "wake_bait", side: "lure" },
    { id: "popping_topwater", side: "lure" },
    { id: "squarebill_crankbait", side: "lure" },
    { id: "flat_sided_crankbait", side: "lure" },
    { id: "medium_diving_crankbait", side: "lure" },
    { id: "deep_diving_crankbait", side: "lure" },
    { id: "lipless_crankbait", side: "lure" },
    { id: "suspending_jerkbait", side: "lure" },
    { id: "paddle_tail_swimbait", side: "lure" },
    { id: "game_changer", side: "fly" },
    { id: "clouser_minnow", side: "fly" },
    { id: "deceiver", side: "fly" },
    { id: "articulated_baitfish_streamer", side: "fly" },
    { id: "baitfish_slider_fly", side: "fly" },
    { id: "unweighted_baitfish_streamer", side: "fly" },
    { id: "bluegill_streamer", side: "fly" },
    { id: "woolly_bugger", side: "fly" },
    { id: "rabbit_strip_leech", side: "fly" },
    { id: "warmwater_crawfish_fly", side: "fly" },
    { id: "warmwater_worm_fly", side: "fly" },
    { id: "popper_fly", side: "fly" },
    { id: "foam_gurgler_fly", side: "fly" },
    { id: "frog_fly", side: "fly" },
    { id: "deer_hair_slider", side: "fly" },
  ],
  smallmouth_bass: [
    { id: "ned_rig", side: "lure" },
    { id: "tube_jig", side: "lure" },
    { id: "big_smallmouth_tube", side: "lure" },
    { id: "suspending_jerkbait", side: "lure" },
    { id: "magnum_jerkbait", side: "lure" },
    { id: "soft_jerkbait", side: "lure" },
    { id: "drop_shot_minnow", side: "lure" },
    { id: "hair_jig", side: "lure" },
    { id: "football_jig", side: "lure" },
    { id: "finesse_jig", side: "lure" },
    { id: "texas_rigged_soft_plastic_craw", side: "lure" },
    { id: "crawfish_streamer", side: "fly" },
    { id: "warmwater_crawfish_fly", side: "fly" },
    { id: "sculpin_streamer", side: "fly" },
    { id: "muddler_sculpin", side: "fly", label: "Muddler Minnow" },
    { id: "inline_spinner", side: "lure" },
    { id: "spinnerbait", side: "lure" },
    { id: "bladed_jig", side: "lure" },
    { id: "blade_bait", side: "lure" },
    { id: "flat_sided_crankbait", side: "lure" },
    { id: "medium_diving_crankbait", side: "lure" },
    { id: "lipless_crankbait", side: "lure" },
    { id: "paddle_tail_swimbait", side: "lure" },
    { id: "walking_topwater", side: "lure" },
    { id: "buzzbait", side: "lure" },
    { id: "deer_hair_slider", side: "fly" },
    { id: "woolly_bugger", side: "fly" },
    { id: "clouser_minnow", side: "fly" },
    { id: "bucktail_baitfish_streamer", side: "fly" },
    { id: "conehead_streamer", side: "fly" },
    { id: "game_changer", side: "fly" },
    { id: "articulated_baitfish_streamer", side: "fly" },
    { id: "rabbit_strip_leech", side: "fly" },
    { id: "sculpzilla", side: "fly" },
  ],
  pike_musky: [
    { id: "casting_spoon", side: "lure" },
    { id: "weedless_spoon", side: "lure" },
    { id: "inline_spinner", side: "lure" },
    { id: "large_bucktail_spinner", side: "lure" },
    { id: "pike_spinnerbait", side: "lure" },
    { id: "large_profile_pike_swimbait", side: "lure" },
    { id: "pike_jerkbait", side: "lure" },
    { id: "pike_glidebait", side: "lure" },
    { id: "pike_jig_and_plastic", side: "lure" },
    { id: "large_pike_tube", side: "lure" },
    { id: "large_pike_topwater", side: "lure" },
    { id: "articulated_dungeon_streamer", side: "fly" },
    { id: "large_articulated_pike_streamer", side: "fly" },
    { id: "pike_bunny_streamer", side: "fly" },
    { id: "articulated_baitfish_streamer", side: "fly" },
    { id: "bucktail_baitfish_streamer", side: "fly" },
    { id: "deceiver", side: "fly" },
    { id: "game_changer", side: "fly" },
    { id: "rabbit_strip_leech", side: "fly" },
    { id: "unweighted_baitfish_streamer", side: "fly" },
    { id: "baitfish_slider_fly", side: "fly" },
    { id: "popper_fly", side: "fly" },
    { id: "deer_hair_slider", side: "fly" },
    { id: "foam_gurgler_fly", side: "fly" },
    { id: "frog_fly", side: "fly" },
    { id: "pike_flash_fly", side: "fly" },
  ],
  river_trout: [
    { id: "ned_rig", side: "lure" },
    { id: "hair_jig", side: "lure" },
    { id: "inline_spinner", side: "lure" },
    { id: "casting_spoon", side: "lure" },
    { id: "blade_bait", side: "lure" },
    { id: "suspending_jerkbait", side: "lure" },
    { id: "soft_jerkbait", side: "lure" },
    { id: "small_floating_trout_plug", side: "lure" },
    { id: "woolly_bugger", side: "fly" },
    { id: "rabbit_strip_leech", side: "fly" },
    { id: "jighead_marabou_leech", side: "fly" },
    { id: "lead_eye_leech", side: "fly" },
    { id: "feather_jig_leech", side: "fly" },
    { id: "sculpin_streamer", side: "fly" },
    { id: "sculpzilla", side: "fly" },
    { id: "muddler_sculpin", side: "fly", label: "Muddler Minnow" },
    { id: "crawfish_streamer", side: "fly" },
    { id: "clouser_minnow", side: "fly" },
    { id: "bucktail_baitfish_streamer", side: "fly" },
    { id: "slim_minnow_streamer", side: "fly" },
    { id: "articulated_baitfish_streamer", side: "fly" },
    { id: "articulated_dungeon_streamer", side: "fly" },
    { id: "game_changer", side: "fly" },
    { id: "conehead_streamer", side: "fly" },
    { id: "zonker_streamer", side: "fly" },
    { id: "unweighted_baitfish_streamer", side: "fly" },
    { id: "baitfish_slider_fly", side: "fly" },
    { id: "popper_fly", side: "fly" },
    { id: "deer_hair_slider", side: "fly" },
    { id: "mouse_fly", side: "fly" },
  ],
};

function rowHasTag(row: AuditRow, tag: ConditionTag): boolean {
  return row.daily_scenario_summary.condition_tags.includes(tag);
}

function rowHasAnyTag(row: AuditRow, tags: readonly ConditionTag[]): boolean {
  return tags.some((tag) => rowHasTag(row, tag));
}

function isCrawForage(row: AuditRow): boolean {
  return row.seasonal_row_summary.forage.primary === "crawfish" ||
    row.seasonal_row_summary.forage.secondary === "crawfish";
}

function isBottomSlow(candidate: ScoreSnapshot): boolean {
  return candidate.column === "bottom" &&
    (candidate.primary_pace === "slow" || candidate.secondary_pace === "slow");
}

function isToughNeutral(row: AuditRow): boolean {
  return ["tough", "suppressed", "neutral"].includes(
    row.daily_scenario_summary.activity,
  );
}

function isClearOrStained(row: AuditRow): boolean {
  return row.water_clarity === "clear" || row.water_clarity === "stained";
}

function isLowToModerateWind(row: AuditRow): boolean {
  return row.daily_scenario_summary.wind_mode !== "windy";
}

function isSpringFallWinter(row: AuditRow): boolean {
  return row.month <= 5 || row.month >= 9;
}

function isWarmSeason(row: AuditRow): boolean {
  return row.month >= 5 && row.month <= 10;
}

function isSurfaceHome(row: AuditRow): boolean {
  return row.daily_scenario_summary.surface_gate === "open" &&
    isWarmSeason(row) &&
    rowHasAnyTag(row, ["low_light_surface", "calm_surface"]);
}

function isReactionHome(row: AuditRow): boolean {
  return rowHasAnyTag(row, ["wind_reaction", "dirty_vibration"]) ||
    row.water_clarity === "dirty" ||
    row.daily_scenario_summary.activity === "active";
}

function isPowerReactionHome(row: AuditRow): boolean {
  return row.water_clarity !== "clear" &&
    (rowHasAnyTag(row, ["wind_reaction", "dirty_vibration"]) ||
      row.daily_scenario_summary.activity === "active");
}

function isBladedJigHome(row: AuditRow): boolean {
  return row.water_clarity !== "clear" && rowHasTag(row, "dirty_vibration");
}

function isOpenWaterBaitfishHome(row: AuditRow): boolean {
  return row.seasonal_row_summary.forage.primary !== "crawfish" &&
    rowHasAnyTag(row, ["warming_search", "open_water_search"]) &&
    !rowHasTag(row, "dirty_vibration");
}

function isClearFinesseHome(row: AuditRow): boolean {
  return isClearOrStained(row) &&
    isLowToModerateWind(row) &&
    isToughNeutral(row) &&
    (rowHasAnyTag(row, ["cold_slow", "clear_subtle", "heat_finesse"]) ||
      row.condition_buckets.includes("cold_slow_or_front"));
}

function isCrawBottomHome(row: AuditRow, candidate: ScoreSnapshot): boolean {
  return isBottomSlow(candidate) &&
    isCrawForage(row) &&
    isClearOrStained(row) &&
    !rowHasTag(row, "dirty_vibration") &&
    (rowHasAnyTag(row, ["cold_slow", "clear_subtle", "current_swing"]) ||
      row.condition_buckets.includes("cold_slow_or_front") ||
      row.water_type === "freshwater_river");
}

function isPikeColdOrLateHome(row: AuditRow): boolean {
  return rowHasTag(row, "cold_slow") ||
    row.condition_buckets.includes("cold_slow_or_front") ||
    row.month <= 4 ||
    row.month >= 11;
}

function isPikeRiverCurrentHome(row: AuditRow): boolean {
  return row.water_type === "freshwater_river" &&
    (rowHasTag(row, "current_swing") ||
      row.condition_buckets.includes("river_elevated_runoff_current"));
}

function isPikeReactionHome(row: AuditRow): boolean {
  return rowHasAnyTag(row, ["wind_reaction", "dirty_vibration"]) ||
    row.water_clarity === "dirty" ||
    row.daily_scenario_summary.activity === "active";
}

function isPikeBaitfishSearchHome(row: AuditRow): boolean {
  return rowHasAnyTag(row, [
    "warming_search",
    "open_water_search",
    "wind_reaction",
    "current_swing",
  ]) || (row.month >= 5 && row.month <= 10);
}

function isPikeClearControlledHome(row: AuditRow): boolean {
  return isClearOrStained(row) &&
    rowHasAnyTag(row, ["clear_subtle", "cold_slow", "warming_search"]) &&
    !rowHasTag(row, "dirty_vibration");
}

function isTroutRunoffStreamerHome(row: AuditRow): boolean {
  return row.water_type === "freshwater_river" &&
    (rowHasTag(row, "runoff_streamer") ||
      (row.condition_buckets.includes("river_elevated_runoff_current") &&
        row.water_clarity !== "clear"));
}

function isTroutCurrentHome(row: AuditRow): boolean {
  return row.water_type === "freshwater_river" &&
    (rowHasTag(row, "current_swing") ||
      row.condition_buckets.includes("river_elevated_runoff_current"));
}

function isTroutClearControlHome(row: AuditRow): boolean {
  return isClearOrStained(row) &&
    isLowToModerateWind(row) &&
    !rowHasTag(row, "dirty_vibration") &&
    (rowHasAnyTag(row, ["clear_subtle", "cold_slow", "heat_finesse"]) ||
      row.condition_buckets.includes("cold_slow_or_front"));
}

function isTroutBaitfishSearchHome(row: AuditRow): boolean {
  return rowHasAnyTag(row, [
    "warming_search",
    "open_water_search",
    "wind_reaction",
  ]) && !rowHasTag(row, "heat_finesse");
}

function isTroutSurfaceHome(row: AuditRow): boolean {
  return row.water_type === "freshwater_river" &&
    row.daily_scenario_summary.surface_gate === "open" &&
    row.month >= 6 && row.month <= 9 &&
    rowHasAnyTag(row, ["low_light_surface", "calm_surface"]) &&
    !rowHasTag(row, "cold_slow");
}

function isTroutBigFishStreamerHome(row: AuditRow): boolean {
  return row.recommendation_goal === "big_fish" &&
    (isTroutRunoffStreamerHome(row) || isTroutCurrentHome(row) ||
      rowHasAnyTag(row, ["low_light_surface", "warming_search"]) ||
      (row.month >= 9 && row.month <= 11));
}

function classifySignatureWindow(
  config: SpeciesAuditConfig,
  row: AuditRow,
  candidate: ScoreSnapshot,
): WindowStrength {
  const id = candidate.id;
  const surfaceHome = isSurfaceHome(row);
  const reactionHome = isReactionHome(row);
  const clearFinesseHome = isClearFinesseHome(row);
  const crawBottomHome = isCrawBottomHome(row, candidate);
  const springReaction = isSpringFallWinter(row) &&
    isClearOrStained(row) &&
    rowHasAnyTag(row, ["cold_slow", "clear_subtle", "warming_search"]);

  if (config.species === "pike_musky") {
    const pikeCold = isPikeColdOrLateHome(row);
    const pikeRiver = isPikeRiverCurrentHome(row);
    const pikeReaction = isPikeReactionHome(row);
    const pikeSearch = isPikeBaitfishSearchHome(row);
    const pikeClearControlled = isPikeClearControlledHome(row);
    const pikeHeatCaution = rowHasTag(row, "heat_finesse");
    const pikeFall = row.month >= 9 && row.month <= 11;

    if (
      id === "large_pike_topwater" || id === "popper_fly" ||
      id === "deer_hair_slider" || id === "foam_gurgler_fly" ||
      id === "frog_fly"
    ) {
      if (surfaceHome) return "home_window";
      if (
        row.daily_scenario_summary.surface_gate === "open" &&
        row.month >= 5 && row.month <= 9
      ) return "secondary_window";
      return "poor_window";
    }

    if (id === "pike_jig_and_plastic" || id === "large_pike_tube") {
      if (
        pikeCold || pikeRiver || pikeHeatCaution ||
        (id === "pike_jig_and_plastic" && pikeReaction)
      ) return "home_window";
      if (isBottomSlow(candidate) || isClearOrStained(row)) {
        return "secondary_window";
      }
      return "poor_window";
    }

    if (id === "casting_spoon" || id === "weedless_spoon") {
      if (
        id === "weedless_spoon" &&
        row.water_type === "freshwater_lake_pond" &&
        (pikeReaction || surfaceHome || (row.month >= 5 && row.month <= 9))
      ) return "home_window";
      if (
        id === "casting_spoon" &&
        (pikeCold || pikeReaction || pikeRiver || pikeFall)
      ) return "home_window";
      if (pikeSearch || isClearOrStained(row)) return "secondary_window";
      return "poor_window";
    }

    if (
      id === "inline_spinner" || id === "large_bucktail_spinner" ||
      id === "pike_spinnerbait"
    ) {
      if (
        id === "pike_spinnerbait" &&
        row.water_clarity !== "clear" &&
        pikeReaction
      ) return "home_window";
      if (
        id === "large_bucktail_spinner" &&
        (pikeReaction || pikeSearch || pikeRiver)
      ) return "home_window";
      if (
        id === "inline_spinner" &&
        (pikeRiver || pikeReaction || rowHasTag(row, "warming_search"))
      ) return "home_window";
      if (pikeSearch || row.water_clarity !== "dirty") {
        return "secondary_window";
      }
      return "poor_window";
    }

    if (
      id === "large_profile_pike_swimbait" || id === "pike_jerkbait" ||
      id === "pike_glidebait"
    ) {
      if (
        id === "pike_glidebait" &&
        row.recommendation_goal === "big_fish" &&
        (pikeClearControlled || pikeFall)
      ) return "home_window";
      if (
        id === "pike_jerkbait" &&
        (pikeCold || pikeReaction || pikeClearControlled || pikeFall)
      ) return "home_window";
      if (
        id === "large_profile_pike_swimbait" &&
        (pikeSearch || pikeReaction || row.recommendation_goal === "big_fish")
      ) return "home_window";
      if (isClearOrStained(row) || pikeSearch) return "secondary_window";
      return "poor_window";
    }

    if (
      id === "articulated_dungeon_streamer" ||
      id === "large_articulated_pike_streamer" ||
      id === "pike_bunny_streamer"
    ) {
      if (
        pikeCold || pikeReaction || pikeRiver ||
        row.recommendation_goal === "big_fish"
      ) return "home_window";
      if (pikeSearch || isClearOrStained(row)) return "secondary_window";
      return "poor_window";
    }

    if (
      id === "articulated_baitfish_streamer" ||
      id === "bucktail_baitfish_streamer" || id === "deceiver" ||
      id === "game_changer" || id === "rabbit_strip_leech" ||
      id === "unweighted_baitfish_streamer" ||
      id === "baitfish_slider_fly" || id === "pike_flash_fly"
    ) {
      if (pikeSearch || pikeReaction || pikeRiver) return "home_window";
      if (isClearOrStained(row) || pikeCold) return "secondary_window";
      return "poor_window";
    }
  }

  if (config.species === "river_trout") {
    const troutSurface = isTroutSurfaceHome(row);
    const troutRunoff = isTroutRunoffStreamerHome(row);
    const troutCurrent = isTroutCurrentHome(row);
    const troutClearControl = isTroutClearControlHome(row);
    const troutBaitfishSearch = isTroutBaitfishSearchHome(row);
    const troutBigFishStreamer = isTroutBigFishStreamerHome(row);

    if (
      id === "small_floating_trout_plug" || id === "popper_fly" ||
      id === "deer_hair_slider" || id === "mouse_fly"
    ) {
      if (troutSurface) return "home_window";
      if (
        row.daily_scenario_summary.surface_gate === "open" &&
        row.month >= 6 && row.month <= 9
      ) return "secondary_window";
      return "poor_window";
    }

    if (
      id === "ned_rig" || id === "hair_jig" || id === "blade_bait" ||
      id === "lead_eye_leech" || id === "jighead_marabou_leech" ||
      id === "muddler_sculpin" || id === "sculpin_streamer" ||
      id === "crawfish_streamer"
    ) {
      if (
        troutClearControl || troutCurrent ||
        (rowHasAnyTag(row, ["cold_slow", "heat_finesse"]) &&
          isBottomSlow(candidate))
      ) return "home_window";
      if (isClearOrStained(row) || troutCurrent) return "secondary_window";
      return "poor_window";
    }

    if (
      id === "woolly_bugger" || id === "rabbit_strip_leech" ||
      id === "feather_jig_leech"
    ) {
      if (
        troutClearControl || troutCurrent ||
        rowHasAnyTag(row, ["cold_slow", "warming_search"])
      ) return "home_window";
      if (isClearOrStained(row) || row.water_clarity === "dirty") {
        return "secondary_window";
      }
      return "poor_window";
    }

    if (
      id === "articulated_baitfish_streamer" ||
      id === "articulated_dungeon_streamer" ||
      id === "sculpzilla" || id === "game_changer" ||
      id === "conehead_streamer" || id === "zonker_streamer"
    ) {
      if (troutRunoff || troutBigFishStreamer || troutBaitfishSearch) {
        return "home_window";
      }
      if (troutCurrent || isClearOrStained(row)) return "secondary_window";
      return "poor_window";
    }

    if (
      id === "clouser_minnow" || id === "bucktail_baitfish_streamer" ||
      id === "slim_minnow_streamer" ||
      id === "unweighted_baitfish_streamer" ||
      id === "baitfish_slider_fly"
    ) {
      if (troutCurrent || troutBaitfishSearch || troutRunoff) {
        return "home_window";
      }
      if (isClearOrStained(row)) return "secondary_window";
      return "poor_window";
    }

    if (
      id === "inline_spinner" || id === "casting_spoon" ||
      id === "suspending_jerkbait" || id === "soft_jerkbait"
    ) {
      if (
        (troutCurrent || troutBaitfishSearch ||
          rowHasTag(row, "wind_reaction")) &&
        !rowHasTag(row, "heat_finesse")
      ) return "home_window";
      if (isClearOrStained(row) || troutCurrent) return "secondary_window";
      return "poor_window";
    }
  }

  if (config.species === "smallmouth_bass") {
    if (id === "ned_rig") {
      if (clearFinesseHome && isBottomSlow(candidate)) return "home_window";
      if (isClearOrStained(row) && isBottomSlow(candidate)) {
        return "secondary_window";
      }
      return "poor_window";
    }
    if (id === "tube_jig" || id === "big_smallmouth_tube") {
      if (
        isClearOrStained(row) &&
        isBottomSlow(candidate) &&
        (rowHasAnyTag(row, ["cold_slow", "clear_subtle", "current_swing"]) ||
          isCrawForage(row) || row.water_type === "freshwater_river")
      ) return "home_window";
      if (isClearOrStained(row) && isBottomSlow(candidate)) {
        return "secondary_window";
      }
      return "poor_window";
    }
    if (id === "suspending_jerkbait") {
      if (springReaction) return "home_window";
      if (isClearOrStained(row) && rowHasTag(row, "wind_reaction")) {
        return "secondary_window";
      }
      return "poor_window";
    }
    if (id === "magnum_jerkbait") {
      if (row.recommendation_goal === "big_fish" && springReaction) {
        return "home_window";
      }
      if (
        isClearOrStained(row) && rowHasAnyTag(row, [
          "cold_slow",
          "warming_search",
          "wind_reaction",
        ])
      ) return "secondary_window";
      return "poor_window";
    }
    if (id === "soft_jerkbait") {
      if (
        isClearOrStained(row) &&
        isToughNeutral(row) &&
        rowHasAnyTag(row, ["clear_subtle", "warming_search"])
      ) return "home_window";
      if (isClearOrStained(row) && rowHasTag(row, "open_water_search")) {
        return "secondary_window";
      }
      return "poor_window";
    }
    if (id === "drop_shot_minnow") {
      if (
        row.water_clarity === "clear" &&
        isToughNeutral(row) &&
        rowHasAnyTag(row, ["heat_finesse", "clear_subtle"])
      ) return "home_window";
      if (isClearOrStained(row) && isToughNeutral(row)) {
        return "secondary_window";
      }
      return "poor_window";
    }
    if (
      id === "hair_jig" || id === "football_jig" ||
      id === "finesse_jig" || id === "texas_rigged_soft_plastic_craw" ||
      id === "crawfish_streamer" || id === "warmwater_crawfish_fly" ||
      id === "sculpin_streamer" || id === "muddler_sculpin"
    ) {
      if (crawBottomHome || rowHasTag(row, "current_swing")) {
        return "home_window";
      }
      if (
        isClearOrStained(row) && (isCrawForage(row) || isBottomSlow(candidate))
      ) {
        return "secondary_window";
      }
      return "poor_window";
    }
    if (
      id === "inline_spinner" || id === "bladed_jig" ||
      id === "lipless_crankbait" || id === "blade_bait" ||
      id === "flat_sided_crankbait" || id === "medium_diving_crankbait"
    ) {
      if (id === "inline_spinner") {
        if (
          row.water_type === "freshwater_river" &&
          isClearOrStained(row) &&
          rowHasAnyTag(row, [
            "current_swing",
            "open_water_search",
            "wind_reaction",
          ])
        ) return "home_window";
        if (reactionHome) return "secondary_window";
        return "poor_window";
      }
      if (id === "blade_bait") {
        if (
          isClearOrStained(row) &&
          rowHasAnyTag(row, ["cold_slow", "wind_reaction"])
        ) return "home_window";
        if (isReactionHome(row)) return "secondary_window";
        return "poor_window";
      }
      if (id === "bladed_jig") {
        if (isBladedJigHome(row)) return "home_window";
        if (isPowerReactionHome(row)) return "secondary_window";
        return "poor_window";
      }
      if (isPowerReactionHome(row)) return "home_window";
      if (rowHasTag(row, "warming_search")) return "secondary_window";
      return "poor_window";
    }
    if (
      id === "walking_topwater" || id === "buzzbait" ||
      id === "deer_hair_slider"
    ) {
      if (
        surfaceHome || (row.water_type === "freshwater_river" && surfaceHome)
      ) {
        return "home_window";
      }
      if (
        row.daily_scenario_summary.surface_gate === "open" && isWarmSeason(row)
      ) {
        return "secondary_window";
      }
      return "poor_window";
    }
    if (
      id === "paddle_tail_swimbait" || id === "game_changer" ||
      id === "articulated_baitfish_streamer" ||
      id === "clouser_minnow" || id === "bucktail_baitfish_streamer" ||
      id === "conehead_streamer" || id === "deceiver"
    ) {
      if (
        isOpenWaterBaitfishHome(row) ||
        rowHasAnyTag(row, ["wind_reaction", "current_swing"])
      ) return "home_window";
      if (isClearOrStained(row)) return "secondary_window";
      return "poor_window";
    }
    if (
      id === "woolly_bugger" || id === "rabbit_strip_leech" ||
      id === "sculpzilla"
    ) {
      if (crawBottomHome || rowHasAnyTag(row, ["cold_slow", "current_swing"])) {
        return "home_window";
      }
      if (isClearOrStained(row)) return "secondary_window";
      return "poor_window";
    }
  }

  if (
    id === "spinnerbait" || id === "bladed_jig" ||
    id === "lipless_crankbait" || id === "squarebill_crankbait" ||
    id === "flat_sided_crankbait" || id === "medium_diving_crankbait" ||
    id === "deep_diving_crankbait"
  ) {
    if (id === "bladed_jig") {
      if (isBladedJigHome(row)) return "home_window";
      if (isPowerReactionHome(row)) return "secondary_window";
      return "poor_window";
    }
    if (isPowerReactionHome(row)) return "home_window";
    if (rowHasTag(row, "warming_search")) return "secondary_window";
    return "poor_window";
  }
  if (
    id === "compact_flipping_jig" || id === "football_jig" ||
    id === "finesse_jig" || id === "texas_rigged_soft_plastic_craw" ||
    id === "swim_jig"
  ) {
    if (id === "swim_jig") {
      if (isOpenWaterBaitfishHome(row) || isPowerReactionHome(row)) {
        return "home_window";
      }
      if (isClearOrStained(row)) return "secondary_window";
      return "poor_window";
    }
    if (crawBottomHome) return "home_window";
    if (
      (id === "compact_flipping_jig" || id === "football_jig") &&
      row.recommendation_goal === "big_fish" &&
      isCrawForage(row) &&
      row.water_clarity === "stained" &&
      !rowHasTag(row, "dirty_vibration")
    ) return "home_window";
    if (isCrawForage(row) && isBottomSlow(candidate)) return "secondary_window";
    return "poor_window";
  }
  if (
    id === "carolina_rigged_stick_worm" || id === "ned_rig" ||
    id === "shaky_head_worm"
  ) {
    if (clearFinesseHome && isBottomSlow(candidate)) return "home_window";
    if (isClearOrStained(row) && isBottomSlow(candidate)) {
      return "secondary_window";
    }
    return "poor_window";
  }
  if (
    id === "weightless_stick_worm" || id === "drop_shot_minnow" ||
    id === "soft_jerkbait"
  ) {
    if (
      row.water_clarity === "clear" &&
      isToughNeutral(row) &&
      rowHasAnyTag(row, ["heat_finesse", "clear_subtle"])
    ) return "home_window";
    if (isClearOrStained(row) && isToughNeutral(row)) return "secondary_window";
    return "poor_window";
  }
  if (
    id === "hollow_body_frog" || id === "buzzbait" ||
    id === "walking_topwater" || id === "wake_bait" ||
    id === "popping_topwater" || id === "frog_fly" ||
    id === "deer_hair_slider" || id === "popper_fly" ||
    id === "foam_gurgler_fly"
  ) {
    if (surfaceHome) return "home_window";
    if (
      row.daily_scenario_summary.surface_gate === "open" && isWarmSeason(row)
    ) {
      return "secondary_window";
    }
    return "poor_window";
  }
  if (id === "suspending_jerkbait") {
    if (springReaction) return "home_window";
    if (isClearOrStained(row) && rowHasTag(row, "wind_reaction")) {
      return "secondary_window";
    }
    return "poor_window";
  }
  if (
    id === "paddle_tail_swimbait" || id === "bluegill_streamer" ||
    id === "game_changer" || id === "articulated_baitfish_streamer" ||
    id === "baitfish_slider_fly" || id === "unweighted_baitfish_streamer" ||
    id === "clouser_minnow" || id === "deceiver"
  ) {
    if (isOpenWaterBaitfishHome(row)) return "home_window";
    if (isClearOrStained(row)) return "secondary_window";
    return "poor_window";
  }
  if (
    id === "woolly_bugger" || id === "rabbit_strip_leech" ||
    id === "warmwater_crawfish_fly" || id === "warmwater_worm_fly"
  ) {
    if (crawBottomHome || rowHasAnyTag(row, ["cold_slow", "clear_subtle"])) {
      return "home_window";
    }
    if (isClearOrStained(row)) return "secondary_window";
    return "poor_window";
  }

  return "secondary_window";
}

function scoreReasonValue(
  candidate: PickSnapshot | ScoreSnapshot,
  prefix: string,
): number {
  let total = 0;
  for (const reason of candidate.score_reasons) {
    if (!reason.startsWith(prefix)) continue;
    const match = reason.match(/:([+-]?\d+)$/);
    if (match) total += Number(match[1]);
  }
  return total;
}

function hasReasonPrefix(
  candidate: PickSnapshot | ScoreSnapshot,
  prefix: string,
): boolean {
  return candidate.score_reasons.some((reason) => reason.startsWith(prefix));
}

function scoreLaneBreakdown(candidate: PickSnapshot | ScoreSnapshot): {
  condition: number;
  goal: number;
  forage: number;
  clarity: number;
  baseline: number;
} {
  return {
    condition: scoreReasonValue(candidate, "condition_tag:"),
    goal: scoreReasonValue(candidate, "goal:"),
    forage: scoreReasonValue(candidate, "primary_forage:") +
      scoreReasonValue(candidate, "secondary_forage:"),
    clarity: scoreReasonValue(candidate, "clarity_strength:"),
    baseline: scoreReasonValue(candidate, "baseline_"),
  };
}

function classifySignatureLoss(
  candidate: ScoreSnapshot,
  winner: PickSnapshot,
): string {
  const candidateLanes = scoreLaneBreakdown(candidate);
  const winnerLanes = scoreLaneBreakdown(winner);
  if (candidate.score >= winner.score) {
    return "selector_filtering_variety_jitter";
  }
  if (winnerLanes.goal > candidateLanes.goal) return "goal_tags";
  if (winnerLanes.condition > candidateLanes.condition) {
    return "daily_condition_tags";
  }
  if (
    winnerLanes.forage + winnerLanes.clarity >
      candidateLanes.forage + candidateLanes.clarity
  ) {
    return "forage_clarity_stack";
  }
  if (winnerLanes.baseline > candidateLanes.baseline) {
    return "seasonal_baseline";
  }
  return "raw_score";
}

function classifyBladedHomeWin(row: AuditRow, pick: PickSnapshot): string {
  const lanes = scoreLaneBreakdown(pick);
  const hasWind = hasReasonPrefix(pick, "condition_tag:wind_reaction:");
  const hasDirty = hasReasonPrefix(pick, "condition_tag:dirty_vibration:");
  if (hasWind && hasDirty) return "score_condition_stack";
  if (row.recommendation_goal === "big_fish" && lanes.goal > 0) {
    return "big_fish_goal_gate";
  }
  if (row.recommendation_goal === "all_purpose" && lanes.goal > 0) {
    return "all_purpose_goal_fit";
  }
  if (lanes.forage + lanes.clarity >= 14) return "forage_clarity_stack";
  if (lanes.baseline >= 16) return "mid_medium_baseline";
  return "selector_filtering_variety_jitter";
}

function firstBucket(row: AuditRow): string {
  return row.condition_buckets[0] ?? "uncategorized";
}

function signatureDefinitions(
  config: SpeciesAuditConfig,
): readonly SignatureProfileDefinition[] {
  return SIGNATURE_PROFILES[config.species] ?? [];
}

function summarizeSignatureProfiles(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): SignatureProfileSummary[] {
  const summaries = new Map<string, SignatureProfileSummary>();
  const definitions = signatureDefinitions(config);
  for (const definition of definitions) {
    const profileMap =
      (definition.side === "lure" ? LURE_BY_ID : FLY_BY_ID) as Map<
        string,
        ArchetypeProfileV4
      >;
    const profile = profileMap.get(definition.id);
    summaries.set(utilizationKey(definition.side, definition.id), {
      definition,
      display_name: definition.label ?? profile?.display_name ?? definition.id,
      candidate_opportunities: 0,
      home_opportunities: 0,
      secondary_opportunities: 0,
      poor_opportunities: 0,
      selected_overall: 0,
      selected_home: 0,
      close_home_losses: 0,
      common_home_winners: new Map(),
      home_contexts: new Map(),
      home_by_goal: new Map(),
      selected_home_by_goal: new Map(),
      home_by_activity: new Map(),
      home_by_clarity: new Map(),
      home_by_water_type: new Map(),
      home_by_bucket: new Map(),
      home_loss_causes: new Map(),
      home_loss_examples: [],
      diagnosis: "probably okay niche profile",
    });
  }

  for (const row of rows) {
    for (const definition of definitions) {
      const key = utilizationKey(definition.side, definition.id);
      const summary = summaries.get(key);
      if (!summary) continue;
      const candidate = sideCandidates(row, definition.side).find((entry) =>
        entry.id === definition.id
      );
      const selected = row.selected_picks.find((pick) =>
        pick.gear_mode === definition.side && pick.id === definition.id
      );
      if (selected) summary.selected_overall += 1;
      if (!candidate) continue;

      summary.candidate_opportunities += 1;
      const window = classifySignatureWindow(config, row, candidate);
      if (window === "home_window") summary.home_opportunities += 1;
      if (window === "secondary_window") summary.secondary_opportunities += 1;
      if (window === "poor_window") summary.poor_opportunities += 1;

      if (window !== "home_window") continue;
      const context = [
        row.recommendation_goal,
        row.water_clarity,
        row.water_type,
        firstBucket(row),
      ].join(" / ");
      incrementMap(summary.home_contexts, context);
      incrementMap(summary.home_by_goal, row.recommendation_goal);
      incrementMap(
        summary.home_by_activity,
        row.daily_scenario_summary.activity,
      );
      incrementMap(summary.home_by_clarity, row.water_clarity);
      incrementMap(summary.home_by_water_type, row.water_type);
      incrementMap(summary.home_by_bucket, firstBucket(row));
      if (selected) {
        summary.selected_home += 1;
        incrementMap(summary.selected_home_by_goal, row.recommendation_goal);
        continue;
      }

      const selectedSameSide = row.selected_picks.filter((pick) =>
        pick.gear_mode === definition.side
      );
      const bestSelected = selectedSameSide.sort((a, b) =>
        b.score - a.score ||
        a.id.localeCompare(b.id)
      )[0];
      if (!bestSelected) continue;
      const scoreGap = bestSelected.score - candidate.score;
      if (scoreGap <= UTILIZATION_CLOSE_SCORE_GAP) {
        summary.close_home_losses += 1;
      }
      const lossCause = classifySignatureLoss(candidate, bestSelected);
      incrementMap(summary.home_loss_causes, lossCause);
      if (summary.home_loss_examples.length < 24) {
        summary.home_loss_examples.push({
          date: row.date,
          fishery: row.fishery_label,
          goal: row.recommendation_goal,
          clarity: row.water_clarity,
          water_type: row.water_type,
          bucket: firstBucket(row),
          activity: row.daily_scenario_summary.activity,
          candidate_score: candidate.score,
          winner: bestSelected.display_name,
          winner_score: bestSelected.score,
          score_delta: bestSelected.score - candidate.score,
          cause: lossCause,
          candidate_reasons: candidate.score_reasons,
          winner_reasons: bestSelected.score_reasons,
        });
      }
      const winners = selectedSameSide.map((pick) =>
        `${pick.display_name} (${selectedSlotKind(pick.slot)})`
      ).join(", ");
      incrementMap(summary.common_home_winners, winners);
    }
  }

  for (const summary of summaries.values()) {
    summary.diagnosis = diagnoseSignatureProfile(summary);
  }

  return [...summaries.values()].sort((a, b) =>
    a.definition.side.localeCompare(b.definition.side) ||
    b.home_opportunities - a.home_opportunities ||
    a.display_name.localeCompare(b.display_name)
  );
}

function signatureHomeRate(summary: SignatureProfileSummary): number {
  return summary.home_opportunities === 0
    ? 0
    : summary.selected_home / summary.home_opportunities;
}

function signatureOverallRate(summary: SignatureProfileSummary): number {
  return summary.candidate_opportunities === 0
    ? 0
    : summary.selected_overall / summary.candidate_opportunities;
}

function diagnoseSignatureProfile(
  summary: SignatureProfileSummary,
): SignatureDiagnosis {
  const homeRate = signatureHomeRate(summary);
  const overallRate = signatureOverallRate(summary);
  if (summary.candidate_opportunities > 0 && summary.home_opportunities === 0) {
    return "no_home_window_coverage";
  }
  if (
    summary.selected_overall >= UTILIZATION_OVER_SELECTED_MIN &&
    (overallRate >= UTILIZATION_OVER_RATE ||
      (summary.home_opportunities >= SIGNATURE_HOME_GUARDRAIL_MIN &&
        homeRate > SIGNATURE_HOME_OVER_RATE))
  ) {
    return "over-dominant";
  }
  if (
    summary.home_opportunities >= 12 &&
    (summary.selected_home === 0 ||
      (homeRate < 0.08 && summary.close_home_losses >= 3))
  ) {
    return "underused_home_window";
  }
  if (
    summary.home_opportunities < 12 &&
    summary.selected_home <= 1
  ) {
    return "probably okay niche profile";
  }
  return "healthy";
}

function signatureProfileSummarySection(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  const summaries = summarizeSignatureProfiles(config, rows);
  const lines = [
    ["Diagnosis", "Profiles"],
  ];
  for (
    const diagnosis of [
      "healthy",
      "underused_home_window",
      "no_home_window_coverage",
      "over-dominant",
      "probably okay niche profile",
    ] as const
  ) {
    const profiles = summaries.filter((summary) =>
      summary.diagnosis === diagnosis
    );
    lines.push([
      diagnosis,
      profiles.length
        ? profiles.map((summary) => summary.display_name).join(", ")
        : "None",
    ]);
  }
  return table(lines);
}

function signatureProfilesSection(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  const summaries = summarizeSignatureProfiles(config, rows);
  const utilization = new Map(
    profileUtilization(rows).map((profile) => [
      utilizationKey(profile.gear_mode, profile.id),
      profile,
    ]),
  );
  const lines = [
    [
      "Profile",
      "Gear",
      "Actual side share",
      "Selected/Opp",
      "Selected/home",
      "Selected overall",
      "Selected home",
      "Home win rate",
      "AP home",
      "Big Fish home",
      "Close home losses",
      "Diagnosis",
      "Home context split",
      "Common home winners",
    ],
  ];
  for (const summary of summaries) {
    const util = utilization.get(
      utilizationKey(summary.definition.side, summary.definition.id),
    );
    const sideShare = util ? actualSlotShareMetrics(util, rows).sideShare : 0;
    lines.push([
      `${summary.display_name}<br>${summary.definition.id}`,
      summary.definition.side,
      percent(sideShare),
      `${summary.selected_overall}/${summary.candidate_opportunities}`,
      `${summary.selected_home}/${summary.home_opportunities}`,
      String(summary.selected_overall),
      String(summary.selected_home),
      percent(signatureHomeRate(summary)),
      `${summary.selected_home_by_goal.get("all_purpose") ?? 0}/${
        summary.home_by_goal.get("all_purpose") ?? 0
      }`,
      `${summary.selected_home_by_goal.get("big_fish") ?? 0}/${
        summary.home_by_goal.get("big_fish") ?? 0
      }`,
      String(summary.close_home_losses),
      summary.diagnosis,
      [
        `activity ${compactCounts(summary.home_by_activity, 3)}`,
        `clarity ${compactCounts(summary.home_by_clarity, 3)}`,
        `water ${compactCounts(summary.home_by_water_type, 2)}`,
        `bucket ${compactCounts(summary.home_by_bucket, 3)}`,
      ].join("<br>"),
      compactCounts(summary.common_home_winners, 3),
    ]);
  }
  return table(lines);
}

function signatureDiagnosisSection(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
  diagnosis: SignatureDiagnosis,
): string {
  const summaries = summarizeSignatureProfiles(config, rows)
    .filter((summary) => summary.diagnosis === diagnosis)
    .sort((a, b) =>
      b.home_opportunities - a.home_opportunities ||
      b.close_home_losses - a.close_home_losses ||
      a.display_name.localeCompare(b.display_name)
    );
  if (summaries.length === 0) return "None.";
  const lines = [
    [
      "Profile",
      "Gear",
      "Home selected/opp",
      "Home rate",
      "Close home losses",
      "Home contexts",
      "Loss causes",
      "Common winners",
    ],
  ];
  for (const summary of summaries) {
    lines.push([
      `${summary.display_name}<br>${summary.definition.id}`,
      summary.definition.side,
      `${summary.selected_home}/${summary.home_opportunities}`,
      percent(signatureHomeRate(summary)),
      String(summary.close_home_losses),
      compactCounts(summary.home_contexts, 4),
      compactCounts(summary.home_loss_causes, 4),
      compactCounts(summary.common_home_winners, 4),
    ]);
  }
  return table(lines);
}

function bladedHomeWinDiagnostics(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  const causeCounts = new Map<string, number>();
  const examples: BladedWinExample[] = [];
  for (const row of rows) {
    const pick = row.selected_picks.find((entry) => entry.id === "bladed_jig");
    if (!pick) continue;
    const candidate = row.all_lure_candidates.find((entry) =>
      entry.id === "bladed_jig"
    );
    if (!candidate) continue;
    if (classifySignatureWindow(config, row, candidate) !== "home_window") {
      continue;
    }
    const cause = classifyBladedHomeWin(row, pick);
    incrementMap(causeCounts, cause);
    if (examples.length < 20) {
      examples.push({
        date: row.date,
        fishery: row.fishery_label,
        goal: row.recommendation_goal,
        clarity: row.water_clarity,
        water_type: row.water_type,
        bucket: firstBucket(row),
        activity: row.daily_scenario_summary.activity,
        score: pick.score,
        cause,
        reasons: pick.score_reasons,
      });
    }
  }
  const summary = table([
    ["Cause", "Bladed Jig home-window wins"],
    ...[...causeCounts.entries()].sort((a, b) => b[1] - a[1]).map((
      [cause, count],
    ) => [cause, String(count)]),
  ]);
  const exampleRows = examples.map((entry) => [
    `${entry.fishery}<br>${entry.date}`,
    `${entry.goal}<br>${entry.clarity}<br>${entry.water_type}`,
    `${entry.bucket}<br>${entry.activity}`,
    String(entry.score),
    entry.cause,
    entry.reasons.join("<br>"),
  ]);
  return `${summary}

${
    table([
      [
        "Context",
        "Goal/clarity/water",
        "Bucket/activity",
        "Score",
        "Cause",
        "Reasons",
      ],
      ...exampleRows,
    ])
  }`;
}

function signatureLossDiagnostics(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  const targetIds = new Set(
    config.species === "largemouth_bass"
      ? [
        "ned_rig",
        "finesse_jig",
        "texas_rigged_soft_plastic_craw",
        "carolina_rigged_stick_worm",
      ]
      : [
        "ned_rig",
        "finesse_jig",
        "texas_rigged_soft_plastic_craw",
        "drop_shot_minnow",
      ],
  );
  const summaries = summarizeSignatureProfiles(config, rows)
    .filter((summary) => targetIds.has(summary.definition.id));
  const overview = table([
    [
      "Profile",
      "AP home selected/opp",
      "Big Fish home selected/opp",
      "Loss causes",
      "Best close losses",
    ],
    ...summaries.map((summary) => [
      `${summary.display_name}<br>${summary.definition.id}`,
      `${summary.selected_home_by_goal.get("all_purpose") ?? 0}/${
        summary.home_by_goal.get("all_purpose") ?? 0
      }`,
      `${summary.selected_home_by_goal.get("big_fish") ?? 0}/${
        summary.home_by_goal.get("big_fish") ?? 0
      }`,
      compactCounts(summary.home_loss_causes, 5),
      summary.home_loss_examples
        .sort((a, b) => a.score_delta - b.score_delta)
        .slice(0, 3)
        .map((entry) =>
          `${entry.fishery} ${entry.date} ${entry.goal} ${entry.clarity}: ` +
          `lost to ${entry.winner} by ${entry.score_delta} (${entry.cause})`
        )
        .join("<br>") || "None",
    ]),
  ]);
  const examples = summaries.flatMap((summary) =>
    summary.home_loss_examples
      .sort((a, b) => a.score_delta - b.score_delta)
      .slice(0, 4)
      .map((entry) => ({ summary, entry }))
  ).sort((a, b) =>
    a.entry.score_delta - b.entry.score_delta ||
    a.summary.display_name.localeCompare(b.summary.display_name)
  ).slice(0, 24);
  const detail = table([
    [
      "Profile/context",
      "Candidate",
      "Selected alternative",
      "Delta",
      "Cause",
      "Candidate reasons",
      "Winner reasons",
    ],
    ...examples.map(({ summary, entry }) => [
      `${summary.display_name}<br>${entry.fishery} ${entry.date}<br>${entry.goal} ${entry.clarity} ${entry.bucket}`,
      String(entry.candidate_score),
      `${entry.winner}<br>${entry.winner_score}`,
      String(entry.score_delta),
      entry.cause,
      entry.candidate_reasons.join("<br>"),
      entry.winner_reasons.join("<br>"),
    ]),
  ]);
  return `${overview}

${detail}`;
}

function underusedSignatureIds(
  config: SpeciesAuditConfig,
): ReadonlySet<string> {
  return new Set(
    config.species === "largemouth_bass"
      ? [
        "ned_rig",
        "finesse_jig",
        "texas_rigged_soft_plastic_craw",
        "carolina_rigged_stick_worm",
        "drop_shot_minnow",
      ]
      : [
        "ned_rig",
        "finesse_jig",
        "texas_rigged_soft_plastic_craw",
        "drop_shot_minnow",
      ],
  );
}

function selectedSetAIdsByScenario(
  rows: readonly AuditRow[],
): Map<string, Set<string>> {
  const selected = new Map<string, Set<string>>();
  for (const row of rows) {
    if (row.set !== "A") continue;
    const key = [
      row.weather_scenario_id,
      row.water_type,
      row.water_clarity,
      row.recommendation_goal,
    ].join("|");
    selected.set(key, new Set(row.selected_picks.map((pick) => pick.id)));
  }
  return selected;
}

function setAIdsForRow(
  setAIds: Map<string, Set<string>>,
  row: AuditRow,
): ReadonlySet<string> {
  return setAIds.get([
    row.weather_scenario_id,
    row.water_type,
    row.water_clarity,
    row.recommendation_goal,
  ].join("|")) ?? new Set();
}

function classifyEqualBetterLossCause(args: {
  row: AuditRow;
  candidate: ScoreSnapshot;
  selected: PickSnapshot;
  sideSelected: readonly PickSnapshot[];
  setAIds: ReadonlySet<string>;
}): string {
  const otherSelected = args.sideSelected.find((pick) =>
    pick.id !== args.selected.id
  );
  if (args.row.set === "B" && args.setAIds.has(args.candidate.id)) {
    return "avoidIds";
  }
  if (otherSelected?.family_group === args.candidate.family_group) {
    return "hard_family_rule";
  }
  if (
    args.row.set === "B" &&
    [...args.setAIds].some((id) => {
      const setACandidate = sideCandidates(
        args.row,
        args.selected.gear_mode as Side,
      )
        .find((entry) => entry.id === id);
      return setACandidate?.presentation_group ===
          args.candidate.presentation_group ||
        setACandidate?.family_group === args.candidate.family_group;
    })
  ) {
    return "set_b_group_novelty";
  }
  if (
    args.selected.score_reasons.some((reason) =>
      reason.startsWith(`goal:${args.row.recommendation_goal}:`)
    ) &&
    !args.candidate.score_reasons.some((reason) =>
      reason.startsWith(`goal:${args.row.recommendation_goal}:`)
    )
  ) {
    return "goal_filtering";
  }
  if (
    args.selected.score_reasons.some((reason) =>
      reason.startsWith("condition_tag:")
    ) &&
    !args.candidate.score_reasons.some((reason) =>
      reason.startsWith("condition_tag:")
    )
  ) {
    return "condition_filtering";
  }
  if (args.selected.slot.includes("honorable")) {
    return "honorable_diversity_or_replacement";
  }
  return "jitter_or_id_tiebreak";
}

function equalOrBetterUnderusedLossDiagnostics(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
): string {
  const targetIds = underusedSignatureIds(config);
  const setAIds = selectedSetAIdsByScenario(rows);
  const entries: {
    row: AuditRow;
    candidate: ScoreSnapshot;
    selected: PickSnapshot;
    cause: string;
  }[] = [];
  const causeCounts = new Map<string, number>();
  for (const row of rows) {
    for (const candidate of row.all_lure_candidates) {
      if (!targetIds.has(candidate.id)) continue;
      if (
        !candidate.score_reasons.some((reason) =>
          reason.startsWith("daily_lane:")
        )
      ) {
        continue;
      }
      if (
        classifySignatureWindow(config, row, candidate) !== "home_window" &&
        row.recommendation_goal !== "all_purpose"
      ) continue;
      if (row.selected_picks.some((pick) => pick.id === candidate.id)) continue;
      const sideSelected = row.selected_picks.filter((pick) =>
        pick.gear_mode === "lure"
      );
      const selected = sideSelected
        .slice()
        .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))[0];
      if (!selected || candidate.score < selected.score) continue;
      const cause = classifyEqualBetterLossCause({
        row,
        candidate,
        selected,
        sideSelected,
        setAIds: setAIdsForRow(setAIds, row),
      });
      incrementMap(causeCounts, cause);
      entries.push({ row, candidate, selected, cause });
    }
  }
  if (entries.length === 0) return "None.";
  const summary = table([
    ["Cause", "Equal-or-better underused losses"],
    ...[...causeCounts.entries()].sort((a, b) => b[1] - a[1]).map((
      [cause, count],
    ) => [cause, String(count)]),
  ]);
  const detail = table([
    [
      "Scenario",
      "Set/slot",
      "Selected",
      "Underused candidate",
      "Delta",
      "Cause",
      "Candidate reasons",
      "Selected reasons",
    ],
    ...entries
      .sort((a, b) =>
        (b.candidate.score - b.selected.score) -
          (a.candidate.score - a.selected.score) ||
        a.row.date.localeCompare(b.row.date)
      )
      .slice(0, 40)
      .map(({ row, candidate, selected, cause }) => [
        `${row.fishery_label}<br>${row.date} ${row.recommendation_goal} ${row.water_clarity}<br>${
          firstBucket(row)
        }`,
        `${row.set}<br>${selected.slot}`,
        `${selected.display_name}<br>${selected.score}`,
        `${candidate.display_name}<br>${candidate.score}`,
        String(selected.score - candidate.score),
        cause,
        candidate.score_reasons.join("<br>"),
        selected.score_reasons.join("<br>"),
      ]),
  ]);
  return `${summary}

${detail}`;
}

function windWarningSplitDiagnostics(rows: readonly AuditRow[]): string {
  const counts = new Map<string, number>();
  const examples = new Map<string, AuditRow[]>();
  const add = (bucket: string, row: AuditRow) => {
    incrementMap(counts, bucket);
    const list = examples.get(bucket) ?? [];
    if (list.length < 5) list.push(row);
    examples.set(bucket, list);
  };
  for (const row of rows) {
    if (
      !row.flags.some((flag) => flag.code === "WIND_NOT_ELEVATING_REACTION")
    ) {
      continue;
    }
    const selected = row.selected_picks;
    const selectedHas = (tag: string) =>
      selected.some((pick) =>
        pick.score_reasons.some((reason) =>
          reason.startsWith(`condition_tag:${tag}:`)
        )
      );
    const selectedHasReaction = selectedHas("wind_reaction") ||
      selectedHas("dirty_vibration");
    if (
      row.water_clarity !== "clear" &&
      row.daily_scenario_summary.condition_tags.includes("wind_reaction") &&
      !selectedHasReaction &&
      !selectedHas("clear_subtle") &&
      !selectedHas("low_light_surface") &&
      !selectedHas("current_swing") &&
      !selectedHas("open_water_search")
    ) {
      add("true_dirty_stained_wind_miss", row);
    } else if (selectedHas("dirty_vibration")) {
      add("dirty_vibration_acceptable", row);
    } else if (
      row.water_clarity === "clear" ||
      selectedHas("clear_subtle") ||
      row.daily_scenario_summary.condition_tags.includes("clear_subtle")
    ) {
      add("clear_subtle_wind_watch", row);
    } else if (
      selected.some((pick) => pick.is_surface) ||
      selectedHas("low_light_surface")
    ) {
      add("surface_low_light_acceptable", row);
    } else if (
      selectedHas("current_swing") || selectedHas("open_water_search")
    ) {
      add("current_open_water_acceptable", row);
    } else {
      add("other_wind_watch", row);
    }
  }
  if (counts.size === 0) return "None.";
  const summary = table([
    ["Wind warning split", "Rows"],
    ...[...counts.entries()].sort((a, b) => b[1] - a[1]).map((
      [bucket, count],
    ) => [bucket, String(count)]),
  ]);
  const detailRows = [...examples.entries()].flatMap(([bucket, bucketRows]) =>
    bucketRows.map((row) => [
      bucket,
      `${row.fishery_label}<br>${row.date} ${row.recommendation_goal} ${row.water_clarity} ${row.set}`,
      `${firstBucket(row)}<br>${row.daily_scenario_summary.activity}`,
      row.selected_picks
        .filter((pick) => pick.gear_mode === "lure")
        .map((pick) => `${pick.display_name} ${pick.score}`)
        .join("<br>"),
    ])
  );
  return `${summary}

${
    table([
      ["Split", "Scenario", "Bucket/activity", "Lure picks"],
      ...detailRows,
    ])
  }`;
}

function buildMarkdown(
  config: SpeciesAuditConfig,
  rows: readonly AuditRow[],
  skipped: readonly SkippedWeatherScenario[],
  jsonlPath: string,
): string {
  const weatherScenarioCount =
    new Set(rows.map((row) => row.weather_scenario_id)).size;
  const months = [...countBy(rows.map((row) => row.month)).keys()].sort((
    a,
    b,
  ) => a - b);
  const bucketCounts = countBy(rows.flatMap((row) => row.condition_buckets));
  const adjacent = adjacentCoverage(rows);
  const bucketLines = [["Bucket", "Expanded runs"]];
  for (
    const bucket of [
      "calm_low_light_surface",
      "calm_bright_clear_subtle",
      "breezy_windy_stained_reaction",
      "dirty_vibration",
      "cold_slow_or_front",
      "warming_search",
      "heat_limited_finesse",
      "stable_pleasant_high_confidence",
      "stable_pleasant_medium_confidence_archive",
      "river_elevated_runoff_current",
      "medium_confidence_archive",
      "missing_or_low_confidence_inputs",
    ]
  ) {
    bucketLines.push([bucket, String(bucketCounts.get(bucket) ?? 0)]);
  }
  bucketLines.push(["adjacent_day_similar", String(adjacent.similar)]);
  bucketLines.push(["adjacent_day_change", String(adjacent.changed)]);

  const scope = table([
    ["Metric", "Value"],
    ["Archived weather scenarios", String(weatherScenarioCount)],
    ["Expanded recommendation runs", String(rows.length)],
    ["Months", months.map(monthLabel).join(", ")],
    ["Regions", String(new Set(rows.map((row) => row.region_key)).size)],
    ["Fisheries", String(new Set(rows.map((row) => row.fishery_label)).size)],
    ["Water types", [...new Set(rows.map((row) => row.water_type))].join(", ")],
    [
      "Clarity split",
      [...countBy(rows.map((row) => row.water_clarity)).entries()].map((
        [k, v],
      ) => `${k}:${v}`).join(", "),
    ],
    [
      "Goal split",
      [...countBy(rows.map((row) => row.recommendation_goal)).entries()].map((
        [k, v],
      ) => `${k}:${v}`).join(", "),
    ],
    ["Skipped weather scenarios", String(skipped.length)],
    ["JSONL output", jsonlPath],
  ]);

  const mostSelected = table([
    ["Scope", "Most selected"],
    [
      "Overall",
      topCounts(selectedPickIds(rows), 12).map(([name, count]) =>
        `${name} (${count})`
      ).join(", "),
    ],
    [
      "All-purpose",
      topCounts(selectedPickIds(rows, "all_purpose"), 8).map(([name, count]) =>
        `${name} (${count})`
      ).join(", "),
    ],
    [
      "Big-fish",
      topCounts(selectedPickIds(rows, "big_fish"), 8).map(([name, count]) =>
        `${name} (${count})`
      ).join(", "),
    ],
  ]);

  const flagCounts = (category: FlagCategory) => {
    const rowsForCategory = flagSummary(rows, category, 12);
    return rowsForCategory.length
      ? rowsForCategory.map(([code, count]) => `- ${code}: ${count}`).join("\n")
      : "None.";
  };

  const skippedSection = skipped.length
    ? skipped.map((entry) => `- ${entry.id}: ${entry.reason}`).join("\n")
    : "None.";

  return `# FinFindr ${config.title_label} Daily-Picks Archive Audit
Generated: ${new Date().toISOString()}

## Scope Summary

${scope}

## Condition Bucket Coverage

${table(bucketLines)}

## Adjacent-Day Coverage

${adjacentCoverageTable(rows)}

## Hard Fails

${flagCounts("hard")}

${flagRows(rows, "hard", 40)}

## Credibility Warnings By Condition Bucket

${credibilityByBucket(rows)}

${flagCounts("credibility")}

${flagRows(rows, "credibility", 60)}

## Variety Warnings

${varietyPriorityNote()}

${flagCounts("variety")}

${flagRows(rows, "variety", 60)}

## Temperature/Thermal Diagnostics

${thermalDiagnostics(rows)}

## Surface/Topwater Diagnostics

${surfaceDiagnostics(rows)}

## Water Column Diversity Diagnostics

${waterColumnDiversityDiagnostics(rows)}

## Pike Cold/Open Surface Diagnostics

${pikeColdOpenSurfaceDiagnostics(config, rows)}

## Pike Clear/Bright Diagnostics

${pikeClearBrightDiagnostics(config, rows)}

## Pike Heat-Limited Diagnostics

${pikeHeatLimitedDiagnostics(config, rows)}

## Set B Diagnostics

${setBDiagnostics(rows)}

## Goal Contrast Diagnostics

${goalContrastDiagnostics(rows)}

## Big Fish No-Upside Diagnostics

${bigFishNoUpsideDiagnostics(rows)}

## Pike Big Fish Upside Split Diagnostics

${pikeBigFishUpsideSplitDiagnostics(config, rows)}

## Condition Warning Diagnostics

${conditionWarningDiagnostics(rows)}

## Wind Warning Split Diagnostics

${windWarningSplitDiagnostics(rows)}

## Guide Verdict Summary

${guideVerdictSummary(rows)}

## Recalibrated All Purpose Risk Summary

${recalibratedAllPurposeRiskSummary(rows)}

## Top Likely Misses

${topLikelyMisses(rows)}

## Top Strong Hits

${topStrongHits(rows)}

## Condition Satisfaction Rates

${conditionSatisfactionRates(config, rows)}

## Most-Selected Lures/Flies

${mostSelected}

## Profile Utilization Summary

${utilizationSummary(rows)}

## Actual Recommendation Slot Share

${actualSlotShareSummary(rows)}

## Zero-Selected Eligible Profiles

${zeroSelectedEligibleProfiles(rows)}

## Low-Use Eligible Profiles

${lowUseEligibleProfiles(rows)}

## Over-Selected Profiles

${overSelectedProfiles(rows)}

## Overdominance Guardrail Summary

${overdominanceGuardrailSummary(config, rows)}

## Slot Utilization Guardrails

${slotUtilizationGuardrails(config, rows)}

## Finalist Pool Diagnostics

${finalistPoolDiagnostics(rows)}

## Dirty/Stained Wind Coverage Pool Diagnostics

${dirtyWindCoveragePoolDiagnostics(rows)}

## Surface Safety Expansion Check

${surfaceSafetyExpansionCheck(rows)}

## Tag Load And Stack Risk

${tagLoadAndStackRiskSection(config, rows)}

## Utilization Notes / Coverage Gaps

${utilizationNotes(rows)}

## Signature Profile Home-Window Summary

${signatureProfileSummarySection(config, rows)}

## ${config.title_label} Species-Staple Floor Audit

${signatureProfilesSection(config, rows)}

## Bladed Jig Home-Window Win Diagnosis

${bladedHomeWinDiagnostics(config, rows)}

## Underused Signature Loss Diagnosis

${signatureLossDiagnostics(config, rows)}

## Equal-Or-Better Underused Signature Losses

${equalOrBetterUnderusedLossDiagnostics(config, rows)}

## Underused In Home Windows

${signatureDiagnosisSection(config, rows, "underused_home_window")}

## Over-Dominant Profiles

${signatureDiagnosisSection(config, rows, "over-dominant")}

## Home-Window Coverage Gaps

${signatureDiagnosisSection(config, rows, "no_home_window_coverage")}

## Top Condition-Tag Winners

${tagWinners(rows)}

## Representative Guide Review Rows

${guideReviewRows(rows)}

## Known Coverage Gaps

${coverageGaps(rows, skipped)}

## Skipped Weather Scenarios

${skippedSection}
`;
}

async function main() {
  const smoke = Deno.args.includes("--smoke");
  const config = parseSpeciesConfig(Deno.args);
  const fisheryByKey = new Map(
    config.fisheries.map((fishery) => [fishery.key, fishery]),
  );
  const months = parseMonths(Deno.args);
  const fisheries = parseFisheryKeys(Deno.args, fisheryByKey);
  const limit = parsePositiveInt(argValue(Deno.args, "--limit"), "--limit");
  const outputSuffix =
    argValue(Deno.args, "--output-suffix")?.replace(/[^a-zA-Z0-9_-]+/g, "_") ??
      null;
  const includeAux = !Deno.args.includes("--no-aux");

  let plan = config.weather_plan.slice();
  if (months) {
    plan = plan.filter((entry) =>
      months.has(Number.parseInt(entry.date.slice(5, 7), 10))
    );
  }
  if (fisheries) {
    plan = plan.filter((entry) => fisheries.has(entry.fishery_key));
  }
  if (smoke) plan = plan.slice(0, 3);
  if (limit != null) plan = plan.slice(0, limit);
  if (plan.length === 0) throw new Error("No weather scenarios selected.");

  const suffix = outputSuffix ? `.${outputSuffix}` : smoke ? ".smoke" : "";
  const jsonlPath = scriptPath(
    `daily-picks-archive-audit.${config.output_key}${suffix}.jsonl`,
  );
  const mdPath = scriptPath(
    `daily-picks-archive-audit.${config.output_key}${suffix}.md`,
  );
  const tmpJsonlPath = `${jsonlPath}.tmp`;
  const tmpMdPath = `${mdPath}.tmp`;

  const rows: AuditRow[] = [];
  const skipped: SkippedWeatherScenario[] = [];
  await Deno.writeTextFile(tmpJsonlPath, "");

  for (const entry of plan) {
    const fishery = fisheryByKey.get(entry.fishery_key);
    if (!fishery) throw new Error(`No fishery found for ${entry.fishery_key}`);
    try {
      console.log(
        `weather ${
          entry.fishery_key.padEnd(22)
        } ${entry.date} ${entry.water_type}`,
      );
      const archive = await fetchArchiveWeather(
        fishery.latitude,
        fishery.longitude,
        entry.date,
      );
      if (!archive) {
        skipped.push({
          id: `${entry.fishery_key}__${entry.date}__${entry.water_type}`,
          fishery_label: fishery.label,
          date: entry.date,
          water_type: entry.water_type,
          reason: "archive_weather_fetch_failed",
        });
        continue;
      }
      const tzOffsetHours = archive.tz_offset_seconds / 3600;
      const [sun, moon] = includeAux
        ? await Promise.all([
          fetchSunriseSunset(
            fishery.latitude,
            fishery.longitude,
            entry.date,
            archive.timezone,
          ),
          fetchUSNOMoon(
            fishery.latitude,
            fishery.longitude,
            entry.date,
            tzOffsetHours,
          ),
        ])
        : [null, null] as const;
      const envData = mapArchiveToEnvData(
        archive,
        entry.date,
        archive.timezone,
        sun,
        moon,
        null,
      );
      const summary = archiveSummary(archive, entry.date, archive.timezone);

      for (const clarity of WATER_CLARITIES) {
        for (const goal of GOALS) {
          const rowA = runOne({
            config,
            fishery,
            weatherPlan: entry,
            archiveSummary: summary,
            envData,
            clarity,
            goal,
            variant: "A",
          });
          rows.push(rowA);
          await Deno.writeTextFile(tmpJsonlPath, JSON.stringify(rowA) + "\n", {
            append: true,
          });

          const rowB = runOne({
            config,
            fishery,
            weatherPlan: entry,
            archiveSummary: summary,
            envData,
            clarity,
            goal,
            variant: "B",
            avoidLureIds: rowA.selected_picks.filter((pick) =>
              pick.gear_mode === "lure"
            ).map((pick) => pick.id),
            avoidFlyIds: rowA.selected_picks.filter((pick) =>
              pick.gear_mode === "fly"
            ).map((pick) => pick.id),
          });
          rows.push(rowB);
          await Deno.writeTextFile(tmpJsonlPath, JSON.stringify(rowB) + "\n", {
            append: true,
          });
        }
      }
      console.log(
        `ok      ${entry.fishery_key.padEnd(22)} expanded=${
          WATER_CLARITIES.length * GOALS.length * 2
        }`,
      );
      await new Promise((resolve) => setTimeout(resolve, 120));
    } catch (error) {
      skipped.push({
        id: `${entry.fishery_key}__${entry.date}__${entry.water_type}`,
        fishery_label: fishery.label,
        date: entry.date,
        water_type: entry.water_type,
        reason: error instanceof Error ? error.message : String(error),
      });
      console.error(
        `skip    ${entry.fishery_key} ${entry.date}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  addIntraSetVarietyFlags(rows);
  addSetBVarietyFlags(rows);
  addAdjacentDayVarietyFlags(rows);
  addGuideVerdicts(rows);

  await Deno.writeTextFile(
    tmpJsonlPath,
    rows.map((row) => JSON.stringify(row)).join("\n") +
      (rows.length ? "\n" : ""),
  );
  await Deno.writeTextFile(
    tmpMdPath,
    buildMarkdown(config, rows, skipped, jsonlPath),
  );

  try {
    await Deno.remove(jsonlPath);
  } catch {
    // Missing prior output is fine.
  }
  try {
    await Deno.remove(mdPath);
  } catch {
    // Missing prior output is fine.
  }
  await Deno.rename(tmpJsonlPath, jsonlPath);
  await Deno.rename(tmpMdPath, mdPath);

  const hard = rows.reduce(
    (sum, row) =>
      sum + row.flags.filter((flag) => flag.category === "hard").length,
    0,
  );
  const cred = rows.reduce(
    (sum, row) =>
      sum + row.flags.filter((flag) => flag.category === "credibility").length,
    0,
  );
  const variety = rows.reduce(
    (sum, row) =>
      sum + row.flags.filter((flag) => flag.category === "variety").length,
    0,
  );
  console.log(
    `\nCompleted weather=${
      new Set(rows.map((row) => row.weather_scenario_id)).size
    } runs=${rows.length} skipped=${skipped.length}`,
  );
  console.log(`Flags hard=${hard} credibility=${cred} variety=${variety}`);
  console.log(`Markdown report: ${mdPath}`);
  console.log(`JSONL results: ${jsonlPath}`);
}

if (import.meta.main) {
  await main();
}
