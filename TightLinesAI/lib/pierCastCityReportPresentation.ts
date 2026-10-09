import { detectPierCastTemperatureEvents } from "../supabase/functions/_shared/pierCastEngine/scoring/temperatureEvents";
import {
  comparePierCastSpeciesConditionsV4,
  type PierCastCityDailyOutlookV4,
  type PierCastCityReportReadV4,
  type PierCastModeledTemperaturePointV4,
  type PierCastSeasonalBandV4,
  type PierCastSpeciesConditionsReadV4,
} from "./pierCastConditionsV4";
import { fahrenheit, PIER_CAST_SPECIES_LABELS } from "./pierCastConditionsPresentation";
import type { PierCastSpeciesId } from "./pierCastContracts";
import {
  isPierCastCalendarSpecies,
  isPrimaryPierCastSpecies,
} from "./pierCastSpeciesPresentation";
import {
  evaluatePierCastOpportunityV5,
  PIER_CAST_OPPORTUNITY_V5_CANDIDATE_VERSION,
  pierCastTemperatureSuitabilityV5,
} from "./pierCastOpportunityV5";
import {
  orderPierCastTemperatureEvents,
  pierCastTemperatureEventTimingLabel,
} from "./pierCastTemperatureEventPresentation";
import {
  standingsStageLabel,
  standingsOutlookTimingLabel,
  standingsUnrankedReason,
  standingsWaterPhrase,
} from "./pierCastStandingsPresentation";
import type { PierCastHourlyWeatherPoint } from "./pierCastWeather";

/**
 * Presentation rules for the city-first PierCast report.
 *
 * The report describes one city, not one species. Every word and number on it
 * is derived here from server fields so copy cannot drift from data:
 *
 * - Main targets are salmon, trout, steelhead and freshwater drum. They appear
 *   before the remaining species. Today's label, season timing and water fit
 *   remain visually distinct, and internal scores are never shown.
 * - The five-day calendar shows each day's best species and its seasonal band
 *   from the server's `dailyOutlook`. Older servers and saved copies without it
 *   still get the days, water ranges and air temps, plus today's best species.
 * - Water-temp shifts come from the shared temperature-event detector, run on
 *   the report's own modeled timeline.
 */

export const PIER_CAST_CITY_CALENDAR_DAYS = 5;
const HOUR_MS = 3_600_000;
const MATCH_TOLERANCE_MS = 90 * 60_000;

export function pierCastSpeciesName(speciesId: PierCastSpeciesId): string {
  return PIER_CAST_SPECIES_LABELS[speciesId] ?? speciesId;
}

/**
 * Keeps an explicitly requested city species when available. Otherwise the
 * city's current best bet is the truthful default, with the server-selected
 * species and first available species as compatibility fallbacks.
 */
export function pierCastReportSpeciesOrBest(
  report: Pick<
    PierCastCityReportReadV4,
    "dailyOutlook" | "selectedSpeciesId" | "species"
  >,
  requestedSpeciesId: PierCastSpeciesId,
): PierCastSpeciesId | null {
  const available = new Set(report.species.map((species) => species.speciesId));
  if (available.has(requestedSpeciesId)) return requestedSpeciesId;
  const best = report.dailyOutlook?.[0]?.best?.speciesId;
  if (best && available.has(best)) return best;
  if (available.has(report.selectedSpeciesId)) return report.selectedSpeciesId;
  return report.species[0]?.speciesId ?? null;
}

// ─── Local time ───────────────────────────────────────────────────────────

export type PierCastLocalParts = {
  /** YYYY-MM-DD in the city's timezone. */
  localDate: string;
  /** "Tue" */
  weekday: string;
  dayOfMonth: number;
  hour: number;
  minute: number;
};

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function localFormatter(timezone: string): Intl.DateTimeFormat {
  let formatter = formatterCache.get(timezone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hourCycle: "h23",
    });
    formatterCache.set(timezone, formatter);
  }
  return formatter;
}

export function pierCastLocalParts(
  instant: string | number | Date,
  timezone: string,
): PierCastLocalParts | null {
  const time = instant instanceof Date
    ? instant.getTime()
    : typeof instant === "number"
    ? instant
    : Date.parse(instant);
  if (!Number.isFinite(time)) return null;
  try {
    const parts = localFormatter(timezone).formatToParts(new Date(time));
    const read = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value ?? "";
    const year = read("year");
    const month = read("month");
    const day = read("day");
    const hour = Number(read("hour")) % 24;
    const minute = Number(read("minute"));
    if (!year || !month || !day || !Number.isFinite(hour)) return null;
    return {
      localDate: `${year}-${month}-${day}`,
      weekday: read("weekday"),
      dayOfMonth: Number(day),
      hour,
      minute: Number.isFinite(minute) ? minute : 0,
    };
  } catch {
    return null;
  }
}

