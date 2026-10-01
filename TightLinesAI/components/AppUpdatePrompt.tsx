import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";
import { useEffect, useState } from "react";
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  appUpdateDismissalKey,
  type AppReleasePolicy,
  type AppUpdatePlatform,
  parseAppReleasePolicy,
  parseNativeBuildNumber,
  shouldPresentAppUpdate,
} from "../lib/appUpdatePolicy";
import { supabase } from "../lib/supabase";
import { paper, paperFonts, paperSpacing } from "../lib/theme";
import { TopographicLines } from "./paper/TopographicLines";

const POLICY_FIELDS =
  "platform,enabled,latest_build,latest_version,store_url,title,message";
const offeredThisSession = new Set<string>();

function nativePlatform(): AppUpdatePlatform | null {
  if (Platform.OS === "ios" || Platform.OS === "android") return Platform.OS;
  return null;
}

export function AppUpdatePrompt() {
  const insets = useSafeAreaInsets();
  const [policy, setPolicy] = useState<AppReleasePolicy | null>(null);

  useEffect(() => {
    let active = true;
    const platform = nativePlatform();
    const installedBuild = parseNativeBuildNumber(
      Application.nativeBuildVersion,
    );
    if (!platform || installedBuild == null) return () => {
      active = false;
    };

    void (async () => {
      try {
        const { data, error } = await supabase
          .from("app_release_policies")
          .select(POLICY_FIELDS)
          .eq("platform", platform)
          .maybeSingle();
        if (!active || error) return;

        const candidate = parseAppReleasePolicy(data, platform);
        if (!candidate) return;
        const sessionKey = appUpdateDismissalKey(platform, candidate.latest_build);
        const dismissed = await AsyncStorage.getItem(
          sessionKey,
        );
        if (active && shouldPresentAppUpdate({
          platform,
          installedBuild,
          policy: candidate,
          dismissed: dismissed === "1",
          alreadyOfferedThisSession: offeredThisSession.has(sessionKey),
        })) {
          offeredThisSession.add(sessionKey);
          setPolicy(candidate);
        }
      } catch {
        // Update checks are advisory and must never interfere with app launch.
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const dismiss = async () => {
    if (!policy) return;
    setPolicy(null);
    await AsyncStorage.setItem(
      appUpdateDismissalKey(policy.platform, policy.latest_build),
      "1",
    ).catch(() => undefined);
  };

  const openStore = async () => {
    if (!policy) return;
    const canOpen = await Linking.canOpenURL(policy.store_url).catch(() => true);
    if (canOpen) await Linking.openURL(policy.store_url).catch(() => undefined);
  };

  return (
    <Modal
      visible={Boolean(policy)}
      transparent
      animationType="fade"
      onRequestClose={() => void dismiss()}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { marginBottom: insets.bottom }]}>
          <View style={styles.hero}>
            <TopographicLines
              style={styles.heroTopo}
              color="rgba(255,255,255,0.14)"
              count={5}
            />
            <Text style={styles.eyebrow}>FINFINDR · APP UPDATE</Text>
            <View style={styles.iconBadge}>
              <Ionicons
                name="arrow-up-circle-outline"
                size={28}
                color={paper.dashboardBlue}
              />
            </View>
            <Text style={styles.title}>{policy?.title ?? "UPDATE AVAILABLE"}</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.copy}>
              {policy?.message ??
                "A newer FinFindr release is ready with the latest fixes and improvements."}
            </Text>
            {policy?.latest_version ? (
              <Text style={styles.version}>VERSION {policy.latest_version}</Text>
            ) : null}
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
              onPress={() => void openStore()}
            >
              <Text style={styles.ctaText}>UPDATE NOW</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.later, pressed && styles.pressed]}
              onPress={() => void dismiss()}
            >
              <Text style={styles.laterText}>NOT NOW</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: paperSpacing.lg,
    backgroundColor: "rgba(7, 25, 43, 0.62)",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    backgroundColor: paper.dashboardWhite,
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  hero: {
    alignItems: "center",
    overflow: "hidden",
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.md,
    backgroundColor: paper.dashboardInk,
  },
  heroTopo: { ...StyleSheet.absoluteFillObject },
  eyebrow: {
    marginBottom: paperSpacing.sm,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 2,
    color: paper.bandFair,
  },
  iconBadge: {
    width: 54,
    height: 54,
    marginBottom: paperSpacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 27,
    backgroundColor: paper.dashboardCream,
  },
  title: {
    textAlign: "center",
    fontFamily: paperFonts.display,
    fontSize: 25,
    color: "#FFFFFF",
  },
  body: { padding: paperSpacing.lg },
  copy: {
    textAlign: "center",
    fontFamily: paperFonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: paper.dashboardInk,
  },
  version: {
    marginTop: paperSpacing.sm,
    textAlign: "center",
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
  },
  cta: {
    minHeight: 48,
    marginTop: paperSpacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: paper.dashboardBlue,
  },
  ctaText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 12,
    letterSpacing: 1.3,
    color: "#FFFFFF",
  },
  later: {
    minHeight: 42,
    marginTop: paperSpacing.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  laterText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 1.1,
    color: paper.dashboardMuted,
  },
  pressed: { opacity: 0.72 },
});
