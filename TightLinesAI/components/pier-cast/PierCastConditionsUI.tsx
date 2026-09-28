import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  PierCastCityReportReadV4,
  PierCastConditionsCatalogCityV4,
  PierCastConditionsCatalogResponseV4,
  PierCastLeaderboardCityReadV4,
  PierCastLeaderboardResponseV4,
  PierCastSeasonalBandV4,
  PierCastSpeciesConditionsReadV4,
  PierCastTargetSpeciesOptionV4,
  PierCastThermalBandV4,
} from "../../lib/pierCastConditionsV4";
import {
  formatConditionsFreshness,
  formatDistanceFromOptimum,
  formatLocalContext,
  formatOptimumRange,
  formatSeasonTrend,
  formatWaterTemperature,
  PIER_CAST_SPECIES_LABELS,
  PIER_CAST_STATE_LABELS,
  seasonalBandLabel,
  thermalBandLabel,
} from "../../lib/pierCastConditionsPresentation";
import type { PierCastSpeciesId } from "../../lib/pierCastContracts";
import { getPierCastSpeciesImage } from "../../lib/pierCastSpeciesImages";
import type { PierCastHourlyWeatherPoint } from "../../lib/pierCastWeather";
import { paper, paperFonts, paperShadows } from "../../lib/theme";
import { hapticSelection } from "../../lib/safeHaptics";
import { CornerMarkSet, SectionEyebrow, TopographicLines } from "../paper";
import { PierCastTemperatureChart } from "./PierCastVisuals";

const CONDITION_COLORS = {
  excellent: { fill: paper.bandPrime, ink: "#155B2D", wash: "#E8F6EC" },
  good: { fill: paper.bandGood, ink: "#335E27", wash: "#EEF7E9" },
  fair: { fill: paper.bandFair, ink: "#695500", wash: "#FFF9DD" },
  poor: { fill: paper.bandPoor, ink: "#824515", wash: "#FFF1E4" },
  usually_off: { fill: paper.bandTough, ink: "#842B21", wash: "#FCEAE7" },
} as const;

const MEDAL_COLORS = [paper.medalGold, paper.medalSilver, paper.medalBronze];

type ConditionsBand = PierCastSeasonalBandV4 | PierCastThermalBandV4;

function bandTheme(band: ConditionsBand | null) {
  return band ? CONDITION_COLORS[band] : {
    fill: paper.dashboardMuted,
    ink: paper.dashboardMuted,
    wash: paper.dashboardCream,
  };
}

function SpeciesFish({ speciesId, compact = false }: {
  speciesId: PierCastSpeciesId;
  compact?: boolean;
}) {
  return (
    <Image
      source={getPierCastSpeciesImage(speciesId)}
      style={compact ? styles.fishCompact : styles.fishHero}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
      accessibilityLabel={PIER_CAST_SPECIES_LABELS[speciesId]}
    />
  );
}

function ConditionPill({ band, kind }: {
  band: ConditionsBand | null;
  kind: "seasonal" | "thermal";
}) {
  const theme = bandTheme(band);
  const bandLabel = band
    ? kind === "seasonal"
      ? seasonalBandLabel(band as PierCastSeasonalBandV4)
      : thermalBandLabel(band as PierCastThermalBandV4)
    : "Unavailable";
  const label = `${kind === "seasonal" ? "Season" : "Temp"} · ${bandLabel}`;
  return (
    <View style={[styles.conditionPill, { backgroundColor: theme.wash, borderColor: theme.fill }]}>
      <View style={[styles.conditionDot, { backgroundColor: theme.fill }]} />
      <Text style={[styles.conditionPillText, { color: theme.ink }]}>{label}</Text>
    </View>
  );
}

