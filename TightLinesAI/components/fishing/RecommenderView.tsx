/**
 * RecommenderView — FinFindr "What to Throw Today" experience.
 *
 * Renders the daily-picks 2x2 future response:
 * top lure, honorable lure, top fly, and honorable fly.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../../lib/theme';
import {
  CornerMarkSet,
  PaperBackground,
  SectionEyebrow,
  TopographicLines,
} from '../paper';
import { getSpeciesImage } from '../../lib/speciesImages';
import { getFlyImage } from '../../lib/flyImages';
import { getLureImage } from '../../lib/lureImages';
import type {
  DailyPicksResponse,
  DailyPicksResponsePick,
  DailyPicksSpecies,
  DailyPicksVariant,
  EngineContext,
  SpeciesGroup,
  TacticalColumn,
  TacticalPace,
} from '../../lib/recommenderContracts';
import {
  SPECIES_DISPLAY,
  WATER_CLARITY_LABELS,
} from '../../lib/recommenderContracts';


/**
 * Tackle-box brand gold — pulled from the home dashboard's Tackle Box
 * module-row palette (iconBorder #C99B2D). Used as the TOP PICK accent
 * so the badge feels like a "winner" ribbon tied to this feature's
 * visual identity. Soft cream chip background pairs with it.
 */
const GOLD_ACCENT = '#C99B2D';
const GOLD_SOFT = '#FBF1D9';
const GOLD_INK = '#8A6A1A';

const COLUMN_LABEL: Record<TacticalColumn, string> = {
  bottom: 'Bottom',
  mid: 'Mid',
  upper: 'Upper',
  surface: 'Surface',
};

const COLUMN_ORDER: TacticalColumn[] = ['surface', 'upper', 'mid', 'bottom'];

const PACE_LABEL: Record<TacticalPace, string> = {
  slow: 'Slow',
  medium: 'Medium',
  fast: 'Fast',
};

const DAILY_SPECIES_TO_UI_SPECIES: Record<DailyPicksSpecies, SpeciesGroup> = {
  largemouth_bass: 'largemouth_bass',
  smallmouth_bass: 'smallmouth_bass',
  northern_pike: 'pike_musky',
  trout: 'river_trout',
};

const SPECIES_SUBTITLE: Record<DailyPicksSpecies, string> = {
  largemouth_bass: 'Micropterus salmoides',
  smallmouth_bass: 'Micropterus dolomieu',
  northern_pike: 'Esox lucius',
  trout: 'Salmonidae spp.',
};

const ACTIVITY_LABEL: Record<DailyPicksResponse['scenario_summary']['activity_level'], string> = {
  suppressed: 'Suppressed',
  neutral: 'Neutral',
  active: 'Active',
  high_opportunity: 'High Opportunity',
};

const GOAL_LABEL: Record<DailyPicksResponse['recommendation_goal'], string> = {
  all_purpose: 'All Purpose',
  big_fish: 'Big Fish',
};

const VARIANT_LABEL: Record<DailyPicksVariant, string> = {
  A: 'First Pass',
  B: 'Changeup',
};

function contextLabel(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':
      return 'LAKE / POND';
    case 'freshwater_river':
      return 'RIVER / STREAM';
    case 'coastal':
      return 'COASTAL';
    case 'coastal_flats_estuary':
      return 'FLATS / ESTUARY';
    default:
      return 'FRESHWATER';
  }
}

function clarityLabelUpper(clarity: DailyPicksResponse['water_clarity']): string {
  return (WATER_CLARITY_LABELS[clarity] ?? 'Clarity').toUpperCase();
}

