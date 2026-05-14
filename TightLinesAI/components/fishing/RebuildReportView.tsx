import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PurchasesPackage } from "react-native-purchases";
import {
  paper,
  paperBandForScore,
  paperFonts,
  paperSpacing,
  type PaperTier,
  paperTierForScore,
  scoreAccentColor,
  scoreTextOnColor,
} from "../../lib/theme";
import { SectionEyebrow, TopographicLines } from "../paper";
import {
  PERIOD_DEFS,
  type PeriodSlot,
  resolveTimingFromPreset,
  resolveTimingPeriods,
} from "./TimingTiles";
import type { HowsFishingReportV1 } from "../../lib/howFishing";
import type { ActionableTipTag } from "../../lib/howFishingRebuildContracts";
import type { SolunarData } from "../../lib/env/types";
import { useRevenueCatStore } from "../../store/revenueCatStore";

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
    .join(" ");
}

/** Convert an engine variable key (e.g. `barometric_trend`) to a tracked
 *  uppercase eyebrow (`BAROMETRIC TREND`) for the factor row. */
function formatVariableEyebrow(v: string): string {
  if (!v) return "CONDITION";
  if (v === "temperature_condition") return "TEMPERATURE";
  if (v === "pressure_regime") return "PRESSURE";
  if (v === "wind_condition") return "WIND";
  if (v === "light_cloud_condition") return "CLOUD COVER";
  if (v === "precipitation_disruption") return "RAIN";
  if (v === "runoff_flow_disruption") return "RAIN / RUNOFF";
  if (v === "tide_current_movement") return "TIDE / CURRENT";
  return v.replace(/_/g, " ").toUpperCase();
}

/** Parse a solunar time string (ISO local or "HH:mm") to "9:15am" format. */
function parseSolunarTime(t: string): string {
  const isoMatch = t.match(/T(\d{2}):(\d{2})/);
  if (isoMatch) {
    const h = parseInt(isoMatch[1]!, 10);
    const m = parseInt(isoMatch[2]!, 10);
    const period = h < 12 ? "am" : "pm";
    const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${dh}:${String(m).padStart(2, "0")}${period}`;
  }
  const hmMatch = t.match(/^(\d{1,2}):(\d{2})/);
  if (hmMatch) {
    const h = parseInt(hmMatch[1]!, 10);
    const m = parseInt(hmMatch[2]!, 10);
    const period = h < 12 ? "am" : "pm";
    const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${dh}:${String(m).padStart(2, "0")}${period}`;
  }
  return t;
}

function formatSolunarRange(start: string, end: string): string {
  return `${parseSolunarTime(start)} – ${parseSolunarTime(end)}`;
}

/** Condense "America/New_York" → "New York"-ish short string. */
function shortTz(tz: string): string {
  const parts = tz.split("/");
  return (parts[parts.length - 1] ?? tz).replace(/_/g, " ");
}

/** Pick the editorial headline shown in the hero. Prefers the user's
 *  location label (e.g. "Tampa Bay") so the cover feels personalized; falls
 *  back to a clean context-driven label if the location isn't usable as a
 *  headline (long, raw coords, etc.). */
function buildHeadline(
  report: HowsFishingReportV1,
  isFuture: boolean,
): { primary: string; secondary?: string } {
  const raw = (report.location.location_label ?? "").trim();
  // Reject coordinate-shaped labels and overly long labels — they read
  // as data, not headlines.
  const looksLikeCoords = /^-?\d+\.\d/.test(raw);
  const usable = !!raw && !looksLikeCoords && raw.length <= 28;
  if (usable) {
    return {
      primary: raw.toUpperCase(),
      secondary: isFuture ? "FORECAST READ" : "TODAY'S READ",
    };
  }
  // Fallback — context label minus the parenthetical.
  const context = (report.display_context_label ?? "Today's Bite").replace(
    /\s*\/.*$/,
    "",
  );
  return {
    primary: context.toUpperCase(),
    secondary: isFuture ? "FORECAST READ" : "TODAY'S READ",
  };
}

function dateTextForEyebrow(dateLabel: string, isFuture: boolean): string {
  const upper = dateLabel.toUpperCase().trim();
  if (!upper) return isFuture ? "FORECAST" : "TODAY";
  if (!isFuture && upper.startsWith("TODAY · ")) {
    return upper.replace(/^TODAY ·\s*/, "");
  }
  return upper;
}

function parseLocalReportDate(localDate: string | null | undefined): Date {
  if (localDate && /^\d{4}-\d{2}-\d{2}$/.test(localDate)) {
    return new Date(`${localDate}T12:00:00`);
  }
  return new Date();
}

/** ActionableTipTag -> human label for the Field Strategy chip. */
const TIP_TAG_LABELS: Record<ActionableTipTag, string> = {
  strategy_water_movement: "WATER MOVEMENT",
  strategy_control: "CONTROL",
  strategy_visibility: "VISIBILITY",
  strategy_patient_plan: "PATIENT PLAN",
  strategy_push_windows: "PUSH WINDOWS",
  strategy_field_plan: "FIELD PLAN",
  strategy_data_limited: "DATA LIMITED",
  // Legacy aliases accepted for old cached bundles.
  presentation_current_sweep: "WATER MOVEMENT",
  presentation_contact_control: "CONTROL",
  presentation_visibility_profile: "VISIBILITY",
  presentation_slow_subtle: "PATIENT PLAN",
  presentation_active_cadence: "PUSH WINDOWS",
  presentation_general: "FIELD PLAN",
};

const ANGLER_UNLOCKS: Array<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  copy: string;
}> = [
  {
    icon: "analytics-outline",
    title: "Bite reports",
    copy:
      "Full condition reports for today plus the next 6 days, including score, drivers, best windows, and guide-level context.",
  },
  {
    icon: "fish-outline",
    title: "Tackle Box",
    copy:
      "Condition-matched lure and presentation picks tuned to your water type, species, season, and daily conditions.",
  },
  {
    icon: "scan-outline",
    title: "Water Read",
    copy:
      "Advanced intelligence that reads geometrical structure to identify high percentage fishing zones.",
  },
];

const LIMITED_FEATURE_PILLS: Array<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
}> = [
  { icon: "analytics-outline", label: "BITE FACTORS", color: paper.bandPrime },
  { icon: "time-outline", label: "BEST WINDOWS", color: paper.bandFair },
  {
    icon: "sparkles-outline",
    label: "FIELD STRATEGY",
    color: paper.dashboardBlue,
  },
  { icon: "calendar-outline", label: "7-DAY REPORTS", color: paper.bandPoor },
];

function isAnnualPackage(pkg: PurchasesPackage): boolean {
  const id = `${pkg.identifier} ${pkg.product.identifier}`.toLowerCase();
  return id.includes("annual") || id.includes("year");
}

function isMonthlyPackage(pkg: PurchasesPackage): boolean {
  const id = `${pkg.identifier} ${pkg.product.identifier}`.toLowerCase();
  return id.includes("month");
}

function sortedAnglerPackages(
  packages: PurchasesPackage[],
): PurchasesPackage[] {
  const annual = packages.find(isAnnualPackage);
  const monthly = packages.find(isMonthlyPackage);
  return [
    annual,
    monthly,
    ...packages.filter((pkg) => pkg !== annual && pkg !== monthly),
  ]
    .filter(Boolean) as PurchasesPackage[];
}

