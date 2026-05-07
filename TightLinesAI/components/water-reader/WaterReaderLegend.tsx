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
 *   • Each row: 22px ink-stroked circle with the entry number (Fraunces 700)
 *     + 8×14px ink-stroked color swatch in the entry's paper-warm hue, both
 *     mirroring the SVG callout glyphs so the user can read map → legend
 *     instantly.
 *   • Title in Fraunces 700; body in DM Sans 13 (~ 0.78 ink opacity).
 *   • Confluence rows get a STRUCTURE CONFLUENCE eyebrow + a muted-magenta
 *     accent line, distinguishing them from standalone zones without
 *     introducing the screaming spec magenta.
 *   • Transition warnings render as gold "FAIR-tier" chip rows, prefixed
 *     with the same ◐ glyph the band system uses elsewhere.
 *
 * The component is purely presentational — no state, no fetching.
 */

import { StyleSheet, Text, View } from 'react-native';
import {
  paper,
  paperBorders,
  paperFonts,
  paperRadius,
  paperSpacing,
} from '../../lib/theme';
import {
  paperWarmColorForFeature,
} from '../../lib/waterReaderZonePaperPalette';
import type { WaterReaderProductionSvgLegendEntry } from '../../lib/waterReaderContracts';

const CONFLUENCE_ACCENT = '#7A3A52';

export interface WaterReaderLegendProps {
  entries: WaterReaderProductionSvgLegendEntry[];
  season?: string;
}

export function WaterReaderLegend({
  entries,
  season,
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
          />
        ))}
      </View>
    </View>
  );
}

function LegendRow({
  entry,
  isFirst,
}: {
  entry: WaterReaderProductionSvgLegendEntry;
  isFirst: boolean;
}) {
  // Trust the paper-warm palette — but if the engine emits a hex we don't
  // recognize, fall back to the entry's `colorHex`. This keeps the legend
  // forward-compatible if a new feature class ships before the palette is
  // updated.
  const featureKey = entry.isConfluence
    ? 'structure_confluence'
    : entry.featureClass;
  const paletteColor = paperWarmColorForFeature(featureKey);
  const accent = paletteColor ?? entry.colorHex ?? paper.ink;

  const titleParts = splitLegendTitle(entry.title);

  return (
    <View
      style={[
        styles.row,
        !isFirst && styles.rowDivider,
        entry.isConfluence && styles.rowConfluence,
      ]}
    >
      {/* Number + swatch column — mirrors the SVG callout exactly. */}
      <View style={styles.markerColumn}>
        <View style={styles.numberRing}>
          <Text style={styles.numberText} allowFontScaling={false}>
            {entry.number ?? '·'}
          </Text>
        </View>
        <View
          style={[
            styles.swatch,
            {
              backgroundColor: accent,
              borderColor: paper.ink,
            },
          ]}
        />
      </View>

      {/* Copy column. */}
      <View style={styles.copyColumn}>
        {entry.isConfluence && (
          <Text style={[styles.tinyTag, { color: CONFLUENCE_ACCENT }]}>
            STRUCTURE CONFLUENCE
          </Text>
        )}
        <Text style={styles.title} numberOfLines={3}>
          <Text style={styles.titleHead}>{titleParts.head}</Text>
          {titleParts.tail ? (
            <Text style={styles.titleTail}>
              {' — '}
              {titleParts.tail}
            </Text>
          ) : null}
        </Text>
        <Text style={styles.body}>{entry.body}</Text>
        {entry.transitionWarning ? (
          <View style={styles.transitionChip}>
            <Text style={styles.transitionGlyph}>◐</Text>
            <Text style={styles.transitionText}>
              {entry.transitionWarning}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
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
    alignItems: 'flex-start',
    gap: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm + 2,
  },
  rowConfluence: {
    // No background change — the eyebrow + swatch ring carry the difference.
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.inkHair,
  },
  markerColumn: {
    width: 36,
    alignItems: 'center',
    paddingTop: 1,
    gap: 4,
  },
  numberRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: paper.ink,
    backgroundColor: paper.paperLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: paperFonts.display,
    fontSize: 11,
    fontWeight: '700',
    color: paper.ink,
    lineHeight: 13,
  },
  swatch: {
    width: 8,
    height: 14,
    borderRadius: 2,
    borderWidth: 1,
  },
  copyColumn: {
    flex: 1,
    gap: 4,
  },
  tinyTag: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    letterSpacing: 2.4,
    fontWeight: '700',
    marginBottom: 1,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 14,
    color: paper.ink,
    lineHeight: 18,
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
});
