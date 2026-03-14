/**
 * ReportView — orchestrator component that composes all report sub-components.
 * Renders the full analysis for a single water type report.
 * Extracted from how-fishing-results.tsx for reuse.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../lib/theme';
import type { WaterTypeReport } from '../../lib/howFishing';
import { ScoreCard } from './ScoreCard';
import { AlertBannersFromEngine } from './AlertBanners';
import { DataQualityNotice } from './DataQualityNotice';
import { BestTimesSection, DecentTimesFromReport, WorstTimesSection } from './TimeWindows';
import { KeyFactorsSection } from './KeyFactors';
import { ScoreBreakdown } from './ScoreBreakdown';
import { TipsSection } from './TipsSection';
import { StrategySection } from './StrategySection';

function cleanSummary(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  const s = raw.trim().replace(/^```(?:json)?\s*/gi, '').replace(/\s*```\s*$/gi, '').trim();
  if (s.startsWith('{') && s.endsWith('}')) return '';
  return s;
}

function formatWaterTempDisplay(tempF: number | null): string {
  if (tempF === null || Number.isNaN(tempF)) return 'Unavailable';
  return `${Math.round(tempF * 10) / 10}\u00B0F`;
}

function getWaterTempLine(engine: WaterTypeReport['engine']): string | null {
  if (!engine) return null;
  const source = engine.environment.water_temp_source;
  const temp = engine.environment.water_temp_f;
  if (temp === null) return null;
  const isMeasured = source === 'noaa_coops';
  return `${formatWaterTempDisplay(temp)} ${isMeasured ? '(measured)' : '(estimated from air history)'}`;
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
            ? 'AI analysis temporarily unavailable. Please go back and try again.'
            : 'This report could not be generated. Please go back and try again.'}
        </Text>
      </View>
    );
  }

  const { engine, llm } = report;
  const summary = cleanSummary(llm.headline_summary);

  return (
    <View>
      {/* Headline */}
      {summary ? (
        <View style={styles.headlineCard}>
          <Text style={styles.headlineText}>{summary}</Text>
        </View>
      ) : null}

      {/* Alert Banners */}
      <AlertBannersFromEngine alerts={engine.alerts} />

      {/* Score Card */}
      <ScoreCard
        scoring={engine.scoring}
        waterType={report.water_type}
        waterTempLine={getWaterTempLine(engine)}
      />

      {/* Data Quality */}
      <DataQualityNotice
        quality={engine.data_quality}
        tier={engine.scoring.reliability_tier}
        hideWaterTempFallbackOnly
      />

      {/* Time Windows */}
      <BestTimesSection windows={llm.best_times_to_fish_today} />
      <DecentTimesFromReport
        llmDecent={llm.decent_times_today}
        engineFair={engine.fair_windows}
      />
      <WorstTimesSection windows={llm.worst_times_to_fish_today} />

      {/* Key Factors */}
      <KeyFactorsSection factors={llm.key_factors} />

      {/* Score Breakdown */}
      <ScoreBreakdown scoring={engine.scoring} />

      {/* Strategy — Your Game Plan */}
      {llm.strategy ? <StrategySection strategy={llm.strategy} /> : null}

      {/* Tips */}
      <TipsSection tips={llm.tips_for_today} />
    </View>
  );
}

const styles = StyleSheet.create({
  headlineCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
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
  errorState: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorTitle: { fontSize: 18, fontWeight: '600', color: colors.text, textAlign: 'center' },
  errorBody: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
