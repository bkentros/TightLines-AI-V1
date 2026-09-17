import { PIER_CAST_RESEARCH_DISCLOSURE, PIER_CAST_RESEARCH_DETAIL } from "../lib/pierCastDisclosure";
import { pierTrialRequiresUpgrade } from "../lib/reportTrialPaywall";
import { getEffectiveTier } from "../lib/subscription";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  type DimensionValue,
  Image,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  type StyleProp,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import {
  CornerMarkSet,
  SectionEyebrow,
  TopographicLines,
} from "../components/paper";
import { SubscribePrompt } from "../components/SubscribePrompt";
import { FeedbackCard } from "../components/FeedbackCard";
import {
  PierCastMiniBar,
  PierCastTemperatureChart,
} from "../components/pier-cast/PierCastVisuals";
import { isAdminEmail } from "../lib/adminAccess";
import {
  fetchPierCastCatalog,
  fetchPierCastLeaderboard,
  fetchPierCastCityReport,
  fetchSavedPierCastReport,
  fetchPierCastOwnerReviewCatalog,
  fetchPierCastOwnerV3ReviewOutlook,
  PierCastRequestError,
} from "../lib/pierCast";
import { projectPierCastStandings } from "../lib/pierCastStandings";
import {
  presentPierCastDate,
  PRIMARY_PIER_CAST_SPECIES,
} from "../lib/pierCastSpeciesPresentation";
import { getPierCastSpeciesImage } from "../lib/pierCastSpeciesImages";
import type {
  PierCastCatalogCityRead,
  PierCastCatalogResponse,
  PierCastLeaderboardResponse,
  PierCastReviewCityOutlookRead,
  PierCastReviewDateOutlookRead,
  PierCastReviewOutlookResponse,
  PierCastReviewTemperaturePointRead,
  PierCastSpeciesId,
  PierCastTemperatureEventRead,
  PierCastTemperatureEventSummaryRead,
  PierCastV3ReviewOutlookResponse,
} from "../lib/pierCastContracts";
import {
  fetchPierCastHourlyWeather,
  type PierCastHourlyWeatherPoint,
} from "../lib/pierCastWeather";
import {
  dashboardBandStyleForScore,
  paper,
  paperFonts,
  paperShadows,
  scoreAccentColor,
} from "../lib/theme";
import { getRiverRunSpeciesHeroScale } from "../lib/riverRunSpeciesImages";
import {
  orderPierCastTemperatureEvents,
  pierCastTemperatureEventTimingLabel,
} from "../lib/pierCastTemperatureEventPresentation";
import { hapticSelection } from "../lib/safeHaptics";
import { usePaperBonePulse } from "../lib/usePaperBonePulse";
import { useAuthStore } from "../store/authStore";

const SPECIES_LABELS: Record<PierCastSpeciesId, string> = {
  chinook_salmon: "Chinook Salmon",
  coho_salmon: "Coho Salmon",
  steelhead: "Steelhead",
  brown_trout: "Brown Trout",
  lake_trout: "Lake Trout",
  walleye: "Walleye",
  smallmouth_bass: "Smallmouth Bass",
  freshwater_drum: "Freshwater Drum",
  yellow_perch: "Yellow Perch",
  lake_whitefish: "Lake Whitefish",
  round_whitefish: "Round Whitefish",
  channel_catfish: "Channel Catfish",
  largemouth_bass: "Largemouth Bass",
  atlantic_salmon: "Atlantic Salmon",
  northern_pike: "Northern Pike",
  burbot: "Burbot",
  white_perch: "White Perch",
  white_bass: "White Bass",
  bluegill: "Bluegill",
};

// Normalize the visible (non-transparent) fish artwork inside the species-card
// stage. Source PNGs have different canvas aspect ratios and padding, so these
// values intentionally differ from the larger River Run hero-image scales.
const FISH_SCALE: Record<PierCastSpeciesId, number> = {
  chinook_salmon: 1.38,
  coho_salmon: 1.4,
  steelhead: 1.08,
  brown_trout: 0.9,
  lake_trout: 1.38,
  walleye: 1.38,
  smallmouth_bass: 1.38,
  freshwater_drum: 1.32,
  yellow_perch: 1.34,
  lake_whitefish: 1.4,
  round_whitefish: 1.4,
  channel_catfish: 1.38,
  largemouth_bass: 1.38,
  atlantic_salmon: 1.07,
  northern_pike: 0.9,
  burbot: 1.24,
  white_perch: 1.2,
  white_bass: 1.2,
  bluegill: 1.16,
};

const PIER_CAST_CONDITIONS_REFRESH_MS = 15 * 60 * 1000;

const SKELETON_THREE = ["a", "b", "c"] as const;
const SKELETON_FOUR = ["a", "b", "c", "d"] as const;
const SKELETON_FIVE = ["a", "b", "c", "d", "e"] as const;

const STATE_LABELS: Record<PierCastCatalogCityRead["stateCode"], string> = {
  MI: "Michigan",
  WI: "Wisconsin",
};

function coreSpeciesImage(speciesId: PierCastSpeciesId) {
  return getPierCastSpeciesImage(speciesId);
}

function primaryPierName(city: PierCastCatalogCityRead): string {
  return (
    city.structures.find((structure) => structure.disposition === "candidate")
      ?.displayName ??
    city.structures.find((structure) => structure.disposition !== "excluded")
      ?.displayName ??
    "Configured shoreline"
  );
}

function cityCoordinates(
  city: PierCastCatalogCityRead,
): { latitude: number; longitude: number } | null {
  return (
    city.waterTemperatureSource?.configuredLocation?.referencePoint ?? null
  );
}

function distanceBetweenCities(
  origin: PierCastCatalogCityRead,
  destination: PierCastCatalogCityRead,
): number {
  if (origin.cityId === destination.cityId) return -1;
  const from = cityCoordinates(origin);
  const to = cityCoordinates(destination);
  if (!from || !to) return Number.POSITIVE_INFINITY;
  const radians = (value: number) => (value * Math.PI) / 180;
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fahrenheit(valueC: number): number {
  return (valueC * 9) / 5 + 32;
}

function dateParts(localDate: string): {
  day: string;
  month: string;
  date: string;
  year: string;
} {
  const [year, month, day] = localDate.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day));
  return {
    day: new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: "UTC",
    })
      .format(value)
      .toUpperCase(),
    month: new Intl.DateTimeFormat("en-US", {
      month: "short",
      timeZone: "UTC",
    })
      .format(value)
      .toUpperCase(),
    date: String(day),
    year: String(year),
  };
}

function localHourKey(utcValue: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    timeZone: timezone,
  }).formatToParts(new Date(utcValue));
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${read("year")}-${read("month")}-${read("day")}T${read("hour")}:00`;
}

function formatLocalHour(localTime: string): string {
  const hour = Number(localTime.slice(11, 13));
  if (!Number.isFinite(hour)) return "—";
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12} ${suffix}`;
}

function formatRefreshTime(value: string, timezone: string): string {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
    timeZoneName: "short",
  }).format(date);
}

function directionLabel(degrees: number | null): string {
  if (degrees === null || !Number.isFinite(degrees)) return "—";
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return directions[Math.round((((degrees % 360) + 360) % 360) / 22.5) % 16]!;
}

function scoreValue(date: Pick<PierCastReviewDateOutlookRead, "headline">): number | null {
  return date.headline.overall.status === "available"
    ? date.headline.overall.displayScore
    : null;
}

function isDateScorePending(date: PierCastReviewDateOutlookRead): boolean {
  return date.headline.overall.status !== "available" &&
    date.waterTemperature.status === "partial" &&
    date.waterTemperature.coverageFraction > 0;
}

function rankingScoreValue(date: Pick<PierCastReviewDateOutlookRead, "headline">): number | null {
  return date.headline.overall.status === "available"
    ? date.headline.overall.score
    : null;
}

function temperatureRange(date: PierCastReviewDateOutlookRead): string {
  const { minimumC, maximumC } = date.waterTemperature;
  if (minimumC === null || maximumC === null) return "—";
  return `${fahrenheit(minimumC).toFixed(1)}–${fahrenheit(maximumC).toFixed(1)}°F`;
}

function temperatureAtOffset(
  allPoints: PierCastReviewTemperaturePointRead[],
  startAt: string | undefined,
  hours: number,
): PierCastReviewTemperaturePointRead | null {
  if (!startAt) return null;
  const startMs = new Date(startAt).getTime();
  if (!Number.isFinite(startMs)) return null;
  const targetMs = startMs + hours * 60 * 60 * 1000;
  return allPoints.reduce<PierCastReviewTemperaturePointRead | null>(
    (best, point) => {
      const distance = Math.abs(new Date(point.validAt).getTime() - targetMs);
      if (distance > 90 * 60 * 1000) return best;
      if (!best) return point;
      const bestDistance = Math.abs(
        new Date(best.validAt).getTime() - targetMs,
      );
      return distance < bestDistance ? point : best;
    },
    null,
  );
}

