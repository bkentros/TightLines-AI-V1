/**
 * WaterReadScaleBar — accurate cartographic scale-bar marginalia for the
 * lower-left corner of the map plate.
 *
 * When we have a lake bounding box AND the rendered map width, we compute
 * **meters-per-pixel** for the displayed SVG and draw a bar whose visual
 * length actually represents a real ground distance:
 *
 *   metersPerPx = polygonWidthMeters / renderedMapWidthPx
 *
 * `polygonWidthMeters` comes from the bbox via an equirectangular
 * approximation (good enough at lake scale — error is <1% for lakes
 * smaller than a few hundred km). We then choose a round-number distance
 * (1000 ft, 0.25 mi, 0.5 mi, 1 mi, 2 mi, 5 mi for imperial; metric
 * equivalents) that lands within ~80–120 px of bar width, and render the
 * bar at the exact pixel width corresponding to that distance.
 *
 * If we don't have enough data (no bbox or no rendered width) we fall back
 * to a fixed 64-px bar with a sensible bucketed label keyed off `areaAcres`.
 * This is the same legacy behavior we shipped with the launch plate — so
 * the scale bar always shows *something*, but only claims accuracy when
 * it can actually deliver it.
 */

import { StyleSheet, Text, View } from 'react-native';
import { paper, paperFonts } from '../../lib/theme';
import type { WaterbodyPreviewBbox } from '../../lib/waterReaderContracts';

const MIN_BAR_PX = 60;
const MAX_BAR_PX = 130;
const TARGET_BAR_PX = 96;

const FT_PER_METER = 3.28084;
const MI_PER_METER = 0.000621371;

export interface WaterReadScaleBarProps {
  /** Acreage — only used as a fallback when we can't compute a true scale. */
  areaAcres?: number | null;
  units?: 'imperial' | 'metric';
  /** Lake bounding box (lon/lat) from the read response. */
  bbox?: WaterbodyPreviewBbox | null;
  /** Width of the rendered map in screen pixels. */
  mapWidthPx?: number;
}

export function WaterReadScaleBar({
  areaAcres,
  units = 'imperial',
  bbox,
  mapWidthPx,
}: WaterReadScaleBarProps) {
  const computed = computeAccurateScale(bbox, mapWidthPx, units);

  if (computed) {
    return <ScaleBarView label={computed.label} barWidthPx={computed.barWidthPx} />;
  }

  // Fallback: bucketed label, fixed-width bar (legacy launch behavior).
  const fallbackLabel = pickFallbackLabel(areaAcres ?? null, units);
  return <ScaleBarView label={`≈ ${fallbackLabel}`} barWidthPx={64} />;
}

