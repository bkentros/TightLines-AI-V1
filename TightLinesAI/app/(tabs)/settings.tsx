import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { paper, paperFonts, paperSpacing } from '../../lib/theme';
import { useAuthStore } from '../../store/authStore';
import { useDevTestingStore } from '../../store/devTestingStore';
import { getValidAccessToken, invokeEdgeFunction, supabase } from '../../lib/supabase';
import { clearOwnerFishCaches } from '../../lib/clearOwnerFishCaches';
import { hapticImpact, ImpactFeedbackStyle, hapticSelection } from '../../lib/safeHaptics';
import type { SubscriptionTier, UserProfile } from '../../lib/types';
import { isAdminEmail } from '../../lib/adminAccess';
import { getEffectiveTier } from '../../lib/subscription';
import type { FeedbackTopic } from '../../lib/feedback';
import {
  openStoreSubscriptionManagement,
  storeSubscriptionManagementLabel,
} from '../../lib/legalLinks';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
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

type NoticeTone = 'info' | 'success' | 'error';

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, user, setProfile, signOut } = useAuthStore();
  const {
    ignoreGps,
    overrideSubscriptionTier,
    load: loadDevTesting,
    setIgnoreGps,
    setOverrideSubscriptionTier,
  } = useDevTestingStore();

  const [homeState, setHomeState] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [usernameDraft, setUsernameDraft] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [showStateList, setShowStateList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [clearingCaches, setClearingCaches] = useState(false);
  const [tierModeSaving, setTierModeSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notice, setNotice] = useState<{
    title: string;
    message?: string;
    tone?: NoticeTone;
  } | null>(null);
  const canSeeTestingTools = isAdminEmail(user?.email);

  useEffect(() => {
    if (!profile) return;
    setHomeState(profile.home_state ?? '');
    setHomeCity(profile.home_city ?? '');
    setUsernameDraft(profile.username ?? '');
  }, [profile?.id, profile?.username]);

  useEffect(() => {
    if (canSeeTestingTools) loadDevTesting();
  }, [canSeeTestingTools, loadDevTesting]);

  const buildHomeRegion = () => {
    if (homeCity.trim() && homeState) return `${homeCity.trim()}, ${homeState}`;
    if (homeState) return homeState;
    return '';
  };

  const autoFillLocation = async () => {
    setNotice(null);
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setNotice({
          title: 'Location permission needed',
          message: 'Allow location access to fill your state and city, or enter them manually.',
          tone: 'error',
        });
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
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
      setNotice({
        title: 'Could not find your location',
        message: 'Please enter your home state and city manually.',
        tone: 'error',
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!user) return;
    setNotice(null);
    hapticImpact(ImpactFeedbackStyle.Medium);
    setSaving(true);
    try {
      const updates = {
        home_region: buildHomeRegion() || null,
        home_state: homeState || null,
        home_city: homeCity.trim() || null,
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
      setNotice({
        title: 'Location saved',
        message: 'Your home water location has been updated.',
        tone: 'success',
      });
    } catch {
      setNotice({
        title: 'Could not save',
        message: 'Please try again in a moment.',
        tone: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!user || !profile) return;

    const trimmedUsername = usernameDraft.trim().toLowerCase();
    if (trimmedUsername === profile.username) {
      setEditingUsername(false);
      return;
    }
    if (trimmedUsername.length < 3) {
      setNotice({
        title: 'Username too short',
        message: 'Use at least 3 characters.',
        tone: 'error',
      });
      return;
    }
    if (!/^[a-z0-9_]+$/.test(trimmedUsername)) {
      setNotice({
        title: 'Invalid username',
        message: 'Use letters, numbers, and underscores only.',
        tone: 'error',
      });
      return;
    }

    setNotice(null);
    hapticImpact(ImpactFeedbackStyle.Medium);
    setUsernameSaving(true);
    try {
      const { data: existing, error: lookupError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', trimmedUsername)
        .neq('id', user.id)
        .limit(1);

      if (lookupError) throw lookupError;
      if (existing && existing.length > 0) {
        setNotice({
          title: 'Username taken',
          message: 'Pick another handle and try again.',
          tone: 'error',
        });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: trimmedUsername,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as UserProfile);
      setEditingUsername(false);
      setNotice({
        title: 'Username saved',
        message: `Your handle is now @${trimmedUsername}.`,
        tone: 'success',
      });
    } catch {
      setNotice({
        title: 'Could not save username',
        message: 'Please try again in a moment.',
        tone: 'error',
      });
    } finally {
      setUsernameSaving(false);
    }
  };

  const handleClearCaches = async () => {
    setNotice(null);
    setClearingCaches(true);
    try {
      await clearOwnerFishCaches();
      setNotice({
        title: 'Caches cleared',
        message: 'Fresh fishing data will load the next time you open Home, Daily Read, or Tackle Box.',
        tone: 'success',
      });
    } catch {
      setNotice({
        title: 'Could not clear caches',
        message: 'Please try again in a moment.',
        tone: 'error',
      });
    } finally {
      setClearingCaches(false);
    }
  };

  const openSupportForm = (topic: FeedbackTopic) => {
    router.push({
      pathname: '/support',
      params: {
        topic,
        contextLines: JSON.stringify([
          `Tier: ${effectiveTier}`,
          `Home: ${buildHomeRegion() || 'not set'}`,
        ]),
      },
    });
  };

  const handleOpenStoreSubscriptions = async () => {
    setNotice(null);
    try {
      await openStoreSubscriptionManagement();
    } catch {
      setNotice({
        title: 'Could not open subscriptions',
        message: 'Open your App Store or Google Play account settings to manage or cancel your subscription.',
        tone: 'error',
      });
    }
  };

  const handleTestingTierChange = async (tier: SubscriptionTier) => {
    if (!user || !canSeeTestingTools) return;

    setNotice(null);
    hapticSelection();
    setTierModeSaving(true);

    try {
      await setOverrideSubscriptionTier(tier);
      setNotice({
        title: `${tier === 'free' ? 'Free' : 'Angler'} mode active`,
        message:
          'Testing mode is local to this device. Your real account tier was not changed.',
        tone: 'success',
      });
    } catch {
      setNotice({
        title: 'Could not update tier mode',
        message:
          'Testing mode did not save on this device. Try again before testing reports.',
        tone: 'error',
      });
    } finally {
      setTierModeSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setNotice({
        title: 'Confirm account deletion',
        message:
          'Tap Delete account again to permanently delete your FinFindr account and sign out. Store subscriptions continue until canceled from your App Store or Google Play account.',
        tone: 'error',
      });
      return;
    }

    setDeleting(true);
    try {
      const accessToken = await getValidAccessToken();
      await invokeEdgeFunction<{ ok: true }>('delete-account', {
        accessToken,
        body: {},
      });
      await signOut();
    } catch {
      setNotice({
        title: 'Could not delete account',
        message: 'Please try again in a moment.',
        tone: 'error',
      });
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (!profile) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={paper.dashboardBlue} />
            <Text style={styles.loadingText}>READING YOUR PROFILE...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const effectiveTier = getEffectiveTier(
    profile,
    overrideSubscriptionTier ?? null,
    canSeeTestingTools,
    user?.email,
  );

  return (
    <View style={styles.root}>
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
            <Text style={styles.pageEyebrow}>FINFINDR SETTINGS</Text>
            <Text style={styles.title}>Settings.</Text>
            <Text style={styles.subtitle}>Account basics, membership, support, and device data.</Text>

            {notice ? (
              <NoticeCard
                title={notice.title}
                message={notice.message}
                tone={notice.tone}
                onDismiss={() => setNotice(null)}
              />
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>ACCOUNT</Text>
              <View style={styles.summaryList}>
                <SettingsSummaryRow
                  icon="mail-outline"
                  title="Email"
                  value={user?.email ?? 'Not available'}
                />
                <SettingsSummaryRow
                  icon="person-circle-outline"
                  title="Username"
                  value={`@${profile.username}`}
                  actionLabel="Edit"
                  onAction={() => {
                    setUsernameDraft(profile.username ?? '');
                    setEditingUsername(true);
                  }}
                />
                {editingUsername ? (
                  <View style={styles.usernameEditor}>
                    <TextInput
                      style={[styles.input, styles.usernameInput]}
                      value={usernameDraft}
                      onChangeText={setUsernameDraft}
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder="username"
                      placeholderTextColor={paper.dashboardMuted}
                    />
                    <Pressable
                      style={({ pressed }) => [
                        styles.inlineButton,
                        pressed && styles.smallActionPressed,
                        usernameSaving && styles.btnDisabled,
                      ]}
                      onPress={handleSaveUsername}
                      disabled={usernameSaving}
                    >
                      {usernameSaving ? (
                        <ActivityIndicator size="small" color={paper.dashboardBlue} />
                      ) : (
                        <Text style={styles.inlineButtonText}>SAVE</Text>
                      )}
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.inlineButton,
                        styles.inlineButtonGhost,
                        pressed && styles.smallActionPressed,
                      ]}
                      onPress={() => {
                        setUsernameDraft(profile.username ?? '');
                        setEditingUsername(false);
                      }}
                      disabled={usernameSaving}
                    >
                      <Text style={styles.inlineButtonText}>CANCEL</Text>
                    </Pressable>
                  </View>
                ) : null}
                <SettingsSummaryRow
                  icon="card-outline"
                  title="Membership"
                  value={effectiveTier.replace('_', ' ')}
                  detail={
                    canSeeTestingTools && overrideSubscriptionTier
                      ? `Dev override. Real tier: ${profile.subscription_tier}`
                      : 'Current account tier'
                  }
                />
              </View>
              <PrimaryAction
                label="Manage membership"
                icon="card-outline"
                onPress={() => router.push('/subscribe')}
                variant="secondary"
              />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionLabelRow}>
                <Text style={styles.sectionLabel}>HOME LOCATION</Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.smallAction,
                    pressed && styles.smallActionPressed,
                    locationLoading && styles.btnDisabled,
                  ]}
                  onPress={autoFillLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <ActivityIndicator size="small" color={paper.dashboardBlue} />
                  ) : (
                    <Ionicons name="location-outline" size={13} color={paper.dashboardBlue} />
                  )}
                  <Text style={styles.smallActionText}>
                    {locationLoading ? 'FINDING...' : 'USE LOCATION'}
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.sectionHint}>Used to personalize fishing context.</Text>

              <View style={styles.locationFields}>
                <Pressable
                  style={styles.statePicker}
                  onPress={() => {
                    hapticSelection();
                    setShowStateList((v) => !v);
                  }}
                >
                  <Text
                    style={[styles.statePickerText, !homeState && styles.statePickerPlaceholder]}
                  >
                    {homeState || 'State'}
                  </Text>
                  <Ionicons
                    name={showStateList ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={paper.dashboardInk}
                  />
                </Pressable>

                <TextInput
                  style={styles.input}
                  value={homeCity}
                  onChangeText={setHomeCity}
                  placeholder="City (optional)"
                  placeholderTextColor={paper.dashboardInk + '70'}
                  autoCorrect={false}
                  maxLength={60}
                />
              </View>

              {showStateList && (
                <View style={styles.stateList}>
                  <ScrollView style={styles.stateScroll} nestedScrollEnabled>
                    {US_STATES.map((state) => (
                      <Pressable
                        key={state}
                        style={[styles.stateOption, homeState === state && styles.stateOptionActive]}
                        onPress={() => {
                          hapticSelection();
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

              <PrimaryAction
                label="Save location"
                icon="checkmark"
                loading={saving}
                onPress={handleSaveLocation}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>CONTACT & FEEDBACK</Text>
              <Text style={styles.sectionHint}>
                Send support requests, bug reports, or feature ideas with account context attached.
              </Text>
              <View style={styles.contactList}>
                <ContactRow
                  icon="chatbubble-ellipses-outline"
                  title="Contact support"
                  subtitle="Account, app, or launch questions."
                  onPress={() => openSupportForm('general')}
                />
                <ContactRow
                  icon="bug-outline"
                  title="Report a bug"
                  subtitle="Broken screens, wrong reads, or weird behavior."
                  onPress={() => openSupportForm('bug')}
                />
                <ContactRow
                  icon="bulb-outline"
                  title="Suggest a feature"
                  subtitle="Coverage, workflow, or fishing-read ideas."
                  onPress={() => openSupportForm('feature')}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>LEGAL & SAFETY</Text>
              <Text style={styles.sectionHint}>
                Terms, privacy, support, and fishing-condition safety notes for review and launch.
              </Text>
              <View style={styles.contactList}>
                <ContactRow
                  icon="document-text-outline"
                  title="Terms of Service"
                  subtitle="Account, subscription, and usage terms."
                  onPress={() => router.push('/legal/terms')}
                />
                <ContactRow
                  icon="shield-checkmark-outline"
                  title="Privacy Policy"
                  subtitle="Data, permissions, purchases, and deletion."
                  onPress={() => router.push('/legal/privacy')}
                />
                <ContactRow
                  icon="warning-outline"
                  title="Safety Notice"
                  subtitle="Fishing recommendations are informational."
                  onPress={() => router.push('/legal/safety')}
                />
                <ContactRow
                  icon="chatbubble-ellipses-outline"
                  title="Support"
                  subtitle="Contact FinFindr support from the app."
                  onPress={() => openSupportForm('general')}
                />
              </View>
            </View>

            {canSeeTestingTools ? (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>DEVICE STORAGE</Text>
                <Text style={styles.sectionHint}>
                  Clears saved Daily Read, forecast, live conditions, and Tackle Box data on this device.
                </Text>
                <PrimaryAction
                  label="Clear cache"
                  icon="trash-outline"
                  loading={clearingCaches}
                  onPress={handleClearCaches}
                  variant="secondary"
                />
              </View>
            ) : null}

            {canSeeTestingTools && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>TIER MODE</Text>
                <Text style={styles.sectionHint}>
                  Switch the app and report backend between Free and Angler for testing tier gating.
                </Text>

                <Text style={styles.testingLabel}>Display as</Text>
                <View style={styles.presetRow}>
                  {(['free', 'angler'] as const).map((tier) => {
                    const label = tier === 'free' ? 'Free' : 'Angler';
                    const active = effectiveTier === tier;
                    return (
                      <Pressable
                        key={String(label)}
                        style={[
                          styles.presetBtn,
                          active && styles.presetBtnActive,
                          tierModeSaving && styles.btnDisabled,
                        ]}
                        onPress={() => handleTestingTierChange(tier)}
                        disabled={tierModeSaving}
                      >
                        <Text style={[styles.presetBtnText, active && styles.presetBtnTextActive]}>
                          {label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.testingRow}>
                  <Text style={styles.testingLabel}>Ignore GPS</Text>
                  <Switch
                    value={ignoreGps}
                    onValueChange={(v) => setIgnoreGps(v)}
                    trackColor={{ false: paper.dashboardHair, true: paper.dashboardBlue }}
                    thumbColor={paper.dashboardWhite}
                  />
                </View>
              </View>
            )}

            <PrimaryAction
              label="Sign out"
              icon="log-out-outline"
              onPress={() => signOut()}
              variant="secondary"
            />

            <View style={styles.dangerSection}>
              <Text style={styles.dangerTitle}>DELETE ACCOUNT</Text>
              <Text style={styles.dangerCopy}>
                Permanently removes your FinFindr account. This cannot be undone. Deleting your
                FinFindr account does not cancel App Store billing, so cancel any active
                auto-renewing subscription from your store account first.
              </Text>
              <PrimaryAction
                label={storeSubscriptionManagementLabel()}
                icon="open-outline"
                onPress={handleOpenStoreSubscriptions}
                variant="secondary"
              />
              <PrimaryAction
                label={confirmDelete ? 'Delete account forever' : 'Delete account'}
                icon="trash-outline"
                loading={deleting}
                onPress={handleDeleteAccount}
                variant="danger"
              />
              {confirmDelete ? (
                <Pressable
                  style={styles.cancelDelete}
                  onPress={() => {
                    setConfirmDelete(false);
                    setNotice(null);
                  }}
                >
                  <Text style={styles.cancelDeleteText}>CANCEL DELETE</Text>
                </Pressable>
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function ContactRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.contactRow, pressed && styles.contactRowPressed]}
      onPress={onPress}
    >
      <View style={styles.contactIcon}>
        <Ionicons name={icon} size={16} color={paper.dashboardBlue} />
      </View>
      <View style={styles.contactCopy}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={15} color={paper.dashboardMuted} />
    </Pressable>
  );
}

function SettingsSummaryRow({
  icon,
  title,
  value,
  detail,
  actionLabel,
  onAction,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  detail?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryIcon}>
        <Ionicons name={icon} size={16} color={paper.dashboardBlue} />
      </View>
      <View style={styles.summaryCopy}>
        <Text style={styles.summaryTitle}>{title}</Text>
        {detail ? <Text style={styles.summaryDetail}>{detail}</Text> : null}
      </View>
      <View style={styles.summaryTrailing}>
        <Text style={styles.summaryValue} numberOfLines={1}>{value}</Text>
        {actionLabel && onAction ? (
          <Pressable onPress={onAction} hitSlop={8}>
            <Text style={styles.summaryAction}>{actionLabel.toUpperCase()}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function NoticeCard({
  title,
  message,
  tone = 'info',
  onDismiss,
}: {
  title: string;
  message?: string;
  tone?: NoticeTone;
  onDismiss: () => void;
}) {
  const color =
    tone === 'success' ? paper.bandPrime
    : tone === 'error' ? paper.bandTough
    : paper.dashboardBlue;
  return (
    <View style={[styles.notice, { borderColor: color }]}>
      <View style={styles.noticeHeader}>
        <Ionicons
          name={tone === 'success' ? 'checkmark-circle-outline' : tone === 'error' ? 'alert-circle-outline' : 'information-circle-outline'}
          size={18}
          color={color}
        />
        <Text style={styles.noticeTitle}>{title}</Text>
        <Pressable onPress={onDismiss} hitSlop={8}>
          <Ionicons name="close" size={16} color={paper.dashboardInk} />
        </Pressable>
      </View>
      {message ? <Text style={styles.noticeMessage}>{message}</Text> : null}
    </View>
  );
}

function PrimaryAction({
  label,
  icon,
  loading,
  onPress,
  variant = 'primary',
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionBtn,
        variant === 'secondary' && styles.actionBtnSecondary,
        variant === 'danger' && styles.actionBtnDanger,
        pressed && !loading && styles.actionBtnPressed,
        loading && styles.btnDisabled,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? paper.dashboardInk : '#FFFFFF'} />
      ) : (
        <>
          <Ionicons
            name={icon}
            size={16}
            color={variant === 'secondary' ? paper.dashboardInk : '#FFFFFF'}
          />
          <Text
            style={[
              styles.actionBtnText,
              variant === 'secondary' && styles.actionBtnTextSecondary,
            ]}
          >
            {label.toUpperCase()}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper.dashboardCream },
  safe: { flex: 1 },
  kav: { flex: 1 },
  scroll: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.xxl,
    gap: paperSpacing.md,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.dashboardCream,
  },
  loadingText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.2,
    color: paper.dashboardInk,
    opacity: 0.6,
  },
  pageEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 2,
    color: paper.dashboardBlue,
    fontWeight: '700',
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
  },
  subtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.dashboardInk,
    opacity: 0.72,
    lineHeight: 20,
    marginBottom: paperSpacing.sm,
  },
  section: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    padding: paperSpacing.sm + 2,
    gap: paperSpacing.xs + 2,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
  },
  sectionLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10.5,
    color: paper.dashboardBlue,
    letterSpacing: 2,
  },
  sectionHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.68,
    lineHeight: 18,
  },
  summaryList: {
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 10,
    overflow: 'hidden',
  },
  summaryRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: paper.dashboardLine,
    backgroundColor: '#F8FAFC',
  },
  summaryIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  summaryCopy: {
    flex: 1,
    minWidth: 0,
  },
  summaryTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13.5,
    color: paper.dashboardInk,
  },
  summaryDetail: {
    marginTop: 1,
    fontFamily: paperFonts.displayItalic,
    fontSize: 11.5,
    color: paper.dashboardInk,
    opacity: 0.6,
  },
  summaryValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12.5,
    color: paper.dashboardInk,
    textAlign: 'right',
  },
  summaryTrailing: {
    maxWidth: '52%',
    alignItems: 'flex-end',
    gap: 3,
  },
  summaryAction: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 1.2,
  },
  usernameEditor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
  },
  usernameInput: {
    minHeight: 42,
  },
  inlineButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: paperSpacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardWhite,
  },
  inlineButtonGhost: {
    borderColor: paper.dashboardLine,
  },
  inlineButtonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 1.3,
  },
  readOnlyValue: {
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.dashboardInk,
    backgroundColor: '#F6F9FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md - 2,
    textTransform: 'capitalize',
  },
  input: {
    flex: 1,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm,
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.dashboardInk,
  },
  smallAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardWhite,
  },
  smallActionPressed: { backgroundColor: '#F6F9FB' },
  smallActionText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 1.6,
  },
  statePicker: {
    width: 104,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm,
  },
  statePickerText: {
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.dashboardInk,
  },
  locationFields: {
    flexDirection: 'row',
    gap: paperSpacing.xs + 2,
    alignItems: 'center',
  },
  statePickerPlaceholder: { opacity: 0.55 },
  stateList: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    overflow: 'hidden',
  },
  stateScroll: { maxHeight: 200 },
  stateOption: {
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md - 4,
  },
  stateOptionActive: { backgroundColor: '#F6F9FB' },
  stateOptionText: {
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.dashboardInk,
  },
  stateOptionTextActive: {
    color: paper.dashboardBlue,
    fontFamily: paperFonts.bodyBold,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.dashboardInk,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    borderRadius: 10,
    paddingVertical: paperSpacing.sm + 2,
    marginTop: paperSpacing.xs,
  },
  actionBtnSecondary: {
    backgroundColor: paper.dashboardWhite,
    borderColor: paper.dashboardLine,
  },
  actionBtnDanger: {
    backgroundColor: paper.bandTough,
    borderColor: paper.bandTough,
  },
  actionBtnPressed: { opacity: 0.85 },
  actionBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 2.2,
  },
  actionBtnTextSecondary: {
    color: paper.dashboardInk,
  },
  btnDisabled: { opacity: 0.5 },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: paperSpacing.xs + 2,
  },
  presetBtn: {
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.xs + 1,
    borderRadius: 999,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  presetBtnActive: {
    backgroundColor: paper.dashboardInk,
    borderColor: paper.dashboardInk,
  },
  presetBtnText: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 12,
    color: paper.dashboardInk,
    textTransform: 'capitalize',
  },
  presetBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: paperFonts.bodyBold,
  },
  testingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testingLabel: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    color: paper.dashboardInk,
    opacity: 0.82,
  },
  contactList: {
    gap: paperSpacing.xs,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 10,
    backgroundColor: paper.dashboardWhite,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.xs + 4,
  },
  contactRowPressed: { backgroundColor: '#F6F9FB' },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F9FB',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  contactCopy: {
    flex: 1,
    minWidth: 0,
  },
  contactTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13.5,
    color: paper.dashboardInk,
  },
  contactSubtitle: {
    marginTop: 2,
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.dashboardInk,
    opacity: 0.66,
  },
  notice: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: paperSpacing.md,
    gap: paperSpacing.xs,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs + 2,
  },
  noticeTitle: {
    flex: 1,
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.dashboardInk,
  },
  noticeMessage: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.75,
    lineHeight: 18,
  },
  dangerSection: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    padding: paperSpacing.sm + 2,
    gap: paperSpacing.sm,
  },
  dangerTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.bandTough,
    letterSpacing: 2.2,
  },
  dangerCopy: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.72,
    lineHeight: 18,
  },
  cancelDelete: {
    alignItems: 'center',
    paddingVertical: paperSpacing.sm,
  },
  cancelDeleteText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2,
  },
});
