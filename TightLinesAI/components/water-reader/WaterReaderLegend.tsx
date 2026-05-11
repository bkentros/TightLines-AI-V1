/**
 * WaterReaderLegend
 *
 * Paper-language legend rendered in React from `legendEntries` returned by
 * the water-reader-read edge function. Replaces the engine's embedded
 * "Map Key" SVG panel.
 *
 * Renovation (scan-v5):
 *   • Masthead band — Fraunces "Map Key" wordmark, season badge, hint
 *     line ("Reads tuned for the season above") so the season carries from
 *     the page header into the legend without repeating it on every row.
 *   • Mini-SVG pattern swatches — every row's color block carries the same
 *     pattern stamp as its zone in the map (dots / waves / hatch / rings /
 *     …), making swatch ↔ zone identification unmistakable.
 *   • Body copy — sourced from `waterReaderLegendTemplates`, picking
 *     deterministically by `zoneId + season + featureClass` so each lake
 *     reads original. The engine `entry.body` is used as a fallback if
 *     a feature class isn't in the template table.
 *   • Colophon footer — pressed-date + FinFindr signature mirroring the
 *     map-card colophon for visual continuity.
 *
 * The component is purely presentational — no state, no fetching. Rows are
 * `React.memo`'d so a tap doesn't cascade re-renders through 8–9 rows.
 */

import { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  Path,
  Pattern,
  Rect,
} from 'react-native-svg';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import {
  PAPER_WARM_FEATURE_COLORS,
  PAPER_WARM_FEATURE_MOTIF_COLORS,
  paperWarmColorForFeature,
  type PaperWarmFeatureKey,
} from '../../lib/waterReaderZonePaperPalette';
import {
  pickLegendBody,
} from '../../lib/waterReaderLegendTemplates';
import type {
  WaterReaderProductionSvgFeatureClass,
  WaterReaderProductionSvgLegendEntry,
} from '../../lib/waterReaderContracts';

const CONFLUENCE_ACCENT = PAPER_WARM_FEATURE_COLORS.structure_confluence;

export interface WaterReaderLegendProps {
  entries: WaterReaderProductionSvgLegendEntry[];
  season?: string;
  selectedNumber?: number | string | null;
  onSelectNumber?: (number: number | string | null) => void;
}

