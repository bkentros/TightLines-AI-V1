/**
 * Forgot-password screen — FinFindr "reset beacon" edition.
 *
 * Functional behavior unchanged: still calls
 * `supabase.auth.resetPasswordForEmail` with
 * `getPasswordResetEmailRedirectUrl()` and always shows the same success
 * state (so the flow cannot reveal whether an address is registered).
 *
 * Visual concept — "RESET BEACON":
 *   Sending a reset link is reframed as transmitting a beacon to your
 *   inbox. The hero shows a custom navy "transmission seal" — a square
 *   plate with concentric ping rings emanating outward from a Bowen
 *   antenna mark, plus 4 corner crosshair anchors. While idle the
 *   beacon is a gentle pulse; while sending the antenna and pings ramp
 *   to a faster cycle. Once sent, a green "TRANSMISSION CONFIRMED"
 *   state appears with a written-letter signet card.
 *
 *   Topographic backdrop, "WAYPOINT 02" rubric, Fraunces title with
 *   italic accent, edition stamp footer — the screen reads as a
 *   distinct field-service operation rather than a generic form.
 */

import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import {
  AUTH_EMAIL_COOLDOWN_SECONDS,
  PASSWORD_RESET_EMAIL_COOLDOWN_KEY,
  clearAuthEmailCooldown,
  readAuthEmailCooldownSeconds,
  setAuthEmailCooldown,
} from '../../lib/authEmailCooldown';
import { getPasswordResetEmailRedirectUrl } from '../../lib/authEmailRedirect';
import { supabase } from '../../lib/supabase';
import { TopographicLines } from '../../components/paper';
import {
  AuthBackButton,
  AuthField,
  AuthFooterStamp,
  AuthNotice,
  AuthPrimaryButton,
  AuthSecondaryButton,
  AuthTip,
} from '../../components/paper/auth';
import { useAuthScrollLayout } from '../../hooks/useAuthScrollLayout';

type Notice = { title: string; message?: string; tone?: 'info' | 'success' | 'error' };

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState<Notice | null>(null);
  const { contentContainerStyle: scrollLayout, keyboardVerticalOffset } =
    useAuthScrollLayout('form');

  useEffect(() => {
    let mounted = true;
    readAuthEmailCooldownSeconds(PASSWORD_RESET_EMAIL_COOLDOWN_KEY).then(
      (seconds) => {
        if (mounted) setCooldown(seconds);
      },
    );

    const id = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 0) return 0;
        const next = prev - 1;
        if (next <= 0) {
          void clearAuthEmailCooldown(PASSWORD_RESET_EMAIL_COOLDOWN_KEY);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const startCooldown = async () => {
    await setAuthEmailCooldown(
      PASSWORD_RESET_EMAIL_COOLDOWN_KEY,
      AUTH_EMAIL_COOLDOWN_SECONDS,
    );
    setCooldown(AUTH_EMAIL_COOLDOWN_SECONDS);
  };

  const handleSend = async () => {
    if (loading) return;
    if (cooldown > 0) {
      const m = Math.floor(cooldown / 60);
      const s = cooldown % 60;
      setNotice({
        title: 'Reset link sent',
        message: `Please wait ${m}:${s.toString().padStart(2, '0')} before sending another reset email from this device.`,
        tone: 'info',
      });
      return;
    }
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
      setSent(true);
      await startCooldown();
    } finally {
      setLoading(false);
    }
  };

  const resendLabel =
    loading ? 'Transmitting...'
    : cooldown > 0 ? `Sent - resend in ${cooldown}s`
    : 'Resend reset link';

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
            {/* Top rail */}
            <View style={styles.topRail}>
              <AuthBackButton onPress={() => router.back()} />
              <Text style={styles.editionRubric}>WAYPOINT · 02</Text>
            </View>

            {/* Hero — Reset beacon */}
            <View style={styles.hero}>
              <TopographicLines
                style={styles.heroTopo}
                color={paper.dashboardInk}
                count={5}
              />

              <View style={styles.rubricRow}>
                <View style={styles.rubricRule} />
                <Text style={styles.rubricText}>
                  FINFINDR · TRANSMISSION RECOVERY
                </Text>
                <View style={styles.rubricRule} />
              </View>

              <ResetBeacon active={loading} confirmed={sent} />

              <Text style={styles.title}>
                Send a{'\n'}
                <Text style={styles.titleItalic}>reset beacon</Text>
                <Text style={styles.titleDot}>.</Text>
              </Text>
              <View style={styles.titleRule} />

              <Text style={styles.dek}>
                {sent
                  ? 'A reset link has been transmitted to your inbox. Tap it to set a new password and resume access.'
                  : "Enter the email tied to your account and we'll relay a one-time reset link straight to your inbox."}
              </Text>
            </View>

            {/* Form / sent state */}
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
                    label={cooldown > 0 ? resendLabel : 'Send reset link'}
                    loading={loading}
                    loadingLabel="TRANSMITTING…"
                    disabled={cooldown > 0}
                    onPress={handleSend}
                  />
                  <Pressable
                    onPress={() => router.replace('/(auth)/sign-in')}
                    style={styles.subtleLink}
                  >
                    <Text style={styles.subtleLinkText}>
                      Remember it? <Text style={styles.subtleLinkAccent}>SIGN IN</Text>
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={styles.sentState}>
                <View style={styles.confirmCard}>
                  <View style={styles.confirmHeader}>
                    <View style={styles.confirmStampRow}>
                      <View style={styles.confirmStampRule} />
                      <Text style={styles.confirmStamp}>TRANSMISSION CONFIRMED</Text>
                      <View style={styles.confirmStampRule} />
                    </View>
                  </View>

                  <View style={styles.confirmIconRow}>
                    <View style={styles.confirmCheck}>
                      <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.confirmTextCol}>
                      <Text style={styles.confirmTitle}>Sent.</Text>
                      <Text style={styles.confirmRoute}>
                        TO ·{' '}
                        <Text style={styles.confirmEmail}>{email.trim().toLowerCase()}</Text>
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.confirmBody}>
                    If a FinFindr account exists for that address, the reset
                    link will arrive in moments. Tap it on this device — it
                    opens the app and lets you set a new password.
                  </Text>

                  <View style={styles.confirmFooter}>
                    <View style={styles.confirmFooterDot} />
                    <Text style={styles.confirmFooterText}>
                      LINK VALID FOR ONE HOUR
                    </Text>
                  </View>
                </View>

                <AuthTip>
                  Don&apos;t see it? Check your spam or junk folder, or try
                  resending after a minute.
                </AuthTip>

                <AuthSecondaryButton
                  label={resendLabel}
                  onPress={handleSend}
                  disabled={loading || cooldown > 0}
                />

                <AuthSecondaryButton
                  label="Back to sign in"
                  onPress={() => router.replace('/(auth)/sign-in')}
                />
              </View>
            )}

            <AuthFooterStamp />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ─── Reset Beacon hero element ───────────────────────────────────────────

