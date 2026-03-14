/**
 * CondensedLoadingView — compact conditions display shown during analysis loading.
 * Shows all key environmental data in a 2-row grid with a pulsing loading animation.
 * Replaces the 8 full-bleed condition cards from the old how-fishing screen.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Tile helper
// ---------------------------------------------------------------------------

interface TileProps {
  icon: string;
  label: string;
  value: string;
  subValue?: string;
}

function Tile({ icon, label, value, subValue }: TileProps) {
  return (
    <View style={styles.tile}>
      <Ionicons name={icon as any} size={18} color={colors.sage} style={styles.tileIcon} />
      <Text style={styles.tileValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.tileLabel} numberOfLines={1}>{label}</Text>
      {subValue ? <Text style={styles.tileSub} numberOfLines={1}>{subValue}</Text> : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CondensedLoadingView({ conditions, statusText }: CondensedLoadingViewProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
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
      <Text style={styles.title}>Current Conditions</Text>

      {/* Row 1: Temp, Wind, Pressure, Sky */}
      <View style={styles.row}>
        <Tile icon="thermometer-outline" label="Temp" value={formatTemp(c?.air_temp_f)} />
        <Tile icon="flag-outline" label="Wind" value={formatWind(c?.wind_speed_mph, c?.wind_direction)} />
        <Tile icon="speedometer-outline" label="Pressure" value={formatPressure(c?.pressure_mb)} subValue={formatPressureState(c?.pressure_state)} />
        <Tile icon="cloud-outline" label="Sky" value={formatSky(c?.cloud_cover_pct)} />
      </View>

      {/* Row 2: Moon, Light, Tide/Solunar */}
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

      {/* Loading animation */}
      <View style={styles.loadingSection}>
        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons name="fish-outline" size={28} color={colors.sage} />
        </Animated.View>
        <Text style={styles.statusText}>{statusText ?? 'Analyzing conditions...'}</Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    alignItems: 'center',
    minHeight: 72,
    justifyContent: 'center',
  },
  tileIcon: {
    marginBottom: 2,
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
  loadingSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  pulseCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.sageLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.sage + '40',
  },
  statusText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
