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
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { FeatureCollection } from "geojson";

import mapGeometry from "../assets/data/pier-cast-great-lakes-map.json";
import { PierCastTemperatureGradient } from "../components/pier-cast/PierCastTemperatureGradient";
import { captureAnalytics } from "../lib/analytics";
import {
  fetchPierCastCatalog,
  fetchPierCastLeaderboard,
  fetchPierCastTemperatureMap,
  PierCastRequestError,
} from "../lib/pierCast";
import {
  buildPierCastTemperatureMapCities,
  buildPierCastTemperatureRasterFrame,
  buildPierCastMapCities,
  closestPierCastTemperatureTime,
  filterPierCastMapCities,
  PIER_CAST_GREAT_LAKES_BOUNDS,
  pierCastTemperatureHorizonLabel,
  pierCastTemperatureRasterValidTimes,
  pierCastMapBoundsForFilter,
  type PierCastMapCity,
  type PierCastMapFilter,
  type PierCastTemperatureMapCity,
} from "../lib/pierCastMap";
import type {
  PierCastCatalogResponse,
  PierCastLeaderboardResponse,
  PierCastTemperatureMapResponse,
} from "../lib/pierCastContracts";
import {
  pierCastWaterTemperatureColor,
  PIER_CAST_WATER_SCALE_LABELS,
  PIER_CAST_WATER_SCALE_MAX_F,
  PIER_CAST_WATER_SCALE_MIN_F,
  PIER_CAST_WATER_SCALE_STOPS,
} from "../lib/pierCastTemperatureScale";
import { hapticSelection } from "../lib/safeHaptics";
import {
  dashboardBandColor,
  dashboardBandStyleForScore,
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

const STATE_FILTERS: PierCastMapFilter[] = ["ALL", "MI", "WI", "IL", "IN"];
const STATE_NAMES: Record<Exclude<PierCastMapFilter, "ALL">, string> = {
  MI: "Michigan",
  WI: "Wisconsin",
  IL: "Illinois",
  IN: "Indiana",
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

const SCORE_LEGEND = [
  dashboardBandColor.Tough,
  dashboardBandColor.Poor,
  dashboardBandColor.Fair,
  dashboardBandColor.Good,
  dashboardBandColor.Prime,
] as const;

const TEMPERATURE_TIME_STEP = 3;
type MarkerDensity = "overview" | "compact" | "detail";

function forecastDateLabel(localDate: string | undefined): string {
  if (!localDate) return "TODAY";
  const [year, month, day] = localDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date).toUpperCase();
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
  const time = (timeZone: string) => new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    timeZone,
  }).format(date).replace(" ", "");
  return {
    date: dateLabel,
    eastern: `${time("America/Detroit")} ET`,
    central: `${time("America/Chicago")} CT`,
  };
}

function temperatureTextColor(temperatureF: number): string {
  return temperatureF >= 64 ? paper.dashboardInk : "#FFFFFF";
}

function isTemperatureMapCity(
  entry: PierCastMapCity | PierCastTemperatureMapCity,
): entry is PierCastTemperatureMapCity {
  return "temperatureF" in entry;
}

function markerLabelSide(entry: PierCastMapCity): "left" | "right" {
  if (entry.city.stateCode === "WI" || entry.city.stateCode === "IL") {
    return "left";
  }
  if (entry.city.stateCode === "IN") return "right";
  return entry.longitude > -84.7 ? "left" : "right";
}

