/**
 * How's Fishing — Results Screen
 *
 * Renders the deterministic engine output (score, breakdown, alerts) and the
 * LLM narrative together. Source of truth for score is always the engine.
 *
 * Spec reference: hows_fishing_feature_spec.md Section 9
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../lib/theme';
import { getCachedHowFishingBundle, getCurrentHowFishingBundle } from '../lib/howFishing';
import type {
  HowFishingBundle,
  WaterType,
  WaterTypeReport,
  EngineScoring,
  EngineAlerts,
  DataQuality,
  TimeWindow,
  WorstWindow,
  LLMOutput,
} from '../lib/howFishing';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cleanSummary(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  const s = raw.trim().replace(/^```(?:json)?\s*/gi, '').replace(/\s*```\s*$/gi, '').trim();
  if (s.startsWith('{') && s.endsWith('}')) return '';
  return s;
}

function windDirectionLabel(deg: number): string {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  const idx = Math.round(((deg % 360) + 360) / 22.5) % 16;
  return dirs[idx] ?? '—';
}

/** Score band for card color */
function getScoreBand(score: number): 'red' | 'yellow' | 'green' {
  if (score <= 37) return 'red';
  if (score <= 71) return 'yellow';
  return 'green';
}

function reliabilityColor(tier: string): string {
  if (tier === 'high') return colors.sage;
  if (tier === 'degraded') return '#E8A838';
  return '#E05252';
}

function reliabilityLabel(tier: string): string {
  if (tier === 'high') return 'High confidence';
  if (tier === 'degraded') return 'Reduced confidence — some data missing';
  if (tier === 'low_confidence') return 'Low confidence — significant data gaps';
  return 'Very low confidence — limited data available';
}

function formatWaterTempDisplay(tempF: number | null): string {
  if (tempF === null || Number.isNaN(tempF)) return 'Unavailable';
  return `${Math.round(tempF * 10) / 10}°F`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AlertBanner({ title, body, severity }: { title: string; body: string; severity: 'critical' | 'warning' | 'info' }) {
  const bgColor = severity === 'critical' ? '#FFF0F0' : severity === 'warning' ? '#FFF8E6' : '#E8F4FD';
  const borderColor = severity === 'critical' ? '#E05252' : severity === 'warning' ? '#E8A838' : '#4A9ECC';
  const iconName = severity === 'critical' ? 'warning' : severity === 'warning' ? 'alert-circle' : 'information-circle';
  const iconColor = severity === 'critical' ? '#E05252' : severity === 'warning' ? '#E8A838' : '#4A9ECC';
  return (
    <View style={[styles.alertBanner, { backgroundColor: bgColor, borderColor }]}>
      <Ionicons name={iconName as any} size={20} color={iconColor} style={styles.alertIcon} />
      <View style={styles.alertText}>
        <Text style={[styles.alertTitle, { color: iconColor }]}>{title}</Text>
        <Text style={styles.alertBody}>{body}</Text>
      </View>
    </View>
  );
}

function WaterTemperatureBanner({ engine }: { engine: WaterTypeReport['engine'] }) {
  if (!engine) return null;

  const source = engine.environment.water_temp_source;
  const temp = engine.environment.water_temp_f;
  if (temp === null) return null;

  const isMeasured = source === 'noaa_coops';
  return (
    <View style={[styles.alertBanner, { backgroundColor: '#F3F8FC', borderColor: '#4A9ECC' }]}>
      <Ionicons
        name={isMeasured ? 'water-outline' : 'information-circle-outline'}
        size={20}
        color="#4A9ECC"
        style={styles.alertIcon}
      />
      <View style={styles.alertText}>
        <Text style={[styles.alertTitle, { color: '#4A9ECC' }]}>
          {isMeasured ? 'Measured Water Temperature' : 'Estimated Water Temperature'}
        </Text>
        <Text style={styles.alertBody}>
          {formatWaterTempDisplay(temp)} ·{' '}
          {isMeasured
            ? 'NOAA coastal observation used in analysis.'
            : 'Estimated from recent air-temperature history.'}
        </Text>
      </View>
    </View>
  );
}

function ScoreCard({ scoring, waterType }: { scoring: EngineScoring; waterType: WaterType }) {
  const band = getScoreBand(scoring.adjusted_score);
  const scoreCardStyle =
    band === 'red'
      ? { bg: '#FFF0F0', border: '#E05252', text: '#E05252' }
      : band === 'yellow'
      ? { bg: '#FFF8E6', border: '#E8A838', text: '#C47B00' }
      : { bg: '#F0F8F0', border: colors.sage, text: colors.sage };

  const recoveryNote = scoring.recovery_multiplier < 1.0
    ? `Cold front recovery — ${Math.round((1 - scoring.recovery_multiplier) * 100)}% penalty applied`
    : null;

  return (
    <View style={[styles.scoreCard, { backgroundColor: scoreCardStyle.bg, borderColor: scoreCardStyle.border }]}>
      <Text style={[styles.scoreBig, { color: scoreCardStyle.text }]}>{scoring.adjusted_score}</Text>
      <Text style={styles.scoreOutOf}>out of 100</Text>
      <Text style={[styles.scoreRating, { color: scoreCardStyle.text }]}>{scoring.overall_rating}</Text>
      <Text style={styles.scoreWaterType}>{waterType.charAt(0).toUpperCase() + waterType.slice(1)}</Text>
      {recoveryNote && <Text style={styles.recoveryNote}>{recoveryNote}</Text>}
      {scoring.raw_score !== scoring.adjusted_score && (
        <Text style={styles.rawScoreNote}>Raw score: {scoring.raw_score} · Recovery multiplier: {scoring.recovery_multiplier.toFixed(2)}×</Text>
      )}
    </View>
  );
}

function ScoreBreakdown({ scoring }: { scoring: EngineScoring }) {
  const entries = Object.entries(scoring.components)
    .map(([key, score]) => ({
      key,
      score,
      weight: scoring.weights[key] ?? 0,
      status: scoring.component_status[key] ?? 'available',
    }))
    .sort((a, b) => b.weight - a.weight);

  return (
    <View style={styles.breakdownCard}>
      <Text style={styles.breakdownTitle}>Score Breakdown</Text>
      {entries.map(({ key, score, weight, status }) => {
        const pct = weight > 0 ? score / weight : 0;
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const barColor = pct >= 0.7 ? colors.sage : pct >= 0.4 ? '#E8A838' : '#E05252';
        const isFallback = status === 'fallback_used';
        return (
          <View key={key} style={styles.breakdownRow}>
            <View style={styles.breakdownLabelRow}>
              <Text style={styles.breakdownLabel}>{label}</Text>
              {isFallback && <Text style={styles.fallbackBadge}>est.</Text>}
              <Text style={styles.breakdownScore}>{score}/{weight}</Text>
            </View>
            <View style={styles.breakdownBarBg}>
              <View style={[styles.breakdownBarFill, { width: `${pct * 100}%`, backgroundColor: barColor }]} />
            </View>
          </View>
        );
      })}
      <View style={styles.coverageRow}>
        <Text style={styles.coverageLabel}>
          Data coverage: {scoring.coverage_pct}% ·{' '}
          <Text style={{ color: reliabilityColor(scoring.reliability_tier) }}>
            {reliabilityLabel(scoring.reliability_tier)}
          </Text>
        </Text>
      </View>
    </View>
  );
}

function DataQualityNotice({ quality, tier }: { quality: DataQuality; tier: string }) {
  if (tier === 'high' && quality.missing_variables.length === 0 && quality.fallback_variables.length === 0) {
    return null;
  }
  const isSerious = tier === 'low_confidence' || tier === 'very_low_confidence';
  return (
    <View style={[styles.qualityNotice, isSerious && styles.qualityNoticeSevere]}>
      <Ionicons
        name="information-circle"
        size={16}
        color={isSerious ? '#E05252' : '#E8A838'}
        style={{ marginRight: 6 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.qualityTitle, isSerious && { color: '#E05252' }]}>
          {reliabilityLabel(tier)}
        </Text>
        {quality.missing_variables.length > 0 && (
          <Text style={styles.qualityDetail}>Missing: {quality.missing_variables.join(', ')}</Text>
        )}
        {quality.fallback_variables.length > 0 && (
          <Text style={styles.qualityDetail}>Estimated: {quality.fallback_variables.join(', ')}</Text>
        )}
        {quality.notes.map((n, i) => <Text key={i} style={styles.qualityDetail}>{n}</Text>)}
      </View>
    </View>
  );
}

function BestTimesSection({ windows }: { windows: LLMOutput['best_times_to_fish_today'] }) {
  if (!windows || windows.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Best Times to Fish Today</Text>
      {windows.map((w, i) => (
        <View key={i} style={[styles.timeCard, w.label === 'PRIME' && styles.timeCardPrime]}>
          <View style={styles.timeCardHeader}>
            <Text style={styles.timeWindow}>{w.time_range}</Text>
            <View style={[styles.labelBadge, w.label === 'PRIME' ? styles.badgePrime : styles.badgeGood]}>
              <Text style={styles.labelBadgeText}>{w.label}</Text>
            </View>
          </View>
          <Text style={styles.timeReasoning}>{w.reasoning}</Text>
        </View>
      ))}
    </View>
  );
}

function WorstTimesSection({ windows }: { windows: LLMOutput['worst_times_to_fish_today'] }) {
  if (!windows || windows.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Worst Times Today</Text>
      {windows.map((w, i) => (
        <View key={i} style={styles.timeCardMuted}>
          <Text style={styles.timeWindow}>{w.time_range}</Text>
          <Text style={styles.timeReasoningMuted}>{w.reasoning}</Text>
        </View>
      ))}
    </View>
  );
}

function KeyFactorsSection({ factors }: { factors: LLMOutput['key_factors'] }) {
  const entries = Object.entries(factors).filter(([, v]) => v && typeof v === 'string');
  if (entries.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Key Factors</Text>
      <View style={styles.descCard}>
        {entries.map(([key, val]) => (
          <View key={key} style={styles.whyRow}>
            <Text style={styles.whyFactor}>
              {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </Text>
            <Text style={styles.whyVal}>{val}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TipsSection({ tips }: { tips: string[] }) {
  if (!tips || tips.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tips for Today</Text>
      <View style={styles.tipsCard}>
        {tips.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <Ionicons name="bulb" size={18} color={colors.sage} style={styles.tipIcon} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Single-tab report renderer
// ---------------------------------------------------------------------------

function ReportView({ report }: { report: WaterTypeReport }) {
  if (report.status === 'error' || !report.engine || !report.llm) {
    const isEngineError = report.error?.startsWith('engine_error') ?? false;
    const isClaudeError = report.error === 'claude_unavailable' || report.error === 'malformed_response';
    return (
      <View style={styles.errorState}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.textMuted} />
        <Text style={styles.errorTitle}>Report unavailable</Text>
        <Text style={styles.errorBody}>
          {isEngineError
            ? 'The conditions scoring engine could not run for this water type.'
            : isClaudeError
            ? 'AI analysis temporarily unavailable. Please go back and try again.'
            : 'This report could not be generated. Please go back and try again.'}
        </Text>
      </View>
    );
  }

  const { engine, llm } = report;
  const alerts = engine.alerts;
  const summary = cleanSummary(llm.headline_summary);

  return (
    <View>
      {/* Headline */}
      {summary ? (
        <View style={styles.headlineCard}>
          <Text style={styles.headlineText}>{summary}</Text>
        </View>
      ) : null}

      {/* Alerts */}
      {alerts.cold_stun_alert && (
        <AlertBanner
          title="Cold Stun Alert"
          body="Water temperature has dropped sharply. Fish metabolic activity is severely suppressed."
          severity="critical"
        />
      )}
      {alerts.salinity_disruption_alert && (
        <AlertBanner
          title="Salinity Disruption"
          body="Heavy recent rainfall may have significantly reduced salinity in brackish zones, displacing fish."
          severity="critical"
        />
      )}
      {alerts.rapid_cooling_alert && (
        <AlertBanner
          title="Rapid Temperature Drop"
          body="A rapid cooling event may trigger a brief pre-front feed-up window — fish quickly before conditions deteriorate."
          severity="warning"
        />
      )}
      {alerts.recovery_active && !alerts.cold_stun_alert && (
        <AlertBanner
          title={`Cold Front Recovery — Day ${alerts.days_since_front}`}
          body="A cold front passed recently. Fish are still recovering. Activity improving but not at full baseline yet."
          severity="info"
        />
      )}

      <WaterTemperatureBanner engine={engine} />

      {/* Cold stun transparency note — shown when alert could not be evaluated */}
      {!alerts.cold_stun_alert && alerts.cold_stun_status === 'not_evaluable_missing_inputs' && (
        <View style={styles.coldStunNote}>
          <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} style={{ marginRight: 5 }} />
          <Text style={styles.coldStunNoteText}>
            Cold stun could not be fully evaluated — historical measured coastal water-temperature history not yet available.
          </Text>
        </View>
      )}

      {/* Score Card */}
      <ScoreCard scoring={engine.scoring} waterType={report.water_type} />

      {/* Data Quality Notice */}
      <DataQualityNotice quality={engine.data_quality} tier={engine.scoring.reliability_tier} />

      {/* Best + Worst Times */}
      <BestTimesSection windows={llm.best_times_to_fish_today} />
      <WorstTimesSection windows={llm.worst_times_to_fish_today} />

      {/* Key Factors */}
      <KeyFactorsSection factors={llm.key_factors} />

      {/* Score Breakdown */}
      <ScoreBreakdown scoring={engine.scoring} />

      {/* Tips */}
      <TipsSection tips={llm.tips_for_today} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Water-type tab bar
// ---------------------------------------------------------------------------

const TAB_LABELS: Record<WaterType, string> = {
  freshwater: 'Freshwater',
  saltwater: 'Saltwater',
  brackish: 'Brackish',
};

function TabBar({
  tabs,
  active,
  onPress,
  failed,
}: {
  tabs: WaterType[];
  active: WaterType;
  onPress: (t: WaterType) => void;
  failed: string[];
}) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((t) => {
        const isActive = t === active;
        const isFailed = failed.includes(t);
        return (
          <Pressable
            key={t}
            style={[styles.tab, isActive && styles.tabActive, isFailed && styles.tabFailed]}
            onPress={() => onPress(t)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {isFailed && (
                <Ionicons name="warning-outline" size={13} color="#E05252" />
              )}
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive, isFailed && styles.tabLabelFailed]}>
                {TAB_LABELS[t]}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function HowFishingResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ payload?: string; lat?: string; lon?: string }>();
  const routeLat = params.lat ? Number(params.lat) : undefined;
  const routeLon = params.lon ? Number(params.lon) : undefined;

  let initialBundle: HowFishingBundle | null = null;
  try {
    initialBundle = params.payload ? (JSON.parse(params.payload) as HowFishingBundle) : null;
  } catch {
    initialBundle = null;
  }
  if (!initialBundle) {
    initialBundle = getCurrentHowFishingBundle(routeLat, routeLon);
  }

  const [bundle, setBundle] = useState<HowFishingBundle | null>(initialBundle);
  const [bundleLoading, setBundleLoading] = useState(
    !initialBundle && typeof routeLat === 'number' && typeof routeLon === 'number'
  );

  useEffect(() => {
    let cancelled = false;
    if (bundle || typeof routeLat !== 'number' || typeof routeLon !== 'number') {
      setBundleLoading(false);
      return;
    }

    getCachedHowFishingBundle(routeLat, routeLon)
      .then((cached) => {
        if (!cancelled) setBundle(cached);
      })
      .finally(() => {
        if (!cancelled) setBundleLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [bundle, routeLat, routeLon]);

  const isCoastal = bundle?.mode === 'coastal_multi';
  const availableTabs: WaterType[] = isCoastal
    ? ['freshwater', 'saltwater', 'brackish']
    : ['freshwater'];

  const [activeTab, setActiveTab] = useState<WaterType>(
    (bundle?.default_tab as WaterType) ?? 'freshwater'
  );

  if (bundleLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.errorStateContainer}>
          <Ionicons name="time-outline" size={42} color={colors.textMuted} />
          <Text style={styles.errorTitle}>Loading report</Text>
          <Text style={styles.errorBody}>Restoring your latest fishing analysis…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state — no bundle at all
  if (!bundle || !bundle.reports) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.errorStateContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={styles.errorTitle}>Report not available</Text>
          <Text style={styles.errorBody}>The report could not be loaded. Please go back and try again.</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color={colors.sage} />
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const activeReport = bundle.reports[activeTab];

  const generatedAt = bundle.generated_at
    ? new Date(bundle.generated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            style={({ pressed }) => [styles.backBtnInline, pressed && { opacity: 0.7 }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.sage} />
            <Text style={styles.backBtnInlineText}>Back</Text>
          </Pressable>
          {generatedAt && (
            <Text style={styles.generatedAt}>Generated {generatedAt}</Text>
          )}
        </View>

        <Text style={styles.screenTitle}>How's Fishing?</Text>

        {/* Tab Bar — only for coastal */}
        {isCoastal && (
          <TabBar
            tabs={availableTabs}
            active={activeTab}
            onPress={setActiveTab}
            failed={bundle.failed_reports ?? []}
          />
        )}

        {/* Active report */}
        {activeReport ? (
          <ReportView report={activeReport} />
        ) : (
          <View style={styles.errorState}>
            <Ionicons name="alert-circle-outline" size={40} color={colors.textMuted} />
            <Text style={styles.errorTitle}>Report unavailable</Text>
            <Text style={styles.errorBody}>
              The {TAB_LABELS[activeTab].toLowerCase()} report could not be generated. Go back and try again to regenerate all reports.
            </Text>
          </View>
        )}

        {/* Recommender CTA */}
        <Pressable
          style={({ pressed }) => [styles.recommenderCta, pressed && { opacity: 0.75 }]}
          onPress={() => router.push('/recommender')}
        >
          <Ionicons name="fish-outline" size={18} color={colors.sage} />
          <Text style={styles.recommenderCtaText}>
            Want species-specific lure recommendations for these conditions? → Open Recommender
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.sage} />
        </Pressable>

        {/* Footer */}
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={18} color={colors.sage} />
          <Text style={styles.backBtnText}>Back to Conditions</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backBtnInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtnInlineText: { fontSize: 15, color: colors.sage, fontWeight: '600' },
  generatedAt: { fontSize: 12, color: colors.textMuted },

  screenTitle: {
    fontFamily: fonts.serif,
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginBottom: spacing.lg,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: colors.sage },
  tabFailed: { backgroundColor: '#FFF0F0' },
  tabLabel: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  tabLabelActive: { color: '#fff' },
  tabLabelFailed: { color: '#E05252' },

  headlineCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headlineText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  alertIcon: { marginRight: spacing.sm, marginTop: 1 },
  alertText: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  alertBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },

  scoreCard: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  scoreBig: {
    fontFamily: fonts.serif,
    fontSize: 64,
    fontWeight: '700',
    lineHeight: 72,
  },
  scoreOutOf: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: -4,
    marginBottom: spacing.xs,
  },
  scoreRating: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  scoreWaterType: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'capitalize',
  },
  recoveryNote: {
    fontSize: 12,
    color: '#E8A838',
    textAlign: 'center',
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  rawScoreNote: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },

  qualityNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E6',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E8A838',
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  qualityNoticeSevere: { backgroundColor: '#FFF0F0', borderColor: '#E05252' },
  qualityTitle: { fontSize: 12, fontWeight: '600', color: '#E8A838', marginBottom: 2 },
  qualityDetail: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },

  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  breakdownRow: { marginBottom: spacing.sm },
  breakdownLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  breakdownLabel: { fontSize: 12, color: colors.textSecondary, flex: 1 },
  fallbackBadge: {
    fontSize: 10,
    color: '#E8A838',
    fontStyle: 'italic',
    marginRight: spacing.xs,
    marginHorizontal: 4,
  },
  breakdownScore: { fontSize: 12, fontWeight: '600', color: colors.text },
  breakdownBarBg: {
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  breakdownBarFill: { height: '100%', borderRadius: 2 },
  coverageRow: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  coverageLabel: { fontSize: 11, color: colors.textMuted },

  section: { marginBottom: spacing.xl },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  descCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  whyRow: { marginBottom: spacing.sm },
  whyFactor: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 2 },
  whyVal: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },

  timeCard: {
    backgroundColor: colors.sageLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.sage + '40',
  },
  timeCardPrime: {
    backgroundColor: colors.sage + '18',
    borderColor: colors.sage,
  },
  timeCardMuted: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeWindow: { fontSize: 15, fontWeight: '600', color: colors.text },
  timeReasoning: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  timeReasoningMuted: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  labelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgePrime: { backgroundColor: colors.sage },
  badgeGood: { backgroundColor: '#4A9ECC' },
  labelBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff', textTransform: 'uppercase' },

  tipsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm },
  tipIcon: { marginTop: 2 },
  tipText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 22 },

  recommenderCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sageLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.sage + '40',
  },
  recommenderCtaText: { fontSize: 14, color: colors.text, flex: 1 },

  errorStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorState: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorTitle: { fontSize: 18, fontWeight: '600', color: colors.text, textAlign: 'center' },
  errorBody: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.sageLight,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  backBtnPressed: { backgroundColor: colors.sage + '50' },
  backBtnText: { fontSize: 15, fontWeight: '600', color: colors.sage },

  coldStunNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  coldStunNoteText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    flex: 1,
    fontStyle: 'italic',
  },
});
