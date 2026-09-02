import type {
  ActivityRules,
  AuditedRiverRunProfile,
  FishabilityBands,
  HistoricalPresenceConfig,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";
import { getMovementEngineDefinition } from "../movementEngines.ts";
import {
  GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
  GREAT_LAKES_COHO_BIOLOGY_PROFILE,
  GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE,
  GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
  PACIFIC_FALL_CHINOOK_BIOLOGY_PROFILE,
  PACIFIC_FALL_COHO_BIOLOGY_PROFILE,
} from "../speciesBiology.ts";
import { MANITOWOC_HISTORICAL_WATER_TEMPERATURE_NORMALS } from "./manitowocHistoricalTemperature.generated.ts";
import { OSWEGO_HISTORICAL_WATER_TEMPERATURE_NORMALS } from "./oswegoHistoricalTemperature.generated.ts";

const ACTIVE_SLOTS = [
  "00:00",
  "04:00",
  "08:00",
  "12:00",
  "16:00",
  "20:00",
  "21:00",
];
const OR_RULES =
  "Clackamas River salmon rules vary by reach and can change in season. Check current Oregon regulations and updates, posted PGE facility boundaries, licenses, access, and local safety conditions before fishing.";
const WI_RULES =
  "From Sept. 15 through the first Saturday in May, Lake Michigan tributary night-fishing restrictions apply. Check current Wisconsin rules, licenses, posted property boundaries, access, and local safety conditions before fishing.";
const NY_RULES =
  "Special Lake Ontario tributary rules apply from the Utica Street bridge to Varick Dam, including seasonal night and tackle restrictions. Check current New York regulations and emergency changes, posted hydropower boundaries, access, and local safety conditions before fishing.";

export const CLACKAMAS_RIVER_PROFILE: RiverProfile = {
  riverId: "clackamas",
  displayName: "Clackamas River",
  state: "OR",
  region: "pacific_northwest",
  timezone: "America/Los_Angeles",
  mouthLat: 45.376,
  mouthLon: -122.604,
  hydraulicSources: [{
    sourceId: "clackamas_oregon_city_usgs",
    provider: "USGS",
    siteId: "14211010",
    name: "Clackamas River near Oregon City, OR",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 25,
    maxAgeHours: 2,
    reachQuality: "good",
    reachNotes:
      "Measured in the lower river near Oregon City. It does not directly represent the regulated middle corridor, Estacada, or the North Fork sorting facility.",
  }],
  waterTemperatureSources: [{
    sourceId: "clackamas_oregon_city_temperature",
    provider: "USGS",
    siteId: "14211010",
    name: "Clackamas River near Oregon City — measured water temperature",
    role: "primary",
    priority: 1,
    sourceType: "same_gauge",
    maxAgeHours: 2,
    smoothingWindowHours: 3,
    minValidF: 32,
    maxValidF: 86,
    maxRateChangeFPerHour: 4,
    maxPeerDifferenceF: 6,
    historicalStartYear: 2002,
    historicalEndYear: 2026,
    reachNotes:
      "Co-located lower-river measurement; it is not the temperature at River Mill, Estacada, or North Fork.",
    attribution:
      "U.S. Geological Survey Water Data for the Nation; recent readings are provisional and subject to revision.",
  }],
  weatherPoints: [{
    weatherPointId: "clackamas_oregon_city_weather",
    lat: 45.377,
    lon: -122.575,
    role: "primary",
  }],
  foundation: {
    version: "clackamas-foundation-v2-owner-review",
    corridorLengthMiles: 30,
    downstreamTerminus: "Clackamas River mouth at the Willamette River",
    upstreamTerminus: "North Fork adult sorting facility corridor",
    targetSpecies: ["chinook_salmon", "coho_salmon"],
    reaches: [
      {
        reachId: "clackamas_lower_river",
        displayName: "Lower River — mouth to Carver",
        order: 1,
        role: "downstream",
        gaugeRepresented: true,
        notes:
          "Entry and lower-river water represented most directly by USGS 14211010.",
        sourceNotes:
          "USGS station metadata and Oregon DFW Clackamas access guide.",
      },
      {
        reachId: "clackamas_middle_river",
        displayName: "Middle River — Carver to River Mill Dam",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "Public park corridor below River Mill. Fall Chinook product geography stops at River Mill Dam.",
        sourceNotes: "Oregon DFW access guide and PGE fish-passage material.",
      },
      {
        reachId: "clackamas_coho_corridor",
        displayName: "Coho Corridor — River Mill to North Fork",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Early-run coho may pass River Mill toward North Fork; this reach is not included for fall Chinook.",
        sourceNotes: "PGE Clackamas fish-run and fish-passage pages.",
      },
    ],
    primaryGaugeReachId: "clackamas_lower_river",
    contextualGaugeSiteIds: [],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "clackamas_oregon_city_weather",
      basinRepresentation:
        "Modeled weather near Oregon City supports lower-river context only.",
      sourceNotes: "Open-Meteo point paired to USGS 14211010.",
    },
    stateRegulations: [{
      state: "OR",
      version: "oregon-2026-regulations",
      jurisdiction: "Oregon DFW Willamette Zone and in-season updates",
      reminderCopy: OR_RULES,
      accessAndSafetyNotes:
        "Named parks do not make adjoining frontage public. Obey posted PGE boundaries and do not infer safe wading from a fishability read.",
      sourceNotes:
        "Oregon DFW current regulations and updates; recheck at release.",
    }],
    evidenceNotes:
      "PGE documents a wild fall Chinook run below River Mill and a distinct early coho run that can continue above North Fork. Late coho, summer/winter steelhead, and resident trout were not merged into unsupported fall products.",
  },
  conditionRefreshSchedule: {
    activeSlots: ACTIVE_SLOTS,
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "Flow, height, and measured temperature resolve independently at USGS 14211010; invalid or stale metrics fail closed.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Measured near Oregon City in the lower river, not at River Mill, Estacada, or North Fork. PGE operations influence the corridor; the gauge is not fish passage, abundance, access, or safety evidence.",
  regulationReminderCopy: OR_RULES,
};

export const MANITOWOC_RIVER_PROFILE: RiverProfile = {
  riverId: "manitowoc",
  displayName: "Manitowoc River",
  state: "WI",
  region: "great_lakes",
  timezone: "America/Chicago",
  mouthLat: 44.092,
  mouthLon: -87.655,
  hydraulicSources: [{
    sourceId: "manitowoc_michigan_ave_usgs",
    provider: "USGS",
    siteId: "04085427",
    name: "Manitowoc River at Michigan Avenue, WI",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 53,
    maxAgeHours: 2,
    reachQuality: "good",
    reachNotes:
      "Measured 6.6 miles above the mouth in the lower/middle mainstem. It does not represent the harbor, Branch River, or the far upper corridor near Clarks Mills.",
  }],
  waterTemperatureSources: [],
  historicalWaterTemperatureSource: {
    sourceId: "manitowoc_michigan_ave_historical_temperature",
    provider: "USGS",
    siteId: "04085427",
    name: "Manitowoc River at Michigan Avenue — discontinued historical sensor",
    historicalStartYear: 2011,
    historicalEndYear: 2022,
    windowRadiusDays: 3,
    baselineVersion:
      "manitowoc-michigan-ave-approved-calendar-window-temperature-2011-2022-v1",
    reachNotes:
      "Historical-only lower/middle-mainstem context from the discontinued Michigan Avenue sensor. It is never today's temperature, a live trend, or a substitute for the harbor or upper corridor.",
    attribution:
      "U.S. Geological Survey approved daily-mean water temperature; values are pooled within the selected calendar date ±3 days, invalid values are excluded, and each displayed normal requires at least two qualifying years.",
    normals: MANITOWOC_HISTORICAL_WATER_TEMPERATURE_NORMALS,
  },
  weatherPoints: [{
    weatherPointId: "manitowoc_michigan_ave_weather",
    lat: 44.105,
    lon: -87.701,
    role: "primary",
  }],
  foundation: {
    version: "manitowoc-foundation-v2-owner-review",
    corridorLengthMiles: 19,
    downstreamTerminus: "Manitowoc River mouth at Lake Michigan",
    upstreamTerminus: "Clarks Mills first-barrier corridor",
    targetSpecies: ["chinook_salmon", "coho_salmon", "lake_run_brown_trout"],
    reaches: [
      {
        reachId: "manitowoc_lower_river",
        displayName: "Lower River — mouth to Michigan Avenue",
        order: 1,
        role: "downstream",
        gaugeRepresented: false,
        notes:
          "Urban entry corridor with audited Schuette and Manitou park access.",
        sourceNotes:
          "Wisconsin DNR tributary access map and City of Manitowoc park records.",
      },
      {
        reachId: "manitowoc_middle_river",
        displayName: "Middle River — Michigan Avenue to Manitowoc Rapids",
        order: 2,
        role: "middle",
        gaugeRepresented: true,
        notes:
          "Includes the gauge and county public bank access west of County R. The former Manitowoc Rapids dam has been removed.",
        sourceNotes: "USGS 04085427 metadata and Manitowoc County access page.",
      },
      {
        reachId: "manitowoc_upper_corridor",
        displayName: "Upper Corridor — Manitowoc Rapids to Clarks Mills",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Supported migration corridor to the first barrier. Lower Cato Falls is the only independently verified public access retained here and is explicitly seasonal through October 31.",
        sourceNotes:
          "Wisconsin DNR Lake Michigan drainage barrier map and Manitowoc County Lower Cato Falls records.",
      },
    ],
    primaryGaugeReachId: "manitowoc_middle_river",
    contextualGaugeSiteIds: [],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "manitowoc_michigan_ave_weather",
      basinRepresentation:
        "Modeled weather at Michigan Avenue is broad lower/middle context only.",
      sourceNotes: "Open-Meteo point paired to USGS 04085427.",
    },
    stateRegulations: [{
      state: "WI",
      version: "wisconsin-2026-2027-fishing-regulations",
      jurisdiction: "Wisconsin DNR Lake Michigan tributary regulations",
      reminderCopy: WI_RULES,
      accessAndSafetyNotes:
        "The DNR overview map is not a property survey. Use only individually verified public access and obey seasonal hours and posted boundaries.",
      sourceNotes:
        "Wisconsin DNR current regulations and access material; recheck at release.",
    }],
    evidenceNotes:
      "Recurring direct stocking and Wisconsin DNR species evidence support Chinook, coho, and lake-run brown trout. No river-specific Skamania return was established, so steelhead is deferred.",
  },
  conditionRefreshSchedule: {
    activeSlots: ACTIVE_SLOTS,
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "Flow and height are live. The temperature series ended in 2022 and is excluded from live Gauge Read and Activity.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: {
      status: "unavailable",
      notes:
        "USGS 04085427 water temperature stopped updating in November 2022; no accepted live replacement was found.",
    },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Measured at Michigan Avenue 6.6 miles above the mouth. It does not represent the harbor or far upper corridor, and the discontinued temperature series is never treated as current.",
  regulationReminderCopy: WI_RULES,
};

