/**
 * Reset-password screen — FinFindr "renew access" edition.
 *
 * Used as the landing target of the password-reset email link.
 * Functional behavior is unchanged: validation rules
 * (`getPasswordValidationError`, mismatch check), the supabase
 * `auth.updateUser` call, sign-out, and post-success navigation are
 * preserved exactly.
 *
 * Visual concept — "RENEW ACCESS · KEY SIGNET":
 *   The hero is a square navy "key signet" plate with a spinning
 *   tumbler ring, two pin marks, and a key icon centred. While idle the
 *   ring rotates slowly; when the new password is "valid" both fields
 *   pass, the ring locks and a green check overlays — visually stating
 *   "the lock has accepted." Once the password is updated successfully,
 *   the screen transitions to a "ACCESS RENEWED · {today}" panel with a
 *   green-stamped key.
 *
 *   Per-field strength feedback (very weak → strong) is shown inline as
 *   a 4-pip strength meter — purely client-side hint, doesn't change
 *   any submission logic.
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
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import {
  getPasswordValidationError,
  isPasswordValid,
  PASSWORD_POLICY_LABEL,
} from '../../lib/passwordValidation';
import { TopographicLines } from '../../components/paper';
import {
  AuthField,
  AuthFooterStamp,
  AuthNotice,
  AuthPrimaryButton,
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

  const passwordOk = isPasswordValid(password);
  const matchOk = password.length > 0 && password === confirmPassword;
  const allOk = passwordOk && matchOk;

  // Strength meter (0..4) — purely client-side hint
  const strength = computeStrength(password);

  const handleReset = async () => {
    setNotice(null);
    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      setNotice({
        title: 'Check your password',
        message: passwordError,
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

  // ─── Done state — "Access renewed" ─────────────────────────────────────
  if (done) {
    const today = new Date();
    const dayLabel = today
      .toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
      .toUpperCase();

    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.doneWrap}>
            <View style={styles.donePanel}>
              <TopographicLines
                style={styles.heroTopo}
                color={paper.dashboardInk}
                count={5}
              />

              <View style={styles.rubricRow}>
                <View style={[styles.rubricRule, { backgroundColor: paper.bandPrime }]} />
                <Text style={[styles.rubricText, { color: paper.bandPrime }]}>
                  ACCESS RENEWED · {dayLabel}
                </Text>
                <View style={[styles.rubricRule, { backgroundColor: paper.bandPrime }]} />
              </View>

              {/* Renewed key signet — green */}
              <View style={signetStyles.stage}>
                <View style={[signetStyles.tumblerRing, signetStyles.tumblerLocked]} />
                <View style={[signetStyles.tumblerRing, signetStyles.tumblerInner, signetStyles.tumblerInnerLocked]} />
                <View style={[signetStyles.keyDisk, signetStyles.keyDiskRenewed]}>
                  <Ionicons name="key" size={22} color="#FFFFFF" />
                </View>
              </View>

              <Text style={styles.title}>
                Password{'\n'}
                <Text style={styles.titleItalic}>renewed</Text>
                <Text style={[styles.titleDot, { color: paper.bandPrime }]}>.</Text>
              </Text>
              <View style={[styles.titleRule, { backgroundColor: paper.bandPrime }]} />

              <Text style={styles.dek}>
                You've reset your access. Sign in with your new password to
                pick up where you left off.
              </Text>
            </View>

            <View style={styles.doneActions}>
              <AuthPrimaryButton
                label="Sign in"
                onPress={() => router.replace('/(auth)/sign-in')}
              />
            </View>

            <AuthFooterStamp />
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
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Top edition rail */}
            <View style={styles.topRail}>
              <Text style={styles.editionRubric}>WAYPOINT · 03</Text>
              <Text style={styles.editionRubric}>RENEW ACCESS</Text>
            </View>

            {/* Hero */}
            <View style={styles.hero}>
              <TopographicLines
                style={styles.heroTopo}
                color={paper.dashboardInk}
                count={5}
              />

              <View style={styles.rubricRow}>
                <View style={styles.rubricRule} />
                <Text style={styles.rubricText}>
                  FINFINDR · NEW PASSWORD
                </Text>
                <View style={styles.rubricRule} />
              </View>

              <KeySignet locked={allOk} />

              <Text style={styles.title}>
                Set a new{'\n'}
                <Text style={styles.titleItalic}>password</Text>
                <Text style={styles.titleDot}>.</Text>
              </Text>
              <View style={styles.titleRule} />

              <Text style={styles.dek}>
                Choose a strong password. We'll lock it in and sign you out so
                you can sign back in fresh.
              </Text>
            </View>

            {/* Form */}
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
                placeholder={PASSWORD_POLICY_LABEL}
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

              {/* Strength meter */}
              {password.length > 0 ? (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthPips}>
                    {[0, 1, 2, 3].map((i) => (
                      <View
                        key={i}
                        style={[
                          styles.strengthPip,
                          {
                            backgroundColor:
                              i < strength
                                ? strengthColor(strength)
                                : paper.dashboardLine,
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text
                    style={[
                      styles.strengthLabel,
                      { color: strengthColor(strength) },
                    ]}
                  >
                    {strengthLabel(strength)}
                  </Text>
                </View>
              ) : null}

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
                trailing={
                  matchOk ? (
                    <Ionicons name="checkmark-circle" size={18} color={paper.bandPrime} />
                  ) : confirmPassword.length > 0 ? (
                    <Ionicons name="close-circle" size={18} color={paper.bandTough} />
                  ) : undefined
                }
                reserveTrailingSpace
              />
            </View>

            <View style={styles.actions}>
              <AuthPrimaryButton
                label="Update password"
                loading={loading}
                loadingLabel="UPDATING…"
                onPress={handleReset}
                disabled={!allOk || loading}
              />
            </View>

            <AuthFooterStamp />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ─── Strength helpers ────────────────────────────────────────────────────

function computeStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (pw.length >= 12) s += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s += 1;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s += 1;
  return Math.min(4, s) as 0 | 1 | 2 | 3 | 4;
}

function strengthColor(s: number): string {
  if (s >= 3) return paper.bandPrime;
  if (s >= 2) return paper.bandFair;
  return paper.bandTough;
}

function strengthLabel(s: number): string {
  if (s >= 4) return 'STRONG';
  if (s >= 3) return 'GOOD';
  if (s >= 2) return 'FAIR';
  return 'WEAK';
}

// ─── Key signet hero ─────────────────────────────────────────────────────

/**
 * KeySignet — square navy plate with a slowly rotating tumbler ring + a
 * key disk in the centre. When `locked === true`, the ring stops and a
 * green tint indicates the lock has accepted (both fields valid).
 */
function KeySignet({ locked }: { locked: boolean }) {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (locked) return;
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin, locked]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={signetStyles.stage} pointerEvents="none">
      {/* Outer tumbler ring (rotating dashes) */}
      <Animated.View
        style={[
          signetStyles.tumblerRing,
          locked && signetStyles.tumblerLocked,
          { transform: [{ rotate }] },
        ]}
      >
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <View
            key={deg}
            style={[
              signetStyles.tumblerTick,
              { transform: [{ rotate: `${deg}deg` }, { translateY: -36 }] },
            ]}
          />
        ))}
      </Animated.View>

      {/* Inner ring */}
      <View
        style={[
          signetStyles.tumblerRing,
          signetStyles.tumblerInner,
          locked && signetStyles.tumblerInnerLocked,
        ]}
      />

      {/* Key disk */}
      <View
        style={[
          signetStyles.keyDisk,
          locked && signetStyles.keyDiskLocked,
        ]}
      >
        <Ionicons
          name={locked ? 'checkmark' : 'key'}
          size={22}
          color="#FFFFFF"
        />
      </View>

      {/* Status inscription */}
      <View style={signetStyles.inscriptionRow}>
        <Text style={signetStyles.inscription}>
          {locked ? 'TUMBLER · ENGAGED' : 'TUMBLER · STANDBY'}
        </Text>
      </View>
    </View>
  );
}

