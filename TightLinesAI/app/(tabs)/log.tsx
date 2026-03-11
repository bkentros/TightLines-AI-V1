import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import { useAuthStore } from '../../store/authStore';

/* ─── Mock Data ─── */
const LOG_ENTRIES = [
  {
    id: '1',
    date: 'Mar 8, 2026',
    location: 'Tampa Bay Inshore',
    catches: 3,
    topSpecies: 'Redfish',
    duration: '4.5 hrs',
    fromAI: true,
  },
  {
    id: '2',
    date: 'Mar 5, 2026',
    location: 'Hillsborough River',
    catches: 2,
    topSpecies: 'Largemouth Bass',
    duration: '3 hrs',
    fromAI: false,
  },
  {
    id: '3',
    date: 'Mar 1, 2026',
    location: 'Homosassa Flats',
    catches: 4,
    topSpecies: 'Spotted Seatrout',
    duration: '5 hrs',
    fromAI: true,
  },
];

const PB_PREVIEW = {
  species: 'Redfish',
  size: '26 in',
  weight: '8.2 lbs',
  totalSpecies: 3,
};

type HistoryType = 'all' | 'recommendation' | 'water-reader';
interface HistoryGroup {
  date: string;
  items: {
    id: string;
    type: 'Recommendation' | 'Water Reader';
    target: string;
    location: string;
    summary: string;
  }[];
}

const HISTORY_GROUPS: HistoryGroup[] = [
  {
    date: 'Today',
    items: [
      {
        id: 'h1',
        type: 'Recommendation',
        target: 'Redfish',
        location: 'Tampa Bay Inshore',
        summary: 'Overcast, 72°F, Falling tide',
      },
      {
        id: 'h2',
        type: 'Water Reader',
        target: 'Largemouth Bass',
        location: 'Hillsborough River',
        summary: 'Clear, 68°F, Stable pressure',
      },
    ],
  },
  {
    date: 'Mar 5, 2026',
    items: [
      {
        id: 'h3',
        type: 'Recommendation',
        target: 'Snook',
        location: 'Tampa Bay Inshore',
        summary: 'Partly cloudy, 74°F, Rising tide',
      },
    ],
  },
  {
    date: 'Mar 1, 2026',
    items: [
      {
        id: 'h4',
        type: 'Recommendation',
        target: 'Spotted Seatrout',
        location: 'Homosassa Flats',
        summary: 'Clear, 70°F, Falling tide',
      },
      {
        id: 'h5',
        type: 'Water Reader',
        target: 'Redfish',
        location: 'Crystal River',
        summary: 'Overcast, 69°F, Low tide',
      },
    ],
  },
];

