/**
 * River Trout — 5 scenarios focused on prime regions and commonly-fished months.
 *
 * Prime trout regions (guide-level consensus):
 *   - mountain_west       → MT/WY/CO classic trout rivers (Madison, Yellowstone, Green, Colorado)
 *   - pacific_northwest   → OR/WA coastal + Cascades rivers (Deschutes, Rogue, Klickitat)
 *   - appalachian         → WV/NC/VA/TN freestone + tailwater trout (Smokies, Cherokee)
 *   - northeast           → NY Catskills / PA limestone / VT / ME wild trout rivers
 *   - mountain_alpine     → high-altitude alpine streams (CO high country, Sierra)
 *
 * Most commonly fished months by region:
 *   - Mountain West: April-November; peak May-September (run-off moderates hatch rhythms)
 *   - PNW: year-round in many rivers; peak spring + fall
 *   - Appalachian / Northeast: April-October; peak April-June hatch season, fall streamer window
 *
 * River trout is the ONLY context allowed for V3 trout — no lake/pond.
 */

import type { ReportAuditScenarioSet } from "../types.ts";
import { pressureTrend } from "../helpers.ts";

export const TROUT_SCENARIO_SET: ReportAuditScenarioSet = {
  species: "river_trout",
  species_display_name: "River Trout",
  primary_regions_rationale:
    "Mountain West (MT/WY/CO) is the iconic North American trout fishery. PNW (OR/WA), " +
    "Appalachian, and Northeast freestones/tailwaters are equally respected regional fisheries. " +
    "Mountain Alpine is a secondary for high-altitude calibration.",
  commonly_fished_months_rationale:
    "April-October covers the bulk of dry-fly and streamer action across all regions. Early " +
    "April = cold pre-hatch / streamer; May-June = dominant hatch period; July-August = PMD/" +
    "terrestrial; September-October = BWO + fall streamer; late October = streamer / cold.",
  scenarios: [
    {
      id: "trt-01-mountain-west-river-july-pmd-terrestrial",
      title: "Mountain West river • July • PMD + terrestrial window, stable clear",
      intent:
        "Mid-July on a MT/WY classic trout river (Madison / Bighorn / Green). Water " +
        "clear and cool (low-60s), fish keyed on PMDs morning and hoppers/terrestrials " +
        "afternoon. Stable pressure, partly cloudy, light wind. Guide read: dry-fly + " +
        "nymph rigs dominate; streamers secondary. Subtle-to-moderate presence, slow-to-" +
        "medium pace, upper-to-mid column. Surface OPEN is appropriate.",
      species: "river_trout",
      context: "freshwater_river",
      water_clarity: "clear",
      condition_profile: "stable_high_pressure_clear",
      location: {
        region_key: "mountain_west",
        state_code: "MT",
        latitude: 45.35,
        longitude: -111.3,
        timezone: "America/Denver",
        local_date: "2026-07-16",
        month: 7,
      },
      environment: {
        current_air_temp_f: 74,
        daily_mean_air_temp_f: 66,
        daily_low_air_temp_f: 48,
        daily_high_air_temp_f: 82,
        prior_day_mean_air_temp_f: 65,
        day_minus_2_mean_air_temp_f: 64,
        measured_water_temp_f: 60,
        measured_water_temp_24h_ago_f: 59,
        measured_water_temp_72h_ago_f: 58,
        pressure_mb: 1018,
        pressure_history_mb: pressureTrend(1018, 1018),
        wind_speed_mph: 5,
        cloud_cover_pct: 30,
        precip_24h_in: 0,
        precip_72h_in: 0,
        precip_7d_in: 0.2,
        active_precip_now: false,
        sunrise_local: "2026-07-16T05:51:00-06:00",
        sunset_local: "2026-07-16T21:18:00-06:00",
      },
    },
    {
      id: "trt-02-northeast-river-may-caddis-hatch",
      title: "Northeast river • May • caddis hatch, overcast warm",
      intent:
        "Mid-May on a NY Catskills / PA limestone trout river. Water 55°F, caddis and " +
        "Hendricksons coming off. Overcast, warm, light wind — classic hatch window. " +
        "Guide read: dry-fly and emerger focus (subtle, slow, upper column), nymphs " +
        "for non-risers (subtle, slow, mid-bottom). Surface OPEN is key.",
      species: "river_trout",
      context: "freshwater_river",
      water_clarity: "clear",
      condition_profile: "overcast_windy_warm",
      location: {
        region_key: "northeast",
        state_code: "NY",
        latitude: 41.95,
        longitude: -74.8,
        timezone: "America/New_York",
        local_date: "2026-05-16",
        month: 5,
      },
      environment: {
        current_air_temp_f: 68,
        daily_mean_air_temp_f: 62,
        daily_low_air_temp_f: 50,
        daily_high_air_temp_f: 74,
        prior_day_mean_air_temp_f: 60,
        day_minus_2_mean_air_temp_f: 58,
        measured_water_temp_f: 55,
        measured_water_temp_24h_ago_f: 54,
        measured_water_temp_72h_ago_f: 52,
        pressure_mb: 1014,
        pressure_history_mb: pressureTrend(1014, 1016),
        wind_speed_mph: 6,
        cloud_cover_pct: 80,
        precip_24h_in: 0.05,
        precip_72h_in: 0.2,
        precip_7d_in: 0.7,
        active_precip_now: false,
        sunrise_local: "2026-05-16T05:36:00-04:00",
        sunset_local: "2026-05-16T20:15:00-04:00",
      },
    },
    {
      id: "trt-03-appalachian-river-april-cold-pre-hatch",
      title: "Appalachian river • April • early season cold, low pressure",
      intent:
        "Early April on a WV/VA/NC Appalachian trout river. Water 46°F, cold start to " +
        "the season, pre-main-hatch. Low pressure, overcast, cool. Guide read: nymphing " +
        "and weighted streamers; water too cold for consistent surface. Subtle presence, " +
        "slow pace, bottom-to-mid column. Surface should CLOSE or heavily demote.",
      species: "river_trout",
      context: "freshwater_river",
      water_clarity: "stained",
      condition_profile: "early_season_cold_clear",
      location: {
        region_key: "appalachian",
        state_code: "WV",
        latitude: 38.65,
        longitude: -79.85,
        timezone: "America/New_York",
        local_date: "2026-04-06",
        month: 4,
      },
      environment: {
        current_air_temp_f: 52,
        daily_mean_air_temp_f: 46,
        daily_low_air_temp_f: 36,
        daily_high_air_temp_f: 56,
        prior_day_mean_air_temp_f: 48,
        day_minus_2_mean_air_temp_f: 50,
        measured_water_temp_f: 46,
        measured_water_temp_24h_ago_f: 45,
        measured_water_temp_72h_ago_f: 44,
        pressure_mb: 1006,
        pressure_history_mb: pressureTrend(1006, 1012),
        wind_speed_mph: 7,
        cloud_cover_pct: 90,
        precip_24h_in: 0.15,
        precip_72h_in: 0.5,
        precip_7d_in: 1.1,
        active_precip_now: false,
        sunrise_local: "2026-04-06T07:02:00-04:00",
        sunset_local: "2026-04-06T19:46:00-04:00",
      },
    },
    {
      id: "trt-04-pacific-northwest-river-october-fall-streamer",
      title: "PNW river • October • fall streamer window, stained water",
      intent:
        "Mid-October on an OR/WA trout river (Deschutes-style canyon country). Water " +
        "in the low-50s, stained from fall rain, browns aggressive. Overcast, cool, " +
        "light wind. Guide read: streamer swinging dominates, nymphing as fallback. " +
        "Bold presence, medium pace, mid-column. Surface largely closed (water too " +
        "cool & stained for consistent dries).",
      species: "river_trout",
      context: "freshwater_river",
      water_clarity: "stained",
      condition_profile: "fall_feed_cooling",
      location: {
        region_key: "pacific_northwest",
        state_code: "OR",
        latitude: 44.85,
        longitude: -121.65,
        timezone: "America/Los_Angeles",
        local_date: "2026-10-18",
        month: 10,
      },
      environment: {
        current_air_temp_f: 58,
        daily_mean_air_temp_f: 54,
        daily_low_air_temp_f: 44,
        daily_high_air_temp_f: 62,
        prior_day_mean_air_temp_f: 55,
        day_minus_2_mean_air_temp_f: 56,
        measured_water_temp_f: 51,
        measured_water_temp_24h_ago_f: 52,
        measured_water_temp_72h_ago_f: 54,
        pressure_mb: 1014,
        pressure_history_mb: pressureTrend(1014, 1016),
        wind_speed_mph: 8,
        cloud_cover_pct: 85,
        precip_24h_in: 0.1,
        precip_72h_in: 0.4,
        precip_7d_in: 1.2,
        active_precip_now: false,
        sunrise_local: "2026-10-18T07:31:00-07:00",
        sunset_local: "2026-10-18T18:21:00-07:00",
      },
    },
    {
      id: "trt-05-mountain-west-river-september-bwo-terrestrial",
      title: "Mountain West river • September • BWO + late terrestrial, partly cloudy",
      intent:
        "Mid-September on a MT/WY trout river. Water 58°F, BWOs ripping on overcast " +
        "afternoons, late hoppers still working. Stable pressure trending lower, cool " +
        "morning, partly cloudy. Guide read: mix of dry-dropper, streamer for bigger " +
        "fish in low light, nymph for non-risers. Subtle-moderate presence, slow-medium " +
        "pace, upper-to-mid column. Surface window should OPEN (key fall period).",
      species: "river_trout",
      context: "freshwater_river",
      water_clarity: "clear",
      condition_profile: "fall_feed_cooling",
      location: {
        region_key: "mountain_west",
        state_code: "WY",
        latitude: 44.15,
        longitude: -110.7,
        timezone: "America/Denver",
        local_date: "2026-09-22",
        month: 9,
      },
      environment: {
        current_air_temp_f: 62,
        daily_mean_air_temp_f: 54,
        daily_low_air_temp_f: 38,
        daily_high_air_temp_f: 68,
        prior_day_mean_air_temp_f: 56,
        day_minus_2_mean_air_temp_f: 58,
        measured_water_temp_f: 58,
        measured_water_temp_24h_ago_f: 58,
        measured_water_temp_72h_ago_f: 60,
        pressure_mb: 1014,
        pressure_history_mb: pressureTrend(1014, 1018),
        wind_speed_mph: 6,
        cloud_cover_pct: 55,
        precip_24h_in: 0,
        precip_72h_in: 0.1,
        precip_7d_in: 0.4,
        active_precip_now: false,
        sunrise_local: "2026-09-22T06:48:00-06:00",
        sunset_local: "2026-09-22T19:11:00-06:00",
      },
    },
  ],
};
