import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Select from '../components/Select';
import { colors, fonts, spacing, radius } from '../lib/theme';

/* ─── Option lists ─── */
const BODY_OPTIONS = [
  'River', 'Lake', 'Pond', 'Surf / Beach',
  'Inshore Flats', 'Offshore', 'Creek', 'Reservoir',
];
const WATER_TYPE_OPTIONS = ['Freshwater', 'Saltwater', 'Brackish'];
const CLARITY_OPTIONS = ['Clear', 'Stained', 'Murky', 'Muddy'];
const BOTTOM_OPTIONS = ['Grassy', 'Sandy', 'Rocky', 'Muddy', 'Mixed'];
const WIND_DIR_OPTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const PRESSURE_OPTIONS = ['Rising', 'Stable', 'Falling'];
const CLOUD_OPTIONS = ['Clear', 'Partly Cloudy', 'Mostly Cloudy', 'Overcast'];
const PRECIP_OPTIONS = ['None', 'Light Rain', 'Rain', 'Heavy Rain', 'Snow'];
const TIDE_OPTIONS = ['Rising', 'High', 'Falling', 'Low'];
const MOON_OPTIONS = [
  'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
  'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
];

/* ─── Mock results ─── */
const MOCK_CONV = {
  overview:
    'Current conditions favor an aggressive feeding response. With overcast skies and falling barometric pressure, expect gamefish to move shallow and feed actively along structure.',
  recs: [
    {
      name: 'White Chatterbait — 3/8 oz',
      how: 'Slow roll along grass edges with intermittent pauses. Let the blade flutter on the fall.',
      where: 'Target 3–5 ft depths near submerged grass lines and laydowns.',
      why: 'Dropping pressure pushes baitfish tight to cover. Chatterbait mimics a fleeing shad.',
    },
    {
      name: 'Bone Suspending Jerkbait — 4"',
      how: 'Sharp jerk-pause-jerk. Let it suspend 3–4 seconds between twitches.',
      where: 'Points, channel swings, and transitions between flats and drop-offs.',
      why: 'Overcast skies reduce light — fish are more willing to chase a suspended target.',
    },
    {
      name: 'Green Pumpkin Ned Rig — 1/4 oz',
      how: 'Drag and hop slowly along the bottom. Keep constant bottom contact.',
      where: 'Rock transitions, gravel points, hard bottom in 4–8 ft.',
      why: 'Subtle action and natural profile fool pressured fish.',
    },
    {
      name: 'Chartreuse Spinnerbait — 1/2 oz',
      how: 'Slow roll above vegetation. Bump structure and let blades helicopter on the drop.',
      where: 'Grass lines, dock pilings, riprap in 2–6 ft.',
      why: 'Vibration and flash work well in stained water with low visibility.',
    },
    {
      name: 'Watermelon Red Texas Rig — 5" Senko',
      how: 'Pitch to targets, let it fall on slack line. Watch your line on the drop.',
      where: 'Tight to laydowns, docks, and isolated grass clumps.',
      why: 'Natural profile and slow fall trigger bites from fish holding tight to cover.',
    },
  ],
};

