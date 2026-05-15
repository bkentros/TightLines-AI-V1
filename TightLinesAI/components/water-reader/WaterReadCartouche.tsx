/**
 * WaterReadCartouche — lake identity block above the Water Read map.
 */

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
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
  status: 'idle' | 'reading' | 'queued' | 'ready';
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
  status,
  readingSlow,
}: WaterReadCartoucheProps) {
  // season is intentionally not passed to buildSubline — it's surfaced in
  // the legend badge and meta ribbon, not the cartouche subline.
  void season;
  const subline = buildSubline({ state, county, acres, contextLine });

  return (
    <View style={styles.root}>
      <View style={styles.eyebrowRow}>
        <Text style={styles.eyebrow} numberOfLines={1}>
          HYDROGRAPHY SCAN
        </Text>
        {status === 'reading' && (
          <View style={styles.statusPill}>
            <ActivityIndicator size="small" color={paper.dashboardBlue} />
            <Text style={styles.statusPillText} numberOfLines={1}>
              {readingSlow ? 'BUILDING MAP' : 'OPENING'}
            </Text>
          </View>
        )}
        {status === 'queued' && (
          <View style={styles.statusPill}>
            <Ionicons name="time-outline" size={11} color={paper.dashboardBlue} />
            <Text style={styles.statusPillText} numberOfLines={1}>
              BUILDING
            </Text>
          </View>
        )}
        {status === 'ready' && (
          <View style={[styles.statusPill, styles.statusPillReady]}>
            <Ionicons name="checkmark" size={11} color={paper.dashboardInk} />
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
  contextLine,
}: {
  state?: string | null;
  county?: string | null;
  acres?: number | null;
  contextLine?: string;
}): string | null {
  // Prefer engine-provided fields; fall back to the parent's pre-engine
  // context line so the header is never blank during the reading state.
  // Pass-9: season is no longer included here — it's surfaced in the
  // legend masthead badge and the meta ribbon under the map, so adding
  // it to the cartouche subline created a wrapped third line on lakes
  // with long names (e.g. "FL · PALM BEACH CO. · 339,989 ACRES · SUMMER"
  // pushing SUMMER onto a new row). The subline now reads as a clean
  // state · county · acres locator.
  const parts: string[] = [];
  if (state) parts.push(state.toUpperCase());
  if (county) parts.push(`${county.toUpperCase()} CO.`);
  if (typeof acres === 'number' && acres > 0) {
    parts.push(`${Math.round(acres).toLocaleString()} ACRES`);
  }
  if (parts.length > 0) return parts.join('  ·  ');
  if (contextLine) return contextLine.toUpperCase();
  return null;
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
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
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.7,
    color: paper.dashboardBlue,
    flexShrink: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 7,
    backgroundColor: '#FAFAF7',
    flexShrink: 0,
    maxWidth: 140,
  },
  statusPillReady: {
    backgroundColor: paper.bandPrime,
    borderColor: 'rgba(0,0,0,0.18)',
  },
  statusPillText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.3,
    color: paper.dashboardInk,
    lineHeight: 12,
  },
  statusPillTextReady: {
    color: paper.dashboardInk,
  },
  thickRule: {
    height: 1,
    backgroundColor: paper.dashboardLine,
    marginBottom: 10,
  },
  lakeName: {
    fontFamily: paperFonts.display,
    fontSize: 27,
    lineHeight: 31,
    fontWeight: '700',
    letterSpacing: 0,
    color: paper.dashboardInk,
  },
  subline: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
    marginTop: 8,
    lineHeight: 14,
  },
  thinRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardHair,
    marginTop: paperSpacing.sm + 2,
  },
});
