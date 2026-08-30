export type RiverAccessKind =
  | "shore_fishing"
  | "wade_access"
  | "fishing_platform"
  | "boat_ramp"
  | "carry_in"
  | "walk_in";

export type RiverAccessSpecies =
  | "chinook_salmon"
  | "coho_salmon"
  | "steelhead"
  | "lake_run_brown_trout";

export type RiverAccessSectionPosition = "lower" | "middle" | "upper";

export type RiverAccessRecommendationStage =
  | "pre_run"
  | "beginning"
  | "building"
  | "peak"
  | "tapering"
  | "ending"
  | "post_run";

export type RiverAccessSpot = {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  sourceLocationHint?: string;
  accessKinds: RiverAccessKind[];
  detail: string;
  caution?: string;
  sourceLabel: string;
  sourceUrl: string;
  sourceLocator: string;
  verifiedOn: string;
};

export type RiverAccessSection = {
  id: string;
  /** IDs from the river foundation; access geography must not fork from it. */
  foundationReachIds: string[];
  /** Relative position inside the supported River Run corridor. */
  position: RiverAccessSectionPosition;
  /** Concrete downstream-to-upstream boundaries shown below the position. */
  rangeLabel: string;
  /** Omit when the section applies to every supported run on the river. */
  eligibleSpecies?: RiverAccessSpecies[];
  spots: RiverAccessSpot[];
};

export type RiverSpotFinder = {
  riverId: string;
  riverName: string;
  supportedStates?: string[];
  orientationNote: string;
  /** False when the inventory does not describe the selected migration corridor. */
  riverRunAligned?: boolean;
  safetyLink?: {
    label: string;
    url: string;
  };
  sections: RiverAccessSection[];
};

export type RiverSpotFinderRecommendedSections = {
  /** Broad sections recommended from the fixed migration phase. */
  recommendedSections: RiverAccessSection[];
  /** Eligible access sections outside the broad recommendation. */
  otherSections: RiverAccessSection[];
  /** False before the run, after completion, or without a known stage. */
  hasRecommendation: boolean;
};

/**
 * Produces a broad, copy-free section recommendation from the migration phase.
 * Sections are ordered downstream to upstream by the audited inventory. The
 * resolver recommends every access in selected sections and never ranks an
 * individual location or infers live fish presence.
 */
export function resolveRiverSpotFinderRecommendedSections(
  finder: Pick<RiverSpotFinder, "sections">,
  stage?: RiverAccessRecommendationStage,
): RiverSpotFinderRecommendedSections {
  if (!stage || stage === "pre_run" || stage === "post_run") {
    return {
      recommendedSections: [],
      otherSections: finder.sections,
      hasRecommendation: false,
    };
  }

  const sectionCount = finder.sections.length;
  let recommendedSections: RiverAccessSection[];
  switch (stage) {
    case "beginning":
      recommendedSections = finder.sections.slice(0, 1);
      break;
    case "building":
      recommendedSections = finder.sections.slice(0, Math.min(2, sectionCount));
      break;
    case "peak":
      recommendedSections = finder.sections;
      break;
    case "tapering":
    case "ending":
      recommendedSections = sectionCount >= 3
        ? finder.sections.slice(-2)
        : finder.sections.slice(-1);
      break;
  }
  if (recommendedSections.length === 0) {
    return {
      recommendedSections: [],
      otherSections: finder.sections,
      hasRecommendation: false,
    };
  }
  const recommendedSectionIds = new Set(
    recommendedSections.map((section) => section.id),
  );
  return {
    recommendedSections,
    otherSections: finder.sections.filter(
      (section) => !recommendedSectionIds.has(section.id),
    ),
    hasRecommendation: true,
  };
}

export function riverAccessSectionLabel(
  position: RiverAccessSectionPosition,
): string {
  return `${position[0].toUpperCase()}${position.slice(1)} Run Section`;
}

const DNR_BOATING_SOURCE =
  "https://experience.arcgis.com/experience/cc091ec1b6a24d7a98010f8de57fd189/page/Explore";
const DNR_CENTRAL_FISHERIES_SOURCE =
  "https://www.michigan.gov/dnr/managing-resources/fisheries/units/c-michigan";
const DNR_CLOSURES = "https://www.michigan.gov/dnr/about/newsroom/closures";
const PM_DNR_MAP =
  "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/PublicLands/LandUse/PereMarquette_WandSCorr_BAS.pdf?hash=ABAC24175FEE11C3485EE721B453B6D5&rev=d2b6e8bef18642bab650618c7a6c4471";
const NILES_RECREATION_PLAN =
  "https://www.nilesmi.org/document_center/department/DPW/City%20of%20Niles%2021-26%20PR%20Plan%20Final.pdf";
const WHITE_RIVER_MAP =
  "https://s34427.pcdn.co/wp-content/uploads/2021/09/NCTC_White-River_Map_11x17_8-20-21_web.pdf";
const PLATTE_PARK_SOURCE =
  "https://www.gtrlc.org/recreation-events/preserve/platte-river-park/";
const WI_MILWAUKEE_ACCESS_MAP =
  "https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_MilwaukeeRiverAccess.pdf";
const WI_SHEBOYGAN_ACCESS_MAP =
  "https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_SheboyganRiverAccess.pdf";
const WI_ROOT_ACCESS_MAP =
  "https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverAccess.pdf";
const WI_FALL_FISHING_GUIDE =
  "https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_closetohome_letter.pdf";
const WI_BRULE_ACCESS_REPORT =
  "https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LS_LowerBoisBruleRiverCreelSurvey2018.pdf";
const WI_BRULE_PADDLING =
  "https://dnr.wisconsin.gov/topic/StateForests/bruleriver/recreation/paddle";
const WI_FISHING_RULES = "https://dnr.wisconsin.gov/topic/Fishing/seasons";

const DNR_FACILITY_SEARCH_NAMES: Record<string, string> = {
  betsie_river_road: "River Road",
  betsie_grace_road: "Grace Road",
  betsie_us31: "US 31",
  betsie_homestead: "Homestead Dam",
  grand_ada: "Ada",
  grand_grandriverpark: "Georgetown",
  grand_grandville: "Grandville",
  grand_indian: "Indian Channel",
  grand_ionia: "Ionia Fairground",
  grand_jaycee: "Jaycees Park",
  grand_johnson: "Johnson Park",
  grand_knapp: "Knapp Street Bridge",
  grand_lyons: "Lyons",
  grand_moores: "Moores Park",
  grand_riverside: "Riverside Drive",
  grand_robinson: "Robinson",
  grand_rogue: "Rogue River Mouth",
  grand_saranac: "Saranac",
  grand_towner: "Towner Road",
  grand_webber: "Webber Impoundment",
  manistee_tippy_lower: "Tippy Dam",
  stjoe_benton: "Benton Harbor",
  stjoe_buchanan: "Buchanan",
  stjoe_jasper: "Jasper Dairy Road",
  stjoe_riverview: "Riverview Park",
};

const SOURCE_LOCATOR_OVERRIDES: Record<string, string> = {
  muskegon_bridgeton:
    "On the linked DNR page, find “Warner Road (Bridgeton Township) boat access”.",
  muskegon_anderson:
    "On the linked DNR page, find “Felch Street (Anderson Flats) DNR boat access”.",
  muskegon_72nd:
    "On the linked DNR page, find “DNR 72nd Street shore fishing access”.",
};

const directSourceLocator = (name: string) =>
  `The linked source names “${name}” and describes its public access.`;

const dnrSpot = (
  id: string,
  name: string,
  latitude: number,
  longitude: number,
  accessKinds: RiverAccessKind[],
  detail: string,
  caution?: string,
  sourceUrl = DNR_BOATING_SOURCE,
): RiverAccessSpot => ({
  id,
  name,
  latitude,
  longitude,
  accessKinds,
  detail,
  caution,
  sourceLabel: "Michigan DNR public access inventory",
  sourceUrl,
  sourceLocator: SOURCE_LOCATOR_OVERRIDES[id] ??
    (sourceUrl === DNR_BOATING_SOURCE
      ? `In the official facility finder, search “${
        DNR_FACILITY_SEARCH_NAMES[id] ?? name
      }”.`
      : directSourceLocator(name)),
  verifiedOn: "2026-08-30",
});

