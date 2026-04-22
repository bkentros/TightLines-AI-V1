/**
 * RecommenderView — FinFindr "What to Throw Today" experience.
 *
 * This component is pure presentation. It renders the real lure + fly
 * recommendations, daily preference, and session color theme returned by the
 * recommender. No data is faked; if fewer than 3 items are returned for a list,
 * we render exactly what's there.
 *
 * Visual language:
 *   • paper palette (ink / paperLight / forest / gold / red / walnut)
 *   • Fraunces display for titles, DM Sans for UI, mono for counters
 *   • 2px ink borders + 2px hard shadows
 *   • medal badges (gold/silver/bronze) from **display order** (first card = gold, …)
 *     so thin lists compress visually
 *   • WaterColumnDiagram mirrors the FinFindr tackle card
 *   • "Why this" and "How to fish" are preserved verbatim from the response
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
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../../lib/theme';
import {
  CornerMarkSet,
  MedalBadge,
  PaperBackground,
  SectionEyebrow,
  TopographicLines,
  type MedalTier,
} from '../paper';
import { getSpeciesImage } from '../../lib/speciesImages';
import { getFlyImage } from '../../lib/flyImages';
import { getLureImage } from '../../lib/lureImages';
import type {
  DailySurfaceWindow,
  EngineContext,
  OpportunityMixMode,
  RankedRecommendation,
  RecommenderResponse,
  SpeciesGroup,
  TacticalColumn,
  TacticalPace,
  TacticalPresence,
} from '../../lib/recommenderContracts';
import { SPECIES_DISPLAY, WATER_CLARITY_LABELS } from '../../lib/recommenderContracts';

const IMAGE_TX = { duration: 200 } as const;

// ─── Display labels (response tokens → UI strings) ─────────────────────────

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

const PRESENCE_LABEL: Record<TacticalPresence, string> = {
  subtle: 'Subtle',
  moderate: 'Moderate',
  bold: 'Bold',
};

const MIX_LABEL: Record<OpportunityMixMode, string> = {
  aggressive: 'Active',
  balanced: 'Balanced',
  conservative: 'Careful',
};

// Latin-ish subtitle shown under the species hero — no new data invented,
// just editorial field-guide polish that mirrors the FinFindr mock.
const SPECIES_SUBTITLE: Record<SpeciesGroup, string> = {
  largemouth_bass: 'M. SALMOIDES',
  smallmouth_bass: 'M. DOLOMIEU',
  pike_musky: 'ESOX LUCIUS',
  river_trout: 'SALMONIDAE',
  walleye: 'S. VITREUS',
  redfish: 'S. OCELLATUS',
  snook: 'C. UNDECIMALIS',
  seatrout: 'C. NEBULOSUS',
  striped_bass: 'M. SAXATILIS',
  tarpon: 'M. ATLANTICUS',
};

// Tri-swatch palette keyed by the session theme label ("Natural" | "Dark" |
// "Bright"). We map the label to representative paint chips.
const THEME_SWATCHES: Record<string, string[]> = {
  Natural: ['#6B5537', '#2E4A2A', '#8B7355'],
  Dark: ['#241B12', '#3A2E22', '#4A3826'],
  Bright: ['#E8A02E', '#C8352C', '#F5D078'],
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

function clarityLabelUpper(clarity: RecommenderResponse['water_clarity']): string {
  return (WATER_CLARITY_LABELS[clarity] ?? 'Clarity').toUpperCase();
}

function opportunityMixSummarySentence(mix: OpportunityMixMode): string {
  switch (mix) {
    case 'conservative':
      return "Today's setup favors careful, controlled presentations.";
    case 'balanced':
      return "Today's setup supports a balanced mix of steady and active looks.";
    case 'aggressive':
      return "Today's setup supports active, search-oriented presentations.";
  }
}

function surfaceContextNote(
  surfaceAllowedToday: boolean,
  surfaceWindow: DailySurfaceWindow,
): string | null {
  if (!surfaceAllowedToday) return 'Subsurface is the better read today.';
  if (surfaceWindow === 'clean') return 'Surface is in play today.';
  if (surfaceWindow === 'rippled') {
    return 'Surface is possible, but chop favors sturdier topwater looks.';
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

// Rank 1/2/3 → medal tier. Extra ranks fall through to bronze gracefully.
function tierForRank(index: number): MedalTier {
  if (index === 0) return 'gold';
  if (index === 1) return 'silver';
  return 'bronze';
}

const TIER_TAGLINE: Record<MedalTier, string> = {
  gold: 'TOP PICK',
  silver: 'STRONG ALTERNATIVE',
  bronze: 'RELIABLE FALLBACK',
};

const TIER_LABEL: Record<MedalTier, string> = {
  gold: 'GOLD',
  silver: 'SILVER',
  bronze: 'BRONZE',
};

// ─── Sub-components ───────────────────────────────────────────────────────

/** Tiny 4-column diagram that highlights the active tactical column. */
function WaterColumnDiagram({ active }: { active: TacticalColumn }) {
  return (
    <View style={styles.columnDiagram}>
      {COLUMN_ORDER.map((col) => {
        const isActive = col === active;
        return (
          <View key={col} style={styles.columnCell}>
            <View
              style={[
                styles.columnBar,
                isActive && styles.columnBarActive,
              ]}
            >
              {isActive ? <View style={styles.columnDot} /> : null}
            </View>
            <Text
              style={[
                styles.columnLabel,
                isActive && styles.columnLabelActive,
              ]}
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

function TackleCard({
  item,
  index,
  mode,
  totalCount,
}: {
  item: RankedRecommendation;
  index: number;
  mode: 'lure' | 'fly';
  totalCount: number;
}) {
  const image = mode === 'lure' ? getLureImage(item.id) : getFlyImage(item.id);
  const tier = tierForRank(index);

  return (
    <View style={styles.tackleCard}>
      {/* Image band with tier stripe + medal badge overlay. */}
      <View style={styles.tackleImageBand}>
        {image ? (
          <ExpoImage
            source={image}
            style={styles.tackleImage}
            contentFit="contain"
            transition={IMAGE_TX}
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.tackleImage, styles.tackleImageEmpty]} />
        )}

        <MedalBadge tier={tier} size={40} style={styles.tackleMedal} />

        <View style={styles.tierBand}>
          <Text style={styles.tierBandText} numberOfLines={1}>
            {TIER_LABEL[tier]} · {TIER_TAGLINE[tier]}
          </Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.tackleBody}>
        <Text style={styles.tackleTitle} numberOfLines={2}>
          {item.display_name}
        </Text>
        <Text style={styles.tackleSubtitle} numberOfLines={1}>
          {toTitleCase(item.family_group)} · {toTitleCase(item.color_style)}
        </Text>

        {/* Where / Pace meta row (bordered top & bottom) */}
        <View style={styles.metaRow}>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>WHERE</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {COLUMN_LABEL[item.primary_column]}
            </Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>PACE</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {PACE_LABEL[item.pace]}
            </Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>ACTION</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {PRESENCE_LABEL[item.presence]}
            </Text>
          </View>
        </View>

        <WaterColumnDiagram active={item.primary_column} />

        {/* Why this */}
        <Text style={styles.reasonEyebrow}>— WHY THIS</Text>
        <Text style={styles.reasonBody}>{item.why_chosen}</Text>

        {/* How to fish */}
        <Text style={styles.reasonEyebrow}>— HOW TO FISH IT</Text>
        <Text style={styles.reasonBody}>{item.how_to_fish}</Text>

        {/* Rank counter — e.g. 01 / 03 */}
        <View style={styles.rankCounterRow}>
          <Text style={styles.rankCounter}>
            {String(index + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
          </Text>
        </View>
      </View>
    </View>
  );
}

function SectionDivider({
  title,
  count,
  totalCount,
  sectionIndex,
  totalSections,
}: {
  title: string;
  count: number;
  totalCount: number;
  sectionIndex: number;
  totalSections: number;
}) {
  let countCopy: string;
  if (totalCount === 0) {
    countCopy = 'NO PICKS TODAY';
  } else if (count < totalCount) {
    countCopy = `${count} BEST PICK${count === 1 ? '' : 'S'}`;
  } else {
    countCopy = `${count === 3 ? 'THREE' : count} PICK${count === 1 ? '' : 'S'}`;
  }

  return (
    <View style={styles.sectionDivider}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionCount}>{countCopy}</Text>
      </View>
      <Text style={styles.sectionMono}>
        {String(sectionIndex).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
      </Text>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────

type Props = {
  result: RecommenderResponse;
  style?: ViewStyle;
};

export function RecommenderView({ result, style }: Props) {
  const speciesImage = getSpeciesImage(result.species);
  const daily = result.summary.daily_tactical_preference;
  const mixSummary = opportunityMixSummarySentence(daily.opportunity_mix);
  const surfaceNote = surfaceContextNote(daily.surface_allowed_today, daily.surface_window);
  const themeLabel = result.summary.session_color_theme_label ?? null;
  const themeSwatches = themeLabel ? THEME_SWATCHES[themeLabel] : undefined;

  const lureCount = result.lure_recommendations.length;
  const flyCount = result.fly_recommendations.length;
  const hasFlies = flyCount > 0;
  const totalSections = hasFlies ? 2 : 1;

  const speciesDisplay = SPECIES_DISPLAY[result.species];
  const speciesSubtitle = SPECIES_SUBTITLE[result.species];

  return (
    <PaperBackground style={style}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ══════════════════════════════════════════════
             HERO — "What to Throw Today"
             Paper-light card, ink-framed, gold corner marks,
             topo background, portrait on the right.
           ══════════════════════════════════════════════ */}
        <View style={styles.hero}>
          <TopographicLines
            style={styles.heroTopo}
            color={paper.walnut}
            count={7}
          />
          <CornerMarkSet color={paper.gold} size={16} thickness={2} inset={10} />

          <View style={styles.heroHeader}>
            <SectionEyebrow color={paper.red} dashes size={10.5}>
              {`TACKLE BOX · ${contextLabel(result.context)}`}
            </SectionEyebrow>
          </View>

          <View style={styles.heroTitleRow}>
            <View style={styles.heroTitleCol}>
              <Text style={styles.heroTitleLine}>WHAT TO</Text>
              <View style={styles.heroTitleSecond}>
                <Text style={[styles.heroTitleLine, styles.heroTitleAccent]}>
                  THROW
                </Text>
                <Text style={styles.heroTitleLine}> TODAY.</Text>
              </View>
              <Text style={styles.heroLede}>
                Ranked lures and flies for today's conditions.
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
                {speciesSubtitle ? (
                  <View style={styles.heroPortraitPill}>
                    <Text style={styles.heroPortraitPillText} numberOfLines={1}>
                      {speciesSubtitle}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>

          {/* Targeting / Colors tiles (real data) */}
          <View style={styles.heroTileRow}>
            <View style={styles.heroTile}>
              <Text style={styles.heroTileLabel}>SPECIES</Text>
              <Text style={styles.heroTileValue} numberOfLines={1}>
                {speciesDisplay}
              </Text>
              <Text style={styles.heroTileSub} numberOfLines={1}>
                {clarityLabelUpper(result.water_clarity)} WATER
              </Text>
            </View>

            {themeLabel ? (
              <View style={styles.heroTile}>
                <Text style={styles.heroTileLabel}>COLORS TODAY</Text>
                <View style={styles.heroSwatchRow}>
                  {(themeSwatches ?? []).map((hex, i) => (
                    <View
                      key={i}
                      style={[styles.heroSwatch, { backgroundColor: hex }]}
                    />
                  ))}
                  <Text style={styles.heroTileValue} numberOfLines={1}>
                    {themeLabel}
                  </Text>
                </View>
                <Text style={styles.heroTileSub} numberOfLines={1}>
                  {MIX_LABEL[daily.opportunity_mix].toUpperCase()} APPROACH
                </Text>
              </View>
            ) : (
              <View style={styles.heroTile}>
                <Text style={styles.heroTileLabel}>APPROACH</Text>
                <Text style={styles.heroTileValue} numberOfLines={1}>
                  {MIX_LABEL[daily.opportunity_mix]}
                </Text>
                <Text style={styles.heroTileSub} numberOfLines={1}>
                  {daily.surface_allowed_today ? 'SURFACE IN PLAY' : 'SUBSURFACE FAVORED'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ══════════════════════════════════════════════
             THEME NOTE — one-line context quote
             (gold left rule · Fraunces italic)
           ══════════════════════════════════════════════ */}
        <View style={styles.themeNote}>
          <Text style={styles.themeNoteEyebrow}>TODAY:</Text>
          <Text style={styles.themeNoteBody}>
            {mixSummary}
            {surfaceNote ? ` ${surfaceNote}` : ''}
          </Text>
        </View>

        {/* ══════════════════════════════════════════════
             DAILY TACTICAL PREFERENCE — quick-read chip card
             Real daily preference values.
           ══════════════════════════════════════════════ */}
        <View style={styles.preferenceCard}>
          <Text style={styles.preferenceHeader}>— TODAY&apos;S PREFERENCE</Text>
          <View style={styles.preferenceChipRow}>
            <View style={styles.preferenceChip}>
              <Text style={styles.preferenceChipLabel}>FORAGE</Text>
              <Text style={styles.preferenceChipValue} numberOfLines={1}>
                {toTitleCase(result.summary.monthly_forage.primary)}
              </Text>
            </View>
            <View style={styles.preferenceChip}>
              <Text style={styles.preferenceChipLabel}>COLUMN</Text>
              <Text style={styles.preferenceChipValue} numberOfLines={1}>
                {COLUMN_LABEL[daily.preferred_column]}
              </Text>
            </View>
            <View style={styles.preferenceChip}>
              <Text style={styles.preferenceChipLabel}>PACE</Text>
              <Text style={styles.preferenceChipValue} numberOfLines={1}>
                {PACE_LABEL[daily.preferred_pace]}
              </Text>
            </View>
            <View style={styles.preferenceChip}>
              <Text style={styles.preferenceChipLabel}>ACTION</Text>
              <Text style={styles.preferenceChipValue} numberOfLines={1}>
                {PRESENCE_LABEL[daily.preferred_presence]}
              </Text>
            </View>
          </View>
        </View>

        {/* ══════════════════════════════════════════════
             LURES — up to 3 ranked cards (real data)
           ══════════════════════════════════════════════ */}
        <View style={styles.sectionBlock}>
          <SectionDivider
            title="LURES"
            count={lureCount}
            totalCount={3}
            sectionIndex={1}
            totalSections={totalSections}
          />
          {lureCount === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEyebrow}>NO LURE PICKS</Text>
              <Text style={styles.emptyBody}>
                No strong lure picks for this setup. Try again when conditions
                shift.
              </Text>
            </View>
          ) : (
            <View style={styles.cardStack}>
              {result.lure_recommendations.map((item, i) => (
                <TackleCard
                  key={item.id}
                  item={item}
                  index={i}
                  mode="lure"
                  totalCount={lureCount}
                />
              ))}
            </View>
          )}
        </View>

        {/* ══════════════════════════════════════════════
             FLIES — up to 3 ranked cards (real data)
             Hidden entirely when zero flies are returned,
             which is truthful for the rebuild surface.
           ══════════════════════════════════════════════ */}
        {hasFlies ? (
          <View style={styles.sectionBlock}>
            <SectionDivider
              title="FLIES"
              count={flyCount}
              totalCount={3}
              sectionIndex={2}
              totalSections={totalSections}
            />
            <View style={styles.cardStack}>
              {result.fly_recommendations.map((item, i) => (
                <TackleCard
                  key={item.id}
                  item={item}
                  index={i}
                  mode="fly"
                  totalCount={flyCount}
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </PaperBackground>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────

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

  // ── Hero ─────────────────────────────────────────────────────────────
  hero: {
    position: 'relative',
    backgroundColor: paper.paperLight,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    padding: paperSpacing.lg,
    gap: paperSpacing.md,
    overflow: 'hidden',
    ...paperShadows.hard,
  },
  heroTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
  },
  heroHeader: {
    zIndex: 1,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.md,
    zIndex: 1,
  },
  heroTitleCol: {
    flex: 1,
    paddingRight: paperSpacing.xs,
  },
  heroTitleLine: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    lineHeight: 34,
    letterSpacing: -1.1,
    color: paper.ink,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroTitleSecond: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  heroTitleAccent: {
    color: paper.forest,
  },
  heroLede: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.ink,
    opacity: 0.75,
    lineHeight: 20,
    marginTop: paperSpacing.xs + 2,
  },
  heroPortraitWrap: {
    alignItems: 'center',
    gap: 6,
  },
  heroPortrait: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: paper.ink,
    overflow: 'hidden',
    backgroundColor: paper.paper,
    ...paperShadows.hard,
  },
  heroPortraitImage: {
    width: '100%',
    height: '100%',
  },
  heroPortraitPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: 2,
    backgroundColor: paper.paper,
    marginTop: -10,
  },
  heroPortraitPillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2.2,
    color: paper.ink,
  },
  heroTileRow: {
    flexDirection: 'row',
    gap: paperSpacing.sm,
    zIndex: 1,
  },
  heroTile: {
    flex: 1,
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm + 2,
    backgroundColor: paper.paper,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    gap: 3,
  },
  heroTileLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.red,
    letterSpacing: 2.6,
  },
  heroTileValue: {
    fontFamily: paperFonts.display,
    fontSize: 16,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  heroTileSub: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.ink,
    opacity: 0.55,
    letterSpacing: 1.8,
  },
  heroSwatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  heroSwatch: {
    width: 10,
    height: 18,
    borderWidth: 1,
    borderColor: paper.ink,
  },

  // ── Theme note ───────────────────────────────────────────────────────
  themeNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
    padding: paperSpacing.md,
    paddingLeft: paperSpacing.md + 4,
    backgroundColor: paper.paper,
    borderWidth: 2,
    borderColor: paper.ink,
    borderLeftWidth: 8,
    borderLeftColor: paper.gold,
    borderRadius: paperRadius.card,
  },
  themeNoteEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.red,
    letterSpacing: 2.6,
    marginTop: 3,
  },
  themeNoteBody: {
    flex: 1,
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.ink,
    lineHeight: 20,
  },

  // ── Preference card (daily tactical summary) ─────────────────────────
  preferenceCard: {
    padding: paperSpacing.md,
    backgroundColor: paper.paper,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    gap: paperSpacing.sm,
    ...paperShadows.hard,
  },
  preferenceHeader: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    letterSpacing: 2.8,
    opacity: 0.75,
  },
  preferenceChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: paperSpacing.xs + 2,
  },
  preferenceChip: {
    flexGrow: 1,
    minWidth: '47%',
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.xs + 2,
    backgroundColor: paper.paperLight,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    gap: 2,
  },
  preferenceChipLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.red,
    letterSpacing: 2.2,
  },
  preferenceChipValue: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -0.3,
  },

  // ── Section divider (LURES / FLIES) ──────────────────────────────────
  sectionBlock: {
    gap: paperSpacing.sm + 2,
    marginTop: paperSpacing.xs,
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: paper.ink,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: paperSpacing.sm + 2,
    flex: 1,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontFamily: paperFonts.display,
    fontSize: 28,
    color: paper.ink,
    letterSpacing: -0.7,
    fontWeight: '700',
  },
  sectionCount: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    letterSpacing: 2.6,
    opacity: 0.55,
  },
  sectionMono: {
    fontFamily: paperFonts.mono,
    fontSize: 11,
    color: paper.ink,
    opacity: 0.55,
  },

  // ── Card stack ───────────────────────────────────────────────────────
  cardStack: {
    gap: paperSpacing.md,
  },

  // ── Tackle card ──────────────────────────────────────────────────────
  tackleCard: {
    backgroundColor: paper.paper,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    overflow: 'hidden',
    ...paperShadows.hard,
  },
  tackleImageBand: {
    position: 'relative',
    height: 135,
    borderBottomWidth: 2,
    borderBottomColor: paper.ink,
    backgroundColor: paper.paperDark,
  },
  tackleImage: {
    width: '100%',
    height: '100%',
    padding: 10,
  },
  tackleImageEmpty: {
    backgroundColor: paper.paperDark,
  },
  tackleMedal: {
    position: 'absolute',
    top: 12,
    right: 12,
    ...paperShadows.hard,
  },
  tierBand: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: paper.paper,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: 2,
  },
  tierBandText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.ink,
    letterSpacing: 2.4,
  },
  tackleBody: {
    padding: paperSpacing.md + 2,
    gap: paperSpacing.xs + 2,
  },
  tackleTitle: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  tackleSubtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13,
    color: paper.ink,
    opacity: 0.65,
    marginTop: -2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: paperSpacing.sm,
    paddingVertical: paperSpacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: paper.inkHair,
  },
  metaCell: {
    flex: 1,
    gap: 3,
    paddingHorizontal: paperSpacing.sm,
  },
  metaDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: paper.inkHair,
  },
  metaLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    color: paper.ink,
    opacity: 0.55,
    letterSpacing: 2.4,
  },
  metaValue: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.ink,
    fontWeight: '700',
  },
  reasonEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.ink,
    opacity: 0.55,
    letterSpacing: 2.6,
    marginTop: paperSpacing.sm + 2,
  },
  reasonBody: {
    fontFamily: paperFonts.body,
    fontSize: 13.5,
    color: paper.ink,
    lineHeight: 20,
    opacity: 0.88,
  },
  rankCounterRow: {
    alignItems: 'flex-end',
    marginTop: paperSpacing.xs,
  },
  rankCounter: {
    fontFamily: paperFonts.mono,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.45,
    letterSpacing: 1.2,
  },
  // ── Water column diagram ─────────────────────────────────────────────
  columnDiagram: {
    flexDirection: 'row',
    gap: 3,
    marginTop: paperSpacing.xs,
  },
  columnCell: {
    flex: 1,
    gap: 4,
  },
  columnBar: {
    height: 22,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: paper.inkHair,
    backgroundColor: 'rgba(28,36,25,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnBarActive: {
    borderWidth: 1.5,
    borderColor: paper.ink,
    backgroundColor: paper.forest,
  },
  columnDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: paper.gold,
    borderWidth: 1,
    borderColor: paper.ink,
  },
  columnLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    color: paper.ink,
    opacity: 0.5,
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  columnLabelActive: {
    color: paper.forest,
    opacity: 1,
  },

  // ── Empty state (0 picks) ────────────────────────────────────────────
  emptyState: {
    padding: paperSpacing.md,
    backgroundColor: paper.paperLight,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderStyle: 'dashed',
    borderRadius: paperRadius.card,
    gap: 6,
  },
  emptyEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.red,
    letterSpacing: 2.6,
  },
  emptyBody: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13.5,
    color: paper.ink,
    opacity: 0.8,
    lineHeight: 19,
  },
});