/** "4 PM" */
export function pierCastHourLabel(hour: number): string {
  const normalized = ((hour % 24) + 24) % 24;
  const display = normalized % 12 === 0 ? 12 : normalized % 12;
  return `${display} ${normalized < 12 ? "AM" : "PM"}`;
}

function weekdayFromLocalDate(localDate: string): string {
  const date = new Date(`${localDate}T12:00:00Z`);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" })
      .format(date)
    : "";
}

// ─── Species ──────────────────────────────────────────────────────────────

/** City species in leaderboard order; name breaks exact ties. */
export function rankPierCastCitySpecies(
  species: readonly PierCastSpeciesConditionsReadV4[],
): PierCastSpeciesConditionsReadV4[] {
  return [...species].sort((left, right) =>
    comparePierCastSpeciesConditionsV4(left, right) ||
    pierCastSpeciesName(left.speciesId).localeCompare(
      pierCastSpeciesName(right.speciesId),
    )
  );
}

export type PierCastWaterFit = {
  temperatureF: number;
  idealLowF: number;
  idealHighF: number;
  /** Flex weights for the cool / ideal / warm segments of the fit bar. */
  coolWeight: number;
  idealWeight: number;
  warmWeight: number;
  /** 0–1 position of today's water on the bar (clamped to stay visible). */
  pin: number;
};

/** Degrees F of cool and warm context shown either side of the ideal range. */
const FIT_CONTEXT_F = 8;

export function pierCastWaterFit(
  species: PierCastSpeciesConditionsReadV4,
): PierCastWaterFit | null {
  const thermal = species.thermalMatch;
  if (thermal.status !== "available") return null;
  const idealLowF = fahrenheit(thermal.optimumRangeC[0]);
  const idealHighF = fahrenheit(thermal.optimumRangeC[1]);
  const temperatureF = fahrenheit(thermal.temperatureC);
  const lowF = idealLowF - FIT_CONTEXT_F;
  const highF = idealHighF + FIT_CONTEXT_F;
  const span = highF - lowF;
  return {
    temperatureF,
    idealLowF,
    idealHighF,
    coolWeight: FIT_CONTEXT_F,
    idealWeight: Math.max(0.5, idealHighF - idealLowF),
    warmWeight: FIT_CONTEXT_F,
    pin: span > 0
      ? Math.min(0.97, Math.max(0.03, (temperatureF - lowF) / span))
      : 0.5,
  };
}

export type PierCastCitySpeciesCard = {
  speciesId: PierCastSpeciesId;
  name: string;
  /** "01" */
  rankLabel: string;
  ranked: boolean;
  band: PierCastSeasonalBandV4 | null;
  trend: "building" | "steady" | "fading" | null;
  /** "Peak season", "Approaching peak" … or the not-rated reason. */
  seasonLine: string;
  /** "A touch warm" / "Right in range" or null when unavailable. */
  waterLine: string | null;
  /** "50–56°F" */
  idealLine: string | null;
  fit: PierCastWaterFit | null;
  standing: { rank: number; rankedCityCount: number } | null;
};

function capitalize(value: string): string {
  return value ? value[0]!.toUpperCase() + value.slice(1) : value;
}

