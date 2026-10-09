/**
 * Owner-approved research candidate for the all-city lake-trout recalibration.
 *
 * IMPORTANT:
 * - This file is not imported by a live function.
 * - It does not alter v3/v4 responses or rankings.
 * - `fisheryStrength` is an internal ceiling, not catch probability.
 * - Monthly availability assumes the covered structure is safely accessible.
 *   Runtime access, ice and regulation gates must override these values.
 */

export const PIER_CAST_LAKE_TROUT_V5_CANDIDATE_VERSION =
  "piercast-lake-trout-all-city-v5-candidate-2026-10-09" as const;
export const PIER_CAST_LAKE_TROUT_V5_APP_ENABLED = true as const;
export const PIER_CAST_LAKE_TROUT_V5_SERVER_RUNTIME_ENABLED = false as const;

export const PIER_CAST_LAKE_TROUT_V5_SOURCE_IDS = [
  "MI_DNR_LAKE_TROUT_SPECIES",
  "MI_DNR_ROADMAP_LAKE_MICHIGAN",
  "MI_DNR_ROADMAP_LAKE_HURON",
  "MI_DNR_BETTER_FISHING_WATERS",
  "MI_DNR_CREEL_PIER_DOCK",
  "MI_DNR_2026_REGULATIONS",
  "WI_DNR_CREEL_1998_2024",
  "WI_DNR_LAKE_TROUT_GUIDE",
  "WI_DNR_2026_REGULATIONS",
  "IL_DNR_LAKE_MICHIGAN_FISHERY",
  "IN_DNR_LAKE_MICHIGAN_SHORE_GUIDE",
] as const;

export type PierCastLakeTroutV5SourceId =
  typeof PIER_CAST_LAKE_TROUT_V5_SOURCE_IDS[number];
export type PierCastLakeTroutV5Batch = 1 | 2 | 3;
export type PierCastLakeTroutV5Decision =
  | "recalibrate"
  | "provisional_admission"
  | "retain"
  | "research_hold";
export type PierCastLakeTroutV5EvidenceGrade = "A" | "B" | "C";

export type PierCastLakeTroutV5Calibration = Readonly<{
  batch: PierCastLakeTroutV5Batch;
  cityId: string;
  cityName: string;
  decision: PierCastLakeTroutV5Decision;
  evidenceGrade: PierCastLakeTroutV5EvidenceGrade;
  /** Null means deliberately unscored, not zero opportunity. */
  fisheryStrength: number | null;
  /** January through December, before temperature and live-access modifiers. */
  monthlyAvailability:
    | readonly [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
    ]
    | null;
  closedMonths: readonly number[];
  sourceIds: readonly PierCastLakeTroutV5SourceId[];
  rationale: string;
}>;

const LM_OPEN_YEAR = [
  0.72,
  0.68,
  0.74,
  0.72,
  0.52,
  0.30,
  0.14,
  0.14,
  0.30,
  0.72,
  1,
  0.88,
] as const;
const LH_OPEN_YEAR = [
  0.62,
  0.58,
  0.68,
  0.78,
  0.72,
  0.48,
  0.28,
  0.28,
  0.55,
  0.82,
  1,
  0.86,
] as const;
const WI_OPEN_YEAR = [
  0.60,
  0.55,
  0.65,
  0.74,
  0.52,
  0.24,
  0.10,
  0.10,
  0.24,
  0.70,
  1,
  0.85,
] as const;
const CHICAGO_OPEN_YEAR = [
  0.72,
  0.68,
  0.72,
  0.76,
  0.54,
  0.25,
  0.14,
  0.14,
  0.30,
  0.76,
  1,
  0.90,
] as const;
const CLOSED_OCT_DEC = [
  0.65,
  0.62,
  0.72,
  0.82,
  0.82,
  0.62,
  0.42,
  0.40,
  0.58,
  0,
  0,
  0,
] as const;

const MI_LM = [
  "MI_DNR_LAKE_TROUT_SPECIES",
  "MI_DNR_ROADMAP_LAKE_MICHIGAN",
  "MI_DNR_2026_REGULATIONS",
] as const;
const MI_LM_PIER = [
  ...MI_LM,
  "MI_DNR_BETTER_FISHING_WATERS",
  "MI_DNR_CREEL_PIER_DOCK",
] as const;
const MI_LH = [
  "MI_DNR_LAKE_TROUT_SPECIES",
  "MI_DNR_ROADMAP_LAKE_HURON",
  "MI_DNR_2026_REGULATIONS",
] as const;
const MI_LH_PIER = [
  ...MI_LH,
  "MI_DNR_BETTER_FISHING_WATERS",
  "MI_DNR_CREEL_PIER_DOCK",
] as const;
const WI = [
  "WI_DNR_CREEL_1998_2024",
  "WI_DNR_LAKE_TROUT_GUIDE",
  "WI_DNR_2026_REGULATIONS",
] as const;