const MOCK_FLY = {
  overview:
    'Overcast skies and cooling temps create ideal conditions for a midday hatch. Fish are looking up and actively feeding in slower seams. Focus on presentation over pattern today.',
  recs: [
    {
      name: 'Woolly Bugger — Olive/Black — Sz 8',
      how: 'Strip-and-pause with short, erratic strips. Let marabou pulse between strips.',
      where: 'Deeper pools and runs where riffles dump into slower water.',
      why: 'Stained water calls for movement-based patterns that trigger predatory response.',
    },
    {
      name: 'Pheasant Tail Nymph — Sz 16',
      how: 'Dead drift under indicator through the current seam, 2–4" off bottom.',
      where: 'Heads and tailouts of pools. Seams between fast and slow water.',
      why: 'Year-round staple matching a wide range of mayfly nymphs.',
    },
    {
      name: 'Elk Hair Caddis — Sz 14',
      how: "Dead drift or slight skate. Let it swing at the end of the drift.",
      where: 'Riffles, pocket water, foam lines along banks.',
      why: 'Caddis are active in these temps. Buoyant silhouette visible in broken water.',
    },
    {
      name: 'RS2 Emerger — Sz 20',
      how: 'Fish in the film or just below surface. Long fine tippet, dead drift.',
      where: 'Soft water along banks, eddy lines, tail ends of pools.',
      why: 'Matches BWO emerger profile. Fish sipping in slow water key on this.',
    },
    {
      name: 'Copper John — Sz 16',
      how: 'Euro-nymph or indicator, tight-line through faster runs. Maintain bottom contact.',
      where: 'Riffle pockets, plunge pools, fast water above deeper runs.',
      why: 'Heavy bead sinks fast. Flash and movement trigger opportunistic takes.',
    },
  ],
  hatch: [
    {
      insect: 'Blue-Winged Olive (Baetis)',
      stage: 'Emerger → Dun',
      size: '18–20',
      peak: '1:00 PM – 4:00 PM',
      pattern: 'RS2 Emerger (sz 20) or Sparkle Dun BWO (sz 18)',
      presentation: 'Dead drift in film, slower seams and eddies',
    },
    {
      insect: 'Spotted Sedge (Caddis)',
      stage: 'Adult',
      size: '14–16',
      peak: 'Late afternoon into dusk',
      pattern: 'Elk Hair Caddis (sz 14) or X-Caddis (sz 16)',
      presentation: 'Dead drift to slight skate, riffles and runs',
    },
  ],
};

