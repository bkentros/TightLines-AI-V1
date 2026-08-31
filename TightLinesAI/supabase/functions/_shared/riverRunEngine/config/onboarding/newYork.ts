import type {
  AuditedRiverRunProfile,
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
} from "../speciesBiology.ts";
import { buildWeatherOnlyActivity } from "./weatherOnlyActivity.ts";

const ACTIVE_SLOTS = [
  "00:00",
  "04:00",
  "08:00",
  "12:00",
  "16:00",
  "20:00",
  "21:00",
];
const NY_RULE_COPY =
  "Lake Ontario tributary rules vary by reach and season. Check current NYSDEC Great Lakes tributary regulations, posted boundaries, and access restrictions before fishing.";

const unavailableTemperature = {
  status: "unavailable" as const,
  notes:
    "No compatible live measured-water-temperature source is accepted in the configured migratory corridor.",
};

export const SALMON_NY_RIVER_PROFILE: RiverProfile = {
  riverId: "salmon_ny",
  displayName: "Salmon River",
  state: "NY",
  region: "great_lakes",
  timezone: "America/New_York",
  mouthLat: 43.573,
  mouthLon: -76.204,
  hydraulicSources: [{
    sourceId: "salmon_ny_pineville_usgs",
    provider: "USGS",
    siteId: "04250200",
    name: "Salmon River at Pineville, NY",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 33,
    maxAgeHours: 2,
    reachQuality: "good",
    reachNotes:
      "The Pineville station represents the regulated middle/upper mainstem below Lighthouse Hill Reservoir. It is not a reading for the estuary, Lake Ontario, tributaries, or reservoir.",
  }],
  waterTemperatureSources: [],
  fishCountSources: [],
  weatherPoints: [{
    weatherPointId: "salmon_ny_pineville_weather",
    lat: 43.531,
    lon: -76.038,
    role: "primary",
  }],
  foundation: {
    version: "salmon-ny-foundation-v1-owner-review",
    corridorLengthMiles: 17,
    downstreamTerminus: "Lake Ontario mouth at Port Ontario",
    upstreamTerminus: "Lighthouse Hill Reservoir tailrace above Altmar",
    targetSpecies: [
      "chinook_salmon",
      "coho_salmon",
      "steelhead",
      "lake_run_brown_trout",
    ],
    reaches: [
      {
        reachId: "salmon_ny_lower",
        displayName: "Lower Salmon — Port Ontario to Pulaski",
        order: 1,
        role: "lower",
        gaugeRepresented: false,
        notes: "Estuary and lower-river entry corridor.",
        sourceNotes:
          "NYSDEC Salmon River place page and Public Fishing Rights brochure, checked 2026-08-31.",
      },
      {
        reachId: "salmon_ny_middle",
        displayName: "Middle Salmon — Pulaski to Pineville",
        order: 2,
        role: "middle",
        gaugeRepresented: true,
        notes: "Main public corridor approaching the Pineville station.",
        sourceNotes:
          "NYSDEC Salmon River PFR material and USGS 04250200 metadata.",
      },
      {
        reachId: "salmon_ny_upper",
        displayName: "Upper Salmon — Pineville to Lighthouse Hill tailrace",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Includes Altmar and the separately regulated fly-fishing sections; the reservoir is outside the corridor.",
        sourceNotes:
          "NYSDEC special regulations, Salmon River management plan, and USGS 04250200.",
      },
    ],
    locations: [{
      locationId: "salmon_ny_lighthouse_hill",
      officialName: "Lighthouse Hill Reservoir dam and tailrace",
      aliases: ["Lighthouse Hill Dam"],
      state: "NY",
      latitude: 43.523,
      longitude: -75.988,
      coordinateSource:
        "NYSDEC Salmon River PFR/regulation mapping; orientation only",
      coordinateStatus: "provisional",
      reachId: "salmon_ny_upper",
      kind: "barrier",
      fishPassage: "impassable",
      publicUpstreamLimit: true,
      publicAccess: "restricted",
      fishingSuitability: { bank: "limited", wading: "limited", boat: "no" },
      beginnerSuitable: false,
      restrictionNotes:
        "The marked Upper Fly Section ends at the tailrace; posted hatchery-property and seasonal rules control access.",
      sourceNotes:
        "NYSDEC Great Lakes tributary special regulations and Salmon River PFR brochure, checked 2026-08-31.",
    }],
    primaryGaugeReachId: "salmon_ny_middle",
    contextualGaugeSiteIds: [],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "salmon_ny_pineville_weather",
      basinRepresentation:
        "Pineville weather represents broad mainstem light and precipitation context only.",
      sourceNotes:
        "Open-Meteo production provider; point colocated with the accepted USGS reach.",
    },
    stateRegulations: [{
      state: "NY",
      version: "ny-lake-ontario-tributaries-2026-08-31-review",
      jurisdiction: "NYSDEC Salmon River and tributaries",
      reminderCopy: NY_RULE_COPY,
      accessAndSafetyNotes:
        "Night-fishing, terminal-tackle, fly-section, hatchery-property, and seasonal restrictions differ by marked reach.",
      sourceNotes:
        "NYSDEC Great Lakes and Tributaries Special Regulations, checked 2026-08-31; recheck immediately before release.",
    }],
    evidenceNotes:
      "The supported corridor is the 17-mile Lake Ontario-to-Lighthouse Hill mainstem. Chinook, coho, fall-entry Washington-strain steelhead, and fall lake-run Brown Trout are independent profiles. The discontinued Skamania summer program and spring-entry/spawn phase are not merged into fall Steelhead. Atlantic Salmon remains engine-gated and hidden rather than being merged with another salmonid.",
  },
  conditionRefreshSchedule: {
    activeSlots: ACTIVE_SLOTS,
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "USGS 04250200 returned 15-minute discharge and gage height on 2026-08-31; parameter 00010 returned no observations.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: unavailableTemperature,
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Flow and height are live at Pineville and describe the regulated middle/upper mainstem only. No representative live water-temperature sensor is accepted, and the reading does not describe the estuary, tributaries, or reservoir.",
  regulationReminderCopy: NY_RULE_COPY,
};

