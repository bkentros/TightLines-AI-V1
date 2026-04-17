/**
 * Recommender — polished results report.
 * Visual language lifted from How's Fishing (RebuildReportView): tinted hero card,
 * band-style badge, chip rows over a divider, icon-box section headers,
 * rank medallions, and accent-bar reason boxes. Theme-only tokens.
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, shadows, spacing } from '../../lib/theme';
import { getSpeciesImage } from '../../lib/speciesImages';
import { getFlyImage } from '../../lib/flyImages';
import { getLureImage } from '../../lib/lureImages';
import type {
  DailySurfaceWindow,
  EngineContext,
  OpportunityMixMode,
  RankedRecommendation,
  RecommenderResponse,
  TacticalColumn,
  TacticalPace,
  TacticalPresence,
} from '../../lib/recommenderContracts';
import { SPECIES_DISPLAY, WATER_CLARITY_LABELS } from '../../lib/recommenderContracts';

const IMAGE_TX = { duration: 200 } as const;

const COLUMN_LABEL: Record<TacticalColumn, string> = {
  bottom: 'Bottom',
  mid: 'Mid',
  upper: 'Upper',
  surface: 'Surface',
};

const PACE_LABEL: Record<TacticalPace, string> = {
  slow: 'Slow',
  medium: 'Medium',
  fast: 'Fast',
};

const PRESENCE_LABEL: Record<TacticalPresence, string> = {
  subtle: 'Subtle',
  moderate: 'Moderate',
  bold: 'Bold',
};

const MIX_CONFIG: Record<OpportunityMixMode, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = {
  aggressive:   { label: 'Aggressive', color: '#2E6F40', bg: '#E6F5EB', border: '#2E6F4030', icon: 'flame' },
  balanced:     { label: 'Balanced',   color: '#3A8A54', bg: '#EEF8F2', border: '#3A8A5428', icon: 'thumbs-up' },
  conservative: { label: 'Conservative', color: '#C29B2A', bg: '#FDF6E8', border: '#C29B2A28', icon: 'partly-sunny-outline' },
};

function contextLabel(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':
      return 'Lake / Pond';
    case 'freshwater_river':
      return 'River';
    default:
      return 'Freshwater';
  }
}

function opportunityMixSummarySentence(mix: OpportunityMixMode): string {
  switch (mix) {
    case 'conservative':
      return "Today's setup rewards careful, tighter-window presentations.";
    case 'balanced':
      return "Today's setup supports a balanced mix of safe and active looks.";
    case 'aggressive':
      return "Today's setup supports more aggressive, search-oriented options.";
  }
}

function opportunityMixSectionIntro(mix: OpportunityMixMode): string {
  switch (mix) {
    case 'conservative':
      return "These three stay inside today's tighter feeding window.";
    case 'balanced':
      return 'These three give you the best fit, a complementary alternate, and a justified change-up.';
    case 'aggressive':
      return "These three lean into today's stronger feeding window while keeping one backup look available.";
  }
}

/** Deterministic copy from engine summary only; omits when there is no user-facing surface story. */
function surfaceContextNote(
  surfaceAllowedToday: boolean,
  surfaceWindow: DailySurfaceWindow,
): string | null {
  if (!surfaceAllowedToday) {
    return 'True surface is shut down today.';
  }
  if (surfaceWindow === 'clean') {
    return 'True surface is in play today.';
  }
  if (surfaceWindow === 'rippled') {
    return 'Surface is still in play, but chop favors sturdier surface looks.';
  }
  return null;
}

function toTitleCase(raw: string): string {
  return raw
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={styles.chipValue}>{value}</Text>
    </View>
  );
}

