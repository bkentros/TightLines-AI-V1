import { AccessibilityInfo, Animated, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CornerMarkSet, TopographicLines } from "../paper";
import { RecommenderArtwork } from "./RecommenderArtwork";
import { usePaperBonePulse } from "../../lib/usePaperBonePulse";
import type { ReportEnvelope } from "../../lib/colorPicker";
import { colorTypeImage, colorTypeLabel } from "../../lib/colorPickerCatalog";
import { paper, paperFonts, paperRadius, paperShadows } from "../../lib/theme";

type Choice = ReportEnvelope["selection"]["groups"][number]["choices"][number];
function Palette({ colors }: { colors: string[] }) {
  return <View style={s.palette} accessibilityLabel="Approximate color reference">
    {colors.map((color, i) => <View key={`${color}-${i}`} style={[s.colorSample, { backgroundColor: color, flex: i === 0 ? 3 : 1 }]} />)}
  </View>;
}
function LightHeading({ light }: { light: "sunny" | "cloudy" | "all" }) {
  const title = light === "sunny" ? "BRIGHT / DIRECT LIGHT" : light === "cloudy" ? "LOW / DIFFUSE LIGHT" : "ACROSS CHANGING LIGHT";
  const caption = light === "all" ? "our two picks for either condition" : "our two picks for this light";
  return <View style={s.sectionHeading}>
    <View style={s.ruleRow}><View style={s.ruleCap} /><View style={s.rule} /><Text style={s.diamond}>◆</Text></View>
    <View style={s.sectionTitleRow}>
      <Ionicons name={light === "sunny" ? "sunny-outline" : light === "cloudy" ? "cloud-outline" : "partly-sunny-outline"} size={21} color={paper.dashboardInk} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
    <Text style={s.sectionCaption}>{caption}</Text>
  </View>;
}
function ColorCard({ choice, marker }: { choice: Choice; marker: "A" | "B" }) {
  const colors = choice.swatches ?? [];
  return <View style={s.card}>
    <View style={s.pickEyebrow}>
      <View style={s.pickNumber}><Text style={s.pickNumberText}>{marker}</Text></View>
      <Text style={s.meta}>FINFINDr COLOR PICK</Text>
      <Ionicons name="checkmark-circle-outline" size={18} color={paper.dashboardBlue} />
    </View>
    {colors.length > 0 && <View style={s.specimen}>
      <CornerMarkSet color={paper.dashboardBlue} inset={10} size={8} />
      <Palette colors={colors} />
      <Text style={s.reference}>APPROXIMATE COLOR REFERENCE</Text>
    </View>}
    <View style={s.cardBody}>
      <View style={s.nameRow}>
        <Text style={s.colorName}>{choice.name}</Text>
      </View>
      <Text style={s.description}>{choice.visualDescription}</Text>
      <View style={s.reason}>
        <Text style={s.reasonLabel}>— WHY IT FITS</Text>
        <Text style={s.reasonText}>{choice.explanation}</Text>
      </View>
    </View>
  </View>;
}
export function ColorPickerView({ report }: { report: ReportEnvelope }) {
  const clarity = report.request.clarity === "dirty" ? "Murky" : report.request.clarity === "clear" ? "Clear" : "Stained";
  const date = new Date(report.request.date + "T12:00:00Z").toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
  return <View style={s.root}>
    <View style={s.hero}>
      <View pointerEvents="none" style={s.heroTopo}><TopographicLines color={paper.dashboardBlue} count={5} /></View>
      <CornerMarkSet color={paper.dashboardBlue} inset={10} size={12} />
      <Text style={s.eyebrow}>TACKLE BOX · COLOR MATCH</Text>
      <Text style={s.reportTitle}>TODAY’S COLORS</Text>
      <View style={s.heroRow}>
        <View style={s.artPlate}>
          <RecommenderArtwork source={colorTypeImage(report.request.typeId)} style={s.baitArt} />
          <View pointerEvents="none" style={s.artWash} />
        </View>
      </View>
      <View style={s.facts}>
        <View style={s.fact}><Text style={s.factLabel}>BAIT PROFILE</Text><Text style={s.factValue}>{colorTypeLabel(report.request.typeId)}</Text></View>
        <View style={[s.fact, s.factDivider]}><Text style={s.factLabel}>WATER VISIBILITY</Text><Text style={s.factValue}>{clarity}</Text></View>
      </View>
      <Text style={s.reportDate}>FIELD CARD · {date.toUpperCase()}</Text>
    </View>
    <View style={s.brief}>
      <View style={s.briefIcon}><Ionicons name="eye-outline" size={22} color={paper.dashboardBlue} /></View>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={s.briefLabel}>YOUR VISUAL PLAN</Text>
        <Text style={s.briefText}>Two strong starting colors for this bait and water visibility. Use the section that matches the light over the water.</Text>
      </View>
    </View>
    <View style={s.masthead}>
      <Text style={s.mastheadLabel}>THE COLOR CARD</Text>
      <Text style={s.mastheadTitle}>TWO PICKS. ONE PLAN.</Text>
      <Text style={s.intro}>Both are FinFindr picks for these visual conditions. Start with either.</Text>
    </View>
    {(report.selection.sharedAcrossLight ? report.selection.groups.slice(0, 1) : report.selection.groups).map(group => <View key={group.light} style={s.group}>
      <LightHeading light={report.selection.sharedAcrossLight ? "all" : group.light} />
      {group.choices.map((choice, index) => <ColorCard key={choice.patternId} choice={choice} marker={index === 0 ? "A" : "B"} />)}
    </View>)}
    <View style={s.footer}>
      <Ionicons name="bookmark-outline" size={19} color={paper.dashboardBlue} />
      <Text style={s.footerTitle}>Yours for the day.</Text>
      <Text style={s.footerText}>Saved for this bait and water clarity. Come back tomorrow for FinFindr’s next picks.</Text>
      <Text style={s.finePrint}>Color samples are approximate. Underwater appearance also depends on water tint, depth, background, and the light reaching the lure.</Text>
    </View>
  </View>;
}

