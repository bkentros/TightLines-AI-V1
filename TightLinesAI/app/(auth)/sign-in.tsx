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
import type { OneTapSuccessData } from 'react-native-nitro-google-signin';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import {
  signInWithEmail,
  signInWithApple,
  signInWithGoogle,
  reportAppleSignInFailureIfStillSignedOut,
  getAppleSignInFailureNotice,
} from '../../lib/auth';
import {
  consumeGoogleSignInNonce,
  getGoogleSignInTokens,
  getGoogleSignInFailureNotice,
} from '../../lib/googleAuth';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { useAuthScrollLayout } from '../../hooks/useAuthScrollLayout';
import { TopographicLines } from '../../components/paper';
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
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';

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

  const handleGoogleSignInSuccess = useCallback(async (result: OneTapSuccessData) => {
    setNotice(null);
    let googleTokens: { idToken: string; accessToken: string };
    try {
      googleTokens = await getGoogleSignInTokens();
    } catch (error) {
      const googleNotice = getGoogleSignInFailureNotice(error);
      setNotice({ ...googleNotice, tone: 'error' });
      return;
    }
    const nonce = await consumeGoogleSignInNonce(googleTokens.idToken);
    if (!nonce) {
      setNotice({
        title: 'Google Sign-In failed',
        message: 'The secure sign-in request expired. Please try again.',
        tone: 'error',
      });
      return;
    }
    const { data, error } = await signInWithGoogle(
      googleTokens.idToken,
      nonce,
      googleTokens.accessToken,
    );
    if (error) {
      const googleNotice = getGoogleSignInFailureNotice(error);
      setNotice({ ...googleNotice, tone: 'error' });
      return;
    }
    if (data.session) {
      supabase.functions.setAuth(data.session.access_token);
      setSession(data.session);
      await fetchProfile(data.session.user.id);
    }
  }, [fetchProfile, setSession]);

  const handleGoogleSignInError = useCallback((err: unknown) => {
    const googleNotice = getGoogleSignInFailureNotice(err);
    setNotice({ ...googleNotice, tone: 'error' });
  }, []);

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
                    source={require('../../assets/images/finfindr-dashboard-logo.png')}
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

              <View style={styles.signInHero}>
                <TopographicLines
                  style={styles.signInHeroTopo}
                  color={paper.dashboardInk}
                  count={5}
                />
                <View style={styles.secureAccessPill}>
                  <Ionicons name="lock-closed-outline" size={11} color={paper.dashboardBlue} />
                  <Text style={styles.secureAccessText}>SECURE ANGLER ACCESS</Text>
                </View>
                <AuthHeader
                  eyebrow="FINFINDR · SIGN IN"
                  title={'Welcome back.'}
                  subtitle="Return to your local conditions, reports, saved logs, and fishing tools."
                />
                <View style={styles.returningStrip}>
                  <View style={styles.returningItem}>
                    <Ionicons name="location-outline" size={13} color={paper.dashboardBlue} />
                    <Text style={styles.returningText}>HOME WATER</Text>
                  </View>
                  <View style={styles.returningDivider} />
                  <View style={styles.returningItem}>
                    <Ionicons name="book-outline" size={13} color={paper.dashboardBlue} />
                    <Text style={styles.returningText}>SAVED LOGS</Text>
                  </View>
                  <View style={styles.returningDivider} />
                  <View style={styles.returningItem}>
                    <Ionicons name="pulse-outline" size={13} color={paper.dashboardBlue} />
                    <Text style={styles.returningText}>LIVE READS</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.formHeadingRow}>
                <Text style={styles.formHeading}>ACCOUNT DETAILS</Text>
                <View style={styles.formHeadingRule} />
              </View>
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

              <AuthDivider />

              <GoogleAuthButton
                onSignInStart={() => setNotice(null)}
                onSignInSuccess={handleGoogleSignInSuccess}
                onSignInError={handleGoogleSignInError}
                style={styles.googleBtn}
              />

              {Platform.OS === 'ios' && (
                <>
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
    gap: paperSpacing.md,
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
    width: 34,
    height: 34,
    borderRadius: 8.5,
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
  signInHero: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    borderRadius: 14,
    padding: paperSpacing.lg,
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  signInHeroTopo: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  secureAccessPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginBottom: paperSpacing.sm,
    borderRadius: 999,
    backgroundColor: paper.dashboardBlueSky,
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.20)',
    zIndex: 1,
  },
  secureAccessText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardBlue,
    letterSpacing: 1.5,
  },
  returningStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: paperSpacing.md,
    paddingTop: paperSpacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardInk,
    zIndex: 1,
  },
  returningItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  returningDivider: {
    width: StyleSheet.hairlineWidth,
    height: 18,
    backgroundColor: paper.dashboardInk,
    opacity: 0.18,
  },
  returningText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    color: paper.dashboardInk,
    letterSpacing: 0.8,
    opacity: 0.72,
  },
  form: {
    gap: paperSpacing.md,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    padding: paperSpacing.md,
  },
  formHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formHeading: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardInk,
    letterSpacing: 2,
    opacity: 0.68,
  },
  formHeadingRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardInk,
    opacity: 0.18,
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
  googleBtn: {
    height: 52,
    width: '100%',
    alignSelf: 'center',
  },
});
