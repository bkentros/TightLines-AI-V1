import type { RiverProfile } from "../types.ts";

export const PERE_MARQUETTE_RIVER_PROFILE: RiverProfile = {
  riverId: "pere_marquette",
  displayName: "Pere Marquette River",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  mouthLat: 43.9547,
  mouthLon: -86.4526,
  weatherLat: 43.9547,
  weatherLon: -86.4526,
  gauge: {
    provider: "USGS",
    siteId: "04122500",
    name: "Pere Marquette River at Scottville, MI",
    primaryMetric: "flow_cfs",
    secondaryMetric: "gage_height_ft",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 2,
    maxAgeHours: 6,
    reachQuality: "good",
    reachNotes:
      "Launch fixture uses the official Scottville gauge as the selected public-condition basis for the configured run.",
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Based on the USGS gauge at Scottville. Conditions can vary by reach.",
};

export const RIVER_RUN_RIVER_PROFILES: RiverProfile[] = [
  PERE_MARQUETTE_RIVER_PROFILE,
];
