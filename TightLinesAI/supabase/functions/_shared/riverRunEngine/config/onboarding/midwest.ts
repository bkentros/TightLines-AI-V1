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
} from "../speciesBiology.ts";
import { buildWeatherOnlyActivity } from "./weatherOnlyActivity.ts";

const ACTIVE_SLOTS = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "21:00"];
const IN_RULES = "Trail Creek has seasonal and barrier-area restrictions. Check current Indiana Lake Michigan rules, posted barrier boundaries, licenses, property access, and local safety conditions before fishing.";
const WI_RULES = "From Sept. 15 through the first Saturday in May, Lake Michigan tributary night-fishing restrictions apply. Check current Wisconsin rules, posted weir/refuge boundaries, licenses, property access, and local safety conditions before fishing.";

export const TRAIL_CREEK_RIVER_PROFILE: RiverProfile = {
  riverId: "trail_creek",
  displayName: "Trail Creek",
  state: "IN",
  region: "great_lakes",
  timezone: "America/Chicago",
  mouthLat: 41.724,
  mouthLon: -86.904,
  hydraulicSources: [{
    sourceId: "trail_creek_springland_usgs",
    provider: "USGS",
    siteId: "04095300",
    name: "Trail Creek at Michigan City — Springland Avenue",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 39,
    maxAgeHours: 2,
    reachQuality: "good",
    reachNotes: "Measured at Springland Avenue in the barrier corridor. It represents that middle reach, not the harbor or the upper forks.",
  }],
  waterTemperatureSources: [{
    sourceId: "trail_creek_springland_temperature",
    provider: "USGS",
    siteId: "04095300",
    name: "Trail Creek at Michigan City — measured water temperature",
    role: "primary",
    priority: 1,
    sourceType: "same_gauge",
    maxAgeHours: 2,
    smoothingWindowHours: 3,
    minValidF: 30,
    maxValidF: 90,
    maxRateChangeFPerHour: 4,
    maxPeerDifferenceF: 6,
    historicalStartYear: 2025,
    historicalEndYear: 2026,
    reachNotes: "Co-located with the Springland hydraulic station; it does not measure the harbor or upper forks.",
    attribution: "U.S. Geological Survey Water Data for the Nation; recent readings are provisional and subject to revision.",
  }],
  weatherPoints: [{ weatherPointId: "trail_creek_springland_weather", lat: 41.7166821, lon: -86.8597129, role: "primary" }],
  foundation: {
    version: "trail-creek-foundation-v1-owner-review",
    corridorLengthMiles: 10.5,
    downstreamTerminus: "Trail Creek mouth at Michigan City harbor",
    upstreamTerminus: "Creek Ridge Park and the publicly mapped upper Trail Creek access corridor",
    targetSpecies: ["chinook_salmon", "coho_salmon"],
    reaches: [
      { reachId: "trail_creek_lower_city", displayName: "Lower City — mouth to U.S. 12", order: 1, role: "downstream", gaugeRepresented: false, notes: "Harbor-transition and lower-city entry water; the Springland gauge is upstream.", sourceNotes: "Indiana DNR Lake Michigan shoreline and tributary guide, pp. 4 and 19." },
      { reachId: "trail_creek_barrier_corridor", displayName: "Barrier Corridor — U.S. 12 to Trail Creek Forks", order: 2, role: "middle", gaugeRepresented: true, notes: "Contains the Springland station and sea-lamprey barrier/fishway. The statutory no-fishing boundary and posted operations control access.", sourceNotes: "Indiana DNR Lake Michigan guide p. 9; USGS 04095300 metadata; current Indiana regulations." },
      { reachId: "trail_creek_upper_access", displayName: "Upper Access — Trail Creek Forks to Creek Ridge Park", order: 3, role: "terminal", gaugeRepresented: false, notes: "Publicly named upper access corridor; most tributary frontage remains private and section naming is not blanket access permission.", sourceNotes: "Indiana DNR Lake Michigan fishing page and guide p. 4." },
    ],
    primaryGaugeReachId: "trail_creek_barrier_corridor",
    contextualGaugeSiteIds: [],
    weatherStrategy: { mode: "single_point", primaryWeatherPointId: "trail_creek_springland_weather", basinRepresentation: "Modeled weather at Springland supports only the station reach and broad corridor context.", sourceNotes: "Open-Meteo point paired to USGS 04095300." },
    stateRegulations: [{ state: "IN", version: "indiana-2026-2027-lake-michigan", jurisdiction: "Indiana DNR Lake Michigan and tributary regulations", reminderCopy: IN_RULES, accessAndSafetyNotes: "Do not fish within the current prohibited Springland barrier reach. Named sites do not imply access across adjoining private property or safe wading.", sourceNotes: "Indiana DNR current Lake Michigan regulations and fishing guide; recheck at release." }],
    evidenceNotes: "Official Indiana sources establish recurring Chinook and coho returns, ten named public fishing sites, and the Springland barrier/fishway. Steelhead strains and brown-trout occurrence were evaluated separately and not converted into unsupported fall products.",
  },
  conditionRefreshSchedule: { activeSlots: ACTIVE_SLOTS, inactiveSlots: ["00:00"], evidenceNotes: "Flow, height, and temperature resolve independently at the co-located Springland station. Stale or invalid metrics fail closed and recover on a later valid reading." },
  conditionDataCapabilities: { hydraulics: { status: "available" }, waterTemperature: { status: "available" } },
  supportStatus: "beta",
  gaugeLimitationCopy: "Measured at Springland Avenue in the barrier corridor. It does not directly represent Michigan City harbor, the mouth, or the upper forks, and it is not proof of fish passage through the operated barrier.",
  regulationReminderCopy: IN_RULES,
};