export function buildPierCastCitySpeciesCards(
  report: Pick<PierCastCityReportReadV4, "species" | "speciesStandings">,
): PierCastCitySpeciesCard[] {
  const standings = new Map(
    (Array.isArray(report.speciesStandings) ? report.speciesStandings : [])
      .filter((entry) =>
        entry && typeof entry.speciesId === "string" &&
        typeof entry.rankedCityCount === "number"
      )
      .map((entry) => [entry.speciesId, entry]),
  );
  const v5Ordered = report.species.some((species) =>
    species.seasonalOutlook.status === "available" &&
    species.seasonalOutlook.profileId === PIER_CAST_OPPORTUNITY_V5_CANDIDATE_VERSION
  );
  const orderedSpecies = v5Ordered
    ? [...report.species]
    : rankPierCastCitySpecies(report.species);
  return orderedSpecies.map((species, index) => {
    const outlook = species.seasonalOutlook;
    const ranked = species.rankingDisposition === "ranked";
    const fit = pierCastWaterFit(species);
    const phrase = standingsWaterPhrase(species.thermalMatch);
    const standing = standings.get(species.speciesId);
    return {
      speciesId: species.speciesId,
      name: pierCastSpeciesName(species.speciesId),
      rankLabel: String(index + 1).padStart(2, "0"),
      ranked,
      band: outlook.status === "available" ? outlook.band : null,
      trend: outlook.status === "available" ? outlook.trend : null,
      seasonLine: ranked && outlook.status === "available"
        ? standingsOutlookTimingLabel(outlook) ??
          standingsStageLabel(outlook.stage, outlook.band)
        : standingsUnrankedReason(species),
      waterLine: phrase ? capitalize(phrase) : null,
      idealLine: fit
        ? `${Math.round(fit.idealLowF)}–${Math.round(fit.idealHighF)}°F`
        : null,
      fit,
      standing: ranked && standing && typeof standing.rank === "number"
        ? { rank: standing.rank, rankedCityCount: standing.rankedCityCount }
        : null,
    };
  });
}

export function splitPierCastCitySpeciesCards(
  cards: readonly PierCastCitySpeciesCard[],
): {
  mainTargets: PierCastCitySpeciesCard[];
  otherSpecies: PierCastCitySpeciesCard[];
} {
  const mainTargets = cards.filter((card) =>
    isPrimaryPierCastSpecies(card.speciesId)
  );
  const otherSpecies = cards.filter((card) =>
    !isPrimaryPierCastSpecies(card.speciesId)
  );
  const ordered = [...mainTargets, ...otherSpecies].map((card, index) => ({
    ...card,
    rankLabel: String(index + 1).padStart(2, "0"),
  }));
  return {
    mainTargets: ordered.slice(0, mainTargets.length),
    otherSpecies: ordered.slice(mainTargets.length),
  };
}

export type PierCastCityTopPick = {
  speciesId: PierCastSpeciesId;
  name: string;
  band: PierCastSeasonalBandV4;
  /** "Peak season · water a touch warm" */
  line: string;
};

export function pierCastCityTopPick(
  species: readonly PierCastSpeciesConditionsReadV4[],
  cityId?: string,
): PierCastCityTopPick | null {
  const calendarSpecies = species.filter((row) =>
    isPierCastCalendarSpecies(row.speciesId)
  );
  const leader = cityId
    ? calendarSpecies.map((row) => ({
      row,
      score: evaluatePierCastOpportunityV5({
        cityId,
        speciesId: row.speciesId,
        localDate: row.seasonalOutlook.localDate,
        thermalValue: row.thermalMatch.status === "available"
          ? row.thermalMatch.value
          : null,
      })?.score ?? null,
    })).filter((entry) =>
      entry.row.rankingDisposition === "ranked" && entry.score !== null
    ).sort((left, right) =>
      right.score! - left.score! ||
      left.row.speciesId.localeCompare(right.row.speciesId)
    )[0]?.row
    : rankPierCastCitySpecies(calendarSpecies)[0];
  if (
    !leader || leader.rankingDisposition !== "ranked" ||
    leader.seasonalOutlook.status !== "available"
  ) return null;
  const phrase = standingsWaterPhrase(leader.thermalMatch);
  const stage = standingsOutlookTimingLabel(leader.seasonalOutlook) ??
    standingsStageLabel(
      leader.seasonalOutlook.stage,
      leader.seasonalOutlook.band,
    );
  return {
    speciesId: leader.speciesId,
    name: pierCastSpeciesName(leader.speciesId),
    band: leader.seasonalOutlook.band,
    line: phrase ? `${stage} · water ${phrase}` : stage,
  };
}

/** Calendar-eligible salmonids rated Prime today (ranked rows only). */
export function pierCastCityPrimeCount(
  species: readonly PierCastSpeciesConditionsReadV4[],
): number {
  return species.filter((row) =>
    isPierCastCalendarSpecies(row.speciesId) &&
    row.rankingDisposition === "ranked" &&
    row.seasonalOutlook.status === "available" &&
    row.seasonalOutlook.band === "excellent"
  ).length;
}

// ─── Timeline days ────────────────────────────────────────────────────────

export type PierCastTimelinePoint = {
  validAt: string;
  time: number;
  temperatureF: number;
  local: PierCastLocalParts;
};

