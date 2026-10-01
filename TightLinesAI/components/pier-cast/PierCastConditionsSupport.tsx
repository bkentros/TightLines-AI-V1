import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import {
  Animated,
  type DimensionValue,
  StyleSheet,
  type StyleProp,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import type { PierCastConditionsCatalogCityV4 } from "../../lib/pierCastConditionsV4";
import { selectPierCastCoveredStructures } from "../../lib/pierCastCoveredStructures";
import { paper, paperFonts, paperShadows } from "../../lib/theme";
import { usePaperBonePulse } from "../../lib/usePaperBonePulse";
import type { useAuthStore } from "../../store/authStore";
import { FeedbackCard } from "../FeedbackCard";
import { CornerMarkSet, TopographicLines } from "../paper";

type Profile = ReturnType<typeof useAuthStore.getState>["profile"];
type User = ReturnType<typeof useAuthStore.getState>["user"];

export function PierCastAccessNotice({ city }: { city: PierCastConditionsCatalogCityV4 }) {
  const closed = city.structures.filter((structure) =>
    structure.disposition !== "excluded" && structure.accessStatus === "reported_closed"
  );
  if (closed.length === 0) return null;
  const names = closed.map((structure) => structure.displayName).join(", ");
  return (
    <View style={styles.accessNotice} accessibilityRole="alert">
      <Ionicons name="warning-outline" size={18} color="#95651D" />
      <View style={styles.accessCopy}>
        <Text style={styles.accessTitle}>
          {names} {closed.length === 1 ? "is" : "are"} reported closed
        </Text>
        <Text style={styles.bodyCopy}>
          Conditions do not confirm physical access. Check posted notices before you go.
        </Text>
      </View>
    </View>
  );
}

export function PierCastCoverageRequest({
  profile,
  user,
  city,
  cities,
}: {
  profile: Profile;
  user: User;
  city: PierCastConditionsCatalogCityV4 | null;
  cities: PierCastConditionsCatalogCityV4[];
}) {
  return (
    <FeedbackCard
      featureName="PierCast Coverage"
      topic="feature"
      variant="request"
      eyebrow="EXPAND PIERCAST"
      title="Which pier city should we add next?"
      body="Request a state, city, pier, or species. Your requests help decide where PierCast expands next."
      actionLabel="REQUEST COVERAGE"
      profile={profile}
      user={user}
      contextLines={[
        "Request category: PierCast coverage",
        city
          ? `Current PierCast city: ${city.displayName}, ${city.stateCode}`
          : "Current PierCast view: Target leaderboard",
        city
          ? `Current covered structures: ${selectPierCastCoveredStructures(city.structures).map((structure) => structure.displayName).join(", ")}`
          : `Currently supported states: ${Array.from(new Set(cities.map((candidate) => candidate.stateCode))).join(", ")}`,
      ]}
    />
  );
}

function Bone({
  pulse,
  width,
  height,
  style,
}: {
  pulse: Animated.Value;
  width: DimensionValue;
  height: number;
  style?: StyleProp<ViewStyle>;
}) {
  return <Animated.View style={[styles.bone, { opacity: pulse, width, height }, style]} />;
}

function SkeletonCard({ children }: { children: ReactNode }) {
  return <View style={styles.skeletonCard}>{children}</View>;
}

/** Loading state shaped like the city report: full-bleed hero, then cards. */
export function PierCastConditionsSkeleton() {
  const pulse = usePaperBonePulse({ from: 0.12, to: 0.32 });
  const lightPulse = usePaperBonePulse({ from: 0.24, to: 0.54 });
  return (
    <View accessibilityLabel="Loading PierCast city report" accessibilityRole="progressbar">
      <View style={styles.skeletonMasthead}>
        <TopographicLines style={StyleSheet.absoluteFill} color="#FFFFFF" count={7} />
        <CornerMarkSet color={paper.dashboardBlueLight} inset={11} />
        <Bone pulse={lightPulse} width={180} height={10} />
        <Bone pulse={lightPulse} width="62%" height={40} style={styles.boneGapLarge} />
        <Bone pulse={lightPulse} width="48%" height={13} style={styles.boneGap} />
        <Bone pulse={lightPulse} width="100%" height={66} style={styles.boneGapLarge} />
        <View style={styles.skeletonRail}>
          {[0, 1, 2].map((item) => <Bone key={item} pulse={lightPulse} width="30%" height={38} />)}
        </View>
      </View>
      <SkeletonCard>
        <Bone pulse={pulse} width={140} height={10} />
        <Bone pulse={pulse} width="58%" height={24} style={styles.boneGap} />
        <View style={styles.skeletonRail}>
          {[0, 1, 2, 3, 4].map((item) => <Bone key={item} pulse={pulse} width="18%" height={96} />)}
        </View>
      </SkeletonCard>
      <SkeletonCard>
        <Bone pulse={pulse} width={120} height={10} />
        <Bone pulse={pulse} width="66%" height={24} style={styles.boneGap} />
        {[0, 1, 2].map((item) => (
          <Bone key={item} pulse={pulse} width="100%" height={104} style={styles.boneGapLarge} />
        ))}
      </SkeletonCard>
    </View>
  );
}

const styles = StyleSheet.create({
  bodyCopy: { flexShrink: 1, color: "#6B5A3A", fontFamily: paperFonts.body, fontSize: 13, lineHeight: 18 },
  accessNotice: { marginTop: 16, flexDirection: "row", alignItems: "flex-start", gap: 10, borderWidth: 1.5, borderColor: "#D7A94A", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: "#FFF8E8" },
  accessCopy: { flex: 1, minWidth: 0 },
  accessTitle: { marginBottom: 2, color: "#765114", fontFamily: paperFonts.bodyBold, fontSize: 14 },
  bone: { borderRadius: 5, backgroundColor: paper.dashboardInk },
  boneGap: { marginTop: 7 },
  boneGapLarge: { marginTop: 14 },
  skeletonMasthead: { overflow: "hidden", minHeight: 300, justifyContent: "center", padding: 20, backgroundColor: paper.dashboardInk },
  skeletonCard: { marginTop: 16, marginHorizontal: 14, borderWidth: 2, borderColor: paper.dashboardInk, borderRadius: 16, padding: 16, backgroundColor: paper.dashboardWhite, ...paperShadows.hard },
  skeletonRail: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
});
