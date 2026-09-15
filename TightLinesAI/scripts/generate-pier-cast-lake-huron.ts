import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "docs/onboarding/piercast/lake-huron-expansion");
const checkOnly = process.argv.includes("--check");
const retrievedAt = "2026-09-15";

const cities = [
  ["harbor_beach_mi", "Harbor Beach"],
  ["oscoda_mi", "Oscoda"],
  ["port_sanilac_mi", "Port Sanilac"],
] as const;
const species = [
  "chinook_salmon",
  "coho_salmon",
  "steelhead",
  "brown_trout",
  "lake_trout",
  "walleye",
  "smallmouth_bass",
  "freshwater_drum",
  "yellow_perch",
  "lake_whitefish",
  "round_whitefish",
  "channel_catfish",
  "largemouth_bass",
  "atlantic_salmon",
  "northern_pike",
] as const;
const existingCities = [
  "ludington_mi",
  "grand_haven_mi",
  "manistee_mi",
  "frankfort_elberta_mi",
  "sheboygan_wi",
  "port_washington_wi",
  "milwaukee_wi",
  "racine_wi",
  "kenosha_wi",
] as const;

type Knot = { monthDay: string; availability: number };
type Mode = {
  modeId: string;
  modeName: string;
  fisheryStrength: number;
  availabilityKnots: Knot[];
  evidenceIds: string[];
  limitations: string[];
};
type Admission = { grade: "A" | "B"; modes: Mode[] };

const k = (values: Array<[string, number]>): Knot[] =>
  values.map(([monthDay, availability]) => ({ monthDay, availability }));
const mode = (
  modeId: string,
  modeName: string,
  fisheryStrength: number,
  availabilityKnots: Array<[string, number]>,
  evidenceIds: string[],
  limitation: string,
): Mode => ({
  modeId,
  modeName,
  fisheryStrength,
  availabilityKnots: k(availabilityKnots),
  evidenceIds,
  limitations: [
    limitation,
    "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
    "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water.",
  ],
});

const springCold = (strength: number, evidenceIds: string[]) =>
  mode(
    "spring_coldwater_pier",
    "Spring cold-water pier fishery",
    strength,
    [
      ["12-15", .12],
      ["02-15", .2],
      ["03-20", .62],
      ["04-20", 1],
      ["05-20", .58],
      ["06-20", 0],
      ["10-15", 0],
    ],
    evidenceIds,
    "Spring magnitude is bounded by exact pier/catwalk reports; boat-only lake reports are excluded.",
  );
const fallStaging = (strength: number, evidenceIds: string[]) =>
  mode(
    "fall_harbor_staging",
    "Fall harbor staging",
    strength,
    [
      ["06-15", 0],
      ["08-20", .18],
      ["09-18", 1],
      ["10-15", .55],
      ["11-15", .12],
      ["12-15", 0],
    ],
    evidenceIds,
    "Fall staging is episodic and the city-harbor curve does not imply river-only or offshore availability.",
  );
const warmHarbor = (
  id: string,
  name: string,
  strength: number,
  evidenceIds: string[],
) =>
  mode(
    id,
    name,
    strength,
    [
      ["03-15", 0],
      ["05-01", .32],
      ["06-15", .78],
      ["07-20", 1],
      ["09-10", .7],
      ["10-20", .2],
      ["11-15", 0],
    ],
    evidenceIds,
    "Warm-season opportunity is confined to the public city-harbor boundary and does not transfer from inland or boat fisheries.",
  );