export const KEWAUNEE_RIVER_PROFILE: RiverProfile = {
  riverId: "kewaunee_river",
  displayName: "Kewaunee River",
  state: "WI",
  region: "great_lakes",
  timezone: "America/Chicago",
  mouthLat: 44.458,
  mouthLon: -87.495,
  hydraulicSources: [{
    sourceId: "kewaunee_county_f_usgs",
    provider: "USGS",
    siteId: "04085200",
    name: "Kewaunee River near Kewaunee — County F",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs"],
    historyYearsAvailable: 61,
    maxAgeHours: 2,
    reachQuality: "good",
    reachNotes: "Measured at County F about seven river miles above the mouth near the Besadny facility reach. It does not directly measure the harbor or far upper access corridor.",
  }],
  waterTemperatureSources: [{
    sourceId: "kewaunee_county_f_temperature",
    provider: "USGS",
    siteId: "04085200",
    name: "Kewaunee River near Kewaunee — measured water temperature",
    role: "primary",
    priority: 1,
    sourceType: "same_gauge",
    maxAgeHours: 2,
    smoothingWindowHours: 3,
    minValidF: 30,
    maxValidF: 90,
    maxRateChangeFPerHour: 4,
    maxPeerDifferenceF: 6,
    historicalStartYear: 2026,
    historicalEndYear: 2026,
    reachNotes: "A new 2026 co-located series suitable for live Gauge Read, but not yet a multi-season Activity or Migration Timing baseline.",
    attribution: "U.S. Geological Survey Water Data for the Nation; recent readings are provisional and subject to revision.",
  }],
  fishCountSources: [{
    sourceId: "kewaunee_wdnr_besadny",
    provider: "WISCONSIN_DNR_BESADNY",
    facilityName: "C.D. Besadny Anadromous Fish Facility",
    observationType: "trap_recovery",
    eligibleSpecies: ["chinook_salmon", "coho_salmon"],
    sourceUrl: "https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/BesadnyFacilityReport",
    updateCadence: "weekly",
    maximumAgeHours: 240,
    preliminary: true,
    operatingSeason: "Wisconsin DNR normally posts Tuesdays during March-April and October-early November while the facility is operating",
    representedReach: "Operated Besadny facility ponds and fishway on the Kewaunee River",
    limitation: "Total Captured is an operational facility sample, not a mouth count, total river abundance, catch rate, or count of fish remaining below the facility.",
    recapturePolicy: "Use only the official Total Captured row. Do not add Passed Upstream, Females Spawned, Egg Take, or Held in Ponds because those are dispositions or processing measures.",
    attribution: "Wisconsin Department of Natural Resources Besadny Anadromous Fisheries Facility Report",
  }],
  weatherPoints: [{ weatherPointId: "kewaunee_county_f_weather", lat: 44.45833125, lon: -87.5564746, role: "primary" }],
  foundation: {
    version: "kewaunee-foundation-v1-owner-review",
    corridorLengthMiles: 16,
    downstreamTerminus: "Kewaunee harbor mouth at Lake Michigan",
    upstreamTerminus: "Third Highway C bridge crossing shown on the Wisconsin DNR access map",
    targetSpecies: ["chinook_salmon", "coho_salmon", "lake_run_brown_trout"],
    reaches: [
      { reachId: "kewaunee_lower_river", displayName: "Lower River — harbor to first Highway C crossing", order: 1, role: "downstream", gaugeRepresented: false, notes: "Lake-entry and lower-river corridor; County F measurements are upstream.", sourceNotes: "Wisconsin DNR Kewaunee River Access Sites map." },
      { reachId: "kewaunee_besadny_reach", displayName: "Besadny Reach — first Highway C crossing to facility", order: 2, role: "middle", gaugeRepresented: true, notes: "Includes the County F hydraulic context and the operated facility. Chinook and coho product geography stops at the downstream face of the facility structure.", sourceNotes: "Wisconsin DNR access map and facility pages; USGS 04085200 metadata." },
      { reachId: "kewaunee_upper_access", displayName: "Upper Access — facility to third Highway C crossing", order: 3, role: "terminal", gaugeRepresented: false, notes: "Used only for lake-run brown-trout orientation because DNR documents brown trout passed upstream. Public markers do not make intervening private frontage public.", sourceNotes: "Wisconsin DNR access map and 2024 Lake Michigan weir report." },
    ],
    primaryGaugeReachId: "kewaunee_besadny_reach",
    contextualGaugeSiteIds: [],
    weatherStrategy: { mode: "single_point", primaryWeatherPointId: "kewaunee_county_f_weather", basinRepresentation: "Modeled County F weather is broad context only and does not measure river response, clarity, or fish movement.", sourceNotes: "Open-Meteo point paired to USGS 04085200." },
    stateRegulations: [{ state: "WI", version: "wisconsin-2026-2027-fishing-regulations", jurisdiction: "Wisconsin DNR Lake Michigan tributary regulations", reminderCopy: WI_RULES, accessAndSafetyNotes: "Obey posted 500-foot weir/refuge restrictions and any fishway or facility closure. Section labels are orientation, not blanket access or safe-wading claims.", sourceNotes: "Wisconsin DNR 2026-2027 regulations and Besadny facility material; recheck at release." }],
    evidenceNotes: "Official facility timing, annual weir reporting, stocking records, and the DNR access map support three independently calibrated runs. Besadny brown-trout totals are excluded from Fish Counts because adults are collected from several rivers and transferred to the facility.",
  },
  conditionRefreshSchedule: { activeSlots: ACTIVE_SLOTS, inactiveSlots: ["00:00"], evidenceNotes: "Flow and the new measured-temperature series resolve independently. Gage height is omitted because parameter 00065 stopped updating in August 2026 while flow and stream elevation continued." },
  conditionDataCapabilities: { hydraulics: { status: "available" }, waterTemperature: { status: "available" } },
  supportStatus: "beta",
  gaugeLimitationCopy: "Measured at County F near the Besadny reach, not in Kewaunee harbor or the far upper corridor. The water-temperature history begins in 2026 and is live context only. USGS warns the station may be discontinued Oct. 1, 2026 without replacement funding.",
  regulationReminderCopy: WI_RULES,
};

