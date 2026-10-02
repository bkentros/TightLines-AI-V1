import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useId, useRef } from "react";
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import {
  IntelligenceModuleEmblem,
  PaperNavHeader,
  TopographicLines,
  type IntelligenceModuleId,
} from "../components/paper";
import { isAdminEmail } from "../lib/adminAccess";
import { readPierCastTargetPreference } from "../lib/pierCastTargetPreference";
import { hapticImpact, ImpactFeedbackStyle } from "../lib/safeHaptics";
import { paper, paperFonts, paperRadius, paperShadows } from "../lib/theme";
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
  question: string;
  /** Two- or three-word cue for the index and the trip strip. */
  cue: string;
  summary: string;
  gets: { icon: IconName; label: string }[];
  worksOn: string;
  note?: string;
  module: IntelligenceModuleId;
  route: FeatureRoute;
  action: string;
  iconBg: [string, string];
  accent: string;
  accentDeep: string;
  tint: string;
  startHere?: boolean;
  /** Gated to owner review until the feature clears its release gates. */
  ownerOnly?: boolean;
};

// ── Artwork ───────────────────────────────────────────────────────────────
// Each entry records the source canvas and the visible subject's pixel box so
// artwork of different canvas sizes can be cropped to a consistent scale.

type Art = {
  source: ImageSourcePropType;
  canvas: [number, number];
  box: [number, number, number, number];
};

const ART = {
  largemouth: {
    source: require("../assets/images/fish/largemouth_bass.png"),
    canvas: [1024, 1024],
    box: [6, 278, 1015, 708],
  },
  smallmouth: {
    source: require("../assets/images/fish/smallmouth_bass.png"),
    canvas: [1024, 1024],
    box: [16, 265, 1015, 701],
  },
  steelhead: {
    source: require("../assets/images/fish/steelhead.png"),
    canvas: [1448, 1086],
    box: [25, 293, 1421, 801],
  },
  chinook: {
    source: require("../assets/images/fish/chinook_salmon.png"),
    canvas: [1254, 1254],
    box: [20, 357, 1241, 822],
  },
  coho: {
    source: require("../assets/images/fish/coho_salmon.png"),
    canvas: [1254, 1254],
    box: [27, 336, 1219, 872],
  },
  pike: {
    source: require("../assets/images/fish/northern_pike.png"),
    canvas: [2056, 765],
    box: [41, 21, 2026, 741],
  },
  river: {
    source: require("../assets/images/river-run/river_large.png"),
    canvas: [512, 312],
    box: [6, 55, 506, 250],
  },
  squarebill: {
    source: require(
      "../assets/images/recommender/illustrated/squarebill_crankbait.png",
    ),
    canvas: [960, 960],
    box: [0, 0, 960, 960],
  },
  clouser: {
    source: require(
      "../assets/images/recommender/illustrated/clouser_minnow.png",
    ),
    canvas: [960, 960],
    box: [0, 0, 960, 960],
  },
  crankbait: {
    source: require("../assets/images/color-picker/illustrated/crankbait.png"),
    canvas: [768, 768],
    box: [0, 0, 768, 768],
  },
  // Water clarity scenes: the painted circle sits inside a white square.
  clear: {
    source: require("../assets/images/color-picker/illustrated/clear.png"),
    canvas: [768, 768],
    box: [64, 64, 704, 704],
  },
  stained: {
    source: require("../assets/images/color-picker/illustrated/stained.png"),
    canvas: [768, 768],
    box: [76, 76, 692, 692],
  },
  dirty: {
    source: require("../assets/images/color-picker/illustrated/dirty.png"),
    canvas: [768, 768],
    box: [52, 52, 716, 716],
  },
} satisfies Record<string, Art>;

const LIVE_MAP_PREVIEW = require(
  "../assets/images/pier-cast-live-map-preview.jpg",
);
const WATER_READ_SAMPLE = require(
  "../assets/images/water-reader-pontiac-sample.png",
);

// ── Content ──────────────────────────────────────────────────────────────

