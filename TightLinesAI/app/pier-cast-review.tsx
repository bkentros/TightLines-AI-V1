import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  CornerMarkSet,
  SectionEyebrow,
  TopographicLines,
} from "../components/paper";
import { FeedbackCard } from "../components/FeedbackCard";
import {
  PierCastMiniBar,
  PierCastScoreGauge,
  PierCastTemperatureChart,
} from "../components/pier-cast/PierCastVisuals";
import { isAdminEmail } from "../lib/adminAccess";
import {
  fetchPierCastOwnerReviewCatalog,
  fetchPierCastOwnerReviewOutlook,
  PierCastRequestError,
} from "../lib/pierCast";
import type {
  PierCastCatalogCityRead,
  PierCastCatalogResponse,
  PierCastReviewCityOutlookRead,
  PierCastReviewDateOutlookRead,
  PierCastReviewOutlookResponse,
  PierCastReviewTemperaturePointRead,
  PierCastSpeciesId,
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
import {
  getRiverRunSpeciesHeroScale,
  getRiverRunSpeciesImage,
} from "../lib/riverRunSpeciesImages";
import { hapticSelection } from "../lib/safeHaptics";
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
};

const FISH_SCALE: Partial<Record<PierCastSpeciesId, number>> = {
  chinook_salmon: 1.38,
  coho_salmon: 1.4,
  steelhead: 1.08,
  brown_trout: 0.9,
};

const HOURLY_CONDITION_CARD_WIDTH = 116;
const PIER_CAST_CONDITIONS_REFRESH_MS = 15 * 60 * 1000;

const STATE_LABELS: Record<PierCastCatalogCityRead["stateCode"], string> = {
  MI: "Michigan",
  WI: "Wisconsin",
};

