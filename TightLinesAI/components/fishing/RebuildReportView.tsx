import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
  paperTierForScore,
  scoreAccentColor,
  scoreTextOnColor,
  type PaperTier,
} from '../../lib/theme';
import { SectionEyebrow, TopographicLines } from '../paper';
import {
  resolveTimingPeriods,
  resolveTimingFromPreset,
  PERIOD_DEFS,
  type PeriodSlot,
} from './TimingTiles';
import type { HowsFishingReportV1 } from '../../lib/howFishing';
import type { ActionableTipTag } from '../../lib/howFishingRebuildContracts';
import type { SolunarData } from '../../lib/env/types';

// ─── Display helpers ─────────────────────────────────────────────────────────

function tierForScore(score: number): PaperTier {
  return paperTierForScore(score / 10);
}

/**
 * Tapered accent color for a /100 score. Delegates to the shared theme helper
 * so the hero gauge, numeric value, band pill, and topo watermark stay in
 * lock-step with the forecast tiles (which also key off `scoreAccentColor`).
 */
function accentForScore100(score100: number): string {
  return scoreAccentColor(score100 / 10);
}

/** Capitalize sentence starts after . ; ! ? so engine multi-sentence text reads correctly. */
function formatFactorLabel(text: string): string {
  if (!text || !text.trim()) return text;
  return text
    .split(/(?<=[.;!?])\s+/)
    .map((sentence) => {
      const t = sentence.trimStart();
      if (!t) return sentence;
      const lead = sentence.length - t.length;
      return sentence.slice(0, lead) + t.charAt(0).toUpperCase() + t.slice(1);
    })
    .join(' ');
}

/** Convert an engine variable key (e.g. `barometric_trend`) to a tracked
 *  uppercase eyebrow (`BAROMETRIC TREND`) for the factor row. */
function formatVariableEyebrow(v: string): string {
  if (!v) return 'CONDITION';
  return v.replace(/_/g, ' ').toUpperCase();
}

/** Parse a solunar time string (ISO local or "HH:mm") to "9:15am" format. */
function parseSolunarTime(t: string): string {
  const isoMatch = t.match(/T(\d{2}):(\d{2})/);
  if (isoMatch) {
    const h = parseInt(isoMatch[1]!, 10);
    const m = parseInt(isoMatch[2]!, 10);
    const period = h < 12 ? 'am' : 'pm';
    const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${dh}:${String(m).padStart(2, '0')}${period}`;
  }
  const hmMatch = t.match(/^(\d{1,2}):(\d{2})/);
  if (hmMatch) {
    const h = parseInt(hmMatch[1]!, 10);
    const m = parseInt(hmMatch[2]!, 10);
    const period = h < 12 ? 'am' : 'pm';
    const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${dh}:${String(m).padStart(2, '0')}${period}`;
  }
  return t;
}

function formatSolunarRange(start: string, end: string): string {
  return `${parseSolunarTime(start)} – ${parseSolunarTime(end)}`;
}

/** Condense "America/New_York" → "New York"-ish short string. */
function shortTz(tz: string): string {
  const parts = tz.split('/');
  return (parts[parts.length - 1] ?? tz).replace(/_/g, ' ');
}

/** Pick the editorial headline shown in the hero. Prefers the user's
 *  location label (e.g. "Tampa Bay") so the cover feels personalized; falls
 *  back to a clean context-driven label if the location isn't usable as a
 *  headline (long, raw coords, etc.). */
function buildHeadline(
  report: HowsFishingReportV1,
  isFuture: boolean,
): { primary: string; secondary?: string } {
  const raw = (report.location.location_label ?? '').trim();
  // Reject coordinate-shaped labels and overly long labels — they read
  // as data, not headlines.
  const looksLikeCoords = /^-?\d+\.\d/.test(raw);
  const usable = !!raw && !looksLikeCoords && raw.length <= 28;
  if (usable) {
    return {
      primary: raw.toUpperCase(),
      secondary: isFuture ? 'FORECAST READ' : "TODAY'S READ",
    };
  }
  // Fallback — context label minus the parenthetical.
  const context = (report.display_context_label ?? "Today's Bite").replace(
    /\s*\/.*$/,
    '',
  );
  return {
    primary: context.toUpperCase(),
    secondary: isFuture ? 'FORECAST READ' : "TODAY'S READ",
  };
}

