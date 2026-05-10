/**
 * WaterReaderLegend
 *
 * Paper-language legend rendered in React from `legendEntries` returned by
 * the water-reader-read edge function. Replaces the engine's embedded
 * "Map Key" SVG panel — the renderer now strips its own legend block (and
 * the client paperifier strips it as a fallback for cached pre-bump rows),
 * leaving the React layer free to paint the legend in Fraunces / DM Sans /
 * paper colors that match every other surface in the app.
 *
 * Visual contract:
 *   • Section eyebrow "MAP KEY · {N} STRUCTURES" + italic season subline.
 *   • Each row reads as a printed legend entry rather than a UI list item:
 *       - Number ring on the left, mirroring the SVG callout glyph.
 *       - Bold left-side vertical color ribbon (4 px × full row height) in
 *         the zone's paper-warm hue. Replaces the prior tiny rectangle
 *         swatch — gives each row strong color identity at a glance.
 *       - Structure-type tag eyebrow ("POINT", "COVE", "NECK", "ISLAND"…)
 *         above the title so users can scan structure types without
 *         reading the full title.
 *       - Title in Fraunces 700 (split into structure-type "head" + a
 *         lighter placement-variant "tail") and DM Sans body.
 *   • Confluence rows get a "CONFLUENCE" type tag — same anatomy as other
 *     rows, no special background, the ribbon color carries the difference.
 *   • Transition warnings render as gold "FAIR-tier" chip rows, prefixed
 *     with the same ◐ glyph the band system uses elsewhere.
 *
 * The component is purely presentational — no state, no fetching. Rows are
 * `React.memo`'d so a tap doesn't cascade re-renders through 8–9 rows.
 */

import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import {
  PAPER_WARM_FEATURE_COLORS,
  paperWarmColorForFeature,
} from '../../lib/waterReaderZonePaperPalette';
import type { WaterReaderProductionSvgLegendEntry } from '../../lib/waterReaderContracts';

// Match the confluence color in the paper palette so the legend eyebrow
// reads as the same hue family as the SVG zone color.
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

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.eyebrow}>
            MAP KEY · {entries.length}{' '}
            {entries.length === 1 ? 'STRUCTURE' : 'STRUCTURES'}
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
            <Text style={[styles.seasonBadgeText, { color: seasonStyle.color }]}>
              {seasonLabel.toUpperCase()}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.list}>
        {entries.map((entry, idx) => (
          <LegendRow
            key={`${entry.number ?? entry.zoneId}-${entry.zoneIds.join('|')}`}
            entry={entry}
            isFirst={idx === 0}
            selected={selectedNumber != null && String(selectedNumber) === String(entry.number)}
            onSelectNumber={onSelectNumber}
          />
        ))}
      </View>

      <View style={styles.betaFooter}>
        <View style={styles.betaFooterChip}>
          <Text style={styles.betaFooterChipText}>BETA</Text>
        </View>
        <Text style={styles.betaFooterText}>
          Water Read is in beta. Read the zones as a starting point, not the last word.
        </Text>
      </View>
    </View>
  );
}

interface LegendRowProps {
  entry: WaterReaderProductionSvgLegendEntry;
  isFirst: boolean;
  selected: boolean;
  onSelectNumber?: (n: number | string | null) => void;
}

/**
 * `React.memo`'d so a single legend tap doesn't cascade a re-render through
 * every row in the legend (8–9 of them is enough to feel sluggish on a
 * mid-range device). Pulling the toggle logic inside the row also lets the
 * parent pass a stable `onSelectNumber` reference (the state setter) instead
 * of a fresh arrow per render — without that, memoization would be defeated.
 */