function RecommendationCard({
  item,
  index,
  mode,
}: {
  item: RankedRecommendation;
  index: number;
  mode: 'lure' | 'fly';
}) {
  const image = mode === 'lure' ? getLureImage(item.id) : getFlyImage(item.id);

  return (
    <View style={styles.card}>
      {/* Top row: rank medallion + title + surface indicator */}
      <View style={styles.cardTopRow}>
        <View style={styles.rankMedal}>
          <Text style={styles.rankMedalText}>{index + 1}</Text>
        </View>
        <View style={styles.cardTitleWrap}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.display_name}</Text>
          <Text style={styles.cardSubtitle}>
            {toTitleCase(item.family_group)} · {toTitleCase(item.color_style)}
          </Text>
        </View>
      </View>

      {/* Image band — on soft mint canvas so lures/flies read cleanly */}
      {image ? (
        <View style={styles.cardImageWrap}>
          <ExpoImage
            source={image}
            style={styles.cardImage}
            contentFit="contain"
            transition={IMAGE_TX}
            cachePolicy="memory-disk"
          />
        </View>
      ) : null}

      {/* Tactical meta — three compact chips on a single row */}
      <View style={styles.cardMetaRow}>
        <SummaryChip label="Column" value={COLUMN_LABEL[item.primary_column]} />
        <SummaryChip label="Pace" value={PACE_LABEL[item.pace]} />
        <SummaryChip label="Presence" value={PRESENCE_LABEL[item.presence]} />
      </View>

      {/* Divider — same rhythm as How's Fishing reason separator */}
      <View style={styles.reasonSep}>
        <View style={styles.reasonSepLine} />
        <Text style={styles.reasonSepLabel}>Why & How</Text>
        <View style={styles.reasonSepLine} />
      </View>

      {/* Reason blocks — tipCard accent-bar idiom */}
      <View style={styles.reasonBlock}>
        <View style={styles.reasonBar} />
        <View style={styles.reasonBody}>
          <Text style={styles.reasonLabel}>Why chosen</Text>
          <Text style={styles.reasonText}>{item.why_chosen}</Text>
        </View>
      </View>

      <View style={styles.reasonBlock}>
        <View style={[styles.reasonBar, styles.reasonBarSoft]} />
        <View style={styles.reasonBody}>
          <Text style={[styles.reasonLabel, styles.reasonLabelSoft]}>How to fish</Text>
          <Text style={styles.reasonText}>{item.how_to_fish}</Text>
        </View>
      </View>
    </View>
  );
}

type Props = {
  result: RecommenderResponse;
  style?: ViewStyle;
};

