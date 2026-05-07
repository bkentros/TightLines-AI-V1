/**
 * Log Detail — FinFindr paper language.
 *
 * Visual migration only. Still using mock trip data (no live fetch wiring),
 * but the layout, actions, and share/feedback controls are preserved.
 */

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
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
  PaperBackground,
  PaperColophon,
  PaperNavHeader,
  SectionEyebrow,
} from '../components/paper';
import { hapticSelection } from '../lib/safeHaptics';

const MOCK_TRIP = {
  location: 'Tampa Bay Inshore',
  date: 'Mar 8, 2026',
  start: '7:00 AM',
  end: '11:30 AM',
  duration: '4.5 hrs',
  conditions: {
    temp: '72°F',
    wind: 'SE 8 mph',
    pressure: '29.8 (Falling)',
    sky: 'Overcast',
    tide: 'Falling',
    moon: 'Waxing Crescent',
    waterTemp: '70°F',
    clarity: 'Stained',
  },
  catches: [
    {
      id: '1',
      species: 'Redfish',
      size: '26"',
      lure: 'White Paddle Tail',
      time: '7:15 AM',
      status: 'Released',
    },
    {
      id: '2',
      species: 'Redfish',
      size: '22"',
      lure: 'White Paddle Tail',
      time: '8:30 AM',
      status: 'Released',
    },
    {
      id: '3',
      species: 'Spotted Seatrout',
      size: '19"',
      lure: 'Gold Spoon',
      time: '10:45 AM',
      status: 'Released',
    },
  ],
  notes:
    'Started on the outgoing tide and connected right away. Switched to the gold spoon mid-morning when the bite slowed on paddle tails. Great morning overall.',
  fromAI: true,
};

export default function LogDetailScreen() {
  const router = useRouter();
  const t = MOCK_TRIP;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PaperBackground style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · TRIP RECORD"
          title="LOG DETAIL"
          onBack={() => router.back()}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.eyebrowRow}>
            <SectionEyebrow dashes size={11} color={paper.red}>
              {t.date.toUpperCase()}
            </SectionEyebrow>
          </View>

          <View style={styles.header}>
            <Text style={styles.location}>{t.location}.</Text>
            <Text style={styles.dateLine}>
              {t.start} – {t.end} ({t.duration.toUpperCase()})
            </Text>
          </View>

        {/* Conditions grid */}
        <Text style={styles.section}>Conditions.</Text>
        <View style={styles.condGrid}>
          <CondTile icon="thermometer-outline" label="AIR" value={t.conditions.temp} />
          <CondTile icon="water-outline" label="WATER" value={t.conditions.waterTemp} />
          <CondTile icon="flag-outline" label="WIND" value={t.conditions.wind} />
          <CondTile icon="trending-down" label="PRESSURE" value={t.conditions.pressure} />
        </View>
        <View style={styles.condRow}>
          <CondPill icon="cloud-outline" text={t.conditions.sky} />
          <CondPill icon="water-outline" text={`Tide: ${t.conditions.tide}`} />
          <CondPill icon="moon-outline" text={t.conditions.moon} />
          <CondPill icon="eye-outline" text={t.conditions.clarity} />
        </View>

        {/* Catches */}
        <Text style={styles.section}>
          Catches <Text style={styles.sectionCount}>({t.catches.length})</Text>
        </Text>

        {t.catches.map((c, i) => (
          <View key={c.id} style={styles.catchCard}>
            <View style={styles.catchTop}>
              <View style={styles.catchNum}>
                <Text style={styles.catchNumText}>{i + 1}</Text>
              </View>
              <View style={styles.catchInfo}>
                <Text style={styles.catchSpecies}>{c.species}</Text>
                <Text style={styles.catchMeta}>
                  {c.size} · {c.status.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.catchTime}>{c.time}</Text>
            </View>
            <View style={styles.catchLureRow}>
              <Ionicons name="color-wand-outline" size={12} color={paper.ink} />
              <Text style={styles.catchLure}>{c.lure}</Text>
            </View>
          </View>
        ))}

        {/* Notes */}
        {t.notes ? (
          <>
            <Text style={styles.section}>Notes.</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{t.notes}</Text>
            </View>
          </>
        ) : null}

        {/* AI Context */}
        {t.fromAI ? (
          <View style={styles.aiContext}>
            <View style={styles.aiContextHeader}>
              <Ionicons name="sparkles" size={13} color={paper.gold} />
              <Text style={styles.aiContextTitle}>AI RECOMMENDATION LINKED</Text>
            </View>
            <Text style={styles.aiContextSub}>
              This trip was logged from an AI recommendation session.
            </Text>
            <View style={styles.feedbackRow}>
              <Text style={styles.feedbackLabel}>
                Did this recommendation help?
              </Text>
              <View style={styles.feedbackBtns}>
                <Pressable
                  style={styles.feedbackBtn}
                  hitSlop={8}
                  onPress={() => hapticSelection()}
                >
                  <Ionicons name="thumbs-up-outline" size={18} color={paper.forest} />
                </Pressable>
                <Pressable
                  style={styles.feedbackBtn}
                  hitSlop={8}
                  onPress={() => hapticSelection()}
                >
                  <Ionicons name="thumbs-down-outline" size={18} color={paper.red} />
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}

        {/* Share */}
        <Pressable
          style={({ pressed }) => [styles.shareBtn, pressed && styles.shareBtnPressed]}
          onPress={() => hapticSelection()}
        >
          <Ionicons name="share-outline" size={16} color={paper.ink} />
          <Text style={styles.shareBtnText}>SHARE TO COMMUNITY FEED</Text>
        </Pressable>

        <PaperColophon
          section="LOG"
          tagline={(edition) => `NO. ${edition} · ALL CAUGHT, NEVER LOST`}
        />
        </ScrollView>
      </PaperBackground>
    </SafeAreaView>
  );
}