const EVERY_TRIP: FeatureGuide[] = [
  {
    code: "01",
    title: "Today's Bite",
    tag: "THE DAY",
    question: "Should I go, and when?",
    cue: "Go or not",
    summary:
      "Scores today for your spot from the weather, pressure, wind and water.",
    gets: [
      { icon: "speedometer-outline", label: "Day score 1–10" },
      { icon: "time-outline", label: "Best windows" },
      { icon: "pulse-outline", label: "What helps or hurts" },
    ],
    worksOn: "Lakes, ponds, rivers and the coast",
    note:
      "Trout reads are dependable from fall through spring. In summer heat, trust it for warmwater fish and treat coldwater species with caution.",
    module: "todays-bite",
    route: "/how-fishing",
    action: "Open Today's Bite",
    iconBg: ["#E5F2DD", "#C5E0B5"],
    accent: "#3D955A",
    accentDeep: "#1F6B38",
    tint: "#EEF6E9",
    startHere: true,
  },
  {
    code: "02",
    title: "Tackle Box",
    tag: "THE TACKLE",
    question: "What should I tie on?",
    cue: "What to throw",
    summary:
      "A short list of lures and flies matched to your fish, your water and today's conditions.",
    gets: [
      { icon: "list-outline", label: "Ranked picks" },
      { icon: "chatbubble-ellipses-outline", label: "Why each works" },
      { icon: "fish-outline", label: "Lures and flies" },
    ],
    worksOn: "Largemouth, smallmouth, pike and trout",
    note: "Fly picks are streamer patterns.",
    module: "tackle-box",
    route: "/recommender",
    action: "Open Tackle Box",
    iconBg: ["#FBF1D9", "#F4DFA4"],
    accent: "#C99B2D",
    accentDeep: "#8A6A1A",
    tint: "#FCF6E6",
  },
  {
    code: "03",
    title: "Color Match",
    tag: "THE COLOR",
    question: "Which color, and why?",
    cue: "Which color",
    summary:
      "Pick your bait and the water clarity. Get colors for bright sun and for cloud cover.",
    gets: [
      { icon: "sunny-outline", label: "2 for sun" },
      { icon: "cloudy-outline", label: "2 for clouds" },
      { icon: "water-outline", label: "Clear to muddy" },
    ],
    worksOn: "Soft plastics, hard baits, jigs and flies",
    module: "color-match",
    route: "/color-picker",
    action: "Open Color Match",
    iconBg: ["#FBEBDD", "#F3C9A7"],
    accent: "#D9772B",
    accentDeep: "#9B4E18",
    tint: "#FDF1E6",
  },
];

const GO_DEEPER: FeatureGuide[] = [
  {
    code: "04",
    title: "River Migration",
    tag: "THE RUN",
    question: "Where is the run right now?",
    cue: "Where's the run",
    summary:
      "Live gauge readings paired with researched run timing for that exact river.",
    gets: [
      { icon: "git-commit-outline", label: "Run stage" },
      { icon: "flash-outline", label: "Fish activity" },
      { icon: "water-outline", label: "River shape" },
    ],
    worksOn:
      "Salmon, steelhead and lake-run browns on supported Great Lakes and Pacific Northwest rivers",
    note: "When a run is your question, trust this over Today's Bite.",
    module: "river-run",
    route: "/river-run",
    action: "Open River Migration",
    iconBg: ["#FBE4E1", "#F3C2BC"],
    accent: paper.red,
    accentDeep: "#9A2B20",
    tint: "#FDF0EE",
  },
  {
    code: "05",
    title: "PierCast",
    tag: "THE PIER",
    question: "Which pier is worth the drive?",
    cue: "Which pier",
    summary:
      "Ranks Great Lakes pier cities for your target fish by season and nearshore water temperature.",
    gets: [
      { icon: "podium-outline", label: "City rankings" },
      { icon: "thermometer-outline", label: "5-day water temps" },
      { icon: "map-outline", label: "Live lake map" },
    ],
    worksOn:
      "32 pier cities on Lakes Michigan and Huron. The live map covers all five Great Lakes.",
    module: "pier-cast",
    route: "/pier-cast-review",
    action: "Open PierCast",
    iconBg: ["#E0F3F0", "#B8DFD8"],
    accent: "#318F83",
    accentDeep: "#20665E",
    tint: "#EAF5F3",
  },
  {
    code: "06",
    title: "Water Read",
    tag: "THE WATER",
    question: "Where do I start on new water?",
    cue: "New water",
    summary:
      "Maps a lake's points, bays, necks and islands, and marks the zones worth checking this season.",
    gets: [
      { icon: "map-outline", label: "Zone map" },
      { icon: "leaf-outline", label: "Seasonal focus" },
      { icon: "compass-outline", label: "Any species" },
    ],
    worksOn: "Reads shape, not fish. It is not sonar or a depth chart.",
    module: "water-read",
    route: "/water-reader",
    action: "Open Water Read",
    iconBg: ["#E8F2FA", "#C8DFF2"],
    accent: paper.dashboardBlue,
    accentDeep: "#0A4A87",
    tint: "#ECF4FA",
  },
];

