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
      "21:00",
    ],
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "PM condition evidence refreshes every four hours from the configured staging start through the historical-presence tail, with a final 21:00 local rollover that publishes tomorrow's Activity Outlook. Push still starts and stops on its separate main-run window. The protected server job runs 17 minutes after the hour so the newest USGS and PMTU transmissions have time to arrive. Outside that seasonal window, the river refreshes once daily.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Based on the USGS gauge at Scottville. Conditions can vary by reach.",
};

export const BETSIE_RIVER_PROFILE: RiverProfile = {
  riverId: "betsie",
  displayName: "Betsie River",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  mouthLat: 44.6291652,
  mouthLon: -86.2459287,
  hydraulicSources: [],
  waterTemperatureSources: [],
  weatherPoints: [
    {
      weatherPointId: "betsie_homestead_weather_context",
      lat: 44.596362,
      lon: -86.079163,
      role: "primary",
    },
  ],
  conditionRefreshSchedule: {
    activeSlots: ["00:00"],
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "Betsie migratory runs launch as seasonal-only reads. Run Stage and Fish In River are deterministic daily primitives; no intra-day condition refresh is justified until an accepted live hydraulic and measured-water-temperature source represents the below-Homestead corridor.",
  },
  conditionDataCapabilities: {
    hydraulics: {
      status: "unavailable",
      notes:
        "No accepted live gauge is located at or below Homestead Dam and representative of the core migratory-fishing corridor. Remote or differently situated readings are not substituted.",
    },
    waterTemperature: {
      status: "unavailable",
      notes:
        "No accepted live measured-water-temperature source represents the below-Homestead migratory-fishing corridor. Air temperature is explicitly prohibited as a substitute.",
    },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "No sufficiently accurate and consistent live flow gauge or measured water-temperature sensor represents the Betsie below Homestead. Push, Fishability, and Migration Timing are unavailable; Run Stage and Fish In River remain seasonal context.",
  regulationReminderCopy:
    "Fishing is closed within 300 feet of Homestead's lamprey barrier and fish-passage facility from August 1 through November 15, and within 100 feet from November 16 through July 31. Follow current regulations and signed boundaries.",
};

export const BIG_MANISTEE_RIVER_PROFILE: RiverProfile = {
  riverId: "big_manistee",
  displayName: "Big Manistee River",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  // USGS Manistee Lake context location; the condition engine uses the
  // Wellston/Tippy weather point below rather than this fallback coordinate.
  mouthLat: 44.2438918469541,
  mouthLon: -86.3034192845299,
  hydraulicSources: [
    {
      sourceId: "big_manistee_wellston_usgs",
      provider: "USGS",
      siteId: "04125550",
      name: "Manistee River near Wellston, MI — below Tippy Dam",
      role: "primary",
      primaryMetric: "flow_cfs",
      availableMetrics: ["flow_cfs", "gage_height_ft"],
      historyYearsAvailable: 29,
      maxAgeHours: 6,
      reachQuality: "good",
      reachNotes:
        "Official USGS station approximately 700 feet below Tippy Dam. It represents the Tippy tailwater and upper migratory corridor, not the full lower river. Discharge is the scored hydraulic metric; gage height remains context.",
    },
    {
      sourceId: "big_manistee_sherman_usgs_context",
      provider: "USGS",
      siteId: "04124000",
      name: "Manistee River near Sherman, MI — upstream context",
      role: "upstream_context",
      primaryMetric: "flow_cfs",
      availableMetrics: ["flow_cfs"],
      historyYearsAvailable: 29,
      maxAgeHours: 24,
      reachQuality: "acceptable",
      reachNotes:
        "Upstream contextual gauge above the Tippy reservoir system. It is never blended with Wellston and is not used as the primary migratory-reach signal.",
    },
  ],
  waterTemperatureSources: [
    {
      sourceId: "big_manistee_wellston_temperature",
      provider: "USGS",
      siteId: "04125550",
      name: "Manistee River near Wellston, MI — measured water temperature",
      role: "primary",
      priority: 1,
      sourceType: "same_gauge",
      maxAgeHours: 6,
      smoothingWindowHours: 3,
      minValidF: 30,
      maxValidF: 85,
      maxRateChangeFPerHour: 3,
      maxPeerDifferenceF: 5,
      reachNotes:
        "USGS parameter 00010 at the same below-Tippy station as the primary discharge. It is the primary measured-water signal for the gauged tailwater reach; air temperature is not substituted.",
      attribution:
        "U.S. Geological Survey Water Data for the Nation; continuous and daily values are provisional and subject to revision.",
    },
  ],
  weatherPoints: [
    {
      weatherPointId: "big_manistee_wellston_weather",
      lat: 44.259444593202346,
      lon: -85.94162479609616,
      role: "primary",
    },
  ],
  foundation: {
    version: "big-manistee-foundation-v1",
    corridorLengthMiles: 25,
    upstreamTerminus:
      "Tippy Dam; upstream obstruction and migratory-fishery terminus",
    downstreamTerminus:
      "Railroad bridge below M-55 / Manistee Lake approach; mouth and harbor are separate context",
    targetSpecies: ["chinook_salmon", "coho_salmon", "steelhead"],
    reaches: [
      {
        reachId: "big_manistee_tippy_tailwater",
        displayName: "Tippy tailwater to High Bridge",
        order: 1,
        role: "tailwater",
        gaugeRepresented: true,
        notes:
          "Cold, high-gradient upper migratory reach. Wellston is the only primary gauge and should constrain Fishability copy to this tailwater/upper-corridor segment.",
        sourceNotes:
          "Michigan DNR Tippy Dam Recreation Area General Management Plan; USGS 04125550 metadata and EGLE hydrologic report identifying the station approximately 700 feet below Tippy Dam.",
      },
      {
        reachId: "big_manistee_high_bridge_to_bear_creek",
        displayName: "High Bridge to Bear Creek",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "Middle corridor with distinct access and tributary context. Do not describe it as directly measured by Wellston.",
        sourceNotes:
          "Michigan DNR 2022–2023 Manistee River creel-survey segmentation and Tippy Dam management plan.",
      },
      {
        reachId: "big_manistee_bear_creek_to_m55",
        displayName: "Bear Creek to the railroad bridge below M-55",
        order: 3,
        role: "lower",
        gaugeRepresented: false,
        notes:
          "Lower migratory corridor toward Manistee Lake. Tributary, temperature, access, and hydraulic conditions can differ materially from the Tippy tailwater.",
        sourceNotes:
          "Michigan DNR 2022–2023 Manistee River creel-survey segmentation; Michigan DNR Type 3 legal boundary in FO-200.25.",
      },
      {
        reachId: "big_manistee_manistee_lake_harbor",
        displayName: "Manistee Lake, mouth, and harbor context",
        order: 4,
        role: "mouth_context",
        gaugeRepresented: false,
        notes:
          "Terminal lake/harbor context is not interchangeable with the freshwater tailwater gauge and must not receive Wellston-specific Fishability claims.",
        sourceNotes:
          "U.S. Fish and Wildlife Service Manistee River recreational corridor description; USGS Manistee Lake monitoring-location context.",
      },
    ],
    primaryGaugeReachId: "big_manistee_tippy_tailwater",
    contextualGaugeSiteIds: ["04124000", "04123500"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "big_manistee_wellston_weather",
      basinRepresentation:
        "Modeled Open-Meteo precipitation at the Wellston/Tippy target reach. It is contextual precursor evidence, not a rain-gauge observation and not a substitute for measured tailwater response.",
      sourceNotes:
        "Open-Meteo point-weather adapter; point selected to align precipitation context with the audited primary reach. A future multi-point basin weighting extension requires separate replay validation.",
    },
    regulation: {
      version: "michigan-fo-200.25-2025-effective-2026-regulations",
      legalReach:
        "Manistee River from Tippy Dam downstream to the railroad bridge below M-55 (T21N, R16W, S6)",
      waterType: "type_3",
      yearRoundTroutSalmon: true,
      rainbowTroutPossessionLimit:
        "Daily possession limit may include no more than one Rainbow Trout year-round on this reach.",
      specialArtificialLureWindow: {
        start: "08-01",
        end: "11-15",
        description:
          "Special artificial-lure/terminal-gear regulations apply during the August 1 through November 15 window; check the current Michigan regulations and Fisheries Orders.",
      },
      noUnverifiedDistanceClosureConfigured: true,
      accessAndSafetyNotes:
        "Do not invent a Tippy-specific distance closure. Follow current DNR closure notices, Consumers Energy safety information, signs, booms, and posted boundaries; methods can change by reach and season.",
      sourceNotes:
        "Michigan DNR FO-200.25, 2026 Michigan Fishing Regulations, current Tippy Dam Recreation Area page, and Consumers Energy dam-safety information.",
    },
    evidenceNotes:
      "Foundation research completed August 5, 2026. Sources include USGS 04125550 continuous/daily metadata and values, USGS 04124000 and 04123500 contextual metadata, Michigan DNR FO-200.25 and 2026 regulations, Michigan DNR Tippy Dam management material, the DNR 2022–2023 creel survey, U.S. Fish and Wildlife Service Manistee River corridor material, and Michigan EGLE hydrologic analysis. Wellston is completely regulated by Tippy and represents the tailwater/upper corridor only. No species timing, strength, presence curve, hydraulic threshold, or Fishability band is configured here.",
  },
  conditionRefreshSchedule: {
    activeSlots: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "The observed Wellston discharge and measured-water-temperature feeds are available at approximately 15-minute cadence. Use the PM refresh pattern as the operational blueprint, while the six-slot cadence remains river-level infrastructure rather than species timing. Freshness, provisional status, and shared source gaps must be preserved.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Based on USGS 04125550 approximately 700 feet below Tippy Dam. It best represents the Tippy tailwater and upper migratory corridor; flow, temperature, access, and fishability can differ downstream through High Bridge, Bear Creek, the lower river, and Manistee Lake.",
  regulationReminderCopy:
    "The Big Manistee below Tippy is a Type 3 reach extending to the railroad bridge below M-55, with a year-round one-Rainbow-Trout limit and special artificial-lure rules during the August 1–November 15 window. Follow current Michigan regulations, DNR closure notices, dam-safety information, and posted boundaries. Fishing methods can change by reach and season.",
};

export const MUSKEGON_RIVER_PROFILE: RiverProfile = {
  riverId: "muskegon",
  displayName: "Muskegon River",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  mouthLat: 43.2473,
  mouthLon: -86.3312,
  hydraulicSources: [{
    sourceId: "muskegon_croton_usgs",
    provider: "USGS",
    siteId: "04121970",
    name: "Muskegon River near Croton, MI — below Croton Dam",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 30,
    maxAgeHours: 6,
    reachQuality: "good",
    reachNotes:
      "Official USGS station on the right bank 75 feet below Croton Drive and about 1,000 feet below Croton Dam. Flow is completely regulated by the dam. It represents the Croton tailwater, not the entire river to Muskegon Lake.",
  }],
  waterTemperatureSources: [{
    sourceId: "muskegon_croton_temperature",
    provider: "USGS",
    siteId: "04121970",
    name: "Muskegon River near Croton, MI — measured water temperature",
    role: "primary",
    priority: 1,
    sourceType: "same_gauge",
    maxAgeHours: 6,
    smoothingWindowHours: 3,
    minValidF: 30,
    maxValidF: 85,
    maxRateChangeFPerHour: 3,
    maxPeerDifferenceF: 5,
    reachNotes:
      "USGS parameter 00010 at the same below-Croton station as discharge. It is measured tailwater temperature; air temperature and upstream reservoir readings are not substitutes.",
    attribution:
      "U.S. Geological Survey Water Data for the Nation; continuous and daily values are provisional and subject to revision.",
  }],
  weatherPoints: [{
    weatherPointId: "muskegon_croton_weather",
    lat: 43.4347,
    lon: -85.6653,
    role: "primary",
  }],
  foundation: {
    version: "muskegon-foundation-v1",
    corridorLengthMiles: 42,
    upstreamTerminus:
      "Croton Dam; hard upstream barrier and migratory-fishery terminus",
    downstreamTerminus:
      "Muskegon Lake approach; Muskegon Lake and the Lake Michigan channel are separate staging context",
    targetSpecies: ["chinook_salmon", "coho_salmon", "steelhead"],
    reaches: [
      {
        reachId: "muskegon_croton_tailwater",
        displayName: "Croton tailwater",
        order: 1,
        role: "tailwater",
        gaugeRepresented: true,
        notes:
          "Immediately below Croton Dam. The USGS gauge directly represents this regulated tailwater only.",
        sourceNotes:
          "USGS 04121970 station metadata; Michigan DNR Central Lake Michigan Management Unit access and fishery description.",
      },
      {
        reachId: "muskegon_croton_to_newaygo",
        displayName: "Croton-to-Newaygo corridor",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "Shallower swift big-river corridor with mixed sand, cobble, and boulder. Public geography does not imply permission at every bank or parcel.",
        sourceNotes:
          "Michigan DNR Central Lake Michigan Management Unit; 2022–2023 Muskegon River creel survey Site 151.",
      },
      {
        reachId: "muskegon_newaygo_to_m120",
        displayName: "Newaygo-to-M-120 lower migratory corridor",
        order: 3,
        role: "lower",
        gaugeRepresented: false,
        notes:
          "Deeper lower corridor generally better suited to boats; submerged wood and reach-specific access require caution.",
        sourceNotes:
          "Michigan DNR Central Lake Michigan Management Unit; 2022–2023 Muskegon River creel survey Site 152.",
      },
      {
        reachId: "muskegon_lake_context",
        displayName: "Lower river, Muskegon Lake, and channel context",
        order: 4,
        role: "mouth_context",
        gaugeRepresented: false,
        notes:
          "Lakeward staging and entry context is not interchangeable with the Croton tailwater gauge.",
        sourceNotes:
          "Michigan DNR Central Lake Michigan Management Unit fishing-water descriptions.",
      },
    ],
    primaryGaugeReachId: "muskegon_croton_tailwater",
    contextualGaugeSiteIds: ["04122000"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "muskegon_croton_weather",
      basinRepresentation:
        "Modeled precipitation at the Croton scored reach is precursor context only and never substitutes for measured discharge response.",
      sourceNotes:
        "Open-Meteo point-weather adapter aligned with the primary scored reach.",
    },
    regulation: {
      version: "michigan-fo-200.25-current-review-required",
      legalReach:
        "Muskegon River downstream from Croton Dam; rules vary by designated reach and must be checked in current Michigan regulations",
      waterType: "type_3",
      yearRoundTroutSalmon: true,
      rainbowTroutPossessionLimit:
        "Check the current Michigan Fishing Regulations and Fisheries Order FO-200 before fishing; limits and gear rules may change by reach and season.",
      specialArtificialLureWindow: {
        start: "08-01",
        end: "11-15",
        description:
          "Do not infer a special gear rule from another river. Check the current Muskegon reach listing and posted notices.",
      },
      noUnverifiedDistanceClosureConfigured: true,
      accessAndSafetyNotes:
        "Named reaches describe geography, not access permission. Use established public access, respect private land, posted closures, dam warnings, swift current, submerged wood, and current regulations.",
      sourceNotes:
        "Michigan DNR FO-200 and current fishing regulations; DNR Central Lake Michigan Management Unit; Consumers Energy Croton recreation and dam-safety information.",
    },
    evidenceNotes:
      "Research completed August 6, 2026. Croton Dam is the hard upstream migration boundary. USGS 04121970 is about 1,000 feet below the dam and has discharge from 1995 and measured water temperature supporting a common 2007–2025 audit. It must never be extrapolated as direct measurement of the Newaygo, lower-river, Muskegon Lake, or channel reaches.",
  },
  conditionRefreshSchedule: {
    activeSlots: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "USGS 04121970 provides near-real-time discharge and measured water temperature. Six active daily refreshes preserve the regulated tailwater response during supported run windows.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Based on USGS 04121970 immediately below Croton Dam. It represents the regulated Croton tailwater; flow, temperature, access, and safety can differ through Newaygo, the lower river, Muskegon Lake, and the channel.",
  regulationReminderCopy:
    "Croton Dam is the hard upstream migration boundary. Fish only legal water below the dam, use established public access, respect private land and posted closures, and check current Michigan regulations and dam-safety notices.",
};

export const RIVER_RUN_RIVER_PROFILES: RiverProfile[] = [
  PERE_MARQUETTE_RIVER_PROFILE,
  BETSIE_RIVER_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  MUSKEGON_RIVER_PROFILE,
];
