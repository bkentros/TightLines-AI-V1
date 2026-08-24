import type {
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
  GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
} from "../speciesBiology.ts";

export const GRAND_RIVER_PROFILE: RiverProfile = {
  riverId: "grand",
  displayName: "Grand River",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  mouthLat: 43.057,
  mouthLon: -86.255,
  hydraulicSources: [{
    sourceId: "grand_fulton_usgs",
    provider: "USGS",
    siteId: "04119000",
    name: "Grand River at Grand Rapids — Fulton Street",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 96,
    maxAgeHours: 2,
    reachQuality: "acceptable",
    reachNotes:
      "Represents the downtown Fulton Street reach only. Active downtown dam removal requires a rating/datum re-audit after each construction season or material channel change.",
  }],
  waterTemperatureSources: [{
    sourceId: "grand_north_park_temperature",
    provider: "USGS",
    siteId: "04118564",
    name: "Grand River at North Park Street — measured water temperature",
    role: "primary",
    priority: 1,
    sourceType: "nearby_gauge",
    maxAgeHours: 2,
    smoothingWindowHours: 3,
    minValidF: 30,
    maxValidF: 85,
    maxRateChangeFPerHour: 3,
    maxPeerDifferenceF: 5,
    historicalStartYear: 2020,
    historicalEndYear: 2026,
    reachNotes:
      "North Park Street is above Sixth Street and represents only that Grand Rapids reach. It is not co-located with Fulton hydraulics and is never blended into Activity in this draft.",
    attribution:
      "U.S. Geological Survey Water Data for the Nation; recent readings are provisional and subject to revision.",
  }],
  weatherPoints: [{
    weatherPointId: "grand_rapids_weather",
    lat: 42.963082,
    lon: -85.6772533,
    role: "primary",
  }],
  foundation: {
    version: "grand-foundation-v1-draft",
    corridorLengthMiles: 152,
    downstreamTerminus: "Grand Haven mouth at Lake Michigan",
    upstreamTerminus:
      "Webber Dam for Chinook; below Moores Park Dam for Coho and Steelhead, subject to verified passage through every intermediate facility",
    targetSpecies: ["chinook_salmon", "coho_salmon", "steelhead"],
    reaches: [
      {
        reachId: "grand_lower",
        displayName: "Lower river (Grand Haven mouth–Sixth Street Dam)",
        order: 1,
        role: "downstream",
        gaugeRepresented: true,
        notes:
          "Fulton measurements describe only the downtown end of this long section. Active beautification-dam removal and current Sixth Street operations require re-verification.",
        sourceNotes:
          "Michigan DNR Grand River assessments, Grand Rapids project updates, and USGS 04119000.",
      },
      {
        reachId: "grand_middle_passage",
        displayName: "Middle passage corridor (Sixth Street Dam–Webber Dam)",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "No recommendation is allowed until the current Sixth/Ada/Wagar route is verified. Historic Webber counts prove past passage, not today's complete route.",
        sourceNotes:
          "Michigan DNR Ionia County assessment, ladder inventory, and 2024 Webber enforcement report.",
      },
      {
        reachId: "grand_upper_accessible",
        displayName: "Upper accessible corridor (Webber Dam–Moores Park Dam)",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Never shown for Chinook. Coho and Steelhead require current species-specific verification through Webber, Portland, Grand Ledge, and North Lansing; guidance ends below Moores Park Dam.",
        sourceNotes:
          "Michigan DNR current destination table, Grand River assessment, and state ladder inventory.",
      },
    ],
    locations: [{
      locationId: "grand_moores_park_endpoint",
      officialName: "Moores Park Dam",
      state: "MI",
      latitude: 42.706,
      longitude: -84.575,
      coordinateSource:
        "Orientation coordinate pending final official GIS verification",
      coordinateStatus: "provisional",
      reachId: "grand_upper_accessible",
      kind: "barrier",
      fishPassage: "impassable",
      publicUpstreamLimit: true,
      publicAccess: "restricted",
      fishingSuitability: { bank: "unknown", wading: "no", boat: "no" },
      beginnerSuitable: false,
      restrictionNotes:
        "Conservative Coho/Steelhead product endpoint. Chinook guidance ends much earlier at Webber Dam. Current signs, access, and dam-safety boundaries control.",
      sourceNotes:
        "Michigan DNR current destination table and owner-approved species endpoint decision, 2026-08-24.",
    }],
    primaryGaugeReachId: "grand_lower",
    contextualGaugeSiteIds: [],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "grand_rapids_weather",
      basinRepresentation:
        "Modeled Grand Rapids weather is local context only. It does not represent the full corridor, and Activity remains unavailable while reach pairing and effective-light inputs are unresolved.",
      sourceNotes:
        "Production-shaped Open-Meteo probe at Fulton Street context coordinates, 2026-08-24.",
    },
    stateRegulations: [{
      state: "MI",
      version: "michigan-2026-fishing-regulations-through-2027-03-31",
      jurisdiction: "Michigan DNR Grand River regulations",
      reminderCopy:
        "Check current Michigan regulations, fish-ladder restrictions, construction closures, access notices, and posted dam boundaries.",
      accessAndSafetyNotes:
        "Section names and passage status do not guarantee public access, legal fishing, boating, wading, or safety.",
      sourceNotes:
        "Michigan DNR 2026 Fishing Regulations and current Grand Rapids construction notices; recheck before release.",
    }],
    evidenceNotes:
      "Owner-approved foundation dated 2026-08-24. Species endpoints differ because passage evidence differs: Chinook ends at Webber; Coho and Steelhead may extend only after the full route to below Moores Park is current and species-supported.",
  },
  conditionRefreshSchedule: {
    activeSlots: [
      "00:00",
      "04:00",
      "08:00",
      "12:00",
      "16:00",
      "20:00",
      "21:00",
    ],
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "Gauge Read refreshes Fulton hydraulics and North Park temperature independently. Activity remains unavailable and no cross-reach composite is produced.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Flow and height describe Fulton Street below Sixth Street; water temperature describes North Park Street above Sixth Street. Neither station represents the full Grand River.",
  regulationReminderCopy:
    "Verify current regulations, construction, ladder operations, and the complete species-specific passage route before using any section above the Lower river.",
};

