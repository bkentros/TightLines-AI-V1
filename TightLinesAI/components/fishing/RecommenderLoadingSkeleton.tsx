/**
 * RecommenderLoadingSkeleton
 *
 * Paper-language placeholder that mirrors the shape of the final
 * "What to Throw Today" result so the transition feels continuous:
 *   • Hero block with eyebrow / title / targeting + colors tiles
 *   • Theme-note band
 *   • One section header + three medal-ranked tackle cards
 *
 * The actual recommender fetch is driven elsewhere; this component is
 * visual-only and does not touch any real data or state.
 */

import React, { createContext, useContext } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../../lib/theme';
import {
  CornerMarkSet,
  SectionEyebrow,
  TopographicLines,
} from '../paper';
import { usePaperBonePulse } from '../../lib/usePaperBonePulse';

/**
 * Shared pulse value (one Animated.Value, native driver) propagated to
 * every Bone via context — see HowFishingLoadingSkeleton for the same
 * pattern. The 0.32 → 0.72 range keeps the bones substantial while
 * still visibly breathing.
 */
const PulseCtx = createContext<Animated.Value | null>(null);

function Bone({ style }: { style?: object }) {
  const pulse = useContext(PulseCtx);
  return <Animated.View style={[styles.bone, style, pulse ? { opacity: pulse } : null]} />;
}

function SkeletonTackleCard({ tier }: { tier: 'gold' | 'silver' | 'bronze' }) {
  const color =
    tier === 'gold' ? paper.medalGold : tier === 'silver' ? paper.medalSilver : paper.medalBronze;
  const rank = tier === 'gold' ? 'I' : tier === 'silver' ? 'II' : 'III';
  return (
    <View style={styles.tackleCard}>
      <View style={styles.tackleImageBand}>
        <Bone style={styles.tackleImageBone} />
        <View style={[styles.medal, { backgroundColor: color }]}>
          <Text style={styles.medalText}>{rank}</Text>
        </View>
        <View style={styles.tierBand}>
          <Bone style={styles.tierBandBone} />
        </View>
      </View>

      <View style={styles.tackleBody}>
        <Bone style={styles.titleBone} />
        <Bone style={styles.subtitleBone} />

        <View style={styles.metaRow}>
          <View style={styles.metaCell}>
            <Bone style={styles.metaLabelBone} />
            <Bone style={styles.metaValueBone} />
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaCell}>
            <Bone style={styles.metaLabelBone} />
            <Bone style={styles.metaValueBone} />
          </View>
        </View>

        <View style={styles.columnRow}>
          {[0, 1, 2, 3].map((i) => (
            <Bone key={i} style={styles.columnBar} />
          ))}
        </View>

        <Bone style={styles.howEyebrowBone} />
        <Bone style={styles.howLineBone} />
        <Bone style={[styles.howLineBone, { width: '85%' }]} />
        <Bone style={[styles.howLineBone, { width: '70%' }]} />
      </View>
    </View>
  );
}