export const OAK_ORCHARD_RIVER_PROFILE: RiverProfile = {
  riverId: "oak_orchard",
  displayName: "Oak Orchard Creek",
  state: "NY",
  region: "great_lakes",
  timezone: "America/New_York",
  mouthLat: 43.373,
  mouthLon: -78.191,
  hydraulicSources: [{
    sourceId: "oak_orchard_shelby_usgs",
    provider: "USGS",
    siteId: "04220045",
    name: "Oak Orchard Creek near Shelby, NY",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 17,
    maxAgeHours: 2,
    reachQuality: "acceptable",
    reachNotes:
      "Context only: the Shelby station is roughly 20 river miles upstream of the Point Breeze-to-Waterport migratory corridor and is separated from it by the Erie Canal crossing, Waterport Reservoir, and Waterport Dam. It is not a tailrace or lower-creek reading.",
  }],
  waterTemperatureSources: [{
    sourceId: "oak_orchard_shelby_temperature",
    provider: "USGS",
    siteId: "04220045",
    name: "Oak Orchard Creek near Shelby — measured water temperature",
    role: "primary",
    priority: 1,
    sourceType: "nearby_gauge",
    maxAgeHours: 2,
    smoothingWindowHours: 3,
    minValidF: 30,
    maxValidF: 90,
    maxRateChangeFPerHour: 4,
    maxPeerDifferenceF: 6,
    reachNotes:
      "Context only at Shelby, upstream of the Erie Canal crossing, Waterport Reservoir, and Waterport Dam. It must not be labeled as tailrace, lower-creek, or fish-holding water temperature.",
    attribution:
      "U.S. Geological Survey Water Data for the Nation; recent readings are provisional and subject to revision.",
  }],
  fishCountSources: [],
  weatherPoints: [{
    weatherPointId: "oak_orchard_waterport_weather",
    lat: 43.321,
    lon: -78.252,
    role: "primary",
  }],
  foundation: {
    version: "oak-orchard-foundation-v1-owner-review",
    corridorLengthMiles: 5.9,
    downstreamTerminus: "Lake Ontario mouth at Point Breeze",
    upstreamTerminus: "Waterport Dam tailrace",
    targetSpecies: [
      "chinook_salmon",
      "coho_salmon",
      "steelhead",
      "lake_run_brown_trout",
    ],
    reaches: [
      {
        reachId: "oak_orchard_lower",
        displayName: "Lower Oak Orchard — Point Breeze to Route 18",
        order: 1,
        role: "lower",
        gaugeRepresented: false,
        notes: "Harbor and lower creek entry corridor.",
        sourceNotes:
          "NYSDEC Oak Orchard PFR map and I FISH NY Great Lakes guide.",
      },
      {
        reachId: "oak_orchard_middle",
        displayName: "Middle Oak Orchard — Route 18 to Park Avenue area",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes: "Public-rights corridor below Waterport.",
        sourceNotes:
          "NYSDEC Oak Orchard PFR map and seasonal tributary regulation boundaries.",
      },
      {
        reachId: "oak_orchard_upper",
        displayName: "Upper Oak Orchard — Park Avenue area to Waterport Dam",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Terminal tailwater corridor; the reservoir is excluded and the upstream Shelby gauge is displayed only as separately labeled watershed context.",
        sourceNotes:
          "NYSDEC Oak Orchard PFR map, Waterport Reservoir report, and USGS 04220045 metadata.",
      },
    ],
    locations: [{
      locationId: "oak_orchard_waterport_dam",
      officialName: "Waterport Dam",
      aliases: ["Lake Alice Dam", "Waterport Reservoir Dam"],
      state: "NY",
      latitude: 43.32,
      longitude: -78.25,
      coordinateSource: "NYSDEC Oak Orchard PFR map; orientation only",
      coordinateStatus: "provisional",
      reachId: "oak_orchard_upper",
      kind: "barrier",
      fishPassage: "impassable",
      publicUpstreamLimit: true,
      publicAccess: "verified",
      fishingSuitability: { bank: "yes", wading: "limited", boat: "no" },
      beginnerSuitable: false,
      restrictionNotes:
        "Use marked PFR access only; high-water overflow-channel stranding and private-property boundaries are material limitations.",
      sourceNotes:
        "NYSDEC Oak Orchard PFR map and Lake Ontario sportfish restoration plan.",
    }],
    primaryGaugeReachId: null,
    contextualGaugeSiteIds: ["04220045"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "oak_orchard_waterport_weather",
      basinRepresentation:
        "Waterport-area weather supplies light and precipitation context only.",
      sourceNotes:
        "Open-Meteo production provider; point selected in the terminal migratory corridor.",
    },
    stateRegulations: [{
      state: "NY",
      version: "ny-lake-ontario-tributaries-2026-08-31-review",
      jurisdiction: "NYSDEC Oak Orchard Creek",
      reminderCopy: NY_RULE_COPY,
      accessAndSafetyNotes:
        "Seasonal tributary gear/hour rules apply in the named power-line-to-Waterport reach; PFR does not authorize use beyond marked easements.",
      sourceNotes:
        "NYSDEC Great Lakes and Tributaries Special Regulations and Oak Orchard PFR map, checked 2026-08-31.",
    }],
    evidenceNotes:
      "Waterport Dam is the conservative endpoint. Chinook, coho, fall-entry Steelhead, and fall lake-run Brown Trout are independent profiles. USGS 04220045 at Shelby is accepted only as transparently labeled upstream watershed context; the reservoir and dam prevent it from representing or scoring the migratory corridor. Atlantic Salmon remains engine-gated and hidden.",
  },
  conditionRefreshSchedule: {
    activeSlots: ACTIVE_SLOTS,
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "USGS 04220045 supplies current 15-minute flow, height, and measured temperature as upstream context only. It remains excluded from Activity and Fishing Shape across Waterport Reservoir and Dam.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Live flow, height, and measured temperature are from USGS Shelby, roughly 20 river miles upstream and separated from the fishing corridor by the Erie Canal crossing, Waterport Reservoir, and Waterport Dam. They are upstream watershed context only—not tailrace conditions—and do not drive Activity or Fishing Shape.",
  regulationReminderCopy: NY_RULE_COPY,
};

export const LOWER_GENESEE_RIVER_PROFILE: RiverProfile = {
  riverId: "lower_genesee",
  displayName: "Lower Genesee River",
  state: "NY",
  region: "great_lakes",
  timezone: "America/New_York",
  mouthLat: 43.259,
  mouthLon: -77.598,
  hydraulicSources: [{
    sourceId: "lower_genesee_ford_street_usgs",
    provider: "USGS",
    siteId: "04231600",
    name: "Genesee River at Ford Street Bridge, Rochester, NY",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 121,
    maxAgeHours: 2,
    reachQuality: "acceptable",
    reachNotes:
      "Context only: Ford Street is upstream of High, Middle, and Lower Falls and the lower migratory corridor. The long discharge record has station-name/site transitions, and intervening falls, hydropower operations, and urban routing prevent this reading from being treated as lower-gorge or harbor conditions.",
  }],
  waterTemperatureSources: [{
    sourceId: "lower_genesee_ford_street_temperature",
    provider: "USGS",
    siteId: "04231600",
    name: "Genesee River at Ford Street Bridge — measured water temperature",
    role: "primary",
    priority: 1,
    sourceType: "nearby_gauge",
    maxAgeHours: 2,
    smoothingWindowHours: 3,
    minValidF: 30,
    maxValidF: 90,
    maxRateChangeFPerHour: 4,
    maxPeerDifferenceF: 6,
    reachNotes:
      "Context only at Ford Street, upstream of all three Rochester falls. It is not a measurement of the Lower Falls tailwater, gorge, harbor, or Lake Ontario mixing zone.",
    attribution:
      "U.S. Geological Survey Water Data for the Nation; recent readings are provisional and subject to revision.",
  }],
  fishCountSources: [],
  weatherPoints: [{
    weatherPointId: "lower_genesee_rochester_weather",
    lat: 43.197,
    lon: -77.617,
    role: "primary",
  }],
  foundation: {
    version: "lower-genesee-foundation-v1-owner-review",
    corridorLengthMiles: 6.5,
    downstreamTerminus: "Lake Ontario mouth at Charlotte",
    upstreamTerminus: "natural Lower Falls above Driving Park Avenue",
    targetSpecies: [
      "chinook_salmon",
      "steelhead",
      "lake_run_brown_trout",
    ],
    reaches: [
      {
        reachId: "lower_genesee_harbor",
        displayName: "Genesee Harbor — Lake Ontario to Route 104",
        order: 1,
        role: "lower",
        gaugeRepresented: false,
        notes: "Navigable lower-river and harbor corridor.",
        sourceNotes:
          "NYSDEC Lower Genesee PFR brochure and Rochester Embayment records.",
      },
      {
        reachId: "lower_genesee_gorge",
        displayName: "Lower Gorge — Route 104 to Seth Green",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes: "Urban gorge approach to the public fishing area.",
        sourceNotes:
          "NYSDEC PFR brochure and City of Rochester Lower Falls Park.",
      },
      {
        reachId: "lower_genesee_falls",
        displayName: "Lower Falls terminal — Seth Green to Lower Falls",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Terminal salmonid concentration corridor below the natural falls.",
        sourceNotes:
          "NYSDEC PFR brochure and 2024 Rochester Embayment aesthetics report.",
      },
    ],
    locations: [{
      locationId: "lower_genesee_lower_falls",
      officialName: "Lower Falls",
      aliases: ["Genesee Lower Falls"],
      state: "NY",
      latitude: 43.197,
      longitude: -77.617,
      coordinateSource:
        "NYSDEC Lower Genesee PFR brochure and City of Rochester park record; orientation only",
      coordinateStatus: "provisional",
      reachId: "lower_genesee_falls",
      kind: "barrier",
      fishPassage: "impassable",
      publicUpstreamLimit: true,
      publicAccess: "verified",
      fishingSuitability: { bank: "yes", wading: "no", boat: "no" },
      beginnerSuitable: false,
      restrictionNotes:
        "Steep gorge, high flow, slippery banks, and seasonal fishing hours require conservative access treatment.",
      sourceNotes:
        "NYSDEC identifies Lower Falls as the first natural impassable barrier; Seth Green is the source-listed public fishing area.",
    }],
    primaryGaugeReachId: null,
    contextualGaugeSiteIds: ["04231600"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "lower_genesee_rochester_weather",
      basinRepresentation:
        "Lower Falls-area weather supplies urban lower-corridor light and precipitation context only.",
      sourceNotes:
        "Open-Meteo production provider; point selected at the terminal corridor.",
    },
    stateRegulations: [{
      state: "NY",
      version: "ny-lake-ontario-tributaries-2026-08-31-review",
      jurisdiction: "NYSDEC Lower Genesee River",
      reminderCopy: NY_RULE_COPY,
      accessAndSafetyNotes:
        "Seasonal tributary rules specifically name Route 104 to Lower Falls; gorge hazards and posted access controls remain separate.",
      sourceNotes:
        "NYSDEC Great Lakes and Tributaries Special Regulations and Lower Genesee PFR brochure, checked 2026-08-31.",
    }],
    evidenceNotes:
      "The natural Lower Falls is the complete species endpoint for v2. Chinook, fall-entry Steelhead, and fall lake-run Brown Trout are independent profiles. Ford Street is accepted only as transparently labeled upstream-basin context and cannot represent or score this corridor; discontinued USGS 04232000 is not presented as live. Coho and Atlantic Salmon remain research-unresolved and hidden.",
  },
  conditionRefreshSchedule: {
    activeSlots: ACTIVE_SLOTS,
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "USGS 04231600 supplies current 15-minute flow, height, and measured temperature as upstream-basin context only. The discontinued 04232000 record is never presented as live, and Ford Street remains excluded from Activity and Fishing Shape.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Live flow, height, and measured temperature are from USGS Ford Street, upstream of High, Middle, and Lower Falls. They are upstream-basin context only—not Lower Falls tailwater, gorge, or harbor conditions—and do not drive Activity or Fishing Shape. Discontinued USGS 04232000 is not shown as live.",
  regulationReminderCopy: NY_RULE_COPY,
};

const capabilities: AuditedRiverRunProfile["primitiveCapabilities"] = {
  migrationStage: { status: "available" },
  activity: { status: "available" },
  fishInRiver: { status: "available" },
  fishability: {
    status: "unavailable",
    reason: "no_accepted_historical_baseline",
    notes:
      "No owner-accepted reach-specific absolute Fishing Shape bands exist.",
  },
  migrationTiming: {
    status: "unavailable",
    reason: "no_accepted_historical_baseline",
    notes: "The current product does not expose live migration timing.",
  },
  push: {
    status: "unavailable",
    reason: "no_accepted_water_temperature_source",
    notes:
      "The current product does not expose Push and no compatible live water-temperature source is accepted.",
  },
};

const hiddenAudit = {
  isEnabled: false,
  auditVersion: "new-york-owner-review-v1",
  notes:
    "Hidden owner-review configuration only. Public enablement and deployment require rendered acceptance, current regulation recheck, and explicit owner authorization.",
};

function presence(
  maximum: HistoricalPresenceConfig["maximum"],
  scope: HistoricalPresenceConfig["distributionScope"],
  version: string,
  anchors: HistoricalPresenceConfig["anchors"],
  evidenceNotes: string,
): HistoricalPresenceConfig {
  return {
    maximum,
    distributionScope: scope,
    curveVersion: version,
    anchors,
    evidenceNotes,
    sourceNotes:
      "NYSDEC river pages/PFR records, 2022-2026 Lake Ontario stocking strategy, 2023 annual report, tributary fishery guidance, and river-specific dossier.",
  };
}

function weatherActivity(
  input: {
    runId: string;
    profile:
      | "chinook_fall_reaction"
      | "coho_fall_reaction"
      | "steelhead_feeding"
      | "brown_trout_fall_reaction";
    reachIds: string[];
    weatherPointId: string;
    peakEnd: string;
    taperingEnd: string;
    lateEnd: string;
    excluded: string;
  },
) {
  const salmon = input.profile === "chinook_fall_reaction" ||
    input.profile === "coho_fall_reaction";
  const steelhead = input.profile === "steelhead_feeding";
  const brownTrout = input.profile === "brown_trout_fall_reaction";
  const activity = buildWeatherOnlyActivity({
    version: `${input.runId}-weather-activity-${
      steelhead ? "v4-stage-shape" : brownTrout ? "v3-stage-shape" : "v1"
    }-owner-review`,
    profile: input.profile,
    reachIds: input.reachIds,
    weatherPointId: input.weatherPointId,
    inputNotes: input.excluded,
    scopeCopy:
      "This Limited weather-only read estimates conditional responsiveness from modeled light and same-block precipitation. It does not measure water temperature, river response, migration, abundance, or angler outcome.",
    stageResponseAdjustment: salmon
      ? { pre_run: -5, beginning: -5 }
      : steelhead
      ? { peak: 2, ending: -1, post_run: -1 }
      : brownTrout
      ? { peak: 5, tapering: -1, ending: -2, post_run: -2 }
      : undefined,
    stageResponseMaximum: steelhead || brownTrout ? 69 : undefined,
    ...(salmon
      ? {
        lifecycle: {
          peakEnd: input.peakEnd,
          taperingEnd: input.taperingEnd,
          endingEnd: input.lateEnd,
        },
      }
      : {}),
    evidenceNotes:
      "River/run-specific owner-review calibration. Only hourly light and same-block precipitation are inputs; excluded gauges, air temperature, counts, Stage, and Presence provide no environmental credit. The repeat-spawning Brown Trout profile uses a five-point Peak response plus modest one- and two-point post-peak stage reductions so the historical weather-only replay preserves the evidence-supported November crest without adding a salmon mortality curve or assuming post-spawn death.",
  });
  if (input.profile === "coho_fall_reaction") {
    activity.caps.ending = 49;
    activity.evidenceNotes +=
      " The coho Ending constraint is 49 so the researched short terminal calendar remains continuous without extending biological presence to satisfy scoring mechanics.";
  }
  if (steelhead) {
    activity.caps.weatherOnlyMaximum = 69;
    activity.caps.weatherOnlyTomorrowMaximum = 69;
    activity.evidenceNotes +=
      " Because measured water temperature—the primary response driver—is absent, the Limited weather-only model has a true 69-point maximum and cannot claim Highly active. A bounded two-point Peak response correction prevents shorter late-fall daylight from making the unshaped Ending or post-run period look stronger than the researched core fall-entry window. Tapering, Ending, and post-run receive identical zero adjustment; no mortality, forced departure, or winter-absence claim is introduced.";
  }
  if (brownTrout) {
    activity.caps.weatherOnlyMaximum = 69;
    activity.caps.weatherOnlyTomorrowMaximum = 69;
    activity.evidenceNotes +=
      " Because measured water temperature—the primary response driver—is absent, the Limited weather-only model has a true 69-point maximum and cannot claim Highly active. A bounded five-point Peak response correction preserves the NYSDEC November tributary-catch peak without a salmon mortality curve or a forced post-spawn departure assumption.";
  }
  return activity;
}

function baseRun(input: {
  runId: string;
  riverId: string;
  biologyProfileId: string;
  displayName: string;
  species:
    | "chinook_salmon"
    | "coho_salmon"
    | "steelhead"
    | "lake_run_brown_trout";
  profile:
    | "chinook_fall_reaction"
    | "coho_fall_reaction"
    | "steelhead_feeding"
    | "brown_trout_fall_reaction";
  reaches: string[];
  weatherPointId: string;
  runWindow: AuditedRiverRunProfile["runWindow"];
  historicalPresence: HistoricalPresenceConfig;
  excluded: string;
  dossier: string;
}): AuditedRiverRunProfile {
  const steelhead = input.species === "steelhead";
  const brownTrout = input.species === "lake_run_brown_trout";
  return {
    runId: input.runId,
    riverId: input.riverId,
    biologyProfileId: input.biologyProfileId,
    displayName: input.displayName,
    species: input.species,
    season: "fall",
    runType: steelhead
      ? "fall_entry"
      : brownTrout
      ? "fall_repeat_spawn"
      : "fall_spawn",
    movementEngineId: steelhead
      ? "fall_entry_cooling"
      : brownTrout
      ? "fall_repeat_spawner_cooling"
      : "fall_cooling",
    runStageCopyStrategy: "onboarding_corridor",
    primitiveCapabilities: {
      ...capabilities,
      fishability: input.riverId === "salmon_ny"
        ? capabilities.fishability
        : {
          status: "unavailable",
          reason: "no_accepted_hydraulic_source",
          notes:
            "The displayed hydraulic source is context-only outside the migratory corridor, so no corridor Fishing Shape calibration is permitted.",
        },
    },
    runWindow: input.runWindow,
    historicalPresence: input.historicalPresence,
    activity: weatherActivity({
      runId: input.runId,
      profile: input.profile,
      reachIds: input.reaches,
      weatherPointId: input.weatherPointId,
      peakEnd: input.runWindow.peakEnd,
      taperingEnd: input.runWindow.taperingEnd,
      lateEnd: input.runWindow.lateEnd,
      excluded: input.excluded,
    }),
    researchNotes: steelhead
      ? "This profile covers the independently evidenced fall-entry Steelhead phase only. Winter holding and the separate March-April spring-entry/spawn phase are not relabeled as this run."
      : brownTrout
      ? "This profile covers the independently evidenced fall lake-run Brown Trout spawning migration. Brown Trout are repeat spawners; the terminal state does not claim mortality, universal departure, or winter absence."
      : "Fall spawning run researched independently for this river; dates, strength, and endpoint are not inherited from another river or species.",
    sourceNotes: input.dossier,
    publicAudit: hiddenAudit,
  };
}

const salmonReaches = [
  "salmon_ny_lower",
  "salmon_ny_middle",
  "salmon_ny_upper",
];
const oakReaches = [
  "oak_orchard_lower",
  "oak_orchard_middle",
  "oak_orchard_upper",
];
const geneseeReaches = [
  "lower_genesee_harbor",
  "lower_genesee_gorge",
  "lower_genesee_falls",
];

export const SALMON_NY_FALL_CHINOOK_RUN_PROFILE = baseRun({
  runId: "salmon_ny_fall_chinook",
  riverId: "salmon_ny",
  biologyProfileId: "great_lakes_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  profile: "chinook_fall_reaction",
  reaches: salmonReaches,
  weatherPointId: "salmon_ny_pineville_weather",
  runWindow: {
    preRunStart: "08-01",
    stagingStart: "08-15",
    start: "08-25",
    beginningEnd: "09-05",
    buildingEstablishedStart: "09-06",
    buildingBroadStart: "09-15",
    peakStart: "09-20",
    peak: "10-01",
    peakEnd: "10-15",
    taperingEnd: "10-25",
    end: "11-01",
    lateEnd: "11-10",
    postRunLateCopyEnd: "11-15",
  },
  historicalPresence: presence(
    10,
    "broad",
    "salmon-ny-chinook-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 12, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 27, fractionOfMaximum: .65 },
      { dayOffsetFromStart: 37, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 51, fractionOfMaximum: .85 },
      { dayOffsetFromStart: 61, fractionOfMaximum: .35 },
      { dayOffsetFromStart: 68, fractionOfMaximum: .1 },
      { dayOffsetFromStart: 77, fractionOfMaximum: 0 },
    ],
    "NYSDEC documents late-August entry, increasing September returns, peak spawning in the first two October weeks, and a small November residual; the river is the system's primary broodstock and wild-production tributary.",
  ),
  excluded:
    "Pineville flow/height remain visible in Gauge Read, but the station has no current water temperature; hydraulics are excluded from Activity rather than paired with a proxy.",
  dossier: "docs/onboarding/river-run/salmon_ny/river-onboarding.md",
});

export const SALMON_NY_FALL_COHO_RUN_PROFILE = baseRun({
  runId: "salmon_ny_fall_coho",
  riverId: "salmon_ny",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  profile: "coho_fall_reaction",
  reaches: salmonReaches,
  weatherPointId: "salmon_ny_pineville_weather",
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "08-25",
    start: "09-05",
    beginningEnd: "09-15",
    buildingEstablishedStart: "09-16",
    buildingBroadStart: "09-25",
    peakStart: "10-01",
    peak: "10-08",
    peakEnd: "10-20",
    taperingEnd: "11-05",
    end: "11-12",
    lateEnd: "11-20",
    postRunLateCopyEnd: "11-25",
  },
  historicalPresence: presence(
    8,
    "sectional",
    "salmon-ny-coho-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 11, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 26, fractionOfMaximum: .7 },
      { dayOffsetFromStart: 33, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 45, fractionOfMaximum: .75 },
      { dayOffsetFromStart: 53, fractionOfMaximum: .3 },
      { dayOffsetFromStart: 59, fractionOfMaximum: .1 },
      { dayOffsetFromStart: 66, fractionOfMaximum: 0 },
    ],
    "NYSDEC identifies the same broad fall period as Chinook but a smaller, shorter run whose fish ascend rapidly, supporting a narrower independent curve.",
  ),
  excluded:
    "Pineville hydraulics remain unscored because no compatible measured water temperature exists.",
  dossier: "docs/onboarding/river-run/salmon_ny/river-onboarding.md",
});

