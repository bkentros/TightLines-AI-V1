/**
 * ScoreCard — compact top-line score display.
 * Internal engine stays 0-100; UI presents it as 0-10 for readability.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import type { EngineScoring, WaterType } from '../../lib/howFishing';

export function getScoreBand(score: number): 'green' | 'yellow' | 'red' {
  if (score >= 72) return 'green';
  if (score >= 45) return 'yellow';
  return 'red';
}

function cardStyles(score: number) {
  const band = getScoreBand(score);
  switch (band) {
    case 'green':
      return { bg: '#EAF6EE', border: '#4A9A63', text: colors.sageDark };
    case 'yellow':
      return { bg: '#FFF7E7', border: '#E0A23A', text: '#C17C00' };
    default:
      return { bg: '#FFF0F0', border: '#E06969', text: '#C64545' };
  }
}

function frontNote(scoring: EngineScoring): string | null {
  if (!scoring.recovery_multiplier || scoring.recovery_multiplier >= 0.98) return null;
  return 'Recent front activity is holding the bite back.';
}

function confidenceLine(scoring: EngineScoring): string | null {
  if (typeof scoring.water_temp_confidence !== 'number') return null;
  const pct = Math.round(scoring.water_temp_confidence * 100);
  if (pct >= 95) return null;
  return `Freshwater temperature confidence ${pct}%`;
}

function displayScore(score: number): string {
  const outOfTen = Math.round(score) / 10;
  if (Number.isInteger(outOfTen)) return `${outOfTen.toFixed(0)}`;
  return outOfTen.toFixed(1);
}

interface ScoreCardProps {
  scoring: EngineScoring;
  waterType: WaterType;
  waterTempLine?: string | null;
  environmentMode?: string | null;
}

function humanizeEnvironmentMode(mode: string | null | undefined): string {
  if (!mode) return '';
  const map: Record<string, string> = {
    freshwater_lake: 'Lake / Pond',
    freshwater_river: 'River / Stream',
    saltwater: 'Saltwater',
    brackish: 'Brackish',
  };
  return map[mode] ?? mode.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function ScoreCard({ scoring, waterType, waterTempLine, environmentMode }: ScoreCardProps) {
  const style = cardStyles(scoring.adjusted_score);
  const note = frontNote(scoring);
  const confidence = confidenceLine(scoring);
  const modeLabel = humanizeEnvironmentMode(environmentMode);
  const contextLabel = modeLabel || (waterType.charAt(0).toUpperCase() + waterType.slice(1));

  return (
    <View style={[styles.card, { backgroundColor: style.bg, borderColor: style.border }]}> 
      <View style={styles.scoreRow}>
        <View>
          <Text style={[styles.score, { color: style.text }]}>{displayScore(scoring.adjusted_score)}</Text>
          <Text style={styles.scoreLabel}>out of 10</Text>
        </View>
        <View style={styles.metaWrap}>
          <Text style={[styles.rating, { color: style.text }]}>{scoring.overall_rating}</Text>
          <Text style={styles.waterType}>{contextLabel}</Text>
        </View>
      </View>

      {note ? <Text style={styles.note}>{note}</Text> : null}
      {waterTempLine ? <Text style={styles.subLine}>{waterTempLine}</Text> : null}
      {confidence ? <Text style={styles.subLine}>{confidence}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  score: {
    fontFamily: fonts.serif,
    fontSize: 38,
    fontWeight: '700',
    lineHeight: 42,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: -2,
  },
  metaWrap: {
    alignItems: 'flex-end',
    paddingBottom: 2,
  },
  rating: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
  },
  waterType: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  note: {
    fontSize: 12,
    color: '#C17C00',
    marginTop: 6,
    fontWeight: '600',
  },
  subLine: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
});
