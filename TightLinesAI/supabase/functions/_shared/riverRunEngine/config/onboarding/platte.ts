import type {
  AuditedRiverRunProfile,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";
import { getMovementEngineDefinition } from "../movementEngines.ts";
import {
  GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
  GREAT_LAKES_COHO_BIOLOGY_PROFILE,
  GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
} from "../speciesBiology.ts";
import { buildWeatherOnlyActivity } from "./weatherOnlyActivity.ts";

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
    targetSpecies: ["chinook_salmon", "coho_salmon", "steelhead"],
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
      "The seasonal Lower Platte River Weir is the conservative product endpoint. Michigan DNR lower-weir records directly support fall Chinook, Coho, and Steelhead in this corridor; all three remain hidden Phase C candidates pending review.",
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

const PLATTE_SEASONAL_ONLY_CAPABILITIES:
  AuditedRiverRunProfile["primitiveCapabilities"] = {
    migrationStage: { status: "available" },
    activity: {
      status: "unavailable",
      reason: "no_accepted_activity_calibration",
      notes:
        "No lower-corridor measured hydraulics or water temperature supports a species-specific Activity calibration.",
    },
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
        "No accepted paired lower-corridor history supports an early, typical, or delayed comparison.",
    },
    push: {
      status: "unavailable",
      reason: "no_accepted_hydraulic_or_water_temperature_source",
      notes:
        "The lower corridor has neither reach-representative hydraulics nor measured water temperature for a movement read.",
    },
  };

