/**
 * Personal Bests — FinFindr paper language.
 *
 * Visual migration only. Filters, routing into log-detail, and data remain
 * identical to the previous screen (still using mock records).
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../lib/theme';
import {
  MedalBadge,
  PaperBackground,
  PaperColophon,
  PaperNavHeader,
  SectionEyebrow,
  type MedalTier,
} from '../components/paper';
import { hapticSelection } from '../lib/safeHaptics';

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
  const router = useRouter();
  const allSpecies = PB_DATA.map((pb) => pb.species);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);

  const filtered = selectedSpecies
    ? PB_DATA.filter((pb) => pb.species === selectedSpecies)
    : PB_DATA;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PaperBackground style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · THE RECORDS"
          eyebrowColor={paper.gold}
          title="PERSONAL BESTS"
          onBack={() => router.back()}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.eyebrowRow}>
            <SectionEyebrow dashes size={11} color={paper.gold}>
              YOUR HALL OF RECORDS
            </SectionEyebrow>
          </View>

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
                    <Ionicons name="trophy" size={14} color={paper.ink} />
                  )}
                  <Text style={styles.pbSpecies}>{pb.species}</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={paper.ink} />
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
            <Ionicons name="fish-outline" size={28} color={paper.ink} />
            <Text style={styles.emptyText}>
              No personal bests yet for this species.
            </Text>
          </View>
        )}

        <PaperColophon
          section="RECORDS"
          tagline={(edition) => `NO. ${edition} · MEASURED, FILED, REMEMBERED`}
        />
        </ScrollView>
      </PaperBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.paper },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.xxl,
  },

  eyebrowRow: { marginBottom: paperSpacing.md },
  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 38,
    marginBottom: paperSpacing.xs,
  },
  heroLede: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.ink,
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
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paperLight,
    borderWidth: 1.5,
    borderColor: paper.ink,
  },
  filterPillActive: { backgroundColor: paper.ink },
  filterText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    letterSpacing: 1.8,
  },
  filterTextActive: { color: paper.paper },

  // Cards
  pbCard: {
    position: 'relative',
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    padding: paperSpacing.md,
    // Bumped from `sm` to `md` so the stack of personal-best records
    // reads as discrete cards rather than a tightly packed list.
    marginBottom: paperSpacing.md,
    ...paperShadows.hard,
  },
  pbCardTop: {
    paddingLeft: paperSpacing.md + 6,
  },
  pbCardPressed: { backgroundColor: paper.paperDark },
  goldRule: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: paper.gold,
  },
  pbMedal: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 5,
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
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -0.3,
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
    color: paper.forest,
    letterSpacing: 0.3,
  },
  pbDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: paper.ink,
    opacity: 0.5,
  },
  pbMeta: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.65,
    letterSpacing: 1.4,
    marginBottom: 2,
  },
  pbConditions: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.ink,
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
    color: paper.ink,
    opacity: 0.7,
  },
});