function toTitleCase(raw: string): string {
  return raw
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function dailySpeciesDisplay(species: DailyPicksSpecies): string {
  return SPECIES_DISPLAY[DAILY_SPECIES_TO_UI_SPECIES[species]];
}

function dailySpeciesImage(species: DailyPicksSpecies) {
  return getSpeciesImage(DAILY_SPECIES_TO_UI_SPECIES[species]);
}

function paceLabel(pick: DailyPicksResponsePick): string {
  const primary = PACE_LABEL[pick.primary_pace];
  return pick.secondary_pace ? `${primary} / ${PACE_LABEL[pick.secondary_pace]}` : primary;
}

function guideRoleLine(pick: DailyPicksResponsePick): string {
  const presentation = pick.presentation_group;
  const family = pick.family_group;

  if (pick.gear_mode === 'fly') {
    if (presentation.includes('surface_fly_popper')) return 'Surface popper profile';
    if (presentation.includes('surface_fly_slider')) return 'Surface slider profile';
    if (presentation.includes('surface_fly_gurgler')) return 'Surface wake-and-gurgle profile';
    if (presentation.includes('surface_fly_frog_mouse')) return 'Surface cover profile';
    if (presentation.includes('big_articulated_streamer')) return 'Big articulated streamer';
    if (presentation.includes('baitfish_slider')) return 'High-riding baitfish slider';
    if (presentation.includes('baitfish_streamer')) return 'Baitfish streamer profile';
    if (presentation.includes('leech_bugger')) return 'Leech / bugger profile';
    if (presentation.includes('crawfish_fly')) return 'Bottom-crawling craw profile';
    if (presentation.includes('worm_fly')) return 'Slow bottom worm profile';
    return 'Guide-selected fly profile';
  }

  if (presentation.includes('spinner_vibration')) return 'Vibration search bait';
  if (presentation.includes('swimbait') || presentation.includes('pike_jig')) return 'Steady baitfish swimmer';
  if (presentation.includes('glidebait')) return 'Big-fish follower bait';
  if (presentation.includes('jerkbait')) return 'Pause-and-flash baitfish profile';
  if (presentation.includes('crankbait')) return 'Contact search bait';
  if (presentation.includes('blade_spoon')) return 'Flash / flutter profile';
  if (presentation.includes('topwater_frog')) return 'Cover topwater profile';
  if (presentation.includes('topwater_open') || presentation.includes('trout_surface_plug')) {
    return 'Surface commotion profile';
  }
  if (presentation.includes('bottom_jig_craw')) return 'Bottom-contact craw profile';
  if (presentation.includes('ned_tube_finesse')) return 'Finesse bottom-contact profile';
  if (presentation.includes('worm_finesse')) return 'Finesse bite-getter profile';
  if (presentation.includes('worm_power')) return 'Big-worm bottom profile';
  if (family.includes('hair_jig')) return 'Subtle hair-jig drift';
  return 'Guide-selected lure profile';
}

function formatGeneratedAt(result: DailyPicksResponse, timeZone?: string): string {
  const generated = new Date(result.generated_at);
  if (!Number.isFinite(generated.getTime())) return result.local_date;
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };
  if (timeZone) options.timeZone = timeZone;
  return new Intl.DateTimeFormat(undefined, options).format(generated);
}