const trailBaseline = { metric: "flow_cfs" as const, version: "trail-springland-fall-2019-2025-v1", hasPercentileBaselines: true, coveredWindowPercent: 1, minimumHistoryYears: 7, sourceNotes: "USGS 04095300 approved daily mean discharge for fixed Aug. 1-Jan. 15 windows in 2019-2025: 1,161 observations; p10 31, p25 37.6, median 47.4, p75 58.6, p90 84.2, p95 114 CFS." };
const kewauneeBaseline = { metric: "flow_cfs" as const, version: "kewaunee-county-f-fall-2019-2025-v1", hasPercentileBaselines: true, coveredWindowPercent: 1, minimumHistoryYears: 7, sourceNotes: "USGS 04085200 approved daily mean discharge for fixed Aug. 1-Jan. 15 windows in 2019-2025 after removing one missing-value sentinel: 1,160 observations; p10 14.3, p25 21.9, median 31.6, p75 55, p90 165, p95 278 CFS." };

const fishability = (version: string, label: string, p10: number, p25: number, p75: number, p90: number, p95: number, notes: string): FishabilityBands => ({ version, metric: "flow_cfs", sourceLabel: label, tooLow: { max: p10 }, lowFishable: { min: p10, max: p25 }, ideal: { min: p25, max: p75 }, highFishable: { min: p75, max: p90 }, blownOut: { min: p95 }, caps: { staleGauge: 55, unknownTrend: 49, veryLow: 45, blownOut: 24, sharpRiseHigh: 40 }, evidenceNotes: notes, sourceNotes: "Fixed 2019-2025 USGS daily-mean audit. Boundaries use p10/p25/p75/p90/p95; the p90-p95 interval is intentionally very high." });
const trailFishability = fishability("trail-springland-fishability-v1", "Springland barrier corridor", 31, 37.6, 58.6, 84.2, 114, "Presentation shape near Springland only; not fish abundance, clarity, passage, access, or safety, and not harbor or upper-forks conditions.");
const kewauneeFishability = fishability("kewaunee-county-f-fishability-v1", "County F / Besadny reach", 14.3, 21.9, 55, 165, 278, "Presentation shape near County F only; not fish abundance, clarity, facility passage, access, or safety, and not harbor or upper-corridor conditions.");

