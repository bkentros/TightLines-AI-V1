import { Ionicons } from "@expo/vector-icons";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  buildPierCastCityCalendar,
  buildPierCastCitySpeciesCards,
  buildPierCastHourlyStrip,
  buildPierCastShiftCards,
  nearbyPierCastCities,
  type PierCastCalendarDay,
  type PierCastCitySpeciesCard,
  pierCastCityPrimeCount,
  pierCastCityTopPick,
  pierCastCompass,
  pierCastCurrentWeather,
  pierCastDeltaLabel,
  pierCastLocalParts,
  type PierCastShiftCard,
  pierCastSpeciesName,
  pierCastTemperatureAt,
  pierCastTimelinePoints,
  splitPierCastCitySpeciesCards,
} from "../../lib/pierCastCityReportPresentation";
import type {
  PierCastCityReportReadV4,
  PierCastConditionsCatalogCityV4,
} from "../../lib/pierCastConditionsV4";
import {
  fahrenheit,
  formatConditionsFreshness,
  pierCastForecastDelayMessage,
  PIER_CAST_STATE_LABELS,
} from "../../lib/pierCastConditionsPresentation";
import type { PierCastSpeciesId } from "../../lib/pierCastContracts";
import { selectPierCastCoveredStructures } from "../../lib/pierCastCoveredStructures";
import { getPierCastSpeciesImage } from "../../lib/pierCastSpeciesImages";
import {
  PIER_CAST_STANDINGS_BAND_MEANINGS,
  PIER_CAST_STANDINGS_BANDS,
  pierCastLakeName,
} from "../../lib/pierCastStandingsPresentation";
import type { PierCastHourlyWeatherPoint } from "../../lib/pierCastWeather";
import { hapticSelection } from "../../lib/safeHaptics";
import { paper, paperFonts, paperShadows } from "../../lib/theme";
import { CornerMarkSet, TopographicLines } from "../paper";
import {
  BandChip,
  BandMeter,
  BottomSheet,
  Reveal,
  TrendArrow,
  useReduceMotion,
} from "./PierCastStandings";
import { PierCastCityTemperatureChart } from "./PierCastVisuals";

const INK = paper.dashboardInk;
const GOLD = paper.gold;
const WATER_INK = "#1F5E8C";
const AIR_INK = "#B86A3A";
const WIND_INK = "#2E6B5C";
const COOL = "#2F86C9";
const IDEAL = paper.bandPrime;
const WARM = "#E0772F";
const HOUR_CARD_WIDTH = 68;
const HOUR_CARD_GAP = 8;
const HOUR_CARD_STEP = HOUR_CARD_WIDTH + HOUR_CARD_GAP;

const SEVERITY_STYLE = {
  minor: { label: "MINOR", color: "#7A8288" },
  notable: { label: "NOTABLE", color: "#2E6B5C" },
  major: { label: "MAJOR", color: "#B4541F" },
  extreme: { label: "EXTREME", color: "#A3291C" },
} as const;

function SpeciesFish({ speciesId, width, height }: {
  speciesId: PierCastSpeciesId;
  width: number;
  height: number;
}) {
  return (
    <Image
      source={getPierCastSpeciesImage(speciesId) as ImageSourcePropType}
      style={{ width, height }}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
  );
}

function Card({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.card} accessibilityLabel={label}>
      <View style={styles.cardPad}>{children}</View>
    </View>
  );
}

function CardHead({ kicker, title, tag }: { kicker?: string; title: string; tag?: string }) {
  return (
    <View style={styles.head}>
      <View style={styles.flex}>
        {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
        <Text style={styles.cardTitle} accessibilityRole="header">{title}</Text>
      </View>
      {tag ? <Text style={styles.tag}>{tag}</Text> : null}
    </View>
  );
}

function CityMapLink({ cityName, onPress }: { cityName: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open the live lake map centered on ${cityName}`}
      onPress={() => {
        hapticSelection();
        onPress();
      }}
      style={({ pressed }) => [styles.cityMapLink, pressed && styles.pressed]}
    >
      <View style={styles.cityMapIcon}>
        <Ionicons name="map-outline" size={20} color={paper.gold} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.cityMapTitle}>LIVE LAKE MAP</Text>
        <Text style={styles.cityMapSub}>Water temperature · wind · alerts</Text>
      </View>
      <View style={styles.cityMapOpen}>
        <Text style={styles.cityMapOpenText}>OPEN</Text>
        <Ionicons name="chevron-forward" size={14} color={paper.gold} />
      </View>
    </Pressable>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────

function Hero({
  report,
  city,
  waterNowF,
  onOpenStandings,
  reduceMotion,
}: {
  report: PierCastCityReportReadV4;
  city: PierCastConditionsCatalogCityV4;
  waterNowF: number | null;
  onOpenStandings: (speciesId: PierCastSpeciesId) => void;
  reduceMotion: boolean;
}) {
  const top = pierCastCityTopPick(report.species);
  const primeCount = pierCastCityPrimeCount(report.species);
  const structures = selectPierCastCoveredStructures(city.structures);
  const pierLine = structures.length === 0
    ? null
    : structures.length === 1
    ? structures[0]!.displayName
    : `${structures[0]!.displayName} + ${structures.length - 1} more ${structures.length === 2 ? "pier" : "piers"}`;
  const topStyle = top ? PIER_CAST_STANDINGS_BANDS[top.band] : null;
  const state = PIER_CAST_STATE_LABELS[report.stateCode] ?? report.stateCode;
  return (
    <View style={styles.hero}>
      <TopographicLines style={StyleSheet.absoluteFill} color="#FFFFFF" count={7} />
      <Reveal token="city-hero" reduceMotion={reduceMotion}>
        <View style={styles.heroTop}>
          <Text style={styles.heroKicker} numberOfLines={1}>
            {`${state} · Lake ${pierCastLakeName(report.lakeId)}`.toUpperCase()}
          </Text>
          <View style={styles.fresh}>
            <View style={styles.freshDot} />
            <Text style={styles.freshText}>{formatConditionsFreshness(report.generatedAt)}</Text>
          </View>
        </View>
        <Text style={styles.heroCity} accessibilityRole="header">{report.displayName}</Text>
        {pierLine ? (
          <View style={styles.heroPier}>
            <Ionicons name="location" size={15} color={GOLD} />
            <Text style={styles.heroPierText} numberOfLines={1}>{pierLine}</Text>
          </View>
        ) : null}
        {top && topStyle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Top pick today: ${top.name}, ${topStyle.label}. ${top.line}. Opens the ${top.name} standings.`}
            onPress={() => {
              hapticSelection();
              onOpenStandings(top.speciesId);
            }}
            style={({ pressed }) => [styles.pick, pressed && styles.pressed]}
          >
            <View style={styles.pickFish}>
              <SpeciesFish speciesId={top.speciesId} width={104} height={104} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.pickKicker}>TOP PICK TODAY</Text>
              <Text style={styles.pickName} numberOfLines={1}>{top.name}</Text>
              <Text style={styles.pickLine} numberOfLines={2}>{top.line}</Text>
            </View>
            <BandChip band={top.band} />
          </Pressable>
        ) : (
          <View style={[styles.pick, styles.pickWeak]}>
            <Ionicons name="time-outline" size={22} color="rgba(255,255,255,0.7)" />
            <View style={styles.flex}>
              <Text style={styles.pickKicker}>TOP PICK TODAY</Text>
              <Text style={styles.pickLine}>No species is rated here today. Check back after the next model update.</Text>
            </View>
          </View>
        )}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>WATER NOW</Text>
            <Text style={styles.statValue}>{waterNowF === null ? "—" : `${waterNowF.toFixed(1)}°`}</Text>
          </View>
          <View style={[styles.stat, styles.statDivider]}>
            <Text style={styles.statLabel}>SPECIES</Text>
            <Text style={styles.statValue}>{report.species.length}</Text>
          </View>
          <View style={[styles.stat, styles.statDivider]}>
            <Text style={styles.statLabel}>PRIME TODAY</Text>
            <Text style={[styles.statValue, primeCount > 0 && styles.statPrime]}>{primeCount}</Text>
          </View>
        </View>
      </Reveal>
    </View>
  );
}

