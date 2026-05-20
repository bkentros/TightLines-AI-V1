/**
 * Personal Bests — FinFindr dashboard language.
 *
 * Visual migration only. Filters, routing into log-detail, and data remain
 * identical to the previous screen (still using mock records).
 */

import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../lib/theme';
import { SMART_LOG_ENABLED } from '../lib/launchLocks';
import {
  MedalBadge,  PaperNavHeader,  type MedalTier,
} from '../components/paper';
import {
  hapticImpact,
  hapticSelection,
  ImpactFeedbackStyle,
} from '../lib/safeHaptics';

interface PBRecord {
  id: string;
  species: string;
  size: string;
  weight: string;
  location: string;
  date: string;
  conditions: string;
  logId: string;
}

const PB_DATA: PBRecord[] = [
  {
    id: 'pb1',
    species: 'Redfish',
    size: '26 in',
    weight: '8.2 lbs',
    location: 'Tampa Bay Inshore',
    date: 'Mar 8, 2026',
    conditions: '72°F · Overcast · SE 8 mph',
    logId: '1',
  },
  {
    id: 'pb2',
    species: 'Largemouth Bass',
    size: '22 in',
    weight: '6.1 lbs',
    location: 'Hillsborough River',
    date: 'Mar 5, 2026',
    conditions: '68°F · Clear · Calm',
    logId: '2',
  },
  {
    id: 'pb3',
    species: 'Spotted Seatrout',
    size: '24 in',
    weight: '5.8 lbs',
    location: 'Homosassa Flats',
    date: 'Mar 1, 2026',
    conditions: '70°F · Clear · NW 5 mph',
    logId: '3',
  },
];

export default function PersonalBestsScreen() {
  if (!SMART_LOG_ENABLED) {
    return <Redirect href="/(tabs)" />;
  }

  return <PersonalBestsContent />;
}