export function pierCastTimelinePoints(
  timeline: readonly PierCastModeledTemperaturePointV4[],
  timezone: string,
): PierCastTimelinePoint[] {
  const points: PierCastTimelinePoint[] = [];
  for (const point of timeline) {
    const time = Date.parse(point.validAt);
    if (!Number.isFinite(time) || !Number.isFinite(point.temperatureC)) continue;
    const local = pierCastLocalParts(time, timezone);
    if (!local) continue;
    points.push({
      validAt: point.validAt,
      time,
      temperatureF: fahrenheit(point.temperatureC),
      local,
    });
  }
  return points.sort((left, right) => left.time - right.time);
}

export type PierCastTimelineDay = {
  localDate: string;
  weekday: string;
  dayOfMonth: number;
  startIndex: number;
  endIndex: number;
  lowF: number;
  highF: number;
};

export function groupPierCastTimelineDays(
  points: readonly PierCastTimelinePoint[],
): PierCastTimelineDay[] {
  const days: PierCastTimelineDay[] = [];
  points.forEach((point, index) => {
    const current = days[days.length - 1];
    if (current && current.localDate === point.local.localDate) {
      current.endIndex = index;
      current.lowF = Math.min(current.lowF, point.temperatureF);
      current.highF = Math.max(current.highF, point.temperatureF);
      return;
    }
    days.push({
      localDate: point.local.localDate,
      weekday: point.local.weekday,
      dayOfMonth: point.local.dayOfMonth,
      startIndex: index,
      endIndex: index,
      lowF: point.temperatureF,
      highF: point.temperatureF,
    });
  });
  return days;
}

/** "53–58°" */
export function pierCastRangeLabel(lowF: number, highF: number): string {
  const low = Math.floor(lowF);
  const high = Math.ceil(highF);
  return low === high ? `${low}°` : `${low}–${high}°`;
}

// ─── Five-day calendar ────────────────────────────────────────────────────

export type PierCastCalendarDay = {
  localDate: string;
  /** "TODAY" or "WED" */
  label: string;
  /** "Wed" (for accessibility and notes) */
  weekday: string;
  dayOfMonth: number;
  isToday: boolean;
  best: { speciesId: PierCastSpeciesId; band: PierCastSeasonalBandV4 } | null;
  /** True when the day has no forecast species (older server / saved copy). */
  bestUnavailable: boolean;
  waterRange: string | null;
  airHighF: number | null;
  airLowF: number | null;
};

function validDailyOutlook(
  value: unknown,
): PierCastCityDailyOutlookV4[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const valid = value.filter((entry): entry is PierCastCityDailyOutlookV4 =>
    !!entry && typeof entry === "object" &&
    typeof (entry as PierCastCityDailyOutlookV4).localDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test((entry as PierCastCityDailyOutlookV4).localDate)
  );
  return valid.length > 0 ? valid : null;
}

