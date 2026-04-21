/**
 * Forgot-password screen — FinFindr paper language.
 *
 * Visual migration only. The reset-email flow (including the
 * `tightlinesai://auth/reset-password` deep link) is unchanged so that
 * existing password-reset emails in the wild continue to route correctly.
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import { supabase } from '../../lib/supabase';
import { PaperBackground } from '../../components/paper';
import {
  AuthBackButton,
  AuthField,
  AuthHeader,
  AuthPrimaryButton,
  AuthSecondaryButton,
  AuthStatusCard,
  AuthTip,
} from '../../components/paper/auth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert('Email required', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: 'tightlinesai://auth/reset-password',
      });
      if (error) {
        Alert.alert('Error', error.message);
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperBackground>
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
                    We sent a password reset link to{' '}
                    <Text style={styles.sentEmail}>{email}</Text>.
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
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
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
    color: paper.ink,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: paperSpacing.xs,
  },
  sentBodyMuted: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    color: paper.ink,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: paperSpacing.xs,
  },
  sentEmail: {
    fontFamily: paperFonts.bodyBold,
    color: paper.forest,
  },
});
