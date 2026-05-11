/**
 * WaterReaderLakeSkeleton
 *
 * Pass-8 rewrite — the skeleton now renders the SAME outer chrome as the
 * production map plate (viewer toolbar placeholders, plate frame with tan
 * land background, meta ribbon, paired legend card with bone rows). The
 * only thing that changes when the heavy read resolves is the SVG inside
 * the plate — not the surrounding card structure — so the
 * "wig out" between reading and ready states is eliminated. Layout
 * dimensions, padding, borders, colors all match WaterReaderMapCard's
 * ready-state chrome.
 *
 * The lake silhouette uses the same gradient water + ink shoreline as the
 * eventual paperified SVG, with a soft contour pulse breathing inside the
 * polygon. When the heavy read arrives, WaterReaderMapCard swaps from
 * this skeleton to WaterReaderProductionMap inside the same plate — the
 * eye sees the lake refine rather than the page redraw.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import {
  ringToSubpath,
  ringsFromGeoJson,
  bboxFromRings,
} from '../../lib/waterReaderSilhouetteMath';
import type { WaterbodyPolygonGeoJson } from '../../lib/waterReaderContracts';

// Land color + lake gradient stops mirror the SVG paperify pipeline so the
// skeleton reads as "the same plate, lake not yet drawn in detail".
const LAND_BASE = '#EFE4C8';
const WATER_TOP = '#D9F1FB';
const WATER_MID = '#BFE4F3';
const WATER_BOTTOM = '#9FD2E7';

const SKELETON_PAD = 28; // matches the viewBox padding the SVG uses (~12%)
const SKELETON_ASPECT_FALLBACK = 4 / 3;
const PULSE_DURATION_MS = 1800;
const PULSE_LOW = 0.22;
const PULSE_HIGH = 0.52;

const AnimatedG = Animated.createAnimatedComponent(G);

interface WaterReaderLakeSkeletonProps {
  geojson: WaterbodyPolygonGeoJson | null | undefined;
  /** Number of legend bone rows to render under the map. Default 5. */
  legendBoneCount?: number;
}

