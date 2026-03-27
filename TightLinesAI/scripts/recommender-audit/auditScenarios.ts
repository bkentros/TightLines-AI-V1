import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RecommenderRefinements } from "../../supabase/functions/_shared/recommenderEngine/contracts.ts";

type ExpectationShape = {
  top_depth_in?: string[];
  top_relation_in?: string[];
  top_archetype_in?: string[];
  forbidden_top_archetype_ids?: string[];
  required_style_flags?: string[];
  top_lure_ids_in?: string[];
  top_lure_method_ids_in?: string[];
  top_fly_ids_in?: string[];
  top_fly_method_ids_in?: string[];
  forbidden_top_lure_ids?: string[];
  activity_in?: string[];
};

export type RecommenderAuditScenario = {
  id: string;
  notes: string;
  latitude: number;
  longitude: number;
  local_date: string;
  local_timezone: string;
  context: EngineContext;
  env_data: Record<string, unknown>;
  refinements?: RecommenderRefinements;
  expectations: ExpectationShape;
};

function dailySeries(base: number, dayMinus2: number, dayMinus1: number, today: number): number[] {
  const values = Array.from({ length: 21 }, () => base);
  values[12] = dayMinus2;
  values[13] = dayMinus1;
  values[14] = today;
  return values;
}

function baseEnv(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    timezone: "America/New_York",
    weather: {
      temperature: 62,
      pressure: 1013,
      wind_speed: 8,
      cloud_cover: 45,
      temp_7day_high: dailySeries(68, 60, 64, 68),
      temp_7day_low: dailySeries(52, 42, 46, 50),
      precip_7day_daily: Array.from({ length: 21 }, () => 0),
      precip_7day_inches: 0,
      ...((overrides.weather as Record<string, unknown> | undefined) ?? {}),
    },
    ...overrides,
  };
}

