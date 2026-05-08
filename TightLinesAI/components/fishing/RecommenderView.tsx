/**
 * RecommenderView — FinFindr "What to Throw Today" experience.
 *
 * Renders the daily-picks 2x2 future response:
 * Lure of the Day, Honorable Mention Lure, Fly of the Day, Honorable Mention Fly.
 */

import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
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
  DailyPickSlot,
  DailyPicksConditionTag,
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

const IMAGE_TX = { duration: 200 } as const;

const PICK_ORDER: DailyPickSlot[] = [
  'lure_of_the_day',
  'honorable_lure',
  'fly_of_the_day',
  'honorable_fly',
];

const SLOT_LABEL: Record<DailyPickSlot, string> = {
  lure_of_the_day: 'Lure of the Day',
  honorable_lure: 'Honorable Mention Lure',
  fly_of_the_day: 'Fly of the Day',
  honorable_fly: 'Honorable Mention Fly',
};

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
  largemouth_bass: 'M. SALMOIDES',
  smallmouth_bass: 'M. DOLOMIEU',
  northern_pike: 'ESOX LUCIUS',
  trout: 'SALMONIDAE',
};

const ACTIVITY_LABEL: Record<DailyPicksResponse['scenario_summary']['activity_level'], string> = {
  suppressed: 'Suppressed',
  neutral: 'Neutral',
  active: 'Active',
  high_opportunity: 'High Opportunity',
};

const SURFACE_GATE_LABEL: Record<DailyPicksResponse['scenario_summary']['surface_daily_gate'], string> = {
  closed: 'Closed',
  caution: 'Caution',
  open: 'Open',
};