const capabilities: AuditedRiverRunProfile["primitiveCapabilities"] = {
  migrationStage: { status: "available" }, activity: { status: "available" }, fishInRiver: { status: "available" }, fishability: { status: "available" },
  migrationTiming: { status: "unavailable", reason: "no_accepted_historical_baseline", notes: "No independent Migration Timing model has passed this onboarding audit; Stage remains calendar based." },
  push: { status: "unavailable", reason: "no_accepted_historical_baseline", notes: "Current conditions are not presented as confirmed fish movement without a separately validated Push model." },
};

function presence(maximum: HistoricalPresenceConfig["maximum"], version: string, anchors: HistoricalPresenceConfig["anchors"], evidenceNotes: string, sourceNotes: string): HistoricalPresenceConfig {
  return { maximum, distributionScope: "sectional", curveVersion: version, anchors, evidenceNotes, sourceNotes };
}
const salmonAnchors: HistoricalPresenceConfig["anchors"] = [{ dayOffsetFromStart: 0, fractionOfMaximum: .06 }, { dayOffsetFromStart: 14, fractionOfMaximum: .22 }, { dayOffsetFromStart: 27, fractionOfMaximum: .55 }, { dayOffsetFromStart: 45, fractionOfMaximum: 1 }, { dayOffsetFromStart: 56, fractionOfMaximum: .88 }, { dayOffsetFromStart: 70, fractionOfMaximum: .5 }, { dayOffsetFromStart: 82, fractionOfMaximum: .18 }, { dayOffsetFromStart: 97, fractionOfMaximum: 0 }];

