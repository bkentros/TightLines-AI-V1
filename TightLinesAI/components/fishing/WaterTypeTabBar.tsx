/**
 * WaterTypeTabBar — tab bar for switching between water type reports.
 * Extracted from how-fishing-results.tsx for reuse.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../lib/theme';

const TAB_LABELS: Record<string, string> = {
  freshwater: 'Freshwater',
  freshwater_lake: 'Lake',
  freshwater_river: 'River',
  saltwater: 'Saltwater',
  brackish: 'Brackish',
};

interface WaterTypeTabBarProps {
  tabs: string[];
  active: string;
  onPress: (tab: string) => void;
  failed: string[];
}

export function WaterTypeTabBar({ tabs, active, onPress, failed }: WaterTypeTabBarProps) {
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
              {isFailed && <Ionicons name="warning-outline" size={13} color="#E05252" />}
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                  isFailed && styles.tabLabelFailed,
                ]}
              >
                {TAB_LABELS[t] ?? t}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export { TAB_LABELS };

const styles = StyleSheet.create({
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
});