function WaterColumnDiagram({ active }: { active: TacticalColumn }) {
  return (
    <View style={styles.columnDiagram}>
      {COLUMN_ORDER.map((col) => {
        const isActive = col === active;
        return (
          <View key={col} style={styles.columnCell}>
            <View style={[styles.columnBar, isActive && styles.columnBarActive]}>
              {isActive ? <View style={styles.columnDot} /> : null}
            </View>
            <Text
              style={[styles.columnLabel, isActive && styles.columnLabelActive]}
              numberOfLines={1}
            >
              {COLUMN_LABEL[col].toUpperCase()}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/**
 * Masthead between LURE PICKS and FLY PICKS sections — same anatomy as
 * the Today's Bite section mastheads (cap dot + rule + diamond ornament
 * over a ruled chapter break). Gives each gear group its own "issue
 * section" feel rather than four equal cards stacked together.
 */
function PicksSectionMasthead({
  title,
  meta,
}: {
  title: string;
  meta?: string;
}) {
  return (
    <View style={styles.picksMasthead}>
      <View style={styles.picksMastheadRuleRow}>
        <View style={styles.picksMastheadCap} />
        <View style={styles.picksMastheadRule} />
        <Text style={styles.picksMastheadOrnament}>◆</Text>
      </View>
      <View style={styles.picksMastheadInner}>
        <Text style={styles.picksMastheadTitle} numberOfLines={1}>
          {title}
        </Text>
        {meta ? (
          <Text style={styles.picksMastheadMeta} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
      </View>
      <View style={[styles.picksMastheadRule, { opacity: 0.45 }]} />
    </View>
  );
}

/**
 * TOP PICK card — the hero of each gear section. Premium chrome:
 *
 *   - Gold ribbon header ("★ LURE" / "★ FLY")
 *     with a pulsing live dot, on a tackle-box gold-soft background.
 *   - Corner crosses pinned to each corner — instrument-panel touch
 *     consistent with the Today's Bite hero card.
 *   - Image band with a slow dual-shimmer sweep (native driver) on the
 *     paper-light surface. Hero size — 220 px tall, image 168 px.
 *   - Tall display title (Fraunces 32).
 *   - Full meta row, water-column diagram, WHY + HOW sections.
 *   - Gold-tinted hairlines and subtle bottom edge to reinforce the
 *     "premium tier" feel.
 */
function TopPickCard({ pick }: { pick: DailyPicksResponsePick }) {
  const image = pick.gear_mode === 'lure' ? getLureImage(pick.id) : getFlyImage(pick.id);
  const dayLabel =
    pick.slot === 'lure_of_the_day' ? 'LURE' : 'FLY';

  const pulse = useRef(new Animated.Value(1)).current;
  const shimmerX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => {
    shimmerX.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerX, {
          toValue: 1,
          duration: 3400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(1100),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerX]);

  return (
    <View style={styles.topPickCard}>
      {/* Gold ribbon header */}
      <View style={styles.topPickRibbon}>
        <Animated.View style={[styles.topPickRibbonDot, { opacity: pulse }]} />
        <Ionicons name="star" size={11} color={GOLD_INK} />
        <Text style={styles.topPickRibbonText} numberOfLines={1}>
          TOP PICK · {dayLabel}
        </Text>
        <View style={styles.topPickRibbonTail}>
          <Text style={styles.topPickRibbonOrnament}>◆</Text>
        </View>
      </View>

      {/* Corner crosses on the card itself — instrument-panel touch. */}
      <View style={[styles.topPickCornerCross, styles.topPickCornerCrossTL]}>
        <View style={styles.topPickCornerCrossH} />
        <View style={styles.topPickCornerCrossV} />
      </View>
      <View style={[styles.topPickCornerCross, styles.topPickCornerCrossTR]}>
        <View style={styles.topPickCornerCrossH} />
        <View style={styles.topPickCornerCrossV} />
      </View>
      <View style={[styles.topPickCornerCross, styles.topPickCornerCrossBL]}>
        <View style={styles.topPickCornerCrossH} />
        <View style={styles.topPickCornerCrossV} />
      </View>
      <View style={[styles.topPickCornerCross, styles.topPickCornerCrossBR]}>
        <View style={styles.topPickCornerCrossH} />
        <View style={styles.topPickCornerCrossV} />
      </View>

      <View style={styles.topPickImageBand}>
        {/* Slow shimmer sweep across the image area — same anatomy as
            the score gauge polish. Native driver. */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.topPickImageShimmer,
            {
              transform: [
                {
                  translateX: shimmerX.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-260, 540],
                  }),
                },
                { skewX: '-20deg' },
              ],
            },
          ]}
        />
        {image ? (
          <Image
            source={image}
            style={styles.topPickImage}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.topPickImage, styles.pickImageEmpty]}>
            <Text style={styles.pickImageEmptyText}>IMAGE PENDING</Text>
          </View>
        )}
      </View>

      <View style={styles.topPickBody}>
        <View style={styles.topPickTitleRow}>
          <View style={styles.topPickTitleStack}>
            <Text style={styles.topPickTitle} numberOfLines={2}>
              {pick.display_name}
            </Text>
            <Text style={styles.topPickSubtitle} numberOfLines={1}>
              {guideRoleLine(pick)}
            </Text>
          </View>
          <View style={styles.topPickSeal}>
            <Ionicons name="ribbon-outline" size={14} color={GOLD_INK} />
            <Text style={styles.topPickSealText}>EDITOR'S PICK</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>WATER COLUMN</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {COLUMN_LABEL[pick.column]}
            </Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>PACE</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {paceLabel(pick)}
            </Text>
          </View>
        </View>

        <WaterColumnDiagram active={pick.column} />

        <View style={styles.topPickReasonBlock}>
          <View style={styles.topPickReasonHead}>
            <View style={styles.topPickReasonCap} />
            <Text style={styles.topPickReasonEyebrow}>WHY THIS</Text>
          </View>
          <Text style={styles.topPickReasonBody}>{pick.why_chosen}</Text>
        </View>

        <View style={styles.topPickReasonBlock}>
          <View style={styles.topPickReasonHead}>
            <View style={styles.topPickReasonCap} />
            <Text style={styles.topPickReasonEyebrow}>HOW TO FISH IT</Text>
          </View>
          <Text style={styles.topPickReasonBody}>{pick.how_to_fish}</Text>
        </View>

        {/* Signoff strip — finishes the card like a printed credit. */}
        <View style={styles.topPickSignoffRow}>
          <View style={styles.topPickSignoffRule} />
          <Text style={styles.topPickSignoffOrnament}>◆</Text>
          <Text style={styles.topPickSignoffText}>FINFINDR TACKLE BOX</Text>
        </View>
      </View>
    </View>
  );
}

/**
 * HONORABLE MENTION card — companion to the TOP PICK, clearly supporting.
 * Compact horizontal layout (image left, content right) and shorter
 * copy treatment. "ALSO CONSIDER" eyebrow plus a smaller card chrome
 * differentiate it from the hero pick without losing useful info.
 */
function HonorableMentionCard({ pick }: { pick: DailyPicksResponsePick }) {
  const image = pick.gear_mode === 'lure' ? getLureImage(pick.id) : getFlyImage(pick.id);
  const slotLabel = pick.slot === 'honorable_lure' ? 'HONORABLE LURE' : 'HONORABLE FLY';

  return (
    <View style={styles.honorableCard}>
      <View style={styles.honorableEyebrowRow}>
        <View style={styles.honorableEyebrowDot} />
        <Text style={styles.honorableEyebrow}>ALSO CONSIDER · {slotLabel}</Text>
      </View>

      <View style={styles.honorableBody}>
        <View style={styles.honorableImageWrap}>
          {image ? (
            <Image
              source={image}
              style={styles.honorableImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.honorableImage, styles.pickImageEmpty]}>
              <Text style={styles.pickImageEmptyText}>IMAGE PENDING</Text>
            </View>
          )}
        </View>
        <View style={styles.honorableContent}>
          <Text style={styles.honorableTitle} numberOfLines={2}>
            {pick.display_name}
          </Text>
          <Text style={styles.honorableSubtitle} numberOfLines={1}>
            {guideRoleLine(pick)}
          </Text>

          <View style={styles.honorableMetaRow}>
            <View style={styles.honorableMetaCell}>
              <Text style={styles.honorableMetaLabel}>WATER COLUMN</Text>
              <Text style={styles.honorableMetaValue} numberOfLines={1}>
                {COLUMN_LABEL[pick.column]}
              </Text>
            </View>
            <View style={styles.honorableMetaCell}>
              <Text style={styles.honorableMetaLabel}>PACE</Text>
              <Text style={styles.honorableMetaValue} numberOfLines={1}>
                {paceLabel(pick)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.honorableRule} />

      <View style={styles.honorableReasonStack}>
        <Text style={styles.honorableReasonEyebrow}>WHY THIS</Text>
        <Text style={styles.honorableReasonBody} numberOfLines={4}>
          {pick.why_chosen}
        </Text>
        <Text style={[styles.honorableReasonEyebrow, { marginTop: paperSpacing.sm }]}>
          HOW TO FISH IT
        </Text>
        <Text style={styles.honorableReasonBody} numberOfLines={4}>
          {pick.how_to_fish}
        </Text>
      </View>
    </View>
  );
}

function ScenarioSummary({ result }: { result: DailyPicksResponse }) {
  const scenario = result.scenario_summary;
  return (
    <View style={styles.preferenceCard}>
      <Text style={styles.preferenceHeader}>TODAY'S READ</Text>
      <View style={styles.preferenceChipRow}>
        <View style={styles.preferenceChip}>
          <Text style={styles.preferenceChipLabel}>ACTIVITY</Text>
          <Text style={styles.preferenceChipValue} numberOfLines={1}>
            {ACTIVITY_LABEL[scenario.activity_level]}
          </Text>
        </View>
        <View style={styles.preferenceChip}>
          <Text style={styles.preferenceChipLabel}>CONFIDENCE</Text>
          <Text style={styles.preferenceChipValue} numberOfLines={1}>
            {toTitleCase(scenario.confidence)}
          </Text>
        </View>
      </View>
    </View>
  );
}

type Props = {
  result: DailyPicksResponse;
  style?: ViewStyle;
  locationLabel?: string;
  timeZone?: string;
  onRefresh?: () => void;
  onViewVariant?: (variant: DailyPicksVariant) => void;
  isRefreshing?: boolean;
};

function SessionControls({
  result,
  canRefresh,
  isRefreshing,
  onRefresh,
  onViewVariant,
}: {
  result: DailyPicksResponse;
  canRefresh: boolean;
  isRefreshing: boolean;
  onRefresh?: () => void;
  onViewVariant?: (variant: DailyPicksVariant) => void;
}) {
  const availableVariants = result.recommendation_session.available_variants;
  const hasSecondOpinion = availableVariants.includes('B');
  const currentVariant = result.recommendation_session.variant;

  if (hasSecondOpinion) {
    return (
      <View style={styles.variantPanel}>
        <Text style={styles.variantPanelEyebrow}>TODAY'S SESSION</Text>
        <View style={styles.variantToggle}>
          {(['A', 'B'] as DailyPicksVariant[]).map((variant) => {
            const isActive = currentVariant === variant;
            const label = VARIANT_LABEL[variant];
            return (
              <Pressable
                key={variant}
                style={({ pressed }) => [
                  styles.variantToggleButton,
                  isActive && styles.variantToggleButtonActive,
                  pressed && !isActive && styles.variantToggleButtonPressed,
                  isRefreshing && styles.variantToggleButtonDisabled,
                ]}
                onPress={() => {
                  if (isActive || isRefreshing) return;
                  onViewVariant?.(variant);
                }}
                disabled={isActive || isRefreshing || onViewVariant == null}
              >
                <Text
                  style={[
                    styles.variantToggleText,
                    isActive && styles.variantToggleTextActive,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  if (!canRefresh) return null;

  return (
    <View style={styles.secondOpinionCard}>
      <View style={styles.secondOpinionCopy}>
        <Text style={styles.secondOpinionEyebrow}>GUIDE'S CHANGEUP</Text>
        <Text style={styles.secondOpinionTitle}>
          Build one more pattern for today
        </Text>
        <Text style={styles.secondOpinionBody}>
          This set will be saved and you can view it again today.
        </Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.secondOpinionButton,
          pressed && styles.secondOpinionButtonPressed,
          isRefreshing && styles.secondOpinionButtonDisabled,
        ]}
        onPress={onRefresh}
        disabled={isRefreshing || onRefresh == null}
      >
        <Text style={styles.secondOpinionButtonText}>
          {isRefreshing ? 'BUILDING CHANGEUP' : 'BUILD CHANGEUP'}
        </Text>
      </Pressable>
    </View>
  );
}

export function RecommenderView({
  result,
  style,
  locationLabel,
  timeZone,
  onRefresh,
  onViewVariant,
  isRefreshing = false,
}: Props) {
  const speciesImage = dailySpeciesImage(result.species);
  const canRefresh = result.recommendation_session.can_refresh && onRefresh != null;
  const displayLocation = locationLabel?.trim() || 'Your location';
  const hasChangeup = result.recommendation_session.available_variants.includes('B');

  return (
    <PaperBackground style={style}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <TopographicLines style={styles.heroTopo} color={paper.dashboardBlue} count={7} />
          <CornerMarkSet color={paper.dashboardBlue} size={16} thickness={2} inset={10} />

          <View style={styles.heroHeader}>
            <SectionEyebrow color={paper.dashboardBlue} dashes={false} size={10.5}>
              {`TACKLE BOX · ${contextLabel(result.context)}`}
            </SectionEyebrow>
          </View>

          <View style={styles.heroTitleRow}>
            <Text
              style={styles.heroTitleLine}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.82}
            >
              TODAY'S <Text style={styles.heroTitleAccent}>PICKS</Text>
            </Text>
          </View>

          {speciesImage ? (
            <View style={styles.heroPortraitWrap}>
              <View style={styles.heroPortrait}>
                <Image
                  source={speciesImage}
                  style={styles.heroPortraitImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.heroPortraitPillText} numberOfLines={1}>
                {SPECIES_SUBTITLE[result.species]}
              </Text>
            </View>
          ) : null}

          <View style={styles.heroTileRow}>
            <View style={styles.heroTile}>
              <Text style={styles.heroTileLabel}>SPECIES</Text>
              <Text style={styles.heroTileValue} numberOfLines={1}>
                {dailySpeciesDisplay(result.species)}
              </Text>
              <Text style={styles.heroTileSub} numberOfLines={1}>
                {clarityLabelUpper(result.water_clarity)} WATER
              </Text>
            </View>

            <View style={styles.heroTile}>
              <Text style={styles.heroTileLabel}>SESSION</Text>
              <Text style={styles.heroTileValue} numberOfLines={1}>
                {VARIANT_LABEL[result.recommendation_session.variant]}
              </Text>
              <Text style={styles.heroTileSub} numberOfLines={1}>
                {GOAL_LABEL[result.recommendation_goal].toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {hasChangeup ? (
          <SessionControls
            result={result}
            canRefresh={canRefresh}
            isRefreshing={isRefreshing}
            onRefresh={onRefresh}
            onViewVariant={onViewVariant}
          />
        ) : null}

        <ScenarioSummary result={result} />

        <View style={styles.sectionBlock}>
          <View style={styles.sectionDivider}>
            <View style={styles.sectionFineRuleRow}>
              <View style={styles.sectionFineRule} />
              <Text style={styles.sectionFineMark}>◆</Text>
              <View style={styles.sectionFineRule} />
            </View>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>TWO LURES & TWO FLIES</Text>
            </View>
            <Text
              style={styles.sectionContext}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.74}
            >
              chosen for your location, weather conditions, water clarity and your setup
            </Text>
            <View style={styles.sectionMetaRow}>
              <View style={styles.sectionStamp}>
                <Ionicons name="location-outline" size={11} color={paper.dashboardBlue} />
                <Text style={styles.sectionMono} numberOfLines={1}>
                  {displayLocation} · {formatGeneratedAt(result, timeZone)}
                </Text>
              </View>
            </View>
          </View>

          {/* LURE SECTION — top pick (hero) + honorable mention (compact). */}
          <View style={styles.gearSection}>
            <PicksSectionMasthead
              title="LURE PICKS"
              meta="top pick · honorable mention"
            />
            <TopPickCard pick={result.picks.lure_of_the_day} />
            <HonorableMentionCard pick={result.picks.honorable_lure} />
          </View>

          {/* FLY SECTION — top pick (hero) + honorable mention (compact). */}
          <View style={styles.gearSection}>
            <PicksSectionMasthead
              title="FLY PICKS"
              meta="top pick · honorable mention"
            />
            <TopPickCard pick={result.picks.fly_of_the_day} />
            <HonorableMentionCard pick={result.picks.honorable_fly} />
          </View>

          {!hasChangeup ? (
            <SessionControls
              result={result}
              canRefresh={canRefresh}
              isRefreshing={isRefreshing}
              onRefresh={onRefresh}
              onViewVariant={onViewVariant}
            />
          ) : null}
        </View>
      </ScrollView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: paperSpacing.md,
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.xl * 2,
    gap: paperSpacing.md,
  },
  hero: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    overflow: 'hidden',
    ...paperShadows.lift,
  },
  heroTopo: {
    position: 'absolute',
    top: -16,
    right: -24,
    opacity: 0.2,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
    marginBottom: paperSpacing.md,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  heroTitleLine: {
    flex: 1,
    fontFamily: paperFonts.display,
    fontSize: 45,
    lineHeight: 49,
    color: paper.dashboardInk,
  },
  heroTitleAccent: {
    color: paper.dashboardBlue,
  },
  heroPortraitWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: paperSpacing.sm,
  },
  heroPortrait: {
    width: '100%',
    height: 176,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    backgroundColor: paper.dashboardWhite,
    overflow: 'hidden',
  },
  heroPortraitImage: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.4 }],
  },
  heroPortraitPillText: {
    marginTop: 7,
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.dashboardMuted,
  },
  heroTileRow: {
    marginTop: paperSpacing.lg,
    marginHorizontal: paperSpacing.sm,
    flexDirection: 'row',
    gap: paperSpacing.sm,
  },
  heroTile: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.dashboardWhite,
    padding: paperSpacing.sm,
  },
  heroTileLabel: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9,
    color: paper.dashboardMuted,
    marginBottom: 4,
  },
  heroTileValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 15,
    color: paper.dashboardInk,
  },
  heroTileSub: {
    marginTop: 3,
    fontFamily: paperFonts.metaMono,
    fontSize: 9,
    color: paper.dashboardBlue,
  },
  secondOpinionCard: {
    alignItems: 'stretch',
    gap: paperSpacing.md,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    ...paperShadows.hard,
  },
  secondOpinionCopy: {
    flex: 1,
    minWidth: 0,
  },
  secondOpinionEyebrow: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9,
    color: paper.dashboardBlue,
    marginBottom: 4,
  },
  secondOpinionTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
    color: paper.dashboardInk,
  },
  secondOpinionBody: {
    marginTop: 4,
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: paper.dashboardMuted,
  },
  secondOpinionButton: {
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.sm,
    alignItems: 'center',
    ...paperShadows.hard,
  },
  secondOpinionButtonPressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
    shadowOpacity: 0,
  },
  secondOpinionButtonDisabled: {
    opacity: 0.65,
  },
  secondOpinionButtonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0,
  },
  variantPanel: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    ...paperShadows.hard,
  },
  variantPanelEyebrow: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9,
    color: paper.dashboardBlue,
    marginBottom: paperSpacing.sm,
  },
  variantToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.chip,
    overflow: 'hidden',
    backgroundColor: paper.dashboardWhite,
  },
  variantToggleButton: {
    flex: 1,
    minWidth: 0,
    paddingVertical: paperSpacing.sm,
    paddingHorizontal: paperSpacing.sm,
    alignItems: 'center',
  },
  variantToggleButtonActive: {
    backgroundColor: paper.bandPrime,
  },
  variantToggleButtonPressed: {
    backgroundColor: paper.dashboardWhite,
  },
  variantToggleButtonDisabled: {
    opacity: 0.65,
  },
  variantToggleText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.dashboardInk,
  },
  variantToggleTextActive: {
    color: paper.dashboardWhite,
  },
  preferenceCard: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    ...paperShadows.hard,
  },
  preferenceHeader: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.dashboardBlue,
    marginBottom: paperSpacing.sm,
  },
  preferenceChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: paperSpacing.sm,
  },
  preferenceChip: {
    flexGrow: 1,
    flexBasis: '42%',
    minWidth: 128,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.dashboardWhite,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.sm,
  },
  preferenceChipLabel: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9,
    color: paper.dashboardMuted,
    marginBottom: 4,
  },
  preferenceChipValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 14,
    color: paper.dashboardInk,
  },
  sectionBlock: {
    gap: paperSpacing.sm,
  },
  sectionDivider: {
    position: 'relative',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    backgroundColor: paper.dashboardWhite,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md,
    overflow: 'hidden',
    ...paperShadows.hard,
  },
  sectionFineRuleRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  sectionFineRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.42,
  },
  sectionFineMark: {
    fontFamily: paperFonts.body,
    fontSize: 8,
    lineHeight: 10,
    color: paper.dashboardBlue,
    opacity: 0.75,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: paperFonts.display,
    fontSize: 27,
    lineHeight: 34,
    color: paper.dashboardInk,
  },
  sectionContext: {
    width: '100%',
    marginTop: 2,
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: paper.dashboardMuted,
    textAlign: 'center',
  },
  sectionMetaRow: {
    width: '100%',
    marginTop: paperSpacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
  },
  sectionStamp: {
    minWidth: 0,
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.dashboardWhite,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  sectionMono: {
    flexShrink: 1,
    fontFamily: paperFonts.metaMono,
    fontSize: 9.5,
    color: paper.dashboardMuted,
  },
  // Gear group section — LURE PICKS or FLY PICKS, plus its pair of
  // cards (top pick + honorable mention) under a masthead.
  gearSection: {
    gap: paperSpacing.md + 2,
    marginTop: paperSpacing.lg,
  },

  // ── Picks section masthead (LURE PICKS / FLY PICKS) ────────────────
  picksMasthead: {
    width: '100%',
    gap: 4,
    marginBottom: paperSpacing.xs,
  },
  picksMastheadRuleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    width: '100%',
  },
  picksMastheadCap: {
    width: 5,
    height: 5,
    borderRadius: 1,
    backgroundColor: paper.dashboardInk,
  },
  picksMastheadOrnament: {
    fontFamily: paperFonts.body,
    fontSize: 9,
    lineHeight: 10,
    opacity: 0.75,
    color: paper.dashboardInk,
  },
  picksMastheadRule: {
    height: 1.6,
    flex: 1,
    backgroundColor: paper.dashboardInk,
  },
  picksMastheadInner: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: 4,
    gap: 8,
    flexWrap: 'wrap',
  },
  picksMastheadTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2.8,
    fontWeight: '700',
    color: paper.dashboardInk,
    flexShrink: 1,
  },
  picksMastheadMeta: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 11,
    color: paper.dashboardMuted,
    opacity: 0.6,
  },

  // ── TOP PICK CARD — hero treatment ─────────────────────────────────
  topPickCard: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    overflow: 'hidden',
    position: 'relative',
    ...paperShadows.lift,
  },
  topPickRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: 9,
    backgroundColor: GOLD_SOFT,
    borderBottomWidth: 1,
    borderBottomColor: GOLD_ACCENT,
  },
  topPickRibbonDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: GOLD_ACCENT,
  },
  topPickRibbonText: {
    flex: 1,
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2.4,
    color: GOLD_INK,
    fontWeight: '700',
  },
  topPickRibbonTail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topPickRibbonOrnament: {
    fontFamily: paperFonts.body,
    fontSize: 10,
    color: GOLD_ACCENT,
    opacity: 0.8,
  },

  // Corner crosses pinned to each corner of the top-pick card.
  topPickCornerCross: {
    position: 'absolute',
    width: 10,
    height: 10,
    zIndex: 3,
  },
  topPickCornerCrossTL: { top: 46, left: 8 },
  topPickCornerCrossTR: { top: 46, right: 8 },
  topPickCornerCrossBL: { bottom: 8, left: 8 },
  topPickCornerCrossBR: { bottom: 8, right: 8 },
  topPickCornerCrossH: {
    position: 'absolute',
    top: 4.5,
    left: 0,
    width: 10,
    height: 1,
    backgroundColor: 'rgba(28, 36, 25, 0.32)',
  },
  topPickCornerCrossV: {
    position: 'absolute',
    left: 4.5,
    top: 0,
    width: 1,
    height: 10,
    backgroundColor: 'rgba(28, 36, 25, 0.32)',
  },

  topPickImageBand: {
    minHeight: 200,
    borderBottomWidth: 1,
    borderBottomColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    alignItems: 'center',
    justifyContent: 'center',
    padding: paperSpacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  topPickImageShimmer: {
    position: 'absolute',
    top: -10,
    bottom: -10,
    width: 90,
    backgroundColor: 'rgba(201, 155, 45, 0.16)',
  },
  topPickImage: {
    width: '100%',
    height: 168,
  },
  pickImageEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: paper.dashboardMuted,
    borderStyle: 'dashed',
  },
  pickImageEmptyText: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.dashboardMuted,
  },

  topPickBody: {
    padding: paperSpacing.md + 2,
    gap: paperSpacing.sm + 2,
  },
  topPickTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
  },
  topPickTitleStack: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  topPickTitle: {
    fontFamily: paperFonts.display,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: 0,
    color: paper.dashboardInk,
  },
  topPickSubtitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.6,
    color: paper.dashboardMuted,
  },
  topPickSeal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: paperRadius.chip,
    backgroundColor: GOLD_SOFT,
    borderWidth: 1,
    borderColor: GOLD_ACCENT,
  },
  topPickSealText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: GOLD_INK,
    fontWeight: '700',
  },

  topPickReasonBlock: {
    gap: 4,
  },
  topPickReasonHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topPickReasonCap: {
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: GOLD_ACCENT,
  },
  topPickReasonEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: GOLD_INK,
    fontWeight: '700',
  },
  topPickReasonBody: {
    marginTop: 2,
    fontFamily: paperFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: paper.dashboardInk,
  },

  topPickSignoffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: paperSpacing.sm,
    paddingTop: paperSpacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardHair,
  },
  topPickSignoffRule: {
    height: StyleSheet.hairlineWidth,
    flex: 1,
    maxWidth: 32,
    backgroundColor: GOLD_ACCENT,
    opacity: 0.45,
  },
  topPickSignoffOrnament: {
    fontFamily: paperFonts.body,
    fontSize: 8,
    color: GOLD_ACCENT,
    opacity: 0.7,
  },
  topPickSignoffText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 2,
    color: GOLD_INK,
    opacity: 0.85,
    fontWeight: '700',
  },

  // ── HONORABLE MENTION CARD — compact supporting layout ─────────────
  honorableCard: {
    backgroundColor: '#FAFAF7',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    paddingHorizontal: paperSpacing.md,
    paddingTop: paperSpacing.sm + 2,
    paddingBottom: paperSpacing.md,
    overflow: 'hidden',
  },
  honorableEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: paperSpacing.sm,
  },
  honorableEyebrowDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: paper.dashboardMuted,
    opacity: 0.55,
  },
  honorableEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.7,
    color: paper.dashboardMuted,
    fontWeight: '700',
  },
  honorableBody: {
    flexDirection: 'row',
    gap: paperSpacing.md,
    alignItems: 'flex-start',
  },
  honorableImageWrap: {
    width: 96,
    height: 96,
    borderRadius: paperRadius.chip,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    overflow: 'hidden',
    flexShrink: 0,
  },
  honorableImage: {
    width: '100%',
    height: '100%',
  },
  honorableContent: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  honorableTitle: {
    fontFamily: paperFonts.display,
    fontSize: 19,
    lineHeight: 22,
    fontWeight: '700',
    color: paper.dashboardInk,
  },
  honorableSubtitle: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9.5,
    letterSpacing: 0.6,
    color: paper.dashboardMuted,
    marginBottom: 6,
  },
  honorableMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  honorableMetaCell: {
    minWidth: 0,
  },
  honorableMetaLabel: {
    fontFamily: paperFonts.metaMono,
    fontSize: 7.5,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
    marginBottom: 2,
  },
  honorableMetaValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.dashboardInk,
  },
  honorableRule: {
    marginTop: paperSpacing.sm + 2,
    marginBottom: paperSpacing.sm,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardHair,
  },
  honorableReasonStack: {
    gap: 2,
  },
  honorableReasonEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.4,
    color: paper.dashboardBlue,
    fontWeight: '700',
  },
  honorableReasonBody: {
    marginTop: 2,
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.dashboardInk,
    opacity: 0.92,
  },
  metaRow: {
    marginTop: paperSpacing.md,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
  },
  metaCell: {
    flex: 1,
    minWidth: 0,
    paddingVertical: paperSpacing.sm,
    paddingHorizontal: 7,
  },
  metaDivider: {
    width: 2,
    backgroundColor: paper.dashboardInk,
  },
  metaLabel: {
    fontFamily: paperFonts.metaMono,
    fontSize: 8,
    color: paper.dashboardMuted,
    marginBottom: 3,
  },
  metaValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.dashboardInk,
  },
  columnDiagram: {
    marginTop: paperSpacing.md,
    flexDirection: 'row',
    gap: 6,
  },
  columnCell: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  columnBar: {
    width: '100%',
    height: 22,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnBarActive: {
    backgroundColor: paper.bandPrime,
  },
  columnDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: paper.bandFair,
  },
  columnLabel: {
    fontFamily: paperFonts.metaMono,
    fontSize: 7,
    color: paper.dashboardMuted,
  },
  columnLabelActive: {
    color: paper.dashboardInk,
  },
});