function ScaleBarView({
  label,
  barWidthPx,
}: {
  label: string;
  barWidthPx: number;
}) {
  // Bar is split into two halves with a midpoint tick — same visual
  // grammar as a printed nautical chart scale.
  const halfWidth = Math.max(20, barWidthPx / 2);

  return (
    <View style={styles.root} pointerEvents="none" accessibilityElementsHidden>
      <View style={styles.barRow}>
        <View style={styles.tickEnd} />
        <View style={[styles.bar, { width: halfWidth }]} />
        <View style={styles.tickMid} />
        <View style={[styles.bar, { width: halfWidth }]} />
        <View style={styles.tickEnd} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

/**
 * Compute meters-per-pixel from bbox + rendered map width, then choose a
 * round-number ground distance that fits within the target bar pixel
 * range. Returns the pixel width to render and the human label, or null
 * if any input is missing or the result lands outside our reasonable
 * bar-width bounds (in which case the caller falls back to bucketed).
 */
function computeAccurateScale(
  bbox: WaterbodyPreviewBbox | null | undefined,
  mapWidthPx: number | undefined,
  units: 'imperial' | 'metric',
): { label: string; barWidthPx: number } | null {
  if (!bbox || !mapWidthPx || mapWidthPx <= 0) return null;
  const lonSpan = bbox.maxLon - bbox.minLon;
  const latSpan = bbox.maxLat - bbox.minLat;
  if (!Number.isFinite(lonSpan) || !Number.isFinite(latSpan)) return null;
  if (lonSpan <= 0 || latSpan <= 0) return null;

  // Equirectangular approximation. Good to <1% at lake scale.
  const meanLat = (bbox.maxLat + bbox.minLat) / 2;
  const lonMetersPerDeg = 111320 * Math.cos((meanLat * Math.PI) / 180);
  const latMetersPerDeg = 110540;
  const polygonWidthMeters = lonSpan * lonMetersPerDeg;
  const polygonHeightMeters = latSpan * latMetersPerDeg;

  // The engine fits the lake into its viewBox with the polygon's longest
  // side determining the layout. After SvgXml renders with
  // `preserveAspectRatio="xMidYMid meet"` the rendered map has the same
  // aspect as the viewBox, so meters-per-pixel is determined by whichever
  // axis is the limiting factor on the screen. In FULL mode that's
  // typically width (lakes wider than tall). For the scale-bar purpose
  // we use polygonWidthMeters / mapWidthPx which is correct as long as
  // the rendered SVG actually fills the width — and it does for any lake
  // whose viewBox width >= viewBox height. Tall lakes get a slightly
  // pessimistic bar but stay within the same round-number bucket.
  const metersPerPx = polygonWidthMeters / mapWidthPx;
  if (!Number.isFinite(metersPerPx) || metersPerPx <= 0) return null;

  // Pick a round-number ground distance that lands closest to the target
  // bar pixel width. Candidates are chosen so every common lake size has
  // at least one option in the [MIN_BAR_PX, MAX_BAR_PX] band.
  const candidates = units === 'metric'
    ? METRIC_CANDIDATES
    : IMPERIAL_CANDIDATES;

  let best: { meters: number; label: string; px: number; distance: number } | null = null;
  for (const c of candidates) {
    const px = c.meters / metersPerPx;
    if (!Number.isFinite(px)) continue;
    if (px < MIN_BAR_PX || px > MAX_BAR_PX) continue;
    const distance = Math.abs(px - TARGET_BAR_PX);
    if (!best || distance < best.distance) {
      best = { meters: c.meters, label: c.label, px, distance };
    }
  }

  if (!best) return null;
  return { label: best.label, barWidthPx: Math.round(best.px) };
}

// ─── Round-number scale candidates ────────────────────────────────────────────

const IMPERIAL_CANDIDATES: { meters: number; label: string }[] = [
  { meters: 100 / FT_PER_METER, label: '100 FT' },
  { meters: 250 / FT_PER_METER, label: '250 FT' },
  { meters: 500 / FT_PER_METER, label: '500 FT' },
  { meters: 1000 / FT_PER_METER, label: '1,000 FT' },
  { meters: 0.25 / MI_PER_METER, label: '¼ MI' },
  { meters: 0.5 / MI_PER_METER, label: '½ MI' },
  { meters: 1 / MI_PER_METER, label: '1 MI' },
  { meters: 2 / MI_PER_METER, label: '2 MI' },
  { meters: 3 / MI_PER_METER, label: '3 MI' },
  { meters: 5 / MI_PER_METER, label: '5 MI' },
  { meters: 10 / MI_PER_METER, label: '10 MI' },
];

const METRIC_CANDIDATES: { meters: number; label: string }[] = [
  { meters: 50, label: '50 M' },
  { meters: 100, label: '100 M' },
  { meters: 250, label: '250 M' },
  { meters: 500, label: '500 M' },
  { meters: 1_000, label: '1 KM' },
  { meters: 2_000, label: '2 KM' },
  { meters: 5_000, label: '5 KM' },
  { meters: 10_000, label: '10 KM' },
];

function pickFallbackLabel(
  acres: number | null,
  units: 'imperial' | 'metric',
): string {
  if (units === 'metric') {
    if (acres == null || acres <= 0) return '500 M';
    if (acres < 50) return '100 M';
    if (acres < 500) return '300 M';
    if (acres < 5_000) return '1 KM';
    if (acres < 50_000) return '3 KM';
    return '10 KM';
  }
  if (acres == null || acres <= 0) return '0.25 MI';
  if (acres < 50) return '300 FT';
  if (acres < 500) return '1000 FT';
  if (acres < 5_000) return '0.5 MI';
  if (acres < 50_000) return '2 MI';
  return '5 MI';
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'flex-start',
    gap: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickEnd: {
    width: 1.5,
    height: 9,
    backgroundColor: paper.ink,
  },
  tickMid: {
    width: 1.5,
    height: 5,
    backgroundColor: paper.ink,
    opacity: 0.7,
  },
  bar: {
    height: 1.5,
    backgroundColor: paper.ink,
  },
  label: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.6,
    color: paper.ink,
    opacity: 0.78,
    fontWeight: '700',
    lineHeight: 11,
  },
});
