/**
 * Smallmouth Bass — 5 scenarios focused on prime regions and commonly-fished months.
 *
 * Prime smallmouth regions (guide-level consensus):
 *   - great_lakes_upper_midwest → Lake Erie/Ontario east basins, St. Lawrence, Mille Lacs, WI/MI inland lakes
 *   - northeast                 → Lake Champlain, Susquehanna/Juniata PA rivers, NY Finger Lakes
 *   - appalachian               → New River (VA/WV), Shenandoah, South Branch Potomac
 *   - midwest_interior          → Ohio River, lower Great Lakes tribs
 *
 * Most commonly fished months in these regions: April (cold pre-spawn), May (spawn),
 * June (post-spawn feed), July-August (summer peak), September-October (fall feed).
 */

import type { ReportAuditScenarioSet } from "../types.ts";
import { pressureTrend } from "../helpers.ts";

export const SMALLMOUTH_SCENARIO_SET: ReportAuditScenarioSet = {
  species: "smallmouth_bass",
  species_display_name: "Smallmouth Bass",
  primary_regions_rationale:
    "Great Lakes / Upper Midwest and Northeast are the historical smallmouth strongholds " +
    "(Lake Erie, Champlain, St. Lawrence, Finger Lakes, Mille Lacs). Appalachian rivers " +
    "(New, Shenandoah, Susquehanna) and midwest river systems round out the core fishery.",
  commonly_fished_months_rationale:
    "Smallmouth fishing peaks April-October in northern waters. May = spawn, June = " +
    "aggressive post-spawn feed, July-August = summer crayfish/baitfish pattern, " +
    "September-October = fall feed before cold-dormant window.",
  scenarios: [
    {
      id: "smb-01-upper-midwest-river-may-prespawn",
      title: "Upper Midwest river • May pre-spawn • warming trend",
      intent:
        "Mid-May on a WI/MN smallmouth river. Water temps climbing into the low-60s, " +
        "fish staging pre-spawn. Stable pressure, partly cloudy, light wind. Guide read: " +
        "mid-column reaction or bottom-oriented crayfish presentations, moderate pace, " +
        "moderate presence. Surface should not be the top pick yet.",
      species: "smallmouth_bass",
      context: "freshwater_river",
      water_clarity: "clear",
      condition_profile: "spring_spawn_warming",
      location: {
        region_key: "great_lakes_upper_midwest",
        state_code: "WI",
        latitude: 44.65,
        longitude: -90.85,
        timezone: "America/Chicago",
        local_date: "2026-05-12",
        month: 5,
      },
      environment: {
        current_air_temp_f: 64,
        daily_mean_air_temp_f: 60,
        daily_low_air_temp_f: 48,
        daily_high_air_temp_f: 72,
        prior_day_mean_air_temp_f: 58,
        day_minus_2_mean_air_temp_f: 55,
        measured_water_temp_f: 61,
        measured_water_temp_24h_ago_f: 60,
        measured_water_temp_72h_ago_f: 57,
        pressure_mb: 1018,
        pressure_history_mb: pressureTrend(1018, 1017),
        wind_speed_mph: 7,
        cloud_cover_pct: 45,
        precip_24h_in: 0,
        precip_72h_in: 0.1,
        precip_7d_in: 0.4,
        active_precip_now: false,
        sunrise_local: "2026-05-12T05:42:00-05:00",
        sunset_local: "2026-05-12T20:15:00-05:00",
      },
    },
    {
      id: "smb-02-upper-midwest-lake-july-summer-peak",
      title: "Upper Midwest lake • July • stable summer with crayfish pattern",
      intent:
        "Mid-July on a clear northern MN/WI lake. Water 72°F, sun angle high, bass on " +
        "rocky summer haunts feeding on crayfish and small perch. Stable high pressure, " +
        "partly cloudy mid-day, light wind. Guide read: bottom-biased crayfish or reaction " +
        "jerkbait/topwater in low light. Surface is on the table but not dominant at mid-day.",
      species: "smallmouth_bass",
      context: "freshwater_lake_pond",
      water_clarity: "clear",
      condition_profile: "stable_high_pressure_clear",
      location: {
        region_key: "great_lakes_upper_midwest",
        state_code: "MN",
        latitude: 46.8,
        longitude: -93.95,
        timezone: "America/Chicago",
        local_date: "2026-07-14",
        month: 7,
      },
      environment: {
        current_air_temp_f: 81,
        daily_mean_air_temp_f: 76,
        daily_low_air_temp_f: 62,
        daily_high_air_temp_f: 85,
        prior_day_mean_air_temp_f: 75,
        day_minus_2_mean_air_temp_f: 74,
        measured_water_temp_f: 72,
        measured_water_temp_24h_ago_f: 72,
        measured_water_temp_72h_ago_f: 71,
        pressure_mb: 1019,
        pressure_history_mb: pressureTrend(1019, 1018),
        wind_speed_mph: 6,
        cloud_cover_pct: 30,
        precip_24h_in: 0,
        precip_72h_in: 0,
        precip_7d_in: 0.2,
        active_precip_now: false,
        sunrise_local: "2026-07-14T05:34:00-05:00",
        sunset_local: "2026-07-14T20:58:00-05:00",
      },
    },
    {
      id: "smb-03-northeast-river-june-postspawn",
      title: "Northeast river • June post-spawn • overcast, pre-front reaction day",
      intent:
        "Early June on a NY/PA smallmouth river (e.g. Susquehanna). Post-spawn fish " +
        "aggressive, recovering, feeding on baitfish and crayfish. Overcast, falling " +
        "pressure, moderate wind — classic reaction window. Guide read: mid-column " +
        "reaction baits should rate high, pace medium-fast, bolder presence OK.",
      species: "smallmouth_bass",
      context: "freshwater_river",
      water_clarity: "stained",
      condition_profile: "pre_front_falling_pressure",
      location: {
        region_key: "northeast",
        state_code: "PA",
        latitude: 40.75,
        longitude: -76.55,
        timezone: "America/New_York",
        local_date: "2026-06-08",
        month: 6,
      },
      environment: {
        current_air_temp_f: 72,
        daily_mean_air_temp_f: 70,
        daily_low_air_temp_f: 60,
        daily_high_air_temp_f: 78,
        prior_day_mean_air_temp_f: 72,
        day_minus_2_mean_air_temp_f: 74,
        measured_water_temp_f: 68,
        measured_water_temp_24h_ago_f: 68,
        measured_water_temp_72h_ago_f: 67,
        pressure_mb: 1008,
        pressure_history_mb: pressureTrend(1008, 1016),
        wind_speed_mph: 14,
        cloud_cover_pct: 85,
        precip_24h_in: 0.15,
        precip_72h_in: 0.4,
        precip_7d_in: 0.9,
        active_precip_now: false,
        sunrise_local: "2026-06-08T05:30:00-04:00",
        sunset_local: "2026-06-08T20:31:00-04:00",
      },
    },
    {
      id: "smb-04-appalachian-river-september-fall-feed",
      title: "Appalachian river • September • fall feed, cool clear water",
      intent:
        "Mid-September on the New River (WV/VA) or similar Appalachian smallmouth river. " +
        "Water cooling into the upper-60s, fish keying on baitfish before the cold-dormant " +
        "window. Stable pressure, cool mornings, clear water. Guide read: baitfish imitators " +
        "(jerkbaits, tubes, streamers), moderate pace, moderate presence.",
      species: "smallmouth_bass",
      context: "freshwater_river",
      water_clarity: "clear",
      condition_profile: "fall_feed_cooling",
      location: {
        region_key: "appalachian",
        state_code: "WV",
        latitude: 37.65,
        longitude: -80.85,
        timezone: "America/New_York",
        local_date: "2026-09-18",
        month: 9,
      },
      environment: {
        current_air_temp_f: 68,
        daily_mean_air_temp_f: 64,
        daily_low_air_temp_f: 52,
        daily_high_air_temp_f: 74,
        prior_day_mean_air_temp_f: 66,
        day_minus_2_mean_air_temp_f: 68,
        measured_water_temp_f: 67,
        measured_water_temp_24h_ago_f: 68,
        measured_water_temp_72h_ago_f: 70,
        pressure_mb: 1020,
        pressure_history_mb: pressureTrend(1020, 1018),
        wind_speed_mph: 5,
        cloud_cover_pct: 35,
        precip_24h_in: 0,
        precip_72h_in: 0.1,
        precip_7d_in: 0.3,
        active_precip_now: false,
        sunrise_local: "2026-09-18T07:04:00-04:00",
        sunset_local: "2026-09-18T19:18:00-04:00",
      },
    },
    {
      id: "smb-05-upper-midwest-river-july-postfront-bluebird",
      title: "Upper Midwest river • July • post-cold-front bluebird (classic tough day)",
      intent:
        "Mid-July on a MN smallmouth river the day after a strong cold front. " +
        "Bluebird sky, flat calm, high pressure, water temps holding but fish " +
        "tight-lipped. Guide read: SUBTLE + SLOW + BOTTOM presentations; drop-shot, " +
        "tube on the bottom, finesse worms. Surface should close or heavily demote. " +
        "Opportunity mix should lean conservative. This is a stress-test scenario.",
      species: "smallmouth_bass",
      context: "freshwater_river",
      water_clarity: "clear",
      condition_profile: "post_front_bluebird",
      location: {
        region_key: "great_lakes_upper_midwest",
        state_code: "MN",
        latitude: 45.55,
        longitude: -94.15,
        timezone: "America/Chicago",
        local_date: "2026-07-22",
        month: 7,
      },
      environment: {
        current_air_temp_f: 68,
        daily_mean_air_temp_f: 66,
        daily_low_air_temp_f: 54,
        daily_high_air_temp_f: 76,
        prior_day_mean_air_temp_f: 74,
        day_minus_2_mean_air_temp_f: 80,
        measured_water_temp_f: 70,
        measured_water_temp_24h_ago_f: 72,
        measured_water_temp_72h_ago_f: 73,
        pressure_mb: 1025,
        pressure_history_mb: pressureTrend(1025, 1008),
        wind_speed_mph: 3,
        cloud_cover_pct: 10,
        precip_24h_in: 0.02,
        precip_72h_in: 0.9,
        precip_7d_in: 1.1,
        active_precip_now: false,
        sunrise_local: "2026-07-22T05:42:00-05:00",
        sunset_local: "2026-07-22T20:49:00-05:00",
      },
    },
  ],
};
