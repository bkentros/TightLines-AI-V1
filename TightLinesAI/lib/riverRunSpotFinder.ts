export type RiverAccessKind =
  | "shore_fishing"
  | "wade_access"
  | "fishing_platform"
  | "boat_ramp"
  | "carry_in"
  | "walk_in";

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
  label: string;
  spots: RiverAccessSpot[];
};

export type RiverSpotFinder = {
  riverId: string;
  riverName: string;
  orientationNote: string;
  sections: RiverAccessSection[];
};

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

export const RIVER_RUN_SPOT_FINDERS: Record<string, RiverSpotFinder> = {
  platte: {
    riverId: "platte",
    riverName: "Platte River",
    orientationNote:
      "Angler access is organized around Honor and the river upstream. The lower outlet corridor between Platte Lake and Lake Michigan is intentionally excluded.",
    sections: [
      {
        id: "platte_honor",
        label: "Honor area",
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
        label: "Upstream of Honor",
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
        label: "Betsie Lake to US-31",
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
        label: "US-31 to Homestead",
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
        label: "Lower · Pere Marquette Lake to Scottville",
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
        label: "Middle · Scottville to Maple Leaf",
        spots: [
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
        label: "Upper · Maple Leaf to M-37",
        spots: [
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
            "pm_claybanks",
            "Claybanks River Access",
            43.870053,
            -85.883319,
            ["shore_fishing", "carry_in"],
            "Forest Service corridor access; use the signed public entrance.",
            "U.S. Forest Service — Claybanks Campground",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/claybanks-campground",
          ),
          namedSpot(
            "pm_rainbow_rapids",
            "Rainbow Rapids Access",
            "Rainbow Rapids Boat Launch Access, Baldwin, MI",
            ["shore_fishing", "carry_in"],
            "Forest Service river access and parking area in the national scenic corridor.",
            "U.S. Forest Service",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/rainbow-rapids-boat-launch",
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
        label: "Lower · Muskegon Lake to M-120",
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
        label: "Middle · M-120 to Newaygo",
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
        label: "Upper · Newaygo to Croton Dam",
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
      "This river uses named landmarks because public access is uneven. Private liveries are not presented as public fishing access.",
    sections: [
      {
        id: "white_lower",
        label: "Lower · White Lake to Fruitvale Road",
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
        label: "Forest corridor · Fruitvale Road to Pines Point",
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
        label: "Upper · Pines Point to Hesperia Dam",
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
          namedSpot(
            "white_island",
            "Island Landing",
            "Island Landing, White River, Hesperia, MI",
            ["carry_in", "shore_fishing"],
            "Public landing immediately below the Hesperia orientation endpoint.",
            "Newaygo County Tourism Council water-trail map",
            WHITE_RIVER_MAP,
            "Portage is required at the dam; follow the signed route and stay outside safety barriers.",
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
        label: "Lower · M-55 to Bear Creek",
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
          namedSpot(
            "manistee_blacksmith",
            "Blacksmith Bayou",
            "Blacksmith Bayou Manistee River Access, Michigan",
            ["boat_ramp", "shore_fishing"],
            "Forest Service public access on the lower river.",
            "U.S. Forest Service",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/blacksmith-bayou-river-access",
          ),
        ],
      },
      {
        id: "manistee_middle",
        label: "Middle · Bear Creek to High Bridge",
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
            "manistee_high_bridge",
            "High Bridge Access",
            "High Bridge Manistee River Access, Brethren, MI",
            ["boat_ramp", "shore_fishing"],
            "Forest Service public landing at the middle/upper orientation marker.",
            "U.S. Forest Service",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/high-bridge-river-access",
          ),
          namedSpot(
            "manistee_sawdust",
            "Sawdust Hole River Access",
            "Sawdust Hole Manistee River Access, Michigan",
            ["boat_ramp", "shore_fishing"],
            "Forest Service public river access in the middle corridor.",
            "U.S. Forest Service — Sawdust Hole River Access",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/sawdust-hole-river-access",
          ),
          namedSpot(
            "manistee_suicide_bend",
            "Suicide Bend River Access",
            "Suicide Bend Manistee River Access, Michigan",
            ["carry_in", "shore_fishing"],
            "Named Forest Service public access in the national recreation river corridor.",
            "U.S. Forest Service — Suicide Bend Fishing Access",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/suicide-bend-fishing-access",
          ),
          namedSpot(
            "manistee_tunk_hole",
            "Tunk Hole River Access",
            "Tunk Hole Manistee River Access, Michigan",
            ["carry_in", "shore_fishing"],
            "Named Forest Service public access in the national recreation river corridor.",
            "U.S. Forest Service — Tunk Hole Angler Access",
            "https://www.fs.usda.gov/r09/huron-manistee/recreation/tunk-hole-angler-access",
          ),
        ],
      },
      {
        id: "manistee_upper",
        label: "Upper · High Bridge to Tippy Dam",
        spots: [
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
    orientationNote:
      "This Michigan inventory stops at the state line. Indiana access is not included in this release.",
    sections: [
      {
        id: "stjoe_lower",
        label: "Lower · Lake Michigan to Berrien Springs",
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
        label: "Berrien Springs to the Michigan state line",
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
      "The Grand has many public launches. These are access entrances, not a claim of bank-fishing or safe wading unless labeled.",
    sections: [
      {
        id: "grand_lower",
        label: "Lower · Grand Haven to Sixth Street",
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
          sourcedCoordinateSpot(
            "grand_riverside2",
            "Riverside Park River Access",
            43.0194346,
            -85.66280288,
            ["carry_in"],
            "Municipal accessible kayak launch and public river access; posted park hours apply.",
            "City of Grand Rapids Parks & Recreation",
            "https://www.grandrapidsmi.gov/departments/parks-recreation/recreation/kayaking/",
          ),
          dnrSpot(
            "grand_rogue",
            "Rogue River Mouth",
            43.06312097,
            -85.58514776,
            ["boat_ramp"],
            "Two-lane gravel launch; Recreation Passport required.",
            "Site may flood in spring.",
          ),
          dnrSpot(
            "grand_knapp",
            "Knapp Street Bridge",
            43.00552729,
            -85.54169763,
            ["boat_ramp"],
            "Gravel public launch; Recreation Passport required.",
            "Site may flood in spring.",
          ),
          dnrSpot("grand_ada", "Ada Access", 42.95590346, -85.47664864, [
            "boat_ramp",
          ], "Gravel public launch; Recreation Passport required."),
        ],
      },
      {
        id: "grand_middle",
        label: "Middle · Sixth Street to Webber Dam",
        spots: [
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
        label: "Upper accessible · Webber Dam to Moores Park",
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
};

export function riverRunSpotFinderForRiver(
  riverId: string | undefined,
): RiverSpotFinder | undefined {
  return riverId ? RIVER_RUN_SPOT_FINDERS[riverId] : undefined;
}

export const RIVER_ACCESS_GENERAL_WARNING =
  "Access, roads, hours, fees, water levels and closures can change. A listed access name does not guarantee legal parking, safe wading, open roads or permission to cross neighboring land. Use the linked source, current regulations and every posted sign to research the site before traveling.";

export const RIVER_ACCESS_CLOSURES_URL = DNR_CLOSURES;