export const SALMON_NY_FALL_STEELHEAD_RUN_PROFILE = baseRun({
  runId: "salmon_ny_fall_steelhead",
  riverId: "salmon_ny",
  biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
  displayName: "Fall-entry Steelhead",
  species: "steelhead",
  profile: "steelhead_feeding",
  reaches: salmonReaches,
  weatherPointId: "salmon_ny_pineville_weather",
  runWindow: {
    preRunStart: "09-20",
    stagingStart: "10-01",
    start: "10-20",
    beginningEnd: "10-31",
    buildingEstablishedStart: "11-01",
    buildingBroadStart: "11-10",
    peakStart: "11-15",
    peak: "11-25",
    peakEnd: "12-10",
    taperingEnd: "12-20",
    end: "12-28",
    lateEnd: "12-31",
    postRunLateCopyEnd: "01-02",
  },
  historicalPresence: presence(
    9,
    "broad",
    "salmon-ny-fall-steelhead-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 12, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 26, fractionOfMaximum: .65 },
      { dayOffsetFromStart: 36, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 56, fractionOfMaximum: .95 },
      { dayOffsetFromStart: 72, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 82, fractionOfMaximum: .82 },
      { dayOffsetFromStart: 92, fractionOfMaximum: .75 },
    ],
    "NYSDEC places dependable entry from late October through winter. This curve stops the fall-entry presentation while acknowledging fish remain; it does not model the separate spring pulse.",
  ),
  excluded:
    "Pineville hydraulics are excluded because a weather-only Activity model cannot silently combine flow without measured water temperature.",
  dossier: "docs/onboarding/river-run/salmon_ny/river-onboarding.md",
});