const GRAND_BASELINE = {
  metric: "flow_cfs" as const,
  version: "grand-fulton-1930-2026-draft",
  hasPercentileBaselines: true,
  coveredWindowPercent: 0.99,
  minimumHistoryYears: 10,
  sourceNotes:
    "USGS 04119000 daily discharge record; draft seasonal Fishability bands require post-construction re-audit and local review.",
};

function fishability(
  version: string,
  tooLow: number,
  low: number,
  idealHigh: number,
  high: number,
): FishabilityBands {
  return {
    version,
    metric: "flow_cfs",
    sourceLabel: "Fulton Street",
    tooLow: { max: tooLow },
    lowFishable: { min: tooLow, max: low },
    ideal: { min: low, max: idealHigh },
    highFishable: { min: idealHigh, max: high - 1 },
    blownOut: { min: high },
    caps: {
      staleGauge: 55,
      unknownTrend: 49,
      veryLow: 45,
      blownOut: 24,
      sharpRiseHigh: 40,
    },
    evidenceNotes:
      "Draft Fulton Street seasonal-percentile scaffolding. These bands describe local presentation shape only and are not access, flood, wading, boating, or safety thresholds.",
    sourceNotes:
      "USGS 04119000 seasonal daily discharge audit in the species Phase C packet; replay and post-construction rating review pending.",
  };
}

const unavailableCapabilities = (fishabilityAvailable = true) => ({
  migrationStage: { status: "available" as const },
  activity: {
    status: "unavailable" as const,
    reason: "no_accepted_activity_calibration" as const,
    notes:
      "Fulton hydraulics and North Park temperature are split across Sixth Street, and the effective-light provider contract is unresolved. No cross-reach or weather-only fallback is accepted.",
    publicCopy: {
      headline:
        "Activity is unavailable because the accepted Grand River measurements do not describe one shared reach.",
      detail:
        "Fulton Street flow and North Park water temperature remain useful as separately labeled Gauge Read measurements, but FinFindr does not combine them into one responsiveness score.",
      tip:
        "Use each Gauge Read only for its named Grand Rapids reach; do not infer a whole-river response.",
    },
  },
  fishInRiver: { status: "available" as const },
  fishability: fishabilityAvailable ? { status: "available" as const } : {
    status: "unavailable" as const,
    reason: "no_accepted_hydraulic_source" as const,
    notes: "No accepted reach-representative hydraulic source.",
  },
  migrationTiming: {
    status: "unavailable" as const,
    reason: "no_accepted_historical_baseline" as const,
    notes:
      "No accepted same-reach paired hydraulic and measured-temperature history supports migration timing.",
  },
  push: {
    status: "unavailable" as const,
    reason: "no_accepted_water_temperature_source" as const,
    notes:
      "No measured temperature source represents the Fulton hydraulic reach.",
  },
});

