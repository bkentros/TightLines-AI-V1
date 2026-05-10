import type { SharedConditionAnalysis } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type {
  RecommendationGoal,
  RecommenderRequest,
  WaterClarity,
} from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";
import type { CandidateScore } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts";
import {
  LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts";
import {
  NORTHERN_PIKE_SEASONAL_ROWS_V4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts";
import {
  SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts";
import {
  TROUT_SEASONAL_ROWS_V4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts";
import type {
  RecommenderV4Species,
  SeasonalRowV4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";

type Reliability = "high" | "medium" | "low";
type LightLabel = "low_light" | "mixed" | "bright" | "glare" | "heavy_overcast";
type TemperatureBand = "very_cold" | "cool" | "optimal" | "very_warm";
type TemperatureTrend = "warming" | "stable" | "cooling";
type TemperatureShock = "none" | "sharp_cooldown" | "sharp_warmup";
type RunoffLabel =
  | "perfect_clear"
  | "stable"
  | "slightly_elevated"
  | "elevated"
  | "blown_out";
type PressureLabel =
  | "falling_slow"
  | "falling_fast"
  | "stable_neutral"
  | "recently_stabilizing"
  | "rising_slow"
  | "rising_fast"
  | "volatile";

type Fixture = {
  id: string;
  label: string;
  source_note: string;
  species: RecommenderV4Species;
  region_key: RegionKey;
  state_code: string;
  latitude: number;
  longitude: number;
  local_date: string;
  local_timezone: string;
  water_type: EngineContext;
  water_clarity: WaterClarity;
  hows_score: number;
  daylight_wind_mph: number;
  scalar_wind_mph?: number;
  hourly_daylight_wind_mph?: number;
  hourly_outside_wind_mph?: number;
  light_label: LightLabel;
  temperature_band: TemperatureBand;
  temperature_trend: TemperatureTrend;
  temperature_shock?: TemperatureShock;
  runoff_label?: RunoffLabel;
  pressure_label: PressureLabel;
  reliability?: Reliability;
  review_ids: readonly string[];
};

type ReplayRun = {
  fixture: Fixture;
  goal: RecommendationGoal;
  result: ReturnType<typeof runDailyPicksEngine>;
};

const GOALS: readonly RecommendationGoal[] = ["all_purpose", "big_fish"];

const ROWS: readonly SeasonalRowV4[] = [
  ...LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  ...SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  ...NORTHERN_PIKE_SEASONAL_ROWS_V4,
  ...TROUT_SEASONAL_ROWS_V4,
];

const BROAD_FLY_IDS = new Set([
  "clouser_minnow",
  "game_changer",
  "articulated_baitfish_streamer",
  "bucktail_baitfish_streamer",
  "slim_minnow_streamer",
  "articulated_dungeon_streamer",
  "unweighted_baitfish_streamer",
  "baitfish_slider_fly",
  "woolly_bugger",
  "rabbit_strip_leech",
  "lead_eye_leech",
  "jighead_marabou_leech",
  "feather_jig_leech",
  "balanced_leech",
  "conehead_streamer",
  "zonker_streamer",
]);

const NEW_OR_WATCH_IDS = [
  "magnum_jerkbait",
  "shallow_minnowbait",
  "pike_spinnerbait",
  "weedless_spoon",
  "pike_glidebait",
  "wake_bait",
  "mouse_fly",
  "magnum_worm",
  "bluegill_streamer",
  "compact_glidebait",
  "big_smallmouth_tube",
] as const;

const PIKE_REACTION_TRACE_IDS = new Set([
  "pike_spinnerbait",
  "large_bucktail_spinner",
  "weedless_spoon",
  "casting_spoon",
  "shallow_minnowbait",
  "large_profile_pike_swimbait",
  "pike_jerkbait",
  "pike_glidebait",
]);

const COMPACT_GLIDE_TRACE_IDS = new Set([
  "compact_glidebait",
  "magnum_jerkbait",
  "big_smallmouth_tube",
  "suspending_jerkbait",
  "bladed_jig",
]);

// Saved historical-day fixture summaries. These are intentionally checked in as
// fixed replay data so QA does not depend on live archive/weather APIs.
const FIXTURES: readonly Fixture[] = [
  {
    id: "lmb_fl_mar18_low_light_lake",
    label: "Florida LMB lake warm low-light surface window",
    source_note: "Archived-weather summary: central FL, 2025-03-18",
    species: "largemouth_bass",
    region_key: "florida",
    state_code: "FL",
    latitude: 28.94,
    longitude: -81.68,
    local_date: "2025-03-18",
    local_timezone: "America/New_York",
    water_type: "freshwater_lake_pond",
    water_clarity: "stained",
    hows_score: 76,
    daylight_wind_mph: 4,
    light_label: "low_light",
    temperature_band: "optimal",
    temperature_trend: "warming",
    pressure_label: "falling_slow",
    review_ids: ["wake_bait", "mouse_fly", "bluegill_streamer", "magnum_worm"],
  },
  {
    id: "lmb_fl_mar19_windy_lake",
    label: "Florida LMB lake warm windy stained follow-up",
    source_note: "Archived-weather summary: central FL, 2025-03-19",
    species: "largemouth_bass",
    region_key: "florida",
    state_code: "FL",
    latitude: 28.94,
    longitude: -81.68,
    local_date: "2025-03-19",
    local_timezone: "America/New_York",
    water_type: "freshwater_lake_pond",
    water_clarity: "stained",
    hows_score: 70,
    daylight_wind_mph: 16,
    light_label: "mixed",
    temperature_band: "optimal",
    temperature_trend: "warming",
    pressure_label: "falling_fast",
    review_ids: ["bladed_jig", "spinnerbait", "bluegill_streamer"],
  },
  {
    id: "lmb_midwest_jun14_dirty_river",
    label: "Midwest LMB dirty elevated river",
    source_note: "Archived-weather summary: central IL, 2025-06-14",
    species: "largemouth_bass",
    region_key: "midwest_interior",
    state_code: "IL",
    latitude: 39.82,
    longitude: -89.64,
    local_date: "2025-06-14",
    local_timezone: "America/Chicago",
    water_type: "freshwater_river",
    water_clarity: "dirty",
    hows_score: 62,
    daylight_wind_mph: 12,
    light_label: "mixed",
    temperature_band: "optimal",
    temperature_trend: "stable",
    runoff_label: "elevated",
    pressure_label: "volatile",
    review_ids: ["bladed_jig", "spinnerbait", "articulated_dungeon_streamer"],
  },
  {
    id: "lmb_gl_sep20_cool_low_light_lake",
    label: "Great Lakes LMB fall low-light lake",
    source_note: "Archived-weather summary: MN, 2025-09-20",
    species: "largemouth_bass",
    region_key: "great_lakes_upper_midwest",
    state_code: "MN",
    latitude: 44.93,
    longitude: -93.33,
    local_date: "2025-09-20",
    local_timezone: "America/Chicago",
    water_type: "freshwater_lake_pond",
    water_clarity: "clear",
    hows_score: 72,
    daylight_wind_mph: 5,
    light_label: "low_light",
    temperature_band: "cool",
    temperature_trend: "cooling",
    pressure_label: "recently_stabilizing",
    review_ids: ["wake_bait", "mouse_fly", "magnum_jerkbait"],
  },
  {
    id: "smb_gl_may07_clear_lake",
    label: "Great Lakes SMB clear lake shoulder-season",
    source_note: "Archived-weather summary: MI, 2025-05-07",
    species: "smallmouth_bass",
    region_key: "great_lakes_upper_midwest",
    state_code: "MI",
    latitude: 45.03,
    longitude: -85.62,
    local_date: "2025-05-07",
    local_timezone: "America/Detroit",
    water_type: "freshwater_lake_pond",
    water_clarity: "clear",
    hows_score: 67,
    daylight_wind_mph: 8,
    light_label: "mixed",
    temperature_band: "cool",
    temperature_trend: "warming",
    pressure_label: "stable_neutral",
    review_ids: ["compact_glidebait", "magnum_jerkbait"],
  },
  {
    id: "smb_gl_may08_low_light_lake",
    label: "Great Lakes SMB clear low-light lake",
    source_note: "Archived-weather summary: MI, 2025-05-08",
    species: "smallmouth_bass",
    region_key: "great_lakes_upper_midwest",
    state_code: "MI",
    latitude: 45.03,
    longitude: -85.62,
    local_date: "2025-05-08",
    local_timezone: "America/Detroit",
    water_type: "freshwater_lake_pond",
    water_clarity: "clear",
    hows_score: 72,
    daylight_wind_mph: 4,
    light_label: "low_light",
    temperature_band: "cool",
    temperature_trend: "warming",
    pressure_label: "falling_slow",
    review_ids: ["compact_glidebait", "wake_bait", "magnum_jerkbait"],
  },
  {
    id: "smb_gl_may09_dirty_river",
    label: "Great Lakes SMB elevated dirty river",
    source_note: "Archived-weather summary: MI, 2025-05-09",
    species: "smallmouth_bass",
    region_key: "great_lakes_upper_midwest",
    state_code: "MI",
    latitude: 45.03,
    longitude: -85.62,
    local_date: "2025-05-09",
    local_timezone: "America/Detroit",
    water_type: "freshwater_river",
    water_clarity: "dirty",
    hows_score: 58,
    daylight_wind_mph: 10,
    light_label: "mixed",
    temperature_band: "cool",
    temperature_trend: "stable",
    runoff_label: "elevated",
    pressure_label: "volatile",
    review_ids: ["big_smallmouth_tube", "tube_jig"],
  },
  {
    id: "smb_northeast_oct18_cold_clear_river",
    label: "Northeast SMB cold clear fall river",
    source_note: "Archived-weather summary: NY, 2025-10-18",
    species: "smallmouth_bass",
    region_key: "northeast",
    state_code: "NY",
    latitude: 43.15,
    longitude: -75.34,
    local_date: "2025-10-18",
    local_timezone: "America/New_York",
    water_type: "freshwater_river",
    water_clarity: "clear",
    hows_score: 40,
    daylight_wind_mph: 4,
    light_label: "bright",
    temperature_band: "cool",
    temperature_trend: "cooling",
    runoff_label: "stable",
    pressure_label: "rising_slow",
    review_ids: ["big_smallmouth_tube", "tube_jig", "hair_jig"],
  },
  {
    id: "smb_mountain_aug12_low_light_lake",
    label: "Mountain West SMB summer low-light lake",
    source_note: "Archived-weather summary: CO foothills, 2025-08-12",
    species: "smallmouth_bass",
    region_key: "mountain_west",
    state_code: "CO",
    latitude: 39.55,
    longitude: -105.07,
    local_date: "2025-08-12",
    local_timezone: "America/Denver",
    water_type: "freshwater_lake_pond",
    water_clarity: "stained",
    hows_score: 74,
    daylight_wind_mph: 5,
    light_label: "low_light",
    temperature_band: "optimal",
    temperature_trend: "stable",
    pressure_label: "falling_slow",
    review_ids: ["wake_bait", "magnum_jerkbait"],
  },
  {
    id: "pike_gl_may15_windy_stained_lake",
    label: "Great Lakes pike windy stained lake",
    source_note: "Archived-weather summary: MN, 2025-05-15",
    species: "northern_pike",
    region_key: "great_lakes_upper_midwest",
    state_code: "MN",
    latitude: 46.79,
    longitude: -92.1,
    local_date: "2025-05-15",
    local_timezone: "America/Chicago",
    water_type: "freshwater_lake_pond",
    water_clarity: "stained",
    hows_score: 73,
    daylight_wind_mph: 18,
    light_label: "mixed",
    temperature_band: "cool",
    temperature_trend: "warming",
    pressure_label: "falling_fast",
    review_ids: [
      "pike_spinnerbait",
      "weedless_spoon",
      "large_bucktail_spinner",
    ],
  },
  {
    id: "pike_gl_may16_clear_calm_lake",
    label: "Great Lakes pike clear calm lake",
    source_note: "Archived-weather summary: MN, 2025-05-16",
    species: "northern_pike",
    region_key: "great_lakes_upper_midwest",
    state_code: "MN",
    latitude: 46.79,
    longitude: -92.1,
    local_date: "2025-05-16",
    local_timezone: "America/Chicago",
    water_type: "freshwater_lake_pond",
    water_clarity: "clear",
    hows_score: 65,
    daylight_wind_mph: 4,
    light_label: "bright",
    temperature_band: "cool",
    temperature_trend: "stable",
    pressure_label: "stable_neutral",
    review_ids: ["pike_glidebait", "pike_jerkbait"],
  },
  {
    id: "pike_gl_jul08_low_light_lake",
    label: "Great Lakes pike summer low-light lake",
    source_note: "Archived-weather summary: MN, 2025-07-08",
    species: "northern_pike",
    region_key: "great_lakes_upper_midwest",
    state_code: "MN",
    latitude: 46.79,
    longitude: -92.1,
    local_date: "2025-07-08",
    local_timezone: "America/Chicago",
    water_type: "freshwater_lake_pond",
    water_clarity: "stained",
    hows_score: 76,
    daylight_wind_mph: 5,
    light_label: "low_light",
    temperature_band: "optimal",
    temperature_trend: "stable",
    pressure_label: "falling_slow",
    review_ids: ["large_pike_topwater", "pike_spinnerbait", "pike_glidebait"],
  },
  {
    id: "pike_midwest_oct05_windy_river",
    label: "Midwest pike windy fall river",
    source_note: "Archived-weather summary: WI, 2025-10-05",
    species: "northern_pike",
    region_key: "midwest_interior",
    state_code: "WI",
    latitude: 44.52,
    longitude: -89.57,
    local_date: "2025-10-05",
    local_timezone: "America/Chicago",
    water_type: "freshwater_river",
    water_clarity: "stained",
    hows_score: 60,
    daylight_wind_mph: 16,
    light_label: "mixed",
    temperature_band: "cool",
    temperature_trend: "cooling",
    runoff_label: "stable",
    pressure_label: "rising_fast",
    review_ids: [
      "pike_spinnerbait",
      "shallow_minnowbait",
      "large_bucktail_spinner",
    ],
  },
  {
    id: "trout_mountain_may24_runoff",
    label: "Mountain West trout elevated runoff",
    source_note: "Archived-weather summary: MT, 2025-05-24",
    species: "trout",
    region_key: "mountain_west",
    state_code: "MT",
    latitude: 46.59,
    longitude: -112.04,
    local_date: "2025-05-24",
    local_timezone: "America/Denver",
    water_type: "freshwater_river",
    water_clarity: "dirty",
    hows_score: 52,
    daylight_wind_mph: 9,
    light_label: "mixed",
    temperature_band: "cool",
    temperature_trend: "stable",
    runoff_label: "elevated",
    pressure_label: "volatile",
    review_ids: ["sculpzilla", "sculpin_streamer", "clouser_minnow"],
  },
  {
    id: "trout_app_jul15_low_light",
    label: "Appalachian trout low-light summer river",
    source_note: "Archived-weather summary: WV, 2025-07-15",
    species: "trout",
    region_key: "appalachian",
    state_code: "WV",
    latitude: 38.55,
    longitude: -79.82,
    local_date: "2025-07-15",
    local_timezone: "America/New_York",
    water_type: "freshwater_river",
    water_clarity: "stained",
    hows_score: 75,
    daylight_wind_mph: 4,
    light_label: "low_light",
    temperature_band: "optimal",
    temperature_trend: "stable",
    runoff_label: "stable",
    pressure_label: "falling_slow",
    review_ids: ["mouse_fly", "game_changer"],
  },
  {
    id: "trout_app_jul16_windy",
    label: "Appalachian trout breezy summer river follow-up",
    source_note: "Archived-weather summary: WV, 2025-07-16",
    species: "trout",
    region_key: "appalachian",
    state_code: "WV",
    latitude: 38.55,
    longitude: -79.82,
    local_date: "2025-07-16",
    local_timezone: "America/New_York",
    water_type: "freshwater_river",
    water_clarity: "stained",
    hows_score: 65,
    daylight_wind_mph: 14,
    light_label: "mixed",
    temperature_band: "optimal",
    temperature_trend: "stable",
    runoff_label: "stable",
    pressure_label: "stable_neutral",
    review_ids: ["mouse_fly", "game_changer"],
  },
  {
    id: "trout_gl_sep12_bright_clear",
    label: "Great Lakes trout bright clear fall river",
    source_note: "Archived-weather summary: WI, 2025-09-12",
    species: "trout",
    region_key: "great_lakes_upper_midwest",
    state_code: "WI",
    latitude: 44.51,
    longitude: -89.58,
    local_date: "2025-09-12",
    local_timezone: "America/Chicago",
    water_type: "freshwater_river",
    water_clarity: "clear",
    hows_score: 55,
    daylight_wind_mph: 6,
    light_label: "bright",
    temperature_band: "optimal",
    temperature_trend: "stable",
    runoff_label: "stable",
    pressure_label: "stable_neutral",
    review_ids: ["mouse_fly", "clouser_minnow", "game_changer"],
  },
  {
    id: "trout_alaska_jun20_low_light",
    label: "Alaska trout low-light early summer river",
    source_note: "Archived-weather summary: AK, 2025-06-20",
    species: "trout",
    region_key: "alaska",
    state_code: "AK",
    latitude: 61.22,
    longitude: -149.9,
    local_date: "2025-06-20",
    local_timezone: "America/Anchorage",
    water_type: "freshwater_river",
    water_clarity: "clear",
    hows_score: 72,
    daylight_wind_mph: 3,
    light_label: "low_light",
    temperature_band: "cool",
    temperature_trend: "warming",
    runoff_label: "stable",
    pressure_label: "falling_slow",
    review_ids: ["mouse_fly", "game_changer"],
  },
];

function speciesToRequest(species: RecommenderV4Species): SpeciesGroup {
  if (species === "northern_pike") return "pike_musky";
  if (species === "trout") return "river_trout";
  return species;
}

function monthFromDate(localDate: string): number {
  return Number(localDate.slice(5, 7));
}

function rowFor(fixture: Fixture): SeasonalRowV4 {
  const row = ROWS.find((candidate) =>
    candidate.species === fixture.species &&
    candidate.region_key === fixture.region_key &&
    candidate.month === monthFromDate(fixture.local_date) &&
    candidate.water_type === fixture.water_type
  );
  if (row == null) {
    throw new Error(`No seasonal row for fixture ${fixture.id}`);
  }
  return row;
}

function requestFor(
  fixture: Fixture,
  goal: RecommendationGoal,
): RecommenderRequest {
  const windSpeedMph = fixture.scalar_wind_mph ?? fixture.daylight_wind_mph;
  const envData: Record<string, unknown> = {
    wind_speed_mph: windSpeedMph,
    weather: {
      wind_speed: windSpeedMph,
      wind_speed_unit: "mph",
    },
  };
  if (fixture.hourly_daylight_wind_mph != null) {
    envData.hourly_wind_speed = hourlyWindForLocalDate(
      fixture.local_date,
      fixture.hourly_daylight_wind_mph,
      fixture.hourly_outside_wind_mph ?? fixture.hourly_daylight_wind_mph,
    );
  }

  return {
    location: {
      latitude: fixture.latitude,
      longitude: fixture.longitude,
      state_code: fixture.state_code,
      region_key: fixture.region_key,
      local_date: fixture.local_date,
      local_timezone: fixture.local_timezone,
      month: monthFromDate(fixture.local_date),
    },
    species: speciesToRequest(fixture.species),
    context: fixture.water_type,
    water_clarity: fixture.water_clarity,
    recommendation_goal: goal,
    env_data: envData,
  };
}

function hourlyWindForLocalDate(
  localDate: string,
  daylightValue: number,
  outsideValue: number,
): Array<{ time_utc: string; value: number }> {
  return Array.from({ length: 24 }, (_, hour) => ({
    time_utc: `${localDate}T${String(hour).padStart(2, "0")}:00:00Z`,
    value: hour >= 5 && hour <= 21 ? daylightValue : outsideValue,
  }));
}

function analysisFor(fixture: Fixture): SharedConditionAnalysis {
  return {
    norm: {
      location: {
        latitude: fixture.latitude,
        longitude: fixture.longitude,
        state_code: fixture.state_code,
        region_key: fixture.region_key,
        local_date: fixture.local_date,
        local_timezone: fixture.local_timezone,
      },
      context: fixture.water_type,
      normalized: {
        light_cloud_condition: {
          label: fixture.light_label,
          score: 0,
        },
        temperature: {
          context_group: "freshwater",
          measurement_source: "saved_archive_fixture",
          measurement_value_f: 0,
          band_label: fixture.temperature_band,
          band_score: 0,
          trend_label: fixture.temperature_trend,
          trend_adjustment: 0,
          shock_label: fixture.temperature_shock ?? "none",
          shock_adjustment: 0,
          final_score: 0,
        },
        pressure_regime: {
          label: fixture.pressure_label,
          score: 0,
        },
        runoff_flow_disruption: fixture.runoff_label == null ? undefined : {
          label: fixture.runoff_label,
          score: 0,
        },
      },
      available_variables: [
        "saved_archive_weather_summary",
        "daylight_wind_mph",
        "light_label",
        "temperature_band",
        "temperature_trend",
        "pressure_label",
      ],
      missing_variables: [],
      data_gaps: [],
      reliability: fixture.reliability ?? "high",
    },
    scored: { score: fixture.hows_score },
    timing: {},
    condition_context: {},
  } as unknown as SharedConditionAnalysis;
}

function runFixture(fixture: Fixture, goal: RecommendationGoal): ReplayRun {
  const row = rowFor(fixture);
  const result = runDailyPicksEngine({
    req: requestFor(fixture, goal),
    analysis: analysisFor(fixture),
    seasonalRow: row,
    seed: `qa6-archive-replay|${fixture.id}|${goal}`,
    variant: "A",
  });
  return { fixture, goal, result };
}

function selectedIds(run: ReplayRun): string[] {
  return [
    ...run.result.diagnostics.selected_lure_ids,
    ...run.result.diagnostics.selected_fly_ids,
  ];
}

function setKey(run: ReplayRun): string {
  return selectedIds(run).join("|");
}

function fisheryKey(fixture: Fixture): string {
  return `${fixture.species}|${fixture.region_key}|${fixture.water_type}`;
}

function increment(map: Map<string, number>, key: string, by = 1): void {
  map.set(key, (map.get(key) ?? 0) + by);
}

function topEntries(
  map: Map<string, number>,
  limit: number,
): Array<[string, number]> {
  return [...map.entries()].sort((a, b) =>
    b[1] - a[1] || a[0].localeCompare(b[0])
  )
    .slice(0, limit);
}

function selectedSummary(run: ReplayRun): string {
  const r = run.result;
  return [
    `lures=${r.diagnostics.selected_lure_ids.join("/")}`,
    `flies=${r.diagnostics.selected_fly_ids.join("/")}`,
    `tags=${r.scenario.scenario_tags.join("+") || "none"}`,
    `surface=${r.scenario.surface_daily_gate}`,
  ].join(" ");
}

function rowSummary(row: SeasonalRowV4): string {
  return [
    `row_columns=${row.column_range.join("|")}`,
    `row_column_base=${row.column_baseline}`,
    `row_paces=${row.pace_range.join("|")}`,
    `row_pace_base=${row.pace_baseline}`,
    `surface_seasonal=${row.surface_seasonally_possible}`,
    `forage=${row.primary_forage}/${row.secondary_forage ?? "none"}`,
  ].join(" ");
}

function selectedContextLines(run: ReplayRun): string[] {
  const row = run.result.row;
  return [
    run.result.selection.lure_of_the_day,
    run.result.selection.honorable_lure,
    run.result.selection.fly_of_the_day,
    run.result.selection.honorable_fly,
  ].map((score) => {
    const profile = score.profile;
    const rowColumnOk = row.column_range.includes(profile.column);
    const rowPaceOk = row.pace_range.includes(profile.primary_pace) ||
      (profile.secondary_pace != null &&
        row.pace_range.includes(profile.secondary_pace));
    const conditionReasons = score.reasons.filter((reason) =>
      reason.startsWith("condition_tag:")
    );
    const goalReasons = score.reasons.filter((reason) =>
      reason.startsWith(`goal:${run.goal}:`)
    );
    return [
      `${score.side}:${profile.id}`,
      `score=${score.score}`,
      `catalog=${profile.column}/${profile.primary_pace}${
        profile.secondary_pace ? `+${profile.secondary_pace}` : ""
      }`,
      `row_match=${rowColumnOk && rowPaceOk ? "yes" : "no"}`,
      `surface=${profile.is_surface}`,
      `condition=${conditionReasons.join("+") || "none"}`,
      `goal=${goalReasons.join("+") || "none"}`,
    ].join(" ");
  });
}

function scoreRank(
  scores: readonly CandidateScore[],
  id: string,
): number | null {
  const ranked = [...scores].sort((a, b) =>
    b.score - a.score || a.profile.id.localeCompare(b.profile.id)
  );
  const index = ranked.findIndex((score) => score.profile.id === id);
  return index < 0 ? null : index + 1;
}

function traceScores(args: {
  label: string;
  scores: readonly CandidateScore[];
  ids: ReadonlySet<string>;
}): string[] {
  const selected = [...args.scores]
    .filter((score) => args.ids.has(score.profile.id))
    .sort((a, b) =>
      b.score - a.score || a.profile.id.localeCompare(b.profile.id)
    );
  if (selected.length === 0) return [];
  return [
    `  ${args.label}:`,
    ...selected.map((score) =>
      `    #${
        scoreRank(args.scores, score.profile.id)
      } ${score.profile.id} score=${score.score} reasons=${
        score.reasons.join(",")
      }`
    ),
  ];
}

function idsWithGoalReason(run: ReplayRun): string[] {
  return [
    run.result.selection.lure_of_the_day,
    run.result.selection.honorable_lure,
    run.result.selection.fly_of_the_day,
    run.result.selection.honorable_fly,
  ].filter((score) =>
    score.reasons.some((reason) => reason.startsWith(`goal:${run.goal}:`))
  ).map((score) => score.profile.id);
}

function scenarioSummary(run: ReplayRun): string {
  const scenario = run.result.scenario;
  return [
    `activity=${scenario.activity_level}`,
    `score=${scenario.hows_score}`,
    `wind=${scenario.wind_mode}`,
    `daylight_wind=${scenario.daylight_wind_mph ?? "null"}`,
    `light=${scenario.light_mode}`,
    `thermal=${scenario.thermal_mode}`,
    `movement=${scenario.water_movement_mode}`,
    `pressure=${scenario.pressure_mode}`,
    `surface=${scenario.surface_daily_gate}`,
    `tags=${scenario.scenario_tags.join("|") || "none"}`,
    `missing=${scenario.missing_inputs.join("|") || "none"}`,
    `confidence=${scenario.confidence}`,
  ].join(" ");
}

function compareLabel(run: ReplayRun): string {
  return `${run.result.diagnostics.selected_lure_ids.join("/")} + ${
    run.result.diagnostics.selected_fly_ids.join("/")
  }`;
}

function comparisonFixtures(): Fixture[] {
  const base: Fixture = {
    id: "cmp_lmb_base",
    label: "Comparison base LMB lake",
    source_note: "Synthetic one-input QA8A comparison",
    species: "largemouth_bass",
    region_key: "great_lakes_upper_midwest",
    state_code: "MN",
    latitude: 44.9,
    longitude: -93.2,
    local_date: "2025-06-15",
    local_timezone: "UTC",
    water_type: "freshwater_lake_pond",
    water_clarity: "stained",
    hows_score: 62,
    daylight_wind_mph: 8,
    light_label: "mixed",
    temperature_band: "optimal",
    temperature_trend: "stable",
    pressure_label: "stable_neutral",
    review_ids: [],
  };
  const riverBase: Fixture = {
    ...base,
    id: "cmp_smb_river_base",
    label: "Comparison base SMB river",
    species: "smallmouth_bass",
    region_key: "great_lakes_upper_midwest",
    state_code: "MI",
    local_date: "2025-05-09",
    local_timezone: "UTC",
    water_type: "freshwater_river",
    water_clarity: "stained",
    temperature_band: "cool",
    runoff_label: "stable",
  };
  return [
    base,
    {
      ...base,
      id: "cmp_hourly_wind_beats_scalar",
      scalar_wind_mph: 3,
      hourly_daylight_wind_mph: 12,
      hourly_outside_wind_mph: 2,
    },
    {
      ...base,
      id: "cmp_wind_calm_low_light",
      daylight_wind_mph: 4,
      light_label: "low_light",
      hows_score: 76,
    },
    { ...base, id: "cmp_wind_windy", daylight_wind_mph: 17, hows_score: 72 },
    { ...base, id: "cmp_temp_cold", temperature_band: "cool" },
    { ...base, id: "cmp_temp_warming", temperature_trend: "warming" },
    { ...base, id: "cmp_temp_heat", temperature_band: "very_warm" },
    { ...base, id: "cmp_clear", water_clarity: "clear" },
    { ...base, id: "cmp_dirty", water_clarity: "dirty" },
    {
      ...base,
      id: "cmp_suppressed",
      hows_score: 30,
      light_label: "low_light",
      daylight_wind_mph: 4,
    },
    riverBase,
    {
      ...riverBase,
      id: "cmp_river_elevated",
      runoff_label: "elevated",
      water_clarity: "dirty",
    },
    {
      ...riverBase,
      id: "cmp_river_blown_out",
      runoff_label: "blown_out",
      water_clarity: "dirty",
    },
    { ...riverBase, id: "cmp_river_unknown_runoff", runoff_label: undefined },
    { ...base, id: "cmp_low_reliability", reliability: "low" },
  ];
}

function printComparisonReport(): void {
  console.log("Daily-picks controlled input comparison");
  for (const fixture of comparisonFixtures()) {
    for (const goal of GOALS) {
      const run = runFixture(fixture, goal);
      console.log(
        `  ${fixture.id} ${goal}: ${scenarioSummary(run)} picks=${
          compareLabel(run)
        }`,
      );
    }
  }
}

function main(): void {
  const json = Deno.args.includes("--json");
  const trace = Deno.args.includes("--trace");
  const normalization = Deno.args.includes("--normalization");
  const comparisons = Deno.args.includes("--comparisons");
  const runs = FIXTURES.flatMap((fixture) =>
    GOALS.map((goal) => runFixture(fixture, goal))
  );
  const bySpecies = new Map<RecommenderV4Species, ReplayRun[]>();
  const selectedCounts = new Map<string, number>();
  const topCounts = new Map<string, number>();
  const watchCounts = new Map<string, number>();
  const broadFlyCounts = new Map<string, number>();
  const broadFlyBySpecies = new Map<string, number>();
  const reviewHits = new Map<string, string[]>();
  const redFlags: string[] = [];
  const apBfIdentical: string[] = [];
  const surfaceWatch: string[] = [];
  const cautionSurfaceWatch: string[] = [];
  let broadFlySelections = 0;
  let flySelections = 0;

  for (const run of runs) {
    const speciesRuns = bySpecies.get(run.fixture.species) ?? [];
    speciesRuns.push(run);
    bySpecies.set(run.fixture.species, speciesRuns);

    for (const id of selectedIds(run)) {
      increment(selectedCounts, id);
      if ((NEW_OR_WATCH_IDS as readonly string[]).includes(id)) {
        increment(watchCounts, id);
      }
    }
    increment(topCounts, run.result.selection.lure_of_the_day.profile.id);
    increment(topCounts, run.result.selection.fly_of_the_day.profile.id);

    for (
      const score of [
        run.result.selection.fly_of_the_day,
        run.result.selection.honorable_fly,
      ]
    ) {
      flySelections++;
      if (BROAD_FLY_IDS.has(score.profile.id)) {
        broadFlySelections++;
        increment(broadFlyCounts, score.profile.id);
        increment(
          broadFlyBySpecies,
          `${run.fixture.species}:${score.profile.id}`,
        );
      }
    }

    const selected = selectedIds(run);
    const hits = run.fixture.review_ids.filter((id) => selected.includes(id));
    if (hits.length > 0) {
      reviewHits.set(`${run.fixture.id}|${run.goal}`, hits);
    }

    const selectedSurface = [
      run.result.selection.lure_of_the_day,
      run.result.selection.honorable_lure,
      run.result.selection.fly_of_the_day,
      run.result.selection.honorable_fly,
    ].filter((score) => score.profile.is_surface).map((score) =>
      score.profile.id
    );
    if (
      selectedSurface.length > 0 &&
      run.result.scenario.surface_daily_gate === "closed"
    ) {
      redFlags.push(
        `${run.fixture.id} ${run.goal}: surface selected while closed (${
          selectedSurface.join(",")
        })`,
      );
    }
    if (
      selectedSurface.length > 0 &&
      run.result.scenario.surface_daily_gate === "caution"
    ) {
      cautionSurfaceWatch.push(
        `${run.fixture.id} ${run.goal}: ${selectedSurface.join(",")}`,
      );
    }
    if (
      selected.some((id) => id === "mouse_fly" || id === "wake_bait") &&
      (run.fixture.species !== "largemouth_bass" &&
          run.fixture.species !== "smallmouth_bass" &&
          run.fixture.species !== "trout" ||
        run.result.scenario.surface_daily_gate !== "open")
    ) {
      surfaceWatch.push(
        `${run.fixture.id} ${run.goal}: ${
          selected.filter((id) => id === "mouse_fly" || id === "wake_bait")
            .join(",")
        } surface=${run.result.scenario.surface_daily_gate}`,
      );
    }
    if (idsWithGoalReason(run).length === 0) {
      redFlags.push(
        `${run.fixture.id} ${run.goal}: no selected goal-specific score reason`,
      );
    }
  }

  for (const fixture of FIXTURES) {
    const ap = runs.find((run) =>
      run.fixture.id === fixture.id && run.goal === "all_purpose"
    )!;
    const bf = runs.find((run) =>
      run.fixture.id === fixture.id && run.goal === "big_fish"
    )!;
    if (setKey(ap) === setKey(bf)) apBfIdentical.push(fixture.id);
  }

  const repeats: string[] = [];
  const grouped = new Map<string, Fixture[]>();
  for (const fixture of FIXTURES) {
    const fixtures = grouped.get(fisheryKey(fixture)) ?? [];
    fixtures.push(fixture);
    grouped.set(fisheryKey(fixture), fixtures);
  }
  for (const fixtures of grouped.values()) {
    fixtures.sort((a, b) => a.local_date.localeCompare(b.local_date));
    for (let i = 1; i < fixtures.length; i++) {
      const prev = fixtures[i - 1]!;
      const next = fixtures[i]!;
      const prevDate = new Date(`${prev.local_date}T00:00:00Z`);
      const nextDate = new Date(`${next.local_date}T00:00:00Z`);
      const dayDiff = (nextDate.getTime() - prevDate.getTime()) / 86_400_000;
      if (dayDiff !== 1) continue;
      for (const goal of GOALS) {
        const a = runs.find((run) =>
          run.fixture.id === prev.id && run.goal === goal
        )!;
        const b = runs.find((run) =>
          run.fixture.id === next.id && run.goal === goal
        )!;
        if (setKey(a) === setKey(b)) {
          repeats.push(
            `${
              fisheryKey(prev)
            } ${goal}: ${prev.local_date}->${next.local_date}`,
          );
        }
      }
    }
  }

  const report = {
    fixture_count: FIXTURES.length,
    run_count: runs.length,
    broad_fly_share: flySelections === 0
      ? 0
      : broadFlySelections / flySelections,
    broad_fly_counts: topEntries(broadFlyCounts, BROAD_FLY_IDS.size),
    broad_fly_by_species: topEntries(broadFlyBySpecies, 40),
    ap_bf_identical_count: apBfIdentical.length,
    adjacent_repeat_count: repeats.length,
    top_selected: topEntries(topCounts, 12),
    most_selected: topEntries(selectedCounts, 12),
    watch_counts: topEntries(watchCounts, NEW_OR_WATCH_IDS.length),
    review_hits: [...reviewHits.entries()].sort(),
    surface_watch: surfaceWatch,
    caution_surface_watch: cautionSurfaceWatch,
    red_flags: redFlags,
    adjacent_repeats: repeats,
    by_species: [...bySpecies.entries()].map(([species, speciesRuns]) => ({
      species,
      runs: speciesRuns.length,
      most_selected: topEntries(
        speciesRuns.reduce((map, run) => {
          for (const id of selectedIds(run)) increment(map, id);
          return map;
        }, new Map<string, number>()),
        8,
      ),
    })),
  };

  if (json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log("Daily-picks archived-weather replay summary");
  console.log(`Fixtures: ${report.fixture_count}`);
  console.log(`Goal runs: ${report.run_count}`);
  console.log(`Broad fly selected share: ${report.broad_fly_share.toFixed(3)}`);
  console.log(`AP/BF identical fixture sets: ${report.ap_bf_identical_count}`);
  console.log(`Adjacent-day exact repeats: ${report.adjacent_repeat_count}`);
  console.log("");
  console.log("Fixture matrix:");
  for (const fixture of FIXTURES) {
    console.log(
      `  ${fixture.id}: ${fixture.species}/${fixture.region_key}/m${
        monthFromDate(fixture.local_date)
      }/${fixture.water_type} ${fixture.water_clarity} wind=${fixture.daylight_wind_mph} light=${fixture.light_label} temp=${fixture.temperature_band}/${fixture.temperature_trend}`,
    );
  }
  console.log("");
  console.log("Replay selections:");
  for (const run of runs) {
    console.log(`  ${run.fixture.id} ${run.goal}: ${selectedSummary(run)}`);
  }
  console.log("");
  console.log("Top selected IDs:");
  for (const [id, count] of report.top_selected) {
    console.log(`  ${id}: ${count}`);
  }
  console.log("Most selected IDs:");
  for (const [id, count] of report.most_selected) {
    console.log(`  ${id}: ${count}`);
  }
  console.log("Broad fly selected IDs:");
  for (const [id, count] of report.broad_fly_counts) {
    console.log(`  ${id}: ${count}`);
  }
  console.log("QA5B/watch selected IDs:");
  for (const [id, count] of report.watch_counts) {
    console.log(`  ${id}: ${count}`);
  }
  console.log("Review target hits:");
  for (const [key, hits] of report.review_hits) {
    console.log(`  ${key}: ${hits.join(",")}`);
  }
  if (report.surface_watch.length > 0) {
    console.log("Surface watch:");
    for (const item of report.surface_watch) console.log(`  ${item}`);
  }
  if (report.caution_surface_watch.length > 0) {
    console.log("Caution surface selections:");
    for (const item of report.caution_surface_watch) console.log(`  ${item}`);
  }
  if (report.adjacent_repeats.length > 0) {
    console.log("Adjacent-day exact repeats:");
    for (const item of report.adjacent_repeats) console.log(`  ${item}`);
  }
  if (report.red_flags.length > 0) {
    console.log("Red flags:");
    for (const item of report.red_flags) console.log(`  ${item}`);
  }
  if (normalization) {
    console.log("Scenario normalization and selected context:");
    for (const run of runs) {
      console.log(`  ${run.fixture.id} ${run.goal}: ${scenarioSummary(run)}`);
      console.log(`    ${rowSummary(run.result.row)}`);
      for (const line of selectedContextLines(run)) {
        console.log(`    ${line}`);
      }
    }
  }
  if (comparisons) {
    printComparisonReport();
  }
  if (trace) {
    console.log("Score traces:");
    for (const run of runs) {
      const lines: string[] = [];
      lines.push(...traceScores({
        label: "broad flies",
        scores: run.result.fly_scores,
        ids: BROAD_FLY_IDS,
      }));
      if (run.fixture.species === "northern_pike") {
        lines.push(...traceScores({
          label: "pike reaction lures",
          scores: run.result.lure_scores,
          ids: PIKE_REACTION_TRACE_IDS,
        }));
      }
      if (
        run.fixture.species === "smallmouth_bass" &&
        run.fixture.water_type === "freshwater_lake_pond" &&
        run.goal === "big_fish"
      ) {
        lines.push(...traceScores({
          label: "SMB clear-lake Big Fish lures",
          scores: run.result.lure_scores,
          ids: COMPACT_GLIDE_TRACE_IDS,
        }));
      }
      if (
        run.fixture.id === "lmb_midwest_jun14_dirty_river" &&
        run.goal === "big_fish"
      ) {
        lines.push(...traceScores({
          label: "surface caution lures",
          scores: run.result.lure_scores,
          ids: new Set(["buzzbait", "walking_topwater", "popping_topwater"]),
        }));
        lines.push(...traceScores({
          label: "surface caution flies",
          scores: run.result.fly_scores,
          ids: new Set(["deer_hair_slider", "popper_fly", "foam_gurgler_fly"]),
        }));
      }
      if (lines.length === 0) continue;
      console.log(`  ${run.fixture.id} ${run.goal}:`);
      for (const line of lines) console.log(line);
    }
  }
}

main();
