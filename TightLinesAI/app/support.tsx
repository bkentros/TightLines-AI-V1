import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PaperNavHeader, TopographicLines } from '../components/paper';
import { paper, paperFonts, paperSpacing } from '../lib/theme';
import { useAuthStore } from '../store/authStore';
import { submitFeedback } from '../lib/feedback';
import type { FeedbackSentiment, FeedbackTopic } from '../lib/feedback';

const TOPIC_OPTIONS: { topic: FeedbackTopic; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { topic: 'general', label: 'Support', icon: 'chatbubble-ellipses-outline' },
  { topic: 'bug', label: 'Bug', icon: 'bug-outline' },
  { topic: 'feature', label: 'Idea', icon: 'bulb-outline' },
  { topic: 'subscription', label: 'Billing', icon: 'card-outline' },
];

const VALID_TOPICS: FeedbackTopic[] = [
  'general',
  'bug',
  'feature',
  'subscription',
  'todays_bite',
  'tackle_box',
  'water_read',
  'smart_log',
];

const TOPIC_TITLE: Record<FeedbackTopic, string> = {
  general: 'Contact support',
  bug: 'Report a bug',
  feature: 'Suggest a feature',
  subscription: 'Subscription help',
  todays_bite: "Today's Bite feedback",
  tackle_box: 'Tackle Box feedback',
  water_read: 'Water Read feedback',
  smart_log: 'Smart Log feedback',
};

function parseTopic(value: string | string[] | undefined): FeedbackTopic {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && VALID_TOPICS.includes(raw as FeedbackTopic) ? raw as FeedbackTopic : 'general';
}

function parseSentiment(value: string | string[] | undefined): FeedbackSentiment | null {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'looks_right' || raw === 'needs_work' || raw === 'note' ? raw : null;
}

function parseContextLines(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line): line is string => typeof line === 'string' && line.trim().length > 0);
  } catch {
    return [];
  }
}