export const SALMON_NY_FALL_BROWN_TROUT_RUN_PROFILE = baseRun({
  runId: "salmon_ny_fall_brown_trout",
  riverId: "salmon_ny",
  biologyProfileId: "great_lakes_lake_run_brown_trout_v1",
  displayName: "Fall lake-run Brown Trout",
  species: "lake_run_brown_trout",
  profile: "brown_trout_fall_reaction",
  reaches: salmonReaches,
  weatherPointId: "salmon_ny_pineville_weather",
  runWindow: {
    preRunStart: "08-25",
    stagingStart: "09-05",
    start: "09-15",
    beginningEnd: "09-30",
    buildingEstablishedStart: "10-01",
    buildingBroadStart: "10-15",
    peakStart: "11-01",
    peak: "11-10",
    peakEnd: "11-20",
    taperingEnd: "12-05",
    end: "12-15",
    lateEnd: "12-20",
    postRunLateCopyEnd: "12-25",
  },
  historicalPresence: presence(
    5,
    "sectional",
    "salmon-ny-brown-trout-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 16, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 31, fractionOfMaximum: .55 },
      { dayOffsetFromStart: 47, fractionOfMaximum: .82 },
      { dayOffsetFromStart: 56, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 66, fractionOfMaximum: .82 },
      { dayOffsetFromStart: 82, fractionOfMaximum: .45 },
      { dayOffsetFromStart: 96, fractionOfMaximum: .2 },
    ],
    "NYSDEC identifies a mid-September-to-mid-November spawning entry, while the lakewide stocking strategy shows tributary catches increasing through October, peaking in November, and declining in late December. The 2022-23 survey estimated 1,671 Salmon River Brown Trout against a 6,284 long-term mean.",
  ),
  excluded:
    "Pineville hydraulics remain outside Activity because no compatible measured water temperature exists; this is not a resident-trout profile.",
  dossier: "docs/onboarding/river-run/salmon_ny/river-onboarding.md",
});