export const OSWEGO_RIVER_PROFILE: RiverProfile = {
  riverId: "oswego",
  displayName: "Oswego River",
  state: "NY",
  region: "great_lakes",
  timezone: "America/New_York",
  mouthLat: 43.465,
  mouthLon: -76.514,
  hydraulicSources: [{
    sourceId: "oswego_lock_7_usgs",
    provider: "USGS",
    siteId: "04249000",
    name: "Oswego River at Lock 7, Oswego, NY",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 93,
    maxAgeHours: 2,
    reachQuality: "acceptable",
    reachNotes:
      "Measured 0.8 mile above the mouth. Published discharge excludes Oswego Canal flow and can be affected by power operations; Lake Ontario backwater can affect stage.",
  }],
  waterTemperatureSources: [],
  historicalWaterTemperatureSource: {
    sourceId: "oswego_lock_7_historical_temperature",
    provider: "USGS",
    siteId: "04249000",
    name: "Oswego River at Lock 7 — discontinued historical sensor",
    historicalStartYear: 2010,
    historicalEndYear: 2024,
    windowRadiusDays: 3,
    baselineVersion:
      "oswego-lock-7-approved-calendar-window-temperature-2010-2024-v1",
    reachNotes:
      "Historical-only Lock 7 lower-corridor context from the discontinued sensor. It is never today's temperature, a live trend, or a substitute for conditions at Varick Dam.",
    attribution:
      "U.S. Geological Survey approved daily-mean water temperature; values are pooled within the selected calendar date ±3 days, invalid sentinels are excluded, and each displayed normal requires at least two qualifying years.",
    normals: OSWEGO_HISTORICAL_WATER_TEMPERATURE_NORMALS,
  },
  weatherPoints: [{
    weatherPointId: "oswego_lock_7_weather",
    lat: 43.451,
    lon: -76.506,
    role: "primary",
  }],
  foundation: {
    version: "oswego-foundation-v2-owner-review",
    corridorLengthMiles: 1.2,
    downstreamTerminus: "Oswego Harbor mouth at Lake Ontario",
    upstreamTerminus: "Downstream face of Varick Street Dam",
    targetSpecies: [
      "chinook_salmon",
      "coho_salmon",
      "steelhead",
      "lake_run_brown_trout",
    ],
    reaches: [
      {
        reachId: "oswego_lower_harbor",
        displayName: "Lower Harbor — lake mouth to Utica Street",
        order: 1,
        role: "downstream",
        gaugeRepresented: true,
        notes: "Lake-entry and lower-river corridor near the Lock 7 gauge.",
        sourceNotes:
          "New York DEC Oswego River page and USGS 04249000 metadata.",
      },
      {
        reachId: "oswego_terminal_tailwater",
        displayName: "Terminal Tailwater — Utica Street to Varick Dam",
        order: 2,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Short terminal migratory corridor below the impassable dam; special seasonal rules and hydropower safety controls apply.",
        sourceNotes:
          "New York DEC Oswego River and Great Lakes tributary regulation pages.",
      },
    ],
    primaryGaugeReachId: "oswego_lower_harbor",
    contextualGaugeSiteIds: [],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "oswego_lock_7_weather",
      basinRepresentation:
        "Modeled weather at Lock 7 supports only the short lower corridor.",
      sourceNotes: "Open-Meteo point paired to USGS 04249000.",
    },
    stateRegulations: [{
      state: "NY",
      version: "new-york-2026-great-lakes-tributaries",
      jurisdiction: "New York DEC Lake Ontario tributary regulations",
      reminderCopy: NY_RULES,
      accessAndSafetyNotes:
        "A personal flotation device is mandatory in the posted area below the dam. Leto Island does not provide dam access; obey Brookfield barriers and rapidly changing flows.",
      sourceNotes:
        "New York DEC current Oswego River and Great Lakes tributary pages; recheck at release.",
    }],
    evidenceNotes:
      "DEC identifies all four supported species and an impassable endpoint at Varick Dam. The modeled corridor intentionally excludes the upstream 23-mile navigation system.",
  },
  conditionRefreshSchedule: {
    activeSlots: ACTIVE_SLOTS,
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "Flow and height resolve independently. Invalid temperature sentinels and the discontinued 2024 series are excluded.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: {
      status: "unavailable",
      notes:
        "The USGS temperature record ended in 2024 and current responses are invalid sentinels; no accepted live replacement was found.",
    },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Lock 7 discharge excludes Oswego Canal flow and can fluctuate with upstream power operations; stage can reflect Lake Ontario backwater. The read is lower-corridor presentation context, never total river flow, fish passage, access, or safety.",
  regulationReminderCopy: NY_RULES,
};

