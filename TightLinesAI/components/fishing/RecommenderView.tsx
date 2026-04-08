/**
 * RecommenderView — full recommender result.
 *
 * Layout:
 *   1. Header card
 *        Species name (top)
 *        Fish image — large, full-width, warm dark bg
 *        Badges row (context · clarity · confidence)
 *        Divider
 *        Color of the day
 *        Divider
 *        Fish behavior — collapsible dropdown
 *   2. Lure / Fly tabs
 *   3. Top 3 family cards (medal pill · image placeholder · name · expand chevron)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../lib/theme';
import { getSpeciesImage } from '../../lib/speciesImages';
import { getColorPaletteImage } from '../../lib/colorPaletteImages';
import { getLureImage } from '../../lib/lureImages';
import type {
  BehaviorSummaryRow,
  EngineContext,
  RankedFamily,
  RecommenderConfidenceTier,
  RecommenderResponse,
} from '../../lib/recommenderContracts';
import {
  SPECIES_DISPLAY,
  WATER_CLARITY_LABELS,
} from '../../lib/recommenderContracts';

// ─── Context helpers ──────────────────────────────────────────────────────────

function contextAccentColor(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond': return colors.contextFreshwater;
    case 'freshwater_river':     return colors.contextRiver;
    default:                     return colors.contextFreshwater;
  }
}

function contextLabel(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond': return 'Lake / Pond';
    case 'freshwater_river':     return 'River';
    default:                     return 'Freshwater';
  }
}

function contextIcon(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond': return 'water-outline';
    case 'freshwater_river':     return 'git-merge-outline';
    default:                     return 'water-outline';
  }
}

// ─── Confidence helpers ───────────────────────────────────────────────────────

function confidenceColor(tier: RecommenderConfidenceTier): string {
  switch (tier) {
    case 'high':   return colors.reportScoreGreen;
    case 'medium': return colors.reportScoreYellow;
    case 'low':    return colors.reportScoreRed;
  }
}

function confidenceLabel(tier: RecommenderConfidenceTier): string {
  switch (tier) {
    case 'high':   return 'Strong read';
    case 'medium': return 'Solid read';
    case 'low':    return 'Tougher read';
  }
}

// ─── Medal colors ─────────────────────────────────────────────────────────────

const MEDAL_COLORS = {
  1: { fg: '#C8960C', bg: 'rgba(200,150,12,0.18)', cardBg: 'rgba(200,150,12,0.06)', border: 'rgba(200,150,12,0.45)', label: 'Gold' },
  2: { fg: '#637D9B', bg: 'rgba(99,125,155,0.16)', cardBg: 'rgba(99,125,155,0.05)', border: 'rgba(99,125,155,0.38)', label: 'Silver' },
  3: { fg: '#9A5C2E', bg: 'rgba(154,92,46,0.15)',  cardBg: 'rgba(154,92,46,0.06)',  border: 'rgba(154,92,46,0.38)',  label: 'Bronze' },
} as const;

// ─── Behavior row icons ───────────────────────────────────────────────────────

const BEHAVIOR_ICON: Record<string, { icon: string }> = {
  'Water column': { icon: 'layers-outline' },
  'Forage':       { icon: 'fish-outline'   },
  'Speed':        { icon: 'flash-outline'  },
};

// ─── Family card ──────────────────────────────────────────────────────────────

function FamilyCard({ family, rank }: { family: RankedFamily; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const medalRank = (rank >= 1 && rank <= 3 ? rank : 3) as 1 | 2 | 3;
  const medal = MEDAL_COLORS[medalRank];
  const lureImg = getLureImage(family.family_id);

  return (
    <View style={[styles.familyCard, { backgroundColor: medal.cardBg, borderColor: medal.border }, shadows.sm]}>
      <View style={[styles.medalPill, { backgroundColor: medal.bg, borderColor: medal.border }]}>
        <Ionicons name="medal" size={14} color={medal.fg} />
        <Text style={[styles.medalPillText, { color: medal.fg }]}>{medal.label}</Text>
      </View>

      {/* Lure/fly image — shows when available, placeholder when not yet uploaded */}
      {lureImg ? (
        <View style={styles.familyImageWrap}>
          <Image
            source={lureImg}
            style={styles.familyImage}
            resizeMode="contain"
          />
        </View>
      ) : (
        <View style={styles.familyImagePlaceholder} />
      )}

      <TouchableOpacity
        style={styles.familyFooterRow}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.familyName} numberOfLines={2}>{family.display_name}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textMuted} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.gearPanel}>
          <View style={styles.gearPanelHeader}>
            <Ionicons name="fish-outline" size={13} color={medal.fg} />
            <Text style={[styles.gearPanelTitle, { color: medal.fg }]}>How to fish it</Text>
          </View>
          <Text style={styles.gearPanelBody}>{family.how_to_fish}</Text>
        </View>
      )}
    </View>
  );
}