const trailObservedActivity = (input: {
  version: string;
  profile: "chinook_fall_reaction" | "coho_fall_reaction";
  lifecycle: NonNullable<ActivityRules["caps"]["lifecycleRamp"]>;
}): ActivityRules => ({
  version: input.version,
  profile: input.profile,
  dataMode: "observed_river",
  minimumInputContract: "weather_and_one_measured_river_input",
  inputReach: {
    reachIds: ["trail_creek_barrier_corridor"],
    hydraulicSourceIds: ["trail_creek_springland_usgs"],
    waterTemperatureSourceIds: [],
    weatherPointIds: ["trail_creek_springland_weather"],
    notes: "Springland discharge is the measured river input for the barrier corridor. Gauge height is a correlated presentation metric rather than a second Activity signal. Measured temperature remains live in Gauge Read but is not scored until it has a multi-season replay record.",
  },
  scopeCopy: "This read combines measured Springland discharge with modeled light and precipitation for the barrier corridor. It does not directly represent the harbor, mouth, upper forks, clarity, fish passage, abundance, or catch probability; measured water temperature remains contextual and is not yet an Activity input.",
  weights: {
    light: 0.35,
    waterTemperature: 0,
    riverBehavior: 0.55,
    weather: 0.10,
  },
  temperature: input.profile === "chinook_fall_reaction"
    ? { coldF: 43, preferredMinF: 48, preferredMaxF: 62, warmF: 68, barrierF: 72 }
    : { coldF: 40, preferredMinF: 45, preferredMaxF: 60, warmF: 64, barrierF: 68 },
  hydraulicTrend: {
    rising24h: { absolute: 5.3, percent: 9.9 },
    meaningfulRise24h: { absolute: 20, percent: 35.8 },
    sharpRise24h: { absolute: 67.9, percent: 101.4 },
  },
  caps: {
    noMeasuredRiverData: 60,
    noWaterTemperature: 100,
    lateRun: 75,
    ending: 42,
    taperingPenalty: 15,
    lifecycleRamp: input.lifecycle,
  },
  evidenceNotes: "Measured-flow candidate calibrated from approved USGS 04095300 daily discharge for fixed 2019-2025 fall windows. Positive 24-hour rise thresholds use p50/p75/p90 of 783 positive daily changes. Hourly light and precipitation retain block differentiation. Temperature is zero-weight and excluded because the continuous archive begins in late August 2025 and cannot support a multi-season replay.",
});