export function buildPierCastCityCalendar(input: {
  report: PierCastCityReportReadV4;
  weather: readonly PierCastHourlyWeatherPoint[];
  now?: number;
}): PierCastCalendarDay[] {
  const { report } = input;
  const now = input.now ?? Date.now();
  const today = pierCastLocalParts(now, report.timezone)?.localDate ?? null;
  const days = groupPierCastTimelineDays(
    pierCastTimelinePoints(report.temperatureTimeline, report.timezone),
  );
  const daily = validDailyOutlook(report.dailyOutlook);
  const dailyByDate = new Map(daily?.map((entry) => [entry.localDate, entry]));

  let dates = daily
    ? daily.map((entry) => entry.localDate)
    : days.map((day) => day.localDate);
  if (dates.length === 0) {
    dates = [
      ...new Set(
        input.weather.map((point) => point.localTime.slice(0, 10)).filter(
          (date) => /^\d{4}-\d{2}-\d{2}$/.test(date),
        ),
      ),
    ].sort();
  }
  if (today) dates = dates.filter((date) => date >= today);
  dates = dates.slice(0, PIER_CAST_CITY_CALENDAR_DAYS);

  const topToday = pierCastCityTopPick(report.species, report.cityId);
  return dates.map((localDate) => {
    const timelineDay = days.find((day) => day.localDate === localDate);
    const entry = dailyByDate.get(localDate);
    const isToday = localDate === today;
    const airPoints = input.weather.filter((point) =>
      point.localTime.startsWith(localDate) && point.airTemperatureF !== null
    );
    const air = airPoints.map((point) => point.airTemperatureF as number);
    const weekday = timelineDay?.weekday ?? weekdayFromLocalDate(localDate);
    let best: PierCastCalendarDay["best"] = null;
    if (isToday) {
      best = topToday
        ? { speciesId: topToday.speciesId, band: topToday.band }
        : null;
    } else if (entry) {
      const candidates = report.species.flatMap((species) => {
        if (
          !isPierCastCalendarSpecies(species.speciesId) ||
          species.targetingEligibility !== "eligible"
        ) return [];
        const thermalValue = pierCastTemperatureSuitabilityV5(
          species.speciesId,
          entry.representativeTemperatureC,
        );
        const evaluation = evaluatePierCastOpportunityV5({
          cityId: report.cityId,
          speciesId: species.speciesId,
          localDate,
          thermalValue,
        });
        return evaluation?.score !== null && evaluation?.band
          ? [{ speciesId: species.speciesId, evaluation }]
          : [];
      }).sort((left, right) =>
        right.evaluation.score! - left.evaluation.score! ||
        left.speciesId.localeCompare(right.speciesId)
      );
      const leader = candidates[0];
      best = leader
        ? { speciesId: leader.speciesId, band: leader.evaluation.band! }
        : null;
    }
    const range = entry && Array.isArray(entry.temperatureRangeC)
      ? pierCastRangeLabel(
        fahrenheit(entry.temperatureRangeC[0]),
        fahrenheit(entry.temperatureRangeC[1]),
      )
      : timelineDay
      ? pierCastRangeLabel(timelineDay.lowF, timelineDay.highF)
      : null;
    return {
      localDate,
      label: isToday ? "TODAY" : weekday.toUpperCase(),
      weekday,
      dayOfMonth: Number(localDate.slice(8, 10)),
      isToday,
      best,
      bestUnavailable: best === null,
      waterRange: range,
      airHighF: air.length ? Math.round(Math.max(...air)) : null,
      airLowF: air.length ? Math.round(Math.min(...air)) : null,
    };
  });
}

// ─── Hourly strip ─────────────────────────────────────────────────────────

export type PierCastHourSlot = {
  key: string;
  /** "NOW" or "6 PM" */
  label: string;
  isNow: boolean;
  localDate: string;
  localHour: number;
  waterF: number | null;
  airF: number | null;
  windMph: number | null;
  /** "NW" — where the wind comes from. */
  windFrom: string | null;
  /** Degrees to rotate an up-pointing arrow so it shows where wind blows to. */
  windArrowDegrees: number | null;
};

const COMPASS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
] as const;

export function pierCastCompass(degrees: number | null): string | null {
  if (degrees === null || !Number.isFinite(degrees)) return null;
  const normalized = ((degrees % 360) + 360) % 360;
  return COMPASS[Math.round(normalized / 22.5) % 16]!;
}

function weatherKey(localDate: string, hour: number): string {
  return `${localDate}T${String(hour).padStart(2, "0")}`;
}

/** Weather reading closest to now, or null. */
export function pierCastCurrentWeather(
  weather: readonly PierCastHourlyWeatherPoint[],
  timezone: string,
  now = Date.now(),
): PierCastHourlyWeatherPoint | null {
  const local = pierCastLocalParts(now, timezone);
  if (!local) return null;
  const hour = local.minute >= 30 ? local.hour + 1 : local.hour;
  const key = hour >= 24
    ? null
    : weatherKey(local.localDate, hour);
  return (key && weather.find((point) => point.localTime.startsWith(key))) ||
    weather.find((point) =>
      point.localTime.startsWith(weatherKey(local.localDate, local.hour))
    ) || null;
}

