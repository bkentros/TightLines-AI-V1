export type WisconsinWinterActivityMode =
  | "measured_water"
  | "flow_air_proxy"
  | "weather_air_proxy";

export type WisconsinWinterSpeciesDecision = {
  species: "steelhead" | "lake_run_brown_trout";
  fallRunId: string;
  futureRunId: string;
  activationMonthDay: string;
  endMonthDay: "02-28";
  startingPresenceFraction: number;
  activityMode: WisconsinWinterActivityMode;
  corridorReachIds: readonly string[];
  preferredStartReachIds: readonly string[];
  activityReachIds: readonly string[];
  hydraulicSourceIds: readonly string[];
  waterTemperatureSourceIds: readonly string[];
  weatherPointIds: readonly string[];
  lifecycleContract: string;
  evidenceNotes: string;
};

export type WisconsinWinterRiverDecision = {
  riverId: string;
  displayName: string;
  legalSeasonNotes: string;
  gaugeAuditNotes: string;
  species: readonly [
    WisconsinWinterSpeciesDecision,
    WisconsinWinterSpeciesDecision,
  ];
};

const STEELHEAD_LIFECYCLE =
  "Overwintering lake-run Steelhead already in the river. This is a retained-presence and feeding-response pathway, not a new migration pulse. It ends February 28 so a future spring-run pathway can begin March 1 without overlap.";

const BROWN_TROUT_LIFECYCLE =
  "Post-spawn lake-run Brown Trout holding or feeding in the lower river, tributary mouth, and harbor transition. This is a conservative winter opportunity, not a claim that every fall fish remains or that a distinct winter migration occurs.";

const WI_LAKE_MICHIGAN_LEGAL =
  "Wisconsin Lake Michigan tributaries have a continuous trout and salmon season, subject to current water-specific exceptions. From September 15 through the first Saturday in May, tributary fishing is prohibited from one-half hour after sunset to one-half hour before sunrise. Posted refuges, facility boundaries, property access, and emergency orders still control.";

/**
 * Pass 1 source-of-truth for the first five Wisconsin winter rivers.
 *
 * These are implementation decisions, not registered run profiles. Importing this
 * file cannot make a winter pathway seasonally active or publicly visible.
 */