function CityMarker({
  entry,
  density,
  onOpen,
}: {
  entry: PierCastMapCity;
  density: MarkerDensity;
  onOpen: () => void;
}) {
  const band = entry.score === null
    ? null
    : dashboardBandStyleForScore(entry.score);
  const side = markerLabelSide(entry);
  const accessibilityLabel = entry.score === null
    ? `${entry.city.displayName}, ${STATE_NAMES[entry.city.stateCode]}, score pending`
    : `${entry.city.displayName}, ${STATE_NAMES[entry.city.stateCode]}, ${entry.score.toFixed(1)} out of 10, ${band?.label ?? "rated"}`;
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
            styles.markerScore,
            density === "compact" && styles.markerScoreCompact,
            density === "overview" && styles.markerScoreOverview,
            {
              backgroundColor: band?.bg ?? "#8E9AA1",
              borderColor: band ? "#FFFFFF" : "rgba(255,255,255,0.72)",
            },
          ]}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.markerScoreText,
              density !== "detail" && styles.markerScoreTextCompact,
              { color: band?.fg ?? "#FFFFFF" },
            ]}
          >
            {entry.score?.toFixed(1) ?? "—"}
          </Text>
        </View>
        {density === "detail" ? <View style={styles.markerLabel}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.markerCity}
          >
            {entry.city.displayName.toUpperCase()}
          </Text>
          <Text allowFontScaling={false} style={styles.markerState}>
            {entry.city.stateCode}{entry.rank ? ` · #${entry.rank}` : " · PENDING"}
          </Text>
        </View> : null}
      </View>
    </Marker>
  );
}

function TemperatureMarker({
  entry,
  density,
  onOpen,
}: {
  entry: PierCastTemperatureMapCity;
  density: MarkerDensity;
  onOpen: () => void;
}) {
  const side = markerLabelSide(entry);
  const roundedTemperature = Math.round(entry.temperatureF);
  const color = pierCastWaterTemperatureColor(entry.temperatureF);
  return (
    <Marker
      id={`pier-cast-temperature-${entry.city.cityId}`}
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
        accessibilityLabel={`${entry.city.displayName}, modeled nearshore water ${roundedTemperature} degrees Fahrenheit. Open PierCast report.`}
        style={[
          styles.marker,
          density !== "detail" && styles.markerCompact,
          side === "left" && styles.markerReverse,
        ]}
      >
        <View
          style={[
            styles.markerScore,
            styles.temperatureMarkerValue,
            density === "compact" && styles.markerScoreCompact,
            density === "overview" && styles.markerScoreOverview,
            { backgroundColor: color },
          ]}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.temperatureMarkerText,
              density !== "detail" && styles.markerScoreTextCompact,
              { color: temperatureTextColor(entry.temperatureF) },
            ]}
          >
            {roundedTemperature}°
          </Text>
        </View>
        {density === "detail" ? <View style={styles.markerLabel}>
          <Text allowFontScaling={false} numberOfLines={1} style={styles.markerCity}>
            {entry.city.displayName.toUpperCase()}
          </Text>
          <Text allowFontScaling={false} style={styles.markerState}>
            {entry.city.stateCode} · MODELED
          </Text>
        </View> : null}
      </View>
    </Marker>
  );
}

