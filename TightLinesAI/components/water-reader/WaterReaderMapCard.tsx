/**
 * WaterReaderMapCard
 *
 * Editorial wrapper that owns the *visual* loading lifecycle for a Water
 * Read read and frames the result as a hand-pressed field-guide plate
 * (rather than a generic UI card around an SVG):
 *
 *   1. Parent passes `lakeId` + `lakeName` + the read state (idle / reading
 *      / ready / error) returned by `app/water-reader.tsx`.
 *   2. The masthead cartouche on top stays anchored across the read
 *      transition — eyebrow with edition stamp, lake name in display
 *      Fraunces, masthead subline, status pill on the right.
 *   3. While the heavy `water-reader-read` request is in flight, the card
 *      kicks off a parallel `fetchWaterbodyPolygon` so the lake silhouette
 *      can be painted as a topographic-pulse skeleton. The skeleton uses
 *      the same projection math as the eventual SVG, so the crossfade on
 *      arrival keeps spatial continuity.
 *   4. When the read resolves, the SVG fades in inside a double-rule ink
 *      frame, with cartographic marginalia (compass rose, scale bar,
 *      edition stamp) anchored in the corners and a typographic meta
 *      ribbon underneath. The legend renders below via `WaterReaderLegend`,
 *      and a `PaperColophon` signs off the plate.
 *   5. On error, a red-bordered paper card surfaces the friendly message.
 *
 * The data layer was previously inline in `app/water-reader.tsx`; this
 * wrapper exists so the page itself can stay focused on search/selection
 * chrome and the map presentation can be swapped without touching the page.
 *
 * Important: this component does NOT initiate the heavy read — the parent
 * still calls `fetchWaterReaderRead({ lakeId })` so the existing request id
 * + cancellation logic is preserved exactly. We only own the polygon
 * pre-fetch (which is independent and additive).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Easing,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperBorders,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../../lib/theme';
import { fetchWaterbodyPolygon } from '../../lib/waterReader';
import {
  CompassRose,
  CornerMarkSet,
  PaperColophon,
  TopographicLines,
} from '../paper';
import { useAuthStore } from '../../store/authStore';
import { WaterReadCartouche } from './WaterReadCartouche';
import { WaterReadEditionStamp } from './WaterReadEditionStamp';
import { WaterReadScaleBar } from './WaterReadScaleBar';
import { WaterReaderLakeSkeleton } from './WaterReaderLakeSkeleton';
import { WaterReaderProductionMap } from './WaterReaderProductionMap';
import { WaterReaderLegend } from './WaterReaderLegend';
import type {
  WaterbodyPolygonGeoJson,
  WaterReaderReadResponse,
} from '../../lib/waterReaderContracts';

export type WaterReaderMapCardState =
  | { status: 'idle' }
  | { status: 'reading' }
  | { status: 'ready'; read: WaterReaderReadResponse }
  | { status: 'error'; errorMessage: string };

export interface WaterReaderMapCardProps {
  lakeId: string;
  lakeName: string;
  lakeContextLine?: string;
  state: WaterReaderMapCardState;
  /** Optional: shown beneath the colophon. Default null. */
  bottomSlot?: React.ReactNode;
}

type MapViewerMode = 'fit' | 'inspect';

