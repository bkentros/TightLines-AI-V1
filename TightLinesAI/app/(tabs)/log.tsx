/**
 * My Log — FinFindr paper language.
 *
 * Visual migration only. Entry data and all routing/store actions (sign-out,
 * open log detail, open new-entry, open personal-bests) are identical to
 * the previous version. The catch log + AI history data are still the same
 * mock arrays the old screen used; swapping those for real store data is
 * a future pass.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import { SMART_LOG_ENABLED } from '../../lib/launchLocks';
import { useAuthStore } from '../../store/authStore';
import {
  hapticImpact,
  hapticSelection,
  ImpactFeedbackStyle,
} from '../../lib/safeHaptics';

/* ─── Mock Data (unchanged from pre-migration version) ─── */
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
    type: 'Recommendation' | 'Water Read';
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
        type: 'Water Read',
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
        type: 'Water Read',
        target: 'Redfish',
        location: 'Crystal River',
        summary: 'Overcast, 69°F, Low tide',
      },
    ],
  },
];

function CountUpNumber({
  value,
  style,
}: {
  value: number;
  style?: StyleProp<TextStyle>;
}) {
  const animated = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const listenerId = animated.addListener(({ value: next }) => {
      setDisplayValue(Math.round(next));
    });
    animated.setValue(0);
    Animated.timing(animated, {
      toValue: value,
      duration: 650,
      useNativeDriver: false,
    }).start();
    return () => {
      animated.removeListener(listenerId);
    };
  }, [animated, value]);

  return <Text style={style}>{displayValue}</Text>;
}

export default function LogScreen() {
  if (!SMART_LOG_ENABLED) {
    return <Redirect href="/(tabs)" />;
  }

  return <LogScreenContent />;
}

