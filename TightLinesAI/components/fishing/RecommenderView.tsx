/**
 * RecommenderView — renders the full recommender result.
 *
 * Layout:
 *   1. Species + context header (accent bar)
 *   2. Behavior summary card (3-line deterministic block)
 *   3. Lure / Fly sub-tabs
 *   4. Top 3 ranked family cards (why, how, best_when, color_guide)
 *   5. Confidence footer
 *   6. Tidal note (if coastal)
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
  SpeciesGroup,
  WaterClarity,
} from '../../lib/recommenderContracts';
import {
  SPECIES_DISPLAY,
  WATER_CLARITY_LABELS,
} from '../../lib/recommenderContracts';

// ─── Context accent colors ────────────────────────────────────────────────────

function contextAccentColor(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':    return colors.contextFreshwater;
    case 'freshwater_river':        return colors.contextRiver;
    case 'coastal':                 return colors.contextCoastal;
    case 'coastal_flats_estuary':   return colors.contextFlatsEstuary;
  }
}

function contextLabel(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':    return 'Lake / Pond';
    case 'freshwater_river':        return 'River';
    case 'coastal':                 return 'Coastal Inshore';
    case 'coastal_flats_estuary':   return 'Flats & Estuary';
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
    case 'medium': return 'Moderate confidence';
    case 'low':    return 'Low confidence';
  }
}

// ─── Score pill ───────────────────────────────────────────────────────────────

function ScorePill({ score }: { score: number }) {
  const color =
    score >= 70 ? colors.reportScoreGreen :
    score >= 45 ? colors.reportScoreYellow :
    colors.reportScoreRed;

  return (
    <View style={[styles.scorePill, { borderColor: color }]}>
      <Text style={[styles.scorePillText, { color }]}>{score}</Text>
    </View>
  );
}

// ─── Family card ──────────────────────────────────────────────────────────────

function FamilyCard({
  family,
  rank,
  accentColor,
}: {
  family: RankedFamily;
  rank: number;
  accentColor: string;
}) {
  return (
    <View style={[styles.familyCard, shadows.md]}>
      {/* Accent left bar */}
      <View style={[styles.familyAccentBar, { backgroundColor: accentColor }]} />

      <View style={styles.familyCardInner}>
        {/* Header row */}
        <View style={styles.familyHeaderRow}>
          <View style={styles.familyRankBadge}>
            <Text style={styles.familyRankText}>#{rank}</Text>
          </View>
          <Text style={styles.familyName} numberOfLines={1}>
            {family.display_name}
          </Text>
          <ScorePill score={family.score} />
        </View>

        {/* Examples */}
        {family.examples.length > 0 && (
          <Text style={styles.familyExamples} numberOfLines={1}>
            e.g. {family.examples.slice(0, 3).join(' · ')}
          </Text>
        )}

        <View style={styles.familyDivider} />

        {/* Why picked */}
        <Row icon="checkmark-circle-outline" label="Why" text={family.why_picked} />

        {/* How to fish */}
        <Row icon="fish-outline" label="Technique" text={family.how_to_fish} />

        {/* Best when */}
        <Row icon="time-outline" label="Best when" text={family.best_when} />

        {/* Color guide */}
        <Row icon="color-palette-outline" label="Color" text={family.color_guide} />
      </View>
    </View>
  );
}