const capabilities: AuditedRiverRunProfile["primitiveCapabilities"] = {
  migrationStage: { status: "available" },
  activity: { status: "available" },
  fishInRiver: { status: "available" },
  fishability: { status: "available" },
  migrationTiming: {
    status: "unavailable",
    reason: "no_accepted_historical_baseline",
    notes: "No independent observed Migration Timing model passed this audit.",
  },
  push: {
    status: "unavailable",
    reason: "no_accepted_historical_baseline",
    notes: "Hydraulic context is not presented as confirmed fish movement.",
  },
};
const fishability = (
  version: string,
  label: string,
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  notes: string,
): FishabilityBands => ({
  version,
  metric: "flow_cfs",
  sourceLabel: label,
  tooLow: { max: a },
  lowFishable: { min: a, max: b },
  ideal: { min: b, max: c },
  highFishable: { min: c, max: d },
  blownOut: { min: e },
  caps: {
    staleGauge: 55,
    unknownTrend: 49,
    veryLow: 45,
    blownOut: 24,
    sharpRiseHigh: 40,
  },
  evidenceNotes: notes,
  sourceNotes:
    "USGS approved daily mean discharge, fixed Aug. 1-Jan. 15 windows in 2012-2025; boundaries use p10/p25/p75/p90/p95.",
});
const clackFish = fishability(
  "clackamas-lower-fishability-v1",
  "Oregon City lower reach",
  772,
  886,
  3290,
  5870,
  8580,
  "Lower-river presentation shape only; regulated operations and reach differences limit transfer upstream.",
);
const manFish = fishability(
  "manitowoc-michigan-ave-fishability-v1",
  "Michigan Avenue lower/middle reach",
  39,
  66.3,
  279,
  693,
  1140,
  "Lower/middle presentation shape only; not harbor or upper-corridor conditions.",
);
const oswegoFish = fishability(
  "oswego-lock-7-fishability-v1",
  "Lock 7 lower corridor",
  1090,
  1880,
  10000,
  13100,
  15100,
  "Limited lower-corridor shape only. Canal exclusion, power operations, and backwater prevent total-river or safety interpretation.",
);
const baseline = (id: string, years: number, notes: string) => ({
  metric: "flow_cfs" as const,
  version: `${id}-fall-2012-2025-v1`,
  hasPercentileBaselines: true,
  coveredWindowPercent: 1,
  minimumHistoryYears: years,
  sourceNotes: notes,
});
const presence = (
  maximum: HistoricalPresenceConfig["maximum"],
  version: string,
  anchors: HistoricalPresenceConfig["anchors"],
  notes: string,
  sources: string,
): HistoricalPresenceConfig => ({
  maximum,
  distributionScope: "sectional",
  curveVersion: version,
  anchors,
  evidenceNotes: notes,
  sourceNotes: sources,
});
const salmonAnchors: HistoricalPresenceConfig["anchors"] = [
  { dayOffsetFromStart: 0, fractionOfMaximum: .06 },
  { dayOffsetFromStart: 14, fractionOfMaximum: .25 },
  { dayOffsetFromStart: 30, fractionOfMaximum: .62 },
  { dayOffsetFromStart: 45, fractionOfMaximum: 1 },
  { dayOffsetFromStart: 60, fractionOfMaximum: .72 },
  { dayOffsetFromStart: 75, fractionOfMaximum: .28 },
  { dayOffsetFromStart: 90, fractionOfMaximum: 0 },
];
const livingAnchors: HistoricalPresenceConfig["anchors"] = [
  { dayOffsetFromStart: 0, fractionOfMaximum: .08 },
  { dayOffsetFromStart: 15, fractionOfMaximum: .3 },
  { dayOffsetFromStart: 35, fractionOfMaximum: .72 },
  { dayOffsetFromStart: 55, fractionOfMaximum: 1 },
  { dayOffsetFromStart: 75, fractionOfMaximum: .82 },
  { dayOffsetFromStart: 95, fractionOfMaximum: .45 },
  { dayOffsetFromStart: 115, fractionOfMaximum: .15 },
];

