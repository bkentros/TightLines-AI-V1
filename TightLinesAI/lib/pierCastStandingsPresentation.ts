import type {
  PierCastConditionsCatalogCityV4,
  PierCastGreatLakeIdV4,
  PierCastLeaderboardCityReadV4,
  PierCastLeaderboardResponseV4,
  PierCastSeasonalBandV4,
  PierCastSeasonalOutlookReadV4,
  PierCastSeasonStageV4,
  PierCastSpeciesConditionsReadV4,
  PierCastTargetSpeciesOptionV4,
  PierCastThermalMatchReadV4,
} from "./pierCastConditionsV4";
import { fahrenheit } from "./pierCastConditionsPresentation";
import type { PierCastSpeciesId } from "./pierCastContracts";
import { dashboardBandColor, paper } from "./theme";

/**
 * Presentation rules for the PierCast Standings (leaderboard) screen.
 *
 * Everything the screen says is derived here from the v4 server fields so the
 * copy can never drift from the data:
 *
 * - The rating word (Prime / Good / Fair / Poor / Off-season) is presentation,
 *   while season timing and water-temperature fit remain separate context.
 * - The 1.17 candidate projection orders every species by exact hidden
 *   city/species/local-date opportunity before deriving display labels.
 */

/** Salmon and trout are the headline Great Lakes pier targets. */
export const PIER_CAST_SALMONID_ORDER: readonly PierCastSpeciesId[] = [
  "chinook_salmon",
  "coho_salmon",
  "steelhead",
  "brown_trout",
  "lake_trout",
  "atlantic_salmon",
];

export function isPierCastSalmonid(speciesId: PierCastSpeciesId): boolean {
  return PIER_CAST_SALMONID_ORDER.includes(speciesId);
}

export const PIER_CAST_STANDINGS_TOP_COUNT = 5;

export type StandingsBandStyle = {
  label: string;
  /** Saturated band color (bars, dots, edges). */
  color: string;
  /** Tinted chip background. */
  chip: string;
  /** Text color that passes contrast on `chip` and on white. */
  ink: string;
  /** 1 (Off-season) … 5 (Prime): how many meter segments are filled. */
  level: number;
};

export const PIER_CAST_STANDINGS_BANDS: Record<
  PierCastSeasonalBandV4,
  StandingsBandStyle
> = {
  excellent: {
    label: "Prime",
    color: paper.bandPrime,
    chip: dashboardBandColor.Prime.chipBg,
    ink: "#1F6B3A",
    level: 5,
  },
  good: {
    label: "Good",
    color: paper.bandGood,
    chip: dashboardBandColor.Good.chipBg,
    ink: "#2F6E3B",
    level: 4,
  },
  fair: {
    label: "Fair",
    color: paper.bandFair,
    chip: dashboardBandColor.Fair.chipBg,
    ink: "#7A5C00",
    level: 3,
  },
  poor: {
    label: "Poor",
    color: paper.bandPoor,
    chip: dashboardBandColor.Poor.chipBg,
    ink: "#9A4A12",
    level: 2,
  },
  usually_off: {
    label: "Off-season",
    color: paper.bandTough,
    chip: dashboardBandColor.Tough.chipBg,
    ink: "#A3291C",
    level: 1,
  },
};

/** Meter segment colors, Off-season → Prime. */
export const PIER_CAST_STANDINGS_METER = [
  paper.bandTough,
  paper.bandPoor,
  paper.bandFair,
  paper.bandGood,
  paper.bandPrime,
] as const;

export const PIER_CAST_STANDINGS_BAND_MEANINGS: ReadonlyArray<{
  band: PierCastSeasonalBandV4;
  meaning: string;
}> = [
  { band: "excellent", meaning: "Peak time for this fish here" },
  { band: "good", meaning: "Fish are around — worth the trip" },
  { band: "fair", meaning: "Workable, pick your window" },
  { band: "poor", meaning: "In season, but slow" },
  { band: "usually_off", meaning: "Usually not here this time of year" },
];

const BAND_RANK: Record<PierCastSeasonalBandV4, number> = {
  excellent: 5,
  good: 4,
  fair: 3,
  poor: 2,
  usually_off: 1,
};

export function standingsBandRank(band: PierCastSeasonalBandV4 | null): number {
  return band ? BAND_RANK[band] : 0;
}

const STAGE_LABELS: Record<PierCastSeasonStageV4, string> = {
  early: "Approaching peak",
  building: "Approaching peak",
  active: "In season",
  fading: "Past peak",
  late: "Past peak",
  off: "Off-season",
};

/** "Peak season" is reserved for an active stage that is also rated Prime. */
export function standingsStageLabel(
  stage: PierCastSeasonStageV4,
  band: PierCastSeasonalBandV4,
): string {
  return stage === "active" && band === "excellent"
    ? "Peak season"
    : STAGE_LABELS[stage];
}

