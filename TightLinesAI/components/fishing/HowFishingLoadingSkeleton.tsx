/**
 * HowFishingLoadingSkeleton
 *
 * Paper-language placeholder that mirrors the shape of the renovated
 * Today's Bite report. Every major card the user sees on load has a
 * matching bone in this skeleton — hero (with corner crosses, gauge
 * panel, verdict ornaments, meta strip), BITE FACTORS section
 * (masthead + helping/watch-out cards with ribbon-tinted ordinals),
 * WHEN TO GO timing tiles, MOON & TIDE almanac, FIELD STRATEGY with seal
 * badge, and the footer with pulsing live dot + edition stamp.
 *
 * Visual-only: no data, no engine fetch. One pulse value (native
 * driver) drives every bone via React context — same pattern as
 * RecommenderLoadingSkeleton.
 */

import React, { createContext, useContext } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { paper, paperSpacing } from "../../lib/theme";
import { TopographicLines } from "../paper";
import { usePaperBonePulse } from "../../lib/usePaperBonePulse";

const PulseCtx = createContext<Animated.Value | null>(null);

function Bone({ style }: { style?: object }) {
  const pulse = useContext(PulseCtx);
  return (
    <Animated.View
      style={[styles.bone, style, pulse ? { opacity: pulse } : null]}
    />
  );
}

// ─── Section masthead (cap dot + rule + diamond ornament) ──────────────

function SectionMastheadSkel() {
  return (
    <View style={styles.sectionMasthead}>
      <View style={styles.sectionMastheadRuleRow}>
        <View style={styles.sectionMastheadCap} />
        <View style={styles.sectionMastheadRule} />
        <View style={styles.sectionMastheadOrnament} />
      </View>
      <View style={styles.sectionMastheadInner}>
        <Bone style={styles.sectionMastheadTitleBone} />
        <Bone style={styles.sectionMastheadMetaBone} />
      </View>
      <View style={[styles.sectionMastheadRule, { opacity: 0.45 }]} />
    </View>
  );
}

// ─── Factor row bone (ribbon ordinal + ribbon + text + tail glyph) ─────

function FactorRowSkel({
  tint,
  isLast,
}: {
  tint: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.factorRow, !isLast && styles.factorRowDivider]}>
      <View style={styles.factorOrdinalCol}>
        <View style={[styles.factorOrdinalDot, { backgroundColor: tint }]} />
        <Bone
          style={[styles.factorOrdinalBone, {
            backgroundColor: tint,
            opacity: 0.45,
          }]}
        />
      </View>
      <View style={[styles.factorRibbon, { backgroundColor: tint }]} />
      <View style={styles.factorTextStack}>
        <Bone
          style={[styles.factorEyebrowBone, {
            backgroundColor: tint,
            opacity: 0.45,
          }]}
        />
        <Bone style={styles.factorLabelBone} />
        <Bone style={[styles.factorLabelBone, { width: "72%" }]} />
      </View>
      <View style={styles.factorTailWrap}>
        <View style={[styles.factorTailGlyph, { backgroundColor: tint }]} />
        <View
          style={[styles.factorTailGlyphSmall, { backgroundColor: tint }]}
        />
      </View>
    </View>
  );
}

// ─── Time window tile bone ─────────────────────────────────────────────

function TimeWindowSkel({ highlighted }: { highlighted?: boolean }) {
  return (
    <View
      style={[
        styles.timeTile,
        highlighted && {
          backgroundColor: "#E7F5E1",
          borderColor: "rgba(47, 174, 99, 0.45)",
        },
      ]}
    >
      {highlighted && (
        <View style={styles.timeTileGlowRing} pointerEvents="none" />
      )}
      {highlighted && (
        <View style={styles.bestBadge}>
          <View style={styles.bestBadgeBone} />
        </View>
      )}
      <View style={styles.timeTileTop}>
        <View
          style={[
            styles.timeTileIconWrap,
            highlighted && { borderColor: "rgba(47, 174, 99, 0.45)" },
          ]}
        >
          <View style={styles.timeTileIconBone} />
        </View>
      </View>
      <View
        style={[
          styles.timeTileBody,
          highlighted && { borderTopColor: "rgba(47, 174, 99, 0.35)" },
        ]}
      >
        <Bone style={styles.timeTileLabelBone} />
        <Bone style={styles.timeTileRangeBone} />
      </View>
    </View>
  );
}