export default function LogScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'log' | 'history'>('log');
  const [historyFilter, setHistoryFilter] = useState<HistoryType>('all');
  const [expandedDate, setExpandedDate] = useState<string | null>('Today');

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/welcome');
          },
        },
      ],
    );
  };

  const filteredGroups = HISTORY_GROUPS.map((g) => ({
    ...g,
    items:
      historyFilter === 'all'
        ? g.items
        : g.items.filter((i) =>
            historyFilter === 'recommendation'
              ? i.type === 'Recommendation'
              : i.type === 'Water Reader',
          ),
  })).filter((g) => g.items.length > 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile */}
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={colors.stone} />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>Angler</Text>
              <View style={styles.tierBadge}>
                <Text style={styles.tierBadgeText}>Free</Text>
              </View>
            </View>
            <Text style={styles.profileSub}>Fly Fishing · Tampa Bay, FL</Text>
          </View>
          <Pressable hitSlop={8} style={styles.exportBtn}>
            <View style={styles.exportIconWrap}>
              <Ionicons name="download-outline" size={18} color={colors.textMuted} />
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={7} color={colors.textLight} />
              </View>
            </View>
          </Pressable>
          <View style={{ width: spacing.md }} />
          <Pressable hitSlop={8} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color={colors.stone} />
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>8</Text>
            <Text style={styles.statLabel}>Species</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>24</Text>
            <Text style={styles.statLabel}>Catches</Text>
          </View>
        </View>

        {/* Personal Bests — compact preview */}
        <Pressable
          style={({ pressed }) => [styles.pbCard, pressed && styles.pbCardPressed]}
          onPress={() => router.push('/personal-bests')}
        >
          <View style={styles.pbHeader}>
            <View style={styles.pbHeaderLeft}>
              <Ionicons name="trophy" size={16} color={colors.gold} />
              <Text style={styles.pbLabel}>Personal Bests</Text>
            </View>
            <View style={styles.pbHeaderRight}>
              <Text style={styles.pbSpeciesCount}>
                {PB_PREVIEW.totalSpecies} species
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </View>
          <View style={styles.pbPreviewRow}>
            <Text style={styles.pbSpecies}>{PB_PREVIEW.species}</Text>
            <View style={styles.pbStatRow}>
              <Text style={styles.pbStat}>{PB_PREVIEW.size}</Text>
              <View style={styles.pbDot} />
              <Text style={styles.pbStat}>{PB_PREVIEW.weight}</Text>
            </View>
          </View>
          <Text style={styles.pbHint}>Tap to view all personal bests by species</Text>
        </Pressable>

        {/* New Entry CTA */}
        <Pressable
          style={({ pressed }) => [styles.newEntryBtn, pressed && styles.pressed]}
          onPress={() => router.push('/new-entry')}
        >
          <Ionicons name="add-circle" size={20} color={colors.textLight} />
          <Text style={styles.newEntryText}>New Entry</Text>
        </Pressable>

        {/* Segmented */}
        <View style={styles.seg}>
          <Pressable
            style={[styles.segOpt, activeTab === 'log' && styles.segActive]}
            onPress={() => setActiveTab('log')}
          >
            <Text style={[styles.segText, activeTab === 'log' && styles.segTextActive]}>
              Catch Log
            </Text>
          </Pressable>
          <Pressable
            style={[styles.segOpt, activeTab === 'history' && styles.segActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.segText, activeTab === 'history' && styles.segTextActive]}>
              AI History
            </Text>
          </Pressable>
        </View>

        {/* ─── Catch Log ─── */}
        {activeTab === 'log' && (
          <View style={styles.entries}>
            {LOG_ENTRIES.map((e) => (
              <Pressable
                key={e.id}
                style={({ pressed }) => [
                  styles.logCard,
                  pressed && styles.logCardPressed,
                ]}
                onPress={() => router.push({ pathname: '/log-detail', params: { id: e.id } })}
              >
                <View style={styles.logTop}>
                  <Text style={styles.logLocation}>{e.location}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </View>
                <Text style={styles.logDate}>{e.date} · {e.duration}</Text>
                <View style={styles.logBottom}>
                  <View style={styles.logStat}>
                    <Ionicons name="fish-outline" size={13} color={colors.sage} />
                    <Text style={styles.logStatText}>
                      {e.catches} {e.catches === 1 ? 'catch' : 'catches'}
                    </Text>
                  </View>
                  <Text style={styles.logSpecies}>{e.topSpecies}</Text>
                  {e.fromAI && (
                    <View style={styles.aiBadge}>
                      <Ionicons name="sparkles" size={9} color={colors.sage} />
                      <Text style={styles.aiBadgeText}>AI</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* ─── AI History ─── */}
        {activeTab === 'history' && (
          <View style={styles.entries}>
            <View style={styles.filterRow}>
              {(['all', 'recommendation', 'water-reader'] as HistoryType[]).map(
                (f) => (
                  <Pressable
                    key={f}
                    style={[
                      styles.filterPill,
                      historyFilter === f && styles.filterPillActive,
                    ]}
                    onPress={() => setHistoryFilter(f)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        historyFilter === f && styles.filterTextActive,
                      ]}
                    >
                      {f === 'all'
                        ? 'All'
                        : f === 'recommendation'
                          ? 'Recommender'
                          : 'Water Reader'}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>

            {filteredGroups.map((group) => (
              <View key={group.date} style={styles.dateGroup}>
                <Pressable
                  style={styles.dateHeader}
                  onPress={() =>
                    setExpandedDate(
                      expandedDate === group.date ? null : group.date,
                    )
                  }
                >
                  <Text style={styles.dateText}>{group.date}</Text>
                  <View style={styles.dateRight}>
                    <Text style={styles.dateCount}>
                      {group.items.length}{' '}
                      {group.items.length === 1 ? 'session' : 'sessions'}
                    </Text>
                    <Ionicons
                      name={
                        expandedDate === group.date
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      size={16}
                      color={colors.textMuted}
                    />
                  </View>
                </Pressable>

                {expandedDate === group.date &&
                  group.items.map((item) => (
                    <View key={item.id} style={styles.historyCard}>
                      <View style={styles.historyTop}>
                        <View style={styles.historyType}>
                          <Ionicons
                            name={
                              item.type === 'Recommendation'
                                ? 'fish-outline'
                                : 'camera-outline'
                            }
                            size={13}
                            color={colors.sage}
                          />
                          <Text style={styles.historyTypeText}>
                            {item.type}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.historyTarget}>
                        {item.target} · {item.location}
                      </Text>
                      <Text style={styles.historySummary}>
                        {item.summary}
                      </Text>
                      <Pressable style={styles.addToLog}>
                        <Ionicons
                          name="add-circle-outline"
                          size={15}
                          color={colors.sage}
                        />
                        <Text style={styles.addToLogText}>Add to Log</Text>
                      </Pressable>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  pressed: { opacity: 0.8 },

  /* Profile */
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.lg,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: { flex: 1, marginLeft: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  profileName: { fontFamily: fonts.serif, fontSize: 20, color: colors.text },
  profileSub: { fontSize: 13, color: colors.textSecondary, marginTop: 1 },

  /* Tier Badge */
  tierBadge: {
    backgroundColor: colors.warmTan + '30',
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: radius.sm,
  },
  tierBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.warmTan,
    letterSpacing: 0.3,
  },

  /* Export Button */
  exportBtn: { opacity: 0.45 },
  exportIconWrap: { position: 'relative' },
  lockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontFamily: fonts.serif, fontSize: 20, color: colors.text },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  statDiv: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: colors.border,
  },

  /* Personal Bests */
  pbCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
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
  pbHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  pbHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  pbLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gold,
    letterSpacing: 0.3,
  },
  pbSpeciesCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
  pbPreviewRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  pbSpecies: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
  },
  pbStatRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pbStat: {
    fontSize: 14,
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
  pbHint: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },

  /* New Entry */
  newEntryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sage,
    borderRadius: radius.md,
    paddingVertical: spacing.md - 2,
    marginBottom: spacing.md,
  },
  newEntryText: { fontSize: 15, fontWeight: '600', color: colors.textLight },

  /* Segmented */
  seg: {
    flexDirection: 'row',
    backgroundColor: colors.divider,
    borderRadius: radius.md,
    padding: 3,
    marginBottom: spacing.md,
  },
  segOpt: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: radius.md - 2,
  },
  segActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  segText: { fontSize: 14, fontWeight: '500', color: colors.textMuted },
  segTextActive: { color: colors.text },

  /* Entries */
  entries: { gap: spacing.sm },

  /* Log Cards */
  logCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  logCardPressed: { backgroundColor: colors.surfacePressed },
  logTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  logLocation: { fontFamily: fonts.serif, fontSize: 15, color: colors.text },
  logDate: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm },
  logBottom: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logStat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  logStatText: { fontSize: 12, fontWeight: '500', color: colors.sage },
  logSpecies: { fontSize: 12, color: colors.textSecondary },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.sageLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.sm,
  },
  aiBadgeText: { fontSize: 10, fontWeight: '600', color: colors.sage },

  /* History Filters */
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
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
  filterText: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
  filterTextActive: { color: colors.textLight },

  /* Date Groups */
  dateGroup: { marginBottom: spacing.sm },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  dateText: {
    fontFamily: fonts.serif,
    fontSize: 14,
    color: colors.text,
  },
  dateRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dateCount: { fontSize: 12, color: colors.textMuted },

  /* History Cards */
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  historyType: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  historyTypeText: { fontSize: 12, fontWeight: '500', color: colors.sage },
  historyTarget: {
    fontFamily: fonts.serif,
    fontSize: 14,
    color: colors.text,
    marginBottom: 3,
  },
  historySummary: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  addToLog: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  addToLogText: { fontSize: 12, fontWeight: '500', color: colors.sage },
});