/** Uses the explicit v5 timing state when present, then falls back to v4. */
export function standingsOutlookTimingLabel(
  outlook: PierCastSeasonalOutlookReadV4,
): string | null {
  if (outlook.status !== "available") return null;
  const timingCode = outlook.reasonCodes.find((code) =>
    code.startsWith("pier_cast_v5_timing:") ||
    code.startsWith("lake_trout_v5_timing:")
  );
  const timing = timingCode?.slice(timingCode.indexOf(":") + 1);
  if (timing === "peak") return "Peak season";
  if (timing === "approaching") return "Approaching peak";
  if (timing === "past") return "Past peak";
  if (timing === "off") return "Off season";
  if (timing === "in_season") return "In season";
  return standingsStageLabel(outlook.stage, outlook.band);
}

export type StandingsTrend = "building" | "steady" | "fading";

/** Only building / fading earn an arrow; steady is the quiet default. */
export function standingsTrendCue(
  trend: StandingsTrend | null,
): { icon: "arrow-up" | "arrow-down"; label: string; color: string } | null {
  if (trend === "building") {
    return { icon: "arrow-up", label: "Approaching peak", color: "#1F6B3A" };
  }
  if (trend === "fading") {
    return { icon: "arrow-down", label: "Past peak", color: "#9A4A12" };
  }
  return null;
}

/**
 * Plain-language water-temp phrase for a thermal match.
 *
 * Inside the optimum range → "right in range". Outside it, the wording follows
 * the server's thermal band so it always agrees with the ranking input:
 * excellent/good → "a touch", fair → "running", poor → "too".
 */
export function standingsWaterPhrase(
  thermal: PierCastThermalMatchReadV4,
): string | null {
  if (thermal.status !== "available") return null;
  if (thermal.distanceFromOptimumC <= 0.05) return "right in range";
  const direction = thermal.temperatureC < thermal.optimumRangeC[0]
    ? "cool"
    : "warm";
  if (thermal.band === "excellent" || thermal.band === "good") {
    return `a touch ${direction}`;
  }
  if (thermal.band === "fair") return `running ${direction}`;
  return `too ${direction}`;
}

export function standingsWaterTempF(
  thermal: PierCastThermalMatchReadV4,
): number | null {
  return thermal.status === "available"
    ? Math.round(fahrenheit(thermal.temperatureC))
    : null;
}

/** "Water 55°F · right in range" (or null when the match is unavailable). */
export function standingsWaterLine(
  thermal: PierCastThermalMatchReadV4,
): string | null {
  const phrase = standingsWaterPhrase(thermal);
  const temperatureF = standingsWaterTempF(thermal);
  return phrase && temperatureF !== null
    ? `Water ${temperatureF}°F · ${phrase}`
    : null;
}

/** Leader-card sentence built only from the row's own fields. */
export function standingsLeaderSummary(
  row: PierCastLeaderboardCityReadV4,
  speciesShortName: string,
): string {
  const parts: string[] = [];
  const outlook = row.seasonalOutlook;
  if (outlook.status === "available") {
    let sentence = `${standingsOutlookTimingLabel(outlook)} for ${speciesShortName} here`;
    const trendAlreadyStated = outlook.stage === "building" ||
      outlook.stage === "fading" || outlook.stage === "off";
    if (!trendAlreadyStated && outlook.trend === "building") {
      sentence += ", and still building";
    } else if (!trendAlreadyStated && outlook.trend === "fading") {
      sentence += ", and starting to fade";
    }
    parts.push(`${sentence}.`);
  }
  const phrase = standingsWaterPhrase(row.thermalMatch);
  const temperatureF = standingsWaterTempF(row.thermalMatch);
  if (phrase && temperatureF !== null) {
    parts.push(`Water is ${temperatureF}°F — ${phrase}.`);
  }
  return parts.join(" ");
}

/** Why a city is not in today's ranking, in plain words. */
export function standingsUnrankedReason(
  row: PierCastSpeciesConditionsReadV4,
): string {
  if (row.targetingEligibility === "restricted") return "Closed to targeting here";
  const codes = new Set<string>([
    ...row.reasonCodes,
    ...row.seasonalOutlook.reasonCodes,
    ...row.thermalMatch.reasonCodes,
  ]);
  if (codes.has("lake_trout_research_hold")) {
    return "Local pier evidence still under review";
  }
  if (row.targetingEligibility === "unknown" || codes.has("targeting_unknown")) {
    return "Targeting rules unconfirmed";
  }
  if (
    codes.has("temperature_stale") || codes.has("temperature_missing") ||
    codes.has("temperature_partial_horizon") || codes.has("source_unavailable")
  ) {
    return "Water temp updating";
  }
  if (codes.has("temperature_out_of_domain")) {
    return "Water temp outside model range";
  }
  if (codes.has("seasonal_profile_missing") || codes.has("seasonal_profile_invalid")) {
    return "Season data unavailable";
  }
  if (codes.has("temperature_curve_missing") || codes.has("temperature_curve_invalid")) {
    return "Temp profile unavailable";
  }
  return "Not enough data today";
}