function TargetChip({ option, selected, onPress }: {
  option: PierCastTargetSpeciesOptionV4;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Target ${option.displayName}`}
      onPress={() => {
        hapticSelection();
        onPress();
      }}
      style={({ pressed }) => [
        styles.targetChip,
        selected && styles.targetChipSelected,
        pressed && styles.pressed,
      ]}
    >
      <SpeciesFish speciesId={option.speciesId} compact />
      <View style={styles.targetChipCopy}>
        <Text style={[styles.targetChipLabel, selected && styles.targetChipLabelSelected]}>
          {option.displayName}
        </Text>
        <Text style={[styles.targetChipMeta, selected && styles.targetChipMetaSelected]}>
          {option.availableCityCount} {option.availableCityCount === 1 ? "city" : "cities"}
        </Text>
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" /> : null}
    </Pressable>
  );
}

export function PierCastTargetSelector({
  options,
  selectedSpeciesId,
  onSelect,
  compact = false,
}: {
  options: PierCastTargetSpeciesOptionV4[];
  selectedSpeciesId: PierCastSpeciesId | null;
  onSelect: (speciesId: PierCastSpeciesId) => void;
  compact?: boolean;
}) {
  const common = options.filter((option) => option.placement === "commonly_targeted_now");
  const all = options.filter((option) => option.placement === "all_species");
  return (
    <View style={[styles.targetSelector, compact && styles.targetSelectorCompact]}>
      <View style={styles.targetSelectorHead}>
        <View style={styles.targetIcon}>
          <Ionicons name="fish-outline" size={19} color="#FFFFFF" />
        </View>
        <View style={styles.targetSelectorTitleWrap}>
          <Text style={styles.targetSelectorEyebrow}>BUILD YOUR LEADERBOARD</Text>
          <Text style={styles.targetSelectorTitle}>What are you targeting?</Text>
        </View>
      </View>
      {common.length > 0 ? (
        <>
          <Text style={styles.targetGroupLabel}>COMMONLY TARGETED NOW</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.targetChipRail}
          >
            {common.map((option) => (
              <TargetChip
                key={option.speciesId}
                option={option}
                selected={selectedSpeciesId === option.speciesId}
                onPress={() => onSelect(option.speciesId)}
              />
            ))}
          </ScrollView>
        </>
      ) : null}
      {all.length > 0 ? (
        <>
          <Text style={styles.targetGroupLabel}>ALL SPECIES</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.targetChipRail}
          >
            {all.map((option) => (
              <TargetChip
                key={option.speciesId}
                option={option}
                selected={selectedSpeciesId === option.speciesId}
                onPress={() => onSelect(option.speciesId)}
              />
            ))}
          </ScrollView>
        </>
      ) : null}
      {!selectedSpeciesId && !compact ? (
        <View style={styles.selectionCallout}>
          <Ionicons name="information-circle-outline" size={17} color={paper.dashboardBlue} />
          <Text style={styles.selectionCalloutText}>
            PierCast ranks comparable conditions for one species at a time. Choose a target to see the standings.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function RankMedallion({ rank }: { rank: number | null }) {
  const medal = rank && rank <= 3 ? MEDAL_COLORS[rank - 1] : null;
  return (
    <View style={[styles.rankMedallion, medal ? { backgroundColor: medal } : null]}>
      <Text style={[styles.rankNumber, medal ? styles.rankNumberMedal : null]}>
        {rank ?? "—"}
      </Text>
    </View>
  );
}

function StandingRow({ row, onOpen }: {
  row: PierCastLeaderboardCityReadV4;
  onOpen: () => void;
}) {
  const seasonalBand = row.seasonalOutlook.status === "available"
    ? row.seasonalOutlook.band
    : null;
  const thermalBand = row.thermalMatch.status === "available"
    ? row.thermalMatch.band
    : null;
  const seasonal = row.seasonalOutlook.status === "available"
    ? formatSeasonTrend(row.seasonalOutlook.stage, row.seasonalOutlook.trend)
    : row.targetingEligibility === "restricted"
    ? "Targeting restricted"
    : "Seasonal outlook unavailable";
  const temperature = row.thermalMatch.status === "available"
    ? formatWaterTemperature(row.thermalMatch.temperatureC)
    : "No current temperature";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${row.displayName} conditions`}
      onPress={() => {
        hapticSelection();
        onOpen();
      }}
      style={({ pressed }) => [styles.standingRow, pressed && styles.pressed]}
    >
      <View style={[styles.standingEdge, { backgroundColor: bandTheme(seasonalBand).fill }]} />
      <RankMedallion rank={row.rank} />
      <View style={styles.standingFish}><SpeciesFish speciesId={row.speciesId} compact /></View>
      <View style={styles.standingIdentity}>
        <Text style={styles.standingState}>{PIER_CAST_STATE_LABELS[row.stateCode]?.toUpperCase() ?? row.stateCode}</Text>
        <Text style={styles.standingCity} numberOfLines={2}>{row.displayName}</Text>
        <Text style={styles.standingMeta} numberOfLines={1}>{seasonal}</Text>
        <View style={styles.standingPills}>
          <ConditionPill band={seasonalBand} kind="seasonal" />
          <ConditionPill band={thermalBand} kind="thermal" />
        </View>
      </View>
      <View style={styles.temperatureReadout}>
        <Text style={styles.temperatureValue}>{temperature}</Text>
        <Text style={styles.temperatureLabel}>MODELED</Text>
      </View>
      <Ionicons name="chevron-forward" size={15} color={paper.dashboardMuted} />
    </Pressable>
  );
}