function coreSpeciesImage(speciesId: PierCastSpeciesId) {
  return getRiverRunSpeciesImage(
    speciesId === "brown_trout" ? "lake_run_brown_trout" : speciesId,
  );
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

function scoreValue(date: PierCastReviewDateOutlookRead): number | null {
  return date.headline.overall.status === "available"
    ? date.headline.overall.displayScore
    : null;
}

function rankingScoreValue(date: PierCastReviewDateOutlookRead): number | null {
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
        const accent = score === null ? "#AAB2B6" : scoreAccentColor(score);
        const selected = index === selectedIndex;
        const air = airRanges.get(date.localDate);
        return (
          <Pressable
            key={date.localDate}
            style={[
              styles.forecastTile,
              selected && styles.forecastTileSelected,
            ]}
            onPress={() => onSelect(index)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${index === 0 ? "Today" : parts.day}, ${parts.month} ${parts.date}, ${score === null ? "rating unavailable" : `${score.toFixed(1)} out of 10`}`}
          >
            <View style={styles.forecastTileHead}>
              <Text style={styles.forecastTileDay}>
                {index === 0 ? "TODAY" : parts.day}
              </Text>
              <Text style={styles.forecastTileDate}>{parts.date}</Text>
            </View>
            <View
              style={[
                styles.forecastTileScoreBlock,
                { backgroundColor: accent },
              ]}
            >
              <Text style={styles.forecastTileScore}>
                {score?.toFixed(1) ?? "—"}
              </Text>
            </View>
            <View style={styles.forecastTileHiLo}>
              <Text style={styles.forecastTileHiLoText}>
                {air
                  ? `${Math.round(air.high)}°/${Math.round(air.low)}°`
                  : "— / —"}
              </Text>
            </View>
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
  const speciesId = date.headline.drivingSpeciesId;
  const fish = speciesId ? coreSpeciesImage(speciesId) : null;
  const ratingLabel =
    date.headline.overall.status === "available"
      ? date.headline.overall.label
      : "Unavailable";
  const scale = speciesId
    ? getRiverRunSpeciesHeroScale(
        speciesId === "brown_trout" ? "lake_run_brown_trout" : speciesId,
      )
    : 1;
  return (
    <View style={styles.resultHero}>
      <TopographicLines
        style={StyleSheet.absoluteFill}
        color={paper.dashboardBlue}
        count={7}
      />
      <CornerMarkSet color={paper.red} size={16} thickness={2} inset={11} />
      <SectionEyebrow color={paper.red} size={10.5}>
        LAKE MICHIGAN PIER FORECAST
      </SectionEyebrow>
      <Text style={styles.resultHeroTitle} allowFontScaling={false}>
        {city.displayName.toUpperCase()}
      </Text>
      <Text style={styles.resultHeroSubtitle}>
        Five-day fishing outlook for pier-reachable salmon and trout.
      </Text>
      {fish ? (
        <View style={styles.resultFishStage} pointerEvents="none">
          <Image
            source={fish}
            style={[
              styles.resultFishImage,
              { transform: [{ scale: scale * 0.88 }] },
            ]}
            resizeMode="contain"
          />
        </View>
      ) : null}
      <View style={styles.resultHeroMeta}>
        <View style={[styles.resultHeroMetaItem, styles.resultHeroRatingItem]}>
          <PierCastScoreGauge
            score={score}
            label={ratingLabel.toUpperCase()}
            size={86}
          />
          <View style={styles.resultHeroRatingCopy}>
            <Text style={styles.resultHeroMetaLabel}>DAY RATING</Text>
            <Text style={styles.resultHeroRatingValue}>
              {score === null
                ? "Not available"
                : `${score.toFixed(1)} out of 10`}
            </Text>
            <Text style={styles.resultHeroRatingHint}>
              FinFindr opportunity
            </Text>
          </View>
        </View>
        <View style={styles.resultHeroMetaRule} />
        <View style={styles.resultHeroMetaItem}>
          <Text style={styles.resultHeroMetaLabel}>TOP TARGET</Text>
          <Text style={styles.resultHeroMetaValue} numberOfLines={2}>
            {speciesId ? SPECIES_LABELS[speciesId] : "Unavailable"}
          </Text>
        </View>
      </View>
    </View>
  );
}

function SpeciesBoard({ date }: { date: PierCastReviewDateOutlookRead }) {
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
  return (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={styles.reportHeaderIcon}>
          <Ionicons name="fish-outline" size={18} color={paper.dashboardBlue} />
        </View>
        <View style={styles.reportHeaderCopy}>
          <Text style={styles.eyebrow}>TODAY&apos;S TARGETS</Text>
          <Text style={styles.reportTitle}>Species Score Comparison</Text>
          <Text style={styles.reportSubtitle}>
            Daily pier opportunity · strongest target shown first.
          </Text>
        </View>
        <View style={styles.reportStatusBadge}>
          <Text style={styles.reportStatusText}>
            {speciesRows.length > 4
              ? `TOP 4 · ${speciesRows.length} TOTAL`
              : `${speciesRows.length} SPECIES`}
          </Text>
        </View>
      </View>
      <ScrollView
        style={speciesRows.length > 4 ? styles.speciesViewport : undefined}
        contentContainerStyle={styles.speciesList}
        nestedScrollEnabled
        showsVerticalScrollIndicator={speciesRows.length > 4}
        indicatorStyle="black"
        accessibilityLabel="Species ranked from highest to lowest score"
      >
        {speciesRows.map((species) => {
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
              : "Unavailable";
          const suitability = species.temperatureSuitabilityRange
            ? (species.temperatureSuitabilityRange[0] +
                species.temperatureSuitabilityRange[1]) /
              2
            : null;
          return (
            <View key={species.speciesId} style={styles.speciesCard}>
              <View
                style={[styles.speciesAccent, { backgroundColor: accent }]}
              />
              <View style={styles.speciesHeader}>
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
                      size={34}
                      color={paper.dashboardBlue}
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
                      { backgroundColor: band.chipBg },
                    ]}
                  >
                    <View
                      style={[
                        styles.speciesBandDot,
                        { backgroundColor: accent },
                      ]}
                    />
                    <Text
                      style={[
                        styles.speciesBandText,
                        { color: band.verdictColor },
                      ]}
                    >
                      {ratingLabel.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.speciesScoreWrap}>
                  <Text style={[styles.speciesScore, { color: accent }]}>
                    {score?.toFixed(1) ?? "—"}
                  </Text>
                  <Text style={styles.speciesScoreMax}>/10</Text>
                </View>
              </View>
              <View style={styles.factorRow}>
                <View style={styles.factor}>
                  <View style={styles.factorLabelRow}>
                    <Text style={styles.factorLabel}>Seasonal presence</Text>
                    <Text style={styles.factorValue}>
                      {species.seasonalRating?.toFixed(1) ?? "—"}/10
                    </Text>
                  </View>
                  <PierCastMiniBar
                    value={species.seasonalRating}
                    color={paper.dashboardBlue}
                  />
                </View>
                <View style={styles.factor}>
                  <View style={styles.factorLabelRow}>
                    <Text style={styles.factorLabel}>
                      Water temp suitability
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
        })}
      </ScrollView>
      {speciesRows.length > 4 ? (
        <View style={styles.speciesScrollHint}>
          <Ionicons name="chevron-down" size={13} color={paper.dashboardBlue} />
          <Text style={styles.speciesScrollHintText}>
            SCROLL TO VIEW {speciesRows.length - 4} MORE SPECIES
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function NearshoreMetricTile({
  icon,
  label,
  value,
  detail,
  accent,
  tint,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  detail: string;
  accent: string;
  tint: string;
}) {
  return (
    <View style={[styles.nearshoreMetricTile, { borderTopColor: accent }]}>
      <View style={styles.nearshoreMetricHeading}>
        <View style={[styles.nearshoreMetricIcon, { backgroundColor: tint }]}>
          <Ionicons name={icon} size={14} color={accent} />
        </View>
        <Text style={styles.nearshoreMetricLabel}>{label}</Text>
      </View>
      <Text
        style={styles.nearshoreMetricValue}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
      >
        {value}
      </Text>
      <Text style={styles.nearshoreMetricDetail} numberOfLines={1}>
        {detail}
      </Text>
    </View>
  );
}

function HourlyConditions({
  dates,
  timeline,
  weather,
  conditionsUpdatedAt,
  scoreLakeDate,
}: {
  dates: PierCastReviewDateOutlookRead[];
  timeline: PierCastReviewTemperaturePointRead[];
  weather: PierCastHourlyWeatherPoint[];
  conditionsUpdatedAt: string;
  scoreLakeDate: string | null;
}) {
  const weatherByTime = useMemo(
    () => new Map(weather.map((point) => [point.localTime, point])),
    [weather],
  );
  const timezone = dates[0]?.timezone ?? "America/Detroit";
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
  const dayGroups = useMemo(() => {
    const groups: Array<{ localDate: string; rows: typeof rows }> = [];
    for (const row of rows) {
      const localDate = row.localTime.slice(0, 10);
      const previous = groups[groups.length - 1];
      if (!previous || previous.localDate !== localDate) {
        groups.push({ localDate, rows: [row] });
      } else {
        previous.rows.push(row);
      }
    }
    return groups;
  }, [rows]);
  const previousWaterByTime = useMemo(
    () =>
      new Map(
        rows.map((row, index) => [
          row.localTime,
          index === 0 ? null : rows[index - 1]!.water,
        ]),
      ),
    [rows],
  );
  const first = rows[0] ?? null;
  const windDirection = directionLabel(
    first?.weather?.windDirectionDegrees ?? null,
  );

  return (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={styles.reportHeaderIcon}>
          <Ionicons
            name="analytics-outline"
            size={18}
            color={paper.dashboardBlue}
          />
        </View>
        <View style={styles.reportHeaderCopy}>
          <Text style={styles.eyebrow}>FIVE-DAY NEARSHORE READ</Text>
          <Text style={styles.reportTitle}>Forecast Conditions</Text>
          <Text style={styles.reportSubtitle}>
            Modeled water with hourly air and wind context.
          </Text>
        </View>
        <View style={styles.reportStatusBadge}>
          <Text style={styles.reportStatusText}>5 DAYS</Text>
        </View>
      </View>

      <View style={styles.nearshoreMetricGrid}>
        <NearshoreMetricTile
          icon="water-outline"
          label="WATER"
          value={first ? `${first.water.toFixed(1)}°F` : "—"}
          detail="Nearshore surface"
          accent={paper.dashboardBlue}
          tint="#EAF2F7"
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
          tint="#FFF0E8"
        />
        <NearshoreMetricTile
          icon="navigate-outline"
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
          tint="#E7F4F1"
        />
      </View>

      <View style={styles.freshnessStrip}>
        <View style={styles.freshnessItem}>
          <Ionicons name="refresh" size={13} color={paper.dashboardBlue} />
          <View style={styles.freshnessCopy}>
            <Text style={styles.freshnessLabel}>CONDITIONS CHECKED</Text>
            <Text style={styles.freshnessValue}>
              {formatRefreshTime(conditionsUpdatedAt, timezone)}
            </Text>
          </View>
        </View>
        <View style={styles.freshnessRule} />
        <View style={styles.freshnessItem}>
          <Ionicons name="lock-closed" size={12} color="#167B78" />
          <View style={styles.freshnessCopy}>
            <Text style={styles.freshnessLabel}>TODAY&apos;S SCORE</Text>
            <Text style={styles.freshnessValue}>
              {scoreLakeDate ? "Locked for the day" : "Snapshot preparing"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.hourlyTimelineHeading}>
        <View>
          <Text style={styles.hourlyTimelineEyebrow}>HOURLY TIMELINE</Text>
          <Text style={styles.hourlyTimelineTitle}>Now through day five</Text>
        </View>
        <View style={styles.scrollCue}>
          <Text style={styles.scrollCueText}>SCROLL</Text>
          <Ionicons
            name="arrow-forward"
            size={13}
            color={paper.dashboardBlue}
          />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.fiveDayHourlyRail}
      >
        {dayGroups.length ? (
          dayGroups.map((group, groupIndex) => {
            const parts = dateParts(group.localDate);
            return (
              <View key={group.localDate} style={styles.hourDayGroup}>
                <View
                  style={[
                    styles.hourDayHeader,
                    {
                      width: Math.max(
                        HOURLY_CONDITION_CARD_WIDTH * 2,
                        group.rows.length * HOURLY_CONDITION_CARD_WIDTH,
                      ),
                    },
                  ]}
                >
                  <View>
                    <Text style={styles.hourDayEyebrow}>
                      {groupIndex === 0
                        ? "TODAY"
                        : groupIndex === 5
                          ? "DAY FIVE"
                          : parts.day}
                    </Text>
                    <Text style={styles.hourDayTitle}>
                      {parts.month} {parts.date}, {parts.year}
                    </Text>
                  </View>
                  <Text style={styles.hourDayCount}>
                    {group.rows.length} {group.rows.length === 1 ? "READ" : "READS"}
                    {"  ·  "}
                    {formatLocalHour(group.rows[0]!.localTime)}–
                    {formatLocalHour(group.rows[group.rows.length - 1]!.localTime)}
                  </Text>
                </View>
                <View style={styles.hourCellsRow}>
                  {group.rows.map((row, index) => {
                    const direction = directionLabel(
                      row.weather?.windDirectionDegrees ?? null,
                    );
                    const isNow = groupIndex === 0 && index === 0;
                    const previousWater = previousWaterByTime.get(row.localTime);
                    const waterChange =
                      previousWater == null ? null : row.water - previousWater;
                    const trendIcon =
                      waterChange === null || Math.abs(waterChange) < 0.05
                        ? "remove-outline"
                        : waterChange > 0
                          ? "arrow-up-outline"
                          : "arrow-down-outline";
                    const trendColor =
                      waterChange === null || Math.abs(waterChange) < 0.05
                        ? paper.dashboardMuted
                        : waterChange > 0
                          ? "#B65B2A"
                          : paper.dashboardBlue;
                    return (
                      <View
                        key={row.localTime}
                        style={[
                          styles.hourCell,
                          isNow && styles.hourCellNow,
                        ]}
                      >
                        <View style={styles.hourCellHeading}>
                          <View>
                            <Text style={styles.hourCellTime}>
                              {isNow ? "NOW" : formatLocalHour(row.localTime)}
                            </Text>
                            <Text style={styles.hourCellDate}>
                              {parts.month} {parts.date}
                            </Text>
                          </View>
                          {isNow ? (
                            <View style={styles.hourCellStartBadge}>
                              <Text style={styles.hourCellStartBadgeText}>START</Text>
                            </View>
                          ) : null}
                        </View>

                        <View style={styles.hourCellWaterBlock}>
                          <View style={styles.hourCellWaterLabel}>
                            <Ionicons
                              name="water"
                              size={12}
                              color={paper.dashboardBlue}
                            />
                            <Text style={styles.hourCellWaterLabelText}>
                              WATER
                            </Text>
                          </View>
                          <Text style={styles.hourCellWater}>
                            {row.water.toFixed(1)}°F
                          </Text>
                        </View>

                        <View style={styles.hourCellMetrics}>
                          <View style={styles.hourCellMetricRow}>
                            <View style={styles.hourCellMetricLabelWrap}>
                              <Ionicons
                                name="thermometer-outline"
                                size={12}
                                color="#B65B2A"
                              />
                              <Text style={styles.hourCellAirLabel}>AIR</Text>
                            </View>
                            <Text style={styles.hourCellMetricValue}>
                              {row.weather?.airTemperatureF == null
                                ? "—"
                                : `${Math.round(row.weather.airTemperatureF)}°F`}
                            </Text>
                          </View>
                          <View style={styles.hourCellMetricRow}>
                            <View style={styles.hourCellMetricLabelWrap}>
                              <Ionicons
                                name="navigate-outline"
                                size={12}
                                color="#1E746B"
                                style={{
                                  transform: [
                                    {
                                      rotate: `${row.weather?.windDirectionDegrees ?? 0}deg`,
                                    },
                                  ],
                                }}
                              />
                              <Text style={styles.hourCellWindLabel}>WIND</Text>
                            </View>
                            <Text style={styles.hourCellMetricValue}>
                              {row.weather?.windSpeedMph == null
                                ? "—"
                                : `${direction} ${Math.round(row.weather.windSpeedMph)} mph`}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.hourCellTrendRow}>
                          <Ionicons name={trendIcon} size={11} color={trendColor} />
                          <Text
                            style={[styles.hourCellTrendText, { color: trendColor }]}
                            numberOfLines={1}
                          >
                            {waterChange === null
                              ? "FORECAST START"
                              : Math.abs(waterChange) < 0.05
                                ? "STEADY FROM PRIOR"
                                : `${Math.abs(waterChange).toFixed(1)}° FROM PRIOR`}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.hourlyEmpty}>
            <Text style={styles.hourlyEmptyText}>
              HOURLY CONDITIONS UNAVAILABLE
            </Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.hourlyLegend}>
        <View style={styles.hourlyLegendItem}>
          <Ionicons name="water" size={10} color={paper.dashboardBlue} />
          <Text style={styles.hourlyLegendText}>WATER °F</Text>
        </View>
        <View style={styles.hourlyLegendItem}>
          <Ionicons name="thermometer-outline" size={10} color="#7A858A" />
          <Text style={styles.hourlyLegendText}>AIR °F</Text>
        </View>
        <View style={styles.hourlyLegendItem}>
          <Ionicons name="navigate-outline" size={10} color="#7A858A" />
          <Text style={styles.hourlyLegendText}>WIND + MPH</Text>
        </View>
      </View>
    </View>
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
  const secondHalf = at12F !== null && at24F !== null ? at24F - at12F : null;
  return (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={styles.reportHeaderIcon}>
          <Ionicons name="water" size={18} color={paper.dashboardBlue} />
        </View>
        <View style={styles.reportHeaderCopy}>
          <Text style={styles.eyebrow}>FIVE-DAY WATER TREND</Text>
          <Text style={styles.reportTitle}>Temperature Outlook</Text>
          <Text style={styles.reportSubtitle}>
            Hourly nearshore surface-water forecast.
          </Text>
        </View>
        <View style={styles.reportStatusBadge}>
          <Text style={styles.reportStatusText}>MODELED</Text>
        </View>
      </View>

      <View style={styles.temperatureReadGrid}>
        <View style={[styles.temperatureReadTile, styles.temperatureReadNow]}>
          <View style={styles.temperatureReadLabelRow}>
            <Ionicons name="water" size={10} color={paper.dashboardBlue} />
            <Text style={styles.temperatureReadLabel}>WATER NOW</Text>
          </View>
          <Text style={styles.temperatureReadValue}>
            {startF === null ? "—" : `${startF.toFixed(1)}°F`}
          </Text>
          <Text style={styles.temperatureReadDetail}>Forecast start</Text>
        </View>
        <View style={styles.temperatureReadTile}>
          <View style={styles.temperatureReadLabelRow}>
            <Ionicons name="water" size={10} color={paper.dashboardBlue} />
            <Text style={styles.temperatureReadLabel}>WATER · IN 12 HOURS</Text>
          </View>
          <Text style={styles.temperatureReadValue}>
            {at12F === null ? "—" : `${at12F.toFixed(1)}°F`}
          </Text>
          <Text style={styles.temperatureReadDetail}>
            {formatDelta(delta12)} vs now
          </Text>
        </View>
        <View style={styles.temperatureReadTile}>
          <View style={styles.temperatureReadLabelRow}>
            <Ionicons name="water" size={10} color={paper.dashboardBlue} />
            <Text style={styles.temperatureReadLabel}>WATER · IN 24 HOURS</Text>
          </View>
          <Text style={styles.temperatureReadValue}>
            {at24F === null ? "—" : `${at24F.toFixed(1)}°F`}
          </Text>
          <Text style={styles.temperatureReadDetail}>
            {formatDelta(delta24)} vs now
          </Text>
        </View>
      </View>

      <View style={styles.temperatureStoryRow}>
        <View style={styles.temperatureStoryIdentity}>
          <Ionicons name="pulse-outline" size={16} color="#167B78" />
          <View>
            <Text style={styles.temperatureStoryEyebrow}>
              {dateParts(date.localDate).month} {dateParts(date.localDate).date}{" "}
              RANGE
            </Text>
            <Text style={styles.temperatureStoryValue}>
              {temperatureRange(date)}
            </Text>
          </View>
        </View>
        <View style={styles.temperatureStoryCopyWrap}>
          <Text style={styles.temperatureStoryCopy}>
            Hours 12–24: {formatDelta(secondHalf)}
          </Text>
          <Text style={styles.temperatureStoryHint}>
            Each change is measured from now.
          </Text>
        </View>
      </View>

      <PierCastTemperatureChart
        points={allPoints}
        timezone={date.timezone}
        xAxisMode="days"
      />
      <Text style={styles.chartCaption}>
        FIVE-DAY HOURLY NEARSHORE SURFACE WATER · °F
      </Text>
    </View>
  );
}

function PiersCovered({ city }: { city: PierCastCatalogCityRead }) {
  const approved = city.structures.filter(
    (item) => item.disposition === "candidate",
  );
  const structures = approved.length
    ? approved
    : city.structures.filter((item) => item.disposition !== "excluded");
  return (
    <View style={styles.compactInfoCard}>
      <View style={styles.compactInfoIcon}>
        <Ionicons name="location-outline" size={19} color="#167B78" />
      </View>
      <View style={styles.compactInfoBody}>
        <Text style={styles.compactInfoTitle}>Piers covered</Text>
        <Text style={styles.compactInfoCopy}>
          This outlook represents{" "}
          {structures.map((item) => item.displayName).join(" and ") ||
            "the configured city shoreline"}
          . Check local access before you go.
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
  return (
    <View style={styles.ratingExplanation}>
      <View style={styles.ratingExplanationTitleRow}>
        <Ionicons
          name="information-circle-outline"
          size={20}
          color={paper.dashboardBlue}
        />
        <Text style={styles.ratingExplanationTitle}>
          FinFindr Opportunity Rating
        </Text>
      </View>
      <Text style={styles.ratingExplanationCopy}>
        A 1–10 pier-fishing outlook based on seasonal presence and nearshore
        water-temperature suitability. It is a FinFindr rating, not a biological
        rating or catch guarantee.
      </Text>
      {showWinterNotice ? (
        <View style={styles.winterNotice}>
          <Ionicons name="snow-outline" size={15} color="#856318" />
          <Text style={styles.winterNoticeText}>{winterNotice}</Text>
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
  date: PierCastReviewDateOutlookRead | null;
  score: number | null;
  rankingScore: number | null;
};

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
      size={featured ? 50 : 34}
      color={paper.dashboardBlue}
    />
  );
}

const PODIUM_MEDALS = {
  1: {
    label: "GOLD",
    accent: "#C99618",
    border: "#D9B64D",
    surface: "#FFF9E8",
    medal: "#F2C94C",
    baseText: "#4F3708",
  },
  2: {
    label: "SILVER",
    accent: "#778894",
    border: "#AAB6BE",
    surface: "#F4F7F8",
    medal: "#C8D0D5",
    baseText: "#23313B",
  },
  3: {
    label: "BRONZE",
    accent: "#A85F35",
    border: "#C88965",
    surface: "#FCF1EA",
    medal: "#D88A5B",
    baseText: "#FFFFFF",
  },
} as const;

function PodiumStandingCard({
  entry,
  rank,
  onOpen,
}: {
  entry: PierCastLeaderboardEntry;
  rank: 1 | 2 | 3;
  onOpen: () => void;
}) {
  const speciesId = entry.date?.headline.drivingSpeciesId ?? null;
  const medal = PODIUM_MEDALS[rank];
  return (
    <Pressable
      style={({ pressed }) => [
        styles.podiumStandingCard,
        rank === 1 && styles.podiumStandingCardChampion,
        { borderColor: medal.border, backgroundColor: medal.surface },
        pressed && styles.leaderboardRowPressed,
      ]}
      onPress={() => {
        hapticSelection();
        onOpen();
      }}
      accessibilityRole="button"
      accessibilityLabel={`View ${entry.city.displayName} PierCast, ranked ${rank}`}
    >
      <View style={[styles.podiumMetalLine, { backgroundColor: medal.accent }]} />
      {rank === 1 ? (
        <View style={styles.championFlag}>
          <Ionicons name="trophy" size={9} color="#76520A" />
          <Text style={styles.championFlagText}>TODAY&apos;S LEADER</Text>
        </View>
      ) : (
        <Text style={[styles.podiumMedalLabel, { color: medal.accent }]}>
          {medal.label}
        </Text>
      )}
      <View
        style={[
          styles.podiumMedal,
          rank === 1 && styles.podiumMedalChampion,
          { borderColor: medal.accent, backgroundColor: medal.medal },
        ]}
      >
        <Text style={styles.podiumMedalNumber}>{rank}</Text>
      </View>
      <Text
        style={styles.podiumCity}
        numberOfLines={2}
        allowFontScaling={false}
      >
        {entry.city.displayName}
      </Text>
      <Text style={styles.podiumState} numberOfLines={1}>
        {STATE_LABELS[entry.city.stateCode].toUpperCase()}
      </Text>
      <View
        style={[
          styles.podiumFishStage,
          rank === 1 && styles.podiumFishStageChampion,
        ]}
      >
        <LeaderFish speciesId={speciesId} featured={rank === 1} />
      </View>
      <Text style={styles.podiumSpecies} numberOfLines={1}>
        {speciesId ? SPECIES_LABELS[speciesId] : "RATING PENDING"}
      </Text>
      <View style={styles.podiumScoreLine}>
        <Text style={[styles.podiumScoreValue, { color: medal.accent }]}>
          {entry.score?.toFixed(1) ?? "—"}
        </Text>
        <Text style={styles.podiumScoreMax}>/10</Text>
      </View>
      <View style={[styles.podiumBase, { backgroundColor: medal.accent }]}>
        <Text style={[styles.podiumBaseText, { color: medal.baseText }]}>
          {rank === 1 ? "GOLD CHAMPION" : `${medal.label} PIER`}
        </Text>
        <Ionicons name="chevron-forward" size={8} color={medal.baseText} />
      </View>
    </Pressable>
  );
}

function BlueRibbonStandingRow({
  entry,
  rank,
  onOpen,
}: {
  entry: PierCastLeaderboardEntry;
  rank: number;
  onOpen: () => void;
}) {
  const speciesId = entry.date?.headline.drivingSpeciesId ?? null;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.blueRibbonRow,
        pressed && styles.leaderboardRowPressed,
      ]}
      onPress={() => {
        hapticSelection();
        onOpen();
      }}
      accessibilityRole="button"
      accessibilityLabel={`View ${entry.city.displayName} PierCast, ranked ${rank}`}
    >
      <View style={styles.blueRibbonMark}>
        <Ionicons name="ribbon" size={17} color={paper.dashboardBlue} />
        <Text style={styles.blueRibbonRank}>{rank}</Text>
      </View>
      <View style={styles.blueRibbonFishStage}>
        <LeaderFish speciesId={speciesId} />
      </View>
      <View style={styles.blueRibbonIdentity}>
        <Text style={styles.blueRibbonState}>
          {STATE_LABELS[entry.city.stateCode].toUpperCase()}
        </Text>
        <Text style={styles.blueRibbonCity} numberOfLines={1}>
          {entry.city.displayName}
        </Text>
        <Text style={styles.blueRibbonTarget} numberOfLines={1}>
          {speciesId ? SPECIES_LABELS[speciesId] : "Rating unavailable"}
          {speciesId ? ` · ${primaryPierName(entry.city)}` : ""}
        </Text>
      </View>
      <View style={styles.blueRibbonScore}>
        <Text style={styles.blueRibbonScoreValue}>
          {entry.score?.toFixed(1) ?? "—"}
        </Text>
        <Text style={styles.blueRibbonScoreMax}>/10</Text>
      </View>
      <Ionicons name="chevron-forward" size={15} color={paper.dashboardBlue} />
    </Pressable>
  );
}

function PierCastLanding({
  catalog,
  outlook,
  onOpenCity,
}: {
  catalog: PierCastCatalogResponse;
  outlook: PierCastReviewOutlookResponse;
  onOpenCity: (cityId: string) => void;
}) {
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
        .map((city) => {
          const cityOutlook = outlook.cities.find(
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
        )
        .slice(0, 5),
    [catalog.cities, outlook.cities],
  );
  const selectedBrowseCity =
    stateCities.find((city) => city.cityId === browseCityId) ??
    stateCities[0] ??
    null;
  const forecastDate = leaderboard[0]?.date?.localDate;
  const dailyScoreSnapshot = outlook.dailyScoreSnapshot ?? null;
  const standingsReady =
    Boolean(dailyScoreSnapshot) &&
    leaderboard.length === 5 &&
    leaderboard.every((entry) => entry.score !== null);

  return (
    <>
      <View style={styles.leaderboardCard}>
        <TopographicLines
          style={StyleSheet.absoluteFill}
          color={paper.dashboardBlue}
          count={8}
        />
        <CornerMarkSet color={paper.red} size={16} thickness={2} inset={11} />

        <View style={styles.leaderboardMasthead}>
          <SectionEyebrow color={paper.red} size={9}>
            TODAY ON LAKE MICHIGAN
          </SectionEyebrow>
          <Text style={styles.leaderboardTitle} allowFontScaling={false}>
            PIERCAST LEADERBOARD
          </Text>
          <Text style={styles.leaderboardSubtitle}>
            The strongest species-specific opportunity at every supported pier
            city.
          </Text>
          <View style={styles.leaderboardMeta}>
            <View style={styles.leaderboardMetaCell}>
              <Text style={styles.leaderboardMetaLabel}>FORECAST DATE</Text>
              <Text style={styles.leaderboardMetaValue}>
                {fullDateLabel(forecastDate)}
              </Text>
            </View>
            <View style={styles.leaderboardMetaDivider} />
            <View style={styles.leaderboardMetaCell}>
              <Text style={styles.leaderboardMetaLabel}>DAILY STANDINGS</Text>
              <View style={styles.leaderboardLockLine}>
                <Ionicons
                  name={standingsReady ? "lock-closed" : "time-outline"}
                  size={9}
                  color={paper.dashboardBlue}
                />
                <Text style={styles.leaderboardMetaValue}>
                  {standingsReady ? "Locked" : "Preparing"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {standingsReady ? (
          <>
            <View style={styles.podiumSectionLabel}>
              <View style={styles.podiumSectionRule} />
              <Text style={styles.podiumSectionText}>MEDAL STANDINGS</Text>
              <View style={styles.podiumSectionRule} />
            </View>

            <View style={styles.podiumStage}>
              {[leaderboard[1], leaderboard[0], leaderboard[2]].map(
                (entry, stageIndex) => {
                  if (!entry) return null;
                  const rank = ([2, 1, 3] as const)[stageIndex];
                  return (
                    <PodiumStandingCard
                      key={entry.city.cityId}
                      entry={entry}
                      rank={rank}
                      onOpen={() => onOpenCity(entry.city.cityId)}
                    />
                  );
                },
              )}
            </View>

            <View style={styles.blueRibbonSection}>
              <View style={styles.blueRibbonHeader}>
                <View style={styles.blueRibbonHeaderIcon}>
                  <Ionicons
                    name="ribbon-outline"
                    size={15}
                    color={paper.dashboardBlue}
                  />
                </View>
                <View style={styles.blueRibbonHeaderCopy}>
                  <Text style={styles.blueRibbonEyebrow}>
                    BLUE RIBBON PIERS
                  </Text>
                  <Text style={styles.blueRibbonHeaderText}>
                    Still among today&apos;s top five.
                  </Text>
                </View>
                <Text style={styles.blueRibbonRange}>04—05</Text>
              </View>
              {leaderboard.slice(3).map((entry, index) => (
                <BlueRibbonStandingRow
                  key={entry.city.cityId}
                  entry={entry}
                  rank={index + 4}
                  onOpen={() => onOpenCity(entry.city.cityId)}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.leaderboardPending}>
            <View style={styles.leaderboardPendingIcon}>
              <Ionicons
                name="hourglass-outline"
                size={22}
                color={paper.dashboardBlue}
              />
            </View>
            <Text style={styles.leaderboardPendingTitle}>
              Today&apos;s podium is being prepared.
            </Text>
            <Text style={styles.leaderboardPendingCopy}>
              No medals are awarded until all five city scores are complete and
              locked.
            </Text>
          </View>
        )}

        <View style={styles.rankingNote}>
          <Ionicons name="lock-closed-outline" size={14} color="#167B78" />
          <Text style={styles.rankingNoteText}>
            {standingsReady && dailyScoreSnapshot
              ? `Each city is ranked by its single highest species rating. Standings are locked for ${fullDateLabel(dailyScoreSnapshot.lakeDate)}, while live weather and water data keep refreshing.`
              : "Today’s ranking is preparing. Live pier conditions continue to refresh."}
          </Text>
        </View>
      </View>

      <View style={styles.pierFinderCard}>
        <TopographicLines
          style={StyleSheet.absoluteFill}
          color={paper.dashboardBlue}
          count={6}
        />
        <CornerMarkSet color={paper.red} size={14} thickness={2} inset={11} />
        <View style={styles.pierFinderHeading}>
          <SectionEyebrow color={paper.red} size={9}>
            CHOOSE YOUR SHORELINE
          </SectionEyebrow>
          <Text style={styles.pierFinderTitle}>Find your PierCast.</Text>
          <Text style={styles.pierFinderSubtitle}>
            Move from lake-wide rankings to the report built for your pier.
          </Text>
        </View>

        <View style={styles.finderPromptRow}>
          <Text style={styles.finderPromptNumber}>01</Text>
          <Text style={styles.finderPromptLabel}>SELECT A STATE</Text>
          <View style={styles.finderPromptRule} />
        </View>

        <View style={styles.stateSelector}>
          {stateCodes.map((stateCode) => {
            const selected = stateCode === selectedState;
            const count = catalog.cities.filter(
              (city) => city.stateCode === stateCode,
            ).length;
            return (
              <Pressable
                key={stateCode}
                style={[
                  styles.stateChoice,
                  selected && styles.stateChoiceSelected,
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
                <Text style={styles.stateCode}>{stateCode}</Text>
                <View style={styles.stateChoiceCopy}>
                  <Text style={styles.stateName}>{STATE_LABELS[stateCode]}</Text>
                  <Text style={styles.stateCityCount}>
                    {count} {count === 1 ? "CITY" : "CITIES"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.selectionCheck,
                    selected && styles.selectionCheckSelected,
                  ]}
                >
                  {selected ? (
                    <Ionicons
                      name="checkmark"
                      size={13}
                      color={paper.dashboardBlue}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.finderPromptRow}>
          <Text style={styles.finderPromptNumber}>02</Text>
          <Text style={styles.finderPromptLabel}>SELECT A PIER CITY</Text>
          <View style={styles.finderPromptRule} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coverageCityRail}
        >
          {stateCities.map((city) => {
            const selected = city.cityId === selectedBrowseCity?.cityId;
            const pierCount = city.structures.filter(
              (structure) => structure.disposition !== "excluded",
            ).length;
            return (
              <Pressable
                key={city.cityId}
                style={[
                  styles.coverageCityCard,
                  selected && styles.coverageCityCardSelected,
                ]}
                onPress={() => {
                  hapticSelection();
                  setBrowseCityId(city.cityId);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <View style={styles.coverageCityTopline}>
                  <Text style={styles.coverageCityState}>
                    {STATE_LABELS[city.stateCode].toUpperCase()}
                  </Text>
                  <Text style={styles.coverageCityIndex}>
                    {String(stateCities.indexOf(city) + 1).padStart(2, "0")}
                  </Text>
                </View>
                <View style={styles.coverageCityIcon}>
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={paper.dashboardBlue}
                  />
                </View>
                <Text style={styles.coverageCityName}>
                  {city.displayName}
                </Text>
                <Text style={styles.coverageCityDetail}>
                  {pierCount} {pierCount === 1 ? "PIER" : "PIERS"} COVERED
                </Text>
                <View
                  style={[
                    styles.coverageCityCheck,
                    selected && styles.coverageCityCheckSelected,
                  ]}
                >
                  {selected ? (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={paper.dashboardBlue}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          style={({ pressed }) => [
            styles.loadCityButton,
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
              ? `${selectedBrowseCity.displayName.toUpperCase()} PIERCAST`
              : "SELECT A CITY"}
          </Text>
          <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
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

function CityReport({
  city,
  outlook,
  weather,
  weatherLoading,
  conditionsUpdatedAt,
  scoreLakeDate,
}: {
  city: PierCastCatalogCityRead;
  outlook: PierCastReviewCityOutlookRead | null;
  weather: PierCastHourlyWeatherPoint[];
  weatherLoading: boolean;
  conditionsUpdatedAt: string;
  scoreLakeDate: string | null;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => setSelectedIndex(0), [city.cityId]);
  const date = outlook?.dates[selectedIndex] ?? outlook?.dates[0] ?? null;
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
      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <View style={styles.reportHeaderIcon}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={paper.dashboardBlue}
            />
          </View>
          <View style={styles.reportHeaderCopy}>
            <Text style={styles.eyebrow}>DAILY PIER READ</Text>
            <Text style={styles.reportTitle}>Five-Day Outlook</Text>
            <Text style={styles.reportSubtitle}>
              Best eligible species score for each day.
            </Text>
          </View>
          <Text style={styles.forecastUnit}>SCORE / 10</Text>
        </View>
        <DailyForecastStrip
          dates={outlook.dates}
          selectedIndex={selectedIndex}
          weather={weather}
          onSelect={(index) => {
            if (index === selectedIndex) return;
            hapticSelection();
            setSelectedIndex(index);
          }}
        />
      </View>
      <SpeciesBoard date={date} />
      <HourlyConditions
        dates={outlook.dates}
        timeline={allPoints}
        weather={weather}
        conditionsUpdatedAt={conditionsUpdatedAt}
        scoreLakeDate={scoreLakeDate}
      />
      {weatherLoading ? (
        <View style={styles.weatherLoadingRow}>
          <ActivityIndicator size="small" color={paper.dashboardBlue} />
          <Text style={styles.weatherLoadingText}>
            Loading air and wind forecast…
          </Text>
        </View>
      ) : null}
      <TemperaturePanel date={date} allPoints={allPoints} />
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
  const [outlook, setOutlook] = useState<PierCastReviewOutlookResponse | null>(
    null,
  );
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(admin);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<PierCastHourlyWeatherPoint[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const load = useCallback(async (options?: { silent?: boolean }) => {
    if (!admin) return;
    const silent = options?.silent === true;
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const [nextCatalog, nextOutlook] = silent
        ? [null, await fetchPierCastOwnerReviewOutlook()]
        : await Promise.all([
          fetchPierCastOwnerReviewCatalog(),
          fetchPierCastOwnerReviewOutlook(),
        ]);
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
  }, [admin]);

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
    outlook?.cities.find((city) => city.cityId === selectedCityId) ?? null;
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
          <Text style={styles.navEyebrow}>LAKE MICHIGAN · PIER FORECAST</Text>
          <Text style={styles.navTitle}>PIERCAST</Text>
        </View>
        <View style={styles.navSpacer} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!admin ? (
          <View style={styles.messageCard}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color={paper.dashboardBlue}
            />
            <Text style={styles.messageTitle}>Owner access only</Text>
          </View>
        ) : loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={paper.dashboardBlue} />
            <Text style={styles.loadingText}>Loading PierCast…</Text>
          </View>
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
                          setSelectedCityId(city.cityId);
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
              <CityReport
                city={selectedCity}
                outlook={selectedOutlook}
                weather={weather}
                weatherLoading={weatherLoading}
                conditionsUpdatedAt={outlook.generatedAt}
                scoreLakeDate={outlook.dailyScoreSnapshot?.lakeDate ?? null}
              />
              <RatingExplanation
                winterNotice={catalog.winterOpenWaterNotice}
                showWinterNotice={Boolean(
                  selectedOutlook?.dates.some(
                    (date) => date.openWaterNoticeApplies,
                  ),
                )}
              />
              <PierCastCoverageRequest
                profile={profile}
                user={user}
                city={selectedCity}
                cities={catalog.cities}
              />
            </>
          ) : (
            <>
              <PierCastLanding
                catalog={catalog}
                outlook={outlook}
                onOpenCity={(cityId) => {
                  hapticSelection();
                  setSelectedCityId(cityId);
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  leaderboardRowPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.992 }],
  },
  leaderFish: {
    width: 68,
    height: 44,
  },
  leaderFishFeatured: {
    width: 91,
    height: 59,
  },
  leaderboardCard: {
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 14,
    backgroundColor: "#FEFEFC",
    ...paperShadows.hard,
  },
  leaderboardMasthead: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 17,
  },
  leaderboardTitle: {
    maxWidth: 365,
    marginTop: 9,
    fontFamily: paperFonts.display,
    fontSize: 32,
    lineHeight: 34,
    letterSpacing: -0.8,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  leaderboardSubtitle: {
    maxWidth: 325,
    marginTop: 8,
    fontFamily: paperFonts.body,
    fontSize: 10.5,
    lineHeight: 15,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  leaderboardMeta: {
    width: "100%",
    minHeight: 56,
    flexDirection: "row",
    marginTop: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: "rgba(255,255,255,0.56)",
  },
  leaderboardMetaCell: {
    minWidth: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 9,
  },
  leaderboardMetaDivider: {
    width: 1,
    backgroundColor: paper.dashboardLine,
  },
  leaderboardMetaLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.6,
    letterSpacing: 0.85,
    color: paper.dashboardMuted,
  },
  leaderboardMetaValue: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 11.5,
    lineHeight: 14,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  leaderboardLockLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  podiumSectionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 17,
    paddingTop: 3,
  },
  podiumSectionRule: {
    flex: 1,
    height: 1,
    backgroundColor: paper.dashboardLine,
  },
  podiumSectionText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.8,
    letterSpacing: 1,
    color: paper.dashboardMuted,
  },
  leaderboardPending: {
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: "#BDD8E6",
    borderRadius: 12,
    backgroundColor: "#EEF7FB",
  },
  leaderboardPendingIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#B7D5E4",
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
  },
  leaderboardPendingTitle: {
    marginTop: 12,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 21,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  leaderboardPendingCopy: {
    maxWidth: 285,
    marginTop: 6,
    fontFamily: paperFonts.body,
    fontSize: 9.5,
    lineHeight: 14,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  podiumStage: {
    minHeight: 267,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 7,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  podiumStandingCard: {
    position: "relative",
    overflow: "hidden",
    minWidth: 0,
    minHeight: 218,
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 35,
    borderWidth: 1.5,
    borderRadius: 12,
  },
  podiumStandingCardChampion: {
    minHeight: 250,
    flex: 1.08,
    zIndex: 2,
    ...paperShadows.lift,
  },
  podiumMetalLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  championFlag: {
    minHeight: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: "rgba(153,111,16,0.28)",
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.64)",
  },
  championFlagText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 4.4,
    letterSpacing: 0.4,
    color: "#76520A",
  },
  podiumMedalLabel: {
    minHeight: 18,
    paddingTop: 4,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.3,
    letterSpacing: 0.8,
  },
  podiumMedal: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7,
    borderWidth: 1.5,
    borderRadius: 18,
    shadowColor: paper.dashboardInk,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },
  podiumMedalChampion: {
    width: 43,
    height: 43,
    borderRadius: 22,
  },
  podiumMedalNumber: {
    fontFamily: paperFonts.display,
    fontSize: 23,
    lineHeight: 27,
    color: paper.dashboardInk,
  },
  podiumCity: {
    width: "100%",
    minHeight: 32,
    marginTop: 8,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 13.5,
    lineHeight: 15.5,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  podiumState: {
    marginTop: 2,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 4.7,
    letterSpacing: 0.6,
    textAlign: "center",
    color: "#167B78",
  },
  podiumFishStage: {
    width: "100%",
    height: 51,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderWidth: 1,
    borderColor: "rgba(10,27,46,0.08)",
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.62)",
  },
  podiumFishStageChampion: {
    height: 60,
    borderRadius: 30,
  },
  podiumSpecies: {
    width: "100%",
    marginTop: 6,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.2,
    letterSpacing: 0.42,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  podiumScoreLine: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginTop: 4,
  },
  podiumScoreValue: {
    fontFamily: paperFonts.display,
    fontSize: 28,
    lineHeight: 31,
    letterSpacing: -0.8,
  },
  podiumScoreMax: {
    marginLeft: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 4.8,
    color: paper.dashboardMuted,
  },
  podiumBase: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: 4,
  },
  podiumBaseText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.2,
    letterSpacing: 0.65,
    textAlign: "center",
  },
  blueRibbonSection: {
    overflow: "hidden",
    marginHorizontal: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#BFD8E5",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.82)",
  },
  blueRibbonHeader: {
    minHeight: 57,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 11,
    paddingVertical: 9,
    backgroundColor: "#EAF4FB",
  },
  blueRibbonHeaderIcon: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BAD7E5",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  blueRibbonHeaderCopy: {
    minWidth: 0,
    flex: 1,
  },
  blueRibbonEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.8,
    letterSpacing: 0.9,
    color: paper.dashboardBlue,
  },
  blueRibbonHeaderText: {
    marginTop: 2,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 8.5,
    color: paper.dashboardMuted,
  },
  blueRibbonRange: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.dashboardBlue,
  },
  blueRibbonRow: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: "#D5E4EB",
    borderLeftWidth: 4,
    borderLeftColor: paper.dashboardBlue,
    backgroundColor: "rgba(255,255,255,0.84)",
  },
  blueRibbonMark: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  blueRibbonRank: {
    marginTop: -4,
    fontFamily: paperFonts.display,
    fontSize: 20,
    lineHeight: 23,
    color: paper.dashboardInk,
  },
  blueRibbonFishStage: {
    width: 62,
    height: 55,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D7E7EE",
    borderRadius: 27,
    backgroundColor: "#F1F7F9",
  },
  blueRibbonIdentity: {
    minWidth: 0,
    flex: 1,
  },
  blueRibbonState: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.3,
    letterSpacing: 0.72,
    color: "#167B78",
  },
  blueRibbonCity: {
    marginTop: 1,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 16.5,
    lineHeight: 19,
    color: paper.dashboardInk,
  },
  blueRibbonTarget: {
    marginTop: 3,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 6.8,
    lineHeight: 9.5,
    color: paper.dashboardMuted,
  },
  blueRibbonScore: {
    width: 45,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-end",
  },
  blueRibbonScoreValue: {
    fontFamily: paperFonts.display,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.7,
    color: paper.dashboardBlue,
  },
  blueRibbonScoreMax: {
    marginLeft: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 4.8,
    color: paper.dashboardMuted,
  },
  rankingNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    margin: 12,
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(22,123,120,0.22)",
    borderRadius: 9,
    backgroundColor: "rgba(22,123,120,0.055)",
  },
  rankingNoteText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 8.7,
    lineHeight: 12.5,
    color: "#53676D",
  },
  pierFinderCard: {
    position: "relative",
    overflow: "hidden",
    gap: 15,
    paddingHorizontal: 18,
    paddingTop: 25,
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
    paddingBottom: 5,
  },
  pierFinderTitle: {
    marginTop: 5,
    fontFamily: paperFonts.display,
    fontSize: 31,
    lineHeight: 34,
    letterSpacing: -0.7,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  pierFinderSubtitle: {
    maxWidth: 310,
    marginTop: 6,
    fontFamily: paperFonts.body,
    fontSize: 10,
    lineHeight: 14,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  finderPromptRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  finderPromptNumber: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    lineHeight: 20,
    color: paper.red,
  },
  finderPromptLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.3,
    letterSpacing: 0.9,
    color: paper.dashboardInk,
  },
  finderPromptRule: {
    flex: 1,
    height: 1,
    backgroundColor: paper.dashboardLine,
  },
  stateSelector: {
    flexDirection: "row",
    gap: 8,
  },
  stateChoice: {
    minWidth: 0,
    flex: 1,
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#D5E0E5",
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.93)",
  },
  stateChoiceSelected: {
    borderColor: paper.dashboardBlue,
    backgroundColor: "#EAF4FB",
    ...paperShadows.lift,
  },
  stateCode: {
    fontFamily: paperFonts.display,
    fontSize: 27,
    lineHeight: 30,
    letterSpacing: -0.7,
    color: paper.dashboardBlue,
  },
  stateChoiceCopy: {
    minWidth: 0,
    flex: 1,
  },
  stateName: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.dashboardInk,
  },
  stateCityCount: {
    marginTop: 3,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.3,
    letterSpacing: 0.65,
    color: paper.dashboardMuted,
  },
  selectionCheck: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CFDCE2",
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
  },
  selectionCheckSelected: {
    borderColor: paper.dashboardBlue,
    backgroundColor: "#FFFFFF",
  },
  coverageCityRail: {
    gap: 9,
    paddingVertical: 4,
    paddingRight: 12,
  },
  coverageCityCard: {
    position: "relative",
    width: 164,
    minHeight: 145,
    justifyContent: "flex-end",
    padding: 13,
    borderWidth: 1.5,
    borderColor: "#D5E0E5",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.94)",
  },
  coverageCityCardSelected: {
    borderColor: paper.dashboardBlue,
    backgroundColor: "#EAF4FB",
    ...paperShadows.lift,
  },
  coverageCityTopline: {
    position: "absolute",
    top: 11,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  coverageCityState: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.5,
    letterSpacing: 0.75,
    color: paper.dashboardBlue,
  },
  coverageCityIndex: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.5,
    letterSpacing: 0.6,
    color: "#A3ADB2",
  },
  coverageCityIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "auto",
    marginTop: 21,
    borderWidth: 1,
    borderColor: "#C8DFEA",
    borderRadius: 18,
    backgroundColor: "#F3F9FC",
  },
  coverageCityName: {
    marginTop: 10,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 21,
    color: paper.dashboardInk,
  },
  coverageCityDetail: {
    marginTop: 4,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.4,
    letterSpacing: 0.55,
    color: paper.dashboardMuted,
  },
  coverageCityCheck: {
    position: "absolute",
    top: 48,
    right: 12,
    width: 23,
    height: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D3DEE3",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  coverageCityCheckSelected: {
    borderColor: paper.dashboardBlue,
    backgroundColor: "#FFFFFF",
  },
  loadCityButton: {
    minHeight: 51,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 11,
    paddingHorizontal: 18,
    borderRadius: 11,
    backgroundColor: paper.dashboardInk,
  },
  loadCityButtonPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.995 }],
  },
  loadCityButtonDisabled: {
    opacity: 0.42,
  },
  loadCityButtonText: {
    flexShrink: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.15,
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
  resultHero: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 23,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: paper.dashboardWhite,
    ...paperShadows.hard,
  },
  resultHeroTitle: {
    marginTop: 7,
    fontFamily: paperFonts.display,
    fontSize: 34,
    lineHeight: 38,
    textAlign: "center",
    color: paper.dashboardInk,
    letterSpacing: -0.8,
  },
  resultHeroSubtitle: {
    maxWidth: 410,
    marginTop: 6,
    fontFamily: paperFonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  resultFishStage: {
    width: "100%",
    height: 126,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  resultFishImage: { width: "100%", height: "100%" },
  resultHeroMeta: {
    width: "100%",
    minHeight: 108,
    flexDirection: "row",
    alignItems: "stretch",
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
  },
  resultHeroMetaItem: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 9,
  },
  resultHeroRatingItem: {
    flex: 1.5,
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 8,
    backgroundColor: "rgba(234,242,247,0.52)",
  },
  resultHeroRatingCopy: { minWidth: 0, flex: 1, alignItems: "flex-start" },
  resultHeroRatingValue: {
    marginTop: 2,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 14,
    lineHeight: 17,
    color: paper.dashboardInk,
  },
  resultHeroRatingHint: {
    marginTop: 2,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 8,
    color: paper.dashboardMuted,
  },
  resultHeroMetaRule: { width: 1, backgroundColor: paper.dashboardLine },
  resultHeroMetaLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.35,
    color: paper.dashboardMuted,
  },
  resultHeroMetaValue: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 13,
    lineHeight: 16,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  reportCard: {
    overflow: "hidden",
    gap: 11,
    padding: 13,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 13,
    backgroundColor: "#FDFDFC",
    ...paperShadows.hard,
  },
  reportHeader: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
  },
  reportHeaderIcon: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "#EAF2F7",
  },
  reportHeaderCopy: { minWidth: 0, flex: 1, gap: 2 },
  reportTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 19,
    lineHeight: 22,
    color: paper.dashboardInk,
  },
  reportSubtitle: {
    fontFamily: paperFonts.body,
    fontSize: 10.5,
    lineHeight: 14,
    color: paper.dashboardMuted,
  },
  reportStatusBadge: {
    flexShrink: 0,
    minHeight: 23,
    justifyContent: "center",
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: "rgba(32,123,83,0.28)",
    borderRadius: 12,
    backgroundColor: "#EAF6EF",
  },
  reportStatusText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 0.75,
    color: paper.dashboardInk,
  },
  forecastUnit: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1,
    color: paper.dashboardMuted,
  },
  forecastGrid: { flexDirection: "row", width: "100%", gap: 5 },
  forecastTile: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
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
  forecastTileHead: {
    paddingVertical: 5,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: paper.dashboardHair,
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
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 14,
    color: paper.dashboardInk,
    marginTop: 1,
    lineHeight: 15,
  },
  forecastTileScoreBlock: {
    height: 38,
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
  forecastTileHiLo: {
    paddingVertical: 4,
    paddingHorizontal: 1,
    alignItems: "center",
    backgroundColor: "#FAFAF7",
    borderTopWidth: 1,
    borderColor: paper.dashboardHair,
  },
  forecastTileHiLoText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    color: paper.dashboardMuted,
  },
  speciesViewport: { maxHeight: 526 },
  speciesList: { gap: 8, paddingBottom: 1 },
  speciesScrollHint: {
    minHeight: 27,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: -2,
    borderRadius: 8,
    backgroundColor: "#EAF2F7",
  },
  speciesScrollHintText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
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
  speciesAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 5 },
  speciesHeader: { minHeight: 72, flexDirection: "row", alignItems: "center" },
  speciesFishStage: {
    width: 94,
    height: 66,
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
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 9.5,
    lineHeight: 12,
    color: "#63727A",
  },
  factorValue: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    color: paper.dashboardInk,
  },
  nearshoreMetricGrid: { flexDirection: "row", gap: 7 },
  freshnessStrip: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "stretch",
    borderWidth: 1,
    borderColor: "rgba(22,123,120,0.2)",
    borderRadius: 9,
    backgroundColor: "rgba(22,123,120,0.055)",
  },
  freshnessItem: {
    minWidth: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  freshnessCopy: { minWidth: 0, flex: 1, gap: 2 },
  freshnessLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.8,
    letterSpacing: 0.7,
    color: paper.dashboardMuted,
  },
  freshnessValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    lineHeight: 11,
    color: paper.dashboardInk,
  },
  freshnessRule: {
    width: 1,
    marginVertical: 8,
    backgroundColor: "rgba(22,123,120,0.2)",
  },
  nearshoreMetricTile: {
    minWidth: 0,
    flex: 1,
    gap: 6,
    padding: 9,
    borderWidth: 1,
    borderTopWidth: 3,
    borderColor: paper.dashboardLine,
    borderRadius: 9,
    backgroundColor: "#FCFCFA",
  },
  nearshoreMetricHeading: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  nearshoreMetricIcon: {
    width: 23,
    height: 23,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  nearshoreMetricLabel: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: 0.85,
    color: paper.dashboardMuted,
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
  hourlyTimelineHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
  },
  hourlyTimelineEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: 1.1,
    color: paper.dashboardBlue,
  },
  hourlyTimelineTitle: {
    marginTop: 2,
    fontFamily: paperFonts.bodyBold,
    fontSize: 13.5,
    color: paper.dashboardInk,
  },
  scrollCue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#EAF2F7",
  },
  scrollCueText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 0.7,
    color: paper.dashboardBlue,
  },
  fiveDayHourlyRail: { paddingRight: 6, paddingBottom: 4 },
  hourDayGroup: {
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginRight: 10,
  },
  hourDayHeader: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: paper.dashboardLine,
    backgroundColor: "#E8F3F5",
  },
  hourDayEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    lineHeight: 9,
    letterSpacing: 1,
    color: "#167B78",
  },
  hourDayTitle: {
    marginTop: 2,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 14,
    lineHeight: 16,
    color: paper.dashboardInk,
  },
  hourDayCount: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.2,
    letterSpacing: 0.65,
    color: paper.dashboardBlue,
  },
  hourCellsRow: { flexDirection: "row" },
  hourCell: {
    width: HOURLY_CONDITION_CARD_WIDTH,
    height: 208,
    paddingHorizontal: 10,
    paddingVertical: 11,
    borderRightWidth: 1,
    borderRightColor: paper.dashboardLine,
    backgroundColor: "#FCFCFA",
  },
  hourCellNow: { backgroundColor: "#FFF9E8" },
  hourCellHeading: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 5,
  },
  hourCellTime: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    lineHeight: 13,
    color: paper.dashboardInk,
  },
  hourCellDate: {
    marginTop: 2,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6,
    lineHeight: 9,
    letterSpacing: 0.65,
    color: "#167B78",
  },
  hourCellStartBadge: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "#F3D989",
  },
  hourCellStartBadgeText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5,
    letterSpacing: 0.5,
    color: "#725612",
  },
  hourCellWaterBlock: {
    marginTop: 7,
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(47,124,164,0.16)",
    borderRadius: 9,
    backgroundColor: "#EBF4F8",
  },
  hourCellWaterLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hourCellWaterLabelText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.2,
    letterSpacing: 0.65,
    color: paper.dashboardBlue,
  },
  hourCellWater: {
    marginTop: 2,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 22,
    lineHeight: 25,
    color: paper.dashboardBlue,
  },
  hourCellMetrics: {
    gap: 5,
    marginTop: 8,
  },
  hourCellMetricRow: {
    minHeight: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    paddingHorizontal: 6,
    borderRadius: 7,
    backgroundColor: "rgba(10,27,46,0.035)",
  },
  hourCellMetricLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  hourCellAirLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.8,
    letterSpacing: 0.55,
    color: "#B65B2A",
  },
  hourCellWindLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.8,
    letterSpacing: 0.55,
    color: "#1E746B",
  },
  hourCellMetricValue: {
    flexShrink: 1,
    textAlign: "right",
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.2,
    color: paper.dashboardInk,
  },
  hourCellTrendRow: {
    minHeight: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 8,
    paddingHorizontal: 2,
  },
  hourCellTrendText: {
    flex: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.3,
    letterSpacing: 0.3,
  },
  hourlyLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 2,
  },
  hourlyLegendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  hourlyLegendText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6,
    letterSpacing: 0.55,
    color: "#7B878D",
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
  weatherLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 9,
    marginLeft: 3,
  },
  weatherLoadingText: {
    fontFamily: paperFonts.body,
    fontSize: 11,
    color: paper.dashboardMuted,
  },
  temperatureReadGrid: { flexDirection: "row", gap: 7 },
  temperatureReadTile: {
    minWidth: 0,
    flex: 1,
    gap: 4,
    padding: 9,
    borderWidth: 1,
    borderTopWidth: 3,
    borderColor: paper.dashboardLine,
    borderTopColor: "#73A6C4",
    borderRadius: 9,
    backgroundColor: "#FCFCFA",
  },
  temperatureReadNow: { borderTopColor: paper.dashboardBlue },
  temperatureReadLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 0.75,
    color: paper.dashboardMuted,
  },
  temperatureReadLabelRow: {
    minHeight: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  temperatureReadValue: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 19,
    lineHeight: 23,
    color: paper.dashboardInk,
  },
  temperatureReadDetail: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 8,
    lineHeight: 11,
    color: paper.dashboardMuted,
  },
  temperatureStoryRow: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(22,123,120,0.24)",
    borderRadius: 9,
    backgroundColor: "rgba(22,123,120,0.07)",
  },
  temperatureStoryIdentity: {
    minWidth: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  temperatureStoryEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 0.85,
    color: "#167B78",
  },
  temperatureStoryValue: {
    marginTop: 1,
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.dashboardInk,
  },
  temperatureStoryCopyWrap: { alignItems: "flex-end" },
  temperatureStoryCopy: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.dashboardInk,
  },
  temperatureStoryHint: {
    marginTop: 1,
    fontFamily: paperFonts.body,
    fontSize: 7.5,
    color: paper.dashboardMuted,
  },
  chartCaption: {
    marginTop: -7,
    textAlign: "center",
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 0.75,
    color: paper.dashboardMuted,
  },
  compactInfoCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 13,
    backgroundColor: "#F7FBFA",
    borderWidth: 1,
    borderTopWidth: 3,
    borderColor: "rgba(22,123,120,0.28)",
    borderTopColor: "#2E9B97",
    ...paperShadows.hard,
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
  compactInfoCopy: {
    marginTop: 3,
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: "#68767D",
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
    padding: 17,
    borderRadius: 17,
    backgroundColor: "#E7F3F6",
    borderLeftWidth: 4,
    borderLeftColor: paper.dashboardBlue,
  },
  ratingExplanationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingExplanationTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 15,
    color: paper.dashboardInk,
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
  loadingCard: {
    minHeight: 170,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 13,
    color: paper.dashboardMuted,
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
