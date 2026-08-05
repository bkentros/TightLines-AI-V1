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

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import { paper, paperFonts, paperSpacing } from "../../lib/theme";
import {
  getAppleSignInFailureNotice,
  isAppleEmailAccountConflict,
  reportAppleSignInFailureIfStillSignedOut,
  signInWithApple,
} from "../../lib/auth";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../../lib/supabase";
import { useAuthScrollLayout } from "../../hooks/useAuthScrollLayout";
import { authScopeStageSize } from "../../lib/responsiveAuth";
import { BrandScopeStage, TopographicLines } from "../../components/paper";
import {
  IntelligenceModuleEmblem,
  type IntelligenceModuleId,
} from "../../components/paper/IntelligenceModuleIcons";
import {
  AuthDivider,
  AuthFooterStamp,
  AuthNotice,
  AuthPrimaryButton,
  AuthTextLink,
} from "../../components/paper/auth";

type Notice = {
  title: string;
  message?: string;
  tone?: "info" | "success" | "error";
  actionLabel?: string;
  onAction?: () => void;
};

const FEATURES: {
  numeral: string;
  moduleId: IntelligenceModuleId;
  title: string;
  tag: string;
  blurb: string;
  iconBg: [string, string];
  iconBorder: string;
  iconColor: string;
  comingSoon?: boolean;
}[] = [
  {
    numeral: "I",
    moduleId: "todays-bite",
    title: "Today's Bite",
    tag: "CONDITIONS",
    blurb: "Score, windows, and go/no-go guidance.",
    iconBg: ["#E5F2DD", "#C5E0B5"],
    iconBorder: "#3DA85F",
    iconColor: "#1F6B38",
  },
  {
    numeral: "II",
    moduleId: "river-run",
    title: "River Migration",
    tag: "MIGRATION",
    blurb: "River timing and strength for Great Lakes migratory species.",
    iconBg: ["#FBE4E1", "#F3C2BC"],
    iconBorder: "#C0392B",
    iconColor: "#9A2B20",
  },
  {
    numeral: "III",
    moduleId: "tackle-box",
    title: "Tackle Box",
    tag: "RECOMMENDER",
    blurb: "Lures and flies ranked for conditions.",
    iconBg: ["#FBF1D9", "#F4DFA4"],
    iconBorder: "#C99B2D",
    iconColor: "#8A6A1A",
  },
  {
    numeral: "IV",
    moduleId: "water-read",
    title: "Water Read",
    tag: "POLYGON",
    blurb: "Structure zones for supported lakes.",
    iconBg: ["#E8F2FA", "#C8DFF2"],
    iconBorder: "#0F63B0",
    iconColor: "#0A4A87",
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { fetchProfile, setSession } = useAuthStore();
  const [notice, setNotice] = useState<Notice | null>(null);
  const { contentContainerStyle: scrollLayout, layoutTier } =
    useAuthScrollLayout("spread");
  const scopeStage = authScopeStageSize(layoutTier);

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

  // Slow, premium light sheen that sweeps across the hero cover on a long
  // cadence — the same glint vocabulary used on the dashboard module emblems
  // and the onboarding CTA, so the first screen feels alive without noise.
  const heroSheen = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(heroSheen, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(1200),
        Animated.timing(heroSheen, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(3200),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [heroSheen]);

  const appleSignInInFlight = useRef(false);

  const handleAppleSignIn = useCallback(async () => {
    if (appleSignInInFlight.current) return;
    setNotice(null);
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
          throw new Error("Apple Sign-In: no identity token returned");
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
          const notice = getAppleSignInFailureNotice(failure, "welcome");
          setNotice({
            ...notice,
            tone: "error",
            ...(isAppleEmailAccountConflict(failure)
              ? {
                actionLabel: "Sign in with email",
                onAction: () => router.push("/(auth)/sign-in"),
              }
              : {}),
          });
        });
      }
    } finally {
      appleSignInInFlight.current = false;
    }
  }, [fetchProfile, router, setSession]);

  // Edition meta — populated at render time so every fresh launch reads
  // as a freshly pressed "issue."
  const today = new Date();
  const editionMonth = today
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const editionYear = today.getFullYear();

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.container, scrollLayout]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ─── Hero — issue cover ─────────────────────────────────────── */}
          <View style={styles.hero}>
            <TopographicLines
              style={styles.heroTopo}
              color={paper.dashboardInk}
              count={5}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.heroSheen,
                {
                  opacity: heroSheen.interpolate({
                    inputRange: [0, 0.12, 0.88, 1],
                    outputRange: [0, 0.16, 0.16, 0],
                  }),
                  transform: [
                    {
                      translateX: heroSheen.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-140, 520],
                      }),
                    },
                    { skewX: "-18deg" },
                  ],
                },
              ]}
            />

            {/* Issue rubric — small mono line at the top of the cover */}
            <View style={styles.issueRubricRow}>
              <View style={styles.issueRubricRule} />
              <Text
                style={styles.issueRubricText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.88}
              >
                FIELD GUIDE · NO. 001 · {editionMonth} {editionYear}
              </Text>
              <View style={styles.issueRubricRule} />
            </View>

            {
              /* Scope-target stage — 4 corner crosshairs, scan beam,
                sonar pings, breathing emblem. Shared with onboarding
                step-1 via the BrandScopeStage primitive. */
            }
            <BrandScopeStage
              size={scopeStage.stage}
              emblemSize={scopeStage.emblem}
              style={styles.stageWrap}
            />

            {/* Live label + wordmark */}
            <View style={styles.liveRow}>
              <View style={styles.livePulseWrap}>
                <View style={styles.livePulseRing} />
                <Animated.View
                  style={[styles.livePulseDot, { opacity: pulse }]}
                />
              </View>
              <Text
                style={styles.liveLabel}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.88}
              >
                FIELD-EDITION ACTIVE
              </Text>
            </View>

            <Text style={styles.brandMark}>
              FinFindr<Text style={styles.brandMarkDot}>.</Text>
            </Text>
            <View style={styles.brandRule} />
            <Text style={styles.tagline}>
              <Text style={styles.taglineItalic}>Finding fins</Text>
              , made easier.
            </Text>
          </View>

          {notice
            ? (
              <AuthNotice
                title={notice.title}
                message={notice.message}
                tone={notice.tone}
                actionLabel={notice.actionLabel}
                onAction={notice.onAction}
              />
            )
            : null}

          {/* ─── Field-guide entries — I · II · III ────────────────────── */}
          <View style={styles.valuePropsBlock}>
            <View style={styles.valuePropsHeader}>
              <Text
                style={styles.valuePropsEyebrow}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.88}
              >
                WHAT&apos;S INSIDE
              </Text>
              <View style={styles.valuePropsRule} />
              <Text style={styles.valuePropsOrnament}>◆</Text>
            </View>
            <View style={styles.valueProps}>
              {FEATURES.map((item) => (
                <View
                  key={item.numeral}
                  style={[
                    styles.valueModule,
                    { borderLeftWidth: 3, borderLeftColor: item.iconBorder },
                  ]}
                >
                  {item.comingSoon
                    ? (
                      <View
                        style={[
                          styles.valueModuleSoonBadge,
                          {
                            backgroundColor: `${item.iconBorder}16`,
                            borderColor: `${item.iconBorder}59`,
                          },
                        ]}
                        pointerEvents="none"
                      >
                        <Text
                          style={[
                            styles.valueModuleSoonText,
                            { color: item.iconBorder },
                          ]}
                        >
                          SOON
                        </Text>
                      </View>
                    )
                    : (
                      <View style={styles.valueModuleDots}>
                        <View
                          style={[
                            styles.valueModuleDot,
                            { backgroundColor: item.iconBorder, opacity: 0.5 },
                          ]}
                        />
                        <View
                          style={[
                            styles.valueModuleDot,
                            { backgroundColor: item.iconBorder, opacity: 0.7 },
                          ]}
                        />
                        <View
                          style={[
                            styles.valueModuleDot,
                            { backgroundColor: item.iconBorder },
                          ]}
                        />
                      </View>
                    )}
                  <View
                    style={[
                      styles.valueModuleMain,
                      item.comingSoon && styles.valueModuleMainSoon,
                    ]}
                  >
                    <Text
                      style={[
                        styles.valueModuleCode,
                        { color: item.iconBorder },
                      ]}
                    >
                      {item.numeral}
                    </Text>
                    <IntelligenceModuleEmblem
                      module={item.moduleId}
                      iconBg={item.iconBg}
                      iconBorder={item.iconBorder}
                      iconColor={item.iconColor}
                      size={44}
                    />
                    <View style={styles.valueModuleTextCol}>
                      <View
                        style={[
                          styles.valueModuleTitleRow,
                          item.comingSoon && styles.valueModuleTitleRowSoon,
                        ]}
                      >
                        <Text
                          style={styles.valueModuleTitle}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.88}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={styles.valueModuleTag}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.88}
                        >
                          {item.tag}
                        </Text>
                      </View>
                      <Text
                        style={styles.valueModuleDesc}
                        numberOfLines={item.comingSoon ? 3 : 2}
                      >
                        {item.blurb}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* ─── CTAs ───────────────────────────────────────────────────── */}
          <View style={styles.actions}>
            <AuthPrimaryButton
              label="Create account"
              onPress={() => router.push("/(auth)/sign-up")}
            />

            <AuthTextLink
              leadText="Already have an account?"
              linkText="Sign in"
              onPress={() => router.push("/(auth)/sign-in")}
            />

            {Platform.OS === "ios" && (
              <>
                <AuthDivider />

                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={AppleAuthentication.AppleAuthenticationButtonType
                    .SIGN_IN}
                  buttonStyle={AppleAuthentication
                    .AppleAuthenticationButtonStyle.BLACK}
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper.dashboardCream },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  container: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: paperSpacing.md,
    paddingTop: paperSpacing.md + 6,
    gap: 10,
  },

  // ── Hero / issue cover ────────────────────────────────────────────────
  hero: {
    position: "relative",
    paddingVertical: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md,
    alignItems: "center",
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  heroTopo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.32,
  },
  heroSheen: {
    position: "absolute",
    top: -20,
    bottom: -20,
    width: 64,
    backgroundColor: "rgba(255,255,255,0.55)",
    zIndex: 2,
  },

  issueRubricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "stretch",
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
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 1.6,
    opacity: 0.78,
  },

  stageWrap: {
    marginTop: 0,
    marginBottom: 0,
    zIndex: 1,
  },

  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
    zIndex: 1,
  },
  livePulseWrap: {
    width: 10,
    height: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  livePulseRing: {
    position: "absolute",
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
    fontSize: 11,
    color: paper.dashboardBlue,
    letterSpacing: 1.8,
  },

  brandMark: {
    fontFamily: paperFonts.display,
    fontSize: 30,
    color: paper.dashboardInk,
    letterSpacing: -0.5,
    fontWeight: "700",
    lineHeight: 34,
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
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.78,
    marginTop: 6,
    textAlign: "center",
    zIndex: 1,
  },
  taglineItalic: {
    fontFamily: paperFonts.displayItalic,
    color: paper.dashboardInk,
  },

  // ── Field-guide entries ───────────────────────────────────────────────
  valuePropsBlock: {
    gap: 7,
  },
  valuePropsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 2,
  },
  valuePropsEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 1.8,
    opacity: 0.78,
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
    gap: 8,
  },
  valueModule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 8,
    padding: 10,
    position: "relative",
  },
  valueModuleMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  valueModuleMainSoon: {
    opacity: 0.5,
  },
  valueModuleTitleRowSoon: {
    paddingRight: 50,
  },
  valueModuleSoonBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    zIndex: 2,
  },
  valueModuleSoonText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1,
  },
  valueModuleDots: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    gap: 1.5,
  },
  valueModuleDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  valueModuleCode: {
    width: 24,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1,
    opacity: 0.85,
  },
  valueModuleTextCol: {
    flex: 1,
  },
  valueModuleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 2,
  },
  valueModuleTitle: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.dashboardInk,
    fontWeight: "600",
  },
  valueModuleTag: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 1,
    color: paper.dashboardMuted,
  },
  valueModuleDesc: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 11.8,
    lineHeight: 15.5,
    color: paper.dashboardInk,
    opacity: 0.72,
  },

  // ── Actions ───────────────────────────────────────────────────────────
  actions: {
    gap: paperSpacing.xs + 2,
  },
  appleBtn: { height: 48, width: "100%" },

  // ── Footer ────────────────────────────────────────────────────────────
  footerCol: {
    gap: 2,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1.5,
    borderTopColor: paper.dashboardInk,
    paddingTop: paperSpacing.xs + 2,
  },
  footerText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.dashboardInk,
    opacity: 0.65,
    letterSpacing: 1.6,
  },
  footerMono: {
    fontFamily: paperFonts.mono,
    fontSize: 11,
    color: paper.dashboardInk,
    opacity: 0.65,
    letterSpacing: 1.4,
  },
});
