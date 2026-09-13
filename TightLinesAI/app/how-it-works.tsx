import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useId } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

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
import { isAdminEmail } from "../lib/adminAccess";
import { useAuthStore } from "../store/authStore";
import { useLocationStore } from "../store/locationStore";

type IconName = keyof typeof Ionicons.glyphMap;
type FeatureRoute =
  | "/how-fishing"
  | "/river-run"
  | "/recommender"
  | "/water-reader"
  | "/color-picker"
  | "/pier-cast-review";

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
  accentDeep: string;
  iconColor: string;
  tint: string;
  whenToUse: string;
  howItWorks: string;
  /** Omitted for tools that read water rather than fish. */
  bestFor?: {
    primary: string[];
    also?: string[];
    note?: string;
  };
  startHere?: boolean;
  supporting?: boolean;
  /** Gated to owner review until the feature clears its release gates. */
  ownerOnly?: boolean;
};

const FEATURE_GUIDES: FeatureGuide[] = [
  {
    code: "01",
    title: "Today's Bite",
    tag: "THE DAY",
    tagline: "Should I go, and when?",
    module: "todays-bite",
    route: "/how-fishing",
    action: "OPEN TODAY'S BITE",
    iconBg: ["#E5F2DD", "#C5E0B5"],
    accent: "#3D955A",
    accentDeep: "#1F6B38",
    iconColor: "#1F6B38",
    tint: "#F1F8ED",
    startHere: true,
    whenToUse:
      "You already know the lake or river. You want to know whether today is worth the trip, and which hours to fish.",
    howItWorks:
      "It reads the weather, pressure, wind and water for your spot, compares them to how your target species behaves in those conditions, and returns a 1\u201310 score, the best windows of the day, and the specific factors helping or hurting you.",
    bestFor: {
      primary: ["Largemouth", "Smallmouth", "Pike", "Walleye", "Panfish"],
      also: ["Trout"],
      note:
        "Trout reads are dependable from fall through spring. In summer heat, trust it for warmwater fish and treat coldwater species with caution.",
    },
  },
  {
    code: "02",
    title: "Tackle Box",
    tag: "THE TACKLE",
    tagline: "What should I tie on?",
    module: "tackle-box",
    route: "/recommender",
    action: "OPEN TACKLE BOX",
    iconBg: ["#FBF1D9", "#F4DFA4"],
    accent: "#C99B2D",
    accentDeep: "#8A6A1A",
    iconColor: "#8A6A1A",
    tint: "#FEF9EC",
    whenToUse:
      "You know the species and the water, and want a short starting list instead of second-guessing a full box.",
    howItWorks:
      "It narrows a reviewed lure and fly library by your species, water type, season, clarity and today's conditions, then ranks a handful of presentations and tells you why each one made the list.",
    bestFor: {
      primary: ["Largemouth", "Smallmouth", "Pike", "Walleye", "Panfish"],
      also: ["Trout"],
      note: "Fly picks are streamer patterns in this version.",
    },
  },
  {
    code: "03",
    title: "River Migration",
    tag: "THE RUN",
    tagline: "Where are the fish in the run?",
    module: "river-run",
    route: "/river-run",
    action: "OPEN RIVER MIGRATION",
    iconBg: ["#FBE4E1", "#F3C2BC"],
    accent: paper.red,
    accentDeep: "#9A2B20",
    iconColor: "#9A2B20",
    tint: "#FEF3F1",
    whenToUse:
      "A run is on and you want to know how far along it is before you drive. When a migration is your question, this is the read to trust \u2014 not Today's Bite.",
    howItWorks:
      "It pairs live gauge readings from that exact river \u2014 flow, height and water temperature \u2014 with researched run timing for that river and species. You get the migration stage, how active fish should be, whether the river is in fishable shape, and official fish counts wherever a facility publishes them.",
    bestFor: {
      primary: ["Chinook", "Coho", "Steelhead", "Brown Trout"],
      note:
        "Built river by river. Coverage is the supported Michigan rivers, not every stream.",
    },
  },
  {
    code: "04",
    title: "Pier Cast",
    tag: "THE PIER",
    tagline: "Which pier is worth the drive?",
    module: "pier-cast",
    route: "/pier-cast-review",
    action: "OPEN PIER CAST",
    iconBg: ["#E0F3F0", "#B8DFD8"],
    accent: "#318F83",
    accentDeep: "#20665E",
    iconColor: "#20665E",
    tint: "#EDF7F5",
    whenToUse:
      "You fish Great Lakes piers and want to know which port is best today \u2014 and whether any of them are worth the drive.",
    howItWorks:
      "Every supported pier city gets a 1\u201310 rating built from two things: how present a species should be that week of the season, and how well the nearshore water temperature suits it. You get the standings across all cities, then hour-by-hour water, air and wind for five days at whichever pier you open.",
    bestFor: {
      primary: ["Chinook", "Coho", "Steelhead", "Brown Trout"],
      note:
        "Lake Michigan pier cities: Ludington, Manistee, Frankfort\u2013Elberta, Grand Haven and Sheboygan.",
    },
  },
  {
    code: "05",
    title: "Color Match",
    tag: "THE COLOR",
    tagline: "Which color, and why?",
    module: "color-match",
    route: "/color-picker",
    action: "OPEN COLOR MATCH",
    iconBg: ["#FBEBDD", "#F3C9A7"],
    accent: "#D9772B",
    accentDeep: "#9B4E18",
    iconColor: "#9B4E18",
    tint: "#FEF4EA",
    whenToUse:
      "You've settled on a lure or fly, and clarity and light are the open questions.",
    howItWorks:
      "Tell it the bait type and whether the water is clear, stained or murky. It returns two colors that hold up in bright, direct sun and two for flat, overcast light \u2014 equal picks, not a ranking, because both conditions happen in one day.",
    bestFor: {
      primary: ["Largemouth", "Smallmouth", "Pike", "Walleye", "Panfish"],
      also: ["Trout"],
    },
  },
  {
    code: "06",
    title: "Water Read",
    tag: "THE WATER",
    tagline: "Where do I even start?",
    module: "water-read",
    route: "/water-reader",
    action: "OPEN WATER READ",
    iconBg: ["#E8F2FA", "#C8DFF2"],
    accent: paper.dashboardBlue,
    accentDeep: "#0A4A87",
    iconColor: "#0A4A87",
    tint: "#EFF6FB",
    supporting: true,
    whenToUse:
      "You're headed somewhere you've never fished and want a starting point before you launch.",
    howItWorks:
      "It studies the lake's shape and shoreline \u2014 points, bays, necks and islands \u2014 and marks the general zones worth checking for the season. It reads structure, not fish: it is not sonar, a depth chart, or a live position tool.",
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
  const user = useAuthStore((state) => state.user);
  const owner = isAdminEmail(user?.email);

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
          {/* ── Deep-water hero ─────────────────────────────────────── */}
          <View style={styles.heroCard}>
            <GuideBackdrop />
            <TopographicLines
              style={StyleSheet.absoluteFill}
              color={paper.dashboardBlueSky}
              count={7}
            />
            <SectionEyebrow color={paper.gold} size={9} tracking={2.6}>
              SIX TOOLS · SIX QUESTIONS
            </SectionEyebrow>
            <Text style={styles.heroTitle} allowFontScaling={false}>
              Start with your question.
            </Text>
            <Text style={styles.heroBody}>
              Each feature answers one thing well. Find the question you
              actually have, and the tool follows.
            </Text>
            <View style={styles.questionStrip}>
              {FEATURE_GUIDES.map((feature) => (
                <View key={feature.module} style={styles.questionCue}>
                  <View
                    style={[
                      styles.questionDot,
                      { backgroundColor: feature.accent },
                    ]}
                  />
                  <Text style={styles.questionCueText}>{feature.tag}</Text>
                </View>
              ))}
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
              Plain language, in the order most anglers need them.
            </Text>
          </View>

          {FEATURE_GUIDES.map((feature) => (
            <FeatureCard
              key={feature.module}
              feature={feature}
              locked={Boolean(feature.ownerOnly) && !owner}
              onOpen={() => openFeature(feature)}
            />
          ))}

          <View style={styles.truthCard}>
            <TopographicLines
              style={StyleSheet.absoluteFill}
              color={paper.dashboardBlueSky}
              count={4}
            />
            <View style={styles.truthIcon}>
              <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
            </View>
            <View style={styles.truthCopy}>
              <Text style={styles.truthLabel}>THE BOTTOM LINE</Text>
              <Text style={styles.truthText}>
                FinFindr helps you make a better plan. Conditions, regulations,
                access and safety still belong to the angler.
              </Text>
            </View>
          </View>

          <Text style={styles.footerStamp}>FINFINDR · CHOOSE WITH INTENT</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/** Deep-water gradient, matching the masthead language used across the app. */
function GuideBackdrop() {
  const baseId = useId();
  const deepId = `${baseId}-deep`;
  const glowId = `${baseId}-glow`;
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id={deepId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#0A1B2E" />
          <Stop offset="0.5" stopColor="#12384E" />
          <Stop offset="1" stopColor="#0B2135" />
        </LinearGradient>
        <LinearGradient id={glowId} x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor={paper.dashboardBlue} stopOpacity="0.45" />
          <Stop offset="1" stopColor={paper.dashboardBlue} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${deepId})`} />
      <Rect x="0" y="46%" width="100%" height="54%" fill={`url(#${glowId})`} />
    </Svg>
  );
}

/** Soft accent wash behind a feature card's header. */
function CardWash({ accent }: { accent: string }) {
  const baseId = useId();
  const washId = `${baseId}-wash`;
  return (
    <Svg style={styles.cardWash} pointerEvents="none">
      <Defs>
        <LinearGradient id={washId} x1="0" y1="0" x2="0.35" y2="1">
          <Stop offset="0" stopColor={accent} stopOpacity="0.14" />
          <Stop offset="1" stopColor={accent} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${washId})`} />
    </Svg>
  );
}

function FeatureCard({
  feature,
  locked,
  onOpen,
}: {
  feature: FeatureGuide;
  /** Feature exists but has not cleared its public release gates yet. */
  locked: boolean;
  onOpen: () => void;
}) {
  return (
    <View style={styles.featureCard}>
      <CardWash accent={feature.accent} />
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
          size={52}
          animate={false}
        />
        <View style={styles.featureHeading}>
          <View style={styles.featureTagRow}>
            <Text style={[styles.featureTag, { color: feature.accentDeep }]}>
              {feature.tag}
            </Text>
            {feature.startHere ? (
              <View style={styles.startHerePill}>
                <Text style={styles.startHereText}>START HERE</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.featureTitle} allowFontScaling={false}>
            {feature.title}
          </Text>
        </View>
        <Text style={[styles.featureCode, { color: `${feature.accent}66` }]}>
          {feature.code}
        </Text>
      </View>

      <Text style={styles.featureTagline}>{feature.tagline}</Text>

      <View style={styles.readSections}>
        <ReadSection
          icon="navigate"
          label="WHEN TO USE IT"
          text={feature.whenToUse}
          accent={feature.accentDeep}
          tint={feature.tint}
        />
        <ReadSection
          icon="layers"
          label="HOW IT WORKS"
          text={feature.howItWorks}
          accent={feature.accentDeep}
          tint={feature.tint}
        />
      </View>

      {feature.bestFor ? (
        <View style={styles.bestForBlock}>
          <View style={styles.bestForHeader}>
            <Ionicons name="fish" size={13} color={feature.accentDeep} />
            <Text style={[styles.bestForLabel, { color: feature.accentDeep }]}>
              BEST FOR
            </Text>
            <View
              style={[
                styles.bestForRule,
                { backgroundColor: `${feature.accent}33` },
              ]}
            />
          </View>
          <View style={styles.speciesChips}>
            {feature.bestFor.primary.map((name) => (
              <View
                key={name}
                style={[
                  styles.speciesChip,
                  {
                    backgroundColor: feature.tint,
                    borderColor: `${feature.accent}4D`,
                  },
                ]}
              >
                <Text
                  style={[styles.speciesChipText, { color: feature.accentDeep }]}
                >
                  {name}
                </Text>
              </View>
            ))}
            {feature.bestFor.also?.map((name) => (
              <View key={name} style={styles.speciesChipAlso}>
                <Text style={styles.speciesChipAlsoText}>{name}</Text>
              </View>
            ))}
          </View>
          {feature.bestFor.note ? (
            <Text style={styles.bestForNote}>{feature.bestFor.note}</Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.noSpeciesNote}>
          <Ionicons
            name="map"
            size={12}
            color={paper.dashboardMuted}
          />
          <Text style={styles.noSpeciesText}>
            Reads water, not species — it works the same whatever you're after.
          </Text>
        </View>
      )}

      {locked ? (
        <View
          style={[
            styles.lockedButton,
            { borderColor: `${feature.accent}4D`, backgroundColor: feature.tint },
          ]}
        >
          <Ionicons name="time" size={14} color={feature.accentDeep} />
          <Text style={[styles.lockedButtonText, { color: feature.accentDeep }]}>
            COMING SOON
          </Text>
        </View>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.openButton,
            { backgroundColor: feature.accentDeep },
            pressed && styles.openButtonPressed,
          ]}
          onPress={onOpen}
          accessibilityRole="button"
          accessibilityLabel={feature.action}
        >
          <Text style={styles.openButtonText}>{feature.action}</Text>
          <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
        </Pressable>
      )}
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
      <View style={styles.readSectionHeader}>
        <Ionicons name={icon} size={12} color={accent} />
        <Text style={[styles.readSectionLabel, { color: accent }]}>{label}</Text>
      </View>
      <Text style={styles.readSectionText}>{text}</Text>
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

  // ── Hero ───────────────────────────────────────────────────────────
  heroCard: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    backgroundColor: paper.dashboardInk,
    ...paperShadows.hard,
  },
  heroTitle: {
    marginTop: 12,
    fontFamily: paperFonts.display,
    fontSize: 31,
    lineHeight: 35,
    letterSpacing: -0.5,
    textAlign: "center",
    color: "#FFFFFF",
  },
  heroBody: {
    maxWidth: 380,
    marginTop: 10,
    marginBottom: 20,
    fontFamily: paperFonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: "center",
    color: "rgba(255,255,255,0.66)",
  },
  questionStrip: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.14)",
  },
  questionCue: {
    minWidth: 0,
    flex: 1,
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 2,
  },
  questionDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  questionCueText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: 0.9,
    textAlign: "center",
    color: "rgba(255,255,255,0.72)",
  },

  // ── Section intro ──────────────────────────────────────────────────
  guideIntro: {
    paddingHorizontal: 4,
    paddingTop: 6,
  },
  guideTitle: {
    marginTop: 7,
    fontFamily: paperFonts.display,
    fontSize: 27,
    lineHeight: 31,
    letterSpacing: -0.4,
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

  // ── Feature card ───────────────────────────────────────────────────
  featureCard: {
    position: "relative",
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    backgroundColor: paper.dashboardWhite,
    ...paperShadows.hard,
  },
  cardWash: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 150,
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
    paddingLeft: 4,
  },
  featureHeading: {
    minWidth: 0,
    flex: 1,
  },
  featureTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  featureTag: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    lineHeight: 12,
    letterSpacing: 1.4,
  },
  startHerePill: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderWidth: 1,
    borderColor: "rgba(200,53,44,0.32)",
    borderRadius: 3,
    backgroundColor: "#FDECEA",
  },
  startHereText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1,
    color: paper.redDk,
  },
  featureTitle: {
    marginTop: 3,
    fontFamily: paperFonts.display,
    fontSize: 25,
    lineHeight: 29,
    letterSpacing: -0.4,
    color: paper.dashboardInk,
  },
  featureCode: {
    fontFamily: paperFonts.monoBold,
    fontSize: 22,
    letterSpacing: -0.8,
  },
  featureTagline: {
    marginTop: 13,
    paddingLeft: 4,
    fontFamily: paperFonts.displayItalic,
    fontSize: 17,
    lineHeight: 22,
    color: paper.dashboardInk,
  },

  // ── Read sections ──────────────────────────────────────────────────
  readSections: {
    gap: 8,
    marginTop: 13,
  },
  readSection: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 9,
  },
  readSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  readSectionLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    lineHeight: 12,
    letterSpacing: 1.3,
  },
  readSectionText: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 19.5,
    color: paper.dashboardInk,
  },

  // ── Best for ───────────────────────────────────────────────────────
  bestForBlock: {
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardHair,
  },
  bestForHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  bestForLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.4,
  },
  bestForRule: {
    flex: 1,
    height: 1,
  },
  speciesChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  speciesChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 999,
  },
  speciesChipText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 12,
    lineHeight: 15,
  },
  speciesChipAlso: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderStyle: "dashed",
    borderRadius: 999,
    backgroundColor: "#FAFAF8",
  },
  speciesChipAlsoText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 12,
    lineHeight: 15,
    color: paper.dashboardMuted,
  },
  bestForNote: {
    marginTop: 9,
    fontFamily: paperFonts.body,
    fontSize: 11.5,
    lineHeight: 17,
    color: paper.dashboardMuted,
  },
  noSpeciesNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardHair,
  },
  noSpeciesText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 11.5,
    lineHeight: 17,
    color: paper.dashboardMuted,
  },

  // ── CTA ────────────────────────────────────────────────────────────
  openButton: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 15,
    borderRadius: 9,
  },
  lockedButton: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 15,
    borderWidth: 1,
    borderRadius: 9,
  },
  lockedButtonText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.4,
  },
  openButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.994 }],
  },
  openButtonText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.4,
    color: "#FFFFFF",
  },

  // ── Footer ─────────────────────────────────────────────────────────
  truthCard: {
    position: "relative",
    overflow: "hidden",
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
    minWidth: 0,
    flex: 1,
  },
  truthLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.5,
    color: paper.gold,
  },
  truthText: {
    marginTop: 5,
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18.5,
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
