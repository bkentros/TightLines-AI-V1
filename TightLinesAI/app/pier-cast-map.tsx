/**
 * PierCast Live Lake Map — full-screen web view around the map page
 * (web/lake-map: NOAA water temperature, wind, waves and depth for all five
 * Great Lakes, with a 5-day forecast timeline and cold-water surge alerts).
 *
 * Access: the map only opens with a pass from FinFindr's server
 * (lib/pierCastMapAccess.ts). Paid accounts always get one; free accounts get
 * two visits in total, then this screen shows the paywall. One visit = one
 * opening of this screen (retries and renewals reuse the same visit id).
 *
 * The page draws its own controls; this screen supplies the app context
 * (units, target species, a city to open), turns page messages into app
 * actions (back, open City Report, haptics, analytics), pauses the map while
 * it is covered or the app is in the background, and handles loading/errors.
 * The contract lives in lib/pierCastLiveMap.ts.
 */
import { Ionicons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  BackHandler,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

import { SubscribePrompt } from "../components/SubscribePrompt";
import { captureAnalytics } from "../lib/analytics";
import { PierCastRequestError } from "../lib/pierCast";
import { requestPierCastMapPass } from "../lib/pierCastMapAccess";
import {
  isPierCastLiveMapUrlAllowed,
  parsePierCastLiveMapMessage,
  PIER_CAST_LIVE_MAP_ANALYTICS,
  PIER_CAST_LIVE_MAP_READY_TIMEOUT_MS,
  PIER_CAST_MAP_PASS_RENEW_MS,
  pierCastLiveMapBaseUrl,
  pierCastLiveMapInjection,
  pierCastLiveMapPageUrl,
  pierCastLiveMapPauseScript,
  pierCastLiveMapRenewScript,
  type PierCastLiveMapAppConfig,
  type PierCastMapPassResponse,
} from "../lib/pierCastLiveMap";
import { parsePierCastTargetSpecies } from "../lib/pierCastTargetPreference";
import { hapticSelection } from "../lib/safeHaptics";
import { paper, paperFonts } from "../lib/theme";
import { useAuthStore } from "../store/authStore";

const NAVY = "#0F2233";
const LOCKED_PREVIEW = require("../assets/images/pier-cast-live-map-preview.jpg");

type LoadState = "authorizing" | "loading" | "ready" | "error" | "locked";

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function PierCastMapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ speciesId?: string | string[]; cityId?: string | string[] }>();
  const profile = useAuthStore((state) => state.profile);
  const webRef = useRef<WebView>(null);
  const [state, setState] = useState<LoadState>("authorizing");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [access, setAccess] = useState<PierCastMapPassResponse | null>(null);
  const [paywall, setPaywall] = useState(false);
  const focused = useRef(true);
  const openedAt = useRef(Date.now());
  // one id per opening of this screen: retries and renewals never use a second free visit
  const visitId = useRef(Crypto.randomUUID());
  const passIssuedAt = useRef(0);

  const baseUrl = useMemo(() => pierCastLiveMapBaseUrl(), []);
  const pageUrl = useMemo(
    () => (access ? pierCastLiveMapPageUrl(baseUrl, access.pass) : null),
    // the page keeps its pass as a cookie; renewals go in without reloading
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseUrl, access === null, attempt],
  );
  const routeSpecies = parsePierCastTargetSpecies(firstParam(params.speciesId));
  const routeCity = firstParam(params.cityId);
  const leave = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/pier-cast-review");
  }, [router]);

  // decided once per visit: the page reads it before it starts
  const injection = useMemo(() => {
    const config: PierCastLiveMapAppConfig = {
      units: profile?.preferred_units === "metric" ? "metric" : "imperial",
      species: routeSpecies,
      speciesFromRoute: Boolean(routeSpecies),
      cityId: routeCity && /^[a-z0-9_]{2,64}$/.test(routeCity) ? routeCity : null,
      platform: Platform.OS,
      trial: access?.access === "free_visit"
        ? { used: access.visitsUsed, allowed: access.visitsAllowed }
        : null,
      bridge: 1,
    };
    return pierCastLiveMapInjection(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, access === null]);

  const authorize = useCallback(async (renew: boolean) => {
    try {
      const next = await requestPierCastMapPass(visitId.current);
      passIssuedAt.current = Date.now();
      if (renew) {
        webRef.current?.injectJavaScript(pierCastLiveMapRenewScript(next.pass));
        return;
      }
      setAccess(next);
      setState("loading");
      captureAnalytics("pier_cast_live_map_access_granted", {
        access: next.access,
        visits_used: next.visitsUsed,
      });
    } catch (caught) {
      if (caught instanceof PierCastRequestError && caught.code === "subscription_required") {
        captureAnalytics("pier_cast_live_map_paywall_shown", {});
        setState("locked");
        setPaywall(true);
        return;
      }
      if (renew) return; // the open map keeps working until its pass runs out; next renewal tries again
      setErrorDetail(caught instanceof Error ? caught.message : "Map access failed.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    void authorize(false);
  }, [authorize]);

  // keep the open map's pass fresh (it lasts 2 hours)
  useEffect(() => {
    if (!access) return;
    const timer = setInterval(() => {
      if (focused.current && Date.now() - passIssuedAt.current > PIER_CAST_MAP_PASS_RENEW_MS) void authorize(true);
    }, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [access, authorize]);

  useEffect(() => {
    captureAnalytics("pier_cast_live_map_opened", {
      species_id: routeSpecies,
      city_id: routeCity ?? null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // a page that never reports in (dead network, blocked host) gets a retry screen
  useEffect(() => {
    if (state !== "loading") return;
    const timer = setTimeout(() => {
      setState((current) => (current === "loading" ? "error" : current));
      setErrorDetail((current) => current ?? "The map took too long to load.");
    }, PIER_CAST_LIVE_MAP_READY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [state, attempt]);

  const setPaused = useCallback((paused: boolean) => {
    webRef.current?.injectJavaScript(pierCastLiveMapPauseScript(paused));
  }, []);

  // stop drawing while City Report (or anything else) covers the map
  useFocusEffect(
    useCallback(() => {
      focused.current = true;
      setPaused(false);
      const backSubscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          hapticSelection();
          leave();
          return true;
        },
      );
      return () => {
        backSubscription.remove();
        focused.current = false;
        setPaused(true);
      };
    }, [leave, setPaused]),
  );

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      setPaused(next !== "active" || !focused.current);
      // back from the background after a long time: renew before the pass lapses
      if (next === "active" && passIssuedAt.current && Date.now() - passIssuedAt.current > PIER_CAST_MAP_PASS_RENEW_MS) {
        void authorize(true);
      }
    });
    return () => sub.remove();
  }, [setPaused, authorize]);

  const retry = useCallback(() => {
    hapticSelection();
    setErrorDetail(null);
    if (!access) {
      setState("authorizing");
      void authorize(false);
      return;
    }
    // a fresh pass for the reload, still the same visit
    setState("loading");
    void requestPierCastMapPass(visitId.current).then((next) => {
      passIssuedAt.current = Date.now();
      setAccess(next);
      setAttempt((n) => n + 1);
    }).catch((caught) => {
      setErrorDetail(caught instanceof Error ? caught.message : "Map access failed.");
      setState("error");
    });
  }, [access, authorize]);

  const onMessage = useCallback((event: WebViewMessageEvent) => {
    const message = parsePierCastLiveMapMessage(event.nativeEvent.data);
    if (!message) return;
    switch (message.type) {
      case "ready":
        setState("ready");
        captureAnalytics("pier_cast_live_map_ready", {
          run: message.run,
          load_ms: Date.now() - openedAt.current,
        });
        if (!focused.current) setPaused(true);
        break;
      case "error":
        setErrorDetail(message.message);
        setState("error");
        captureAnalytics("pier_cast_live_map_failed", { reason: message.message });
        break;
      case "back":
        hapticSelection();
        leave();
        break;
      case "haptic":
        hapticSelection();
        break;
      case "openCity":
        captureAnalytics("pier_cast_visual_map_city_opened", {
          city_id: message.cityId,
          species_id: message.speciesId,
          source: "live_map",
        });
        router.push({
          pathname: "/pier-cast-review",
          params: {
            cityId: message.cityId,
            from: "map",
            ...(message.speciesId ? { speciesId: message.speciesId } : {}),
            entry: String(Date.now()),
          },
        });
        break;
      case "analytics":
        captureAnalytics(PIER_CAST_LIVE_MAP_ANALYTICS[message.event], message.props);
        break;
    }
  }, [router, setPaused, leave]);

  const onLoadFailed = useCallback((detail: string) => {
    setErrorDetail(detail);
    setState("error");
    captureAnalytics("pier_cast_live_map_failed", { reason: detail.slice(0, 120) });
  }, []);

  // Android web views do not report the phone's safe areas to the page, so the
  // screen keeps the page clear of the status and navigation bars itself.
  const androidPad = Platform.OS === "android"
    ? { paddingTop: insets.top, paddingBottom: insets.bottom }
    : null;

  return (
    <View style={[styles.root, androidPad]}>
      <StatusBar style="light" />
      {pageUrl && <WebView
        key={attempt}
        ref={webRef}
        source={{ uri: pageUrl }}
        style={styles.web}
        containerStyle={styles.web}
        originWhitelist={["https://*"]}
        injectedJavaScriptBeforeContentLoaded={injection}
        onMessage={onMessage}
        onShouldStartLoadWithRequest={(request) => isPierCastLiveMapUrlAllowed(request.url, baseUrl)}
        onError={(event) => onLoadFailed(event.nativeEvent.description || "Network error")}
        onHttpError={(event) => {
          if (event.nativeEvent.url?.includes("/map/index.html")) {
            onLoadFailed(`The map page returned ${event.nativeEvent.statusCode}.`);
          }
        }}
        onContentProcessDidTerminate={() => webRef.current?.reload()}
        onRenderProcessGone={() => setAttempt((n) => n + 1)}
        javaScriptEnabled
        domStorageEnabled
        cacheEnabled
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        allowsBackForwardNavigationGestures={false}
        allowsLinkPreview={false}
        setSupportMultipleWindows={false}
        textInteractionEnabled={false}
        hideKeyboardAccessoryView
        keyboardDisplayRequiresUserAction={false}
        androidLayerType="hardware"
        webviewDebuggingEnabled={__DEV__}
        accessibilityLabel="Live Lake Map"
      />}

      {state !== "ready" && (
        <View style={styles.cover}>
          {state === "locked" && (
            // a blurred look at the map behind the members-only message
            <>
              <Image
                source={LOCKED_PREVIEW}
                blurRadius={18}
                resizeMode="cover"
                style={styles.lockedBackdrop}
                accessibilityIgnoresInvertColors
              />
              <View pointerEvents="none" style={[styles.lockedBackdrop, styles.lockedShade]} />
            </>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={10}
            onPress={leave}
            style={({ pressed }) => [styles.back, { top: insets.top + 12 }, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>
          <ScrollView
            style={styles.centerScroll}
            contentContainerStyle={[
              styles.center,
              {
                paddingTop: insets.top + 72,
                paddingBottom: insets.bottom + 72,
              },
            ]}
            alwaysBounceVertical={false}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            {state === "locked"
              ? (
                <>
                  <Ionicons name="lock-closed-outline" size={28} color={paper.gold} />
                  <Text style={styles.eyebrow}>PIERCAST · GREAT LAKES</Text>
                  <Text style={styles.title} accessibilityRole="header">
                    Upgrade to Angler Membership to view the Live Lake Map.
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Upgrade to Angler Membership"
                    onPress={() => {
                      hapticSelection();
                      setPaywall(true);
                    }}
                    style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
                  >
                    <Text style={styles.retryText}>Upgrade</Text>
                  </Pressable>
                </>
              )
              : state === "loading" || state === "authorizing"
              ? (
                <>
                  <ActivityIndicator color={paper.gold} />
                  <Text style={styles.eyebrow}>PIERCAST · GREAT LAKES</Text>
                  <Text style={styles.title}>Charting the lakes</Text>
                  <Text style={styles.copy}>Loading NOAA water temperature, wind and waves…</Text>
                </>
              )
              : (
                <>
                  <Ionicons name="cloud-offline-outline" size={30} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.title}>The lake map didn't load</Text>
                  <Text style={styles.copy}>
                    Check your connection and try again.{errorDetail ? `\n${errorDetail}` : ""}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={retry}
                    style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
                  >
                    <Text style={styles.retryText}>Try again</Text>
                  </Pressable>
                </>
              )}
          </ScrollView>
        </View>
      )}
      <SubscribePrompt
        visible={paywall}
        onDismiss={() => setPaywall(false)}
        onUnlocked={() => {
          setPaywall(false);
          setState("authorizing");
          // the subscription can take a moment to reach the server
          void (async () => {
            for (const wait of [0, 2000, 4000, 8000]) {
              if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
              try {
                const next = await requestPierCastMapPass(visitId.current);
                passIssuedAt.current = Date.now();
                setAccess(next);
                setState("loading");
                return;
              } catch (caught) {
                if (!(caught instanceof PierCastRequestError && caught.code === "subscription_required")) break;
              }
            }
            setErrorDetail("Your upgrade is still being confirmed. Try again in a moment.");
            setState("error");
          })();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NAVY },
  web: { flex: 1, backgroundColor: NAVY },
  cover: { ...StyleSheet.absoluteFillObject, backgroundColor: NAVY },
  centerScroll: { flex: 1, width: "100%" },
  center: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 8,
  },
  lockedBackdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  back: {
    position: "absolute",
    left: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(9,24,38,0.76)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    zIndex: 2,
  },
  eyebrow: {
    marginTop: 14,
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2.2,
    color: paper.gold,
  },
  title: { fontFamily: paperFonts.display, fontSize: 22, color: "#FFFFFF", textAlign: "center" },
  copy: {
    fontFamily: paperFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  retry: {
    marginTop: 12,
    height: 46,
    paddingHorizontal: 26,
    borderRadius: 23,
    backgroundColor: paper.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  retryText: { fontFamily: paperFonts.bodyBold, fontSize: 15, color: "#0A1B2E" },
  pressed: { opacity: 0.7 },
  lockedShade: { backgroundColor: "rgba(10,24,38,0.62)" },
});