function formatDelta(value: number | null): string {
  if (value === null) return "—";
  if (Math.abs(value) < 0.05) return "0.0°";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}°`;
}

function suitabilityText(range: [number, number] | null): string {
  if (!range) return "—";
  const low = Math.round(range[0] * 100);
  const high = Math.round(range[1] * 100);
  return low === high ? `${low}%` : `${low}–${high}%`;
}

/**
 * Absolute water-temperature scale, shared by every city.
 *
 * The previous meter normalized each city's own min/max, so a 70°F hour in
 * Frankfort and a 54°F hour in Sheboygan drew an identical bar — the meter
 * read swing, not temperature. This fixed 38–78°F domain covers Lake Michigan
 * nearshore surface water year-round, so a given height and color mean the
 * same thing on every report.
 */
const WATER_SCALE_MIN_F = 38;
const WATER_SCALE_MAX_F = 78;

const WATER_SCALE_STOPS = [
  { limit: 45, tone: "#1E5C80" },
  { limit: 52, tone: "#2A6E96" },
  { limit: 60, tone: "#3E8FB0" },
  { limit: 68, tone: "#C98A3A" },
  { limit: Infinity, tone: "#C05F1C" },
] as const;

/** Absolute color for a water temperature in °F. */
function waterTone(fahrenheitValue: number): string {
  if (!Number.isFinite(fahrenheitValue)) return paper.dashboardBlue;
  return (
    WATER_SCALE_STOPS.find((stop) => fahrenheitValue < stop.limit)?.tone ??
    "#C05F1C"
  );
}

/** Position of a water temperature on the fixed scale, 0–1. */
function waterFraction(fahrenheitValue: number): number {
  if (!Number.isFinite(fahrenheitValue)) return 0;
  return Math.max(
    0,
    Math.min(
      1,
      (fahrenheitValue - WATER_SCALE_MIN_F) /
        (WATER_SCALE_MAX_F - WATER_SCALE_MIN_F),
    ),
  );
}

/** Exactly five hours fill the rail, so one swipe reveals the next five. */
const HOURS_PER_PAGE = 5;
const HOURS_PER_PAGE_GAPS = HOURS_PER_PAGE - 1;
const HOUR_COLUMN_GAP = 2;
const HOUR_COLUMN_FALLBACK_WIDTH = 62;

/** The fixed scale, drawn once so the per-hour thermometers are readable. */
function WaterScaleLegend() {
  return (
    <View style={styles.scaleLegend}>
      <Text style={styles.scaleLegendLabel}>WATER</Text>
      <Text style={styles.scaleLegendEnd}>{WATER_SCALE_MIN_F}°</Text>
      <View style={styles.scaleLegendBar}>
        {WATER_SCALE_STOPS.map((stop) => (
          <View
            key={stop.tone}
            style={[styles.scaleLegendSegment, { backgroundColor: stop.tone }]}
          />
        ))}
      </View>
      <Text style={styles.scaleLegendEnd}>{WATER_SCALE_MAX_F}°</Text>
    </View>
  );
}

function ReportSection({
  eyebrow,
  title,
  badge,
  accent = paper.dashboardBlue,
  children,
}: {
  eyebrow: string;
  title: string;
  badge?: string;
  accent?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.reportCard}>
      <View style={styles.sectionHead}>
        <View style={styles.sectionHeadCopy}>
          <Text style={[styles.sectionEyebrow, { color: accent }]}>
            {eyebrow}
          </Text>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {badge ? (
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <View style={[styles.sectionRule, { backgroundColor: accent }]} />
      {children}
    </View>
  );
}

function DailyForecastStrip({
  dates,
  selectedIndex,
  onSelect,
  weather,
}: {
  dates: PierCastReviewDateOutlookRead[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  weather: PierCastHourlyWeatherPoint[];
}) {
  const airRanges = useMemo(() => {
    const ranges = new Map<string, { low: number; high: number }>();
    for (const point of weather) {
      if (point.airTemperatureF === null) continue;
      const key = point.localTime.slice(0, 10);
      const current = ranges.get(key);
      ranges.set(
        key,
        current
          ? {
              low: Math.min(current.low, point.airTemperatureF),
              high: Math.max(current.high, point.airTemperatureF),
            }
          : { low: point.airTemperatureF, high: point.airTemperatureF },
      );
    }
    return ranges;
  }, [weather]);

  return (
    <View style={styles.forecastGrid}>
      {dates.slice(0, 5).map((date, index) => {
        const parts = dateParts(date.localDate);
        const score = scoreValue(date);
        const pending = isDateScorePending(date);
        const accent = score === null ? "#AAB2B6" : scoreAccentColor(score);
        const band = score === null ? null : dashboardBandStyleForScore(score);
        const selected = index === selectedIndex;
        const air = airRanges.get(date.localDate);
        return (
          <Pressable
            key={date.localDate}
            style={({ pressed }) => [
              styles.forecastTile,
              selected && styles.forecastTileSelected,
              pressed && styles.standingPressed,
            ]}
            onPress={() => onSelect(index)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${index === 0 ? "Today" : parts.day}, ${parts.month} ${parts.date}, ${pending ? "rating pending" : score === null ? "rating unavailable" : `${score.toFixed(1)} out of 10`}`}
          >
            <Text
              style={[
                styles.forecastTileDay,
                selected && styles.forecastTileDaySelected,
              ]}
            >
              {index === 0 ? "TODAY" : parts.day}
            </Text>
            <Text style={styles.forecastTileDate}>{parts.date}</Text>
            <View
              style={[
                styles.forecastTileScoreBlock,
                { backgroundColor: accent },
              ]}
            >
              <Text
                style={[
                  styles.forecastTileScore,
                  pending && styles.forecastTileScorePending,
                  { color: band?.fg ?? "#FFFFFF" },
                ]}
                allowFontScaling={false}
              >
                {pending ? "PENDING" : score?.toFixed(1) ?? "—"}
              </Text>
            </View>
            <Text style={styles.forecastTileHiLo}>
              {air ? `${Math.round(air.high)}°/${Math.round(air.low)}°` : "—/—"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PierCastHero({
  city,
  date,
}: {
  city: PierCastCatalogCityRead;
  date: PierCastReviewDateOutlookRead;
}) {
  const score = scoreValue(date);
  const pending = isDateScorePending(date);
  const band = score !== null ? dashboardBandStyleForScore(score) : null;
  const speciesId = date.headline.drivingSpeciesId;
  const fish = speciesId ? coreSpeciesImage(speciesId) : null;
  const accent = stateAccent(city.stateCode);
  const scale = speciesId
    ? getRiverRunSpeciesHeroScale(
        speciesId === "brown_trout" ? "lake_run_brown_trout" : speciesId,
      )
    : 1;
  const pierCount = city.structures.filter(
    (structure) => structure.disposition !== "excluded",
  ).length;

  return (
    <View style={styles.heroCard}>
      {/* Deep-water masthead */}
      <View style={styles.heroMasthead}>
        <StandingsBackdrop />
        <TopographicLines
          style={StyleSheet.absoluteFill}
          color={paper.dashboardBlueSky}
          count={7}
        />
        <SectionEyebrow color={paper.gold} size={9} tracking={2.6}>
          LAKE MICHIGAN PIER FORECAST
        </SectionEyebrow>
        <Text style={styles.heroCity} allowFontScaling={false}>
          {city.displayName.toUpperCase()}
        </Text>
        <View style={styles.heroPierLine}>
          <View
            style={[styles.heroStateDot, { backgroundColor: accent.accent }]}
          />
          <Text style={styles.heroPier} numberOfLines={1}>
            {primaryPierName(city)} · {STATE_LABELS[city.stateCode]}
          </Text>
        </View>

        <View style={styles.heroScoreRow}>
          <Text
            style={[
              styles.heroScoreValue,
              pending && styles.heroScorePending,
            ]}
            allowFontScaling={false}
          >
            {pending ? "PENDING" : score?.toFixed(1) ?? "—"}
          </Text>
          {!pending ? <Text style={styles.heroScoreMax}>/10</Text> : null}
          <View style={styles.heroScoreSpacer} />
          {band ? (
            <View
              style={[styles.heroBandChip, { borderColor: band.bg }]}
            >
              <View style={[styles.bandChipDot, { backgroundColor: band.bg }]} />
              <Text style={styles.heroBandChipText}>
                {band.label.toUpperCase()}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.heroMeterTrack}>
          <View
            style={[
              styles.meterFill,
              {
                width: meterWidth(score),
                backgroundColor: band?.bg ?? paper.dashboardBlueLight,
              },
            ]}
          />
        </View>
        <Text style={styles.heroRatingHint}>
          {pending
            ? "FINFINDR OPPORTUNITY RATING · AWAITING FULL-DAY DATA"
            : "FINFINDR OPPORTUNITY RATING · TODAY"}
        </Text>
      </View>

      {/* Specimen plate — the fish always sits on light ground */}
      <View style={styles.heroPlate}>
        <View style={styles.heroFishStage} pointerEvents="none">
          {fish ? (
            <Image
              source={fish}
              style={[
                styles.heroFishImage,
                { transform: [{ scale: scale * 0.8 }] },
              ]}
              resizeMode="contain"
            />
          ) : (
            <Ionicons
              name="fish-outline"
              size={40}
              color={paper.dashboardBlueLight}
            />
          )}
        </View>
        <View style={styles.heroPlateCopy}>
          <Text style={styles.heroPlateLabel}>
            {pending ? "TOP TARGET PENDING" : "TOP TARGET TODAY"}
          </Text>
          <Text style={styles.heroPlateSpecies} numberOfLines={2}>
            {pending
              ? "Pending"
              : speciesId
                ? SPECIES_LABELS[speciesId]
                : "Unavailable"}
          </Text>
          <Text style={styles.heroPlateDetail}>
            {pierCount} {pierCount === 1 ? "pier" : "piers"} covered ·{" "}
            {temperatureRange(date)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function SpeciesBoard({ date }: { date: PierCastReviewDateOutlookRead }) {
  const [moreSpeciesExpanded, setMoreSpeciesExpanded] = useState(false);
  const pending = isDateScorePending(date);
  const regulationNotices = [
    ...new Map(
      date.species.flatMap((species) => species.regulationNotices ?? []).map(
        (notice) => [notice.noticeId, notice] as const,
      ),
    ).values(),
  ];
  const speciesRows = [...date.species].sort((left, right) => {
    const leftScore =
      left.biological.status === "available"
        ? left.biological.displayScore
        : -1;
    const rightScore =
      right.biological.status === "available"
        ? right.biological.displayScore
        : -1;
    return (
      rightScore - leftScore || left.speciesId.localeCompare(right.speciesId)
    );
  });
  const mainSpecies = speciesRows.filter((species) =>
    PRIMARY_PIER_CAST_SPECIES.has(species.speciesId)
  );
  const moreSpecies = speciesRows.filter((species) =>
    !PRIMARY_PIER_CAST_SPECIES.has(species.speciesId)
  );
  const renderSpeciesCard = (
    species: (typeof speciesRows)[number],
    index: number,
  ) => {
    const seasonalPotential = species.seasonalRating ??
      species.activeMode?.seasonalPotential ?? null;
    const score =
      species.biological.status === "available"
        ? species.biological.displayScore
        : null;
    const accent = score === null ? "#AAB2B6" : scoreAccentColor(score);
    const band = dashboardBandStyleForScore(score ?? 5);
    const fish = coreSpeciesImage(species.speciesId);
    const scale = FISH_SCALE[species.speciesId] ?? 1;
    const ratingLabel =
      species.biological.status === "available"
        ? species.biological.label
        : pending
          ? "Pending"
          : "Unavailable";
    const suitability = species.temperatureSuitabilityRange
      ? (species.temperatureSuitabilityRange[0] +
          species.temperatureSuitabilityRange[1]) /
        2
      : null;
    return (
      <View key={species.speciesId} style={styles.speciesCard}>
        <View style={[styles.speciesAccent, { backgroundColor: accent }]} />
        <View style={styles.speciesHeader}>
          <Text style={styles.speciesIndex}>
            {String(index + 1).padStart(2, "0")}
          </Text>
          <View style={styles.speciesFishStage}>
            {fish ? (
              <Image
                source={fish}
                style={[styles.speciesFish, { transform: [{ scale }] }]}
                resizeMode="contain"
              />
            ) : (
              <Ionicons
                name="fish-outline"
                size={30}
                color={paper.dashboardBlueLight}
              />
            )}
          </View>
          <View style={styles.speciesIdentity}>
            <Text style={styles.speciesName} numberOfLines={2}>
              {SPECIES_LABELS[species.speciesId]}
            </Text>
            <View
              style={[
                styles.speciesBandPill,
                { backgroundColor: pending ? "#E8EEF1" : band.chipBg },
              ]}
            >
              <View style={[styles.speciesBandDot, { backgroundColor: accent }]} />
              <Text
                style={[
                  styles.speciesBandText,
                  { color: pending ? DEFAULT_RANK_ACCENT.ink : band.verdictColor },
                ]}
              >
                {ratingLabel.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.speciesScoreWrap}>
            <Text
              style={[
                styles.speciesScore,
                pending && styles.speciesScorePending,
                { color: accent },
              ]}
              allowFontScaling={false}
            >
              {pending ? "PENDING" : score?.toFixed(1) ?? "—"}
            </Text>
            {!pending ? <Text style={styles.speciesScoreMax}>/10</Text> : null}
          </View>
        </View>
        <View style={styles.factorRow}>
          <View style={styles.factor}>
            <View style={styles.factorLabelRow}>
              <Text style={styles.factorLabel}>SEASON</Text>
              <Text style={styles.factorValue}>
                {seasonalPotential?.toFixed(1) ?? "—"}
              </Text>
            </View>
            <PierCastMiniBar
              value={seasonalPotential}
              color={paper.dashboardBlue}
            />
          </View>
          <View style={styles.factor}>
            <View style={styles.factorLabelRow}>
              <Text style={styles.factorLabel} numberOfLines={1}>
                WATER TEMP FIT
              </Text>
              <Text style={styles.factorValue}>
                {suitabilityText(species.temperatureSuitabilityRange)}
              </Text>
            </View>
            <PierCastMiniBar
              value={suitability === null ? null : suitability * 10}
              color={accent}
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <ReportSection
      eyebrow={pending ? "TARGETS PENDING" : "TODAY'S TARGETS"}
      title="Species Comparison"
      badge={`${speciesRows.length} SPECIES`}
    >
      {regulationNotices.map((notice) => (
        <View key={notice.noticeId} style={styles.speciesRegulationNotice}>
          <Ionicons name="warning-outline" size={15} color="#8A5C16" />
          <View style={styles.speciesRegulationNoticeCopy}>
            <Text style={styles.speciesRegulationNoticeTitle}>
              {notice.title.toUpperCase()}
            </Text>
            <Text style={styles.speciesRegulationNoticeText}>
              {notice.message}
            </Text>
          </View>
        </View>
      ))}
      <View style={styles.speciesList}>
        {mainSpecies.map(renderSpeciesCard)}
      </View>
      {moreSpecies.length > 0 ? (
        <>
          <Pressable
            onPress={() => {
              hapticSelection();
              setMoreSpeciesExpanded((expanded) => !expanded);
            }}
            accessibilityRole="button"
            accessibilityLabel="More species at this pier"
            accessibilityState={{ expanded: moreSpeciesExpanded }}
            style={styles.moreSpeciesToggle}
          >
            <Text style={styles.moreSpeciesToggleText}>
              MORE SPECIES AT THIS PIER ({moreSpecies.length})
            </Text>
            <Ionicons
              name={moreSpeciesExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color={paper.dashboardBlue}
            />
          </Pressable>
          {moreSpeciesExpanded ? (
            <View style={styles.speciesList}>
              {moreSpecies.map((species, index) =>
                renderSpeciesCard(species, mainSpecies.length + index)
              )}
            </View>
          ) : null}
        </>
      ) : null}
    </ReportSection>
  );
}

function NearshoreMetricTile({
  icon,
  label,
  value,
  detail,
  accent,
  tint,
  pending = false,
  pulse,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  detail: string;
  accent: string;
  tint: string;
  /** True while this tile's source is still in flight. */
  pending?: boolean;
  pulse?: Animated.Value;
}) {
  return (
    <View style={[styles.nearshoreMetricTile, { backgroundColor: tint }]}>
      <View style={[styles.nearshoreMetricRail, { backgroundColor: accent }]} />
      <View style={styles.nearshoreMetricHeading}>
        <Ionicons name={icon} size={12} color={accent} />
        <Text style={[styles.nearshoreMetricLabel, { color: accent }]}>
          {label}
        </Text>
      </View>
      {pending && pulse ? (
        <>
          <SkeletonBone
            pulse={pulse}
            width={68}
            height={20}
            radius={4}
            tone={accent}
          />
          <SkeletonBone
            pulse={pulse}
            width={54}
            height={8}
            radius={3}
            tone={accent}
            style={styles.skeletonGapSm}
          />
        </>
      ) : (
        <>
          <Text
            style={styles.nearshoreMetricValue}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            allowFontScaling={false}
          >
            {value}
          </Text>
          <Text style={styles.nearshoreMetricDetail} numberOfLines={1}>
            {detail}
          </Text>
        </>
      )}
    </View>
  );
}

/**
 * One hour of pier conditions: a thermometer on the shared absolute scale,
 * then air and wind. Width is supplied by the rail so exactly five columns
 * fill the viewport at any screen size.
 */
function HourColumn({
  localTime,
  water,
  weather,
  isNow,
  width,
  pending = false,
}: {
  localTime: string;
  water: number;
  weather: PierCastHourlyWeatherPoint | null;
  isNow: boolean;
  width: number;
  /** Air and wind still loading; water is already known. */
  pending?: boolean;
}) {
  const tone = waterTone(water);
  const fraction = waterFraction(water);
  const direction = directionLabel(weather?.windDirectionDegrees ?? null);
  return (
    <View style={[styles.hourColumn, { width }, isNow && styles.hourColumnNow]}>
      <Text style={[styles.hourTime, isNow && styles.hourTimeNow]}>
        {isNow ? "NOW" : formatLocalHour(localTime)}
      </Text>
      <View style={styles.thermo}>
        <View style={styles.thermoTrack}>
          <View
            style={[
              styles.thermoFill,
              {
                height: `${Math.max(3, fraction * 100)}%`,
                backgroundColor: tone,
              },
            ]}
          />
        </View>
        <View style={[styles.thermoBulb, { backgroundColor: tone }]} />
      </View>
      <Text style={[styles.hourWater, { color: tone }]} allowFontScaling={false}>
        {water.toFixed(1)}°
      </Text>
      {pending ? (
        <>
          {/* Static, not pulsing: the rail renders every hour at once, so
              animating these would mean hundreds of driven views. The metric
              tiles above carry the motion. */}
          <View style={styles.hourPendingAir} />
          <View style={styles.hourPendingWind} />
        </>
      ) : (
        <>
          <View style={styles.hourMetaRow}>
            <Ionicons name="thermometer-outline" size={9} color="#B65B2A" />
            <Text style={styles.hourMetaText}>
              {weather?.airTemperatureF == null
                ? "—"
                : `${Math.round(weather.airTemperatureF)}°`}
            </Text>
          </View>
          <Text style={styles.hourWindText} numberOfLines={1}>
            {weather?.windSpeedMph == null
              ? "—"
              : `${direction} ${Math.round(weather.windSpeedMph)}`}
          </Text>
        </>
      )}
    </View>
  );
}

function HourlyConditions({
  dates,
  timeline,
  weather,
  conditionsUpdatedAt,
  weatherLoading,
}: {
  dates: PierCastReviewDateOutlookRead[];
  timeline: PierCastReviewTemperaturePointRead[];
  weather: PierCastHourlyWeatherPoint[];
  conditionsUpdatedAt: string;
  /** Water is already known on open; air and wind arrive per city. */
  weatherLoading: boolean;
}) {
  const pendingPulse = usePaperBonePulse({ from: 0.16, to: 0.4 });
  const weatherByTime = useMemo(
    () => new Map(weather.map((point) => [point.localTime, point])),
    [weather],
  );
  const timezone = dates[0]?.timezone ?? "America/Detroit";

  /**
   * One flat, evenly-spaced list of hours. The rail used to be a list of
   * per-day groups with gaps between them, which made an aligned scroll
   * impossible: snapping had to land on day boundaries and therefore skipped
   * every hour in between. Days are now communicated by the chips above the
   * rail instead of by gaps inside it.
   */
  const rows = useMemo(() => {
    const unique = new Map<
      string,
      {
        water: number;
        weather: PierCastHourlyWeatherPoint | null;
        localTime: string;
      }
    >();
    for (const point of timeline) {
      const key = localHourKey(point.validAt, timezone);
      unique.set(key, {
        water: fahrenheit(point.temperatureC),
        weather: weatherByTime.get(key) ?? null,
        localTime: key,
      });
    }
    return [...unique.values()].sort((left, right) =>
      left.localTime.localeCompare(right.localTime),
    );
  }, [timeline, timezone, weatherByTime]);

  /** Distinct local days, each with the row index it starts at. */
  const days = useMemo(() => {
    const list: Array<{ localDate: string; startIndex: number }> = [];
    rows.forEach((row, index) => {
      const localDate = row.localTime.slice(0, 10);
      if (list[list.length - 1]?.localDate === localDate) return;
      list.push({ localDate, startIndex: index });
    });
    return list;
  }, [rows]);

  const [railWidth, setRailWidth] = useState(0);
  const [leadingIndex, setLeadingIndex] = useState(0);
  const railRef = useRef<ScrollView>(null);

  // Five columns exactly fill the viewport, so one swipe reveals the next
  // five hours and every hour stays reachable.
  const columnWidth =
    railWidth > 0
      ? (railWidth - HOURS_PER_PAGE_GAPS * HOUR_COLUMN_GAP) / HOURS_PER_PAGE
      : HOUR_COLUMN_FALLBACK_WIDTH;
  const step = columnWidth + HOUR_COLUMN_GAP;

  useEffect(() => {
    setLeadingIndex(0);
    railRef.current?.scrollTo({ x: 0, animated: false });
  }, [dates]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setRailWidth(event.nativeEvent.layout.width);
  }, []);

  const handleRailScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (step <= 0) return;
      const next = Math.max(
        0,
        Math.min(
          rows.length - 1,
          Math.round(event.nativeEvent.contentOffset.x / step),
        ),
      );
      setLeadingIndex((current) => (current === next ? current : next));
    },
    [rows.length, step],
  );

  const syncLeadingIndex = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (step <= 0) return;
      const next = Math.max(
        0,
        Math.min(
          rows.length - 1,
          Math.round(event.nativeEvent.contentOffset.x / step),
        ),
      );
      setLeadingIndex((current) => (current === next ? current : next));
    },
    [rows.length, step],
  );

  /**
   * Tapping a day scrolls it to the leading column — midnight for every day
   * after today, and today's first forecast hour for today itself, since the
   * series starts mid-day and has no earlier hour to land on.
   */
  const jumpToDay = useCallback(
    (startIndex: number) => {
      hapticSelection();
      setLeadingIndex(startIndex);
      railRef.current?.scrollTo({ x: startIndex * step, animated: true });
    },
    [step],
  );

  /**
   * The day chip follows the LEFTMOST visible hour. Scrolling until 11 PM is
   * the first column keeps the previous day active even though the small
   * hours of the next day are already on screen; the chip flips only once the
   * new day's midnight becomes the leading column.
   */
  const activeDayIndex = useMemo(() => {
    let active = 0;
    days.forEach((day, index) => {
      if (leadingIndex >= day.startIndex) active = index;
    });
    return active;
  }, [days, leadingIndex]);

  const leadingRow = rows[leadingIndex] ?? null;
  const trailingRow =
    rows[Math.min(leadingIndex + HOURS_PER_PAGE - 1, rows.length - 1)] ?? null;

  const first = rows[0] ?? null;
  const windDirection = directionLabel(
    first?.weather?.windDirectionDegrees ?? null,
  );

  return (
    <ReportSection
      eyebrow="FIVE-DAY NEARSHORE READ"
      title="Pier Conditions"
      badge="5 DAYS"
    >
      <View style={styles.nearshoreMetricGrid}>
        <NearshoreMetricTile
          icon="water"
          label="WATER"
          value={first ? `${first.water.toFixed(1)}°F` : "—"}
          detail="Nearshore surface"
          accent={paper.dashboardBlue}
          tint="#EFF6FA"
        />
        <NearshoreMetricTile
          icon="thermometer-outline"
          label="AIR"
          value={
            first?.weather?.airTemperatureF == null
              ? "—"
              : `${Math.round(first.weather.airTemperatureF)}°F`
          }
          detail="At the pier"
          accent="#B65B2A"
          tint="#FDF3ED"
          pending={weatherLoading}
          pulse={pendingPulse}
        />
        <NearshoreMetricTile
          icon="navigate"
          label="WIND"
          value={
            first?.weather?.windSpeedMph == null
              ? "—"
              : `${Math.round(first.weather.windSpeedMph)} mph`
          }
          detail={
            first?.weather?.windSpeedMph == null
              ? "Direction unavailable"
              : `From ${windDirection}`
          }
          accent="#1E746B"
          tint="#EDF6F4"
          pending={weatherLoading}
          pulse={pendingPulse}
        />
      </View>

      <View style={styles.freshnessStrip}>
        <Ionicons name="refresh" size={12} color={paper.dashboardBlue} />
        <Text style={styles.freshnessText}>
          {weatherLoading
            ? "Loading air and wind for this pier…"
            : `Conditions checked ${formatRefreshTime(conditionsUpdatedAt, timezone)}`}
        </Text>
      </View>

      {rows.length ? (
        <>
          <View style={styles.dayJumpRow}>
            {days.map((day, index) => {
              const parts = dateParts(day.localDate);
              const selected = index === activeDayIndex;
              return (
                <Pressable
                  key={day.localDate}
                  style={({ pressed }) => [
                    styles.dayJumpChip,
                    selected && styles.dayJumpChipSelected,
                    pressed && styles.standingPressed,
                  ]}
                  onPress={() => jumpToDay(day.startIndex)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Jump to ${index === 0 ? "today" : parts.day}`}
                >
                  <Text
                    style={[
                      styles.dayJumpChipText,
                      selected && styles.dayJumpChipTextSelected,
                    ]}
                  >
                    {index === 0 ? "TODAY" : parts.day}
                  </Text>
                  <Text
                    style={[
                      styles.dayJumpChipDate,
                      selected && styles.dayJumpChipDateSelected,
                    ]}
                  >
                    {parts.date}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.hourlyHeading}>
            <Text style={styles.hourlyHeadingText}>
              {dateParts(
                days[activeDayIndex]?.localDate ?? rows[0]!.localTime.slice(0, 10),
              ).day}
              {"  ·  "}
              {leadingRow ? formatLocalHour(leadingRow.localTime) : "—"}
              {" – "}
              {trailingRow ? formatLocalHour(trailingRow.localTime) : "—"}
            </Text>
            <Text style={styles.hourlyHeadingCount}>
              {leadingIndex + 1}/{rows.length}
            </Text>
          </View>

          <WaterScaleLegend />

          <ScrollView
            ref={railRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onLayout={handleLayout}
            onScroll={handleRailScroll}
            scrollEventThrottle={16}
            // Full momentum: a flick carries as far as it should, and
            // snapToInterval only decides where it comes to rest, so the rail
            // always settles aligned to an hour without capping swipe
            // distance. (disableIntervalMomentum is deliberately NOT set —
            // it limits a swipe to ONE interval, which here is one hour.)
            snapToInterval={step}
            snapToAlignment="start"
            decelerationRate="normal"
            onMomentumScrollEnd={syncLeadingIndex}
            contentContainerStyle={styles.hourlyRail}
          >
            {rows.map((row, index) => (
              <HourColumn
                key={row.localTime}
                localTime={row.localTime}
                water={row.water}
                weather={row.weather}
                isNow={index === 0}
                width={columnWidth}
                pending={weatherLoading}
              />
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={styles.hourlyEmpty}>
          <Text style={styles.hourlyEmptyText}>
            HOURLY CONDITIONS UNAVAILABLE
          </Text>
        </View>
      )}
    </ReportSection>
  );
}

function TemperaturePanel({
  date,
  allPoints,
}: {
  date: PierCastReviewDateOutlookRead;
  allPoints: PierCastReviewTemperaturePointRead[];
}) {
  const start = allPoints[0] ?? null;
  const at12 = temperatureAtOffset(allPoints, start?.validAt, 12);
  const at24 = temperatureAtOffset(allPoints, start?.validAt, 24);
  const startF = start ? fahrenheit(start.temperatureC) : null;
  const at12F = at12 ? fahrenheit(at12.temperatureC) : null;
  const at24F = at24 ? fahrenheit(at24.temperatureC) : null;
  const delta12 = startF !== null && at12F !== null ? at12F - startF : null;
  const delta24 = startF !== null && at24F !== null ? at24F - startF : null;

  const reads: Array<{ label: string; value: string; detail: string }> = [
    {
      label: "NOW",
      value: startF === null ? "—" : `${startF.toFixed(1)}°`,
      detail: "Forecast start",
    },
    {
      label: "+12 HRS",
      value: at12F === null ? "—" : `${at12F.toFixed(1)}°`,
      detail: formatDelta(delta12),
    },
    {
      label: "+24 HRS",
      value: at24F === null ? "—" : `${at24F.toFixed(1)}°`,
      detail: formatDelta(delta24),
    },
  ];

  return (
    <ReportSection
      eyebrow="FIVE-DAY WATER TREND"
      title="Temperature Outlook"
      badge="MODELED"
    >
      <View style={styles.tempReadRow}>
        {reads.map((read, index) => (
          <View
            key={read.label}
            style={[
              styles.tempRead,
              index === 0 && styles.tempReadNow,
            ]}
          >
            <Text style={styles.tempReadLabel}>{read.label}</Text>
            <Text style={styles.tempReadValue} allowFontScaling={false}>
              {read.value}
            </Text>
            <Text style={styles.tempReadDetail} numberOfLines={1}>
              {read.detail}
            </Text>
          </View>
        ))}
      </View>

      <PierCastTemperatureChart
        points={allPoints}
        timezone={date.timezone}
        xAxisMode="days"
      />
      <View style={styles.chartLegend}>
        <View style={styles.chartLegendItem}>
          <View
            style={[styles.chartLegendSwatch, { backgroundColor: "#CC6A22" }]}
          />
          <Text style={styles.chartLegendText}>WARMER</Text>
        </View>
        <View style={styles.chartLegendItem}>
          <View
            style={[styles.chartLegendSwatch, { backgroundColor: "#1E5C80" }]}
          />
          <Text style={styles.chartLegendText}>COOLER</Text>
        </View>
        <View style={styles.chartLegendSpacer} />
        <Text style={styles.chartLegendCaption}>
          {dateParts(date.localDate).month} {dateParts(date.localDate).date} ·{" "}
          {temperatureRange(date)}
        </Text>
      </View>
    </ReportSection>
  );
}

const TEMPERATURE_EVENT_TONES = {
  cooling: { accent: "#1E5C80", tint: "#EEF5F8" },
  warming: { accent: "#B85D20", tint: "#FBF2EB" },
} as const;

const TEMPERATURE_SEVERITY_TONES: Record<
  PierCastTemperatureEventRead["severity"],
  string
> = {
  minor: "#71838C",
  notable: "#1E746B",
  major: "#B87520",
  extreme: "#B54026",
};

function eventMagnitudeF(event: PierCastTemperatureEventRead): number {
  return event.magnitudeC * 9 / 5;
}

function eventTemperatureF(temperatureC: number): string {
  return `${fahrenheit(temperatureC).toFixed(1)}°F`;
}

function eventDuration(durationHours: number): string {
  const rounded = Math.round(durationHours * 10) / 10;
  const value = Number.isInteger(rounded)
    ? rounded.toFixed(0)
    : rounded.toFixed(1);
  return `${value} ${rounded === 1 ? "HR" : "HRS"}`;
}

function eventDate(value: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: timezone,
  }).format(new Date(value));
}

function eventShortDate(value: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: timezone,
  }).format(new Date(value));
}

function eventClock(value: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
    timeZoneName: "short",
  }).format(new Date(value));
}

function eventBoundaryText(event: PierCastTemperatureEventRead): string | null {
  if (event.startsAtCoverageBoundary && event.endsAtCoverageBoundary) {
    return "This shift touches both available-coverage boundaries; its full size may be larger.";
  }
  if (event.startsAtCoverageBoundary) {
    return "This shift may already be underway when available coverage begins.";
  }
  if (event.endsAtCoverageBoundary) {
    return "Available coverage ends before this shift can be confirmed complete.";
  }
  return null;
}

function temperatureCoverageNote(
  summary: PierCastTemperatureEventSummaryRead | undefined,
): string | null {
  if (summary?.status !== "partial") return null;
  if (summary.reasonCodes.includes("temperature_event_coverage_gap")) {
    return "Forecast coverage contains a gap. PierCast never measures a shift across missing hours.";
  }
  return "Some forecast samples could not be analyzed. Results use only valid continuous temperature data.";
}

function WaterTemperatureShifts({
  summary,
  timezone,
  referenceAt,
}: {
  summary: PierCastTemperatureEventSummaryRead | undefined;
  timezone: string;
  referenceAt: string;
}) {
  const events = orderPierCastTemperatureEvents(summary, referenceAt);
  const unavailable = !summary || summary.status === "unavailable";
  const coverageNote = temperatureCoverageNote(summary);

  return (
    <ReportSection
      eyebrow="FIVE-DAY WATER SHIFT WATCH"
      title="Water Temperature Shifts"
      badge="MODELED"
      accent="#1E746B"
    >
      {unavailable ? (
        <View style={styles.flipEmpty}>
          <Ionicons
            name="cloud-offline-outline"
            size={18}
            color={paper.dashboardMuted}
          />
          <Text style={styles.flipEmptyTitle}>SHIFT ANALYSIS UNAVAILABLE</Text>
          <Text style={styles.flipEmptyCopy}>
            This forecast does not contain enough detector data to evaluate
            meaningful water-temperature changes.
          </Text>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.flipEmpty}>
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color="#1E746B"
          />
          <Text style={styles.flipEmptyTitle}>NO QUALIFYING SHIFT DETECTED</Text>
          <Text style={styles.flipEmptyCopy}>
            No modeled water-temperature change of at least 3°F was found
            within a rolling 24-hour window.
          </Text>
        </View>
      ) : (
        <View style={styles.flipEventList}>
          {events.map((event) => {
            const tone = TEMPERATURE_EVENT_TONES[event.direction];
            const severityTone = TEMPERATURE_SEVERITY_TONES[event.severity];
            const boundary = eventBoundaryText(event);
            const timingLabel = pierCastTemperatureEventTimingLabel(
              event,
              referenceAt,
              timezone,
            );
            return (
              <View
                key={event.eventId}
                style={[styles.flipEvent, { borderLeftColor: tone.accent }]}
                accessible
                accessibilityLabel={`${timingLabel.toLowerCase()}, ${event.severity} water temperature ${event.direction === "cooling" ? "drop" : "rise"}, ${eventMagnitudeF(event).toFixed(1)} degrees Fahrenheit over ${eventDuration(event.durationHours).toLowerCase()}, ending ${eventDate(event.endAt, timezone)}`}
              >
                <View style={styles.flipEventHead}>
                  <View
                    style={[
                      styles.flipEventDirectionIcon,
                      { backgroundColor: tone.tint },
                    ]}
                  >
                    <Ionicons
                      name={
                        event.direction === "cooling"
                          ? "arrow-down"
                          : "arrow-up"
                      }
                      size={14}
                      color={tone.accent}
                    />
                  </View>
                  <View style={styles.flipEventHeading}>
                    <Text
                      style={[
                        styles.flipEventRelativeTiming,
                        { color: tone.accent },
                      ]}
                    >
                      {timingLabel}
                    </Text>
                    <Text style={styles.flipEventTitle}>
                      Water temperature {event.direction === "cooling"
                        ? "drop"
                        : "rise"}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.flipSeverityChip,
                      { backgroundColor: severityTone },
                    ]}
                  >
                    <Text style={styles.flipSeverityText}>
                      {event.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.flipEventMetrics}>
                  <View style={styles.flipEventMetric}>
                    <Text
                      style={[
                        styles.flipEventMetricValue,
                        { color: tone.accent },
                      ]}
                      allowFontScaling={false}
                    >
                      {event.direction === "cooling" ? "−" : "+"}
                      {eventMagnitudeF(event).toFixed(1)}°F
                    </Text>
                    <Text style={styles.flipEventMetricLabel}>TOTAL SHIFT</Text>
                  </View>
                  <View style={styles.flipEventMetricRule} />
                  <View style={styles.flipEventMetric}>
                    <Text
                      style={styles.flipEventMetricValue}
                      allowFontScaling={false}
                    >
                      {eventDuration(event.durationHours)}
                    </Text>
                    <Text style={styles.flipEventMetricLabel}>
                      SHIFT DURATION
                    </Text>
                  </View>
                  <View style={styles.flipEventMetricRule} />
                  <View style={styles.flipEventMetric}>
                    <Text
                      style={styles.flipEventMetricValue}
                      allowFontScaling={false}
                    >
                      {eventTemperatureF(event.endTemperatureC)}
                    </Text>
                    <Text style={styles.flipEventMetricLabel}>ENDING WATER</Text>
                  </View>
                </View>
                <View style={styles.flipEventTiming}>
                  <Text style={styles.flipEventTimingLabel}>
                    MODELED SHIFT WINDOW
                  </Text>
                  <View style={styles.flipEventTimingRow}>
                    <View style={styles.flipEventMoment}>
                      <Text style={styles.flipEventMomentLabel}>START</Text>
                      <Text style={styles.flipEventMomentDate} numberOfLines={1}>
                        {eventShortDate(event.startAt, timezone).toUpperCase()}
                      </Text>
                      <Text style={styles.flipEventMomentClock}>
                        {eventClock(event.startAt, timezone)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.flipEventTimingArrow,
                        { backgroundColor: tone.tint },
                      ]}
                    >
                      <Ionicons
                        name="arrow-forward"
                        size={13}
                        color={tone.accent}
                      />
                    </View>
                    <View
                      style={[
                        styles.flipEventMoment,
                        styles.flipEventMomentEnd,
                      ]}
                    >
                      <Text style={styles.flipEventMomentLabel}>END</Text>
                      <Text style={styles.flipEventMomentDate} numberOfLines={1}>
                        {eventShortDate(event.endAt, timezone).toUpperCase()}
                      </Text>
                      <Text style={styles.flipEventMomentClock}>
                        {eventClock(event.endAt, timezone)}
                      </Text>
                    </View>
                  </View>
                </View>
                {boundary ? (
                  <Text style={styles.flipEventBoundary}>{boundary}</Text>
                ) : null}
              </View>
            );
          })}
        </View>
      )}

      {coverageNote ? (
        <View style={styles.flipCoverageNote}>
          <Ionicons name="warning-outline" size={13} color="#95651D" />
          <Text style={styles.flipCoverageText}>
            {coverageNote}
          </Text>
        </View>
      ) : null}

      <View style={styles.flipExplainer}>
        <Ionicons
          name="information-circle-outline"
          size={14}
          color="#1E746B"
        />
        <Text style={styles.flipExplainerText}>
          A strong modeled temperature drop can signal a lake flip or upwelling
          near a pier; a rise can mark warmer water returning. Temperature alone
          cannot confirm the physical cause.
        </Text>
      </View>
    </ReportSection>
  );
}

function PiersCovered({ city }: { city: PierCastCatalogCityRead }) {
  const [expanded, setExpanded] = useState(false);
  const approved = city.structures.filter(
    (item) => item.disposition === "candidate",
  );
  const structures = approved.length
    ? approved
    : city.structures.filter((item) => item.disposition !== "excluded");
  const structureCountLabel = `${structures.length
    .toString()
    .padStart(2, "0")} ${structures.length === 1 ? "PIER" : "PIERS"}`;
  return (
    <View style={styles.compactInfoCard}>
      <Pressable
        style={({ pressed }) => [
          styles.compactInfoHeader,
          pressed && styles.collapsiblePressed,
        ]}
        onPress={() => {
          hapticSelection();
          setExpanded((current) => !current);
        }}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`Piers covered, ${structures.length} ${structures.length === 1 ? "pier" : "piers"}`}
      >
        <View style={styles.compactInfoIcon}>
          <Ionicons name="location" size={17} color="#167B78" />
        </View>
        <View style={styles.compactInfoBody}>
          <Text style={styles.compactInfoTitle}>Piers covered</Text>
          <Text style={styles.compactInfoSummary}>
            {structureCountLabel}
          </Text>
        </View>
        <View style={styles.collapsibleChevron}>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={17}
            color="#167B78"
          />
        </View>
      </Pressable>
      {expanded ? (
        <View style={styles.compactInfoContent}>
          <Text style={styles.compactInfoCopy}>
            Check local access before you go — published rules are not a live
            guarantee.
          </Text>
          <View style={styles.pierChips}>
            {structures.map((item) => (
              <View key={item.structureId} style={styles.pierChip}>
                <View style={styles.pierChipDot} />
                <Text style={styles.pierChipText}>{item.displayName}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function RatingExplanation({
  winterNotice,
  showWinterNotice,
}: {
  winterNotice: string;
  showWinterNotice: boolean;
}) {
  const [expanded, setExpanded] = useState(showWinterNotice);

  useEffect(() => {
    if (showWinterNotice) setExpanded(true);
  }, [showWinterNotice]);

  return (
    <View style={styles.ratingExplanation}>
      <Pressable
        style={({ pressed }) => [
          styles.ratingExplanationTitleRow,
          pressed && styles.collapsiblePressed,
        ]}
        onPress={() => {
          hapticSelection();
          setExpanded((current) => !current);
        }}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel="About the FinFindr Opportunity Rating"
      >
        <Ionicons
          name="information-circle"
          size={18}
          color={paper.dashboardBlue}
        />
        <Text style={styles.ratingExplanationTitle}>
          FinFindr Opportunity Rating
        </Text>
        <View style={styles.ratingExplanationChevron}>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={17}
            color={paper.dashboardBlue}
          />
        </View>
      </Pressable>
      {expanded ? (
        <View style={styles.ratingExplanationContent}>
          <Text style={styles.ratingExplanationCopy}>
            {PIER_CAST_RESEARCH_DISCLOSURE}
          </Text>
          <Text style={styles.ratingExplanationCopy}>
            {PIER_CAST_RESEARCH_DETAIL}
          </Text>
          {showWinterNotice ? (
            <View style={styles.winterNotice}>
              <Ionicons name="snow-outline" size={14} color="#856318" />
              <Text style={styles.winterNoticeText}>{winterNotice}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function fullDateLabel(localDate: string | undefined): string {
  if (!localDate) return "Today";
  const parts = dateParts(localDate);
  return `${parts.month.charAt(0)}${parts.month.slice(1).toLowerCase()} ${parts.date}, ${parts.year}`;
}

type PierCastLeaderboardEntry = {
  city: PierCastCatalogCityRead;
  date: Pick<PierCastReviewDateOutlookRead, "localDate" | "headline"> | null;
  score: number | null;
  rankingScore: number | null;
};

const STATE_ACCENTS: Record<
  PierCastCatalogCityRead["stateCode"],
  { accent: string; deep: string; tint: string; onAccent: string }
> = {
  MI: {
    accent: paper.dashboardBlue,
    deep: "#1B5675",
    tint: "#EBF4F9",
    onAccent: "#FFFFFF",
  },
  WI: {
    accent: paper.rust,
    deep: "#994C17",
    tint: "#FBF1E8",
    onAccent: "#FFFFFF",
  },
};

const STATE_ACCENT_FALLBACK = {
  accent: paper.moss,
  deep: paper.mossDk,
  tint: "#EFF4E8",
  onAccent: "#FFFFFF",
};

function stateAccent(stateCode: PierCastCatalogCityRead["stateCode"]) {
  return STATE_ACCENTS[stateCode] ?? STATE_ACCENT_FALLBACK;
}

/**
 * Medal tiers for ranks 01–03 only. Metal lives in a struck disc and the
 * card's hairline — never as a card surface — so the podium reads special
 * without leaving the field-edition palette.
 */
const MEDAL_TIERS: Record<
  number,
  { ring: string; tint: string; ink: string; label: string; edge: string }
> = {
  1: {
    ring: "#C9A227",
    tint: "#FAF0D4",
    ink: "#78550A",
    label: "GOLD",
    edge: "rgba(201,162,39,0.55)",
  },
  2: {
    ring: "#8D99A1",
    tint: "#EFF3F5",
    ink: "#48555D",
    label: "SILVER",
    edge: "rgba(141,153,161,0.55)",
  },
  3: {
    ring: "#B0733C",
    tint: "#F8EDE1",
    ink: "#7A4A1E",
    label: "BRONZE",
    edge: "rgba(176,115,60,0.55)",
  },
};

const DEFAULT_RANK_ACCENT = {
  ring: "#748A96",
  ink: "#526772",
};

/** The 5-band rating scale, lowest to highest — the app's signature ramp. */
const BAND_SPECTRUM = [
  paper.bandTough,
  paper.bandPoor,
  paper.bandFair,
  paper.bandGood,
  paper.bandPrime,
] as const;

function meterWidth(score: number | null): `${number}%` {
  if (score === null || !Number.isFinite(score)) return "0%";
  return `${Math.max(4, Math.min(100, (score / 10) * 100))}%`;
}

/**
 * Deep-water gradient behind the standings masthead. Plain <Rect> fills with
 * percentage sizing, so nothing distorts at any screen width.
 */
function StandingsBackdrop() {
  const baseId = useId();
  const deepId = `${baseId}-deep`;
  const glowId = `${baseId}-glow`;
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id={deepId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#0A1B2E" />
          <Stop offset="0.5" stopColor="#12384E" />
          <Stop offset="1" stopColor="#0B2135" />
        </LinearGradient>
        <LinearGradient id={glowId} x1="0" y1="1" x2="0" y2="0">
          <Stop
            offset="0"
            stopColor={paper.dashboardBlue}
            stopOpacity="0.45"
          />
          <Stop
            offset="1"
            stopColor={paper.dashboardBlue}
            stopOpacity="0"
          />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${deepId})`} />
      <Rect x="0" y="46%" width="100%" height="54%" fill={`url(#${glowId})`} />
    </Svg>
  );
}

/** The five-band rating ramp, rendered as a thin segmented bar. */
function BandSpectrum() {
  return (
    <View style={styles.spectrumBlock}>
      <Text style={styles.spectrumEnd}>TOUGH</Text>
      <View style={styles.spectrumBar}>
        {BAND_SPECTRUM.map((color) => (
          <View
            key={color}
            style={[styles.spectrumSegment, { backgroundColor: color }]}
          />
        ))}
      </View>
      <Text style={styles.spectrumEnd}>PRIME</Text>
    </View>
  );
}

/** Struck medal disc for ranks 01–03. Ranks 04+ get a plain numeral. */
function RankMedallion({
  rank,
  size = 34,
}: {
  rank: number | null;
  size?: number;
}) {
  if (rank === null) {
    return (
      <Text
        style={[styles.standingRankNumeral, { width: size }]}
        allowFontScaling={false}
        accessibilityLabel="Not yet ranked"
      >
        —
      </Text>
    );
  }
  const tier = MEDAL_TIERS[rank];
  if (!tier) {
    return (
      <Text
        style={[
          styles.standingRankNumeral,
          { width: size, color: DEFAULT_RANK_ACCENT.ink },
        ]}
        allowFontScaling={false}
      >
        {String(rank).padStart(2, "0")}
      </Text>
    );
  }
  return (
    <View style={[styles.medallionWrap, { width: size }]}>
      <View
        style={[
          styles.medallion,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: tier.ring,
            backgroundColor: tier.tint,
          },
        ]}
      >
        <Text
          style={[
            styles.medallionNumber,
            { color: tier.ink, fontSize: size * 0.42 },
          ]}
          allowFontScaling={false}
        >
          {rank}
        </Text>
      </View>
      <Text style={[styles.medallionLabel, { color: tier.ink }]}>
        {tier.label}
      </Text>
    </View>
  );
}

function LeaderFish({
  speciesId,
  featured = false,
}: {
  speciesId: PierCastSpeciesId | null;
  featured?: boolean;
}) {
  const fish = speciesId ? coreSpeciesImage(speciesId) : null;
  return fish ? (
    <Image
      source={fish}
      style={featured ? styles.leaderFishFeatured : styles.leaderFish}
      resizeMode="contain"
    />
  ) : (
    <Ionicons
      name="fish-outline"
      size={featured ? 52 : 30}
      color={paper.dashboardBlueLight}
    />
  );
}

/**
 * Rank 01 — the picture-first moment. Lined-paper plate, specimen fish,
 * oversized Space Mono score, band-colored strength meter.
 */
function LeaderSpotlight({
  entry,
  onOpen,
}: {
  entry: PierCastLeaderboardEntry;
  onOpen: () => void;
}) {
  const speciesId = entry.date?.headline.drivingSpeciesId ?? null;
  const score = entry.score;
  const band = score !== null ? dashboardBandStyleForScore(score) : null;
  const rankAccent = MEDAL_TIERS[1];
  return (
    <Pressable
      style={({ pressed }) => [
        styles.leaderCard,
        { borderColor: rankAccent.edge },
        pressed && styles.standingPressed,
      ]}
      onPress={() => {
        hapticSelection();
        onOpen();
      }}
      accessibilityRole="button"
      accessibilityLabel={`View ${entry.city.displayName} PierCast, ranked first today`}
    >
      <View
        style={[
          styles.leaderRail,
          { backgroundColor: band?.bg ?? paper.dashboardLine },
        ]}
      />
      <CornerMarkSet color={paper.red} size={13} thickness={2} inset={9} />

      <View style={styles.leaderTopline}>
        <View style={styles.leaderCrown}>
          <Ionicons name="trophy" size={10} color="#7A5807" />
          <Text style={styles.leaderCrownText}>TODAY&apos;S LEADER</Text>
        </View>
        <RankMedallion rank={1} size={30} />
      </View>

      <View style={styles.leaderBody}>
        <View style={styles.leaderCopy}>
          <Text
            style={[styles.leaderStateTag, { color: rankAccent.ink }]}
          >
            {STATE_LABELS[entry.city.stateCode].toUpperCase()}
          </Text>
          <Text
            style={styles.leaderCity}
            numberOfLines={1}
            allowFontScaling={false}
          >
            {entry.city.displayName}
          </Text>
          <Text style={styles.leaderPier} numberOfLines={1}>
            {primaryPierName(entry.city)}
          </Text>
        </View>
        <View style={styles.leaderFishStage}>
          <LeaderFish speciesId={speciesId} featured />
        </View>
      </View>

      <View style={styles.leaderScoreBlock}>
        <View style={styles.leaderScoreLine}>
          <Text
            style={[
              styles.leaderScoreValue,
              { color: band?.verdictColor ?? paper.dashboardInk },
            ]}
            allowFontScaling={false}
          >
            {score?.toFixed(1) ?? "—"}
          </Text>
          <Text style={styles.leaderScoreMax}>/10</Text>
          <View style={styles.leaderScoreSpacer} />
          {band ? (
            <View
              style={[
                styles.bandChip,
                { backgroundColor: band.chipBg, borderColor: band.chipBorder },
              ]}
            >
              <View
                style={[styles.bandChipDot, { backgroundColor: band.bg }]}
              />
              <Text
                style={[styles.bandChipText, { color: band.verdictColor }]}
              >
                {band.label.toUpperCase()}
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.leaderSpecies} numberOfLines={1}>
          {speciesId
            ? `${SPECIES_LABELS[speciesId].toUpperCase()} · STRONGEST TODAY`
            : "RATING PENDING"}
        </Text>
        <View style={styles.meterTrack}>
          <View
            style={[
              styles.meterFill,
              {
                width: meterWidth(score),
                backgroundColor: band?.bg ?? paper.dashboardBlue,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.leaderCta}>
        <Text style={styles.leaderCtaText}>OPEN FULL PIERCAST</Text>
        <Ionicons name="arrow-forward" size={12} color={paper.dashboardInk} />
      </View>
    </Pressable>
  );
}

/** Ranks 02+ — uniform ledger rows with their own strength meters. */
function StandingRow({
  entry,
  rank,
  onOpen,
}: {
  entry: PierCastLeaderboardEntry;
  rank: number | null;
  onOpen: () => void;
}) {
  const speciesId = entry.date?.headline.drivingSpeciesId ?? null;
  const score = entry.score;
  const band = score !== null ? dashboardBandStyleForScore(score) : null;
  const tier = rank === null ? null : MEDAL_TIERS[rank];
  const rankAccent = tier ?? DEFAULT_RANK_ACCENT;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.standingRow,
        tier && { borderWidth: 1.5, borderColor: tier.edge },
        pressed && styles.standingPressed,
      ]}
      onPress={() => {
        hapticSelection();
        onOpen();
      }}
      accessibilityRole="button"
      accessibilityLabel={rank === null
        ? `View ${entry.city.displayName} PierCast, rating pending`
        : `View ${entry.city.displayName} PierCast, ranked ${rank}`}
    >
      <View
        style={[
          styles.standingEdge,
          { backgroundColor: band?.bg ?? paper.dashboardLine },
        ]}
      />
      <RankMedallion rank={rank} />
      <View style={styles.standingFishStage}>
        <LeaderFish speciesId={speciesId} />
      </View>
      <View style={styles.standingIdentity}>
        <Text
          style={[styles.standingStateTag, { color: rankAccent.ink }]}
        >
          {STATE_LABELS[entry.city.stateCode].toUpperCase()}
        </Text>
        <Text style={styles.standingCity} numberOfLines={1}>
          {entry.city.displayName}
        </Text>
        <Text style={styles.standingSpecies} numberOfLines={1}>
          {speciesId ? SPECIES_LABELS[speciesId] : "Rating unavailable"}
        </Text>
        <View style={styles.meterTrackSmall}>
          <View
            style={[
              styles.meterFill,
              {
                width: meterWidth(score),
                backgroundColor: band?.bg ?? paper.dashboardLine,
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.standingScoreCol}>
        <Text
          style={[
            styles.standingScoreValue,
            { color: band?.verdictColor ?? paper.dashboardInk },
          ]}
          allowFontScaling={false}
        >
          {score?.toFixed(1) ?? "—"}
        </Text>
        <Text style={styles.standingScoreMax}>/10</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={14}
        color={paper.dashboardMuted}
      />
    </Pressable>
  );
}

function PierCastLanding({
  catalog,
  outlook,
  supplementalOutlooks,
  onOpenCity,
}: {
  catalog: PierCastCatalogResponse;
  outlook:
    | PierCastReviewOutlookResponse
    | PierCastV3ReviewOutlookResponse
    | PierCastLeaderboardResponse;
  supplementalOutlooks: readonly PierCastReviewOutlookResponse[];
  onOpenCity: (cityId: string) => void;
}) {
  const standingsOutlook = useMemo(
    () => projectPierCastStandings(outlook, supplementalOutlooks),
    [outlook, supplementalOutlooks],
  );
  const stateCodes = useMemo(
    () =>
      Array.from(new Set(catalog.cities.map((city) => city.stateCode))).sort(
        (left, right) => STATE_LABELS[left].localeCompare(STATE_LABELS[right]),
      ),
    [catalog.cities],
  );
  const [selectedState, setSelectedState] = useState<
    PierCastCatalogCityRead["stateCode"]
  >(stateCodes[0] ?? "MI");
  const stateCities = useMemo(
    () =>
      catalog.cities
        .filter((city) => city.stateCode === selectedState)
        .sort((left, right) =>
          left.displayName.localeCompare(right.displayName),
        ),
    [catalog.cities, selectedState],
  );
  const [browseCityId, setBrowseCityId] = useState<string | null>(
    stateCities[0]?.cityId ?? null,
  );
  useEffect(() => {
    if (stateCities.some((city) => city.cityId === browseCityId)) return;
    setBrowseCityId(stateCities[0]?.cityId ?? null);
  }, [browseCityId, stateCities]);

  const leaderboard = useMemo(
    () =>
      catalog.cities
        .filter((city) =>
          catalog.mode === "review" || city.releaseStatus === "public_research"
        )
        .map((city) => {
          const cityOutlook = standingsOutlook.cities.find(
            (candidate) => candidate.cityId === city.cityId,
          );
          const date = cityOutlook?.dates[0] ?? null;
          return {
            city,
            date,
            score: date ? scoreValue(date) : null,
            rankingScore: date ? rankingScoreValue(date) : null,
          };
        })
        .sort(
          (left, right) =>
            (right.rankingScore ?? -1) - (left.rankingScore ?? -1) ||
            left.city.displayName.localeCompare(right.city.displayName),
        ),
    [catalog.cities, catalog.mode, standingsOutlook.cities],
  );

  /** cityId → today's headline score, so the finder can echo the standings. */
  const scoreByCityId = useMemo(() => {
    const map = new Map<string, number>();
    leaderboard.forEach((entry) => {
      if (entry.score !== null) map.set(entry.city.cityId, entry.score);
    });
    return map;
  }, [leaderboard]);

  const rankByCityId = useMemo(() => {
    const map = new Map<string, number>();
    leaderboard
      .filter((entry) => entry.score !== null)
      .forEach((entry, index) => map.set(entry.city.cityId, index + 1));
    return map;
  }, [leaderboard]);

  const rankedLeaderboard = useMemo(
    () => leaderboard.filter((entry) => entry.score !== null),
    [leaderboard],
  );
  const [rankedCityLimit, setRankedCityLimit] = useState(5);
  const visibleRankedLeaderboard = useMemo(
    () => rankedLeaderboard.slice(0, rankedCityLimit),
    [rankedCityLimit, rankedLeaderboard],
  );
  const hasMoreRankedCities = rankedLeaderboard.length > 5;
  const showingExpandedLeaderboard = rankedCityLimit > 5;
  const pendingLeaderboard = useMemo(
    () => leaderboard.filter((entry) => entry.score === null),
    [leaderboard],
  );

  const selectedBrowseCity =
    stateCities.find((city) => city.cityId === browseCityId) ??
    stateCities[0] ??
    null;
  const selectedBrowseIsPreview = Boolean(
    selectedBrowseCity?.releaseStatus === "research_only" &&
      catalog.mode === "public",
  );
  const forecastDate = leaderboard[0]?.date?.localDate;
  const dailyScoreSnapshot = standingsOutlook.dailyScoreSnapshot ?? null;
  const isV3Review = "mode" in outlook && outlook.mode === "v3_shadow_review";
  const standingsReady =
    leaderboard.length > 0 &&
    leaderboard.every((entry) => entry.score !== null);
  const selectedStateAccent = stateAccent(selectedState);

  return (
    <>
      <View style={styles.leaderboardCard}>
        {/* ── Navy scoreboard masthead ─────────────────────────────── */}
        <View style={styles.standingsMasthead}>
          <StandingsBackdrop />
          <TopographicLines
            style={StyleSheet.absoluteFill}
            color={paper.dashboardBlueSky}
            count={7}
          />
          <SectionEyebrow color={paper.gold} size={9} tracking={2.6}>
            TODAY ON LAKE MICHIGAN
          </SectionEyebrow>
          <Text style={styles.standingsTitle} allowFontScaling={false}>
            THE STANDINGS
          </Text>
          <Text style={styles.standingsSubtitle}>
            Every supported pier city, ranked by its strongest main species rating.
          </Text>
          <Text
            style={[
              styles.ratingExplanationCopy,
              styles.standingsDisclosure,
            ]}
          >
            {PIER_CAST_RESEARCH_DISCLOSURE}
          </Text>
          <BandSpectrum />
          <View style={styles.standingsMeta}>
            <View style={styles.standingsMetaCell}>
              <Text style={styles.standingsMetaLabel}>FORECAST DATE</Text>
              <Text style={styles.standingsMetaValue}>
                {fullDateLabel(forecastDate)}
              </Text>
            </View>
            <View style={styles.standingsMetaDivider} />
            <View style={styles.standingsMetaCell}>
              <Text style={styles.standingsMetaLabel}>PIER CITIES SCORED</Text>
              <Text style={styles.standingsMetaValue}>
                {`${String(rankedLeaderboard.length).padStart(2, "0")}/${String(leaderboard.length).padStart(2, "0")}`}
              </Text>
            </View>
          </View>
        </View>

        {leaderboard.length > 0 ? (
          <View style={styles.standingsBody}>
            {visibleRankedLeaderboard[0] ? (
              <LeaderSpotlight
                entry={visibleRankedLeaderboard[0]}
                onOpen={() =>
                  onOpenCity(visibleRankedLeaderboard[0].city.cityId)
                }
              />
            ) : null}

            {visibleRankedLeaderboard.length > 1 ? (
              <View style={styles.standingsDivider}>
                <View style={styles.standingsDividerRule} />
                <Text style={styles.standingsDividerText}>
                  CHASING THE LEADER
                </Text>
                <View style={styles.standingsDividerRule} />
              </View>
            ) : null}

            <View style={styles.standingsList}>
              {visibleRankedLeaderboard.slice(1).map((entry, index) => (
                <StandingRow
                  key={entry.city.cityId}
                  entry={entry}
                  rank={index + 2}
                  onOpen={() => onOpenCity(entry.city.cityId)}
                />
              ))}
            </View>

            {hasMoreRankedCities ? (
              <View style={styles.standingsSeeMoreRow}>
                <View style={styles.standingsSeeMoreRule} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    showingExpandedLeaderboard
                      ? "See fewer leaderboard cities"
                      : "See more leaderboard cities"
                  }
                  accessibilityHint={
                    showingExpandedLeaderboard
                      ? "Collapses the leaderboard to the top 5 cities"
                      : `Shows the top ${Math.min(10, rankedLeaderboard.length)} cities`
                  }
                  hitSlop={8}
                  onPress={() => {
                    hapticSelection();
                    setRankedCityLimit((current) =>
                      current > 5 ? 5 : 10,
                    );
                  }}
                  style={({ pressed }) => [
                    styles.standingsSeeMore,
                    pressed && styles.standingsSeeMorePressed,
                  ]}
                >
                  <Text style={styles.standingsSeeMoreText}>
                    {showingExpandedLeaderboard ? "see less" : "see more"}
                  </Text>
                  <Ionicons
                    name={
                      showingExpandedLeaderboard
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={11}
                    color={paper.dashboardMuted}
                  />
                </Pressable>
                <View style={styles.standingsSeeMoreRule} />
              </View>
            ) : null}

            {pendingLeaderboard.length > 0 ? (
              <>
                <View style={styles.standingsDivider}>
                  <View style={styles.standingsDividerRule} />
                  <Text style={styles.standingsDividerText}>
                    AWAITING TODAY&apos;S SCORE
                  </Text>
                  <View style={styles.standingsDividerRule} />
                </View>
                <View style={styles.standingsList}>
                  {pendingLeaderboard.map((entry) => (
                    <StandingRow
                      key={entry.city.cityId}
                      entry={entry}
                      rank={null}
                      onOpen={() => onOpenCity(entry.city.cityId)}
                    />
                  ))}
                </View>
              </>
            ) : null}
          </View>
        ) : (
          <View style={styles.standingsPending}>
            <View style={styles.standingsPendingIcon}>
              <Ionicons
                name="hourglass-outline"
                size={22}
                color={paper.dashboardBlue}
              />
            </View>
            <Text style={styles.standingsPendingTitle}>
              Today&apos;s standings are being prepared.
            </Text>
            <Text style={styles.standingsPendingCopy}>
              No city is ranked until every released city score is complete
              for the Lake Michigan day.
            </Text>
          </View>
        )}

        <View style={styles.rankingNote}>
          <Ionicons name="ribbon-outline" size={13} color="#167B78" />
          <Text style={styles.rankingNoteText}>
            {isV3Review
              ? "Scores refresh daily as new lake forecasts become available."
              : standingsReady
              ? dailyScoreSnapshot
                ? supplementalOutlooks.length > 0
                  ? `Released cities use locked ${fullDateLabel(dailyScoreSnapshot.lakeDate)} main species ratings; shadow-review cities use their latest complete main species rating.`
                  : `Each city is ranked by its strongest main species rating for ${fullDateLabel(dailyScoreSnapshot.lakeDate)}. Live weather and water data keep refreshing.`
                : "Every released city has a complete current score. Live pier conditions continue to refresh."
              : `${pendingLeaderboard.length} ${pendingLeaderboard.length === 1 ? "released city is" : "released cities are"} awaiting a complete score; every city remains listed in the finder.`}
          </Text>
        </View>
      </View>

      {/* ── Pier finder ────────────────────────────────────────────── */}
      <View style={styles.pierFinderCard}>
        <TopographicLines
          style={StyleSheet.absoluteFill}
          color={paper.dashboardBlue}
          count={6}
        />
        <CornerMarkSet color={paper.red} size={14} thickness={2} inset={11} />
        <View style={styles.pierFinderHeading}>
          <SectionEyebrow color={paper.red} size={9} tracking={2.4}>
            CHOOSE YOUR SHORELINE
          </SectionEyebrow>
          <Text style={styles.pierFinderTitle}>Find your PierCast.</Text>
          <Text style={styles.pierFinderSubtitle}>
            Move from lake-wide standings to the report built for your pier.
          </Text>
        </View>

        <View style={styles.finderStepRow}>
          <Text style={styles.finderStepNumber}>01</Text>
          <Text style={styles.finderStepLabel}>SELECT A STATE</Text>
          <View style={styles.finderStepRule} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stateRail}
        >
          {stateCodes.map((stateCode) => {
            const selected = stateCode === selectedState;
            const accent = stateAccent(stateCode);
            const count = catalog.cities.filter(
              (city) => city.stateCode === stateCode,
            ).length;
            return (
              <Pressable
                key={stateCode}
                style={({ pressed }) => [
                  styles.statePill,
                  {
                    borderColor: selected
                      ? accent.accent
                      : paper.dashboardLine,
                    backgroundColor: selected ? accent.accent : "#FFFFFF",
                  },
                  pressed && styles.standingPressed,
                ]}
                onPress={() => {
                  hapticSelection();
                  setSelectedState(stateCode);
                  setBrowseCityId(
                    catalog.cities.find((city) => city.stateCode === stateCode)
                      ?.cityId ?? null,
                  );
                }}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <View
                  style={[
                    styles.stateCodeTile,
                    {
                      backgroundColor: selected
                        ? "rgba(255,255,255,0.22)"
                        : accent.tint,
                      borderColor: selected
                        ? "rgba(255,255,255,0.45)"
                        : accent.accent,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stateCodeText,
                      { color: selected ? accent.onAccent : accent.deep },
                    ]}
                  >
                    {stateCode}
                  </Text>
                </View>
                <View style={styles.statePillCopy}>
                  <Text
                    style={[
                      styles.statePillName,
                      { color: selected ? accent.onAccent : paper.dashboardInk },
                    ]}
                  >
                    {STATE_LABELS[stateCode]}
                  </Text>
                  <Text
                    style={[
                      styles.statePillCount,
                      {
                        color: selected
                          ? "rgba(255,255,255,0.78)"
                          : paper.dashboardMuted,
                      },
                    ]}
                  >
                    {count} {count === 1 ? "CITY" : "CITIES"}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.finderStepRow}>
          <Text style={styles.finderStepNumber}>02</Text>
          <Text style={styles.finderStepLabel}>SELECT A PIER CITY</Text>
          <View
            style={[
              styles.finderStepRule,
              { backgroundColor: selectedStateAccent.accent, opacity: 0.35 },
            ]}
          />
          <Text
            style={[
              styles.finderStepScope,
              { color: selectedStateAccent.deep },
            ]}
          >
            {STATE_LABELS[selectedState].toUpperCase()}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cityRailPad}
        >
          {stateCities.map((city) => {
            const selected = city.cityId === selectedBrowseCity?.cityId;
            const isPreview = city.releaseStatus === "research_only" &&
              catalog.mode === "public";
            const accent = stateAccent(city.stateCode);
            const pierCount = city.structures.filter(
              (structure) => structure.disposition !== "excluded",
            ).length;
            const cityScore = scoreByCityId.get(city.cityId) ?? null;
            const cityRank = rankByCityId.get(city.cityId) ?? null;
            const band =
              cityScore !== null ? dashboardBandStyleForScore(cityScore) : null;
            return (
              <Pressable
                key={city.cityId}
                style={({ pressed }) => [
                  styles.cityCard,
                  selected && styles.cityCardSelected,
                  selected && { backgroundColor: accent.tint },
                  pressed && styles.standingPressed,
                ]}
                onPress={() => {
                  hapticSelection();
                  setBrowseCityId(city.cityId);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <View
                  style={[
                    styles.cityCardRail,
                    { backgroundColor: accent.accent },
                    !selected && styles.cityCardRailIdle,
                  ]}
                />
                <View style={styles.cityCardTopline}>
                  <View
                    style={[
                      styles.cityCardDot,
                      { backgroundColor: accent.accent },
                    ]}
                  />
                  <Text
                    style={[styles.cityCardState, { color: accent.deep }]}
                  >
                    {city.stateCode}
                  </Text>
                  <View style={styles.cityCardToplineSpacer} />
                  {isPreview ? (
                    <Text style={styles.cityCardRank}>PREVIEW</Text>
                  ) : cityRank !== null ? (
                    <Text style={styles.cityCardRank}>
                      #{cityRank}
                    </Text>
                  ) : (
                    <Text style={styles.cityCardRank}>
                      —
                    </Text>
                  )}
                </View>

                <Text style={styles.cityCardName} numberOfLines={2}>
                  {city.displayName}
                </Text>
                <Text style={styles.cityCardPier} numberOfLines={1}>
                  {primaryPierName(city)}
                </Text>

                <View style={styles.cityCardFooter}>
                  <Text style={styles.cityCardPiers}>
                    {pierCount} {pierCount === 1 ? "PIER" : "PIERS"}
                  </Text>
                  {band && cityScore !== null ? (
                    <View
                      style={[
                        styles.cityCardScore,
                        {
                          backgroundColor: band.chipBg,
                          borderColor: band.chipBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.cityCardScoreText,
                          { color: band.verdictColor },
                        ]}
                      >
                        {cityScore.toFixed(1)}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.cityCardScoreIdle}>
                      <Text style={styles.cityCardScoreIdleText}>
                        {isPreview ? "SOON" : "—"}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          style={({ pressed }) => [
            styles.loadCityButton,
            selectedBrowseCity && {
              backgroundColor: selectedStateAccent.deep,
            },
            !selectedBrowseCity && styles.loadCityButtonDisabled,
            pressed && selectedBrowseCity && styles.loadCityButtonPressed,
          ]}
          onPress={() => {
            if (!selectedBrowseCity) return;
            hapticSelection();
            onOpenCity(selectedBrowseCity.cityId);
          }}
          disabled={!selectedBrowseCity}
          accessibilityRole="button"
        >
          <Text style={styles.loadCityButtonText}>
            {selectedBrowseCity
              ? `${selectedBrowseIsPreview ? "VIEW" : "OPEN"} ${selectedBrowseCity.displayName.toUpperCase()}${selectedBrowseIsPreview ? " PREVIEW" : ""}`
              : "SELECT A CITY"}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </>
  );
}

function PierCastCoverageRequest({
  profile,
  user,
  city,
  cities,
}: {
  profile: ReturnType<typeof useAuthStore.getState>["profile"];
  user: ReturnType<typeof useAuthStore.getState>["user"];
  city: PierCastCatalogCityRead | null;
  cities: PierCastCatalogCityRead[];
}) {
  return (
    <FeedbackCard
      featureName="PierCast Coverage"
      topic="feature"
      variant="request"
      eyebrow="EXPAND PIERCAST"
      title="Which pier city should we add next?"
      body="Request a state, city, pier, or species. Your requests help decide where PierCast expands next."
      actionLabel="REQUEST COVERAGE"
      profile={profile}
      user={user}
      contextLines={[
        "Request category: PierCast coverage",
        city
          ? `Current PierCast city: ${city.displayName}, ${city.stateCode}`
          : "Current PierCast view: Daily leaderboard",
        city
          ? `Current covered structures: ${city.structures
              .filter((structure) => structure.disposition !== "excluded")
              .map((structure) => structure.displayName)
              .join(", ")}`
          : `Currently supported states: ${Array.from(
              new Set(cities.map((candidate) => candidate.stateCode)),
            ).join(", ")}`,
      ]}
    />
  );
}

/**
 * Skeleton "bone". Callers pass a shared pulse so one Animated.Value drives
 * every bone in a screen rather than one loop per placeholder.
 */
function SkeletonBone({
  pulse,
  width,
  height,
  radius = 4,
  tone = "#0A1B2E",
  style,
}: {
  pulse: Animated.Value;
  width: DimensionValue;
  height: number;
  radius?: number;
  tone?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: tone,
          opacity: pulse,
        },
        style,
      ]}
    />
  );
}

/** A report card with its header bones already laid in. */
function SkeletonSection({
  pulse,
  titleWidth,
  children,
}: {
  pulse: Animated.Value;
  titleWidth: number;
  children: ReactNode;
}) {
  return (
    <View style={styles.reportCard}>
      <View style={styles.sectionHead}>
        <View style={styles.sectionHeadCopy}>
          <SkeletonBone pulse={pulse} width={108} height={8} radius={3} />
          <SkeletonBone
            pulse={pulse}
            width={titleWidth}
            height={19}
            radius={5}
            style={styles.skeletonGapSm}
          />
        </View>
        <SkeletonBone pulse={pulse} width={62} height={20} radius={3} />
      </View>
      <View style={styles.skeletonRule} />
      {children}
    </View>
  );
}

/** Full PierCast report placeholder, matching the real report's rhythm. */
function PierCastReportSkeleton() {
  const pulse = usePaperBonePulse({ from: 0.14, to: 0.34 });
  const pulseOnInk = usePaperBonePulse({ from: 0.22, to: 0.5 });
  return (
    <>
      <View style={styles.heroCard}>
        <View style={styles.heroMasthead}>
          <StandingsBackdrop />
          <SkeletonBone
            pulse={pulseOnInk}
            tone="#FFFFFF"
            width={158}
            height={8}
            radius={3}
          />
          <SkeletonBone
            pulse={pulseOnInk}
            tone="#FFFFFF"
            width={214}
            height={29}
            radius={6}
            style={styles.skeletonGapLg}
          />
          <SkeletonBone
            pulse={pulseOnInk}
            tone="#FFFFFF"
            width={150}
            height={10}
            radius={3}
            style={styles.skeletonGapSm}
          />
          <View style={styles.skeletonHeroScoreRow}>
            <SkeletonBone
              pulse={pulseOnInk}
              tone="#FFFFFF"
              width={96}
              height={34}
              radius={6}
            />
            <View style={styles.heroScoreSpacer} />
            <SkeletonBone
              pulse={pulseOnInk}
              tone="#FFFFFF"
              width={72}
              height={22}
              radius={3}
            />
          </View>
          <SkeletonBone
            pulse={pulseOnInk}
            tone="#FFFFFF"
            width="100%"
            height={6}
            radius={3}
            style={styles.skeletonGapSm}
          />
        </View>
        <View style={styles.heroPlate}>
          <View style={styles.heroFishStage}>
            <SkeletonBone pulse={pulse} width={100} height={50} radius={9} />
          </View>
          <View style={styles.heroPlateCopy}>
            <SkeletonBone pulse={pulse} width={94} height={8} radius={3} />
            <SkeletonBone
              pulse={pulse}
              width={136}
              height={18}
              radius={4}
              style={styles.skeletonGapSm}
            />
            <SkeletonBone
              pulse={pulse}
              width={112}
              height={9}
              radius={3}
              style={styles.skeletonGapSm}
            />
          </View>
        </View>
      </View>

      <SkeletonSection pulse={pulse} titleWidth={146}>
        <View style={styles.forecastGrid}>
          {SKELETON_FIVE.map((key) => (
            <View key={key} style={styles.skeletonForecastTile}>
              <SkeletonBone pulse={pulse} width={26} height={7} radius={3} />
              <SkeletonBone
                pulse={pulse}
                width={18}
                height={13}
                radius={3}
                style={styles.skeletonGapSm}
              />
              <SkeletonBone
                pulse={pulse}
                width="100%"
                height={40}
                radius={0}
                style={styles.skeletonGapMd}
              />
            </View>
          ))}
        </View>
      </SkeletonSection>

      <SkeletonSection pulse={pulse} titleWidth={182}>
        <View style={styles.skeletonStack}>
          {SKELETON_FOUR.map((key) => (
            <View key={key} style={styles.skeletonSpeciesCard}>
              <SkeletonBone pulse={pulse} width={62} height={44} radius={8} />
              <View style={styles.skeletonSpeciesCopy}>
                <SkeletonBone pulse={pulse} width="70%" height={14} radius={4} />
                <SkeletonBone pulse={pulse} width={76} height={15} radius={3} />
                <SkeletonBone pulse={pulse} width="100%" height={6} radius={3} />
              </View>
              <SkeletonBone pulse={pulse} width={38} height={22} radius={4} />
            </View>
          ))}
        </View>
      </SkeletonSection>

      <SkeletonSection pulse={pulse} titleWidth={158}>
        <View style={styles.nearshoreMetricGrid}>
          {SKELETON_THREE.map((key) => (
            <View key={key} style={styles.skeletonMetricTile}>
              <SkeletonBone pulse={pulse} width={46} height={8} radius={3} />
              <SkeletonBone
                pulse={pulse}
                width={72}
                height={20}
                radius={4}
                style={styles.skeletonGapSm}
              />
              <SkeletonBone
                pulse={pulse}
                width={60}
                height={8}
                radius={3}
                style={styles.skeletonGapSm}
              />
            </View>
          ))}
        </View>
        <SkeletonBone pulse={pulse} width="100%" height={34} radius={9} />
        <View style={styles.skeletonDayRow}>
          {SKELETON_FIVE.map((key) => (
            <SkeletonBone
              key={key}
              pulse={pulse}
              width="100%"
              height={38}
              radius={7}
              style={styles.skeletonDayChip}
            />
          ))}
        </View>
        <SkeletonBone pulse={pulse} width="100%" height={96} radius={9} />
      </SkeletonSection>

      <SkeletonSection pulse={pulse} titleWidth={196}>
        <View style={styles.tempReadRow}>
          {SKELETON_THREE.map((key) => (
            <View key={key} style={styles.skeletonTempRead}>
              <SkeletonBone pulse={pulse} width={44} height={8} radius={3} />
              <SkeletonBone
                pulse={pulse}
                width={58}
                height={20}
                radius={4}
                style={styles.skeletonGapSm}
              />
              <SkeletonBone
                pulse={pulse}
                width={50}
                height={8}
                radius={3}
                style={styles.skeletonGapSm}
              />
            </View>
          ))}
        </View>
        <SkeletonBone
          pulse={pulse}
          width="100%"
          height={186}
          radius={10}
          style={styles.skeletonGapMd}
        />
      </SkeletonSection>
    </>
  );
}

function CityReport({
  city,
  outlook,
  weather,
  weatherLoading,
  conditionsUpdatedAt,
}: {
  city: PierCastCatalogCityRead;
  outlook: PierCastReviewCityOutlookRead | null;
  weather: PierCastHourlyWeatherPoint[];
  weatherLoading: boolean;
  conditionsUpdatedAt: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => setSelectedIndex(0), [city.cityId]);
  const displayDates = useMemo(
    () => outlook?.dates.map(presentPierCastDate) ?? [],
    [outlook],
  );
  const date = displayDates[selectedIndex] ?? displayDates[0] ?? null;
  const allPoints = useMemo(() => {
    const points = new Map<string, PierCastReviewTemperaturePointRead>();
    if (outlook?.temperatureTimeline?.length) {
      for (const point of outlook.temperatureTimeline) {
        points.set(point.validAt, point);
      }
      return [...points.values()].sort((a, b) =>
        a.validAt.localeCompare(b.validAt),
      );
    }
    const forecastDates = outlook?.dates ?? [];
    const firstInterval = forecastDates[0]?.requestedInterval;
    const lastInterval = forecastDates[forecastDates.length - 1]
      ?.requestedInterval;
    const rangeStart = Date.parse(firstInterval?.start ?? "");
    const rangeEnd = Date.parse(lastInterval?.end ?? "");
    for (const point of outlook?.dates.flatMap(
      (item) => item.waterTemperature.points,
    ) ?? []) {
      const validAt = Date.parse(point.validAt);
      if (
        (Number.isFinite(rangeStart) && validAt < rangeStart) ||
        (Number.isFinite(rangeEnd) && validAt > rangeEnd)
      ) continue;
      points.set(point.validAt, point);
    }
    return [...points.values()].sort((a, b) =>
      a.validAt.localeCompare(b.validAt),
    );
  }, [outlook]);

  if (!outlook || !date) {
    return (
      <View style={styles.messageCard}>
        <Ionicons
          name="cloud-offline-outline"
          size={24}
          color={paper.dashboardBlue}
        />
        <Text style={styles.messageTitle}>{city.displayName}</Text>
        <Text style={styles.messageCopy}>
          A fresh five-day forecast could not be loaded.
        </Text>
      </View>
    );
  }

  return (
    <>
      <PierCastHero city={city} date={date} />
      <ReportSection
        eyebrow="DAILY PIER READ"
        title="Five-Day Outlook"
        badge="SCORE / 10"
      >
        <DailyForecastStrip
          dates={displayDates}
          selectedIndex={selectedIndex}
          weather={weather}
          onSelect={(index) => {
            if (index === selectedIndex) return;
            hapticSelection();
            setSelectedIndex(index);
          }}
        />
      </ReportSection>
      <SpeciesBoard key={`${city.cityId}:${date.localDate}`} date={date} />
      <HourlyConditions
        dates={displayDates}
        timeline={allPoints}
        weather={weather}
        conditionsUpdatedAt={conditionsUpdatedAt}
        weatherLoading={weatherLoading}
      />
      <TemperaturePanel date={date} allPoints={allPoints} />
      <WaterTemperatureShifts
        summary={outlook.temperatureEvents}
        timezone={outlook.timezone}
        referenceAt={conditionsUpdatedAt}
      />
      <PiersCovered city={city} />
    </>
  );
}

export default function PierCastReviewScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const admin = isAdminEmail(user?.email);
  const [catalog, setCatalog] = useState<PierCastCatalogResponse | null>(null);
  const [outlook, setOutlook] = useState<
    | PierCastReviewOutlookResponse
    | PierCastV3ReviewOutlookResponse
    | PierCastLeaderboardResponse
    | null
  >(null);
  const [cityReport, setCityReport] = useState<PierCastReviewOutlookResponse | null>(null);
  const [savedReport, setSavedReport] = useState<PierCastReviewOutlookResponse | null>(null);
  const [paywall, setPaywall] = useState(false);
  const requestedCity = useRef<string | null>(null);
  const openingCity = useRef(false);
  const accountId = useRef(user?.id);
  accountId.current = user?.id;
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const pageScrollRef = useRef<ScrollView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<PierCastHourlyWeatherPoint[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Opening a city (or switching to a nearby port) should start the report at
  // its hero, not wherever the previous screen happened to be scrolled to.
  useEffect(() => {
    pageScrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [selectedCityId]);

  const load = useCallback(async (options?: { silent?: boolean }) => {
    const userId = user?.id;
    const silent = options?.silent === true;
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const nextCatalog = silent ? null : await (admin ? fetchPierCastOwnerReviewCatalog() : fetchPierCastCatalog());
      if (accountId.current !== userId) return;
      if (nextCatalog) setCatalog(nextCatalog);
      if (!admin && nextCatalog?.cities.length === 0) { setOutlook(null); return; }
      const nextOutlook = await (admin
        ? fetchPierCastOwnerV3ReviewOutlook()
        : fetchPierCastLeaderboard());
      if (accountId.current !== userId) return;
      if (!admin && userId && !silent) {
        void fetchSavedPierCastReport().then(saved => {
          if (accountId.current === userId) setSavedReport(saved.report);
        }).catch(() => {});
      }
      if (nextCatalog) setCatalog(nextCatalog);
      setOutlook(nextOutlook);
      if (nextCatalog) {
        setSelectedCityId((current) =>
          nextCatalog.cities.some((city) => city.cityId === current)
            ? current
            : null,
        );
      }
      setError(null);
    } catch (caught) {
      if (!silent) {
        setError(
          caught instanceof PierCastRequestError
            ? caught.message
            : caught instanceof Error
              ? caught.message
              : "PierCast could not be loaded.",
        );
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [admin, user?.id]);

  useEffect(() => {
    setSelectedCityId(null); setCityReport(null); setSavedReport(null);
    setOutlook(null); setCatalog(null); setPaywall(false); requestedCity.current = null;
  }, [user?.id]);

  const openCity = useCallback(async (cityId: string, silent = false) => {
    if (admin) { setSelectedCityId(cityId); return; }
    const city = catalog?.cities.find(c => c.cityId === cityId);
    if (city?.releaseStatus === "research_only") {
      if (!silent) {
        setCityReport(null);
        setSelectedCityId(cityId);
        setError(null);
      }
      return;
    }
    if (openingCity.current) return;
    const userId = user?.id;
    if (!silent) requestedCity.current = cityId;
    const claimed = savedReport?.cities[0];
    const auth = useAuthStore.getState();
    if (claimed && city && pierTrialRequiresUpgrade(
      getEffectiveTier(auth.profile, auth.user?.email) === "free",
      { cityId: claimed.cityId, date: claimed.dates[0]?.localDate ?? "" }, cityId,
      new Intl.DateTimeFormat("en-CA", { timeZone: city.timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()),
    )) { if (!silent) setPaywall(true); return; }
    // Automatic refresh must never swallow an explicit city/paywall tap.
    if (!silent) openingCity.current = true;
    try {
      const report = await fetchPierCastCityReport(cityId);
      if (accountId.current !== userId || (!silent && requestedCity.current !== cityId)) return;
      if (silent) {
        setCityReport(current => current?.cities[0]?.cityId === cityId ? report : current);
        return;
      }
      setCityReport(report); setSelectedCityId(cityId); setError(null);
      const auth = useAuthStore.getState();
      if (getEffectiveTier(auth.profile, auth.user?.email) === "free") setSavedReport(report);
      if (!silent) void fetchSavedPierCastReport().then(saved => {
        if (accountId.current === userId) setSavedReport(saved.report);
      }).catch(() => {});
    } catch (caught) {
      if (accountId.current !== userId || (!silent && requestedCity.current !== cityId)) return;
      if (caught instanceof PierCastRequestError && caught.code === "subscription_required") {
        if (!silent) {
          setPaywall(true);
          void fetchSavedPierCastReport().then(saved => {
            if (accountId.current === userId) setSavedReport(saved.report);
          }).catch(() => {});
        }
      } else if (!silent) setError(caught instanceof Error ? caught.message : "Report could not load.");
    } finally { if (!silent) openingCity.current = false; }
  }, [admin, user?.id, savedReport, catalog]);
  useEffect(() => {
    if (admin || !selectedCityId) return;
    // Refresh immediately when a report opens or the response contract changes;
    // the interval then keeps modeled conditions current in the background.
    void openCity(selectedCityId, true);
    const timer = setInterval(() => void openCity(selectedCityId, true), PIER_CAST_CONDITIONS_REFRESH_MS);
    return () => clearInterval(timer);
  }, [admin, selectedCityId, openCity]);

  useFocusEffect(
    useCallback(() => {
      void load();
      const refreshTimer = setInterval(
        () => void load({ silent: true }),
        PIER_CAST_CONDITIONS_REFRESH_MS,
      );
      return () => clearInterval(refreshTimer);
    }, [load]),
  );

  const selectedCity =
    catalog?.cities.find((city) => city.cityId === selectedCityId) ?? null;
  const selectedOutlook =
    (admin
      ? (outlook && "mode" in outlook ? outlook.cities : []).find(
          (city) => city.cityId === selectedCityId,
        )
      : cityReport?.cities.find((city) => city.cityId === selectedCityId)) ??
    null;
  const supplementalStandingsOutlooks: readonly PierCastReviewOutlookResponse[] = [];
  const nearbyCities = useMemo(
    () =>
      selectedCity && catalog
        ? [...catalog.cities].sort(
            (left, right) =>
              distanceBetweenCities(selectedCity, left) -
                distanceBetweenCities(selectedCity, right) ||
              left.displayName.localeCompare(right.displayName),
          )
        : [],
    [catalog, selectedCity],
  );

  useEffect(() => {
    const location = selectedCity?.waterTemperatureSource?.configuredLocation;
    if (!location) {
      setWeather([]);
      setWeatherLoading(false);
      return;
    }
    const controller = new AbortController();
    let disposed = false;
    const timeout = setTimeout(() => controller.abort(), 12_000);
    setWeather([]);
    setWeatherLoading(true);
    const point = location.referencePoint;
    void fetchPierCastHourlyWeather({
      latitude: point.latitude,
      longitude: point.longitude,
      signal: controller.signal,
    })
      .then((result) => setWeather(result.points))
      .catch((caught) => {
        if (!(caught instanceof Error && caught.name === "AbortError"))
          setWeather([]);
      })
      .finally(() => {
        clearTimeout(timeout);
        if (!disposed) setWeatherLoading(false);
      });
    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [outlook?.generatedAt, selectedCity]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <View style={styles.navHeader}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            if (selectedCityId) {
              hapticSelection();
              requestedCity.current = null;
              setError(null);
              setSelectedCityId(null);
              return;
            }
            router.back();
          }}
          accessibilityRole="button"
          accessibilityLabel={
            selectedCityId ? "Back to PierCast leaderboard" : "Back"
          }
        >
          <Ionicons name="chevron-back" size={25} color="#FFFFFF" />
        </Pressable>
        <View style={styles.navTitleWrap} pointerEvents="none">
          <Text style={styles.navEyebrow}>GREAT LAKES · PIER FORECAST</Text>
          <Text style={styles.navTitle}>PIERCAST</Text>
        </View>
        <View style={styles.navSpacer} />
      </View>
      <ScrollView
        ref={pageScrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!admin && catalog?.cities.length === 0 ? (
          <View style={styles.messageCard}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color={paper.dashboardBlue}
            />
            <Text style={styles.messageTitle}>PierCast is coming soon</Text>
          </View>
        ) : loading ? (
          <PierCastReportSkeleton />
        ) : error ? (
          <View style={styles.messageCard}>
            <Ionicons
              name="alert-circle-outline"
              size={24}
              color={paper.bandTough}
            />
            <Text style={styles.messageTitle}>PierCast could not load</Text>
            <Text style={styles.messageCopy}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={() => void load()}>
              <Text style={styles.retryButtonText}>TRY AGAIN</Text>
            </Pressable>
          </View>
        ) : catalog && outlook ? (
          selectedCity ? (
            <>
              <View style={styles.portSelector}>
                <View style={styles.portHeading}>
                  <View style={styles.portHeadingIdentity}>
                    <View style={styles.portHeadingIcon}>
                      <Ionicons
                        name="navigate-outline"
                        size={17}
                        color="#167B78"
                      />
                    </View>
                    <View>
                      <Text style={styles.eyebrow}>NEARBY PORTS</Text>
                      <Text style={styles.portTitle}>
                        Explore the shoreline
                      </Text>
                    </View>
                  </View>
                  <View style={styles.portCountPill}>
                    <Text style={styles.portCount}>
                      {String(nearbyCities.length).padStart(2, "0")} PORTS
                    </Text>
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cityRail}
                >
                  {nearbyCities.map((city) => {
                    const selected = city.cityId === selectedCity.cityId;
                    const distance = distanceBetweenCities(selectedCity, city);
                    return (
                      <Pressable
                        key={city.cityId}
                        style={[
                          styles.cityChip,
                          selected && styles.cityChipSelected,
                        ]}
                        onPress={() => {
                          if (selected) return;
                          hapticSelection();
                          void openCity(city.cityId);
                        }}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                      >
                        <Ionicons
                          name={selected ? "location" : "location-outline"}
                          size={12}
                          color={selected ? "#FFFFFF" : "#167B78"}
                        />
                        <View>
                          <Text
                            style={[
                              styles.cityChipText,
                              selected && styles.cityChipTextSelected,
                            ]}
                          >
                            {city.displayName}
                          </Text>
                          <Text
                            style={[
                              styles.cityChipDistance,
                              selected && styles.cityChipDistanceSelected,
                            ]}
                          >
                            {selected
                              ? "CURRENT"
                              : city.releaseStatus === "research_only" && !admin
                                ? "RESEARCH PREVIEW"
                              : Number.isFinite(distance)
                                ? `${Math.round(distance)} MI AWAY`
                                : city.stateCode}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
              <Text style={styles.ratingExplanationCopy}>{PIER_CAST_RESEARCH_DISCLOSURE}</Text>
              {!admin && selectedCity.releaseStatus === "research_only" ? (
                <>
                  <View style={styles.messageCard}>
                    <Ionicons name="compass-outline" size={24} color={paper.dashboardBlue} />
                    <Text style={styles.messageTitle}>{selectedCity.displayName}</Text>
                    <Text style={styles.messageCopy}>
                      This city is in PierCast research preview. Its piers are listed below; daily ratings and reports are still being reviewed.
                    </Text>
                  </View>
                  <PiersCovered city={selectedCity} />
                </>
              ) : (
                <>
                  <CityReport
                    city={selectedCity}
                    outlook={selectedOutlook}
                    weather={weather}
                    weatherLoading={weatherLoading}
                    conditionsUpdatedAt={admin
                      ? outlook.generatedAt
                      : cityReport?.generatedAt ?? outlook.generatedAt}
                  />
                  <RatingExplanation
                    winterNotice={catalog.winterOpenWaterNotice}
                    showWinterNotice={Boolean(
                      selectedOutlook?.dates.some(
                        (date) => date.openWaterNoticeApplies,
                      ),
                    )}
                  />
                </>
              )}
              <PierCastCoverageRequest
                profile={profile}
                user={user}
                city={selectedCity}
                cities={catalog.cities}
              />
            </>
          ) : (
            <>
              {!admin && savedReport && <Pressable style={styles.retryButton} onPress={() => {
                const cityId = savedReport.cities[0]?.cityId;
                if (cityId) { requestedCity.current = cityId; setCityReport(savedReport); setSelectedCityId(cityId); }
              }}><Text style={styles.retryButtonText}>OPEN SAVED REPORT · {savedReport.cities[0]?.dates[0]?.localDate}</Text></Pressable>}
              <PierCastLanding
                catalog={catalog}
                outlook={outlook}
                supplementalOutlooks={supplementalStandingsOutlooks}
                onOpenCity={(cityId) => {
                  hapticSelection();
                  void openCity(cityId);
                }}
              />
              <PierCastCoverageRequest
                profile={profile}
                user={user}
                city={null}
                cities={catalog.cities}
              />
            </>
          )
        ) : null}
      </ScrollView>
      <SubscribePrompt visible={paywall} onDismiss={() => setPaywall(false)} onUnlocked={() => {
        setPaywall(false); if (requestedCity.current) void openCity(requestedCity.current);
      }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── Water Temperature Shifts ───────────────────────────────────────
  flipEventList: {
    gap: 9,
  },
  flipEvent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: paper.dashboardLine,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
  },
  flipEventHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flipEventDirectionIcon: {
    width: 27,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  flipEventHeading: {
    minWidth: 0,
    flex: 1,
  },
  flipEventRelativeTiming: {
    marginBottom: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    lineHeight: 9,
    letterSpacing: 0.75,
  },
  flipEventTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 15,
    lineHeight: 18,
    color: paper.dashboardInk,
  },
  flipSeverityChip: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 4,
  },
  flipSeverityText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: 0.8,
    color: "#FFFFFF",
  },
  flipEventMetrics: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 11,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: paper.dashboardLine,
  },
  flipEventMetric: {
    minWidth: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  flipEventMetricRule: {
    width: 1,
    backgroundColor: paper.dashboardLine,
  },
  flipEventMetricValue: {
    fontFamily: paperFonts.monoBold,
    fontSize: 12,
    lineHeight: 16,
    color: paper.dashboardInk,
  },
  flipEventMetricLabel: {
    marginTop: 2,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.8,
    lineHeight: 8,
    letterSpacing: 0.45,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  flipEventTiming: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 8,
    backgroundColor: "#F8FAFA",
  },
  flipEventTimingLabel: {
    marginBottom: 7,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    lineHeight: 9,
    letterSpacing: 0.9,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  flipEventTimingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flipEventMoment: {
    minWidth: 0,
    flex: 1,
  },
  flipEventMomentEnd: {
    alignItems: "flex-end",
  },
  flipEventMomentLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    lineHeight: 9,
    letterSpacing: 0.8,
    color: paper.dashboardMuted,
  },
  flipEventMomentDate: {
    marginTop: 2,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    lineHeight: 11,
    letterSpacing: 0.25,
    color: paper.dashboardInk,
  },
  flipEventMomentClock: {
    marginTop: 2,
    fontFamily: paperFonts.monoBold,
    fontSize: 10.5,
    lineHeight: 14,
    color: paper.dashboardInk,
  },
  flipEventTimingArrow: {
    width: 27,
    height: 27,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  flipEventBoundary: {
    marginTop: 3,
    fontFamily: paperFonts.body,
    fontSize: 9.5,
    lineHeight: 13,
    color: "#775D31",
  },

  flipExplainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 13,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "rgba(30,116,107,0.20)",
    borderRadius: 9,
    backgroundColor: "rgba(30,116,107,0.055)",
  },
  flipExplainerText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 11.5,
    lineHeight: 17,
    color: "#3F5A5C",
  },
  flipCoverageNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 7,
    backgroundColor: "#FFF7E8",
  },
  flipCoverageText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 10.5,
    lineHeight: 15,
    color: "#775D31",
  },
  flipEmpty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 26,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 9,
    backgroundColor: "#FBFCFC",
  },
  flipEmptyTitle: {
    marginTop: 7,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1,
    color: paper.dashboardMuted,
  },
  flipEmptyCopy: {
    maxWidth: 280,
    marginTop: 6,
    fontFamily: paperFonts.body,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  // ── Skeleton placeholders ──────────────────────────────────────────
  skeletonGapSm: { marginTop: 6 },
  skeletonGapMd: { marginTop: 10 },
  skeletonGapLg: { marginTop: 13 },
  skeletonRule: {
    height: 2,
    width: 34,
    marginTop: 10,
    marginBottom: 14,
    borderRadius: 1,
    backgroundColor: "rgba(10,27,46,0.12)",
  },
  skeletonStack: { gap: 8 },
  skeletonHeroScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: 14,
  },
  skeletonForecastTile: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    alignItems: "center",
    overflow: "hidden",
    paddingTop: 8,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  skeletonSpeciesCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 11,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  skeletonSpeciesCopy: {
    minWidth: 0,
    flex: 1,
    gap: 6,
  },
  skeletonMetricTile: {
    minWidth: 0,
    flex: 1,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingTop: 13,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 9,
    backgroundColor: "#FBFCFC",
  },
  skeletonDayRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 11,
    marginBottom: 11,
  },
  skeletonDayChip: {
    minWidth: 0,
    flex: 1,
  },
  skeletonTempRead: {
    minWidth: 0,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 8,
    backgroundColor: "#FBFCFC",
  },

  // Quiet in-column placeholders while air and wind are in flight.
  hourPendingAir: {
    width: 26,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(182,91,42,0.20)",
  },
  hourPendingWind: {
    width: 36,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(30,116,107,0.20)",
  },
  hourWindText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 0.2,
    color: "#1E746B",
  },
  hourlyHeadingCount: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 0.6,
    color: paper.dashboardMuted,
  },
  // ── Day jump chips ─────────────────────────────────────────────────
  dayJumpRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 11,
  },
  dayJumpChip: {
    minWidth: 0,
    flex: 1,
    alignItems: "center",
    gap: 1,
    paddingVertical: 7,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
  },
  dayJumpChipSelected: {
    borderColor: paper.dashboardInk,
    backgroundColor: paper.dashboardInk,
  },
  dayJumpChipText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 0.9,
    color: paper.dashboardMuted,
  },
  dayJumpChipTextSelected: {
    color: "#FFFFFF",
  },
  dayJumpChipDate: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 13,
    lineHeight: 16,
    color: paper.dashboardInk,
  },
  dayJumpChipDateSelected: {
    color: "#FFFFFF",
  },

  // ── Fixed water scale legend ───────────────────────────────────────
  scaleLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 7,
    backgroundColor: "#FBFCFC",
  },
  scaleLegendLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.2,
    color: paper.dashboardInk,
  },
  scaleLegendEnd: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    color: paper.dashboardMuted,
  },
  scaleLegendBar: {
    flex: 1,
    flexDirection: "row",
    height: 5,
    gap: 2,
  },
  scaleLegendSegment: {
    flex: 1,
    height: "100%",
    borderRadius: 2.5,
  },

  // ── Per-hour thermometer ───────────────────────────────────────────
  thermo: {
    alignItems: "center",
    marginVertical: 1,
  },
  thermoTrack: {
    width: 7,
    height: 38,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 3.5,
    borderWidth: 1,
    borderColor: "rgba(10,27,46,0.10)",
    backgroundColor: "rgba(10,27,46,0.05)",
  },
  thermoFill: {
    width: "100%",
    borderRadius: 3,
  },
  thermoBulb: {
    width: 12,
    height: 12,
    marginTop: -4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  // ── Shared section chrome ──────────────────────────────────────────
  sectionHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  sectionHeadCopy: {
    minWidth: 0,
    flex: 1,
  },
  sectionEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.4,
  },
  sectionTitle: {
    marginTop: 3,
    fontFamily: paperFonts.display,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.4,
    color: paper.dashboardInk,
  },
  sectionBadge: {
    marginTop: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 3,
    backgroundColor: "#F6F8F9",
  },
  sectionBadgeText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.1,
    color: paper.dashboardMuted,
  },
  sectionRule: {
    height: 2,
    width: 34,
    marginTop: 10,
    marginBottom: 14,
    borderRadius: 1,
  },

  // ── City hero ──────────────────────────────────────────────────────
  heroCard: {
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 14,
    backgroundColor: "#FEFEFC",
    ...paperShadows.hard,
  },
  heroMasthead: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: paper.dashboardInk,
  },
  heroCity: {
    marginTop: 8,
    fontFamily: paperFonts.display,
    fontSize: 33,
    lineHeight: 36,
    letterSpacing: -0.5,
    textAlign: "center",
    color: "#FFFFFF",
  },
  heroPierLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 5,
  },
  heroStateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroPier: {
    fontFamily: paperFonts.body,
    fontSize: 11.5,
    lineHeight: 16,
    color: "rgba(255,255,255,0.66)",
  },
  heroScoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    alignSelf: "stretch",
    gap: 3,
    marginTop: 14,
  },
  heroScoreValue: {
    fontFamily: paperFonts.monoBold,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -2,
    color: "#FFFFFF",
  },
  heroScorePending: {
    fontSize: 18,
    lineHeight: 44,
    letterSpacing: 2,
  },
  heroScoreMax: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  heroScoreSpacer: {
    flex: 1,
  },
  heroBandChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroBandChipText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: "#FFFFFF",
  },
  heroMeterTrack: {
    alignSelf: "stretch",
    height: 6,
    marginTop: 9,
    overflow: "hidden",
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  heroRatingHint: {
    alignSelf: "stretch",
    marginTop: 8,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.2,
    color: "rgba(255,255,255,0.42)",
  },
  heroPlate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: "#FFFFFF",
  },
  heroFishStage: {
    width: 122,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  heroFishImage: {
    width: "100%",
    height: "100%",
  },
  heroPlateCopy: {
    minWidth: 0,
    flex: 1,
  },
  heroPlateLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.3,
    color: paper.dashboardBlue,
  },
  heroPlateSpecies: {
    marginTop: 2,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 19,
    lineHeight: 23,
    letterSpacing: -0.3,
    color: paper.dashboardInk,
  },
  heroPlateDetail: {
    marginTop: 3,
    fontFamily: paperFonts.body,
    fontSize: 10.5,
    lineHeight: 14,
    color: paper.dashboardMuted,
  },

  // ── Five-day strip ─────────────────────────────────────────────────
  forecastTileDaySelected: {
    color: paper.dashboardInk,
  },

  // ── Species board ──────────────────────────────────────────────────
  speciesIndex: {
    width: 18,
    fontFamily: paperFonts.monoBold,
    fontSize: 11,
    letterSpacing: -0.2,
    color: paper.dashboardMuted,
  },

  // ── Nearshore metric tiles ─────────────────────────────────────────
  nearshoreMetricRail: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 3,
  },

  // ── Freshness line ─────────────────────────────────────────────────
  freshnessText: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 10,
    color: "#53676D",
  },

  // ── Hourly rail ────────────────────────────────────────────────────
  hourlyHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 9,
  },
  hourlyHeadingText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.3,
    color: paper.dashboardInk,
  },
  hourlyRail: {
    flexDirection: "row",
    gap: HOUR_COLUMN_GAP,
  },
  hourColumn: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
  },
  hourColumnNow: {
    borderColor: paper.dashboardLine,
    backgroundColor: "#F5FAFC",
  },
  hourTime: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 0.7,
    color: paper.dashboardMuted,
  },
  hourTimeNow: {
    color: paper.dashboardInk,
  },
  hourWater: {
    fontFamily: paperFonts.monoBold,
    fontSize: 12.5,
    letterSpacing: -0.5,
  },
  hourMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  hourMetaText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardMuted,
  },

  // ── Temperature reads + chart legend ───────────────────────────────
  tempReadRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  tempRead: {
    minWidth: 0,
    flex: 1,
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 8,
    backgroundColor: "#FBFCFC",
  },
  tempReadNow: {
    borderColor: "rgba(42,110,150,0.38)",
    backgroundColor: "#EFF6FA",
  },
  tempReadLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.1,
    color: paper.dashboardBlue,
  },
  tempReadValue: {
    fontFamily: paperFonts.monoBold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -1,
    color: paper.dashboardInk,
  },
  tempReadDetail: {
    fontFamily: paperFonts.body,
    fontSize: 9.5,
    color: paper.dashboardMuted,
  },
  chartLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardHair,
  },
  chartLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  chartLegendSwatch: {
    width: 10,
    height: 3,
    borderRadius: 1.5,
  },
  chartLegendText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1,
    color: paper.dashboardMuted,
  },
  chartLegendSpacer: {
    flex: 1,
  },
  chartLegendCaption: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 0.8,
    color: paper.dashboardMuted,
  },
  safe: { flex: 1, backgroundColor: paper.dashboardInk },
  navHeader: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: paper.dashboardInk,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  pressed: { opacity: 0.55, transform: [{ scale: 0.97 }] },
  navTitleWrap: {
    position: "absolute",
    left: 62,
    right: 62,
    top: 12,
    bottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  navEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 1.8,
    color: "rgba(255,255,255,0.58)",
  },
  navTitle: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    lineHeight: 27,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  navSpacer: { width: 38 },
  scroll: { flex: 1, backgroundColor: paper.dashboardCream },
  content: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 72,
    gap: 16,
  },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    lineHeight: 12,
    letterSpacing: 1.55,
    color: paper.dashboardBlue,
  },
  standingPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.992 }],
  },
  leaderFish: {
    width: 62,
    height: 40,
  },
  leaderFishFeatured: {
    width: 112,
    height: 66,
  },

  // ── Leaderboard shell ──────────────────────────────────────────────
  leaderboardCard: {
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 14,
    backgroundColor: "#FEFEFC",
    ...paperShadows.hard,
  },

  // Navy scoreboard masthead
  standingsMasthead: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 0,
    backgroundColor: paper.dashboardInk,
  },

  // Five-band rating ramp under the masthead title
  spectrumBlock: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    gap: 9,
    marginTop: 15,
  },
  spectrumEnd: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.1,
    color: "rgba(255,255,255,0.5)",
  },
  spectrumBar: {
    flex: 1,
    flexDirection: "row",
    height: 5,
    gap: 3,
  },
  spectrumSegment: {
    flex: 1,
    height: "100%",
    borderRadius: 2.5,
  },

  // Struck medal disc — ranks 01–03 only
  medallionWrap: {
    alignItems: "center",
    gap: 3,
  },
  medallion: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  medallionNumber: {
    fontFamily: paperFonts.monoBold,
    letterSpacing: -0.5,
  },
  medallionLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 0.8,
  },
  standingsTitle: {
    marginTop: 9,
    fontFamily: paperFonts.display,
    fontSize: 34,
    lineHeight: 37,
    letterSpacing: -0.6,
    textAlign: "center",
    color: "#FFFFFF",
  },
  standingsSubtitle: {
    maxWidth: 300,
    marginTop: 7,
    fontFamily: paperFonts.body,
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: "center",
    color: "rgba(255,255,255,0.62)",
  },
  standingsDisclosure: {
    width: "100%",
    maxWidth: 320,
    textAlign: "center",
  },
  standingsMeta: {
    width: "100%",
    flexDirection: "row",
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.14)",
  },
  standingsMetaCell: {
    minWidth: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  standingsMetaDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  standingsMetaLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.3,
    color: "rgba(255,255,255,0.48)",
  },
  standingsMetaValue: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 13,
    lineHeight: 16,
    textAlign: "center",
    color: "#FFFFFF",
  },

  standingsBody: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 14,
  },

  // ── Rank 01 spotlight ──────────────────────────────────────────────
  leaderCard: {
    position: "relative",
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    ...paperShadows.hard,
  },
  leaderRail: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 4,
  },
  leaderTopline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
  },
  leaderCrown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(184,137,26,0.45)",
    borderRadius: 3,
    backgroundColor: "#FDF5E1",
  },
  leaderCrownText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.35,
    color: "#7A5807",
  },
  leaderBody: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  leaderCopy: {
    minWidth: 0,
    flex: 1,
    paddingRight: 6,
  },
  leaderStateTag: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.4,
  },
  leaderCity: {
    marginTop: 2,
    fontFamily: paperFonts.display,
    fontSize: 26,
    lineHeight: 29,
    letterSpacing: -0.7,
    color: paper.dashboardInk,
  },
  leaderPier: {
    marginTop: 2,
    fontFamily: paperFonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: paper.dashboardMuted,
  },
  leaderFishStage: {
    width: 116,
    height: 66,
    alignItems: "center",
    justifyContent: "center",
  },
  leaderScoreBlock: {
    marginTop: 2,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardHair,
  },
  leaderScoreLine: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },
  leaderScoreValue: {
    fontFamily: paperFonts.monoBold,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -1.6,
  },
  leaderScoreMax: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 12,
    color: paper.dashboardMuted,
  },
  leaderScoreSpacer: {
    flex: 1,
  },
  bandChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 3,
  },
  bandChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bandChipText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.2,
  },
  leaderSpecies: {
    marginTop: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.15,
    color: paper.dashboardBlue,
  },
  meterTrack: {
    height: 6,
    marginTop: 8,
    overflow: "hidden",
    borderRadius: 4,
    backgroundColor: "rgba(10,27,46,0.07)",
  },
  meterTrackSmall: {
    height: 5,
    marginTop: 6,
    overflow: "hidden",
    borderRadius: 3,
    backgroundColor: "rgba(10,27,46,0.07)",
  },
  meterFill: {
    height: "100%",
    borderRadius: 4,
  },
  leaderCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 10,
    marginHorizontal: -16,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardHair,
    backgroundColor: "rgba(10,27,46,0.035)",
  },
  leaderCtaText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.5,
    color: paper.dashboardInk,
  },

  // ── Divider + ranked rows ──────────────────────────────────────────
  standingsDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 2,
  },
  standingsDividerRule: {
    flex: 1,
    height: 1,
    backgroundColor: paper.dashboardLine,
  },
  standingsDividerText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.5,
    color: paper.dashboardMuted,
  },
  standingsList: {
    gap: 8,
  },
  standingsSeeMoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  standingsSeeMoreRule: {
    flex: 1,
    height: 1,
    backgroundColor: paper.dashboardHair,
  },
  standingsSeeMore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  standingsSeeMorePressed: {
    opacity: 0.7,
  },
  standingsSeeMoreText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 10.5,
    lineHeight: 14,
    color: paper.dashboardMuted,
  },
  standingRow: {
    position: "relative",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 14,
    paddingRight: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  standingEdge: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  standingRankNumeral: {
    fontFamily: paperFonts.monoBold,
    fontSize: 20,
    lineHeight: 34,
    letterSpacing: -0.8,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  standingFishStage: {
    width: 64,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  standingIdentity: {
    minWidth: 0,
    flex: 1,
  },
  standingStateTag: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.3,
  },
  standingCity: {
    marginTop: 1,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: -0.2,
    color: paper.dashboardInk,
  },
  standingSpecies: {
    marginTop: 1,
    fontFamily: paperFonts.body,
    fontSize: 10.5,
    lineHeight: 14,
    color: paper.dashboardMuted,
  },
  standingScoreCol: {
    alignItems: "flex-end",
  },
  standingScoreValue: {
    fontFamily: paperFonts.monoBold,
    fontSize: 22,
    lineHeight: 25,
    letterSpacing: -1,
  },
  standingScoreMax: {
    marginTop: -1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardMuted,
  },

  // ── Pending state ──────────────────────────────────────────────────
  standingsPending: {
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 28,
    paddingTop: 26,
    paddingBottom: 22,
  },
  standingsPendingIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 23,
    backgroundColor: "#F3F8FB",
  },
  standingsPendingTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 17,
    lineHeight: 22,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  standingsPendingCopy: {
    maxWidth: 300,
    fontFamily: paperFonts.body,
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: "center",
    color: paper.dashboardMuted,
  },

  rankingNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardHair,
    backgroundColor: "rgba(22,123,120,0.055)",
  },
  rankingNoteText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.bodyMedium,
    fontSize: 10,
    lineHeight: 14.5,
    color: "#53676D",
  },

  // ── Pier finder ────────────────────────────────────────────────────
  pierFinderCard: {
    position: "relative",
    overflow: "hidden",
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 14,
    backgroundColor: "#FEFEFC",
    ...paperShadows.hard,
  },
  pierFinderHeading: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 2,
  },
  pierFinderTitle: {
    marginTop: 6,
    fontFamily: paperFonts.display,
    fontSize: 30,
    lineHeight: 33,
    letterSpacing: -0.6,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  pierFinderSubtitle: {
    maxWidth: 300,
    marginTop: 6,
    fontFamily: paperFonts.body,
    fontSize: 11,
    lineHeight: 15,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  finderStepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  finderStepNumber: {
    fontFamily: paperFonts.display,
    fontSize: 19,
    lineHeight: 21,
    color: paper.red,
  },
  finderStepLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: paper.dashboardInk,
  },
  finderStepRule: {
    flex: 1,
    height: 1,
    backgroundColor: paper.dashboardLine,
  },
  finderStepScope: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.2,
  },

  // State rail
  stateRail: {
    flexDirection: "row",
    gap: 9,
    paddingRight: 4,
    paddingVertical: 2,
  },
  statePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 56,
    paddingLeft: 9,
    paddingRight: 15,
    borderWidth: 1.5,
    borderRadius: 9,
  },
  stateCodeTile: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 6,
  },
  stateCodeText: {
    fontFamily: paperFonts.monoBold,
    fontSize: 13,
    letterSpacing: 0.4,
  },
  statePillCopy: {
    gap: 2,
  },
  statePillName: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 15,
    lineHeight: 18,
  },
  statePillCount: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.15,
  },

  // City rail
  cityRailPad: {
    flexDirection: "row",
    gap: 9,
    paddingRight: 4,
    paddingVertical: 2,
  },
  cityCard: {
    position: "relative",
    overflow: "hidden",
    width: 164,
    paddingHorizontal: 12,
    paddingTop: 13,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  cityCardSelected: {
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
  },
  cityCardRail: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 3,
  },
  cityCardRailIdle: {
    opacity: 0.35,
  },
  cityCardTopline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  cityCardDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cityCardState: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.3,
  },
  cityCardToplineSpacer: {
    flex: 1,
  },
  cityCardRank: {
    fontFamily: paperFonts.monoBold,
    fontSize: 10,
    letterSpacing: 0.2,
    color: paper.dashboardMuted,
  },
  cityCardName: {
    marginTop: 7,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: -0.3,
    color: paper.dashboardInk,
  },
  cityCardPier: {
    marginTop: 2,
    fontFamily: paperFonts.body,
    fontSize: 10,
    lineHeight: 14,
    color: paper.dashboardMuted,
  },
  cityCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardHair,
  },
  cityCardPiers: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.1,
    color: paper.dashboardMuted,
  },
  cityCardScore: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 3,
  },
  cityCardScoreText: {
    fontFamily: paperFonts.monoBold,
    fontSize: 12,
    letterSpacing: -0.3,
  },
  cityCardScoreIdle: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 3,
    backgroundColor: "#F7F7F5",
  },
  cityCardScoreIdleText: {
    fontFamily: paperFonts.monoBold,
    fontSize: 12,
    color: paper.dashboardMuted,
  },

  loadCityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    minHeight: 52,
    marginTop: 2,
    borderRadius: 9,
    backgroundColor: paper.dashboardInk,
  },
  loadCityButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.994 }],
  },
  loadCityButtonDisabled: {
    backgroundColor: "#B9C2C8",
  },
  loadCityButtonText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 1.5,
    color: "#FFFFFF",
  },
  portSelector: {
    gap: 10,
    overflow: "hidden",
    paddingTop: 12,
    paddingBottom: 10,
    borderWidth: 1,
    borderTopWidth: 3,
    borderColor: paper.dashboardLine,
    borderTopColor: "#2E9B97",
    borderRadius: 13,
    backgroundColor: "#FDFDFC",
    ...paperShadows.hard,
  },
  portHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 12,
  },
  portHeadingIdentity: {
    minWidth: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  portHeadingIcon: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#E6F5F2",
  },
  portTitle: {
    marginTop: 1,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 16,
    lineHeight: 19,
    color: paper.dashboardInk,
  },
  portCountPill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#EAF2F7",
  },
  portCount: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 0.7,
    color: paper.dashboardBlue,
  },
  cityRail: {
    gap: 7,
    paddingLeft: 12,
    paddingRight: 14,
    paddingVertical: 1,
  },
  cityChip: {
    minHeight: 44,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: "#F7F8F6",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  cityChipSelected: {
    backgroundColor: paper.dashboardBlue,
    borderColor: paper.dashboardBlue,
    shadowColor: paper.dashboardBlue,
    shadowOpacity: 0.18,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
  },
  cityChipText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 12,
    color: paper.dashboardInk,
  },
  cityChipTextSelected: { color: "#FFFFFF" },
  cityChipDistance: {
    marginTop: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.2,
    letterSpacing: 0.45,
    color: paper.dashboardMuted,
  },
  cityChipDistanceSelected: { color: "rgba(255,255,255,0.67)" },
  reportCard: {
    overflow: "hidden",
    padding: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 13,
    backgroundColor: "#FDFDFC",
    ...paperShadows.hard,
  },
  forecastGrid: { flexDirection: "row", width: "100%", gap: 5 },
  forecastTile: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    alignItems: "stretch",
    paddingTop: 8,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 6,
  },
  forecastTileSelected: {
    borderColor: paper.dashboardInk,
    borderWidth: 1.5,
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  forecastTileDay: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 0.8,
    color: paper.dashboardMuted,
    lineHeight: 10,
    textAlign: "center",
  },
  forecastTileDate: {
    marginTop: 1,
    marginBottom: 8,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 15,
    lineHeight: 17,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  forecastTileScoreBlock: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  forecastTileScore: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: -0.6,
    color: paper.dashboardInk,
  },
  forecastTileScorePending: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    lineHeight: 10,
    letterSpacing: 0.45,
  },
  forecastTileHiLo: {
    paddingVertical: 5,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    textAlign: "center",
    color: paper.dashboardMuted,
    backgroundColor: "#FAFAF7",
    borderTopWidth: 1,
    borderTopColor: paper.dashboardHair,
  },
  speciesList: { gap: 8, paddingBottom: 1 },
  moreSpeciesToggle: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#EAF2F7",
  },
  moreSpeciesToggleText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 0.65,
    color: paper.dashboardBlue,
  },
  speciesCard: {
    position: "relative",
    overflow: "hidden",
    padding: 11,
    paddingLeft: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.035,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  speciesRegulationNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginBottom: 10,
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8D2A5",
    backgroundColor: "#FFF8E8",
  },
  speciesRegulationNoticeCopy: { flex: 1, minWidth: 0 },
  speciesRegulationNoticeTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 0.9,
    color: "#8A5C16",
  },
  speciesRegulationNoticeText: {
    marginTop: 3,
    fontFamily: paperFonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: paper.dashboardInk,
  },
  speciesAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 5 },
  speciesHeader: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  speciesFishStage: {
    width: 74,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  speciesFish: { width: 100, height: 64 },
  speciesIdentity: { flex: 1, minWidth: 0 },
  speciesName: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 21,
    color: paper.dashboardInk,
  },
  speciesBandPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  speciesBandDot: { width: 6, height: 6, borderRadius: 3 },
  speciesBandText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.8,
    letterSpacing: 0.8,
  },
  speciesScoreWrap: {
    flexDirection: "row",
    alignItems: "baseline",
    marginLeft: 6,
  },
  speciesScore: {
    fontFamily: paperFonts.display,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -1.2,
  },
  speciesScorePending: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    lineHeight: 12,
    letterSpacing: 0.55,
  },
  speciesScoreMax: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    color: paper.dashboardMuted,
  },
  factorRow: { flexDirection: "row", gap: 14, marginTop: 10 },
  factor: { flex: 1 },
  factorLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 4,
    marginBottom: 6,
  },
  factorLabel: {
    flex: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.05,
    lineHeight: 12,
    color: "#63727A",
  },
  factorValue: {
    fontFamily: paperFonts.monoBold,
    fontSize: 9.5,
    color: paper.dashboardInk,
  },
  nearshoreMetricGrid: { flexDirection: "row", gap: 7, marginBottom: 10 },
  freshnessStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "rgba(22,123,120,0.2)",
    borderRadius: 9,
    backgroundColor: "rgba(22,123,120,0.055)",
  },
  nearshoreMetricTile: {
    position: "relative",
    minWidth: 0,
    flex: 1,
    gap: 5,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingTop: 13,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 9,
  },
  nearshoreMetricHeading: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  nearshoreMetricLabel: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.15,
  },
  nearshoreMetricValue: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 20,
    lineHeight: 24,
    color: paper.dashboardInk,
  },
  nearshoreMetricDetail: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    lineHeight: 12,
    color: paper.dashboardMuted,
  },
  hourlyEmpty: {
    width: 260,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  hourlyEmptyText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 0.8,
    color: paper.dashboardMuted,
  },
  compactInfoCard: {
    borderRadius: 13,
    backgroundColor: "#F7FBFA",
    borderWidth: 1,
    borderTopWidth: 3,
    borderColor: "rgba(22,123,120,0.28)",
    borderTopColor: "#2E9B97",
    ...paperShadows.hard,
  },
  compactInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  compactInfoIcon: {
    width: 39,
    height: 39,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6F5F2",
    marginRight: 11,
  },
  compactInfoBody: { flex: 1 },
  compactInfoTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 18,
    color: paper.dashboardInk,
  },
  compactInfoSummary: {
    marginTop: 2,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    lineHeight: 11,
    letterSpacing: 1,
    color: "#68767D",
  },
  compactInfoContent: {
    marginHorizontal: 14,
    paddingTop: 11,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(22,123,120,0.16)",
  },
  compactInfoCopy: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: "#68767D",
  },
  collapsibleChevron: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "rgba(22,123,120,0.08)",
  },
  collapsiblePressed: {
    opacity: 0.68,
  },
  pierChips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 9 },
  pierChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#F1F4EF",
  },
  pierChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: paper.bandGood,
  },
  pierChipText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 10,
    color: paper.dashboardInk,
  },
  ratingExplanation: {
    borderRadius: 17,
    backgroundColor: "#E7F3F6",
    borderLeftWidth: 4,
    borderLeftColor: paper.dashboardBlue,
  },
  ratingExplanationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 17,
  },
  ratingExplanationTitle: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.bodyBold,
    fontSize: 15,
    color: paper.dashboardInk,
  },
  ratingExplanationChevron: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "rgba(42,110,150,0.09)",
  },
  ratingExplanationContent: {
    marginHorizontal: 17,
    paddingTop: 2,
    paddingBottom: 17,
    borderTopWidth: 1,
    borderTopColor: "rgba(42,110,150,0.13)",
  },
  ratingExplanationCopy: {
    marginTop: 8,
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: "#52666F",
  },
  winterNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(42,110,150,0.13)",
  },
  winterNoticeText: {
    flex: 1,
    fontFamily: paperFonts.bodyMedium,
    fontSize: 11.5,
    lineHeight: 16,
    color: "#73591C",
  },
  messageCard: {
    minHeight: 170,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  messageTitle: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    color: paper.dashboardInk,
  },
  messageCopy: {
    textAlign: "center",
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: paper.dashboardMuted,
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: paper.dashboardInk,
  },
  retryButtonText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1,
    color: "#FFFFFF",
  },
});