// ─── Five-day outlook ─────────────────────────────────────────────────────

function DayTile({ day, selected, onPress }: {
  day: PierCastCalendarDay;
  selected: boolean;
  onPress: () => void;
}) {
  const style = day.best ? PIER_CAST_STANDINGS_BANDS[day.best.band] : null;
  const air = day.airHighF !== null && day.airLowF !== null
    ? `${day.airHighF}°/${day.airLowF}°`
    : "—";
  const who = day.best && style
    ? `best bet ${pierCastSpeciesName(day.best.speciesId)}, ${style.label}`
    : day.bestUnavailable
    ? `water ${day.waterRange ?? "unavailable"}`
    : "no species rated";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${day.isToday ? "Today" : day.weekday} ${day.dayOfMonth}: ${who}, air ${air}`}
      onPress={() => {
        hapticSelection();
        onPress();
      }}
      style={({ pressed }) => [styles.day, selected && styles.dayOn, pressed && styles.pressed]}
    >
      <View style={styles.dayTop}>
        <Text style={styles.dayLabel}>{day.label}</Text>
        <Text style={styles.dayDate}>{day.dayOfMonth}</Text>
      </View>
      <View style={[styles.dayBand, { backgroundColor: style?.chip ?? "#EEF3F6" }]}>
        {day.best && style ? (
          <>
            <View style={styles.dayFish}>
              <SpeciesFish speciesId={day.best.speciesId} width={44} height={44} />
            </View>
            <Text style={[styles.dayBandText, { color: style.ink }]} numberOfLines={1}>
              {style.label === "Off-season" ? "OFF" : style.label.toUpperCase()}
            </Text>
          </>
        ) : day.bestUnavailable ? (
          <>
            <Ionicons name="water-outline" size={15} color={WATER_INK} />
            <Text style={[styles.dayBandText, { color: WATER_INK }]} numberOfLines={1}>
              {day.waterRange ?? "—"}
            </Text>
          </>
        ) : (
          <>
            <Ionicons name="remove" size={15} color="#777777" />
            <Text style={[styles.dayBandText, { color: "#666666" }]}>NONE</Text>
          </>
        )}
      </View>
      <Text style={styles.dayAir}>{air}</Text>
    </Pressable>
  );
}

function FiveDayOutlook({ days, selected, onSelect }: {
  days: PierCastCalendarDay[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  const day = days[selected];
  const style = day?.best ? PIER_CAST_STANDINGS_BANDS[day.best.band] : null;
  const dayName = day ? (day.isToday ? "today" : day.weekday) : "";
  return (
    <Card label="Five-day outlook">
      <CardHead kicker="FIVE-DAY OUTLOOK" title="Best bet each day" tag={`${days.length} DAYS`} />
      <View style={styles.cal}>
        {days.map((entry, index) => (
          <DayTile
            key={entry.localDate}
            day={entry}
            selected={index === selected}
            onPress={() => onSelect(index)}
          />
        ))}
      </View>
      {day ? (
        <Text style={styles.calNote}>
          {day.best && style ? (
            <>
              Best bet {dayName}: <Text style={styles.calNoteStrong}>{pierCastSpeciesName(day.best.speciesId)}</Text> · {style.label}
            </>
          ) : day.bestUnavailable ? (
            `Water ${day.waterRange ?? "—"}F ${dayName}. Species for later days appear after the next update.`
          ) : (
            `No species is rated for ${dayName}.`
          )}
        </Text>
      ) : null}
    </Card>
  );
}

// ─── Species ──────────────────────────────────────────────────────────────

function WaterFitBar({ card }: { card: PierCastCitySpeciesCard }) {
  if (!card.fit) return <View style={[styles.fitBar, styles.fitBarEmpty]} />;
  return (
    <View style={styles.fitWrap}>
      <View style={styles.fitBar}>
        <View style={[styles.fitSeg, { flex: card.fit.coolWeight, backgroundColor: COOL }]} />
        <View style={[styles.fitSeg, { flex: card.fit.idealWeight, backgroundColor: IDEAL }]} />
        <View style={[styles.fitSeg, { flex: card.fit.warmWeight, backgroundColor: WARM }]} />
      </View>
      <View style={[styles.fitPin, { left: `${card.fit.pin * 100}%` }]} />
    </View>
  );
}

function SpeciesCard({ card, index, reduceMotion, onPress }: {
  card: PierCastCitySpeciesCard;
  index: number;
  reduceMotion: boolean;
  onPress: () => void;
}) {
  const style = card.band ? PIER_CAST_STANDINGS_BANDS[card.band] : null;
  const edge = card.ranked && style ? style.color : "#C9CCCF";
  return (
    <Reveal token={`sp-${card.speciesId}`} delay={Math.min(index, 6) * 70} reduceMotion={reduceMotion}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${card.name}, ${card.ranked && style ? style.label : "not rated today"}, ${card.seasonLine}${card.waterLine ? `, water ${card.waterLine.toLowerCase()}` : ""}. Opens the ${card.name} standings.`}
        onPress={() => {
          hapticSelection();
          onPress();
        }}
        style={({ pressed }) => [styles.sp, pressed && styles.pressed]}
      >
        <View style={[styles.spEdge, { backgroundColor: edge }]} />
        <View style={styles.spTop}>
          <Text style={styles.spRank}>{card.rankLabel}</Text>
          <View style={styles.spFish}>
            <SpeciesFish speciesId={card.speciesId} width={84} height={84} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.spName} numberOfLines={1}>{card.name}</Text>
            <View style={styles.spChips}>
              {card.ranked && card.band ? (
                <BandChip band={card.band} />
              ) : (
                <View style={styles.notRated}><Text style={styles.notRatedText}>NOT RATED</Text></View>
              )}
              {card.ranked ? <TrendArrow trend={card.trend} /> : null}
              {card.standing ? (
                <Text style={styles.spStand}>
                  #{card.standing.rank} OF {card.standing.rankedCityCount} IN STANDINGS
                </Text>
              ) : null}
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#999999" />
        </View>
        <View style={styles.spRows}>
          <View style={styles.flex}>
            <Text style={styles.spKey}>SEASON</Text>
            <Text style={styles.spValue} numberOfLines={1}>{card.seasonLine}</Text>
            {card.ranked && style ? (
              <BandMeter
                level={style.level}
                token={`meter-${card.speciesId}`}
                delay={200 + Math.min(index, 6) * 80}
                compact
                reduceMotion={reduceMotion}
              />
            ) : null}
          </View>
          <View style={styles.flex}>
            <Text style={styles.spKey}>WATER FIT</Text>
            <Text style={styles.spValue} numberOfLines={1}>{card.waterLine ?? "Unavailable"}</Text>
            <WaterFitBar card={card} />
            {card.idealLine ? <Text style={styles.spSub}>Ideal {card.idealLine}</Text> : null}
          </View>
        </View>
      </Pressable>
    </Reveal>
  );
}

