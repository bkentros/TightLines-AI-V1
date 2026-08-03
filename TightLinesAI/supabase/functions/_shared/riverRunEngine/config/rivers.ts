import type { RiverProfile } from "../types.ts";

export const PERE_MARQUETTE_RIVER_PROFILE: RiverProfile = {
  riverId: "pere_marquette",
  displayName: "Pere Marquette River",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  mouthLat: 43.9547,
  mouthLon: -86.4526,
  hydraulicSources: [
    {
      sourceId: "pm_scottville_usgs",
      provider: "USGS",
      siteId: "04122500",
      name: "Pere Marquette River at Scottville, MI",
      role: "primary",
      primaryMetric: "flow_cfs",
      availableMetrics: ["flow_cfs", "gage_height_ft"],
      historyYearsAvailable: 86,
      maxAgeHours: 6,
      reachQuality: "good",
      reachNotes:
        "Official lower-mainstem USGS gauge. Discharge is the sole scored hydraulic metric; gage height is context only.",
    },
  ],
  waterTemperatureSources: [
    {
      sourceId: "pm_maple_leaf_temperature",
      provider: "MONITOR_MY_WATERSHED",
      siteId: "Maple Leaf",
      seriesId: "4939",
      name: "Pere Marquette River at Maple Leaf",
      role: "primary",
      priority: 1,
      sourceType: "nearby_gauge",
      maxAgeHours: 2,
      smoothingWindowHours: 3,
      minValidF: 30,
      maxValidF: 85,
      maxRateChangeFPerHour: 3,
      maxPeerDifferenceF: 5,
      reachNotes:
        "Furthest-downstream audited PMTU water-temperature station, upstream of Scottville. Used as the primary measured-water signal.",
      attribution:
        "Pere Marquette Trout Unlimited via Monitor My Watershed, CC BY-SA 4.0.",
    },
    {
      sourceId: "pm_bowman_temperature",
      provider: "MONITOR_MY_WATERSHED",
      siteId: "PMTU60-1",
      seriesId: "3209",
      name: "Pere Marquette River at Bowman Bridge / 60th Street",
      role: "fallback",
      priority: 2,
      sourceType: "nearby_gauge",
      maxAgeHours: 2,
      smoothingWindowHours: 3,
      minValidF: 30,
      maxValidF: 85,
      maxRateChangeFPerHour: 3,
      maxPeerDifferenceF: 5,
      reachNotes:
        "Audited upstream measured-water fallback. It must not silently claim lower-river temperature.",
      attribution:
        "Pere Marquette Trout Unlimited via Monitor My Watershed, CC BY-SA 4.0.",
    },
    {
      sourceId: "pm_m37_temperature",
      provider: "MONITOR_MY_WATERSHED",
      siteId: "PMTU37-1",
      seriesId: "3201",
      name: "Pere Marquette River at M-37",
      role: "validation",
      priority: 3,
      sourceType: "nearby_gauge",
      maxAgeHours: 2,
      smoothingWindowHours: 3,
      minValidF: 30,
      maxValidF: 85,
      maxRateChangeFPerHour: 3,
      maxPeerDifferenceF: 5,
      reachNotes:
        "Upper-mainstem validation and final fallback source. The sensor was repositioned in 2023; water depth is not used.",
      attribution:
        "Pere Marquette Trout Unlimited via Monitor My Watershed, CC BY-SA 4.0.",
    },
  ],
  weatherPoints: [
    {
      weatherPointId: "pm_baldwin_watershed_weather",
      lat: 43.8619566,
      lon: -85.8814513,
      role: "primary",
    },
  ],
  conditionRefreshSchedule: {
    activeSlots: [
      "00:00",
      "04:00",
      "08:00",
      "12:00",
      "16:00",
      "20:00",
    ],
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "PM condition evidence refreshes every four hours from the configured staging start through the historical-presence tail so Fishability remains current anywhere the feature still describes a seasonal opportunity. Push still starts and stops on its separate main-run window. The protected server job runs 17 minutes after the hour so the newest USGS and PMTU transmissions have time to arrive. Outside that seasonal window, the river refreshes once daily.",
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Based on the USGS gauge at Scottville. Conditions can vary by reach.",
};

export const RIVER_RUN_RIVER_PROFILES: RiverProfile[] = [
  PERE_MARQUETTE_RIVER_PROFILE,
];
