/**
 * WaterReaderMapCard
 *
 * Paper-card wrapper that owns the *visual* loading lifecycle for a Water
 * Reader read:
 *
 *   1. Parent passes `lakeId` + `lakeName` + the read state (idle / reading
 *      / ready / error) returned by `app/water-reader.tsx`.
 *   2. While the heavy `water-reader-read` request is in flight, the card
 *      kicks off a parallel `fetchWaterbodyPolygon` so the actual lake
 *      silhouette can be painted as a topographic-pulse skeleton. The
 *      skeleton uses the same projection math as the eventual SVG, so the
 *      crossfade on arrival keeps spatial continuity.
 *   3. When the read resolves, the SVG fades in over the same polygon and
 *      the legend renders below it via `WaterReaderLegend`.
 *   4. On error, a red-bordered paper card surfaces the friendly message.
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
  Modal,
  Pressable,
  SafeAreaView,
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
import { CornerMarkSet } from '../paper';
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
  /** Optional: shown beneath the map. Default null. */
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
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | string | null>(null);
  const [readingSlow, setReadingSlow] = useState(false);
  const polygonRequestSeq = useRef(0);

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

  return (
    <View style={styles.outer}>
      <View style={styles.headerCard}>
        <CornerMarkSet color={paper.red} inset={10} size={12} />
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.eyebrow}>POLYGON STRUCTURE READ</Text>
            <Text style={styles.lakeTitle} numberOfLines={2}>
              {lakeName}
            </Text>
            {lakeContextLine ? (
              <Text style={styles.lakeContext} numberOfLines={2}>
                {lakeContextLine}
              </Text>
            ) : null}
          </View>
          {state.status === 'reading' && (
            <View style={styles.headerStatus}>
              <ActivityIndicator size="small" color={paper.forest} />
              <Text style={styles.headerStatusText} numberOfLines={1}>
                {readingSlow ? 'BUILDING MAP' : 'OPENING'}
              </Text>
            </View>
          )}
          {state.status === 'ready' && (
            <View style={styles.headerStatusReady}>
              <Ionicons
                name="checkmark"
                size={11}
                color={paper.paper}
              />
              <Text style={styles.headerStatusReadyText} numberOfLines={1}>
                READY
              </Text>
            </View>
          )}
        </View>
      </View>

      {state.status === 'reading' && (
        <WaterReaderLakeSkeleton geojson={polygonGeoJson} />
      )}

      {state.status === 'ready' && state.read.productionSvgResult && (
        <View style={styles.mapAndLegend}>
          <View style={styles.mapCard}>
            <CornerMarkSet color={paper.walnut} inset={8} size={11} />

            <View style={styles.viewerToolbar}>
              <View style={styles.viewerSegment}>
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
              <Pressable
                style={({ pressed }) => [
                  styles.viewerIconButton,
                  pressed && styles.viewerModeButtonPressed,
                ]}
                onPress={() => {
                  setViewerMode('inspect');
                  setFullScreenOpen(true);
                }}
                accessibilityRole="button"
                accessibilityLabel="Open full screen map"
              >
                <Ionicons name="expand-outline" size={14} color={paper.ink} />
              </Pressable>
            </View>

            <View
              style={styles.mapMeasure}
              onLayout={(event) => {
                const nextWidth = event.nativeEvent.layout.width;
                if (nextWidth > 0 && Math.abs(nextWidth - mapContentWidth) > 1) {
                  setMapContentWidth(nextWidth);
                }
              }}
            >
              <Animated.View style={{ opacity: svgFade }}>
                <WaterReaderAdaptiveMap
                  result={state.read.productionSvgResult}
                  mode={viewerMode}
                  containerWidth={mapContentWidth}
                  windowHeight={window.height}
                  selectedNumber={selectedNumber}
                />
              </Animated.View>
            </View>

            <View style={styles.mapMetaRow}>
              <Text style={styles.mapMetaCaption}>
                {typeof state.read.areaAcres === 'number'
                  ? `~${Math.round(state.read.areaAcres).toLocaleString()} acres · hydrography polygon`
                  : 'hydrography polygon'}
              </Text>
              <Text style={styles.mapMetaCaption}>
                {state.read.displayedEntryCount}{' '}
                {state.read.displayedEntryCount === 1 ? 'structure' : 'structures'}{' '}
                · {state.read.season}
              </Text>
            </View>
          </View>

          <WaterReaderLegend
            entries={state.read.productionSvgResult.legendEntries}
            season={state.read.season}
            selectedNumber={selectedNumber}
            onSelectNumber={setSelectedNumber}
          />

          <Modal
            visible={fullScreenOpen}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => setFullScreenOpen(false)}
          >
            <SafeAreaView style={styles.fullScreenRoot}>
              <View style={styles.fullScreenHeader}>
                <View style={styles.fullScreenTitleWrap}>
                  <Text style={styles.fullScreenEyebrow}>WATER READER</Text>
                  <Text style={styles.fullScreenTitle} numberOfLines={1}>
                    {state.read.name}
                  </Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.fullScreenClose,
                    pressed && styles.viewerModeButtonPressed,
                  ]}
                  onPress={() => setFullScreenOpen(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Close full screen map"
                >
                  <Ionicons name="close" size={18} color={paper.paper} />
                </Pressable>
              </View>
              <ScrollView
                style={styles.fullScreenScroll}
                contentContainerStyle={styles.fullScreenScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.fullScreenMapWrap}>
                  <WaterReaderAdaptiveMap
                    result={state.read.productionSvgResult}
                    mode="inspect"
                    containerWidth={Math.max(320, window.width - 28)}
                    windowHeight={window.height}
                    selectedNumber={selectedNumber}
                    fullScreen
                  />
                </View>
                <WaterReaderLegend
                  entries={state.read.productionSvgResult.legendEntries}
                  season={state.read.season}
                  selectedNumber={selectedNumber}
                  onSelectNumber={setSelectedNumber}
                />
              </ScrollView>
            </SafeAreaView>
          </Modal>
        </View>
      )}

      {state.status === 'ready' && !state.read.productionSvgResult && (
        <View style={styles.fallbackCard}>
          <Ionicons name="warning-outline" size={16} color={paper.goldDk} />
          <Text style={styles.fallbackTitle}>NO MAP DRAWN</Text>
          <Text style={styles.fallbackBody}>
            {state.read.fallbackMessage ??
              'Water Reader could not build a polygon geometry read for this waterbody.'}
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
        styles.viewerModeButton,
        active && styles.viewerModeButtonActive,
        pressed && styles.viewerModeButtonPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Ionicons
        name={icon}
        size={12}
        color={active ? paper.paper : paper.ink}
      />
      <Text
        style={[
          styles.viewerModeButtonText,
          active && styles.viewerModeButtonTextActive,
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

  // Header summary card — sits above the map/skeleton with the lake name
  // and a status pill so the read lifecycle is unmistakable at a glance.
  headerCard: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    ...paperBorders.card,
    ...paperShadows.hard,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
    gap: 3,
    paddingRight: paperSpacing.sm,
  },
  eyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    letterSpacing: 2.6,
    color: paper.red,
    fontWeight: '700',
  },
  lakeTitle: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0,
    color: paper.ink,
    lineHeight: 26,
    marginTop: 2,
  },
  lakeContext: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 12.5,
    color: paper.ink,
    opacity: 0.65,
    marginTop: 2,
    lineHeight: 17,
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paper,
    flexShrink: 0,
    maxWidth: 132,
  },
  headerStatusText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2,
    color: paper.ink,
    fontWeight: '700',
    lineHeight: 12,
  },
  headerStatusReady: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.forest,
    flexShrink: 0,
    maxWidth: 108,
  },
  headerStatusReadyText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2,
    color: paper.paper,
    fontWeight: '700',
    lineHeight: 12,
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
  viewerToolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: paperSpacing.xs,
    marginBottom: paperSpacing.sm,
  },
  viewerSegment: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    overflow: 'hidden',
    backgroundColor: paper.paper,
    flexShrink: 1,
  },
  viewerModeButton: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: paper.inkHair,
  },
  viewerModeButtonActive: {
    backgroundColor: paper.forest,
  },
  viewerModeButtonPressed: {
    opacity: 0.75,
  },
  viewerModeButtonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.8,
    color: paper.ink,
    fontWeight: '700',
    lineHeight: 12,
  },
  viewerModeButtonTextActive: {
    color: paper.paper,
  },
  viewerIconButton: {
    width: 36,
    minHeight: 34,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapMeasure: {
    width: '100%',
  },
  fitViewport: {
    width: '100%',
    borderRadius: paperRadius.card - 2,
    overflow: 'hidden',
    backgroundColor: paper.paper,
    borderWidth: 1,
    borderColor: paper.inkHair,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: paperSpacing.xs,
  },
  inspectViewport: {
    width: '100%',
    borderRadius: paperRadius.card - 2,
    overflow: 'hidden',
    backgroundColor: paper.paper,
    borderWidth: 1,
    borderColor: paper.inkHair,
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
    backgroundColor: paper.paper,
  },
  mapMetaRow: {
    marginTop: paperSpacing.sm + 2,
    paddingTop: paperSpacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.inkHair,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: paperSpacing.sm,
  },
  mapMetaCaption: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.65,
    letterSpacing: 0.4,
    flexShrink: 1,
    lineHeight: 14,
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
  fullScreenRoot: {
    flex: 1,
    backgroundColor: paper.paper,
    paddingHorizontal: paperSpacing.md,
    paddingBottom: paperSpacing.md,
    gap: paperSpacing.md,
  },
  fullScreenHeader: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.md,
    borderBottomWidth: 1.5,
    borderBottomColor: paper.ink,
  },
  fullScreenTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  fullScreenEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2.8,
    color: paper.red,
    fontWeight: '700',
  },
  fullScreenTitle: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    lineHeight: 26,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: 0,
  },
  fullScreenClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenMapWrap: {
    width: '100%',
  },
  fullScreenScroll: {
    flex: 1,
  },
  fullScreenScrollContent: {
    gap: paperSpacing.md,
    paddingBottom: paperSpacing.lg,
  },
});