function SpeciesSection({ report, reduceMotion, onOpenStandings }: {
  report: PierCastCityReportReadV4;
  reduceMotion: boolean;
  onOpenStandings: (speciesId: PierCastSpeciesId) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cards = useMemo(() => buildPierCastCitySpeciesCards(report), [report]);
  const { mainTargets, otherSpecies } = useMemo(
    () => splitPierCastCitySpeciesCards(cards),
    [cards],
  );
  const shown = expanded ? [...mainTargets, ...otherSpecies] : mainTargets;
  useEffect(() => setExpanded(false), [report.cityId]);
  return (
    <Card label={`Supported species at ${report.displayName}`}>
      <CardHead title={`Supported species at ${report.displayName}`} />
      <Text style={styles.cardSub}>Ranked by seasonal rating and water-temperature suitability.</Text>
      {shown.map((card, index) => (
        <SpeciesCard
          key={card.speciesId}
          card={card}
          index={index}
          reduceMotion={reduceMotion}
          onPress={() => onOpenStandings(card.speciesId)}
        />
      ))}
      {otherSpecies.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          onPress={() => {
            hapticSelection();
            setExpanded((current) => !current);
          }}
          style={({ pressed }) => [styles.moreButton, pressed && styles.pressed]}
        >
          <Text style={styles.moreText}>{expanded ? "Show main targets" : `Show all ${cards.length} species`}</Text>
          <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={16} color={INK} />
        </Pressable>
      ) : null}
    </Card>
  );
}

// ─── Pier conditions ──────────────────────────────────────────────────────

