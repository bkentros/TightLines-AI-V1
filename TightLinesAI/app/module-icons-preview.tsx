/**
 * Side-by-side preview for intelligence-module emblem variants.
 * Open in the dev client: /module-icons-preview
 */

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PaperNavHeader } from "../components/paper/PaperNavHeader";
import {
  IntelligenceModuleEmblem,
  IntelligenceModuleIcon,
  type IntelligenceModuleIconVariant,
  type IntelligenceModuleId,
} from "../components/paper/IntelligenceModuleIcons";
import { paper, paperFonts, paperSpacing } from "../lib/theme";

type ModuleSpec = {
  id: IntelligenceModuleId;
  code: string;
  title: string;
  tag: string;
  desc: string;
  iconBg: [string, string];
  iconBorder: string;
  iconColor: string;
  legacyIcon: React.ComponentProps<typeof Ionicons>["name"];
};

const MODULES: ModuleSpec[] = [
  {
    id: "water-read",
    code: "01",
    title: "Water Read",
    tag: "POLYGON",
    desc: "Most lakes: structure + potential hotspots",
    iconBg: ["#E8F2FA", "#C8DFF2"],
    iconBorder: "#0F63B0",
    iconColor: "#0A4A87",
    legacyIcon: "layers-outline",
  },
  {
    id: "tackle-box",
    code: "02",
    title: "Tackle Box",
    tag: "RECOMMENDER",
    desc: "Tuned picks for today's conditions & species",
    iconBg: ["#FBF1D9", "#F4DFA4"],
    iconBorder: "#C99B2D",
    iconColor: "#8A6A1A",
    legacyIcon: "fish-outline",
  },
  {
    id: "todays-bite",
    code: "03",
    title: "Today's Bite",
    tag: "CONDITIONS",
    desc: "Full breakdown · windows · limiting factors",
    iconBg: ["#E5F2DD", "#C5E0B5"],
    iconBorder: "#3DA85F",
    iconColor: "#1F6B38",
    legacyIcon: "sparkles-outline",
  },
  {
    id: "river-run",
    code: "04",
    title: "River Migration",
    tag: "MIGRATION",
    desc: "Daily river outlook, strength & fishability for Great Lakes species",
    iconBg: ["#FBE4E1", "#F3C2BC"],
    iconBorder: "#C0392B",
    iconColor: "#9A2B20",
    legacyIcon: "fish-outline",
  },
];

const VARIANTS: {
  key: IntelligenceModuleIconVariant | "ionicons";
  label: string;
  blurb: string;
}[] = [
  {
    key: "ionicons",
    label: "Original",
    blurb: "Ionicons outline — stock system glyphs",
  },
  {
    key: "legacy",
    label: "First pass",
    blurb: "Thin custom SVG — too small / incomplete",
  },
  {
    key: "premium",
    label: "Premium",
    blurb: "Bold filled emblems — current default on Home",
  },
];

