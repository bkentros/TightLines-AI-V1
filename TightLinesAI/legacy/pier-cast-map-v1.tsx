/**
 * RETIRED — the first PierCast visual map (native MapLibre), replaced by the
 * Live Lake Map web view in app/pier-cast-map.tsx. Kept only as a record for the
 * earlier renovation/refinement tests that read its source; it is not routed,
 * not imported, and not type-checked (tsconfig excludes legacy/). Its imports
 * are left exactly as they were in app/.
 */
import {
  Camera,
  type CameraRef,
  GeoJSONSource,
  Layer,
  Map,
  Marker,
  RasterSource,
  type StyleSpecification,
} from "@maplibre/maplibre-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  AppState,
  type AppStateStatus,
  Linking,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { FeatureCollection } from "geojson";

import mapGeometry from "../assets/data/pier-cast-great-lakes-map.json";
import { PierCastDepthGradient } from "../components/pier-cast/PierCastDepthGradient";
import { PierCastTemperatureGradient } from "../components/pier-cast/PierCastTemperatureGradient";
import { PierCastWindGradient } from "../components/pier-cast/PierCastWindGradient";
import { captureAnalytics } from "../lib/analytics";
import {
  fetchPierCastConditionsCatalog,
  fetchPierCastConditionsMap,
  fetchPierCastMapFoundation,
  fetchPierCastObservedTemperatureMap,
  PierCastRequestError,
} from "../lib/pierCast";
import {
  buildPierCastBathymetryRasterFrames,
  buildPierCastConditionsMapCities,
  buildPierCastGreatLakesTemperatureRasterFrames,
  closestPierCastTemperatureTime,
  filterPierCastConditionsMapCities,
  PIER_CAST_GREAT_LAKES_BOUNDS,
  PIER_CAST_MAP_MAX_ZOOM,
  PIER_CAST_MAP_MIN_ZOOM,
  PIER_CAST_MAP_REFRESH_INTERVAL_MS,
  pierCastAvailableMapMatchBand,
  pierCastMapBoundsForFilter,
  type PierCastConditionsMapCity,
  type PierCastMapFilter,
  pierCastForecastMapValidTimes,
  pierCastSynchronizedConditionsMapValidTimes,
  pierCastMapRegionFeatureCode,
  pierCastTemperatureHorizonLabel,
  pierCastWindFrame,
} from "../lib/pierCastMap";
import type {
  PierCastMapFoundationResponse,
  PierCastSpeciesId,
} from "../lib/pierCastContracts";
import type {
  PierCastConditionsCatalogResponseV4,
  PierCastConditionsMapResponseV4,
  PierCastObservedTemperatureMapResponseV1,
  PierCastObservedTemperatureStationReadV1,
  PierCastThermalBandV4,
} from "../lib/pierCastConditionsV4";
import {
  PIER_CAST_SPECIES_LABELS,
  seasonStageLabel,
  seasonalBandLabel,
  thermalBandLabel,
} from "../lib/pierCastConditionsPresentation";
import {
  parsePierCastTargetSpecies,
  readPierCastTargetPreference,
  writePierCastTargetPreference,
} from "../lib/pierCastTargetPreference";
import {
  buildPierCastCityWindInsights,
  type PierCastCityWindInsight,
  summarizePierCastCityWindInsights,
} from "../lib/pierCastMapInsights";
import {
  PIER_CAST_WATER_SCALE_LABELS,
  PIER_CAST_WATER_SCALE_MAX_F,
  PIER_CAST_WATER_SCALE_MIN_F,
  PIER_CAST_WATER_SCALE_STOPS,
  pierCastWaterTemperatureColor,
} from "../lib/pierCastTemperatureScale";
import {
  buildPierCastWindFlowGeoJson,
  buildPierCastWindArrowGeoJson,
  filterPierCastWindPointsForView,
  PIER_CAST_WIND_SCALE_STOPS,
  pierCastWindFlowIntervalMs,
  pierCastWindBandLabel,
  pierCastWindCompassDirection,
  summarizePierCastWindFrame,
  type PierCastWindFramePoint,
} from "../lib/pierCastWind";
import { hapticSelection } from "../lib/safeHaptics";
import {
  paper,
  paperFonts,
  paperShadows,
} from "../lib/theme";
import { usePierCastMapStore } from "../store/pierCastMapStore";

const EMPTY_MAP_STYLE: StyleSpecification = {
  version: 8,
  name: "FinFindr Great Lakes",
  sources: {},
  layers: [{
    id: "deep-water",
    type: "background",
    paint: { "background-color": "#081B2B" },
  }],
};

const OPEN_FREE_MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";

const STATE_FILTERS: PierCastMapFilter[] = [
  "ALL",
  "MI",
  "WI",
  "IL",
  "IN",
  "MN",
  "OH",
  "PA",
  "NY",
  "ON",
];
const STATE_NAMES: Record<Exclude<PierCastMapFilter, "ALL">, string> = {
  MI: "Michigan",
  WI: "Wisconsin",
  IL: "Illinois",
  IN: "Indiana",
  MN: "Minnesota",
  OH: "Ohio",
  PA: "Pennsylvania",
  NY: "New York",
  ON: "Ontario",
};

const REGION_LABELS = [
  { label: "MN", coordinate: [-94.1, 46.4] as [number, number] },
  { label: "WI", coordinate: [-89.6, 44.5] as [number, number] },
  { label: "IL", coordinate: [-89.3, 40.5] as [number, number] },
  { label: "IN", coordinate: [-86.4, 40.1] as [number, number] },
  { label: "MI", coordinate: [-84.6, 44.3] as [number, number] },
  { label: "OH", coordinate: [-82.8, 40.5] as [number, number] },
  { label: "PA", coordinate: [-77.8, 40.8] as [number, number] },
  { label: "NY", coordinate: [-75.8, 43.1] as [number, number] },
  { label: "ON", coordinate: [-80.6, 46.8] as [number, number] },
] as const;

const LAKE_LABELS = [
  { label: "SUPERIOR", coordinate: [-87.6, 47.7] as [number, number] },
  { label: "MICHIGAN", coordinate: [-86.95, 44.15] as [number, number] },
  { label: "HURON", coordinate: [-82.15, 44.85] as [number, number] },
  { label: "ERIE", coordinate: [-81.05, 42.15] as [number, number] },
  { label: "ONTARIO", coordinate: [-77.55, 43.65] as [number, number] },
] as const;

const MATCH_LEGEND: ReadonlyArray<{
  band: PierCastThermalBandV4;
  label: string;
  color: string;
}> = [
  { band: "poor", label: "Poor", color: paper.bandPoor },
  { band: "fair", label: "Fair", color: paper.bandFair },
  { band: "good", label: "Good", color: paper.bandGood },
  { band: "excellent", label: "Excellent", color: paper.bandPrime },
];

const TEMPERATURE_TIME_STEP = 1;
const PLAYBACK_OVERVIEW_STEP = 3;
type MarkerDensity = "overview" | "compact" | "detail";

function mapCitySupportedSpeciesIds(
  city: PierCastConditionsCatalogResponseV4["cities"][number],
): PierCastSpeciesId[] {
  return Array.isArray(city.supportedSpeciesIds) ? city.supportedSpeciesIds : [];
}

function temperatureTimeLabel(validAt: string | null): {
  date: string;
  eastern: string;
  central: string;
} {
  if (!validAt) return { date: "FORECAST", eastern: "— ET", central: "— CT" };
  const date = new Date(validAt);
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/Detroit",
  }).format(date).toUpperCase();
  const time = (timeZone: string) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      timeZone,
    }).format(date).replace(" ", "");
  return {
    date: dateLabel,
    eastern: `${time("America/Detroit")} ET`,
    central: `${time("America/Chicago")} CT`,
  };
}

function forecastDayTickLabel(validAt: string, index: number): string {
  if (index === 0) return "NOW";
  const parsed = new Date(validAt);
  if (!Number.isFinite(parsed.getTime())) return `+${index * 24}H`;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "America/Detroit",
  }).format(parsed).toUpperCase();
}

function shortClockLabel(value: Date | string | null): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date).replace(" ", "");
}

function modelCycleLabel(issuedAt: string | undefined): string {
  if (!issuedAt) return "NOAA MODEL";
  const date = new Date(issuedAt);
  if (!Number.isFinite(date.getTime())) return "NOAA MODEL";
  return `NOAA ${String(date.getUTCHours()).padStart(2, "0")}Z`;
}

function markerLabelSide(entry: PierCastConditionsMapCity): "left" | "right" {
  if (entry.city.stateCode === "WI" || entry.city.stateCode === "IL") {
    return "left";
  }
  if (entry.city.stateCode === "IN") return "right";
  return entry.longitude > -84.7 ? "left" : "right";
}

function CityMarker({
  entry,
  density,
  mode,
  selectedSpeciesId,
  onOpen,
}: {
  entry: PierCastConditionsMapCity;
  density: MarkerDensity;
  mode: "match" | "temperature" | "bathymetry";
  selectedSpeciesId: PierCastSpeciesId | null;
  onOpen: () => void;
}) {
  const thermalBand = pierCastAvailableMapMatchBand(entry.speciesFrame);
  const markerColor = mode === "match"
    ? MATCH_LEGEND.find((item) => item.band === thermalBand)?.color ?? "#8E9AA1"
    : mode === "temperature" && entry.temperatureF !== null
    ? pierCastWaterTemperatureColor(entry.temperatureF)
    : mode === "bathymetry"
    ? paper.dashboardBlue
    : "#8E9AA1";
  const markerValue = mode === "bathymetry"
    ? "PIER"
    : entry.temperatureF === null ? "—" : `${Math.round(entry.temperatureF)}°`;
  const side = markerLabelSide(entry);
  const seasonal = entry.speciesFrame?.seasonalOutlook;
  const matchUnavailableLabel = entry.speciesFrame?.targetingEligibility === "restricted"
    ? "targeting restricted"
    : "temperature match unavailable";
  const accessibilityLabel = mode === "match"
    ? `${entry.city.displayName}, ${entry.temperatureF === null ? "modeled temperature unavailable" : `${Math.round(entry.temperatureF)} degrees Fahrenheit`}, ${thermalBand ? `${thermalBandLabel(thermalBand)} temperature match` : matchUnavailableLabel}${seasonal?.status === "available" ? `, ${seasonalBandLabel(seasonal.band)} seasonal outlook, ${seasonStageLabel(seasonal.stage)} stage` : ""}`
    : mode === "temperature"
    ? `${entry.city.displayName}, ${entry.temperatureF === null ? "modeled temperature unavailable" : `${Math.round(entry.temperatureF)} degrees Fahrenheit modeled surface water`}`
    : `${entry.city.displayName} pier city on the depth map`;
  return (
    <Marker
      id={`pier-cast-${entry.city.cityId}`}
      lngLat={[entry.longitude, entry.latitude]}
      anchor="center"
      onPress={() => {
        hapticSelection();
        onOpen();
      }}
    >
      <View
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.marker,
          density !== "detail" && styles.markerCompact,
          side === "left" && styles.markerReverse,
        ]}
      >
        <View
          style={[
            styles.markerBadge,
            density === "compact" && styles.markerBadgeCompact,
            density === "overview" && styles.markerBadgeOverview,
            {
              backgroundColor: markerColor,
              borderColor: "rgba(255,255,255,0.88)",
            },
          ]}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.markerBadgeText,
              density !== "detail" && styles.markerBadgeTextCompact,
              { color: mode === "match" && thermalBand !== "poor" ? paper.dashboardInk : "#FFFFFF" },
            ]}
          >
            {markerValue}
          </Text>
        </View>
        {density === "detail"
          ? (
            <View style={styles.markerLabel}>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={styles.markerCity}
              >
                {entry.city.displayName.toUpperCase()}
              </Text>
              <Text allowFontScaling={false} style={styles.markerState}>
                {mode === "match" && selectedSpeciesId
                  ? `${PIER_CAST_SPECIES_LABELS[selectedSpeciesId]} · ${entry.speciesFrame?.targetingEligibility === "restricted" ? "TARGETING RESTRICTED" : seasonal?.status === "available" ? seasonStageLabel(seasonal.stage).toUpperCase() : "MATCH UNAVAILABLE"}`
                  : mode === "temperature"
                  ? `${entry.city.stateCode} · MODELED`
                  : `${entry.city.stateCode} · DEPTH CONTEXT`}
              </Text>
            </View>
          )
          : null}
      </View>
    </Marker>
  );
}

function observedTemperatureF(station: PierCastObservedTemperatureStationReadV1) {
  return station.temperatureC * 9 / 5 + 32;
}

function observationClockLabel(observedAt: string): string {
  const date = new Date(observedAt);
  if (!Number.isFinite(date.getTime())) return "TIME UNAVAILABLE";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date).toUpperCase();
}

function ObservedTemperatureMarker({
  station,
  selected,
  onSelect,
}: {
  station: PierCastObservedTemperatureStationReadV1;
  selected: boolean;
  onSelect: () => void;
}) {
  const temperatureF = observedTemperatureF(station);
  const freshnessLabel = station.freshness === "fresh"
    ? "live observation"
    : `${station.freshness} observation`;
  return (
    <Marker
      id={`pier-cast-observed-${station.stationId}`}
      lngLat={[station.longitude, station.latitude]}
      anchor="center"
      onPress={() => {
        hapticSelection();
        onSelect();
      }}
    >
      <View
        accessible
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`${station.displayName}, ${Math.round(temperatureF)} degrees Fahrenheit, ${freshnessLabel}, measured ${observationClockLabel(station.observedAt)}, quality ${station.quality === "passed" ? "passed" : "not evaluated"}`}
        style={styles.observationMarkerWrap}
      >
        <View
          style={[
            styles.observationMarker,
            selected && styles.observationMarkerSelected,
            station.freshness === "stale" && styles.observationMarkerStale,
          ]}
        >
          <Text allowFontScaling={false} style={styles.observationMarkerValue}>
            {Math.round(temperatureF)}°
          </Text>
        </View>
        <View style={styles.observationMarkerTag}>
          <Text allowFontScaling={false} style={styles.observationMarkerTagText}>
            {station.freshness === "fresh" ? "LIVE OBS" : "OBS"}
          </Text>
        </View>
      </View>
    </Marker>
  );
}