const trailShared = { riverId: "trail_creek", season: "fall" as const, runStageCopyStrategy: "onboarding_corridor" as const, primitiveCapabilities: capabilities, fishabilityBands: trailFishability, baselineCoverage: trailBaseline, publicAudit: { isEnabled: false, auditVersion: "trail-creek-owner-review-ready-v1", notes: "Hidden owner-review candidate deployed only behind the admin review gate; no public release is authorized." } };
export const TRAIL_CREEK_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  ...trailShared, runId: "trail_creek_fall_chinook", biologyProfileId: "great_lakes_chinook_v1", displayName: "Fall Chinook", species: "chinook_salmon", runType: "fall_spawn", movementEngineId: "fall_cooling",
  runWindow: { preRunStart: "08-01", stagingStart: "08-15", start: "08-25", beginningEnd: "09-10", buildingEstablishedStart: "09-11", buildingBroadStart: "09-20", peakStart: "10-01", peak: "10-10", peakEnd: "10-20", taperingEnd: "11-02", end: "11-10", lateEnd: "11-20", postRunLateCopyEnd: "11-30" },
  historicalPresence: presence(7, "trail-creek-chinook-presence-v1", salmonAnchors, "A 7/10 sectional ceiling reflects direct annual stocking and a recurring September-mid-November stream return without a public Trail-specific count series. An Aug. 27, 2026 DNR report documented a few early kings, supporting the leading edge but not abundance.", "Indiana DNR Lake Michigan fishing page, Bodine and Mixsawbah hatchery pages, current fishing report, and Lake Michigan tributary guide."),
  activity: trailObservedActivity({ version: "trail-creek-chinook-measured-flow-activity-v2", profile: "chinook_fall_reaction", lifecycle: { peakEnd: "10-20", taperingEnd: "11-02", endingEnd: "11-20" } }),
  researchNotes: "Owner-review candidate. The Springland barrier is operational infrastructure, not a guarantee of passage, and its prohibited fishing boundary controls access.", sourceNotes: "docs/onboarding/river-run/trail_creek/river-onboarding.md",
};
export const TRAIL_CREEK_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  ...trailShared, runId: "trail_creek_fall_coho", biologyProfileId: "great_lakes_coho_v1", displayName: "Fall Coho", species: "coho_salmon", runType: "fall_spawn", movementEngineId: "fall_cooling",
  runWindow: { preRunStart: "08-20", stagingStart: "09-01", start: "09-10", beginningEnd: "09-20", buildingEstablishedStart: "09-21", buildingBroadStart: "10-01", peakStart: "10-10", peak: "10-20", peakEnd: "10-31", taperingEnd: "11-20", end: "11-30", lateEnd: "12-10", postRunLateCopyEnd: "12-20" },
  historicalPresence: presence(7, "trail-creek-coho-presence-v1", salmonAnchors, "A 7/10 sectional ceiling reflects recurring Trail Creek stocking and return evidence. DNR places the return beginning in September, peaking in October, and spawning in October-November; no public Trail-specific adult count supports a higher ceiling.", "Indiana DNR Lake Michigan fishing page, Mixsawbah hatchery page, and Lake Michigan tributary guide."),
  activity: trailObservedActivity({ version: "trail-creek-coho-measured-flow-activity-v2", profile: "coho_fall_reaction", lifecycle: { peakEnd: "10-31", taperingEnd: "11-20", endingEnd: "12-10" } }),
  researchNotes: "Owner-review candidate with an independent Coho calendar. No Trail fish-count tile is configured because no qualifying recurring public facility feed was found.", sourceNotes: "docs/onboarding/river-run/trail_creek/river-onboarding.md",
};