export function WaterReaderMapCard({
  lakeId,
  lakeName,
  lakeContextLine,
  state,
  bottomSlot,
}: WaterReaderMapCardProps) {
  const window = useWindowDimensions();
  // ── Polygon pre-fetch (parallel to the parent's heavy read) ─────────────
  const [polygonGeoJson, setPolygonGeoJson] =
    useState<WaterbodyPolygonGeoJson | null>(null);
  const [viewerMode, setViewerMode] = useState<MapViewerMode>('fit');
  const [mapContentWidth, setMapContentWidth] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | string | null>(null);
  const [readingSlow, setReadingSlow] = useState(false);
  const polygonRequestSeq = useRef(0);

  // User units pref — drives the scale-bar marginalia.
  const profileUnits = useAuthStore((s) => s.profile?.preferred_units);
  const unitsPref: 'imperial' | 'metric' =
    profileUnits === 'metric' ? 'metric' : 'imperial';

  // Edition stamp — day-of-year + 1000, mirroring `PaperColophon`'s logic so
  // the masthead, the corner stamp, and the bottom colophon all agree.
  const edition = useMemo(() => paperEditionToday(), []);
  const pressedDate = useMemo(() => formatPressedDate(), []);

  useEffect(() => {
    setSelectedNumber(null);
  }, [lakeId]);

  useEffect(() => {
    if (state.status !== 'reading') {
      setReadingSlow(false);
      return;
    }
    setReadingSlow(false);
    const timer = setTimeout(() => setReadingSlow(true), 850);
    return () => clearTimeout(timer);
  }, [state.status, lakeId]);

  useEffect(() => {
    polygonRequestSeq.current += 1;
    setPolygonGeoJson(null);
    if (!lakeId) return;
    const mySeq = polygonRequestSeq.current;
    void (async () => {
      try {
        const res = await fetchWaterbodyPolygon({ lakeId });
        if (polygonRequestSeq.current !== mySeq) return;
        if (res.geojson) setPolygonGeoJson(res.geojson);
      } catch {
        // Polygon pre-fetch is purely visual — silently skip the skeleton
        // shape if it errors. The reading-state will still render a small
        // generic spinner card.
      }
    })();
    return () => {
      polygonRequestSeq.current += 1;
    };
  }, [lakeId]);

  // ── SVG crossfade ────────────────────────────────────────────────────────
  // We render the skeleton and the final map in the same parent so the
  // spatial frame doesn't shift; the SVG sits above the skeleton with a
  // native-driven opacity tween that runs on first arrival and on every
  // subsequent ready transition (e.g. when a user re-selects the same lake).
  const svgFade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (state.status === 'ready' && state.read.productionSvgResult) {
      svgFade.setValue(0);
      Animated.timing(svgFade, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else {
      svgFade.setValue(0);
    }
  }, [state, svgFade]);

  // Cartouche needs to know what the engine returned (when it has).
  const ready = state.status === 'ready' ? state : null;
  const cartoucheStatus: 'idle' | 'reading' | 'ready' =
    state.status === 'reading'
      ? 'reading'
      : state.status === 'ready'
        ? 'ready'
        : 'idle';

  return (
    <View style={styles.outer}>
      <WaterReadCartouche
        lakeName={ready?.read.name ?? lakeName}
        contextLine={lakeContextLine}
        state={ready?.read.state}
        county={ready?.read.county ?? undefined}
        acres={ready?.read.areaAcres ?? null}
        season={ready?.read.season}
        edition={edition}
        status={cartoucheStatus}
        readingSlow={readingSlow}
      />

      {state.status === 'reading' && (
        <WaterReaderLakeSkeleton geojson={polygonGeoJson} />
      )}

      {state.status === 'ready' && state.read.productionSvgResult && (
        <View style={styles.mapAndLegend}>
          <View style={styles.mapCard}>
            <CornerMarkSet color={paper.walnut} inset={8} size={11} />

            <View style={styles.viewerToolbar}>
              <ViewerModeButton
                icon="scan-outline"
                label="FULL"
                active={viewerMode === 'fit'}
                onPress={() => setViewerMode('fit')}
              />
              <ViewerModeButton
                icon="move-outline"
                label="DETAIL"
                active={viewerMode === 'inspect'}
                onPress={() => setViewerMode('inspect')}
              />
            </View>

            {/*
              Plate frame: the SVG sits inside an ink-ruled inner box with a
              hairline gap, so the map reads as a printed plate clipped from
              a larger sheet. Topographic contours pulse faintly behind the
              SVG; the lake's sage fill obscures them within its outline so
              they only visibly bleed through the surrounding paper.
              Marginalia (compass / scale / stamp) are corner-anchored on
              top of the SVG with `pointerEvents="none"` so the FULL/DETAIL
              toggle stays the only interactive surface in the plate.
            */}
            <View
              style={styles.plateOuter}
              onLayout={(event) => {
                const nextWidth = event.nativeEvent.layout.width;
                if (nextWidth > 0 && Math.abs(nextWidth - mapContentWidth) > 1) {
                  setMapContentWidth(nextWidth);
                }
              }}
            >
              <View style={styles.plateInner}>
                <TopographicLines
                  style={StyleSheet.absoluteFill}
                  color={paper.forestDk}
                  count={5}
                />

                <Animated.View
                  style={[styles.plateMapWrap, { opacity: svgFade }]}
                >
                  <WaterReaderAdaptiveMap
                    result={state.read.productionSvgResult}
                    mode={viewerMode}
                    containerWidth={mapContentWidth}
                    windowHeight={window.height}
                    selectedNumber={selectedNumber}
                  />
                </Animated.View>

                {viewerMode === 'fit' && (
                  <>
                    <View style={styles.compassWrap} pointerEvents="none">
                      <CompassRose
                        size={68}
                        opacity={0.55}
                        color={paper.ink}
                        style={styles.compassReset}
                      />
                    </View>
                    <View style={styles.scaleBarWrap} pointerEvents="none">
                      <WaterReadScaleBar
                        areaAcres={state.read.areaAcres ?? null}
                        units={unitsPref}
                      />
                    </View>
                    <View style={styles.editionStampWrap} pointerEvents="none">
                      <WaterReadEditionStamp edition={edition} />
                    </View>
                  </>
                )}
              </View>
            </View>

            <View style={styles.metaRibbon}>
              <View style={styles.metaRibbonRule} />
              <View style={styles.metaRibbonRow}>
                <Text style={styles.metaRibbonText} numberOfLines={1}>
                  {typeof state.read.areaAcres === 'number'
                    ? `${Math.round(state.read.areaAcres).toLocaleString()} ACRES`
                    : 'HYDROGRAPHY'}
                </Text>
                <Text style={styles.metaRibbonDivider}>·</Text>
                <Text style={styles.metaRibbonText} numberOfLines={1}>
                  {state.read.displayedEntryCount}{' '}
                  {state.read.displayedEntryCount === 1 ? 'STRUCTURE' : 'STRUCTURES'}
                </Text>
                <Text style={styles.metaRibbonDivider}>·</Text>
                <Text style={styles.metaRibbonText} numberOfLines={1}>
                  {state.read.season.toUpperCase()}
                </Text>
              </View>
              <View style={styles.metaRibbonRule} />
            </View>
          </View>

          <WaterReaderLegend
            entries={state.read.productionSvgResult.legendEntries}
            season={state.read.season}
            selectedNumber={selectedNumber}
            onSelectNumber={setSelectedNumber}
          />

          <PaperColophon
            section="WATER READ"
            edition={edition}
            tagline={(ed) => `NO. ${ed} · PRESSED ${pressedDate} · POLYGON ONLY`}
            style={styles.colophon}
          />
        </View>
      )}

      {state.status === 'ready' && !state.read.productionSvgResult && (
        <View style={styles.fallbackCard}>
          <Ionicons name="warning-outline" size={16} color={paper.goldDk} />
          <Text style={styles.fallbackTitle}>NO MAP DRAWN</Text>
          <Text style={styles.fallbackBody}>
            {state.read.fallbackMessage ??
              'Water Read could not build a polygon geometry read for this waterbody.'}
          </Text>
        </View>
      )}

      {state.status === 'error' && (
        <View style={styles.errorCard}>
          <View style={styles.errorBadge}>
            <Ionicons name="alert" size={14} color={paper.paper} />
          </View>
          <Text style={styles.errorTitle}>NO MAP DRAWN</Text>
          <Text style={styles.errorBody}>{state.errorMessage}</Text>
        </View>
      )}

      {bottomSlot ? <View style={styles.bottomSlot}>{bottomSlot}</View> : null}
    </View>
  );
}