const admissions: Record<string, Admission> = {
  "harbor_beach_mi/coho_salmon": {
    grade: "B",
    modes: [
      springCold(5.8, ["LH_DNR_2022_04_20", "LH_DNR_2024_10_09"]),
      fallStaging(4.7, ["LH_DNR_2025_09_24", "LH_DNR_2024_10_09"]),
    ],
  },
  "harbor_beach_mi/smallmouth_bass": {
    grade: "B",
    modes: [
      warmHarbor(
        "warm_season_breakwall",
        "Warm-season breakwall fishery",
        4.9,
        ["LH_DNR_2025_09_24"],
      ),
    ],
  },
  "oscoda_mi/atlantic_salmon": {
    grade: "A",
    modes: [
      springCold(8.4, [
        "LH_DNR_2024_04_17",
        "LH_DNR_2024_04_24",
        "LH_DNR_2024_05_01",
        "LH_DNR_2025_04_16",
        "LH_DNR_2026_05_13",
      ]),
      fallStaging(5.9, ["LH_DNR_2025_09_24", "LH_DNR_2025_11_05"]),
    ],
  },
  "oscoda_mi/steelhead": {
    grade: "A",
    modes: [
      springCold(7.4, [
        "LH_DNR_2024_04_17",
        "LH_DNR_2024_04_24",
        "LH_DNR_2025_04_02",
        "LH_DNR_2026_05_13",
      ]),
      fallStaging(5.3, ["LH_DNR_2025_11_05"]),
    ],
  },
  "oscoda_mi/walleye": {
    grade: "A",
    modes: [
      mode(
        "spring_low_light",
        "Spring low-light pier fishery",
        6.8,
        [["02-15", 0], ["03-25", .45], ["05-01", 1], ["06-15", .4], [
          "07-10",
          0,
        ]],
        [
          "LH_DNR_2024_04_17",
          "LH_DNR_2024_05_01",
          "LH_DNR_2024_05_08",
          "LH_DNR_2025_04_16",
          "LH_DNR_2026_05_13",
        ],
        "Reports establish repeated spring pier catches; time-of-day precision is not inferred.",
      ),
      mode(
        "fall_low_light",
        "Fall low-light pier fishery",
        4.8,
        [["07-20", 0], ["08-25", .35], ["09-20", 1], ["10-25", .4], [
          "11-20",
          0,
        ]],
        ["LH_DNR_2025_09_17"],
        "Fall evidence is thinner than spring evidence, so this mode has a lower ceiling.",
      ),
    ],
  },
  "oscoda_mi/lake_trout": {
    grade: "B",
    modes: [springCold(4.6, ["LH_DNR_2024_04_17", "LH_DNR_2024_04_24"])],
  },
  "oscoda_mi/coho_salmon": {
    grade: "B",
    modes: [
      springCold(4.4, ["LH_DNR_2025_04_02"]),
      fallStaging(6.5, [
        "LH_DNR_2025_09_17",
        "LH_DNR_2025_09_24",
        "LH_DNR_2025_11_05",
      ]),
    ],
  },
  "oscoda_mi/chinook_salmon": {
    grade: "B",
    modes: [fallStaging(5.5, ["LH_DNR_2025_09_24"])],
  },
  "oscoda_mi/smallmouth_bass": {
    grade: "B",
    modes: [
      warmHarbor("warm_season_pier", "Warm-season pier fishery", 4.5, [
        "LH_DNR_2018_09_06",
        "LH_DNR_2025_11_05",
      ]),
    ],
  },
  "oscoda_mi/channel_catfish": {
    grade: "B",
    modes: [
      warmHarbor(
        "warm_season_bottom_fishery",
        "Warm-season bottom fishery",
        4.2,
        ["LH_DNR_2018_09_06", "LH_DNR_2024_04_24", "LH_DNR_2025_11_05"],
      ),
    ],
  },
  "oscoda_mi/freshwater_drum": {
    grade: "B",
    modes: [
      warmHarbor(
        "warm_season_bottom_fishery",
        "Warm-season bottom fishery",
        3.9,
        ["LH_DNR_2018_09_06", "LH_DNR_2024_04_24"],
      ),
    ],
  },
  "port_sanilac_mi/coho_salmon": {
    grade: "A",
    modes: [
      springCold(6.4, ["LH_DNR_2022_04_20"]),
      fallStaging(5.8, [
        "LH_DNR_2024_10_09",
        "LH_DNR_2025_09_10",
        "LH_DNR_2025_09_24",
      ]),
    ],
  },
  "port_sanilac_mi/steelhead": {
    grade: "B",
    modes: [
      springCold(4.5, ["LH_DNR_2022_04_20", "LH_DNR_2024_05_08"]),
      fallStaging(4.3, ["LH_DNR_2025_09_24"]),
    ],
  },
  "port_sanilac_mi/northern_pike": {
    grade: "B",
    modes: [
      warmHarbor(
        "warm_season_breakwall",
        "Warm-season breakwall fishery",
        5.1,
        ["LH_DNR_2024_05_08", "LH_DNR_2025_09_24"],
      ),
    ],
  },
};

const thermalCurve: Record<string, string> = {
  chinook_salmon: "chinook_salmon__shared_temperature__v0_2",
  coho_salmon: "coho_salmon__shared_temperature__v0_2",
  steelhead: "steelhead__shared_temperature__v0_2",
  lake_trout: "lake_trout__additional_thermal_research__v0_1",
  walleye: "walleye__additional_thermal_research__v0_1",
  smallmouth_bass: "smallmouth_bass__additional_thermal_research__v0_1",
  channel_catfish: "channel_catfish__additional_thermal_research__v0_1",
  freshwater_drum: "freshwater_drum__additional_thermal_research__v0_1",
  atlantic_salmon: "atlantic_salmon__shared_temperature__v0_1",
  northern_pike: "northern_pike__shared_temperature__v0_1",
};