export default function ModuleIconsPreviewScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <View style={styles.screen}>
        <PaperNavHeader
          eyebrow="FINFINDR · DEV PREVIEW"
          eyebrowColor={paper.dashboardBlueLight}
          title="MODULE EMBLEMS"
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introCard}>
            <Text style={styles.introEyebrow}>INTELLIGENCE MODULES</Text>
            <Text style={styles.introTitle}>Premium emblem pass.</Text>
            <Text style={styles.introBody}>
              Literal marks at phone scale: lake map + pin, side-profile fish,
              and sun/cloud over water. Description text no longer auto-shrinks
              on longer lines.
            </Text>
          </View>

          {MODULES.map((module) => (
            <View key={module.id} style={styles.moduleBlock}>
              <View style={styles.moduleHeader}>
                <Text style={styles.moduleCode}>{module.code}</Text>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleTag}>{module.tag}</Text>
              </View>

              <View style={styles.variantGrid}>
                {VARIANTS.map((variant) => (
                  <View key={variant.key} style={styles.variantCard}>
                    {variant.key === "premium"
                      ? (
                        <IntelligenceModuleEmblem
                          module={module.id}
                          iconBg={module.iconBg}
                          iconBorder={module.iconBorder}
                          iconColor={module.iconColor}
                          size={56}
                        />
                      )
                      : (
                        <View
                          style={[
                            styles.iconTile,
                            {
                              backgroundColor: module.iconBg[1],
                              borderColor: `${module.iconBorder}60`,
                            },
                          ]}
                        >
                          {variant.key === "ionicons"
                            ? (
                              <Ionicons
                                name={module.legacyIcon}
                                size={22}
                                color={module.iconColor}
                              />
                            )
                            : (
                              <IntelligenceModuleIcon
                                module={module.id}
                                variant="legacy"
                                size={30}
                                color={module.iconColor}
                              />
                            )}
                        </View>
                      )}
                    <Text style={styles.variantLabel}>{variant.label}</Text>
                    <Text style={styles.variantBlurb}>{variant.blurb}</Text>
                  </View>
                ))}
              </View>

              <PreviewRow module={module} />
            </View>
          ))}

          <Text style={styles.footerStamp}>FINFINDR · EMBLEM PREVIEW</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function PreviewRow({ module }: { module: ModuleSpec }) {
  return (
    <View style={styles.previewRow}>
      <Text style={styles.previewEyebrow}>IN CONTEXT · PREMIUM</Text>
      <View style={styles.moduleRow}>
        <Text style={styles.rowCode}>{module.code}</Text>
        <IntelligenceModuleEmblem
          module={module.id}
          iconBg={module.iconBg}
          iconBorder={module.iconBorder}
          iconColor={module.iconColor}
          size={50}
        />
        <View style={styles.rowTextCol}>
          <View style={styles.rowTitleRow}>
            <Text style={styles.rowTitle}>{module.title}</Text>
            <Text style={styles.rowTag}>{module.tag}</Text>
          </View>
          <Text style={styles.rowDesc} numberOfLines={1}>
            {module.desc}
          </Text>
        </View>
        <Ionicons
          name="arrow-up"
          size={16}
          color={paper.dashboardInk}
          style={{ transform: [{ rotate: "45deg" }], opacity: 0.62 }}
        />
      </View>
    </View>
  );
}

const MONO_BOLD = paperFonts.metaMonoBold;
const SERIF_SEMI = paperFonts.display;

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
  },
  scrollContent: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
  },
  introCard: {
    backgroundColor: "#E4F1F7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(42,110,150,0.18)",
    padding: paperSpacing.lg,
    marginBottom: paperSpacing.section,
  },
  introEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 2,
    color: paper.dashboardBlue,
    marginBottom: 8,
  },
  introTitle: {
    fontFamily: SERIF_SEMI,
    fontSize: 28,
    color: paper.dashboardInk,
    marginBottom: 8,
  },
  introBody: {
    fontFamily: paperFonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: "rgba(10,27,46,0.72)",
  },
  moduleBlock: {
    marginBottom: paperSpacing.section,
  },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  moduleCode: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1,
    color: "#AAA",
  },
  moduleTitle: {
    fontFamily: SERIF_SEMI,
    fontSize: 18,
    color: paper.dashboardInk,
  },
  moduleTag: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    letterSpacing: 1.2,
    color: "#888",
  },
  variantGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  variantCard: {
    width: "31%",
    minWidth: 100,
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    padding: 12,
    alignItems: "center",
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  variantLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.dashboardInk,
    marginBottom: 4,
    textAlign: "center",
  },
  variantBlurb: {
    fontFamily: paperFonts.body,
    fontSize: 11,
    lineHeight: 16,
    color: "rgba(10,27,46,0.62)",
    textAlign: "center",
  },
  previewRow: {
    marginTop: 4,
  },
  previewEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    letterSpacing: 1.6,
    color: "#888",
    marginBottom: 8,
  },
  moduleRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 8,
    padding: 14,
    gap: 12,
  },
  rowCode: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1,
    color: "#AAA",
  },
  rowTextCol: {
    flex: 1,
  },
  rowTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 2,
  },
  rowTitle: {
    fontFamily: SERIF_SEMI,
    fontSize: 16,
    color: paper.dashboardInk,
  },
  rowTag: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    letterSpacing: 1.2,
    color: "#888",
  },
  rowDesc: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    color: "rgba(10,27,46,0.62)",
  },
  footerStamp: {
    textAlign: "center",
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 2.4,
    color: "rgba(10,27,46,0.34)",
    marginTop: paperSpacing.md,
  },
});
