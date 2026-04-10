/**
 * Layout placeholder while the recommender Edge Function runs —
 * mirrors header + two-column cards so the screen doesn’t feel empty.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, radius, shadows } from '../../lib/theme';

function Bone({ style }: { style?: object }) {
  return <View style={[styles.bone, style]} />;
}

export function RecommenderLoadingSkeleton() {
  return (
    <View style={styles.root}>
      <View style={[styles.headerCard, shadows.sm]}>
        <Bone style={styles.speciesLine} />
        <Bone style={styles.fishBlock} />
        <View style={styles.badgeRow}>
          <Bone style={styles.badge} />
          <Bone style={styles.badgeWide} />
        </View>
        <Bone style={styles.divider} />
        <View style={styles.colorRow}>
          <Bone style={styles.swatch} />
          <View style={styles.colorText}>
            <Bone style={styles.lineShort} />
            <Bone style={styles.lineMed} />
          </View>
        </View>
        <Bone style={styles.divider} />
        <Bone style={styles.behaviorToggle} />
      </View>

      <View style={styles.colHeaders}>
        <Bone style={styles.colTitle} />
        <Bone style={styles.colTitle} />
      </View>

      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.cardRow}>
          <View style={[styles.familyCard, shadows.sm]}>
            <Bone style={styles.medal} />
            <Bone style={styles.cardImage} />
            <Bone style={styles.cardFooter} />
          </View>
          <View style={[styles.familyCard, shadows.sm]}>
            <Bone style={styles.medal} />
            <Bone style={styles.cardImage} />
            <Bone style={styles.cardFooter} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: 8,
  },
  bone: {
    backgroundColor: colors.borderLight,
    borderRadius: radius.sm,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingBottom: 12,
    gap: 10,
  },
  speciesLine: {
    marginHorizontal: spacing.md,
    marginTop: 12,
    height: 22,
    width: '55%',
    borderRadius: radius.sm,
  },
  fishBlock: {
    marginHorizontal: spacing.md,
    height: 160,
    width: '100%',
    alignSelf: 'center',
    borderRadius: radius.md,
    opacity: 0.7,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  badge: {
    height: 26,
    width: 72,
    borderRadius: radius.full,
  },
  badgeWide: {
    height: 26,
    flex: 1,
    maxWidth: 120,
    borderRadius: radius.full,
  },
  divider: {
    height: 1,
    marginHorizontal: spacing.md,
    opacity: 0.9,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.md,
  },
  swatch: {
    width: 54,
    height: 36,
    borderRadius: radius.sm,
  },
  colorText: {
    flex: 1,
    gap: 6,
  },
  lineShort: {
    height: 12,
    width: '40%',
  },
  lineMed: {
    height: 14,
    width: '65%',
  },
  behaviorToggle: {
    marginHorizontal: spacing.md,
    height: 18,
    width: '50%',
  },
  colHeaders: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 2,
    justifyContent: 'space-around',
  },
  colTitle: {
    flex: 1,
    height: 14,
    marginHorizontal: 4,
    maxWidth: 80,
    alignSelf: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 8,
  },
  familyCard: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 10,
    gap: 8,
    backgroundColor: colors.surface,
  },
  medal: {
    height: 24,
    width: 64,
    borderRadius: radius.full,
  },
  cardImage: {
    height: 120,
    width: '100%',
    borderRadius: radius.md,
  },
  cardFooter: {
    height: 16,
    width: '85%',
  },
});