const ALL_FEATURES = [...EVERY_TRIP, ...GO_DEEPER];

const TRIP_STEPS: IntelligenceModuleId[] = ["todays-bite", "tackle-box", "color-match"];

// ── Screen ───────────────────────────────────────────────────────────────

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
  const scrollRef = useRef<ScrollView>(null);
  const cardOffsets = useRef<Partial<Record<IntelligenceModuleId, number>>>({});

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

  const openLiveMap = () => {
    hapticImpact(ImpactFeedbackStyle.Light);
    void readPierCastTargetPreference().then((speciesId) => {
      router.push({
        pathname: "/pier-cast-map",
        params: speciesId ? { speciesId } : {},
      });
    });
  };

  const jumpTo = useCallback((module: IntelligenceModuleId) => {
    hapticImpact(ImpactFeedbackStyle.Light);
    const y = cardOffsets.current[module];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
    }
  }, []);

  const renderCard = (feature: FeatureGuide) => (
    <View
      key={feature.module}
      onLayout={(event) => {
        cardOffsets.current[feature.module] = event.nativeEvent.layout.y;
      }}
    >
      <FeatureCard
        feature={feature}
        locked={Boolean(feature.ownerOnly) && !owner}
        onOpen={() => openFeature(feature)}
        onOpenMap={feature.module === "pier-cast" ? openLiveMap : undefined}
      />
    </View>
  );

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
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Hero onJump={jumpTo} />

          <TripStrip onJump={jumpTo} />

          <SectionLabel
            title="Every trip"
            caption="Plan the day, the bait and the color."
          />
          {EVERY_TRIP.map(renderCard)}

          <SectionLabel
            title="Go deeper"
            caption="Runs, piers and new water."
          />
          {GO_DEEPER.map(renderCard)}

          <View style={styles.bottomLine}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={paper.dashboardBlueLight}
            />
            <Text style={styles.bottomLineText}>
              FinFindr helps you plan. Regulations, access and safety are
              always yours to check.
            </Text>
          </View>

          <Text style={styles.footerStamp}>FINFINDR · CHOOSE WITH INTENT</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────

