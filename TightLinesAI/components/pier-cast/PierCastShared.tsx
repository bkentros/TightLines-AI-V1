/**
 * Small PierCast building blocks shared by the landing page and City Report:
 * reduced-motion detection, the reveal animation, the band chip and the
 * bottom sheet. (Formerly exported from the retired Standings screen.)
 */
import { Ionicons } from "@expo/vector-icons";
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { PierCastSeasonalBandV4 } from "../../lib/pierCastConditionsV4";
import { PIER_CAST_STANDINGS_BANDS } from "../../lib/pierCastStandingsPresentation";
import { paper, paperFonts } from "../../lib/theme";

const INK = paper.dashboardInk;

export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduce(value);
    });
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduce,
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);
  return reduce;
}

/** Fades/slides children in whenever `token` changes. */
export function Reveal({
  token,
  delay = 0,
  from = "below",
  reduceMotion,
  children,
}: {
  token: string;
  delay?: number;
  from?: "below" | "left";
  reduceMotion: boolean;
  children: ReactNode;
}) {
  const progress = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: from === "left" ? 650 : 480,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, from, progress, reduceMotion, token]);
  const offset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [from === "left" ? -26 : 16, 0],
  });
  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: from === "left" ? [{ translateX: offset }] : [{ translateY: offset }],
      }}
    >
      {children}
    </Animated.View>
  );
}

export function BandChip({
  band,
  prefix,
  small = false,
}: {
  band: PierCastSeasonalBandV4;
  prefix?: string;
  small?: boolean;
}) {
  const style = PIER_CAST_STANDINGS_BANDS[band];
  return (
    <View style={[styles.chip, small && styles.chipSmall, { backgroundColor: style.chip, borderColor: style.color }]}>
      <Text style={[styles.chipText, small && styles.chipTextSmall, { color: style.ink }]}>
        {prefix ? `${prefix.toUpperCase()} · ` : ""}{style.label.toUpperCase()}
      </Text>
    </View>
  );
}

export function BottomSheet({
  visible,
  onClose,
  eyebrow,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.sheetWrap}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
        >
          <View style={styles.backdrop} />
        </Pressable>
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 10 }]}>
          <View style={styles.grab} />
          <View style={styles.sheetHead}>
            <View style={styles.flex}>
              <Text style={styles.sheetEyebrow}>{eyebrow}</Text>
              <Text style={styles.sheetTitle}>{title}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={onClose}
              style={({ pressed }) => [styles.sheetClose, pressed && styles.pressed]}
            >
              <Ionicons name="close" size={18} color={INK} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.72 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 26,
    paddingHorizontal: 9,
    borderWidth: 1.5,
    borderRadius: 6,
  },
  chipSmall: { minHeight: 21, paddingHorizontal: 7, borderWidth: 1, borderRadius: 5 },
  chipText: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.1 },
  chipTextSmall: { fontSize: 9.5, letterSpacing: 0.9 },
  sheetWrap: { flex: 1, justifyContent: "flex-end" },
  backdrop: { flex: 1, backgroundColor: "rgba(10,27,46,0.55)" },
  sheet: {
    maxHeight: "82%",
    paddingTop: 10,
    paddingHorizontal: 16,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: paper.dashboardCream,
  },
  grab: { alignSelf: "center", width: 42, height: 5, borderRadius: 3, marginBottom: 12, backgroundColor: "rgba(0,0,0,0.2)" },
  sheetHead: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 4 },
  sheetEyebrow: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.8, color: paper.dashboardBlue },
  sheetTitle: { marginTop: 3, fontFamily: paperFonts.display, fontSize: 25, lineHeight: 30, color: INK },
  sheetClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: paper.dashboardLine,
  },
});
