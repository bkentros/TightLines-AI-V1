/**
 * Northern Pike / Musky — 5 scenarios focused on prime regions and commonly-fished months.
 *
 * Prime pike regions (guide-level consensus):
 *   - great_lakes_upper_midwest → Lake of the Woods, Mille Lacs, Leech, Cass, WI/MI inland
 *   - northeast                 → Lake Champlain, St. Lawrence, NY / Maine / VT lakes
 *   - mountain_west             → MT/WY reservoirs & cold-water lakes (Fort Peck, Yellowstone R.)
 *   - alaska                    → interior AK pike (summer-only window)
 *
 * Most commonly fished months:
 *   - Post-ice-out: late April / May — hungry, shallow, aggressive
 *   - Early summer: June — weed-edge pattern
 *   - Summer: July-August — deeper, less aggressive
 *   - Fall feed: September-October — peak for trophy pike/musky
 */

import type { ReportAuditScenarioSet } from "../types.ts";
import { pressureTrend } from "../helpers.ts";

export const PIKE_SCENARIO_SET: ReportAuditScenarioSet = {
  species: "pike_musky",
  species_display_name: "Northern Pike / Musky",
  primary_regions_rationale:
    "Great Lakes / Upper Midwest is the heart of the North American pike fishery. Northeast " +
    "lakes (Champlain, St. Lawrence) and Mountain West cold-water reservoirs round it out. " +
    "Alaska is a distinct summer-only fishery and is represented in later batches if needed.",
  commonly_fished_months_rationale:
    "Pike peak post-ice-out (late April/May) in the shallows, remain fishable June-July on " +
    "weed edges, shift deeper in peak heat, and trigger a strong fall feed September-October. " +
    "Scenarios span post-ice-out aggression, early summer weed edge, hot summer, and fall feed.",
  scenarios: [
    {
      id: "pike-01-upper-midwest-lake-may-postspawn",
      title: "Upper Midwest lake • May • post-spawn shallow, overcast warm",
      intent:
        "Mid-May on a MN/WI pike water (Leech, Mille Lacs, Chippewa flowage). Ice-out " +
        "was weeks ago; water 58°F, pike post-spawn and recovering aggressively in " +
        "shallow weed flats. Overcast, moderate wind, falling pressure. Guide read: " +
        "big spinnerbaits, glide baits, jerkbaits, big flies — bold presence, medium-fast " +
        "pace. Mid-to-upper column dominates. Reaction window should be ON.",
      species: "pike_musky",
      context: "freshwater_lake_pond",
      water_clarity: "stained",
      condition_profile: "pre_front_falling_pressure",
      location: {
        region_key: "great_lakes_upper_midwest",
        state_code: "MN",
        latitude: 47.1,
        longitude: -94.5,
        timezone: "America/Chicago",
        local_date: "2026-05-18",
        month: 5,
      },
      environment: {
        current_air_temp_f: 66,
        daily_mean_air_temp_f: 62,
        daily_low_air_temp_f: 48,
        daily_high_air_temp_f: 74,
        prior_day_mean_air_temp_f: 60,
        day_minus_2_mean_air_temp_f: 56,
        measured_water_temp_f: 58,
        measured_water_temp_24h_ago_f: 57,
        measured_water_temp_72h_ago_f: 54,
        pressure_mb: 1010,
        pressure_history_mb: pressureTrend(1010, 1016),
        wind_speed_mph: 13,
        cloud_cover_pct: 85,
        precip_24h_in: 0.1,
        precip_72h_in: 0.3,
        precip_7d_in: 0.7,
        active_precip_now: false,
        sunrise_local: "2026-05-18T05:33:00-05:00",
        sunset_local: "2026-05-18T20:43:00-05:00",
      },
    },
    {
      id: "pike-02-northeast-lake-september-fall-feed",
      title: "Northeast lake • September • fall feed, stable cool clear",
      intent:
        "Late September on Lake Champlain / St. Lawrence-style pike/musky water. Water " +
        "cooling through the mid-60s, fish binging on ciscos and perch before winter. " +
        "Stable high pressure, clear, cool morning. Guide read: big swimbaits, glide baits, " +
        "bucktails, jerkbaits — bold presence, medium pace. Surface open but not dominant. " +
        "Mix should trend balanced-to-aggressive given the fall feed window.",
      species: "pike_musky",
      context: "freshwater_lake_pond",
      water_clarity: "clear",
      condition_profile: "fall_feed_cooling",
      location: {
        region_key: "northeast",
        state_code: "VT",
        latitude: 44.55,
        longitude: -73.2,
        timezone: "America/New_York",
        local_date: "2026-09-26",
        month: 9,
      },
      environment: {
        current_air_temp_f: 62,
        daily_mean_air_temp_f: 58,
        daily_low_air_temp_f: 48,
        daily_high_air_temp_f: 68,
        prior_day_mean_air_temp_f: 60,
        day_minus_2_mean_air_temp_f: 62,
        measured_water_temp_f: 63,
        measured_water_temp_24h_ago_f: 64,
        measured_water_temp_72h_ago_f: 66,
        pressure_mb: 1020,
        pressure_history_mb: pressureTrend(1020, 1019),
        wind_speed_mph: 6,
        cloud_cover_pct: 30,
        precip_24h_in: 0,
        precip_72h_in: 0.1,
        precip_7d_in: 0.4,
        active_precip_now: false,
        sunrise_local: "2026-09-26T06:39:00-04:00",
        sunset_local: "2026-09-26T18:37:00-04:00",
      },
    },
    {
      id: "pike-03-upper-midwest-river-june-early-summer",
      title: "Upper Midwest river • June • early summer weed-edge window",
      intent:
        "Mid-June on a WI/MN pike river. Water 66°F, weeds up, pike on deep weed edges " +
        "ambushing baitfish. Partly cloudy, moderate wind, stable pressure. Guide read: " +
        "big spinnerbaits, mid-column reaction baits, weightless jerkbaits, streamer flies — " +
        "bold presence, medium pace. Surface open.",
      species: "pike_musky",
      context: "freshwater_river",
      water_clarity: "stained",
      condition_profile: "stable_high_pressure_clear",
      location: {
        region_key: "great_lakes_upper_midwest",
        state_code: "WI",
        latitude: 45.85,
        longitude: -89.65,
        timezone: "America/Chicago",
        local_date: "2026-06-22",
        month: 6,
      },
      environment: {
        current_air_temp_f: 74,
        daily_mean_air_temp_f: 70,
        daily_low_air_temp_f: 58,
        daily_high_air_temp_f: 80,
        prior_day_mean_air_temp_f: 69,
        day_minus_2_mean_air_temp_f: 70,
        measured_water_temp_f: 66,
        measured_water_temp_24h_ago_f: 66,
        measured_water_temp_72h_ago_f: 65,
        pressure_mb: 1017,
        pressure_history_mb: pressureTrend(1017, 1016),
        wind_speed_mph: 9,
        cloud_cover_pct: 45,
        precip_24h_in: 0,
        precip_72h_in: 0.2,
        precip_7d_in: 0.5,
        active_precip_now: false,
        sunrise_local: "2026-06-22T05:11:00-05:00",
        sunset_local: "2026-06-22T21:05:00-05:00",
      },
    },
    {
      id: "pike-04-mountain-west-lake-october-cold-front",
      title: "Mountain West lake • October • post-front, cold clear",
      intent:
        "Mid-October on a MT/WY cold-water pike reservoir (Fort Peck / similar). Water " +
        "in the low-50s, pike keying on hardcore fall feed but post-front has dampened " +
        "them. Bluebird high pressure, very cool morning. Guide read: big swimbaits and " +
        "jerkbaits worked slower; presence still bold but pace trending slower. Surface " +
        "likely closing. This is a stress-test for cold-fast-species logic.",
      species: "pike_musky",
      context: "freshwater_lake_pond",
      water_clarity: "clear",
      condition_profile: "post_front_bluebird",
      location: {
        region_key: "mountain_west",
        state_code: "MT",
        latitude: 47.95,
        longitude: -106.75,
        timezone: "America/Denver",
        local_date: "2026-10-15",
        month: 10,
      },
      environment: {
        current_air_temp_f: 48,
        daily_mean_air_temp_f: 44,
        daily_low_air_temp_f: 30,
        daily_high_air_temp_f: 56,
        prior_day_mean_air_temp_f: 52,
        day_minus_2_mean_air_temp_f: 60,
        measured_water_temp_f: 52,
        measured_water_temp_24h_ago_f: 54,
        measured_water_temp_72h_ago_f: 57,
        pressure_mb: 1028,
        pressure_history_mb: pressureTrend(1028, 1009),
        wind_speed_mph: 4,
        cloud_cover_pct: 15,
        precip_24h_in: 0,
        precip_72h_in: 0.3,
        precip_7d_in: 0.4,
        active_precip_now: false,
        sunrise_local: "2026-10-15T07:38:00-06:00",
        sunset_local: "2026-10-15T18:36:00-06:00",
      },
    },
    {
      id: "pike-05-northeast-lake-july-hot-summer",
      title: "Northeast lake • July • hot summer, deep water suspended",
      intent:
        "Mid-July on a Northeast lake (Lake George / Oneida). Surface 78°F, pike " +
        "suspended off deep weed lines and points chasing ciscos. Stable high pressure, " +
        "warm, light wind. Guide read: trolling-style presentations or big suspending " +
        "jerkbaits worked over deeper structure. Column should skew mid (not bottom, " +
        "pike are rarely true bottom). Pace medium, presence moderate-bold.",
      species: "pike_musky",
      context: "freshwater_lake_pond",
      water_clarity: "clear",
      condition_profile: "summer_peak_hot",
      location: {
        region_key: "northeast",
        state_code: "NY",
        latitude: 43.6,
        longitude: -75.8,
        timezone: "America/New_York",
        local_date: "2026-07-28",
        month: 7,
      },
      environment: {
        current_air_temp_f: 84,
        daily_mean_air_temp_f: 80,
        daily_low_air_temp_f: 68,
        daily_high_air_temp_f: 90,
        prior_day_mean_air_temp_f: 79,
        day_minus_2_mean_air_temp_f: 78,
        measured_water_temp_f: 78,
        measured_water_temp_24h_ago_f: 77,
        measured_water_temp_72h_ago_f: 76,
        pressure_mb: 1019,
        pressure_history_mb: pressureTrend(1019, 1018),
        wind_speed_mph: 7,
        cloud_cover_pct: 40,
        precip_24h_in: 0,
        precip_72h_in: 0.1,
        precip_7d_in: 0.3,
        active_precip_now: false,
        sunrise_local: "2026-07-28T05:45:00-04:00",
        sunset_local: "2026-07-28T20:30:00-04:00",
      },
    },
  ],
};