/** ActionableTipTag → human label for the tactic chip on the Guide's Note. */
const TIP_TAG_LABELS: Record<ActionableTipTag, string> = {
  presentation_current_sweep: 'CURRENT SWEEP',
  presentation_contact_control: 'CONTACT CONTROL',
  presentation_visibility_profile: 'VISIBILITY',
  presentation_slow_subtle: 'SLOW & SUBTLE',
  presentation_active_cadence: 'ACTIVE CADENCE',
  presentation_general: 'PRESENTATION',
};

// ─── Air-temp / meta strip ───────────────────────────────────────────────────

/**
 * Bottom-of-hero meta strip. Shows the daily air-temp range, the user's
 * timezone (short form), and the report's display context. Compact mono so
 * it reads as masthead metadata rather than competing with the score.
 */
function HeroMetaStrip({
  report,
}: {
  report: HowsFishingReportV1;
}) {
  const snap = report.condition_context?.environment_snapshot;
  const lo =
    snap && typeof snap === 'object'
      ? (snap.daily_low_air_temp_f as number | null | undefined)
      : null;
  const hi =
    snap && typeof snap === 'object'
      ? (snap.daily_high_air_temp_f as number | null | undefined)
      : null;
  const hasTemp = lo != null && hi != null && Number.isFinite(lo) && Number.isFinite(hi);
  const tz = report.location.timezone ? shortTz(report.location.timezone) : null;
  const ctxLabel = (report.display_context_label ?? '').toUpperCase();

  // If there's nothing to render, skip the strip — keeps the hero from
  // landing on an empty horizontal line on legacy reports.
  if (!hasTemp && !tz && !ctxLabel) return null;

  return (
    <View style={styles.metaStripWrap}>
      <View style={styles.metaRule} />
      <View style={styles.metaRow}>
        {hasTemp ? (
          <View style={styles.metaItem}>
            <Ionicons name="thermometer-outline" size={11} color={paper.dashboardMuted} />
            <Text style={styles.metaItemLabel}>AIR</Text>
            <Text style={styles.metaItemValue}>
              {`${Math.round(lo!)}° / ${Math.round(hi!)}°F`}
            </Text>
          </View>
        ) : null}
        {hasTemp && (tz || ctxLabel) ? <View style={styles.metaSep} /> : null}
        {ctxLabel ? (
          <View style={styles.metaItem}>
            <Ionicons name="map-outline" size={11} color={paper.dashboardMuted} />
            <Text style={styles.metaItemValue} numberOfLines={1}>
              {ctxLabel}
            </Text>
          </View>
        ) : null}
        {ctxLabel && tz ? <View style={styles.metaSep} /> : null}
        {tz ? (
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={11} color={paper.dashboardMuted} />
            <Text style={styles.metaItemValue} numberOfLines={1}>
              {tz}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.metaRule} />
    </View>
  );
}

// ─── Editorial section header ───────────────────────────────────────────────

/**
 * Section banner used between major chunks of the report. Replaces a
 * generic card header — a tracked all-caps title flanked by hairlines and
 * (optionally) a small italic meta line on the right. Reads as printed
 * masthead, not UI chrome.
 */
function SectionMasthead({
  title,
  meta,
  color = paper.dashboardInk,
}: {
  title: string;
  meta?: string;
  color?: string;
}) {
  return (
    <View style={styles.sectionMasthead}>
      <View style={[styles.sectionMastheadRule, { backgroundColor: color }]} />
      <View style={styles.sectionMastheadInner}>
        <Text style={[styles.sectionMastheadTitle, { color }]} numberOfLines={1}>
          {title}
        </Text>
        {meta ? (
          <Text style={styles.sectionMastheadMeta} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
      </View>
      <View style={[styles.sectionMastheadRule, { backgroundColor: color }, { opacity: 0.45 }]} />
    </View>
  );
}

// ─── Timing resolver ─────────────────────────────────────────────────────────

function getTimingPeriods(report: HowsFishingReportV1): PeriodSlot[] | null {
  const hp = report.highlighted_periods;
  if (hp && hp.length === 4) return resolveTimingPeriods(hp);
  return resolveTimingFromPreset(report.daypart_preset);
}

// ─── Component ───────────────────────────────────────────────────────────────

export function RebuildReportView({
  report,
  solunarData,
  dateLabel = 'TODAY',
}: {
  report: HowsFishingReportV1;
  solunarData?: SolunarData | null;
  /** Uppercase date label shown in the hero outlook eyebrow. */
  dateLabel?: string;
}) {
  const tier = tierForScore(report.score);
  const accent = accentForScore100(report.score);
  const topDrivers = report.drivers.slice(0, 3);
  const topSuppressors = report.suppressors.slice(0, 2);
  const timingPeriods = getTimingPeriods(report);
  const showTiming = !!(report.daypart_note || timingPeriods);

  const isFuture =
    dateLabel.toUpperCase() !== 'TODAY' &&
    !dateLabel.toUpperCase().startsWith('TODAY');
  const headline = buildHeadline(report, isFuture);

  // Phrase is chosen off the engine's 4-band value so the word always
  // matches the number. Sentence-case Fraunces italic so the line reads
  // as an editor's verdict rather than a UI label.
  const bandKey = (report.band ?? '').toLowerCase();
  const outlookLine =
    bandKey === 'prime' || bandKey === 'excellent'
      ? isFuture
        ? 'A prime day shaping up.'
        : 'A prime day is shaping up.'
      : bandKey === 'good'
        ? isFuture
          ? 'A solid day ahead.'
          : 'A solid day today.'
        : bandKey === 'fair'
          ? isFuture
            ? 'A fair window expected.'
            : 'A fair window today.'
          : bandKey === 'poor'
            ? isFuture
              ? 'A tougher day shaping up.'
              : 'A tougher day ahead.'
            : isFuture
              ? 'Tough water ahead — keep it patient.'
              : 'Tough water today — keep it patient.';

  const tipTagLabel = TIP_TAG_LABELS[report.actionable_tip_tag] ?? null;

  return (
    <View style={styles.wrap}>
      <View style={styles.heroCard}>
        <TopographicLines
          style={styles.heroTopoLines}
          color={paper.dashboardBlue}
          count={4}
        />

        <View style={styles.heroEyebrow}>
          <SectionEyebrow color={paper.dashboardBlue} size={9} tracking={2}>
            {headline.secondary ?? dateLabel.toUpperCase()}
          </SectionEyebrow>
        </View>

        <Text style={styles.heroHeadline} numberOfLines={2}>
          {headline.primary}
          <Text style={styles.heroHeadlineDot}>.</Text>
        </Text>
        <LinearScoreGauge
          score={report.score / 10}
          tier={tier}
          accent={accent}
          accentText={scoreTextOnColor(report.score / 10)}
          band={report.band}
        />

        <Text style={[styles.heroOutlookLine, { color: paper.dashboardInk }]}>
          {outlookLine}
        </Text>

        <View style={styles.heroSummaryWrap}>
          <View style={[styles.heroSummaryRule, { backgroundColor: accent }]} />
          <Text style={styles.heroSummary}>{report.summary_line}</Text>
        </View>

        <HeroMetaStrip report={report} />
      </View>

      {/* ── ANALYTICAL SECTION (drivers + watchouts) ────────────────────── */}
      <SectionMasthead title="BITE FACTORS" meta={isFuture ? 'forecast' : 'today'} />

      <View style={styles.factorCard}>
        <View style={[styles.factorHeader, { backgroundColor: paper.bandPrime }]}>
          <Ionicons name="trending-up" size={14} color={paper.dashboardInk} />
          <Text style={styles.factorHeaderLabel}>WHAT'S HELPING</Text>
          <Text style={styles.factorHeaderCount}>
            {topDrivers.length}/{report.drivers.length}
          </Text>
        </View>
        <View style={styles.factorBody}>
          {topDrivers.length > 0 ? (
            topDrivers.map((d, i) => (
              <FactorRow
                key={`d-${i}`}
                index={i + 1}
                ribbonColor={paper.bandPrime}
                eyebrow={formatVariableEyebrow(d.variable)}
                label={formatFactorLabel(d.label)}
                isLast={i === topDrivers.length - 1}
              />
            ))
          ) : (
            <Text style={styles.mutedText}>
              No clear edge stands out today.
            </Text>
          )}
        </View>
      </View>

      {topSuppressors.length > 0 && (
        <View style={styles.factorCard}>
          <View style={[styles.factorHeader, { backgroundColor: '#F8E7E2' }]}>
            <Ionicons name="trending-down" size={14} color={paper.bandTough} />
            <Text style={styles.factorHeaderLabel}>WATCH OUT FOR</Text>
            <Text style={styles.factorHeaderCount}>
              {topSuppressors.length}/{report.suppressors.length}
            </Text>
          </View>
          <View style={styles.factorBody}>
            {topSuppressors.map((s, i) => (
              <FactorRow
                key={`s-${i}`}
                index={i + 1}
                ribbonColor={paper.bandTough}
                eyebrow={formatVariableEyebrow(s.variable)}
                label={formatFactorLabel(s.label)}
                isLast={i === topSuppressors.length - 1}
              />
            ))}
          </View>
        </View>
      )}

      {/* ── WHEN TO GO ──────────────────────────────────────────────────── */}
      {showTiming && timingPeriods && (
        <View style={styles.timingSection}>
          <SectionMasthead
            title="WHEN TO GO"
            meta={
              report.location.timezone
                ? `local time - ${shortTz(report.location.timezone)}`
                : 'local time'
            }
          />
          <View style={styles.timingRow}>
            {PERIOD_DEFS.map((def, i) => {
              const slot = timingPeriods[i];
              return (
                <TimeWindowTile
                  key={def.label}
                  label={def.label}
                  subLabel={def.subLabel}
                  icon={def.icon}
                  isBest={Boolean(slot?.highlighted)}
                />
              );
            })}
          </View>
          {report.timing_insight ? (
            <Text style={styles.daypartNote}>{report.timing_insight}</Text>
          ) : report.daypart_note ? (
            <Text style={styles.daypartNote}>{report.daypart_note}</Text>
          ) : null}
        </View>
      )}

      {/* ── ALMANAC · MOON & TIDE (was "SOLUNAR WINDOWS · BONUS") ─────── */}
      {solunarData &&
        (solunarData.major_periods.length > 0 ||
          solunarData.minor_periods.length > 0) && (
          <View style={styles.almanacCard}>
            <View style={styles.almanacHeader}>
              <Ionicons name="moon" size={14} color={paper.dashboardBlue} />
          <Text style={styles.almanacTitle}>MOON &amp; TIDE</Text>
            </View>
            <View style={styles.almanacRule} />
            <View style={styles.almanacRow}>
              {solunarData.major_periods.length > 0 && (
                <View style={styles.almanacCol}>
                  <Text style={styles.almanacSubhead}>STRONG WINDOWS</Text>
                  {solunarData.major_periods.map((p, i) => (
                    <View key={`maj-${i}`} style={styles.almanacPeriod}>
                      <View style={styles.almanacDotStrong} />
                      <Text style={styles.almanacTime}>
                        {formatSolunarRange(p.start, p.end)}
                      </Text>
                      {p.type != null && (
                        <Text style={styles.almanacType}>
                          {p.type === 'overhead' ? '↑' : '↓'}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
              {solunarData.minor_periods.length > 0 && (
                <View
                  style={[
                    styles.almanacCol,
                    solunarData.major_periods.length > 0 && styles.almanacColRight,
                  ]}
                >
                  <Text style={styles.almanacSubhead}>MINOR WINDOWS</Text>
                  {solunarData.minor_periods.map((p, i) => (
                    <View key={`min-${i}`} style={styles.almanacPeriod}>
                      <View style={styles.almanacDotMinor} />
                      <Text style={styles.almanacTimeMinor}>
                        {formatSolunarRange(p.start, p.end)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

      {/* ── GUIDE'S NOTE — editorial centerpiece ────────────────────────── */}
      <View style={styles.guideCard}>
        <TopographicLines
          style={styles.guideLines}
          color={paper.dashboardBlue}
          count={5}
        />
        <View style={styles.guideEyebrowRow}>
          <SectionEyebrow color={paper.dashboardBlue} size={10} tracking={2.4}>
            GUIDE NOTE
          </SectionEyebrow>
          {tipTagLabel ? (
            <View style={styles.tipTagChip}>
              <Text style={styles.tipTagChipText}>{tipTagLabel}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.guideRow}>
          <View style={styles.guideBadge}>
            <Ionicons name="sparkles-outline" size={24} color={paper.dashboardBlue} />
          </View>
          <View style={styles.guideBody}>
            <Text style={styles.guideText}>{report.actionable_tip}</Text>
            <Text style={styles.guideSignoff}>FINFINDR CONDITIONS</Text>
          </View>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Ionicons name="analytics-outline" size={12} color={paper.dashboardMuted} />
        <Text style={styles.footerText}>TODAY'S BITE - CONDITIONS READ</Text>
      </View>
    </View>
  );
}

// ─── LinearScoreGauge ────────────────────────────────────────────────────────

function LinearScoreGauge({
  score,
  tier,
  accent,
  accentText,
  band,
}: {
  score: number;
  tier: PaperTier;
  accent: string;
  accentText: string;
  band?: string;
}) {
  const clamped = Math.max(0, Math.min(10, Number.isFinite(score) ? score : 0));
  const pct = clamped / 10;
  const bandLabel = (band ?? '').toUpperCase() || fallbackBandFromTier(tier);

  const progress = useRef(new Animated.Value(0)).current;
  const bandOpacity = useRef(new Animated.Value(0)).current;
  const [displayScore, setDisplayScore] = useState('0.0');

  useEffect(() => {
    progress.setValue(0);
    bandOpacity.setValue(0);
    setDisplayScore('0.0');

    const listenerId = progress.addListener(({ value }) => {
      setDisplayScore((value * 10).toFixed(1));
    });

    Animated.parallel([
      Animated.timing(progress, {
        toValue: pct,
        duration: 750,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(bandOpacity, {
        toValue: 1,
        duration: 260,
        delay: 520,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDisplayScore(clamped.toFixed(1));
    });

    return () => {
      progress.removeListener(listenerId);
    };
  }, [pct, clamped, progress, bandOpacity]);

  const leftInterp = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={gaugeStyles.wrap}>
      <View style={[gaugeStyles.panel, { borderColor: `${accent}55` }]}>
        <View style={gaugeStyles.panelHeader}>
          <Text style={gaugeStyles.panelLabel}>CONDITION SCORE</Text>
          <Animated.View
            style={[
              gaugeStyles.bandPill,
              { backgroundColor: accent, opacity: bandOpacity },
            ]}
          >
            <Text style={[gaugeStyles.bandPillText, { color: accentText }]}>
              {bandLabel}
            </Text>
          </Animated.View>
        </View>

        <View style={gaugeStyles.scoreRow}>
          <View style={[gaugeStyles.scoreHalo, { backgroundColor: accent }]} />
          <Text
            style={[gaugeStyles.scoreNum, { color: paper.dashboardInk }]}
            allowFontScaling={false}
          >
            {displayScore}
          </Text>
          <Text style={gaugeStyles.scoreMax}>/10</Text>
        </View>

        <View style={gaugeStyles.trackRow}>
          <View style={gaugeStyles.track}>
            <View style={[gaugeStyles.stop, { flex: 2.2, backgroundColor: paper.bandTough }]} />
            <View style={[gaugeStyles.stop, { flex: 1.2, backgroundColor: paper.bandPoor }]} />
            <View style={[gaugeStyles.stop, { flex: 1.6, backgroundColor: paper.bandFair }]} />
            <View style={[gaugeStyles.stop, { flex: 2.2, backgroundColor: paper.bandGood }]} />
            <View style={[gaugeStyles.stop, { flex: 2.8, backgroundColor: paper.bandPrime }]} />
          </View>

          <Animated.View
            pointerEvents="none"
            style={[
              gaugeStyles.markerStem,
              { left: leftInterp, backgroundColor: accent },
            ]}
          />

          <Animated.View
            pointerEvents="none"
            style={[gaugeStyles.markerPinWrap, { left: leftInterp }]}
          >
            <View style={[gaugeStyles.markerPin, { backgroundColor: accent }]} />
          </Animated.View>
        </View>

        <View style={gaugeStyles.scaleRow}>
          <Text style={gaugeStyles.scaleTick}>0</Text>
          <Text style={gaugeStyles.scaleTick}>5</Text>
          <Text style={gaugeStyles.scaleTick}>10</Text>
        </View>
      </View>
    </View>
  );
}

function fallbackBandFromTier(tier: PaperTier): string {
  // Tier is a 3-bucket visual grouping; we surface the most-likely 5-band
  // label for that bucket when the cached report doesn't carry one.
  return tier === 'green' ? 'GOOD' : tier === 'yellow' ? 'FAIR' : 'TOUGH';
}

const gaugeStyles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: paperSpacing.sm,
    marginBottom: paperSpacing.xs,
    width: '100%',
  },
  panel: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#F7FAFB',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 2,
  },
  panelLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.5,
    color: paper.dashboardBlue,
    fontWeight: '700',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: 6,
    paddingHorizontal: 4,
    paddingTop: 2,
    paddingBottom: 4,
    position: 'relative',
  },
  scoreHalo: {
    position: 'absolute',
    top: 4,
    bottom: 2,
    left: 0,
    width: 104,
    opacity: 0.1,
    borderRadius: 60,
  },
  scoreNum: {
    fontFamily: paperFonts.monoBold,
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: 0,
    fontWeight: '700',
    includeFontPadding: false,
  },
  scoreMax: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    marginBottom: 9,
    color: paper.dashboardMuted,
  },
  trackRow: {
    width: '100%',
    height: 22,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    overflow: 'hidden',
    backgroundColor: paper.dashboardWhite,
  },
  stop: {
    height: '100%',
  },
  markerStem: {
    position: 'absolute',
    top: -8,
    width: 2,
    height: 10,
    marginLeft: -1,
    opacity: 0.55,
  },
  markerPinWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    marginLeft: -9,
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: paper.dashboardInk,
  },
  scaleRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  scaleTick: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.dashboardMuted,
    opacity: 0.6,
  },
  bandPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(7, 27, 45, 0.2)',
  },
  bandPillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.8,
    fontWeight: '700',
  },
});

// ─── FactorRow — illuminated editorial row ───────────────────────────────────

/**
 * Each factor row reads as a printed editorial entry: numbered ordinal,
 * left-side color ribbon (forest for helpers, red for watchouts), a
 * small variable-type eyebrow, and the engine label below in display
 * Fraunces. Strong color identity at a glance, full editorial heft.
 */
function FactorRow({
  index,
  ribbonColor,
  eyebrow,
  label,
  isLast,
}: {
  index: number;
  ribbonColor: string;
  eyebrow: string;
  label: string;
  isLast: boolean;
}) {
  return (
    <View style={[styles.factorRow, !isLast && styles.factorRowDivider]}>
      <View style={styles.factorOrdinalCol}>
        <Text style={styles.factorOrdinal}>
          {String(index).padStart(2, '0')}
        </Text>
      </View>
      <View style={[styles.factorRibbon, { backgroundColor: ribbonColor }]} />
      <View style={styles.factorTextStack}>
        <Text
          style={[styles.factorEyebrow, { color: ribbonColor }]}
          numberOfLines={1}
        >
          {eyebrow}
        </Text>
        <Text style={styles.factorLabel}>{label}</Text>
      </View>
    </View>
  );
}

// ─── TimeWindowTile ──────────────────────────────────────────────────────────

function TimeWindowTile({
  label,
  subLabel,
  icon,
  isBest,
}: {
  label: string;
  subLabel: string;
  icon: keyof typeof import('@expo/vector-icons/build/Ionicons').default.glyphMap;
  isBest: boolean;
}) {
  const bestBg = '#E7F5E1';
  const bestFg = paper.dashboardInk;

  return (
    <View
      style={[
        styles.timeTile,
        isBest && {
          backgroundColor: bestBg,
          transform: [{ translateY: -2 }],
        },
      ]}
    >
      {isBest && (
        <View style={styles.bestBadge}>
          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
        </View>
      )}
      <View style={styles.timeTileTop}>
        <Ionicons
          name={icon}
          size={22}
          color={isBest ? bestFg : paper.dashboardInk}
        />
      </View>
      <View
        style={[
          styles.timeTileBody,
          isBest && { borderTopColor: 'rgba(47, 174, 99, 0.35)' },
        ]}
      >
        <Text
          style={[styles.timeTileLabel, isBest && { color: bestFg }]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.timeTileRange,
            isBest && { color: bestFg, opacity: 0.85 },
          ]}
          numberOfLines={1}
        >
          {subLabel}
        </Text>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrap: { gap: paperSpacing.md + 6 },

  // ── HERO ─────────────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.md,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.md - 2,
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
  },
  heroTopoLines: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  heroEyebrow: {
    marginBottom: 4,
    alignItems: 'center',
  },
  heroHeadline: {
    fontFamily: paperFonts.display,
    fontWeight: '800',
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: 'center',
    color: paper.dashboardInk,
    paddingHorizontal: paperSpacing.sm,
  },
  heroHeadlineDot: {
    color: paper.dashboardBlue,
  },
  heroOutlookLine: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: paperSpacing.sm,
  },
  heroSummaryWrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'center',
    maxWidth: 340,
    paddingHorizontal: paperSpacing.xs,
    marginTop: 0,
    marginBottom: paperSpacing.xs,
  },
  heroSummaryRule: {
    width: 2.5,
    borderRadius: 1,
    marginRight: 10,
    opacity: 0.85,
  },
  heroSummary: {
    flex: 1,
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 22,
    color: paper.dashboardInk,
    opacity: 0.88,
    textAlign: 'left',
    letterSpacing: 0,
  },

  // ── Hero meta strip (air · ctx · tz) ─────────────────────────────────
  metaStripWrap: {
    width: '100%',
    marginTop: paperSpacing.sm + 4,
  },
  metaRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardLine,
    opacity: 0.45,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  metaItemLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    letterSpacing: 1.8,
    color: paper.dashboardMuted,
    opacity: 0.55,
    fontWeight: '700',
  },
  metaItemValue: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardInk,
    letterSpacing: 0.6,
    fontWeight: '700',
  },
  metaSep: {
    width: StyleSheet.hairlineWidth,
    height: 12,
    backgroundColor: paper.dashboardLine,
    opacity: 0.35,
  },

  // ── Section masthead ────────────────────────────────────────────────
  sectionMasthead: {
    width: '100%',
    alignItems: 'stretch',
    gap: 4,
  },
  sectionMastheadRule: {
    height: 1.6,
    width: '100%',
  },
  sectionMastheadInner: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: 4,
    gap: 8,
    flexWrap: 'wrap',
  },
  sectionMastheadTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11.5,
    letterSpacing: 2.8,
    fontWeight: '700',
    flexShrink: 1,
  },
  sectionMastheadMeta: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 11,
    color: paper.dashboardMuted,
    opacity: 0.55,
  },

  // ── Factor cards ────────────────────────────────────────────────────
  factorCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    overflow: 'hidden',
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: 9,
    borderBottomWidth: 1.5,
    borderBottomColor: paper.dashboardLine,
  },
  factorHeaderLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2.6,
    color: paper.dashboardInk,
    fontWeight: '700',
    flex: 1,
  },
  factorHeaderCount: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
    opacity: 0.7,
    fontWeight: '700',
  },
  factorBody: {
    paddingHorizontal: paperSpacing.md - 2,
    paddingTop: paperSpacing.xs,
    paddingBottom: paperSpacing.sm,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm + 2,
  },
  factorRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: paper.dashboardHair,
  },
  factorOrdinalCol: {
    width: 28,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  factorOrdinal: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '800',
    color: paper.dashboardInk,
    opacity: 0.32,
    letterSpacing: 0,
    includeFontPadding: false,
  },
  factorRibbon: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    minHeight: 38,
  },
  factorTextStack: {
    flex: 1,
    minWidth: 0,
    gap: 3,
    paddingTop: 1,
  },
  factorEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2.2,
    fontWeight: '700',
    lineHeight: 11,
  },
  factorLabel: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 14.5,
    lineHeight: 20,
    color: paper.dashboardInk,
    fontWeight: '600',
  },
  mutedText: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 13,
    color: paper.dashboardMuted,
    opacity: 0.55,
    paddingVertical: paperSpacing.sm,
  },

  // ── Timing section ──────────────────────────────────────────────────
  timingSection: {
    gap: paperSpacing.sm,
  },
  timingRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: paperSpacing.xs + 2,
  },
  daypartNote: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 13,
    lineHeight: 20,
    color: paper.dashboardMuted,
    opacity: 0.78,
    marginTop: paperSpacing.sm + 2,
    paddingHorizontal: paperSpacing.xs,
  },

  // ── Time tiles ──────────────────────────────────────────────────────
  timeTile: {
    flex: 1,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    overflow: 'hidden',
    minHeight: 110,
  },
  timeTileTop: {
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 8,
    alignItems: 'center',
  },
  timeTileBody: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardHair,
    alignItems: 'center',
  },
  timeTileLabel: {
    fontFamily: paperFonts.display,
    fontSize: 14.5,
    fontWeight: '700',
    color: paper.dashboardInk,
    letterSpacing: 0,
  },
  timeTileRange: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.dashboardMuted,
    opacity: 0.65,
    marginTop: 2,
  },
  bestBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: paper.dashboardInk,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },

  // ── Almanac (was Solunar) ──────────────────────────────────────────
  almanacCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md,
  },
  almanacHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  almanacTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2.8,
    color: paper.dashboardBlue,
    fontWeight: '700',
    flex: 1,
  },
  almanacRule: {
    height: 1.5,
    backgroundColor: paper.dashboardLine,
    opacity: 0.7,
    marginTop: paperSpacing.sm,
    marginBottom: paperSpacing.sm + 2,
  },
  almanacRow: {
    flexDirection: 'row',
    gap: paperSpacing.md,
  },
  almanacCol: { flex: 1 },
  almanacColRight: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: paper.dashboardLine,
    paddingLeft: paperSpacing.md,
  },
  almanacSubhead: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2.2,
    color: paper.dashboardBlue,
    opacity: 0.85,
    marginBottom: paperSpacing.xs,
    fontWeight: '700',
  },
  almanacPeriod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  almanacDotStrong: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: paper.dashboardBlue,
  },
  almanacDotMinor: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    opacity: 0.65,
  },
  almanacTime: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardInk,
    flex: 1,
    fontWeight: '700',
  },
  almanacTimeMinor: {
    fontFamily: paperFonts.metaMono,
    fontSize: 11,
    color: paper.dashboardMuted,
    opacity: 0.7,
    flex: 1,
  },
  almanacType: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.dashboardBlue,
    opacity: 0.7,
  },

  // ── Guide's note (editorial centerpiece) ────────────────────────────
  guideCard: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.lg,
    overflow: 'hidden',
  },
  guideLines: {
    left: undefined,
    right: -30,
    top: -20,
    width: 280,
    height: 280,
  },
  guideEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: paperSpacing.sm + 2,
    gap: paperSpacing.sm,
  },
  tipTagChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 999,
    backgroundColor: '#F6F9FB',
  },
  tipTagChipText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    letterSpacing: 1.6,
    color: paper.dashboardMuted,
    fontWeight: '700',
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.md + 4,
  },
  guideBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardBlueSky,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  guideBody: { flex: 1 },
  guideText: {
    fontFamily: paperFonts.displayMedium,
    fontSize: 16,
    lineHeight: 24,
    color: paper.dashboardInk,
    marginTop: 2,
  },
  guideSignoff: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2.4,
    color: paper.dashboardMuted,
    opacity: 0.7,
    marginTop: paperSpacing.sm + 2,
    fontWeight: '700',
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
  },
  footerText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.6,
    color: paper.dashboardMuted,
    fontWeight: '700',
  },
});