function PersonalBestsContent() {
  const router = useRouter();
  const allSpecies = PB_DATA.map((pb) => pb.species);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);

  const filtered = selectedSpecies
    ? PB_DATA.filter((pb) => pb.species === selectedSpecies)
    : PB_DATA;

  // Mock data today — gesture matches Home/Log: forest-tint spinner +
  // light impact, brief dwell so pull-to-refresh feels acknowledged.
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    hapticImpact(ImpactFeedbackStyle.Light);
    setRefreshing(true);
    await new Promise<void>((r) => setTimeout(r, 600));
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · THE RECORDS"
          eyebrowColor={paper.bandFair}
          title="PERSONAL BESTS"
          onBack={() => router.back()}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={paper.dashboardBlue}
              colors={[paper.dashboardBlue]}
              progressBackgroundColor={paper.dashboardCream}
            />
          }
        >
          <View style={styles.eyebrowRow}><Text style={styles.pageEyebrow}>PERSONAL BESTS</Text></View>

          <Text style={styles.heroTitle}>Personal bests.</Text>
          <Text style={styles.heroLede}>
            Your biggest fish by species — earned, measured, and filed for the
            record.
          </Text>

          {/* Filter pills */}
          <View style={styles.filterRow}>
            <Pressable
              style={[styles.filterPill, !selectedSpecies && styles.filterPillActive]}
              onPress={() => {
                hapticSelection();
                setSelectedSpecies(null);
              }}
            >
            <Text
              style={[
                styles.filterText,
                !selectedSpecies && styles.filterTextActive,
              ]}
            >
              ALL ({PB_DATA.length})
            </Text>
          </Pressable>
          {allSpecies.map((s) => (
            <Pressable
              key={s}
              style={[
                styles.filterPill,
                selectedSpecies === s && styles.filterPillActive,
              ]}
              onPress={() => {
                hapticSelection();
                setSelectedSpecies(s);
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedSpecies === s && styles.filterTextActive,
                ]}
              >
                {s.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* PB Cards
            Each personal best wears a medal badge (gold/silver/bronze for
            the top three records overall when no filter is set; gold for
            the top of a single-species filter). The medal lives in the
            upper-right of the card so the trophy icon + species line stay
            anchored on the left, mirroring the way the Recommender shows
            tiered tackle picks. */}
        {filtered.map((pb, idx) => {
          const isTop = idx === 0 && !selectedSpecies;
          const medal: MedalTier | null = !selectedSpecies
            ? idx === 0
              ? 'gold'
              : idx === 1
                ? 'silver'
                : idx === 2
                  ? 'bronze'
                  : null
            : idx === 0
              ? 'gold'
              : null;
          return (
            <Pressable
              key={pb.id}
              style={({ pressed }) => [
                styles.pbCard,
                isTop && styles.pbCardTop,
                pressed && styles.pbCardPressed,
              ]}
              onPress={() => {
                hapticSelection();
                router.push({
                  pathname: '/log-detail',
                  params: { id: pb.logId },
                });
              }}
            >
              {isTop ? <View style={styles.goldRule} /> : null}
              <View style={styles.pbHeader}>
                <View style={styles.pbHeaderLeft}>
                  {medal ? (
                    <MedalBadge tier={medal} size={26} />
                  ) : (
                    <Ionicons name="trophy" size={14} color={paper.dashboardInk} />
                  )}
                  <Text style={styles.pbSpecies}>{pb.species}</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={paper.dashboardInk} />
              </View>

              <View style={styles.pbStatsRow}>
                <Text style={styles.pbStat}>{pb.size}</Text>
                <View style={styles.pbDot} />
                <Text style={styles.pbStat}>{pb.weight}</Text>
              </View>

              <Text style={styles.pbMeta}>
                {pb.location.toUpperCase()} · {pb.date.toUpperCase()}
              </Text>
              <Text style={styles.pbConditions}>{pb.conditions}</Text>
            </Pressable>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="fish-outline" size={28} color={paper.dashboardInk} />
            <Text style={styles.emptyText}>
              No personal bests yet for this species.
            </Text>
          </View>
        )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.dashboardCream },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.xxl,
  },eyebrowRow: { marginBottom: paperSpacing.md },
pageEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 2,
    color: paper.dashboardBlue,
    fontWeight: '700',
  },
  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 38,
    marginBottom: paperSpacing.xs,
  },
  heroLede: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.dashboardInk,
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: paperSpacing.section,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: paperSpacing.xs + 2,
    marginBottom: paperSpacing.section,
  },
  filterPill: {
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
  },
  filterPillActive: { backgroundColor: paper.dashboardInk },
  filterText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    letterSpacing: 1.8,
  },
  filterTextActive: { color: paper.dashboardCream },

  // Cards
  pbCard: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    padding: paperSpacing.md,
    // Bumped from `sm` to `md` so the stack of personal-best records
    // reads as discrete cards rather than a tightly packed list.
    marginBottom: paperSpacing.md,
      },
  pbCardTop: {
    paddingLeft: paperSpacing.md + 6,
  },
  pbCardPressed: { backgroundColor: '#F6F9FB' },
  goldRule: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: paper.bandFair,
  },
  pbHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: paperSpacing.xs,
  },
  pbHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs + 2,
  },
  pbSpecies: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
  },
  pbStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    marginBottom: paperSpacing.xs - 1,
  },
  pbStat: {
    fontFamily: paperFonts.mono,
    fontSize: 15,
    color: paper.dashboardBlue,
    letterSpacing: 0.3,
  },
  pbDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: paper.dashboardInk,
    opacity: 0.5,
  },
  pbMeta: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.65,
    letterSpacing: 1.4,
    marginBottom: 2,
  },
  pbConditions: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.dashboardInk,
    opacity: 0.65,
  },

  // Empty
  empty: {
    alignItems: 'center',
    paddingTop: paperSpacing.xxl,
    gap: paperSpacing.sm,
  },
  emptyText: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.dashboardInk,
    opacity: 0.7,
  },
});