export default function RecommenderScreen() {
  const [mode, setMode] = useState<'conventional' | 'fly'>('conventional');
  const [showManual, setShowManual] = useState(false);

  // Conditions (manual)
  const [windDir, setWindDir] = useState<string | null>(null);
  const [pressure, setPressure] = useState<string | null>(null);
  const [cloud, setCloud] = useState<string | null>(null);
  const [precip, setPrecip] = useState<string | null>(null);
  const [tide, setTide] = useState<string | null>(null);
  const [moon, setMoon] = useState<string | null>(null);

  // Your Spot
  const [body, setBody] = useState<string | null>(null);
  const [waterType, setWaterType] = useState<string | null>(null);
  const [clarity, setClarity] = useState<string | null>(null);
  const [bottom, setBottom] = useState<string | null>(null);

  const data = mode === 'conventional' ? MOCK_CONV : MOCK_FLY;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Mode Toggle */}
        <View style={styles.toggle}>
          <Pressable
            style={[styles.toggleOpt, mode === 'conventional' && styles.toggleActive]}
            onPress={() => setMode('conventional')}
          >
            <Text style={[styles.toggleText, mode === 'conventional' && styles.toggleTextActive]}>
              Conventional
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleOpt, mode === 'fly' && styles.toggleActive]}
            onPress={() => setMode('fly')}
          >
            <Text style={[styles.toggleText, mode === 'fly' && styles.toggleTextActive]}>
              Fly Fishing
            </Text>
          </Pressable>
        </View>

        {/* ─── Location & Conditions ─── */}
        <Text style={styles.section}>Location & Conditions</Text>

        <Pressable style={({ pressed }) => [styles.syncBtn, pressed && styles.pressed]}>
          <Ionicons name="location" size={18} color={colors.textLight} />
          <Text style={styles.syncBtnText}>Sync My Location</Text>
        </Pressable>

        <Pressable
          style={styles.manualToggle}
          onPress={() => setShowManual(!showManual)}
        >
          <Text style={styles.manualToggleText}>
            {showManual ? 'Hide manual entry' : "Can't sync? Enter manually"}
          </Text>
          <Ionicons
            name={showManual ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.sage}
          />
        </Pressable>

        {showManual && (
          <View style={styles.manualSection}>
            <View style={styles.field}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Tampa Bay, FL"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Air Temp (°F)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="72"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Wind Speed (mph)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="8"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Wind Direction</Text>
                <Select
                  value={windDir}
                  options={WIND_DIR_OPTIONS}
                  placeholder="Direction"
                  onSelect={setWindDir}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Pressure</Text>
                <Select
                  value={pressure}
                  options={PRESSURE_OPTIONS}
                  placeholder="Trend"
                  onSelect={setPressure}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Cloud Cover</Text>
                <Select
                  value={cloud}
                  options={CLOUD_OPTIONS}
                  placeholder="Cover"
                  onSelect={setCloud}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Precipitation</Text>
                <Select
                  value={precip}
                  options={PRECIP_OPTIONS}
                  placeholder="Precip"
                  onSelect={setPrecip}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Tide Phase</Text>
                <Select
                  value={tide}
                  options={TIDE_OPTIONS}
                  placeholder="Tide"
                  onSelect={setTide}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Moon Phase</Text>
                <Select
                  value={moon}
                  options={MOON_OPTIONS}
                  placeholder="Moon"
                  onSelect={setMoon}
                />
              </View>
            </View>
          </View>
        )}

        {/* ─── Your Spot ─── */}
        <Text style={styles.section}>Your Spot</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Target Species</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Redfish, Largemouth Bass, Trout"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Body of Water</Text>
          <Select value={body} options={BODY_OPTIONS} placeholder="Select body of water" onSelect={setBody} />
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Water Type</Text>
            <Select value={waterType} options={WATER_TYPE_OPTIONS} placeholder="Type" onSelect={setWaterType} />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Water Clarity</Text>
            <Select value={clarity} options={CLARITY_OPTIONS} placeholder="Clarity" onSelect={setClarity} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>
              Bottom / Structure
              <Text style={styles.opt}> · Optional</Text>
            </Text>
            <Select value={bottom} options={BOTTOM_OPTIONS} placeholder="Bottom" onSelect={setBottom} />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>
              Water Temp (°F)
              <Text style={styles.opt}> · Optional</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 72"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Describe Your Spot
            <Text style={styles.opt}> · Optional</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g. Deep bend with fallen timber and a grass line on the far bank"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* CTA */}
        <Pressable style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
          <Ionicons name="sparkles" size={18} color={colors.textLight} />
          <Text style={styles.ctaText}>Get Recommendations</Text>
        </Pressable>

        {/* ═══ Results Preview ═══ */}
        <View style={styles.results}>
          <View style={styles.resultsDivider}>
            <View style={styles.resultsDividerLine} />
            <Text style={styles.resultsDividerLabel}>Results Preview</Text>
            <View style={styles.resultsDividerLine} />
          </View>

          {/* Overview */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Ionicons name="analytics-outline" size={15} color={colors.sage} />
              <Text style={styles.overviewTitle}>Situational Assessment</Text>
            </View>
            <Text style={styles.overviewText}>{data.overview}</Text>
          </View>

          {/* Recs */}
          {data.recs.map((r, i) => (
            <View key={i} style={styles.recCard}>
              <View style={styles.recHeader}>
                <View style={styles.recNum}>
                  <Text style={styles.recNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.recName}>{r.name}</Text>
              </View>
              <Detail label="How to Fish" text={r.how} />
              <Detail label="Where to Fish" text={r.where} />
              <Detail label="Why It Works" text={r.why} last />
            </View>
          ))}

          {/* Hatch Panel — Fly only */}
          {mode === 'fly' && (
            <View style={styles.hatchPanel}>
              <View style={styles.hatchHeader}>
                <Text style={styles.hatchTitle}>What's Hatching Now</Text>
                <View style={styles.masterBadge}>
                  <Ionicons name="diamond" size={10} color="#C7956D" />
                  <Text style={styles.masterText}>Master Angler</Text>
                </View>
              </View>
              {(data as typeof MOCK_FLY).hatch.map((h, i) => (
                <View key={i} style={styles.hatchCard}>
                  <Text style={styles.hatchInsect}>{h.insect}</Text>
                  <View style={styles.hatchMeta}>
                    <View style={styles.hatchBadge}>
                      <Text style={styles.hatchBadgeText}>{h.stage}</Text>
                    </View>
                    <Text style={styles.hatchSize}>Size {h.size}</Text>
                  </View>
                  <HatchRow icon="time-outline" text={`Peak: ${h.peak}`} />
                  <HatchRow icon="color-wand-outline" text={h.pattern} />
                  <HatchRow icon="water-outline" text={h.presentation} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ─── Tiny sub-components ─── */
function Detail({ label, text, last }: { label: string; text: string; last?: boolean }) {
  return (
    <View style={last ? undefined : { marginBottom: spacing.sm }}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
}

function HatchRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.hatchRow}>
      <Ionicons name={icon as any} size={13} color={colors.textMuted} />
      <Text style={styles.hatchRowText}>{text}</Text>
    </View>
  );
}

/* ─── Styles ─── */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl + 20 },
  pressed: { opacity: 0.8 },

  /* Toggle */
  toggle: {
    flexDirection: 'row', backgroundColor: colors.divider,
    borderRadius: radius.md, padding: 3, marginBottom: spacing.lg,
  },
  toggleOpt: {
    flex: 1, paddingVertical: spacing.sm + 2,
    alignItems: 'center', borderRadius: radius.md - 2,
  },
  toggleActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  toggleText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  toggleTextActive: { color: colors.text },

  /* Section headers */
  section: {
    fontFamily: fonts.serif, fontSize: 18, color: colors.text,
    marginBottom: spacing.md,
  },

  /* Sync */
  syncBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.sage,
    borderRadius: radius.md, paddingVertical: spacing.md - 2,
    marginBottom: spacing.sm,
  },
  syncBtnText: { fontSize: 15, fontWeight: '600', color: colors.textLight },
  manualToggle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, marginBottom: spacing.lg,
  },
  manualToggleText: { fontSize: 13, color: colors.sage },

  /* Manual section */
  manualSection: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },

  /* Fields */
  field: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '500', color: colors.textSecondary, marginBottom: 6 },
  opt: { fontWeight: '400', fontStyle: 'italic', color: colors.textMuted },
  input: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4,
    fontSize: 15, color: colors.text,
  },
  textArea: { minHeight: 64, paddingTop: spacing.sm + 4 },
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  halfField: { flex: 1 },

  /* CTA */
  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.sage,
    borderRadius: radius.md, paddingVertical: spacing.md, marginTop: spacing.sm,
  },
  ctaText: { fontSize: 16, fontWeight: '600', color: colors.textLight },

  /* Results */
  results: { marginTop: spacing.xl },
  resultsDivider: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  resultsDividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  resultsDividerLabel: {
    fontSize: 12, color: colors.textMuted, marginHorizontal: spacing.md, fontStyle: 'italic',
  },

  /* Overview */
  overviewCard: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  overviewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  overviewTitle: { fontFamily: fonts.serif, fontSize: 15, fontWeight: '700', color: colors.sage },
  overviewText: { fontSize: 13, lineHeight: 20, color: colors.textSecondary, fontStyle: 'italic' },

  /* Rec cards */
  recCard: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  recHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  recNum: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  recNumText: { fontSize: 13, fontWeight: '700', color: colors.textLight },
  recName: { fontFamily: fonts.serif, fontSize: 15, color: colors.text, flex: 1 },
  detailLabel: {
    fontSize: 13, fontWeight: '700', color: colors.sage,
    letterSpacing: 0.3, marginBottom: 3,
  },
  detailText: { fontSize: 13, lineHeight: 19, color: colors.textSecondary },

  /* Hatch */
  hatchPanel: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginTop: spacing.sm,
    borderWidth: 1, borderColor: '#C7956D40',
  },
  hatchHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.md,
  },
  hatchTitle: { fontFamily: fonts.serif, fontSize: 16, color: colors.text },
  masterBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#C7956D18', paddingHorizontal: spacing.sm,
    paddingVertical: 3, borderRadius: radius.sm,
  },
  masterText: { fontSize: 10, fontWeight: '600', color: '#C7956D', letterSpacing: 0.3 },
  hatchCard: {
    backgroundColor: colors.background, borderRadius: radius.sm,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  hatchInsect: { fontFamily: fonts.serif, fontSize: 14, color: colors.text, marginBottom: spacing.xs },
  hatchMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  hatchBadge: {
    backgroundColor: colors.sageLight, paddingHorizontal: spacing.sm,
    paddingVertical: 2, borderRadius: radius.sm,
  },
  hatchBadgeText: { fontSize: 11, fontWeight: '500', color: colors.sage },
  hatchSize: { fontSize: 12, color: colors.textMuted },
  hatchRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.xs + 2 },
  hatchRowText: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, flex: 1 },
});
