/**
 * How's Fishing — Immersive visual report.
 * Lush Forest palette · Bricolage Grotesque headings · Inter body
 * Each section: scored gauge, timing tiles, numbered reasons, tip card.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../lib/theme';
import { AIR_TEMP_LARGE_DIURNAL_SWING_F } from '../../lib/airTempUiConstants';
import type { HowsFishingReportV1 } from '../../lib/howFishing';
// DaypartNotePreset used implicitly via report.daypart_preset in legacy fallback path
import type { SolunarData } from '../../lib/env/types';

// ─── Score helpers ────────────────────────────────────────────────────────────

function scoreOutOf10(score: number): number {
  return Math.round(score / 10);
}

function displayScore(score: number): string {
  const v = Math.round(score) / 10;
  return Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
}

/** Capitalize sentence starts after . ; ! ? so LLM/engine multi-sentence lines read correctly. */
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

/** Per-segment color: deep gradient red → amber → forest green */
// Gauge has 10 segments (idx 0–9). Aligned with band thresholds:
// Poor <40 → idx 0–3, Fair 40–59 → idx 4–5, Good 60–79 → idx 6–7, Excellent 80+ → idx 8–9
function segmentColor(idx: number): string {
  if (idx <= 3) return '#C0504A'; // Poor
  if (idx <= 5) return '#C29B2A'; // Fair
  if (idx <= 7) return '#5EA86A'; // Good
  return '#2E6F40';               // Excellent
}

// Score number color — aligned with band thresholds (Poor <40, Fair 40–59, Good/Excellent ≥60)
function scoreTextColor(score: number): string {
  if (score >= 60) return '#2E6F40'; // Good or Excellent
  if (score >= 40) return '#C29B2A'; // Fair
  return '#C0504A';                  // Poor
}

// ─── Band config ──────────────────────────────────────────────────────────────

function AirForecastStrip({ report }: { report: HowsFishingReportV1 }) {
  const snap = report.condition_context?.environment_snapshot;
  if (!snap || typeof snap !== 'object') return null;
  const lo = snap.daily_low_air_temp_f as number | null | undefined;
  const hi = snap.daily_high_air_temp_f as number | null | undefined;
  if (lo == null || hi == null || !Number.isFinite(lo) || !Number.isFinite(hi)) return null;
  return (
    <View style={airForecastStyles.wrap}>
      <Ionicons name="thermometer-outline" size={13} color={colors.textMuted} />
      <Text style={airForecastStyles.label}>Air</Text>
      <Text style={airForecastStyles.range}>{`${Math.round(lo)}–${Math.round(hi)}°F`}</Text>
    </View>
  );
}

const airForecastStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.sm,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.textMuted,
  },
  range: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
});

const BAND_CONFIG: Record<string, {
  color: string; bg: string; border: string; icon: keyof typeof Ionicons.glyphMap;
}> = {
  Excellent: { color: '#2E6F40', bg: '#E6F5EB', border: '#2E6F4030', icon: 'flame' },
  Good:      { color: '#3A8A54', bg: '#EEF8F2', border: '#3A8A5428', icon: 'thumbs-up' },
  Fair:      { color: '#C29B2A', bg: '#FDF6E8', border: '#C29B2A28', icon: 'partly-sunny-outline' },
  Poor:      { color: '#C0504A', bg: '#FDF0EF', border: '#C0504A28', icon: 'arrow-down-circle-outline' },
};

// ─── Score Gauge ──────────────────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const filled = scoreOutOf10(score);
  return (
    <View style={gaugeStyles.wrap}>
      <View style={gaugeStyles.track}>
        {Array.from({ length: 10 }, (_, i) => {
          const idx = i + 1;
          const active = idx <= filled;
          const isLast = idx === filled;
          return (
            <View
              key={i}
              style={[
                gaugeStyles.segment,
                active
                  ? { backgroundColor: segmentColor(idx) }
                  : gaugeStyles.segmentInactive,
                isLast && gaugeStyles.segmentTip,
              ]}
            />
          );
        })}
      </View>
      <View style={gaugeStyles.labelRow}>
        <Text style={gaugeStyles.labelLeft}>0</Text>
        <Text style={gaugeStyles.labelCenter}>5</Text>
        <Text style={gaugeStyles.labelRight}>10</Text>
      </View>
    </View>
  );
}

