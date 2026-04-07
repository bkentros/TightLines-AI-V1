/**
 * RecommenderView — renders the full recommender result.
 *
 * Layout:
 *   1. Header card (badges · species · image placeholder · color of day)
 *   2. Lure / Fly sub-tabs
 *   3. Top 3 family cards — medal pill · image placeholder · name · expand chevron
 *   4. Fish behavior card (compact, at the bottom)
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
import { getSpeciesImage } from '../../lib/speciesImages';
import { colors, fonts, spacing, radius, shadows } from '../../lib/theme';
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
  1: {
    fg:     '#C8960C',
    bg:     'rgba(200,150,12,0.18)',
    cardBg: 'rgba(200,150,12,0.06)',
    border: 'rgba(200,150,12,0.45)',
    label:  'Gold',
  },
  2: {
    fg:     '#637D9B',
    bg:     'rgba(99,125,155,0.16)',
    cardBg: 'rgba(99,125,155,0.05)',
    border: 'rgba(99,125,155,0.38)',
    label:  'Silver',
  },
  3: {
    fg:     '#9A5C2E',
    bg:     'rgba(154,92,46,0.15)',
    cardBg: 'rgba(154,92,46,0.06)',
    border: 'rgba(154,92,46,0.38)',
    label:  'Bronze',
  },
} as const;

// ─── Behavior row icons ───────────────────────────────────────────────────────

const BEHAVIOR_ROW_META: Record<string, { icon: string; color: string }> = {
  'Water column': { icon: 'layers-outline', color: colors.contextFreshwater },
  'Forage':       { icon: 'fish-outline',   color: colors.contextFreshwater },
  'Speed':        { icon: 'flash-outline',  color: colors.contextFreshwater },
};

// ─── Family card (collapsible) ────────────────────────────────────────────────

function FamilyCard({
  family,
  rank,
}: {
  family: RankedFamily;
  rank: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const medalRank = (rank >= 1 && rank <= 3 ? rank : 3) as 1 | 2 | 3;
  const medal = MEDAL_COLORS[medalRank];

  return (
    <View
      style={[
        styles.familyCard,
        { backgroundColor: medal.cardBg, borderColor: medal.border },
        shadows.sm,
      ]}
    >
      {/* Medal pill */}
      <View style={[styles.medalPill, { backgroundColor: medal.bg, borderColor: medal.border }]}>
        <Ionicons name="medal" size={15} color={medal.fg} />
        <Text style={[styles.medalPillText, { color: medal.fg }]}>{medal.label}</Text>
      </View>

      {/* Image placeholder — swap for <Image> when assets are ready */}
      <View style={styles.familyImagePlaceholder} />

      {/* Name + expand chevron */}
      <TouchableOpacity
        style={styles.familyFooterRow}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.familyName} numberOfLines={1}>
          {family.display_name}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      {/* Expanded — how to fish it */}
      {expanded && (
        <View style={styles.gearPanel}>
          <View style={styles.gearPanelHeader}>
            <Ionicons name="fish-outline" size={14} color={medal.fg} />
            <Text style={[styles.gearPanelTitle, { color: medal.fg }]}>How to fish it</Text>
          </View>
          <Text style={styles.gearPanelBody}>{family.how_to_fish}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Behavior row ─────────────────────────────────────────────────────────────

function BehaviorRow({ row }: { row: BehaviorSummaryRow }) {
  const meta = BEHAVIOR_ROW_META[row.label] ?? {
    icon: 'information-circle-outline',
    color: colors.primary,
  };
  return (
    <View style={styles.behaviorRow}>
      <View style={[styles.behaviorRowIconWrap, { backgroundColor: meta.color + '14' }]}>
        <Ionicons name={meta.icon as never} size={14} color={meta.color} />
      </View>
      <View style={styles.behaviorRowText}>
        <Text style={styles.behaviorRowLabel}>{row.label}</Text>
        <Text style={styles.behaviorRowDetail}>{row.detail}</Text>
      </View>
    </View>
  );
}

// ─── Fish behavior card ───────────────────────────────────────────────────────

function BehaviorSummaryCard({
  rows,
  tidal_note,
}: {
  rows: [BehaviorSummaryRow, BehaviorSummaryRow, BehaviorSummaryRow];
  tidal_note?: string;
}) {
  return (
    <View style={[styles.behaviorCard, shadows.sm]}>
      <Text style={styles.behaviorCardTitle}>Fish behavior</Text>

      <View style={styles.behaviorRowsWrap}>
        {rows.map((row, i) => (
          <View key={i}>
            <BehaviorRow row={row} />
            {i < rows.length - 1 && <View style={styles.behaviorRowDivider} />}
          </View>
        ))}
      </View>

      {!!tidal_note && (
        <View style={styles.tidalNote}>
          <Ionicons name="water-outline" size={13} color={colors.contextCoastal} />
          <Text style={styles.tidalNoteText}>{tidal_note}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Gear sub-tabs ────────────────────────────────────────────────────────────

function GearTabs({
  active,
  onChange,
  accentColor,
}: {
  active: 'lure' | 'fly';
  onChange: (tab: 'lure' | 'fly') => void;
  accentColor: string;
}) {
  return (
    <View style={styles.tabRow}>
      {(['lure', 'fly'] as const).map((tab) => {
        const isActive = active === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, isActive && { borderBottomColor: accentColor }]}
            onPress={() => onChange(tab)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                { color: isActive ? accentColor : colors.textMuted },
                isActive && { fontFamily: fonts.bodySemiBold },
              ]}
            >
              {tab === 'lure' ? 'Lures' : 'Fly Fishing'}
            </Text>
          </TouchableOpacity>
        );
      })}
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
  const [gearTab, setGearTab] = useState<'lure' | 'fly'>('lure');
  const accentColor = contextAccentColor(result.context);
  const families = gearTab === 'lure' ? result.lure_rankings : result.fly_rankings;
  const confColor = confidenceColor(result.confidence.tier);

  return (
    <ScrollView
      style={[styles.root, style]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header card ── */}
      <View style={[styles.headerCard, shadows.sm]}>
        {/* Badges row: context · clarity · confidence */}
        <View style={styles.headerTopRow}>
          <View style={[styles.badge, { backgroundColor: accentColor + '15', borderColor: accentColor + '35' }]}>
            <Ionicons name={contextIcon(result.context) as never} size={11} color={accentColor} />
            <Text style={[styles.badgeText, { color: accentColor }]}>
              {contextLabel(result.context)}
            </Text>
          </View>

          <Text style={styles.headerClarity}>
            {WATER_CLARITY_LABELS[result.water_clarity]} water
          </Text>

          <View style={[styles.badge, { backgroundColor: confColor + '15', borderColor: confColor + '35' }]}>
            <View style={[styles.confDot, { backgroundColor: confColor }]} />
            <Text style={[styles.badgeText, { color: confColor }]}>
              {confidenceLabel(result.confidence.tier)}
            </Text>
          </View>
        </View>

        {/* Species name */}
        <Text style={styles.headerSpecies}>{SPECIES_DISPLAY[result.species]}</Text>

        {/* Species image */}
        {(() => {
          const img = getSpeciesImage(result.species);
          return img ? (
            <Image
              source={img}
              style={styles.headerSpeciesImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.headerImagePlaceholder} />
          );
        })()}

        {/* Color of the day */}
        {!!result.color_of_day && (
          <View style={styles.colorOfDayRow}>
            <View style={[styles.colorOfDayIconWrap, { backgroundColor: accentColor + '18' }]}>
              <Ionicons name="color-palette-outline" size={14} color={accentColor} />
            </View>
            <Text style={styles.colorOfDayLabel}>Color of the day</Text>
            <Text style={[styles.colorOfDayValue, { color: accentColor }]}>
              {result.color_of_day}
            </Text>
          </View>
        )}
      </View>

      {/* ── Gear tabs ── */}
      <GearTabs active={gearTab} onChange={setGearTab} accentColor={accentColor} />

      {/* ── Family cards (top 3) ── */}
      {families.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No {gearTab === 'lure' ? 'lure' : 'fly'} families matched this context. Try adjusting species or water type.
          </Text>
        </View>
      ) : (
        families.map((family, i) => (
          <FamilyCard
            key={family.family_id}
            family={family}
            rank={i + 1}
          />
        ))
      )}

      {/* ── Fish behavior (bottom) ── */}
      <BehaviorSummaryCard
        rows={result.behavior.behavior_summary}
        tidal_note={result.behavior.tidal_note}
      />
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
    paddingTop: spacing.md,
    paddingBottom: 56,
    gap: spacing.md,
  },

  // ── Header card ──────────────────────────────────────────────────────────────
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
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
  headerSpecies: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    color: colors.text,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  headerSpeciesImage: {
    width: '100%',
    height: 160,
    borderRadius: radius.md,
    backgroundColor: '#111',
    marginVertical: 2,
  },
  headerImagePlaceholder: {
    height: 160,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginVertical: 2,
  },
  colorOfDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  colorOfDayIconWrap: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  colorOfDayLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  colorOfDayValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },

  // ── Gear tabs ─────────────────────────────────────────────────────────────────
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },

  // ── Family card ───────────────────────────────────────────────────────────────
  familyCard: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: spacing.md,
    gap: 12,
  },
  medalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  medalPillText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  familyImagePlaceholder: {
    height: 120,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  familyFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  familyName: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.text,
    flex: 1,
  },

  // Expanded panel
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

  // ── Fish behavior card ────────────────────────────────────────────────────────
  behaviorCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 10,
  },
  behaviorCardTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 15,
    color: colors.text,
  },
  behaviorRowsWrap: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  behaviorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  behaviorRowIconWrap: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  behaviorRowText: {
    flex: 1,
    minWidth: 0,
  },
  behaviorRowLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.primaryDark,
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  behaviorRowDetail: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  behaviorRowDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 48,
  },
  tidalNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  tidalNoteText: {
    flex: 1,
    fontFamily: fonts.bodyItalic,
    fontSize: 13,
    color: colors.contextCoastal,
    lineHeight: 18,
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
