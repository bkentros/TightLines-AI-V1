/**
 * Subscribe / Plans screen — placeholder for RevenueCat integration
 *
 * V1: Minimal placeholder. RevenueCat subscription UI will be integrated in Monetization phase.
 */

import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../lib/theme';

export default function SubscribeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Subscribe</Text>
        <Text style={styles.message}>
          Plans and subscription management coming soon. Angler ($9.99/mo) and Master Angler ($14.99/mo) will be available here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.lg },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.text,
    marginBottom: spacing.md,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
