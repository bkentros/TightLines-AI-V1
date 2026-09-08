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
function ColorCard({ choice }: { choice: Choice }) {
  const colors = choice.swatches ?? [];
  return <View style={s.card}>
    <View style={s.pickEyebrow}><View style={s.blueDot} /><Text style={s.meta}>FINFINDr PICK</Text></View>
    {colors.length > 0 && <View style={s.specimen}>
      <CornerMarkSet color={paper.dashboardBlue} inset={10} size={8} />
      <Palette colors={colors} />
      <Text style={s.reference}>COLOR REFERENCE</Text>
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
      <Text style={s.eyebrow}>COLOR MATCH · YOUR DAILY REPORT</Text>
      <View style={s.heroRow}>
        <Text style={s.baitTitle}>{colorTypeLabel(report.request.typeId)}</Text>
        <RecommenderArtwork source={colorTypeImage(report.request.typeId)} style={s.baitArt} />
      </View>
      <View style={s.facts}>
        <View style={s.fact}><Text style={s.factLabel}>WATER CLARITY</Text><Text style={s.factValue}>{clarity}</Text></View>
        <View style={[s.fact, s.factDivider]}><Text style={s.factLabel}>YOUR REPORT</Text><Text style={s.factValue}>{date}</Text></View>
      </View>
    </View>
    <Text style={s.intro}>Our picks for today, matched to your bait, water clarity, and the light you are fishing.</Text>
    {(report.selection.sharedAcrossLight ? report.selection.groups.slice(0, 1) : report.selection.groups).map(group => <View key={group.light} style={s.group}>
      <LightHeading light={report.selection.sharedAcrossLight ? "all" : group.light} />
      {group.choices.map(choice => <ColorCard key={choice.patternId} choice={choice} />)}
    </View>)}
    <View style={s.footer}>
      <Ionicons name="bookmark-outline" size={19} color={paper.dashboardBlue} />
      <Text style={s.footerTitle}>Yours for the day.</Text>
      <Text style={s.footerText}>Saved for this bait and water clarity. Come back tomorrow for FinFindr’s next picks.</Text>
      <Text style={s.finePrint}>Color samples are approximate. Fish response also depends on forage, depth, presentation, and local conditions.</Text>
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
        <View style={s.heroRow}><View style={{ flex: 1, gap: 10 }}>{bone({ height: 26, width: "90%" })}{bone({ height: 26, width: "65%" })}</View>{bone({ width: 90, height: 76, borderRadius: 10 })}</View>
        <View style={s.facts}>{[0, 1].map(i => <View key={i} style={[s.fact, i > 0 && s.factDivider]}>{bone({ width: "70%", height: 8 })}{bone({ width: "55%", height: 18 })}</View>)}</View>
        {bone({ width: "80%", height: 9 })}
      </View>
      {(["sunny", "cloudy"] as const).map(light => <View key={light} style={s.group}>
        <LightHeading light={light} />
        <View style={s.card}>
          <View style={s.pickEyebrow}>{bone({ width: "60%", height: 10 })}</View>
          <View style={s.specimen}>{bone({ width: "100%", height: 112, borderRadius: 10 })}{bone({ width: 86, height: 7 })}</View>
          <View style={s.cardBody}>{bone({ width: "70%", height: 28 })}{bone({ width: "100%", height: 10 })}{bone({ width: "80%", height: 10 })}<View style={s.reason}>{bone({ width: "40%", height: 8 })}{bone({ width: "95%", height: 10 })}{bone({ width: "75%", height: 10 })}</View></View>
        </View>
        <View style={s.card}><View style={s.pickEyebrow}>{bone({ width: "60%", height: 8 })}</View><View style={s.cardBody}>{bone({ width: "65%", height: 23 })}{bone({ width: "100%", height: 72, borderRadius: 10 })}{bone({ width: "95%", height: 10 })}{bone({ width: "80%", height: 10 })}</View></View>
      </View>)}
    </View>
  </View>;
}
const s = StyleSheet.create({
  root: { gap: 24 },
  hero: { backgroundColor: paper.dashboardWhite, borderWidth: 1, borderColor: paper.dashboardLine, borderRadius: paperRadius.card, padding: 20, gap: 16, overflow: "hidden", ...paperShadows.hard },
  heroTopo: { position: "absolute", right: -50, top: -20, opacity: 0.07 },
  eyebrow: { fontFamily: paperFonts.bodyBold, fontSize: 9, letterSpacing: 2, color: paper.dashboardBlue },
  heroRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 80 },
  baitTitle: { flex: 1, fontFamily: paperFonts.display, fontSize: 28, lineHeight: 32, color: paper.dashboardInk },
  baitArt: { width: 96, height: 80 },
  facts: { flexDirection: "row", borderTopWidth: 1, borderBottomWidth: 1, borderColor: paper.dashboardLine, paddingVertical: 10 },
  fact: { flex: 1, gap: 5, paddingHorizontal: 6 },
  factDivider: { borderLeftWidth: 2, borderLeftColor: paper.dashboardInk, paddingLeft: 14 },
  factLabel: { fontFamily: paperFonts.metaMono, fontSize: 9, color: paper.dashboardMuted },
  factValue: { fontFamily: paperFonts.bodyBold, fontSize: 17, color: paper.dashboardInk },
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
  card: { backgroundColor: paper.dashboardWhite, borderWidth: 1, borderColor: paper.dashboardLine, borderRadius: paperRadius.card, overflow: "hidden", ...paperShadows.hard },
  pickEyebrow: { minHeight: 38, paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 7, borderBottomWidth: 1, borderBottomColor: paper.dashboardLine },
  specimen: { minHeight: 112, paddingVertical: 22, paddingHorizontal: 18, alignItems: "center", justifyContent: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: paper.dashboardLine },
  palette: { flexDirection: "row", width: "100%", height: 112, borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: "rgba(11,28,42,0.15)" },
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
  meta: { fontFamily: paperFonts.bodyBold, fontSize: 9, letterSpacing: 1.6, color: paper.dashboardBlue },
  footer: { alignItems: "center", paddingVertical: 12, gap: 8 },
  footerTitle: { fontFamily: paperFonts.displayItalic, fontSize: 21, color: paper.dashboardInk },
  footerText: { fontFamily: paperFonts.body, fontSize: 12, lineHeight: 18, textAlign: "center", color: paper.dashboardMuted },
  finePrint: { fontFamily: paperFonts.body, fontSize: 10, lineHeight: 16, textAlign: "center", color: paper.dashboardMuted },
  bone: { backgroundColor: paper.dashboardInk, borderRadius: 3 },
  loadingCaption: { fontFamily: paperFonts.displayItalic, fontSize: 16, lineHeight: 22, textAlign: "center", color: paper.dashboardInk },
});