const gaugeStyles = StyleSheet.create({
  wrap: { marginTop: spacing.md, marginBottom: spacing.sm },
  track: {
    flexDirection: 'row',
    gap: 3,
    height: 14,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    borderRadius: 3,
  },
  segmentInactive: {
    backgroundColor: '#D4E8D8',
  },
  segmentTip: {
    shadowColor: '#253D2C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 1,
  },
  labelLeft:   { fontFamily: fonts.bodySemiBold, fontSize: 10, color: colors.textMuted },
  labelCenter: { fontFamily: fonts.bodySemiBold, fontSize: 10, color: colors.textMuted },
  labelRight:  { fontFamily: fonts.bodySemiBold, fontSize: 10, color: colors.textMuted },
});

// ─── Timing periods ───────────────────────────────────────────────────────────

type PeriodSlot = { label: string; icon: keyof typeof Ionicons.glyphMap; highlighted: boolean };

const PERIOD_PRESETS: Record<string, boolean[]> = {
  early_late_low_light:    [true,  false, false, true],
  warmest_part_may_help:   [false, false, true,  false],
  cooler_low_light_better: [true,  true,  false, true],
  moving_water_periods:    [true,  true,  true,  true],
};

const PERIOD_DEFS: { label: string; icon: keyof typeof Ionicons.glyphMap; subLabel: string }[] = [
  { label: 'Dawn',      subLabel: '5–7am',   icon: 'partly-sunny-outline' },
  { label: 'Morning',   subLabel: '7–11am',  icon: 'sunny-outline' },
  { label: 'Afternoon', subLabel: '11–5pm',  icon: 'sunny' },
  { label: 'Evening',   subLabel: '5–9pm',   icon: 'moon-outline' },
];

function getTimingPeriods(report: HowsFishingReportV1): PeriodSlot[] | null {
  // New path: direct period flags from the timing engine
  const hp = (report as any).highlighted_periods as boolean[] | undefined;
  if (hp && hp.length === 4) {
    if (hp.every((p: boolean) => !p)) return null; // all false = no edge
    return PERIOD_DEFS.map((p, i) => ({ label: p.label, icon: p.icon, highlighted: hp[i] }));
  }
  // Legacy fallback for cached reports without highlighted_periods
  const preset = report.daypart_preset;
  if (!preset || preset === 'no_timing_edge') return null;
  const flags = PERIOD_PRESETS[preset];
  if (!flags) return null;
  return PERIOD_DEFS.map((p, i) => ({ label: p.label, icon: p.icon, highlighted: flags[i] }));
}

// ─── Timing Tile ─────────────────────────────────────────────────────────────

function TimingTile({ label, icon, highlighted, subLabel }: {
  label: string; icon: keyof typeof Ionicons.glyphMap;
  highlighted: boolean; subLabel: string;
}) {
  return (
    <View style={[
      timingStyles.tile,
      highlighted ? timingStyles.tileActive : timingStyles.tileInactive,
    ]}>
      <View style={[
        timingStyles.iconWrap,
        highlighted ? timingStyles.iconWrapActive : timingStyles.iconWrapInactive,
      ]}>
        <Ionicons
          name={icon}
          size={20}
          color={highlighted ? '#C29B2A' : colors.textMuted}
        />
      </View>
      <Text style={[timingStyles.tileLabel, highlighted && timingStyles.tileLabelActive]}>
        {label}
      </Text>
      <Text style={timingStyles.tileSubLabel}>{subLabel}</Text>
    </View>
  );
}

const timingStyles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
    borderRadius: radius.md,
    borderWidth: 1.5,
    gap: 4,
  },
  tileActive: {
    backgroundColor: '#FFFBEF',
    borderColor: '#C29B2A50',
  },
  tileInactive: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.borderLight,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconWrapActive: {
    backgroundColor: '#FDF6E8',
  },
  iconWrapInactive: {
    backgroundColor: colors.background,
  },
  tileLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: colors.textMuted,
  },
  tileLabelActive: {
    color: '#B8862D',
  },
  tileSubLabel: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textMuted,
  },
});

// ─── Solunar helpers ──────────────────────────────────────────────────────────