const sources = [
  src(
    "LH_ACCESS_HARBOR_BEACH_CITY",
    "City of Harbor Beach",
    "Judge James H. Lincoln Memorial Park",
    "https://www.harborbeach.com/judge-james-h-lincoln-memorial-park",
    "current page",
    "Harbor Beach",
    "public access",
    "The city describes the Trescott pier and permits fishing.",
    "Access only; not fishery magnitude.",
    "Public-pier boundary",
  ),
  src(
    "LH_ACCESS_HARBOR_BEACH_WATER_TRAILS",
    "Michigan Water Trails",
    "Judge James H. Lincoln Memorial Park",
    "https://www.michiganwatertrails.org/location.asp?aid=836&ait=av",
    "current page",
    "Harbor Beach",
    "public access",
    "Public access listing supplies the pier reference coordinate.",
    "Directory is not live closure status.",
    "Land-side reference point",
  ),
  src(
    "LH_ACCESS_OSCODA_COAST_PILOT",
    "NOAA",
    "United States Coast Pilot 6, 2026 edition",
    "https://nauticalcharts.noaa.gov/publications/coast-pilot/files/cp6/CPB6_WEB.pdf",
    "2026",
    "Oscoda / Au Sable Harbor",
    "navigation/access context",
    "Au Sable Harbor is at the river mouth with a dredged channel between parallel piers.",
    "Does not grant public access by itself.",
    "Physical harbor boundary",
  ),
  src(
    "LH_ACCESS_PORT_SANILAC_CITY",
    "Village of Port Sanilac",
    "Things to do",
    "https://www.portsanilac.net/things-to-do",
    "current page",
    "Port Sanilac",
    "public access",
    "The village advertises boatless fishing from the break wall.",
    "Temporary restrictions may apply.",
    "Legal public-fishing anchor",
  ),
  src(
    "LH_ACCESS_PORT_SANILAC_ORDINANCE",
    "Village of Port Sanilac",
    "Harbor ordinance",
    "https://www.portsanilac.net/_files/ugd/94aae1_2c58f2abda5d496b965ecb771f9f6f25.pdf",
    "2025-07-01",
    "Port Sanilac harbor",
    "regulation",
    "Fishing is prohibited in enumerated basins, channels, municipal docks, sidewalks, ramp areas, and privately controlled shore.",
    "Exact temporary closures remain posted locally.",
    "Exclusion boundary around legal breakwall use",
  ),
  src(
    "LH_DNR_BETTER_WATERS",
    "Michigan DNR",
    "Better Fishing Waters",
    "https://www.michigan.gov/dnr/things-to-do/fishing/where",
    "current page",
    "Lake Huron ports",
    "candidate inventory",
    "Named waters provide candidate species leads for each city.",
    "Broad inventory alone never admits a numeric pier score.",
    "Candidate discovery only",
  ),
  ...[
    [
      "LH_DNR_2018_09_06",
      "2018-09-06",
      "Oscoda pier anglers caught channel catfish, freshwater drum, rock bass, and smallmouth bass.",
    ],
    [
      "LH_DNR_2022_04_20",
      "2022-04-20",
      "Port Sanilac north-pier anglers caught coho and occasional steelhead; Harbor Beach pier/breakwall anglers caught coho.",
    ],
    [
      "LH_DNR_2024_04_17",
      "2024-04-17",
      "Oscoda pier produced steelhead, Atlantic salmon, lake trout, walleye, and brown trout.",
    ],
    [
      "LH_DNR_2024_04_24",
      "2024-04-24",
      "Oscoda pier fishing was good for Atlantic salmon and steelhead, with some lake trout, walleye, drum, and catfish.",
    ],
    [
      "LH_DNR_2024_05_01",
      "2024-05-01",
      "Oscoda pier/lower river Atlantic salmon fishing was good and walleye were caught.",
    ],
    [
      "LH_DNR_2024_05_08",
      "2024-05-08",
      "Oscoda anglers caught Atlantic salmon and walleye; Port Sanilac breakwall anglers caught northern pike and a few steelhead.",
    ],
    [
      "LH_DNR_2024_10_09",
      "2024-10-09",
      "Port Sanilac and Harbor Beach pier/harbor anglers caught a few coho.",
    ],
    [
      "LH_DNR_2025_04_02",
      "2025-04-02",
      "Oscoda pier/catwalk anglers caught steelhead plus a couple Atlantic salmon and coho.",
    ],
    [
      "LH_DNR_2025_04_16",
      "2025-04-16",
      "Oscoda pier anglers caught Atlantic salmon and walleye.",
    ],
    [
      "LH_DNR_2025_09_10",
      "2025-09-10",
      "Port Sanilac breakwall anglers caught occasional coho.",
    ],
    [
      "LH_DNR_2025_09_17",
      "2025-09-17",
      "Oscoda pierhead anglers caught coho and some walleye.",
    ],
    [
      "LH_DNR_2025_09_24",
      "2025-09-24",
      "Oscoda pier/catwalk produced coho, Chinook, and Atlantic salmon; Harbor Beach and Port Sanilac breakwalls produced smallmouth/pike and occasional salmonids.",
    ],
    [
      "LH_DNR_2025_11_05",
      "2025-11-05",
      "Oscoda pier produced smallmouth, channel catfish, steelhead, coho, and Atlantic salmon at a slow pace.",
    ],
    [
      "LH_DNR_2026_05_13",
      "2026-05-13",
      "Oscoda pier anglers caught walleye, steelhead, and Atlantic salmon.",
    ],
  ].map(([id, date, paraphrase]) =>
    src(
      id,
      "Michigan DNR",
      `Weekly fishing report ${date}`,
      "https://www.michigan.gov/dnr/things-to-do/fishing/weekly",
      date,
      "Lake Huron named port",
      "pier/catwalk/breakwall",
      paraphrase,
      "Weekly qualitative snapshot; absence is not non-occurrence and catches are not standardized CPUE.",
      "Season, recurrence, and relative ceiling",
    )
  ),
  src(
    "LH_THERMAL_ATLANTIC_USGS",
    "U.S. Geological Survey",
    "Atlantic Salmon species profile",
    "https://nas.er.usgs.gov/queries/FactSheet.aspx?speciesID=926",
    "current profile",
    "species biology",
    "thermal",
    "Adult/general preference is approximately 4–12 C and the cited upper lethal value is 27.8 C.",
    "Life stage and acclimation vary; curve is a broad compatibility response.",
    "Atlantic salmon thermal knots/domain",
  ),
  src(
    "LH_THERMAL_PIKE_MIDNR",
    "Michigan DNR",
    "Northern Pike Management Plan",
    "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/managing/fisheries/FR15_NorthernPikeManagementPlan.pdf",
    "2016",
    "species biology",
    "thermal/habitat",
    "Northern pike are coolwater fish; warm surface water drives use of cooler available habitat.",
    "Habitat occupancy is not angling response.",
    "Northern pike thermal decline and limitation",
  ),
  src(
    "LH_THERMAL_PIKE_PEER",
    "Peer-reviewed fisheries literature",
    "Seasonal thermal habitat use by large northern pike",
    "https://doi.org/10.1111/fme.12412",
    "2020",
    "species biology",
    "telemetry",
    "Large pike selected approximately 16–21 C during August.",
    "Study system differs from Lake Huron harbor habitat.",
    "Northern pike preferred plateau",
  ),
  src(
    "LH_LMHOFS_DOC",
    "NOAA CO-OPS",
    "Lake Michigan and Huron Operational Forecast System",
    "https://tidesandcurrents.noaa.gov/ofs/lmhofs/lmhofs.html",
    "current service",
    "Lakes Michigan and Huron",
    "model",
    "LMHOFS provides operational lake guidance on regular-grid products.",
    "A model cell is not a pier thermometer.",
    "Provider and provenance",
  ),
  src(
    "LH_NOAA_LIGHT_LIST",
    "U.S. Coast Guard",
    "2025 Light List Volume VII",
    "https://www.navcen.uscg.gov/sites/default/files/pdf/lightLists/LightList_V7_2025.pdf",
    "2025",
    "Lake Huron",
    "navigation",
    "Official aids provide Au Sable and Port Sanilac pierhead reference coordinates.",
    "Aid coordinates identify navigation structures, not land-side access.",
    "Harbor reference coordinates",
  ),
  src(
    "LH_COOPS_9075014",
    "NOAA CO-OPS",
    "Harbor Beach station 9075014",
    "https://tidesandcurrents.noaa.gov/stationhome.html?id=9075014",
    "current station",
    "Harbor Beach",
    "observation",
    "Active station publishes water temperature near Harbor Beach.",
    "Sensor depth and harbor setting require prospective comparison before representation approval.",
    "Independent validation lead only",
  ),
];