const LegendRow = memo(function LegendRow({
  entry,
  isFirst,
  selected,
  onSelectNumber,
}: LegendRowProps) {
  // Trust the paper-warm palette — but if the engine emits a hex we don't
  // recognize, fall back to the entry's `colorHex`. This keeps the legend
  // forward-compatible if a new feature class ships before the palette is
  // updated.
  const featureKey = entry.isConfluence
    ? 'structure_confluence'
    : entry.featureClass;
  const paletteColor = paperWarmColorForFeature(featureKey);
  const accent = paletteColor ?? entry.colorHex ?? paper.dashboardInk;
  const typeTag = structureTypeTag(featureKey);

  const titleParts = splitLegendTitle(entry.title);

  // Stable handler: the parent's `onSelectNumber` is the state setter, so
  // the only thing that changes between renders is `selected` + `entry`.
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

      {/* Bold color square — strong row identity. Sized to match the
          number ring so the marker column reads as two paired chips. */}
      <View
        style={[
          styles.colorSwatch,
          { backgroundColor: accent },
        ]}
      />

      {/* Copy column. */}
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
          {entry.body}
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

/**
 * Maps engine feature classes to the short, all-caps "structure-type" tag
 * shown above each legend row's title. These are the words a guide would
 * use to scan the legend at a glance — point, cove, neck, etc. — short
 * enough to fit on a single tracked line.
 */
function structureTypeTag(featureKey: string | undefined): string {
  switch (featureKey) {
    case 'main_lake_point':
      return 'MAIN POINT';
    case 'secondary_point':
      return 'POINT';
    case 'cove':
      return 'COVE';
    case 'neck':
      return 'NECK';
    case 'island':
      return 'ISLAND';
    case 'saddle':
      return 'SADDLE';
    case 'dam':
      return 'DAM';
    case 'structure_confluence':
      return 'CONFLUENCE';
    case 'universal':
      return 'POND';
    default:
      return 'STRUCTURE';
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
        borderColor: 'rgba(45, 168, 95, 0.38)',
        color: '#1F7A45',
      };
    case 'fall':
    case 'autumn':
      return {
        backgroundColor: 'rgba(255, 138, 42, 0.2)',
        borderColor: 'rgba(255, 138, 42, 0.42)',
        color: '#9A4E12',
      };
    case 'winter':
      return {
        backgroundColor: 'rgba(40, 200, 255, 0.2)',
        borderColor: 'rgba(42, 110, 150, 0.36)',
        color: paper.dashboardBlue,
      };
    case 'spring':
    default:
      return {
        backgroundColor: 'rgba(185, 242, 77, 0.25)',
        borderColor: 'rgba(61, 168, 95, 0.34)',
        color: '#2E7A43',
      };
  }
}

/**
 * Engine titles look like "Main Lake Point - Point Tip" or "East Cove - Back
 * Shoreline". Split on the first " - " so the "head" (structure type) gets
 * the heavier display weight and the "tail" (placement variant) gets a
 * lighter, secondary treatment.
 */
function splitLegendTitle(title: string): { head: string; tail: string | null } {
  const idx = title.indexOf(' - ');
  if (idx <= 0) return { head: title, tail: null };
  return { head: title.slice(0, idx), tail: title.slice(idx + 3) };
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: paperSpacing.sm,
    paddingBottom: paperSpacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: paper.dashboardLine,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 12.5,
    letterSpacing: 1.8,
    color: paper.dashboardInk,
    lineHeight: 17,
  },
  seasonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  seasonBadgeText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.3,
    lineHeight: 12,
  },
  list: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm + 2,
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
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.18)',
    marginTop: 1,
    // Subtle inner highlight so the swatch reads as a hand-painted chip,
    // not a flat color block — small detail but it makes the legend
    // feel printed rather than UI-rendered.
    overflow: 'hidden',
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
    color: '#555555',
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
    color: paper.goldDk,
    marginTop: 1,
  },
  transitionText: {
    flex: 1,
    fontFamily: paperFonts.bodyMedium,
    fontSize: 11.5,
    lineHeight: 16,
    color: paper.goldDk,
  },
  betaFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
    paddingTop: paperSpacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardHair,
  },
  betaFooterChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.18)',
    backgroundColor: paper.bandPoor,
  },
  betaFooterChipText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: paper.dashboardInk,
    lineHeight: 11,
  },
  betaFooterText: {
    flex: 1,
    fontFamily: paperFonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: paper.dashboardMuted,
  },
});