function observed(
  input: {
    version: string;
    profile: ActivityRules["profile"];
    reachIds: string[];
    hydraulicId: string;
    temperatureIds?: string[];
    weatherId: string;
    hydraulic: [number, number, number, number, number, number];
    lifecycle?: NonNullable<ActivityRules["caps"]["lifecycleRamp"]>;
    scope: string;
    full?: boolean;
  },
): ActivityRules {
  const [a1, p1, a2, p2, a3, p3] = input.hydraulic;
  return {
    version: input.version,
    profile: input.profile,
    dataMode: "observed_river",
    minimumInputContract: "weather_and_one_measured_river_input",
    confidenceCeiling: input.full ? undefined : "Limited",
    inputReach: {
      reachIds: input.reachIds,
      hydraulicSourceIds: [input.hydraulicId],
      waterTemperatureSourceIds: input.temperatureIds ?? [],
      weatherPointIds: [input.weatherId],
      notes: input.scope,
    },
    scopeCopy: input.scope,
    weights: input.full
      ? { light: .25, waterTemperature: .35, riverBehavior: .30, weather: .10 }
      : { light: .30, waterTemperature: 0, riverBehavior: .60, weather: .10 },
    temperature: input.profile === "coho_fall_reaction"
      ? {
        coldF: 40,
        preferredMinF: 45,
        preferredMaxF: 60,
        warmF: 64,
        barrierF: 68,
      }
      : input.profile === "brown_trout_fall_reaction" ||
          input.profile === "steelhead_feeding"
      ? {
        coldF: 36,
        preferredMinF: 42,
        preferredMaxF: 58,
        warmF: 64,
        barrierF: 68,
      }
      : {
        coldF: 43,
        preferredMinF: 48,
        preferredMaxF: 62,
        warmF: 68,
        barrierF: 72,
      },
    hydraulicTrend: {
      rising24h: { absolute: a1, percent: p1 },
      meaningfulRise24h: { absolute: a2, percent: p2 },
      sharpRise24h: { absolute: a3, percent: p3 },
    },
    caps: {
      noMeasuredRiverData: 60,
      noWaterTemperature: input.full ? 60 : 100,
      lateRun: input.profile === "chinook_fall_reaction" ||
          input.profile === "coho_fall_reaction"
        ? 75
        : 100,
      ending: input.profile === "chinook_fall_reaction" ||
          input.profile === "coho_fall_reaction"
        ? 42
        : 100,
      taperingPenalty: input.profile === "chinook_fall_reaction" ||
          input.profile === "coho_fall_reaction"
        ? 15
        : undefined,
      lifecycleRamp: input.lifecycle,
    },
    evidenceNotes: `Observed ${
      input.full ? "flow-and-temperature" : "hydraulic-only"
    } candidate calibrated from approved fixed-window USGS records. ${
      input.full
        ? "Measured temperature participates in scoring."
        : "Water temperature has zero weight and no temperature-shaped cap can raise or lower the score."
    }`,
  };
}
const shared = (
  riverId: string,
  fishabilityBands: FishabilityBands,
  baselineCoverage: AuditedRiverRunProfile["baselineCoverage"],
) => ({
  riverId,
  season: "fall" as const,
  runStageCopyStrategy: "onboarding_corridor" as const,
  primitiveCapabilities: capabilities,
  fishabilityBands,
  baselineCoverage,
  publicAudit: {
    isEnabled: false,
    auditVersion: `${riverId}-owner-review-ready-v2`,
    notes:
      "Hidden owner-review candidate only; no public release is authorized.",
  },
});
const clackShared = shared(
  "clackamas",
  clackFish,
  baseline(
    "clackamas-oregon-city",
    14,
    "2,337 approved daily means; p10 772, p25 886, median 1,310, p75 3,290, p90 5,870, p95 8,580 CFS.",
  ),
);
const manShared = shared(
  "manitowoc",
  manFish,
  baseline(
    "manitowoc-michigan-ave",
    14,
    "2,337 approved daily means; p10 39, p25 66.3, median 142, p75 279, p90 693, p95 1,140 CFS.",
  ),
);
const oswegoShared = shared(
  "oswego",
  oswegoFish,
  baseline(
    "oswego-lock-7",
    14,
    "2,337 approved daily means; p10 1,090, p25 1,880, median 4,840, p75 10,000, p90 13,100, p95 15,100 CFS.",
  ),
);

