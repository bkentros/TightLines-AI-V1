/**
 * Reset-password screen — FinFindr dashboard language.
 *
 * Used as the landing target of the reset-password email link. Password
 * update logic (supabase.auth.updateUser) and success navigation are
 * unchanged.
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import {
  AuthField,
  AuthFooterStamp,
  AuthHeader,
  AuthNotice,
  AuthPrimaryButton,
  AuthStatusCard,
} from '../../components/paper/auth';

type Notice = { title: string; message?: string; tone?: 'info' | 'success' | 'error' };

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const handleReset = async () => {
    setNotice(null);
    if (password.length < 8) {
      setNotice({
        title: 'Too short',
        message: 'Password must be at least 8 characters.',
        tone: 'error',
      });
      return;
    }
    if (password !== confirmPassword) {
      setNotice({
        title: "Passwords don't match",
        message: 'Please make sure both fields match.',
        tone: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setNotice({ title: 'Could not update password', message: error.message, tone: 'error' });
        return;
      }
      await signOut();
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.doneContainer}>
            <AuthStatusCard
              iconName="checkmark-circle"
              title="Password updated"
            >
              <Text style={styles.doneBody}>
                Your password has been reset successfully.
              </Text>
            </AuthStatusCard>

            <View style={{ marginTop: paperSpacing.md }}>
              <AuthPrimaryButton
                label="Sign in"
                onPress={() => router.replace('/(auth)/sign-in')}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.container}>
            <AuthHeader
              eyebrow="— FINFINDR · NEW PASSWORD —"
              title={'Set a new\npassword.'}
              subtitle="Choose a strong password for your FinFindr account."
            />

            <View style={styles.fields}>
              {notice ? (
                <AuthNotice
                  title={notice.title}
                  message={notice.message}
                  tone={notice.tone}
                />
              ) : null}

              <AuthField
                label="New password"
                value={password}
                onChangeText={setPassword}
                placeholder="At least 8 characters"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                returnKeyType="next"
                autoFocus
                reserveTrailingSpace
                trailing={
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={paper.dashboardInk}
                    />
                  </Pressable>
                }
              />

              <AuthField
                label="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={handleReset}
              />
            </View>

            <AuthPrimaryButton
              label="Update password"
              loading={loading}
              loadingLabel="UPDATING…"
              onPress={handleReset}
            />

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
    paddingTop: paperSpacing.xl + paperSpacing.lg,
    paddingBottom: paperSpacing.xl + paperSpacing.lg,
    gap: paperSpacing.xl,
  },
  fields: {
    gap: paperSpacing.md,
  },

  doneContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: paperSpacing.lg,
  },
  doneBody: {
    fontFamily: paperFonts.body,
    fontSize: 14,
    color: paper.dashboardInk,
    opacity: 0.75,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: paperSpacing.xs,
  },
});