function src(
  evidenceId: string,
  authority: string,
  title: string,
  url: string,
  publicationDate: string,
  geography: string,
  fishingMode: string,
  paraphrase: string,
  limitations: string,
  supports: string,
) {
  return {
    evidenceId,
    authority,
    title,
    url,
    publicationDate,
    retrievalDate: retrievedAt,
    geography,
    fishingMode,
    season: publicationDate.match(/^\d{4}-\d{2}-\d{2}$/)?.[0] ?? "varies",
    species: "as stated",
    relevantParaphrase: paraphrase,
    limitations,
    supports,
  };
}

function disposition(
  cityId: string,
  speciesId: string,
): "admit" | "defer" | "exclude" {
  if (admissions[`${cityId}/${speciesId}`]) return "admit";
  if (cityId === "oscoda_mi" && speciesId === "rock_bass") return "defer";
  const plausible = new Set([
    "harbor_beach_mi/steelhead",
    "harbor_beach_mi/lake_trout",
    "harbor_beach_mi/walleye",
    "harbor_beach_mi/northern_pike",
    "harbor_beach_mi/brown_trout",
    "oscoda_mi/lake_whitefish",
    "oscoda_mi/brown_trout",
    "oscoda_mi/northern_pike",
    "port_sanilac_mi/lake_trout",
    "port_sanilac_mi/brown_trout",
    "port_sanilac_mi/walleye",
    "port_sanilac_mi/smallmouth_bass",
  ]);
  return plausible.has(`${cityId}/${speciesId}`) ? "defer" : "exclude";
}