export const CLACKAMAS_FALL_CHINOOK: AuditedRiverRunProfile = {
  ...clackShared,
  runId: "clackamas_fall_chinook",
  biologyProfileId: "pacific_fall_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  seasonalZoneReachIds: ["clackamas_lower_river", "clackamas_middle_river"],
  runWindow: {
    preRunStart: "08-10",
    stagingStart: "08-25",
    start: "09-05",
    beginningEnd: "09-15",
    buildingEstablishedStart: "09-16",
    buildingBroadStart: "09-22",
    peakStart: "09-25",
    peak: "10-05",
    peakEnd: "10-15",
    taperingEnd: "10-25",
    end: "11-02",
    lateEnd: "11-10",
    postRunLateCopyEnd: "11-20",
  },
  historicalPresence: presence(
    7,
    "clackamas-fall-chinook-presence-v1",
    salmonAnchors,
    "A conservative sectional 7/10 ceiling reflects PGE's recurring wild fall run below River Mill without a qualifying whole-river count.",
    "PGE Clackamas fish-runs and recreation pages.",
  ),
  activity: observed({
    version: "clackamas-chinook-observed-activity-v1",
    profile: "chinook_fall_reaction",
    reachIds: ["clackamas_lower_river"],
    hydraulicId: "clackamas_oregon_city_usgs",
    temperatureIds: ["clackamas_oregon_city_temperature"],
    weatherId: "clackamas_oregon_city_weather",
    hydraulic: [82, 6.5, 550, 23.1, 1850, 65.1],
    lifecycle: { peakEnd: "10-15", taperingEnd: "10-25", endingEnd: "11-10" },
    full: true,
    scope:
      "Measured Oregon City flow and temperature support the lower reach only; River Mill is the species endpoint. This is conditional responsiveness, not movement or abundance.",
  }),
  waterTemperature: {
    sourcePriority: ["clackamas_oregon_city_temperature"],
    upstreamFallbackPositiveSignalCap: 0,
    notes:
      "Only the co-located lower-river sensor is eligible; no upstream fallback is inferred.",
  },
  researchNotes:
    "Wild fall Chinook documented below River Mill; North Fork counts are not used because the run endpoint is downstream.",
  sourceNotes: "docs/onboarding/river-run/clackamas/river-onboarding.md",
};
export const CLACKAMAS_FALL_COHO: AuditedRiverRunProfile = {
  ...clackShared,
  runId: "clackamas_fall_coho",
  biologyProfileId: "pacific_fall_coho_v1",
  displayName: "Early Fall Coho",
  species: "coho_salmon",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  seasonalZoneReachIds: [
    "clackamas_lower_river",
    "clackamas_middle_river",
    "clackamas_coho_corridor",
  ],
  runWindow: {
    preRunStart: "08-20",
    stagingStart: "09-01",
    start: "09-10",
    beginningEnd: "09-20",
    buildingEstablishedStart: "09-21",
    buildingBroadStart: "10-01",
    peakStart: "10-05",
    peak: "10-15",
    peakEnd: "10-25",
    taperingEnd: "11-05",
    end: "11-15",
    lateEnd: "11-25",
    postRunLateCopyEnd: "12-05",
  },
  historicalPresence: presence(
    7,
    "clackamas-early-coho-presence-v1",
    salmonAnchors,
    "A conservative sectional 7/10 ceiling reflects PGE's recurring early wild coho component; facility passage is not whole-river abundance.",
    "PGE Clackamas fish-runs, fish-count, and recreation pages.",
  ),
  activity: observed({
    version: "clackamas-coho-observed-activity-v1",
    profile: "coho_fall_reaction",
    reachIds: ["clackamas_lower_river"],
    hydraulicId: "clackamas_oregon_city_usgs",
    temperatureIds: ["clackamas_oregon_city_temperature"],
    weatherId: "clackamas_oregon_city_weather",
    hydraulic: [82, 6.5, 550, 23.1, 1850, 65.1],
    lifecycle: { peakEnd: "10-25", taperingEnd: "11-05", endingEnd: "11-25" },
    full: true,
    scope:
      "Measured Oregon City flow and temperature support the lower reach only. Early coho may continue toward North Fork; this model does not infer passage or abundance.",
  }),
  waterTemperature: {
    sourcePriority: ["clackamas_oregon_city_temperature"],
    upstreamFallbackPositiveSignalCap: 0,
    notes:
      "Only the co-located lower-river sensor is eligible; no upstream fallback is inferred.",
  },
  researchNotes:
    "Only PGE's early coho component is modeled. The distinct November-January late run is explicitly excluded.",
  sourceNotes: "docs/onboarding/river-run/clackamas/river-onboarding.md",
};

