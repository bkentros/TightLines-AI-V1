/**
 * Minimal hydrography silhouette (Polygon / MultiPolygon).
 * Interior rings (holes) use SVG even-odd fill when multiple subpaths are present.
 * Limitation: complex or self-intersecting rings may render incorrectly; see even-odd caveats in SVG spec.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { colors } from '../../lib/theme';
import { computeRenderedLakePatches } from '../../lib/waterReaderLakeZoneLayout';
import type { WaterbodyPolygonGeoJson, WaterReaderGeometryCandidate } from '../../lib/waterReaderContracts';
import {
  computeSilhouetteTransform,
  LAKE_SILHOUETTE,
  ringToSubpath,
  ringsFromGeoJson,
} from '../../lib/waterReaderSilhouetteMath';

const { CANVAS_H } = LAKE_SILHOUETTE;

/** Soft lake fill; land is the card background around the SVG. */
const LAKE_FILL = 'rgba(43, 126, 181, 0.42)';
const SHORE_STROKE = 'rgba(37, 61, 44, 0.45)';
const STROKE_W = 1.25;
const PATCH_STROKE_W = 1.05;

/**
 * react-native-svg: ClipPath geometry without opaque fill often produces an empty clip region,
 * which hides all clipped children (common on-device symptom: silhouettes ok, zones missing).
 */
const CLIP_PATH_FILL = '#FFFFFF';

export type LakeZoneLayoutPayload = {
  layoutReady: boolean;
  renderedCandidateIds: number[];
};

function useSilhouetteSvg(
  geojson: WaterbodyPolygonGeoJson | null | undefined,
  width: number,
): { path: string | null; transform: ReturnType<typeof computeSilhouetteTransform> } {
  return useMemo(() => {
    if (!geojson || width <= 0) return { path: null, transform: null };
    const transform = computeSilhouetteTransform(geojson, width);
    if (!transform) return { path: null, transform: null };
    const rings = ringsFromGeoJson(geojson);
    const { minLon, maxLat, scale, originX, originY } = transform;
    const parts: string[] = [];
    for (const ring of rings) {
      const sub = ringToSubpath(ring, minLon, maxLat, scale, originX, originY);
      if (sub) parts.push(sub);
    }
    const path = parts.length > 0 ? parts.join(' ') : null;
    return { path, transform };
  }, [geojson, width]);
}

export function LakePolygonSilhouette({
  geojson,
  candidates = [],
  areaAcres,
  onZoneLayoutChange,
}: {
  geojson: WaterbodyPolygonGeoJson | null | undefined;
  candidates?: WaterReaderGeometryCandidate[];
  areaAcres?: number | null;
  onZoneLayoutChange?: (payload: LakeZoneLayoutPayload) => void;
}) {
  const [w, setW] = useState(0);
  const clipId = useRef(`wrLakeClip_${Math.random().toString(36).slice(2, 11)}`).current;
  const onLayout = (e: LayoutChangeEvent) => {
    const nw = Math.floor(e.nativeEvent.layout.width);
    if (nw > 0 && nw !== w) setW(nw);
  };
  const { path, transform } = useSilhouetteSvg(geojson, w);
  const patches = useMemo(() => {
    const { patches: z } = computeRenderedLakePatches(candidates, transform, w, CANVAS_H, geojson ?? null, areaAcres);
    return z;
  }, [candidates, transform, w, geojson, areaAcres]);

  useEffect(() => {
    if (!onZoneLayoutChange) return;
    if (!path || w <= 0) {
      onZoneLayoutChange({ layoutReady: false, renderedCandidateIds: [] });
      return;
    }
    onZoneLayoutChange({ layoutReady: true, renderedCandidateIds: patches.map((z) => z.candidateId) });
  }, [onZoneLayoutChange, path, w, patches]);

  return (
    <View style={styles.wrap}>
      <View style={styles.frame} onLayout={onLayout}>
        {w > 0 && path ? (
          <Svg width={w} height={CANVAS_H} viewBox={`0 0 ${w} ${CANVAS_H}`}>
            <Defs>
              <ClipPath id={clipId}>
                <Path d={path} fill={CLIP_PATH_FILL} fillRule="evenodd" />
              </ClipPath>
            </Defs>
            <Path d={path} fill={LAKE_FILL} stroke={SHORE_STROKE} strokeWidth={STROKE_W} fillRule="evenodd" />
            <G clipPath={`url(#${clipId})`}>
              {patches.map((z) =>
                z.zonePathD ? (
                  <Path
                    key={`z-${z.candidateId}`}
                    d={z.zonePathD}
                    fill={z.fill}
                    stroke={z.stroke}
                    strokeWidth={z.featureClass === 'neckdown' ? 1.15 : PATCH_STROKE_W}
                    fillOpacity={z.featureClass === 'neckdown' ? 0.3 : 0.46}
                  />
                ) : null,
              )}
            </G>
          </Svg>
        ) : (
          <View style={styles.fallback} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', width: '100%' },
  frame: {
    alignSelf: 'stretch',
    width: '100%',
    height: CANVAS_H,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.backgroundAlt,
  },
  fallback: { flex: 1, minHeight: CANVAS_H, backgroundColor: colors.backgroundAlt },
});
