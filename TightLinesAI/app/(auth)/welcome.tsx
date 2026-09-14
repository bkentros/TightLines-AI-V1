/**
 * Welcome / landing screen — FinFindr paper edition.
 *
 * Behavior is unchanged from the previous version: email sign-up, email
 * sign-in, and Apple Sign-In routes all still trigger the same handlers
 * against the same auth store. Only the visual layer was rebuilt.
 *
 * Visual intent
 *  - The three-fish pin sits in a dashboard-blue orbital stage built for the
 *    white cover: rotating signal nodes, a soft breathing aura, and a clipped
 *    light sweep keep the mark alive without competing with its silhouette.
 *  - The hero card stays compact so the complete module list and auth actions
 *    remain quick to scan on the surrounding responsive scroll view.
 *  - The five value props are presented as numbered field-guide entries
 *    (I · II · III · IV · V) on a cream ground with subtle navy icon chips, with
 *    enough vertical breathing room to read at a glance.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  type StyleProp,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import type { OneTapSuccessData } from "react-native-nitro-google-signin";
import { paper, paperFonts, paperSpacing } from "../../lib/theme";
import {
  getAppleSignInFailureNotice,
  isAppleEmailAccountConflict,
  reportAppleSignInFailureIfStillSignedOut,
  signInWithApple,
  signInWithGoogle,
} from "../../lib/auth";
import {
  consumeGoogleSignInNonce,
  getGoogleSignInTokens,
  getGoogleSignInFailureNotice,
} from "../../lib/googleAuth";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../../lib/supabase";
import { useAuthScrollLayout } from "../../hooks/useAuthScrollLayout";
import { TopographicLines } from "../../components/paper";
import {
  IntelligenceModuleEmblem,
  type IntelligenceModuleId,
} from "../../components/paper/IntelligenceModuleIcons";
import {
  AuthDivider,
  AuthNotice,
  AuthPrimaryButton,
  AuthTextLink,
} from "../../components/paper/auth";
import { GoogleAuthButton } from "../../components/auth/GoogleAuthButton";

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
    blurb: "Today's score, bite windows, limiting factors, and the reason behind the read.",
    iconBg: ["#E5F2DD", "#C5E0B5"],
    iconBorder: "#3DA85F",
    iconColor: "#1F6B38",
  },
  {
    numeral: "II",
    moduleId: "tackle-box",
    title: "Tackle Box",
    tag: "RECOMMENDER",
    blurb: "Lures, flies, and presentations tuned to your species and current conditions.",
    iconBg: ["#FBF1D9", "#F4DFA4"],
    iconBorder: "#C99B2D",
    iconColor: "#8A6A1A",
  },
  {
    numeral: "III",
    moduleId: "river-run",
    title: "River Migration",
    tag: "MIGRATION",
    blurb: "Migration stage, activity, seasonal presence, river conditions, and official fish counts where available.",
    iconBg: ["#FBE4E1", "#F3C2BC"],
    iconBorder: "#C0392B",
    iconColor: "#9A2B20",
  },
  {
    numeral: "IV",
    moduleId: "pier-cast",
    title: "Pier Cast",
    tag: "PIER FORECAST",
    blurb: "Daily ratings for supported Great Lakes pier cities, plus five-day water, air, and wind.",
    iconBg: ["#E0F3F0", "#B8DFD8"],
    iconBorder: "#318F83",
    iconColor: "#20665E",
  },
  {
    numeral: "V",
    moduleId: "color-match",
    title: "Color Match",
    tag: "COLOR GUIDE",
    blurb: "Two reviewed lure or fly color picks for direct light and two for diffuse light, matched to water clarity.",
    iconBg: ["#FBEBDD", "#F3C9A7"],
    iconBorder: "#D9772B",
    iconColor: "#9B4E18",
  },
  {
    numeral: "VI",
    moduleId: "water-read",
    title: "Water Read",
    tag: "POLYGON",
    blurb: "Structure, cover, and likely holding zones across supported lakes.",
    iconBg: ["#E8F2FA", "#C8DFF2"],
    iconBorder: "#0F63B0",
    iconColor: "#0A4A87",
  },
];

/** Deep-water gradient — the same masthead language used inside the app. */
function MastheadBackdrop() {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        {/* One continuous ramp. A second overlay rect used to supply the glow,
            but on the shortened masthead its falloff compressed into a hard
            edge, so the lift is folded into these stops instead. */}
        <LinearGradient id="welcomeDeep" x1="0.08" y1="0" x2="0.92" y2="1">
          <Stop offset="0" stopColor="#0A1B2E" />
          <Stop offset="0.34" stopColor="#10314A" />
          <Stop offset="0.62" stopColor="#164A64" />
          <Stop offset="0.85" stopColor="#0F3049" />
          <Stop offset="1" stopColor="#0A1D31" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#welcomeDeep)" />
    </Svg>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const { fetchProfile, setSession } = useAuthStore();
  const [notice, setNotice] = useState<Notice | null>(null);
  const { contentContainerStyle: scrollLayout, layoutTier } =
    useAuthScrollLayout("form");
  const { width, fontScale } = useWindowDimensions();
  const useExpandedModuleCopy = fontScale >= 1.2 || width <= 340;
  // Sized down when Pier Cast made this a six-module list — the masthead
  // gives up height first so the auth actions stay above the fold.
  // stage is the reserved layout box; shell is the rounded logo tile; logo is
  // the artwork inside it. stage > shell > logo, always — the aura is drawn
  // from `stage`, so nothing can paint outside the space the layout knows about.
  const welcomeStage = layoutTier === "tall"
    ? { stage: 76, shell: 52, logo: 36 }
    : layoutTier === "standard"
    ? { stage: 68, shell: 46, logo: 32 }
    : { stage: 60, shell: 40, logo: 28 };

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

  const handleGoogleSignInSuccess = useCallback(async (result: OneTapSuccessData) => {
    setNotice(null);
    let googleTokens: { idToken: string; accessToken: string };
    try {
      googleTokens = await getGoogleSignInTokens();
    } catch (error) {
      const googleNotice = getGoogleSignInFailureNotice(error);
      setNotice({ ...googleNotice, tone: "error" });
      return;
    }
    const nonce = await consumeGoogleSignInNonce(googleTokens.idToken);
    if (!nonce) {
      setNotice({
        title: "Google Sign-In failed",
        message: "The secure sign-in request expired. Please try again.",
        tone: "error",
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
      setNotice({ ...googleNotice, tone: "error" });
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
    setNotice({ ...googleNotice, tone: "error" });
  }, []);

  // Edition meta — populated at render time so every fresh launch reads
  // as a freshly pressed "issue."
  const today = new Date();
  const editionMonth = today
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const editionYear = today.getFullYear();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.container, scrollLayout]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled
          alwaysBounceVertical={false}
        >
          {/* ─── Masthead — the app's own deep-water language ──────────── */}
          <View style={styles.masthead}>
            <MastheadBackdrop />
            <TopographicLines
              style={StyleSheet.absoluteFill}
              color={paper.dashboardBlueSky}
              count={6}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.heroSheen,
                {
                  opacity: heroSheen.interpolate({
                    inputRange: [0, 0.12, 0.88, 1],
                    outputRange: [0, 0.1, 0.1, 0],
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

            {/* One living rubric line instead of two stacked chrome rows. */}
            <View style={styles.rubricRow}>
              <View style={styles.livePulseWrap}>
                <View style={styles.livePulseRing} />
                <Animated.View
                  style={[styles.livePulseDot, { opacity: pulse }]}
                />
              </View>
              <Text
                style={styles.rubricText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                FIELD GUIDE · NO. 001 · {editionMonth} {editionYear}
              </Text>
            </View>

            <WelcomeBrandOrbit
              size={welcomeStage.stage}
              shellSize={welcomeStage.shell}
              logoSize={welcomeStage.logo}
              style={styles.stageWrap}
            />

            <Text style={styles.brandMark} allowFontScaling={false}>
              FinFindr<Text style={styles.brandMarkDot}>.</Text>
            </Text>
            <Text style={styles.tagline}>
              <Text style={styles.taglineStrong}>Finding fins</Text>
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

          {/* ─── Field-guide entries — I · II · III · IV · V ─────────────── */}
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
                    layoutTier === "compact" && styles.valueModuleCompact,
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
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}
                    >
                      {item.numeral}
                    </Text>
                    <IntelligenceModuleEmblem
                      module={item.moduleId}
                      iconBg={item.iconBg}
                      iconBorder={item.iconBorder}
                      iconColor={item.iconColor}
                      size={31}
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
                        numberOfLines={
                          useExpandedModuleCopy
                            ? undefined
                            : layoutTier === "tall"
                            ? 2
                            : 1
                        }
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

            <AuthDivider />

            <GoogleAuthButton
              onSignInStart={() => setNotice(null)}
              onSignInSuccess={handleGoogleSignInSuccess}
              onSignInError={handleGoogleSignInError}
            />

            {Platform.OS === "ios" && (
              <>
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function WelcomeBrandOrbit({
  size,
  shellSize,
  logoSize,
  style,
}: {
  size: number;
  shellSize: number;
  logoSize: number;
  style?: StyleProp<ViewStyle>;
}) {
  const orbit = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const orbitLoop = Animated.loop(
      Animated.timing(orbit, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 2100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 2100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(900),
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(2800),
      ]),
    );

    orbitLoop.start();
    breatheLoop.start();
    shimmerLoop.start();
    return () => {
      orbitLoop.stop();
      breatheLoop.stop();
      shimmerLoop.stop();
    };
  }, [breathe, orbit, shimmer]);

  const orbitInset = Math.max(5, Math.round(size * 0.05));
  // 0.9 of the stage, so the 1.08 breathe peak still lands inside it.
  const auraSize = Math.round(size * 0.9);
  const logoRadius = Math.round(shellSize * 0.235);

  return (
    <View
      pointerEvents="none"
      style={[styles.brandOrbitStage, { width: size, height: size }, style]}
    >
      <Animated.View
        style={[
          styles.brandAura,
          {
            width: auraSize,
            height: auraSize,
            borderRadius: auraSize / 2,
            opacity: breathe.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.24],
            }),
            transform: [{
              scale: breathe.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1.08],
              }),
            }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.brandOrbit,
          {
            top: orbitInset,
            right: orbitInset,
            bottom: orbitInset,
            left: orbitInset,
            borderRadius: size,
            transform: [{
              rotate: orbit.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            }],
          },
        ]}
      >
        <View style={[styles.brandOrbitNode, styles.brandOrbitNodeTop]} />
        <View style={[styles.brandOrbitNode, styles.brandOrbitNodeBottom]} />
        <View style={styles.brandOrbitSpark} />
      </Animated.View>

      <Animated.View
        style={[
          styles.brandLogoShell,
          {
            width: shellSize,
            height: shellSize,
            borderRadius: logoRadius,
            transform: [{
              scale: breathe.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.025],
              }),
            }],
          },
        ]}
      >
        <Image
          source={require("../../assets/images/finfindr-dashboard-logo-transparent.png")}
          style={[styles.brandOrbitLogo, { width: logoSize, height: logoSize }]}
          resizeMode="contain"
        />
        <Animated.View
          style={[
            styles.brandLogoShimmer,
            {
              transform: [
                {
                  translateX: shimmer.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-shellSize * 1.2, shellSize * 1.2],
                  }),
                },
                { rotate: "18deg" },
              ],
            },
          ]}
        />
      </Animated.View>
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
    paddingBottom: 14,
    paddingTop: 8,
    gap: 7,
  },

  // ── Masthead ──────────────────────────────────────────────────────────
  // Bleeds past the container's side padding so the navy runs edge to edge,
  // the way every interior screen's masthead does.
  masthead: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    paddingTop: 9,
    paddingBottom: 10,
    paddingHorizontal: paperSpacing.md,
    borderRadius: 16,
    backgroundColor: paper.dashboardInk,
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  heroSheen: {
    position: "absolute",
    top: -20,
    bottom: -20,
    width: 64,
    backgroundColor: "rgba(201,228,242,0.30)",
    zIndex: 2,
  },

  rubricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 2,
    zIndex: 1,
  },
  rubricText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.gold,
    letterSpacing: 1.6,
  },

  stageWrap: {
    marginTop: 0,
    marginBottom: 0,
    zIndex: 1,
  },
  brandOrbitStage: {
    alignItems: "center",
    justifyContent: "center",
  },
  brandAura: {
    position: "absolute",
    backgroundColor: "#7CB8DA",
  },
  brandOrbit: {
    position: "absolute",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(42,110,150,0.42)",
  },
  brandOrbitNode: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#2A6E96",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  brandOrbitNodeTop: {
    top: -4,
    left: "50%",
    marginLeft: -3.5,
  },
  brandOrbitNodeBottom: {
    bottom: -4,
    left: "50%",
    marginLeft: -3.5,
  },
  brandOrbitSpark: {
    position: "absolute",
    top: "50%",
    right: -2.5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#7CB8DA",
  },
  brandLogoShell: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#011842",
    borderWidth: 1,
    borderColor: "rgba(1,24,66,0.18)",
    shadowColor: "#011842",
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
  },
  brandOrbitLogo: {
    alignSelf: "center",
  },
  brandLogoShimmer: {
    position: "absolute",
    top: -24,
    bottom: -24,
    width: 18,
    backgroundColor: "rgba(255,255,255,0.34)",
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
    borderColor: paper.gold,
    opacity: 0.5,
  },
  livePulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: paper.gold,
  },

  brandMark: {
    fontFamily: paperFonts.display,
    fontSize: 27,
    color: "#FFFFFF",
    letterSpacing: -0.7,
    fontWeight: "700",
    lineHeight: 32,
    marginTop: 7,
    zIndex: 1,
  },
  brandMarkDot: {
    color: paper.dashboardBlueLight,
  },
  tagline: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 12.5,
    lineHeight: 15,
    letterSpacing: 0.1,
    color: "rgba(255,255,255,0.78)",
    marginTop: 2,
    textAlign: "center",
    zIndex: 1,
  },
  taglineStrong: {
    fontFamily: paperFonts.bodyBold,
    color: "#FFFFFF",
  },

  // ── Field-guide entries ───────────────────────────────────────────────
  valuePropsBlock: {
    gap: 3,
    marginVertical: 2,
  },
  valuePropsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 2,
  },
  valuePropsEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
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
    gap: 3,
  },
  valueModule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
    position: "relative",
  },
  valueModuleCompact: {
    // Compact widths wrap the longer title/tag pairs while Water Read stays
    // on one line. Keep the six modules visually equal without fixing their
    // height, so larger text can still grow instead of clipping. Trimmed from
    // 106 when Pier Cast made this a six-module list.
    minHeight: 94,
  },
  valueModuleMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    flexShrink: 0,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
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
    gap: 7,
    marginBottom: 1,
  },
  valueModuleTitle: {
    fontFamily: paperFonts.display,
    fontSize: 13,
    color: paper.dashboardInk,
    fontWeight: "600",
  },
  valueModuleTag: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1,
    color: paper.dashboardMuted,
  },
  valueModuleDesc: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 10,
    lineHeight: 13,
    color: paper.dashboardInk,
    opacity: 0.72,
  },

  // ── Actions ───────────────────────────────────────────────────────────
  actions: {
    gap: 6,
  },
  appleBtn: { height: 48, width: "100%" },

  // ── Footer ────────────────────────────────────────────────────────────
  footerCol: {
    gap: 0,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1.5,
    borderTopColor: paper.dashboardInk,
    paddingTop: 4,
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
