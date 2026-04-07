/**
 * RecommenderView — renders the full recommender result.
 *
 * Layout:
 *   1. Header card (species, context, clarity, confidence, 2-sentence summary)
 *   2. Fish behavior card (Water column / Forage / Speed rows with icons)
 *   3. Lure / Fly sub-tabs
 *   4. Top 3 family cards — medals; expand for How to fish + Color theme name
 *   5. Generated note footer
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

// ─── Medal (rank 1–3) ────────────────────────────────────────────────────────

const MEDAL_COLORS = {
  1: { fg: '#B8860B', bg: 'rgba(184,134,11,0.12)', border: 'rgba(184,134,11,0.30)' },
  2: { fg: '#64748B', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.25)' },
  3: { fg: '#92400E', bg: 'rgba(146,64,14,0.10)',   border: 'rgba(146,64,14,0.22)' },
} as const;

function RankMedal({ rank }: { rank: 1 | 2 | 3 }) {
  const m = MEDAL_COLORS[rank];
  return (
    <View style={[styles.medalBadge, { backgroundColor: m.bg, borderColor: m.border }]}>
      <Ionicons name="medal-outline" size={17} color={m.fg} />
    </View>
  );
}

// ─── Behavior row icons ───────────────────────────────────────────────────────

const BEHAVIOR_ROW_META: Record<string, { icon: string; color: string }> = {
  'Water column': { icon: 'layers-outline',    color: colors.contextFreshwater },
  'Forage':       { icon: 'fish-outline',       color: colors.contextFreshwater },
  'Speed':        { icon: 'flash-outline',      color: colors.contextFreshwater },
};

// ─── Family card (collapsible) ────────────────────────────────────────────────

function FamilyCard({
  family,
  rank,
  accentColor,
}: {
  family: RankedFamily;
  rank: number;
  accentColor: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const medalRank = (rank >= 1 && rank <= 3 ? rank : 1) as 1 | 2 | 3;

  return (
    <View style={[styles.familyCard, shadows.sm]}>
      {/* Left accent bar — thicker, same height as card */}
      <View style={[styles.familyAccentBar, { backgroundColor: accentColor }]} />

      <View style={styles.familyCardInner}>
        {/* Header: medal + name + optional rank context */}
        <View style={styles.familyHeaderRow}>
          <RankMedal rank={medalRank} />
          <View style={styles.familyTitleBlock}>
            <Text style={styles.familyName} numberOfLines={2}>
              {family.display_name}
            </Text>
            {!!family.rank_context && (
              <Text style={styles.rankContextText} numberOfLines={2}>
                {family.rank_context}
              </Text>
            )}
          </View>
        </View>

        {/* Expand toggle */}
        <View style={styles.toggleSeparator} />
        <TouchableOpacity
          style={styles.detailsToggle}
          onPress={() => setExpanded((v) => !v)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.detailsToggleText, { color: accentColor }]}>
            {expanded ? 'Hide details' : 'See details'}
          </Text>
          <Ionicons
            name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={15}
            color={accentColor}
          />
        </TouchableOpacity>

        {/* Expanded panels */}
        {expanded && (
          <View style={styles.detailsExpanded}>
            <View style={styles.gearPanel}>
              <View style={styles.gearPanelHeader}>
                <View style={[styles.gearPanelIconWrap, { borderColor: accentColor + '30' }]}>
                  <Ionicons name="fish-outline" size={14} color={accentColor} />
                </View>
                <Text style={styles.gearPanelTitle}>How to fish it</Text>
              </View>
              <Text style={styles.gearPanelBody}>{family.how_to_fish}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Behavior summary card ────────────────────────────────────────────────────

function BehaviorRow({ row }: { row: BehaviorSummaryRow }) {
  const meta = BEHAVIOR_ROW_META[row.label] ?? {
    icon: 'information-circle-outline',
    color: colors.primary,
  };
  return (
    <View style={styles.behaviorRow}>
      <View style={[styles.behaviorRowIconWrap, { backgroundColor: meta.color + '14' }]}>
        <Ionicons name={meta.icon as never} size={15} color={meta.color} />
      </View>
      <View style={styles.behaviorRowText}>
        <Text style={styles.behaviorRowLabel}>{row.label}</Text>
        <Text style={styles.behaviorRowDetail}>{row.detail}</Text>
      </View>
    </View>
  );
}

function BehaviorSummaryCard({
  rows,
  tidal_note,
}: {
  rows: [BehaviorSummaryRow, BehaviorSummaryRow, BehaviorSummaryRow];
  tidal_note?: string;
}) {
  return (
    <View style={[styles.behaviorCard, shadows.sm]}>
      {/* Card header */}
      <View style={styles.behaviorCardHeader}>
        <Text style={styles.behaviorCardTitle}>Fish behavior</Text>
        <Text style={styles.behaviorCardSubtitle}>
          Water column · Forage · Retrieve speed
        </Text>
      </View>

      {/* Rows */}
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

export function RecommenderView({ result, style, isRefreshing = false, onRefresh }: Props) {
  const [gearTab, setGearTab] = useState<'lure' | 'fly'>('lure');
  const accentColor = contextAccentColor(result.context);
  const families = gearTab === 'lure' ? result.lure_rankings : result.fly_rankings;
  const confColor = confidenceColor(result.confidence.tier);
  const generatedAtLabel = new Date(result.generated_at).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <ScrollView
      style={[styles.root, style]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header card ── */}
      <View style={[styles.headerCard, shadows.sm]}>
        {/* Context · Clarity · Confidence badges */}
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

        {/* Species */}
        <Text style={styles.headerSpecies}>{SPECIES_DISPLAY[result.species]}</Text>

        {/* Two-sentence pattern summary */}
        {!!result.primary_pattern_summary && (
          <Text style={styles.patternSummary}>{result.primary_pattern_summary}</Text>
        )}

        {/* Color of the Day */}
        {!!result.color_of_day && (
          <View style={styles.colorOfDayRow}>
            <View style={[styles.colorOfDayIconWrap, { backgroundColor: accentColor + '18' }]}>
              <Ionicons name="color-palette-outline" size={14} color={accentColor} />
            </View>
            <Text style={styles.colorOfDayLabel}>Best color direction</Text>
            <Text style={[styles.colorOfDayValue, { color: accentColor }]}>
              {result.color_of_day}
            </Text>
          </View>
        )}

        <View style={styles.headerMetaRow}>
          <Text style={styles.headerMetaText}>
            Updated {generatedAtLabel}
          </Text>
          {onRefresh && (
            <TouchableOpacity
              style={[styles.refreshChip, isRefreshing && styles.refreshChipDisabled]}
              onPress={onRefresh}
              activeOpacity={0.75}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <ActivityIndicator size="small" color={accentColor} />
              ) : (
                <Ionicons name="refresh-outline" size={13} color={accentColor} />
              )}
              <Text style={[styles.refreshChipText, { color: accentColor }]}>
                {isRefreshing ? 'Refreshing…' : 'Refresh picks'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Fish behavior ── */}
      <BehaviorSummaryCard
        rows={result.behavior.behavior_summary}
        tidal_note={result.behavior.tidal_note}
      />

      {/* ── Gear tabs ── */}
      <GearTabs active={gearTab} onChange={setGearTab} accentColor={accentColor} />

      {/* ── Family cards ── */}
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
            accentColor={accentColor}
          />
        ))
      )}

      {/* ── Footer ── */}
      <Text style={styles.generatedNote}>
        Updated {generatedAtLabel} · Refresh any time to pull the latest conditions
      </Text>
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
  patternSummary: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
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
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: 2,
  },
  headerMetaText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  refreshChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  refreshChipDisabled: {
    opacity: 0.8,
  },
  refreshChipText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },

  // ── Behavior card ─────────────────────────────────────────────────────────────
  behaviorCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 12,
  },
  behaviorCardHeader: {
    gap: 3,
  },
  behaviorCardTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.text,
    lineHeight: 22,
  },
  behaviorCardSubtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
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
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  behaviorRowIconWrap: {
    width: 30,
    height: 30,
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
    fontSize: 12,
    color: colors.primaryDark,
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  behaviorRowDetail: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  behaviorRowDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 56, // aligns under the text, not the icon
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
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
  },
  familyAccentBar: {
    width: 4,
  },
  familyCardInner: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  familyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  medalBadge: {
    borderRadius: radius.sm,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
    marginTop: 1,
  },
  familyTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  familyName: {
    fontFamily: fonts.serifBold,
    fontSize: 16,
    color: colors.text,
    lineHeight: 21,
  },
  rankContextText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: 3,
  },

  // Toggle
  toggleSeparator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsToggleText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },

  // Expanded panels
  detailsExpanded: {
    marginTop: 12,
    gap: spacing.sm,
  },
  gearPanel: {
    borderRadius: radius.md,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
  },
  gearPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  gearPanelIconWrap: {
    width: 24,
    height: 24,
    borderRadius: radius.xs,
    borderWidth: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  gearPanelTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.primaryDark,
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

  // ── Footer ────────────────────────────────────────────────────────────────────
  generatedNote: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