export function WaterReaderLegend({
  entries,
  season,
  selectedNumber,
  onSelectNumber,
}: WaterReaderLegendProps) {
  if (!entries || entries.length === 0) return null;

  const seasonLabel = season ? season.toLowerCase() : null;
  const seasonStyle = seasonLabel ? seasonBadgeStyle(seasonLabel) : null;
  const pressedDate = useMemo(() => formatPressedDate(), []);

  return (
    <View style={styles.root}>
      {/* ── Masthead ───────────────────────────────────────────────────── */}
      <View style={styles.masthead}>
        <View style={styles.mastheadTop}>
          <View style={styles.mastheadLeft}>
            <Text style={styles.mastheadEyebrow}>FINFINDR · WATER READ</Text>
            <Text style={styles.mastheadTitle} allowFontScaling={false}>
              Map Key<Text style={styles.mastheadTitleDot}>.</Text>
            </Text>
          </View>
          {seasonLabel && seasonStyle ? (
            <View
              style={[
                styles.seasonBadge,
                {
                  backgroundColor: seasonStyle.backgroundColor,
                  borderColor: seasonStyle.borderColor,
                },
              ]}
            >
              <Text style={styles.seasonBadgeEyebrow}>SEASON</Text>
              <Text style={[styles.seasonBadgeText, { color: seasonStyle.color }]}>
                {seasonLabel.toUpperCase()}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.mastheadRule} />
        <View style={styles.mastheadMeta}>
          <Text style={styles.mastheadCount}>
            {entries.length}{' '}
            {entries.length === 1 ? 'STRUCTURE' : 'STRUCTURES'}
          </Text>
          <Text style={styles.mastheadDot}>·</Text>
          <Text style={styles.mastheadHint} numberOfLines={2}>
            Notes tuned for the season above.
          </Text>
        </View>
      </View>

      {/* ── Rows ───────────────────────────────────────────────────────── */}
      <View style={styles.list}>
        {entries.map((entry, idx) => (
          <LegendRow
            key={`${entry.number ?? entry.zoneId}-${entry.zoneIds.join('|')}`}
            entry={entry}
            season={season}
            isFirst={idx === 0}
            selected={selectedNumber != null && String(selectedNumber) === String(entry.number)}
            onSelectNumber={onSelectNumber}
          />
        ))}
      </View>

      {/* ── Colophon ──────────────────────────────────────────────────── */}
      <View style={styles.colophon}>
        <View style={styles.colophonRule} />
        <View style={styles.colophonRow}>
          <Text style={styles.colophonLeft} numberOfLines={1}>
            POLYGON ONLY · BETA READ
          </Text>
          <Text style={styles.colophonRight} numberOfLines={1}>
            {pressedDate}
          </Text>
        </View>
        <Text style={styles.colophonNote}>
          Read the zones as a starting point, not the last word.
        </Text>
      </View>
    </View>
  );
}

interface LegendRowProps {
  entry: WaterReaderProductionSvgLegendEntry;
  season?: string;
  isFirst: boolean;
  selected: boolean;
  onSelectNumber?: (n: number | string | null) => void;
}

const LegendRow = memo(function LegendRow({
  entry,
  season,
  isFirst,
  selected,
  onSelectNumber,
}: LegendRowProps) {
  const featureKey = entry.isConfluence
    ? 'structure_confluence'
    : entry.featureClass;
  const paletteColor = paperWarmColorForFeature(featureKey);
  const accent = paletteColor ?? entry.colorHex ?? paper.dashboardInk;
  const typeTag = structureTypeTag(featureKey);
  const titleParts = splitLegendTitle(entry.title);

  const body = useMemo(
    () =>
      pickLegendBody({
        featureClass: (entry.isConfluence
          ? 'structure_confluence'
          : entry.featureClass) as WaterReaderProductionSvgFeatureClass,
        season,
        zoneId: entry.zoneId,
        fallbackBody: entry.body,
      }),
    [entry.body, entry.featureClass, entry.isConfluence, entry.zoneId, season],
  );

  const handlePress = useCallback(() => {
    if (!onSelectNumber) return;
    onSelectNumber(selected ? null : entry.number ?? null);
  }, [onSelectNumber, selected, entry.number]);

  return (
    <Pressable
      style={[
        styles.row,
        !isFirst && styles.rowDivider,
        selected && styles.rowSelected,
      ]}
      onPress={onSelectNumber ? handlePress : undefined}
      disabled={!onSelectNumber}
      accessibilityRole={onSelectNumber ? 'button' : undefined}
      accessibilityState={{ selected }}
    >
      {/* Number ring — mirrors the SVG callout glyph exactly. */}
      <View
        style={[
          styles.numberRing,
          selected && styles.numberRingSelected,
        ]}
      >
        <Text
          style={[styles.numberText, selected && styles.numberTextSelected]}
          allowFontScaling={false}
        >
          {entry.number ?? '·'}
        </Text>
      </View>

      {/* Pattern swatch — mirrors the SVG zone fill so swatch ↔ zone is
          unmistakable. The same motif logic lives in
          `lib/water-reader-paperify-svg.ts`. */}
      <ZonePatternSwatch
        featureKey={(featureKey ?? 'universal') as PaperWarmFeatureKey}
        accentFallback={accent}
      />

      <View style={styles.copyColumn}>
        {typeTag ? (
          <Text
            style={[
              styles.typeTag,
              entry.isConfluence && { color: CONFLUENCE_ACCENT },
            ]}
            numberOfLines={1}
          >
            {typeTag}
          </Text>
        ) : null}
        <Text style={styles.title} numberOfLines={3}>
          <Text style={styles.titleHead}>{titleParts.head}</Text>
          {titleParts.tail ? (
            <Text style={styles.titleTail}>
              {' — '}
              {titleParts.tail}
            </Text>
          ) : null}
        </Text>
        <Text style={styles.body} numberOfLines={8}>
          {body}
        </Text>
        {entry.transitionWarning ? (
          <View style={styles.transitionChip}>
            <Text style={styles.transitionGlyph}>◐</Text>
            <Text style={styles.transitionText}>
              {entry.transitionWarning}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
});

// ─── Pattern swatch ──────────────────────────────────────────────────────────

interface ZonePatternSwatchProps {
  featureKey: PaperWarmFeatureKey;
  accentFallback: string;
}

const SWATCH_SIZE = 30;

/**
 * Render a tiny SVG that mirrors the zone's pattern in the map. We use
 * `react-native-svg` (already a project dep — no new packages) and define
 * the same motif inline as `<Pattern>` in `<Defs>`, then fill a `<Rect>`.
 */
const ZonePatternSwatch = memo(function ZonePatternSwatch({
  featureKey,
  accentFallback,
}: ZonePatternSwatchProps) {
  const base =
    PAPER_WARM_FEATURE_COLORS[featureKey] ?? accentFallback;
  const motif =
    PAPER_WARM_FEATURE_MOTIF_COLORS[featureKey] ?? 'rgba(28,36,25,0.55)';
  const patternId = `swatch-${featureKey}`;

  return (
    <View style={styles.swatchWrap}>
      <Svg width={SWATCH_SIZE} height={SWATCH_SIZE}>
        <Defs>{renderSwatchPattern(featureKey, base, motif, patternId)}</Defs>
        <Rect width={SWATCH_SIZE} height={SWATCH_SIZE} fill={`url(#${patternId})`} />
        {/* Hairline ink frame so the swatch reads as a hand-pressed chip. */}
        <Rect
          x={0.5}
          y={0.5}
          width={SWATCH_SIZE - 1}
          height={SWATCH_SIZE - 1}
          fill="none"
          stroke="rgba(0,0,0,0.22)"
          strokeWidth={1}
        />
      </Svg>
    </View>
  );
});

function renderSwatchPattern(
  key: PaperWarmFeatureKey,
  base: string,
  motif: string,
  id: string,
) {
  switch (key) {
    case 'main_lake_point':
      return (
        <Pattern id={id} width={12} height={12} patternUnits="userSpaceOnUse">
          <Rect width={12} height={12} fill={base} />
          <Circle cx={3} cy={3} r={1.3} fill={motif} />
          <Circle cx={9} cy={9} r={1.3} fill={motif} />
          <Circle cx={3} cy={9} r={0.7} fill={motif} opacity={0.6} />
          <Circle cx={9} cy={3} r={0.7} fill={motif} opacity={0.6} />
        </Pattern>
      );
    case 'secondary_point':
      return (
        <Pattern
          id={id}
          width={10}
          height={10}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <Rect width={10} height={10} fill={base} />
          <Line x1={0} y1={2} x2={10} y2={2} stroke={motif} strokeWidth={1.2} />
          <Line x1={0} y1={6} x2={10} y2={6} stroke={motif} strokeWidth={0.7} opacity={0.7} />
        </Pattern>
      );
    case 'cove':
      return (
        <Pattern id={id} width={18} height={10} patternUnits="userSpaceOnUse">
          <Rect width={18} height={10} fill={base} />
          <Path d="M 0 5 Q 4.5 1 9 5 T 18 5" fill="none" stroke={motif} strokeWidth={0.9} />
          <Path d="M 0 9 Q 4.5 5 9 9 T 18 9" fill="none" stroke={motif} strokeWidth={0.7} opacity={0.6} />
        </Pattern>
      );
    case 'neck':
      return (
        <Pattern id={id} width={10} height={10} patternUnits="userSpaceOnUse">
          <Rect width={10} height={10} fill={base} />
          <Line x1={2} y1={0} x2={2} y2={10} stroke={motif} strokeWidth={1.4} />
          <Line x1={6} y1={0} x2={6} y2={10} stroke={motif} strokeWidth={0.7} opacity={0.65} />
        </Pattern>
      );
    case 'island':
      return (
        <Pattern id={id} width={10} height={10} patternUnits="userSpaceOnUse">
          <Rect width={10} height={10} fill={base} />
          <Line x1={0} y1={0} x2={10} y2={10} stroke={motif} strokeWidth={0.9} />
          <Line x1={10} y1={0} x2={0} y2={10} stroke={motif} strokeWidth={0.9} />
        </Pattern>
      );
    case 'saddle':
      return (
        <Pattern id={id} width={14} height={10} patternUnits="userSpaceOnUse">
          <Rect width={14} height={10} fill={base} />
          <Path
            d="M 0 8 L 3.5 3 L 7 8 L 10.5 3 L 14 8"
            fill="none"
            stroke={motif}
            strokeWidth={1}
          />
        </Pattern>
      );
    case 'dam':
      return (
        <Pattern id={id} width={14} height={10} patternUnits="userSpaceOnUse">
          <Rect width={14} height={10} fill={base} />
          <Rect x={0.6} y={0.6} width={6} height={3.4} fill="none" stroke={motif} strokeWidth={0.9} />
          <Rect x={7.4} y={0.6} width={6} height={3.4} fill="none" stroke={motif} strokeWidth={0.9} />
          <Rect x={-2.6} y={5.4} width={6} height={3.4} fill="none" stroke={motif} strokeWidth={0.9} />
          <Rect x={4.2} y={5.4} width={6} height={3.4} fill="none" stroke={motif} strokeWidth={0.9} />
          <Rect x={11} y={5.4} width={6} height={3.4} fill="none" stroke={motif} strokeWidth={0.9} />
        </Pattern>
      );
    case 'structure_confluence':
      return (
        <Pattern id={id} width={16} height={16} patternUnits="userSpaceOnUse">
          <Rect width={16} height={16} fill={base} />
          <Circle cx={8} cy={8} r={5} fill="none" stroke={motif} strokeWidth={0.9} />
          <Circle cx={8} cy={8} r={2.5} fill="none" stroke={motif} strokeWidth={0.7} opacity={0.7} />
          <Circle cx={8} cy={8} r={0.9} fill={motif} />
        </Pattern>
      );
    case 'universal':
    default:
      return (
        <Pattern id={id} width={14} height={14} patternUnits="userSpaceOnUse">
          <Rect width={14} height={14} fill={base} />
          <Circle cx={3.5} cy={3.5} r={0.95} fill="none" stroke={motif} strokeWidth={0.7} />
          <Circle cx={10.5} cy={10.5} r={0.95} fill="none" stroke={motif} strokeWidth={0.7} />
        </Pattern>
      );
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function structureTypeTag(featureKey: string | undefined): string {
  switch (featureKey) {
    case 'main_lake_point': return 'MAIN POINT';
    case 'secondary_point': return 'POINT';
    case 'cove': return 'COVE';
    case 'neck': return 'NECK';
    case 'island': return 'ISLAND';
    case 'saddle': return 'SADDLE';
    case 'dam': return 'DAM';
    case 'structure_confluence': return 'CONFLUENCE';
    case 'universal': return 'POND';
    default: return 'STRUCTURE';
  }
}

function seasonBadgeStyle(season: string): {
  backgroundColor: string;
  borderColor: string;
  color: string;
} {
  switch (season.toLowerCase()) {
    case 'summer':
      return {
        backgroundColor: 'rgba(66, 232, 157, 0.22)',
        borderColor: 'rgba(45, 168, 95, 0.42)',
        color: '#1F7A45',
      };
    case 'fall':
    case 'autumn':
      return {
        backgroundColor: 'rgba(255, 138, 42, 0.22)',
        borderColor: 'rgba(255, 138, 42, 0.46)',
        color: '#9A4E12',
      };
    case 'winter':
      return {
        backgroundColor: 'rgba(40, 200, 255, 0.22)',
        borderColor: 'rgba(42, 110, 150, 0.40)',
        color: paper.dashboardBlue,
      };
    case 'spring':
    default:
      return {
        backgroundColor: 'rgba(185, 242, 77, 0.28)',
        borderColor: 'rgba(61, 168, 95, 0.38)',
        color: '#2E7A43',
      };
  }
}

function splitLegendTitle(title: string): { head: string; tail: string | null } {
  const idx = title.indexOf(' - ');
  if (idx <= 0) return { head: title, tail: null };
  return { head: title.slice(0, idx), tail: title.slice(idx + 3) };
}

function formatPressedDate(): string {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  return `SCANNED · ${month} ${now.getDate()} · ${now.getFullYear()}`;
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    gap: paperSpacing.sm,
  },

  // ── Masthead ────────────────────────────────────────────────────────────
  masthead: {
    gap: 8,
  },
  mastheadTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
  },
  mastheadLeft: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  mastheadEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.7,
    color: paper.dashboardMuted,
    lineHeight: 12,
  },
  mastheadTitle: {
    fontFamily: paperFonts.display,
    fontWeight: '700',
    fontSize: 22,
    color: paper.dashboardInk,
    letterSpacing: 0,
    lineHeight: 24,
    marginTop: 1,
  },
  mastheadTitleDot: {
    color: paper.dashboardBlue,
  },
  seasonBadge: {
    minWidth: 76,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    gap: 1,
  },
  seasonBadgeEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
    lineHeight: 9,
  },
  seasonBadgeText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 1.6,
    lineHeight: 14,
  },
  mastheadRule: {
    height: 2,
    backgroundColor: paper.dashboardInk,
    opacity: 0.85,
  },
  mastheadMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  mastheadCount: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: paper.dashboardInk,
  },
  mastheadDot: {
    fontFamily: paperFonts.body,
    fontSize: 11,
    color: paper.dashboardMuted,
  },
  mastheadHint: {
    flex: 1,
    minWidth: 0,
    fontFamily: paperFonts.body,
    fontSize: 11,
    fontStyle: 'italic',
    color: paper.dashboardMuted,
    lineHeight: 14,
  },

  // ── Rows ────────────────────────────────────────────────────────────────
  list: { gap: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm + 4,
    paddingHorizontal: paperSpacing.xs,
    borderRadius: 8,
  },
  rowSelected: {
    backgroundColor: '#E8F2FA',
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardHair,
  },
  numberRing: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: '#FAFAF7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  numberRingSelected: {
    backgroundColor: paper.dashboardInk,
    borderColor: paper.dashboardInk,
  },
  numberText: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 12,
    color: paper.dashboardInk,
    lineHeight: 14,
  },
  numberTextSelected: {
    color: '#FFFFFF',
  },
  swatchWrap: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    marginTop: 1,
    overflow: 'hidden',
    borderRadius: 4,
  },
  copyColumn: {
    flex: 1,
    minWidth: 0,
    gap: 4,
    paddingTop: 1,
  },
  typeTag: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.5,
    color: paper.dashboardMuted,
    marginBottom: 1,
    lineHeight: 12,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 14.5,
    color: paper.dashboardInk,
    lineHeight: 19,
  },
  titleHead: {
    fontFamily: paperFonts.display,
    fontWeight: '700',
    color: paper.dashboardInk,
  },
  titleTail: {
    fontFamily: paperFonts.displaySemiBold,
    color: paper.dashboardMuted,
  },
  body: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#444444',
  },
  transitionChip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#FBF1D9',
    borderWidth: 1,
    borderColor: 'rgba(201,155,45,0.35)',
    borderRadius: 7,
  },
  transitionGlyph: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardBlue,
    marginTop: 1,
  },
  transitionText: {
    flex: 1,
    fontFamily: paperFonts.bodyMedium,
    fontSize: 11.5,
    lineHeight: 16,
    color: paper.dashboardBlue,
  },

  // ── Colophon ────────────────────────────────────────────────────────────
  colophon: {
    gap: 6,
    paddingTop: paperSpacing.sm,
  },
  colophonRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardLine,
  },
  colophonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
    paddingTop: 6,
  },
  colophonLeft: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
  },
  colophonRight: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
  },
  colophonNote: {
    fontFamily: paperFonts.body,
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 14,
    color: paper.dashboardMuted,
  },
});