function CondTile({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.condTile}>
      <Ionicons name={icon as any} size={13} color={paper.ink} />
      <Text style={styles.condTileValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.condTileLabel}>{label}</Text>
    </View>
  );
}

function CondPill({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.condPill}>
      <Ionicons name={icon as any} size={11} color={paper.ink} />
      <Text style={styles.condPillText}>{text}</Text>
    </View>
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

  // Header
  header: { marginBottom: paperSpacing.section },
  location: {
    fontFamily: paperFonts.display,
    fontSize: 30,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 34,
  },
  dateLine: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    opacity: 0.7,
    letterSpacing: 1.6,
    marginTop: paperSpacing.xs,
  },

  section: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: paperSpacing.sm,
    marginTop: paperSpacing.xs,
  },
  sectionCount: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 18,
    color: paper.ink,
    opacity: 0.55,
    fontWeight: '400',
  },

  // Conditions grid
  condGrid: {
    flexDirection: 'row',
    gap: paperSpacing.xs + 2,
    marginBottom: paperSpacing.sm,
  },
  condTile: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    paddingVertical: paperSpacing.sm + 2,
    gap: 3,
  },
  condTileValue: {
    fontFamily: paperFonts.mono,
    fontSize: 12,
    color: paper.ink,
    letterSpacing: 0.2,
  },
  condTileLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.ink,
    opacity: 0.6,
    letterSpacing: 1.8,
  },
  condRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: paperSpacing.xs + 2,
    marginBottom: paperSpacing.section,
  },
  condPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.chip,
    borderWidth: 1.5,
    borderColor: paper.ink,
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: 4,
  },
  condPillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    letterSpacing: 1.2,
  },

  // Catches
  catchCard: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.md,
    ...paperShadows.hard,
  },
  catchTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catchNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: paperSpacing.sm,
  },
  catchNumText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.paper,
    letterSpacing: 0.4,
  },
  catchInfo: { flex: 1 },
  catchSpecies: {
    fontFamily: paperFonts.display,
    fontSize: 16,
    color: paper.ink,
    letterSpacing: -0.3,
  },
  catchMeta: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.6,
    letterSpacing: 1.4,
    marginTop: 2,
  },
  catchTime: {
    fontFamily: paperFonts.mono,
    fontSize: 11,
    color: paper.ink,
    opacity: 0.65,
  },
  catchLureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    marginTop: paperSpacing.sm,
    paddingTop: paperSpacing.sm,
    borderTopWidth: 1,
    borderTopColor: paper.inkHair,
  },
  catchLure: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13,
    color: paper.ink,
    opacity: 0.8,
  },

  // Notes
  notesCard: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.section,
    marginTop: paperSpacing.md,
    ...paperShadows.hard,
  },
  notesText: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    lineHeight: 21,
    color: paper.ink,
    opacity: 0.85,
  },

  // AI Context
  aiContext: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.section,
    ...paperShadows.hard,
  },
  aiContextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs + 2,
    marginBottom: paperSpacing.xs,
  },
  aiContextTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10.5,
    color: paper.goldDk,
    letterSpacing: 2.4,
  },
  aiContextSub: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.ink,
    opacity: 0.7,
    marginBottom: paperSpacing.md,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: paperSpacing.sm,
    borderTopWidth: 1,
    borderTopColor: paper.inkHair,
  },
  feedbackLabel: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.ink,
    opacity: 0.7,
  },
  feedbackBtns: { flexDirection: 'row', gap: paperSpacing.lg },
  feedbackBtn: { padding: paperSpacing.xs },

  // Share
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.paperLight,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    paddingVertical: paperSpacing.md - 2,
    ...paperShadows.hard,
  },
  shareBtnPressed: { backgroundColor: paper.paperDark },
  shareBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    letterSpacing: 2.4,
  },
});
