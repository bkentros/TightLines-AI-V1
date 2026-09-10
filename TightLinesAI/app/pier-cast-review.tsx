import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PaperNavHeader } from "../components/paper/PaperNavHeader";
import { isAdminEmail } from "../lib/adminAccess";
import {
  fetchPierCastOwnerReviewCatalog,
  PierCastRequestError,
} from "../lib/pierCast";
import type {
  PierCastCatalogCityRead,
  PierCastCatalogResponse,
  PierCastCitySpeciesRead,
  PierCastSpeciesId,
  PierCastStructureRead,
} from "../lib/pierCastContracts";
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from "../lib/theme";
import { useAuthStore } from "../store/authStore";

const SPECIES_LABELS: Record<PierCastSpeciesId, string> = {
  chinook_salmon: "Chinook Salmon",
  coho_salmon: "Coho Salmon",
  steelhead: "Steelhead",
  brown_trout: "Brown Trout",
  lake_trout: "Lake Trout",
  walleye: "Walleye",
  smallmouth_bass: "Smallmouth Bass",
  freshwater_drum: "Freshwater Drum",
  yellow_perch: "Yellow Perch",
  lake_whitefish: "Lake Whitefish",
  round_whitefish: "Round Whitefish",
  channel_catfish: "Channel Catfish",
  largemouth_bass: "Largemouth Bass",
};

const INHERITANCE_ORDER: Record<
  PierCastCitySpeciesRead["inheritance"],
  number
> = {
  candidate: 0,
  conditional: 1,
  historical_lead: 2,
  unresolved: 3,
};

function statusLabel(value: string): string {
  return value.replaceAll("_", " ").toUpperCase();
}

function StructureRow({ structure }: { structure: PierCastStructureRead }) {
  const statusColor = structure.disposition === "candidate"
    ? paper.moss
    : structure.disposition === "excluded"
    ? paper.red
    : paper.goldDk;
  return (
    <View style={styles.detailRow}>
      <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      <View style={styles.detailBody}>
        <View style={styles.detailTitleRow}>
          <Text style={styles.detailTitle}>{structure.displayName}</Text>
          <Text style={[styles.detailStatus, { color: statusColor }]}>
            {statusLabel(structure.disposition)}
          </Text>
        </View>
        <Text style={styles.detailMeta}>{structure.municipality}</Text>
        <Text style={styles.detailCopy}>{structure.limitation}</Text>
      </View>
    </View>
  );
}

function SpeciesRow({ species }: { species: PierCastCitySpeciesRead }) {
  const statusColor = species.inheritance === "candidate"
    ? paper.moss
    : species.inheritance === "unresolved"
    ? paper.inkSoft
    : paper.goldDk;
  return (
    <View style={styles.speciesRow}>
      <View style={styles.speciesIdentity}>
        <Text style={styles.speciesName}>
          {SPECIES_LABELS[species.speciesId]}
        </Text>
        {species.limitation
          ? <Text style={styles.speciesLimit}>{species.limitation}</Text>
          : null}
        {species.seasonalOpportunityCurve
          ? (
            <Text style={styles.calibrationMeta}>
              PROVISIONAL SEASONAL CURVE · RATING OFF
            </Text>
          )
          : null}
      </View>
      <View style={[styles.statusChip, { borderColor: statusColor }]}>
        <Text style={[styles.statusChipText, { color: statusColor }]}>
          {statusLabel(species.inheritance)}
        </Text>
      </View>
    </View>
  );
}

