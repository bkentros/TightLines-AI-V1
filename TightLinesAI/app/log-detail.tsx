import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../lib/theme';

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
  const t = MOCK_TRIP;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.location}>{t.location}</Text>
        <Text style={styles.dateLine}>
          {t.date} · {t.start} – {t.end} ({t.duration})
        </Text>
      </View>

      {/* Conditions */}
      <Text style={styles.section}>Conditions</Text>
      <View style={styles.condGrid}>
        <CondTile icon="thermometer-outline" label="Air" value={t.conditions.temp} />
        <CondTile icon="water-outline" label="Water" value={t.conditions.waterTemp} />
        <CondTile icon="flag-outline" label="Wind" value={t.conditions.wind} />
        <CondTile icon="trending-down" label="Pressure" value={t.conditions.pressure} />
      </View>
      <View style={styles.condRow}>
        <CondPill icon="cloud-outline" text={t.conditions.sky} />
        <CondPill icon="water-outline" text={`Tide: ${t.conditions.tide}`} />
        <CondPill icon="moon-outline" text={t.conditions.moon} />
        <CondPill icon="eye-outline" text={t.conditions.clarity} />
      </View>

      {/* Catches */}
      <View style={styles.catchesHeader}>
        <Text style={styles.section}>
          Catches ({t.catches.length})
        </Text>
      </View>

      {t.catches.map((c, i) => (
        <View key={c.id} style={styles.catchCard}>
          <View style={styles.catchTop}>
            <View style={styles.catchNum}>
              <Text style={styles.catchNumText}>{i + 1}</Text>
            </View>
            <View style={styles.catchInfo}>
              <Text style={styles.catchSpecies}>{c.species}</Text>
              <Text style={styles.catchMeta}>
                {c.size} · {c.status}
              </Text>
            </View>
            <Text style={styles.catchTime}>{c.time}</Text>
          </View>
          <View style={styles.catchLureRow}>
            <Ionicons name="color-wand-outline" size={13} color={colors.textMuted} />
            <Text style={styles.catchLure}>{c.lure}</Text>
          </View>
        </View>
      ))}

      {/* Notes */}
      {t.notes && (
        <>
          <Text style={styles.section}>Notes</Text>
          <View style={styles.notesCard}>
            <Text style={styles.notesText}>{t.notes}</Text>
          </View>
        </>
      )}

      {/* AI Context */}
      {t.fromAI && (
        <View style={styles.aiContext}>
          <View style={styles.aiContextHeader}>
            <Ionicons name="sparkles" size={14} color={colors.sage} />
            <Text style={styles.aiContextTitle}>AI Recommendation Linked</Text>
          </View>
          <Text style={styles.aiContextSub}>
            This trip was logged from an AI recommendation session.
          </Text>
          <View style={styles.feedbackRow}>
            <Text style={styles.feedbackLabel}>
              Did this recommendation help?
            </Text>
            <View style={styles.feedbackBtns}>
              <Pressable style={styles.feedbackBtn} hitSlop={8}>
                <Ionicons name="thumbs-up-outline" size={18} color={colors.sage} />
              </Pressable>
              <Pressable style={styles.feedbackBtn} hitSlop={8}>
                <Ionicons name="thumbs-down-outline" size={18} color={colors.stone} />
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Share */}
      <Pressable style={({ pressed }) => [styles.shareBtn, pressed && { opacity: 0.8 }]}>
        <Ionicons name="share-outline" size={18} color={colors.sage} />
        <Text style={styles.shareBtnText}>Share to Community Feed</Text>
      </Pressable>
    </ScrollView>
  );
}

function CondTile({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.condTile}>
      <Ionicons name={icon as any} size={14} color={colors.stone} />
      <Text style={styles.condTileValue}>{value}</Text>
      <Text style={styles.condTileLabel}>{label}</Text>
    </View>
  );
}

function CondPill({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.condPill}>
      <Ionicons name={icon as any} size={11} color={colors.textSecondary} />
      <Text style={styles.condPillText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },

  /* Header */
  header: { marginBottom: spacing.lg },
  location: { fontFamily: fonts.serif, fontSize: 24, color: colors.text },
  dateLine: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs },

  section: {
    fontFamily: fonts.serif, fontSize: 18, color: colors.text,
    marginBottom: spacing.md, marginTop: spacing.sm,
  },

  /* Conditions */
  condGrid: {
    flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm,
  },
  condTile: {
    flex: 1, alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.sm,
    paddingVertical: spacing.sm + 2, gap: 3,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  condTileValue: { fontSize: 13, fontWeight: '600', color: colors.text, fontVariant: ['tabular-nums'] },
  condTileLabel: { fontSize: 10, color: colors.textMuted },
  condRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: spacing.sm, marginBottom: spacing.lg,
  },
  condPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surface, borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs + 1,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  condPillText: { fontSize: 11, color: colors.textSecondary },

  /* Catches */
  catchesHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  catchCard: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  catchTop: { flexDirection: 'row', alignItems: 'center' },
  catchNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  catchNumText: { fontSize: 12, fontWeight: '700', color: colors.textLight },
  catchInfo: { flex: 1 },
  catchSpecies: { fontFamily: fonts.serif, fontSize: 15, color: colors.text },
  catchMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  catchTime: { fontSize: 12, color: colors.textMuted },
  catchLureRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginTop: spacing.sm, paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider,
  },
  catchLure: { fontSize: 13, color: colors.textSecondary },

  /* Notes */
  notesCard: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  notesText: { fontSize: 14, lineHeight: 21, color: colors.textSecondary, fontStyle: 'italic' },

  /* AI Context */
  aiContext: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.lg,
    borderWidth: 1, borderColor: colors.sageLight,
  },
  aiContextHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  aiContextTitle: { fontFamily: fonts.serif, fontSize: 14, color: colors.sage },
  aiContextSub: { fontSize: 12, color: colors.textSecondary, marginBottom: spacing.md },
  feedbackRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider,
  },
  feedbackLabel: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic' },
  feedbackBtns: { flexDirection: 'row', gap: spacing.lg },
  feedbackBtn: { padding: spacing.xs },

  /* Share */
  shareBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.sageLight,
    borderRadius: radius.md, paddingVertical: spacing.md,
  },
  shareBtnText: { fontSize: 14, fontWeight: '600', color: colors.sage },
});
