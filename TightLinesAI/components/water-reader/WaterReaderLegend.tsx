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
  paperBorders,
  paperFonts,
  paperRadius,
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

  const seasonLine = season ? `seasonal read — ${season.toLowerCase()}` : null;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.eyebrow}>
            MAP KEY · {entries.length}{' '}
            {entries.length === 1 ? 'STRUCTURE' : 'STRUCTURES'}
          </Text>
          {seasonLine && <Text style={styles.subline}>{seasonLine}</Text>}
        </View>
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
  const accent = paletteColor ?? entry.colorHex ?? paper.ink;
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
    backgroundColor: paper.paper,
    borderRadius: paperRadius.card,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md,
    ...paperBorders.card,
    gap: paperSpacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: paperSpacing.xs,
    borderBottomWidth: 1.5,
    borderBottomColor: paper.ink,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  eyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.6,
    color: paper.ink,
    fontWeight: '700',
  },
  subline: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 11,
    color: paper.ink,
    opacity: 0.55,
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
    borderRadius: paperRadius.card - 2,
  },
  rowSelected: {
    backgroundColor: paper.paperLight,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.inkHair,
  },
  numberRing: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: paper.ink,
    backgroundColor: paper.paperLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  numberRingSelected: {
    backgroundColor: paper.forest,
  },
  numberText: {
    fontFamily: paperFonts.display,
    fontSize: 12,
    fontWeight: '700',
    color: paper.ink,
    lineHeight: 14,
  },
  numberTextSelected: {
    color: paper.paper,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: paper.ink,
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
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    letterSpacing: 2.4,
    fontWeight: '700',
    color: paper.ink,
    opacity: 0.75,
    marginBottom: 1,
    lineHeight: 12,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 14.5,
    color: paper.ink,
    lineHeight: 19,
  },
  titleHead: {
    fontFamily: paperFonts.display,
    fontWeight: '700',
    color: paper.ink,
  },
  titleTail: {
    fontFamily: paperFonts.displaySemiBold,
    color: paper.ink,
    opacity: 0.78,
  },
  body: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.ink,
    opacity: 0.78,
  },
  transitionChip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: paper.paperLight,
    borderWidth: 1,
    borderColor: paper.goldDk,
    borderRadius: paperRadius.chip,
  },
  transitionGlyph: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.goldDk,
    fontWeight: '700',
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
    borderTopColor: paper.inkHair,
  },
  betaFooterChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: paperRadius.chip,
    borderWidth: 1,
    borderColor: paper.rust,
    backgroundColor: paper.paperLight,
  },
  betaFooterChipText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    letterSpacing: 1.6,
    color: paper.rust,
    fontWeight: '700',
    lineHeight: 11,
  },
  betaFooterText: {
    flex: 1,
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 12,
    lineHeight: 16,
    color: paper.ink,
    opacity: 0.7,
  },
});
