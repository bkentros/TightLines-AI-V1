/**
 * Verify-email screen — FinFindr paper edition (premium signet).
 *
 * Behavior preserved exactly:
 *   - 60-second resend cooldown
 *   - email redirect URL from `getAuthEmailRedirectUrl()` (https bridge
 *     recommended; see `lib/authEmailRedirect.ts` +
 *     `static/email-auth-redirect.html`)
 *   - back button still signs the user out before routing to sign-in
 *
 * Visual rebuild: the previous generic "status card" was replaced with a
 * custom "letter signet" panel — a topographic-backed card with an
 * outsized concentric-ring seal around the mail icon, a Fraunces
 * "Check your email" title, and a "TO: <address>" lockup that mimics
 * the rest of the paper system's editorial voice. A small brand ribbon
 * sits at the top for premium continuity with the rest of the auth
 * family.
 */

import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import { getAuthEmailRedirectUrl } from '../../lib/authEmailRedirect';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { TopographicLines } from '../../components/paper';
import {
  AuthBackButton,
  AuthBrandRibbon,
  AuthFooterStamp,
  AuthNotice,
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
  const [notice, setNotice] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mail-seal pulse — a subtle "still listening for your tap" cue. Same
  // native-driver opacity loop used across the paper system's live dots.
  const sealPulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sealPulse, {
          toValue: 0.45,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sealPulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [sealPulse]);

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
    setNotice('');
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailToShow,
        options: { emailRedirectTo: getAuthEmailRedirectUrl() },
      });
      if (error) {
        setNotice(error.message);
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
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <AuthBrandRibbon />
          <AuthBackButton onPress={handleBack} label="BACK TO SIGN IN" />

          <View style={styles.content}>
            {/* ─── Letter signet panel ────────────────────────────────── */}
            <View style={styles.signetCard}>
              <TopographicLines
                style={styles.signetTopo}
                color={paper.dashboardInk}
                count={5}
              />

              {/* Rubric strip — small mono line at the top */}
              <View style={styles.signetRubricRow}>
                <View style={styles.signetRubricRule} />
                <Text style={styles.signetRubricText}>
                  FINFINDR · VERIFY YOUR EMAIL
                </Text>
                <View style={styles.signetRubricRule} />
              </View>

              {/* Seal — concentric hairline rings, navy core, mail icon */}
              <View style={styles.sealWrap}>
                <View style={styles.sealOuterRing} />
                <View style={styles.sealMidRing} />
                <Animated.View
                  style={[styles.sealInnerRing, { opacity: sealPulse }]}
                />
                <View style={styles.sealCore}>
                  <Ionicons name="mail-outline" size={30} color="#FFFFFF" />
                </View>
                <View style={[styles.sealCardinal, styles.sealCardinalTop]} />
                <View style={[styles.sealCardinal, styles.sealCardinalRight]} />
                <View style={[styles.sealCardinal, styles.sealCardinalBottom]} />
                <View style={[styles.sealCardinal, styles.sealCardinalLeft]} />
              </View>

              <Text style={styles.signetTitle}>
                Check your{'\n'}
                <Text style={styles.signetTitleAccent}>email</Text>
                <Text style={styles.signetTitleDot}>.</Text>
              </Text>
              <View style={styles.signetTitleRule} />

              {/* TO: address lockup */}
              <View style={styles.toRow}>
                <Text style={styles.toLabel}>TO</Text>
                <View style={styles.toRule} />
                <Text style={styles.toEmail} numberOfLines={1}>
                  {emailToShow || 'your email'}
                </Text>
              </View>

              <Text style={styles.signetBody}>
                We sent a confirmation link. Tap it from your inbox — it will
                open the app and finish your sign-up automatically.
              </Text>
            </View>

            <AuthTip>Don&apos;t see it? Check your spam or junk folder.</AuthTip>

            {notice ? (
              <AuthNotice
                title="Could not resend"
                message={notice}
                tone="error"
              />
            ) : null}

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
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={paper.dashboardBlue}
                  />
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

          <AuthFooterStamp />
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
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.xl + paperSpacing.lg,
    gap: paperSpacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: paperSpacing.md,
  },

  // ── Signet card ───────────────────────────────────────────────────────
  signetCard: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.lg + 4,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  signetTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.32,
  },

  signetRubricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
    paddingHorizontal: 4,
    marginBottom: paperSpacing.md,
    zIndex: 1,
  },
  signetRubricRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardInk,
    opacity: 0.35,
  },
  signetRubricText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardInk,
    letterSpacing: 2.4,
    opacity: 0.7,
  },

  // ── Seal ──────────────────────────────────────────────────────────────
  sealWrap: {
    width: 108,
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    marginVertical: 4,
  },
  sealOuterRing: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.dashboardBlue,
    opacity: 0.4,
  },
  sealMidRing: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.dashboardBlue,
    opacity: 0.55,
  },
  sealInnerRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    opacity: 0.8,
  },
  sealCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: paper.dashboardInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealCardinal: {
    position: 'absolute',
    backgroundColor: paper.dashboardBlue,
    opacity: 0.85,
  },
  sealCardinalTop: {
    top: 0,
    left: '50%',
    marginLeft: -0.75,
    width: 1.5,
    height: 5,
  },
  sealCardinalBottom: {
    bottom: 0,
    left: '50%',
    marginLeft: -0.75,
    width: 1.5,
    height: 5,
  },
  sealCardinalLeft: {
    left: 0,
    top: '50%',
    marginTop: -0.75,
    height: 1.5,
    width: 5,
  },
  sealCardinalRight: {
    right: 0,
    top: '50%',
    marginTop: -0.75,
    height: 1.5,
    width: 5,
  },

  signetTitle: {
    fontFamily: paperFonts.display,
    fontSize: 32,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 35,
    textAlign: 'center',
    marginTop: 14,
    zIndex: 1,
  },
  signetTitleAccent: {
    fontFamily: paperFonts.displayItalic,
    color: paper.dashboardInk,
  },
  signetTitleDot: {
    color: paper.dashboardBlue,
  },
  signetTitleRule: {
    width: 40,
    height: 2.5,
    backgroundColor: paper.dashboardBlue,
    borderRadius: 1,
    marginTop: 8,
    zIndex: 1,
  },

  toRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
    marginTop: paperSpacing.md,
    paddingHorizontal: 6,
    zIndex: 1,
  },
  toLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    color: paper.dashboardBlue,
    letterSpacing: 2.4,
  },
  toRule: {
    width: 14,
    height: 1,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.55,
  },
  toEmail: {
    flex: 1,
    fontFamily: paperFonts.bodyBold,
    fontSize: 14,
    color: paper.dashboardInk,
    letterSpacing: 0.1,
  },

  signetBody: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.dashboardInk,
    opacity: 0.78,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: paperSpacing.sm + 4,
    paddingHorizontal: 4,
    zIndex: 1,
  },

  // ── Resend button ─────────────────────────────────────────────────────
  resendBtn: {
    paddingVertical: paperSpacing.md - 2,
    paddingHorizontal: paperSpacing.lg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    backgroundColor: paper.dashboardWhite,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 260,
  },
  resendBtnSent: {
    backgroundColor: paper.dashboardWhite,
    borderColor: paper.dashboardBlue,
  },
  resendBtnPressed: {
    backgroundColor: '#F6F9FB',
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
    color: paper.dashboardBlue,
    letterSpacing: 2.4,
  },
  resendTextSent: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.dashboardBlue,
    letterSpacing: 2.4,
  },
});