/**
 * Day-of-year + 1000 — same formula as `PaperColophon` so the cartouche,
 * corner edition stamp, and bottom colophon all agree on which "edition"
 * is being printed.
 */
function paperEditionToday(): string {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const diff =
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start;
  const dayOfYear = Math.floor(diff / 86_400_000);
  return String(1000 + dayOfYear);
}

/** "MAY 7 · 2026" style date string for the colophon tagline. */
function formatPressedDate(): string {
  const now = new Date();
  const month = now
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase();
  return `${month} ${now.getDate()} · ${now.getFullYear()}`;
}

function ViewerModeButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.viewerChip,
        active && styles.viewerChipActive,
        pressed && styles.viewerChipPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Ionicons
        name={icon}
        size={11}
        color={active ? paper.paper : paper.ink}
      />
      <Text
        style={[
          styles.viewerChipText,
          active && styles.viewerChipTextActive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function WaterReaderAdaptiveMap({
  result,
  mode,
  containerWidth,
  windowHeight,
  selectedNumber,
  fullScreen = false,
}: {
  result: WaterReaderReadResponse['productionSvgResult'];
  mode: MapViewerMode;
  containerWidth: number;
  windowHeight: number;
  selectedNumber?: number | string | null;
  fullScreen?: boolean;
}) {
  const dimensions = useMemo(() => {
    const width = Math.max(1, result?.summary.width ?? 1);
    const height = Math.max(1, result?.summary.height ?? 1);
    const aspectRatio = width / height;
    const availableWidth = Math.max(280, containerWidth || 320);
    const maxFitHeight = Math.max(430, Math.min(720, windowHeight * 0.68));
    const naturalFitHeight = availableWidth / aspectRatio;
    const fitHeight = Math.max(260, Math.min(maxFitHeight, naturalFitHeight));
    const fitWidth = Math.min(availableWidth, fitHeight * aspectRatio);
    const inspectViewportHeight = fullScreen
      ? Math.max(480, windowHeight * 0.56)
      : Math.max(430, Math.min(640, windowHeight * 0.62));
    const inspectBaseWidth = Math.max(availableWidth * (fullScreen ? 2.2 : 1.7), fullScreen ? 820 : 620);
    const inspectWidth = aspectRatio < 0.72
      ? Math.max(availableWidth, inspectViewportHeight * aspectRatio * 1.22)
      : inspectBaseWidth;
    const inspectHeight = Math.max(inspectViewportHeight, inspectWidth / aspectRatio);
    return {
      aspectRatio,
      fitWidth,
      fitHeight,
      inspectWidth,
      inspectHeight,
      inspectViewportHeight,
    };
  }, [containerWidth, fullScreen, result?.summary.height, result?.summary.width, windowHeight]);

  if (!result) return null;

  if (mode === 'inspect') {
    return (
      <View style={[styles.inspectViewport, { height: dimensions.inspectViewportHeight }]}>
        <ScrollView
          horizontal
          bounces
          nestedScrollEnabled
          showsHorizontalScrollIndicator
          contentContainerStyle={[
            styles.inspectHorizontalContent,
            { minWidth: Math.max(containerWidth, dimensions.inspectWidth) },
          ]}
        >
          <ScrollView
            bounces
            nestedScrollEnabled
            showsVerticalScrollIndicator
            maximumZoomScale={2.2}
            minimumZoomScale={1}
            contentContainerStyle={[
              styles.inspectVerticalContent,
              {
                width: dimensions.inspectWidth,
                minHeight: dimensions.inspectHeight,
              },
            ]}
          >
            <WaterReaderProductionMap
              result={result}
              width={dimensions.inspectWidth}
              height={dimensions.inspectHeight}
              selectedNumber={selectedNumber}
              style={[
                styles.mapCanvas,
                {
                  width: dimensions.inspectWidth,
                  height: dimensions.inspectHeight,
                },
              ]}
            />
          </ScrollView>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.fitViewport}>
      <WaterReaderProductionMap
        result={result}
        width={dimensions.fitWidth}
        height={dimensions.fitHeight}
        selectedNumber={selectedNumber}
        style={[
          styles.mapCanvas,
          {
            width: dimensions.fitWidth,
            height: dimensions.fitHeight,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    gap: paperSpacing.md,
  },

  // Map + legend stack (ready state).
  mapAndLegend: {
    width: '100%',
    gap: paperSpacing.md,
  },
  mapCard: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    ...paperBorders.card,
    ...paperShadows.hard,
  },

  // Viewer toolbar — two ink-stroked paper chips, slightly separated, that
  // read as hand-stamped tools rather than the prior iOS segmented control.
  viewerToolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: paperSpacing.xs + 2,
    marginBottom: paperSpacing.sm,
  },
  viewerChip: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paper,
  },
  viewerChipActive: {
    backgroundColor: paper.ink,
  },
  viewerChipPressed: {
    opacity: 0.78,
  },
  viewerChipText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.8,
    color: paper.ink,
    fontWeight: '700',
    lineHeight: 12,
  },
  viewerChipTextActive: {
    color: paper.paper,
  },

  // Plate frame: outer ink rule, hairline gap, inner ink hairline. The
  // plateInner is the "page within a page" that holds the SVG and the
  // cartographic marginalia.
  plateOuter: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.card - 4,
    padding: 4,
    backgroundColor: paper.paperLight,
  },
  plateInner: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: paperRadius.card - 8,
    backgroundColor: paper.paper,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.ink,
  },
  plateMapWrap: {
    width: '100%',
  },

  // Marginalia anchors — each pointer-events-none so the FULL/DETAIL
  // toggle remains the only interactive surface in the plate.
  compassWrap: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 68,
    height: 68,
  },
  // CompassRose's root has `position: 'absolute'` baked in (it was designed
  // to bleed off the corner of a card with negative offsets). We're already
  // wrapping it in a positioned `compassWrap`, so neutralize the inner
  // absolute so it fills its wrapper as a normal in-flow child.
  compassReset: {
    position: 'relative',
  },
  scaleBarWrap: {
    position: 'absolute',
    bottom: 10,
    left: 12,
  },
  editionStampWrap: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },

  // Meta ribbon under the plate — typographic masthead, not a caption row.
  metaRibbon: {
    marginTop: paperSpacing.sm + 4,
    gap: 5,
  },
  metaRibbonRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.ink,
    opacity: 0.45,
  },
  metaRibbonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 4,
  },
  metaRibbonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.4,
    color: paper.ink,
    fontWeight: '700',
    lineHeight: 13,
  },
  metaRibbonDivider: {
    fontFamily: paperFonts.body,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.5,
    lineHeight: 13,
  },

  fitViewport: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: paperSpacing.xs,
  },
  inspectViewport: {
    width: '100%',
    backgroundColor: paper.paper,
  },
  inspectHorizontalContent: {
    flexGrow: 1,
  },
  inspectVerticalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: paperSpacing.xs,
  },
  mapCanvas: {
    backgroundColor: 'transparent',
  },

  colophon: {
    paddingVertical: paperSpacing.md,
    marginTop: -paperSpacing.xs,
  },

  // Fallback (read succeeded but engine produced no SVG).
  fallbackCard: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    padding: paperSpacing.lg,
    borderWidth: 1.5,
    borderColor: paper.goldDk,
    gap: paperSpacing.xs,
  },
  fallbackTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2.4,
    color: paper.goldDk,
    fontWeight: '700',
    marginTop: 4,
  },
  fallbackBody: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: paper.ink,
    opacity: 0.78,
  },

  // Error state.
  errorCard: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    padding: paperSpacing.lg,
    borderWidth: 1.5,
    borderColor: paper.red,
    gap: paperSpacing.xs,
    alignItems: 'flex-start',
  },
  errorBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: paper.red,
    borderWidth: 1.5,
    borderColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: paperSpacing.xs,
  },
  errorTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2.4,
    color: paper.red,
    fontWeight: '700',
  },
  errorBody: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: paper.ink,
    opacity: 0.85,
  },

  bottomSlot: {
    width: '100%',
  },
});