export const RECOMMENDER_AUDIT_SCENARIOS: RecommenderAuditScenario[] = [
  {
    id: "north-lake-spring-warming",
    notes: "Northern post-spawn warmth should finally open search lanes after the cold-season hold clears.",
    latitude: 44.97,
    longitude: -93.26,
    local_date: "2026-06-20",
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    env_data: baseEnv({
      weather: {
        temperature: 76,
        temp_7day_high: dailySeries(74, 68, 72, 76),
        temp_7day_low: dailySeries(56, 50, 54, 58),
      },
    }),
    refinements: { water_clarity: "clear" },
    expectations: {
      top_depth_in: ["shallow", "mid_depth", "upper_column"],
      top_archetype_in: ["horizontal_search_mid_column", "grass_edge_swim"],
      top_lure_ids_in: ["paddle_tail_swimbait", "chatterbait", "spinnerbait", "crankbait_shallow_mid"],
      activity_in: ["active", "aggressive"],
    },
  },
  {
    id: "great-lakes-late-march-cold-lake",
    notes: "Late-March Great Lakes lake fishing should still be winter-hold oriented, not surface or summer-search oriented.",
    latitude: 44.30,
    longitude: -84.68,
    local_date: "2026-03-26",
    local_timezone: "America/Detroit",
    context: "freshwater_lake_pond",
    env_data: baseEnv({
      timezone: "America/Detroit",
      weather: {
        temperature: 35,
        pressure: 1019,
        cloud_cover: 35,
        temp_7day_high: dailySeries(36, 34, 35, 36),
        temp_7day_low: dailySeries(24, 20, 22, 24),
      },
    }),
    refinements: { water_clarity: "clear" },
    expectations: {
      top_depth_in: ["deep", "bottom_oriented", "lower_column"],
      top_archetype_in: ["slow_bottom_contact", "tight_to_cover_vertical"],
      forbidden_top_archetype_ids: ["surface_low_light_commotion", "grass_edge_swim", "horizontal_search_mid_column"],
      required_style_flags: ["slow_bottom_best", "finesse_best"],
      top_lure_ids_in: ["jig_trailer", "finesse_worm", "jerkbait"],
      top_lure_method_ids_in: ["crawl_hop_bottom", "shaky_head_drag", "suspend_twitch_pause"],
      top_fly_ids_in: ["nymph_rig", "weighted_streamer", "woolly_bugger_leech"],
      top_fly_method_ids_in: ["dead_drift_bottom", "sink_strip_pause", "dead_drift_swing"],
      forbidden_top_lure_ids: ["frog_toad", "topwater_walker_popper", "spinnerbait", "chatterbait"],
      activity_in: ["inactive", "neutral"],
    },
  },
  {
    id: "great-lakes-late-march-warm-spell-lake",
    notes: "A northern March warm spell can loosen fish slightly, but it should still stay a cold-water, lower-lane recommendation.",
    latitude: 44.30,
    longitude: -84.68,
    local_date: "2026-03-26",
    local_timezone: "America/Detroit",
    context: "freshwater_lake_pond",
    env_data: baseEnv({
      timezone: "America/Detroit",
      weather: {
        temperature: 49,
        pressure: 1017,
        cloud_cover: 45,
        temp_7day_high: dailySeries(48, 38, 43, 49),
        temp_7day_low: dailySeries(34, 26, 30, 36),
      },
    }),
    refinements: { water_clarity: "stained" },
    expectations: {
      top_depth_in: ["deep", "bottom_oriented", "lower_column", "mid_depth"],
      top_archetype_in: ["slow_bottom_contact", "tight_to_cover_vertical", "depth_break_suspend_pause"],
      forbidden_top_archetype_ids: ["surface_low_light_commotion", "grass_edge_swim"],
      required_style_flags: ["finesse_best", "slow_bottom_best"],
      top_lure_ids_in: ["jig_trailer", "finesse_worm", "jerkbait"],
      top_fly_ids_in: ["nymph_rig", "weighted_streamer", "woolly_bugger_leech"],
      forbidden_top_lure_ids: ["frog_toad", "topwater_walker_popper", "spinnerbait", "chatterbait"],
      activity_in: ["neutral"],
    },
  },
  {
    id: "south-lake-midsummer-heat",
    notes: "Southern midsummer warming should tighten fish to shade, cover, and deeper edges instead of pushing them shallower.",
    latitude: 27.95,
    longitude: -82.46,
    local_date: "2026-07-20",
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    env_data: baseEnv({
      weather: {
        temperature: 92,
        cloud_cover: 12,
        temp_7day_high: dailySeries(90, 86, 88, 94),
        temp_7day_low: dailySeries(78, 74, 76, 80),
      },
    }),
    refinements: { water_clarity: "clear" },
    expectations: {
      top_relation_in: ["shade_oriented", "depth_transition_oriented"],
      top_archetype_in: ["slow_bottom_contact", "tight_to_cover_vertical"],
      top_lure_ids_in: ["finesse_worm", "jig_trailer", "soft_stick_worm"],
    },
  },
  {
    id: "river-runoff-soft-water",
    notes: "Runoff should push the river recommendation toward seams, current breaks, and drift-based presentations.",
    latitude: 35.95,
    longitude: -83.92,
    local_date: "2026-04-18",
    local_timezone: "America/New_York",
    context: "freshwater_river",
    env_data: baseEnv({
      weather: {
        precipitation: 25.4,
        precip_7day_daily: dailySeries(0.2, 1.1, 1.3, 1.0),
        precip_7day_inches: 4.2,
      },
    }),
    refinements: { water_clarity: "dirty" },
    expectations: {
      top_relation_in: ["seam_oriented", "current_break_oriented"],
      top_archetype_in: ["current_seam_drift", "slow_bottom_contact"],
      required_style_flags: ["current_drift_best"],
      top_fly_ids_in: ["weighted_streamer", "nymph_rig", "woolly_bugger_leech"],
      top_fly_method_ids_in: ["swing_current_edge", "dead_drift_bottom", "dead_drift_swing"],
    },
  },
  {
    id: "coastal-moving-water-channel",
    notes: "Broader coastal should stay channel, point, and current-lane oriented on a moving tide day.",
    latitude: 29.14,
    longitude: -83.03,
    local_date: "2026-06-14",
    local_timezone: "America/New_York",
    context: "coastal",
    env_data: baseEnv({
      weather: {
        temperature: 82,
        cloud_cover: 48,
        temp_7day_high: dailySeries(84, 80, 82, 86),
        temp_7day_low: dailySeries(72, 70, 71, 74),
      },
      tides: {
        station_id: "123",
        station_name: "Test",
        unit: "ft",
        phase: "falling",
        high_low: [
          { time: "2026-06-14T06:00:00-04:00", type: "H", value: 2.4 },
          { time: "2026-06-14T12:00:00-04:00", type: "L", value: 0.2 },
          { time: "2026-06-14T18:00:00-04:00", type: "H", value: 2.2 },
        ],
      },
      coastal: true,
    }),
    refinements: { water_clarity: "clear" },
    expectations: {
      top_relation_in: ["channel_related", "point_oriented"],
      top_archetype_in: ["horizontal_search_mid_column", "depth_break_suspend_pause"],
      top_lure_ids_in: ["jighead_minnow", "paddle_tail_swimbait", "weighted_bottom_presentation"],
      top_lure_method_ids_in: ["steady_jighead_swim", "glide_pause_swim", "bottom_drag"],
    },
  },
  {
    id: "flats-falling-drains",
    notes: "Flats and estuary should shift to drains, troughs, and potholes on the same falling-tide setup.",
    latitude: 29.14,
    longitude: -83.03,
    local_date: "2026-06-14",
    local_timezone: "America/New_York",
    context: "coastal_flats_estuary",
    env_data: baseEnv({
      weather: {
        temperature: 82,
        cloud_cover: 48,
        temp_7day_high: dailySeries(84, 80, 82, 86),
        temp_7day_low: dailySeries(72, 70, 71, 74),
      },
      tides: {
        station_id: "123",
        station_name: "Test",
        unit: "ft",
        phase: "falling",
        high_low: [
          { time: "2026-06-14T06:00:00-04:00", type: "H", value: 2.4 },
          { time: "2026-06-14T12:00:00-04:00", type: "L", value: 0.2 },
          { time: "2026-06-14T18:00:00-04:00", type: "H", value: 2.2 },
        ],
      },
      coastal: true,
    }),
    refinements: { water_clarity: "stained" },
    expectations: {
      top_relation_in: ["drain_oriented", "trough_oriented", "pothole_oriented"],
      top_archetype_in: ["drain_edge_intercept"],
      required_style_flags: ["draining_window_best"],
      top_lure_ids_in: ["shrimp_imitation", "jighead_minnow", "weighted_bottom_presentation"],
      top_lure_method_ids_in: ["subtle_hop_fall", "steady_jighead_swim", "bottom_drag"],
      top_fly_ids_in: ["shrimp_fly", "crab_fly", "baitfish_streamer"],
      top_fly_method_ids_in: ["short_strip_pause", "dead_stick_drop", "slow_strip_pause"],
    },
  },
  {
    id: "summer-low-light-grass-lake",
    notes: "Summer low light should reopen surface and grass-edge families in lake context instead of defaulting to bottom finesse only.",
    latitude: 31.50,
    longitude: -81.37,
    local_date: "2026-08-08",
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    env_data: baseEnv({
      weather: {
        temperature: 82,
        cloud_cover: 85,
        temp_7day_high: dailySeries(84, 82, 83, 85),
        temp_7day_low: dailySeries(71, 69, 70, 72),
      },
    }),
    refinements: { water_clarity: "dirty" },
    expectations: {
      top_depth_in: ["very_shallow", "shallow", "upper_column"],
      top_archetype_in: ["surface_low_light_commotion", "grass_edge_swim"],
      top_lure_ids_in: ["frog_toad", "topwater_walker_popper", "paddle_tail_swimbait"],
      top_lure_method_ids_in: ["hollow_body_pause", "pop_pause_surface", "steady_toad_swim"],
    },
  },
];
