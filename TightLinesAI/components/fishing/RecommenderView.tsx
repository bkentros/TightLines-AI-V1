/**
 * RecommenderView — full recommender result.
 *
 * Layout:
 *   0. Hero headline
 *   1. Header card (species · fish image · conditions · color of day · behavior)
 *   2. Decorative section break
 *   3. Two-column Lures / Flies header
 *   4. Ranked family cards (Gold / Silver / Bronze)
 *
 * Fix: two independent column Views with no flex:1 on cards — expanding any card
 * only affects its own column; the opposite column's layout is completely isolated.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  UIManager,
  type ViewStyle,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../lib/theme';
import { hapticSelection } from '../../lib/safeHaptics';
import { getSpeciesImage } from '../../lib/speciesImages';
import { getColorPaletteImage } from '../../lib/colorPaletteImages';
import { getLureImage } from '../../lib/lureImages';
import { getFlyImage } from '../../lib/flyImages';
import type { EngineContext, RankedFamily, RecommenderResponse, DepthLane, ForageMode } from '../../lib/recommenderContracts';
import {
  SPECIES_DISPLAY,
  WATER_CLARITY_LABELS,
} from '../../lib/recommenderContracts';

// ─── Label maps ───────────────────────────────────────────────────────────────

/** Vertical hold (surface → bottom), not shallow vs deep water at the spot. */
const DEPTH_LANE_LABEL: Record<DepthLane, string> = {
  surface:     'Surface (film / top)',
  upper:       'Upper (nearer surface)',
  mid:         'Mid-column',
  near_bottom: 'Lower (near bottom)',
  bottom:      'Bottom contact',
};

/** Sentence fragment for the lead-pick line — matches recommender engine meaning. */
const DEPTH_LANE_TARGET_PHRASE: Record<DepthLane, string> = {
  surface:     'the top of the water column — true surface feeds',
  upper:
    'the upper water column — nearer the surface than the bottom (can still be shallow-water flipping)',
  mid:         'the middle of the water column — between surface and bottom',
  near_bottom: 'the lower water column, tight to bottom',
  bottom:      'the bottom — bottom-contact presentations',
};

const FORAGE_LABEL: Record<ForageMode, string> = {
  baitfish:    'Baitfish',
  shrimp:      'Shrimp',
  crab:        'Crab',
  crawfish:    'Crawfish',
  leech:       'Leeches',
  surface_prey:'Surface prey',
  mixed:       'Mixed',
};

const DAILY_POSTURE_LABEL: Record<
  RecommenderResponse['daily_posture_band'],
  string
> = {
  suppressed: 'Suppressed',
  slightly_suppressed: 'Slightly Suppressed',
  neutral: 'Neutral',
  slightly_aggressive: 'Slightly Aggressive',
  aggressive: 'Aggressive',
};

const WATER_COLUMN_DISPLAY: Record<
  RecommenderResponse['likely_water_column_today'] | RecommenderResponse['typical_seasonal_water_column'],
  string
> = {
  top: 'Top',
  high_top: 'High / Top',
  high: 'High',
  mid_high: 'Mid / High',
  mid: 'Mid',
  mid_low: 'Mid / Low',
  low: 'Low',
};

const SEASONAL_LOCATION_DISPLAY: Record<
  RecommenderResponse['typical_seasonal_location'],
  string
> = {
  shallow: 'Shallow',
  shallow_mid: 'Shallow / Mid-depth',
  mid: 'Mid-depth',
  mid_deep: 'Mid-depth / Deep',
  deep: 'Deep',
};

const IMAGE_TX = { duration: 200 } as const;

// ─── Context helpers ──────────────────────────────────────────────────────────

function contextAccentColor(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond': return colors.contextFreshwater;
    case 'freshwater_river':     return colors.contextFreshwater;
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

// ─── Medal colors ─────────────────────────────────────────────────────────────

const MEDAL_COLORS = {
  1: { fg: '#C8960C', bg: 'rgba(200,150,12,0.18)', cardBg: 'rgba(200,150,12,0.06)', border: 'rgba(200,150,12,0.45)', label: 'Gold' },
  2: { fg: '#637D9B', bg: 'rgba(99,125,155,0.16)', cardBg: 'rgba(99,125,155,0.05)', border: 'rgba(99,125,155,0.38)', label: 'Silver' },
  3: { fg: '#9A5C2E', bg: 'rgba(154,92,46,0.15)',  cardBg: 'rgba(154,92,46,0.06)',  border: 'rgba(154,92,46,0.38)',  label: 'Bronze' },
} as const;

// ─── Behavior row icons ───────────────────────────────────────────────────────

const BEHAVIOR_ICON: Record<string, { icon: string }> = {
  'Where in the water': { icon: 'layers-outline' },
  Forage: { icon: 'fish-outline' },
  Speed: { icon: 'flash-outline' },
};

const ripple = { color: 'rgba(10,22,40,0.08)' };

// ─── Micro section label ──────────────────────────────────────────────────────

function MicroLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.microLabelRow}>
      <Ionicons name={icon as never} size={10} color={colors.primaryLight} />
      <Text style={styles.microLabelText}>{label.toUpperCase()}</Text>
    </View>
  );
}

