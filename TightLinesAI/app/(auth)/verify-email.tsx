/**
 * Verify-email screen — FinFindr paper language.
 *
 * Behavior preserved exactly:
 *   - 60-second resend cooldown
 *   - deep-link redirect target (`tightlinesai://auth/confirm`) untouched
 *     so existing email templates still open the app correctly
 *   - back button still signs the user out before routing to sign-in
 */

import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperRadius,
  paperSpacing,
} from '../../lib/theme';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { PaperBackground } from '../../components/paper';
import {
  AuthBackButton,
  AuthStatusCard,
  AuthTip,
} from '../../components/paper/auth';

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
    <PaperBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <AuthBackButton onPress={handleBack} label="BACK TO SIGN IN" />

          <View style={styles.content}>
            <AuthStatusCard iconName="mail-outline" title="Check your email">
              <Text style={styles.body}>
                We sent a confirmation link to{'\n'}
                <Text style={styles.email}>{emailToShow || 'your email'}</Text>.
              </Text>
              <Text style={styles.bodyMuted}>
                Tap the link to verify your account — it will open the app
                automatically.
              </Text>
            </AuthStatusCard>

            <AuthTip>Don't see it? Check your spam or junk folder.</AuthTip>

            <Pressable
              style={({ pressed }) => [
                styles.resendBtn,
                justSent && styles.resendBtnSent,
                pressed && !buttonDisabled && styles.resendBtnPressed,
                buttonDisabled && styles.resendBtnDisabled,
              ]}
              onPress={handleResend}
              disabled={buttonDisabled}
            >
              {justSent && cooldown > 0 ? (
                <View style={styles.resendInner}>
                  <Ionicons name="checkmark-circle" size={16} color={paper.forest} />
                  <Text style={styles.resendTextSent}>
                    SENT — RESEND IN {cooldown}S
                  </Text>
                </View>
              ) : (
                <Text style={styles.resendText}>
                  {resending ? 'SENDING…' : 'RESEND VERIFICATION EMAIL'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.xl + paperSpacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: paperSpacing.md,
  },
  body: {
    fontFamily: paperFonts.body,
    fontSize: 14,
    color: paper.ink,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: paperSpacing.xs,
  },
  bodyMuted: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13.5,
    color: paper.ink,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: paperSpacing.xs,
  },
  email: {
    fontFamily: paperFonts.bodyBold,
    color: paper.forest,
    opacity: 1,
  },

  resendBtn: {
    paddingVertical: paperSpacing.md - 2,
    paddingHorizontal: paperSpacing.lg,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    backgroundColor: paper.paperLight,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 260,
  },
  resendBtnSent: {
    backgroundColor: paper.paperLight,
    borderColor: paper.forest,
  },
  resendBtnPressed: {
    backgroundColor: paper.paperDark,
  },
  resendBtnDisabled: {
    opacity: 0.55,
  },
  resendInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs + 2,
  },
  resendText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.forest,
    letterSpacing: 2.4,
  },
  resendTextSent: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.forest,
    letterSpacing: 2.4,
  },
});