export const OAK_ORCHARD_FALL_CHINOOK_RUN_PROFILE = baseRun({
  runId: "oak_orchard_fall_chinook",
  riverId: "oak_orchard",
  biologyProfileId: "great_lakes_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  profile: "chinook_fall_reaction",
  reaches: oakReaches,
  weatherPointId: "oak_orchard_waterport_weather",
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "08-25",
    start: "09-05",
    beginningEnd: "09-20",
    buildingEstablishedStart: "09-21",
    buildingBroadStart: "10-01",
    peakStart: "10-08",
    peak: "10-15",
    peakEnd: "10-25",
    taperingEnd: "11-08",
    end: "11-15",
    lateEnd: "11-22",
    postRunLateCopyEnd: "11-27",
  },
  historicalPresence: presence(
    8,
    "sectional",
    "oak-orchard-chinook-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 16, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 33, fractionOfMaximum: .65 },
      { dayOffsetFromStart: 40, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 50, fractionOfMaximum: .85 },
      { dayOffsetFromStart: 58, fractionOfMaximum: .4 },
      { dayOffsetFromStart: 64, fractionOfMaximum: .12 },
      { dayOffsetFromStart: 71, fractionOfMaximum: 0 },
    ],
    "Current strategy allocates a major Chinook return to Oak Orchard; rain-dependent tributaries generally peak in mid-October, and recent NYSDEC minutes document good but extended returns.",
  ),
  excluded:
    "Shelby flow and temperature are upstream of Waterport Reservoir/Dam and excluded; Activity uses only Waterport-area weather.",
  dossier: "docs/onboarding/river-run/oak_orchard/river-onboarding.md",
});

