/**
 * Forgot-password screen — FinFindr dashboard language.
 *
 * Visual migration only. The reset-email flow (including the
 * `getPasswordResetEmailRedirectUrl()` (https bridge recommended for email clients).
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import { getPasswordResetEmailRedirectUrl } from '../../lib/authEmailRedirect';
import { supabase } from '../../lib/supabase';
import {
  AuthBackButton,
  AuthField,
  AuthFooterStamp,
  AuthHeader,
  AuthNotice,
  AuthPrimaryButton,
  AuthSecondaryButton,
  AuthStatusCard,
  AuthTip,
} from '../../components/paper/auth';

type Notice = { title: string; message?: string; tone?: 'info' | 'success' | 'error' };

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const handleSend = async () => {
    const trimmed = email.trim().toLowerCase();
    setNotice(null);
    if (!trimmed) {
      setNotice({
        title: 'Email required',
        message: 'Please enter your email address.',
        tone: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: getPasswordResetEmailRedirectUrl(),
      });
      // Always show the same success state so this flow cannot reveal whether
      // an email address is registered.
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.container}>
            <View style={styles.topSection}>
              <AuthBackButton onPress={() => router.back()} />

              <AuthHeader
                eyebrow="— FINFINDR · PASSWORD RESET —"
                title={'Reset\npassword.'}
                subtitle="Enter your email and we'll send you a link to pick a new password."
              />
            </View>

            {!sent ? (
              <>
                <View style={styles.form}>
                  {notice ? (
                    <AuthNotice
                      title={notice.title}
                      message={notice.message}
                      tone={notice.tone}
                    />
                  ) : null}

                  <AuthField
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="done"
                    onSubmitEditing={handleSend}
                    autoFocus
                  />
                </View>

                <View style={styles.actions}>
                  <AuthPrimaryButton
                    label="Send reset link"
                    loading={loading}
                    loadingLabel="SENDING…"
                    onPress={handleSend}
                  />
                </View>
              </>
            ) : (
              <View style={styles.sentState}>
                <AuthStatusCard iconName="mail-outline" title="Check your inbox">
                  <Text style={styles.sentBody}>
                    If a FinFindr account exists for{' '}
                    <Text style={styles.sentEmail}>{email}</Text>, we sent a password reset link.
                  </Text>
                  <Text style={styles.sentBodyMuted}>
                    Tap the link in the email — it will open the app and let
                    you set a new password.
                  </Text>
                </AuthStatusCard>

                <AuthTip>Don't see it? Check your spam or junk folder.</AuthTip>

                <AuthSecondaryButton
                  label="Back to sign in"
                  onPress={() => router.replace('/(auth)/sign-in')}
                />
              </View>
            )}

            <AuthFooterStamp />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper.dashboardCream },
  safe: { flex: 1 },
  kav: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.xl + paperSpacing.lg,
    gap: paperSpacing.xl,
  },
  topSection: {
    gap: paperSpacing.xl,
  },
  form: {
    gap: paperSpacing.md,
  },
  actions: {
    gap: paperSpacing.sm,
  },

  sentState: {
    flex: 1,
    gap: paperSpacing.md,
  },
  sentBody: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 15,
    color: paper.dashboardInk,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: paperSpacing.xs,
  },
  sentBodyMuted: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    color: paper.dashboardInk,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: paperSpacing.xs,
  },
  sentEmail: {
    fontFamily: paperFonts.bodyBold,
    color: paper.dashboardBlue,
  },
});
