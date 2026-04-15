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

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={styles.chipValue}>{value}</Text>
    </View>
  );
}

function RecommendationCard(
  { item, index, mode }: { item: RankedRecommendation; index: number; mode: 'lure' | 'fly' },
) {
  const image = mode === 'lure' ? getLureImage(item.id) : getFlyImage(item.id);

  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.rankPill}>
          <Text style={styles.rankPillText}>#{index + 1}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.display_name}</Text>
      </View>

      {image ? (
        <ExpoImage
          source={image}
          style={styles.cardImage}
          contentFit="contain"
          transition={IMAGE_TX}
          cachePolicy="memory-disk"
        />
      ) : null}

      <View style={styles.metaRow}>
        <SummaryChip label="Color" value={item.color_style} />
        <SummaryChip label="Family" value={item.family_group.replaceAll('_', ' ')} />
      </View>

      <View style={styles.metaRow}>
        <SummaryChip label="Column" value={COLUMN_LABEL[item.primary_column]} />
        <SummaryChip label="Pace" value={PACE_LABEL[item.pace]} />
        <SummaryChip label="Presence" value={PRESENCE_LABEL[item.presence]} />
      </View>

      <View style={styles.reasonBox}>
        <Text style={styles.reasonLabel}>Why chosen</Text>
        <Text style={styles.reasonText}>{item.why_chosen}</Text>
      </View>

      <View style={styles.reasonBox}>
        <Text style={styles.reasonLabel}>How to fish</Text>
        <Text style={styles.reasonText}>{item.how_to_fish}</Text>
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
  const mixSummary = opportunityMixSummarySentence(daily.opportunity_mix);
  const surfaceNote = surfaceContextNote(daily.surface_allowed_today, daily.surface_window);
  const sectionIntro = opportunityMixSectionIntro(daily.opportunity_mix);

  return (
    <ScrollView
      style={[styles.root, style]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.eyebrow}>Lure & Fly Recommender</Text>
            <Text style={styles.title}>
              {SPECIES_DISPLAY[result.species]} · {contextLabel(result.context)}
            </Text>
            <Text style={styles.subtitle}>
              Water clarity: {WATER_CLARITY_LABELS[result.water_clarity]}
            </Text>
          </View>
          {speciesImage ? (
            <ExpoImage
              source={speciesImage}
              style={styles.speciesImage}
              contentFit="contain"
              transition={IMAGE_TX}
              cachePolicy="memory-disk"
            />
          ) : null}
        </View>

        <View style={styles.metaRow}>
          <SummaryChip
            label="Primary forage"
            value={result.summary.monthly_forage.primary.replaceAll('_', ' ')}
          />
          <SummaryChip
            label="Daily column"
            value={COLUMN_LABEL[result.summary.daily_tactical_preference.preferred_column]}
          />
          <SummaryChip
            label="Daily pace"
            value={PACE_LABEL[result.summary.daily_tactical_preference.preferred_pace]}
          />
        </View>

        <View style={styles.metaRow}>
          <SummaryChip
            label="Daily presence"
            value={PRESENCE_LABEL[result.summary.daily_tactical_preference.preferred_presence]}
          />
          <SummaryChip
            label="Surface"
            value={result.summary.daily_tactical_preference.surface_allowed_today ? 'Open' : 'Closed'}
          />
          <SummaryChip
            label="Mix"
            value={daily.opportunity_mix}
          />
        </View>

        <View style={styles.contextNotesBlock}>
          <Text style={styles.contextNoteLine}>{mixSummary}</Text>
          {surfaceNote ? (
            <Text style={styles.contextNoteLine}>{surfaceNote}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="fish-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>Top 3 Lures</Text>
        </View>
        <Text style={styles.sectionIntro}>{sectionIntro}</Text>
        {result.lure_recommendations.map((item, index) => (
          <RecommendationCard key={item.id} item={item} index={index} mode="lure" />
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="water-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>Top 3 Flies</Text>
        </View>
        <Text style={styles.sectionIntro}>{sectionIntro}</Text>
        {result.fly_recommendations.map((item, index) => (
          <RecommendationCard key={item.id} item={item} index={index} mode="fly" />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerTextWrap: {
    flex: 1,
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.primary,
    fontFamily: fonts.medium,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 24,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  contextNotesBlock: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  contextNoteLine: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionIntro: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  speciesImage: {
    width: 96,
    height: 96,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rankPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.round,
    backgroundColor: 'rgba(31, 107, 190, 0.12)',
  },
  rankPillText: {
    color: colors.primary,
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  cardTitle: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 18,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 2,
  },
  chipLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipValue: {
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  reasonBox: {
    gap: spacing.xs,
  },
  reasonLabel: {
    color: colors.primary,
    fontFamily: fonts.bold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonText: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});