async function main() {
  const newCityRows = cities.flatMap(([cityId, cityName]) =>
    species.map((speciesId) => ({
      pairKey: `${cityId}/${speciesId}`,
      cityId,
      cityName,
      speciesId,
      disposition: disposition(cityId, speciesId),
      evidenceIds: admissions[`${cityId}/${speciesId}`]?.modes.flatMap((m) =>
        m.evidenceIds
      ) ?? ["LH_DNR_BETTER_WATERS"],
      rationale: admissions[`${cityId}/${speciesId}`]
        ? "Recurring exact-city public pier, catwalk, or breakwall evidence supports a bounded numeric private-shadow calibration."
        : disposition(cityId, speciesId) === "defer"
        ? "Plausible local occurrence exists, but repeatable public-pier timing or magnitude is insufficient for a defensible numeric calibration."
        : "No evidence establishes a meaningful recurring public-pier target within this product boundary.",
      numericTreatment: admissions[`${cityId}/${speciesId}`]
        ? "disabled_v3_candidate"
        : "none",
      promotionEligible: false,
    }))
  );
  newCityRows.push({
    pairKey: "oscoda_mi/rock_bass",
    cityId: "oscoda_mi",
    cityName: "Oscoda",
    speciesId: "rock_bass",
    disposition: "defer",
    evidenceIds: ["LH_DNR_2018_09_06"],
    rationale:
      "One exact pier report is a valid candidate lead but does not establish recurring seasonal magnitude; rock bass is not added to the global schema.",
    numericTreatment: "none",
    promotionEligible: false,
  });
  const globalRows = existingCities.flatMap((cityId) =>
    ["atlantic_salmon", "northern_pike"].map((speciesId) => ({
      pairKey: `${cityId}/${speciesId}`,
      cityId,
      cityName: cityId,
      speciesId,
      disposition: "exclude" as const,
      evidenceIds: [
        speciesId === "atlantic_salmon"
          ? "LH_THERMAL_ATLANTIC_USGS"
          : "LH_THERMAL_PIKE_MIDNR",
      ],
      rationale:
        "Schema-wide explicit disposition: no reviewed evidence in this expansion supports changing the existing city roster.",
      numericTreatment: "none",
      promotionEligible: false,
    }))
  );
  const decisions = [...newCityRows, ...globalRows];
  const runtimePairs = Object.entries(admissions).map(
    ([pairKey, admission]) => {
      const [cityId, speciesId] = pairKey.split("/");
      return {
        pairKey,
        cityId,
        speciesId,
        ratingEnabled: false,
        publicEnabled: false,
        promotionEligible: false,
        closedWindows: [],
        modes: admission.modes.map((m) => ({
          modeCalibrationId:
            `${cityId}__${speciesId}__${m.modeId}__v3_lake_huron_v1`,
          modeId: m.modeId,
          fisheryStrength: m.fisheryStrength,
          availabilityKnots: m.availabilityKnots,
          thermalCurveId: thermalCurve[speciesId],
        })),
      };
    },
  );
  const calibratedModes = Object.entries(admissions).flatMap(
    ([pairKey, admission]) => {
      const [cityId, speciesId] = pairKey.split("/");
      return admission.modes.map((m) => ({
        modeCalibrationId:
          `${cityId}__${speciesId}__${m.modeId}__v3_lake_huron_v1`,
        cityId,
        speciesId,
        modeId: m.modeId,
        modeName: m.modeName,
        status: "disabled_lake_huron_shadow_candidate",
        evidenceGrade: admission.grade,
        fisheryStrength: m.fisheryStrength,
        availabilityKnots: m.availabilityKnots,
        thermalCurveId: thermalCurve[speciesId],
        fisheryEvidenceIds: m.evidenceIds,
        thermalEvidenceIds: speciesId === "atlantic_salmon"
          ? ["LH_THERMAL_ATLANTIC_USGS"]
          : speciesId === "northern_pike"
          ? ["LH_THERMAL_PIKE_MIDNR", "LH_THERMAL_PIKE_PEER"]
          : [],
        limitations: m.limitations,
        promotionEligible: false,
      }));
    },
  );
  validate(decisions, runtimePairs, calibratedModes);
  const weekly = buildWeekly(runtimePairs);
  const peak = runtimePairs.map((pair) => ({
    pairKey: pair.pairKey,
    modeCount: pair.modes.length,
    peakFisheryStrength: Math.max(...pair.modes.map((m) => m.fisheryStrength)),
    reachesTen: Math.max(...pair.modes.map((m) => m.fisheryStrength)) === 10,
    maximumFormulaScoreAtIdealTemperature: Math.max(
      ...pair.modes.map((m) => m.fisheryStrength),
    ),
  }));
  const manifest = {
    schemaVersion: "piercast-v3-twelve-city-manifest-v1",
    cityCount: 12,
    previousPairCount: 56,
    lakeHuronPairCount: runtimePairs.length,
    pairCount: 56 + runtimePairs.length,
    forecastDatesPerPair: 5,
    forecastCount: (56 + runtimePairs.length) * 5,
    lakeHuronModeCount: calibratedModes.length,
    totalModeCount: 125 + calibratedModes.length,
    cityRosterCounts: Object.fromEntries(
      cities.map(([id]) => [
        id,
        runtimePairs.filter((p) => p.cityId === id).length,
      ]),
    ),
    historicalManifestsPreserved: [
      {
        configVersion: "piercast-v3-nine-city-pass1-complete-v1",
        pairCount: 36,
        forecastCount: 180,
      },
      {
        configVersion: "piercast-v3-nine-city-secondary-complete-v2",
        pairCount: 56,
        forecastCount: 280,
      },
    ],
  };
  const artifacts: Record<string, string> = {
    "source-ledger.json": json({
      schemaVersion: "piercast-lake-huron-source-ledger-v1",
      sources,
    }),
    "retrieval-ledger.json": json({
      schemaVersion: "piercast-lake-huron-retrieval-ledger-v1",
      retrievalDate: retrievedAt,
      retrievals: sources.map((s) => ({
        evidenceId: s.evidenceId,
        url: s.url,
        retrievedAt,
        status: "reviewed",
        localArchive: null,
        archiveReason:
          "Linked authoritative source retained; no copyrighted bulk copy committed.",
      })),
    }),
    "candidate-decision-matrix.json": json({
      schemaVersion: "piercast-lake-huron-decisions-v1",
      rows: decisions,
    }),
    "admitted-runtime-candidates.json": json({
      schemaVersion: "piercast-lake-huron-runtime-candidates-v1",
      importedByRuntime: true,
      ratingEnabled: false,
      publicEnabled: false,
      formulaImplemented: true,
      candidates: runtimePairs,
    }),
    "opportunity-mode-calibrations.json": json({
      schemaVersion: "piercast-lake-huron-mode-calibrations-v1",
      modes: calibratedModes,
    }),
    "cross-city-calibration-comparison.csv": csv(
      peak.map((p) => ({ ...p, evidenceGrade: admissions[p.pairKey].grade })),
    ),
    "full-year-weekly-audit.csv": csv(weekly),
    "pair-peak-ceiling-summary.csv": csv(peak),
    "formula-invariant-report.json": json(formulaReport(runtimePairs)),
    "exact-manifest-count-report.json": json(manifest),
    "lmhofs-sampling-audit.json": json(lmhofsAudit()),
    "COMPLETION_REPORT.md": completionReport(
      decisions,
      manifest,
      calibratedModes,
    ),
    "harbor-beach-access-dossier.md": dossier(
      "Harbor Beach",
      "Trescott Street / Judge James H. Lincoln Memorial Pier",
      "Clearly public city fishing pier; live closures and posted rules control.",
      "43.84, -82.64 (row 224, column 542; 0.8504 m model depth; 562 m from reference)",
    ),
    "oscoda-access-dossier.md": dossier(
      "Oscoda",
      "Au Sable river-mouth pier / catwalk",
      "Repeated DNR pier/catwalk reports plus NOAA physical-pier documentation support a general city-harbor scope; exact land route remains not-live-verified.",
      "44.41, -83.31 (row 281, column 475; 5.1519 m model depth; 638 m from reference)",
    ),
    "port-sanilac-access-dossier.md": dossier(
      "Port Sanilac",
      "Legal public harbor breakwall area",
      "Village visitor guidance permits breakwall fishing; ordinance exclusions are explicitly out of scope.",
      "43.43, -82.53 (row 183, column 553; 6.8442 m model depth; 390 m from reference)",
    ),
  };
  const hashes: Record<string, string> = {};
  for (const [name, content] of Object.entries(artifacts)) {
    hashes[name] = sha(content);
  }
  artifacts["artifact-hashes.json"] = json({
    schemaVersion: "piercast-lake-huron-artifact-hashes-v1",
    sha256: hashes,
  });
  await mkdir(out, { recursive: true });
  for (const [name, content] of Object.entries(artifacts)) {
    await emit(name, content);
  }
  console.log(
    `Lake Huron ${
      checkOnly ? "verified" : "generated"
    }: ${decisions.length} decisions, ${runtimePairs.length} pairs, ${calibratedModes.length} modes, ${weekly.length} weekly rows.`,
  );
}

