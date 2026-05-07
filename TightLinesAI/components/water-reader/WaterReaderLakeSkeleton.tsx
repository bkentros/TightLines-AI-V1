/**
 * WaterReaderLakeSkeleton
 *
 * Renders the actual hydrography polygon as a paper-language "loading the
 * water" placeholder. The polygon endpoint (waterbody-polygon) is fast even
 * when the heavy water-reader-read pipeline is generating an SVG cold, so
 * we paint the real lake shape immediately, clip a stack of soft topographic
 * contour lines to it, and breathe their opacity. When the heavy SVG arrives
 * the parent crossfades in over the same polygon and the spatial frame
 * never jumps.
 *
 * Visual language: ink-stroked silhouette (1.5px) on paper-light fill,
 * inside a paper card. A faint Fraunces eyebrow ("READING THE WATER…") sits
 * above the skeleton; ~5 paper "bones" stand in for the eventual legend rows
 * underneath. The pulse uses native driver — runs at 60fps with no JS work.
 *
 * The polygon transform pipeline (computeSilhouetteTransform / ringToSubpath)
 * is the same one LakePolygonSilhouette uses, so the skeleton, the placeholder
 * silhouette, and any future LakePolygonSilhouette consumer are all aligned
 * without a redundant projection.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Text,
  View,
  StyleSheet,
  type LayoutChangeEvent,
} from 'react-native';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import {
  paper,
  paperBorders,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../../lib/theme';
import {
  ringToSubpath,
  ringsFromGeoJson,
  bboxFromRings,
} from '../../lib/waterReaderSilhouetteMath';
import type { WaterbodyPolygonGeoJson } from '../../lib/waterReaderContracts';

const SKELETON_PAD = 14;

const SKELETON_ASPECT_FALLBACK = 4 / 3;
// Slightly snappier pulse than the launch value (was 2200) — keeps the
// skeleton feeling like the system is actively working without crossing
// over into a UI-spinner cadence.
const PULSE_DURATION_MS = 1800;
// Visibility range for the contour breathing. Bumped a hair so the contours
// register clearly when the read finishes fast (which is most of the time).
const PULSE_LOW = 0.22;
const PULSE_HIGH = 0.52;

const AnimatedG = Animated.createAnimatedComponent(G);

interface WaterReaderLakeSkeletonProps {
  geojson: WaterbodyPolygonGeoJson | null | undefined;
  /**
   * If we know the eventual SVG aspect ratio (width / height) up-front
   * (e.g. once the heavy result has been fetched once) the parent can pass
   * it so the skeleton frames identically and there is no layout jump on
   * crossfade. When omitted we derive it from the polygon bounds.
   */
  aspectRatioOverride?: number;
  /** Top eyebrow caption — defaults to "READING THE WATER…". */
  eyebrow?: string;
  /** Number of legend bone rows to render under the map. Default 5. */
  legendBoneCount?: number;
}

