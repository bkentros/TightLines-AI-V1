/**
 * Tab bar — FinFindr paper chrome.
 *
 * Warm paper background, 1.5px ink top rule, uppercase DM Sans labels with
 * the FinFindr editorial letter-spacing, and a small forest underline rule
 * under the active tab so the active state reads without fighting the
 * Home / report / recommender screens above.
 *
 * Behavior-only pass: nothing about routing, protected routes, or tab
 * configuration changed — only styling + a thin wrapper around each icon
 * to render the active indicator.
 */

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';

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
        size={22}
        color={color}
      />
      <View
        style={[
          styles.activeRule,
          focused && styles.activeRuleActive,
        ]}
      />
    </View>
  );
}

function TabLabel({ label, color, focused }: {
  label: string;
  color: string;
  focused: boolean;
}) {
  return (
    <Text
      style={[
        styles.tabLabel,
        { color },
        focused && styles.tabLabelFocused,
      ]}
    >
      {label}
    </Text>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  // 58px bar body + safe-area inset — a hair taller than the old 52 to give
  // the FinFindr letter-spacing on labels room to breathe.
  const tabBarHeight = 58 + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: paper.forest,
        tabBarInactiveTintColor: 'rgba(28,36,25,0.55)',
        tabBarStyle: [
          styles.tabBar,
          { height: tabBarHeight, paddingBottom: insets.bottom },
        ],
        tabBarItemStyle: styles.tabItem,
        // Label handled manually via tabBarLabel so we control the
        // Fraunces/DM Sans mix exactly the way the rest of the paper
        // system does.
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
    backgroundColor: paper.paper,
    borderTopColor: paper.ink,
    borderTopWidth: 1.5,
    // Paper system does not use drop shadows on the footer; it uses the
    // ink rule to separate from content above.
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
  // Small forest-green rule shown under the active tab's icon. Inactive
  // tabs render an invisible spacer of the same height so icons don't
  // jump on focus change.
  activeRule: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'transparent',
    marginTop: 2,
  },
  activeRuleActive: {
    backgroundColor: paper.forest,
  },
  tabLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    letterSpacing: 2.2,
    marginTop: paperSpacing.xs - 2,
  },
  tabLabelFocused: {
    color: paper.forest,
  },
});
