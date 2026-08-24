import type {
  AuditedRiverRunProfile,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";
import { getMovementEngineDefinition } from "../movementEngines.ts";
import { GREAT_LAKES_COHO_BIOLOGY_PROFILE } from "../speciesBiology.ts";

export const PLATTE_RIVER_PROFILE: RiverProfile = {
  riverId: "platte",
  displayName: "Platte River",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  mouthLat: 44.7296,
  mouthLon: -86.1562,
  hydraulicSources: [{
    sourceId: "platte_honor_usgs",
    provider: "USGS",
    siteId: "04126740",
    name: "Platte River at Honor, MI",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 36,
    maxAgeHours: 2,
    reachQuality: "acceptable",
    reachNotes:
      "The US-31/Honor station is upstream of Platte Lake and does not represent the lower Coho corridor. It is accepted for Gauge Read only; provider faults and values older than 24 hours fail closed.",
  }],
  waterTemperatureSources: [],
  weatherPoints: [
    {
      weatherPointId: "platte_el_dorado_weather",
      lat: 44.7265,
      lon: -86.1436,
      role: "primary",
    },
    {
      weatherPointId: "platte_honor_weather_context",
      lat: 44.6681,
      lon: -86.0348,
      role: "basin_context",
    },
  ],
  foundation: {
    version: "platte-foundation-v1-draft",
    corridorLengthMiles: 2,
    downstreamTerminus: "Platte River Point at Platte Bay",
    upstreamTerminus:
      "The downstream edge of the signed 300-foot Lower Platte River Weir closure whenever the weir is installed",
    targetSpecies: ["coho_salmon"],
    reaches: [
      {
        reachId: "platte_lower_entry",
        displayName: "Lower river — Platte River Point to El Dorado",
        order: 1,
        role: "downstream",
        gaugeRepresented: false,
        notes:
          "Approved lower entry section. Honor measurements do not represent this reach.",
        sourceNotes:
          "National Park Service Platte River Point and El Dorado access descriptions; owner-approved 2026-08-24.",
      },
      {
        reachId: "platte_weir_approach",
        displayName: "Weir approach — El Dorado to the Lower Weir closure",
        order: 2,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Guidance ends at the downstream edge of the current signed closure and never directs users through or above the weir.",
        sourceNotes:
          "Michigan DNR Platte hatchery/weir material, 2026 fishing regulations, and owner approval 2026-08-24.",
      },
    ],
    locations: [{
      locationId: "platte_lower_weir",
      officialName: "Lower Platte River Weir",
      aliases: ["Lower weir"],
      state: "MI",
      latitude: 44.725,
      longitude: -86.13,
      coordinateSource:
        "Orientation coordinate only; final official structure coordinate remains required before access-facing use",
      coordinateStatus: "provisional",
      reachId: "platte_weir_approach",
      kind: "barrier",
      fishPassage: "limited",
      publicUpstreamLimit: true,
      publicAccess: "restricted",
      fishingSuitability: { bank: "unknown", wading: "no", boat: "no" },
      beginnerSuitable: false,
      restrictionNotes:
        "Fishing is closed within 300 feet whenever the weir is installed. Current signs and agency instructions control.",
      sourceNotes:
        "Michigan DNR 2026 Fishing Regulations and Platte River State Fish Hatchery & Weir page.",
    }],
    primaryGaugeReachId: null,
    contextualGaugeSiteIds: ["04126740"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "platte_el_dorado_weather",
      basinRepresentation:
        "Modeled lower-corridor weather at El Dorado supports only the independently calibrated weather-only Activity model. It does not observe river level, clarity, or water temperature.",
      sourceNotes:
        "NPS El Dorado coordinates; NWS APX grid 12,44 cross-check; Open-Meteo live/archive probes 2026-08-24.",
    },
    stateRegulations: [{
      state: "MI",
      version: "michigan-2026-fishing-regulations-through-2027-03-31",
      jurisdiction:
        "Michigan DNR and applicable Sleeping Bear Dunes National Lakeshore rules",
      reminderCopy:
        "Check current Michigan fishing regulations, park rules, posted weir closures, and signed boundaries before fishing.",
      accessAndSafetyNotes:
        "Section names provide orientation only and do not guarantee access, legal methods, boating, wading, or safety.",
      sourceNotes:
        "Michigan DNR 2026 Fishing Regulations and National Park Service fishing guidance; recheck before release.",
    }],
    evidenceNotes:
      "Owner-approved foundation research dated 2026-08-24. The seasonal Lower Platte River Weir is the conservative product endpoint. Coho is the sole supported Phase C combination; Chinook and Fall Steelhead remain planned-catalog disabled.",
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
      "Gauge Read follows accepted source freshness. Seasonal primitives are deterministic daily; lower-corridor weather-only Activity refreshes through the active window and at the next-day rollover.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: {
      status: "unavailable",
      notes:
        "No accepted continuous measured-water-temperature source represents the lower corridor; air or lake temperature is not substituted.",
    },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "USGS readings describe the Platte at US-31 near Honor, upstream of Platte Lake—not the lower river near the weir or mouth.",
  regulationReminderCopy:
    "Check current Michigan regulations and posted Lower Platte River Weir closures. River Run guidance ends below the signed closure.",
};

export const PLATTE_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "platte_fall_coho",
  riverId: "platte",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  primitiveCapabilities: {
    migrationStage: { status: "available" },
    activity: { status: "available" },
    fishInRiver: { status: "available" },
    fishability: {
      status: "unavailable",
      reason: "no_accepted_hydraulic_source",
      notes:
        "Honor hydraulics do not represent the lower corridor, so no local presentation bands are accepted.",
    },
    migrationTiming: {
      status: "unavailable",
      reason: "no_accepted_historical_baseline",
      notes:
        "No accepted paired lower-corridor hydraulic and measured-temperature history supports an early, typical, or delayed comparison.",
    },
    push: {
      status: "unavailable",
      reason: "no_accepted_hydraulic_or_water_temperature_source",
      notes:
        "The lower corridor has neither reach-representative hydraulics nor measured water temperature for a movement read.",
    },
  },
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "09-01",
    start: "09-15",
    beginningEnd: "09-30",
    buildingEstablishedStart: "10-01",
    buildingBroadStart: "10-10",
    peakStart: "10-16",
    peak: "10-22",
    peakEnd: "10-28",
    taperingEnd: "11-10",
    end: "11-20",
    lateEnd: "11-30",
    postRunLateCopyEnd: "12-02",
  },
  historicalPresence: {
    maximum: 10,
    distributionScope: "concentrated",
    curveVersion: "platte-fall-coho-presence-v1-draft",
    evidenceNotes:
      "Draft curve brackets direct mid-September return evidence and the documented 2025 October 16–28 egg-take window. The 10/10 ceiling is relative historical opportunity for Michigan's principal Coho egg-take river, not a fish count.",
    sourceNotes:
      "Michigan DNR Coho biology, Platte hatchery/weir material, Better Fishing Waters, and the 2025 egg-collection report; exact dates and anchors remain owner-calibrated pending replay.",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.05 },
      { dayOffsetFromStart: 10, fractionOfMaximum: 0.2 },
      { dayOffsetFromStart: 20, fractionOfMaximum: 0.5 },
      { dayOffsetFromStart: 31, fractionOfMaximum: 0.9 },
      { dayOffsetFromStart: 37, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 43, fractionOfMaximum: 0.95 },
      { dayOffsetFromStart: 47, fractionOfMaximum: 0.8 },
      { dayOffsetFromStart: 56, fractionOfMaximum: 0.45 },
      { dayOffsetFromStart: 66, fractionOfMaximum: 0.15 },
      { dayOffsetFromStart: 76, fractionOfMaximum: 0 },
    ],
  },
  activity: {
    version: "platte-fall-coho-weather-activity-v1-draft",
    profile: "coho_fall_reaction",
    dataMode: "weather_only",
    inputReach: {
      reachIds: ["platte_lower_entry", "platte_weir_approach"],
      hydraulicSourceIds: [],
      waterTemperatureSourceIds: [],
      weatherPointIds: ["platte_el_dorado_weather"],
      notes:
        "Honor hydraulics are intentionally excluded because Platte and Loon lakes separate that station from the lower run corridor.",
    },
    scopeCopy:
      "This weather-only read is limited to the lower corridor from Platte River Point to the signed Lower Weir closure; Honor river measurements are not scoring inputs.",
    weights: {
      light: 0.75,
      waterTemperature: 0,
      riverBehavior: 0,
      weather: 0.25,
    },
    temperature: {
      coldF: 38,
      preferredMinF: 46,
      preferredMaxF: 58,
      warmF: 65,
      barrierF: 70,
    },
    caps: {
      noMeasuredRiverData: 90,
      noWaterTemperature: 90,
      weatherOnlyMaximum: 90,
      weatherOnlyTomorrowMaximum: 85,
      lateRun: 75,
      ending: 42,
      taperingPenalty: 15,
      lifecycleRamp: {
        peakEnd: "10-28",
        taperingEnd: "11-10",
        endingEnd: "11-30",
      },
    },
    evidenceNotes:
      "Draft lower-reach weather-only model scores only effective light and in-block precipitation for Coho already present. It never infers flow, clarity, temperature, migration, abundance, catch probability, access, or safety. Fixed 2007–2025 replay must validate archive fallback behavior where clear-sky radiation is null, distributions, lifecycle continuity, and copy invariants before acceptance.",
  },
  researchNotes:
    "Hidden Phase C implementation candidate. Calendar, 10/10 concentrated presence curve, and 75/25 weather-only Activity rules are proposals pending fixed replay, production-derived fixtures, device review, and owner acceptance.",
  sourceNotes:
    "Research packet docs/onboarding/river-run/platte/runs/fall-coho.md and its cited Michigan DNR/NPS/provider evidence, completed 2026-08-24.",
  publicAudit: {
    isEnabled: false,
    auditVersion: "platte-fall-coho-phase-c-draft-v1",
    notes:
      "Hidden until replay, runtime validation, fixtures, iOS/Android review, smoke testing, and separate owner run/copy/visual acceptance pass.",
  },
};

export const PLATTE_CONFIGURATION_DOCUMENT: RiverRunConfigurationDocument = {
  schemaVersion: "river-run-config-v1",
  configVersion: "2026-08-24-platte-phase-c-draft.1",
  movementEngineVersion: getMovementEngineDefinition("fall_cooling").version,
  river: PLATTE_RIVER_PROFILE,
  biologyProfiles: [GREAT_LAKES_COHO_BIOLOGY_PROFILE],
  runs: [PLATTE_FALL_COHO_RUN_PROFILE],
};