export default function PierCastMapScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraRef>(null);
  const hasLoaded = useRef(false);
  const selectedState = usePierCastMapStore((state) => state.selectedState);
  const setSelectedState = usePierCastMapStore((state) => state.setSelectedState);
  const mode = usePierCastMapStore((state) => state.mode);
  const setMode = usePierCastMapStore((state) => state.setMode);
  const selectedValidAt = usePierCastMapStore((state) => state.selectedValidAt);
  const setSelectedValidAt = usePierCastMapStore((state) => state.setSelectedValidAt);
  const savedView = usePierCastMapStore((state) => state.view);
  const setSavedView = usePierCastMapStore((state) => state.setView);
  const [catalog, setCatalog] = useState<PierCastCatalogResponse | null>(null);
  const [leaderboard, setLeaderboard] = useState<PierCastLeaderboardResponse | null>(null);
  const [temperatureMap, setTemperatureMap] = useState<PierCastTemperatureMapResponse | null>(null);
  const [temperatureLoading, setTemperatureLoading] = useState(true);
  const [temperatureError, setTemperatureError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true;
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    setTemperatureLoading(true);
    try {
      const [catalogResult, leaderboardResult, temperatureResult] =
        await Promise.allSettled([
        fetchPierCastCatalog(),
        fetchPierCastLeaderboard(),
        fetchPierCastTemperatureMap(),
      ]);
      if (catalogResult.status === "rejected") throw catalogResult.reason;
      if (leaderboardResult.status === "rejected") throw leaderboardResult.reason;
      setCatalog(catalogResult.value);
      setLeaderboard(leaderboardResult.value);
      if (temperatureResult.status === "fulfilled") {
        setTemperatureMap(temperatureResult.value);
        setTemperatureError(null);
      } else {
        setTemperatureError(
          temperatureResult.reason instanceof PierCastRequestError
            ? temperatureResult.reason.message
            : temperatureResult.reason instanceof Error
              ? temperatureResult.reason.message
              : "Water temperatures could not be loaded.",
        );
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
      setTemperatureLoading(false);
      if (!silent) setLoading(false);
    }
  }, []);

  const retryTemperature = useCallback(async () => {
    setTemperatureLoading(true);
    setTemperatureError(null);
    try {
      setTemperatureMap(await fetchPierCastTemperatureMap());
    } catch (caught) {
      setTemperatureError(
        caught instanceof PierCastRequestError
          ? caught.message
          : caught instanceof Error
            ? caught.message
            : "Water temperatures could not be loaded.",
      );
    } finally {
      setTemperatureLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      captureAnalytics("pier_cast_visual_map_viewed");
      void load({ silent: hasLoaded.current });
    }, [load]),
  );

  const cities = useMemo(
    () => catalog && leaderboard
      ? buildPierCastMapCities(catalog, leaderboard)
      : [],
    [catalog, leaderboard],
  );
  const visibleCities = useMemo(
    () => filterPierCastMapCities(cities, selectedState),
    [cities, selectedState],
  );
  const temperatureValidTimes = useMemo(
    () => pierCastTemperatureRasterValidTimes(temperatureMap),
    [temperatureMap],
  );
  const activeValidAt = useMemo(() => {
    if (selectedValidAt && temperatureValidTimes.includes(selectedValidAt)) {
      return selectedValidAt;
    }
    return closestPierCastTemperatureTime(temperatureValidTimes, Date.now());
  }, [selectedValidAt, temperatureValidTimes]);
  const temperatureCities = useMemo(
    () => temperatureMap && activeValidAt
      ? buildPierCastTemperatureMapCities(cities, temperatureMap, activeValidAt)
      : [],
    [activeValidAt, cities, temperatureMap],
  );
  const visibleTemperatureCities = useMemo(
    () => selectedState === "ALL"
      ? temperatureCities
      : temperatureCities.filter((entry) => entry.city.stateCode === selectedState),
    [selectedState, temperatureCities],
  );
  const temperatureRasterFrame = useMemo(
    () => temperatureMap && activeValidAt
      ? buildPierCastTemperatureRasterFrame(temperatureMap, activeValidAt)
      : null,
    [activeValidAt, temperatureMap],
  );
  const selectedTimeIndex = activeValidAt
    ? temperatureValidTimes.indexOf(activeValidAt)
    : -1;
  const timeLabel = temperatureTimeLabel(activeValidAt);
  const horizonLabel = pierCastTemperatureHorizonLabel(temperatureValidTimes);
  const frameRange = useMemo(() => {
    if (visibleTemperatureCities.length === 0) return null;
    const values = visibleTemperatureCities.map((entry) => entry.temperatureF);
    return {
      low: Math.round(Math.min(...values)),
      high: Math.round(Math.max(...values)),
    };
  }, [visibleTemperatureCities]);
  const forecastDate = leaderboard?.cities[0]?.dates[0]?.localDate;
  const markerDensity: MarkerDensity = savedView.zoom < 5
    ? "overview"
    : savedView.zoom < 6.3
      ? "compact"
      : "detail";

  const selectTemperatureTime = useCallback((index: number) => {
    const bounded = Math.max(0, Math.min(temperatureValidTimes.length - 1, index));
    const validAt = temperatureValidTimes[bounded];
    if (!validAt) return;
    hapticSelection();
    setSelectedValidAt(validAt);
  }, [setSelectedValidAt, temperatureValidTimes]);

  useEffect(() => {
    if (!playing || temperatureValidTimes.length === 0) return;
    const timer = setInterval(() => {
      const currentIndex = activeValidAt
        ? temperatureValidTimes.indexOf(activeValidAt)
        : -1;
      const nextIndex = currentIndex + TEMPERATURE_TIME_STEP;
      if (nextIndex >= temperatureValidTimes.length) {
        setPlaying(false);
        return;
      }
      setSelectedValidAt(temperatureValidTimes[nextIndex] ?? null);
    // NOAA WMS frames are real raster tiles, not an in-memory color tween.
    // Leave enough time for the next frame to resolve cleanly on mobile data.
    }, 3200);
    return () => clearInterval(timer);
  }, [activeValidAt, playing, setSelectedValidAt, temperatureValidTimes]);

  const openCity = useCallback((entry: PierCastMapCity) => {
    captureAnalytics("pier_cast_visual_map_city_opened", {
      city_id: entry.city.cityId,
      state: entry.city.stateCode,
      score: entry.score,
    });
    router.push({
      pathname: "/pier-cast-review",
      params: {
        cityId: entry.city.cityId,
        from: "map",
        entry: String(Date.now()),
      },
    });
  }, [router]);

  const chooseState = useCallback((filter: PierCastMapFilter) => {
    hapticSelection();
    setSelectedState(filter);
    captureAnalytics("pier_cast_visual_map_filtered", { state: filter });
    cameraRef.current?.fitBounds(pierCastMapBoundsForFilter(filter), {
      padding: { top: 120, right: 64, bottom: 150, left: 64 },
      duration: 550,
      easing: "ease",
    });
  }, [setSelectedState]);

  const showAllLakes = useCallback(() => {
    hapticSelection();
    setSelectedState("ALL");
    cameraRef.current?.fitBounds(PIER_CAST_GREAT_LAKES_BOUNDS, {
      padding: { top: 105, right: 24, bottom: 150, left: 24 },
      duration: 650,
      easing: "ease",
    });
  }, [setSelectedState]);

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
        {loading ? (
          <View style={styles.centerMessage}>
            <ActivityIndicator color={paper.dashboardBlue} />
            <Text style={styles.messageTitle}>Charting the shoreline</Text>
            <Text style={styles.messageCopy}>Loading today&apos;s city scores…</Text>
          </View>
        ) : error ? (
          <View style={styles.centerMessage}>
            <Ionicons name="cloud-offline-outline" size={28} color={paper.bandTough} />
            <Text style={styles.messageTitle}>Map unavailable</Text>
            <Text style={styles.messageCopy}>{error}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => void load()}
              style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
            >
              <Text style={styles.retryText}>TRY AGAIN</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Map
              style={StyleSheet.absoluteFill}
              mapStyle={EMPTY_MAP_STYLE}
              attribution={false}
              logo={false}
              compass
              compassPosition={{ bottom: mode === "temperature" ? 256 : 164, right: 12 }}
              dragPan
              touchZoom
              doubleTapZoom
              doubleTapHoldZoom
              touchRotate
              touchPitch={false}
              onRegionDidChange={(event) => {
                const { center, zoom } = event.nativeEvent;
                setSavedView({ center: [center[0], center[1]], zoom });
              }}
            >
              <Camera
                ref={cameraRef}
                initialViewState={{ center: savedView.center, zoom: savedView.zoom }}
                minZoom={3.2}
                maxZoom={10}
                maxBounds={[-97.5, 36.5, -70.5, 52]}
              />
              <GeoJSONSource
                id="great-lakes-regions"
                data={mapGeometry.regions as FeatureCollection}
              >
                <Layer
                  id="great-lakes-region-fill"
                  type="fill"
                  style={{ fillColor: "#E9E0CE", fillOpacity: 1 }}
                />
                <Layer
                  id="great-lakes-region-line"
                  type="line"
                  style={{ lineColor: "#8E816F", lineWidth: 1, lineOpacity: 0.78 }}
                />
                {selectedState !== "ALL" ? (
                  <Layer
                    id="selected-pier-cast-state"
                    type="line"
                    filter={["==", ["get", "code"], `US-${selectedState}`]}
                    style={{ lineColor: paper.gold, lineWidth: 3, lineOpacity: 1 }}
                  />
                ) : null}
              </GeoJSONSource>
              <GeoJSONSource
                id="great-lakes-water"
                data={mapGeometry.lakes as FeatureCollection}
              >
                <Layer
                  id="great-lakes-water-fill"
                  type="fill"
                  style={{ fillColor: "#1E5C80", fillOpacity: 0.96 }}
                />
                <Layer
                  id="great-lakes-water-line"
                  type="line"
                  style={{ lineColor: "#7EC4DA", lineWidth: 1.2, lineOpacity: 0.85 }}
                />
              </GeoJSONSource>

              {mode === "temperature" && temperatureRasterFrame ? (
                <RasterSource
                  key={`lmhofs-${temperatureRasterFrame.forecastHour}`}
                  id={`pier-cast-temperature-raster-${temperatureRasterFrame.forecastHour}`}
                  tiles={[temperatureRasterFrame.tileUrl]}
                  tileSize={256}
                  minzoom={3}
                  maxzoom={10}
                  attribution="NOAA NOS LMHOFS"
                >
                  <Layer
                    id={`pier-cast-temperature-surface-${temperatureRasterFrame.forecastHour}`}
                    type="raster"
                    style={{
                      rasterOpacity: 0.98,
                      rasterResampling: "linear",
                      rasterFadeDuration: playing ? 120 : 220,
                    }}
                  />
                </RasterSource>
              ) : null}

              {mode === "temperature" ? (
                <GeoJSONSource
                  id="great-lakes-temperature-land-mask"
                  data={mapGeometry.regions as FeatureCollection}
                >
                  <Layer
                    id="great-lakes-temperature-land-fill"
                    type="fill"
                    style={{ fillColor: "#E9E0CE", fillOpacity: 1 }}
                  />
                  <Layer
                    id="great-lakes-temperature-coast-line"
                    type="line"
                    style={{ lineColor: "#8E816F", lineWidth: 1, lineOpacity: 0.78 }}
                  />
                  {selectedState !== "ALL" ? (
                    <Layer
                      id="selected-temperature-map-state"
                      type="line"
                      filter={["==", ["get", "code"], `US-${selectedState}`]}
                      style={{ lineColor: paper.gold, lineWidth: 3, lineOpacity: 1 }}
                    />
                  ) : null}
                </GeoJSONSource>
              ) : null}

              {REGION_LABELS.map((label) => (
                <Marker
                  key={label.label}
                  id={`region-${label.label}`}
                  lngLat={label.coordinate}
                >
                  <View pointerEvents="none" style={styles.regionLabelWrap}>
                    <Text style={styles.regionLabel}>{label.label}</Text>
                  </View>
                </Marker>
              ))}
              {LAKE_LABELS.map((label) => (
                <Marker
                  key={label.label}
                  id={`lake-${label.label}`}
                  lngLat={label.coordinate}
                >
                  <Text pointerEvents="none" style={styles.lakeLabel}>
                    {label.label}
                  </Text>
                </Marker>
              ))}
              {mode === "score"
                ? visibleCities.map((entry) => (
                  <CityMarker
                    key={entry.city.cityId}
                    entry={entry}
                    density={markerDensity}
                    onOpen={() => openCity(entry)}
                  />
                ))
                : visibleTemperatureCities.map((entry) => (
                  <TemperatureMarker
                    key={entry.city.cityId}
                    entry={entry}
                    density={markerDensity}
                    onOpen={() => openCity(entry)}
                  />
                ))}
            </Map>

            <View style={styles.topOverlay} pointerEvents="box-none">
              <View style={styles.modeRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: mode === "score" }}
                  accessibilityLabel="Show PierCast scores"
                  onPress={() => {
                    hapticSelection();
                    setPlaying(false);
                    setMode("score");
                    captureAnalytics("pier_cast_visual_map_layer_changed", { layer: "score" });
                  }}
                  style={({ pressed }) => [
                    styles.modeTab,
                    mode === "score" ? styles.modeTabActive : styles.modeTabInactive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons
                    name="ribbon-outline"
                    size={13}
                    color={mode === "score" ? "#FFFFFF" : paper.dashboardMuted}
                  />
                  <Text style={mode === "score" ? styles.modeTabActiveText : styles.modeTabInactiveText}>
                    SCORE
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: mode === "temperature" }}
                  accessibilityLabel="Show modeled nearshore water temperatures"
                  onPress={() => {
                    hapticSelection();
                    setMode("temperature");
                    captureAnalytics("pier_cast_visual_map_layer_changed", { layer: "temperature" });
                  }}
                  style={({ pressed }) => [
                    styles.modeTab,
                    mode === "temperature" ? styles.modeTabActive : styles.modeTabInactive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons
                    name="thermometer-outline"
                    size={13}
                    color={mode === "temperature" ? "#FFFFFF" : paper.dashboardMuted}
                  />
                  <Text style={mode === "temperature" ? styles.modeTabActiveText : styles.modeTabInactiveText}>
                    WATER TEMP
                  </Text>
                </Pressable>
                <View style={styles.datePill}>
                  <Text style={styles.datePillLabel}>FORECAST</Text>
                  <Text style={styles.datePillValue} numberOfLines={1}>
                    {mode === "temperature"
                      ? `${timeLabel.date} · ${timeLabel.eastern}`
                      : forecastDateLabel(forecastDate)}
                  </Text>
                </View>
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
                    : cities.filter((entry) => entry.city.stateCode === filter).length;
                  return (
                    <Pressable
                      key={filter}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      accessibilityLabel={`${filter === "ALL" ? "All states" : STATE_NAMES[filter]}, ${count} cities`}
                      onPress={() => chooseState(filter)}
                      style={({ pressed }) => [
                        styles.stateChip,
                        selected && styles.stateChipSelected,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={[
                        styles.stateChipText,
                        selected && styles.stateChipTextSelected,
                      ]}>
                        {filter}
                      </Text>
                      <Text style={[
                        styles.stateChipCount,
                        selected && styles.stateChipCountSelected,
                      ]}>
                        {count}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.bottomOverlay}>
              <View style={styles.legendHeading}>
                <View>
                  <Text style={styles.legendEyebrow}>
                    {mode === "score" ? "TODAY'S OPPORTUNITY" : "NOAA MODELED SURFACE WATER"}
                  </Text>
                  <Text style={styles.legendTitle}>
                    {mode === "score"
                      ? "Tap any score to open its report."
                      : frameRange
                        ? `${timeLabel.eastern} / ${timeLabel.central} · ${frameRange.low}–${frameRange.high}°F`
                        : "Choose a forecast hour to compare temperatures."}
                  </Text>
                </View>
                <Text style={styles.visibleCount}>
                  {String(
                    mode === "score"
                      ? visibleCities.length
                      : visibleTemperatureCities.length,
                  ).padStart(2, "0")} CITIES
                </Text>
              </View>
              {mode === "score" ? (
                <View style={styles.legendRow}>
                  {SCORE_LEGEND.map((band) => (
                    <View key={band.label} style={styles.legendItem}>
                      <View style={[styles.legendSwatch, { backgroundColor: band.bg }]} />
                      <Text style={styles.legendLabel}>{band.label.toUpperCase()}</Text>
                    </View>
                  ))}
                </View>
              ) : temperatureLoading && !temperatureMap ? (
                <View style={styles.temperatureStatusRow}>
                  <ActivityIndicator size="small" color={paper.gold} />
                  <Text style={styles.temperatureStatusText}>LOADING WATER TEMPERATURES…</Text>
                </View>
              ) : temperatureError && !temperatureMap ? (
                <View style={styles.temperatureStatusRow}>
                  <Text style={styles.temperatureStatusText} numberOfLines={2}>
                    {temperatureError}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Retry water temperatures"
                    onPress={() => void retryTemperature()}
                    style={({ pressed }) => [
                      styles.temperatureRetry,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.temperatureRetryText}>RETRY</Text>
                  </Pressable>
                </View>
              ) : (
                <>
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
                        return <Text
                          key={label}
                          style={[
                            styles.temperatureLegendLabel,
                            index === 0
                              ? styles.temperatureLegendLabelFirst
                              : index === PIER_CAST_WATER_SCALE_LABELS.length - 1
                                ? styles.temperatureLegendLabelLast
                                : {
                                    left: `${fraction * 100}%`,
                                    marginLeft: -17,
                                  },
                          ]}
                        >
                          {label}
                        </Text>;
                      })}
                    </View>
                  </View>
                  <View style={styles.timelineRow}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Previous three forecast hours"
                      disabled={selectedTimeIndex <= 0}
                      onPress={() => selectTemperatureTime(selectedTimeIndex - TEMPERATURE_TIME_STEP)}
                      style={({ pressed }) => [
                        styles.timelineButton,
                        selectedTimeIndex <= 0 && styles.timelineButtonDisabled,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Ionicons name="play-back" size={13} color="#FFFFFF" />
                    </Pressable>
                    <Pressable
                      accessibilityRole="adjustable"
                      accessibilityLabel="Water temperature forecast timeline"
                      accessibilityValue={{
                        min: 0,
                        max: Math.max(0, temperatureValidTimes.length - 1),
                        now: Math.max(0, selectedTimeIndex),
                        text: `${timeLabel.date}, ${timeLabel.eastern}, ${timeLabel.central}`,
                      }}
                      accessibilityActions={[
                        { name: "increment", label: "Next three forecast hours" },
                        { name: "decrement", label: "Previous three forecast hours" },
                      ]}
                      onAccessibilityAction={(event) => {
                        if (event.nativeEvent.actionName === "increment") {
                          selectTemperatureTime(selectedTimeIndex + TEMPERATURE_TIME_STEP);
                        } else if (event.nativeEvent.actionName === "decrement") {
                          selectTemperatureTime(selectedTimeIndex - TEMPERATURE_TIME_STEP);
                        }
                      }}
                      onLayout={(event) => setTimelineWidth(event.nativeEvent.layout.width)}
                      onPress={(event) => {
                        if (timelineWidth <= 0 || temperatureValidTimes.length === 0) return;
                        const fraction = event.nativeEvent.locationX / timelineWidth;
                        selectTemperatureTime(
                          Math.round(fraction * (temperatureValidTimes.length - 1)),
                        );
                      }}
                      style={styles.timelineTrackHitbox}
                    >
                      <View style={styles.timelineTrack}>
                        <View
                          style={[
                            styles.timelineProgress,
                            {
                              width: `${temperatureValidTimes.length > 1
                                ? Math.max(0, selectedTimeIndex) /
                                  (temperatureValidTimes.length - 1) * 100
                                : 0}%`,
                            },
                          ]}
                        />
                        <View
                          style={[
                            styles.timelineThumb,
                            {
                              left: `${temperatureValidTimes.length > 1
                                ? Math.max(0, selectedTimeIndex) /
                                  (temperatureValidTimes.length - 1) * 100
                                : 0}%`,
                            },
                          ]}
                        />
                      </View>
                      <View style={styles.timelineEndpoints}>
                        <Text style={styles.timelineEndpointText}>NOW</Text>
                        <Text style={styles.timelineEndpointText}>{horizonLabel}</Text>
                      </View>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={playing ? "Pause temperature forecast" : "Play temperature forecast"}
                      onPress={() => {
                        if (selectedTimeIndex >= temperatureValidTimes.length - TEMPERATURE_TIME_STEP) {
                          selectTemperatureTime(0);
                        }
                        setPlaying((current) => !current);
                      }}
                      style={({ pressed }) => [styles.timelineButton, pressed && styles.pressed]}
                    >
                      <Ionicons name={playing ? "pause" : "play"} size={13} color="#FFFFFF" />
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Next three forecast hours"
                      disabled={selectedTimeIndex >= temperatureValidTimes.length - 1}
                      onPress={() => selectTemperatureTime(selectedTimeIndex + TEMPERATURE_TIME_STEP)}
                      style={({ pressed }) => [
                        styles.timelineButton,
                        selectedTimeIndex >= temperatureValidTimes.length - 1 &&
                          styles.timelineButtonDisabled,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Ionicons name="play-forward" size={13} color="#FFFFFF" />
                    </Pressable>
                  </View>
                </>
              )}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cityRail}
                accessibilityLabel="PierCast cities on the map"
              >
                {(
                  mode === "score"
                    ? visibleCities
                    : visibleTemperatureCities
                ).map((entry: PierCastMapCity | PierCastTemperatureMapCity) => {
                  const band = entry.score === null ? null : dashboardBandStyleForScore(entry.score);
                  const temperatureF = isTemperatureMapCity(entry)
                    ? entry.temperatureF
                    : null;
                  const temperatureColor = temperatureF === null
                    ? null
                    : pierCastWaterTemperatureColor(temperatureF);
                  return (
                    <Pressable
                      key={entry.city.cityId}
                      accessibilityRole="button"
                      accessibilityLabel={temperatureF === null
                        ? `Open ${entry.city.displayName} PierCast${entry.score === null ? ", score pending" : `, ${entry.score.toFixed(1)} out of 10`}`
                        : `Open ${entry.city.displayName} PierCast, modeled water ${Math.round(temperatureF)} degrees Fahrenheit`}
                      onPress={() => {
                        hapticSelection();
                        openCity(entry);
                      }}
                      style={({ pressed }) => [
                        styles.cityRailCard,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View style={[
                        styles.cityRailBand,
                        { backgroundColor: temperatureColor ?? band?.bg ?? "#8E9AA1" },
                      ]} />
                      <View style={styles.cityRailCopy}>
                        <Text numberOfLines={1} style={styles.cityRailName}>
                          {entry.city.displayName}
                        </Text>
                        <Text style={styles.cityRailMeta}>
                          {temperatureF === null
                            ? `${entry.city.stateCode}${entry.rank ? ` · #${entry.rank}` : " · PENDING"}`
                            : `${entry.city.stateCode} · ${timeLabel.eastern}`}
                        </Text>
                      </View>
                      <Text allowFontScaling={false} style={[
                        styles.cityRailScore,
                        {
                          color: temperatureColor ??
                            band?.verdictColor ??
                            paper.dashboardMuted,
                        },
                      ]}>
                        {temperatureF === null
                          ? entry.score?.toFixed(1) ?? "—"
                          : `${Math.round(temperatureF)}°`}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <Text style={styles.attribution} numberOfLines={2}>
                {mode === "temperature"
                  ? `${temperatureMap?.disclosure ?? "Modeled NOAA LMHOFS surface guidance."} Full-lake colors: NOAA LMHOFS · ${mapGeometry.attribution}`
                  : mapGeometry.attribution}
              </Text>
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
  modeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
  },
  modeTab: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
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
    height: 34,
    justifyContent: "center",
    paddingHorizontal: 9,
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
  stateRail: { gap: 7, paddingHorizontal: 10, paddingTop: 8, paddingBottom: 4 },
  stateChip: {
    minWidth: 55,
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 9,
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
  markerScore: {
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
  markerScoreCompact: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  markerScoreOverview: {
    width: 25,
    height: 25,
    borderWidth: 1.5,
    borderRadius: 12.5,
  },
  markerScoreText: {
    fontFamily: paperFonts.monoBold,
    fontSize: 11,
    lineHeight: 14,
  },
  markerScoreTextCompact: {
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
    paddingHorizontal: 11,
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
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingTop: 7,
  },
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
    width: 148,
    height: 48,
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