function CityReview({ city }: { city: PierCastCatalogCityRead }) {
  const species = useMemo(
    () =>
      [...city.species].sort((a, b) =>
        INHERITANCE_ORDER[a.inheritance] - INHERITANCE_ORDER[b.inheritance] ||
        SPECIES_LABELS[a.speciesId].localeCompare(SPECIES_LABELS[b.speciesId])
      ),
    [city.species],
  );
  const candidateCount =
    city.species.filter((item) => item.inheritance === "candidate").length;

  return (
    <>
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>CITY RESEARCH PROFILE</Text>
        <Text style={styles.cityTitle}>{city.displayName}</Text>
        <Text style={styles.cityMeta}>
          {city.stateCode} · {city.timezone} · {candidateCount}{" "}
          candidate targets
        </Text>
        <View style={styles.disabledBanner}>
          <Ionicons name="lock-closed" size={14} color={paper.redDk} />
          <Text style={styles.disabledBannerText}>
            RATINGS NOT ENABLED · RESEARCH REVIEW ONLY
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionEyebrow}>WATER TEMPERATURE PLAN</Text>
        {city.waterTemperatureSource
          ? (
            <>
              <Text style={styles.sourceTitle}>
                {city.waterTemperatureSource.displayName}
              </Text>
              <Text style={styles.detailMeta}>
                120-HOUR MODEL · FAILS CLOSED · CANDIDATE CELL, NOT APPROVED
              </Text>
              {city.waterTemperatureSource.configuredLocation
                ? (
                  <Text style={styles.calibrationMeta}>
                    CELL{" "}
                    {city.waterTemperatureSource.configuredLocation.gridRow}
                    :{city.waterTemperatureSource.configuredLocation.gridColumn}
                    {" · "}
                    {city.waterTemperatureSource.configuredLocation.latitude
                      .toFixed(
                        2,
                      )}
                    , {city.waterTemperatureSource.configuredLocation.longitude
                      .toFixed(
                        2,
                      )} · SURFACE
                  </Text>
                )
                : null}
              <Text style={styles.sectionIntro}>
                {city.waterTemperatureSource.limitation}
              </Text>
              <Text style={styles.calibrationMeta}>
                {city.waterTemperatureSource.validationObservation
                  ? `${
                    city.waterTemperatureSource.validationObservation
                        .availabilityStatus === "historical_only"
                      ? "HISTORICAL CHECK"
                      : "SEASONAL CHECK"
                  }: GLOS ${city.waterTemperatureSource.validationObservation.datasetId}`
                  : "NO PIER-LOCAL OBSERVATION FOUND"}
              </Text>
            </>
          )
          : (
            <Text style={styles.sectionIntro}>
              No provisional temperature-source plan is configured.
            </Text>
          )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionEyebrow}>COVERS THESE PIERS</Text>
        <Text style={styles.sectionIntro}>
          Candidate scope is shown with unresolved and excluded structures kept
          visible. None represents live access confirmation.
        </Text>
        {city.structures.map((structure) => (
          <StructureRow key={structure.structureId} structure={structure} />
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionEyebrow}>SPECIES DISPOSITION</Text>
        <Text style={styles.sectionIntro}>
          Candidate means eligible for the next representation and calibration
          review—not forecast-ready.
        </Text>
        {species.map((item) => (
          <SpeciesRow key={item.speciesId} species={item} />
        ))}
      </View>
    </>
  );
}

export default function PierCastReviewScreen() {
  const router = useRouter();
  const email = useAuthStore((state) => state.user?.email);
  const admin = isAdminEmail(email);
  const [catalog, setCatalog] = useState<PierCastCatalogResponse | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(admin);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!admin) return;
    setLoading(true);
    setError(null);
    try {
      const next = await fetchPierCastOwnerReviewCatalog();
      setCatalog(next);
      setSelectedCityId((current) =>
        next.cities.some((city) => city.cityId === current)
          ? current
          : next.cities[0]?.cityId ?? null
      );
    } catch (caught) {
      const message = caught instanceof PierCastRequestError
        ? caught.message
        : caught instanceof Error
        ? caught.message
        : "PierCast review could not be loaded.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [admin]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedCity =
    catalog?.cities.find((city) => city.cityId === selectedCityId) ?? null;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <PaperNavHeader
        eyebrow="FINFINDR · OWNER REVIEW"
        eyebrowColor={paper.dashboardBlueLight}
        title="PIER CAST"
        onBack={() => router.back()}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!admin
          ? (
            <View style={styles.card}>
              <Text style={styles.sectionEyebrow}>RESTRICTED</Text>
              <Text style={styles.restrictedTitle}>Owner review only.</Text>
              <Text style={styles.sectionIntro}>
                PierCast remains private while source representation and rating
                calibration are being validated.
              </Text>
            </View>
          )
          : loading
          ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator color={paper.dashboardBlue} />
              <Text style={styles.loadingText}>Loading research catalog…</Text>
            </View>
          )
          : error
          ? (
            <View style={styles.card}>
              <Text style={styles.sectionEyebrow}>CATALOG UNAVAILABLE</Text>
              <Text style={styles.sectionIntro}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={() => void load()}>
                <Text style={styles.retryText}>TRY AGAIN</Text>
              </Pressable>
            </View>
          )
          : catalog && selectedCity
          ? (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cityRail}
              >
                {catalog.cities.map((city) => {
                  const selected = city.cityId === selectedCity.cityId;
                  return (
                    <Pressable
                      key={city.cityId}
                      style={[
                        styles.cityChip,
                        selected && styles.cityChipSelected,
                      ]}
                      onPress={() => setSelectedCityId(city.cityId)}
                    >
                      <Text
                        style={[
                          styles.cityChipText,
                          selected && styles.cityChipTextSelected,
                        ]}
                      >
                        {city.displayName.toUpperCase()}
                      </Text>
                      {city.tentative
                        ? <Text style={styles.tentativeText}>TENTATIVE</Text>
                        : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
              <CityReview city={selectedCity} />
              <View style={styles.disclosureCard}>
                <Text style={styles.disclosureTitle}>{catalog.ratingName}</Text>
                <Text style={styles.formulaCopy}>
                  DISPLAY: {catalog.ratingDisplayFormat}{" "}
                  · SEASONAL CEILING × WATER TEMPERATURE
                </Text>
                <Text style={styles.disclosureCopy}>{catalog.disclosure}</Text>
                <Text style={styles.winterPolicyTitle}>JAN–MAR POLICY</Text>
                <Text style={styles.disclosureCopy}>
                  {catalog.winterOpenWaterNotice}
                </Text>
              </View>
            </>
          )
          : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.dashboardInk },
  scroll: { flex: 1, backgroundColor: paper.dashboardCream },
  content: {
    padding: paperSpacing.md,
    paddingBottom: 48,
    gap: paperSpacing.md,
  },
  cityRail: { gap: 8, paddingRight: paperSpacing.md },
  cityChip: {
    borderWidth: 1.5,
    borderColor: paper.inkHair,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  cityChipSelected: {
    backgroundColor: paper.dashboardInk,
    borderColor: paper.dashboardInk,
  },
  cityChipText: {
    color: paper.ink,
    fontFamily: paperFonts.monoBold,
    fontSize: 10,
    letterSpacing: 1,
  },
  cityChipTextSelected: { color: paper.dashboardWhite },
  tentativeText: {
    marginTop: 2,
    color: paper.goldDk,
    fontFamily: paperFonts.monoBold,
    fontSize: 7,
    letterSpacing: 1,
  },
  heroCard: {
    backgroundColor: paper.dashboardInk,
    borderRadius: paperRadius.card,
    padding: paperSpacing.lg,
    ...paperShadows.hard,
  },
  eyebrow: {
    color: paper.dashboardBlueLight,
    fontFamily: paperFonts.monoBold,
    fontSize: 10,
    letterSpacing: 1.8,
  },
  cityTitle: {
    marginTop: 6,
    color: paper.dashboardWhite,
    fontFamily: paperFonts.display,
    fontSize: 32,
  },
  cityMeta: {
    marginTop: 4,
    color: "rgba(255,255,255,0.7)",
    fontFamily: paperFonts.body,
    fontSize: 13,
  },
  disabledBanner: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 6,
    padding: 10,
  },
  disabledBannerText: {
    flex: 1,
    color: paper.dashboardWhite,
    fontFamily: paperFonts.monoBold,
    fontSize: 9,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    ...paperShadows.hard,
  },
  sectionEyebrow: {
    color: paper.dashboardBlue,
    fontFamily: paperFonts.monoBold,
    fontSize: 10,
    letterSpacing: 1.7,
  },
  sectionIntro: {
    marginTop: 8,
    marginBottom: 6,
    color: paper.inkSoft,
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  sourceTitle: {
    marginTop: 8,
    color: paper.ink,
    fontFamily: paperFonts.bodyBold,
    fontSize: 14,
  },
  calibrationMeta: {
    marginTop: 5,
    color: paper.dashboardBlue,
    fontFamily: paperFonts.monoBold,
    fontSize: 8,
    letterSpacing: 0.7,
  },
  detailRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.inkHair,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  detailBody: { flex: 1 },
  detailTitleRow: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  detailTitle: {
    flex: 1,
    color: paper.ink,
    fontFamily: paperFonts.bodyBold,
    fontSize: 14,
  },
  detailStatus: {
    fontFamily: paperFonts.monoBold,
    fontSize: 8,
    letterSpacing: 0.8,
  },
  detailMeta: {
    marginTop: 2,
    color: paper.inkSoft,
    fontFamily: paperFonts.mono,
    fontSize: 9,
  },
  detailCopy: {
    marginTop: 5,
    color: paper.inkSoft,
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
  speciesRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 11,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.inkHair,
  },
  speciesIdentity: { flex: 1 },
  speciesName: {
    color: paper.ink,
    fontFamily: paperFonts.bodyBold,
    fontSize: 14,
  },
  speciesLimit: {
    marginTop: 3,
    color: paper.inkSoft,
    fontFamily: paperFonts.body,
    fontSize: 11,
    lineHeight: 15,
  },
  statusChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  statusChipText: {
    fontFamily: paperFonts.monoBold,
    fontSize: 7,
    letterSpacing: 0.6,
  },
  disclosureCard: {
    backgroundColor: paper.paperLight,
    borderLeftWidth: 4,
    borderLeftColor: paper.dashboardBlue,
    padding: paperSpacing.md,
  },
  disclosureTitle: {
    color: paper.ink,
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
  },
  disclosureCopy: {
    marginTop: 5,
    color: paper.inkSoft,
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
  formulaCopy: {
    marginTop: 5,
    color: paper.dashboardBlue,
    fontFamily: paperFonts.monoBold,
    fontSize: 9,
    letterSpacing: 0.6,
  },
  winterPolicyTitle: {
    marginTop: 14,
    color: paper.ink,
    fontFamily: paperFonts.monoBold,
    fontSize: 9,
    letterSpacing: 1,
  },
  loadingCard: { alignItems: "center", gap: 12, paddingVertical: 64 },
  loadingText: {
    color: paper.inkSoft,
    fontFamily: paperFonts.body,
    fontSize: 13,
  },
  restrictedTitle: {
    marginTop: 10,
    color: paper.ink,
    fontFamily: paperFonts.display,
    fontSize: 26,
  },
  retryButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    backgroundColor: paper.dashboardInk,
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryText: {
    color: paper.dashboardWhite,
    fontFamily: paperFonts.monoBold,
    fontSize: 10,
    letterSpacing: 1,
  },
});