const kewauneeShared = { riverId: "kewaunee_river", season: "fall" as const, runStageCopyStrategy: "onboarding_corridor" as const, primitiveCapabilities: capabilities, fishabilityBands: kewauneeFishability, baselineCoverage: kewauneeBaseline, publicAudit: { isEnabled: false, auditVersion: "kewaunee-owner-review-ready-v1", notes: "Hidden owner-review candidate deployed only behind the admin review gate; no public release is authorized." } };
const kewauneeWeather = (input: { version: string; profile: ActivityRules["profile"]; reaches: string[]; lifecycle?: NonNullable<ActivityRules["caps"]["lifecycleRamp"]>; stageResponseAdjustment?: NonNullable<ActivityRules["stageResponseAdjustment"]> }) => buildWeatherOnlyActivity({ version: input.version, profile: input.profile, reachIds: input.reaches, weatherPointId: "kewaunee_county_f_weather", inputNotes: "County F flow and the new 2026 water-temperature series remain available to Fishability and Gauge Read but are excluded from Activity because the temperature record cannot support a multi-season replay.", scopeCopy: "This Limited read uses modeled weather near County F. It does not measure river level, clarity, or water temperature in the supported reaches and cannot infer facility passage or fish movement.", lifecycle: input.lifecycle, stageResponseAdjustment: input.stageResponseAdjustment, evidenceNotes: "Independently calibrated weather-only response model with conservative Limited ceilings. It validates behavior rather than abundance or catch probability." });
export const KEWAUNEE_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  ...kewauneeShared, runId: "kewaunee_river_fall_chinook", biologyProfileId: "great_lakes_chinook_v1", displayName: "Fall Chinook", species: "chinook_salmon", runType: "fall_spawn", movementEngineId: "fall_cooling", seasonalZoneReachIds: ["kewaunee_lower_river", "kewaunee_besadny_reach"],
  runWindow: { preRunStart: "08-15", stagingStart: "08-25", start: "09-10", beginningEnd: "09-20", buildingEstablishedStart: "09-21", buildingBroadStart: "09-28", peakStart: "10-01", peak: "10-10", peakEnd: "10-20", taperingEnd: "11-02", end: "11-10", lateEnd: "11-20", postRunLateCopyEnd: "11-30" },
  historicalPresence: presence(8, "kewaunee-chinook-presence-v1", salmonAnchors, "An 8/10 sectional ceiling reflects a long direct facility series and recurring stocking. The 2024 facility processed 624 Chinook versus a 2,449 long-term average; operational counts are bounded samples rather than total run abundance.", "Wisconsin DNR Besadny facility page, 2024 Lake Michigan weir report, and 2025 stocking summary."),
  activity: kewauneeWeather({ version: "kewaunee-chinook-weather-activity-v1", profile: "chinook_fall_reaction", reaches: ["kewaunee_lower_river", "kewaunee_besadny_reach"], lifecycle: { peakEnd: "10-20", taperingEnd: "11-02", endingEnd: "11-20" } }),
  researchNotes: "Owner-review candidate. Chinook geography stops below the operated facility; counts are operational samples and never a catch-rate claim.", sourceNotes: "docs/onboarding/river-run/kewaunee_river/river-onboarding.md",
};
export const KEWAUNEE_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  ...kewauneeShared, runId: "kewaunee_river_fall_coho", biologyProfileId: "great_lakes_coho_v1", displayName: "Fall Coho", species: "coho_salmon", runType: "fall_spawn", movementEngineId: "fall_cooling", seasonalZoneReachIds: ["kewaunee_lower_river", "kewaunee_besadny_reach"],
  runWindow: { preRunStart: "08-25", stagingStart: "09-05", start: "09-15", beginningEnd: "09-25", buildingEstablishedStart: "09-26", buildingBroadStart: "10-01", peakStart: "10-05", peak: "10-15", peakEnd: "10-25", taperingEnd: "11-02", end: "11-08", lateEnd: "11-15", postRunLateCopyEnd: "11-20" },
  historicalPresence: presence(8, "kewaunee-coho-presence-v1", salmonAnchors, "An 8/10 sectional ceiling reflects direct recurring facility observations, including 788 processed in 2024, and DNR's mid-September-late-October facility calendar. Annual counts vary and are not total-river abundance.", "Wisconsin DNR Besadny facility page and 2024 Lake Michigan weir report."),
  activity: kewauneeWeather({ version: "kewaunee-coho-weather-activity-v2", profile: "coho_fall_reaction", reaches: ["kewaunee_lower_river", "kewaunee_besadny_reach"], lifecycle: { peakEnd: "10-25", taperingEnd: "11-02", endingEnd: "11-20" } }),
  researchNotes: "Owner-review candidate with an independent Coho calendar and facility endpoint.", sourceNotes: "docs/onboarding/river-run/kewaunee_river/river-onboarding.md",
};
export const KEWAUNEE_FALL_BROWN_TROUT_RUN_PROFILE: AuditedRiverRunProfile = {
  ...kewauneeShared, runId: "kewaunee_river_fall_brown_trout", biologyProfileId: "great_lakes_lake_run_brown_trout_v1", displayName: "Fall Lake-run Brown Trout", species: "lake_run_brown_trout", runType: "fall_repeat_spawn", movementEngineId: "fall_repeat_spawner_cooling", seasonalZoneReachIds: ["kewaunee_lower_river", "kewaunee_besadny_reach", "kewaunee_upper_access"],
  runWindow: { preRunStart: "09-15", stagingStart: "10-01", start: "10-15", beginningEnd: "10-25", buildingEstablishedStart: "10-26", buildingBroadStart: "11-01", peakStart: "11-10", peak: "11-25", peakEnd: "12-05", taperingEnd: "12-15", end: "12-22", lateEnd: "12-31", postRunLateCopyEnd: "01-15" },
  historicalPresence: presence(7, "kewaunee-brown-trout-presence-v1", [{ dayOffsetFromStart: 0, fractionOfMaximum: .08 }, { dayOffsetFromStart: 10, fractionOfMaximum: .22 }, { dayOffsetFromStart: 17, fractionOfMaximum: .5 }, { dayOffsetFromStart: 26, fractionOfMaximum: .72 }, { dayOffsetFromStart: 41, fractionOfMaximum: 1 }, { dayOffsetFromStart: 51, fractionOfMaximum: .9 }, { dayOffsetFromStart: 61, fractionOfMaximum: .68 }, { dayOffsetFromStart: 68, fractionOfMaximum: .35 }, { dayOffsetFromStart: 77, fractionOfMaximum: .12 }], "A 7/10 sectional ceiling reflects direct Kewaunee collection, recurring stocking, and DNR's mid-October-late-December facility calendar. The 456 Browns processed in 2024 include fish transferred from several rivers and therefore are not a Kewaunee count.", "Wisconsin DNR Besadny facility page, 2024 Lake Michigan weir report, brown-trout outreach, and stocking summary."),
  activity: kewauneeWeather({ version: "kewaunee-brown-trout-weather-activity-v3", profile: "brown_trout_fall_reaction", reaches: ["kewaunee_lower_river", "kewaunee_besadny_reach", "kewaunee_upper_access"], stageResponseAdjustment: { pre_run: 0, beginning: 0, building: 0, peak: 10, tapering: 0, ending: 0, post_run: 0 } }),
  researchNotes: "Owner-review repeat-spawner candidate. No salmon death curve or universal post-spawn departure is implied. Fish Counts are intentionally unavailable because Besadny receives transferred Browns from several rivers.", sourceNotes: "docs/onboarding/river-run/kewaunee_river/river-onboarding.md",
};

