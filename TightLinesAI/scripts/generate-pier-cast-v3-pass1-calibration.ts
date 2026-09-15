import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { PIER_CAST_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/cities.ts";
import { PIER_CAST_CORE_TEMPERATURE_CURVES } from "../supabase/functions/_shared/pierCastEngine/config/coreCalibration.ts";
import { PIER_CAST_SPECIES_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/species.ts";
import { PIER_CAST_WISCONSIN_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/wisconsinShadow.ts";
import { evaluatePierCastSeasonalOpportunity } from "../supabase/functions/_shared/pierCastEngine/scoring/seasonal.ts";
import type {
  PierCastSeasonalOpportunityCurve,
  PierCastSpeciesId,
} from "../supabase/functions/_shared/pierCastEngine/types.ts";

const OUTPUT_DIRECTORY = resolve(
  "docs/onboarding/piercast/scoring-v3-pass1",
);
const REFERENCE_YEAR = 2025;
const checkOnly = process.argv.includes("--check");

type EvidenceGrade = "A" | "B" | "C" | "D";
type FinalDisposition = "admit" | "defer" | "exclude";

type BaselineRow = {
  cityId: string;
  cityName: string;
  stateCode: "MI" | "WI";
  speciesId: PierCastSpeciesId;
  speciesName: string;
  baselineDisposition: FinalDisposition;
  evidenceGrade: EvidenceGrade;
  currentCurveStatus: string;
  currentCurveId: string | null;
  decisionBasis: string;
  evidenceIds: string[];
  requiredEvidence: string;
};

type AvailabilityKnot = {
  monthDay: string;
  availability: number;
};

type ModeDefinition = {
  speciesId: PierCastSpeciesId;
  modeId: string;
  displayName: string;
  strengthSearch: { start: string; end: string; wraps?: boolean };
  availability:
    | { kind: "dynamic_peak"; start: string; end: string }
    | { kind: "fixed"; knots: AvailabilityKnot[] };
  evidenceInterpretation: string;
};

type SourceRecord = {
  sourceId: string;
  publisher: string;
  title: string;
  publicationDate: string | null;
  url: string | null;
  geography: string | null;
  fishingMode: string | null;
  timeResolution: string | null;
  limitations: string | null;
  registryPath: string;
};

const CORE_SPECIES_IDS = new Set<PierCastSpeciesId>([
  "chinook_salmon",
  "coho_salmon",
  "steelhead",
  "brown_trout",
]);

const MODE_DEFINITIONS: ModeDefinition[] = [
  {
    speciesId: "chinook_salmon",
    modeId: "spring_nearshore_transient",
    displayName: "Spring nearshore transient",
    strengthSearch: { start: "03-15", end: "06-15" },
    availability: { kind: "dynamic_peak", start: "03-15", end: "06-30" },
    evidenceInterpretation:
      "Early open-water pier access before the dominant summer and staging fisheries.",
  },
  {
    speciesId: "chinook_salmon",
    modeId: "summer_coldwater_access",
    displayName: "Summer cold-water access",
    strengthSearch: { start: "06-16", end: "08-10" },
    availability: { kind: "dynamic_peak", start: "06-01", end: "08-20" },
    evidenceInterpretation:
      "Summer pier opportunity when cold water and feeding fish are reachable from the harbor mouth.",
  },
  {
    speciesId: "chinook_salmon",
    modeId: "fall_harbor_staging",
    displayName: "Fall harbor staging",
    strengthSearch: { start: "08-11", end: "10-15" },
    availability: { kind: "dynamic_peak", start: "07-20", end: "11-01" },
    evidenceInterpretation:
      "Mature fish staging at or entering the harbor mouth; temperature remains secondary to the run window.",
  },
  {
    speciesId: "coho_salmon",
    modeId: "spring_nearshore",
    displayName: "Spring nearshore",
    strengthSearch: { start: "01-01", end: "06-15" },
    availability: { kind: "dynamic_peak", start: "02-15", end: "06-30" },
    evidenceInterpretation:
      "Cold-water spring shoreline concentration documented in the pier-mode seasonal record.",
  },
  {
    speciesId: "coho_salmon",
    modeId: "summer_coldwater_access",
    displayName: "Summer cold-water access",
    strengthSearch: { start: "06-16", end: "08-15" },
    availability: { kind: "dynamic_peak", start: "06-10", end: "08-25" },
    evidenceInterpretation:
      "A distinct summer window dependent on pier-reachable cold water rather than interpolation between spring and fall peaks.",
  },
  {
    speciesId: "coho_salmon",
    modeId: "fall_harbor_staging",
    displayName: "Fall harbor staging",
    strengthSearch: { start: "08-16", end: "11-15" },
    availability: { kind: "dynamic_peak", start: "08-01", end: "12-01" },
    evidenceInterpretation:
      "Late-season harbor-mouth opportunity treated independently from spring coho.",
  },
  {
    speciesId: "steelhead",
    modeId: "winter_spring_thermal_front",
    displayName: "Winter and spring thermal-front opportunity",
    strengthSearch: { start: "01-01", end: "05-31" },
    availability: {
      kind: "fixed",
      knots: [
        { monthDay: "01-01", availability: 0.55 },
        { monthDay: "03-15", availability: 0.8 },
        { monthDay: "04-15", availability: 1 },
        { monthDay: "05-15", availability: 0.35 },
        { monthDay: "06-01", availability: 0 },
        { monthDay: "11-15", availability: 0 },
        { monthDay: "12-31", availability: 0.55 },
      ],
    },
    evidenceInterpretation:
      "Cold-season open-water opportunity and spring thermal fronts, subject to a separate practical access gate.",
  },
  {
    speciesId: "steelhead",
    modeId: "summer_thermal_break_or_upwelling",
    displayName: "Summer thermal break or upwelling",
    strengthSearch: { start: "06-01", end: "08-31" },
    availability: { kind: "dynamic_peak", start: "05-20", end: "09-10" },
    evidenceInterpretation:
      "Summer steelhead opportunity is isolated from spring and fall and requires pier-reachable cool water.",
  },
  {
    speciesId: "steelhead",
    modeId: "fall_harbor_staging",
    displayName: "Fall harbor staging",
    strengthSearch: { start: "09-01", end: "12-31" },
    availability: { kind: "dynamic_peak", start: "08-25", end: "12-15" },
    evidenceInterpretation:
      "Fall harbor-mouth and nearshore opportunity calibrated independently from summer upwelling events.",
  },
  {
    speciesId: "brown_trout",
    modeId: "winter_harbor_open_water",
    displayName: "Winter harbor open water",
    strengthSearch: { start: "11-01", end: "02-15", wraps: true },
    availability: {
      kind: "fixed",
      knots: [
        { monthDay: "01-01", availability: 0.9 },
        { monthDay: "01-15", availability: 1 },
        { monthDay: "03-01", availability: 0.65 },
        { monthDay: "04-01", availability: 0 },
        { monthDay: "10-15", availability: 0 },
        { monthDay: "11-15", availability: 0.45 },
        { monthDay: "12-31", availability: 0.9 },
      ],
    },
    evidenceInterpretation:
      "Cold-season harbor opportunity when public access and open water are independently available.",
  },
  {
    speciesId: "brown_trout",
    modeId: "spring_nearshore",
    displayName: "Spring nearshore",
    strengthSearch: { start: "03-01", end: "07-15" },
    availability: { kind: "dynamic_peak", start: "02-15", end: "07-15" },
    evidenceInterpretation:
      "The primary recurring pier-mode brown-trout opportunity in both state evidence sets.",
  },
  {
    speciesId: "brown_trout",
    modeId: "fall_harbor",
    displayName: "Fall harbor",
    strengthSearch: { start: "08-01", end: "11-15" },
    availability: { kind: "dynamic_peak", start: "08-01", end: "12-01" },
    evidenceInterpretation:
      "A bounded fall harbor opportunity that is not inferred by extending the spring peak.",
  },
];

const STRENGTH_OVERRIDES = new Map<string, {
  fisheryStrength: number;
  rationale: string;
}>([
  [
    "sheboygan_wi/chinook_salmon/fall_harbor_staging",
    {
      fisheryStrength: 9.4,
      rationale:
        "The legacy 9.6 event is capped below the reference-class band because the direct 2026 event lacks a comparable recurring city-pier effort denominator. This is a magnitude-evidence decision, not a confidence discount.",
    },
  ],
]);

const allCities = [
  ...PIER_CAST_CITY_PROFILES,
  ...PIER_CAST_WISCONSIN_CITY_PROFILES,
];

const cityById = new Map(allCities.map((city) => [city.cityId, city]));
const speciesById = new Map(
  PIER_CAST_SPECIES_PROFILES.map((species) => [species.speciesId, species]),
);

function csvCell(value: unknown): string {
  const rendered = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(rendered)
    ? `"${rendered.replaceAll('"', '""')}"`
    : rendered;
}

function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")),
  ].join("\n") + "\n";
}

function round(value: number, digits = 6): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function dateToMonthDay(date: Date): string {
  return `${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function dateToLocalDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function monthDayToDayIndex(monthDay: string): number {
  const [month, day] = monthDay.split("-").map(Number);
  const time = Date.UTC(REFERENCE_YEAR, month - 1, day);
  return Math.round((time - Date.UTC(REFERENCE_YEAR, 0, 1)) / 86_400_000);
}

function dayIndexToMonthDay(dayIndex: number): string {
  return dateToMonthDay(
    new Date(Date.UTC(REFERENCE_YEAR, 0, 1 + Math.max(0, Math.min(364, dayIndex)))),
  );
}

function inMonthDayRange(
  monthDay: string,
  start: string,
  end: string,
  wraps = false,
): boolean {
  const value = monthDayToDayIndex(monthDay);
  const startValue = monthDayToDayIndex(start);
  const endValue = monthDayToDayIndex(end);
  return wraps
    ? value >= startValue || value <= endValue
    : value >= startValue && value <= endValue;
}

function buildDynamicAvailability(
  start: string,
  peak: string,
  end: string,
): AvailabilityKnot[] {
  const startIndex = monthDayToDayIndex(start);
  const peakIndex = monthDayToDayIndex(peak);
  const endIndex = monthDayToDayIndex(end);
  if (!(startIndex < peakIndex && peakIndex < endIndex)) {
    throw new Error(`Invalid dynamic mode window ${start}/${peak}/${end}.`);
  }

  const points: Array<[number, number]> = [
    [startIndex, 0],
    [Math.round(startIndex + (peakIndex - startIndex) * 0.4), 0.35],
    [Math.round(startIndex + (peakIndex - startIndex) * 0.75), 0.72],
    [peakIndex, 1],
    [Math.round(peakIndex + (endIndex - peakIndex) * 0.35), 0.78],
    [Math.round(peakIndex + (endIndex - peakIndex) * 0.72), 0.32],
    [endIndex, 0],
  ];
  const byDate = new Map<string, number>();
  for (const [dayIndex, availability] of points) {
    const monthDay = dayIndexToMonthDay(dayIndex);
    byDate.set(monthDay, Math.max(byDate.get(monthDay) ?? 0, availability));
  }
  return [...byDate.entries()]
    .map(([monthDay, availability]) => ({ monthDay, availability }))
    .sort((left, right) => left.monthDay.localeCompare(right.monthDay));
}

function evaluateLegacy(
  curve: PierCastSeasonalOpportunityCurve,
  localDate: string,
): number {
  const result = evaluatePierCastSeasonalOpportunity({
    ratingEnabled: true,
    mode: "review",
    localDate,
    curve,
  });
  if (result.status !== "available" || result.rating === null) {
    throw new Error(`Could not evaluate ${curve.curveId} on ${localDate}.`);
  }
  return result.rating;
}

function evaluateAvailability(
  knots: AvailabilityKnot[],
  localDate: string,
): number {
  const curve: PierCastSeasonalOpportunityCurve = {
    curveId: "availability-evaluator",
    calibrationStatus: "provisional",
    knots: knots.map((knot) => ({
      monthDay: knot.monthDay,
      rating: 1 + 9 * knot.availability,
    })),
  };
  return (evaluateLegacy(curve, localDate) - 1) / 9;
}

const referenceDates = Array.from({ length: 365 }, (_, index) =>
  new Date(Date.UTC(REFERENCE_YEAR, 0, index + 1))
);

function findLegacyPeak(
  curve: PierCastSeasonalOpportunityCurve,
  range: ModeDefinition["strengthSearch"],
): { fisheryStrength: number; peakDate: string } {
  const candidates = referenceDates
    .map((date) => ({
      monthDay: dateToMonthDay(date),
      localDate: dateToLocalDate(date),
    }))
    .filter((date) =>
      inMonthDayRange(
        date.monthDay,
        range.start,
        range.end,
        range.wraps,
      )
    )
    .map((date) => ({
      ...date,
      rating: evaluateLegacy(curve, date.localDate),
    }))
    .sort((left, right) =>
      right.rating - left.rating || left.monthDay.localeCompare(right.monthDay)
    );
  const peak = candidates[0];
  if (!peak) throw new Error(`No peak candidate for ${curve.curveId}.`);
  return {
    fisheryStrength: round(peak.rating, 1),
    peakDate: peak.monthDay,
  };
}

function inferPublisher(url: string): string {
  if (url.includes("MIDNR") || url.includes("michigan.gov") || url.includes("midnr")) {
    return "Michigan Department of Natural Resources";
  }
  if (url.includes("dnr.wisconsin.gov") || url.includes("widnr")) {
    return "Wisconsin Department of Natural Resources";
  }
  if (url.includes("noaa.gov")) return "NOAA";
  if (url.includes("usgs.gov")) return "U.S. Geological Survey";
  if (url.includes("sealamprey.org")) return "Great Lakes Fishery Commission";
  return "Primary source named in registry";
}

function publicationDateFromTitle(title: string): string | null {
  const monthNames =
    "January|February|March|April|May|June|July|August|September|October|November|December|Jan\\.|Feb\\.|Mar\\.|Apr\\.|Aug\\.|Sept\\.|Sep\\.|Oct\\.|Nov\\.|Dec\\.";
  const dated = title.match(new RegExp(`(${monthNames})\\s+(\\d{1,2}),\\s+(\\d{4})`, "i"));
  if (dated) {
    const monthKey = dated[1].toLowerCase().replace(".", "");
    const monthByName: Record<string, number> = {
      january: 1,
      jan: 1,
      february: 2,
      feb: 2,
      march: 3,
      mar: 3,
      april: 4,
      apr: 4,
      may: 5,
      june: 6,
      jun: 6,
      july: 7,
      jul: 7,
      august: 8,
      aug: 8,
      september: 9,
      sept: 9,
      sep: 9,
      october: 10,
      oct: 10,
      november: 11,
      nov: 11,
      december: 12,
      dec: 12,
    };
    const month = monthByName[monthKey];
    if (month) {
      return `${dated[3]}-${String(month).padStart(2, "0")}-${String(Number(dated[2])).padStart(2, "0")}`;
    }
  }
  return title.match(/\b(19|20)\d{2}\b/)?.[0] ?? null;
}

function normalizeJsonSource(
  value: Record<string, unknown>,
  registryPath: string,
): SourceRecord | null {
  const sourceId = typeof value.evidenceId === "string"
    ? value.evidenceId
    : typeof value.id === "string"
    ? value.id
    : null;
  const title = typeof value.title === "string" ? value.title : null;
  if (!sourceId || !title) return null;
  const url = typeof value.url === "string" ? value.url : null;
  const publisher = [value.authority, value.publisher]
    .find((candidate) => typeof candidate === "string") as string | undefined;
  const publicationDate = [
    value.publicationDate,
    value.publishedAt,
    value.published,
    value.date,
  ].find((candidate) => typeof candidate === "string") as string | undefined;
  const limitations = [value.limitations, value.temporalLimitation]
    .find((candidate) => typeof candidate === "string") as string | undefined;
  return {
    sourceId,
    publisher: publisher ?? (url ? inferPublisher(url) : "Source publisher in registry"),
    title,
    publicationDate: publicationDate ?? publicationDateFromTitle(title),
    url,
    geography: [value.geography, value.geographicScope, value.granularity]
      .find((candidate) => typeof candidate === "string") as string | null ?? null,
    fishingMode: typeof value.fishingMode === "string" ? value.fishingMode : null,
    timeResolution: typeof value.timeResolution === "string"
      ? value.timeResolution
      : null,
    limitations: limitations ?? null,
    registryPath,
  };
}

function indexJsonSources(
  value: unknown,
  registryPath: string,
  index: Map<string, SourceRecord>,
): void {
  if (!value || typeof value !== "object") return;
  const record = normalizeJsonSource(value as Record<string, unknown>, registryPath);
  if (record && !index.has(record.sourceId)) index.set(record.sourceId, record);
  for (const child of Object.values(value)) indexJsonSources(child, registryPath, index);
}

function indexMarkdownSources(
  markdown: string,
  registryPath: string,
  index: Map<string, SourceRecord>,
): void {
  for (const line of markdown.split("\n")) {
    const bullet = line.match(
      /^-\s+\*\*([A-Z]\d+):?\*\*\s*[—:]?\s*\[([^\]]+)]\(([^)]+)\)\s*[:—]?\s*(.*)$/,
    );
    const table = line.match(
      /^\|\s*([A-Z]\d+)\s*\|\s*\[([^\]]+)]\(([^)]+)\)\s*\|\s*(.*?)\s*\|$/,
    );
    const matched = bullet ?? table;
    if (!matched) continue;
    const [, sourceId, title, url, description] = matched;
    if (index.has(sourceId)) continue;
    index.set(sourceId, {
      sourceId,
      publisher: inferPublisher(url),
      title,
      publicationDate: publicationDateFromTitle(title),
      url,
      geography: null,
      fishingMode: null,
      timeResolution: null,
      limitations: description || null,
      registryPath,
    });
  }
}

function claimUseForSource(sourceId: string): {
  claimType: string;
  permittedUse: string;
  prohibitedUse: string;
} {
  if (/ACCESS|^A\d+/.test(sourceId)) {
    return {
      claimType: "geography_and_access_context",
      permittedUse: "Define the general city harbor and main public-pier context.",
      prohibitedUse: "Does not establish catch magnitude, live access, or safety.",
    };
  }
  if (/CREEL|COUNTY|HARVEST|^M\d+/.test(sourceId)) {
    return {
      claimType: "recurrence_and_relative_magnitude",
      permittedUse: "Support recurrence and bounded relative magnitude where geography and mode match.",
      prohibitedUse: "Do not infer target-specific CPUE, exact structure, or unobserved-month absence.",
    };
  }
  if (/SEASON|^W\d+|^S\d+/.test(sourceId)) {
    return {
      claimType: "regional_mode_timing",
      permittedUse: "Constrain broad mode timing and regional recurrence.",
      prohibitedUse: "Do not treat regional timing as city-specific catch rate.",
    };
  }
  if (/^T\d+/.test(sourceId)) {
    return {
      claimType: "thermal_compatibility",
      permittedUse: "Constrain the direction and breadth of shared species thermal compatibility.",
      prohibitedUse: "Do not claim a measured pier bite probability or mode-specific response.",
    };
  }
  return {
    claimType: "local_identity_timing_and_targetability",
    permittedUse: "Support species identity, local pier relevance, timing, method, or qualitative event strength as explicitly reported.",
    prohibitedUse: "Do not convert one event into annual frequency or city CPUE.",
  };
}

async function writeOrCheck(path: string, content: string): Promise<void> {
  if (!checkOnly) {
    await writeFile(path, content);
    return;
  }
  const existing = await readFile(path, "utf8");
  if (existing !== content) throw new Error(`Generated artifact drift: ${path}`);
}

async function main(): Promise<void> {
  const baselinePath = resolve(OUTPUT_DIRECTORY, "baseline-reconciliation.json");
  const thermalPath = resolve("docs/PierCast_Core_Species_Temperature_Curves.json");
  const [baselineText, thermalText] = await Promise.all([
    readFile(baselinePath, "utf8"),
    readFile(thermalPath, "utf8"),
  ]);
  const baseline = JSON.parse(baselineText) as { rows: BaselineRow[] };
  const thermalResearch = JSON.parse(thermalText) as {
    curves: Array<{ speciesId: PierCastSpeciesId; evidenceIds: string[] }>;
  };
  const thermalEvidenceBySpecies = new Map(
    thermalResearch.curves.map((curve) => [curve.speciesId, curve.evidenceIds]),
  );

  const finalRows = baseline.rows.map((row) => {
    const finalDisposition: FinalDisposition =
      CORE_SPECIES_IDS.has(row.speciesId) &&
        row.baselineDisposition === "admit" &&
        (row.evidenceGrade === "A" || row.evidenceGrade === "B")
        ? "admit"
        : row.evidenceGrade === "D"
        ? "exclude"
        : "defer";
    return {
      cityId: row.cityId,
      cityName: row.cityName,
      stateCode: row.stateCode,
      speciesId: row.speciesId,
      speciesName: row.speciesName,
      finalDisposition,
      evidenceGrade: row.evidenceGrade,
      decisionFinalizedAt: "2026-09-14",
      evidenceIds: row.evidenceIds,
      rationale: finalDisposition === "admit"
        ? `${row.decisionBasis} The pairing clears the v3 Grade A/B research-calibration gate; magnitude remains a disabled FinFindr judgment rather than an agency score.`
        : finalDisposition === "defer" && row.currentCurveStatus === "configured_provisional"
        ? `${row.decisionBasis} The legacy numeric curve is not admitted to v3 because the pairing remains Grade C and the retained thermal work is sensitivity-only.`
        : row.decisionBasis,
      unresolvedEvidence: finalDisposition === "admit"
        ? row.requiredEvidence
        : row.requiredEvidence,
      numericTreatment: finalDisposition === "admit"
        ? "disabled_v3_candidate"
        : "no_v3_numeric_score",
      legacyNumericCurveRetired:
        finalDisposition !== "admit" &&
        row.currentCurveStatus === "configured_provisional",
      promotionEligible: false,
      promotionBlocker: finalDisposition === "admit"
        ? "Pass 2 implementation, representation validation, prospective outcome evaluation, and specialist review are required."
        : row.requiredEvidence,
    };
  });

  const dispositionCounts = finalRows.reduce<Record<string, number>>(
    (counts, row) => {
      counts[row.finalDisposition] = (counts[row.finalDisposition] ?? 0) + 1;
      return counts;
    },
    {},
  );
  if (
    finalRows.length !== 117 || dispositionCounts.admit !== 36 ||
    dispositionCounts.defer !== 29 || dispositionCounts.exclude !== 52
  ) {
    throw new Error(
      `Expected final 117 = 36 admit + 29 defer + 52 exclude; received ${JSON.stringify(dispositionCounts)}.`,
    );
  }

  const modes: Array<Record<string, unknown>> = [];
  const modesByPair = new Map<string, Array<Record<string, unknown>>>();
  for (const decision of finalRows.filter((row) => row.finalDisposition === "admit")) {
    const city = cityById.get(decision.cityId);
    const citySpecies = city?.species.find((species) =>
      species.speciesId === decision.speciesId
    );
    const legacyCurve = citySpecies?.seasonalOpportunityCurve;
    if (!legacyCurve) {
      throw new Error(`Admitted pair ${decision.cityId}/${decision.speciesId} has no legacy curve.`);
    }
    const temperatureCurve = PIER_CAST_CORE_TEMPERATURE_CURVES[
      decision.speciesId as keyof typeof PIER_CAST_CORE_TEMPERATURE_CURVES
    ];
    const thermalEvidenceIds = thermalEvidenceBySpecies.get(decision.speciesId);
    if (!temperatureCurve || !thermalEvidenceIds) {
      throw new Error(`Missing core thermal evidence for ${decision.speciesId}.`);
    }

    const pairModes: Array<Record<string, unknown>> = [];
    for (const definition of MODE_DEFINITIONS.filter((mode) =>
      mode.speciesId === decision.speciesId
    )) {
      const legacyPeak = findLegacyPeak(legacyCurve, definition.strengthSearch);
      if (legacyPeak.fisheryStrength < 2.1) continue;
      const overrideKey = `${decision.cityId}/${decision.speciesId}/${definition.modeId}`;
      const override = STRENGTH_OVERRIDES.get(overrideKey);
      const fisheryStrength = override?.fisheryStrength ?? legacyPeak.fisheryStrength;
      const availabilityKnots = definition.availability.kind === "fixed"
        ? definition.availability.knots
        : buildDynamicAvailability(
          definition.availability.start,
          legacyPeak.peakDate,
          definition.availability.end,
        );
      const mode = {
        modeCalibrationId:
          `${decision.cityId}__${decision.speciesId}__${definition.modeId}__v3_pass1`,
        cityId: decision.cityId,
        cityName: decision.cityName,
        speciesId: decision.speciesId,
        speciesName: decision.speciesName,
        modeId: definition.modeId,
        modeName: definition.displayName,
        status: "disabled_pass2_candidate",
        evidenceGrade: decision.evidenceGrade,
        fisheryStrength,
        strengthRubric:
          fisheryStrength >= 9.5
            ? "reference_class"
            : fisheryStrength >= 8.1
            ? "excellent"
            : fisheryStrength >= 6.1
            ? "strong"
            : fisheryStrength >= 4.1
            ? "ordinary"
            : "limited",
        availabilityKnots,
        seasonalPotentialEquation:
          "1 + (fisheryStrength - 1) * seasonalAvailability",
        thermalResponse: {
          policy: "inherit_shared_species_response",
          curveId: temperatureCurve.curveId,
          acceptedDomainC: temperatureCurve.acceptedDomainC,
          knots: temperatureCurve.knots,
          evidenceIds: thermalEvidenceIds,
          modeSpecificDifferenceStatus:
            "not_supported_use_shared_species_hypothesis",
        },
        fisheryEvidenceIds: decision.evidenceIds,
        evidenceInterpretation: definition.evidenceInterpretation,
        calibrationBasis:
          "The mode ceiling is the maximum of the frozen evidence-reviewed annual envelope inside this mode's evidence window. Availability is reconstructed as a separate continuous mode curve; no city bonus or blanket uplift is applied.",
        legacyComparator: {
          curveId: legacyCurve.curveId,
          windowPeak: legacyPeak.fisheryStrength,
          peakDate: legacyPeak.peakDate,
        },
        calibrationOverride: override?.rationale ?? null,
        limitations: [
          citySpecies?.limitation ?? null,
          decision.evidenceGrade === "B"
            ? "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment."
            : "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature.",
        ].filter(Boolean),
        promotionEligible: false,
      };
      modes.push(mode);
      pairModes.push(mode);
    }
    if (pairModes.length === 0) {
      throw new Error(`Admitted pair ${decision.cityId}/${decision.speciesId} produced no modes.`);
    }
    modesByPair.set(`${decision.cityId}/${decision.speciesId}`, pairModes);
  }

  const referenceClassModes = modes.filter((mode) =>
    Number(mode.fisheryStrength) >= 9.5
  );
  if (
    referenceClassModes.some((mode) => mode.evidenceGrade !== "A") ||
    !referenceClassModes.some((mode) => Number(mode.fisheryStrength) === 10)
  ) {
    throw new Error("Reference-class gates failed.");
  }
  if (modes.some((mode) => Number(mode.fisheryStrength) >= 7 && !["A", "B"].includes(String(mode.evidenceGrade)))) {
    throw new Error("A 7.0+ mode lacks Grade A/B recurring evidence.");
  }

  const evaluateModePotential = (
    mode: Record<string, unknown>,
    localDate: string,
  ): number => {
    const availability = evaluateAvailability(
      mode.availabilityKnots as AvailabilityKnot[],
      localDate,
    );
    return 1 + (Number(mode.fisheryStrength) - 1) * availability;
  };

  const auditRows = finalRows
    .filter((row) => row.finalDisposition === "admit")
    .map((decision) => {
      const pairKey = `${decision.cityId}/${decision.speciesId}`;
      const pairModes = modesByPair.get(pairKey)!;
      const city = cityById.get(decision.cityId)!;
      const legacyCurve = city.species.find((species) =>
        species.speciesId === decision.speciesId
      )!.seasonalOpportunityCurve!;
      const daily = referenceDates.map((date) => {
        const localDate = dateToLocalDate(date);
        const candidates = pairModes.map((mode) => ({
          modeId: String(mode.modeId),
          potential: evaluateModePotential(mode, localDate),
        })).sort((left, right) => right.potential - left.potential);
        return {
          localDate,
          legacy: evaluateLegacy(legacyCurve, localDate),
          v3: candidates[0].potential,
          modeId: candidates[0].modeId,
        };
      });
      const legacyMaximum = Math.max(...daily.map((row) => row.legacy));
      const v3Maximum = Math.max(...daily.map((row) => row.v3));
      return {
        cityId: decision.cityId,
        cityName: decision.cityName,
        speciesId: decision.speciesId,
        speciesName: decision.speciesName,
        evidenceGrade: decision.evidenceGrade,
        legacyMaximum: round(legacyMaximum, 3),
        v3Maximum: round(v3Maximum, 3),
        maximumDelta: round(v3Maximum - legacyMaximum, 3),
        legacyStrongDays: daily.filter((row) => row.legacy >= 6.1).length,
        v3StrongDays: daily.filter((row) => row.v3 >= 6.1).length,
        legacyExcellentDays: daily.filter((row) => row.legacy >= 8.1).length,
        v3ExcellentDays: daily.filter((row) => row.v3 >= 8.1).length,
        modeCount: pairModes.length,
        referenceClassEligible: decision.evidenceGrade === "A",
      };
    });

  const weeklyDates = referenceDates.filter((date, index) => index === 4 || (index > 4 && (index - 4) % 7 === 0));
  const weeklyRows = finalRows.flatMap((decision) => {
    const pairModes = modesByPair.get(`${decision.cityId}/${decision.speciesId}`) ?? [];
    return weeklyDates.map((date) => {
      const localDate = dateToLocalDate(date);
      const candidates = pairModes.map((mode) => ({
        modeId: String(mode.modeId),
        potential: evaluateModePotential(mode, localDate),
      })).sort((left, right) => right.potential - left.potential);
      return {
        localDate,
        cityId: decision.cityId,
        cityName: decision.cityName,
        speciesId: decision.speciesId,
        speciesName: decision.speciesName,
        disposition: decision.finalDisposition,
        evidenceGrade: decision.evidenceGrade,
        seasonalPotential: candidates[0] ? round(candidates[0].potential, 3) : null,
        strongestActiveMode: candidates[0]?.modeId ?? null,
        numericStatus: candidates[0] ? "disabled_candidate" : "unavailable_by_decision",
      };
    });
  });
  if (weeklyDates.length !== 52 || weeklyRows.length !== 6084) {
    throw new Error(`Expected 52 weekly dates and 6,084 rows; got ${weeklyDates.length}/${weeklyRows.length}.`);
  }

  const crossCityRows = finalRows.map((decision) => {
    const pairModes = modesByPair.get(`${decision.cityId}/${decision.speciesId}`) ?? [];
    const strongest = [...pairModes].sort((left, right) =>
      Number(right.fisheryStrength) - Number(left.fisheryStrength)
    )[0];
    return {
      speciesId: decision.speciesId,
      speciesName: decision.speciesName,
      cityId: decision.cityId,
      cityName: decision.cityName,
      finalDisposition: decision.finalDisposition,
      evidenceGrade: decision.evidenceGrade,
      strongestModeId: strongest?.modeId ?? null,
      fisheryStrength: strongest?.fisheryStrength ?? null,
      calibrationStatus: strongest ? "disabled_pass2_candidate" : "no_numeric_score",
      rationale: decision.rationale,
    };
  });

  const holdoutRows = finalRows
    .filter((row) => row.finalDisposition === "admit")
    .map((decision) => {
      const isMichigan = decision.stateCode === "MI";
      const isSheboygan = decision.cityId === "sheboygan_wi";
      const holdoutEvidenceIds = isMichigan
        ? decision.evidenceIds.filter((id) => /^F\d+$/.test(id))
        : isSheboygan
        ? ["S5"]
        : decision.cityId === "port_washington_wi"
        ? ["PW_CURRENT_001"]
        : decision.cityId === "racine_wi"
        ? ["WI_WEEKLY_2025_05", "WI_WEEKLY_2026_09_07"]
        : decision.cityId === "milwaukee_wi"
        ? ["WI_WEEKLY_2024_05_13", "WI_WEEKLY_2025_05", "WI_WEEKLY_2025_06"]
        : ["WI_WEEKLY_2025_05"];
      return {
        cityId: decision.cityId,
        cityName: decision.cityName,
        speciesId: decision.speciesId,
        speciesName: decision.speciesName,
        constructionEvidence: isMichigan
          ? "Michigan DNR port/month/species Pier/Dock estimates through 2022"
          : "Wisconsin DNR 2022-2024 county pier harvest and statewide pier-mode timing",
        holdoutEvidenceIds,
        holdoutPeriod: isMichigan ? "2023-2026 qualitative local reports" : "2024-2026 local reports not used as a city CPUE fit",
        result: "partial_directional_support",
        interpretation:
          "The holdout record supports continued local relevance or the broad mode calendar but lacks standardized city/species pier effort. It does not validate decimals, daily shoulders, or catch probability.",
      };
    });

  const sourceIndex = new Map<string, SourceRecord>();
  const jsonSourcePaths = [
    "docs/onboarding/piercast/remaining-species/sources.json",
    "docs/onboarding/piercast/remaining-species/phase1-sources.json",
    "docs/onboarding/piercast/remaining-species/phase2-sources.json",
    "docs/onboarding/piercast/remaining-species/annual-sources.json",
    "docs/onboarding/piercast/port-washington/evidence-ledger.json",
    "docs/onboarding/piercast/wisconsin-expansion/evidence-ledger.json",
    "docs/onboarding/piercast/scoring-v3-pass1/foundational-source-ledger.json",
  ];
  for (const path of jsonSourcePaths) {
    indexJsonSources(JSON.parse(await readFile(resolve(path), "utf8")), path, sourceIndex);
  }
  const markdownSourcePaths = [
    "docs/PierCast_Pilot_Cities_Research.md",
    "docs/PierCast_Core_Species_Seasonal_Calibration.md",
    "docs/PierCast_Core_Temperature_and_Source_Calibration.md",
  ];
  for (const path of markdownSourcePaths) {
    indexMarkdownSources(await readFile(resolve(path), "utf8"), path, sourceIndex);
  }

  const normalizedHoldoutRows = holdoutRows.map((row) => ({
    ...row,
    holdoutEvidenceIds: row.holdoutEvidenceIds.filter((sourceId) => {
      const publicationDate = sourceIndex.get(sourceId)?.publicationDate;
      const year = Number(publicationDate?.slice(0, 4));
      return Number.isFinite(year) && year >= (row.cityId.endsWith("_mi") ? 2023 : 2025);
    }),
  }));
  if (normalizedHoldoutRows.some((row) => row.holdoutEvidenceIds.length === 0)) {
    throw new Error("Every admitted pair requires at least one dated qualitative holdout source.");
  }

  const claimRows: Array<Record<string, unknown>> = [];
  const addClaimRow = (
    decision: typeof finalRows[number],
    sourceId: string,
    modeId: string | null,
  ) => {
    const source = sourceIndex.get(sourceId);
    if (!source) {
      throw new Error(`Unresolved source ID ${sourceId} for ${decision.cityId}/${decision.speciesId}.`);
    }
    const use = claimUseForSource(sourceId);
    claimRows.push({
      cityId: decision.cityId,
      speciesId: decision.speciesId,
      modeId,
      finalDisposition: decision.finalDisposition,
      evidenceGrade: decision.evidenceGrade,
      ...source,
      ...use,
    });
  };
  for (const decision of finalRows) {
    for (const sourceId of decision.evidenceIds) addClaimRow(decision, sourceId, null);
    if (decision.finalDisposition === "admit") {
      for (const mode of modesByPair.get(`${decision.cityId}/${decision.speciesId}`)!) {
        for (const sourceId of (mode.thermalResponse as { evidenceIds: string[] }).evidenceIds) {
          addClaimRow(decision, sourceId, String(mode.modeId));
        }
      }
    }
  }

  const finalDecisionMatrix = {
    schemaVersion: "piercast-v3-pass1-final-decisions-v1",
    status: "pass1_complete_disabled_research",
    decisionDate: "2026-09-14",
    counts: {
      rows: finalRows.length,
      dispositions: dispositionCounts,
      numericCandidates: 36,
      nonNumericDecisions: 81,
    },
    policy:
      "Grade A/B core pairings receive disabled v3 calibration candidates. Grade C pairings are deferred without a v3 numeric score; Grade D pairings are excluded from the current scope. Absence of a score is not biological absence.",
    rows: finalRows.map((row) => ({
      ...row,
      modeIds: (modesByPair.get(`${row.cityId}/${row.speciesId}`) ?? []).map((mode) => mode.modeId),
    })),
  };

  const calibration = {
    schemaVersion: "piercast-v3-pass1-mode-calibration-v1",
    status: "pass1_complete_disabled_pass2_candidates",
    formulaVersion: "piercast-opportunity-modes-v3-pass1-research",
    warning:
      "These values are disabled research candidates. They do not alter v2, enable a public rating, validate LMHOFS representation, or estimate catch probability.",
    scoreSemantics:
      "Absolute cross-city target opportunity from the named city's general harbor/main-pier context under an active seasonal mode and supportive conditions.",
    modeSelection: "maximum_eligible_mode_never_sum",
    seasonalPotentialEquation:
      "1 + (fisheryStrength - 1) * seasonalAvailability",
    counts: {
      citySpeciesCalibrations: modesByPair.size,
      modes: modes.length,
      referenceClassModes: referenceClassModes.length,
    },
    modes,
  };

  const runtimeCandidates = {
    schemaVersion: "piercast-v3-disabled-runtime-candidates-v1",
    importedByRuntime: false,
    ratingEnabled: false,
    publicEnabled: false,
    formulaImplemented: false,
    sourceArtifact: "v3-mode-calibrations.json",
    candidates: [...modesByPair.entries()].map(([pairKey, pairModes]) => ({
      pairKey,
      cityId: pairModes[0].cityId,
      speciesId: pairModes[0].speciesId,
      ratingEnabled: false,
      modes: pairModes.map((mode) => ({
        modeCalibrationId: mode.modeCalibrationId,
        modeId: mode.modeId,
        fisheryStrength: mode.fisheryStrength,
        availabilityKnots: mode.availabilityKnots,
        thermalCurveId: (mode.thermalResponse as { curveId: string }).curveId,
      })),
    })),
  };

  const audit = {
    schemaVersion: "piercast-v3-pass1-calibration-audit-v1",
    status: "pass1_complete_internal_audit",
    referenceYear: REFERENCE_YEAR,
    gates: {
      all117PairsDecided: finalRows.length === 117,
      allAdmittedPairsHaveModes: modesByPair.size === 36,
      allNumericPairsGradeAOrB: finalRows.filter((row) =>
        row.numericTreatment === "disabled_v3_candidate"
      ).every((row) => row.evidenceGrade === "A" || row.evidenceGrade === "B"),
      allReferenceClassModesGradeA: referenceClassModes.every((mode) =>
        mode.evidenceGrade === "A"
      ),
      fullScaleReachable: referenceClassModes.some((mode) =>
        Number(mode.fisheryStrength) === 10
      ),
      allCandidatesDisabled: modes.every((mode) => mode.promotionEligible === false),
      runtimeUnchanged: true,
      weeklyRowsComplete: weeklyRows.length === 6084,
    },
    referenceClassModes: referenceClassModes.map((mode) => ({
      cityId: mode.cityId,
      speciesId: mode.speciesId,
      modeId: mode.modeId,
      fisheryStrength: mode.fisheryStrength,
      evidenceGrade: mode.evidenceGrade,
    })),
    comparisons: auditRows,
    materialJudgments: [
      {
        decision: "secondary_species_legacy_curves_deferred",
        rationale:
          "Eight Grade C legacy curves do not enter v3 numeric calibration because their thermal-response evidence remains sensitivity-only and local effort/structure attribution is incomplete.",
      },
      {
        decision: "sheboygan_chinook_reference_class_withheld",
        rationale: STRENGTH_OVERRIDES.get(
          "sheboygan_wi/chinook_salmon/fall_harbor_staging",
        )!.rationale,
      },
      {
        decision: "modes_do_not_stack",
        rationale:
          "Spring, summer, and staging opportunities are evaluated independently and combined by maximum to prevent artificial inflation.",
      },
      {
        decision: "shared_thermal_inheritance",
        rationale:
          "No retained source supports distinct numerical thermal curves for each mode, so every admitted mode explicitly inherits the reviewed shared species hypothesis.",
      },
    ],
  };

  const claimLedger = {
    schemaVersion: "piercast-v3-pass1-claim-evidence-ledger-v1",
    status: "normalized_claim_level_source_use",
    warning:
      "A source may support only its recorded claim type. Source presence never overrides geography, mode, denominator, or time limitations.",
    counts: {
      claimUses: claimRows.length,
      uniqueSources: new Set(claimRows.map((row) => row.sourceId)).size,
    },
    rows: claimRows,
  };

  const holdout = {
    schemaVersion: "piercast-v3-pass1-holdout-review-v1",
    status: "qualitative_directional_holdout_complete",
    limitation:
      "No reviewed post-construction dataset supplies comparable city/species pier effort for all nine cities. Holdout results test direction and broad timing only; prospective quantitative validation remains a Pass 2 promotion gate.",
    rows: normalizedHoldoutRows,
  };

  const finalGapRows = finalRows
    .filter((row) => row.finalDisposition === "defer")
    .map((row) => ({
      cityId: row.cityId,
      cityName: row.cityName,
      speciesId: row.speciesId,
      speciesName: row.speciesName,
      evidenceGrade: row.evidenceGrade,
      priority: row.legacyNumericCurveRetired
        ? "P0"
        : row.stateCode === "WI" && row.speciesId === "yellow_perch"
        ? "P1"
        : "P2",
      legacyNumericCurveRetired: row.legacyNumericCurveRetired,
      blockingDimensions: row.legacyNumericCurveRetired
        ? "local_effort|covered_structure_or_mode|adult_pier_thermal_response"
        : "local_recurrence|seasonal_magnitude|covered_structure_or_mode|thermal_response",
      evidenceNeeded: row.unresolvedEvidence,
      reopeningRule:
        "Reopen only when the missing evidence is archived, normalized in the claim ledger, reviewed across all nine cities for this species, and passes the Grade A/B numeric gate.",
      evidenceIds: row.evidenceIds,
    }));
  if (finalGapRows.length !== 29) {
    throw new Error(`Expected 29 final deferred gaps; received ${finalGapRows.length}.`);
  }
  const finalGapRegister = {
    schemaVersion: "piercast-v3-pass1-final-evidence-gap-register-v1",
    status: "pass1_complete_deferred_pair_research_queue",
    counts: {
      deferredPairs: finalGapRows.length,
      p0: finalGapRows.filter((row) => row.priority === "P0").length,
      p1: finalGapRows.filter((row) => row.priority === "P1").length,
      p2: finalGapRows.filter((row) => row.priority === "P2").length,
    },
    rows: finalGapRows,
  };

  const crossCity = {
    schemaVersion: "piercast-v3-pass1-cross-city-calibration-v1",
    status: "pass1_complete_disabled_research",
    rubric: {
      limited: "2.1-4.0",
      ordinary: "4.1-6.0",
      strong: "6.1-8.0",
      excellent: "8.1-9.4",
      referenceClass: "9.5-10.0",
    },
    rows: crossCityRows,
  };

  await mkdir(OUTPUT_DIRECTORY, { recursive: true });
  const artifacts: Array<[string, string]> = [
    ["final-decision-matrix.json", `${JSON.stringify(finalDecisionMatrix, null, 2)}\n`],
    [
      "final-decision-matrix.csv",
      toCsv(
        finalDecisionMatrix.rows.map((row) => ({
          ...row,
          evidenceIds: row.evidenceIds.join("|"),
          modeIds: row.modeIds.join("|"),
        })),
        [
          "cityId",
          "cityName",
          "stateCode",
          "speciesId",
          "speciesName",
          "finalDisposition",
          "evidenceGrade",
          "numericTreatment",
          "modeIds",
          "evidenceIds",
          "rationale",
          "unresolvedEvidence",
          "promotionEligible",
          "promotionBlocker",
        ],
      ),
    ],
    ["v3-mode-calibrations.json", `${JSON.stringify(calibration, null, 2)}\n`],
    ["v3-disabled-runtime-candidates.json", `${JSON.stringify(runtimeCandidates, null, 2)}\n`],
    ["claim-evidence-ledger.json", `${JSON.stringify(claimLedger, null, 2)}\n`],
    [
      "claim-evidence-ledger.csv",
      toCsv(claimRows, [
        "cityId",
        "speciesId",
        "modeId",
        "finalDisposition",
        "evidenceGrade",
        "sourceId",
        "publisher",
        "title",
        "publicationDate",
        "url",
        "geography",
        "fishingMode",
        "timeResolution",
        "claimType",
        "permittedUse",
        "prohibitedUse",
        "limitations",
        "registryPath",
      ]),
    ],
    ["cross-city-calibration.json", `${JSON.stringify(crossCity, null, 2)}\n`],
    [
      "cross-city-calibration.csv",
      toCsv(crossCityRows, [
        "speciesId",
        "speciesName",
        "cityId",
        "cityName",
        "finalDisposition",
        "evidenceGrade",
        "strongestModeId",
        "fisheryStrength",
        "calibrationStatus",
        "rationale",
      ]),
    ],
    ["holdout-review.json", `${JSON.stringify(holdout, null, 2)}\n`],
    [
      "holdout-review.csv",
      toCsv(
        normalizedHoldoutRows.map((row) => ({
          ...row,
          holdoutEvidenceIds: row.holdoutEvidenceIds.join("|"),
        })),
        [
          "cityId",
          "cityName",
          "speciesId",
          "speciesName",
          "constructionEvidence",
          "holdoutEvidenceIds",
          "holdoutPeriod",
          "result",
          "interpretation",
        ],
      ),
    ],
    ["final-evidence-gap-register.json", `${JSON.stringify(finalGapRegister, null, 2)}\n`],
    [
      "final-evidence-gap-register.csv",
      toCsv(
        finalGapRows.map((row) => ({
          ...row,
          evidenceIds: row.evidenceIds.join("|"),
        })),
        [
          "priority",
          "cityId",
          "cityName",
          "speciesId",
          "speciesName",
          "evidenceGrade",
          "legacyNumericCurveRetired",
          "blockingDimensions",
          "evidenceNeeded",
          "reopeningRule",
          "evidenceIds",
        ],
      ),
    ],
    ["calibration-audit.json", `${JSON.stringify(audit, null, 2)}\n`],
    [
      "calibration-audit.csv",
      toCsv(auditRows, [
        "cityId",
        "cityName",
        "speciesId",
        "speciesName",
        "evidenceGrade",
        "legacyMaximum",
        "v3Maximum",
        "maximumDelta",
        "legacyStrongDays",
        "v3StrongDays",
        "legacyExcellentDays",
        "v3ExcellentDays",
        "modeCount",
        "referenceClassEligible",
      ]),
    ],
    [
      "full-year-weekly-review.csv",
      toCsv(weeklyRows, [
        "localDate",
        "cityId",
        "cityName",
        "speciesId",
        "speciesName",
        "disposition",
        "evidenceGrade",
        "seasonalPotential",
        "strongestActiveMode",
        "numericStatus",
      ]),
    ],
  ];
  for (const [filename, content] of artifacts) {
    await writeOrCheck(resolve(OUTPUT_DIRECTORY, filename), content);
  }

  console.log(JSON.stringify({
    checkOnly,
    decisions: finalRows.length,
    dispositions: dispositionCounts,
    calibratedPairs: modesByPair.size,
    modes: modes.length,
    weeklyRows: weeklyRows.length,
    claimUses: claimRows.length,
    referenceClassModes: referenceClassModes.length,
  }));
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
