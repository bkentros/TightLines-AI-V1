/**
 * WaterReaderMapCard
 *
 * Editorial wrapper that owns the *visual* loading lifecycle for a Water
 * Read read and frames the result as a hand-pressed field-guide plate
 * (rather than a generic UI card around an SVG):
 *
 *   1. Parent passes `lakeId` + `lakeName` + the read state (idle / reading
 *      / preparing / queued / ready / error) returned by `app/water-reader.tsx`.
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

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
  Easing,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import { fetchWaterbodyPolygon } from '../../lib/waterReader';
import { useAuthStore } from '../../store/authStore';
import { seasonDisplayLabel } from '../../lib/waterReaderLegendTemplates';
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
  | { status: 'preparing'; read: WaterReaderReadResponse }
  | { status: 'queued'; read: WaterReaderReadResponse }
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

  // Enable LayoutAnimation on Android — iOS has it on by default but
  // Android needs an opt-in via the legacy UIManager flag. This is a
  // one-shot side effect on mount; the call is a no-op on iOS.
  useEffect(() => {
    if (Platform.OS === 'android') {
      const um: typeof UIManager & {
        setLayoutAnimationEnabledExperimental?: (enabled: boolean) => void;
      } = UIManager;
      um.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  // Smooth FULL ↔ DETAIL transition. The viewport heights between the two
  // modes differ by 200–300 px depending on the lake; an unanimated swap
  // feels abrupt. LayoutAnimation animates the height interpolation on the
  // native thread; we also brief-fade the AdaptiveMap below for a clean
  // crossblend during the swap.
  const handleSwitchViewerMode = useCallback((next: MapViewerMode) => {
    if (next === viewerMode) return;
    LayoutAnimation.configureNext({
      duration: 320,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    setViewerMode(next);
  }, [viewerMode]);

  const pressedDate = useMemo(() => formatPressedDate(), []);

  useEffect(() => {
    setSelectedNumber(null);
  }, [lakeId]);

  useEffect(() => {
    if (state.status !== 'reading' && state.status !== 'preparing') {
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

  // ── Marginalia entrance ───────────────────────────────────────────────────
  // The SVG itself owns its settle animation (scale + lift + fade in
  // `WaterReaderProductionMap`). Here we just fade in the cartographic
  // marginalia (compass, scale bar, stamp, topographic lines) so they
  // appear with the plate rather than popping when the read resolves.
  const marginaliaFade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (state.status === 'ready' && state.read.productionSvgResult) {
      marginaliaFade.setValue(0);
      Animated.timing(marginaliaFade, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else {
      marginaliaFade.setValue(0);
    }
  }, [state, marginaliaFade]);

  // Cartouche needs to know what the engine returned (when it has).
  const ready = state.status === 'ready' ? state : null;
  const cartoucheStatus: 'idle' | 'reading' | 'queued' | 'ready' =
    state.status === 'reading'
      ? 'reading'
      : state.status === 'preparing' || state.status === 'queued'
        ? 'queued'
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
        status={cartoucheStatus}
        readingSlow={readingSlow}
      />

      {state.status === 'reading' && (
        <WaterReaderLakeSkeleton geojson={polygonGeoJson} />
      )}

      {(state.status === 'preparing' || state.status === 'queued') && (
        <View style={styles.preparingCard}>
          <View style={styles.preparingBadge}>
            {state.status === 'preparing' ? (
              <ActivityIndicator size="small" color={paper.dashboardBlue} />
            ) : (
              <Ionicons name="time-outline" size={15} color={paper.dashboardBlue} />
            )}
          </View>
          <View style={styles.preparingCopy}>
            <Text style={styles.preparingTitle}>
              {state.status === 'queued' ? 'STILL WORKING' : 'BUILDING WATER READ'}
            </Text>
            <Text style={styles.preparingBody}>
              {state.status === 'queued'
                ? 'This lake needs more processing time. Leave this screen and choose the same lake again later, or tap Check Read.'
                : 'This lake needs the heavy map builder. This page will check for the finished read automatically.'}
            </Text>
          </View>
        </View>
      )}

      {state.status === 'ready' && state.read.productionSvgResult && (
        <View style={styles.mapAndLegend}>
          <View style={styles.mapCard}>
            <View style={styles.viewerToolbar}>
              <ViewerModeButton
                icon="scan-outline"
                label="FULL"
                active={viewerMode === 'fit'}
                onPress={() => handleSwitchViewerMode('fit')}
              />
              <ViewerModeButton
                icon="move-outline"
                label="DETAIL"
                active={viewerMode === 'inspect'}
                onPress={() => handleSwitchViewerMode('inspect')}
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
                {/* Pass-9: removed the TopographicLines React overlay.
                    The in-SVG wave-contour pattern now covers the entire
                    extended viewBox (corner to corner), so a second React
                    decoration behind the SVG was both redundant and
                    visible as "lined paper" through the SVG's padding
                    region when the SVG patterns didn't reach the edges. */}

                <View style={styles.plateMapWrap}>
                  <WaterReaderAdaptiveMap
                    result={state.read.productionSvgResult}
                    mode={viewerMode}
                    containerWidth={mapContentWidth}
                    windowHeight={window.height}
                    selectedNumber={selectedNumber}
                    lakeName={state.read.name ?? lakeName}
                  />
                </View>

                {viewerMode === 'fit' && (
                  <Animated.View
                    style={[
                      StyleSheet.absoluteFill,
                      { opacity: marginaliaFade },
                    ]}
                    pointerEvents="none"
                  >
                    <View style={styles.editionStampWrap}>
                      <WaterReadEditionStamp />
                    </View>
                    <View style={styles.scaleBarWrap}>
                      <WaterReadScaleBar
                        areaAcres={state.read.areaAcres ?? null}
                        units={unitsPref}
                        bbox={state.read.bbox}
                        mapWidthPx={mapContentWidth}
                      />
                    </View>
                  </Animated.View>
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
                  {seasonDisplayLabel(state.read.season).label}
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

          <View style={styles.colophon}>
            <View style={styles.colophonLeft}>
              <Ionicons name="boat-outline" size={11} color={paper.dashboardMuted} />
              <Text style={styles.colophonText}>POLYGON ONLY</Text>
            </View>
            <Text style={styles.colophonText} numberOfLines={1}>
              SCANNED · {pressedDate}
            </Text>
          </View>
        </View>
      )}

      {state.status === 'ready' && !state.read.productionSvgResult && (
        <View style={styles.fallbackCard}>
          <Ionicons name="warning-outline" size={16} color={paper.dashboardBlue} />
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
            <Ionicons name="alert" size={14} color="#FFFFFF" />
          </View>
          <Text style={styles.errorTitle}>NO MAP DRAWN</Text>
          <Text style={styles.errorBody}>{state.errorMessage}</Text>
        </View>
      )}

      {bottomSlot ? <View style={styles.bottomSlot}>{bottomSlot}</View> : null}
    </View>
  );
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
        color={active ? '#FFFFFF' : paper.dashboardInk}
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
  lakeName,
  fullScreen = false,
}: {
  result: WaterReaderReadResponse['productionSvgResult'];
  mode: MapViewerMode;
  containerWidth: number;
  windowHeight: number;
  selectedNumber?: number | string | null;
  lakeName?: string;
  fullScreen?: boolean;
}) {
  const dimensions = useMemo(() => {
    const width = Math.max(1, result?.summary.width ?? 1);
    const height = Math.max(1, result?.summary.height ?? 1);
    const aspectRatio = width / height;
    const availableWidth = Math.max(280, containerWidth || 320);
    // Pass-8 — reverted floor to 380 (was 460 in Pass-7). The viewBox
    // extension in paperify (scan-v8) now provides the guaranteed beige
    // margin around the lake, so the React-side fitHeight no longer needs
    // to fight for breathing room. Smaller plate on wide lakes lets the
    // page show more above the fold, and the beige is baked into the SVG.
    const maxFitHeight = Math.max(580, Math.min(970, windowHeight * 0.88));
    const naturalFitHeight = availableWidth / aspectRatio;
    const fitHeight = Math.max(380, Math.min(maxFitHeight, naturalFitHeight));
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
              lakeName={lakeName}
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
        lakeName={lakeName}
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
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
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
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 7,
    backgroundColor: '#FAFAF7',
  },
  viewerChipActive: {
    backgroundColor: paper.dashboardInk,
    borderColor: paper.dashboardInk,
  },
  viewerChipPressed: {
    opacity: 0.78,
  },
  viewerChipText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: paper.dashboardInk,
    lineHeight: 12,
  },
  viewerChipTextActive: {
    color: '#FFFFFF',
  },

  // Plate frame: outer ink rule, hairline gap, inner ink hairline. The
  // plateInner is the "page within a page" that holds the SVG and the
  // cartographic marginalia. Padding tightened 4 → 3 so the inner SVG
  // gets every available pixel.
  plateOuter: {
    width: '100%',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 8,
    padding: 3,
    backgroundColor: '#FAFAF7',
  },
  plateInner: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 6,
    // Pass-8: tan to match the in-SVG land color so the brief wait-moment
    // before the SVG fades in shows the same beige, not an off-white flash.
    backgroundColor: '#EFE4C8',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.dashboardHair,
  },
  plateMapWrap: {
    width: '100%',
  },

  // Marginalia anchors — each pointer-events-none so the FULL/DETAIL
  // toggle remains the only interactive surface in the plate.
  // Bumped `bottom` 10 → 22 in scan-v7 so the scale bar's two-line
  // (bar + label) layout always sits firmly within the beige land area
  // even on plates where the host card adds tight inner padding.
  scaleBarWrap: {
    position: 'absolute',
    bottom: 22,
    left: 14,
  },
  // Top-left brand chip — single-line pill (logo + FinFindr. + edition
  // tagline). Sits inside the beige margin on virtually every lake.
  editionStampWrap: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  // Meta ribbon under the plate — typographic masthead, not a caption row.
  metaRibbon: {
    marginTop: paperSpacing.sm + 4,
    gap: 5,
  },
  metaRibbonRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardLine,
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
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.5,
    color: paper.dashboardMuted,
    lineHeight: 13,
  },
  metaRibbonDivider: {
    fontFamily: paperFonts.body,
    fontSize: 10,
    color: paper.dashboardMuted,
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
    // Pass-8: match the SVG's tan land color.
    backgroundColor: '#EFE4C8',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
  },
  colophonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colophonText: {
    flexShrink: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: paper.dashboardMuted,
  },

  // Fallback (read succeeded but engine produced no SVG).
  fallbackCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    padding: paperSpacing.lg,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    gap: paperSpacing.xs,
  },
  fallbackTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 1.5,
    color: paper.dashboardBlue,
    marginTop: 4,
  },
  fallbackBody: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: '#555555',
  },

  preparingCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 8,
    padding: paperSpacing.lg,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  preparingBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8F2FA',
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preparingCopy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  preparingTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: paper.dashboardBlue,
  },
  preparingBody: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: '#555555',
  },

  // Error state.
  errorCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    padding: paperSpacing.lg,
    borderWidth: 1,
    borderColor: paper.bandTough,
    gap: paperSpacing.xs,
    alignItems: 'flex-start',
  },
  errorBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: paper.bandTough,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: paperSpacing.xs,
  },
  errorTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 1.5,
    color: paper.bandTough,
  },
  errorBody: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: '#555555',
  },

  bottomSlot: {
    width: '100%',
  },
});
