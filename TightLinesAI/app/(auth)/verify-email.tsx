import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export default function VerifyEmailScreen() {
  const [resending, setResending] = useState(false);
  const { user } = useAuthStore();

  const handleResend = async () => {
    if (!user?.email) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      if (error) {
        Alert.alert('Could not resend', error.message);
      } else {
        Alert.alert('Email sent', 'Check your inbox again.');
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Ionicons name="mail-outline" size={48} color={colors.sage} />
        </View>

        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.body}>
          We sent a confirmation link to{' '}
          <Text style={styles.email}>{user?.email ?? 'your email'}</Text>.{'\n\n'}
          Tap the link to verify your account, then come back and sign in.
        </Text>

        <View style={styles.tip}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.tipText}>
            Don't see it? Check your spam or junk folder.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.resendBtn,
            pressed && styles.resendBtnPressed,
            resending && styles.btnDisabled,
          ]}
          onPress={handleResend}
          disabled={resending}
        >
          <Text style={styles.resendText}>
            {resending ? 'Sending…' : 'Resend verification email'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.sageLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: spacing.xl,
  },
  email: { fontWeight: '600', color: colors.text },

  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    width: '100%',
  },
  tipText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 19,
  },

  resendBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.sage,
  },
  resendBtnPressed: { backgroundColor: colors.sageLight },
  btnDisabled: { opacity: 0.6 },
  resendText: { fontSize: 14, fontWeight: '600', color: colors.sage },
});