const namedSpot = (
  id: string,
  name: string,
  sourceLocationHint: string,
  accessKinds: RiverAccessKind[],
  detail: string,
  sourceLabel: string,
  sourceUrl: string,
  caution?: string,
): RiverAccessSpot => ({
  id,
  name,
  sourceLocationHint,
  accessKinds,
  detail,
  caution,
  sourceLabel,
  sourceUrl,
  sourceLocator: directSourceLocator(name),
  verifiedOn: "2026-08-30",
});

const sourcedCoordinateSpot = (
  id: string,
  name: string,
  latitude: number,
  longitude: number,
  accessKinds: RiverAccessKind[],
  detail: string,
  sourceLabel: string,
  sourceUrl: string,
  caution?: string,
): RiverAccessSpot => ({
  id,
  name,
  latitude,
  longitude,
  accessKinds,
  detail,
  caution,
  sourceLabel,
  sourceUrl,
  sourceLocator: directSourceLocator(name),
  verifiedOn: "2026-08-30",
});

const sourceMappedSpot = (
  id: string,
  name: string,
  accessKinds: RiverAccessKind[],
  detail: string,
  sourceLabel: string,
  sourceUrl: string,
  sourceLocator: string,
  caution?: string,
): RiverAccessSpot => ({
  id,
  name,
  accessKinds,
  detail,
  caution,
  sourceLabel,
  sourceUrl,
  sourceLocator,
  verifiedOn: "2026-08-30",
});