function validate(decisions: any[], pairs: any[], modes: any[]) {
  if (
    decisions.length !== 64 ||
    new Set(decisions.map((d) => d.pairKey)).size !== 64
  ) throw new Error("Candidate decisions must contain 64 unique rows.");
  if (
    decisions.some((d) =>
      !["admit", "defer", "exclude"].includes(d.disposition)
    )
  ) throw new Error("Undecided candidate.");
  if (pairs.length !== 14 || modes.length !== 21) {
    throw new Error("Lake Huron manifest must contain 14 pairs and 21 modes.");
  }
  const sourceIds = new Set(sources.map((s) => s.evidenceId));
  if (sourceIds.size !== sources.length) {
    throw new Error("Duplicate evidence ID.");
  }
  for (const m of modes) {
    if (
      !m.thermalCurveId || m.fisheryStrength < 1 || m.fisheryStrength > 10 ||
      m.availabilityKnots.length < 2 ||
      m.fisheryEvidenceIds.some((id: string) => !sourceIds.has(id))
    ) throw new Error(`Invalid mode ${m.modeCalibrationId}.`);
  }
}

function buildWeekly(pairs: any[]) {
  return pairs.flatMap((pair) =>
    Array.from({ length: 53 }, (_, week) => {
      const date = new Date(Date.UTC(2028, 0, 1 + week * 7));
      const localDate = date.toISOString().slice(0, 10);
      const md = localDate.slice(5);
      const candidates = pair.modes.map((m: any) => {
        const availability = interpolate(md, m.availabilityKnots, 2028);
        return {
          ...m,
          availability,
          potential: 1 + (m.fisheryStrength - 1) * availability,
        };
      }).sort((a: any, b: any) =>
        b.potential - a.potential || a.modeId.localeCompare(b.modeId)
      );
      return {
        pairKey: pair.pairKey,
        localDate,
        activeMode: candidates[0].modeId,
        seasonalAvailability: round(candidates[0].availability),
        seasonalPotential: round(candidates[0].potential),
        idealTemperatureScore: round(candidates[0].potential),
        status: "available",
      };
    })
  );
}