const manActivity = (
  version: string,
  profile: ActivityRules["profile"],
  lifecycle?: NonNullable<ActivityRules["caps"]["lifecycleRamp"]>,
) =>
  observed({
    version,
    profile,
    reachIds: ["manitowoc_lower_river", "manitowoc_middle_river"],
    hydraulicId: "manitowoc_michigan_ave_usgs",
    weatherId: "manitowoc_michigan_ave_weather",
    hydraulic: [11, 8.9, 37, 21.3, 99, 48.2],
    lifecycle,
    scope:
      "Hydraulic-only read for the lower/middle mainstem. Temperature is unavailable and has zero influence; the gauge does not represent the harbor or upper corridor.",
  });
export const MANITOWOC_FALL_CHINOOK: AuditedRiverRunProfile = {
  ...manShared,
  runId: "manitowoc_fall_chinook",
  biologyProfileId: "great_lakes_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "08-25",
    start: "09-05",
    beginningEnd: "09-18",
    buildingEstablishedStart: "09-19",
    buildingBroadStart: "09-28",
    peakStart: "10-01",
    peak: "10-10",
    peakEnd: "10-20",
    taperingEnd: "11-01",
    end: "11-10",
    lateEnd: "11-18",
    postRunLateCopyEnd: "11-28",
  },
  historicalPresence: presence(
    7,
    "manitowoc-chinook-presence-v1",
    salmonAnchors,
    "Recurring direct river stocking supports a conservative 7/10 sectional ceiling without an adult count feed.",
    "Wisconsin DNR Lake Michigan stocking summaries and Chinook material.",
  ),
  activity: manActivity(
    "manitowoc-chinook-hydraulic-activity-v2",
    "chinook_fall_reaction",
    { peakEnd: "10-20", taperingEnd: "11-01", endingEnd: "11-18" },
  ),
  researchNotes:
    "Direct recurring stocking and tributary biology support the run; no facility count is configured.",
  sourceNotes: "docs/onboarding/river-run/manitowoc/river-onboarding.md",
};
export const MANITOWOC_FALL_COHO: AuditedRiverRunProfile = {
  ...manShared,
  runId: "manitowoc_fall_coho",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "08-25",
    stagingStart: "09-05",
    start: "09-15",
    beginningEnd: "09-28",
    buildingEstablishedStart: "09-29",
    buildingBroadStart: "10-08",
    peakStart: "10-12",
    peak: "10-25",
    peakEnd: "11-05",
    taperingEnd: "11-20",
    end: "12-01",
    lateEnd: "12-12",
    postRunLateCopyEnd: "12-22",
  },
  historicalPresence: presence(
    7,
    "manitowoc-coho-presence-v1",
    salmonAnchors,
    "Recurring fingerling, yearling, and cooperative-pond releases support a conservative 7/10 sectional ceiling.",
    "Wisconsin DNR stocking summaries, coho profile, and City of Manitowoc release notice.",
  ),
  activity: manActivity(
    "manitowoc-coho-hydraulic-activity-v2",
    "coho_fall_reaction",
    { peakEnd: "11-05", taperingEnd: "11-20", endingEnd: "12-12" },
  ),
  researchNotes:
    "Independently timed coho product; stocking is evidence of recurring presence, not adult abundance.",
  sourceNotes: "docs/onboarding/river-run/manitowoc/river-onboarding.md",
};
export const MANITOWOC_FALL_BROWN: AuditedRiverRunProfile = {
  ...manShared,
  runId: "manitowoc_fall_brown_trout",
  biologyProfileId: "great_lakes_lake_run_brown_trout_v1",
  displayName: "Fall Lake-run Brown Trout",
  species: "lake_run_brown_trout",
  runType: "fall_repeat_spawn",
  movementEngineId: "fall_repeat_spawner_cooling",
  runWindow: {
    preRunStart: "09-10",
    stagingStart: "09-25",
    start: "10-01",
    beginningEnd: "10-15",
    buildingEstablishedStart: "10-16",
    buildingBroadStart: "10-28",
    peakStart: "11-01",
    peak: "11-20",
    peakEnd: "12-05",
    taperingEnd: "12-20",
    end: "12-31",
    lateEnd: "01-15",
    postRunLateCopyEnd: "01-31",
  },
  historicalPresence: presence(
    6,
    "manitowoc-brown-presence-v1",
    livingAnchors,
    "Recurring Seeforellen stocking and tributary spawning behavior support a conservative 6/10 sectional ceiling.",
    "Wisconsin DNR stocking summary and Lake Michigan brown-trout guidance.",
  ),
  activity: manActivity(
    "manitowoc-brown-hydraulic-activity-v2",
    "brown_trout_fall_reaction",
  ),
  researchNotes:
    "Repeat-spawner semantics are retained. Lower Cato Falls is shown only with its explicit October 31 seasonal closure warning.",
  sourceNotes: "docs/onboarding/river-run/manitowoc/river-onboarding.md",
};

