/**
 * Subscribe Prompt — shown when unsubscribed user taps a gated feature
 *
 * Generic locked-feature message with View plans CTA.
 * Reusable for How's Fishing, Recommender, Water Reader, etc.
 */

import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../lib/theme';

export interface SubscribePromptProps {
  visible: boolean;
  onDismiss: () => void;
  onViewPlans?: () => void;
}

export function SubscribePrompt({
  visible,
  onDismiss,
  onViewPlans,
}: SubscribePromptProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Pressable
            style={styles.closeBtn}
            onPress={onDismiss}
            hitSlop={12}
          >
            <Ionicons name="close" size={22} color={colors.textMuted} />
          </Pressable>
          <Ionicons name="lock-closed" size={40} color={colors.sage} style={styles.icon} />
          <Text style={styles.title}>Unlock this feature</Text>
          <Text style={styles.message}>
            Get full fishing reads, tackle picks, and planning tools built for your water.
          </Text>
          {onViewPlans && (
            <Pressable
              style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
              onPress={onViewPlans}
            >
              <Text style={styles.ctaText}>View plans</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.textLight} />
            </Pressable>
          )}
          <Pressable
            style={({ pressed }) => [styles.dismiss, pressed && styles.dismissPressed]}
            onPress={onDismiss}
          >
            <Text style={styles.dismissText}>Maybe later</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sage,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  ctaPressed: { backgroundColor: colors.sageDark, opacity: 1 },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  dismiss: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  dismissPressed: { opacity: 0.7 },
  dismissText: {
    fontSize: 15,
    color: colors.textMuted,
  },
});
