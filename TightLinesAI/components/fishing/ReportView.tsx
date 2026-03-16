/**
 * ReportView — orchestrates the compact report layout.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../lib/theme';
import type { WaterTypeReport } from '../../lib/howFishing';
import { ScoreCard } from './ScoreCard';
import { AlertBannersFromEngine } from './AlertBanners';
import { BestTimesSection, DecentTimesFromReport, WorstTimesSection } from './TimeWindows';
import { KeyFactorsSection } from './KeyFactors';
import { ScoreBreakdown } from './ScoreBreakdown';
import { TipsSection } from './TipsSection';
import { StrategySection } from './StrategySection';
import { ExpandableSection } from './ExpandableSection';
import { EngineDriversPanel } from './EngineDriversPanel';

function cleanDisplay(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw.replace(/\\u2192/g, '→').replace(/\s+/g, ' ').trim();
}

function cleanSummary(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  const s = cleanDisplay(raw).replace(/^```(?:json)?\s*/gi, '').replace(/\s*```\s*$/gi, '').trim();
  if (s.startsWith('{') && s.endsWith('}')) return '';
  return s;
}

function formatWaterTempDisplay(tempF: number | null): string {
  if (tempF === null || Number.isNaN(tempF)) return 'Unavailable';
  return `${Math.round(tempF * 10) / 10}°F`;
}

function getWaterTempLine(engine: WaterTypeReport['engine']): string | null {
  if (!engine) return null;
  const source = engine.environment.water_temp_source;
  const temp = engine.environment.water_temp_f;
  if (temp === null) return null;
  if (source === 'user_manual') return `${formatWaterTempDisplay(temp)} (manual entry)`;
  const isMeasured = source === 'noaa_coops';
  return `${formatWaterTempDisplay(temp)} ${isMeasured ? '(measured)' : '(estimated from air history)'}`;
}

function getTopLine(report: WaterTypeReport): string {
  const summary = cleanSummary(report.llm?.headline_summary ?? '');
  if (summary) return summary;
  const rating = report.engine?.scoring?.overall_rating;
  if (!rating) return 'Conditions are loading into place.';
  return `${rating} overall fishing conditions today.`;
}

interface ReportViewProps {
  report: WaterTypeReport;
}

export function ReportView({ report }: ReportViewProps) {
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
            ? 'AI analysis temporarily unavailable. Please try again.'
            : 'This report could not be generated. Please try again.'}
        </Text>
      </View>
    );
  }

  const { engine, llm } = report;
  const summary = getTopLine(report);

  return (
    <View>
      <View style={styles.headlineCard}>
        <Text style={styles.kicker}>Today's read</Text>
        <Text style={styles.headlineText}>{cleanDisplay(summary)}</Text>
      </View>

      <AlertBannersFromEngine alerts={engine.alerts} />

      <ScoreCard scoring={engine.scoring} waterType={report.water_type} waterTempLine={getWaterTempLine(engine)} environmentMode={engine.v2_environment_mode} />

      <View style={styles.quickSection}>
        <BestTimesSection windows={llm.best_times_to_fish_today} timezone={engine.location?.timezone} />
        <DecentTimesFromReport llmDecent={llm.decent_times_today} engineFair={engine.fair_windows} timezone={engine.location?.timezone} />
        <WorstTimesSection windows={llm.worst_times_to_fish_today} timezone={engine.location?.timezone} />
      </View>

      {llm.strategy ? <StrategySection strategy={llm.strategy} /> : null}
      <TipsSection tips={(llm.tips_for_today ?? []).map(cleanDisplay).filter(Boolean)} />

      <ExpandableSection title="Why today looks this way" subtitle="Top conditions driving the score and the bite windows." defaultExpanded={false}>
        <KeyFactorsSection factors={llm.key_factors} embedded />
      </ExpandableSection>

      <ExpandableSection title="Detailed breakdown" subtitle="Variable-by-variable contribution from the deterministic engine." defaultExpanded={false}>
        <EngineDriversPanel engine={engine} />
        {Object.keys(engine.scoring.components).length > 0 ? (
          <ScoreBreakdown scoring={engine.scoring} embedded />
        ) : null}
      </ExpandableSection>

    </View>
  );
}

const styles = StyleSheet.create({
  headlineCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  headlineText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 23,
  },
  quickSection: {
    marginBottom: 0,
  },
  errorState: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorTitle: { fontSize: 18, fontWeight: '600', color: colors.text, textAlign: 'center' },
  errorBody: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
