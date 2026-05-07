/**
 * New Entry — FinFindr paper language.
 *
 * Visual migration only. All form fields, catch-count state, conditions toggle,
 * and Select-driven dropdowns remain identical to the pre-migration version.
 * Wiring this form into real persistence is a future pass.
 */

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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Select from '../components/Select';
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../lib/theme';
import {
  PaperBackground,
  PaperNavHeader,
  SectionEyebrow,
} from '../components/paper';
import { hapticImpact, ImpactFeedbackStyle, hapticSelection } from '../lib/safeHaptics';

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
  const router = useRouter();
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PaperBackground style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · NEW ENTRY"
          title="LOG A TRIP"
          onBack={() => router.back()}
        />
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
            <View style={styles.eyebrowRow}>
              <SectionEyebrow dashes size={11} color={paper.red}>
                {`FINFINDR · LOG ${new Date().getFullYear()}`}
              </SectionEyebrow>
            </View>

            <Text style={styles.heroTitle}>Log the trip.</Text>
          <Text style={styles.heroLede}>
            Capture what you caught, where, and under what conditions — the
            field notes that make future reports smarter.
          </Text>

          {/* Voice Log button */}
          <Pressable
            style={({ pressed }) => [
              styles.voiceBtn,
              pressed && styles.voiceBtnPressed,
            ]}
          >
            <Ionicons name="mic" size={16} color={paper.forest} />
            <Text style={styles.voiceBtnText}>VOICE LOG</Text>
            <Text style={styles.voiceBtnHint}>
              Tap to speak your trip details
            </Text>
          </Pressable>

          {/* Trip Details */}
          <Text style={styles.section}>Trip details.</Text>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>DATE</Text>
              <TextInput
                style={styles.input}
                placeholder="Today"
                placeholderTextColor={paper.ink + '70'}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>DURATION</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 4 hrs"
                placeholderTextColor={paper.ink + '70'}
              />
            </View>
          </View>

          {/* Location */}
          <Text style={styles.section}>Location.</Text>
          <View style={styles.field}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Tampa Bay Inshore"
              placeholderTextColor={paper.ink + '70'}
            />
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.syncBtn,
              pressed && styles.syncBtnPressed,
            ]}
          >
            <Ionicons name="location" size={14} color={paper.paper} />
            <Text style={styles.syncText}>SYNC LOCATION</Text>
          </Pressable>

          {/* Water */}
          <Text style={styles.section}>Water.</Text>

          <View style={styles.field}>
            <Text style={styles.label}>BODY OF WATER</Text>
            <Select
              value={body}
              options={BODY_OPTIONS}
              placeholder="Select"
              onSelect={setBody}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>WATER TYPE</Text>
              <Select
                value={waterType}
                options={WATER_TYPE_OPTIONS}
                placeholder="Type"
                onSelect={setWaterType}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>CLARITY</Text>
              <Select
                value={clarity}
                options={CLARITY_OPTIONS}
                placeholder="Clarity"
                onSelect={setClarity}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              WATER TEMP (°F)
              <Text style={styles.opt}> · OPTIONAL</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 72"
              placeholderTextColor={paper.ink + '70'}
              keyboardType="numeric"
            />
          </View>

          {/* Conditions toggle */}
          <Pressable
            style={styles.condToggle}
            onPress={() => {
              hapticSelection();
              setShowConditions(!showConditions);
            }}
          >
            <Text style={styles.condToggleText}>Weather & conditions</Text>
            <Ionicons
              name={showConditions ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={paper.ink}
            />
          </Pressable>

          {showConditions && (
            <View style={styles.condSection}>
              <View style={styles.row}>
                <View style={styles.half}>
                  <Text style={styles.label}>AIR TEMP (°F)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="72"
                    placeholderTextColor={paper.ink + '70'}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.half}>
                  <Text style={styles.label}>WIND (MPH)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="8"
                    placeholderTextColor={paper.ink + '70'}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.half}>
                  <Text style={styles.label}>WIND DIR</Text>
                  <Select
                    value={windDir}
                    options={WIND_DIR_OPTIONS}
                    placeholder="Dir"
                    onSelect={setWindDir}
                  />
                </View>
                <View style={styles.half}>
                  <Text style={styles.label}>PRESSURE</Text>
                  <Select
                    value={pressure}
                    options={PRESSURE_OPTIONS}
                    placeholder="Trend"
                    onSelect={setPressure}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.half}>
                  <Text style={styles.label}>CLOUD COVER</Text>
                  <Select
                    value={cloud}
                    options={CLOUD_OPTIONS}
                    placeholder="Cover"
                    onSelect={setCloud}
                  />
                </View>
                <View style={styles.half}>
                  <Text style={styles.label}>TIDE</Text>
                  <Select
                    value={tide}
                    options={TIDE_OPTIONS}
                    placeholder="Tide"
                    onSelect={setTide}
                  />
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>MOON PHASE</Text>
                <Select
                  value={moon}
                  options={MOON_OPTIONS}
                  placeholder="Moon"
                  onSelect={setMoon}
                />
              </View>
            </View>
          )}

          {/* Catches */}
          <Text style={styles.section}>Catches.</Text>

          {Array.from({ length: catchCount }).map((_, i) => (
            <View key={i} style={styles.catchCard}>
              <Text style={styles.catchNum}>CATCH {i + 1}</Text>
              <View style={styles.row}>
                <View style={styles.half}>
                  <Text style={styles.label}>SPECIES</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Redfish"
                    placeholderTextColor={paper.ink + '70'}
                  />
                </View>
                <View style={styles.half}>
                  <Text style={styles.label}>SIZE</Text>
                  <TextInput
                    style={styles.input}
                    placeholder='e.g. 26"'
                    placeholderTextColor={paper.ink + '70'}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.half}>
                  <Text style={styles.label}>LURE / FLY</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. White Paddle Tail"
                    placeholderTextColor={paper.ink + '70'}
                  />
                </View>
                <View style={styles.half}>
                  <Text style={styles.label}>STATUS</Text>
                  <Select
                    value={release}
                    options={RELEASE_OPTIONS}
                    placeholder="Status"
                    onSelect={setRelease}
                  />
                </View>
              </View>
            </View>
          ))}

          <Pressable
            style={styles.addCatch}
            onPress={() => {
              hapticSelection();
              setCatchCount(catchCount + 1);
            }}
          >
            <Ionicons name="add-circle-outline" size={16} color={paper.forest} />
            <Text style={styles.addCatchText}>ADD ANOTHER CATCH</Text>
          </Pressable>

          {/* Notes */}
          <Text style={styles.section}>Notes.</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any notes about the trip..."
            placeholderTextColor={paper.ink + '70'}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Save */}
          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              pressed && styles.saveBtnPressed,
            ]}
            onPress={() => {
              hapticImpact(ImpactFeedbackStyle.Medium);
            }}
          >
            <Text style={styles.saveText}>SAVE ENTRY</Text>
          </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
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
    paddingBottom: paperSpacing.xxl + 20,
  },

  eyebrowRow: { marginBottom: paperSpacing.md },
  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 30,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 34,
  },
  heroLede: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.ink,
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: paperSpacing.lg,
  },

  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    paddingVertical: paperSpacing.sm + 4,
    paddingHorizontal: paperSpacing.md,
    marginBottom: paperSpacing.lg,
  },
  voiceBtnPressed: { backgroundColor: paper.paperDark },
  voiceBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.forest,
    letterSpacing: 2.4,
  },
  voiceBtnHint: {
    flex: 1,
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.ink,
    opacity: 0.6,
    textAlign: 'right',
  },

  section: {
    fontFamily: paperFonts.display,
    fontSize: 20,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: paperSpacing.sm,
    // Bumped from `sm` to `lg` so each form section opens with a
    // clear, paper-feeling break from the section above.
    marginTop: paperSpacing.lg,
  },

  field: { marginBottom: paperSpacing.md },
  label: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.75,
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  opt: {
    fontFamily: paperFonts.displayItalic,
    fontWeight: '400',
    color: paper.ink,
    opacity: 0.5,
    letterSpacing: 1.2,
  },

  input: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm + 4,
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.ink,
  },
  textArea: { minHeight: 80, paddingTop: paperSpacing.sm + 4 },
  row: {
    flexDirection: 'row',
    gap: paperSpacing.sm,
    marginBottom: paperSpacing.md,
  },
  half: { flex: 1 },

  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.xs + 2,
    backgroundColor: paper.forest,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    paddingVertical: paperSpacing.sm + 2,
    marginBottom: paperSpacing.lg,
    ...paperShadows.hard,
  },
  syncBtnPressed: { backgroundColor: paper.forestDk },
  syncText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.paper,
    letterSpacing: 2.2,
  },

  condToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.md,
    borderWidth: 1.5,
    borderColor: paper.ink,
  },
  condToggleText: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.ink,
    letterSpacing: -0.2,
  },
  condSection: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.lg,
    borderWidth: 1.5,
    borderColor: paper.ink,
  },

  // Catches
  catchCard: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.sm,
    borderWidth: 1.5,
    borderColor: paper.ink,
    ...paperShadows.hard,
  },
  catchNum: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.forest,
    letterSpacing: 2.2,
    marginBottom: paperSpacing.sm,
  },
  addCatch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.xs + 2,
    paddingVertical: paperSpacing.md,
    marginBottom: paperSpacing.md,
  },
  addCatchText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.forest,
    letterSpacing: 2,
  },

  saveBtn: {
    backgroundColor: paper.forest,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    paddingVertical: paperSpacing.md,
    alignItems: 'center',
    marginTop: paperSpacing.sm,
    ...paperShadows.hard,
  },
  saveBtnPressed: { backgroundColor: paper.forestDk },
  saveText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.paper,
    letterSpacing: 2.8,
  },
});
