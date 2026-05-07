/**
 * WaterReadCartouche — masthead title block above the Water Read map plate.
 *
 * Replaces the prior compact "headerCard" with an editorial cartouche: red
 * eyebrow + edition stamp on the top row, lake name in display Fraunces,
 * a tracked masthead subline of geography / acreage / season, then a
 * thick-then-thin rule pair sandwiching the block so it reads as the top
 * of a printed plate rather than a UI card header.
 *
 * The component handles all three lifecycle states (idle / reading / ready)
 * so the lake name and status pill stay anchored across the read transition.
 * Engine data (state, county, acres, season) is opportunistic — when present
 * it composes the full masthead subline; when absent we fall back to the
 * `contextLine` the parent computed from the search row.
 */

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../../lib/theme';

export interface WaterReadCartoucheProps {
  lakeName: string;
  /** Pre-engine context line (e.g. "FL · Hillsborough County · ~1,234 acres"). */
  contextLine?: string;
  /** Engine values (only present after `state.status === 'ready'`). */
  state?: string | null;
  county?: string | null;
  acres?: number | null;
  season?: string | null;
  /** Edition stamp string (mirrored in the bottom colophon). */
  edition: string;
  status: 'idle' | 'reading' | 'ready';
  /** True after ~850ms of reading — flips the status pill from OPENING to BUILDING MAP. */
  readingSlow?: boolean;
}

export function WaterReadCartouche({
  lakeName,
  contextLine,
  state,
  county,
  acres,
  season,
  edition,
  status,
  readingSlow,
}: WaterReadCartoucheProps) {
  const subline = buildSubline({ state, county, acres, season, contextLine });

  return (
    <View style={styles.root}>
      <View style={styles.eyebrowRow}>
        <Text style={styles.eyebrow} numberOfLines={1}>
          WATER READ · NO. {edition}
        </Text>
        {status === 'reading' && (
          <View style={styles.statusPill}>
            <ActivityIndicator size="small" color={paper.forest} />
            <Text style={styles.statusPillText} numberOfLines={1}>
              {readingSlow ? 'BUILDING MAP' : 'OPENING'}
            </Text>
          </View>
        )}
        {status === 'ready' && (
          <View style={[styles.statusPill, styles.statusPillReady]}>
            <Ionicons name="checkmark" size={11} color={paper.paper} />
            <Text
              style={[styles.statusPillText, styles.statusPillTextReady]}
              numberOfLines={1}
            >
              READY
            </Text>
          </View>
        )}
      </View>

      <View style={styles.thickRule} />

      <Text style={styles.lakeName} numberOfLines={2}>
        {lakeName}
      </Text>
      {subline ? (
        <Text style={styles.subline} numberOfLines={2}>
          {subline}
        </Text>
      ) : null}

      <View style={styles.thinRule} />
    </View>
  );
}

function buildSubline({
  state,
  county,
  acres,
  season,
  contextLine,
}: {
  state?: string | null;
  county?: string | null;
  acres?: number | null;
  season?: string | null;
  contextLine?: string;
}): string | null {
  // Prefer engine-provided fields; fall back to the parent's pre-engine
  // context line so the masthead is never blank during the reading state.
  const parts: string[] = [];
  if (state) parts.push(state.toUpperCase());
  if (county) parts.push(`${county.toUpperCase()} CO.`);
  if (typeof acres === 'number' && acres > 0) {
    parts.push(`${Math.round(acres).toLocaleString()} ACRES`);
  }
  if (season) parts.push(season.toUpperCase());
  if (parts.length > 0) return parts.join('  ·  ');
  if (contextLine) return contextLine.toUpperCase();
  return null;
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.md,
    borderWidth: 1.5,
    borderColor: paper.ink,
    ...paperShadows.hard,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
    marginBottom: paperSpacing.xs + 2,
    minHeight: 26,
  },
  eyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    letterSpacing: 2.8,
    color: paper.red,
    fontWeight: '700',
    flexShrink: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paper,
    flexShrink: 0,
    maxWidth: 140,
  },
  statusPillReady: {
    backgroundColor: paper.forest,
  },
  statusPillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2,
    color: paper.ink,
    fontWeight: '700',
    lineHeight: 12,
  },
  statusPillTextReady: {
    color: paper.paper,
  },
  thickRule: {
    height: 2,
    backgroundColor: paper.ink,
    marginBottom: paperSpacing.sm + 2,
  },
  lakeName: {
    fontFamily: paperFonts.display,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: paper.ink,
  },
  subline: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.2,
    color: paper.ink,
    opacity: 0.7,
    marginTop: 8,
    fontWeight: '700',
    lineHeight: 14,
  },
  thinRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.ink,
    opacity: 0.45,
    marginTop: paperSpacing.sm + 2,
  },
});