const oswegoActivity = (
  version: string,
  profile: ActivityRules["profile"],
  lifecycle?: NonNullable<ActivityRules["caps"]["lifecycleRamp"]>,
) =>
  observed({
    version,
    profile,
    reachIds: ["oswego_lower_harbor", "oswego_terminal_tailwater"],
    hydraulicId: "oswego_lock_7_usgs",
    weatherId: "oswego_lock_7_weather",
    hydraulic: [470, 10.8, 1160, 30.5, 2130, 68.6],
    lifecycle,
    scope:
      "Hydraulic-only read for the short lower corridor. Temperature has zero influence. Canal exclusion, power operations, and Lake Ontario backwater sharply limit interpretation.",
  });
export const OSWEGO_FALL_CHINOOK: AuditedRiverRunProfile = {
  ...oswegoShared,
  runId: "oswego_fall_chinook",
  biologyProfileId: "great_lakes_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "08-10",
    stagingStart: "08-20",
    start: "09-01",
    beginningEnd: "09-12",
    buildingEstablishedStart: "09-13",
    buildingBroadStart: "09-20",
    peakStart: "09-22",
    peak: "10-01",
    peakEnd: "10-15",
    taperingEnd: "10-25",
    end: "11-01",
    lateEnd: "11-10",
    postRunLateCopyEnd: "11-20",
  },
  historicalPresence: presence(
    8,
    "oswego-chinook-presence-v1",
    salmonAnchors,
    "DEC documents annual stocking and a major recurring fall return to the Varick Dam endpoint; 8/10 remains sectional, not abundance.",
    "New York DEC Oswego River and Pacific salmon pages.",
  ),
  activity: oswegoActivity(
    "oswego-chinook-hydraulic-activity-v2",
    "chinook_fall_reaction",
    { peakEnd: "10-15", taperingEnd: "10-25", endingEnd: "11-10" },
  ),
  researchNotes:
    "DEC timing for hydropower rivers supports an earlier peak than nearby natural tributaries.",
  sourceNotes: "docs/onboarding/river-run/oswego/river-onboarding.md",
};
export const OSWEGO_FALL_COHO: AuditedRiverRunProfile = {
  ...oswegoShared,
  runId: "oswego_fall_coho",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "08-25",
    start: "09-05",
    beginningEnd: "09-15",
    buildingEstablishedStart: "09-16",
    buildingBroadStart: "09-24",
    peakStart: "09-25",
    peak: "10-05",
    peakEnd: "10-15",
    taperingEnd: "10-25",
    end: "11-01",
    lateEnd: "11-10",
    postRunLateCopyEnd: "11-20",
  },
  historicalPresence: presence(
    6,
    "oswego-coho-presence-v2",
    salmonAnchors,
    "DEC confirms coho in the migratory corridor but publishes less river-specific abundance evidence, so the sectional ceiling is 6/10.",
    "New York DEC Oswego River and Lake Ontario salmon pages.",
  ),
  activity: oswegoActivity(
    "oswego-coho-hydraulic-activity-v2",
    "coho_fall_reaction",
    { peakEnd: "10-15", taperingEnd: "10-25", endingEnd: "11-10" },
  ),
  researchNotes:
    "DEC groups coho and Chinook in Oswego's hydropower-controlled mid-September through mid-October peak; coho remains a separate product rather than an invented later calendar.",
  sourceNotes: "docs/onboarding/river-run/oswego/river-onboarding.md",
};
export const OSWEGO_FALL_STEELHEAD: AuditedRiverRunProfile = {
  ...oswegoShared,
  runId: "oswego_fall_steelhead",
  biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
  displayName: "Fall-entry Steelhead",
  species: "steelhead",
  runType: "fall_entry",
  movementEngineId: "fall_entry_cooling",
  runWindow: {
    preRunStart: "09-01",
    stagingStart: "09-10",
    start: "09-20",
    beginningEnd: "10-05",
    buildingEstablishedStart: "10-06",
    buildingBroadStart: "10-18",
    peakStart: "10-25",
    peak: "11-10",
    peakEnd: "11-30",
    taperingEnd: "12-20",
    end: "01-10",
    lateEnd: "01-31",
    postRunLateCopyEnd: "02-15",
  },
  historicalPresence: presence(
    7,
    "oswego-steelhead-presence-v1",
    livingAnchors,
    "Annual stocking and DEC's named Oswego fall/winter steelhead fishery support a 7/10 sectional ceiling.",
    "New York DEC Oswego River and Lake Ontario tributary steelhead pages.",
  ),
  activity: oswegoActivity(
    "oswego-steelhead-hydraulic-activity-v2",
    "steelhead_feeding",
  ),
  researchNotes:
    "Living fall-entry semantics retain overwintering fish and do not imply a salmon-style terminal death curve or spring-run coverage.",
  sourceNotes: "docs/onboarding/river-run/oswego/river-onboarding.md",
};
export const OSWEGO_FALL_BROWN: AuditedRiverRunProfile = {
  ...oswegoShared,
  runId: "oswego_fall_brown_trout",
  biologyProfileId: "great_lakes_lake_run_brown_trout_v1",
  displayName: "Fall Lake-run Brown Trout",
  species: "lake_run_brown_trout",
  runType: "fall_repeat_spawn",
  movementEngineId: "fall_repeat_spawner_cooling",
  runWindow: {
    preRunStart: "09-15",
    stagingStart: "10-01",
    start: "10-15",
    beginningEnd: "10-31",
    buildingEstablishedStart: "11-01",
    buildingBroadStart: "11-10",
    peakStart: "11-15",
    peak: "11-25",
    peakEnd: "12-10",
    taperingEnd: "12-20",
    end: "12-31",
    lateEnd: "01-15",
    postRunLateCopyEnd: "01-31",
  },
  historicalPresence: presence(
    6,
    "oswego-brown-presence-v2",
    livingAnchors,
    "DEC directly identifies brown trout entering shortly after salmon; absent a river count, the sectional ceiling is 6/10.",
    "New York DEC Oswego River page.",
  ),
  activity: oswegoActivity(
    "oswego-brown-hydraulic-activity-v2",
    "brown_trout_fall_reaction",
  ),
  researchNotes:
    "Repeat-spawner semantics are retained and no universal departure is asserted.",
  sourceNotes: "docs/onboarding/river-run/oswego/river-onboarding.md",
};