export const MIDWEST_DRAFT_RIVERS = [TRAIL_CREEK_RIVER_PROFILE, KEWAUNEE_RIVER_PROFILE];
export const MIDWEST_DRAFT_RUNS = [TRAIL_CREEK_FALL_CHINOOK_RUN_PROFILE, TRAIL_CREEK_FALL_COHO_RUN_PROFILE, KEWAUNEE_FALL_CHINOOK_RUN_PROFILE, KEWAUNEE_FALL_COHO_RUN_PROFILE, KEWAUNEE_FALL_BROWN_TROUT_RUN_PROFILE];
export const MIDWEST_DRAFT_CONFIGURATION_DOCUMENTS: RiverRunConfigurationDocument[] = [
  { schemaVersion: "river-run-config-v1", configVersion: "2026-09-01-trail-creek-owner-review.2", movementEngineVersion: getMovementEngineDefinition("fall_cooling").version, river: TRAIL_CREEK_RIVER_PROFILE, biologyProfiles: [GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE, GREAT_LAKES_COHO_BIOLOGY_PROFILE], runs: [TRAIL_CREEK_FALL_CHINOOK_RUN_PROFILE, TRAIL_CREEK_FALL_COHO_RUN_PROFILE] },
  { schemaVersion: "river-run-config-v1", configVersion: "2026-09-01-kewaunee-owner-review.1", movementEngineVersion: [getMovementEngineDefinition("fall_cooling").version, getMovementEngineDefinition("fall_repeat_spawner_cooling").version].join("+"), river: KEWAUNEE_RIVER_PROFILE, biologyProfiles: [GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE, GREAT_LAKES_COHO_BIOLOGY_PROFILE, GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE], runs: [KEWAUNEE_FALL_CHINOOK_RUN_PROFILE, KEWAUNEE_FALL_COHO_RUN_PROFILE, KEWAUNEE_FALL_BROWN_TROUT_RUN_PROFILE] },
];