export function RecommenderLoadingSkeleton() {
  const pulse = usePaperBonePulse({ from: 0.32, to: 0.72, duration: 1700 });
  return (
    <PulseCtx.Provider value={pulse}>
    <View style={styles.root}>
      {/* Hero — mirrors WhatToThrowHero dimensions. */}
      <View style={styles.hero}>
        <TopographicLines
          style={styles.heroTopo}
          color={paper.walnut}
          count={6}
        />
        <CornerMarkSet color={paper.gold} size={16} thickness={2} inset={10} />

        <View style={styles.heroHeader}>
          <SectionEyebrow color={paper.red} dashes size={10}>
            TACKLE BOX · LOADING
          </SectionEyebrow>
        </View>

        <View style={styles.heroTitleRow}>
          <View style={styles.heroTitleCol}>
            <Bone style={styles.heroTitleBone} />
            <Bone style={[styles.heroTitleBone, styles.heroTitleBoneAccent]} />
          </View>
          <View style={styles.heroPortraitWrap}>
            <Bone style={styles.heroPortrait} />
            <View style={styles.heroPortraitPill}>
              <Bone style={styles.heroPortraitPillBone} />
            </View>
          </View>
        </View>

        <View style={styles.heroTileRow}>
          <View style={styles.heroTile}>
            <Bone style={styles.tileLabelBone} />
            <Bone style={styles.tileValueBone} />
          </View>
          <View style={styles.heroTile}>
            <Bone style={styles.tileLabelBone} />
            <View style={styles.tileSwatchRow}>
              <Bone style={styles.tileSwatch} />
              <Bone style={styles.tileSwatch} />
              <Bone style={styles.tileSwatch} />
            </View>
            <Bone style={styles.tileValueBone} />
          </View>
        </View>
      </View>

      {/* Theme note band */}
      <View style={styles.themeNote}>
        <Bone style={styles.themeEyebrowBone} />
        <Bone style={styles.themeLineBone} />
        <Bone style={[styles.themeLineBone, { width: '72%' }]} />
      </View>

      {/* Lures section header */}
      <View style={styles.sectionHeader}>
        <Bone style={styles.sectionTitleBone} />
        <Bone style={styles.sectionCountBone} />
      </View>

      <SkeletonTackleCard tier="gold" />
      <SkeletonTackleCard tier="silver" />
      <SkeletonTackleCard tier="bronze" />
    </View>
    </PulseCtx.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: paperSpacing.md,
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.xl * 2,
    gap: paperSpacing.md,
  },
  bone: {
    backgroundColor: paper.inkHair,
    borderRadius: paperRadius.chip,
    opacity: 0.6,
  },

  // ── Hero ─────────────────────────────────────────────────────────────
  hero: {
    position: 'relative',
    backgroundColor: paper.paperLight,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    padding: paperSpacing.lg,
    gap: paperSpacing.md,
    overflow: 'hidden',
    ...paperShadows.hard,
  },
  heroTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.35,
  },
  heroHeader: {
    zIndex: 1,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.md,
    zIndex: 1,
  },
  heroTitleCol: {
    flex: 1,
    gap: 8,
  },
  heroTitleBone: {
    height: 26,
    width: '90%',
    borderRadius: 4,
  },
  heroTitleBoneAccent: {
    width: '65%',
    backgroundColor: paper.forest,
    opacity: 0.2,
  },
  heroPortraitWrap: {
    alignItems: 'center',
    gap: 6,
  },
  heroPortrait: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: paper.ink,
    backgroundColor: paper.paperDark,
    opacity: 0.7,
  },
  heroPortraitPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: paper.ink,
    borderRadius: 2,
    backgroundColor: paper.paper,
  },
  heroPortraitPillBone: {
    height: 8,
    width: 60,
  },
  heroTileRow: {
    flexDirection: 'row',
    gap: paperSpacing.sm,
    zIndex: 1,
  },
  heroTile: {
    flex: 1,
    padding: paperSpacing.sm + 2,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    backgroundColor: paper.paper,
    gap: 6,
  },
  tileLabelBone: {
    height: 8,
    width: '40%',
    backgroundColor: paper.red,
    opacity: 0.35,
  },
  tileValueBone: {
    height: 14,
    width: '75%',
  },
  tileSwatchRow: {
    flexDirection: 'row',
    gap: 2,
  },
  tileSwatch: {
    width: 10,
    height: 18,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: paper.ink,
    backgroundColor: paper.paperDark,
    opacity: 0.8,
  },

  // ── Theme note ───────────────────────────────────────────────────────
  themeNote: {
    padding: paperSpacing.md,
    paddingLeft: paperSpacing.md + 6,
    borderWidth: 2,
    borderColor: paper.ink,
    borderLeftWidth: 8,
    borderLeftColor: paper.gold,
    borderRadius: paperRadius.card,
    backgroundColor: paper.paper,
    gap: 6,
  },
  themeEyebrowBone: {
    height: 8,
    width: 60,
    backgroundColor: paper.red,
    opacity: 0.35,
  },
  themeLineBone: {
    height: 12,
    width: '92%',
  },

  // ── Section header ───────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: paper.ink,
  },
  sectionTitleBone: {
    height: 24,
    width: 110,
  },
  sectionCountBone: {
    height: 10,
    width: 48,
  },

  // ── Tackle card ──────────────────────────────────────────────────────
  tackleCard: {
    backgroundColor: paper.paper,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    overflow: 'hidden',
    ...paperShadows.hard,
  },
  tackleImageBand: {
    position: 'relative',
    height: 135,
    borderBottomWidth: 2,
    borderBottomColor: paper.ink,
    backgroundColor: paper.paperDark,
    overflow: 'hidden',
  },
  tackleImageBone: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    opacity: 0.5,
  },
  medal: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalText: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.ink,
    fontWeight: '700',
  },
  tierBand: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: 2,
    backgroundColor: paper.paper,
  },
  tierBandBone: {
    height: 8,
    width: 110,
  },
  tackleBody: {
    padding: paperSpacing.md + 2,
    gap: paperSpacing.xs + 2,
  },
  titleBone: {
    height: 20,
    width: '80%',
  },
  subtitleBone: {
    height: 12,
    width: '55%',
    opacity: 0.45,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: paperSpacing.sm,
    paddingVertical: paperSpacing.xs + 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: paper.inkHair,
  },
  metaCell: {
    flex: 1,
    gap: 4,
    paddingHorizontal: paperSpacing.sm,
  },
  metaDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: paper.inkHair,
  },
  metaLabelBone: {
    height: 8,
    width: 48,
    backgroundColor: paper.red,
    opacity: 0.3,
  },
  metaValueBone: {
    height: 14,
    width: 72,
  },
  columnRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: paperSpacing.xs,
  },
  columnBar: {
    flex: 1,
    height: 20,
    borderRadius: 2,
    backgroundColor: paper.inkHairSoft,
  },
  howEyebrowBone: {
    height: 8,
    width: 100,
    marginTop: paperSpacing.sm + 2,
    backgroundColor: paper.red,
    opacity: 0.3,
  },
  howLineBone: {
    height: 11,
    width: '100%',
    opacity: 0.5,
  },
});