function LeaderSpotlight({ row, onOpen }: {
  row: PierCastLeaderboardCityReadV4;
  onOpen: () => void;
}) {
  const seasonalBand = row.seasonalOutlook.status === "available"
    ? row.seasonalOutlook.band
    : null;
  const thermalBand = row.thermalMatch.status === "available"
    ? row.thermalMatch.band
    : null;
  return (
    <Pressable
      onPress={() => {
        hapticSelection();
        onOpen();
      }}
      style={({ pressed }) => [styles.leaderSpotlight, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Open number one city, ${row.displayName}`}
    >
      <CornerMarkSet color={paper.medalGold} inset={9} />
      <View style={styles.leaderRankWrap}>
        <Text style={styles.leaderRankHash}>#</Text>
        <Text style={styles.leaderRank}>1</Text>
      </View>
      <View style={styles.leaderFishStage}><SpeciesFish speciesId={row.speciesId} /></View>
      <View style={styles.leaderCopy}>
        <Text style={styles.leaderKicker}>BEST COMPARABLE CONDITIONS</Text>
        <Text style={styles.leaderCity}>{row.displayName}</Text>
        <Text style={styles.leaderSpecies}>{PIER_CAST_SPECIES_LABELS[row.speciesId]}</Text>
        <View style={styles.leaderPills}>
          <ConditionPill band={seasonalBand} kind="seasonal" />
          <ConditionPill band={thermalBand} kind="thermal" />
        </View>
      </View>
      <Ionicons name="arrow-forward-circle" size={28} color={paper.dashboardBlue} />
    </Pressable>
  );
}

export function PierCastConditionsLanding({
  catalog,
  leaderboard,
  selectedSpeciesId,
  selectionLoading,
  onSelectSpecies,
  onOpenCity,
  onOpenMap,
}: {
  catalog: PierCastConditionsCatalogResponseV4;
  leaderboard: PierCastLeaderboardResponseV4;
  selectedSpeciesId: PierCastSpeciesId | null;
  selectionLoading: boolean;
  onSelectSpecies: (speciesId: PierCastSpeciesId) => void;
  onOpenCity: (cityId: string) => void;
  onOpenMap: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const ranked = leaderboard.cities.filter((city) => city.rankingDisposition === "ranked");
  const unavailable = leaderboard.cities.filter((city) => city.rankingDisposition !== "ranked");
  const visible = ranked.slice(0, expanded ? ranked.length : 5);
  const finderCities = catalog.cities
    .filter((city) => selectedState === "ALL" || city.stateCode === selectedState)
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
  const states = [...new Set(catalog.cities.map((city) => city.stateCode))].sort();
  const selectedLabel = selectedSpeciesId ? PIER_CAST_SPECIES_LABELS[selectedSpeciesId] : null;

  return (
    <>
      <View style={styles.masthead}>
        <TopographicLines style={StyleSheet.absoluteFill} color="#FFFFFF" count={6} />
        <SectionEyebrow color={paper.dashboardBlueLight}>GREAT LAKES · TARGET CONDITIONS</SectionEyebrow>
        <Text style={styles.mastheadTitle}>THE STANDINGS</Text>
        <Text style={styles.mastheadCopy}>
          {selectedLabel
            ? `${selectedLabel} cities ranked by typical seasonal outlook, then exact temperature match.`
            : "Choose a species before comparing pier cities. There is no universal best pier."}
        </Text>
        <Pressable
          style={({ pressed }) => [styles.mapButton, pressed && styles.pressed]}
          onPress={onOpenMap}
          accessibilityRole="button"
          accessibilityLabel="Open Great Lakes conditions map"
        >
          <Ionicons name="map-outline" size={18} color="#FFFFFF" />
          <Text style={styles.mapButtonText}>OPEN CONDITIONS MAP</Text>
        </Pressable>
      </View>

      <PierCastTargetSelector
        options={leaderboard.targetSpecies}
        selectedSpeciesId={selectedSpeciesId}
        onSelect={onSelectSpecies}
      />

      {selectionLoading ? (
        <View style={styles.infoCard}>
          <Ionicons name="water-outline" size={23} color={paper.dashboardBlue} />
          <Text style={styles.infoTitle}>Building the {selectedLabel ?? "target"} standings…</Text>
          <Text style={styles.infoCopy}>Comparing the same species and conditions across eligible cities.</Text>
        </View>
      ) : !selectedSpeciesId || leaderboard.selectionRequired ? (
        <View style={styles.emptyStandings}>
          <View style={styles.emptyIcon}><Ionicons name="locate-outline" size={27} color={paper.dashboardBlue} /></View>
          <Text style={styles.infoTitle}>Your target sets the leaderboard</Text>
          <Text style={styles.infoCopy}>
            A Chinook leaderboard and a perch leaderboard answer different questions. Pick one above to begin.
          </Text>
        </View>
      ) : ranked.length === 0 ? (
        <View style={styles.infoCard}>
          <Ionicons name="cloud-offline-outline" size={23} color={paper.dashboardBlue} />
          <Text style={styles.infoTitle}>No comparable cities right now</Text>
          <Text style={styles.infoCopy}>
            Missing, stale, or restricted conditions stay unavailable instead of being treated as poor fishing.
          </Text>
        </View>
      ) : (
        <View style={styles.standingsCard}>
          <View style={styles.sectionHead}>
            <View>
              <Text style={styles.sectionEyebrow}>SPECIES-SPECIFIC RANKING</Text>
              <Text style={styles.sectionTitle}>{selectedLabel}</Text>
            </View>
            <Text style={styles.cityCount}>{ranked.length} CITIES</Text>
          </View>
          {ranked[0] ? <LeaderSpotlight row={ranked[0]} onOpen={() => onOpenCity(ranked[0].cityId)} /> : null}
          <View style={styles.rowStack}>
            {visible.slice(1).map((row) => (
              <StandingRow key={row.cityId} row={row} onOpen={() => onOpenCity(row.cityId)} />
            ))}
          </View>
          {ranked.length > 5 ? (
            <Pressable
              style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
              onPress={() => setExpanded((value) => !value)}
            >
              <Text style={styles.outlineButtonText}>{expanded ? "SHOW TOP FIVE" : `SHOW ALL ${ranked.length}`}</Text>
              <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={16} color={paper.dashboardInk} />
            </Pressable>
          ) : null}
          {unavailable.length > 0 ? (
            <Text style={styles.unavailableNote}>
              {unavailable.length} {unavailable.length === 1 ? "city is" : "cities are"} currently unranked due to unavailable or restricted inputs.
            </Text>
          ) : null}
        </View>
      )}

      <View style={styles.finderCard}>
        <CornerMarkSet />
        <SectionEyebrow>FIND YOUR PIER</SectionEyebrow>
        <Text style={styles.finderTitle}>Browse every city</Text>
        {!selectedSpeciesId ? (
          <Text style={styles.finderPrompt}>Choose a target above before opening a conditions report.</Text>
        ) : null}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stateRail}>
          {["ALL", ...states].map((state) => (
            <Pressable
              key={state}
              onPress={() => setSelectedState(state)}
              style={[styles.stateChip, selectedState === state && styles.stateChipSelected]}
            >
              <Text style={[styles.stateChipText, selectedState === state && styles.stateChipTextSelected]}>
                {state === "ALL" ? "ALL" : state}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.finderGrid}>
          {finderCities.map((city) => {
            const row = leaderboard.cities.find((candidate) => candidate.cityId === city.cityId);
            const targetAvailable = Boolean(selectedSpeciesId && row);
            const restricted = row?.targetingEligibility === "restricted";
            return (
              <Pressable
                key={city.cityId}
                disabled={!targetAvailable}
                onPress={() => onOpenCity(city.cityId)}
                accessibilityRole="button"
                accessibilityState={{ disabled: !targetAvailable }}
                accessibilityLabel={`${city.displayName}${!selectedSpeciesId ? ", choose a target first" : !row ? ", selected target not available" : restricted ? ", targeting restricted" : ", open conditions"}`}
                style={({ pressed }) => [styles.finderRow, !targetAvailable && styles.disabled, pressed && targetAvailable && styles.pressed]}
              >
                <View style={styles.finderPin}><Ionicons name="location" size={15} color={paper.dashboardBlue} /></View>
                <View style={styles.finderIdentity}>
                  <Text style={styles.finderCity}>{city.displayName}</Text>
                  <Text style={styles.finderState}>{PIER_CAST_STATE_LABELS[city.stateCode] ?? city.stateCode}</Text>
                </View>
                {restricted ? (
                  <Text style={styles.finderRestricted}>RESTRICTED</Text>
                ) : row?.seasonalOutlook.status === "available" ? (
                  <ConditionPill band={row.seasonalOutlook.band} kind="seasonal" />
                ) : <Text style={styles.finderUnavailable}>{selectedSpeciesId ? "NOT AVAILABLE" : "—"}</Text>}
                <Ionicons name="chevron-forward" size={14} color={paper.dashboardMuted} />
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
}

function OutlookPanel({
  eyebrow,
  icon,
  band,
  kind,
  headline,
  detail,
}: {
  eyebrow: string;
  icon: keyof typeof Ionicons.glyphMap;
  band: ConditionsBand | null;
  kind: "seasonal" | "thermal";
  headline: string;
  detail: string;
}) {
  const theme = bandTheme(band);
  return (
    <View style={[styles.outlookPanel, { borderTopColor: theme.fill }]}>
      <View style={styles.outlookPanelHead}>
        <View style={[styles.outlookIcon, { backgroundColor: theme.wash }]}>
          <Ionicons name={icon} size={17} color={theme.ink} />
        </View>
        <Text style={styles.outlookEyebrow}>{eyebrow}</Text>
      </View>
      <ConditionPill band={band} kind={kind} />
      <Text style={styles.outlookHeadline}>{headline}</Text>
      <Text style={styles.outlookDetail}>{detail}</Text>
    </View>
  );
}

function speciesSummary(species: PierCastSpeciesConditionsReadV4) {
  const seasonalBand = species.seasonalOutlook.status === "available"
    ? species.seasonalOutlook.band
    : null;
  const thermalBand = species.thermalMatch.status === "available"
    ? species.thermalMatch.band
    : null;
  return { seasonalBand, thermalBand };
}

function SpeciesConditionRow({ species, selected, onSelect }: {
  species: PierCastSpeciesConditionsReadV4;
  selected: boolean;
  onSelect: () => void;
}) {
  const { seasonalBand, thermalBand } = speciesSummary(species);
  const unavailable = species.rankingDisposition !== "ranked";
  return (
    <Pressable
      onPress={() => {
        hapticSelection();
        onSelect();
      }}
      style={({ pressed }) => [styles.speciesRow, selected && styles.speciesRowSelected, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <View style={styles.speciesFish}><SpeciesFish speciesId={species.speciesId} compact /></View>
      <View style={styles.speciesIdentity}>
        <Text style={styles.speciesName}>{PIER_CAST_SPECIES_LABELS[species.speciesId]}</Text>
        <Text style={styles.speciesContext} numberOfLines={1}>
          {species.targetingEligibility === "restricted"
            ? "Targeting restricted"
            : species.localFisheryContext?.status === "available"
            ? formatLocalContext(species.localFisheryContext.label)
            : unavailable ? "Conditions incomplete" : "Regional profile"}
        </Text>
      </View>
      <View style={styles.speciesPills}>
        <ConditionPill band={seasonalBand} kind="seasonal" />
        <ConditionPill band={thermalBand} kind="thermal" />
      </View>
      <Ionicons name={selected ? "checkmark-circle" : "chevron-forward"} size={17} color={selected ? paper.dashboardBlue : paper.dashboardMuted} />
    </Pressable>
  );
}

function currentWeather(weather: PierCastHourlyWeatherPoint[]) {
  if (weather.length === 0) return null;
  const now = Date.now();
  return weather.reduce((closest, candidate) => {
    const candidateDelta = Math.abs(new Date(candidate.localTime).getTime() - now);
    const closestDelta = Math.abs(new Date(closest.localTime).getTime() - now);
    return candidateDelta < closestDelta ? candidate : closest;
  });
}

export function PierCastConditionsCityReport({
  city,
  report,
  selectedSpeciesId,
  targetOptions,
  weather,
  weatherLoading,
  savedCopy,
  onSelectSpecies,
}: {
  city: PierCastConditionsCatalogCityV4;
  report: PierCastCityReportReadV4;
  selectedSpeciesId: PierCastSpeciesId;
  targetOptions: PierCastTargetSpeciesOptionV4[];
  weather: PierCastHourlyWeatherPoint[];
  weatherLoading: boolean;
  savedCopy?: boolean;
  onSelectSpecies: (speciesId: PierCastSpeciesId) => void;
}) {
  const selected = report.species.find((species) => species.speciesId === selectedSpeciesId)
    ?? report.species[0]
    ?? null;
  const others = useMemo(
    () => report.species.filter((species) => species.speciesId !== selected?.speciesId),
    [report.species, selected?.speciesId],
  );
  const nearbyWeather = currentWeather(weather);
  if (!selected) return null;
  const { seasonalBand, thermalBand } = speciesSummary(selected);
  const seasonalHeadline = selected.seasonalOutlook.status === "available"
    ? formatSeasonTrend(selected.seasonalOutlook.stage, selected.seasonalOutlook.trend)
    : selected.targetingEligibility === "restricted"
    ? "Targeting restricted"
    : "Outlook unavailable";
  const seasonalDetail = selected.seasonalOutlook.status === "available"
    ? "Typical regional availability for this date."
    : "No usable seasonal profile is available; this is not a poor rating.";
  const thermalHeadline = selected.thermalMatch.status === "available"
    ? formatWaterTemperature(selected.thermalMatch.temperatureC)
    : "Temperature unavailable";
  const thermalDetail = selected.thermalMatch.status === "available"
    ? `${formatDistanceFromOptimum(selected.thermalMatch.distanceFromOptimumC)} · Optimum ${formatOptimumRange(selected.thermalMatch.optimumRangeC)}`
    : "The model input is missing, stale, or outside the supported domain.";

  return (
    <>
      {savedCopy ? (
        <View style={styles.savedBanner}>
          <Ionicons name="archive-outline" size={17} color={paper.dashboardBlue} />
          <Text style={styles.savedBannerText}>Showing your last saved conditions report while a fresh report is unavailable.</Text>
        </View>
      ) : null}
      <View style={styles.reportHero}>
        <TopographicLines style={StyleSheet.absoluteFill} color="#FFFFFF" count={6} />
        <CornerMarkSet color={paper.dashboardBlueLight} inset={11} />
        <View style={styles.reportHeroTop}>
          <View style={styles.reportHeroIdentity}>
            <Text style={styles.reportHeroState}>{PIER_CAST_STATE_LABELS[report.stateCode]?.toUpperCase() ?? report.stateCode}</Text>
            <Text style={styles.reportHeroCity}>{report.displayName}</Text>
          </View>
          <View style={styles.freshnessChip}>
            <View style={styles.liveDot} />
            <Text style={styles.freshnessText}>{formatConditionsFreshness(report.generatedAt)}</Text>
          </View>
        </View>
        <View style={styles.reportTargetHero}>
          <View style={styles.reportFishStage}><SpeciesFish speciesId={selected.speciesId} /></View>
          <View style={styles.reportTargetCopy}>
            <Text style={styles.reportTargetEyebrow}>YOUR TARGET</Text>
            <Text style={styles.reportTargetName}>{PIER_CAST_SPECIES_LABELS[selected.speciesId]}</Text>
            <Text style={styles.reportTargetContext}>
              {selected.localFisheryContext?.status === "available"
                ? formatLocalContext(selected.localFisheryContext.label)
                : "Regional conditions profile"}
            </Text>
          </View>
        </View>
        <View style={styles.outlookGrid}>
          <OutlookPanel
            eyebrow="TYPICAL SEASONAL OUTLOOK"
            icon="calendar-outline"
            band={seasonalBand}
            kind="seasonal"
            headline={seasonalHeadline}
            detail={seasonalDetail}
          />
          <OutlookPanel
            eyebrow="CURRENT TEMPERATURE MATCH"
            icon="thermometer-outline"
            band={thermalBand}
            kind="thermal"
            headline={thermalHeadline}
            detail={thermalDetail}
          />
        </View>
      </View>

      <View style={styles.reportCard}>
        <SectionEyebrow>CHANGE TARGET</SectionEyebrow>
        <Text style={styles.cardTitle}>Compare another species</Text>
        <Text style={styles.cardCopy}>The full city report is already loaded, so switching targets is immediate.</Text>
        <PierCastTargetSelector
          options={targetOptions.filter((option) => report.species.some((row) => row.speciesId === option.speciesId))}
          selectedSpeciesId={selected.speciesId}
          onSelect={onSelectSpecies}
          compact
        />
      </View>

      <View style={styles.reportCard}>
        <View style={styles.sectionHead}>
          <View>
            <Text style={styles.sectionEyebrow}>MODELED NEARSHORE WATER</Text>
            <Text style={styles.sectionTitle}>Five-day temperature guidance</Text>
          </View>
          <View style={styles.modelBadge}><Text style={styles.modelBadgeText}>MODEL</Text></View>
        </View>
        {report.temperatureTimeline.length > 1 ? (
          <PierCastTemperatureChart
            points={report.temperatureTimeline}
            timezone={report.timezone}
          />
        ) : (
          <View style={styles.chartUnavailable}>
            <Ionicons name="cloud-offline-outline" size={20} color={paper.dashboardMuted} />
            <Text style={styles.infoCopy}>Temperature guidance is unavailable.</Text>
          </View>
        )}
        <View style={styles.metricGrid}>
          <View style={styles.metricTile}>
            <Text style={styles.metricLabel}>NEARSHORE WATER</Text>
            <Text style={styles.metricValue}>{formatWaterTemperature(report.currentTemperature?.temperatureC ?? null)}</Text>
            <Text style={styles.metricMeta}>Modeled surface</Text>
          </View>
          <View style={styles.metricTile}>
            <Text style={styles.metricLabel}>NEARBY AIR</Text>
            <Text style={styles.metricValue}>{nearbyWeather?.airTemperatureF !== null && nearbyWeather?.airTemperatureF !== undefined ? `${nearbyWeather.airTemperatureF.toFixed(0)}°F` : weatherLoading ? "…" : "—"}</Text>
            <Text style={styles.metricMeta}>Weather guidance</Text>
          </View>
          <View style={styles.metricTile}>
            <Text style={styles.metricLabel}>WIND</Text>
            <Text style={styles.metricValue}>{nearbyWeather?.windSpeedMph !== null && nearbyWeather?.windSpeedMph !== undefined ? `${nearbyWeather.windSpeedMph.toFixed(0)} mph` : weatherLoading ? "…" : "—"}</Text>
            <Text style={styles.metricMeta}>Near city</Text>
          </View>
        </View>
        <Text style={styles.sourceNote}>
          NOAA {report.source.productId} · cycle issued {new Date(report.source.issuedAt).toLocaleString()} · modeled values, not observed station readings.
        </Text>
      </View>

      <View style={styles.reportCard}>
        <SectionEyebrow>OTHER SPECIES</SectionEyebrow>
        <Text style={styles.cardTitle}>Conditions at {city.displayName}</Text>
        <Text style={styles.cardCopy}>Season and temperature remain separate so one favorable input cannot hide the other.</Text>
        <View style={styles.speciesStack}>
          <SpeciesConditionRow species={selected} selected onSelect={() => onSelectSpecies(selected.speciesId)} />
          {others.map((species) => (
            <SpeciesConditionRow key={species.speciesId} species={species} selected={false} onSelect={() => onSelectSpecies(species.speciesId)} />
          ))}
        </View>
      </View>

      <View style={styles.explanationCard}>
        <CornerMarkSet />
        <SectionEyebrow>HOW TO READ PIERCAST</SectionEyebrow>
        <Text style={styles.cardTitle}>Two truths, kept separate</Text>
        <View style={styles.explanationRow}>
          <View style={styles.explanationNumber}><Text style={styles.explanationNumberText}>1</Text></View>
          <Text style={styles.explanationText}><Text style={styles.explanationStrong}>Typical Seasonal Outlook</Text> describes when the species is usually targetable in this lake region.</Text>
        </View>
        <View style={styles.explanationRow}>
          <View style={styles.explanationNumber}><Text style={styles.explanationNumberText}>2</Text></View>
          <Text style={styles.explanationText}><Text style={styles.explanationStrong}>Current Temperature Match</Text> compares modeled nearshore surface temperature with the species’ thermal profile.</Text>
        </View>
        <View style={styles.explanationRow}>
          <View style={styles.explanationNumber}><Text style={styles.explanationNumberText}>3</Text></View>
          <Text style={styles.explanationText}><Text style={styles.explanationStrong}>Local fishery context</Text> adds explanation only. It never boosts a city’s ranking.</Text>
        </View>
        <Text style={styles.disclosure}>{report.disclosure}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.78, transform: [{ scale: 0.995 }] },
  disabled: { opacity: 0.45 },
  masthead: { overflow: "hidden", backgroundColor: paper.dashboardInk, borderRadius: 12, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 21, borderWidth: 2, borderColor: paper.dashboardInk, ...paperShadows.lift },
  mastheadTitle: { marginTop: 7, color: "#FFFFFF", fontFamily: paperFonts.display, fontSize: 32, lineHeight: 36, textAlign: "center" },
  mastheadCopy: { color: "rgba(255,255,255,0.72)", fontFamily: paperFonts.body, fontSize: 13, lineHeight: 19, textAlign: "center", marginTop: 7 },
  mapButton: { alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 8, marginTop: 17, backgroundColor: paper.dashboardBlue, borderRadius: 7, paddingHorizontal: 16, paddingVertical: 11, borderWidth: 1, borderColor: paper.dashboardBlueLight },
  mapButtonText: { color: "#FFFFFF", fontFamily: paperFonts.bodyBold, fontSize: 11, letterSpacing: 1.1 },
  targetSelector: { backgroundColor: paper.dashboardWhite, borderWidth: 2, borderColor: paper.dashboardInk, borderRadius: 11, padding: 16, marginTop: 18, ...paperShadows.hard },
  targetSelectorCompact: { borderWidth: 0, padding: 0, marginTop: 13, shadowOpacity: 0, elevation: 0 },
  targetSelectorHead: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 14 },
  targetIcon: { width: 37, height: 37, borderRadius: 19, backgroundColor: paper.dashboardBlue, alignItems: "center", justifyContent: "center" },
  targetSelectorTitleWrap: { flex: 1 },
  targetSelectorEyebrow: { color: paper.dashboardBlue, fontFamily: paperFonts.metaMonoBold, fontSize: 9, letterSpacing: 1.3 },
  targetSelectorTitle: { color: paper.dashboardInk, fontFamily: paperFonts.display, fontSize: 21, lineHeight: 25, marginTop: 2 },
  targetGroupLabel: { color: paper.dashboardMuted, fontFamily: paperFonts.metaMonoBold, fontSize: 9, letterSpacing: 1.15, marginTop: 5, marginBottom: 7 },
  targetChipRail: { gap: 9, paddingRight: 12, paddingBottom: 4 },
  targetChip: { minWidth: 157, minHeight: 54, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: paper.dashboardCream, borderWidth: 1.5, borderColor: paper.dashboardLine, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  targetChipSelected: { backgroundColor: paper.dashboardBlue, borderColor: paper.dashboardInk },
  targetChipCopy: { flex: 1 },
  targetChipLabel: { color: paper.dashboardInk, fontFamily: paperFonts.bodyBold, fontSize: 12 },
  targetChipLabelSelected: { color: "#FFFFFF" },
  targetChipMeta: { color: paper.dashboardMuted, fontFamily: paperFonts.metaMono, fontSize: 8, marginTop: 2 },
  targetChipMetaSelected: { color: "rgba(255,255,255,0.74)" },
  fishCompact: { width: 42, height: 28 },
  fishHero: { width: 124, height: 74 },
  selectionCallout: { flexDirection: "row", alignItems: "flex-start", gap: 7, padding: 10, backgroundColor: "#EEF6FA", borderRadius: 7, marginTop: 11 },
  selectionCalloutText: { flex: 1, color: paper.dashboardInkSoft, fontFamily: paperFonts.body, fontSize: 11, lineHeight: 16 },
  infoCard: { alignItems: "center", gap: 7, marginTop: 18, padding: 22, backgroundColor: paper.dashboardWhite, borderWidth: 2, borderColor: paper.dashboardLine, borderRadius: 11 },
  emptyStandings: { alignItems: "center", marginTop: 18, padding: 25, backgroundColor: paper.dashboardCream, borderWidth: 2, borderStyle: "dashed", borderColor: paper.dashboardBlueLight, borderRadius: 11 },
  emptyIcon: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 24, backgroundColor: "#E4F1F8", marginBottom: 8 },
  infoTitle: { color: paper.dashboardInk, fontFamily: paperFonts.display, fontSize: 19, textAlign: "center" },
  infoCopy: { color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 12, lineHeight: 18, textAlign: "center" },
  standingsCard: { marginTop: 18, backgroundColor: paper.dashboardWhite, borderWidth: 2, borderColor: paper.dashboardInk, borderRadius: 11, padding: 14, ...paperShadows.hard },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 13 },
  sectionEyebrow: { color: paper.dashboardBlue, fontFamily: paperFonts.metaMonoBold, fontSize: 9, letterSpacing: 1.2 },
  sectionTitle: { color: paper.dashboardInk, fontFamily: paperFonts.display, fontSize: 22, marginTop: 2 },
  cityCount: { color: paper.dashboardMuted, fontFamily: paperFonts.metaMonoBold, fontSize: 9, letterSpacing: 1, paddingTop: 3 },
  leaderSpotlight: { overflow: "hidden", minHeight: 126, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: "#F8F4E8", borderWidth: 1.5, borderColor: paper.medalGold, borderRadius: 9, padding: 14 },
  leaderRankWrap: { width: 42, flexDirection: "row", alignItems: "flex-start" },
  leaderRankHash: { color: paper.medalGold, fontFamily: paperFonts.display, fontSize: 16, marginTop: 9 },
  leaderRank: { color: paper.dashboardInk, fontFamily: paperFonts.display, fontSize: 43, lineHeight: 48 },
  leaderFishStage: { width: 85, alignItems: "center" },
  leaderCopy: { flex: 1 },
  leaderKicker: { color: paper.goldDk, fontFamily: paperFonts.metaMonoBold, fontSize: 8, letterSpacing: 1 },
  leaderCity: { color: paper.dashboardInk, fontFamily: paperFonts.display, fontSize: 21, lineHeight: 24, marginTop: 2 },
  leaderSpecies: { color: paper.dashboardMuted, fontFamily: paperFonts.bodyMedium, fontSize: 11, marginTop: 2 },
  leaderPills: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 8 },
  conditionPill: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 5, minHeight: 23, paddingHorizontal: 7, borderWidth: 1, borderRadius: 4 },
  conditionDot: { width: 6, height: 6, borderRadius: 3 },
  conditionPillText: { fontFamily: paperFonts.bodyBold, fontSize: 9, letterSpacing: 0.25 },
  rowStack: { marginTop: 9, gap: 7 },
  standingRow: { overflow: "hidden", flexDirection: "row", alignItems: "center", gap: 8, minHeight: 91, backgroundColor: paper.dashboardCream, borderWidth: 1, borderColor: paper.dashboardLine, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 9 },
  standingEdge: { position: "absolute", top: 0, bottom: 0, left: 0, width: 4 },
  rankMedallion: { width: 31, height: 31, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#E3E3DE", marginLeft: 2 },
  rankNumber: { color: paper.dashboardInk, fontFamily: paperFonts.monoBold, fontSize: 12 },
  rankNumberMedal: { color: paper.dashboardInk },
  standingFish: { width: 45, alignItems: "center" },
  standingIdentity: { flex: 1, minWidth: 0 },
  standingState: { color: paper.dashboardBlue, fontFamily: paperFonts.metaMonoBold, fontSize: 7.5, letterSpacing: 0.8 },
  standingCity: { color: paper.dashboardInk, fontFamily: paperFonts.display, fontSize: 17, lineHeight: 20 },
  standingMeta: { color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 9.5, marginTop: 1 },
  standingPills: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 5 },
  temperatureReadout: { alignItems: "flex-end", minWidth: 48 },
  temperatureValue: { color: paper.dashboardInk, fontFamily: paperFonts.monoBold, fontSize: 13 },
  temperatureLabel: { color: paper.dashboardMuted, fontFamily: paperFonts.metaMono, fontSize: 6.5, letterSpacing: 0.6, marginTop: 2 },
  outlineButton: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 7, marginTop: 11, borderWidth: 1.5, borderColor: paper.dashboardInk, borderRadius: 7, paddingVertical: 11 },
  outlineButtonText: { color: paper.dashboardInk, fontFamily: paperFonts.bodyBold, fontSize: 10, letterSpacing: 1 },
  unavailableNote: { color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 10, lineHeight: 15, textAlign: "center", marginTop: 11 },
  finderCard: { overflow: "hidden", marginTop: 18, padding: 18, backgroundColor: paper.dashboardWhite, borderWidth: 2, borderColor: paper.dashboardInk, borderRadius: 11, ...paperShadows.hard },
  finderTitle: { color: paper.dashboardInk, fontFamily: paperFonts.display, fontSize: 23, textAlign: "center", marginTop: 5 },
  finderPrompt: { color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 11, textAlign: "center", marginTop: 5 },
  stateRail: { gap: 7, paddingVertical: 13 },
  stateChip: { borderWidth: 1.5, borderColor: paper.dashboardInk, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: paper.dashboardCream },
  stateChipSelected: { backgroundColor: paper.dashboardInk },
  stateChipText: { color: paper.dashboardInk, fontFamily: paperFonts.metaMonoBold, fontSize: 9 },
  stateChipTextSelected: { color: "#FFFFFF" },
  finderGrid: { borderTopWidth: 1, borderTopColor: paper.dashboardLine },
  finderRow: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 56, borderBottomWidth: 1, borderBottomColor: paper.dashboardLine, paddingVertical: 8 },
  finderPin: { width: 27, height: 27, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#E6F2F8" },
  finderIdentity: { flex: 1, minWidth: 0 },
  finderCity: { color: paper.dashboardInk, fontFamily: paperFonts.bodyBold, fontSize: 12 },
  finderState: { color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 9 },
  finderUnavailable: { color: paper.dashboardMuted, fontFamily: paperFonts.monoBold, fontSize: 13 },
  finderRestricted: { color: paper.bandTough, fontFamily: paperFonts.metaMonoBold, fontSize: 8, letterSpacing: 0.55 },
  savedBanner: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 11, backgroundColor: "#EAF4F9", borderWidth: 1, borderColor: paper.dashboardBlueLight, borderRadius: 8, marginBottom: 12 },
  savedBannerText: { flex: 1, color: paper.dashboardInkSoft, fontFamily: paperFonts.body, fontSize: 11, lineHeight: 16 },
  reportHero: { overflow: "hidden", backgroundColor: paper.dashboardInk, borderWidth: 2, borderColor: paper.dashboardInk, borderRadius: 12, padding: 18, ...paperShadows.lift },
  reportHeroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  reportHeroIdentity: { flex: 1, minWidth: 0 },
  reportHeroState: { color: paper.dashboardBlueLight, fontFamily: paperFonts.metaMonoBold, fontSize: 9, letterSpacing: 1.2 },
  reportHeroCity: { color: "#FFFFFF", fontFamily: paperFonts.display, fontSize: 28, lineHeight: 32, marginTop: 2 },
  freshnessChip: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: paper.bandPrime },
  freshnessText: { color: "rgba(255,255,255,0.78)", fontFamily: paperFonts.metaMono, fontSize: 7.5 },
  reportTargetHero: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.13)" },
  reportFishStage: { width: 128, height: 78, alignItems: "center", justifyContent: "center" },
  reportTargetCopy: { flex: 1 },
  reportTargetEyebrow: { color: paper.dashboardBlueLight, fontFamily: paperFonts.metaMonoBold, fontSize: 8, letterSpacing: 1.2 },
  reportTargetName: { color: "#FFFFFF", fontFamily: paperFonts.display, fontSize: 22, lineHeight: 25, marginTop: 2 },
  reportTargetContext: { color: "rgba(255,255,255,0.65)", fontFamily: paperFonts.body, fontSize: 10, marginTop: 3 },
  outlookGrid: { flexDirection: "row", gap: 9, marginTop: 14 },
  outlookPanel: { flex: 1, minHeight: 165, backgroundColor: "#FFFFFF", borderRadius: 8, borderTopWidth: 5, padding: 11 },
  outlookPanelHead: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 9 },
  outlookIcon: { width: 27, height: 27, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  outlookEyebrow: { flex: 1, color: paper.dashboardMuted, fontFamily: paperFonts.metaMonoBold, fontSize: 7.2, lineHeight: 10, letterSpacing: 0.6 },
  outlookHeadline: { color: paper.dashboardInk, fontFamily: paperFonts.display, fontSize: 16, lineHeight: 19, marginTop: 9 },
  outlookDetail: { color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 9.5, lineHeight: 14, marginTop: 4 },
  reportCard: { marginTop: 18, backgroundColor: paper.dashboardWhite, borderWidth: 2, borderColor: paper.dashboardInk, borderRadius: 11, padding: 16, ...paperShadows.hard },
  cardTitle: { color: paper.dashboardInk, fontFamily: paperFonts.display, fontSize: 22, lineHeight: 26, textAlign: "center", marginTop: 5 },
  cardCopy: { color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 11, lineHeight: 17, textAlign: "center", marginTop: 4 },
  modelBadge: { backgroundColor: paper.dashboardInk, borderRadius: 3, paddingHorizontal: 7, paddingVertical: 4 },
  modelBadgeText: { color: "#FFFFFF", fontFamily: paperFonts.metaMonoBold, fontSize: 8, letterSpacing: 1 },
  chartUnavailable: { minHeight: 100, alignItems: "center", justifyContent: "center", gap: 7 },
  metricGrid: { flexDirection: "row", gap: 7, marginTop: 13 },
  metricTile: { flex: 1, minHeight: 80, backgroundColor: paper.dashboardCream, borderWidth: 1, borderColor: paper.dashboardLine, borderRadius: 7, padding: 9 },
  metricLabel: { color: paper.dashboardBlue, fontFamily: paperFonts.metaMonoBold, fontSize: 7.2, letterSpacing: 0.6 },
  metricValue: { color: paper.dashboardInk, fontFamily: paperFonts.monoBold, fontSize: 16, marginTop: 7 },
  metricMeta: { color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 8.5, marginTop: 2 },
  sourceNote: { color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 9, lineHeight: 14, marginTop: 12 },
  speciesStack: { marginTop: 14, gap: 7 },
  speciesRow: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 70, backgroundColor: paper.dashboardCream, borderWidth: 1, borderColor: paper.dashboardLine, borderRadius: 8, padding: 9 },
  speciesRowSelected: { borderWidth: 2, borderColor: paper.dashboardBlue, backgroundColor: "#EEF6FA" },
  speciesFish: { width: 45, alignItems: "center" },
  speciesIdentity: { flex: 1, minWidth: 72 },
  speciesName: { color: paper.dashboardInk, fontFamily: paperFonts.bodyBold, fontSize: 11 },
  speciesContext: { color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 8.5, marginTop: 2 },
  speciesPills: { alignItems: "flex-end", gap: 4 },
  explanationCard: { overflow: "hidden", marginTop: 18, backgroundColor: "#F7F2E6", borderWidth: 2, borderColor: paper.dashboardInk, borderRadius: 11, padding: 18, ...paperShadows.hard },
  explanationRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginTop: 13 },
  explanationNumber: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: paper.dashboardBlue },
  explanationNumberText: { color: "#FFFFFF", fontFamily: paperFonts.monoBold, fontSize: 10 },
  explanationText: { flex: 1, color: paper.dashboardInkSoft, fontFamily: paperFonts.body, fontSize: 11, lineHeight: 17 },
  explanationStrong: { color: paper.dashboardInk, fontFamily: paperFonts.bodyBold },
  disclosure: { color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 9, lineHeight: 14, marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: paper.dashboardLine },
});
