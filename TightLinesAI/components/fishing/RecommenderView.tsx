/**
 * RecommenderView — renders the full recommender result.
 *
 * Layout:
 *   1. Header hero card (species, context badge, water clarity, confidence pill)
 *   2. Behavior summary card (3-line deterministic block)
 *   3. Lure / Fly sub-tabs
 *   4. Top ranked family cards — collapsed by default, expandable for full details
 *   5. Generated note footer
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../lib/theme';
import type {
  EngineContext,
  RankedFamily,
  RecommenderConfidenceTier,
  RecommenderResponse,
  WaterClarity,
} from '../../lib/recommenderContracts';
import {
  SPECIES_DISPLAY,
  WATER_CLARITY_LABELS,
} from '../../lib/recommenderContracts';

// ─── Context helpers ──────────────────────────────────────────────────────────

function contextAccentColor(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':    return colors.contextFreshwater;
    case 'freshwater_river':        return colors.contextRiver;
    default:                        return colors.contextFreshwater;
  }
}

function contextLabel(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':    return 'Lake / Pond';
    case 'freshwater_river':        return 'River';
    default:                        return 'Freshwater';
  }
}

function contextIcon(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':  return 'water-outline';
    case 'freshwater_river':      return 'git-merge-outline';
    default: return 'water-outline';
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
    case 'high':   return 'High confidence';
    case 'medium': return 'Moderate';
    case 'low':    return 'Low confidence';
  }
}

// ─── Score pill ───────────────────────────────────────────────────────────────

function ScorePill({ score }: { score: number }) {
  const color =
    score >= 70 ? colors.reportScoreGreen :
    score >= 45 ? colors.reportScoreYellow :
    colors.reportScoreRed;

  const bg =
    score >= 70 ? colors.reportScoreGreenBg :
    score >= 45 ? colors.reportScoreYellowBg :
    colors.reportScoreRedBg;

  return (
    <View style={[styles.scorePill, { backgroundColor: bg, borderColor: color }]}>
      <Text style={[styles.scorePillText, { color }]}>{score}</Text>
    </View>
  );
}

// ─── Detail row (inside expanded section) ────────────────────────────────────

function DetailRow({ icon, label, text }: { icon: string; label: string; text: string }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons
        name={icon as never}
        size={14}
        color={colors.primaryLight}
        style={styles.detailIcon}
      />
      <View style={styles.detailTextBlock}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailText}>{text}</Text>
      </View>
    </View>
  );
}

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

  return (
    <View style={[styles.familyCard, shadows.sm]}>
      {/* Accent left bar */}
      <View style={[styles.familyAccentBar, { backgroundColor: accentColor }]} />

      <View style={styles.familyCardInner}>
        {/* Header row */}
        <View style={styles.familyHeaderRow}>
          <View style={[styles.familyRankBadge, { backgroundColor: accentColor + '1A' }]}>
            <Text style={[styles.familyRankText, { color: accentColor }]}>#{rank}</Text>
          </View>
          <Text style={styles.familyName} numberOfLines={2}>
            {family.display_name}
          </Text>
          <ScorePill score={family.score} />
        </View>

        {/* Examples */}
        {family.examples.length > 0 && (
          <Text style={styles.familyExamples} numberOfLines={2}>
            e.g. {family.examples.slice(0, 3).join(' · ')}
          </Text>
        )}

        {/* Details toggle */}
        <TouchableOpacity
          style={styles.detailsToggle}
          onPress={() => setExpanded((v) => !v)}
          activeOpacity={0.7}
          hitSlop={8}
        >
          <Text style={[styles.detailsToggleText, { color: accentColor }]}>
            {expanded ? 'Hide details' : 'See details'}
          </Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={accentColor}
          />
        </TouchableOpacity>

        {/* Expanded detail rows */}
        {expanded && (
          <View style={styles.detailsExpanded}>
            <View style={styles.detailsDivider} />
            <DetailRow icon="checkmark-circle-outline" label="Why it works"    text={family.why_picked} />
            {!!family.where_to_start && (
              <DetailRow icon="navigate-outline"         label="Start here"      text={family.where_to_start} />
            )}
            <DetailRow icon="fish-outline"             label="Technique"       text={family.how_to_fish} />
            <DetailRow icon="time-outline"             label="Best when"       text={family.best_when} />
            <DetailRow icon="color-palette-outline"    label="Color guide"     text={family.color_guide} />
            {!!family.what_to_adjust_if_ignored && (
              <DetailRow icon="refresh-outline"          label="If they ignore it" text={family.what_to_adjust_if_ignored} />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Behavior summary card ────────────────────────────────────────────────────

function BehaviorSummaryCard({
  lines,
  tidal_note,
}: {
  lines: [string, string, string];
  tidal_note?: string;
}) {
  return (
    <View style={[styles.behaviorCard, shadows.sm]}>
      <View style={styles.behaviorTitleRow}>
        <View style={styles.behaviorTitleDot} />
        <Text style={styles.behaviorTitle}>Fish Behavior</Text>
      </View>
      {lines.map((line, i) => (
        <View key={i} style={styles.behaviorLine}>
          <View style={styles.behaviorBullet} />
          <Text style={styles.behaviorText}>{line}</Text>
        </View>
      ))}
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
            style={[
              styles.tab,
              isActive && { borderBottomColor: accentColor, borderBottomWidth: 2 },
            ]}
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
        {/* Context + water clarity row */}
        <View style={styles.headerTopRow}>
          <View style={[styles.contextBadge, { backgroundColor: accentColor + '18', borderColor: accentColor + '40' }]}>
            <Ionicons name={contextIcon(result.context) as never} size={12} color={accentColor} />
            <Text style={[styles.contextBadgeText, { color: accentColor }]}>
              {contextLabel(result.context)}
            </Text>
          </View>
          <Text style={styles.headerClarity}>
            {WATER_CLARITY_LABELS[result.water_clarity]} water
          </Text>
          <View style={[styles.confBadge, { backgroundColor: confColor + '18', borderColor: confColor + '40' }]}>
            <View style={[styles.confDot, { backgroundColor: confColor }]} />
            <Text style={[styles.confBadgeText, { color: confColor }]}>
              {confidenceLabel(result.confidence.tier)}
            </Text>
          </View>
        </View>

        {/* Species name */}
        <Text style={styles.headerSpecies}>{SPECIES_DISPLAY[result.species]}</Text>

        {/* Confidence reasons */}
        {result.confidence.reasons.length > 0 && (
          <Text style={styles.headerConfReason} numberOfLines={2}>
            {result.confidence.reasons[0]}
          </Text>
        )}
        {result.primary_pattern_summary && (
          <Text style={styles.patternSummary}>
            {result.primary_pattern_summary}
          </Text>
        )}
      </View>

      {/* ── Behavior summary ── */}
      <BehaviorSummaryCard
        lines={result.behavior.behavior_summary}
        tidal_note={result.behavior.tidal_note}
      />

      {/* ── Gear tabs ── */}
      <GearTabs active={gearTab} onChange={setGearTab} accentColor={accentColor} />

      {/* ── Family cards ── */}
      {families.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No {gearTab === 'lure' ? 'lure' : 'fly'} families matched this species + context.
            Try a different context or species.
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

      {/* ── Generated note ── */}
      <Text style={styles.generatedNote}>
        Generated {new Date(result.generated_at).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        })} · Updates with conditions
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
    paddingBottom: 48,
    gap: spacing.md,
  },

  // Header card
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  contextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  contextBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  headerClarity: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
  },
  confBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  confDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
  },
  confBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  headerSpecies: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    color: colors.text,
    lineHeight: 28,
  },
  headerConfReason: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  patternSummary: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },

  // Behavior summary
  behaviorCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 8,
  },
  behaviorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 2,
  },
  behaviorTitleDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: colors.primaryLight,
  },
  behaviorTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  behaviorLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  behaviorBullet: {
    width: 5,
    height: 5,
    borderRadius: 99,
    backgroundColor: colors.primaryLight,
    marginTop: 7,
    flexShrink: 0,
  },
  behaviorText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  tidalNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
    paddingTop: spacing.sm,
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

  // Gear tabs
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },

  // Family card
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
    padding: spacing.md,
  },
  familyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  familyRankBadge: {
    borderRadius: radius.full,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  familyRankText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  familyName: {
    flex: 1,
    fontFamily: fonts.serifBold,
    fontSize: 16,
    color: colors.text,
  },
  scorePill: {
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  scorePillText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  familyExamples: {
    fontFamily: fonts.bodyItalic,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },

  // Details toggle
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  detailsToggleText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },

  // Expanded details
  detailsExpanded: {
    marginTop: 4,
    gap: 10,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  detailIcon: {
    marginTop: 2,
  },
  detailTextBlock: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  detailText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },

  // Empty state
  emptyState: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Footer
  generatedNote: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
