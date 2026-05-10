/**
 * Tab bar — FinFindr field-edition chrome.
 *
 * White card body sitting on the cream canvas, hairline ink rule on top,
 * JetBrains Mono uppercase labels with wide letter-spacing, and a small
 * navy underline rule under the active tab's icon. Matches the May 2026
 * dashboard redesign — inactive tabs use the same dashboard muted gray,
 * the active tab uses the dashboard navy ink, and there are no drop
 * shadows or rounded chrome.
 */

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { paper } from '../../lib/theme';

const MONO_BOLD = 'JetBrainsMono_600SemiBold';

function TabIcon({
  iconName,
  iconNameActive,
  color,
  focused,
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  iconNameActive: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabIconWrap}>
      <Ionicons
        name={focused ? iconNameActive : iconName}
        size={20}
        color={color}
      />
      <View style={[styles.activeRule, focused && styles.activeRuleActive]} />
    </View>
  );
}

function TabLabel({
  label,
  color,
  focused,
}: {
  label: string;
  color: string;
  focused: boolean;
}) {
  return (
    <Text
      style={[styles.tabLabel, { color }, focused && styles.tabLabelFocused]}
    >
      {label}
    </Text>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: paper.dashboardInk,
        tabBarInactiveTintColor: paper.dashboardMuted,
        tabBarStyle: [
          styles.tabBar,
          { height: tabBarHeight, paddingBottom: insets.bottom },
        ],
        tabBarItemStyle: styles.tabItem,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              iconName="compass-outline"
              iconNameActive="compass"
              color={color}
              focused={focused}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel label="HOME" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Log',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              iconName="book-outline"
              iconNameActive="book"
              color={color}
              focused={focused}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel label="LOG" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              iconName="settings-outline"
              iconNameActive="settings"
              color={color}
              focused={focused}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel label="SETTINGS" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: paper.dashboardWhite,
    borderTopColor: paper.dashboardLine,
    borderTopWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
    paddingTop: 6,
  },
  tabItem: {
    paddingTop: 2,
  },
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  activeRule: {
    width: 18,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: 'transparent',
    marginTop: 2,
  },
  activeRuleActive: {
    backgroundColor: paper.dashboardInk,
  },
  tabLabel: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 2,
  },
  tabLabelFocused: {
    color: paper.dashboardInk,
  },
});
