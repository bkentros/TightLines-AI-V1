import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import { useAuthStore } from '../../store/authStore';
import { useDevTestingStore, LOCATION_PRESETS } from '../../store/devTestingStore';
import type { FishingMode, UserProfile } from '../../lib/types';
import { supabase } from '../../lib/supabase';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

const SPECIES_LIST = [
  'Bass',
  'Trout',
  'Salmon',
  'Redfish (Red Drum)',
  'Snook',
  'Tarpon',
  'Walleye',
  'Pike / Muskie',
  'Tuna',
  'Mahi-Mahi',
];

const FISHING_MODES: { value: FishingMode; label: string; icon: string }[] = [
  { value: 'conventional', label: 'Conventional', icon: 'fish-outline' },
  { value: 'fly', label: 'Fly Fishing', icon: 'leaf-outline' },
  { value: 'both', label: 'Both', icon: 'options-outline' },
];

const STATE_NAME_TO_ABBR: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA',
  Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS',
  Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK',
  Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT',
  Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV', Wisconsin: 'WI',
  Wyoming: 'WY',
};

export default function SettingsScreen() {
  const { profile, user, setProfile, signOut } = useAuthStore();
  const {
    ignoreGps,
    overrideLocation,
    load: loadDevTesting,
    setIgnoreGps,
    setOverrideLocation,
    clearOverride,
  } = useDevTestingStore();

  const [displayName, setDisplayName] = useState('');
  const [fishingMode, setFishingMode] = useState<FishingMode>('both');
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [homeState, setHomeState] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [showStateList, setShowStateList] = useState(false);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [locationLoading, setLocationLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');
  const [customLabel, setCustomLabel] = useState('');

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name ?? '');
    setFishingMode(profile.fishing_mode ?? 'both');
    setSelectedSpecies(profile.target_species ?? []);
    setHomeState(profile.home_state ?? '');
    setHomeCity(profile.home_city ?? '');
    setUnits((profile.preferred_units ?? 'imperial') as 'imperial' | 'metric');
  }, [profile?.id]);

  useEffect(() => {
    if (__DEV__) loadDevTesting();
  }, [loadDevTesting]);

  const toggleSpecies = (species: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(species)
        ? prev.filter((s) => s !== species)
        : [...prev, species],
    );
  };

  const buildHomeRegion = () => {
    if (homeCity.trim() && homeState) return `${homeCity.trim()}, ${homeState}`;
    if (homeState) return homeState;
    return '';
  };

  const autoFillLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location permission needed',
          'Allow location access to auto-fill your home region, or enter it manually below.',
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geo) {
        const stateAbbr = STATE_NAME_TO_ABBR[geo.region ?? ''] ?? geo.region;
        if (stateAbbr && US_STATES.includes(stateAbbr)) setHomeState(stateAbbr);
        if (geo.city) setHomeCity(geo.city);
      }
    } catch {
      Alert.alert('Could not get location', 'Please enter your home region manually.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updates = {
        display_name: displayName.trim() || null,
        fishing_mode: fishingMode,
        target_species: selectedSpecies,
        home_region: buildHomeRegion() || null,
        home_state: homeState || null,
        home_city: homeCity.trim() || null,
        preferred_units: units,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as UserProfile);
      Alert.alert('Saved', 'Your preferences have been updated.');
    } catch (err) {
      console.error(err);
      Alert.alert('Could not save', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
      ],
    );
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.sage} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Edit your preferences. These personalize your AI recommendations.
          </Text>

          {/* Username (read-only) */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Username</Text>
            <Text style={styles.readOnlyValue}>@{profile.username}</Text>
            <Text style={styles.sectionHint}>Public — visible on your profile and catch feed. Cannot be changed here.</Text>
          </View>

          {/* Display Name */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="e.g. Brandon K."
              placeholderTextColor={colors.textMuted}
              autoCorrect={false}
              maxLength={50}
            />
          </View>

          {/* Fishing Mode */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Fishing Mode</Text>
            <View style={styles.modeRow}>
              {FISHING_MODES.map((mode) => (
                <Pressable
                  key={mode.value}
                  style={[styles.modeBtn, fishingMode === mode.value && styles.modeBtnActive]}
                  onPress={() => setFishingMode(mode.value)}
                >
                  <Ionicons
                    name={mode.icon as any}
                    size={16}
                    color={fishingMode === mode.value ? colors.textLight : colors.textSecondary}
                  />
                  <Text style={[styles.modeBtnText, fishingMode === mode.value && styles.modeBtnTextActive]}>
                    {mode.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Target Species */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Favorite Target Species</Text>
            <View style={styles.chipGrid}>
              {SPECIES_LIST.map((species) => {
                const active = selectedSpecies.includes(species);
                return (
                  <Pressable
                    key={species}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleSpecies(species)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{species}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Home Region */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <Text style={styles.sectionLabel}>Home Region</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.locationAutoBtn,
                  pressed && styles.locationAutoBtnPressed,
                  locationLoading && styles.btnDisabled,
                ]}
                onPress={autoFillLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator size="small" color={colors.sage} />
                ) : (
                  <Ionicons name="location-outline" size={14} color={colors.sage} />
                )}
                <Text style={styles.locationAutoBtnText}>
                  {locationLoading ? 'Detecting…' : 'Use My Location'}
                </Text>
              </Pressable>
            </View>
            <Pressable style={styles.statePicker} onPress={() => setShowStateList((v) => !v)}>
              <Text style={[styles.statePickerText, !homeState && styles.statePickerPlaceholder]}>
                {homeState || 'Select your state'}
              </Text>
              <Ionicons name={showStateList ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
            </Pressable>
            {showStateList && (
              <View style={styles.stateList}>
                <ScrollView style={styles.stateScroll} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {US_STATES.map((state) => (
                    <Pressable
                      key={state}
                      style={[styles.stateOption, homeState === state && styles.stateOptionActive]}
                      onPress={() => { setHomeState(state); setShowStateList(false); }}
                    >
                      <Text style={[styles.stateOptionText, homeState === state && styles.stateOptionTextActive]}>
                        {state}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
            <TextInput
              style={[styles.input, { marginTop: spacing.sm }]}
              value={homeCity}
              onChangeText={setHomeCity}
              placeholder="City (e.g. Tampa)"
              placeholderTextColor={colors.textMuted}
              autoCorrect={false}
              maxLength={60}
            />
          </View>

          {/* Units */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Preferred Units</Text>
            <View style={styles.modeRow}>
              {(['imperial', 'metric'] as const).map((u) => (
                <Pressable
                  key={u}
                  style={[styles.modeBtn, units === u && styles.modeBtnActive]}
                  onPress={() => setUnits(u)}
                >
                  <Text style={[styles.modeBtnText, units === u && styles.modeBtnTextActive]}>
                    {u === 'imperial' ? 'Imperial (lbs, in, °F)' : 'Metric (kg, cm, °C)'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed, saving && styles.btnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.textLight} />
            ) : (
              <>
                <Text style={styles.btnText}>Save preferences</Text>
                <Ionicons name="checkmark" size={18} color={colors.textLight} />
              </>
            )}
          </Pressable>

          {/* Dev/Testing — only in __DEV__ */}
          {__DEV__ && (
            <View style={styles.testingSection}>
              <Text style={styles.testingTitle}>Testing</Text>
              <Text style={styles.testingHint}>
                Override location for QA. Live Conditions uses GPS by default.
              </Text>

              <View style={styles.testingRow}>
                <Text style={styles.testingLabel}>Ignore GPS (simulate no location)</Text>
                <Switch
                  value={ignoreGps}
                  onValueChange={(v) => setIgnoreGps(v)}
                  trackColor={{ false: colors.border, true: colors.sage + '80' }}
                  thumbColor={ignoreGps ? colors.sage : colors.surface}
                />
              </View>

              <Text style={styles.testingLabel}>Override location</Text>
              <View style={styles.presetRow}>
                {LOCATION_PRESETS.map((preset) => {
                  const isActive =
                    overrideLocation &&
                    Math.abs(overrideLocation.lat - preset.lat) < 0.001 &&
                    Math.abs(overrideLocation.lon - preset.lon) < 0.001;
                  return (
                    <Pressable
                      key={preset.label}
                      style={[styles.presetBtn, isActive && styles.presetBtnActive]}
                      onPress={() =>
                        setOverrideLocation(
                          isActive ? null : { lat: preset.lat, lon: preset.lon, label: preset.label }
                        )
                      }
                    >
                      <Text
                        style={[styles.presetBtnText, isActive && styles.presetBtnTextActive]}
                        numberOfLines={1}
                      >
                        {preset.label.split(' ')[0]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.customRow}>
                <TextInput
                  style={[styles.customInput, { flex: 1 }]}
                  value={customLat}
                  onChangeText={setCustomLat}
                  placeholder="Lat"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                />
                <TextInput
                  style={[styles.customInput, { flex: 1 }]}
                  value={customLon}
                  onChangeText={setCustomLon}
                  placeholder="Lon"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                />
                <TextInput
                  style={[styles.customInput, { flex: 1.5 }]}
                  value={customLabel}
                  onChangeText={setCustomLabel}
                  placeholder="Label"
                  placeholderTextColor={colors.textMuted}
                />
                <Pressable
                  style={({ pressed }) => [styles.customApplyBtn, pressed && styles.customApplyBtnPressed]}
                  onPress={() => {
                    const lat = parseFloat(customLat);
                    const lon = parseFloat(customLon);
                    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
                    setOverrideLocation({
                      lat,
                      lon,
                      label: customLabel.trim() || `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
                    });
                  }}
                >
                  <Text style={styles.customApplyBtnText}>Use</Text>
                </Pressable>
              </View>

              {overrideLocation && (
                <Pressable
                  style={({ pressed }) => [styles.clearOverrideBtn, pressed && styles.clearOverrideBtnPressed]}
                  onPress={async () => {
                    await clearOverride();
                    setCustomLat('');
                    setCustomLon('');
                    setCustomLabel('');
                  }}
                >
                  <Ionicons name="location-outline" size={14} color={colors.sage} />
                  <Text style={styles.clearOverrideBtnText}>Use GPS instead</Text>
                </Pressable>
              )}

              {overrideLocation && (
                <Text style={styles.currentOverride}>
                  Using: {overrideLocation.label} ({overrideLocation.lat.toFixed(2)}, {overrideLocation.lon.toFixed(2)})
                </Text>
              )}
            </View>
          )}

          <Pressable style={({ pressed }) => [styles.signOutBtn, pressed && styles.signOutBtnPressed]} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={18} color={colors.stone} />
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  kav: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },

  section: { marginBottom: spacing.xl },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs + 2,
  },
  sectionHint: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  readOnlyValue: {
    fontSize: 16,
    color: colors.textSecondary,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
  },

  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    fontSize: 16,
    color: colors.text,
  },

  modeRow: { flexDirection: 'row', gap: spacing.sm },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md - 2,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  modeBtnActive: { backgroundColor: colors.sage, borderColor: colors.sage },
  modeBtnText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  modeBtnTextActive: { color: colors.textLight },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.sm - 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.sageLight, borderColor: colors.sage },
  chipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: colors.sageDark, fontWeight: '600' },

  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
  },
  locationAutoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.sage,
    backgroundColor: colors.sageLight,
  },
  locationAutoBtnPressed: { backgroundColor: colors.sage + '30' },
  locationAutoBtnText: { fontSize: 12, fontWeight: '600', color: colors.sageDark },

  statePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
  },
  statePickerText: { fontSize: 16, color: colors.text },
  statePickerPlaceholder: { color: colors.textMuted },
  stateList: {
    marginTop: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  stateScroll: { maxHeight: 200 },
  stateOption: { paddingHorizontal: spacing.md, paddingVertical: spacing.md - 4 },
  stateOptionActive: { backgroundColor: colors.sageLight },
  stateOptionText: { fontSize: 15, color: colors.text },
  stateOptionTextActive: { color: colors.sageDark, fontWeight: '600' },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sage,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  btnPressed: { backgroundColor: colors.sageDark },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 16, fontWeight: '600', color: colors.textLight },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  signOutBtnPressed: { opacity: 0.7 },
  signOutText: { fontSize: 15, color: colors.stone, fontWeight: '500' },

  /* Testing section (__DEV__ only) */
  testingSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  testingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  testingHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  testingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  testingLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  presetBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetBtnActive: {
    backgroundColor: colors.sageLight,
    borderColor: colors.sage,
  },
  presetBtnText: { fontSize: 12, color: colors.textSecondary },
  presetBtnTextActive: { color: colors.sageDark, fontWeight: '600' },
  customRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  customInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    fontSize: 13,
    color: colors.text,
  },
  customApplyBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
    backgroundColor: colors.sage,
  },
  customApplyBtnPressed: { opacity: 0.8 },
  customApplyBtnText: { fontSize: 12, fontWeight: '600', color: colors.textLight },
  clearOverrideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  clearOverrideBtnPressed: { opacity: 0.7 },
  clearOverrideBtnText: { fontSize: 13, fontWeight: '600', color: colors.sage },
  currentOverride: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
