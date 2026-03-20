/**
 * CondensedLoadingView — compact conditions grid for the How's Fishing preflight screen.
 * Premium, calm design with soft tiles and subtle animations.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';

interface ConditionsData {
  air_temp_f?: number | null;
  wind_speed_mph?: number | null;
  wind_direction?: string | null;
  pressure_mb?: number | null;
  pressure_state?: string | null;
  cloud_cover_pct?: number | null;
  moon_phase?: string | null;
  moon_illumination_pct?: number | null;
  light_condition?: string | null;
  tide_phase_state?: string | null;
  tide_strength_state?: string | null;
  solunar_state?: string | null;
}

interface CondensedLoadingViewProps {
  conditions: ConditionsData | null;
  statusText?: string;
}

interface TileProps {
  icon: string;
  label: string;
  value: string;
  subValue?: string;
}

function Tile({ icon, label, value, subValue }: TileProps) {
  return (
    <View style={styles.tile}>
      <Ionicons name={icon as any} size={16} color={colors.primary} style={styles.tileIcon} />
      <Text style={styles.tileValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.tileLabel} numberOfLines={1}>{label}</Text>
      {subValue ? <Text style={styles.tileSub} numberOfLines={1}>{subValue}</Text> : null}
    </View>
  );
}

function formatTemp(temp: number | null | undefined): string {
  if (temp == null) return '--';
  return `${Math.round(temp)}\u00B0F`;
}

function formatWind(speed: number | null | undefined, dir: string | null | undefined): string {
  if (speed == null) return '--';
  const d = dir ?? '';
  return `${Math.round(speed)} mph ${d}`.trim();
}

function formatPressure(mb: number | null | undefined): string {
  if (mb == null) return '--';
  return `${mb.toFixed(1)} mb`;
}

function formatPressureState(state: string | null | undefined): string {
  if (!state) return '';
  return state.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatSky(pct: number | null | undefined): string {
  if (pct == null) return '--';
  if (pct < 20) return 'Clear';
  if (pct < 50) return 'Partly Cloudy';
  if (pct < 80) return 'Mostly Cloudy';
  return 'Overcast';
}

function formatMoon(phase: string | null | undefined, illum: number | null | undefined): string {
  if (!phase) return '--';
  const label = phase.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  if (illum != null) return `${label} ${Math.round(illum)}%`;
  return label;
}

function formatLight(lc: string | null | undefined): string {
  if (!lc) return '--';
  return lc.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatTide(phase: string | null | undefined): string {
  if (!phase) return '--';
  return phase.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatSolunar(state: string | null | undefined): string {
  if (!state) return '--';
  return state.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function CondensedLoadingView({ conditions, statusText }: CondensedLoadingViewProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const c = conditions;
  const hasTide = c?.tide_phase_state != null;

  return (
    <View style={styles.container}>
      {/* Status Header */}
      <View style={styles.statusRow}>
        <View style={styles.statusDot} />
        <Text style={styles.statusLabel}>{statusText ?? 'Current Conditions'}</Text>
      </View>

      {/* Row 1 */}
      <View style={styles.row}>
        <Tile icon="thermometer-outline" label="Temp" value={formatTemp(c?.air_temp_f)} />
        <Tile icon="flag-outline" label="Wind" value={formatWind(c?.wind_speed_mph, c?.wind_direction)} />
        <Tile icon="speedometer-outline" label="Pressure" value={formatPressure(c?.pressure_mb)} subValue={formatPressureState(c?.pressure_state)} />
        <Tile icon="cloud-outline" label="Sky" value={formatSky(c?.cloud_cover_pct)} />
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        <Tile icon="moon-outline" label="Moon" value={formatMoon(c?.moon_phase, c?.moon_illumination_pct)} />
        <Tile icon="sunny-outline" label="Light" value={formatLight(c?.light_condition)} />
        {hasTide ? (
          <Tile icon="water-outline" label="Tide" value={formatTide(c?.tide_phase_state)} />
        ) : (
          <Tile icon="pulse-outline" label="Solunar" value={formatSolunar(c?.solunar_state)} />
        )}
        {hasTide ? (
          <Tile icon="pulse-outline" label="Solunar" value={formatSolunar(c?.solunar_state)} />
        ) : (
          <View style={styles.tile} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: spacing.sm,
    alignItems: 'center',
    minHeight: 72,
    justifyContent: 'center',
  },
  tileIcon: {
    marginBottom: 3,
  },
  tileValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  tileLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 1,
  },
  tileSub: {
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