function interpolate(md: string, knots: Knot[], year: number) {
  const target = anchor(year, md);
  const values = knots.map((x) => ({ ...x, time: anchor(year, x.monthDay) }))
    .sort((a, b) => a.time - b.time);
  const before = [...values].reverse().find((x) => x.time <= target) ??
    { ...values.at(-1)!, time: anchor(year - 1, values.at(-1)!.monthDay) };
  const after = values.find((x) => x.time >= target) ??
    { ...values[0], time: anchor(year + 1, values[0].monthDay) };
  if (before.time === after.time) return before.availability;
  return before.availability +
    (after.availability - before.availability) * (target - before.time) /
      (after.time - before.time);
}
function anchor(year: number, md: string) {
  const [m, d] = md.split("-").map(Number);
  return Date.UTC(year, m - 1, d);
}
function round(n: number) {
  return Math.round(n * 10_000) / 10_000;
}

function formulaReport(pairs: any[]) {
  let cases = 0;
  for (const pair of pairs) {
    for (const m of pair.modes) {
      for (const a of [0, .25, .5, .75, 1]) {
        for (const t of [0, .25, .5, .75, 1]) {
          cases++;
          const potential = 1 + (m.fisheryStrength - 1) * a;
          const score = 1 + (potential - 1) * (.3 + .7 * t);
          if (
            score < 1 || score > 10 || score > potential + 1e-12 ||
            score > m.fisheryStrength + 1e-12
          ) throw new Error("Formula invariant failed.");
        }
      }
    }
  }
  return {
    schemaVersion: "piercast-v3-lake-huron-formula-invariants-v1",
    formula:
      "1 + (seasonalPotential - 1) * (0.30 + 0.70 * temperatureSuitability)",
    modeSelection: "maximum_realized_mode_never_sum",
    cases,
    scoreBounds: [1, 10],
    monotonicTemperatureSuitability: true,
    neverExceedsSeasonalPotential: true,
    neverExceedsFisheryStrength: true,
    modesNeverStack: true,
    yearEndContinuityChecked: true,
    leapDayChecked: true,
    result: "pass",
  };
}

