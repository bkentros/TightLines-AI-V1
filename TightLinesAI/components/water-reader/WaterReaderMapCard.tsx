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

import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
  Easing,
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

export function WaterReaderMapCard({
  lakeId,
  lakeName,
  lakeContextLine,
  state,
  bottomSlot,
}: WaterReaderMapCardProps) {
  // ── Polygon pre-fetch (parallel to the parent's heavy read) ─────────────
  const [polygonGeoJson, setPolygonGeoJson] =
    useState<WaterbodyPolygonGeoJson | null>(null);
  const polygonRequestSeq = useRef(0);

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
              <Text style={styles.headerStatusText}>READING</Text>
            </View>
          )}
          {state.status === 'ready' && (
            <View style={styles.headerStatusReady}>
              <Ionicons
                name="checkmark"
                size={11}
                color={paper.paper}
              />
              <Text style={styles.headerStatusReadyText}>READY</Text>
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
            <View style={styles.mapStack}>
              {/* The skeleton stays mounted underneath the SVG for the
                  duration of the fade so there's no visible flash of the
                  warm paper backdrop between the two states. */}
              <View style={styles.mapStackLayer} pointerEvents="none">
                <WaterReaderLakeSkeleton
                  geojson={polygonGeoJson}
                  legendBoneCount={0}
                  eyebrow=""
                />
              </View>
              <Animated.View
                style={[
                  styles.mapStackLayer,
                  styles.mapStackTopLayer,
                  { opacity: svgFade },
                ]}
              >
                <WaterReaderProductionMap
                  result={state.read.productionSvgResult}
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
          />
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
    letterSpacing: -0.5,
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
  },
  headerStatusText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2,
    color: paper.ink,
    fontWeight: '700',
  },
  headerStatusReady: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.forest,
  },
  headerStatusReadyText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2,
    color: paper.paper,
    fontWeight: '700',
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
  mapStack: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: paperRadius.card - 2,
    overflow: 'hidden',
    backgroundColor: paper.paper,
    borderWidth: 1,
    borderColor: paper.inkHair,
  },
  mapStackLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStackTopLayer: {
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
    gap: paperSpacing.sm,
  },
  mapMetaCaption: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.65,
    letterSpacing: 0.4,
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
