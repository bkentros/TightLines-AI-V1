/**
 * AlertBanners — severity-coded alert banners for fishing conditions.
 * Extracted from how-fishing-results.tsx for reuse.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../lib/theme';
import type { EngineAlerts } from '../../lib/howFishing';

interface AlertBannerProps {
  title: string;
  body: string;
  severity: 'critical' | 'warning' | 'info';
}

const SEVERITY_MAP = {
  critical: { bg: '#FFF0F0', border: '#E05252', icon: 'warning' as const, color: '#E05252' },
  warning: { bg: '#FFF8E6', border: '#E8A838', icon: 'alert-circle' as const, color: '#E8A838' },
  info: { bg: '#E8F4FD', border: '#4A9ECC', icon: 'information-circle' as const, color: '#4A9ECC' },
} as const;

export function AlertBanner({ title, body, severity }: AlertBannerProps) {
  const s = SEVERITY_MAP[severity];
  return (
    <View style={[styles.alertBanner, { backgroundColor: s.bg, borderColor: s.border }]}>
      <Ionicons name={s.icon} size={20} color={s.color} style={styles.alertIcon} />
      <View style={styles.alertText}>
        <Text style={[styles.alertTitle, { color: s.color }]}>{title}</Text>
        <Text style={styles.alertBody}>{body}</Text>
      </View>
    </View>
  );
}

/** Renders all relevant alert banners from engine alerts in priority order. */
export function AlertBannersFromEngine({ alerts }: { alerts: EngineAlerts }) {
  return (
    <>
      {alerts.severe_weather_alert && (
        <AlertBanner
          title="Severe Conditions Warning"
          body={
            (alerts.severe_weather_reasons ?? []).length > 0
              ? (alerts.severe_weather_reasons ?? []).join('. ') + '. Use caution before heading out.'
              : 'Severe weather conditions detected. Use caution before heading out.'
          }
          severity="critical"
        />
      )}
      {alerts.cold_stun_alert && (
        <AlertBanner
          title="Cold Stun Alert"
          body="Water temps have dropped sharply. Fish are barely moving \u2014 extremely slow bite expected."
          severity="critical"
        />
      )}
      {alerts.salinity_disruption_alert && (
        <AlertBanner
          title="Salinity Disruption"
          body="Recent heavy rain has diluted saltwater in this area. Fish may have moved out to find normal salinity."
          severity="critical"
        />
      )}
      {alerts.rapid_cooling_alert && (
        <AlertBanner
          title="Temperatures Dropping Fast"
          body="Air temps are falling quickly. Fish may feed aggressively right now before conditions change \u2014 get out while you can."
          severity="warning"
        />
      )}
      {alerts.recovery_active && !alerts.cold_stun_alert && alerts.front_label && (
        <AlertBanner
          title="Cold Front Notice"
          body={alerts.front_label}
          severity="info"
        />
      )}
      {!alerts.cold_stun_alert && alerts.cold_stun_status === 'not_evaluable_missing_inputs' && (
        <View style={styles.coldStunNote}>
          <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} style={{ marginRight: 5 }} />
          <Text style={styles.coldStunNoteText}>
            Cold stun check skipped \u2014 not enough water temperature history yet for this station.
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