export default function SupportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    topic?: string;
    featureName?: string;
    sentiment?: string;
    contextLines?: string;
  }>();
  const { profile, user } = useAuthStore();
  const [topic, setTopic] = useState<FeedbackTopic>(() => parseTopic(params.topic));
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ title: string; message?: string; tone: 'success' | 'error' } | null>(null);

  const featureName = typeof params.featureName === 'string' ? params.featureName : null;
  const sentiment = parseSentiment(params.sentiment);
  const contextLines = useMemo(() => parseContextLines(params.contextLines), [params.contextLines]);
  const title = featureName ? `${featureName} feedback` : TOPIC_TITLE[topic];
  const canSubmit = message.trim().length >= 8 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setNotice(null);
    try {
      await submitFeedback({
        topic,
        message: message.trim(),
        sentiment,
        featureName,
        contextLines,
      });
      setMessage('');
      setNotice({
        title: 'Sent',
        message: 'Thanks. Your note is saved with your account and app context.',
        tone: 'success',
      });
    } catch {
      setNotice({
        title: 'Could not send',
        message: 'Please check your connection and try again.',
        tone: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · SUPPORT"
          eyebrowColor={paper.dashboardBlueLight}
          title="CONTACT"
          onBack={() => router.back()}
        />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <TopographicLines
                style={StyleSheet.absoluteFill}
                color={paper.dashboardBlue}
                count={4}
              />
              <Text style={styles.eyebrow}>SUPPORT DESK</Text>
              <Text style={styles.title}>{title}.</Text>
              <Text style={styles.subtitle}>
                Write the useful part. FinFindr will attach your account, device, tier, and screen context.
              </Text>
            </View>

            {notice ? (
              <View style={[styles.notice, notice.tone === 'error' && styles.noticeError]}>
                <Ionicons
                  name={notice.tone === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'}
                  size={18}
                  color={notice.tone === 'success' ? paper.bandPrime : paper.bandTough}
                />
                <View style={styles.noticeCopy}>
                  <Text style={styles.noticeTitle}>{notice.title}</Text>
                  {notice.message ? <Text style={styles.noticeMessage}>{notice.message}</Text> : null}
                </View>
              </View>
            ) : null}

            {!featureName ? (
              <View style={styles.topicGrid}>
                {TOPIC_OPTIONS.map((option) => {
                  const active = option.topic === topic;
                  return (
                    <Pressable
                      key={option.topic}
                      style={({ pressed }) => [
                        styles.topicChip,
                        active && styles.topicChipActive,
                        pressed && styles.topicChipPressed,
                      ]}
                      onPress={() => setTopic(option.topic)}
                    >
                      <Ionicons
                        name={option.icon}
                        size={15}
                        color={active ? '#FFFFFF' : paper.dashboardInk}
                      />
                      <Text style={[styles.topicChipText, active && styles.topicChipTextActive]}>
                        {option.label.toUpperCase()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            <View style={styles.formCard}>
              <Text style={styles.fieldLabel}>MESSAGE</Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                style={styles.messageInput}
                placeholder="Tell us what happened, what felt off, or what would make this better."
                placeholderTextColor="rgba(10,27,46,0.42)"
                multiline
                textAlignVertical="top"
                maxLength={4000}
              />
              <View style={styles.formFooter}>
                <Text style={styles.countText}>{message.length}/4000</Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.submitBtn,
                    !canSubmit && styles.submitBtnDisabled,
                    pressed && canSubmit && styles.submitBtnPressed,
                  ]}
                  onPress={handleSubmit}
                  disabled={!canSubmit}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.submitBtnText}>SEND</Text>
                      <Ionicons name="send" size={13} color="#FFFFFF" />
                    </>
                  )}
                </Pressable>
              </View>
            </View>

            <View style={styles.contextCard}>
              <Text style={styles.contextTitle}>ATTACHED AUTOMATICALLY</Text>
              <ContextLine label="Email" value={user?.email ?? 'Signed-in account'} />
              <ContextLine label="Username" value={profile?.username ? `@${profile.username}` : 'Not set'} />
              <ContextLine label="Tier" value={profile?.subscription_tier ?? 'Unknown'} />
              <ContextLine label="Home" value={profile?.home_region ?? 'Not set'} />
              <ContextLine label="Device" value={Platform.OS} />
              {featureName ? <ContextLine label="Feature" value={featureName} /> : null}
              {sentiment ? <ContextLine label="Signal" value={sentiment.replace('_', ' ')} /> : null}
              {contextLines.map((line) => (
                <Text key={line} style={styles.contextFreeLine} numberOfLines={2}>
                  {line}
                </Text>
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

function ContextLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.contextLine}>
      <Text style={styles.contextLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.contextValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.dashboardCream },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.xxl,
    gap: paperSpacing.md,
  },
  hero: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    padding: paperSpacing.md,
    overflow: 'hidden',
    gap: paperSpacing.xs,
  },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    color: paper.dashboardInk,
    letterSpacing: 0,
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.dashboardInk,
    lineHeight: 20,
    opacity: 0.72,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.bandPrime,
    borderRadius: 12,
    padding: paperSpacing.md,
  },
  noticeError: { borderColor: paper.bandTough },
  noticeCopy: { flex: 1, minWidth: 0 },
  noticeTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.dashboardInk,
  },
  noticeMessage: {
    marginTop: 2,
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.72,
    lineHeight: 18,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: paperSpacing.xs,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 999,
    backgroundColor: paper.dashboardWhite,
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm,
  },
  topicChipActive: {
    backgroundColor: paper.dashboardInk,
    borderColor: paper.dashboardInk,
  },
  topicChipPressed: { opacity: 0.85 },
  topicChipText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    letterSpacing: 1.4,
  },
  topicChipTextActive: { color: '#FFFFFF' },
  formCard: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    padding: paperSpacing.md,
    gap: paperSpacing.sm,
  },
  fieldLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2,
  },
  messageInput: {
    minHeight: 170,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: '#F6F9FB',
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md,
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.dashboardInk,
    lineHeight: 21,
  },
  formFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
  },
  countText: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.dashboardMuted,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.xs,
    minWidth: 92,
    borderRadius: 12,
    backgroundColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm + 2,
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnPressed: { opacity: 0.85 },
  submitBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  contextCard: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    padding: paperSpacing.md,
    gap: paperSpacing.xs,
  },
  contextTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2,
    marginBottom: paperSpacing.xs,
  },
  contextLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.md,
  },
  contextLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardMuted,
    letterSpacing: 1.4,
  },
  contextValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: paperFonts.bodyBold,
    fontSize: 12.5,
    color: paper.dashboardInk,
    textTransform: 'capitalize',
  },
  contextFreeLine: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    color: paper.dashboardInk,
    opacity: 0.72,
    lineHeight: 17,
  },
});