export function buildPierCastHourlyStrip(input: {
  report: Pick<
    PierCastCityReportReadV4,
    "temperatureTimeline" | "timezone" | "currentTemperature"
  >;
  weather: readonly PierCastHourlyWeatherPoint[];
  now?: number;
}): PierCastHourSlot[] {
  const now = input.now ?? Date.now();
  const timezone = input.report.timezone;
  const points = pierCastTimelinePoints(
    input.report.temperatureTimeline,
    timezone,
  ).filter((point) => point.time >= now - MATCH_TOLERANCE_MS)
    .slice(0, 120);
  const weatherAt = new Map<string, PierCastHourlyWeatherPoint>();
  for (const point of input.weather) {
    weatherAt.set(point.localTime.slice(0, 13), point);
  }

  return points.map((point, index) => {
    const isNow = index === 0 && point.time <= now + MATCH_TOLERANCE_MS;
    const key = weatherKey(point.local.localDate, point.local.hour);
    const reading = weatherAt.get(key);
    const direction = reading?.windDirectionDegrees ?? null;
    const currentWater = input.report.currentTemperature;
    return {
      key: point.validAt,
      label: isNow ? "NOW" : pierCastHourLabel(point.local.hour),
      isNow,
      localDate: point.local.localDate,
      localHour: point.local.hour,
      waterF: isNow && currentWater && Number.isFinite(currentWater.temperatureC)
        ? fahrenheit(currentWater.temperatureC)
        : point.temperatureF,
      airF: reading?.airTemperatureF ?? null,
      windMph: reading?.windSpeedMph ?? null,
      windFrom: pierCastCompass(direction),
      windArrowDegrees: direction === null ? null : (direction + 180) % 360,
    };
  });
}

// ─── Temperature snapshots ────────────────────────────────────────────────

export function pierCastTemperatureAt(
  points: readonly PierCastTimelinePoint[],
  time: number,
): number | null {
  let best: PierCastTimelinePoint | null = null;
  for (const point of points) {
    if (!best || Math.abs(point.time - time) < Math.abs(best.time - time)) {
      best = point;
    }
  }
  return best && Math.abs(best.time - time) <= MATCH_TOLERANCE_MS
    ? best.temperatureF
    : null;
}

/** "-4.3° vs now" */
export function pierCastDeltaLabel(valueF: number, nowF: number): string {
  const delta = Math.round((valueF - nowF) * 10) / 10;
  if (delta === 0) return "Same as now";
  return `${delta > 0 ? "+" : "−"}${Math.abs(delta).toFixed(1)}° vs now`;
}

// ─── Water-temp shifts ────────────────────────────────────────────────────

export type PierCastShiftCard = {
  id: string;
  direction: "cooling" | "warming";
  severity: "minor" | "notable" | "major" | "extreme";
  startAt: string;
  endAt: string;
  /** "HAPPENING NOW", "STARTS TOMORROW" … */
  status: string;
  /** "Drop of 8.5°F" */
  title: string;
  /** "61.8° → 53.3°F over 27 hrs" */
  change: string;
  /** "now to Wed 7 PM" */
  window: string;
  /** Position of the shift across the forecast, 0–1. */
  barStart: number;
  barWidth: number;
};

function shortWhen(
  instant: string,
  timezone: string,
  now: number,
  todayDate: string | null,
): string {
  const time = Date.parse(instant);
  if (Number.isFinite(time) && Math.abs(time - now) <= MATCH_TOLERANCE_MS) {
    return "now";
  }
  const local = pierCastLocalParts(instant, timezone);
  if (!local) return "";
  const day = local.localDate === todayDate ? "today" : local.weekday;
  return `${day} ${pierCastHourLabel(local.hour)}`;
}

function statusLabel(timing: string): string {
  return timing === "IN PROGRESS" ? "HAPPENING NOW" : timing;
}

export function buildPierCastShiftCards(input: {
  timeline: readonly PierCastModeledTemperaturePointV4[];
  timezone: string;
  now?: number;
}): PierCastShiftCard[] {
  const now = input.now ?? Date.now();
  const clean = input.timeline.filter((point) =>
    Number.isFinite(Date.parse(point.validAt)) &&
    Number.isFinite(point.temperatureC)
  );
  if (clean.length < 2) return [];
  const summary = detectPierCastTemperatureEvents(
    clean.map((point) => ({
      validAt: point.validAt,
      temperatureC: point.temperatureC,
    })),
  );
  const times = clean.map((point) => Date.parse(point.validAt));
  const start = Math.min(...times);
  const end = Math.max(...times);
  const span = Math.max(HOUR_MS, end - start);
  const todayDate = pierCastLocalParts(now, input.timezone)?.localDate ?? null;
  return orderPierCastTemperatureEvents(summary, now)
    .filter((event) => Date.parse(event.endAt) > now - HOUR_MS)
    .map((event) => {
      const cooling = event.direction === "cooling";
      const magnitudeF = Math.abs(event.changeC) * 9 / 5;
      const startF = fahrenheit(event.startTemperatureC);
      const endF = fahrenheit(event.endTemperatureC);
      const hours = Math.max(1, Math.round(event.durationHours));
      const eventStart = Math.max(start, Date.parse(event.startAt));
      const eventEnd = Math.min(end, Date.parse(event.endAt));
      return {
        id: event.eventId,
        direction: event.direction,
        severity: event.severity,
        startAt: event.startAt,
        endAt: event.endAt,
        status: statusLabel(
          pierCastTemperatureEventTimingLabel(event, now, input.timezone),
        ),
        title: `${cooling ? "Drop" : "Rise"} of ${magnitudeF.toFixed(1)}°F`,
        change: `${startF.toFixed(1)}° → ${endF.toFixed(1)}°F over ${hours} ${hours === 1 ? "hr" : "hrs"}`,
        window: `${shortWhen(event.startAt, input.timezone, now, todayDate)} to ${shortWhen(event.endAt, input.timezone, now, todayDate)}`,
        barStart: Math.min(1, Math.max(0, (eventStart - start) / span)),
        barWidth: Math.min(1, Math.max(0.02, (eventEnd - eventStart) / span)),
      };
    });
}

