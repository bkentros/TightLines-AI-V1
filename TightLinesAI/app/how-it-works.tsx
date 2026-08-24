import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  CornerMarkSet,
  IntelligenceModuleEmblem,
  PaperNavHeader,
  SectionEyebrow,
  TopographicLines,
  type IntelligenceModuleId,
} from "../components/paper";
import {
  hapticImpact,
  ImpactFeedbackStyle,
} from "../lib/safeHaptics";
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from "../lib/theme";
import { useLocationStore } from "../store/locationStore";

type IconName = keyof typeof Ionicons.glyphMap;
type FeatureRoute =
  | "/how-fishing"
  | "/river-run"
  | "/recommender"
  | "/water-reader";

type FeatureGuide = {
  code: string;
  title: string;
  tag: string;
  tagline: string;
  module: IntelligenceModuleId;
  route: FeatureRoute;
  action: string;
  iconBg: [string, string];
  accent: string;
  iconColor: string;
  tint: string;
  whenToUse: string;
  howItReads: string;
  guidesNote: string;
  supporting?: boolean;
};

const FEATURE_GUIDES: FeatureGuide[] = [
  {
    code: "01",
    title: "Today's Bite",
    tag: "PRIMARY DAILY READ",
    tagline: "Plan the fishing day.",
    module: "todays-bite",
    route: "/how-fishing",
    action: "OPEN TODAY'S BITE",
    iconBg: ["#E5F2DD", "#C5E0B5"],
    accent: "#3D955A",
    iconColor: "#1F6B38",
    tint: "#F0F7EB",
    whenToUse:
      "Start here for warmwater species and a practical read of how the day is setting up.",
    howItReads:
      "It turns current and forecast conditions into clear timing, helping factors, limiting factors, and a field plan.",
    guidesNote:
      "It can also apply strongly to trout and other coldwater species in fall, winter, and spring. Do not rely on it for coldwater species in summer.",
  },
  {
    code: "02",
    title: "River Migration",
    tag: "MIGRATION SPECIALIST",
    tagline: "Follow fish through the river.",
    module: "river-run",
    route: "/river-run",
    action: "OPEN RIVER MIGRATION",
    iconBg: ["#FBE4E1", "#F3C2BC"],
    accent: paper.red,
    iconColor: "#9A2B20",
    tint: "#FFF3F0",
    whenToUse:
      "Use it for supported Great Lakes salmon and steelhead migrations—especially migration stage, fish presence, activity, and fishability.",
    howItReads:
      "It pairs fresh river conditions with audited species biology and river-specific seasonal context to show the migration stage, likely activity, estimated presence, and fishability.",
    guidesNote:
      "When a supported migration is your main question, this is the primary read—not Today's Bite.",
  },
  {
    code: "03",
    title: "Tackle Box",
    tag: "PRESENTATION GUIDE",
    tagline: "Choose what to throw.",
    module: "tackle-box",
    route: "/recommender",
    action: "OPEN TACKLE BOX",
    iconBg: ["#FBF1D9", "#F4DFA4"],
    accent: "#C99B2D",
    iconColor: "#8A6A1A",
    tint: "#FFF9EA",
    whenToUse:
      "Open it when you know the species and water, but want a focused lure or fly starting point.",
    howItReads:
      "It matches a curated tackle library to your target, water, season, clarity, goal, and the day's conditions.",
    guidesNote:
      "Use the picks as a disciplined starting plan, then adjust to what the fish show you. Fly recommendations are streamer patterns in this version.",
  },
  {
    code: "04",
    title: "Water Read",
    tag: "SUPPORTING MAP",
    tagline: "Scout unfamiliar lake water.",
    module: "water-read",
    route: "/water-reader",
    action: "OPEN WATER READ",
    iconBg: ["#E8F2FA", "#C8DFF2"],
    accent: paper.dashboardBlue,
    iconColor: "#0A4A87",
    tint: "#F0F6FA",
    whenToUse:
      "Use it for a conservative first look at broad structure on an unfamiliar supported lake.",
    howItReads:
      "It studies lake shape and shoreline structure to mark general zones worth investigating.",
    guidesNote:
      "It is not a depth chart, sonar view, live-position tool, or promise of exact fish locations.",
    supporting: true,
  },
];