function Hero({ onJump }: { onJump: (module: IntelligenceModuleId) => void }) {
  return (
    <View style={styles.hero}>
      <DeepWater />
      <TopographicLines
        style={StyleSheet.absoluteFill}
        color={paper.dashboardBlueSky}
        count={6}
      />

      <View style={styles.heroCopy}>
        <Text style={styles.heroEyebrow}>THE FINFINDR FIELD GUIDE</Text>
        <Text style={styles.heroTitle} allowFontScaling={false}>
          Six tools.{"\n"}One answer each.
        </Text>
        <Text style={styles.heroBody}>
          Start with the question you have today.
        </Text>
      </View>

      <View style={styles.heroSchool} pointerEvents="none">
        <ArtImage art={ART.chinook} width={128} style={styles.heroFishBack} />
        <ArtImage art={ART.steelhead} width={170} style={styles.heroFishMid} />
        <ArtImage
          art={ART.largemouth}
          width={150}
          style={styles.heroFishFront}
        />
      </View>

      <View style={styles.heroIndex}>
        {ALL_FEATURES.map((feature) => (
          <Pressable
            key={feature.module}
            onPress={() => onJump(feature.module)}
            style={({ pressed }) => [
              styles.heroIndexItem,
              pressed && styles.heroIndexItemPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Jump to ${feature.title}: ${feature.question}`}
          >
            <View
              style={[styles.heroIndexDot, { backgroundColor: feature.accent }]}
            />
            <View style={styles.heroIndexText}>
              <Text style={styles.heroIndexTitle} numberOfLines={1}>
                {feature.title}
              </Text>
              <Text style={styles.heroIndexQuestion} numberOfLines={1}>
                {feature.cue}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/** Deep-water gradient matching the masthead language used across the app. */
function DeepWater() {
  const baseId = useId();
  const deepId = `${baseId}-deep`;
  const glowId = `${baseId}-glow`;
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      pointerEvents="none"
    >
      <Defs>
        <LinearGradient id={deepId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#0A1B2E" />
          <Stop offset="0.55" stopColor="#12384E" />
          <Stop offset="1" stopColor="#0B2135" />
        </LinearGradient>
        <LinearGradient id={glowId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={paper.dashboardBlue} stopOpacity="0" />
          <Stop offset="0.5" stopColor={paper.dashboardBlue} stopOpacity="0.4" />
          <Stop offset="1" stopColor={paper.dashboardBlue} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${deepId})`} />
      <Rect x="0" y="22%" width="100%" height="40%" fill={`url(#${glowId})`} />
    </Svg>
  );
}

// ── Three-tap trip ───────────────────────────────────────────────────────

function TripStrip({
  onJump,
}: {
  onJump: (module: IntelligenceModuleId) => void;
}) {
  return (
    <View style={styles.trip}>
      <Text style={styles.tripTitle}>A trip in three taps</Text>
      <View style={styles.tripRow}>
        {TRIP_STEPS.map((module, index) => {
          const feature = ALL_FEATURES.find((f) => f.module === module)!;
          return (
            <View key={module} style={styles.tripStepWrap}>
              <Pressable
                style={({ pressed }) => [
                  styles.tripStep,
                  pressed && styles.tripStepPressed,
                ]}
                onPress={() => onJump(module)}
                accessibilityRole="button"
                accessibilityLabel={`Step ${index + 1}: ${feature.title}, ${feature.cue}`}
              >
                <IntelligenceModuleEmblem
                  module={feature.module}
                  iconBg={feature.iconBg}
                  iconBorder={feature.accent}
                  iconColor={feature.accentDeep}
                  size={38}
                  animate={false}
                />
                <Text style={styles.tripStepTitle} numberOfLines={1}>
                  {feature.title}
                </Text>
                <Text
                  style={[styles.tripStepCue, { color: feature.accentDeep }]}
                  numberOfLines={1}
                >
                  {feature.cue}
                </Text>
              </Pressable>
              {index < TRIP_STEPS.length - 1 ? (
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color="rgba(10,27,46,0.28)"
                  style={styles.tripArrow}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function SectionLabel({ title, caption }: { title: string; caption: string }) {
  return (
    <View style={styles.sectionLabel}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCaption}>{caption}</Text>
    </View>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────

function FeatureCard({
  feature,
  locked,
  onOpen,
  onOpenMap,
}: {
  feature: FeatureGuide;
  /** Feature exists but has not cleared its public release gates yet. */
  locked: boolean;
  onOpen: () => void;
  onOpenMap?: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.stage, { backgroundColor: feature.tint }]}>
        <FeatureStage feature={feature} />
        <View style={styles.stageEmblem}>
          <IntelligenceModuleEmblem
            module={feature.module}
            iconBg={feature.iconBg}
            iconBorder={feature.accent}
            iconColor={feature.accentDeep}
            size={40}
            animate={false}
          />
        </View>
        {feature.startHere ? (
          <View style={styles.startHere}>
            <Text style={styles.startHereText}>START HERE</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.cardTag, { color: feature.accentDeep }]}>
          {feature.code} · {feature.tag}
        </Text>
        <Text style={styles.cardTitle} allowFontScaling={false}>
          {feature.title}
        </Text>
        <Text style={styles.cardQuestion}>{feature.question}</Text>
        <Text style={styles.cardSummary}>{feature.summary}</Text>

        <View style={styles.gets}>
          {feature.gets.map((item) => (
            <View key={item.label} style={styles.getItem}>
              <View style={[styles.getIcon, { backgroundColor: feature.tint }]}>
                <Ionicons name={item.icon} size={16} color={feature.accentDeep} />
              </View>
              <Text style={styles.getLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.worksOn}>
          <Ionicons
            name="checkmark-circle"
            size={14}
            color={feature.accent}
            style={styles.worksOnIcon}
          />
          <View style={styles.worksOnCopy}>
            <Text style={styles.worksOnText}>{feature.worksOn}</Text>
            {feature.note ? (
              <Text style={styles.worksOnNote}>{feature.note}</Text>
            ) : null}
          </View>
        </View>

        {locked ? (
          <View
            style={[
              styles.lockedButton,
              { borderColor: `${feature.accent}4D`, backgroundColor: feature.tint },
            ]}
          >
            <Ionicons name="time-outline" size={15} color={feature.accentDeep} />
            <Text style={[styles.lockedText, { color: feature.accentDeep }]}>
              Coming soon
            </Text>
          </View>
        ) : (
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.openButton,
                { backgroundColor: feature.accentDeep },
                pressed && styles.pressed,
              ]}
              onPress={onOpen}
              accessibilityRole="button"
              accessibilityLabel={feature.action}
            >
              <Text style={styles.openButtonText}>{feature.action}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </Pressable>
            {onOpenMap ? (
              <Pressable
                style={({ pressed }) => [
                  styles.mapButton,
                  { borderColor: `${feature.accent}66` },
                  pressed && styles.pressed,
                ]}
                onPress={onOpenMap}
                accessibilityRole="button"
                accessibilityLabel="Open the Great Lakes live map"
              >
                <Ionicons name="map-outline" size={16} color={feature.accentDeep} />
                <Text style={[styles.mapButtonText, { color: feature.accentDeep }]}>
                  Live map
                </Text>
              </Pressable>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
}

/** The illustrated stage at the top of each card. */
function FeatureStage({ feature }: { feature: FeatureGuide }) {
  switch (feature.module) {
    case "todays-bite":
      return (
        <>
          <StageGlow color={feature.accent} />
          <ArtImage art={ART.smallmouth} width={150} style={styles.biteBack} />
          <ArtImage art={ART.largemouth} width={210} style={styles.biteFront} />
        </>
      );
    case "tackle-box":
      return (
        <>
          <StageGlow color={feature.accent} />
          <View style={[styles.plate, styles.tacklePlateBack]}>
            <ArtImage art={ART.clouser} width={124} />
          </View>
          <View style={[styles.plate, styles.tacklePlateFront]}>
            <ArtImage art={ART.squarebill} width={138} />
          </View>
        </>
      );
    case "color-match":
      return (
        <>
          <StageGlow color={feature.accent} />
          <View style={[styles.plate, styles.colorPlate]}>
            <ArtImage art={ART.crankbait} width={140} />
          </View>
          <View style={styles.clarityRow}>
            {(
              [
                [ART.clear, "CLEAR"],
                [ART.stained, "STAINED"],
                [ART.dirty, "MUDDY"],
              ] as const
            ).map(([art, label]) => (
              <View key={label} style={styles.clarityItem}>
                <View style={styles.clarityDisc}>
                  <ArtImage art={art} width={46} />
                </View>
                <Text style={styles.clarityLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </>
      );
    case "river-run":
      return (
        <>
          <ArtImage art={ART.river} width={330} style={styles.riverBed} />
          <ArtImage art={ART.chinook} width={128} style={styles.riverFishBack} />
          <ArtImage art={ART.steelhead} width={150} style={styles.riverFishFront} />
        </>
      );
    case "pier-cast":
      return (
        <>
          <View style={styles.pierWater} />
          <TopographicLines
            style={StyleSheet.absoluteFill}
            color={paper.dashboardBlueSky}
            count={4}
          />
          <View style={styles.pierPhone}>
            <Image
              source={LIVE_MAP_PREVIEW}
              style={styles.pierPhoneImage}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
          </View>
          <ArtImage art={ART.coho} width={170} style={styles.pierFish} />
        </>
      );
    case "water-read":
      return (
        <Image
          source={WATER_READ_SAMPLE}
          style={styles.waterSample}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      );
    default:
      return null;
  }
}

/** Soft radial-feeling pool of accent color behind stage artwork. */
function StageGlow({ color }: { color: string }) {
  const baseId = useId();
  const glowId = `${baseId}-glow`;
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      pointerEvents="none"
    >
      <Defs>
        <LinearGradient id={glowId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0" />
          <Stop offset="1" stopColor={color} stopOpacity="0.16" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${glowId})`} />
    </Svg>
  );
}

/** Crops artwork to its visible subject and scales it to `width`. */
function ArtImage({
  art,
  width,
  style,
}: {
  art: Art;
  width: number;
  style?: ViewStyle;
}) {
  const [x0, y0, x1, y1] = art.box;
  const scale = width / (x1 - x0);
  return (
    <View
      style={[
        { width, height: (y1 - y0) * scale, overflow: "hidden" },
        style,
      ]}
      pointerEvents="none"
    >
      <Image
        source={art.source}
        style={{
          position: "absolute",
          left: -x0 * scale,
          top: -y0 * scale,
          width: art.canvas[0] * scale,
          height: art.canvas[1] * scale,
        }}
        resizeMode="stretch"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────

const STAGE_HEIGHT = 172;

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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 56,
    gap: 16,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  // ── Hero ───────────────────────────────────────────────────────────
  hero: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: paper.dashboardInk,
    ...paperShadows.lift,
  },
  heroCopy: {
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  heroEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 2.2,
    color: paper.gold,
  },
  heroTitle: {
    marginTop: 10,
    fontFamily: paperFonts.display,
    fontSize: 34,
    lineHeight: 37,
    letterSpacing: -0.6,
    color: "#FFFFFF",
  },
  heroBody: {
    marginTop: 8,
    fontFamily: paperFonts.body,
    fontSize: 14.5,
    lineHeight: 20,
    color: "rgba(255,255,255,0.7)",
  },
  heroSchool: {
    height: 128,
    marginTop: 6,
  },
  heroFishBack: {
    position: "absolute",
    right: 20,
    top: -2,
    opacity: 0.55,
    transform: [{ rotate: "-4deg" }],
  },
  heroFishMid: {
    position: "absolute",
    left: 22,
    top: 30,
    opacity: 0.85,
  },
  heroFishFront: {
    position: "absolute",
    right: 26,
    top: 62,
    transform: [{ rotate: "3deg" }],
  },
  heroIndex: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(4,14,26,0.35)",
  },
  heroIndexItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  heroIndexItemPressed: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroIndexDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  heroIndexText: {
    minWidth: 0,
    flex: 1,
  },
  heroIndexTitle: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 13,
    lineHeight: 17,
    color: "#FFFFFF",
  },
  heroIndexQuestion: {
    fontFamily: paperFonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: "rgba(255,255,255,0.55)",
  },

  // ── Trip strip ─────────────────────────────────────────────────────
  trip: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    ...paperShadows.hard,
  },
  tripTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: paper.dashboardMuted,
    textAlign: "center",
  },
  tripRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  tripStepWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  tripStep: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tripStepPressed: {
    backgroundColor: "rgba(10,27,46,0.05)",
  },
  tripStepTitle: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 12.5,
    lineHeight: 16,
    color: paper.dashboardInk,
  },
  tripStepCue: {
    marginTop: -4,
    fontFamily: paperFonts.displayItalic,
    fontSize: 13,
    lineHeight: 17,
  },
  tripArrow: {
    marginHorizontal: -2,
    marginTop: -18,
  },

  // ── Section labels ─────────────────────────────────────────────────
  sectionLabel: {
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  sectionTitle: {
    fontFamily: paperFonts.display,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.4,
    color: paper.dashboardInk,
  },
  sectionCaption: {
    marginTop: 3,
    fontFamily: paperFonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: paper.dashboardMuted,
  },

  // ── Card ───────────────────────────────────────────────────────────
  card: {
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    ...paperShadows.hard,
  },
  stage: {
    position: "relative",
    height: STAGE_HEIGHT,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  stageEmblem: {
    position: "absolute",
    left: 12,
    top: 12,
  },
  startHere: {
    position: "absolute",
    right: 12,
    top: 14,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: paper.dashboardInk,
  },
  startHereText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.3,
    color: "#FFFFFF",
  },
  cardBody: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },
  cardTag: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.6,
  },
  cardTitle: {
    marginTop: 4,
    fontFamily: paperFonts.display,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: paper.dashboardInk,
  },
  cardQuestion: {
    marginTop: 2,
    fontFamily: paperFonts.displayItalic,
    fontSize: 17,
    lineHeight: 23,
    color: paper.dashboardInk,
    opacity: 0.78,
  },
  cardSummary: {
    marginTop: 10,
    fontFamily: paperFonts.body,
    fontSize: 14.5,
    lineHeight: 21,
    color: "#2F3A45",
  },
  gets: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  getItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  getIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
  },
  getLabel: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  worksOn: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    marginTop: 16,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardHair,
  },
  worksOnIcon: {
    marginTop: 2,
  },
  worksOnCopy: {
    minWidth: 0,
    flex: 1,
    gap: 2,
  },
  worksOnText: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 13,
    lineHeight: 19,
    color: paper.dashboardInk,
  },
  worksOnNote: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.dashboardMuted,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  openButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
  },
  openButtonText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 15,
    color: "#FFFFFF",
  },
  mapButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: paper.dashboardWhite,
  },
  mapButtonText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 14,
  },
  lockedButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 12,
  },
  lockedText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 14,
  },

  // ── Stage art ──────────────────────────────────────────────────────
  biteBack: {
    position: "absolute",
    right: 22,
    top: 26,
    opacity: 0.5,
    transform: [{ rotate: "-5deg" }],
  },
  biteFront: {
    position: "absolute",
    left: "50%",
    marginLeft: -118,
    top: 58,
    transform: [{ rotate: "2deg" }],
  },
  plate: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "#FEFEFE",
    borderWidth: 1,
    borderColor: "rgba(10,27,46,0.08)",
    ...paperShadows.hard,
  },
  tacklePlateBack: {
    width: 118,
    height: 118,
    left: "50%",
    marginLeft: -2,
    top: 30,
  },
  tacklePlateFront: {
    width: 132,
    height: 132,
    left: "50%",
    marginLeft: -116,
    top: 22,
  },
  colorPlate: {
    width: 132,
    height: 132,
    left: "50%",
    marginLeft: -136,
    top: 20,
  },
  clarityRow: {
    position: "absolute",
    left: "50%",
    marginLeft: 12,
    top: 46,
    flexDirection: "row",
    gap: 10,
  },
  clarityItem: {
    alignItems: "center",
    gap: 6,
  },
  clarityDisc: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    ...paperShadows.hard,
  },
  clarityLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1,
    color: "#9B4E18",
  },
  riverBed: {
    position: "absolute",
    left: "50%",
    marginLeft: -165,
    top: 16,
    opacity: 0.9,
  },
  riverFishBack: {
    position: "absolute",
    left: "50%",
    marginLeft: 8,
    top: 42,
    transform: [{ rotate: "-6deg" }],
  },
  riverFishFront: {
    position: "absolute",
    left: "50%",
    marginLeft: -128,
    top: 86,
    transform: [{ rotate: "-3deg" }],
  },
  pierWater: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0D2A40",
  },
  pierPhone: {
    position: "absolute",
    left: "50%",
    marginLeft: 22,
    top: 18,
    width: 104,
    height: 168,
    overflow: "hidden",
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.9)",
    backgroundColor: "#0A1B2E",
    ...paperShadows.lift,
  },
  pierPhoneImage: {
    width: 98,
    height: 212,
    marginTop: -6,
  },
  pierFish: {
    position: "absolute",
    left: "50%",
    marginLeft: -152,
    top: 62,
  },
  waterSample: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -58,
    height: 290,
    width: "100%",
  },

  // ── Footer ─────────────────────────────────────────────────────────
  bottomLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 6,
    padding: 16,
    borderRadius: paperRadius.card + 4,
    backgroundColor: paper.dashboardInk,
  },
  bottomLineText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: "rgba(255,255,255,0.82)",
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