export const RIVER_RUN_SPOT_FINDERS: Record<string, RiverSpotFinder> = {
  platte: {
    riverId: "platte",
    riverName: "Platte River",
    orientationNote:
      "Angler access is organized around Honor and the river upstream. The lower outlet corridor between Platte Lake and Lake Michigan is intentionally excluded.",
    riverRunAligned: false,
    sections: [
      {
        id: "platte_honor",
        foundationReachIds: [],
        position: "lower",
        rangeLabel: "Honor area",
        spots: [
          {
            id: "platte_river_park",
            name: "Platte River Park",
            latitude: 44.6698,
            longitude: -86.0331,
            accessKinds: ["shore_fishing", "fishing_platform", "carry_in"],
            detail:
              "Township park on Indian Hill Road with public river frontage, fishing platforms, boardwalk and carry-in launch.",
            sourceLabel: "Homestead Township / GTRLC",
            sourceUrl: PLATTE_PARK_SOURCE,
            sourceLocator:
              "The linked preserve page names Platte River Park and documents its fishing decks, boardwalk and river access.",
            verifiedOn: "2026-08-30",
          },
        ],
      },
      {
        id: "platte_upstream",
        foundationReachIds: [],
        position: "upper",
        rangeLabel: "Upstream of Honor",
        spots: [
          dnrSpot(
            "platte_veterans_memorial",
            "Veterans Memorial State Forest Campground",
            44.659344,
            -85.9440252,
            ["shore_fishing", "carry_in"],
            "Gravel public access with limited vehicle parking; Recreation Passport required.",
            undefined,
            "https://www.michigan.gov/recsearch/sfcampgroundsn-z/veteransmemorial",
          ),
          dnrSpot(
            "platte_state_forest_campground",
            "Platte River State Forest Campground",
            44.64316435,
            -85.97799558,
            ["shore_fishing", "walk_in"],
            "Gravel public access near the campground; Recreation Passport required; posted hours apply.",
            undefined,
            "https://www.michigan.gov/recsearch/sfcampgroundsn-z/PlatteRiver",
          ),
        ],
      },
    ],
  },
  betsie: {
    riverId: "betsie",
    riverName: "Betsie River",
    orientationNote:
      "The sections match the River Run corridor and end at the signed Homestead closure.",
    sections: [
      {
        id: "betsie_lake_us31",
        foundationReachIds: ["betsie_lake_to_us31"],
        position: "lower",
        rangeLabel: "Betsie Lake to US-31",
        spots: [
          dnrSpot(
            "betsie_lower_river",
            "Lower River Road",
            44.61893848,
            -86.16838592,
            ["boat_ramp"],
            "Gravel launch sharing parking with the Betsie Valley Trail; Recreation Passport required.",
            undefined,
            "https://www.michigan.gov/recsearch/trails/betsie-valley-trail",
          ),
          dnrSpot(
            "betsie_river_road",
            "River Road",
            44.61739186,
            -86.12253557,
            ["carry_in"],
            "Timber-step carry-down with a separate gravel small-craft access; Recreation Passport required.",
          ),
          dnrSpot(
            "betsie_grace_road",
            "Grace Road",
            44.60566474,
            -86.11287435,
            ["carry_in", "fishing_platform"],
            "Gravel carry-down with timber steps. The riverside pier can be unusable at low water.",
          ),
          dnrSpot(
            "betsie_us31",
            "US-31 Access",
            44.60039044,
            -86.09680169,
            ["walk_in"],
            "Gravel public access with parking; Recreation Passport and posted hours apply.",
          ),
        ],
      },
      {
        id: "betsie_us31_homestead",
        foundationReachIds: ["betsie_us31_to_homestead"],
        position: "upper",
        rangeLabel: "US-31 to signed Homestead closure",
        spots: [
          dnrSpot(
            "betsie_homestead",
            "Homestead Dam Access",
            44.59630999,
            -86.07913487,
            ["carry_in", "shore_fishing"],
            "Gravel access with timber steps; Recreation Passport required.",
            "Seasonal signed fishing closures around the barrier are mandatory. The listed access does not permit fishing inside a closure.",
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
        ],
      },
    ],
  },
  pere_marquette: {
    riverId: "pere_marquette",
    riverName: "Pere Marquette River",
    orientationNote:
      "Sections follow the public River Run orientation from Pere Marquette Lake to M-37.",
    sections: [
      {
        id: "pm_lower",
        foundationReachIds: ["pm_lower_mainstem"],
        position: "lower",
        rangeLabel: "Pere Marquette Lake to Scottville",
        spots: [
          dnrSpot(
            "pm_us31",
            "US-31 Access",
            43.92758573,
            -86.41686463,
            ["boat_ramp"],
            "Gravel public launch; Recreation Passport required.",
            undefined,
            PM_DNR_MAP,
          ),
          dnrSpot(
            "pm_scottville",
            "Scottville Riverside Park",
            43.94521842,
            -86.28206387,
            ["boat_ramp", "shore_fishing"],
            "Municipal paved public access; observe park rules and posted hours.",
          ),
        ],
      },
      {
        id: "pm_middle",
        foundationReachIds: ["pm_middle_mainstem"],
        position: "middle",
        rangeLabel: "Scottville to Maple Leaf",
        spots: [
          sourcedCoordinateSpot(
            "pm_indian_bridge",
            "Indian Bridge River Access",
            43.93706,
            -86.18209,
            ["boat_ramp", "shore_fishing"],
            "Public river access at the downstream end of the seasonally permitted Forest Service float reach.",
            "U.S. Forest Service / Michigan Water Trails",
            "https://www.michiganwatertrails.org/location.asp?aid=1207&ait=av",
            "Seasonal watercraft permit rules apply; verify current fishing regulations for this reach.",
          ),
          dnrSpot(
            "pm_walhalla",
            "Walhalla Road Bridge",
            43.93290575,
            -86.11548574,
            ["boat_ramp"],
            "Gravel public launch; Recreation Passport required.",
            undefined,
            PM_DNR_MAP,
          ),
          dnrSpot(
            "pm_sulak",
            "Sulak / Upper Branch",
            43.92605939,
            -86.00571588,
            ["boat_ramp"],
            "Gravel public launch; Recreation Passport required.",
            undefined,
            PM_DNR_MAP,
          ),
        ],
      },
      {
        id: "pm_upper",
        foundationReachIds: ["pm_upper_mainstem"],
        position: "upper",
        rangeLabel: "Maple Leaf to M-37",
        spots: [
          namedSpot(
            "pm_rainbow_rapids",
            "Rainbow Rapids Access",
            "Rainbow Rapids Boat Launch Access, Baldwin, MI",
            ["shore_fishing", "carry_in"],
            "Forest Service river access and parking area in the national scenic corridor.",
            "U.S. Forest Service",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/rainbow-rapids-boat-launch",
          ),
          namedSpot(
            "pm_bowman_bridge",
            "Bowman Bridge River Access",
            "Bowman Bridge Campground and River Access, Baldwin, MI",
            ["shore_fishing", "boat_ramp", "walk_in"],
            "Forest Service campground and river access popular with anglers and paddlers.",
            "U.S. Forest Service",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/bowman-bridge-river-access",
            "Campground or day-use fees and seasonal watercraft permits may apply.",
          ),
          sourcedCoordinateSpot(
            "pm_gleasons",
            "Gleason's Landing",
            43.871557,
            -85.921563,
            ["shore_fishing", "boat_ramp"],
            "Forest Service campground and launch with riverside angler trails.",
            "U.S. Forest Service — Gleason's Landing",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/gleasons-landing-campground",
            "Seasonal watercraft permits and site fees may apply.",
          ),
          sourcedCoordinateSpot(
            "pm_claybanks",
            "Claybanks River Access",
            43.870053,
            -85.883319,
            ["shore_fishing", "carry_in"],
            "Forest Service corridor access; use the signed public entrance.",
            "U.S. Forest Service — Claybanks Campground",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/claybanks-campground",
          ),
          sourcedCoordinateSpot(
            "pm_green_cottage",
            "Green Cottage Access",
            43.860551,
            -85.881054,
            ["shore_fishing", "carry_in"],
            "Forest Service river access with improved steps and angler entry.",
            "U.S. Forest Service — Green Cottage River Access",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/green-cottage-river-access",
          ),
          sourcedCoordinateSpot(
            "pm_72nd_angler",
            "72nd Street Angler Trail",
            43.857719,
            -85.87164,
            ["shore_fishing", "walk_in"],
            "Designated Forest Service angler trail and fishing access.",
            "U.S. Forest Service — 72nd St. Angler Access",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/72nd-st-angler-access",
            "Special tackle and catch-and-release rules apply in this reach; verify current regulations.",
          ),
          dnrSpot(
            "pm_m37",
            "M-37 Bridge Access",
            43.85738094,
            -85.85035403,
            ["boat_ramp", "shore_fishing"],
            "Paved public access at the River Run upstream endpoint; Recreation Passport required.",
            undefined,
            PM_DNR_MAP,
          ),
        ],
      },
    ],
  },
  muskegon: {
    riverId: "muskegon",
    riverName: "Muskegon River",
    orientationNote:
      "Public entrances are grouped from Muskegon Lake upstream to Croton Dam. Shore suitability is stated only where DNR identifies it.",
    sections: [
      {
        id: "muskegon_lower",
        foundationReachIds: ["muskegon_lake_to_m120"],
        position: "lower",
        rangeLabel: "Muskegon Lake to M-120",
        spots: [
          dnrSpot(
            "muskegon_sheridan",
            "Sheridan Road",
            43.260393,
            -86.1837306,
            ["boat_ramp"],
            "State game-area gravel ramp and parking.",
            "DNR describes the entrance drive and launch area as poor; inspect conditions before entering.",
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
          dnrSpot(
            "muskegon_mill_iron",
            "Mill Iron Road End",
            43.268893,
            -86.1504711,
            ["boat_ramp"],
            "Gravel ramp with roadside parking for roughly eight vehicle/trailer combinations.",
            undefined,
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
          dnrSpot(
            "muskegon_holton_duck",
            "Holton-Duck Lake Road",
            43.2979916,
            -86.0789742,
            ["boat_ramp", "shore_fishing"],
            "State game-area dirt entrance with boat and shore access.",
            undefined,
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
          dnrSpot(
            "muskegon_maple_island",
            "Maple Island Access",
            43.318397,
            -86.033468,
            ["boat_ramp", "carry_in"],
            "Gravel public access; current local fee and Recreation Passport requirements may apply.",
            undefined,
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
        ],
      },
      {
        id: "muskegon_middle",
        foundationReachIds: ["muskegon_m120_to_newaygo"],
        position: "middle",
        rangeLabel: "M-120 to Newaygo",
        spots: [
          dnrSpot(
            "muskegon_bridgeton",
            "Bridgeton Township Park",
            43.346871,
            -85.9397569,
            ["boat_ramp", "carry_in", "fishing_platform"],
            "Municipal launch with two carry-downs; local daily or annual fee posted.",
            undefined,
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
          dnrSpot(
            "muskegon_anderson",
            "Anderson Flats",
            43.388805,
            -85.828582,
            ["boat_ramp"],
            "Dirt parking and concrete ramp below Newaygo.",
            "Felch Street has a steep grade; the site can flood seasonally.",
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
          dnrSpot(
            "muskegon_bridge",
            "Bridge Street Access",
            43.415229,
            -85.811405,
            ["boat_ramp", "shore_fishing"],
            "DNR launch with a small shore-fishing area in Newaygo.",
            undefined,
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
          dnrSpot(
            "muskegon_riverfront",
            "Newaygo Riverfront Park",
            43.417953,
            -85.806805,
            ["shore_fishing", "walk_in"],
            "City park walkway provides shore access between Bridge Street and M-37.",
            undefined,
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
          dnrSpot(
            "muskegon_henning",
            "Henning Park",
            43.418988,
            -85.789999,
            ["boat_ramp", "shore_fishing"],
            "County park with paved ramp and shore access upstream and downstream; park fee may apply.",
            undefined,
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
        ],
      },
      {
        id: "muskegon_upper",
        foundationReachIds: ["muskegon_croton_tailwater"],
        position: "upper",
        rangeLabel: "Newaygo to Croton Dam",
        spots: [
          dnrSpot(
            "muskegon_croton_drive",
            "Croton Drive Walk-In",
            43.42587,
            -85.7723869,
            ["walk_in", "shore_fishing"],
            "Half-mile dirt walking path to public river frontage.",
            "The route drops roughly 100 feet over hills; this is not an easy-access site.",
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
          dnrSpot(
            "muskegon_high_rollway",
            "High Rollway / Thornapple Street",
            43.414845,
            -85.719017,
            ["boat_ramp", "shore_fishing"],
            "Public launch with roughly a quarter-mile of shore access downstream.",
            undefined,
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
          dnrSpot(
            "muskegon_72nd",
            "72nd Street Walk-In",
            43.422816,
            -85.6950964,
            ["walk_in", "shore_fishing"],
            "Walk-in access with a roughly quarter-mile path from the parking area.",
            "The final two-track is very rough and may be impassable when wet.",
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
          dnrSpot(
            "muskegon_pine",
            "Pine Street Access",
            43.423439,
            -85.675479,
            ["boat_ramp", "shore_fishing", "wade_access"],
            "DNR launch with a small shore/wade area.",
            "The Muskegon is large and swift; DNR advises that wading is generally limited to river edges.",
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
          dnrSpot(
            "muskegon_besemer",
            "Charles Besemer River Park",
            43.435561,
            -85.66678,
            ["boat_ramp", "shore_fishing", "fishing_platform", "walk_in"],
            "Croton Dam-area public access with paved launch, barrier-free path, fishing platform and public-land trail.",
            "Dam-safety boundaries and posted closures control. The boat ramp is steep.",
            DNR_CENTRAL_FISHERIES_SOURCE,
          ),
        ],
      },
    ],
  },
  white: {
    riverId: "white",
    riverName: "White River",
    orientationNote:
      "Lower, Middle and Upper section boundaries use recognizable landmarks because public access is uneven. The lake-run corridor ends below Hesperia Dam; private liveries and upstream landings are excluded.",
    sections: [
      {
        id: "white_lower",
        foundationReachIds: ["white_lower_river"],
        position: "lower",
        rangeLabel: "White Lake to Fruitvale Road",
        spots: [
          {
            id: "white_covell",
            name: "Covell Park",
            latitude: 43.41379,
            longitude: -86.35087,
            accessKinds: ["shore_fishing", "boat_ramp", "walk_in"],
            detail:
              "Municipal park at 124 Hanson Street with small-boat launch, fishing bridge, parking and public restroom.",
            sourceLabel: "Michigan Water Trails / City of Whitehall",
            sourceUrl:
              "https://www.michiganwatertrails.org/location.asp?aid=160&ait=av",
            sourceLocator:
              "The linked Michigan Water Trails page names Covell Park and lists its address and public amenities.",
            verifiedOn: "2026-08-30",
          },
        ],
      },
      {
        id: "white_forest",
        foundationReachIds: ["white_forest_corridor"],
        position: "middle",
        rangeLabel: "Fruitvale Road to Pines Point",
        spots: [
          namedSpot(
            "white_hilts",
            "Hilt's Landing",
            "Hilt's Landing, White River, Montague, MI",
            ["carry_in"],
            "Named public river access on the official White River Water Trail map.",
            "Newaygo County Tourism Council water-trail map",
            WHITE_RIVER_MAP,
          ),
          namedSpot(
            "white_diamond",
            "Diamond Point Access",
            "Diamond Point Access and Campground, White River, MI",
            ["shore_fishing", "carry_in"],
            "Public campground access identified for wade-in fishing on the corridor map.",
            "Newaygo County Tourism Council water-trail map",
            WHITE_RIVER_MAP,
          ),
          namedSpot(
            "white_sischo",
            "Sischo Bayou River Access",
            "Sischo Bayou River Access, White River, MI",
            ["carry_in"],
            "Named public access on the official corridor map.",
            "Newaygo County Tourism Council water-trail map",
            WHITE_RIVER_MAP,
          ),
          namedSpot(
            "white_podunk",
            "Podunk Launch",
            "Podunk Launch, White River, Michigan",
            ["carry_in"],
            "Named public launch on the official White River corridor map.",
            "Newaygo County Tourism Council water-trail map",
            WHITE_RIVER_MAP,
          ),
          namedSpot(
            "white_pines",
            "Pines Point Access",
            "Pines Point Campground, Hesperia, MI",
            ["shore_fishing", "wade_access", "carry_in"],
            "Forest Service campground/access identified for wade-in fishing.",
            "Newaygo County Tourism Council / U.S. Forest Service",
            WHITE_RIVER_MAP,
          ),
        ],
      },
      {
        id: "white_upper",
        foundationReachIds: ["white_upper_accessible_corridor"],
        position: "upper",
        rangeLabel: "Pines Point to Hesperia Dam",
        spots: [
          namedSpot(
            "white_st_hubert",
            "St. Hubert Angler Parking",
            "St Hubert Angler Parking, Hesperia, MI",
            ["walk_in", "shore_fishing"],
            "Designated angler parking shown on the official corridor map.",
            "Newaygo County Tourism Council water-trail map",
            WHITE_RIVER_MAP,
          ),
          namedSpot(
            "white_taylor",
            "Taylor Bridge Landing",
            "Taylor Bridge Landing, Hesperia, MI",
            ["carry_in", "shore_fishing"],
            "Named public landing on the official corridor map.",
            "Newaygo County Tourism Council water-trail map",
            WHITE_RIVER_MAP,
          ),
          namedSpot(
            "white_weaver",
            "Vida Weaver Park Access",
            "Vida Weaver Park, Hesperia, MI",
            ["shore_fishing", "fishing_platform", "walk_in"],
            "Public park access near Hesperia; follow park and dam-area signs.",
            "Newaygo County Tourism Council water-trail map",
            WHITE_RIVER_MAP,
            "Do not enter posted dam or private-property areas.",
          ),
        ],
      },
    ],
  },
  big_manistee: {
    riverId: "big_manistee",
    riverName: "Big Manistee River",
    orientationNote:
      "Only the migratory corridor below Tippy Dam is included; similarly named upper-Manistee sites are excluded.",
    sections: [
      {
        id: "manistee_lower",
        foundationReachIds: ["big_manistee_bear_creek_to_m55"],
        position: "lower",
        rangeLabel: "M-55 to Bear Creek",
        spots: [
          namedSpot(
            "manistee_rainbow",
            "Rainbow Bend",
            "Rainbow Bend Manistee River Access, Michigan",
            ["boat_ramp", "shore_fishing"],
            "Forest Service public river access in the lower migratory corridor.",
            "U.S. Forest Service",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/rainbow-bend-river-access",
          ),
          namedSpot(
            "manistee_udell",
            "Udell Rollways River Access",
            "Udell Rollways Manistee River Access, Michigan",
            ["shore_fishing", "walk_in"],
            "Forest Service public access in the lower national recreation river corridor.",
            "U.S. Forest Service — Udell Rollways Day Use Area",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/udell-rollways-day-use-area",
          ),
        ],
      },
      {
        id: "manistee_middle",
        foundationReachIds: ["big_manistee_high_bridge_to_bear_creek"],
        position: "middle",
        rangeLabel: "Bear Creek to High Bridge",
        spots: [
          namedSpot(
            "manistee_bear",
            "Bear Creek Access",
            "Bear Creek Manistee River Access, Michigan",
            ["boat_ramp", "shore_fishing"],
            "Public access at the middle/lower orientation marker.",
            "U.S. Forest Service",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/bear-creek-river-access",
          ),
          namedSpot(
            "manistee_blacksmith",
            "Blacksmith Bayou",
            "Blacksmith Bayou Manistee River Access, Michigan",
            ["boat_ramp", "shore_fishing"],
            "Forest Service public access between Bear Creek and High Bridge.",
            "U.S. Forest Service",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/blacksmith-bayou-river-access",
          ),
          namedSpot(
            "manistee_high_bridge",
            "High Bridge Access",
            "High Bridge Manistee River Access, Brethren, MI",
            ["boat_ramp", "shore_fishing"],
            "Forest Service public landing at the middle/upper orientation marker.",
            "U.S. Forest Service",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/high-bridge-river-access",
          ),
        ],
      },
      {
        id: "manistee_upper",
        foundationReachIds: ["big_manistee_tippy_tailwater"],
        position: "upper",
        rangeLabel: "High Bridge to Tippy Dam",
        spots: [
          namedSpot(
            "manistee_sawdust",
            "Sawdust Hole River Access",
            "Sawdust Hole Manistee River Access, Michigan",
            ["boat_ramp", "shore_fishing"],
            "Forest Service public river access upstream from High Bridge.",
            "U.S. Forest Service — Sawdust Hole River Access",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/sawdust-hole-river-access",
          ),
          namedSpot(
            "manistee_suicide_bend",
            "Suicide Bend River Access",
            "Suicide Bend Manistee River Access, Michigan",
            ["carry_in", "shore_fishing"],
            "Forest Service fishing access upstream from High Bridge in the Tippy Dam reach.",
            "U.S. Forest Service — Suicide Bend Fishing Access",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/suicide-bend-fishing-access",
          ),
          namedSpot(
            "manistee_tunk_hole",
            "Tunk Hole River Access",
            "Tunk Hole Manistee River Access, Michigan",
            ["carry_in", "shore_fishing"],
            "Forest Service angler access upstream from High Bridge in the Tippy Dam reach.",
            "U.S. Forest Service — Tunk Hole Angler Access",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/tunk-hole-angler-access",
          ),
          dnrSpot(
            "manistee_tippy_lower",
            "Tippy Dam Recreation Area — Lower Access",
            44.25985169,
            -85.9432359,
            ["boat_ramp", "shore_fishing", "walk_in"],
            "Paved public access below Tippy Dam; Recreation Passport required.",
            "Dam-safety boundaries, special river regulations and posted closures control.",
          ),
        ],
      },
    ],
  },
  st_joseph: {
    riverId: "st_joseph",
    riverName: "St. Joseph River",
    supportedStates: ["MI"],
    orientationNote:
      "This Michigan inventory stops at the state line. Indiana access is not included in this release.",
    sections: [
      {
        id: "stjoe_lower",
        foundationReachIds: ["st_joseph_lower_michigan"],
        position: "lower",
        rangeLabel: "Lake Michigan to Berrien Springs",
        spots: [
          namedSpot(
            "stjoe_silver_beach",
            "Silver Beach South Pier Access",
            "Silver Beach County Park, St Joseph, MI",
            ["shore_fishing", "fishing_platform", "walk_in"],
            "County park walkway provides public access to the South Pier at the river mouth.",
            "Berrien County Parks",
            "https://www.berriencounty.org/444/Fishing-Access",
            "The pier is an unguarded navigation structure. Stay off during storms, ice and high seas.",
          ),
          namedSpot(
            "stjoe_paddler_park",
            "Paddler Park at East Basin",
            "213 Upton Dr, St Joseph, MI 49085",
            ["carry_in", "shore_fishing"],
            "City water-trail access with carry-in launch and fishing near the river mouth.",
            "City of St. Joseph / Southwest Michigan",
            "https://swmichigan.org/member/paddler-park-at-east-basin",
          ),
          dnrSpot(
            "stjoe_benton",
            "Benton Harbor Access",
            42.10404914,
            -86.46531246,
            ["boat_ramp"],
            "Public river launch in Benton Harbor.",
          ),
          dnrSpot(
            "stjoe_riverview",
            "Riverview Drive Carry-In",
            42.10716603,
            -86.46490044,
            ["carry_in"],
            "Municipal carry-down with city parking; built in 2022.",
          ),
          namedSpot(
            "stjoe_yarborough",
            "Charles Yarborough Park",
            "Charles Yarborough Park, Benton Harbor, MI",
            ["shore_fishing", "walk_in"],
            "Free municipal shore-fishing access on Riverview Drive.",
            "City of Benton Harbor / Southwest Michigan",
            "https://swmichigan.org/member/benton-harbor-parks",
          ),
          namedSpot(
            "stjoe_riverview_park",
            "Riverview Park",
            "2927 Niles Road, St Joseph, MI",
            ["boat_ramp", "shore_fishing", "walk_in"],
            "City park with riverbank fishing, launch, trails and dawn-to-dusk access.",
            "City of St. Joseph",
            "https://swmichigan.org/member/riverview-park",
          ),
          dnrSpot(
            "stjoe_jasper",
            "Jasper Dairy Road",
            42.01097975,
            -86.39137161,
            ["boat_ramp"],
            "Public river launch listed in the state inventory.",
          ),
        ],
      },
      {
        id: "stjoe_middle",
        foundationReachIds: [
          "st_joseph_middle_michigan",
          "st_joseph_niles",
        ],
        position: "upper",
        rangeLabel: "Berrien Springs to the Michigan–Indiana line",
        spots: [
          {
            id: "stjoe_shamrock",
            name: "Shamrock Park",
            latitude: 41.954012,
            longitude: -86.335829,
            accessKinds: ["boat_ramp", "shore_fishing"],
            detail:
              "Village-owned year-round concrete launch and bank access near Berrien Springs Dam; use fee applies.",
            caution:
              "Stay outside dam-safety boundaries and follow all posted fish-ladder restrictions.",
            sourceLabel:
              "Michigan DNR Trout Trails / Village of Berrien Springs",
            sourceUrl:
              "https://www.dnr.state.mi.us/publications/pdfs/ArcGISOnline/StoryMaps/fish_troutTrails/PDFs/TT2015119.pdf",
            sourceLocator:
              "The linked Michigan DNR Trout Trail sheet names Shamrock Park and documents the public fishing access.",
            verifiedOn: "2026-08-30",
          },
          namedSpot(
            "stjoe_fishermans_haven",
            "Fisherman's Haven",
            "Fisherman's Haven, Berrien Springs, MI",
            ["shore_fishing", "carry_in"],
            "Public shoreline and carry-in access below Lake Chapin Dam.",
            "Village of Berrien Springs",
            "https://www.villageofberriensprings.com/spring-in-berrien-springs/",
            "Follow the paved entrance and signed public boundary; dam-safety restrictions control.",
          ),
          dnrSpot(
            "stjoe_buchanan",
            "Buchanan Access",
            41.85720229,
            -86.35708009,
            ["boat_ramp"],
            "Public river launch in Buchanan.",
          ),
          namedSpot(
            "stjoe_niles_marmont",
            "Marmont Street Access",
            "Marmont Street St Joseph River Access, Niles, MI",
            ["boat_ramp", "shore_fishing"],
            "City-documented public boat ramp at Marmont Street and River Street, with supporting infrastructure including a fishing pier.",
            "City of Niles Community Recreation Plan",
            NILES_RECREATION_PLAN,
          ),
          namedSpot(
            "stjoe_niles_river_park",
            "Riverfront Park South Access",
            "Riverfront Park South, Niles, MI",
            ["carry_in", "shore_fishing"],
            "City-documented public carry-down access for canoes and kayaks with supporting infrastructure.",
            "City of Niles Community Recreation Plan",
            NILES_RECREATION_PLAN,
          ),
          namedSpot(
            "stjoe_niles_bond",
            "Bond Street Access",
            "Bond Street St Joseph River Access, Niles, MI",
            ["boat_ramp"],
            "City-documented public unimproved boating access for trailered boats, without a formal launch ramp.",
            "City of Niles Community Recreation Plan",
            NILES_RECREATION_PLAN,
          ),
        ],
      },
    ],
  },
  grand: {
    riverId: "grand",
    riverName: "Grand River",
    orientationNote:
      "The Grand has many public launches. Upper access beyond Webber is for Coho and Steelhead only; Chinook River Run guidance stops at Webber Dam. Access names do not imply bank-fishing or safe wading.",
    sections: [
      {
        id: "grand_lower",
        foundationReachIds: ["grand_lower"],
        position: "lower",
        rangeLabel: "Grand Haven to Sixth Street",
        spots: [
          dnrSpot("grand_indian", "Indian Channel", 43.03227719, -86.14577446, [
            "boat_ramp",
          ], "Gravel public launch; Recreation Passport required."),
          dnrSpot(
            "grand_robinson",
            "Robinson Access",
            43.03972224,
            -86.08389022,
            ["boat_ramp"],
            "Gravel public launch; Recreation Passport required.",
          ),
          sourcedCoordinateSpot(
            "grand_bass",
            "Bass River Recreation Area",
            43.00551647,
            -86.01357259,
            ["boat_ramp"],
            "Two-lane gravel launch; Recreation Passport and posted hours apply.",
            "Michigan DNR — Bass River Recreation Area",
            "https://www.michigan.gov/recsearch/parks/bassriver",
          ),
          sourcedCoordinateSpot(
            "grand_grandriverpark",
            "Grand River Park",
            42.94450465,
            -85.85465797,
            ["carry_in"],
            "Municipal paved carry-down with posted park hours.",
            "Ottawa County Parks",
            "https://miottawa.org/park-locations/grand-river-park/",
          ),
          dnrSpot(
            "grand_grandville",
            "Grandville Access",
            42.91301832,
            -85.76817979,
            ["boat_ramp", "carry_in"],
            "Municipal gravel public access; park rules apply.",
          ),
          dnrSpot("grand_johnson", "Johnson Park", 42.93025932, -85.75635125, [
            "boat_ramp",
          ], "County gravel public launch."),
        ],
      },
      {
        id: "grand_middle",
        foundationReachIds: ["grand_middle_passage"],
        position: "middle",
        rangeLabel: "Sixth Street to Webber Dam",
        spots: [
          sourcedCoordinateSpot(
            "grand_riverside2",
            "Riverside Park River Access",
            43.0194346,
            -85.66280288,
            ["carry_in"],
            "Municipal accessible kayak launch and public river access above Sixth Street; posted park hours apply.",
            "City of Grand Rapids Parks & Recreation",
            "https://www.grandrapidsmi.gov/departments/parks-recreation/recreation/kayaking/",
          ),
          dnrSpot(
            "grand_rogue",
            "Rogue River Mouth",
            43.06312097,
            -85.58514776,
            ["boat_ramp"],
            "Two-lane gravel launch above Sixth Street; Recreation Passport required.",
            "Site may flood in spring.",
          ),
          dnrSpot(
            "grand_knapp",
            "Knapp Street Bridge",
            43.00552729,
            -85.54169763,
            ["boat_ramp"],
            "Gravel public launch above Sixth Street; Recreation Passport required.",
            "Site may flood in spring.",
          ),
          dnrSpot("grand_ada", "Ada Access", 42.95590346, -85.47664864, [
            "boat_ramp",
          ], "Gravel public launch above Sixth Street; Recreation Passport required."),
          dnrSpot(
            "grand_saranac",
            "Saranac Access",
            42.93276619,
            -85.21466662,
            ["boat_ramp"],
            "Municipal paved public launch.",
          ),
          dnrSpot(
            "grand_riverside",
            "Riverside Drive",
            42.95965071,
            -85.13047872,
            ["carry_in"],
            "DNR carry-down with nearby parking; Recreation Passport and posted hours apply.",
          ),
          dnrSpot(
            "grand_ionia",
            "Ionia Fairground",
            42.97391498,
            -85.07047239,
            ["boat_ramp"],
            "Municipal launch reached through the fairgrounds; check event and gate access.",
          ),
          dnrSpot("grand_lyons", "Lyons Access", 42.97757735, -84.94168379, [
            "boat_ramp",
          ], "Municipal grass/soil public launch."),
          dnrSpot(
            "grand_webber",
            "Webber Impoundment Access",
            42.95395555,
            -84.90492931,
            ["boat_ramp"],
            "DNR-operated gravel launch on leased Consumers Energy property; Recreation Passport required.",
            "Dam boundaries and posted energy-company rules control.",
          ),
        ],
      },
      {
        id: "grand_upper",
        foundationReachIds: ["grand_upper_accessible"],
        position: "upper",
        rangeLabel: "Webber Dam to Moores Park",
        eligibleSpecies: ["coho_salmon", "steelhead"],
        spots: [
          dnrSpot(
            "grand_towner",
            "Towner Road",
            42.82365995,
            -84.93126322,
            ["walk_in"],
            "State game-area gravel access.",
            "A posted gate closes the site February through April.",
          ),
          dnrSpot("grand_jaycee", "Jaycee Park", 42.75043451, -84.73966619, [
            "boat_ramp",
            "carry_in",
          ], "Municipal paved launch and accessible carry-down."),
          sourcedCoordinateSpot(
            "grand_fitzgerald",
            "Fitzgerald Park Dam Portage",
            42.76271608,
            -84.76242817,
            ["carry_in", "fishing_platform"],
            "County-managed dam portage with upstream dock and downstream natural path; posted hours apply.",
            "Eaton County Parks",
            "https://www.eatoncounty.org/Facilities/Facility/Details/Fitzgerald-Park-4",
            "Use the signed portage and remain outside dam-safety boundaries.",
          ),
          dnrSpot(
            "grand_moores",
            "Moores Park",
            42.71788604,
            -84.56173205,
            ["carry_in"],
            "Municipal carry-down at the River Run endpoint; posted 8 a.m.–dusk hours.",
            "Dam-safety boundaries and species-specific River Run endpoints control.",
          ),
        ],
      },
    ],
  },
  milwaukee: {
    riverId: "milwaukee",
    riverName: "Milwaukee River",
    orientationNote:
      "Sections match the River Run corridor from Lake Michigan to Bridge Street Dam. Only named public river-access properties are included; the signed Kletzsch fish-passage refuge is closed year-round.",
    safetyLink: {
      label: "CHECK CURRENT WISCONSIN RULES →",
      url: WI_FISHING_RULES,
    },
    sections: [
      {
        id: "milwaukee_harbor_downtown",
        foundationReachIds: ["milwaukee_harbor_downtown"],
        position: "lower",
        rangeLabel: "Lake Michigan to North Avenue",
        spots: [
          sourceMappedSpot(
            "milwaukee_caesars",
            "Caesar's Park",
            ["shore_fishing", "walk_in"],
            "DNR-documented stream access downstream of North Avenue.",
            "Wisconsin DNR fall shore-fishing guide",
            WI_FALL_FISHING_GUIDE,
            "On page 1 of the linked guide, find item 13, “Milwaukee River at Caesar's Park.”",
          ),
        ],
      },
      {
        id: "milwaukee_urban_greenway",
        foundationReachIds: ["milwaukee_urban_greenway"],
        position: "middle",
        rangeLabel: "North Avenue to Kletzsch Park",
        spots: [
          sourceMappedSpot(
            "milwaukee_riverside",
            "Riverside Park",
            ["shore_fishing", "walk_in"],
            "Public park and greenway access identified on the DNR river-access map.",
            "Wisconsin DNR Milwaukee River Access Sites",
            WI_MILWAUKEE_ACCESS_MAP,
            "On the linked one-page access map, find “Riverside Park.”",
          ),
          sourceMappedSpot(
            "milwaukee_gordon",
            "Gordon Park",
            ["shore_fishing", "walk_in"],
            "Public park access on the urban Milwaukee River corridor.",
            "Wisconsin DNR Milwaukee River Access Sites",
            WI_MILWAUKEE_ACCESS_MAP,
            "On the linked one-page access map, find “Gordon Park.”",
          ),
          sourceMappedSpot(
            "milwaukee_pleasant_valley",
            "Pleasant Valley Park",
            ["shore_fishing", "walk_in"],
            "Public greenway access identified on the DNR river-access map.",
            "Wisconsin DNR Milwaukee River Access Sites",
            WI_MILWAUKEE_ACCESS_MAP,
            "On the linked one-page access map, find “Pleasant Valley Park.”",
          ),
          sourceMappedSpot(
            "milwaukee_kern",
            "Kern Park",
            ["shore_fishing", "wade_access"],
            "DNR-documented stream access with extensive fishable river frontage.",
            "Wisconsin DNR fall shore-fishing guide",
            WI_FALL_FISHING_GUIDE,
            "On page 1 of the linked guide, find item 14, “Milwaukee River at Kern Park.”",
          ),
          sourceMappedSpot(
            "milwaukee_cambridge_woods",
            "Cambridge Woods",
            ["shore_fishing", "walk_in"],
            "Public greenway access identified on the DNR river-access map.",
            "Wisconsin DNR Milwaukee River Access Sites",
            WI_MILWAUKEE_ACCESS_MAP,
            "On the linked one-page access map, find “Cambridge Woods.”",
          ),
          sourceMappedSpot(
            "milwaukee_east_side_trail",
            "East Side Bike Trail",
            ["walk_in"],
            "Public trail access along the lower Urban Greenway corridor.",
            "Wisconsin DNR Milwaukee River Access Sites",
            WI_MILWAUKEE_ACCESS_MAP,
            "On the linked one-page access map, find “East Side Bike Trail.”",
          ),
          sourceMappedSpot(
            "milwaukee_estabrook",
            "Estabrook Park",
            ["shore_fishing", "wade_access"],
            "DNR-documented stream access with extensive fishable river frontage.",
            "Wisconsin DNR fall shore-fishing guide",
            WI_FALL_FISHING_GUIDE,
            "On page 1 of the linked guide, find item 15, “Milwaukee River at Estabrook Park.”",
          ),
          sourceMappedSpot(
            "milwaukee_lincoln",
            "Lincoln Park",
            ["shore_fishing", "walk_in"],
            "Public park access identified on the DNR river-access map.",
            "Wisconsin DNR Milwaukee River Access Sites",
            WI_MILWAUKEE_ACCESS_MAP,
            "On the linked one-page access map, find “Lincoln Park.”",
          ),
        ],
      },
      {
        id: "milwaukee_north_shore",
        foundationReachIds: ["milwaukee_north_shore"],
        position: "upper",
        rangeLabel: "Kletzsch Park to Bridge Street Dam",
        spots: [
          sourceMappedSpot(
            "milwaukee_kletzsch",
            "Kletzsch Park",
            ["shore_fishing", "wade_access"],
            "DNR-documented stream access at the start of the North Shore reach.",
            "Wisconsin DNR fall shore-fishing guide",
            WI_FALL_FISHING_GUIDE,
            "On page 1 of the linked guide, find item 16, “Milwaukee River at Kletzsch Park.”",
            "The signed fish-passage refuge is closed to fishing year-round. Obey refuge boundaries and dam-safety signs.",
          ),
          sourceMappedSpot(
            "milwaukee_molyneux",
            "Molyneux Park",
            ["shore_fishing", "carry_in"],
            "Village riverfront park with fishing access, public parking and a canoe launch.",
            "Village of Thiensville",
            "https://www.village.thiensville.wi.us/Facilities/Facility/Details/Molyneux-Park-1",
            "The linked official facility page lists fishing, parking and canoe access at Molyneux Park.",
          ),
          sourceMappedSpot(
            "milwaukee_thiensville_village",
            "Thiensville Village Park",
            ["shore_fishing", "boat_ramp"],
            "Village riverfront park with shore access and a public boat launch.",
            "Village of Thiensville",
            "https://www.village.thiensville.wi.us/145/Fishing",
            "The linked official fishing page names Village Park and confirms boat and shore access.",
          ),
          sourceMappedSpot(
            "milwaukee_lime_kiln",
            "Lime Kiln Park",
            ["shore_fishing", "carry_in"],
            "Grafton public park with fishing, canoe access and designated parking.",
            "Village of Grafton Parks",
            "https://www.villageofgraftonwi.gov/387/Lime-Kiln-Park",
            "The linked official park page lists fishing, a canoe ramp and public parking at Lime Kiln Park.",
            "Village rules prohibit wading or swimming in the Milwaukee River.",
          ),
        ],
      },
    ],
  },
  sheboygan: {
    riverId: "sheboygan",
    riverName: "Sheboygan River",
    orientationNote:
      "Sections match the River Run corridor from Lake Michigan to Waelderhaus Dam. Named public accesses do not make the surrounding Kohler shoreline public.",
    safetyLink: {
      label: "CHECK CURRENT WISCONSIN RULES →",
      url: WI_FISHING_RULES,
    },
    sections: [
      {
        id: "sheboygan_harbor_lower_city",
        foundationReachIds: ["sheboygan_harbor_lower_city"],
        position: "lower",
        rangeLabel: "Lake Michigan to Kiwanis Park",
        spots: [
          sourceMappedSpot(
            "sheboygan_eighth_street",
            "Eighth Street Boat Ramp",
            ["boat_ramp", "shore_fishing"],
            "Public lower-river ramp identified on the Wisconsin DNR access map.",
            "Wisconsin DNR Sheboygan River Access Sites",
            WI_SHEBOYGAN_ACCESS_MAP,
            "On the linked one-page access map, find “Eigth Street Boat Ramp” (the source's spelling).",
          ),
        ],
      },
      {
        id: "sheboygan_urban_river",
        foundationReachIds: ["sheboygan_urban_river"],
        position: "middle",
        rangeLabel: "Kiwanis Park to I-43",
        spots: [
          sourceMappedSpot(
            "sheboygan_kiwanis",
            "Kiwanis Park",
            ["shore_fishing", "fishing_platform", "carry_in"],
            "Public park with extensive river frontage, fishing platforms and carry-in access.",
            "Wisconsin DNR Sheboygan River Access Sites",
            WI_SHEBOYGAN_ACCESS_MAP,
            "On the linked one-page access map, find “Kiwanis Park.”",
          ),
          sourceMappedSpot(
            "sheboygan_esslingen",
            "Esslingen Park",
            ["shore_fishing", "wade_access", "carry_in"],
            "DNR-mapped park access with documented wadable river access upstream and downstream.",
            "Wisconsin DNR Sheboygan River Access Sites",
            WI_SHEBOYGAN_ACCESS_MAP,
            "On the linked one-page access map, find “Esslingen Park.”",
          ),
          sourceMappedSpot(
            "sheboygan_taylor_wayside",
            "Taylor Drive / Indiana Avenue Wayside",
            ["shore_fishing", "walk_in"],
            "Public wayside with improved access from its parking area to the riverbank.",
            "Wisconsin DNR Sheboygan River Access Sites",
            WI_SHEBOYGAN_ACCESS_MAP,
            "On the linked one-page access map, find “Wayside” beside Taylor Drive and County PP.",
          ),
        ],
      },
      {
        id: "sheboygan_kohler",
        foundationReachIds: ["sheboygan_kohler"],
        position: "upper",
        rangeLabel: "I-43 to Waelderhaus Dam",
        spots: [
          sourceMappedSpot(
            "sheboygan_kohler_water_utility",
            "Kohler Water Utility Access",
            ["shore_fishing", "wade_access"],
            "DNR-documented wadable access at the Village of Kohler water utility.",
            "Wisconsin DNR fall shore-fishing guide",
            WI_FALL_FISHING_GUIDE,
            "On page 1 of the linked guide, find item 30, “Sheboygan River at Kohler.”",
            "Use only the signed public access. The surrounding Kohler shoreline is not universally public, and the corridor ends below Waelderhaus Dam.",
          ),
        ],
      },
    ],
  },
  root: {
    riverId: "root",
    riverName: "Root River",
    orientationNote:
      "Sections match the Lake Michigan-to-Steelhead-Facility River Run corridor. Colonial Park, Quarry Lake Park and Horlick Dam are upstream of this product endpoint and are intentionally excluded.",
    safetyLink: {
      label: "CHECK CURRENT WISCONSIN RULES →",
      url: WI_FISHING_RULES,
    },
    sections: [
      {
        id: "root_harbor_downtown",
        foundationReachIds: ["root_harbor_downtown"],
        position: "lower",
        rangeLabel: "Lake Michigan to 6th Street",
        spots: [
          sourceMappedSpot(
            "root_sixth_street",
            "Root River at 6th Street",
            ["shore_fishing", "walk_in"],
            "DNR-documented shore-fishing access upstream and downstream of 6th Street.",
            "Wisconsin DNR Root River Access Sites",
            WI_ROOT_ACCESS_MAP,
            "On the linked one-page access map, find “6th St.” at the downstream end of the mapped river corridor.",
          ),
        ],
      },
      {
        id: "root_city_parks",
        foundationReachIds: ["root_city_parks"],
        position: "middle",
        rangeLabel: "6th Street to Island Park",
        spots: [
          sourceMappedSpot(
            "root_washington",
            "Washington Park",
            ["shore_fishing", "wade_access"],
            "DNR-documented public park with shore fishing and some wadable sections.",
            "Wisconsin DNR Root River Access Sites",
            WI_ROOT_ACCESS_MAP,
            "On the linked one-page access map, find “Washington Park.”",
          ),
          sourceMappedSpot(
            "root_island",
            "Island Park",
            ["shore_fishing", "walk_in"],
            "DNR-documented public park with primarily shore-fishing access.",
            "Wisconsin DNR Root River Access Sites",
            WI_ROOT_ACCESS_MAP,
            "On the linked one-page access map, find “Island Park.”",
          ),
        ],
      },
      {
        id: "root_lincoln_park",
        foundationReachIds: ["root_lincoln_park"],
        position: "upper",
        rangeLabel: "Island Park to Steelhead Facility",
        spots: [
          sourceMappedSpot(
            "root_lincoln",
            "Lincoln Park",
            ["shore_fishing", "wade_access"],
            "DNR-documented public park with extensive wadable access below the Steelhead Facility.",
            "Wisconsin DNR Root River Access Sites",
            WI_ROOT_ACCESS_MAP,
            "On the linked one-page access map, find “Lincoln Park” and the adjacent “Root River Steelhead Facility.”",
            "Facility operations can block, process or pass fish. Obey posted operational and refuge boundaries and do not continue above the River Run endpoint.",
          ),
        ],
      },
    ],
  },
  bois_brule: {
    riverId: "bois_brule",
    riverName: "Bois Brule River",
    orientationNote:
      "Sections match the Lake Superior-to-Highway-2 fall corridor. State Forest angler lots are day use only; private roadside entries and the permanent or seasonal fish-refuge locations are intentionally excluded.",
    safetyLink: {
      label: "CHECK CURRENT WISCONSIN RULES →",
      url: WI_FISHING_RULES,
    },
    sections: [
      {
        id: "bois_brule_mouth_lower",
        foundationReachIds: ["bois_brule_mouth_lower"],
        position: "lower",
        rangeLabel: "Lake Superior to Fishway Refuge",
        spots: [
          sourceMappedSpot(
            "brule_mouth",
            "Mouth of the Brule",
            ["shore_fishing", "carry_in"],
            "Wisconsin DNR-documented lower-river angler access at Lake Superior.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 1, “Mouth of the Brule.”",
          ),
          sourceMappedSpot(
            "brule_weir_riffles",
            "Weir Riffles",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented lower-river angler lot and walk-in access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 2, “Weir Riffles.”",
          ),
          sourceMappedSpot(
            "brule_johnsons",
            "Johnson's Hole",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented lower-river angler lot and walk-in access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 3, “Johnson's Hole.”",
          ),
          sourceMappedSpot(
            "brule_saaris",
            "Saari's Lot",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented lower-river angler lot and walk-in access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 4, “Saari's Lot.”",
          ),
          sourceMappedSpot(
            "brule_lyons",
            "Lyon's Lot",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented lower-river angler lot and walk-in access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 5, “Lyon's Lot.”",
          ),
          sourceMappedSpot(
            "brule_old_cloverland",
            "Old Cloverland Dump",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented lower-river angler lot and walk-in access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 6, “Old Cloverland Dump.”",
          ),
          sourceMappedSpot(
            "brule_mcneils_east",
            "McNeil's East",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented lower-river angler lot and walk-in access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 7, “McNeil's East.”",
          ),
          sourceMappedSpot(
            "brule_mcneils_west",
            "McNeil's West",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented lower-river angler lot and walk-in access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 8, “McNeil's West.”",
          ),
          sourceMappedSpot(
            "brule_harveys",
            "Harvey's",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented lower-river angler lot and walk-in access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 9, “Harvey's.”",
          ),
          sourceMappedSpot(
            "brule_cloverland_park",
            "Cloverland Park",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented lower-river public angler access downstream from the fishway.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 10, “Cloverland Park.”",
            "The fishway and its signed 500-foot refuge are upstream. Obey every posted refuge boundary.",
          ),
          sourceMappedSpot(
            "brule_highway_13",
            "Highway 13 Landing",
            ["shore_fishing", "carry_in"],
            "Wisconsin DNR-documented lower-river road crossing and designated landing downstream from the fishway.",
            "Wisconsin DNR Brule River paddling guide",
            WI_BRULE_PADDLING,
            "In the linked official guide, find “Highway 13 to mouth” in the landing-to-landing travel table.",
            "The fishway and its signed 500-foot refuge are just upstream. Obey every posted refuge boundary.",
          ),
        ],
      },
      {
        id: "bois_brule_rapids",
        foundationReachIds: ["bois_brule_rapids"],
        position: "middle",
        rangeLabel: "Fishway Refuge to County Highway FF",
        spots: [
          sourceMappedSpot(
            "brule_loveland",
            "Drew's Landing / Loveland Road",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented angler lot and river access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 12, “Drew's Landing/Loveland Road.”",
          ),
          sourceMappedSpot(
            "brule_clay_road",
            "Clay Road / Bachelor's",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented angler lot and river access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 13, “Clay Road/Bachelor's.”",
          ),
          sourceMappedSpot(
            "brule_ff_angler_lot",
            "County Highway FF Angler Lot",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented designated angler lot near County Highway FF.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 17, “CTH FF Angler Lot.”",
            "Use the designated angler lot only; the separate FF roadside entry documented in the report is on private property and is not listed here.",
          ),
        ],
      },
      {
        id: "bois_brule_upper_lower",
        foundationReachIds: ["bois_brule_upper_lower"],
        position: "upper",
        rangeLabel: "County Highway FF to Highway 2",
        spots: [
          sourceMappedSpot(
            "brule_pine_tree",
            "Pine Tree",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented State Forest angler lot and river access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 19, “Pine Tree.”",
          ),
          sourceMappedSpot(
            "brule_copper_range",
            "Copper Range / Coop Park",
            ["shore_fishing", "carry_in"],
            "Wisconsin DNR-documented campground-area angler access and canoe landing.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 20, “Copper Range/Coop Park.”",
          ),
          sourceMappedSpot(
            "brule_high_landing",
            "High Landing",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented State Forest angler lot and river access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 21, “High Landing.”",
          ),
          sourceMappedSpot(
            "brule_black_landing",
            "Black Landing",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented State Forest angler lot and river access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 22, “Black Landing.”",
          ),
          sourceMappedSpot(
            "brule_rocky_run",
            "Rocky Run",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented State Forest angler lot and river access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 23, “Rocky Run.”",
          ),
          sourceMappedSpot(
            "brule_bradys",
            "Brady's Hole",
            ["shore_fishing", "walk_in"],
            "Wisconsin DNR-documented State Forest angler lot and river access.",
            "Wisconsin DNR lower Bois Brule creel report",
            WI_BRULE_ACCESS_REPORT,
            "In Table 2 on report page 15, find access 24, “Brady's Hole.”",
          ),
          sourceMappedSpot(
            "brule_highway_2",
            "Highway 2 Landing",
            ["shore_fishing", "carry_in"],
            "Wisconsin DNR-documented landing at the upstream end of the supported fall corridor.",
            "Wisconsin DNR Brule River paddling guide",
            WI_BRULE_PADDLING,
            "In the linked official guide, find “Highway 2 to Pine Tree” in the landing-to-landing travel table.",
            "The fall River Run corridor ends on the downstream side of Highway 2.",
          ),
        ],
      },
    ],
  },
};

export function riverRunSpotFinderForRiver(
  riverId: string | undefined,
  species?: string,
  state?: string,
): RiverSpotFinder | undefined {
  if (!riverId) return undefined;
  const finder = RIVER_RUN_SPOT_FINDERS[riverId];
  if (!finder || finder.riverRunAligned === false) return undefined;
  if (state && finder.supportedStates && !finder.supportedStates.includes(state)) {
    return undefined;
  }
  const sections = species
    ? finder.sections.filter((section) =>
      !section.eligibleSpecies ||
      section.eligibleSpecies.includes(species as RiverAccessSpecies)
    )
    : finder.sections;
  return sections.length > 0 ? { ...finder, sections } : undefined;
}

export const RIVER_ACCESS_GENERAL_WARNING =
  "Access, roads, hours, fees, water levels and closures can change. A listed access name does not guarantee legal parking, safe wading, open roads or permission to cross neighboring land. Use the linked source, current regulations and every posted sign to research the site before traveling.";

export const RIVER_ACCESS_CLOSURES_URL = DNR_CLOSURES;
