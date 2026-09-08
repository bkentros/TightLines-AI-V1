import { AccessibilityInfo, Animated, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CornerMarkSet, TopographicLines } from "../paper";
import { RecommenderArtwork } from "./RecommenderArtwork";
import { usePaperBonePulse } from "../../lib/usePaperBonePulse";
import type { ReportEnvelope } from "../../lib/colorPicker";
import { colorTypeImage, colorTypeLabel } from "../../lib/colorPickerCatalog";
import { COLOR_PATTERNS } from "../../supabase/functions/_shared/colorPickerEngine/colorPatterns";
import { paper, paperFonts, paperRadius, paperShadows } from "../../lib/theme";

const gold = "#C99B2D", goldInk = "#8A6A1A", goldPaper = "#FBF1D9";
const recipes = new Map(COLOR_PATTERNS.map(p => [p.id, p]));
type Choice = ReportEnvelope["selection"]["groups"][number]["choices"][number];
function palette(choice: Choice) {
  const recipe = recipes.get(choice.patternId);
  return choice.swatches ?? (recipe?.name === choice.name && recipe.visualDescription === choice.visualDescription ? recipe.swatches : []);
}
function Palette({ colors, compact = false }: { colors: string[]; compact?: boolean }) {
  return <View style={[s.palette, compact && s.paletteCompact]} accessibilityLabel="Approximate color reference">
    {colors.map((color, i) => <View key={`${color}-${i}`} style={[s.colorSample, { backgroundColor: color, flex: i === 0 ? 3 : 1 }]} />)}
  </View>;
}
function LightHeading({ light }: { light: string }) {
  return <View style={s.sectionHeading}>
    <View style={s.ruleRow}><View style={s.ruleCap} /><View style={s.rule} /><Text style={s.diamond}>◆</Text></View>
    <View style={s.sectionTitleRow}>
      <Ionicons name={light === "sunny" ? "sunny-outline" : "cloud-outline"} size={21} color={paper.dashboardInk} />
      <Text style={s.sectionTitle}>{light === "sunny" ? "WHEN THE SUN IS OUT" : "UNDER CLOUD COVER"}</Text>
    </View>
    <Text style={s.sectionCaption}>top color · honorable mention</Text>
  </View>;
}
function ColorCard({ choice, top }: { choice: Choice; top: boolean }) {
  const colors = palette(choice);
  return <View style={[s.card, !top && s.honorable]}>
    {top ? <View style={s.ribbon}>
      <Ionicons name="star" size={12} color={goldInk} />
      <Text style={s.ribbonText}>TOP COLOR OF THE DAY</Text><Text style={s.ribbonDiamond}>◆</Text>
    </View> : <View style={s.honorableEyebrow}><View style={s.blueDot} /><Text style={s.meta}>HONORABLE MENTION</Text></View>}
    {top && colors.length > 0 && <View style={s.specimen}>
      <CornerMarkSet color={paper.dashboardBlue} inset={10} size={8} />
      <Palette colors={colors} />
      <Text style={s.reference}>COLOR REFERENCE</Text>
    </View>}
    <View style={[s.cardBody, !top && s.honorableBody]}>
      <View style={s.nameRow}>
        <Text style={[s.colorName, !top && s.honorableName]}>{choice.name}</Text>

      </View>
      {!top && colors.length > 0 && <Palette colors={colors} compact />}
      <Text style={s.description}>{choice.visualDescription}</Text>
      <View style={[s.reason, !top && { borderLeftColor: paper.dashboardBlue }]}>
        <Text style={[s.reasonLabel, !top && { color: paper.dashboardBlue }]}>— WHY IT FITS</Text>
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
      <View style={s.forecast}><Ionicons name="partly-sunny-outline" size={16} color={paper.dashboardBlue} /><Text style={s.forecastText}>{report.weather.meanCloudPercent == null ? "Saved light conditions" : `${Math.round(report.weather.meanCloudPercent)}% daylight cloud cover`} · at generation</Text></View>
    </View>
    <Text style={s.intro}>Two ways to meet the light.{"\n"}Your colors for sunshine and cloud cover.</Text>
    {report.selection.groups.map(group => <View key={group.light} style={s.group}>
      <LightHeading light={group.light} />
      {group.choices.map((choice, index) => <ColorCard key={choice.patternId} choice={choice} top={index === 0} />)}
    </View>)}
    <View style={s.footer}>
      <Ionicons name="bookmark-outline" size={19} color={paper.dashboardBlue} />
      <Text style={s.footerTitle}>Yours for the day.</Text>
      <Text style={s.footerText}>Saved for this bait and water clarity. New daily picks tomorrow.</Text>
      <Text style={s.finePrint}>Both picks are randomly selected from viable colors. Color samples are approximate.</Text>
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
      {["sunny", "cloudy"].map(light => <View key={light} style={s.group}>
        <LightHeading light={light} />
        <View style={s.card}>
          <View style={s.ribbon}>{bone({ width: "60%", height: 10 })}</View>
          <View style={s.specimen}>{bone({ width: "100%", height: 112, borderRadius: 10 })}{bone({ width: 86, height: 7 })}</View>
          <View style={s.cardBody}>{bone({ width: "70%", height: 28 })}{bone({ width: "100%", height: 10 })}{bone({ width: "80%", height: 10 })}<View style={s.reason}>{bone({ width: "40%", height: 8 })}{bone({ width: "95%", height: 10 })}{bone({ width: "75%", height: 10 })}</View></View>
        </View>
        <View style={[s.card, s.honorable]}><View style={s.honorableEyebrow}>{bone({ width: "60%", height: 8 })}</View><View style={s.cardBody}>{bone({ width: "65%", height: 23 })}{bone({ width: "100%", height: 72, borderRadius: 10 })}{bone({ width: "95%", height: 10 })}{bone({ width: "80%", height: 10 })}</View></View>
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
  forecast: { flexDirection: "row", gap: 7, alignItems: "center" },
  forecastText: { flex: 1, fontFamily: paperFonts.body, fontSize: 10, lineHeight: 15, color: paper.dashboardMuted },
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
  ribbon: { minHeight: 38, paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: goldPaper, borderBottomWidth: 1, borderBottomColor: gold },
  ribbonText: { flex: 1, fontFamily: paperFonts.bodyBold, fontSize: 10, letterSpacing: 1.8, color: goldInk },
  ribbonDiamond: { fontSize: 10, color: gold },
  specimen: { minHeight: 112, paddingVertical: 22, paddingHorizontal: 18, alignItems: "center", justifyContent: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: paper.dashboardLine },
  palette: { flexDirection: "row", width: "100%", height: 112, borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: "rgba(11,28,42,0.15)" },
  colorSample: { height: "100%" },
  reference: { fontFamily: paperFonts.metaMono, fontSize: 8, letterSpacing: 1.5, color: paper.dashboardMuted },
  cardBody: { padding: 18, gap: 14 },
  nameRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 10 },
  colorName: { flexGrow: 1, flexShrink: 1, fontFamily: paperFonts.display, fontSize: 30, lineHeight: 34, color: paper.dashboardInk },
  description: { fontFamily: paperFonts.body, fontSize: 13, lineHeight: 20, color: paper.dashboardMuted },
  reason: { gap: 8, paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: gold },
  reasonLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.8, color: goldInk },
  reasonText: { fontFamily: paperFonts.body, fontSize: 14, lineHeight: 21, color: paper.dashboardInk },
  honorable: { borderLeftWidth: 3, borderLeftColor: paper.dashboardBlue },
  honorableEyebrow: { flexDirection: "row", alignItems: "center", gap: 7, paddingTop: 16, paddingHorizontal: 16 },
  blueDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: paper.dashboardBlue },
  meta: { fontFamily: paperFonts.bodyBold, fontSize: 9, letterSpacing: 1.6, color: paper.dashboardBlue },
  honorableBody: { paddingTop: 12 },
  honorableName: { fontSize: 23, lineHeight: 28 },
  paletteCompact: { height: 72 },
  footer: { alignItems: "center", paddingVertical: 12, gap: 8 },
  footerTitle: { fontFamily: paperFonts.displayItalic, fontSize: 21, color: paper.dashboardInk },
  footerText: { fontFamily: paperFonts.body, fontSize: 12, lineHeight: 18, textAlign: "center", color: paper.dashboardMuted },
  finePrint: { fontFamily: paperFonts.body, fontSize: 10, lineHeight: 16, textAlign: "center", color: paper.dashboardMuted },
  bone: { backgroundColor: paper.dashboardInk, borderRadius: 3 },
  loadingCaption: { fontFamily: paperFonts.displayItalic, fontSize: 16, lineHeight: 22, textAlign: "center", color: paper.dashboardInk },
});