/**
 * ResetBeacon — a square 132×132px navy "transmission plate" with:
 *   - 4 corner crosshair brackets pinning each corner
 *   - 1 stationary signal antenna mark in the centre (a navy disk with
 *     a white tower-and-base glyph) — sized like a Bowen antenna
 *   - 3 concentric pings emanating from the antenna at staggered
 *     intervals (0 / 0.66 / 1.33s)
 *   - When idle: gentle 4s ping cycle.
 *   - When active (loading): faster 1.6s cycle, brighter beam.
 *   - When confirmed: rings stop and a green check overlays the antenna.
 */
function ResetBeacon({
  active,
  confirmed,
}: {
  active: boolean;
  confirmed: boolean;
}) {
  const ping1 = useRef(new Animated.Value(0)).current;
  const ping2 = useRef(new Animated.Value(0)).current;
  const ping3 = useRef(new Animated.Value(0)).current;
  const cycleMs = active ? 1600 : 3000;

  useEffect(() => {
    if (confirmed) return;
    const startLoop = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, {
            toValue: 1,
            duration: cycleMs,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ).start();
    startLoop(ping1, 0);
    startLoop(ping2, Math.round(cycleMs * 0.33));
    startLoop(ping3, Math.round(cycleMs * 0.66));
  }, [ping1, ping2, ping3, cycleMs, confirmed]);

  const ringScale1 = ping1.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.4] });
  const ringOp1 = ping1.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.7, 0] });
  const ringScale2 = ping2.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.4] });
  const ringOp2 = ping2.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.55, 0] });
  const ringScale3 = ping3.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.4] });
  const ringOp3 = ping3.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.4, 0] });

  return (
    <View style={beaconStyles.stage} pointerEvents="none">
      {/* 4 corner brackets */}
      {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map((p) => (
        <CornerBracket key={p} position={p} />
      ))}

      {/* 3 staggered ping rings (hidden when confirmed) */}
      {!confirmed && (
        <>
          <Animated.View
            style={[
              beaconStyles.ring,
              { opacity: ringOp1, transform: [{ scale: ringScale1 }] },
            ]}
          />
          <Animated.View
            style={[
              beaconStyles.ring,
              { opacity: ringOp2, transform: [{ scale: ringScale2 }] },
            ]}
          />
          <Animated.View
            style={[
              beaconStyles.ring,
              { opacity: ringOp3, transform: [{ scale: ringScale3 }] },
            ]}
          />
        </>
      )}

      {/* Antenna disk (centre) */}
      <View
        style={[
          beaconStyles.antenna,
          confirmed && beaconStyles.antennaConfirmed,
        ]}
      >
        {confirmed ? (
          <Ionicons name="checkmark" size={22} color="#FFFFFF" />
        ) : (
          <Ionicons name="radio-outline" size={22} color="#FFFFFF" />
        )}
      </View>

      {/* Inscription on bottom edge */}
      <View style={beaconStyles.inscriptionRow}>
        <Text style={beaconStyles.inscription}>
          {confirmed ? 'BEACON · ACK' : active ? 'BEACON · TX' : 'BEACON · IDLE'}
        </Text>
      </View>
    </View>
  );
}

