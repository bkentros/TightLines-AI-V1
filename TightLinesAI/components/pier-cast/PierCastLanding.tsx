/**
 * PierCast landing (1.18). Replaces the Standings leaderboard with four
 * calm, non-ranked sections:
 *
 *   1. Hero: pierhead-lighthouse artwork and the lakes right now (water
 *      range, coldest and warmest pier) with a Live Lake Map shortcut.
 *   2. Find your PierCast: search, Near me, and a lake index by shoreline.
 *   3. My Piers: up to five saved cities in a swipeable carousel with city
 *      tabs. Each card shows water now, a five-day water line, and today's
 *      best trout/salmon species with its water fit.
 *   4. Water temp swings: collapsible list of 6°F+ swings at every pier, from
 *      the same rule as each City Report's "Water temp shifts".
 *
 * Every number comes from data the app already loads (catalog + conditions
 * summary map + per-species conditions for saved piers). Nothing on this page
 * orders cities against each other.
 */
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  LayoutAnimation,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";

import {
  fetchPierCastConditionsSummaryMap,
  fetchPierCastTargetConditionsForApp,
  type PierCastTargetConditionsResponse,
} from "../../lib/pierCast";
import { pierCastSpeciesName, pierCastWaterFitFromThermal } from "../../lib/pierCastCityReportPresentation";
import { PIER_CAST_STATE_LABELS } from "../../lib/pierCastConditionsPresentation";
import type {
  PierCastConditionsCatalogCityV4,
  PierCastConditionsCatalogResponseV4,
  PierCastConditionsMapResponseV4,
  PierCastGreatLakeIdV4,
} from "../../lib/pierCastConditionsV4";
import type { PierCastSpeciesId } from "../../lib/pierCastContracts";
import { selectPierCastCoveredStructures } from "../../lib/pierCastCoveredStructures";
import { PIER_CAST_LAKE_SHAPES, pierCastLakePoint } from "../../lib/pierCastLakeShapes";
import {
  buildPierCastLakeSnapshot,
  buildPierCastLandingSwings,
  buildPierCastShoreGroups,
  buildPierCastSparkline,
  formatPierCastMiles,
  nearestPierCastCities,
  PIER_CAST_MAX_SAVED_CITIES,
  pickPierCastTopSalmonid,
  pierCastAgeLabel,
  type PierCastCoordinate,
  type PierCastLandingSwing,
  pierCastRelativeDay,
  pierCastSalmonidsFor,
  type PierCastSalmonidPick,
  pierCastSampleSwing,
  type PierCastShoreGroup,
  pierCastSwingSummary,
  searchPierCastCities,
} from "../../lib/pierCastLanding";
import {
  pierCastLakeName,
} from "../../lib/pierCastStandingsPresentation";
import {
  pierCastWaterFitLabelV18,
  projectPierCastThermalMatchV18,
} from "../../lib/pierCastTemperatureFitV18";
import { hapticSelection } from "../../lib/safeHaptics";
import { paper, paperFonts, paperShadows } from "../../lib/theme";
import { usePaperBonePulse } from "../../lib/usePaperBonePulse";
import { PierCastLighthouseArt } from "./PierCastLighthouseArt";
import { BandChip, Reveal, useReduceMotion } from "./PierCastShared";
import { PierCastFishCrop, PierCastWaterGauge } from "./PierCastStatStrip";

const INK = paper.dashboardInk;
const GOLD = paper.gold;
const CREAM = "#F7F2E6";
const COLD = "#2F86C9";
const WARM = "#E0772F";
const SWINGS_OPEN_KEY = "tightlines_pier_cast_swings_open_v1";
const TARGET_CONDITIONS_CACHE_MS = 10 * 60 * 1000;
const SIDE = 14;
const PEEK = 26;
const CARD_GAP = 10;

const stateName = (code: string) => PIER_CAST_STATE_LABELS[code] ?? code;
type Timeline = PierCastConditionsMapResponseV4["cities"][number]["temperatureTimeline"];

// ─── Data ─────────────────────────────────────────────────────────────────

const targetConditionsCache = new Map<
  PierCastSpeciesId,
  { at: number; conditions: PierCastTargetConditionsResponse }
>();

async function loadSalmonidConditions(
  speciesIds: readonly PierCastSpeciesId[],
  force: boolean,
): Promise<PierCastTargetConditionsResponse[]> {
  const results = await Promise.all(speciesIds.map(async (speciesId) => {
    const cached = targetConditionsCache.get(speciesId);
    if (!force && cached && Date.now() - cached.at < TARGET_CONDITIONS_CACHE_MS) return cached.conditions;
    try {
      const conditions = await fetchPierCastTargetConditionsForApp(speciesId);
      targetConditionsCache.set(speciesId, { at: Date.now(), conditions });
      return conditions;
    } catch {
      return cached?.conditions ?? null;
    }
  }));
  return results.filter((conditions): conditions is PierCastTargetConditionsResponse => conditions !== null);
}

// ─── Shared bits ──────────────────────────────────────────────────────────

function SectionHead({ kicker, title, right }: { kicker: string; title: string; right?: ReactNode }) {
  return (
    <View style={styles.sectionHead}>
      <View style={styles.flex}>
        <Text style={styles.sectionKicker}>{kicker}</Text>
        <Text style={styles.sectionTitle} accessibilityRole="header">{title}</Text>
      </View>
      {right}
    </View>
  );
}

// ─── 1. Hero ──────────────────────────────────────────────────────────────

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
/** "MONDAY · OCT 19" in the viewer's local time. */
function todayLabel(now = new Date()): string {
  return `${DAYS[now.getDay()]} · ${MONTHS[now.getMonth()]} ${now.getDate()}`;
}