export const WISCONSIN_WINTER_PASS1_DECISIONS:
  readonly WisconsinWinterRiverDecision[] = [
    {
      riverId: "milwaukee",
      displayName: "Milwaukee River",
      legalSeasonNotes:
        `${WI_LAKE_MICHIGAN_LEGAL} The signed Kletzsch fish-passage refuge remains closed year-round.`,
      gaugeAuditNotes:
        "USGS 04087000 currently supplies flow, gauge height, and measured water temperature at Estabrook Park. It represents the Urban Greenway only, not Milwaukee Harbor or the North Shore above Kletzsch.",
      species: [
        {
          species: "steelhead",
          fallRunId: "milwaukee_fall_steelhead",
          futureRunId: "milwaukee_winter_steelhead",
          activationMonthDay: "12-16",
          endMonthDay: "02-28",
          startingPresenceFraction: .62,
          activityMode: "measured_water",
          corridorReachIds: [
            "milwaukee_harbor_downtown",
            "milwaukee_urban_greenway",
            "milwaukee_north_shore",
          ],
          preferredStartReachIds: [
            "milwaukee_urban_greenway",
            "milwaukee_north_shore",
          ],
          activityReachIds: ["milwaukee_urban_greenway"],
          hydraulicSourceIds: ["milwaukee_estabrook_usgs"],
          waterTemperatureSourceIds: [
            "milwaukee_estabrook_temperature",
          ],
          weatherPointIds: ["milwaukee_estabrook_weather"],
          lifecycleContract: STEELHEAD_LIFECYCLE,
          evidenceNotes:
            "The accepted fall curve retains 62% of its maximum on December 15. All three audited sections remain viable, while measured conditions justify starting in the Urban Greenway or North Shore rather than implying equal real-time knowledge in the harbor.",
        },
        {
          species: "lake_run_brown_trout",
          fallRunId: "milwaukee_fall_brown_trout",
          futureRunId: "milwaukee_winter_brown_trout",
          activationMonthDay: "01-16",
          endMonthDay: "02-28",
          startingPresenceFraction: .25,
          activityMode: "weather_air_proxy",
          corridorReachIds: ["milwaukee_harbor_downtown"],
          preferredStartReachIds: ["milwaukee_harbor_downtown"],
          activityReachIds: ["milwaukee_harbor_downtown"],
          hydraulicSourceIds: [],
          waterTemperatureSourceIds: [],
          weatherPointIds: ["milwaukee_estabrook_weather"],
          lifecycleContract: BROWN_TROUT_LIFECYCLE,
          evidenceNotes:
            "DNR winter guidance concentrates Brown Trout opportunity at Lake Michigan tributary mouths, harbors, and warmer nearshore water. Estabrook measurements must not be presented as harbor water temperature or flow.",
        },
      ],
    },
    {
      riverId: "sheboygan",
      displayName: "Sheboygan River",
      legalSeasonNotes: WI_LAKE_MICHIGAN_LEGAL,
      gaugeAuditNotes:
        "USGS 04086000 currently supplies flow and gauge height near I-43, 3.9 miles above the mouth. No accepted live water-temperature source represents the corridor, and the gauge does not directly represent the harbor.",
      species: [
        {
          species: "steelhead",
          fallRunId: "sheboygan_fall_steelhead",
          futureRunId: "sheboygan_winter_steelhead",
          activationMonthDay: "12-16",
          endMonthDay: "02-28",
          startingPresenceFraction: .62,
          activityMode: "flow_air_proxy",
          corridorReachIds: [
            "sheboygan_harbor_lower_city",
            "sheboygan_urban_river",
            "sheboygan_kohler",
          ],
          preferredStartReachIds: [
            "sheboygan_urban_river",
            "sheboygan_kohler",
          ],
          activityReachIds: ["sheboygan_urban_river"],
          hydraulicSourceIds: ["sheboygan_i43_usgs"],
          waterTemperatureSourceIds: [],
          weatherPointIds: ["sheboygan_i43_weather"],
          lifecycleContract: STEELHEAD_LIFECYCLE,
          evidenceNotes:
            "All three sections remain winter possibilities. Flow can qualify presentation near I-43, while a multi-day air-temperature pattern serves only as a limited biological proxy and is never labeled measured water temperature.",
        },
        {
          species: "lake_run_brown_trout",
          fallRunId: "sheboygan_fall_brown_trout",
          futureRunId: "sheboygan_winter_brown_trout",
          activationMonthDay: "01-16",
          endMonthDay: "02-28",
          startingPresenceFraction: .25,
          activityMode: "weather_air_proxy",
          corridorReachIds: ["sheboygan_harbor_lower_city"],
          preferredStartReachIds: ["sheboygan_harbor_lower_city"],
          activityReachIds: ["sheboygan_harbor_lower_city"],
          hydraulicSourceIds: [],
          waterTemperatureSourceIds: [],
          weatherPointIds: ["sheboygan_i43_weather"],
          lifecycleContract: BROWN_TROUT_LIFECYCLE,
          evidenceNotes:
            "The winter Brown Trout product is deliberately limited to the harbor and lower city. I-43 flow is excluded because it is not direct harbor presentation, and no measured water temperature is available.",
        },
      ],
    },
    {
      riverId: "root",
      displayName: "Root River",
      legalSeasonNotes:
        `${WI_LAKE_MICHIGAN_LEGAL} Steelhead Facility operations and posted boundaries must also be checked.`,
      gaugeAuditNotes:
        "USGS 04087240 flow is below Horlick Dam but upstream of the product endpoint; USGS 04087234 temperature is farther upstream above Horlick Dam. Neither is accepted as a direct winter Activity input for the supported lower-river corridor.",
      species: [
        {
          species: "steelhead",
          fallRunId: "root_fall_steelhead",
          futureRunId: "root_winter_steelhead",
          activationMonthDay: "01-01",
          endMonthDay: "02-28",
          startingPresenceFraction: .62,
          activityMode: "weather_air_proxy",
          corridorReachIds: [
            "root_harbor_downtown",
            "root_city_parks",
            "root_lincoln_park",
          ],
          preferredStartReachIds: [
            "root_city_parks",
            "root_lincoln_park",
          ],
          activityReachIds: [
            "root_harbor_downtown",
            "root_city_parks",
            "root_lincoln_park",
          ],
          hydraulicSourceIds: [],
          waterTemperatureSourceIds: [],
          weatherPointIds: ["root_horlick_weather"],
          lifecycleContract: STEELHEAD_LIFECYCLE,
          evidenceNotes:
            "The December 31 fall endpoint hands directly to winter on January 1. Because both gauges are outside the supported corridor, Activity must stay explicitly Limited and weather-proxy only even though Gauge Read can show separately labeled upstream context.",
        },
        {
          species: "lake_run_brown_trout",
          fallRunId: "root_fall_brown_trout",
          futureRunId: "root_winter_brown_trout",
          activationMonthDay: "01-16",
          endMonthDay: "02-28",
          startingPresenceFraction: .25,
          activityMode: "weather_air_proxy",
          corridorReachIds: ["root_harbor_downtown"],
          preferredStartReachIds: ["root_harbor_downtown"],
          activityReachIds: ["root_harbor_downtown"],
          hydraulicSourceIds: [],
          waterTemperatureSourceIds: [],
          weatherPointIds: ["root_horlick_weather"],
          lifecycleContract: BROWN_TROUT_LIFECYCLE,
          evidenceNotes:
            "Winter Brown Trout remains a lower-river and harbor opportunity. Upstream Horlick flow and 60th Street temperature are excluded from Activity and cannot be relabeled as harbor observations.",
        },
      ],
    },
    {
      riverId: "kewaunee_river",
      displayName: "Kewaunee River",
      legalSeasonNotes:
        `${WI_LAKE_MICHIGAN_LEGAL} Obey the posted Besadny weir/fish-refuge boundaries and facility closures.`,
      gaugeAuditNotes:
        "USGS 04085200 currently supplies flow and measured water temperature at County F near the Besadny reach. The temperature series began in 2026 and neither metric directly represents the harbor or far upper corridor.",
      species: [
        {
          species: "steelhead",
          fallRunId: "kewaunee_river_fall_steelhead",
          futureRunId: "kewaunee_river_winter_steelhead",
          activationMonthDay: "12-16",
          endMonthDay: "02-28",
          startingPresenceFraction: .62,
          activityMode: "measured_water",
          corridorReachIds: [
            "kewaunee_lower_river",
            "kewaunee_besadny_reach",
            "kewaunee_upper_access",
          ],
          preferredStartReachIds: [
            "kewaunee_besadny_reach",
            "kewaunee_upper_access",
          ],
          activityReachIds: ["kewaunee_besadny_reach"],
          hydraulicSourceIds: ["kewaunee_county_f_usgs"],
          waterTemperatureSourceIds: ["kewaunee_county_f_temperature"],
          weatherPointIds: ["kewaunee_county_f_weather"],
          lifecycleContract: STEELHEAD_LIFECYCLE,
          evidenceNotes:
            "A new independently supported fall profile retains 62% on December 15. Facility passage supports the upper corridor; live measured Activity remains scoped to County F/Besadny and the short temperature record must not be treated as a historical winter baseline.",
        },
        {
          species: "lake_run_brown_trout",
          fallRunId: "kewaunee_river_fall_brown_trout",
          futureRunId: "kewaunee_river_winter_brown_trout",
          activationMonthDay: "12-23",
          endMonthDay: "02-28",
          startingPresenceFraction: .35,
          activityMode: "weather_air_proxy",
          corridorReachIds: ["kewaunee_lower_river"],
          preferredStartReachIds: ["kewaunee_lower_river"],
          activityReachIds: ["kewaunee_lower_river"],
          hydraulicSourceIds: [],
          waterTemperatureSourceIds: [],
          weatherPointIds: ["kewaunee_county_f_weather"],
          lifecycleContract: BROWN_TROUT_LIFECYCLE,
          evidenceNotes:
            "The fall Brown Trout curve ends December 22 at 35% of maximum. The County F/Besadny gauge is not used for the lower-river winter Brown product because it does not directly represent the harbor transition emphasized by DNR winter guidance.",
        },
      ],
    },
    {
      riverId: "manitowoc",
      displayName: "Manitowoc River",
      legalSeasonNotes:
        `${WI_LAKE_MICHIGAN_LEGAL} Lower Cato Falls County Park closes October 31 and is excluded from every winter recommendation.`,
      gaugeAuditNotes:
        "USGS 04085427 currently supplies flow and gauge height at Michigan Avenue in the lower/middle mainstem. Its water-temperature record ended in 2022 and is historical context only, never a current Activity input.",
      species: [
        {
          species: "steelhead",
          fallRunId: "manitowoc_fall_steelhead",
          futureRunId: "manitowoc_winter_steelhead",
          activationMonthDay: "12-16",
          endMonthDay: "02-28",
          startingPresenceFraction: .62,
          activityMode: "flow_air_proxy",
          corridorReachIds: [
            "manitowoc_lower_river",
            "manitowoc_middle_river",
          ],
          preferredStartReachIds: ["manitowoc_middle_river"],
          activityReachIds: ["manitowoc_middle_river"],
          hydraulicSourceIds: ["manitowoc_michigan_ave_usgs"],
          waterTemperatureSourceIds: [],
          weatherPointIds: ["manitowoc_michigan_ave_weather"],
          lifecycleContract: STEELHEAD_LIFECYCLE,
          evidenceNotes:
            "A new independently supported fall profile retains 62% on December 15. Winter excludes the upper corridor because its only verified access, Lower Cato Falls, is closed; Michigan Avenue flow plus an explicitly labeled air-temperature proxy can support a Limited lower/middle Activity read.",
        },
        {
          species: "lake_run_brown_trout",
          fallRunId: "manitowoc_fall_brown_trout",
          futureRunId: "manitowoc_winter_brown_trout",
          activationMonthDay: "01-01",
          endMonthDay: "02-28",
          startingPresenceFraction: .52,
          activityMode: "weather_air_proxy",
          corridorReachIds: ["manitowoc_lower_river"],
          preferredStartReachIds: ["manitowoc_lower_river"],
          activityReachIds: ["manitowoc_lower_river"],
          hydraulicSourceIds: [],
          waterTemperatureSourceIds: [],
          weatherPointIds: ["manitowoc_michigan_ave_weather"],
          lifecycleContract: BROWN_TROUT_LIFECYCLE,
          evidenceNotes:
            "The December 31 fall endpoint retains approximately 52% of the interpolated living-fish curve. Winter Brown Trout is limited to the lower river; Michigan Avenue flow and discontinued temperature are not treated as harbor observations.",
        },
      ],
    },
  ];

