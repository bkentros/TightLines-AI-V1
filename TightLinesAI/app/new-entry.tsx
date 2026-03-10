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

const BODY_OPTIONS = [
  'River', 'Lake', 'Pond', 'Surf / Beach',
  'Inshore Flats', 'Offshore', 'Creek', 'Reservoir',
];
const WATER_TYPE_OPTIONS = ['Freshwater', 'Saltwater', 'Brackish'];
const CLARITY_OPTIONS = ['Clear', 'Stained', 'Murky', 'Muddy'];
const WIND_DIR_OPTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const PRESSURE_OPTIONS = ['Rising', 'Stable', 'Falling'];
const CLOUD_OPTIONS = ['Clear', 'Partly Cloudy', 'Mostly Cloudy', 'Overcast'];
const TIDE_OPTIONS = ['Rising', 'High', 'Falling', 'Low'];
const MOON_OPTIONS = [
  'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
  'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
];
const RELEASE_OPTIONS = ['Released', 'Kept'];

export default function NewEntryScreen() {
  const [showConditions, setShowConditions] = useState(false);
  const [catchCount, setCatchCount] = useState(1);

  const [body, setBody] = useState<string | null>(null);
  const [waterType, setWaterType] = useState<string | null>(null);
  const [clarity, setClarity] = useState<string | null>(null);
  const [windDir, setWindDir] = useState<string | null>(null);
  const [pressure, setPressure] = useState<string | null>(null);
  const [cloud, setCloud] = useState<string | null>(null);
  const [tide, setTide] = useState<string | null>(null);
  const [moon, setMoon] = useState<string | null>(null);
  const [release, setRelease] = useState<string | null>('Released');

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
        {/* Voice Log button */}
        <Pressable
          style={({ pressed }) => [styles.voiceBtn, pressed && styles.voiceBtnPressed]}
        >
          <Ionicons name="mic" size={18} color={colors.sage} />
          <Text style={styles.voiceBtnText}>Voice Log</Text>
          <Text style={styles.voiceBtnHint}>Tap to speak your trip details</Text>
        </Pressable>

        {/* ─── Trip Details ─── */}
        <Text style={styles.section}>Trip Details</Text>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Date</Text>
            <TextInput style={styles.input} placeholder="Today" placeholderTextColor={colors.textMuted} />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Duration</Text>
            <TextInput style={styles.input} placeholder="e.g. 4 hrs" placeholderTextColor={colors.textMuted} />
          </View>
        </View>

        {/* Location */}
        <Text style={styles.section}>Location</Text>

        <View style={styles.field}>
          <TextInput style={styles.input} placeholder="e.g. Tampa Bay Inshore" placeholderTextColor={colors.textMuted} />
        </View>

        <Pressable style={({ pressed }) => [styles.syncBtn, pressed && styles.pressed]}>
          <Ionicons name="location" size={16} color={colors.textLight} />
          <Text style={styles.syncText}>Sync Location</Text>
        </Pressable>

        {/* Water */}
        <Text style={styles.section}>Water</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Body of Water</Text>
          <Select value={body} options={BODY_OPTIONS} placeholder="Select" onSelect={setBody} />
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Water Type</Text>
            <Select value={waterType} options={WATER_TYPE_OPTIONS} placeholder="Type" onSelect={setWaterType} />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Clarity</Text>
            <Select value={clarity} options={CLARITY_OPTIONS} placeholder="Clarity" onSelect={setClarity} />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Water Temp (°F)<Text style={styles.opt}> · Optional</Text></Text>
          <TextInput style={styles.input} placeholder="e.g. 72" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
        </View>

        {/* Conditions */}
        <Pressable
          style={styles.condToggle}
          onPress={() => setShowConditions(!showConditions)}
        >
          <Text style={styles.condToggleText}>
            Weather & Conditions
          </Text>
          <Ionicons
            name={showConditions ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.sage}
          />
        </Pressable>

        {showConditions && (
          <View style={styles.condSection}>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Air Temp (°F)</Text>
                <TextInput style={styles.input} placeholder="72" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Wind (mph)</Text>
                <TextInput style={styles.input} placeholder="8" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Wind Dir</Text>
                <Select value={windDir} options={WIND_DIR_OPTIONS} placeholder="Dir" onSelect={setWindDir} />
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
                <Text style={styles.label}>Tide</Text>
                <Select value={tide} options={TIDE_OPTIONS} placeholder="Tide" onSelect={setTide} />
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Moon Phase</Text>
              <Select value={moon} options={MOON_OPTIONS} placeholder="Moon" onSelect={setMoon} />
            </View>
          </View>
        )}

        {/* Catches */}
        <Text style={styles.section}>Catches</Text>

        {Array.from({ length: catchCount }).map((_, i) => (
          <View key={i} style={styles.catchCard}>
            <Text style={styles.catchNum}>Catch {i + 1}</Text>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Species</Text>
                <TextInput style={styles.input} placeholder="e.g. Redfish" placeholderTextColor={colors.textMuted} />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Size</Text>
                <TextInput style={styles.input} placeholder='e.g. 26"' placeholderTextColor={colors.textMuted} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Lure / Fly</Text>
                <TextInput style={styles.input} placeholder="e.g. White Paddle Tail" placeholderTextColor={colors.textMuted} />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Status</Text>
                <Select value={release} options={RELEASE_OPTIONS} placeholder="Status" onSelect={setRelease} />
              </View>
            </View>
          </View>
        ))}

        <Pressable
          style={styles.addCatch}
          onPress={() => setCatchCount(catchCount + 1)}
        >
          <Ionicons name="add-circle-outline" size={18} color={colors.sage} />
          <Text style={styles.addCatchText}>Add Another Catch</Text>
        </Pressable>

        {/* Notes */}
        <Text style={styles.section}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any notes about the trip..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Save */}
        <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}>
          <Text style={styles.saveText}>Save Entry</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl + 20 },
  pressed: { opacity: 0.8 },

  /* Voice button */
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sageLight,
    borderRadius: radius.md,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.sage + '30',
  },
  voiceBtnPressed: { backgroundColor: colors.sage + '20' },
  voiceBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.sage,
  },
  voiceBtnHint: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },

  /* Manual form */
  section: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  field: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '500', color: colors.textSecondary, marginBottom: 6 },
  opt: { fontWeight: '400', fontStyle: 'italic', color: colors.textMuted },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: 15,
    color: colors.text,
  },
  textArea: { minHeight: 72, paddingTop: spacing.sm + 4 },
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  half: { flex: 1 },

  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sage,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.lg,
  },
  syncText: { fontSize: 14, fontWeight: '600', color: colors.textLight },

  condToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  condToggleText: { fontFamily: fonts.serif, fontSize: 15, color: colors.text },
  condSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },

  /* Catches */
  catchCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  catchNum: {
    fontFamily: fonts.serif,
    fontSize: 14,
    color: colors.sage,
    marginBottom: spacing.sm,
  },
  addCatch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  addCatchText: { fontSize: 14, fontWeight: '500', color: colors.sage },

  saveBtn: {
    backgroundColor: colors.sage,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveText: { fontSize: 16, fontWeight: '600', color: colors.textLight },
});