export const OAK_ORCHARD_FALL_COHO_RUN_PROFILE = baseRun({
  runId: "oak_orchard_fall_coho",
  riverId: "oak_orchard",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  profile: "coho_fall_reaction",
  reaches: oakReaches,
  weatherPointId: "oak_orchard_waterport_weather",
  runWindow: {
    preRunStart: "08-25",
    stagingStart: "09-01",
    start: "09-10",
    beginningEnd: "09-25",
    buildingEstablishedStart: "09-26",
    buildingBroadStart: "10-05",
    peakStart: "10-12",
    peak: "10-20",
    peakEnd: "10-30",
    taperingEnd: "11-15",
    end: "11-22",
    lateEnd: "11-30",
    postRunLateCopyEnd: "12-05",
  },
  historicalPresence: presence(
    6,
    "sectional",
    "oak-orchard-coho-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 16, fractionOfMaximum: .22 },
      { dayOffsetFromStart: 32, fractionOfMaximum: .6 },
      { dayOffsetFromStart: 40, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 50, fractionOfMaximum: .8 },
      { dayOffsetFromStart: 58, fractionOfMaximum: .35 },
      { dayOffsetFromStart: 63, fractionOfMaximum: .1 },
      { dayOffsetFromStart: 69, fractionOfMaximum: 0 },
    ],
    "Oak Orchard receives the full western coho allocation and NYSDEC documented good recent returns, but its lower allocation and faster migration justify a lower, narrower ceiling than Chinook.",
  ),
  excluded:
    "The upstream Shelby station is not a tailwater proxy; weather-only inputs are explicit.",
  dossier: "docs/onboarding/river-run/oak_orchard/river-onboarding.md",
});

