/**
 * How's Fishing report view — FinFindr "paper/ink" visual language.
 *
 * This is the visual layer of the real engine report. Every field rendered
 * here comes from `HowsFishingReportV1` (or the companion `solunarData` env
 * payload). The structure follows the FinFindr `ReportPage` in `finfindr.jsx`:
 *
 *   HERO       — LinearScoreGauge (0-10 red→yellow→green track) + tier-
 *                 colored outlook label + summary. Intentionally compact so
 *                 the hero feels like a headline, not a whole screen.
 *   WHAT'S HELPING / WATCH OUT FOR — two paper cards with ink borders and
 *                 dashed row separators; drivers on the forest card, suppressors
 *                 on the red card. Reason text uses Fraunces like the mock.
 *   WHEN TO GO — 4 time-window tiles (Dawn / Morning / Afternoon / Evening)
 *                 with the highlighted period(s) getting the "★ BEST" treatment.
 *   SOLUNAR WINDOWS — preserved as a secondary paper card when data available.
 *   GUIDE'S NOTE — paper card with the actionable tip quoted from the engine.
 *
 * Behavior preserved from the previous implementation:
 *   - driver/suppressor truncation (top 3 / top 2) to keep the hero focused.
 *   - Solunar data is rendered only when `solunarData` has periods.
 *   - formatFactorLabel handles multi-sentence engine text capitalization.
 *   - Score is expressed via a linear 0-10 gauge, not a half-circle arc, so
 *     the scale reads instantly and never overlaps headline text.
 *
 * Dynamic outlook labeling:
 *   Because the report can be for today or a future forecast day, the hero's
 *   "OUTLOOK" eyebrow takes a `dateLabel` prop (e.g. "TODAY", "SAT · MAR 22")
 *   so we never lie about timeliness when the user entered via a forecast tap.
 */

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
  paperRadius,
  paperShadows,
  paperBorders,
  paperTierForScore,
  paperTier,
  type PaperTier,
} from '../../lib/theme';
import {
  CornerMark,
  CornerMarkSet,
  SectionEyebrow,
  TopographicLines,
} from '../paper';
import {
  resolveTimingPeriods,
  resolveTimingFromPreset,
  PERIOD_DEFS,
  type PeriodSlot,
} from './TimingTiles';
import type { HowsFishingReportV1 } from '../../lib/howFishing';
import type { SolunarData } from '../../lib/env/types';

// ─── Display helpers ─────────────────────────────────────────────────────────

function displayScore10(score: number): string {
  const v = Math.round(score) / 10;
  return Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
}

function tierForScore(score: number): PaperTier {
  return paperTierForScore(score / 10);
}