function WindFlowLayer({
  points,
  zoom,
  visible,
  mode,
  onSelect,
}: {
  points: readonly PierCastWindFramePoint[];
  zoom: number;
  visible: boolean;
  mode: "match" | "temperature" | "bathymetry";
  onSelect: (nodeId: string) => void;
}) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!visible || points.length === 0) {
      setPhase(0);
      return;
    }
    const intervalMs = pierCastWindFlowIntervalMs(zoom);
    const timer = setInterval(() => {
      setPhase((current) => (current + 0.02 * intervalMs / 64) % 1);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [points, visible, zoom]);
  const particles = useMemo(
    () => buildPierCastWindFlowGeoJson(points, zoom, phase),
    [phase, points, zoom],
  );
  if (!visible || particles.features.length === 0) return null;
  return (
    <GeoJSONSource
      id="pier-cast-wind-flow"
      data={particles}
      hitbox={{ top: 14, right: 14, bottom: 14, left: 14 }}
      onPress={(event) => {
        const nodeId = event.nativeEvent.features[0]?.properties?.nodeId;
        if (typeof nodeId === "string") onSelect(nodeId);
      }}
    >
      <Layer
        id="pier-cast-wind-flow-glow"
        type="line"
        style={{
          lineColor: ["get", "tone"],
          lineWidth: ["+", ["get", "width"], 3.2],
          lineOpacity: mode === "match" ? 0.2 : 0.28,
          lineBlur: 2.2,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      <Layer
        id="pier-cast-wind-flow-particles"
        type="line"
        style={{
          lineColor: ["get", "tone"],
          lineWidth: ["get", "width"],
          lineOpacity: mode === "match" ? 0.88 : 0.98,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
    </GeoJSONSource>
  );
}

function WindLegend({
  summary,
  validAt,
  flowActive,
  reduceMotion,
  onTogglePresentation,
}: {
  summary: ReturnType<typeof summarizePierCastWindFrame>;
  validAt: string | null;
  flowActive: boolean;
  reduceMotion: boolean;
  onTogglePresentation: () => void;
}) {
  const label = temperatureTimeLabel(validAt);
  return (
    <View
      accessibilityLabel="Wind speed colors from calm to 35 miles per hour and stronger. Arrows point where wind travels."
      style={styles.windLegend}
    >
      <View style={styles.windLegendHeader}>
        <Text style={styles.windLegendTitle}>WIND · MPH · {label.eastern}</Text>
        <Pressable
          accessibilityRole="button"
          hitSlop={10}
          accessibilityState={{ disabled: reduceMotion }}
          accessibilityLabel={reduceMotion
            ? "Wind uses static arrows because Reduce Motion is enabled"
            : `Switch wind to ${flowActive ? "static arrows" : "animated flow"}`}
          disabled={reduceMotion}
          onPress={onTogglePresentation}
          style={({ pressed }) => [
            styles.windPresentationButton,
            reduceMotion && styles.windPresentationButtonDisabled,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name={flowActive ? "pulse" : "navigate"} size={9} color="#67E8D1" />
          <Text style={styles.windPresentationText}>
            {flowActive ? "FLOW" : reduceMotion ? "ARROWS · REDUCED MOTION" : "ARROWS"}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.windLegendSummary}>
        {summary
          ? `AVG ${summary.averageMph} · PEAK ${summary.strongestMph} · GUST ${summary.strongestGustMph}`
          : "WIND FRAME UNAVAILABLE"}
      </Text>
      <View style={styles.windLegendGradient}>
        <PierCastWindGradient />
      </View>
      <View style={styles.windLegendLabels}>
        {PIER_CAST_WIND_SCALE_STOPS.map((stop, index) => (
          <Text key={stop.speedMph} style={styles.windLegendLabel}>
            {stop.speedMph}
            {index === PIER_CAST_WIND_SCALE_STOPS.length - 1 ? "+" : ""}
          </Text>
        ))}
      </View>
      <Text style={styles.windDirectionNote}>
        {flowActive ? "PARTICLES SHOW WHERE WIND TRAVELS" : "ARROWS SHOW WHERE WIND TRAVELS"} · PUSH = TOWARD PIER · DRIFT = ALONG SHORE · PULL = OFFSHORE
      </Text>
    </View>
  );
}

function windSetupTone(insight: PierCastCityWindInsight): string {
  if (insight.caution === "rough_water") return "#FF8B61";
  if (insight.caution === "elevated_gusts") return "#F1D36B";
  if (insight.setup === "onshore") return "#67E8D1";
  if (insight.setup === "offshore") return "#79C7FF";
  return "#E2D5A4";
}

function AnglerWindLens({
  insights,
}: {
  insights: ReadonlyMap<string, PierCastCityWindInsight>;
}) {
  const summary = summarizePierCastCityWindInsights(insights);
  return (
    <View
      accessibilityLabel={`Angler wind lens. ${summary.onshore} onshore, ${summary.alongshore} alongshore, ${summary.offshore} offshore, ${summary.cautions} with wind caution.`}
      style={styles.anglerLens}
    >
      <View style={styles.anglerLensTitleWrap}>
        <Ionicons name="compass-outline" size={11} color="#67E8D1" />
        <Text style={styles.anglerLensTitle}>ANGLER WIND LENS</Text>
      </View>
      <Text style={styles.anglerLensSummary}>
        {summary.onshore} PUSH · {summary.alongshore} DRIFT · {summary.offshore}
        {" "}
        PULL
        {summary.cautions > 0 ? ` · ${summary.cautions} CAUTION` : ""}
      </Text>
    </View>
  );
}

function DepthLegend({
  foundation,
}: {
  foundation: PierCastMapFoundationResponse;
}) {
  return (
    <View style={styles.depthLegend}>
      <View
        accessibilityLabel="Relative depth colors from shoreline to each lake's deepest basin"
        style={styles.depthGradient}
      >
        <PierCastDepthGradient />
      </View>
      <View style={styles.depthGradientLabels}>
        <Text style={styles.depthGradientLabel}>SHORE · 0M</Text>
        <Text style={styles.depthGradientLabel}>BREAKS / SLOPE</Text>
        <Text style={styles.depthGradientLabel}>DEEP BASIN</Text>
      </View>
      <View style={styles.depthLakeGrid}>
        {foundation.bathymetry.sources.map((source) => (
          <View key={source.lakeId} style={styles.depthLakeChip}>
            <Text style={styles.depthLakeName}>
              {source.displayName.replace("Lake ", "").toUpperCase()}
            </Text>
            <Text style={styles.depthLakeValue}>
              {source.renderDepthRangeM[1]}M MAX
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.depthNotice}>
        RELATIVE SCALE PER LAKE · CONTOURS APPEAR AS YOU ZOOM · SUPERIOR IS A
        REGIONAL GRID · NOT FOR NAVIGATION
      </Text>
    </View>
  );
}

export default function PierCastMapScreen() {
  const router = useRouter();
  const routeParams = useLocalSearchParams<{ speciesId?: string | string[] }>();
  const routeSpeciesId = parsePierCastTargetSpecies(
    Array.isArray(routeParams.speciesId)
      ? routeParams.speciesId[0]
      : routeParams.speciesId,
  );
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(routeSpeciesId);
  const selectedSpeciesRef = useRef<PierCastSpeciesId | null>(routeSpeciesId);
  const [targetHydrated, setTargetHydrated] = useState(Boolean(routeSpeciesId));
  const [targetPromptVisible, setTargetPromptVisible] = useState(false);
  const [pendingReportCityId, setPendingReportCityId] = useState<string | null>(null);
  const initializedMapSemantics = useRef(false);
  const lastAppliedRouteSpecies = useRef<PierCastSpeciesId | null>(null);
  const cameraRef = useRef<CameraRef>(null);
  const hasLoaded = useRef(false);
  const hasConditionsMap = useRef(false);
  const loadInFlight = useRef(false);
  const conditionsRequest = useRef(0);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const selectedState = usePierCastMapStore((state) => state.selectedState);
  const setSelectedState = usePierCastMapStore((state) =>
    state.setSelectedState
  );
  const mode = usePierCastMapStore((state) => state.mode);
  const setMode = usePierCastMapStore((state) => state.setMode);
  const timeMode = usePierCastMapStore((state) => state.timeMode);
  const setTimeMode = usePierCastMapStore((state) => state.setTimeMode);
  const windVisible = usePierCastMapStore((state) => state.windVisible);
  const setWindVisible = usePierCastMapStore((state) => state.setWindVisible);
  const windPresentation = usePierCastMapStore((state) => state.windPresentation);
  const setWindPresentation = usePierCastMapStore((state) =>
    state.setWindPresentation
  );
  const observationsVisible = usePierCastMapStore((state) =>
    state.observationsVisible
  );
  const setObservationsVisible = usePierCastMapStore((state) =>
    state.setObservationsVisible
  );
  const selectedValidAt = usePierCastMapStore((state) => state.selectedValidAt);
  const setSelectedValidAt = usePierCastMapStore((state) =>
    state.setSelectedValidAt
  );
  const savedView = usePierCastMapStore((state) => state.view);
  const setSavedView = usePierCastMapStore((state) => state.setView);
  const [catalog, setCatalog] = useState<PierCastConditionsCatalogResponseV4 | null>(null);
  const [conditionsMap, setConditionsMap] = useState<
    PierCastConditionsMapResponseV4 | null
  >(null);
  const [foundation, setFoundation] = useState<
    PierCastMapFoundationResponse | null
  >(null);
  const [foundationLoading, setFoundationLoading] = useState(true);
  const [foundationError, setFoundationError] = useState<string | null>(null);
  const [conditionsError, setConditionsError] = useState<string | null>(null);
  const [observations, setObservations] = useState<
    PierCastObservedTemperatureMapResponseV1 | null
  >(null);
  const [observationsError, setObservationsError] = useState<string | null>(
    null,
  );
  const [observationsLoading, setObservationsLoading] = useState(true);
  const [selectedObservationId, setSelectedObservationId] = useState<
    string | null
  >(null);
  const [selectedWindNodeId, setSelectedWindNodeId] = useState<string | null>(
    null,
  );
  const [usingOfflineBaseMap, setUsingOfflineBaseMap] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);
  const [mapIsActive, setMapIsActive] = useState(AppState.currentState === "active");
  const [mapFocused, setMapFocused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [topControlInset, setTopControlInset] = useState(188);
  const [measuredBottomHeight, setMeasuredBottomHeight] = useState(0);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetLoading, setTargetLoading] = useState(false);
  const lastScrubbedIndex = useRef(-1);

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  const load = useCallback(async (options?: { silent?: boolean }) => {
    if (!targetHydrated) return;
    if (loadInFlight.current) return;
    loadInFlight.current = true;
    const silent = options?.silent === true;
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    setFoundationLoading(true);
    const requestedTarget = selectedSpeciesRef.current;
    const conditionsRequestId = ++conditionsRequest.current;
    try {
      const [
        catalogResult,
        conditionsResult,
        foundationResult,
        observationsResult,
      ] = await Promise
        .allSettled([
          fetchPierCastConditionsCatalog(),
          fetchPierCastConditionsMap(requestedTarget ?? undefined),
          fetchPierCastMapFoundation(),
          fetchPierCastObservedTemperatureMap(),
        ]);
      if (observationsResult.status === "fulfilled") {
        setObservations(observationsResult.value);
        setObservationsError(null);
      } else {
        setObservationsError(
          observationsResult.reason instanceof Error
            ? observationsResult.reason.message
            : "Observed station temperatures could not be loaded.",
        );
      }
      if (foundationResult.status === "fulfilled") {
        setFoundation(foundationResult.value);
        setFoundationError(null);
      } else {
        setFoundationError(
          foundationResult.reason instanceof PierCastRequestError
            ? foundationResult.reason.message
            : foundationResult.reason instanceof Error
            ? foundationResult.reason.message
            : "Great Lakes conditions could not be loaded.",
        );
      }
      if (catalogResult.status === "rejected") throw catalogResult.reason;
      setCatalog(catalogResult.value);
      if (
        conditionsResult.status === "fulfilled" &&
        conditionsRequest.current === conditionsRequestId &&
        selectedSpeciesRef.current === requestedTarget
      ) {
        setConditionsMap(conditionsResult.value);
        hasConditionsMap.current = true;
        setConditionsError(null);
      } else if (
        conditionsResult.status === "rejected" &&
        conditionsRequest.current === conditionsRequestId &&
        selectedSpeciesRef.current === requestedTarget
      ) {
        setConditionsError(
          conditionsResult.reason instanceof Error
            ? conditionsResult.reason.message
            : "City conditions are temporarily unavailable.",
        );
        if (!hasConditionsMap.current && requestedTarget) {
          setMode("temperature");
          setTargetPromptVisible(true);
        }
      }
      hasLoaded.current = true;
      setError(null);
    } catch (caught) {
      if (!silent) {
        setError(
          caught instanceof PierCastRequestError
            ? caught.message
            : caught instanceof Error
            ? caught.message
            : "The PierCast map could not be loaded.",
        );
      }
    } finally {
      setLastCheckedAt(new Date());
      setFoundationLoading(false);
      setObservationsLoading(false);
      if (!silent) setLoading(false);
      loadInFlight.current = false;
    }
  }, [targetHydrated]);

  useFocusEffect(
    useCallback(() => {
      if (
        routeSpeciesId &&
        lastAppliedRouteSpecies.current !== routeSpeciesId
      ) {
        lastAppliedRouteSpecies.current = routeSpeciesId;
        selectedSpeciesRef.current = routeSpeciesId;
        setSelectedSpeciesId(routeSpeciesId);
        setTargetHydrated(true);
        setMode("match");
        void writePierCastTargetPreference(routeSpeciesId);
        return;
      }
      let active = true;
      void readPierCastTargetPreference().then((remembered) => {
        if (!active) return;
        selectedSpeciesRef.current = remembered;
        setSelectedSpeciesId(remembered);
        setTargetHydrated(true);
      });
      return () => { active = false; };
    }, [routeSpeciesId, setMode]),
  );

  useEffect(() => {
    if (!targetHydrated) return;
    const requestedTarget = selectedSpeciesId;
    const requestId = ++conditionsRequest.current;
    setTargetLoading(true);
    setConditionsError(null);
    void fetchPierCastConditionsMap(requestedTarget ?? undefined)
      .then((response) => {
        if (
          conditionsRequest.current !== requestId ||
          selectedSpeciesRef.current !== requestedTarget
        ) return;
        hasConditionsMap.current = true;
        setConditionsMap(response);
      })
      .catch((caught) => {
        if (
          conditionsRequest.current !== requestId ||
          selectedSpeciesRef.current !== requestedTarget
        ) return;
        setConditionsError(
          caught instanceof Error
            ? caught.message
            : "Species match conditions could not be loaded.",
        );
        if (requestedTarget) {
          setMode("temperature");
          setTargetPromptVisible(true);
        }
      })
      .finally(() => {
        if (conditionsRequest.current === requestId) setTargetLoading(false);
      });
  }, [selectedSpeciesId, setMode, targetHydrated]);

  const retryObservations = useCallback(async () => {
    setObservationsLoading(true);
    setObservationsError(null);
    try {
      setObservations(await fetchPierCastObservedTemperatureMap());
    } catch (caught) {
      setObservationsError(
        caught instanceof Error
          ? caught.message
          : "Observed station temperatures could not be loaded.",
      );
    } finally {
      setObservationsLoading(false);
    }
  }, []);

  const retryFoundation = useCallback(async () => {
    setFoundationLoading(true);
    setFoundationError(null);
    try {
      setFoundation(await fetchPierCastMapFoundation());
    } catch (caught) {
      setFoundationError(
        caught instanceof PierCastRequestError
          ? caught.message
          : caught instanceof Error
          ? caught.message
          : "Great Lakes conditions could not be loaded.",
      );
    } finally {
      setLastCheckedAt(new Date());
      setFoundationLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setMapFocused(true);
      captureAnalytics("pier_cast_visual_map_viewed");
      const refresh = () => void load({ silent: hasLoaded.current });
      refresh();
      const timer = setInterval(refresh, PIER_CAST_MAP_REFRESH_INTERVAL_MS);
      const subscription = AppState.addEventListener("change", (nextState) => {
        const wasBackgrounded = /inactive|background/.test(appState.current);
        appState.current = nextState;
        setMapIsActive(nextState === "active");
        if (wasBackgrounded && nextState === "active") refresh();
      });
      return () => {
        setMapFocused(false);
        clearInterval(timer);
        subscription.remove();
        setPlaying(false);
      };
    }, [load]),
  );

  useEffect(() => {
    if (!targetHydrated || initializedMapSemantics.current) return;
    initializedMapSemantics.current = true;
    setMode(selectedSpeciesRef.current ? "match" : "temperature");
    setTimeMode("now");
  }, [setMode, setTimeMode, targetHydrated]);

  const synchronizedValidTimes = useMemo(() => {
    return pierCastSynchronizedConditionsMapValidTimes(foundation, conditionsMap);
  }, [conditionsMap, foundation]);
  const nowValidAt = useMemo(
    () => closestPierCastTemperatureTime(synchronizedValidTimes, Date.now()),
    [synchronizedValidTimes],
  );
  const validTimes = useMemo(() => {
    if (timeMode === "now") return nowValidAt ? [nowValidAt] : [];
    return pierCastForecastMapValidTimes(synchronizedValidTimes, nowValidAt);
  }, [nowValidAt, synchronizedValidTimes, timeMode]);
  const activeValidAt = useMemo(() => {
    if (timeMode === "now") return nowValidAt;
    if (selectedValidAt && validTimes.includes(selectedValidAt)) {
      return selectedValidAt;
    }
    return validTimes[0] ?? nowValidAt;
  }, [nowValidAt, selectedValidAt, timeMode, validTimes]);
  const cities = useMemo(
    () =>
      catalog && conditionsMap
        ? buildPierCastConditionsMapCities(catalog, conditionsMap, activeValidAt)
        : [],
    [activeValidAt, catalog, conditionsMap],
  );
  const visibleCities = useMemo(
    () => filterPierCastConditionsMapCities(cities, selectedState),
    [cities, selectedState],
  );
  const temperatureRasterFrames = useMemo(
    () =>
      foundation && activeValidAt
        ? buildPierCastGreatLakesTemperatureRasterFrames(
          foundation,
          activeValidAt,
        )
        : [],
    [activeValidAt, foundation],
  );
  const bathymetryRasterFrames = useMemo(
    () => foundation ? buildPierCastBathymetryRasterFrames(foundation) : [],
    [foundation],
  );
  const windPoints = useMemo(
    () => activeValidAt ? pierCastWindFrame(foundation, activeValidAt) : [],
    [activeValidAt, foundation],
  );
  const renderWindPoints = useMemo(
    () => filterPierCastWindPointsForView(
      windPoints,
      savedView.center,
      savedView.zoom,
    ),
    [savedView.center, savedView.zoom, windPoints],
  );
  const windArrows = useMemo(
    () => buildPierCastWindArrowGeoJson(renderWindPoints, savedView.zoom),
    [renderWindPoints, savedView.zoom],
  );
  const windSummary = useMemo(
    () => summarizePierCastWindFrame(windPoints),
    [windPoints],
  );
  const windFlowActive = windPresentation === "flow" && !reduceMotion &&
    mapIsActive && mapFocused;
  const cityWindInsights = useMemo(
    () => buildPierCastCityWindInsights(visibleCities, windPoints),
    [visibleCities, windPoints],
  );
  const selectedWindPoint = useMemo(
    () =>
      windPoints.find((point) => point.nodeId === selectedWindNodeId) ?? null,
    [selectedWindNodeId, windPoints],
  );
  const observedStationsVisible = timeMode === "now" && observationsVisible;
  const selectedObservation = useMemo(
    () =>
      observations?.stations.find((station) =>
        station.readingId === selectedObservationId
      ) ?? null,
    [observations, selectedObservationId],
  );
  const targetPromptOptions = useMemo(() => {
    const options = conditionsMap?.targetSpecies ?? [];
    if (!pendingReportCityId) return options;
    const city = catalog?.cities.find((candidate) =>
      candidate.cityId === pendingReportCityId
    );
    return city
      ? options.filter((option) =>
        mapCitySupportedSpeciesIds(city).includes(option.speciesId)
      )
      : [];
  }, [catalog, conditionsMap?.targetSpecies, pendingReportCityId]);
  const selectedTimeIndex = activeValidAt
    ? validTimes.indexOf(activeValidAt)
    : -1;
  const timeLabel = temperatureTimeLabel(activeValidAt);
  const horizonLabel = pierCastTemperatureHorizonLabel(validTimes);
  const timelineTicks = useMemo(
    () => {
      const indexes = [0, 24, 48, 72, 96].filter((index) => index < validTimes.length);
      const lastIndex = Math.max(0, validTimes.length - 1);
      if (!indexes.includes(lastIndex)) indexes.push(lastIndex);
      return indexes.flatMap((hour, index) => {
        const validAt = validTimes[hour];
        return validAt
          ? [{ hour, label: forecastDayTickLabel(validAt, index) }]
          : [];
      });
    },
    [validTimes],
  );
  const estimatedMapBottomInset = panelExpanded
    ? mode === "temperature" || mode === "match"
      ? timeMode === "forecast"
        ? windVisible ? 380 : 290
        : windVisible ? 305 : 225
      : mode === "bathymetry"
      ? windVisible ? 360 : 265
      : windVisible
      ? 220
      : 190
    : 66;
  const mapBottomInset = Math.max(
    estimatedMapBottomInset +
      (panelExpanded && observedStationsVisible ? 26 : 0),
    measuredBottomHeight + 16,
  );
  const markerDensity: MarkerDensity = savedView.zoom < 5
    ? "overview"
    : savedView.zoom < 6.3 || savedView.zoom > 9.5
    ? "compact"
    : "detail";

  const selectTemperatureTime = useCallback((index: number) => {
    const bounded = Math.max(0, Math.min(validTimes.length - 1, index));
    const validAt = validTimes[bounded];
    if (!validAt) return;
    hapticSelection();
    setSelectedValidAt(validAt);
  }, [setSelectedValidAt, validTimes]);

  const chooseTimeMode = useCallback((nextMode: "now" | "forecast") => {
    hapticSelection();
    setPlaying(false);
    if (nextMode === "forecast") setSelectedObservationId(null);
    setTimeMode(nextMode);
    if (nextMode === "now") {
      setSelectedValidAt(nowValidAt);
    } else if (!selectedValidAt || !synchronizedValidTimes.includes(selectedValidAt)) {
      setSelectedValidAt(nowValidAt);
    }
    captureAnalytics("pier_cast_visual_map_time_mode_changed", {
      time_mode: nextMode,
    });
  }, [nowValidAt, selectedValidAt, setSelectedValidAt, setTimeMode, synchronizedValidTimes]);

  const selectTarget = useCallback((speciesId: PierCastSpeciesId) => {
    const reportCityId = pendingReportCityId;
    selectedSpeciesRef.current = speciesId;
    setSelectedSpeciesId(speciesId);
    setTargetPromptVisible(false);
    setPendingReportCityId(null);
    setTargetLoading(true);
    setError(null);
    setConditionsError(null);
    setMode("match");
    router.setParams({ speciesId });
    void writePierCastTargetPreference(speciesId);
    if (reportCityId) {
      router.push({
        pathname: "/pier-cast-review",
        params: {
          cityId: reportCityId,
          from: "map",
          speciesId,
          entry: String(Date.now()),
        },
      });
    }
  }, [pendingReportCityId, router, setMode]);

  const toggleWindPresentation = useCallback(() => {
    if (reduceMotion) return;
    hapticSelection();
    const next = windPresentation === "flow" ? "arrows" : "flow";
    setWindPresentation(next);
    captureAnalytics("pier_cast_visual_map_wind_presentation_changed", {
      presentation: next,
    });
  }, [reduceMotion, setWindPresentation, windPresentation]);

  const scrubTimeline = useCallback((locationX: number) => {
    if (timelineWidth <= 0 || validTimes.length === 0) return;
    const fraction = Math.max(0, Math.min(1, locationX / timelineWidth));
    const index = Math.round(fraction * (validTimes.length - 1));
    if (index === lastScrubbedIndex.current) return;
    lastScrubbedIndex.current = index;
    setSelectedValidAt(validTimes[index] ?? null);
  }, [setSelectedValidAt, timelineWidth, validTimes]);

  const timelinePanResponder = useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        hapticSelection();
        scrubTimeline(event.nativeEvent.locationX);
      },
      onPanResponderMove: (event) => {
        scrubTimeline(event.nativeEvent.locationX);
      },
      onPanResponderRelease: () => {
        captureAnalytics("pier_cast_visual_map_timeline_scrubbed", {
          forecast_hour: Math.max(0, lastScrubbedIndex.current),
        });
      },
    }), [scrubTimeline]);

  useEffect(() => {
    if (timeMode !== "forecast" || !playing || validTimes.length === 0) return;
    const timer = setInterval(() => {
      const currentIndex = activeValidAt
        ? validTimes.indexOf(activeValidAt)
        : -1;
      const playbackStep = savedView.zoom >= 8
        ? TEMPERATURE_TIME_STEP
        : PLAYBACK_OVERVIEW_STEP;
      const nextIndex = currentIndex + playbackStep;
      if (nextIndex >= validTimes.length) {
        setPlaying(false);
        return;
      }
      setSelectedValidAt(validTimes[nextIndex] ?? null);
    }, savedView.zoom >= 8 ? 2200 : 1500);
    return () => clearInterval(timer);
  }, [
    activeValidAt,
    playing,
    savedView.zoom,
    setSelectedValidAt,
    timeMode,
    validTimes,
  ]);

  const openCity = useCallback((entry: PierCastConditionsMapCity) => {
    if (
      !selectedSpeciesId ||
      !mapCitySupportedSpeciesIds(entry.city).includes(selectedSpeciesId)
    ) {
      setPendingReportCityId(entry.city.cityId);
      setTargetPromptVisible(true);
      captureAnalytics("pier_cast_visual_map_city_target_required", {
        city_id: entry.city.cityId,
        species_id: selectedSpeciesId,
      });
      return;
    }
    captureAnalytics("pier_cast_visual_map_city_opened", {
      city_id: entry.city.cityId,
      state: entry.city.stateCode,
      layer: mode,
      time_mode: timeMode,
      species_id: selectedSpeciesId,
    });
    router.push({
      pathname: "/pier-cast-review",
      params: {
        cityId: entry.city.cityId,
        from: "map",
        ...(selectedSpeciesId ? { speciesId: selectedSpeciesId } : {}),
        entry: String(Date.now()),
      },
    });
  }, [mode, router, selectedSpeciesId, timeMode]);

  const chooseState = useCallback((filter: PierCastMapFilter) => {
    hapticSelection();
    setSelectedState(filter);
    captureAnalytics("pier_cast_visual_map_filtered", { state: filter });
    cameraRef.current?.fitBounds(pierCastMapBoundsForFilter(filter), {
      padding: { top: topControlInset + 10, right: 64, bottom: mapBottomInset, left: 64 },
      duration: 550,
      easing: "ease",
    });
  }, [mapBottomInset, setSelectedState, topControlInset]);

  const showAllLakes = useCallback(() => {
    hapticSelection();
    setSelectedState("ALL");
    cameraRef.current?.fitBounds(PIER_CAST_GREAT_LAKES_BOUNDS, {
      padding: { top: topControlInset + 10, right: 24, bottom: mapBottomInset, left: 24 },
      duration: 650,
      easing: "ease",
    });
  }, [mapBottomInset, setSelectedState, topControlInset]);

  const changeZoom = useCallback((delta: number) => {
    const nextZoom = Math.max(
      PIER_CAST_MAP_MIN_ZOOM,
      Math.min(PIER_CAST_MAP_MAX_ZOOM, savedView.zoom + delta),
    );
    hapticSelection();
    cameraRef.current?.zoomTo(nextZoom, { duration: 280, easing: "ease" });
  }, [savedView.zoom]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to PierCast leaderboard"
          hitSlop={10}
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTitleWrap} pointerEvents="none">
          <Text style={styles.headerEyebrow}>PIERCAST · GREAT LAKES</Text>
          <Text style={styles.headerTitle}>VISUAL MAP</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show all five Great Lakes"
          hitSlop={8}
          onPress={showAllLakes}
          style={({ pressed }) => [
            styles.allLakesButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="earth-outline" size={15} color={paper.gold} />
          <Text style={styles.allLakesText}>5 LAKES</Text>
        </Pressable>
      </View>

      <View style={styles.mapShell}>
        {loading
          ? (
            <View style={styles.centerMessage}>
              <ActivityIndicator color={paper.dashboardBlue} />
              <Text style={styles.messageTitle}>Charting the shoreline</Text>
              <Text style={styles.messageCopy}>
                Loading modeled Great Lakes conditions…
              </Text>
            </View>
          )
          : error
          ? (
            <View style={styles.centerMessage}>
              <Ionicons
                name="cloud-offline-outline"
                size={28}
                color={paper.bandTough}
              />
              <Text style={styles.messageTitle}>Map unavailable</Text>
              <Text style={styles.messageCopy}>{error}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void load()}
                style={(
                  { pressed },
                ) => [styles.retryButton, pressed && styles.pressed]}
              >
                <Text style={styles.retryText}>TRY AGAIN</Text>
              </Pressable>
            </View>
          )
          : (
            <>
              <Map
                style={StyleSheet.absoluteFill}
                mapStyle={usingOfflineBaseMap
                  ? EMPTY_MAP_STYLE
                  : OPEN_FREE_MAP_STYLE}
                attribution={!usingOfflineBaseMap}
                attributionPosition={{ bottom: mapBottomInset + 8, left: 8 }}
                logo={false}
                compass
                compassPosition={{ bottom: mapBottomInset + 8, right: 12 }}
                scaleBar={!usingOfflineBaseMap && !targetPromptVisible}
                scaleBarPosition={{ top: topControlInset, left: 10 }}
                dragPan
                touchZoom
                doubleTapZoom
                doubleTapHoldZoom
                touchRotate
                touchPitch={false}
                preferredFramesPerSecond={60}
                onDidFailLoadingMap={() => {
                  if (usingOfflineBaseMap) return;
                  setUsingOfflineBaseMap(true);
                  captureAnalytics("pier_cast_visual_map_basemap_fallback");
                }}
                onRegionDidChange={(event) => {
                  const { center, zoom } = event.nativeEvent;
                  if (savedView.zoom < 8 && zoom >= 8) setPanelExpanded(false);
                  setSavedView({ center: [center[0], center[1]], zoom });
                }}
              >
                <Camera
                  ref={cameraRef}
                  initialViewState={{
                    center: savedView.center,
                    zoom: savedView.zoom,
                  }}
                  minZoom={PIER_CAST_MAP_MIN_ZOOM}
                  maxZoom={PIER_CAST_MAP_MAX_ZOOM}
                  maxBounds={[-97.5, 36.5, -70.5, 52]}
                />
                <GeoJSONSource
                  id="great-lakes-regions"
                  data={mapGeometry.regions as FeatureCollection}
                >
                  {usingOfflineBaseMap
                    ? (
                      <Layer
                        id="great-lakes-region-fill"
                        type="fill"
                        style={{ fillColor: "#E9E0CE", fillOpacity: 1 }}
                      />
                    )
                    : null}
                  {usingOfflineBaseMap
                    ? (
                      <Layer
                        id="great-lakes-region-line"
                        type="line"
                        style={{
                          lineColor: "#8E816F",
                          lineWidth: 1,
                          lineOpacity: 0.78,
                        }}
                      />
                    )
                    : null}
                  {selectedState !== "ALL"
                    ? (
                      <Layer
                        id="selected-pier-cast-state"
                        type="line"
                        filter={[
                          "==",
                          ["get", "code"],
                          pierCastMapRegionFeatureCode(selectedState),
                        ]}
                        style={{
                          lineColor: paper.gold,
                          lineWidth: 3,
                          lineOpacity: 1,
                        }}
                      />
                    )
                    : null}
                </GeoJSONSource>
                <GeoJSONSource
                  id="great-lakes-water"
                  data={mapGeometry.lakes as FeatureCollection}
                >
                  {usingOfflineBaseMap
                    ? (
                      <Layer
                        id="great-lakes-water-fill"
                        type="fill"
                        style={{ fillColor: "#1E5C80", fillOpacity: 0.96 }}
                      />
                    )
                    : null}
                  {!usingOfflineBaseMap && mode === "match"
                    ? (
                      <Layer
                        id="great-lakes-water-tint"
                        type="fill"
                        beforeId="road_area_pier"
                        maxzoom={7.25}
                        style={{ fillColor: "#1E5C80", fillOpacity: 0.32 }}
                      />
                    )
                    : null}
                  {usingOfflineBaseMap
                    ? (
                      <Layer
                        id="great-lakes-water-line"
                        type="line"
                        style={{
                          lineColor: "#7EC4DA",
                          lineWidth: 1.2,
                          lineOpacity: 0.85,
                        }}
                      />
                    )
                    : null}
                </GeoJSONSource>

                {mode !== "bathymetry"
                  ? temperatureRasterFrames.map((frame) => (
                    <RasterSource
                      key={`temperature-${frame.ofsId}`}
                      id={`pier-cast-temperature-${frame.ofsId.toLowerCase()}`}
                      tiles={[frame.tileUrl]}
                      tileSize={256}
                      minzoom={3}
                      maxzoom={PIER_CAST_MAP_MAX_ZOOM}
                      attribution={`NOAA NOS ${frame.ofsId}`}
                    >
                      <Layer
                        id={`pier-cast-temperature-surface-${frame.ofsId.toLowerCase()}`}
                        type="raster"
                        beforeId={usingOfflineBaseMap
                          ? undefined
                          : "road_area_pier"}
                        style={{
                          rasterOpacity: 0.94,
                          rasterOpacityTransition: { duration: 260, delay: 0 },
                          rasterResampling: "linear",
                          rasterFadeDuration: playing ? 320 : 240,
                        }}
                      />
                    </RasterSource>
                  ))
                  : null}

                {mode === "bathymetry"
                  ? bathymetryRasterFrames.map((frame) => (
                    <RasterSource
                      key={`depth-${frame.ofsId}`}
                      id={`pier-cast-depth-${frame.ofsId.toLowerCase()}`}
                      tiles={[frame.rasterTileUrl]}
                      tileSize={256}
                      minzoom={3}
                      maxzoom={PIER_CAST_MAP_MAX_ZOOM}
                      attribution={`NOAA NOS ${frame.ofsId} bathymetry`}
                    >
                      <Layer
                        id={`pier-cast-depth-surface-${frame.ofsId.toLowerCase()}`}
                        type="raster"
                        beforeId={usingOfflineBaseMap
                          ? undefined
                          : "road_area_pier"}
                        style={{
                          rasterOpacity: 0.94,
                          rasterOpacityTransition: { duration: 260, delay: 0 },
                          rasterResampling: "linear",
                          rasterContrast: 0.1,
                          rasterSaturation: 0.08,
                          rasterFadeDuration: 240,
                        }}
                      />
                    </RasterSource>
                  ))
                  : null}

                {mode === "bathymetry"
                  ? bathymetryRasterFrames.map((frame) => (
                    <RasterSource
                      key={`contours-${frame.ofsId}`}
                      id={`pier-cast-contours-${frame.ofsId.toLowerCase()}`}
                      tiles={[frame.contourTileUrl]}
                      tileSize={256}
                      minzoom={5}
                      maxzoom={PIER_CAST_MAP_MAX_ZOOM}
                      attribution={`NOAA NOS ${frame.ofsId} depth contours`}
                    >
                      <Layer
                        id={`pier-cast-depth-contours-${frame.ofsId.toLowerCase()}`}
                        type="raster"
                        style={{
                          rasterOpacity: [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            5,
                            0.18,
                            9,
                            0.48,
                            14,
                            0.68,
                          ],
                          rasterResampling: "linear",
                          rasterFadeDuration: 180,
                        }}
                      />
                    </RasterSource>
                  ))
                  : null}

                {mode !== "bathymetry"
                  ? (
                    <GeoJSONSource
                      id="great-lakes-temperature-land-mask"
                      data={mapGeometry.regions as FeatureCollection}
                    >
                      {usingOfflineBaseMap
                        ? (
                          <Layer
                            id="great-lakes-temperature-coast-line"
                            type="line"
                            style={{
                              lineColor: "#6E6355",
                              lineWidth: [
                                "interpolate",
                                ["linear"],
                                ["zoom"],
                                4,
                                0.8,
                                9,
                                1.35,
                                14,
                                2,
                              ],
                              lineOpacity: 0.82,
                            }}
                          />
                        )
                        : null}
                    </GeoJSONSource>
                  )
                  : null}

                {windVisible && windArrows.features.length > 0
                  ? (
                    <GeoJSONSource
                      id="pier-cast-wind-arrows"
                      data={windArrows}
                      hitbox={{ top: 12, right: 12, bottom: 12, left: 12 }}
                      onPress={(event) => {
                        const nodeId = event.nativeEvent.features[0]?.properties
                          ?.nodeId;
                        if (typeof nodeId !== "string") return;
                        hapticSelection();
                        setSelectedWindNodeId(nodeId);
                      }}
                    >
                      <Layer
                        id="pier-cast-wind-arrow-shadow"
                        type="line"
                        style={{
                          lineColor: "rgba(3,18,30,0.72)",
                          lineWidth: ["+", ["get", "width"], 2.1],
                          lineOpacity: windFlowActive ? 0.3 : 0.72,
                          lineCap: "round",
                          lineJoin: "round",
                        }}
                      />
                      <Layer
                        id="pier-cast-wind-arrow-color"
                        type="line"
                        style={{
                          lineColor: ["get", "tone"],
                          lineWidth: ["get", "width"],
                          lineOpacity: windFlowActive
                            ? mode === "match" ? 0.28 : 0.34
                            : mode === "match" ? 0.78 : 0.92,
                          lineCap: "round",
                          lineJoin: "round",
                        }}
                      />
                    </GeoJSONSource>
                  )
                  : null}

                <WindFlowLayer
                  points={renderWindPoints}
                  zoom={savedView.zoom}
                  visible={windVisible && windFlowActive}
                  mode={mode}
                  onSelect={(nodeId) => {
                    hapticSelection();
                    setSelectedWindNodeId(nodeId);
                  }}
                />

                {usingOfflineBaseMap && savedView.zoom < 7.2
                  ? REGION_LABELS.map((label) => (
                    <Marker
                      key={label.label}
                      id={`region-${label.label}`}
                      lngLat={label.coordinate}
                    >
                      <View pointerEvents="none" style={styles.regionLabelWrap}>
                        <Text style={styles.regionLabel}>{label.label}</Text>
                      </View>
                    </Marker>
                  ))
                  : null}
                {savedView.zoom < 7.2
                  ? LAKE_LABELS.map((label) => (
                    <Marker
                      key={label.label}
                      id={`lake-${label.label}`}
                      lngLat={label.coordinate}
                    >
                      <Text pointerEvents="none" style={styles.lakeLabel}>
                        {label.label}
                      </Text>
                    </Marker>
                  ))
                  : null}
                {visibleCities.map((entry) => (
                  <CityMarker
                    key={entry.city.cityId}
                    entry={entry}
                    density={markerDensity}
                    mode={mode}
                    selectedSpeciesId={selectedSpeciesId}
                    onOpen={() => openCity(entry)}
                  />
                ))}
                {observedStationsVisible
                  ? observations?.stations.map((station) => (
                    <ObservedTemperatureMarker
                      key={station.readingId}
                      station={station}
                      selected={station.readingId === selectedObservationId}
                      onSelect={() => {
                        setSelectedObservationId(station.readingId);
                        captureAnalytics(
                          "pier_cast_observed_temperature_opened",
                          {
                            station_id: station.stationId,
                            dataset_id: station.datasetId,
                            freshness: station.freshness,
                            quality: station.quality,
                          },
                        );
                      }}
                    />
                  ))
                  : null}
              </Map>

              <View
                style={styles.topOverlay}
                pointerEvents="box-none"
                onLayout={(event) => {
                  const next = Math.ceil(
                    event.nativeEvent.layout.y + event.nativeEvent.layout.height + 8,
                  );
                  setTopControlInset((current) => current === next ? current : next);
                }}
              >
                <View style={styles.timeModeRow}>
                  {(["now", "forecast"] as const).map((candidate) => {
                    const selected = timeMode === candidate;
                    return (
                      <Pressable
                        key={candidate}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        accessibilityLabel={`Show ${candidate === "now" ? "current modeled conditions" : "forecast model timeline"}`}
                        onPress={() => chooseTimeMode(candidate)}
                        style={({ pressed }) => [
                          styles.timeModeTab,
                          selected && styles.timeModeTabActive,
                          pressed && styles.pressed,
                        ]}
                      >
                        <View style={[styles.timeModeDot, selected && styles.timeModeDotActive]} />
                        <Text style={[styles.timeModeText, selected && styles.timeModeTextActive]}>
                          {candidate === "now" ? "NOW" : "FORECAST"}
                        </Text>
                      </Pressable>
                    );
                  })}
                  <Text style={styles.timeModeDisclosure} numberOfLines={1}>
                    {timeMode === "now" ? "CLOSEST MODEL HOUR" : "HOURLY MODEL GUIDANCE"}
                  </Text>
                </View>
                <View style={styles.modeRow}>
                  <Pressable
                    accessibilityRole="button"
                    hitSlop={10}
                    accessibilityState={{ selected: mode === "match" }}
                    accessibilityLabel="Show species temperature match"
                    onPress={() => {
                      hapticSelection();
                      if (!selectedSpeciesId) {
                        setPendingReportCityId(null);
                        setTargetPromptVisible(true);
                        return;
                      }
                      if (mode !== "match") setPanelExpanded(true);
                      setMode("match");
                      captureAnalytics("pier_cast_visual_map_layer_changed", {
                        layer: "match",
                      });
                    }}
                    style={({ pressed }) => [
                      styles.modeTab,
                      mode === "match"
                        ? styles.modeTabActive
                        : styles.modeTabInactive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name="fish-outline"
                      size={13}
                      color={mode === "match"
                        ? "#FFFFFF"
                        : paper.dashboardMuted}
                    />
                    <Text
                      style={mode === "match"
                        ? styles.modeTabActiveText
                        : styles.modeTabInactiveText}
                    >
                      MATCH
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    hitSlop={10}
                    accessibilityState={{ selected: mode === "temperature" }}
                    accessibilityLabel="Show modeled nearshore water temperatures"
                    onPress={() => {
                      hapticSelection();
                      if (mode !== "temperature") setPanelExpanded(true);
                      setMode("temperature");
                      captureAnalytics("pier_cast_visual_map_layer_changed", {
                        layer: "temperature",
                      });
                    }}
                    style={({ pressed }) => [
                      styles.modeTab,
                      mode === "temperature"
                        ? styles.modeTabActive
                        : styles.modeTabInactive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name="thermometer-outline"
                      size={13}
                      color={mode === "temperature"
                        ? "#FFFFFF"
                        : paper.dashboardMuted}
                    />
                    <Text
                      style={mode === "temperature"
                        ? styles.modeTabActiveText
                        : styles.modeTabInactiveText}
                    >
                      TEMP
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: mode === "bathymetry" }}
                    accessibilityLabel="Show Great Lakes bathymetry and depth contours"
                    onPress={() => {
                      hapticSelection();
                      setPlaying(false);
                      if (mode !== "bathymetry") setPanelExpanded(true);
                      setMode("bathymetry");
                      captureAnalytics("pier_cast_visual_map_layer_changed", {
                        layer: "bathymetry",
                      });
                    }}
                    style={({ pressed }) => [
                      styles.modeTab,
                      mode === "bathymetry"
                        ? styles.modeTabActive
                        : styles.modeTabInactive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name="layers-outline"
                      size={13}
                      color={mode === "bathymetry"
                        ? "#FFFFFF"
                        : paper.dashboardMuted}
                    />
                    <Text
                      style={mode === "bathymetry"
                        ? styles.modeTabActiveText
                        : styles.modeTabInactiveText}
                    >
                      DEPTH
                    </Text>
                  </Pressable>
                  <View style={styles.datePill}>
                    <Text style={styles.datePillLabel}>
                      {mode === "bathymetry"
                        ? "STATIC LAYER"
                        : timeMode === "now" ? "NOW · MODELED" : "FORECAST · MODELED"}
                    </Text>
                    <Text style={styles.datePillValue} numberOfLines={1}>
                      {mode !== "bathymetry"
                        ? `${timeLabel.date} · ${timeLabel.eastern}`
                        : "ALL FIVE GREAT LAKES"}
                    </Text>
                  </View>
                </View>
                <View style={styles.targetControlRow}>
                  <Text style={styles.targetControlEyebrow}>MATCH TARGET</Text>
                  <Pressable
                    accessibilityRole="button"
                    hitSlop={10}
                    accessibilityLabel={`${selectedSpeciesId ? `Selected target ${PIER_CAST_SPECIES_LABELS[selectedSpeciesId]}` : "No target selected"}. Open species selector without moving the map or forecast hour.`}
                    onPress={() => {
                      hapticSelection();
                      setPendingReportCityId(null);
                      setTargetPromptVisible(true);
                    }}
                    style={({ pressed }) => [
                      styles.targetControlChip,
                      mode === "match" && styles.targetControlChipActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name="fish-outline"
                      size={12}
                      color={mode === "match" ? "#FFFFFF" : paper.dashboardBlueLight}
                    />
                    <Text style={styles.targetControlName} numberOfLines={1}>
                      {selectedSpeciesId
                        ? PIER_CAST_SPECIES_LABELS[selectedSpeciesId].toUpperCase()
                        : "CHOOSE SPECIES"}
                    </Text>
                    {targetLoading
                      ? <ActivityIndicator size="small" color={paper.gold} />
                      : <Ionicons name="chevron-down" size={11} color={paper.gold} />}
                  </Pressable>
                  <Text style={styles.targetControlHint} numberOfLines={1}>
                    {mode === "match" ? "COLORS CITY TEMP FIT" : "USED BY MATCH"}
                  </Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.stateRail}
                >
                  {STATE_FILTERS.map((filter) => {
                    const selected = selectedState === filter;
                    const count = filter === "ALL"
                      ? cities.length
                      : cities.filter((entry) =>
                        entry.city.stateCode === filter
                      ).length;
                    return (
                      <Pressable
                        key={filter}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        accessibilityLabel={`${
                          filter === "ALL" ? "All states" : STATE_NAMES[filter]
                        }, ${count} cities`}
                        onPress={() => chooseState(filter)}
                        style={({ pressed }) => [
                          styles.stateChip,
                          selected && styles.stateChipSelected,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.stateChipText,
                            selected && styles.stateChipTextSelected,
                          ]}
                        >
                          {filter}
                        </Text>
                        <Text
                          style={[
                            styles.stateChipCount,
                            selected && styles.stateChipCountSelected,
                          ]}
                        >
                          {count}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                {targetPromptVisible ? (
                  <View style={styles.targetPrompt}>
                    <View style={styles.targetPromptHead}>
                      <View style={styles.targetPromptCopy}>
                        <Text style={styles.targetPromptEyebrow}>
                          {pendingReportCityId ? "CHOOSE A SUPPORTED TARGET" : "MATCH REQUIRES A TARGET"}
                        </Text>
                        <Text style={styles.targetPromptTitle}>
                          {pendingReportCityId
                            ? `Open ${catalog?.cities.find((city) => city.cityId === pendingReportCityId)?.displayName ?? "city"}`
                            : "What are you targeting?"}
                        </Text>
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Close species selector"
                        onPress={() => {
                          setTargetPromptVisible(false);
                          setPendingReportCityId(null);
                        }}
                        style={styles.targetPromptClose}
                      >
                        <Ionicons name="close" size={18} color={paper.dashboardInk} />
                      </Pressable>
                    </View>
                    <Text style={styles.targetPromptDetail}>
                      {conditionsError ?? (pendingReportCityId
                        ? "Choose a species supported at this city. Its report will open without changing the saved map view."
                        : "Choose one species to translate modeled water temperature into a match. The camera will not move.")}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.targetPromptRail}>
                      {targetPromptOptions.map((option) => (
                        <Pressable
                          key={option.speciesId}
                          accessibilityRole="button"
                          accessibilityLabel={`Show ${option.displayName} temperature match`}
                          onPress={() => selectTarget(option.speciesId)}
                          style={({ pressed }) => [styles.targetPromptChip, pressed && styles.pressed]}
                        >
                          <Text style={styles.targetPromptChipText}>{option.displayName}</Text>
                          <Text style={styles.targetPromptChipMeta}>
                            {option.placement === "commonly_targeted_now" ? "COMMON NOW" : "ALL SPECIES"}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                    {!targetLoading && targetPromptOptions.length === 0 ? (
                      <Text style={styles.targetPromptUnavailable}>
                        TARGET OPTIONS ARE TEMPORARILY UNAVAILABLE · RETRY BELOW
                      </Text>
                    ) : null}
                    {(conditionsError && !conditionsMap) ||
                        (!targetLoading && targetPromptOptions.length === 0) ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Retry target species"
                        onPress={() => void load({ silent: true })}
                        style={({ pressed }) => [styles.targetPromptRetry, pressed && styles.pressed]}
                      >
                        <Text style={styles.targetPromptRetryText}>RETRY TARGETS</Text>
                      </Pressable>
                    ) : null}
                  </View>
                ) : null}
              </View>

              <View
                style={[
                  styles.mapTools,
                  { top: topControlInset },
                  targetPromptVisible && styles.mapToolsHidden,
                ]}
                pointerEvents={targetPromptVisible ? "none" : "box-none"}
              >
                <Pressable
                  accessibilityRole="switch"
                  accessibilityState={{
                    checked: observedStationsVisible,
                    disabled: timeMode !== "now",
                  }}
                  accessibilityLabel={timeMode === "now"
                    ? `${observationsVisible ? "Hide" : "Show"} observed station temperatures`
                    : "Observed station temperatures are available in Now mode only"}
                  disabled={timeMode !== "now"}
                  onPress={() => {
                    hapticSelection();
                    const visible = !observationsVisible;
                    setObservationsVisible(visible);
                    if (!visible) setSelectedObservationId(null);
                    captureAnalytics(
                      "pier_cast_observed_temperature_toggled",
                      { visible },
                    );
                  }}
                  style={({ pressed }) => [
                    styles.observationToggle,
                    observedStationsVisible && styles.observationToggleActive,
                    timeMode !== "now" && styles.observationToggleDisabled,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons
                    name="radio-outline"
                    size={14}
                    color={observedStationsVisible
                      ? paper.dashboardInk
                      : "#FFFFFF"}
                  />
                  <View>
                    <Text
                      style={[
                        styles.windToggleLabel,
                        observedStationsVisible && styles.windToggleLabelActive,
                      ]}
                    >
                      OBS {timeMode === "now"
                        ? observationsVisible ? "ON" : "OFF"
                        : "NOW ONLY"}
                    </Text>
                    <Text
                      style={[
                        styles.windToggleValue,
                        observedStationsVisible && styles.windToggleValueActive,
                      ]}
                    >
                      {observationsLoading
                        ? "LOADING"
                        : observationsError
                        ? observations ? "REFRESH FAILED" : "UNAVAILABLE"
                        : observations?.cacheStatus === "stale"
                        ? "ARCHIVE STALE"
                        : `${observations?.stations.length ?? 0} STATIONS`}
                    </Text>
                  </View>
                </Pressable>
                {observedStationsVisible && observationsError
                  ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Retry observed station temperatures"
                      onPress={() => void retryObservations()}
                      style={({ pressed }) => [
                        styles.observationReadout,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={styles.observationReadoutEyebrow}>
                        {observations
                          ? "STATION REFRESH FAILED"
                          : "OBSERVATIONS UNAVAILABLE"}
                      </Text>
                      <Text style={styles.observationReadoutMeta}>
                        {observations
                          ? "LAST ARCHIVED POINTS SHOWN · TAP TO RETRY"
                          : "MODELED LAYERS STILL WORK · TAP TO RETRY"}
                      </Text>
                    </Pressable>
                  )
                  : null}
                {observedStationsVisible && !observationsError &&
                    !observationsLoading && observations?.stations.length === 0
                  ? (
                    <View style={styles.observationReadout}>
                      <Text style={styles.observationReadoutEyebrow}>
                        NO QUALIFYING READINGS
                      </Text>
                      <Text style={styles.observationReadoutMeta}>
                        STATIONS MAY BE SEASONAL OR FAILING QUALITY CHECKS
                      </Text>
                    </View>
                  )
                  : null}
                {observedStationsVisible && selectedObservation
                  ? (
                    <View
                      accessible
                      accessibilityLabel={`${selectedObservation.displayName}. ${Math.round(observedTemperatureF(selectedObservation))} degrees Fahrenheit. ${selectedObservation.measurementDepthM === null ? "Sensor depth not reported" : `Sensor depth ${selectedObservation.measurementDepthM} meters`}. Quality ${selectedObservation.quality === "passed" ? "passed" : "not evaluated"}. Point observation, not a pier or lake-wide temperature.`}
                      style={styles.observationReadout}
                    >
                      <View style={styles.observationReadoutHeader}>
                        <Text
                          numberOfLines={2}
                          style={styles.observationReadoutEyebrow}
                        >
                          {selectedObservation.freshness === "fresh"
                            ? "LIVE OBSERVATION"
                            : `${selectedObservation.freshness.toUpperCase()} OBSERVATION`}
                          {" · "}{selectedObservation.displayName.toUpperCase()}
                        </Text>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Close observed temperature details"
                          hitSlop={8}
                          onPress={() => setSelectedObservationId(null)}
                        >
                          <Ionicons name="close" size={14} color="#FFFFFF" />
                        </Pressable>
                      </View>
                      <Text style={styles.observationReadoutValue}>
                        {Math.round(observedTemperatureF(selectedObservation))}°F
                      </Text>
                      <Text style={styles.observationReadoutMeta}>
                        {observationClockLabel(selectedObservation.observedAt)} ·{" "}
                        {selectedObservation.measurementDepthM === null
                          ? "DEPTH NOT REPORTED"
                          : `${selectedObservation.measurementDepthM}M DEPTH`}
                      </Text>
                      <Text style={styles.observationReadoutMeta}>
                        QC {selectedObservation.quality === "passed"
                          ? "PASSED"
                          : "NOT EVALUATED"} · {selectedObservation.datasetId.toUpperCase()}
                      </Text>
                      <Text style={styles.observationReadoutCaution}>
                        POINT READING · NOT A PIER, HARBOR, OR LAKE-WIDE TEMPERATURE
                      </Text>
                      <Pressable
                        accessibilityRole="link"
                        accessibilityLabel={`Open ${selectedObservation.provider} source`}
                        onPress={() =>
                          void Linking.openURL(selectedObservation.sourceUrl)}
                        style={({ pressed }) => [
                          styles.observationSourceButton,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text style={styles.observationSourceText}>
                          VIEW GLOS / SEAGULL SOURCE
                        </Text>
                        <Ionicons
                          name="open-outline"
                          size={11}
                          color={paper.gold}
                        />
                      </Pressable>
                    </View>
                  )
                  : null}
                <Pressable
                  accessibilityRole="switch"
                  accessibilityState={{ checked: windVisible }}
                  accessibilityLabel={`${
                    windVisible ? "Hide" : "Show"
                  } wind direction and speed`}
                  onPress={() => {
                    hapticSelection();
                    setWindVisible(!windVisible);
                    if (windVisible) setSelectedWindNodeId(null);
                    captureAnalytics("pier_cast_visual_map_wind_toggled", {
                      visible: !windVisible,
                    });
                  }}
                  style={({ pressed }) => [
                    styles.windToggle,
                    windVisible && styles.windToggleActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons
                    name="navigate-outline"
                    size={14}
                    color={windVisible ? paper.dashboardInk : "#FFFFFF"}
                  />
                  <View>
                    <Text
                      style={[
                        styles.windToggleLabel,
                        windVisible && styles.windToggleLabelActive,
                      ]}
                    >
                      WIND {windVisible ? "ON" : "OFF"}
                    </Text>
                    <Text
                      style={[
                        styles.windToggleValue,
                        windVisible && styles.windToggleValueActive,
                      ]}
                    >
                      {windSummary
                        ? `${windFlowActive ? "FLOW" : "ARROWS"} · AVG ${windSummary.averageMph} MPH`
                        : "FORECAST"}
                    </Text>
                  </View>
                </Pressable>
                {windVisible && selectedWindPoint
                  ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Close selected wind reading"
                      onPress={() => setSelectedWindNodeId(null)}
                      style={styles.windReadout}
                    >
                      <Text style={styles.windReadoutEyebrow}>
                        {selectedWindPoint.lakeId.toUpperCase()} ·{" "}
                        {pierCastWindBandLabel(selectedWindPoint.speedMph)}
                      </Text>
                      <Text style={styles.windReadoutValue}>
                        {Math.round(selectedWindPoint.speedMph)} MPH
                      </Text>
                      <Text style={styles.windReadoutMeta}>
                        GUST {Math.round(selectedWindPoint.gustMph)} · FROM{" "}
                        {pierCastWindCompassDirection(
                          selectedWindPoint.directionDegrees,
                        )} ({Math.round(selectedWindPoint.directionDegrees)}°)
                      </Text>
                    </Pressable>
                  )
                  : null}
                <View style={styles.zoomControl}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Zoom in"
                    disabled={savedView.zoom >= PIER_CAST_MAP_MAX_ZOOM - 0.1}
                    onPress={() => changeZoom(1)}
                    style={({ pressed }) => [
                      styles.zoomButton,
                      savedView.zoom >= PIER_CAST_MAP_MAX_ZOOM - 0.1 &&
                      styles.zoomButtonDisabled,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons name="add" size={21} color={paper.dashboardInk} />
                  </Pressable>
                  <View style={styles.zoomDivider} />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Zoom out"
                    disabled={savedView.zoom <= PIER_CAST_MAP_MIN_ZOOM + 0.1}
                    onPress={() => changeZoom(-1)}
                    style={({ pressed }) => [
                      styles.zoomButton,
                      savedView.zoom <= PIER_CAST_MAP_MIN_ZOOM + 0.1 &&
                      styles.zoomButtonDisabled,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name="remove"
                      size={21}
                      color={paper.dashboardInk}
                    />
                  </Pressable>
                </View>
                <View pointerEvents="none" style={styles.gestureHint}>
                  <Ionicons name="scan-outline" size={12} color="#FFFFFF" />
                  <Text style={styles.gestureHintText}>
                    {savedView.zoom >= 9.5
                      ? "SHORELINE DETAIL"
                      : "PINCH · PAN · TAP"}
                  </Text>
                </View>
              </View>

              <View
                style={styles.bottomOverlay}
                onLayout={(event) => {
                  const next = Math.ceil(event.nativeEvent.layout.height);
                  setMeasuredBottomHeight((current) => current === next ? current : next);
                }}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={panelExpanded
                    ? "Collapse map details"
                    : "Expand map details"}
                  accessibilityState={{ expanded: panelExpanded }}
                  onPress={() => {
                    hapticSelection();
                    setPanelExpanded((current) => !current);
                  }}
                  style={(
                    { pressed },
                  ) => [styles.legendHeading, pressed && styles.pressed]}
                >
                  <View style={styles.legendHeadingCopy}>
                    <Text style={styles.legendEyebrow}>
                      {mode === "match"
                        ? "SPECIES TEMPERATURE MATCH"
                        : mode === "temperature"
                        ? "NOAA MODELED SURFACE WATER"
                        : "NOAA GREAT LAKES BATHYMETRY"}
                    </Text>
                    <Text style={styles.legendTitle}>
                      {mode === "match"
                        ? selectedSpeciesId
                          ? `${PIER_CAST_SPECIES_LABELS[selectedSpeciesId]} · ${timeLabel.date} · ${timeLabel.eastern}`
                          : "Choose a target species to interpret temperature."
                        : mode === "temperature"
                        ? `${timeLabel.date} · ${timeLabel.eastern} / ${timeLabel.central}`
                        : "Read structure, breaks, and basin shape before choosing a pier."}
                    </Text>
                  </View>
                  <View style={styles.legendHeadingMeta}>
                    <Text style={styles.visibleCount}>
                      {String(
                        visibleCities.length,
                      ).padStart(2, "0")} CITIES
                    </Text>
                    <Ionicons
                      name={panelExpanded ? "chevron-down" : "chevron-up"}
                      size={14}
                      color="rgba(255,255,255,0.72)"
                    />
                  </View>
                </Pressable>
                {panelExpanded && foundationLoading && !foundation
                  ? (
                    <View style={styles.temperatureStatusRow}>
                      <ActivityIndicator size="small" color={paper.gold} />
                      <Text style={styles.temperatureStatusText}>
                        LOADING FIVE-LAKE TEMPERATURE, WIND, AND DEPTH…
                      </Text>
                    </View>
                  )
                  : panelExpanded && foundationError && !foundation
                  ? (
                    <View style={styles.temperatureStatusRow}>
                      <Text
                        style={styles.temperatureStatusText}
                        numberOfLines={2}
                      >
                        {foundationError}
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Retry Great Lakes conditions"
                        onPress={() => void retryFoundation()}
                        style={({ pressed }) => [
                          styles.temperatureRetry,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text style={styles.temperatureRetryText}>RETRY</Text>
                      </Pressable>
                    </View>
                  )
                  : panelExpanded && (mode === "temperature" || mode === "match")
                  ? (
                    <>
                      <View style={styles.modelStatusRow}>
                        <View
                          style={[
                            styles.liveDot,
                            (foundationError || conditionsError ||
                              foundation?.cacheStatus === "stale") &&
                            styles.liveDotWarning,
                          ]}
                        />
                        <Text style={styles.modelStatusText}>
                          {modelCycleLabel(
                            foundation?.temperature.cycleIssuedAt,
                          )} CYCLE
                          {lastCheckedAt
                            ? ` · CHECKED ${shortClockLabel(lastCheckedAt)}`
                            : ""}
                          {foundationLoading
                            ? " · REFRESHING"
                            : targetLoading
                            ? " · UPDATING TARGET"
                            : " · HOURLY TEMP + WIND FRAMES"}
                        </Text>
                      </View>
                      {(foundationError ||
                          foundation?.cacheStatus === "stale") && foundation
                        ? (
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Retry water temperature refresh"
                            onPress={() => void retryFoundation()}
                            style={(
                              { pressed },
                            ) => [
                              styles.staleNotice,
                              pressed && styles.pressed,
                            ]}
                          >
                            <Ionicons
                              name="cloud-offline-outline"
                              size={12}
                              color={paper.gold}
                            />
                            <Text
                              numberOfLines={1}
                              style={styles.staleNoticeText}
                            >
                              {foundation.cacheStatus === "stale"
                                ? "BOUNDED STALE DATA SHOWN · TAP TO RETRY"
                                : "LAST GOOD MODEL SHOWN · TAP TO RETRY"}
                            </Text>
                          </Pressable>
                        )
                        : null}
                      {conditionsError ? (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Retry city condition markers"
                          onPress={() => void load({ silent: true })}
                          style={({ pressed }) => [styles.staleNotice, pressed && styles.pressed]}
                        >
                          <Ionicons name="alert-circle-outline" size={12} color={paper.gold} />
                          <Text numberOfLines={1} style={styles.staleNoticeText}>
                            CITY MARKERS UNAVAILABLE · RAW MAP LAYERS STILL WORK · TAP TO RETRY
                          </Text>
                        </Pressable>
                      ) : null}
                      {observedStationsVisible && !observationsError ? (
                        <View style={styles.observationDisclosureRow}>
                          <Ionicons
                            name="radio-outline"
                            size={11}
                            color={paper.gold}
                          />
                          <Text style={styles.observationDisclosureText}>
                            COLORED SURFACE = MODELED · OUTLINED POINTS = OBSERVED STATIONS · OBSERVATIONS NEVER AFFECT RANKING
                          </Text>
                        </View>
                      ) : null}
                      {mode === "match" ? (
                        <View style={styles.matchLegendWrap}>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Change target species from ${selectedSpeciesId ? PIER_CAST_SPECIES_LABELS[selectedSpeciesId] : "none"}`}
                            onPress={() => {
                              hapticSelection();
                              setPendingReportCityId(null);
                              setTargetPromptVisible(true);
                            }}
                            style={({ pressed }) => [styles.matchTargetButton, pressed && styles.pressed]}
                          >
                            <Ionicons name="fish-outline" size={12} color={paper.dashboardBlueLight} />
                            <Text style={styles.matchTargetName} numberOfLines={1}>
                              {selectedSpeciesId ? PIER_CAST_SPECIES_LABELS[selectedSpeciesId].toUpperCase() : "CHOOSE TARGET"}
                            </Text>
                            <Text style={styles.matchTargetChange}>CHANGE</Text>
                          </Pressable>
                          <View style={styles.legendRow}>
                            {MATCH_LEGEND.map((item) => (
                              <View key={item.band} style={styles.legendItem}>
                                <View style={[styles.legendSwatch, { backgroundColor: item.color }]} />
                                <Text style={styles.legendLabel}>{item.label.toUpperCase()}</Text>
                              </View>
                            ))}
                          </View>
                          <Text style={styles.matchLegendNote}>
                            MARKER FILL = TEMPERATURE MATCH · CENTER = MODELED °F · SEASON SHOWN SEPARATELY
                          </Text>
                        </View>
                      ) : (
                        <View
                          accessibilityLabel="Water temperature color scale from 32 degrees to 78 degrees and warmer"
                          style={styles.temperatureLegend}
                        >
                          <View style={styles.temperatureLegendSegments}>
                            <PierCastTemperatureGradient />
                          </View>
                          <View style={styles.temperatureLegendLabels}>
                            {PIER_CAST_WATER_SCALE_LABELS.map((label, index) => {
                              const stop = PIER_CAST_WATER_SCALE_STOPS[index]!;
                              const fraction =
                                (stop.valueF - PIER_CAST_WATER_SCALE_MIN_F) /
                                (PIER_CAST_WATER_SCALE_MAX_F - PIER_CAST_WATER_SCALE_MIN_F);
                              return (
                                <Text
                                  key={label}
                                  style={[
                                    styles.temperatureLegendLabel,
                                    index === 0
                                      ? styles.temperatureLegendLabelFirst
                                      : index === PIER_CAST_WATER_SCALE_LABELS.length - 1
                                      ? styles.temperatureLegendLabelLast
                                      : { left: `${fraction * 100}%`, marginLeft: -17 },
                                  ]}
                                >
                                  {label}
                                </Text>
                              );
                            })}
                          </View>
                        </View>
                      )}
                      {windVisible
                        ? (
                          <WindLegend
                            summary={windSummary}
                            validAt={activeValidAt}
                            flowActive={windFlowActive}
                            reduceMotion={reduceMotion}
                            onTogglePresentation={toggleWindPresentation}
                          />
                        )
                        : null}
                      {timeMode === "forecast" ? (
                      <View style={styles.timelineRow}>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Previous forecast hour"
                          disabled={selectedTimeIndex <= 0}
                          onPress={() =>
                            selectTemperatureTime(
                              selectedTimeIndex - TEMPERATURE_TIME_STEP,
                            )}
                          style={({ pressed }) => [
                            styles.timelineButton,
                            selectedTimeIndex <= 0 &&
                            styles.timelineButtonDisabled,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Ionicons
                            name="play-back"
                            size={13}
                            color="#FFFFFF"
                          />
                        </Pressable>
                        <View
                          accessibilityRole="adjustable"
                          accessibilityLabel="Water temperature forecast timeline"
                          accessibilityValue={{
                            min: 0,
                            max: Math.max(0, validTimes.length - 1),
                            now: Math.max(0, selectedTimeIndex),
                            text:
                              `${timeLabel.date}, ${timeLabel.eastern}, ${timeLabel.central}`,
                          }}
                          accessibilityActions={[
                            { name: "increment", label: "Next forecast hour" },
                            {
                              name: "decrement",
                              label: "Previous forecast hour",
                            },
                          ]}
                          onAccessibilityAction={(event) => {
                            if (event.nativeEvent.actionName === "increment") {
                              selectTemperatureTime(
                                selectedTimeIndex + TEMPERATURE_TIME_STEP,
                              );
                            } else if (
                              event.nativeEvent.actionName === "decrement"
                            ) {
                              selectTemperatureTime(
                                selectedTimeIndex - TEMPERATURE_TIME_STEP,
                              );
                            }
                          }}
                          onLayout={(event) =>
                            setTimelineWidth(event.nativeEvent.layout.width)}
                          {...timelinePanResponder.panHandlers}
                          style={styles.timelineTrackHitbox}
                        >
                          <View style={styles.timelineTrack}>
                            <View
                              style={[
                                styles.timelineProgress,
                                {
                                  width: `${
                                    validTimes.length > 1
                                      ? Math.max(0, selectedTimeIndex) /
                                        (validTimes.length - 1) * 100
                                      : 0
                                  }%`,
                                },
                              ]}
                            />
                            <View
                              style={[
                                styles.timelineThumb,
                                {
                                  left: `${
                                    validTimes.length > 1
                                      ? Math.max(0, selectedTimeIndex) /
                                        (validTimes.length - 1) * 100
                                      : 0
                                  }%`,
                                },
                              ]}
                            />
                          </View>
                          <View style={styles.timelineEndpoints}>
                            {timelineTicks.map((tick, index) => (
                              <Text
                                key={tick.hour}
                                style={styles.timelineEndpointText}
                              >
                                {index === timelineTicks.length - 1
                                  ? horizonLabel
                                  : tick.label}
                              </Text>
                            ))}
                          </View>
                        </View>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={playing
                            ? "Pause temperature forecast"
                            : "Play temperature forecast"}
                          onPress={() => {
                            if (
                              selectedTimeIndex >=
                                validTimes.length - TEMPERATURE_TIME_STEP
                            ) {
                              selectTemperatureTime(0);
                            }
                            setPlaying((current) => !current);
                          }}
                          style={(
                            { pressed },
                          ) => [
                            styles.timelineButton,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Ionicons
                            name={playing ? "pause" : "play"}
                            size={13}
                            color="#FFFFFF"
                          />
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Next forecast hour"
                          disabled={selectedTimeIndex >= validTimes.length - 1}
                          onPress={() =>
                            selectTemperatureTime(
                              selectedTimeIndex + TEMPERATURE_TIME_STEP,
                            )}
                          style={({ pressed }) => [
                            styles.timelineButton,
                            selectedTimeIndex >= validTimes.length - 1 &&
                            styles.timelineButtonDisabled,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Ionicons
                            name="play-forward"
                            size={13}
                            color="#FFFFFF"
                          />
                        </Pressable>
                      </View>
                      ) : (
                        <View style={styles.nowModeNotice}>
                          <Ionicons name="time-outline" size={12} color={paper.gold} />
                          <Text style={styles.nowModeNoticeText}>
                            NOW USES THE CLOSEST COHERENT MODEL HOUR · SWITCH TO FORECAST TO SCRUB OR PLAY
                          </Text>
                        </View>
                      )}
                    </>
                  )
                  : panelExpanded && mode === "bathymetry" && foundation
                  ? (
                    <>
                      <View style={styles.modelStatusRow}>
                        <View style={styles.liveDot} />
                        <Text style={styles.modelStatusText}>
                          NOAA NOS MODEL DEPTH · FIVE GREAT LAKES · STATIC
                          CONTEXT
                        </Text>
                      </View>
                      <DepthLegend foundation={foundation} />
                      {windVisible
                        ? (
                          <WindLegend
                            summary={windSummary}
                            validAt={activeValidAt}
                            flowActive={windFlowActive}
                            reduceMotion={reduceMotion}
                            onTogglePresentation={toggleWindPresentation}
                          />
                        )
                        : null}
                    </>
                  )
                  : null}
                {panelExpanded && windVisible && cityWindInsights.size > 0
                  ? <AnglerWindLens insights={cityWindInsights} />
                  : null}
                {panelExpanded
                  ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.cityRail}
                      accessibilityLabel="PierCast cities on the map"
                    >
                      {visibleCities.map((entry: PierCastConditionsMapCity) => {
                        const thermalBand = pierCastAvailableMapMatchBand(
                          entry.speciesFrame,
                        );
                        const seasonal = entry.speciesFrame?.seasonalOutlook;
                        const accent = mode === "match"
                          ? MATCH_LEGEND.find((item) => item.band === thermalBand)?.color ?? "#8E9AA1"
                          : mode === "temperature" && entry.temperatureF !== null
                          ? pierCastWaterTemperatureColor(entry.temperatureF)
                          : paper.dashboardBlue;
                        const windInsight = cityWindInsights.get(
                          entry.city.cityId,
                        );
                        return (
                          <Pressable
                            key={entry.city.cityId}
                            accessibilityRole="button"
                            accessibilityLabel={`Open ${entry.city.displayName} PierCast${
                              entry.temperatureF === null
                                ? ", modeled temperature unavailable"
                                : `, ${Math.round(entry.temperatureF)} degrees Fahrenheit`
                            }${mode === "match" ? thermalBand ? `, ${thermalBandLabel(thermalBand)} temperature match` : entry.speciesFrame?.targetingEligibility === "restricted" ? ", targeting restricted" : ", temperature match unavailable" : ""}${
                              windVisible && windInsight
                                ? `, wind from ${windInsight.windFrom} at ${windInsight.speedMph} miles per hour, ${windInsight.setupLabel.toLowerCase()}${
                                  windInsight.caution === "rough_water"
                                    ? ", rough-water caution"
                                    : windInsight.caution === "elevated_gusts"
                                    ? ", elevated gusts"
                                    : ""
                                }`
                                : ""
                            }`}
                            onPress={() => {
                              hapticSelection();
                              openCity(entry);
                            }}
                            style={({ pressed }) => [
                              styles.cityRailCard,
                              pressed && styles.pressed,
                            ]}
                          >
                            <View
                              style={[
                                styles.cityRailBand,
                                { backgroundColor: accent },
                              ]}
                            />
                            <View style={styles.cityRailCopy}>
                              <Text
                                numberOfLines={1}
                                style={styles.cityRailName}
                              >
                                {entry.city.displayName}
                              </Text>
                              <Text style={styles.cityRailMeta}>
                                {mode === "match"
                                  ? entry.speciesFrame?.targetingEligibility === "restricted"
                                    ? `${entry.city.stateCode} · TARGETING RESTRICTED`
                                    : thermalBand && seasonal?.status === "available"
                                    ? `${entry.city.stateCode} · SEASON ${seasonalBandLabel(seasonal.band).toUpperCase()} · ${seasonStageLabel(seasonal.stage).toUpperCase()}`
                                    : `${entry.city.stateCode} · MATCH UNAVAILABLE`
                                  : mode === "temperature"
                                  ? `${entry.city.stateCode} · MODELED SURFACE`
                                  : `${entry.city.stateCode} · STATIC DEPTH`}
                              </Text>
                              {windVisible && windInsight
                                ? (
                                  <Text
                                    numberOfLines={1}
                                    style={[
                                      styles.cityRailWind,
                                      { color: windSetupTone(windInsight) },
                                    ]}
                                  >
                                    {windInsight.windFrom}{" "}
                                    {windInsight.speedMph}
                                    {" · "}
                                    {windInsight.setupLabel}
                                    {windInsight.caution === "rough_water"
                                      ? " · CAUTION"
                                      : windInsight.caution ===
                                          "elevated_gusts"
                                      ? " · GUSTY"
                                      : ""}
                                  </Text>
                                )
                                : null}
                            </View>
                            <Text
                              allowFontScaling={false}
                              style={[styles.cityRailScore, { color: accent }]}
                            >
                              {mode === "bathymetry"
                                ? "OPEN"
                                : entry.temperatureF === null
                                ? "—"
                                : `${Math.round(entry.temperatureF)}°`}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  )
                  : null}
                {panelExpanded
                  ? (
                    <Text style={styles.attribution} numberOfLines={2}>
                      {mode === "match"
                        ? `${conditionsMap?.disclosure ?? "Species match uses modeled nearshore temperature."} Wind: Open-Meteo · ${mapGeometry.attribution}`
                        : mode === "temperature"
                        ? `${
                          foundation?.temperature.disclosure ??
                            "Modeled NOAA Great Lakes surface guidance."
                        } Wind: Open-Meteo · ${mapGeometry.attribution}`
                        : mode === "bathymetry"
                        ? `${
                          foundation?.bathymetry.disclosure ??
                            "Modeled lake-floor context; not for navigation."
                        } NOAA NOS / NCEI · ${mapGeometry.attribution}`
                        : `${mapGeometry.attribution}${
                          windVisible ? " · Wind: Open-Meteo" : ""
                        }`}
                    </Text>
                  )
                  : null}
              </View>
            </>
          )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.dashboardInk },
  header: {
    height: 66,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
    backgroundColor: paper.dashboardInk,
  },
  headerButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: { flex: 1, alignItems: "center" },
  headerEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.5,
    color: paper.gold,
  },
  headerTitle: {
    marginTop: 2,
    fontFamily: paperFonts.display,
    fontSize: 20,
    lineHeight: 23,
    letterSpacing: 0.4,
    color: "#FFFFFF",
  },
  allLakesButton: {
    minWidth: 58,
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  allLakesText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 0.5,
    color: paper.gold,
  },
  mapShell: { flex: 1, overflow: "hidden", backgroundColor: "#081B2B" },
  centerMessage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 34,
    backgroundColor: paper.dashboardCream,
  },
  messageTitle: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    color: paper.dashboardInk,
  },
  messageCopy: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  retryButton: {
    marginTop: 4,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 7,
    backgroundColor: paper.dashboardBlue,
  },
  retryText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.1,
    color: "#FFFFFF",
  },
  pressed: { opacity: 0.72 },
  topOverlay: { position: "absolute", top: 10, left: 0, right: 0 },
  timeModeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginHorizontal: 10,
    marginBottom: 7,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 9,
    backgroundColor: "rgba(10,27,46,0.92)",
    ...paperShadows.lift,
  },
  timeModeTab: {
    minWidth: 72,
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timeModeTabActive: { backgroundColor: paper.dashboardBlue },
  timeModeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.4)" },
  timeModeDotActive: { backgroundColor: paper.bandPrime },
  timeModeText: { fontFamily: paperFonts.metaMonoBold, fontSize: 7.5, letterSpacing: 0.9, color: "rgba(255,255,255,0.65)" },
  timeModeTextActive: { color: "#FFFFFF" },
  timeModeDisclosure: { minWidth: 0, flex: 1, textAlign: "right", paddingRight: 6, fontFamily: paperFonts.metaMonoBold, fontSize: 5.5, letterSpacing: 0.45, color: paper.gold },
  modeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
  },
  modeTab: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 7,
    ...paperShadows.lift,
  },
  modeTabActive: { backgroundColor: paper.dashboardBlue },
  modeTabInactive: {
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: "rgba(255,252,245,0.94)",
  },
  modeTabActiveText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 0.9,
    color: "#FFFFFF",
  },
  modeTabInactiveText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 0.7,
    color: paper.dashboardMuted,
  },
  datePill: {
    minWidth: 0,
    flex: 1,
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: "rgba(10,27,46,0.9)",
  },
  datePillLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.8,
    letterSpacing: 0.8,
    color: paper.gold,
  },
  datePillValue: {
    marginTop: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.2,
    letterSpacing: 0.35,
    color: "#FFFFFF",
  },
  targetControlRow: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginHorizontal: 10,
    marginTop: 7,
    paddingLeft: 8,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 7,
    backgroundColor: "rgba(10,27,46,0.9)",
    ...paperShadows.lift,
  },
  targetControlEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.7,
    letterSpacing: 0.7,
    color: "rgba(255,255,255,0.58)",
  },
  targetControlChip: {
    minWidth: 0,
    maxWidth: 166,
    minHeight: 23,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(124,184,218,0.5)",
    borderRadius: 5,
    backgroundColor: "rgba(42,110,150,0.2)",
  },
  targetControlChipActive: {
    borderColor: paper.dashboardBlueLight,
    backgroundColor: paper.dashboardBlue,
  },
  targetControlName: {
    minWidth: 0,
    flexShrink: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.8,
    letterSpacing: 0.5,
    color: "#FFFFFF",
  },
  targetControlHint: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.2,
    letterSpacing: 0.35,
    textAlign: "right",
    color: paper.gold,
  },
  stateRail: { gap: 7, paddingHorizontal: 10, paddingTop: 8, paddingBottom: 4 },
  targetPrompt: {
    marginHorizontal: 10,
    marginTop: 7,
    padding: 12,
    borderWidth: 2,
    borderColor: paper.dashboardInk,
    borderRadius: 10,
    backgroundColor: "rgba(255,252,245,0.98)",
    ...paperShadows.lift,
  },
  targetPromptHead: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  targetPromptCopy: { flex: 1 },
  targetPromptEyebrow: { fontFamily: paperFonts.metaMonoBold, fontSize: 7, letterSpacing: 1, color: paper.dashboardBlue },
  targetPromptTitle: { marginTop: 2, fontFamily: paperFonts.display, fontSize: 19, lineHeight: 22, color: paper.dashboardInk },
  targetPromptClose: { width: 30, height: 30, alignItems: "center", justifyContent: "center", borderRadius: 15, backgroundColor: paper.dashboardCream },
  targetPromptDetail: { marginTop: 5, fontFamily: paperFonts.body, fontSize: 10, lineHeight: 15, color: paper.dashboardMuted },
  targetPromptRail: { gap: 7, paddingTop: 10, paddingRight: 10 },
  targetPromptChip: { minWidth: 126, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1.5, borderColor: paper.dashboardInk, borderRadius: 7, backgroundColor: "#FFFFFF" },
  targetPromptChipText: { fontFamily: paperFonts.bodyBold, fontSize: 10, color: paper.dashboardInk },
  targetPromptChipMeta: { marginTop: 2, fontFamily: paperFonts.metaMonoBold, fontSize: 5.5, letterSpacing: 0.45, color: paper.dashboardBlue },
  targetPromptUnavailable: { marginTop: 9, fontFamily: paperFonts.metaMonoBold, fontSize: 6, lineHeight: 9, letterSpacing: 0.45, color: paper.bandTough },
  targetPromptRetry: { alignSelf: "flex-start", marginTop: 9, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, backgroundColor: paper.dashboardBlue },
  targetPromptRetryText: { fontFamily: paperFonts.metaMonoBold, fontSize: 7, letterSpacing: 0.8, color: "#FFFFFF" },
  stateChip: {
    minWidth: 55,
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    borderRadius: 16,
    backgroundColor: "rgba(10,27,46,0.86)",
  },
  stateChipSelected: { borderColor: paper.gold, backgroundColor: paper.gold },
  stateChipText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 0.7,
    color: "#FFFFFF",
  },
  stateChipTextSelected: { color: paper.dashboardInk },
  stateChipCount: {
    fontFamily: paperFonts.monoBold,
    fontSize: 7,
    color: "rgba(255,255,255,0.67)",
  },
  stateChipCountSelected: { color: "rgba(10,27,46,0.68)" },
  mapTools: {
    position: "absolute",
    right: 10,
    alignItems: "flex-end",
    gap: 7,
  },
  mapToolsHidden: { opacity: 0 },
  observationToggle: {
    minWidth: 112,
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 9,
    backgroundColor: "rgba(10,27,46,0.9)",
    ...paperShadows.lift,
  },
  observationToggleActive: {
    borderColor: "rgba(255,255,255,0.92)",
    backgroundColor: "rgba(241,211,107,0.96)",
  },
  observationToggleDisabled: { opacity: 0.48 },
  observationReadout: {
    width: 205,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(241,211,107,0.58)",
    borderRadius: 9,
    backgroundColor: "rgba(10,27,46,0.96)",
    ...paperShadows.lift,
  },
  observationReadoutHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 6,
  },
  observationReadoutEyebrow: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6,
    lineHeight: 8,
    letterSpacing: 0.55,
    color: paper.gold,
  },
  observationReadoutValue: {
    marginTop: 3,
    fontFamily: paperFonts.display,
    fontSize: 20,
    lineHeight: 22,
    color: "#FFFFFF",
  },
  observationReadoutMeta: {
    marginTop: 2,
    fontFamily: paperFonts.monoBold,
    fontSize: 5.8,
    lineHeight: 8,
    letterSpacing: 0.25,
    color: "rgba(255,255,255,0.7)",
  },
  observationReadoutCaution: {
    marginTop: 5,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.3,
    lineHeight: 7.5,
    letterSpacing: 0.35,
    color: "rgba(255,255,255,0.55)",
  },
  observationSourceButton: {
    marginTop: 6,
    minHeight: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: "rgba(241,211,107,0.38)",
    borderRadius: 5,
    backgroundColor: "rgba(241,211,107,0.08)",
  },
  observationSourceText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.7,
    letterSpacing: 0.45,
    color: paper.gold,
  },
  windToggle: {
    minWidth: 112,
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 9,
    backgroundColor: "rgba(10,27,46,0.9)",
    ...paperShadows.lift,
  },
  windToggleActive: {
    borderColor: "rgba(215,247,255,0.8)",
    backgroundColor: "rgba(103,232,209,0.94)",
  },
  windToggleLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: 0.8,
    color: "#FFFFFF",
  },
  windToggleLabelActive: { color: paper.dashboardInk },
  windToggleValue: {
    marginTop: 1,
    fontFamily: paperFonts.monoBold,
    fontSize: 6,
    letterSpacing: 0.3,
    color: "rgba(255,255,255,0.66)",
  },
  windToggleValueActive: { color: "rgba(10,27,46,0.68)" },
  windReadout: {
    width: 150,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(103,232,209,0.5)",
    borderRadius: 9,
    backgroundColor: "rgba(10,27,46,0.94)",
    ...paperShadows.lift,
  },
  windReadoutEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6,
    letterSpacing: 0.65,
    color: "#67E8D1",
  },
  windReadoutValue: {
    marginTop: 2,
    fontFamily: paperFonts.display,
    fontSize: 18,
    lineHeight: 20,
    color: "#FFFFFF",
  },
  windReadoutMeta: {
    marginTop: 2,
    fontFamily: paperFonts.monoBold,
    fontSize: 6,
    letterSpacing: 0.3,
    color: "rgba(255,255,255,0.68)",
  },
  zoomControl: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(10,27,46,0.18)",
    borderRadius: 9,
    backgroundColor: "rgba(255,252,245,0.96)",
    ...paperShadows.lift,
  },
  zoomButton: {
    width: 39,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
  },
  zoomButtonDisabled: { opacity: 0.28 },
  zoomDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(10,27,46,0.18)",
  },
  gestureHint: {
    height: 27,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 7,
    backgroundColor: "rgba(10,27,46,0.88)",
  },
  gestureHintText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 0.75,
    color: "#FFFFFF",
  },
  regionLabelWrap: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "rgba(75,66,55,0.24)",
    borderRadius: 3,
    backgroundColor: "rgba(248,242,229,0.72)",
  },
  regionLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: 1.1,
    color: "rgba(43,48,51,0.58)",
  },
  lakeLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 1.7,
    color: "rgba(220,245,252,0.48)",
  },
  observationMarkerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  observationMarker: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: paper.gold,
    borderRadius: 20,
    backgroundColor: "rgba(10,27,46,0.95)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.32,
    shadowRadius: 4,
    elevation: 7,
  },
  observationMarkerSelected: {
    borderColor: "#FFFFFF",
    transform: [{ scale: 1.08 }],
  },
  observationMarkerStale: { opacity: 0.68 },
  observationMarkerValue: {
    fontFamily: paperFonts.monoBold,
    fontSize: 10,
    lineHeight: 12,
    color: "#FFFFFF",
  },
  observationMarkerTag: {
    marginTop: -3,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: paper.gold,
    borderRadius: 4,
    backgroundColor: paper.dashboardInk,
  },
  observationMarkerTagText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5,
    letterSpacing: 0.45,
    color: paper.gold,
  },
  marker: {
    minWidth: 92,
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  markerCompact: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    gap: 0,
  },
  markerReverse: { flexDirection: "row-reverse" },
  markerBadge: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 19,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 3,
    elevation: 5,
  },
  markerBadgeCompact: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  markerBadgeOverview: {
    width: 25,
    height: 25,
    borderWidth: 1.5,
    borderRadius: 12.5,
  },
  markerBadgeText: {
    fontFamily: paperFonts.monoBold,
    fontSize: 11,
    lineHeight: 14,
  },
  markerBadgeTextCompact: {
    fontSize: 7.5,
    lineHeight: 10,
  },
  temperatureMarkerValue: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderColor: "rgba(255,255,255,0.88)",
  },
  temperatureMarkerText: {
    fontFamily: paperFonts.monoBold,
    fontSize: 11,
    lineHeight: 14,
  },
  markerLabel: {
    maxWidth: 82,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.42)",
    borderRadius: 4,
    backgroundColor: "rgba(10,27,46,0.9)",
  },
  markerCity: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    lineHeight: 8,
    letterSpacing: 0.25,
    color: "#FFFFFF",
  },
  markerState: {
    marginTop: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.5,
    lineHeight: 7,
    letterSpacing: 0.4,
    color: paper.gold,
  },
  bottomOverlay: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 8,
    paddingTop: 10,
    paddingBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 12,
    backgroundColor: "rgba(10,27,46,0.95)",
    ...paperShadows.lift,
  },
  legendHeading: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    minHeight: 34,
    paddingHorizontal: 11,
  },
  legendHeadingCopy: { minWidth: 0, flex: 1 },
  legendHeadingMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 1.1,
    color: paper.gold,
  },
  legendTitle: {
    marginTop: 2,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: "#FFFFFF",
  },
  visibleCount: {
    paddingTop: 2,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: 0.7,
    color: "rgba(255,255,255,0.64)",
  },
  legendRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 11,
    paddingTop: 7,
  },
  matchLegendWrap: { paddingTop: 2 },
  matchTargetButton: { flexDirection: "row", alignItems: "center", gap: 6, marginHorizontal: 11, paddingHorizontal: 8, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(124,184,218,0.38)", borderRadius: 6, backgroundColor: "rgba(42,110,150,0.12)" },
  matchTargetName: { minWidth: 0, flex: 1, fontFamily: paperFonts.metaMonoBold, fontSize: 6.5, letterSpacing: 0.55, color: "#FFFFFF" },
  matchTargetChange: { fontFamily: paperFonts.metaMonoBold, fontSize: 5.8, letterSpacing: 0.7, color: paper.gold },
  matchLegendNote: { paddingHorizontal: 11, paddingTop: 6, fontFamily: paperFonts.metaMonoBold, fontSize: 5.3, lineHeight: 8, letterSpacing: 0.35, color: "rgba(255,255,255,0.52)" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  legendSwatch: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.5,
    letterSpacing: 0.2,
    color: "rgba(255,255,255,0.68)",
  },
  temperatureStatusRow: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 11,
    paddingTop: 8,
  },
  temperatureStatusText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    lineHeight: 10,
    letterSpacing: 0.45,
    color: "rgba(255,255,255,0.72)",
  },
  temperatureRetry: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: paper.gold,
    borderRadius: 5,
  },
  temperatureRetryText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: 0.7,
    color: paper.gold,
  },
  modelStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    paddingTop: 7,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#57C785",
    shadowColor: "#57C785",
    shadowOpacity: 0.65,
    shadowRadius: 4,
  },
  liveDotWarning: {
    backgroundColor: paper.gold,
    shadowColor: paper.gold,
  },
  modelStatusText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.8,
    letterSpacing: 0.55,
    color: "rgba(255,255,255,0.7)",
  },
  observationDisclosureRow: {
    minHeight: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 11,
    marginTop: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(241,211,107,0.3)",
    borderRadius: 6,
    backgroundColor: "rgba(241,211,107,0.07)",
  },
  observationDisclosureText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.4,
    lineHeight: 8,
    letterSpacing: 0.35,
    color: "rgba(255,255,255,0.67)",
  },
  staleNotice: {
    minHeight: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 11,
    marginTop: 7,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(232,160,46,0.36)",
    borderRadius: 6,
    backgroundColor: "rgba(232,160,46,0.1)",
  },
  staleNoticeText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.8,
    letterSpacing: 0.55,
    color: paper.gold,
  },
  temperatureLegend: { paddingHorizontal: 11, paddingTop: 8 },
  temperatureLegendSegments: {
    height: 9,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 5,
  },
  temperatureLegendLabels: {
    position: "relative",
    height: 14,
  },
  temperatureLegendLabel: {
    position: "absolute",
    top: 3,
    width: 34,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.5,
    textAlign: "center",
    color: "rgba(255,255,255,0.72)",
  },
  temperatureLegendLabelFirst: { left: 0, textAlign: "left" },
  temperatureLegendLabelLast: { right: 0, textAlign: "right" },
  windLegend: {
    marginHorizontal: 11,
    marginTop: 8,
    paddingTop: 7,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.18)",
  },
  windLegendHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  windLegendTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6,
    letterSpacing: 0.8,
    color: "#67E8D1",
  },
  windLegendSummary: {
    marginTop: 3,
    fontFamily: paperFonts.monoBold,
    fontSize: 5.5,
    letterSpacing: 0.3,
    color: "rgba(255,255,255,0.68)",
  },
  windPresentationButton: {
    minHeight: 21,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: "rgba(103,232,209,0.34)",
    borderRadius: 5,
    backgroundColor: "rgba(103,232,209,0.08)",
  },
  windPresentationButtonDisabled: { opacity: 0.72 },
  windPresentationText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.4,
    letterSpacing: 0.45,
    color: "#67E8D1",
  },
  windLegendGradient: {
    height: 6,
    overflow: "hidden",
    marginTop: 5,
    borderRadius: 3,
  },
  windLegendLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  windLegendLabel: {
    fontFamily: paperFonts.monoBold,
    fontSize: 5.5,
    color: "rgba(255,255,255,0.66)",
  },
  windDirectionNote: {
    marginTop: 3,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.2,
    letterSpacing: 0.35,
    color: "rgba(255,255,255,0.52)",
  },
  anglerLens: {
    minHeight: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 7,
    marginHorizontal: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(103,232,209,0.34)",
    borderRadius: 7,
    backgroundColor: "rgba(103,232,209,0.08)",
  },
  anglerLensTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  anglerLensTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.8,
    letterSpacing: 0.65,
    color: "#67E8D1",
  },
  anglerLensSummary: {
    flexShrink: 1,
    fontFamily: paperFonts.monoBold,
    fontSize: 5.6,
    letterSpacing: 0.2,
    textAlign: "right",
    color: "rgba(255,255,255,0.72)",
  },
  depthLegend: {
    paddingHorizontal: 11,
    paddingTop: 8,
  },
  depthGradient: {
    height: 9,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 5,
  },
  depthGradientLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
  },
  depthGradientLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.4,
    letterSpacing: 0.25,
    color: "rgba(255,255,255,0.68)",
  },
  depthLakeGrid: {
    flexDirection: "row",
    gap: 4,
    marginTop: 7,
  },
  depthLakeChip: {
    minWidth: 0,
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(122,210,203,0.26)",
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  depthLakeName: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 4.8,
    textAlign: "center",
    color: "rgba(255,255,255,0.72)",
  },
  depthLakeValue: {
    marginTop: 2,
    fontFamily: paperFonts.monoBold,
    fontSize: 5.5,
    textAlign: "center",
    color: "#7AD2CB",
  },
  depthNotice: {
    marginTop: 5,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5,
    letterSpacing: 0.3,
    color: "rgba(255,255,255,0.48)",
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingTop: 7,
  },
  nowModeNotice: { flexDirection: "row", alignItems: "center", gap: 6, marginHorizontal: 11, marginTop: 8, paddingTop: 7, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "rgba(255,255,255,0.18)" },
  nowModeNoticeText: { flex: 1, fontFamily: paperFonts.metaMonoBold, fontSize: 5.4, lineHeight: 8, letterSpacing: 0.35, color: "rgba(255,255,255,0.55)" },
  timelineButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  timelineButtonDisabled: { opacity: 0.3 },
  timelineTrackHitbox: {
    minWidth: 80,
    flex: 1,
    paddingTop: 10,
    paddingBottom: 4,
  },
  timelineTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  timelineProgress: {
    height: 4,
    borderRadius: 2,
    backgroundColor: paper.gold,
  },
  timelineThumb: {
    position: "absolute",
    top: -4,
    width: 12,
    height: 12,
    marginLeft: -6,
    borderWidth: 2,
    borderColor: paper.dashboardInk,
    borderRadius: 6,
    backgroundColor: paper.gold,
  },
  timelineEndpoints: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
  },
  timelineEndpointText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.5,
    letterSpacing: 0.5,
    color: "rgba(255,255,255,0.5)",
  },
  cityRail: { gap: 7, paddingHorizontal: 10, paddingTop: 9, paddingBottom: 4 },
  cityRailCard: {
    width: 174,
    height: 58,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  cityRailBand: { width: 4, alignSelf: "stretch" },
  cityRailCopy: { minWidth: 0, flex: 1, paddingHorizontal: 8 },
  cityRailName: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 10,
    lineHeight: 13,
    color: "#FFFFFF",
  },
  cityRailMeta: {
    marginTop: 2,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6,
    letterSpacing: 0.45,
    color: "rgba(255,255,255,0.58)",
  },
  cityRailWind: {
    marginTop: 2,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.3,
    letterSpacing: 0.18,
  },
  cityRailScore: {
    minWidth: 34,
    paddingRight: 8,
    fontFamily: paperFonts.monoBold,
    fontSize: 15,
    textAlign: "right",
  },
  attribution: {
    paddingTop: 2,
    paddingHorizontal: 11,
    fontFamily: paperFonts.metaMono,
    fontSize: 5.5,
    letterSpacing: 0.2,
    color: "rgba(255,255,255,0.38)",
  },
});