export const WISCONSIN_WINTER_PASS1_EXCLUSIONS = [{
  riverId: "bois_brule",
  displayName: "Bois Brule River",
  decision: "exclude_winter_pathway" as const,
  legalClosureStartMonthDay: "11-16",
  legalReopenRule: "last Saturday in March",
  evidenceNotes:
    "Wisconsin DNR closes the Bois Brule below Highway 2 after November 15 until the last Saturday in March. Fish may overwinter, but an in-season winter fishing recommendation would be legally misleading; the river belongs in a later spring Steelhead pathway instead.",
  sourceUrl:
    "https://dnr.wisconsin.gov/topic/Fishing/lakesuperior/boisbrulefishing",
}] as const;

export const WISCONSIN_WINTER_PASS1_SOURCE_LEDGER = [
  {
    title: "Wisconsin DNR inland trout and salmon seasons",
    url: "https://dnr.wisconsin.gov/topic/Fishing/seasons/trout",
    supports: "continuous Lake Michigan tributary season subject to exceptions",
  },
  {
    title: "Wisconsin DNR Lake Michigan fall fishing",
    url:
      "https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html",
    supports: "September 15 through first-Saturday-in-May night restriction",
  },
  {
    title: "Wisconsin DNR year of fishing",
    url: "https://dnr.wisconsin.gov/topic/Fishing/outreach/yearoffishing.html",
    supports:
      "January Brown Trout opportunity at tributary mouths, harbors, and warmer nearshore water",
  },
  {
    title: "Wisconsin DNR Root River report",
    url: "https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/rootriverreport",
    supports:
      "distinct fall and March-May spring Steelhead facility operations",
  },
  {
    title: "Wisconsin DNR 2025 Lake Michigan GLFC report",
    url:
      "https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LMGLFC2025.pdf",
    supports:
      "Kewaunee fall and spring Steelhead occurrence and current river grouping evidence",
  },
  {
    title: "Wisconsin DNR Rainbow Trout and Steelhead profile",
    url:
      "https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_rainbowtrout.pdf",
    supports:
      "Steelhead strains, fall-through-spring timing, and named tributaries",
  },
  {
    title: "Wisconsin DNR 2024 Lake Michigan stocking summary",
    url:
      "https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf",
    supports:
      "recurring river-specific Steelhead and Brown Trout stocking context without converting stocking to adult abundance",
  },
  {
    title: "Wisconsin DNR Bois Brule fishing",
    url:
      "https://dnr.wisconsin.gov/topic/Fishing/lakesuperior/boisbrulefishing",
    supports: "November 15 lower-river closure and spring reopening rule",
  },
] as const;