// ─── Chart geometry ───────────────────────────────────────────────────────

export type PierCastChartLayout = {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type PierCastChartModel = {
  layout: PierCastChartLayout;
  points: Array<PierCastTimelinePoint & { x: number; y: number }>;
  lowF: number;
  highF: number;
  yTicks: Array<{ y: number; label: string }>;
  /** x positions of midnight boundaries between local days. */
  boundaries: number[];
  days: Array<{
    localDate: string;
    label: string;
    range: string | null;
    x: number;
    /** "end": a partial first day, labelled flush against its right edge. */
    align: "center" | "end";
    visible: boolean;
  }>;
  shifts: Array<{
    id: string;
    x0: number;
    x1: number;
    direction: "cooling" | "warming";
    label: string;
  }>;
  high: { x: number; y: number; label: string; index: number } | null;
  low: { x: number; y: number; label: string; index: number } | null;
  now: { x: number; y: number; label: string } | null;
};

const Y_STEPS = [1, 2, 4, 5, 10] as const;

export function buildPierCastChartModel(input: {
  points: readonly PierCastTimelinePoint[];
  shifts: readonly Pick<PierCastShiftCard, "id" | "startAt" | "endAt" | "direction">[];
  layout: PierCastChartLayout;
  todayDate: string | null;
  /** Narrowest day span (px) that still gets its own label. */
  minimumDayWidth?: number;
}): PierCastChartModel | null {
  const points = input.points;
  if (points.length < 2) return null;
  const { layout } = input;
  const minimumDayWidth = input.minimumDayWidth ?? 34;
  const temps = points.map((point) => point.temperatureF);
  const minF = Math.min(...temps);
  const maxF = Math.max(...temps);
  let spanLow = minF - 0.5;
  let spanHigh = maxF + 0.5;
  if (spanHigh - spanLow < 4) {
    const middle = (spanHigh + spanLow) / 2;
    spanLow = middle - 2;
    spanHigh = middle + 2;
  }
  const step = Y_STEPS.find((candidate) =>
    (Math.ceil(spanHigh / candidate) - Math.floor(spanLow / candidate)) <= 7
  ) ?? 10;
  const lowF = Math.floor(spanLow / step) * step;
  const highF = Math.max(lowF + step, Math.ceil(spanHigh / step) * step);
  const plotWidth = layout.width - layout.left - layout.right;
  const plotHeight = layout.height - layout.top - layout.bottom;
  const t0 = points[0]!.time;
  const t1 = points[points.length - 1]!.time;
  const x = (time: number) =>
    layout.left + ((time - t0) / Math.max(1, t1 - t0)) * plotWidth;
  const y = (temperatureF: number) =>
    layout.top + ((highF - temperatureF) / (highF - lowF)) * plotHeight;
  const plotted = points.map((point) => ({
    ...point,
    x: x(point.time),
    y: y(point.temperatureF),
  }));

  const yTicks: PierCastChartModel["yTicks"] = [];
  for (let value = lowF; value <= highF + 1e-9; value += step) {
    yTicks.push({ y: y(value), label: `${value}°` });
  }

  const groups = groupPierCastTimelineDays(points);
  const boundaries = groups.slice(1).map((day) => plotted[day.startIndex]!.x);
  const plotRight = layout.width - layout.right;
  const days = groups.map((day, index) => {
    const x0 = index === 0 ? layout.left : plotted[day.startIndex]!.x;
    const x1 = index === groups.length - 1
      ? plotRight
      : plotted[groups[index + 1]!.startIndex]!.x;
    const wide = x1 - x0 >= minimumDayWidth;
    const lead = index === 0 && !wide;
    const isToday = day.localDate === input.todayDate;
    return {
      localDate: day.localDate,
      label: isToday ? "TODAY" : `${day.weekday.toUpperCase()} ${day.dayOfMonth}`,
      range: wide ? pierCastRangeLabel(day.lowF, day.highF) : null,
      x: lead ? Math.max(x1, layout.left + 4) : Math.min((x0 + x1) / 2, plotRight - 18),
      align: lead ? "end" as const : "center" as const,
      visible: wide || lead,
    };
  });

  const shifts = input.shifts.flatMap((shift) => {
    const start = Math.max(t0, Date.parse(shift.startAt));
    const end = Math.min(t1, Date.parse(shift.endAt));
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      return [];
    }
    return [{
      id: shift.id,
      x0: x(start),
      x1: x(end),
      direction: shift.direction,
      label: shift.direction === "cooling" ? "↓ DROP" : "↑ RISE",
    }];
  });

  const highIndex = temps.indexOf(maxF);
  const lowIndex = temps.indexOf(minF);
  const marker = (index: number, prefix: string) => ({
    x: plotted[index]!.x,
    y: plotted[index]!.y,
    label: `${prefix} ${temps[index]!.toFixed(1)}°`,
    index,
  });
  return {
    layout,
    points: plotted,
    lowF,
    highF,
    yTicks,
    boundaries,
    days,
    shifts,
    high: highIndex > 0 && maxF - minF >= 0.5 ? marker(highIndex, "HIGH") : null,
    low: lowIndex > 0 && maxF - minF >= 0.5 ? marker(lowIndex, "LOW") : null,
    now: {
      x: plotted[0]!.x,
      y: plotted[0]!.y,
      label: `NOW ${temps[0]!.toFixed(1)}°`,
    },
  };
}

