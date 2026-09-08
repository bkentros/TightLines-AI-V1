import {
  CornerMarkSet,
  PaperBackground,
  SectionEyebrow,
  TopographicLines,
} from "../components/paper";
import {
  colorChoiceForType,
  colorPickerCatalog as catalog,
  colorTypeThumbnail,
} from "../lib/colorPickerCatalog";
import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Crypto from "expo-crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperNavHeader } from "../components/paper/PaperNavHeader";
import { SubscribePrompt } from "../components/SubscribePrompt";
import { ColorPickerView, ColorPickerLoadingSkeleton } from "../components/fishing/ColorPickerView";
import {
  generateColorReport,
  reopenColorReport,
  type ReportEnvelope,
  type ReportRequest,
} from "../lib/colorPicker";
import { COLOR_CLARITY_THUMBNAILS } from "../lib/colorPickerImages";
import { paper, paperFonts, paperShadows, paperSpacing, paperRadius } from "../lib/theme";
import { useAuthStore } from "../store/authStore";
type Clarity = "clear" | "stained" | "dirty";
const today = (zone: string) => {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  return ["year", "month", "day"].map((k) => p.find((x) => x.type === k)?.value)
    .join("-");
};
export default function ColorPickerScreen() {
  const params = useLocalSearchParams<
    {
      typeId?: string;
      reportId?: string;
    }
  >();
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const owner = useRef(userId);
  owner.current = userId;
  const initial = params.typeId ? colorChoiceForType(params.typeId) : undefined;
  const [step, setStep] = useState<"category" | "bait" | "clarity" | "result">(
    initial ? "clarity" : "category",
  );
  const [category, setCategory] = useState(
    initial?.categoryId ?? "",
  );
  const baitScroll = useRef(0);
  const [typeId, setTypeId] = useState(initial?.id ?? "");
  const [clarity, setClarity] = useState<Clarity | null>(null);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const reveal = useRef(new Animated.Value(1)).current;
  const reduceMotion = useRef(true);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) reduceMotion.current = value;
    });
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (value) => {
        reduceMotion.current = value;
      },
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  const [busyLabel, setBusyLabel] = useState("Finding your daily colors…");
  useEffect(() => {
    requestAnimationFrame(() => scrollRef.current?.scrollTo({
      y: step === "bait" ? baitScroll.current : 0,
      animated: false,
    }));
    reveal.stopAnimation();
    reveal.setValue(reduceMotion.current ? 1 : 0);
    if (!reduceMotion.current) {
      Animated.timing(reveal, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [step, busy]);
  const [error, setError] = useState("");
  const [report, setReport] = useState<ReportEnvelope | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [paywall, setPaywall] = useState(false);
  const pending = useRef<{ key: string; request: ReportRequest } | null>(null);
  const running = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const back = () => {
    if (busy) return;
    if (step === "result") editReport();
    else if (step === "clarity") setStep("bait");
    else if (step === "bait") setStep("category");
    else router.back();
  };
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      back();
      return true;
    });
    return () => sub.remove();
  }, [step, busy]);
  useEffect(() => {
    let active = true;
    setReport(null);
    setStep(initial ? "clarity" : "category");
    setSavedId(null);
    pending.current = null;
    if (userId) {
      AsyncStorage.getItem(`color-picker-last:${userId}`).then((id) => {
        if (active) setSavedId(id);
      }).catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [userId]);
  async function load(id: string) {
    setBusyLabel("Opening your saved colors…");
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setError("");
    try {
      const r = await reopenColorReport(id);
      if (mounted.current && r.selection.report.userId === owner.current) {
        setReport(r);
        setTypeId(colorChoiceForType(r.request.typeId)?.id ?? "");
        setCategory(colorChoiceForType(r.request.typeId)?.categoryId ?? "");
        setClarity(r.request.clarity);
        setStep("result");
      }
    } catch (e) {
      if (mounted.current) {
        setError(e instanceof Error ? e.message : "Could not reopen report.");
      }
    } finally {
      running.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  useEffect(() => {
    if (params.reportId && userId) void load(params.reportId);
  }, [params.reportId, userId]);
  async function generate() {
    setBusyLabel("Finding your daily colors…");
    const selectedClarity = clarity;
    if (running.current || !typeId || !selectedClarity) return;
    running.current = true;
    setBusy(true);
    setError("");
    try {
      const requestZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const base = {
        typeId,
        clarity: selectedClarity,
        date: today(requestZone),
        timezone: requestZone,
      };
      const key = JSON.stringify(base);
      if (!pending.current || pending.current.key !== key) {
        pending.current = {
          key,
          request: { ...base, requestId: Crypto.randomUUID() },
        };
      }
      const result = await generateColorReport(pending.current.request);
      pending.current = null;
      if (mounted.current && result.selection.report.userId === owner.current) {
        setReport(result);
        setTypeId(result.request.typeId);
        setClarity(result.request.clarity);
        setCategory(colorChoiceForType(result.request.typeId)?.categoryId ?? "");
        setStep("result");
        setSavedId(result.selection.report.reportId);
      }
      if (userId && result.selection.report.userId === userId) {
        await AsyncStorage.setItem(
          `color-picker-last:${userId}`,
          result.selection.report.reportId,
        ).catch(() => {});
      }
    } catch (e) {
      const message = e instanceof Error
        ? e.message
        : "Unable to build your colors.";
      if (mounted.current) {
        setError(message);
        if (/subscription|Angler subscription/i.test(message)) setPaywall(true);
      }
    } finally {
      running.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  const sections = catalog.categories.map(c => ({
    ...c,
    types: catalog.baitTypes.filter(t => t.categoryId === c.id && c.id === category),
  })).filter(c => c.types.length > 0);
  const resultCount = sections.reduce((count, c) => count + c.types.length, 0);
  const chooseBait = (id: string) => {
    setTypeId(id);
    setError("");
  };
  const selectedBait = colorChoiceForType(typeId);
  const stage = step === "category" ? 0 : step === "bait" ? 1 : step === "clarity" ? 2 : 3;
  const action = (
    label: string,
    onPress: () => void,
    disabled = false,
    secondary = false,
  ) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || busy }}
      disabled={disabled || busy}
      onPress={() => {
        onPress();
      }}
      style={(
        { pressed },
      ) => [
        s.action,
        secondary ? s.actionSecondary : s.actionPrimary,
        (disabled || busy) && s.actionDisabled,
        pressed && { opacity: .8 },
      ]}
    >
      <Text style={[s.actionText, secondary && { color: paper.dashboardInk }]}>
        {label}
      </Text>
      <Ionicons
        name={secondary ? "arrow-back" : label === "BUILD MY COLORS" ? "color-palette-outline" : "arrow-forward"}
        size={17}
        color={secondary ? paper.dashboardInk : "white"}
      />
    </Pressable>
  );
  const editReport = () => {
    setReport(null);
    setTypeId("");
    setCategory("");
    setClarity(null);
    setStep("category");
    pending.current = null;
  };
  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <PaperNavHeader title="COLOR MATCH" onBack={back} />
      <PaperBackground>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          scrollEventThrottle={32}
          onScroll={event => {
            if (step === "bait" && !busy) {
              baitScroll.current = event.nativeEvent.contentOffset.y;
            }
          }}
          contentContainerStyle={s.content}
          pointerEvents={busy ? "none" : "auto"}
        >
          <Animated.View
            style={{
              gap: 20,
              opacity: reveal,
              transform: [{
                translateY: reveal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, 0],
                }),
              }],
            }}
          >
            {busy
              ? (
                <ColorPickerLoadingSkeleton label={busyLabel} />
              )
              : (
                <>
                  {step !== "result" && (
                    <>
                      <View style={s.hero}>
                        <SectionEyebrow>
                          COLOR MATCH SETUP
                        </SectionEyebrow>
                        <Text style={s.heroTitle}>
                          LET’S DIAL IN{"\n"}
                          <Text style={s.heroAccent}>YOUR COLORS.</Text>
                        </Text>
                        <Text style={s.subtitle}>
                          Three focused choices. Then we’ll build your field-ready color card for changing light.
                        </Text>
                      </View>
                      <View style={s.progressRow}>
                        {([
                          { label: "CATEGORY", icon: "layers-outline", target: "category" },
                          { label: "BAIT", icon: "fish-outline", target: "bait" },
                          { label: "CLARITY", icon: "eye-outline", target: "clarity" },
                        ] as const).map((item, index) => {
                          const active = stage === index;
                          const done = stage > index;
                          return (
                            <Pressable
                              key={item.target}
                              accessibilityRole="button"
                              accessibilityLabel={`Step ${index + 1}: ${item.label}`}
                              accessibilityState={{ selected: active, disabled: !done }}
                              disabled={!done}
                              onPress={() => setStep(item.target)}
                              style={({ pressed }) => [
                                s.progressTile,
                                done && s.progressTileDone,
                                active && s.progressTileActive,
                                pressed && done && { opacity: 0.82 },
                              ]}
                            >
                              <View style={[s.progressBadge, done && s.progressBadgeDone, active && s.progressBadgeActive]}>
                                <Ionicons
                                  name={done ? "checkmark" : item.icon}
                                  size={16}
                                  color={active ? "white" : paper.dashboardInk}
                                />
                              </View>
                              <Text style={[s.progressLabel, done && s.progressLabelDone]}>{item.label}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </>
                  )}
                  {step === "category" && (
                    <View style={s.stepCard}>
                      <View pointerEvents="none" style={s.cardDecoration}>
                        <TopographicLines style={StyleSheet.absoluteFill} color={paper.dashboardBlue} count={4} />
                        <CornerMarkSet color={paper.dashboardBlue} inset={10} size={12} />
                      </View>
                      <View style={s.cardHeading}>
                        <Text style={s.eyebrow}>STEP 1 · CATEGORY</Text>
                        <Text style={s.question}>What are you tying on?</Text>
                        <Text style={s.caption}>Choose a family, then the closest shape in your box.</Text>
                      </View>
                      <View style={s.grid}>
                        {catalog.categories.map(c => {
                          const cover: Record<string, string> = { soft_plastics: "soft_plastic_worm", hard_baits: "hard_jerkbait", jigs_spinners: "spinnerbait", metal_baits: "spoon", flies: "streamer" };
                          const active = category === c.id;
                          return <Pressable key={c.id} accessibilityRole="button" accessibilityLabel={c.label} accessibilityState={{ selected: active }}
                            onPress={() => { setCategory(c.id); setTypeId(""); baitScroll.current = 0; setError(""); }}
                            style={[s.categoryCard, active && s.blueSelected]}>
                            <Image source={colorTypeThumbnail(cover[c.id])} style={s.categoryArt} contentFit="contain" cachePolicy="memory-disk" />
                            <View style={s.categoryFooter}>
                              <Text style={s.categoryLabel}>{c.label}</Text>
                              <Text style={s.categoryHint}>{({ soft_plastics: "Soft-bodied favorites", hard_baits: "Plugs & swimming baits", jigs_spinners: "Skirts, hair & blades", metal_baits: "Casting & fluttering", flies: "Streamers & poppers" } as Record<string, string>)[c.id]}</Text>
                            </View>
                            {active && <View style={s.blueBadge}><Ionicons name="checkmark" size={15} color="white" /></View>}
                          </Pressable>;
                        })}
                      </View>
                    </View>
                  )}
                  {step === "bait" && (
                    <View style={s.stepCard}>
                      <View pointerEvents="none" style={s.cardDecoration}>
                        <TopographicLines style={StyleSheet.absoluteFill} color={paper.dashboardBlue} count={4} />
                        <CornerMarkSet color={paper.dashboardBlue} inset={10} size={12} />
                      </View>
                      <View style={s.catalogHeading}>
                        <Text style={s.eyebrow}>STEP 2 · BAIT</Text>
                        <Text style={s.question}>{catalog.categories.find(c => c.id === category)?.label}</Text>
                        <Text style={s.caption}>Choose the shape you’re tying on.</Text>
                      </View>
                      {sections.map((section) => (
                        <View key={section.id} style={s.shelf}>
                          <View style={s.grid}>
                            {section.types.map(t => (
                              <Pressable
                                key={t.id}
                                accessibilityRole="button"
                                accessibilityLabel={t.label}
                                accessibilityHint={`${t.description} Select this bait.`}
                                accessibilityState={{ selected: typeId === t.id }}
                                onPress={() => chooseBait(t.id)}
                                style={({ pressed }) => [s.catalogTile,
                                  { width: "48%" },
                                  typeId === t.id && s.blueSelected,
                                  pressed && { transform: [{ scale: .96 }], borderColor: paper.dashboardBlue },
                                ]}
                              >
                                {typeId === t.id && <View style={[s.blueBadge, { zIndex: 2 }]}><Ionicons name="checkmark" size={15} color="white" /></View>}
                                <View style={s.catalogImageArea}>
                                  <Image
                                    source={colorTypeThumbnail(t.id)}
                                    style={s.baitImage}
                                    contentFit="contain"
                                    cachePolicy="memory-disk"
                                  />
                                </View>
                                <View style={[s.catalogTileFooter, typeId === t.id && s.blueSelected]}>
                                  <Text style={s.catalogTileLabel}>{t.label}</Text>
                                </View>
                              </Pressable>
                            ))}
                          </View>
                        </View>
                      ))}
                      {!resultCount && (
                        <View style={s.empty}>
                          <Ionicons
                            name="search-outline"
                            size={28}
                            color={paper.dashboardBlue}
                          />
                          <Text style={s.question}>Choose a category</Text>
                          <Text style={s.caption}>
                            Go back and choose a bait category.
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                  {step === "bait" && savedId && (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => void load(savedId)}
                      style={s.saved}
                    >
                      <Ionicons
                        name="bookmark-outline"
                        size={18}
                        color={paper.dashboardBlue}
                      />
                      <Text style={s.linkText}>
                        Revisit your last color report
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={16}
                        color={paper.dashboardBlue}
                      />
                    </Pressable>
                  )}
                  {step === "clarity" && (
                    <>
                      {!!typeId && <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Change selected bait"
                        onPress={() => setStep("bait")}
                        style={s.baitSummary}
                      >
                        <Image
                          source={colorTypeThumbnail(typeId)}
                          style={s.summaryImage}
                          contentFit="contain"
                          cachePolicy="memory-disk"
                        />
                        <View style={{ flex: 1, gap: 4 }}>
                          <Text style={s.eyebrow}>IN YOUR TACKLE BOX</Text>
                          <Text style={s.summaryTitle}>
                            {selectedBait?.label ?? "Choose your bait"}
                          </Text>
                        </View>
                        <Ionicons
                          name="swap-horizontal"
                          size={21}
                          color={paper.dashboardBlue}
                        />
                      </Pressable>}
                      <View style={s.stepCard}>
                        <View pointerEvents="none" style={s.cardDecoration}>
                          <TopographicLines
                            style={StyleSheet.absoluteFill}
                            color={paper.dashboardBlue}
                            count={4}
                          />
                          <CornerMarkSet
                            color={paper.dashboardBlue}
                            inset={10}
                            size={12}
                          />
                        </View>
                        <View style={s.cardHeading}>
                          <Text style={s.eyebrow}>STEP 3 · WATER CLARITY</Text>
                          <Text style={s.question}>
                            How far can you see into the water?
                          </Text>
                          <Text style={s.caption}>
                            Think visibility below the surface.
                          </Text>
                        </View>
                        <View style={s.clarityGrid}>
                          {(["clear", "stained", "dirty"] as const).map((c) => (
                            <Pressable
                              key={c}
                              accessibilityRole="button"
                              accessibilityLabel={c === "dirty" ? "Murky" : c === "clear" ? "Clear" : "Stained"}
                              accessibilityState={{ selected: clarity === c }}
                              onPress={() => {
                                setClarity(c);
                              }}
                              style={(
                                { pressed },
                              ) => [
                                s.clarityCard,
                                clarity === c && s.blueSelected,
                                pressed && { transform: [{ scale: .97 }] },
                              ]}
                            >
                              <Image
                                source={COLOR_CLARITY_THUMBNAILS[c]}
                                style={s.clarityImage}
                                contentFit="contain"
                                cachePolicy="memory-disk"
                              />
                              <Text style={s.clarityTitle}>
                                {c === "dirty"
                                  ? "Murky"
                                  : c === "clear"
                                  ? "Clear"
                                  : "Stained"}
                              </Text>
                              <Text style={s.clarityCaption}>
                                {c === "clear"
                                  ? "High visibility"
                                  : c === "stained"
                                  ? "Some visibility"
                                  : "Low visibility"}
                              </Text>
                              {clarity === c && (
                                <View style={s.blueBadge}>
                                  <Ionicons
                                    name="checkmark"
                                    size={14}
                                    color="white"
                                  />
                                </View>
                              )}
                            </Pressable>
                          ))}
                        </View>
                        <Text style={s.clarityExplanation}>
                          {!clarity
                            ? "Choose the scene closest to the water in front of you."
                            : clarity === "clear"
                            ? "You can make out details well below the surface."
                            : clarity === "stained"
                            ? "You can see into the water, but details fade with distance."
                            : "Objects disappear almost immediately below the surface."}
                        </Text>
                      </View>
                      <View style={s.forecastNote}>
                        <Ionicons
                          name="partly-sunny-outline"
                          size={24}
                          color={paper.dashboardBlue}
                        />
                        <Text
                          style={[s.caption, { flex: 1, textAlign: "left" }]}
                        >
                          Your report will show two equal-status picks for each meaningful light condition—or one shared set when the visual answer stays the same.
                        </Text>
                      </View>
                    </>
                  )}
                  {step === "result" && report && (
                    <>
                      <ColorPickerView report={report} />
                      <View style={s.actions}>{action("CHOOSE ANOTHER BAIT", editReport, false, true)}</View>
                    </>
                  )}
                  {!!error && (
                    <View accessibilityRole="alert" style={s.error}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={21}
                        color="#8C472F"
                      />
                      <Text style={[s.body, { flex: 1 }]}>{error}</Text>
                    </View>
                  )}
                </>
              )}
          </Animated.View>
        </ScrollView>
        {!busy && step !== "result" && (
          <View style={s.dock}>
            <View style={s.dockInner}>
              <Text style={s.dockHint}>
                {step === "category"
                  ? "Choose a category to see its lure and fly types"
                  : step === "bait"
                  ? "Choose the closest shape in your box"
                  : "One daily report per bait and water clarity"}
              </Text>
              <View style={s.actions}>
                {action("BACK", back, false, true)}
                {step === "category"
                  ? action("CONTINUE", () => setStep("bait"), !category)
                  : step === "bait"
                  ? action(
                    "CONTINUE",
                    () => setStep("clarity"),
                    !typeId || colorChoiceForType(typeId)?.categoryId !== category,
                  )
                  : action("BUILD MY COLORS", () => void generate(), !typeId || !clarity)}
              </View>
            </View>
          </View>
        )}
      </PaperBackground>
      <SafeAreaView edges={["bottom"]} style={{ backgroundColor: paper.dashboardCream }} />
      <SubscribePrompt
        visible={paywall}
        onDismiss={() => setPaywall(false)}
        onUnlocked={() => {
          setPaywall(false);
          void generate();
        }}
      />
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  categoryCard: { width: "48%", borderWidth: 1, borderColor: paper.dashboardLine, borderRadius: paperRadius.card, backgroundColor: "white", alignItems: "center", overflow: "hidden", ...paperShadows.hard },
  categoryFooter: { width: "100%", paddingHorizontal: 6, paddingVertical: 10, gap: 3, borderTopWidth: 1, borderTopColor: paper.dashboardLine },
  categoryHint: { fontFamily: paperFonts.displayItalic, fontSize: 10, lineHeight: 14, textAlign: "center", color: paper.dashboardMuted },
  categoryArt: { width: "92%", height: 96, marginVertical: 4 },
  categoryLabel: { fontFamily: paperFonts.display, fontSize: 15, lineHeight: 19, color: paper.dashboardInk, textAlign: "center" },
  blueSelected: { backgroundColor: paper.dashboardBlueSky, borderColor: paper.dashboardBlue, ...paperShadows.lift },
  blueBadge: { position: "absolute", top: 8, right: 8, width: 25, height: 25, borderRadius: 13, backgroundColor: paper.dashboardBlue, alignItems: "center", justifyContent: "center" },
  catalog: { gap: 20 },
  catalogHeading: { alignItems: "center", gap: 5 },
  shelf: { gap: 12 },
  shelfHeading: { flexDirection: "row", alignItems: "center", gap: 10 },
  shelfNumber: { width: 26, height: 26, borderRadius: 8, backgroundColor: paper.dashboardInk, alignItems: "center", justifyContent: "center" },
  shelfNumberText: { fontFamily: paperFonts.bodyBold, fontSize: 10, color: "#F4DFA4" },
  shelfTitle: { fontFamily: paperFonts.display, fontSize: 20, color: paper.dashboardInk },
  shelfRule: { flex: 1, height: 1, backgroundColor: paper.dashboardLine },
  shelfCount: { fontFamily: paperFonts.body, fontSize: 11, color: paper.dashboardBlue },
  catalogTile: { borderWidth: 1, borderColor: paper.dashboardLine, borderRadius: paperRadius.card, overflow: "hidden", backgroundColor: "white", ...paperShadows.hard },
  catalogImageArea: { height: 106, backgroundColor: "transparent" },
  catalogTileFooter: { flex: 1, minHeight: 50, padding: 10, alignItems: "center", justifyContent: "center", borderTopWidth: 1, borderTopColor: paper.dashboardLine, backgroundColor: "transparent" },
  catalogTileLabel: { fontFamily: paperFonts.display, fontSize: 15, lineHeight: 19, textAlign: "center", color: paper.dashboardInk },
  root: { flex: 1, backgroundColor: paper.dashboardInk },
  content: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.sm,
    paddingBottom: 110,
    gap: 20,
  },
  hero: { alignItems: "center", gap: 8, paddingTop: 8, paddingBottom: 6 },
  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    lineHeight: 36,
    color: paper.dashboardInk,
    textAlign: "center",
  },
  heroAccent: { color: paper.bandPrime },
  subtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    lineHeight: 20,
    color: "#59636A",
    textAlign: "center",
    maxWidth: 330,
  },
  progressRow: { flexDirection: "row", gap: 8 },
  progressTile: { flex: 1, minHeight: 66, alignItems: "center", justifyContent: "center", gap: 6, padding: 8, borderWidth: 1, borderColor: paper.dashboardLine, borderRadius: 11, backgroundColor: paper.dashboardWhite },
  progressTileActive: { borderColor: "#C99B2D", backgroundColor: "#FBF1D9", ...paperShadows.hard },
  progressTileDone: { borderColor: paper.bandPrime, backgroundColor: paper.bandPrime },
  progressBadge: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: paper.dashboardLine },
  progressBadgeActive: { backgroundColor: "#C99B2D", borderColor: "#8A6A1A" },
  progressBadgeDone: { backgroundColor: paper.dashboardWhite, borderColor: paper.dashboardWhite },
  progressLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 8, letterSpacing: 1.2, color: paper.dashboardInk },
  progressLabelDone: { color: paper.dashboardWhite },
  stepCard: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    paddingVertical: paperSpacing.lg,
    paddingHorizontal: paperSpacing.md,
    gap: paperSpacing.md,
    overflow: "hidden",
    ...paperShadows.hard,
  },
  cardDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
    overflow: "hidden",
    borderRadius: paperRadius.card,
  },
  cardHeading: { alignItems: "center", gap: 6, paddingBottom: 4 },
  eyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.6,
    color: paper.dashboardBlue,
  },
  question: {
    fontFamily: paperFonts.display,
    fontSize: 24,
    lineHeight: 28,
    color: paper.dashboardInk,
    textAlign: "center",
  },
  caption: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    lineHeight: 20,
    color: "#627078",
    textAlign: "center",
  },
  body: {
    fontFamily: paperFonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: paper.dashboardInk,
  },
  small: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: "#657079",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  tileActive: { borderColor: "#C99B2D", backgroundColor: "#FBF1D9" },
  baitImage: { width: "100%", height: "100%" },
  selectionBadge: {
    position: "absolute",
    right: 7,
    top: 7,
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4DFA4",
    borderWidth: 1,
    borderColor: "#C99B2D",
  },
  empty: { paddingVertical: 25, gap: 12, alignItems: "center" },
  saved: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  linkText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 13,
    color: paper.dashboardInk,
    flexShrink: 1,
  },
  baitSummary: {
    flexDirection: "row",
    gap: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    padding: 10,
  },
  summaryImage: { width: 64, height: 58, borderRadius: 8 },
  summaryTitle: {
    fontFamily: paperFonts.display,
    fontSize: 19,
    color: paper.dashboardInk,
  },
  clarityGrid: { flexDirection: "row", gap: 8 },
  clarityCard: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    paddingHorizontal: 4,
    paddingBottom: 16,
    gap: 7,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    backgroundColor: "#FFFFFF",
    ...paperShadows.hard,
    overflow: "hidden",
  },
  clarityActive: {
    borderColor: paper.dashboardBlue,
    backgroundColor: "#E4F0F5",
    ...paperShadows.lift,
  },
  clarityImage: { width: "100%", aspectRatio: 1, marginTop: 10 },
  clarityTitle: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    color: paper.dashboardInk,
  },
  clarityCaption: {
    fontFamily: paperFonts.body,
    fontSize: 10,
    color: "#657079",
    textAlign: "center",
  },
  clarityExplanation: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    lineHeight: 21,
    color: "#596A73",
    textAlign: "center",
    minHeight: 45,
    paddingHorizontal: 8,
  },
  forecastNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
  dock: {
    backgroundColor: paper.dashboardCream,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
  },
  dockInner: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: paperSpacing.lg,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 9,
  },
  dockHint: {
    fontFamily: paperFonts.body,
    fontSize: 11,
    color: "#657079",
    textAlign: "center",
  },
  actions: { flexDirection: "row", gap: 10 },
  action: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 50,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  actionPrimary: { backgroundColor: paper.bandPrime },
  actionSecondary: {
    flex: .6,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  actionDisabled: { opacity: .4 },
  actionText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: .8,
    color: "white",
    flexShrink: 1,
    textAlign: "center",
  },
  error: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F7E8DD",
    borderWidth: 1,
    borderColor: "#DDB49D",
  },
});