export default function FeatureGuideScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lat?: string;
    lon?: string;
    location_label?: string;
  }>();
  const { savedLocation, useCustom, load: loadLocationPreferences } =
    useLocationStore();

  useEffect(() => {
    void loadLocationPreferences();
  }, [loadLocationPreferences]);

  const paramLat = Number(params.lat);
  const paramLon = Number(params.lon);
  const activeLocation = Number.isFinite(paramLat) && Number.isFinite(paramLon)
    ? {
      lat: paramLat,
      lon: paramLon,
      label: params.location_label ?? "Selected location",
    }
    : useCustom && savedLocation
    ? savedLocation
    : null;

  const openFeature = (feature: FeatureGuide) => {
    hapticImpact(ImpactFeedbackStyle.Light);
    if (feature.module === "todays-bite" && activeLocation) {
      router.push({
        pathname: "/how-fishing",
        params: {
          lat: String(activeLocation.lat),
          lon: String(activeLocation.lon),
          location_label: activeLocation.label,
        },
      });
      return;
    }
    if (feature.module === "tackle-box" && activeLocation) {
      router.push({
        pathname: "/recommender",
        params: {
          latitude: String(activeLocation.lat),
          longitude: String(activeLocation.lon),
          location_label: activeLocation.label,
        },
      });
      return;
    }
    router.push(feature.route);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <View style={styles.screen}>
        <PaperNavHeader
          eyebrow="FINFINDR · FIELD GUIDE"
          eyebrowColor={paper.dashboardBlueLight}
          title="GETTING STARTED"
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <TopographicLines
              style={StyleSheet.absoluteFill}
              color={paper.dashboardBlue}
              count={7}
            />
            <CornerMarkSet color={paper.red} size={17} thickness={2} inset={12} />
            <View style={styles.heroPill}>
              <Ionicons name="compass-outline" size={13} color={paper.redDk} />
              <Text style={styles.heroPillText}>FOUR TOOLS · FOUR JOBS</Text>
            </View>
            <Text style={styles.heroTitle} allowFontScaling={false}>
              PICK A QUESTION.{"\n"}
              <Text style={styles.heroTitleAccent}>FIND YOUR TOOL.</Text>
            </Text>
            <Text style={styles.heroBody}>
              Each FinFindr feature answers a different question. Start with
              the one that matches yours.
            </Text>
            <View style={styles.questionStrip}>
              <QuestionCue icon="partly-sunny-outline" label="THE DAY" />
              <View style={styles.questionRule} />
              <QuestionCue icon="fish-outline" label="THE FISH" />
              <View style={styles.questionRule} />
              <QuestionCue icon="color-wand-outline" label="THE TACKLE" />
              <View style={styles.questionRule} />
              <QuestionCue icon="map-outline" label="THE WATER" />
            </View>
          </View>

          <View style={styles.guideIntro}>
            <SectionEyebrow
              dashes={false}
              align="left"
              color={paper.redDk}
              size={9.5}
              tracking={2.1}
            >
              THE FINFINDR FIELD GUIDE
            </SectionEyebrow>
            <Text style={styles.guideTitle}>What each feature is for.</Text>
            <Text style={styles.guideSubtitle}>
              A quick guide to getting started—without the engine-room
              details.
            </Text>
          </View>

          {FEATURE_GUIDES.map((feature) => (
            <FeatureCard
              key={feature.module}
              feature={feature}
              onOpen={() => openFeature(feature)}
            />
          ))}

          <View style={styles.truthCard}>
            <View style={styles.truthIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={17}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.truthCopy}>
              <Text style={styles.truthLabel}>THE BOTTOM LINE</Text>
              <Text style={styles.truthText}>
                FinFindr helps you make a better plan. Conditions, regulations,
                access, and safety still belong to the angler.
              </Text>
            </View>
          </View>

          <Text style={styles.footerStamp}>FINFINDR · CHOOSE WITH INTENT</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function QuestionCue({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.questionCue}>
      <Ionicons name={icon} size={13} color={paper.dashboardBlue} />
      <Text style={styles.questionCueText}>{label}</Text>
    </View>
  );
}

function FeatureCard({
  feature,
  onOpen,
}: {
  feature: FeatureGuide;
  onOpen: () => void;
}) {
  return (
    <View
      style={[
        styles.featureCard,
        feature.supporting && styles.featureCardSupporting,
      ]}
    >
      <TopographicLines
        style={StyleSheet.absoluteFill}
        color={feature.accent}
        count={feature.supporting ? 3 : 5}
      />
      <View style={[styles.featureRail, { backgroundColor: feature.accent }]} />
      <CornerMarkSet
        color={feature.accent}
        size={13}
        thickness={1.5}
        inset={10}
      />

      <View style={styles.featureTopRow}>
        <IntelligenceModuleEmblem
          module={feature.module}
          iconBg={feature.iconBg}
          iconBorder={feature.accent}
          iconColor={feature.iconColor}
          size={feature.supporting ? 48 : 54}
          animate={false}
        />
        <View style={styles.featureHeading}>
          <Text style={[styles.featureTag, { color: feature.accent }]}>
            {feature.tag}
          </Text>
          <Text style={styles.featureTitle} allowFontScaling={false}>
            {feature.title}
          </Text>
        </View>
        <View style={[styles.featureCode, { borderColor: feature.accent }]}>
          <Text style={[styles.featureCodeText, { color: feature.accent }]}>
            {feature.code}
          </Text>
        </View>
      </View>

      <Text style={styles.featureTagline}>{feature.tagline}</Text>

      <View style={styles.readSections}>
        <ReadSection
          icon="navigate-outline"
          label="WHEN TO USE IT"
          text={feature.whenToUse}
          accent={feature.accent}
          tint={feature.tint}
        />
        <ReadSection
          icon="layers-outline"
          label="HOW IT READS"
          text={feature.howItReads}
          accent={feature.accent}
          tint={feature.tint}
        />
        <ReadSection
          icon="chatbubble-ellipses-outline"
          label="GUIDE'S NOTE"
          text={feature.guidesNote}
          accent={feature.accent}
          tint={feature.tint}
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.openButton,
          { borderColor: feature.accent },
          pressed && { backgroundColor: feature.tint, opacity: 0.9 },
        ]}
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={feature.action}
      >
        <Text style={[styles.openButtonText, { color: feature.accent }]}>
          {feature.action}
        </Text>
        <Ionicons name="arrow-forward" size={15} color={feature.accent} />
      </Pressable>
    </View>
  );
}