export const FALL_2026_DRAFT_RIVERS = [
  CLACKAMAS_RIVER_PROFILE,
  MANITOWOC_RIVER_PROFILE,
  OSWEGO_RIVER_PROFILE,
];
export const FALL_2026_DRAFT_RUNS = [
  CLACKAMAS_FALL_CHINOOK,
  CLACKAMAS_FALL_COHO,
  MANITOWOC_FALL_CHINOOK,
  MANITOWOC_FALL_COHO,
  MANITOWOC_FALL_BROWN,
  OSWEGO_FALL_CHINOOK,
  OSWEGO_FALL_COHO,
  OSWEGO_FALL_STEELHEAD,
  OSWEGO_FALL_BROWN,
];
export const FALL_2026_DRAFT_CONFIGURATION_DOCUMENTS:
  RiverRunConfigurationDocument[] = [
    {
      schemaVersion: "river-run-config-v1",
      configVersion: "2026-09-02-clackamas-owner-review.2",
      movementEngineVersion:
        getMovementEngineDefinition("fall_cooling").version,
      river: CLACKAMAS_RIVER_PROFILE,
      biologyProfiles: [
        PACIFIC_FALL_CHINOOK_BIOLOGY_PROFILE,
        PACIFIC_FALL_COHO_BIOLOGY_PROFILE,
      ],
      runs: [CLACKAMAS_FALL_CHINOOK, CLACKAMAS_FALL_COHO],
    },
    {
      schemaVersion: "river-run-config-v1",
      configVersion: "2026-09-02-manitowoc-owner-review.2",
      movementEngineVersion: [
        getMovementEngineDefinition("fall_cooling").version,
        getMovementEngineDefinition("fall_repeat_spawner_cooling").version,
      ].join("+"),
      river: MANITOWOC_RIVER_PROFILE,
      biologyProfiles: [
        GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
        GREAT_LAKES_COHO_BIOLOGY_PROFILE,
        GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE,
      ],
      runs: [MANITOWOC_FALL_CHINOOK, MANITOWOC_FALL_COHO, MANITOWOC_FALL_BROWN],
    },
    {
      schemaVersion: "river-run-config-v1",
      configVersion: "2026-09-02-oswego-owner-review.2",
      movementEngineVersion: [
        getMovementEngineDefinition("fall_cooling").version,
        getMovementEngineDefinition("fall_entry_cooling").version,
        getMovementEngineDefinition("fall_repeat_spawner_cooling").version,
      ].join("+"),
      river: OSWEGO_RIVER_PROFILE,
      biologyProfiles: [
        GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
        GREAT_LAKES_COHO_BIOLOGY_PROFILE,
        GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
        GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE,
      ],
      runs: [
        OSWEGO_FALL_CHINOOK,
        OSWEGO_FALL_COHO,
        OSWEGO_FALL_STEELHEAD,
        OSWEGO_FALL_BROWN,
      ],
    },
  ];