export function RecommenderView({ result, style }: Props) {
  const speciesImage = getSpeciesImage(result.species);
  const daily = result.summary.daily_tactical_preference;
  const mix = MIX_CONFIG[daily.opportunity_mix];
  const mixSummary = opportunityMixSummarySentence(daily.opportunity_mix);
  const surfaceNote = surfaceContextNote(daily.surface_allowed_today, daily.surface_window);
  const sectionIntro = opportunityMixSectionIntro(daily.opportunity_mix);

  return (
    <ScrollView
      style={[styles.root, style]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ═══════════════════════════════════════════════════
          HERO — mirrors How's Fishing scoreCard language
      ═══════════════════════════════════════════════════ */}
      <View style={[styles.heroCard, { backgroundColor: mix.bg, borderColor: mix.border }]}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroLeft}>
            <View style={[styles.mixBadge, { backgroundColor: mix.color }]}>
              <Ionicons name={mix.icon} size={11} color="#FFF" />
              <Text style={styles.mixBadgeText}>{mix.label}</Text>
            </View>
            <Text style={styles.heroEyebrow}>Lure & Fly Plan</Text>
            <Text style={styles.heroTitle}>
              {SPECIES_DISPLAY[result.species]}
            </Text>
            <Text style={styles.heroSubtitle}>
              {contextLabel(result.context)} · {WATER_CLARITY_LABELS[result.water_clarity]} water
            </Text>
          </View>
          {speciesImage ? (
            <ExpoImage
              source={speciesImage}
              style={styles.heroSpeciesImage}
              contentFit="contain"
              transition={IMAGE_TX}
              cachePolicy="memory-disk"
            />
          ) : null}
        </View>

        <View style={styles.heroDivider} />

        <Text style={styles.heroSummary}>{mixSummary}</Text>
        {surfaceNote ? <Text style={styles.heroNote}>{surfaceNote}</Text> : null}
      </View>

      {/* ═══════════════════════════════════════════════════
          DAILY TACTICAL PREFERENCE — chip summary card
      ═══════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <View style={[styles.sectionIconBox, { backgroundColor: colors.primaryMist }]}>
            <Ionicons name="stats-chart" size={14} color={colors.primary} />
          </View>
          <Text style={styles.sectionHeaderTitle}>Today's Preference</Text>
        </View>

        <View style={styles.cardMetaRow}>
          <SummaryChip
            label="Forage"
            value={toTitleCase(result.summary.monthly_forage.primary)}
          />
          <SummaryChip
            label="Column"
            value={COLUMN_LABEL[daily.preferred_column]}
          />
          <SummaryChip
            label="Pace"
            value={PACE_LABEL[daily.preferred_pace]}
          />
        </View>
        <View style={styles.cardMetaRow}>
          <SummaryChip
            label="Presence"
            value={PRESENCE_LABEL[daily.preferred_presence]}
          />
          <SummaryChip
            label="Surface"
            value={daily.surface_allowed_today ? 'Open' : 'Closed'}
          />
        </View>
      </View>

      {/* ═══════════════════════════════════════════════════
          TOP 3 LURES
      ═══════════════════════════════════════════════════ */}
      <View style={styles.sectionGroup}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionEyebrowRow}>
            <View style={styles.sectionEyebrowLine} />
            <Ionicons name="fish-outline" size={12} color={colors.primary} />
            <Text style={styles.sectionEyebrowText}>TOP 3 LURES</Text>
            <View style={styles.sectionEyebrowLine} />
          </View>
          <Text style={styles.sectionIntro}>{sectionIntro}</Text>
        </View>
        {result.lure_recommendations.map((item, index) => (
          <RecommendationCard key={item.id} item={item} index={index} mode="lure" />
        ))}
      </View>

      {/* ═══════════════════════════════════════════════════
          TOP 3 FLIES
      ═══════════════════════════════════════════════════ */}
      <View style={styles.sectionGroup}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionEyebrowRow}>
            <View style={styles.sectionEyebrowLine} />
            <Ionicons name="water-outline" size={12} color={colors.primary} />
            <Text style={styles.sectionEyebrowText}>TOP 3 FLIES</Text>
            <View style={styles.sectionEyebrowLine} />
          </View>
          <Text style={styles.sectionIntro}>{sectionIntro}</Text>
        </View>
        {result.fly_recommendations.map((item, index) => (
          <RecommendationCard key={item.id} item={item} index={index} mode="fly" />
        ))}
      </View>
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
    paddingHorizontal: 20,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },

  // ── Hero card (mirrors How's Fishing scoreCard) ───────────────
  heroCard: {
    borderRadius: radius.lg,
    padding: spacing.md + 4,
    borderWidth: 1.5,
    ...shadows.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  heroLeft: {
    flex: 1,
    gap: spacing.xs,
  },
  mixBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    marginBottom: spacing.xs,
  },
  mixBadgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: '#FFF',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  heroEyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    color: colors.text,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  heroSubtitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },
  heroSpeciesImage: {
    width: 96,
    height: 96,
  },
  heroDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  heroSummary: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
  },
  heroNote: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  // ── Generic card (mirrors How's Fishing card) ─────────────────
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm + 2,
    ...shadows.md,
  },

  // Section header rows INSIDE a card (icon box + uppercase label)
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionIconBox: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    flex: 1,
  },

  // ── Section group header (Dashboard sectionDividerRow idiom) ──
  sectionGroup: {
    gap: spacing.sm + 4,
    marginTop: spacing.xs,
  },
  sectionHeader: {
    gap: spacing.xs + 2,
    marginBottom: spacing.xs,
  },
  sectionEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionEyebrowLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  sectionEyebrowText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.4,
  },
  sectionIntro: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },

  // ── Recommendation card ───────────────────────────────────────
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  rankMedal: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  rankMedalText: {
    fontFamily: fonts.serifBold,
    fontSize: 15,
    color: '#FFF',
  },
  cardTitleWrap: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.text,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  cardSubtitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 0.1,
  },
  cardImageWrap: {
    backgroundColor: colors.primaryMist + '55',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardImage: {
    width: '100%',
    height: 130,
  },
  cardMetaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  // ── Chip (mirrors How's Fishing chip rhythm) ──────────────────
  chip: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.backgroundAlt,
    gap: 2,
    alignItems: 'flex-start',
  },
  chipLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  chipValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.text,
    letterSpacing: -0.1,
  },

  // ── Reason separator (mirrors How's Fishing reasonSep) ────────
  reasonSep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
    marginBottom: 2,
  },
  reasonSepLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  reasonSepLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // ── Reason block (mirrors How's Fishing tipCard accent bar) ───
  reasonBlock: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
    alignItems: 'flex-start',
  },
  reasonBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    alignSelf: 'stretch',
    minHeight: 20,
    opacity: 0.7,
  },
  reasonBarSoft: {
    backgroundColor: colors.primaryLight,
    opacity: 0.55,
  },
  reasonBody: {
    flex: 1,
    gap: 2,
  },
  reasonLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.0,
  },
  reasonLabelSoft: {
    color: colors.primaryLight,
  },
  reasonText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
  },
});