export function WaterReaderLakeSkeleton({
  geojson,
  aspectRatioOverride,
  eyebrow = 'READING THE WATER…',
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
    // Equirectangular adjustment so the skeleton frames at the same aspect
    // the engine SVG will (which also uses a simple lon/lat box at this scale).
    const meanLat = (polygonBounds.minLat + polygonBounds.maxLat) / 2;
    const lonScale = Math.cos((meanLat * Math.PI) / 180);
    const screenLonSpan = lonSpan * lonScale;
    if (screenLonSpan <= 0) return null;
    return screenLonSpan / latSpan;
  }, [polygonBounds]);

  const aspect =
    aspectRatioOverride ?? polygonAspect ?? SKELETON_ASPECT_FALLBACK;
  const height = width > 0 ? Math.max(120, Math.round(width / aspect)) : 0;

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

  // Native-driven opacity breathe on the contour group — slow, editorial,
  // no horizontal motion. Cleans up if the parent unmounts mid-pulse.
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

  // Faint shimmer on the legend bones — same native-driver value, simple
  // breathing. Keeps the bone rows from reading as static dead weight.
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

  // A small set of contour curves to clip inside the polygon. Their geometry
  // is derived from the silhouette frame (not the polygon itself) so we keep
  // the renderer cheap; even on a complex shoreline this is ~7 path nodes.
  const contourPaths = useMemo(() => {
    if (width <= 0 || height <= 0) return [] as string[];
    const count = 6;
    const lines: string[] = [];
    for (let i = 0; i < count; i++) {
      const yBase = (height / (count + 1)) * (i + 1);
      const amplitude = height * 0.06 + i * 1.8;
      const phase = (i % 2 === 0 ? 0 : 1) * (Math.PI / 2);
      const segments = 5;
      const stepX = width / segments;
      const points: string[] = [];
      for (let s = 0; s <= segments; s++) {
        const x = s * stepX;
        const y =
          yBase + Math.sin((s / segments) * Math.PI * 2 + phase) * amplitude;
        points.push(`${s === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      lines.push(points.join(' '));
    }
    return lines;
  }, [width, height]);

  const clipId = useRef(
    `wr-skel-clip-${Math.random().toString(36).slice(2, 11)}`,
  ).current;

  return (
    <View style={styles.root}>
      <View style={styles.eyebrowRow}>
        <View style={styles.eyebrowDot} />
        <Text style={styles.eyebrowText}>{eyebrow}</Text>
      </View>

      <View
        style={[styles.mapFrame, height > 0 && { height }]}
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
                  fill={paper.ink}
                  fillRule="evenodd"
                />
              </ClipPath>
            </Defs>
            {/* Lake fill — paperLight so the silhouette reads as "negative
                space" cut out of the warm card, with an ink hairline shore. */}
            <Path
              d={silhouetteSubpath}
              fill={paper.paperLight}
              fillRule="evenodd"
              stroke={paper.ink}
              strokeWidth={1.4}
            />
            {/* Topographic pulse, clipped to the lake shape. The whole
                contour group breathes its opacity, so individual path nodes
                stay constant and the native driver does all the work. */}
            <AnimatedG
              clipPath={`url(#${clipId})`}
              opacity={pulse}
            >
              <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={paper.paperDark}
                opacity={0.18}
              />
              {contourPaths.map((d, idx) => (
                <Path
                  key={idx}
                  d={d}
                  fill="none"
                  stroke={paper.forestDk}
                  strokeWidth={idx % 2 === 0 ? 1.05 : 0.7}
                  strokeLinecap="round"
                  opacity={idx % 2 === 0 ? 0.42 : 0.28}
                />
              ))}
            </AnimatedG>
          </Svg>
        ) : (
          // Polygon hasn't arrived yet → very calm paper-light field with
          // a centered ink dot pair so the box does not read as broken.
          <View style={styles.preFrame}>
            <View style={styles.preDot} />
            <View style={[styles.preDot, { marginTop: 6 }]} />
          </View>
        )}
      </View>

      <Animated.View
        style={[styles.legendBoneList, { opacity: boneShimmer }]}
      >
        {Array.from({ length: legendBoneCount }).map((_, idx) => (
          <View key={idx} style={styles.legendBoneRow}>
            <View style={styles.legendBoneNumber} />
            <View style={styles.legendBoneSwatch} />
            <View style={styles.legendBoneTextStack}>
              <View style={styles.legendBoneTitle} />
              <View
                style={[
                  styles.legendBoneSubtitle,
                  { width: idx % 2 === 0 ? '76%' : '92%' },
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
  root: {
    width: '100%',
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    ...paperBorders.card,
    ...paperShadows.hard,
    gap: paperSpacing.md,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: paper.red,
  },
  eyebrowText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.6,
    color: paper.ink,
    fontWeight: '700',
  },
  mapFrame: {
    width: '100%',
    backgroundColor: paper.paper,
    borderWidth: 1,
    borderColor: paper.inkHair,
    borderRadius: paperRadius.card - 2,
    overflow: 'hidden',
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preFrame: {
    width: '100%',
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: paper.inkHair,
  },
  legendBoneList: {
    width: '100%',
    gap: paperSpacing.xs + 2,
  },
  legendBoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  legendBoneNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: paper.inkHair,
    backgroundColor: paper.paper,
  },
  legendBoneSwatch: {
    width: 8,
    height: 14,
    borderRadius: 2,
    backgroundColor: paper.inkHair,
    opacity: 0.55,
  },
  legendBoneTextStack: {
    flex: 1,
    gap: 4,
  },
  legendBoneTitle: {
    height: 10,
    width: '60%',
    backgroundColor: paper.inkHair,
    borderRadius: 2,
    opacity: 0.5,
  },
  legendBoneSubtitle: {
    height: 8,
    backgroundColor: paper.inkHair,
    borderRadius: 2,
    opacity: 0.32,
  },
});
