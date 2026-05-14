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

import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { paper } from '../../lib/theme';

const MONO_BOLD = 'JetBrainsMono_600SemiBold';
const SMART_LOG_ENABLED = false;

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
  subtitle,
  color,
  focused,
}: {
  label: string;
  subtitle?: string;
  color: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabLabelWrap}>
      <Text
        style={[styles.tabLabel, { color }, focused && styles.tabLabelFocused]}
      >
        {label}
      </Text>
      {subtitle ? (
        <Text style={[styles.tabSubtitle, { color }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export default function TabLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;

  return (
    <SmartLogGateProvider
      tabBarHeight={tabBarHeight}
      onFeedback={() => router.push({
        pathname: '/support',
        params: {
          topic: 'smart_log',
          featureName: 'Smart Log',
          contextLines: JSON.stringify(['Feature: Smart Log', 'Source: tab gate']),
        },
      })}
    />
  );
}

function SmartLogGateProvider({
  tabBarHeight,
  onFeedback,
}: {
  tabBarHeight: number;
  onFeedback: () => void;
}) {
  const [smartLogModalOpen, setSmartLogModalOpen] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: paper.dashboardInk,
          tabBarInactiveTintColor: paper.dashboardMuted,
          tabBarStyle: [
            styles.tabBar,
            { height: tabBarHeight, paddingBottom: tabBarHeight - 60 },
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
          listeners={{
            tabPress: (event) => {
              if (SMART_LOG_ENABLED) return;
              event.preventDefault();
              setSmartLogModalOpen(true);
            },
          }}
          options={{
            title: 'Smart Log',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="book-outline"
                iconNameActive="book"
                color={color}
                focused={focused}
              />
            ),
            tabBarLabel: ({ color, focused }) => (
              <TabLabel
                label="SMART LOG"
                subtitle={SMART_LOG_ENABLED ? undefined : '(COMING SOON)'}
                color={color}
                focused={focused}
              />
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

      <Modal
        visible={smartLogModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSmartLogModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setSmartLogModalOpen(false)}
          />
          <View style={styles.smartLogModal}>
            <View style={styles.smartLogIcon}>
              <Ionicons name="book-outline" size={20} color={paper.dashboardBlue} />
            </View>
            <Text style={styles.modalEyebrow}>SMART LOG</Text>
            <Text style={styles.modalTitle}>Coming soon.</Text>
            <Text style={styles.modalCopy}>
              Trip logging is still being tuned before it joins the main tab bar.
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [styles.modalSecondaryBtn, pressed && styles.modalBtnPressed]}
                onPress={() => setSmartLogModalOpen(false)}
              >
                <Text style={styles.modalSecondaryText}>CLOSE</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.modalPrimaryBtn, pressed && styles.modalBtnPressed]}
                onPress={() => {
                  setSmartLogModalOpen(false);
                  onFeedback();
                }}
              >
                <Text style={styles.modalPrimaryText}>SEND IDEA</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  tabLabelWrap: {
    alignItems: 'center',
    justifyContent: 'center',
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
  tabSubtitle: {
    fontFamily: MONO_BOLD,
    fontSize: 6.5,
    letterSpacing: 0.8,
    marginTop: 1,
    opacity: 0.72,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10,27,46,0.45)',
    padding: 24,
  },
  smartLogModal: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    padding: 18,
    alignItems: 'center',
  },
  smartLogIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F9FB',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    marginBottom: 10,
  },
  modalEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 10,
    letterSpacing: 2,
    color: paper.dashboardBlue,
  },
  modalTitle: {
    marginTop: 4,
    fontFamily: 'Fraunces_700Bold',
    fontSize: 30,
    color: paper.dashboardInk,
    letterSpacing: 0,
  },
  modalCopy: {
    marginTop: 6,
    fontFamily: 'Fraunces_500Medium_Italic',
    fontSize: 14,
    lineHeight: 20,
    color: paper.dashboardInk,
    opacity: 0.72,
    textAlign: 'center',
  },
  modalActions: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  modalSecondaryBtn: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    paddingVertical: 11,
  },
  modalPrimaryBtn: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    backgroundColor: paper.dashboardInk,
    borderRadius: 12,
    paddingVertical: 11,
  },
  modalBtnPressed: { opacity: 0.85 },
  modalSecondaryText: {
    fontFamily: MONO_BOLD,
    fontSize: 10,
    letterSpacing: 1.8,
    color: paper.dashboardInk,
  },
  modalPrimaryText: {
    fontFamily: MONO_BOLD,
    fontSize: 10,
    letterSpacing: 1.8,
    color: '#FFFFFF',
  },
});