/** The actual report's header, section rules and two card sizes, before data arrives. */
export function ColorPickerLoadingSkeleton({ label = "Finding your daily colors" }: { label?: string }) {
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then(value => { if (active) setReducedMotion(value); }).catch(() => {});
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReducedMotion);
    return () => { active = false; sub.remove(); };
  }, []);
  const pulse = usePaperBonePulse({ paused: reducedMotion });
  const bone = (style: ViewStyle = {}) => <Animated.View style={[s.bone, style, { opacity: reducedMotion ? 0.24 : pulse }]} />;
  return <View style={s.root} accessibilityRole="progressbar" accessibilityState={{ busy: true }} accessibilityLabel={label} accessibilityLiveRegion="polite">
    <Text style={s.loadingCaption}>{label}</Text>
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={s.root}>
      <View style={s.hero}>
        {bone({ width: "65%", height: 9 })}
        {bone({ height: 36, width: "72%" })}
        <View style={s.artPlate}>{bone({ width: "88%", height: 118, borderRadius: 8 })}</View>
        <View style={s.facts}>{[0, 1].map(i => <View key={i} style={[s.fact, i > 0 && s.factDivider]}>{bone({ width: "70%", height: 8 })}{bone({ width: "55%", height: 18 })}</View>)}</View>
        {bone({ width: "38%", height: 8, alignSelf: "flex-end" })}
      </View>
      <View style={s.brief}><View style={s.briefIcon}>{bone({ width: 20, height: 20, borderRadius: 10 })}</View><View style={{ flex: 1, gap: 8 }}>{bone({ width: "45%", height: 8 })}{bone({ width: "100%", height: 10 })}{bone({ width: "76%", height: 10 })}</View></View>
      <View style={s.masthead}>{bone({ width: "38%", height: 8 })}{bone({ width: "72%", height: 24 })}{bone({ width: "82%", height: 10 })}</View>
      {(["sunny", "cloudy"] as const).map(light => <View key={light} style={s.group}>
        <LightHeading light={light} />
        {[0, 1].map(index => <View key={index} style={s.card}>
          <View style={s.pickEyebrow}>{bone({ width: 28, height: 28, borderRadius: 14 })}{bone({ width: "48%", height: 9 })}</View>
          <View style={s.specimen}>{bone({ width: "100%", height: 118, borderRadius: 5 })}{bone({ width: 120, height: 7 })}</View>
          <View style={s.cardBody}>{bone({ width: "70%", height: 28 })}{bone({ width: "100%", height: 10 })}{bone({ width: "80%", height: 10 })}<View style={s.reason}>{bone({ width: "40%", height: 8 })}{bone({ width: "95%", height: 10 })}{bone({ width: "75%", height: 10 })}</View></View>
        </View>)}
      </View>)}
    </View>
  </View>;
}
const s = StyleSheet.create({
  root: { gap: 24 },
  hero: { backgroundColor: paper.dashboardWhite, borderWidth: 1, borderColor: paper.dashboardLine, borderRadius: paperRadius.card, padding: 20, gap: 13, overflow: "hidden", ...paperShadows.hard },
  heroTopo: { position: "absolute", right: -50, top: -20, opacity: 0.07 },
  eyebrow: { fontFamily: paperFonts.bodyBold, fontSize: 9, letterSpacing: 2, color: paper.dashboardBlue },
  reportTitle: { fontFamily: paperFonts.display, fontSize: 36, lineHeight: 39, color: paper.dashboardInk },
  heroRow: { alignItems: "center", minHeight: 148 },
  artPlate: { width: "100%", minHeight: 148, alignItems: "center", justifyContent: "center", borderTopWidth: 1, borderBottomWidth: 1, borderColor: paper.dashboardLine, backgroundColor: paper.dashboardWhite, overflow: "hidden" },
  baitArt: { width: "92%", height: 132 },
  artWash: { ...StyleSheet.absoluteFillObject, backgroundColor: paper.dashboardBlueLight, opacity: 0.42 },
  facts: { flexDirection: "row", borderTopWidth: 1, borderBottomWidth: 1, borderColor: paper.dashboardLine, paddingVertical: 10 },
  fact: { flex: 1, gap: 5, paddingHorizontal: 6 },
  factDivider: { borderLeftWidth: 2, borderLeftColor: paper.dashboardInk, paddingLeft: 14 },
  factLabel: { fontFamily: paperFonts.metaMono, fontSize: 9, color: paper.dashboardMuted },
  factValue: { fontFamily: paperFonts.display, fontSize: 17, lineHeight: 21, color: paper.dashboardInk },
  reportDate: { fontFamily: paperFonts.metaMono, fontSize: 8, letterSpacing: 1.4, color: paper.dashboardMuted, textAlign: "right" },
  brief: { flexDirection: "row", gap: 13, alignItems: "center", padding: 16, backgroundColor: "#E8F1F3", borderWidth: 1, borderColor: paper.dashboardBlue, borderRadius: paperRadius.card },
  briefIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: paper.dashboardWhite, borderWidth: 1, borderColor: paper.dashboardBlue },
  briefLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 9, letterSpacing: 1.6, color: paper.dashboardBlue },
  briefText: { fontFamily: paperFonts.body, fontSize: 13, lineHeight: 19, color: paper.dashboardInk },
  masthead: { alignItems: "center", gap: 6, paddingTop: 4 },
  mastheadLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 9, letterSpacing: 2.2, color: paper.dashboardBlue },
  mastheadTitle: { fontFamily: paperFonts.display, fontSize: 23, lineHeight: 27, color: paper.dashboardInk, textAlign: "center" },
  intro: { fontFamily: paperFonts.displayItalic, fontSize: 15, lineHeight: 22, textAlign: "center", color: paper.dashboardInk, opacity: 0.7 },
  group: { gap: 16 },
  sectionHeading: { gap: 9, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: paper.dashboardLine },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  ruleCap: { width: 5, height: 5, borderRadius: 1, backgroundColor: paper.dashboardInk },
  rule: { height: 1, flex: 1, backgroundColor: paper.dashboardInk },
  diamond: { fontSize: 10, color: paper.dashboardMuted },
  sectionTitleRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  sectionTitle: { flex: 1, fontFamily: paperFonts.bodyBold, fontSize: 12, letterSpacing: 1.8, color: paper.dashboardInk },
  sectionCaption: { fontFamily: paperFonts.displayItalic, fontSize: 12, color: paper.dashboardMuted },
  card: { backgroundColor: paper.dashboardWhite, borderWidth: 1, borderColor: paper.dashboardInk, borderRadius: paperRadius.card, overflow: "hidden", ...paperShadows.hard },
  pickEyebrow: { minHeight: 38, paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 7, borderBottomWidth: 1, borderBottomColor: paper.dashboardLine },
  specimen: { minHeight: 140, paddingVertical: 18, paddingHorizontal: 18, alignItems: "center", justifyContent: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: paper.dashboardLine, backgroundColor: "#F5F1E8" },
  palette: { flexDirection: "row", width: "100%", height: 118, borderRadius: 5, overflow: "hidden", borderWidth: 1, borderColor: "rgba(11,28,42,0.28)", ...paperShadows.lift },
  colorSample: { height: "100%" },
  reference: { fontFamily: paperFonts.metaMono, fontSize: 8, letterSpacing: 1.5, color: paper.dashboardMuted },
  cardBody: { padding: 18, gap: 14 },
  nameRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 10 },
  colorName: { flexGrow: 1, flexShrink: 1, fontFamily: paperFonts.display, fontSize: 30, lineHeight: 34, color: paper.dashboardInk },
  description: { fontFamily: paperFonts.body, fontSize: 13, lineHeight: 20, color: paper.dashboardMuted },
  reason: { gap: 8, paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: paper.dashboardBlue },
  reasonLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.8, color: paper.dashboardBlue },
  reasonText: { fontFamily: paperFonts.body, fontSize: 14, lineHeight: 21, color: paper.dashboardInk },
  blueDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: paper.dashboardBlue },
  pickNumber: { width: 28, height: 28, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: paper.dashboardInk },
  pickNumberText: { fontFamily: paperFonts.metaMonoBold, fontSize: 9, color: "#F4DFA4" },
  meta: { flex: 1, fontFamily: paperFonts.bodyBold, fontSize: 9, letterSpacing: 1.6, color: paper.dashboardBlue },
  footer: { alignItems: "center", paddingVertical: 12, gap: 8 },
  footerTitle: { fontFamily: paperFonts.displayItalic, fontSize: 21, color: paper.dashboardInk },
  footerText: { fontFamily: paperFonts.body, fontSize: 12, lineHeight: 18, textAlign: "center", color: paper.dashboardMuted },
  finePrint: { fontFamily: paperFonts.body, fontSize: 10, lineHeight: 16, textAlign: "center", color: paper.dashboardMuted },
  bone: { backgroundColor: paper.dashboardInk, borderRadius: 3 },
  loadingCaption: { fontFamily: paperFonts.displayItalic, fontSize: 16, lineHeight: 22, textAlign: "center", color: paper.dashboardInk },
});
