/**
 * Sign-in screen — FinFindr dashboard language.
 *
 * Visual migration only. Auth behavior is identical to the previous version:
 *   - email/password via `signInWithEmail`
 *   - Apple Sign-In via `signInWithApple`
 *   - error alerts, session storage, and profile fetch unchanged
 */

import { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import {
  signInWithEmail,
  signInWithApple,
  reportAppleSignInFailureIfStillSignedOut,
  getAppleSignInFailureNotice,
} from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { useAuthScrollLayout } from '../../hooks/useAuthScrollLayout';
import {
  AuthBackButton,
  AuthDivider,
  AuthField,
  AuthFooterStamp,
  AuthHeader,
  AuthNotice,
  AuthPrimaryButton,
  AuthTextLink,
} from '../../components/paper/auth';

type Notice = { title: string; message?: string; tone?: 'info' | 'success' | 'error' };

export default function SignInScreen() {
  const router = useRouter();
  const { fetchProfile, setSession } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const appleSignInInFlight = useRef(false);
  const { contentContainerStyle: scrollLayout, keyboardVerticalOffset } =
    useAuthScrollLayout('spread');

  const handleSignIn = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    setNotice(null);
    if (!trimmedEmail || !password) {
      setNotice({
        title: 'Missing fields',
        message: 'Please enter your email and password.',
        tone: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signInWithEmail(trimmedEmail, password);
      if (error) {
        setNotice({ title: 'Sign in failed', message: error.message, tone: 'error' });
        return;
      }
      if (data.session) {
        supabase.functions.setAuth(data.session.access_token);
        setSession(data.session);
        await fetchProfile(data.session.user.id);
        // Navigation handled by root layout guard
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = useCallback(async () => {
    if (appleSignInInFlight.current) return;
    appleSignInInFlight.current = true;
    try {
      try {
        const nonce = Crypto.randomUUID();
        const hashedNonce = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          nonce,
        );

        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
          nonce: hashedNonce,
        });

        if (!credential.identityToken) {
          throw new Error('No identity token');
        }

        const { data, error } = await signInWithApple(
          credential.identityToken,
          nonce,
        );

        if (error) throw error;
        if (data.session) {
          supabase.functions.setAuth(data.session.access_token);
          setSession(data.session);
          await fetchProfile(data.session.user.id);
        }
      } catch (err: unknown) {
        await reportAppleSignInFailureIfStillSignedOut(err, (failure) => {
          const notice = getAppleSignInFailureNotice(failure, 'sign-in');
          setNotice({
            ...notice,
            tone: 'error',
          });
        });
      }
    } finally {
      appleSignInInFlight.current = false;
    }
  }, [fetchProfile, setSession]);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scroll, scrollLayout]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topSection}>
              <View style={styles.topBar}>
                <View style={styles.topBack}>
                  <AuthBackButton onPress={() => router.back()} />
                </View>
                <View style={styles.centerBrand} pointerEvents="none">
                  <Image
                    source={require('../../assets/images/finfindr-logo.png')}
                    style={styles.centerBrandLogo}
                    resizeMode="contain"
                  />
                  <View style={styles.centerBrandLockup}>
                    <View style={styles.centerBrandWordmarkRow}>
                      <Text style={styles.centerBrandWordmark}>FinFindr</Text>
                      <Text style={styles.centerBrandWordmarkDot}>.</Text>
                    </View>
                    <View style={styles.centerBrandRule} />
                  </View>
                </View>
              </View>

              <AuthHeader
                eyebrow="— FINFINDR · SIGN IN —"
                title={'Welcome\nback.'}
                subtitle="Sign in to pick up your log, reports, and tackle recommendations right where you left them."
              />
            </View>

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
                returnKeyType="next"
              />

              <AuthField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
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

              <Pressable
                style={styles.forgotLink}
                onPress={() => router.push('/(auth)/forgot-password')}
                hitSlop={8}
              >
                <Text style={styles.forgotText}>FORGOT PASSWORD?</Text>
              </Pressable>
            </View>

            <View style={styles.actions}>
              <AuthPrimaryButton
                label="Sign in"
                loading={loading}
                loadingLabel="SIGNING IN…"
                onPress={handleSignIn}
              />

              {Platform.OS === 'ios' && (
                <>
                  <AuthDivider />

                  <AppleAuthentication.AppleAuthenticationButton
                    buttonType={
                      AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                    }
                    buttonStyle={
                      AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                    }
                    cornerRadius={12}
                    style={styles.appleBtn}
                    onPress={handleAppleSignIn}
                  />
                </>
              )}

              <AuthTextLink
                leadText="Don't have an account?"
                linkText="CREATE ONE"
                onPress={() => router.replace('/(auth)/sign-up')}
              />
            </View>

            <AuthFooterStamp />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper.dashboardCream },
  safe: { flex: 1 },
  kav: { flex: 1 },
  scrollView: { flex: 1 },
  scroll: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: paperSpacing.xl + paperSpacing.lg,
    paddingTop: paperSpacing.md,
    gap: paperSpacing.xl,
  },
  topSection: {
    gap: paperSpacing.xl,
  },
  topBar: {
    minHeight: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: paper.dashboardLine,
    paddingBottom: paperSpacing.sm,
    position: 'relative',
  },
  topBack: {
    position: 'absolute',
    left: 0,
    top: 4,
    zIndex: 2,
  },
  centerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  centerBrandLogo: {
    width: 28,
    height: 36,
  },
  centerBrandLockup: {
    alignItems: 'flex-start',
  },
  centerBrandWordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  centerBrandWordmark: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  centerBrandWordmarkDot: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    color: paper.dashboardBlue,
    fontWeight: '700',
    lineHeight: 20,
  },
  centerBrandRule: {
    width: 22,
    height: 1.5,
    backgroundColor: paper.dashboardBlue,
    borderRadius: 1,
    marginTop: 2,
    opacity: 0.85,
  },
  form: {
    gap: paperSpacing.md,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
  },
  forgotText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2.4,
  },
  actions: {
    gap: paperSpacing.sm,
  },
  appleBtn: {
    height: 52,
    width: '100%',
  },
});