function presence(
  maximum: HistoricalPresenceConfig["maximum"],
  scope: "sectional" | "broad",
  version: string,
  anchors: HistoricalPresenceConfig["anchors"],
  evidence: string,
): HistoricalPresenceConfig {
  return {
    maximum,
    distributionScope: scope,
    curveVersion: version,
    evidenceNotes: evidence,
    sourceNotes:
      "Michigan DNR Grand River/Ionia assessment and species biology; exact anchors are Phase C calibration proposals pending replay and owner acceptance.",
    anchors,
  };
}

export const GRAND_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "grand_fall_chinook",
  riverId: "grand",
  biologyProfileId: "great_lakes_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  primitiveCapabilities: unavailableCapabilities(),
  runWindow: {
    preRunStart: "08-01",
    stagingStart: "08-10",
    start: "08-20",
    beginningEnd: "08-31",
    buildingEstablishedStart: "09-01",
    buildingBroadStart: "09-08",
    peakStart: "09-20",
    peak: "09-20",
    peakEnd: "09-30",
    taperingEnd: "10-20",
    end: "11-07",
    lateEnd: "11-15",
    postRunLateCopyEnd: "11-30",
  },
  historicalPresence: presence(
    7,
    "sectional",
    "grand-chinook-presence-v2-draft",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.1 },
      { dayOffsetFromStart: 12, fractionOfMaximum: 0.3 },
      { dayOffsetFromStart: 19, fractionOfMaximum: 0.6 },
      { dayOffsetFromStart: 31, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 41, fractionOfMaximum: 0.82 },
      { dayOffsetFromStart: 61, fractionOfMaximum: 0.42 },
      { dayOffsetFromStart: 79, fractionOfMaximum: 0.14 },
      { dayOffsetFromStart: 87, fractionOfMaximum: 0.05 },
      { dayOffsetFromStart: 102, fractionOfMaximum: 0 },
    ],
    "Draft 7/10 Lower-first sectional curve combines historic Webber passage with the recurring lower-river fishery and current direct Chinook stocking. The ceiling remains below signature 8-10 calibrations because Webber is 102 river miles upstream and passage declines at successive ladders. Chinook guidance never extends above Webber and Middle remains conditional on the current complete route.",
  ),
  fishabilityBands: fishability(
    "grand-chinook-fulton-fishability-v1-draft",
    1200,
    1600,
    3800,
    6400,
  ),
  baselineCoverage: GRAND_BASELINE,
  researchNotes:
    "Hidden Phase C candidate. Calendar, curve, ceiling, Fishability bands, passage routing, post-construction source review, fixtures, and visual copy require acceptance.",
  sourceNotes:
    "docs/onboarding/river-run/grand/runs/fall-chinook.md and its evidence ledger, completed 2026-08-24.",
  publicAudit: {
    isEnabled: false,
    auditVersion: "grand-fall-chinook-phase-c-draft-v1",
    notes: "Hidden until every Phase C gate passes.",
  },
};

export const GRAND_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "grand_fall_coho",
  riverId: "grand",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  primitiveCapabilities: unavailableCapabilities(),
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "08-25",
    start: "09-01",
    beginningEnd: "09-07",
    buildingEstablishedStart: "09-08",
    buildingBroadStart: "09-15",
    peakStart: "09-22",
    peak: "09-22",
    peakEnd: "09-29",
    taperingEnd: "11-15",
    end: "11-30",
    lateEnd: "12-15",
    postRunLateCopyEnd: "12-31",
  },
  historicalPresence: presence(
    8,
    "broad",
    "grand-coho-presence-v1-draft",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.1 },
      { dayOffsetFromStart: 7, fractionOfMaximum: 0.4 },
      { dayOffsetFromStart: 14, fractionOfMaximum: 0.78 },
      { dayOffsetFromStart: 21, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 29, fractionOfMaximum: 0.88 },
      { dayOffsetFromStart: 45, fractionOfMaximum: 0.68 },
      { dayOffsetFromStart: 67, fractionOfMaximum: 0.58 },
      { dayOffsetFromStart: 90, fractionOfMaximum: 0.24 },
      { dayOffsetFromStart: 105, fractionOfMaximum: 0.06 },
      { dayOffsetFromStart: 121, fractionOfMaximum: 0 },
    ],
    "Draft 8/10 curve reflects strong historic Webber Coho passage and a long November shoulder. Upper distribution remains withheld until every intermediate facility is current and species-supported.",
  ),
  fishabilityBands: fishability(
    "grand-coho-fulton-fishability-v1-draft",
    1300,
    1700,
    4200,
    7200,
  ),
  baselineCoverage: GRAND_BASELINE,
  researchNotes:
    "Hidden Phase C candidate with fail-closed passage routing and unavailable cross-reach Activity.",
  sourceNotes:
    "docs/onboarding/river-run/grand/runs/fall-coho.md and its evidence ledger, completed 2026-08-24.",
  publicAudit: {
    isEnabled: false,
    auditVersion: "grand-fall-coho-phase-c-draft-v1",
    notes: "Hidden until every Phase C gate passes.",
  },
};