function monthlyEquivalentLabel(pkg: PurchasesPackage): string | null {
  const price = typeof pkg.product.price === "number"
    ? pkg.product.price
    : null;
  if (price == null || !Number.isFinite(price)) return null;
  return `$${(price / 12).toFixed(2)} monthly`;
}

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
  const lo = snap && typeof snap === "object"
    ? (snap.daily_low_air_temp_f as number | null | undefined)
    : null;
  const hi = snap && typeof snap === "object"
    ? (snap.daily_high_air_temp_f as number | null | undefined)
    : null;
  const hasTemp = lo != null && hi != null && Number.isFinite(lo) &&
    Number.isFinite(hi);
  const tz = report.location.timezone
    ? shortTz(report.location.timezone)
    : null;
  const ctxLabel = (report.display_context_label ?? "").toUpperCase();

  // If there's nothing to render, skip the strip — keeps the hero from
  // landing on an empty horizontal line on legacy reports.
  if (!hasTemp && !tz && !ctxLabel) return null;

  return (
    <View style={styles.metaStripWrap}>
      <View style={styles.metaRule} />
      <View style={styles.metaRow}>
        {hasTemp
          ? (
            <View style={styles.metaItem}>
              <Ionicons
                name="thermometer-outline"
                size={11}
                color={paper.dashboardMuted}
              />
              <Text style={styles.metaItemLabel}>AIR</Text>
              <Text style={styles.metaItemValue}>
                {`${Math.round(hi!)}° / ${Math.round(lo!)}°F`}
              </Text>
            </View>
          )
          : null}
        {hasTemp && (tz || ctxLabel) ? <View style={styles.metaSep} /> : null}
        {ctxLabel
          ? (
            <View style={styles.metaItem}>
              <Ionicons
                name="map-outline"
                size={11}
                color={paper.dashboardMuted}
              />
              <Text style={styles.metaItemValue} numberOfLines={1}>
                {ctxLabel}
              </Text>
            </View>
          )
          : null}
        {ctxLabel && tz ? <View style={styles.metaSep} /> : null}
        {tz
          ? (
            <View style={styles.metaItem}>
              <Ionicons
                name="time-outline"
                size={11}
                color={paper.dashboardMuted}
              />
              <Text style={styles.metaItemValue} numberOfLines={1}>
                {tz}
              </Text>
            </View>
          )
          : null}
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
      <View style={styles.sectionMastheadRuleRow}>
        <View style={[styles.sectionMastheadCap, { backgroundColor: color }]} />
        <View
          style={[styles.sectionMastheadRule, { backgroundColor: color }]}
        />
        <Text style={[styles.sectionMastheadOrnament, { color }]}>◆</Text>
      </View>
      <View style={styles.sectionMastheadInner}>
        <Text
          style={[styles.sectionMastheadTitle, { color }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {meta
          ? (
            <Text style={styles.sectionMastheadMeta} numberOfLines={1}>
              {meta}
            </Text>
          )
          : null}
      </View>
      <View
        style={[styles.sectionMastheadRule, { backgroundColor: color }, {
          opacity: 0.45,
        }]}
      />
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
  dateLabel = "TODAY",
  isLimited = false,
  onAnglerUnlocked,
}: {
  report: HowsFishingReportV1;
  solunarData?: SolunarData | null;
  /** Uppercase date label shown in the hero outlook eyebrow. */
  dateLabel?: string;
  /** Free-tier preview: show the headline read and hide the deeper guide detail. */
  isLimited?: boolean;
  /** Called after an inline RevenueCat purchase succeeds so the parent can rebuild the full read. */
  onAnglerUnlocked?: () => void;
}) {
  const [showAnglerModal, setShowAnglerModal] = useState(false);
  const tier = tierForScore(report.score);
  const accent = accentForScore100(report.score);
  // Derive the band label locally from the numeric score using the same
  // thresholds the home dashboard uses (paperBandForScore). The engine
  // also returns a `report.band`, but its threshold table doesn't always
  // match the client's — we've seen 4.4/10 come back as engine band
  // "FAIR" while client thresholds put it in "POOR". Using one source of
  // truth (the score → client thresholds) keeps the color, the label,
  // and the verdict phrase aligned within Today's Bite AND consistent
  // with the home page's Live Conditions chip.
  const derivedBand = paperBandForScore(report.score / 10);
  const topDrivers = report.drivers.slice(0, 3);
  const topSuppressors = report.suppressors.slice(0, 2);
  const timingPeriods = getTimingPeriods(report);
  const showTiming = !!(report.daypart_note || timingPeriods);

  const isFuture = dateLabel.toUpperCase() !== "TODAY" &&
    !dateLabel.toUpperCase().startsWith("TODAY");
  const headline = buildHeadline(report, isFuture);
  const reportDateText = dateTextForEyebrow(dateLabel, isFuture);
  const heroMetaText = `${
    headline.secondary ?? (isFuture ? "FORECAST READ" : "TODAY'S READ")
  } · ${reportDateText}`;

  // Phrase keys off the score-derived band so the verdict word always
  // matches the number and the displayed band label.
  const bandKey = derivedBand.toLowerCase();
  const outlookLine = bandKey === "prime" || bandKey === "excellent"
    ? isFuture ? "A prime day shaping up." : "A prime day is shaping up."
    : bandKey === "good"
    ? isFuture ? "A solid day ahead." : "A solid day today."
    : bandKey === "fair"
    ? isFuture ? "A fair window expected." : "A fair window today."
    : bandKey === "poor"
    ? isFuture ? "A tougher day shaping up." : "A tougher day ahead."
    : isFuture
    ? "Tough water ahead — keep it patient."
    : "Tough water today — keep it patient.";

  const tipTagLabel = TIP_TAG_LABELS[report.actionable_tip_tag] ?? null;

  return (
    <View style={styles.wrap}>
      <View style={styles.heroCard}>
        <TopographicLines
          style={styles.heroTopoLines}
          color={paper.dashboardBlue}
          count={4}
        />

        {
          /* Corner crosses — instrument marginalia matching the dashboard's
            Live Conditions card. Just outside the rounded interior so they
            read as field-guide reference marks, not UI ornaments. */
        }
        <View style={[styles.heroCornerCross, styles.heroCornerCrossTL]}>
          <View style={styles.heroCornerCrossH} />
          <View style={styles.heroCornerCrossV} />
        </View>
        <View style={[styles.heroCornerCross, styles.heroCornerCrossTR]}>
          <View style={styles.heroCornerCrossH} />
          <View style={styles.heroCornerCrossV} />
        </View>
        <View style={[styles.heroCornerCross, styles.heroCornerCrossBL]}>
          <View style={styles.heroCornerCrossH} />
          <View style={styles.heroCornerCrossV} />
        </View>
        <View style={[styles.heroCornerCross, styles.heroCornerCrossBR]}>
          <View style={styles.heroCornerCrossH} />
          <View style={styles.heroCornerCrossV} />
        </View>

        <View style={styles.heroEyebrow}>
          <SectionEyebrow color={paper.dashboardBlue} size={9} tracking={2}>
            {heroMetaText}
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
          band={derivedBand}
        />

        {
          /* Verdict line flanked by hairline rules + diamond ornaments —
            reads like a printed editor's verdict between the gauge and
            the summary copy. Color-matched to the band accent. */
        }
        <View style={styles.heroOutlookRow}>
          <View
            style={[styles.heroOutlookFlank, {
              backgroundColor: `${accent}55`,
            }]}
          />
          <Text style={[styles.heroOutlookDiamond, { color: accent }]}>◆</Text>
          <Text
            style={[styles.heroOutlookLine, { color: paper.dashboardInk }]}
            numberOfLines={2}
          >
            {outlookLine}
          </Text>
          <Text style={[styles.heroOutlookDiamond, { color: accent }]}>◆</Text>
          <View
            style={[styles.heroOutlookFlank, {
              backgroundColor: `${accent}55`,
            }]}
          />
        </View>

        <View style={styles.heroSummaryWrap}>
          <View style={[styles.heroSummaryRule, { backgroundColor: accent }]} />
          <Text style={styles.heroSummary}>{report.summary_line}</Text>
        </View>

        <HeroMetaStrip report={report} />
      </View>

      {isLimited
        ? (
          <View style={styles.limitedCard}>
            <TopographicLines
              style={styles.limitedTopoLines}
              color={paper.dashboardBlue}
              count={3}
            />
            <View style={styles.limitedIcon}>
              <Ionicons
                name="lock-closed"
                size={18}
                color={paper.dashboardBlue}
              />
            </View>
            <Text style={styles.limitedTitle}>
              ANGLER UNLOCKS THE FULL READ
            </Text>
            <Text style={styles.limitedCopy}>
              This preview gives you today&apos;s score and day summary. The
              full report opens the why, when, and how to use the condition
              read.
            </Text>
            <View style={styles.limitedFeatureGrid}>
              {LIMITED_FEATURE_PILLS.map((item) => (
                <View
                  key={item.label}
                  style={[
                    styles.limitedFeaturePill,
                    {
                      borderColor: `${item.color}88`,
                      backgroundColor: `${item.color}18`,
                    },
                  ]}
                >
                  <View
                    style={[styles.limitedFeatureIcon, {
                      backgroundColor: item.color,
                    }]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={10}
                      color={item.color === paper.dashboardBlue
                        ? "#FFFFFF"
                        : paper.dashboardInk}
                    />
                  </View>
                  <Text style={styles.limitedFeatureText}>{item.label}</Text>
                </View>
              ))}
            </View>
            <Pressable
              style={(
                { pressed },
              ) => [styles.limitedCta, pressed && styles.limitedCtaPressed]}
              onPress={() => setShowAnglerModal(true)}
            >
              <Text style={styles.limitedCtaText}>UPGRADE TO ANGLER</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </Pressable>
            <AnglerUpgradeModal
              visible={showAnglerModal}
              onClose={() => setShowAnglerModal(false)}
              onUnlocked={() => {
                setShowAnglerModal(false);
                onAnglerUnlocked?.();
              }}
            />
          </View>
        )
        : null}

      {isLimited ? null : (
        <>
          {/* ── ANALYTICAL SECTION (drivers + watchouts) ────────────────────── */}
          <SectionMasthead
            title="BITE FACTORS"
            meta={isFuture ? "forecast" : "today"}
          />

          <View style={styles.factorCard}>
            <View
              style={[styles.factorHeader, {
                backgroundColor: paper.bandPrime,
              }]}
            >
              <Ionicons
                name="trending-up"
                size={14}
                color={paper.dashboardInk}
              />
              <Text style={styles.factorHeaderLabel}>WHAT'S HELPING</Text>
              <Text style={styles.factorHeaderCount}>
                {topDrivers.length}/{report.drivers.length}
              </Text>
            </View>
            <View style={styles.factorBody}>
              {topDrivers.length > 0
                ? (
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
                )
                : (
                  <Text style={styles.mutedText}>
                    No clear edge stands out today.
                  </Text>
                )}
            </View>
          </View>

          {topSuppressors.length > 0 && (
            <View style={styles.factorCard}>
              <View
                style={[styles.factorHeader, { backgroundColor: "#F8E7E2" }]}
              >
                <Ionicons
                  name="trending-down"
                  size={14}
                  color={paper.bandTough}
                />
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
                meta={report.location.timezone
                  ? `local time - ${shortTz(report.location.timezone)}`
                  : "local time"}
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
              {report.timing_insight
                ? (
                  <Text style={styles.daypartNote}>
                    {report.timing_insight}
                  </Text>
                )
                : report.daypart_note
                ? <Text style={styles.daypartNote}>{report.daypart_note}</Text>
                : null}
            </View>
          )}

          {/* ── ALMANAC · MOON & TIDE (was "SOLUNAR WINDOWS · BONUS") ─────── */}
          {solunarData &&
            (solunarData.major_periods.length > 0 ||
              solunarData.minor_periods.length > 0) &&
            (
              <View style={styles.almanacCard}>
                <View style={styles.almanacHeader}>
                  <AlmanacCrescent />
                  <Text style={styles.almanacTitle}>MOON &amp; TIDE</Text>
                  <View style={styles.almanacHeaderTag}>
                    <Text style={styles.almanacHeaderTagText}>SOLUNAR</Text>
                  </View>
                </View>
                <View style={styles.almanacRule} />
                <View style={styles.almanacRow}>
                  {solunarData.major_periods.length > 0 && (
                    <View style={styles.almanacCol}>
                      <View style={styles.almanacSubheadRow}>
                        <View style={styles.almanacSubheadBar} />
                        <Text style={styles.almanacSubhead}>
                          STRONG WINDOWS
                        </Text>
                      </View>
                      {solunarData.major_periods.map((p, i) => (
                        <View key={`maj-${i}`} style={styles.almanacPeriod}>
                          <AlmanacPulseDot kind="strong" />
                          <Text style={styles.almanacTime}>
                            {formatSolunarRange(p.start, p.end)}
                          </Text>
                          {p.type != null && (
                            <Text style={styles.almanacType}>
                              {p.type === "overhead" ? "↑" : "↓"}
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
                        solunarData.major_periods.length > 0 &&
                        styles.almanacColRight,
                      ]}
                    >
                      <View style={styles.almanacSubheadRow}>
                        <View
                          style={[styles.almanacSubheadBar, { opacity: 0.5 }]}
                        />
                        <Text style={[styles.almanacSubhead, { opacity: 0.7 }]}>
                          MINOR WINDOWS
                        </Text>
                      </View>
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

          {/* ── FIELD STRATEGY — editorial centerpiece ──────────────────────── */}
          <View style={styles.guideCard}>
            <TopographicLines
              style={styles.guideLines}
              color={paper.dashboardBlue}
              count={5}
            />
            <View style={styles.guideEyebrowRow}>
              <SectionEyebrow
                color={paper.dashboardBlue}
                size={10}
                tracking={2.4}
              >
                FIELD STRATEGY
              </SectionEyebrow>
              {tipTagLabel
                ? (
                  <View style={styles.tipTagChip}>
                    <Text style={styles.tipTagChipText}>{tipTagLabel}</Text>
                  </View>
                )
                : null}
            </View>
            <View style={styles.guideRow}>
              {
                /* Editor's seal — concentric rings around the sparkles glyph
              give the badge a "pressed mark" feel rather than a plain
              icon circle. Outer hairline ring + dashed-ish dot frame
              creates the printed-almanac signet vibe. */
              }
              <View style={styles.guideBadgeWrap}>
                <View style={styles.guideBadgeOuterRing} />
                <View style={styles.guideBadge}>
                  <Ionicons
                    name="sparkles-outline"
                    size={24}
                    color={paper.dashboardBlue}
                  />
                </View>
                {/* Four small accent dots at the cardinal points of the seal. */}
                <View
                  style={[styles.guideBadgeAccentDot, styles.guideBadgeDotTop]}
                />
                <View
                  style={[
                    styles.guideBadgeAccentDot,
                    styles.guideBadgeDotRight,
                  ]}
                />
                <View
                  style={[
                    styles.guideBadgeAccentDot,
                    styles.guideBadgeDotBottom,
                  ]}
                />
                <View
                  style={[styles.guideBadgeAccentDot, styles.guideBadgeDotLeft]}
                />
              </View>
              <View style={styles.guideBody}>
                <Text style={styles.guideText}>{report.actionable_tip}</Text>
                <View style={styles.guideSignoffRow}>
                  <View style={styles.guideSignoffRule} />
                  <Text style={styles.guideSignoffOrnament}>◆</Text>
                  <Text style={styles.guideSignoff}>FINFINDR CONDITIONS</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footerRow}>
            <FooterLivePulse color={accent} />
            <Text style={styles.footerText}>TODAY'S BITE</Text>
            <View style={styles.footerSep} />
            <Ionicons
              name="analytics-outline"
              size={11}
              color={paper.dashboardMuted}
            />
            <Text style={styles.footerText}>CONDITIONS READ</Text>
            <View style={styles.footerSep} />
            <Text style={[styles.footerText, { color: accent, opacity: 0.85 }]}>
              FINFINDR
            </Text>
          </View>

          {
            /* Small pressed-edition stamp — gives the report a finished
          "this is an issue" feel. The date is computed at render
          time (no engine plumbing needed) and reads as a printed
          almanac volume number. */
          }
          <View style={styles.editionStampRow}>
            <View style={styles.editionStampRule} />
            <Text style={styles.editionStampText}>
              REPORT DATE · {formatEditionDate(
                parseLocalReportDate(report.location.local_date),
              )}
            </Text>
            <View style={styles.editionStampRule} />
          </View>
        </>
      )}
    </View>
  );
}

function AnglerUpgradeModal({
  visible,
  onClose,
  onUnlocked,
}: {
  visible: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}) {
  const { loading, purchasing, error, offering, purchase, refresh } =
    useRevenueCatStore();
  const packages = sortedAnglerPackages(offering?.availablePackages ?? []);
  const annualPackage = packages.find(isAnnualPackage) ?? packages[0] ?? null;
  const monthlyPackage = packages.find(isMonthlyPackage) ??
    packages.find((pkg) => pkg !== annualPackage) ?? null;
  const primarySubtitle = annualPackage && isAnnualPackage(annualPackage)
    ? monthlyEquivalentLabel(annualPackage)
    : null;

  useEffect(() => {
    if (!visible) return;
    if (packages.length > 0 || loading) return;
    void refresh();
  }, [loading, packages.length, refresh, visible]);

  const handlePurchase = async (pkg: PurchasesPackage | null) => {
    if (!pkg || purchasing) return;
    const unlocked = await purchase(pkg);
    if (unlocked) {
      Alert.alert("Angler unlocked", "Building your full read now.");
      onUnlocked();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.upgradeOverlay}>
        <View style={styles.upgradeSheet}>
          <TopographicLines
            style={styles.upgradeTopoLines}
            color={paper.dashboardBlue}
            count={5}
          />
          <Pressable
            style={({ pressed }) => [
              styles.upgradeClose,
              pressed && styles.upgradeClosePressed,
            ]}
            onPress={onClose}
            hitSlop={12}
            accessibilityLabel="Close Angler upgrade"
          >
            <Ionicons name="close" size={17} color={paper.dashboardInk} />
          </Pressable>

          <View style={styles.upgradeBadge}>
            <Ionicons name="trophy" size={18} color={paper.dashboardInk} />
          </View>
          <Text style={styles.upgradeEyebrow}>FINFINDR · ANGLER</Text>
          <Text style={styles.upgradeTitle}>
            Unlock the full daily read<Text style={styles.upgradeTitleDot}>
              .
            </Text>
          </Text>
          <Text style={styles.upgradeSubtitle}>
            Plus intelligent tools built for the way you fish.
          </Text>
          <Text style={styles.upgradeCopy}>
            Angler turns the preview into a full planning system: deeper bite
            reports, precision tackle direction, and water-structure reads.
          </Text>

          <View style={styles.upgradeList}>
            {ANGLER_UNLOCKS.map((item) => (
              <View key={item.title} style={styles.upgradeItem}>
                <View style={styles.upgradeItemIcon}>
                  <Ionicons
                    name={item.icon}
                    size={14}
                    color={paper.dashboardBlue}
                  />
                </View>
                <View style={styles.upgradeItemBody}>
                  <Text style={styles.upgradeItemTitle}>{item.title}</Text>
                  <Text style={styles.upgradeItemCopy}>{item.copy}</Text>
                </View>
                <View style={styles.upgradeItemCheck}>
                  <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.upgradePlans}>
            {annualPackage
              ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.upgradePrimary,
                    pressed && styles.upgradePrimaryPressed,
                    purchasing === annualPackage.identifier &&
                    styles.upgradePlanDisabled,
                  ]}
                  onPress={() => handlePurchase(annualPackage)}
                  disabled={purchasing != null}
                >
                  <View style={styles.upgradePlanCopy}>
                    <Text style={styles.upgradePrimaryText}>ANGLER ANNUAL</Text>
                    {primarySubtitle
                      ? (
                        <Text style={styles.upgradePrimarySubtext}>
                          ({primarySubtitle})
                        </Text>
                      )
                      : null}
                  </View>
                  <View style={styles.upgradePriceRow}>
                    {purchasing === annualPackage.identifier
                      ? <ActivityIndicator size="small" color="#FFFFFF" />
                      : (
                        <>
                          <Text style={styles.upgradePrimaryPrice}>
                            {annualPackage.product.priceString}
                          </Text>
                          <Ionicons
                            name="arrow-forward"
                            size={14}
                            color="#FFFFFF"
                          />
                        </>
                      )}
                  </View>
                </Pressable>
              )
              : loading
              ? (
                <View style={styles.upgradeLoading}>
                  <ActivityIndicator size="small" color={paper.dashboardBlue} />
                  <Text style={styles.upgradeLoadingText}>
                    LOADING PLANS...
                  </Text>
                </View>
              )
              : (
                <View style={styles.upgradeLoading}>
                  <Text style={styles.upgradeLoadingText}>
                    PLANS AREN'T AVAILABLE YET
                  </Text>
                </View>
              )}

            {monthlyPackage
              ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.upgradeMonthly,
                    pressed && styles.upgradeSecondaryPressed,
                    purchasing === monthlyPackage.identifier &&
                    styles.upgradePlanDisabled,
                  ]}
                  onPress={() => handlePurchase(monthlyPackage)}
                  disabled={purchasing != null}
                >
                  <View style={styles.upgradePlanCopy}>
                    <Text style={styles.upgradeMonthlyText}>
                      ANGLER MONTHLY
                    </Text>
                    <Text style={styles.upgradeMonthlySubtext}>
                      Flexible monthly access
                    </Text>
                  </View>
                  {purchasing === monthlyPackage.identifier
                    ? (
                      <ActivityIndicator
                        size="small"
                        color={paper.dashboardBlue}
                      />
                    )
                    : (
                      <Text style={styles.upgradeMonthlyPrice}>
                        {monthlyPackage.product.priceString}
                      </Text>
                    )}
                </Pressable>
              )
              : null}
          </View>
          {error ? <Text style={styles.upgradeError}>{error}</Text> : null}
          <Pressable
            style={({ pressed }) => [
              styles.upgradeSecondary,
              pressed && styles.upgradeSecondaryPressed,
            ]}
            onPress={onClose}
          >
            <Text style={styles.upgradeSecondaryText}>KEEP PREVIEW</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Pressed-edition date — "MAY 11 · 2026" — used in the report footer's
 * issue stamp. Date is the current device time (no engine plumbing
 * needed); regenerates only when the report mounts.
 */
function formatEditionDate(d: Date): string {
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day} · ${year}`;
}

/**
 * Tiny pulsing dot for the page footer — mirrors the home dashboard's
 * "LIVE" indicator at a smaller scale. The pulse runs on the native
 * driver so it doesn't pay any JS-thread cost per frame.
 */
function FooterLivePulse({ color }: { color: string }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.3,
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
  return (
    <View style={styles.footerPulseWrap}>
      <View style={[styles.footerPulseRing, { borderColor: color }]} />
      <Animated.View
        style={[styles.footerPulseDot, {
          backgroundColor: color,
          opacity: pulse,
        }]}
      />
    </View>
  );
}

// ─── LinearScoreGauge — precision instrument panel ─────────────────────────
//
// The hero score gauge is the page's signature moment — the surface a user
// stares at when they first open Today's Bite. It's built like a hand-
// pressed instrument: a row of 21 colored tick marks (one per 0.5 score),
// a glowing needle that lands on the user's score with a slight bounce,
// a pulsing live dot in the header, a band pill that stamps in, and a
// dual-shimmer sweep that polishes the panel. Five tier dots under the
// gauge give a glance-readable summary (4/5 etc.). Corner crosses at the
// plate corners mirror the home dashboard's live-conditions card so the
// gauge feels native.
//
// All motion uses the native driver where possible. The tick "reveal" is
// done with a single clipped overlay (one Animated.View on the JS thread)
// rather than 21 per-tick animations, keeping per-frame work tiny.

// 21 ticks across the 0–10 range, every 0.5 unit. Heights vary so every
// "whole number" tick is taller (major), and the band-boundary ticks are
// even taller for legibility.
const GAUGE_TICK_COUNT = 21;
const GAUGE_TICK_VALUES = Array.from(
  { length: GAUGE_TICK_COUNT },
  (_, i) => i * 0.5,
);

function tickBandColor(value: number): string {
  if (value >= 8.0) return paper.bandPrime;
  if (value >= 6.5) return paper.bandGood;
  if (value >= 5.0) return paper.bandFair;
  if (value >= 3.5) return paper.bandPoor;
  return paper.bandTough;
}

function tickHeight(value: number): number {
  // Band boundaries (3.5 / 5.0 / 6.5 / 8.0) and the extremes (0/5/10) are
  // tallest; whole numbers are mid; half-points are short.
  if (value === 0 || value === 5 || value === 10) return 22;
  if (value === 3.5 || value === 6.5 || value === 8.0) return 20;
  if (Math.floor(value) === value) return 18; // whole numbers
  return 12; // half points
}

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
  const bandLabel = (band ?? "").toUpperCase() || fallbackBandFromTier(tier);
  const tierIndex = bandTierIndex(bandLabel);

  const progress = useRef(new Animated.Value(0)).current;
  const bandOpacity = useRef(new Animated.Value(0)).current;
  const bandScale = useRef(new Animated.Value(0.7)).current;
  const shimmerX = useRef(new Animated.Value(0)).current;
  const shimmerSlowX = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const scanY = useRef(new Animated.Value(0)).current;
  const haloPulse = useRef(new Animated.Value(0.85)).current;
  const [displayScore, setDisplayScore] = useState("0.0");
  const [panelWidth, setPanelWidth] = useState(0);
  const [panelHeight, setPanelHeight] = useState(0);
  const [tickRowWidth, setTickRowWidth] = useState(0);

  // Entrance: progress + band pill stamp-in
  useEffect(() => {
    progress.setValue(0);
    bandOpacity.setValue(0);
    bandScale.setValue(0.7);
    haloPulse.setValue(0.85);
    setDisplayScore("0.0");

    const listenerId = progress.addListener(({ value }) => {
      setDisplayScore((value * 10).toFixed(1));
    });

    Animated.parallel([
      Animated.timing(progress, {
        toValue: pct,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.delay(560),
        Animated.parallel([
          Animated.timing(bandOpacity, {
            toValue: 1,
            duration: 260,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.spring(bandScale, {
            toValue: 1,
            friction: 5,
            tension: 110,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start(() => {
      setDisplayScore(clamped.toFixed(1));
    });

    return () => {
      progress.removeListener(listenerId);
    };
  }, [pct, clamped, progress, bandOpacity, bandScale, haloPulse]);

  // Live-pulse on the header dot (breathes 1 → 0.4 → 1).
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  // Slow halo breathe under the score number.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(haloPulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(haloPulse, {
          toValue: 0.72,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [haloPulse]);

  // Dual shimmer — a fast narrow sweep + a slow wide sweep behind it.
  useEffect(() => {
    if (panelWidth === 0) return;
    shimmerX.setValue(0);
    shimmerSlowX.setValue(0);
    const fast = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerX, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(900),
      ]),
    );
    const slow = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(shimmerSlowX, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(700),
      ]),
    );
    fast.start();
    slow.start();
    return () => {
      fast.stop();
      slow.stop();
    };
  }, [panelWidth, shimmerX, shimmerSlowX]);

  // Scan-line down the panel — mirrors home dashboard's liveCard motion.
  useEffect(() => {
    if (panelHeight === 0) return;
    scanY.setValue(0);
    const loop = Animated.loop(
      Animated.timing(scanY, {
        toValue: 1,
        duration: 6800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [panelHeight, scanY]);

  const leftInterp = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // For the tick-reveal: width of the lit overlay scales with progress.
  const litWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={gaugeStyles.wrap}>
      <View
        style={[gaugeStyles.panel, { borderColor: `${accent}55` }]}
        onLayout={(e) => {
          setPanelWidth(e.nativeEvent.layout.width);
          setPanelHeight(e.nativeEvent.layout.height);
        }}
      >
        {/* Corner crosses — instrument-panel marginalia, matches dashboard. */}
        <View style={[gaugeStyles.cornerCross, gaugeStyles.cornerCrossTL]}>
          <View style={gaugeStyles.cornerCrossH} />
          <View style={gaugeStyles.cornerCrossV} />
        </View>
        <View style={[gaugeStyles.cornerCross, gaugeStyles.cornerCrossTR]}>
          <View style={gaugeStyles.cornerCrossH} />
          <View style={gaugeStyles.cornerCrossV} />
        </View>
        <View style={[gaugeStyles.cornerCross, gaugeStyles.cornerCrossBL]}>
          <View style={gaugeStyles.cornerCrossH} />
          <View style={gaugeStyles.cornerCrossV} />
        </View>
        <View style={[gaugeStyles.cornerCross, gaugeStyles.cornerCrossBR]}>
          <View style={gaugeStyles.cornerCrossH} />
          <View style={gaugeStyles.cornerCrossV} />
        </View>

        {/* Slow vertical scan line — barely perceivable, alive. */}
        {panelHeight > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              gaugeStyles.scanLine,
              {
                transform: [
                  {
                    translateY: scanY.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-40, panelHeight + 40],
                    }),
                  },
                ],
              },
            ]}
          />
        )}

        {/* Dual shimmer sweeps — wide slow base + narrow fast highlight. */}
        {panelWidth > 0 && (
          <>
            <Animated.View
              pointerEvents="none"
              style={[
                gaugeStyles.panelShimmerSlow,
                {
                  transform: [
                    {
                      translateX: shimmerSlowX.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-panelWidth * 0.6, panelWidth * 1.4],
                      }),
                    },
                    { skewX: "-22deg" },
                  ],
                },
              ]}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                gaugeStyles.panelShimmer,
                {
                  transform: [
                    {
                      translateX: shimmerX.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-panelWidth, panelWidth * 1.5],
                      }),
                    },
                    { skewX: "-18deg" },
                  ],
                },
              ]}
            />
          </>
        )}

        {/* Header — live dot + eyebrow + band pill stamp. */}
        <View style={gaugeStyles.panelHeader}>
          <View style={gaugeStyles.panelHeaderLeft}>
            <View style={gaugeStyles.liveDotWrap}>
              <View
                style={[gaugeStyles.liveDotRing, { borderColor: accent }]}
              />
              <Animated.View
                style={[
                  gaugeStyles.liveDot,
                  { backgroundColor: accent, opacity: pulse },
                ]}
              />
            </View>
            <Text style={gaugeStyles.panelLabel}>CONDITION SCORE</Text>
            <View style={gaugeStyles.panelLabelSep} />
            <Text style={gaugeStyles.panelLabelDim}>LIVE READ</Text>
          </View>
          <Animated.View
            style={[
              gaugeStyles.bandPill,
              {
                backgroundColor: accent,
                opacity: bandOpacity,
                transform: [{ scale: bandScale }],
              },
            ]}
          >
            <Text style={[gaugeStyles.bandPillText, { color: accentText }]}>
              {bandLabel}
            </Text>
          </Animated.View>
        </View>

        <View
          style={[gaugeStyles.headerRule, { backgroundColor: `${accent}33` }]}
        />

        {
          /* Score crest — big ink digits sitting in a band-tinted chip,
            matching the home page's Live Conditions score chip: color
            comes from the BACKGROUND (band-tinted halo), the number
            stays dark ink for maximum legibility. Halo breathes; a
            soft outer wash + progress-width band-colored anchor under
            the number give the chip extra "alive" presence without
            tinting the typography itself. */
        }
        <View style={gaugeStyles.scoreRow}>
          <Animated.View
            style={[
              gaugeStyles.scoreHalo,
              {
                backgroundColor: accent,
                opacity: haloPulse.interpolate({
                  inputRange: [0.72, 1],
                  outputRange: [0.18, 0.28],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              gaugeStyles.scoreHaloOuter,
              {
                backgroundColor: accent,
                opacity: haloPulse.interpolate({
                  inputRange: [0.72, 1],
                  outputRange: [0.06, 0.12],
                }),
              },
            ]}
          />
          <View style={gaugeStyles.scoreOrnamentLeft}>
            <View
              style={[gaugeStyles.ornamentRule, {
                backgroundColor: `${accent}55`,
              }]}
            />
            <Text style={[gaugeStyles.ornamentGlyph, { color: accent }]}>
              ◆
            </Text>
          </View>
          <View style={gaugeStyles.scoreNumberStack}>
            <View style={gaugeStyles.scoreNumberRow}>
              <Text
                style={[gaugeStyles.scoreNum, { color: paper.dashboardInk }]}
                allowFontScaling={false}
              >
                {displayScore}
              </Text>
              <Text style={gaugeStyles.scoreMax}>/10</Text>
            </View>
            {
              /* Progress-width band-colored anchor beneath the number —
                the digit "lands" on a color-matched bar as the count-up
                completes. */
            }
            <Animated.View
              style={[
                gaugeStyles.scoreUnderline,
                {
                  backgroundColor: accent,
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["22%", "78%"],
                  }),
                },
              ]}
            />
          </View>
          <View style={gaugeStyles.scoreOrnamentRight}>
            <Text style={[gaugeStyles.ornamentGlyph, { color: accent }]}>
              ◆
            </Text>
            <View
              style={[gaugeStyles.ornamentRule, {
                backgroundColor: `${accent}55`,
              }]}
            />
          </View>
        </View>

        {
          /* Tick gauge — 21 ticks across, lit overlay revealed L→R as score
            animates. Each tick colored by its band; muted base layer is
            always rendered, full-color lit layer is clipped by progress. */
        }
        <View
          style={gaugeStyles.tickGauge}
          onLayout={(e) => setTickRowWidth(e.nativeEvent.layout.width)}
        >
          {/* Muted base layer (always full width). */}
          <View style={gaugeStyles.tickRow}>
            {GAUGE_TICK_VALUES.map((v) => (
              <View
                key={`base-${v}`}
                style={[
                  gaugeStyles.tick,
                  {
                    height: tickHeight(v),
                    backgroundColor: tickBandColor(v),
                    opacity: 0.18,
                  },
                ]}
              />
            ))}
          </View>

          {/* Lit overlay — clipped to progress width. */}
          <Animated.View
            style={[
              gaugeStyles.tickLitClip,
              { width: litWidth },
            ]}
          >
            <View
              style={[
                gaugeStyles.tickRow,
                tickRowWidth > 0 && { width: tickRowWidth },
              ]}
            >
              {GAUGE_TICK_VALUES.map((v) => (
                <View
                  key={`lit-${v}`}
                  style={[
                    gaugeStyles.tick,
                    {
                      height: tickHeight(v),
                      backgroundColor: tickBandColor(v),
                    },
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          {/* Needle — travels above the ticks to mark the exact score. */}
          <Animated.View
            pointerEvents="none"
            style={[
              gaugeStyles.needleWrap,
              { left: leftInterp },
            ]}
          >
            <View
              style={[gaugeStyles.needleGlow, { backgroundColor: accent }]}
            />
            <View
              style={[gaugeStyles.needleStem, { backgroundColor: accent }]}
            />
            <View
              style={[gaugeStyles.needleTip, {
                backgroundColor: accent,
                borderColor: paper.dashboardInk,
              }]}
            />
          </Animated.View>
        </View>

        {/* Scale labels — five anchor points across the gauge. */}
        <View style={gaugeStyles.scaleRow}>
          <Text style={gaugeStyles.scaleTick}>0</Text>
          <Text style={gaugeStyles.scaleTick}>2.5</Text>
          <Text style={gaugeStyles.scaleTick}>5</Text>
          <Text style={gaugeStyles.scaleTick}>7.5</Text>
          <Text style={gaugeStyles.scaleTick}>10</Text>
        </View>

        {/* Tier dots — five-band summary for at-a-glance read. */}
        <View style={gaugeStyles.tierDotsRow}>
          {([
            paper.bandTough,
            paper.bandPoor,
            paper.bandFair,
            paper.bandGood,
            paper.bandPrime,
          ] as const).map((c, i) => {
            const active = i === tierIndex;
            return (
              <View
                key={`tier-${i}`}
                style={[
                  gaugeStyles.tierDot,
                  {
                    backgroundColor: active ? c : "transparent",
                    borderColor: active ? c : `${c}55`,
                  },
                  active && gaugeStyles.tierDotActive,
                ]}
              />
            );
          })}
          <View style={gaugeStyles.tierDotsLabelWrap}>
            <Text style={gaugeStyles.tierDotsLabel}>
              TIER {tierIndex + 1} / 5
            </Text>
            <View
              style={[gaugeStyles.tierDotsAccent, { backgroundColor: accent }]}
            />
            <Text style={[gaugeStyles.tierDotsBand, { color: accent }]}>
              {bandLabel}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function fallbackBandFromTier(tier: PaperTier): string {
  // Tier is a 3-bucket visual grouping; we surface the most-likely 5-band
  // label for that bucket when the cached report doesn't carry one.
  return tier === "green" ? "GOOD" : tier === "yellow" ? "FAIR" : "TOUGH";
}

function bandTierIndex(bandLabel: string): number {
  // Map the 5-band label to a 0..4 tier index for the dot row.
  const b = bandLabel.toUpperCase();
  if (b === "PRIME" || b === "EXCELLENT") return 4;
  if (b === "GOOD") return 3;
  if (b === "FAIR") return 2;
  if (b === "POOR") return 1;
  return 0; // tough / unknown
}

const gaugeStyles = StyleSheet.create({
  wrap: {
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: paperSpacing.sm,
    marginBottom: paperSpacing.xs,
    width: "100%",
  },
  panel: {
    alignSelf: "stretch",
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: "#F7FAFB",
    // Slightly larger panel (~20% more vertical room) to give the bumped
    // score number plenty of breathing space.
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    overflow: "hidden",
    position: "relative",
  },

  // Corner crosses — instrument-panel marginalia.
  cornerCross: {
    position: "absolute",
    width: 10,
    height: 10,
    zIndex: 2,
  },
  cornerCrossTL: { top: 5, left: 5 },
  cornerCrossTR: { top: 5, right: 5 },
  cornerCrossBL: { bottom: 5, left: 5 },
  cornerCrossBR: { bottom: 5, right: 5 },
  cornerCrossH: {
    position: "absolute",
    top: 4.5,
    left: 0,
    width: 10,
    height: 1,
    backgroundColor: "rgba(28, 36, 25, 0.35)",
  },
  cornerCrossV: {
    position: "absolute",
    left: 4.5,
    top: 0,
    width: 1,
    height: 10,
    backgroundColor: "rgba(28, 36, 25, 0.35)",
  },

  // Scan line — slow vertical sweep, faint blue.
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 38,
    backgroundColor: "rgba(124, 184, 218, 0.10)",
    zIndex: 1,
  },

  // Dual shimmer.
  panelShimmer: {
    position: "absolute",
    top: -10,
    bottom: -10,
    width: 70,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  panelShimmerSlow: {
    position: "absolute",
    top: -10,
    bottom: -10,
    width: 180,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 6,
    zIndex: 3,
  },
  panelHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flex: 1,
    minWidth: 0,
  },
  liveDotWrap: {
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  liveDotRing: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    opacity: 0.5,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  panelLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.6,
    color: paper.dashboardInk,
    fontWeight: "700",
  },
  panelLabelDim: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.6,
    color: paper.dashboardMuted,
    fontWeight: "700",
    opacity: 0.65,
  },
  panelLabelSep: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: paper.dashboardMuted,
    opacity: 0.55,
  },

  headerRule: {
    height: StyleSheet.hairlineWidth,
    marginBottom: 8,
    zIndex: 3,
  },

  scoreRow: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginTop: 4,
    marginBottom: 10,
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 6,
    position: "relative",
    zIndex: 3,
  },
  scoreHalo: {
    position: "absolute",
    top: 4,
    bottom: 14,
    left: "20%",
    right: "20%",
    borderRadius: 48,
  },
  scoreHaloOuter: {
    position: "absolute",
    top: -2,
    bottom: 6,
    left: "10%",
    right: "10%",
    borderRadius: 70,
  },
  scoreOrnamentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "flex-end",
    maxWidth: 80,
  },
  scoreOrnamentRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "flex-start",
    maxWidth: 80,
  },
  ornamentRule: {
    flex: 1,
    height: 1,
    minWidth: 28,
    maxWidth: 60,
  },
  ornamentGlyph: {
    fontFamily: paperFonts.body,
    fontSize: 9,
    opacity: 0.75,
    lineHeight: 11,
  },
  scoreNumberStack: {
    alignItems: "center",
    // Fraunces digits at 76 px are wider than mono digits of the same
    // visual size — give the stack more breathing room so 8.8 / 10 etc.
    // never bumps into the flanking ornament rules.
    minWidth: 168,
  },
  scoreNumberRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  // Score number matches the home dashboard's Live Conditions chip
  // typography exactly: Fraunces 700 Bold (serif), tight negative
  // letter-spacing, dark ink. The serif has more weight at the bottom
  // of each digit and reads as confident magazine-cover numerics — the
  // visual hero the user is looking for. Scaled up from the home page's
  // 32px to 76px so it dominates the report page; tracking goes more
  // negative as the size grows to keep the digits feeling cut from one
  // block rather than four lonely glyphs.
  scoreNum: {
    fontFamily: paperFonts.display,
    fontSize: 76,
    lineHeight: 78,
    letterSpacing: -3,
    fontWeight: "800",
    color: paper.dashboardInk,
    includeFontPadding: false,
  },
  // "/10" matches the home dashboard's `liveCardScoreUnit`: JetBrains
  // Mono SemiBold, small, muted gray, positioned near the baseline of
  // the big serif numerals so it reads as a denominator, not a label.
  scoreMax: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.4,
    fontWeight: "700",
    marginBottom: 13,
    marginLeft: 3,
    color: paper.dashboardMuted,
    opacity: 0.85,
  },
  scoreUnderline: {
    height: 2.5,
    borderRadius: 2,
    marginTop: 4,
    alignSelf: "center",
    opacity: 0.9,
  },

  // Tick gauge.
  tickGauge: {
    width: "100%",
    height: 26,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginTop: 4,
    zIndex: 3,
  },
  tickRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  tick: {
    width: 3,
    borderRadius: 1.5,
  },
  tickLitClip: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    overflow: "hidden",
  },
  needleWrap: {
    position: "absolute",
    top: -6,
    bottom: -6,
    width: 14,
    marginLeft: -7,
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 4,
  },
  needleGlow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 14,
    borderRadius: 7,
    opacity: 0.18,
  },
  needleStem: {
    width: 1.5,
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
    opacity: 0.85,
  },
  needleTip: {
    position: "absolute",
    top: -2,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.5,
  },

  // Scale labels.
  scaleRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    zIndex: 3,
  },
  scaleTick: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9.5,
    color: paper.dashboardMuted,
    opacity: 0.6,
    width: 24,
    textAlign: "center",
  },

  // Tier dots row.
  tierDotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardHair,
    zIndex: 3,
  },
  tierDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.2,
  },
  tierDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  tierDotsLabelWrap: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tierDotsLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
    fontWeight: "700",
  },
  tierDotsAccent: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  tierDotsBand: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.6,
    fontWeight: "700",
  },

  bandPill: {
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(7, 27, 45, 0.18)",
  },
  bandPillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.8,
    fontWeight: "700",
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
        {
          /* Ordinal is now ribbon-tinted at 75% opacity so it reads as a
            small but confident editorial numeral rather than a muted
            ghost. A tiny accent dot above the digit ties it to the
            ribbon below. */
        }
        <View
          style={[styles.factorOrdinalDot, { backgroundColor: ribbonColor }]}
        />
        <Text style={[styles.factorOrdinal, { color: ribbonColor }]}>
          {String(index).padStart(2, "0")}
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
      {
        /* Small ribbon-tinted notch on the right edge — adds a finishing
          editorial cue and visually closes the row. */
      }
      <View style={styles.factorTailWrap} pointerEvents="none">
        <View
          style={[styles.factorTailGlyph, { backgroundColor: ribbonColor }]}
        />
        <View
          style={[styles.factorTailGlyphSmall, {
            backgroundColor: ribbonColor,
          }]}
        />
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
  icon:
    keyof typeof import("@expo/vector-icons/build/Ionicons").default.glyphMap;
  isBest: boolean;
}) {
  const bestBg = "#E7F5E1";
  const bestFg = paper.dashboardInk;

  // Soft pulse on the "best" tile's check badge — subtle native-driver
  // opacity loop that signals the highlighted period without being noisy.
  const badgePulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!isBest) {
      badgePulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, {
          toValue: 0.6,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(badgePulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isBest, badgePulse]);

  return (
    <View
      style={[
        styles.timeTile,
        isBest && {
          backgroundColor: bestBg,
          borderColor: "rgba(47, 174, 99, 0.45)",
          transform: [{ translateY: -2 }],
        },
      ]}
    >
      {
        /* Soft accent ring around the "best" tile — subtle glow that
          rewards a closer look without competing with the badge. */
      }
      {isBest && <View style={styles.timeTileGlowRing} pointerEvents="none" />}
      {isBest && (
        <Animated.View style={[styles.bestBadgePulse, { opacity: badgePulse }]}>
          <View style={styles.bestBadgeRing} />
        </Animated.View>
      )}
      {isBest && (
        <View style={styles.bestBadge}>
          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
        </View>
      )}
      <View style={styles.timeTileTop}>
        {
          /* Hairline ring around the icon adds a small premium touch even
            when the tile isn't "best". On best, it tinks slightly green. */
        }
        <View
          style={[
            styles.timeTileIconWrap,
            isBest && { borderColor: "rgba(47, 174, 99, 0.45)" },
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={isBest ? bestFg : paper.dashboardInk}
          />
        </View>
      </View>
      <View
        style={[
          styles.timeTileBody,
          isBest && { borderTopColor: "rgba(47, 174, 99, 0.35)" },
        ]}
      >
        <Text
          style={[styles.timeTileLabel, isBest && { color: bestFg }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.72}
          allowFontScaling={false}
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

// ─── Almanac decorations ───────────────────────────────────────────────────

/**
 * Decorative crescent glyph for the MOON & TIDE header — two concentric
 * circles with an offset that produces a crescent shape, all in
 * dashboard blue. Reads as a small almanac seal in place of the plain
 * moon icon.
 */
function AlmanacCrescent() {
  return (
    <View style={styles.almanacCrescentWrap}>
      <View style={styles.almanacCrescentOuter} />
      <View style={styles.almanacCrescentInner} />
    </View>
  );
}

/**
 * Two-layer pulse dot for the strong-window list. The outer ring slowly
 * breathes opacity while the inner core stays solid — signals "active
 * window" without animating size (native-driver opacity loop, no
 * per-frame layout cost).
 */
function AlmanacPulseDot({ kind }: { kind: "strong" }) {
  const pulse = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  void kind;
  return (
    <View style={styles.almanacPulseWrap}>
      <Animated.View
        style={[
          styles.almanacPulseRing,
          { opacity: pulse },
        ]}
      />
      <View style={styles.almanacPulseCore} />
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
    overflow: "hidden",
    alignItems: "center",
    position: "relative",
  },
  heroTopoLines: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  heroEyebrow: {
    marginBottom: 4,
    alignItems: "center",
  },
  heroHeadline: {
    fontFamily: paperFonts.display,
    fontWeight: "800",
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: "center",
    color: paper.dashboardInk,
    paddingHorizontal: paperSpacing.sm,
    // Reserve two lines of vertical space even when the headline only
    // takes one. This keeps the score gauge below at the same Y position
    // across context tabs (lake / river / inshore / flats) — without the
    // minHeight, a 1-line headline on the river tab caused the gauge to
    // sit visibly higher than on the lake tab.
    minHeight: 56,
    textAlignVertical: "center",
  },
  heroHeadlineDot: {
    color: paper.dashboardBlue,
  },
  heroOutlookRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: paperSpacing.xs,
    alignSelf: "stretch",
  },
  heroOutlookFlank: {
    height: 1,
    flex: 1,
    maxWidth: 36,
    minWidth: 14,
    opacity: 0.9,
  },
  heroOutlookDiamond: {
    fontFamily: paperFonts.body,
    fontSize: 10,
    lineHeight: 12,
    opacity: 0.85,
  },
  heroOutlookLine: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: "italic",
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: "center",
    flexShrink: 1,
  },

  // Hero corner crosses — small instrument-panel marks pinned to each
  // corner of the hero card. Matches the home dashboard's liveCard motif.
  heroCornerCross: {
    position: "absolute",
    width: 11,
    height: 11,
    zIndex: 2,
  },
  heroCornerCrossTL: { top: 7, left: 7 },
  heroCornerCrossTR: { top: 7, right: 7 },
  heroCornerCrossBL: { bottom: 7, left: 7 },
  heroCornerCrossBR: { bottom: 7, right: 7 },
  heroCornerCrossH: {
    position: "absolute",
    top: 5,
    left: 0,
    width: 11,
    height: 1,
    backgroundColor: "rgba(28, 36, 25, 0.32)",
  },
  heroCornerCrossV: {
    position: "absolute",
    left: 5,
    top: 0,
    width: 1,
    height: 11,
    backgroundColor: "rgba(28, 36, 25, 0.32)",
  },
  heroSummaryWrap: {
    flexDirection: "row",
    alignItems: "stretch",
    alignSelf: "center",
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
    fontStyle: "italic",
    // Shrunk 15 → 13 per user feedback — the bumped score number is now
    // the headline weight on the page, so the summary paragraph reads as
    // supporting detail rather than competing copy.
    fontSize: 13,
    lineHeight: 19,
    color: paper.dashboardInk,
    opacity: 0.86,
    textAlign: "left",
    letterSpacing: 0,
  },
  limitedCard: {
    position: "relative",
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    borderRadius: 10,
    padding: paperSpacing.lg,
    alignItems: "center",
    overflow: "hidden",
  },
  limitedTopoLines: {
    top: -18,
    left: -16,
    right: -16,
    height: 88,
    opacity: 0.12,
  },
  limitedIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: paper.dashboardHair,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: paperSpacing.sm,
  },
  limitedTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: paperSpacing.sm,
  },
  limitedCopy: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: paper.dashboardInk,
    opacity: 0.72,
    textAlign: "center",
    marginBottom: paperSpacing.md,
  },
  limitedFeatureGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: paperSpacing.lg,
  },
  limitedFeaturePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardBlueSky,
    borderRadius: 999,
    paddingLeft: 5,
    paddingRight: 10,
    paddingVertical: 5,
  },
  limitedFeatureIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(10,27,46,0.14)",
  },
  limitedFeatureText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.8,
    letterSpacing: 1.2,
    color: paper.dashboardInk,
  },
  limitedCta: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: paper.dashboardBlue,
    borderRadius: 8,
    paddingHorizontal: paperSpacing.lg,
  },
  limitedCtaPressed: {
    opacity: 0.82,
  },
  limitedCtaText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  upgradeOverlay: {
    flex: 1,
    backgroundColor: "rgba(10,27,46,0.68)",
    alignItems: "center",
    justifyContent: "center",
    padding: paperSpacing.lg,
  },
  upgradeSheet: {
    width: "100%",
    maxWidth: 430,
    maxHeight: "92%",
    position: "relative",
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    borderRadius: 12,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.xl,
    paddingBottom: paperSpacing.lg,
    overflow: "hidden",
  },
  upgradeTopoLines: {
    top: -34,
    left: -20,
    right: -20,
    height: 124,
    opacity: 0.1,
  },
  upgradeClose: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: paper.dashboardHair,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.82)",
  },
  upgradeClosePressed: {
    opacity: 0.72,
  },
  upgradeBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: paper.bandFair,
    borderWidth: 1,
    borderColor: "rgba(10,27,46,0.18)",
    marginBottom: paperSpacing.sm,
  },
  upgradeEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 2,
    color: paper.dashboardBlue,
    textAlign: "center",
    marginBottom: paperSpacing.xs,
  },
  upgradeTitle: {
    fontFamily: paperFonts.display,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: 0,
    color: paper.dashboardInk,
    fontWeight: "700",
    textAlign: "center",
  },
  upgradeTitleDot: {
    color: paper.dashboardBlue,
  },
  upgradeSubtitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 1.5,
    color: paper.dashboardBlue,
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: paperSpacing.xs,
  },
  upgradeCopy: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: "italic",
    fontSize: 13,
    lineHeight: 19,
    color: paper.dashboardInk,
    opacity: 0.76,
    textAlign: "center",
    marginTop: paperSpacing.sm,
    marginBottom: paperSpacing.md,
  },
  upgradeList: {
    gap: 11,
    marginBottom: paperSpacing.md,
  },
  upgradeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    position: "relative",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1.25,
    borderColor: "rgba(61,168,95,0.42)",
    backgroundColor: "#F4FAF1",
    borderRadius: 8,
  },
  upgradeItemIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(61,168,95,0.34)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(61,168,95,0.14)",
  },
  upgradeItemBody: {
    flex: 1,
  },
  upgradeItemTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10.5,
    letterSpacing: 1.6,
    color: paper.dashboardInk,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  upgradeItemCopy: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 17,
    color: paper.dashboardInk,
    opacity: 0.78,
  },
  upgradeItemCheck: {
    width: 19,
    height: 19,
    borderRadius: 9.5,
    backgroundColor: paper.bandPrime,
    borderWidth: 1,
    borderColor: "rgba(10,27,46,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  upgradePlans: {
    gap: paperSpacing.sm,
  },
  upgradePlanCopy: {
    flex: 1,
    minWidth: 0,
  },
  upgradePriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: paperSpacing.sm,
  },
  upgradePlanDisabled: {
    opacity: 0.72,
  },
  upgradePrimary: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: paper.dashboardInk,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm,
  },
  upgradePrimaryPressed: {
    opacity: 0.84,
  },
  upgradePrimaryText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 2,
    color: "#FFFFFF",
  },
  upgradePrimarySubtext: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: "italic",
    fontSize: 12,
    lineHeight: 17,
    color: "rgba(255,255,255,0.78)",
    marginTop: 3,
  },
  upgradePrimaryPrice: {
    fontFamily: paperFonts.display,
    fontSize: 21,
    lineHeight: 24,
    fontWeight: "700",
    letterSpacing: 0,
    color: "#FFFFFF",
  },
  upgradeMonthly: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderWidth: 1.25,
    borderColor: paper.dashboardInk,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm,
  },
  upgradeMonthlyText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10.5,
    letterSpacing: 1.8,
    color: paper.dashboardInk,
  },
  upgradeMonthlySubtext: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: "italic",
    fontSize: 11.5,
    lineHeight: 16,
    color: paper.dashboardMuted,
    marginTop: 3,
  },
  upgradeMonthlyPrice: {
    fontFamily: paperFonts.display,
    fontSize: 19,
    lineHeight: 23,
    fontWeight: "700",
    letterSpacing: 0,
    color: paper.dashboardInk,
  },
  upgradeLoading: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: paper.dashboardHair,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  upgradeLoadingText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.7,
    color: paper.dashboardBlue,
  },
  upgradeError: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    lineHeight: 17,
    color: paper.bandTough,
    textAlign: "center",
    marginTop: paperSpacing.sm,
  },
  upgradeSecondary: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: paperSpacing.sm,
    marginTop: paperSpacing.xs,
  },
  upgradeSecondaryPressed: {
    opacity: 0.68,
  },
  upgradeSecondaryText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.7,
    color: paper.dashboardMuted,
  },

  // ── Hero meta strip (air · ctx · tz) ─────────────────────────────────
  metaStripWrap: {
    width: "100%",
    marginTop: paperSpacing.sm + 4,
  },
  metaRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardLine,
    opacity: 0.45,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
  },
  metaItemLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    letterSpacing: 1.8,
    color: paper.dashboardMuted,
    opacity: 0.55,
    fontWeight: "700",
  },
  metaItemValue: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardInk,
    letterSpacing: 0.6,
    fontWeight: "700",
  },
  metaSep: {
    width: StyleSheet.hairlineWidth,
    height: 12,
    backgroundColor: paper.dashboardLine,
    opacity: 0.35,
  },

  // ── Section masthead ────────────────────────────────────────────────
  sectionMasthead: {
    width: "100%",
    alignItems: "stretch",
    gap: 4,
  },
  sectionMastheadRuleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: "100%",
  },
  sectionMastheadCap: {
    width: 5,
    height: 5,
    borderRadius: 1,
  },
  sectionMastheadOrnament: {
    fontFamily: paperFonts.body,
    fontSize: 9,
    lineHeight: 10,
    opacity: 0.75,
  },
  sectionMastheadRule: {
    height: 1.6,
    flex: 1,
  },
  sectionMastheadInner: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingVertical: 4,
    gap: 8,
    flexWrap: "wrap",
  },
  sectionMastheadTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11.5,
    letterSpacing: 2.8,
    fontWeight: "700",
    flexShrink: 1,
  },
  sectionMastheadMeta: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: "italic",
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
    overflow: "hidden",
  },
  factorHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "700",
    flex: 1,
  },
  factorHeaderCount: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
    opacity: 0.7,
    fontWeight: "700",
  },
  factorBody: {
    paddingHorizontal: paperSpacing.md - 2,
    paddingTop: paperSpacing.xs,
    paddingBottom: paperSpacing.sm,
  },
  factorRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm + 2,
  },
  factorRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: paper.dashboardHair,
  },
  factorOrdinalCol: {
    width: 28,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 1,
    gap: 4,
  },
  factorOrdinalDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginLeft: 4,
    opacity: 0.85,
  },
  factorOrdinal: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "800",
    opacity: 0.75,
    letterSpacing: 0,
    includeFontPadding: false,
  },
  factorRibbon: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 2,
    minHeight: 38,
  },
  factorTailWrap: {
    alignSelf: "center",
    alignItems: "center",
    gap: 3,
    width: 6,
    marginLeft: 4,
    opacity: 0.65,
  },
  factorTailGlyph: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  factorTailGlyphSmall: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.6,
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
    fontWeight: "700",
    lineHeight: 11,
  },
  factorLabel: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 14.5,
    lineHeight: 20,
    color: paper.dashboardInk,
    fontWeight: "600",
  },
  mutedText: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: "italic",
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
    flexDirection: "row",
    gap: 8,
    marginTop: paperSpacing.xs + 2,
  },
  daypartNote: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: "italic",
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
    overflow: "hidden",
    minHeight: 110,
  },
  timeTileTop: {
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 8,
    alignItems: "center",
  },
  timeTileBody: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardHair,
    alignItems: "center",
  },
  timeTileLabel: {
    fontFamily: paperFonts.display,
    fontSize: 14.5,
    fontWeight: "700",
    color: paper.dashboardInk,
    letterSpacing: 0,
    textAlign: "center",
    width: "100%",
  },
  timeTileRange: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.dashboardMuted,
    opacity: 0.65,
    marginTop: 2,
  },
  bestBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: paper.dashboardInk,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
  },
  bestBadgePulse: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  bestBadgeRing: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "rgba(47, 174, 99, 0.6)",
  },
  timeTileGlowRing: {
    position: "absolute",
    top: -2,
    bottom: -2,
    left: -2,
    right: -2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(47, 174, 99, 0.18)",
    zIndex: 1,
  },
  timeTileIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.dashboardHair,
    backgroundColor: "#FAFAF7",
    alignItems: "center",
    justifyContent: "center",
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  almanacCrescentWrap: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  almanacCrescentOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: paper.dashboardBlue,
  },
  almanacCrescentInner: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: paper.dashboardWhite,
    top: 1,
    left: 4,
  },
  almanacHeaderTag: {
    marginLeft: "auto",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.dashboardLine,
    backgroundColor: "#F6F9FB",
  },
  almanacHeaderTagText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.6,
    color: paper.dashboardMuted,
    fontWeight: "700",
  },
  almanacSubheadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: paperSpacing.xs,
  },
  almanacSubheadBar: {
    width: 3,
    height: 10,
    borderRadius: 1.5,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.85,
  },
  almanacPulseWrap: {
    width: 12,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  almanacPulseRing: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
  },
  almanacPulseCore: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: paper.dashboardBlue,
  },
  almanacTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2.8,
    color: paper.dashboardBlue,
    fontWeight: "700",
    flexShrink: 1,
  },
  almanacRule: {
    height: 1.5,
    backgroundColor: paper.dashboardLine,
    opacity: 0.7,
    marginTop: paperSpacing.sm,
    marginBottom: paperSpacing.sm + 2,
  },
  almanacRow: {
    flexDirection: "row",
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
    fontWeight: "700",
  },
  almanacPeriod: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "700",
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
    position: "relative",
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.lg,
    overflow: "hidden",
  },
  guideLines: {
    left: undefined,
    right: -30,
    top: -20,
    width: 280,
    height: 280,
  },
  guideEyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: paperSpacing.sm + 2,
    gap: paperSpacing.sm,
  },
  tipTagChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 999,
    backgroundColor: "#F6F9FB",
  },
  tipTagChipText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    letterSpacing: 1.6,
    color: paper.dashboardMuted,
    fontWeight: "700",
  },
  guideRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: paperSpacing.md + 4,
  },
  guideBadgeWrap: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexShrink: 0,
    marginTop: 2,
  },
  guideBadgeOuterRing: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.dashboardBlue,
    opacity: 0.45,
  },
  guideBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardBlueSky,
    alignItems: "center",
    justifyContent: "center",
  },
  guideBadgeAccentDot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.55,
  },
  guideBadgeDotTop: { top: 0, alignSelf: "center" },
  guideBadgeDotBottom: { bottom: 0, alignSelf: "center" },
  guideBadgeDotLeft: { left: 0, top: "50%", marginTop: -2 },
  guideBadgeDotRight: { right: 0, top: "50%", marginTop: -2 },
  guideBody: { flex: 1 },
  guideText: {
    fontFamily: paperFonts.displayMedium,
    fontSize: 16,
    lineHeight: 24,
    color: paper.dashboardInk,
    marginTop: 2,
  },
  guideSignoffRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: paperSpacing.sm + 2,
  },
  guideSignoffRule: {
    width: 16,
    height: 1,
    backgroundColor: paper.dashboardLine,
    opacity: 0.85,
  },
  guideSignoffOrnament: {
    fontFamily: paperFonts.body,
    fontSize: 8,
    color: paper.dashboardBlue,
    opacity: 0.65,
    lineHeight: 10,
  },
  guideSignoff: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2.4,
    color: paper.dashboardMuted,
    opacity: 0.7,
    fontWeight: "700",
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "700",
  },
  footerSep: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: paper.dashboardMuted,
    opacity: 0.45,
    marginHorizontal: 1,
  },
  footerPulseWrap: {
    width: 10,
    height: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  footerPulseRing: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    opacity: 0.45,
  },
  footerPulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },

  // Edition stamp — small almanac signature beneath the footer row.
  editionStampRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingTop: 8,
  },
  editionStampRule: {
    height: StyleSheet.hairlineWidth,
    flex: 1,
    maxWidth: 28,
    backgroundColor: paper.dashboardLine,
    opacity: 0.65,
  },
  editionStampText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
    opacity: 0.7,
  },
});