// ─── Main component ───────────────────────────────────────────────────────────

type Props = {
  result: RecommenderResponse;
  style?: ViewStyle;
  isRefreshing?: boolean;
  onRefresh?: () => void;
};

export function RecommenderView({ result, style }: Props) {
  const [behaviorOpen, setBehaviorOpen] = useState(false);

  const accentColor = contextAccentColor(result.context);
  const img = getSpeciesImage(result.species);
  const colorPaletteImg = getColorPaletteImage(result.presentation.color_family);

  return (
    <ScrollView
      style={[styles.root, style]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header card ── */}
      <View style={[styles.headerCard, shadows.sm]}>

        {/* Species name — very top */}
        <Text style={styles.headerSpecies}>{SPECIES_DISPLAY[result.species]}</Text>

        {/* Fish image — large, full-width, warm dark bg */}
        <View style={styles.fishImageWrap}>
          {img ? (
            <Image source={img} style={styles.fishImage} resizeMode="contain" />
          ) : (
            <View style={styles.fishImageFallback} />
          )}
        </View>

        {/* Badges row — below image */}
        <View style={styles.headerBadgeRow}>
          <View style={[styles.badge, { backgroundColor: accentColor + '15', borderColor: accentColor + '35' }]}>
            <Ionicons name={contextIcon(result.context) as never} size={11} color={accentColor} />
            <Text style={[styles.badgeText, { color: accentColor }]}>{contextLabel(result.context)}</Text>
          </View>
          <Text style={styles.headerClarity}>{WATER_CLARITY_LABELS[result.water_clarity]} water</Text>
        </View>

        <View style={styles.divider} />

        {/* Color of the day */}
        {!!result.color_of_day && (
          <View style={styles.colorOfDayRow}>
            {/* Palette swatch — transparent PNG that blends with the card background */}
            <Image
              source={colorPaletteImg}
              style={styles.colorPaletteThumb}
              resizeMode="contain"
            />
            <View style={styles.colorTextCol}>
              <Text style={styles.colorLabel}>Color of the day</Text>
              <Text style={[styles.colorValue, { color: accentColor }]}>{result.color_of_day}</Text>
            </View>
          </View>
        )}

        <View style={styles.divider} />

        {/* Fish behavior — collapsible */}
        <TouchableOpacity
          style={styles.behaviorToggleRow}
          onPress={() => setBehaviorOpen((v) => !v)}
          activeOpacity={0.7}
        >
          <Text style={styles.behaviorToggleLabel}>Fish behavior today</Text>
          <Ionicons
            name={behaviorOpen ? 'chevron-up' : 'chevron-down'}
            size={17}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        {behaviorOpen && (
          <View style={styles.behaviorContent}>
            {result.behavior.behavior_summary.map((row, i) => {
              const meta = BEHAVIOR_ICON[row.label] ?? { icon: 'information-circle-outline' };
              return (
                <View key={i}>
                  {i > 0 && <View style={styles.behaviorDivider} />}
                  <View style={styles.behaviorRow}>
                    <View style={[styles.behaviorIconWrap, { backgroundColor: accentColor + '14' }]}>
                      <Ionicons name={meta.icon as never} size={13} color={accentColor} />
                    </View>
                    <View style={styles.behaviorTextWrap}>
                      <Text style={[styles.behaviorLabel, { color: accentColor }]}>{row.label}</Text>
                      <Text style={styles.behaviorDetail}>{row.detail}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
            {!!result.behavior.tidal_note && (
              <View style={styles.tidalNote}>
                <Ionicons name="water-outline" size={12} color={colors.textMuted} />
                <Text style={styles.tidalNoteText}>{result.behavior.tidal_note}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* ── Column headers ── */}
      <View style={styles.colHeaders}>
        <Text style={styles.colHeader}>Lures</Text>
        <Text style={styles.colHeader}>Fly Fishing</Text>
      </View>

      {/* ── Paired lure + fly rows ── */}
      {Array.from({
        length: Math.max(result.lure_rankings.length, result.fly_rankings.length),
      }).map((_, i) => (
        <View key={i} style={styles.cardRow}>
          {result.lure_rankings[i] ? (
            <FamilyCard family={result.lure_rankings[i]} rank={i + 1} />
          ) : (
            <View style={styles.cardRowSpacer} />
          )}
          {result.fly_rankings[i] ? (
            <FamilyCard family={result.fly_rankings[i]} rank={i + 1} />
          ) : (
            <View style={styles.cardRowSpacer} />
          )}
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 48,
    gap: 8,
  },

  // ── Header card ──────────────────────────────────────────────────────────────
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 0,
  },

  headerSpecies: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.text,
    letterSpacing: -0.5,
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    paddingBottom: 6,
  },

  // Fish image — compact, transparent, full-width
  fishImageWrap: {
    width: '100%',
    height: 160,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  fishImage: {
    position: 'absolute',
    top: '-8%' as unknown as number,
    left: '-8%' as unknown as number,
    width: '116%',
    height: '116%',
  },
  fishImageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundAlt,
    borderRadius: radius.md,
  },

  // Badges row — below image
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    paddingTop: 8,
    paddingBottom: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  badgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  headerClarity: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  confDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
    marginVertical: 0,
  },

  // Color of day
  colorOfDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  // 3:2 aspect ratio — compact swatch thumbnail
  colorPaletteThumb: {
    width: 54,
    height: 36,
    borderRadius: radius.sm,
  },
  colorTextCol: {
    flex: 1,
    gap: 1,
  },
  colorLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
  },
  colorValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },

  // Fish behavior collapsible
  behaviorToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  behaviorToggleLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.text,
  },
  behaviorContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 14,
    gap: 0,
  },
  behaviorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
  },
  behaviorIconWrap: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  behaviorTextWrap: {
    flex: 1,
  },
  behaviorLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  behaviorDetail: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  behaviorDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 36,
  },
  tidalNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: 4,
  },
  tidalNoteText: {
    flex: 1,
    fontFamily: fonts.bodyItalic,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },

  // ── Column headers + card rows ────────────────────────────────────────────────
  colHeaders: {
    flexDirection: 'row',
    paddingHorizontal: 2,
  },
  colHeader: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cardRowSpacer: {
    flex: 1,
  },

  // ── Family card ───────────────────────────────────────────────────────────────
  familyCard: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: 10,
    gap: 8,
  },
  medalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  medalPillText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  // Both the placeholder and the real image use the same fixed height so all
  // cards — with or without an image — are identical in size.
  familyImagePlaceholder: {
    height: 120,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  familyImageWrap: {
    width: '100%',
    height: 120,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  familyImage: {
    width: '100%',
    height: '100%',
  },
  familyFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  familyName: {
    fontFamily: fonts.serifBold,
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  gearPanel: {
    borderRadius: radius.md,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
    gap: 8,
  },
  gearPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gearPanelTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    flex: 1,
  },
  gearPanelBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
  },

  // ── Empty state ───────────────────────────────────────────────────────────────
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