export const OAK_ORCHARD_FALL_STEELHEAD_RUN_PROFILE = baseRun({
  runId: "oak_orchard_fall_steelhead",
  riverId: "oak_orchard",
  biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
  displayName: "Fall-entry Steelhead",
  species: "steelhead",
  profile: "steelhead_feeding",
  reaches: oakReaches,
  weatherPointId: "oak_orchard_waterport_weather",
  runWindow: {
    preRunStart: "09-20",
    stagingStart: "10-01",
    start: "10-15",
    beginningEnd: "10-31",
    buildingEstablishedStart: "11-01",
    buildingBroadStart: "11-10",
    peakStart: "11-15",
    peak: "11-25",
    peakEnd: "12-10",
    taperingEnd: "12-20",
    end: "12-28",
    lateEnd: "12-31",
    postRunLateCopyEnd: "01-02",
  },
  historicalPresence: presence(
    8,
    "sectional",
    "oak-orchard-fall-steelhead-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 17, fractionOfMaximum: .3 },
      { dayOffsetFromStart: 32, fractionOfMaximum: .7 },
      { dayOffsetFromStart: 42, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 62, fractionOfMaximum: .95 },
      { dayOffsetFromStart: 78, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 88, fractionOfMaximum: .82 },
      { dayOffsetFromStart: 98, fractionOfMaximum: .75 },
    ],
    "NYSDEC ranks Oak Orchard third among Lake Ontario big-river Steelhead fisheries and supports season-long winter opportunity; this record covers only the fall-entry phase.",
  ),
  excluded:
    "Shelby measurements are separated by Waterport Dam and Reservoir and contribute zero.",
  dossier: "docs/onboarding/river-run/oak_orchard/river-onboarding.md",
});

export const OAK_ORCHARD_FALL_BROWN_TROUT_RUN_PROFILE = baseRun({
  runId: "oak_orchard_fall_brown_trout",
  riverId: "oak_orchard",
  biologyProfileId: "great_lakes_lake_run_brown_trout_v1",
  displayName: "Fall lake-run Brown Trout",
  species: "lake_run_brown_trout",
  profile: "brown_trout_fall_reaction",
  reaches: oakReaches,
  weatherPointId: "oak_orchard_waterport_weather",
  runWindow: {
    preRunStart: "09-01",
    stagingStart: "09-15",
    start: "10-01",
    beginningEnd: "10-15",
    buildingEstablishedStart: "10-16",
    buildingBroadStart: "11-01",
    peakStart: "11-05",
    peak: "11-15",
    peakEnd: "11-30",
    taperingEnd: "12-15",
    end: "12-25",
    lateEnd: "12-31",
    postRunLateCopyEnd: "01-05",
  },
  historicalPresence: presence(
    6,
    "sectional",
    "oak-orchard-brown-trout-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 15, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 31, fractionOfMaximum: .6 },
      { dayOffsetFromStart: 45, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 60, fractionOfMaximum: .85 },
      { dayOffsetFromStart: 75, fractionOfMaximum: .5 },
      { dayOffsetFromStart: 85, fractionOfMaximum: .28 },
      { dayOffsetFromStart: 91, fractionOfMaximum: .18 },
    ],
    "NYSDEC's lakewide tributary record places increasing Brown Trout catch through October and a November peak. Point Breeze received 35,000 Brown Trout in 2023, and the 2022-23 tributary survey estimated 3,488 Oak Orchard fish against a 7,906 long-term mean.",
  ),
  excluded:
    "The Shelby gauge remains excluded across Waterport Reservoir and Dam; this is a lake-run spawning profile, not a resident-creek estimate.",
  dossier: "docs/onboarding/river-run/oak_orchard/river-onboarding.md",
});

export const LOWER_GENESEE_FALL_CHINOOK_RUN_PROFILE = baseRun({
  runId: "lower_genesee_fall_chinook",
  riverId: "lower_genesee",
  biologyProfileId: "great_lakes_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  profile: "chinook_fall_reaction",
  reaches: geneseeReaches,
  weatherPointId: "lower_genesee_rochester_weather",
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "08-25",
    start: "09-05",
    beginningEnd: "09-20",
    buildingEstablishedStart: "09-21",
    buildingBroadStart: "10-01",
    peakStart: "10-08",
    peak: "10-15",
    peakEnd: "10-25",
    taperingEnd: "11-08",
    end: "11-15",
    lateEnd: "11-22",
    postRunLateCopyEnd: "11-27",
  },
  historicalPresence: presence(
    7,
    "concentrated",
    "lower-genesee-chinook-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 16, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 33, fractionOfMaximum: .65 },
      { dayOffsetFromStart: 40, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 50, fractionOfMaximum: .85 },
      { dayOffsetFromStart: 58, fractionOfMaximum: .4 },
      { dayOffsetFromStart: 64, fractionOfMaximum: .12 },
      { dayOffsetFromStart: 71, fractionOfMaximum: 0 },
    ],
    "Current strategy designates Genesee as the west-central Chinook staging/tributary fishery with 111,400 fish; the 6.5-mile natural-barrier corridor concentrates opportunity.",
  ),
  excluded:
    "Ford Street and Rochester stations are upstream of Lower Falls and contribute zero to the lower-river model.",
  dossier: "docs/onboarding/river-run/lower_genesee/river-onboarding.md",
});

