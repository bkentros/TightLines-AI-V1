import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

const COOLDOWN_SECONDS = 60;

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email: paramEmail } = useLocalSearchParams<{ email?: string }>();
  const { user, signOut } = useAuthStore();
  // Prefer route param (set by sign-up), fall back to store user email
  const emailToShow = paramEmail ?? user?.email ?? '';
  const [resending, setResending] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (!emailToShow || cooldown > 0) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailToShow,
        options: { emailRedirectTo: 'tightlinesai://auth/confirm' },
      });
      if (error) {
        Alert.alert('Could not resend', error.message);
      } else {
        setJustSent(true);
        startCooldown();
      }
    } finally {
      setResending(false);
    }
  };

  const handleBack = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  const buttonDisabled = resending || cooldown > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>

        {/* Back to sign in */}
        <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
          <Text style={styles.backText}>Back to Sign In</Text>
        </Pressable>

        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <Ionicons name="mail-outline" size={48} color={colors.sage} />
          </View>

          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.body}>
            We sent a confirmation link to{'\n'}
            <Text style={styles.email}>{emailToShow || 'your email'}</Text>.
            {'\n\n'}
            Tap the link to verify your account — it will open the app automatically.
          </Text>

          <View style={styles.tip}>
            <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.tipText}>
              Don't see it? Check your spam or junk folder.
            </Text>
          </View>

          {/* Resend button */}
          <Pressable
            style={({ pressed }) => [
              styles.resendBtn,
              justSent && styles.resendBtnSent,
              pressed && !buttonDisabled && styles.resendBtnPressed,
              buttonDisabled && styles.btnDisabled,
            ]}
            onPress={handleResend}
            disabled={buttonDisabled}
          >
            {justSent && cooldown > 0 ? (
              <View style={styles.resendInner}>
                <Ionicons name="checkmark-circle" size={16} color={colors.sage} />
                <Text style={styles.resendTextSent}>
                  Sent — resend in {cooldown}s
                </Text>
              </View>
            ) : (
              <Text style={styles.resendText}>
                {resending ? 'Sending…' : 'Resend verification email'}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    gap: 2,
    alignSelf: 'flex-start',
  },
  backText: { fontSize: 15, color: colors.text, fontWeight: '500' },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    minWidth: 220,
    alignItems: 'center',
  },
  resendBtnSent: {
    borderColor: colors.sage,
    backgroundColor: colors.sageLight,
  },
  resendBtnPressed: { backgroundColor: colors.sageLight },
  btnDisabled: { opacity: 0.6 },
  resendInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resendText: { fontSize: 14, fontWeight: '600', color: colors.sage },
  resendTextSent: { fontSize: 14, fontWeight: '600', color: colors.sageDark },
});