function LogScreenContent() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'log' | 'history'>('log');
  const [historyFilter, setHistoryFilter] = useState<HistoryType>('all');
  const [expandedDate, setExpandedDate] = useState<string | null>('Today');

  // Re-trigger the count-up animation each time the tab regains focus so
  // the numerals always feel "freshly tallied" when the user navigates back.
  // Bumped via `useFocusEffect`; see `CountUpNumber` below.
  const [countUpKey, setCountUpKey] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setCountUpKey((k) => k + 1);
    }, []),
  );

  // Pull-to-refresh — these screens use mock data today, so the gesture
  // is mostly tactile feedback. We still wire the count-up to re-fire so
  // the numerals briefly tick from 0 → target and the screen feels alive
  // when refreshed.
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    hapticImpact(ImpactFeedbackStyle.Light);
    setRefreshing(true);
    setCountUpKey((k) => k + 1);
    // Brief visible "pulled" state — feels responsive without a real fetch.
    await new Promise<void>((r) => setTimeout(r, 600));
    setRefreshing(false);
  }, []);

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
              : i.type === 'Water Read',
          ),
  })).filter((g) => g.items.length > 0);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={paper.dashboardInk}
              colors={[paper.dashboardInk]}
              progressBackgroundColor={paper.dashboardCream}
            />
          }
        >
          {/* Top eyebrow / page mark */}
          <View style={styles.topBar}>
            <Text style={styles.pageEyebrow}>FINFINDR LOG</Text>
          </View>

          {/* Profile row */}
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={22} color={paper.dashboardInk} />
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>Angler</Text>
                <View style={styles.tierBadge}>
                  <Text style={styles.tierBadgeText}>FREE</Text>
                </View>
              </View>
              <Text style={styles.profileSub}>
                Fly Fishing · Tampa Bay, FL
              </Text>
            </View>
            <Pressable hitSlop={8} style={styles.iconBtn}>
              <Ionicons name="download-outline" size={18} color={paper.dashboardInk} />
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={6} color="#FFFFFF" />
              </View>
            </Pressable>
            <Pressable hitSlop={8} onPress={handleSignOut} style={styles.iconBtn}>
              <Ionicons name="log-out-outline" size={20} color={paper.dashboardInk} />
            </Pressable>
          </View>

          {/* Stats strip — three count-up numerals that animate from 0 to
              target on screen mount and on every focus/refresh. */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <CountUpNumber
                key={`sessions-${countUpKey}`}
                value={12}
                style={styles.statNum}
              />
              <Text style={styles.statLabel}>SESSIONS</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <CountUpNumber
                key={`species-${countUpKey}`}
                value={8}
                style={styles.statNum}
              />
              <Text style={styles.statLabel}>SPECIES</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <CountUpNumber
                key={`catches-${countUpKey}`}
                value={24}
                style={styles.statNum}
              />
              <Text style={styles.statLabel}>CATCHES</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.analyticsCard,
              pressed && styles.analyticsCardPressed,
            ]}
            onPress={() => {
              hapticImpact(ImpactFeedbackStyle.Light);
              router.push('/analytics');
            }}
          >
            <View style={styles.analyticsGoldRule} />
            <View style={styles.analyticsCardInner}>
              <View style={styles.analyticsCardLeft}>
                <Ionicons name="stats-chart" size={14} color={paper.dashboardBlue} />
                <Text style={styles.analyticsCardLabel}>ANALYTICS</Text>
              </View>
              <View style={styles.analyticsCardRight}>
                <Text style={styles.analyticsCardHint}>Totals & rankings</Text>
                <Ionicons name="chevron-forward" size={14} color={paper.dashboardInk} />
              </View>
            </View>
            <Text style={styles.analyticsCardSub}>
              Catch counts, species, tackle, and places from your log.
            </Text>
          </Pressable>

          {/* Personal Bests — editorial preview card */}
          <Pressable
            style={({ pressed }) => [
              styles.pbCard,
              pressed && styles.pbCardPressed,
            ]}
            onPress={() => {
              hapticImpact(ImpactFeedbackStyle.Light);
              router.push('/personal-bests');
            }}
          >
            <View style={styles.pbGoldRule} />
            <View style={styles.pbHeader}>
              <View style={styles.pbHeaderLeft}>
                <Ionicons name="trophy" size={14} color={paper.bandFair} />
                <Text style={styles.pbLabel}>PERSONAL BESTS</Text>
              </View>
              <View style={styles.pbHeaderRight}>
                <Text style={styles.pbSpeciesCount}>
                  {PB_PREVIEW.totalSpecies} SPECIES
                </Text>
                <Ionicons name="chevron-forward" size={14} color={paper.dashboardInk} />
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
            <Text style={styles.pbHint}>
              Tap to view all personal bests by species.
            </Text>
          </Pressable>

          {/* New Entry CTA */}
          <Pressable
            style={({ pressed }) => [
              styles.newEntryBtn,
              pressed && styles.newEntryBtnPressed,
            ]}
            onPress={() => router.push('/new-entry')}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.newEntryText}>NEW ENTRY</Text>
          </Pressable>

          {/* Segmented */}
          <View style={styles.seg}>
            <Pressable
              style={[styles.segOpt, activeTab === 'log' && styles.segActive]}
              onPress={() => setActiveTab('log')}
            >
              <Text
                style={[
                  styles.segText,
                  activeTab === 'log' && styles.segTextActive,
                ]}
              >
                CATCH LOG
              </Text>
            </Pressable>
            <Pressable
              style={[styles.segOpt, activeTab === 'history' && styles.segActive]}
              onPress={() => setActiveTab('history')}
            >
              <Text
                style={[
                  styles.segText,
                  activeTab === 'history' && styles.segTextActive,
                ]}
              >
                AI HISTORY
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
                  onPress={() =>
                    router.push({ pathname: '/log-detail', params: { id: e.id } })
                  }
                >
                  <View style={styles.logTop}>
                    <Text style={styles.logLocation}>{e.location}</Text>
                    <Ionicons name="chevron-forward" size={14} color={paper.dashboardInk} />
                  </View>
                  <Text style={styles.logDate}>
                    {e.date.toUpperCase()} · {e.duration.toUpperCase()}
                  </Text>
                  <View style={styles.logBottom}>
                    <View style={styles.logStat}>
                      <Ionicons name="fish" size={12} color={paper.dashboardBlue} />
                      <Text style={styles.logStatText}>
                        {e.catches} {e.catches === 1 ? 'catch' : 'catches'}
                      </Text>
                    </View>
                    <Text style={styles.logSpecies}>{e.topSpecies}</Text>
                    {e.fromAI && (
                      <View style={styles.aiBadge}>
                        <Ionicons name="sparkles" size={9} color={paper.bandFair} />
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
                          ? 'ALL'
                          : f === 'recommendation'
                            ? 'TACKLE BOX'
                            : 'WATER READ'}
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
                        {group.items.length === 1 ? 'SESSION' : 'SESSIONS'}
                      </Text>
                      <Ionicons
                        name={
                          expandedDate === group.date
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        size={14}
                        color={paper.dashboardInk}
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
                              size={12}
                              color={paper.dashboardBlue}
                            />
                            <Text style={styles.historyTypeText}>
                              {item.type.toUpperCase()}
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
                            size={14}
                            color={paper.dashboardBlue}
                          />
                          <Text style={styles.addToLogText}>ADD TO LOG</Text>
                        </Pressable>
                      </View>
                    ))}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper.dashboardCream },
  safe: { flex: 1 },
  scroll: { flex: 1, backgroundColor: paper.dashboardCream },
  content: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
  },
  lockedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
  },
  lockedIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: paperSpacing.xs,
  },
  lockedTitle: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    color: paper.dashboardInk,
    letterSpacing: 0,
  },
  lockedBody: {
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.dashboardInk,
    opacity: 0.68,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  lockedHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: paper.dashboardInk,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: paperSpacing.md,
  },
  lockedHomeButtonText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 2,
  },

  topBar: {
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.lg,
  },
  pageEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 2,
    color: paper.dashboardBlue,
    fontWeight: '700',
  },

  // Profile row
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: paperSpacing.lg,
    gap: paperSpacing.sm,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
  },
  profileName: {
    fontFamily: paperFonts.display,
    fontSize: 20,
    color: paper.dashboardInk,
    letterSpacing: 0,
  },
  profileSub: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.7,
    marginTop: 2,
  },

  tierBadge: {
    backgroundColor: '#F6F9FB',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
  },
  tierBadgeText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.dashboardInk,
    letterSpacing: 1.6,
  },

  iconBtn: {
    position: 'relative',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 999,
    backgroundColor: paper.dashboardWhite,
  },
  lockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: paper.dashboardInk,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingVertical: paperSpacing.md,
    marginBottom: paperSpacing.lg,
  },
  stat: { flex: 1, alignItems: 'center' },
  statNum: {
    fontFamily: paperFonts.display,
    fontSize: 24,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
  },
  statLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.dashboardInk,
    opacity: 0.7,
    letterSpacing: 2.4,
    marginTop: 2,
  },
  statDiv: {
    width: 1,
    height: 28,
    backgroundColor: paper.dashboardInk,
    opacity: 0.25,
  },

  analyticsCard: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    paddingVertical: paperSpacing.md,
    paddingHorizontal: paperSpacing.md,
    paddingLeft: paperSpacing.md + 6,
    marginBottom: paperSpacing.lg,
  },
  analyticsCardPressed: {
    backgroundColor: '#F6F9FB',
  },
  analyticsGoldRule: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: paper.dashboardBlue,
  },
  analyticsCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: paperSpacing.xs,
  },
  analyticsCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs + 2,
  },
  analyticsCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs + 2,
  },
  analyticsCardLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2.6,
  },
  analyticsCardHint: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.7,
    letterSpacing: 1.4,
  },
  analyticsCardSub: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.dashboardInk,
    opacity: 0.72,
    lineHeight: 17,
  },

  // Personal Bests card
  pbCard: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    paddingVertical: paperSpacing.md,
    paddingHorizontal: paperSpacing.md,
    paddingLeft: paperSpacing.md + 6,
    marginBottom: paperSpacing.section,
  },
  pbCardPressed: { backgroundColor: '#F6F9FB' },
  pbGoldRule: {
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
    marginBottom: paperSpacing.xs + 2,
  },
  pbHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs + 2,
  },
  pbHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs + 2,
  },
  pbLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2.6,
  },
  pbSpeciesCount: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.7,
    letterSpacing: 1.8,
  },
  pbPreviewRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: paperSpacing.md,
    marginBottom: paperSpacing.xs - 1,
  },
  pbSpecies: {
    fontFamily: paperFonts.display,
    fontSize: 20,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
  },
  pbStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
  },
  pbStat: {
    fontFamily: paperFonts.mono,
    fontSize: 14,
    color: paper.dashboardBlue,
    letterSpacing: 0.2,
  },
  pbDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: paper.dashboardInk,
    opacity: 0.5,
  },
  pbHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 11.5,
    color: paper.dashboardInk,
    opacity: 0.65,
  },

  // New Entry
  newEntryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.xs + 2,
    backgroundColor: paper.dashboardInk,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    borderRadius: 12,
    paddingVertical: paperSpacing.md - 2,
    marginBottom: paperSpacing.lg,
  },
  newEntryBtnPressed: { backgroundColor: paper.dashboardBlue },
  newEntryText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 2.8,
  },

  // Segmented
  seg: {
    flexDirection: 'row',
    backgroundColor: '#F6F9FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    padding: 3,
    marginBottom: paperSpacing.lg,
  },
  segOpt: {
    flex: 1,
    paddingVertical: paperSpacing.sm + 2,
    alignItems: 'center',
    borderRadius: 999,
  },
  segActive: { backgroundColor: '#FFFFFF' },
  segText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.dashboardInk,
    opacity: 0.6,
    letterSpacing: 2.4,
  },
  segTextActive: {
    color: paper.dashboardInk,
    opacity: 1,
  },

  // Entries
  entries: { gap: paperSpacing.md },

  // Log cards
  logCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    padding: paperSpacing.md,
  },
  logCardPressed: { backgroundColor: '#F6F9FB' },
  logTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  logLocation: {
    fontFamily: paperFonts.display,
    fontSize: 16,
    color: paper.dashboardInk,
    letterSpacing: 0,
  },
  logDate: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.6,
    letterSpacing: 1.6,
    marginBottom: paperSpacing.sm,
  },
  logBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
  },
  logStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logStatText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.dashboardBlue,
    letterSpacing: 0.5,
  },
  logSpecies: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13,
    color: paper.dashboardInk,
    opacity: 0.75,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
  },
  aiBadgeText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.dashboardBlue,
    letterSpacing: 1.4,
  },

  // History filters
  filterRow: {
    flexDirection: 'row',
    gap: paperSpacing.xs + 2,
    marginBottom: paperSpacing.lg,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  filterPillActive: {
    backgroundColor: paper.dashboardInk,
    borderColor: paper.dashboardInk,
  },
  filterText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    letterSpacing: 1.8,
  },
  filterTextActive: { color: '#FFFFFF' },

  // Date groups
  dateGroup: { marginBottom: paperSpacing.xs },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: paperSpacing.sm,
    paddingHorizontal: paperSpacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: paper.dashboardLine,
  },
  dateText: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.dashboardInk,
    letterSpacing: 0,
  },
  dateRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs + 2,
  },
  dateCount: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.6,
    letterSpacing: 1.6,
  },

  // History cards
  historyCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    padding: paperSpacing.md,
    marginTop: paperSpacing.xs + 2,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyTypeText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.dashboardBlue,
    letterSpacing: 2.2,
  },
  historyTarget: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.dashboardInk,
    letterSpacing: 0,
    marginBottom: 2,
  },
  historySummary: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.7,
    marginBottom: paperSpacing.sm,
  },
  addToLog: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  addToLogText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2,
  },
});