export function WaterReaderLakeSkeleton({
  geojson,
  legendBoneCount = 5,
}: WaterReaderLakeSkeletonProps) {
  const [width, setWidth] = useState(0);
  const onMapLayout = (event: LayoutChangeEvent) => {
    const next = Math.floor(event.nativeEvent.layout.width);
    if (next > 0 && next !== width) setWidth(next);
  };

  const polygonBounds = useMemo(() => {
    if (!geojson) return null;
    const rings = ringsFromGeoJson(geojson);
    if (rings.length === 0) return null;
    return bboxFromRings(rings);
  }, [geojson]);

  const polygonAspect = useMemo(() => {
    if (!polygonBounds) return null;
    const lonSpan = Math.max(polygonBounds.maxLon - polygonBounds.minLon, 1e-9);
    const latSpan = Math.max(polygonBounds.maxLat - polygonBounds.minLat, 1e-9);
    const meanLat = (polygonBounds.minLat + polygonBounds.maxLat) / 2;
    const lonScale = Math.cos((meanLat * Math.PI) / 180);
    const screenLonSpan = lonSpan * lonScale;
    if (screenLonSpan <= 0) return null;
    return screenLonSpan / latSpan;
  }, [polygonBounds]);

  const aspect = polygonAspect ?? SKELETON_ASPECT_FALLBACK;
  // Match the production map's fitHeight floor so the plate is the same
  // height in both states (no layout jump).
  const height = width > 0 ? Math.max(380, Math.round(width / aspect)) : 380;

  const silhouetteSubpath = useMemo(() => {
    if (!geojson || !polygonBounds || width <= 0 || height <= 0) return null;
    const innerW = width - 2 * SKELETON_PAD;
    const innerH = height - 2 * SKELETON_PAD;
    if (innerW <= 0 || innerH <= 0) return null;
    const lonSpan = Math.max(polygonBounds.maxLon - polygonBounds.minLon, 1e-9);
    const latSpan = Math.max(polygonBounds.maxLat - polygonBounds.minLat, 1e-9);
    const scale = Math.min(innerW / lonSpan, innerH / latSpan);
    const drawW = lonSpan * scale;
    const drawH = latSpan * scale;
    const originX = SKELETON_PAD + (innerW - drawW) / 2;
    const originY = SKELETON_PAD + (innerH - drawH) / 2;
    const rings = ringsFromGeoJson(geojson);
    const parts: string[] = [];
    for (const ring of rings) {
      const sub = ringToSubpath(
        ring,
        polygonBounds.minLon,
        polygonBounds.maxLat,
        scale,
        originX,
        originY,
      );
      if (sub) parts.push(sub);
    }
    return parts.length > 0 ? parts.join(' ') : null;
  }, [geojson, polygonBounds, width, height]);

  const pulse = useRef(new Animated.Value(PULSE_LOW)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: PULSE_HIGH,
          duration: PULSE_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: PULSE_LOW,
          duration: PULSE_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const boneShimmer = useRef(new Animated.Value(0.55)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(boneShimmer, {
          toValue: 0.85,
          duration: PULSE_DURATION_MS + 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(boneShimmer, {
          toValue: 0.55,
          duration: PULSE_DURATION_MS + 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [boneShimmer]);

  const contourPaths = useMemo(() => {
    if (width <= 0 || height <= 0) return [] as string[];
    const count = 6;
    const lines: string[] = [];
    for (let i = 0; i < count; i += 1) {
      const yBase = (height / (count + 1)) * (i + 1);
      const amplitude = height * 0.06 + i * 1.8;
      const phase = (i % 2 === 0 ? 0 : 1) * (Math.PI / 2);
      const segments = 5;
      const stepX = width / segments;
      const points: string[] = [];
      for (let s = 0; s <= segments; s += 1) {
        const x = s * stepX;
        const y = yBase + Math.sin((s / segments) * Math.PI * 2 + phase) * amplitude;
        points.push(`${s === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      lines.push(points.join(' '));
    }
    return lines;
  }, [width, height]);

  const gradientId = useRef(
    `wr-skel-water-${Math.random().toString(36).slice(2, 11)}`,
  ).current;
  const clipId = useRef(
    `wr-skel-clip-${Math.random().toString(36).slice(2, 11)}`,
  ).current;

  return (
    <View style={styles.outer}>
      {/* ── Plate shell — matches WaterReaderMapCard ready-state chrome ── */}
      <View style={styles.mapCard}>
        <View style={styles.viewerToolbar}>
          <View style={[styles.viewerChip, styles.viewerChipActive]}>
            <Ionicons name="scan-outline" size={11} color="#FFFFFF" />
            <Text style={[styles.viewerChipText, styles.viewerChipTextActive]}>
              FULL
            </Text>
          </View>
          <View style={styles.viewerChip}>
            <Ionicons name="move-outline" size={11} color={paper.dashboardInk} />
            <Text style={styles.viewerChipText}>DETAIL</Text>
          </View>
        </View>

        <View style={styles.plateOuter}>
          <View
            style={[styles.plateInner, height > 0 && { height }]}
            onLayout={onMapLayout}
          >
            {width > 0 && height > 0 && silhouetteSubpath ? (
              <Svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
              >
                <Defs>
                  <ClipPath id={clipId}>
                    <Path
                      d={silhouetteSubpath}
                      fill={paper.dashboardInk}
                      fillRule="evenodd"
                    />
                  </ClipPath>
                  <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={WATER_TOP} />
                    <Stop offset="52%" stopColor={WATER_MID} />
                    <Stop offset="100%" stopColor={WATER_BOTTOM} />
                  </LinearGradient>
                </Defs>

                {/* Lake fill with the same blue gradient as the eventual SVG. */}
                <Path
                  d={silhouetteSubpath}
                  fill={`url(#${gradientId})`}
                  fillRule="evenodd"
                  stroke={paper.dashboardInk}
                  strokeWidth={1.95}
                />

                {/* Topographic pulse, clipped inside the lake. */}
                <AnimatedG clipPath={`url(#${clipId})`} opacity={pulse}>
                  <Rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill={WATER_MID}
                    opacity={0.18}
                  />
                  {contourPaths.map((d, idx) => (
                    <Path
                      key={idx}
                      d={d}
                      fill="none"
                      stroke={paper.dashboardBlue}
                      strokeWidth={idx % 2 === 0 ? 1.05 : 0.7}
                      strokeLinecap="round"
                      opacity={idx % 2 === 0 ? 0.42 : 0.28}
                    />
                  ))}
                </AnimatedG>
              </Svg>
            ) : (
              <View style={styles.preFrame}>
                <Animated.View style={[styles.preDot, { opacity: pulse }]} />
                <Animated.View
                  style={[styles.preDot, { marginTop: 6, opacity: pulse }]}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.metaRibbon}>
          <View style={styles.metaRibbonRule} />
          <View style={styles.metaRibbonRow}>
            <Text style={styles.metaRibbonText}>BUILDING WATER READ…</Text>
          </View>
          <View style={styles.metaRibbonRule} />
        </View>
      </View>

      {/* ── Legend card — matches WaterReaderLegend chrome ── */}
      <Animated.View
        style={[styles.legendCard, { opacity: boneShimmer }]}
      >
        <View style={styles.legendMasthead}>
          <View style={styles.legendMastheadLeft}>
            <View style={styles.legendBoneEyebrow} />
            <View style={styles.legendBoneTitle} />
          </View>
          <View style={styles.legendBoneSeasonBadge} />
        </View>
        <View style={styles.legendMastheadRule} />
        {Array.from({ length: legendBoneCount }).map((_, idx) => (
          <View
            key={idx}
            style={[styles.legendBoneRow, idx > 0 && styles.legendBoneRowDivider]}
          >
            <View style={styles.legendBoneNumber} />
            <View style={styles.legendBoneSwatch} />
            <View style={styles.legendBoneTextStack}>
              <View style={styles.legendBoneTypeTag} />
              <View style={styles.legendBoneTitleLine} />
              <View
                style={[
                  styles.legendBoneBodyLine,
                  { width: idx % 2 === 0 ? '92%' : '78%' },
                ]}
              />
              <View
                style={[
                  styles.legendBoneBodyLine,
                  { width: idx % 2 === 0 ? '64%' : '88%' },
                ]}
              />
            </View>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    gap: paperSpacing.md,
  },

  // ── Plate card — copies WaterReaderMapCard.mapCard exactly ──────────────
  mapCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
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
    backgroundColor: LAND_BASE,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.dashboardHair,
  },
  preFrame: {
    width: '100%',
    flex: 1,
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: paper.dashboardBlue,
  },
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

  // ── Legend bone card — copies WaterReaderLegend.root chrome ─────────────
  legendCard: {
    width: '100%',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    gap: paperSpacing.sm,
  },
  legendMasthead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
  },
  legendMastheadLeft: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  legendBoneEyebrow: {
    height: 9,
    width: '50%',
    backgroundColor: paper.dashboardHair,
    borderRadius: 2,
    opacity: 0.7,
  },
  legendBoneTitle: {
    height: 18,
    width: '36%',
    backgroundColor: paper.dashboardHair,
    borderRadius: 3,
  },
  legendBoneSeasonBadge: {
    width: 70,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: '#FAFAF7',
  },
  legendMastheadRule: {
    height: 2,
    backgroundColor: paper.dashboardInk,
    opacity: 0.18,
  },
  legendBoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm + 4,
    paddingHorizontal: paperSpacing.xs,
  },
  legendBoneRowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardHair,
  },
  legendBoneNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: '#FAFAF7',
  },
  legendBoneSwatch: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: paper.dashboardHair,
    opacity: 0.6,
  },
  legendBoneTextStack: {
    flex: 1,
    gap: 6,
    paddingTop: 1,
  },
  legendBoneTypeTag: {
    height: 8,
    width: '32%',
    backgroundColor: paper.dashboardHair,
    borderRadius: 2,
    opacity: 0.6,
  },
  legendBoneTitleLine: {
    height: 14,
    width: '62%',
    backgroundColor: paper.dashboardHair,
    borderRadius: 2,
    opacity: 0.8,
  },
  legendBoneBodyLine: {
    height: 9,
    backgroundColor: paper.dashboardHair,
    borderRadius: 2,
    opacity: 0.45,
  },
});
