import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  Animated,
  type DimensionValue,
  Pressable,
  ScrollView,
  StyleSheet,
  type StyleProp,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import type { PierCastConditionsCatalogCityV4 } from "../../lib/pierCastConditionsV4";
import { selectPierCastCoveredStructures } from "../../lib/pierCastCoveredStructures";
import { hapticSelection } from "../../lib/safeHaptics";
import { paper, paperFonts, paperShadows } from "../../lib/theme";
import { usePaperBonePulse } from "../../lib/usePaperBonePulse";
import type { useAuthStore } from "../../store/authStore";
import { FeedbackCard } from "../FeedbackCard";
import { CornerMarkSet, TopographicLines } from "../paper";

type Profile = ReturnType<typeof useAuthStore.getState>["profile"];
type User = ReturnType<typeof useAuthStore.getState>["user"];

function coordinates(city: PierCastConditionsCatalogCityV4) {
  return city.waterTemperatureSource?.configuredLocation?.referencePoint ?? null;
}

function distanceMiles(origin: PierCastConditionsCatalogCityV4, destination: PierCastConditionsCatalogCityV4) {
  if (origin.cityId === destination.cityId) return -1;
  const from = coordinates(origin);
  const to = coordinates(destination);
  if (!from || !to) return Number.POSITIVE_INFINITY;
  const radians = (value: number) => (value * Math.PI) / 180;
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const a = Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function PierCastNearbyPorts({
  selectedCity,
  cities,
  onOpenCity,
}: {
  selectedCity: PierCastConditionsCatalogCityV4;
  cities: readonly PierCastConditionsCatalogCityV4[];
  onOpenCity: (cityId: string) => void;
}) {
  const nearbyCities = useMemo(
    () => [...cities].sort((left, right) =>
      distanceMiles(selectedCity, left) - distanceMiles(selectedCity, right) ||
      left.displayName.localeCompare(right.displayName)
    ),
    [cities, selectedCity],
  );

  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.headingIdentity}>
          <View style={styles.iconCircle}>
            <Ionicons name="navigate-outline" size={17} color={paper.dashboardBlue} />
          </View>
          <View style={styles.headingCopy}>
            <Text style={styles.eyebrow}>NEARBY PORTS</Text>
            <Text style={styles.title}>Explore the shoreline</Text>
          </View>
        </View>
        <Text style={styles.countPill}>{String(nearbyCities.length).padStart(2, "0")} PORTS</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.portRail}
      >
        {nearbyCities.map((city) => {
          const selected = city.cityId === selectedCity.cityId;
          const distance = distanceMiles(selectedCity, city);
          return (
            <Pressable
              key={city.cityId}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                if (selected) return;
                hapticSelection();
                onOpenCity(city.cityId);
              }}
              style={({ pressed }) => [
                styles.portChip,
                selected && styles.portChipSelected,
                pressed && !selected && styles.pressed,
              ]}
            >
              <Ionicons
                name={selected ? "location" : "location-outline"}
                size={13}
                color={selected ? "#FFFFFF" : paper.dashboardBlue}
              />
              <View>
                <Text style={[styles.portName, selected && styles.portTextSelected]}>{city.displayName}</Text>
                <Text style={[styles.portMeta, selected && styles.portMetaSelected]}>
                  {selected
                    ? "CURRENT"
                    : Number.isFinite(distance)
                      ? `${Math.round(distance)} MI AWAY`
                      : city.stateCode}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function PierCastPiersCovered({ city }: { city: PierCastConditionsCatalogCityV4 }) {
  const [expanded, setExpanded] = useState(false);
  const structures = selectPierCastCoveredStructures(city.structures);
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`Piers covered, ${structures.length} ${structures.length === 1 ? "pier" : "piers"}`}
        onPress={() => {
          hapticSelection();
          setExpanded((current) => !current);
        }}
        style={({ pressed }) => [styles.collapseHeader, pressed && styles.pressed]}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="location" size={17} color={paper.dashboardBlue} />
        </View>
        <View style={styles.collapseCopy}>
          <Text style={styles.title}>Piers covered</Text>
          <Text style={styles.eyebrow}>
            {String(structures.length).padStart(2, "0")} {structures.length === 1 ? "PIER" : "PIERS"}
          </Text>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={18} color={paper.dashboardBlue} />
      </Pressable>
      {expanded ? (
        <View style={styles.collapseBody}>
          <Text style={styles.bodyCopy}>Check local access before you go—published rules are not a live guarantee.</Text>
          {structures.map((structure) => (
            <View key={structure.structureId} style={styles.pierRow}>
              <View style={styles.pierDot} />
              <View style={styles.pierChipBody}>
                <Text style={styles.pierName}>{structure.displayName}</Text>
                <Text style={styles.pierMeta}>
                  {structure.accessStatus === "reported_closed"
                    ? "REPORTED CLOSED"
                    : structure.accessStatus === "route_unverified"
                      ? "ROUTE UNVERIFIED"
                      : "CHECK POSTED ACCESS"}
                </Text>
                {structure.accessStatus === "reported_closed" ||
                structure.accessStatus === "route_unverified" ? (
                  <Text style={styles.bodyCopy}>{structure.limitation}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function PierCastAccessNotice({ city }: { city: PierCastConditionsCatalogCityV4 }) {
  const closed = city.structures.filter((structure) =>
    structure.disposition !== "excluded" && structure.accessStatus === "reported_closed"
  );
  if (closed.length === 0) return null;
  return (
    <View style={styles.accessNotice} accessibilityRole="alert">
      <Ionicons name="warning-outline" size={17} color="#95651D" />
      <View style={styles.accessCopy}>
        <Text style={styles.accessTitle}>Access note</Text>
        <Text style={styles.bodyCopy}>
          {closed.map((structure) => structure.displayName).join(", ")} {closed.length === 1 ? "is" : "are"} reported closed. Conditions do not confirm physical access; check posted notices before visiting.
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

function SkeletonCard({ pulse, children }: { pulse: Animated.Value; children: ReactNode }) {
  return <View style={styles.skeletonCard}>{children}</View>;
}

export function PierCastConditionsSkeleton() {
  const pulse = usePaperBonePulse({ from: 0.12, to: 0.32 });
  const lightPulse = usePaperBonePulse({ from: 0.24, to: 0.54 });
  return (
    <View accessibilityLabel="Loading PierCast conditions" accessibilityRole="progressbar">
      <View style={styles.skeletonMasthead}>
        <TopographicLines style={StyleSheet.absoluteFill} color="#FFFFFF" count={6} />
        <CornerMarkSet color={paper.dashboardBlueLight} inset={11} />
        <Bone pulse={lightPulse} width={160} height={9} />
        <Bone pulse={lightPulse} width="72%" height={31} style={styles.boneGapLarge} />
        <Bone pulse={lightPulse} width="88%" height={11} style={styles.boneGap} />
      </View>
      <SkeletonCard pulse={pulse}>
        <View style={styles.skeletonHeading}>
          <Bone pulse={pulse} width={38} height={38} />
          <View style={styles.skeletonGrow}>
            <Bone pulse={pulse} width={128} height={9} />
            <Bone pulse={pulse} width="72%" height={21} style={styles.boneGap} />
          </View>
        </View>
        <View style={styles.skeletonRail}>
          {[0, 1].map((item) => <Bone key={item} pulse={pulse} width="48%" height={58} />)}
        </View>
      </SkeletonCard>
      <SkeletonCard pulse={pulse}>
        <Bone pulse={pulse} width={145} height={9} />
        <Bone pulse={pulse} width="55%" height={24} style={styles.boneGap} />
        {[0, 1, 2].map((item) => <Bone key={item} pulse={pulse} width="100%" height={62} style={styles.boneGapLarge} />)}
      </SkeletonCard>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.76 },
  card: {
    marginTop: 16,
    borderWidth: 2,
    borderColor: paper.dashboardInk,
    borderRadius: 11,
    backgroundColor: paper.dashboardWhite,
    padding: 16,
    ...paperShadows.hard,
  },
  headingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  headingIdentity: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 10 },
  headingCopy: { flex: 1, minWidth: 0 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#E7F4F2" },
  eyebrow: { color: paper.dashboardBlue, fontFamily: paperFonts.metaMonoBold, fontSize: 9, letterSpacing: 1.15 },
  title: { color: paper.dashboardInk, fontFamily: paperFonts.display, fontSize: 20, lineHeight: 24 },
  countPill: { color: paper.dashboardBlue, backgroundColor: "#E7F4F2", paddingHorizontal: 9, paddingVertical: 6, borderRadius: 4, fontFamily: paperFonts.metaMonoBold, fontSize: 8, letterSpacing: 0.7 },
  portRail: { gap: 9, paddingTop: 14, paddingRight: 6 },
  portChip: { minWidth: 146, flexDirection: "row", alignItems: "center", gap: 7, borderWidth: 1.5, borderColor: paper.dashboardLine, borderRadius: 8, paddingHorizontal: 11, paddingVertical: 10, backgroundColor: paper.dashboardCream },
  portChipSelected: { backgroundColor: paper.dashboardBlue, borderColor: paper.dashboardInk },
  portName: { color: paper.dashboardInk, fontFamily: paperFonts.bodyBold, fontSize: 12 },
  portTextSelected: { color: "#FFFFFF" },
  portMeta: { marginTop: 2, color: paper.dashboardMuted, fontFamily: paperFonts.metaMonoBold, fontSize: 7.5, letterSpacing: 0.6 },
  portMetaSelected: { color: "rgba(255,255,255,0.72)" },
  collapseHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  collapseCopy: { flex: 1, gap: 2 },
  collapseBody: { marginTop: 14, paddingTop: 13, borderTopWidth: 1, borderTopColor: paper.dashboardLine, gap: 10 },
  bodyCopy: { flexShrink: 1, color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 12, lineHeight: 17 },
  pierRow: { flexDirection: "row", alignItems: "flex-start", gap: 9, borderWidth: 1, borderColor: paper.dashboardLine, borderRadius: 7, padding: 10, backgroundColor: paper.dashboardCream },
  pierDot: { width: 7, height: 7, borderRadius: 4, marginTop: 5, backgroundColor: paper.dashboardBlue },
  pierChipBody: { flex: 1, minWidth: 0 },
  pierName: { color: paper.dashboardInk, fontFamily: paperFonts.bodyBold, fontSize: 12, lineHeight: 16 },
  pierMeta: { marginTop: 3, color: paper.dashboardBlue, fontFamily: paperFonts.metaMonoBold, fontSize: 8, letterSpacing: 0.65 },
  accessNotice: { marginTop: 14, flexDirection: "row", alignItems: "flex-start", gap: 9, borderWidth: 1, borderColor: "#D7A94A", borderRadius: 9, padding: 12, backgroundColor: "#FFF8E8" },
  accessCopy: { flex: 1, minWidth: 0 },
  accessTitle: { marginBottom: 3, color: "#765114", fontFamily: paperFonts.bodyBold, fontSize: 12 },
  bone: { borderRadius: 5, backgroundColor: paper.dashboardInk },
  boneGap: { marginTop: 7 },
  boneGapLarge: { marginTop: 14 },
  skeletonMasthead: { overflow: "hidden", minHeight: 150, justifyContent: "center", marginBottom: 18, borderRadius: 12, padding: 20, backgroundColor: paper.dashboardInk },
  skeletonCard: { marginBottom: 16, borderWidth: 2, borderColor: paper.dashboardInk, borderRadius: 11, padding: 16, backgroundColor: paper.dashboardWhite, ...paperShadows.hard },
  skeletonHeading: { flexDirection: "row", alignItems: "center", gap: 11 },
  skeletonGrow: { flex: 1 },
  skeletonRail: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
});