// ─── Family card ──────────────────────────────────────────────────────────────

// Each FamilyCard manages its own expanded state independently.
// No flex:1 on the card — it sizes purely to its own content.
function FamilyCard({ family, rank, mode }: { family: RankedFamily; rank: number; mode: 'lure' | 'fly' }) {
  const [expanded, setExpanded] = useState(false);
  const medalRank = (rank >= 1 && rank <= 3 ? rank : 3) as 1 | 2 | 3;
  const medal = MEDAL_COLORS[medalRank];
  const lureImg = mode === 'fly' ? getFlyImage(family.family_id) : getLureImage(family.family_id);

  return (
    <View style={[styles.familyCard, { backgroundColor: medal.cardBg, borderColor: medal.border }]}>
      <View style={[styles.medalPill, { backgroundColor: medal.bg, borderColor: medal.border }]}>
        <Ionicons name="medal" size={13} color={medal.fg} />
        <Text style={[styles.medalPillText, { color: medal.fg }]}>{medal.label}</Text>
      </View>

      {lureImg ? (
        <View style={styles.familyImageWrap}>
          <ExpoImage
            source={lureImg}
            style={styles.familyImage}
            contentFit="contain"
            transition={IMAGE_TX}
            cachePolicy="memory-disk"
          />
        </View>
      ) : (
        <View style={styles.familyImagePlaceholder} />
      )}

      <View style={styles.familyCardDivider} />

      <Pressable
        style={({ pressed }) => [
          styles.familyFooterRow,
          Platform.OS === 'ios' && pressed && { opacity: 0.88 },
        ]}
        onPress={() => {
          hapticSelection();
          setExpanded((v) => !v);
        }}
        android_ripple={{ color: ripple.color }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {/* numberOfLines={2} + minHeight in style = all collapsed cards same height */}
        <Text style={styles.familyName} numberOfLines={2} ellipsizeMode="tail">
          {family.display_name}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={medal.fg}
        />
      </Pressable>

      {expanded && (
        <View style={[styles.gearPanel, { borderColor: medal.border }]}>
          <View style={styles.gearPanelHeader}>
            <Ionicons name="fish-outline" size={13} color={medal.fg} />
            <Text style={[styles.gearPanelTitle, { color: medal.fg }]}>Rig & fish</Text>
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
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const accentColor = contextAccentColor(result.context);
  const img = getSpeciesImage(result.species);
  const colorPaletteImg = getColorPaletteImage(result.presentation.color_family);

  return (
    <ScrollView
      style={[styles.root, style]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero headline ── */}
      <View style={styles.heroHeader}>
        <View style={styles.heroAccent}>
          <View style={styles.heroAccentLine} />
          <Ionicons name="fish-outline" size={13} color={colors.primary} />
          <View style={styles.heroAccentLine} />
        </View>
        <Text style={styles.heroTitle}>
          {"This is what we think\nwill work best today."}
        </Text>
      </View>

      {/* ── Header card ── */}
      <View style={[styles.headerCard, shadows.sm]}>

        {/* Fish image */}
        <View style={styles.fishImageWrap}>
          <View style={styles.fishStageOval} />
          {img ? (
            <ExpoImage
              source={img}
              style={styles.fishImage}
              contentFit="contain"
              transition={IMAGE_TX}
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={styles.fishImageFallback} />
          )}
        </View>

        {/* Species name */}
        <Text style={styles.headerSpecies} numberOfLines={2} ellipsizeMode="tail">
          {SPECIES_DISPLAY[result.species]}
        </Text>

        {/* ── CONDITIONS + COLOR OF DAY — side by side ── */}
        <View style={styles.conditionsColorRow}>
          {/* Left: Conditions */}
          <View style={styles.conditionsHalf}>
            <MicroLabel icon="location-outline" label="Conditions" />
            <View style={styles.conditionsBadges}>
              <View style={[styles.badge, { backgroundColor: accentColor + '15', borderColor: accentColor + '40' }]}>
                <Ionicons name={contextIcon(result.context) as never} size={11} color={accentColor} />
                <Text style={[styles.badgeText, { color: accentColor }]}>{contextLabel(result.context)}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: colors.background, borderColor: colors.borderLight }]}>
                <Ionicons name="eye-outline" size={11} color={colors.textSecondary} />
                <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                  {WATER_CLARITY_LABELS[result.water_clarity]}
                </Text>
              </View>
            </View>
          </View>

          {/* Vertical divider */}
          {!!result.color_of_day && <View style={styles.conditionsColorDivider} />}

          {/* Right: Color of Day */}
          {!!result.color_of_day && (
            <View style={styles.colorHalf}>
              <MicroLabel icon="color-palette-outline" label="Color of the Day" />
              <View style={styles.colorOfDayCompact}>
                <ExpoImage
                  source={colorPaletteImg}
                  style={styles.colorPaletteThumbSm}
                  contentFit="contain"
                  transition={IMAGE_TX}
                  cachePolicy="memory-disk"
                />
                <View style={styles.colorTextCol}>
                  <Text style={[styles.colorValue, { color: accentColor }]} numberOfLines={2} ellipsizeMode="tail">
                    {result.color_of_day}
                  </Text>
                  <Text style={styles.colorSubtext}>Recommended palette</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.cardSectionDivider} />

        <View style={styles.cardSection}>
          <MicroLabel icon="analytics-outline" label="Seasonal & Daily Read" />
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Daily Posture</Text>
              <Text style={styles.summaryValue}>
                {DAILY_POSTURE_LABEL[result.daily_posture_band]}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Typical Seasonal Water Column</Text>
              <Text style={styles.summaryValue}>
                {WATER_COLUMN_DISPLAY[result.typical_seasonal_water_column]}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Likely Water Column Today</Text>
              <Text style={styles.summaryValue}>
                {WATER_COLUMN_DISPLAY[result.likely_water_column_today]}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Typical Seasonal Fish Location</Text>
              <Text style={styles.summaryValue}>
                {SEASONAL_LOCATION_DISPLAY[result.typical_seasonal_location]}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardSectionDivider} />

        {/* ── VERTICAL POSITION + FORAGE ── */}
        <View style={styles.insightRow}>
          <View style={styles.insightItem}>
            <View style={[styles.insightIconWrap, { backgroundColor: accentColor + '14' }]}>
              <Ionicons name="layers-outline" size={13} color={accentColor} />
            </View>
            <View style={styles.insightTextCol}>
              <Text style={styles.microLabelText}>VERTICAL POSITION</Text>
              <Text style={styles.insightValue}>{DEPTH_LANE_LABEL[result.behavior.depth_lane]}</Text>
              <Text style={styles.insightHint}>
                Surface to bottom in the water — not whether the hole is deep or shallow overall.
              </Text>
            </View>
          </View>
          <View style={styles.insightDivider} />
          <View style={styles.insightItem}>
            <View style={[styles.insightIconWrap, { backgroundColor: accentColor + '14' }]}>
              <Ionicons name="fish-outline" size={13} color={accentColor} />
            </View>
            <View>
              <Text style={styles.microLabelText}>FORAGE</Text>
              <Text style={styles.insightValue}>
                {result.behavior.secondary_forage
                  ? `${FORAGE_LABEL[result.behavior.forage_mode]} & ${FORAGE_LABEL[result.behavior.secondary_forage]}`
                  : FORAGE_LABEL[result.behavior.forage_mode]}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardSectionDivider} />

        {/* ── LEAD PICK TIP ── */}
        <View style={styles.leadPickRow}>
          <Ionicons name="sparkles-outline" size={12} color={accentColor} />
          <Text style={styles.leadPickText}>
            {result.lure_rankings[0]?.display_name && result.fly_rankings[0]?.display_name
              ? `${result.lure_rankings[0].display_name} & ${result.fly_rankings[0].display_name} are the lead picks. Target ${DEPTH_LANE_TARGET_PHRASE[result.behavior.depth_lane]}.`
              : result.primary_pattern_summary ?? ''}
          </Text>
        </View>
      </View>

      {/* ── Section break ── */}
      <View style={styles.sectionBreak}>
        <View style={styles.sectionBreakLine} />
        <Ionicons name="fish-outline" size={12} color={colors.primaryMistDark} />
        <View style={styles.sectionBreakLine} />
      </View>

      {/* ── Lures / Flies column headers ── */}
      <View style={styles.colHeadersRow}>
        <View style={styles.colHeaderBlock}>
          <View style={styles.colHeaderInner}>
            <Ionicons name="ellipse-outline" size={11} color={colors.primaryDark} />
            <Text style={styles.colHeaderText}>LURES</Text>
          </View>
        </View>
        <View style={styles.colHeaderDivider} />
        <View style={styles.colHeaderBlock}>
          <View style={styles.colHeaderInner}>
            <Ionicons name="leaf-outline" size={11} color={colors.primaryDark} />
            <Text style={styles.colHeaderText}>FLIES</Text>
          </View>
        </View>
      </View>

      {/* ── Family card grid — two INDEPENDENT columns ──
          Each column is its own flex container so expanding a lure card
          has zero effect on the fly column's layout (and vice-versa). */}
      <View style={styles.columnsContainer}>
        {/* Lures column */}
        <View style={styles.column}>
          {result.lure_rankings.map((fam, i) => (
            <FamilyCard
              key={`lure-${fam.family_id}`}
              family={fam}
              rank={i + 1}
              mode="lure"
            />
          ))}
        </View>

        {/* Flies column */}
        <View style={styles.column}>
          {result.fly_rankings.map((fam, i) => (
            <FamilyCard
              key={`fly-${fam.family_id}`}
              family={fam}
              rank={i + 1}
              mode="fly"
            />
          ))}
        </View>
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: 56,
    gap: 10,
  },

  // Hero headline
  heroHeader: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: 4,
    gap: 10,
  },
  heroAccent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroAccentLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primaryMistDark,
    maxWidth: 44,
  },
  heroTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.4,
  },

  // Header card
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.primary + '55',
    gap: 0,
  },

  headerSpecies: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    color: colors.text,
    letterSpacing: -0.5,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    paddingBottom: 4,
  },

  // Water Column + Forage — two-up inline insight row
  insightRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: 11,
    paddingBottom: 12,
    gap: 0,
  },
  insightItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },
  insightTextCol: {
    flex: 1,
    minWidth: 0,
  },
  insightIconWrap: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  insightDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    alignSelf: 'stretch',
    marginHorizontal: 12,
    marginVertical: 2,
  },
  insightValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.text,
    marginTop: 3,
  },
  insightHint: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 14,
  },

  // Lead pick tip
  leadPickRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    paddingBottom: 14,
  },
  leadPickText: {
    flex: 1,
    fontFamily: fonts.bodyItalic,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Fish image — tinted oval "stage" behind the fish reduces dead white space
  fishImageWrap: {
    width: '100%',
    height: 124,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fishStageOval: {
    position: 'absolute',
    alignSelf: 'center',
    top: '17%',
    width: '78%',
    height: '72%',
    borderRadius: 999,
    backgroundColor: 'rgba(37, 85, 46, 0.045)',
  },
  fishImage: {
    position: 'absolute',
    top: '2%' as unknown as number,
    left: '-10%' as unknown as number,
    width: '120%',
    height: '120%',
  },
  fishImageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundAlt,
  },

  // Card sub-sections
  cardSection: {
    paddingHorizontal: spacing.md,
    paddingTop: 11,
    paddingBottom: 11,
    gap: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: colors.backgroundAlt,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 4,
  },
  summaryLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  summaryValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  cardSectionDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },

  // Micro label (CONDITIONS / COLOR OF THE DAY / BEHAVIOR)
  microLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  microLabelText: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    color: colors.primaryLight,
    letterSpacing: 0.8,
  },

  // Conditions + Color of Day — side by side
  conditionsColorRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: 11,
    paddingBottom: 11,
    alignItems: 'flex-start',
  },
  conditionsHalf: {
    flex: 1,
    gap: 7,
  },
  conditionsBadges: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'nowrap' as const,
    alignItems: 'center',
  },
  conditionsColorDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    alignSelf: 'stretch',
    marginHorizontal: 12,
    marginVertical: 2,
  },
  colorHalf: {
    flex: 1,
    gap: 7,
  },
  colorOfDayCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorPaletteThumbSm: {
    width: 48,
    height: 32,
    borderRadius: radius.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    flexShrink: 1,
  },
  badgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
  },

  // Color of day
  colorTextCol: {
    flex: 1,
    gap: 2,
  },
  colorValue: {
    fontFamily: fonts.serifBold,
    fontSize: 13,
    lineHeight: 17,
  },
  colorSubtext: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textMuted,
  },

  // Section break (between header card and columns)
  sectionBreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.sm,
    marginVertical: 2,
  },
  sectionBreakLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },

  // Column headers
  colHeadersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 0,
  },
  colHeaderBlock: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  colHeaderInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colHeaderDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.borderLight,
  },
  colHeaderText: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.primaryDark,
    letterSpacing: 1.6,
  },

  // Family card grid — two independent columns
  columnsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
    gap: 8,
  },

  // Family card — no flex: 1 here; column's default alignItems:stretch gives full width,
  // and the card sizes purely to its own content so sibling columns are never affected.
  familyCard: {
    borderRadius: radius.xl,
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
  familyCardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: -2,
  },
  familyFooterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: 2,
    // Reserves exactly 2 lines of text height so every collapsed card
    // footer is the same size regardless of how long the name is.
    minHeight: 44,
  },
  familyName: {
    fontFamily: fonts.serifBold,
    fontSize: 13,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
  gearPanel: {
    borderRadius: radius.md,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
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
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
});