function Row({
  icon,
  label,
  text,
}: {
  icon: string;
  label: string;
  text: string;
}) {
  return (
    <View style={styles.factorRow}>
      <Ionicons
        name={icon as never}
        size={15}
        color={colors.primaryLight}
        style={styles.factorIcon}
      />
      <View style={styles.factorTextBlock}>
        <Text style={styles.factorLabel}>{label}</Text>
        <Text style={styles.factorText}>{text}</Text>
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
      <Text style={styles.behaviorTitle}>Fish Behavior</Text>
      {lines.map((line, i) => (
        <View key={i} style={styles.behaviorLine}>
          <View style={styles.behaviorDot} />
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

// ─── Confidence footer ────────────────────────────────────────────────────────

function ConfidenceFooter({
  tier,
  reasons,
}: {
  tier: RecommenderConfidenceTier;
  reasons: string[];
}) {
  const color = confidenceColor(tier);
  return (
    <View style={styles.confidenceCard}>
      <View style={styles.confidenceHeader}>
        <View style={[styles.confidenceDot, { backgroundColor: color }]} />
        <Text style={[styles.confidenceLabel, { color }]}>{confidenceLabel(tier)}</Text>
      </View>
      {reasons.map((r, i) => (
        <Text key={i} style={styles.confidenceReason}>
          {r}
        </Text>
      ))}
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

  return (
    <ScrollView
      style={[styles.root, style]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={[styles.header, { borderLeftColor: accentColor }]}>
        <Text style={styles.headerSpecies}>{SPECIES_DISPLAY[result.species]}</Text>
        <View style={styles.headerMeta}>
          <Text style={[styles.headerContext, { color: accentColor }]}>
            {contextLabel(result.context)}
          </Text>
          <View style={styles.headerDot} />
          <Text style={styles.headerClarity}>
            {WATER_CLARITY_LABELS[result.water_clarity]} water
          </Text>
        </View>
      </View>

      {/* ── Behavior summary ── */}
      <BehaviorSummaryCard
        lines={result.behavior.behavior_summary}
        tidal_note={result.behavior.tidal_note}
      />

      {/* ── Gear tabs ── */}
      <GearTabs active={gearTab} onChange={setGearTab} accentColor={accentColor} />

      {/* ── Family scope note for fly / trout ── */}
      {gearTab === 'fly' && result.species === 'river_trout' && (
        <View style={styles.scopeNote}>
          <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
          <Text style={styles.scopeNoteText}>
            V1 fly recommendations are streamers only. Nymph and dry fly coverage coming soon.
          </Text>
        </View>
      )}

      {/* ── Family cards ── */}
      {families.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No {gearTab === 'lure' ? 'lure' : 'fly'} families matched this species + context
            combination. Try a different context or species.
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

      {/* ── Confidence footer ── */}
      <ConfidenceFooter
        tier={result.confidence.tier}
        reasons={result.confidence.reasons}
      />

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
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },

  // Header
  header: {
    borderLeftWidth: 4,
    paddingLeft: spacing.md,
    paddingVertical: spacing.xs,
  },
  headerSpecies: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.text,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  headerContext: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  headerDot: {
    width: 3,
    height: 3,
    borderRadius: 99,
    backgroundColor: colors.textMuted,
  },
  headerClarity: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },

  // Behavior summary
  behaviorCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  behaviorTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  behaviorLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: 6,
  },
  behaviorDot: {
    width: 5,
    height: 5,
    borderRadius: 99,
    backgroundColor: colors.primaryLight,
    marginTop: 7,
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
    marginTop: spacing.sm,
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

  // Scope note
  scopeNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: colors.backgroundAlt,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  scopeNoteText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },

  // Family card
  familyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
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
    backgroundColor: colors.backgroundAlt,
    borderRadius: radius.full,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  familyRankText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.textSecondary,
  },
  familyName: {
    flex: 1,
    fontFamily: fonts.serifBold,
    fontSize: 16,
    color: colors.text,
  },
  scorePill: {
    borderRadius: radius.full,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  scorePillText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  familyExamples: {
    fontFamily: fonts.bodyItalic,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  familyDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: spacing.sm,
  },

  // Factor rows
  factorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: 8,
  },
  factorIcon: {
    marginTop: 1,
  },
  factorTextBlock: {
    flex: 1,
  },
  factorLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  factorText: {
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

  // Confidence
  confidenceCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
  },
  confidenceLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  confidenceReason: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 3,
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