/** Smooth monotone-ish path through chart points. */
export function pierCastSmoothPath(
  points: ReadonlyArray<{ x: number; y: number }>,
): string {
  if (points.length === 0) return "";
  let path = `M${points[0]!.x.toFixed(1)},${points[0]!.y.toFixed(1)}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]!;
    const current = points[index]!;
    const middle = (previous.x + current.x) / 2;
    path += ` C${middle.toFixed(1)},${previous.y.toFixed(1)} ${middle.toFixed(1)},${current.y.toFixed(1)} ${current.x.toFixed(1)},${current.y.toFixed(1)}`;
  }
  return path;
}

/** "Wed · 3 PM" (or "Today · 3 PM") for the chart readout. */
export function pierCastReadoutTime(
  point: PierCastTimelinePoint,
  todayDate: string | null,
): string {
  const day = point.local.localDate === todayDate
    ? "Today"
    : point.local.weekday;
  return `${day} · ${pierCastHourLabel(point.local.hour)}`;
}


// ─── Nearby ports ─────────────────────────────────────────────────────────

type NearbyCandidate = {
  cityId: string;
  displayName: string;
  stateCode: string;
  waterTemperatureSource?: {
    configuredLocation?: {
      referencePoint?: { latitude: number; longitude: number } | null;
    } | null;
  } | null;
};

function referencePoint(city: NearbyCandidate) {
  const point = city.waterTemperatureSource?.configuredLocation?.referencePoint;
  return point && Number.isFinite(point.latitude) && Number.isFinite(point.longitude)
    ? point
    : null;
}

/** Great-circle miles between two cities' configured water points. */
export function pierCastCityDistanceMiles(
  origin: NearbyCandidate,
  destination: NearbyCandidate,
): number | null {
  const from = referencePoint(origin);
  const to = referencePoint(destination);
  if (!from || !to) return null;
  const radians = (value: number) => (value * Math.PI) / 180;
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const a = Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Closest other PierCast cities, nearest first. */
export function nearbyPierCastCities<City extends NearbyCandidate>(
  selected: City,
  cities: readonly City[],
  limit = 6,
): Array<{ city: City; miles: number | null }> {
  return cities
    .filter((city) => city.cityId !== selected.cityId)
    .map((city) => ({ city, miles: pierCastCityDistanceMiles(selected, city) }))
    .sort((left, right) =>
      (left.miles ?? Number.POSITIVE_INFINITY) -
        (right.miles ?? Number.POSITIVE_INFINITY) ||
      left.city.displayName.localeCompare(right.city.displayName)
    )
    .slice(0, limit);
}