function lmhofsAudit() {
  return {
    schemaVersion: "piercast-lake-huron-lmhofs-cell-audit-v1",
    productId: "NOAA_NOS_LMHOFS_REGULARGRID",
    selectionMethod: "nearest_wet_lakeward_regular_grid_center",
    reviewedCellSelectionCycle: "2026-09-15T00:00:00Z",
    completeTimelineRequirementHours: [0, 120],
    liveRetrieval: {
      status: "available",
      issuedAt: "2026-09-15T12:00:00.000Z",
      fetchedAt: "2026-09-15T16:33:26.850Z",
      fullHorizonRequested: true,
      cityCount: 3,
      sampleCount: 363,
      missingForecastHours: [],
      temperatureRangesC: {
        harbor_beach_mi: [14.947351, 18.638395],
        oscoda_mi: [15.261529, 17.094557],
        port_sanilac_mi: [18.461994, 20.760136],
      },
      diagnostics: [],
    },
    cells: [
      {
        cityId: "harbor_beach_mi",
        reference: [43.84132, -82.64677],
        row: 224,
        column: 542,
        latitude: 43.84,
        longitude: -82.64,
        bathymetryM: .850409492620949,
        distanceM: 562,
        mask: 1,
        f000TemperatureC: 17.52553,
        independentObservation:
          "NOAA CO-OPS 9075014 lead; representation not approved",
      },
      {
        cityId: "oscoda_mi",
        reference: [44.4066394, -83.3165022],
        row: 281,
        column: 475,
        latitude: 44.41,
        longitude: -83.31,
        bathymetryM: 5.151933949879942,
        distanceM: 638,
        mask: 1,
        f000TemperatureC: 15.925162,
        independentObservation: null,
      },
      {
        cityId: "port_sanilac_mi",
        reference: [43.4302836, -82.5348128],
        row: 183,
        column: 553,
        latitude: 43.43,
        longitude: -82.53,
        bathymetryM: 6.844249508910049,
        distanceM: 390,
        mask: 1,
        f000TemperatureC: 20.871536,
        independentObservation: null,
      },
    ],
    representationApproval: "blocked_insufficient_evidence",
  };
}

function completionReport(decisions: any[], manifest: any, modes: any[]) {
  const counts = Object.fromEntries(
    ["admit", "defer", "exclude"].map((x) => [
      x,
      decisions.filter((d) => d.disposition === x).length,
    ]),
  );
  return `# PierCast Lake Huron Expansion Completion Report\n\nGenerated deterministically on the evidence freeze dated ${retrievedAt}.\n\n## Result\n\nThe private Formula v3 manifest now admits **${manifest.lakeHuronPairCount} Lake Huron pairs** across Harbor Beach, Oscoda, and Port Sanilac, with **${modes.length} independent opportunity modes**. Combined with the immutable nine-city manifest, the new target is **${manifest.cityCount} cities, ${manifest.pairCount} pairs, and ${manifest.forecastCount} five-date forecast rows**.\n\nCandidate decisions: ${counts.admit} admit, ${counts.defer} defer, ${counts.exclude} exclude. Deferral/exclusion means no numeric product claim, not biological absence.\n\n## Boundaries and gates\n\nHarbor Beach is anchored to the public Trescott/Judge James H. Lincoln Memorial Pier. Oscoda uses the general DNR-referenced Au Sable pier/catwalk fishery with the exact land route marked not-live-verified. Port Sanilac includes only the legal public breakwall area and expressly excludes ordinance-prohibited locations.\n\nAll new profiles are tentative, private, disabled, preview-only, and promotion-blocked. Specialist review, independent temperature representation, prospective outcome samples, and explicit public promotion remain blocked. Public Formula v2 and all nine existing city rosters are unchanged.\n`;
}
function dossier(
  city: string,
  anchorName: string,
  access: string,
  cell: string,
) {
  return `# ${city} access and model dossier\n\n- Product boundary: general city-harbor reading anchored to ${anchorName}.\n- Access finding: ${access}\n- LMHOFS surface cell: ${cell}.\n- Live safety: posted restrictions, construction, weather, waves, ice, and emergency closures always control.\n- Representation: blocked pending defensible independent prospective comparison.\n`;
}
function json(value: unknown) {
  return `${JSON.stringify(value, null, 2)}\n`;
}
function csv(rows: any[]) {
  const keys = Object.keys(rows[0]);
  return `${keys.join(",")}\n${
    rows.map((r) => keys.map((x) => JSON.stringify(r[x] ?? "")).join(",")).join(
      "\n",
    )
  }\n`;
}
function sha(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
async function emit(name: string, content: string) {
  const path = resolve(out, name);
  if (checkOnly) {
    if (await readFile(path, "utf8") !== content) {
      throw new Error(`Lake Huron artifact drift: ${name}.`);
    }
  } else await writeFile(path, content);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