export const PIER_CAST_LAKE_TROUT_V5_CANDIDATES = [
  // Batch 1 — west Michigan
  {
    batch: 1,
    cityId: "st_joseph_mi",
    cityName: "St. Joseph",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 5.8,
    monthlyAvailability: LM_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LM_PIER,
    rationale:
      "DNR names the pier and cold-season port opportunity; raise the peak without transferring offshore abundance.",
  },
  {
    batch: 1,
    cityId: "south_haven_mi",
    cityName: "South Haven",
    decision: "recalibrate",
    evidenceGrade: "A",
    fisheryStrength: 5.6,
    monthlyAvailability: LM_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LM_PIER,
    rationale:
      "Recurring pier/dock creel positives and all-season port guidance support a materially higher cold-season ceiling.",
  },
  {
    batch: 1,
    cityId: "holland_mi",
    cityName: "Holland",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 6.6,
    monthlyAvailability: LM_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LM_PIER,
    rationale:
      "Named pier fishery, management-plan support and broad seasonal port guidance justify a Good peak.",
  },
  {
    batch: 1,
    cityId: "grand_haven_mi",
    cityName: "Grand Haven",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 6.5,
    monthlyAvailability: LM_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LM_PIER,
    rationale:
      "Named pier and grouped Muskegon/Grand Haven seasonal guidance justify a Good peak, with no offshore-to-pier transfer.",
  },
  {
    batch: 1,
    cityId: "muskegon_mi",
    cityName: "Muskegon",
    decision: "provisional_admission",
    evidenceGrade: "C",
    fisheryStrength: 5.8,
    monthlyAvailability: LM_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LM_PIER,
    rationale:
      "DNR port guidance plus public channel/pier access supports a provisional Fair peak; direct lake-trout pier magnitude remains thin.",
  },
  {
    batch: 1,
    cityId: "whitehall_mi",
    cityName: "Whitehall",
    decision: "provisional_admission",
    evidenceGrade: "C",
    fisheryStrength: 5.7,
    monthlyAvailability: LM_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LM_PIER,
    rationale:
      "DNR groups Pentwater/Whitehall as a four-season lake-trout port; the exact covered structure remains a confidence constraint.",
  },
  {
    batch: 1,
    cityId: "pentwater_mi",
    cityName: "Pentwater",
    decision: "provisional_admission",
    evidenceGrade: "C",
    fisheryStrength: 5.8,
    monthlyAvailability: LM_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LM,
    rationale:
      "Four-season DNR port guidance supports admission, but no exact-pier catch series supports a Good label yet.",
  },
  {
    batch: 1,
    cityId: "ludington_mi",
    cityName: "Ludington",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 6.2,
    monthlyAvailability: LM_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LM_PIER,
    rationale:
      "Cold-season pier recurrence and DNR winter-through-summer guidance support a low-Good peak.",
  },
  {
    batch: 1,
    cityId: "manistee_mi",
    cityName: "Manistee",
    decision: "recalibrate",
    evidenceGrade: "A",
    fisheryStrength: 6.3,
    monthlyAvailability: LM_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LM_PIER,
    rationale:
      "Repeated exact pier/dock evidence supports a Good peak while offshore summer catch remains excluded.",
  },
  {
    batch: 1,
    cityId: "frankfort_elberta_mi",
    cityName: "Frankfort / Elberta",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 5.9,
    monthlyAvailability: CLOSED_OCT_DEC,
    closedMonths: [10, 11, 12],
    sourceIds: MI_LM_PIER,
    rationale:
      "A real winter-through-summer port fishery warrants a higher ceiling, but the October-December possession closure overrides fall biology.",
  },

  // Batch 2 — north and east Michigan
  {
    batch: 2,
    cityId: "charlevoix_mi",
    cityName: "Charlevoix",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 5.7,
    monthlyAvailability: CLOSED_OCT_DEC,
    closedMonths: [10, 11, 12],
    sourceIds: MI_LM,
    rationale:
      "DNR spring and September targeting supports Fair peak guidance; October-December is legally closed.",
  },
  {
    batch: 2,
    cityId: "rogers_city_mi",
    cityName: "Rogers City",
    decision: "recalibrate",
    evidenceGrade: "A",
    fisheryStrength: 6.8,
    monthlyAvailability: CLOSED_OCT_DEC,
    closedMonths: [10, 11, 12],
    sourceIds: MI_LH_PIER,
    rationale:
      "Agency reporting describes excellent May-June lake-trout fishing; the October-December closure remains absolute.",
  },
  {
    batch: 2,
    cityId: "alpena_mi",
    cityName: "Alpena",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 6.2,
    monthlyAvailability: CLOSED_OCT_DEC,
    closedMonths: [10, 11, 12],
    sourceIds: MI_LH_PIER,
    rationale:
      "DNR port guidance and current fishery evidence support a low-Good ceiling, subject to the fall closure.",
  },
  {
    batch: 2,
    cityId: "harrisville_mi",
    cityName: "Harrisville",
    decision: "provisional_admission",
    evidenceGrade: "C",
    fisheryStrength: 5.5,
    monthlyAvailability: LH_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LH,
    rationale:
      "DNR names lake trout in spring and summer; score remains provisional because covered-dock catch magnitude is unresolved.",
  },
  {
    batch: 2,
    cityId: "oscoda_mi",
    cityName: "Oscoda",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 5.4,
    monthlyAvailability: CLOSED_OCT_DEC,
    closedMonths: [10, 11, 12],
    sourceIds: MI_LH_PIER,
    rationale:
      "Exact pier reports establish recurring occurrence, but modest wording supports Fair rather than Good and the fall closure applies.",
  },
  {
    batch: 2,
    cityId: "tawas_city_mi",
    cityName: "Tawas City",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 5.4,
    monthlyAvailability: LH_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LH_PIER,
    rationale:
      "Existing port evidence supports a higher Fair ceiling with ice/access gating in winter.",
  },
  {
    batch: 2,
    cityId: "caseville_mi",
    cityName: "Caseville",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 6.8,
    monthlyAvailability: LH_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LH_PIER,
    rationale:
      "DNR identifies Caseville as a lake-trout Better Fishing Water; the prior score understated a strong shallow cold-season fishery.",
  },
  {
    batch: 2,
    cityId: "harbor_beach_mi",
    cityName: "Harbor Beach",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 7.2,
    monthlyAvailability: LH_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LH_PIER,
    rationale:
      "DNR identifies lake trout in spring, summer and fall and names Harbor Beach as a Better Fishing Water; November-December extension is a documented biological inference, not a creel measurement.",
  },
  {
    batch: 2,
    cityId: "port_sanilac_mi",
    cityName: "Port Sanilac",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 6.3,
    monthlyAvailability: LH_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LH_PIER,
    rationale:
      "Named Better Fishing Water and three-season DNR port guidance support a Good peak.",
  },
  {
    batch: 2,
    cityId: "lexington_mi",
    cityName: "Lexington",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 5.5,
    monthlyAvailability: LH_OPEN_YEAR,
    closedMonths: [],
    sourceIds: MI_LH_PIER,
    rationale:
      "Positive pier/dock years and summer port targeting support a higher Fair ceiling, not an offshore-derived Good score.",
  },

  // Batch 3 — Indiana, Illinois and Wisconsin
  {
    batch: 3,
    cityId: "michigan_city_in",
    cityName: "Michigan City",
    decision: "research_hold",
    evidenceGrade: "C",
    fisheryStrength: null,
    monthlyAvailability: null,
    closedMonths: [],
    sourceIds: ["IN_DNR_LAKE_MICHIGAN_SHORE_GUIDE"],
    rationale:
      "Indiana documents a regional shoreline run but still characterizes lake trout primarily as a boat fishery; East Pier recurrence is unresolved.",
  },
  {
    batch: 3,
    cityId: "chicago_il",
    cityName: "Chicago",
    decision: "recalibrate",
    evidenceGrade: "B",
    fisheryStrength: 5.8,
    monthlyAvailability: CHICAGO_OPEN_YEAR,
    closedMonths: [],
    sourceIds: ["IL_DNR_LAKE_MICHIGAN_FISHERY"],
    rationale:
      "Repeated specialist winter shore evidence supports a stronger Fair ceiling without treating Illinois offshore abundance as pier catch.",
  },
  {
    batch: 3,
    cityId: "waukegan_il",
    cityName: "Waukegan",
    decision: "research_hold",
    evidenceGrade: "C",
    fisheryStrength: null,
    monthlyAvailability: null,
    closedMonths: [],
    sourceIds: ["IL_DNR_LAKE_MICHIGAN_FISHERY"],
    rationale:
      "Offshore reef use and occasional regional shore reach do not establish a repeatable Government Pier fishery.",
  },
  {
    batch: 3,
    cityId: "kenosha_wi",
    cityName: "Kenosha",
    decision: "research_hold",
    evidenceGrade: "C",
    fisheryStrength: null,
    monthlyAvailability: null,
    closedMonths: [],
    sourceIds: WI,
    rationale:
      "County pier and shore lake-trout estimates were zero in 2022-2024; biological presence alone is insufficient for a numeric city-pier score.",
  },
  {
    batch: 3,
    cityId: "racine_wi",
    cityName: "Racine",
    decision: "provisional_admission",
    evidenceGrade: "C",
    fisheryStrength: 4.4,
    monthlyAvailability: WI_OPEN_YEAR,
    closedMonths: [],
    sourceIds: WI,
    rationale:
      "Recent county pier positives establish occurrence but low magnitude and a 2024 zero keep the ceiling low-Fair.",
  },
  {
    batch: 3,
    cityId: "milwaukee_wi",
    cityName: "Milwaukee",
    decision: "provisional_admission",
    evidenceGrade: "C",
    fisheryStrength: 4.3,
    monthlyAvailability: WI_OPEN_YEAR,
    closedMonths: [],
    sourceIds: WI,
    rationale:
      "A small 2024 pier/shore estimate supports cautious admission, not transfer of the much larger boat fishery.",
  },
  {
    batch: 3,
    cityId: "port_washington_wi",
    cityName: "Port Washington",
    decision: "provisional_admission",
    evidenceGrade: "C",
    fisheryStrength: 4.8,
    monthlyAvailability: WI_OPEN_YEAR,
    closedMonths: [],
    sourceIds: WI,
    rationale:
      "Recent county pier/shore positives support a Fair provisional fishery, with strong year-to-year variability.",
  },
  {
    batch: 3,
    cityId: "sheboygan_wi",
    cityName: "Sheboygan",
    decision: "provisional_admission",
    evidenceGrade: "C",
    fisheryStrength: 4.8,
    monthlyAvailability: WI_OPEN_YEAR,
    closedMonths: [],
    sourceIds: WI,
    rationale:
      "A meaningful 2022 pier estimate followed by zeros or near-zero years supports cautious Fair admission, not a Good rating.",
  },
  {
    batch: 3,
    cityId: "manitowoc_wi",
    cityName: "Manitowoc",
    decision: "research_hold",
    evidenceGrade: "C",
    fisheryStrength: null,
    monthlyAvailability: null,
    closedMonths: [],
    sourceIds: WI,
    rationale:
      "The county series pools Manitowoc and Two Rivers and reports no pier/shore lake-trout harvest in 2022-2024.",
  },
  {
    batch: 3,
    cityId: "two_rivers_wi",
    cityName: "Two Rivers",
    decision: "research_hold",
    evidenceGrade: "C",
    fisheryStrength: null,
    monthlyAvailability: null,
    closedMonths: [],
    sourceIds: WI,
    rationale:
      "Pooled county geography and 2022-2024 zeros cannot support a separate Two Rivers score.",
  },
  {
    batch: 3,
    cityId: "kewaunee_wi",
    cityName: "Kewaunee",
    decision: "retain",
    evidenceGrade: "B",
    fisheryStrength: 4.2,
    monthlyAvailability: WI_OPEN_YEAR,
    closedMonths: [],
    sourceIds: WI,
    rationale:
      "Historic exact harbor targeting supports the existing low-Fair ceiling; recent county zeros do not warrant an increase.",
  },
  {
    batch: 3,
    cityId: "algoma_wi",
    cityName: "Algoma",
    decision: "research_hold",
    evidenceGrade: "C",
    fisheryStrength: null,
    monthlyAvailability: null,
    closedMonths: [],
    sourceIds: WI,
    rationale:
      "Kewaunee County data pools Algoma with Kewaunee and recent pier/shore estimates are zero; separate magnitude is unresolved.",
  },
] as const satisfies readonly PierCastLakeTroutV5Calibration[];

export function getPierCastLakeTroutV5Candidate(cityId: string) {
  return PIER_CAST_LAKE_TROUT_V5_CANDIDATES.find((row) =>
    row.cityId === cityId
  ) ?? null;
}