function ReadSection({
  icon,
  label,
  text,
  accent,
  tint,
}: {
  icon: IconName;
  label: string;
  text: string;
  accent: string;
  tint: string;
}) {
  return (
    <View style={[styles.readSection, { backgroundColor: tint }]}>
      <View style={[styles.readSectionIcon, { borderColor: `${accent}38` }]}>
        <Ionicons name={icon} size={14} color={accent} />
      </View>
      <View style={styles.readSectionCopy}>
        <Text style={[styles.readSectionLabel, { color: accent }]}>{label}</Text>
        <Text style={styles.readSectionText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: paper.dashboardInk,
  },
  screen: {
    flex: 1,
    backgroundColor: paper.dashboardCream,
  },
  scroll: {
    flex: 1,
    backgroundColor: paper.dashboardCream,
  },
  scrollContent: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 56,
    gap: 16,
  },
  heroCard: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 27,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: "rgba(42,110,150,0.22)",
    borderRadius: paperRadius.card,
    backgroundColor: "#EAF3F7",
    ...paperShadows.hard,
  },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(192,57,43,0.22)",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.76)",
  },
  heroPillText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.4,
    color: paper.redDk,
  },
  heroTitle: {
    marginTop: 17,
    fontFamily: paperFonts.display,
    fontSize: 33,
    lineHeight: 36,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  heroTitleAccent: {
    color: paper.red,
  },
  heroBody: {
    maxWidth: 390,
    marginTop: 11,
    marginBottom: 22,
    fontFamily: paperFonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  questionStrip: {
    width: "100%",
    minHeight: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(42,110,150,0.18)",
  },
  questionCue: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  questionCueText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 0.8,
    color: paper.dashboardInk,
  },
  questionRule: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(42,110,150,0.18)",
  },
  guideIntro: {
    paddingHorizontal: 4,
    paddingTop: 6,
  },
  guideTitle: {
    marginTop: 7,
    fontFamily: paperFonts.display,
    fontSize: 27,
    lineHeight: 31,
    color: paper.dashboardInk,
  },
  guideSubtitle: {
    maxWidth: 430,
    marginTop: 7,
    fontFamily: paperFonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: paper.dashboardMuted,
  },
  featureCard: {
    position: "relative",
    overflow: "hidden",
    paddingHorizontal: 17,
    paddingTop: 18,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    backgroundColor: paper.dashboardWhite,
    ...paperShadows.hard,
  },
  featureCardSupporting: {
    backgroundColor: "#FBFCFC",
    shadowOpacity: 0.05,
    elevation: 1,
  },
  featureRail: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
  },
  featureTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 3,
  },
  featureHeading: {
    flex: 1,
    minWidth: 0,
  },
  featureTag: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    lineHeight: 12,
    letterSpacing: 1.4,
  },
  featureTitle: {
    marginTop: 3,
    fontFamily: paperFonts.display,
    fontSize: 25,
    lineHeight: 29,
    color: paper.dashboardInk,
  },
  featureCode: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.76)",
  },
  featureCodeText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 0.7,
  },
  featureTagline: {
    marginTop: 14,
    paddingHorizontal: 3,
    fontFamily: paperFonts.displayItalic,
    fontSize: 17,
    lineHeight: 22,
    color: paper.dashboardInk,
  },
  readSections: {
    gap: 8,
    marginTop: 14,
  },
  readSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderRadius: 8,
  },
  readSectionIcon: {
    width: 28,
    height: 28,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  readSectionCopy: {
    flex: 1,
    minWidth: 0,
  },
  readSectionLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    lineHeight: 11,
    letterSpacing: 1.3,
  },
  readSectionText: {
    marginTop: 4,
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.dashboardInk,
  },
  openButton: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.84)",
  },
  openButtonText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.2,
  },
  truthCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: paperSpacing.md,
    borderRadius: paperRadius.card,
    backgroundColor: paper.dashboardInk,
  },
  truthIcon: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  truthCopy: {
    flex: 1,
    minWidth: 0,
  },
  truthLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.5,
    color: paper.dashboardBlueLight,
  },
  truthText: {
    marginTop: 4,
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: "rgba(255,255,255,0.8)",
  },
  footerStamp: {
    marginTop: 4,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 2,
    textAlign: "center",
    color: "rgba(10,27,46,0.34)",
  },
});
