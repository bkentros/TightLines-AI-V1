/**
 * TimingTiles — shared timing period display.
 * Used by both How's Fishing report and the Recommender.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';

export type PeriodSlot = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  highlighted: boolean;
};

export const PERIOD_PRESETS: Record<string, boolean[]> = {
  early_late_low_light:    [true,  false, false, true],
  warmest_part_may_help:   [false, false, true,  false],
  cooler_low_light_better: [true,  true,  false, true],
  moving_water_periods:    [true,  true,  true,  true],
};

export const PERIOD_DEFS: { label: string; icon: keyof typeof Ionicons.glyphMap; subLabel: string }[] = [
  { label: 'Dawn',      subLabel: '5–7am',   icon: 'partly-sunny-outline' },
  { label: 'Morning',   subLabel: '7–11am',  icon: 'sunny-outline' },
  { label: 'Afternoon', subLabel: '11–5pm',   icon: 'sunny' },
  { label: 'Evening',   subLabel: '5–9pm',   icon: 'moon-outline' },
];

/**
 * Resolve timing periods from highlighted_periods flags (boolean[4]).
 * Returns null if no timing edge (all false or missing).
 */
export function resolveTimingPeriods(highlightedPeriods?: [boolean, boolean, boolean, boolean] | boolean[]): PeriodSlot[] | null {
  if (!highlightedPeriods || highlightedPeriods.length !== 4) return null;
  if (highlightedPeriods.every((p: boolean) => !p)) return null;
  return PERIOD_DEFS.map((p, i) => ({ label: p.label, icon: p.icon, highlighted: highlightedPeriods[i] }));
}

/**
 * Resolve timing periods from a daypart_preset string (legacy path).
 */
export function resolveTimingFromPreset(preset: string | null | undefined): PeriodSlot[] | null {
  if (!preset || preset === 'no_timing_edge') return null;
  const flags = PERIOD_PRESETS[preset];
  if (!flags) return null;
  return PERIOD_DEFS.map((p, i) => ({ label: p.label, icon: p.icon, highlighted: flags[i] }));
}

export function TimingTile({ label, icon, highlighted, subLabel }: {
  label: string; icon: keyof typeof Ionicons.glyphMap;
  highlighted: boolean; subLabel: string;
}) {
  return (
    <View style={[
      styles.tile,
      highlighted ? styles.tileActive : styles.tileInactive,
    ]}>
      <View style={[
        styles.iconWrap,
        highlighted ? styles.iconWrapActive : styles.iconWrapInactive,
      ]}>
        <Ionicons
          name={icon}
          size={20}
          color={highlighted ? '#C29B2A' : colors.textMuted}
        />
      </View>
      <Text style={[styles.tileLabel, highlighted && styles.tileLabelActive]}>
        {label}
      </Text>
      <Text style={styles.tileSubLabel}>{subLabel}</Text>
    </View>
  );
}

export function TimingTilesRow({ periods }: { periods: PeriodSlot[] }) {
  return (
    <View style={styles.row}>
      {PERIOD_DEFS.map((def, i) => {
        const slot = periods[i];
        return (
          <TimingTile
            key={def.label}
            label={def.label}
            icon={def.icon}
            highlighted={slot?.highlighted ?? false}
            subLabel={def.subLabel}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
  },
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