function CornerBracket({
  position,
}: {
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}) {
  const isTop = position === 'topLeft' || position === 'topRight';
  const isLeft = position === 'topLeft' || position === 'bottomLeft';
  return (
    <View
      pointerEvents="none"
      style={[
        beaconStyles.corner,
        isTop ? { top: 6 } : { bottom: 24 },
        isLeft ? { left: 6 } : { right: 6 },
      ]}
    >
      <View
        style={[
          beaconStyles.cornerArmH,
          isTop ? { top: 0 } : { bottom: 0 },
          isLeft ? { left: 0 } : { right: 0 },
        ]}
      />
      <View
        style={[
          beaconStyles.cornerArmV,
          isTop ? { top: 0 } : { bottom: 0 },
          isLeft ? { left: 0 } : { right: 0 },
        ]}
      />
    </View>
  );
}

const beaconStyles = StyleSheet.create({
  stage: {
    width: 132,
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
    zIndex: 1,
  },
  ring: {
    position: 'absolute',
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1.25,
    borderColor: paper.dashboardBlue,
  },
  antenna: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: paper.dashboardBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: paper.dashboardWhite,
    shadowColor: paper.dashboardBlue,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  antennaConfirmed: {
    backgroundColor: paper.bandPrime,
    borderColor: '#FFFFFF',
    shadowColor: paper.bandPrime,
  },
  corner: {
    position: 'absolute',
    width: 14,
    height: 14,
  },
  cornerArmH: {
    position: 'absolute',
    width: 14,
    height: 1.25,
    backgroundColor: paper.dashboardInk,
    opacity: 0.6,
  },
  cornerArmV: {
    position: 'absolute',
    width: 1.25,
    height: 14,
    backgroundColor: paper.dashboardInk,
    opacity: 0.6,
  },
  inscriptionRow: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  inscription: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 1.6,
    opacity: 0.55,
  },
});

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
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.xl + paperSpacing.lg,
    gap: paperSpacing.md,
  },

  topRail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editionRubric: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 2.4,
    opacity: 0.5,
  },

  hero: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.md + 2,
    alignItems: 'center',
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
  rubricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
    paddingHorizontal: 4,
    marginBottom: 4,
    zIndex: 1,
  },
  rubricRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardInk,
    opacity: 0.35,
  },
  rubricText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 2.4,
    opacity: 0.7,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 30,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 33,
    textAlign: 'center',
    marginTop: 6,
    zIndex: 1,
  },
  titleItalic: {
    fontFamily: paperFonts.displayItalic,
    color: paper.dashboardInk,
  },
  titleDot: {
    color: paper.dashboardBlue,
  },
  titleRule: {
    width: 36,
    height: 2.5,
    backgroundColor: paper.dashboardBlue,
    borderRadius: 1,
    marginTop: 8,
    zIndex: 1,
  },
  dek: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13,
    color: paper.dashboardInk,
    opacity: 0.78,
    lineHeight: 19,
    marginTop: paperSpacing.sm,
    paddingHorizontal: 4,
    textAlign: 'center',
    zIndex: 1,
  },

  form: {
    gap: paperSpacing.md,
    marginTop: paperSpacing.md,
  },
  actions: {
    gap: paperSpacing.sm,
  },
  subtleLink: {
    alignItems: 'center',
    paddingVertical: paperSpacing.xs,
  },
  subtleLinkText: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.75,
    letterSpacing: 0.2,
  },
  subtleLinkAccent: {
    fontFamily: paperFonts.bodyBold,
    color: paper.dashboardBlue,
    opacity: 1,
    letterSpacing: 1.4,
  },

  // Sent state ────────────────────────────────────────────────────────────
  sentState: {
    gap: paperSpacing.md,
  },
  confirmCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.md + 2,
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.md,
    gap: paperSpacing.sm,
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  confirmHeader: {
    paddingHorizontal: 2,
  },
  confirmStampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmStampRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.bandPrime,
    opacity: 0.55,
  },
  confirmStamp: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.bandPrime,
    letterSpacing: 2.4,
  },
  confirmIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm + 2,
    paddingTop: 4,
  },
  confirmCheck: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: paper.bandPrime,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: paper.bandPrime,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  confirmTextCol: {
    flex: 1,
  },
  confirmTitle: {
    fontFamily: paperFonts.display,
    fontSize: 20,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  confirmRoute: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 12,
    color: paper.dashboardInk,
    letterSpacing: 1.6,
    opacity: 0.55,
    marginTop: 3,
  },
  confirmEmail: {
    color: paper.dashboardBlue,
    opacity: 1,
    letterSpacing: 0.4,
  },
  confirmBody: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13.5,
    color: paper.dashboardInk,
    opacity: 0.75,
    lineHeight: 19,
  },
  confirmFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  confirmFooterDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: paper.bandPrime,
  },
  confirmFooterText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 1.8,
    opacity: 0.6,
  },
});