export const GRAND_FALL_STEELHEAD_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "grand_fall_steelhead",
  riverId: "grand",
  biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
  displayName: "Fall Steelhead",
  species: "steelhead",
  season: "fall",
  runType: "fall_entry",
  movementEngineId: "fall_entry_cooling",
  primitiveCapabilities: unavailableCapabilities(),
  runWindow: {
    preRunStart: "09-01",
    stagingStart: "09-10",
    start: "09-15",
    beginningEnd: "09-30",
    buildingEstablishedStart: "10-01",
    buildingBroadStart: "10-20",
    peakStart: "11-01",
    peak: "11-15",
    peakEnd: "11-30",
    taperingEnd: "12-15",
    end: "12-31",
    lateEnd: "01-15",
    postRunLateCopyEnd: "01-31",
  },
  historicalPresence: presence(
    7,
    "broad",
    "grand-steelhead-fall-presence-v2-draft",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.05 },
      { dayOffsetFromStart: 15, fractionOfMaximum: 0.12 },
      { dayOffsetFromStart: 30, fractionOfMaximum: 0.3 },
      { dayOffsetFromStart: 40, fractionOfMaximum: 0.5 },
      { dayOffsetFromStart: 47, fractionOfMaximum: 0.72 },
      { dayOffsetFromStart: 61, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 76, fractionOfMaximum: 0.88 },
      { dayOffsetFromStart: 91, fractionOfMaximum: 0.72 },
      { dayOffsetFromStart: 107, fractionOfMaximum: 0.62 },
      { dayOffsetFromStart: 122, fractionOfMaximum: 0.58 },
      { dayOffsetFromStart: 138, fractionOfMaximum: 0 },
    ],
    "Draft 7/10 fall-entry curve recognizes the Grand as a major recurring Steelhead fishery, including current stocking, documented fall passage, and current spring-run enforcement observations. September remains sparse, November is the fall high, and the curve retains a holding shoulder. The ceiling does not treat spring abundance as fall abundance. Terminal copy ends the fall model without claiming Steelhead left or died.",
  ),
  fishabilityBands: fishability(
    "grand-steelhead-fulton-fishability-v1-draft",
    1400,
    1900,
    4800,
    8000,
  ),
  baselineCoverage: GRAND_BASELINE,
  researchNotes:
    "Hidden Phase C fall-entry candidate. No salmon mortality semantics or unsupported spring handoff is allowed.",
  sourceNotes:
    "docs/onboarding/river-run/grand/runs/fall-steelhead.md and its evidence ledger, completed 2026-08-24.",
  publicAudit: {
    isEnabled: false,
    auditVersion: "grand-fall-steelhead-phase-c-draft-v1",
    notes: "Hidden until every Phase C gate passes.",
  },
};

export const GRAND_CONFIGURATION_DOCUMENT: RiverRunConfigurationDocument = {
  schemaVersion: "river-run-config-v1",
  configVersion: "2026-08-24-grand-phase-c-draft.2",
  movementEngineVersion: [
    getMovementEngineDefinition("fall_cooling").version,
    getMovementEngineDefinition("fall_entry_cooling").version,
  ].join("+"),
  river: GRAND_RIVER_PROFILE,
  biologyProfiles: [
    GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
    GREAT_LAKES_COHO_BIOLOGY_PROFILE,
    GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
  ],
  runs: [
    GRAND_FALL_CHINOOK_RUN_PROFILE,
    GRAND_FALL_COHO_RUN_PROFILE,
    GRAND_FALL_STEELHEAD_RUN_PROFILE,
  ],
};