export type PierCastLakeFilter = "all" | PierCastGreatLakeIdV4;

export const PIER_CAST_LAKE_ORDER: readonly PierCastGreatLakeIdV4[] = [
  "michigan",
  "huron",
  "superior",
  "erie",
  "ontario",
];

export function pierCastLakeName(lakeId: PierCastGreatLakeIdV4): string {
  return lakeId.charAt(0).toUpperCase() + lakeId.slice(1);
}

export function parsePierCastLakeFilter(value: unknown): PierCastLakeFilter {
  return value === "all" ||
      PIER_CAST_LAKE_ORDER.includes(value as PierCastGreatLakeIdV4)
    ? value as PierCastLakeFilter
    : "all";
}

/**
 * First-visit species: the salmon/trout whose #1 city is best today
 * (seasonal band, then thermal suitability, then the fixed salmonid order).
 * Oddball species never win this pick. Returns null when no salmonid board
 * has a ranked city.
 */
export function pickDefaultStandingsSpecies(
  boards: readonly PierCastLeaderboardResponseV4[],
): PierCastSpeciesId | null {
  let best:
    | { speciesId: PierCastSpeciesId; band: number; thermal: number; order: number }
    | null = null;
  for (const board of boards) {
    const speciesId = board.selectedSpeciesId;
    if (!speciesId || !isPierCastSalmonid(speciesId)) continue;
    const leader = board.cities.find((row) =>
      row.rankingDisposition === "ranked" &&
      row.seasonalOutlook.status === "available" &&
      row.thermalMatch.status === "available"
    );
    if (
      !leader || leader.seasonalOutlook.status !== "available" ||
      leader.thermalMatch.status !== "available"
    ) continue;
    const candidate = {
      speciesId,
      band: BAND_RANK[leader.seasonalOutlook.band],
      thermal: leader.thermalMatch.value,
      order: PIER_CAST_SALMONID_ORDER.indexOf(speciesId),
    };
    if (
      !best ||
      candidate.band > best.band ||
      (candidate.band === best.band && candidate.thermal > best.thermal) ||
      (candidate.band === best.band && candidate.thermal === best.thermal &&
        candidate.order < best.order)
    ) {
      best = candidate;
    }
  }
  return best?.speciesId ?? null;
}

/** Fallback when no salmonid is rated: best in-season species by band. */
export function pickFallbackStandingsSpecies(
  options: readonly PierCastTargetSpeciesOptionV4[],
): PierCastSpeciesId | null {
  const ranked = options
    .filter((option) => option.bestSeasonalBand !== null)
    .sort((left, right) =>
      standingsBandRank(right.bestSeasonalBand) -
        standingsBandRank(left.bestSeasonalBand) ||
      right.availableCityCount - left.availableCityCount
    );
  return ranked[0]?.speciesId ?? null;
}

/**
 * Species a Find-your-PierCast city opens on: the current target when the
 * city has it, else its first salmon/trout, else its first species.
 */
export function finderReportSpecies(
  city: PierCastConditionsCatalogCityV4,
  currentSpeciesId: PierCastSpeciesId | null,
): PierCastSpeciesId | null {
  const supported = Array.isArray(city.supportedSpeciesIds)
    ? city.supportedSpeciesIds
    : [];
  if (currentSpeciesId && supported.includes(currentSpeciesId)) {
    return currentSpeciesId;
  }
  return PIER_CAST_SALMONID_ORDER.find((speciesId) =>
    supported.includes(speciesId)
  ) ?? supported[0] ?? null;
}

/** Remember each city's lake from any leaderboard we have seen. */
export function mergePierCastCityLakes(
  current: Readonly<Record<string, PierCastGreatLakeIdV4>>,
  boards: readonly PierCastLeaderboardResponseV4[],
): Record<string, PierCastGreatLakeIdV4> {
  let changed = false;
  const next: Record<string, PierCastGreatLakeIdV4> = { ...current };
  for (const board of boards) {
    for (const row of board.cities) {
      if (next[row.cityId] !== row.lakeId) {
        next[row.cityId] = row.lakeId;
        changed = true;
      }
    }
  }
  return changed ? next : current as Record<string, PierCastGreatLakeIdV4>;
}

/** Outlook date as "Tue, Sep 29" (the date the ratings describe). */
export function standingsForecastDate(
  leaderboard: PierCastLeaderboardResponseV4,
): string {
  const localDate = leaderboard.cities.find((row) =>
    typeof row.seasonalOutlook.localDate === "string"
  )?.seasonalOutlook.localDate;
  const date = localDate && /^\d{4}-\d{2}-\d{2}$/.test(localDate)
    ? new Date(`${localDate}T12:00:00Z`)
    : new Date(leaderboard.generatedAt);
  if (!Number.isFinite(date.getTime())) return "Today";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: localDate ? "UTC" : "America/Detroit",
  }).format(date);
}
