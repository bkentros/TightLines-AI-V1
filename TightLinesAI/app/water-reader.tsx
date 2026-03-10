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
const ZONES = [
  {
    id: 1,
    name: 'Deep Pool at River Bend',
    why: 'Classic holding water where the current carves a deep outside bend. Fish stack up here to rest and ambush prey.',
    how: 'Position upstream and drift through the seam where fast water meets slow. Work head to tailout.',
    suggestions: [
      'Woolly Bugger — strip through the deepest section',
      'Pheasant Tail Nymph — dead drift along the seam',
      'White Paddle Tail — slow roll the deeper edges',
    ],
  },
  {
    id: 2,
    name: 'Riffle Run — Current Seam',
    why: 'Active feeding lane where oxygenated water funnels food into a concentrated drift.',
    how: 'Cast upstream into the riffle and drift through the transition zone. Seam between fast and slow water is the strike zone.',
    suggestions: [
      'Elk Hair Caddis — dead drift through the riffle',
      'Gold Spoon — cast across and retrieve through the seam',
      'Ned Rig — hop along the bottom at the tailout',
    ],
  },
  {
    id: 3,
    name: 'Submerged Timber & Grass Line',
    why: 'Structure-rich ambush zone with fallen timber creating current breaks and shade.',
    how: 'Approach quietly from downstream. Precise casts tight to timber, work slowly through structure.',
    suggestions: [
      'Chatterbait — slow roll parallel to the timber',
      'Jerkbait — pause-and-twitch near structure edges',
      'Streamer — swing through pocket water behind logs',
    ],
  },
];

const SUMMARY =
  'This stretch shows classic holding structure with pools, riffles, and timber cover. The bend creates depth variation and current seams that concentrate food and provide ambush points. Focus on transitions between fast and slow water.';