const GOAL_LABEL: Record<DailyPicksResponse['recommendation_goal'], string> = {
  all_purpose: 'All Purpose',
  big_fish: 'Big Fish',
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

function tagLabel(tag: DailyPicksConditionTag): string {
  return toTitleCase(tag);
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

function summarySentence(result: DailyPicksResponse): string {
  const { scenario_summary: scenario } = result;
  const surface = scenario.surface_daily_gate === 'open'
    ? 'Surface is open inside the seasonal gate.'
    : scenario.surface_daily_gate === 'caution'
      ? 'Surface is a caution window today.'
      : 'Surface is closed for this setup.';
  return `${ACTIVITY_LABEL[scenario.activity_level]} daily read. ${surface}`;
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

function PickCard({ pick }: { pick: DailyPicksResponsePick }) {
  const image = pick.gear_mode === 'lure' ? getLureImage(pick.id) : getFlyImage(pick.id);

  return (
    <View style={styles.pickCard}>
      <View style={styles.pickImageBand}>
        {image ? (
          <ExpoImage
            source={image}
            style={styles.pickImage}
            contentFit="contain"
            transition={IMAGE_TX}
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.pickImage, styles.pickImageEmpty]}>
            <Text style={styles.pickImageEmptyText}>IMAGE PENDING</Text>
          </View>
        )}
        <View style={styles.slotBadge}>
          <Text style={styles.slotBadgeText} numberOfLines={1}>
            {SLOT_LABEL[pick.slot].toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.pickBody}>
        <Text style={styles.pickTitle} numberOfLines={2}>
          {pick.display_name}
        </Text>
        <Text style={styles.pickSubtitle} numberOfLines={1}>
          {toTitleCase(pick.family_group)} · {toTitleCase(pick.presentation_group)}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>WHERE</Text>
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
          <View style={styles.metaDivider} />
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>SURFACE</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {pick.is_surface ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        <WaterColumnDiagram active={pick.column} />

        <Text style={styles.reasonEyebrow}>- WHY THIS</Text>
        <Text style={styles.reasonBody}>{pick.why_chosen}</Text>

        <Text style={styles.reasonEyebrow}>- HOW TO FISH IT</Text>
        <Text style={styles.reasonBody}>{pick.how_to_fish}</Text>
      </View>
    </View>
  );
}

function ScenarioSummary({ result }: { result: DailyPicksResponse }) {
  const scenario = result.scenario_summary;
  return (
    <View style={styles.preferenceCard}>
      <Text style={styles.preferenceHeader}>- TODAY'S READ</Text>
      <View style={styles.preferenceChipRow}>
        <View style={styles.preferenceChip}>
          <Text style={styles.preferenceChipLabel}>ACTIVITY</Text>
          <Text style={styles.preferenceChipValue} numberOfLines={1}>
            {ACTIVITY_LABEL[scenario.activity_level]}
          </Text>
        </View>
        <View style={styles.preferenceChip}>
          <Text style={styles.preferenceChipLabel}>SURFACE</Text>
          <Text style={styles.preferenceChipValue} numberOfLines={1}>
            {SURFACE_GATE_LABEL[scenario.surface_daily_gate]}
          </Text>
        </View>
        <View style={styles.preferenceChip}>
          <Text style={styles.preferenceChipLabel}>CONFIDENCE</Text>
          <Text style={styles.preferenceChipValue} numberOfLines={1}>
            {toTitleCase(scenario.confidence)}
          </Text>
        </View>
        <View style={styles.preferenceChip}>
          <Text style={styles.preferenceChipLabel}>GOAL</Text>
          <Text style={styles.preferenceChipValue} numberOfLines={1}>
            {GOAL_LABEL[result.recommendation_goal]}
          </Text>
        </View>
      </View>

      {scenario.scenario_tags.length > 0 ? (
        <View style={styles.tagRow}>
          {scenario.scenario_tags.map((tag) => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>{tagLabel(tag)}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {scenario.missing_inputs.length > 0 ? (
        <Text style={styles.missingInputs}>
          Missing: {scenario.missing_inputs.map(toTitleCase).join(', ')}
        </Text>
      ) : null}
    </View>
  );
}

type Props = {
  result: DailyPicksResponse;
  style?: ViewStyle;
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
            const label = variant === 'A' ? 'First Picks' : 'Second Opinion';
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
        <Text style={styles.variantPanelBody}>
          Your second opinion is saved for this exact setup until local midnight.
        </Text>
      </View>
    );
  }

  if (!canRefresh) return null;

  return (
    <View style={styles.secondOpinionCard}>
      <View style={styles.secondOpinionCopy}>
        <Text style={styles.secondOpinionEyebrow}>ONE-TIME ALTERNATE SET</Text>
        <Text style={styles.secondOpinionTitle}>
          Get one more second opinion for today
        </Text>
        <Text style={styles.secondOpinionBody}>
          Set B is saved separately, and this session locks after it is built.
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
          {isRefreshing ? 'BUILDING SET B' : 'BUILD SET B'}
        </Text>
      </Pressable>
    </View>
  );
}

export function RecommenderView({
  result,
  style,
  onRefresh,
  onViewVariant,
  isRefreshing = false,
}: Props) {
  const speciesImage = dailySpeciesImage(result.species);
  const canRefresh = result.recommendation_session.can_refresh && onRefresh != null;

  return (
    <PaperBackground style={style}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <TopographicLines style={styles.heroTopo} color={paper.walnut} count={7} />
          <CornerMarkSet color={paper.gold} size={16} thickness={2} inset={10} />

          <View style={styles.heroHeader}>
            <SectionEyebrow color={paper.red} dashes size={10.5}>
              {`TACKLE BOX · ${contextLabel(result.context)}`}
            </SectionEyebrow>
          </View>

          <View style={styles.heroTitleRow}>
            <View style={styles.heroTitleCol}>
              <Text style={styles.heroTitleLine}>TODAY'S</Text>
              <View style={styles.heroTitleSecond}>
                <Text style={[styles.heroTitleLine, styles.heroTitleAccent]}>PICKS</Text>
                <Text style={styles.heroTitleLine}>.</Text>
              </View>
              <Text style={styles.heroLede}>
                Lure of the Day, honorable lure, Fly of the Day, and honorable fly.
              </Text>
            </View>

            {speciesImage ? (
              <View style={styles.heroPortraitWrap}>
                <View style={styles.heroPortrait}>
                  <ExpoImage
                    source={speciesImage}
                    style={styles.heroPortraitImage}
                    contentFit="cover"
                    transition={IMAGE_TX}
                    cachePolicy="memory-disk"
                  />
                </View>
                <View style={styles.heroPortraitPill}>
                  <Text style={styles.heroPortraitPillText} numberOfLines={1}>
                    {SPECIES_SUBTITLE[result.species]}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

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
                SET {result.recommendation_session.variant}
              </Text>
              <Text style={styles.heroTileSub} numberOfLines={1}>
                {GOAL_LABEL[result.recommendation_goal].toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.themeNote}>
          <Text style={styles.themeNoteEyebrow}>TODAY:</Text>
          <Text style={styles.themeNoteBody}>{summarySentence(result)}</Text>
        </View>

        <SessionControls
          result={result}
          canRefresh={canRefresh}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
          onViewVariant={onViewVariant}
        />

        <ScenarioSummary result={result} />

        <View style={styles.sectionBlock}>
          <View style={styles.sectionDivider}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>DAILY PICKS</Text>
              <Text style={styles.sectionCount}>FOUR PICKS</Text>
            </View>
            <Text style={styles.sectionMono}>
              {result.local_date} · {result.region_key.toUpperCase()}
            </Text>
          </View>

          <View style={styles.cardStack}>
            {PICK_ORDER.map((slot) => (
              <PickCard key={slot} pick={result.picks[slot]} />
            ))}
          </View>
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
    backgroundColor: paper.paperLight,
    borderWidth: 2,
    borderColor: paper.ink,
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
  refreshButton: {
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.gold,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: 7,
    ...paperShadows.hard,
  },
  refreshButtonPressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
    shadowOpacity: 0,
  },
  refreshButtonDisabled: {
    opacity: 0.65,
  },
  refreshButtonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    letterSpacing: 0,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.md,
  },
  heroTitleCol: {
    flex: 1,
    minWidth: 0,
  },
  heroTitleLine: {
    fontFamily: paperFonts.display,
    fontSize: 45,
    lineHeight: 45,
    color: paper.ink,
  },
  heroTitleSecond: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  heroTitleAccent: {
    color: paper.red,
  },
  heroLede: {
    marginTop: paperSpacing.sm,
    maxWidth: 300,
    fontFamily: paperFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: paper.inkSoft,
  },
  heroPortraitWrap: {
    width: 112,
    alignItems: 'center',
  },
  heroPortrait: {
    width: 104,
    height: 104,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    backgroundColor: paper.paper,
    overflow: 'hidden',
  },
  heroPortraitImage: {
    width: '100%',
    height: '100%',
  },
  heroPortraitPill: {
    marginTop: -10,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: 999,
    backgroundColor: paper.paperLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  heroPortraitPillText: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9,
    color: paper.inkSoft,
  },
  heroTileRow: {
    marginTop: paperSpacing.md,
    flexDirection: 'row',
    gap: paperSpacing.sm,
  },
  heroTile: {
    flex: 1,
    minWidth: 0,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paper,
    padding: paperSpacing.sm,
  },
  heroTileLabel: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9,
    color: paper.inkSoft,
    marginBottom: 4,
  },
  heroTileValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 15,
    color: paper.ink,
  },
  heroTileSub: {
    marginTop: 3,
    fontFamily: paperFonts.metaMono,
    fontSize: 9,
    color: paper.red,
  },
  themeNote: {
    flexDirection: 'row',
    gap: paperSpacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: paper.gold,
    backgroundColor: paper.paperLight,
    padding: paperSpacing.md,
  },
  themeNoteEyebrow: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.red,
  },
  themeNoteBody: {
    flex: 1,
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    lineHeight: 20,
    color: paper.ink,
  },
  secondOpinionCard: {
    alignItems: 'stretch',
    gap: paperSpacing.md,
    backgroundColor: paper.paperLight,
    borderWidth: 2,
    borderColor: paper.ink,
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
    color: paper.red,
    marginBottom: 4,
  },
  secondOpinionTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
    color: paper.ink,
  },
  secondOpinionBody: {
    marginTop: 4,
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: paper.inkSoft,
  },
  secondOpinionButton: {
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.gold,
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
    color: paper.ink,
    letterSpacing: 0,
  },
  variantPanel: {
    backgroundColor: paper.paperLight,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    ...paperShadows.hard,
  },
  variantPanelEyebrow: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9,
    color: paper.red,
    marginBottom: paperSpacing.sm,
  },
  variantToggle: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    overflow: 'hidden',
    backgroundColor: paper.paper,
  },
  variantToggleButton: {
    flex: 1,
    minWidth: 0,
    paddingVertical: paperSpacing.sm,
    paddingHorizontal: paperSpacing.sm,
    alignItems: 'center',
  },
  variantToggleButtonActive: {
    backgroundColor: paper.forest,
  },
  variantToggleButtonPressed: {
    backgroundColor: paper.paperLight,
  },
  variantToggleButtonDisabled: {
    opacity: 0.65,
  },
  variantToggleText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.ink,
  },
  variantToggleTextActive: {
    color: paper.paper,
  },
  variantPanelBody: {
    marginTop: paperSpacing.sm,
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: paper.inkSoft,
  },
  preferenceCard: {
    backgroundColor: paper.paperLight,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    ...paperShadows.hard,
  },
  preferenceHeader: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.red,
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
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paper,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.sm,
  },
  preferenceChipLabel: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9,
    color: paper.inkSoft,
    marginBottom: 4,
  },
  preferenceChipValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 14,
    color: paper.ink,
  },
  tagRow: {
    marginTop: paperSpacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  tagPill: {
    borderWidth: 1,
    borderColor: paper.ink,
    borderRadius: 999,
    backgroundColor: paper.paper,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9,
    color: paper.ink,
  },
  missingInputs: {
    marginTop: paperSpacing.sm,
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: paper.inkSoft,
  },
  sectionBlock: {
    gap: paperSpacing.sm,
  },
  sectionDivider: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: paper.ink,
    paddingVertical: paperSpacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
  },
  sectionTitle: {
    fontFamily: paperFonts.display,
    fontSize: 25,
    color: paper.ink,
  },
  sectionCount: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.red,
  },
  sectionMono: {
    marginTop: 2,
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.inkSoft,
  },
  cardStack: {
    gap: paperSpacing.md,
  },
  pickCard: {
    backgroundColor: paper.paperLight,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    overflow: 'hidden',
    ...paperShadows.lift,
  },
  pickImageBand: {
    minHeight: 170,
    borderBottomWidth: 2,
    borderBottomColor: paper.ink,
    backgroundColor: paper.paper,
    alignItems: 'center',
    justifyContent: 'center',
    padding: paperSpacing.md,
  },
  pickImage: {
    width: '100%',
    height: 138,
  },
  pickImageEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: paper.inkSoft,
    borderStyle: 'dashed',
  },
  pickImageEmptyText: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.inkSoft,
  },
  slotBadge: {
    position: 'absolute',
    left: paperSpacing.sm,
    bottom: paperSpacing.sm,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.gold,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  slotBadgeText: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.ink,
  },
  pickBody: {
    padding: paperSpacing.md,
  },
  pickTitle: {
    fontFamily: paperFonts.display,
    fontSize: 24,
    lineHeight: 28,
    color: paper.ink,
  },
  pickSubtitle: {
    marginTop: 3,
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.inkSoft,
  },
  metaRow: {
    marginTop: paperSpacing.md,
    flexDirection: 'row',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: paper.ink,
    backgroundColor: paper.paper,
  },
  metaCell: {
    flex: 1,
    minWidth: 0,
    paddingVertical: paperSpacing.sm,
    paddingHorizontal: 7,
  },
  metaDivider: {
    width: 2,
    backgroundColor: paper.ink,
  },
  metaLabel: {
    fontFamily: paperFonts.metaMono,
    fontSize: 8,
    color: paper.inkSoft,
    marginBottom: 3,
  },
  metaValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.ink,
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
    borderColor: paper.ink,
    backgroundColor: paper.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnBarActive: {
    backgroundColor: paper.forest,
  },
  columnDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: paper.gold,
  },
  columnLabel: {
    fontFamily: paperFonts.metaMono,
    fontSize: 7,
    color: paper.inkSoft,
  },
  columnLabelActive: {
    color: paper.ink,
  },
  reasonEyebrow: {
    marginTop: paperSpacing.md,
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.red,
  },
  reasonBody: {
    marginTop: 5,
    fontFamily: paperFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: paper.ink,
  },
});