/** Parse a solunar time string (ISO local or "HH:mm") to "9:15am" format */
function parseSolunarTime(t: string): string {
  // ISO local: "YYYY-MM-DDTHH:mm:ss" or "YYYY-MM-DDTHH:mm"
  const isoMatch = t.match(/T(\d{2}):(\d{2})/);
  if (isoMatch) {
    const h = parseInt(isoMatch[1]!, 10);
    const m = parseInt(isoMatch[2]!, 10);
    const period = h < 12 ? 'am' : 'pm';
    const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${dh}:${String(m).padStart(2, '0')}${period}`;
  }
  // Plain "HH:mm"
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function RebuildReportView({
  report,
  solunarData,
}: {
  report: HowsFishingReportV1;
  solunarData?: SolunarData | null;
}) {
  const config = BAND_CONFIG[report.band] ?? {
    color: colors.textMuted,
    bg: colors.backgroundAlt,
    border: colors.border,
    icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap,
  };

  const sc = scoreTextColor(report.score);
  const timingPeriods = getTimingPeriods(report);
  const topDrivers = report.drivers.slice(0, 3);
  const topSuppressors = report.suppressors.slice(0, 2);
  const showTiming = !!(report.daypart_note || timingPeriods);

  return (
    <View style={styles.wrap}>

      {/* ══════════════════════════════════════════════════
          CARD 1 — Score + Gauge
      ══════════════════════════════════════════════════ */}
      <View style={[styles.scoreCard, { backgroundColor: config.bg, borderColor: config.border }]}>

        {/* Top row: band badge left, score right */}
        <View style={styles.scoreTopRow}>
          <View style={styles.scoreLeftCol}>
            <View style={[styles.bandBadge, { backgroundColor: config.color }]}>
              <Ionicons name={config.icon} size={11} color="#FFF" />
              <Text style={styles.bandBadgeText}>{report.band}</Text>
            </View>
            <Text style={styles.outlookLabel}>Today's Fishing Outlook</Text>
          </View>

          <View style={styles.scoreNumWrap}>
            <Text style={[styles.scoreNum, { color: sc }]}>{displayScore(report.score)}</Text>
            <Text style={[styles.scoreMax, { color: sc + 'AA' }]}>/10</Text>
          </View>
        </View>

        {/* Gauge bar */}
        <ScoreGauge score={report.score} />

        {/* Divider + summary */}
        <View style={styles.divider} />
        <Text style={styles.summaryLine}>{report.summary_line}</Text>
        <AirForecastStrip report={report} />
      </View>

      {/* ══════════════════════════════════════════════════
          CARD 2 — Top Reasons
      ══════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconBox, { backgroundColor: colors.primaryMist }]}>
            <Ionicons name="stats-chart" size={14} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>Top Reasons</Text>
        </View>

        <View style={styles.reasonList}>
          {topDrivers.length > 0 ? topDrivers.map((d, i) => (
            <View key={`d-${i}`} style={styles.reasonRow}>
              <View style={[styles.reasonNum, { backgroundColor: colors.primary }]}>
                <Text style={styles.reasonNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.driverText}>{formatFactorLabel(d.label)}</Text>
            </View>
          )) : (
            <View style={styles.reasonRow}>
              <View style={[styles.reasonNum, { backgroundColor: colors.backgroundAlt }]}>
                <Ionicons name="remove" size={11} color={colors.textMuted} />
              </View>
              <Text style={styles.mutedText}>No strong positive factors today.</Text>
            </View>
          )}

          {topSuppressors.length > 0 && (
            <>
              <View style={styles.reasonSep}>
                <View style={styles.reasonSepLine} />
                <Text style={styles.reasonSepLabel}>Limiting Factors</Text>
                <View style={styles.reasonSepLine} />
              </View>
              {topSuppressors.map((s, i) => (
                <View key={`s-${i}`} style={styles.reasonRow}>
                  <View style={[styles.reasonNum, { backgroundColor: '#FDF0EF' }]}>
                    <Ionicons name="close" size={11} color="#C0504A" />
                  </View>
                  <Text style={styles.suppressorText}>{s.label}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </View>

      {/* ══════════════════════════════════════════════════
          CARD 3 — Best Timing
      ══════════════════════════════════════════════════ */}
      {showTiming && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: '#FDF6E8' }]}>
              <Ionicons name="time" size={14} color="#C29B2A" />
            </View>
            <Text style={[styles.cardTitle, { color: '#B8862D' }]}>Best Timing</Text>
          </View>

          {timingPeriods && (
            <View style={styles.timingRow}>
              {PERIOD_DEFS.map((def, i) => {
                const slot = timingPeriods[i];
                return (
                  <TimingTile
                    key={i}
                    label={def.label}
                    subLabel={def.subLabel}
                    icon={def.icon}
                    highlighted={slot.highlighted}
                  />
                );
              })}
            </View>
          )}

          {report.daypart_note ? (
            <Text style={styles.daypartNote}>{report.daypart_note}</Text>
          ) : null}
        </View>
      )}

      {/* ══════════════════════════════════════════════════
          CARD 4 — Solunar Windows
      ══════════════════════════════════════════════════ */}
      {solunarData && (solunarData.major_periods.length > 0 || solunarData.minor_periods.length > 0) && (
        <View style={solunarStyles.card}>
          <View style={solunarStyles.header}>
            <Ionicons name="moon" size={12} color="#4F61A3" />
            <Text style={solunarStyles.cardTitle}>Solunar Windows</Text>
            <Text style={solunarStyles.cardSubtitle}>Bonus</Text>
          </View>

          <View style={solunarStyles.periodsRow}>
            {solunarData.major_periods.length > 0 && (
              <View style={solunarStyles.periodGroup}>
                <Text style={solunarStyles.sectionLabel}>STRONG</Text>
                {solunarData.major_periods.map((p, i) => (
                  <View key={`maj-${i}`} style={solunarStyles.periodRow}>
                    <View style={solunarStyles.dotStrong} />
                    <Text style={solunarStyles.periodTime}>
                      {formatSolunarRange(p.start, p.end)}
                    </Text>
                    {p.type != null && (
                      <Text style={solunarStyles.typeLabel}>
                        {p.type === 'overhead' ? '↑' : '↓'}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
            {solunarData.minor_periods.length > 0 && (
              <View style={[solunarStyles.periodGroup, solunarData.major_periods.length > 0 && solunarStyles.periodGroupRight]}>
                <Text style={solunarStyles.sectionLabel}>MINOR</Text>
                {solunarData.minor_periods.map((p, i) => (
                  <View key={`min-${i}`} style={solunarStyles.periodRow}>
                    <View style={solunarStyles.dotMinor} />
                    <Text style={solunarStyles.periodTimeMinor}>
                      {formatSolunarRange(p.start, p.end)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* ══════════════════════════════════════════════════
          CARD 5 — Tip of the Day
      ══════════════════════════════════════════════════ */}
      <View style={styles.tipCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconBox, { backgroundColor: 'rgba(46,111,64,0.15)' }]}>
            <Ionicons name="bulb" size={14} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Tip of the Day</Text>
        </View>
        <View style={styles.tipQuoteWrap}>
          <View style={styles.tipAccentBar} />
          <Text style={styles.tipText}>{report.actionable_tip}</Text>
        </View>
      </View>

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },

  // ── Score Card ──────────────────────────────────────────────────
  scoreCard: {
    borderRadius: radius.lg,
    padding: 20,
    paddingBottom: spacing.md + 4,
    borderWidth: 1.5,
    ...shadows.lg,
  },
  scoreTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scoreLeftCol: {
    gap: spacing.xs + 2,
    flex: 1,
    paddingRight: spacing.md,
  },
  bandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  bandBadgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: '#FFF',
    letterSpacing: 0.4,
  },
  outlookLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scoreNumWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  scoreNum: {
    fontFamily: fonts.serifBold,
    fontSize: 68,
    lineHeight: 72,
  },
  scoreMax: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 20,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  summaryLine: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.text,
    lineHeight: 23,
  },

  // ── Generic Card ────────────────────────────────────────────────
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardIconBox: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    flex: 1,
  },

  // ── Reasons ─────────────────────────────────────────────────────
  reasonList: { gap: spacing.sm + 2 },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  reasonNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  reasonNumText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: '#FFF',
  },
  driverText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
    flex: 1,
  },
  suppressorText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    flex: 1,
  },
  mutedText: {
    fontFamily: fonts.bodyItalic,
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  reasonSep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: 2,
  },
  reasonSepLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  reasonSepLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  // ── Timing ──────────────────────────────────────────────────────
  timingRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm + 4,
  },
  daypartNote: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 2,
  },

  // ── Tip ─────────────────────────────────────────────────────────
  tipCard: {
    backgroundColor: 'rgba(207,255,220,0.5)',
    borderRadius: radius.lg,
    padding: spacing.md + 2,
    borderWidth: 1.5,
    borderColor: 'rgba(46,111,64,0.18)',
    ...shadows.md,
  },
  tipQuoteWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  tipAccentBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    alignSelf: 'stretch',
    minHeight: 20,
    opacity: 0.7,
  },
  tipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    flex: 1,
  },
});

// ─── Solunar styles ───────────────────────────────────────────────────────────

const solunarStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm + 4,
    paddingBottom: spacing.sm + 4,
    borderWidth: 1,
    borderColor: 'rgba(79,97,163,0.15)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: '#4F61A3',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    flex: 1,
  },
  cardSubtitle: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  periodsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  periodGroup: {
    flex: 1,
  },
  periodGroupRight: {
    borderLeftWidth: 1,
    borderLeftColor: colors.borderLight,
    paddingLeft: spacing.md,
  },
  sectionLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 8,
    color: '#4F61A3',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: 5,
    opacity: 0.7,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  dotStrong: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#4F61A3',
    flexShrink: 0,
  },
  dotMinor: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4F61A380',
    flexShrink: 0,
  },
  periodTime: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.text,
    flex: 1,
  },
  periodTimeMinor: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  typeLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: '#4F61A3',
    opacity: 0.7,
  },
});
