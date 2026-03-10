import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../lib/theme';

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
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Filter pills */}
      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterPill, !selectedSpecies && styles.filterPillActive]}
          onPress={() => setSelectedSpecies(null)}
        >
          <Text style={[styles.filterText, !selectedSpecies && styles.filterTextActive]}>
            All ({PB_DATA.length})
          </Text>
        </Pressable>
        {allSpecies.map((s) => (
          <Pressable
            key={s}
            style={[
              styles.filterPill,
              selectedSpecies === s && styles.filterPillActive,
            ]}
            onPress={() => setSelectedSpecies(s)}
          >
            <Text
              style={[
                styles.filterText,
                selectedSpecies === s && styles.filterTextActive,
              ]}
            >
              {s}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* PB Cards */}
      {filtered.map((pb, idx) => (
        <Pressable
          key={pb.id}
          style={({ pressed }) => [
            styles.pbCard,
            idx === 0 && styles.pbCardTop,
            pressed && styles.pbCardPressed,
          ]}
          onPress={() =>
            router.push({
              pathname: '/log-detail',
              params: { id: pb.logId },
            })
          }
        >
          <View style={styles.pbHeader}>
            <View style={styles.pbHeaderLeft}>
              <Ionicons
                name="trophy"
                size={16}
                color={idx === 0 && !selectedSpecies ? colors.gold : colors.warmTan}
              />
              <Text style={styles.pbSpecies}>{pb.species}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </View>

          <View style={styles.pbStatsRow}>
            <Text style={styles.pbStat}>{pb.size}</Text>
            <View style={styles.pbDot} />
            <Text style={styles.pbStat}>{pb.weight}</Text>
          </View>

          <Text style={styles.pbMeta}>
            {pb.location} · {pb.date}
          </Text>
          <Text style={styles.pbConditions}>{pb.conditions}</Text>
        </Pressable>
      ))}

      {filtered.length === 0 && (
        <View style={styles.empty}>
          <Ionicons name="fish-outline" size={32} color={colors.textMuted} />
          <Text style={styles.emptyText}>No personal bests yet for this species</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },

  /* Filters */
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  filterText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  filterTextActive: { color: colors.textLight },

  /* Cards */
  pbCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pbCardTop: {
    borderWidth: 1,
    borderColor: colors.gold + '35',
  },
  pbCardPressed: { backgroundColor: colors.surfacePressed },
  pbHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  pbHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pbSpecies: {
    fontFamily: fonts.serif,
    fontSize: 17,
    color: colors.text,
  },
  pbStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  pbStat: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.sage,
    fontVariant: ['tabular-nums'],
  },
  pbDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textMuted,
  },
  pbMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  pbConditions: {
    fontSize: 11,
    color: colors.textMuted,
  },

  /* Empty */
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