function PierConditions({ report, weather, weatherLoading, days, waterNowF }: {
  report: PierCastCityReportReadV4;
  weather: PierCastHourlyWeatherPoint[];
  weatherLoading: boolean;
  days: PierCastCalendarDay[];
  waterNowF: number | null;
}) {
  const stripRef = useRef<ScrollView>(null);
  const current = pierCastCurrentWeather(weather, report.timezone);
  const slots = useMemo(
    () => buildPierCastHourlyStrip({ report, weather }),
    [report, weather],
  );
  const jumpDays = useMemo(
    () => days.slice(0, 5).filter((day) =>
      slots.some((slot) => slot.localDate === day.localDate)
    ),
    [days, slots],
  );
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const pending = weatherLoading ? "…" : "—";
  const compass = pierCastCompass(current?.windDirectionDegrees ?? null);

  useEffect(() => {
    const firstDate = slots[0]?.localDate ?? null;
    setActiveDate(firstDate);
    stripRef.current?.scrollTo({ x: 0, animated: false });
  }, [report.cityId, slots]);

  const jumpToDate = (localDate: string) => {
    const midnightIndex = slots.findIndex((slot) =>
      slot.localDate === localDate && slot.localHour === 0
    );
    const firstIndex = slots.findIndex((slot) => slot.localDate === localDate);
    const index = midnightIndex >= 0 ? midnightIndex : firstIndex;
    if (index < 0) return;
    hapticSelection();
    setActiveDate(localDate);
    stripRef.current?.scrollTo({ x: index * HOUR_CARD_STEP, animated: true });
  };

  return (
    <Card label="Pier conditions">
      <CardHead kicker="RIGHT NOW AT THE PIER" title="Pier conditions" tag="LIVE" />
      <View style={styles.now3}>
        <View style={[styles.nowTile, { borderTopColor: paper.dashboardBlue, backgroundColor: "#F3F8FB" }]}>
          <Text style={styles.nowKey}>WATER</Text>
          <Text style={styles.nowValue}>{waterNowF === null ? "—" : `${waterNowF.toFixed(1)}°F`}</Text>
          <Text style={styles.nowSub}>Nearshore model</Text>
        </View>
        <View style={[styles.nowTile, { borderTopColor: AIR_INK, backgroundColor: "#FBF4EF" }]}>
          <Text style={styles.nowKey}>AIR</Text>
          <Text style={styles.nowValue}>
            {current?.airTemperatureF != null ? `${Math.round(current.airTemperatureF)}°F` : pending}
          </Text>
          <Text style={styles.nowSub}>Forecast now</Text>
        </View>
        <View style={[styles.nowTile, { borderTopColor: WIND_INK, backgroundColor: "#F1F7F5" }]}>
          <Text style={styles.nowKey}>WIND</Text>
          <Text style={styles.nowValue}>
            {current?.windSpeedMph != null ? `${Math.round(current.windSpeedMph)} mph` : pending}
          </Text>
          <Text style={styles.nowSub}>{compass ? `From ${compass}` : "Direction —"}</Text>
        </View>
      </View>
      {slots.length > 0 ? (
        <>
          <View style={styles.stripHead}>
            <Text style={styles.stripKey}>NEXT 120 HRS · HOURLY</Text>
            <Text style={[styles.stripKey, styles.stripKeyMuted]}>WATER · AIR · WIND</Text>
          </View>
          <View style={styles.conditionDays}>
            {jumpDays.map((day) => {
              const selected = activeDate === day.localDate;
              return (
                <Pressable
                  key={day.localDate}
                  accessibilityRole="button"
                  accessibilityLabel={day.isToday
                    ? "Jump to current conditions"
                    : `Jump to ${day.weekday}, ${day.dayOfMonth} at 12 AM`}
                  accessibilityState={{ selected }}
                  onPress={() => jumpToDate(day.localDate)}
                  style={({ pressed }) => [
                    styles.conditionDay,
                    selected && styles.conditionDayOn,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.conditionDayName, selected && styles.conditionDayTextOn]}>
                    {day.isToday ? "TODAY" : day.weekday.toUpperCase()}
                  </Text>
                  <Text style={[styles.conditionDayNumber, selected && styles.conditionDayTextOn]}>
                    {day.dayOfMonth}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <ScrollView
            ref={stripRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.strip}
            scrollEventThrottle={16}
            onScroll={(event) => {
              const index = Math.min(
                slots.length - 1,
                Math.max(0, Math.round(event.nativeEvent.contentOffset.x / HOUR_CARD_STEP)),
              );
              const visibleDate = slots[index]?.localDate;
              if (visibleDate && visibleDate !== activeDate) setActiveDate(visibleDate);
            }}
          >
            {slots.map((slot) => (
              <View key={slot.key} style={[styles.hour, slot.isNow && styles.hourNow]}>
                <Text style={styles.hourTime}>{slot.label}</Text>
                <Text style={styles.hourWater}>{slot.waterF === null ? "—" : `${slot.waterF.toFixed(1)}°`}</Text>
                <Text style={styles.hourAir}>Air {slot.airF === null ? "—" : `${Math.round(slot.airF)}°`}</Text>
                <View style={styles.hourWind}>
                  {slot.windArrowDegrees !== null ? (
                    <Ionicons
                      name="navigate"
                      size={11}
                      color={WIND_INK}
                      style={{ transform: [{ rotate: `${slot.windArrowDegrees - 45}deg` }] }}
                    />
                  ) : null}
                  <Text style={styles.hourWindText}>
                    {slot.windMph === null ? "—" : `${slot.windFrom ?? ""} ${Math.round(slot.windMph)}`.trim()}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <Text style={styles.cardSub}>
          {weatherLoading ? "Loading hourly conditions…" : "Hourly conditions are unavailable."}
        </Text>
      )}
    </Card>
  );
}

// ─── Temperature outlook ──────────────────────────────────────────────────

function TemperatureOutlook({ report, shifts, reduceMotion }: {
  report: PierCastCityReportReadV4;
  shifts: PierCastShiftCard[];
  reduceMotion: boolean;
}) {
  const points = useMemo(
    () => pierCastTimelinePoints(report.temperatureTimeline, report.timezone),
    [report.temperatureTimeline, report.timezone],
  );
  const todayDate = pierCastLocalParts(Date.now(), report.timezone)?.localDate ?? null;
  const start = points[0];
  const snapshot = (hours: number) =>
    start ? pierCastTemperatureAt(points, start.time + hours * 3_600_000) : null;
  const h12 = snapshot(12);
  const h24 = snapshot(24);
  return (
    <Card label="Temperature outlook">
      <CardHead kicker="FIVE-DAY WATER TREND" title="Temperature outlook" tag="MODELED" />
      {start ? (
        <View style={styles.snap}>
          <View style={[styles.snapTile, styles.snapTileOn]}>
            <Text style={styles.snapKey}>NOW</Text>
            <Text style={styles.snapValue}>{start.temperatureF.toFixed(1)}°</Text>
            <Text style={styles.snapSub}>Forecast start</Text>
          </View>
          <View style={styles.snapTile}>
            <Text style={styles.snapKey}>+12 HRS</Text>
            <Text style={styles.snapValue}>{h12 === null ? "—" : `${h12.toFixed(1)}°`}</Text>
            <Text style={styles.snapSub}>{h12 === null ? "Unavailable" : pierCastDeltaLabel(h12, start.temperatureF)}</Text>
          </View>
          <View style={styles.snapTile}>
            <Text style={styles.snapKey}>+24 HRS</Text>
            <Text style={styles.snapValue}>{h24 === null ? "—" : `${h24.toFixed(1)}°`}</Text>
            <Text style={styles.snapSub}>{h24 === null ? "Unavailable" : pierCastDeltaLabel(h24, start.temperatureF)}</Text>
          </View>
        </View>
      ) : null}
      {points.length > 1 ? (
        <>
          <PierCastCityTemperatureChart
            points={points}
            shifts={shifts}
            todayDate={todayDate}
            reduceMotion={reduceMotion}
          />
          <View style={styles.hint}>
            <Ionicons name="hand-left-outline" size={14} color={paper.dashboardBlue} />
            <Text style={styles.hintText}>Press and drag to read any hour · each day's low–high is under its name</Text>
          </View>
        </>
      ) : (
        <View style={styles.unavailable}>
          <Ionicons name="cloud-offline-outline" size={20} color={paper.dashboardMuted} />
          <Text style={styles.cardSub}>Water temperature guidance is unavailable right now.</Text>
        </View>
      )}
    </Card>
  );
}

// ─── Shifts ───────────────────────────────────────────────────────────────

function ShiftWatch({ shifts, points }: {
  shifts: PierCastShiftCard[];
  points: { lowF: number; highF: number } | null;
}) {
  const [whyOpen, setWhyOpen] = useState(false);
  return (
    <Card label="Water temperature shifts">
      <CardHead
        kicker="SHIFT WATCH"
        title="Water temp shifts"
        tag={shifts.length === 0 ? "NONE" : `${shifts.length} ${shifts.length === 1 ? "SHIFT" : "SHIFTS"}`}
      />
      <Text style={styles.cardSub}>
        {shifts.length > 0
          ? "Big swings the model sees in the next five days, shaded on the chart above."
          : points
          ? `No big swings in the next five days. Water holds between ${Math.floor(points.lowF)}° and ${Math.ceil(points.highF)}°F.`
          : "No shift data is available right now."}
      </Text>
      {shifts.map((shift) => {
        const cooling = shift.direction === "cooling";
        const color = cooling ? WATER_INK : "#B4541F";
        const severity = SEVERITY_STYLE[shift.severity];
        return (
          <View
            key={shift.id}
            style={styles.shift}
            accessible
            accessibilityLabel={`${shift.status}. ${severity.label.toLowerCase()} ${shift.title}. ${shift.change}, ${shift.window}.`}
          >
            <View style={[styles.shiftIcon, { backgroundColor: cooling ? "#E6F0F8" : "#FBEDE3" }]}>
              <Ionicons name={cooling ? "arrow-down" : "arrow-up"} size={18} color={color} />
            </View>
            <View style={styles.flex}>
              <View style={styles.shiftTop}>
                <Text style={[styles.shiftStatus, { color }]}>{shift.status}</Text>
                <Text style={[styles.shiftSeverity, { backgroundColor: severity.color }]}>{severity.label}</Text>
              </View>
              <Text style={styles.shiftTitle}>{shift.title}</Text>
              <Text style={styles.shiftWhen}>{shift.change}</Text>
              <Text style={styles.shiftWhen}>{shift.window}</Text>
              <View style={styles.shiftBar}>
                <View
                  style={[
                    styles.shiftFill,
                    {
                      left: `${shift.barStart * 100}%`,
                      width: `${shift.barWidth * 100}%`,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <View style={styles.shiftAxis}>
                <Text style={styles.shiftAxisText}>NOW</Text>
                <Text style={styles.shiftAxisText}>+5 DAYS</Text>
              </View>
            </View>
          </View>
        );
      })}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: whyOpen }}
        onPress={() => {
          hapticSelection();
          setWhyOpen((current) => !current);
        }}
        style={({ pressed }) => [styles.whyToggle, pressed && styles.pressed]}
      >
        <Ionicons name="information-circle-outline" size={16} color={paper.dashboardBlue} />
        <Text style={styles.whyToggleText}>What do shifts mean for fishing?</Text>
        <Ionicons name={whyOpen ? "chevron-up" : "chevron-down"} size={14} color={paper.dashboardBlue} />
      </Pressable>
      {whyOpen ? (
        <Text style={styles.whyBody}>
          A fast drop can signal an upwelling or lake turnover near the pier; a rise can mean warmer water pushing back in. The model shows the change, not its cause. A shift is flagged when water moves at least 3°F. Notable means 6°F or more within a day; major means 10°F within a day or 8°F within 12 hours.
        </Text>
      ) : null}
    </Card>
  );
}

// ─── Piers + nearby ───────────────────────────────────────────────────────

function Piers({ city }: { city: PierCastConditionsCatalogCityV4 }) {
  const structures = selectPierCastCoveredStructures(city.structures);
  if (structures.length === 0) return null;
  return (
    <Card label={`Piers at ${city.displayName}`}>
      <CardHead kicker="WHERE TO FISH" title={`Piers at ${city.displayName}`} />
      <View style={styles.pierList}>
        {structures.map((structure, index) => {
          const closed = structure.accessStatus === "reported_closed";
          const unverified = structure.accessStatus === "route_unverified";
          const detail = closed || unverified
            ? structure.limitation
            : structure.accessRoute
            ? `Access via ${structure.accessRoute.displayName}.`
            : null;
          return (
            <View key={structure.structureId} style={[styles.pier, index === 0 && styles.pierFirst]}>
              <View style={[styles.pierIcon, closed && styles.pierIconClosed]}>
                <Ionicons name={closed ? "close" : "git-commit-outline"} size={18} color={closed ? "#FFFFFF" : GOLD} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.pierName}>{structure.displayName}</Text>
                <Text style={[styles.pierStatus, closed && styles.pierStatusClosed]}>
                  {closed ? "REPORTED CLOSED" : unverified ? "ROUTE UNVERIFIED" : "CHECK POSTED ACCESS"}
                </Text>
                {detail ? <Text style={styles.pierDetail}>{detail}</Text> : null}
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

function NearbyPorts({ city, cities, onOpenCity }: {
  city: PierCastConditionsCatalogCityV4;
  cities: readonly PierCastConditionsCatalogCityV4[];
  onOpenCity: (cityId: string) => void;
}) {
  const nearby = useMemo(() => nearbyPierCastCities(city, cities), [city, cities]);
  if (nearby.length === 0) return null;
  return (
    <View style={styles.card} accessibilityLabel="Nearby pier cities">
      <View style={[styles.cardPad, styles.cardPadTight]}>
        <CardHead kicker="NEARBY PORTS" title="Explore the shoreline" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nearRail}>
        {nearby.map(({ city: port, miles }) => (
          <Pressable
            key={port.cityId}
            accessibilityRole="button"
            accessibilityLabel={`${port.displayName}${miles === null ? "" : `, ${Math.round(miles)} miles away`}. Opens its report.`}
            onPress={() => {
              hapticSelection();
              onOpenCity(port.cityId);
            }}
            style={({ pressed }) => [styles.near, pressed && styles.pressed]}
          >
            <Text style={styles.nearDistance}>{miles === null ? port.stateCode : `${Math.round(miles)} MI`}</Text>
            <Text style={styles.nearName} numberOfLines={2}>{port.displayName}</Text>
            <View style={styles.nearOpen}>
              <Text style={styles.nearOpenText}>OPEN REPORT</Text>
              <Ionicons name="chevron-forward" size={11} color={paper.dashboardBlue} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function ReportInfoSheet({ visible, onClose, disclosure }: {
  visible: boolean;
  onClose: () => void;
  disclosure: string;
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose} eyebrow="HOW RATINGS WORK" title="Reading a city report">
      <View style={styles.infoStep}>
        <View style={styles.infoNumber}><Text style={styles.infoNumberText}>1</Text></View>
        <View style={styles.flex}>
          <Text style={styles.infoStepTitle}>Each species gets a season rating</Text>
          <Text style={styles.infoStepBody}>Prime, Good, Fair, Poor or Off-season, based on when that fish usually shows up at this part of the lake.</Text>
        </View>
      </View>
      <View style={styles.infoStep}>
        <View style={styles.infoNumber}><Text style={styles.infoNumberText}>2</Text></View>
        <View style={styles.flex}>
          <Text style={styles.infoStepTitle}>Water-temp fit orders the rest</Text>
          <Text style={styles.infoStepBody}>The bar shows where today's modeled water sits against each fish's preferred range. It decides the order among species with the same rating.</Text>
        </View>
      </View>
      <View style={styles.infoStep}>
        <View style={styles.infoNumber}><Text style={styles.infoNumberText}>3</Text></View>
        <View style={styles.flex}>
          <Text style={styles.infoStepTitle}>The calendar shows each day's best bet</Text>
          <Text style={styles.infoStepBody}>The top species for that day by the same rules, using that day's season timing and average modeled water temperature.</Text>
        </View>
      </View>
      <View style={styles.legend}>
        {PIER_CAST_STANDINGS_BAND_MEANINGS.map(({ band, meaning }, index) => {
          const style = PIER_CAST_STANDINGS_BANDS[band];
          return (
            <View key={band} style={[styles.legendRow, index > 0 && styles.legendRowBorder]}>
              <View style={[styles.legendSwatch, { backgroundColor: style.color }]} />
              <Text style={styles.legendLabel}>{style.label}</Text>
              <Text style={styles.legendMeaning}>{meaning}</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.infoFine}>{disclosure}</Text>
    </BottomSheet>
  );
}

// ─── Report ───────────────────────────────────────────────────────────────

function ReportSpeciesSwitcher({
  report,
  fallbackFromSpeciesId,
  onSelect,
}: {
  report: PierCastCityReportReadV4;
  fallbackFromSpeciesId: PierCastSpeciesId | null;
  onSelect: (speciesId: PierCastSpeciesId) => void;
}) {
  const options = [...report.species].sort((left, right) =>
    Number(right.speciesId === report.selectedSpeciesId) -
      Number(left.speciesId === report.selectedSpeciesId) ||
    pierCastSpeciesName(left.speciesId).localeCompare(
      pierCastSpeciesName(right.speciesId),
    )
  );
  const substituted = fallbackFromSpeciesId !== null &&
    fallbackFromSpeciesId !== report.selectedSpeciesId;
  return (
    <View style={styles.reportSpecies}>
      {substituted ? (
        <View style={styles.reportSpeciesNotice} accessibilityRole="alert">
          <Ionicons name="swap-horizontal" size={18} color={paper.dashboardBlue} />
          <Text style={styles.reportSpeciesNoticeText}>
            {pierCastSpeciesName(fallbackFromSpeciesId)} isn&apos;t forecast here — showing {pierCastSpeciesName(report.selectedSpeciesId)}.
          </Text>
        </View>
      ) : null}
      <Text style={styles.reportSpeciesLabel}>REPORT SPECIES</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.reportSpeciesOptions}
      >
        {options.map((species) => {
          const selected = species.speciesId === report.selectedSpeciesId;
          const name = pierCastSpeciesName(species.speciesId);
          return (
            <Pressable
              key={species.speciesId}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${name} city report`}
              onPress={() => {
                if (!selected) {
                  hapticSelection();
                  onSelect(species.speciesId);
                }
              }}
              style={({ pressed }) => [
                styles.reportSpeciesOption,
                selected && styles.reportSpeciesOptionOn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[
                styles.reportSpeciesOptionText,
                selected && styles.reportSpeciesOptionTextOn,
              ]}>
                {name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function PierCastConditionsCityReport({
  city,
  cities,
  report,
  weather,
  weatherLoading,
  savedCopy,
  fallbackFromSpeciesId,
  onSelectReportSpecies,
  onOpenStandings,
  onOpenCity,
  onOpenMap,
}: {
  city: PierCastConditionsCatalogCityV4;
  cities: readonly PierCastConditionsCatalogCityV4[];
  report: PierCastCityReportReadV4;
  weather: PierCastHourlyWeatherPoint[];
  weatherLoading: boolean;
  savedCopy?: boolean;
  fallbackFromSpeciesId: PierCastSpeciesId | null;
  onSelectReportSpecies: (speciesId: PierCastSpeciesId) => void;
  onOpenStandings: (speciesId: PierCastSpeciesId) => void;
  onOpenCity: (cityId: string) => void;
  onOpenMap: () => void;
}) {
  const reduceMotion = useReduceMotion();
  const [selectedDay, setSelectedDay] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  useEffect(() => setSelectedDay(0), [report.cityId]);

  const days = useMemo(
    () => buildPierCastCityCalendar({ report, weather }),
    [report, weather],
  );
  const shifts = useMemo(
    () => buildPierCastShiftCards({ timeline: report.temperatureTimeline, timezone: report.timezone }),
    [report.temperatureTimeline, report.timezone],
  );
  const range = useMemo(() => {
    const temps = report.temperatureTimeline
      .map((point) => point.temperatureC)
      .filter(Number.isFinite)
      .map(fahrenheit);
    return temps.length ? { lowF: Math.min(...temps), highF: Math.max(...temps) } : null;
  }, [report.temperatureTimeline]);
  const waterNowF = report.currentTemperature && Number.isFinite(report.currentTemperature.temperatureC)
    ? fahrenheit(report.currentTemperature.temperatureC)
    : null;
  const daySelection = Math.min(selectedDay, Math.max(0, days.length - 1));
  const delayMessage = pierCastForecastDelayMessage({
    generatedAt: report.generatedAt,
    disclosure: report.disclosure,
    issuedAt: report.source.issuedAt,
    cycleAgeHours: report.source.cycleAgeHours,
    force: savedCopy,
  });

  return (
    <View>
      {delayMessage ? (
        <View style={styles.savedBanner}>
          <Ionicons name="time-outline" size={17} color={paper.dashboardBlue} />
          <Text style={styles.savedBannerText}>
            {savedCopy
              ? `Showing your last saved conditions report. ${delayMessage}`
              : delayMessage}
          </Text>
        </View>
      ) : null}
      <Hero
        report={report}
        city={city}
        waterNowF={waterNowF}
        onOpenStandings={onOpenStandings}
        reduceMotion={reduceMotion}
      />
      <ReportSpeciesSwitcher
        report={report}
        fallbackFromSpeciesId={fallbackFromSpeciesId}
        onSelect={onSelectReportSpecies}
      />
      <CityMapLink cityName={report.displayName} onPress={onOpenMap} />
      {days.length > 0 ? (
        <FiveDayOutlook days={days} selected={daySelection} onSelect={setSelectedDay} />
      ) : null}
      <SpeciesSection report={report} reduceMotion={reduceMotion} onOpenStandings={onOpenStandings} />
      <PierConditions
        report={report}
        weather={weather}
        weatherLoading={weatherLoading}
        days={days}
        waterNowF={waterNowF}
      />
      <TemperatureOutlook report={report} shifts={shifts} reduceMotion={reduceMotion} />
      <ShiftWatch shifts={shifts} points={range} />
      <Piers city={city} />
      <NearbyPorts city={city} cities={cities} onOpenCity={onOpenCity} />
      <View style={styles.footActions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            hapticSelection();
            setInfoOpen(true);
          }}
          style={({ pressed }) => [styles.infoButton, pressed && styles.pressed]}
        >
          <Ionicons name="information-circle-outline" size={17} color={INK} />
          <Text style={styles.infoButtonText}>How ratings work</Text>
        </Pressable>
      </View>
      <View style={styles.footCard}>
        <CornerMarkSet />
        <Text style={styles.foot}>
          Research-based outlooks, not catch guarantees. Water temps are NOAA nearshore model estimates. Always check pier conditions before you go.
        </Text>
      </View>
      <ReportInfoSheet visible={infoOpen} onClose={() => setInfoOpen(false)} disclosure={report.disclosure} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.78 },

  savedBanner: { flexDirection: "row", alignItems: "flex-start", gap: 8, margin: 14, marginBottom: 0, padding: 11, backgroundColor: "#EAF4F9", borderWidth: 1, borderColor: paper.dashboardBlueLight, borderRadius: 10 },
  savedBannerText: { flex: 1, color: paper.dashboardInkSoft, fontFamily: paperFonts.body, fontSize: 13, lineHeight: 18 },

  reportSpecies: { marginTop: 12 },
  reportSpeciesNotice: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginHorizontal: 14, padding: 11, borderWidth: 1, borderColor: paper.dashboardBlueLight, borderRadius: 10, backgroundColor: "#EAF4F9" },
  reportSpeciesNoticeText: { flex: 1, color: paper.dashboardInkSoft, fontFamily: paperFonts.bodySemiBold, fontSize: 13, lineHeight: 18 },
  reportSpeciesLabel: { marginTop: 12, marginHorizontal: 16, color: paper.dashboardInkSoft, fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.4 },
  reportSpeciesOptions: { gap: 8, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 2 },
  reportSpeciesOption: { minHeight: 38, justifyContent: "center", paddingHorizontal: 13, borderWidth: 1.5, borderColor: paper.dashboardLine, borderRadius: 19, backgroundColor: "#FFFFFF" },
  reportSpeciesOptionOn: { borderColor: INK, backgroundColor: INK },
  reportSpeciesOptionText: { color: INK, fontFamily: paperFonts.bodySemiBold, fontSize: 13 },
  reportSpeciesOptionTextOn: { color: "#FFFFFF" },

  hero: { overflow: "hidden", backgroundColor: INK, paddingHorizontal: 20, paddingTop: 22, paddingBottom: 22 },
  heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  heroKicker: { flexShrink: 1, fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 2, color: GOLD },
  fresh: { flexDirection: "row", alignItems: "center", gap: 6 },
  freshDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: paper.bandPrime },
  freshText: { fontFamily: paperFonts.metaMono, fontSize: 11, color: "rgba(255,255,255,0.66)" },
  heroCity: { marginTop: 10, fontFamily: paperFonts.display, fontSize: 42, lineHeight: 48, color: "#FFFFFF" },
  heroPier: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  heroPierText: { flexShrink: 1, fontFamily: paperFonts.body, fontSize: 15, color: "rgba(255,255,255,0.78)" },
  pick: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 18, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1.5, borderColor: "rgba(232,160,46,0.7)", borderRadius: 14, backgroundColor: "rgba(232,160,46,0.10)" },
  pickWeak: { borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.06)" },
  pickFish: { width: 104, height: 58, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  pickKicker: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.8, color: GOLD },
  pickName: { fontFamily: paperFonts.display, fontSize: 19, lineHeight: 23, color: "#FFFFFF" },
  pickLine: { fontFamily: paperFonts.body, fontSize: 13, lineHeight: 17, color: "rgba(255,255,255,0.74)" },
  stats: { flexDirection: "row", marginTop: 18, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.14)" },
  stat: { flex: 1, alignItems: "center", paddingTop: 12, paddingHorizontal: 4 },
  statDivider: { borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.14)" },
  statLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.4, color: "rgba(255,255,255,0.58)" },
  statValue: { marginTop: 4, fontFamily: paperFonts.display, fontSize: 20, color: "#FFFFFF" },
  statPrime: { color: "#7EDC98" },

  cityMapLink: { minHeight: 62, flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12, marginHorizontal: 14, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 13, backgroundColor: INK },
  cityMapIcon: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.07)" },
  cityMapTitle: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.5, color: "#FFFFFF" },
  cityMapSub: { marginTop: 2, fontFamily: paperFonts.body, fontSize: 12, color: "rgba(255,255,255,0.7)" },
  cityMapOpen: { flexDirection: "row", alignItems: "center", gap: 2 },
  cityMapOpenText: { fontFamily: paperFonts.metaMonoBold, fontSize: 9, letterSpacing: 1, color: paper.gold },

  card: { marginTop: 16, marginHorizontal: 14, overflow: "hidden", backgroundColor: paper.dashboardWhite, borderWidth: 2, borderColor: INK, borderRadius: 16, ...paperShadows.hard },
  cardPad: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 16 },
  cardPadTight: { paddingBottom: 0 },
  head: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  kicker: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.8, color: paper.dashboardBlue },
  cardTitle: { marginTop: 3, fontFamily: paperFonts.display, fontSize: 23, lineHeight: 27, color: INK },
  tag: { overflow: "hidden", paddingHorizontal: 9, paddingVertical: 5, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.16)", borderRadius: 6, fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.2, color: "#555555" },
  cardSub: { marginTop: 6, fontFamily: paperFonts.body, fontSize: 14, lineHeight: 19, color: "#444444" },

  cal: { flexDirection: "row", gap: 6, marginTop: 14 },
  day: { flex: 1, overflow: "hidden", borderWidth: 1.5, borderColor: "rgba(0,0,0,0.14)", borderRadius: 12, backgroundColor: "#FFFFFF" },
  dayOn: { borderWidth: 2, borderColor: INK, shadowColor: INK, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 3 },
  dayTop: { alignItems: "center", paddingTop: 8, paddingBottom: 6 },
  dayLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1, color: "#555555" },
  dayDate: { fontFamily: paperFonts.display, fontSize: 20, lineHeight: 23, color: INK },
  dayBand: { alignItems: "center", gap: 2, paddingTop: 7, paddingBottom: 6, paddingHorizontal: 2 },
  dayFish: { width: 44, height: 22, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  dayBandText: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 0.6 },
  dayAir: { paddingVertical: 6, textAlign: "center", fontFamily: paperFonts.metaMonoBold, fontSize: 10, color: "#555555", backgroundColor: "#FAFAF7", borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
  calNote: { marginTop: 12, textAlign: "center", fontFamily: paperFonts.body, fontSize: 14, lineHeight: 19, color: "#444444" },
  calNoteStrong: { fontFamily: paperFonts.bodyBold, color: INK },

  sp: { overflow: "hidden", marginTop: 10, paddingVertical: 14, paddingRight: 14, paddingLeft: 18, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.12)", borderRadius: 14, backgroundColor: "#FFFFFF", gap: 10 },
  spEdge: { position: "absolute", left: 0, top: 0, bottom: 0, width: 6 },
  spTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  spRank: { width: 24, fontFamily: paperFonts.metaMonoBold, fontSize: 14, color: "#777777" },
  spFish: { width: 84, height: 50, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  spName: { fontFamily: paperFonts.display, fontSize: 19, lineHeight: 23, color: INK },
  spChips: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 4 },
  spStand: { overflow: "hidden", paddingHorizontal: 6, paddingVertical: 3, borderWidth: 1, borderColor: "rgba(212,175,55,0.6)", borderRadius: 5, backgroundColor: "#FBF3DC", fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 0.6, color: "#6B5310" },
  notRated: { minHeight: 26, justifyContent: "center", paddingHorizontal: 9, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.2)", borderRadius: 6, backgroundColor: paper.dashboardCream },
  notRatedText: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.1, color: "#555555" },
  spRows: { flexDirection: "row", gap: 12 },
  spKey: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.4, color: "#666666" },
  spValue: { marginTop: 3, fontFamily: paperFonts.bodyBold, fontSize: 14, color: INK },
  spSub: { marginTop: 5, fontFamily: paperFonts.body, fontSize: 12, color: "#666666" },
  fitWrap: { marginTop: 7, height: 14, justifyContent: "center" },
  fitBar: { flexDirection: "row", height: 6, borderRadius: 3, overflow: "hidden", gap: 2 },
  fitBarEmpty: { marginTop: 11, backgroundColor: "#E6E6E0" },
  fitSeg: { height: 6 },
  fitPin: { position: "absolute", top: 0, width: 14, height: 14, marginLeft: -7, borderRadius: 7, borderWidth: 3, borderColor: INK, backgroundColor: "#FFFFFF" },
  moreButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 46, marginTop: 10, borderWidth: 1.5, borderColor: INK, borderRadius: 12, backgroundColor: "#FFFFFF" },
  moreText: { fontFamily: paperFonts.bodyBold, fontSize: 14, color: INK },

  now3: { flexDirection: "row", gap: 8, marginTop: 14 },
  nowTile: { flex: 1, paddingHorizontal: 10, paddingVertical: 11, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.1)", borderTopWidth: 4, borderRadius: 12 },
  nowKey: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.4, color: "#555555" },
  nowValue: { marginTop: 5, fontFamily: paperFonts.display, fontSize: 21, lineHeight: 25, color: INK },
  nowSub: { marginTop: 2, fontFamily: paperFonts.body, fontSize: 12, color: "#666666" },
  stripHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16 },
  stripKey: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.2, color: "#333333" },
  stripKeyMuted: { color: "#888888" },
  conditionDays: { flexDirection: "row", gap: 6, marginTop: 10 },
  conditionDay: { flex: 1, minWidth: 0, alignItems: "center", justifyContent: "center", minHeight: 48, paddingHorizontal: 2, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.12)", borderRadius: 10, backgroundColor: "#FFFFFF" },
  conditionDayOn: { borderColor: paper.dashboardBlue, backgroundColor: "#EEF6FA" },
  conditionDayName: { fontFamily: paperFonts.metaMonoBold, fontSize: 8, letterSpacing: 0.7, color: "#666666" },
  conditionDayNumber: { marginTop: 1, fontFamily: paperFonts.metaMonoBold, fontSize: 13, color: INK },
  conditionDayTextOn: { color: paper.dashboardBlue },
  strip: { gap: 8, paddingTop: 10, paddingBottom: 2 },
  hour: { width: HOUR_CARD_WIDTH, alignItems: "center", paddingHorizontal: 4, paddingVertical: 10, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.1)", borderRadius: 12, backgroundColor: "#FFFFFF" },
  hourNow: { backgroundColor: "#EEF6FA", borderColor: paper.dashboardBlue },
  hourTime: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1, color: "#555555" },
  hourWater: { marginTop: 6, fontFamily: paperFonts.metaMonoBold, fontSize: 15, color: WATER_INK },
  hourAir: { marginTop: 4, fontFamily: paperFonts.body, fontSize: 12, color: "#666666" },
  hourWind: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 },
  hourWindText: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, color: WIND_INK },

  snap: { flexDirection: "row", gap: 8, marginTop: 14 },
  snapTile: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12 },
  snapTileOn: { backgroundColor: "#EEF6FA", borderColor: paper.dashboardBlueLight },
  snapKey: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.4, color: paper.dashboardBlue },
  snapValue: { marginTop: 3, fontFamily: paperFonts.metaMonoBold, fontSize: 20, color: INK },
  snapSub: { marginTop: 1, fontFamily: paperFonts.body, fontSize: 12, color: "#666666" },
  hint: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  hintText: { flexShrink: 1, fontFamily: paperFonts.bodySemiBold, fontSize: 12, color: paper.dashboardBlue },
  unavailable: { minHeight: 100, alignItems: "center", justifyContent: "center", gap: 7 },

  shift: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginTop: 12, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.08)" },
  shiftIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  shiftTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  shiftStatus: { flexShrink: 1, fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.4 },
  shiftSeverity: { overflow: "hidden", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5, fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.2, color: "#FFFFFF" },
  shiftTitle: { marginTop: 2, fontFamily: paperFonts.display, fontSize: 19, lineHeight: 23, color: INK },
  shiftWhen: { marginTop: 3, fontFamily: paperFonts.body, fontSize: 13, lineHeight: 18, color: "#444444" },
  shiftBar: { overflow: "hidden", height: 8, marginTop: 8, borderRadius: 4, backgroundColor: "#EDEDE8" },
  shiftFill: { position: "absolute", top: 0, bottom: 0, borderRadius: 4 },
  shiftAxis: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  shiftAxisText: { fontFamily: paperFonts.metaMonoBold, fontSize: 9, color: "#888888" },
  whyToggle: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 40, marginTop: 8 },
  whyToggleText: { fontFamily: paperFonts.bodyBold, fontSize: 13, color: paper.dashboardBlue },
  whyBody: { overflow: "hidden", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: "#F1F5F4", fontFamily: paperFonts.body, fontSize: 13, lineHeight: 19, color: "#3A4A48" },

  pierList: { marginTop: 8 },
  pier: { flexDirection: "row", gap: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.07)" },
  pierFirst: { borderTopWidth: 0 },
  pierIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: INK },
  pierIconClosed: { backgroundColor: "#9B2822" },
  pierName: { fontFamily: paperFonts.bodyBold, fontSize: 16, color: INK },
  pierStatus: { marginTop: 2, fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.2, color: paper.dashboardBlue },
  pierStatusClosed: { color: "#9B2822" },
  pierDetail: { marginTop: 3, fontFamily: paperFonts.body, fontSize: 13, lineHeight: 18, color: "#555555" },

  nearRail: { gap: 10, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  near: { width: 132, padding: 12, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, backgroundColor: paper.dashboardCream },
  nearDistance: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.2, color: "#666666" },
  nearName: { marginTop: 3, fontFamily: paperFonts.display, fontSize: 18, lineHeight: 22, color: INK },
  nearOpen: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  nearOpenText: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1, color: paper.dashboardBlue },

  footActions: { alignItems: "center", marginTop: 22, marginHorizontal: 14 },
  infoButton: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 42, paddingHorizontal: 16, borderWidth: 1.5, borderColor: INK, borderRadius: 21, backgroundColor: "#FFFFFF" },
  infoButtonText: { fontFamily: paperFonts.bodyBold, fontSize: 14, color: INK },
  footCard: { overflow: "hidden", marginTop: 16, marginHorizontal: 14, marginBottom: 8, paddingHorizontal: 22, paddingVertical: 18, borderRadius: 12, backgroundColor: "#F7F2E6" },
  foot: { textAlign: "center", fontFamily: paperFonts.body, fontSize: 12, lineHeight: 17, color: "#777777" },

  infoStep: { flexDirection: "row", gap: 12, marginTop: 16 },
  infoNumber: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: INK },
  infoNumberText: { fontFamily: paperFonts.display, fontSize: 15, color: "#FFFFFF" },
  infoStepTitle: { fontFamily: paperFonts.bodyBold, fontSize: 16, color: INK },
  infoStepBody: { marginTop: 2, fontFamily: paperFonts.body, fontSize: 14, lineHeight: 20, color: "#444444" },
  legend: { marginTop: 18, borderWidth: 1, borderColor: paper.dashboardLine, borderRadius: 12, backgroundColor: "#FFFFFF" },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 11 },
  legendRowBorder: { borderTopWidth: 1, borderTopColor: paper.dashboardHair },
  legendSwatch: { width: 14, height: 14, borderRadius: 4 },
  legendLabel: { width: 90, fontFamily: paperFonts.bodyBold, fontSize: 14, color: INK },
  legendMeaning: { flexShrink: 1, fontFamily: paperFonts.body, fontSize: 13, color: "#555555" },
  infoFine: { marginTop: 14, fontFamily: paperFonts.body, fontSize: 12, lineHeight: 17, color: "#777777" },
});