function tierAccentColor(tier: PaperTier): string {
  return tier === 'green' ? paper.forest : tier === 'yellow' ? paper.goldDk : paper.red;
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

// ─── Air-temp strip ──────────────────────────────────────────────────────────

function AirRangeStrip({ report }: { report: HowsFishingReportV1 }) {
  const snap = report.condition_context?.environment_snapshot;
  if (!snap || typeof snap !== 'object') return null;
  const lo = snap.daily_low_air_temp_f as number | null | undefined;
  const hi = snap.daily_high_air_temp_f as number | null | undefined;
  if (lo == null || hi == null || !Number.isFinite(lo) || !Number.isFinite(hi)) return null;
  return (
    <View style={styles.airRow}>
      <Ionicons name="thermometer-outline" size={12} color={paper.ink} />
      <Text style={styles.airLabel}>AIR</Text>
      <Text style={styles.airRange}>{`${Math.round(lo)}° – ${Math.round(hi)}°F`}</Text>
    </View>
  );
}

// ─── Ornamental divider ─────────────────────────────────────────────────────

/**
 * Editorial divider used between major report sections — two hairline rules
 * flanking a centered fish/compass glyph, evoking field-guide typography.
 * Keeps the page feeling like a premium outdoor magazine rather than a
 * generic data card stack.
 */
function OrnamentalDivider({
  icon = 'fish-outline',
  color = paper.walnut,
}: {
  icon?: keyof typeof import('@expo/vector-icons/build/Ionicons').default.glyphMap;
  color?: string;
}) {
  return (
    <View style={styles.ornamentRow}>
      <View style={[styles.ornamentRule, { borderColor: color }]} />
      <View style={[styles.ornamentGlyph, { borderColor: color }]}>
        <Ionicons name={icon} size={12} color={color} />
      </View>
      <View style={[styles.ornamentRule, { borderColor: color }]} />
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
  const accent = tierAccentColor(tier);
  const topDrivers = report.drivers.slice(0, 3);
  const topSuppressors = report.suppressors.slice(0, 2);
  const timingPeriods = getTimingPeriods(report);
  const showTiming = !!(report.daypart_note || timingPeriods);

  const isFuture = dateLabel.toUpperCase() !== 'TODAY' && !dateLabel.toUpperCase().startsWith('TODAY');
  const outlookEyebrow = isFuture ? 'FORECAST OUTLOOK' : "TODAY'S OUTLOOK";
  // Phrase is chosen off the engine's 4-band value so the word always
  // matches the number. "Prime day" is reserved for Excellent (score
  // ≥ 80 / 8.0). Good days get softer "solid" language, Fair gets its
  // own honest framing, Poor keeps the existing cautionary tone.
  const bandKey = (report.band ?? '').toLowerCase();
  const outlookLine =
    bandKey === 'excellent'
      ? isFuture
        ? 'A PRIME DAY SHAPING UP.'
        : 'A PRIME DAY IS SHAPING UP.'
      : bandKey === 'good'
      ? isFuture
        ? 'A SOLID DAY AHEAD.'
        : 'A SOLID DAY TODAY.'
      : bandKey === 'fair'
      ? isFuture
        ? 'A FAIR WINDOW EXPECTED.'
        : 'A FAIR WINDOW TODAY.'
      : isFuture
      ? 'A TOUGHER DAY SHAPING UP.'
      : 'A TOUGHER DAY AHEAD.';

  return (
    <View style={styles.wrap}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <View style={styles.heroCard}>
        {/* Only bottom corner marks — the top ones would collide with the
            masthead band, and the page-corner brackets at the bottom give
            the hero a premium editorial "page" frame without fighting
            the masthead above. */}
        <CornerMark position="bl" color={paper.red} inset={10} />
        <CornerMark position="br" color={paper.red} inset={10} />

        {/* Newspaper-style masthead — date lives here so the card reads
            like the headline page of a broadsheet rather than another
            section card. Two hairline rules top/bottom give it the
            ruled-masthead feel. */}
        <View style={styles.heroMasthead}>
          <View style={[styles.heroMastheadRule, styles.heroMastheadTop]} />
          <SectionEyebrow color={paper.red} size={9.5} tracking={3.2}>
            {dateLabel.toUpperCase()}
          </SectionEyebrow>
          <View style={[styles.heroMastheadRule, styles.heroMastheadBottom]} />
        </View>

        <Text style={styles.heroHeadline}>
          HOW'S FISHING{'\n'}
          <Text style={{ color: accent }}>{isFuture ? 'ON THIS DAY?' : 'RIGHT NOW?'}</Text>
        </Text>

        <LinearScoreGauge
          score={report.score / 10}
          tier={tier}
          accent={accent}
          band={report.band}
        />

        <View style={styles.outlookRule}>
          <View style={styles.outlookRuleLine} />
          <Text style={styles.outlookRuleGlyph}>◆</Text>
          <View style={styles.outlookRuleLine} />
        </View>

        <SectionEyebrow color={paper.red} size={9} tracking={3}>
          {outlookEyebrow}
        </SectionEyebrow>
        <Text style={[styles.heroSubline, { color: accent }]}>{outlookLine}</Text>
        <Text style={styles.heroSummary}>{report.summary_line}</Text>
        <AirRangeStrip report={report} />
      </View>

      {/* ── WHAT'S HELPING ──────────────────────────────────────────────── */}
      <View style={[styles.factorCard, styles.factorCardForest]}>
        <View style={[styles.factorHeader, { backgroundColor: paper.forest }]}>
          <Ionicons name="trending-up" size={15} color={paper.paper} />
          <Text style={styles.factorHeaderLabel}>WHAT'S HELPING</Text>
        </View>
        <View style={styles.factorBody}>
          {topDrivers.length > 0 ? (
            topDrivers.map((d, i) => (
              <FactorRow
                key={`d-${i}`}
                sign="+"
                signBg={paper.forest}
                signFg={paper.paper}
                label={formatFactorLabel(d.label)}
                isLast={i === topDrivers.length - 1}
              />
            ))
          ) : (
            <Text style={styles.mutedText}>
              No strong positive factors today.
            </Text>
          )}
        </View>
      </View>

      {/* ── WATCH OUT FOR ───────────────────────────────────────────────── */}
      {topSuppressors.length > 0 && (
        <View style={styles.factorCard}>
          <View style={[styles.factorHeader, { backgroundColor: paper.red }]}>
            <Ionicons name="trending-down" size={15} color={paper.paper} />
            <Text style={styles.factorHeaderLabel}>WATCH OUT FOR</Text>
          </View>
          <View style={styles.factorBody}>
            {topSuppressors.map((s, i) => (
              <FactorRow
                key={`s-${i}`}
                sign="−"
                signBg={paper.red}
                signFg={paper.paper}
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
          <View style={styles.timingHeader}>
            <Text style={styles.timingEyebrow}>WHEN TO GO</Text>
            <Text style={styles.timingMeta}>
              Local time{report.location.timezone ? ` · ${shortTz(report.location.timezone)}` : ''}
            </Text>
          </View>
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

      {/* ── SOLUNAR WINDOWS (preserved) ─────────────────────────────────── */}
      {solunarData &&
        (solunarData.major_periods.length > 0 || solunarData.minor_periods.length > 0) && (
          <View style={styles.solunarCard}>
            <View style={styles.solunarHeader}>
              <Ionicons name="moon" size={13} color={paper.walnut} />
              <Text style={styles.solunarTitle}>SOLUNAR WINDOWS</Text>
              <Text style={styles.solunarBonus}>BONUS</Text>
            </View>
            <View style={styles.solunarRow}>
              {solunarData.major_periods.length > 0 && (
                <View style={styles.solunarCol}>
                  <Text style={styles.solunarSubhead}>STRONG</Text>
                  {solunarData.major_periods.map((p, i) => (
                    <View key={`maj-${i}`} style={styles.solunarPeriod}>
                      <View style={styles.solunarDotStrong} />
                      <Text style={styles.solunarTime}>
                        {formatSolunarRange(p.start, p.end)}
                      </Text>
                      {p.type != null && (
                        <Text style={styles.solunarType}>
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
                    styles.solunarCol,
                    solunarData.major_periods.length > 0 && styles.solunarColRight,
                  ]}
                >
                  <Text style={styles.solunarSubhead}>MINOR</Text>
                  {solunarData.minor_periods.map((p, i) => (
                    <View key={`min-${i}`} style={styles.solunarPeriod}>
                      <View style={styles.solunarDotMinor} />
                      <Text style={styles.solunarTimeMinor}>
                        {formatSolunarRange(p.start, p.end)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

      {/* Editorial divider separates the analytical sections above from the
          guide's narrative advice below. Small touch, big difference in
          feel. */}
      <OrnamentalDivider icon="compass-outline" />

      {/* ── GUIDE'S NOTE ────────────────────────────────────────────────── */}
      <View style={styles.guideCard}>
        <TopographicLines
          style={styles.guideLines}
          color={paper.walnut}
          count={5}
        />
        <CornerMarkSet color={paper.walnut} />
        <View style={styles.guideRow}>
          <View style={styles.guideBadge}>
            <Ionicons name="leaf" size={22} color={paper.walnut} />
          </View>
          <View style={styles.guideBody}>
            <SectionEyebrow color={paper.red} size={10} tracking={3.5}>
              GUIDE'S NOTE
            </SectionEyebrow>
            <Text style={styles.guideQuoteMark}>&#8220;</Text>
            <Text style={styles.guideText}>{report.actionable_tip}</Text>
          </View>
        </View>
      </View>

      {/* Field-guide footer — small editorial colophon that ties the page
          together and reinforces the premium outdoor aesthetic. The year
          is intentionally derived at render time so the report always
          reflects the user's current session. */}
      <View style={styles.colophonRow}>
        <View style={styles.colophonRule} />
        <Text style={styles.colophonText}>
          TIGHTLINES AI · FIELD REPORT · {new Date().getFullYear()}
        </Text>
        <View style={styles.colophonRule} />
      </View>
    </View>
  );
}

/** Condense "America/New_York" → "EST/EDT"-ish short string. */
function shortTz(tz: string): string {
  const parts = tz.split('/');
  return (parts[parts.length - 1] ?? tz).replace(/_/g, ' ');
}

// ─── LinearScoreGauge ────────────────────────────────────────────────────────

/**
 * Linear 0-10 score gauge — a horizontal track that tapers red → yellow →
 * green, with a big, unmistakable pin marker at the exact score position.
 * No arcs and nothing overlapping the score: the score number lives in a
 * dedicated row above the track, the track owns its own row, and the
 * scale labels (0 / 5 / 10) sit below. A drop-shadow and oversized ink
 * stroke make the score "pop" so the eye locks onto it instantly.
 *
 * Design notes:
 *  - The colored track always shows the full red→gold→forest spectrum so
 *    the scale is legible at a glance regardless of score.
 *  - The marker is a filled circle in the accent color with a thick ink
 *    border plus a vertical stem dropping from the score number down to
 *    the track — that way the user can't miss where the score lands.
 *  - The band label underneath uses the engine's own band
 *    (`Poor | Fair | Good | Excellent`), not an invented "GO/SKIP"
 *    verdict, so the copy matches the engine's truth.
 */
function LinearScoreGauge({
  score,
  tier,
  accent,
  band,
}: {
  score: number; // 0-10
  tier: PaperTier;
  accent: string;
  band?: string; // 'Poor' | 'Fair' | 'Good' | 'Excellent' from the engine
}) {
  const clamped = Math.max(0, Math.min(10, Number.isFinite(score) ? score : 0));
  const pct = clamped / 10;
  const bandLabel = (band ?? '').toUpperCase() || fallbackBandFromTier(tier);

  return (
    <View style={gaugeStyles.wrap}>
      {/* Score number — color-coded by tier, with a soft accent halo behind it
          so the eye locks on immediately. */}
      <View style={gaugeStyles.scoreRow}>
        <View style={[gaugeStyles.scoreHalo, { backgroundColor: accent }]} />
        <Text style={[gaugeStyles.scoreNum, { color: accent }]} allowFontScaling={false}>
          {clamped.toFixed(1)}
        </Text>
        <Text style={[gaugeStyles.scoreMax, { color: accent }]}>/10</Text>
      </View>

      {/* Track row — 92% width. Contains the colored spectrum and the pin
          overlay, so the pin's percentage-left is measured against the track
          itself (not the outer wrap). This makes the layout robust without
          relying on magic offsets. */}
      <View style={gaugeStyles.trackRow}>
        {/* Gauge track — red → gold → forest, tapered via three stops. */}
        <View style={gaugeStyles.track}>
          <View style={[gaugeStyles.stop, { flex: 1, backgroundColor: paper.red }]} />
          <View style={[gaugeStyles.stop, { flex: 1, backgroundColor: paper.gold }]} />
          <View style={[gaugeStyles.stop, { flex: 1, backgroundColor: paper.forest }]} />
        </View>

        {/* Vertical stem dropping from just above the track down onto the pin,
            tying the score number's position to the scale. */}
        <View
          pointerEvents="none"
          style={[
            gaugeStyles.markerStem,
            { left: `${pct * 100}%`, backgroundColor: accent },
          ]}
        />

        {/* Prominent pin marker — filled accent circle with thick ink stroke.
            Sits centered on the track so it reads as a real "pointer" rather
            than a subtle tick. */}
        <View
          pointerEvents="none"
          style={[gaugeStyles.markerPinWrap, { left: `${pct * 100}%` }]}
        >
          <View style={[gaugeStyles.markerPin, { backgroundColor: accent }]} />
        </View>
      </View>

      {/* Scale rule labels. */}
      <View style={gaugeStyles.scaleRow}>
        <Text style={gaugeStyles.scaleTick}>0</Text>
        <Text style={gaugeStyles.scaleTick}>5</Text>
        <Text style={gaugeStyles.scaleTick}>10</Text>
      </View>

      {/* Engine band pill — truthful verdict straight from the report. */}
      <View style={[gaugeStyles.bandPill, { backgroundColor: accent }]}>
        <Text style={gaugeStyles.bandPillText}>{bandLabel}</Text>
      </View>
    </View>
  );
}

/** If the report somehow lacks a band string, derive a sensible label
 *  from the tier so the UI never shows empty copy. */
function fallbackBandFromTier(tier: PaperTier): string {
  return tier === 'green' ? 'GOOD' : tier === 'yellow' ? 'FAIR' : 'POOR';
}

const gaugeStyles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: paperSpacing.sm + 2,
    marginBottom: paperSpacing.xs + 2,
    // Width is constrained so the track/scale measure predictably regardless
    // of card padding. The gauge feels anchored rather than edge-to-edge.
    width: '100%',
  },
  scoreRow: {
    // The row intentionally gets extra vertical padding so its own bounds
    // fully contain both the glyph (including tall ascenders) and the
    // halo behind it. Without this, lineHeight ≈ fontSize clips the tops
    // of the digits on Android/iOS depending on the font's metrics.
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    position: 'relative',
  },
  // Soft oval glow behind the score number — inset slightly so it reads
  // as a "highlight behind the number" rather than a hard pill, but still
  // fully wraps the glyphs from top to bottom.
  scoreHalo: {
    position: 'absolute',
    top: 10,
    bottom: 4,
    left: 4,
    right: 4,
    opacity: 0.12,
    borderRadius: 60,
  },
  scoreNum: {
    fontFamily: paperFonts.monoBold,
    fontSize: 72,
    // lineHeight > fontSize gives the glyphs breathing room so ascenders
    // are never clipped at the top of the text box.
    lineHeight: 86,
    letterSpacing: -3.5,
    fontWeight: '700',
    includeFontPadding: false,
    // Offset ink drop-shadow gives the number an embossed, plate-printed
    // feel without requiring any native modules. Works on iOS and Android.
    textShadowColor: 'rgba(26, 26, 22, 0.22)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },
  scoreMax: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    marginBottom: 15,
    opacity: 0.75,
  },
  // Host row for the track + pin. Percentages on children now measure
  // against this row (92% of the gauge), so the marker percentage-left
  // matches the track bounds exactly.
  trackRow: {
    width: '92%',
    height: 24,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    width: '100%',
    height: 14,
    borderRadius: 7,
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: paper.ink,
    overflow: 'hidden',
    backgroundColor: paper.paperLight,
  },
  stop: {
    height: '100%',
  },
  // Thin vertical stem hovering just above the track, connecting the
  // score readout down to the pin. Short and subtle so it reads as a
  // pointer, not a decoration.
  markerStem: {
    position: 'absolute',
    top: -10,
    width: 2,
    height: 12,
    marginLeft: -1,
    opacity: 0.55,
  },
  // Wrapper centers the pin on the track vertically via the host row's
  // justifyContent. The negative marginLeft aligns the pin's horizontal
  // center with the percentage position.
  markerPinWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    marginLeft: -12,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: paper.ink,
  },
  scaleRow: {
    width: '92%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  scaleTick: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.6,
  },
  bandPill: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: paperRadius.chip,
    // Subtle ink ring echoes the editorial borders elsewhere on the page.
    borderWidth: 1.5,
    borderColor: paper.ink,
  },
  bandPillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2.5,
    color: paper.paper,
    fontWeight: '700',
  },
});

// ─── FactorRow ───────────────────────────────────────────────────────────────

function FactorRow({
  sign,
  signBg,
  signFg,
  label,
  isLast,
}: {
  sign: string;
  signBg: string;
  signFg: string;
  label: string;
  isLast: boolean;
}) {
  return (
    <View style={[styles.factorRow, !isLast && styles.factorRowDivider]}>
      <View style={[styles.factorSign, { backgroundColor: signBg }]}>
        <Text style={[styles.factorSignText, { color: signFg }]}>{sign}</Text>
      </View>
      <Text style={styles.factorLabel}>{label}</Text>
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
  // Highlighted "best" periods always use the gold/amber treatment — not
  // the overall day's tier color. This makes the recommendation pop even
  // on a green day, and is consistent with how premium field guides
  // typically call out a golden hour ("go now" color ≠ "good day" color).
  const bestBg = paperTier.yellow.bg;
  const bestFg = paperTier.yellow.fg;

  return (
    <View
      style={[
        styles.timeTile,
        isBest && {
          backgroundColor: bestBg,
          transform: [{ translateY: -1 }],
        },
      ]}
    >
      {isBest && (
        <View style={styles.bestBadge}>
          <Text style={styles.bestBadgeText}>★ BEST</Text>
        </View>
      )}
      <View style={styles.timeTileTop}>
        <Ionicons
          name={icon}
          size={20}
          color={isBest ? bestFg : paper.ink}
        />
      </View>
      <View
        style={[
          styles.timeTileBody,
          isBest && { borderTopColor: `${bestFg}55` },
        ]}
      >
        <Text
          style={[
            styles.timeTileLabel,
            isBest && { color: bestFg },
          ]}
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
  wrap: { gap: paperSpacing.md + 2 },

  // ── HERO — true headline card ───────────────────────────────────────
  //
  // We want the hero to clearly out-rank the factor/timing/solunar
  // cards below it. Versus the old hero, this one:
  //   • uses a lighter paper fill with a subtle warm undertone so the
  //     forest/red factor headers below read as supporting material
  //   • thickens the ink border to 3px (vs 2px on the rest) and pairs
  //     it with a deeper "lift" shadow so it sits a step above the page
  //   • introduces a ruled "masthead" band at the top where the date
  //     lives, giving it newspaper-grade hierarchy
  //   • scales the headline and gauge up, and adds more breathing room
  heroCard: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    borderWidth: 3,
    borderColor: paper.ink,
    ...paperShadows.lift,
    paddingHorizontal: paperSpacing.lg - 2,
    paddingTop: 0,
    paddingBottom: paperSpacing.lg - 4,
    marginBottom: paperSpacing.sm,
    overflow: 'hidden',
    alignItems: 'center',
  },
  heroMasthead: {
    alignSelf: 'stretch',
    backgroundColor: paper.paperDark,
    borderBottomWidth: 2,
    borderBottomColor: paper.ink,
    paddingVertical: 8,
    marginHorizontal: -(paperSpacing.lg - 2),
    marginBottom: paperSpacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroMastheadRule: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.ink,
    opacity: 0.45,
  },
  heroMastheadTop: { top: 3 },
  heroMastheadBottom: { bottom: 3 },
  heroEyebrow: {
    marginBottom: paperSpacing.sm - 2,
    alignItems: 'center',
  },
  heroHeadline: {
    fontFamily: paperFonts.display,
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 32,
    letterSpacing: -1.1,
    textAlign: 'center',
    color: paper.ink,
    textTransform: 'uppercase',
    marginBottom: paperSpacing.md,
  },
  outlookRule: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: paperSpacing.md - 2,
    marginBottom: paperSpacing.sm + 2,
  },
  outlookRuleLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.ink,
    opacity: 0.4,
  },
  outlookRuleGlyph: {
    fontFamily: paperFonts.display,
    fontSize: 12,
    color: paper.ink,
    opacity: 0.55,
    letterSpacing: 3,
  },
  heroSubline: {
    fontFamily: paperFonts.display,
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: -0.3,
    marginTop: 8,
    marginBottom: 6,
    textAlign: 'center',
  },
  heroSummary: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 21,
    color: paper.ink,
    opacity: 0.88,
    textAlign: 'center',
    paddingHorizontal: paperSpacing.sm,
  },
  airRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: paperSpacing.sm + 2,
  },
  airLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2,
    color: paper.ink,
    opacity: 0.55,
    fontWeight: '700',
  },
  airRange: {
    fontFamily: paperFonts.metaMono,
    fontSize: 11,
    color: paper.ink,
  },

  // ── Factor cards ────────────────────────────────────────────────────
  factorCard: {
    backgroundColor: paper.paper,
    borderRadius: paperRadius.card,
    ...paperBorders.card,
    ...paperShadows.hard,
    overflow: 'hidden',
  },
  factorCardForest: {
    // Forest stripe header; no extra style needed at the card level but kept
    // as a semantic hook in case the "helping" card ever needs a tint.
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md + 2,
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: paper.ink,
  },
  factorHeaderLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 3,
    color: paper.paper,
    fontWeight: '700',
  },
  factorBody: {
    paddingHorizontal: paperSpacing.md + 4,
    paddingTop: 4,
    paddingBottom: paperSpacing.sm + 2,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.md,
    paddingVertical: paperSpacing.sm + 2,
  },
  factorRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: paper.ink,
    // RN's dashed borders are unreliable; we fake "dashed" using opacity on
    // the hairline so the rule reads as subtle marginalia rather than a
    // hard divider.
    borderStyle: 'solid',
    // Opacity-approximated dashed feel.
  },
  factorSign: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  factorSignText: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '700',
    includeFontPadding: false,
  },
  factorLabel: {
    flex: 1,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: paper.ink,
    fontWeight: '600',
  },
  mutedText: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 13,
    color: paper.ink,
    opacity: 0.55,
    paddingVertical: paperSpacing.sm,
  },

  // ── Timing section ──────────────────────────────────────────────────
  timingSection: {
    marginTop: paperSpacing.xs,
  },
  timingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingBottom: paperSpacing.sm,
    borderBottomWidth: 1.5,
    borderBottomColor: paper.ink,
    marginBottom: paperSpacing.sm + 2,
  },
  timingEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 3,
    color: paper.ink,
    fontWeight: '700',
  },
  timingMeta: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 11,
    color: paper.ink,
    opacity: 0.55,
  },
  timingRow: {
    flexDirection: 'row',
    gap: 8,
  },
  daypartNote: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 13,
    lineHeight: 19,
    color: paper.ink,
    opacity: 0.78,
    marginTop: paperSpacing.sm + 2,
  },

  // ── Time tiles ──────────────────────────────────────────────────────
  timeTile: {
    flex: 1,
    backgroundColor: paper.paper,
    borderRadius: paperRadius.card,
    ...paperBorders.card,
    ...paperShadows.hard,
    overflow: 'hidden',
    minHeight: 104,
  },
  timeTileTop: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  timeTileBody: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.ink,
    alignItems: 'center',
  },
  timeTileLabel: {
    fontFamily: paperFonts.display,
    fontSize: 14,
    fontWeight: '700',
    color: paper.ink,
    letterSpacing: -0.3,
  },
  timeTileRange: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.65,
    marginTop: 2,
  },
  bestBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: paper.ink,
    paddingHorizontal: 6,
    paddingVertical: 3,
    zIndex: 3,
  },
  bestBadgeText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8,
    letterSpacing: 1.5,
    color: paper.gold,
    fontWeight: '700',
  },

  // ── Solunar (trimmed ~20% — de-emphasised secondary card) ──────────
  solunarCard: {
    backgroundColor: paper.paper,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.inkHair,
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm + 2,
  },
  solunarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: paperSpacing.xs + 2,
  },
  solunarTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.5,
    color: paper.walnut,
    fontWeight: '700',
    flex: 1,
  },
  solunarBonus: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8,
    letterSpacing: 2,
    color: paper.ink,
    opacity: 0.55,
    borderWidth: 1,
    borderColor: paper.inkHair,
    borderRadius: paperRadius.chip,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  solunarRow: {
    flexDirection: 'row',
    gap: paperSpacing.sm + 2,
  },
  solunarCol: { flex: 1 },
  solunarColRight: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: paper.inkHair,
    paddingLeft: paperSpacing.sm + 2,
  },
  solunarSubhead: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    letterSpacing: 2,
    color: paper.walnut,
    opacity: 0.75,
    marginBottom: 4,
    fontWeight: '700',
  },
  solunarPeriod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  solunarDotStrong: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: paper.walnut,
  },
  solunarDotMinor: {
    width: 5,
    height: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: paper.walnut,
    opacity: 0.6,
  },
  solunarTime: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10.5,
    color: paper.ink,
    flex: 1,
  },
  solunarTimeMinor: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10.5,
    color: paper.ink,
    opacity: 0.7,
    flex: 1,
  },
  solunarType: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.walnut,
    opacity: 0.7,
  },

  // ── Guide's note ────────────────────────────────────────────────────
  guideCard: {
    position: 'relative',
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    ...paperBorders.card,
    ...paperShadows.hard,
    paddingHorizontal: paperSpacing.lg,
    paddingVertical: paperSpacing.lg,
    overflow: 'hidden',
  },
  guideLines: {
    left: undefined,
    right: -30,
    top: -20,
    width: 260,
    height: 260,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.md + 4,
  },
  guideBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: paper.walnut,
    backgroundColor: paper.paper,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  guideBody: { flex: 1 },
  // Oversized opening quote mark so the guide's note reads as a pull-quote
  // from a field journal. Sits above the body text with a negative margin
  // to tuck it visually close to the first line.
  guideQuoteMark: {
    fontFamily: paperFonts.display,
    fontSize: 44,
    lineHeight: 38,
    color: paper.walnut,
    opacity: 0.55,
    marginTop: 2,
    marginBottom: -6,
    fontWeight: '700',
  },
  guideText: {
    fontFamily: paperFonts.displayMedium,
    fontSize: 15,
    lineHeight: 22,
    color: paper.ink,
    marginTop: 0,
  },

  // ── Ornamental divider ───────────────────────────────────────────────
  // Two hairline rules flanking a centered glyph — a typographic flourish
  // borrowed from letterpress field guides. Keeps the page from feeling
  // like a stack of unrelated cards.
  ornamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: paperSpacing.md,
    gap: paperSpacing.sm,
  },
  ornamentRule: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    opacity: 0.55,
  },
  ornamentGlyph: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    opacity: 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Colophon footer ──────────────────────────────────────────────────
  // Small typographic sign-off at the very bottom of the report. Makes
  // the page feel finished and curated rather than just running off.
  colophonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    marginTop: paperSpacing.lg,
    marginBottom: paperSpacing.sm,
    paddingHorizontal: paperSpacing.sm,
  },
  colophonRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.ink,
    opacity: 0.3,
  },
  colophonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2.5,
    color: paper.ink,
    opacity: 0.5,
    fontWeight: '700',
  },
});