export const PLATTE_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "platte_fall_chinook",
  riverId: "platte",
  biologyProfileId: "great_lakes_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runStageCopyStrategy: "onboarding_corridor",
  primitiveCapabilities: {
    ...PLATTE_SEASONAL_ONLY_CAPABILITIES,
    activity: { status: "available" },
  },
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "08-20",
    start: "09-15",
    beginningEnd: "09-20",
    buildingEstablishedStart: "09-21",
    buildingBroadStart: "09-22",
    peakStart: "09-23",
    peak: "09-23",
    peakEnd: "10-17",
    taperingEnd: "10-31",
    end: "11-21",
    lateEnd: "11-30",
    postRunLateCopyEnd: "12-02",
  },
  historicalPresence: {
    maximum: 4,
    distributionScope: "concentrated",
    curveVersion: "platte-fall-chinook-presence-v3-draft",
    evidenceNotes:
      "A conservative 4/10 lower-corridor curve reflects a recurring but secondary Chinook run: DNR recorded annual lower-weir returns in 1979-1990, with the 1990 run spanning late September through November, plus a documented Platte king salmon in 2024. It is not a current fish count.",
    sourceNotes:
      "Michigan DNR Technical Report 91-1, current Platte hatchery/weir material, and 2024 conservation-officer reporting.",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.05 },
      { dayOffsetFromStart: 5, fractionOfMaximum: 0.2 },
      { dayOffsetFromStart: 8, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 32, fractionOfMaximum: 0.8 },
      { dayOffsetFromStart: 46, fractionOfMaximum: 0.35 },
      { dayOffsetFromStart: 67, fractionOfMaximum: 0.08 },
      { dayOffsetFromStart: 76, fractionOfMaximum: 0 },
    ],
  },
  activity: buildWeatherOnlyActivity({
    version: "platte-fall-chinook-weather-activity-v1-draft",
    profile: "chinook_fall_reaction",
    reachIds: ["platte_lower_entry", "platte_weir_approach"],
    weatherPointId: "platte_el_dorado_weather",
    inputNotes:
      "Honor hydraulics are intentionally excluded because Platte and Loon lakes separate that station from the lower run corridor. No accepted measured lower-corridor temperature exists.",
    scopeCopy:
      "This Limited weather-only read covers the lower corridor from Platte River Point to the signed Lower Weir closure; Honor measurements are not scoring inputs.",
    lifecycle: {
      peakEnd: "10-17",
      taperingEnd: "10-31",
      endingEnd: "11-30",
    },
    evidenceNotes:
      "Draft Chinook response candidate for a fish already present below the Lower Platte weir. It scores effective light and same-block precipitation only, with conservative true ceilings and a continuous Chinook lifecycle decline. It never infers lower-river flow, clarity, temperature, migration, abundance, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden correction candidate. The earlier unsupported verdict was withdrawn after direct DNR lower-weir records were found.",
  sourceNotes:
    "docs/onboarding/river-run/platte/runs/fall-chinook.md; research corrected 2026-08-24.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "platte-fall-chinook-release-audit-v1",
    notes:
      "Owner accepted the reviewed run and production release on 2026-08-25.",
  },
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
  runStageCopyStrategy: "onboarding_corridor",
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
    preRunStart: "08-10",
    stagingStart: "08-20",
    start: "09-02",
    beginningEnd: "09-08",
    buildingEstablishedStart: "09-09",
    buildingBroadStart: "09-12",
    peakStart: "09-15",
    peak: "09-20",
    peakEnd: "09-30",
    taperingEnd: "10-31",
    end: "11-20",
    lateEnd: "11-30",
    postRunLateCopyEnd: "12-02",
  },
  historicalPresence: {
    maximum: 10,
    distributionScope: "concentrated",
    curveVersion: "platte-fall-coho-presence-v2-draft",
    evidenceNotes:
      "Draft curve follows direct lower-weir migration evidence: fish concentrated in Platte Bay in late August, entered the river in September, peaked September 15 in 1990, and 71% of harvested Coho were taken September 17-23. The October 2025 egg-take window is maturation and hatchery-operation context, not the migration peak. The 10/10 ceiling is relative historical opportunity for Michigan's principal Coho egg-take river, not a fish count.",
    sourceNotes:
      "Michigan DNR Coho biology, Platte hatchery/weir material, Better Fishing Waters, and the 2025 egg-collection report; exact dates and anchors remain owner-calibrated pending replay.",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.05 },
      { dayOffsetFromStart: 6, fractionOfMaximum: 0.2 },
      { dayOffsetFromStart: 10, fractionOfMaximum: 0.5 },
      { dayOffsetFromStart: 13, fractionOfMaximum: 0.9 },
      { dayOffsetFromStart: 18, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 28, fractionOfMaximum: 0.9 },
      { dayOffsetFromStart: 45, fractionOfMaximum: 0.65 },
      { dayOffsetFromStart: 59, fractionOfMaximum: 0.4 },
      { dayOffsetFromStart: 69, fractionOfMaximum: 0.15 },
      { dayOffsetFromStart: 79, fractionOfMaximum: 0 },
    ],
  },
  activity: buildWeatherOnlyActivity({
    version: "platte-fall-coho-weather-activity-v2-draft",
    profile: "coho_fall_reaction",
    reachIds: ["platte_lower_entry", "platte_weir_approach"],
    weatherPointId: "platte_el_dorado_weather",
    inputNotes:
      "Honor hydraulics are intentionally excluded because Platte and Loon lakes separate that station from the lower run corridor. No accepted measured lower-corridor temperature exists.",
    scopeCopy:
      "This Limited weather-only read covers the lower corridor from Platte River Point to the signed Lower Weir closure; Honor measurements are not scoring inputs.",
    lifecycle: {
      peakEnd: "09-30",
      taperingEnd: "10-31",
      endingEnd: "11-30",
    },
    evidenceNotes:
      "Draft lower-reach weather-only model scores only effective light and restrained same-block precipitation for a Coho already present. The 70/30 candidate replaces the unevaluated 75/25 draft so the accepted Coho baseline can be compared explicitly in replay. It never infers flow, clarity, temperature, migration, abundance, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden Phase D implementation candidate. The corrected calendar, 10/10 concentrated presence curve, and 70/30 weather-only Activity rules passed the fixed replay and controlled QA; production-derived fixtures, device review, and owner acceptance remain required.",
  sourceNotes:
    "Research packet docs/onboarding/river-run/platte/runs/fall-coho.md and its cited Michigan DNR/NPS/provider evidence, completed 2026-08-24.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "platte-fall-coho-release-audit-v1",
    notes:
      "Owner accepted the reviewed run and production release on 2026-08-25.",
  },
};