export const LOWER_GENESEE_FALL_STEELHEAD_RUN_PROFILE = baseRun({
  runId: "lower_genesee_fall_steelhead",
  riverId: "lower_genesee",
  biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
  displayName: "Fall-entry Steelhead",
  species: "steelhead",
  profile: "steelhead_feeding",
  reaches: geneseeReaches,
  weatherPointId: "lower_genesee_rochester_weather",
  runWindow: {
    preRunStart: "09-20",
    stagingStart: "10-01",
    start: "10-15",
    beginningEnd: "10-31",
    buildingEstablishedStart: "11-01",
    buildingBroadStart: "11-10",
    peakStart: "11-15",
    peak: "11-25",
    peakEnd: "12-10",
    taperingEnd: "12-20",
    end: "12-28",
    lateEnd: "12-31",
    postRunLateCopyEnd: "01-02",
  },
  historicalPresence: presence(
    7,
    "concentrated",
    "lower-genesee-fall-steelhead-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 17, fractionOfMaximum: .3 },
      { dayOffsetFromStart: 32, fractionOfMaximum: .7 },
      { dayOffsetFromStart: 42, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 62, fractionOfMaximum: .95 },
      { dayOffsetFromStart: 78, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 88, fractionOfMaximum: .82 },
      { dayOffsetFromStart: 98, fractionOfMaximum: .75 },
    ],
    "NYSDEC ranks Genesee fourth among big-river Steelhead fisheries, with the highest relative catch-rate score in that group; the short corridor ends at Lower Falls.",
  ),
  excluded:
    "All active USGS measurements identified in this pass are upstream of the impassable falls and contribute zero.",
  dossier: "docs/onboarding/river-run/lower_genesee/river-onboarding.md",
});

export const LOWER_GENESEE_FALL_BROWN_TROUT_RUN_PROFILE = baseRun({
  runId: "lower_genesee_fall_brown_trout",
  riverId: "lower_genesee",
  biologyProfileId: "great_lakes_lake_run_brown_trout_v1",
  displayName: "Fall lake-run Brown Trout",
  species: "lake_run_brown_trout",
  profile: "brown_trout_fall_reaction",
  reaches: geneseeReaches,
  weatherPointId: "lower_genesee_rochester_weather",
  runWindow: {
    preRunStart: "09-05",
    stagingStart: "09-20",
    start: "10-05",
    beginningEnd: "10-20",
    buildingEstablishedStart: "10-21",
    buildingBroadStart: "11-05",
    peakStart: "11-10",
    peak: "11-20",
    peakEnd: "11-30",
    taperingEnd: "12-15",
    end: "12-25",
    lateEnd: "12-31",
    postRunLateCopyEnd: "01-05",
  },
  historicalPresence: presence(
    2,
    "concentrated",
    "lower-genesee-brown-trout-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 16, fractionOfMaximum: .22 },
      { dayOffsetFromStart: 31, fractionOfMaximum: .55 },
      { dayOffsetFromStart: 46, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 56, fractionOfMaximum: .82 },
      { dayOffsetFromStart: 71, fractionOfMaximum: .45 },
      { dayOffsetFromStart: 81, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 87, fractionOfMaximum: .15 },
    ],
    "The current NYSDEC lower-river record lists seasonal Lake Ontario Brown Trout, Rochester received 23,750 stocked Brown Trout in 2023, and the 2022-23 tributary survey estimated 241 fish. This supports a real but limited, concentrated run rather than erasing occurrence or borrowing Oak Orchard strength.",
  ),
  excluded:
    "Upstream Rochester gauges remain excluded above Lower Falls; the 2/10 ceiling reflects sparse direct lower-river opportunity evidence.",
  dossier: "docs/onboarding/river-run/lower_genesee/river-onboarding.md",
});

export const NEW_YORK_DRAFT_RIVERS = [
  SALMON_NY_RIVER_PROFILE,
  OAK_ORCHARD_RIVER_PROFILE,
  LOWER_GENESEE_RIVER_PROFILE,
];
export const NEW_YORK_DRAFT_RUNS = [
  SALMON_NY_FALL_CHINOOK_RUN_PROFILE,
  SALMON_NY_FALL_COHO_RUN_PROFILE,
  SALMON_NY_FALL_STEELHEAD_RUN_PROFILE,
  SALMON_NY_FALL_BROWN_TROUT_RUN_PROFILE,
  OAK_ORCHARD_FALL_CHINOOK_RUN_PROFILE,
  OAK_ORCHARD_FALL_COHO_RUN_PROFILE,
  OAK_ORCHARD_FALL_STEELHEAD_RUN_PROFILE,
  OAK_ORCHARD_FALL_BROWN_TROUT_RUN_PROFILE,
  LOWER_GENESEE_FALL_CHINOOK_RUN_PROFILE,
  LOWER_GENESEE_FALL_STEELHEAD_RUN_PROFILE,
  LOWER_GENESEE_FALL_BROWN_TROUT_RUN_PROFILE,
];

function documentFor(river: RiverProfile): RiverRunConfigurationDocument {
  const runs = NEW_YORK_DRAFT_RUNS.filter((run) =>
    run.riverId === river.riverId
  );
  const biologyIds = new Set(runs.map((run) => run.biologyProfileId));
  return {
    schemaVersion: "river-run-config-v1",
    configVersion: `2026-08-31-${river.riverId}-new-york-owner-review.2`,
    movementEngineVersion: [
      getMovementEngineDefinition("fall_cooling").version,
      getMovementEngineDefinition("fall_entry_cooling").version,
      getMovementEngineDefinition("fall_repeat_spawner_cooling").version,
    ].join("+"),
    river,
    biologyProfiles: [
      GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
      GREAT_LAKES_COHO_BIOLOGY_PROFILE,
      GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
      GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE,
    ].filter((profile) => biologyIds.has(profile.biologyProfileId)),
    runs,
  };
}

export const SALMON_NY_CONFIGURATION_DOCUMENT = documentFor(
  SALMON_NY_RIVER_PROFILE,
);
export const OAK_ORCHARD_CONFIGURATION_DOCUMENT = documentFor(
  OAK_ORCHARD_RIVER_PROFILE,
);
export const LOWER_GENESEE_CONFIGURATION_DOCUMENT = documentFor(
  LOWER_GENESEE_RIVER_PROFILE,
);
export const NEW_YORK_DRAFT_CONFIGURATION_DOCUMENTS = [
  SALMON_NY_CONFIGURATION_DOCUMENT,
  OAK_ORCHARD_CONFIGURATION_DOCUMENT,
  LOWER_GENESEE_CONFIGURATION_DOCUMENT,
];
