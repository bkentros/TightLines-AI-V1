import { useState, useCallback, useEffect, useRef } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import { useAuthStore } from '../../store/authStore';
import type { FishingMode } from '../../lib/types';
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

export default function OnboardingStep2() {
  const router = useRouter();
  const { setOnboardingPrefs, user } = useAuthStore();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [fishingMode, setFishingMode] = useState<FishingMode>('both');
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [homeState, setHomeState] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [showStateList, setShowStateList] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [locationLoading, setLocationLoading] = useState(false);

  // Pre-fill a username suggestion from the Apple/email display name
  useEffect(() => {
    if (!user) return;
    const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? '';
    if (name) {
      const suggested = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .slice(0, 30);
      if (suggested.length >= 3) {
        setUsername(suggested);
        checkUsernameValue(suggested);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkUsernameValue = useCallback(async (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', trimmed)
        .maybeSingle();
      setUsernameAvailable(data === null);
    } finally {
      setCheckingUsername(false);
    }
  }, []);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameAvailable(null);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      checkUsernameValue(value);
    }, 400);
  };

  const toggleSpecies = (species: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(species)
        ? prev.filter((s) => s !== species)
        : [...prev, species],
    );
  };

  const buildHomeRegion = () => {
    if (homeCity.trim() && homeState) {
      return `${homeCity.trim()}, ${homeState}`;
    }
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
        if (geo.region) {
          // Try to match full state name to abbreviation
          const stateAbbr = STATE_NAME_TO_ABBR[geo.region] ?? geo.region;
          if (US_STATES.includes(stateAbbr)) setHomeState(stateAbbr);
        }
        if (geo.city) setHomeCity(geo.city);
      }
    } catch {
      Alert.alert('Could not get location', 'Please enter your home region manually.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleContinue = async () => {
    const trimmedUsername = username.trim().toLowerCase();

    if (trimmedUsername.length < 3) {
      Alert.alert('Username required', 'Username must be at least 3 characters.');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(trimmedUsername)) {
      Alert.alert(
        'Invalid username',
        'Username may only contain letters, numbers, and underscores.',
      );
      return;
    }
    if (usernameAvailable === false) {
      Alert.alert('Username taken', 'Please choose a different username.');
      return;
    }
    if (!homeState) {
      Alert.alert('Home state required', 'Please select your home state.');
      return;
    }

    setLoading(true);
    try {
      // Final username uniqueness check before committing
      if (!user) throw new Error('No authenticated user');
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', trimmedUsername)
        .maybeSingle();

      if (existing) {
        Alert.alert('Username taken', 'Please choose a different username.');
        return;
      }

      setOnboardingPrefs({
        username: trimmedUsername,
        display_name: displayName.trim(),
        fishing_mode: fishingMode,
        target_species: selectedSpecies,
        home_region: buildHomeRegion(),
        home_state: homeState,
        home_city: homeCity.trim(),
        preferred_units: units,
      });

      router.push('/(onboarding)/step-3-location');
    } catch (err) {
      Alert.alert('Something went wrong', 'Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const usernameStatus = () => {
    const trimmed = username.trim();
    if (trimmed.length < 3) return null;
    if (checkingUsername) return 'checking';
    if (usernameAvailable === true) return 'available';
    if (usernameAvailable === false) return 'taken';
    return null;
  };

  const status = usernameStatus();

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
          {/* Back */}
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>

          {/* Progress */}
          <View style={styles.progress}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i === 1 && styles.progressDotActive,
                  i === 0 && styles.progressDotDone,
                ]}
              />
            ))}
          </View>

          <Text style={styles.title}>Your preferences</Text>
          <Text style={styles.subtitle}>
            This personalizes your very first AI recommendation.
          </Text>

          {/* Username */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Username</Text>
            <Text style={styles.sectionHint}>
              Public — visible on your profile and catch feed
            </Text>
            <View style={styles.usernameRow}>
              <TextInput
                style={[
                  styles.input,
                  styles.usernameInput,
                  status === 'taken' && styles.inputError,
                  status === 'available' && styles.inputSuccess,
                ]}
                value={username}
                onChangeText={handleUsernameChange}
                placeholder="e.g. redfish_brandon"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                maxLength={30}
              />
              <View style={styles.usernameStatus}>
                {status === 'checking' && (
                  <ActivityIndicator size="small" color={colors.sage} />
                )}
                {status === 'available' && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.sage}
                  />
                )}
                {status === 'taken' && (
                  <Ionicons name="close-circle" size={20} color="#E05C5C" />
                )}
              </View>
            </View>
            {status === 'taken' && (
              <Text style={styles.errorText}>Username is already taken.</Text>
            )}
            {status === 'available' && (
              <Text style={styles.successText}>Username is available!</Text>
            )}
          </View>

          {/* Display Name */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Display Name{' '}
              <Text style={styles.optional}>(optional)</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="e.g. Brandon K."
              placeholderTextColor={colors.textMuted}
              autoCorrect={false}
              returnKeyType="next"
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
                  style={[
                    styles.modeBtn,
                    fishingMode === mode.value && styles.modeBtnActive,
                  ]}
                  onPress={() => setFishingMode(mode.value)}
                >
                  <Ionicons
                    name={mode.icon as any}
                    size={16}
                    color={
                      fishingMode === mode.value
                        ? colors.textLight
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.modeBtnText,
                      fishingMode === mode.value && styles.modeBtnTextActive,
                    ]}
                  >
                    {mode.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Target Species */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Favorite Target Species{' '}
              <Text style={styles.optional}>(optional)</Text>
            </Text>
            <Text style={styles.sectionHint}>
              Pre-fills your first AI recommendation. Skip if you fish everything.
            </Text>
            <View style={styles.chipGrid}>
              {SPECIES_LIST.map((species) => {
                const active = selectedSpecies.includes(species);
                return (
                  <Pressable
                    key={species}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleSpecies(species)}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {species}
                    </Text>
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

            {/* State picker */}
            <Pressable
              style={styles.statePicker}
              onPress={() => setShowStateList((v) => !v)}
            >
              <Text
                style={[
                  styles.statePickerText,
                  !homeState && styles.statePickerPlaceholder,
                ]}
              >
                {homeState || 'Select your state'}
              </Text>
              <Ionicons
                name={showStateList ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.textMuted}
              />
            </Pressable>

            {showStateList && (
              <View style={styles.stateList}>
                <ScrollView
                  style={styles.stateScroll}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                >
                  {US_STATES.map((state) => (
                    <Pressable
                      key={state}
                      style={[
                        styles.stateOption,
                        homeState === state && styles.stateOptionActive,
                      ]}
                      onPress={() => {
                        setHomeState(state);
                        setShowStateList(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.stateOptionText,
                          homeState === state && styles.stateOptionTextActive,
                        ]}
                      >
                        {state}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* City input */}
            <TextInput
              style={[styles.input, { marginTop: spacing.sm }]}
              value={homeCity}
              onChangeText={setHomeCity}
              placeholder="City (e.g. Tampa)"
              placeholderTextColor={colors.textMuted}
              autoCorrect={false}
              returnKeyType="done"
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

          {/* Continue */}
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              pressed && styles.btnPressed,
              loading && styles.btnDisabled,
            ]}
            onPress={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textLight} />
            ) : (
              <>
                <Text style={styles.btnText}>Continue</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={colors.textLight}
                />
              </>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  kav: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  backBtn: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    alignSelf: 'flex-start',
  },

  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  progressDotActive: { backgroundColor: colors.sage, width: 24 },
  progressDotDone: { backgroundColor: colors.sage },

  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.text,
    marginBottom: spacing.xs,
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
    letterSpacing: 0.1,
  },
  sectionHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  optional: { fontWeight: '400', color: colors.textMuted },

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
  inputError: { borderColor: '#E05C5C' },
  inputSuccess: { borderColor: colors.sage },

  usernameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  usernameInput: { flex: 1 },
  usernameStatus: { width: 24, alignItems: 'center' },
  errorText: { fontSize: 12, color: '#E05C5C', marginTop: spacing.xs },
  successText: { fontSize: 12, color: colors.sage, marginTop: spacing.xs },

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
  modeBtnActive: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  modeBtnText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  modeBtnTextActive: { color: colors.textLight },

  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.sm - 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.sageLight,
    borderColor: colors.sage,
  },
  chipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: colors.sageDark, fontWeight: '600' },

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
  stateOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 4,
  },
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
  locationAutoBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.sageDark,
  },
});