function Hero({
  summary,
  loading,
  onOpenMap,
  reduceMotion,
}: {
  summary: PierCastConditionsMapResponseV4 | null;
  loading: boolean;
  onOpenMap: () => void;
  reduceMotion: boolean;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const artWidth = Math.min(windowWidth, 640);
  const snapshot = useMemo(() => buildPierCastLakeSnapshot(summary), [summary]);
  const bone = usePaperBonePulse({ from: 0.3, to: 0.6 });
  const value = (text: string | null) =>
    text === null && loading
      ? <Animated.View style={[styles.statBone, { opacity: bone }]} />
      : <Text style={styles.statValue}>{text ?? "—"}</Text>;
  return (
    <View style={styles.hero}>
      <View style={styles.artWrap}>
        <PierCastLighthouseArt width={artWidth} reduceMotion={reduceMotion} />
        <View style={styles.artText} pointerEvents="none">
          <Text style={styles.heroEyebrow}>{todayLabel()}</Text>
          <Text style={styles.heroTitle} accessibilityRole="header">The lakes{"\n"}right now</Text>
        </View>
        <View style={styles.artFade} pointerEvents="none" />
      </View>
      <Reveal token="landing-stats" reduceMotion={reduceMotion}>
        <View style={styles.statsCard}>
          <View style={styles.statsHead}>
            <Text style={styles.statsKicker}>LIVE NEARSHORE WATER</Text>
            {snapshot ? (
              <View style={styles.fresh}>
                <View style={styles.freshDot} />
                <Text style={styles.freshText}>
                  {snapshot.pierCount} piers · {pierCastAgeLabel(snapshot.generatedAt)}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>RANGE</Text>
              {value(snapshot ? `${Math.round(snapshot.lowF)}–${Math.round(snapshot.highF)}°` : null)}
              <Text style={styles.statSub}>across PierCast</Text>
            </View>
            <View style={[styles.stat, styles.statDivider]}>
              <View style={styles.statLabelRow}>
                <View style={[styles.statDot, { backgroundColor: COLD }]} />
                <Text style={styles.statLabel}>COLDEST</Text>
              </View>
              {value(snapshot ? `${Math.round(snapshot.coldest.tempF)}°` : null)}
              <Text style={styles.statSub} numberOfLines={1}>{snapshot?.coldest.name ?? " "}</Text>
            </View>
            <View style={[styles.stat, styles.statDivider]}>
              <View style={styles.statLabelRow}>
                <View style={[styles.statDot, { backgroundColor: WARM }]} />
                <Text style={styles.statLabel}>WARMEST</Text>
              </View>
              {value(snapshot ? `${Math.round(snapshot.warmest.tempF)}°` : null)}
              <Text style={styles.statSub} numberOfLines={1}>{snapshot?.warmest.name ?? " "}</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open the Live Lake Map: water temperature, wind, waves and alerts"
            onPress={() => {
              hapticSelection();
              onOpenMap();
            }}
            style={({ pressed }) => [styles.mapCta, pressed && styles.pressed]}
          >
            <View style={styles.mapCtaIcon}><Ionicons name="map" size={16} color={INK} /></View>
            <View style={styles.flex}>
              <Text style={styles.mapCtaTitle}>Live Lake Map</Text>
              <Text style={styles.mapCtaSub}>Water temp · wind · waves · alerts</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={INK} />
          </Pressable>
        </View>
      </Reveal>
    </View>
  );
}

// ─── 2. Find your PierCast: search + lake index ───────────────────────────

type NearState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "denied" }
  | { status: "error" }
  | { status: "ready"; results: Array<{ city: PierCastConditionsCatalogCityV4; miles: number }> };

function StarButton({ saved, onPress, label }: { saved: boolean; onPress: () => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      accessibilityLabel={saved ? `Remove ${label} from My Piers` : `Save ${label} to My Piers`}
      hitSlop={8}
      onPress={() => {
        hapticSelection();
        onPress();
      }}
      style={({ pressed }) => [styles.star, saved && styles.starOn, pressed && styles.pressed]}
    >
      <Ionicons name={saved ? "star" : "star-outline"} size={16} color={saved ? "#8A6A14" : "#6B6B6B"} />
    </Pressable>
  );
}

function CityRow({
  city,
  lakeId,
  meta,
  saved,
  onOpen,
  onToggleSaved,
}: {
  city: PierCastConditionsCatalogCityV4;
  lakeId: PierCastGreatLakeIdV4 | undefined;
  meta?: string;
  saved: boolean;
  onOpen: () => void;
  onToggleSaved: () => void;
}) {
  const line = [stateName(city.stateCode), lakeId ? `Lake ${pierCastLakeName(lakeId)}` : null].filter(Boolean).join(" · ");
  return (
    <View style={styles.cityRow}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${city.displayName}, ${line}${meta ? `, ${meta}` : ""}. Opens the city report.`}
        onPress={() => {
          hapticSelection();
          onOpen();
        }}
        style={({ pressed }) => [styles.cityRowMain, pressed && styles.pressedSoft]}
      >
        <View style={styles.cityPin}>
          <Ionicons name="location" size={15} color={paper.dashboardBlue} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.cityRowName}>{city.displayName}</Text>
          <Text style={styles.cityRowMeta} numberOfLines={1}>{line}</Text>
        </View>
        {meta ? <Text style={styles.cityRowDistance}>{meta}</Text> : null}
        <Ionicons name="chevron-forward" size={16} color={INK} style={styles.dim} />
      </Pressable>
      <StarButton saved={saved} label={city.displayName} onPress={onToggleSaved} />
    </View>
  );
}

function LakeGlyph({
  group,
  mapPoints,
  selected,
  size,
}: {
  group: PierCastShoreGroup;
  mapPoints: ReadonlyMap<string, PierCastCoordinate>;
  selected: boolean;
  size: number;
}) {
  const shape = PIER_CAST_LAKE_SHAPES[group.lakeId];
  const pad = 8;
  const vbW = shape.width + pad * 2;
  const vbH = shape.height + pad * 2;
  const scale = size / Math.max(vbW, vbH);
  return (
    <Svg
      width={vbW * scale}
      height={vbH * scale}
      viewBox={`${-pad} ${-pad} ${vbW} ${vbH}`}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Path
        d={shape.d}
        fill={selected ? "#2A5A7E" : paper.dashboardBlueSky}
        stroke={selected ? "#7CB8DA" : INK}
        strokeWidth={1.6 / scale}
        strokeLinejoin="round"
      />
      {group.cities.map((city) => {
        const point = mapPoints.get(city.cityId);
        if (!point) return null;
        const at = pierCastLakePoint(shape, point.latitude, point.longitude);
        return (
          <Circle
            key={city.cityId}
            cx={at.x}
            cy={at.y}
            r={2.3 / scale}
            fill={GOLD}
            stroke={selected ? "#FFFFFF" : INK}
            strokeWidth={0.8 / scale}
          />
        );
      })}
    </Svg>
  );
}

function LakeTile({
  group,
  mapPoints,
  selected,
  wide,
  onPress,
}: {
  group: PierCastShoreGroup;
  mapPoints: ReadonlyMap<string, PierCastCoordinate>;
  selected: boolean;
  wide: boolean;
  onPress: () => void;
}) {
  const count = group.cities.length;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: selected }}
      accessibilityLabel={`${group.lakeName}${group.shore ? `, ${group.shore}` : ""}, ${count} pier ${count === 1 ? "city" : "cities"}`}
      onPress={() => {
        hapticSelection();
        onPress();
      }}
      style={({ pressed }) => [
        styles.tile,
        wide ? styles.tileWide : styles.tileHalf,
        selected && styles.tileOn,
        pressed && styles.pressedSoft,
      ]}
    >
      <View style={[styles.tileArt, wide && styles.tileArtWide]}>
        <LakeGlyph group={group} mapPoints={mapPoints} selected={selected} size={wide ? 80 : 82} />
      </View>
      <View style={wide ? styles.flex : null}>
        <Text style={[styles.tileLake, selected && styles.textOnInk]} numberOfLines={1}>{group.lakeName}</Text>
        <Text style={[styles.tileShore, selected && styles.textOnInkSoft]} numberOfLines={1}>
          {[group.shore, group.states.join(" & ")].filter(Boolean).join(" · ")}
        </Text>
        <View style={[styles.tileCount, selected && styles.tileCountOn]}>
          <Text style={[styles.tileCountText, selected && styles.tileCountTextOn]}>
            {count} {count === 1 ? "PIER" : "PIERS"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function Finder({
  cities,
  cityLakes,
  mapPoints,
  shorelineLoading,
  savedCityIds,
  notice,
  onOpenCity,
  onToggleSaved,
  inputRef,
}: {
  cities: readonly PierCastConditionsCatalogCityV4[];
  cityLakes: ReadonlyMap<string, PierCastGreatLakeIdV4>;
  mapPoints: ReadonlyMap<string, PierCastCoordinate>;
  shorelineLoading: boolean;
  savedCityIds: readonly string[];
  notice: string | null;
  onOpenCity: (cityId: string) => void;
  onToggleSaved: (cityId: string) => void;
  inputRef: React.RefObject<TextInput | null>;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [near, setNear] = useState<NearState>({ status: "idle" });
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const results = useMemo(() => searchPierCastCities(cities, query, PIER_CAST_STATE_LABELS), [cities, query]);
  const groups = useMemo(() => buildPierCastShoreGroups(cities, cityLakes), [cities, cityLakes]);
  const selectedGroup = groups.find((group) => group.id === openGroup) ?? null;
  const saved = (cityId: string) => savedCityIds.includes(cityId);
  const searching = query.trim().length > 0;

  const findNearMe = useCallback(async () => {
    hapticSelection();
    setQuery("");
    setOpenGroup(null);
    setNear({ status: "locating" });
    try {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") ({ status } = await Location.requestForegroundPermissionsAsync());
      if (status !== "granted") {
        setNear({ status: "denied" });
        return;
      }
      const last = await Location.getLastKnownPositionAsync({ maxAge: 30 * 60 * 1000 });
      const position = last ?? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setNear({
        status: "ready",
        results: nearestPierCastCities(
          { latitude: position.coords.latitude, longitude: position.coords.longitude },
          cities,
          mapPoints,
          3,
        ),
      });
    } catch {
      setNear({ status: "error" });
    }
  }, [cities, mapPoints]);

  const rows = (list: Array<{ city: PierCastConditionsCatalogCityV4; meta?: string }>) =>
    list.map(({ city, meta }) => (
      <CityRow
        key={city.cityId}
        city={city}
        lakeId={cityLakes.get(city.cityId)}
        meta={meta}
        saved={saved(city.cityId)}
        onOpen={() => onOpenCity(city.cityId)}
        onToggleSaved={() => onToggleSaved(city.cityId)}
      />
    ));

  return (
    <View style={styles.finder}>
      <View style={styles.finderTop}>
        <View pointerEvents="none" style={[styles.corner, styles.cornerTL, { borderColor: GOLD }]} />
        <View pointerEvents="none" style={[styles.corner, styles.cornerTR, { borderColor: GOLD }]} />
        <View style={styles.finderBadge}>
          <Ionicons name="compass" size={22} color={GOLD} />
        </View>
        <Text style={styles.finderKicker}>— FIND YOUR PIERCAST —</Text>
        <Text style={styles.finderTitle} accessibilityRole="header">Where are you fishing?</Text>
        <View style={[styles.search, focused && styles.searchFocused]}>
          <Ionicons name="search" size={19} color={focused ? paper.dashboardBlue : "#5A5A5A"} />
          <TextInput
            ref={inputRef}
            value={query}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChangeText={(text) => {
              setQuery(text);
              if (text.trim()) setNear({ status: "idle" });
            }}
            placeholder="City or state"
            placeholderTextColor="#8A8A8A"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.searchInput}
            accessibilityLabel="Search PierCast cities"
          />
          {query.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={8}
              onPress={() => setQuery("")}
              style={styles.searchClear}
            >
              <Ionicons name="close" size={14} color={INK} />
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Find the pier cities nearest you"
              onPress={() => void findNearMe()}
              style={({ pressed }) => [styles.nearButton, pressed && styles.pressed]}
            >
              {near.status === "locating"
                ? <ActivityIndicator size="small" color={GOLD} />
                : <Ionicons name="navigate" size={14} color={GOLD} />}
              <Text style={styles.nearText}>Near me</Text>
            </Pressable>
          )}
        </View>
        {notice ? (
          <View style={styles.notice} accessibilityRole="alert">
            <Ionicons name="star" size={13} color={GOLD} />
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.finderBody}>
        {searching ? (
          <View>
            <Text style={styles.resultsLabel}>{results.length} {results.length === 1 ? "CITY" : "CITIES"}</Text>
            {rows(results.map((city) => ({ city })))}
            {results.length === 0 ? (
              <Text style={styles.finderEmpty}>No pier cities match “{query.trim()}”. Try a nearby town or the state name.</Text>
            ) : null}
          </View>
        ) : near.status === "ready" || near.status === "denied" || near.status === "error" ? (
          <View>
            <View style={styles.resultsHead}>
              <Text style={styles.resultsLabel}>CLOSEST TO YOU</Text>
              <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setNear({ status: "idle" })}>
                <Text style={styles.resultsClose}>Close</Text>
              </Pressable>
            </View>
            {near.status === "ready" ? rows(near.results.map(({ city, miles }) => ({ city, meta: formatPierCastMiles(miles) }))) : (
              <Text style={styles.finderEmpty}>
                {near.status === "denied"
                  ? "Location is off for FinFindr. Turn it on in Settings, or search by city."
                  : "Couldn't find your location just now. Try again, or search by city."}
              </Text>
            )}
          </View>
        ) : null}

        {!searching ? (
          <>
            <Text style={[styles.resultsLabel, styles.indexLabel]}>BROWSE BY SHORELINE</Text>
            <View style={styles.tiles}>
              {groups.map((group, index) => (
                <LakeTile
                  key={group.id}
                  group={group}
                  mapPoints={mapPoints}
                  selected={group.id === openGroup}
                  wide={groups.length % 2 === 1 && index === groups.length - 1}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setOpenGroup(group.id === openGroup ? null : group.id);
                  }}
                />
              ))}
            </View>
            {groups.length === 0 ? (
              <Text style={styles.finderEmpty}>
                {shorelineLoading
                  ? "Loading the shoreline…"
                  : "Shoreline browsing isn't available right now. Search and Near me still work."}
              </Text>
            ) : null}
            {selectedGroup ? (
              <View style={styles.groupList}>
                <Text style={styles.groupListTitle}>
                  {`${selectedGroup.lakeName}${selectedGroup.shore ? ` · ${selectedGroup.shore}` : ""}`.toUpperCase()}
                </Text>
                {rows(selectedGroup.cities.map((city) => ({ city })))}
              </View>
            ) : null}
          </>
        ) : null}
      </View>
    </View>
  );
}

// ─── 3. My Piers ──────────────────────────────────────────────────────────

function Sparkline({ timeline, width }: { timeline: Timeline | undefined; width: number }) {
  const line = useMemo(() => (timeline ? buildPierCastSparkline(timeline) : null), [timeline]);
  const height = 40;
  if (!line) return <View style={[styles.sparkEmpty, { width, height }]} />;
  const pad = 4;
  const xy = line.points.map(([x, y]) => [pad + x * (width - pad * 2), pad + y * (height - pad * 2)] as const);
  const path = xy.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${path} L${xy[xy.length - 1]![0].toFixed(1)},${height} L${xy[0]![0].toFixed(1)},${height} Z`;
  return (
    <Svg width={width} height={height} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Defs>
        <LinearGradient id="pcSpark" x1="0" y1="0" x2="0" y2="1">
          <Stop offset={0} stopColor={paper.dashboardBlue} stopOpacity={0.28} />
          <Stop offset={1} stopColor={paper.dashboardBlue} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={area} fill="url(#pcSpark)" />
      <Path d={path} stroke={paper.dashboardBlue} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <Rect x={xy[0]![0] - 3.5} y={xy[0]![1] - 3.5} width={7} height={7} rx={3.5} fill={GOLD} stroke={INK} strokeWidth={1.2} />
    </Svg>
  );
}

function SalmonidPick({ pick, loading }: { pick: PierCastSalmonidPick | null; loading: boolean }) {
  const bone = usePaperBonePulse({ from: 0.3, to: 0.6 });
  if (!pick) {
    return loading ? (
      <Animated.View style={[styles.pickBone, { opacity: bone }]} />
    ) : (
      <Text style={styles.pickNone}>No trout or salmon forecast for this pier right now.</Text>
    );
  }
  const { row, speciesId } = pick;
  const rated = row.rankingDisposition === "ranked" && row.seasonalOutlook.status === "available";
  const band = row.seasonalOutlook.status === "available" ? row.seasonalOutlook.band : null;
  const thermal = projectPierCastThermalMatchV18(speciesId, row.thermalMatch);
  const fit = pierCastWaterFitFromThermal(thermal);
  const fitLabel = pierCastWaterFitLabelV18(thermal);
  return (
    <View>
      <View style={styles.pickRow}>
        <View style={styles.pickFish}>
          <PierCastFishCrop speciesId={speciesId} width={74} height={36} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.pickKicker} numberOfLines={1}>BEST TROUT & SALMON</Text>
          <Text style={styles.pickName} numberOfLines={1}>{pierCastSpeciesName(speciesId)}</Text>
        </View>
        {rated && band ? (
          <BandChip band={band} small />
        ) : (
          <View style={styles.unratedChip}><Text style={styles.unratedChipText}>NOT RATED</Text></View>
        )}
      </View>
      <View style={styles.fitHead}>
        <Text style={styles.fitKey}>
          WATER{fit ? ` ${Math.round(fit.temperatureF)}°F` : ""}{"  "}
          <Text style={styles.fitPhrase}>{fitLabel ?? "Unavailable"}</Text>
        </Text>
        {fit ? <Text style={styles.fitIdeal}>Best range {Math.round(fit.idealLowF)}–{Math.round(fit.idealHighF)}°F</Text> : null}
      </View>
      <PierCastWaterGauge fit={fit} />
    </View>
  );
}

function MyPierCard({
  city,
  lakeId,
  timeline,
  pick,
  pickLoading,
  width,
  onOpen,
  onRemove,
}: {
  city: PierCastConditionsCatalogCityV4;
  lakeId: PierCastGreatLakeIdV4 | undefined;
  timeline: Timeline | undefined;
  pick: PierCastSalmonidPick | null;
  pickLoading: boolean;
  width: number;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const line = useMemo(() => (timeline ? buildPierCastSparkline(timeline) : null), [timeline]);
  const structures = selectPierCastCoveredStructures(city.structures);
  const pierLine = structures.length === 0
    ? null
    : structures.length === 1
    ? structures[0]!.displayName
    : `${structures[0]!.displayName} +${structures.length - 1}`;
  const change = line ? Math.round(line.changeF) : 0;
  const trend = !line
    ? null
    : Math.abs(change) < 2
    ? "Steady all week"
    : `${change < 0 ? "Down" : "Up"} ${Math.abs(change)}° by ${pierCastRelativeDay(line.endsAt)}`;
  const place = [stateName(city.stateCode), lakeId ? `Lake ${pierCastLakeName(lakeId)}` : null]
    .filter(Boolean)
    .join(" · ")
    .toUpperCase();
  return (
    <View style={[styles.pierCard, { width }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${city.displayName}. Water ${line?.nowF != null ? `${Math.round(line.nowF)} degrees` : "unavailable"}.${pick ? ` Best trout and salmon today: ${pierCastSpeciesName(pick.speciesId)}.` : ""} Opens the full report.`}
        onPress={() => {
          hapticSelection();
          onOpen();
        }}
        style={({ pressed }) => [styles.flexGrow, pressed && styles.pressedSoft]}
      >
        <View style={styles.pierTopBar} />
        <View style={styles.pierBody}>
          <View style={styles.pierHead}>
            <View style={styles.flex}>
              <Text style={styles.pierPlace} numberOfLines={1}>{place}</Text>
              <Text style={styles.pierCity} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                {city.displayName}
              </Text>
              {pierLine ? (
                <View style={styles.pierLineRow}>
                  <Ionicons name="location" size={12} color={paper.dashboardBlue} />
                  <Text style={styles.pierLine} numberOfLines={1}>{pierLine}</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.pierTemp}>
              <Text style={styles.pierTempValue}>{line?.nowF != null ? `${Math.round(line.nowF)}°` : "—"}</Text>
              <Text style={styles.pierTempLabel}>WATER NOW</Text>
            </View>
          </View>
          <View style={styles.sparkWrap}>
            <Sparkline timeline={timeline} width={width - 36} />
            <View style={styles.sparkFoot}>
              <Text style={styles.sparkFootText}>5-DAY WATER</Text>
              {trend ? (
                <View style={styles.sparkTrend}>
                  {Math.abs(change) >= 2 ? (
                    <Ionicons name={change < 0 ? "arrow-down" : "arrow-up"} size={11} color={change < 0 ? COLD : WARM} />
                  ) : null}
                  <Text style={styles.sparkTrendText}>{trend}</Text>
                </View>
              ) : null}
            </View>
          </View>
          <View style={styles.dashed} />
          <SalmonidPick pick={pick} loading={pickLoading} />
        </View>
        <View style={styles.pierCta}>
          <Text style={styles.pierCtaText}>OPEN FULL REPORT</Text>
          <Ionicons name="arrow-forward" size={14} color={GOLD} />
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove ${city.displayName} from My Piers`}
        hitSlop={10}
        onPress={() => {
          hapticSelection();
          onRemove();
        }}
        style={({ pressed }) => [styles.pierStar, pressed && styles.pressed]}
      >
        <Ionicons name="star" size={15} color="#8A6A14" />
      </Pressable>
    </View>
  );
}

function AddPierCard({ width, remaining, onAdd }: { width: number; remaining: number; onAdd: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add a pier to My Piers"
      onPress={() => {
        hapticSelection();
        onAdd();
      }}
      style={({ pressed }) => [styles.addCard, { width }, pressed && styles.pressedSoft]}
    >
      <View style={styles.emptyStar}>
        <Ionicons name="add" size={24} color="#8A6A14" />
      </View>
      <Text style={styles.emptyTitle}>Add a pier</Text>
      <Text style={styles.emptyBody}>
        {remaining} more {remaining === 1 ? "spot" : "spots"} open. Search or browse above and tap the star.
      </Text>
    </Pressable>
  );
}

function MyPiersEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add a pier to My Piers"
      onPress={() => {
        hapticSelection();
        onAdd();
      }}
      style={({ pressed }) => [styles.emptyPiers, pressed && styles.pressedSoft]}
    >
      <View style={styles.emptyStar}>
        <Ionicons name="star-outline" size={22} color="#8A6A14" />
      </View>
      <Text style={styles.emptyTitle}>Save up to {PIER_CAST_MAX_SAVED_CITIES} piers</Text>
      <Text style={styles.emptyBody}>
        Tap the star on any city to keep its water temperature and best trout & salmon pick right here.
      </Text>
      <View style={styles.emptyCta}>
        <Ionicons name="search" size={13} color={INK} />
        <Text style={styles.emptyCtaText}>FIND A PIER</Text>
      </View>
    </Pressable>
  );
}

function MyPiers({
  cities,
  cityLakes,
  timelines,
  conditions,
  conditionsLoading,
  onOpenCity,
  onToggleSaved,
  onAdd,
}: {
  cities: PierCastConditionsCatalogCityV4[];
  cityLakes: ReadonlyMap<string, PierCastGreatLakeIdV4>;
  timelines: ReadonlyMap<string, Timeline>;
  conditions: readonly PierCastTargetConditionsResponse[];
  conditionsLoading: boolean;
  onOpenCity: (cityId: string) => void;
  onToggleSaved: (cityId: string) => void;
  onAdd: () => void;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const pageWidth = Math.min(windowWidth, 640);
  const cardWidth = pageWidth - SIDE * 2 - (cities.length > 0 ? PEEK : 0);
  const step = cardWidth + CARD_GAP;
  const scrollRef = useRef<ScrollView>(null);
  const tabsRef = useRef<ScrollView>(null);
  const tabX = useRef<number[]>([]);
  const [active, setActive] = useState(0);
  const canAdd = cities.length < PIER_CAST_MAX_SAVED_CITIES;
  const slides = cities.length + (canAdd && cities.length > 0 ? 1 : 0);
  const index = Math.min(active, Math.max(0, slides - 1));

  useEffect(() => {
    if (active > slides - 1) setActive(Math.max(0, slides - 1));
  }, [active, slides]);

  // Keep the selected city tab in view as the cards move.
  useEffect(() => {
    const x = tabX.current[index];
    if (x !== undefined) tabsRef.current?.scrollTo({ x: Math.max(0, x - SIDE), animated: true });
  }, [index]);

  const goTo = useCallback((next: number) => {
    hapticSelection();
    setActive(next);
    scrollRef.current?.scrollTo({ x: next * step, animated: true });
  }, [step]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.max(0, Math.min(slides - 1, Math.round(event.nativeEvent.contentOffset.x / step)));
    if (next !== active) {
      setActive(next);
      hapticSelection();
    }
  };

  return (
    <View>
      <SectionHead
        kicker={`MY PIERS · ${cities.length}/${PIER_CAST_MAX_SAVED_CITIES}`}
        title="Your piers today"
        right={cities.length > 1 ? (
          <Text style={styles.counter}>
            {Math.min(index + 1, cities.length)}<Text style={styles.counterSoft}> / {cities.length}</Text>
          </Text>
        ) : undefined}
      />
      {cities.length === 0 ? (
        <MyPiersEmpty onAdd={onAdd} />
      ) : (
        <>
          {cities.length > 1 ? (
            <ScrollView
              ref={tabsRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabs}
            >
              {cities.map((city, i) => {
                const on = i === index;
                return (
                  <Pressable
                    key={city.cityId}
                    onLayout={(event) => { tabX.current[i] = event.nativeEvent.layout.x; }}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={`Show ${city.displayName}`}
                    onPress={() => goTo(i)}
                    style={({ pressed }) => [styles.tab, on && styles.tabOn, pressed && styles.pressed]}
                  >
                    {on ? <Ionicons name="star" size={11} color={GOLD} /> : null}
                    <Text style={[styles.tabText, on && styles.tabTextOn]} numberOfLines={1}>{city.displayName}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={step}
            snapToAlignment="start"
            disableIntervalMomentum
            onScroll={onScroll}
            scrollEventThrottle={32}
            contentContainerStyle={styles.carousel}
          >
            {cities.map((city, i) => (
              <View key={city.cityId} style={[styles.slide, i < slides - 1 && { marginRight: CARD_GAP }]}>
                <MyPierCard
                  city={city}
                  lakeId={cityLakes.get(city.cityId)}
                  timeline={timelines.get(city.cityId)}
                  pick={pickPierCastTopSalmonid(city, conditions)}
                  pickLoading={conditionsLoading}
                  width={cardWidth}
                  onOpen={() => onOpenCity(city.cityId)}
                  onRemove={() => onToggleSaved(city.cityId)}
                />
              </View>
            ))}
            {canAdd ? (
              <AddPierCard width={cardWidth} remaining={PIER_CAST_MAX_SAVED_CITIES - cities.length} onAdd={onAdd} />
            ) : null}
          </ScrollView>
          {slides > 1 ? (
            <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              {Array.from({ length: slides }, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === index && styles.dotOn,
                    i === cities.length && styles.dotAdd,
                  ]}
                />
              ))}
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

// ─── 4. Water temp swings ─────────────────────────────────────────────────

const SEVERITY_LABEL: Record<PierCastLandingSwing["severity"], string> = {
  minor: "MINOR",
  notable: "NOTABLE",
  major: "MAJOR",
  extreme: "EXTREME",
};

function SwingRow({ swing, onOpen }: { swing: PierCastLandingSwing; onOpen: () => void }) {
  const cold = swing.direction === "cooling";
  const color = cold ? COLD : WARM;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${swing.cityName}, ${swing.stateCode}: ${swing.title}, ${swing.change}. ${swing.status.toLowerCase()}. Opens the city report.`}
      onPress={() => {
        hapticSelection();
        onOpen();
      }}
      style={({ pressed }) => [styles.swingRow, pressed && styles.pressedSoft]}
    >
      <View style={[styles.swingIcon, { backgroundColor: color }]}>
        <Ionicons name={cold ? "arrow-down" : "arrow-up"} size={17} color="#FFFFFF" />
      </View>
      <View style={styles.flex}>
        <View style={styles.swingLabelRow}>
          <Text style={[styles.swingLabel, { color }]}>
            {cold ? "COOLING" : "WARMING"} · {SEVERITY_LABEL[swing.severity]}
          </Text>
          {swing.sample ? (
            <View style={styles.sampleBadge}><Text style={styles.sampleText}>DEV PREVIEW</Text></View>
          ) : null}
        </View>
        <Text style={styles.swingCity}>{swing.cityName}, {swing.stateCode}</Text>
        <Text style={styles.swingTitle}>{swing.title}</Text>
        <Text style={styles.swingChange}>{swing.change}</Text>
        <View style={styles.swingWhen}>
          <View style={[styles.swingStatus, swing.status === "HAPPENING NOW" && styles.swingStatusNow]}>
            <Text style={[styles.swingStatusText, swing.status === "HAPPENING NOW" && styles.swingStatusTextNow]}>
              {swing.status}
            </Text>
          </View>
          <Text style={styles.swingWindow} numberOfLines={1}>{swing.window}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={INK} style={styles.dim} />
    </Pressable>
  );
}

function WaterSwings({
  swings,
  loading,
  available,
  onOpenCity,
}: {
  swings: PierCastLandingSwing[];
  loading: boolean;
  /** False when the five-day forecast could not be loaded. */
  available: boolean;
  onOpenCity: (cityId: string) => void;
}) {
  const [open, setOpen] = useState<boolean | null>(null);
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem(SWINGS_OPEN_KEY).then((value) => {
      if (active && (value === "1" || value === "0")) setOpen(value === "1");
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  // Until the angler chooses, open when something is happening.
  const expanded = open ?? swings.length > 0;
  useEffect(() => {
    Animated.timing(spin, {
      toValue: expanded ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [expanded, spin]);
  const cooling = swings.filter((swing) => swing.direction === "cooling").length;
  const warming = swings.length - cooling;
  const toggle = () => {
    hapticSelection();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = !expanded;
    setOpen(next);
    void AsyncStorage.setItem(SWINGS_OPEN_KEY, next ? "1" : "0").catch(() => {});
  };
  const summary = loading && swings.length === 0
    ? "Reading the 5-day forecast…"
    : !available
    ? "Forecast unavailable right now"
    : pierCastSwingSummary(swings);
  return (
    <View style={styles.swings}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`Water temp swings. ${summary}.`}
        onPress={toggle}
        style={({ pressed }) => [styles.swingsHead, pressed && styles.pressedSoft]}
      >
        <View style={styles.swingsBadge}>
          <Ionicons name="pulse" size={18} color={GOLD} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.swingsKicker}>WATER TEMP SWINGS</Text>
          <Text style={styles.swingsTitle}>Water on the move</Text>
          <View style={styles.swingsSummaryRow}>
            {cooling > 0 ? <View style={[styles.summaryDot, { backgroundColor: COLD }]} /> : null}
            {warming > 0 ? <View style={[styles.summaryDot, { backgroundColor: WARM }]} /> : null}
            <Text style={styles.swingsSummary} numberOfLines={1}>{summary}</Text>
          </View>
        </View>
        {swings.length > 0 ? (
          <View style={styles.countPill}><Text style={styles.countPillText}>{swings.length}</Text></View>
        ) : null}
        <Animated.View
          style={{ transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] }) }] }}
        >
          <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
        </Animated.View>
      </Pressable>
      {expanded ? (
        <View style={styles.swingsBody}>
          {swings.length === 0 ? (
            <View style={styles.quiet}>
              <Ionicons name="water-outline" size={18} color={paper.dashboardBlue} />
              <Text style={styles.quietText}>
                {loading
                  ? "Reading the 5-day forecast…"
                  : !available
                  ? "The 5-day water forecast couldn't load. Pull down to try again."
                  : "Water is holding steady at every PierCast pier for the next 5 days."}
              </Text>
            </View>
          ) : (
            swings.map((swing) => (
              <SwingRow key={`${swing.cityId}-${swing.id}`} swing={swing} onOpen={() => onOpenCity(swing.cityId)} />
            ))
          )}
          <Text style={styles.swingsFine}>
            A swing is a modeled nearshore change of 6°F or more within a day, the same rule as each City Report's
            Water temp shifts. Cold drops often pull trout and salmon in close.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── Screen body ──────────────────────────────────────────────────────────

export function PierCastLanding({
  catalog,
  savedCityIds,
  saveNotice,
  refreshToken,
  onToggleSaved,
  onOpenCity,
  onOpenMap,
  onRevealSearch,
  footer,
}: {
  catalog: PierCastConditionsCatalogResponseV4;
  savedCityIds: readonly string[];
  saveNotice: string | null;
  /** Increment to refetch conditions and picks (pull to refresh). */
  refreshToken: number;
  onToggleSaved: (cityId: string) => void;
  onOpenCity: (cityId: string) => void;
  onOpenMap: () => void;
  /** Scrolls the page so the search card (at this y within the landing) is in view. */
  onRevealSearch?: (y: number) => void;
  footer?: ReactNode;
}) {
  const reduceMotion = useReduceMotion();
  const finderY = useRef(0);
  const searchRef = useRef<TextInput | null>(null);
  const [summary, setSummary] = useState<PierCastConditionsMapResponseV4 | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [targetConditions, setTargetConditions] = useState<PierCastTargetConditionsResponse[]>([]);
  const [targetConditionsLoading, setTargetConditionsLoading] = useState(false);
  const lastRefresh = useRef(refreshToken);

  const firstSummary = useRef(true);
  useEffect(() => {
    let active = true;
    const force = !firstSummary.current;
    firstSummary.current = false;
    setSummaryLoading(true);
    void fetchPierCastConditionsSummaryMap({ force })
      .then((next) => { if (active) setSummary(next); })
      .catch(() => { /* sections fall back to their empty states */ })
      .finally(() => { if (active) setSummaryLoading(false); });
    return () => { active = false; };
  }, [refreshToken]);

  const savedCities = useMemo(
    () => savedCityIds
      .map((cityId) => catalog.cities.find((city) => city.cityId === cityId) ?? null)
      .filter((city): city is PierCastConditionsCatalogCityV4 => city !== null),
    [catalog.cities, savedCityIds],
  );
  const salmonids = useMemo(() => pierCastSalmonidsFor(savedCities), [savedCities]);
  const salmonidKey = salmonids.join(",");

  useEffect(() => {
    if (salmonids.length === 0) {
      setTargetConditions([]);
      setTargetConditionsLoading(false);
      return;
    }
    let active = true;
    const force = lastRefresh.current !== refreshToken;
    lastRefresh.current = refreshToken;
    setTargetConditionsLoading(true);
    void loadSalmonidConditions(salmonids, force)
      .then((next) => { if (active) setTargetConditions(next); })
      .finally(() => { if (active) setTargetConditionsLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salmonidKey, refreshToken]);

  const { cityLakes, mapPoints, timelines } = useMemo(() => {
    const lakes = new Map<string, PierCastGreatLakeIdV4>();
    const points = new Map<string, PierCastCoordinate>();
    const lines = new Map<string, Timeline>();
    summary?.cities.forEach((city) => {
      lakes.set(city.cityId, city.lakeId);
      lines.set(city.cityId, city.temperatureTimeline);
      if (Number.isFinite(city.latitude) && Number.isFinite(city.longitude)) {
        points.set(city.cityId, { latitude: city.latitude, longitude: city.longitude });
      }
    });
    return { cityLakes: lakes, mapPoints: points, timelines: lines };
  }, [summary]);

  const swings = useMemo(() => {
    const found = buildPierCastLandingSwings(summary);
    // Development builds always show one card so the section can be reviewed.
    return __DEV__ && found.length === 0 && summary ? [pierCastSampleSwing()] : found;
  }, [summary]);

  const focusSearch = useCallback(() => {
    onRevealSearch?.(Math.max(0, finderY.current - 12));
    setTimeout(() => searchRef.current?.focus(), 250);
  }, [onRevealSearch]);

  return (
    <View>
      <Hero summary={summary} loading={summaryLoading} onOpenMap={onOpenMap} reduceMotion={reduceMotion} />

      <View onLayout={(event) => { finderY.current = event.nativeEvent.layout.y; }}>
      <Finder
        cities={catalog.cities}
        cityLakes={cityLakes}
        mapPoints={mapPoints}
        shorelineLoading={summaryLoading}
        savedCityIds={savedCityIds}
        notice={saveNotice}
        onOpenCity={onOpenCity}
        onToggleSaved={onToggleSaved}
        inputRef={searchRef}
      />
      </View>

      <MyPiers
        cities={savedCities}
        cityLakes={cityLakes}
        timelines={timelines}
        conditions={targetConditions}
        conditionsLoading={targetConditionsLoading}
        onOpenCity={onOpenCity}
        onToggleSaved={onToggleSaved}
        onAdd={focusSearch}
      />

      <WaterSwings swings={swings} loading={summaryLoading} available={summary !== null} onOpenCity={onOpenCity} />

      {footer ? <View style={styles.footer}>{footer}</View> : null}

      <Text style={styles.disclaimer}>
        Research-based outlooks, not catch guarantees. Water temps are NOAA model estimates. Always check pier conditions before you go.
      </Text>
    </View>
  );
}

/** Loading placeholder with the landing's own shape. */
export function PierCastLandingSkeleton() {
  const pulse = usePaperBonePulse({ from: 0.25, to: 0.55 });
  const reduceMotion = useReduceMotion();
  const { width } = useWindowDimensions();
  return (
    <View>
      <View style={styles.hero}>
        <View style={styles.artWrap}>
          <PierCastLighthouseArt width={Math.min(width, 640)} reduceMotion={reduceMotion} />
        </View>
        <Animated.View style={[styles.statsCard, styles.skeletonStats, { opacity: pulse }]} />
      </View>
      <View style={[styles.finder, styles.skeletonFinder]}>
        <Animated.View style={[styles.boneDark, { height: 160, opacity: pulse }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  flexGrow: { flexGrow: 1 },
  dim: { opacity: 0.45 },
  pressed: { opacity: 0.72 },
  pressedSoft: { opacity: 0.86 },
  textOnInk: { color: "#FFFFFF" },
  textOnInkSoft: { color: "rgba(255,255,255,0.7)" },
  corner: { position: "absolute", width: 12, height: 12 },
  cornerTL: { top: 8, left: 8, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: 8, right: 8, borderTopWidth: 2, borderRightWidth: 2 },

  // Hero
  hero: { backgroundColor: INK, paddingBottom: 40 },
  artWrap: { alignSelf: "center", overflow: "hidden" },
  artText: { position: "absolute", top: 16, left: 18, right: 120 },
  artFade: { position: "absolute", left: 0, right: 0, bottom: 0, height: 18, backgroundColor: INK, opacity: 0.35 },
  heroEyebrow: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.8, color: GOLD },
  heroTitle: { marginTop: 6, fontFamily: paperFonts.display, fontSize: 30, lineHeight: 33, color: "#FFFFFF", textShadowColor: "rgba(10,27,46,0.6)", textShadowRadius: 8 },
  statsCard: { marginTop: -8, marginHorizontal: SIDE, paddingHorizontal: 14, paddingTop: 13, paddingBottom: 14, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.14)", backgroundColor: "#0F2740" },
  statsHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  statsKicker: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.6, color: GOLD },
  fresh: { flexDirection: "row", alignItems: "center", gap: 6 },
  freshDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: paper.bandPrime },
  freshText: { fontFamily: paperFonts.metaMono, fontSize: 10.5, color: "rgba(255,255,255,0.7)" },
  stats: { flexDirection: "row", marginTop: 10 },
  stat: { flex: 1, alignItems: "center", paddingHorizontal: 4 },
  statDivider: { borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.12)" },
  statLabelRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  statDot: { width: 7, height: 7, borderRadius: 4 },
  statLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 9.5, letterSpacing: 1.3, color: "rgba(255,255,255,0.6)" },
  statValue: { marginTop: 5, fontFamily: paperFonts.monoBold, fontSize: 23, lineHeight: 28, color: "#FFFFFF" },
  statSub: { marginTop: 1, fontFamily: paperFonts.body, fontSize: 11.5, color: "rgba(255,255,255,0.6)" },
  statBone: { width: 54, height: 22, marginTop: 8, marginBottom: 3, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.3)" },
  mapCta: { minHeight: 54, marginTop: 14, flexDirection: "row", alignItems: "center", gap: 11, paddingHorizontal: 12, borderRadius: 12, backgroundColor: GOLD },
  mapCtaIcon: { width: 32, height: 32, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(10,27,46,0.12)" },
  mapCtaTitle: { fontFamily: paperFonts.display, fontSize: 17, color: INK },
  mapCtaSub: { fontFamily: paperFonts.metaMono, fontSize: 10.5, color: "rgba(10,27,46,0.72)" },

  // Finder
  finder: { marginTop: -26, marginHorizontal: SIDE, overflow: "hidden", borderRadius: 18, borderWidth: 2, borderColor: INK, backgroundColor: paper.dashboardWhite, ...paperShadows.hard },
  finderTop: { overflow: "hidden", alignItems: "center", paddingHorizontal: 16, paddingTop: 20, paddingBottom: 18, backgroundColor: "#12304A" },
  finderBadge: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(232,160,46,0.6)", backgroundColor: "rgba(232,160,46,0.1)" },
  finderKicker: { marginTop: 10, fontFamily: paperFonts.metaMonoBold, fontSize: 10.5, letterSpacing: 1.8, color: GOLD },
  finderTitle: { marginTop: 4, fontFamily: paperFonts.display, fontSize: 25, lineHeight: 30, color: "#FFFFFF", textAlign: "center" },
  search: { alignSelf: "stretch", minHeight: 54, marginTop: 16, flexDirection: "row", alignItems: "center", gap: 9, paddingLeft: 14, paddingRight: 6, borderWidth: 2, borderColor: "transparent", borderRadius: 14, backgroundColor: CREAM },
  searchFocused: { borderColor: GOLD },
  searchInput: { flex: 1, minWidth: 0, minHeight: 50, fontFamily: paperFonts.bodyMedium, fontSize: 16, color: INK },
  searchClear: { width: 28, height: 28, marginRight: 6, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.08)" },
  nearButton: { minHeight: 40, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, borderRadius: 10, backgroundColor: INK },
  nearText: { fontFamily: paperFonts.bodyBold, fontSize: 13, color: "#FFFFFF" },
  notice: { alignSelf: "stretch", flexDirection: "row", alignItems: "center", gap: 7, marginTop: 10, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 9, backgroundColor: "rgba(232,160,46,0.14)" },
  noticeText: { flex: 1, fontFamily: paperFonts.bodyMedium, fontSize: 12.5, lineHeight: 17, color: "#F6E3BC" },
  finderBody: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 14 },
  resultsHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  resultsLabel: { marginBottom: 2, fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.4, color: paper.dashboardMuted },
  resultsClose: { fontFamily: paperFonts.bodySemiBold, fontSize: 12.5, color: paper.dashboardBlue },
  indexLabel: { marginTop: 4, marginBottom: 8 },
  finderEmpty: { marginTop: 8, marginBottom: 6, fontFamily: paperFonts.body, fontSize: 13.5, lineHeight: 19, color: "#555555" },
  tiles: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10 },
  tile: { padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: INK, backgroundColor: CREAM },
  tileHalf: { width: "48.4%" },
  tileWide: { width: "100%", flexDirection: "row", alignItems: "center", gap: 14 },
  tileOn: { backgroundColor: INK },
  tileArt: { height: 86, alignItems: "flex-start", justifyContent: "center", marginBottom: 8 },
  tileArtWide: { width: 84, height: 70, marginBottom: 0, alignItems: "center" },
  tileLake: { fontFamily: paperFonts.display, fontSize: 16.5, color: INK },
  tileShore: { marginTop: 1, fontFamily: paperFonts.body, fontSize: 12, color: paper.dashboardMuted },
  tileCount: { alignSelf: "flex-start", marginTop: 8, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5, backgroundColor: "rgba(10,27,46,0.08)" },
  tileCountOn: { backgroundColor: GOLD },
  tileCountText: { fontFamily: paperFonts.metaMonoBold, fontSize: 9.5, letterSpacing: 1, color: INK },
  tileCountTextOn: { color: INK },
  groupList: { marginTop: 12, paddingTop: 4, borderTopWidth: 1.5, borderStyle: "dashed", borderTopColor: "rgba(10,27,46,0.2)" },
  groupListTitle: { marginTop: 8, fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.4, color: paper.dashboardBlue },
  cityRow: { flexDirection: "row", alignItems: "center", gap: 6, borderBottomWidth: 1, borderBottomColor: paper.dashboardHair },
  cityRowMain: { flex: 1, minHeight: 56, flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  cityPin: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#EAF4F9" },
  cityRowName: { fontFamily: paperFonts.displaySemiBold, fontSize: 17, color: INK },
  cityRowMeta: { marginTop: 1, fontFamily: paperFonts.body, fontSize: 12.5, color: paper.dashboardMuted },
  cityRowDistance: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, color: paper.dashboardBlue },
  star: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(0,0,0,0.14)" },
  starOn: { borderColor: paper.medalGold, backgroundColor: "#FBF3DF" },

  // Section head
  sectionHead: { flexDirection: "row", alignItems: "flex-end", gap: 10, marginTop: 28, marginHorizontal: 18, marginBottom: 10 },
  sectionKicker: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.8, color: paper.dashboardBlue },
  sectionTitle: { marginTop: 3, fontFamily: paperFonts.display, fontSize: 25, lineHeight: 30, color: INK },
  counter: { fontFamily: paperFonts.monoBold, fontSize: 18, color: INK },
  counterSoft: { fontFamily: paperFonts.mono, fontSize: 14, color: paper.dashboardMuted },

  // My Piers
  tabs: { gap: 8, paddingHorizontal: SIDE, paddingBottom: 12 },
  tab: { flexDirection: "row", alignItems: "center", gap: 5, minHeight: 34, maxWidth: 170, paddingHorizontal: 13, borderRadius: 17, borderWidth: 1.5, borderColor: "rgba(10,27,46,0.22)", backgroundColor: paper.dashboardWhite },
  tabOn: { borderColor: INK, backgroundColor: INK },
  tabText: { fontFamily: paperFonts.bodySemiBold, fontSize: 13.5, color: INK },
  tabTextOn: { color: "#FFFFFF" },
  carousel: { paddingHorizontal: SIDE, alignItems: "stretch" },
  slide: { alignSelf: "stretch" },
  pierCard: { flex: 1, overflow: "hidden", backgroundColor: paper.dashboardWhite, borderWidth: 2, borderColor: INK, borderRadius: 16, ...paperShadows.hard },
  pierTopBar: { height: 5, backgroundColor: paper.dashboardBlue },
  pierBody: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14 },
  pierHead: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingRight: 38 },
  pierPlace: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.4, color: paper.dashboardBlue },
  pierCity: { marginTop: 3, fontFamily: paperFonts.display, fontSize: 26, lineHeight: 31, color: INK },
  pierLineRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  pierLine: { flexShrink: 1, fontFamily: paperFonts.body, fontSize: 12.5, color: paper.dashboardMuted },
  pierTemp: { alignItems: "flex-end" },
  pierTempValue: { fontFamily: paperFonts.monoBold, fontSize: 32, lineHeight: 38, color: INK },
  pierTempLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 9, letterSpacing: 1.2, color: paper.dashboardMuted },
  pierStar: { position: "absolute", top: 16, right: 12, width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: paper.medalGold, backgroundColor: "#FBF3DF" },
  sparkWrap: { marginTop: 12 },
  sparkEmpty: { borderRadius: 8, backgroundColor: paper.dashboardCream },
  sparkFoot: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  sparkFootText: { fontFamily: paperFonts.metaMonoBold, fontSize: 9.5, letterSpacing: 1.2, color: paper.dashboardMuted },
  sparkTrend: { flexDirection: "row", alignItems: "center", gap: 3 },
  sparkTrendText: { fontFamily: paperFonts.bodySemiBold, fontSize: 12, color: paper.dashboardInkSoft },
  dashed: { marginVertical: 13, borderTopWidth: 1.5, borderStyle: "dashed", borderColor: "rgba(10,27,46,0.22)" },
  pickRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  pickFish: { width: 80, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "#EEF5FA" },
  pickKicker: { fontFamily: paperFonts.metaMonoBold, fontSize: 9.5, letterSpacing: 1.2, color: paper.dashboardBlue },
  pickName: { marginTop: 2, fontFamily: paperFonts.displaySemiBold, fontSize: 19, color: INK },
  pickBone: { height: 92, borderRadius: 10, backgroundColor: "#DCE3E8" },
  pickNone: { fontFamily: paperFonts.body, fontSize: 13.5, lineHeight: 19, color: "#555555" },
  unratedChip: { minHeight: 21, justifyContent: "center", paddingHorizontal: 7, borderRadius: 5, borderWidth: 1, borderColor: "rgba(0,0,0,0.18)", backgroundColor: paper.dashboardCream },
  unratedChipText: { fontFamily: paperFonts.metaMonoBold, fontSize: 9.5, letterSpacing: 0.9, color: "#555555" },
  fitHead: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginTop: 12, marginBottom: 6 },
  fitKey: { flexShrink: 1, fontFamily: paperFonts.metaMonoBold, fontSize: 10.5, letterSpacing: 1, color: INK },
  fitPhrase: { fontFamily: paperFonts.bodySemiBold, fontSize: 13, letterSpacing: 0, color: paper.dashboardInkSoft },
  fitIdeal: { fontFamily: paperFonts.metaMono, fontSize: 11, color: paper.dashboardMuted },
  pierCta: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: INK },
  pierCtaText: { fontFamily: paperFonts.metaMonoBold, fontSize: 11.5, letterSpacing: 1.4, color: GOLD },
  addCard: { alignItems: "center", justifyContent: "center", paddingHorizontal: 24, paddingVertical: 24, borderWidth: 2, borderStyle: "dashed", borderColor: "rgba(10,27,46,0.32)", borderRadius: 16, backgroundColor: "#FBFAF6" },
  dots: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 12 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "rgba(10,27,46,0.2)" },
  dotOn: { width: 22, backgroundColor: INK },
  dotAdd: { borderWidth: 1, borderColor: "rgba(10,27,46,0.35)", backgroundColor: "transparent" },
  emptyPiers: { marginHorizontal: SIDE, alignItems: "center", paddingHorizontal: 24, paddingVertical: 24, borderWidth: 2, borderStyle: "dashed", borderColor: "rgba(10,27,46,0.32)", borderRadius: 16, backgroundColor: "#FBFAF6" },
  emptyStar: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", backgroundColor: "#FBF3DF", borderWidth: 1.5, borderColor: paper.medalGold },
  emptyTitle: { marginTop: 10, fontFamily: paperFonts.display, fontSize: 20, color: INK, textAlign: "center" },
  emptyBody: { marginTop: 5, maxWidth: 300, fontFamily: paperFonts.body, fontSize: 13.5, lineHeight: 19, color: "#555555", textAlign: "center" },
  emptyCta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, borderWidth: 1.5, borderColor: INK, backgroundColor: paper.dashboardWhite },
  emptyCtaText: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.2, color: INK },

  // Water temp swings
  swings: { marginTop: 26, marginHorizontal: SIDE, overflow: "hidden", borderRadius: 16, borderWidth: 2, borderColor: INK, backgroundColor: paper.dashboardWhite, ...paperShadows.hard },
  swingsHead: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 14, backgroundColor: INK },
  swingsBadge: { width: 40, height: 40, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(232,160,46,0.12)", borderWidth: 1, borderColor: "rgba(232,160,46,0.5)" },
  swingsKicker: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.8, color: GOLD },
  swingsTitle: { marginTop: 1, fontFamily: paperFonts.display, fontSize: 19, color: "#FFFFFF" },
  swingsSummaryRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 },
  summaryDot: { width: 7, height: 7, borderRadius: 4 },
  swingsSummary: { flexShrink: 1, fontFamily: paperFonts.body, fontSize: 12.5, color: "rgba(255,255,255,0.7)" },
  countPill: { minWidth: 26, height: 26, paddingHorizontal: 7, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: GOLD },
  countPillText: { fontFamily: paperFonts.monoBold, fontSize: 13, color: INK },
  swingsBody: { paddingHorizontal: 14, paddingTop: 4, paddingBottom: 14 },
  swingRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: paper.dashboardHair },
  swingIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  swingLabelRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  swingLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 9.5, letterSpacing: 1.2 },
  sampleBadge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4, backgroundColor: "rgba(10,27,46,0.08)" },
  sampleText: { fontFamily: paperFonts.metaMonoBold, fontSize: 8.5, letterSpacing: 1, color: paper.dashboardMuted },
  swingCity: { marginTop: 2, fontFamily: paperFonts.display, fontSize: 18, color: INK },
  swingTitle: { marginTop: 1, fontFamily: paperFonts.bodySemiBold, fontSize: 14, color: paper.dashboardInkSoft },
  swingChange: { marginTop: 1, fontFamily: paperFonts.mono, fontSize: 12, color: paper.dashboardInkSoft },
  swingWhen: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 7 },
  swingStatus: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: "rgba(10,27,46,0.07)" },
  swingStatusNow: { backgroundColor: GOLD },
  swingStatusText: { fontFamily: paperFonts.metaMonoBold, fontSize: 9, letterSpacing: 0.9, color: paper.dashboardMuted },
  swingStatusTextNow: { color: INK },
  swingWindow: { flexShrink: 1, fontFamily: paperFonts.body, fontSize: 12, color: paper.dashboardMuted },
  quiet: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 14 },
  quietText: { flex: 1, fontFamily: paperFonts.body, fontSize: 13.5, lineHeight: 19, color: "#444444" },
  swingsFine: { marginTop: 12, fontFamily: paperFonts.body, fontSize: 11.5, lineHeight: 16, color: paper.dashboardMuted },

  footer: { marginTop: 18 },
  disclaimer: { marginTop: 18, marginHorizontal: 26, textAlign: "center", fontFamily: paperFonts.body, fontSize: 12, lineHeight: 17, color: "#777777" },
  skeletonStats: { height: 150 },
  skeletonFinder: { padding: 14 },
  boneDark: { borderRadius: 10, backgroundColor: "#DCE3E8" },
});