export const PLATTE_FALL_STEELHEAD_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "platte_fall_steelhead",
  riverId: "platte",
  biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
  displayName: "Fall Steelhead",
  species: "steelhead",
  season: "fall",
  runType: "fall_entry",
  movementEngineId: "fall_entry_cooling",
  runStageCopyStrategy: "onboarding_corridor",
  primitiveCapabilities: {
    ...PLATTE_SEASONAL_ONLY_CAPABILITIES,
    activity: { status: "available" },
  },
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "08-25",
    start: "09-03",
    beginningEnd: "09-16",
    buildingEstablishedStart: "09-17",
    buildingBroadStart: "10-01",
    peakStart: "10-08",
    peak: "10-17",
    peakEnd: "11-02",
    taperingEnd: "11-21",
    end: "12-15",
    lateEnd: "01-15",
    postRunLateCopyEnd: "01-31",
  },
  historicalPresence: {
    maximum: 7,
    distributionScope: "concentrated",
    curveVersion: "platte-fall-steelhead-presence-v3-draft",
    evidenceNotes:
      "DNR lower-weir records show Steelhead from September 3 through November 30 in 1990, strong throughout fall and peaking the week of October 17; the 3,016-fish return was the largest in the 1980-1990 lower-weir record. Current stocking is comparable to other accepted 7/10 Michigan Steelhead rivers. The retained tail represents overwinter holding potential, not a claim that entry continues at peak strength.",
    sourceNotes:
      "Michigan DNR Technical Report 91-1, current Steelhead biology, Better Fishing Waters, and the 2026 Platte egg-take response.",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.08 },
      { dayOffsetFromStart: 7, fractionOfMaximum: 0.18 },
      { dayOffsetFromStart: 14, fractionOfMaximum: 0.3 },
      { dayOffsetFromStart: 28, fractionOfMaximum: 0.55 },
      { dayOffsetFromStart: 35, fractionOfMaximum: 0.72 },
      { dayOffsetFromStart: 44, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 60, fractionOfMaximum: 0.82 },
      { dayOffsetFromStart: 79, fractionOfMaximum: 0.62 },
      { dayOffsetFromStart: 103, fractionOfMaximum: 0.55 },
      { dayOffsetFromStart: 134, fractionOfMaximum: 0.45 },
    ],
  },
  activity: buildWeatherOnlyActivity({
    version: "platte-fall-steelhead-weather-activity-v1-draft",
    profile: "steelhead_feeding",
    reachIds: ["platte_lower_entry", "platte_weir_approach"],
    weatherPointId: "platte_el_dorado_weather",
    inputNotes:
      "Honor hydraulics are intentionally excluded because Platte and Loon lakes separate that station from the lower run corridor. No accepted measured lower-corridor temperature exists.",
    scopeCopy:
      "This Limited weather-only read covers the lower corridor from Platte River Point to the signed Lower Weir closure; Honor measurements are not scoring inputs.",
    evidenceNotes:
      "Draft Steelhead response candidate for a living fish already present below the Lower Platte weir. It scores only effective light and restrained same-block precipitation and deliberately has no salmon mortality ramp, taper penalty, or ending cap. Because measured water temperature normally leads accepted Steelhead Activity at 50%, the explicit 0.80 weather-only evidence scale prevents secondary inputs from claiming highly active response by themselves; this is a product uncertainty calibration validated by the fixed 2007-2025 replay, not a biological constant. It cannot infer temperature-led feeding quality, flow, clarity, migration, abundance, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden correction candidate. Terminal behavior ends the fall-entry model without saying Steelhead left or died.",
  sourceNotes:
    "docs/onboarding/river-run/platte/runs/fall-steelhead.md; research corrected 2026-08-24.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "platte-fall-steelhead-release-audit-v1",
    notes:
      "Owner accepted the reviewed run and production release on 2026-08-25.",
  },
};

export const PLATTE_CONFIGURATION_DOCUMENT: RiverRunConfigurationDocument = {
  schemaVersion: "river-run-config-v1",
  configVersion: "2026-08-25-platte-release.1",
  movementEngineVersion: [
    getMovementEngineDefinition("fall_cooling").version,
    getMovementEngineDefinition("fall_entry_cooling").version,
  ].join("+"),
  river: PLATTE_RIVER_PROFILE,
  biologyProfiles: [
    GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
    GREAT_LAKES_COHO_BIOLOGY_PROFILE,
    GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
  ],
  runs: [
    PLATTE_FALL_CHINOOK_RUN_PROFILE,
    PLATTE_FALL_COHO_RUN_PROFILE,
    PLATTE_FALL_STEELHEAD_RUN_PROFILE,
  ],
};