// ─── Main skeleton ─────────────────────────────────────────────────────

export function HowFishingLoadingSkeleton() {
  const pulse = usePaperBonePulse({ from: 0.32, to: 0.72, duration: 1700 });
  return (
    <PulseCtx.Provider value={pulse}>
      <View style={styles.root}>
        {/* ── HERO CARD ─────────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          {/* Corner crosses on the hero, just like the live page. */}
          <View style={[styles.heroCornerCross, styles.heroCornerCrossTL]}>
            <View style={styles.heroCornerCrossH} />
            <View style={styles.heroCornerCrossV} />
          </View>
          <View style={[styles.heroCornerCross, styles.heroCornerCrossTR]}>
            <View style={styles.heroCornerCrossH} />
            <View style={styles.heroCornerCrossV} />
          </View>
          <View style={[styles.heroCornerCross, styles.heroCornerCrossBL]}>
            <View style={styles.heroCornerCrossH} />
            <View style={styles.heroCornerCrossV} />
          </View>
          <View style={[styles.heroCornerCross, styles.heroCornerCrossBR]}>
            <View style={styles.heroCornerCrossH} />
            <View style={styles.heroCornerCrossV} />
          </View>

          <View style={styles.heroEyebrow}>
            <Bone style={styles.heroEyebrowBone} />
          </View>

          {
            /* Headline — reserves 2-line height so the gauge below lands
              at the same Y as on the live page. */
          }
          <View style={styles.heroHeadlineWrap}>
            <Bone style={styles.heroHeadlineBone} />
            <Bone
              style={[styles.heroHeadlineBone, styles.heroHeadlineBoneAccent]}
            />
          </View>

          {/* Score gauge — premium instrument panel anatomy. */}
          <View style={styles.gaugeWrap}>
            <View style={styles.gaugePanel}>
              {/* Corner crosses inside the gauge panel. */}
              <View
                style={[styles.gaugeCornerCross, styles.gaugeCornerCrossTL]}
              >
                <View style={styles.gaugeCornerCrossH} />
                <View style={styles.gaugeCornerCrossV} />
              </View>
              <View
                style={[styles.gaugeCornerCross, styles.gaugeCornerCrossTR]}
              >
                <View style={styles.gaugeCornerCrossH} />
                <View style={styles.gaugeCornerCrossV} />
              </View>
              <View
                style={[styles.gaugeCornerCross, styles.gaugeCornerCrossBL]}
              >
                <View style={styles.gaugeCornerCrossH} />
                <View style={styles.gaugeCornerCrossV} />
              </View>
              <View
                style={[styles.gaugeCornerCross, styles.gaugeCornerCrossBR]}
              >
                <View style={styles.gaugeCornerCrossH} />
                <View style={styles.gaugeCornerCrossV} />
              </View>

              {/* Soft shimmer placeholder. */}
              <View style={styles.gaugePanelSheen} />

              {/* Header: live dot + label + sep + dim label + band pill. */}
              <View style={styles.gaugeHeader}>
                <View style={styles.gaugeHeaderLeft}>
                  <View style={styles.gaugeLiveDotWrap}>
                    <View style={styles.gaugeLiveDotRing} />
                    <View style={styles.gaugeLiveDot} />
                  </View>
                  <Bone style={styles.gaugeHeaderLabelBone} />
                  <View style={styles.gaugeHeaderSep} />
                  <Bone style={styles.gaugeHeaderLabelDimBone} />
                </View>
                <View style={styles.gaugeBandPill}>
                  <Bone style={styles.gaugeBandPillBone} />
                </View>
              </View>

              <View style={styles.gaugeHeaderRule} />

              {/* Score crest: halo + ornaments + big numeric + /10. */}
              <View style={styles.gaugeScoreRow}>
                <View style={styles.gaugeScoreHalo} />
                <View style={styles.gaugeScoreOrnamentLeft}>
                  <View style={styles.gaugeOrnamentRule} />
                  <View style={styles.gaugeOrnamentGlyph} />
                </View>
                <View style={styles.gaugeScoreStack}>
                  <View style={styles.gaugeScoreNumberRow}>
                    <Bone style={styles.gaugeScoreNumberBone} />
                    <Bone style={styles.gaugeScoreMaxBone} />
                  </View>
                  <View style={styles.gaugeScoreUnderline} />
                </View>
                <View style={styles.gaugeScoreOrnamentRight}>
                  <View style={styles.gaugeOrnamentGlyph} />
                  <View style={styles.gaugeOrnamentRule} />
                </View>
              </View>

              {/* Tick gauge — 21 ticks across (alternating heights). */}
              <View style={styles.gaugeTickRow}>
                {Array.from({ length: 21 }).map((_, i) => {
                  const isMajor = i === 0 || i === 10 || i === 20 || i === 7 ||
                    i === 13 || i === 16;
                  const isWhole = i % 2 === 0;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.gaugeTick,
                        {
                          height: isMajor ? 22 : isWhole ? 18 : 12,
                        },
                      ]}
                    />
                  );
                })}
              </View>

              {/* Scale labels — five anchor points. */}
              <View style={styles.gaugeScaleRow}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Bone key={i} style={styles.gaugeScaleBone} />
                ))}
              </View>

              {/* Tier dots row + label. */}
              <View style={styles.gaugeTierDotsRow}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.gaugeTierDot,
                      i === 2 && styles.gaugeTierDotActive,
                    ]}
                  />
                ))}
                <View style={styles.gaugeTierDotsLabelWrap}>
                  <Bone style={styles.gaugeTierDotsLabelBone} />
                </View>
              </View>
            </View>
          </View>

          {/* Verdict line flanked by hairlines + diamond ornaments. */}
          <View style={styles.heroOutlookRow}>
            <View style={styles.heroOutlookFlank} />
            <View style={styles.heroOutlookDiamond} />
            <Bone style={styles.heroOutlookBone} />
            <View style={styles.heroOutlookDiamond} />
            <View style={styles.heroOutlookFlank} />
          </View>

          {/* Summary block (vertical accent rule + italic lines). */}
          <View style={styles.heroSummaryWrap}>
            <View style={styles.heroSummaryRule} />
            <View style={styles.heroSummaryCol}>
              <Bone style={styles.heroSummaryBone} />
              <Bone style={[styles.heroSummaryBone, { width: "82%" }]} />
            </View>
          </View>

          {/* Meta strip — 3 items (AIR, CTX, TZ) between hairlines. */}
          <View style={styles.metaStripWrap}>
            <View style={styles.metaRule} />
            <View style={styles.metaRow}>
              <Bone style={styles.metaItemBone} />
              <View style={styles.metaSep} />
              <Bone style={styles.metaItemBone} />
              <View style={styles.metaSep} />
              <Bone style={styles.metaItemBone} />
            </View>
            <View style={styles.metaRule} />
          </View>
        </View>

        {/* ── BITE FACTORS section ──────────────────────────────────── */}
        <SectionMastheadSkel />

        {/* What's helping (green header) */}
        <View style={styles.factorCard}>
          <View
            style={[styles.factorHeader, { backgroundColor: paper.bandPrime }]}
          >
            <View style={styles.factorHeaderIcon} />
            <Bone style={styles.factorHeaderLabelBone} />
            <Bone style={styles.factorHeaderCountBone} />
          </View>
          <View style={styles.factorBody}>
            <FactorRowSkel tint={paper.bandPrime} />
            <FactorRowSkel tint={paper.bandPrime} />
            <FactorRowSkel tint={paper.bandPrime} isLast />
          </View>
        </View>

        {/* Watch out for (red header) */}
        <View style={styles.factorCard}>
          <View style={[styles.factorHeader, { backgroundColor: "#F8E7E2" }]}>
            <View style={styles.factorHeaderIcon} />
            <Bone style={styles.factorHeaderLabelBone} />
            <Bone style={styles.factorHeaderCountBone} />
          </View>
          <View style={styles.factorBody}>
            <FactorRowSkel tint={paper.bandTough} />
            <FactorRowSkel tint={paper.bandTough} isLast />
          </View>
        </View>

        {/* ── WHEN TO GO ────────────────────────────────────────────── */}
        <SectionMastheadSkel />
        <View style={styles.timingRow}>
          <TimeWindowSkel />
          <TimeWindowSkel highlighted />
          <TimeWindowSkel />
          <TimeWindowSkel />
        </View>
        <Bone style={styles.daypartBone} />
        <Bone style={[styles.daypartBone, { width: "76%" }]} />

        {/* ── MOON & TIDE almanac ──────────────────────────────────── */}
        <View style={styles.almanacCard}>
          <View style={styles.almanacHeader}>
            <View style={styles.almanacCrescentWrap}>
              <View style={styles.almanacCrescentOuter} />
              <View style={styles.almanacCrescentInner} />
            </View>
            <Bone style={styles.almanacTitleBone} />
            <View style={styles.almanacHeaderTag}>
              <Bone style={styles.almanacHeaderTagBone} />
            </View>
          </View>
          <View style={styles.almanacRule} />
          <View style={styles.almanacRow}>
            <View style={styles.almanacCol}>
              <View style={styles.almanacSubheadRow}>
                <View style={styles.almanacSubheadBar} />
                <Bone style={styles.almanacSubheadBone} />
              </View>
              {[0, 1].map((i) => (
                <View key={i} style={styles.almanacPeriod}>
                  <View style={styles.almanacPulseWrap}>
                    <View style={styles.almanacPulseRing} />
                    <View style={styles.almanacPulseCore} />
                  </View>
                  <Bone style={styles.almanacTimeBone} />
                </View>
              ))}
            </View>
            <View style={[styles.almanacCol, styles.almanacColRight]}>
              <View style={styles.almanacSubheadRow}>
                <View style={[styles.almanacSubheadBar, { opacity: 0.5 }]} />
                <Bone style={[styles.almanacSubheadBone, { opacity: 0.7 }]} />
              </View>
              {[0, 1].map((i) => (
                <View key={i} style={styles.almanacPeriod}>
                  <View style={styles.almanacDotMinor} />
                  <Bone style={[styles.almanacTimeBone, { opacity: 0.45 }]} />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── FIELD STRATEGY with editor's seal badge ──────────────── */}
        <View style={styles.guideCard}>
          <TopographicLines
            style={styles.guideLines}
            color={paper.dashboardBlue}
            count={5}
          />
          <View style={styles.guideEyebrowRow}>
            <Bone style={styles.guideEyebrowBone} />
          </View>
          <View style={styles.guideRow}>
            <View style={styles.guideBadgeWrap}>
              <View style={styles.guideBadgeOuterRing} />
              <View style={styles.guideBadge} />
              <View
                style={[styles.guideBadgeAccentDot, styles.guideBadgeDotTop]}
              />
              <View
                style={[styles.guideBadgeAccentDot, styles.guideBadgeDotRight]}
              />
              <View
                style={[styles.guideBadgeAccentDot, styles.guideBadgeDotBottom]}
              />
              <View
                style={[styles.guideBadgeAccentDot, styles.guideBadgeDotLeft]}
              />
            </View>
            <View style={styles.guideBody}>
              <Bone style={styles.guideTextBone} />
              <Bone style={[styles.guideTextBone, { width: "94%" }]} />
              <Bone style={[styles.guideTextBone, { width: "68%" }]} />
              <View style={styles.guideSignoffRow}>
                <View style={styles.guideSignoffRule} />
                <View style={styles.guideSignoffOrnament} />
                <Bone style={styles.guideSignoffBone} />
              </View>
            </View>
          </View>
        </View>

        {/* ── FOOTER with live pulse + edition stamp ───────────────── */}
        <View style={styles.footerRow}>
          <View style={styles.footerPulseWrap}>
            <View style={styles.footerPulseRing} />
            <View style={styles.footerPulseDot} />
          </View>
          <Bone style={styles.footerBone} />
          <View style={styles.footerSep} />
          <Bone style={styles.footerBone} />
          <View style={styles.footerSep} />
          <Bone style={styles.footerBone} />
        </View>
        <View style={styles.editionStampRow}>
          <View style={styles.editionStampRule} />
          <Bone style={styles.editionStampBone} />
          <View style={styles.editionStampRule} />
        </View>
      </View>
    </PulseCtx.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: paperSpacing.md + 6,
  },
  bone: {
    backgroundColor: paper.dashboardHair,
    borderRadius: 999,
    opacity: 0.6,
  },

  // ── HERO ──────────────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.md,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.md - 2,
    overflow: "hidden",
    alignItems: "center",
    position: "relative",
  },
  heroCornerCross: {
    position: "absolute",
    width: 11,
    height: 11,
    zIndex: 2,
  },
  heroCornerCrossTL: { top: 7, left: 7 },
  heroCornerCrossTR: { top: 7, right: 7 },
  heroCornerCrossBL: { bottom: 7, left: 7 },
  heroCornerCrossBR: { bottom: 7, right: 7 },
  heroCornerCrossH: {
    position: "absolute",
    top: 5,
    left: 0,
    width: 11,
    height: 1,
    backgroundColor: "rgba(28, 36, 25, 0.32)",
  },
  heroCornerCrossV: {
    position: "absolute",
    left: 5,
    top: 0,
    width: 1,
    height: 11,
    backgroundColor: "rgba(28, 36, 25, 0.32)",
  },
  heroEyebrow: {
    marginBottom: 4,
    alignItems: "center",
  },
  heroEyebrowBone: {
    width: 128,
    height: 10,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.32,
  },
  heroHeadlineWrap: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: 6,
    marginVertical: 4,
    minHeight: 56,
    justifyContent: "center",
  },
  heroHeadlineBone: {
    height: 22,
    width: "60%",
    borderRadius: 4,
  },
  heroHeadlineBoneAccent: {
    width: "45%",
    backgroundColor: paper.dashboardBlue,
    opacity: 0.22,
  },

  // ── Gauge panel ─────────────────────────────────────────────────────
  gaugeWrap: {
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: paperSpacing.sm,
    marginBottom: paperSpacing.xs,
    width: "100%",
  },
  gaugePanel: {
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 14,
    backgroundColor: "#F7FAFB",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  gaugeCornerCross: {
    position: "absolute",
    width: 10,
    height: 10,
    zIndex: 2,
  },
  gaugeCornerCrossTL: { top: 5, left: 5 },
  gaugeCornerCrossTR: { top: 5, right: 5 },
  gaugeCornerCrossBL: { bottom: 5, left: 5 },
  gaugeCornerCrossBR: { bottom: 5, right: 5 },
  gaugeCornerCrossH: {
    position: "absolute",
    top: 4.5,
    left: 0,
    width: 10,
    height: 1,
    backgroundColor: "rgba(28, 36, 25, 0.35)",
  },
  gaugeCornerCrossV: {
    position: "absolute",
    left: 4.5,
    top: 0,
    width: 1,
    height: 10,
    backgroundColor: "rgba(28, 36, 25, 0.35)",
  },
  gaugePanelSheen: {
    position: "absolute",
    top: -10,
    bottom: -10,
    left: "22%",
    width: 90,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  gaugeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 6,
    zIndex: 3,
  },
  gaugeHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flex: 1,
    minWidth: 0,
  },
  gaugeLiveDotWrap: {
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeLiveDotRing: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    opacity: 0.4,
  },
  gaugeLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.55,
  },
  gaugeHeaderLabelBone: {
    height: 9,
    width: 96,
    backgroundColor: paper.dashboardInk,
    opacity: 0.4,
  },
  gaugeHeaderSep: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: paper.dashboardMuted,
    opacity: 0.55,
  },
  gaugeHeaderLabelDimBone: {
    height: 9,
    width: 60,
    opacity: 0.3,
  },
  gaugeBandPill: {
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: paper.dashboardInk,
    opacity: 0.35,
  },
  gaugeBandPillBone: {
    height: 9,
    width: 54,
    backgroundColor: paper.dashboardWhite,
    opacity: 0.6,
  },
  gaugeHeaderRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardLine,
    marginBottom: 8,
    zIndex: 3,
    opacity: 0.6,
  },

  gaugeScoreRow: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginTop: 4,
    marginBottom: 10,
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 6,
    position: "relative",
    zIndex: 3,
  },
  gaugeScoreHalo: {
    position: "absolute",
    top: 4,
    bottom: 14,
    left: "20%",
    right: "20%",
    borderRadius: 48,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.12,
  },
  gaugeScoreOrnamentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "flex-end",
    maxWidth: 80,
  },
  gaugeScoreOrnamentRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "flex-start",
    maxWidth: 80,
  },
  gaugeOrnamentRule: {
    flex: 1,
    height: 1,
    minWidth: 28,
    maxWidth: 60,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.4,
  },
  gaugeOrnamentGlyph: {
    width: 7,
    height: 7,
    transform: [{ rotate: "45deg" }],
    backgroundColor: paper.dashboardBlue,
    opacity: 0.55,
  },
  gaugeScoreStack: {
    alignItems: "center",
    minWidth: 168,
    gap: 4,
  },
  gaugeScoreNumberRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  gaugeScoreNumberBone: {
    height: 64,
    width: 130,
    borderRadius: 6,
    backgroundColor: paper.dashboardInk,
    opacity: 0.32,
  },
  gaugeScoreMaxBone: {
    height: 16,
    width: 32,
    marginBottom: 12,
    opacity: 0.35,
  },
  gaugeScoreUnderline: {
    height: 2.5,
    borderRadius: 2,
    width: "55%",
    backgroundColor: paper.dashboardBlue,
    opacity: 0.4,
  },

  // Tick gauge — 21 thin tick marks.
  gaugeTickRow: {
    width: "100%",
    height: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    zIndex: 3,
  },
  gaugeTick: {
    width: 3,
    borderRadius: 1.5,
    backgroundColor: paper.dashboardLine,
    opacity: 0.35,
  },
  gaugeScaleRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    zIndex: 3,
  },
  gaugeScaleBone: {
    height: 9,
    width: 18,
    opacity: 0.4,
  },
  gaugeTierDotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardHair,
    zIndex: 3,
  },
  gaugeTierDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.2,
    borderColor: paper.dashboardLine,
  },
  gaugeTierDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.6,
  },
  gaugeTierDotsLabelWrap: {
    marginLeft: "auto",
  },
  gaugeTierDotsLabelBone: {
    height: 9,
    width: 96,
    opacity: 0.4,
  },

  // ── Hero outlook row (verdict line) ──────────────────────────────────
  heroOutlookRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: paperSpacing.xs,
    alignSelf: "stretch",
  },
  heroOutlookFlank: {
    height: 1,
    flex: 1,
    maxWidth: 36,
    minWidth: 14,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.35,
  },
  heroOutlookDiamond: {
    width: 7,
    height: 7,
    transform: [{ rotate: "45deg" }],
    backgroundColor: paper.dashboardBlue,
    opacity: 0.5,
  },
  heroOutlookBone: {
    height: 16,
    flexShrink: 1,
    minWidth: 180,
    maxWidth: 220,
  },

  // ── Hero summary block ──────────────────────────────────────────────
  heroSummaryWrap: {
    flexDirection: "row",
    alignItems: "stretch",
    alignSelf: "center",
    maxWidth: 340,
    paddingHorizontal: paperSpacing.xs,
    marginTop: 0,
    marginBottom: paperSpacing.xs,
    gap: 10,
  },
  heroSummaryRule: {
    width: 2.5,
    borderRadius: 1,
    opacity: 0.85,
    backgroundColor: paper.dashboardBlue,
  },
  heroSummaryCol: {
    flex: 1,
    gap: 5,
    paddingTop: 2,
  },
  heroSummaryBone: {
    height: 12,
    width: "92%",
    opacity: 0.5,
  },

  // ── Meta strip ───────────────────────────────────────────────────────
  metaStripWrap: {
    width: "100%",
    marginTop: paperSpacing.sm + 4,
  },
  metaRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardLine,
    opacity: 0.45,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 6,
  },
  metaItemBone: {
    height: 10,
    width: 64,
    opacity: 0.5,
  },
  metaSep: {
    width: StyleSheet.hairlineWidth,
    height: 12,
    backgroundColor: paper.dashboardLine,
    opacity: 0.35,
  },

  // ── Section masthead ─────────────────────────────────────────────────
  sectionMasthead: {
    width: "100%",
    alignItems: "stretch",
    gap: 4,
  },
  sectionMastheadRuleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: "100%",
  },
  sectionMastheadCap: {
    width: 5,
    height: 5,
    borderRadius: 1,
    backgroundColor: paper.dashboardInk,
    opacity: 0.55,
  },
  sectionMastheadOrnament: {
    width: 6,
    height: 6,
    transform: [{ rotate: "45deg" }],
    backgroundColor: paper.dashboardInk,
    opacity: 0.4,
  },
  sectionMastheadRule: {
    height: 1.6,
    flex: 1,
    backgroundColor: paper.dashboardInk,
    opacity: 0.5,
  },
  sectionMastheadInner: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingVertical: 4,
    gap: 8,
    flexWrap: "wrap",
  },
  sectionMastheadTitleBone: {
    height: 14,
    width: 110,
  },
  sectionMastheadMetaBone: {
    height: 11,
    width: 70,
    opacity: 0.45,
  },

  // ── Factor cards ─────────────────────────────────────────────────────
  factorCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    overflow: "hidden",
  },
  factorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md + 2,
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: paper.dashboardLine,
  },
  factorHeaderIcon: {
    width: 15,
    height: 15,
    borderRadius: 2,
    backgroundColor: paper.dashboardWhite,
    opacity: 0.55,
  },
  factorHeaderLabelBone: {
    flex: 1,
    height: 11,
    backgroundColor: paper.dashboardInk,
    opacity: 0.5,
  },
  factorHeaderCountBone: {
    height: 10,
    width: 28,
    opacity: 0.45,
  },
  factorBody: {
    paddingHorizontal: paperSpacing.md - 2,
    paddingTop: paperSpacing.xs,
    paddingBottom: paperSpacing.sm,
  },
  factorRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm + 2,
  },
  factorRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: paper.dashboardHair,
    borderStyle: "solid",
  },
  factorOrdinalCol: {
    width: 28,
    alignItems: "flex-start",
    paddingTop: 1,
    gap: 4,
  },
  factorOrdinalDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginLeft: 4,
    opacity: 0.85,
  },
  factorOrdinalBone: {
    height: 22,
    width: 22,
    borderRadius: 4,
  },
  factorRibbon: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 2,
    minHeight: 38,
  },
  factorTextStack: {
    flex: 1,
    minWidth: 0,
    gap: 4,
    paddingTop: 1,
  },
  factorEyebrowBone: {
    height: 9,
    width: 90,
    borderRadius: 2,
  },
  factorLabelBone: {
    height: 14,
    width: "100%",
    opacity: 0.55,
  },
  factorTailWrap: {
    alignSelf: "center",
    alignItems: "center",
    gap: 3,
    width: 6,
    marginLeft: 4,
    opacity: 0.65,
  },
  factorTailGlyph: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  factorTailGlyphSmall: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.6,
  },

  // ── Timing tiles ─────────────────────────────────────────────────────
  timingRow: {
    flexDirection: "row",
    gap: 8,
  },
  timeTile: {
    flex: 1,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    overflow: "hidden",
    minHeight: 110,
    position: "relative",
  },
  timeTileGlowRing: {
    position: "absolute",
    top: -2,
    bottom: -2,
    left: -2,
    right: -2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(47, 174, 99, 0.18)",
    zIndex: 1,
  },
  timeTileTop: {
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 8,
    alignItems: "center",
  },
  timeTileIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.dashboardHair,
    backgroundColor: "#FAFAF7",
    alignItems: "center",
    justifyContent: "center",
  },
  timeTileIconBone: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: paper.dashboardHair,
    opacity: 0.65,
  },
  timeTileBody: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardHair,
    alignItems: "center",
    gap: 4,
  },
  timeTileLabelBone: {
    height: 13,
    width: "70%",
  },
  timeTileRangeBone: {
    height: 9,
    width: "60%",
    opacity: 0.45,
  },
  bestBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: paper.dashboardInk,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
  },
  bestBadgeBone: {
    width: 10,
    height: 6,
    borderRadius: 2,
    backgroundColor: paper.dashboardWhite,
    opacity: 0.85,
  },
  daypartBone: {
    height: 12,
    width: "100%",
    marginTop: paperSpacing.sm + 2,
    opacity: 0.5,
  },

  // ── MOON & TIDE almanac ──────────────────────────────────────────────
  almanacCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md,
  },
  almanacHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  almanacCrescentWrap: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  almanacCrescentOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: paper.dashboardBlue,
    opacity: 0.7,
  },
  almanacCrescentInner: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: paper.dashboardWhite,
    top: 1,
    left: 4,
  },
  almanacTitleBone: {
    height: 12,
    width: 110,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.4,
    flexShrink: 1,
  },
  almanacHeaderTag: {
    marginLeft: "auto",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.dashboardLine,
    backgroundColor: "#F6F9FB",
  },
  almanacHeaderTagBone: {
    height: 9,
    width: 42,
    opacity: 0.5,
  },
  almanacRule: {
    height: 1.5,
    backgroundColor: paper.dashboardLine,
    opacity: 0.7,
    marginTop: paperSpacing.sm,
    marginBottom: paperSpacing.sm + 2,
  },
  almanacRow: {
    flexDirection: "row",
    gap: paperSpacing.md,
  },
  almanacCol: {
    flex: 1,
  },
  almanacColRight: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: paper.dashboardLine,
    paddingLeft: paperSpacing.md,
  },
  almanacSubheadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: paperSpacing.xs,
  },
  almanacSubheadBar: {
    width: 3,
    height: 10,
    borderRadius: 1.5,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.85,
  },
  almanacSubheadBone: {
    height: 9,
    width: 100,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.45,
  },
  almanacPeriod: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  almanacPulseWrap: {
    width: 12,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  almanacPulseRing: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    opacity: 0.6,
  },
  almanacPulseCore: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.85,
  },
  almanacDotMinor: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    opacity: 0.55,
  },
  almanacTimeBone: {
    height: 11,
    width: 96,
    flex: 1,
    opacity: 0.5,
  },

  // ── FIELD STRATEGY ──────────────────────────────────────────────────
  guideCard: {
    position: "relative",
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.lg,
    overflow: "hidden",
  },
  guideLines: {
    left: undefined,
    right: -30,
    top: -20,
    width: 280,
    height: 280,
    opacity: 0.35,
  },
  guideEyebrowRow: {
    marginBottom: paperSpacing.sm + 2,
  },
  guideEyebrowBone: {
    height: 10,
    width: 92,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.4,
  },
  guideRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: paperSpacing.md + 4,
  },
  guideBadgeWrap: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexShrink: 0,
    marginTop: 2,
  },
  guideBadgeOuterRing: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.dashboardBlue,
    opacity: 0.45,
  },
  guideBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardBlueSky,
    opacity: 0.6,
  },
  guideBadgeAccentDot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.55,
  },
  guideBadgeDotTop: { top: 0, alignSelf: "center" },
  guideBadgeDotBottom: { bottom: 0, alignSelf: "center" },
  guideBadgeDotLeft: { left: 0, top: "50%", marginTop: -2 },
  guideBadgeDotRight: { right: 0, top: "50%", marginTop: -2 },
  guideBody: { flex: 1, gap: 5 },
  guideTextBone: {
    height: 13,
    width: "100%",
    opacity: 0.5,
    marginVertical: 2,
  },
  guideSignoffRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: paperSpacing.sm + 2,
  },
  guideSignoffRule: {
    width: 16,
    height: 1,
    backgroundColor: paper.dashboardLine,
    opacity: 0.85,
  },
  guideSignoffOrnament: {
    width: 5,
    height: 5,
    transform: [{ rotate: "45deg" }],
    backgroundColor: paper.dashboardBlue,
    opacity: 0.5,
  },
  guideSignoffBone: {
    height: 9,
    width: 130,
    opacity: 0.45,
  },

  // ── Footer + edition stamp ──────────────────────────────────────────
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
  },
  footerPulseWrap: {
    width: 10,
    height: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  footerPulseRing: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    opacity: 0.45,
  },
  footerPulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.7,
  },
  footerBone: {
    height: 9,
    width: 78,
    opacity: 0.5,
  },
  footerSep: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: paper.dashboardMuted,
    opacity: 0.45,
    marginHorizontal: 1,
  },
  editionStampRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingTop: 8,
  },
  editionStampRule: {
    height: StyleSheet.hairlineWidth,
    flex: 1,
    maxWidth: 32,
    backgroundColor: paper.dashboardLine,
    opacity: 0.65,
  },
  editionStampBone: {
    height: 9,
    width: 140,
    opacity: 0.5,
  },
});