export default function WaterReaderScreen() {
  const [mode, setMode] = useState<'conventional' | 'fly'>('conventional');
  const [expandedZone, setExpandedZone] = useState<number | null>(1);
  const [showManual, setShowManual] = useState(false);

  // Conditions (manual)
  const [windDir, setWindDir] = useState<string | null>(null);
  const [pressure, setPressure] = useState<string | null>(null);
  const [cloud, setCloud] = useState<string | null>(null);
  const [precip, setPrecip] = useState<string | null>(null);
  const [tide, setTide] = useState<string | null>(null);
  const [moon, setMoon] = useState<string | null>(null);

  // Spot
  const [body, setBody] = useState<string | null>(null);
  const [waterType, setWaterType] = useState<string | null>(null);
  const [clarity, setClarity] = useState<string | null>(null);
  const [bottom, setBottom] = useState<string | null>(null);

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
        {/* Upload */}
        <Pressable style={({ pressed }) => [styles.upload, pressed && styles.pressed]}>
          <Ionicons name="camera-outline" size={34} color={colors.sage} />
          <Text style={styles.uploadTitle}>Tap to Upload a Photo</Text>
          <Text style={styles.uploadSub}>
            Photos · Satellite Images · Depth Charts
          </Text>
        </Pressable>

        {/* Mode */}
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
              <View style={styles.half}>
                <Text style={styles.label}>Air Temp (°F)</Text>
                <TextInput style={styles.input} placeholder="72" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Wind Speed (mph)</Text>
                <TextInput style={styles.input} placeholder="8" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Wind Direction</Text>
                <Select value={windDir} options={WIND_DIR_OPTIONS} placeholder="Direction" onSelect={setWindDir} />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Pressure</Text>
                <Select value={pressure} options={PRESSURE_OPTIONS} placeholder="Trend" onSelect={setPressure} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Cloud Cover</Text>
                <Select value={cloud} options={CLOUD_OPTIONS} placeholder="Cover" onSelect={setCloud} />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Precipitation</Text>
                <Select value={precip} options={PRECIP_OPTIONS} placeholder="Precip" onSelect={setPrecip} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Tide Phase</Text>
                <Select value={tide} options={TIDE_OPTIONS} placeholder="Tide" onSelect={setTide} />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Moon Phase</Text>
                <Select value={moon} options={MOON_OPTIONS} placeholder="Moon" onSelect={setMoon} />
              </View>
            </View>
          </View>
        )}

        {/* ─── About This Water ─── */}
        <Text style={styles.section}>About This Water</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Target Species</Text>
          <TextInput style={styles.input} placeholder="e.g. Redfish, Trout" placeholderTextColor={colors.textMuted} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Body of Water</Text>
          <Select value={body} options={BODY_OPTIONS} placeholder="Select body of water" onSelect={setBody} />
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Water Type</Text>
            <Select value={waterType} options={WATER_TYPE_OPTIONS} placeholder="Type" onSelect={setWaterType} />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Water Clarity</Text>
            <Select value={clarity} options={CLARITY_OPTIONS} placeholder="Clarity" onSelect={setClarity} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>
              Bottom / Structure<Text style={styles.opt}> · Optional</Text>
            </Text>
            <Select value={bottom} options={BOTTOM_OPTIONS} placeholder="Bottom" onSelect={setBottom} />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>
              Describe Water<Text style={styles.opt}> · Optional</Text>
            </Text>
            <TextInput
              style={[styles.input, { minHeight: 44 }]}
              placeholder="e.g. Deep bend…"
              placeholderTextColor={colors.textMuted}
              multiline
            />
          </View>
        </View>

        {/* CTA */}
        <Pressable style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
          <Ionicons name="eye-outline" size={18} color={colors.textLight} />
          <Text style={styles.ctaText}>Analyze Water</Text>
        </Pressable>

        {/* ═══ Results ═══ */}
        <View style={styles.results}>
          <View style={styles.resultsDivider}>
            <View style={styles.divLine} />
            <Text style={styles.divLabel}>Results Preview</Text>
            <View style={styles.divLine} />
          </View>

          {/* Overlay placeholder */}
          <View style={styles.overlayArea}>
            <Ionicons name="image-outline" size={44} color={colors.border} />
            <Text style={styles.overlayText}>
              Your uploaded image with AI zone overlays will appear here
            </Text>
            <View style={styles.markers}>
              {[1, 2, 3].map((n) => (
                <View key={n} style={styles.marker}>
                  <Text style={styles.markerText}>{n}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="analytics-outline" size={15} color={colors.sage} />
              <Text style={styles.summaryTitle}>Water Analysis</Text>
            </View>
            <Text style={styles.summaryText}>{SUMMARY}</Text>
          </View>

          {/* Zones */}
          <Text style={styles.zonesTitle}>Target Zones</Text>
          {ZONES.map((z) => (
            <Pressable
              key={z.id}
              style={styles.zoneCard}
              onPress={() => setExpandedZone(expandedZone === z.id ? null : z.id)}
            >
              <View style={styles.zoneHeader}>
                <View style={styles.zoneBadge}>
                  <Text style={styles.zoneBadgeText}>{z.id}</Text>
                </View>
                <Text style={styles.zoneName}>{z.name}</Text>
                <Ionicons
                  name={expandedZone === z.id ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.stone}
                />
              </View>
              <Text style={styles.zoneWhy}>{z.why}</Text>
              {expandedZone === z.id && (
                <View style={styles.zoneExpanded}>
                  <View style={{ marginBottom: spacing.md }}>
                    <Text style={styles.zoneDetailLabel}>How to Fish</Text>
                    <Text style={styles.zoneDetailText}>{z.how}</Text>
                  </View>
                  <Text style={styles.zoneDetailLabel}>
                    {mode === 'fly' ? 'Recommended Flies' : 'Recommended Lures'}
                  </Text>
                  {z.suggestions.map((s, i) => (
                    <View key={i} style={styles.suggRow}>
                      <View style={styles.suggDot} />
                      <Text style={styles.suggText}>{s}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl + 20 },
  pressed: { opacity: 0.8 },

  /* Upload */
  upload: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.xl, marginBottom: spacing.lg,
    borderWidth: 1.5, borderColor: '#6B8F7140', borderStyle: 'dashed',
    minHeight: 150,
  },
  uploadTitle: { fontFamily: fonts.serif, fontSize: 16, color: colors.text, marginTop: spacing.md },
  uploadSub: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },

  /* Toggle */
  toggle: {
    flexDirection: 'row', backgroundColor: colors.divider,
    borderRadius: radius.md, padding: 3, marginBottom: spacing.lg,
  },
  toggleOpt: {
    flex: 1, paddingVertical: spacing.sm + 2, alignItems: 'center',
    borderRadius: radius.md - 2,
  },
  toggleActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  toggleText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  toggleTextActive: { color: colors.text },

  /* Section */
  section: { fontFamily: fonts.serif, fontSize: 18, color: colors.text, marginBottom: spacing.md },

  /* Sync */
  syncBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.sage,
    borderRadius: radius.md, paddingVertical: spacing.md - 2, marginBottom: spacing.sm,
  },
  syncBtnText: { fontSize: 15, fontWeight: '600', color: colors.textLight },
  manualToggle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, marginBottom: spacing.lg,
  },
  manualToggleText: { fontSize: 13, color: colors.sage },

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
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  half: { flex: 1 },

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
  divLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  divLabel: { fontSize: 12, color: colors.textMuted, marginHorizontal: spacing.md, fontStyle: 'italic' },

  overlayArea: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
    minHeight: 200, padding: spacing.lg, marginBottom: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  overlayText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md, lineHeight: 18 },
  markers: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.lg },
  marker: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#6B8F7130', borderWidth: 2,
    borderColor: colors.sage, alignItems: 'center', justifyContent: 'center',
  },
  markerText: { fontSize: 13, fontWeight: '700', color: colors.sage },

  summaryCard: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  summaryTitle: { fontFamily: fonts.serif, fontSize: 15, fontWeight: '700', color: colors.sage },
  summaryText: { fontSize: 13, lineHeight: 20, color: colors.textSecondary, fontStyle: 'italic' },

  zonesTitle: { fontFamily: fonts.serif, fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  zoneCard: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  zoneHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  zoneBadge: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  zoneBadgeText: { fontSize: 12, fontWeight: '700', color: colors.textLight },
  zoneName: { fontFamily: fonts.serif, fontSize: 14, color: colors.text, flex: 1 },
  zoneWhy: { fontSize: 12, lineHeight: 18, color: colors.textSecondary },
  zoneExpanded: {
    marginTop: spacing.md, paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider,
  },
  zoneDetailLabel: {
    fontSize: 13, fontWeight: '700', color: colors.sage,
    letterSpacing: 0.3, marginBottom: spacing.xs,
  },
  zoneDetailText: { fontSize: 13, lineHeight: 19, color: colors.textSecondary },
  suggRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.xs + 2 },
  suggDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.sage, marginTop: 5 },
  suggText: { fontSize: 12, lineHeight: 17, color: colors.textSecondary, flex: 1 },
});