const signetStyles = StyleSheet.create({
  stage: {
    width: 132,
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
    zIndex: 1,
  },
  tumblerRing: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1.25,
    borderColor: paper.dashboardBlue,
    opacity: 0.65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tumblerInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderColor: paper.dashboardBlue,
    opacity: 0.4,
  },
  tumblerLocked: {
    borderColor: paper.bandPrime,
    opacity: 0.8,
  },
  tumblerInnerLocked: {
    borderColor: paper.bandPrime,
    opacity: 0.5,
  },
  tumblerTick: {
    position: 'absolute',
    width: 1.25,
    height: 5,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.7,
  },
  keyDisk: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: paper.dashboardBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: paper.dashboardWhite,
    shadowColor: paper.dashboardBlue,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  keyDiskLocked: {
    backgroundColor: paper.bandPrime,
    shadowColor: paper.bandPrime,
  },
  keyDiskRenewed: {
    backgroundColor: paper.bandPrime,
    shadowColor: paper.bandPrime,
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
    fontSize: 7.5,
    color: paper.dashboardInk,
    letterSpacing: 1.6,
    opacity: 0.55,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper.dashboardCream },
  safe: { flex: 1 },
  kav: { flex: 1 },
  scroll: {
    flexGrow: 1,
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
    fontSize: 9,
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
    fontSize: 8.5,
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

  fields: {
    gap: paperSpacing.md,
  },
  actions: {
    gap: paperSpacing.sm,
  },

  // Strength meter ────────────────────────────────────────────────────────
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: -paperSpacing.xs,
  },
  strengthPips: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  strengthPip: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  strengthLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.6,
    marginLeft: 10,
  },

  // Done state ────────────────────────────────────────────────────────────
  doneWrap: {
    flex: 1,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.xl + paperSpacing.lg,
    gap: paperSpacing.md,
    justifyContent: 'center',
  },
  donePanel: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: paper.bandPrime,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.md + 2,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: paper.bandPrime,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  doneActions: {
    gap: paperSpacing.sm,
    marginTop: paperSpacing.md,
  },
});
