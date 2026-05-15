/**
 * Welcome / landing screen — FinFindr paper edition.
 *
 * Behavior is unchanged from the previous version: email sign-up, email
 * sign-in, and Apple Sign-In routes all still trigger the same handlers
 * against the same auth store. Only the visual layer was rebuilt.
 *
 * Visual intent
 *  - The pin emblem sits inside a custom "scope target" stage — 4 corner
 *    crosshairs (no circular/square frame) with a horizontal scan beam
 *    that travels vertically across it, like a sonar sweep. Pulls the
 *    same scan-line vocabulary used throughout the dashboard (intelligence
 *    modules, today's-bite CTA) so the brand mark feels alive without a
 *    framing ring.
 *  - The hero card is short — everything (hero + value props + CTAs +
 *    footer) fits on a single iPhone screen without scrolling.
 *  - The three value props are presented as numbered field-guide entries
 *    (I · II · III) on a cream ground with subtle navy icon chips, with
 *    enough vertical breathing room to read at a glance.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import {
  Animated,
  Easing,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import {
  signInWithApple,
  reportAppleSignInFailureIfStillSignedOut,
} from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';
import {
  BrandScopeStage,
  TopographicLines,
} from '../../components/paper';
import {
  AuthFooterStamp,
  AuthPrimaryButton,
  AuthSecondaryButton,
  AuthDivider,
  AuthNotice,
} from '../../components/paper/auth';

type Notice = { title: string; message?: string; tone?: 'info' | 'success' | 'error' };

const FEATURES: {
  numeral: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  blurb: string;
}[] = [
  {
    numeral: 'I',
    icon: 'pulse-outline',
    title: 'The Daily Read',
    blurb: "Today's score, best windows, and a clear answer on whether to go.",
  },
  {
    numeral: 'II',
    icon: 'fish-outline',
    title: 'The Tackle Box',
    blurb: 'Two lures and two flies ranked for your weather, water, and season.',
  },
  {
    numeral: 'III',
    icon: 'scan-outline',
    title: 'Water Read',
    blurb: 'Hydrography for any supported lake — structure zones before you cast.',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { fetchProfile, setSession } = useAuthStore();
  const [notice, setNotice] = useState<Notice | null>(null);

  // Live pulse on the eyebrow dot — same anatomy used everywhere in the
  // paper system. Native opacity loop.
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const appleSignInInFlight = useRef(false);

  const handleAppleSignIn = useCallback(async () => {
    if (appleSignInInFlight.current) return;
    setNotice(null);
    appleSignInInFlight.current = true;
    try {
      try {
        const Crypto = await import('expo-crypto');
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
          throw new Error('Apple Sign-In: no identity token returned');
        }

        const { data, error } = await signInWithApple(
          credential.identityToken,
          nonce,
        );

        if (error) throw error;
        if (data.session) {
          setSession(data.session);
          await fetchProfile(data.session.user.id);
        }
      } catch (err: unknown) {
        await reportAppleSignInFailureIfStillSignedOut(err, () => {
          setNotice({
            title: 'Apple Sign-In failed',
            message: 'Please try again.',
            tone: 'error',
          });
        });
      }
    } finally {
      appleSignInInFlight.current = false;
    }
  }, [fetchProfile, setSession]);

  // Edition meta — populated at render time so every fresh launch reads
  // as a freshly pressed "issue."
  const today = new Date();
  const editionMonth = today
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase();
  const editionYear = today.getFullYear();

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.container}>
          {/* ─── Hero — issue cover ─────────────────────────────────────── */}
          <View style={styles.hero}>
            <TopographicLines
              style={styles.heroTopo}
              color={paper.dashboardInk}
              count={5}
            />

            {/* Issue rubric — small mono line at the top of the cover */}
            <View style={styles.issueRubricRow}>
              <View style={styles.issueRubricRule} />
              <Text style={styles.issueRubricText}>
                FIELD GUIDE · NO. 001 · {editionMonth} {editionYear}
              </Text>
              <View style={styles.issueRubricRule} />
            </View>

            {/* Scope-target stage — 4 corner crosshairs, scan beam,
                sonar pings, breathing emblem. Shared with onboarding
                step-1 via the BrandScopeStage primitive. */}
            <BrandScopeStage size={132} emblemSize={86} style={styles.stageWrap} />

            {/* Live label + wordmark */}
            <View style={styles.liveRow}>
              <View style={styles.livePulseWrap}>
                <View style={styles.livePulseRing} />
                <Animated.View
                  style={[styles.livePulseDot, { opacity: pulse }]}
                />
              </View>
              <Text style={styles.liveLabel}>FIELD-EDITION ACTIVE</Text>
            </View>

            <Text style={styles.brandMark}>
              FinFindr<Text style={styles.brandMarkDot}>.</Text>
            </Text>
            <View style={styles.brandRule} />
            <Text style={styles.tagline}>
              <Text style={styles.taglineItalic}>Find the bite</Text>
              {' '}before you head out.
            </Text>
          </View>

          {notice ? (
            <AuthNotice
              title={notice.title}
              message={notice.message}
              tone={notice.tone}
            />
          ) : null}

          {/* ─── Field-guide entries — I · II · III ────────────────────── */}
          <View style={styles.valuePropsBlock}>
            <View style={styles.valuePropsHeader}>
              <Text style={styles.valuePropsEyebrow}>WHAT&apos;S INSIDE</Text>
              <View style={styles.valuePropsRule} />
              <Text style={styles.valuePropsOrnament}>◆</Text>
            </View>
            <View style={styles.valueProps}>
              {FEATURES.map((item) => (
                <View key={item.numeral} style={styles.valueProp}>
                  <View style={styles.valueNumeralCol}>
                    <Text style={styles.valueNumeral}>{item.numeral}</Text>
                    <View style={styles.valueNumeralRule} />
                  </View>
                  <View style={styles.valueIconWrap}>
                    <Ionicons name={item.icon} size={15} color={paper.dashboardBlue} />
                  </View>
                  <View style={styles.valueText}>
                    <Text style={styles.valueTitle}>{item.title}</Text>
                    <Text style={styles.valueBlurb}>{item.blurb}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* ─── CTAs ───────────────────────────────────────────────────── */}
          <View style={styles.actions}>
            <AuthPrimaryButton
              label="Create account"
              onPress={() => router.push('/(auth)/sign-up')}
            />

            <AuthSecondaryButton
              label="Sign in"
              onPress={() => router.push('/(auth)/sign-in')}
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
          </View>

          {/* ─── Footer ─────────────────────────────────────────────────── */}
          <View style={styles.footerCol}>
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>FINFINDR</Text>
              <Text style={styles.footerMono}>MADE FOR THE WATER</Text>
            </View>
            <AuthFooterStamp />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper.dashboardCream },
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: paperSpacing.md,
    paddingTop: paperSpacing.xs,
    justifyContent: 'space-between',
  },

  // ── Hero / issue cover ────────────────────────────────────────────────
  hero: {
    position: 'relative',
    paddingVertical: paperSpacing.md - 2,
    paddingHorizontal: paperSpacing.md,
    alignItems: 'center',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  heroTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.32,
  },

  issueRubricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
    paddingHorizontal: 4,
    marginBottom: 4,
    zIndex: 1,
  },
  issueRubricRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardInk,
    opacity: 0.35,
  },
  issueRubricText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardInk,
    letterSpacing: 2.4,
    opacity: 0.7,
  },

  stageWrap: {
    marginTop: 2,
    marginBottom: 2,
    zIndex: 1,
  },

  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
    zIndex: 1,
  },
  livePulseWrap: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  livePulseRing: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    opacity: 0.45,
  },
  livePulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: paper.dashboardBlue,
  },
  liveLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.dashboardBlue,
    letterSpacing: 2.6,
  },

  brandMark: {
    fontFamily: paperFonts.display,
    fontSize: 38,
    color: paper.dashboardInk,
    letterSpacing: -0.5,
    fontWeight: '700',
    lineHeight: 42,
    marginTop: 4,
    zIndex: 1,
  },
  brandMarkDot: {
    color: paper.dashboardBlue,
  },
  brandRule: {
    width: 44,
    height: 2.5,
    backgroundColor: paper.dashboardBlue,
    marginTop: 4,
    borderRadius: 1,
    zIndex: 1,
  },
  tagline: {
    fontFamily: paperFonts.body,
    fontSize: 13.5,
    color: paper.dashboardInk,
    opacity: 0.78,
    marginTop: 6,
    textAlign: 'center',
    zIndex: 1,
  },
  taglineItalic: {
    fontFamily: paperFonts.displayItalic,
    color: paper.dashboardInk,
  },

  // ── Field-guide entries ───────────────────────────────────────────────
  valuePropsBlock: {
    gap: paperSpacing.sm,
  },
  valuePropsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 2,
  },
  valuePropsEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    color: paper.dashboardInk,
    letterSpacing: 2.8,
    opacity: 0.7,
  },
  valuePropsRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardInk,
    opacity: 0.3,
  },
  valuePropsOrnament: {
    fontFamily: paperFonts.body,
    fontSize: 10,
    color: paper.dashboardBlue,
    opacity: 0.6,
  },

  valueProps: {
    gap: paperSpacing.sm + 2,
  },
  valueProp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm + 2,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    paddingVertical: paperSpacing.sm + 2,
    paddingHorizontal: paperSpacing.sm + 4,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  valueNumeralCol: {
    alignItems: 'center',
    width: 20,
  },
  valueNumeral: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.dashboardBlue,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 17,
  },
  valueNumeralRule: {
    width: 12,
    height: 1,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.5,
    marginTop: 3,
  },
  valueIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: paper.dashboardCream,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    flex: 1,
    gap: 1,
  },
  valueTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.dashboardInk,
    letterSpacing: 0.1,
    lineHeight: 15,
  },
  valueBlurb: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.dashboardInk,
    opacity: 0.7,
    lineHeight: 16,
  },

  // ── Actions ───────────────────────────────────────────────────────────
  actions: { gap: paperSpacing.xs + 2 },
  appleBtn: { height: 48, width: '100%' },

  // ── Footer ────────────────────────────────────────────────────────────
  footerCol: {
    gap: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1.5,
    borderTopColor: paper.dashboardInk,
    paddingTop: paperSpacing.xs + 2,
  },
  footerText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.dashboardInk,
    opacity: 0.55,
    letterSpacing: 2.6,
  },
  footerMono: {
    fontFamily: paperFonts.mono,
    fontSize: 9.5,
    color: paper.dashboardInk,
    opacity: 0.55,
    letterSpacing: 2.2,
  },
});
